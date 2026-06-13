#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { marked } from "marked";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const INPUT_MD = path.join(
  ROOT,
  "public/docs/diligence/ada-bamenda-girls-dignity-outreach.md",
);
const OUTPUT_PDF = path.join(
  ROOT,
  "public/docs/diligence/ada-bamenda-girls-dignity-outreach.pdf",
);
const CHROME_PATH = process.env.CHROME_PATH || "";

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function parseField(text, names) {
  const labelPattern = names
    .map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
  const patterns = [
    new RegExp(
      `^\\|\\s*\\*\\*(?:${labelPattern})\\*\\*\\s*\\|\\s*([^|\\n]+)`,
      "im",
    ),
    new RegExp(`^\\|\\s*(?:${labelPattern})\\s*\\|\\s*([^|\\n]+)`, "im"),
    new RegExp(`^\\*\\*(?:${labelPattern})\\*\\*[:：]\\s*([^\\n]+)`, "im"),
    new RegExp(`^(?:${labelPattern})[:：]\\s*([^\\n]+)`, "im"),
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return match[1].trim();
  }
  return "";
}

const markdown = await fs.readFile(INPUT_MD, "utf8");
const title =
  markdown.match(/^#\s+(.+)$/m)?.[1] || "ADA Bamenda Girls Dignity Outreach";
const projectDate = parseField(markdown, ["Project Date"]);
const location = parseField(markdown, ["Location"]);
const beneficiaries = parseField(markdown, ["Target Beneficiaries"]);
const budget = parseField(markdown, ["Budget"]);
const status = parseField(markdown, ["Status"]);
const focus = parseField(markdown, ["Focus"]);
const bodyHtml = marked.parse(markdown);

const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(title)}</title>
  <style>
    @page { size: A4; margin: 16mm 14mm 18mm 14mm; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: #0f172a;
      background: #fff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page { page-break-after: always; }
    .page:last-child { page-break-after: auto; }
    .cover {
      min-height: 245mm;
      padding: 18mm 15mm 16mm;
      background: linear-gradient(135deg, rgba(67,56,202,.97), rgba(14,116,144,.96));
      color: #fff;
      border-radius: 20px;
      overflow: hidden;
      position: relative;
    }
    .cover::after {
      content: "";
      position: absolute;
      inset: auto -40px -80px auto;
      width: 220px;
      height: 220px;
      border-radius: 999px;
      background: rgba(255,255,255,.08);
    }
    .eyebrow {
      text-transform: uppercase;
      letter-spacing: .12em;
      font-size: 11px;
      opacity: .85;
      font-weight: 700;
    }
    h1 {
      margin: 18px 0 10px;
      font-size: 30px;
      line-height: 1.08;
      max-width: 7.8in;
    }
    .subtitle {
      font-size: 13px;
      line-height: 1.6;
      max-width: 630px;
      color: rgba(255,255,255,.86);
    }
    .chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
    .chip {
      border-radius: 999px;
      padding: 7px 10px;
      border: 1px solid rgba(255,255,255,.18);
      background: rgba(255,255,255,.08);
      font-size: 11px;
      color: rgba(255,255,255,.92);
    }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
      margin-top: 18px;
    }
    .card {
      background: rgba(255,255,255,.08);
      border: 1px solid rgba(255,255,255,.16);
      border-radius: 14px;
      padding: 12px 14px;
    }
    .label {
      color: rgba(255,255,255,.7);
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: .08em;
    }
    .value {
      font-size: 13px;
      margin-top: 5px;
      line-height: 1.45;
      font-weight: 700;
    }
    .content { margin-top: 12mm; padding: 0 2px; }
    .content h1, .content h2, .content h3 { color: #0f172a; margin-top: 0.9em; }
    .content h1 { font-size: 22px; }
    .content h2 { font-size: 18px; }
    .content h3 { font-size: 14px; }
    .content p, .content li { font-size: 11px; line-height: 1.72; color: #1f2937; }
    .content table {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0 18px;
      font-size: 10px;
    }
    .content th, .content td {
      border: 1px solid #dbe4ee;
      padding: 7px 8px;
      vertical-align: top;
    }
    .content th {
      background: #f8fafc;
      color: #475569;
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: .08em;
    }
    .footer-note {
      margin-top: 10mm;
      font-size: 9px;
      color: #64748b;
      border-top: 1px solid #e2e8f0;
      padding-top: 6mm;
      line-height: 1.5;
    }
    .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
  </style>
</head>
<body>
  <section class="page cover">
    <div class="eyebrow">ADA Bamenda sponsor brief</div>
    <h1>${escapeHtml(title)}</h1>
    <div class="subtitle">A practical dignity outreach for girls in Bamenda, built to be transparent, budgeted, and easy to report.</div>
    <div class="chips">
      <span class="chip">${escapeHtml(projectDate)}</span>
      <span class="chip">${escapeHtml(location)}</span>
      <span class="chip">${escapeHtml(beneficiaries)}</span>
      <span class="chip">${escapeHtml(budget)}</span>
      <span class="chip">${escapeHtml(status)}</span>
    </div>
    <div class="meta-grid">
      <div class="card"><div class="label">Focus</div><div class="value">${escapeHtml(focus)}</div></div>
      <div class="card"><div class="label">Purpose</div><div class="value">Menstrual health, hygiene, dignity items, and a short education session</div></div>
      <div class="card"><div class="label">Target</div><div class="value">${escapeHtml(beneficiaries)}</div></div>
      <div class="card"><div class="label">Budget</div><div class="value">${escapeHtml(budget)}</div></div>
    </div>
  </section>
  <section class="page">
    <div class="content">${bodyHtml}</div>
    <div class="footer-note">
      This PDF was browser-rendered from the markdown sponsor brief in <span class="mono">public/docs/diligence/ada-bamenda-girls-dignity-outreach.md</span>.
    </div>
  </section>
</body>
</html>`;

const browser = await chromium.launch({
  headless: true,
  ...(CHROME_PATH ? { executablePath: CHROME_PATH } : {}),
});

try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 2200 },
  });
  await page.setContent(html, { waitUntil: "load" });
  await page.emulateMedia({ media: "screen" });
  await page.pdf({
    path: OUTPUT_PDF,
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: "0", right: "0", bottom: "0", left: "0" },
  });
  console.log(`Wrote ${path.relative(ROOT, OUTPUT_PDF)}`);
} finally {
  await browser.close();
}
