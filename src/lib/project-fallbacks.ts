import { projects as fallbackProjects } from "../data/projects";
import { getProjectLifecycleState } from "./project-lifecycle";

export function normalizeFallbackProjects(
  options: { locale?: "en" | "fr"; today?: string } = {},
) {
  return fallbackProjects.map((p) => {
    const lifecycle = getProjectLifecycleState(
      {
        status: p.status,
        slug: p.slug,
        startDate: p.startDate,
        endDate: p.endDate,
        archiveAfterDate: p.archiveAfterDate,
        autoArchiveAfterEndDate: p.autoArchiveAfterEndDate,
      },
      options,
    );
    return {
      ...p,
      status: lifecycle.status,
      originalStatus: p.status,
      archiveHref: lifecycle.archiveHref,
      archiveReady: lifecycle.archiveReady,
      hasEnded: lifecycle.hasEnded,
      isUpcoming: lifecycle.isUpcoming,
      startDate: p.startDate,
      endDate: p.endDate,
      imageUrl: p.imagePath || "/project-placeholder.svg",
      imageAlt: p.title,
    };
  });
}

export function normalizeFallbackArchiveProjects() {
  return normalizeFallbackProjects();
}

export function mergeProjectLists(primary, secondary) {
  const seen = new Set(primary.map((project) => project.slug));
  return [
    ...primary,
    ...secondary.filter((project) => !seen.has(project.slug)),
  ];
}
