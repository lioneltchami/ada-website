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
      "In 2024, our team ran a back-to-school outreach in Buea focused on school supplies.",
      "We wanted to help pupils start the school year with the materials they need for class and ease some of the expense of preparing for school.",
      "The preparation record lists bags, books and basic stationery. It tells us what the team planned to provide, not how many items each pupil received.",
      "We can confirm that the outreach took place in Buea in 2024. We have not confirmed the day, the number of pupils reached or the amount spent."),
    fr: story("fr",
      "En 2024, notre équipe a mené à Buea une action de rentrée scolaire axée sur les fournitures.",
      "Nous voulions aider les élèves à commencer l’année avec le matériel nécessaire en classe et alléger une partie des dépenses liées à la rentrée.",
      "Le document de préparation mentionne des cartables, des livres et des fournitures de base. Il indique ce que l’équipe prévoyait de fournir, pas le nombre d’articles remis à chaque élève.",
      "Nous pouvons confirmer que l’action a eu lieu à Buea en 2024. La date précise, le nombre d’élèves touchés et le montant dépensé restent à confirmer."),
  },
  "girls-programme-2024": {
    en: story("en",
      "Our October 2024 programme in Buea focused on supporting girls. The team’s preparations included menstrual hygiene supplies.",
      "We wanted to make it easier for girls to access basic menstrual hygiene supplies.",
      "The preparation record lists sanitary supplies for participants. We have not confirmed exactly which items were distributed during the programme.",
      "We can confirm the programme took place in Buea in October 2024. The exact day, venue, number of participants and spending remain unconfirmed."),
    fr: story("fr",
      "En octobre 2024, notre programme à Buea visait à soutenir les filles. L’équipe avait prévu des produits d’hygiène menstruelle.",
      "Nous voulions faciliter l’accès des filles aux produits d’hygiène menstruelle de base.",
      "Le document de préparation mentionne des protections hygiéniques pour les participantes. Nous n’avons pas confirmé quels articles ont été distribués pendant le programme.",
      "Nous pouvons confirmer que le programme a eu lieu à Buea en octobre 2024. La date précise, le lieu, le nombre de participantes et les dépenses restent à confirmer."),
  },
  "christmas-giving-dec-2024": {
    en: story("en",
      "Our archive includes a 2024 entry for Christmas giving. Details of the visit are still being checked.",
      "The project was intended to share Christmas with children and offer practical support to the people caring for them.",
      "The older project report describes a visit with food, gifts and activities for children. The records available to us do not yet establish the venue or the details of the visit.",
      "An older project report is available. We are not treating its date, attendance figures or expenditure as confirmed."),
    fr: story("fr",
      "Nos archives contiennent une fiche sur l’action de solidarité de Noël de 2024. Les détails de la visite sont encore en cours de vérification.",
      "Le projet visait à partager la fête de Noël avec des enfants et à apporter un soutien concret aux personnes qui s’occupent d’eux.",
      "L’ancien rapport décrit une visite avec des vivres, des cadeaux et des activités pour les enfants. Les documents dont nous disposons ne permettent pas encore de confirmer le lieu ni le déroulement de la visite.",
      "Un ancien rapport est disponible. La date, les chiffres de participation et les dépenses qui y figurent ne sont pas confirmés."),
  },
  "emergency-food-relief-bamenda-crisis": {
    en: story("en",
      "This archive entry concerns a food relief project for families affected by displacement. We are still checking the location and timing in the older record.",
      "The project was intended to help families meet immediate food needs after displacement.",
      "The older report describes a plan to distribute food packages through local partners. The records we have reviewed do not confirm where or when the distributions took place.",
      "An older project report is available, but we have not corroborated the delivery, the number of families reached or the amount spent."),
    fr: story("fr",
      "Cette fiche d’archives concerne un projet d’aide alimentaire destiné à des familles touchées par des déplacements. Nous vérifions encore le lieu et la période indiqués dans l’ancien dossier.",
      "Le projet visait à répondre aux besoins alimentaires immédiats des familles après leur déplacement.",
      "L’ancien rapport décrit une distribution de colis alimentaires prévue avec des partenaires locaux. Les documents examinés ne confirment ni le lieu ni la période des distributions.",
      "Un ancien rapport est disponible, mais nous n’avons pas pu corroborer la distribution, le nombre de familles touchées ni le montant dépensé."),
  },
};
