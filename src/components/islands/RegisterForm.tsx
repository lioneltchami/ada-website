import { useState } from "react";
import { getSupabaseBrowserClient } from "../../lib/supabase-browser";

export default function RegisterForm({ locale = "en" }: { locale?: "en" | "fr" }) {
  const fr = locale === "fr";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError(fr ? "Les mots de passe ne correspondent pas." : "Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError(fr ? "Le mot de passe doit contenir au moins 8 caractères." : "Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const supabase = await getSupabaseBrowserClient();
      const emailRedirectTo = new URL(
        `/auth/email-verified${fr ? "?locale=fr" : ""}`,
        import.meta.env.PUBLIC_SITE_URL || window.location.origin,
      ).toString();
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
          emailRedirectTo,
        },
      });

      if (authError) throw authError;

      window.location.href = `/auth/verify-email${fr ? "?locale=fr" : ""}`;
    } catch (err: any) {
      setError(
        fr ? "L'inscription a échoué. Réessayez ou utilisez une autre adresse e-mail." : "Registration failed. Please try again or use a different email.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="reg-name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {fr ? "Nom complet" : "Full Name"}
        </label>
        <input
          id="reg-name"
          type="text"
          required
          minLength={2}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>
      <div>
        <label
          htmlFor="reg-email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {fr ? "E-mail" : "Email"}
        </label>
        <input
          id="reg-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>
      <div>
        <label
          htmlFor="reg-password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {fr ? "Mot de passe" : "Password"}
        </label>
        <input
          id="reg-password"
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
        <p className="mt-1 text-xs text-gray-500">{fr ? "8 caractères minimum" : "Minimum 8 characters"}</p>
      </div>
      <div>
        <label
          htmlFor="reg-confirm"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {fr ? "Confirmer le mot de passe" : "Confirm Password"}
        </label>
        <input
          id="reg-confirm"
          type="password"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600" role="alert" aria-live="polite">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50"
      >
        {loading ? (fr ? "Création du compte…" : "Creating account...") : (fr ? "Créer un compte" : "Create Account")}
      </button>

      <p className="text-center text-sm text-gray-600">
        {fr ? "Vous avez déjà un compte ?" : "Already have an account?"}{" "}
        <a href={fr ? "/auth/login?locale=fr" : "/auth/login"} className="text-primary-600 hover:underline">
          {fr ? "Se connecter" : "Sign in"}
        </a>
      </p>
    </form>
  );
}
