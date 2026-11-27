import { describe, expect, it } from "vitest";
import { isStoryPath, readStoryFilter, storyNavigationHref } from "../src/lib/story-filter-navigation";

const at = (path: string) => new URL(path, "https://apotidev.org");

describe("story filter navigation", () => {
  it("recognizes only declared filters", () => {
    for (const filter of ["story", "update", "perspective"]) {
      expect(readStoryFilter(at(`/stories/?category=${filter}`))).toBe(filter);
    }
    expect(readStoryFilter(at("/stories/"))).toBe("all");
    expect(readStoryFilter(at("/stories/?category=spoof"))).toBe("all");
    expect(readStoryFilter(at("/stories/?category=finance"))).toBe("all");
  });

  it("preserves unrelated query arguments and hashes", () => {
    expect(storyNavigationHref(at("/fr/stories/salon-update/?campaign=test#more"), "update"))
      .toBe("/fr/stories/salon-update/?campaign=test&category=update#more");
    expect(storyNavigationHref(at("/stories/?category=story&foo=2"), "all"))
      .toBe("/stories/?foo=2");
  });

  it("limits propagation to Stories pages in either language", () => {
    expect(isStoryPath("/stories")).toBe(true);
    expect(isStoryPath("/fr/stories/salon-update/")).toBe(true);
    expect(isStoryPath("/fr/projects/stories/")).toBe(false);
    expect(isStoryPath("/stories/a/b")).toBe(false);
  });
});
