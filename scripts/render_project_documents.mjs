#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { marked } from "marked";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const PROJECTS_DIR = path.join(ROOT, "public/docs/projects");
const CHROME_PATH = process.env.CHROME_PATH || "";

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function niceTitle(slug) {
  return slug
    .split("-")
    .map((part) =>
      /^\d{4}$/.test(part) ? part : part.charAt(0).toUpperCase() + part.slice(1),
    )
    .join(" ");
}

function parseField(text, names) {
  const labelPattern = names.map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const patterns = [
    new RegExp(`^\\|\\s*\\*\\*(?:${labelPattern})\\*\\*\\s*\\|\\s*([^|\\n]+)`, "im"),
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

function extractHeading(text, headingTerms) {
  const lines = text.split(/\r?\n/);
  const headingMatch = new RegExp(headingTerms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"), "i");
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^#{1,6}\s+/.test(lines[i]) && headingMatch.test(lines[i])) {
      start = i + 1;
      break;
    }
  }
  if (start === -1) return "";
  let end = lines.length;
  for (let i = start; i < lines.length; i++) {
    if (/^#{1,6}\s+/.test(lines[i])) {
      end = i;
      break;
    }
  }
  return lines.slice(start, end).join("\n").trim();
}

function summaryText(markdown) {
  const withoutTables = markdown
    .split(/\r?\n/)
    .filter((line) => !/^\|/.test(line) && !/^#{1,6}\s+/.test(line))
    .join("\n")
    .trim();
  return withoutTables.split(/\n\s*\n/)[0] || "";
}

function formatMoney(text) {
  return text
    .replace(/\b(\d[\d,]*)\s*CFA\b/g, (_, n) => `${Number(n.replace(/,/g, "")).toLocaleString("en-US")} CFA`)
    .replace(/\$(\d[\d,.]*)/g, (_, n) => `$${n}`);
}

function buildDocMeta(slug, kind, markdown) {
  const title =
    parseField(markdown, ["Project Title", "Project", "Title"]) ||
    (markdown.match(/^#\s+(.+)$/m)?.[1] ?? niceTitle(slug));
  const reference = parseField(markdown, ["Reference", "Reference Number", "Project Reference"]) || "ADA";
  const location = parseField(markdown, ["Location", "Project Location"]);
  const period = parseField(markdown, ["Period", "Duration", "Implementation Period", "Reporting Period", "Date of Activity", "Date"]);
  const budget = parseField(markdown, ["Budget", "Actual Spend", "Actual Expenditure", "Total Expenditure", "Total Budget"]);
  const beneficiaries = parseField(markdown, ["Beneficiaries", "Direct Beneficiaries", "Participants", "Total Beneficiaries"]);
  return {
    title,
    reference,
    location,
    period,
    budget,
    beneficiaries,
    summary: summaryText(markdown),
    kind,
  };
}

function pageTitle(kind) {
  if (kind === "tor") return "Terms of Reference";
  if (kind === "report") return "Project Report";
  return "Financial Report";
}

function subtitleFor(kind, meta) {
  const pieces = [meta.reference];
  if (meta.period) pieces.push(meta.period);
  if (meta.location) pieces.push(meta.location);
  return pieces.filter(Boolean).join(" · ");
}

function coverCard(label, value) {
  return `
    <div class="info-card">
      <div class="label">${escapeHtml(label)}</div>
      <div class="value">${escapeHtml(value || "—")}</div>
    </div>
  `;
}

function renderHtml(meta, bodyHtml, sourceLabel) {
  return `<!doctype html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>${escapeHtml(meta.title)} — ${escapeHtml(pageTitle(meta.kind))}</title>
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
        background:
          linear-gradient(135deg, rgba(15,118,110,.96), rgba(8,47,73,.96)),
          #0f172a;
        color: #fff;
        border-radius: 20px;
        position: relative;
        overflow: hidden;
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
      .brand {
        font-weight: 800;
        letter-spacing: .12em;
        font-size: 11px;
        text-transform: uppercase;
      }
      h1 {
        margin: 18px 0 10px;
        font-size: 31px;
        line-height: 1.06;
        max-width: 8.5in;
      }
      .subtitle {
        font-size: 13px;
        line-height: 1.6;
        max-width: 620px;
        color: rgba(255,255,255,.86);
      }
      .meta-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
        margin-top: 18px;
      }
      .info-card {
        background: rgba(255,255,255,.08);
        border: 1px solid rgba(255,255,255,.16);
        border-radius: 14px;
        padding: 12px 14px;
      }
      .info-card .label {
        color: rgba(255,255,255,.7);
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: .08em;
      }
      .info-card .value {
        font-size: 13px;
        margin-top: 5px;
        line-height: 1.45;
        font-weight: 700;
      }
      .summary {
        margin-top: 18px;
        max-width: 690px;
        background: rgba(255,255,255,.07);
        border: 1px solid rgba(255,255,255,.15);
        border-radius: 16px;
        padding: 14px 16px;
        font-size: 12px;
        line-height: 1.65;
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
      .content {
        margin-top: 12mm;
        padding: 0 2px;
      }
      .content h1, .content h2, .content h3 {
        color: #0f172a;
        margin-top: 0.9em;
      }
      .content h1 { font-size: 22px; }
      .content h2 { font-size: 18px; }
      .content h3 { font-size: 14px; }
      .content p, .content li {
        font-size: 11px;
        line-height: 1.72;
        color: #1f2937;
      }
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
      .content img { max-width: 100%; }
      .content blockquote {
        margin: 12px 0;
        padding: 10px 12px;
        border-left: 4px solid #0f766e;
        background: #f0fdfa;
      }
      .footer-note {
        margin-top: 10mm;
        font-size: 9px;
        color: #64748b;
        border-top: 1px solid #e2e8f0;
        padding-top: 6mm;
        line-height: 1.5;
      }
      .header-line {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        align-items: center;
        margin-bottom: 8px;
        font-size: 10px;
        color: #64748b;
      }
      .header-line strong { color: #0f172a; }
      .page-break { page-break-after: always; }
      .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
    </style>
  </head>
  <body>
    <section class="page cover">
      <div class="brand">Apoti Development Association</div>
      <h1>${escapeHtml(meta.title)}<br><span style="color:rgba(255,255,255,.86);">${escapeHtml(pageTitle(meta.kind))}</span></h1>
      <div class="subtitle">${escapeHtml(subtitleFor(meta.kind, meta))}</div>
      <div class="summary">${escapeHtml(meta.summary || "Source document prepared for public review and sponsor due diligence.")}</div>
      <div class="chips">
        <span class="chip">${escapeHtml(sourceLabel)}</span>
        ${meta.budget ? `<span class="chip">${escapeHtml(meta.budget)}</span>` : ""}
        ${meta.beneficiaries ? `<span class="chip">${escapeHtml(meta.beneficiaries)}</span>` : ""}
        <span class="chip">Prepared for public download</span>
      </div>
      <div class="meta-grid">
        ${coverCard("Reference", meta.reference)}
        ${coverCard("Location", meta.location)}
        ${coverCard("Period", meta.period)}
        ${coverCard("Budget / Spend", meta.budget)}
      </div>
    </section>
    <section class="page">
      <div class="header-line">
        <div><strong>${escapeHtml(meta.title)}</strong> · ${escapeHtml(pageTitle(meta.kind))}</div>
        <div class="mono">${escapeHtml(meta.reference)}</div>
      </div>
      <div class="content">${bodyHtml}</div>
      <div class="footer-note">
        This PDF was rendered from the markdown source in <span class="mono">public/docs/projects/${escapeHtml(meta.slug || "")}</span> using the same public generation pipeline that updates the downloadable budget sheets.
      </div>
    </section>
  </body>
  </html>`;
}

marked.setOptions({
  breaks: false,
  gfm: true,
});

const browser = await chromium.launch({
  headless: true,
  ...(CHROME_PATH ? { executablePath: CHROME_PATH } : {}),
});

try {
  const projects = await fs.readdir(PROJECTS_DIR, { withFileTypes: true });
  for (const dirent of projects) {
    if (!dirent.isDirectory()) continue;
    const slug = dirent.name;
    for (const kind of ["tor", "report", "financial"]) {
      const mdPath = path.join(PROJECTS_DIR, slug, `${kind}.md`);
      const pdfPath = path.join(PROJECTS_DIR, slug, `${kind}.pdf`);
      const markdown = await fs.readFile(mdPath, "utf8");
      const meta = buildDocMeta(slug, kind, markdown);
      meta.slug = slug;
      if (kind === "report") {
        const actualSpend =
          parseField(markdown, ["Actual Spend", "Actual Expenditure", "Total Expenditure"]) ||
          "";
        if (actualSpend) meta.budget = actualSpend;
      }
      const bodyHtml = marked.parse(formatMoney(markdown));
      const html = renderHtml(meta, bodyHtml, `${kind.toUpperCase()} source markdown`);
      const page = await browser.newPage({ viewport: { width: 1440, height: 2200 } });
      try {
        await page.setContent(html, { waitUntil: "load" });
        await page.emulateMedia({ media: "screen" });
        await page.pdf({
          path: pdfPath,
          format: "A4",
          printBackground: true,
          preferCSSPageSize: true,
          margin: { top: "0", right: "0", bottom: "0", left: "0" },
        });
        console.log(`Rendered ${path.relative(ROOT, pdfPath)}`);
      } finally {
        await page.close();
      }
    }
  }
} finally {
  await browser.close();
}
