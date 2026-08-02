/**
 * Correct gallery image titles/alts to match real field moments.
 * Run: npx tsx sanity/patch-gallery-captions.ts
 */
import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";

const token =
	process.env.SANITY_TOKEN ||
	process.env.SANITY_API_TOKEN ||
	(() => {
		try {
			return JSON.parse(
				readFileSync(
					join(homedir(), ".config", "sanity", "config.json"),
					"utf-8",
				),
			).authToken as string;
		} catch {
			return undefined;
		}
	})();

if (!token) {
	console.error("No Sanity token found");
	process.exit(1);
}

const client = createClient({
	projectId: "rj2m21gk",
	dataset: "production",
	apiVersion: "2026-03-28",
	token,
	useCdn: false,
});

/** Match current title (case-insensitive) → corrected title/alt */
const CORRECTIONS: Record<string, string> = {
	"widow receiving food package": "Training the younger generation",
	"children studying together": "Visiting our pregnant women at the hospital",
	"women empowerment certificate ceremony":
		"Sharing love with our brothers and sisters at the orphanage",
	"community gathering for clean-up": "Back to School Project Bamenda 2024",
	"christmas giving campaign 2024": "Community gathering for clean-up",
	"school supplies distribution day": "Back to School Project Buea 2024",
	"back-to-school supply distribution": "Visiting the widows in Mile 16",
};

async function main() {
	const images = await client.fetch<
		{ _id: string; title: string; photo?: { alt?: string } }[]
	>(`*[_type == "galleryImage"]{ _id, title, photo { alt } }`);

	let updated = 0;
	for (const image of images) {
		const key = image.title.trim().toLowerCase();
		const nextTitle = CORRECTIONS[key];
		if (!nextTitle) {
			console.log(`· keep: ${image.title}`);
			continue;
		}
		await client
			.patch(image._id)
			.set({
				title: nextTitle,
				"photo.alt": nextTitle,
			})
			.commit();
		console.log(`✓ ${image.title} → ${nextTitle}`);
		updated += 1;
	}

	console.log(`Done. Updated ${updated} gallery captions.`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
