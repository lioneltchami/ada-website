/**
 * Patch homepage CMS fields for Hallmark redesign.
 * Run: npx tsx sanity/patch-homepage-hallmark.ts
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
    try {
      const cfg = JSON.parse(readFileSync(cfgPath, "utf8"));
      if (cfg.authToken) return cfg.authToken;
    } catch {}
  }
  throw new Error("No Sanity token (SANITY_TOKEN / CLI config)");
}

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || "rj2m21gk",
  dataset: process.env.SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: resolveToken(),
  useCdn: false,
});

const missionCards = [
  {
    _key: "widow",
    icon: "",
    title: "Widow Support",
    description:
      "Food and financial support for widows and families rebuilding household stability.",
  },
  {
    _key: "education",
    icon: "",
    title: "Education",
    description:
      "School supplies, tuition support, and mentorship for orphaned children.",
  },
  {
    _key: "empowerment",
    icon: "",
    title: "Empowerment",
    description:
      "Vocational training and microfinance for young women seeking independence.",
  },
];

async function main() {
  const doc = await client.fetch(`*[_type == "homePage"][0]{ _id }`);
  if (!doc?._id) throw new Error("homePage document not found");

  await client
    .patch(doc._id)
    .set({
      missionCards,
      ctaHeading: "Fund school kits for Buea and Bamenda",
      ctaBody:
        "Your gift buys bags, books, and fees so orphaned and displaced children can start the school year with dignity.",
      heroBadge: "Faith-Based Charity · Cameroon",
    })
    .commit();

  console.log(`Patched ${doc._id}: missionCards (no emoji), specific CTA`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
