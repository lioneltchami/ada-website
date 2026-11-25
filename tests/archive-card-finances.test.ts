import { describe, expect, it } from "vitest";
import { formatArchiveCardFinances } from "../src/lib/archive-card-finances";

function entry(slug: string, year: number, approvedBudgetFcfa?: number) {
  return {
    slug: { current: slug }, year, approvedBudgetFcfa,
    torUrl: `/docs/projects/${slug}/tor.pdf`,
    reportUrl: `/docs/projects/${slug}/report.pdf`,
  };
}

describe("source-backed archive card finances", () => {
  it("adds approximate USD to all three exact approved 2024 budgets", () => {
    for (const [slug, fcfa, usd] of [
      ["back-to-school-buea-2024", 82750, 139],
      ["girls-programme-2024", 250700, 416],
      ["christmas-giving-dec-2024", 260000, 415],
    ] as const) {
      const row = entry(slug, 2024, fcfa);
      expect(formatArchiveCardFinances(row, "en")).toMatchObject({ basis: "budget", label: "Budget", fcfa, usd });
      expect(formatArchiveCardFinances(row, "fr")?.text).toMatch(new RegExp(`FCFA \\(env\\. ${usd} USD\\)$`));
    }
  });

  it("keeps reported funding separate from recorded budgets and qualifications", () => {
    expect(formatArchiveCardFinances(entry("first-widow-home-visits-2021", 2021), "en")).toMatchObject({
      basis: "reported-funds", label: "Reported funding", text: "120,000 FCFA (approx. 209 USD)",
    });
    expect(formatArchiveCardFinances(entry("widow-support-food-cash-mar-2022", 2022), "en")?.text)
      .toBe("approx. 220,000 FCFA (approx. 370 USD)");
    expect(formatArchiveCardFinances(entry("school-visit-may-2022", 2022), "en")).toMatchObject({
      basis: "cash-in-kind-budget", fcfa: 180_000,
    });
    expect(formatArchiveCardFinances(entry("back-to-school-drive-2023", 2023), "fr")).toMatchObject({
      basis: "budget", fcfa: 240_000,
    });
    expect(formatArchiveCardFinances(entry("girls-day-oct-2023", 2023), "en")).toMatchObject({
      basis: "funds-sent", fcfa: 150_000,
    });
  });

  it("does not fill an unknown project budget or apply known years to mismatched rows", () => {
    expect(formatArchiveCardFinances(entry("emergency-food-relief-bamenda-crisis", 2024, 400_000), "en")).toBeUndefined();
    expect(formatArchiveCardFinances(entry("girls-day-oct-2023", 2022), "en")).toBeUndefined();
    expect(formatArchiveCardFinances({ ...entry("girls-programme-2024", 2024, 250_700), reportUrl: undefined }, "en")).toBeUndefined();
  });
});

describe("2025 worksheet figures", () => {
  it("shows FCFA and approximate historical USD without presenting worksheets as spending", () => {
    for (const [slug, fcfa, usd, basis] of [
      ["womens-day-widows-outreach-2025", 240000, 396, "calculated-worksheet-budget"],
      ["prenatal-care-support-program", 150000, 247, "budget"],
      ["back-to-school-buea-2025", 102600, 182, "worksheet-budget"],
      ["back-to-school-bamenda-aug-2025", 151000, 268, "worksheet-budget"],
      ["christmas-orphanage-outreach-2025", 119500, 213, "working-cost-list"],
    ] as const) {
      expect(formatArchiveCardFinances(entry(slug, 2025), "en")).toMatchObject({ fcfa, usd, basis });
      expect(formatArchiveCardFinances(entry(slug, 2025), "fr")?.text).toContain(`env. ${usd} USD`);
    }
  });
  it("does not reuse unsupported or prior-year amounts for prenatal and cleanup", () => {
    expect(formatArchiveCardFinances(entry("prenatal-care-support-program", 2025, 1_050_000), "en")?.fcfa).toBe(150_000);
    expect(formatArchiveCardFinances(entry("city-cleanup-may-2025", 2025, 300_000), "fr")).toBeUndefined();
  });
});
