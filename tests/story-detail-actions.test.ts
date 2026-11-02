import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const english = readFileSync("src/pages/stories/[slug].astro", "utf8");
const french = readFileSync("src/pages/fr/stories/[slug].astro", "utf8");

describe("story detail ways to connect", () => {
  it("keeps verified English donation and nonfinancial routes available", () => {
    expect(english).toContain('href="/donate"');
    expect(english).toContain('href="/get-involved"');
    expect(english).toContain('href="/projects"');
    expect(english).toContain('href="/stories"');
  });

  it("keeps the corresponding French routes available", () => {
    expect(french).toContain('href="/fr/donate"');
    expect(french).toContain('href="/fr/get-involved"');
    expect(french).toContain('href="/fr/projects"');
    expect(french).toContain('href="/fr/stories"');
  });

  it("uses a French landmark name on the French detail page", () => {
    expect(english).toContain('<nav aria-label="Breadcrumb"');
    expect(french).toContain('<nav aria-label="Fil d’Ariane"');
    expect(french).not.toContain('<nav aria-label="Breadcrumb"');
  });

  it("gives social sharing links descriptive localized names and safe new-tab relations", () => {
    for (const source of [english, french]) {
      expect(source).toContain("aria-label={`");
      expect(source.match(/rel="noopener noreferrer"/g)).toHaveLength(3);
      expect(source).toContain("focus-visible:outline-2");
    }
  });
});
