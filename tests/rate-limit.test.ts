import { afterEach, describe, expect, it, vi } from "vitest";
import {
  checkRateLimit,
  clientIp,
  resetRateLimitStoreForTests,
} from "../src/lib/rate-limit";

describe("rate limit", () => {
  afterEach(() => {
    resetRateLimitStoreForTests();
  });

  it("reads Cloudflare connecting IP first", () => {
    const request = new Request("https://apotidev.org/api/contact", {
      headers: {
        "cf-connecting-ip": "203.0.113.10",
        "x-forwarded-for": "198.51.100.1, 203.0.113.10",
      },
    });
    expect(clientIp(request)).toBe("203.0.113.10");
  });

  it("allows traffic under the limit and blocks after", () => {
    const key = "contact:203.0.113.10";
    const options = { limit: 2, windowMs: 60_000 };

    expect(checkRateLimit(key, options).ok).toBe(true);
    expect(checkRateLimit(key, options).ok).toBe(true);

    const blocked = checkRateLimit(key, options);
    expect(blocked.ok).toBe(false);
    if (!blocked.ok) {
      expect(blocked.retryAfterSec).toBeGreaterThan(0);
    }
  });

  it("resets after the window expires", () => {
    const key = "newsletter:203.0.113.10";
    const options = { limit: 1, windowMs: 1_000 };
    const now = 1_000_000;

    expect(checkRateLimit(key, options, now).ok).toBe(true);
    expect(checkRateLimit(key, options, now).ok).toBe(false);
    expect(checkRateLimit(key, options, now + 1_001).ok).toBe(true);
  });
});
