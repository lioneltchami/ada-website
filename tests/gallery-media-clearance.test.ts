import { describe, expect, it } from "vitest";
import { getClearedGalleryMedia, isWithheldGalleryAsset } from "../src/lib/gallery-media-clearance";

const schoolPhoto = "efa3a07277351eb6f5bbb587fa2babd234c50d8f";
const legacyCleanupPhoto = "02bd09413bd429a7cb9677a9368392642774671e";
const knownSchoolRef = `image-${schoolPhoto}-800x450-jpg`;
const unknownRef = "image-1111111111111111111111111111111111111111-800x450-jpg";

describe("gallery media clearance", () => {
  it("recognizes exact held images independently of the CMS document or CDN resizing", () => {
    expect(isWithheldGalleryAsset(knownSchoolRef)).toBe(true);
    expect(isWithheldGalleryAsset(`https://cdn.sanity.io/images/project/production/${schoolPhoto}-800x450.jpg?w=400&auto=format`)).toBe(true);
    expect(isWithheldGalleryAsset(`//cdn.sanity.io/images/project/production/${legacyCleanupPhoto}-800x600.jpg?rect=0,0,800,600`)).toBe(true);
  });

  it("does not mark unrelated or local files as specifically held", () => {
    expect(isWithheldGalleryAsset(unknownRef)).toBe(false);
    expect(isWithheldGalleryAsset(`https://example.org/images/project/production/${schoolPhoto}-800x450.jpg`)).toBe(false);
    expect(isWithheldGalleryAsset("/images/provenance-cleared-project-photo.webp")).toBe(false);
    expect(isWithheldGalleryAsset(null)).toBe(false);
  });

  it("fails closed for held and unreviewed images, including new images on old records", () => {
    expect(getClearedGalleryMedia("gallery-14", knownSchoolRef)).toBeUndefined();
    expect(getClearedGalleryMedia("unreviewed", knownSchoolRef)).toBeUndefined();
    expect(getClearedGalleryMedia("gallery-14", unknownRef)).toBeUndefined();
    expect(getClearedGalleryMedia("unreviewed", unknownRef)).toBeUndefined();
    expect(getClearedGalleryMedia("gallery-14", null)).toBeUndefined();
  });
});
