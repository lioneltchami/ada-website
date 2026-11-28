/**
 * Seed French (*Fr) fields on live Sanity docs from known FR site copy.
 * Safe to re-run: sets French fields and omits the withdrawn water project.
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

// The reviewed bilingual Home and About copy is maintained in the website routes.
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
      "Aide alimentaire et financière pour les veuves et les familles.",
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
