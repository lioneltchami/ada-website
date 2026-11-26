import type { ProjectArchiveEntry } from "./project-archive";

const seriesTitles = {
  widowsOutreach: { en: "Widows Outreach", fr: "Action auprès des veuves" },
  backToSchool: { en: "Back to School", fr: "Rentrée scolaire" },
  christmasGiving: { en: "Christmas Giving", fr: "Dons de Noël" },
} as const;

// Recurring events share display names, not identifiers. Match reviewed record
// slugs rather than words like "school" or "widows" in the title or demographic:
// other projects may serve the same people without belonging to these series.
const seriesBySlug = new Map<string, keyof typeof seriesTitles>([
  ["first-widow-home-visits-2021", "widowsOutreach"],
  ["widow-support-food-cash-mar-2022", "widowsOutreach"],
  ["womens-day-home-visits-mar-2023", "widowsOutreach"],
  ["womens-day-widows-outreach-2025", "widowsOutreach"],
  ["back-to-school-sep-2022", "backToSchool"],
  ["back-to-school-drive-2023", "backToSchool"],
  ["back-to-school-buea-2024", "backToSchool"],
  ["back-to-school-bamenda-aug-2026", "backToSchool"],
  ["back-to-school-buea-aug-2026", "backToSchool"],
  ["christmas-giving-dec-2022", "christmasGiving"],
  ["christmas-giving-dec-2023", "christmasGiving"],
  ["christmas-giving-dec-2024", "christmasGiving"],
]);

export function archiveProjectDisplayTitle(
  record: Pick<ProjectArchiveEntry, "slug" | "title" | "titleFr">,
  locale: "en" | "fr",
): string {
  const series = seriesBySlug.get(record.slug.current);
  if (series) return seriesTitles[series][locale];
  return (locale === "fr" && record.titleFr) || record.title;
}
