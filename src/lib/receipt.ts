// Receipt PDF generation via Cloudflare Browser Rendering

export function generateReceiptHtml(data: {
  name: string;
  email: string;
  amount: number;
  project?: string;
  date: string;
  receiptId: string;
}): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 40px; color: #1f2937; }
    .container { max-width: 600px; margin: 0 auto; }
    .header { display: flex; align-items: center; gap: 12px; margin-bottom: 32px; padding-bottom: 20px; border-bottom: 2px solid #16a34a; }
    .logo { width: 48px; height: 48px; background: linear-gradient(135deg, #22c55e, #15803d); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px; }
    .org-name { font-size: 20px; font-weight: 700; color: #111827; }
    .org-sub { font-size: 12px; color: #6b7280; }
    .title { font-size: 24px; font-weight: 700; color: #15803d; margin: 24px 0 8px; }
    .subtitle { font-size: 14px; color: #6b7280; margin-bottom: 32px; }
    .details { background: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 24px; }
    .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
    .row:last-child { border-bottom: none; }
    .label { font-size: 13px; color: #6b7280; }
    .value { font-size: 13px; font-weight: 600; color: #111827; }
    .amount-row .value { font-size: 20px; color: #15803d; }
    .message { background: #f0fdf4; border-left: 4px solid #16a34a; padding: 16px; border-radius: 0 8px 8px 0; margin: 24px 0; font-size: 13px; color: #166534; line-height: 1.6; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #9ca3af; text-align: center; }
    .tax-note { font-size: 12px; color: #6b7280; margin-top: 24px; padding: 12px; background: #fefce8; border-radius: 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">ADA</div>
      <div>
        <div class="org-name">Apoti Development Association</div>
        <div class="org-sub">Empowering communities in Cameroon since 2021</div>
      </div>
    </div>

    <div class="title">Donation Receipt</div>
    <div class="subtitle">Thank you for your generous contribution</div>

    <div class="details">
      <div class="row">
        <span class="label">Receipt Number</span>
        <span class="value">${data.receiptId}</span>
      </div>
      <div class="row">
        <span class="label">Date</span>
        <span class="value">${data.date}</span>
      </div>
      <div class="row">
        <span class="label">Donor</span>
        <span class="value">${data.name}</span>
      </div>
      <div class="row">
        <span class="label">Email</span>
        <span class="value">${data.email}</span>
      </div>
      ${data.project ? `<div class="row"><span class="label">Designated To</span><span class="value">${data.project}</span></div>` : ''}
      <div class="row amount-row">
        <span class="label">Amount</span>
        <span class="value">$${data.amount.toFixed(2)} USD</span>
      </div>
    </div>

    <div class="message">
      Your donation makes a real difference. 80% of every dollar goes directly to programs supporting widows, orphans, and young women in Cameroon. Thank you for being part of this mission.
    </div>

    <div class="tax-note">
      <strong>Tax Information:</strong> Apoti Development Association is a registered non-profit organization in Cameroon. Please consult your tax advisor regarding the deductibility of this donation in your jurisdiction.
    </div>

    <div class="footer">
      <p>Apoti Development Association · Cameroon, Central Africa</p>
      <p>info@apotidev.org · +237 676 282 346</p>
      <p>apotidev.org</p>
    </div>
  </div>
</body>
</html>`;
}

export async function generateReceiptPdf(html: string, env: any): Promise<ArrayBuffer | null> {
  try {
    // Use Cloudflare Browser Rendering API
    const response = await fetch(
      `https://browser.cloudflare.com/pdf`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          html,
          options: {
            format: "A4",
            margin: { top: "20px", bottom: "20px", left: "20px", right: "20px" },
          },
        }),
      }
    );

    if (!response.ok) return null;
    return await response.arrayBuffer();
  } catch {
    return null;
  }
}
