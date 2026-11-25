import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const approvedRecords = {
  'back-to-school-buea-2024': { date: '2024-08-31', budget: 82750 },
  'girls-programme-2024': { date: '2024-10-18', budget: 250700 },
  'christmas-giving-dec-2024': { date: '2024-12-21', budget: 260000 },
};
const kinds = ['report', 'tor'];

export async function verify2024DocumentReleases(root, checkDist = false) {
  const load = async name => JSON.parse(await fs.readFile(path.join(root, 'config', name), 'utf8'));
  const approved = await load('project-document-releases-2024.json');
  const data = await load('project-records-2024-25.json');
  assert.deepEqual(Object.keys(approved).sort(), Object.keys(approvedRecords).sort());
  assert.deepEqual(data.projects.filter(p => p.documentStatus === 'released').map(p => p.slug).sort(), Object.keys(approved).sort());
  const redirects = (await fs.readFile(path.join(root, 'public/_redirects'), 'utf8')).split(/\r?\n/);
  const baseDirs = checkDist ? ['public', 'dist/client'] : ['public'];
  for (const [slug, docs] of Object.entries(approved)) {
    const matches = data.projects.filter(p => p.slug === slug);
    assert.equal(matches.length, 1, slug);
    const record = matches[0];
    assert.equal(record.year, 2024, slug);
    assert.equal(record.date, approvedRecords[slug].date, slug);
    assert.equal(record.approvedBudgetFcfa, approvedRecords[slug].budget, slug);
    assert.deepEqual(Object.keys(docs).sort(), kinds, slug);
    const assetDir = `/docs/projects/${slug}/`;
    for (const base of baseDirs) {
      const fullDir = path.join(root, base, assetDir);
      assert.deepEqual((await fs.readdir(fullDir)).sort(), kinds.map(k => k + '.pdf'), 'Only two exact approved files may be public: ' + fullDir);
      for (const kind of kinds) {
        const bytes = await fs.readFile(path.join(fullDir, kind + '.pdf'));
        assert.equal(bytes.subarray(0, 5).toString(), '%PDF-');
        assert.match(docs[kind], /^[a-f0-9]{64}$/);
        assert.equal(createHash('sha256').update(bytes).digest('hex'), docs[kind], 'PDF must match approved version: ' + fullDir + kind);
        assert.ok(!redirects.some(line => line.startsWith(assetDir + kind + '.pdf ')), 'Canonical PDF must not redirect: ' + slug + '/' + kind);
      }
    }
    if (slug === 'christmas-giving-dec-2024') {
      for (const [old, target] of [['tor.md','tor.pdf'], ['report.md','report.pdf'], ['financial.pdf','report.pdf'], ['financial.md','report.pdf']]) {
        assert.ok(redirects.includes(`${assetDir}${old} ${assetDir}${target} 302`), 'Legacy Christmas redirect missing: ' + old);
      }
    }
  }
  console.log('Exact 2024 document releases verified: six approved PDFs' + (checkDist ? ' in source and build' : '') + '.');
  return new Set(Object.keys(approved));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await verify2024DocumentReleases(process.cwd(), process.argv.includes('--dist'));
}
