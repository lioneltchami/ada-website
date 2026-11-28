type Locale = "en" | "fr";
type PersonId = "lionel-tchami-nfada" | "naomi" | "corrine-mbekenyui" | "vera-buh" | "christy-nkongho" | "caleb-ketu" | "brenda-itoe" | "baam-yasmiratu" | "ashley-b";
type Portrait = { src: string };

// Add real portraits here only once the person approves public use.
// Leave missing entries empty: the page displays a complete text-only card.
const portraits: Partial<Record<PersonId, Portrait>> = {};

const people = [
  {
    id: "lionel-tchami-nfada",
    name: "Lionel Tchami Nfada",
    en: {
      role: "Founder & President",
      summary: "Guides ADA’s mission and works with sponsors.",
      bio: "Lionel founded ADA in 2021, when the team began visiting widows in Buea. He helps keep our outreach rooted in Christian faith and focused on practical support for women and adolescent girls.",
    },
    fr: {
      role: "Fondateur et président",
      summary: "Oriente la mission d’ADA et travaille avec ses partenaires de soutien.",
      bio: "Lionel a fondé ADA en 2021, lorsque l’équipe a commencé à rendre visite aux veuves à Buea. Il veille à ce que nos actions restent ancrées dans la foi chrétienne et répondent aux besoins concrets des femmes et des adolescentes.",
    },
  },
  {
    id: "naomi",
    name: "Naomi Ndibabonga",
    en: {
      role: "Vice-President & Country Director",
      summary: "Coordinates ADA’s outreach in Cameroon.",
      bio: "Naomi works with local partners and follows up on how outreach is carried out.",
    },
    fr: {
      role: "Vice-présidente et directrice pays",
      summary: "Coordonne les actions d’ADA au Cameroun.",
      bio: "Naomi travaille avec les partenaires locaux et assure le suivi des actions sur le terrain.",
    },
  },
  {
    id: "corrine-mbekenyui",
    name: "Corrine Mbekenyui",
    en: {
      role: "Regional Coordinator NW",
      summary: "Supports outreach planning in the North West Region.",
      bio: "Corrine helps coordinate with local communities and supports reporting on the work carried out.",
    },
    fr: {
      role: "Coordinatrice régionale Nord-Ouest",
      summary: "Appuie la préparation des actions dans la région du Nord-Ouest.",
      bio: "Corrine facilite les échanges avec les communautés locales et contribue aux comptes rendus des actions menées.",
    },
  },
  {
    id: "vera-buh",
    name: "Vera Buh",
    en: { role: "Secretary", summary: "Keeps minutes and official records." },
    fr: { role: "Secrétaire", summary: "Tient les procès-verbaux et les documents officiels." },
  },
  {
    id: "christy-nkongho",
    name: "Christy Nkongho",
    en: { role: "Treasurer", summary: "Oversees finances and reports to the committee." },
    fr: { role: "Trésorière", summary: "Supervise les finances et en rend compte au comité." },
  },
  {
    id: "caleb-ketu",
    name: "Caleb Ketu",
    en: { role: "Executive Committee Member", summary: "" },
    fr: { role: "Membre du comité exécutif", summary: "" },
  },
  {
    id: "brenda-itoe",
    name: "Brenda Itoe",
    en: { role: "Safeguarding Focal Person", summary: "" },
    fr: { role: "Référente pour la protection", summary: "" },
  },
  {
    id: "baam-yasmiratu",
    name: "Ba’am Yasmiratu",
    en: { role: "PR & Communications Lead", summary: "" },
    fr: { role: "Responsable des relations publiques et de la communication", summary: "" },
  },
  {
    id: "ashley-b",
    name: "Ashley B.",
    en: { role: "Accountant", summary: "" },
    fr: { role: "Comptable", summary: "" },
  },
] satisfies Array<{ id: PersonId; name: string } & Record<Locale, { role: string; summary: string; bio?: string }>>;

export function getTeamRoster(locale: Locale) {
  const profiles = people.map(({ id, name, [locale]: copy }) => ({
    id, name, portrait: portraits[id], ...copy,
  }));
  const governanceIds: readonly PersonId[] = [
    "lionel-tchami-nfada", "naomi", "vera-buh", "christy-nkongho", "caleb-ketu",
  ];
  return {
    groups: [
      { title: locale === "en" ? "Governance" : "Gouvernance", profiles: profiles.filter(({ id }) => governanceIds.includes(id)) },
      { title: locale === "en" ? "Operations" : "Équipe opérationnelle", profiles: profiles.filter(({ id }) => !governanceIds.includes(id)) },
    ],
    readBio: locale === "en" ? "Read bio" : "Lire la présentation",
    board: locale === "en"
      ? { title: "Board of Directors", text: "The board oversees ADA’s direction, budgets, policies, and significant restricted gifts." }
      : { title: "Conseil d’administration", text: "Le conseil supervise les orientations d’ADA, les budgets, les politiques et les dons importants à affectation particulière." },
  };
}
