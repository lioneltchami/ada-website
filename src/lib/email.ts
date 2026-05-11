// useSend email client (API-compatible with Resend)
// Sign up at https://app.usesend.com to get your API key

const RESEND_API_KEY = (import.meta as any).env?.RESEND_API_KEY;
const FROM_EMAIL = (import.meta as any).env?.FROM_EMAIL || "ADA <noreply@apotidev.org>";

interface SendEmailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string;
}

export async function sendEmail({ to, subject, html, text, replyTo }: SendEmailOptions) {
  if (!RESEND_API_KEY) {
    console.log(`[email] Would send to ${to}: ${subject}`);
    return { success: true, simulated: true };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html, text, reply_to: replyTo }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Email send failed: ${res.status} ${err}`);
  }

  return { success: true };
}

export async function sendContactNotification(data: { name: string; email: string; subject: string; message: string }) {
  return sendEmail({
    to: "info@apotidev.org",
    subject: `Contact Form: ${data.subject}`,
    replyTo: data.email,
    text: `Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`,
  });
}

export async function sendNewsletterConfirmation(email: string) {
  return sendEmail({
    to: email,
    subject: "Welcome to the ADA Newsletter",
    text: "Thank you for subscribing to the Apoti Development Association newsletter.\n\nYou'll receive updates about our programs and impact in Cameroon.\n\nWith gratitude,\nApoti Development Association",
  });
}

export async function sendDonationReceipt(data: { email: string; name: string; amount: number; project?: string }) {
  return sendEmail({
    to: data.email,
    subject: `Thank you for your donation, ${data.name}!`,
    text: `Dear ${data.name},\n\nThank you for your generous donation of $${data.amount}${data.project ? ` to ${data.project}` : ""}.\n\nYour support makes a real difference in the lives of vulnerable communities in Cameroon.\n\nWith gratitude,\nApoti Development Association\ninfo@apotidev.org`,
  });
}
