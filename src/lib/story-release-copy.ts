import storyReleaseCopy from "./story-release-copy.json";

export type StoryReleaseLocale = "en" | "fr";
export type StoryReleaseEntry = (typeof storyReleaseCopy)[keyof typeof storyReleaseCopy];

export const STORY_RELEASE_ORDER = [
	"founder-letter-2026",
	"5-ways-to-support-free",
	"meet-esther-skills-training",
	"clean-water-first-well-completed",
	"fabrice-teenage-mentor",
	"donations-changed-lives-2024",
	"carine-graduate-to-mentor",
	"transparency-report-2024",
	"grace-journey-recipient-to-trainer",
	"david-missed-year-of-school",
	"back-to-school-2025",
	"ndongo-family-emergency-relief",
	"community-cleanup-bamenda-2025",
	"amina-almost-child-bride",
	"hospital-visits-bringing-hope",
	"mama-rose-grandchildren",
	"why-we-focus-on-widows",
	"christmas-giving-2024",
] as const;

export const STORY_RELEASE_COPY = storyReleaseCopy;
export type StoryReleaseSlug = keyof typeof STORY_RELEASE_COPY;

export function getStoryReleaseCopy(slug: string, locale: StoryReleaseLocale) {
	if (!Object.hasOwn(STORY_RELEASE_COPY, slug)) return null;
	return STORY_RELEASE_COPY[slug as StoryReleaseSlug][locale];
}
