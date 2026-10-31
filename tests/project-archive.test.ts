import { describe, expect, it } from "vitest";
import { toAutoArchiveEntry } from "../src/lib/project-archive";

describe("automatically archived project localization", () => {
  it("preserves published French titles and descriptions", () => {
    const project = {
      _id: "project-education-orphans",
      title: "Education for Orphans",
      titleFr: "L’éducation des enfants orphelins",
      slug: { current: "education-orphans" },
      status: "completed",
      location: "Douala",
      description: "Comprehensive education support for orphaned children.",
      descriptionFr: "Un accompagnement scolaire complet pour les enfants orphelins.",
      beneficiaries: 0,
      goalAmount: 0,
      raisedAmount: 0,
      sortOrder: 0,
    } as Parameters<typeof toAutoArchiveEntry>[0];

    expect(toAutoArchiveEntry(project)).toMatchObject({
      title: "Education for Orphans",
      titleFr: "L’éducation des enfants orphelins",
      description: "Comprehensive education support for orphaned children.",
      descriptionFr: "Un accompagnement scolaire complet pour les enfants orphelins.",
      autoArchived: true,
    });
  });

  it("falls back to English only when a French value is missing", () => {
    const project = {
      _id: "project-example",
      title: "Example project",
      slug: { current: "example-project" },
      status: "completed",
      location: "Bamenda",
      description: "Example description.",
      beneficiaries: 0,
      goalAmount: 0,
      raisedAmount: 0,
      sortOrder: 0,
    } as Parameters<typeof toAutoArchiveEntry>[0];

    expect(toAutoArchiveEntry(project)).toMatchObject({
      titleFr: "Example project",
      descriptionFr: "Example description.",
      autoArchived: true,
    });
  });
});
