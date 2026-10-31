import { getSanityClient, sanityImageUrl } from "./sanity";
import { type ContentLocale, pickLocalized } from "./sanity-locale";

export interface GalleryMosaicPhoto {
	id: string;
	title: string;
	alt: string;
	imageUrl: string;
	href?: string;
	projectTitle?: string;
}

/** Return locale-independent paths; the rendering component applies its locale prefix. */
export function galleryMosaicHref(projectSlug?: string): string {
	return projectSlug ? `/projects/${projectSlug}` : "/gallery";
}

/** Recent field photos for homepage mosaic / trust strips. */
export async function loadGalleryMosaic(
	limit = 8,
	locale: ContentLocale = "en",
): Promise<GalleryMosaicPhoto[]> {
	try {
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
			}[]
		>(
			`*[_type == "galleryImage" && defined(photo.asset._ref)]
        | order(year desc, dateTaken desc)[0...$limit]{
          _id,
          title,
          titleFr,
          photo { asset { _ref }, alt, altFr },
          "projectTitle": project->title,
          "projectTitleFr": project->titleFr,
          "projectSlug": project->slug.current
        }`,
			{ limit },
		);

		return rows
			.filter((row) => row.photo?.asset?._ref)
			.map((row) => {
				const title = pickLocalized(row, "title", locale);
				const alt = pickLocalized(
					(row.photo || {}) as Record<string, unknown>,
					"alt",
					locale,
				);
				const projectTitle = pickLocalized(
					{
						projectTitle: row.projectTitle,
						projectTitleFr: row.projectTitleFr,
					},
					"projectTitle",
					locale,
				);
				return {
					id: row._id,
					title,
					alt: alt || title,
					imageUrl: sanityImageUrl(row.photo!.asset!._ref!, 640),
					href: galleryMosaicHref(row.projectSlug),
					projectTitle: projectTitle || undefined,
				};
			});
	} catch {
		return [];
	}
}
