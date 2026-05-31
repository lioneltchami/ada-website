import type { APIRoute } from "astro";
import type { DonationRecord } from "../../../lib/donations";
import { getEnv } from "../../../lib/runtime-env";

function getWebhookSecret(): string | undefined {
  return getEnv("STRIPE_WEBHOOK_SECRET");
}

function expectedLiveMode(): boolean {
  return getEnv("STRIPE_SECRET_KEY")?.startsWith("sk_live_") ?? false;
}

export async function verifySignature(
  payload: string,
  header: string,
  secret: string,
): Promise<boolean> {
  // Extract timestamp and all v1 signatures
  const timestamp = header
    .split(",")
    .find((p) => p.startsWith("t="))
    ?.slice(2);
  const signatures = header
    .split(",")
    .filter((p) => p.startsWith("v1="))
    .map((p) => p.slice(3));
  if (!timestamp || signatures.length === 0) return false;

  // Reject timestamps older than 5 minutes
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signed = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${timestamp}.${payload}`),
  );
  const expected = new Uint8Array(signed);

  for (const signature of signatures) {
    if (!signature.match(/^[0-9a-f]+$/i) || signature.length % 2 !== 0)
      continue;
    const received = new Uint8Array(
      signature.match(/.{2}/g)!.map((b) => parseInt(b, 16)),
    );
    if (expected.byteLength !== received.byteLength) continue;
    // Constant-time comparison
    let diff = 0;
    for (let i = 0; i < expected.byteLength; i++)
      diff |= expected[i] ^ received[i];
    if (diff === 0) return true;
  }
  return false;
}

function buildReceiptId(record: DonationRecord): string {
  const source =
    record.stripe_invoice_id ||
    record.stripe_payment_intent_id ||
    `${record.donor_email}-${record.paid_at}`;
  const suffix = source
    .replace(/[^a-z0-9]/gi, "")
    .slice(-10)
    .toUpperCase();
  const year = new Date(record.paid_at).getUTCFullYear();
  return `ADA-${year}-${suffix || "DONATION"}`;
}

async function handleConfirmedDonation(record: DonationRecord): Promise<void> {
  if (!record.donor_email) return;

  const {
    findDonationByStripeReference,
    saveDonationRecord,
    thirtyDayFollowUpDueAt,
  } = await import("../../../lib/donations");
  const { sendDonationFollowUpNotification, sendDonationReceipt } =
    await import("../../../lib/email");

  const existing = await findDonationByStripeReference({
    stripePaymentIntentId: record.stripe_payment_intent_id,
    stripeInvoiceId: record.stripe_invoice_id,
  });
  const receiptId =
    existing?.receipt_id || record.receipt_id || buildReceiptId(record);
  const followUpDueAt =
    existing?.follow_up_due_at ||
    record.follow_up_due_at ||
    thirtyDayFollowUpDueAt(record.paid_at);
  const stripeReference =
    record.stripe_invoice_id ||
    record.stripe_payment_intent_id ||
    record.stripe_subscription_id ||
    "unknown";

  await saveDonationRecord({
    ...record,
    receipt_id: receiptId,
    follow_up_due_at: followUpDueAt,
    follow_up_status: existing?.follow_up_status || "pending_30_day_update",
    thank_you_sent_at: existing?.thank_you_sent_at || null,
  });

  if (existing?.thank_you_sent_at) return;

  await sendDonationReceipt({
    email: record.donor_email,
    name: record.donor_name,
    amount: record.amount_cents / 100,
    project: record.project_slug,
    frequency: record.frequency,
    locale: record.locale,
    receiptId,
    followUpDueAt,
  });

  await sendDonationFollowUpNotification({
    email: record.donor_email,
    name: record.donor_name,
    amount: record.amount_cents / 100,
    project: record.project_slug,
    frequency: record.frequency,
    receiptId,
    followUpDueAt,
    stripeReference,
  });

  await saveDonationRecord({
    ...record,
    receipt_id: receiptId,
    follow_up_due_at: followUpDueAt,
    follow_up_status: "pending_30_day_update",
    thank_you_sent_at: new Date().toISOString(),
  });
}

export const POST: APIRoute = async ({ request }) => {
  const sigHeader = request.headers.get("stripe-signature");
  const webhookSecret = getWebhookSecret();
  if (!sigHeader || !webhookSecret) {
    return new Response("Bad request", { status: 400 });
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 1024 * 1024) {
    return new Response("Payload too large", { status: 413 });
  }

  const body = await request.text();
  const valid = await verifySignature(body, sigHeader, webhookSecret);
  if (!valid) {
    return new Response("Invalid signature", { status: 400 });
  }

  let event: any;
  try {
    event = JSON.parse(body);
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  if (
    typeof event.livemode === "boolean" &&
    event.livemode !== expectedLiveMode()
  ) {
    return new Response("Stripe mode mismatch", { status: 400 });
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const pi = event.data.object;
      if (pi.invoice || pi.metadata?.type === "monthly") break;
      const { donationFromStripePaymentIntent } =
        await import("../../../lib/donations");
      await handleConfirmedDonation(donationFromStripePaymentIntent(pi));
      break;
    }
    case "invoice.payment_succeeded": {
      const invoice = event.data.object;
      if ((invoice.amount_paid || 0) > 0) {
        const { donationFromStripeInvoice } =
          await import("../../../lib/donations");
        const donation = donationFromStripeInvoice(invoice);
        await handleConfirmedDonation(donation);
      }
      break;
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const prerender = false;
