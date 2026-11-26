import { describe, expect, it } from "vitest";
import { christmasAnnouncements } from "../src/lib/christmas-announcements";
import { listUpcomingAnnouncements } from "../src/lib/upcoming-announcements";

describe("homepage announcements", () => {
  it("includes both dated events from the same fallback as Projects", () => {
    expect(listUpcomingAnnouncements([], { today: "2026-11-26" })).toEqual([
      { slug: "christmas-giving-buea-dec-2026", title: "Christmas Giving Outreach · Buea", date: "2026-12-20" },
      { slug: "christmas-giving-bamenda-dec-2026", title: "Christmas Giving Outreach · Bamenda", date: "2026-12-20" },
    ]);
  });

  it("localizes titles without using tracked fundraising fields", () => {
    const [event] = listUpcomingAnnouncements([], { today: "2026-11-26", locale: "fr" });
    expect(event.title).toBe("Action de solidarité de Noël · Buea");
    expect(event).not.toHaveProperty("goalAmount");
    expect(event).not.toHaveProperty("raisedAmount");
  });

  it("does not re-add paused or fundable CMS projects from the fallback", () => {
    const [buea, bamenda] = christmasAnnouncements;
    const records = [{ ...buea, status: "paused" as const }, { ...bamenda, announcementOnly: false }];
    expect(listUpcomingAnnouncements(records, { today: "2026-11-26" })).toEqual([]);
  });

  it.each(["2026-12-20", "2026-12-21", "2026-12-27"])("removes non-upcoming events on %s", today => {
    expect(listUpcomingAnnouncements([], { today })).toEqual([]);
  });
});
