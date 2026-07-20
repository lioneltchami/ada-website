import type { Locale } from "../i18n";

export type TransparencyCopy = {
  meta: { title: string; description: string };
  hero: { title: string; subtitle: string; badge: string };
  registration: {
    orgNameLabel: string;
    orgName: string;
    countryLabel: string;
    country: string;
    legalStatusLabel: string;
    legalStatus: string;
    yearLabel: string;
    year: string;
    regNumberLabel: string;
    governingLawLabel: string;
    governingLaw: string;
    downloadCertificate: string;
  };
  governance: {
    intro: string;
    roles: Array<{ role: string; name: string; note?: string }>;
    principlesLabel: string;
    principles: string;
  };
  fundFlow: {
    badge: string;
    title: string;
    intro: string;
    steps: Array<{ step: string; title: string; desc: string }>;
    internationalNoteLabel: string;
    internationalNote: string;
    askDocuments: string;
  };
  internationalSupport: {
    badge: string;
    title: string;
    intro: string;
    notes: Array<{ region: string; status: string; detail: string }>;
    fiscalTitle: string;
    fiscalBody: string;
  };
  partnerDueDiligence: {
    badge: string;
    title: string;
    intro: string;
    requestPacket: string;
    documents: string[];
    thirdPartyProof: Array<{ label: string; note: string }>;
  };
  financial: {
    intro: string;
    moneyGoesAria: string;
    moneyGoes: Array<{
      label: string;
      value: string;
      width: string;
      detail: string;
    }>;
    allocationNote: string;
    annualSummary: string;
    tableHeaders: {
      year: string;
      totalReceived: string;
      programs: string;
      operations: string;
      admin: string;
    };
    rows: Array<{
      year: string;
      total: string;
      programs: string;
      operations: string;
      admin: string;
    }>;
    totalLabel: string;
    totals: {
      total: string;
      programs: string;
      operations: string;
      admin: string;
    };
    footnote: string;
    annualReports: string;
    annualReportLink: (year: string) => string;
  };
  measurable: { intro: string };
  theoryOfChange: {
    intro: string;
    steps: Array<{ step: string; title: string; desc: string }>;
    sustainabilityLabel: string;
    sustainability: string;
  };
  sdg: {
    intro: string;
    goals: Array<{
      number: string;
      color: string;
      title: string;
      detail: string;
    }>;
    feministLabel: string;
    feminist: string;
  };
  environment: {
    intro: string;
    items: Array<{ icon: string; title: string; desc: string }>;
    commitmentLabel: string;
    commitment: string;
  };
  accountability: {
    title: string;
    practices: Array<{ title: string; desc: string }>;
  };
  cta: { title: string; body: string; button: string };
};

const en: TransparencyCopy = {
  meta: {
    title: "Transparency & Accountability",
    description:
      "ADA's financial reports, registration details, and accountability measures. ADA's public allocation model targets 80% program delivery.",
  },
  hero: {
    title: "Transparency & Accountability",
    subtitle:
      "We believe donors deserve complete visibility into how their money is used.",
    badge: "Our Commitment",
  },
  registration: {
    orgNameLabel: "Organization Name",
    orgName: "Apoti Development Association (ADA)",
    countryLabel: "Country of Registration",
    country: "Republic of Cameroon",
    legalStatusLabel: "Legal Status",
    legalStatus: "Registered Non-Profit Association",
    yearLabel: "Year Established",
    year: "2021",
    regNumberLabel: "Registration Number",
    governingLawLabel: "Governing Law",
    governingLaw:
      "Law No. 90/053 of 19 December 1990 on Freedom of Association",
    downloadCertificate: "Download Registration Certificate (PDF)",
  },
  governance: {
    intro:
      "ADA is governed by a 12-member board with clear separation of powers, financial oversight, and local leadership in Cameroon.",
    roles: [
      {
        role: "Founder & President",
        name: "Lionel Tchami Nfada, MSc",
        note: "International (Diaspora Leadership)",
      },
      { role: "Vice President", name: "Yasmiratu Ba'am" },
      {
        role: "Country Director",
        name: "Naomi Ndababonga",
        note: "Buea, SW Region (HQ)",
      },
      {
        role: "Regional Coordinator, NW",
        name: "Corrine Mbekenyui",
        note: "Bamenda, NW Region",
      },
      { role: "Secretary General", name: "Vera Mbuh" },
      { role: "Treasurer", name: "Christy Nkongho" },
      { role: "Financial Secretary", name: "Melanie Timbu" },
      { role: "Communications Officer", name: "Brenda Itoe" },
      {
        role: "M&E Officer",
        name: "Nicole Faith",
        note: "Philippines (Remote)",
      },
      {
        role: "Spiritual Advisors",
        name: "Boris Beye, Florence Ngassam, Lucy Hastings",
      },
    ],
    principlesLabel: "Governance Principles:",
    principles:
      "Clear separation of powers (President ≠ Treasurer ≠ Secretary). Dual financial oversight (Treasurer + Financial Secretary). Local decision-making through Country Director. All executive roles are volunteer — zero paid leadership.",
  },
  fundFlow: {
    badge: "Donor Assurance",
    title: "How funds move from donor to program",
    intro:
      "Our accountability system is designed for supporters who are giving from outside Cameroon and need to understand what happens after they donate.",
    steps: [
      {
        step: "1",
        title: "Gift received",
        desc: "Online donations are processed through Stripe and recorded with donor, amount, frequency, and project designation when provided.",
      },
      {
        step: "2",
        title: "Receipt issued",
        desc: "A receipt is emailed for personal records. ADA does not currently issue tax-deductible receipts outside Cameroon.",
      },
      {
        step: "3",
        title: "Funds reconciled",
        desc: "The Treasurer and Financial Secretary compare donation records, payment processor records, and program allocations.",
      },
      {
        step: "4",
        title: "Program delivery",
        desc: "Funds are released for approved activities in Cameroon and supported by receipts, attendance lists, photos, or field notes where appropriate.",
      },
      {
        step: "5",
        title: "Impact reported",
        desc: "Completed activities are documented through project updates, annual reports, archive entries, and direct partner reporting when requested.",
      },
    ],
    internationalNoteLabel: "For international supporters:",
    internationalNote:
      "ADA is a registered non-profit association in Cameroon. Until ADA obtains registered charity status or a qualified fiscal sponsorship arrangement in your country, donations should be treated as non-tax-deductible gifts for personal records.",
    askDocuments: "Ask for documents",
  },
  internationalSupport: {
    badge: "International Support",
    title: "Support from Canada, the US, and Europe",
    intro:
      "ADA welcomes international support while being careful about tax language. The current public position is simple: ADA is registered in Cameroon, and international gifts should be treated as non-tax-deductible unless a qualified local arrangement is confirmed.",
    notes: [
      {
        region: "Canada",
        status: "Supported today as a non-tax-deductible gift",
        detail:
          "Canadian supporters can give to ADA as international supporters. ADA is not currently presented as a Canadian registered charity, so gifts should not be treated as Canadian charitable donations unless a qualified Canadian fiscal sponsorship or charity partnership is confirmed.",
      },
      {
        region: "United States",
        status: "Supported today as a non-tax-deductible gift",
        detail:
          "US supporters can give for personal or institutional support records. ADA is not currently presented as a US 501(c)(3), so donors should not claim a US charitable deduction unless an eligible fiscal sponsor or US charity partner is formally in place.",
      },
      {
        region: "Europe",
        status: "Supported today as a non-tax-deductible gift",
        detail:
          "European supporters can give directly and request documentation for their records. Tax treatment varies by country, and ADA does not currently advertise country-specific charitable tax status in Europe.",
      },
    ],
    fiscalTitle: "Fiscal sponsorship: future path, not an active claim",
    fiscalBody:
      "ADA may pursue fiscal sponsorship or registered charity partnerships in Canada, the United States, or Europe to make giving easier for donors and institutions. This page does not claim that any fiscal sponsorship is active today. If one is confirmed, ADA should publish the sponsor name, country, donation instructions, eligible tax treatment, and agreement status before promoting tax-deductible giving.",
  },
  partnerDueDiligence: {
    badge: "Partner Readiness",
    title: "Documents for partner due diligence",
    intro:
      "Foundations, churches, CSR teams, schools, and local partners can request a due diligence packet before funding, referring beneficiaries, or collaborating on a project.",
    requestPacket: "Request due diligence packet",
    documents: [
      "Cameroon registration certificate",
      "Current board and officer list",
      "Annual reports and program summaries",
      "Financial summaries and allocation model",
      "Project photos, field notes, attendance lists, or receipts where available",
      "Partner-specific reporting package on request",
    ],
    thirdPartyProof: [
      {
        label: "Government registration",
        note: "Registration certificate is linked above as the primary legal proof currently published.",
      },
      {
        label: "Partner references",
        note: "References from local leaders, schools, churches, or delivery partners can be assembled for serious due diligence requests.",
      },
      {
        label: "Independent verification",
        note: "ADA is open to partner-led site visits, reference checks, and document review. Public third-party ratings should only be added after they are confirmed.",
      },
    ],
  },
  financial: {
    intro:
      "Our commitment: overhead under 5%, with 80% of funds going directly to program delivery.",
    moneyGoesAria:
      "Where your money goes: 80% direct program aid, 15% program operations, 5% administration",
    moneyGoes: [
      {
        label: "Direct Program Aid",
        value: "80%",
        width: "80%",
        detail:
          "Food aid, school support, emergency relief, clean water, skills training, and beneficiary support delivered in Cameroon.",
      },
      {
        label: "Program Operations",
        value: "15%",
        width: "15%",
        detail:
          "Transport, local coordination, monitoring, documentation, reporting, and supplies needed to deliver programs responsibly.",
      },
      {
        label: "Administration",
        value: "5%",
        width: "5%",
        detail:
          "Basic operating costs such as communications, records, payment processing, and compliance administration.",
      },
    ],
    allocationNote:
      "Allocation percentages are ADA's operating commitment and should be read with the annual summaries below. Project-restricted gifts are tracked against donor designations when provided.",
    annualSummary: "Annual Financial Summary",
    tableHeaders: {
      year: "Year",
      totalReceived: "Total Received",
      programs: "Programs (80%)",
      operations: "Operations (15%)",
      admin: "Admin (5%)",
    },
    rows: [
      {
        year: "2022",
        total: "$1,200",
        programs: "$960",
        operations: "$180",
        admin: "$60",
      },
      {
        year: "2023",
        total: "$3,400",
        programs: "$2,720",
        operations: "$510",
        admin: "$170",
      },
      {
        year: "2024",
        total: "$6,800",
        programs: "$5,440",
        operations: "$1,020",
        admin: "$340",
      },
      {
        year: "2025 (YTD)",
        total: "$4,500",
        programs: "$3,600",
        operations: "$675",
        admin: "$225",
      },
    ],
    totalLabel: "Total",
    totals: {
      total: "$15,900",
      programs: "$12,720",
      operations: "$2,385",
      admin: "$795",
    },
    footnote:
      "* All figures in USD. Financial records available upon request. Contact info@apotidev.org for detailed statements.",
    annualReports: "Annual Reports",
    annualReportLink: (year) => `${year} Annual Report (PDF)`,
  },
  measurable: {
    intro:
      "We track outcomes, not just outputs. Here are our key indicators with baselines and actuals.",
  },
  theoryOfChange: {
    intro: "How we create lasting impact — from crisis to self-sufficiency.",
    steps: [
      {
        step: "1",
        title: "Identify",
        desc: "Community leaders refer widows, orphans, and young women in crisis to ADA.",
      },
      {
        step: "2",
        title: "Stabilize",
        desc: "Immediate relief: food packages, school fees, emergency medical support.",
      },
      {
        step: "3",
        title: "Empower",
        desc: "Skills training, mentorship, microfinance — building capacity for independence.",
      },
      {
        step: "4",
        title: "Sustain",
        desc: "Graduates become mentors. Community ownership ensures programs outlive funding.",
      },
    ],
    sustainabilityLabel: "Sustainability:",
    sustainability:
      "Our model is designed so that each cohort of beneficiaries becomes the next generation of trainers and mentors. When external funding ends, the skills, networks, and community structures remain.",
  },
  sdg: {
    intro:
      "ADA's programs directly contribute to 7 of the 17 UN Sustainable Development Goals.",
    goals: [
      {
        number: "1",
        color: "#E5243B",
        title: "No Poverty",
        detail: "Widow support, food aid, startup kits",
      },
      {
        number: "2",
        color: "#DDA63A",
        title: "Zero Hunger",
        detail: "Food distribution, emergency relief",
      },
      {
        number: "4",
        color: "#C5192D",
        title: "Quality Education",
        detail: "Back-to-school, mentorship, skills training",
      },
      {
        number: "5",
        color: "#FF3A21",
        title: "Gender Equality",
        detail: "85% women/girls beneficiaries, empowerment programs",
      },
      {
        number: "6",
        color: "#26BDE2",
        title: "Clean Water",
        detail: "Borehole drilling, solar pump, 300+ served",
      },
      {
        number: "10",
        color: "#DD1367",
        title: "Reduced Inequalities",
        detail: "IDP support, crisis-affected communities",
      },
      {
        number: "13",
        color: "#3F7E44",
        title: "Climate Action",
        detail: "Community cleanups, tree planting, waste management",
      },
    ],
    feministLabel:
      "Alignment with Canada's Feminist International Assistance Policy:",
    feminist:
      "ADA's programming prioritizes gender equality (SDG 5) as a cross-cutting theme. 85% of our direct beneficiaries are women and girls.",
  },
  environment: {
    intro:
      "Every ADA program integrates environmental awareness — because healthy communities need a healthy planet.",
    items: [
      {
        icon: "💧",
        title: "Clean Water Infrastructure",
        desc: "Our boreholes eliminate reliance on polluted streams, reducing waterborne disease and protecting local water ecosystems from over-extraction.",
      },
      {
        icon: "🌳",
        title: "Tree Planting & Reforestation",
        desc: "Every community clean-up includes tree planting. In 2024, we planted 50 trees across Bamenda — combating deforestation and providing future shade and fruit.",
      },
      {
        icon: "♻️",
        title: "Waste Management Education",
        desc: "Our clean-up campaigns teach waste sorting, composting, and plastic reduction. We partner with local recyclers to create income from collected materials.",
      },
      {
        icon: "🔥",
        title: "Clean Cooking Solutions",
        desc: "We help widows transition from charcoal to gas cooking — reducing indoor air pollution and decreasing demand for charcoal-driven deforestation.",
      },
    ],
    commitmentLabel: "Our commitment:",
    commitment:
      "By 2027, every ADA program will include a measurable environmental component. We track trees planted, waste collected, and households transitioned to clean cooking.",
  },
  accountability: {
    title: "Accountability Practices",
    practices: [
      {
        title: "Volunteer executive leadership",
        desc: "Executive roles are volunteer-led, and paid roles are tied to program delivery needs.",
      },
      {
        title: "Practical reporting",
        desc: "Donors and partners receive useful impact updates with records, photos, or data when appropriate.",
      },
      {
        title: "Community oversight",
        desc: "Local committees verify beneficiary selection and program delivery.",
      },
      {
        title: "Open books policy",
        desc: "Financial records available upon request. Annual summaries published publicly.",
      },
      {
        title: "Beneficiary feedback",
        desc: "Regular surveys ensure programs meet actual community needs.",
      },
      {
        title: "Bilingual reporting",
        desc: "All reports available in English and French for international partners.",
      },
    ],
  },
  cta: {
    title: "Request Detailed Reports",
    body: "For institutional partners, we provide: financial summaries, supporting records, logical frameworks, M&E reports, and project proposals.",
    button: "Contact Us for Reports",
  },
};

const fr: TransparencyCopy = {
  meta: {
    title: "Transparence et Responsabilité",
    description:
      "Rapports financiers, détails d'enregistrement et mesures de responsabilité d'ADA. 80% de chaque dollar va directement aux programmes.",
  },
  hero: {
    title: "Transparence et Responsabilité",
    subtitle:
      "Nous croyons que les donateurs méritent une visibilité complète sur l'utilisation de leur argent.",
    badge: "Notre Engagement",
  },
  registration: {
    orgNameLabel: "Nom de l'Organisation",
    orgName: "Apoti Development Association (ADA)",
    countryLabel: "Pays d'Enregistrement",
    country: "République du Cameroun",
    legalStatusLabel: "Statut Juridique",
    legalStatus: "Association à But Non Lucratif Enregistrée",
    yearLabel: "Année de Création",
    year: "2021",
    regNumberLabel: "Numéro d'Enregistrement",
    governingLawLabel: "Loi Applicable",
    governingLaw:
      "Loi N° 90/053 du 19 décembre 1990 sur la Liberté d'Association",
    downloadCertificate: "Télécharger le Certificat d'Enregistrement (PDF)",
  },
  governance: {
    intro:
      "ADA est dirigée par un conseil de 12 membres avec une séparation claire des pouvoirs, une supervision financière et un leadership local au Cameroun.",
    roles: [
      {
        role: "Fondateur et Président",
        name: "Lionel Tchami Nfada, MSc",
        note: "International (Leadership Diaspora)",
      },
      { role: "Vice-Présidente", name: "Yasmiratu Ba'am" },
      {
        role: "Directrice Pays",
        name: "Naomi Ndababonga",
        note: "Buea, Région du Sud-Ouest (Siège)",
      },
      {
        role: "Coordinatrice Régionale, NO",
        name: "Corrine Mbekenyui",
        note: "Bamenda, Région du Nord-Ouest",
      },
      { role: "Secrétaire Générale", name: "Vera Mbuh" },
      { role: "Trésorière", name: "Christy Nkongho" },
      { role: "Secrétaire Financière", name: "Melanie Timbu" },
      { role: "Chargée de Communication", name: "Brenda Itoe" },
      {
        role: "Chargée du Suivi-Évaluation",
        name: "Nicole Faith",
        note: "Philippines (À distance)",
      },
      {
        role: "Conseillers Spirituels",
        name: "Boris Beye, Florence Ngassam, Lucy Hastings",
      },
    ],
    principlesLabel: "Principes de Gouvernance :",
    principles:
      "Séparation claire des pouvoirs (Président ≠ Trésorier ≠ Secrétaire). Double supervision financière (Trésorière + Secrétaire Financière). Prise de décision locale par la Directrice Pays. Tous les postes de direction sont bénévoles — zéro leadership rémunéré.",
  },
  fundFlow: {
    badge: "Assurance aux Donateurs",
    title: "Comment les fonds passent du donateur au programme",
    intro:
      "Notre système de responsabilisation est conçu pour les supporters qui donnent depuis l'extérieur du Cameroun et ont besoin de comprendre ce qui se passe après leur don.",
    steps: [
      {
        step: "1",
        title: "Don reçu",
        desc: "Les dons en ligne sont traités via Stripe et enregistrés avec le donateur, le montant, la fréquence et la désignation du projet le cas échéant.",
      },
      {
        step: "2",
        title: "Reçu émis",
        desc: "Un reçu est envoyé par e-mail pour les dossiers personnels. ADA n'émet actuellement pas de reçus fiscaux déductibles hors du Cameroun.",
      },
      {
        step: "3",
        title: "Fonds rapprochés",
        desc: "La Trésorière et la Secrétaire Financière comparent les registres de dons, les relevés du processeur de paiement et les allocations de programme.",
      },
      {
        step: "4",
        title: "Exécution du programme",
        desc: "Les fonds sont débloqués pour des activités approuvées au Cameroun, étayées par des reçus, listes de présence, photos ou notes de terrain le cas échéant.",
      },
      {
        step: "5",
        title: "Impact rapporté",
        desc: "Les activités réalisées sont documentées via des mises à jour de projet, rapports annuels, archives et rapports partenaires sur demande.",
      },
    ],
    internationalNoteLabel: "Pour les supporters internationaux :",
    internationalNote:
      "ADA est une association à but non lucratif enregistrée au Cameroun. Tant qu'ADA n'a pas obtenu le statut d'organisme de bienfaisance enregistré ou un arrangement de parrainage fiscal qualifié dans votre pays, les dons doivent être traités comme des cadeaux non déductibles fiscalement pour vos dossiers personnels.",
    askDocuments: "Demander des documents",
  },
  internationalSupport: {
    badge: "Soutien International",
    title: "Soutien depuis le Canada, les États-Unis et l'Europe",
    intro:
      "ADA accueille le soutien international tout en restant prudent sur le langage fiscal. La position publique actuelle est simple : ADA est enregistrée au Cameroun, et les dons internationaux doivent être traités comme non déductibles fiscalement sauf arrangement local qualifié confirmé.",
    notes: [
      {
        region: "Canada",
        status: "Soutenu aujourd'hui comme don non déductible fiscalement",
        detail:
          "Les supporters canadiens peuvent donner à ADA en tant que supporters internationaux. ADA n'est pas actuellement présentée comme un organisme de bienfaisance enregistré au Canada ; les dons ne doivent pas être traités comme des dons de charité canadiens sauf parrainage fiscal ou partenariat caritatif canadien qualifié confirmé.",
      },
      {
        region: "États-Unis",
        status: "Soutenu aujourd'hui comme don non déductible fiscalement",
        detail:
          "Les supporters américains peuvent donner pour leurs dossiers personnels ou institutionnels. ADA n'est pas actuellement présentée comme un 501(c)(3) américain ; les donateurs ne doivent pas réclamer une déduction caritative américaine sauf sponsor fiscal ou partenaire caritatif américain éligible en place.",
      },
      {
        region: "Europe",
        status: "Soutenu aujourd'hui comme don non déductible fiscalement",
        detail:
          "Les supporters européens peuvent donner directement et demander une documentation pour leurs dossiers. Le traitement fiscal varie selon le pays, et ADA n'annonce actuellement pas de statut fiscal caritatif propre à chaque pays européen.",
      },
    ],
    fiscalTitle:
      "Parrainage fiscal : voie future, pas une revendication active",
    fiscalBody:
      "ADA peut poursuivre un parrainage fiscal ou des partenariats d'organismes de bienfaisance enregistrés au Canada, aux États-Unis ou en Europe pour faciliter le don. Cette page ne prétend pas qu'un parrainage fiscal est actif aujourd'hui. S'il est confirmé, ADA publiera le nom du sponsor, le pays, les instructions de don, le traitement fiscal éligible et le statut de l'accord avant de promouvoir le don déductible.",
  },
  partnerDueDiligence: {
    badge: "Préparation Partenaires",
    title: "Documents pour la diligence raisonnable des partenaires",
    intro:
      "Fondations, églises, équipes RSE, écoles et partenaires locaux peuvent demander un dossier de diligence avant de financer, d'orienter des bénéficiaires ou de collaborer sur un projet.",
    requestPacket: "Demander le dossier de diligence",
    documents: [
      "Certificat d'enregistrement camerounais",
      "Liste actuelle du conseil et des dirigeants",
      "Rapports annuels et résumés de programmes",
      "Résumés financiers et modèle d'allocation",
      "Photos de projet, notes de terrain, listes de présence ou reçus le cas échéant",
      "Dossier de reporting spécifique au partenaire sur demande",
    ],
    thirdPartyProof: [
      {
        label: "Enregistrement gouvernemental",
        note: "Le certificat d'enregistrement est lié ci-dessus comme principale preuve légale actuellement publiée.",
      },
      {
        label: "Références partenaires",
        note: "Des références de leaders locaux, écoles, églises ou partenaires de mise en œuvre peuvent être assemblées pour les demandes de diligence sérieuses.",
      },
      {
        label: "Vérification indépendante",
        note: "ADA est ouverte aux visites de site menées par des partenaires, aux vérifications de références et à l'examen de documents. Les notations tierces publiques ne devraient être ajoutées qu'après confirmation.",
      },
    ],
  },
  financial: {
    intro:
      "Notre engagement : frais généraux inférieurs à 5%, avec 80% des fonds allant directement à l'exécution des programmes.",
    moneyGoesAria:
      "Où va votre argent : 80% aide directe aux programmes, 15% opérations de programme, 5% administration",
    moneyGoes: [
      {
        label: "Aide Directe aux Programmes",
        value: "80%",
        width: "80%",
        detail:
          "Aide alimentaire, soutien scolaire, secours d'urgence, eau potable, formation professionnelle et soutien aux bénéficiaires au Cameroun.",
      },
      {
        label: "Opérations de Programme",
        value: "15%",
        width: "15%",
        detail:
          "Transport, coordination locale, suivi, documentation, reporting et fournitures nécessaires à une exécution responsable.",
      },
      {
        label: "Administration",
        value: "5%",
        width: "5%",
        detail:
          "Coûts de fonctionnement de base : communications, registres, traitement des paiements et administration de conformité.",
      },
    ],
    allocationNote:
      "Les pourcentages d'allocation sont l'engagement opérationnel d'ADA et doivent être lus avec les résumés annuels ci-dessous. Les dons affectés à un projet sont suivis selon les désignations des donateurs lorsqu'elles sont fournies.",
    annualSummary: "Résumé Financier Annuel",
    tableHeaders: {
      year: "Année",
      totalReceived: "Total Reçu",
      programs: "Programmes (80%)",
      operations: "Opérations (15%)",
      admin: "Admin (5%)",
    },
    rows: [
      {
        year: "2022",
        total: "$1 200",
        programs: "$960",
        operations: "$180",
        admin: "$60",
      },
      {
        year: "2023",
        total: "$3 400",
        programs: "$2 720",
        operations: "$510",
        admin: "$170",
      },
      {
        year: "2024",
        total: "$6 800",
        programs: "$5 440",
        operations: "$1 020",
        admin: "$340",
      },
      {
        year: "2025 (cumul)",
        total: "$4 500",
        programs: "$3 600",
        operations: "$675",
        admin: "$225",
      },
    ],
    totalLabel: "Total",
    totals: {
      total: "$15 900",
      programs: "$12 720",
      operations: "$2 385",
      admin: "$795",
    },
    footnote:
      "* Tous les montants sont en USD. Les registres financiers sont disponibles sur demande. Contactez info@apotidev.org pour des relevés détaillés.",
    annualReports: "Rapports Annuels",
    annualReportLink: (year) => `Rapport Annuel ${year} (PDF)`,
  },
  measurable: {
    intro:
      "Nous suivons les résultats, pas seulement les activités. Voici nos indicateurs clés avec les bases de référence et les réalisations.",
  },
  theoryOfChange: {
    intro: "Comment nous créons un impact durable — de la crise à l'autonomie.",
    steps: [
      {
        step: "1",
        title: "Identifier",
        desc: "Les leaders communautaires orientent les veuves, orphelins et jeunes femmes en crise vers ADA.",
      },
      {
        step: "2",
        title: "Stabiliser",
        desc: "Aide immédiate : colis alimentaires, frais de scolarité, soutien médical d'urgence.",
      },
      {
        step: "3",
        title: "Autonomiser",
        desc: "Formation professionnelle, mentorat, microfinance — renforcer les capacités pour l'indépendance.",
      },
      {
        step: "4",
        title: "Pérenniser",
        desc: "Les diplômées deviennent mentors. L'appropriation communautaire assure la pérennité des programmes.",
      },
    ],
    sustainabilityLabel: "Durabilité :",
    sustainability:
      "Notre modèle est conçu pour que chaque cohorte de bénéficiaires devienne la prochaine génération de formateurs et de mentors. Lorsque le financement externe prend fin, les compétences, les réseaux et les structures communautaires demeurent.",
  },
  sdg: {
    intro:
      "Les programmes d'ADA contribuent directement à 7 des 17 Objectifs de Développement Durable des Nations Unies.",
    goals: [
      {
        number: "1",
        color: "#E5243B",
        title: "Pas de Pauvreté",
        detail: "Soutien aux veuves, aide alimentaire, kits de démarrage",
      },
      {
        number: "2",
        color: "#DDA63A",
        title: "Faim Zéro",
        detail: "Distribution alimentaire, aide d'urgence",
      },
      {
        number: "4",
        color: "#C5192D",
        title: "Éducation de Qualité",
        detail: "Rentrée scolaire, mentorat, formation professionnelle",
      },
      {
        number: "5",
        color: "#FF3A21",
        title: "Égalité des Sexes",
        detail: "85% femmes/filles bénéficiaires, programmes d'autonomisation",
      },
      {
        number: "6",
        color: "#26BDE2",
        title: "Eau Propre",
        detail: "Forage, pompe solaire, 300+ desservis",
      },
      {
        number: "10",
        color: "#DD1367",
        title: "Inégalités Réduites",
        detail: "Soutien aux PDI, communautés affectées par la crise",
      },
      {
        number: "13",
        color: "#3F7E44",
        title: "Action Climatique",
        detail:
          "Nettoyages communautaires, plantation d'arbres, gestion des déchets",
      },
    ],
    feministLabel:
      "Alignement avec la Politique d'aide internationale féministe du Canada :",
    feminist:
      "La programmation d'ADA priorise l'égalité des genres (ODD 5) comme thème transversal. 85% de nos bénéficiaires directs sont des femmes et des filles.",
  },
  environment: {
    intro:
      "Chaque programme ADA intègre la sensibilisation environnementale — car des communautés saines ont besoin d'une planète saine.",
    items: [
      {
        icon: "💧",
        title: "Infrastructure d'Eau Potable",
        desc: "Nos forages éliminent la dépendance aux cours d'eau pollués, réduisant les maladies hydriques et protégeant les écosystèmes aquatiques locaux.",
      },
      {
        icon: "🌳",
        title: "Plantation d'Arbres et Reboisement",
        desc: "Chaque nettoyage communautaire inclut la plantation d'arbres. En 2024, nous avons planté 50 arbres à Bamenda — luttant contre la déforestation.",
      },
      {
        icon: "♻️",
        title: "Éducation à la Gestion des Déchets",
        desc: "Nos campagnes enseignent le tri des déchets, le compostage et la réduction du plastique. Nous collaborons avec des recycleurs locaux.",
      },
      {
        icon: "🔥",
        title: "Solutions de Cuisson Propre",
        desc: "Nous aidons les veuves à passer du charbon au gaz — réduisant la pollution intérieure et la demande de déforestation liée au charbon.",
      },
    ],
    commitmentLabel: "Notre engagement :",
    commitment:
      "D'ici 2027, chaque programme ADA inclura une composante environnementale mesurable. Nous suivons les arbres plantés, les déchets collectés et les ménages convertis à la cuisson propre.",
  },
  accountability: {
    title: "Pratiques de Responsabilité",
    practices: [
      {
        title: "Direction exécutive bénévole",
        desc: "Les rôles exécutifs sont bénévoles, et les rôles rémunérés sont liés aux besoins d'exécution des programmes.",
      },
      {
        title: "Rapports pratiques",
        desc: "Les donateurs et partenaires reçoivent des mises à jour utiles avec dossiers, photos ou données lorsque cela est approprié.",
      },
      {
        title: "Supervision communautaire",
        desc: "Des comités locaux vérifient la sélection des bénéficiaires et l'exécution des programmes.",
      },
      {
        title: "Politique de livres ouverts",
        desc: "Les registres financiers sont disponibles sur demande. Les résumés annuels sont publiés publiquement.",
      },
      {
        title: "Retour des bénéficiaires",
        desc: "Des enquêtes régulières garantissent que les programmes répondent aux besoins réels de la communauté.",
      },
      {
        title: "Rapports bilingues",
        desc: "Tous les rapports sont disponibles en anglais et en français pour les partenaires internationaux.",
      },
    ],
  },
  cta: {
    title: "Demander des Rapports Détaillés",
    body: "Pour les partenaires institutionnels, nous fournissons : résumés financiers, dossiers à l'appui, cadres logiques, rapports de suivi-évaluation et propositions de projets.",
    button: "Contactez-nous pour les Rapports",
  },
};

const copyByLocale: Record<Locale, TransparencyCopy> = { en, fr };

export function transparencyCopyFor(locale: Locale): TransparencyCopy {
  return copyByLocale[locale];
}
