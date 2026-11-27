import { describe, expect, it } from "vitest";
import { getStoryReviewCopy } from "../src/lib/story-review-notice";

describe("bilingual homepage Stories feature", () => {
	it("describes Stories without repeating the financial notices", () => {
		const en = getStoryReviewCopy("en");
		const fr = getStoryReviewCopy("fr");

		expect(en.featuredMessage).toMatch(/stories about the people we’ve helped/i);
		expect(fr.featuredMessage).toMatch(/témoignages de personnes accompagnées/i);
		expect(`${en.featuredMessage} ${fr.featuredMessage}`).not.toMatch(/general support themes|thèmes généraux de soutien|verified individual case reports|témoignages individuels vérifiés/i);
	});

	it("keeps the featured link and next steps in the selected language", () => {
		expect(getStoryReviewCopy("en").featuredLink).toBe("Stories and updates →");
		expect(getStoryReviewCopy("fr").featuredLink).toBe("Témoignages et actualités →");
		expect(getStoryReviewCopy("en").donate).toBe("Donate");
		expect(getStoryReviewCopy("fr").donate).toBe("Faire un don");
	});
});
