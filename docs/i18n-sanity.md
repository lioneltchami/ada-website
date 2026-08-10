# Sanity content localization (EN / FR)

## Convention

- English is the **base** field: `title`, `description`, `quote`, …
- French is the sibling `*Fr` field: `titleFr`, `descriptionFr`, `quoteFr`, …
- Empty / missing Fr → fall back to English

Helpers live in `src/lib/sanity-locale.ts`. All public getters in `src/lib/sanity.ts` accept `locale?: "en" | "fr"` (default `"en"`) and return **already-localized** shapes (Fr keys stripped from nested objects where applied).

```ts
const about = await getAboutPage("fr");
const projects = await getProjects("fr");
```

## Pages / components

Pass `"fr"` from every `/fr/**` route (and shared components that already receive `locale`). EN routes may omit the arg.

## Editing in Studio

Deploy schemas (`sanity schema` / Studio deploy) so editors see French fields. Prefer filling Fr in Studio for ongoing copy; seed scripts only bootstrap.

## Seeding known FR copy

```bash
npx tsx sanity/seed-locale-fr.ts
```

Requires `SANITY_TOKEN` / `SANITY_API_TOKEN` or Sanity CLI auth. Script only writes `*Fr` fields — never overwrites English.
