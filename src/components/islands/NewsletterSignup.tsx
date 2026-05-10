import { useState } from 'react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    // Placeholder - will connect to Supabase/Resend later
    await new Promise(resolve => setTimeout(resolve, 800));
    setStatus('success');
  }

  if (status === 'success') {
    return (
      <div className="text-center" role="alert">
        <p className="text-lg font-semibold text-primary-700">✅ Thank you!</p>
        <p className="mt-1 text-sm text-gray-600">You'll receive updates about our impact and programs.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <label htmlFor="newsletter-email" className="sr-only">Email address</label>
      <input
        id="newsletter-email"
        type="email"
        required
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        aria-label="Email address for newsletter"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="px-6 py-3 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 whitespace-nowrap"
      >
        {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
      </button>
    </form>
  );
}
