import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(process.argv[2] || "dist/client");
const withdrawn = "emergency-food-relief-bamenda-crisis";
const archive = "/projects/archive";
const docs = "/docs/projects/" + withdrawn;
const notFound = { code: "ENOENT" };
const exactRecord = /emergency[ -]food[ -]relief[ \u00a0\u202f–—-]+bamenda[ -]crisis|ADA\/2024\/001|aide alimentaire d[’']urgence.{0,35}crise de Bamenda/i;
const exactClaims = /\$\s*2[,\s\u00a0\u202f]417|2[,\s\u00a0\u202f]417\s*\$|50 displaced families|50 familles déplacées|150\+ people|150\+ personnes|50 families in 2024|50 familles en 2024|emergency food relief reach|portée de l[’']aide alimentaire d[’']urgence/i;
const relative = target => path.join(root, target);
const redirects = (await readFile(relative("_redirects"), "utf8")).split(/\r?\n/);
const visibleSpaces = html => html.replace(/&(?:nbsp|#160|#8239);/g, " ").replace(/&(?:apos|#39);/g, "'");

await assert.rejects(access(relative(docs)), notFound, "No archived document directory may be served");
for (const prefix of ["", "/fr"]) {
  const oldPath = prefix + archive + "/" + withdrawn;
  await assert.rejects(access(relative(oldPath + "/index.html")), notFound, "Retired archive page must not be built");
  await assert.rejects(access(relative(prefix + "/projects/" + withdrawn + "/index.html")), notFound, "Retired record must not reappear as an active program");
  for (const slash of ["", "/"]) {
    assert.ok(redirects.includes(`${oldPath}${slash} ${prefix}${archive}/ 301`), "Missing same-language retreat URL: " + oldPath + slash);
  }
  await access(relative(prefix + "/projects/emergency-relief/index.html"));
  await access(relative(prefix + "/stories/household-emergency-support/index.html"));
  for (const page of ["sponsor", "impact-scorecard", "transparency"]) {
    const pageFile = prefix + "/" + page + "/index.html";
    const text = visibleSpaces(await readFile(relative(pageFile), "utf8"));
    assert.doesNotMatch(text, exactClaims, pageFile + " surfaces claims from the withdrawn record");
  }
}
for (const kind of ["tor", "report", "financial"]) for (const ext of ["pdf", "md"]) {
  assert.ok(redirects.includes(`${docs}/${kind}.${ext} ${archive}/ 302`), "Missing former download redirect: " + kind + "." + ext);
}
const siteFiles = await readdir(root, { recursive: true });
for (const filename of siteFiles) {
  if (!/\.(?:html|xml)$/.test(filename)) continue;
  const text = visibleSpaces(await readFile(relative(filename), "utf8"));
  assert.doesNotMatch(text, exactRecord, filename + " links to or identifies the withdrawn project");
}
for (const file of ["ada-project-history.md", "ada-public-budget-adjustments.csv", "ada-public-budget-adjustments.json", "ada-public-budget-adjustments.md"]) {
  assert.doesNotMatch(await readFile(relative("docs/" + file), "utf8"), exactRecord, file + " retains the withdrawn record");
}
for (const file of ["ada-project-budgets.xlsx", "ada-public-budget-adjustments.xlsx"]) {
  const xml = execFileSync("python3", ["-c", "import sys,zipfile; z=zipfile.ZipFile(sys.argv[1]); print(' '.join(z.read(n).decode('utf-8','ignore') for n in z.namelist() if n.endswith('.xml')))", relative("docs/" + file)], { encoding: "utf8" });
  assert.doesNotMatch(xml, exactRecord, file + " retains the withdrawn record");
}
console.log("Verified withdrawal of the exact 2024 Bamenda food relief record across generated routes, project files, Sponsor, Impact, Transparency, standard exports and sitemap; generic relief and unrelated story retained.");
