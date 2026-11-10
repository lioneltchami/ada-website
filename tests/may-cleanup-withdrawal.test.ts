import releases from "../config/project-document-releases.json";
import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { documentArchiveProjects } from '../src/data/organization';
import { isWithdrawnProjectSlug, isWithdrawnProjectRecord, withoutWithdrawnProjects } from '../src/lib/withdrawn-project-content';

const slug = 'school-visit-mentorship-may-2022';
describe('misdated cleanup withheld from 2022', () => {
  it('removes static documents and the active archive entry', () => {
    expect(fs.existsSync(`public/docs/projects/${slug}`)).toBe(false);
    expect(documentArchiveProjects).not.toContain(slug);
  });
  it('filters stale CMS records without assigning a new year', () => {
    expect(isWithdrawnProjectSlug(slug)).toBe(true);
    expect(isWithdrawnProjectRecord({slug:{current:slug}})).toBe(true);
    expect(isWithdrawnProjectRecord({archiveRecord:{slug:{current:slug}}})).toBe(true);
    expect(withoutWithdrawnProjects([{slug:{current:slug}}, {slug:{current:'city-cleanup-may-2023'}}, {slug:{current:'city-cleanup-may-2025'}}])).toHaveLength(2);
  });
  it('removes the misdated record from generated public ledgers', () => {
    const rows = JSON.parse(fs.readFileSync('public/docs/ada-public-budget-adjustments.json', 'utf8'));
    const schoolReleased = releases.projects.some(p => p.slug === 'school-visit-may-2022' && p.status === 'released');
    const mayRows = rows.filter((row:any) => row.reference === 'ADA/2022/004');
    expect(mayRows).toHaveLength(schoolReleased ? 1 : 0);
    if (schoolReleased) expect(mayRows[0].project).toBe('School visit in Buea');
    for (const name of ['ada-project-history.md','ada-public-budget-adjustments.md','ada-public-budget-adjustments.csv']) {
      const text = fs.readFileSync(`public/docs/${name}`, 'utf8');
      expect(text).not.toMatch(/school-visit-mentorship-may-2022|May 2022 Community Cleanup/);
      if (!schoolReleased) expect(text).not.toMatch(/ADA\/2022\/004/);
    }
  });
});
