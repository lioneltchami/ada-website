import { getArchiveFeaturePhoto } from "../data/archive-feature-photos";
import type { ProjectArchiveEntry } from "./project-archive";

type Locale = "en" | "fr";

export function getEligibleArchiveFeaturePhoto(
  record: Pick<ProjectArchiveEntry, "slug" | "year" | "photo">,
  locale: Locale,
  _imageWidth = 960,
) {
  // Campaign flyers do not establish the date, location or delivery of a completed outreach.
  // Only independently reviewed photographs are associated with archive records.
  return getArchiveFeaturePhoto(record.slug.current, locale);
}
