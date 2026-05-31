import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "../../lib/supabase-browser";

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let mounted = true;
    let unsubscribe: (() => void) | undefined;

    void getSupabaseBrowserClient()
      .then((client) => {
        if (!mounted) return;

        const { data } = client.auth.onAuthStateChange((event) => {
          if (event === "PASSWORD_RECOVERY") {
            setStatus("Reset link confirmed. Enter a new password below.");
            setCheckingSession(false);
          }
        });
        unsubscribe = () => data.subscription.unsubscribe();

        void client.auth.getSession().then(({ data: sessionData }) => {
          if (!mounted) return;
          if (sessionData.session) {
            setStatus("Reset link confirmed. Enter a new password below.");
          }
          setCheckingSession(false);
        });
      })
      .catch((err: any) => {
        setError(err.message || "Password reset is not configured yet.");
        setCheckingSession(false);
      });

    return () => {
      mounted = false;
      unsubscribe?.();
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("");
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const supabase = await getSupabaseBrowserClient();
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });
      if (updateError) throw updateError;
      setStatus("Password updated successfully. You can now log in.");
      setPassword("");
      setConfirm("");
    } catch (err: any) {
      setError(
        err.message ||
          "Unable to update password. Please request a new reset link.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {checkingSession && (
        <p className="text-sm text-gray-600" role="status" aria-live="polite">
          Checking reset link...
        </p>
      )}
      <div>
        <label
          htmlFor="new-password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          New Password
        </label>
        <input
          type="password"
          id="new-password"
          name="password"
          required
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
        <p className="mt-1 text-xs text-gray-500">Minimum 8 characters</p>
      </div>
      <div>
        <label
          htmlFor="confirm-password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Confirm Password
        </label>
        <input
          type="password"
          id="confirm-password"
          name="confirm"
          required
          minLength={8}
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>
      <button
        type="submit"
        disabled={loading || checkingSession}
        className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Updating..." : "Update Password"}
      </button>
      {status && (
        <p
          className="text-sm text-green-700 font-medium"
          role="status"
          aria-live="polite"
        >
          {status}
        </p>
      )}
      {error && (
        <p className="text-sm text-red-600" role="alert" aria-live="polite">
          {error}
        </p>
      )}
    </form>
  );
}
