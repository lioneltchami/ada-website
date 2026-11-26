import { readdirSync, readFileSync } from "node:fs";
import { expect, it } from "vitest";
import reviews from "../content/year-in-review.json";

it("provides one bilingual PDF per completed year and excludes the current-year draft", () => {
  const years = reviews.map(({ year }) => year);
  expect(years.slice(0, 5)).toEqual([2021, 2022, 2023, 2024, 2025]);
  expect(years).toEqual([...new Set(years)].sort((a, b) => a - b));
  expect(years.every(year => year < new Date().getUTCFullYear())).toBe(true);
  const dir = "public/docs/year-in-review";
  const files = reviews.map(({ year }) => `ADA-${year}-Year-in-Review.pdf`);
  expect(readdirSync(dir).sort()).toEqual(files);
  for (const file of files) {
    expect(readFileSync(`${dir}/${file}`).subarray(0, 5).toString()).toBe("%PDF-");
  }
  for (const review of reviews) {
    for (const block of [review.lead, review.account, review.closing]) {
      expect(block.en.trim()).not.toBe("");
      expect(block.fr.trim()).not.toBe("");
      expect(block.en.trim()).not.toBe(block.fr.trim());
    }
    expect(review.features.length).toBeGreaterThanOrEqual(2);
    for (const feature of review.features) {
      expect(feature.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(feature.en.trim()).not.toBe(feature.fr.trim());
    }
  }
  expect(readdirSync(dir).some(file => /draft/i.test(file))).toBe(false);
});
