import { describe, expect, it } from "vitest";
import { archiveProjectDocumentAvailability as availability, archiveProjectDocumentLinks as links } from "../src/lib/archive-project-document-links";

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
