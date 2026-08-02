import { getProjects, getSanityClient, sanityImageUrl } from "./sanity";

export type HeroImage = {
	imageUrl: string;
	imageAlt: string;
};

/**
 * Resolve a field photo for page heroes from project covers or gallery.
 * Prefer named project slugs when provided.
 */
export async function resolveHeroImage(
	preferredSlugs: string[] = [
		"widow-support",
		"education-orphans",
		"women-empowerment",
	],
): Promise<HeroImage | null> {
	try {
		const projects = await getProjects();
		for (const slug of preferredSlugs) {
			const match = projects.find(
				(p) => p.slug?.current === slug && p.mainImage?.asset?._ref,
			);
			if (match?.mainImage?.asset?._ref) {
				return {
					imageUrl: sanityImageUrl(match.mainImage.asset._ref, 1400),
					imageAlt: match.mainImage.alt || match.title,
				};
			}
		}
		const any = projects.find((p) => p.mainImage?.asset?._ref);
		if (any?.mainImage?.asset?._ref) {
			return {
				imageUrl: sanityImageUrl(any.mainImage.asset._ref, 1400),
				imageAlt: any.mainImage.alt || any.title,
			};
		}
	} catch {
		/* fall through to gallery */
	}

	try {
		const gallery = await getSanityClient().fetch<{
			title: string;
			photo?: { asset?: { _ref?: string }; alt?: string };
		} | null>(
			`*[_type == "galleryImage" && defined(photo.asset._ref)] | order(year desc)[0]{
        title,
        photo { asset { _ref }, alt }
      }`,
		);
		if (gallery?.photo?.asset?._ref) {
			return {
				imageUrl: sanityImageUrl(gallery.photo.asset._ref, 1400),
				imageAlt: gallery.photo.alt || gallery.title,
			};
		}
	} catch {
		/* ignore */
	}

	return null;
}

/** Small set of gallery images for card strips (get-involved, etc.). */
export async function resolveGalleryStrip(
	limit = 4,
): Promise<{ title: string; imageUrl: string; imageAlt: string }[]> {
	try {
		const rows = await getSanityClient().fetch<
			{
				title: string;
				photo?: { asset?: { _ref?: string }; alt?: string };
			}[]
		>(
			`*[_type == "galleryImage" && defined(photo.asset._ref)] | order(year desc)[0...8]{
        title,
        photo { asset { _ref }, alt }
      }`,
		);
		return rows
			.filter((r) => r.photo?.asset?._ref)
			.slice(0, limit)
			.map((r) => ({
				title: r.title,
				imageUrl: sanityImageUrl(r.photo!.asset!._ref!, 600),
				imageAlt: r.photo?.alt || r.title,
			}));
	} catch {
		return [];
	}
}
