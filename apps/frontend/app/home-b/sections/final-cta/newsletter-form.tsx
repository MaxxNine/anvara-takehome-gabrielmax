'use client';

import { Loader2 } from 'lucide-react';
import { useState } from 'react';

import { useNewsletterSubscribe } from './use-newsletter-subscribe';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const { status, errorMessage, subscribe, resetError } = useNewsletterSubscribe();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const success = await subscribe(email);

    if (success) {
      setEmail('');
    }
  }

  return (
    <div className="mx-auto mt-10 max-w-lg text-center sm:mt-14" role="region" aria-label="Newsletter signup">
      <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <p className="mt-8 text-sm font-medium text-slate-400" id="newsletter-description">
        Not ready yet? Get marketplace insights delivered weekly.
      </p>

      {status === 'success' ? (
        <p
          className="mt-4 animate-[fadeSlideUp_0.4s_ease-out] text-sm font-semibold text-emerald-400"
          role="status"
        >
          You&apos;re in! We&apos;ll be in touch.
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mt-4 flex flex-col gap-2 sm:flex-row"
          aria-describedby="newsletter-description"
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              resetError();
            }}
            placeholder="you@company.com"
            disabled={status === 'loading'}
            aria-invalid={status === 'error' ? 'true' : undefined}
            aria-describedby={status === 'error' ? 'newsletter-error' : undefined}
            className="min-w-0 flex-1 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-blue-400/50 focus:outline-none focus:ring-1 focus:ring-blue-400/50 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="cursor-pointer rounded-full border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50 sm:px-6"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="sr-only">Subscribing…</span>
              </>
            ) : (
              'Subscribe'
            )}
          </button>
        </form>
      )}

      {status === 'error' && errorMessage ? (
        <p
          id="newsletter-error"
          className="mt-2 text-xs font-medium text-red-400"
          role="alert"
        >
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
