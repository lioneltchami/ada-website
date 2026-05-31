import type { APIRoute } from "astro";
import { jsonResponse } from "../../lib/api-requests";
import { getEnv } from "../../lib/runtime-env";

export const GET: APIRoute = async () => {
  return jsonResponse({
    stripePublishableKey: getEnv("PUBLIC_STRIPE_PUBLISHABLE_KEY") || "",
    supabaseUrl: getEnv("PUBLIC_SUPABASE_URL") || "",
    supabaseAnonKey: getEnv("PUBLIC_SUPABASE_ANON_KEY") || "",
  });
};

export const prerender = false;
