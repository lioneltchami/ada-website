import storyReleaseCopy from "./story-release-copy.json";

export type StoryReleaseLocale = "en" | "fr";
export type StoryReleaseEntry = (typeof storyReleaseCopy)[keyof typeof storyReleaseCopy];

export const STORY_RELEASE_ORDER = [
	"bamenda-school-fee-outreach-2026",
	"founder-letter-2026",
	"5-ways-to-support-free",
	"salon-update",
	"a-place-to-learn",
	"donations-changed-lives-2024",
	"next-steps-after-training",
	"transparency-report-2024",
	"learning-and-sharing-a-craft",
	"keeping-learning-within-reach",
	"household-emergency-support",
	"community-cleanup-bamenda-2025",
	"young-peoples-futures",
	"hospital-visits-bringing-hope",
	"supporting-caregivers",
	"why-we-focus-on-widows",
	"christmas-giving-2024",
] as const;

export const STORY_RELEASE_COPY = storyReleaseCopy;
export type StoryReleaseSlug = keyof typeof STORY_RELEASE_COPY;

export function getStoryReleaseCopy(slug: string, locale: StoryReleaseLocale) {
	if (!Object.hasOwn(STORY_RELEASE_COPY, slug)) return null;
	return STORY_RELEASE_COPY[slug as StoryReleaseSlug][locale];
}
