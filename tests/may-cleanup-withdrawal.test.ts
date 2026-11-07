import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { applyOwnerFinancialReview } from '../src/lib/project-archive';

describe('superseded 2022 May project account', () => {
  it('withdraws the obsolete documents instead of inventing a replacement schedule', () => {
    for (const kind of ['tor', 'report', 'financial']) {
      const text = fs.readFileSync(`public/docs/projects/school-visit-mentorship-may-2022/${kind}.md`, 'utf8');
      expect(text).toContain('previous version of this document has been withdrawn');
      expect(text).not.toMatch(/180[,. ]?000|165[,. ]?000|receipts on file/);
    }
  });
  it('suppresses old CMS financial and outcome fields', () => {
    const entry = applyOwnerFinancialReview({ slug: { current: 'school-visit-mentorship-may-2022' }, title: 'Old title', year: 2022, demographic: 'orphans', budget: 1000, beneficiaries: 20, outcomes: ['Old claim'], description: 'Old financial claim' });
    expect(entry.budget).toBeUndefined();
    expect(entry.beneficiaries).toBeUndefined();
    expect(entry.outcomes).toEqual([]);
    expect(entry.description).toContain('withdrawn');
    expect(entry.title).toBe('May 2022 Community Cleanup');
  });
  it('excludes obsolete figures from public adjustment rows', () => {
    const rows = JSON.parse(fs.readFileSync('public/docs/ada-public-budget-adjustments.json', 'utf8'));
    const row = rows.find((row: any) => row.reference === 'ADA/2022/004');
    expect(row.status).toBe('under review');
    expect(row.archive_approved).toBeNull();
    expect(row.archive_actual).toBeNull();
  });
});
