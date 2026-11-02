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

function page(directory, route) {
	return path.join(directory, route, "index.html");
}

const enIndexPath = page(client, "stories");
const frIndexPath = page(client, "fr/stories");
const enIndex = await readFile(enIndexPath, "utf8");
const frIndex = await readFile(frIndexPath, "utf8");

assert.match(enIndex, /Stories are temporarily unavailable/);
assert.match(frIndex, /Les récits sont temporairement indisponibles/);
assert.doesNotMatch(enIndex, /class="story-card"|story-filters|cdn\.sanity\.io\/images\/rj2m21gk/);
assert.doesNotMatch(frIndex, /class="story-card"|story-filters|cdn\.sanity\.io\/images\/rj2m21gk/);

const enPages = (await htmlFiles(storyRoot)).filter((file) =>
	file !== enIndexPath,
);
const frPages = await htmlFiles(path.join(client, "fr/stories"));
const frDetails = frPages.filter((file) => file !== frIndexPath);
assert.equal(enPages.length, 18, `Expected 18 English story routes, found ${enPages.length}`);
assert.equal(frDetails.length, 18, `Expected 18 French story routes, found ${frDetails.length}`);

for (const [files, marker, locale] of [
	[enPages, "Story details are being updated", "English"],
	[frDetails, "Les détails du récit sont en cours de mise à jour", "French"],
]) {
	for (const file of files) {
		const html = await readFile(file, "utf8");
		assert.ok(html.includes(marker), `${locale} placeholder missing from ${file}`);
		assert.doesNotMatch(
			html,
			/BlogPosting|BreadcrumbList|itemprop="headline"|article:published_time|og:type" content="article"|cdn\.sanity\.io\/images\/rj2m21gk/,
			`${locale} story metadata or image leaked into ${file}`,
		);
		assert.match(html, /<meta name="robots" content="noindex, follow"\s*\/?>/,
			`${locale} placeholder route should not be indexed: ${file}`);
		assert.doesNotMatch(html, /hreflang=/,
			`${locale} placeholder route should not advertise an empty alternate-language page: ${file}`);
	}
}

const enHome = await readFile(path.join(client, "index.html"), "utf8");
const frHome = await readFile(page(client, "fr"), "utf8");
assert.match(enHome, /Story details are being reviewed/);
assert.match(frHome, /Les détails des récits sont en cours de vérification/);

const sitemapFiles = (await readdir(client)).filter((file) =>
	/^sitemap-.*\.xml$/.test(file),
);
assert.ok(sitemapFiles.length > 0, "Expected generated sitemap files");
const sitemap = (
	await Promise.all(
		sitemapFiles.map((file) => readFile(path.join(client, file), "utf8")),
	)
).join("\n");
assert.match(sitemap, /https:\/\/apotidev\.org\/stories\//);
assert.match(sitemap, /https:\/\/apotidev\.org\/fr\/stories\//);
assert.doesNotMatch(
	sitemap,
	/<loc>https:\/\/apotidev\.org\/(?:fr\/)?stories\/[^<]+<\/loc>/,
	"Story detail placeholders should not be advertised in the sitemap",
);

console.log(
	`Story review mode verified: 18 English and 18 French noindex detail routes excluded from the sitemap, both indexes retained, and bilingual homepage notice.`,
);
