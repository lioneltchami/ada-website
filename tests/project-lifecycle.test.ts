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

  it("auto-completes active projects only after the end date passes", () => {
    expect(
      getProjectLifecycleState(
        { status: "active", endDate: "2026-05-26" },
        { today: "2026-05-27" },
      ),
    ).toMatchObject({
      status: "completed",
      isAutoCompleted: true,
      hasEnded: true,
    });

    expect(
      getProjectLifecycleState(
        { status: "active", endDate: "2026-05-27" },
        { today: "2026-05-27" },
      ).status,
    ).toBe("active");

    expect(
      getProjectLifecycleState(
        { status: "active", endDate: "2026-05-28" },
        { today: "2026-05-27" },
      ).status,
    ).toBe("active");
  });

  it("uses archiveAfterDate as the completion trigger when present", () => {
    expect(
      getProjectLifecycleState(
        {
          status: "active",
          endDate: "2026-05-20",
          archiveAfterDate: "2026-05-30",
        },
        { today: "2026-05-27" },
      ),
    ).toMatchObject({
      status: "active",
      hasEnded: true,
      isAutoCompleted: false,
    });

    expect(
      getProjectLifecycleState(
        {
          status: "active",
          endDate: "2026-05-20",
          archiveAfterDate: "2026-05-26",
        },
        { today: "2026-05-27" },
      ).status,
    ).toBe("completed");
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

  it("auto-archives after the 3-day outreach window ends", () => {
    expect(
      getProjectLifecycleState(
        {
          status: "active",
          startDate: "2026-08-15",
          endDate: "2026-08-18",
          archiveAfterDate: "2026-08-18",
        },
        { today: "2026-08-19" },
      ),
    ).toMatchObject({
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
