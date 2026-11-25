import announcements from "../data/christmas-announcements.json";
import type { SanityProject } from "./sanity";

export const CHRISTMAS_OUTREACH_DATE = "2026-12-20";

export const christmasAnnouncements: SanityProject[] = announcements.map(
  ({ slug, ...content }, index) => ({
    ...content,
    _id: `project-${slug}`,
    slug: { current: slug },
    status: "active",
    outreachCategory: "christmas",
    announcementOnly: true,
    autoArchiveAfterEndDate: true,
    beneficiaries: 0,
    goalAmount: 0,
    raisedAmount: 0,
    sortOrder: -20 + index,
    startDate: CHRISTMAS_OUTREACH_DATE,
  }),
);

export function isChristmasAnnouncementSlug(slug?: string | null): boolean {
  return christmasAnnouncements.some((project) => project.slug.current === slug);
}
