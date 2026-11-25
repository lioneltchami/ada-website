import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const english = readFileSync("src/pages/projects/archive/index.astro", "utf8");
const french = readFileSync(
  "src/pages/fr/projects/archive/index.astro",
  "utf8",
);
const projectsIndex = readFileSync(
  "src/components/projects/ProjectsIndex.astro",
  "utf8",
);
const projectFallbacks = readFileSync("src/lib/project-fallbacks.ts", "utf8");

describe("project archive filters", () => {
  it.each([
    ["English", english],
    ["French", french],
  ])(
    "uses operable filter buttons and announced results in %s",
    (_locale, page) => {
      expect(page).toContain('role="group"');
      expect(page).not.toContain('role="tablist"');
      expect(page).not.toContain('role="tab"');
      expect(page).toContain('type="button"');
      expect(page).toContain('aria-pressed={d === "all" ? "true" : "false"}');
      expect(page).toContain('role="status"');
      expect(page).toContain('aria-live="polite"');
      expect(page).toContain('aria-atomic="true"');
      expect(page).toContain('setAttribute("aria-pressed", "false")');
      expect(page).toContain('setAttribute("aria-pressed", "true")');
      expect(page).toContain(
        'noResults?.classList.toggle("hidden", visibleCount > 0)',
      );
    },
  );

  it("renders accented French copy as UTF-8 text rather than visible escape sequences", () => {
    const markup = french.split("---").slice(2).join("---");
    expect(markup).toContain("Archives des dossiers de projets");
    expect(markup).toContain("Participants déclarés");
    expect(markup).not.toMatch(/\\u00e9/);
  });

  it("keeps the archive summary data-driven without implying unique reach or aggregating money", () => {
    for (const [locale, page, separator] of [
      ["en", english, "of"],
      ["fr", french, "sur"],
    ] as const) {
      expect(page).toContain(`{totalBeneficiaries.toLocaleString("${locale}")}`);
      expect(page).toContain(`{archiveItems.length.toLocaleString("${locale}")}`);
      expect(page).toContain(
        `{completedCount.toLocaleString("${locale}")} ${separator} {archiveItems.length.toLocaleString("${locale}")}`,
      );
      expect(page).toContain("sum + (r.beneficiaries || 0)");
      expect(page).not.toMatch(/totalBudget|sum \+ \(r\.budget/);
      expect(page).toContain("budget={r.budget} localFinance={r.localFinance}");
      expect(page).toContain("archiveExchangeRateSource");
      expect(page).toContain("archiveExchangePegSource");
    }
    expect(english).toContain("Outreach records");
    expect(english).toContain("Marked complete");
    expect(english).toContain("Reported participants across outreaches");
    expect(english).toContain("may be counted more than once");
    expect(french).toContain("Dossiers d’actions");
    expect(french).toContain("Dossiers marqués comme terminés");
    expect(french).toContain("Participants déclarés pour l’ensemble des actions");
    expect(french).toContain("peut être comptée plusieurs fois");
  });

  it("uses neutral archive wording and excludes auto-archived entries from completed totals", () => {
    for (const page of [english, french]) {
      expect(page).toContain("countOwnerMarkedCompletions(archiveItems)");
      expect(page).toContain("getArchiveCardStatus(r,");
      expect(page).toContain("filter-result-count");
      expect(page).toContain("visibleCount");
      expect(page).not.toMatch(
        /delivered since 2022|depuis 2022|all projects.*delivered/i,
      );
    }
    expect(english).toContain("<ArchiveCardStatuses");
    expect(english).toContain("archive entries shown");
    expect(french).toContain("<ArchiveCardStatuses");
    expect(french).toContain("entrées d’archives affichées");
    expect(english).not.toContain("projects shown");
    expect(french).not.toContain("projets affichés");
    expect(english).not.toContain("delivered since 2022");
    expect(french).not.toContain("depuis 2022");
  });

  it("adds project context to repeated detail and donation links", () => {
    expect(
      projectsIndex.match(
        /aria-label=\{`\$\{copy\.details\}: \$\{project\.title\}`\}/g,
      ),
    ).toHaveLength(1);
    expect(
      projectsIndex.match(
        /aria-label=\{`\$\{copy\.donate\}: \$\{project\.title\}`\}/g,
      ),
    ).toHaveLength(1);
    expect(projectsIndex).toContain(
      "aria-label={`${copy.upcomingDetails}: ${project.title}`}",
    );
    expect(projectsIndex).toContain(
      "aria-label={`${copy.upcomingDonate}: ${project.title}`}",
    );
  });

  it("labels date-derived completed projects as archived, not delivered", () => {
    expect(projectFallbacks).toContain(
      "isAutoArchived: lifecycle.isAutoCompleted",
    );
    expect(projectsIndex).toContain(
      "isAutoArchived: lifecycle.isAutoCompleted",
    );
    expect(projectsIndex).toContain('autoArchived: "Archived by end date"');
    expect(projectsIndex).toContain(
      'autoArchived: "Archivé selon la date de fin"',
    );
    expect(projectsIndex).toContain('viewArchive: "View archive record"');
    expect(projectsIndex).toContain('viewArchive: "Voir le dossier d’archive"');
    expect(projectsIndex).toContain("a date alone does not confirm delivery");
    expect(projectsIndex).not.toContain("View archive report");
    expect(projectsIndex).not.toContain("Voir le rapport d'archive");
  });
});
