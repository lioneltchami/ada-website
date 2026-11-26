# Sanity outreach consistency migration

This maintenance command is read-only by default. It scopes changes to the reviewed
bilingual outreach naming registry, preserves the existing published IDs, slugs,
asset metadata, statuses, public routes, and photos, and refuses to edit paired
drafts. It skips unverified/withdrawn aliases, canceled programs, and fundraising
programs. The only records permitted to be created are the four already published
via the source-backed 2023 archive. Their dates and narrative come from that
reviewed source. Existing dates are corrected only from the same 2023 record.
No inferred figures are written to Sanity.

## Preview

From the repository root, using a shell with a Sanity API token (read access
suffices for preview):

```sh
node scripts/reconcile-outreach-sanity.mjs
```

Inspect every proposed field change and document replacement. Asset candidates are
limited to the canonical PDF paths and must match the committed release checksums.
Each existing or newly created archive record must have a complete
checksum-approved Terms of Reference and report pair. Any unmatched or duplicate
record, missing PDF, digest mismatch, or paired draft blocks all writes.

## Apply and verify

Only use an approved commit after reviewing the preview and verifying the public
PDFs. Use a production write token and a fresh **private** backup path outside
the worktree. Never put backup files in tracked code.

```sh
node scripts/reconcile-outreach-sanity.mjs --apply /private/path/ada-outreach-sanity-backup --reviewed
node scripts/reconcile-outreach-sanity.mjs
```

The command takes a private backup of changed fields and original revisions
before uploads. It reuses exact Sanity assets or uploads the reviewed PDFs,
checks again for changed CMS records or new drafts, and performs one atomic
transaction with revision-guarded patches. Then it fetches and checks the new
revisions and all modified fields. The post-apply preview should return zero
changes and issues. Separately verify the deployed site and actual downloads,
including the EN/FR archive, current outreach cards, and resource pages.

If an upload succeeds before the document transaction fails, the asset may be
unreferenced; its ID is saved separately in the backup directory. It is not
automatically deleted, as an editor may have reused it. If the commit response
is lost, check Sanity history for the transaction ID in `intent.json` before
retrying; do not infer success or failure from the missing response.

## Rollback

```sh
node scripts/reconcile-outreach-sanity.mjs --rollback /private/path/ada-outreach-sanity-backup --reviewed
```

Requires a completed transaction backup. Any intervening edit to a touched
document aborts rollback rather than overwriting it. Rollback only restores
changed fields and removes records created by the migration, leaving reusable
assets in Sanity. It does not revert website code or deployments.
