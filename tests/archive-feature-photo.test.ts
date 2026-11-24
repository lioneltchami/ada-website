import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { getArchiveFeaturePhoto } from "../src/data/archive-feature-photos";
import { getEligibleArchiveFeaturePhoto } from "../src/lib/archive-eligible-feature-photo";

describe("archive feature photos", () => {
  const slug = "city-cleanup-may-2023";
  it("keeps the approved May team photo byte-identical, with localized text", () => {
    const en = getArchiveFeaturePhoto(slug, "en")!;
    const fr = getArchiveFeaturePhoto(slug, "fr")!;
    expect(en.src).toBe(fr.src);
    expect([en.width, en.height]).toEqual([800, 1066]);
    expect(createHash("sha256").update(readFileSync("public" + en.src)).digest("hex")).toBe("f4d759b81c618bca0204bdbc131798e758d86ad6b8fce28304d504bdddf1417b");
    expect(en.caption).toMatch(/^Some of our team members/);
    expect(fr.caption).toMatch(/^Des membres de notre équipe/);
    expect(en.alt).not.toBe(fr.alt);
    for (const other of ["city-cleanup-may-2022", "school-visit-may-2022", "city-cleanup-may-2025", "city-cleanup-may-2023-test", "__proto__"]) {
      expect(getArchiveFeaturePhoto(other, "en")).toBeUndefined();
      expect(getArchiveFeaturePhoto(other, "fr")).toBeUndefined();
    }
  });

  it("uses the exact reviewed web assets for five non-identifying 2022 photo selections", () => {
    const approved = [
      ["school-supply-distribution-feb-2022", 598, 260, "4221d89929d06b49ddde46baec660eab8be16b3839b64f5f8494f4cb617c9a83"],
      ["widow-support-food-cash-mar-2022", 880, 495, "e4c989452dbd590178b1da3c06095ce03aab8cc0b989a8b37ed2dd3a6e97e762"],
      ["idp-girls-baking-training-jul-2022", 1000, 414, "99ad9c7402e516034ade448fd15ab92ca668b6d8c3450fe476ff75e529e583e5"],
      ["back-to-school-sep-2022", 1280, 519, "102af5607d8f0b091765ed91471d05a55cc81bebf036cb21f074af5a327531dc"],
      ["christmas-giving-dec-2022", 1680, 654, "8cfa72c166d84dd8efe684de69aff8ca52f6298e4faffb9ca0231b0d3ab59940"],
    ] as const;
    for (const [slug, width, height, hash] of approved) {
      const en = getArchiveFeaturePhoto(slug, "en")!;
      const fr = getArchiveFeaturePhoto(slug, "fr")!;
      expect([en.width, en.height]).toEqual([width, height]);
      expect(en.src).toBe(fr.src);
      expect(en.alt).not.toBe(fr.alt);
      expect(en.caption).not.toBe(fr.caption);
      expect(createHash("sha256").update(readFileSync("public" + en.src)).digest("hex")).toBe(hash);
    }
  });

  it("preserves the exact 2026 flyers, in both locales, but not reused or unknown covers", () => {
    const reused = "image-c61680ea417e75d3fcb13f4a245138209cac4eef-800x600-jpg";
    const flyer = "image-48868a7cd8281aea2efd8ae6c3adba6384f9fa04-1024x1024-jpg";
    const record = (slug: string, year: number, ref: string) => ({
      slug: { current: slug }, year, photo: { asset: { _ref: ref } },
    });
    const buea = record("back-to-school-buea-aug-2026", 2026, flyer);
    expect(getEligibleArchiveFeaturePhoto(buea, "en", 240)?.caption).toContain("Event flyer");
    expect(getEligibleArchiveFeaturePhoto(buea, "fr")?.caption).toContain("Affiche");
    expect(getEligibleArchiveFeaturePhoto(buea, "en", 240)?.src).toContain("?w=240");
    expect(getEligibleArchiveFeaturePhoto(record(buea.slug.current, 2026, reused), "en")).toBeUndefined();
    expect(getEligibleArchiveFeaturePhoto(record("first-widow-home-visits-2021", 2021, reused), "en")).toBeUndefined();
    expect(getEligibleArchiveFeaturePhoto(record("education-orphans", 2026, reused), "en")).toBeUndefined();
    expect(getEligibleArchiveFeaturePhoto(record("girls-dignity-menstrual-health-bamenda-jun-2026", 2026, reused), "en")).toBeUndefined();
  });

  it("renders after the lead and mobile document shortcut, before narrative headings", () => {
    const detail = readFileSync("src/components/projects/ArchiveProjectDetail.astro", "utf8");
    expect(detail.indexOf('href="#archive-project-documents"')).toBeLessThan(detail.indexOf("{featurePhoto && ("));
    expect(detail.indexOf("{featurePhoto && (")).toBeLessThan(detail.indexOf("sections.map"));
    expect(detail).toContain("<figcaption");
    expect(detail).toContain("data-archive-feature");
    expect(detail.match(/<figure\b/g)).toHaveLength(1);
    expect(detail).toContain("getEligibleArchiveFeaturePhoto(record, locale)");
    for (const [prefix, locale] of [["", "en"], ["fr/", "fr"]]) {
      const archive = readFileSync(`src/pages/${prefix}projects/archive/index.astro`, "utf8");
      expect(archive).toContain(`getEligibleArchiveFeaturePhoto(r, "${locale}", 240)`);
      expect(archive).toContain("src={r.featurePhoto.src}");
    }
  });
});
