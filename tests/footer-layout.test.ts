import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it } from "vitest";

const footer = readFileSync("src/components/layout/Footer.astro", "utf8");
const layout = readFileSync("src/layouts/PageLayout.astro", "utf8");
const script = readFileSync("public/scripts/footer-donate.js", "utf8");
const styles = readFileSync("src/styles/global.css", "utf8");
const section = readFileSync("src/components/layout/Section.astro", "utf8");

describe("compact shared footer", () => {
  it("uses the approved transparent symbol against a warm cream backing", () => {
    expect(footer).toContain('src="/brand/ada-symbol.png"');
    expect(footer).not.toContain('src="/brand/ada-logo.png"');
    expect(footer).not.toMatch(/(?:^|[\s"])bg-white(?:[\s"\/]|$)|filter:|brightness-/);
    expect(footer).toContain("bg-[#efece4] p-1");
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

  it("retains contact, social, and legal links, but not a nonfunctional newsletter promise", () => {
    for (const content of [
      "mailto:",
      "https://wa.me/",
      "socialFacebook",
      "socialInstagram",
      "socialTwitter",
      "i18n.footer.privacy",
      "i18n.footer.terms",
      "415/G.37/D14/VolI/SAAJP",
      "min-h-11 min-w-11",
      "text-xs text-gray-300",
    ]) {
      expect(footer).toContain(content);
    }
    for (const content of [
      footer,
      readFileSync("src/pages/donate/thank-you.astro", "utf8"),
      readFileSync("src/pages/fr/donate/thank-you.astro", "utf8"),
    ]) {
      expect(content).not.toContain("NewsletterSignup");
    }
  });

  it("separates dark closing content and reserves legal space where the chatbot appears", () => {
    expect(section).toContain("data-section-tone={background}");
    expect(styles).toContain('[data-section-tone="dark"]:last-child');
    expect(layout).toContain("<Footer reserveChatSpace={showChatbot} />");
    expect(footer).toContain("data-footer-chat-clearance={reserveChatSpace || undefined}");
    expect(styles).toContain("[data-site-footer][data-footer-chat-clearance]");
  });

  it("keeps the orange CTA tokens accessible against white text in both states", () => {
    for (const token of [500, 600]) {
      const hex = styles.match(new RegExp(`--color-secondary-${token}: #([0-9a-f]{6})`, "i"))?.[1];
      expect(hex).toBeDefined();
      const linear = [0, 2, 4].map(i => {
        const channel = parseInt(hex!.slice(i, i + 2), 16) / 255;
        return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
      });
      const luminance = linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
      expect(1.05 / (luminance + 0.05)).toBeGreaterThanOrEqual(4.5);
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
