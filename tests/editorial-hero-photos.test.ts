import { existsSync } from "node:fs";
import { expect, it } from "vitest";
import { getEditorialHeroPhoto } from "../src/data/editorial-hero-photos";

it("uses reviewed local archive photos with bilingual credits linking the exact record", () => {
  const pages = ["about", "projects", "sponsor", "volunteer", "gallery", "contact", "transparency", "partners"] as const;
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
  expect(new Set(src).size).toBe(src.length);
  for (const page of ["archive", "team", "monthly", "donate", "resources"] as const) {
    expect(getEditorialHeroPhoto(page, "en")).toBeUndefined();
    expect(getEditorialHeroPhoto(page, "fr")).toBeUndefined();
  }
  expect(getEditorialHeroPhoto("gallery", "en")?.credit.href).toBe("/projects/archive/back-to-school-buea-2024/");
  expect(getEditorialHeroPhoto("sponsor", "en")?.src).not.toEqual(getEditorialHeroPhoto("resources", "en")?.src);
  expect(getEditorialHeroPhoto("sponsor", "en")?.credit.href).toBe("/projects/archive/prenatal-care-support-program/");
});
