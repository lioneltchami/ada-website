import { afterEach, describe, expect, it, vi } from "vitest";

const paymentIntentCreate = vi.fn();
const customerList = vi.fn();
const customerCreate = vi.fn();
const subscriptionCreate = vi.fn();
const sendSponsorInquiryNotification = vi.fn();
const sendDonationFollowUpDigest = vi.fn();
const getDueDonationFollowUps = vi.fn();
const markDonationFollowUpReminderSent = vi.fn();

vi.mock("../src/lib/stripe", () => ({
  getStripe: () => ({
    paymentIntents: { create: paymentIntentCreate },
    customers: { list: customerList, create: customerCreate },
    subscriptions: { create: subscriptionCreate },
  }),
}));

vi.mock("../src/lib/email", () => ({
  sendSponsorInquiryNotification,
  sendDonationFollowUpDigest,
}));

vi.mock("../src/lib/donations", () => ({
  getDueDonationFollowUps,
  markDonationFollowUpReminderSent,
}));

function jsonRequest(body: unknown, origin = "https://apotidev.org") {
  const text = typeof body === "string" ? body : JSON.stringify(body);
  return new Request("https://apotidev.org/api/create-payment-intent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": String(text.length),
      Origin: origin,
    },
    body: text,
  });
}

function sponsorRequest(body: unknown, origin = "https://apotidev.org") {
  const text = typeof body === "string" ? body : JSON.stringify(body);
  return new Request("https://apotidev.org/api/sponsor-inquiry", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": String(text.length),
      Origin: origin,
    },
    body: text,
  });
}

function subscriptionRequest(body: unknown, origin = "https://apotidev.org") {
  const text = typeof body === "string" ? body : JSON.stringify(body);
  return new Request("https://apotidev.org/api/create-subscription", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": String(text.length),
      Origin: origin,
    },
    body: text,
  });
}

function performanceRequest(body: unknown, origin = "https://apotidev.org") {
  const text = typeof body === "string" ? body : JSON.stringify(body);
  return new Request("https://apotidev.org/api/performance-metrics", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": String(text.length),
      Origin: origin,
    },
    body: text,
  });
}

function cronRequest(
  secret = "cron_secret",
  path = "/api/cron/donation-followups",
) {
  return new Request(`https://apotidev.org${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${secret}` },
  });
}

const validSponsorInquiry = {
  name: "Ada Sponsor",
  email: "SPONSOR@EXAMPLE.COM",
  phone: "+1 555 0100",
  organization: "Example Church",
  country: "Canada",
  sponsorType: "Church or faith community",
  interest: "Sponsor a project",
  budgetRange: "$2,500-$5,000",
  preferredTiming: "Within 30 days",
  recognitionPreference: "Internal acknowledgment only",
  fundingPurpose: "We want to support a documented education project.",
  reportingNeeds: ["Sponsor packet", "Project reports"],
  invoiceOrWire: true,
  callPreference: "Book a short call",
  notes: "Please send the diligence packet.",
};

describe("payment intent route", () => {
  afterEach(() => {
    paymentIntentCreate.mockReset();
  });

  it("rejects invalid origins", async () => {
    const { POST } = await import("../src/pages/api/create-payment-intent");
    const response = await POST({
      request: jsonRequest({}, "https://evil.example"),
      url: new URL("https://apotidev.org/api/create-payment-intent"),
    } as any);

    expect(response.status).toBe(403);
  });

  it("rejects invalid JSON as a bad request", async () => {
    const { POST } = await import("../src/pages/api/create-payment-intent");
    const response = await POST({
      request: jsonRequest("{not-json"),
      url: new URL("https://apotidev.org/api/create-payment-intent"),
    } as any);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: "Invalid JSON",
    });
  });

  it("normalizes donor metadata for valid one-time gifts", async () => {
    paymentIntentCreate.mockResolvedValue({ client_secret: "pi_secret" });
    const { POST } = await import("../src/pages/api/create-payment-intent");
    const checkoutAttemptId = "11111111-1111-4111-8111-111111111111";

    const response = await POST({
      request: jsonRequest({
        amount: 2500,
        currency: "usd",
        type: "one-time",
        donorName: "  Ada Donor  ",
        donorEmail: "ADA@EXAMPLE.COM ",
        isAnonymous: false,
        projectSlug: "education-drive",
        checkoutAttemptId,
      }),
      url: new URL("https://apotidev.org/api/create-payment-intent"),
    } as any);

    expect(response.status).toBe(200);
    expect(paymentIntentCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        receipt_email: "ada@example.com",
        automatic_payment_methods: { enabled: true },
        metadata: expect.objectContaining({
          donor_name: "Ada Donor",
          donor_email: "ada@example.com",
          locale: "en",
          project_slug: "education-drive",
          follow_up_plan: "receipt_thank_you_30_day_impact",
        }),
      }),
      { idempotencyKey: `pi_${checkoutAttemptId}` },
    );
  });

  it("rejects requests without a checkoutAttemptId", async () => {
    const { POST } = await import("../src/pages/api/create-payment-intent");
    const response = await POST({
      request: jsonRequest({
        amount: 2500,
        currency: "usd",
        type: "one-time",
        donorName: "Ada Donor",
        donorEmail: "ada@example.com",
        isAnonymous: false,
      }),
      url: new URL("https://apotidev.org/api/create-payment-intent"),
    } as any);

    expect(response.status).toBe(400);
    expect(paymentIntentCreate).not.toHaveBeenCalled();
  });
});

describe("subscription route", () => {
  afterEach(() => {
    customerList.mockReset();
    customerCreate.mockReset();
    subscriptionCreate.mockReset();
  });

  it("creates monthly donation subscriptions with saved payment setup", async () => {
    customerList.mockResolvedValue({ data: [] });
    customerCreate.mockResolvedValue({ id: "cus_123" });
    subscriptionCreate.mockResolvedValue({
      id: "sub_123",
      latest_invoice: {
        confirmation_secret: { client_secret: "pi_monthly_secret" },
      },
    });
    const { POST } = await import("../src/pages/api/create-subscription");
    const checkoutAttemptId = "22222222-2222-4222-8222-222222222222";

    const response = await POST({
      request: subscriptionRequest({
        amount: 2500,
        currency: "usd",
        type: "monthly",
        donorName: "Monthly Donor",
        donorEmail: "MONTHLY@EXAMPLE.COM",
        isAnonymous: false,
        locale: "fr",
        projectSlug: "widow-support",
        checkoutAttemptId,
      }),
      url: new URL("https://apotidev.org/api/create-subscription"),
    } as any);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      clientSecret: "pi_monthly_secret",
      subscriptionId: "sub_123",
    });
    expect(subscriptionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        customer: "cus_123",
        payment_behavior: "default_incomplete",
        payment_settings: {
          save_default_payment_method: "on_subscription",
        },
        expand: ["latest_invoice.confirmation_secret"],
        metadata: expect.objectContaining({
          donor_email: "monthly@example.com",
          locale: "fr",
          type: "monthly",
          project_slug: "widow-support",
          follow_up_plan: "receipt_thank_you_30_day_impact",
        }),
      }),
      { idempotencyKey: `sub_${checkoutAttemptId}` },
    );
  });
});

describe("performance metrics route", () => {
  it("accepts compact web vital metrics", async () => {
    const { POST } = await import("../src/pages/api/performance-metrics");
    const response = await POST({
      request: performanceRequest({
        name: "LCP",
        value: 1830,
        rating: "good",
        path: "/donate",
        device: "mobile",
        connection: "4g",
      }),
      url: new URL("https://apotidev.org/api/performance-metrics"),
    } as any);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ ok: true });
  });

  it("rejects invalid performance metric payloads", async () => {
    const { POST } = await import("../src/pages/api/performance-metrics");
    const response = await POST({
      request: performanceRequest({
        name: "CUSTOM",
        value: 1,
        rating: "good",
        path: "/donate",
        device: "mobile",
      }),
      url: new URL("https://apotidev.org/api/performance-metrics"),
    } as any);

    expect(response.status).toBe(400);
  });
});

describe("public config route", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("exposes the Stripe publishable key for browser checkout", async () => {
    vi.stubEnv("PUBLIC_STRIPE_PUBLISHABLE_KEY", "pk_test_public");
    vi.stubEnv("PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("PUBLIC_SUPABASE_ANON_KEY", "anon_public");
    const { GET } = await import("../src/pages/api/public-config");

    const response = await GET({} as any);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      stripePublishableKey: "pk_test_public",
      supabaseUrl: "https://example.supabase.co",
      supabaseAnonKey: "anon_public",
    });
  });

  it("prefers Cloudflare runtime secrets over build-time values", async () => {
    vi.stubEnv("PUBLIC_STRIPE_PUBLISHABLE_KEY", "pk_test_public");
    vi.resetModules();
    const { env: cloudflareEnv } = await import("cloudflare:workers");
    cloudflareEnv.PUBLIC_STRIPE_PUBLISHABLE_KEY = "pk_live_public";
    cloudflareEnv.PUBLIC_SUPABASE_URL = "https://runtime.supabase.co";
    cloudflareEnv.PUBLIC_SUPABASE_ANON_KEY = "runtime_anon";
    const { GET } = await import("../src/pages/api/public-config");

    const response = await GET({} as any);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      stripePublishableKey: "pk_live_public",
      supabaseUrl: "https://runtime.supabase.co",
      supabaseAnonKey: "runtime_anon",
    });
  });
});

describe("donation follow-up cron route", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
    getDueDonationFollowUps.mockReset();
    markDonationFollowUpReminderSent.mockReset();
    sendDonationFollowUpDigest.mockReset();
  });

  it("rejects requests without the cron secret", async () => {
    vi.stubEnv("DONATION_FOLLOWUP_CRON_SECRET", "cron_secret");
    const { POST } = await import("../src/pages/api/cron/donation-followups");

    const response = await POST({
      request: new Request("https://apotidev.org/api/cron/donation-followups", {
        method: "POST",
      }),
      url: new URL("https://apotidev.org/api/cron/donation-followups"),
    } as any);

    expect(response.status).toBe(401);
  });

  it("sends a staff digest and marks reminders as sent", async () => {
    vi.stubEnv("DONATION_FOLLOWUP_CRON_SECRET", "cron_secret");
    getDueDonationFollowUps.mockResolvedValue([
      {
        id: "don_123",
        donor_email: "donor@example.com",
        donor_name: "Ada Donor",
        amount_cents: 2500,
        currency: "usd",
        frequency: "one-time",
        project_slug: "education-drive",
        paid_at: "2026-05-30T12:00:00.000Z",
        follow_up_due_at: "2026-06-29T12:00:00.000Z",
      },
    ]);
    sendDonationFollowUpDigest.mockResolvedValue({ success: true });
    markDonationFollowUpReminderSent.mockResolvedValue(undefined);
    const { POST } = await import("../src/pages/api/cron/donation-followups");

    const response = await POST({
      request: cronRequest(),
      url: new URL("https://apotidev.org/api/cron/donation-followups"),
    } as any);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      dueCount: 1,
      reminderMarkedCount: 1,
      dryRun: false,
    });
    expect(sendDonationFollowUpDigest).toHaveBeenCalledWith(
      expect.objectContaining({
        donations: expect.arrayContaining([
          expect.objectContaining({ id: "don_123" }),
        ]),
      }),
    );
    expect(markDonationFollowUpReminderSent).toHaveBeenCalledWith(
      ["don_123"],
      expect.any(Date),
    );
  });

  it("does not mark reminders during dry runs", async () => {
    vi.stubEnv("DONATION_FOLLOWUP_CRON_SECRET", "cron_secret");
    getDueDonationFollowUps.mockResolvedValue([
      {
        id: "don_123",
        donor_email: "donor@example.com",
        donor_name: "Ada Donor",
        amount_cents: 2500,
        currency: "usd",
        frequency: "one-time",
        project_slug: "education-drive",
        paid_at: "2026-05-30T12:00:00.000Z",
        follow_up_due_at: "2026-06-29T12:00:00.000Z",
      },
    ]);
    sendDonationFollowUpDigest.mockResolvedValue({ success: true });
    const { POST } = await import("../src/pages/api/cron/donation-followups");

    const response = await POST({
      request: cronRequest(
        "cron_secret",
        "/api/cron/donation-followups?dryRun=1",
      ),
      url: new URL("https://apotidev.org/api/cron/donation-followups?dryRun=1"),
    } as any);

    expect(response.status).toBe(200);
    expect(sendDonationFollowUpDigest).not.toHaveBeenCalled();
    expect(markDonationFollowUpReminderSent).not.toHaveBeenCalled();
  });
});

describe("sponsor inquiry route", () => {
  afterEach(() => {
    sendSponsorInquiryNotification.mockReset();
  });

  it("rejects invalid origins", async () => {
    const { POST } = await import("../src/pages/api/sponsor-inquiry");
    const response = await POST({
      request: sponsorRequest(validSponsorInquiry, "https://evil.example"),
      url: new URL("https://apotidev.org/api/sponsor-inquiry"),
    } as any);

    expect(response.status).toBe(403);
  });

  it("rejects invalid JSON as a bad request", async () => {
    const { POST } = await import("../src/pages/api/sponsor-inquiry");
    const response = await POST({
      request: sponsorRequest("{not-json"),
      url: new URL("https://apotidev.org/api/sponsor-inquiry"),
    } as any);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: "Invalid JSON",
    });
  });

  it("rejects invalid enum values", async () => {
    const { POST } = await import("../src/pages/api/sponsor-inquiry");
    const response = await POST({
      request: sponsorRequest({
        ...validSponsorInquiry,
        budgetRange: "$25,000 guaranteed",
      }),
      url: new URL("https://apotidev.org/api/sponsor-inquiry"),
    } as any);

    expect(response.status).toBe(400);
    expect(sendSponsorInquiryNotification).not.toHaveBeenCalled();
  });

  it("rejects oversized bodies", async () => {
    const { POST } = await import("../src/pages/api/sponsor-inquiry");
    const body = JSON.stringify({
      ...validSponsorInquiry,
      notes: "x".repeat(12_000),
    });
    const request = new Request("https://apotidev.org/api/sponsor-inquiry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": String(body.length),
        Origin: "https://apotidev.org",
      },
      body,
    });

    const response = await POST({
      request,
      url: new URL("https://apotidev.org/api/sponsor-inquiry"),
    } as any);

    expect(response.status).toBe(413);
  });

  it("formats valid sponsor inquiries for notification", async () => {
    sendSponsorInquiryNotification.mockResolvedValue({ success: true });
    const { POST } = await import("../src/pages/api/sponsor-inquiry");

    const response = await POST({
      request: sponsorRequest(validSponsorInquiry),
      url: new URL("https://apotidev.org/api/sponsor-inquiry"),
    } as any);

    expect(response.status).toBe(200);
    expect(sendSponsorInquiryNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "sponsor@example.com",
        organization: "Example Church",
        invoiceOrWire: true,
        reportingNeeds: ["Sponsor packet", "Project reports"],
      }),
    );
  });
});
