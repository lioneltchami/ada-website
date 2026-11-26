import { isWithheldGalleryAsset } from "./gallery-media-clearance";
import { isArchiveOutreachCategory, type ArchiveOutreachCategory } from "./archive-outreach-categories";
import { applyReviewed2024And2025Summaries, listReleased2024ProjectDocuments, listReleased2025ProjectDocuments } from './reviewed-project-summaries-2024-25';
import { applyReviewed2026Summaries, listReleased2026ProjectDocuments } from "./reviewed-project-summaries-2026";
import { applyReviewedProjectContent, listReleased2023ProjectDocuments } from './reviewed-project-records';
import { applyReleasedProjectContent, applyReleasedDocumentLibrary } from "./released-project-documents";
import { createClient } from "@sanity/client";
import {
  annualReportPdfs,
  documentArchiveProjects,
  hasStaticProjectDocuments,
  projectDocumentPaths,
} from "../data/organization";
import { christmasAnnouncements } from "./christmas-announcements";
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
  outreachCategory?: ArchiveOutreachCategory;
  /** Category inherited from a linked current project, when present. */
  sourceOutreachCategory?: ArchiveOutreachCategory;
  year: number;
  status: "completed" | "ongoing" | "planned";
  description?: string;
  descriptionFr?: string;
  beneficiaries?: number;
  beneficiariesApproximate?: boolean;
  budget?: number;
  /** Reviewed local-currency plan only. Never include in USD/spend calculations. */
  approvedBudgetFcfa?: number;
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
  documentReviewNote?: string;
  documentReviewNoteFr?: string;
  financialReviewTitle?: string;
  financialReviewTitleFr?: string;
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
    slug: "christmas-giving-dec-2024",
    title: "Christmas Giving 2024",
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
  return rows.filter((r) => r.slug && r.year && r.demographic && !isWithdrawnProjectRecord(r));
}

export function groupProjectsByYear(
  records: ProjectArchiveDocument[],
): YearDocumentGroup[] {
  const released = [...listReleased2023ProjectDocuments(), ...listReleased2024ProjectDocuments(), ...listReleased2025ProjectDocuments(), ...listReleased2026ProjectDocuments()];
  const releasedSlugs = new Set(released.map((p) => p.slug));
  const filtered = applyReleasedDocumentLibrary([...records.filter((r) => !releasedSlugs.has(r.slug)), ...released]
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
  entries: readonly Pick<ProjectArchiveEntry, "financialReviewNote" | "financialReviewTitle">[],
): number {
  return entries.filter((entry) => Boolean(entry.financialReviewNote) && !entry.financialReviewTitle).length;
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
    project.startDate ||
    project.endDate ||
    project.archiveAfterDate ||
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
    outreachCategory: project.outreachCategory,
    year: deriveArchiveYear(project),
    status: "completed",
    description: project.description,
    descriptionFr: project.descriptionFr || project.description,
    beneficiaries: project.announcementOnly ? undefined : project.beneficiaries,
    budget: project.announcementOnly ? undefined : project.goalAmount,
    location: project.location,
    startDate: project.startDate,
    endDate: project.endDate,
    photo: isWithheldGalleryAsset(project.mainImage?.asset?._ref) ? null : project.mainImage || null,
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
        outreachCategory,
        "sourceOutreachCategory": sourceProject->outreachCategory,
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

  if (!records.length) {
    records = FALLBACK_RECORDS.map(toFallbackArchiveEntry);
  }

  try {
    const cmsProjects = await getProjects().catch((error) => {
      console.error("[project-archive] Source projects unavailable:", error);
      return [] as SanityProject[];
    });
    const cmsSlugs = new Set(cmsProjects.map((project) => project.slug.current));
    const currentProjects = [
      ...cmsProjects,
      ...christmasAnnouncements.filter((project) => !cmsSlugs.has(project.slug.current)),
    ];
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
    const byArchiveSlug = new Map(currentProjects.flatMap((project) =>
      project.archiveRecord?.slug?.current ? [[project.archiveRecord.slug.current, project] as const] : [],
    ));
    const seen = new Set(records.map((record) => record.slug.current));
    records = [
      ...records,
      ...autoArchived.filter((record) => !seen.has(record.slug.current)),
    ]
      .map((record) => {
        const slug = record.slug.current;
        const project = bySlug.get(slug);
        const linkedCategory = byArchiveSlug.get(slug)?.outreachCategory ?? project?.outreachCategory;
        const inheritedCategory = isArchiveOutreachCategory(record.sourceOutreachCategory)
          ? record.sourceOutreachCategory : linkedCategory;
        if (!isArchiveOutreachCategory(record.outreachCategory) && isArchiveOutreachCategory(inheritedCategory)) {
          record = { ...record, outreachCategory: inheritedCategory };
        }
        if (record.photo?.asset?._ref) return record;
        if (project?.mainImage?.asset?._ref) {
          return { ...record, photo: project.mainImage };
        }
        return record;
      });
  } catch (e) {
    console.error("[project-archive] Auto archive fallback failed:", e);
  }


  // A directly linked record can inherit a valid category even if the current
  // project list was unavailable during this build.
  records = records.map((record) =>
    !isArchiveOutreachCategory(record.outreachCategory) && isArchiveOutreachCategory(record.sourceOutreachCategory)
      ? { ...record, outreachCategory: record.sourceOutreachCategory }
      : record,
  );

  const reviewed = applyReviewed2026Summaries(applyReviewed2024And2025Summaries(applyReviewedProjectContent(applyReleasedProjectContent(records
    .filter((record) => !isWithdrawnProject(record.slug.current) && !isWithdrawnProjectRecord(record))
    .map(applyOwnerFinancialReview)))))
    .map(withCanonicalProjectDocuments)
    .map((entry) => ({
      ...entry,
      photo: isWithheldGalleryAsset(entry.photo?.asset?._ref) ? undefined : entry.photo,
      photos: entry.photos?.filter((photo) => !isWithheldGalleryAsset(photo.asset?._ref)),
    }));
  return sortArchiveEntriesChronologically(reviewed);
}

type ArchiveChronologyEntry = Pick<ProjectArchiveEntry, "slug" | "year" | "startDate" | "endDate">;

// Sources establish these periods without confirming a day: the 2021 archive
// account, the released Baking report, and the reviewed 2024–25 project summaries.
// A receipt or
// preparation with a recorded date does not establish the event's month.
const reportedArchiveMonths = new Map<string, string>([
  ["first-widow-home-visits-2021", "2021-11"],
  ["idp-girls-baking-training-jul-2022", "2022-07"],
  ["girls-programme-2024", "2024-10"],
  ["womens-day-widows-outreach-2025", "2025-03"],
  ["christmas-orphanage-outreach-2025", "2025-12"],
]);

function chronologyDate(value?: string): { month: string; day?: string } | undefined {
  if (!value) return undefined;
  const match = /^(\d{4}-(?:0[1-9]|1[0-2]))(?:-(0[1-9]|[12]\d|3[01]))?$/.exec(value);
  if (!match) return undefined;
  const [, month, day] = match;
  if (day) {
    const date = new Date(value + "T00:00:00Z");
    if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value) return undefined;
  }
  return { month, day };
}

function archiveChronologyDate(record: ArchiveChronologyEntry) {
  return chronologyDate(record.startDate)
    ?? chronologyDate(record.endDate)
    ?? chronologyDate(reportedArchiveMonths.get(record.slug.current));
}

/** Localized month of the effective date, without implying an unrecorded day. */
export function formatArchiveCardMonth(record: ArchiveChronologyEntry, locale: "en" | "fr"): string | undefined {
  const date = archiveChronologyDate(record);
  if (!date) return undefined;
  return new Intl.DateTimeFormat(locale, { month: "long", timeZone: "UTC" })
    .format(new Date(date.month + "-01T00:00:00Z"));
}

/** Newest year and activities first. Month-only entries precede dated entries
 * within their known months, without implying a day. Fully undated records
 * follow known periods; the slug is a locale-independent tie breaker.
 */
export function sortArchiveEntriesChronologically<T extends ArchiveChronologyEntry>(records: readonly T[]): T[] {
  return records
    .map((record) => ({ record, date: archiveChronologyDate(record) }))
    .sort(({ record: a, date: aDate }, { record: b, date: bDate }) => {
      if (a.year !== b.year) return b.year - a.year;
      if (aDate && bDate) {
        const byMonth = bDate.month.localeCompare(aDate.month);
        if (byMonth) return byMonth;
        if (aDate.day !== bDate.day) {
          if (!aDate.day) return -1;
          if (!bDate.day) return 1;
          return bDate.day.localeCompare(aDate.day);
        }
      } else if (Boolean(aDate) !== Boolean(bDate)) {
        return aDate ? -1 : 1;
      }
      return a.slug.current.localeCompare(b.slug.current, "en");
    })
    .map(({ record }) => record);
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
