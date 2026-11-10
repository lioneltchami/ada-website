import { describe, expect, it } from "vitest";
import { createHash } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { buildBlogPosting } from "../src/lib/structured-data";
import { assertNoUnapprovedImageReferences } from "../scripts/story-hero-verifier.mjs";

const source = (path: string) => readFileSync(path, "utf8");
const hash = (path: string) => createHash("sha256").update(readFileSync(path)).digest("hex");
const primary = "/brand/ada-primary-lockup.png";
const symbol = "/brand/ada-symbol.png";

describe("approved transparent ADA branding", () => {
  it("preserves the exact supplied primary lockup and symbol, including their alpha channels", () => {
    expect(hash(`public${primary}`)).toBe("84d7b9b5ffe325d1819961b0ea26a484ff7f1c54ba768e3a8e09158518614883");
    expect(hash(`public${symbol}`)).toBe("aec6240ac1da3148869e3f625d32b998e6e7e203154be3cdb2761fc0222ad0b3");
    // The old URL remains useful to previously sent receipts but serves only the new artwork.
    expect(hash("public/brand/ada-logo.png")).toBe(hash(`public${symbol}`));
  });

  it("uses the supplied transparent symbol for the PNG favicon, with no stale boat icons", () => {
    expect(hash("public/favicon.png")).toBe(hash(`public${symbol}`));
    expect(existsSync("public/favicon.svg")).toBe(false);
    expect(existsSync("public/favicon.ico")).toBe(false);
    const layout = source("src/layouts/BaseLayout.astro");
    expect(layout).toContain('type="image/png" href="/favicon.png?v=4"');
    expect(layout).not.toMatch(/favicon\.(svg|ico)/);
  });

  it("uses the primary lockup in organization and article publisher structured data", () => {
    expect(source("src/layouts/BaseLayout.astro")).toContain(`logo: "https://apotidev.org${primary}"`);
    const schema = buildBlogPosting({ title: "Test", description: "Test", url: "https://apotidev.org/stories/test" });
    expect(schema.publisher.logo.url).toBe(`https://apotidev.org${primary}`);
  });

  it("uses the primary lockup for both languages' story social previews", () => {
    for (const locale of ["", "fr/"]) {
      for (const page of ["index.astro", "[slug].astro"]) {
        const content = source(`src/pages/${locale}stories/${page}`);
        expect(content).toContain(`ogImage="${primary}"`);
        expect(content).not.toContain("ada-logo.png");
      }
    }
    expect(() => assertNoUnapprovedImageReferences(`<meta property="og:image" content="https://apotidev.org${primary}"><link rel="icon" href="/favicon.png?v=4">`)).not.toThrow();
  });

  it("uses the symbol without a colored badge in donation email and receipt templates", () => {
    for (const path of ["src/lib/email.ts", "src/lib/receipt.ts"]) {
      const content = source(path);
      expect(content).toContain(`https://apotidev.org${symbol}`);
      expect(content).not.toContain("ada-logo.png");
      expect(content).not.toContain("background: #f8fafc");
    }
  });
});
