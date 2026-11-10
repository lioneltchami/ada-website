import releases from '../../config/project-document-releases.json';
import type { ProjectArchiveEntry, ProjectArchiveDocument, ProjectDemographic } from './project-archive';

/** Final overrides activate only with released documents, never for staged candidates. */
export function applyReleasedProjectContent(entries: ProjectArchiveEntry[]): ProjectArchiveEntry[] {
  const bySlug = new Map(entries.map(entry => [entry.slug.current, entry]));
  for (const project of releases.projects) {
    if (project.status !== 'released') continue;
    const content = project.archive;
    const previous = bySlug.get(project.slug);
    bySlug.set(project.slug, {
      ...previous,
      ...content,
      demographic: content.demographic as ProjectDemographic,
      slug: { current: project.slug }, year: 2022, status: 'completed', autoArchived: false,
      startDate: content.startDate || undefined, endDate: content.endDate || undefined,
      // Do not carry stale USD amounts, exact reach counts, outcome claims, or CMS photos forward.
      budget: undefined, beneficiaries: undefined, outcomes: [], outcomesFr: [], photo: undefined, photos: [],
      financialReviewNote: 'The report includes the financial account and detailed category schedules. Reported figures, reconstructed allocations and unresolved differences are identified separately; these are not claims of audited expenditure or today’s account balance.',
      financialReviewNoteFr: 'Le rapport comprend le compte financier et les tableaux détaillés par catégorie. Les chiffres déclarés, les répartitions reconstituées et les écarts non résolus sont distingués ; ils ne constituent ni des dépenses auditées ni le solde actuel du compte.',
    });
  }
  return [...bySlug.values()];
}

/** Resource downloads use the same approved six records, including offline builds. */
export function applyReleasedDocumentLibrary(entries: ProjectArchiveDocument[]): ProjectArchiveDocument[] {
  const bySlug = new Map(entries.map(entry => [entry.slug, entry]));
  for (const project of releases.projects) {
    if (project.status !== 'released') continue;
    bySlug.set(project.slug, {
      slug: project.slug, year: 2022,
      title: project.archive.title, titleFr: project.archive.titleFr,
      demographic: project.archive.demographic as ProjectDemographic,
    });
  }
  return [...bySlug.values()];
}
