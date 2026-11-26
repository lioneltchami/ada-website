import { getGalleryImages, sanityImageUrl } from "./sanity";
import type { ContentLocale } from "./sanity-locale";

export interface GalleryMosaicPhoto {
	id: string;
	title: string;
	alt: string;
	imageUrl: string;
	href?: string;
}

/** Only an explicitly reviewed matching archive record can be a direct link. */
export function galleryMosaicHref(archiveSlug?: string): string {
	return archiveSlug ? `/projects/archive/${archiveSlug}` : "/gallery";
}

export async function loadGalleryMosaic(
	limit = 8,
	locale: ContentLocale = "en",
): Promise<GalleryMosaicPhoto[]> {
	try {
		const rows = await getGalleryImages(undefined, locale);
		return rows.slice(0, limit).map((row) => ({
			id: row._id,
			title: row.title,
			alt: row.photo.alt,
			imageUrl: sanityImageUrl(row.photo.asset._ref, 640),
			href: galleryMosaicHref(row.archiveSlug),
		}));
	} catch {
		return [];
	}
}
