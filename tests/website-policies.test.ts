import { describe, expect, it } from "vitest";
import policies from "../src/data/website-policies.json";

describe("public website policies", () => {
  it.each(["privacy", "terms"] as const)("keeps %s sections aligned in English and French", (policy) => {
    const { en, fr } = policies[policy];
    expect(fr.sections.map(s => s.paragraphs.length)).toEqual(en.sections.map(s => s.paragraphs.length));
  });

  it("distinguishes an ordinary donation receipt and gives cancellation instructions in both languages", () => {
    expect(JSON.stringify(policies.terms.en)).toMatch(/does not issue official charitable tax receipts/);
    expect(JSON.stringify(policies.terms.fr)).toMatch(/ne délivre pas de reçus fiscaux officiels/);
    expect(JSON.stringify(policies.terms.en)).toMatch(/To cancel a monthly donation, email us/);
    expect(JSON.stringify(policies.terms.fr)).toMatch(/Pour annuler un don mensuel, écrivez-nous/);
  });
});
