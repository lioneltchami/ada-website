import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import registry from "../config/outreach-naming.json";
import { archiveProjectDisplayTitle } from "../src/lib/archive-project-display-title";
import { outreachDisplayTitle, outreachTitleLocation } from "../src/lib/outreach-display-title";

const titles = (slug: string, title = "Legacy title", titleFr = "Ancien titre") => {
  const record = { slug: { current: slug }, title, titleFr };
  return [
    archiveProjectDisplayTitle(record, "en"),
    archiveProjectDisplayTitle(record, "fr"),
  ];
};

describe("public outreach display names", () => {
  it.each([
    ["first-widow-home-visits-2021", "Widows Outreach · Buea", "Action de soutien aux veuves · Buea"],
    ["widow-support-food-cash-mar-2022", "Widows Outreach · Muea", "Action de soutien aux veuves · Muea"],
    ["womens-day-widows-outreach-2025", "Widows Outreach", "Action de soutien aux veuves"],
    ["back-to-school-bamenda-aug-2026", "Back to School Outreach · Bamenda", "Action de rentrée scolaire · Bamenda"],
    ["back-to-school-buea-aug-2026", "Back to School Outreach · Buea", "Action de rentrée scolaire · Buea"],
    ["christmas-giving-dec-2022", "Christmas Giving Outreach · Buea", "Action de solidarité de Noël · Buea"],
    ["christmas-giving-bamenda-dec-2026", "Christmas Giving Outreach · Bamenda", "Action de solidarité de Noël · Bamenda"],
    ["school-visit-may-2022", "School Visit Outreach · Buea", "Action de visite scolaire · Buea"],
  ])("normalizes %s in both languages", (slug, en, fr) => {
    expect(titles(slug)).toEqual([en, fr]);
  });

  it("keeps every registered title bilingual and independent of the slug field shape", () => {
    expect(Object.keys(registry.outreaches)).toHaveLength(25);
    for (const [slug, entry] of Object.entries(registry.outreaches)) {
      const series = registry.series[entry.series as keyof typeof registry.series];
      expect(series.en.endsWith("Outreach")).toBe(true);
      expect(series.fr.startsWith("Action ")).toBe(true);
      expect(["en", "fr"].map(locale => outreachDisplayTitle({ slug, title: "legacy" }, locale as "en" | "fr"))).toEqual(titles(slug));
    }
    expect(outreachTitleLocation("womens-day-widows-outreach-2025")).toBeUndefined();
  });

  it.each([
    "idp-children-education-fund",
    "education-orphans",
    "widow-support",
    "education-drive",
    "christmas-giving",
    "emergency-relief",
    "back-to-school-bamenda-aug-2025",
    "back-to-school-buea-2025",
    "christmas-orphanage-outreach-2025",
    "__proto__",
  ])("leaves unregistered, withdrawn or program titles alone: %s", (slug) => {
    expect(titles(slug)).toEqual(["Legacy title", "Ancien titre"]);
  });

  it("uses the canonical display on both archive lists and the detail heading", () => {
    for (const [prefix, locale] of [["", "en"], ["fr/", "fr"]]) {
      const index = readFileSync(`src/pages/${prefix}projects/archive/index.astro`, "utf8");
      expect(index).toContain(`archiveProjectDisplayTitle(r, "${locale}")`);
      expect(index).toContain("data-outreach-title={r.slug.current}");
    }
    const detail = readFileSync("src/components/projects/ArchiveProjectDetail.astro", "utf8");
    expect(detail).toContain("archiveProjectDisplayTitle(record, locale)");
    expect(detail).toContain("data-outreach-title={slug}");
  });
});
