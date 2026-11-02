export type StoryCategoryPost = {
  category?: string | null;
};

export function countStoriesInCategory(
  posts: readonly StoryCategoryPost[],
  category: string,
): number {
  return posts.filter((post) => (post.category || "update") === category).length;
}

export function storyFilterAnnouncement(
  count: number,
  locale: "en" | "fr",
): string {
  if (locale === "fr") {
    return `${count} ${count === 1 ? "résultat affiché" : "résultats affichés"}.`;
  }
  return `${count} ${count === 1 ? "result shown" : "results shown"}.`;
}
