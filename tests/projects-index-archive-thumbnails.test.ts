import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { getEligibleArchiveFeaturePhoto } from "../src/lib/archive-eligible-feature-photo";

const component = readFileSync(new URL("../src/components/projects/ProjectsIndex.astro", import.meta.url), "utf8");

describe("Projects overview archive thumbnails", () => {
  it("does not show a campaign image, placeholder, or a photo from another outreach", () => {
    expect(component).not.toMatch(/selectProjectsIndexImage|resolveProjectCardImage|project\.imageUrl/);
    expect(component).toContain('id === "project-records" && archived && project.archiveReady && !project.isAutoArchived');
    expect(component).toContain('record.status !== "completed" || record.autoArchived');
    expect(component).toContain('archivePhotosByHref.get(project.archiveHref');
  });

  it("shares the archive's reviewed image and localized alternative text by exact record slug", () => {
    const approved = { slug: { current: "city-cleanup-may-2025" }, year: 2025 };
    expect(getEligibleArchiveFeaturePhoto(approved, "en", 240)?.src).toBe("/images/projects/city-cleanup-may-2025-feature.webp");
    expect(getEligibleArchiveFeaturePhoto(approved, "fr", 240)?.alt).toMatch(/bénévoles/);
    expect(getEligibleArchiveFeaturePhoto({ ...approved, slug: { current: "city-cleanup-may-2026" } }, "en", 240)).toBeUndefined();
    expect(component).toContain("getEligibleArchiveFeaturePhoto(record, locale, 240)");
    expect(component).toContain('alt={image.alt} width={image.width} height={image.height}');
  });
});
