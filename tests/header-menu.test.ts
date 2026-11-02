import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it } from "vitest";

const header = readFileSync("src/components/layout/Header.astro", "utf8");
const menuScript = readFileSync("public/scripts/header-menu.js", "utf8");
const cspPolicy = readFileSync("src/lib/csp-policy.mjs", "utf8");

describe("mobile header menu delivery", () => {
  it("loads its controller as a same-origin external script", () => {
    expect(header).toContain(
      '<script is:inline src="/scripts/header-menu.js"></script>',
    );
    expect(header).not.toMatch(/<script>\s*const header/);
    expect(cspPolicy).toContain("\"'self'\"");
  });

  it("keeps toggle, Escape, and accessible state behavior", () => {
    expect(menuScript).toContain('btn?.addEventListener("click"');
    expect(menuScript).toContain('event.key === "Escape"');
    expect(menuScript).toContain('setAttribute("aria-expanded", "true")');
    expect(menuScript).toContain('setAttribute("aria-expanded", "false")');
  });

  it("only reveals auth locale switches when there is no URL fragment or extra query data", () => {
    expect(menuScript).toContain(
      'document.querySelectorAll("[data-auth-locale-switch]")',
    );
    expect(menuScript).toContain('window.location.hash === ""');
    expect(menuScript).toContain(
      'authQueryKeys.every((key) => key === "locale")',
    );
    expect(menuScript).toContain('link.removeAttribute("hidden")');
    expect(menuScript).toContain('link.classList.remove("hidden")');
    expect(menuScript).toContain('link.classList.add("block")');
  });

  it("keeps auth locale links hidden around callback hashes or extra query values", () => {
    for (const location of [
      { hash: "#access_token=redacted", search: "?locale=fr" },
      { hash: "", search: "?locale=fr&code=redacted" },
    ]) {
      const classes = new Set(["hidden"]);
      const link = {
        revealed: false,
        classList: {
          remove(name: string) {
            classes.delete(name);
          },
          add(name: string) {
            classes.add(name);
          },
        },
        closest: () => null,
        removeAttribute(name: string) {
          if (name === "hidden") this.revealed = true;
        },
      };
      const document = {
        documentElement: { lang: "fr" },
        getElementById: () => null,
        querySelectorAll: () => [link],
        addEventListener: () => undefined,
      };
      const window = { location, addEventListener: () => undefined };
      runInNewContext(menuScript, { document, window, URLSearchParams });
      expect(link.revealed).toBe(false);
      expect(classes.has("hidden")).toBe(true);
    }

    const classes = new Set(["hidden"]);
    const link = {
      revealed: false,
      classList: {
        remove(name: string) {
          classes.delete(name);
        },
        add(name: string) {
          classes.add(name);
        },
      },
      closest: () => null,
      removeAttribute(name: string) {
        if (name === "hidden") this.revealed = true;
      },
    };
    const document = {
      documentElement: { lang: "fr" },
      getElementById: () => null,
      querySelectorAll: () => [link],
      addEventListener: () => undefined,
    };
    const window = {
      location: { hash: "", search: "?locale=fr" },
      addEventListener: () => undefined,
    };
    runInNewContext(menuScript, { document, window, URLSearchParams });
    expect(link.revealed).toBe(true);
    expect(classes.has("hidden")).toBe(false);
  });
});
