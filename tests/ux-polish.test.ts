import { describe, expect, it } from "vitest";
import {
  DILIGENCE_GROUP_ORDER,
  diligenceDocsFor,
  groupDiligenceDocs,
} from "../src/data/diligence-docs";

describe("diligence document grouping", () => {
  it("groups EN diligence docs in Legal → Policies → Sponsor → Budgets order", () => {
    const sections = groupDiligenceDocs(diligenceDocsFor("en"));
    expect(sections.map((s) => s.group)).toEqual([...DILIGENCE_GROUP_ORDER]);
    expect(sections.every((s) => s.docs.length > 0)).toBe(true);
    expect(
      sections
        .find((s) => s.group === "legal")
        ?.docs.some((d) => d.title.includes("Registration")),
    ).toBe(true);
  });

  it("keeps FR docs aligned to the same group keys", () => {
    const en = groupDiligenceDocs(diligenceDocsFor("en"));
    const fr = groupDiligenceDocs(diligenceDocsFor("fr"));
    expect(fr.map((s) => s.group)).toEqual(en.map((s) => s.group));
    expect(fr.reduce((n, s) => n + s.docs.length, 0)).toBe(
      en.reduce((n, s) => n + s.docs.length, 0),
    );
  });
});

describe("project count pluralization strings", () => {
  it("uses singular templates for one project", async () => {
    const en = (await import("../src/i18n/en")).default;
    const fr = (await import("../src/i18n/fr")).default;

    expect(en.resources.projectInYear.replace("{count}", "1")).toBe(
      "1 project",
    );
    expect(en.resources.projectsInYear.replace("{count}", "2")).toBe(
      "2 projects",
    );
    expect(fr.resources.projectInYear.replace("{count}", "1")).toBe("1 projet");
    expect(fr.resources.projectsInYear.replace("{count}", "2")).toBe(
      "2 projets",
    );
  });
});
