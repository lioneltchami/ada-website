export const STORY_FILTER_PARAM = "category";

export function readStoryFilter(url: URL): string {
  const value = url.searchParams.get(STORY_FILTER_PARAM);
  return value === "story" || value === "update" || value === "perspective" || value === "finance" ? value : "all";
}

export function storyNavigationHref(url: URL, filter: string): string {
  const next = new URL(url);
  if (filter === "story" || filter === "update" || filter === "perspective" || filter === "finance") {
    next.searchParams.set(STORY_FILTER_PARAM, filter);
  } else {
    next.searchParams.delete(STORY_FILTER_PARAM);
  }
  return `${next.pathname}${next.search}${next.hash}`;
}

export function isStoryPath(pathname: string): boolean {
  return /^\/(?:fr\/)?stories(?:\/[a-z0-9-]+)?\/?$/.test(pathname);
}

export function syncStoryNavigationLinks(filter: string, root: ParentNode = document): void {
  const links = root.querySelectorAll<HTMLAnchorElement>(
    "[data-story-card], [data-story-return], #language-navigation a[hreflang]",
  );
  for (const link of links) {
    const destination = new URL(link.href);
    if (destination.origin === window.location.origin && isStoryPath(destination.pathname)) {
      link.href = storyNavigationHref(destination, filter);
    }
  }
}
