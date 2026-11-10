import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import finance from '../config/project-finance-2022.json';
import releases from '../config/project-document-releases.json';
const docs=path.resolve('public/docs');
const read=(relative:string)=>fs.readFileSync(path.join(docs,relative),'utf8');
const plain=(relative:string)=>read(relative).replace(/\s+/g,' ');

describe('evidence-qualified historical finance',()=>{
 it('preserves 2021 sent amount, estimated spend and unverified difference distinctly',()=>{
  const f=read('projects/first-widow-home-visits-2021/financial.md');
  for(const value of ['120,000 CFA francs was sent','about 110,000 CFA francs was spent','approximately 10,000 CFA francs in withdrawal costs','not a verified cash balance','approximately US$209']) expect(f).toContain(value);
  expect(f).not.toMatch(/85,000 CFA|35,000 CFA/);
 });
 it('separates February funding and reconstructed allocation from verified payments',()=>{
  const f=plain('projects/school-supply-distribution-feb-2022/report.md');
  expect(f).toContain('215,000');expect(f).toContain('5,000');expect(f).toContain('10,000 to 15,000');
  expect(f).toMatch(/not independently verified|not verified/i);expect(f).toMatch(/reconstructed allocation/i);
  expect(f).not.toMatch(/300,000 CFA|280,000 CFA/);
  const row=finance.find(p=>p.slug==='school-supply-distribution-feb-2022')!;
  expect(row.reported_funding).toBe(215000);expect(row.reported_spending).toBeNull();expect(row.historical_balance).toBeNull();
  expect(row.lines.map(l=>l.amount_xaf)).toEqual([60000,55000,25000,20000,15000,20000,15000,5000]);
 });
 it('keeps March approximate reach and goods-only support without inventing payments',()=>{
  const f=plain('projects/widow-support-food-cash-mar-2022/report.md');
  for(const amount of ['220,000','205,000','5,000','10,000'])expect(f).toContain(amount);
  expect(f).toContain('approximately 20 widows');expect(f).toContain('goods only, not cash assistance');
  expect(f).toContain('not independently verified payments');
  expect(f).not.toMatch(/480,000|460,000|15 cash envelopes|95\.8%|Thai rice|5L bottle/);
  const row=finance.find(p=>p.slug==='widow-support-food-cash-mar-2022')!;
  expect(row.reported_spending).toBeNull();expect(row.historical_balance).toBeNull();
 });
 it('keeps all detailed schedules with arithmetic checks and explicit evidence bases',()=>{
  expect(finance).toHaveLength(6);
  for(const row of finance){
   expect(row.currency).toBe('XAF');expect(row.current_account_balance).toBeNull();
   expect(row.lines.reduce((s,l)=>s+l.amount_xaf,0)).toBe(row.schedule_total);
   expect(row.lines.every(l=>Boolean(l.basis))).toBe(true);
   expect(plain(`projects/${row.slug}/report.md`)).toMatch(/not.*verified|not an audited|not independently audited/i);
  }
 });
 it('does not treat May in-kind support or July funding minus plan as cash balances',()=>{
  const may=finance.find(p=>p.slug==='school-visit-may-2022')!;
  expect(may.reported_funding).toBeNull();expect(may.reported_spending).toBeNull();expect(may.historical_balance).toBeNull();
  expect(may.lines.filter(l=>l.kind==='cash allocation').reduce((s,l)=>s+l.amount_xaf,0)).toBe(165000);
  expect(may.schedule_total).toBe(180000);expect(may.note).toContain('15,000 is not a cash balance');
  const july=finance.find(p=>p.slug==='idp-girls-baking-training-jul-2022')!;
  expect(july.reported_funding).toBe(400000);expect(july.schedule_total).toBe(342750);expect(july.historical_balance).toBeNull();
  expect(july.note).toContain('57,250 is funding less plan, not a confirmed balance');
 });
 it('preserves August historical account while distinguishing it from current cash',()=>{
  const row=finance.find(p=>p.slug==='back-to-school-sep-2022')!;
  expect(row.reported_funding).toBe(220000);expect(row.reported_spending).toBe(205000);expect(row.historical_balance).toBe(15000);
  const f=plain(`projects/${row.slug}/report.md`);
  expect(f).toContain("not today's account balance");expect(f).toContain('not an audited or independently receipt-verified statement');
 });
 it('excludes reconstructed amounts from aggregate approved or actual totals',()=>{
  const history=read('ada-project-history.md');
  expect(history).toContain('6 evidence-qualified project accounts');
  expect(history).toContain('Blank summary cells do not mean zero spending');
  expect(history).not.toMatch(/Approved 120,000 CFA; Actual\/Spent 85,000 CFA|Approved 300,000 CFA; Actual\/Spent 280,000 CFA/);
  for(const p of releases.projects){
   const start=history.indexOf(`#### ${p.archive.title}`);expect(start).toBeGreaterThanOrEqual(0);
   const end=history.indexOf('\n#### ',start+1);const section=history.slice(start,end>0?end:undefined);
   expect(section).toContain('Detailed evidence-qualified account');expect(section).not.toContain('- Outcomes:');
   expect(section).toContain(`/docs/projects/${p.slug}/report.pdf`);
  }
 });
 it('keeps item categories without inventing quantities or identical kits',()=>{
  const f=plain('projects/school-supply-distribution-feb-2022/report.md');
  const t=plain('projects/school-supply-distribution-feb-2022/tor.md');
  for(const word of ['exercise books','pens','mathematical sets','buckets','utensils']){expect(f).toContain(word);expect(t).toContain(word);}
  expect(t).toContain('We do not specify a target headcount or equal packages');
  expect(f+t).not.toMatch(/Purchase 20 colorful|Purchase 20 pink|20 buckets, 20 bags|brought the project under budget/);
 });
 it('accounts for all public budget statuses without treating qualified accounts as cap adjustments',()=>{
  const rows=JSON.parse(read('ada-public-budget-adjustments.json'));
  expect(rows).toHaveLength(23);
  expect(rows.filter((r:any)=>r.status==='under review').map((r:any)=>r.project)).toEqual(['First Widow Home Visits']);
  expect(rows.filter((r:any)=>r.status==='ok')).toHaveLength(3);
  expect(rows.filter((r:any)=>r.status==='adjusted')).toHaveLength(6);
  expect(rows.filter((r:any)=>r.status==='reported; document review pending')).toHaveLength(7);
  const qualified=rows.filter((r:any)=>r.status==='reported / reconstructed; see basis');expect(qualified).toHaveLength(6);
  expect(qualified.every((r:any)=>r.archive_approved===null && r.archive_actual===null && r.public_target===null && r.adjustment_needed===null)).toBe(true);
  const renderer=fs.readFileSync('scripts/render_public_budget_adjustments_pdf.mjs','utf8');
  expect(renderer).toContain('const basisRows = [...underReviewRows, ...qualifiedRows]');
  expect(renderer).toContain('okRows.length + adjustedRows.length + basisRows.length !== rows.length');
  expect(renderer).not.toContain('row.archive_actual || row.archive_approved');
 });
});
