import { getArchiveGalleryPhotos } from "../data/gallery-archive-photos";
import { localePath, type Locale } from "../i18n";
import type { ProjectArchiveEntry } from "./project-archive";

type AlbumArchiveRecord = Pick<ProjectArchiveEntry, "slug" | "status" | "autoArchived">;

export function getGalleryAlbumId(archiveSlug: string): string {
  return `album-${archiveSlug}`;
}

export function getArchiveGalleryAlbumHref(
  { slug, status, autoArchived }: AlbumArchiveRecord,
  locale: Locale,
): string | undefined {
  if (status !== "completed" || autoArchived) return undefined;
  // An explicit on-disk album is rendered even if the optional gallery CMS fetch
  // fails. A known archive slug, approved standalone photo, or generic title
  // does not by itself establish a Gallery destination.
  if (!getArchiveGalleryPhotos(locale).some((photo) => photo.archiveSlug === slug.current)) return undefined;

  return `${localePath("/gallery/", locale)}#${getGalleryAlbumId(slug.current)}`;
}
