import { describe, expect, it } from "vitest";
import { christmasAnnouncements, christmasPlanTor } from "../src/lib/christmas-announcements";
import { getProjectLifecycleState } from "../src/lib/project-lifecycle";
import { toAutoArchiveEntry } from "../src/lib/project-archive";
import { normalizeFallbackProjects } from "../src/lib/project-fallbacks";

describe("2026 Christmas Giving outreach announcements", () => {
  it.each(christmasAnnouncements)("lists $location on December 20 and archives it seven days later", (project) => {
    expect(christmasPlanTor(project.slug.current, "2026-12-21")).toBeUndefined();
    expect(christmasPlanTor("another-outreach", project.startDate)).toBeUndefined();
    expect(project.startDate).toBe("2026-12-20");
    expect(new Date(project.startDate!).getUTCDay()).toBe(0);
    for (const today of ["2026-12-19", "2026-12-20", "2026-12-26"]) {
      expect(getProjectLifecycleState(project, { today })).toMatchObject({
        status: today === "2026-12-19" ? "upcoming" : "active",
        isAutoCompleted: false,
        isFundable: false,
      });
    }
    for (const locale of ["en", "fr"] as const) {
      const lifecycle = getProjectLifecycleState(project, { today: "2026-12-27", locale });
      expect(lifecycle).toMatchObject({
        isAutoCompleted: true,
        isFundable: false,
        archiveHref: `${locale === "fr" ? "/fr" : ""}/projects/archive/${project.slug.current}`,
      });
      expect(toAutoArchiveEntry(project, lifecycle)).toMatchObject({
        autoArchived: true,
        torUrl: `/docs/projects/${project.slug.current}/tor.pdf`,
        reportUrl: undefined,
        outreachCategory: "christmas",
        budget: undefined,
        beneficiaries: undefined,
      });
      expect(normalizeFallbackProjects({ locale, today: "2026-12-19" }).find(p => p.slug === project.slug.current))
        .toMatchObject({ status: "upcoming", isFundable: false, announcementOnly: true, title: locale === "fr" ? project.titleFr : project.title });
    }
  });
});
