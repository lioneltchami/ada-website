import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const outbox = vi.hoisted(() => ({
  processDonationEmailOutbox: vi.fn(),
}));

vi.mock("../src/lib/donation-email-outbox", () => outbox);

describe("authenticated outbox drain route", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("DONATION_FOLLOWUP_CRON_SECRET", "local-cron-secret");
    outbox.processDonationEmailOutbox.mockReset();
    outbox.processDonationEmailOutbox.mockResolvedValue({
      claimed: 2,
      sent: 1,
      deferred: 1,
      staleLease: 0,
    });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("rejects unauthenticated requests without draining jobs", async () => {
    const { POST } = await import(
      "../src/pages/api/cron/donation-email-outbox"
    );
    const response = await POST({
      request: new Request(
        "https://apotidev.org/api/cron/donation-email-outbox",
        { method: "POST" },
      ),
    } as any);

    expect(response.status).toBe(401);
    expect(outbox.processDonationEmailOutbox).not.toHaveBeenCalled();
  });

  it("drains only the outbox with the existing bearer secret", async () => {
    const { POST } = await import(
      "../src/pages/api/cron/donation-email-outbox"
    );
    const response = await POST({
      request: new Request(
        "https://apotidev.org/api/cron/donation-email-outbox",
        {
          method: "POST",
          headers: { authorization: "Bearer local-cron-secret" },
        },
      ),
    } as any);

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ ok: true, sent: 1, deferred: 1 });
    expect(outbox.processDonationEmailOutbox).toHaveBeenCalledWith({ limit: 20 });
  });
});
