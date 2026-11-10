import { beforeEach, describe, expect, it, vi } from "vitest";

const { fetch, getProjects } = vi.hoisted(() => ({
  fetch: vi.fn(),
  getProjects: vi.fn(),
}));
vi.mock("../src/lib/sanity", () => ({
  getProjects,
  getSanityClient: () => ({ fetch }),
  sanityImageUrl: (ref: string) => `https://example.test/${ref}`,
}));
import { resolveHeroImage, resolveGalleryStrip } from "../src/lib/hero-images";

const withdrawn = {
  _id: "old-gallery",
  title: "Community event",
  projectId: "project-women-empowerment",
  photo: { asset: { _ref: "withdrawn-image" }, alt: "Generic event caption" },
};
const retained = {
  _id: "baking-gallery",
  title: "Girls baking workshop",
  projectId: "idp-girls-baking-training-jul-2022",
  photo: { asset: { _ref: "retained-image" }, alt: "Baking supplies" },
};

beforeEach(() => {
  vi.clearAllMocks();
  getProjects.mockResolvedValue([]);
  // Return the reference only when the query actually projects it. This models
  // a deleted CMS project whose dereferenced slug/title are no longer available.
  fetch.mockImplementation(async (query: string) => [withdrawn, retained].map(row => {
    const projected = { ...row } as Record<string, unknown>;
    if (!query.includes('"projectId": project._ref')) delete projected.projectId;
    return projected;
  }));
});

describe("withdrawn training imagery in hero/gallery fallbacks", () => {
  it("rejects a dangling withdrawn reference in the hero fallback", async () => {
    expect(await resolveHeroImage()).toEqual({
      imageUrl: "https://example.test/retained-image",
      imageAlt: "Baking supplies",
    });
  });
  it("rejects a dangling withdrawn reference before applying the gallery limit", async () => {
    expect(await resolveGalleryStrip(1)).toEqual([{
      title: "Girls baking workshop",
      imageUrl: "https://example.test/retained-image",
      imageAlt: "Baking supplies",
    }]);
  });
  it("returns no image when only rejected project references remain", async () => {
    fetch.mockResolvedValue([withdrawn]);
    expect(await resolveHeroImage()).toBeNull();
    expect(await resolveGalleryStrip()).toEqual([]);
  });
});
