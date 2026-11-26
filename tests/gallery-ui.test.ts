import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { localePath } from "../src/i18n";

const component = readFileSync("src/components/gallery/GalleryIndex.astro", "utf8");

describe("bilingual gallery presentation", () => {
  it("keeps provenance gating and uses a keyboard-operable native disclosure for each outreach", () => {
    expect(component).toContain("getClearedGalleryMedia(row._id, row.photo?.asset?._ref)");
    expect(component).toContain("isKnownGalleryArchive(slug, locale)");
    expect(component).toContain("<details");
    expect(component).toContain("<summary");
    expect(component).toContain("<figure");
    expect(component).toContain("<figcaption");
    expect(component).toContain("media.captionFr : media.caption");
    expect(component).toContain("media.altFr : media.alt");
    expect(component).toContain("<time datetime={item.date}>");
    expect(component).not.toMatch(/opacity-0|group-hover:opacity|img\.year|img\.project|img\.report|heroPhoto|imageUrl=/);
  });

  it("links to the exact archive record, not an unverified legacy campaign/report reference", () => {
    expect(component).toContain("/projects/archive/${album.archiveSlug}/");
    expect(component).not.toContain("projectSlug");
    expect(component).not.toContain("reportUrl");
  });

  it("offers the appropriate archive even when no cleared images are published", () => {
    expect(component).toContain("Browse the project archive");
    expect(component).toContain("Consulter les archives des projets");
    expect(localePath("/projects/archive/", "en")).toBe("/projects/archive/");
    expect(localePath("/projects/archive/", "fr")).toBe("/fr/projects/archive/");
  });
});
