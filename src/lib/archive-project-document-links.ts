import type { ProjectArchiveEntry } from "./project-archive";
import type { ProjectPresentationLocale } from "./project-detail-presentation";

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
