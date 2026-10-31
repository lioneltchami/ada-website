import { useState } from 'react';

type Locale = 'en' | 'fr';

const COPY = {
  en: {
    error: 'Something went wrong. Please try again.',
    tryAgain: 'Try again',
    thanks: 'Thank you!',
    success: "You'll receive updates about our impact and programs.",
    email: 'Email address',
    placeholder: 'Enter your email',
    loading: 'Subscribing...',
    subscribe: 'Subscribe',
  },
  fr: {
    error: 'Une erreur est survenue. Veuillez réessayer.',
    tryAgain: 'Réessayer',
    thanks: 'Merci !',
    success: 'Vous recevrez des nouvelles de notre impact et de nos programmes.',
    email: 'Adresse e-mail',
    placeholder: 'Saisissez votre adresse e-mail',
    loading: 'Inscription en cours…',
    subscribe: "S'abonner",
  },
} satisfies Record<Locale, Record<string, string>>;

export default function NewsletterSignup({ locale = 'en' }: { locale?: Locale }) {
  const copy = COPY[locale];
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'error') {
    return (
      <div className="text-center" role="alert">
        <p className="text-sm text-red-600">{copy.error}</p>
        <button onClick={() => setStatus('idle')} className="mt-2 text-sm text-primary-600 hover:underline">{copy.tryAgain}</button>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="text-center" role="alert">
        <p className="text-lg font-semibold text-primary-700">✅ {copy.thanks}</p>
        <p className="mt-1 text-sm text-gray-600">{copy.success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <label htmlFor="newsletter-email" className="sr-only">{copy.email}</label>
      <input
        id="newsletter-email"
        type="email"
        required
        placeholder={copy.placeholder}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        aria-label={copy.email}
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="px-6 py-3 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 whitespace-nowrap"
      >
        {status === 'loading' ? copy.loading : copy.subscribe}
      </button>
    </form>
  );
}
