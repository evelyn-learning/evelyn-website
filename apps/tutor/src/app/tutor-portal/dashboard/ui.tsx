'use client';

/**
 * Small shared pieces of the sign-up, sign-in and dashboard pages: the form control classes, a copy button,
 * an inline notice, and the "check your email" state both forms end on.
 */
import { useEffect, useRef, useState } from 'react';
import { Check, Copy, MailCheck } from 'lucide-react';

export const focusRing = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600';
export const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500';
export const labelClass = 'mb-1 block text-sm font-medium text-slate-700';
export const primaryButton =
  `inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-300 ${focusRing}`;
export const secondaryButton =
  `inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400 ${focusRing}`;
export const dangerButton =
  `inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-red-300 ${focusRing}`;
export const linkClass = `font-medium text-blue-600 underline underline-offset-2 hover:text-blue-500 ${focusRing}`;

/** An inline message. Errors are announced at once (role=alert); the rest politely. */
export function Notice({ kind = 'error', children }: { kind?: 'error' | 'success' | 'info'; children: React.ReactNode }) {
  const tone = kind === 'error' ? 'bg-red-50 text-red-700' : kind === 'success' ? 'bg-green-50 text-green-800' : 'bg-blue-50 text-blue-800';
  return (
    <div role={kind === 'error' ? 'alert' : 'status'} className={`rounded-lg px-4 py-3 text-sm ${tone}`}>
      {children}
    </div>
  );
}

/** Copies `value` to the clipboard. The value goes nowhere else (no storage, no log). */
export function CopyButton({ value, label = 'Copy', className = '' }: { value: string; label?: string; className?: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  async function copy() {
    let ok = true;
    try { await navigator.clipboard.writeText(value); } catch { ok = false; }
    setState(ok ? 'copied' : 'failed');
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState('idle'), 2000);
  }

  return (
    <button type="button" onClick={copy} className={`${secondaryButton} shrink-0 ${className}`}>
      {state === 'copied' ? <Check className="h-4 w-4 text-green-600" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
      <span aria-live="polite">{state === 'copied' ? 'Copied' : state === 'failed' ? 'Select and copy by hand' : label}</span>
    </button>
  );
}

/** A value in a mono box with its copy button; wraps instead of widening the page. */
export function CopyField({ value, label, copyLabel }: { value: string; label: string; copyLabel?: string }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <code aria-label={label} className="min-w-0 flex-1 break-all rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm text-slate-800">
        {value}
      </code>
      <CopyButton value={value} label={copyLabel} />
    </div>
  );
}

/** Where both the sign-up and the sign-in form end. The wording is the same whether or not the email has an
 *  account, as the API's answer is: the page must not reveal which emails are registered. */
export function CheckEmail({ email, onReset }: { email: string; onReset: () => void }) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus(); }, []);
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6" role="status">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
        <MailCheck className="h-6 w-6" aria-hidden />
      </div>
      <h1 ref={heading} tabIndex={-1} className="mb-2 text-2xl font-bold text-slate-900 focus:outline-none">Check your email</h1>
      <p className="mb-2 text-slate-600">
        We sent a link to <span className="break-all font-medium text-slate-900">{email}</span>. It is valid for 30 minutes
        and can be used once.
      </p>
      <p className="mb-6 text-sm text-slate-500">
        Nothing after a few minutes? Look in your spam folder, or check the address and send it again.
      </p>
      <button type="button" onClick={onReset} className={secondaryButton}>Use a different email</button>
    </div>
  );
}

/** The field no person fills in. Off-screen rather than display:none, so a form-filling bot still sees and
 *  fills it; out of the tab order and hidden from assistive technology so a person never meets it. */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', top: 'auto', width: 1, height: 1, overflow: 'hidden' }}>
      <label htmlFor="website2">Website (leave this empty)</label>
      <input id="website2" name="website2" type="text" tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
