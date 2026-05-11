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
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const receiptId = `ADA-${Date.now().toString(36).toUpperCase()}`;

  // Generate PDF receipt
  let pdfBuffer: ArrayBuffer | null = null;
  try {
    const { generateReceiptHtml, generateReceiptPdf } = await import('./receipt');
    const html = generateReceiptHtml({ name: data.name, email: data.email, amount: data.amount, project: data.project, date, receiptId });
    pdfBuffer = await generateReceiptPdf(html, null);
  } catch {}

  const htmlEmail = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; padding: 24px 0; border-bottom: 2px solid #16a34a;">
        <div style="display: inline-block; width: 40px; height: 40px; background: linear-gradient(135deg, #22c55e, #15803d); border-radius: 10px; line-height: 40px; color: white; font-weight: bold; font-size: 12px;">ADA</div>
        <h1 style="margin: 12px 0 4px; font-size: 20px; color: #111827;">Thank you, ${data.name}!</h1>
        <p style="margin: 0; color: #6b7280; font-size: 14px;">Your donation has been received</p>
      </div>
      <div style="padding: 24px 0;">
        <div style="background: #f0fdf4; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 20px;">
          <p style="margin: 0 0 4px; font-size: 13px; color: #166534;">Amount donated</p>
          <p style="margin: 0; font-size: 32px; font-weight: 700; color: #15803d;">$${data.amount.toFixed(2)}</p>
          ${data.project ? `<p style="margin: 8px 0 0; font-size: 13px; color: #166534;">to ${data.project}</p>` : ''}
        </div>
        <p style="font-size: 14px; color: #4b5563; line-height: 1.6;">
          Your generosity directly supports widows, orphans, and young women in Cameroon. 80% of your donation goes straight to programs that change lives.
        </p>
        <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin: 16px 0; font-size: 13px; color: #6b7280;">
          <p style="margin: 0;"><strong>Receipt:</strong> ${receiptId}</p>
          <p style="margin: 4px 0 0;"><strong>Date:</strong> ${date}</p>
        </div>
      </div>
      <div style="text-align: center; padding: 20px 0; border-top: 1px solid #e5e7eb;">
        <a href="https://apotidev.org/donate" style="display: inline-block; padding: 10px 24px; background: #16a34a; color: white; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600;">Share Your Support</a>
      </div>
      <div style="text-align: center; padding-top: 16px; font-size: 11px; color: #9ca3af;">
        <p>Apoti Development Association · Cameroon</p>
        <p>info@apotidev.org · +237 676 282 346</p>
      </div>
    </div>
  `;

  const emailPayload: any = {
    from: FROM_EMAIL,
    to: data.email,
    subject: `Thank you for your donation, ${data.name}!`,
    html: htmlEmail,
  };

  // Attach PDF if generated
  if (pdfBuffer) {
    emailPayload.attachments = [{
      filename: `ADA-Receipt-${receiptId}.pdf`,
      content: Buffer.from(pdfBuffer).toString('base64'),
    }];
  }

  if (!RESEND_API_KEY) {
    console.log(`[email] Would send receipt to ${data.email}: ${receiptId}`);
    return { success: true, simulated: true };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
    body: JSON.stringify(emailPayload),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Email send failed: ${res.status} ${err}`);
  }

  return { success: true };
}
