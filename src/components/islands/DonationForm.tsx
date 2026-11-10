import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { Component, type ReactNode, useEffect, useRef, useState } from "react";

const AMOUNTS = [10, 25, 50, 100, 250];

type FormLocale = "en" | "fr";

const FALLBACK_PROJECT_NAMES: Record<FormLocale, Record<string, string>> = {
  en: {
    "widow-support": "Widow Support Program",
    "education-orphans": "Education for Orphans",
    "emergency-relief": "Emergency Relief Fund",
    "education-drive": "Annual Education Drive",
    "christmas-giving": "Christmas Giving Campaign",
  },
  fr: {
    "widow-support": "Programme de soutien aux veuves",
    "education-orphans": "Éducation des orphelins",
    "emergency-relief": "Fonds d'urgence",
    "education-drive": "Campagne scolaire annuelle",
    "christmas-giving": "Campagne de Noël",
  },
};

const FORM_COPY = {
  en: {
    steps: ["Gift Details", "Your Info", "Payment"],
    paymentUnavailable: "Payment system unavailable",
    paymentUnavailableHelp:
      "Please refresh the page or try again later. If the problem persists, contact us at info@apotidev.org.",
    paymentFailed: "Payment failed. Please try again.",
    networkError: "Network error. Please check your connection and try again.",
    securePayment: "Secured by Stripe",
    eligibleWallets:
      "Apple Pay or Google Pay may appear when supported by your device and browser.",
    shortCheckout:
      "No account required. Choose a gift, enter your name and email, then pay securely. Apple Pay or Google Pay may appear when supported by your device and browser.",
    back: "Back",
    processing: "Processing...",
    completeDonation: "Complete Donation",
    donatingTo: "Donating to:",
    monthlyGiving: "Monthly giving",
    monthlyOnlyNote:
      "Monthly gifts renew each month. To change or cancel one, contact ADA.",
    giftType: "Gift Type",
    oneTime: "One-Time",
    monthly: "Monthly",
    monthlyNote:
      "Monthly gifts renew each month. To change or cancel one, contact ADA.",
    amount: "Amount (USD)",
    currency: "USD",
    monthlyUnit: "month",
    customAmount: "Custom amount",
    customPlaceholder: "USD 5 minimum",
    amountError:
      "Enter an amount from USD 5 to USD 100,000, with no more than two decimal places.",
    donationSummary: "Donation summary",
    gift: "Gift",
    project: "Project",
    generalFund: "General Fund",
    continue: "Continue",
    fullName: "Full Name *",
    email: "Email *",
    anonymous: "Make my donation anonymous",
    taxNote:
      "ADA is registered as an NGO in Cameroon (N° 415/G.37/D14/VolI/SAAJP). Gifts are not presented as tax-deductible in Canada, the US, the UK, or the EU. Confirmed gifts receive an emailed receipt for your records.",
    settingUpPayment: "Setting up payment...",
    continueToPayment: "Continue to Payment",
    loadingPayment: "Loading payment system...",
    goBack: "Go back",
    anonymousName: "Anonymous",
    paymentHandled: "Payment details are handled securely by Stripe.",
    paymentLoadFailed: "Failed to load payment system",
    failedToCreatePayment: "Failed to create payment",
    thankYouPath: "/donate/thank-you",
  },
  fr: {
    steps: ["Don", "Vos infos", "Paiement"],
    paymentUnavailable: "Système de paiement indisponible",
    paymentUnavailableHelp:
      "Veuillez actualiser la page ou réessayer plus tard. Si le problème persiste, contactez-nous à info@apotidev.org.",
    paymentFailed: "Le paiement a échoué. Veuillez réessayer.",
    networkError: "Erreur réseau. Vérifiez votre connexion et réessayez.",
    securePayment: "Paiement sécurisé par Stripe",
    eligibleWallets:
      "Apple Pay ou Google Pay peuvent être proposés selon votre appareil.",
    shortCheckout:
      "Aucun compte n'est requis. Choisissez un don, saisissez votre nom et votre e-mail, puis payez en toute sécurité. Apple Pay ou Google Pay peuvent être proposés selon votre appareil.",
    back: "Retour",
    processing: "Traitement...",
    completeDonation: "Finaliser le don",
    donatingTo: "Don pour :",
    monthlyGiving: "Don mensuel",
    monthlyOnlyNote:
      "Les dons sont renouvelés chaque mois. Pour modifier ou annuler un don, contactez ADA.",
    giftType: "Type de don",
    oneTime: "Ponctuel",
    monthly: "Mensuel",
    monthlyNote:
      "Les dons sont renouvelés chaque mois. Pour modifier ou annuler un don, contactez ADA.",
    amount: "Montant (USD)",
    currency: "USD",
    monthlyUnit: "mois",
    customAmount: "Montant personnalisé",
    customPlaceholder: "Minimum : 5 USD",
    amountError:
      "Saisissez un montant entre 5 USD et 100 000 USD, avec au plus deux décimales.",
    donationSummary: "Résumé du don",
    gift: "Don",
    project: "Projet",
    generalFund: "Fonds général",
    continue: "Continuer",
    fullName: "Nom complet *",
    email: "E-mail *",
    anonymous: "Faire mon don anonymement",
    taxNote:
      "ADA est enregistrée comme ONG au Cameroun (N° 415/G.37/D14/VolI/SAAJP). Les dons ne sont pas présentés comme déductibles d'impôt au Canada, aux États-Unis, au Royaume-Uni ou dans l'UE. Un reçu est envoyé après confirmation du don pour vos dossiers personnels.",
    settingUpPayment: "Préparation du paiement…",
    continueToPayment: "Continuer vers le paiement",
    loadingPayment: "Chargement du paiement...",
    goBack: "Retour",
    anonymousName: "Anonyme",
    paymentHandled:
      "Les détails du paiement sont traités de manière sécurisée par Stripe.",
    paymentLoadFailed: "Impossible de charger le système de paiement",
    failedToCreatePayment: "Impossible de créer le paiement",
    thankYouPath: "/fr/donate/thank-you",
  },
};

interface DonorInfo {
  name: string;
  email: string;
  anonymous: boolean;
}

// Issue 1: Error boundary wrapper (must be class component to catch render errors)
class ErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

function StripeErrorFallback({
  copy,
}: {
  copy: (typeof FORM_COPY)[FormLocale];
}) {
  return (
    <div
      role="alert"
      className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700"
    >
      <p className="font-medium">{copy.paymentUnavailable}</p>
      <p>{copy.paymentUnavailableHelp}</p>
    </div>
  );
}

function PaymentStep({
  onBack,
  frequency,
  copy,
}: {
  onBack: () => void;
  frequency: "one-time" | "monthly";
  copy: (typeof FORM_COPY)[FormLocale];
}) {
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
        confirmParams: {
          return_url: `${window.location.origin}${copy.thankYouPath}?frequency=${encodeURIComponent(frequency)}`,
        },
      });

      if (submitError) {
        setError(submitError.message || copy.paymentFailed);
        setLoading(false);
      }
    } catch {
      setError(copy.networkError);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement
        options={{
          layout: {
            type: "accordion",
            defaultCollapsed: false,
            radios: "if_multiple",
            spacedAccordionItems: false,
          },
          wallets: {
            applePay: "auto",
            googlePay: "auto",
            link: "auto",
          },
        }}
      />
      <p className="mt-3 text-xs text-gray-500">
        {copy.securePayment} • {copy.eligibleWallets}
      </p>
      {error && (
        <p className="text-sm text-red-600" role="alert" aria-live="polite">
          {error}
        </p>
      )}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2.5 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          {copy.back}
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? copy.processing : copy.completeDonation}
        </button>
      </div>
    </form>
  );
}

export default function DonationForm({
  projects,
  monthlyOnly = false,
  locale = "en",
}: {
  projects?: { slug: string; title: string }[];
  monthlyOnly?: boolean;
  locale?: FormLocale;
}) {
  const copy = FORM_COPY[locale];
  const projectMap: Record<string, string> = projects?.length
    ? Object.fromEntries(projects.map((p) => [p.slug, p.title]))
    : FALLBACK_PROJECT_NAMES[locale];

  const [step, setStep] = useState(1);
  const [frequency, setFrequency] = useState<"one-time" | "monthly">(
    monthlyOnly ? "monthly" : "one-time",
  );
  const [amount, setAmount] = useState(25);
  const [customAmount, setCustomAmount] = useState("");
  const [donor, setDonor] = useState<DonorInfo>({
    name: "",
    email: "",
    anonymous: false,
  });
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Issue 2 & 7: Deferred stripe loading with loading state
  const [stripeInstance, setStripeInstance] = useState<Stripe | null>(null);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [stripeError, setStripeError] = useState("");
  const [project, setProject] = useState<string | null>(null);
  const checkoutAttempt = useRef<{ signature: string; id: string } | null>(
    null,
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const p = params.get("project");
    if (p && projectMap[p]) setProject(p);
  }, []);

  async function loadStripeInstance() {
    if (stripeInstance) return stripeInstance;

    setStripeLoading(true);
    setStripeError("");
    try {
      const publishableKey =
        ((
          await fetch("/api/public-config")
            .then((response) => (response.ok ? response.json() : null))
            .catch(() => null)
        )?.stripePublishableKey ??
          "") ||
        (import.meta as any).env?.PUBLIC_STRIPE_PUBLISHABLE_KEY ||
        "";
      if (!publishableKey) throw new Error(copy.paymentLoadFailed);

      const stripe = await loadStripe(publishableKey);
      if (!stripe) throw new Error(copy.paymentLoadFailed);
      setStripeInstance(stripe);
      return stripe;
    } catch (err: any) {
      setStripeError(err.message || copy.paymentLoadFailed);
      return null;
    } finally {
      setStripeLoading(false);
    }
  }

  useEffect(() => {
    if (step === 2 && !stripeInstance && !stripeLoading && !stripeError) {
      void loadStripeInstance();
    }
  }, [step, stripeInstance, stripeLoading, stripeError]);

  const selectedAmount = customAmount ? Number(customAmount) : amount;
  const selectedAmountLabel = Number.isFinite(selectedAmount)
    ? `$${selectedAmount}`
    : copy.customAmount;
  const selectedProjectName = project ? projectMap[project] : copy.generalFund;
  // Issue 6: Client-side validation for custom amounts
  function isValidAmount(): boolean {
    if (customAmount) {
      const num = Number(customAmount);
      const cents = num * 100;
      return (
        Number.isFinite(num) &&
        num >= 5 &&
        num <= 100000 &&
        Math.abs(cents - Math.round(cents)) < 1e-7
      );
    }
    return selectedAmount >= 5 && selectedAmount <= 100000;
  }

  async function handleStep2Submit(e: React.FormEvent) {
    e.preventDefault();
    // Issue 6: Validate before submitting
    if (!donor.name || !donor.email || !isValidAmount()) {
      if (customAmount && !isValidAmount()) {
        setError(copy.amountError);
        return;
      }
      return;
    }

    setLoading(true);
    setError("");

    try {
      const signature = JSON.stringify({
        amount: Math.round(selectedAmount * 100),
        frequency,
        name: donor.name.trim(),
        email: donor.email.trim().toLowerCase(),
        anonymous: donor.anonymous,
        project,
        locale,
      });
      if (checkoutAttempt.current?.signature !== signature) {
        checkoutAttempt.current = { signature, id: crypto.randomUUID() };
      }
      const checkoutAttemptId = checkoutAttempt.current.id;
      const endpoint =
        frequency === "monthly"
          ? "/api/create-subscription"
          : "/api/create-payment-intent";
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
          locale,
          checkoutAttemptId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || copy.failedToCreatePayment);

      setClientSecret(data.clientSecret);

      // Issue 2: Load Stripe before rendering the payment step when possible.
      await loadStripeInstance();

      setStep(3);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full min-w-0 max-w-lg mx-auto">
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {copy.steps.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step > i + 1 ? "bg-primary-600 text-white" : step === i + 1 ? "bg-primary-600 text-white" : "bg-gray-200 text-gray-500"}`}
            >
              {step > i + 1 ? "✓" : i + 1}
            </div>
            <span
              className={`text-xs hidden sm:inline ${step === i + 1 ? "text-primary-700 font-medium" : "text-gray-500"}`}
            >
              {label}
            </span>
            {i < 2 && <div className="w-8 h-0.5 bg-gray-200" />}
          </div>
        ))}
      </div>
      <p className="mb-6 text-sm leading-relaxed text-gray-600">
        {copy.shortCheckout}
      </p>

      {/* Step 1: Gift Details */}
      {step === 1 && (
        <div className="space-y-6">
          {project && (
            <p className="text-sm font-medium text-primary-700 bg-primary-50 px-3 py-2 rounded-lg">
              {copy.donatingTo} {projectMap[project]}
            </p>
          )}
          {monthlyOnly ? (
            <div className="rounded-xl border border-primary-100 bg-primary-50 px-4 py-3 text-sm text-primary-800">
              <p className="font-semibold">{copy.monthlyGiving}</p>
              <p className="mt-1 text-xs leading-relaxed">
                {copy.monthlyOnlyNote}
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {copy.giftType}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(["one-time", "monthly"] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFrequency(type)}
                    aria-pressed={frequency === type}
                    className={`px-4 py-2.5 text-sm font-medium rounded-lg border-2 transition-colors ${frequency === type ? "border-primary-500 bg-primary-50 text-primary-700" : "border-gray-200 text-gray-700 hover:border-gray-300"}`}
                  >
                    {type === "one-time" ? copy.oneTime : copy.monthly}
                  </button>
                ))}
              </div>
              {frequency === "monthly" && (
                <p className="mt-2 text-xs text-primary-700 bg-primary-50 border border-primary-100 rounded-lg px-3 py-2">
                  {copy.monthlyNote}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {copy.amount}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {AMOUNTS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => {
                    setAmount(a);
                    setCustomAmount("");
                  }}
                  aria-pressed={amount === a && !customAmount}
                  className={`relative min-w-0 px-3 py-2.5 text-sm font-medium rounded-lg border-2 transition-colors ${amount === a && !customAmount ? "border-primary-500 bg-primary-50 text-primary-700" : "border-gray-200 text-gray-700 hover:border-gray-300"}`}
                >
                  ${a}
                </button>
              ))}
            </div>
            {/* Issue 4: Proper label for custom amount input */}
            <label
              htmlFor="custom-amount"
              className="block text-sm font-medium text-gray-700 mt-3 mb-1"
            >
              {copy.customAmount}
            </label>
            <input
              id="custom-amount"
              type="number"
              min="5"
              max="100000"
              step="0.01"
              inputMode="decimal"
              placeholder={copy.customPlaceholder}
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Issue 6: Show validation error for invalid custom amounts */}
          {customAmount && !isValidAmount() && (
            <p role="alert" aria-live="polite" className="text-sm text-red-600">
              {copy.amountError}
            </p>
          )}

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm">
            <p className="font-semibold text-gray-900">
              {copy.donationSummary}
            </p>
            <dl className="mt-3 space-y-2 text-gray-600">
              <div className="flex justify-between gap-4">
                <dt>{copy.gift}</dt>
                <dd className="font-medium text-gray-900">
                  {selectedAmountLabel} {copy.currency}
                  {frequency === "monthly" && Number.isFinite(selectedAmount)
                    ? ` / ${copy.monthlyUnit}`
                    : ""}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>{copy.project}</dt>
                <dd className="font-medium text-gray-900 text-right break-words">
                  {selectedProjectName}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-sm leading-relaxed text-amber-900">
            {copy.taxNote}
          </div>

          <button
            type="button"
            onClick={() => isValidAmount() && setStep(2)}
            disabled={!isValidAmount()}
            className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {copy.continue}{" "}
            {Number.isFinite(selectedAmount)
              ? `— $${selectedAmount} ${copy.currency}${frequency === "monthly" ? ` / ${copy.monthlyUnit}` : ""}`
              : ""}
          </button>
        </div>
      )}

      {/* Step 2: Donor Info */}
      {step === 2 && (
        <form onSubmit={handleStep2Submit} className="space-y-4">
          <div>
            <label
              htmlFor="donor-name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {copy.fullName}
            </label>
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
            <label
              htmlFor="donor-email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {copy.email}
            </label>
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
              onChange={(e) =>
                setDonor({ ...donor, anonymous: e.target.checked })
              }
              className="rounded border-gray-300"
            />
            {copy.anonymous}
          </label>

          {/* Issue 5: role="alert" and aria-live on error messages */}
          {error && (
            <p role="alert" aria-live="polite" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2.5 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {copy.back}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? copy.settingUpPayment : copy.continueToPayment}
            </button>
          </div>
        </form>
      )}

      {/* Step 3: Payment */}
      {step === 3 && (
        <>
          {/* Issue 7: Loading state while Stripe resolves */}
          {stripeLoading && (
            <div className="py-8">
              <div className="inline-block w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
              <p className="mt-2 text-sm text-gray-600">
                {copy.loadingPayment}
              </p>
            </div>
          )}

          {/* Issue 5: Stripe load error with role="alert" */}
          {stripeError && (
            <div
              role="alert"
              aria-live="polite"
              className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700"
            >
              <p>{stripeError}</p>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="mt-2 text-sm font-medium underline"
              >
                {copy.goBack}
              </button>
            </div>
          )}

          {/* Issue 1: Error boundary around Stripe Elements */}
          {!stripeLoading && !stripeError && clientSecret && stripeInstance && (
            <ErrorBoundary fallback={<StripeErrorFallback copy={copy} />}>
              <Elements
                stripe={stripeInstance}
                options={{ clientSecret, appearance: { theme: "stripe" } }}
              >
                <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                  <p>
                    <strong>
                      ${selectedAmount}
                      {` ${copy.currency}`}
                      {frequency === "monthly" ? ` / ${copy.monthlyUnit}` : ""}
                    </strong>{" "}
                    — {donor.anonymous ? copy.anonymousName : donor.name}
                  </p>
                  <p className="mt-1 text-xs">
                    {copy.project}: {selectedProjectName}. {copy.paymentHandled}
                  </p>
                </div>
                <PaymentStep
                  onBack={() => setStep(2)}
                  frequency={frequency}
                  copy={copy}
                />
              </Elements>
            </ErrorBoundary>
          )}
        </>
      )}
    </div>
  );
}
