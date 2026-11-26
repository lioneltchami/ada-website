import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const directory = new URL("../public/docs/diligence/", import.meta.url);
const source = await readFile(new URL("ada-program-budget-template.md", directory), "utf8");
const output = new URL("ada-program-budget-template.pdf", directory);
const esc = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const [[, heading], ...rest] = [...source.matchAll(/^(#+) (.+)$/gm)].map((match) => [match[1], match[2], match.index]);
const sections = rest.map(([, title, start], index) => ({
  title,
  body: source.slice(start, rest[index + 1]?.[2]).split("\n").slice(1).map((line) => line.trim()).filter(Boolean),
}));
if (sections.length !== 4 || sections.some(({ title }, index) => title !== [
  "Program summary", "Budget categories", "Reporting plan", "Sponsor note",
][index])) throw new Error("Unexpected budget template sections");

const intro = source.slice(0, rest[0][2]).split("\n").filter((line) => line.startsWith("**"))
  .map((line) => line.split("**").map((part, index) => index === 1 ? `<strong>${esc(part)}</strong>` : esc(part)).join(""));
const table = ({ title, body }, classes = "") => {
  const rows = body.map((line) => line.slice(1, -1).split("|").map((column) => column.trim()));
  const [head, , ...data] = rows;
  if (data.some((row) => row.length !== head.length)) throw new Error("Invalid template table: " + title);
  return `<section><h2>${esc(title)}</h2><table class="${classes}"><thead><tr>${head.map((cell) => `<th scope="col">${esc(cell)}</th>`).join("")}</tr></thead>
    <tbody>${data.map(([label, ...cells]) => `<tr><th scope="row">${esc(label)}</th>${cells.map((cell) => `<td>${esc(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></section>`;
};

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined, args: ["--no-sandbox"] });
try {
  const page = await browser.newPage();
  await page.setContent(`<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${esc(heading)}</title>
  <style>
    @page { size: A4; margin: 15mm 17mm; }
    * { box-sizing: border-box; }
    body { margin: 0; color: #172d22; font: 10.5pt/1.4 Arial, sans-serif; print-color-adjust: exact; }
    article + article { break-before: page; }
    header { padding-bottom: 3mm; border-bottom: 2px solid #2d6149; margin-bottom: 5mm; }
    h1 { font-size: 23pt; line-height: 1.1; margin: 0 0 2.5mm; }
    h2 { font-size: 14pt; margin: 0 0 2mm; }
    p { margin: 0 0 1mm; }
    .continuation { margin: 0; font-size: 13pt; font-weight: bold; }
    section { margin-bottom: 4mm; break-inside: avoid; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #81938a; text-align: left; padding: 1.45mm 2.1mm; }
    thead { background: #e8f1e9; }
    tbody th { font-weight: normal; }
    .summary th:first-child { width: 43%; }
    .budget th:first-child { width: 28%; }
    .budget thead th:last-child { width: 22%; }
    .budget tbody tr:last-child th { font-weight: bold; }
    .reporting th:first-child { width: 51%; }
    .reporting thead th:nth-child(2) { width: 16%; }
    .reporting td, .reporting tbody th { height: 12mm; }
    .sponsor { background: #e8f1e9; padding: 4mm; margin-top: 7mm; }
    footer { margin-top: 5mm; }
  </style></head><body><main>
    <article><header><h1>${esc(heading)}</h1>${intro.map((line) => `<p>${line}</p>`).join("")}</header>
    ${table(sections[0], "summary")}${table(sections[1], "budget")}</article>
    <article><header><p class="continuation">${esc(heading)}</p></header>
    ${table(sections[2], "reporting")}
    <section class="sponsor"><h2>${esc(sections[3].title)}</h2><p>${esc(sections[3].body[0])}</p></section>
    <footer><p>${esc(sections[3].body[1].replace(/^_|_$/g, ""))}</p></footer></article>
  </main></body></html>`);
  await page.pdf({
    path: fileURLToPath(output), preferCSSPageSize: true, printBackground: true,
    displayHeaderFooter: false, tagged: true, outline: true,
  });
} finally {
  await browser.close();
}
