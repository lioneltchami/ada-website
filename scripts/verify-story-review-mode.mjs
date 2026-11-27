import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import {
	assertApprovedStoryHero,
	assertApprovedEstherPortrait,
	assertNoUnapprovedImageReferences,
} from "./story-hero-verifier.mjs";

const client = path.resolve("dist/client");
const storyRoot = path.join(client, "stories");

async function htmlFiles(directory) {
	const entries = await readdir(directory, { withFileTypes: true });
	const files = [];
	for (const entry of entries) {
		const entryPath = path.join(directory, entry.name);
		if (entry.isDirectory()) files.push(...(await htmlFiles(entryPath)));
		else if (entry.isFile() && entry.name.endsWith(".html")) files.push(entryPath);
	}
	return files;
}

const route = (locale, slug) => path.join(client, locale === "fr" ? "fr/stories" : "stories", slug, "index.html");
const enIndex = await readFile(path.join(client, "stories/index.html"), "utf8");
const frIndex = await readFile(path.join(client, "fr/stories/index.html"), "utf8");
assert.doesNotMatch(`${enIndex}${frIndex}`, /Most articles below discuss general themes|not verified individual case studies|ne décrivent pas des témoignages individuels vérifiés|ne sont pas des témoignages individuels vérifiés/i);
assert.equal((enIndex.match(/class="group block rounded-xl/g) || []).length, 15);
assert.equal((frIndex.match(/class="group block rounded-xl/g) || []).length, 15);
assert.equal((enIndex.match(/data-story-filter=/g) || []).length, 4);
assert.equal((frIndex.match(/data-story-filter=/g) || []).length, 4);
assert.match(enIndex, />All<span/);
assert.match(enIndex, />Stories<span/);
assert.match(enIndex, />Updates<span/);
assert.doesNotMatch(enIndex, /Financial notices|Financial summaries remain under review|data-story-category="finance"/i);
assert.match(enIndex, />Program perspectives<span/);
assert.match(frIndex, />Tous<span/);
assert.match(frIndex, />Histoires<span/);
assert.match(frIndex, />Actualités<span/);
assert.doesNotMatch(frIndex, /Notes financières|Les synthèses financières restent en cours de vérification|data-story-category="finance"/i);
assert.match(frIndex, />Réflexions sur nos programmes<span/);
assert.equal((enIndex.match(/data-story-category="story"/g) || []).length, 1);
assert.equal((frIndex.match(/data-story-category="story"/g) || []).length, 1);
assert.equal((enIndex.match(/data-story-category="update"/g) || []).length, 1);
assert.equal((frIndex.match(/data-story-category="update"/g) || []).length, 1);
for (const locale of ["en", "fr"]) {
	const update = await readFile(route(locale, "bamenda-school-fee-outreach-2026"), "utf8");
	assert.match(update, /href="(?:\/fr)?\/projects\/archive\/back-to-school-bamenda-aug-2026\/?"/);
	assert.doesNotMatch(update, /<article[^>]*>[\s\S]*?<img[^>]*>[\s\S]*?<\/article>/);
}
assert.equal((enIndex.match(/data-story-category="perspective"/g) || []).length, 13);
assert.equal((frIndex.match(/data-story-category="perspective"/g) || []).length, 13);
assert.match(enIndex, /aria-live="polite"/);
assert.match(frIndex, /aria-live="polite"/);
assertApprovedStoryHero(enIndex, "English");
assertApprovedStoryHero(frIndex, "French");
assert.doesNotMatch(`${enIndex}${frIndex}`, /\[[A-Z][A-Z0-9 _/-]*\]/);

for (const prefix of ["", "fr/"]) {
	const monthly = await readFile(path.join(client, prefix, "monthly/index.html"), "utf8");
	assert.equal((monthly.match(/<h1\b/g) || []).length, 1, "Monthly Giving has one page-level heading");
	const archive = await readFile(path.join(client, prefix, "projects/archive/index.html"), "utf8");
	assert.doesNotMatch(archive, /Marked complete|Dossiers marqués comme terminés/);
}

const enPages = (await htmlFiles(storyRoot)).filter((file) => file !== path.join(storyRoot, "index.html"));
const frPages = (await htmlFiles(path.join(client, "fr/stories"))).filter((file) => file !== path.join(client, "fr/stories/index.html"));
assert.equal(enPages.length, 15, `Expected 15 English routes, found ${enPages.length}`);
assert.equal(frPages.length, 15, `Expected 15 French routes, found ${frPages.length}`);

const retiredCaseRoutes = [
	"amina-almost-child-bride", "carine-graduate-to-mentor", "david-missed-year-of-school",
	"fabrice-teenage-mentor", "grace-journey-recipient-to-trainer", "mama-rose-grandchildren",
	"ndongo-family-emergency-relief", "meet-esther-skills-training", "back-to-school-2025",
];
for (const slug of retiredCaseRoutes) {
	assert.ok(![...enPages, ...frPages].some(file => path.basename(path.dirname(file)) === slug),
		"A retired case-story URL must not retain a public route.");
	assert.ok(!`${enIndex}${frIndex}`.includes(slug), "A retired case-story URL must not be linked.");
}

assert.doesNotMatch(`${enIndex}${frIndex}`, /clean-water-first-well-completed|water access and everyday life|accès à l’eau au quotidien/i);

const redirects = await readFile(path.join(client, "_redirects"), "utf8");
for (const [locale, prefix] of [["en", ""], ["fr", "/fr"]]) {
	const transparency = await readFile(path.join(client, prefix.slice(1), "transparency/index.html"), "utf8");
	assert.equal((transparency.match(/id="annual-financial-summary"/g) || []).length, 1);
	assert.match(transparency, locale === "en" ? /organization-wide donations and financial totals for 2024/ : /chiffres financiers de l’ensemble de l’association pour 2024/);
	for (const slug of ["donations-changed-lives-2024", "transparency-report-2024"]) {
		await assert.rejects(readFile(route(locale, slug), "utf8"), { code: "ENOENT" });
		for (const suffix of ["", "/"]) {
			assert.ok(redirects.includes(`${prefix}/stories/${slug}${suffix} ${prefix}/transparency/#annual-financial-summary 301`));
		}
	}
}

for (const [files, lang, locale] of [[enPages, "en", "English"], [frPages, "fr", "French"]]) {
	for (const file of files) {
		const html = await readFile(file, "utf8");
		const slug = path.basename(path.dirname(file));
		assert.match(html, new RegExp(`<html[^>]+lang="${lang}"`), `${locale} lang missing: ${file}`);
		assert.match(html, /<meta name="robots" content="noindex, follow"\s*\/?\s*>/,
			`${locale} Story should remain noindex pending owner fact review: ${file}`);
		assert.doesNotMatch(html, /BlogPosting|BreadcrumbList|article:published_time|og:type" content="article"|\[[A-Z][A-Z0-9 _/-]*\]/,
			`${locale} page contains original CMS metadata, images, or placeholders: ${file}`);
		const estherPortrait = assertApprovedEstherPortrait(html, lang, slug === "salon-update" ? "article" : null);
		assertNoUnapprovedImageReferences(estherPortrait ? html.replace(estherPortrait, "") : html);
		assert.doesNotMatch(html, /This page discusses a general theme|Cette page présente un thème général|not a verified individual case study|n’est pas un témoignage individuel vérifié/,
			`${locale} individual Story repeats a blanket disclaimer: ${file}`);
	}
}

const sitemapFiles = (await readdir(client)).filter((file) => /^sitemap-.*\.xml$/.test(file));
assert.ok(sitemapFiles.length > 0, "Expected generated sitemap files");
const sitemap = (await Promise.all(sitemapFiles.map((file) => readFile(path.join(client, file), "utf8")))).join("\n");
assert.doesNotMatch(sitemap, /https:\/\/apotidev\.org\/(?:fr\/)?stories\/[^<]+<\/loc>/,
	"Story detail URLs retain existing noindex status until owner review is complete");

const enHome = await readFile(path.join(client, "index.html"), "utf8");
const frHome = await readFile(path.join(client, "fr/index.html"), "utf8");
assert.doesNotMatch(`${enIndex}${frIndex}${enHome}${frHome}`, /Most articles below discuss general themes|general support themes, not verified individual case reports|thèmes généraux de soutien, et non des témoignages individuels vérifiés|This page discusses a general theme|Cette page présente un thème général|not a verified individual case study|not a verified individual case reports|témoignages individuels vérifiés/i);
assert.match(enHome, /outreaches, and reflections on our work/i);
assert.match(frHome, /les nouvelles de nos actions et nos réflexions/i);

console.log("Story release verified: 15 bilingual safe pages, approved decorative cleanup hero only, verified stories, updates and program perspectives, finance routed to Transparency, no blanket disclaimers, removed well story, fact placeholders, unapproved personal images, structured data, or detail URLs in the sitemap.");
