import type { Locale } from "../i18n";

type ImageFields = { slug: string; imageUrl: string; imageAlt: string };

// Only describe specific, reviewed assets. New CMS images keep their own descriptions.
const knownAlt: Record<string, Record<Locale, string>> = {
  ec7c3db9f63fc5cd6fce17378dc687550042b82d: {
    en: "Food distribution to widows in Bamenda",
    fr: "Distribution de denrées alimentaires aux veuves à Bamenda",
  },
  efa3a07277351eb6f5bbb587fa2babd234c50d8f: {
    en: "School supplies distribution",
    fr: "Distribution de fournitures scolaires",
  },
  "02bd09413bd429a7cb9677a9368392642774671e": {
    en: "Christmas Giving in 2024",
    fr: "Action de solidarité de Noël en 2024",
  },
};

export function selectProjectsIndexImage(project: ImageFields, locale: Locale) {
  if (!project.imageUrl || project.imageUrl === "/project-placeholder.svg") return undefined;
  // The current relief asset depicts a cleanup, not a relief distribution.
  // Prevent the same known mismatch in a localized CMS response.
  if (
    project.slug === "emergency-relief" &&
    (project.imageUrl.includes("edc2f2636d0dc93ab0405ea0bd67f8b6f4f1f308") ||
      /clean[- ]?up|nettoyage/i.test(project.imageAlt))
  ) return undefined;
  return {
    src: project.imageUrl,
    alt: Object.entries(knownAlt).find(([asset]) => project.imageUrl.includes(asset))?.[1][locale] ?? project.imageAlt,
  };
}

type LocalizableFields = { slug: string; title: string; description: string; location: string };

const fallbackFr: Record<string, { title: string; description: string; location: string }> = {
  "widow-support": {
    title: "Programme de soutien aux veuves",
    description: "Aide alimentaire et financière pour les veuves et les familles.",
    location: "Bamenda",
  },
  "emergency-relief": {
    title: "Fonds de secours d’urgence",
    description: "Aide d’urgence en cas de crise : vivres, assistance médicale et abri temporaire.",
    location: "Plusieurs régions",
  },
  "education-drive": {
    title: "Campagne annuelle d’éducation",
    description: "Appui à la rentrée scolaire dans les communautés rurales : fournitures, uniformes et frais de scolarité.",
    location: "Zones rurales",
  },
  "christmas-giving": {
    title: "Campagne de Noël",
    description: "Campagne de fêtes apportant des colis alimentaires, des vêtements et des cadeaux aux familles qui en ont besoin.",
    location: "Bamenda et villages environnants",
  },
};

export function localizeProjectsIndexFallback<T extends LocalizableFields>(project: T, locale: Locale): T {
  return locale === "fr" && Object.hasOwn(fallbackFr, project.slug)
    ? { ...project, ...fallbackFr[project.slug] }
    : project;
}
