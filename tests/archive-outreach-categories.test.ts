import { describe, expect, it } from "vitest";
import {
  archiveOutreachCategoryIds,
  getArchiveOutreachCategory,
  getArchiveOutreachFilters,
  type ArchiveOutreachCategory,
} from "../src/lib/archive-outreach-categories";

const currentArchive = {
  education: [
    "back-to-school-bamenda-aug-2026",
    "back-to-school-buea-aug-2026",
    "education-orphans",
    "back-to-school-buea-2024",
    "back-to-school-drive-2023",
    "back-to-school-sep-2022",
    "school-visit-may-2022",
    "school-supply-distribution-feb-2022",
  ],
  widows: [
    "womens-day-widows-outreach-2025",
    "womens-day-home-visits-mar-2023",
    "widow-support-food-cash-mar-2022",
    "first-widow-home-visits-2021",
  ],
  "girls-young-women": [
    "girls-dignity-menstrual-health-bamenda-jun-2026",
    "girls-programme-2024",
    "girls-day-oct-2023",
    "idp-girls-baking-training-jul-2022",
  ],
  christmas: [
    "christmas-giving-dec-2024",
    "christmas-giving-dec-2023",
    "christmas-giving-dec-2022",
  ],
  "community-events": [
    "city-cleanup-may-2025",
    "city-cleanup-may-2023",
    "mountain-race-outreach-feb-2023",
    "youth-day-snacks-feb-2023",
  ],
  "maternal-baby": ["prenatal-care-support-program"],
} satisfies Record<ArchiveOutreachCategory, string[]>;

const record = (current: string) => ({ slug: { current } });

describe("public outreach archive categories", () => {
  it("classifies every reviewed archive record by the activity, not the audience", () => {
    const slugs = Object.values(currentArchive).flat();
    expect(new Set(slugs).size).toBe(24);
    for (const id of archiveOutreachCategoryIds) {
      for (const slug of currentArchive[id]) {
        expect(getArchiveOutreachCategory(slug), slug).toBe(id);
      }
    }
  });

  it("uses the same counts and order in both languages, with translated labels", () => {
    const entries = Object.values(currentArchive).flat().reverse().map(record);
    const english = getArchiveOutreachFilters(entries, "en");
    const french = getArchiveOutreachFilters(entries, "fr");
    expect(english).toEqual([
      { id: "all", label: "All", count: 24 },
      { id: "education", label: "Education & School Support", count: 8 },
      { id: "widows", label: "Widows Outreach", count: 4 },
      { id: "girls-young-women", label: "Girls & Young Women", count: 4 },
      { id: "christmas", label: "Christmas Giving", count: 3 },
      { id: "community-events", label: "Community Events & Cleanups", count: 4 },
      { id: "maternal-baby", label: "Maternal & Baby Support", count: 1 },
    ]);
    expect(french.map(({ id, count }) => ({ id, count }))).toEqual(
      english.map(({ id, count }) => ({ id, count })),
    );
    expect(french.map(({ label }) => label)).toEqual([
      "Tous",
      "Éducation et soutien scolaire",
      "Soutien aux veuves",
      "Filles et jeunes femmes",
      "Dons de Noël",
      "Événements et nettoyages communautaires",
      "Soutien aux mères et aux bébés",
    ]);
  });

  it("doesn't render empty categories or guess categories for new records", () => {
    const unreviewed = "back-to-school-new-unreviewed";
    expect(getArchiveOutreachCategory(unreviewed)).toBeUndefined();
    expect(getArchiveOutreachFilters([record(unreviewed), record("prenatal-care-support-program")], "en")).toEqual([
      { id: "all", label: "All", count: 2 },
      { id: "maternal-baby", label: "Maternal & Baby Support", count: 1 },
    ]);
    expect(getArchiveOutreachFilters([], "fr")).toEqual([
      { id: "all", label: "Tous", count: 0 },
    ]);
  });

  it("honors valid CMS categories and safely ignores invalid values", () => {
    const known = "education-orphans";
    const newSlug = "new-outreach";
    expect(getArchiveOutreachCategory(known, "community-events")).toBe("community-events");
    expect(getArchiveOutreachCategory(known, "all")).toBe("education");
    expect(getArchiveOutreachCategory(newSlug, "widows")).toBe("widows");
    expect(getArchiveOutreachCategory(newSlug, { key: "widows" })).toBeUndefined();
    expect(
      getArchiveOutreachFilters([
        { ...record(known), outreachCategory: "community-events" },
        { ...record(newSlug), outreachCategory: "widows" },
        { ...record("another-unreviewed-record"), outreachCategory: "typo" },
      ], "en"),
    ).toEqual([
      { id: "all", label: "All", count: 3 },
      { id: "widows", label: "Widows Outreach", count: 1 },
      { id: "community-events", label: "Community Events & Cleanups", count: 1 },
    ]);
  });
});
