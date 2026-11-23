import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const allowedReleases = new Set(['city-cleanup-may-2023']);
const approvedDocumentKinds = ['report', 'tor'];

export async function verifyReviewedProjectRecords(root, checkDist = false) {
 const data=JSON.parse(await fs.readFile(path.join(root,'config/project-records-2023.json'),'utf8'));
 assert.equal(data.projects.length,7,'2023 contains exactly seven confirmed activities');
 assert.equal(new Set(data.projects.map(p=>p.slug)).size,7,'No duplicate 2023 records');
 const redirects=await fs.readFile(path.join(root,'public/_redirects'),'utf8');
 const publishedDirectories = checkDist ? ['public', 'dist/client'] : ['public'];
 const generatedResourcePages = checkDist ? await Promise.all(['', 'fr/'].map(prefix =>
  fs.readFile(path.join(root,`dist/client/${prefix}resources/index.html`),'utf8')
 )) : [];
 const released = new Set();
 for(const p of data.projects) {
  assert.equal(p.year,2023);
  const allowed = allowedReleases.has(p.slug);
  assert.equal(p.documentStatus,allowed ? 'released' : 'review-pending','Only explicitly cleared 2023 projects can release documents');
  assert.ok(p.title && p.titleFr && p.description && p.descriptionFr && p.financialNote && p.financialNoteFr);
  if(allowed) {
   released.add(p.slug);
   assert.deepEqual(Object.keys(p.documents || {}).sort(),approvedDocumentKinds,'Exactly the approved report and ToR are permitted');
  } else {
   assert.equal(p.documents,undefined,'Pending project cannot declare public documents');
  }
  const assetDir = `/docs/projects/${p.slug}/`;
  for (const directory of publishedDirectories) {
   const fullDir = path.join(root,directory,assetDir);
   const files = await fs.readdir(fullDir).catch(error => {
    if (error.code === 'ENOENT') return [];
    throw error;
   });
   assert.deepEqual(files.sort(),allowed ? approvedDocumentKinds.map(kind=>`${kind}.pdf`) : [],'No extra sources or public drafts: '+p.slug);
   if (allowed) for (const kind of approvedDocumentKinds) {
    const bytes=await fs.readFile(path.join(fullDir,`${kind}.pdf`));
    assert.equal(bytes.subarray(0,5).toString(),'%PDF-','Exact released files must be PDFs');
    assert.match(p.documents[kind],/^[a-f0-9]{64}$/,'Require approved release checksums');
    assert.equal(createHash('sha256').update(bytes).digest('hex'),p.documents[kind],'Released PDF checksum mismatch: '+p.slug+'/'+kind);
   }
  }
  if(checkDist)for(const prefix of ['','fr/']) {
   const html=await fs.readFile(path.join(root,`dist/client/${prefix}projects/archive/${p.slug}/index.html`),'utf8');
   if(allowed)for(const kind of approvedDocumentKinds) {
    assert.ok(html.includes(`${assetDir}${kind}.pdf`),'Released project detail must link the reviewed PDF: '+prefix+p.slug+'/'+kind);
   } else {
    assert.ok(!html.includes(assetDir),'Pending project page must not link obsolete downloads');
   }
  }
  for(const html of generatedResourcePages) {
   for(const kind of approvedDocumentKinds) assert.equal(
    html.includes(`${assetDir}${kind}.pdf`),allowed,'Resources must list only the reviewed 2023 releases'
   );
   assert.ok(!html.includes(`${assetDir}financial.pdf`),'The report is the financial document for reviewed 2023 projects');
  }
  if(!p.legacyDocumentSet)continue;
  for(const kind of ['tor','report','financial'])for(const ext of ['pdf','md']) {
   const source=`${assetDir}${kind}.${ext}`;
   const exactRedirect=`${source} /projects/archive/${p.slug}/ 302`;
   if (allowed && approvedDocumentKinds.includes(kind) && ext === 'pdf') {
    assert.ok(!redirects.split('\n').includes(exactRedirect),'Approved PDFs must not redirect to the project page');
   } else {
    assert.ok(redirects.split('\n').includes(exactRedirect),'Exact temporary redirect required: '+source);
   }
  }
 }
 assert.equal(released.size,allowedReleases.size,'Every allowlisted release must appear exactly once');
 console.log(`Reviewed2023 guard passed: seven factual summaries; ${released.size} exact two-document release; six projects remain private${checkDist?'; 14 bilingual routes checked':''}.`);
 return released;
}
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url))await verifyReviewedProjectRecords(process.cwd(),process.argv.includes('--dist'));
