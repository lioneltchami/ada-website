import { isSupersededBamendaSchoolPhoto } from "./reviewed-project-summaries-2024-25";
import { getSanityClient, sanityImageUrl } from "./sanity";
import { type ContentLocale, pickLocalized } from "./sanity-locale";
import { isWithdrawnGalleryImage } from "./withdrawn-project-content";

export interface GalleryMosaicPhoto {
	id: string;
	title: string;
	alt: string;
	imageUrl: string;
	href?: string;
}

/** A gallery image's campaign reference is not evidence of where it was taken. */
export function galleryMosaicHref(): string {
	return "/gallery";
}

/** Recent field photos for homepage mosaic / trust strips. */
export async function loadGalleryMosaic(
	limit = 8,
	locale: ContentLocale = "en",
): Promise<GalleryMosaicPhoto[]> {
	try {
		const scanLimit = Math.max(limit * 4, limit);
		const rows = await getSanityClient().fetch<
			{
				_id: string;
				title: string;
				titleFr?: string;
				photo?: {
					asset?: { _ref?: string };
					alt?: string;
					altFr?: string;
				};
				projectTitle?: string;
				projectTitleFr?: string;
				projectSlug?: string;
				reportUrl?: string;
				category?: string;
			}[]
		>(
			`*[_type == "galleryImage" && defined(photo.asset._ref)]
        | order(year desc, dateTaken desc)[0...$limit]{
          _id,
          title,
          titleFr,
          category,
          photo { asset { _ref }, alt, altFr },
          "projectTitle": project->title,
          "projectTitleFr": project->titleFr,
          "projectSlug": project->slug.current,
          reportUrl
        }`,
			{ limit: scanLimit },
		);

		return rows
			.filter((row) => row.photo?.asset?._ref && !isWithdrawnGalleryImage(row) && !isSupersededBamendaSchoolPhoto(row))
			.map((row) => {
				const title = pickLocalized(row, "title", locale);
				const alt = pickLocalized(
					(row.photo || {}) as Record<string, unknown>,
					"alt",
					locale,
				);
				return {
					id: row._id,
					title,
					alt: alt || title,
					imageUrl: sanityImageUrl(row.photo!.asset!._ref!, 640),
					href: galleryMosaicHref(),
				};
			})
			.slice(0, limit);
	} catch {
		return [];
	}
}
