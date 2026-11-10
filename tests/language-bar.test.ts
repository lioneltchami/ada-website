import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const header = readFileSync("src/components/layout/Header.astro", "utf8");
const bar = readFileSync("src/components/layout/LanguageBar.astro", "utf8");

describe("inline header language selector", () => {
  it("places one selector immediately before Donate in the same header actions row", () => {
    expect(header.match(/<LanguageBar\s*\/>/g)).toHaveLength(1);
    expect(header.indexOf("<LanguageBar />")).toBeGreaterThan(
      header.indexOf("data-header-actions"),
    );
    expect(header.indexOf("<LanguageBar />")).toBeLessThan(
      header.indexOf('data-umami-event="nav-donate"'),
    );
    expect(header.indexOf("<LanguageBar />")).toBeLessThan(
      header.indexOf('id="mobile-menu"'),
    );
    expect(bar).not.toContain("border-b");
    expect(bar).not.toContain("max-w-7xl");
    expect(header).not.toContain("showLocaleSwitch");
    expect(header).toContain('data-umami-event="nav-donate"');
    expect(header).toContain('id="mobile-menu-btn"');
  });

  it("restores the approved single-row brand and centered desktop navigation", () => {
    expect(header).toContain('src="/brand/ada-symbol.png"');
    expect(header).toContain("xl:grid-cols-[auto_minmax(0,1fr)_auto]");
    expect(header).toContain("justify-center");
    expect(header).toContain("data-desktop-navigation");
    expect(header.indexOf("data-desktop-navigation")).toBeLessThan(
      header.indexOf("data-header-actions"),
    );
    expect(header).not.toContain("N6 secondary link row");
    expect(header).toContain("xl:text-base");
    expect(header).toContain("underline decoration-2 underline-offset-4");
  });

  it("names both supported languages and marks the selected one without relying on color alone", () => {
    expect(bar).toContain('{ code: "en", label: "English", compact: "EN" }');
    expect(bar).toContain('{ code: "fr", label: "Français", compact: "FR" }');
    expect(bar).not.toMatch(/Español|code: "es"/);
    expect(bar).toContain('aria-label="Language / Langue"');
    expect(bar).toContain('aria-current="true"');
    expect(bar).toContain("bg-primary-700");
    expect(bar).toContain("underline decoration-2 underline-offset-4");
    expect(bar).toContain('class="sr-only sm:not-sr-only"');
    expect(bar).toContain("lang={code}");
    expect(bar).toContain("hreflang={code}");
  });

  it("uses native links, visible keyboard focus and at least 44px targets", () => {
    expect(bar).toContain("<a");
    expect(bar).toContain("href={localeSwitch.href}");
    expect(bar).toContain("min-h-11");
    expect(bar).toContain("min-w-11");
    expect(bar).toContain("focus-visible:outline-2");
    expect(bar).not.toContain('role="switch"');
    expect(bar).not.toContain("tabindex=");
  });

  it("labels homepage fallbacks and leaves auth links hidden until the safety check", () => {
    expect(bar).toContain("English homepage");
    expect(bar).toContain("Accueil en français");
    expect(bar).toContain("hidden={localeSwitch.authRoute}");
    expect(bar).toMatch(
      /\[data-auth-locale-switch\]\[hidden\]\s*\{\s*display: none;/,
    );
  });
});
