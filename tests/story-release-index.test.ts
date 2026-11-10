import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
	STORY_RELEASE_HERO_IMAGE,
	STORY_CATEGORY_BY_SLUG,
	STORY_CATEGORY_LABELS,
} from "../src/lib/story-release-index";
import { STORY_RELEASE_COPY } from "../src/lib/story-release-copy";

describe("safe Story categories and hero presentation", () => {
	it("matches the verified CMS categories for all approved safe-copy records", () => {
		expect(new Set(Object.keys(STORY_CATEGORY_BY_SLUG))).toEqual(
			new Set(Object.keys(STORY_RELEASE_COPY)),
		);
		expect(Object.values(STORY_CATEGORY_BY_SLUG).filter((category) => category === "story")).toHaveLength(10);
		expect(Object.values(STORY_CATEGORY_BY_SLUG).filter((category) => category === "update")).toHaveLength(4);
		expect(Object.values(STORY_CATEGORY_BY_SLUG).filter((category) => category === "announcement")).toHaveLength(3);
		const members = (category: string) => Object.keys(STORY_CATEGORY_BY_SLUG)
			.filter((slug) => STORY_CATEGORY_BY_SLUG[slug as keyof typeof STORY_CATEGORY_BY_SLUG] === category)
			.sort();
		expect(members("story")).toEqual([
			"amina-almost-child-bride", "carine-graduate-to-mentor", "david-missed-year-of-school",
			"fabrice-teenage-mentor", "grace-journey-recipient-to-trainer", "hospital-visits-bringing-hope",
			"mama-rose-grandchildren", "meet-esther-skills-training", "ndongo-family-emergency-relief", "why-we-focus-on-widows",
		].sort());
		expect(members("update")).toEqual([
			"back-to-school-2025", "christmas-giving-2024", "community-cleanup-bamenda-2025", "donations-changed-lives-2024",
		].sort());
		expect(members("announcement")).toEqual([
			"5-ways-to-support-free", "founder-letter-2026", "transparency-report-2024",
		].sort());
	});

	it("provides bilingual labels for the verified category controls", () => {
		for (const labels of Object.values(STORY_CATEGORY_LABELS)) {
			expect(labels.en.trim()).not.toBe("");
			expect(labels.fr.trim()).not.toBe("");
		}
		expect(STORY_CATEGORY_LABELS.story.fr).toBe("Histoires");
		expect(STORY_CATEGORY_LABELS.update.fr).toBe("Actualités");
		expect(STORY_CATEGORY_LABELS.announcement.fr).toBe("Annonces");
	});

	it("uses only the approved cleanup photograph as a decorative split Stories hero", () => {
		expect(STORY_RELEASE_HERO_IMAGE).toBe(
			"https://cdn.sanity.io/images/rj2m21gk/production/02bd09413bd429a7cb9677a9368392642774671e-800x600.jpg",
		);
		const pageHero = readFileSync(resolve("src/components/layout/PageHero.astro"), "utf8");
		const englishIndex = readFileSync(resolve("src/pages/stories/index.astro"), "utf8");
		const frenchIndex = readFileSync(resolve("src/pages/fr/stories/index.astro"), "utf8");
		const verifier = readFileSync(resolve("scripts/verify-story-review-mode.mjs"), "utf8");
		const helper = readFileSync(resolve("scripts/story-hero-verifier.mjs"), "utf8");
		expect(pageHero).toContain('alt={imageDecorative ? "" : imageAlt || title}');
		expect(pageHero).toContain('imageLayout === "side"');
		expect(pageHero).toContain("lg:object-contain");
		expect(englishIndex).toContain("imageDecorative imageLayout=\"side\"");
		expect(frenchIndex).toContain("imageDecorative imageLayout=\"side\"");
		expect(verifier).toContain("assertApprovedStoryHero");
		expect(helper).toContain("exactly one approved hero image");
		expect(helper).toContain("02bd09413bd429a7cb9677a9368392642774671e-800x600.jpg");
		expect(helper).toContain("255a7b15b034d55c285edda099d7d1555b5ab347-600x900.jpg");
		expect(verifier).toContain("Story should remain noindex pending owner fact review");
	});

	it("rejects duplicate heroes, wrong locations or queries, and other Sanity images", async () => {
		const { assertApprovedStoryHero, assertApprovedEstherPortrait, APPROVED_STORY_HERO, APPROVED_ESTHER_PORTRAIT } = await import("../scripts/story-hero-verifier.mjs");
		const tag = (src = APPROVED_STORY_HERO) => `<img src="${src.replaceAll("&", "&amp;")}" alt="" aria-hidden="true">`;
		const esther = `<img src="${APPROVED_ESTHER_PORTRAIT.replaceAll("&", "&amp;")}" alt="Portrait of Esther">`;
		// Astro production HTML emits alt="" as the minimized empty alt attribute `alt`.
		const renderedTag = `<img src="${APPROVED_STORY_HERO.replaceAll("&", "&amp;")}" alt aria-hidden="true" class="absolute object-cover inset-y-0 right-0 h-full w-full object-center lg:left-auto lg:w-auto lg:object-contain" loading="eager">`;
		const validIndex = (addition = "") => `${addition}<section class="relative overflow-hidden text-white py-20 md:py-28">${renderedTag}</section><a href="/stories/meet-esther-skills-training">${esther}</a>`;
		const good = validIndex();
		assertApprovedStoryHero(good, "test");
		assertApprovedEstherPortrait(`<article>${esther}</article>`, "en", "article");
		expect(() => assertApprovedEstherPortrait(`<article>${esther}</article>`, "fr", "article")).toThrow(/localized alt/);
		expect(() => assertApprovedEstherPortrait(`<article>${esther}</article>`, "en", null)).toThrow(/unauthorized/);
		expect(() => assertApprovedEstherPortrait("<article>No portrait</article>", "en", "article")).toThrow(/exactly one/);
		expect(() => assertApprovedStoryHero(good.replace('alt aria-hidden', 'alt="A photo" aria-hidden'), "test")).toThrow(/exact empty alt/);
		expect(() => assertApprovedStoryHero(good.replace(renderedTag, `<img data-src="${APPROVED_STORY_HERO}" alt aria-hidden="true">`), "test")).toThrow(/exactly one approved hero/);
		expect(() => assertApprovedStoryHero(good.replace(renderedTag, `<img src="${APPROVED_STORY_HERO}" data-alt="" aria-hidden="true">`), "test")).toThrow(/exact empty alt/);
		expect(() => assertApprovedStoryHero(good.replace(renderedTag, `<img src="${APPROVED_STORY_HERO}" src="${APPROVED_STORY_HERO}" alt aria-hidden="true">`), "test")).toThrow(/Duplicate HTML attribute 'src'/);
		expect(() => assertApprovedStoryHero(good.replace(renderedTag, renderedTag.replace('aria-hidden="true"', 'aria-hidden="true" data-src="https://example.test/fake.jpg"')), "test")).toThrow(/Unexpected image source attribute 'data-src'/);
		expect(() => assertApprovedStoryHero(good.replace(renderedTag, renderedTag.replace('aria-hidden="true"', 'aria-hidden="true" srcset="https://example.test/fake.jpg 2x"')), "test")).toThrow(/Unexpected image source attribute 'srcset'/);
		expect(() => assertApprovedEstherPortrait(`<article>${esther.replace('alt="Portrait of Esther"', 'data-alt="Portrait of Esther"')}</article>`, "en", "article")).toThrow(/neutral localized alt/);
		expect(() => assertApprovedEstherPortrait(`<article>${esther.replace('alt="Portrait of Esther"', 'alt="Portrait of Esther" alt="Portrait of Esther"')}</article>`, "en", "article")).toThrow(/Duplicate HTML attribute 'alt'/);
		expect(() => assertApprovedStoryHero(`<section class="relative overflow-hidden text-white">${tag()}${tag()}</section>`, "test")).toThrow(/exactly one/);
		expect(() => assertApprovedStoryHero(`<div>${tag()}</div>`, "test")).toThrow(/PageHero section/);
		expect(() => assertApprovedStoryHero(`<section class="relative overflow-hidden text-white">${tag(`${APPROVED_STORY_HERO}&crop=center`)}</section>`, "test")).toThrow(/exactly one approved hero/);
		expect(() => assertApprovedStoryHero(validIndex(`<img src="https://cdn.sanity.io/images/rj2m21gk/production/other.jpg" alt="x">`), "test")).toThrow(/Unapproved Story <img> source/);
		expect(() => assertApprovedStoryHero(validIndex(`<img src="https://images.example.test/photo.jpg" alt="x">`), "test")).toThrow(/Unapproved Story <img> source/);
		expect(() => assertApprovedStoryHero(validIndex(`<meta property="og:image" content="https://cdn.sanity.io/images/rj2m21gk/production/other.jpg">`), "test")).toThrow(/Unapproved image metadata/);
		expect(() => assertApprovedStoryHero(validIndex(`<meta property="og:image" content="https://images.example.test/photo.jpg">`), "test")).toThrow(/Unapproved image metadata/);
		expect(() => assertApprovedStoryHero(validIndex(`<source srcset="https://cdn.sanity.io/images/rj2m21gk/production/other.jpg 2x">`), "test")).toThrow(/Unexpected <source>/);
		expect(() => assertApprovedStoryHero(validIndex(`<div data-background="https://cdn.sanity.io/images/rj2m21gk/production/other.jpg"></div>`), "test")).toThrow(/Unapproved image reference/);
		expect(() => assertApprovedStoryHero(validIndex(`<div data-background="https://images.example.test/assets/opaque-id"></div>`), "test")).toThrow(/Unapproved image reference/);
		expect(() => assertApprovedStoryHero(validIndex(`<div data-background="${APPROVED_STORY_HERO}"></div>`), "test")).toThrow(/Unapproved image reference/);
		expect(() => assertApprovedStoryHero(validIndex(`<div style="background-image: url('https://images.example.test/assets/opaque-id')"></div>`), "test")).toThrow(/Unapproved image reference/);
		expect(() => assertApprovedStoryHero(validIndex(`<div style="background-image: url('${APPROVED_STORY_HERO}')"></div>`), "test")).toThrow(/Unapproved image reference/);
		expect(() => assertApprovedStoryHero(validIndex(`<style>.campaign { background: url(https://images.example.test/assets/opaque-id) center / cover }</style>`), "test")).toThrow(/Unapproved image reference/);
		expect(() => assertApprovedStoryHero(validIndex(`<a href="https://example.test/projects/opaque-id">Read more</a><div style="color: #14532d; background-color: white"></div>`), "test")).not.toThrow();
	});

	it("keeps the filters progressively enhanced and announces changed result counts", () => {
		const index = readFileSync(resolve("src/components/stories/StoryReleaseIndex.astro"), "utf8");
		expect(index).toContain('role="group"');
		expect(index).toContain('aria-pressed=');
		expect(index).toContain('aria-live="polite"');
		expect(index).toContain('data-story-category={category}');
		expect(index).toContain("storyFilterAnnouncement(visibleCount, locale)");
		expect(index).toContain('.story-filter[aria-pressed="true"]');
		expect(index).toContain('content: "✓"');
		expect(index).toContain('all: "All"');
		expect(index).toContain('all: "Tous"');
		expect(index).toContain('{ id: "all", label: strings.all }');
		expect(index).toContain("Object.entries(STORY_CATEGORY_LABELS)");
		expect(index).toContain("STORY_CATEGORY_LABELS");
	});

	it("removes blanket disclaimers while retaining the precise financial review notices", () => {
		const index = readFileSync(resolve("src/components/stories/StoryReleaseIndex.astro"), "utf8");
		const detail = readFileSync(resolve("src/components/stories/StoryReleaseDetail.astro"), "utf8");
		const notice = readFileSync(resolve("src/lib/story-review-notice.ts"), "utf8");
		expect(index).not.toMatch(/Most articles below discuss general themes|thèmes généraux.*témoignages individuels vérifiés/i);
		expect(detail).not.toMatch(/This page discusses a general theme|Cette page présente un thème général|not a verified individual case study/i);
		expect(detail).toContain('STORY_RELEASE_COPY[slug as StoryReleaseSlug].type === "review"');
		expect(notice).toMatch(/2024 financial summary and 2024 donations summary remain under review/);
		expect(notice).toMatch(/synthèse financière 2024 et la synthèse des dons 2024/);
	});

	it("puts an accessible return link above each article", () => {
		const detail = readFileSync(resolve("src/components/stories/StoryReleaseDetail.astro"), "utf8");
		expect(detail.indexOf("copyMeta.back")).toBeLessThan(detail.indexOf("<PageHero"));
		expect(detail).toContain('href={localePath("/stories", locale)}');
		expect(detail).toContain('aria-label={locale === "fr" ? "Navigation de l’article" : "Article navigation"}');
		expect(detail).toContain("min-h-11");
	});
});
