import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { getAboutProgramHref } from "../src/lib/about-program-routes";

const available = new Set(["education-drive"]);

describe("About page program routes", () => {
  it("does not claim education began in 2023 after the released 2022 school visits", () => {
    const english = readFileSync(resolve("src/pages/about.astro"), "utf8");
    const french = readFileSync(resolve("src/pages/fr/about.astro"), "utf8");
    expect(english).not.toContain("Education program begins");
    expect(english).toContain("Back-to-school supplies in Buea");
    expect(french).toContain("Fournitures scolaires à Buea");
  });
  it("keeps a verified English project route and falls back for an unknown slug", () => {
    expect(getAboutProgramHref("education-drive", available, "en")).toBe(
      "/projects/education-drive",
    );
    expect(getAboutProgramHref("missing-project", available, "en")).toBe(
      "/projects",
    );
    expect(getAboutProgramHref(undefined, available, "en")).toBe("/projects");
  });

  it("keeps a verified French project route and localizes the general fallback", () => {
    expect(getAboutProgramHref("education-drive", available, "fr")).toBe(
      "/fr/projects/education-drive",
    );
    expect(getAboutProgramHref("missing-project", available, "fr")).toBe(
      "/fr/projects",
    );
    expect(getAboutProgramHref(undefined, available, "fr")).toBe(
      "/fr/projects",
    );
  });

  it("never assigns the widow program to a CMS entry with no destination", () => {
    const known = new Set(["widow-support", "education-drive"]);
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

  it("features the same three published outreach records in each language", () => {
    const expected = [
      "widow-support-food-cash-mar-2022",
      "girls-dignity-menstrual-health-bamenda-jun-2026",
      "prenatal-care-support-program",
    ];
    const pages = [
      ["src/pages/about.astro", "/projects/archive"],
      ["src/pages/fr/about.astro", "/fr/projects/archive"],
    ] as const;
    for (const [path, base] of pages) {
      const source = readFileSync(resolve(path), "utf8");
      const programs = source.match(/const programs = \[([\s\S]*?)\];/)?.[1] ?? "";
      const slugs = [...programs.matchAll(/slug:\s*"([^"]+)"/g)].map((match) => match[1]);
      expect(slugs).toEqual(expected);
      expect(source).toContain(`const archivePath = "${base}";`);
      expect(source).toContain("href={`${archivePath}/${program.slug}/`}");
      expect(source).not.toMatch(/getAboutPage|Bamenda office opened|Bureau de Bamenda ouvert/);
    }
  });

  it("keeps the generic fallback for unverified Community Clean-Up CMS descriptions", () => {
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

  it("presents a verified founder and never reads seeded team profiles into the public roster", () => {
    for (const path of ["src/pages/team.astro", "src/pages/fr/team.astro"]) {
      const source = readFileSync(resolve(path), "utf8");
      expect(source).toContain("<TeamRoster");
      expect(source).not.toMatch(/getTeamMembers|Pastor Emmanuel|Pasteur Emmanuel/);
    }
    const component = readFileSync(resolve("src/components/layout/TeamRoster.astro"), "utf8");
    const profiles = readFileSync(resolve("src/data/team-profiles.ts"), "utf8");
    expect(component).toContain("getTeamRoster");
    expect(profiles).toContain("Lionel Tchami Nfada");
    expect(component + profiles).not.toMatch(/getTeamMembers|Pastor Emmanuel|Pasteur Emmanuel/);
  });

  it("rejects traversal and withdrawn slugs even if they appear in the available set", () => {
    const hostileOrWithdrawn = new Set([
      "../donate",
      "clean-water-well-nkwen-mbatu",
      "widow-vocational-training-cohort-1",
      "women-empowerment",
      "education-orphans",
      "young-women-skills-training-program",
    ]);

    for (const slug of hostileOrWithdrawn) {
      expect(getAboutProgramHref(slug, hostileOrWithdrawn, "en")).toBe("/projects");
      expect(getAboutProgramHref(slug, hostileOrWithdrawn, "fr")).toBe(
        "/fr/projects",
      );
    }
  });
});
