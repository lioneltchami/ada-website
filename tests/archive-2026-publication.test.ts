import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { hasStaticProjectDocuments, projectDocumentPaths } from "../src/data/organization";
import { formatArchiveCardFinances } from "../src/lib/archive-card-finances";
import { getArchiveCardStatus } from "../src/lib/archive-card-status";
import { getEligibleArchiveFeaturePhoto } from "../src/lib/archive-eligible-feature-photo";
import { sortArchiveEntriesChronologically, type ProjectArchiveEntry } from "../src/lib/project-archive";
import { applyReviewed2026Summaries, listReleased2026ProjectDocuments } from "../src/lib/reviewed-project-summaries-2026";

const expected = [
  ["back-to-school-bamenda-aug-2026", "2026-11-21", 20, 260000, true, "budget-published"],
  ["back-to-school-buea-aug-2026", "2026-09-12", 15, 150000, true, "budget-published"],
  ["girls-dignity-menstrual-health-bamenda-jun-2026", "2026-06-28", 20, 207750, false, "published"],
] as const;

describe("approved 2026 archive records", () => {
  it("replaces stale campaign goals, reach, dates, and art without changing other records", () => {
    const original: ProjectArchiveEntry[] = expected.map(([slug]) => ({
      slug: { current: slug }, title: "Old campaign", demographic: "orphans",
      year: 2026, status: "completed", startDate: "2026-08-15", beneficiaries: 40,
      budget: 2500, photo: { asset: { _ref: "old-flyer" } }, autoArchived: true,
    }));
    const unrelated = { ...original[0], slug: { current: "annual-event" }, year: 2025 };
    const rebuilt = sortArchiveEntriesChronologically(applyReviewed2026Summaries([...original, unrelated]));
    expect(rebuilt.map(row => row.slug.current)).toEqual([...expected.map(([slug]) => slug), unrelated.slug.current]);
    expect(rebuilt[3]).toEqual(unrelated);
    for (const [index, [slug, day, reach, budget, approximate, financeState]] of expected.entries()) {
      const record = rebuilt[index];
      expect(record).toMatchObject({ startDate: day, endDate: day, beneficiaries: reach, beneficiariesApproximate: approximate, status: "completed" });
      expect(record.budget).toBeUndefined();
      expect(record.autoArchived).toBeUndefined();
      expect(record.photo).toBeUndefined();
      expect(getEligibleArchiveFeaturePhoto(record, "fr")).toBeUndefined();
      expect(hasStaticProjectDocuments(slug)).toBe(true);
      const docs = projectDocumentPaths(slug);
      expect(docs.financial).toBeUndefined();
      for (const locale of ["en", "fr"] as const) {
        const published = { ...record, torUrl: docs.tor, reportUrl: docs.report };
        const finance = formatArchiveCardFinances(published, locale);
        expect(finance?.fcfa).toBe(budget);
        expect(finance?.text).toMatch(/FCFA$/);
        expect(finance?.text).not.toContain("USD");
        expect(getArchiveCardStatus(published, locale).finance.state).toBe(financeState);
        expect(getArchiveCardStatus(published, locale).documents.state).toBe("both");
        expect(formatArchiveCardFinances({ ...published, reportUrl: undefined }, locale)).toBeUndefined();
      }
    }
  });

  it("builds fallback records and resource entries independently of CMS", () => {
    expect(applyReviewed2026Summaries([])).toHaveLength(3);
    expect(listReleased2026ProjectDocuments().map(row => row.slug).sort()).toEqual(expected.map(([slug]) => slug).sort());
  });

  it("preserves both forms of old campaign URLs in each language", () => {
    const redirects = readFileSync("public/_redirects", "utf8").split(/\r?\n/);
    for (const [slug] of expected) {
      for (const locale of ["", "/fr"]) {
        for (const suffix of ["", "/"]) {
          expect(redirects).toContain(`${locale}/projects/${slug}${suffix} ${locale}/projects/archive/${slug}/ 301`);
        }
      }
    }
  });
});
