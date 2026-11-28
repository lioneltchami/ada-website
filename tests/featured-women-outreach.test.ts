import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { featuredWomenOutreach, featuredWomenReportHref } from "../src/data/featured-women-outreach";

describe("completed outreach evidence for the public program focus", () => {
  it("pairs distinct evidence with a published report and clear link label in each language", () => {
    for (const outreach of featuredWomenOutreach) {
      expect(existsSync(`public${featuredWomenReportHref(outreach.slug)}`)).toBe(true);
    }
    for (const locale of ["en", "fr"] as const) {
      expect(new Set(featuredWomenOutreach.map((item) => item.link[locale])).size).toBe(3);
      expect(featuredWomenOutreach.every((item) => item.title[locale] && item.evidence[locale])).toBe(true);
    }
  });

  it("distinguishes prepared parcels from received parcels and the mother-and-baby outreach from clinical care", () => {
    expect(featuredWomenOutreach[1].evidence.en).toContain("26 parcels; 20 were distributed");
    expect(featuredWomenOutreach[1].evidence.fr).toContain("26 colis, dont 20 ont été remis");
    expect(featuredWomenOutreach[2].evidence.en).toContain("not a clinical service");
    expect(featuredWomenOutreach[2].evidence.fr).toContain("non de soins médicaux");
  });

  it("keeps upcoming outreaches and archive history visible alongside completed examples", () => {
    const projects = readFileSync("src/components/projects/ProjectsIndex.astro", "utf8");
    expect(projects).toContain('projects.filter((p) => p.status === "upcoming")');
    expect(projects).toContain('id="women-and-girls"');
    expect(projects).toContain('link("/projects/archive")');
  });
});
