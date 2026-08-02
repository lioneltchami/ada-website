import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";

const token =
	process.env.SANITY_TOKEN ||
	process.env.SANITY_API_TOKEN ||
	(() => {
		try {
			const cfg = JSON.parse(
				readFileSync(
					join(homedir(), ".config", "sanity", "config.json"),
					"utf-8",
				),
			);
			return cfg.authToken as string | undefined;
		} catch {
			return undefined;
		}
	})();

if (!token) {
	console.error("No Sanity token found (SANITY_TOKEN / CLI config).");
	process.exit(1);
}

const client = createClient({
	projectId: "rj2m21gk",
	dataset: "production",
	apiVersion: "2026-03-28",
	token,
	useCdn: false,
});

const projects = [
	{
		_id: "project-back-to-school-buea-aug-2026",
		slug: "back-to-school-buea-aug-2026",
		title: "Back to School Outreach — Buea",
		status: "active",
		demographic: "orphans",
		location: "Buea, South West Region",
		description:
			"Annual Back to School Reach Out in Buea (South West). Community campaign to equip underprivileged children with school supplies so they can learn, grow, and succeed. Flyer timing: anticipated in August 2026 — scheduled outreach window 15–18 August.",
		beneficiaries: 40,
		goalAmount: 2500,
		raisedAmount: 0,
		startDate: "2026-08-15",
		endDate: "2026-08-18",
		archiveAfterDate: "2026-08-18",
		autoArchiveAfterEndDate: true,
		sortOrder: 0,
	},
	{
		_id: "project-back-to-school-bamenda-aug-2026",
		slug: "back-to-school-bamenda-aug-2026",
		title: "Back to School Outreach — Bamenda",
		status: "active",
		demographic: "orphans",
		location: "Mile 4 Nkwen, Bamenda, North West Region",
		description:
			"Back to School Outreach in Mile 4 Nkwen, Bamenda (North West). Community campaign putting smiles on faces through education supplies for underprivileged children. Flyer timing: anticipated by the end of August 2026 — scheduled outreach window 28–31 August.",
		beneficiaries: 40,
		goalAmount: 2500,
		raisedAmount: 0,
		startDate: "2026-08-28",
		endDate: "2026-08-31",
		archiveAfterDate: "2026-08-31",
		autoArchiveAfterEndDate: true,
		sortOrder: 1,
	},
] as const;

async function main() {
	console.log("Upserting Back to School 2026 projects in Sanity…");
	for (const p of projects) {
		await client.createOrReplace({
			...p,
			_type: "project",
			slug: { _type: "slug", current: p.slug },
		});
		console.log(`✓ ${p.slug}`);
	}

	const verify = await client.fetch<
		{ slug: string; title: string; startDate: string; endDate: string }[]
	>(
		`*[_type == "project" && slug.current in $slugs]{
      "slug": slug.current,
      title,
      startDate,
      endDate
    } | order(startDate asc)`,
		{
			slugs: projects.map((p) => p.slug),
		},
	);

	console.log("Verified in production dataset:");
	for (const row of verify) {
		console.log(`  - ${row.slug}: ${row.startDate} → ${row.endDate}`);
	}

	if (verify.length !== projects.length) {
		console.error("Verification incomplete — expected 2 documents.");
		process.exit(1);
	}

	console.log("Done.");
}

main().catch((err) => {
	console.error("Sanity upsert failed:", err);
	process.exit(1);
});
