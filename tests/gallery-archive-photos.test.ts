import { existsSync } from "node:fs";
import { expect, it } from "vitest";
import { getArchiveGalleryAlbums } from "../src/data/gallery-albums";
import { getArchiveGalleryPhotos } from "../src/data/gallery-archive-photos";

it("exposes only the ten approved archive cover photos with exact bilingual records", () => {
  const en = getArchiveGalleryPhotos("en");
  const fr = getArchiveGalleryPhotos("fr");
  expect(en.map(({ archiveSlug }) => archiveSlug)).toEqual([
    "prenatal-care-support-program", "city-cleanup-may-2025", "back-to-school-buea-2024",
    "city-cleanup-may-2023", "christmas-giving-dec-2022", "back-to-school-sep-2022",
    "idp-girls-baking-training-jul-2022", "widow-support-food-cash-mar-2022",
    "school-supply-distribution-feb-2022", "first-widow-home-visits-2021",
  ]);
  expect(en.map(({ year }) => year)).toEqual([2025, 2025, 2024, 2023, 2022, 2022, 2022, 2022, 2022, 2021]);
  expect(fr.map(({ src }) => src)).toEqual(en.map(({ src }) => src));
  for (const [index, photo] of en.entries()) {
    expect(existsSync(`public${photo.src}`)).toBe(true);
    expect(photo.alt).not.toBe(fr[index].alt);
    expect(photo.caption).not.toBe(fr[index].caption);
  }
});

it("groups media under the exact same bilingual outreach", () => {
  const en = getArchiveGalleryAlbums("en");
  const fr = getArchiveGalleryAlbums("fr");
  expect(en.map(({ archiveSlug }) => archiveSlug)).toEqual(fr.map(({ archiveSlug }) => archiveSlug));
  for (const [index, album] of en.entries()) {
    expect(album.title).not.toEqual(fr[index].title);
    expect(album.thumbnail).toMatch(/^\/images\/gallery-thumbnails\//);
    expect(existsSync(`public${album.thumbnail}`)).toBe(true);
    expect(album.thumbnail).not.toBe(album.items[0].src);
    expect(album.items.map(({ src }) => src)).toEqual(fr[index].items.map(({ src }) => src));
  }
  expect(en.reduce((total, album) => total + album.items.length, 0)).toBe(15);
  expect(en.filter(({ items }) => items.length > 1)).toHaveLength(5);
});
