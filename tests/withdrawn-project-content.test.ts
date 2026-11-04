import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
	isSafeProgramFaq,
	isWithdrawnGalleryImage,
	isWithdrawnProjectRecord,
	isWithdrawnProjectSlug,
	withoutWithdrawnProjects,
} from "../src/lib/withdrawn-project-content";

const phaseB = readFileSync("sanity/seed-phase-b.ts", "utf8");
const frenchSeed = readFileSync("sanity/seed-locale-fr.ts", "utf8");

describe("withdrawn water-project content safeguards", () => {
	it("rejects contaminated CMS FAQ responses in either locale and unsupported program counts", () => {
		expect(
			isSafeProgramFaq({
				keywords: ["program", "work"],
				response:
					"ADA runs 6 programs including Clean Water and Community Clean-Up.",
			}),
		).toBe(false);
		expect(
			isSafeProgramFaq({
				keywordsFr: ["programme"],
				response: "Program areas include education.",
				responseFr: "Les six programmes incluent l’eau potable.",
			}),
		).toBe(false);
		expect(
			isSafeProgramFaq({
				keywords: ["program", "work"],
				response:
					"ADA’s program areas include food distribution and community clean-up.",
			}),
		).toBe(true);
	});

	it("does not seed the withdrawn project or its second-well claim", () => {
		expect(phaseB).not.toMatch(/Clean Water Initiative/);
		expect(frenchSeed).not.toMatch(/titleFr:\s*["']Eau Potable["']/i);
		expect(frenchSeed).not.toMatch(/second well|deuxième puits/i);
		expect(phaseB).not.toMatch(/\b(?:six|6) programs?\b/i);
		expect(frenchSeed).not.toMatch(/\b(?:six|6) programmes?\b/i);
	});

	it("excludes only the withdrawn project slug, not other water-related projects", () => {
		expect(isWithdrawnProjectSlug("clean-water-well-nkwen-mbatu")).toBe(true);
		expect(isWithdrawnProjectSlug("clean-water-education-program")).toBe(false);
		expect(isWithdrawnProjectSlug("community-water-access")).toBe(false);
		expect(
			isWithdrawnProjectRecord({
				_id: "ADA/2024/002",
				title: "Borehole Drilling and Solar Pump Installation — Nkwen-Mbatu",
				slug: { current: "archived-water-work" },
			}),
		).toBe(true);
		expect(
			isWithdrawnProjectRecord({
				_id: "project-other",
				title: "Community water access",
				slug: { current: "community-water-access" },
			}),
		).toBe(false);
		expect(
			withoutWithdrawnProjects([
				{ slug: { current: "clean-water-well-nkwen-mbatu" }, title: "Withdrawn" },
				{ slug: { current: "community-water-access" }, title: "Unrelated work" },
			]),
		).toEqual([{ slug: { current: "community-water-access" }, title: "Unrelated work" }]);
	});

	it("filters gallery images linked to or explicitly identifying the withdrawn project in either locale", () => {
		expect(isWithdrawnGalleryImage({ projectSlug: "clean-water-well-nkwen-mbatu" })).toBe(true);
		expect(isWithdrawnGalleryImage({ title: "Clean Water Well Completed" })).toBe(true);
		expect(isWithdrawnGalleryImage({ titleFr: "Premier puits achevé à Nkwen-Mbatu" })).toBe(true);
		expect(isWithdrawnGalleryImage({ reportUrl: "/docs/projects/clean-water-well-nkwen-mbatu/report.pdf" })).toBe(true);
		expect(isWithdrawnGalleryImage({ photo: { alt: "Borehole Drilling and Solar Pump Installation — Nkwen-Mbatu" } })).toBe(true);
		expect(isWithdrawnGalleryImage({ photo: { altFr: "Forage et pompe solaire — Nkwen-Mbatu" } })).toBe(true);
		expect(isWithdrawnGalleryImage({ category: "borehole-drilling-and-solar-pump" })).toBe(true);
		expect(isWithdrawnGalleryImage({ title: "Community clean-water education session" })).toBe(false);
		expect(isWithdrawnGalleryImage({ title: "Community water access workshop" })).toBe(false);
		expect(isWithdrawnGalleryImage({ title: "Community clean-up in Nkwen-Mbatu" })).toBe(false);
		expect(isWithdrawnGalleryImage({ titleFr: "Eau potable pour une autre communauté" })).toBe(false);
		expect(isWithdrawnGalleryImage({ category: "clean-water" })).toBe(false);
	});
});
