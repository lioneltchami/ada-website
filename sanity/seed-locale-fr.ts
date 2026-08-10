/**
 * Seed French (*Fr) fields on live Sanity docs from known FR site copy.
 * Safe to re-run: only sets *Fr fields; never overwrites English base.
 *
 * Run: npx tsx sanity/seed-locale-fr.ts
 */
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { createClient } from "@sanity/client";

function resolveToken(): string {
  const env = process.env.SANITY_TOKEN || process.env.SANITY_API_TOKEN || "";
  if (env) return env;
  const cfgPath = join(homedir(), ".config/sanity/config.json");
  if (existsSync(cfgPath)) {
    try {
      const cfg = JSON.parse(readFileSync(cfgPath, "utf8"));
      if (cfg.authToken) return cfg.authToken;
    } catch {}
  }
  throw new Error("No Sanity token (SANITY_TOKEN / CLI config)");
}

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || "rj2m21gk",
  dataset: process.env.SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: resolveToken(),
  useCdn: false,
});

const aboutFr = {
  missionStatementFr:
    "Faire briller la lumière de Jésus-Christ en autonomisant les veuves, orphelins et jeunes femmes du Cameroun à travers la distribution alimentaire, l'éducation, la formation professionnelle et les soins de santé — restaurant la dignité et construisant l'autonomie.",
  storyHeadingFr: "Notre histoire",
  storyParagraphsFr: [
    "Fondée en 2021, Apoti Development Association est née d'une conviction profonde que la foi doit s'exprimer par l'action. Au cœur du Cameroun, où les veuves, les orphelins et les jeunes femmes font face à des défis quotidiens de pauvreté et de marginalisation, nous avons vu une opportunité de faire une différence tangible.",
    "Le Pasteur Emmanuel Tchami, témoin des luttes des veuves de sa communauté qui avaient tout perdu — leur mari, leurs revenus, leur dignité — s'est senti appelé à agir. Il a rassemblé un petit groupe de croyants engagés et ensemble, ils ont livré leurs premiers colis alimentaires à trois veuves à Bamenda.",
    "Ce qui a commencé comme un simple acte de compassion est devenu une organisation communautaire servant 5 communautés à travers le Cameroun, touchant plus de 200 vies à travers six programmes ciblés. Chaque programme est conçu non seulement pour apporter un soulagement, mais pour construire une autonomie durable.",
  ],
  coreValuesFr: [
    {
      titleFr: "Foi et Amour",
      descriptionFr:
        "Enracinés dans la foi chrétienne, nous servons avec un amour inconditionnel.",
    },
    {
      titleFr: "Dignité et Respect",
      descriptionFr:
        "Chaque personne est traitée avec la dignité qu'elle mérite.",
    },
    {
      titleFr: "Autonomisation",
      descriptionFr:
        "Nous équipons les gens de compétences pour construire leur propre avenir.",
    },
    {
      titleFr: "Transparence",
      descriptionFr:
        "Nous sommes responsables envers nos donateurs et communautés.",
    },
    {
      titleFr: "Partenariat Communautaire",
      descriptionFr: "Nous travaillons aux côtés des leaders locaux.",
    },
    {
      titleFr: "Impact Durable",
      descriptionFr:
        "Nos programmes créent un changement à long terme, pas un soulagement temporaire.",
    },
  ],
  programsFr: [
    {
      titleFr: "Distribution Alimentaire",
      descriptionFr:
        "Colis alimentaires réguliers pour les veuves et familles.",
    },
    {
      titleFr: "Formation Professionnelle",
      descriptionFr: "Couture, coiffure et artisanat pour les jeunes femmes.",
    },
    {
      titleFr: "Visites Hospitalières",
      descriptionFr: "Soutien médical et visites aux membres de la communauté.",
    },
    {
      titleFr: "Soutien Scolaire",
      descriptionFr:
        "Fournitures, uniformes et frais de scolarité pour les orphelins.",
    },
    {
      titleFr: "Eau Potable",
      descriptionFr: "Accès à l'eau potable pour les communautés défavorisées.",
    },
    {
      titleFr: "Nettoyage Communautaire",
      descriptionFr:
        "Gestion environnementale à travers des campagnes de nettoyage et plantation d'arbres.",
    },
  ],
  timelineFr: [
    {
      eventFr:
        "Fondée à Buea — premiers colis alimentaires livrés aux veuves en difficulté",
    },
    {
      eventFr:
        "Lancement du Programme Veuves — 15 veuves inscrites en formation professionnelle",
    },
    {
      eventFr: "Programme d'éducation — 20 orphelins parrainés pour l'école",
    },
    {
      eventFr:
        "Bureau de Bamenda ouvert — expansion régionale et documentation partenaires",
    },
    {
      eventFr:
        "200+ vies impactées — nettoyage communautaire mobilise 200 bénévoles",
    },
    {
      eventFr:
        "Partenariats institutionnels canadiens — planification du deuxième puits et centre de formation",
    },
  ],
  financialSplitFr: [
    { labelFr: "Aide directe aux programmes" },
    { labelFr: "Opérations et administration" },
    { labelFr: "Collecte de fonds" },
  ],
};

const homeFr = {
  heroBadgeFr: "Foi · Compassion · Action",
  heroHeadlineFr: "Autonomiser les communautés vulnérables au Cameroun",
  heroSubtitleFr:
    "Association caritative chrétienne servant les veuves, orphelins et jeunes femmes depuis 2021.",
  missionHeadingFr: "Ce que nous faisons",
  missionBodyFr:
    "Nous combinons aide d'urgence et programmes durables pour restaurer la dignité et construire l'autonomie.",
  missionCardsFr: [
    {
      titleFr: "Soutien aux Veuves",
      descriptionFr:
        "Aide financière, formation professionnelle et accompagnement communautaire pour les veuves qui reconstruisent leur vie.",
    },
    {
      titleFr: "Éducation",
      descriptionFr:
        "Fournitures scolaires, frais de scolarité, uniformes et mentorat pour les enfants orphelins et vulnérables.",
    },
    {
      titleFr: "Autonomisation",
      descriptionFr:
        "Formation professionnelle, microfinance et appui au démarrage pour les jeunes femmes en quête d'indépendance.",
    },
  ],
  ctaHeadingFr: "Financez des kits scolaires pour Buea et Bamenda",
  ctaBodyFr:
    "Votre don achète sacs, livres et frais pour que les enfants orphelins et déplacés commencent l'année scolaire dans la dignité.",
};

const impactLabelFr: Record<string, string> = {
  "Lives Impacted": "Vies impactées",
  "Communities Served": "Communautés servies",
  "Widows Supported": "Veuves soutenues",
  "Years of Service": "Années de service",
};

const projectFrBySlug: Record<
  string,
  { titleFr: string; locationFr?: string; descriptionFr: string }
> = {
  "widow-support": {
    titleFr: "Programme de Soutien aux Veuves",
    locationFr: "Bamenda",
    descriptionFr:
      "Aide financière, colis alimentaires et formation professionnelle pour les veuves qui reconstruisent leur vie après une perte. Notre programme fournit des vivres mensuels, une formation en couture et coiffure, et un réseau communautaire de soutien.",
  },
  "education-orphans": {
    titleFr: "Éducation des Orphelins",
    locationFr: "Douala",
    descriptionFr:
      "Soutien scolaire complet pour les enfants orphelins : fournitures, uniformes, frais de scolarité et mentorat. Chaque enfant mérite une éducation de qualité, quelles que soient ses circonstances.",
  },
  "women-empowerment": {
    titleFr: "Autonomisation des Jeunes Femmes",
    locationFr: "Yaoundé",
    descriptionFr:
      "Formation professionnelle et microfinance pour les jeunes femmes en quête d'indépendance financière. Couture, coiffure, informatique et gestion de petite entreprise.",
  },
  "emergency-relief": {
    titleFr: "Fonds de Secours d'Urgence",
    locationFr: "Plusieurs régions",
    descriptionFr:
      "Fonds de réponse rapide pour les besoins urgents : distribution alimentaire, assistance médicale et abri temporaire en cas de crise.",
  },
  "education-drive": {
    titleFr: "Campagne Annuelle d'Éducation",
    locationFr: "Zones rurales",
    descriptionFr:
      "Campagne de rentrée scolaire fournissant fournitures, uniformes et frais pour les enfants des communautés rurales qui autrement manqueraient l'école.",
  },
  "christmas-giving": {
    titleFr: "Campagne de Noël",
    locationFr: "Bamenda et villages environnants",
    descriptionFr:
      "Campagne de fêtes apportant colis alimentaires, vêtements et cadeaux aux familles dans le besoin.",
  },
  "back-to-school-buea-aug-2026": {
    titleFr: "Rentrée Scolaire — Buea",
    locationFr: "Buea, région du Sud-Ouest",
    descriptionFr:
      "Campagne annuelle de rentrée scolaire à Buea. Équiper les enfants défavorisés en fournitures scolaires pour apprendre, grandir et réussir. Fenêtre prévue : 15–18 août 2026.",
  },
  "back-to-school-bamenda-aug-2026": {
    titleFr: "Rentrée Scolaire — Bamenda",
    locationFr: "Mile 4 Nkwen, Bamenda, région du Nord-Ouest",
    descriptionFr:
      "Campagne de rentrée scolaire à Mile 4 Nkwen, Bamenda. Fournitures scolaires pour les enfants défavorisés. Fenêtre prévue : 28–31 août 2026.",
  },
  "girls-dignity-menstrual-health-bamenda-jun-2026": {
    titleFr: "Dignité et Santé Menstruelle des Filles",
    locationFr: "Bamenda",
    descriptionFr:
      "Sensibilisation du 27 juin pour 25 filles à Bamenda : kits de dignité menstruelle, seaux, savon, sous-vêtements, et session d'éducation sur l'hygiène menstruelle.",
  },
};

const volunteerFrByTitle: Record<
  string,
  { titleFr: string; descriptionFr: string; timeCommitmentFr: string }
> = {
  "Community Coordinator": {
    titleFr: "Coordinateur Communautaire",
    descriptionFr:
      "Diriger l'engagement communautaire et la mise en œuvre des programmes.",
    timeCommitmentFr: "10-15 h/semaine",
  },
  "Community Outreach Coordinator": {
    titleFr: "Coordinateur Communautaire",
    descriptionFr:
      "Diriger l'engagement communautaire et la mise en œuvre des programmes.",
    timeCommitmentFr: "10-15 h/semaine",
  },
  "Education Mentor": {
    titleFr: "Mentor Éducatif",
    descriptionFr:
      "Encadrer et accompagner les enfants orphelins dans notre programme éducatif.",
    timeCommitmentFr: "5-10 h/semaine",
  },
  "Skills Trainer": {
    titleFr: "Formateur Professionnel",
    descriptionFr:
      "Enseigner des compétences professionnelles aux jeunes femmes.",
    timeCommitmentFr: "8-12 h/semaine",
  },
  "Skills Training Facilitator": {
    titleFr: "Formateur Professionnel",
    descriptionFr:
      "Enseigner des compétences professionnelles aux jeunes femmes.",
    timeCommitmentFr: "8-12 h/semaine",
  },
  "Healthcare Volunteer": {
    titleFr: "Bénévole Santé",
    descriptionFr:
      "Aider aux visites hospitalières et aux campagnes de sensibilisation.",
    timeCommitmentFr: "5-8 h/semaine",
  },
  "Healthcare Support Volunteer": {
    titleFr: "Bénévole Santé",
    descriptionFr:
      "Aider aux visites hospitalières et aux campagnes de sensibilisation.",
    timeCommitmentFr: "5-8 h/semaine",
  },
  "Media & Communications": {
    titleFr: "Médias & Communication",
    descriptionFr:
      "Gérer les réseaux sociaux, créer du contenu et raconter notre histoire.",
    timeCommitmentFr: "5-10 h/semaine",
  },
  "Digital Media & Communications": {
    titleFr: "Médias & Communication",
    descriptionFr:
      "Gérer les réseaux sociaux, créer du contenu et raconter notre histoire.",
    timeCommitmentFr: "5-10 h/semaine",
  },
  Fundraising: {
    titleFr: "Collecte de Fonds",
    descriptionFr:
      "Aider à planifier des campagnes et coordonner des événements.",
    timeCommitmentFr: "Flexible",
  },
  "Fundraising & Events": {
    titleFr: "Collecte de Fonds",
    descriptionFr:
      "Aider à planifier des campagnes et coordonner des événements.",
    timeCommitmentFr: "Flexible",
  },
};

const testimonialFrByName: Record<
  string,
  { quoteFr: string; locationFr?: string; programFr: string }
> = {
  "Amina N.": {
    quoteFr:
      "Après le décès de mon mari, je ne savais pas comment nourrir mes enfants. ADA m'a fourni des colis alimentaires et m'a inscrite à une formation en couture. Aujourd'hui je gère ma propre boutique.",
    locationFr: "Bamenda",
    programFr: "Programme Veuves",
  },
  "Marie F.": {
    quoteFr:
      "ADA a payé mes frais de scolarité quand ma grand-mère ne pouvait pas. Ils m'ont donné des livres, un uniforme et un mentor. Je veux devenir infirmière.",
    locationFr: "Douala",
    programFr: "Éducation des Orphelins",
  },
  "Esther K.": {
    quoteFr:
      "Le programme de formation m'a appris la coiffure. ADA m'a même aidée à obtenir mes premiers outils. Maintenant j'ai des clients réguliers.",
    locationFr: "Yaoundé",
    programFr: "Autonomisation des Femmes",
  },
};

const donationFrByAmount: Record<number, string> = {
  25: "Fournitures scolaires pour 2 enfants",
  50: "Soutien d'une veuve pendant une semaine",
  100: "Formation professionnelle pour une femme",
  250: "Soins de santé pour 5 familles",
  500: "Formation agricole pour 3 agriculteurs",
  1000: "Initiative de nettoyage communautaire",
};

const siteSettingsFr = {
  taglineFr: "Foi · Compassion · Action",
  officeHoursFr: "Lun–Ven, 8h–17h (HAC)",
};

function mergeFrIntoObjects<T extends Record<string, unknown>>(
  existing: T[] | null | undefined,
  frRows: Record<string, string>[],
): T[] {
  const list = existing || [];
  return list.map((item, i) => {
    const fr = frRows[i] || {};
    return { ...item, ...fr };
  });
}

async function patchAbout() {
  const doc = await client.fetch(
    `*[_type == "aboutPage"][0]{
      _id, coreValues, programs, timeline, financialSplit
    }`,
  );
  if (!doc?._id) {
    console.warn("skip aboutPage — not found");
    return;
  }
  await client
    .patch(doc._id)
    .set({
      missionStatementFr: aboutFr.missionStatementFr,
      storyHeadingFr: aboutFr.storyHeadingFr,
      storyParagraphsFr: aboutFr.storyParagraphsFr,
      coreValues: mergeFrIntoObjects(doc.coreValues, aboutFr.coreValuesFr),
      programs: mergeFrIntoObjects(doc.programs, aboutFr.programsFr),
      timeline: mergeFrIntoObjects(doc.timeline, aboutFr.timelineFr),
      financialSplit: mergeFrIntoObjects(
        doc.financialSplit,
        aboutFr.financialSplitFr,
      ),
    })
    .commit();
  console.log("✅ aboutPage Fr fields");
}

async function patchHome() {
  const doc = await client.fetch(
    `*[_type == "homePage"][0]{ _id, missionCards }`,
  );
  if (!doc?._id) {
    console.warn("skip homePage — not found");
    return;
  }
  await client
    .patch(doc._id)
    .set({
      heroBadgeFr: homeFr.heroBadgeFr,
      heroHeadlineFr: homeFr.heroHeadlineFr,
      heroSubtitleFr: homeFr.heroSubtitleFr,
      missionHeadingFr: homeFr.missionHeadingFr,
      missionBodyFr: homeFr.missionBodyFr,
      missionCards: mergeFrIntoObjects(doc.missionCards, homeFr.missionCardsFr),
      ctaHeadingFr: homeFr.ctaHeadingFr,
      ctaBodyFr: homeFr.ctaBodyFr,
    })
    .commit();
  console.log("✅ homePage Fr fields");
}

async function patchMetrics() {
  const rows = await client.fetch(`*[_type == "impactMetric"]{ _id, label }`);
  for (const row of rows) {
    const labelFr = impactLabelFr[row.label];
    if (!labelFr) continue;
    await client.patch(row._id).set({ labelFr }).commit();
    console.log(`✅ impactMetric ${row.label} → ${labelFr}`);
  }
}

async function patchProjects() {
  const rows = await client.fetch(
    `*[_type == "project"]{ _id, "slug": slug.current, title }`,
  );
  for (const row of rows) {
    const fr = projectFrBySlug[row.slug];
    if (!fr) {
      console.warn(`skip project ${row.slug} — no Fr map`);
      continue;
    }
    await client.patch(row._id).set(fr).commit();
    console.log(`✅ project ${row.slug}`);
  }
}

async function patchVolunteers() {
  const rows = await client.fetch(`*[_type == "volunteerRole"]{ _id, title }`);
  for (const row of rows) {
    const fr = volunteerFrByTitle[row.title];
    if (!fr) {
      console.warn(`skip volunteerRole "${row.title}" — no Fr map`);
      continue;
    }
    await client.patch(row._id).set(fr).commit();
    console.log(`✅ volunteerRole ${row.title}`);
  }
}

async function patchTestimonials() {
  const rows = await client.fetch(`*[_type == "testimonial"]{ _id, name }`);
  for (const row of rows) {
    const fr = testimonialFrByName[row.name];
    if (!fr) continue;
    await client.patch(row._id).set(fr).commit();
    console.log(`✅ testimonial ${row.name}`);
  }
}

async function patchDonationTiers() {
  const rows = await client.fetch(`*[_type == "donationTier"]{ _id, amount }`);
  for (const row of rows) {
    const impactDescriptionFr = donationFrByAmount[row.amount];
    if (!impactDescriptionFr) continue;
    await client.patch(row._id).set({ impactDescriptionFr }).commit();
    console.log(`✅ donationTier ${row.amount}`);
  }
}

async function patchSiteSettings() {
  const doc = await client.fetch(`*[_type == "siteSettings"][0]{ _id }`);
  if (!doc?._id) return;
  await client.patch(doc._id).set(siteSettingsFr).commit();
  console.log("✅ siteSettings Fr fields");
}

async function main() {
  await patchAbout();
  await patchHome();
  await patchMetrics();
  await patchProjects();
  await patchVolunteers();
  await patchTestimonials();
  await patchDonationTiers();
  await patchSiteSettings();
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
