'use client';

import { useState } from 'react';
import Link from 'next/link';
import { dashFetch, errorText } from '../dash-api';
import { CheckEmail, Honeypot, Notice, inputClass, labelClass, linkClass, primaryButton } from '../ui';

/** Sign-in is by emailed link only: there is no password to store, reset or leak. */
export function LoginForm() {
  const [email, setEmail] = useState('');
  const [website2, setWebsite2] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;
    setPending(true);
    setError('');
    try {
      await dashFetch('start', { body: { email, website2 }, stayOn401: true });
      setSent(true);
    } catch (err) {
      setError(errorText(err));
    } finally {
      setPending(false);
    }
  }

  if (sent) return <CheckEmail email={email.trim()} onReset={() => setSent(false)} />;

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="mb-2 text-3xl font-bold text-slate-900">Sign in</h1>
      <p className="mb-8 text-slate-600">Enter your email and we will send you a sign-in link. No password.</p>

      <form onSubmit={handleSubmit} className="relative space-y-5">
        <div>
          <label htmlFor="email" className={labelClass}>Email</label>
          <input
            type="email" id="email" name="email" required autoComplete="email" inputMode="email" maxLength={254}
            value={email} onChange={(e) => setEmail(e.target.value)} disabled={pending} className={inputClass}
          />
        </div>

        <Honeypot value={website2} onChange={setWebsite2} />

        <div aria-live="polite">{error && <Notice>{error}</Notice>}</div>

        <button type="submit" disabled={pending} className={`${primaryButton} w-full py-3`}>
          {pending ? 'Sending…' : 'Email me a sign-in link'}
        </button>

        <p className="text-center text-sm text-slate-500">
          No account yet?{' '}
          <Link href="/sandbox" className={linkClass}>Get your sandbox keys</Link>
        </p>
      </form>
    </div>
  );
}
