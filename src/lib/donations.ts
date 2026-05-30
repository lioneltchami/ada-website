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
  follow_up_due_at?: string | null;
  follow_up_reminder_sent_at?: string | null;
  follow_up_status?: "pending_30_day_update" | "sent" | "not_required";
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
    invoice.subscription_details?.metadata || invoice.metadata || {};
  const paymentIntent =
    typeof invoice.payment_intent === "string"
      ? invoice.payment_intent
      : invoice.payment_intent?.id;
  const subscription =
    typeof invoice.subscription === "string"
      ? invoice.subscription
      : invoice.subscription?.id;
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
    .lte("follow_up_due_at", now.toISOString())
    .or(
      `follow_up_reminder_sent_at.is.null,follow_up_reminder_sent_at.lt.${reminderBefore.toISOString()}`,
    )
    .order("follow_up_due_at", { ascending: true })
    .limit(limit);

  if (error) throw new Error(`Donation follow-up lookup failed: ${error.message}`);
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
