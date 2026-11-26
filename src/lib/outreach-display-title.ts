import registry from "../../config/outreach-naming.json";

type Locale = "en" | "fr";
type Series = keyof typeof registry.series;
type RegisteredOutreach = { series: string; location?: string };
type TitleFields = {
  slug?: string | { current: string };
  title: string;
  titleFr?: string;
};

function registeredOutreach(slug?: string): RegisteredOutreach | undefined {
  if (!slug || !Object.hasOwn(registry.outreaches, slug)) return undefined;
  return registry.outreaches[slug as keyof typeof registry.outreaches];
}

export function outreachSeriesTitle(slug: string, locale: Locale): string | undefined {
  const entry = registeredOutreach(slug);
  return entry ? registry.series[entry.series as Series][locale] : undefined;
}

export function outreachTitleLocation(slug?: string): string | undefined {
  return registeredOutreach(slug)?.location;
}

/** Use canonical series labels for known outreaches; keep other CMS copy intact. */
export function outreachDisplayTitle(record: TitleFields, locale: Locale): string {
  const slug = typeof record.slug === "string" ? record.slug : record.slug?.current;
  const title = slug && outreachSeriesTitle(slug, locale);
  if (!title) return (locale === "fr" && record.titleFr) || record.title;
  const location = outreachTitleLocation(slug);
  return location ? `${title} · ${location}` : title;
}
