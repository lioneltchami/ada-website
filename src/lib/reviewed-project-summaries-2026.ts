import releases from "../../config/project-document-releases-2026.json";
import review from "../../config/project-records-2026.json";
import type { ArchiveOutreachCategory } from "./archive-outreach-categories";
import type { ProjectArchiveDocument, ProjectArchiveEntry, ProjectDemographic } from "./project-archive";

type ReviewedProject = (typeof review.projects)[number];
const bySlug = new Map(review.projects.map((project) => [project.slug, project]));
const hashes = releases as Readonly<Record<string, { tor: string; report: string } | undefined>>;

/** Metadata and both independently verified release files must agree. */
export function reviewed2026Release(slug: string): ReviewedProject | undefined {
  const files = hashes[slug];
  const isHash = (value?: string) => typeof value === "string" && /^[a-f0-9]{64}$/.test(value);
  return isHash(files?.tor) && isHash(files?.report) ? bySlug.get(slug) : undefined;
}

export function listReleased2026ProjectDocuments(): ProjectArchiveDocument[] {
  return review.projects.filter(({ slug }) => reviewed2026Release(slug)).map((project) => ({
    slug: project.slug,
    title: project.title,
    titleFr: project.titleFr,
    year: 2026,
    demographic: project.demographic as ProjectDemographic,
  }));
}

/** Replace legacy campaign data: flyers, goals, planned attendance and dates were not outcomes. */
export function applyReviewed2026Summaries(entries: ProjectArchiveEntry[]): ProjectArchiveEntry[] {
  const records = new Map(entries.map((entry) => [entry.slug.current, entry]));
  for (const project of review.projects) {
    if (!reviewed2026Release(project.slug)) continue;
    records.set(project.slug, {
      slug: { current: project.slug },
      status: "completed",
      year: 2026,
      title: project.title,
      titleFr: project.titleFr,
      demographic: project.demographic as ProjectDemographic,
      outreachCategory: project.outreachCategory as ArchiveOutreachCategory,
      startDate: project.date,
      endDate: project.date,
      location: project.location,
      locationFr: project.locationFr,
      description: project.description,
      descriptionFr: project.descriptionFr,
      beneficiaries: project.beneficiaries,
      beneficiariesApproximate: project.beneficiariesApproximate,
      financialReviewTitle: project.financialNoteTitle,
      financialReviewTitleFr: project.financialNoteTitleFr,
      financialReviewNote: project.financialNote,
      financialReviewNoteFr: project.financialNoteFr,
    });
  }
  return [...records.values()];
}
