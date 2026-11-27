import publishedReviews from "../../content/year-in-review.json";
import { annualReportPdfs } from "../data/organization";
import type { Locale } from "../i18n";

export const publishedYearInReviews = publishedReviews
  .map(({ year }) => ({ year, href: `/docs/year-in-review/ADA-${year}-Year-in-Review.pdf` }))
  .sort((a, b) => b.year - a.year);

export const historicAnnualReports = annualReportPdfs
  .map(({ year, path }) => ({ year: Number(year), href: path }))
  .sort((a, b) => b.year - a.year);

export const yearInReviewForYear = (year: number) =>
  publishedYearInReviews.find((review) => review.year === year);

export const historicAnnualReportForYear = (year: number) =>
  historicAnnualReports.find((report) => report.year === year);

export function annualPublicationLabels(locale: Locale) {
  return locale === "fr" ? {
    heading: "Publications annuelles",
    intro: "Retrouvez les temps forts de nos actions dans les bilans annuels bilingues. Ces bilans ne sont pas des états financiers.",
    historicHeading: "Rapport annuel historique",
    historicNote: "Ce document rétrospectif n’est pas un état financier vérifié de manière indépendante.",
    historicLink: (year: number) => `Rapport annuel ${year} (PDF en anglais)`,
    reviewLink: (year: number) => `Bilan ${year} (PDF bilingue)`,
    transparency: "Transparence et responsabilité",
  } : {
    heading: "Annual Publications",
    intro: "Find highlights from our outreaches in these bilingual yearly reviews. These reviews are not financial statements.",
    historicHeading: "Historical annual report",
    historicNote: "This retrospective document is not an independently verified annual financial statement.",
    historicLink: (year: number) => `${year} Annual Report (PDF in English)`,
    reviewLink: (year: number) => `${year} Year in Review (bilingual PDF)`,
    transparency: "Transparency & Accountability",
  };
}
