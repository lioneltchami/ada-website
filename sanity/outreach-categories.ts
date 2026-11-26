/** Public archive browsing groups, independent of CMS audience demographics. */
export const archiveOutreachCategoryIds = [
  "education",
  "widows",
  "girls-young-women",
  "christmas",
  "community-events",
  "maternal-baby",
] as const;

export type ArchiveOutreachCategory = (typeof archiveOutreachCategoryIds)[number];
type ArchiveOutreachLocale = "en" | "fr";

const labels = {
  all: { en: "All", fr: "Tous" },
  education: {
    en: "Education & School Support",
    fr: "Éducation et soutien scolaire",
  },
  widows: { en: "Widows Outreach", fr: "Soutien aux veuves" },
  "girls-young-women": { en: "Girls & Young Women", fr: "Filles et jeunes femmes" },
  christmas: { en: "Christmas Giving", fr: "Dons de Noël" },
  "community-events": {
    en: "Community Events & Cleanups",
    fr: "Événements et nettoyages communautaires",
  },
  "maternal-baby": {
    en: "Maternal & Baby Support",
    fr: "Soutien aux mères et aux bébés",
  },
} satisfies Record<"all" | ArchiveOutreachCategory, Record<ArchiveOutreachLocale, string>>;

// Reviewed defaults for existing records. Editors can choose the activity for
// any new or existing record; never infer it from audience, title, or budget.
const slugsByCategory = {
  education: [
    "back-to-school-bamenda-aug-2026",
    "back-to-school-buea-aug-2026",
    "education-orphans",
    "back-to-school-buea-2024",
    "back-to-school-drive-2023",
    "back-to-school-sep-2022",
    "school-visit-may-2022",
    "school-supply-distribution-feb-2022",
  ],
  widows: [
    "womens-day-widows-outreach-2025",
    "womens-day-home-visits-mar-2023",
    "widow-support-food-cash-mar-2022",
    "first-widow-home-visits-2021",
  ],
  "girls-young-women": [
    "girls-dignity-menstrual-health-bamenda-jun-2026",
    "girls-programme-2024",
    "girls-day-oct-2023",
    "idp-girls-baking-training-jul-2022",
  ],
  christmas: [
    "christmas-giving-dec-2024",
    "christmas-giving-dec-2023",
    "christmas-giving-dec-2022",
  ],
  "community-events": [
    "city-cleanup-may-2025",
    "city-cleanup-may-2023",
    "mountain-race-outreach-feb-2023",
    "youth-day-snacks-feb-2023",
  ],
  "maternal-baby": ["prenatal-care-support-program"],
} satisfies Record<ArchiveOutreachCategory, readonly string[]>;

const categoryBySlug = new Map<string, ArchiveOutreachCategory>(
  archiveOutreachCategoryIds.flatMap((id) =>
    slugsByCategory[id].map((slug) => [slug, id] as const),
  ),
);

export function isArchiveOutreachCategory(value: unknown): value is ArchiveOutreachCategory {
  return typeof value === "string" && archiveOutreachCategoryIds.some((id) => id === value);
}

export function getArchiveOutreachCategory(
  slug: string,
  outreachCategory?: unknown,
): ArchiveOutreachCategory | undefined {
  return isArchiveOutreachCategory(outreachCategory) ? outreachCategory : categoryBySlug.get(slug);
}

export function getArchiveOutreachCategoryLabel(
  category: "all" | ArchiveOutreachCategory,
  locale: ArchiveOutreachLocale,
): string {
  return labels[category][locale];
}

export function getArchiveOutreachFilters(
  entries: readonly { slug: { current: string }; outreachCategory?: unknown }[],
  locale: ArchiveOutreachLocale,
): { id: "all" | ArchiveOutreachCategory; label: string; count: number }[] {
  const counts = new Map<ArchiveOutreachCategory, number>();
  for (const entry of entries) {
    const id = getArchiveOutreachCategory(entry.slug.current, entry.outreachCategory);
    if (id) counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  return [
    { id: "all", label: labels.all[locale], count: entries.length },
    ...archiveOutreachCategoryIds.flatMap((id) => {
      const count = counts.get(id) ?? 0;
      return count > 0 ? [{ id, label: labels[id][locale], count }] : [];
    }),
  ];
}
