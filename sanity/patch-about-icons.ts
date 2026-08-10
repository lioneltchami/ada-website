/**
 * Strip emoji icons from aboutPage.coreValues and programs.
 * Run: npx tsx sanity/patch-about-icons.ts
 */

import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { createClient } from "@sanity/client";

function resolveToken(): string {
  const env = process.env.SANITY_TOKEN || process.env.SANITY_API_TOKEN || "";
  if (env) return env;
  const cfgPath = join(homedir(), ".config/sanity/config.json");
  if (existsSync(cfgPath)) {
    const cfg = JSON.parse(readFileSync(cfgPath, "utf8"));
    if (cfg.authToken) return cfg.authToken;
  }
  throw new Error("No Sanity token");
}

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || "rj2m21gk",
  dataset: process.env.SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: resolveToken(),
  useCdn: false,
});

function clearIcons<T extends { _key?: string; icon?: string }>(
  items: T[] | undefined,
  prefix: string,
): T[] {
  return (items || []).map((item, i) => ({
    ...item,
    icon: "",
    _key: item._key || `${prefix}${i}`,
  }));
}

async function main() {
  const doc = await client.fetch(
    `*[_type == "aboutPage"][0]{ _id, coreValues, programs }`,
  );
  if (!doc?._id) {
    console.log("No aboutPage document");
    return;
  }
  const coreValues = clearIcons(doc.coreValues, "v");
  const programs = clearIcons(doc.programs, "p");
  await client.patch(doc._id).set({ coreValues, programs }).commit();
  console.log(
    `Patched ${doc._id}: cleared ${coreValues.length} value icons, ${programs.length} program icons`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
