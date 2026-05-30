export type ImpactMetric = {
  label: string;
  value: string;
  period: string;
  measurement: "Measured" | "Field records" | "Estimated";
  cadence: string;
  source: string;
  sourceUrl: string;
  note: string;
};

export const impactScorecardUpdated = "May 2026";

export const impactMetricsEn: ImpactMetric[] = [
  {
    label: "Latest annual delivery",
    value: "$12,800 / 520+ reached",
    period: "2024 annual report",
    measurement: "Measured",
    cadence: "Annual",
    source: "2024 annual report",
    sourceUrl: "/docs/annual-reports/2024-annual-report.pdf",
    note: "Represents reported 2024 program delivery across 6 projects, including direct and community-level reach.",
  },
  {
    label: "Documented project records",
    value: "25",
    period: "2021-2025 archive",
    measurement: "Field records",
    cadence: "Annual",
    source: "Project document library",
    sourceUrl: "/resources#project-documents",
    note: "Each archived project includes available terms, financials, and close-out records.",
  },
  {
    label: "Women documented earning income",
    value: "20",
    period: "Completed training cohorts",
    measurement: "Measured",
    cadence: "After cohort close-out",
    source: "Vocational training reports",
    sourceUrl: "/docs/projects/young-women-skills-training-program/report.pdf",
    note: "Combines 12 widow training graduates and 8 young women skills-training graduates documented as earning income.",
  },
  {
    label: "Tracked education cohort",
    value: "20 retained and passed",
    period: "2023-2024 school year",
    measurement: "Measured",
    cadence: "School-year close-out",
    source: "Back-to-school project report",
    sourceUrl: "/docs/projects/back-to-school-drive-2023/report.pdf",
    note: "The Bamenda 2023 cohort documented enrollment, retention, and end-of-year pass results for 20 children.",
  },
  {
    label: "People served by clean water infrastructure",
    value: "300+",
    period: "2024 project",
    measurement: "Field records",
    cadence: "Project close-out",
    source: "Clean water project report",
    sourceUrl: "/docs/projects/clean-water-well-nkwen-mbatu/report.pdf",
    note: "Community-level reach estimate based on the completed water point.",
  },
  {
    label: "Emergency food relief reach",
    value: "50 families / 150+ people",
    period: "2024 project",
    measurement: "Field records",
    cadence: "Project close-out",
    source: "Emergency food relief report",
    sourceUrl: "/docs/projects/emergency-food-relief-bamenda-crisis/report.pdf",
    note: "Counts households reached during the three-month relief cycle.",
  },
  {
    label: "Program delivery allocation target",
    value: "80%",
    period: "Current public allocation model",
    measurement: "Estimated",
    cadence: "Annual",
    source: "Transparency page and financial policy",
    sourceUrl: "/transparency",
    note: "A public allocation target for stewardship, not an audited expense ratio.",
  },
  {
    label: "Budget discipline",
    value: "2.0% under budget",
    period: "2024 portfolio",
    measurement: "Measured",
    cadence: "Annual",
    source: "2024 annual report",
    sourceUrl: "/docs/annual-reports/2024-annual-report.pdf",
    note: "Reported 2024 portfolio variance from project budgets.",
  },
];

export const impactMetricsFr: ImpactMetric[] = [
  {
    label: "Dernière livraison annuelle",
    value: "12 800 $ / 520+ atteints",
    period: "Rapport annuel 2024",
    measurement: "Measured",
    cadence: "Annuel",
    source: "Rapport annuel 2024",
    sourceUrl: "/docs/annual-reports/2024-annual-report.pdf",
    note: "Représente la livraison programmée déclarée en 2024 sur 6 projets, incluant portée directe et communautaire.",
  },
  {
    label: "Dossiers de projets documentés",
    value: "25",
    period: "Archives 2021-2025",
    measurement: "Field records",
    cadence: "Annuel",
    source: "Bibliothèque de documents de projet",
    sourceUrl: "/fr/resources#project-documents",
    note: "Chaque projet archivé inclut les termes, finances et rapports disponibles.",
  },
  {
    label: "Femmes documentées générant un revenu",
    value: "20",
    period: "Cohortes de formation terminées",
    measurement: "Measured",
    cadence: "Après clôture de cohorte",
    source: "Rapports de formation professionnelle",
    sourceUrl: "/docs/projects/young-women-skills-training-program/report.pdf",
    note: "Combine 12 diplômées veuves et 8 jeunes femmes diplômées documentées comme générant un revenu.",
  },
  {
    label: "Cohorte scolaire suivie",
    value: "20 maintenus et admis",
    period: "Année scolaire 2023-2024",
    measurement: "Measured",
    cadence: "Clôture d'année scolaire",
    source: "Rapport du projet rentrée scolaire",
    sourceUrl: "/docs/projects/back-to-school-drive-2023/report.pdf",
    note: "La cohorte Bamenda 2023 documente inscription, maintien et réussite de fin d'année pour 20 enfants.",
  },
  {
    label: "Personnes servies par l'infrastructure d'eau",
    value: "300+",
    period: "Projet 2024",
    measurement: "Field records",
    cadence: "Clôture de projet",
    source: "Rapport du projet d'eau potable",
    sourceUrl: "/docs/projects/clean-water-well-nkwen-mbatu/report.pdf",
    note: "Estimation de portée communautaire basée sur le point d'eau terminé.",
  },
  {
    label: "Portée de l'aide alimentaire d'urgence",
    value: "50 familles / 150+ personnes",
    period: "Projet 2024",
    measurement: "Field records",
    cadence: "Clôture de projet",
    source: "Rapport d'aide alimentaire d'urgence",
    sourceUrl: "/docs/projects/emergency-food-relief-bamenda-crisis/report.pdf",
    note: "Compte les ménages atteints pendant le cycle de secours de trois mois.",
  },
  {
    label: "Objectif d'allocation aux programmes",
    value: "80%",
    period: "Modèle public actuel",
    measurement: "Estimated",
    cadence: "Annuel",
    source: "Page de transparence et politique financière",
    sourceUrl: "/fr/transparency",
    note: "Objectif public de gestion responsable, pas un ratio de dépenses audité.",
  },
  {
    label: "Discipline budgétaire",
    value: "2,0% sous budget",
    period: "Portefeuille 2024",
    measurement: "Measured",
    cadence: "Annuel",
    source: "Rapport annuel 2024",
    sourceUrl: "/docs/annual-reports/2024-annual-report.pdf",
    note: "Écart du portefeuille 2024 déclaré par rapport aux budgets de projet.",
  },
];

export const measurementLabels = {
  en: {
    Measured: "Measured",
    "Field records": "Field records",
    Estimated: "Estimated",
  },
  fr: {
    Measured: "Mesuré",
    "Field records": "Dossiers terrain",
    Estimated: "Estimé",
  },
} as const;
