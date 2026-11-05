import { describe, expect, it } from "vitest";
import fs from "node:fs";
import {
  applyOwnerFinancialReview,
  countProjectsUnderFinancialReview,
  countOwnerMarkedCompletions,
  groupProjectsByYear,
  toFallbackArchiveEntry,
  toAutoArchiveEntry,
} from "../src/lib/project-archive";
import { getProjectLifecycleState } from "../src/lib/project-lifecycle";

describe("automatically archived project localization", () => {
  it("preserves published French titles and descriptions", () => {
    const project = {
      _id: "project-education-orphans",
      title: "Education for Orphans",
      titleFr: "L’éducation des enfants orphelins",
      slug: { current: "education-orphans" },
      status: "active",
      location: "Douala",
      endDate: "2024-12-31",
      autoArchiveAfterEndDate: true,
      description: "Comprehensive education support for orphaned children.",
      descriptionFr:
        "Un accompagnement scolaire complet pour les enfants orphelins.",
      beneficiaries: 0,
      goalAmount: 0,
      raisedAmount: 0,
      sortOrder: 0,
    } as Parameters<typeof toAutoArchiveEntry>[0];

    const lifecycle = getProjectLifecycleState(project, {
      today: "2025-01-01",
    });
    expect(lifecycle.isAutoCompleted).toBe(true);
    expect(toAutoArchiveEntry(project, lifecycle)).toMatchObject({
      title: "Education for Orphans",
      titleFr: "L’éducation des enfants orphelins",
      description: "Comprehensive education support for orphaned children.",
      descriptionFr:
        "Un accompagnement scolaire complet pour les enfants orphelins.",
      autoArchived: true,
    });
  });

  it("falls back to English only when a French value is missing", () => {
    const project = {
      _id: "project-example",
      title: "Example project",
      slug: { current: "example-project" },
      status: "active",
      location: "Bamenda",
      endDate: "2024-12-31",
      autoArchiveAfterEndDate: true,
      description: "Example description.",
      beneficiaries: 0,
      goalAmount: 0,
      raisedAmount: 0,
      sortOrder: 0,
    } as Parameters<typeof toAutoArchiveEntry>[0];

    const lifecycle = getProjectLifecycleState(project, {
      today: "2025-01-01",
    });
    expect(toAutoArchiveEntry(project, lifecycle)).toMatchObject({
      titleFr: "Example project",
      descriptionFr: "Example description.",
      autoArchived: true,
    });
  });

  it("keeps manually completed projects separate from end-date archives", () => {
    const project = {
      _id: "project-manual-completion",
      title: "Manually completed project",
      slug: { current: "manually-completed-project" },
      status: "completed",
      location: "Buea",
      description: "A manually completed project.",
      beneficiaries: 0,
      goalAmount: 0,
      raisedAmount: 0,
      sortOrder: 0,
    } as Parameters<typeof toAutoArchiveEntry>[0];

    expect(toAutoArchiveEntry(project).autoArchived).toBe(false);
  });

  it("keeps curated fallback archive records distinct from date-based entries", () => {
    expect(
      toFallbackArchiveEntry({
        slug: "curated-record",
        title: "Curated archive record",
        year: 2021,
        demographic: "community",
      }),
    ).toMatchObject({
      status: "completed",
      autoArchived: false,
    });
  });
});

describe("owner-marked archive completion counts", () => {
  it("excludes records completed only by the automatic end-date rule", () => {
    expect(
      countOwnerMarkedCompletions([
        { status: "completed", autoArchived: false },
        { status: "completed", autoArchived: true },
        { status: "ongoing", autoArchived: false },
        { status: "planned", autoArchived: false },
        { status: "completed" },
      ]),
    ).toBe(2);
  });
});

describe("owner-recalled finance display overrides", () => {
  it("hides the stale USD budget for the 2021 widow visits and preserves a transparent owner note", () => {
    const entry = applyOwnerFinancialReview({
      slug: { current: "first-widow-home-visits-2021" },
      title: "First Widow Home Visits",
      demographic: "widows",
      year: 2021,
      status: "completed",
      budget: 200,
    });

    expect(entry.budget).toBeUndefined();
    expect(entry.financialReviewNote).toContain("120,000 CFA francs was sent");
    expect(entry.financialReviewNote).toContain("not a verified balance");
    expect(entry.financialReviewNoteFr).toContain("209 $ US");
  });

  it("hides the stale USD budget and shows the owner-recalled February 2022 funding flow", () => {
    const entry = applyOwnerFinancialReview({
      slug: { current: "school-supply-distribution-feb-2022" },
      title: "School Supply Distribution",
      demographic: "orphans",
      year: 2022,
      status: "completed",
      budget: 500,
    });

    expect(entry.budget).toBeUndefined();
    expect(entry.financialReviewNote).toContain("215,000 CFA francs was sent");
    expect(entry.financialReviewNote).toContain("195,000–200,000 CFA francs");
    expect(entry.financialReviewNote).toContain("illustrative category allocation");
    expect(entry.financialReviewNote).toContain("mathematical sets");
  });

  it("replaces stale first-two CMS descriptions and outcome claims in EN and FR", () => {
    const widow = applyOwnerFinancialReview({
      slug: { current: "first-widow-home-visits-2021" },
      title: "First Widow Home Visits",
      demographic: "widows",
      year: 2021,
      status: "completed",
      description: "Three widows received rice and cash in Buea.",
      descriptionFr: "Trois veuves ont reçu du riz et de l'argent à Buea.",
      beneficiaries: 3,
      outcomes: ["Three recipients received assistance"],
      outcomesFr: ["Trois bénéficiaires ont reçu une aide"],
      budget: 200,
    });
    const school = applyOwnerFinancialReview({
      slug: { current: "school-supply-distribution-feb-2022" },
      title: "School Supply Distribution",
      demographic: "orphans",
      year: 2022,
      status: "completed",
      description: "Twenty children each received identical pink kits.",
      descriptionFr: "Vingt enfants ont chacun reçu un kit rose identique.",
      beneficiaries: 20,
      outcomes: ["Every child received the same kit"],
      outcomesFr: ["Chaque enfant a reçu le même kit"],
      budget: 500,
    });

    expect(widow.description).toContain("120,000 CFA francs was sent");
    expect(widow.description).not.toContain("Three widows");
    expect(widow.descriptionFr).toContain("120 000 francs CFA");
    expect(widow.beneficiaries).toBeUndefined();
    expect(widow.outcomes).toEqual([]);
    expect(widow.outcomesFr).toEqual([]);
    expect(widow.budget).toBeUndefined();
    expect(school.description).toContain("exercise books, pens, and mathematical sets");
    expect(school.description).not.toMatch(/twenty|pink|identical/i);
    expect(school.descriptionFr).toContain("ensembles géométriques");
    expect(school.descriptionFr).not.toMatch(/vingt|rose|identique/i);
    expect(school.beneficiaries).toBeUndefined();
    expect(school.outcomes).toEqual([]);
    expect(school.outcomesFr).toEqual([]);
    expect(school.budget).toBeUndefined();
  });

  it("sanitizes first-two project titles in the Resources library without changing unrelated records", () => {
    const groups = groupProjectsByYear([
      {
        slug: "first-widow-home-visits-2021",
        title: "First Widow Home Visits — 3 recipients",
        year: 2021,
        demographic: "widows",
      },
      {
        slug: "school-supply-distribution-feb-2022",
        title: "School Supply Distribution — $500",
        titleFr: "Distribution de fournitures — 500 $",
        year: 2022,
        demographic: "orphans",
      },
      {
        slug: "widow-support-food-cash-mar-2022",
        title: "Widow Support — Food & Financial Aid",
        year: 2022,
        demographic: "widows",
      },
    ]);

    const records = groups.flatMap((group) => group.demographics.flatMap((item) => item.projects));
    expect(records.find((record) => record.slug === "first-widow-home-visits-2021")?.title)
      .toBe("First Widow Home Visits");
    expect(records.find((record) => record.slug === "first-widow-home-visits-2021")?.titleFr)
      .toBe("Premières visites à domicile auprès des veuves");
    expect(records.find((record) => record.slug === "school-supply-distribution-feb-2022")?.title)
      .toBe("School Supply Distribution");
    expect(records.find((record) => record.slug === "school-supply-distribution-feb-2022")?.titleFr)
      .toBe("Distribution de fournitures scolaires");
    expect(records.find((record) => record.slug === "widow-support-food-cash-mar-2022")?.title)
      .toBe("Women's Day Widow Outreach");
  });

  it("keeps the February report transition and retrospective review notice accurate", () => {
    const report = fs.readFileSync(
      "public/docs/projects/school-supply-distribution-feb-2022/report.md",
      "utf8",
    );
    expect(report).toContain("Retrospective review copy (November 2026)");
    expect(report).toContain("**Distribution (10:15–11:00 AM)**\n\nThe owner confirms");
    expect(report).not.toContain("ensured every child received:");
    expect(report).not.toMatch(/uniform kits eliminated|giving every child identical|uniform kits prevent stigma/i);
  });

  it("filters stale March 2022 CMS description, totals, outcomes, and unverified photo claims", () => {
    const entry = applyOwnerFinancialReview({
      slug: { current: "widow-support-food-cash-mar-2022" },
      title: "Widow Support — Food & Financial Aid",
      titleFr: "Soutien aux veuves — nourriture et aide financière",
      demographic: "widows",
      year: 2022,
      status: "completed",
      description: "Buea: 15 widows received food and cash assistance.",
      descriptionFr: "À Buea, 15 veuves ont reçu de la nourriture et une aide financière.",
      beneficiaries: 15,
      budget: 800,
      location: "Buea",
      startDate: "2022-03-08",
      endDate: "2022-03-08",
      outcomes: ["15 cash envelopes distributed"],
      outcomesFr: ["15 enveloppes d'aide financière distribuées"],
      photo: {
        asset: { _ref: "image-shared" },
        alt: "Financial aid distribution in Buea, March 8",
        altFr: "Distribution d'aide financière à Buea, 8 mars",
      },
      photos: [
        { asset: { _ref: "image-shared" }, caption: "Food and financial aid, 2022", captionFr: "Nourriture et aide financière, 2022" },
      ],
    });

    expect(entry.title).toBe("Women's Day Widow Outreach");
    expect(entry.titleFr).toBe("Action de soutien aux veuves pour la Journée des femmes");
    expect(entry.description).toContain("March 2022");
    expect(entry.description).toContain("African fabric wrappers");
    expect(entry.descriptionFr).toContain("mars 2022");
    expect(entry.beneficiaries).toBeUndefined();
    expect(entry.budget).toBeUndefined();
    expect(entry.location).toBeUndefined();
    expect(entry.startDate).toBeUndefined();
    expect(entry.outcomes).toEqual([]);
    expect(entry.outcomesFr).toEqual([]);
    expect(entry.photo?.asset?._ref).toBe("image-shared");
    expect(entry.photo?.alt).toBe("Project photograph; event details are not verified.");
    expect(entry.photos?.[0].asset?._ref).toBe("image-shared");
    expect(entry.photos?.[0].caption).toBe("Project photograph; event date and activity are not verified.");
    expect(entry.photos?.[0].captionFr).toBe("Photographie de projet; la date et l'activité ne sont pas vérifiées.");
    expect(entry.financialReviewNote).toContain("220,000 CFA francs sent");
  });

  it("uses neutral March photo alt even when CMS alt contains an unanticipated stale claim", () => {
    const entry = applyOwnerFinancialReview({
      slug: { current: "widow-support-food-cash-mar-2022" },
      title: "Old title",
      demographic: "widows",
      year: 2022,
      status: "completed",
      photo: {
        asset: { _ref: "image-shared" },
        alt: "460,000 CFA distributed to 18 women in Buea",
        altFr: "Montant historique non confirmé",
      },
    });

    expect(entry.photo?.alt).toBe("Project photograph; event details are not verified.");
    expect(entry.photo?.altFr).toBe("Photographie de projet; les détails de l'événement ne sont pas vérifiés.");
    expect(entry.photo?.alt).not.toContain("March 2022");
    expect(entry.photo?.altFr).not.toContain("mars 2022");
    expect(entry.photo?.asset?._ref).toBe("image-shared");
  });

  it("sanitizes March titles in the CMS-backed Resources document library", () => {
    const groups = groupProjectsByYear([
      {
        slug: "widow-support-food-cash-mar-2022",
        title: "Widow Support — Food & Financial Aid",
        titleFr: "Soutien aux veuves — nourriture et aide financière",
        year: 2022,
        demographic: "widows",
      },
    ]);
    const record = groups[0]?.demographics[0]?.projects[0];

    expect(record).toMatchObject({
      title: "Women's Day Widow Outreach",
      titleFr: "Action de soutien aux veuves pour la Journée des femmes",
    });
  });

  it("counts all archive records whose financial fields are under review", () => {
    expect(
      countProjectsUnderFinancialReview([
        { financialReviewNote: "First Widow review" },
        { financialReviewNote: "School Supply review" },
        { financialReviewNote: "Women's Day review" },
        { financialReviewNote: undefined },
      ]),
    ).toBe(3);

    const enIndex = fs.readFileSync(
      new URL("../src/pages/projects/archive/index.astro", import.meta.url),
      "utf8",
    );
    const frIndex = fs.readFileSync(
      new URL("../src/pages/fr/projects/archive/index.astro", import.meta.url),
      "utf8",
    );
    expect(enIndex).toContain("{financeReviewCount} project records are excluded");
    expect(frIndex).toContain("{financeReviewCount} dossiers sont exclus");
    expect(enIndex).not.toContain("Two project records are excluded");
    expect(frIndex).not.toContain("Deux dossiers sont exclus");
  });

  it("does not change unrelated archive budgets", () => {
    const entry = applyOwnerFinancialReview({
      slug: { current: "unrelated-project" },
      title: "Unrelated project",
      demographic: "community",
      year: 2024,
      status: "completed",
      budget: 250,
    });
    expect(entry.budget).toBe(250);
    expect(entry.financialReviewNote).toBeUndefined();
  });
});
