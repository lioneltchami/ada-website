import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { verifyDocumentReleases } from './verify-project-document-releases.mjs';
const source = JSON.parse(await fs.readFile(new URL('../config/project-document-releases.json', import.meta.url)));
async function fixture(t, change) {
 const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ada-release-'));
 t.after(() => fs.rm(root,{recursive:true,force:true}));
 const manifest = structuredClone(source);
 for (const project of manifest.projects) {
  project.status="staged";
  for (const k in project.approvals) project.approvals[k]=false;
  for (const doc of Object.values(project.documents)) doc.reviewOnly=true;
 }
 await change(manifest,root);
 await fs.mkdir(path.join(root,'config'));
 await fs.writeFile(path.join(root,'config/project-document-releases.json'),JSON.stringify(manifest));
 return root;
}
test('staging exposes no released documents',async t=>assert.equal((await verifyDocumentReleases(await fixture(t,async()=>{}))).size,0));
test('release fails without privacy approval',async t=>{
 const root=await fixture(t,async m=>{m.projects[0].status='released';for(const doc of Object.values(m.projects[0].documents))doc.reviewOnly=false;});
 await assert.rejects(verifyDocumentReleases(root),/privacy/);
});
test('CFA cannot be interpreted as USD',async t=>{
 const root=await fixture(t,async m=>m.projects[0].currency='USD');
 await assert.rejects(verifyDocumentReleases(root),/currency/);
});
test('withdrawn cleanup cannot be reinstated as school release',async t=>{
 const root=await fixture(t,async m=>m.projects[2].slug='school-visit-mentorship-may-2022');
 await assert.rejects(verifyDocumentReleases(root),/withdrawn/);
});
test('approved reviewed files preserved; mutations and stale financials rejected',async t=>{
 let dir;
 const root=await fixture(t,async (m,root)=>{
  const p=m.projects[0];p.status='released';for(const k in p.approvals)p.approvals[k]=true;
  dir=path.join(root,'public/docs/projects',p.slug);await fs.mkdir(dir,{recursive:true});
  for(const kind of ['tor','report']){
   const bytes=Buffer.from('%PDF-test fixture '+kind);
   await fs.writeFile(path.join(dir,kind+'.pdf'),bytes);
   p.documents[kind].sha256=createHash('sha256').update(bytes).digest('hex');
   p.documents[kind].reviewOnly=false;
  }
 });
 assert.equal((await verifyDocumentReleases(root)).size,1);
 await fs.writeFile(path.join(dir,'financial.pdf'),'%PDF-stale');
 await assert.rejects(verifyDocumentReleases(root),/stale standalone/);
 await fs.unlink(path.join(dir,'financial.pdf'));
 await fs.appendFile(path.join(dir,'report.pdf'),'changed');
 await assert.rejects(verifyDocumentReleases(root),/changed/);
});

test('superseded May date cannot enter staged or released output',async t=>{
 const root=await fixture(t,async m=>m.projects.find(p=>p.slug==='school-visit-may-2022').archive.startDate='2022-05-05');
 await assert.rejects(verifyDocumentReleases(root),/confirmed 2022-05-11/);
});

test('review-footed PDFs are blocked even if other approvals are set',async t=>{
 const root=await fixture(t,async m=>{
  const p=m.projects[0];p.status='released';for(const k in p.approvals)p.approvals[k]=true;
  for(const doc of Object.values(p.documents))doc.reviewOnly=true;
 });
 await assert.rejects(verifyDocumentReleases(root),/Private review PDFs cannot be released/);
});
