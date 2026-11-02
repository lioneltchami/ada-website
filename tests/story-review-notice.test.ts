import { describe, expect, it } from "vitest";
import { getStoryReviewCopy } from "../src/lib/story-review-notice";

describe("bilingual interim story notices", () => {
	it("provides parallel, non-factual English and French notices", () => {
		const en = getStoryReviewCopy("en");
		const fr = getStoryReviewCopy("fr");

		expect(en.indexTitle).toMatch(/temporarily unavailable/i);
		expect(fr.indexTitle).toMatch(/temporairement indisponibles/i);
		expect(en.detailDescription).toMatch(/English and French/i);
		expect(fr.detailDescription).toMatch(/anglaise et française/i);
		expect(en.featuredMessage).toMatch(/reviewing/i);
		expect(fr.featuredMessage).toMatch(/vérifie/i);
	});

	it("keeps locale links and next steps in the selected language", () => {
		expect(getStoryReviewCopy("en").featuredLink).toBe("Stories and updates →");
		expect(getStoryReviewCopy("fr").featuredLink).toBe("Témoignages et actualités →");
		expect(getStoryReviewCopy("en").donate).toBe("Donate");
		expect(getStoryReviewCopy("fr").donate).toBe("Faire un don");
	});
});
