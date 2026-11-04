import type { Locale } from "../i18n";

export type MeasurableIndicator = {
	indicator: string;
	baseline: string;
	target: string;
	actual: string;
	status: "on-track" | "in-progress";
	actualValue: number;
	targetValue: number;
};

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

/**
 * Single source of truth for public impact numbers.
 * Homepage Sanity `impactMetric` docs should stay aligned with homepageStats.
 * Transparency progress + scorecard derive from these facts.
 */
export const IMPACT_FACTS = {
	livesImpacted: 200,
	communitiesServed: 5,
	widowsSupported: 15,
	yearsOfService: 5,
	documentedProjects: 24,
	womenEarningIncome: 20,
	programAllocationPct: 80,
	programOperationsPct: 15,
	administrationPct: 5,
	educationCohortRetained: 20,
	emergencyFoodFamilies: 50,
	emergencyFoodPeople: 150,
	indicators: {
		widowsIndependence: { actual: 12, target: 20, trained: 15 },
		childrenInSchool: { actual: 20, target: 50 },
		womenVocational: { actual: 10, target: 30, earning: 8 },
		emergencyFoodFamilies: { actual: 50, target: 100 },
	},
} as const;

export function homepageStatsFallback(
	locale: Locale = "en",
): { value: string; label: string }[] {
	const f = IMPACT_FACTS;
	if (locale === "fr") {
		return [
			{ value: `${f.livesImpacted}+`, label: "Vies touchées" },
			{ value: String(f.communitiesServed), label: "Communautés servies" },
			{ value: `${f.widowsSupported}+`, label: "Veuves soutenues" },
			{ value: String(f.yearsOfService), label: "Années de service" },
		];
	}
	return [
		{ value: `${f.livesImpacted}+`, label: "Lives Impacted" },
		{ value: String(f.communitiesServed), label: "Communities Served" },
		{ value: `${f.widowsSupported}+`, label: "Widows Supported" },
		{ value: String(f.yearsOfService), label: "Years of Service" },
	];
}

/** Sanity seed / CMS should mirror these homepage counters. */
export function sanityImpactMetricSeed() {
	const f = IMPACT_FACTS;
	return [
		{
			_id: "metric-lives",
			label: "Lives Impacted",
			value: f.livesImpacted,
			suffix: "+",
			displayOrder: 1,
		},
		{
			_id: "metric-communities",
			label: "Communities Served",
			value: f.communitiesServed,
			suffix: "",
			displayOrder: 2,
		},
		{
			_id: "metric-widows",
			label: "Widows Supported",
			value: f.widowsSupported,
			suffix: "+",
			displayOrder: 3,
		},
		{
			_id: "metric-years",
			label: "Years of Service",
			value: f.yearsOfService,
			suffix: "",
			displayOrder: 4,
		},
	];
}

export function measurableIndicatorsFor(locale: Locale): MeasurableIndicator[] {
	const i = IMPACT_FACTS.indicators;
	if (locale === "fr") {
		return [
			{
				indicator: "Veuves atteignant l'indépendance financière",
				baseline: "0 (2021)",
				target: `${i.widowsIndependence.target} d'ici 2025`,
				actual: `${i.widowsIndependence.actual} sur ${i.widowsIndependence.trained} formées (${Math.round((i.widowsIndependence.actual / i.widowsIndependence.trained) * 100)}%)`,
				status: "on-track",
				actualValue: i.widowsIndependence.actual,
				targetValue: i.widowsIndependence.target,
			},
			{
				indicator: "Enfants inscrits et maintenus à l'école",
				baseline: "0 (2021)",
				target: `${i.childrenInSchool.target} d'ici 2026`,
				actual: `${i.childrenInSchool.actual} inscrits, 100% de rétention`,
				status: "on-track",
				actualValue: i.childrenInSchool.actual,
				targetValue: i.childrenInSchool.target,
			},
			{
				indicator: "Femmes ayant terminé la formation professionnelle",
				baseline: "0 (2022)",
				target: `${i.womenVocational.target} d'ici 2026`,
				actual: `${i.womenVocational.actual} diplômées, ${i.womenVocational.earning} génèrent des revenus`,
				status: "on-track",
				actualValue: i.womenVocational.actual,
				targetValue: i.womenVocational.target,
			},
			{
				indicator: "Familles recevant une aide alimentaire d'urgence",
				baseline: "3 (2022)",
				target: `${i.emergencyFoodFamilies.target}/an`,
				actual: `${i.emergencyFoodFamilies.actual} familles en 2024`,
				status: "on-track",
				actualValue: i.emergencyFoodFamilies.actual,
				targetValue: i.emergencyFoodFamilies.target,
			},
		];
	}

	return [
		{
			indicator: "Widows achieving financial independence",
			baseline: "0 (2021)",
			target: `${i.widowsIndependence.target} by 2025`,
			actual: `${i.widowsIndependence.actual} of ${i.widowsIndependence.trained} trained (${Math.round((i.widowsIndependence.actual / i.widowsIndependence.trained) * 100)}%)`,
			status: "on-track",
			actualValue: i.widowsIndependence.actual,
			targetValue: i.widowsIndependence.target,
		},
		{
			indicator: "Children enrolled and retained in school",
			baseline: "0 (2021)",
			target: `${i.childrenInSchool.target} by 2026`,
			actual: `${i.childrenInSchool.actual} enrolled, 100% retention`,
			status: "on-track",
			actualValue: i.childrenInSchool.actual,
			targetValue: i.childrenInSchool.target,
		},
		{
			indicator: "Women completing vocational training",
			baseline: "0 (2022)",
			target: `${i.womenVocational.target} by 2026`,
			actual: `${i.womenVocational.actual} graduated, ${i.womenVocational.earning} earning income`,
			status: "on-track",
			actualValue: i.womenVocational.actual,
			targetValue: i.womenVocational.target,
		},
		{
			indicator: "Families receiving emergency food support",
			baseline: "3 (2022)",
			target: `${i.emergencyFoodFamilies.target}/year`,
			actual: `${i.emergencyFoodFamilies.actual} families in 2024`,
			status: "on-track",
			actualValue: i.emergencyFoodFamilies.actual,
			targetValue: i.emergencyFoodFamilies.target,
		},
	];
}

export function impactMetricsFor(locale: Locale): ImpactMetric[] {
	const f = IMPACT_FACTS;
	const prefix = locale === "fr" ? "/fr" : "";
	if (locale === "fr") {
		return [
			{
				label: "Dossiers de projets documentés",
				value: String(f.documentedProjects),
				period: "Archives 2021-2025",
				measurement: "Field records",
				cadence: "Annuel",
				source: "Bibliothèque de documents de projet",
				sourceUrl: `${prefix}/resources#project-documents`,
				note: "Chaque projet archivé inclut les termes, finances et rapports disponibles.",
			},
			{
				label: "Femmes documentées générant un revenu",
				value: String(f.womenEarningIncome),
				period: "Cohortes de formation terminées",
				measurement: "Measured",
				cadence: "Après clôture de cohorte",
				source: "Rapports de formation professionnelle",
				sourceUrl:
					"/docs/projects/young-women-skills-training-program/report.pdf",
				note: `Combine ${f.indicators.widowsIndependence.actual} diplômées veuves et ${f.indicators.womenVocational.earning} jeunes femmes diplômées documentées comme générant un revenu.`,
			},
			{
				label: "Cohorte scolaire suivie",
				value: `${f.educationCohortRetained} maintenus et admis`,
				period: "Année scolaire 2023-2024",
				measurement: "Measured",
				cadence: "Clôture d'année scolaire",
				source: "Rapport du projet rentrée scolaire",
				sourceUrl: "/docs/projects/back-to-school-drive-2023/report.pdf",
				note: `La cohorte Bamenda 2023 documente inscription, maintien et réussite de fin d'année pour ${f.educationCohortRetained} enfants.`,
			},
			{
				label: "Portée de l'aide alimentaire d'urgence",
				value: `${f.emergencyFoodFamilies} familles / ${f.emergencyFoodPeople}+ personnes`,
				period: "Projet 2024",
				measurement: "Field records",
				cadence: "Clôture de projet",
				source: "Rapport d'aide alimentaire d'urgence",
				sourceUrl:
					"/docs/projects/emergency-food-relief-bamenda-crisis/report.pdf",
				note: "Compte les ménages atteints pendant le cycle de secours de trois mois.",
			},
			{
				label: "Objectif d'allocation aux programmes",
				value: `${f.programAllocationPct}%`,
				period: "Modèle public actuel",
				measurement: "Estimated",
				cadence: "Annuel",
				source: "Page de transparence et politique financière",
				sourceUrl: `${prefix}/transparency`,
				note: "Objectif public de gestion responsable, pas un ratio de dépenses audité.",
			},
		];
	}

	return [
		{
			label: "Documented project records",
			value: String(f.documentedProjects),
			period: "2021-2025 archive",
			measurement: "Field records",
			cadence: "Annual",
			source: "Project document library",
			sourceUrl: `${prefix}/resources#project-documents`,
			note: "Each archived project includes available terms, financials, and close-out records.",
		},
		{
			label: "Women documented earning income",
			value: String(f.womenEarningIncome),
			period: "Completed training cohorts",
			measurement: "Measured",
			cadence: "After cohort close-out",
			source: "Vocational training reports",
			sourceUrl:
				"/docs/projects/young-women-skills-training-program/report.pdf",
			note: `Combines ${f.indicators.widowsIndependence.actual} widow training graduates and ${f.indicators.womenVocational.earning} young women skills-training graduates documented as earning income.`,
		},
		{
			label: "Tracked education cohort",
			value: `${f.educationCohortRetained} retained and passed`,
			period: "2023-2024 school year",
			measurement: "Measured",
			cadence: "School-year close-out",
			source: "Back-to-school project report",
			sourceUrl: "/docs/projects/back-to-school-drive-2023/report.pdf",
			note: `The Bamenda 2023 cohort documented enrollment, retention, and end-of-year pass results for ${f.educationCohortRetained} children.`,
		},
		{
			label: "Emergency food relief reach",
			value: `${f.emergencyFoodFamilies} families / ${f.emergencyFoodPeople}+ people`,
			period: "2024 project",
			measurement: "Field records",
			cadence: "Project close-out",
			source: "Emergency food relief report",
			sourceUrl:
				"/docs/projects/emergency-food-relief-bamenda-crisis/report.pdf",
			note: "Counts households reached during the three-month relief cycle.",
		},
		{
			label: "Program delivery allocation target",
			value: `${f.programAllocationPct}%`,
			period: "Current public allocation model",
			measurement: "Estimated",
			cadence: "Annual",
			source: "Transparency page and financial policy",
			sourceUrl: `${prefix}/transparency`,
			note: "A public allocation target for stewardship, not an audited expense ratio.",
		},
	];
}
