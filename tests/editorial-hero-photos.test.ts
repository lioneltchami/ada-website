import { existsSync } from "node:fs";
import { expect, it } from "vitest";
import { getEditorialHeroPhoto } from "../src/data/editorial-hero-photos";

it("uses distinct, local archive photos with bilingual credits linking the exact record", () => {
  const pages = ["about", "projects", "archive", "sponsor", "volunteer"] as const;
  const src = pages.map((page) => {
    const en = getEditorialHeroPhoto(page, "en");
    const fr = getEditorialHeroPhoto(page, "fr");
    expect(en).toBeDefined();
    expect(fr?.src).toBe(en?.src);
    expect(en?.src).toMatch(/^\/images\/projects\//);
    expect(existsSync(`public${en?.src}`)).toBe(true);
    expect(fr?.credit.href).toBe(`/fr${en?.credit.href}`);
    expect(en?.credit.href).toMatch(/^\/projects\/archive\/.+\/$/);
    expect(fr?.credit.text).not.toEqual(en?.credit.text);
    expect(fr?.alt).not.toEqual(en?.alt);
    return en?.src;
  });
  expect(new Set(src).size).toBe(pages.length);
});
