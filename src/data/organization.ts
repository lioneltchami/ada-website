import type { Locale } from "../i18n";

export const REGISTRATION_NUMBER = "N° 415/G.37/D14/VolI/SAAJP";

export const REGISTRATION_CERTIFICATE_URL =
  "https://cdn.sanity.io/files/rj2m21gk/production/c226e76c904614c95ddc186d942e656f531483a1.pdf";

export const annualReportPdfs = [
  { year: "2024", path: "/docs/annual-reports/2024-annual-report.pdf" },
  { year: "2023", path: "/docs/annual-reports/2023-annual-report.pdf" },
  { year: "2022", path: "/docs/annual-reports/2022-annual-report.pdf" },
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
  "clean-water-well-nkwen-mbatu",
  "emergency-food-relief-bamenda-crisis",
  "first-widow-home-visits-2021",
  "hospital-prenatal-care-jul-2025",
  "idp-children-education-fund",
  "idp-girls-baking-training-jul-2022",
  "prenatal-care-support-program",
  "school-supply-distribution-feb-2022",
  "school-visit-mentorship-may-2022",
  "widow-support-food-cash-mar-2022",
  "widow-support-program-cohort-3",
  "widow-vocational-training-cohort-1",
  "womens-day-home-visits-mar-2023",
  "young-women-conference-oct-2024",
  "young-women-skills-training-program",
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

export type MeasurableIndicator = {
  indicator: string;
  baseline: string;
  target: string;
  actual: string;
  status: "on-track" | "in-progress";
  actualValue: number;
  targetValue: number;
};

export function indicatorProgress(indicator: MeasurableIndicator): number {
  if (indicator.targetValue <= 0) return 0;
  return Math.min(
    100,
    Math.round((indicator.actualValue / indicator.targetValue) * 100),
  );
}

export const measurableIndicatorsEn: MeasurableIndicator[] = [
  {
    indicator: "Widows achieving financial independence",
    baseline: "0 (2021)",
    target: "20 by 2025",
    actual: "12 of 15 trained (80%)",
    status: "on-track",
    actualValue: 12,
    targetValue: 20,
  },
  {
    indicator: "Children enrolled and retained in school",
    baseline: "0 (2021)",
    target: "50 by 2026",
    actual: "20 enrolled, 100% retention",
    status: "on-track",
    actualValue: 20,
    targetValue: 50,
  },
  {
    indicator: "Women completing vocational training",
    baseline: "0 (2022)",
    target: "30 by 2026",
    actual: "10 graduated, 8 earning income",
    status: "on-track",
    actualValue: 10,
    targetValue: 30,
  },
  {
    indicator: "Communities with clean water access",
    baseline: "0 (2024)",
    target: "3 by 2026",
    actual: "1 well completed (300+ served)",
    status: "in-progress",
    actualValue: 1,
    targetValue: 3,
  },
  {
    indicator: "Families receiving emergency food support",
    baseline: "3 (2022)",
    target: "100/year",
    actual: "50 families in 2024",
    status: "on-track",
    actualValue: 50,
    targetValue: 100,
  },
];

export const measurableIndicatorsFr: MeasurableIndicator[] = [
  {
    indicator: "Veuves atteignant l'indépendance financière",
    baseline: "0 (2021)",
    target: "20 d'ici 2025",
    actual: "12 sur 15 formées (80%)",
    status: "on-track",
    actualValue: 12,
    targetValue: 20,
  },
  {
    indicator: "Enfants inscrits et maintenus à l'école",
    baseline: "0 (2021)",
    target: "50 d'ici 2026",
    actual: "20 inscrits, 100% de rétention",
    status: "on-track",
    actualValue: 20,
    targetValue: 50,
  },
  {
    indicator: "Femmes ayant terminé la formation professionnelle",
    baseline: "0 (2022)",
    target: "30 d'ici 2026",
    actual: "10 diplômées, 8 génèrent des revenus",
    status: "on-track",
    actualValue: 10,
    targetValue: 30,
  },
  {
    indicator: "Communautés avec accès à l'eau potable",
    baseline: "0 (2024)",
    target: "3 d'ici 2026",
    actual: "1 puits achevé (300+ desservis)",
    status: "in-progress",
    actualValue: 1,
    targetValue: 3,
  },
  {
    indicator: "Familles recevant une aide alimentaire d'urgence",
    baseline: "3 (2022)",
    target: "100/an",
    actual: "50 familles en 2024",
    status: "on-track",
    actualValue: 50,
    targetValue: 100,
  },
];

export const impactGrowthByYear = [
  { year: "2021", value: 10, label: "10" },
  { year: "2022", value: 50, label: "50" },
  { year: "2023", value: 120, label: "120" },
  { year: "2024", value: 200, label: "200" },
  { year: "2025", value: 280, label: "280 (Est.)" },
] as const;

const BREADCRUMB_LABELS: Record<Locale, Record<string, string>> = {
  en: {
    about: "About",
    projects: "Projects",
    stories: "Stories",
    "get-involved": "Get Involved",
    contact: "Contact",
    resources: "Resources",
    partners: "Partners",
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
    partners: "Partenaires",
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
