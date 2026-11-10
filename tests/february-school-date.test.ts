import { describe, expect, it } from "vitest";
import fs from "node:fs";
import { applyOwnerFinancialReview } from "../src/lib/project-archive";

describe("confirmed February 2022 school visit date", () => {
  it("overrides stale CMS dates and localizes the confirmed day", () => {
    const entry = applyOwnerFinancialReview({slug:{current:"school-supply-distribution-feb-2022"}, title:"School", year:2022, startDate:"2022-02-15", endDate:"2022-02-15"});
    expect(entry.startDate).toBe("2022-02-16");
    expect(entry.endDate).toBe("2022-02-16");
    expect(entry.description).toContain("February 16, 2022");
    expect(entry.descriptionFr).toContain("16 février 2022");
  });
  it("keeps both released public source documents on the corrected date", () => {
    for (const kind of ["tor", "report"]) {
      const source = fs.readFileSync(`public/docs/projects/school-supply-distribution-feb-2022/${kind}.md`, "utf8");
      expect(source).toContain("16 February 2022");
      expect(source).not.toMatch(/February 15|2022-02-15|Feb 11–15/);
    }
  });
  it("does not alter unrelated project dates", () => {
    const entry = applyOwnerFinancialReview({slug:{current:"unrelated-2023"}, title:"Other", year:2023, startDate:"2023-02-15"});
    expect(entry.startDate).toBe("2023-02-15");
  });
});
