import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

export const POST: APIRoute = async ({ request, cookies, redirect, url }) => {
  const origin = request.headers.get("origin");
  if (!origin || origin !== url.origin) {
    return new Response("Forbidden", { status: 403 });
  }

  const accessToken = cookies.get("sb-access-token")?.value;
  const refreshToken = cookies.get("sb-refresh-token")?.value;

  if (accessToken && refreshToken) {
    const supabaseUrl = (import.meta as any).env?.PUBLIC_SUPABASE_URL;
    const supabaseKey = (import.meta as any).env?.PUBLIC_SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: { autoRefreshToken: false, detectSessionInUrl: false },
      });
      await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
      await supabase.auth.signOut();
    }
  }

  cookies.delete("sb-access-token", { path: "/" });
  cookies.delete("sb-refresh-token", { path: "/" });
  return redirect("/");
};

export const prerender = false;
