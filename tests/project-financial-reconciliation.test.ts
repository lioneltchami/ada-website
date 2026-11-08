import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const docs = path.resolve("public/docs");
const read = (relative: string) => fs.readFileSync(path.join(docs, relative), "utf8");

describe("2021 and February 2022 owner-recalled finance corrections", () => {
  it("keeps the 2021 sent amount, estimated spend, and unverified difference distinct", () => {
    const finance = read("projects/first-widow-home-visits-2021/financial.md");
    expect(finance).toContain("120,000 CFA francs was sent");
    expect(finance).toContain("about 110,000 CFA francs was spent");
    expect(finance).toContain("approximately 10,000 CFA francs in withdrawal costs");
    expect(finance).toContain("not a verified cash balance");
    expect(finance).toContain("approximately US$209");
    expect(finance).not.toContain("85,000 CFA");
    expect(finance).not.toContain("35,000 CFA");
  });

  it("distinguishes the February 2022 owner-recalled flow from the illustrative allocation", () => {
    const finance = read("projects/school-supply-distribution-feb-2022/financial.md");
    expect(finance).toContain("215,000 CFA francs was sent");
    expect(finance).toContain("5,000 CFA francs");
    expect(finance).toContain("10,000–15,000 CFA francs");
    expect(finance).toContain("195,000–200,000 CFA francs");
    expect(finance).toContain("not a reconstruction of actual historical line-item spending");
    expect(finance).toContain("actual category amounts remain unknown");
    const allocationSection = finance.split("## Illustrative allocation for review only")[1]?.split("## Reconciliation status")[0] ?? "";
    const allocation = [...allocationSection.matchAll(/^\| [^|]+ \| \*{0,2}([0-9,]+)\*{0,2} \|$/gm)]
      .map((match) => Number(match[1].replaceAll(",", "")));
    expect(allocation).toEqual([25_000, 30_000, 45_000, 50_000, 15_000, 35_000, 200_000]);
    expect(allocation.slice(0, -1).reduce((sum, value) => sum + value, 0)).toBe(allocation.at(-1));
    expect(finance).toContain("buckets, utensils, school bags, exercise books, pens, and mathematical sets");
    expect(finance).not.toContain("300,000 CFA");
    expect(finance).not.toContain("280,000 CFA");
    expect(finance).not.toContain("20,000 CFA");
  });

  it("keeps archive copy and generated finance notes aligned with the new owner recollection", () => {
    const archive = fs.readFileSync(path.resolve("src/lib/project-archive.ts"), "utf8");
    const ledgerScript = fs.readFileSync(path.resolve("scripts/build_project_ledger.py"), "utf8");
    const adjustmentsScript = fs.readFileSync(path.resolve("scripts/build_public_budget_corrections.py"), "utf8");
    for (const source of [archive, ledgerScript, adjustmentsScript]) {
      expect(source).toContain("215,000 CFA");
      expect(source).toContain("195,000–200,000 CFA");
      expect(source).toContain("illustrative");
      expect(source).not.toContain("sent-versus-spent classification is unconfirmed");
    }
    expect(archive).toContain("ne constitue pas un relevé des coûts historiques");
  });

  it("marks the March 2022 widow outreach under review without retaining unsupported cash details", () => {
    const folder = "projects/widow-support-food-cash-mar-2022/";
    const financial = read(`${folder}financial.md`);
    const report = read(`${folder}report.md`);
    const tor = read(`${folder}tor.md`);
    for (const rawSource of [financial, report, tor]) {
      const source = rawSource.replaceAll("**", "");
      expect(source).toContain("about 220,000 CFA francs");
      expect(source).toMatch(/about 5,000 CFA francs/i);
      expect(source).toContain("about 10,000 CFA francs");
      expect(source).toContain("205,000 CFA francs");
      expect(source).toContain("buckets, African fabric wrappers, soap, oil, foodstuffs, and bags");
      expect(source).not.toMatch(/\b(?:480,000|460,000|15 widows|15 cash envelopes|3,000 CFA|95\.8%)\b/);
      expect(source).not.toMatch(/\b(?:rice \(25kg\)|Thai rice|5L bottle|handbag|cash envelope)\b/i);
    }
    expect(financial).toContain("No cash-assistance amount is included");
    expect(financial).toContain("This is not a finding that no cash assistance occurred");
  });

  it("uses the corrected March project title and removes unsupported CMS archive details", () => {
    const archive = fs.readFileSync(path.resolve("src/lib/project-archive.ts"), "utf8");
    expect(archive).toContain('title: "Women\'s Day Widow Outreach"');
    expect(archive).toContain("Action de soutien aux veuves pour la Journée des femmes");
    expect(archive).toContain("beneficiaries: undefined");
    expect(archive).toContain("outcomes: []");
    const video = fs.readFileSync(path.resolve("src/components/home/WorkVideo.astro"), "utf8");
    expect(video).not.toContain("financial aid in Buea, 2022");
    expect(video).toContain("Women's Day widow outreach — food and household supplies, March 2022");
  });

  it("does not reintroduce stale totals in the generated public ledgers", () => {
    const history = read("ada-project-history.md");
    const adjustments = read("ada-public-budget-adjustments.md");
    for (const stale of ["Approved 120,000 CFA; Actual/Spent 85,000 CFA", "Approved 300,000 CFA; Actual/Spent 280,000 CFA"]) {
      expect(history).not.toContain(stale);
    }
    expect(history).toContain("Figures for 6 projects are under reconciliation");
    expect(history).toContain("First Widow Home Visits");
    expect(history).toContain("School Supply Distribution");
    expect(adjustments).toContain("First Widow Home Visits");
    expect(adjustments).toContain("School Supply Distribution");
    expect(adjustments).toContain("under review");
    expect(adjustments).not.toContain("| 2021 | Project Completion Report | ADA/2021/001 | 120,000 CFA | 85,000 CFA");
    expect(adjustments).not.toContain("| 2022 | Project Completion Report | ADA/2022/001 | 300,000 CFA | 280,000 CFA");
  });

  it("does not repeat project summaries as unverified outcomes in under-review ledger entries", () => {
    const history = read("ada-project-history.md");
    for (const title of [
      "First Widow Home Visits",
      "July 2022 Baking Workshop",
      "May 2022 Community Cleanup",
      "School Supply Distribution",
      "Women's Day Widow Outreach",
    ]) {
      const start = history.indexOf(`#### ${title}`);
      expect(start).toBeGreaterThanOrEqual(0);
      const section = history.slice(start, history.indexOf("\n#### ", start + 1) > 0
        ? history.indexOf("\n#### ", start + 1)
        : history.length);
      expect(section).toContain("Outcomes: Not established in this review.");
      expect(section).not.toContain("Outcomes: The owner identifies this project");
    }
  });

  it("states that the 2022 item list included exercise books and pens without claiming a line-item cost", () => {
    const report = read("projects/school-supply-distribution-feb-2022/report.md");
    const tor = read("projects/school-supply-distribution-feb-2022/tor.md");
    expect(report).toContain("exercise books, pens, and mathematical sets");
    expect(report).not.toContain("Would have liked to include additional items (notebooks, pencils)");
    expect(report).not.toContain("brought the project under budget");
    expect(report).not.toContain("Unspent balance:");
    expect(tor).toContain("buckets, utensils, school bags, exercise books, pens, and mathematical sets");
    expect(tor).toContain("does not assert unverified allocations");
    expect(tor).not.toContain("Purchase 20 colorful plastic buckets");
    expect(tor).not.toContain("Purchase 20 sets of plates");
    expect(tor).not.toContain("Purchase 20 pink school bags");
    expect(tor).not.toContain("bucket filled with plate, cup");
    expect(report).not.toContain("exact contents of individual kits");
    expect(report).not.toContain("One colorful plastic bucket");
    expect(report).not.toContain("One pink school bag");
    expect(report).not.toContain("20 buckets, 20 bags");
  });

  it("shows all budget-adjustment rows in exactly one status, including the six under review", () => {
    const adjustments = JSON.parse(
      fs.readFileSync(path.resolve(docs, "ada-public-budget-adjustments.json"), "utf8"),
    ) as Array<{ status: string; project: string; archive_approved: number | null; archive_actual: number | null; public_target: number | null }>;
    const reviewRows = adjustments.filter((row) => row.status === "under review");
    expect(adjustments).toHaveLength(19);
    expect(reviewRows.map((row) => row.project).sort()).toEqual([
      "Back-to-School 2022",
      "First Widow Home Visits",
      "July 2022 Baking Workshop",
      "May 2022 Community Cleanup",
      "School Supply Distribution",
      "Women's Day Widow Outreach",
    ]);
    expect(adjustments.filter((row) => row.status === "ok")).toHaveLength(6);
    expect(adjustments.filter((row) => row.status === "adjusted")).toHaveLength(7);
    expect(reviewRows.every((row) => row.archive_approved === null && row.archive_actual === null && row.public_target === null)).toBe(true);

    const renderer = fs.readFileSync(path.resolve("scripts/render_public_budget_adjustments_pdf.mjs"), "utf8");
    expect(renderer).toContain('const underReviewRows = rows.filter((row) => row.status === "under review")');
    expect(renderer).toContain("okRows.length + adjustedRows.length + underReviewRows.length !== rows.length");
    expect(renderer).toContain('class="label">Under review</div>');
    expect(renderer).toContain("Under review: ${underReviewRows.length}");
    expect(renderer).toContain('class="section-title">Projects under review</h2>');
    expect(renderer).toContain("counts all ${rows.length} rows by status");
    expect(renderer).toContain("<th>Reported actual</th>");
    expect(renderer).toContain("${currency(row.archive_actual)}");
    expect(renderer).not.toContain("row.archive_actual || row.archive_approved");
  });
});
