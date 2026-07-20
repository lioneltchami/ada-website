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
    expect(csp).toContain("script-src 'self'");
    expect(csp).toContain("https://*.supabase.co");
    expect(csp).toContain("style-src 'self' 'unsafe-inline'");
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
});
