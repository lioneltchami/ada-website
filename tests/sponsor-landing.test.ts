import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { SPONSOR_FAQS_EN, SPONSOR_FAQS_FR } from "../src/lib/structured-data";

const landing = readFileSync("src/components/sponsor/SponsorLanding.astro", "utf8");

describe("Sponsor landing references available evidence", () => {
  it("links the verified project record and living diligence section, not withdrawn PDFs", () => {
    expect(landing).toContain("/resources#due-diligence");
    expect(landing).toContain("/projects/archive/back-to-school-buea-2024");
    expect(landing).not.toMatch(/corporate-sponsor-one-pager|sponsor-readiness-packet/);
    expect(existsSync("public/docs/diligence/ada-registration-certificate.pdf")).toBe(true);
    expect(existsSync("public/docs/projects/back-to-school-buea-2024/report.pdf")).toBe(true);
  });

  it("keeps suggested tiers separate from checkout", () => {
    expect(landing).toContain('const inquiryHref = local("/sponsor/inquiry")');
    expect(landing).toContain('id="start-sponsorship"');
    expect(landing).toContain("budgetRange=${encodeURIComponent(tier.key)}");
    expect(landing).toContain('href={local("/donate")}');
  });

  it("describes report timing as an agreement and payment receipts as non-tax documentation", () => {
    expect(SPONSOR_FAQS_EN[0].answer).toContain("not an official charitable tax receipt");
    expect(SPONSOR_FAQS_FR[0].answer).toContain("pas de reçu fiscal officiel");
    expect(SPONSOR_FAQS_EN[2].answer).toContain("depends on the sponsorship agreement");
    expect(SPONSOR_FAQS_FR[2].answer).toContain("dépend de l’accord de parrainage");
  });
});
