# Reviewed 2022 document release contract

All six entries are released following approval of the complete revised document set.
Each report includes its financial account; no standalone financial PDF remains.
Do not set `released` merely because documents render successfully.

1. Complete the content, financial-evidence labeling, privacy, English/French and visual review. `financialEvidence` means accurate labeling of the evidence, not a claim that reconstructed allocations have receipts.
2. Copy only the approved public `tor.pdf` and `report.pdf` (including financial account) to the canonical project folder. Never copy private appendices or recipient photos without publication approval.
3. Remove the stale standalone `financial.pdf` from that folder. Add a redirect to report.pdf if preserving old inbound links is needed; do not leave contradictory financial content live.
4. Record SHA-256 of both final PDFs, the four approval flags, and change status to released. Hashes attest file identity, not factual truth.
5. Release May under `school-visit-may-2022`, with a corresponding school-only CMS record; do not revive the withdrawn cleanup slug, its source markdown, or its 55,000 cleanup budget.
6. Independently align static ledger, narrative overrides, and Sanity records to approved facts. This manifest does not override financial ledger data or mutate Sanity. Sanity budget fields remain USD: unset stale values rather than injecting CFA into USD fields. XAF here is a currency declaration, not a conversion.
7. Run `npm run verify:document-releases`, node guard tests, Vitest and the entire build. Verify generated routes, downloads and totals. All released PDF checksums must match after the build.

The legacy renderer verifies hashes before launch and skips released folders completely. The website then links two documents, not three. Staged entries do not create public placeholder files or May routes. Other years keep their existing behavior. The public PDF layouts themselves are owned by the approved document template, not the legacy renderer.

## Release verification

The final PDFs retain the approved retrospective narrative, privacy-safe photographs and evidence-qualified financial schedules. Only review-only footers and metadata were removed. All 29 page bodies and embedded image pixels were verified unchanged against the approved documents. The manifest records final public file checksums.

Resource listings and archive pages share the same six approved bilingual records. May is the school visit on Wednesday, 11 May 2022. The withdrawn cleanup record remains excluded. Other-year project records are not altered by this release.
