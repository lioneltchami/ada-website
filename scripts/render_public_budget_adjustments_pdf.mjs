#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const INPUT_JSON = path.join(ROOT, "public/docs/ada-public-budget-adjustments.json");
const OUTPUT_PDF = path.join(ROOT, "public/docs/ada-public-budget-adjustments.pdf");
const CHROME_PATH = process.env.CHROME_PATH || "";

function currency(value) {
  if (value === null || value === undefined || value === "") return "—";
  return `${Number(value).toLocaleString("en-US")} CFA`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function donutSvg(okCount, adjustedCount) {
  const total = Math.max(okCount + adjustedCount, 1);
  const okPct = okCount / total;
  const adjustedPct = adjustedCount / total;
  const r = 58;
  const c = 2 * Math.PI * r;
  const okDash = c * okPct;
  const adjustedDash = c * adjustedPct;
  return `
    <svg viewBox="0 0 160 160" width="160" height="160" aria-label="Project status chart" role="img">
      <circle cx="80" cy="80" r="${r}" fill="none" stroke="#e5eef7" stroke-width="20"></circle>
      <circle cx="80" cy="80" r="${r}" fill="none" stroke="#0f766e" stroke-width="20" stroke-linecap="round"
        stroke-dasharray="${okDash} ${c}" transform="rotate(-90 80 80)"></circle>
      <circle cx="80" cy="80" r="${r}" fill="none" stroke="#b45309" stroke-width="20" stroke-linecap="round"
        stroke-dasharray="${adjustedDash} ${c}" stroke-dashoffset="${-okDash}" transform="rotate(-90 80 80)"></circle>
      <text x="80" y="74" text-anchor="middle" font-size="16" font-weight="700" fill="#0f172a">${okCount + adjustedCount}</text>
      <text x="80" y="94" text-anchor="middle" font-size="9" fill="#475569">projects</text>
    </svg>
  `;
}

const rows = JSON.parse(await fs.readFile(INPUT_JSON, "utf8"));
const adjustedRows = rows.filter((row) => row.status === "adjusted");
const okRows = rows.filter((row) => row.status === "ok");
const totalPublic = rows.reduce((sum, row) => sum + Number(row.public_target || 0), 0);
const totalArchive = rows.reduce(
  (sum, row) => sum + Number(row.archive_actual || row.archive_approved || 0),
  0,
);
const topAdjusted = [...adjustedRows]
  .sort((a, b) => (b.adjustment_needed || 0) - (a.adjustment_needed || 0))
  .slice(0, 10);

const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>ADA Public Budget Adjustments</title>
  <style>
    @page { size: A4; margin: 18mm 16mm 18mm 16mm; }
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
    .hero {
      padding: 20px 22px;
      border-radius: 20px;
      background: linear-gradient(135deg, #0f766e 0%, #134e4a 52%, #0f172a 100%);
      color: white;
      min-height: 170px;
    }
    .eyebrow { text-transform: uppercase; letter-spacing: .12em; font-size: 11px; opacity: .8; }
    h1 { margin: 8px 0 8px; font-size: 27px; line-height: 1.1; }
    .sub { max-width: 650px; font-size: 12px; line-height: 1.5; color: rgba(255,255,255,.88); }
    .meta { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 14px; font-size: 11px; color: rgba(255,255,255,.85); }
    .badge { border: 1px solid rgba(255,255,255,.22); border-radius: 999px; padding: 6px 10px; background: rgba(255,255,255,.08); }
    .grid { display: grid; gap: 12px; }
    .cards { grid-template-columns: repeat(4, minmax(0, 1fr)); margin-top: 14px; }
    .card {
      border: 1px solid #dbe4ee;
      border-radius: 16px;
      padding: 14px 16px;
      background: #fff;
    }
    .card .label { color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: .08em; }
    .card .value { font-size: 24px; font-weight: 800; margin-top: 6px; }
    .card .note { margin-top: 6px; color: #64748b; font-size: 11px; line-height: 1.4; }
    .section-title { margin: 0 0 10px; font-size: 16px; }
    .two-col { grid-template-columns: 1.1fr .9fr; align-items: start; margin-top: 14px; }
    .panel {
      border: 1px solid #dbe4ee;
      border-radius: 18px;
      padding: 16px;
      background: #fff;
    }
    .legend { display: grid; gap: 8px; margin-top: 16px; font-size: 12px; }
    .legend-row { display: flex; align-items: center; gap: 8px; }
    .dot { width: 10px; height: 10px; border-radius: 999px; }
    .dot.ok { background: #0f766e; }
    .dot.adjusted { background: #b45309; }
    table { width: 100%; border-collapse: collapse; font-size: 11px; }
    th, td { padding: 8px 8px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
    th { text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: .08em; color: #64748b; }
    .status-ok { color: #0f766e; font-weight: 700; }
    .status-adjusted { color: #b45309; font-weight: 700; }
    .foot { margin-top: 10px; font-size: 10px; color: #64748b; line-height: 1.5; }
    .section-break { height: 16px; }
  </style>
</head>
<body>
  <div class="page">
    <div class="hero">
      <div class="eyebrow">ADA sponsor document</div>
      <h1>Public Budget Adjustments</h1>
      <div class="sub">
        This is the sponsor-facing budget layer. It keeps the archived record intact while capping each public project at 400,000 CFA unless the archived amount is already below that ceiling.
      </div>
      <div class="meta">
        <span class="badge">Compiled from archive records</span>
        <span class="badge">Updated: ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
        <span class="badge">Ready for investor review</span>
      </div>
    </div>

    <div class="grid cards">
      <div class="card">
        <div class="label">Projects reviewed</div>
        <div class="value">${rows.length}</div>
        <div class="note">All archived projects included in the public adjustment layer.</div>
      </div>
      <div class="card">
        <div class="label">Within cap</div>
        <div class="value">${okRows.length}</div>
        <div class="note">Already at or below the public ceiling.</div>
      </div>
      <div class="card">
        <div class="label">Adjusted</div>
        <div class="value">${adjustedRows.length}</div>
        <div class="note">Should be reviewed against verified receipts and records.</div>
      </div>
      <div class="card">
        <div class="label">Public target total</div>
        <div class="value">${currency(totalPublic)}</div>
        <div class="note">Capped public-facing total across the archive.</div>
      </div>
    </div>

    <div class="grid two-col">
      <div class="panel">
        <h2 class="section-title">Public budget status</h2>
        <table>
          <thead>
            <tr><th>Year</th><th>Project</th><th>Public target</th><th>Status</th></tr>
          </thead>
          <tbody>
            ${rows
              .slice(0, 8)
              .map(
                (row) => `
                <tr>
                  <td>${row.year}</td>
                  <td>${escapeHtml(row.project)}</td>
                  <td>${currency(row.public_target)}</td>
                  <td class="${row.status === "ok" ? "status-ok" : "status-adjusted"}">${row.status}</td>
                </tr>`,
              )
              .join("")}
          </tbody>
        </table>
      </div>
      <div class="panel">
        <h2 class="section-title">Archive vs. public target</h2>
        <div style="display:flex; gap:18px; align-items:center; justify-content:center;">
          ${donutSvg(okRows.length, adjustedRows.length)}
          <div style="font-size:12px; line-height:1.6;">
            <div><span class="dot ok"></span> Within cap: ${okRows.length}</div>
            <div><span class="dot adjusted"></span> Adjusted: ${adjustedRows.length}</div>
            <div style="margin-top:10px; color:#475569;">Archive total: ${currency(totalArchive)}</div>
            <div style="color:#475569;">Public target total: ${currency(totalPublic)}</div>
          </div>
        </div>
        <div class="foot">
          The donut chart shows how many projects fall inside the public cap versus how many need adjustment.
        </div>
      </div>
    </div>
  </div>

  <div class="page">
    <div class="panel">
      <h2 class="section-title">Highest adjustments to review</h2>
      <table>
        <thead>
          <tr>
            <th>Year</th>
            <th>Project</th>
            <th>Archive actual</th>
            <th>Public target</th>
            <th>Adjustment</th>
            <th>Reference</th>
          </tr>
        </thead>
        <tbody>
          ${topAdjusted
            .map(
              (row) => `
              <tr>
                <td>${row.year}</td>
                <td>${escapeHtml(row.project)}</td>
                <td>${currency(row.archive_actual || row.archive_approved)}</td>
                <td>${currency(row.public_target)}</td>
                <td>${currency(row.adjustment_needed)}</td>
                <td>${escapeHtml(row.reference || "—")}</td>
              </tr>`,
            )
            .join("")}
        </tbody>
      </table>
      <div class="section-break"></div>
      <h2 class="section-title">Notes for publication</h2>
      <table>
        <tbody>
          <tr><td><strong>Use this document</strong></td><td>As the public-facing budget sheet for sponsors, donors, and board review.</td></tr>
          <tr><td><strong>Keep archive files</strong></td><td>As the original historical record, unchanged.</td></tr>
          <tr><td><strong>Verify adjusted rows</strong></td><td>Against receipts, bank/mobile money history, or staff confirmation before final publication.</td></tr>
        </tbody>
      </table>
      <div class="foot">
        This PDF was browser-rendered from the same structured data that generates the CSV, JSON, and Excel versions.
      </div>
    </div>
  </div>
</body>
</html>`;

const browser = await chromium.launch({
  headless: true,
  ...(CHROME_PATH ? { executablePath: CHROME_PATH } : {}),
});
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1800 } });
  await page.setContent(html, { waitUntil: "load" });
  await page.emulateMedia({ media: "screen" });
  await page.pdf({
    path: OUTPUT_PDF,
    format: "A4",
    printBackground: true,
    margin: { top: "0", right: "0", bottom: "0", left: "0" },
    preferCSSPageSize: true,
  });
  console.log(`Wrote ${path.relative(ROOT, OUTPUT_PDF)}`);
} finally {
  await browser.close();
}
