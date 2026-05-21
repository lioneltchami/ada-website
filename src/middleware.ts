import { defineMiddleware } from "astro:middleware";
import { createClient } from "@supabase/supabase-js";

const PROTECTED_ROUTES = ["/dashboard"];
const SENSITIVE_ROUTES = ["/api", "/auth", "/dashboard", "/donate/thank-you"];

function applySecurityHeaders(response: Response, pathname: string, isHttps: boolean): Response {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  if (pathname.startsWith("/api")) {
    response.headers.set("X-Robots-Tag", "noindex");
  }
  if (SENSITIVE_ROUTES.some((route) => pathname.startsWith(route))) {
    response.headers.set("X-Robots-Tag", "noindex");
  }
  if (isHttps) {
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  }
  return response;
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { cookies, redirect, url } = context;
  const secureCookie = url.protocol === "https:";
  const finish = (response: Response) => applySecurityHeaders(response, url.pathname, secureCookie);

  context.locals.user = null;

  const isProtected = PROTECTED_ROUTES.some((r) => url.pathname.startsWith(r));

  const supabaseUrl = (import.meta as any).env?.PUBLIC_SUPABASE_URL;
  const supabaseKey = (import.meta as any).env?.PUBLIC_SUPABASE_ANON_KEY;

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
        auth: { flowType: "pkce", autoRefreshToken: false, detectSessionInUrl: false },
      });

      const { data: { user, session }, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (user && !error) {
        context.locals.user = user;

        // Propagate refreshed tokens back to cookies
        if (session?.access_token && session.access_token !== accessToken) {
          cookies.set('sb-access-token', session.access_token, {
            path: '/', httpOnly: true, secure: secureCookie, sameSite: 'lax', maxAge: 60 * 60,
          });
          if (session.refresh_token) {
            cookies.set('sb-refresh-token', session.refresh_token, {
              path: '/', httpOnly: true, secure: secureCookie, sameSite: 'lax', maxAge: 60 * 60 * 24 * 7,
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
    return finish(redirect(`/auth/login?redirect=${encodeURIComponent(url.pathname)}`));
  }

  if ((url.pathname === "/auth/login" || url.pathname === "/auth/register") && context.locals.user) {
    return finish(redirect("/dashboard"));
  }

  return finish(await next());
});
