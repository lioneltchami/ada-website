import review from '../../config/project-records-2024-25.json';
import type { ProjectArchiveEntry, ProjectDemographic } from './project-archive';

/** Replace the record completely so figures, outcome claims, file links and photos cannot leak in from older CMS entries. */
export function applyReviewed2024And2025Summaries(entries: ProjectArchiveEntry[]): ProjectArchiveEntry[] {
  const superseded = new Set(Object.keys(review.redirects));
  const bySlug = new Map(entries.filter(entry => !superseded.has(entry.slug.current)).map(entry => [entry.slug.current, entry]));
  for (const project of review.projects) {
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
      documentReviewNote: 'The terms of reference and project report are not yet available.',
      documentReviewNoteFr: 'Les termes de référence et le rapport de projet ne sont pas encore disponibles.',
      financialReviewNote: 'No financial figures are published for this project while the records are reviewed.',
      financialReviewNoteFr: 'Aucun chiffre financier n’est publié pour ce projet pendant la vérification des documents.',
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
