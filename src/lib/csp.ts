import { getEnv } from "./runtime-env";
import { getCspPolicy } from "./csp-policy.mjs";
import {
  collectInlineStyleAttributeHashes,
  collectInlineStyleElementHashes,
  normalizeCspMetaPolicy,
} from "./csp-meta.mjs";

/** Build CSP directives without unsafe-inline/eval; add per-response script/style hashes. */
export function buildCspDirectives(): string[] {
  return getCspPolicy({
    PUBLIC_SUPABASE_URL: getEnv("PUBLIC_SUPABASE_URL"),
    PUBLIC_UMAMI_URL: getEnv("PUBLIC_UMAMI_URL"),
    PUBLIC_POSTHOG_KEY: getEnv("PUBLIC_POSTHOG_KEY"),
  }).directives;
}

export function buildContentSecurityPolicy(
  inlineScriptHashes: string[] = [],
  inlineStyleAttributeHashes: string[] = [],
  inlineStyleElementHashes: string[] = [],
): string {
  const directives = buildCspDirectives();

  return directives
    .map((directive) => {
      if (!directive.startsWith("script-src ")) return directive;
      const hashes = inlineScriptHashes
        .map((hash) => `'sha256-${hash}'`)
        .join(" ");
      return `${directive} ${hashes}`;
    })
    .map((directive) => {
      if (!directive.startsWith("style-src ")) return directive;
      const hashes = inlineStyleElementHashes
        .map((hash) => `'sha256-${hash}'`)
        .join(" ");
      return hashes ? `${directive} ${hashes}` : directive;
    })
    .map((directive) => {
      if (!directive.startsWith("style-src-attr ")) return directive;
      const hashes = inlineStyleAttributeHashes
        .map((hash) => `'sha256-${hash}'`)
        .join(" ");
      return hashes ? `${directive} ${hashes}` : directive;
    })
    .join("; ");
}

export async function sha256Base64(content: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(content),
  );
  const bytes = new Uint8Array(digest);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

/** Hash inline <script> bodies (no src=) for CSP script-src sha256 allowlisting. */
export async function collectInlineScriptHashes(
  html: string,
): Promise<string[]> {
  const hashes: string[] = [];
  const scriptRe = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  let match: RegExpExecArray | null;
  while ((match = scriptRe.exec(html)) !== null) {
    const attrs = match[1] || "";
    if (/\s+src\s*=/i.test(attrs)) continue;
    const body = match[2] ?? "";
    hashes.push(await sha256Base64(body));
  }
  return hashes;
}

export async function applyContentSecurityPolicy(
  response: Response,
): Promise<Response> {
  const contentType = response.headers.get("content-type") || "";
  const headers = new Headers(response.headers);
  headers.delete("content-length");

  if (!contentType.includes("text/html")) {
    headers.set("Content-Security-Policy", buildContentSecurityPolicy());
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  const html = await normalizeCspMetaPolicy(await response.text());
  const [scriptHashes, styleAttributeHashes, styleElementHashes] =
    await Promise.all([
      collectInlineScriptHashes(html),
      collectInlineStyleAttributeHashes(html),
      collectInlineStyleElementHashes(html),
    ]);
  headers.set(
    "Content-Security-Policy",
    buildContentSecurityPolicy(
      scriptHashes,
      styleAttributeHashes,
      styleElementHashes,
    ),
  );
  return new Response(html, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
