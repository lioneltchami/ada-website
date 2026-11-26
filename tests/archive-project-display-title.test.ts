import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { archiveProjectDisplayTitle } from "../src/lib/archive-project-display-title";

const titles = (slug: string, title = "Legacy title", titleFr = "Ancien titre") => {
  const record = { slug: { current: slug }, title, titleFr };
  return [
    archiveProjectDisplayTitle(record, "en"),
    archiveProjectDisplayTitle(record, "fr"),
  ];
};

describe("recurring archive project display names", () => {
  it.each([
    ["first-widow-home-visits-2021", "Widows Outreach", "Action auprès des veuves"],
    ["widow-support-food-cash-mar-2022", "Widows Outreach", "Action auprès des veuves"],
    ["womens-day-home-visits-mar-2023", "Widows Outreach", "Action auprès des veuves"],
    ["womens-day-widows-outreach-2025", "Widows Outreach", "Action auprès des veuves"],
    ["back-to-school-sep-2022", "Back to School", "Rentrée scolaire"],
    ["back-to-school-drive-2023", "Back to School", "Rentrée scolaire"],
    ["back-to-school-buea-2024", "Back to School", "Rentrée scolaire"],
    ["back-to-school-bamenda-aug-2026", "Back to School", "Rentrée scolaire"],
    ["back-to-school-buea-aug-2026", "Back to School", "Rentrée scolaire"],
    ["christmas-giving-dec-2022", "Christmas Giving", "Dons de Noël"],
    ["christmas-giving-dec-2023", "Christmas Giving", "Dons de Noël"],
    ["christmas-giving-dec-2024", "Christmas Giving", "Dons de Noël"],
  ])("normalizes %s in both languages", (slug, en, fr) => {
    expect(titles(slug)).toEqual([en, fr]);
  });

  it.each([
    "school-supply-distribution-feb-2022",
    "school-visit-may-2022",
    "idp-children-education-fund",
    "education-orphans",
    "widow-support-program-cohort-3",
  ])("does not merge the unrelated %s with a named series", (slug) => {
    expect(titles(slug)).toEqual(["Legacy title", "Ancien titre"]);
  });

  it.each([
    "back-to-school-bamenda-aug-2025",
    "back-to-school-buea-2025",
    "christmas-orphanage-outreach-2025",
  ])("does not assign a shared series title to the withdrawn %s", (slug) => {
    expect(titles(slug)).toEqual(["Legacy title", "Ancien titre"]);
  });

  it("keeps distinct links and location hints on the two same-year Back to School cards", () => {
    for (const [prefix, locale] of [["", "en"], ["fr/", "fr"]]) {
      const index = readFileSync(`src/pages/${prefix}projects/archive/index.astro`, "utf8");
      expect(index).toContain(`archiveProjectDisplayTitle(r, "${locale}")`);
      expect(index).toContain("r.slug.current");
      expect(index).toContain("r.location");
    }
    const detail = readFileSync("src/components/projects/ArchiveProjectDetail.astro", "utf8");
    expect(detail).toContain("archiveProjectDisplayTitle(record, locale)");
    expect(detail).toContain("record.location");
  });
});
