'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Circle, PartyPopper } from 'lucide-react';
import { linkClass } from '../ui';
import { Card, PageHeader, useDash } from './DashboardShell';
import { UsageChart } from './UsageChart';

const num = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 1 });

/** Shown once, on the page a new sandbox's first link lands on (?welcome=1). */
function WelcomeBanner() {
  const welcome = useSearchParams().get('welcome') === '1';
  if (!welcome) return null;
  return (
    <div role="status" className="mb-6 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900">
      <PartyPopper className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
      <div>
        <p className="font-semibold">Your sandbox is ready</p>
        <p>
          Your keys are on the <Link href="/dashboard/keys" className="font-medium underline underline-offset-2">API keys</Link> page.
          The quickest way to see the tutor work is to{' '}
          <Link href="/dashboard/try" className="font-medium underline underline-offset-2">run a test lesson</Link>.
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">{value}</p>
      {note && <p className="mt-0.5 text-xs text-slate-500">{note}</p>}
    </div>
  );
}

export default function DashboardOverviewPage() {
  const { me } = useDash();
  const { pool, usage } = me;
  const usedPct = pool.pooled && pool.capMinutes > 0 ? Math.min(100, Math.max(0, (pool.usedMinutes / pool.capMinutes) * 100)) : 0;
  const ranLesson = usage.sessionsTotal > 0;

  const steps = [
    { done: true, title: 'Get your keys', body: <>Your partner id and secret are on the <Link href="/dashboard/keys" className={linkClass}>API keys</Link> page.</> },
    { done: ranLesson, title: 'Run a test lesson', body: <>Start one from <Link href="/dashboard/try" className={linkClass}>Try it</Link>: no code needed, and you see the token your server would sign.</> },
    { done: false, link: true, title: 'Embed it', body: <>Sign a token on your server and open the session page. The <Link href="/dashboard/docs" className={linkClass}>Docs</Link> have every example filled in with your partner id.</> },
  ];

  return (
    <>
      {/* useSearchParams needs a Suspense boundary of its own; the banner is the only part that waits on it. */}
      <Suspense fallback={null}><WelcomeBanner /></Suspense>

      <PageHeader title="Overview">
        {me.account.name ? `Signed in as ${me.account.name}.` : `Signed in as ${me.account.email}.`}
      </PageHeader>

      <div className="space-y-6">
        <Card title="Tutoring minutes">
          {pool.pooled ? (
            <>
              <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <p className="text-sm text-slate-600">
                  <span className="text-2xl font-semibold tabular-nums text-slate-900">{num(pool.usedMinutes)}</span>
                  {' '}of {num(pool.capMinutes)} minutes used
                </p>
                <p className="text-sm font-medium tabular-nums text-slate-700">
                  {num(pool.remainingMinutes)} left
                  <Link href="/dashboard/billing" className={`ml-3 ${linkClass}`}>Add minutes</Link>
                </p>
              </div>
              <div
                role="progressbar" aria-label="Tutoring minutes used" aria-valuemin={0} aria-valuemax={pool.capMinutes} aria-valuenow={pool.usedMinutes}
                aria-valuetext={`${num(pool.usedMinutes)} of ${num(pool.capMinutes)} minutes used`}
                className="h-2.5 overflow-hidden rounded-full bg-slate-100"
              >
                <div className={`h-full rounded-full ${pool.exhausted ? 'bg-red-600' : 'bg-blue-600'}`} style={{ width: `${usedPct}%` }} />
              </div>
              <p className="mt-3 text-sm text-slate-500">Sessions capped at {num(pool.sessionMaxMinutes)} minutes.</p>
              {pool.exhausted && (
                <p role="status" className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                  Your minutes are used up, so new sessions will not start.{' '}
                  <Link href="/dashboard/billing" className="font-medium underline">Add minutes</Link> on the Billing page, or write to{' '}
                  <a href="mailto:info@evelynlearning.com" className="font-medium underline">info@evelynlearning.com</a>.
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-slate-600">This account has no minute cap. Usage is billed under your agreement.</p>
          )}
        </Card>

        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="Sessions, last 7 days" value={num(usage.sessions7d)} />
          <Stat label="Minutes, last 7 days" value={num(usage.minutes7d)} />
          <Stat label="Sessions, all time" value={num(usage.sessionsTotal)} />
        </div>

        <Card>
          <UsageChart days={usage.days} />
        </Card>

        <Card title="Getting started">
          <ol className="space-y-4">
            {steps.map((s, i) => (
              <li key={s.title} className="flex gap-3">
                {s.done
                  ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" aria-hidden />
                  : <Circle className="mt-0.5 h-5 w-5 shrink-0 text-slate-300" aria-hidden />}
                <div className="min-w-0 text-sm">
                  <p className="font-medium text-slate-900">
                    {i + 1}. {s.title}
                    {!s.link && <span className="sr-only">{s.done ? ' (done)' : ' (not done yet)'}</span>}
                    {s.done && <span aria-hidden className="ml-2 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">Done</span>}
                  </p>
                  <p className="mt-0.5 text-slate-600">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </>
  );
}
