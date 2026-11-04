import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("dist/client");
const absent = [
	"stories/clean-water-first-well-completed/index.html",
	"fr/stories/clean-water-first-well-completed/index.html",
	"projects/archive/clean-water-well-nkwen-mbatu/index.html",
	"fr/projects/archive/clean-water-well-nkwen-mbatu/index.html",
	"docs/projects/clean-water-well-nkwen-mbatu",
	"docs/annual-reports/2024-annual-report.pdf",
	"docs/diligence/ada-financial-summary-2024.pdf",
	"docs/diligence/ada-impact-scorecard.pdf",
	"docs/diligence/ada-corporate-sponsor-one-pager.pdf",
	"docs/diligence/ada-sponsor-readiness-packet.pdf",
];
for (const relative of absent) {
	await assert.rejects(access(path.join(root, relative)), `${relative} should be unpublished`);
}

for (const relative of [
	"ada-project-history.md",
	"ada-public-budget-adjustments.csv",
	"ada-public-budget-adjustments.json",
]) {
	const text = await readFile(path.join(root, "docs", relative), "utf8");
	assert.doesNotMatch(text, /ADA\/2024\/002|clean-water-well-nkwen-mbatu|Nkwen-Mbatu|Borehole Drilling and Solar Pump/i, `${relative} contains withdrawn project data`);
}

for (const relative of ["index.html", "fr/index.html", "about/index.html", "fr/about/index.html", "sponsor/index.html", "fr/sponsor/index.html", "transparency/index.html", "fr/transparency/index.html", "impact-scorecard/index.html", "fr/impact-scorecard/index.html", "resources/index.html", "fr/resources/index.html"]) {
	const html = await readFile(path.join(root, relative), "utf8");
	assert.doesNotMatch(html, /clean-water-well-nkwen-mbatu|clean-water-first-well-completed|ADA\/2024\/002|Nkwen-Mbatu|Borehole drilling|Forage, pompe solaire|300\+ (?:served|desservis)/i, `${relative} contains a withdrawn project claim`);
}

for (const relative of ["index.html", "fr/index.html"]) {
	const html = await readFile(path.join(root, relative), "utf8");
	assert.doesNotMatch(html, /ADA runs (?:six|6) programs|ADA propose (?:six|6) programmes|Clean Water Initiative|Eau Potable|second well|deuxième puits/i, `${relative} contains withdrawn chatbot or program copy`);
}

for (const relative of ["transparency/index.html", "fr/transparency/index.html"]) {
	const html = await readFile(path.join(root, relative), "utf8");
	assert.match(html, /temporarily unavailable while project records are reviewed|temporairement indisponibles pendant la revue des dossiers de projets/i);
	assert.doesNotMatch(html, /\$6,800|\$6 800|2024 Annual Report \(PDF\)|Rapport Annuel 2024 \(PDF\)/);
}

console.log("Well-project removal verified in generated routes, resource links, history, and budget outputs.");
