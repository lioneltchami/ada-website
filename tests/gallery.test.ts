import { describe, expect, it } from "vitest";
import { galleryMosaicHref } from "../src/lib/gallery";
import { localePath } from "../src/i18n";

describe("gallery mosaic links", () => {
  it("takes visitors to the gallery in their current language when there is no verified archive match", () => {
    expect(localePath(galleryMosaicHref(), "en")).toBe("/gallery");
    expect(localePath(galleryMosaicHref(), "fr")).toBe("/fr/gallery");
  });
  it("allows a reviewed archive match in the visitor’s language", () => {
    expect(localePath(galleryMosaicHref("school-visit-may-2022"), "fr")).toBe("/fr/projects/archive/school-visit-may-2022");
  });
});
