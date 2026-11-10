import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it } from "vitest";

const footer = readFileSync("src/components/layout/Footer.astro", "utf8");
const layout = readFileSync("src/layouts/PageLayout.astro", "utf8");
const script = readFileSync("public/scripts/footer-donate.js", "utf8");

describe("compact shared footer", () => {
  it("uses the current transparent symbol without a white badge", () => {
    expect(footer).toContain('src="/brand/ada-symbol.png"');
    expect(footer).not.toContain('src="/brand/ada-logo.png"');
    expect(footer).not.toMatch(/bg-white|filter:|brightness-/);
    expect(footer).toContain('width="40"');
    expect(footer).toContain('height="40"');
  });

  it("has one localized Donate navigation link and no duplicate CTA banner", () => {
    expect(footer.match(/localePath\("\/donate", locale\)/g)).toHaveLength(1);
    expect(footer).toContain("label: i18n.nav.donate");
    expect(footer).not.toMatch(
      /ctaSubtitle|donateNow|showDonationCta|bg-secondary-500/,
    );
    expect(footer).not.toMatch(/py-14|py-16|pb-20/);
  });

  it("retains contact, newsletter, social, and legal links", () => {
    for (const content of [
      "NewsletterSignup",
      "mailto:",
      "https://wa.me/",
      "socialFacebook",
      "socialInstagram",
      "socialTwitter",
      "i18n.footer.privacy",
      "i18n.footer.terms",
    ]) {
      expect(footer).toContain(content);
    }
  });

  it("does not add a floating Donate on either homepage", () => {
    expect(layout).toMatch(
      /const showFloatingDonate = !\(\s*pathname === "\/" \|\|\s*pathname === "\/fr"/,
    );
  });

  it("loads the mobile footer visibility behavior under the existing CSP", () => {
    expect(layout).toContain("data-floating-donate");
    expect(footer).toContain("data-site-footer");
    expect(layout).toContain(
      '<script is:inline src="/scripts/footer-donate.js"></script>',
    );
  });
});

describe("mobile Donate footer visibility", () => {
  it("hides the shortcut at the footer and restores it repeatedly when scrolling back", () => {
    let callback: (entries: { isIntersecting: boolean }[]) => void;
    let observed: unknown;
    const classes = new Set<string>();
    const attributes = new Map<string, string>();
    const donate = {
      classList: {
        toggle: (value: string, enabled: boolean) =>
          enabled ? classes.add(value) : classes.delete(value),
      },
      setAttribute: (key: string, value: string) => attributes.set(key, value),
      tabIndex: 0,
    };
    const footerElement = {};
    class Observer {
      constructor(fn: typeof callback) {
        callback = fn;
      }
      observe(element: unknown) {
        observed = element;
      }
    }
    runInNewContext(script, {
      document: {
        querySelector: (selector: string) =>
          selector === "[data-floating-donate]" ? donate : footerElement,
      },
      window: { IntersectionObserver: Observer },
      IntersectionObserver: Observer,
    });
    expect(observed).toBe(footerElement);
    for (const isIntersecting of [false, true, false, true, false]) {
      callback!([{ isIntersecting }]);
      expect(classes.has("invisible")).toBe(isIntersecting);
      expect(attributes.get("aria-hidden")).toBe(String(isIntersecting));
      expect(donate.tabIndex).toBe(isIntersecting ? -1 : 0);
    }
  });

  it("safely does nothing on pages without a floating shortcut", () => {
    expect(() =>
      runInNewContext(script, {
        document: { querySelector: () => null },
        window: {},
      }),
    ).not.toThrow();
  });
});
