import { isWithheldGalleryAsset } from "./gallery-media-clearance";
import { getGalleryImages, getProjects, sanityImageUrl } from "./sanity";
import type { ContentLocale } from "./sanity-locale";

export type HeroImage = {
	imageUrl: string;
	imageAlt: string;
};

/** Prefer the requested project's eligible cover, then a cleared gallery photo. */
export async function resolveHeroImage(
	preferredSlugs: string[] = ["widow-support"],
): Promise<HeroImage | null> {
	try {
		const projects = await getProjects();
		const eligible = projects.filter((project) =>
			project.mainImage?.asset?._ref && !isWithheldGalleryAsset(project.mainImage.asset._ref));
		const project = preferredSlugs
			.map((slug) => eligible.find((item) => item.slug?.current === slug))
			.find(Boolean) ?? eligible[0];
		if (project?.mainImage?.asset?._ref) {
			return {
				imageUrl: sanityImageUrl(project.mainImage.asset._ref, 1400),
				imageAlt: project.mainImage.alt || project.title,
			};
		}
	} catch {
		/* fall through to cleared gallery photos */
	}

	try {
		const [gallery] = await getGalleryImages();
		if (gallery) {
			return {
				imageUrl: sanityImageUrl(gallery.photo.asset._ref, 1400),
				imageAlt: gallery.photo.alt,
			};
		}
	} catch {
		/* use the layout's neutral visual fallback */
	}

	return null;
}

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
