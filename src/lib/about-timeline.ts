import type { Locale } from "../i18n";

const STALE_2023_EDUCATION_ENTRIES = new Set([
  "orphan care and education program begins",
  "education program begins - 20 orphaned children sponsored for school",
  "programme d'éducation - 20 orphelins parrainés pour l'école",
]);

/** Keep the stale CMS milestone consistent with the released 2022 education records. */
export function getAboutTimelineEvent(year: string, event: string, locale: Locale): string {
  const normalized = event.replaceAll("’", "'").replace(/[—–]/g, "-").replace(/\s+/g, " ").trim().toLowerCase();
  if (year !== "2023" || !STALE_2023_EDUCATION_ENTRIES.has(normalized)) return event;
  return locale === "fr" ? "Fournitures scolaires à Buea" : "Back-to-school supplies in Buea";
}
