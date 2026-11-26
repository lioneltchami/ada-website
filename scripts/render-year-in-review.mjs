import { readFile, mkdir } from "node:fs/promises";
import { resolve, join, relative, sep } from "node:path";
import { chromium } from "playwright";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const draft = process.argv[2] === "--draft";
if ((draft && process.argv.length !== 5) || (!draft && process.argv.length !== 2)) {
  throw new Error("Usage: node scripts/render-year-in-review.mjs [--draft input.json private-output-directory]");
}
const input = draft ? resolve(process.argv[3]) : join(root, "content/year-in-review.json");
const output = draft ? resolve(process.argv[4]) : join(root, "public/docs/year-in-review");
const fromRepo = relative(root, output);
if (draft && fromRepo !== ".." && !fromRepo.startsWith(".." + sep)) throw new Error("Draft output must be outside the repository.");
const data = JSON.parse(await readFile(input, "utf8"));
const logo = "data:image/png;base64," + (await readFile(join(root, "public/brand/ada-symbol.png"))).toString("base64");
const esc = (str) => String(str).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const slugOK = (slug) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
const host = "https://apotidev.org";
if (!Array.isArray(data) || !data.length || new Set(data.map((row) => row.year)).size !== data.length) {
  throw new Error("Missing or duplicate review years");
}
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined, args: ["--no-sandbox"] });
try {
  const page = await browser.newPage();
  for (const review of data) {
    if (!Number.isInteger(review.year) || review.features.length < 2 || review.features.length > 4 ||
      ["lead", "account", "closing"].some((key) => !review[key]?.en?.trim() || !review[key]?.fr?.trim()) ||
      review.features.some((feature) => !slugOK(feature.slug) || !feature.en || !feature.fr)) {
      throw new Error("Invalid review record: " + review.year);
    }
    const body = ["en", "fr"].map((lang) => {
      const fr = lang === "fr";
      const archive = host + (fr ? "/fr" : "") + "/projects/archive/";
      return `<article lang="${lang}">
        <img class="watermark" src="${logo}" alt="">
        <header><img src="${logo}" alt=""><div><strong>APOTI DEVELOPMENT ASSOCIATION</strong><br><span>${fr ? "Action communautaire au Cameroun" : "Community outreach in Cameroon"}</span></div></header>
        <div class="label">${fr ? "BILAN D’ACTIVITÉ" : "ACTIVITY REVIEW"} · ${review.year}</div>
        <h1>${fr ? "L’année en bref" : "Year in Review"}</h1>
        ${draft ? `<p class="draft">${fr ? "DOCUMENT DE TRAVAIL · ANNÉE EN COURS" : "WORKING DRAFT · YEAR NOT CLOSED"}</p>` : ""}
        <h2>${fr ? "Pourquoi nous avons agi" : "Why we did the work"}</h2>
        <p class="lead">${esc(review.lead[lang])}</p>
        <h2>${fr ? "Sur le terrain" : "What we did"}</h2>
        <ol>${review.features.map((highlight) => `<li><p>${esc(highlight[lang])}</p>
        <a href="${archive}${highlight.slug}/">${fr ? "Consulter le dossier de l’action" : "Read the outreach record"} →</a></li>`).join("")}</ol>
        <aside><h2>${fr ? "Ce que montrent nos dossiers" : "What our records show"}</h2>
        <p>${esc(review.account[lang])}</p>
        <p><a href="${archive}#outreach-year-${review.year}">${fr ? "Archives des actions de" : "Browse outreach records for"} ${review.year} →</a></p>
        </aside>
        <section class="closing"><h2>${fr ? "Remerciements et suite" : "Thank you and looking ahead"}</h2>
        <p>${esc(review.closing[lang])}</p></section>
        <footer>apotidev.org <span>${review.year} · ${fr ? "Français" : "English"}</span></footer>
      </article>`;
    }).join("");
    await page.setContent(`<!doctype html><html lang="en"><meta charset="utf-8"><title>ADA ${review.year} Year in Review${draft ? " - Working draft" : ""}</title><style>
      @page { size: A4; margin: 15mm 17mm; }
      * {box-sizing:border-box} body {margin:0;color:#1b3023;font:11pt Arial,sans-serif; print-color-adjust: exact;}
      article {position:relative; min-height:245mm; display:flex; flex-direction:column; break-inside:avoid;}
      article+article {break-before:page}
      header {display:flex;gap:12px;align-items:center;border-bottom:2px solid #1d5038;padding-bottom:12px;margin-bottom:14px;font-size:11pt}
      header img {width:43px;height:43px;object-fit:contain} header span {font-size:9pt;color:#395345}
      .watermark {width:115mm;position:absolute;z-index:-1;opacity:.045;object-fit:contain;top:53mm;right:12mm}
      .label {font-size:9pt;letter-spacing:2px;color:#285a40;font-weight:bold} h1 {margin:7px 0 12px;font-size:32pt;line-height:1.05;color:#183928}
      h2 {font-size:13.5pt;margin:0 0 7px;color:#204832} .lead {font-size:13pt;line-height:1.42;max-width:162mm;margin:0 0 15px}
      .draft {margin:0 0 14px;color:#735010;font-weight:bold} ol {margin:0 0 15px;padding-left:23px}
      li {margin:0 0 9px;padding-left:3px;line-height:1.38;break-inside:avoid} p{margin:0 0 4px}
      a {color:#1b563b;text-decoration:underline;text-underline-offset:2px;font-weight:bold;font-size:10pt}
      aside {background:#eff5ef;border-left:3px solid #447d59;padding:12px 15px;line-height:1.4;break-inside:avoid}
      .closing {margin-top:14px;line-height:1.4;} aside p+p {margin-top:6px} footer {margin-top:auto;padding-top:13px;color:#415b4c;font-size:9pt} footer span {float:right}
    </style><body>${body}</body></html>`, { waitUntil: "load" });
    const filename = `ADA-${review.year}-Year-in-Review${draft ? "-Draft" : ""}.pdf`;
    await page.pdf({ path: join(output, filename), preferCSSPageSize: true, printBackground: true, tagged: true, outline: true });
    process.stdout.write(filename + "\n");
  }
} finally {
  await browser.close();
}
