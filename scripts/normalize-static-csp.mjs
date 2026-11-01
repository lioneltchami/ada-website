import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { normalizeCspMetaPolicy } from "../src/lib/csp-meta.mjs";
import { getCspPolicy } from "../src/lib/csp-policy.mjs";

const clientDir = path.resolve("dist/client");
const baseDirectives = getCspPolicy(process.env).directives;

async function normalizeHtml(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await normalizeHtml(entryPath);
      continue;
    }
    if (!entry.isFile() || !entry.name.endsWith(".html")) continue;
    const original = await readFile(entryPath, "utf8");
    const normalized = await normalizeCspMetaPolicy(original, baseDirectives);
    if (normalized !== original) await writeFile(entryPath, normalized);
  }
}

await normalizeHtml(clientDir);
