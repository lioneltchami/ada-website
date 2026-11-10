import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { verifyDocumentReleases } from '../scripts/verify-project-document-releases.mjs';
import manifest from '../config/project-document-releases.json';
import { getStoryReleaseCopy } from '../src/lib/story-release-copy';
import { hasStaticProjectDocuments } from '../src/data/organization';
import { impactMetricsFor, measurableIndicatorsFor } from '../src/data/impact';
import { isWithdrawnProjectRecord, isWithdrawnProjectSlug, isWithdrawnGalleryImage, isWithdrawnProgramEntry, isWithdrawnImpactMetric, isSafeProgramFaq, isWithdrawnAboutEntry } from '../src/lib/withdrawn-project-content';

describe('rejected 2023 vocational program removal', () => {
  it('suppresses both the archive and its linked source project', () => {
    for (const slug of ['young-women-skills-training-program', 'women-empowerment']) {
      expect(isWithdrawnProjectSlug(slug)).toBe(true);
      expect(isWithdrawnProjectRecord({slug:{current:slug}})).toBe(true);
      expect(hasStaticProjectDocuments(slug)).toBe(false);
      expect(isWithdrawnGalleryImage({projectSlug:slug})).toBe(true);
    }
    for (const _id of ['I3ROLIaQjmV1gZbnPYijko', 'project-women-empowerment', 'ADA/2023/002']) expect(isWithdrawnProjectRecord({_id})).toBe(true);
  });
  it('blocks restored CMS titles and dangling project references without blocking unrelated images', () => {
    for (const title of ['Young Women Skills Training Program', 'Young Women Empowerment', 'Programme de Formation des Jeunes Femmes', 'Autonomisation des Jeunes Femmes']) {
      expect(isWithdrawnProjectRecord({ title })).toBe(true);
      expect(isWithdrawnProgramEntry({ title })).toBe(true);
    }
    expect(isWithdrawnGalleryImage({ projectId: 'project-women-empowerment', title: 'Old training photo' })).toBe(true);
    expect(isWithdrawnGalleryImage({ projectId: 'project-education-orphans', title: 'School visit' })).toBe(false);
    for (const label of ['Young women documented earning income', 'Young women completing skills training', 'Jeunes femmes documentées générant un revenu', 'Jeunes femmes ayant terminé une formation professionnelle']) {
      expect(isWithdrawnImpactMetric({ label, value: 8 })).toBe(true);
      expect(isWithdrawnAboutEntry({ description: label })).toBe(true);
      expect(isSafeProgramFaq({ response: label })).toBe(false);
    }
    expect(isWithdrawnImpactMetric({ label: 'Girls attending the baking workshop', value: 10 })).toBe(false);
  });
  it('preserves distinct baking, widow relief and confirmed Esther story', () => {
    for (const slug of ['idp-girls-baking-training-jul-2022','widow-support-food-cash-mar-2022','womens-day-home-visits-mar-2023']) expect(isWithdrawnProjectSlug(slug)).toBe(false);
    for (const locale of ['en','fr'] as const) {
      const story = getStoryReleaseCopy('meet-esther-skills-training', locale)!;
      expect(story.title).toContain('Esther');
      expect(story.paragraphs.join(' ')).toContain('Hannah');
      expect(isWithdrawnAboutEntry({ title: story.title, description: story.paragraphs.join(' ') })).toBe(false);
    }
  });
  it('preserves all six reviewed 2022 document sets byte for byte', async () => {
    expect(await verifyDocumentReleases(process.cwd())).toEqual(new Set(manifest.projects.map(p => p.slug)));
    for (const project of manifest.projects) {
      for (const kind of ['tor', 'report'] as const) {
        const bytes = fs.readFileSync(`public/docs/projects/${project.slug}/${kind}.pdf`);
        expect(createHash('sha256').update(bytes).digest('hex')).toBe(project.documents[kind].sha256);
      }
    }
  });
  it('fails the document pipeline before rejected sources can be rendered again', async () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ada-withdrawal-'));
    try {
      fs.mkdirSync(path.join(root, 'public/docs/projects/young-women-skills-training-program'), { recursive: true });
      await expect(verifyDocumentReleases(root)).rejects.toThrow('Withdrawn project documents must not be published');
    } finally { fs.rmSync(root, { recursive: true, force: true }); }
  });
  it('removes documents and their income/graduation metrics', () => {
    expect(fs.existsSync('public/docs/projects/young-women-skills-training-program')).toBe(false);
    for (const locale of ['en','fr'] as const) {
      expect(JSON.stringify(impactMetricsFor(locale))).not.toMatch(/young-women-skills-training-program/);
      expect(JSON.stringify(measurableIndicatorsFor(locale))).not.toMatch(/10 graduated|8 earning income|10 diplômées|8 génèrent/);
    }
    for (const name of ['ada-project-history.md','ada-public-budget-adjustments.md','ada-public-budget-adjustments.json','ada-public-budget-adjustments.csv']) expect(fs.readFileSync(`public/docs/${name}`,'utf8')).not.toMatch(/young-women-skills-training-program|ADA\/2023\/002/);
  });
});
