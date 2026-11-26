import { outreachDisplayTitle } from "./outreach-display-title";
import { christmasAnnouncements } from "./christmas-announcements";
import { getProjectLifecycleState } from "./project-lifecycle";
import type { SanityProject } from "./sanity";

export interface UpcomingAnnouncement {
  slug: string;
  title: string;
  date: string;
}

export function listUpcomingAnnouncements(
  projects: readonly SanityProject[],
  options: { locale?: "en" | "fr"; today?: string } = {},
): UpcomingAnnouncement[] {
  const bySlug = new Map(projects.map(project => [project.slug.current, project]));
  // Prefer the CMS record if it exists, even when it is no longer upcoming.
  for (const fallback of christmasAnnouncements) {
    if (!bySlug.has(fallback.slug.current)) bySlug.set(fallback.slug.current, fallback);
  }

  return Array.from(bySlug.values())
    .flatMap(project => {
      if (!project.announcementOnly || !project.startDate ||
          !getProjectLifecycleState(project, options).isUpcoming) return [];
      return [{
        slug: project.slug.current,
        title: outreachDisplayTitle(project, options.locale ?? "en"),
        date: project.startDate,
      }];
    })
    .sort((first, second) => first.date.localeCompare(second.date));
}
