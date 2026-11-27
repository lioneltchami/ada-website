import { describe, expect, it } from "vitest";
import { transparencyCopyFor } from "../src/data/transparency-copy";

describe("2024 annual financial notice", () => {
  it("explains the organization-wide review without extending it to outreach budgets", () => {
    const en = transparencyCopyFor("en").financial;
    const fr = transparencyCopyFor("fr").financial;
    expect(en.annualSummaryNote).toMatch(/organization-wide donations and financial totals for 2024/);
    expect(en.annualSummaryNote).toContain("does not cover individual outreach budgets");
    expect(fr.annualSummaryNote).toMatch(/totaux des dons .* l’ensemble de l’association pour 2024/);
    expect(fr.annualSummaryNote).toContain("ne concerne pas les budgets de chaque action");
    expect(en.rows.some(({ year }) => String(year) === "2024")).toBe(false);
    expect(fr.rows.some(({ year }) => String(year) === "2024")).toBe(false);
  });
});
