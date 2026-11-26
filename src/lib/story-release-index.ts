import type { StoryReleaseSlug } from "./story-release-copy";

export const STORY_RELEASE_HERO_IMAGE =
	"https://cdn.sanity.io/images/rj2m21gk/production/02bd09413bd429a7cb9677a9368392642774671e-800x600.jpg";

export const ESTHER_PORTRAIT_IMAGE =
	"https://cdn.sanity.io/images/rj2m21gk/production/255a7b15b034d55c285edda099d7d1555b5ab347-600x900.jpg?w=400&auto=format";

export const STORY_CATEGORY_LABELS = {
	story: { en: "Stories", fr: "Histoires" },
	update: { en: "Updates", fr: "Actualités" },
	perspective: { en: "Program perspectives", fr: "Réflexions sur nos programmes" },
} as const;

export type StoryCategory = keyof typeof STORY_CATEGORY_LABELS;

// Editorial categories for approved public copy; older CMS categories do not establish a verified person or event.
export const STORY_CATEGORY_BY_SLUG: Record<StoryReleaseSlug, StoryCategory> = {
	"young-peoples-futures": "perspective",
	"next-steps-after-training": "perspective",
	"keeping-learning-within-reach": "perspective",
	"a-place-to-learn": "perspective",
	"learning-and-sharing-a-craft": "perspective",
	"hospital-visits-bringing-hope": "perspective",
	"supporting-caregivers": "perspective",
	"salon-update": "story",
	"household-emergency-support": "perspective",
	"why-we-focus-on-widows": "perspective",
	"back-to-school-2025": "perspective",
	"christmas-giving-2024": "perspective",
	"community-cleanup-bamenda-2025": "perspective",
	"donations-changed-lives-2024": "update",
	"5-ways-to-support-free": "perspective",
	"founder-letter-2026": "perspective",
	"transparency-report-2024": "update",
};
