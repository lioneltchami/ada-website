import { describe, expect, it } from "vitest";
import {
  countOwnerMarkedCompletions,
  toFallbackArchiveEntry,
  toAutoArchiveEntry,
} from "../src/lib/project-archive";
import { getProjectLifecycleState } from "../src/lib/project-lifecycle";

describe("automatically archived project localization", () => {
  it("preserves published French titles and descriptions", () => {
    const project = {
      _id: "project-education-orphans",
      title: "Education for Orphans",
      titleFr: "L’éducation des enfants orphelins",
      slug: { current: "education-orphans" },
      status: "active",
      location: "Douala",
      endDate: "2024-12-31",
      autoArchiveAfterEndDate: true,
      description: "Comprehensive education support for orphaned children.",
      descriptionFr:
        "Un accompagnement scolaire complet pour les enfants orphelins.",
      beneficiaries: 0,
      goalAmount: 0,
      raisedAmount: 0,
      sortOrder: 0,
    } as Parameters<typeof toAutoArchiveEntry>[0];

    const lifecycle = getProjectLifecycleState(project, {
      today: "2025-01-01",
    });
    expect(lifecycle.isAutoCompleted).toBe(true);
    expect(toAutoArchiveEntry(project, lifecycle)).toMatchObject({
      title: "Education for Orphans",
      titleFr: "L’éducation des enfants orphelins",
      description: "Comprehensive education support for orphaned children.",
      descriptionFr:
        "Un accompagnement scolaire complet pour les enfants orphelins.",
      autoArchived: true,
    });
  });

  it("falls back to English only when a French value is missing", () => {
    const project = {
      _id: "project-example",
      title: "Example project",
      slug: { current: "example-project" },
      status: "active",
      location: "Bamenda",
      endDate: "2024-12-31",
      autoArchiveAfterEndDate: true,
      description: "Example description.",
      beneficiaries: 0,
      goalAmount: 0,
      raisedAmount: 0,
      sortOrder: 0,
    } as Parameters<typeof toAutoArchiveEntry>[0];

    const lifecycle = getProjectLifecycleState(project, {
      today: "2025-01-01",
    });
    expect(toAutoArchiveEntry(project, lifecycle)).toMatchObject({
      titleFr: "Example project",
      descriptionFr: "Example description.",
      autoArchived: true,
    });
  });

  it("keeps manually completed projects separate from end-date archives", () => {
    const project = {
      _id: "project-manual-completion",
      title: "Manually completed project",
      slug: { current: "manually-completed-project" },
      status: "completed",
      location: "Buea",
      description: "A manually completed project.",
      beneficiaries: 0,
      goalAmount: 0,
      raisedAmount: 0,
      sortOrder: 0,
    } as Parameters<typeof toAutoArchiveEntry>[0];

    expect(toAutoArchiveEntry(project).autoArchived).toBe(false);
  });

  it("keeps curated fallback archive records distinct from date-based entries", () => {
    expect(
      toFallbackArchiveEntry({
        slug: "curated-record",
        title: "Curated archive record",
        year: 2021,
        demographic: "community",
      }),
    ).toMatchObject({
      status: "completed",
      autoArchived: false,
    });
  });
});

describe("owner-marked archive completion counts", () => {
  it("excludes records completed only by the automatic end-date rule", () => {
    expect(
      countOwnerMarkedCompletions([
        { status: "completed", autoArchived: false },
        { status: "completed", autoArchived: true },
        { status: "ongoing", autoArchived: false },
        { status: "planned", autoArchived: false },
        { status: "completed" },
      ]),
    ).toBe(2);
  });
});
