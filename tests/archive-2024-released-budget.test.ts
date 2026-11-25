import { describe, expect, it } from "vitest";
import { getArchiveCardStatus } from "../src/lib/archive-card-status";
import {
  archivePublishedBudgetFcfa,
  archivePublishedFinancialAccount,
  formatArchiveFcfa,
} from "../src/lib/archive-project-document-links";

const released = {
  "back-to-school-buea-2024": 82_750,
  "girls-programme-2024": 250_700,
  "christmas-giving-dec-2024": 260_000,
} as const;

function fixture(slug: string, amount: number) {
  const base = `/docs/projects/${slug}`;
  return {
    slug: { current: slug },
    year: 2024,
    status: "completed" as const,
    approvedBudgetFcfa: amount,
    torUrl: base + "/tor.pdf",
    reportUrl: base + "/report.pdf",
  };
}

describe("2024 reviewed budget presentation", () => {
  it("distinguishes a published budget from a financial account in both locales", () => {
    for (const [slug, amount] of Object.entries(released)) {
      const record = fixture(slug, amount);
      expect(archivePublishedBudgetFcfa(record)).toBe(amount);
      expect(archivePublishedFinancialAccount(record, "en")).toBeUndefined();
      expect(getArchiveCardStatus(record, "en")).toMatchObject({
        project: { state: "completed", tone: "positive" },
        documents: { state: "both", tone: "positive" },
        finance: { label: "Budget", value: "Published in report", state: "budget-published", tone: "positive" },
      });
      expect(getArchiveCardStatus(record, "fr").finance).toEqual({
        label: "Budget", value: "Publié dans le rapport", state: "budget-published", tone: "positive",
      });
    }
  });

  it("requires a released project, canonical pair, correct year and valid amount", () => {
    const record = fixture("back-to-school-buea-2024", 82_750);
    for (const unverified of [
      fixture("emergency-food-relief-bamenda-crisis", 82_750),
      { ...record, approvedBudgetFcfa: undefined },
      { ...record, approvedBudgetFcfa: Number.NaN },
      { ...record, torUrl: undefined },
      { ...record, reportUrl: "/docs/projects/back-to-school-sep-2022/report.pdf" },
      { ...record, year: 2025 },
    ]) {
      expect(archivePublishedBudgetFcfa(unverified)).toBeUndefined();
      expect(getArchiveCardStatus(unverified, "en").finance.state).not.toBe("budget-published");
    }
  });

  it("uses FCFA with locale-appropriate grouping, never USD", () => {
    expect(formatArchiveFcfa(82_750, "en")).toBe("82,750 FCFA");
    expect(formatArchiveFcfa(82_750, "fr")).toBe("82\u202f750 FCFA");
  });
});
