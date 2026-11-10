import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { applyReviewedProjectContent, reviewedProjectRecords, isProjectDocumentReviewPending } from '../src/lib/reviewed-project-records';
import { applyReleasedProjectContent } from '../src/lib/released-project-documents';
import { groupProjectsByYear } from '../src/lib/project-archive';
import { hasStaticProjectDocuments } from '../src/data/organization';
import { impactMetricsFor, measurableIndicatorsFor } from '../src/data/impact';

describe('confirmed 2023 project summaries before PDF publication', () => {
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
  expect(row.location).toBe('Lycée de Buea, Buea');expect(row.budget).toBeUndefined();expect(row.beneficiaries).toBeUndefined();expect(row.startDate).toBeUndefined();
  expect(row.photos).toEqual([]);expect(row.outcomes).toEqual([]);expect(row.reportUrl).toBeUndefined();
  expect(row.financialReviewNote).toContain('240,000');expect(row.financialReviewNote).toContain('230,000');expect(row.financialReviewNote).toContain('not a confirmed account balance');
 });
 it('keeps February activities separate and does not copy the race date into the outreach date',()=>{
  const feb=reviewedProjectRecords.filter(p=>p.slug.endsWith('feb-2023'));expect(feb).toHaveLength(2);
  expect(feb[0].startDate).toBe('2023-02-11');expect(feb[1].startDate).toBeNull();
  for(const p of feb){expect(p.financialNote).toContain('50,000');expect(p.financialNote).toContain('approximately 5,000');}
 });
 it('corrects March gathering and preserves the unresolved May financial accounts',()=>{
  const march=reviewedProjectRecords.find(p=>p.slug==='womens-day-home-visits-mar-2023')!;
  expect(march.startDate).toBe('2023-03-11');expect(march.description).toContain('church');expect(march.financialNote).toContain('245,000');
  const may=reviewedProjectRecords.find(p=>p.slug==='city-cleanup-may-2023')!;
  for(const value of ['100,000','94,400','1,500','95,900','95,000','5,000','not yet been reconciled']) expect(may.financialNote).toContain(value);
  expect(may.financialNote).not.toContain('4,100');
 });
 it('withholds pending document links without hiding the project, with exact redirects for privately preserved originals',()=>{
  for(const p of reviewedProjectRecords){expect(isProjectDocumentReviewPending(p.slug)).toBe(true);expect(hasStaticProjectDocuments(p.slug)).toBe(false);}
  expect(groupProjectsByYear(reviewedProjectRecords.map(p=>({...p,demographic:p.demographic as 'community'}))).find(g=>g.year===2023)).toBeUndefined();
  for(const slug of ['back-to-school-drive-2023','city-cleanup-may-2023','womens-day-home-visits-mar-2023'])for(const kind of ['tor','report','financial']){
   for(const ext of ['md','pdf'])expect(fs.existsSync(`public/docs/projects/${slug}/${kind}.${ext}`)).toBe(false);
   expect(fs.readFileSync('public/_redirects','utf8')).toContain(`/docs/projects/${slug}/${kind}.pdf /projects/archive/${slug}/ 302`);
  }
 });
 it('does not repeat unsupported enrollment, retention or exam outcomes as measured education impact',()=>{
  for(const locale of ['en','fr'] as const){
   expect(JSON.stringify(impactMetricsFor(locale))).not.toMatch(/Bamenda 2023|back-to-school-drive-2023\/report.pdf|100%/);
   expect(JSON.stringify(measurableIndicatorsFor(locale))).not.toMatch(/100%|retention|rétention/);
  }
 });
 it('replaces three legacy financial rows with seven qualified summaries, preserving all non-2023 rows',()=>{
  const current=JSON.parse(fs.readFileSync('public/docs/ada-public-budget-adjustments.json','utf8'));
  const before=JSON.parse(execFileSync('git',['show','HEAD:public/docs/ada-public-budget-adjustments.json'],{encoding:'utf8'}));
  expect(current.filter((r:any)=>r.year!==2023)).toEqual(before.filter((r:any)=>r.year!==2023));
  const reviewed=current.filter((r:any)=>r.year===2023);expect(reviewed).toHaveLength(7);
  expect(reviewed.every((r:any)=>r.archive_actual===null&&r.archive_approved===null&&r.public_target===null)).toBe(true);
 });
 it('keeps private proposed category prices and fabricated receipts out of the public ledger',()=>{
  const ledger=fs.readFileSync('public/docs/ada-project-history.md','utf8');
  const part=ledger.split('### 2023')[1].split('### 2022')[0];
  expect(part).not.toMatch(/940,000|960,000|345,000|REC\d|100%|Bamenda/);
  expect(part).toContain('corrected documents under review');
 });
});
