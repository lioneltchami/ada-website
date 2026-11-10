import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { hasReleasedProjectDocumentSet, hasStaticProjectDocuments, projectDocumentPaths } from '../src/data/organization';
import manifest from '../config/project-document-releases.json';
import { applyReleasedProjectContent } from '../src/lib/released-project-documents';
import { groupProjectsByYear } from '../src/lib/project-archive';

describe('approved 2022 document release', () => {
 it('publishes exactly six complete reviewed two-document sets', () => {
  expect(manifest.projects).toHaveLength(6);
  for (const p of manifest.projects) {
   expect(hasReleasedProjectDocumentSet(p.slug)).toBe(true);
   expect(Object.values(p.approvals).every(Boolean)).toBe(true);
   expect(Object.values(p.documents).every(d => !d.reviewOnly)).toBe(true);
   const paths = projectDocumentPaths(p.slug);
   expect(paths.financial).toBeUndefined();
   expect(fs.existsSync('public'+paths.tor)).toBe(true);
   expect(fs.existsSync('public'+paths.report)).toBe(true);
   expect(fs.existsSync(`public/docs/projects/${p.slug}/financial.pdf`)).toBe(false);
   expect(fs.existsSync(`public/docs/projects/${p.slug}/financial.md`)).toBe(false);
  }
  expect(hasStaticProjectDocuments('school-visit-may-2022')).toBe(true);
 });
 it('retains legacy three-document behavior outside activated releases', () => {
  expect(projectDocumentPaths('back-to-school-drive-2023').financial).toContain('/financial.pdf');
 });
 it('keeps the new May school slug distinct from the withdrawn cleanup', () => {
  expect(manifest.projects.map(p=>p.slug)).toContain('school-visit-may-2022');
  expect(manifest.projects.map(p=>p.slug)).not.toContain('school-visit-mentorship-may-2022');
 });
 it('restores only approved narrative, stripping stale USD, count and photo claims', () => {
  const project=manifest.projects[0];
  const rows=applyReleasedProjectContent([{slug:{current:project.slug},title:'old',year:2022,status:'completed',demographic:'orphans',budget:999,beneficiaries:900,photos:[{asset:{_ref:'private-photo'}}]}]);
  const row=rows.find(r=>r.slug.current===project.slug)!;
  expect(row.title).toBe(project.archive.title);
  expect(row.budget).toBeUndefined();expect(row.beneficiaries).toBeUndefined();expect(row.photos).toEqual([]);
  expect(row.startDate).toBe('2022-02-16');
  expect(rows).toHaveLength(6);
 });
 it('populates Resources with all six approved bilingual titles even without CMS', () => {
  const groups=groupProjectsByYear([]);
  const rows=groups.find(g=>g.year===2022)!.demographics.flatMap(g=>g.projects);
  expect(rows).toHaveLength(6);
  for(const p of manifest.projects) expect(rows.find(r=>r.slug===p.slug)).toMatchObject({title:p.archive.title,titleFr:p.archive.titleFr,demographic:p.archive.demographic});
  const source=fs.readFileSync('src/components/resources/DocumentLibrary.astro','utf8');
  expect(source).toContain('projectDocumentPaths(project.slug).financial &&');
  expect(source).not.toContain('/financial.pdf');
 });
 it('preserves remembered school-name qualifiers in both website languages', () => {
  for(const slug of ['school-visit-may-2022','back-to-school-sep-2022']) {
   const p=manifest.projects.find(p=>p.slug===slug)!;
   expect(p.archive.location).toContain('remembered name');
   expect(p.archive.locationFr).toContain('nom rappelé');
  }
 });
});

describe('confirmed May 2022 school visit date', () => {
 it('uses Wednesday 11 May in dates and both languages without changing other visits', () => {
  const may=manifest.projects.find(p=>p.slug==='school-visit-may-2022')!;
  expect([may.archive.startDate,may.archive.endDate]).toEqual(['2022-05-11','2022-05-11']);
  const day=new Date(`${may.archive.startDate}T12:00:00Z`);
  expect(new Intl.DateTimeFormat('en',{weekday:'long',timeZone:'UTC'}).format(day)).toBe('Wednesday');
  expect(may.archive.description).toContain('Wednesday, 11 May 2022');
  expect(may.archive.descriptionFr).toContain('mercredi 11 mai 2022');
  expect(manifest.projects.filter(p=>p.slug!==may.slug).map(p=>[p.archive.startDate,p.archive.endDate])).toEqual([
   ['2022-02-16','2022-02-16'],['2022-03-12','2022-03-12'],[null,null],['2022-08-12','2022-08-12'],['2022-12-22','2022-12-22'],
  ]);
 });
});
