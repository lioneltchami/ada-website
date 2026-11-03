import type { ContentLocale } from "./sanity-locale";

export type StoryReviewVariant = "index" | "detail" | "featured";

const COPY = {
	en: {
		indexPageTitle: "Stories & Updates",
		indexPageDescription:
			"ADA is reviewing its English and French story pages.",
		indexHeroSubtitle:
			"Our English and French story text is being reviewed.",
		indexTitle: "Stories are temporarily unavailable",
			indexMessage:
				"ADA is reviewing the English and French versions. Please check back later.",
		detailTitle: "Story details are being updated",
		detailDescription:
			"This story is temporarily unavailable while ADA reviews its English and French versions.",
		detailNoticeTitle: "Story under review",
		detailNoticeMessage:
			"This story is temporarily unavailable while ADA reviews its English and French text.",
		detailBackLink: "Back to Stories & Updates →",
		featuredLabel: "Stories & updates",
		featuredTitle: "Explore our program perspectives",
		featuredMessage:
			"These bilingual articles discuss general support themes, not verified individual case reports. ADA’s two financial summaries remain under review.",
		featuredLink: "Stories and updates →",
		home: "Home",
		stories: "Stories & Updates",
		projects: "Explore projects",
		contact: "Contact ADA",
		donate: "Donate",
	},
	fr: {
		indexPageTitle: "Témoignages & Actualités",
		indexPageDescription:
			"ADA vérifie actuellement ses récits en anglais et en français.",
		indexHeroSubtitle:
			"Les textes des récits en anglais et en français sont en cours de vérification.",
		indexTitle: "Les récits sont temporairement indisponibles",
		indexMessage:
			"ADA vérifie les versions anglaise et française. Veuillez revenir plus tard.",
		detailTitle: "Les détails du récit sont en cours de mise à jour",
		detailDescription:
			"Ce récit est temporairement indisponible pendant la vérification de ses versions anglaise et française par ADA.",
		detailNoticeTitle: "Récit en cours de vérification",
		detailNoticeMessage:
			"Ce récit est temporairement indisponible pendant qu’ADA vérifie ses versions anglaise et française.",
		detailBackLink: "Retour aux témoignages et actualités →",
		featuredLabel: "Témoignages et actualités",
		featuredTitle: "Découvrir nos perspectives sur les programmes",
		featuredMessage:
			"Ces articles bilingues présentent des thèmes généraux de soutien, et non des témoignages individuels vérifiés. Les deux synthèses financières d’ADA restent en cours de vérification.",
		featuredLink: "Témoignages et actualités →",
		home: "Accueil",
		stories: "Témoignages & Actualités",
		projects: "Découvrir les projets",
		contact: "Contacter ADA",
		donate: "Faire un don",
	},
} as const;

export function getStoryReviewCopy(locale: ContentLocale) {
	return COPY[locale];
}
