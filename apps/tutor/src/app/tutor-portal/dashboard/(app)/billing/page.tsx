'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ExternalLink } from 'lucide-react';
import { DashApiError, dashFetch, errorText, type DashBilling } from '../../dash-api';
import { Notice, linkClass, primaryButton, secondaryButton } from '../../ui';
import { Card, PageHeader, useDash } from '../DashboardShell';

const whenText = (iso: string) => new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
const num = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 1 });
const usd = (n: number) => `$${n.toLocaleString('en-US')}`;
const perMinuteText = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 3 })} per minute`;
function amountText(amount: number, currency: string): string {
  try { return new Intl.NumberFormat(undefined, { style: 'currency', currency: currency.toUpperCase() }).format(amount); }
  catch { return `${amount.toLocaleString()} ${currency.toUpperCase()}`; }
}

const POLL_EVERY_MS = 2000;
const POLL_FOR_MS = 30_000;
const credited = (b: DashBilling) => b.purchases.filter((p) => p.status === 'credited').length;

/** Where the page stands after the browser comes back from Stripe. */
type Returned =
  | { kind: 'waiting' }
  | { kind: 'added'; minutes: number }
  | { kind: 'late' }
  | { kind: 'cancelled' };

function BillingPage() {
  const { me, refresh } = useDash();
  const router = useRouter();
  const params = useSearchParams();

  const [data, setData] = useState<DashBilling | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [buying, setBuying] = useState<string | null>(null);
  const [buyError, setBuyError] = useState('');
  const [opening, setOpening] = useState(false);
  const [portalError, setPortalError] = useState('');
  const [returned, setReturned] = useState<Returned | null>(null);
  // Read once and kept: the address is cleaned straight after, so a reload does not say it again.
  const arrival = useRef<{ paid: boolean; cancelled: boolean } | null>(null);

  const load = useCallback(async (): Promise<DashBilling | null> => {
    try {
      const b = await dashFetch<DashBilling>('billing');
      setData(b);
      setError('');
      return b;
    } catch (err) {
      if (!(err instanceof DashApiError && err.status === 401)) setError(errorText(err, 'We could not load your billing.'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!arrival.current) {
      arrival.current = { paid: !!params.get('paid'), cancelled: params.get('cancelled') === '1' };
      if (arrival.current.paid || arrival.current.cancelled) router.replace('/dashboard/billing');
    }
    const { paid, cancelled } = arrival.current;
    if (cancelled && !paid) setReturned({ kind: 'cancelled' });
    if (!paid) { void load(); return; }

    // Back from a paid checkout. Stripe tells our server separately, usually within seconds: ask until the
    // purchase is credited (or the cap has risen), for half a minute, then let /me catch up for the other pages.
    setReturned({ kind: 'waiting' });
    let stop = false;
    void (async () => {
      const first = await load();
      const newest = first?.purchases[0];
      // Already credited by the time the browser got back.
      if (first && newest?.status === 'credited' && Date.now() - new Date(newest.at).getTime() < 60 * 60_000) {
        await refresh();
        if (!stop) setReturned({ kind: 'added', minutes: newest.minutes });
        return;
      }
      const deadline = Date.now() + POLL_FOR_MS;
      while (!stop && Date.now() < deadline) {
        await new Promise((r) => setTimeout(r, POLL_EVERY_MS));
        if (stop) return;
        const b = await load();
        if (!b) continue;
        const rose = first ? b.pool.capMinutes - first.pool.capMinutes : 0;
        if ((first && credited(b) > credited(first)) || rose > 0 || (!first && b.purchases[0]?.status === 'credited')) {
          const minutes = b.purchases.find((p) => p.status === 'credited')?.minutes ?? rose;
          await refresh();
          if (!stop) setReturned({ kind: 'added', minutes });
          return;
        }
      }
      if (!stop) setReturned({ kind: 'late' });
    })();
    return () => { stop = true; };
    // Once, on arrival.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function buy(pack: string) {
    if (buying) return;
    setBuying(pack);
    setBuyError('');
    try {
      const r = await dashFetch<{ url: string }>('billing/checkout', { body: { pack } });
      // The button stays pending while the browser leaves for Stripe's page.
      window.location.assign(r.url);
    } catch (err) {
      if (!(err instanceof DashApiError && err.status === 401)) setBuyError(errorText(err, 'We could not start the checkout. Nothing was charged.'));
      setBuying(null);
    }
  }

  async function openPortal() {
    if (opening) return;
    setOpening(true);
    setPortalError('');
    try {
      const r = await dashFetch<{ url: string }>('billing/portal', { method: 'POST', body: {} });
      window.location.assign(r.url);
    } catch (err) {
      if (!(err instanceof DashApiError && err.status === 401)) setPortalError(errorText(err, 'We could not open your invoices. Try again in a minute.'));
      setOpening(false);
    }
  }

  const pool = data?.pool ?? me.pool;
  const usedPct = pool.pooled && pool.capMinutes > 0 ? Math.min(100, Math.max(0, (pool.usedMinutes / pool.capMinutes) * 100)) : 0;
  const moreMail = `mailto:info@evelynlearning.com?subject=${encodeURIComponent(`More minutes or invoicing for partner ${me.partnerId}`)}`;

  return (
    <>
      <PageHeader title="Billing">
        Your minute balance, packs of minutes, and what you have bought.
      </PageHeader>

      <div className="space-y-6">
        <div aria-live="polite">
          {returned?.kind === 'waiting' && <Notice kind="success">Payment received. Your minutes are being added.</Notice>}
          {returned?.kind === 'added' && <Notice kind="success">Payment received. {num(returned.minutes)} minutes added.</Notice>}
          {returned?.kind === 'late' && (
            <Notice kind="info">
              Payment received. The minutes are not on your balance yet; they usually arrive within a minute.{' '}
              <button type="button" onClick={() => void load().then(() => refresh()).then(() => setReturned(null))} className={linkClass}>Check again</button>, or write to{' '}
              <a href={moreMail} className={linkClass}>info@evelynlearning.com</a> if they do not appear.
            </Notice>
          )}
          {returned?.kind === 'cancelled' && <Notice kind="info">Checkout cancelled. Nothing was charged.</Notice>}
        </div>

        {error && (
          <div className="space-y-3">
            <Notice>{error}</Notice>
            <button type="button" onClick={() => { setLoading(true); void load(); }} className={secondaryButton}>Try again</button>
          </div>
        )}

        <Card title="Balance">
          {pool.pooled ? (
            <>
              <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <p className="text-sm text-slate-600">
                  <span className="text-2xl font-semibold tabular-nums text-slate-900">{num(pool.remainingMinutes)}</span>
                  {' '}minutes left of {num(pool.capMinutes)}
                </p>
                <p className="text-sm font-medium tabular-nums text-slate-700">{num(pool.usedMinutes)} used</p>
              </div>
              <div
                role="progressbar" aria-label="Minutes used" aria-valuemin={0} aria-valuemax={pool.capMinutes} aria-valuenow={pool.usedMinutes}
                aria-valuetext={`${num(pool.usedMinutes)} of ${num(pool.capMinutes)} minutes used`}
                className="h-2.5 overflow-hidden rounded-full bg-slate-100"
              >
                <div className={`h-full rounded-full ${pool.exhausted ? 'bg-red-600' : 'bg-blue-600'}`} style={{ width: `${usedPct}%` }} />
              </div>
              <p className="mt-3 text-sm text-slate-500">Sessions run up to {num(pool.sessionMaxMinutes)} minutes.</p>
              {pool.exhausted && (
                <p role="status" className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                  Your minutes are used up, so new sessions will not start.
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-slate-600">This account has no minute cap. Usage is billed under your agreement.</p>
          )}
        </Card>

        {!data && loading && (
          <div role="status" aria-label="Loading billing" className="animate-pulse space-y-4">
            <div className="h-40 rounded-lg bg-slate-100" />
            <div className="h-24 rounded-lg bg-slate-100" />
          </div>
        )}

        {data && (
          <>
            <section aria-labelledby="packs-heading">
              <h2 id="packs-heading" className="mb-3 text-base font-semibold text-slate-900">Minute packs</h2>

              {!data.onSale && (
                <div className="mb-4">
                  <Notice kind="info">
                    Minute packs are not on sale yet. Write to <a href={moreMail} className={linkClass}>info@evelynlearning.com</a> to add minutes.
                  </Notice>
                </div>
              )}
              {data.onSale && data.testMode && (
                <div role="status" className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  <span className="font-semibold">Test mode:</span> use Stripe&apos;s test card{' '}
                  <span className="whitespace-nowrap font-mono">4242 4242 4242 4242</span>. No money moves; the minutes are real.
                </div>
              )}

              <ul className="grid gap-4 sm:grid-cols-3">
                {data.packs.map((p) => (
                  <li key={p.id} className="flex flex-col rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
                    <h3 className="text-base font-semibold text-slate-900">{p.label}</h3>
                    <p className="mt-2 text-2xl font-semibold tabular-nums text-slate-900">{usd(p.usd)}</p>
                    <p className="mt-0.5 text-sm text-slate-500">{perMinuteText(p.perMinute)}</p>
                    <button
                      type="button" onClick={() => void buy(p.id)} disabled={!data.onSale || buying !== null}
                      className={`${primaryButton} mt-4 w-full`}
                    >
                      {buying === p.id ? 'Opening checkout…' : 'Buy'}<span className="sr-only"> {p.label} for {usd(p.usd)}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <div aria-live="polite" className="mt-3">{buyError && <Notice>{buyError}</Notice>}</div>

              <p className="mt-3 max-w-3xl text-sm text-slate-600">
                Paid by card through Stripe. Minutes are added to your balance as soon as the payment clears, usually within a
                minute. Buying any pack also raises the session limit from 15 to 60 minutes.
              </p>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">
                Need more than 10,000 minutes or monthly invoicing? Write to <a href={moreMail} className={linkClass}>info@evelynlearning.com</a>
              </p>
            </section>

            <Card title="Purchases">
              {data.purchases.length === 0 ? (
                <p className="text-sm text-slate-600">Nothing bought yet. A pack you buy is listed here with its receipt.</p>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full min-w-[560px] text-left text-sm">
                    <caption className="sr-only">Your purchases, newest first</caption>
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        <th scope="col" className="px-3 py-2.5 font-medium">Date</th>
                        <th scope="col" className="px-3 py-2.5 font-medium">Pack</th>
                        <th scope="col" className="px-3 py-2.5 text-right font-medium">Minutes</th>
                        <th scope="col" className="px-3 py-2.5 text-right font-medium">Amount</th>
                        <th scope="col" className="px-3 py-2.5 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.purchases.map((p, i) => (
                        <tr key={`${p.at}-${i}`} className="border-t border-slate-100 align-top">
                          <td className="whitespace-nowrap px-3 py-2.5 text-slate-700"><time dateTime={p.at}>{whenText(p.at)}</time></td>
                          <td className="px-3 py-2.5 text-slate-700">
                            {p.pack}
                            {p.test && <span className="ml-2 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800">test</span>}
                          </td>
                          <td className="px-3 py-2.5 text-right tabular-nums text-slate-700">{num(p.minutes)}</td>
                          <td className="whitespace-nowrap px-3 py-2.5 text-right tabular-nums text-slate-700">{amountText(p.amount, p.currency)}</td>
                          <td className="px-3 py-2.5">
                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${p.status === 'credited' ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                              {p.status === 'credited' ? 'minutes added' : 'pending'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {data.canManage && (
                <div className="mt-4">
                  <button type="button" onClick={() => void openPortal()} disabled={opening} className={secondaryButton}>
                    <ExternalLink className="h-4 w-4" aria-hidden />{opening ? 'Opening…' : 'Invoices and receipts'}
                  </button>
                  <p className="mt-2 text-xs text-slate-500">Opens Stripe&apos;s page for this account.</p>
                </div>
              )}
              <div aria-live="polite" className="mt-3">{portalError && <Notice>{portalError}</Notice>}</div>
            </Card>
          </>
        )}
      </div>
    </>
  );
}

export default function DashboardBillingPage() {
  // useSearchParams needs a Suspense boundary of its own (the return from Stripe is read from the address).
  return <Suspense fallback={null}><BillingPage /></Suspense>;
}
