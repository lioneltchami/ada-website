import { applyReleasedProjectContent, applyReleasedDocumentLibrary } from "./released-project-documents";
import { createClient } from "@sanity/client";
import {
  annualReportPdfs,
  documentArchiveProjects,
  hasStaticProjectDocuments,
  projectDocumentPaths,
} from "../data/organization";
import { getProjectLifecycleState } from "./project-lifecycle";
import { getProjects, type SanityProject } from "./sanity";
import { isWithdrawnProjectRecord, isWithdrawnProjectSlug } from "./withdrawn-project-content";

export type ProjectDemographic =
  | "widows"
  | "orphans"
  | "young-women"
  | "pregnant-women"
  | "idps"
  | "community";

export interface ProjectArchiveDocument {
  slug: string;
  title: string;
  titleFr?: string;
  year: number;
  demographic: ProjectDemographic;
}

export interface YearDocumentGroup {
  year: number;
  annualReportPath?: string;
  demographics: {
    demographic: ProjectDemographic;
    projects: ProjectArchiveDocument[];
  }[];
  projectCount: number;
}

export interface ProjectArchiveEntry {
  slug: { current: string };
  title: string;
  titleFr?: string;
  demographic: ProjectDemographic;
  year: number;
  status: "completed" | "ongoing" | "planned";
  description?: string;
  descriptionFr?: string;
  beneficiaries?: number;
  budget?: number;
  location?: string;
  locationFr?: string;
  startDate?: string;
  endDate?: string;
  outcomes?: string[];
  outcomesFr?: string[];
  photo?: {
    asset?: { _ref?: string } | null;
    alt?: string;
    altFr?: string;
  } | null;
  photos?: {
    asset?: { _ref?: string } | null;
    caption?: string;
    captionFr?: string;
  }[];
  torUrl?: string;
  reportUrl?: string;
  financialReportUrl?: string;
  financialReviewNote?: string;
  financialReviewNoteFr?: string;
  hasToR?: boolean;
  hasReport?: boolean;
  href?: string;
  autoArchived?: boolean;
}

const OWNER_RECALLED_FINANCE_NOTES: Record<string, { en: string; fr: string }> = {
  "idp-girls-baking-training-jul-2022": {
    en: "The previous July baking project documents and financial schedule have been withdrawn. The revised record is under review.",
    fr: "Les précédents documents du projet de pâtisserie de juillet et son état financier ont été retirés. Le compte rendu révisé est en cours de vérification.",
  },
  "back-to-school-sep-2022": {
    en: "The previous financial schedule has been withdrawn. The revised project account and financial breakdown are under review.",
    fr: "Le précédent état financier a été retiré. Le compte rendu révisé du projet et la ventilation financière sont en cours de vérification.",
  },
  "first-widow-home-visits-2021": {
    en: "Owner-recalled figures, not independently reconciled: 120,000 CFA francs was sent; about 110,000 CFA francs was spent, including approximately 10,000 CFA francs in withdrawal costs. The approximately 10,000 CFA difference is arithmetic only, not a verified balance. The sent amount is approximately US$209 using the November 2021 monthly average exchange rate.",
    fr: "Chiffres rappelés par le responsable, sans rapprochement indépendant : 120 000 francs CFA ont été envoyés ; environ 110 000 francs CFA auraient été dépensés, y compris environ 10 000 francs CFA de frais de retrait. La différence d’environ 10 000 francs CFA est uniquement arithmétique et ne constitue pas un solde vérifié. Le montant envoyé équivaut à environ 209 $ US selon la moyenne mensuelle de novembre 2021.",
  },
  "school-supply-distribution-feb-2022": {
    en: "Financial figures are under review. The owner recalls that 215,000 CFA francs was sent, about 5,000 CFA francs was used for withdrawal costs, and transportation was about 10,000–15,000 CFA francs, leaving an estimated 195,000–200,000 CFA francs for supplies. These figures have not been independently reconciled, and no actual expenditure or cash balance is verified. The downloadable financial document contains an illustrative category allocation for review only; it is not a record of historical item costs. The owner-confirmed supply categories were buckets, utensils, school bags, exercise books, pens, and mathematical sets.",
    fr: "Les chiffres financiers sont en cours de vérification. Le responsable se souvient que 215 000 francs CFA ont été envoyés, qu’environ 5 000 francs CFA ont servi aux frais de retrait et que le transport a coûté environ 10 000 à 15 000 francs CFA, ce qui laisse une estimation de 195 000 à 200 000 francs CFA pour les fournitures. Ces chiffres n’ont pas été rapprochés de manière indépendante; aucune dépense réelle ni aucun solde de trésorerie n’est vérifié. Le document financier téléchargeable contient une répartition illustrative par catégorie, à examiner uniquement; elle ne constitue pas un relevé des coûts historiques. Les catégories de fournitures confirmées par le responsable sont les seaux, les ustensiles, les cartables, les cahiers d’exercices, les stylos et les ensembles géométriques.",
  },
  "widow-support-food-cash-mar-2022": {
    en: "Financial figures are under review. The owner recalls about 220,000 CFA francs sent, about 5,000 CFA francs in withdrawal costs, and about 10,000 CFA francs for transportation, leaving an estimated 205,000 CFA francs for supplies. These approximate figures have not been independently reconciled. The recalled supply categories were buckets, African fabric wrappers, soap, oil, foodstuffs, and bags. No item quantities, category costs, cash assistance, or remaining balance are verified.",
    fr: "Les chiffres financiers sont en cours de vérification. Le responsable se souvient qu’environ 220 000 francs CFA ont été envoyés, qu’environ 5 000 francs CFA ont servi aux frais de retrait et qu’environ 10 000 francs CFA ont été utilisés pour le transport, ce qui laisse une estimation de 205 000 francs CFA pour les fournitures. Ces montants approximatifs n’ont pas été rapprochés de manière indépendante. Les catégories de fournitures rappelées sont les seaux, les pagnes africains, le savon, l’huile, les denrées alimentaires et les sacs. Aucune quantité, aucun coût par catégorie, aucune aide financière en espèces ni aucun solde restant n’est vérifié.",
  },
};

const OWNER_REVIEW_ARCHIVE_CONTENT: Record<
  string,
  Partial<Pick<ProjectArchiveEntry, "title" | "titleFr" | "description" | "descriptionFr" | "beneficiaries" | "location" | "startDate" | "endDate" | "outcomes" | "outcomesFr">>
> = {
  "idp-girls-baking-training-jul-2022": {
    title: "July 2022 Baking Workshop",
    titleFr: "Atelier de pâtisserie de juillet 2022",
    description: "The previous July baking project documents have been withdrawn while a revised account is reviewed.",
    descriptionFr: "Les précédents documents du projet de pâtisserie de juillet ont été retirés pendant la vérification du compte rendu révisé.",
    beneficiaries: undefined,
    startDate: undefined,
    endDate: undefined,
    outcomes: [],
    outcomesFr: [],
  },
  "back-to-school-sep-2022": {
    title: "Back-to-School 2022",
    titleFr: "Rentrée scolaire 2022",
    description: "A back-to-school activity in Buea. The previous project documents have been withdrawn while a revised account is reviewed.",
    descriptionFr: "Une activité de rentrée scolaire à Buea. Les précédents documents du projet ont été retirés pendant la vérification d’un compte rendu révisé.",
    beneficiaries: undefined,
    outcomes: [],
    outcomesFr: [],
  },
  "first-widow-home-visits-2021": {
    title: "First Widow Home Visits",
    titleFr: "Premières visites à domicile auprès des veuves",
    description: "ADA's first community outreach was a series of home visits in November 2021. The owner recalls that 120,000 CFA francs was sent for the project; the financial figures are under review.",
    descriptionFr: "La première action communautaire d'ADA a pris la forme de visites à domicile en novembre 2021. Le responsable se souvient que 120 000 francs CFA ont été envoyés pour le projet; les chiffres financiers sont en cours de vérification.",
    beneficiaries: undefined,
    outcomes: [],
    outcomesFr: [],
  },
  "school-supply-distribution-feb-2022": {
    title: "School Supply Distribution",
    titleFr: "Distribution de fournitures scolaires",
    description: "The school-supply visit took place on February 16, 2022. The recalled categories were buckets, utensils, school bags, exercise books, pens, and mathematical sets. Quantities, individual allocations, and financial figures remain under review.",
    descriptionFr: "La visite de distribution de fournitures scolaires a eu lieu le 16 février 2022. Les catégories rappelées sont les seaux, les ustensiles, les cartables, les cahiers d'exercices, les stylos et les ensembles géométriques. Les quantités, les répartitions individuelles et les chiffres financiers sont en cours de vérification.",
    startDate: "2022-02-16",
    endDate: "2022-02-16",
    beneficiaries: undefined,
    outcomes: [],
    outcomesFr: [],
  },
  "widow-support-food-cash-mar-2022": {
    title: "Women's Day Widow Outreach",
    titleFr: "Action de soutien aux veuves pour la Journée des femmes",
    description: "A Women's Day widow outreach identified by the owner as taking place in March 2022. The owner-recalled supply categories were buckets, African fabric wrappers, soap, oil, foodstuffs, and bags.",
    descriptionFr: "Une action de soutien aux veuves à l'occasion de la Journée des femmes, située par le responsable en mars 2022. Les catégories de fournitures rappelées sont les seaux, les pagnes africains, le savon, l'huile, les denrées alimentaires et les sacs.",
    beneficiaries: undefined,
    location: undefined,
    startDate: undefined,
    endDate: undefined,
    outcomes: [],
    outcomesFr: [],
  },
};

/** Remove stale USD budget fields for records whose finance basis is being reconciled. */
export function applyOwnerFinancialReview(entry: ProjectArchiveEntry): ProjectArchiveEntry {
  const slug = entry.slug.current;
  const note = OWNER_RECALLED_FINANCE_NOTES[slug];
  if (!note) return entry;
  const archiveContent = OWNER_REVIEW_ARCHIVE_CONTENT[slug];
  const isMarchWidowOutreach = slug === "widow-support-food-cash-mar-2022";
  const reviewedPhoto = isMarchWidowOutreach && entry.photo
    ? {
        ...entry.photo,
        alt: "Project photograph; event details are not verified.",
        altFr: "Photographie de projet; les détails de l'événement ne sont pas vérifiés.",
      }
    : entry.photo;
  const reviewedPhotos = isMarchWidowOutreach && entry.photos
    ? entry.photos.map((photo) => ({
        ...photo,
        caption: "Project photograph; event date and activity are not verified.",
        captionFr: "Photographie de projet; la date et l'activité ne sont pas vérifiées.",
      }))
    : entry.photos;
  return {
    ...entry,
    ...archiveContent,
    photo: slug === "idp-girls-baking-training-jul-2022" ? undefined : reviewedPhoto,
    photos: slug === "idp-girls-baking-training-jul-2022" ? [] : reviewedPhotos,
    budget: undefined,
    financialReviewNote: note.en,
    financialReviewNoteFr: note.fr,
  };
}

export function countOwnerMarkedCompletions(
  entries: readonly Pick<ProjectArchiveEntry, "status" | "autoArchived">[],
): number {
  return entries.filter(
    (entry) => entry.status === "completed" && !entry.autoArchived,
  ).length;
}

const DEMOGRAPHIC_ORDER: ProjectDemographic[] = [
  "widows",
  "orphans",
  "young-women",
  "pregnant-women",
  "idps",
  "community",
];

const SLUG_SET = new Set<string>(documentArchiveProjects);
export function isWithdrawnProject(slug: string): boolean {
	return isWithdrawnProjectSlug(slug);
}

/** Fallback when Sanity is unavailable at build time */
const FALLBACK_RECORDS: ProjectArchiveDocument[] = [
  {
    slug: "youth-mentorship-seminar-oct-2025",
    title: "Youth Mentorship Seminar",
    year: 2025,
    demographic: "orphans",
  },
  {
    slug: "campus-cleanup-aug-2025",
    title: "Campus Environmental Cleanup",
    year: 2025,
    demographic: "community",
  },
  {
    slug: "hospital-prenatal-care-jul-2025",
    title: "Hospital Visit — Prenatal Care Kits",
    year: 2025,
    demographic: "pregnant-women",
  },
  {
    slug: "city-cleanup-may-2025",
    title: "City Cleanup — Labour Day 2025",
    year: 2025,
    demographic: "community",
  },
  {
    slug: "idp-children-education-fund",
    title: "IDP Children Education Fund",
    year: 2025,
    demographic: "idps",
  },
  {
    slug: "prenatal-care-support-program",
    title: "Prenatal Care Support Program",
    year: 2025,
    demographic: "pregnant-women",
  },
  {
    slug: "christmas-giving-dec-2024",
    title: "Christmas Giving 2024",
    year: 2024,
    demographic: "orphans",
  },
  {
    slug: "back-to-school-sep-2024",
    title: "Back-to-School 2024",
    year: 2024,
    demographic: "orphans",
  },
  {
    slug: "emergency-food-relief-bamenda-crisis",
    title: "Emergency Food Relief - Bamenda Crisis",
    year: 2024,
    demographic: "idps",
  },
  {
    slug: "back-to-school-bamenda-sep-2024",
    title: "Back-to-School Bamenda 2024",
    year: 2024,
    demographic: "orphans",
  },
  {
    slug: "city-cleanup-may-2023",
    title: "City Cleanup — Labour Day",
    year: 2023,
    demographic: "community",
  },
  {
    slug: "womens-day-home-visits-mar-2023",
    title: "Women's Day Home Visits",
    year: 2023,
    demographic: "widows",
  },
  {
    slug: "back-to-school-drive-2023",
    title: "Back-to-School Drive 2023",
    year: 2023,
    demographic: "orphans",
  },
  {
    slug: "back-to-school-sep-2022",
    title: "Back-to-School 2022",
    year: 2022,
    demographic: "orphans",
  },
  {
    slug: "idp-girls-baking-training-jul-2022",
    title: "IDP Girls Baking Training & Startup Kits",
    year: 2022,
    demographic: "idps",
  },
  {
    slug: "widow-support-food-cash-mar-2022",
    title: "Widow Support — Food & Financial Aid",
    year: 2022,
    demographic: "widows",
  },
  {
    slug: "school-supply-distribution-feb-2022",
    title: "School Supply Distribution",
    year: 2022,
    demographic: "orphans",
  },
  {
    slug: "christmas-giving-dec-2022",
    title: "Christmas Giving 2022",
    year: 2022,
    demographic: "widows",
  },
  {
    slug: "first-widow-home-visits-2021",
    title: "First Widow Home Visits",
    year: 2021,
    demographic: "widows",
  },
];

async function fetchProjectRecords(): Promise<ProjectArchiveDocument[]> {
  const projectId = import.meta.env.SANITY_PROJECT_ID || "rj2m21gk";
  const dataset = import.meta.env.SANITY_DATASET || "production";
  const token =
    import.meta.env.SANITY_TOKEN || import.meta.env.SANITY_API_TOKEN;
  const client = createClient({
    projectId,
    dataset,
    apiVersion: "2026-03-28",
    token,
    useCdn: !token,
  });
  const rows = await client.fetch<
    {
      slug: string;
      title: string;
      titleFr?: string;
      year: number;
      demographic: ProjectDemographic;
    }[]
  >(
    `*[_type == "projectRecord"] {
      "slug": slug.current,
      title,
      titleFr,
      year,
      demographic
    } | order(year desc, title asc)`,
  );
  return rows.filter((r) => r.slug && r.year && r.demographic);
}

export function groupProjectsByYear(
  records: ProjectArchiveDocument[],
): YearDocumentGroup[] {
  const filtered = applyReleasedDocumentLibrary(records
    .filter((r) => hasStaticProjectDocuments(r.slug))
    .map(applyOwnerFinancialReviewToDocument));
  const byYear = new Map<
    number,
    Map<ProjectDemographic, ProjectArchiveDocument[]>
  >();

  for (const record of filtered) {
    if (!byYear.has(record.year)) byYear.set(record.year, new Map());
    const byDemo = byYear.get(record.year)!;
    if (!byDemo.has(record.demographic)) byDemo.set(record.demographic, []);
    byDemo.get(record.demographic)!.push(record);
  }

  return [...byYear.entries()]
    .sort(([a], [b]) => b - a)
    .map(([year, byDemo]) => {
      const demographics = DEMOGRAPHIC_ORDER.filter((d) => byDemo.has(d)).map(
        (demographic) => ({
          demographic,
          projects: byDemo.get(demographic)!,
        }),
      );
      const projectCount = demographics.reduce(
        (n, d) => n + d.projects.length,
        0,
      );
      const annualReportPath = annualReportPdfs.find(
        (r) => r.year === String(year),
      )?.path;
      return { year, demographics, projectCount, annualReportPath };
    });
}

/** Count archive entries whose displayed budget details are held for review. */
export function countProjectsUnderFinancialReview(
  entries: readonly Pick<ProjectArchiveEntry, "financialReviewNote">[],
): number {
  return entries.filter((entry) => Boolean(entry.financialReviewNote)).length;
}

function applyOwnerFinancialReviewToDocument(
  record: ProjectArchiveDocument,
): ProjectArchiveDocument {
  const override = OWNER_REVIEW_ARCHIVE_CONTENT[record.slug];
  if (!override) return record;
  return {
    ...record,
    title: override.title || record.title,
    titleFr: override.titleFr || record.titleFr,
  };
}

export async function loadProjectDocumentLibrary(): Promise<{
  yearGroups: YearDocumentGroup[];
  totalProjects: number;
}> {
  let records: ProjectArchiveDocument[] = [];
  try {
    records = await fetchProjectRecords();
  } catch (e) {
    console.error("[project-archive] Sanity fetch failed, using fallback:", e);
  }
  if (!records.length) records = FALLBACK_RECORDS;
  const yearGroups = groupProjectsByYear(records);
  const totalProjects = yearGroups.reduce((n, y) => n + y.projectCount, 0);
  return { yearGroups, totalProjects };
}

function deriveArchiveYear(project: SanityProject): number {
  const sourceDate =
    project.archiveAfterDate ||
    project.endDate ||
    project.startDate ||
    new Date().toISOString();
  return Number(sourceDate.slice(0, 4));
}

export function toAutoArchiveEntry(
  project: SanityProject,
  lifecycle = getProjectLifecycleState(project),
): ProjectArchiveEntry {
  return {
    slug: { current: project.slug.current },
    title: project.title,
    titleFr: project.titleFr || project.title,
    demographic: project.demographic || "community",
    year: deriveArchiveYear(project),
    status: "completed",
    description: project.description,
    descriptionFr: project.descriptionFr || project.description,
    beneficiaries: project.beneficiaries,
    budget: project.goalAmount,
    location: project.location,
    startDate: project.startDate,
    endDate: project.endDate,
    photo: project.mainImage || null,
    autoArchived: lifecycle.isAutoCompleted,
  };
}

export function toFallbackArchiveEntry(
  record: ProjectArchiveDocument,
): ProjectArchiveEntry {
  return {
    slug: { current: record.slug },
    title: record.title,
    titleFr: record.titleFr || record.title,
    demographic: record.demographic,
    year: record.year,
    status: "completed",
    description: record.title,
    descriptionFr: record.titleFr || record.title,
    autoArchived: false,
  };
}

/** Prefer public/docs PDFs over Sanity CDN when the slug has static files. */
function withCanonicalProjectDocuments(
  entry: ProjectArchiveEntry,
): ProjectArchiveEntry {
  const slug = entry.slug.current;
  if (!hasStaticProjectDocuments(slug)) return entry;
  const paths = projectDocumentPaths(slug);
  return {
    ...entry,
    torUrl: paths.tor,
    financialReportUrl: paths.financial,
    reportUrl: paths.report,
    hasToR: true,
    hasReport: true,
  };
}

export async function loadProjectArchiveEntries(): Promise<
  ProjectArchiveEntry[]
> {
  let records: ProjectArchiveEntry[] = [];
  try {
    const projectId = import.meta.env.SANITY_PROJECT_ID || "rj2m21gk";
    const dataset = import.meta.env.SANITY_DATASET || "production";
    const token =
      import.meta.env.SANITY_TOKEN || import.meta.env.SANITY_API_TOKEN;
    const client = createClient({
      projectId,
      dataset,
      apiVersion: "2026-03-28",
      token,
      useCdn: !token,
    });
    records = await client.fetch<ProjectArchiveEntry[]>(
      `*[_type == "projectRecord"] | order(year desc, title asc) {
        _id,
        title,
        titleFr,
        slug,
        demographic,
        year,
        status,
        description,
        descriptionFr,
        beneficiaries,
        budget,
        location,
        startDate,
        endDate,
        outcomes,
        outcomesFr,
        photo { asset { _ref }, alt, altFr },
        photos[] { asset { _ref }, caption, captionFr },
        "hasToR": defined(termsOfReference),
        "hasReport": defined(finalReport),
        "torUrl": termsOfReference.asset->url,
        "reportUrl": finalReport.asset->url,
        "financialReportUrl": financialReport.asset->url
      }`,
    );
  } catch (e) {
    console.error("[project-archive] Project record fetch failed:", e);
  }

  try {
    const currentProjects = await getProjects();
    const bySlug = new Map(
      currentProjects.map((project) => [project.slug.current, project]),
    );
    const autoArchived = currentProjects
      .map((project) => ({
        project,
        lifecycle: getProjectLifecycleState(project),
      }))
      .filter(({ lifecycle }) => lifecycle.status === "completed")
      .map(({ project, lifecycle }) => toAutoArchiveEntry(project, lifecycle));
    const seen = new Set(records.map((record) => record.slug.current));
    records = [
      ...records,
      ...autoArchived.filter((record) => !seen.has(record.slug.current)),
    ]
      .map((record) => {
        if (record.photo?.asset?._ref) return record;
        const project = bySlug.get(record.slug.current);
        if (project?.mainImage?.asset?._ref) {
          return { ...record, photo: project.mainImage };
        }
        return record;
      })
      .sort((a, b) => {
        if (b.year !== a.year) return b.year - a.year;
        return String(a.title).localeCompare(String(b.title));
      });
  } catch (e) {
    console.error("[project-archive] Auto archive fallback failed:", e);
  }

  if (!records.length) {
    records = FALLBACK_RECORDS.map(toFallbackArchiveEntry);
  }

  return applyReleasedProjectContent(records
    .filter((record) => !isWithdrawnProject(record.slug.current) && !isWithdrawnProjectRecord(record))
    .map(applyOwnerFinancialReview))
    .map(withCanonicalProjectDocuments);
}

export function demographicLabel(
  demographic: ProjectDemographic,
  labels: Record<ProjectDemographic, string>,
): string {
  return labels[demographic] ?? demographic;
}

export function projectDisplayTitle(
  project: ProjectArchiveDocument,
  locale: "en" | "fr",
): string {
  if (locale === "fr" && project.titleFr) return project.titleFr;
  return project.title;
}
