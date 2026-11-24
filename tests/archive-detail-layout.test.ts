import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { archiveEditorial, archiveResolvedFinance } from "../src/data/archive-detail-editorial";

const read = (path: string) => readFileSync(path, "utf8");

describe("project archive detail", () => {
  it("routes both languages to one component with story before details and visible download landmarks", () => {
    for (const [route, locale] of [["projects", "en"], ["fr/projects", "fr"]]) {
      expect(read(`src/pages/${route}/archive/[slug].astro`)).toContain(`<ArchiveProjectDetail record={record} locale="${locale}" />`);
    }
    const shared = read("src/components/projects/ArchiveProjectDetail.astro");
    expect(shared.indexOf("<article")).toBeLessThan(shared.indexOf("<aside"));
    expect(shared).toContain('id="archive-project-documents"');
    expect(shared).toContain('href="#archive-project-documents"');
    expect(shared).toContain('fr && english ? "PDF en anglais"');
    expect(shared).toContain('englishDocuments && record.torUrl && record.reportUrl');
    expect(shared).toContain('gallery.length > 0');
    expect(shared).toContain('documents.length > 0 || documentNote');
    expect(shared).toContain('This entry was archived automatically');
  });

  it("puts shortcut directly after the intro and suppresses only the overlapping archive detail CTA", () => {
    const shared = read("src/components/projects/ArchiveProjectDetail.astro");
    const mobileJump = shared.indexOf('href="#archive-project-documents"');
    expect(mobileJump).toBeGreaterThan(shared.indexOf("{editorial.lead}"));
    expect(mobileJump).toBeLessThan(shared.indexOf("editorial.sections.map"));
    expect(shared).toContain("<PageLayout hideFloatingDonate ");
    expect(shared).toContain('href={root + "/donate"}');
    expect(read("src/layouts/PageLayout.astro")).toContain("props.hideFloatingDonate");
  });

  it("matches the released May record without assigning another project its financial row values", () => {
    const slug = "city-cleanup-may-2023";
    const other = "girls-day-oct-2023";
    const may = archiveResolvedFinance[slug];
    expect(may.itemSubtotal + may.fees).toBe(95900);
    expect(may.received - may.itemSubtotal - may.fees).toBe(4100);
    expect(archiveResolvedFinance[other]).toBeUndefined();
    expect(archiveEditorial[slug].en.sections.map(x => x.title)).toEqual(["Why we did it", "How we did the work", "What we can report"]);
    expect(archiveEditorial[slug].fr.sections).toHaveLength(3);
    expect(archiveEditorial[slug].en.financialBasis).toContain("not the current balance");
  });
});
