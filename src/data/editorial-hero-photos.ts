import { getArchiveFeaturePhoto } from "./archive-feature-photos";
import { getArchiveSupportingPhotos } from "./archive-supporting-photos";
import { outreachEditorialStill } from "./outreach-editorial-stills";
import { localePath, type Locale } from "../i18n";

const sources = {
  about: { slug: "city-cleanup-may-2025", still: "cleanupTeam" },
  projects: { slug: "back-to-school-sep-2022" },
  sponsor: { slug: "prenatal-care-support-program", still: "mueaHandoff" },
  volunteer: { slug: "idp-girls-baking-training-jul-2022", supporting: true },
  gallery: { slug: "back-to-school-buea-2024", still: "schoolSession24" },
  contact: { slug: "city-cleanup-may-2025", still: "cleanupWork" },
  transparency: { slug: "back-to-school-sep-2022", still: "schoolBooks22" },
  // Keep documents and high-intent forms focused, and don't repeat a photo
  // just to fill a header. The archive already shows its own record covers.
  archive: null,
  team: null,
  monthly: null,
  donate: null,
  resources: null,
  partners: { slug: "back-to-school-sep-2022", supporting: true },
} as const;

export function getEditorialHeroPhoto(page: keyof typeof sources, locale: Locale) {
  const source = sources[page];
  if (!source) return undefined;
  const { slug } = source;
  const photo = "still" in source
    ? outreachEditorialStill(source.still, locale)
    : "supporting" in source
      ? getArchiveSupportingPhotos(slug, locale)[0]
      : getArchiveFeaturePhoto(slug, locale);
  if (!photo) return undefined;
  return {
    ...photo,
    credit: { text: photo.caption, href: localePath(`/projects/archive/${slug}/`, locale) },
  };
}
