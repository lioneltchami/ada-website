import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const english = readFileSync("src/pages/stories/[slug].astro", "utf8");
const french = readFileSync("src/pages/fr/stories/[slug].astro", "utf8");

describe("interim story detail pages", () => {
	it("keeps the English route and its safe actions available", () => {
		expect(english).toContain("getBlogPostSlugs");
		expect(english).toContain('href="/donate"');
		expect(english).toContain('href="/projects"');
		expect(english).toContain('href="/get-involved"');
		expect(english).toContain('href="/contact"');
		expect(english).toContain("noBreadcrumbJsonLd");
	});

	it("keeps the French route and localized actions available", () => {
		expect(french).toContain("getBlogPostSlugs");
		expect(french).toContain('href="/fr/donate"');
		expect(french).toContain('href="/fr/projects"');
		expect(french).toContain('href="/fr/get-involved"');
		expect(french).toContain('href="/fr/contact"');
		expect(french).toContain("noBreadcrumbJsonLd");
	});

	it("does not render CMS claims, images, social share payloads or BlogPosting data", () => {
		for (const source of [english, french]) {
			expect(source).not.toContain("post.title");
			expect(source).not.toContain("post.excerpt");
			expect(source).not.toContain("post.body");
			expect(source).not.toContain("personPhoto");
			expect(source).not.toContain("buildBlogPosting");
			expect(source).not.toContain("twitter.com/intent/tweet");
			expect(source).not.toContain("BlogPosting");
		}
	});
});
