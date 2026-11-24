type ArchiveEditorial = {
  lead: string;
  sections: { title: string; text: string }[];
  financialLabels?: [string, string, string];
  financialBasis?: string;
};

// English is the source; French is its translation. The editorial copy uses
// the released project reports, not draft allocations or older CMS claims.
export const archiveResolvedFinance: Record<string, { received: number; itemSubtotal: number; fees: number }> = {
  "city-cleanup-may-2023": { received: 100000, itemSubtotal: 94400, fees: 1500 },
};
function projectStory(
  lead: string,
  why: string,
  how: string,
  evidence: string,
  locale: "en" | "fr" = "en",
): ArchiveEditorial {
  const titles = locale === "fr"
    ? ["Pourquoi nous avons agi", "Comment nous avons procédé", "Ce que nous pouvons rapporter"]
    : ["Why we did it", "How we did the work", "What we can report"];
  return { lead, sections: [why, how, evidence].map((text, index) => ({ title: titles[index], text })) };
}

export const archiveEditorial: Record<string, Record<"en" | "fr", ArchiveEditorial>> = {
  "city-cleanup-may-2023": {
    en: {
      lead: "On Labour Day, our team and volunteers cleared litter from shared spaces in Buea. It was a practical way to care for our neighbors and give back through our time and effort.",
      sections: [
        { title: "Why we did it", text: "Taking care of shared spaces is part of taking care of the people who use them. For our team, serving Buea this way was a practical expression of our Christian faith. Participation did not depend on joining prayer or worship." },
        { title: "How we did the work", text: "We used buckets, a rake and a spade to gather litter, with masks and gloves for protection. The project record also lists transport, caps, T-shirts and lettering for the buckets." },
        { title: "What we can report", text: "We carried out the cleanup in Buea. The project record does not give a participant count, the amount of litter collected, or a measured effect on public health." },
      ],
      financialLabels: ["Funding received", "Recorded expenses", "Balance after the project"],
      financialBasis: "Recorded expenses include 1,500 FCFA in fees. The balance is for this project at the time, not the current balance of our account. The figures are from our project record, not an independent audit.",
    },
    fr: {
      lead: "À l’occasion de la fête du Travail, notre équipe et des bénévoles ont ramassé des déchets dans des espaces communs à Buea. C’était une façon concrète de prendre soin de nos voisins en donnant de notre temps et de notre énergie.",
      sections: [
        { title: "Pourquoi nous avons agi", text: "Prendre soin des espaces communs, c’est aussi prendre soin des personnes qui les utilisent. Pour notre équipe, servir Buea de cette manière était une expression concrète de notre foi chrétienne. Il n’était pas nécessaire de prendre part à la prière ou à la louange pour participer au nettoyage." },
        { title: "Comment nous avons procédé", text: "Nous avons ramassé les déchets à l’aide de seaux, d’un râteau et d’une bêche, avec des masques et des gants pour nous protéger. Le relevé du projet mentionne aussi le transport, les casquettes, les tee-shirts et le marquage des seaux." },
        { title: "Ce que nous pouvons rapporter", text: "Nous avons mené le nettoyage à Buea. Le relevé du projet ne précise ni le nombre de participants, ni la quantité de déchets collectés, ni d’effet mesuré sur la santé publique." },
      ],
      financialLabels: ["Financement reçu", "Dépenses enregistrées", "Solde après le projet"],
      financialBasis: "Les dépenses enregistrées comprennent 1 500 FCFA de frais. Le solde est celui du projet à l’époque, pas le solde actuel de notre compte. Les chiffres proviennent de notre relevé du projet, et non d’un audit indépendant.",
    },
  },
  // 2023: released completion reports; funding and accounting stay in the existing records.
  "youth-day-snacks-feb-2023": {
    en: projectStory(
      "On Youth Day, our team brought snacks to children taking part in the march in Buea.",
      "We wanted to encourage the children and offer them something practical while they were taking part in Youth Day.",
      "Instead of organizing a separate gathering, we went to the marching area and shared snacks there. This was a separate activity from the support we offered later in February during preparations for the Mountain Race.",
      "We shared snacks with children at the march. Our records do not give a headcount, the exact distribution site, or the kinds and quantities of snacks.",
    ),
    fr: projectStory(
      "À l’occasion de la Fête de la jeunesse, notre équipe a apporté des collations aux enfants qui défilaient à Buea.",
      "Nous voulions encourager les enfants et leur apporter un soutien concret pendant leur participation à la Fête de la jeunesse.",
      "Plutôt que d’organiser une rencontre à part, nous sommes allés dans la zone du défilé pour y distribuer les collations. Cette action était distincte de celle menée plus tard en février pendant les préparatifs de la course de la montagne.",
      "Nous avons distribué des collations aux enfants présents au défilé. Nos relevés ne précisent ni leur nombre, ni le lieu exact de distribution, ni les types et quantités de collations.",
      "fr",
    ),
  },
  "mountain-race-outreach-feb-2023": {
    en: projectStory(
      "Later in February, our team went to the field where people were preparing for the Mount Cameroon Race of Hope in Buea.",
      "We wanted to bring refreshments and offer simple ways to get some shade or keep cool during the preparations.",
      "We shared bananas, other food and drinking water in sachets. We also brought caps, umbrellas and handheld fans. This visit came after our separate Youth Day activity.",
      "Our project account records the visit and the kinds of supplies we brought. It does not give the exact day of the outreach, the field’s name, or the number of people reached.",
    ),
    fr: projectStory(
      "Plus tard en février, notre équipe s’est rendue sur le terrain où se déroulaient les préparatifs de la Course de l’espoir du mont Cameroun, à Buea.",
      "Nous voulions offrir des rafraîchissements et des moyens simples de trouver un peu d’ombre ou de se protéger de la chaleur pendant les préparatifs.",
      "Nous avons distribué des bananes, d’autres aliments et de l’eau potable en sachets. Nous avons aussi apporté des casquettes, des parapluies et des éventails. Cette visite a eu lieu après notre action distincte pour la Fête de la jeunesse.",
      "Le compte rendu décrit la visite et la nature des fournitures apportées. Il ne précise ni le jour de l’action, ni le nom du terrain, ni le nombre de personnes touchées.",
      "fr",
    ),
  },
  "womens-day-home-visits-mar-2023": {
    en: projectStory(
      "In March, we invited widows in Buea to a gathering at a church instead of visiting them at home.",
      "Around International Women’s Day, we wanted to make room for women to come together, receive encouragement and get practical help for their households.",
      "We invited interested women to meet on 11 March. Where the cost of travel stood in the way, our team tried to help as circumstances allowed. Taking part in prayer or worship was not a condition for receiving assistance.",
      "The gathering combined encouragement and practical household support. Our records do not give the church’s name, an attendance count, the number of trips we helped with, or the goods each household received.",
    ),
    fr: projectStory(
      "En mars, nous avons invité des veuves de Buea à se retrouver dans une église plutôt que de leur rendre visite à domicile.",
      "Autour de la Journée internationale des femmes, nous voulions permettre aux femmes de se retrouver, de recevoir des encouragements et d’obtenir une aide concrète pour leur foyer.",
      "Nous avons invité les femmes intéressées à se retrouver le 11 mars. Lorsque le coût du déplacement était un obstacle, notre équipe a essayé d’aider dans la mesure de ses moyens. Il n’était pas nécessaire de prendre part à la prière ou à la louange pour recevoir cette aide.",
      "Cette rencontre a associé encouragements et aide matérielle aux foyers. Nos relevés ne précisent ni le nom de l’église, ni le nombre de participantes, ni le nombre de trajets pris en charge, ni les articles remis à chaque foyer.",
      "fr",
    ),
  },
  "back-to-school-drive-2023": {
    en: projectStory(
      "We brought school supplies to students at Lycée de Buea as they prepared for the new school year.",
      "Families can face several costs at once at the start of the school year. We wanted students to have the basic materials they needed when they returned to class.",
      "Our team provided exercise books, school bags, pens and other learning materials. This outreach covered supplies, not school fees.",
      "The record establishes the school and the kinds of supplies provided. It does not give the exact date, a student count, or a list of what each student received. The record does not show measured learning outcomes.",
    ),
    fr: projectStory(
      "Nous avons apporté des fournitures aux élèves du Lycée de Buea alors qu’ils se préparaient pour la nouvelle année scolaire.",
      "À la rentrée, les familles peuvent avoir plusieurs dépenses à assumer en même temps. Nous voulions que les élèves disposent du matériel de base dès leur retour en classe.",
      "Notre équipe a distribué des cahiers, des cartables, des stylos et d’autres fournitures scolaires. Cette action concernait les fournitures, pas les frais de scolarité.",
      "Le compte rendu indique l’établissement et les types de fournitures remis. Il ne précise ni la date exacte, ni le nombre d’élèves, ni ce que chacun a reçu. Le compte rendu ne présente pas de résultats d’apprentissage mesurés.",
      "fr",
    ),
  },
  "girls-day-oct-2023": {
    en: projectStory(
      "On 11 October, our team provided sanitary pads and other personal care supplies to girls in Buea.",
      "For International Day of the Girl, we wanted to help girls meet everyday hygiene needs with dignity and respect for their privacy.",
      "We focused on practical supplies girls could use, including sanitary pads. Receiving support did not depend on joining prayer or worship.",
      "Our report records the types of supplies provided. It does not establish the exact venue, how many girls received support, or the quantity of each item.",
    ),
    fr: projectStory(
      "Le 11 octobre, notre équipe a remis des serviettes hygiéniques et d’autres produits de soin personnel à des filles à Buea.",
      "Pour la Journée internationale de la fille, nous voulions aider les filles à répondre à leurs besoins d’hygiène au quotidien, dans le respect de leur dignité et de leur vie privée.",
      "Nous avons privilégié des fournitures utiles au quotidien, dont des serviettes hygiéniques. Il n’était pas nécessaire de prendre part à la prière ou à la louange pour recevoir cette aide.",
      "Le rapport indique les types de fournitures remis. Il ne précise ni le lieu exact, ni le nombre de filles ayant reçu de l’aide, ni les quantités par article.",
      "fr",
    ),
  },
  "christmas-giving-dec-2023": {
    en: projectStory(
      "Two days before Christmas, our team visited House of Peace Orphanage in Buea with food for the children’s home.",
      "We wanted to share the joy of Christmas in a practical way and stand alongside the adults who care for the children throughout the year.",
      "On 23 December, we took foodstuffs to the orphanage, including bags of rice and cooking oil for day-to-day needs.",
      "Our team estimates the visit reached about 21 children. We do not have a separate caregiver count or a list of what each child received.",
    ),
    fr: projectStory(
      "Deux jours avant Noël, notre équipe a apporté des denrées à l’orphelinat House of Peace, à Buea.",
      "Nous voulions partager la joie de Noël de façon concrète et soutenir les adultes qui prennent soin des enfants tout au long de l’année.",
      "Le 23 décembre, nous avons apporté à l’orphelinat des denrées pour ses besoins quotidiens, dont des sacs de riz et de l’huile de cuisson.",
      "Notre équipe estime que la visite a permis d’aider environ 21 enfants. Nous ne disposons pas d’un décompte distinct des adultes ni d’une liste de ce que chaque enfant a reçu.",
      "fr",
    ),
  },
  // 2022: released project reports and the confirmed details they document.
  "school-supply-distribution-feb-2022": {
    en: projectStory(
      "Our team visited students at Lycée de Buea to encourage them and bring practical supplies.",
      "We had heard that the school’s prayer or Bible club needed encouragement. We wanted to respond with our presence and with useful materials for the students.",
      "We arranged permission in advance and met the students in a classroom on 16 February. We read the Bible, prayed and encouraged them, then shared the supplies. Students did not have to join in prayer to receive help.",
      "We gave students school bags, exercise books, pens, math sets, buckets and utensils. We do not have a verified student count or a record of what each student received. The planned February cleanup did not take place and was separate from this visit.",
    ),
    fr: projectStory(
      "Notre équipe a rencontré des élèves du Lycée de Buea pour les encourager et leur apporter des fournitures utiles.",
      "On nous avait dit que le groupe de prière ou d’étude biblique du lycée avait besoin d’encouragement. Nous voulions répondre en allant à la rencontre des élèves et en leur apportant du matériel utile.",
      "Nous avons obtenu l’autorisation de l’établissement à l’avance et retrouvé les élèves dans une salle de classe le 16 février. Nous avons lu la Bible, prié et encouragé les élèves, puis distribué les fournitures. La participation à la prière n’était pas une condition pour recevoir de l’aide.",
      "Nous avons remis des cartables, des cahiers, des stylos, des ensembles de géométrie, des seaux et des ustensiles. Nous n’avons ni décompte vérifié des élèves ni relevé de ce que chacun a reçu. Le nettoyage prévu en février n’a pas eu lieu et était distinct de cette visite.",
      "fr",
    ),
  },
  "widow-support-food-cash-mar-2022": {
    en: projectStory(
      "After International Women’s Day, our team visited widows at home in Muea, Buea, with goods chosen after listening to their needs.",
      "We wanted to offer practical help that reflected what women told us would make a difference in daily life, rather than assume every household needed the same things.",
      "We asked in the community and through churches, spoke with the women and arranged the visits with their permission. We put together a shopping list before buying supplies, then took the goods from home to home. We offered Christian encouragement, but joining prayer or worship was not a condition of receiving help.",
      "Our team recalls visiting about 20 widows. The help was in goods, not cash, and included rice and other foodstuffs, oil, soap, buckets, bags and cloth for sewing clothes. We do not have a verified register or a list of what each household received.",
    ),
    fr: projectStory(
      "Après la Journée internationale des femmes, notre équipe a rendu visite à des veuves à leur domicile à Muea, à Buea, pour leur remettre des biens choisis après avoir écouté leurs besoins.",
      "Nous voulions apporter une aide concrète, adaptée à ce que les femmes nous disaient de leur quotidien, sans supposer que tous les foyers avaient les mêmes besoins.",
      "Nous avons pris des renseignements dans la communauté et auprès d’églises, échangé avec les femmes et organisé les visites avec leur accord. Nous avons établi une liste avant de faire les achats, puis apporté les biens de maison en maison. Nous leur avons offert des encouragements inspirés de notre foi, sans exiger qu’elles participent à la prière ou à la louange pour recevoir l’aide.",
      "Notre équipe se souvient avoir rendu visite à environ 20 veuves. L’aide était en nature, et non en espèces : riz et autres denrées, huile, savon, seaux, sacs et tissu pour la confection de vêtements. Nous ne disposons ni d’un registre vérifié ni d’une liste des biens remis à chaque foyer.",
      "fr",
    ),
  },
  "school-visit-may-2022": {
    en: projectStory(
      "In May, we visited students in Buea to offer encouragement and practical support.",
      "We wanted to give students more than a brief delivery of materials. Spending time with them gave us a way to encourage them alongside meeting practical needs.",
      "The project account describes a visit focused on encouragement, with food and refreshments as well as educational materials. This was a school visit, not a cleanup.",
      "We can report the visit and the kinds of support provided. Our records do not establish the number of students who attended or changes in their school performance.",
    ),
    fr: projectStory(
      "En mai, nous avons rendu visite à des élèves de Buea pour les encourager et leur apporter une aide concrète.",
      "Nous voulions faire plus que déposer des fournitures. Passer du temps avec les élèves nous permettait de les encourager tout en répondant à des besoins pratiques.",
      "Le compte rendu décrit une visite axée sur l’encouragement, avec des collations et des rafraîchissements ainsi que du matériel pédagogique. Il s’agissait d’une visite scolaire, pas d’une opération de nettoyage.",
      "Nous pouvons rendre compte de la visite et des formes de soutien apportées. Nos documents ne permettent pas d’établir le nombre d’élèves présents ni une évolution de leurs résultats scolaires.",
      "fr",
    ),
  },
  "idp-girls-baking-training-jul-2022": {
    en: projectStory(
      "In Molyko, Buea, we brought together teenage girls who had been displaced for a practical introduction to baking.",
      "We wanted girls whose lives had been disrupted by displacement to leave with a skill they could keep practicing and a possible way to earn income.",
      "Our team used local referrals to find participants and arranged to use the Sunday school hall at Full Gospel Mission. The instructor demonstrated cakes, fish pie, meat pie and puff-puff, and some girls practiced with her guidance. We shared buckets and remaining flour and oil so participants could practice afterward.",
      "Fifteen girls took part in the roughly four-hour workshop. Our team recalls hearing from some afterward that they had made and sold products. That was reported follow-up, not verified income or a measured business outcome.",
    ),
    fr: projectStory(
      "À Molyko, à Buea, nous avons réuni des adolescentes déplacées pour une initiation pratique à la pâtisserie.",
      "Nous voulions que ces adolescentes, dont le déplacement avait bouleversé le quotidien, repartent avec un savoir-faire à pratiquer et une piste pour gagner un revenu.",
      "Notre équipe s’est appuyée sur des recommandations locales pour trouver les participantes et a obtenu l’autorisation d’utiliser la salle de l’école du dimanche de Full Gospel Mission. La formatrice a préparé devant elles des gâteaux, des chaussons au poisson et à la viande ainsi que des beignets. Certaines participantes se sont exercées avec elle. Nous avons distribué des seaux et partagé le reste de la farine et de l’huile pour leur permettre de continuer à s’exercer.",
      "Quinze adolescentes ont participé à cet atelier d’environ quatre heures. Notre équipe se souvient que certaines nous ont dit par la suite avoir préparé et vendu leurs produits. Il s’agit de témoignages, pas de revenus vérifiés ni de résultats commerciaux mesurés.",
      "fr",
    ),
  },
  "back-to-school-sep-2022": {
    en: projectStory(
      "Our team worked with a school in Buea to get learning materials to students before the new school year.",
      "After asking around in the community, our team chose a school where we had noticed a need for basics such as school bags and books. We wanted to help students start the school year with useful materials.",
      "We got permission before the visit. Teachers who knew the students’ needs brought them together in a classroom and helped distribute books, exercise books, bags, pens and other supplies. We offered encouragement and prayer, but help was not conditional on joining worship.",
      "Our account records 40 students reached. They did not all receive the same brands or identical sets of supplies. Families later contacted the team to thank us. We did not measure changes in grades or attendance.",
    ),
    fr: projectStory(
      "Notre équipe a travaillé avec un établissement de Buea pour remettre du matériel aux élèves avant la rentrée.",
      "Après avoir pris des renseignements dans la communauté, nous avons choisi un établissement où nous avions constaté des besoins en matériel de base, notamment en cartables et en livres. Nous voulions aider les élèves à commencer l’année avec des fournitures utiles.",
      "Nous avons obtenu l’autorisation avant la visite. Des enseignants qui connaissaient les besoins des élèves les ont réunis dans une salle et nous ont aidés à distribuer des livres, des cahiers, des cartables, des stylos et d’autres fournitures. Nous avons encouragé les élèves et prié avec eux, sans rendre l’aide conditionnelle à la participation à la louange.",
      "Notre compte rendu indique que 40 élèves ont reçu de l’aide. Ils n’ont pas tous reçu les mêmes marques ni des lots identiques. Des familles nous ont ensuite contactés pour nous remercier. Nous n’avons pas mesuré l’évolution des notes ni de l’assiduité.",
      "fr",
    ),
  },
  "christmas-giving-dec-2022": {
    en: projectStory(
      "In December, our team visited an orphanage in Buea with food and Christmas gifts for the children and those caring for them.",
      "For our first Christmas program for children in orphanage care, we wanted to share the joy of the season while helping with everyday needs.",
      "Our team went to the market for provisions and gifts, then took them to the orphanage. We brought rice, cooking oil and other foodstuffs alongside clothes, shoes, slippers and toys.",
      "We shared supplies with children and their caregivers. Our records do not establish a verified headcount, what each person received, or any longer-term outcome.",
    ),
    fr: projectStory(
      "En décembre, notre équipe a rendu visite à un orphelinat de Buea avec des denrées et des cadeaux de Noël pour les enfants et les adultes qui s’occupent d’eux.",
      "Pour notre premier programme de Noël destiné aux enfants accueillis en orphelinat, nous voulions partager la joie des fêtes tout en aidant à répondre aux besoins du quotidien.",
      "Notre équipe a acheté des provisions et des cadeaux au marché, puis les a apportés à l’orphelinat. Nous avons apporté du riz, de l’huile de cuisson et d’autres denrées, ainsi que des vêtements, des chaussures, des sandales et des jouets.",
      "Nous avons remis des biens aux enfants et aux adultes qui s’occupent d’eux. Nos documents ne permettent de vérifier ni le nombre de personnes aidées, ni ce que chacune a reçu, ni les effets à plus long terme.",
      "fr",
    ),
  },
};
