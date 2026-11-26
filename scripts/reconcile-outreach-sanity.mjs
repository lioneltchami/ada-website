#!/usr/bin/env node
/** Production Sanity reconciliation. No writes by default; read docs/outreach-sanity-migration.md first. */
import { createClient } from '@sanity/client';
import { createHash, randomUUID } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isDeepStrictEqual as same } from 'node:util';

const root = fileURLToPath(new URL('../', import.meta.url));
const load = (p) => JSON.parse(readFileSync(path.join(root, p), 'utf8'));
const sha = (algo, data) => createHash(algo).update(data).digest('hex');
const naming = load('config/outreach-naming.json');
const reviewed2023 = load('config/project-records-2023.json').projects;
const year2023 = new Map(reviewed2023.map((x) => [x.slug, x]));
const missingAllowed = new Set([
  'christmas-giving-dec-2023', 'girls-day-oct-2023',
  'mountain-race-outreach-feb-2023', 'youth-day-snacks-feb-2023',
]);
const categoryBySeries = {
  widows: 'widows', schoolVisit: 'education', backToSchool: 'education',
  baking: 'girls-young-women', girlsDay: 'girls-young-women', girlsDignity: 'girls-young-women',
  christmas: 'christmas', youthDay: 'community-events', mountainRace: 'community-events',
  communityCleanup: 'community-events', schoolCleanup: 'community-events', prenatalCare: 'maternal-baby',
};
const fileFields = { tor: 'termsOfReference', report: 'finalReport', financial: 'financialReport' };
const file = (id) => ({ _type: 'file', asset: { _type: 'reference', _ref: id } });
const [mode, arg, approval, ...extra] = process.argv.slice(2);
if (extra.length || (mode && !['--apply', '--rollback'].includes(mode)) ||
    (mode && (!arg || approval !== '--reviewed'))) {
  throw Error('Usage: node scripts/reconcile-outreach-sanity.mjs [--apply <new-private-backup-directory> --reviewed | --rollback <existing-backup-directory> --reviewed]');
}
if (!process.env.SANITY_TOKEN) throw Error('SANITY_TOKEN is required (read-only rights suffice for the default plan).');
const client = createClient({
  projectId: 'rj2m21gk', dataset: 'production', apiVersion: '2026-11-26',
  token: process.env.SANITY_TOKEN, useCdn: false, perspective: 'raw',
});
const isEditableId = (id) => !id.startsWith('drafts.') && !id.startsWith('versions.');
const scope = (entry) =>
  isEditableId(entry._id) && ['project', 'projectRecord'].includes(entry._type) &&
  Object.hasOwn(naming.outreaches, entry.slug?.current);
const readDocs = () => client.fetch('*[_type in ["project", "projectRecord"] && slug.current in $slugs]', {
  slugs: Object.keys(naming.outreaches),
});
const writeJson = (dir, name, value) =>
  writeFileSync(path.join(dir, name), JSON.stringify(value, null, 2) + '\n', { mode: 0o600, flag: 'wx' });
const old = (d, keys) => Object.fromEntries(keys.filter((k) => Object.hasOwn(d, k)).map((k) => [k, d[k]]));

async function rollback(dir) {
  const read = (p) => JSON.parse(readFileSync(path.join(dir, p), 'utf8'));
  const before = read('before.json');
  const after = read('after.json');
  if (before.dataset !== 'production' || before.projectId !== 'rj2m21gk' ||
      after.changes.length !== before.changes.length) throw Error('Backup is not from this migration.');
  const current = new Map((await readDocs()).map((d) => [d._id, d]));
  const tx = client.transaction();
  const deletes = [];
  for (const [i, b] of before.changes.entries()) {
    const d = current.get(b._id);
    const a = after.changes[i];
    if (!d || !scope(d) || b._id !== a._id || d._rev !== a._rev) {
      throw Error(`Rollback halted: ${b._id} was edited since the migration or is out of scope.`);
    }
    if (b.create) {
      if (!missingAllowed.has(d.slug.current)) throw Error('Refusing to delete an unexpected record.');
      // Use a revision assertion in the same atomic transaction as deletion.
      deletes.push({ d, title: d.title });
    } else {
      const unset = b.keys.filter((k) => !Object.hasOwn(b.fields, k));
      tx.patch(d._id, (p) => {
        p = p.ifRevisionId(d._rev);
        if (Object.keys(b.fields).length) p = p.set(b.fields);
        if (unset.length) p = p.unset(unset);
        return p;
      });
    }
  }
  for (const { d, title } of deletes) {
    tx.patch(d._id, (p) => p.ifRevisionId(d._rev).set({ title })).delete(d._id);
  }
  if (before.changes.length) await tx.commit({ visibility: 'sync' });
  const restored = new Map((await readDocs()).map((d) => [d._id, d]));
  const bad = before.changes.filter((b) => b.create
    ? restored.has(b._id)
    : !restored.has(b._id) || !same(old(restored.get(b._id), b.keys), b.fields));
  if (bad.length) throw Error('Rollback verification failed: ' + bad.map((b) => b._id).join(', '));
  console.log(`Rolled back and verified ${before.changes.length} records. Assets were retained to avoid deleting shared files.`);
}
if (mode === '--rollback') {
  await rollback(path.resolve(arg));
  process.exit(0);
}

const hashes = {};
const merge = (slug, documents) => {
  hashes[slug] = Object.fromEntries(Object.entries(documents)
    .filter(([key, value]) => key in fileFields && !value?.reviewOnly)
    .map(([key, value]) => [key, typeof value === 'string' ? value : value.sha256]));
};
for (const d of load('config/project-document-releases.json').projects) {
  if (d.status === 'released') merge(d.slug, d.documents);
}
for (const d of reviewed2023) if (d.documentStatus === 'released') merge(d.slug, d.documents);
for (const y of [2021, 2024, 2025, 2026]) {
  const manifest = `config/project-document-releases-${y}.json`;
  if (existsSync(path.join(root, manifest))) {
    const m = load(manifest);
    if (Array.isArray(m.projects)) {
      for (const d of m.projects) if (d.status === 'released') merge(d.slug, d.documents);
    } else {
      for (const [slug, documents] of Object.entries(m)) merge(slug, documents);
    }
  }
}

const raw = await readDocs();
const published = raw.filter(scope);
const drafts = new Set(raw.filter((d) => d._id.startsWith('drafts.')).map((d) => d._id.slice(7)));
const changed = [];
const seen = new Set();
const issues = [];
for (const d of published) {
  const slug = d.slug.current;
  const identity = `${d._type}/${slug}`;
  if (seen.has(identity)) issues.push(`Duplicate published documents: ${identity}`);
  seen.add(identity);
}
const desired = (slug) => {
  const { series, location } = naming.outreaches[slug];
  const labels = naming.series[series];
  const category = categoryBySeries[series];
  if (!labels?.en || !labels?.fr || !category) throw Error(`Unreviewed naming/category: ${slug}`);
  const suffix = location ? ` · ${location}` : '';
  return { title: labels.en + suffix, titleFr: labels.fr + suffix, outreachCategory: category };
};
function include(d, slug, fields, create = false) {
  const docs = {};
  for (const [key, expected] of Object.entries(hashes[slug] ?? {})) {
    if (d._type !== 'projectRecord') continue;
    const rel = `public/docs/projects/${slug}/${key}.pdf`;
    const buf = existsSync(path.join(root, rel)) ? readFileSync(path.join(root, rel)) : undefined;
    if (!buf || !/^[a-f0-9]{64}$/.test(expected) || sha('sha256', buf) !== expected) {
      issues.push(`Released PDF missing or SHA256 mismatch: ${rel}`);
      continue;
    }
    docs[fileFields[key]] = { path: rel, buf, sha1: sha('sha1', buf) };
  }
  if (d._type === 'projectRecord' && (!docs.termsOfReference || !docs.finalReport)) {
    issues.push(`No complete checksum-approved document pair for ${slug}`);
  }
  changed.push({ d, slug, fields: Object.fromEntries(Object.entries(fields).filter(([k, v]) => !same(d[k], v))), docs, create });
}
for (const slug of Object.keys(naming.outreaches)) {
  const known = published.filter((d) => d.slug.current === slug);
  if (!known.length) {
    const source = year2023.get(slug);
    if (!missingAllowed.has(slug) || source?.documentStatus !== 'released' || source.year !== 2023 ||
        !source.startDate || !source.endDate || !source.demographic || !source.description || !source.descriptionFr) {
      issues.push(`No published CMS match and no approved creation source for ${slug}`);
      continue;
    }
    const d = { _id: `ada-project-record-${slug}`, _type: 'projectRecord' };
    if (raw.some((r) => r.slug.current === slug)) {
      issues.push(`Refusing to create a public copy alongside an existing unpublished record: ${slug}`);
      continue;
    }
    include(d, slug, {
      ...desired(slug), slug: { _type: 'slug', current: slug }, year: 2023, status: 'completed',
      ...old(source, ['demographic', 'description', 'descriptionFr', 'location', 'locationFr', 'startDate', 'endDate']),
    }, true);
  } else {
    for (const d of known) {
      const source = d._type === 'projectRecord' && year2023.get(slug);
      const fields = { ...desired(slug), ...(source ? old(source, ['startDate', 'endDate', 'locationFr']) : {}) };
      include(d, slug, fields);
    }
  }
}
const assetHashes = Array.from(new Set(changed.flatMap((x) => Object.values(x.docs).map((a) => a.sha1))));
const assets = await client.fetch('*[_type == "sanity.fileAsset" && sha1hash in $hashes]{_id,sha1hash,mimeType}', { hashes: assetHashes });
const byHash = new Map(assets.filter((a) => a.mimeType === 'application/pdf').map((a) => [a.sha1hash, a._id]));
// Keep a matching asset reference exactly as-is, including custom metadata.
for (const x of changed) {
  for (const [field, wanted] of Object.entries(x.docs)) {
    const exact = assets.some((a) => a._id === x.d[field]?.asset?._ref && a.sha1hash === wanted.sha1 && a.mimeType === 'application/pdf');
    if (exact) delete x.docs[field];
  }
}
const actionable = changed.filter((x) => x.create || Object.keys(x.fields).length || Object.keys(x.docs).length);
for (const x of actionable) if (drafts.has(x.d._id)) issues.push(`Published record has a paired draft: ${x.slug}`);
const newAssets = new Set(actionable.flatMap((x) =>
  Object.values(x.docs).filter((a) => !byHash.has(a.sha1)).map((a) => a.sha1)));
console.log(JSON.stringify({
  mode: mode ?? 'dry-run / no writes',
  records: actionable.map((x) => ({
    slug: x.slug, type: x.d._type, operation: x.create ? 'create' : 'patch', fields: x.fields,
    pdfs: Object.fromEntries(Object.entries(x.docs).map(([k, a]) => [k, { path: a.path, upload: !byHash.has(a.sha1) }])),
  })), newAssets: newAssets.size, issues,
}, null, 2));
if (issues.length) throw Error('Plan has blockers; no changes made.');
if (!mode || !actionable.length) process.exit(0);

const backup = path.resolve(arg);
const relative = path.relative(root, backup);
if (!relative.startsWith('..' + path.sep) && relative !== '..') throw Error('Backup must be outside the worktree.');
mkdirSync(backup, { mode: 0o700 });
writeJson(backup, 'before.json', {
  projectId: 'rj2m21gk', dataset: 'production', changes: actionable.map(({ d, create, fields, docs }) => {
    const keys = [...Object.keys(fields), ...Object.keys(docs)];
    return { _id: d._id, _rev: d._rev, create, keys, fields: old(d, keys) };
  }),
});
const uploadEntries = actionable.flatMap((x) =>
  Object.values(x.docs).filter((a) => !byHash.has(a.sha1)).map((a) => [a.sha1, a]));
const uploads = [...new Map(uploadEntries).values()];
for (let i = 0; i < uploads.length; i += 4) {
  const settled = await Promise.allSettled(uploads.slice(i, i + 4).map(async (item) => {
    const asset = await client.assets.upload('file', item.buf, {
      filename: item.path.split('/').slice(-2).join('-'), contentType: 'application/pdf',
    });
    if (asset.sha1hash !== item.sha1 || asset.mimeType !== 'application/pdf') throw Error('Uploaded asset checksum/type mismatch.');
    byHash.set(item.sha1, asset._id);
    writeJson(backup, `asset-${item.sha1}.json`, { _id: asset._id, sha1: item.sha1 });
  }));
  const errors = settled.filter((x) => x.status === 'rejected').map((x) => x.reason);
  if (errors.length) throw new AggregateError(errors, 'Asset preparation failed; no documents changed.');
}
// Recheck after uploads. Revision guards close the patch race; create() rejects occupied IDs.
const fresh = await readDocs();
const snapshot = new Map(raw.map((d) => [d._id, d._rev]));
if (fresh.length !== raw.length || fresh.some((d) => snapshot.get(d._id) !== d._rev))
  throw Error('CMS scope changed during preparation; no records written. Re-run the plan.');
const transactionId = randomUUID();
const tx = client.transaction().transactionId(transactionId);
for (const x of actionable) {
  for (const [field, a] of Object.entries(x.docs)) {
    const previous = x.d[field];
    x.fields[field] = previous ? { ...previous, asset: file(byHash.get(a.sha1)).asset } : file(byHash.get(a.sha1));
  }
  if (x.create) tx.create({ ...x.d, ...x.fields });
  else tx.patch(x.d._id, (p) => p.ifRevisionId(x.d._rev).set(x.fields));
}
writeJson(backup, 'intent.json', {
  transactionId, changes: actionable.map((x) => ({ _id: x.d._id, fields: x.fields })),
});
const result = await tx.commit({ visibility: 'sync', returnDocuments: true });
const revisions = new Map(result.map((d) => [d._id, d._rev]));
writeJson(backup, 'after.json', {
  transactionId, changes: actionable.map((x) => ({ _id: x.d._id, _rev: revisions.get(x.d._id) })),
});
const after = new Map((await readDocs()).filter(scope).map((d) => [d._id, d]));
const failed = actionable.filter((x) => {
  const d = after.get(x.d._id);
  return !d || d._rev !== revisions.get(x.d._id) || !same(old(d, Object.keys(x.fields)), x.fields);
});
if (failed.length) throw Error('Post-write verification failed; inspect backup. ' + failed.map((x) => x.slug).join(', '));
console.log(`Applied and independently fetched ${actionable.length} published records. Private rollback backup: ${backup}`);
