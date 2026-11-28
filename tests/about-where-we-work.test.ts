import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("About: Where We Work", () => {
  it.each([
    ["src/pages/about.astro", "Cameroon", "Sister initiative", "In preparation"],
    ["src/pages/fr/about.astro", "Cameroun", "Initiative sœur", "En préparation"],
  ])("distinguishes the three locations in %s", (path, cameroon, sister, preparation) => {
    const source = readFileSync(path, "utf8");
    const locations = source.match(/id="where-we-work"[\s\S]*?<\/Section>/)?.[0] ?? "";
    const cards = locations.match(/<article\b[\s\S]*?<\/article>/g) ?? [];
    expect(cards).toHaveLength(3);
    expect(cards[0]).toContain(`>${cameroon}</h3>`);
    expect(cards[0]).toMatch(/Buea.*Bamenda.*2024/);
    expect(locations).toContain('/images/projects/bamenda-back-to-school-2024-blurred.webp');
    const home = readFileSync(path.replace('about.astro', 'index.astro'), 'utf8');
    expect(home).toMatch(/year: "2024",[\s\S]*?title: "[^"]*Bamenda"/);
    expect(home).not.toMatch(/year: "2025",\s*title: "[^"]*Bamenda"/);
    expect(cards[1]).toContain(">Nigeria</h3>");
    expect(cards[1]).toContain(sister);
    expect(cards[1]).toContain("Beacon of Blessings Charity Initiative.");
    expect(cards[1]).toContain('href="https://www.blessedbeaconcharity.org/"');
    expect(cards[2]).toContain(">Canada</h3>");
    expect(cards[2]).toContain(preparation);
  });
});
