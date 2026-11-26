import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

const build = path.resolve(process.argv[2] ?? 'dist/client');
const repo = new URL('../', import.meta.url);
const config = async name => JSON.parse(await fs.readFile(new URL('config/' + name + '.json', repo), 'utf8'));
const { series, outreaches } = await config('outreach-naming');
const retired = await config('withdrawn-project-records');

const upcoming = new Set(['christmas-giving-buea-dec-2026', 'christmas-giving-bamenda-dec-2026']);
// Permanent compatibility floor: a naming change must not rename existing URLs.
const published = [
  'first-widow-home-visits-2021',
  'school-supply-distribution-feb-2022', 'widow-support-food-cash-mar-2022', 'school-visit-may-2022',
  'idp-girls-baking-training-jul-2022', 'back-to-school-sep-2022', 'christmas-giving-dec-2022',
  'youth-day-snacks-feb-2023', 'mountain-race-outreach-feb-2023', 'womens-day-home-visits-mar-2023',
  'city-cleanup-may-2023', 'back-to-school-drive-2023', 'girls-day-oct-2023', 'christmas-giving-dec-2023',
  'back-to-school-buea-2024', 'girls-programme-2024', 'christmas-giving-dec-2024',
  'womens-day-widows-outreach-2025', 'prenatal-care-support-program', 'city-cleanup-may-2025',
  'back-to-school-buea-aug-2026', 'back-to-school-bamenda-aug-2026', 'girls-dignity-menstrual-health-bamenda-jun-2026',
];
for (const slug of [...published, ...upcoming]) assert.ok(outreaches[slug], 'Missing stable outreach slug: ' + slug);
for (const slug of Object.keys(retired)) assert.ok(!outreaches[slug], 'Withdrawn slug in naming registry: ' + slug);

const read = name => fs.readFile(path.join(build, name), 'utf8');
const htmlAt = route => route.replace(/\/$/, '') + '/index.html';
const anchors = html => [...html.matchAll(/<a\b[^>]+\bhref="([^"]+)"/g)].map(match => match[1]);
const renderedText = html => html.replace(/<!--[^]*?-->|<[^>]*>/g, '').replace(/&(?:#39|apos);/g, "'").replace(/&(?:nbsp|#160);/g, ' ').replace(/\s+/gu, ' ').trim();
const markedNames = html => [...html.matchAll(/<([\w-]+)\b[^>]*\bdata-outreach-title="([^"]+)"[^>]*>([\s\S]*?)<\/\1>/g)]
  .map(([, , slug, name]) => [slug, renderedText(name)]);
function verifyTitle(html, slug, lang, description) {
  const { series: key, location } = outreaches[slug];
  const title = series[key]?.[lang] + (location ? ' · ' + location : '');
  assert.ok(series[key]?.[lang], 'Missing translation: ' + slug);
  const names = markedNames(html).filter(([candidate]) => candidate === slug).map(([, name]) => name);
  assert.ok(names.length > 0 && names.every(name => name === title), description + ' missing canonical title "' + title + '" (got ' + JSON.stringify(names) + ')');
}
const redirects = new Map((await read('_redirects')).split(/\r?\n/)
  .map(line => line.trim().split(/\s+/)).filter(([from, to]) => from.startsWith('/') && to)
  .map(([from, to, code]) => [from, { to, code }]));
const duplicateTargets = {
  'campus-cleanup-aug-2025': 'city-cleanup-may-2025',
  'hospital-outreach-mothers-muea-2025': 'prenatal-care-support-program',
  'hospital-prenatal-care-jul-2025': 'prenatal-care-support-program',
};
const beforeChristmasOutreach = new Date().toISOString().slice(0, 10) <= '2026-12-20';
const pdfs = new Set();
const checked = [];
for (const [prefix, lang] of [['', 'en'], ['/fr', 'fr']]) {
  const archiveBase = prefix + '/projects/archive/';
  const archive = await read(htmlAt(archiveBase));
  const resources = await read(htmlAt(prefix + '/resources'));
  const projects = await read(htmlAt(prefix + '/projects'));
  const home = await read(htmlAt(prefix || '/'));
  checked.push(archive, resources, projects, home);

  for (const slug of Object.keys(retired)) {
    const target = archiveBase + (duplicateTargets[slug] ? duplicateTargets[slug] + '/' : '');
    for (const base of [archiveBase, prefix + '/projects/']) {
      const route = base + slug;
      await assert.rejects(fs.access(path.join(build, htmlAt(route))), { code: 'ENOENT' }, route + ' must not reenter build');
      for (const slash of ['', '/']) {
        const redirect = redirects.get(route + slash);
        // The archive aliases are always provided; newer retired routes can also have active-page aliases.
        if (base === archiveBase || redirect) {
          assert.equal(redirect?.to, target, route + ' must preserve its redirect');
          assert.match(redirect?.code ?? '', /^30[12]$/, route);
        }
      }
    }
    for (const content of [archive, resources, projects, home]) {
      assert.ok(!anchors(content).some(link => link.split('/').includes(slug)), slug + ' linked from bilingual outreach listings');
    }
    await assert.rejects(fs.access(path.join(build, 'docs/projects', slug)), { code: 'ENOENT' }, slug + ' retired document directory');
    // The education hold never had a public PDF path; the other withdrawals did.
    if (lang === 'en' && slug !== 'education-orphans') {
      for (const kind of ['tor', 'report', 'financial']) for (const extension of ['md', 'pdf']) {
        const route = '/docs/projects/' + slug + '/' + kind + '.' + extension;
        assert.deepEqual(redirects.get(route), { to: target, code: '302' }, 'Preserve legacy PDF/Markdown redirect ' + route);
      }
    }
  }

  const checkBreadcrumb = (html, slug) => {
    const { series: key, location } = outreaches[slug];
    const expected = series[key][lang] + (location ? ' · ' + location : '');
    const blocks = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
      .flatMap((match) => {
        const block = JSON.parse(match[1]);
        return Array.isArray(block) ? block : [block];
      });
    const breadcrumbs = blocks.find((entry) => entry?.['@type'] === 'BreadcrumbList');
    assert.equal(breadcrumbs?.itemListElement?.at(-1)?.name, expected, lang + ' breadcrumb title: ' + slug);
  };
  for (const slug of published) {
    const route = archiveBase + slug;
    const detail = await read(htmlAt(route));
    const documentBase = '/docs/projects/' + slug + '/';
    checked.push(detail);
    checkBreadcrumb(detail, slug);
    assert.ok(anchors(archive).some(link => link === route || link === route + '/'), route + ' missing from archive');
    assert.equal(markedNames(archive).filter(([candidate]) => candidate === slug).length, 1, route + ' must have one archive card');
    for (const [html, context] of [[archive, 'archive card'], [resources, 'resource library'], [detail, 'archive detail']]) {
      verifyTitle(html, slug, lang, context + ' ' + lang + ' ' + slug);
    }
    for (const kind of ['tor', 'report']) {
      const url = documentBase + kind + '.pdf';
      assert.ok(!redirects.has(url), url + ' must serve directly');
      for (const [html, context] of [[resources, 'resource library'], [detail, 'archive detail']]) {
        assert.ok(anchors(html).includes(url), context + ' ' + lang + ' missing ' + url);
      }
      pdfs.add(url);
    }
  }
  for (const slug of upcoming) {
    // Leave this archive transition monotonic: once these outreach dates pass, the
    // archived page is allowed to replace the upcoming page, but no report may appear
    // unless a real PDF is built and both the detail and Resources link to it.
    const activeRoute = prefix + '/projects/' + slug;
    const archiveRoute = archiveBase + slug;
    const isArchived = anchors(archive).some(link => link === archiveRoute || link === archiveRoute + '/');
    if (beforeChristmasOutreach) assert.ok(!isArchived, slug + ' was archived before the outreach took place');
    const detail = await read(htmlAt(isArchived ? archiveRoute : activeRoute));
    checked.push(detail);
    checkBreadcrumb(detail, slug);
    verifyTitle(detail, slug, lang, 'Christmas detail ' + lang + ' ' + slug);
    verifyTitle(resources, slug, lang, 'Christmas resource library ' + lang + ' ' + slug);
    const isUpcoming = !isArchived && beforeChristmasOutreach;
    if (isUpcoming) {
      verifyTitle(projects, slug, lang, 'Christmas project index ' + lang + ' ' + slug);
      verifyTitle(home, slug, lang, 'Christmas homepage ' + lang + ' ' + slug);
    }
    const doc = '/docs/projects/' + slug + '/';
    for (const content of [detail, resources]) assert.ok(anchors(content).includes(doc + 'tor.pdf'), lang + ' missing advance plan ' + doc);
    if (!isArchived) {
      for (const content of [archive, detail, projects, resources]) assert.ok(!anchors(content).includes(doc + 'report.pdf'), lang + ' an unarchived Christmas outreach cannot have a completion report');
      await assert.rejects(fs.access(path.join(build, doc + 'report.pdf')), { code: 'ENOENT' }, slug);
    } else {
      verifyTitle(archive, slug, lang, 'Christmas archive card ' + lang + ' ' + slug);
      assert.equal(anchors(detail).includes(doc + 'report.pdf'), anchors(resources).includes(doc + 'report.pdf'), lang + ' report link differs across surfaces');
    }
    pdfs.add(doc + 'tor.pdf');
  }
  for (let year = 2021; year <= 2025; year++) {
    const url = '/docs/year-in-review/ADA-' + year + '-Year-in-Review.pdf';
    assert.ok(anchors(resources).includes(url), 'Missing ' + lang + ' annual report ' + year);
    pdfs.add(url);
  }
}

for (const content of checked) {
  for (const href of anchors(content)) {
    const match = href.match(/^(?:https:\/\/(?:www\.)?apotidev\.org)?(\/[^?#]+\.pdf)(?:[?#].*)?$/i);
    if (match) pdfs.add(decodeURIComponent(match[1]));
  }
}
for (const href of pdfs) {
  const handle = await fs.open(path.join(build, href), 'r').catch(error => { throw new Error('Unavailable local PDF: ' + href, { cause:error }); });
  try {
    const sig = Buffer.alloc(5);
    await handle.read(sig, 0, 5, 0);
    assert.equal(sig.toString(), '%PDF-', href + ' is not a PDF');
  } finally {
    await handle.close();
  }
}
console.log(`Verified ${published.length} stable archive routes, ${upcoming.size} Christmas records, withdrawal redirects and ${pdfs.size} local PDFs across EN/FR.`);
