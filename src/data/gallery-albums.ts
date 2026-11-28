import { getArchiveSupportingPhotos } from "./archive-supporting-photos";
import { getArchiveGalleryPhotos } from "./gallery-archive-photos";
import type { Locale } from "../i18n";
import { outreachDisplayTitle, outreachSeriesTitle } from "../lib/outreach-display-title";

type MediaText = Record<Locale, string>;

// Only same-origin files individually approved for gallery publication belong here.
// No shared-album URLs, embeds, full-size originals, or private consent evidence.
type ApprovedAlbumAsset = {
  archiveSlug: string;
  kind: "photo" | "video";
  src: `/images/projects/${string}` | `/videos/outreaches/${string}`;
  /** Required for video with speech or other meaningful audio. */
  captions?: Record<Locale, `/videos/outreaches/${string}.vtt`>;
  alt: MediaText;
  caption: MediaText;
};
const releasedSupportingMedia: readonly ApprovedAlbumAsset[] = [
  {
    archiveSlug: "back-to-school-sep-2022",
    kind: "photo",
    src: "/images/projects/aug-2022-classroom-rear.webp",
    alt: { en: "Pupils seen from behind at wooden desks.", fr: "Des élèves vus de dos, assis à des pupitres en bois." },
    caption: { en: "A classroom during the August 2022 Back to School Outreach in Buea.", fr: "Une salle de classe lors de notre action de rentrée scolaire à Buea en août 2022." },
  },
];

export type GalleryAlbumItem =
  | { kind: "photo"; src: string; alt: string; caption: string; width?: number; height?: number; srcset?: string; date?: string }
  | { kind: "video"; src: string; alt: string; caption: string; captions?: string; poster: string };

export function getArchiveGalleryAlbums(locale: Locale) {
  return getArchiveGalleryPhotos(locale).map((photo) => {
    const { archiveSlug, year } = photo;
    const items: GalleryAlbumItem[] = [
      { kind: "photo", ...photo },
      ...getArchiveSupportingPhotos(archiveSlug, locale).map((item) => ({ kind: "photo" as const, ...item })),
    ];
    for (const item of releasedSupportingMedia) {
      if (item.archiveSlug !== archiveSlug) continue;
      const { src, kind, captions } = item;
      const asset = { src, alt: item.alt[locale], caption: item.caption[locale] };
      if (kind === "photo") items.push({ kind, ...asset });
      else items.push({ kind, ...asset, captions: captions?.[locale], poster: photo.src });
    }
    return {
      archiveSlug, year, items,
      thumbnail: photo.src.replace(/^\/images\/projects\//, "/images/gallery-thumbnails/").replace(/\.[^.]+$/, ".webp"),
      title: outreachDisplayTitle({ slug: archiveSlug, title: photo.caption }, locale),
    };
  });
}

export function isKnownGalleryArchive(slug: string, locale: Locale) {
  return Boolean(outreachSeriesTitle(slug, locale));
}
