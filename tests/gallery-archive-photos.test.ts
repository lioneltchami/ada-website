import { existsSync } from "node:fs";
import { expect, it } from "vitest";
import { getArchiveGalleryPhotos } from "../src/data/gallery-archive-photos";

it("exposes only the five approved archive photos with exact bilingual records", () => {
  const en = getArchiveGalleryPhotos("en");
  const fr = getArchiveGalleryPhotos("fr");
  expect(en.map(({ archiveSlug }) => archiveSlug)).toEqual([
    "city-cleanup-may-2023", "christmas-giving-dec-2022", "back-to-school-sep-2022",
    "idp-girls-baking-training-jul-2022", "widow-support-food-cash-mar-2022",
  ]);
  expect(en.map(({ year }) => year)).toEqual([2023, 2022, 2022, 2022, 2022]);
  expect(fr.map(({ src }) => src)).toEqual(en.map(({ src }) => src));
  for (const [index, photo] of en.entries()) {
    expect(existsSync(`public${photo.src}`)).toBe(true);
    expect(photo.alt).not.toBe(fr[index].alt);
    expect(photo.caption).not.toBe(fr[index].caption);
  }
});
