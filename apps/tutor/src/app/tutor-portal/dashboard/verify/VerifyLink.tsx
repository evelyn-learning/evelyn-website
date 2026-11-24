'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DashApiError, dashFetch, errorText } from '../dash-api';
import { Notice, linkClass, primaryButton } from '../ui';

/**
 * The page an emailed link opens. The link is used by a click here, never on load: mail scanners and link
 * previews open every link in a message, and a page that signed in on load would let the scanner use the
 * one-time link up before the person got to it.
 */
export function VerifyLink({ token }: { token: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [dead, setDead] = useState(!token);

  async function go() {
    if (pending) return;
    setPending(true);
    setError('');
    try {
      const r = await dashFetch<{ ok: true; created: boolean }>('verify', { body: { token }, stayOn401: true });
      // replace, so Back does not return to a link that is now used up. `pending` stays on until the page changes.
      router.replace(r.created ? '/dashboard?welcome=1' : '/dashboard');
    } catch (err) {
      if (err instanceof DashApiError && err.code === 'invalid_link') setDead(true);
      else setError(errorText(err));
      setPending(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-md flex-col justify-center px-4 py-16 text-center sm:px-6">
      {dead ? (
        <div role="alert">
          <h1 className="mb-2 text-2xl font-bold text-slate-900">This link has expired or was already used</h1>
          <p className="mb-6 text-slate-600">Links work once and for 30 minutes. Ask for a new one and you are in.</p>
          <Link href="/dashboard/login" className={primaryButton}>Get a new link</Link>
        </div>
      ) : (
        <>
          <h1 className="mb-2 text-2xl font-bold text-slate-900">Almost there</h1>
          <p className="mb-6 text-slate-600">Use the button to sign in on this browser.</p>
          <div>
            <button type="button" onClick={go} disabled={pending} className={`${primaryButton} px-6 py-3`}>
              {pending ? 'Opening…' : 'Continue to your dashboard'}
            </button>
          </div>
          <div aria-live="polite" className="mt-4 text-left">
            {error && (
              <Notice>
                {error}{' '}
                <Link href="/dashboard/login" className={linkClass}>Ask for a new link</Link>
              </Notice>
            )}
          </div>
        </>
      )}
    </div>
  );
}
