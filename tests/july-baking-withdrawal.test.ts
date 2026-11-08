import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { applyOwnerFinancialReview } from '../src/lib/project-archive';

describe('superseded 2022 July project account', () => {
  it('withdraws the obsolete documents instead of inventing a replacement schedule', () => {
    for (const kind of ['tor', 'report', 'financial']) {
      const text = fs.readFileSync(`public/docs/projects/idp-girls-baking-training-jul-2022/${kind}.md`, 'utf8');
      expect(text).toContain('previous version of this document has been withdrawn');
      expect(text).not.toMatch(/900[,. ]?000|875[,. ]?000|receipts on file/);
    }
  });
  it('suppresses old CMS financial and outcome fields', () => {
    const entry = applyOwnerFinancialReview({ slug: { current: 'idp-girls-baking-training-jul-2022' }, title: 'Old title', year: 2022, demographic: 'orphans', budget: 1000, beneficiaries: 20, outcomes: ['Old claim'], description: 'Old financial claim', descriptionFr: 'Old French claim', photo: { alt: 'Old participant story' }, photos: [{ caption: 'Old story' }], startDate: '2022-07-01', endDate: '2022-07-31' });
    expect(entry.budget).toBeUndefined();
    expect(entry.photo).toBeUndefined();
    expect(entry.photos).toEqual([]);
    expect(entry.startDate).toBeUndefined();
    expect(entry.endDate).toBeUndefined();
    expect(entry.descriptionFr).not.toContain("Old French");
    expect(entry.beneficiaries).toBeUndefined();
    expect(entry.outcomes).toEqual([]);
    expect(entry.description).toContain('withdrawn');
    expect(entry.title).toBe('July 2022 Baking Workshop');
  });
  it('excludes obsolete figures from public adjustment rows', () => {
    const rows = JSON.parse(fs.readFileSync('public/docs/ada-public-budget-adjustments.json', 'utf8'));
    const row = rows.find((row: any) => row.reference === 'ADA/2022/005');
    expect(row.status).toBe('under review');
    expect(row.archive_approved).toBeNull();
    expect(row.archive_actual).toBeNull();
  });
});
