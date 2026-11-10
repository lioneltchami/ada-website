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

    expect(enIndicators.some((i) => /women completing/.test(i.indicator))).toBe(false);
    expect(frIndicators.some((i) => /formation professionnelle/.test(i.indicator))).toBe(false);
    expect(enScorecard.some((m) => /women.*income/.test(m.label))).toBe(false);
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
      hasStaticProjectDocuments("idp-girls-baking-training-jul-2022"),
    ).toBe(true);
    expect(projectDocumentPaths("idp-girls-baking-training-jul-2022")).toEqual(
      {
        tor: "/docs/projects/idp-girls-baking-training-jul-2022/tor.pdf",
        financial: undefined,
        report: "/docs/projects/idp-girls-baking-training-jul-2022/report.pdf",
      },
    );
  });
});
