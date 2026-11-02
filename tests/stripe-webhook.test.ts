import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const webhookMocks = vi.hoisted(() => ({
  donationFromStripeInvoice: vi.fn(),
  donationFromStripePaymentIntent: vi.fn(),
  findDonationByStripeReference: vi.fn(),
  persistDonationAndEnqueueEmails: vi.fn(),
  thirtyDayFollowUpDueAt: vi.fn(),
  createDonationFollowUpNotificationPayload: vi.fn(),
  createDonationReceiptEmailPayload: vi.fn(),
  processDonationEmailOutbox: vi.fn(),
  sha256EmailPayload: vi.fn(),
}));

vi.mock("../src/lib/donations", () => ({
  donationFromStripeInvoice: webhookMocks.donationFromStripeInvoice,
  donationFromStripePaymentIntent: webhookMocks.donationFromStripePaymentIntent,
  findDonationByStripeReference: webhookMocks.findDonationByStripeReference,
  persistDonationAndEnqueueEmails: webhookMocks.persistDonationAndEnqueueEmails,
  thirtyDayFollowUpDueAt: webhookMocks.thirtyDayFollowUpDueAt,
}));

vi.mock("../src/lib/email", () => ({
  createDonationFollowUpNotificationPayload:
    webhookMocks.createDonationFollowUpNotificationPayload,
  createDonationReceiptEmailPayload:
    webhookMocks.createDonationReceiptEmailPayload,
}));

vi.mock("../src/lib/donation-email-outbox", () => ({
  processDonationEmailOutbox: webhookMocks.processDonationEmailOutbox,
  sha256EmailPayload: webhookMocks.sha256EmailPayload,
}));

async function signatureHeader(
  payload: string,
  secret: string,
  timestamp = Math.floor(Date.now() / 1000),
) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${timestamp}.${payload}`),
  );
  const hex = [...new Uint8Array(signature)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return `t=${timestamp},v1=${hex}`;
}

async function signedWebhookRequest(payload: unknown, secret = "whsec_test") {
  const body = JSON.stringify(payload);
  return new Request("https://apotidev.org/api/webhooks/stripe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": String(body.length),
      "stripe-signature": await signatureHeader(body, secret),
    },
    body,
  });
}

const baseDonation = {
  stripe_payment_intent_id: "pi_123",
  stripe_invoice_id: null,
  stripe_subscription_id: null,
  amount_cents: 2500,
  currency: "usd",
  frequency: "one-time" as const,
  locale: "en" as const,
  donor_email: "donor@example.com",
  donor_name: "Ada Donor",
  is_anonymous: false,
  project_slug: "education-drive",
  paid_at: "2026-05-30T12:00:00.000Z",
  follow_up_due_at: "2026-06-29T12:00:00.000Z",
  follow_up_status: "pending_30_day_update" as const,
};

function configureSuccessfulQueue() {
  vi.stubEnv("STRIPE_WEBHOOK_SECRET", "whsec_test");
  vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_fixture");
  webhookMocks.findDonationByStripeReference.mockResolvedValue(null);
  webhookMocks.thirtyDayFollowUpDueAt.mockReturnValue(
    "2026-06-29T12:00:00.000Z",
  );
  webhookMocks.createDonationReceiptEmailPayload.mockResolvedValue({
    to: "donor@example.com",
    subject: "Receipt",
    html: "receipt",
  });
  webhookMocks.createDonationFollowUpNotificationPayload.mockReturnValue({
    to: "info@apotidev.org",
    subject: "Follow up",
    text: "fixture",
  });
  webhookMocks.sha256EmailPayload.mockResolvedValue("a".repeat(64));
  webhookMocks.persistDonationAndEnqueueEmails.mockResolvedValue({
    donationId: "don_123",
    receiptOutboxId: "out_receipt_123",
    staffOutboxId: "out_staff_123",
  });
  webhookMocks.processDonationEmailOutbox.mockResolvedValue({
    claimed: 2,
    sent: 2,
    deferred: 0,
    staleLease: 0,
  });
}

describe("Stripe webhook durable donation delivery enqueue", () => {
  beforeEach(() => {
    configureSuccessfulQueue();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
    Object.values(webhookMocks).forEach((mock) => mock.mockReset());
  });

  it("accepts valid signatures and rejects stale or malformed signatures", async () => {
    const { verifySignature } =
      await import("../src/pages/api/webhooks/stripe");
    const payload = JSON.stringify({ type: "payment_intent.succeeded" });
    const valid = await signatureHeader(payload, "whsec_test");
    const stale = await signatureHeader(
      payload,
      "whsec_test",
      Math.floor(Date.now() / 1000) - 600,
    );

    await expect(verifySignature(payload, valid, "whsec_test")).resolves.toBe(
      true,
    );
    await expect(verifySignature(payload, stale, "whsec_test")).resolves.toBe(
      false,
    );
    await expect(
      verifySignature(payload, "t=123,v1=nothex", "whsec_test"),
    ).resolves.toBe(false);
  });

  it("rejects a signed event whose livemode mismatches the configured Stripe key", async () => {
    const { POST } = await import("../src/pages/api/webhooks/stripe");
    const response = await POST({
      request: await signedWebhookRequest({
        id: "evt_live_mismatch",
        type: "payment_intent.succeeded",
        livemode: true,
        data: {
          object: { id: "pi_live", metadata: { type: "one-time" } },
        },
      }),
    } as any);

    expect(response.status).toBe(400);
    expect(await response.text()).toBe("Stripe mode mismatch");
    expect(webhookMocks.persistDonationAndEnqueueEmails).not.toHaveBeenCalled();
    expect(webhookMocks.processDonationEmailOutbox).not.toHaveBeenCalled();
  });

  it("atomically queues one-time receipt and staff messages with a fixed receipt date", async () => {
    webhookMocks.donationFromStripePaymentIntent.mockReturnValue(baseDonation);
    const { POST } = await import("../src/pages/api/webhooks/stripe");
    const response = await POST({
      request: await signedWebhookRequest({
        type: "payment_intent.succeeded",
        livemode: false,
        data: {
          object: { id: "pi_123", metadata: { type: "one-time" } },
        },
      }),
    } as any);

    expect(response.status).toBe(200);
    expect(webhookMocks.persistDonationAndEnqueueEmails).toHaveBeenCalledWith(
      expect.objectContaining({
        donation: expect.objectContaining({
          stripe_payment_intent_id: "pi_123",
          receipt_id: expect.stringMatching(/^ADA-2026-/),
          follow_up_due_at: "2026-06-29T12:00:00.000Z",
        }),
        receiptPayload: expect.objectContaining({ to: "donor@example.com" }),
        receiptPayloadSha256: "a".repeat(64),
        staffPayload: expect.objectContaining({ to: "info@apotidev.org" }),
        staffPayloadSha256: "a".repeat(64),
      }),
    );
    expect(webhookMocks.createDonationReceiptEmailPayload).toHaveBeenCalledWith(
      expect.objectContaining({
        receiptDate: "2026-05-30T12:00:00.000Z",
      }),
    );
    expect(webhookMocks.processDonationEmailOutbox).toHaveBeenCalledWith({
      limit: 2,
      onlyIds: ["out_receipt_123", "out_staff_123"],
    });
  });

  it("queues a recurring invoice using its invoice identity", async () => {
    webhookMocks.donationFromStripeInvoice.mockReturnValue({
      ...baseDonation,
      stripe_payment_intent_id: "pi_monthly_1",
      stripe_invoice_id: "in_monthly_1",
      stripe_subscription_id: "sub_monthly_1",
      frequency: "monthly",
    });
    const { POST } = await import("../src/pages/api/webhooks/stripe");
    const response = await POST({
      request: await signedWebhookRequest({
        type: "invoice.payment_succeeded",
        livemode: false,
        data: { object: { id: "in_monthly_1", amount_paid: 2500 } },
      }),
    } as any);

    expect(response.status).toBe(200);
    expect(webhookMocks.donationFromStripeInvoice).toHaveBeenCalledTimes(1);
    expect(webhookMocks.persistDonationAndEnqueueEmails).toHaveBeenCalledWith(
      expect.objectContaining({
        donation: expect.objectContaining({
          stripe_invoice_id: "in_monthly_1",
          stripe_subscription_id: "sub_monthly_1",
          frequency: "monthly",
        }),
      }),
    );
  });

  it("does not create a donation or outbox job for a zero-paid invoice", async () => {
    const { POST } = await import("../src/pages/api/webhooks/stripe");
    const response = await POST({
      request: await signedWebhookRequest({
        type: "invoice.payment_succeeded",
        livemode: false,
        data: { object: { id: "in_zero", amount_paid: 0 } },
      }),
    } as any);

    expect(response.status).toBe(200);
    expect(webhookMocks.persistDonationAndEnqueueEmails).not.toHaveBeenCalled();
  });

  it("acknowledges after durable enqueue when immediate outbox draining is unavailable", async () => {
    webhookMocks.donationFromStripePaymentIntent.mockReturnValue(baseDonation);
    webhookMocks.processDonationEmailOutbox.mockRejectedValue(
      new Error("temporary outbox claim failure"),
    );
    const { POST } = await import("../src/pages/api/webhooks/stripe");
    const response = await POST({
      request: await signedWebhookRequest({
        type: "payment_intent.succeeded",
        livemode: false,
        data: { object: { id: "pi_123", metadata: { type: "one-time" } } },
      }),
    } as any);

    expect(response.status).toBe(200);
    expect(webhookMocks.persistDonationAndEnqueueEmails).toHaveBeenCalledTimes(
      1,
    );
    expect(webhookMocks.processDonationEmailOutbox).toHaveBeenCalledTimes(1);
  });

  it("returns an error to Stripe when durable donation and outbox persistence fails", async () => {
    webhookMocks.donationFromStripePaymentIntent.mockReturnValue(baseDonation);
    webhookMocks.persistDonationAndEnqueueEmails.mockRejectedValue(
      new Error("database unavailable"),
    );
    const { POST } = await import("../src/pages/api/webhooks/stripe");

    await expect(
      POST({
        request: await signedWebhookRequest({
          type: "payment_intent.succeeded",
          livemode: false,
          data: { object: { id: "pi_123", metadata: { type: "one-time" } } },
        }),
      } as any),
    ).rejects.toThrow("database unavailable");
    expect(webhookMocks.processDonationEmailOutbox).not.toHaveBeenCalled();
  });
});
