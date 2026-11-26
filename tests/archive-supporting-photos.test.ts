import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { getArchiveFeaturePhoto } from "../src/data/archive-feature-photos";
import { getArchiveSupportingPhotos } from "../src/data/archive-supporting-photos";

describe("archive supporting photos", () => {
  it("limits additions to non-identifying details from the same released reports", () => {
    const releases = [
      ["back-to-school-sep-2022", "09ffa3569d465c4cb53618011421db5511b1ad704f224613dc363474908ff9bd"],
      ["christmas-giving-dec-2022", "71ec0e8d6c5cde060c73bbf82e0633a0a9cb49f1cf076b640319be14f8812a3f"],
      ["idp-girls-baking-training-jul-2022", "81545a97c01da737e12ce1c60268384bf13d31367a4d5f7c50c970a01a912086"],
      ["school-supply-distribution-feb-2022", "303bb383a98bd285ed25393647ea95ea139542e8fd138ca719026eb9235e4891"],
      ["widow-support-food-cash-mar-2022", "7ac574e1c89acfbaa8bcf6cfbdf5e2c8c67f05bb77a83f39e7938a21a384d9b2"],
    ];
    for (const [slug, hash] of releases) {
      const english = getArchiveSupportingPhotos(slug, "en");
      const french = getArchiveSupportingPhotos(slug, "fr");
      expect(english).toHaveLength(1);
      expect(french).toHaveLength(1);
      const [en] = english;
      const [fr] = french;
      expect(en.src).toBe(fr.src);
      expect(en.src).not.toBe(getArchiveFeaturePhoto(slug, "en")?.src);
      expect(en.alt).not.toBe(fr.alt);
      expect(en.caption).not.toBe(fr.caption);
      expect(createHash("sha256").update(readFileSync("public" + en.src)).digest("hex")).toBe(hash);
    }
    for (const slug of ["__proto__", "back-to-school-bamenda-aug-2026", "school-visit-may-2022", "city-cleanup-may-2025"]) {
      expect(getArchiveSupportingPhotos(slug, "en")).toEqual([]);
    }
  });

  it("renders only in the process section, on the shared bilingual detail", () => {
    const template = readFileSync("src/components/projects/ArchiveProjectDetail.astro", "utf8");
    expect(template).toContain('heading === processHeading ? supportingPhotos : []');
    expect(template).toContain('photo.src !== featurePhoto?.src');
    const figure = readFileSync("src/components/projects/ArchiveSupportingPhoto.astro", "utf8");
    expect(figure).toContain("loading=\"lazy\"");
    expect(figure).toContain("<figcaption");
  });
});
