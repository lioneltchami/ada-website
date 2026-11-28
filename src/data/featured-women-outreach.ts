/** Dated, published evidence; these examples do not imply enrolment or a scheduled repeat. */
export const featuredWomenOutreach = [
  {
    slug: "widow-support-food-cash-mar-2022",
    title: { en: "Support for widows", fr: "Soutien aux veuves" },
    context: { en: "Muea, Buea · March 2022", fr: "Muea, Buea · Mars 2022" },
    evidence: {
      en: "Our team listened to widows about their needs and visited approximately 20 women at home with food and household essentials.",
      fr: "Notre équipe a écouté les veuves parler de leurs besoins et a rendu visite à environ 20 femmes pour leur apporter des denrées et des produits de première nécessité.",
    },
    link: { en: "Read the widows’ outreach report (PDF)", fr: "Lire le rapport sur le soutien aux veuves (PDF)" },
  },
  {
    slug: "girls-dignity-menstrual-health-bamenda-jun-2026",
    title: { en: "Girls’ dignity and menstrual health", fr: "Dignité et santé menstruelle des adolescentes" },
    context: { en: "Bamenda · June 2026", fr: "Bamenda · Juin 2026" },
    evidence: {
      en: "Twenty girls took part in a practical session on menstrual health and each received a parcel. We prepared 26 parcels; 20 were distributed to participants.",
      fr: "Vingt adolescentes ont participé à une séance pratique sur la santé menstruelle et ont chacune reçu un colis. Nous avons préparé 26 colis, dont 20 ont été remis aux participantes.",
    },
    link: { en: "Read the girls’ dignity outreach report (PDF)", fr: "Lire le rapport sur la dignité des adolescentes (PDF)" },
  },
  {
    slug: "prenatal-care-support-program",
    title: { en: "Practical support for mothers and newborns", fr: "Aide concrète aux mères et à leurs nouveau-nés" },
    context: { en: "Muea, Buea · July 2025", fr: "Muea, Buea · Juillet 2025" },
    evidence: {
      en: "At a hospital in Muea, we provided about 15 mothers with diapers, buckets and other essentials for themselves and their newborns. This was a completed outreach, not a clinical service.",
      fr: "Dans un hôpital de Muea, nous avons remis à environ 15 mères des couches, des seaux et d’autres articles essentiels pour elles et leurs nouveau-nés. Il s’agissait d’une action ponctuelle, et non de soins médicaux.",
    },
    link: { en: "Read the mothers’ outreach report (PDF)", fr: "Lire le rapport sur le soutien aux mères (PDF)" },
  },
] as const;

export function featuredWomenReportHref(slug: (typeof featuredWomenOutreach)[number]["slug"]) {
  return `/docs/projects/${slug}/report.pdf`;
}
