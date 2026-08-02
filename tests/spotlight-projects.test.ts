import { describe, expect, it } from "vitest";
import { normalizeFallbackProjects } from "../src/lib/project-fallbacks";
import { isProjectFundable } from "../src/lib/project-lifecycle";

describe("homepage spotlight candidates", () => {
	it("surfaces upcoming Back to School campaigns before start date", () => {
		const fundable = normalizeFallbackProjects({ today: "2026-08-01" }).filter(
			(p) => isProjectFundable(p.status),
		);
		const upcoming = fundable.filter((p) => p.status === "upcoming");
		const bts = upcoming.filter((p) => p.slug.startsWith("back-to-school-"));

		expect(bts).toHaveLength(2);
		expect(upcoming.map((p) => p.slug).sort()).toEqual([
			"back-to-school-bamenda-aug-2026",
			"back-to-school-buea-aug-2026",
		]);
	});
});
