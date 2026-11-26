import withheldProjectDocuments from "../../config/withheld-project-documents.json";
import { isWithdrawnProjectSlug } from "../lib/withdrawn-project-content";
import { hasReleased2024ProjectDocumentSet, hasReleased2025ProjectDocumentSet } from '../lib/reviewed-project-summaries-2024-25';
import { hasReleased2023ProjectDocumentSet, isProjectDocumentReviewPending } from '../lib/reviewed-project-records';
import { reviewed2026Release } from "../lib/reviewed-project-summaries-2026";
import documentReleases from "../../config/project-document-releases.json";
import type { Locale } from "../i18n";
import { outreachDisplayTitle } from "../lib/outreach-display-title";
import {
  IMPACT_FACTS,
  impactMetricsFor,
  type ImpactMetric,
  type MeasurableIndicator,
  measurableIndicatorsFor,
} from "./impact";

export type { ImpactMetric, MeasurableIndicator };

export const REGISTRATION_NUMBER = "N° 415/G.37/D14/VolI/SAAJP";

/** Canonical static registration PDF (not Sanity CDN). */
export const REGISTRATION_CERTIFICATE_URL =
  "/docs/diligence/ada-registration-certificate.pdf";

export const annualReportPdfs = [
  { year: "2021", path: "/docs/annual-reports/2021-annual-report.pdf" },
] as const;

/** Archive slugs under public/docs/projects/ (TOR, financial, report PDFs). */
export const documentArchiveProjects = [
  "back-to-school-drive-2023",
  "back-to-school-sep-2022",
  "christmas-giving-dec-2022",
  "city-cleanup-may-2023",
  "first-widow-home-visits-2021",
  "idp-girls-baking-training-jul-2022",
  "school-supply-distribution-feb-2022",
  "widow-support-food-cash-mar-2022",
  "womens-day-home-visits-mar-2023",
] as const;

export function archiveProjectTitle(slug: string): string {
  return slug
    .split("-")
    .map((part) =>
      /^\d{4}$/.test(part)
        ? part
        : part.charAt(0).toUpperCase() + part.slice(1),
    )
    .join(" ");
}

export function hasReleasedProjectDocumentSet(slug: string): boolean {
  return hasReleased2023ProjectDocumentSet(slug) || hasReleased2024ProjectDocumentSet(slug) || hasReleased2025ProjectDocumentSet(slug) || Boolean(reviewed2026Release(slug)) || documentReleases.projects.some((project) => project.slug === slug && project.status === "released");
}

export function projectDocumentPaths(slug: string) {
  const base = `/docs/projects/${slug}`;
  return {
    tor: `${base}/tor.pdf`,
    financial: hasReleasedProjectDocumentSet(slug) ? undefined : `${base}/financial.pdf`,
    report: `${base}/report.pdf`,
  };
}

export function hasStaticProjectDocuments(slug: string): boolean {
  if (isWithdrawnProjectSlug(slug) || isProjectDocumentReviewPending(slug)) return false;
  // Keep legacy sources outside the ledger even after the reviewed replacement PDFs go live.
  if (withheldProjectDocuments.includes(slug)) return hasReleased2025ProjectDocumentSet(slug);
  return hasReleasedProjectDocumentSet(slug) || (documentArchiveProjects as readonly string[]).includes(slug);
}

export function indicatorProgress(indicator: MeasurableIndicator): number {
  if (indicator.targetValue <= 0) return 0;
  return Math.min(
    100,
    Math.round((indicator.actualValue / indicator.targetValue) * 100),
  );
}

export const measurableIndicatorsEn = measurableIndicatorsFor("en");
export const measurableIndicatorsFr = measurableIndicatorsFor("fr");

const BREADCRUMB_LABELS: Record<Locale, Record<string, string>> = {
  en: {
    about: "About",
    projects: "Projects",
    stories: "Stories",
    "get-involved": "Get Involved",
    contact: "Contact",
    resources: "Resources",
    monthly: "Monthly Giving",
    partners: "Partners",
    sponsor: "Sponsor",
    inquiry: "Inquiry",
    "impact-scorecard": "Impact Scorecard",
    transparency: "Transparency",
    donate: "Donate",
    team: "Team",
    privacy: "Privacy",
    terms: "Terms",
  },
  fr: {
    about: "À propos",
    projects: "Projets",
    stories: "Témoignages",
    "get-involved": "S'impliquer",
    contact: "Contact",
    resources: "Ressources",
    monthly: "Don Mensuel",
    partners: "Partenaires",
    sponsor: "Sponsoriser",
    inquiry: "Demande",
    "impact-scorecard": "Tableau d'impact",
    transparency: "Transparence",
    donate: "Don",
    team: "Équipe",
    privacy: "Confidentialité",
    terms: "Conditions",
  },
};

export function buildBreadcrumbList(pathname: string, site: URL | undefined) {
  if (pathname === "/" || pathname === "/fr" || pathname === "/fr/")
    return null;

  let segments = pathname.split("/").filter(Boolean);
  const locale: Locale = segments[0] === "fr" ? "fr" : "en";
  if (segments[0] === "fr") segments = segments.slice(1);

  if (segments.length === 0) return null;

  const prefix = locale === "fr" ? "/fr" : "";
  const labels = BREADCRUMB_LABELS[locale];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: segments.map((segment, index) => {
      const path = `${prefix}/${segments.slice(0, index + 1).join("/")}`;
      const label = labels[segment] ?? archiveProjectTitle(segment);
      const name = segments[0] === "projects" && index === segments.length - 1
        ? outreachDisplayTitle({ slug: segment, title: label }, locale)
        : label;
      return {
        "@type": "ListItem",
        position: index + 1,
        name,
        item: new URL(path, site ?? "https://apotidev.org").toString(),
      };
    }),
  };
}

export { impactMetricsFor, IMPACT_FACTS };
