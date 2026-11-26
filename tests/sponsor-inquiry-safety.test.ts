import { readFileSync } from "node:fs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "../src/pages/api/sponsor-inquiry";
import { resetRateLimitStoreForTests } from "../src/lib/rate-limit";

const { notify } = vi.hoisted(() => ({ notify: vi.fn() }));
vi.mock("../src/lib/email", () => ({ sendSponsorInquiryNotification: notify }));

const url = new URL("https://apotidev.org/api/sponsor-inquiry");
const valid = {
  name: "Fixture Name",
  email: "fixture@example.invalid",
  country: "Canada",
  sponsorType: "Individual",
  interest: "Request documents first",
  fundingPurpose: "Fixture: assess ordinary sponsorship reporting.",
  invoiceOrWire: false,
};

function post(body: BodyInit, contentType = "application/json") {
  const request = new Request(url, {
    method: "POST",
    headers: { "Content-Type": contentType, Origin: url.origin },
    body,
  });
  return POST({ request, url } as Parameters<typeof POST>[0]);
}

describe("sponsor inquiry safety and shared options", () => {
  beforeEach(() => {
    notify.mockReset().mockResolvedValue({ success: true });
    resetRateLimitStoreForTests();
  });

  it.each(["Request a short call", "Book a short call"])(
    "notifies using one canonical short-call value for %s",
    async (callPreference) => {
      const response = await post(JSON.stringify({ ...valid, callPreference }));
      expect(response?.status).toBe(200);
      expect(notify).toHaveBeenCalledWith(expect.objectContaining({ callPreference: "Book a short call" }));
    },
  );

  it.each([
    ["None yet", "Sponsor packet"],
    ["Sponsor packet", "Sponsor packet"],
  ])("rejects incompatible or repeated reporting options without notifying", async (...reportingNeeds) => {
    const response = await post(JSON.stringify({ ...valid, reportingNeeds }));
    expect(response?.status).toBe(400);
    expect(notify).not.toHaveBeenCalled();
  });

  it.each([
    ["None yet"],
    ["Sponsor packet", "Registration certificate", "Financial summary", "Safeguarding policy",
      "Project reports", "Invoice or sponsorship agreement", "Board / internal approval support"],
  ])("accepts compatible reporting options", async (...reportingNeeds) => {
    const response = await post(JSON.stringify({ ...valid, reportingNeeds }));
    expect(response?.status).toBe(200);
    expect(notify).toHaveBeenCalledTimes(1);
  });

  it("does not send or echo fallback form data", async () => {
    const response = await post(
      new URLSearchParams({ email: valid.email }),
      "application/x-www-form-urlencoded",
    );
    expect(response?.status).toBe(415);
    expect(response?.headers.get("Cache-Control")).toBe("no-store");
    expect(await response?.text()).not.toContain(valid.email);
    expect(notify).not.toHaveBeenCalled();
  });

  for (const prefix of ["", "/fr"]) {
    it(`keeps the native form inactive and provides fallback help on ${prefix}/sponsor/inquiry`, () => {
      const source = readFileSync(new URL(`../src/pages${prefix}/sponsor/inquiry.astro`, import.meta.url), "utf8");
      const opening = source.match(/<form\b[^>]*>/)?.[0] ?? "";
      expect(opening).toContain('action="/api/sponsor-inquiry"');
      expect(opening).toContain('method="post"');
      expect(opening).toMatch(/\bhidden\b/);
      expect(source).toContain('id="sponsor-inquiry-fallback"');
      expect(source).toContain("mailto:info@apotidev.org");
      expect(source).toContain(`href="${prefix}/resources#due-diligence"`);
      expect(source).not.toContain("ada-sponsor-readiness-packet.pdf");
      expect(source).toContain('value: "Book a short call"');
    });
  }
});
