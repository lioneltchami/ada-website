# Spanish rollout plan

Spanish is a future content release, not part of this English/French header change. Do not add an Español button or advertise Spanish availability until reviewed Spanish pages are ready.

## What the site has today

- Interface strings in `src/i18n/en.ts` and `fr.ts`, with a two-language `Locale` type and path helpers in `src/i18n/index.ts`.
- Separate English and `/fr` Astro pages. Some page text lives directly in those pages rather than in dictionaries.
- Sanity base English fields plus `*Fr` fields, resolved by `src/lib/sanity-locale.ts` and `src/lib/sanity.ts`.
- A route-aware top language bar. Known translations keep the same page; unpaired screens have a clearly named homepage fallback. Authentication callbacks keep their existing query/hash safeguards.

## Recommended sequence

1. Inventory visible text: navigation, homepage, about, contact, projects, donation and sponsor flows, account screens, validation/error messages, receipts, page metadata, image descriptions, and downloadable documents. Record source owner, translation status, and review status.
2. Add a shared locale registry and explicit available-translation map before adding `es`. Extend locale types, `/es` path handling, safe query-state rules, and language navigation together. Keep existing English URLs unchanged and prevent links to untranslated pages.
3. Add a typed `es.ts` dictionary and reusable page templates with locale-specific copy. Move inline EN/FR page strings into shared data while translating the affected pages; avoid blindly cloning every page or ternary.
4. Extend Sanity with reviewed `*Es` fields using the existing field convention. Generalize string/array/Portable Text localization helpers and queries so Spanish content is resolved deliberately. Do not seed English text into Spanish fields or publish machine drafts as approved translations.
5. Review the core visitor journey first: home → mission/projects → donate/contact, including donation confirmations, policies, and form errors. A fluent Spanish reviewer should check terminology, clarity, names, amounts, and commitments against the approved source. Original evidence documents can stay in their source language with clear labels; track PDF translation separately.
6. Launch `/es` only when that reviewed journey is usable. Add Español to the shared bar, correct `lang`, canonical/hreflang and sitemap entries, and a clear fallback to the Spanish homepage for pages not yet translated. Translate remaining stories/archive material in batches without suggesting unavailable translations exist.

## Release checks

- EN/FR regressions, every locale pair and unknown-route fallback.
- Same-page navigation, safe sponsor tier and donation frequency state, and auth callback protections.
- No untranslated interface keys; approved Spanish content coverage for the launch journey.
- Keyboard focus, 44px touch targets, active-language announcement, 320px reflow, and longer Spanish labels.
- Search metadata, accessible image text, forms, transactional messages, and accurately labelled source-language documents.

No production routes, CMS schema, content, or automatic-translation service are changed by this plan.
