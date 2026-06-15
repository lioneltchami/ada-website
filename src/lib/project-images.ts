import type { SanityProject } from "./sanity";
import { sanityImageUrl } from "./sanity";

export type ProjectCardImage = {
  imageUrl: string;
  imageAlt: string;
  imageSource: "main" | "archive" | "placeholder";
};

export function resolveProjectCardImage(
  project: Pick<SanityProject, "title" | "mainImage" | "archiveRecord">,
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

  return {
    imageUrl: "/project-placeholder.svg",
    imageAlt: `${project.title} project visual`,
    imageSource: "placeholder",
  };
}
