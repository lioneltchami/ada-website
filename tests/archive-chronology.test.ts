import { describe, expect, it } from "vitest";
import releases from "../config/project-document-releases.json";
import reviewed2023 from "../config/project-records-2023.json";
import { formatArchiveCardMonth, sortArchiveEntriesChronologically } from "../src/lib/project-archive";

describe("archive chronology", () => {
  it("uses verified 2022 activity dates rather than titles or misleading slug months", () => {
    const records = releases.projects.filter((item) => item.status === "released")
      .map(({ slug, archive }) => ({ ...archive, slug: { current: slug }, year: 2022 }));
    const scrambled = [...records].sort((a, b) => a.title.localeCompare(b.title));
    const result = sortArchiveEntriesChronologically(scrambled);
    expect(result.map((item) => item.slug.current)).toEqual([
      "christmas-giving-dec-2022",
      "back-to-school-sep-2022",
      "idp-girls-baking-training-jul-2022",
      "school-visit-may-2022",
      "widow-support-food-cash-mar-2022",
      "school-supply-distribution-feb-2022",
    ]);
    expect(result.find((item) => item.slug.current === "back-to-school-sep-2022")?.startDate).toBe("2022-08-12");
    expect(result.find((item) => item.slug.current === "idp-girls-baking-training-jul-2022")?.startDate).toBeFalsy();
  });

  it("respects reported February ordering without assigning the Mountain Race a day", () => {
    const records = reviewed2023.projects.filter((item) => item.slug.includes("feb-2023") || item.slug.includes("mar-2023"))
      .map((item) => ({ ...item, slug: { current: item.slug }, startDate: item.startDate ?? undefined, endDate: item.endDate ?? undefined })).reverse();
    const result = sortArchiveEntriesChronologically(records);
    expect(result.map((item) => item.slug.current)).toEqual([
      "womens-day-home-visits-mar-2023", "mountain-race-outreach-feb-2023", "youth-day-snacks-feb-2023",
    ]);
    expect(result[1].startDate).toBeUndefined();
  });

  it("displays localized months using source timing rather than implied months in slugs", () => {
    const august = { slug: { current: "back-to-school-sep-2022" }, year: 2022, startDate: "2022-08-12" };
    const july = { slug: { current: "idp-girls-baking-training-jul-2022" }, year: 2022 };
    const unknown = { slug: { current: "back-to-school-drive-2023" }, year: 2023 };
    expect(formatArchiveCardMonth(august, "en")).toBe("August");
    expect(formatArchiveCardMonth(august, "fr")).toBe("août");
    expect(formatArchiveCardMonth(july, "en")).toBe("July");
    expect(formatArchiveCardMonth(july, "fr")).toBe("juillet");
    expect(formatArchiveCardMonth(unknown, "en")).toBeUndefined();
  });

  it("uses confirmed months for historically dated summaries without promoting prep dates", () => {
    const records = [
      { slug: { current: "first-widow-home-visits-2021" }, year: 2021 },
      { slug: { current: "girls-programme-2024" }, year: 2024 },
      { slug: { current: "womens-day-widows-outreach-2025" }, year: 2025 },
      { slug: { current: "christmas-orphanage-outreach-2025" }, year: 2025 },
      { slug: { current: "back-to-school-buea-2024" }, year: 2024 },
      { slug: { current: "back-to-school-buea-2025" }, year: 2025 },
    ];
    expect(records.map((record) => formatArchiveCardMonth(record, "en")))
      .toEqual(["November", "October", "March", "December", undefined, undefined]);
    expect(records.map((record) => formatArchiveCardMonth(record, "fr")))
      .toEqual(["novembre", "octobre", "mars", "décembre", undefined, undefined]);
    expect(sortArchiveEntriesChronologically(records).map((record) => record.slug.current)).toEqual([
      "christmas-orphanage-outreach-2025", "womens-day-widows-outreach-2025",
      "back-to-school-buea-2025", "girls-programme-2024",
      "back-to-school-buea-2024", "first-widow-home-visits-2021",
    ]);
  });

  it("keeps year groups newest first, dates first within year, and deterministic untranslated ties", () => {
    const records = [
      { slug: { current: "m-unknown" }, year: 2025, title: "A", startDate: "2025-02-30" },
      { slug: { current: "z-ended" }, year: 2025, title: "B", endDate: "2025-01-02" },
      { slug: { current: "c-older" }, year: 2024, title: "C", startDate: "2024-01-01" },
      { slug: { current: "a-started" }, year: 2025, title: "Z", startDate: "2025-01-02", endDate: "2025-05-01" },
      { slug: { current: "b-unknown" }, year: 2025, title: "Y" },
      { slug: { current: "jan-month-only" }, year: 2025, title: "F", startDate: "2025-01" },
      { slug: { current: "feb-dated" }, year: 2025, title: "E", startDate: "2025-02-01" },
    ];
    const original = records.map(({ slug }) => slug.current);
    expect(sortArchiveEntriesChronologically(records).map(({ slug }) => slug.current)).toEqual([
      "feb-dated", "jan-month-only", "a-started", "z-ended", "b-unknown", "m-unknown", "c-older",
    ]);
    expect(records.map(({ slug }) => slug.current)).toEqual(original);
  });
});
