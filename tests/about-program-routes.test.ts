import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { getAboutProgramHref } from "../src/lib/about-program-routes";

const available = new Set(["education-orphans"]);

describe("About page program routes", () => {
  it("does not claim education began in 2023 after the released 2022 school visits", () => {
    const english = readFileSync(resolve("src/pages/about.astro"), "utf8");
    const french = readFileSync(resolve("src/pages/fr/about.astro"), "utf8");
    expect(english).not.toContain("Education program begins");
    expect(english).toContain("Back-to-school supplies in Buea");
    expect(french).toContain("Fournitures scolaires à Buea");
  });
  it("keeps a verified English project route and falls back for an unknown slug", () => {
    expect(getAboutProgramHref("education-orphans", available, "en")).toBe(
      "/projects/education-orphans",
    );
    expect(getAboutProgramHref("missing-project", available, "en")).toBe(
      "/projects",
    );
    expect(getAboutProgramHref(undefined, available, "en")).toBe("/projects");
  });

  it("keeps a verified French project route and localizes the general fallback", () => {
    expect(getAboutProgramHref("education-orphans", available, "fr")).toBe(
      "/fr/projects/education-orphans",
    );
    expect(getAboutProgramHref("missing-project", available, "fr")).toBe(
      "/fr/projects",
    );
    expect(getAboutProgramHref(undefined, available, "fr")).toBe(
      "/fr/projects",
    );
  });

  it("never assigns the widow program to a CMS entry with no destination", () => {
    const known = new Set(["widow-support", "education-orphans"]);
    for (const locale of ["en", "fr"] as const) {
      expect(getAboutProgramHref(undefined, known, locale)).toBe(
        locale === "fr" ? "/fr/projects" : "/projects",
      );
      const page = locale === "fr" ? "src/pages/fr/about.astro" : "src/pages/about.astro";
      expect(readFileSync(resolve(page), "utf8")).not.toMatch(
        /slug:\s*p\.slug\s*(?:\|\||\?\?)\s*["']widow-support["']/,
      );
    }
  });

  it("keeps both Community Clean-Up fallback cards on the general projects page", () => {
    const english = readFileSync(resolve("src/pages/about.astro"), "utf8");
    const french = readFileSync(resolve("src/pages/fr/about.astro"), "utf8");
    const englishFallback = english.match(/title: 'Community Clean-Up'[^}]*}/)?.[0];
    const frenchFallback = french.match(/title: 'Nettoyage Communautaire'[^}]*}/)?.[0];

    expect(englishFallback).toBeDefined();
    expect(frenchFallback).toBeDefined();
    expect(englishFallback).not.toMatch(/slug\s*:/);
    expect(frenchFallback).not.toMatch(/slug\s*:/);
    expect(getAboutProgramHref(undefined, available, "en")).toBe("/projects");
    expect(getAboutProgramHref(undefined, available, "fr")).toBe("/fr/projects");
    const known = new Set([...available, "community-cleanup"]);
    expect(
      getAboutProgramHref(
        "women-empowerment",
        known,
        "en",
        "Community Clean-Up",
      ),
    ).toBe("/projects");
    expect(
      getAboutProgramHref(
        "women-empowerment",
        known,
        "fr",
        "Nettoyage Communautaire",
      ),
    ).toBe("/fr/projects");
    expect(
      getAboutProgramHref(
        "community-cleanup",
        known,
        "en",
        "Community Clean-Up",
      ),
    ).toBe("/projects/community-cleanup");
  });

  it("rejects traversal and withdrawn slugs even if they appear in the available set", () => {
    const hostileOrWithdrawn = new Set([
      "../donate",
      "clean-water-well-nkwen-mbatu",
      "widow-vocational-training-cohort-1",
    ]);

    for (const slug of hostileOrWithdrawn) {
      expect(getAboutProgramHref(slug, hostileOrWithdrawn, "en")).toBe("/projects");
      expect(getAboutProgramHref(slug, hostileOrWithdrawn, "fr")).toBe(
        "/fr/projects",
      );
    }
  });
});
