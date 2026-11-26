import { getArchiveFeaturePhoto } from "./archive-feature-photos";
import type { Locale } from "../i18n";

// Gallery placement is limited to these exact, already-published archive photographs.
// The year is the outreach year, not an inferred photo timestamp.
const approvedArchiveGallery = [
  { slug: "prenatal-care-support-program", year: 2025 },
  { slug: "city-cleanup-may-2025", year: 2025 },
  { slug: "back-to-school-buea-2024", year: 2024 },
  { slug: "city-cleanup-may-2023", year: 2023 },
  { slug: "christmas-giving-dec-2022", year: 2022 },
  { slug: "back-to-school-sep-2022", year: 2022 },
  { slug: "idp-girls-baking-training-jul-2022", year: 2022 },
  { slug: "widow-support-food-cash-mar-2022", year: 2022 },
  { slug: "school-supply-distribution-feb-2022", year: 2022 },
  { slug: "first-widow-home-visits-2021", year: 2021 },
] as const;

export function getArchiveGalleryPhotos(locale: Locale) {
  return approvedArchiveGallery.flatMap(({ slug, year }) => {
    const photo = getArchiveFeaturePhoto(slug, locale);
    return photo ? [{ ...photo, archiveSlug: slug, year }] : [];
  });
}
