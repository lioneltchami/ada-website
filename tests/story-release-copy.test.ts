import { describe, expect, it } from "vitest";
import {
	STORY_RELEASE_COPY,
	STORY_RELEASE_ORDER,
	getStoryReleaseCopy,
} from "../src/lib/story-release-copy";

describe("safe bilingual Story release copy", () => {
	it("contains the 17 remaining public Story routes once", () => {
		const slugs = Object.keys(STORY_RELEASE_COPY);
		expect(slugs).toHaveLength(17);
		expect(new Set(STORY_RELEASE_ORDER).size).toBe(17);
		expect(new Set(slugs)).toEqual(new Set(STORY_RELEASE_ORDER));
		expect(getStoryReleaseCopy("clean-water-first-well-completed", "en")).toBeNull();
		expect(getStoryReleaseCopy("clean-water-first-well-completed", "fr")).toBeNull();
	});

	it("has usable English and French copy without fact placeholders or personal source images", () => {
		for (const [slug, story] of Object.entries(STORY_RELEASE_COPY)) {
			for (const locale of ["en", "fr"] as const) {
				const copy = story[locale];
				expect(copy.title, `${slug} ${locale} title`).not.toMatch(/\[[^\]]+\]/);
				expect(copy.excerpt, `${slug} ${locale} excerpt`).not.toMatch(/\[[^\]]+\]/);
				expect(copy.paragraphs.length, `${slug} ${locale} paragraphs`).toBeGreaterThan(0);
				expect(copy.paragraphs.join(" "), `${slug} ${locale} paragraphs`).not.toMatch(/\[[^\]]+\]/);
			}
			expect(story).not.toHaveProperty("personPhoto");
		}
	});

	it("keeps both financial summaries under review without publishing figures", () => {
		for (const slug of ["donations-changed-lives-2024", "transparency-report-2024"] as const) {
			const story = STORY_RELEASE_COPY[slug];
			expect(story.type).toBe("review");
			for (const locale of ["en", "fr"] as const) {
				const text = [story[locale].title, ...story[locale].paragraphs].join(" ");
				expect(text).toMatch(/review|vérification/i);
				expect(text).not.toMatch(/\$\s?\d|\d[,.]?\d*\s?CFA/i);
			}
		}
	});

	it("uses only owner-supported seasonal windows for Christmas and school preparation", () => {
		expect(getStoryReleaseCopy("christmas-giving-2024", "en")?.paragraphs.join(" ")).toMatch(/Christmas season/);
		expect(getStoryReleaseCopy("christmas-giving-2024", "fr")?.paragraphs.join(" ")).toMatch(/période de Noël/);
		expect(getStoryReleaseCopy("back-to-school-2025", "en")?.paragraphs.join(" ")).toMatch(/Around August/);
		expect(getStoryReleaseCopy("back-to-school-2025", "fr")?.paragraphs.join(" ")).toMatch(/Autour du mois d’août/);
	});
});
