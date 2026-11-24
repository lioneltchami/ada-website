import {
  archiveProjectDocumentAvailability,
  archiveProjectDocumentLinks,
  archivePublishedFinancialAccount,
} from "./archive-project-document-links";
import type { ProjectArchiveEntry } from "./project-archive";
import {
  getArchiveRecordStatusText,
  type ProjectPresentationLocale,
} from "./project-detail-presentation";

export type ArchiveStatusTone = "positive" | "neutral" | "review";
export type ArchiveStatusRow = { label: string; value: string; state: string; tone: ArchiveStatusTone };

export const archiveStatusToneClass: Record<ArchiveStatusTone, string> = {
  positive: "text-green-800",
  neutral: "text-gray-700",
  review: "text-amber-800",
};

type ArchiveStatusInput = Pick<ProjectArchiveEntry,
  "slug" | "year" | "status" | "autoArchived" | "torUrl" | "reportUrl" | "financialReportUrl"
  | "financialReviewNote" | "financialReviewNoteFr"
>;

type ArchiveCardStatus = Record<"project" | "documents" | "finance", ArchiveStatusRow>;

export function getArchiveCardStatus(record: ArchiveStatusInput, locale: ProjectPresentationLocale): ArchiveCardStatus {
  const fr = locale === "fr";
  const { tor, report, financial } = archiveProjectDocumentLinks(record);
  const accountLabel = fr ? "Compte financier" : "Financial account";

  // Publication of an account says nothing about audit or reconciliation. The
  // release gate, not a generic report link or budget, establishes publication.
  let finance: ArchiveStatusRow;
  if (archivePublishedFinancialAccount(record, locale)) {
    finance = { label: accountLabel, value: fr ? "Publié" : "Published", state: "published", tone: "positive" };
  } else if (financial) {
    finance = { label: accountLabel, value: fr ? "PDF disponible" : "PDF available", state: "standalone-pdf", tone: "neutral" };
  } else if (record.financialReviewNote?.trim() || record.financialReviewNoteFr?.trim()) {
    const value = report
      ? fr ? "En cours de vérification" : "Under review"
      : fr ? "En cours de vérification ; compte non publié ici" : "Under review; account not posted here";
    finance = { label: fr ? "Chiffres financiers" : "Financial figures", value, state: "under-review", tone: "review" };
  } else if (report) {
    finance = { label: accountLabel, value: fr ? "Publication non confirmée" : "Publication not confirmed", state: "unconfirmed", tone: "neutral" };
  } else {
    finance = { label: accountLabel, value: fr ? "Non publié ici" : "Not posted here", state: "not-posted", tone: "neutral" };
  }

  const projectStatus = getArchiveRecordStatusText(record.status, false, locale);
  return {
    project: {
      label: fr ? "Projet" : "Project",
      value: record.autoArchived
        ? fr ? "Archivé selon la date de fin" : "Archived by end date"
        : projectStatus || (fr ? "Non précisé" : "Not recorded"),
      state: record.autoArchived ? "archived-by-end-date" : projectStatus ? record.status : "unknown",
      tone: record.status === "completed" && !record.autoArchived ? "positive" : "neutral",
    },
    documents: {
      label: "Documents",
      value: !tor && !report
        ? fr ? "TdR et rapport non publiés" : "ToR and report not posted"
        : archiveProjectDocumentAvailability(record, locale),
      state: tor && report ? "both" : tor ? "tor-only" : report ? "report-only" : "not-posted",
      tone: tor && report ? "positive" : "neutral",
    },
    finance,
  };
}
