import { describe, expect, it } from "vitest";
import {
	localizeObjectArray,
	localizeVolunteerLocation,
	pickLocalized,
	pickLocalizedStringArray,
} from "../src/lib/sanity-locale";

describe("pickLocalized", () => {
	it("returns English base for en locale", () => {
		expect(
			pickLocalized({ title: "Hello", titleFr: "Bonjour" }, "title", "en"),
		).toBe("Hello");
	});

	it("returns French when locale is fr and titleFr set", () => {
		expect(
			pickLocalized({ title: "Hello", titleFr: "Bonjour" }, "title", "fr"),
		).toBe("Bonjour");
	});

	it("falls back to English when Fr empty", () => {
		expect(
			pickLocalized({ title: "Hello", titleFr: "  " }, "title", "fr"),
		).toBe("Hello");
		expect(pickLocalized({ title: "Hello" }, "title", "fr")).toBe("Hello");
	});
});

describe("pickLocalizedStringArray", () => {
	it("uses Fr array when present", () => {
		expect(
			pickLocalizedStringArray(
				{ storyParagraphs: ["EN"], storyParagraphsFr: ["FR1", "FR2"] },
				"storyParagraphs",
				"fr",
			),
		).toEqual(["FR1", "FR2"]);
	});

	it("falls back to EN array", () => {
		expect(
			pickLocalizedStringArray(
				{ storyParagraphs: ["EN1"] },
				"storyParagraphs",
				"fr",
			),
		).toEqual(["EN1"]);
	});
});

describe("localizeObjectArray", () => {
	it("resolves nested Fr fields and strips *Fr keys", () => {
		const out = localizeObjectArray(
			[
				{
					title: "Faith",
					titleFr: "Foi",
					description: "A",
					descriptionFr: "B",
				},
			],
			["title", "description"],
			"fr",
		);
		expect(out[0]).toEqual({ title: "Foi", description: "B" });
	});
});

describe("localizeVolunteerLocation", () => {
	it("maps enum for French", () => {
		expect(localizeVolunteerLocation("On-site", "fr")).toBe("Sur place");
		expect(localizeVolunteerLocation("Remote", "en")).toBe("Remote");
	});
});
