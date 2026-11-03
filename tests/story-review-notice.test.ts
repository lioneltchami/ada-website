import { describe, expect, it } from "vitest";
import { getStoryReviewCopy } from "../src/lib/story-review-notice";

describe("bilingual homepage Stories feature", () => {
	it("explains that most articles are program perspectives and finance remains under review", () => {
		const en = getStoryReviewCopy("en");
		const fr = getStoryReviewCopy("fr");

		expect(en.featuredMessage).toMatch(/general support themes/i);
		expect(en.featuredMessage).toMatch(/financial summaries remain under review/i);
		expect(fr.featuredMessage).toMatch(/thèmes généraux de soutien/i);
		expect(fr.featuredMessage).toMatch(/synthèses financières.*en cours de vérification/i);
	});

	it("keeps the featured link and next steps in the selected language", () => {
		expect(getStoryReviewCopy("en").featuredLink).toBe("Stories and updates →");
		expect(getStoryReviewCopy("fr").featuredLink).toBe("Témoignages et actualités →");
		expect(getStoryReviewCopy("en").donate).toBe("Donate");
		expect(getStoryReviewCopy("fr").donate).toBe("Faire un don");
	});
});
