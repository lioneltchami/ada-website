import { describe, expect, it } from "vitest";
import { getArchiveCardStatus as status } from "../src/lib/archive-card-status";

const base = {
  slug: { current: "city-cleanup-may-2023" },
  year: 2023,
  status: "completed" as const,
};
const torUrl = "/docs/projects/city-cleanup-may-2023/tor.pdf";
const reportUrl = "/docs/projects/city-cleanup-may-2023/report.pdf";
const legacy = { ...base, slug: { current: "older-archive" }, year: 2024 };
const legacyReport = "/docs/projects/older-archive/report.pdf";
const legacyFinance = "/docs/projects/older-archive/financial.pdf";

describe("archive card status separates progress, documents and accounts", () => {
  it("uses three explicit green statuses only where evidenced", () => {
    const record = { ...base, torUrl, reportUrl, financialReviewNote: "Not audited." };
    expect(status(record, "en")).toEqual({
      project: { label: "Project", value: "Completed", state: "completed", tone: "positive" },
      documents: { label: "Documents", value: "ToR and report available", state: "both", tone: "positive" },
      finance: { label: "Financial account", value: "Published", state: "published", tone: "positive" },
    });
    expect(status(record, "fr").finance).toEqual({ label: "Compte financier", value: "Publié", state: "published", tone: "positive" });
  });

  it("does not let automatic archiving or an amount imply completion or publication", () => {
    const record = { ...base, autoArchived: true, budget: 25 };
    expect(status(record, "en")).toEqual({
      project: { label: "Project", value: "Archived by end date", state: "archived-by-end-date", tone: "neutral" },
      documents: { label: "Documents", value: "ToR and report not posted", state: "not-posted", tone: "neutral" },
      finance: { label: "Financial account", value: "Not posted here", state: "not-posted", tone: "neutral" },
    });
    expect(status(record, "fr").documents.value).toBe("TdR et rapport non publiés");
  });

  it("names the unavailable member of a partial pair in both locales", () => {
    expect(status({ ...base, torUrl }, "en").documents).toMatchObject({ value: "ToR available · Report not posted here", state: "tor-only", tone: "neutral" });
    expect(status({ ...base, reportUrl }, "fr").documents).toMatchObject({ value: "Rapport disponible · TdR non publiés sur ce site", state: "report-only", tone: "neutral" });
  });

  it("distinguishes an actual legacy finance PDF from a report that may not include finance", () => {
    const record = { ...legacy, reportUrl: legacyReport };
    expect(status(record, "en").finance).toMatchObject({ value: "Publication not confirmed", state: "unconfirmed", tone: "neutral" });
    expect(status({ ...record, financialReportUrl: legacyFinance }, "fr").finance).toMatchObject({ value: "PDF disponible", state: "standalone-pdf", tone: "neutral" });
  });

  it("reserves review color for records with review evidence, not merely an ongoing project", () => {
    const record = { ...legacy, status: "ongoing" as const, financialReviewNoteFr: "A vérifier" };
    expect(status(record, "en").project).toMatchObject({ value: "Ongoing", state: "ongoing", tone: "neutral" });
    expect(status(record, "en").finance).toEqual({ label: "Financial figures", value: "Under review; account not posted here", state: "under-review", tone: "review" });
    expect(status(record, "fr").finance.value).toBe("En cours de vérification ; compte non publié ici");
    expect(status({ ...record, reportUrl: legacyReport }, "en").finance.value).toBe("Under review");
    expect(status({ ...record, reportUrl: legacyReport }, "fr").finance.value).toBe("En cours de vérification");
  });
});
