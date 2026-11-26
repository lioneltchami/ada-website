import { describe, expect, it, vi } from "vitest";
import { normalizeFallbackProjects } from "../src/lib/project-fallbacks";


vi.mock("../src/lib/sanity", () => ({ getProjects: vi.fn() }));
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

describe("homepage spotlight photo policy", () => {
  it.each(["en", "fr"] as const)(
    "keeps the %s campaign even when Sanity has images and passes no unverified image to the card",
    async (locale) => {
      const { getProjects } = await import("../src/lib/sanity");
      const getProjectsMock = vi.mocked(getProjects);
      getProjectsMock.mockResolvedValueOnce([
        {
          slug: { current: "widow-support" },
          title: "Widow Support",
          location: "Buea",
          description: "Local support.",
          status: "active",
          mainImage: { asset: { _ref: "image-unspecified-photo-800x600-jpg" } },
          goalAmount: 3000,
          raisedAmount: 0,
          beneficiaries: 12,
        } as Awaited<ReturnType<typeof getProjects>>[number],
      ]);
      const { loadSpotlightProjects } = await import("../src/lib/spotlight-projects");
      const projects = await loadSpotlightProjects(locale, 99);
      expect(projects.find((project) => project.slug === "widow-support")).toMatchObject({
        title: "Widow Support", beneficiaries: 12,
      });
      for (const project of projects) {
        expect(project).not.toHaveProperty("imageUrl");
        expect(project).not.toHaveProperty("imageAlt");
      }
    },
  );
});
