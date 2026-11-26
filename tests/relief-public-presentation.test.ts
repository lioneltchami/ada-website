import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { impactMetricsFor, measurableIndicatorsFor } from "../src/data/impact";

describe("public presentation after withdrawal of the 2024 Bamenda relief record", () => {
  it.each(["en", "fr"] as const)("retains the allocation target but no outcome or source attached to the withdrawn record (%s)", (locale) => {
    expect(measurableIndicatorsFor(locale)).toEqual([]);
    expect(impactMetricsFor(locale)).toEqual([
      expect.objectContaining({
        value: "80%",
        sourceUrl: locale === "fr" ? "/fr/transparency" : "/transparency",
        measurement: "Estimated",
      }),
    ]);
  });

  it("removes the retired Sponsor example without removing the published Buea example in either language", () => {
    const sponsor = readFileSync("src/components/sponsor/SponsorLanding.astro", "utf8");
    expect(sponsor).not.toMatch(/Emergency food relief|Aide alimentaire d'urgence|50 displaced families|50 familles déplacées|150\+|2[ ,]417/);
    expect(sponsor).toContain("82,750 FCFA");
    expect(sponsor).toContain("82 750 FCFA");
    expect(sponsor).toContain("/projects/archive/back-to-school-buea-2024");
  });
});
