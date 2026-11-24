import releases from "../config/project-document-releases.json";
import review2023 from "../config/project-records-2023.json";
import { describe, expect, it } from "vitest";
import { archiveProjectDocumentAvailability as availability, archivePublishedFinancialAccount as publishedFinance, archiveProjectDocumentLinks as links } from "../src/lib/archive-project-document-links";

const slug = { current: "city-cleanup-may-2023" };
const torUrl = "/docs/projects/city-cleanup-may-2023/tor.pdf";
const reportUrl = "/docs/projects/city-cleanup-may-2023/report.pdf";
const cid = "https://cdn.sanity.io/files/rj2m21gk/production/" + "a".repeat(40) + ".pdf";

describe("public archive document availability", () => {
  it("reports each resolution based on its exact public downloadable URL", () => {
    expect(links({ slug, torUrl, reportUrl })).toEqual({ tor:torUrl, report:reportUrl, financial:undefined });
    expect(links({ slug, reportUrl:cid })).toEqual({ tor:undefined, report:cid, financial:undefined });
    expect(availability({ slug, torUrl, reportUrl },"en")).toBe("ToR and report available");
    expect(availability({ slug, torUrl, reportUrl },"fr")).toBe("TdR et rapport disponibles");
    expect(availability({ slug, torUrl },"en")).toBe("ToR available · Report not posted here");
    expect(availability({ slug, reportUrl:cid },"fr")).toBe("Rapport disponible · TdR non publiés sur ce site");
  });

  it("does not imply unwritten documents or promote unresolved, non-PDF, foreign or legacy file targets", () => {
    const unresolved = { slug, hasToR:true, hasReport:true };
    expect(availability(unresolved,"en")).toBe("Documents not posted");
    expect(availability(unresolved,"fr")).toBe("Documents non publiés");
    for (const bad of ["", " ", "/docs/projects/old-project/report.pdf", torUrl, "javascript:alert(1)", "https://cdn.sanity.io.evil.example/file.pdf", cid + "?access=private", cid.replace(".pdf",".docx"), cid.replace("https:","http:")]) {
      expect(links({ slug, reportUrl:bad }).report).toBeUndefined();
    }
  });

  it("keeps a standalone public financial PDF distinct from the ToR or completion report", () => {
    const onlyFinancial = { slug, financialReportUrl:"/docs/projects/city-cleanup-may-2023/financial.pdf" };
    expect(links(onlyFinancial).financial).toBe(onlyFinancial.financialReportUrl);
    expect(availability(onlyFinancial,"en")).toBe("Documents not posted");
  });
});

describe("published financial accounts on the archive", () => {
  const marker = { en: "Financial account published", fr: "Compte financier publié" };

  it("requires the canonical 2021 financial PDF, not the ToR or general report", () => {
    const slug = { current: "first-widow-home-visits-2021" };
    const base = `/docs/projects/${slug.current}`;
    const record = { slug, year: 2021, torUrl: base + "/tor.pdf", reportUrl: base + "/report.pdf" };
    expect(publishedFinance(record, "en")).toBeUndefined();
    expect(publishedFinance({ ...record, financialReportUrl: base + "/financial.pdf" }, "en")).toBe(marker.en);
    expect(publishedFinance({ ...record, financialReportUrl: base + "/financial.pdf" }, "fr")).toBe(marker.fr);
    expect(publishedFinance({ ...record, financialReportUrl: base + "/report.pdf" }, "en")).toBeUndefined();
  });

  it("uses combined reports for all six released 2022 records, without promoting other projects", () => {
    const projects = releases.projects.filter(project => project.status === "released");
    expect(projects).toHaveLength(6);
    for (const project of projects) {
      const slug = { current: project.slug };
      const reportUrl = `/docs/projects/${slug.current}/report.pdf`;
      const record = { slug, year: 2022, reportUrl };
      expect(publishedFinance(record, "en")).toBe(marker.en);
      expect(publishedFinance(record, "fr")).toBe(marker.fr);
      expect(publishedFinance({ ...record, reportUrl: undefined }, "en")).toBeUndefined();
      expect(publishedFinance({ ...record, year: 2023 }, "en")).toBeUndefined();
    }
    expect(publishedFinance({ slug, reportUrl, year: 2022 }, "en")).toBeUndefined();
  });

  it("uses the canonical combined report for each of the seven released 2023 projects", () => {
    const projects = review2023.projects.filter(project => project.documentStatus === "released");
    expect(projects).toHaveLength(7);
    for (const project of projects) {
      const slug = { current: project.slug };
      const base = `/docs/projects/${slug.current}`;
      const record = { slug, year: 2023, reportUrl: base + "/report.pdf" };
      expect(publishedFinance(record, "en")).toBe(marker.en);
      expect(publishedFinance(record, "fr")).toBe(marker.fr);
      expect(publishedFinance({ ...record, reportUrl: undefined, torUrl: base + "/tor.pdf" }, "en")).toBeUndefined();
      expect(publishedFinance({ ...record, reportUrl: cid }, "fr")).toBeUndefined();
      expect(publishedFinance({ ...record, reportUrl: "/docs/projects/another-project/report.pdf" }, "en")).toBeUndefined();
      expect(publishedFinance({ ...record, year: 2024 }, "en")).toBeUndefined();
    }
  });

  it("does not promote an unrelated 2023 record even when it has a report", () => {
    const slug = { current: "unreviewed-2023-project" };
    expect(publishedFinance({ slug, year: 2023, reportUrl: `/docs/projects/${slug.current}/report.pdf` }, "en")).toBeUndefined();
  });
});
