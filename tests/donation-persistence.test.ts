import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const db = vi.hoisted(() => {
  const query: Record<string, ReturnType<typeof vi.fn>> = {};
  for (const method of [
    "from",
    "select",
    "limit",
    "eq",
    "maybeSingle",
    "upsert",
    "update",
    "is",
    "not",
    "lte",
    "or",
    "order",
    "in",
  ]) {
    query[method] = vi.fn();
  }
  return { createClient: vi.fn(), query };
});

vi.mock("@supabase/supabase-js", () => ({
  createClient: db.createClient,
}));

const donation = {
  stripe_payment_intent_id: "pi_fixture",
  stripe_invoice_id: null,
  stripe_subscription_id: null,
  amount_cents: 2500,
  currency: "usd",
  frequency: "one-time" as const,
  donor_email: "fixture@example.invalid",
  donor_name: "Test Fixture",
  is_anonymous: false,
  project_slug: "general",
  paid_at: "2026-10-01T12:00:00.000Z",
};

function configureQuery(result = { data: null, error: null }) {
  const builder = db.query as Record<string, ReturnType<typeof vi.fn>>;
  for (const method of [
    "from",
    "select",
    "limit",
    "eq",
    "upsert",
    "update",
    "is",
    "not",
    "lte",
    "or",
    "order",
    "in",
  ]) {
    builder[method].mockReturnThis();
  }
  builder.from.mockReturnValue(builder);
  builder.maybeSingle.mockResolvedValue(result);
  builder.upsert.mockResolvedValue(result);
  db.createClient.mockReturnValue({ from: builder.from });
}

async function loadDonations() {
  return import("../src/lib/donations");
}

describe("donation Supabase persistence contract", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("SUPABASE_URL", "https://fixture.supabase.co");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "fixture-only-key");
    Object.values(db.query).forEach((mock) => mock.mockReset());
    db.createClient.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("upserts one-time donations by Stripe payment-intent ID", async () => {
    configureQuery({ data: null, error: null });
    const { saveDonationRecord } = await loadDonations();

    await saveDonationRecord(donation);

    expect(db.query.from).toHaveBeenCalledWith("donations");
    expect(db.query.upsert).toHaveBeenCalledWith(donation, {
      onConflict: "stripe_payment_intent_id",
    });
  });

  it("upserts recurring donations by invoice ID", async () => {
    configureQuery({ data: null, error: null });
    const { saveDonationRecord } = await loadDonations();
    const recurring = {
      ...donation,
      stripe_payment_intent_id: "pi_monthly_fixture",
      stripe_invoice_id: "in_fixture",
      stripe_subscription_id: "sub_fixture",
      frequency: "monthly" as const,
    };

    await saveDonationRecord(recurring);

    expect(db.query.upsert).toHaveBeenCalledWith(recurring, {
      onConflict: "stripe_invoice_id",
    });
  });

  it("claims donor receipts with an atomic null-marker update", async () => {
    configureQuery({ data: { id: "donation-fixture" }, error: null });
    const { claimDonationThankYou } = await loadDonations();

    await expect(
      claimDonationThankYou({
        stripePaymentIntentId: "pi_fixture",
        sentAt: "2026-10-01T12:01:00.000Z",
      }),
    ).resolves.toBe(true);

    expect(db.query.from).toHaveBeenCalledWith("donations");
    expect(db.query.update).toHaveBeenCalledWith({
      thank_you_sent_at: "2026-10-01T12:01:00.000Z",
    });
    expect(db.query.is).toHaveBeenCalledWith("thank_you_sent_at", null);
    expect(db.query.eq).toHaveBeenCalledWith(
      "stripe_payment_intent_id",
      "pi_fixture",
    );
    expect(db.query.select).toHaveBeenCalledWith("id");
  });

  it("treats a lost claim race as already claimed", async () => {
    configureQuery({ data: null, error: null });
    const { claimDonationThankYou } = await loadDonations();

    await expect(
      claimDonationThankYou({ stripeInvoiceId: "in_fixture" }),
    ).resolves.toBe(false);
    expect(db.query.eq).toHaveBeenCalledWith("stripe_invoice_id", "in_fixture");
  });

  it("selects due follow-ups and allows reminders to recur no sooner than seven days", async () => {
    const result = { data: [{ id: "donation-fixture" }], error: null };
    configureQuery(result);
    db.query.limit.mockResolvedValue(result);
    const { getDueDonationFollowUps } = await loadDonations();
    const now = new Date("2026-11-02T00:00:00.000Z");

    await expect(getDueDonationFollowUps(now, 10)).resolves.toEqual([
      { id: "donation-fixture" },
    ]);

    expect(db.query.eq).toHaveBeenCalledWith(
      "follow_up_status",
      "pending_30_day_update",
    );
    expect(db.query.lte).toHaveBeenCalledWith(
      "follow_up_due_at",
      "2026-11-02T00:00:00.000Z",
    );
    expect(db.query.or).toHaveBeenCalledWith(
      "follow_up_reminder_sent_at.is.null,follow_up_reminder_sent_at.lt.2026-10-26T00:00:00.000Z",
    );
    expect(db.query.order).toHaveBeenCalledWith("follow_up_due_at", {
      ascending: true,
    });
    expect(db.query.limit).toHaveBeenCalledWith(10);
  });

  it("marks only the selected donation reminder IDs with the supplied timestamp", async () => {
    configureQuery({ data: null, error: null });
    const { markDonationFollowUpReminderSent } = await loadDonations();
    const sentAt = new Date("2026-11-02T00:00:00.000Z");

    await markDonationFollowUpReminderSent(["donation-fixture"], sentAt);

    expect(db.query.update).toHaveBeenCalledWith({
      follow_up_reminder_sent_at: "2026-11-02T00:00:00.000Z",
    });
    expect(db.query.in).toHaveBeenCalledWith("id", ["donation-fixture"]);
  });

  it("surfaces persistence errors instead of acknowledging a failed write", async () => {
    configureQuery({ data: null, error: { message: "fixture write failure" } });
    const { saveDonationRecord } = await loadDonations();

    await expect(saveDonationRecord(donation)).rejects.toThrow(
      "Donation persistence failed: fixture write failure",
    );
  });
});
