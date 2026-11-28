import type { Locale } from "../i18n";

type Text = [en: string, fr: string];
type Still = readonly [file: string, width: number, height: number, alt: Text, caption: Text];

// Distinct editorial frames, derived from matched outreach originals. Do not
// include originals, distinctive faces without permission, or private metadata.
const stills = {
  widowsTeam: ["march-2022-widows-team-supplies.webp", 685, 405,
    ["Team members holding buckets filled with household supplies.", "Des membres de l’équipe tiennent des seaux remplis de produits de première nécessité."],
    ["Preparing supplies for our March 2022 Widows’ Outreach in Muea.", "Préparation des articles pour notre action auprès des veuves à Muea en mars 2022."]],
  widowsBags: ["march-2022-widows-bags-and-buckets.webp", 489, 956,
    ["Handbags, colorful buckets and food supplies lined up indoors.", "Des sacs, des seaux colorés et des denrées sont disposés à l’intérieur."],
    ["Supplies for our March 2022 Widows’ Outreach in Muea.", "Articles pour notre action auprès des veuves à Muea en mars 2022."]],
  mueaHandoff: ["muea-2025-kit-handoff.webp", 681, 355,
    ["Hands passing a bucket with supplies for a newborn.", "Des mains se passent un seau contenant des articles pour un nouveau-né."],
    ["Supplies being handed over during our outreach in Muea, July 2025.", "Remise d’articles lors de notre action à Muea en juillet 2025."]],
  mueaKitsRow: ["muea-2025-outreach-kits-row.webp", 1393, 1040,
    ["Folded clothes and soap are arranged on red buckets.", "Des vêtements pliés et du savon sont disposés sur des seaux rouges."],
    ["Kits prepared for mothers and newborns in Muea, July 2025.", "Kits préparés pour les mères et les nouveau-nés à Muea en juillet 2025."]],
  cleanupTeam: ["cleanup-2025-team-tools.webp", 1450, 828,
    ["Volunteers with rakes, gloves and a bin outdoors, seen from the shoulders down.", "Des bénévoles avec des râteaux, des gants et une poubelle, cadrés sous les épaules."],
    ["Some of our volunteers during the 2025 school cleanup in Buea.", "Quelques bénévoles lors du nettoyage des établissements scolaires à Buea en 2025."]],
  cleanupWork: ["cleanup-2025-volunteer-at-work.webp", 875, 507,
    ["A gloved volunteer using a shovel beside waste baskets.", "Un bénévole ganté utilise une pelle à côté de paniers à déchets."],
    ["Volunteer at work during the 2025 school cleanup in Buea.", "Un bénévole à l’œuvre lors du nettoyage des établissements scolaires à Buea en 2025."]],
  cleanupBin: ["cleanup-2025-waste-bin.webp", 1317, 1400,
    ["An ADA community service poster on a waste bin.", "Une affiche du service communautaire d’ADA sur une poubelle."],
    ["A waste bin used during the 2025 school cleanup in Buea.", "Une poubelle utilisée lors du nettoyage des établissements scolaires à Buea en 2025."]],
  schoolSession24: ["back-to-school-buea-2024-outreach-session.webp", 1280, 720,
    ["A volunteer in a green-and-white shirt stands with pupils whose faces are obscured.", "Une bénévole en polo vert et blanc se tient avec des élèves dont les visages sont masqués."],
    ["A moment from our 2024 Back to School Outreach in Buea.", "Un moment de notre action de rentrée scolaire de 2024 à Buea."]],
  schoolBooks22: ["aug-2022-exercise-books.webp", 792, 524,
    ["Stacks of exercise books prepared for pupils.", "Des piles de cahiers préparés pour les élèves."],
    ["Exercise books from our August 2022 Back to School Outreach in Buea.", "Cahiers de notre action de rentrée scolaire à Buea en août 2022."]],
} as const satisfies Record<string, Still>;

export function outreachEditorialStill(key: keyof typeof stills, locale: Locale) {
  const [file, width, height, alt, caption] = stills[key];
  const i = locale === "fr" ? 1 : 0;
  return { src: `/images/projects/${file}` as const, width, height, alt: alt[i], caption: caption[i] };
}
