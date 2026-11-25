import { archivePublished2026Finance, archivePublishedBudgetFcfa, formatArchiveFcfa } from "./archive-project-document-links";
import type { ProjectPresentationLocale } from "./project-detail-presentation";

type Basis = "budget" | "cash-in-kind-budget" | "written-budget" | "funds-sent" | "reported-funds" | "worksheet-budget" | "calculated-worksheet-budget" | "working-cost-list";
type Year = 2021 | 2022 | 2023 | 2024 | 2025;
type Figure = { year: Year; month: string; fcfa: number; basis: Basis; approximateFcfa?: boolean };

// From the published project report and its financial basis, not the old USD goals,
// public caps or amounts spent. Christmas 2023 budget is also confirmed in its
// approved 2024 successor's report. An amount sent is not an approved budget.
const historical: Readonly<Record<string, Figure | undefined>> = {
  "first-widow-home-visits-2021": { year: 2021, month: "2021-11", fcfa: 120000, basis: "reported-funds" },
  "school-supply-distribution-feb-2022": { year: 2022, month: "2022-02", fcfa: 215000, basis: "funds-sent" },
  "widow-support-food-cash-mar-2022": { year: 2022, month: "2022-03", approximateFcfa: true, fcfa: 220000, basis: "reported-funds" },
  "school-visit-may-2022": { year: 2022, month: "2022-05", fcfa: 180000, basis: "cash-in-kind-budget" },
  "idp-girls-baking-training-jul-2022": { year: 2022, month: "2022-07", fcfa: 342750, basis: "written-budget" },
  "back-to-school-sep-2022": { year: 2022, month: "2022-08", fcfa: 220000, basis: "funds-sent" },
  "christmas-giving-dec-2022": { year: 2022, month: "2022-12", fcfa: 360000, basis: "reported-funds" },
  "youth-day-snacks-feb-2023": { year: 2023, month: "2023-02", fcfa: 50000, basis: "funds-sent" },
  "mountain-race-outreach-feb-2023": { year: 2023, month: "2023-02", fcfa: 50000, basis: "funds-sent" },
  "womens-day-home-visits-mar-2023": { year: 2023, month: "2023-03", fcfa: 250000, basis: "budget" },
  "city-cleanup-may-2023": { year: 2023, month: "2023-04", fcfa: 100000, basis: "funds-sent" },
  "back-to-school-drive-2023": { year: 2023, month: "2023-08", fcfa: 240000, basis: "budget" },
  "girls-day-oct-2023": { year: 2023, month: "2023-10", fcfa: 150000, basis: "funds-sent" },
  "christmas-giving-dec-2023": { year: 2023, month: "2023-12", fcfa: 260000, basis: "budget" },
  // Original 2025 worksheets; no actual expenditures are established by these records.
  "womens-day-widows-outreach-2025": { year: 2025, month: "2025-03", fcfa: 240000, basis: "calculated-worksheet-budget" },
  "prenatal-care-support-program": { year: 2025, month: "2025-03", fcfa: 150000, basis: "budget" },
  "city-cleanup-may-2025": { year: 2025, month: "2025-05", fcfa: 50000, basis: "budget", approximateFcfa: true },
  "back-to-school-buea-2025": { year: 2025, month: "2025-08", fcfa: 102600, basis: "worksheet-budget" },
  "back-to-school-bamenda-aug-2025": { year: 2025, month: "2025-08", fcfa: 151000, basis: "worksheet-budget" },
  "christmas-orphanage-outreach-2025": { year: 2025, month: "2025-12", fcfa: 119500, basis: "working-cost-list" },
};

// BEAC peg and Federal Reserve G.5 source for historical monthly USD estimates.
export const archiveExchangeRateSource = "https://fred.stlouisfed.org/data/exuseu";
export const archiveExchangePegSource = "https://www.beac.int/faqs";
const fcfaPerEuro = 655.957;
const usdPerEuroMonth: Readonly<Record<string, number | undefined>> = {
  "2021-11": 1.1416,
  "2022-02": 1.1349,
  "2022-03": 1.1019,
  "2022-05": 1.0567,
  "2022-07": 1.0168,
  "2022-08": 1.0129,
  "2022-12": 1.0591,
  "2023-02": 1.0702,
  "2023-03": 1.0711,
  "2023-04": 1.0962,
  "2023-08": 1.0910,
  "2023-10": 1.0565,
  "2023-12": 1.0909,
  "2024-08": 1.1020,
  "2024-10": 1.0895,
  "2024-12": 1.0472,
  "2025-03": 1.0813,
  "2025-05": 1.1274,
  "2025-08": 1.1647,
  "2025-12": 1.1710,
};
const released2024Months: Readonly<Record<string, string | undefined>> = {
  "back-to-school-buea-2024": "2024-08",
  "girls-programme-2024": "2024-10",
  "christmas-giving-dec-2024": "2024-12",
};

const labels: Record<Basis, Record<ProjectPresentationLocale, string>> = {
  budget: { en: "Budget", fr: "Budget" },
  "cash-in-kind-budget": { en: "Budget (cash and in-kind)", fr: "Budget (espèces et apports en nature)" },
  "written-budget": { en: "Written budget", fr: "Budget écrit" },
  "funds-sent": { en: "Funds sent", fr: "Fonds envoyés" },
  "reported-funds": { en: "Reported funding", fr: "Fonds déclarés" },
  "worksheet-budget": { en: "Budget from worksheet", fr: "Budget d’après la fiche" },
  "calculated-worksheet-budget": { en: "Budget calculated from worksheet", fr: "Budget calculé d’après la fiche" },
  "working-cost-list": { en: "Working cost list", fr: "Liste de coûts de travail" },
};

export function formatArchiveCardFinances(record: Parameters<typeof archivePublishedBudgetFcfa>[0], locale: ProjectPresentationLocale) {
  const released = archivePublished2026Finance(record);
  if (released) {
    const fr = locale === "fr";
    const label = released.budgetApproximate
      ? fr ? "Budget prévisionnel des fournitures" : "Proposed supplies budget"
      : released.outreachCategory === "education"
        ? fr ? "Budget d’aide aux frais de scolarité" : "School-fee support budget"
        : fr ? "Budget de travail révisé" : "Revised working budget";
    const prefix = released.budgetApproximate ? (fr ? "env. " : "approx. ") : "";
    return { year: 2026 as const, month: released.date.slice(0, 7), fcfa: released.budgetFcfa, basis: "budget" as const, label, text: prefix + formatArchiveFcfa(released.budgetFcfa, locale) };
  }
  const published = archivePublishedBudgetFcfa(record);
  const known = historical[record.slug.current];
  const publishedMonth = released2024Months[record.slug.current];
  const source: Figure | undefined = published !== undefined && record.year === 2024 && publishedMonth
    ? { year: 2024, month: publishedMonth, fcfa: published, basis: "budget" }
    : known?.year === record.year ? known : undefined;
  if (!source) return undefined;
  const rate = usdPerEuroMonth[source.month];
  if (!rate) throw new Error(`Missing archive exchange rate for ${source.month}`);
  const USD = Math.round(source.fcfa / fcfaPerEuro * rate);
  const displayUsd = new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US").format(USD);
  const usd = locale === "fr" ? `env. ${displayUsd} USD` : `approx. ${displayUsd} USD`;
  const localApprox = source.approximateFcfa ? (locale === "fr" ? "env. " : "approx. ") : "";
  return { ...source, usd: USD, label: labels[source.basis][locale], text: `${localApprox}${formatArchiveFcfa(source.fcfa, locale)} (${usd})` };
}
