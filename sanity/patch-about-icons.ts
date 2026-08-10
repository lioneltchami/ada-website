/**
 * Strip emoji icons from aboutPage.coreValues.
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

async function main() {
	const doc = await client.fetch(
		`*[_type == "aboutPage"][0]{ _id, coreValues }`,
	);
	if (!doc?._id) {
		console.log("No aboutPage document");
		return;
	}
	const coreValues = (doc.coreValues || []).map(
		(
			v: { _key?: string; title?: string; description?: string },
			i: number,
		) => ({
			...v,
			icon: "",
			_key: v._key || `v${i}`,
		}),
	);
	await client.patch(doc._id).set({ coreValues }).commit();
	console.log(`Patched ${doc._id}: cleared ${coreValues.length} icons`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
