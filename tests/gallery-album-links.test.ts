import { describe, expect, it } from "vitest";
import { getArchiveGalleryAlbums } from "../src/data/gallery-albums";
import { getArchiveGalleryAlbumHref, getGalleryAlbumId } from "../src/lib/gallery-album-links";

const completed = (slug: string) => ({ slug: { current: slug }, status: "completed" as const });

describe("approved archive-to-gallery albums", () => {
  it("targets the matching album on the same-language Gallery route", () => {
    for (const locale of ["en", "fr"] as const) {
      const albums = getArchiveGalleryAlbums(locale);
      expect(albums.length).toBeGreaterThan(0);
      expect(new Set(albums.map(({ archiveSlug }) => getGalleryAlbumId(archiveSlug))).size).toBe(albums.length);
      for (const { archiveSlug } of albums) {
        const href = getArchiveGalleryAlbumHref(completed(archiveSlug), locale);
        expect(href).toBe(`${locale === "fr" ? "/fr" : ""}/gallery/#album-${archiveSlug}`);
      }
    }
  });

  it("does not link records without published albums or make fuzzy matches", () => {
    for (const slug of ["school-visit-may-2022", "girls-dignity-menstrual-health-bamenda-jun-2026", "widow-support", "toString"]) {
      expect(getArchiveGalleryAlbumHref(completed(slug), "en")).toBeUndefined();
      expect(getArchiveGalleryAlbumHref(completed(slug), "fr")).toBeUndefined();
    }
  });

  it("does not treat a past date or incomplete record as a completed outreach", () => {
    const record = completed("widow-support-food-cash-mar-2022");
    expect(getArchiveGalleryAlbumHref({ ...record, autoArchived: true }, "en")).toBeUndefined();
    expect(getArchiveGalleryAlbumHref({ ...record, status: "ongoing" }, "en")).toBeUndefined();
    expect(getArchiveGalleryAlbumHref({ ...record, status: "planned" }, "fr")).toBeUndefined();
  });
});
