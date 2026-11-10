import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { applyOwnerFinancialReview } from '../src/lib/project-archive';

describe('superseded 2022 back-to-school finances', () => {
  it('replaces obsolete documents with approved evidence-qualified accounts', () => {
    for (const kind of ['tor', 'report']) {
      const text = fs.readFileSync(`public/docs/projects/back-to-school-sep-2022/${kind}.md`, 'utf8');
      expect(text).not.toContain('Private review - not for publication');
      expect(text).toMatch(/retrospective|prepared|reconstructed/i);
      expect(text).not.toMatch(/600[,. ]?000|585[,. ]?000/);
    }
  });
  it('suppresses old CMS financial and outcome fields', () => {
    const entry = applyOwnerFinancialReview({ slug: { current: 'back-to-school-sep-2022' }, title: 'Old title', year: 2022, demographic: 'orphans', budget: 1000, beneficiaries: 20, outcomes: ['Old claim'], description: 'Old financial claim' });
    expect(entry.budget).toBeUndefined();
    expect(entry.beneficiaries).toBeUndefined();
    expect(entry.outcomes).toEqual([]);
    expect(entry.description).toContain('withdrawn');
  });
  it('excludes obsolete figures from public adjustment rows', () => {
    const rows = JSON.parse(fs.readFileSync('public/docs/ada-public-budget-adjustments.json', 'utf8'));
    const row = rows.find((row: any) => row.reference === 'ADA/2022/006');
    expect(row.status).toBe('reported / reconstructed; see basis');
    expect(row.archive_approved).toBeNull();
    expect(row.archive_actual).toBeNull();
  });
});
