#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { marked } from "marked";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const markdownPath = path.join(root, "public/docs/annual-reports/2021-annual-report.md");
const outputPath = path.join(root, "public/docs/annual-reports/2021-annual-report.pdf");
const markdown = await fs.readFile(markdownPath, "utf8");
const body = marked.parse(markdown);
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@page { size: A4; margin: 18mm 17mm 20mm; }
* { box-sizing: border-box; }
body { font: 10.5pt/1.55 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #24312b; }
h1 { color: #174c36; font-size: 25pt; line-height: 1.2; margin: 0 0 14pt; }
h2 { color: #174c36; font-size: 18pt; margin: 26pt 0 9pt; border-bottom: 1px solid #d6e4da; padding-bottom: 4pt; page-break-after: avoid; }
h3 { color: #28664a; font-size: 13pt; margin: 16pt 0 6pt; page-break-after: avoid; }
h4 { font-size: 11pt; margin: 12pt 0 5pt; page-break-after: avoid; }
p { margin: 0 0 9pt; orphans: 3; widows: 3; }
blockquote { border-left: 3px solid #79a98a; padding: 3pt 12pt; color: #4e6558; margin: 12pt 0; }
table { width: 100%; border-collapse: collapse; margin: 10pt 0 14pt; font-size: 9pt; page-break-inside: avoid; }
th { text-align: left; background: #eaf2ec; color: #174c36; font-weight: 650; }
th, td { border: 1px solid #d6e0d8; padding: 5pt 7pt; vertical-align: top; }
tr:nth-child(even) td { background: #fafcfb; }
ul, ol { padding-left: 20pt; margin: 4pt 0 12pt; }
li { margin: 0 0 4pt; }
hr { border: none; border-top: 1px solid #d6e4da; margin: 16pt 0; }
strong { color: #223b2e; }
</style></head><body>${body}</body></html>`;

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 1600 } });
  await page.setContent(html, { waitUntil: "load" });
  await page.emulateMedia({ media: "print" });
  await page.pdf({
    path: outputPath,
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: true,
    headerTemplate: "<div></div>",
    footerTemplate: "<div style='font:8px sans-serif;color:#667;width:100%;text-align:center'><span class='pageNumber'></span></div>",
    margin: { top: "18mm", right: "17mm", bottom: "20mm", left: "17mm" },
  });
  console.log(`Rendered ${path.relative(root, outputPath)}`);
} finally {
  await browser.close();
}
