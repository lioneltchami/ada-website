import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const ProfileSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  phone: z.string().trim().max(40).optional().default(""),
});

export const POST: APIRoute = async ({ request, cookies, url }) => {
  const origin = request.headers.get("origin");
  if (!origin || origin !== url.origin) {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { "Content-Type": "application/json" } });
  }

  const accessToken = cookies.get("sb-access-token")?.value;
  const refreshToken = cookies.get("sb-refresh-token")?.value;
  if (!accessToken || !refreshToken) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }

  const supabaseUrl = (import.meta as any).env?.PUBLIC_SUPABASE_URL;
  const supabaseKey = (import.meta as any).env?.PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return new Response(JSON.stringify({ error: "Supabase not configured" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }

  try {
    const data = ProfileSchema.parse(await request.json());
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { autoRefreshToken: false, detectSessionInUrl: false },
    });

    const { error: sessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    if (sessionError) throw sessionError;

    const { data: updated, error } = await supabase.auth.updateUser({
      data: { full_name: data.fullName, phone: data.phone },
    });
    if (error) throw error;

    return new Response(JSON.stringify({ user: updated.user }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    if (err.name === "ZodError") {
      return new Response(JSON.stringify({ error: "Invalid profile data" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    return new Response(JSON.stringify({ error: "Profile update failed" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
};

export const prerender = false;
