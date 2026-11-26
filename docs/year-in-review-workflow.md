# ADA Year in Review
Write English first, then the corresponding French. Use ADA’s first-person plural voice for donors, community members and partners. An annual activity review is separate from project ToRs/reports and audited financial statements.

1. Why we did the work: what local need stood out and why our team responded.
2. What we did: two to four specific documented highlights with the exact bilingual archive routes. Use real, cleared media only, and never identify protected participants.
3. What our records show: distinguish plans, budgets, delivered work, and actual spending. Link the year’s archive and avoid annual totals unless reconciled. Do not sum attendee figures as unique people or infer an outcome from an activity.
4. Thank you and looking ahead: a specific lesson or forward reflection, a grounded thank-you, and a realistic next step. Do not invent historical lessons.

Each December 31 create the year-to-date draft privately. In January reconcile the now-closed calendar year, including December results; do not claim delivery from archive status. If important records are still missing, keep the draft private and request what is missing. When ready, append the approved, reviewed source record to `content/year-in-review.json`. Render with `node scripts/render-year-in-review.mjs`. Use `--draft input.json private-output-directory` for draft work outside the checkout. Check both searchable PDF pages, exact bilingual outbound links, archive year fragments, the bilingual Resources section, build/CI and live publication. Do not replace existing financial or project reports.

## How links are published

The bilingual Resource Library uses the same reviewed source list for both languages. A published PDF is linked beside its year in **Project Documents by Year**, even if the year has no project PDFs. No separate page edit is required. Publish the reviewed JSON record and its matching PDF in the same change; the build rejects duplicate years, missing or mismatched files, and any unlisted item (including drafts) inside the public annual PDF directory. The regular site rebuild verifies, but does not author or release, annual reviews.
