import type { StoryReleaseSlug } from "./story-release-copy";

export const STORY_RELEASE_HERO_IMAGE =
	"https://cdn.sanity.io/images/rj2m21gk/production/02bd09413bd429a7cb9677a9368392642774671e-800x600.jpg";

export const ESTHER_PORTRAIT_IMAGE =
	"https://cdn.sanity.io/images/rj2m21gk/production/255a7b15b034d55c285edda099d7d1555b5ab347-600x900.jpg?w=400&auto=format";

export const STORY_CATEGORY_LABELS = {
	story: { en: "Stories", fr: "Histoires" },
	update: { en: "Updates", fr: "Actualités" },
	announcement: { en: "Announcements", fr: "Annonces" },
} as const;

export type StoryCategory = keyof typeof STORY_CATEGORY_LABELS;

// Verified against the original CMS categories; only the category field is carried over.
export const STORY_CATEGORY_BY_SLUG: Record<StoryReleaseSlug, StoryCategory> = {
	"amina-almost-child-bride": "story",
	"carine-graduate-to-mentor": "story",
	"david-missed-year-of-school": "story",
	"fabrice-teenage-mentor": "story",
	"grace-journey-recipient-to-trainer": "story",
	"hospital-visits-bringing-hope": "story",
	"mama-rose-grandchildren": "story",
	"meet-esther-skills-training": "story",
	"ndongo-family-emergency-relief": "story",
	"why-we-focus-on-widows": "story",
	"back-to-school-2025": "update",
	"christmas-giving-2024": "update",
	"community-cleanup-bamenda-2025": "update",
	"donations-changed-lives-2024": "update",
	"5-ways-to-support-free": "announcement",
	"founder-letter-2026": "announcement",
	"transparency-report-2024": "announcement",
};
