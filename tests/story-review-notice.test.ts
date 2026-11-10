import { describe, expect, it } from "vitest";
import { getStoryReviewCopy } from "../src/lib/story-review-notice";

describe("bilingual homepage Stories feature", () => {
	it("keeps the featured notice specific to the two financial summaries under review", () => {
		const en = getStoryReviewCopy("en");
		const fr = getStoryReviewCopy("fr");

		expect(en.featuredMessage).toMatch(/2024 financial summary and 2024 donations summary remain under review/i);
		expect(fr.featuredMessage).toMatch(/synthèse financière 2024 et la synthèse des dons 2024.*restent en cours de vérification/i);
		expect(`${en.featuredMessage} ${fr.featuredMessage}`).not.toMatch(/general support themes|thèmes généraux de soutien|verified individual case reports|témoignages individuels vérifiés/i);
	});

	it("keeps the featured link and next steps in the selected language", () => {
		expect(getStoryReviewCopy("en").featuredLink).toBe("Stories and updates →");
		expect(getStoryReviewCopy("fr").featuredLink).toBe("Témoignages et actualités →");
		expect(getStoryReviewCopy("en").donate).toBe("Donate");
		expect(getStoryReviewCopy("fr").donate).toBe("Faire un don");
	});
});
