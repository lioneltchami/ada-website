import { describe, expect, it } from "vitest";
import { getTeamRoster } from "../src/data/team-profiles";

describe("private team roster review", () => {
  it("records confirmed dual roles once and holds unconfirmed appointments", () => {
    const team = getTeamRoster("en").groups.flatMap(({ profiles }) => profiles);
    expect(getTeamRoster("en").groups[0].profiles.map(({id}) => id)).toEqual(["lionel-tchami-nfada", "naomi", "vera-buh", "christy-nkongho", "caleb-ketu"]);
    const role = (name: string) => team.find((person) => person.name === name)?.role;
    expect(role("Naomi Ndibabonga")).toBe("Vice-President & Country Director");
    expect(role("Ba’am Yasmiratu")).toBe("PR & Communications Lead");
    expect(role("Brenda Itoe")).toBe("Safeguarding Focal Person");
    expect(role("Ashley B.")).toBe("Accountant");
    expect(new Set(team.map(({ id }) => id)).size).toBe(team.length);
    expect(team.filter(({ role }) => /accountant/i.test(role))).toHaveLength(1);
    expect(team.every(({ portrait }) => portrait === undefined)).toBe(true);
  });
  it("keeps the roster and distinctions in French", () => {
    const team = getTeamRoster("fr").groups.flatMap(({ profiles }) => profiles);
    expect(team.find(({ id }) => id === "naomi")?.role).toBe("Vice-présidente et directrice pays");
    expect(team.find(({ id }) => id === "brenda-itoe")?.role).toBe("Référente pour la protection");
    expect(team.find(({ id }) => id === "ashley-b")?.role).toBe("Comptable");
  });
});
