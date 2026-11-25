// DRAFT — this text awaits review by the owner (Praveen) and by counsel. It was written 2026-11-24 with the
// self-serve sandbox and is not yet a reviewed legal document. A change of wording needs a new
// SANDBOX_TERMS_VERSION in src/lib/tutor/partner-dashboard/core.ts: each account keeps the version it accepted.
import type { Metadata } from 'next';
import Link from 'next/link';
import { SANDBOX_FREE_MINUTES, SANDBOX_TERMS_VERSION } from '@/lib/tutor/partner-dashboard/core';
import { sandboxLimits } from '../../data/pricing';

export const metadata: Metadata = {
  title: 'Sandbox terms',
  description: 'The terms for the Voice Tutor developer sandbox.',
  // 2026-11-24: not indexed. The text is a draft awaiting review (see the note above), and a terms page is
  // not what a search for the product should land on. Links on it are still followed.
  robots: { index: false, follow: true },
};

const link = 'font-medium text-blue-600 underline underline-offset-2 hover:text-blue-500';

export default function SandboxTermsPage() {
  const sessionMinutes = sandboxLimits.maxSessionDurationMinutes;
  const terms: { title: string; body: React.ReactNode }[] = [
    {
      title: 'What the sandbox is for',
      body: (
        <>
          The sandbox lets you evaluate the Voice Tutor and test your integration with it. It is not for
          production use, and it is not for teaching real students.
        </>
      ),
    },
    {
      title: 'Test data only',
      body: (
        <>
          Use test data only. Do not send real students&apos; personal data, and do not let children under 13
          use the sandbox, until you have signed a written agreement with Evelyn Learning that includes a
          data-processing agreement.
        </>
      ),
    },
    {
      title: 'What you get, and its limits',
      body: (
        <>
          A sandbox comes with {SANDBOX_FREE_MINUTES} free tutoring minutes. Each session ends at {sessionMinutes} minutes.
          We may change these limits, or change or end the sandbox, at any time.
        </>
      ),
    },
    {
      title: 'Your keys',
      body: (
        <>
          Keep your partner secret on your server. Never put it in a web page, a mobile app or a public
          repository. You are responsible for everything done with your keys. If a secret may have been
          exposed, rotate it in the dashboard at once.
        </>
      ),
    },
    {
      title: 'What we store',
      body: (
        <>
          Sessions are stored: the transcript, the whiteboard and the session record. In voice sessions the
          audio is processed to recognise and produce speech. Evelyn Learning may review stored sessions to
          operate and improve the service.
        </>
      ),
    },
    {
      title: 'No warranty',
      body: (
        <>
          The sandbox is provided as it is, with no warranty and no promise of availability. It is not for
          production use. Do not rely on it for anything that matters to your users.
        </>
      ),
    },
    {
      title: 'Acceptable use',
      body: (
        <>
          Do not abuse the service or its tutors, do not try to get around the minute, session or sign-up
          limits (for example by opening several sandboxes), and do not resell or sublicense sandbox access.
        </>
      ),
    },
    {
      title: 'Suspension',
      body: (
        <>
          We may suspend or close a sandbox account that breaks these terms or puts the service at risk.
        </>
      ),
    },
    {
      title: 'Contact',
      body: (
        <>
          Questions, or ready to move to production? Write to{' '}
          <a href="mailto:info@evelynlearning.com" className={link}>info@evelynlearning.com</a>.
        </>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <p className="mb-2 text-sm font-medium text-slate-500">Version {SANDBOX_TERMS_VERSION}</p>
      <h1 className="mb-2 text-3xl font-bold text-slate-900">Sandbox terms</h1>
      <p className="mb-8 text-lg text-slate-600">
        The short terms you agree to when you open a Voice Tutor sandbox. &ldquo;We&rdquo; is Evelyn Learning;
        &ldquo;you&rdquo; is the person or company opening the sandbox.
      </p>

      <ol className="space-y-6">
        {terms.map((t, i) => (
          <li key={t.title} className="flex gap-4">
            <span aria-hidden className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
              {i + 1}
            </span>
            <div className="min-w-0">
              <h2 className="mb-1 text-base font-semibold text-slate-900">
                <span className="sr-only">{i + 1}. </span>{t.title}
              </h2>
              <p className="text-sm leading-relaxed text-slate-600">{t.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-10 border-t border-slate-200 pt-6 text-sm text-slate-500">
        <Link href="/sandbox" className={link}>Get your sandbox keys</Link>
        {' · '}
        <Link href="/dashboard/login" className={link}>Sign in</Link>
      </p>
    </div>
  );
}
