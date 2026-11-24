import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import review from '../config/project-records-2024-25.json';
import { hasStaticProjectDocuments } from '../src/data/organization';
import type { ProjectArchiveEntry } from '../src/lib/project-archive';
import { applyReviewed2024And2025Summaries, isSupersededBamendaSchoolPhoto } from '../src/lib/reviewed-project-summaries-2024-25';

const oldSlug = 'back-to-school-bamenda-sep-2024';
const bamendaSlug = 'back-to-school-bamenda-aug-2025';
const buea2025 = 'back-to-school-buea-2025';
const hospitalSlug = 'hospital-outreach-mothers-muea-2025';
const buea2024 = 'back-to-school-buea-2024';

const seed = (slug: string): ProjectArchiveEntry => ({
  slug: { current: slug }, title: 'Legacy', titleFr: 'Ancien',
  year: 2024, demographic: 'orphans', status: 'ongoing',
  budget: 1200, beneficiaries: 25, photo: { asset: { _ref: 'legacy-asset' } },
  photos: [{ asset: { _ref: 'legacy-gallery-asset' } }],
  startDate: '2024-09-01', outcomes: ['Unverified listed outcome'],
  reportUrl: 'https://cdn.sanity.io/legacy.pdf', hasReport: true, hasToR: true,
});

describe('source-backed 2024–25 archive summaries', () => {
  it('keeps Bamenda 2025 separate from Buea and replaces, never relabels, old CMS data', () => {
    const unknown = seed('unrelated-legacy-record');
    const entries = applyReviewed2024And2025Summaries([seed(oldSlug), seed(bamendaSlug), seed(hospitalSlug), seed(buea2024), unknown]);
    const bySlug = new Map(entries.map(e => [e.slug.current, e]));
    expect(bySlug.has(oldSlug)).toBe(false);
    expect(bySlug.get(bamendaSlug)).toMatchObject({ year: 2025, location: 'Bamenda', startDate: '2025-08-29', endDate: '2025-08-29' });
    expect(bySlug.get(buea2025)).toMatchObject({ year: 2025, location: 'Buea' });
    expect(bySlug.get(buea2025)?.startDate).toBeUndefined();
    expect(bySlug.get(buea2024)).toMatchObject({ year: 2024, location: 'Buea' });
    expect(bySlug.get(buea2024)?.startDate).toBeUndefined();
    expect(bySlug.get(hospitalSlug)?.description).toContain('about 15 mothers');
    expect(bySlug.get(hospitalSlug)?.descriptionFr).toContain('environ 15 mères');
    expect(bySlug.get('unrelated-legacy-record')).toBe(unknown);
    for (const summary of review.projects) {
      const entry = bySlug.get(summary.slug)!;
      expect(entry.titleFr).toBeTruthy();
      expect(entry.descriptionFr).toBeTruthy();
      for (const staleField of ['budget', 'beneficiaries', 'photo', 'photos', 'outcomes', 'torUrl', 'reportUrl', 'financialReportUrl'] as const) {
        expect(entry[staleField], summary.slug + ': ' + staleField).toBeUndefined();
      }
      expect(hasStaticProjectDocuments(summary.slug)).toBe(false);
    }
  });

  it('retains the public URL paths through locale-matching redirects without serving old files', () => {
    const redirects = readFileSync('public/_redirects', 'utf8');
    for (const [old, target] of Object.entries(review.redirects)) {
      for (const prefix of ['', '/fr']) {
        for (const suffix of ['', '/']) {
          expect(redirects).toContain(prefix + '/projects/archive/' + old + suffix + ' ' + prefix + '/projects/archive/' + target + '/ 301\n');
        }
      }
      expect(hasStaticProjectDocuments(old)).toBe(false);
      for (const kind of ['tor', 'report', 'financial']) {
        for (const ext of ['pdf', 'md']) {
          const file = '/docs/projects/' + old + '/' + kind + '.' + ext;
          expect(existsSync('public' + file)).toBe(false);
          expect(redirects).toContain(file + ' /projects/archive/' + target + '/ 302\n');
        }
      }
    }
  });

  it('withholds the misdated Bamenda photo without recategorizing other gallery assets', () => {
    expect(isSupersededBamendaSchoolPhoto({ title: 'Back to School Project Bamenda 2024', projectSlug: 'emergency-relief' })).toBe(true);
    expect(isSupersededBamendaSchoolPhoto({ projectSlug: oldSlug })).toBe(true);
    expect(isSupersededBamendaSchoolPhoto({ title: 'Back to School Project Buea 2024' })).toBe(false);
    expect(isSupersededBamendaSchoolPhoto({ title: 'Back to School Project Bamenda 2025' })).toBe(false);
  });
});
