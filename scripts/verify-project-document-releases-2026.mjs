import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const girlsDignitySlug = 'girls-dignity-menstrual-health-bamenda-jun-2026';
const dates = {
  'back-to-school-bamenda-aug-2026': '2026-11-21',
  'back-to-school-buea-aug-2026': '2026-09-12',
  [girlsDignitySlug]: '2026-06-28',
};
const slugs = Object.keys(dates);
const kinds = ['report', 'tor'];
const christmasPlanSlugs = ['christmas-giving-buea-dec-2026', 'christmas-giving-bamenda-dec-2026'];
const legacyBrief = '/docs/diligence/ada-bamenda-girls-dignity-outreach';

export async function verify2026DocumentReleases(root, checkDist = false) {
  const manifest = JSON.parse(await fs.readFile(path.join(root, 'config/project-document-releases-2026.json'), 'utf8'));
  assert.deepEqual(Object.keys(manifest).sort(), slugs);
  const { projects } = JSON.parse(await fs.readFile(path.join(root, 'config/project-records-2026.json'), 'utf8'));
  assert.deepEqual(projects.map(p => p.slug).sort(), slugs, 'All three canonical 2026 records must occur once');
  for (const { slug, date } of projects) assert.equal(date, dates[slug], slug);
  const assetRoots = checkDist ? ['public', 'dist/client'] : ['public'];
  for (const parent of assetRoots) {
    const redirects = (await fs.readFile(path.join(root, parent, '_redirects'), 'utf8')).split(/\r?\n/);
    for (const slug of slugs) {
      assert.deepEqual(Object.keys(manifest[slug]).sort(), kinds, slug);
      const assetDir = path.join(root, parent, 'docs/projects', slug);
      assert.deepEqual((await fs.readdir(assetDir)).sort(), kinds.map(kind => kind + '.pdf'), 'Only the reviewed pair may be public: ' + assetDir);
      for (const kind of kinds) {
        const pdf = await fs.readFile(path.join(assetDir, kind + '.pdf'));
        const route = '/docs/projects/' + slug + '/' + kind + '.pdf';
        assert.equal(pdf.subarray(0, 5).toString(), '%PDF-', route);
        assert.match(manifest[slug][kind], /^[a-f0-9]{64}$/);
        assert.equal(createHash('sha256').update(pdf).digest('hex'), manifest[slug][kind], 'Exact reviewed PDF checksum: ' + route);
        assert.ok(!redirects.some(line => line.trimStart().startsWith(route + ' ')), 'Canonical PDF must serve directly: ' + route);
      }
    }
    for (const slug of christmasPlanSlugs) {
      const dir = path.join(root, parent, 'docs/projects', slug);
      assert.deepEqual(await fs.readdir(dir), ['tor.pdf'], 'Only the advance plan is public: ' + slug);
      const plan = await fs.readFile(path.join(dir, 'tor.pdf'));
      assert.equal(plan.subarray(0, 5).toString(), '%PDF-', slug);
      if (parent !== 'public') assert.deepEqual(plan, await fs.readFile(path.join(root, 'public/docs/projects', slug, 'tor.pdf')));
    }
    for (const ext of ['pdf', 'md']) {
      const legacyRoute = legacyBrief + '.' + ext;
      await assert.rejects(fs.access(path.join(root, parent, legacyRoute.slice(1))), {code: 'ENOENT'}, 'Old planning brief must not remain public');
      assert.ok(redirects.includes(legacyRoute + ' /docs/projects/' + girlsDignitySlug + '/report.pdf 302'), 'Legacy brief URL must redirect to the completed report');
    }
  }
  if (checkDist) {
    for (const prefix of ['', 'fr/']) {
      const built = path.join(root, 'dist/client', prefix);
      for (const slug of christmasPlanSlugs) {
        const detail = await fs.readFile(path.join(built, 'projects', slug, 'index.html'), 'utf8');
        const resources = await fs.readFile(path.join(built, 'resources/index.html'), 'utf8');
        for (const html of [detail, resources]) assert.ok(html.includes('href="/docs/projects/' + slug + '/tor.pdf"'),
          'Christmas planning document missing: ' + prefix + slug);
      }
      for (const slug of slugs) {
        const detail = await fs.readFile(path.join(built, 'projects/archive', slug, 'index.html'), 'utf8');
        const resources = await fs.readFile(path.join(built, 'resources/index.html'), 'utf8');
        for (const html of [detail, resources]) {
          for (const kind of kinds) {
            const route = '/docs/projects/' + slug + '/' + kind + '.pdf';
            assert.ok(html.includes('href="' + route + '"'), 'Public document link missing: ' + prefix + route);
          }
          assert.ok(!html.includes('href="' + legacyBrief), 'Superseded briefing must not be linked');
        }
      }
    }
  }
  console.log('Exact 2026 document releases verified: six reviewed PDFs and two advance plans' + (checkDist ? ' in source and build.' : '.'));
  return new Set([...slugs, ...christmasPlanSlugs]);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await verify2026DocumentReleases(process.cwd(), process.argv.includes('--dist'));
}
