import { getArchiveFeaturePhoto } from "../data/archive-feature-photos";
import type { ProjectArchiveEntry } from "./project-archive";
import { sanityImageUrl } from "./sanity";

type Locale = "en" | "fr";

// Exact existing project flyers. Do not reuse CMS galleries or unrelated
// cover images as evidence of a dated event. A replacement can be reviewed
// and added to the release allowlist without changing the shared layout.
const existingProjectFlyers = {
  "back-to-school-bamenda-aug-2026": {
    ref: "image-858037f1a735e5ff7b7552577fa790b214610718-682x1024-jpg",
    width: 682,
    height: 1024,
    label: {
      en: "Event flyer for the back-to-school outreach in Mile 4 Nkwen, Bamenda.",
      fr: "Affiche de l’action de rentrée scolaire à Mile 4 Nkwen, à Bamenda.",
    },
  },
  "back-to-school-buea-aug-2026": {
    ref: "image-48868a7cd8281aea2efd8ae6c3adba6384f9fa04-1024x1024-jpg",
    width: 1024,
    height: 1024,
    label: {
      en: "Event flyer for the back-to-school outreach in Buea.",
      fr: "Affiche de l’action de rentrée scolaire à Buea.",
    },
  },
} as const;

export function getEligibleArchiveFeaturePhoto(
  record: Pick<ProjectArchiveEntry, "slug" | "year" | "photo">,
  locale: Locale,
  imageWidth = 960,
) {
  const slug = record.slug.current;
  const approved = getArchiveFeaturePhoto(slug, locale);
  if (approved) return approved;
  if (record.year !== 2026 || !Object.hasOwn(existingProjectFlyers, slug)) return undefined;
  const flyer = existingProjectFlyers[slug as keyof typeof existingProjectFlyers];
  if (record.photo?.asset?._ref !== flyer.ref) return undefined;
  return {
    src: sanityImageUrl(flyer.ref, imageWidth),
    width: flyer.width,
    height: flyer.height,
    alt: flyer.label[locale],
    caption: flyer.label[locale],
  };
}
