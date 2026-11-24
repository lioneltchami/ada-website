import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const config = JSON.parse(await fs.readFile('config/project-records-2024-25.json', 'utf8'));
const built = 'dist/client';
const redirects = (await fs.readFile(built + '/_redirects', 'utf8')).split(/\r?\n/);
const notFound = { code: 'ENOENT' };

for (const locale of ['', 'fr/']) {
  const archive = (await fs.readFile(built + '/' + locale + 'projects/archive/index.html', 'utf8'));
  const resources = (await fs.readFile(built + '/' + locale + 'resources/index.html', 'utf8'));
  for (const { slug } of config.projects) {
    const route = locale + 'projects/archive/' + slug;
    assert.ok(archive.includes('/' + route), 'Reviewed summary missing from archive: ' + route);
    const detail = await fs.readFile(built + '/' + route + '/index.html', 'utf8');
    assert.ok(!detail.includes('/docs/projects/' + slug + '/'), 'Pending detail exposes downloads: ' + route);
    assert.ok(!resources.includes('/docs/projects/' + slug + '/'), 'Pending downloads listed in resources: ' + route);
  }
  for (const [old, target] of Object.entries(config.redirects)) {
    const archivePath = '/' + locale + 'projects/archive/';
    assert.ok(!archive.includes(archivePath + old), 'Archive still lists the superseded record: ' + locale + old);
    assert.ok(!resources.includes('/docs/projects/' + old + '/'), 'Resource library exposes superseded downloads: ' + locale + old);
    await assert.rejects(fs.stat(built + archivePath + old + '/index.html'), notFound);
    assert.ok(redirects.includes(archivePath + old + '/ ' + archivePath + target + '/ 301'));
    for (const kind of ['tor', 'report', 'financial']) for (const ext of ['pdf', 'md']) {
      const asset = '/docs/projects/' + old + '/' + kind + '.' + ext;
      await assert.rejects(fs.stat(built + asset), notFound);
      assert.ok(redirects.includes(asset + ' /projects/archive/' + target + '/ 302'));
    }
  }
}
console.log('Reviewed 2024–25 summaries: 14 bilingual routes and superseded archive and document redirects verified.');
