import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

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
assert.match(enIndex, /Most articles below discuss general themes/);
assert.match(frIndex, /ne décrivent pas des témoignages individuels vérifiés/);
assert.equal((enIndex.match(/class="group block rounded-xl/g) || []).length, 17);
assert.equal((frIndex.match(/class="group block rounded-xl/g) || []).length, 17);
assert.doesNotMatch(`${enIndex}${frIndex}`, /cdn\.sanity\.io\/images\/rj2m21gk|\[[A-Z][A-Z0-9 _/-]*\]/);

const enPages = (await htmlFiles(storyRoot)).filter((file) => file !== path.join(storyRoot, "index.html"));
const frPages = (await htmlFiles(path.join(client, "fr/stories"))).filter((file) => file !== path.join(client, "fr/stories/index.html"));
assert.equal(enPages.length, 17, `Expected 17 English routes, found ${enPages.length}`);
assert.equal(frPages.length, 17, `Expected 17 French routes, found ${frPages.length}`);
assert.doesNotMatch(`${enIndex}${frIndex}`, /clean-water-first-well-completed|water access and everyday life|accès à l’eau au quotidien/i);

for (const slug of ["donations-changed-lives-2024", "transparency-report-2024"]) {
	const en = await readFile(route("en", slug), "utf8");
	const fr = await readFile(route("fr", slug), "utf8");
	assert.match(en, /under review/i);
	assert.match(fr, /en cours de vérification/i);
	assert.match(en, /No totals are shown here/);
	assert.match(fr, /Aucun total n’est présenté ici/);
	assert.doesNotMatch(`${en}${fr}`, /\$\s?\d|\d[,.]?\d*\s?CFA/);
}

for (const [files, lang, locale] of [[enPages, "en", "English"], [frPages, "fr", "French"]]) {
	for (const file of files) {
		const html = await readFile(file, "utf8");
		assert.match(html, new RegExp(`<html[^>]+lang="${lang}"`), `${locale} lang missing: ${file}`);
		assert.match(html, /<meta name="robots" content="noindex, follow"\s*\/?\s*>/,
			`${locale} Story should remain noindex pending owner fact review: ${file}`);
		assert.doesNotMatch(html, /BlogPosting|BreadcrumbList|article:published_time|og:type" content="article"|cdn\.sanity\.io\/images\/rj2m21gk|\[[A-Z][A-Z0-9 _/-]*\]/,
			`${locale} page contains original CMS metadata, images, or placeholders: ${file}`);
		assert.match(html, /This page discusses a general theme|Cette page présente un thème général|Summary under review|Synthèse en cours de vérification/,
			`${locale} safe context missing: ${file}`);
	}
}

const sitemapFiles = (await readdir(client)).filter((file) => /^sitemap-.*\.xml$/.test(file));
assert.ok(sitemapFiles.length > 0, "Expected generated sitemap files");
const sitemap = (await Promise.all(sitemapFiles.map((file) => readFile(path.join(client, file), "utf8")))).join("\n");
assert.doesNotMatch(sitemap, /https:\/\/apotidev\.org\/(?:fr\/)?stories\/[^<]+<\/loc>/,
	"Story detail URLs retain existing noindex status until owner review is complete");

const enHome = await readFile(path.join(client, "index.html"), "utf8");
const frHome = await readFile(path.join(client, "fr/index.html"), "utf8");
assert.match(enHome, /general support themes, not verified individual case reports/);
assert.match(frHome, /thèmes généraux de soutien, et non des témoignages individuels vérifiés/);

console.log("Story release verified: 17 bilingual safe pages, 2 financial notices, no removed well story, fact placeholders, personal images, structured data, or detail URLs in the sitemap.");
