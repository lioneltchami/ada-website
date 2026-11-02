import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const outboxMocks = vi.hoisted(() => ({
  claimDonationEmailOutbox: vi.fn(),
  completeDonationEmailOutbox: vi.fn(),
  failDonationEmailOutbox: vi.fn(),
  sendResendEmailPayload: vi.fn(),
}));

vi.mock("../src/lib/donations", () => ({
  claimDonationEmailOutbox: outboxMocks.claimDonationEmailOutbox,
  completeDonationEmailOutbox: outboxMocks.completeDonationEmailOutbox,
  failDonationEmailOutbox: outboxMocks.failDonationEmailOutbox,
}));

vi.mock("../src/lib/email", () => ({
  sendResendEmailPayload: outboxMocks.sendResendEmailPayload,
}));

type Job = {
  id: string;
  donation_id: string | null;
  kind: "donor_receipt" | "staff_follow_up" | "follow_up_digest";
  idempotency_key: string;
  email_payload: Record<string, unknown>;
  payload_sha256: string;
  status: "pending" | "processing" | "sent" | "needs_review";
  attempt_count: number;
  first_attempt_at: string | null;
  lease_token: string | null;
};

const emailPayload = {
  from: "ADA <noreply@apotidev.org>",
  to: "fixture@example.invalid",
  subject: "Fixture receipt",
  html: "<p>Paid date: 2026-10-01</p>",
  attachments: [{ filename: "receipt.pdf", content: "ZmFrZQ==" }],
};

const payloadHash =
  "093e3b6fabc98fc7a5aae476670c2cf7706fff87cc3e0952c10ef0a57b3e5645";

function claimedJob(overrides: Partial<Job> = {}): Job {
  return {
    id: "outbox-1",
    donation_id: "donation-1",
    kind: "donor_receipt",
    idempotency_key: "ada:v1:donation:donation-1:receipt",
    email_payload: emailPayload,
    payload_sha256: payloadHash,
    status: "processing",
    attempt_count: 1,
    first_attempt_at: "2026-11-02T10:00:00.000Z",
    lease_token: "lease-1",
    ...overrides,
  };
}

describe("donation email outbox worker", () => {
  beforeEach(() => {
    vi.resetModules();
    outboxMocks.claimDonationEmailOutbox.mockResolvedValue([]);
    outboxMocks.completeDonationEmailOutbox.mockResolvedValue(true);
    outboxMocks.failDonationEmailOutbox.mockResolvedValue("pending");
    outboxMocks.sendResendEmailPayload.mockResolvedValue({
      success: true,
      providerMessageId: "email-provider-id",
    });
  });

  afterEach(() => {
    vi.resetModules();
    Object.values(outboxMocks).forEach((mock) => mock.mockReset());
  });

  it("recovers a job after a worker crashes after claiming but before sending", async () => {
    outboxMocks.claimDonationEmailOutbox
      .mockResolvedValueOnce([claimedJob()])
      .mockResolvedValueOnce([
        claimedJob({ attempt_count: 2, lease_token: "lease-2" }),
      ]);
    const { claimDonationEmailOutbox } = await import("../src/lib/donations");
    const { processDonationEmailOutbox } =
      await import("../src/lib/donation-email-outbox");

    // The first worker claims the row and crashes before it reaches the provider.
    const abandoned = await claimDonationEmailOutbox({ limit: 1 });
    expect(abandoned).toHaveLength(1);
    expect(outboxMocks.sendResendEmailPayload).not.toHaveBeenCalled();

    // After the lease expires, a later worker receives a new lease and sends it.
    const result = await processDonationEmailOutbox({ limit: 1 });
    expect(result).toMatchObject({ claimed: 1, sent: 1 });
    expect(outboxMocks.sendResendEmailPayload).toHaveBeenCalledWith(
      emailPayload,
      "ada:v1:donation:donation-1:receipt",
    );
    expect(outboxMocks.completeDonationEmailOutbox).toHaveBeenCalledWith({
      outboxId: "outbox-1",
      leaseToken: "lease-2",
      providerMessageId: "email-provider-id",
    });
  });

  it("does not send twice when concurrent workers race for one claim", async () => {
    let claimed = false;
    outboxMocks.claimDonationEmailOutbox.mockImplementation(async () => {
      if (claimed) return [];
      claimed = true;
      return [claimedJob()];
    });
    const { processDonationEmailOutbox } =
      await import("../src/lib/donation-email-outbox");

    const results = await Promise.all([
      processDonationEmailOutbox({ limit: 1 }),
      processDonationEmailOutbox({ limit: 1 }),
    ]);

    expect(results.reduce((sum, item) => sum + item.claimed, 0)).toBe(1);
    expect(outboxMocks.sendResendEmailPayload).toHaveBeenCalledTimes(1);
    expect(outboxMocks.completeDonationEmailOutbox).toHaveBeenCalledTimes(1);
  });

  it("retries the byte-stable payload with the same key after provider success and DB completion failure", async () => {
    outboxMocks.claimDonationEmailOutbox
      .mockResolvedValueOnce([claimedJob()])
      .mockResolvedValueOnce([
        claimedJob({ attempt_count: 2, lease_token: "lease-2" }),
      ]);
    outboxMocks.completeDonationEmailOutbox
      .mockRejectedValueOnce(new Error("DB completion response lost"))
      .mockResolvedValueOnce(true);
    const { processDonationEmailOutbox } =
      await import("../src/lib/donation-email-outbox");

    const first = await processDonationEmailOutbox({ limit: 1 });
    expect(first).toMatchObject({ sent: 0, deferred: 1 });
    expect(outboxMocks.failDonationEmailOutbox).toHaveBeenCalledWith({
      outboxId: "outbox-1",
      leaseToken: "lease-1",
      error: "Email delivery or completion state could not be confirmed",
      needsReview: false,
    });

    const second = await processDonationEmailOutbox({ limit: 1 });
    expect(second).toMatchObject({ sent: 1 });
    expect(outboxMocks.sendResendEmailPayload).toHaveBeenCalledTimes(2);
    expect(outboxMocks.sendResendEmailPayload).toHaveBeenNthCalledWith(
      1,
      emailPayload,
      "ada:v1:donation:donation-1:receipt",
    );
    expect(outboxMocks.sendResendEmailPayload).toHaveBeenNthCalledWith(
      2,
      emailPayload,
      "ada:v1:donation:donation-1:receipt",
    );
  });

  it("does not auto-complete a simulated send without a provider key", async () => {
    outboxMocks.claimDonationEmailOutbox.mockResolvedValue([claimedJob()]);
    outboxMocks.sendResendEmailPayload.mockResolvedValue({
      success: true,
      simulated: true,
    });
    const { processDonationEmailOutbox } =
      await import("../src/lib/donation-email-outbox");

    const result = await processDonationEmailOutbox({ limit: 1 });

    expect(result).toMatchObject({ sent: 0, deferred: 1 });
    expect(outboxMocks.completeDonationEmailOutbox).not.toHaveBeenCalled();
    expect(outboxMocks.failDonationEmailOutbox).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.stringContaining("simulated send must not mark job sent"),
      }),
    );
  });

  it("fails closed on a payload hash mismatch and requires manual review", async () => {
    outboxMocks.claimDonationEmailOutbox.mockResolvedValue([
      claimedJob({ payload_sha256: "b".repeat(64) }),
    ]);
    const { processDonationEmailOutbox } =
      await import("../src/lib/donation-email-outbox");

    const result = await processDonationEmailOutbox({ limit: 1 });

    expect(result).toMatchObject({ sent: 0, deferred: 1 });
    expect(outboxMocks.sendResendEmailPayload).not.toHaveBeenCalled();
    expect(outboxMocks.failDonationEmailOutbox).toHaveBeenCalledWith(
      expect.objectContaining({ needsReview: true }),
    );
  });

  it("records provider idempotency payload conflicts for manual review", async () => {
    outboxMocks.claimDonationEmailOutbox.mockResolvedValue([claimedJob()]);
    outboxMocks.sendResendEmailPayload.mockRejectedValue(
      new Error("Email send failed: 409 invalid_idempotent_request"),
    );
    const { processDonationEmailOutbox } =
      await import("../src/lib/donation-email-outbox");

    const result = await processDonationEmailOutbox({ limit: 1 });

    expect(result).toMatchObject({ sent: 0, deferred: 1 });
    expect(outboxMocks.failDonationEmailOutbox).toHaveBeenCalledWith(
      expect.objectContaining({ needsReview: true }),
    );
  });
});
