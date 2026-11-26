import { describe, expect, it } from "vitest";
import policies from "../src/data/website-policies.json";

describe("public website policies", () => {
  it.each(["privacy", "terms"] as const)("keeps %s sections aligned in English and French", (policy) => {
    const { en, fr } = policies[policy];
    expect(fr.sections.map(s => s.paragraphs.length)).toEqual(en.sections.map(s => s.paragraphs.length));
  });

  it("states ADA’s confirmed retention periods in both languages", () => {
    const en = JSON.stringify(policies.privacy.en);
    const fr = JSON.stringify(policies.privacy.fr);
    expect(en).toMatch(/donation records for 7 years, contact requests for up to 12 months, and sponsorship inquiries for up to 24 months/);
    expect(fr).toMatch(/dossiers de dons pendant 7 ans, les demandes de contact pendant au plus 12 mois et les demandes de parrainage pendant au plus 24 mois/);
  });

  it("preserves existing notice and donor safeguards", () => {
    for (const policy of [policies.privacy, policies.terms]) {
      expect(JSON.stringify(policy.en)).toMatch(/significant changes/i);
      expect(JSON.stringify(policy.fr)).toMatch(/modifications? importantes?/i);
    }
    expect(JSON.stringify(policies.terms.en)).toMatch(/at least 14 days before they take effect/);
    expect(JSON.stringify(policies.terms.fr)).toMatch(/au moins 14 jours avant/);
    expect(JSON.stringify(policies.terms.fr)).not.toMatch(/ne dépasse pas le montant de votre dernier don/);
  });

  it("distinguishes an ordinary donation receipt and gives cancellation instructions in both languages", () => {
    expect(JSON.stringify(policies.terms.en)).toMatch(/does not issue official charitable tax receipts/);
    expect(JSON.stringify(policies.terms.fr)).toMatch(/ne délivre pas de reçus fiscaux officiels/);
    expect(JSON.stringify(policies.terms.en)).toMatch(/To cancel a monthly donation, email us/);
    expect(JSON.stringify(policies.terms.fr)).toMatch(/Pour annuler un don mensuel, écrivez-nous/);
  });
});
