import { afterEach, describe, expect, it, vi } from "vitest";

describe("CSP helpers", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("does not hardcode sslip.io or script unsafe-inline", async () => {
    vi.stubEnv("PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    const { buildContentSecurityPolicy } = await import("../src/lib/csp");
    const csp = buildContentSecurityPolicy();

    expect(csp).not.toContain("sslip.io");
    expect(csp).not.toMatch(/script-src[^;]*'unsafe-inline'/);
    expect(csp).not.toContain("'unsafe-inline'");
    expect(csp).not.toContain("'unsafe-eval'");
    expect(csp).toContain("script-src 'self'");
    expect(csp).toContain("https://*.supabase.co");
    expect(csp).toContain("style-src 'self' https://fonts.googleapis.com");
    expect(csp).toContain("style-src-attr 'unsafe-hashes'");
  });

  it("adds non-supabase PUBLIC_SUPABASE_URL origin to connect-src", async () => {
    vi.stubEnv(
      "PUBLIC_SUPABASE_URL",
      "https://supabase-ada.77.42.83.187.sslip.io",
    );
    const { buildContentSecurityPolicy } = await import("../src/lib/csp");
    const csp = buildContentSecurityPolicy();

    expect(csp).toContain("https://supabase-ada.77.42.83.187.sslip.io");
  });

  it("allows PostHog hosts when PUBLIC_POSTHOG_KEY is set", async () => {
    vi.stubEnv("PUBLIC_POSTHOG_KEY", "phc_test_key");
    const { buildContentSecurityPolicy } = await import("../src/lib/csp");
    const csp = buildContentSecurityPolicy();

    expect(csp).toContain("https://*.posthog.com");
    expect(csp).toContain("https://*.i.posthog.com");
    expect(csp).toContain("worker-src 'self' blob: data:");
  });

  it("shares the exact source allowlist with Astro's per-page CSP", async () => {
    vi.stubEnv("PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("PUBLIC_UMAMI_URL", "https://analytics.example.org");
    vi.stubEnv("PUBLIC_POSTHOG_KEY", "configured");
    const [{ buildCspDirectives }, { getCspPolicy }] = await Promise.all([
      import("../src/lib/csp"),
      import("../src/lib/csp-policy.mjs"),
    ]);
    const policy = getCspPolicy({
      PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      PUBLIC_UMAMI_URL: "https://analytics.example.org",
      PUBLIC_POSTHOG_KEY: "configured",
    });

    expect(policy.directives).toEqual(buildCspDirectives());
    expect(policy.directives.join("; ")).not.toContain("'unsafe-inline'");
    expect(policy.directives.join("; ")).not.toContain("'unsafe-eval'");
  });

  it("hashes inline scripts and skips src scripts", async () => {
    const {
      collectInlineScriptHashes,
      buildContentSecurityPolicy,
      sha256Base64,
    } = await import("../src/lib/csp");
    const inline = '{"@type":"Organization"}';
    const html = `
      <script src="/bundle.js"></script>
      <script type="application/ld+json">${inline}</script>
    `;

    const hashes = await collectInlineScriptHashes(html);
    expect(hashes).toEqual([await sha256Base64(inline)]);

    const csp = buildContentSecurityPolicy(hashes);
    expect(csp).toContain(`'sha256-${hashes[0]}'`);
  });

  it("does not treat data-src or data-style as security directives", async () => {
    const { collectInlineScriptHashes } = await import("../src/lib/csp");
    const { collectInlineStyleAttributeHashes } =
      await import("../src/lib/csp-meta.mjs");
    const html =
      '<script data-src="/lazy.js">run()</script><div data-style="color:red"></div>';

    expect(await collectInlineScriptHashes(html)).toHaveLength(1);
    expect(await collectInlineStyleAttributeHashes(html)).toEqual([]);
  });

  it("applies CSP with hashes to HTML responses", async () => {
    const { applyContentSecurityPolicy, sha256Base64 } =
      await import("../src/lib/csp");
    const inline = "console.log(1)";
    const response = new Response(
      `<html><body><script>${inline}</script></body></html>`,
      { headers: { "Content-Type": "text/html; charset=utf-8" } },
    );

    const secured = await applyContentSecurityPolicy(response);
    const csp = secured.headers.get("Content-Security-Policy") || "";
    const hash = await sha256Base64(inline);
    expect(csp).toContain(`'sha256-${hash}'`);
    expect(csp).not.toMatch(/script-src[^;]*'unsafe-inline'/);
  });

  it("hashes only the emitted style attributes without unsafe-inline", async () => {
    const { applyContentSecurityPolicy, sha256Base64 } =
      await import("../src/lib/csp");
    const response = new Response(
      '<html><head><meta http-equiv="content-security-policy" content="style-src \'self\' \'sha256-style\'"></head><body><div style="width: 81.25%"></div></body></html>',
      { headers: { "Content-Type": "text/html; charset=utf-8" } },
    );

    const secured = await applyContentSecurityPolicy(response);
    const html = await secured.text();

    const styleHash = await sha256Base64("width: 81.25%");
    expect(html).toContain(
      `style-src-attr 'unsafe-hashes' 'sha256-${styleHash}'`,
    );
    expect(html).not.toContain("'unsafe-inline'");
    const header = secured.headers.get("Content-Security-Policy") || "";
    expect(header).toContain(
      `style-src-attr 'unsafe-hashes' 'sha256-${styleHash}'`,
    );
    expect(header).not.toContain("'unsafe-inline'");
  });

  it("hashes inline style elements on dynamic HTML responses", async () => {
    const { applyContentSecurityPolicy, sha256Base64 } =
      await import("../src/lib/csp");
    const style = ".auth-form { color: #123; }";
    const response = new Response(
      `<html><head><style>${style}</style></head><body><main>Login</main></body></html>`,
      { headers: { "Content-Type": "text/html; charset=utf-8" } },
    );

    const secured = await applyContentSecurityPolicy(response);
    const csp = secured.headers.get("Content-Security-Policy") || "";
    const hash = await sha256Base64(style);
    expect(csp).toContain(
      `style-src 'self' https://fonts.googleapis.com 'sha256-${hash}'`,
    );
    expect(csp).not.toContain("'unsafe-inline'");
  });

  it("adds an early CSP meta policy to standalone static HTML", async () => {
    const {
      collectInlineStyleAttributeHashes,
      collectInlineStyleElementHashes,
      normalizeCspMetaPolicy,
    } = await import("../src/lib/csp-meta.mjs");
    const style = "body{color:#123}";
    const attribute = "width: 50%";
    const html = `<html><head><meta charset="utf-8"><link rel="stylesheet" href="/a.css"><style>${style}</style></head><body><div style="${attribute}"></div></body></html>`;
    const normalized = await normalizeCspMetaPolicy(html, [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self'",
      "frame-ancestors 'none'",
    ]);
    const metaIndex = normalized.indexOf(
      '<meta http-equiv="Content-Security-Policy"',
    );

    expect(metaIndex).toBeGreaterThan(normalized.indexOf('charset="utf-8"'));
    expect(metaIndex).toBeLessThan(
      normalized.indexOf('<link rel="stylesheet"'),
    );
    expect(normalized).not.toContain("frame-ancestors");
    expect(normalized).not.toContain("'unsafe-inline'");
    for (const hash of await collectInlineStyleElementHashes(normalized)) {
      expect(normalized).toContain(`'sha256-${hash}'`);
    }
    for (const hash of await collectInlineStyleAttributeHashes(normalized)) {
      expect(normalized).toContain(`'sha256-${hash}'`);
    }
  });
});
