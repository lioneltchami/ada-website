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
	communitiesServed: 5,
	yearsOfService: 5,
	programAllocationPct: 80,
	programOperationsPct: 15,
	administrationPct: 5,
} as const;

export function homepageStatsFallback(
	locale: Locale = "en",
): { value: string; label: string }[] {
	const f = IMPACT_FACTS;
	if (locale === "fr") {
		return [
			{ value: String(f.communitiesServed), label: "Communautés servies" },
			{ value: String(f.yearsOfService), label: "Années de service" },
		];
	}
	return [
		{ value: String(f.communitiesServed), label: "Communities Served" },
		{ value: String(f.yearsOfService), label: "Years of Service" },
	];
}

/** Sanity seed / CMS should mirror these homepage counters. */
export function sanityImpactMetricSeed() {
	const f = IMPACT_FACTS;
	return [
		{
			_id: "metric-communities",
			label: "Communities Served",
			value: f.communitiesServed,
			suffix: "",
			displayOrder: 2,
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

/** No tracked outcome indicators currently have a publishable source. */
export function measurableIndicatorsFor(_locale: Locale): MeasurableIndicator[] {
	return [];
}

export function impactMetricsFor(locale: Locale): ImpactMetric[] {
	const f = IMPACT_FACTS;
	const prefix = locale === "fr" ? "/fr" : "";
	if (locale === "fr") {
		return [
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
