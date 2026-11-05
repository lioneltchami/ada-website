import { describe, expect, it } from "vitest";
import {
  homepageStatsFallback,
  IMPACT_FACTS,
  impactMetricsFor,
  measurableIndicatorsFor,
  sanityImpactMetricSeed,
} from "../src/data/impact";
import {
  hasStaticProjectDocuments,
  projectDocumentPaths,
  REGISTRATION_CERTIFICATE_URL,
} from "../src/data/organization";

describe("impact facts source of truth", () => {
  it("keeps homepage, indicators, and scorecard numbers aligned", () => {
    const enIndicators = measurableIndicatorsFor("en");
    const frIndicators = measurableIndicatorsFor("fr");
    const enScorecard = impactMetricsFor("en");
    const seed = sanityImpactMetricSeed();

    expect(enIndicators[1]?.actualValue).toBe(
      IMPACT_FACTS.indicators.womenVocational.actual,
    );
    expect(frIndicators[1]?.actualValue).toBe(
      IMPACT_FACTS.indicators.womenVocational.actual,
    );
    expect(enScorecard.find((m) => m.label.toLowerCase().includes("women"))?.value).toBe(
      String(IMPACT_FACTS.indicators.womenVocational.earning),
    );
    expect(seed).toHaveLength(2);
    expect(seed.map((metric) => metric._id)).toEqual([
      "metric-communities",
      "metric-years",
    ]);
    expect(homepageStatsFallback("en")[0]?.value).toBe(
      String(IMPACT_FACTS.communitiesServed),
    );
  });
});

describe("canonical project PDFs", () => {
  it("points registration and project docs at public/docs", () => {
    expect(REGISTRATION_CERTIFICATE_URL).toBe(
      "/docs/diligence/ada-registration-certificate.pdf",
    );
    expect(REGISTRATION_CERTIFICATE_URL).not.toContain("cdn.sanity.io");
    expect(
      hasStaticProjectDocuments("young-women-skills-training-program"),
    ).toBe(true);
    expect(projectDocumentPaths("young-women-skills-training-program")).toEqual(
      {
        tor: "/docs/projects/young-women-skills-training-program/tor.pdf",
        financial:
          "/docs/projects/young-women-skills-training-program/financial.pdf",
        report: "/docs/projects/young-women-skills-training-program/report.pdf",
      },
    );
  });
});
