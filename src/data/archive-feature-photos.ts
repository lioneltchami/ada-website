type Locale = "en" | "fr";
type ArchiveFeaturePhoto = {
  src: string;
  width: number;
  height: number;
  alt: Record<Locale, string>;
  caption: Record<Locale, string>;
};

// Explicit release allowlist. The May JPEG is byte-identical to the image in
// its published report. The five 2022 WebPs are uncropped web encodes of the
// non-identifying supplies/equipment scenes on page 1 of their published reports.
// The May 2022 classroom portrait preserves the exact approved report crop.
const approvedPhotos: Record<string, ArchiveFeaturePhoto> = {
  "back-to-school-buea-2024": {
    src: "/images/projects/back-to-school-buea-2024-feature.webp",
    width: 960,
    height: 540,
    alt: { en: "Books, exercise books and stationery laid out on a table.", fr: "Des livres, des cahiers et du matériel scolaire disposés sur une table." },
    caption: { en: "Some of the school supplies from our 2024 Back to School Outreach in Buea.", fr: "Une partie des fournitures de notre action de rentrée scolaire de 2024 à Buea." },
  },
  "city-cleanup-may-2025": {
    src: "/images/projects/city-cleanup-may-2025-feature.webp",
    width: 1600,
    height: 1200,
    alt: { en: "Volunteers holding cleanup tools beside an ADA waste bin.", fr: "Des bénévoles avec des outils de nettoyage à côté d’une poubelle de l’ADA." },
    caption: { en: "Some of our volunteers during the Labour Day school cleanup in Buea.", fr: "Des membres de notre équipe lors du nettoyage des établissements scolaires à Buea pour la fête du Travail." },
  },
  "prenatal-care-support-program": {
    src: "/images/projects/prenatal-care-support-program-feature.webp",
    width: 1600,
    height: 729,
    alt: { en: "Buckets holding diapers and other supplies for mothers and babies.", fr: "Des seaux contenant des couches et d’autres articles pour les mères et leurs bébés." },
    caption: { en: "Some of the supplies prepared for mothers and babies at the hospital in Muea.", fr: "Une partie des articles préparés pour les mères et leurs bébés à l’hôpital de Muea." },
  },
  "first-widow-home-visits-2021": {
    src: "/images/projects/widows-outreach-2021.jpg",
    width: 800,
    height: 1066,
    alt: { en: "Three people in matching shirts seen from behind on an outdoor path.", fr: "Trois personnes portant des polos assortis, vues de dos sur un chemin." },
    caption: { en: "Members of our team, seen from behind.", fr: "Des membres de notre équipe, vus de dos." },
  },
  "city-cleanup-may-2023": {
    src: "/images/projects/buea-labour-day-cleanup-2023.jpg",
    width: 800,
    height: 1066,
    alt: {
      en: "Two volunteers in red gloves gather litter along a dirt path.",
      fr: "Deux bénévoles portant des gants rouges ramassent des déchets sur un chemin.",
    },
    caption: {
      en: "Some of our team members collecting litter in Buea.",
      fr: "Des membres de notre équipe ramassent des déchets à Buea.",
    },
  },
  "school-supply-distribution-feb-2022": {
    src: "/images/projects/school-supply-distribution-feb-2022.webp",
    width: 598,
    height: 260,
    alt: { en: "Bowls and blue cups sit on colorful buckets.", fr: "Des bols et des gobelets bleus sont posés sur des seaux colorés." },
    caption: { en: "Some of the household supplies from our February school visit.", fr: "Quelques articles ménagers de notre visite scolaire de février." },
  },
  "widow-support-food-cash-mar-2022": {
    src: "/images/projects/widow-support-food-cash-mar-2022.webp",
    width: 880,
    height: 495,
    alt: { en: "Buckets hold bottles of oil and bags of food.", fr: "Des seaux contiennent des bouteilles d’huile et des sachets de denrées." },
    caption: { en: "Some of the supplies our team prepared for the March widows’ home visits.", fr: "Une partie des articles préparés par notre équipe pour les visites de mars au domicile des veuves." },
  },
  "school-visit-may-2022": {
    src: "/images/projects/school-visit-may-2022.png",
    width: 136,
    height: 142,
    alt: { en: "A classroom instructor speaking, seen in profile.", fr: "Une intervenante s’exprime en classe, vue de profil." },
    caption: { en: "An instructor during our May 2022 school visit in Buea.", fr: "Une intervenante lors de notre visite scolaire de mai 2022 à Buea." },
  },
  "idp-girls-baking-training-jul-2022": {
    src: "/images/projects/idp-girls-baking-training-jul-2022.webp",
    width: 1000,
    height: 414,
    alt: { en: "A rolling pin rests on dough beside a bowl of filling.", fr: "Un rouleau à pâtisserie repose sur la pâte, à côté d’un bol de garniture." },
    caption: { en: "Dough and filling pictured at the July baking workshop.", fr: "Pâte et garniture photographiées lors de l’atelier de pâtisserie de juillet." },
  },
  "back-to-school-sep-2022": {
    src: "/images/projects/back-to-school-sep-2022.webp",
    width: 1280,
    height: 519,
    alt: { en: "Stacks of exercise books, writing supplies and brightly colored school bags.", fr: "Des piles de cahiers, du matériel d’écriture et des cartables colorés." },
    caption: { en: "Some of the school supplies from our August back-to-school outreach in Buea.", fr: "Une partie des fournitures de notre action de rentrée scolaire d’août à Buea." },
  },
  "christmas-giving-dec-2022": {
    src: "/images/projects/christmas-giving-dec-2022.webp",
    width: 1680,
    height: 654,
    alt: { en: "An orange bucket and colorful bags beside goods wrapped in brown paper.", fr: "Un seau orange et des sacs colorés côtoient des articles emballés dans du papier brun." },
    caption: { en: "Some of the supplies pictured during our December Christmas outreach.", fr: "Une partie des articles photographiés lors de notre action de Noël en décembre." },
  },
};

export function getArchiveFeaturePhoto(slug: string, locale: Locale) {
  if (!Object.hasOwn(approvedPhotos, slug)) return undefined;
  const { src, width, height, alt, caption } = approvedPhotos[slug];
  return { src, width, height, alt: alt[locale], caption: caption[locale] };
}
