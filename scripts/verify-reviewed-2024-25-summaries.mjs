import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const config = JSON.parse(await fs.readFile('config/project-records-2024-25.json', 'utf8'));
const built = 'dist/client';
const redirects = (await fs.readFile(built + '/_redirects', 'utf8')).split(/\r?\n/);
const notFound = { code: 'ENOENT' };

for (const locale of ['', 'fr/']) {
  const archive = (await fs.readFile(built + '/' + locale + 'projects/archive/index.html', 'utf8'));
  const resources = (await fs.readFile(built + '/' + locale + 'resources/index.html', 'utf8'));
  for (const { slug, date, documentStatus, approvedBudgetFcfa } of config.projects) {
    const route = locale + 'projects/archive/' + slug;
    assert.ok(archive.includes('/' + route), 'Reviewed summary missing from archive: ' + route);
    const detail = await fs.readFile(built + '/' + route + '/index.html', 'utf8');
    const assets = '/docs/projects/' + slug + '/';
    if (documentStatus === 'released') {
      for (const kind of ['tor', 'report']) {
        const url = assets + kind + '.pdf';
        assert.ok(detail.includes(url), 'Released detail lacks approved PDF: ' + route + '/' + kind);
        assert.ok(resources.includes(url), 'Resources lacks approved PDF: ' + route + '/' + kind);
      }
      const words = new Intl.DateTimeFormat(locale ? 'fr-FR' : 'en-GB', {
        day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
      }).format(new Date(date + 'T00:00:00Z'));
      assert.ok(detail.includes(words), 'Released detail lacks exact localized date: ' + route);
      const localBudget = new Intl.NumberFormat(locale ? 'fr-FR' : 'en-US').format(approvedBudgetFcfa);
      const normalize = value => value.replace(/[\u00a0\u202f]/g, ' ');
      assert.ok(normalize(detail).includes(normalize(localBudget)), 'Released detail lacks correct budget: ' + route);
      for (const html of [detail, resources]) {
        assert.ok(!html.includes(assets + 'financial.pdf'), 'Budget lives in the project report: ' + route);
      }
      assert.ok(!/Financial account published|Compte financier publié|Budget under review|Budget en cours de vérification/i.test(detail),
        'Released budget is not a verified spending account or under review: ' + route);
      assert.ok(!/(?:\$1,000|1[\s\u00a0\u202f]000\s*\$|11[,.\s\u00a0\u202f]800|590[,.\s\u00a0\u202f]000|600[,.\s\u00a0\u202f]000)/.test(detail),
        'Superseded figure exposed in released detail: ' + route);
    } else {
      assert.ok(!detail.includes(assets), 'Pending detail exposes downloads: ' + route);
      assert.ok(!resources.includes(assets), 'Pending downloads listed in resources: ' + route);
    }
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
console.log(`Reviewed 2024–25 summaries: ${2 * config.projects.length} bilingual routes and superseded archive and document redirects verified.`);
