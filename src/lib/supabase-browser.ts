import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let supabase: SupabaseClient | null = null;
let configPromise: Promise<{
  supabaseUrl: string;
  supabaseAnonKey: string;
}> | null = null;

async function getPublicSupabaseConfig() {
  if (!configPromise) {
    configPromise = fetch("/api/public-config")
      .then((response) => (response.ok ? response.json() : null))
      .then((config) => ({
        supabaseUrl:
          config?.supabaseUrl ||
          (import.meta as any).env?.PUBLIC_SUPABASE_URL ||
          "",
        supabaseAnonKey:
          config?.supabaseAnonKey ||
          (import.meta as any).env?.PUBLIC_SUPABASE_ANON_KEY ||
          "",
      }));
  }

  return configPromise;
}

export async function getSupabaseBrowserClient() {
  if (!supabase) {
    const { supabaseUrl, supabaseAnonKey } = await getPublicSupabaseConfig();
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Supabase is not configured yet.");
    }
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }

  return supabase;
}
