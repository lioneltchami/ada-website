import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { readFile } from "node:fs/promises";

const supabase = vi.hoisted(() => ({
  createClient: vi.fn(),
  rpc: vi.fn(),
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: supabase.createClient,
}));

const baseDonation = {
  stripe_payment_intent_id: "pi_fixture",
  stripe_invoice_id: null,
  stripe_subscription_id: null,
  amount_cents: 2500,
  currency: "usd",
  frequency: "one-time",
  locale: "en",
  donor_email: "fixture@example.invalid",
  donor_name: "Fixture Donor",
  is_anonymous: false,
  project_slug: "general",
  paid_at: "2026-11-02T08:00:00.000Z",
  receipt_id: "ADA-2026-PIFIXTURE",
  follow_up_due_at: "2026-12-02T08:00:00.000Z",
  follow_up_status: "pending_30_day_update",
};

function setupRpcClient(result: {
  data?: unknown;
  error?: { message: string } | null;
}) {
  supabase.createClient.mockReturnValue({ rpc: supabase.rpc });
  supabase.rpc.mockResolvedValue({
    data: result.data ?? null,
    error: result.error ?? null,
  });
}

async function loadDonations() {
  return import("../src/lib/donations");
}

describe("donation outbox Supabase RPC contract", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("SUPABASE_URL", "https://fixture.supabase.co");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "fixture-only-key");
    supabase.createClient.mockReset();
    supabase.rpc.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("atomically asks the database to upsert a donation and enqueue both immutable messages", async () => {
    setupRpcClient({
      data: [
        {
          donation_id: "donation-fixture",
          receipt_outbox_id: "outbox-receipt",
          staff_outbox_id: "outbox-staff",
        },
      ],
    });
    const { persistDonationAndEnqueueEmails } = await loadDonations();
    const args = {
      donation: baseDonation,
      receiptPayload: { to: "fixture@example.invalid", html: "receipt" },
      receiptPayloadSha256: "a".repeat(64),
      staffPayload: { to: "info@apotidev.org", text: "staff" },
      staffPayloadSha256: "b".repeat(64),
    };

    await expect(persistDonationAndEnqueueEmails(args)).resolves.toEqual({
      donationId: "donation-fixture",
      receiptOutboxId: "outbox-receipt",
      staffOutboxId: "outbox-staff",
    });
    expect(supabase.rpc).toHaveBeenCalledWith("persist_donation_email_outbox", {
      p_donation: baseDonation,
      p_receipt_payload: args.receiptPayload,
      p_receipt_sha256: "a".repeat(64),
      p_staff_payload: args.staffPayload,
      p_staff_sha256: "b".repeat(64),
    });
  });

  it("does not report an enqueue when the transaction returns no donation id", async () => {
    setupRpcClient({ data: [], error: null });
    const { persistDonationAndEnqueueEmails } = await loadDonations();

    await expect(
      persistDonationAndEnqueueEmails({
        donation: baseDonation,
        receiptPayload: {},
        receiptPayloadSha256: "a".repeat(64),
        staffPayload: {},
        staffPayloadSha256: "b".repeat(64),
      }),
    ).rejects.toThrow("Donation outbox enqueue returned no donation ID");
  });

  it("limits retry claims to requested IDs when draining immediately", async () => {
    setupRpcClient({ data: [], error: null });
    const { claimDonationEmailOutbox } = await loadDonations();

    await expect(
      claimDonationEmailOutbox({ limit: 2, onlyIds: ["outbox-a", "outbox-b"] }),
    ).resolves.toEqual([]);
    expect(supabase.rpc).toHaveBeenCalledWith("claim_donation_email_outbox", {
      p_limit: 2,
      p_only_ids: ["outbox-a", "outbox-b"],
    });
  });

  it("passes lease-token compare-and-set arguments to complete/fail RPCs", async () => {
    setupRpcClient({ data: true, error: null });
    const { completeDonationEmailOutbox, failDonationEmailOutbox } =
      await loadDonations();

    await expect(
      completeDonationEmailOutbox({
        outboxId: "outbox-a",
        leaseToken: "lease-a",
        providerMessageId: "resend-message-id",
      }),
    ).resolves.toBe(true);
    expect(supabase.rpc).toHaveBeenNthCalledWith(
      1,
      "complete_donation_email_outbox",
      {
        p_outbox_id: "outbox-a",
        p_lease_token: "lease-a",
        p_provider_message_id: "resend-message-id",
      },
    );

    supabase.rpc.mockResolvedValueOnce({ data: "needs_review", error: null });
    await expect(
      failDonationEmailOutbox({
        outboxId: "outbox-a",
        leaseToken: "lease-a",
        error: "payload mismatch",
        needsReview: true,
      }),
    ).resolves.toBe("needs_review");
    expect(supabase.rpc).toHaveBeenNthCalledWith(
      2,
      "fail_donation_email_outbox",
      {
        p_outbox_id: "outbox-a",
        p_lease_token: "lease-a",
        p_error: "payload mismatch",
        p_needs_review: true,
      },
    );
  });

  it("enqueues follow-up batches with an immutable payload and supplied due-time snapshot", async () => {
    setupRpcClient({ data: "outbox-digest", error: null });
    const { enqueueFollowUpDigest } = await loadDonations();

    await expect(
      enqueueFollowUpDigest({
        donationIds: ["don-a", "don-b"],
        emailPayload: { to: "info@apotidev.org", text: "frozen digest" },
        payloadSha256: "c".repeat(64),
        now: new Date("2026-11-02T08:00:00.000Z"),
      }),
    ).resolves.toBe("outbox-digest");
    expect(supabase.rpc).toHaveBeenCalledWith("enqueue_follow_up_digest", {
      p_donation_ids: ["don-a", "don-b"],
      p_email_payload: { to: "info@apotidev.org", text: "frozen digest" },
      p_payload_sha256: "c".repeat(64),
      p_now: "2026-11-02T08:00:00.000Z",
    });
  });
});

describe("proposed outbox migration contract (static source checks)", () => {
  it("keeps claims atomic, lease-checked, service-role-only, and client-inaccessible", async () => {
    const sql = await readFile(
      new URL(
        "../supabase/migrations/20261102161100_add_donation_email_outbox.sql",
        import.meta.url,
      ),
      "utf8",
    );

    expect(sql).toContain("for update skip locked");
    expect(sql).toContain(
      "where id = p_outbox_id and status = 'processing' and lease_token = p_lease_token",
    );
    expect(sql).toContain(
      "alter table public.donation_email_outbox enable row level security",
    );
    expect(sql).toContain(
      "revoke all on function public.claim_donation_email_outbox(integer, uuid[]) from public, anon, authenticated",
    );
    expect(sql).toContain(
      "grant execute on function public.claim_donation_email_outbox(integer, uuid[]) to service_role",
    );
    expect(sql).not.toMatch(/security\s+definer/i);
  });

  it("preserves digest reservations and uses a capped retry/idempotency safety window", async () => {
    const sql = await readFile(
      new URL(
        "../supabase/migrations/20261102161100_add_donation_email_outbox.sql",
        import.meta.url,
      ),
      "utf8",
    );

    expect(sql).toContain("array_agg(distinct x order by x)");
    expect(sql).toContain("md5(array_to_string(v_sorted_ids, ','))");
    expect(sql).toContain("follow_up_reminder_outbox_id = v_outbox_id");
    expect(sql).toContain("interval '23 hours'");
    expect(sql).toContain("attempt_count >= 6");
    expect(sql).toContain("email_payload = '{}'::jsonb");
    expect(sql).toContain("Digest completion reservation mismatch");
  });
});
