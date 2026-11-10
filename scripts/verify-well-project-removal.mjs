import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { access, readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("dist/client");
const releaseManifest = JSON.parse(await readFile("config/project-document-releases.json", "utf8"));
const maySchoolReleased = releaseManifest.projects.some(p => p.slug === "school-visit-may-2022" && p.status === "released");
const misdatedMayPattern = maySchoolReleased ? /school-visit-mentorship-may-2022|May 2022 Community Cleanup/i : /school-visit-mentorship-may-2022|May 2022 Community Cleanup|ADA\/2022\/004/i;
const absent = [
	"projects/archive/young-women-skills-training-program/index.html",
	"fr/projects/archive/young-women-skills-training-program/index.html",
	"projects/women-empowerment/index.html",
	"fr/projects/women-empowerment/index.html",
	"docs/projects/young-women-skills-training-program",
	"projects/archive/school-visit-mentorship-may-2022/index.html",
	"fr/projects/archive/school-visit-mentorship-may-2022/index.html",
	"docs/projects/school-visit-mentorship-may-2022",
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
	"projects/archive/young-women-conference-oct-2024/index.html",
	"fr/projects/archive/young-women-conference-oct-2024/index.html",
	"projects/archive/widow-vocational-training-cohort-1/index.html",
	"fr/projects/archive/widow-vocational-training-cohort-1/index.html",
	"projects/archive/widow-support-program-cohort-3/index.html",
	"fr/projects/archive/widow-support-program-cohort-3/index.html",
	"docs/projects/young-women-conference-oct-2024",
	"docs/projects/widow-vocational-training-cohort-1",
	"docs/projects/widow-support-program-cohort-3",
	"docs/annual-reports/2022-annual-report.pdf",
	"docs/annual-reports/2023-annual-report.pdf",
];
for (const relative of absent) {
	await assert.rejects(access(path.join(root, relative)), `${relative} should be unpublished`);
}

for (const relative of [
	"ada-project-history.md",
	"ada-public-budget-adjustments.csv",
	"ada-public-budget-adjustments.json",
	"ada-public-budget-adjustments.md",
]) {
	const text = await readFile(path.join(root, "docs", relative), "utf8");
	assert.doesNotMatch(text, /young-women-skills-training-program|Young Women Skills Training Program|ADA\/2023\/002/i, `${relative} contains rejected 2023 training data`);
	assert.doesNotMatch(text, misdatedMayPattern, `${relative} contains misdated cleanup data`);
	assert.doesNotMatch(text, /ADA\/2024\/002|clean-water-well-nkwen-mbatu|Nkwen-Mbatu|Borehole Drilling and Solar Pump/i, `${relative} contains withdrawn water-project data`);
	assert.doesNotMatch(text, /ADA\/2024\/005|Young Women Empowerment Conference|young-women-conference-oct-2024/i, `${relative} contains withdrawn conference data`);
	assert.doesNotMatch(text, /ADA\/2022\/002|ADA\/2025\/002|widow-vocational-training-cohort-1|widow-support-program-cohort-3|Widow (?:Vocational Training|Support Program).{0,30}Cohort/i, `${relative} contains withdrawn widow-training data`);
}

const adjustmentMarkdown = await readFile(path.join(root, "docs", "ada-public-budget-adjustments.md"), "utf8");
assert.match(adjustmentMarkdown, /Aggregate financial totals are omitted because the source rows do not consistently report the same basis/i);
assert.doesNotMatch(adjustmentMarkdown, /Archived project total represented here|Public target total after cap/i);
const adjustmentRenderer = await readFile(path.join(process.cwd(), "scripts", "render_public_budget_adjustments_pdf.mjs"), "utf8");
assert.match(adjustmentRenderer, /Aggregate totals are omitted because source rows mix approved budgets and reported actuals/i);
assert.doesNotMatch(adjustmentRenderer, /Archive total:|Public target total|totalArchive|totalPublic/i);

for (const relative of ["ada-project-budgets.xlsx", "ada-public-budget-adjustments.xlsx"]) {
	const file = path.join(root, "docs", relative);
	const text = execFileSync("python3", ["-c", "import sys, zipfile; z=zipfile.ZipFile(sys.argv[1]); print(' '.join(z.read(n).decode('utf-8','ignore') for n in z.namelist() if n.endswith('.xml')))", file], { encoding: "utf8" });
	assert.doesNotMatch(text, /ADA\/2024\/005|Young Women Empowerment Conference|ADA\/2022\/002|ADA\/2025\/002|Widow (?:Vocational Training|Support Program).{0,30}Cohort/i, `${relative} contains a withdrawn conference or widow-training record`);
	assert.doesNotMatch(text, /young-women-skills-training-program|Young Women Skills Training Program|ADA\/2023\/002/i, `${relative} contains rejected 2023 training data`);
	assert.match(text, /idp-girls-baking-training-jul-2022|Girls Baking|July 2022 Baking Workshop|Practical baking skills for displaced girls/i, `${relative} should retain separate girls' baking records`);
}

for (const relative of [
	"docs/projects/idp-girls-baking-training-jul-2022/report.pdf",
	"docs/projects/widow-support-food-cash-mar-2022/report.pdf",
	"docs/projects/womens-day-home-visits-mar-2023/report.pdf",
	"docs/projects/first-widow-home-visits-2021/report.pdf",
]) {
	await access(path.join(root, relative));
}

for (const relative of [
	"index.html",
	"fr/index.html",
	"about/index.html",
	"fr/about/index.html",
	"projects/index.html",
	"fr/projects/index.html",
	"donate/index.html",
	"fr/donate/index.html",
	"monthly/index.html",
	"fr/monthly/index.html",
	"sponsor/index.html",
	"fr/sponsor/index.html",
	"transparency/index.html",
	"fr/transparency/index.html",
	"impact-scorecard/index.html",
	"fr/impact-scorecard/index.html",
	"resources/index.html",
	"fr/resources/index.html",
]) {
	const html = await readFile(path.join(root, relative), "utf8");
	assert.doesNotMatch(
		html,
		/clean-water-well-nkwen-mbatu|clean-water-first-well-completed|Clean Water Well|Borehole Drilling and Solar Pump|ADA\/2024\/002|Nkwen-Mbatu|Borehole drilling|Forage, pompe solaire|300\+ (?:served|desservis)|ADA\/2024\/005|Young Women Empowerment Conference|young-women-conference-oct-2024|ADA\/2022\/002|ADA\/2025\/002|widow-vocational-training-cohort-1|widow-support-program-cohort-3|Widow (?:Vocational Training|Support Program).{0,30}Cohort/i,
		`${relative} contains a withdrawn project claim`,
	);
}

for (const relative of ["index.html", "fr/index.html", "about/index.html", "fr/about/index.html", "projects/index.html", "fr/projects/index.html", "projects/archive/index.html", "fr/projects/archive/index.html", "resources/index.html", "fr/resources/index.html", "sponsor/index.html", "fr/sponsor/index.html", "partners/index.html", "fr/partners/index.html", "transparency/index.html", "fr/transparency/index.html", "impact-scorecard/index.html", "fr/impact-scorecard/index.html"]) {
	const html = await readFile(path.join(root, relative), "utf8");
	assert.doesNotMatch(html, /young-women-skills-training-program|href=["'](?:\/fr)?\/projects\/women-empowerment|Young women documented earning income|10 graduated, 8 earning income|10 diplômées, 8 génèrent/i, `${relative} contains rejected training data`);
	assert.doesNotMatch(html, /85% (?:of (?:our )?beneficiaries|women|femmes)|85%.*(?:girls|filles)|200\+ (?:lives|vies)|200\+ widows|plus de 200 (?:veuves|personnes)/i, `${relative} contains a removed aggregate claim`);
	assert.doesNotMatch(html, /Widow (?:Vocational Training|Support Program).{0,30}Cohort|formation professionnelle des veuves|Young Women Empowerment Conference|ADA\/2024\/005|ADA\/2022\/002|ADA\/2025\/002|young-women-conference-oct-2024|widow-vocational-training-cohort-1|widow-support-program-cohort-3/i, `${relative} contains a removed project claim`);
}

for (const relative of ["index.html", "fr/index.html"]) {
	const html = await readFile(path.join(root, relative), "utf8");
	assert.doesNotMatch(html, /ADA runs (?:six|6) programs|ADA propose (?:six|6) programmes|Clean Water Initiative|Eau Potable|second well|deuxième puits/i, `${relative} contains withdrawn chatbot or program copy`);
}

for (const relative of ["gallery/index.html", "fr/gallery/index.html"]) {
	const html = await readFile(path.join(root, relative), "utf8");
	assert.doesNotMatch(html, /young-women-skills-training-program|project-women-empowerment|Young Women Skills Training Program|Programme de Formation des Jeunes Femmes/i, `${relative} contains imagery tied to the rejected training record`);
	assert.doesNotMatch(html, /Clean Water Well|First Water Well|Borehole Drilling and Solar Pump|Nkwen[\s-]*Mbatu|ADA\/2024\/002|Premier puits|Forage et pompe solaire/i, `${relative} contains imagery explicitly tied to the withdrawn project`);
	assert.doesNotMatch(html, /Young Women Empowerment Conference|ADA\/2024\/005|young-women-conference-oct-2024|Widow Vocational Training Cohort|Widow Support Program.{0,20}Cohort|ADA\/2022\/002|ADA\/2025\/002/i, `${relative} contains imagery explicitly tied to a withdrawn project`);
}

for (const relative of ["transparency/index.html", "fr/transparency/index.html"]) {
	const html = await readFile(path.join(root, relative), "utf8");
	assert.match(html, /temporarily unavailable while project records are reviewed|temporairement indisponibles pendant la revue des dossiers de projets/i);
	assert.doesNotMatch(html, /\$6,800|\$6 800|2024 Annual Report \(PDF\)|Rapport Annuel 2024 \(PDF\)/);
}

console.log("Withdrawn 2023 young-women training, well, conference, and widow-training records verified absent from generated routes, documents, aggregates, and resource links; retained relief and girls baking reports verified present.");
