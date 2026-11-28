/**
 * Narrow editorial migration for the existing ADA production dataset.
 * From Studio: npx sanity exec reconcile-women-focus.ts --with-user-token
 * Add "-- --apply" only after reviewing the dry run. Use a current signed-in
 * staff account with the correct project permissions, not a shared API token.
 */
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-03-28" }).withConfig({
  useCdn: false, perspective: "raw",
});
const { projectId, dataset } = client.config();
if (projectId !== "rj2m21gk" || dataset !== "production") {
  throw new Error("This migration applies to ADA production only.");
}
const team: Record<string, string> = {
  "team-1": "Pastor Emmanuel Tchami",
  "team-2": "Grace Nkembe",
  "team-3": "Jean-Pierre Fotso",
  "team-4": "Marie-Claire Ndongo",
  "team-5": "Samuel Mbah",
};
const archive: Record<string, { en: string; fr: string }> = {
  "first-widow-home-visits-2021": { en: "Buea", fr: "Buea" },
  "widow-support-food-cash-mar-2022": { en: "Muea, Buea", fr: "Muea, Buea" },
  "christmas-giving-dec-2022": { en: "Sima orphanage, Buea", fr: "Orphelinat Sima, Buea" },
};
const mission = "Rooted in our Christian faith, we offer practical support to women and adolescent girls in Cameroon, with particular attention to widows and mothers. Taking part in prayer is never a condition of receiving support.";
const missionFr = "Ancrés dans la foi chrétienne, nous apportons un soutien concret aux femmes et aux adolescentes au Cameroun, en particulier aux veuves et aux mères. La participation à la prière n’est jamais une condition pour recevoir de l’aide.";
const pillars = [
  { _key: "widows", icon: "", title: "Widows’ Support", titleFr: "Soutien aux veuves", description: "Food and practical support, based on needs widows share with our team.", descriptionFr: "Une aide alimentaire et pratique qui tient compte des besoins exprimés par les veuves." },
  { _key: "girls", icon: "", title: "Girls’ Dignity", titleFr: "Dignité des adolescentes", description: "Menstrual health discussions and practical supplies for adolescent girls.", descriptionFr: "Des échanges sur la santé menstruelle et des fournitures utiles aux adolescentes." },
  { _key: "mothers", icon: "", title: "Support for Mothers", titleFr: "Soutien aux mères", description: "Our completed Muea outreach provided essentials for mothers and newborns.", descriptionFr: "Notre action achevée à Muea a apporté des articles essentiels aux mères et à leurs nouveau-nés." },
];
const singletonFields: Record<string, Record<string, unknown>> = {
  homePage: {
    heroHeadline: "Practical support for women and adolescent girls in Cameroon",
    heroHeadlineFr: "Un soutien concret aux femmes et aux adolescentes au Cameroun",
    heroSubtitle: mission,
    heroSubtitleFr: missionFr,
    missionHeading: "How we serve",
    missionHeadingFr: "Comment nous agissons",
    missionBody: mission,
    missionBodyFr: missionFr,
    missionCards: pillars,
    ctaHeading: "Partner with ADA",
    ctaHeadingFr: "Devenez partenaire d’ADA",
    ctaBody: "Speak with our team about how you can support documented outreach in Cameroon.",
    ctaBodyFr: "Échangez avec notre équipe sur les façons de soutenir nos actions documentées au Cameroun.",
  },
  aboutPage: {
    missionStatement: mission,
    missionStatementFr: missionFr,
    storyParagraphs: [
      "Lionel Tchami Nfada founded Apoti Development Association in 2021. That November, our team brought food to widows in Buea and made time to listen and pray with those who wished to join.",
      "Today our focus is women and adolescent girls, including widows and mothers. The archive preserves the record of earlier community outreaches.",
    ],
    storyParagraphsFr: [
      "Lionel Tchami Nfada a fondé Apoti Development Association en 2021. En novembre, notre équipe a apporté des denrées aux veuves de Buea, a pris le temps de les écouter et a prié avec celles qui le souhaitaient.",
      "Aujourd’hui, nous accordons la priorité aux femmes et aux adolescentes, notamment aux veuves et aux mères. Les archives gardent la trace de nos actions communautaires antérieures.",
    ],
    programs: pillars,
    timeline: [
      { _key: "tl1", year: "2021", event: "Lionel Tchami Nfada founded ADA. Our team made its first widows’ home visits in Buea.", eventFr: "Lionel Tchami Nfada fonde ADA. L’équipe effectue ses premières visites à domicile auprès de veuves à Buea." },
      { _key: "tl3", year: "2023", event: "Back-to-school supplies in Buea.", eventFr: "Fournitures scolaires à Buea." },
      { _key: "tl4", year: "2025", event: "Our outreach work began in Bamenda.", eventFr: "Début de nos actions à Bamenda." },
      { _key: "tl6", year: "2026", event: "Girls’ Dignity and Menstrual Health Outreach in Bamenda.", eventFr: "Action pour la dignité et la santé menstruelle des filles à Bamenda." },
    ],
  },
};

type Row = Record<string, unknown> & { _id: string; _rev: string; _type: string; slug?: { current: string } };
const params = { ids: [...Object.keys(team), ...Object.keys(singletonFields)], slugs: Object.keys(archive) };
const query = `*[
  _id in $ids || _id in $drafts ||
  (_type == "projectRecord" && slug.current in $slugs)
] {
  ...,
  "linkedLocationFr": sourceProject->locationFr
}`;
async function main() {
  const rows = await client.fetch<Row[]>(query, { ...params, drafts: params.ids.map(id => `drafts.${id}`) });
  if (rows.some(row => row._id.startsWith("drafts.") || row._id.startsWith("versions."))) {
    throw new Error("A draft or release version exists for a targeted record. Review it manually before applying.");
  }
  const patches = new Map<Row, Record<string, unknown>>();
  for (const [id, expected] of Object.entries(team)) {
    const row = rows.find(row => row._id === id);
    if (!row || row._type !== "teamMember" || row.name !== expected) throw new Error(`Unexpected roster record: ${id}`);
    if (row.isActive !== false) patches.set(row, { isActive: false });
  }
  for (const [slug, { en, fr }] of Object.entries(archive)) {
    const matches = rows.filter(row => row._type === "projectRecord" && row.slug?.current === slug);
    if (matches.length !== 1 || matches[0].location !== en) throw new Error(`Unexpected archive record: ${slug}`);
    const row = matches[0];
    if (row.locationFr && row.locationFr !== fr && row.locationFr !== row.linkedLocationFr) {
      throw new Error(`Unrecognized French archive location: ${slug}`);
    }
    if (row.locationFr !== fr) patches.set(row, { locationFr: fr });
  }
  for (const [id, update] of Object.entries(singletonFields)) {
    const row = rows.find(row => row._id === id);
    if (!row || row._type !== id) throw new Error(`Unexpected singleton: ${id}`);
    if (Object.keys(update).some(key => JSON.stringify(row[key]) !== JSON.stringify(update[key]))) {
      patches.set(row, update);
    }
  }
  for (const [row, fields] of patches) console.log(`${row._id}: ${Object.keys(fields).join(", ")}`);
  if (!process.argv.includes("--apply")) {
    console.log(`Dry run: ${patches.size} records; no writes.`);
    return;
  }
  if (patches.size === 0) return;
  const tx = client.transaction();
  for (const [row, fields] of patches) {
    tx.patch(row._id, patch => patch.ifRevisionId(row._rev).set(fields));
  }
  const result = await tx.commit({ visibility: "sync" });
  console.log(`Updated ${patches.size} records as one revision-checked transaction: ${result.transactionId}`);
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
