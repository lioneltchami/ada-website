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
const approvedPhotos: Record<string, ArchiveFeaturePhoto> = {
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
