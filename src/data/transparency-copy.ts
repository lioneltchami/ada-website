import { getTeamRoster } from "./team-profiles";
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
    annualSummaryNote: string;
    outreachBudgetsLink: string;
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
    title: string;
    intro: string;
    steps: Array<{ step: string; title: string; desc: string }>;
  };
  sdg: {
    title: string;
    intro: string;
    goals: Array<{
      number: string;
      title: string;
      detail: string;
      href: string;
      linkLabel: string;
    }>;
  };
  environment: {
    title: string;
    intro: string;
    items: Array<{ title: string; desc: string; href: string; linkLabel: string }>;
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
      "Find ADA’s registration, annual publications, financial reporting status, and accountability practices.",
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
    intro: "ADA’s executive committee oversees the work. Our Cameroon operations team coordinates outreach and keeps records.",
    roles: getTeamRoster("en").groups.flatMap((group) =>
      group.profiles.map(({ name, role }) => ({ name, role }))),
    principlesLabel: "Governance principles:",
    principles: "The President, Secretary and Treasurer have distinct responsibilities. Financial oversight is separate from day-to-day bookkeeping, and the Country Director coordinates local delivery.",
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
        desc: "Financial reconciliation compares donation records, payment processor records, and program allocations.",
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
          "Food aid, school support, emergency relief, skills training, and beneficiary support delivered in Cameroon.",
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
      "Allocation percentages describe ADA's public operating model. Project-restricted gifts are tracked against donor designations when provided.",
    annualSummary: "Annual Financial Summary",
    annualSummaryNote: "We’re checking the reporting period, currency, and how the figures were calculated before publishing ADA’s organization-wide donations and financial totals for 2024. This review does not cover individual outreach budgets.",
    outreachBudgetsLink: "Find outreach budgets in the project archive",
    tableHeaders: {
      year: "Year",
      totalReceived: "Total Received",
      programs: "Programs (80%)",
      operations: "Operations (15%)",
      admin: "Admin (5%)",
    },
    rows: [],
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
    title: "How Our Outreach Works",
    intro: "Our focus is practical support for women and adolescent girls in Cameroon, including widows and mothers. Here is how we go from identifying a local need to sharing a record of the work.",
    steps: [
      { step: "1", title: "Listen", desc: "Identify a need with community members and local partners." },
      { step: "2", title: "Plan", desc: "Define what support is practical and what the outreach will cover." },
      { step: "3", title: "Deliver", desc: "Work with local teams to carry out the outreach." },
      { step: "4", title: "Review", desc: "Record what was done, what it cost when known, and what is still unconfirmed." },
    ],
  },
  sdg: {
    title: "Sustainable Development Goals Alignment",
    intro: "These examples show where ADA’s work relates to selected United Nations goals. They do not imply UN endorsement or show that a goal has been achieved.",
    goals: [
      {
        number: "1",
        title: "No Poverty",
        detail: "Basic household supplies for widows in Buea.",
        href: "/projects/archive/womens-day-home-visits-mar-2023/",
        linkLabel: "Read the 2023 Widows Outreach record",
      },
      {
        number: "2",
        title: "Zero Hunger",
        detail: "Food supplies for children during the Christmas outreach in Buea.",
        href: "/projects/archive/christmas-giving-dec-2023/",
        linkLabel: "Read the 2023 Christmas Giving record",
      },
      {
        number: "4",
        title: "Quality Education",
        detail: "School-fee support for children in Bamenda.",
        href: "/projects/archive/back-to-school-bamenda-aug-2026/",
        linkLabel: "Read the 2026 Bamenda Back to School record",
      },
      {
        number: "5",
        title: "Gender Equality",
        detail: "Menstrual-health education and hygiene kits for girls in Bamenda.",
        href: "/projects/archive/girls-dignity-menstrual-health-bamenda-jun-2026/",
        linkLabel: "Read the 2026 Girls’ Dignity outreach record",
      },
    ],
  },
  environment: {
    title: "Community Cleanups & Environmental Stewardship",
    intro: "The outreach archive documents how volunteers helped care for shared spaces in Buea.",
    items: [
      {
        title: "Community Cleanup · Buea, 2023",
        desc: "Our team and volunteers cleared litter from shared spaces in Buea.",
        href: "/projects/archive/city-cleanup-may-2023/",
        linkLabel: "Read the 2023 Community Cleanup record",
      },
      {
        title: "Labour Day School Cleanup · Buea, 2025",
        desc: "Volunteers carried out a cleanup at Lycée de Buea and Buea Technical Training College.",
        href: "/projects/archive/city-cleanup-may-2025/",
        linkLabel: "Read the 2025 Labour Day School Cleanup record",
      },
    ],
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
        desc: "Available financial records can be requested. The Annual Financial Summary shows what is currently published.",
      },
      {
        title: "Beneficiary feedback",
        desc: "Regular surveys ensure programs meet actual community needs.",
      },
      {
        title: "Bilingual reporting",
        desc: "Year in Review publications include English and French. Individual outreach reports may be available in only one language.",
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
      "Consultez les informations sur l’enregistrement d’ADA, ses publications annuelles, l’état de ses rapports financiers et ses pratiques de responsabilité.",
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
    intro: "Le comité exécutif supervise les activités d’ADA. L’équipe opérationnelle au Cameroun coordonne les actions et tient les dossiers.",
    roles: getTeamRoster("fr").groups.flatMap((group) =>
      group.profiles.map(({ name, role }) => ({ name, role }))),
    principlesLabel: "Principes de gouvernance :",
    principles: "La présidence, le secrétariat et la trésorerie ont des responsabilités distinctes. Le contrôle financier est séparé de la tenue courante des comptes. La directrice pays coordonne les actions sur le terrain.",
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
        desc: "Le rapprochement financier compare les registres de dons, les relevés du prestataire de paiement et les affectations aux programmes.",
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
          "Aide alimentaire, soutien scolaire, secours d'urgence, formation professionnelle et soutien aux bénéficiaires au Cameroun.",
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
      "Les pourcentages d'allocation décrivent le modèle opérationnel public d'ADA. Les dons affectés à un projet sont suivis selon les désignations des donateurs lorsqu'elles sont fournies.",
    annualSummary: "Résumé financier annuel",
    annualSummaryNote: "Avant de publier les totaux des dons et les chiffres financiers de l’ensemble de l’association pour 2024, nous vérifions la période couverte, la devise et le mode de calcul des montants. Cette vérification ne concerne pas les budgets de chaque action.",
    outreachBudgetsLink: "Consulter les budgets des actions dans les archives",
    tableHeaders: {
      year: "Année",
      totalReceived: "Total Reçu",
      programs: "Programmes (80%)",
      operations: "Opérations (15%)",
      admin: "Admin (5%)",
    },
    rows: [],
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
    title: "Comment se déroulent nos actions",
    intro: "Notre priorité est d’apporter un soutien concret aux femmes et aux adolescentes au Cameroun, notamment aux veuves et aux mères. Voici comment nous passons du besoin identifié avec la communauté au compte rendu de l’action.",
    steps: [
      { step: "1", title: "Écouter", desc: "Identifier un besoin avec les membres de la communauté et les partenaires locaux." },
      { step: "2", title: "Préparer", desc: "Définir l’aide possible et le périmètre de l’action." },
      { step: "3", title: "Agir", desc: "Mener l’action avec les équipes locales." },
      { step: "4", title: "Rendre compte", desc: "Consigner les activités, les coûts connus et les éléments qui restent à confirmer." },
    ],
  },
  sdg: {
    title: "Lien avec les objectifs de développement durable",
    intro: "Ces exemples montrent comment le travail d’ADA se rattache à certains objectifs des Nations Unies. Ils ne constituent ni une approbation de l’ONU ni une preuve que ces objectifs ont été atteints.",
    goals: [
      {
        number: "1",
        title: "Pas de pauvreté",
        detail: "Articles de première nécessité pour des veuves à Buea.",
        href: "/projects/archive/womens-day-home-visits-mar-2023/",
        linkLabel: "Lire le dossier de l’action auprès des veuves de 2023",
      },
      {
        number: "2",
        title: "Faim zéro",
        detail: "Denrées alimentaires pour des enfants lors de l’action de Noël à Buea.",
        href: "/projects/archive/christmas-giving-dec-2023/",
        linkLabel: "Lire le dossier de l’action de Noël de 2023",
      },
      {
        number: "4",
        title: "Éducation de qualité",
        detail: "Prise en charge de frais de scolarité pour des enfants à Bamenda.",
        href: "/projects/archive/back-to-school-bamenda-aug-2026/",
        linkLabel: "Lire le dossier de la rentrée scolaire de 2026 à Bamenda",
      },
      {
        number: "5",
        title: "Égalité entre les sexes",
        detail: "Sensibilisation à la santé menstruelle et remise de kits d’hygiène à des filles à Bamenda.",
        href: "/projects/archive/girls-dignity-menstrual-health-bamenda-jun-2026/",
        linkLabel: "Lire le dossier de l’action de 2026 sur la dignité des filles",
      },
    ],
  },
  environment: {
    title: "Nettoyage communautaire et protection de l’environnement",
    intro: "Les dossiers d’ADA montrent comment des bénévoles ont contribué à l’entretien d’espaces partagés à Buea.",
    items: [
      {
        title: "Nettoyage communautaire · Buea, 2023",
        desc: "Notre équipe et les bénévoles ont ramassé les déchets dans des espaces partagés à Buea.",
        href: "/projects/archive/city-cleanup-may-2023/",
        linkLabel: "Lire le dossier du nettoyage communautaire de 2023",
      },
      {
        title: "Nettoyage d’établissements scolaires pour la fête du Travail · Buea, 2025",
        desc: "Des bénévoles ont mené une opération de nettoyage au lycée de Buea et au Buea Technical Training College.",
        href: "/projects/archive/city-cleanup-may-2025/",
        linkLabel: "Lire le dossier du nettoyage scolaire de 2025",
      },
    ],
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
        desc: "Les documents financiers disponibles peuvent être demandés. Le résumé financier annuel indique ce qui est actuellement publié.",
      },
      {
        title: "Retour des bénéficiaires",
        desc: "Des enquêtes régulières garantissent que les programmes répondent aux besoins réels de la communauté.",
      },
      {
        title: "Rapports bilingues",
        desc: "Les bilans de l’année sont publiés en anglais et en français. Certains rapports d’action peuvent n’être disponibles que dans une langue.",
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
