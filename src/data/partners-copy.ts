export type PartnersLocale = "en" | "fr";

type PartnerType = {
  title: string;
  fit: string;
  ask: string;
  proof: string;
};

type IconCard = {
  icon: string;
  title: string;
  desc: string;
};

type Priority = {
  emoji: string;
  title: string;
  desc: string;
  amount: string;
};

type Alignment = {
  framework: string;
  alignment: string;
};

type FunderPoint = {
  label: string;
  text: string;
};

type FunderCard = {
  flag: string;
  title: string;
  points: FunderPoint[];
  tags: string[];
};

type CapacityItem = {
  title: string;
  desc: string;
};

type Stat = {
  value: string;
  label: string;
};

type Tier = {
  title: string;
  amount: string;
  desc: string;
  featured?: boolean;
};

type GenderBenefit = {
  label: string;
  text: string;
};

export type PartnersCopy = {
  meta: { title: string; description: string };
  hero: { title: string; subtitle: string; badge: string };
  sponsorBanner: { title: string; body: string; cta: string };
  priorities: {
    title: string;
    fundingGoalLabel: string;
    items: Priority[];
  };
  partnerTypes: {
    title: string;
    intro: string;
    inquiryCta: string;
    bestFit: string;
    waysToHelp: string;
    whatYouReceive: string;
    items: PartnerType[];
  };
  whyPartner: {
    title: string;
    items: IconCard[];
  };
  gender: {
    title: string;
    intro: string;
    stats: Stat[];
    benefitsTitle: string;
    benefits: GenderBenefit[];
  };
  alignment: {
    title: string;
    items: Alignment[];
  };
  funders: {
    title: string;
    intro: string;
    cards: FunderCard[];
    dueDiligence: {
      title: string;
      items: string[];
      contactPrompt: string;
      requestCta: string;
      resourcesCta: string;
    };
  };
  offer: {
    title: string;
    items: string[];
  };
  tiers: {
    title: string;
    intro: string;
    discussCta: string;
    items: Tier[];
  };
  trackRecord: {
    title: string;
    stats: Stat[];
  };
  capacity: {
    title: string;
    intro: string;
    items: CapacityItem[];
  };
  cta: {
    title: string;
    body: string;
    inquiry: string;
    sponsor: string;
    dueDiligence: string;
    transparency: string;
    contactLine: string;
  };
};

const en: PartnersCopy = {
  meta: {
    title: "For Partners & Funders",
    description:
      "Partnership information for institutional funders, embassies, and foundations. ADA offers transparent reporting, measurable results, and bilingual capacity.",
  },
  hero: {
    title: "Partner With Us",
    subtitle:
      "Institutional partnerships that create measurable, sustainable impact in Cameroon.",
    badge: "For Funders & Institutions",
  },
  sponsorBanner: {
    title: "Looking for a simple sponsorship path?",
    body: "Use the sponsor page for clear levels, payment options, reporting expectations, and the sponsor readiness packet.",
    cta: "Sponsor a Program",
  },
  priorities: {
    title: "2026 Funding Priorities",
    fundingGoalLabel: "2026 Funding Goal",
    items: [
      {
        emoji: "👩‍🌾",
        title: "Widow Empowerment",
        desc: "Train and equip 500 additional widows",
        amount: "$48,000",
      },
      {
        emoji: "📚",
        title: "Orphan Education",
        desc: "School scholarships for 300 orphans",
        amount: "$35,000",
      },
      {
        emoji: "🏥",
        title: "Health & Nutrition",
        desc: "Mobile clinic and nutrition program",
        amount: "$62,000",
      },
    ],
  },
  partnerTypes: {
    title: "Find Your Partnership Path",
    intro:
      "ADA works with community, institutional, and professional partners. Choose the path that matches your group and we will tailor the proposal, reporting, and due diligence materials.",
    inquiryCta: "Start Partnership Inquiry →",
    bestFit: "Best fit:",
    waysToHelp: "Ways to help:",
    whatYouReceive: "What you receive:",
    items: [
      {
        title: "Churches & Faith Communities",
        fit: "Mission boards, outreach teams, youth groups, and congregational campaigns.",
        ask: "Sponsor school fees, clean water, widow support, or a seasonal giving campaign.",
        proof:
          "Receive project photos, member-ready updates, receipts, and pastoral/community references.",
      },
      {
        title: "Companies & CSR Teams",
        fit: "Businesses looking for practical, accountable social impact in Cameroon.",
        ask: "Fund a program cycle, match employee gifts, sponsor skills training, or contribute in-kind expertise.",
        proof:
          "Receive brand recognition options, quarterly impact reporting, budgets, and beneficiary stories.",
      },
      {
        title: "Diaspora Associations",
        fit: "Cameroonian, African, and global diaspora groups pooling support for visible local projects.",
        ask: "Adopt a village project, sponsor students, or run a group campaign with a defined target.",
        proof:
          "Receive direct field updates, community acknowledgement, and transparent spending summaries.",
      },
      {
        title: "Schools & Universities",
        fit: "Student clubs, service-learning offices, research groups, and campus faith communities.",
        ask: "Support awareness events, peer fundraising, curriculum-linked projects, or technical assistance.",
        proof:
          "Receive classroom-ready impact notes, project briefs, guest speaker coordination, and volunteer pathways.",
      },
      {
        title: "Foundations & Grantmakers",
        fit: "Private foundations, family foundations, embassies, and institutional funders.",
        ask: "Provide project grants, multi-year funding, capacity support, or restricted program funding.",
        proof:
          "Receive proposals, logframes, governance records, budgets, M&E data, and due diligence documents.",
      },
    ],
  },
  whyPartner: {
    title: "Why Partner with ADA?",
    items: [
      {
        icon: "🎯",
        title: "Gender Equality Focus",
        desc: "85% of our beneficiaries are women and girls. Our programs directly advance gender equality through economic empowerment and education access.",
      },
      {
        icon: "📊",
        title: "Measurable Results",
        desc: "Logical framework with clear indicators, baselines, and targets. We track outcomes (income generated) not just outputs (people trained).",
      },
      {
        icon: "💰",
        title: "5% Admin Target",
        desc: "Lean operating model. Zero paid executive leadership. ADA’s public allocation model targets 80% program delivery.",
      },
      {
        icon: "🌱",
        title: "Locally Owned",
        desc: "Founded, led, and staffed by Cameroonians. Programs designed WITH communities, not imposed on them.",
      },
      {
        icon: "♻️",
        title: "Sustainability Built In",
        desc: "Our train-the-trainer model means programs outlive funding. Graduates become mentors for the next cohort.",
      },
      {
        icon: "🌍",
        title: "Bilingual Capacity",
        desc: "Full reporting in English and French. Quarterly updates, annual reports, and M&E data on schedule.",
      },
    ],
  },
  gender: {
    title: "Gender Equality: At the Core of Everything We Do",
    intro:
      "ADA's programs are designed through a gender lens, directly advancing women's economic empowerment and girls' access to education.",
    stats: [
      { value: "85%", label: "Beneficiaries are women & girls" },
      { value: "100%", label: "Skills programs target women" },
      { value: "15", label: "Widows now financially independent" },
      { value: "80%", label: "Graduates earning own income" },
    ],
    benefitsTitle: "How our programs specifically benefit women and girls:",
    benefits: [
      {
        label: "Widow Support:",
        text: "Restores economic agency to women who lost everything after spousal death",
      },
      {
        label: "Skills Training:",
        text: "Exclusively targets young women with vocational training + microfinance for business launch",
      },
      {
        label: "Education:",
        text: "Prioritizes girls who are first to be pulled from school when families face financial pressure",
      },
      {
        label: "Clean Water:",
        text: "Frees girls from water-fetching duties (often 2+ hours/day), enabling school attendance",
      },
    ],
  },
  alignment: {
    title: "Alignment with International Priorities",
    items: [
      {
        framework: "Canada's Feminist International Assistance Policy",
        alignment:
          "Gender equality is central to all ADA programs. 85% women/girl beneficiaries.",
      },
      {
        framework: "US Foreign Assistance Framework (USAID)",
        alignment:
          "Resilience, self-reliance, women's economic empowerment, youth development.",
      },
      {
        framework: "UN Sustainable Development Goals",
        alignment:
          "SDG 1 (No Poverty), SDG 2 (Zero Hunger), SDG 4 (Quality Education), SDG 5 (Gender Equality), SDG 6 (Clean Water), SDG 13 (Climate Action)",
      },
      {
        framework: "European Consensus on Development",
        alignment:
          "People-centered approach, gender equality, youth empowerment, environmental sustainability.",
      },
      {
        framework: "African Union Agenda 2063",
        alignment:
          "Youth empowerment, gender parity, community-driven development.",
      },
      {
        framework: "Paris Agreement / Climate Action",
        alignment:
          "Clean water infrastructure, community clean-up programs, environmental stewardship education.",
      },
    ],
  },
  funders: {
    title: "For International Funders",
    intro:
      "ADA welcomes partnerships with funders worldwide. Here's how we align with your country's development priorities.",
    cards: [
      {
        flag: "🇨🇦",
        title: "Canadian Funders",
        points: [
          {
            label: "Potential CFLI Fit:",
            text: "ADA's local registration, community focus, and bilingual capacity may make it worth reviewing against Canada Fund for Local Initiatives requirements before any application.",
          },
          {
            label: "Canadian Charity Partnerships:",
            text: "Canadian registered charities may be able to support foreign organizations when their own legal and CRA requirements are met. ADA can provide documentation for that review.",
          },
          {
            label: "Policy Alignment:",
            text: "Our programs directly advance Canada's Feminist International Assistance Policy with 85% women/girl beneficiaries.",
          },
          {
            label: "Tax Receipts:",
            text: "ADA does not currently advertise Canadian tax-deductible giving. If a qualified fiscal sponsor or charity partner is confirmed, ADA will publish the details clearly.",
          },
        ],
        tags: [
          "CFLI Review Candidate",
          "Bilingual EN/FR",
          "Gender Equality Focus",
        ],
      },
      {
        flag: "🇺🇸",
        title: "US Funders",
        points: [
          {
            label: "US Review Materials:",
            text: "ADA can provide governance, registration, financial, and program documents for US funders reviewing international grant options.",
          },
          {
            label: "Fiscal Sponsorship Path:",
            text: "ADA may pursue a US fiscal sponsor or giving platform in the future, but no US tax-deductible giving route is advertised as active today.",
          },
          {
            label: "Foundation Grants:",
            text: "US private foundations should use their own counsel and grantmaking procedures before funding any foreign organization. ADA can support the document review process.",
          },
          {
            label: "USAID Alignment:",
            text: "Our programs align with USAID's Journey to Self-Reliance framework — building local capacity, not dependency.",
          },
        ],
        tags: [
          "Fiscal Sponsor Path to Explore",
          "Due Diligence Documents Available",
          "Self-Reliance Model",
        ],
      },
      {
        flag: "🇪🇺",
        title: "European Funders",
        points: [
          {
            label: "EU Development Framework:",
            text: "ADA's work aligns with the European Consensus on Development — people-centered, rights-based, gender-responsive programming.",
          },
          {
            label: "French-Speaking Capacity:",
            text: "Full bilingual operations (English + French). All documentation, reports, and communications available in French — ideal for Francophone European funders.",
          },
          {
            label: "Embassy Partnerships:",
            text: "We welcome partnerships with European embassies in Cameroon through their local development cooperation programs.",
          },
          {
            label: "Climate & Environment:",
            text: "Our environmental programs (cleanups, tree planting, clean water) align with European Green Deal priorities.",
          },
        ],
        tags: [
          "Francophone Capacity",
          "Climate Action",
          "Rights-Based Approach",
        ],
      },
      {
        flag: "🇬🇧",
        title: "UK & Commonwealth Funders",
        points: [
          {
            label: "Commonwealth Connection:",
            text: "Cameroon is a Commonwealth member. ADA operates in the Anglophone regions (South-West and North-West) directly affected by the ongoing crisis.",
          },
          {
            label: "FCDO Alignment:",
            text: "Our programs align with UK Foreign, Commonwealth & Development Office priorities: women's empowerment, education, humanitarian response, and climate.",
          },
          {
            label: "Crisis Response:",
            text: "ADA has demonstrated emergency relief capacity in the Anglophone crisis context — serving IDPs, conflict-affected children, and displaced families.",
          },
        ],
        tags: [
          "Commonwealth Member",
          "Anglophone Crisis Response",
          "IDP Support",
        ],
      },
      {
        flag: "🌍",
        title: "Diaspora & Individual Donors (Worldwide)",
        points: [
          {
            label: "Direct Impact:",
            text: "ADA’s public allocation model targets 80% program delivery. Sponsors can review project budgets and reporting before larger gifts.",
          },
          {
            label: "Full Transparency:",
            text: "Every project has downloadable Terms of Reference, completion reports, and financial reports on our website.",
          },
          {
            label: "Secure Giving:",
            text: "Stripe-powered donations with PDF receipts after payment confirmation. Monthly recurring options available.",
          },
          {
            label: "Stay Connected:",
            text: "Quarterly impact updates with photos and stories from the field.",
          },
        ],
        tags: [
          "Secure Online Donations",
          "PDF Receipts",
          "Full Accountability",
        ],
      },
    ],
    dueDiligence: {
      title: "Due Diligence Package (Available on Request)",
      items: [
        "Registration certificate (N° 415/G.37/D14/VolI/SAAJP)",
        "Leadership and governance overview",
        "Annual reports and program summaries",
        "Project records and reports where available",
        "Organizational policies (governance, finance, safeguarding)",
        "Reporting expectations and M&E indicators",
        "References from community leaders and partners",
        "Site visit coordination",
      ],
      contactPrompt:
        "Contact {email} to request the full due diligence package.",
      requestCta: "Request Due Diligence →",
      resourcesCta: "Resource Library →",
    },
  },
  offer: {
    title: "What We Provide to Partners",
    items: [
      "Detailed project proposals with logical frameworks",
      "Quarterly narrative and financial reports",
      "Annual financial summaries and supporting records",
      "Monitoring & Evaluation data with indicators",
      "Photo and video documentation of activities",
      "Beneficiary testimonials and case studies",
      "Site visit coordination for due diligence",
      "Reports in English and French",
    ],
  },
  tiers: {
    title: "Partnership Opportunities",
    intro:
      "These options can be adapted for churches, companies, diaspora associations, schools, universities, and foundations.",
    discussCta: "Discuss an Opportunity →",
    items: [
      {
        title: "Project Funding",
        amount: "$500–$5K",
        desc: "Fund a specific program or campaign with full reporting and accountability.",
      },
      {
        title: "Multi-Year Partnership",
        amount: "$5K–$20K",
        desc: "Strategic partnership with co-designed goals, agreed reporting cadence, and deeper impact measurement.",
        featured: true,
      },
      {
        title: "Technical Assistance",
        amount: "In-Kind",
        desc: "Capacity building, training, technology, or expertise to strengthen our operations.",
      },
    ],
  },
  trackRecord: {
    title: "Our Track Record",
    stats: [
      { value: "200+", label: "Lives impacted" },
      { value: "85%", label: "Women & girls" },
      { value: "5%", label: "Admin overhead" },
      { value: "4 yrs", label: "Continuous operation" },
    ],
  },
  capacity: {
    title: "Our Partnership Capacity",
    intro:
      "We have the systems and skills to manage institutional partnerships professionally.",
    items: [
      {
        title: "Bilingual Reporting",
        desc: "All reports, proposals, and communications delivered in English and French. Team fluent in both languages.",
      },
      {
        title: "Deadline Management",
        desc: "Quarterly and project-specific reporting can be scheduled into partner agreements so expectations are clear from the start.",
      },
      {
        title: "Financial Management",
        desc: "Donation records, payment processor records, budgets, receipts, and project allocations are reconciled for transparent fund tracking.",
      },
      {
        title: "M&E Framework",
        desc: "Logical framework with SMART indicators. Baseline data collected. Outcome tracking (not just outputs).",
      },
      {
        title: "Documentation",
        desc: "Photo/video documentation, field notes, attendance lists, receipts, and beneficiary consent practices are used where appropriate.",
      },
      {
        title: "Governance",
        desc: "Board oversight, defined officer roles, financial review, and documented policies support responsible partnership management.",
      },
    ],
  },
  cta: {
    title: "Start a Conversation",
    body: "We welcome partnerships with churches, companies, diaspora groups, schools, universities, foundations, embassies, and international NGOs aligned with our mission.",
    inquiry: "Start Partnership Inquiry",
    sponsor: "Sponsor a Program",
    dueDiligence: "Request Due Diligence",
    transparency: "View Transparency Report",
    contactLine: "info@apotidev.org · +237 676 282 346 · Cameroon",
  },
};

const fr: PartnersCopy = {
  meta: {
    title: "Pour les Partenaires et Bailleurs de Fonds",
    description:
      "Informations de partenariat pour les bailleurs institutionnels, ambassades et fondations. ADA offre des rapports transparents, des résultats mesurables et une capacité bilingue.",
  },
  hero: {
    title: "Devenez Partenaire",
    subtitle:
      "Partenariats institutionnels qui créent un impact mesurable et durable au Cameroun.",
    badge: "Pour les Bailleurs et Institutions",
  },
  sponsorBanner: {
    title: "Vous cherchez un chemin de parrainage simple ?",
    body: "La page de parrainage présente les niveaux, les options de paiement, les attentes de rapport et le dossier de préparation.",
    cta: "Sponsoriser un Programme",
  },
  priorities: {
    title: "Priorités de Financement 2026",
    fundingGoalLabel: "Objectif de Financement 2026",
    items: [
      {
        emoji: "👩‍🌾",
        title: "Émancipation des Veuves",
        desc: "Former et équiper 500 veuves supplémentaires",
        amount: "48 000 $",
      },
      {
        emoji: "📚",
        title: "Éducation pour les Orphelins",
        desc: "Bourses scolaires pour 300 orphelins",
        amount: "35 000 $",
      },
      {
        emoji: "🏥",
        title: "Santé et Nutrition",
        desc: "Clinique mobile et programme de nutrition",
        amount: "62 000 $",
      },
    ],
  },
  partnerTypes: {
    title: "Trouvez Votre Voie de Partenariat",
    intro:
      "ADA collabore avec des partenaires communautaires, institutionnels et professionnels. Choisissez la voie qui correspond à votre groupe et nous adapterons la proposition, les rapports et les documents de diligence raisonnable.",
    inquiryCta: "Lancer une Demande de Partenariat →",
    bestFit: "Meilleure adéquation :",
    waysToHelp: "Façons d'aider :",
    whatYouReceive: "Ce que vous recevez :",
    items: [
      {
        title: "Églises et Communautés de Foi",
        fit: "Conseils missionnaires, équipes d'évangélisation, groupes de jeunes et campagnes paroissiales.",
        ask: "Sponsoriser les frais scolaires, l'eau potable, le soutien aux veuves ou une campagne de don saisonnière.",
        proof:
          "Recevoir des photos de projets, des mises à jour prêtes pour les membres, des reçus et des références pastorales/communautaires.",
      },
      {
        title: "Entreprises et Équipes RSE",
        fit: "Entreprises cherchant un impact social concret et responsable au Cameroun.",
        ask: "Financer un cycle de programme, abonder les dons des employés, sponsoriser une formation professionnelle ou contribuer une expertise en nature.",
        proof:
          "Recevoir des options de reconnaissance de marque, des rapports d'impact trimestriels, des budgets et des histoires de bénéficiaires.",
      },
      {
        title: "Associations de la Diaspora",
        fit: "Groupes de la diaspora camerounaise, africaine et mondiale qui regroupent leur soutien pour des projets locaux visibles.",
        ask: "Adopter un projet villageois, sponsoriser des étudiants ou mener une campagne de groupe avec un objectif défini.",
        proof:
          "Recevoir des mises à jour directes du terrain, une reconnaissance communautaire et des résumés de dépenses transparents.",
      },
      {
        title: "Écoles et Universités",
        fit: "Clubs étudiants, bureaux d'apprentissage-service, groupes de recherche et communautés de foi sur campus.",
        ask: "Soutenir des événements de sensibilisation, des collectes entre pairs, des projets liés au curriculum ou une assistance technique.",
        proof:
          "Recevoir des notes d'impact prêtes pour la classe, des briefs de projet, la coordination d'intervenants et des parcours de bénévolat.",
      },
      {
        title: "Fondations et Bailleurs",
        fit: "Fondations privées, fondations familiales, ambassades et bailleurs institutionnels.",
        ask: "Fournir des subventions de projet, un financement pluriannuel, un soutien aux capacités ou un financement de programme restreint.",
        proof:
          "Recevoir des propositions, des cadres logiques, des documents de gouvernance, des budgets, des données de S&E et des dossiers de diligence raisonnable.",
      },
    ],
  },
  whyPartner: {
    title: "Pourquoi S'Associer à ADA ?",
    items: [
      {
        icon: "🎯",
        title: "Accent sur l'Égalité des Genres",
        desc: "85% de nos bénéficiaires sont des femmes et des filles. Nos programmes font directement progresser l'égalité des genres par l'autonomisation économique et l'accès à l'éducation.",
      },
      {
        icon: "📊",
        title: "Résultats Mesurables",
        desc: "Cadre logique avec des indicateurs clairs, des références et des cibles. Nous suivons les résultats (revenus générés) et pas seulement les extrants (personnes formées).",
      },
      {
        icon: "💰",
        title: "5% de Frais Généraux",
        desc: "Modèle opérationnel léger. Direction exécutive bénévole. Le modèle d'allocation public d'ADA vise 80% pour l'exécution des programmes.",
      },
      {
        icon: "🌱",
        title: "Propriété Locale",
        desc: "Fondée, dirigée et composée de Camerounais. Programmes conçus AVEC les communautés, pas imposés à elles.",
      },
      {
        icon: "♻️",
        title: "Durabilité Intégrée",
        desc: "Notre modèle de formation de formateurs signifie que les programmes survivent au financement. Les diplômés deviennent mentors pour la cohorte suivante.",
      },
      {
        icon: "🌍",
        title: "Capacité Bilingue",
        desc: "Rapports complets en anglais et en français. Mises à jour trimestrielles, rapports annuels et données de S&E dans les délais.",
      },
    ],
  },
  gender: {
    title: "Égalité des Genres : Au Cœur de Tout Ce Que Nous Faisons",
    intro:
      "Les programmes d'ADA sont conçus à travers un prisme de genre, faisant directement progresser l'autonomisation économique des femmes et l'accès des filles à l'éducation.",
    stats: [
      { value: "85%", label: "Bénéficiaires sont des femmes et filles" },
      {
        value: "100%",
        label: "Programmes de compétences ciblent les femmes",
      },
      {
        value: "15",
        label: "Veuves désormais financièrement indépendantes",
      },
      { value: "80%", label: "Diplômées gagnant leur propre revenu" },
    ],
    benefitsTitle:
      "Comment nos programmes bénéficient spécifiquement aux femmes et aux filles :",
    benefits: [
      {
        label: "Soutien aux Veuves :",
        text: "Restaure l'autonomie économique des femmes qui ont tout perdu après le décès de leur conjoint",
      },
      {
        label: "Formation Professionnelle :",
        text: "Cible exclusivement les jeunes femmes avec formation professionnelle + microfinance pour le lancement d'entreprise",
      },
      {
        label: "Éducation :",
        text: "Priorise les filles qui sont les premières retirées de l'école lorsque les familles font face à des pressions financières",
      },
      {
        label: "Eau Potable :",
        text: "Libère les filles des corvées d'eau (souvent 2+ heures/jour), permettant la fréquentation scolaire",
      },
    ],
  },
  alignment: {
    title: "Alignement avec les Priorités Internationales",
    items: [
      {
        framework: "Politique d'Aide Internationale Féministe du Canada",
        alignment:
          "L'égalité des genres est au cœur de tous les programmes d'ADA. 85% de bénéficiaires femmes/filles.",
      },
      {
        framework: "Cadre d'Assistance Étrangère des États-Unis (USAID)",
        alignment:
          "Résilience, autonomie, autonomisation économique des femmes, développement des jeunes.",
      },
      {
        framework: "Objectifs de Développement Durable de l'ONU",
        alignment:
          "ODD 1 (Pas de pauvreté), ODD 2 (Faim zéro), ODD 4 (Éducation de qualité), ODD 5 (Égalité des genres), ODD 6 (Eau propre), ODD 13 (Action climatique)",
      },
      {
        framework: "Consensus Européen sur le Développement",
        alignment:
          "Approche centrée sur les personnes, égalité des genres, autonomisation des jeunes, durabilité environnementale.",
      },
      {
        framework: "Agenda 2063 de l'Union Africaine",
        alignment:
          "Autonomisation des jeunes, parité des genres, développement communautaire.",
      },
      {
        framework: "Accord de Paris / Action Climatique",
        alignment:
          "Infrastructure d'eau potable, nettoyages communautaires, éducation à la responsabilité environnementale.",
      },
    ],
  },
  funders: {
    title: "Pour les Bailleurs Internationaux",
    intro:
      "ADA accueille les partenariats avec des bailleurs du monde entier. Voici comment nous nous alignons avec les priorités de votre pays.",
    cards: [
      {
        flag: "🇨🇦",
        title: "Bailleurs Canadiens",
        points: [
          {
            label: "Examen FCIL potentiel :",
            text: "L'enregistrement local, l'ancrage communautaire et la capacité bilingue d'ADA peuvent justifier un examen par rapport aux exigences du Fonds canadien d'initiatives locales avant toute candidature.",
          },
          {
            label: "Partenariats caritatifs canadiens :",
            text: "Les organismes de bienfaisance canadiens enregistrés peuvent soutenir des organisations étrangères lorsque leurs propres exigences juridiques et de l'ARC sont respectées. ADA peut fournir la documentation pour cet examen.",
          },
          {
            label: "Alignement politique :",
            text: "Nos programmes avancent directement la Politique d'aide internationale féministe du Canada avec 85% de bénéficiaires femmes/filles.",
          },
          {
            label: "Reçus fiscaux :",
            text: "ADA ne présente pas actuellement les dons comme déductibles d'impôt au Canada. Si un parrain fiscal ou partenaire qualifié est confirmé, les détails seront publiés clairement.",
          },
        ],
        tags: [
          "Candidat à l'examen FCIL",
          "Bilingue EN/FR",
          "Accent Égalité des Genres",
        ],
      },
      {
        flag: "🇺🇸",
        title: "Bailleurs Américains",
        points: [
          {
            label: "Documents d'examen :",
            text: "ADA peut fournir des documents de gouvernance, d'enregistrement, de finances et de programmes aux bailleurs américains qui examinent des options de financement international.",
          },
          {
            label: "Chemin de parrain fiscal :",
            text: "ADA peut explorer un parrain fiscal ou une plateforme de dons à l'avenir, mais aucun chemin de don déductible aux États-Unis n'est présenté comme actif aujourd'hui.",
          },
          {
            label: "Subventions de fondations :",
            text: "Les fondations privées américaines doivent s'appuyer sur leurs propres conseillers et procédures de subventionnement avant de financer toute organisation étrangère. ADA peut soutenir le processus d'examen documentaire.",
          },
          {
            label: "Alignement USAID :",
            text: "Nos programmes s'alignent sur le cadre « Journey to Self-Reliance » — renforcer les capacités locales, pas la dépendance.",
          },
        ],
        tags: [
          "Chemin de parrain fiscal à explorer",
          "Documents de diligence disponibles",
          "Modèle d'autonomie",
        ],
      },
      {
        flag: "🇪🇺",
        title: "Bailleurs Européens",
        points: [
          {
            label: "Cadre de Développement UE :",
            text: "Le travail d'ADA s'aligne sur le Consensus Européen sur le Développement — programmation centrée sur les personnes, fondée sur les droits et sensible au genre.",
          },
          {
            label: "Capacité Francophone :",
            text: "Opérations entièrement bilingues (anglais + français). Toute la documentation, les rapports et les communications sont disponibles en français — idéal pour les bailleurs européens francophones.",
          },
          {
            label: "Partenariats d'ambassades :",
            text: "Nous accueillons les partenariats avec les ambassades européennes au Cameroun via leurs programmes de coopération au développement local.",
          },
          {
            label: "Climat & Environnement :",
            text: "Nos programmes environnementaux (nettoyages, plantation d'arbres, eau potable) s'alignent sur les priorités du Pacte Vert européen.",
          },
        ],
        tags: [
          "Capacité Francophone",
          "Action Climatique",
          "Approche fondée sur les droits",
        ],
      },
      {
        flag: "🇬🇧",
        title: "Bailleurs Britanniques & Commonwealth",
        points: [
          {
            label: "Connexion Commonwealth :",
            text: "Le Cameroun est membre du Commonwealth. ADA opère dans les régions anglophones (Sud-Ouest et Nord-Ouest) directement affectées par la crise en cours.",
          },
          {
            label: "Alignement FCDO :",
            text: "Nos programmes s'alignent sur les priorités du Foreign, Commonwealth & Development Office du Royaume-Uni : autonomisation des femmes, éducation, réponse humanitaire et climat.",
          },
          {
            label: "Réponse aux Crises :",
            text: "ADA a démontré sa capacité d'aide d'urgence dans le contexte de la crise anglophone — servant les PDI, les enfants touchés par le conflit et les familles déplacées.",
          },
        ],
        tags: [
          "Membre du Commonwealth",
          "Réponse à la crise anglophone",
          "Soutien aux PDI",
        ],
      },
      {
        flag: "🌍",
        title: "Diaspora & Donateurs Individuels (Mondial)",
        points: [
          {
            label: "Impact Direct :",
            text: "Le modèle d'allocation public d'ADA vise 80% pour l'exécution des programmes. Les sponsors peuvent examiner les budgets et rapports de projet avant des dons plus importants.",
          },
          {
            label: "Transparence Totale :",
            text: "Chaque projet dispose de termes de référence, rapports de fin et bilans financiers téléchargeables sur notre site.",
          },
          {
            label: "Don Sécurisé :",
            text: "Dons via Stripe avec reçus PDF après confirmation du paiement. Options mensuelles disponibles.",
          },
          {
            label: "Restez Connectés :",
            text: "Mises à jour d'impact trimestrielles avec photos et histoires du terrain.",
          },
        ],
        tags: ["Dons en ligne sécurisés", "Reçus PDF", "Redevabilité totale"],
      },
    ],
    dueDiligence: {
      title: "Dossier de Diligence Raisonnable (Disponible sur Demande)",
      items: [
        "Certificat d'enregistrement (N° 415/G.37/D14/VolI/SAAJP)",
        "Aperçu du leadership et de la gouvernance",
        "Rapports annuels et résumés de programmes",
        "Dossiers et rapports de projets disponibles",
        "Politiques organisationnelles (gouvernance, finances, protection)",
        "Attentes de rapport et indicateurs de S&E",
        "Références de leaders communautaires et partenaires",
        "Coordination de visites de terrain",
      ],
      contactPrompt: "Contactez {email} pour demander le dossier complet.",
      requestCta: "Demander la Diligence Raisonnable →",
      resourcesCta: "Bibliothèque de Ressources →",
    },
  },
  offer: {
    title: "Ce Que Nous Offrons aux Partenaires",
    items: [
      "Propositions de projets détaillées avec cadres logiques",
      "Rapports narratifs et financiers trimestriels",
      "Résumés financiers annuels et documents justificatifs",
      "Données de Suivi & Évaluation avec indicateurs",
      "Documentation photo et vidéo des activités",
      "Témoignages de bénéficiaires et études de cas",
      "Coordination de visites de terrain pour la diligence raisonnable",
      "Rapports en anglais et en français",
    ],
  },
  tiers: {
    title: "Opportunités de Partenariat",
    intro:
      "Ces options peuvent être adaptées pour les églises, entreprises, associations de diaspora, écoles, universités et fondations.",
    discussCta: "Discuter d'une Opportunité →",
    items: [
      {
        title: "Financement de Projet",
        amount: "500$–5K$",
        desc: "Financez un programme ou une campagne spécifique avec rapports complets et redevabilité.",
      },
      {
        title: "Partenariat Pluriannuel",
        amount: "5K$–20K$",
        desc: "Partenariat stratégique avec objectifs co-conçus, cadence de rapport convenue et mesure d'impact approfondie.",
        featured: true,
      },
      {
        title: "Assistance Technique",
        amount: "En Nature",
        desc: "Renforcement des capacités, formation, technologie ou expertise pour renforcer nos opérations.",
      },
    ],
  },
  trackRecord: {
    title: "Notre Bilan",
    stats: [
      { value: "200+", label: "Vies impactées" },
      { value: "85%", label: "Femmes et filles" },
      { value: "5%", label: "Frais administratifs" },
      { value: "4 ans", label: "Opération continue" },
    ],
  },
  capacity: {
    title: "Notre Capacité de Partenariat",
    intro:
      "Nous avons les systèmes et les compétences pour gérer les partenariats institutionnels de manière professionnelle.",
    items: [
      {
        title: "Rapports Bilingues",
        desc: "Tous les rapports, propositions et communications livrés en anglais et en français. Équipe bilingue.",
      },
      {
        title: "Gestion des Délais",
        desc: "Les attentes de rapport peuvent être fixées dans les accords de partenariat afin que les échéances soient claires dès le départ.",
      },
      {
        title: "Gestion Financière",
        desc: "Les dons, les reçus, les budgets et les allocations de projet sont suivis pour une utilisation transparente des fonds.",
      },
      {
        title: "Cadre de S&E",
        desc: "Cadre logique avec indicateurs SMART. Données de référence collectées. Suivi des résultats (pas seulement des extrants).",
      },
      {
        title: "Documentation",
        desc: "Photos, notes de terrain, listes de présence, reçus et pratiques de consentement sont utilisés lorsque cela est approprié.",
      },
      {
        title: "Gouvernance",
        desc: "Supervision du conseil, rôles définis, revue financière et politiques documentées soutiennent une gestion responsable.",
      },
    ],
  },
  cta: {
    title: "Entamons une Conversation",
    body: "Nous accueillons les partenariats avec les églises, entreprises, groupes de diaspora, écoles, universités, fondations, ambassades et ONG internationales alignées avec notre mission.",
    inquiry: "Lancer une Demande de Partenariat",
    sponsor: "Sponsoriser un Programme",
    dueDiligence: "Demander la Diligence Raisonnable",
    transparency: "Voir le Rapport de Transparence",
    contactLine: "info@apotidev.org · +237 676 282 346 · Cameroun",
  },
};

export const partnersCopy: Record<PartnersLocale, PartnersCopy> = {
  en,
  fr,
};
