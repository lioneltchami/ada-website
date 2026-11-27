import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import reviews from "../content/year-in-review.json";
import {
  annualPublicationLabels,
  historicAnnualReports,
  publishedYearInReviews,
  yearInReviewForYear,
} from "../src/lib/annual-publications";

describe("annual publications shared by Resources and Transparency", () => {
  it("uses all published bilingual reviews in descending order, without mixing in historic annual reports", () => {
    const years = reviews.map(({ year }) => year).sort((a, b) => b - a);
    expect(publishedYearInReviews.map(({ year }) => year)).toEqual(years);
    expect(publishedYearInReviews[0]?.year).toBeGreaterThanOrEqual(2025);
    for (const review of publishedYearInReviews) {
      expect(yearInReviewForYear(review.year)).toEqual(review);
      expect(existsSync(`public${review.href}`)).toBe(true);
    }
    expect(historicAnnualReports).toContainEqual({
      year: 2021,
      href: "/docs/annual-reports/2021-annual-report.pdf",
    });
    expect(publishedYearInReviews.find(({ year }) => year === 2021)?.href).not.toBe(
      historicAnnualReports.find(({ year }) => year === 2021)?.href,
    );
    expect(yearInReviewForYear(1900)).toBeUndefined();
  });

  it("labels language and document types without presenting the reviews as financial statements", () => {
    expect(annualPublicationLabels("en").reviewLink(2025)).toBe("2025 Year in Review (bilingual PDF)");
    expect(annualPublicationLabels("en").intro).toContain("not financial statements");
    expect(annualPublicationLabels("fr").reviewLink(2025)).toBe("Bilan 2025 (PDF bilingue)");
    expect(annualPublicationLabels("fr").historicLink(2021)).toContain("PDF en anglais");
  });

  it("links the same catalog entry in the library and in the annual publications component", () => {
    const resource = readFileSync("src/components/resources/DocumentLibrary.astro", "utf8");
    const annual = readFileSync("src/components/resources/AnnualPublications.astro", "utf8");
    expect(resource).toContain("yearInReviewForYear(yearGroup.year)");
    expect(resource).toContain('localePath("/transparency/", locale)');
    expect(annual).toContain("publishedYearInReviews.map");
    expect(annual).toContain('id="annual-publications"');
  });
});
