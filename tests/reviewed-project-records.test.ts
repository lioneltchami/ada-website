import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { applyReviewedProjectContent, reviewedProjectRecords, isProjectDocumentReviewPending } from '../src/lib/reviewed-project-records';
import { applyReleasedProjectContent } from '../src/lib/released-project-documents';
import { countProjectsUnderFinancialReview, groupProjectsByYear } from '../src/lib/project-archive';
import { hasStaticProjectDocuments } from '../src/data/organization';
import { impactMetricsFor, measurableIndicatorsFor } from '../src/data/impact';

describe('confirmed 2023 project summaries and PDF publication', () => {
 it('adds all seven activities offline and is idempotent, without misdating them to 2022', () => {
  const once=applyReviewedProjectContent([]);
  expect(once).toHaveLength(7);expect(once.every(r=>r.year===2023)).toBe(true);
  expect(applyReviewedProjectContent(once)).toEqual(once);
  const released=applyReleasedProjectContent([]);
  expect(applyReviewedProjectContent(released).filter(r=>r.year===2022)).toEqual(released);
 });
 it('preserves unrelated content while suppressing stale CMS figures, photos and downloads only for target records', () => {
  const other={slug:{current:'untouched-2024'},title:'Keep',year:2024,status:'completed' as const,demographic:'community' as const,budget:88,reportUrl:'/keep.pdf'};
  const stale={...other,slug:{current:'back-to-school-drive-2023'},year:2023,location:'Bamenda',budget:1600,beneficiaries:20,startDate:'2023-08-01',endDate:'2023-12-31',photos:[{asset:{_ref:'unapproved'}}],outcomes:['100% passed']};
  const rows=applyReviewedProjectContent([other,stale]);
  expect(rows.find(r=>r.slug.current===other.slug.current)).toEqual(other);
  const row=rows.find(r=>r.slug.current===stale.slug.current)!;
  expect(row.location).toBe('Lycée de Buea, Buea');expect(row.budget).toBeUndefined();expect(row.beneficiaries).toBeUndefined();expect(row.startDate).toBe('2023-08-26');
  expect(row.photos).toEqual([]);expect(row.outcomes).toEqual([]);expect(row.reportUrl).toBeUndefined();
  expect(row.financialReviewNote).toContain('240,000');expect(row.financialReviewNote).toContain('230,000');expect(row.financialReviewNote).toContain('not an account balance');
 });
 it('keeps the two February activities separate, with the outreach on race day',()=>{
  const feb=reviewedProjectRecords.filter(p=>p.slug.endsWith('feb-2023'));expect(feb).toHaveLength(2);
  expect(feb[0].startDate).toBe('2023-02-04');expect(feb[1].startDate).toBe('2023-02-25');
  for(const p of feb){expect(p.financialNote).toContain('50,000');expect(p.financialNote).toContain('leaving no project balance');expect(p.financialNote).not.toContain('5,000');}
 });
 it('corrects March gathering and reconciles May using item sums without double-counting transfers',()=>{
  const march=reviewedProjectRecords.find(p=>p.slug==='womens-day-home-visits-mar-2023')!;
  expect(march.startDate).toBe('2023-03-11');expect(march.description).toContain('church');expect(march.financialNote).toContain('245,000');
  const may=reviewedProjectRecords.find(p=>p.slug==='city-cleanup-may-2023')!;
  for(const value of ['100,000','94,400','1,500','95,900','4,100','historical project figure','not the current account balance','item sum takes precedence']) expect(may.financialNote).toContain(value);
  for(const value of ['100 000','94 400','1 500','95 900','4 100','montant historique du projet','pas le solde actuel du compte','somme des postes prévaut']) expect(may.financialNoteFr).toContain(value);
  expect(may.financialNote).not.toMatch(/not yet been reconciled|95,000 FCFA spent|5,000 FCFA for other needs/);
  expect(may.financialNoteFr).not.toMatch(/n’ont pas encore été rapprochés|95 000 FCFA dépensés|5 000 FCFA pour d’autres besoins/);
  expect(94400 + 1500).toBe(95900);expect(100000 - 95900).toBe(4100);
  const mapped=applyReviewedProjectContent([]);
  expect(mapped.find(p=>p.slug.current===may.slug)?.financialReviewTitle).toBe("Financial record");
  expect(mapped.find(p=>p.slug.current===may.slug)?.financialReviewTitleFr).toBe("Relevé financier");
  for(const p of mapped){expect(p.financialReviewTitle).toBe('Financial record');expect(p.financialReviewTitleFr).toBe('Relevé financier');}
 });
 it('excludes the released financial summaries from the under-review count',()=>{
  const rows=applyReviewedProjectContent([]);
  expect(countProjectsUnderFinancialReview(rows)).toBe(0);
  const may=rows.find(r=>r.slug.current==='city-cleanup-may-2023')!;
  expect(may.financialReviewTitle).toBe('Financial record');
  expect(may.financialReviewTitleFr).toBe('Relevé financier');
  expect(may.torUrl).toBeUndefined();
  expect(may.reportUrl).toBeUndefined(); // static URLs attach in the archive loader
  expect(may.documentReviewNote).toBeUndefined();
 });
 it('releases exactly the two reviewed PDFs for each of seven projects',()=>{
  const releasedSlug='city-cleanup-may-2023';
  for(const p of reviewedProjectRecords) {
   expect(isProjectDocumentReviewPending(p.slug)).toBe(false);
   expect(hasStaticProjectDocuments(p.slug)).toBe(true);
   expect(fs.readdirSync(`public/docs/projects/${p.slug}`).sort()).toEqual(['report.pdf','tor.pdf']);
  }
  const resources=groupProjectsByYear([]).find(g=>g.year===2023);
  expect(resources?.projectCount).toBe(7);
  expect(JSON.stringify(resources)).toContain(releasedSlug);
  const redirects=fs.readFileSync('public/_redirects','utf8');
  for(const slug of ['back-to-school-drive-2023',releasedSlug,'womens-day-home-visits-mar-2023'])for(const kind of ['tor','report','financial']){
   for(const ext of ['md','pdf']) {
    const isRelease=kind!=='financial'&&ext==='pdf';
    expect(fs.existsSync(`public/docs/projects/${slug}/${kind}.${ext}`)).toBe(isRelease);
    expect(redirects.includes(`/docs/projects/${slug}/${kind}.${ext} /projects/archive/${slug}/ 302`)).toBe(!isRelease);
   }
  }
 });
 it('does not repeat unsupported enrollment, retention or exam outcomes as measured education impact',()=>{
  for(const locale of ['en','fr'] as const){
   expect(JSON.stringify(impactMetricsFor(locale))).not.toMatch(/Bamenda 2023|back-to-school-drive-2023\/report.pdf|100%/);
   expect(JSON.stringify(measurableIndicatorsFor(locale))).not.toMatch(/100%|retention|rétention/);
  }
 });
 it('replaces three legacy financial rows with seven qualified summaries, preserving non-superseded non-2023 rows',()=>{
  const current=JSON.parse(fs.readFileSync('public/docs/ada-public-budget-adjustments.json','utf8'));
  const before=JSON.parse(execFileSync('git',['show','HEAD:public/docs/ada-public-budget-adjustments.json'],{encoding:'utf8'}));
  const retiredSchoolRows = new Set(['ADA/2024/003', 'ADA/2024/004']);
  expect(current.every((r:any)=>!retiredSchoolRows.has(r.reference))).toBe(true);
  expect(current.filter((r:any)=>r.year!==2023)).toEqual(before.filter((r:any)=>r.year!==2023&&!retiredSchoolRows.has(r.reference)));
  const reviewed=current.filter((r:any)=>r.year===2023);expect(reviewed).toHaveLength(7);
  expect(reviewed.every((r:any)=>r.archive_actual===null&&r.archive_approved===null&&r.public_target===null)).toBe(true);
 });
 it('keeps private proposed category prices and fabricated receipts out of the public ledger',()=>{
  const ledger=fs.readFileSync('public/docs/ada-project-history.md','utf8');
  const part=ledger.split('### 2023')[1].split('### 2022')[0];
  expect(part).not.toMatch(/940,000|960,000|345,000|REC\d|100%|Bamenda/);
  expect(part).toContain('project documents available');
 });
});
