import { describe, expect, it } from "vitest";
import { getAboutTimelineEvent } from "../src/lib/about-timeline";

describe("About timeline and released education history", () => {
  it("corrects the known CMS and fallback onset claims without inventing a new start year", () => {
    for (const event of [
      "Orphan Care and Education program begins",
      "Education program begins — 20 orphaned children sponsored for school",
    ]) {
      expect(getAboutTimelineEvent("2023", event, "en")).toBe("Back-to-school supplies in Buea");
    }
    expect(getAboutTimelineEvent("2023", "Programme d'éducation — 20 orphelins parrainés pour l'école", "fr")).toBe("Fournitures scolaires à Buea");
    expect(getAboutTimelineEvent("2023", "Programme d’éducation – 20 orphelins parrainés pour l’école", "fr")).toBe("Fournitures scolaires à Buea");
  });

  it("preserves every unrelated milestone and the released 2022 chronology", () => {
    for (const [year, event] of [
      ["2022", "School visits in February and May"],
      ["2023", "Community clean-up activities"],
      ["2024", "Bamenda office opened"],
      ["2021", "Founded in Buea"],
    ]) {
      expect(getAboutTimelineEvent(year, event, "en")).toBe(event);
      expect(getAboutTimelineEvent(year, event, "fr")).toBe(event);
    }
  });
});
