import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export async function verifyReviewedProjectRecords(root, checkDist = false) {
 const data=JSON.parse(await fs.readFile(path.join(root,'config/project-records-2023.json'),'utf8'));
 assert.equal(data.projects.length,7,'2023 contains exactly seven confirmed activities');
 assert.equal(new Set(data.projects.map(p=>p.slug)).size,7,'No duplicate 2023 records');
 const redirects=await fs.readFile(path.join(root,'public/_redirects'),'utf8');
 for(const p of data.projects) {
  assert.equal(p.year,2023);assert.equal(p.documentStatus,'review-pending');
  assert.ok(p.title && p.titleFr && p.description && p.descriptionFr && p.financialNote && p.financialNoteFr);
  if(checkDist)for(const prefix of ['','fr/']) {
   const html=await fs.readFile(path.join(root,`dist/client/${prefix}projects/archive/${p.slug}/index.html`),'utf8');
   assert.ok(!html.includes(`/docs/projects/${p.slug}/`),'Pending project page must not link obsolete downloads');
  }
  if(!p.legacyDocumentSet)continue;
  for(const kind of ['tor','report','financial'])for(const ext of ['pdf','md']) {
   const source=`/docs/projects/${p.slug}/${kind}.${ext}`;
   await assert.rejects(fs.access(path.join(root,'public',source)),'Superseded public source must remain absent: '+source);
   if(checkDist) await assert.rejects(fs.access(path.join(root,'dist/client',source)),'Superseded dist file must remain absent: '+source);
   assert.ok(redirects.split('\n').includes(`${source} /projects/archive/${p.slug}/ 302`),'Exact temporary redirect required: '+source);
  }
 }
 console.log(`Reviewed2023 guard passed: seven factual summaries;18 superseded sources absent${checkDist?';14 bilingual routes checked':''}.`);
}
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url))await verifyReviewedProjectRecords(process.cwd(),process.argv.includes('--dist'));
