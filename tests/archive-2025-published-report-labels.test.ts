import { describe, expect, it } from "vitest";
import { formatArchiveCardFinances } from "../src/lib/archive-card-finances";
import { getArchiveCardStatus } from "../src/lib/archive-card-status";
import {
  archivePublished2025ReportContents,
  archivePublishedBudgetFcfa,
  archivePublishedFinancialAccount,
  released2025ReportLabel,
} from "../src/lib/archive-project-document-links";

const released = {
  "womens-day-widows-outreach-2025": [240000, "calculated-worksheet-budget"],
  "prenatal-care-support-program": [150000, "budget"],
  "city-cleanup-may-2025": [50000, "budget"],
  "back-to-school-buea-2025": [102600, "worksheet-budget"],
  "back-to-school-bamenda-aug-2025": [151000, "worksheet-budget"],
  "christmas-orphanage-outreach-2025": [119500, "working-cost-list"],
} as const;
function fixture(slug: string) {
  const base = `/docs/projects/${slug}`;
  return {
    slug: { current: slug },
    year: 2025,
    status: "completed" as const,
    torUrl: base + "/tor.pdf",
    reportUrl: base + "/report.pdf",
  };
}

describe("2025 published documents in the project archive", () => {
  it("distinguishes report budget details, Christmas working costs and financial accounts", () => {
    for (const [slug, [fcfa, basis]] of Object.entries(released)) {
      const record = fixture(slug);
      const christmas = slug === "christmas-orphanage-outreach-2025";
      expect(archivePublished2025ReportContents(record)).toBe(christmas ? "cost-list" : "budget-details");
      expect(archivePublishedBudgetFcfa(record)).toBeUndefined();
      expect(archivePublishedFinancialAccount(record, "en")).toBeUndefined();
      expect(formatArchiveCardFinances(record, "en")).toMatchObject({ fcfa, basis });
      expect(formatArchiveCardFinances(record, "fr")).toMatchObject({ fcfa, basis });
      const enStatus = getArchiveCardStatus(record, "en");
      expect(enStatus.project.state).toBe("completed");
      expect(enStatus.documents.state).toBe("both");
      expect(enStatus.finance).toMatchObject({ state: christmas ? "cost-list-published" : "budget-details-published", value: "Published in report" });
      expect(getArchiveCardStatus(record, "fr").finance.value).toBe(christmas ? "Publiée dans le rapport" : "Publiés dans le rapport");
      expect(released2025ReportLabel(slug, "en", "&")).toBe(christmas ? "Project report & itemized cost list" : "Project report & budget details");
      expect(released2025ReportLabel(slug, "fr")).toBe(christmas ? "Rapport de projet et liste détaillée des coûts" : "Rapport de projet et détails budgétaires");
    }
  });

  it("does not imply the release when either canonical file is missing or the year or project is wrong", () => {
    const record = fixture("back-to-school-buea-2025");
    for (const candidate of [
      { ...record, torUrl: undefined },
      { ...record, reportUrl: undefined },
      { ...record, torUrl: "/docs/projects/back-to-school-buea-2024/tor.pdf" },
      { ...record, year: 2024 },
      fixture("unknown-project-2025"),
    ]) {
      expect(archivePublished2025ReportContents(candidate)).toBeUndefined();
      expect(getArchiveCardStatus(candidate, "en").finance.state).not.toBe("budget-details-published");
    }
  });
});
