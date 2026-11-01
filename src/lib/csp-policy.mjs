const BASE_SCRIPT_SOURCES = [
  "'self'",
  "https://js.stripe.com",
  "https://*.js.stripe.com",
  "https://static.cloudflareinsights.com",
];

const BASE_STYLE_SOURCES = ["'self'", "https://fonts.googleapis.com"];
const BASE_FONT_SOURCES = ["'self'", "https://fonts.gstatic.com"];
const BASE_IMG_SOURCES = ["'self'", "https://cdn.sanity.io", "data:", "blob:"];
const BASE_MEDIA_SOURCES = ["'self'", "https://cdn.sanity.io"];
const BASE_CONNECT_SOURCES = [
  "'self'",
  "https://*.supabase.co",
  "https://api.stripe.com",
  "https://r.stripe.com",
  "https://cdn.sanity.io",
  "https://cloudflareinsights.com",
];
const BASE_FRAME_SOURCES = [
  "https://js.stripe.com",
  "https://*.js.stripe.com",
  "https://hooks.stripe.com",
];

function originFromUrl(value) {
  if (!value) return null;
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

/** Shared source allowlists for Astro's build CSP and the Worker response CSP. */
export function getCspPolicy(env = {}) {
  const scriptSources = [...BASE_SCRIPT_SOURCES];
  const styleSources = [...BASE_STYLE_SOURCES];
  const fontSources = [...BASE_FONT_SOURCES];
  const imgSources = [...BASE_IMG_SOURCES];
  const mediaSources = [...BASE_MEDIA_SOURCES];
  const connectSources = [...BASE_CONNECT_SOURCES];
  const frameSources = [...BASE_FRAME_SOURCES];

  const supabaseOrigin = originFromUrl(env.PUBLIC_SUPABASE_URL);
  if (
    supabaseOrigin &&
    !supabaseOrigin.endsWith(".supabase.co") &&
    !connectSources.includes(supabaseOrigin)
  ) {
    connectSources.push(supabaseOrigin);
  }

  const umamiOrigin = originFromUrl(
    env.PUBLIC_UMAMI_URL || "https://cloud.umami.is",
  );
  if (umamiOrigin) {
    if (!scriptSources.includes(umamiOrigin)) scriptSources.push(umamiOrigin);
    if (!connectSources.includes(umamiOrigin)) connectSources.push(umamiOrigin);
  }

  if (env.PUBLIC_POSTHOG_KEY) {
    for (const host of ["https://*.posthog.com", "https://*.i.posthog.com"]) {
      if (!scriptSources.includes(host)) scriptSources.push(host);
      if (!connectSources.includes(host)) connectSources.push(host);
    }
  }

  const directives = [
    "default-src 'self'",
    `script-src ${scriptSources.join(" ")}`,
    `style-src ${styleSources.join(" ")}`,
    "style-src-attr 'unsafe-hashes'",
    `font-src ${fontSources.join(" ")}`,
    `img-src ${imgSources.join(" ")}`,
    `media-src ${mediaSources.join(" ")}`,
    `connect-src ${connectSources.join(" ")}`,
    `frame-src ${frameSources.join(" ")}`,
    env.PUBLIC_POSTHOG_KEY
      ? "worker-src 'self' blob: data:"
      : "worker-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ];

  return {
    directives,
    scriptSources,
    styleSources,
  };
}
