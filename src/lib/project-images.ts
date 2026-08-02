import type { SanityProject } from "./sanity";
import { sanityImageUrl } from "./sanity";

export type ProjectCardImage = {
	imageUrl: string;
	imageAlt: string;
	imageSource: "main" | "archive" | "local" | "placeholder";
};

/** Flyer / campaign art shipped under public/ when Sanity has no photo yet. */
const LOCAL_PROJECT_IMAGES: Record<string, string> = {
	"back-to-school-buea-aug-2026":
		"/images/projects/back-to-school-buea-aug-2026.png",
	"back-to-school-bamenda-aug-2026":
		"/images/projects/back-to-school-bamenda-aug-2026.png",
};

export function resolveProjectCardImage(
	project: Pick<
		SanityProject,
		"title" | "mainImage" | "archiveRecord" | "slug"
	>,
	width = 600,
): ProjectCardImage {
	if (project.mainImage?.asset?._ref) {
		return {
			imageUrl: sanityImageUrl(project.mainImage.asset._ref, width),
			imageAlt: project.mainImage.alt || project.title,
			imageSource: "main",
		};
	}

	if (project.archiveRecord?.photo?.asset?._ref) {
		return {
			imageUrl: sanityImageUrl(project.archiveRecord.photo.asset._ref, width),
			imageAlt: project.archiveRecord.photo.alt || project.title,
			imageSource: "archive",
		};
	}

	const slug = project.slug?.current;
	const localPath = slug ? LOCAL_PROJECT_IMAGES[slug] : undefined;
	if (localPath) {
		return {
			imageUrl: localPath,
			imageAlt: `${project.title} campaign flyer`,
			imageSource: "local",
		};
	}

	return {
		imageUrl: "/project-placeholder.svg",
		imageAlt: `${project.title} project visual`,
		imageSource: "placeholder",
	};
}
