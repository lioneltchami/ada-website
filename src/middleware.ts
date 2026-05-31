import { defineMiddleware } from "astro:middleware";
import { createClient } from "@supabase/supabase-js";
import { getEnv } from "./lib/runtime-env";

const PROTECTED_ROUTES = ["/dashboard"];
const SENSITIVE_ROUTES = ["/api", "/auth", "/dashboard", "/donate/thank-you"];
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' https://js.stripe.com https://*.js.stripe.com https://static.cloudflareinsights.com 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' https://cdn.sanity.io data: blob:",
  "media-src 'self' https://cdn.sanity.io",
  "connect-src 'self' https://*.supabase.co https://supabase-ada.77.42.83.187.sslip.io https://api.stripe.com https://r.stripe.com https://cdn.sanity.io https://cloudflareinsights.com",
  "frame-src https://js.stripe.com https://*.js.stripe.com https://hooks.stripe.com",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

function applySecurityHeaders(
  response: Response,
  pathname: string,
  isHttps: boolean,
): Response {
  response.headers.set("Content-Security-Policy", CONTENT_SECURITY_POLICY);
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  if (pathname.startsWith("/api")) {
    response.headers.set("X-Robots-Tag", "noindex");
  }
  if (SENSITIVE_ROUTES.some((route) => pathname.startsWith(route))) {
    response.headers.set("X-Robots-Tag", "noindex");
  }
  if (isHttps) {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload",
    );
  }
  return response;
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { cookies, redirect, url } = context;
  const secureCookie = url.protocol === "https:";
  const finish = (response: Response) =>
    applySecurityHeaders(response, url.pathname, secureCookie);

  context.locals.user = null;

  const isProtected = PROTECTED_ROUTES.some((r) => url.pathname.startsWith(r));

  const supabaseUrl = getEnv("PUBLIC_SUPABASE_URL");
  const supabaseKey = getEnv("PUBLIC_SUPABASE_ANON_KEY");

  if (!supabaseUrl || !supabaseKey) {
    if (isProtected) {
      return finish(redirect("/auth/login"));
    }
    return finish(await next());
  }

  const accessToken = cookies.get("sb-access-token")?.value;
  const refreshToken = cookies.get("sb-refresh-token")?.value;

  if (accessToken && refreshToken) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: {
          flowType: "pkce",
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      });

      const {
        data: { user, session },
        error,
      } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (user && !error) {
        context.locals.user = user;

        // Propagate refreshed tokens back to cookies
        if (session?.access_token && session.access_token !== accessToken) {
          cookies.set("sb-access-token", session.access_token, {
            path: "/",
            httpOnly: true,
            secure: secureCookie,
            sameSite: "lax",
            maxAge: 60 * 60,
          });
          if (session.refresh_token) {
            cookies.set("sb-refresh-token", session.refresh_token, {
              path: "/",
              httpOnly: true,
              secure: secureCookie,
              sameSite: "lax",
              maxAge: 60 * 60 * 24 * 7,
            });
          }
        }
      }
    } catch {
      cookies.delete("sb-access-token", { path: "/" });
      cookies.delete("sb-refresh-token", { path: "/" });
    }
  }

  if (isProtected && !context.locals.user) {
    return finish(
      redirect(`/auth/login?redirect=${encodeURIComponent(url.pathname)}`),
    );
  }

  if (
    (url.pathname === "/auth/login" || url.pathname === "/auth/register") &&
    context.locals.user
  ) {
    return finish(redirect("/dashboard"));
  }

  return finish(await next());
});
