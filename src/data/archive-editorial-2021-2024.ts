type Story = {
  lead: string;
  sections: { title: string; text: string }[];
};

function story(
  locale: "en" | "fr",
  lead: string,
  why: string,
  how: string,
  report: string,
): Story {
  const titles = locale === "en"
    ? ["Why we did it", "How we did the work", "What we can report"]
    : ["Pourquoi nous avons agi", "Comment nous avons procédé", "Ce que nous pouvons rapporter"];
  return { lead, sections: [why, how, report].map((text, index) => ({ title: titles[index], text })) };
}

// English is the source; French follows. Where an older record is disputed,
// describe the project's purpose without treating planned work as a result.
export const archiveEditorialEarly: Record<string, Record<"en" | "fr", Story>> = {
  "first-widow-home-visits-2021": {
    en: story("en",
      "Our first community outreach took us to the homes of widows in Buea in November 2021.",
      "We wanted to offer practical support and make time to listen to the people we were visiting. For our team, showing up in person was a way to put our Christian faith into practice.",
      "Our team visited widows at home. The project report describes bringing rice, listening to the women and praying with them.",
      "The visits took place in Buea that November. We have a project report, but we do not have an independently verified count of the people reached."),
    fr: story("fr",
      "En novembre 2021, notre première action communautaire nous a conduits au domicile de veuves à Buea.",
      "Nous voulions apporter une aide concrète et prendre le temps d’écouter les personnes à qui nous rendions visite. Pour notre équipe, aller à leur rencontre était une façon de mettre notre foi chrétienne en pratique.",
      "Notre équipe a rendu visite à des veuves chez elles. Le rapport décrit comment nous leur avons apporté du riz, écouté leurs témoignages et prié avec elles.",
      "Les visites ont eu lieu à Buea au cours de ce mois de novembre. Nous disposons d’un rapport, mais le nombre de personnes touchées n’a pas été vérifié de manière indépendante."),
  },
  "back-to-school-buea-2024": {
    en: story("en",
      "On August 31, 2024, our team held a Back to School Outreach in Buea.",
      "We wanted to help pupils begin the school year with useful classroom materials and ease some of the expense for their families.",
      "Our usual approach is to ask about local needs, seek permission and work with school staff. The two planning sheets list bags, books, pens, pencils, rulers, erasers and maths sets.",
      "The planned supplies totaled 82,750 FCFA. The report distinguishes the budget from what can be established about payments and distribution; we have no confirmed school or participant count for this visit."),
    fr: story("fr",
      "Le 31 août 2024, notre équipe a organisé une action de rentrée scolaire à Buea.",
      "Nous voulions aider les élèves à commencer l’année avec du matériel utile en classe et alléger une partie des frais de rentrée pour leurs familles.",
      "Nous nous renseignons habituellement sur les besoins locaux, demandons les autorisations et travaillons avec le personnel scolaire. Les deux fiches de préparation prévoient des cartables, des livres, des stylos, des crayons, des règles, des gommes et des ensembles de géométrie.",
      "Le budget des fournitures s’élevait à 82 750 FCFA. Le rapport distingue le budget des informations disponibles sur les paiements et la distribution ; ni l’établissement scolaire ni le nombre de participants n’ont été confirmés."),
  },
  "girls-programme-2024": {
    en: story("en",
      "On October 18, 2024, our team held an outreach in Buea marking the International Day of the Girl Child, observed on October 11.",
      "We wanted girls to have access to basic menstrual and personal hygiene supplies, and space to ask questions without embarrassment.",
      "The programme plan included talks, time for questions and a supply distribution. The budget included sanitary pads, small buckets, towels and a guest honorarium.",
      "The itemized budget totals 250,700 FCFA. The planning records do not confirm the final venue, attendance, purchases or which supplies were distributed."),
    fr: story("fr",
      "Le 18 octobre 2024, notre équipe a organisé une action à Buea à l’occasion de la Journée internationale de la fille, célébrée le 11 octobre.",
      "Nous voulions faciliter l’accès des filles aux produits de base pour l’hygiène menstruelle et personnelle, et leur permettre de poser des questions sans gêne.",
      "Le programme prévoyait des interventions, un temps de questions et une distribution de fournitures. Le budget comprenait des protections hygiéniques, de petits seaux, des serviettes et des honoraires pour une intervention.",
      "Le budget détaillé totalise 250 700 FCFA. Les documents de préparation ne confirment ni le lieu précis, ni le nombre de participantes, ni les achats ou articles distribués."),
  },
  "christmas-giving-dec-2024": {
    en: story("en",
      "Our Christmas Giving visit took place on December 21, 2024, in Buea.",
      "We wanted to offer practical support to a children’s home at Christmas and encourage the people who care for the children throughout the year.",
      "The earlier account describes provisions and gifts. The 2024 budget matches the previous year and includes rice, cooking oil, other foodstuffs, clothing, footwear, toys and operating costs.",
      "We budgeted 260,000 FCFA. The report details that budget, not actual payments. We have not confirmed the name of the home or attendance."),
    fr: story("fr",
      "Notre visite de solidarité de Noël a eu lieu le 21 décembre 2024 à Buea.",
      "Nous voulions apporter une aide concrète à un foyer pour enfants à Noël et encourager les personnes qui s’occupent des enfants tout au long de l’année.",
      "Le compte rendu précédent mentionne des vivres et des cadeaux. Le budget de 2024 reprend celui de l’année précédente : riz, huile de cuisson, autres denrées, vêtements, chaussures, jouets et frais de fonctionnement.",
      "Nous avons prévu un budget de 260 000 FCFA. Le rapport détaille ce budget ; il ne s’agit pas d’un relevé des paiements. Nous n’avons confirmé ni le nom du foyer ni le nombre de participants."),
  },
};
