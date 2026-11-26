import { getArchiveFeaturePhoto } from "./archive-feature-photos";
import { localePath, type Locale } from "../i18n";

// One exact, already-published outreach photo per editorial header. The caption
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
} as const;

export function getEditorialHeroPhoto(page: keyof typeof sources, locale: Locale) {
  const source = sources[page];
  const photo = getArchiveFeaturePhoto(source.slug, locale);
  if (!photo) return undefined;
  return {
    ...photo,
    credit: {
      text: source[locale],
      href: localePath(`/projects/archive/${source.slug}/`, locale),
    },
  };
}
