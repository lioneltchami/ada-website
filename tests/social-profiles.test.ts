import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { additionalSocialProfiles } from "../src/data/social-profiles";

const read = (path: string) => readFileSync(path, "utf8");

describe("ADA social profile links", () => {
  it("uses the official Threads and LinkedIn profile URLs", () => {
    expect(additionalSocialProfiles).toEqual([
      { name: "Threads", href: "https://www.threads.com/@apotidev", icon: "threads" },
      { name: "LinkedIn", href: "https://www.linkedin.com/company/apotidev", icon: "linkedin" },
    ]);
  });

  it("links from the shared footer and both localized Get Involved sections", () => {
    const footer = read("src/components/layout/Footer.astro");
    expect(footer).toContain("aria-label={name}");
    expect(footer).toContain("flex-wrap");
    expect(footer).toContain("additionalSocialProfiles.map");
    expect(footer).toContain("<SocialBrandIcon brand={icon} />");
    expect(footer).toContain('aria-label="X (Twitter)"');
    expect(read("src/components/layout/SocialBrandIcon.astro")).toContain('aria-hidden="true"');
    for (const path of ["src/pages/get-involved.astro", "src/pages/fr/get-involved.astro"]) {
      const page = read(path);
      expect(page).toContain("additionalSocialProfiles.map");
      expect(page).toContain("{name}");
    }
  });
});
