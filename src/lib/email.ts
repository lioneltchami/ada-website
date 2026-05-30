// useSend email client (API-compatible with Resend)
// Sign up at https://app.usesend.com to get your API key

import { getEnv } from "./runtime-env";

function resendApiKey(): string | undefined {
  return getEnv("RESEND_API_KEY");
}

function fromEmail(): string {
  return getEnv("FROM_EMAIL") || "ADA <noreply@apotidev.org>";
}

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

function assertEmailConfigured() {
  if (!resendApiKey() && isProduction()) {
    throw new Error("RESEND_API_KEY is not configured");
  }
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

interface SendEmailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  replyTo,
}: SendEmailOptions) {
  assertEmailConfigured();
  const apiKey = resendApiKey();

  if (!apiKey) {
    console.log(`[email] Would send to ${to}: ${subject}`);
    return { success: true, simulated: true };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: fromEmail(),
      to,
      subject,
      html,
      text,
      reply_to: replyTo,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Email send failed: ${res.status} ${err}`);
  }

  return { success: true };
}

export async function sendContactNotification(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  return sendEmail({
    to: "info@apotidev.org",
    subject: `Contact Form: ${data.subject}`,
    replyTo: data.email,
    text: `Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`,
  });
}

export type SponsorInquiryEmail = {
  name: string;
  email: string;
  phone?: string;
  organization: string;
  country: string;
  sponsorType: string;
  interest: string;
  budgetRange: string;
  preferredTiming: string;
  recognitionPreference: string;
  fundingPurpose: string;
  reportingNeeds: string[];
  invoiceOrWire: boolean;
  callPreference: string;
  notes?: string;
};

export async function sendSponsorInquiryNotification(
  data: SponsorInquiryEmail,
) {
  const reportingNeeds = data.reportingNeeds.length
    ? data.reportingNeeds.join(", ")
    : "None selected";

  return sendEmail({
    to: "info@apotidev.org",
    subject: `Sponsor Inquiry: ${data.organization}`,
    replyTo: data.email,
    text: [
      "New sponsor inquiry",
      "",
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Phone / WhatsApp: ${data.phone || "Not provided"}`,
      `Organization: ${data.organization}`,
      `Country: ${data.country}`,
      "",
      `Sponsor type: ${data.sponsorType}`,
      `Sponsorship interest: ${data.interest}`,
      `Estimated range: ${data.budgetRange}`,
      `Preferred timing: ${data.preferredTiming}`,
      `Recognition preference: ${data.recognitionPreference}`,
      `Invoice / wire / direct-transfer need: ${data.invoiceOrWire ? "Yes" : "No"}`,
      `Call preference: ${data.callPreference}`,
      `Reporting or due diligence needs: ${reportingNeeds}`,
      "",
      "What they want to fund:",
      data.fundingPurpose,
      "",
      "Additional notes:",
      data.notes || "None provided",
      "",
      "Reminder: do not request or process bank/card details through email. Confirm payment path separately.",
    ].join("\n"),
  });
}

export async function sendNewsletterConfirmation(email: string) {
  return sendEmail({
    to: email,
    subject: "Welcome to the ADA Newsletter",
    text: "Thank you for subscribing to the Apoti Development Association newsletter.\n\nYou'll receive updates about our programs and impact in Cameroon.\n\nWith gratitude,\nApoti Development Association",
  });
}

type DonationFrequency = "one-time" | "monthly";
type DonationLocale = "en" | "fr";

function formatDate(
  value: Date | string,
  locale: DonationLocale = "en",
): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toLocaleDateString(locale === "fr" ? "fr-CA" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatProjectName(project?: string): string {
  if (!project || project === "general") return "ADA general programs";
  return project
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function defaultReceiptId(): string {
  return `ADA-${Date.now().toString(36).toUpperCase()}`;
}

const DONATION_EMAIL_COPY = {
  en: {
    heading: "Thank you",
    received: "Your donation has been received",
    amountDonated: "Amount donated",
    intro:
      "Your generosity directly supports widows, orphans, and young women in Cameroon. ADA's public allocation model targets 80% program delivery for work that changes lives.",
    receipt: "Receipt",
    date: "Date",
    next: "What happens next",
    stepReceipt: "Your receipt is attached for personal records.",
    stepRecords:
      "ADA reconciles the gift with its project records and field priorities.",
    stepUpdate: "You are queued for a 30-day impact update around",
    restriction:
      "If you gave for a specific project, ADA will use the gift for that project or a closely related program need if timing or field conditions require it.",
    share: "Share Your Support",
    footer: "Apoti Development Association · Cameroon",
    oneTime: "donation",
    monthly: "monthly donation",
    subject: "Thank you for your",
  },
  fr: {
    heading: "Merci",
    received: "Votre don a bien été reçu",
    amountDonated: "Montant du don",
    intro:
      "Votre générosité soutient directement les veuves, les orphelins et les jeunes femmes au Cameroun. Le modèle public d'ADA vise 80 % de livraison directe des programmes.",
    receipt: "Reçu",
    date: "Date",
    next: "Ce qui se passe ensuite",
    stepReceipt: "Votre reçu est joint pour vos dossiers personnels.",
    stepRecords:
      "ADA rapproche le don avec ses registres de projet et ses priorités terrain.",
    stepUpdate:
      "Votre don est placé dans la file de suivi pour une mise à jour d'impact vers le",
    restriction:
      "Si vous avez donné pour un projet précis, ADA utilisera le don pour ce projet ou pour un besoin de programme étroitement lié si le calendrier ou les conditions terrain l'exigent.",
    share: "Partager votre soutien",
    footer: "Apoti Development Association · Cameroun",
    oneTime: "don",
    monthly: "don mensuel",
    subject: "Merci pour votre",
  },
} satisfies Record<DonationLocale, Record<string, string>>;

export async function sendDonationReceipt(data: {
  email: string;
  name: string;
  amount: number;
  project?: string;
  frequency?: DonationFrequency;
  locale?: DonationLocale;
  receiptId?: string;
  followUpDueAt?: string;
}) {
  assertEmailConfigured();
  const apiKey = resendApiKey();

  const emailLocale: DonationLocale = data.locale === "fr" ? "fr" : "en";
  const copy = DONATION_EMAIL_COPY[emailLocale];
  const date = formatDate(new Date(), emailLocale);
  const receiptId = data.receiptId || defaultReceiptId();
  const followUpDate = data.followUpDueAt
    ? formatDate(data.followUpDueAt, emailLocale)
    : formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), emailLocale);
  const frequencyLabel =
    data.frequency === "monthly" ? copy.monthly : copy.oneTime;
  const { escapeHtml } = await import("./receipt");
  const safeName = escapeHtml(data.name);
  const safeProject = escapeHtml(formatProjectName(data.project));
  const safeFollowUpDate = escapeHtml(followUpDate);

  // Generate PDF receipt
  let pdfBuffer: ArrayBuffer | null = null;
  try {
    const { generateReceiptHtml, generateReceiptPdf } =
      await import("./receipt");
    const html = generateReceiptHtml({
      name: data.name,
      email: data.email,
      amount: data.amount,
      project: data.project,
      date,
      receiptId,
    });
    pdfBuffer = await generateReceiptPdf(html, null);
  } catch {}

  const htmlEmail = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; padding: 24px 0; border-bottom: 2px solid #16a34a;">
        <div style="display: inline-block; width: 40px; height: 40px; background: linear-gradient(135deg, #22c55e, #15803d); border-radius: 10px; line-height: 40px; color: white; font-weight: bold; font-size: 12px;">ADA</div>
        <h1 style="margin: 12px 0 4px; font-size: 20px; color: #111827;">${copy.heading}, ${safeName}!</h1>
        <p style="margin: 0; color: #6b7280; font-size: 14px;">${copy.received}</p>
      </div>
      <div style="padding: 24px 0;">
        <div style="background: #f0fdf4; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 20px;">
          <p style="margin: 0 0 4px; font-size: 13px; color: #166534;">${copy.amountDonated}</p>
          <p style="margin: 0; font-size: 32px; font-weight: 700; color: #15803d;">$${data.amount.toFixed(2)}</p>
          <p style="margin: 8px 0 0; font-size: 13px; color: #166534;">to ${safeProject}</p>
        </div>
        <p style="font-size: 14px; color: #4b5563; line-height: 1.6;">
          ${copy.intro}
        </p>
        <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin: 16px 0; font-size: 13px; color: #6b7280;">
          <p style="margin: 0;"><strong>${copy.receipt}:</strong> ${receiptId}</p>
          <p style="margin: 4px 0 0;"><strong>${copy.date}:</strong> ${date}</p>
        </div>
        <div style="border: 1px solid #d1fae5; border-radius: 12px; padding: 16px; margin: 20px 0;">
          <p style="margin: 0 0 10px; font-size: 14px; font-weight: 700; color: #111827;">${copy.next}</p>
          <ol style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 13px; line-height: 1.7;">
            <li>${copy.stepReceipt}</li>
            <li>${copy.stepRecords}</li>
            <li>${copy.stepUpdate} <strong>${safeFollowUpDate}</strong>.</li>
          </ol>
        </div>
        <p style="font-size: 13px; color: #6b7280; line-height: 1.6;">
          ${copy.restriction}
        </p>
      </div>
      <div style="text-align: center; padding: 20px 0; border-top: 1px solid #e5e7eb;">
        <a href="https://apotidev.org/donate" style="display: inline-block; padding: 10px 24px; background: #16a34a; color: white; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600;">${copy.share}</a>
      </div>
      <div style="text-align: center; padding-top: 16px; font-size: 11px; color: #9ca3af;">
        <p>${copy.footer}</p>
        <p>info@apotidev.org · +237 676 282 346</p>
      </div>
    </div>
  `;

  const emailPayload: any = {
    from: fromEmail(),
    to: data.email,
    subject: `${copy.subject} ${frequencyLabel}, ${data.name}!`,
    html: htmlEmail,
  };

  // Attach PDF if generated
  if (pdfBuffer) {
    emailPayload.attachments = [
      {
        filename: `ADA-Receipt-${receiptId}.pdf`,
        content: arrayBufferToBase64(pdfBuffer),
      },
    ];
  }

  if (!apiKey) {
    console.log(`[email] Would send receipt to ${data.email}: ${receiptId}`);
    return { success: true, simulated: true, receiptId };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(emailPayload),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Email send failed: ${res.status} ${err}`);
  }

  return { success: true, receiptId };
}

export async function sendDonationFollowUpNotification(data: {
  email: string;
  name: string;
  amount: number;
  project?: string;
  frequency: DonationFrequency;
  receiptId: string;
  followUpDueAt: string;
  stripeReference: string;
}) {
  return sendEmail({
    to: "info@apotidev.org",
    subject: `30-day impact update due: ${data.name}`,
    replyTo: data.email,
    text: [
      "Donation follow-up task",
      "",
      `Donor: ${data.name}`,
      `Email: ${data.email}`,
      `Gift: $${data.amount.toFixed(2)} USD (${data.frequency})`,
      `Project: ${formatProjectName(data.project)}`,
      `Receipt: ${data.receiptId}`,
      `Stripe reference: ${data.stripeReference}`,
      "",
      `Send the 30-day impact update by: ${formatDate(data.followUpDueAt)}`,
      "",
      "Suggested update format:",
      "1. Thank them again.",
      "2. State what ADA did next with the gift or the relevant program queue.",
      "3. Share one field photo/story/report link when available.",
      "4. Invite questions or a project-specific report request.",
      "",
      "Do not include sensitive beneficiary details without consent.",
    ].join("\n"),
  });
}

export async function sendDonationFollowUpDigest(data: {
  donations: Array<{
    donor_email: string;
    donor_name: string;
    amount_cents: number;
    currency: string;
    frequency: DonationFrequency;
    project_slug: string;
    receipt_id?: string | null;
    follow_up_due_at?: string | null;
    paid_at: string;
  }>;
  generatedAt?: Date;
}) {
  const generatedAt = data.generatedAt || new Date();
  const rows = data.donations.map((donation, index) => {
    const amount = `${donation.currency.toUpperCase()} ${(donation.amount_cents / 100).toFixed(2)}`;
    return [
      `${index + 1}. ${donation.donor_name} <${donation.donor_email}>`,
      `   Gift: ${amount} (${donation.frequency})`,
      `   Project: ${formatProjectName(donation.project_slug)}`,
      `   Paid: ${formatDate(donation.paid_at)}`,
      `   Due: ${donation.follow_up_due_at ? formatDate(donation.follow_up_due_at) : "No due date recorded"}`,
      `   Receipt: ${donation.receipt_id || "Not recorded"}`,
    ].join("\n");
  });

  return sendEmail({
    to: "info@apotidev.org",
    subject: `Donation follow-ups due: ${data.donations.length}`,
    text: [
      "Donation follow-up digest",
      "",
      `Generated: ${formatDate(generatedAt)}`,
      `Due follow-ups: ${data.donations.length}`,
      "",
      ...rows,
      "",
      "Recommended staff action:",
      "1. Review project notes, photos, receipts, or field updates.",
      "2. Send a concise donor update with what changed and what comes next.",
      "3. Mark the donor follow-up as sent in the donation record or internal tracker.",
      "",
      "Do not include sensitive beneficiary details without consent.",
    ].join("\n\n"),
  });
}
