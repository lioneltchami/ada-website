import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { diligenceDocsFor } from "../src/data/diligence-docs";
import { documentArchiveProjects, annualReportPdfs } from "../src/data/organization";
import { IMPACT_FACTS, impactMetricsFor } from "../src/data/impact";
import { STORY_RELEASE_COPY } from "../src/lib/story-release-copy";
import { hasStaticProjectDocuments } from "../src/data/organization";
import { isWithdrawnProject } from "../src/lib/project-archive";

const removedProject = "clean-water-well-nkwen-mbatu";

describe("withdrawn Clean Water Well project", () => {
	it("is excluded from stories, project archives, and impact metrics", () => {
		expect(STORY_RELEASE_COPY).not.toHaveProperty("clean-water-first-well-completed");
		expect(documentArchiveProjects).not.toContain(removedProject);
		expect(hasStaticProjectDocuments(removedProject)).toBe(false);
		expect(isWithdrawnProject(removedProject)).toBe(true);
		expect(IMPACT_FACTS).not.toHaveProperty("cleanWaterPeopleServed");
		for (const locale of ["en", "fr"] as const) {
			expect(impactMetricsFor(locale).some((metric) => /water well|clean water|eau potable|puits/i.test(`${metric.label} ${metric.source} ${metric.note}`))).toBe(false);
		}
	});

	it("removes contaminated reports from public resource listings", () => {
		expect(annualReportPdfs.some((report) => report.year === "2024")).toBe(false);
		for (const locale of ["en", "fr"] as const) {
			const links = diligenceDocsFor(locale).map((doc) => doc.link).join(" ");
			expect(links).not.toMatch(/2024-annual-report|ada-financial-summary-2024|ada-impact-scorecard|ada-corporate-sponsor-one-pager|ada-sponsor-readiness-packet/);
		}
		for (const file of [
			"public/docs/annual-reports/2024-annual-report.pdf",
			"public/docs/diligence/ada-financial-summary-2024.pdf",
			"public/docs/diligence/ada-impact-scorecard.pdf",
			"public/docs/diligence/ada-corporate-sponsor-one-pager.pdf",
			"public/docs/diligence/ada-sponsor-readiness-packet.pdf",
			`public/docs/projects/${removedProject}/report.pdf`,
		]) expect(existsSync(file), file).toBe(false);
	});

	it("regenerates public project and budget data without the withdrawn record", () => {
		for (const file of [
			"public/docs/ada-project-history.md",
			"public/docs/ada-public-budget-adjustments.csv",
			"public/docs/ada-public-budget-adjustments.json",
		]) {
			const text = readFileSync(file, "utf8");
			expect(text, file).not.toMatch(/ADA\/2024\/002|clean-water-well-nkwen-mbatu|Nkwen-Mbatu|Borehole Drilling and Solar Pump/i);
		}
	});
});
