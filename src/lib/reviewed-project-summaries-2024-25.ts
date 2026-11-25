import review from '../../config/project-records-2024-25.json';
import type { ProjectArchiveDocument, ProjectArchiveEntry, ProjectDemographic } from './project-archive';

type ReviewedProject = (typeof review.projects)[number];
type ReleasedProject = Extract<ReviewedProject, { documentStatus: string }>;

function isReleased2024Project(project: ReviewedProject): project is ReleasedProject {
  return project.year === 2024 && project.documentStatus === 'released';
}

export function hasReleased2024ProjectDocumentSet(slug: string): boolean {
  return review.projects.some(project => project.slug === slug && isReleased2024Project(project));
}

export function listReleased2024ProjectDocuments(): ProjectArchiveDocument[] {
  return review.projects.filter(isReleased2024Project).map(project => ({
    slug: project.slug,
    year: project.year,
    demographic: project.demographic as ProjectDemographic,
    title: project.title,
    titleFr: project.titleFr,
  }));
}

/** Replace the record completely so figures, outcome claims, file links and photos cannot leak in from older CMS entries. */
export function applyReviewed2024And2025Summaries(entries: ProjectArchiveEntry[]): ProjectArchiveEntry[] {
  const superseded = new Set(Object.keys(review.redirects));
  const bySlug = new Map(entries.filter(entry => !superseded.has(entry.slug.current)).map(entry => [entry.slug.current, entry]));
  for (const project of review.projects) {
    const released = isReleased2024Project(project);
    bySlug.set(project.slug, {
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
      approvedBudgetFcfa: released ? project.approvedBudgetFcfa : undefined,
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
