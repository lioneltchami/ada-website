import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";

const root = resolve(process.argv[2] || "dist/client");
const withdrawn = "education-orphans";
const oldCopy = /(?:education-orphans|\bEducation for Orphans\b|Éducation des Orphelins|ADA paid my school fees when my grandmother|ADA a payé mes frais de scolarité quand ma grand-mère)/i;
const redirects = await readFile(join(root, "_redirects"), "utf8");
for (const prefix of ["", "fr/"]) {
  for (const base of ["projects", "projects/archive"]) {
    const url = `/${prefix}${base}/${withdrawn}`;
    await assert.rejects(access(join(root, url.slice(1), "index.html")), { code: "ENOENT" });
    for (const ending of ["", "/"]) {
      assert.ok(redirects.split(/\r?\n/).includes(`${url}${ending} /${prefix}projects/archive/ 302`));
    }
  }
  for (const unrelated of ["projects/education-drive", "projects/archive/back-to-school-bamenda-aug-2026", "projects/archive/back-to-school-buea-aug-2026", "projects/archive/girls-dignity-menstrual-health-bamenda-jun-2026"]) {
    await access(join(root, prefix, unrelated, "index.html"));
  }
}
for (const name of await readdir(root, { recursive: true })) {
  if (!/\.(?:html|xml|csv|json|md)$/.test(name)) continue;
  assert.doesNotMatch(await readFile(join(root, name), "utf8"), oldCopy, `Held project was exposed in ${name}`);
}
console.log("Verified the Douala project and associated testimony are absent from the generated public site and exports; 2026 outreaches and Annual Education Drive are retained.");
