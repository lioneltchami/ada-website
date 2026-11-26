import announcements from "../data/christmas-announcements.json";
import type { SanityProject } from "./sanity";
import { outreachSeriesTitle } from "./outreach-display-title";

export const CHRISTMAS_OUTREACH_DATE = "2026-12-20";

export const christmasAnnouncements: SanityProject[] = announcements.map(
  ({ slug, ...content }, index) => {
    const title = outreachSeriesTitle(slug, "en");
    const titleFr = outreachSeriesTitle(slug, "fr");
    if (!title || !titleFr) throw new Error(`Missing bilingual outreach title: ${slug}`);
    return {
      ...content,
      title,
      titleFr,
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
    };
  },
);

export function isChristmasAnnouncementSlug(slug?: string | null): boolean {
  return christmasAnnouncements.some((project) => project.slug.current === slug);
}


/** Publication of these plans does not release reports, finances or fundraising. */
export const christmasPlanningDocuments = christmasAnnouncements.map((project) => ({
  slug: project.slug.current,
  title: project.title,
  titleFr: project.titleFr || project.title,
  tor: `/docs/projects/${project.slug.current}/tor.pdf`,
}));

export function christmasPlanTor(slug?: string, startDate?: string): string | undefined {
  if (startDate !== CHRISTMAS_OUTREACH_DATE) return undefined;
  return christmasPlanningDocuments.find((project) => project.slug === slug)?.tor;
}
