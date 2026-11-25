import { describe, expect, it } from "vitest";
import {
  currentIsoDate,
  getProjectLifecycleState,
  isProjectFundable,
  projectStatusLabel,
} from "../src/lib/project-lifecycle";

describe("project lifecycle", () => {
  it("formats the current date as YYYY-MM-DD", () => {
    expect(currentIsoDate(new Date("2026-05-27T15:30:00.000Z"))).toBe(
      "2026-05-27",
    );
  });

  it.each([
    ["2026-05-20", "active", false, false, true],
    ["2026-05-21", "active", false, true, false],
    ["2026-05-26", "active", false, true, false],
    ["2026-05-27", "completed", true, true, false],
    ["2026-05-28", "completed", true, true, false],
  ])("applies the seven-day archive delay without extending fundraising on %s", (today, status, isAutoCompleted, hasEnded, isFundable) => {
    expect(
      getProjectLifecycleState({ status: "active", endDate: "2026-05-20" }, { today }),
    ).toMatchObject({ status, isAutoCompleted, hasEnded, isFundable });
  });

  it("ignores both early and late archive overrides on dated projects", () => {
    for (const archiveAfterDate of ["2026-05-20", "2026-06-15"]) {
      const project = { status: "active", endDate: "2026-05-20", archiveAfterDate } as const;
      expect(getProjectLifecycleState(project, { today: "2026-05-26" }).status).toBe("active");
      expect(getProjectLifecycleState(project, { today: "2026-05-27" }).isAutoCompleted).toBe(true);
    }
  });

  it("uses startDate as the anchor when no endDate is set, including across years", () => {
    const project = {
      status: "active",
      startDate: "2026-12-29",
      archiveAfterDate: "2026-12-31",
    } as const;
    expect(getProjectLifecycleState(project, { today: "2026-12-28" }).status).toBe("upcoming");
    expect(getProjectLifecycleState(project, { today: "2027-01-04" }).status).toBe("active");
    expect(getProjectLifecycleState(project, { today: "2027-01-05" }).isAutoCompleted).toBe(true);
  });

  it("retains the legacy override for projects with neither start nor end dates", () => {
    const project = { status: "active", archiveAfterDate: "2026-05-20" } as const;
    expect(getProjectLifecycleState(project, { today: "2026-05-20" }).status).toBe("active");
    expect(getProjectLifecycleState(project, { today: "2026-05-21" }).isAutoCompleted).toBe(true);
    expect(getProjectLifecycleState({ status: "active" }, { today: "2026-05-21" }).isAutoCompleted).toBe(false);
  });

  it("respects manual lifecycle overrides", () => {
    expect(
      getProjectLifecycleState(
        {
          status: "active",
          endDate: "2026-05-20",
          autoArchiveAfterEndDate: false,
        },
        { today: "2026-05-27" },
      ).status,
    ).toBe("active");

    expect(
      getProjectLifecycleState(
        { status: "paused", endDate: "2026-05-20" },
        { today: "2026-05-27" },
      ).status,
    ).toBe("paused");

    expect(
      getProjectLifecycleState(
        { status: "completed", endDate: "2026-05-28" },
        { today: "2026-05-27" },
      ).status,
    ).toBe("completed");
  });

  it("builds archive links only when an archive record is linked", () => {
    expect(
      getProjectLifecycleState({
        status: "completed",
        archiveRecord: { slug: { current: "school-drive-2026" } },
      }),
    ).toMatchObject({
      archiveHref: "/projects/archive/school-drive-2026",
      archiveReady: true,
    });

    expect(
      getProjectLifecycleState(
        {
          status: "completed",
          archiveRecord: { slug: { current: "school-drive-2026" } },
        },
        { locale: "fr" },
      ).archiveHref,
    ).toBe("/fr/projects/archive/school-drive-2026");

    expect(getProjectLifecycleState({ status: "completed" })).toMatchObject({
      archiveHref: "",
      archiveReady: false,
    });
  });

  it("marks active projects as upcoming before startDate", () => {
    expect(
      getProjectLifecycleState(
        {
          status: "active",
          startDate: "2026-08-15",
          endDate: "2026-08-18",
        },
        { today: "2026-07-19" },
      ),
    ).toMatchObject({
      status: "upcoming",
      isUpcoming: true,
      hasStarted: false,
      hasEnded: false,
    });

    expect(
      getProjectLifecycleState(
        {
          status: "active",
          startDate: "2026-08-15",
          endDate: "2026-08-18",
        },
        { today: "2026-08-15" },
      ),
    ).toMatchObject({
      status: "active",
      isUpcoming: false,
      hasStarted: true,
    });
  });

  it("uses the end rather than the start for a multi-day outreach", () => {
    const project = {
      status: "active",
      startDate: "2026-08-15",
      endDate: "2026-08-18",
      archiveAfterDate: "2026-08-18",
    } as const;
    expect(getProjectLifecycleState(project, { today: "2026-08-22" }).status).toBe("active");
    expect(getProjectLifecycleState(project, { today: "2026-08-24" }).isAutoCompleted).toBe(false);
    expect(getProjectLifecycleState(project, { today: "2026-08-25" })).toMatchObject({
      status: "completed",
      isAutoCompleted: true,
      hasEnded: true,
    });
  });

  it("treats upcoming campaigns as fundable", () => {
    expect(isProjectFundable("upcoming")).toBe(true);
    expect(isProjectFundable("active")).toBe(true);
    expect(isProjectFundable("completed")).toBe(false);
    expect(isProjectFundable("paused")).toBe(false);
  });

  it("returns localized status labels", () => {
    expect(projectStatusLabel("upcoming")).toBe("Upcoming");
    expect(projectStatusLabel("active")).toBe("Active");
    expect(projectStatusLabel("completed")).toBe("Completed");
    expect(projectStatusLabel("paused")).toBe("Paused");
    expect(projectStatusLabel("upcoming", "fr")).toBe("À venir");
    expect(projectStatusLabel("active", "fr")).toBe("Actif");
    expect(projectStatusLabel("completed", "fr")).toBe("Terminé");
    expect(projectStatusLabel("paused", "fr")).toBe("En pause");
  });
});
