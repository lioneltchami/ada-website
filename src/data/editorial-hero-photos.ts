import { getArchiveFeaturePhoto } from "./archive-feature-photos";
import { localePath, type Locale } from "../i18n";

// Each header points to an exact, already-published outreach photo. The caption
// identifies the record; it does not represent a current campaign or promise.
const sources = {
  about: {
    slug: "first-widow-home-visits-2021",
    en: "Our team, pictured from behind. Explore our first home visits.",
    fr: "Notre équipe, vue de dos. Découvrez nos premières visites à domicile.",
  },
  projects: {
    slug: "back-to-school-sep-2022",
    en: "School supplies from our Buea outreach, August 2022",
    fr: "Fournitures de notre action de rentrée à Buea, août 2022",
  },
  archive: {
    slug: "christmas-giving-dec-2022",
    en: "Supplies from our Christmas outreach, December 2022",
    fr: "Articles de notre action de Noël, décembre 2022",
  },
  sponsor: {
    slug: "school-supply-distribution-feb-2022",
    en: "Supplies from a school visit in Buea, February 2022",
    fr: "Articles distribués lors d’une visite scolaire à Buea, février 2022",
  },
  volunteer: {
    slug: "idp-girls-baking-training-jul-2022",
    en: "Preparing dough at our baking workshop, July 2022",
    fr: "Préparation de la pâte lors de notre atelier de pâtisserie, juillet 2022",
  },
  gallery: {
    slug: "city-cleanup-may-2023",
    en: "From the archive: our cleanup team in Buea, May 2023",
    fr: "Dans les archives : notre équipe de nettoyage à Buea, mai 2023",
  },
  team: {
    slug: "first-widow-home-visits-2021",
    en: "Our team, pictured from behind",
    fr: "Notre équipe, vue de dos",
  },
  contact: {
    slug: "city-cleanup-may-2023",
    en: "Our volunteers at the Buea cleanup, May 2023",
    fr: "Nos bénévoles lors du nettoyage à Buea, mai 2023",
  },
  monthly: {
    slug: "widow-support-food-cash-mar-2022",
    en: "Supplies for widows’ home visits in Muea, March 2022",
    fr: "Articles destinés aux visites aux veuves à Muea, mars 2022",
  },
  donate: {
    slug: "widow-support-food-cash-mar-2022",
    en: "Supplies for widows’ home visits in Muea, March 2022",
    fr: "Articles destinés aux visites aux veuves à Muea, mars 2022",
  },
  resources: {
    slug: "school-supply-distribution-feb-2022",
    en: "Photo from our February 2022 school visit in Buea.",
    fr: "Photo de notre visite scolaire de février 2022 à Buea.",
    linkLabel: { en: "View outreach record", fr: "Voir la fiche de l’action" },
  },
  transparency: {
    slug: "back-to-school-sep-2022",
    en: "From our project records: school supplies in Buea, August 2022",
    fr: "Dans nos dossiers : les fournitures scolaires à Buea, août 2022",
  },
  partners: {
    slug: "christmas-giving-dec-2022",
    en: "Supplies from our Christmas outreach, December 2022",
    fr: "Articles de notre action de Noël, décembre 2022",
  },
} as const;

export function getEditorialHeroPhoto(page: keyof typeof sources, locale: Locale) {
  const source = sources[page];
  const photo = getArchiveFeaturePhoto(source.slug, locale);
  if (!photo) return undefined;
  return {
    ...photo,
    credit: {
      text: source[locale],
      linkLabel: "linkLabel" in source ? source.linkLabel[locale] : undefined,
      href: localePath(`/projects/archive/${source.slug}/`, locale),
    },
  };
}
