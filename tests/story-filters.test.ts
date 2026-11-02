import { describe, expect, it } from "vitest";
import {
  countStoriesInCategory,
  storyFilterAnnouncement,
} from "../src/lib/story-filters";

describe("Stories index filters", () => {
  const posts = [
    { category: "story" },
    { category: "announcement" },
    { category: "update" },
    { category: null },
    {},
  ];

  it("counts uncategorized posts in the Updates fallback used by story cards", () => {
    expect(countStoriesInCategory(posts, "story")).toBe(1);
    expect(countStoriesInCategory(posts, "announcement")).toBe(1);
    expect(countStoriesInCategory(posts, "update")).toBe(3);
  });

  it("announces filtered result counts in English and French", () => {
    expect(storyFilterAnnouncement(1, "en")).toBe("1 result shown.");
    expect(storyFilterAnnouncement(2, "en")).toBe("2 results shown.");
    expect(storyFilterAnnouncement(1, "fr")).toBe("1 résultat affiché.");
    expect(storyFilterAnnouncement(2, "fr")).toBe("2 résultats affichés.");
  });
});
