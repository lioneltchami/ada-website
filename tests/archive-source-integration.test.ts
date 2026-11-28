import { describe, expect, it } from "vitest";
import {
  countOwnerMarkedCompletions,
  groupArchiveDocumentLibrary,
  mergeArchiveSources,
  type ProjectArchiveEntry,
} from "../src/lib/project-archive";
import type { SanityProject } from "../src/lib/sanity";

const tor = "https://cdn.sanity.io/files/rj2m21gk/production/ababab.pdf";
const report = "https://cdn.sanity.io/files/rj2m21gk/production/cdcdcd.pdf";

const source: SanityProject = {
  _id: "source", slug: { current: "day-activity" }, status: "active",
  title: "Day activity", titleFr: "Activité", description: "EN", descriptionFr: "FR",
  location: "Place", locationFr: "Lieu", startDate: "2026-05-01",
  beneficiaries: 0, goalAmount: 0, raisedAmount: 0, sortOrder: 0,
  archiveRecord: { slug: { current: "archived-day-activity" }, torUrl: tor, reportUrl: report },
};

const archive: ProjectArchiveEntry = {
  slug: { current: "archived-day-activity" },
  title: "Archived day activity",
  demographic: "community", year: 2026, status: "ongoing",
  torUrl: tor, reportUrl: report,
};

describe("archive and Resource Library integration", () => {
  it("uses the authoritative linked record even when the source slug differs", () => {
    const records = mergeArchiveSources([archive], [source], "2026-05-08");
    expect(records).toHaveLength(1);
    expect(records[0]).toMatchObject({
      slug: archive.slug, title: archive.title, status: "ongoing",
      titleFr: "Activité", descriptionFr: "FR", locationFr: "Lieu",
      torUrl: tor, reportUrl: report,
    });
    expect(countOwnerMarkedCompletions(records)).toBe(0);
  });

  it.each([
    ["first-widow-home-visits-2021", "Buea", "Bamenda", "Bamenda"],
    ["widow-support-food-cash-mar-2022", "Muea, Buea", "Bamenda", "Bamenda"],
    ["christmas-giving-dec-2022", "Sima orphanage, Buea", "Bamenda & surrounding villages", "Bamenda et villages environnants"],
  ])("does not replace the historic location of %s with its linked programme’s location in French", (slug, location, programmeLocation, programmeLocationFr) => {
    const [record] = mergeArchiveSources(
      [{ ...archive, slug: { current: slug }, sourceSlug: source.slug.current, location }],
      [{ ...source, archiveRecord: undefined, location: programmeLocation, locationFr: programmeLocationFr }],
      "2026-05-08",
    );
    expect(record.location).toBe(location);
    expect(record.locationFr).toBeUndefined();
  });

  it("preserves a matching source translation or an explicit archive translation", () => {
    const [matching] = mergeArchiveSources(
      [{ ...archive, location: "Place" }], [source], "2026-05-08",
    );
    expect(matching.locationFr).toBe("Lieu");

    const [explicit] = mergeArchiveSources(
      [{ ...archive, location: "Buea orphanage", locationFr: "Orphelinat de Buea" }],
      [source], "2026-05-08",
    );
    expect(explicit.locationFr).toBe("Orphelinat de Buea");
  });

  it("honors the archive-side source linkage even without a reverse reference", () => {
    expect(mergeArchiveSources(
      [{ ...archive, sourceSlug: source.slug.current }],
      [{ ...source, archiveRecord: undefined }],
      "2026-05-08",
    )).toHaveLength(1);
  });

  it("preserves linked alternate slugs and documents if only the source is available, without confirming completion", () => {
    expect(mergeArchiveSources([], [source], "2026-05-07")).toEqual([]);
    const records = mergeArchiveSources([], [source], "2026-05-08");
    expect(records[0]).toMatchObject({ slug: archive.slug, autoArchived: true, torUrl: tor, reportUrl: report });
    expect(countOwnerMarkedCompletions(records)).toBe(0);
  });

  it("does not present targets as recorded figures for a date-only archive", () => {
    const fundedSource = { ...source, beneficiaries: 40, goalAmount: 250 };
    const [automatic] = mergeArchiveSources([], [fundedSource], "2026-05-08");
    expect(automatic.beneficiaries).toBeUndefined();
    expect(automatic.budget).toBeUndefined();

    const [manual] = mergeArchiveSources([], [{ ...fundedSource, status: "completed" }], "2026-05-08");
    expect(manual).toMatchObject({ autoArchived: false, beneficiaries: 40, budget: 250 });

    const [recorded] = mergeArchiveSources(
      [{ ...archive, status: "completed", beneficiaries: 38, budget: 210 }],
      [fundedSource], "2026-05-08",
    );
    expect(recorded).toMatchObject({ status: "completed", beneficiaries: 38, budget: 210 });
  });

  it("includes a Sanity-only public PDF pair and excludes partial or invalid pairs", () => {
    const [year] = groupArchiveDocumentLibrary([
      archive,
      { ...archive, slug: { current: "tor-only" }, reportUrl: undefined },
      { ...archive, slug: { current: "untrusted-pair" }, reportUrl: "https://example.org/report.pdf" },
    ]);
    expect(year.projectCount).toBe(1);
    expect(year.demographics[0].projects).toEqual([
      expect.objectContaining({ slug: archive.slug.current, torUrl: tor, reportUrl: report }),
    ]);
  });
});
