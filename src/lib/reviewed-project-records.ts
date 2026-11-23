import review from '../../config/project-records-2023.json';
import type { ProjectArchiveDocument, ProjectArchiveEntry, ProjectDemographic } from './project-archive';

export const reviewedProjectRecords = review.projects;
const pendingSlugs = new Set(review.projects.filter(p => p.documentStatus === 'review-pending').map(p => p.slug));
export function hasReleased2023ProjectDocumentSet(slug: string): boolean {
  return review.projects.some((project) => project.slug === slug && project.documentStatus === 'released');
}
export function listReleased2023ProjectDocuments(): ProjectArchiveDocument[] {
  return review.projects.filter((p) => p.documentStatus === 'released').map((p) => ({
    slug: p.slug, year: p.year, title: p.title, titleFr: p.titleFr, demographic: p.demographic as ProjectDemographic,
  }));
}
export function isProjectDocumentReviewPending(slug: string): boolean { return pendingSlugs.has(slug); }

/** Confirmed summaries are separate from final PDF approval; do not inherit stale CMS evidence. */
export function applyReviewedProjectContent(entries: ProjectArchiveEntry[]): ProjectArchiveEntry[] {
  const bySlug = new Map(entries.map(entry => [entry.slug.current, entry]));
  for (const project of review.projects) {
    const pending = project.documentStatus !== 'released';
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
      financialReviewTitle: project.financialNoteTitle, financialReviewTitleFr: project.financialNoteTitleFr,
      financialReviewNote: project.financialNote, financialReviewNoteFr: project.financialNoteFr,
      documentReviewNote: pending ? (project.legacyDocumentSet ? 'The earlier documents have been withdrawn while their corrections are reviewed. ' : '') + 'The separate terms of reference and project report are being reviewed. Download links will be added when the corrected documents are ready.' : undefined,
      documentReviewNoteFr: pending ? (project.legacyDocumentSet ? 'Les documents précédents ont été retirés pendant la vérification de leurs corrections. ' : '') + 'Les termes de référence et le rapport de projet distincts sont en cours de vérification. Les liens de téléchargement seront ajoutés lorsque les documents corrigés seront prêts.' : undefined,
    });
  }
  return [...bySlug.values()];
}
