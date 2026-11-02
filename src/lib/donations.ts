import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getEnv } from "./runtime-env";

export interface DonationRecord {
  id?: string;
  stripe_payment_intent_id: string | null;
  stripe_invoice_id: string | null;
  stripe_subscription_id: string | null;
  amount_cents: number;
  currency: string;
  frequency: "one-time" | "monthly";
  locale?: "en" | "fr";
  donor_email: string;
  donor_name: string;
  is_anonymous: boolean;
  project_slug: string;
  paid_at: string;
  receipt_id?: string;
  thank_you_sent_at?: string | null;
  staff_follow_up_sent_at?: string | null;
  follow_up_due_at?: string | null;
  follow_up_reminder_sent_at?: string | null;
  follow_up_reminder_outbox_id?: string | null;
  follow_up_status?: "pending_30_day_update" | "sent" | "not_required";
}

export type DonationEmailOutboxKind =
  | "donor_receipt"
  | "staff_follow_up"
  | "follow_up_digest";

export interface DonationEmailOutboxRecord {
  id: string;
  donation_id: string | null;
  kind: DonationEmailOutboxKind;
  idempotency_key: string;
  email_payload: Record<string, unknown>;
  payload_sha256: string;
  status: "pending" | "processing" | "sent" | "needs_review";
  attempt_count: number;
  first_attempt_at: string | null;
  lease_token: string | null;
}

let adminClient: SupabaseClient | null = null;

function isProduction(): boolean {
  const env = (import.meta as any).env;
  const nodeEnv =
    typeof process !== "undefined" ? process.env.NODE_ENV : undefined;
  const prodEnv = typeof process !== "undefined" ? process.env.PROD : undefined;
  return Boolean(
    env?.PROD ||
    env?.MODE === "production" ||
    nodeEnv === "production" ||
    prodEnv === "true",
  );
}

function getSupabaseAdmin(): SupabaseClient | null {
  const url = getEnv("SUPABASE_URL") || getEnv("PUBLIC_SUPABASE_URL");
  const serviceKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");

  if (!url || !serviceKey) {
    if (isProduction()) {
      throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");
    }
    return null;
  }

  if (!adminClient) {
    adminClient = createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return adminClient;
}

function metadataValue(
  metadata: Record<string, unknown> | undefined,
  key: string,
): string {
  const value = metadata?.[key];
  return typeof value === "string" ? value : "";
}

function paidAtFromUnix(created: unknown): string {
  const seconds =
    typeof created === "number" && Number.isFinite(created)
      ? created
      : Date.now() / 1000;
  return new Date(seconds * 1000).toISOString();
}

function stringValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function localeValue(metadata: Record<string, unknown>): "en" | "fr" {
  return metadataValue(metadata, "locale") === "fr" ? "fr" : "en";
}

export function thirtyDayFollowUpDueAt(paidAt: string): string {
  const dueAt = new Date(paidAt);
  dueAt.setUTCDate(dueAt.getUTCDate() + 30);
  return dueAt.toISOString();
}

export function donationFromStripePaymentIntent(pi: any): DonationRecord {
  const metadata = pi.metadata || {};
  const email = (
    metadataValue(metadata, "donor_email") || stringValue(pi.receipt_email)
  ).toLowerCase();
  const paid_at = paidAtFromUnix(pi.created);
  return {
    stripe_payment_intent_id: stringValue(pi.id) || null,
    stripe_invoice_id: null,
    stripe_subscription_id: null,
    amount_cents: Number(pi.amount || 0),
    currency: stringValue(pi.currency).toLowerCase() || "usd",
    frequency: "one-time",
    locale: localeValue(metadata),
    donor_email: email,
    donor_name: metadataValue(metadata, "donor_name") || "Supporter",
    is_anonymous: metadataValue(metadata, "is_anonymous") === "true",
    project_slug: metadataValue(metadata, "project_slug") || "general",
    paid_at,
    follow_up_due_at: thirtyDayFollowUpDueAt(paid_at),
    follow_up_status: "pending_30_day_update",
  };
}

export function donationFromStripeInvoice(invoice: any): DonationRecord {
  const metadata =
    invoice.parent?.subscription_details?.metadata ||
    invoice.subscription_details?.metadata ||
    invoice.metadata ||
    {};
  const invoicePayment = invoice.payments?.data?.[0]?.payment;
  const paymentIntent =
    typeof invoice.payment_intent === "string"
      ? invoice.payment_intent
      : invoice.payment_intent?.id ||
        (typeof invoicePayment?.payment_intent === "string"
          ? invoicePayment.payment_intent
          : invoicePayment?.payment_intent?.id);
  const subscription =
    typeof invoice.subscription === "string"
      ? invoice.subscription
      : invoice.subscription?.id ||
        invoice.parent?.subscription_details?.subscription;
  const email = (
    metadataValue(metadata, "donor_email") ||
    stringValue(invoice.customer_email)
  ).toLowerCase();
  const paid_at = paidAtFromUnix(invoice.created);

  return {
    stripe_payment_intent_id: stringValue(paymentIntent) || null,
    stripe_invoice_id: stringValue(invoice.id) || null,
    stripe_subscription_id: stringValue(subscription) || null,
    amount_cents: Number(invoice.amount_paid || invoice.amount_due || 0),
    currency: stringValue(invoice.currency).toLowerCase() || "usd",
    frequency: "monthly",
    locale: localeValue(metadata),
    donor_email: email,
    donor_name: metadataValue(metadata, "donor_name") || "Supporter",
    is_anonymous: metadataValue(metadata, "is_anonymous") === "true",
    project_slug: metadataValue(metadata, "project_slug") || "general",
    paid_at,
    follow_up_due_at: thirtyDayFollowUpDueAt(paid_at),
    follow_up_status: "pending_30_day_update",
  };
}

export async function findDonationByStripeReference(reference: {
  stripePaymentIntentId?: string | null;
  stripeInvoiceId?: string | null;
}): Promise<DonationRecord | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  let query = supabase.from("donations").select("*").limit(1);
  if (reference.stripeInvoiceId) {
    query = query.eq("stripe_invoice_id", reference.stripeInvoiceId);
  } else if (reference.stripePaymentIntentId) {
    query = query.eq(
      "stripe_payment_intent_id",
      reference.stripePaymentIntentId,
    );
  } else {
    return null;
  }

  const { data, error } = await query.maybeSingle();
  if (error) throw new Error(`Donation lookup failed: ${error.message}`);
  return (data as DonationRecord | null) || null;
}

export async function saveDonationRecord(
  record: DonationRecord,
): Promise<void> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.log(
      `[donations] Would persist ${record.frequency} donation for ${record.donor_email}`,
    );
    return;
  }

  const { error } = await supabase.from("donations").upsert(record, {
    onConflict: record.stripe_invoice_id
      ? "stripe_invoice_id"
      : "stripe_payment_intent_id",
  });

  if (error) throw new Error(`Donation persistence failed: ${error.message}`);
}

export async function persistDonationAndEnqueueEmails(input: {
  donation: DonationRecord;
  receiptPayload: Record<string, unknown>;
  receiptPayloadSha256: string;
  staffPayload: Record<string, unknown>;
  staffPayloadSha256: string;
}): Promise<{
  donationId: string;
  receiptOutboxId: string | null;
  staffOutboxId: string | null;
} | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.log("[donations] Would persist donation and enqueue email jobs");
    return null;
  }

  const { data, error } = await supabase.rpc("persist_donation_email_outbox", {
    p_donation: input.donation,
    p_receipt_payload: input.receiptPayload,
    p_receipt_sha256: input.receiptPayloadSha256,
    p_staff_payload: input.staffPayload,
    p_staff_sha256: input.staffPayloadSha256,
  });
  if (error) {
    throw new Error(`Donation outbox enqueue failed: ${error.message}`);
  }

  const result = Array.isArray(data) ? data[0] : data;
  if (!result?.donation_id) {
    throw new Error("Donation outbox enqueue returned no donation ID");
  }
  return {
    donationId: result.donation_id,
    receiptOutboxId: result.receipt_outbox_id || null,
    staffOutboxId: result.staff_outbox_id || null,
  };
}

export async function enqueueFollowUpDigest(input: {
  donationIds: string[];
  emailPayload: Record<string, unknown>;
  payloadSha256: string;
  now?: Date;
}): Promise<string | null> {
  if (input.donationIds.length === 0) return null;
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data, error } = await supabase.rpc("enqueue_follow_up_digest", {
    p_donation_ids: input.donationIds,
    p_email_payload: input.emailPayload,
    p_payload_sha256: input.payloadSha256,
    p_now: (input.now || new Date()).toISOString(),
  });
  if (error)
    throw new Error(`Follow-up digest enqueue failed: ${error.message}`);
  return typeof data === "string" ? data : null;
}

export async function claimDonationEmailOutbox(
  input: {
    limit?: number;
    onlyIds?: string[];
  } = {},
): Promise<DonationEmailOutboxRecord[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];
  const { data, error } = await supabase.rpc("claim_donation_email_outbox", {
    p_limit: input.limit || 20,
    p_only_ids: input.onlyIds?.length ? input.onlyIds : null,
  });
  if (error)
    throw new Error(`Donation email outbox claim failed: ${error.message}`);
  return (data || []) as DonationEmailOutboxRecord[];
}

export async function completeDonationEmailOutbox(input: {
  outboxId: string;
  leaseToken: string;
  providerMessageId: string | null;
}): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return false;
  const { data, error } = await supabase.rpc("complete_donation_email_outbox", {
    p_outbox_id: input.outboxId,
    p_lease_token: input.leaseToken,
    p_provider_message_id: input.providerMessageId,
  });
  if (error)
    throw new Error(`Donation email completion failed: ${error.message}`);
  return data === true;
}

export async function failDonationEmailOutbox(input: {
  outboxId: string;
  leaseToken: string;
  error: string;
  needsReview?: boolean;
}): Promise<string> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return "not_persisted";
  const { data, error } = await supabase.rpc("fail_donation_email_outbox", {
    p_outbox_id: input.outboxId,
    p_lease_token: input.leaseToken,
    p_error: input.error.slice(0, 2000),
    p_needs_review: input.needsReview || false,
  });
  if (error)
    throw new Error(`Donation email retry scheduling failed: ${error.message}`);
  return String(data);
}

function stripeReferenceFilter(reference: {
  stripePaymentIntentId?: string | null;
  stripeInvoiceId?: string | null;
}) {
  if (reference.stripeInvoiceId) {
    return {
      match: true as const,
      apply: <T extends { eq: (column: string, value: string) => T }>(q: T) =>
        q.eq("stripe_invoice_id", reference.stripeInvoiceId!),
    };
  }
  if (reference.stripePaymentIntentId) {
    return {
      match: true as const,
      apply: <T extends { eq: (column: string, value: string) => T }>(q: T) =>
        q.eq("stripe_payment_intent_id", reference.stripePaymentIntentId!),
    };
  }
  return { match: false as const, apply: null };
}

/**
 * Atomically claim the thank-you email send for a donation.
 * Returns true only for the first successful claim (WHERE thank_you_sent_at IS NULL).
 * Concurrent webhook retries lose the race and skip sending.
 */
export async function claimDonationThankYou(reference: {
  stripePaymentIntentId?: string | null;
  stripeInvoiceId?: string | null;
  sentAt?: string;
}): Promise<boolean> {
  const filter = stripeReferenceFilter(reference);
  if (!filter.match) return false;

  const supabase = getSupabaseAdmin();
  const sentAt = reference.sentAt || new Date().toISOString();

  if (!supabase) {
    console.log(
      `[donations] Would claim thank-you for ${reference.stripeInvoiceId || reference.stripePaymentIntentId}`,
    );
    return true;
  }

  let query = supabase
    .from("donations")
    .update({ thank_you_sent_at: sentAt })
    .is("thank_you_sent_at", null);
  query = filter.apply(query);

  const { data, error } = await query.select("id").maybeSingle();
  if (error) {
    throw new Error(`Donation thank-you claim failed: ${error.message}`);
  }
  return Boolean(data?.id);
}

/**
 * Release a thank-you claim after a failed send so Stripe retries can try again.
 */
export async function clearDonationThankYou(reference: {
  stripePaymentIntentId?: string | null;
  stripeInvoiceId?: string | null;
}): Promise<void> {
  const filter = stripeReferenceFilter(reference);
  if (!filter.match) return;

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.log(
      `[donations] Would clear thank-you claim for ${reference.stripeInvoiceId || reference.stripePaymentIntentId}`,
    );
    return;
  }

  let query = supabase
    .from("donations")
    .update({ thank_you_sent_at: null })
    .not("thank_you_sent_at", "is", null);
  query = filter.apply(query);

  const { error } = await query;
  if (error) {
    throw new Error(`Donation thank-you clear failed: ${error.message}`);
  }
}

/** Atomically claim the internal follow-up notification independently of the donor receipt. */
export async function claimDonationStaffFollowUp(reference: {
  stripePaymentIntentId?: string | null;
  stripeInvoiceId?: string | null;
  sentAt?: string;
}): Promise<boolean> {
  const filter = stripeReferenceFilter(reference);
  if (!filter.match) return false;
  const supabase = getSupabaseAdmin();
  const sentAt = reference.sentAt || new Date().toISOString();
  if (!supabase) return true;

  let query = supabase
    .from("donations")
    .update({ staff_follow_up_sent_at: sentAt })
    .is("staff_follow_up_sent_at", null);
  query = filter.apply(query);
  const { data, error } = await query.select("id").maybeSingle();
  if (error)
    throw new Error(`Donation staff follow-up claim failed: ${error.message}`);
  return Boolean(data?.id);
}

/** Release only the internal-notification claim after a failed send. */
export async function clearDonationStaffFollowUp(reference: {
  stripePaymentIntentId?: string | null;
  stripeInvoiceId?: string | null;
}): Promise<void> {
  const filter = stripeReferenceFilter(reference);
  if (!filter.match) return;
  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  let query = supabase
    .from("donations")
    .update({ staff_follow_up_sent_at: null })
    .not("staff_follow_up_sent_at", "is", null);
  query = filter.apply(query);
  const { error } = await query;
  if (error)
    throw new Error(`Donation staff follow-up clear failed: ${error.message}`);
}

export async function getDonationsForEmail(
  email: string,
): Promise<DonationRecord[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("donations")
    .select("*")
    .eq("donor_email", email.toLowerCase())
    .order("paid_at", { ascending: false });

  if (error) throw new Error(`Donation lookup failed: ${error.message}`);
  return (data || []) as DonationRecord[];
}

export async function getDueDonationFollowUps(
  now = new Date(),
  limit = 25,
): Promise<DonationRecord[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const reminderBefore = new Date(now);
  reminderBefore.setUTCDate(reminderBefore.getUTCDate() - 7);

  const { data, error } = await supabase
    .from("donations")
    .select("*")
    .eq("follow_up_status", "pending_30_day_update")
    .is("follow_up_reminder_outbox_id", null)
    .lte("follow_up_due_at", now.toISOString())
    .or(
      `follow_up_reminder_sent_at.is.null,follow_up_reminder_sent_at.lt.${reminderBefore.toISOString()}`,
    )
    .order("follow_up_due_at", { ascending: true })
    .limit(limit);

  if (error)
    throw new Error(`Donation follow-up lookup failed: ${error.message}`);
  return (data || []) as DonationRecord[];
}

export async function markDonationFollowUpReminderSent(
  donationIds: string[],
  sentAt = new Date(),
): Promise<void> {
  if (donationIds.length === 0) return;

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.log(
      `[donations] Would mark ${donationIds.length} follow-up reminder(s) sent`,
    );
    return;
  }

  const { error } = await supabase
    .from("donations")
    .update({ follow_up_reminder_sent_at: sentAt.toISOString() })
    .in("id", donationIds);

  if (error) {
    throw new Error(`Donation follow-up update failed: ${error.message}`);
  }
}
