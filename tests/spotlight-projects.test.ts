import { describe, expect, it } from "vitest";
import { normalizeFallbackProjects } from "../src/lib/project-fallbacks";

describe("homepage spotlight candidates", () => {
  it("does not reopen reviewed 2026 outreaches as current campaigns in fallback data", () => {
    const projects = normalizeFallbackProjects({ today: "2026-11-25" });
    for (const [slug, day] of [
      ["back-to-school-bamenda-aug-2026", "2026-11-21"],
      ["back-to-school-buea-aug-2026", "2026-09-12"],
      ["girls-dignity-menstrual-health-bamenda-jun-2026", "2026-06-28"],
    ]) {
      expect(projects.find(project => project.slug === slug)).toMatchObject({
        status: "completed", startDate: day, endDate: day, isFundable: false,
        goal: 0, raised: 0, archiveHref: "/projects/archive/" + slug,
      });
    }
  });
});
