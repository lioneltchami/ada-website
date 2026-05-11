import { Component, useState, useEffect, type ReactNode } from "react";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

const AMOUNTS = [10, 25, 50, 100, 250];

const IMPACT_MAP: Record<number, string> = {
  10: 'Provides a meal for a family',
  25: 'School supplies for 2 children',
  50: 'Widow support for a week',
  100: 'Skills training for one woman',
  250: 'Healthcare for 5 families',
};

const FALLBACK_PROJECT_NAMES: Record<string, string> = {
  'widow-support': 'Widow Support Program',
  'education-orphans': 'Education for Orphans',
  'women-empowerment': 'Young Women Empowerment',
  'emergency-relief': 'Emergency Relief Fund',
  'education-drive': 'Annual Education Drive',
  'christmas-giving': 'Christmas Giving Campaign',
};

interface DonorInfo {
  name: string;
  email: string;
  anonymous: boolean;
}

// Issue 1: Error boundary wrapper (must be class component to catch render errors)
class ErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

function StripeErrorFallback() {
  return (
    <div role="alert" className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
      <p className="font-medium">Payment system unavailable</p>
      <p>Please refresh the page or try again later. If the problem persists, contact us at info@apotidev.org.</p>
    </div>
  );
}

function PaymentStep({ onBack }: { onBack: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError("");

    try {
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: `${window.location.origin}/donate/thank-you` },
      });

      if (submitError) {
        setError(submitError.message || "Payment failed. Please try again.");
        setLoading(false);
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <p className="text-xs text-gray-500 text-center mt-3 flex items-center justify-center gap-1">
        <span>🔒</span> Secured by Stripe • 256-bit encryption • Cancel monthly anytime
      </p>
      {error && (
        <p className="text-sm text-red-600" role="alert" aria-live="polite">{error}</p>
      )}
      <div className="flex gap-3">
        <button type="button" onClick={onBack} className="px-4 py-2.5 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50">
          Back
        </button>
        <button type="submit" disabled={!stripe || loading} className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? "Processing..." : "Complete Donation"}
        </button>
      </div>
    </form>
  );
}

export default function DonationForm({ projects }: { projects?: { slug: string; title: string }[] }) {
  const projectMap: Record<string, string> = projects?.length
    ? Object.fromEntries(projects.map(p => [p.slug, p.title]))
    : FALLBACK_PROJECT_NAMES;

  const [step, setStep] = useState(1);
  const [frequency, setFrequency] = useState<"one-time" | "monthly">("monthly");
  const [amount, setAmount] = useState(25);
  const [customAmount, setCustomAmount] = useState("");
  const [donor, setDonor] = useState<DonorInfo>({ name: "", email: "", anonymous: false });
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Issue 2 & 7: Deferred stripe loading with loading state
  const [stripeInstance, setStripeInstance] = useState<Stripe | null>(null);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [stripeError, setStripeError] = useState("");
  const [project, setProject] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const p = params.get("project");
    if (p && projectMap[p]) setProject(p);
  }, []);

  const selectedAmount = customAmount ? Number(customAmount) : amount;

  // Issue 6: Client-side validation for custom amounts
  function isValidAmount(): boolean {
    if (customAmount) {
      const num = Number(customAmount);
      return !isNaN(num) && num >= 5 && isFinite(num);
    }
    return selectedAmount >= 5;
  }

  async function handleStep2Submit(e: React.FormEvent) {
    e.preventDefault();
    // Issue 6: Validate before submitting
    if (!donor.name || !donor.email || !isValidAmount()) {
      if (customAmount && !isValidAmount()) {
        setError("Please enter a valid amount of $5 or more.");
        return;
      }
      return;
    }

    setLoading(true);
    setError("");

    try {
      const endpoint = frequency === "monthly" ? "/api/create-subscription" : "/api/create-payment-intent";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(selectedAmount * 100),
          currency: "usd",
          type: frequency,
          donorName: donor.name,
          donorEmail: donor.email,
          isAnonymous: donor.anonymous,
          projectSlug: project,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create payment");

      setClientSecret(data.clientSecret);

      // Issue 2: Load Stripe only when reaching step 3
      setStripeLoading(true);
      setStripeError("");
      try {
        const stripe = await loadStripe(
          (import.meta as any).env?.PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
        );
        if (!stripe) throw new Error("Failed to load payment system");
        setStripeInstance(stripe);
      } catch (err: any) {
        setStripeError(err.message || "Failed to load payment system");
      } finally {
        setStripeLoading(false);
      }

      setStep(3);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {["Gift Details", "Your Info", "Payment"].map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step > i + 1 ? "bg-primary-600 text-white" : step === i + 1 ? "bg-primary-600 text-white" : "bg-gray-200 text-gray-500"}`}>
              {step > i + 1 ? "✓" : i + 1}
            </div>
            <span className={`text-xs hidden sm:inline ${step === i + 1 ? "text-primary-700 font-medium" : "text-gray-500"}`}>{label}</span>
            {i < 2 && <div className="w-8 h-0.5 bg-gray-200" />}
          </div>
        ))}
      </div>

      {/* Step 1: Gift Details */}
      {step === 1 && (
        <div className="space-y-6">
          {project && (
            <p className="text-sm font-medium text-primary-700 bg-primary-50 px-3 py-2 rounded-lg">
              Donating to: {projectMap[project]}
            </p>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gift Type</label>
            <div className="grid grid-cols-2 gap-2">
              {(["one-time", "monthly"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFrequency(type)}
                  className={`px-4 py-2.5 text-sm font-medium rounded-lg border-2 transition-colors ${frequency === type ? "border-primary-500 bg-primary-50 text-primary-700" : "border-gray-200 text-gray-700 hover:border-gray-300"}`}
                >
                  {type === "one-time" ? "One-Time" : "Monthly"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount (USD)</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {AMOUNTS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => { setAmount(a); setCustomAmount(''); }}
                  aria-pressed={amount === a && !customAmount}
                  className={`relative px-3 py-2.5 text-sm font-medium rounded-lg border-2 transition-colors ${amount === a && !customAmount ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}
                >
                  {a === 25 && <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-bold text-primary-600 bg-primary-50 px-1.5 rounded">Popular</span>}
                  ${a}
                </button>
              ))}
            </div>
            {!customAmount && IMPACT_MAP[amount] && (
              <p className="text-sm text-primary-700 font-medium text-center mt-2">
                ✨ Your ${amount}{frequency === 'monthly' ? '/mo' : ''} = {IMPACT_MAP[amount]}
              </p>
            )}
            {/* Issue 4: Proper label for custom amount input */}
            <label htmlFor="custom-amount" className="block text-sm font-medium text-gray-700 mt-3 mb-1">
              Custom amount
            </label>
            <input
              id="custom-amount"
              type="number"
              min="5"
              step="any"
              placeholder="Enter amount ($5 minimum)"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Issue 6: Show validation error for invalid custom amounts */}
          {customAmount && !isValidAmount() && (
            <p role="alert" aria-live="polite" className="text-sm text-red-600">
              Please enter a valid amount of $5 or more.
            </p>
          )}

          <button
            type="button"
            onClick={() => isValidAmount() && setStep(2)}
            disabled={!isValidAmount()}
            className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            Continue — ${selectedAmount}
            {frequency === "monthly" ? "/month" : ""}
          </button>
        </div>
      )}

      {/* Step 2: Donor Info */}
      {step === 2 && (
        <form onSubmit={handleStep2Submit} className="space-y-4">
          <div>
            <label htmlFor="donor-name" className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input
              id="donor-name"
              type="text"
              required
              minLength={2}
              value={donor.name}
              onChange={(e) => setDonor({ ...donor, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label htmlFor="donor-email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              id="donor-email"
              type="email"
              required
              value={donor.email}
              onChange={(e) => setDonor({ ...donor, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={donor.anonymous}
              onChange={(e) => setDonor({ ...donor, anonymous: e.target.checked })}
              className="rounded border-gray-300"
            />
            Make my donation anonymous
          </label>

          {/* Issue 5: role="alert" and aria-live on error messages */}
          {error && (
            <p role="alert" aria-live="polite" className="text-sm text-red-600">{error}</p>
          )}

          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(1)} className="px-4 py-2.5 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50">
              Back
            </button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50">
              {loading ? "Setting up payment..." : "Continue to Payment"}
            </button>
          </div>
        </form>
      )}

      {/* Step 3: Payment */}
      {step === 3 && (
        <>
          {/* Issue 7: Loading state while Stripe resolves */}
          {stripeLoading && (
            <div className="text-center py-8">
              <div className="inline-block w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
              <p className="mt-2 text-sm text-gray-600">Loading payment system...</p>
            </div>
          )}

          {/* Issue 5: Stripe load error with role="alert" */}
          {stripeError && (
            <div role="alert" aria-live="polite" className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              <p>{stripeError}</p>
              <button type="button" onClick={() => setStep(2)} className="mt-2 text-sm font-medium underline">
                Go back
              </button>
            </div>
          )}

          {/* Issue 1: Error boundary around Stripe Elements */}
          {!stripeLoading && !stripeError && clientSecret && stripeInstance && (
            <ErrorBoundary fallback={<StripeErrorFallback />}>
              <Elements stripe={stripeInstance} options={{ clientSecret, appearance: { theme: "stripe" } }}>
                <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                  <p><strong>${selectedAmount}{frequency === "monthly" ? "/month" : ""}</strong> — {donor.anonymous ? "Anonymous" : donor.name}</p>
                </div>
                <PaymentStep onBack={() => setStep(2)} />
              </Elements>
            </ErrorBoundary>
          )}
        </>
      )}
    </div>
  );
}
