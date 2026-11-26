import { describe, expect, it } from "vitest";
import { galleryMosaicHref } from "../src/lib/gallery";
import { localePath } from "../src/i18n";

describe("gallery mosaic links", () => {
  it("takes visitors to the gallery in their current language instead of a campaign", () => {
    expect(localePath(galleryMosaicHref(), "en")).toBe("/gallery");
    expect(localePath(galleryMosaicHref(), "fr")).toBe("/fr/gallery");
  });
});
