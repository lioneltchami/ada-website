import { reviewed2026Release } from "./reviewed-project-summaries-2026";
import releases from "../../config/project-document-releases.json";
import type { ProjectArchiveEntry } from "./project-archive";
import type { ProjectPresentationLocale } from "./project-detail-presentation";
import { hasReleased2023ProjectDocumentSet } from "./reviewed-project-records";
import { hasReleased2024ProjectDocumentSet, hasReleased2025ProjectDocumentSet } from "./reviewed-project-summaries-2024-25";

type DocumentRecord = Pick<ProjectArchiveEntry, "slug" | "torUrl" | "reportUrl" | "financialReportUrl">;
type Kind = "tor" | "report" | "financial";

/** Only a resolved, intended public PDF target can make a document available here. */
function publicPdfHref(value: string | null | undefined, slug: string, kind: Kind): string | undefined {
  if (!value || value !== value.trim()) return undefined;
  if (/^[a-z0-9-]+$/.test(slug) && value === `/docs/projects/${slug}/${kind}.pdf`) return value;
  try {
    const url = new URL(value);
    if (url.origin === "https://cdn.sanity.io" && !url.username && !url.password
      && !url.search && !url.hash && /^\/files\/[a-z0-9]+\/[a-z0-9-]+\/[a-f0-9]+\.pdf$/i.test(url.pathname)) return value;
  } catch {
    // No usable public PDF link.
  }
  return undefined;
}

export function archiveProjectDocumentLinks(record: DocumentRecord) {
  const slug = record.slug.current;
  return {
    tor: publicPdfHref(record.torUrl, slug, "tor"),
    report: publicPdfHref(record.reportUrl, slug, "report"),
    financial: publicPdfHref(record.financialReportUrl, slug, "financial"),
  };
}

export function archiveProjectDocumentAvailability(record: DocumentRecord, locale: ProjectPresentationLocale): string {
  const { tor, report } = archiveProjectDocumentLinks(record);
  if (locale === "fr") {
    if (tor && report) return "TdR et rapport disponibles";
    if (tor) return "TdR disponibles · Rapport non publié sur ce site";
    if (report) return "Rapport disponible · TdR non publiés sur ce site";
    return "Documents non publiés";
  }
  if (tor && report) return "ToR and report available";
  if (tor) return "ToR available · Report not posted here";
  if (report) return "Report available · ToR not posted here";
  return "Documents not posted";
}

/** Publication of an account is independent of reconciliation of its figures. */
export function archivePublishedFinancialAccount(
  record: DocumentRecord & Pick<ProjectArchiveEntry, "year">,
  locale: ProjectPresentationLocale,
): string | undefined {
  const slug = record.slug.current;
  const { financial, report } = archiveProjectDocumentLinks(record);
  const isPublished = (record.year === 2021 && slug === "first-widow-home-visits-2021"
    && financial === `/docs/projects/${slug}/financial.pdf`)
    || (record.year === 2022
      && report === `/docs/projects/${slug}/report.pdf`
      && releases.projects.some((project) => project.slug === slug && project.status === "released"))
    || (record.year === 2023
      && report === `/docs/projects/${slug}/report.pdf`
      && hasReleased2023ProjectDocumentSet(slug));
  if (!isPublished) return undefined;
  return locale === "fr" ? "Compte financier publié" : "Financial account published";
}

/** These reports publish an itemized budget, not a verified expenditure account. */
export function archivePublishedBudgetFcfa(
  record: DocumentRecord & Pick<ProjectArchiveEntry, "year" | "approvedBudgetFcfa">,
): number | undefined {
  const slug = record.slug.current;
  const { tor, report } = archiveProjectDocumentLinks(record);
  const amount = record.approvedBudgetFcfa;
  if (record.year !== 2024 || !hasReleased2024ProjectDocumentSet(slug)
    || tor !== `/docs/projects/${slug}/tor.pdf`
    || report !== `/docs/projects/${slug}/report.pdf`
    || typeof amount !== "number" || !Number.isSafeInteger(amount) || amount <= 0) return undefined;
  return amount;
}

export function released2025ReportContents(slug: string): "budget-details" | "cost-list" | undefined {
  if (!hasReleased2025ProjectDocumentSet(slug)) return undefined;
  return "budget-details";
}

/** Require both approved canonical files; a draft or a CMS link cannot make the budget public. */
export function archivePublished2025ReportContents(
  record: DocumentRecord & Pick<ProjectArchiveEntry, "year">,
) {
  const slug = record.slug.current;
  const { tor, report } = archiveProjectDocumentLinks(record);
  if (record.year !== 2025 || tor !== `/docs/projects/${slug}/tor.pdf`
    || report !== `/docs/projects/${slug}/report.pdf`) return undefined;
  return released2025ReportContents(slug);
}

export function released2025ReportLabel(slug: string, locale: ProjectPresentationLocale, conjunction = "and"): string | undefined {
  const contents = released2025ReportContents(slug);
  if (!contents) return undefined;
  if (locale === "fr") return contents === "cost-list"
    ? "Rapport de projet et liste détaillée des coûts" : "Rapport de projet et détails budgétaires";
  return `Project report ${conjunction} ${contents === "cost-list" ? "itemized cost list" : "budget details"}`;
}

/** The exact public pair must be present; a CMS attachment alone does not qualify. */
export function archivePublished2026Finance(record: DocumentRecord & Pick<ProjectArchiveEntry, "year">) {
  const slug = record.slug.current;
  const { tor, report } = archiveProjectDocumentLinks(record);
  if (record.year === 2026 && tor === `/docs/projects/${slug}/tor.pdf` && report === `/docs/projects/${slug}/report.pdf`) {
    return reviewed2026Release(slug);
  }
  return undefined;
}

export function released2026ReportLabel(slug: string, locale: ProjectPresentationLocale, conjunction = "and"): string | undefined {
  if (!reviewed2026Release(slug)) return undefined;
  const hasFinancialAccount = slug === "girls-dignity-menstrual-health-bamenda-jun-2026";
  return locale === "fr"
    ? hasFinancialAccount ? "Rapport de projet et compte financier" : "Rapport de projet et budget"
    : `Project report ${conjunction} ${hasFinancialAccount ? "financial account" : "budget"}`;
}

export function formatArchiveFcfa(amount: number, locale: ProjectPresentationLocale): string {
  return new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US").format(amount) + " FCFA";
}
