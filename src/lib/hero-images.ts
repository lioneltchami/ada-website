import { getGalleryImages, sanityImageUrl } from "./sanity";
import type { ContentLocale } from "./sanity-locale";

export async function resolveGalleryStrip(
	limit = 4,
	locale: ContentLocale = "en",
): Promise<{ title: string; imageUrl: string; imageAlt: string }[]> {
	try {
		const rows = await getGalleryImages(undefined, locale);
		return rows.slice(0, limit).map((row) => ({
			title: row.title,
			imageUrl: sanityImageUrl(row.photo.asset._ref, 600),
			imageAlt: row.photo.alt,
		}));
	} catch {
		return [];
	}
}
