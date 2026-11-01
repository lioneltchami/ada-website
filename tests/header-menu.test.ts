import { readFileSync } from "node:fs";
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
});
