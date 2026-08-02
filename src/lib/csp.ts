import { getEnv } from "./runtime-env";

const BASE_SCRIPT_SRC = [
  "'self'",
  "https://js.stripe.com",
  "https://*.js.stripe.com",
  "https://static.cloudflareinsights.com",
];

const BASE_CONNECT_SRC = [
  "'self'",
  "https://*.supabase.co",
  "https://api.stripe.com",
  "https://r.stripe.com",
  "https://cdn.sanity.io",
  "https://cloudflareinsights.com",
];

function originFromUrl(value: string | undefined): string | null {
  if (!value) return null;
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

/** Build CSP directives. script-src has no 'unsafe-inline'; hashes added per HTML response. */
export function buildCspDirectives(): string[] {
  const scriptSrc = [...BASE_SCRIPT_SRC];
  const connectSrc = [...BASE_CONNECT_SRC];

  const supabaseOrigin = originFromUrl(getEnv("PUBLIC_SUPABASE_URL"));
  if (
    supabaseOrigin &&
    !supabaseOrigin.endsWith(".supabase.co") &&
    !connectSrc.includes(supabaseOrigin)
  ) {
    connectSrc.push(supabaseOrigin);
  }

  const umamiOrigin = originFromUrl(
    getEnv("PUBLIC_UMAMI_URL") || "https://cloud.umami.is",
  );
  if (umamiOrigin) {
    if (!scriptSrc.includes(umamiOrigin)) scriptSrc.push(umamiOrigin);
    if (!connectSrc.includes(umamiOrigin)) connectSrc.push(umamiOrigin);
  }

  const posthogKey = getEnv("PUBLIC_POSTHOG_KEY");
  if (posthogKey) {
    for (const host of ["https://*.posthog.com", "https://*.i.posthog.com"]) {
      if (!scriptSrc.includes(host)) scriptSrc.push(host);
      if (!connectSrc.includes(host)) connectSrc.push(host);
    }
  }

  return [
    "default-src 'self'",
    `script-src ${scriptSrc.join(" ")}`,
    // Astro/Tailwind scoped styles + Stripe Elements still need inline styles.
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' https://cdn.sanity.io data: blob:",
    "media-src 'self' https://cdn.sanity.io",
    `connect-src ${connectSrc.join(" ")}`,
    "frame-src https://js.stripe.com https://*.js.stripe.com https://hooks.stripe.com",
    // PostHog session replay loads a worker from blob: when enabled in project settings.
    posthogKey ? "worker-src 'self' blob: data:" : "worker-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ];
}

export function buildContentSecurityPolicy(
  inlineScriptHashes: string[] = [],
): string {
  const directives = buildCspDirectives();
  if (inlineScriptHashes.length === 0) return directives.join("; ");

  return directives
    .map((directive) => {
      if (!directive.startsWith("script-src ")) return directive;
      const hashes = inlineScriptHashes
        .map((hash) => `'sha256-${hash}'`)
        .join(" ");
      return `${directive} ${hashes}`;
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
    if (/\bsrc\s*=/i.test(attrs)) continue;
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

  const html = await response.text();
  const hashes = await collectInlineScriptHashes(html);
  headers.set("Content-Security-Policy", buildContentSecurityPolicy(hashes));
  return new Response(html, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
