'use client';

import { useState } from 'react';
import Link from 'next/link';
import { dashFetch, errorText } from '../dashboard/dash-api';
import { CheckEmail, Honeypot, Notice, focusRing, inputClass, labelClass, linkClass, primaryButton } from '../dashboard/ui';

export function SignupForm({ freeMinutes, sessionMinutes }: { freeMinutes: number; sessionMinutes: number }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [useCase, setUseCase] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
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
      await dashFetch('start', { body: { email, name, company, useCase, acceptTerms, website2 }, stayOn401: true });
      setSent(true);
    } catch (err) {
      setError(errorText(err));
    } finally {
      setPending(false);
    }
  }

  if (sent) return <CheckEmail email={email.trim()} onReset={() => setSent(false)} />;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold text-slate-900">Get your sandbox keys</h1>
      <p className="mb-8 text-lg text-slate-600">
        Free API keys for the Voice Tutor, ready as soon as you confirm your email. No call, no waiting.
      </p>

      {/* Sandbox limits info */}
      <div className="mb-8 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="mb-2 text-sm font-medium text-slate-700">Sandbox includes:</p>
        <ul className="space-y-1 text-sm text-slate-500">
          <li>Same engine and whiteboard as production</li>
          <li>{freeMinutes} free tutoring minutes, {sessionMinutes} minutes per session</li>
          <li>Your own signed partner keys</li>
          <li>A dashboard with your usage, sessions and replays</li>
          <li>Partner API and end-of-session events</li>
          <li>No credit card required</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="relative space-y-5">
        <div>
          <label htmlFor="email" className={labelClass}>Email</label>
          <input
            type="email" id="email" name="email" required autoComplete="email" inputMode="email" maxLength={254}
            value={email} onChange={(e) => setEmail(e.target.value)} disabled={pending}
            aria-describedby="email-hint" className={inputClass}
          />
          <p id="email-hint" className="mt-1 text-xs text-slate-500">We email you a link to confirm it. Your keys are behind that link.</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className={labelClass}>Your name</label>
            <input
              type="text" id="name" name="name" required autoComplete="name" maxLength={80}
              value={name} onChange={(e) => setName(e.target.value)} disabled={pending} className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="company" className={labelClass}>Company</label>
            <input
              type="text" id="company" name="company" required autoComplete="organization" maxLength={80}
              value={company} onChange={(e) => setCompany(e.target.value)} disabled={pending} className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="useCase" className={labelClass}>
            What are you building? <span className="font-normal text-slate-500">(optional)</span>
          </label>
          <textarea
            id="useCase" name="useCase" rows={3} maxLength={1000}
            value={useCase} onChange={(e) => setUseCase(e.target.value)} disabled={pending} className={inputClass}
          />
        </div>

        <Honeypot value={website2} onChange={setWebsite2} />

        <div className="flex items-start gap-3">
          <input
            type="checkbox" id="acceptTerms" name="acceptTerms" required
            checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} disabled={pending}
            className={`mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-blue-600 ${focusRing}`}
          />
          <label htmlFor="acceptTerms" className="text-sm text-slate-700">
            I agree to the{' '}
            <Link href="/sandbox/terms" target="_blank" className={linkClass}>sandbox terms</Link>
            <span className="sr-only"> (opens in a new tab)</span>
          </label>
        </div>

        {/* Always in the page, so the message is announced when it appears. */}
        <div aria-live="polite">{error && <Notice>{error}</Notice>}</div>

        <button type="submit" disabled={pending} className={`${primaryButton} w-full py-3`}>
          {pending ? 'Sending…' : 'Email me my keys'}
        </button>

        <p className="text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link href="/dashboard/login" className={linkClass}>Sign in</Link>
        </p>
      </form>
    </div>
  );
}
