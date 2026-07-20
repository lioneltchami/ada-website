import { afterEach, describe, expect, it, vi } from "vitest";

const webhookMocks = vi.hoisted(() => ({
  claimDonationThankYou: vi.fn(),
  clearDonationThankYou: vi.fn(),
  donationFromStripeInvoice: vi.fn(),
  donationFromStripePaymentIntent: vi.fn(),
  findDonationByStripeReference: vi.fn(),
  saveDonationRecord: vi.fn(),
  sendDonationFollowUpNotification: vi.fn(),
  sendDonationReceipt: vi.fn(),
  thirtyDayFollowUpDueAt: vi.fn(),
}));

vi.mock("../src/lib/donations", () => ({
  claimDonationThankYou: webhookMocks.claimDonationThankYou,
  clearDonationThankYou: webhookMocks.clearDonationThankYou,
  donationFromStripeInvoice: webhookMocks.donationFromStripeInvoice,
  donationFromStripePaymentIntent: webhookMocks.donationFromStripePaymentIntent,
  findDonationByStripeReference: webhookMocks.findDonationByStripeReference,
  saveDonationRecord: webhookMocks.saveDonationRecord,
  thirtyDayFollowUpDueAt: webhookMocks.thirtyDayFollowUpDueAt,
}));

vi.mock("../src/lib/email", () => ({
  sendDonationFollowUpNotification:
    webhookMocks.sendDonationFollowUpNotification,
  sendDonationReceipt: webhookMocks.sendDonationReceipt,
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

function activeWebhookSecret(): string {
  return (import.meta as any).env?.STRIPE_WEBHOOK_SECRET || "whsec_test";
}

const baseDonation = {
  stripe_payment_intent_id: "pi_123",
  stripe_invoice_id: null,
  stripe_subscription_id: null,
  amount_cents: 2500,
  currency: "usd",
  frequency: "one-time" as const,
  donor_email: "donor@example.com",
  donor_name: "Ada Donor",
  is_anonymous: false,
  project_slug: "education-drive",
  paid_at: "2026-05-30T12:00:00.000Z",
  follow_up_due_at: "2026-06-29T12:00:00.000Z",
  follow_up_status: "pending_30_day_update" as const,
};

describe("Stripe webhook signature verification", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
    Object.values(webhookMocks).forEach((mock) => mock.mockReset());
  });

  it("accepts valid signatures", async () => {
    const { verifySignature } =
      await import("../src/pages/api/webhooks/stripe");
    const payload = JSON.stringify({ type: "payment_intent.succeeded" });
    const header = await signatureHeader(payload, "whsec_test");

    await expect(verifySignature(payload, header, "whsec_test")).resolves.toBe(
      true,
    );
  });

  it("rejects stale timestamps and invalid signatures", async () => {
    const { verifySignature } =
      await import("../src/pages/api/webhooks/stripe");
    const payload = JSON.stringify({ type: "payment_intent.succeeded" });
    const staleHeader = await signatureHeader(
      payload,
      "whsec_test",
      Math.floor(Date.now() / 1000) - 600,
    );

    await expect(
      verifySignature(payload, staleHeader, "whsec_test"),
    ).resolves.toBe(false);
    await expect(
      verifySignature(payload, "t=123,v1=nothex", "whsec_test"),
    ).resolves.toBe(false);
  });

  it("claims thank-you then sends receipt for a confirmed one-time gift", async () => {
    const secret = activeWebhookSecret();
    vi.stubEnv("STRIPE_WEBHOOK_SECRET", secret);
    webhookMocks.donationFromStripePaymentIntent.mockReturnValue(baseDonation);
    webhookMocks.findDonationByStripeReference.mockResolvedValue(null);
    webhookMocks.saveDonationRecord.mockResolvedValue(undefined);
    webhookMocks.claimDonationThankYou.mockResolvedValue(true);
    webhookMocks.sendDonationReceipt.mockResolvedValue({
      success: true,
      receiptId: "ADA-2026-PI123",
    });
    webhookMocks.sendDonationFollowUpNotification.mockResolvedValue({
      success: true,
    });

    const { POST } = await import("../src/pages/api/webhooks/stripe");
    const response = await POST({
      request: await signedWebhookRequest(
        {
          type: "payment_intent.succeeded",
          data: { object: { id: "pi_123", metadata: { type: "one-time" } } },
        },
        secret,
      ),
    } as any);

    expect(response.status).toBe(200);
    expect(webhookMocks.saveDonationRecord).toHaveBeenCalledTimes(1);
    expect(webhookMocks.claimDonationThankYou).toHaveBeenCalledWith({
      stripePaymentIntentId: "pi_123",
      stripeInvoiceId: null,
    });
    expect(webhookMocks.sendDonationReceipt).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "donor@example.com",
        receiptId: "ADA-2026-PI123",
        followUpDueAt: "2026-06-29T12:00:00.000Z",
      }),
    );
    expect(webhookMocks.sendDonationFollowUpNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "donor@example.com",
        stripeReference: "pi_123",
      }),
    );
    expect(webhookMocks.clearDonationThankYou).not.toHaveBeenCalled();
  });

  it("does not resend receipt emails for already-thanked webhook redeliveries", async () => {
    const secret = activeWebhookSecret();
    vi.stubEnv("STRIPE_WEBHOOK_SECRET", secret);
    webhookMocks.donationFromStripePaymentIntent.mockReturnValue(baseDonation);
    webhookMocks.findDonationByStripeReference.mockResolvedValue({
      receipt_id: "ADA-2026-PI123",
      thank_you_sent_at: "2026-05-30T12:01:00.000Z",
      follow_up_due_at: "2026-06-29T12:00:00.000Z",
      follow_up_status: "pending_30_day_update",
    });
    webhookMocks.saveDonationRecord.mockResolvedValue(undefined);

    const { POST } = await import("../src/pages/api/webhooks/stripe");
    const response = await POST({
      request: await signedWebhookRequest(
        {
          type: "payment_intent.succeeded",
          data: { object: { id: "pi_123", metadata: { type: "one-time" } } },
        },
        secret,
      ),
    } as any);

    expect(response.status).toBe(200);
    expect(webhookMocks.saveDonationRecord).toHaveBeenCalledTimes(1);
    expect(webhookMocks.claimDonationThankYou).not.toHaveBeenCalled();
    expect(webhookMocks.sendDonationReceipt).not.toHaveBeenCalled();
    expect(
      webhookMocks.sendDonationFollowUpNotification,
    ).not.toHaveBeenCalled();
  });

  it("skips email when another delivery already claimed thank-you", async () => {
    const secret = activeWebhookSecret();
    vi.stubEnv("STRIPE_WEBHOOK_SECRET", secret);
    webhookMocks.donationFromStripePaymentIntent.mockReturnValue(baseDonation);
    webhookMocks.findDonationByStripeReference.mockResolvedValue(null);
    webhookMocks.saveDonationRecord.mockResolvedValue(undefined);
    webhookMocks.claimDonationThankYou.mockResolvedValue(false);

    const { POST } = await import("../src/pages/api/webhooks/stripe");
    const response = await POST({
      request: await signedWebhookRequest(
        {
          type: "payment_intent.succeeded",
          data: { object: { id: "pi_123", metadata: { type: "one-time" } } },
        },
        secret,
      ),
    } as any);

    expect(response.status).toBe(200);
    expect(webhookMocks.claimDonationThankYou).toHaveBeenCalled();
    expect(webhookMocks.sendDonationReceipt).not.toHaveBeenCalled();
    expect(
      webhookMocks.sendDonationFollowUpNotification,
    ).not.toHaveBeenCalled();
  });

  it("clears the thank-you claim when receipt send fails so Stripe can retry", async () => {
    const secret = activeWebhookSecret();
    vi.stubEnv("STRIPE_WEBHOOK_SECRET", secret);
    webhookMocks.donationFromStripePaymentIntent.mockReturnValue(baseDonation);
    webhookMocks.findDonationByStripeReference.mockResolvedValue(null);
    webhookMocks.saveDonationRecord.mockResolvedValue(undefined);
    webhookMocks.claimDonationThankYou.mockResolvedValue(true);
    webhookMocks.sendDonationReceipt.mockRejectedValue(
      new Error("Email send failed: 500"),
    );
    webhookMocks.clearDonationThankYou.mockResolvedValue(undefined);

    const { POST } = await import("../src/pages/api/webhooks/stripe");

    await expect(
      POST({
        request: await signedWebhookRequest(
          {
            type: "payment_intent.succeeded",
            data: { object: { id: "pi_123", metadata: { type: "one-time" } } },
          },
          secret,
        ),
      } as any),
    ).rejects.toThrow("Email send failed: 500");

    expect(webhookMocks.clearDonationThankYou).toHaveBeenCalledWith({
      stripePaymentIntentId: "pi_123",
      stripeInvoiceId: null,
    });
  });
});
