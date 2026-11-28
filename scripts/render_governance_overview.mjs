#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { marked } from "marked";
import { chromium } from "playwright";

const source = new URL("../public/docs/diligence/ada-governance-overview.md", import.meta.url);
const output = new URL("../public/docs/diligence/ada-governance-overview.pdf", import.meta.url);
const markdown = await readFile(source, "utf8");
const body = marked.parse(markdown).replace(
  "<h2>Oversight practices</h2>",
  '<h2 class="page-two">Oversight practices</h2>',
);
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  await page.setContent(`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>ADA Governance Overview</title>
<style>
@page { size: A4; margin: 18mm 19mm; }
body { font: 11pt/1.45 Arial, sans-serif; color: #24312b; }
h1 { color: #174c36; font-size: 25pt; line-height: 1.2; margin: 0 0 12pt; }
h2 { color: #174c36; font-size: 15pt; margin: 19pt 0 7pt; break-after: avoid; }
h2.page-two { break-before: page; margin-top: 0; }
p, ul { margin: 0 0 8pt; }
p { orphans: 3; widows: 3; }
ul { padding-left: 20pt; }
li { margin-bottom: 3pt; }
table { width: 100%; margin: 0 0 8pt; border-collapse: collapse; break-inside: avoid; }
th, td { text-align: left; vertical-align: top; border: 1px solid #d6e0d8; padding: 4pt 7pt; }
th { background: #eaf2ec; color: #174c36; }
th:first-child { width: 43%; }
</style></head><body>${body}</body></html>`, { waitUntil: "load" });
  await page.emulateMedia({ media: "print" });
  await page.pdf({
    path: fileURLToPath(output),
    preferCSSPageSize: true,
    printBackground: true,
    tagged: true,
    outline: true,
    displayHeaderFooter: true,
    headerTemplate: "<div></div>",
    footerTemplate: "<div style='font:9px Arial,sans-serif;color:#4e6558;width:100%;text-align:center'>ADA Governance Overview · <span class='pageNumber'></span> / <span class='totalPages'></span></div>",
  });
} finally {
  await browser.close();
}
