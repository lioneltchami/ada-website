import { localePath, type Locale } from "../i18n";
import { isWithdrawnProjectRecord } from "./withdrawn-project-content";

export function getAboutProgramHref(
  slug: string | undefined,
  availableProjectSlugs: ReadonlySet<string>,
  locale: Locale,
  programTitle?: string,
): string {
  const isCommunityCleanup = /^(community[\s-]*clean[\s-]*up|nettoyage communautaire)$/i.test(
    programTitle?.trim() || "",
  );
  const hasMatchingCleanupSlug =
    typeof slug === "string" &&
    /^community-clean(?:-?up)(?:-[a-z0-9]+)*$/.test(slug);

  if (
    typeof slug !== "string" ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ||
    !availableProjectSlugs.has(slug) ||
    isWithdrawnProjectRecord({ slug }) ||
    (isCommunityCleanup && !hasMatchingCleanupSlug)
  ) {
    return localePath("/projects", locale);
  }

  return localePath(`/projects/${slug}`, locale);
}
