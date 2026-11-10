import { isProjectDocumentReviewPending } from '../lib/reviewed-project-records';
import documentReleases from "../../config/project-document-releases.json";
import type { Locale } from "../i18n";
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
  "back-to-school-bamenda-sep-2024",
  "back-to-school-drive-2023",
  "back-to-school-sep-2022",
  "back-to-school-sep-2024",
  "campus-cleanup-aug-2025",
  "christmas-giving-dec-2022",
  "christmas-giving-dec-2024",
  "city-cleanup-may-2023",
  "city-cleanup-may-2025",
  "emergency-food-relief-bamenda-crisis",
  "first-widow-home-visits-2021",
  "hospital-prenatal-care-jul-2025",
  "idp-children-education-fund",
  "idp-girls-baking-training-jul-2022",
  "prenatal-care-support-program",
  "school-supply-distribution-feb-2022",
  "widow-support-food-cash-mar-2022",
  "womens-day-home-visits-mar-2023",
  "youth-mentorship-seminar-oct-2025",
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
  return documentReleases.projects.some((project) => project.slug === slug && project.status === "released");
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
  if (isProjectDocumentReviewPending(slug)) return false;
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
      return {
        "@type": "ListItem",
        position: index + 1,
        name: labels[segment] ?? archiveProjectTitle(segment),
        item: new URL(path, site ?? "https://apotidev.org").toString(),
      };
    }),
  };
}

export { impactMetricsFor, IMPACT_FACTS };
