import { describe, expect, it } from "vitest";
import {
  formatUsdAmount,
  getPausedProjectMessage,
  getArchiveRecordStatusText,
  getProjectReportLabel,
  getProjectStatusText,
} from "../src/lib/project-detail-presentation";

describe("project detail presentation", () => {
  it("formats project amounts with an explicit USD currency in both locales", () => {
    expect(formatUsdAmount(2500, "en")).toBe("$2,500");
    expect(formatUsdAmount(2500, "fr")).toContain("2 500");
    expect(formatUsdAmount(2500, "fr")).toContain("$US");
  });

  it("distinguishes an end-date archive from a manually completed project", () => {
    expect(getProjectStatusText("completed", true, "en")).toBe("Archived");
    expect(getProjectStatusText("completed", false, "en")).toBe("Completed");
    expect(getProjectStatusText("completed", true, "fr")).toBe("Archivé");
  });

  it("labels date-derived archive records without claiming a completed outcome", () => {
    expect(getArchiveRecordStatusText("completed", true, "en")).toBe(
      "Archived",
    );
    expect(getArchiveRecordStatusText("completed", true, "fr")).toBe(
      "Archivé",
    );
    expect(getArchiveRecordStatusText("completed", false, "en")).toBe("Completed");
  });

  it("keeps paused projects from presenting an outstanding fundraising ask", () => {
    expect(getPausedProjectMessage("en")).toBe(
      "This project is paused and is not accepting project-specific donations.",
    );
    expect(getPausedProjectMessage("fr")).toBe(
      "Ce projet est en pause et n'accepte pas de dons dédiés.",
    );
  });

  it("uses neutral project-report labels for linked PDFs", () => {
    expect(getProjectReportLabel("en")).toBe("Project report (PDF)");
    expect(getProjectReportLabel("fr")).toBe("Rapport de projet (PDF)");
  });
});
