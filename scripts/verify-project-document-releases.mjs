import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

export async function verifyDocumentReleases(root) {
  const manifest = JSON.parse(await fs.readFile(path.join(root, 'config/project-document-releases.json'), 'utf8'));
  if (manifest.version !== 1 || manifest.year !== 2022 || manifest.projects.length !== 6) throw new Error('Invalid 2022 release manifest');
  const released = new Set();
  const seen = new Set();
  for (const project of manifest.projects) {
    const { slug } = project;
    if (!/^[a-z0-9-]+$/.test(slug) || seen.has(slug) || slug === 'school-visit-mentorship-may-2022') throw new Error(`Invalid/withdrawn release slug: ${slug}`);
    seen.add(slug);
    if (slug === 'school-visit-may-2022' && (project.archive?.startDate !== '2022-05-11' || project.archive?.endDate !== '2022-05-11')) throw new Error('May school visit must use confirmed 2022-05-11 date');
    if (project.currency !== 'XAF') throw new Error(`Release currency must remain XAF; Sanity budget is USD: ${slug}`);
    if (!['staged', 'released'].includes(project.status)) throw new Error(`Invalid release status: ${slug}`);
    if (project.status === 'staged') {
      // Staged entries do not create routes or public placeholders. Legacy files remain unchanged.
      continue;
    }
    if (Object.values(project.documents).some(doc => doc.reviewOnly === true)) throw new Error(`Private review PDFs cannot be released: ${slug}`);
    for (const approval of ['privacy', 'financialEvidence', 'translation', 'visualQa']) {
      if (project.approvals?.[approval] !== true) throw new Error(`Missing ${approval} approval: ${slug}`);
    }
    if (Object.keys(project.documents).sort().join(',') !== 'report,tor') throw new Error(`Expected ToR and report including financials: ${slug}`);
    for (const kind of ['tor', 'report']) {
      const expected = project.documents[kind]?.sha256;
      if (!/^[a-f0-9]{64}$/.test(expected || '')) throw new Error(`Missing reviewed checksum: ${slug}/${kind}`);
      const bytes = await fs.readFile(path.join(root, 'public/docs/projects', slug, `${kind}.pdf`));
      if (bytes.subarray(0, 5).toString() !== '%PDF-') throw new Error(`Not a PDF: ${slug}/${kind}`);
      if (createHash('sha256').update(bytes).digest('hex') !== expected) throw new Error(`Reviewed PDF changed: ${slug}/${kind}`);
    }
    // No stale standalone financial PDF may survive this two-document release.
    try {
      await fs.access(path.join(root, 'public/docs/projects', slug, 'financial.pdf'));
      throw new Error(`Remove stale standalone financial.pdf before release: ${slug}`);
    } catch (error) { if (error.code !== 'ENOENT') throw error; }
    released.add(slug);
  }
  return released;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const released = await verifyDocumentReleases(root);
  console.log(`Document release guard passed: ${released.size} released, remaining staged (not published).`);
}
