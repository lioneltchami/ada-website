import { accessSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { transparencyCopyFor } from "../src/data/transparency-copy";

describe("Bilingual transparency outreach evidence", () => {
  const en = transparencyCopyFor("en");
  const fr = transparencyCopyFor("fr");

  it("shares a four-step, ordered process across both languages", () => {
    for (const copy of [en, fr]) {
      expect(copy.theoryOfChange.steps.map(({ step }) => step)).toEqual(["1", "2", "3", "4"]);
    }
    expect(en.theoryOfChange.title).toBe("How Our Outreach Works");
    expect(fr.theoryOfChange.title).toBe("Comment se déroulent nos actions");
  });

  it("links each selected goal and cleanup example to a published report in both languages", () => {
    expect(en.sdg.goals.map(({ number, href }) => [number, href])).toEqual(
      fr.sdg.goals.map(({ number, href }) => [number, href]),
    );
    expect(en.sdg.goals.map(({ number }) => number)).toEqual(["1", "2", "4", "5"]);
    expect(en.environment.items.map(({ href }) => href)).toEqual([
      "/projects/archive/city-cleanup-may-2023/",
      "/projects/archive/city-cleanup-may-2025/",
    ]);
    expect(en.environment.items.map(({ href }) => href)).toEqual(
      fr.environment.items.map(({ href }) => href),
    );
    for (const { href } of [...en.sdg.goals, ...en.environment.items]) {
      const slug = href.match(/^\/projects\/archive\/([a-z0-9-]+)\/$/)?.[1];
      expect(slug).toBeTruthy();
      expect(() => accessSync(new URL(`../public/docs/projects/${slug}/report.pdf`, import.meta.url))).not.toThrow();
    }
  });

  it("avoids asserting environmental outcomes or universal bilingual report availability", () => {
    expect(JSON.stringify(en.environment)).not.toMatch(/50 trees|recycl|charcoal|2027/i);
    expect(JSON.stringify(fr.environment)).not.toMatch(/50 arbres|recycl|charbon|2027/i);
    expect(JSON.stringify(en.accountability)).toContain("may be available in only one language");
    expect(JSON.stringify(fr.accountability)).toContain("peuvent n’être disponibles que dans une langue");
  });
});
