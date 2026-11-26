import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const slug = "first-widow-home-visits-2021";
const kinds = ["financial", "report", "tor"];

export async function verify2021DocumentReleases(root) {
  const manifests = JSON.parse(await fs.readFile(path.join(root, "config/project-document-releases-2021.json"), "utf8"));
  assert.deepEqual(Object.keys(manifests), [slug]);
  assert.deepEqual(Object.keys(manifests[slug]).sort(), kinds);
  for (const kind of kinds) {
    const pdf = await fs.readFile(path.join(root, "public/docs/projects", slug, kind + ".pdf"));
    assert.equal(pdf.subarray(0, 5).toString(), "%PDF-", slug + "/" + kind);
    assert.equal(createHash("sha256").update(pdf).digest("hex"), manifests[slug][kind], "Reviewed PDF changed: " + slug + "/" + kind);
  }
  return new Set([slug]);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await verify2021DocumentReleases(process.cwd());
  console.log("Exact 2021 document releases verified: three public PDFs.");
}
