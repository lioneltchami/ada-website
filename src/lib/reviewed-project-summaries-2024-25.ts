import { isWithdrawnProjectRecord, isWithdrawnProjectSlug } from "./withdrawn-project-content";
import { isArchiveOutreachCategory } from "./archive-outreach-categories";
import review from '../../config/project-records-2024-25.json';
import type { ProjectArchiveDocument, ProjectArchiveEntry, ProjectDemographic } from './project-archive';

type ReviewedProject = (typeof review.projects)[number];
type ReleasedProject = Extract<ReviewedProject, { documentStatus: string }>;

type ReleaseYear = 2024 | 2025;

function isReleasedProject(project: ReviewedProject, year: ReleaseYear): project is ReleasedProject {
  return project.year === year && project.documentStatus === 'released' && !isWithdrawnProjectSlug(project.slug);
}

function hasReleasedProjectDocuments(slug: string, year: ReleaseYear): boolean {
  return review.projects.some(project => project.slug === slug && isReleasedProject(project, year));
}

export function hasReleased2024ProjectDocumentSet(slug: string): boolean {
  return hasReleasedProjectDocuments(slug, 2024);
}

export function hasReleased2025ProjectDocumentSet(slug: string): boolean {
  return hasReleasedProjectDocuments(slug, 2025);
}

function listReleasedProjectDocuments(year: ReleaseYear): ProjectArchiveDocument[] {
  return review.projects.filter(project => isReleasedProject(project, year)).map(project => ({
    slug: project.slug,
    year: project.year,
    demographic: project.demographic as ProjectDemographic,
    title: project.title,
    titleFr: project.titleFr,
  }));
}

export function listReleased2024ProjectDocuments(): ProjectArchiveDocument[] {
  return listReleasedProjectDocuments(2024);
}

export function listReleased2025ProjectDocuments(): ProjectArchiveDocument[] {
  return listReleasedProjectDocuments(2025);
}

/** Replace the record completely so figures, outcome claims, file links and photos cannot leak in from older CMS entries. */
export function applyReviewed2024And2025Summaries(entries: ProjectArchiveEntry[]): ProjectArchiveEntry[] {
  const superseded = new Set(Object.keys(review.redirects));
  const bySlug = new Map(entries.filter(entry => !superseded.has(entry.slug.current) && !isWithdrawnProjectRecord(entry)).map(entry => [entry.slug.current, entry]));
  for (const project of review.projects) {
    if (isWithdrawnProjectSlug(project.slug)) continue;
    const released = isReleasedProject(project, 2024) || isReleasedProject(project, 2025);
    const selectedCategory = bySlug.get(project.slug)?.outreachCategory;
    bySlug.set(project.slug, {
      ...(isArchiveOutreachCategory(selectedCategory) ? { outreachCategory: selectedCategory } : {}),
      slug: { current: project.slug },
      year: project.year,
      demographic: project.demographic as ProjectDemographic,
      status: 'completed',
      title: project.title,
      titleFr: project.titleFr,
      description: project.description,
      descriptionFr: project.descriptionFr,
      location: project.location,
      startDate: project.date,
      endDate: project.date,
      // Do not put 2025 worksheets, working-list amounts or approximate
      // budgets through the 2024 published-budget amount and roll-up.
      approvedBudgetFcfa: isReleasedProject(project, 2024) && 'approvedBudgetFcfa' in project
        ? project.approvedBudgetFcfa
        : undefined,
      financialReviewTitle: released ? project.financialNoteTitle : undefined,
      financialReviewTitleFr: released ? project.financialNoteTitleFr : undefined,
      financialReviewNote: released ? project.financialNote : 'No financial figures are published for this project while the records are reviewed.',
      financialReviewNoteFr: released ? project.financialNoteFr : 'Aucun chiffre financier n’est publié pour ce projet pendant la vérification des documents.',
      hasToR: false,
      hasReport: false,
    });
  }
  return [...bySlug.values()];
}

/** Withhold the contradicted attribution without guessing the year of the image. */
export function isSupersededBamendaSchoolPhoto(image: { projectSlug?: string; title?: string; reportUrl?: string }): boolean {
  return image.projectSlug === 'back-to-school-bamenda-sep-2024'
    || image.title?.trim().toLowerCase() === 'back to school project bamenda 2024'
    || Boolean(image.reportUrl?.includes('/back-to-school-bamenda-sep-2024/'));
}
