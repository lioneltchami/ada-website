import { defineMiddleware } from "astro:middleware";
import { createClient } from "@supabase/supabase-js";

const PROTECTED_ROUTES = ["/dashboard"];

export const onRequest = defineMiddleware(async (context, next) => {
  const { cookies, redirect, url } = context;

  context.locals.user = null;

  const isProtected = PROTECTED_ROUTES.some((r) => url.pathname.startsWith(r));

  const supabaseUrl = (import.meta as any).env?.PUBLIC_SUPABASE_URL;
  const supabaseKey = (import.meta as any).env?.PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    if (isProtected) {
      return redirect("/auth/login");
    }
    return next();
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
            path: '/', httpOnly: true, secure: true, sameSite: 'lax', maxAge: 60 * 60,
          });
          if (session.refresh_token) {
            cookies.set('sb-refresh-token', session.refresh_token, {
              path: '/', httpOnly: true, secure: true, sameSite: 'lax', maxAge: 60 * 60 * 24 * 7,
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
    return redirect(`/auth/login?redirect=${encodeURIComponent(url.pathname)}`);
  }

  if ((url.pathname === "/auth/login" || url.pathname === "/auth/register") && context.locals.user) {
    return redirect("/dashboard");
  }

  return next();
});
