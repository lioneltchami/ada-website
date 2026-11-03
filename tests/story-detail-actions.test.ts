import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const english = readFileSync("src/pages/stories/[slug].astro", "utf8");
const french = readFileSync("src/pages/fr/stories/[slug].astro", "utf8");
const detail = readFileSync("src/components/stories/StoryReleaseDetail.astro", "utf8");

describe("bilingual Story release routes", () => {
	it("builds the same local Story set for English and French", () => {
		for (const source of [english, french]) {
			expect(source).toContain("Object.keys(STORY_RELEASE_COPY)");
			expect(source).toContain("StoryReleaseDetail");
			expect(source).not.toContain("getBlogPostSlugs");
		}
		expect(english).toContain('locale="en"');
		expect(french).toContain('locale="fr"');
	});

	it("keeps localized donation, project, contact, and back links", () => {
		for (const source of [detail]) {
			expect(source).toContain('localePath("/donate", locale)');
			expect(source).toContain('localePath("/projects", locale)');
			expect(source).toContain('localePath("/contact", locale)');
			expect(source).toContain('localePath("/stories", locale)');
		}
	});

	it("does not load original CMS story claims, images, or personal photo metadata", () => {
		for (const source of [english, french, detail]) {
			expect(source).not.toContain("post.body");
			expect(source).not.toContain("personPhoto");
			expect(source).not.toContain("getBlogPostSlugs");
		}
	});
});
