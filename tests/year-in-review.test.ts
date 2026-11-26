import { existsSync, readdirSync, readFileSync } from "node:fs";
import { expect, it } from "vitest";
import reviews from "../content/year-in-review.json";

it("provides one bilingual PDF per completed year and excludes the current-year draft", () => {
  expect(reviews.map(({ year }) => year)).toEqual([2021, 2022, 2023, 2024, 2025]);
  const dir = "public/docs/year-in-review";
  const files = reviews.map(({ year }) => `ADA-${year}-Year-in-Review.pdf`);
  expect(readdirSync(dir).sort()).toEqual(files);
  for (const file of files) {
    expect(readFileSync(`${dir}/${file}`).subarray(0, 5).toString()).toBe("%PDF-");
  }
  for (const review of reviews) {
    expect(review.lead.en.trim()).not.toBe(review.lead.fr.trim());
    expect(review.features.length).toBeGreaterThanOrEqual(2);
    for (const feature of review.features) {
      expect(feature.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(feature.en.trim()).not.toBe(feature.fr.trim());
    }
  }
  expect(existsSync("public/docs/year-in-review/ADA-2026-Year-in-Review-Draft.pdf")).toBe(false);
});
