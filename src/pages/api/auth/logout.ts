import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";
import { getEnv } from "../../../lib/runtime-env";

export const POST: APIRoute = async ({ request, cookies, redirect, url }) => {
  const origin = request.headers.get("origin");
  if (!origin || origin !== url.origin) {
    return new Response("Forbidden", { status: 403 });
  }

  const accessToken = cookies.get("sb-access-token")?.value;
  const refreshToken = cookies.get("sb-refresh-token")?.value;

  if (accessToken && refreshToken) {
    const supabaseUrl = getEnv("PUBLIC_SUPABASE_URL");
    const supabaseKey = getEnv("PUBLIC_SUPABASE_ANON_KEY");
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: { autoRefreshToken: false, detectSessionInUrl: false },
      });
      try {
        await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        await supabase.auth.signOut();
      } catch {
        // Cookie deletion below is the local logout guarantee even when the
        // remote Supabase session revocation is unavailable.
      }
    }
  }

  cookies.delete("sb-access-token", { path: "/" });
  cookies.delete("sb-refresh-token", { path: "/" });
  return redirect("/");
};

export const prerender = false;
