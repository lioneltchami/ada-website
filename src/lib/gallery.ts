import { getSanityClient, sanityImageUrl } from "./sanity";

export interface GalleryMosaicPhoto {
	id: string;
	title: string;
	alt: string;
	imageUrl: string;
	href?: string;
	projectTitle?: string;
}

/** Recent field photos for homepage mosaic / trust strips. */
export async function loadGalleryMosaic(
	limit = 8,
): Promise<GalleryMosaicPhoto[]> {
	try {
		const rows = await getSanityClient().fetch<
			{
				_id: string;
				title: string;
				photo?: { asset?: { _ref?: string }; alt?: string };
				projectTitle?: string;
				projectSlug?: string;
			}[]
		>(
			`*[_type == "galleryImage" && defined(photo.asset._ref)]
        | order(year desc, dateTaken desc)[0...$limit]{
          _id,
          title,
          photo { asset { _ref }, alt },
          "projectTitle": project->title,
          "projectSlug": project->slug.current
        }`,
			{ limit },
		);

		return rows
			.filter((row) => row.photo?.asset?._ref)
			.map((row) => ({
				id: row._id,
				title: row.title,
				alt: row.photo?.alt || row.title,
				imageUrl: sanityImageUrl(row.photo!.asset!._ref!, 640),
				href: row.projectSlug ? `/projects/${row.projectSlug}` : "/gallery",
				projectTitle: row.projectTitle,
			}));
	} catch {
		return [];
	}
}
