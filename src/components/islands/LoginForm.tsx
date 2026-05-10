import { useState } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let supabase: SupabaseClient | null = null;
function getSupabase() {
  if (!supabase) {
    const url = (import.meta as any).env?.PUBLIC_SUPABASE_URL || "";
    const key = (import.meta as any).env?.PUBLIC_SUPABASE_ANON_KEY || "";
    if (!url || !key) throw new Error("Supabase not configured");
    supabase = createClient(url, key);
  }
  return supabase;
}

function getSafeRedirect(param: string | null): string {
  if (!param) return "/dashboard";
  try {
    const url = new URL(param, window.location.origin);
    if (url.origin !== window.location.origin) return "/dashboard";
    return url.pathname + url.search;
  } catch {
    return "/dashboard";
  }
}

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: authError } = await getSupabase().auth.signInWithPassword({ email, password });

      if (authError) throw authError;

      if (data.session) {
        const res = await fetch("/api/auth/set-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accessToken: data.session.access_token,
            refreshToken: data.session.refresh_token,
          }),
        });
        if (!res.ok) throw new Error("Failed to establish session");

        const params = new URLSearchParams(window.location.search);
        window.location.href = getSafeRedirect(params.get("redirect"));
      }
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input id="login-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
      </div>
      <div>
        <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input id="login-password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
      </div>

      {error && <p className="text-sm text-red-600" role="alert" aria-live="polite">{error}</p>}

      <button type="submit" disabled={loading} className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50">
        {loading ? "Signing in..." : "Sign In"}
      </button>

      <div className="flex items-center justify-between text-sm">
        <a href="/auth/forgot-password" className="text-primary-600 hover:underline">Forgot password?</a>
        <a href="/auth/register" className="text-primary-600 hover:underline">Create account</a>
      </div>
    </form>
  );
}
