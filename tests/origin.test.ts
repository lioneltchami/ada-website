import { describe, expect, it } from "vitest";
import { isAllowedOrigin } from "../src/lib/origin";

describe("isAllowedOrigin", () => {
  it("allows the request URL origin when PUBLIC_SITE_URL is not configured", () => {
    expect(isAllowedOrigin("http://127.0.0.1:4321", "http://127.0.0.1:4321", undefined)).toBe(true);
  });

  it("uses PUBLIC_SITE_URL when configured", () => {
    expect(isAllowedOrigin("https://apotidev.org", "http://127.0.0.1:4321", "https://apotidev.org")).toBe(true);
    expect(isAllowedOrigin("http://127.0.0.1:4321", "http://127.0.0.1:4321", "https://apotidev.org")).toBe(false);
  });

  it("rejects missing origins", () => {
    expect(isAllowedOrigin(null, "https://apotidev.org", "https://apotidev.org")).toBe(false);
  });

  it("only allows localhost aliases when the configured origin is local", () => {
    expect(isAllowedOrigin("http://localhost:4321", "http://127.0.0.1:4321", "http://127.0.0.1:4321")).toBe(true);
    expect(isAllowedOrigin("http://localhost:4321", "https://apotidev.org", "https://apotidev.org")).toBe(false);
  });
});
