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
assert.equal((enIndex.match(/class="group block rounded-xl/g) || []).length, 17);
assert.equal((frIndex.match(/class="group block rounded-xl/g) || []).length, 17);
assert.equal((enIndex.match(/data-story-filter=/g) || []).length, 4);
assert.equal((frIndex.match(/data-story-filter=/g) || []).length, 4);
assert.match(enIndex, />All<span/);
assert.match(enIndex, />Stories<span/);
assert.match(enIndex, />Updates<span/);
assert.match(enIndex, />Announcements<span/);
assert.match(frIndex, />Tous<span/);
assert.match(frIndex, />Histoires<span/);
assert.match(frIndex, />Actualités<span/);
assert.match(frIndex, />Annonces<span/);
assert.equal((enIndex.match(/data-story-category="story"/g) || []).length, 10);
assert.equal((frIndex.match(/data-story-category="story"/g) || []).length, 10);
assert.equal((enIndex.match(/data-story-category="update"/g) || []).length, 4);
assert.equal((frIndex.match(/data-story-category="update"/g) || []).length, 4);
assert.equal((enIndex.match(/data-story-category="announcement"/g) || []).length, 3);
assert.equal((frIndex.match(/data-story-category="announcement"/g) || []).length, 3);
assert.match(enIndex, /aria-live="polite"/);
assert.match(frIndex, /aria-live="polite"/);
assertApprovedStoryHero(enIndex, "English");
assertApprovedStoryHero(frIndex, "French");
assert.doesNotMatch(`${enIndex}${frIndex}`, /\[[A-Z][A-Z0-9 _/-]*\]/);

const enPages = (await htmlFiles(storyRoot)).filter((file) => file !== path.join(storyRoot, "index.html"));
const frPages = (await htmlFiles(path.join(client, "fr/stories"))).filter((file) => file !== path.join(client, "fr/stories/index.html"));
assert.equal(enPages.length, 17, `Expected 17 English routes, found ${enPages.length}`);
assert.equal(frPages.length, 17, `Expected 17 French routes, found ${frPages.length}`);
assert.doesNotMatch(`${enIndex}${frIndex}`, /clean-water-first-well-completed|water access and everyday life|accès à l’eau au quotidien/i);

for (const slug of ["donations-changed-lives-2024", "transparency-report-2024"]) {
	const en = await readFile(route("en", slug), "utf8");
	const fr = await readFile(route("fr", slug), "utf8");
	assert.match(en, /under review/i);
	assert.match(en, /role="status"/);
	assert.match(fr, /role="status"/);
	assert.match(fr, /en cours de vérification/i);
	assert.match(en, /No totals are shown here/);
	assert.match(fr, /Aucun total n’est présenté ici/);
	assert.doesNotMatch(`${en}${fr}`, /\$\s?\d|\d[,.]?\d*\s?CFA/);
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
		const estherPortrait = assertApprovedEstherPortrait(html, lang, slug === "meet-esther-skills-training" ? "article" : null);
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
assert.match(enHome, /2024 financial summary and 2024 donations summary remain under review/i);
assert.match(frHome, /synthèse financière 2024 et la synthèse des dons 2024.*restent en cours de vérification/i);

console.log("Story release verified: 17 bilingual safe pages, approved decorative cleanup hero only, restored CMS categories, 2 financial notices, no blanket disclaimers, removed well story, fact placeholders, unapproved personal images, structured data, or detail URLs in the sitemap.");
