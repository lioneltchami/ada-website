import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { isSafeProgramFaq } from "../src/lib/withdrawn-project-content";

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
});
