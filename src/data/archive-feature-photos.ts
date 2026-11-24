// Archive feature images are deliberately allowlisted, not inherited from the
// CMS. This is the exact JPEG embedded in the released May 2023 report.
export function getArchiveFeaturePhoto(slug: string, locale: "en" | "fr") {
  if (slug !== "city-cleanup-may-2023") return undefined;
  return {
    src: "/images/projects/buea-labour-day-cleanup-2023.jpg",
    width: 800,
    height: 1066,
    alt: locale === "fr"
      ? "Deux bénévoles portant des gants rouges ramassent des déchets sur un chemin."
      : "Two volunteers in red gloves gather litter along a dirt path.",
    caption: locale === "fr"
      ? "Des membres de notre équipe ramassent des déchets à Buea."
      : "Some of our team members collecting litter in Buea.",
  };
}
