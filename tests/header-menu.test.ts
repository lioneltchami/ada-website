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
      {
        hash: "#access_token=redacted",
        search: "?locale=fr",
        pathname: "/auth/register",
      },
      {
        hash: "",
        search: "?locale=fr&code=redacted",
        pathname: "/auth/register",
      },
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
        setAttribute(name: string) {
          if (name === "hidden") this.revealed = false;
        },
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
      setAttribute(name: string) {
        if (name === "hidden") this.revealed = false;
      },
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
      location: { hash: "", search: "?locale=fr", pathname: "/auth/register" },
      addEventListener: () => undefined,
    };
    runInNewContext(menuScript, { document, window, URLSearchParams });
    expect(link.revealed).toBe(true);
    expect(classes.has("hidden")).toBe(false);
  });

  it("rechecks auth callback safety on same-document fragment and history changes", () => {
    const listeners = new Map<string, () => void>();
    const classes = new Set(["hidden"]);
    const link = {
      hidden: true,
      classList: {
        add: (name: string) => classes.add(name),
        remove: (name: string) => classes.delete(name),
      },
      closest: () => null,
      setAttribute(name: string) {
        if (name === "hidden") this.hidden = true;
      },
      removeAttribute(name: string) {
        if (name === "hidden") this.hidden = false;
      },
    };
    const document = {
      documentElement: { lang: "fr" },
      getElementById: () => null,
      querySelectorAll: (selector: string) =>
        selector === "[data-auth-locale-switch]" ? [link] : [],
      addEventListener: () => undefined,
    };
    const window = {
      location: { hash: "", search: "?locale=fr", pathname: "/auth/login" },
      addEventListener: (event: string, callback: () => void) =>
        listeners.set(event, callback),
    };
    runInNewContext(menuScript, { document, window, URLSearchParams });
    expect(link.hidden).toBe(false);
    window.location.hash = "#access_token=redacted";
    listeners.get("hashchange")!();
    expect(link.hidden).toBe(true);
    expect(classes.has("hidden")).toBe(true);
    window.location.hash = "";
    listeners.get("hashchange")!();
    expect(link.hidden).toBe(false);
    window.location.search = "?code=redacted";
    listeners.get("popstate")!();
    expect(link.hidden).toBe(true);
    window.location.search = "?locale=fr";
    listeners.get("popstate")!();
    expect(link.hidden).toBe(false);
  });

  it("preserves only a recognized sponsor tier on the runtime locale switch", () => {
    const links = [{ href: "/fr/sponsor/inquiry/" }];
    const document = {
      documentElement: { lang: "en" },
      getElementById: () => null,
      querySelectorAll: (selector: string) =>
        selector === "[data-locale-switch]" ? links : [],
      addEventListener: () => undefined,
    };
    const window = {
      location: {
        hash: "",
        origin: "https://apotidev.org",
        pathname: "/sponsor/inquiry/",
        search: "?budgetRange=%242%2C500-%245%2C000&token=do-not-copy",
      },
      addEventListener: () => undefined,
    };

    runInNewContext(menuScript, {
      document,
      window,
      URL,
      URLSearchParams,
      Set,
    });

    expect(links[0].href).toBe(
      "/fr/sponsor/inquiry/?budgetRange=%242%2C500-%245%2C000",
    );
  });

  it("does not copy an unrecognized sponsor query value into locale links", () => {
    const links = [{ href: "/fr/sponsor/inquiry/" }];
    const document = {
      documentElement: { lang: "en" },
      getElementById: () => null,
      querySelectorAll: (selector: string) =>
        selector === "[data-locale-switch]" ? links : [],
      addEventListener: () => undefined,
    };
    const window = {
      location: {
        hash: "",
        origin: "https://apotidev.org",
        pathname: "/sponsor/inquiry/",
        search:
          "?budgetRange=%242%2C500-%245%2C000%20OR%20secret&token=do-not-copy",
      },
      addEventListener: () => undefined,
    };

    runInNewContext(menuScript, {
      document,
      window,
      URL,
      URLSearchParams,
      Set,
    });

    expect(links[0].href).toBe("/fr/sponsor/inquiry/");
  });
});

describe("thank-you locale-switch frequency", () => {
  function runLocaleSwitch(pathname: string, search: string, href: string) {
    const links = [{ href }];
    const document = {
      documentElement: { lang: pathname.startsWith("/fr/") ? "fr" : "en" },
      getElementById: () => null,
      querySelectorAll: (selector: string) =>
        selector === "[data-locale-switch]" ? links : [],
      addEventListener: () => undefined,
    };
    const window = {
      location: {
        hash: "#payment-intent-test-do-not-copy",
        origin: "https://apotidev.org",
        pathname,
        search,
      },
      addEventListener: () => undefined,
    };
    runInNewContext(menuScript, {
      document,
      window,
      URL,
      URLSearchParams,
      Set,
    });
    return links[0].href;
  }

  it.each(["monthly", "one-time"])(
    "preserves approved %s frequency in both directions without payment data",
    (frequency) => {
      for (const [source, target] of [
        ["/donate/thank-you/", "/fr/donate/thank-you/"],
        ["/fr/donate/thank-you", "/donate/thank-you"],
      ]) {
        expect(
          runLocaleSwitch(
            source,
            `?frequency=${frequency}&payment_intent=secret&session_id=secret&redirect_status=succeeded`,
            `${target}?unexpected=secret#secret`,
          ),
        ).toBe(`${target}?frequency=${frequency}`);
      }
    },
  );

  it.each([
    "",
    "?frequency=yearly",
    "?frequency=Monthly",
    "?frequency=monthly%20secret",
    "?session_id=secret",
  ])("does not copy unrecognized or missing frequency: %s", (search) => {
    expect(
      runLocaleSwitch("/donate/thank-you/", search, "/fr/donate/thank-you/"),
    ).toBe("/fr/donate/thank-you/");
  });

  it("does not transfer donation frequency to unrelated page families", () => {
    expect(runLocaleSwitch("/about/", "?frequency=monthly", "/fr/about/")).toBe(
      "/fr/about/",
    );
    expect(
      runLocaleSwitch(
        "/sponsor/inquiry/",
        "?frequency=monthly",
        "/fr/sponsor/inquiry/",
      ),
    ).toBe("/fr/sponsor/inquiry/");
  });
});
