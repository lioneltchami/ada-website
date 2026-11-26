import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = path.resolve(process.argv[2] ?? 'dist/client');
const paths = (p) => path.join(root, p);
const read = (p) => fs.readFile(paths(p), 'utf8');
const absent = async (p) => assert.rejects(fs.stat(paths(p)), { code: 'ENOENT' }, p);
const base = '/projects/archive/';
const confirmed = {
  'christmas-orphanage-outreach-2025': '2025-12-20',
  'back-to-school-bamenda-aug-2025': '2025-08-30',
  'back-to-school-buea-2025': '2025-08-30',
  'prenatal-care-support-program': '2025-07-26',
  'city-cleanup-may-2025': '2025-05-01',
  'womens-day-widows-outreach-2025': '2025-03-15',
};
const reviewedWorksheetFigures = {
  'womens-day-widows-outreach-2025': [240000,396,'calculated-worksheet-budget'],
  'prenatal-care-support-program': [150000,267,'budget'],
  'city-cleanup-may-2025': [50000,86,'budget'],
  'back-to-school-buea-2025': [102600,182,'worksheet-budget'],
  'back-to-school-bamenda-aug-2025': [151000,268,'worksheet-budget'],
  'christmas-orphanage-outreach-2025': [119500,213,'working-cost-list'],
};
const reconciled = JSON.parse(await fs.readFile('config/project-records-2024-25.json', 'utf8')).projects.filter(p => p.year === 2025);
assert.deepEqual(reconciled.map(p => p.slug).sort(), Object.keys(confirmed).sort(), 'exactly six distinct reviewed 2025 records');
for (const p of reconciled) {
  assert.equal(p.documentStatus, 'released', 'All six approved public pairs must be available');
  assert.equal(p.approvedBudgetFcfa, undefined, 'do not present older worksheet figures as a uniformly approved budget');
  assert.equal(p.date, confirmed[p.slug], p.slug);
}
const retired = {
  'hospital-prenatal-care-jul-2025': 'prenatal-care-support-program',
  'hospital-outreach-mothers-muea-2025': 'prenatal-care-support-program',
  'campus-cleanup-aug-2025': 'city-cleanup-may-2025',
  'idp-children-education-fund': '',
  'youth-mentorship-seminar-oct-2025': '',
};
const redirects = (await read('/_redirects')).split(/\r?\n/);
for (const [slug, target] of Object.entries({...retired, 'prenatal-care-support-program':'prenatal-care-support-program', 'city-cleanup-may-2025':'city-cleanup-may-2025'})) {
  for (const kind of ['tor','report','financial']) for (const suffix of ['md','pdf']) {
    const source = '/docs/projects/' + slug + '/' + kind + '.' + suffix;
    if (target === slug && suffix === 'pdf' && (kind === 'tor' || kind === 'report')) {
      assert.ok(!redirects.some(line => line.startsWith(source + ' ')), 'Canonical PDF must not redirect: ' + source);
    } else {
      await absent(source);
      assert.ok(redirects.includes(source + ' ' + base + (target ? target + '/' : '') + ' 302'), source);
    }
  }
}
for (const [prefix, locale] of [['','en-GB'],['/fr','fr-FR']]) {
  const archive = await read(prefix + base + 'index.html');
  const resources = await read(prefix + '/resources/index.html');
  const group = archive.split(/data-year-group="2025"/)[1]?.split(/data-year-group="2024"/)[0];
  assert.ok(group, '2025 year group absent');
  const cards = [...group.matchAll(/<a\b([^>]*\bclass="[^"]*\barchive-item\b[^"]*"[^>]*)>([\s\S]*?)<\/a>/g)].map(m => ({
    slug: m[1].match(/href="[^"]*\/projects\/archive\/([^"/]+)/)?.[1], body:m[2],
  }));
  assert.deepEqual(cards.map(c=>c.slug), Object.keys(confirmed), prefix + ' exact six in chronology');
  for (const [slug, target] of Object.entries(retired)) {
    await absent(prefix + base + slug + '/index.html');
    assert.ok(!archive.includes(prefix + base + slug), slug + ' stale archive card');
    assert.ok(!resources.includes('/docs/projects/' + slug + '/'), slug + ' stale resource');
    const destination = prefix + base + (target ? target + '/' : '');
    for (const slash of ['', '/']) assert.ok(redirects.includes(`${prefix}${base}${slug}${slash} ${destination} 301`), slug + ' old language link');
  }
  for (const {slug,body} of cards) {
    const detail = await read(prefix + base + slug + '/index.html');
    const href = '/docs/projects/' + slug + '/';
    assert.ok(!body.includes('data-archive-published-budget-fcfa='), slug + ' worksheet amounts are not approved budgets');
    const [amount, usd, basis] = reviewedWorksheetFigures[slug];
    assert.ok(body.includes('data-archive-local-finance-fcfa="' + amount + '"') && body.includes('data-archive-local-finance-basis="' + basis + '"'), slug + ' missing qualified figure');
    assert.ok(body.includes((prefix ? 'env. ' : 'approx. ') + usd + ' USD'), slug + ' missing historical USD estimate');
    if (slug === 'city-cleanup-may-2025') {
      const normalize = value => value.replace(/[\u00a0\u202f]/g,' ');
      assert.ok(normalize(body).includes(prefix ? 'env. 50 000 FCFA' : 'approx. 50,000 FCFA'), slug + ' local amount must be marked approximate');
    }
    assert.ok(body.includes('data-state="both"'), slug + ' ToR and report availability');
    const expectedStatus = slug === 'christmas-orphanage-outreach-2025' ? 'cost-list-published' : 'budget-details-published';
    assert.ok(body.includes('data-state="' + expectedStatus + '"'), slug + ' published basis status');
    for (const html of [detail, resources]) {
      for (const kind of ['tor', 'report']) {
        const url = href + kind + '.pdf';
        const anchors = [...html.matchAll(/<a\b[^>]*>/g)].map(m => m[0]).filter(a => a.includes('href="' + url + '"'));
        assert.ok(anchors.length > 0, slug + ' missing approved ' + kind);
        if (prefix) assert.ok(anchors.some(a => a.includes('hreflang="en"')), slug + ' English-language marker ' + kind);
      }
      assert.ok(!html.includes(href + 'financial.pdf'), slug + ' no legacy standalone finance link');
      assert.doesNotMatch(html, /PRIVATE REVIEW COPY|NOT FOR PUBLICATION/, slug + ' no private release marker');
    }
    assert.doesNotMatch(body, /Budget or goal|Budget ou objectif|Compte financier\s*:\s*Publié|Financial account\s*:\s*Published/i, slug);
    const date = confirmed[slug];
    const label = new Intl.DateTimeFormat(locale,{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(date+'T00:00:00Z'));
    assert.ok(detail.replace(/\b1(?:er|ᵉʳ)(?= )/g, "1").includes(label.replace(/\b1(?:er|ᵉʳ)(?= )/g, "1")), slug + ' missing exact localized event day: ' + label);
  }
}

const rows = JSON.parse(await read('/docs/ada-public-budget-adjustments.json'));
assert.equal(rows.filter(p => Number(p.year)===2025).length, 0, 'old 2025 financial rows must not be restored or used as actuals');
for (const doc of ['ada-project-history.md','ada-public-budget-adjustments.csv','ada-public-budget-adjustments.md','ada-project-budgets.xlsx','ada-public-budget-adjustments.xlsx']) {
  const text = doc.endsWith('.xlsx')
    ? execFileSync('python3',['-c','import sys,zipfile; z=zipfile.ZipFile(sys.argv[1]); print(" ".join(z.read(n).decode("utf8","ignore") for n in z.namelist() if n.endswith(".xml")))',paths('/docs/'+doc)],{encoding:'utf8'})
    : await read('/docs/' + doc);
  assert.doesNotMatch(text,/campus-cleanup-aug-2025|idp-children-education-fund|youth-mentorship-seminar-oct-2025|Campus Environmental Cleanup|Interim Progress Report: IDP Children Education Fund|Youth Mentorship Seminar|ADA\/2025\/(?:005|007)/i, doc);
}
console.log('2025 archive verified: six released records in bilingual chronological order; exact dates, qualified figures, document pairs, and old redirects checked.');
