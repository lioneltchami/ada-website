import { expect, it } from "vitest";
import { isWithdrawnProjectRecord, isWithdrawnProjectSlug, isWithdrawnTestimonial, isWithdrawnGalleryImage } from "../src/lib/withdrawn-project-content";
import { normalizeFallbackProjects } from "../src/lib/project-fallbacks";

it("withholds the unconfirmed Douala record, its old slug, and its testimony", () => {
  expect(isWithdrawnProjectSlug("education-orphans")).toBe(true);
  expect(isWithdrawnProjectRecord({ slug: { current: "education-orphans" } })).toBe(true);
  expect(isWithdrawnProjectRecord({ _id: "project-education-orphans" })).toBe(true);
  expect(isWithdrawnTestimonial({ programFr: "Éducation des Orphelins" })).toBe(true);
  expect(isWithdrawnGalleryImage({ title: "Education for Orphans in Douala" })).toBe(true);
  expect(normalizeFallbackProjects().some((record) => record.slug === "education-orphans")).toBe(false);
});

it("preserves other school work and images only weakly linked to the old project", () => {
  expect(isWithdrawnProjectRecord({ slug: "education-drive" })).toBe(false);
  expect(isWithdrawnProjectRecord({ slug: "back-to-school-bamenda-aug-2026" })).toBe(false);
  expect(isWithdrawnGalleryImage({ projectId: "project-education-orphans", projectSlug: "education-orphans", title: "School visit" })).toBe(false);
  expect(normalizeFallbackProjects().some((record) => record.slug === "education-drive")).toBe(true);
});
