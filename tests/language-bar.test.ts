import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const header = readFileSync("src/components/layout/Header.astro", "utf8");
const bar = readFileSync("src/components/layout/LanguageBar.astro", "utf8");

describe("visible top language bar", () => {
  it("places one shared bar above the brand/navigation instead of inside the mobile menu", () => {
    expect(header.match(/<LanguageBar\s*\/>/g)).toHaveLength(1);
    expect(header.indexOf("<LanguageBar />")).toBeLessThan(
      header.indexOf("<nav"),
    );
    expect(header).not.toContain("showLocaleSwitch");
    expect(header).toContain('data-umami-event="nav-donate"');
    expect(header).toContain('id="mobile-menu-btn"');
  });

  it("names both supported languages and marks the selected one without relying on color alone", () => {
    expect(bar).toContain('{ code: "en", label: "English" }');
    expect(bar).toContain('{ code: "fr", label: "Français" }');
    expect(bar).not.toMatch(/Español|code: "es"/);
    expect(bar).toContain('aria-label="Language / Langue"');
    expect(bar).toContain('aria-current="true"');
    expect(bar).toContain("bg-primary-700");
    expect(bar).toContain("lang={code}");
    expect(bar).toContain("hreflang={code}");
  });

  it("uses native links, visible keyboard focus and at least 44px targets", () => {
    expect(bar).toContain("<a");
    expect(bar).toContain("href={localeSwitch.href}");
    expect(bar).toContain("min-h-11");
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
