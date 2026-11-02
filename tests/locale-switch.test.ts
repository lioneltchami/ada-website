import { describe, expect, it } from "vitest";
import { readdirSync } from "node:fs";
import { sep } from "node:path";
import { getLocale } from "../src/i18n";
import {
  getLocaleSwitchPath,
  hasLocaleAlternative,
  normalizeLocalePath,
} from "../src/i18n/routes";

describe("shared locale switch route coverage", () => {
  it("matches every existing EN/FR Astro route pair and keeps unpaired screens out", () => {
    const files = readdirSync("src/pages", { recursive: true })
      .filter(
        (file): file is string =>
          typeof file === "string" && file.endsWith(".astro"),
      )
      .map((file) => file.split(sep).join("/"));
    const routes = new Set(
      files.map((file) => {
        const path = file.replace(/\.astro$/, "");
        if (path === "index") return "/";
        if (path.endsWith("/index")) return `/${path.slice(0, -6)}`;
        return `/${path}`;
      }),
    );
    const isAuthQueryRoute = (path: string) =>
      path.startsWith("/auth/") && getLocaleSwitchPath(path, "en") !== null;

    for (const pathname of routes) {
      if (pathname.startsWith("/api/")) continue;
      const isFrench = pathname === "/fr" || pathname.startsWith("/fr/");
      const englishPath = isFrench
        ? pathname === "/fr"
          ? "/"
          : pathname.slice(3)
        : pathname;
      const counterpart = isFrench
        ? englishPath
        : englishPath === "/"
          ? "/fr"
          : `/fr${englishPath}`;
      const hasSourceCounterpart = routes.has(counterpart);

      if (isAuthQueryRoute(pathname)) {
        expect(getLocaleSwitchPath(pathname, "en")).not.toBeNull();
      } else {
        expect(hasLocaleAlternative(pathname), pathname).toBe(
          hasSourceCounterpart,
        );
      }
    }
  });

  it("normalizes localized paths and Astro trailing slashes for eligibility", () => {
    for (const pathname of [
      "/contact",
      "/contact/",
      "/fr/contact",
      "/fr/contact/",
      "/sponsor/inquiry/",
      "/fr/sponsor/inquiry/",
    ]) {
      expect(hasLocaleAlternative(pathname), pathname).toBe(true);
    }
    expect(normalizeLocalePath("/fr/")).toBe("/");
    expect(getLocale("/fragments")).toBe("en");
  });

  it("covers all public page families with EN and FR source counterparts", () => {
    const pairedPages = [
      "/",
      "/about/",
      "/contact/",
      "/donate/",
      "/donate/thank-you/",
      "/gallery/",
      "/get-involved/",
      "/impact-scorecard/",
      "/monthly/",
      "/partners/",
      "/privacy/",
      "/projects/",
      "/projects/community-water/",
      "/projects/archive/",
      "/projects/archive/education-orphans/",
      "/resources/",
      "/sponsor/",
      "/sponsor/inquiry/",
      "/stories/",
      "/stories/example-story/",
      "/team/",
      "/terms/",
      "/transparency/",
    ];
    for (const pathname of pairedPages) {
      expect(hasLocaleAlternative(pathname), pathname).toBe(true);
      expect(
        hasLocaleAlternative(`/fr${pathname === "/" ? "" : pathname}`),
        pathname,
      ).toBe(true);
    }
    expect(hasLocaleAlternative("/404")).toBe(false);
    expect(hasLocaleAlternative("/dashboard/donations/")).toBe(false);
    expect(hasLocaleAlternative("/api/contact")).toBe(false);
  });

  it("switches locales while preserving trailing-slash style", () => {
    expect(getLocaleSwitchPath("/contact/", "en")?.href).toBe("/fr/contact/");
    expect(getLocaleSwitchPath("/fr/contact/", "fr")?.href).toBe("/contact/");
    expect(getLocaleSwitchPath("/", "en")?.href).toBe("/fr");
    expect(getLocaleSwitchPath("/fr/", "fr")?.href).toBe("/");
  });

  it("preserves only an approved sponsor tier or thank-you frequency", () => {
    expect(
      getLocaleSwitchPath(
        "/sponsor/inquiry/",
        "en",
        new URLSearchParams(
          "budgetRange=%242%2C500-%245%2C000&token=do-not-copy",
        ),
      )?.href,
    ).toBe("/fr/sponsor/inquiry/?budgetRange=%242%2C500-%245%2C000");
    expect(
      getLocaleSwitchPath(
        "/donate/thank-you/",
        "en",
        new URLSearchParams("frequency=monthly&session_id=do-not-copy"),
      )?.href,
    ).toBe("/fr/donate/thank-you/?frequency=monthly");
  });

  it("localizes auth routes through a safe locale query only", () => {
    expect(getLocaleSwitchPath("/auth/login/", "en")?.href).toBe(
      "/auth/login/?locale=fr",
    );
    expect(
      getLocaleSwitchPath(
        "/auth/reset-password/",
        "en",
        new URLSearchParams("locale=fr&token_hash=secret"),
      ),
    ).toBeNull();
    expect(
      getLocaleSwitchPath(
        "/auth/email-verified/",
        "fr",
        new URLSearchParams("code=secret"),
      ),
    ).toBeNull();
  });
});
