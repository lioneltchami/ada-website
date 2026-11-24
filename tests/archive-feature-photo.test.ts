import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { getArchiveFeaturePhoto } from "../src/data/archive-feature-photos";

describe("archive feature photos", () => {
  const slug = "city-cleanup-may-2023";
  it("allowlists only the exact approved May team photo, with localized text", () => {
    const en = getArchiveFeaturePhoto(slug, "en")!;
    const fr = getArchiveFeaturePhoto(slug, "fr")!;
    expect(en.src).toBe(fr.src);
    expect([en.width, en.height]).toEqual([800, 1066]);
    expect(createHash("sha256").update(readFileSync("public" + en.src)).digest("hex")).toBe("f4d759b81c618bca0204bdbc131798e758d86ad6b8fce28304d504bdddf1417b");
    expect(en.caption).toMatch(/^Some of our team members/);
    expect(fr.caption).toMatch(/^Des membres de notre équipe/);
    expect(en.alt).not.toBe(fr.alt);
    for (const other of ["city-cleanup-may-2022", "city-cleanup-may-2025", "city-cleanup-may-2023-test", "__proto__"]) {
      expect(getArchiveFeaturePhoto(other, "en")).toBeUndefined();
      expect(getArchiveFeaturePhoto(other, "fr")).toBeUndefined();
    }
  });

  it("renders after the lead and mobile document shortcut, before narrative headings", () => {
    const detail = readFileSync("src/components/projects/ArchiveProjectDetail.astro", "utf8");
    expect(detail.indexOf('href="#archive-project-documents"')).toBeLessThan(detail.indexOf("{featurePhoto && ("));
    expect(detail.indexOf("{featurePhoto && (")).toBeLessThan(detail.indexOf("editorial.sections.map"));
    expect(detail).toContain("<figcaption");
    expect(detail).toContain("photo && !featurePhoto");
    for (const [prefix, locale] of [["", "en"], ["fr/", "fr"]]) {
      const archive = readFileSync(`src/pages/${prefix}projects/archive/index.astro`, "utf8");
      expect(archive).toContain(`getArchiveFeaturePhoto(r.slug.current, "${locale}")`);
      expect(archive).toContain("src={r.featurePhoto.src}");
    }
  });
});
