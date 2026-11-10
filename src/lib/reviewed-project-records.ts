import review from '../../config/project-records-2023.json';
import type { ProjectArchiveEntry, ProjectDemographic } from './project-archive';

export const reviewedProjectRecords = review.projects;
const pendingSlugs = new Set(review.projects.filter(p => p.documentStatus === 'review-pending').map(p => p.slug));
export function isProjectDocumentReviewPending(slug: string): boolean { return pendingSlugs.has(slug); }

/** Confirmed summaries are separate from final PDF approval; do not inherit stale CMS evidence. */
export function applyReviewedProjectContent(entries: ProjectArchiveEntry[]): ProjectArchiveEntry[] {
  const bySlug = new Map(entries.map(entry => [entry.slug.current, entry]));
  for (const project of review.projects) {
    bySlug.set(project.slug, {
      ...bySlug.get(project.slug),
      slug: { current: project.slug }, title: project.title, titleFr: project.titleFr,
      year: project.year, status: 'completed', autoArchived: false,
      demographic: project.demographic as ProjectDemographic,
      description: project.description, descriptionFr: project.descriptionFr,
      location: project.location || undefined, locationFr: project.locationFr || undefined,
      startDate: project.startDate || undefined, endDate: project.endDate || undefined,
      budget: undefined, beneficiaries: undefined, outcomes: [], outcomesFr: [],
      photo: undefined, photos: [],
      torUrl: undefined, reportUrl: undefined, financialReportUrl: undefined,
      hasToR: false, hasReport: false,
      financialReviewNote: project.financialNote, financialReviewNoteFr: project.financialNoteFr,
      documentReviewNote: (project.legacyDocumentSet ? 'The earlier documents have been withdrawn while their corrections are reviewed. ' : '') + 'The separate terms of reference and project report are being reviewed. Download links will be added when the corrected documents are ready.',
      documentReviewNoteFr: (project.legacyDocumentSet ? 'Les documents précédents ont été retirés pendant la vérification de leurs corrections. ' : '') + 'Les termes de référence et le rapport de projet distincts sont en cours de vérification. Les liens de téléchargement seront ajoutés lorsque les documents corrigés seront prêts.',
    });
  }
  return [...bySlug.values()];
}
