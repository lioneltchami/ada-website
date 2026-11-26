import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dates = {
  'city-cleanup-may-2025': '2025-05-01',
  'prenatal-care-support-program': '2025-07-26',
  'womens-day-widows-outreach-2025': '2025-03-15',
};
const kinds = ['report', 'tor'];

export async function verify2025DocumentReleases(root, checkDist = false) {
  const load = async name => JSON.parse(await fs.readFile(path.join(root, 'config', name), 'utf8'));
  const manifest = await load('project-document-releases-2025.json');
  const review = await load('project-records-2024-25.json');
  assert.deepEqual(Object.keys(manifest).sort(), Object.keys(dates).sort());
  const records = review.projects.filter(p => p.year === 2025);
  assert.deepEqual(records.map(p => p.slug).sort(), Object.keys(dates).sort(), 'Each canonical 2025 record must occur exactly once');
  const redirects = (await fs.readFile(path.join(root, 'public/_redirects'), 'utf8')).split(/\r?\n/);
  const parents = checkDist ? ['public', 'dist/client'] : ['public'];
  for (const { slug, date, documentStatus, approvedBudgetFcfa } of records) {
    assert.equal(date, dates[slug], slug);
    assert.equal(documentStatus, 'released', slug);
    assert.equal(approvedBudgetFcfa, undefined, '2025 worksheets/working estimates are not uniformly approved budgets');
    assert.deepEqual(Object.keys(manifest[slug]).sort(), kinds, slug);
    for (const parent of parents) {
      const assetDir = path.join(root, parent, 'docs/projects', slug);
      assert.deepEqual((await fs.readdir(assetDir)).sort(), kinds.map(kind => kind + '.pdf'), 'Only the approved pair may be public: ' + assetDir);
      for (const kind of kinds) {
        const data = await fs.readFile(path.join(assetDir, kind + '.pdf'));
        assert.equal(data.subarray(0, 5).toString(), '%PDF-');
        assert.match(manifest[slug][kind], /^[a-f0-9]{64}$/);
        assert.equal(createHash('sha256').update(data).digest('hex'), manifest[slug][kind], 'Final approved PDF checksum: ' + slug + '/' + kind);
        assert.ok(!redirects.some(line => line.startsWith('/docs/projects/' + slug + '/' + kind + '.pdf ')), 'Canonical PDF must serve directly: ' + slug + '/' + kind);
      }
    }
  }
  console.log('Exact 2025 document releases verified: 6 approved PDFs' + (checkDist ? ' in source and build.' : '.'));
  return new Set(Object.keys(manifest));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await verify2025DocumentReleases(process.cwd(), process.argv.includes('--dist'));
}
