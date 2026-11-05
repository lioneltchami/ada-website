import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { hasStaticProjectDocuments } from "../src/data/organization";
import {
	isSafeProgramFaq,
	isWithdrawnAboutEntry,
	isWithdrawnImpactMetric,
	isWithdrawnGalleryImage,
	isWithdrawnProjectRecord,
	isWithdrawnProjectSlug,
	isWithdrawnProgramEntry,
	isWithdrawnTestimonial,
	safeWidowSupportDescription,
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
				response: "Since 2021, we have impacted 200+ lives across 5 communities.",
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

describe("conference and widow-training removal safeguards", () => {
	it("filters only the withdrawn project records in either language", () => {
		for (const slug of [
			"young-women-conference-oct-2024",
			"widow-vocational-training-cohort-1",
			"widow-support-program-cohort-3",
		]) expect(isWithdrawnProjectSlug(slug)).toBe(true);

		for (const project of [
			{ _id: "ADA/2024/005", title: "Young Women Empowerment Conference" },
			{ _id: "I3ROLIaQjmV1gZbnPYijdi", title: "Widow Vocational Training Program Cohort 1" },
			{ _id: "I3ROLIaQjmV1gZbnPYijz0", title: "Widow Support Program Cohort 3" },
			{ titleFr: "Programme de formation professionnelle des veuves — Cohorte 2" },
		]) expect(isWithdrawnProjectRecord(project)).toBe(true);

		for (const project of [
			{ slug: { current: "young-women-skills-training-program" }, title: "Young Women Skills Training Program" },
			{ slug: { current: "idp-girls-baking-training-jul-2022" }, title: "IDP Girls Baking Training" },
			{ slug: { current: "widow-support-food-cash-mar-2022" }, title: "Widow Support — Food & Financial Aid" },
			{ slug: { current: "womens-day-home-visits-mar-2023" }, title: "Women's Day Home Visits" },
		]) expect(isWithdrawnProjectRecord(project)).toBe(false);
	});

	it("removes archive-document links while retaining the separate programs", () => {
		for (const slug of [
			"young-women-conference-oct-2024",
			"widow-vocational-training-cohort-1",
			"widow-support-program-cohort-3",
		]) expect(hasStaticProjectDocuments(slug)).toBe(false);
		for (const slug of [
			"idp-girls-baking-training-jul-2022",
			"young-women-skills-training-program",
			"widow-support-food-cash-mar-2022",
			"womens-day-home-visits-mar-2023",
		]) expect(hasStaticProjectDocuments(slug)).toBe(true);
	});

	it("filters explicit conference/cohort gallery associations but preserves shared or unrelated media", () => {
		expect(isWithdrawnGalleryImage({ projectSlug: "young-women-conference-oct-2024" })).toBe(true);
		expect(isWithdrawnGalleryImage({ titleFr: "Conférence d'autonomisation des jeunes femmes" })).toBe(true);
		expect(isWithdrawnGalleryImage({ photo: { alt: "Widow vocational training cohort 1" } })).toBe(true);
		expect(isWithdrawnGalleryImage({ projectSlug: "young-women-skills-training-program", title: "Training the younger generation" })).toBe(false);
		expect(isWithdrawnGalleryImage({ title: "Community cleanup in Nkwen-Mbatu" })).toBe(false);
	});

	it("filters affected CMS fallback content while retaining general widow relief", () => {
		expect(isSafeProgramFaq({ response: "The widow vocational training cohort supported participants." })).toBe(false);
		expect(isSafeProgramFaq({ responseFr: "La formation professionnelle des veuves a accompagné les participantes." })).toBe(false);
		expect(isSafeProgramFaq({ response: "ADA supports widows through food and financial relief." })).toBe(true);
		expect(isWithdrawnAboutEntry({ eventFr: "15 veuves inscrites en formation professionnelle" })).toBe(true);
		expect(isWithdrawnAboutEntry({ event: "200+ lives impacted across regions" })).toBe(true);
		expect(isWithdrawnAboutEntry({ eventFr: "Nettoyage communautaire mobilise 200 bénévoles" })).toBe(true);
		expect(isWithdrawnProgramEntry({ title: "Widow Vocational Training Cohort 1" })).toBe(true);
		expect(isWithdrawnProgramEntry({ title: "Widow Support" })).toBe(false);
		expect(safeWidowSupportDescription("Financial aid, tailoring training, and support for widows.")).toBe("Food and financial support for widows and families.");
		expect(isWithdrawnTestimonial({ program: "Widow Support", quote: "The tailoring training changed my life." })).toBe(true);
	});

	it("removes affected aggregate metrics without suppressing unrelated program targets", () => {
		expect(isWithdrawnImpactMetric({ _id: "metric-widows", label: "Widows Supported", value: 15 })).toBe(true);
		expect(isWithdrawnImpactMetric({ label: "Women and girls beneficiaries", value: 85, suffix: "%" })).toBe(true);
		expect(isWithdrawnImpactMetric({ label: "Young women earning income", value: 8 })).toBe(false);
		expect(isWithdrawnImpactMetric({ label: "Communities Served", value: 5 })).toBe(false);
	});
});
