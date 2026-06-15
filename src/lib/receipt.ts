export function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export type ReceiptData = {
  name: string;
  email: string;
  amount: number;
  project?: string;
  date: string;
  receiptId: string;
};

export function generateReceiptHtml(data: ReceiptData): string {
  const receiptId = escapeHtml(data.receiptId);
  const date = escapeHtml(data.date);
  const name = escapeHtml(data.name);
  const email = escapeHtml(data.email);
  const project = data.project ? escapeHtml(data.project) : "";
  const logoUrl = "https://apotidev.org/brand/ada-logo.png";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 40px; color: #1f2937; }
    .container { max-width: 600px; margin: 0 auto; }
    .header { display: flex; align-items: center; gap: 12px; margin-bottom: 32px; padding-bottom: 20px; border-bottom: 2px solid #16a34a; }
    .logo { width: 52px; height: 52px; border-radius: 12px; overflow: hidden; flex: 0 0 auto; background: #f8fafc; display: flex; align-items: center; justify-content: center; }
    .logo img { width: 100%; height: 100%; object-fit: contain; display: block; }
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
      <div class="logo"><img src="${logoUrl}" alt="Apoti Development Association" /></div>
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
        <span class="value">${receiptId}</span>
      </div>
      <div class="row">
        <span class="label">Date</span>
        <span class="value">${date}</span>
      </div>
      <div class="row">
        <span class="label">Donor</span>
        <span class="value">${name}</span>
      </div>
      <div class="row">
        <span class="label">Email</span>
        <span class="value">${email}</span>
      </div>
      ${project ? `<div class="row"><span class="label">Designated To</span><span class="value">${project}</span></div>` : ""}
      <div class="row amount-row">
        <span class="label">Amount</span>
        <span class="value">$${data.amount.toFixed(2)} USD</span>
      </div>
    </div>

    <div class="message">
      Your donation makes a real difference. ADA's public allocation model targets 80% program delivery for work supporting widows, orphans, and young women in Cameroon. Thank you for being part of this mission.
    </div>

    <div class="tax-note">
      <strong>Tax Information:</strong> This receipt is for your personal records only. Apoti Development Association is a registered NGO in Cameroon (N&deg; 415/G.37/D14/VolI/SAAJP) and is not registered as a charity in Canada, the US, the UK, or the EU. Donations are <strong>not tax-deductible</strong> in those jurisdictions.
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

function pdfText(value: unknown): string {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[^\x20-\x7e]/g, "")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) lines.push(current);
  return lines;
}

function money(amount: number): string {
  return `$${amount.toFixed(2)} USD`;
}

function projectName(project?: string): string {
  if (!project || project === "general") return "ADA general programs";
  return project
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function pdfArrayBuffer(content: string): ArrayBuffer {
  const encoder = new TextEncoder();
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
    `<< /Length ${encoder.encode(content).length} >>\nstream\n${content}\nendstream`,
  ];

  let pdf = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
  const offsets = [0];
  for (let i = 0; i < objects.length; i++) {
    offsets.push(encoder.encode(pdf).length);
    pdf += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
  }
  const xrefOffset = encoder.encode(pdf).length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (let i = 1; i < offsets.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  const bytes = encoder.encode(pdf);
  return bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  );
}

export async function generateReceiptPdf(
  data: ReceiptData,
): Promise<ArrayBuffer> {
  const commands: string[] = [];
  const text = (
    x: number,
    y: number,
    value: string,
    size = 11,
    font = "F1",
    color = "0.12 0.16 0.22",
  ) => {
    commands.push(
      `BT /${font} ${size} Tf ${color} rg 1 0 0 1 ${x} ${y} Tm (${pdfText(value)}) Tj ET`,
    );
  };
  const rect = (
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
  ) => commands.push(`${color} rg ${x} ${y} ${width} ${height} re f`);
  const line = (x1: number, y1: number, x2: number, y2: number) =>
    commands.push(`0.88 0.91 0.95 RG 1 w ${x1} ${y1} m ${x2} ${y2} l S`);

  rect(0, 0, 595.28, 841.89, "1 1 1");
  rect(0, 765, 595.28, 76, "0.08 0.50 0.25");
  rect(48, 784, 44, 44, "1 1 1");
  text(58, 800, "ADA", 15, "F2", "0.08 0.50 0.25");
  text(108, 810, "Apoti Development Association", 20, "F2", "1 1 1");
  text(
    108,
    790,
    "Empowering communities in Cameroon since 2021",
    10,
    "F1",
    "0.90 1 0.94",
  );

  text(48, 718, "Donation Receipt", 24, "F2", "0.08 0.45 0.22");
  text(
    48,
    697,
    "Thank you for your generous contribution.",
    11,
    "F1",
    "0.38 0.43 0.50",
  );
  text(390, 721, "For personal records", 10, "F2", "0.60 0.36 0.02");
  text(390, 706, "Not a tax-deductible receipt", 9, "F1", "0.60 0.36 0.02");

  rect(48, 470, 499, 190, "0.98 0.98 0.99");
  const rows = [
    ["Receipt Number", data.receiptId],
    ["Date", data.date],
    ["Donor", data.name],
    ["Email", data.email],
    ["Designated To", projectName(data.project)],
    ["Amount", money(data.amount)],
  ];
  let y = 628;
  for (const [label, value] of rows) {
    text(72, y, label, 10, "F1", "0.42 0.45 0.50");
    text(
      230,
      y,
      value,
      label === "Amount" ? 15 : 10,
      "F2",
      label === "Amount" ? "0.08 0.45 0.22" : "0.07 0.09 0.15",
    );
    if (label !== "Amount") line(72, y - 14, 523, y - 14);
    y -= 30;
  }

  rect(48, 360, 499, 72, "0.94 0.99 0.96");
  text(72, 405, "Your gift matters", 13, "F2", "0.08 0.39 0.20");
  const message =
    "ADA's public allocation model targets 80% program delivery for work supporting widows, orphans, and young women in Cameroon.";
  let messageY = 385;
  for (const wrapped of wrapText(message, 78)) {
    text(72, messageY, wrapped, 10, "F1", "0.08 0.39 0.20");
    messageY -= 14;
  }

  rect(48, 242, 499, 82, "1 0.99 0.90");
  text(72, 295, "Tax information", 12, "F2", "0.50 0.33 0.02");
  const note =
    "This receipt is for personal records only. Apoti Development Association is a registered NGO in Cameroon (No. 415/G.37/D14/VolI/SAAJP) and is not registered as a charity in Canada, the US, the UK, or the EU. Donations are not tax-deductible in those jurisdictions.";
  let noteY = 277;
  for (const wrapped of wrapText(note, 92)) {
    text(72, noteY, wrapped, 8.8, "F1", "0.42 0.32 0.10");
    noteY -= 12;
  }

  line(48, 185, 547, 185);
  text(48, 160, "Apoti Development Association", 10, "F2", "0.42 0.45 0.50");
  text(48, 144, "Cameroon, Central Africa", 9, "F1", "0.55 0.58 0.64");
  text(
    48,
    128,
    "info@apotidev.org  |  +237 676 282 346  |  apotidev.org",
    9,
    "F1",
    "0.55 0.58 0.64",
  );

  return pdfArrayBuffer(commands.join("\n"));
}
