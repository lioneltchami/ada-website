import { projects as fallbackProjects } from "../data/projects";

export function normalizeFallbackProjects() {
  return fallbackProjects.map((p) => ({
    ...p,
    originalStatus: p.status,
    archiveHref: "",
    archiveReady: false,
    hasEnded: false,
    imageUrl: "",
    imageAlt: p.title,
  }));
}

export function normalizeFallbackArchiveProjects() {
  return fallbackProjects.map((p) => ({
    ...p,
    archiveHref: "",
    archiveReady: false,
    hasEnded: false,
  }));
}

export function mergeProjectLists(primary, secondary) {
  const seen = new Set(primary.map((project) => project.slug));
  return [...primary, ...secondary.filter((project) => !seen.has(project.slug))];
}
