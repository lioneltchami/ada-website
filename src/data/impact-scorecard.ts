import { type ImpactMetric, impactMetricsFor } from "./impact";

export type { ImpactMetric };

export const impactScorecardUpdated = "May 2026";

export const impactMetricsEn = impactMetricsFor("en");
export const impactMetricsFr = impactMetricsFor("fr");

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
