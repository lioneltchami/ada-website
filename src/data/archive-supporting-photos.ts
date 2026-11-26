type Locale = "en" | "fr";

type SupportingPhoto = {
  src: string;
  width: number;
  height: number;
  alt: Record<Locale, string>;
  caption: Record<Locale, string>;
};

// Exact non-identifying compositions from page 2 of the respective publicly
// released report, re-encoded as WebP without metadata; never use raw originals.
const supportingPhotos: Readonly<Record<string, readonly SupportingPhoto[]>> = {
  "school-supply-distribution-feb-2022": [{
    src: "/images/projects/school-supply-distribution-feb-2022-buckets.webp",
    width: 270,
    height: 300,
    alt: { en: "Several bright pink buckets.", fr: "Plusieurs seaux rose vif." },
    caption: { en: "Detail of the buckets prepared for the February school visit.", fr: "Détail des seaux préparés pour la visite scolaire de février." },
  }],
  "widow-support-food-cash-mar-2022": [{
    src: "/images/projects/widow-support-food-cash-mar-2022-food-bucket.webp",
    width: 480,
    height: 360,
    alt: { en: "A bottle of oil and packets of food in a green bucket.", fr: "Une bouteille d’huile et des sachets de denrées dans un seau vert." },
    caption: { en: "A closer look at supplies prepared for the widows’ home visits in Muea.", fr: "Une partie des provisions préparées pour les visites au domicile des veuves à Muea." },
  }],
  "idp-girls-baking-training-jul-2022": [{
    src: "/images/projects/idp-girls-baking-training-jul-2022-containers.webp",
    width: 535,
    height: 563,
    alt: { en: "Clear plastic buckets with workshop labels.", fr: "Des seaux en plastique transparent portant des étiquettes de l’atelier." },
    caption: { en: "Transparent buckets were part of the supplies for carrying and selling baked goods after the workshop.", fr: "Des seaux transparents faisaient partie du matériel prévu pour transporter et vendre les produits après l’atelier." },
  }],
  "back-to-school-sep-2022": [{
    src: "/images/projects/back-to-school-sep-2022-school-bags.webp",
    width: 726,
    height: 630,
    alt: { en: "A group of patterned school bags in different styles.", fr: "Des cartables à motifs de styles différents." },
    caption: { en: "Some of the different styles of school bags for the August outreach in Buea.", fr: "Quelques modèles de cartables destinés à l’action de rentrée scolaire d’août à Buea." },
  }],
  "christmas-giving-dec-2022": [{
    src: "/images/projects/christmas-giving-dec-2022-food.webp",
    width: 1512,
    height: 1798,
    alt: { en: "Hands serving food from a metal tray.", fr: "Des mains servent de la nourriture depuis un plateau métallique." },
    caption: { en: "Food being served during our December Christmas visit.", fr: "De la nourriture est servie lors de notre visite de Noël en décembre." },
  }],
};

export function getArchiveSupportingPhotos(slug: string, locale: Locale) {
  const photos = Object.hasOwn(supportingPhotos, slug) ? supportingPhotos[slug] : [];
  return photos.map(({ src, width, height, alt, caption }) =>
    ({ src, width, height, alt: alt[locale], caption: caption[locale] }));
}
