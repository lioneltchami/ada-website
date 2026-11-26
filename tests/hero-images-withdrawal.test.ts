import { beforeEach, describe, expect, it, vi } from "vitest";

const { fetch } = vi.hoisted(() => ({ fetch: vi.fn() }));
vi.mock("@sanity/client", () => ({ createClient: () => ({ fetch }) }));
import { resolveHeroImage, resolveGalleryStrip } from "../src/lib/hero-images";
import { loadGalleryMosaic } from "../src/lib/gallery";
import { resolveProjectCardImage } from "../src/lib/project-images";
import { getGalleryImages, getProjects } from "../src/lib/sanity";

const heldRef = "image-ec7c3db9f63fc5cd6fce17378dc687550042b82d-800x1421-jpg";
const eligibleRef = "image-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa-900x600-jpg";
const photo = (ref: string) => ({ asset: { _ref: ref }, alt: "Caption" });

const projects = [
  { slug: { current: "widow-support" }, title: "Widow Support", mainImage: photo(heldRef),
    archiveRecord: { slug: { current: "widow-support-record" }, photo: photo(heldRef) } },
  { slug: { current: "school-support" }, title: "School Support", mainImage: photo(eligibleRef) },
];

beforeEach(() => {
  vi.clearAllMocks();
  fetch.mockImplementation(async (query: string) =>
    query.includes('"galleryImage"')
      ? [
          { _id: "held", title: "Retitled", photo: photo(heldRef) },
          { _id: "unreviewed", title: "Unreviewed upload", photo: photo(eligibleRef) },
        ]
      : projects);
});

describe("held images cannot leak into public surfaces", () => {
  it("drops held project and linked archive media but not the project or its archive link", async () => {
    const rows = await getProjects("fr");
    expect(rows[0]).toMatchObject({
      mainImage: undefined,
      archiveRecord: { slug: { current: "widow-support-record" }, photo: undefined },
    });
    expect(rows[1].mainImage).toEqual(photo(eligibleRef));
  });

  it("skips a held preferred hero while keeping an unrelated eligible project image", async () => {
    expect(await resolveHeroImage(["widow-support"])).toMatchObject({
      imageUrl: expect.stringContaining("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"),
    });
  });

  it("falls back to no image or a reviewed cover rather than a held photo", () => {
    expect(resolveProjectCardImage(projects[0])).toMatchObject({
      imageUrl: "",
      imageAlt: "",
      imageSource: "none",
    });
    expect(resolveProjectCardImage({
      ...projects[0],
      archiveRecord: { photo: photo(eligibleRef) },
    })).toMatchObject({ imageSource: "archive" });
  });

  it("filters unverified gallery rows on every shared gallery surface", async () => {
    fetch.mockImplementation(async (query: string) =>
      query.includes('"galleryImage"')
        ? [
            { _id: "held", title: "Retitled", photo: photo(heldRef) },
            { _id: "unreviewed", title: "Unreviewed upload", photo: photo(eligibleRef) },
          ]
        : projects.slice(0, 1));
    expect(await getGalleryImages(undefined, "fr")).toEqual([]);
    expect(await getGalleryImages("education")).toEqual([]);
    expect(await loadGalleryMosaic(8, "fr")).toEqual([]);
    expect(await resolveHeroImage()).toBeNull();
    expect(await resolveGalleryStrip()).toEqual([]);
  });
});
