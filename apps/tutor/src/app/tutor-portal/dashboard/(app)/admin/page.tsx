'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Ban, Play, Plus } from 'lucide-react';
import { DashApiError, dashFetch, errorText, type DashAdminPartnerRow } from '../../dash-api';
import { Notice, dangerButton, inputClass, labelClass, linkClass, primaryButton, secondaryButton } from '../../ui';
import { PageHeader, useDash } from '../DashboardShell';

const whenText = (iso: string) => new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
const dayText = (iso: string) => new Date(iso).toLocaleDateString(undefined, { dateStyle: 'medium' });
const num = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 1 });
const WEEK_MS = 7 * 86_400_000;
const NOT_POOLED = 'This partner has no minute pool, so there are no minutes to add.';

type Action = { kind: 'add_minutes' | 'suspend' | 'resume'; partnerId: string };

/** What a person without the admin flag sees, and what a 404 from the API turns the page into: the same as a page that is not there. */
function NotFound() {
  return (
    <div className="py-16 text-center">
      <h1 className="text-2xl font-bold text-slate-900">Not found</h1>
      <p className="mt-2 text-sm text-slate-600">There is no page at this address.</p>
    </div>
  );
}

export default function DashboardAdminPage() {
  const { me } = useDash();

  const [rows, setRows] = useState<DashAdminPartnerRow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [missing, setMissing] = useState(false);
  const [filter, setFilter] = useState('');
  // "Now" for the seven-day counts, taken when the rows arrive (a render must not read the clock).
  const [nowMs, setNowMs] = useState(0);

  // One action at a time, confirmed in a panel on the page (no window.confirm).
  const [action, setAction] = useState<Action | null>(null);
  const [minutes, setMinutes] = useState('300');
  const [pending, setPending] = useState(false);
  const [actionError, setActionError] = useState('');
  const [done, setDone] = useState('');
  const panelFocus = useRef<HTMLElement | null>(null);
  const result = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const r = await dashFetch<{ rows: DashAdminPartnerRow[] }>('admin/partners');
      setRows(r.rows ?? []);
      setNowMs(Date.now());
    } catch (err) {
      if (err instanceof DashApiError && err.status === 401) return;
      if (err instanceof DashApiError && err.status === 404) setMissing(true);
      else setError(errorText(err, 'We could not load the partners.'));
    } finally {
      setLoading(false);
    }
  }, []);

  // Asked only for an admin: for anyone else the page is "not found" without a call.
  useEffect(() => { if (me.admin) void load(); }, [load, me.admin]);

  useEffect(() => { if (action) panelFocus.current?.focus(); }, [action]);
  useEffect(() => { if (done) result.current?.focus(); }, [done]);

  if (!me.admin || missing) return <NotFound />;

  function open(a: Action, button: HTMLButtonElement) {
    opener.current = button;
    setAction(a);
    setMinutes('300');
    setActionError('');
    setDone('');
  }

  function cancel() {
    setAction(null);
    setActionError('');
    opener.current?.focus();
  }

  const minutesN = Number(minutes);
  const minutesOk = /^\d+$/.test(minutes.trim()) && Number.isInteger(minutesN) && minutesN >= 1 && minutesN <= 100000;

  async function apply(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending || !action) return;
    if (action.kind === 'add_minutes' && !minutesOk) return;
    const a = action;
    const label = nameOf(rows?.find((r) => r.partnerId === a.partnerId)) || a.partnerId;
    setPending(true);
    setActionError('');
    try {
      await dashFetch('admin/partners', { body: a.kind === 'add_minutes' ? { action: a.kind, partnerId: a.partnerId, minutes: minutesN } : { action: a.kind, partnerId: a.partnerId } });
      setAction(null);
      setDone(
        a.kind === 'add_minutes' ? `Added ${minutesN.toLocaleString()} minutes to ${label}.`
          : a.kind === 'suspend' ? `${label} is suspended. Their sessions and API calls stop within a minute.`
            : `${label} is active again.`,
      );
      await load();
    } catch (err) {
      if (err instanceof DashApiError && err.status === 401) return;
      setActionError(
        err instanceof DashApiError && err.status === 400 ? 'That was not accepted. Minutes must be a whole number from 1 to 100,000.'
          : errorText(err, 'That did not go through. Nothing was changed.'),
      );
    } finally {
      setPending(false);
    }
  }

  const all = [...(rows ?? [])].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  const q = filter.trim().toLowerCase();
  const shown = q
    ? all.filter((r) => [r.name, r.partnerId, r.owner?.email, r.owner?.company, r.owner?.name].some((v) => (v || '').toLowerCase().includes(q)))
    : all;
  const newThisWeek = all.filter((r) => r.createdAt && nowMs - new Date(r.createdAt).getTime() < WEEK_MS).length;
  const activeThisWeek = all.filter((r) => r.sessions7d > 0).length;
  const minutesUsed = all.reduce((sum, r) => sum + r.usedMinutes, 0);
  const target = action ? all.find((r) => r.partnerId === action.partnerId) : undefined;
  const targetName = nameOf(target) || action?.partnerId || '';

  return (
    <>
      <PageHeader title="All partners">
        Every partner account, newest first. Times are in your local time zone.
      </PageHeader>

      {error && (
        <div className="mb-4 space-y-3">
          <Notice>{error}</Notice>
          <button type="button" onClick={() => void load()} className={secondaryButton}>Try again</button>
        </div>
      )}

      {!rows && loading && (
        <div role="status" aria-label="Loading partners" className="animate-pulse space-y-2">
          {Array.from({ length: 6 }, (_, i) => <div key={i} className="h-12 rounded-lg bg-slate-100" />)}
        </div>
      )}

      {rows && (
        <>
          <p className="mb-4 text-sm text-slate-700">
            <span className="font-semibold text-slate-900">{all.length.toLocaleString()}</span> {all.length === 1 ? 'partner' : 'partners'}
            {' · '}<span className="font-semibold text-slate-900">{newThisWeek.toLocaleString()}</span> signed up in the last 7 days
            {' · '}<span className="font-semibold text-slate-900">{activeThisWeek.toLocaleString()}</span> active in the last 7 days
            {' · '}<span className="font-semibold text-slate-900">{num(minutesUsed)}</span> minutes used
          </p>

          <div className="mb-4 max-w-sm">
            <label htmlFor="partner-filter" className={labelClass}>Filter by name, partner id or email</label>
            <input
              id="partner-filter" type="search" autoComplete="off" spellCheck={false}
              value={filter} onChange={(e) => setFilter(e.target.value)} className={inputClass}
            />
          </div>

          <div ref={result} tabIndex={-1} aria-live="polite" className="focus:outline-none">
            {done && <div className="mb-4"><Notice kind="success">{done}</Notice></div>}
          </div>

          {action && (
            <form
              onSubmit={apply} role="group" aria-labelledby="admin-confirm"
              className={`mb-4 rounded-lg border p-4 ${action.kind === 'suspend' ? 'border-amber-200 bg-amber-50' : 'border-slate-200 bg-slate-50'}`}
            >
              <p id="admin-confirm" className="text-sm font-semibold text-slate-900">
                {action.kind === 'add_minutes' ? 'Add minutes to' : action.kind === 'suspend' ? 'Suspend' : 'Resume'} {targetName}
                {' '}<span className="break-all font-mono text-xs font-normal text-slate-600">({action.partnerId})</span>{action.kind !== 'add_minutes' && '?'}
              </p>
              {action.kind === 'add_minutes' ? (
                <div className="mt-3">
                  <label htmlFor="add-minutes" className={labelClass}>Minutes to add to the pool</label>
                  <input
                    ref={(el) => { panelFocus.current = el; }} id="add-minutes" type="number" inputMode="numeric" min={1} max={100000} step={1} required
                    value={minutes} onChange={(e) => setMinutes(e.target.value)} disabled={pending}
                    aria-describedby="add-minutes-hint" className={`${inputClass} max-w-[10rem]`}
                  />
                  <p id="add-minutes-hint" className="mt-1 text-xs text-slate-600">
                    A whole number from 1 to 100,000.{target?.pooled && ` The cap is ${num(target.capMinutes)} now, with ${num(target.usedMinutes)} used.`}
                  </p>
                </div>
              ) : action.kind === 'suspend' ? (
                <p className="mt-2 text-sm text-amber-900">Suspending stops their sessions and API calls within a minute. Their data and keys are kept, and Resume turns them back on.</p>
              ) : (
                <p className="mt-2 text-sm text-slate-700">Their sessions and API calls work again within a minute.</p>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  ref={action.kind === 'add_minutes' ? undefined : (el) => { panelFocus.current = el; }}
                  type="submit" disabled={pending || (action.kind === 'add_minutes' && !minutesOk)}
                  className={action.kind === 'suspend' ? dangerButton : primaryButton}
                >
                  {action.kind === 'add_minutes' ? (pending ? 'Adding…' : 'Add minutes')
                    : action.kind === 'suspend' ? (pending ? 'Suspending…' : 'Yes, suspend')
                      : (pending ? 'Resuming…' : 'Yes, resume')}
                </button>
                <button type="button" onClick={cancel} disabled={pending} className={secondaryButton}>Cancel</button>
              </div>
              <div aria-live="polite" className="mt-3">{actionError && <Notice>{actionError}</Notice>}</div>
            </form>
          )}

          {all.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 px-6 py-12 text-center">
              <p className="text-base font-semibold text-slate-900">No partners yet</p>
              <p className="mx-auto mt-1 max-w-sm text-sm text-slate-600">A partner appears here when someone signs up for a sandbox.</p>
            </div>
          ) : (
            <div className={`relative overflow-x-auto rounded-lg border border-slate-200 ${loading ? 'opacity-60' : ''}`} aria-busy={loading}>
              <table className="w-full min-w-[1240px] text-left text-sm">
                <caption className="sr-only">All partners, newest first</caption>
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th scope="col" className="px-3 py-2.5 font-medium">Partner</th>
                    <th scope="col" className="px-3 py-2.5 font-medium">Owner</th>
                    <th scope="col" className="px-3 py-2.5 font-medium">Plan</th>
                    <th scope="col" className="px-3 py-2.5 font-medium">Status</th>
                    <th scope="col" className="px-3 py-2.5 font-medium">Minutes used / cap</th>
                    <th scope="col" className="px-3 py-2.5 text-right font-medium">Sessions</th>
                    <th scope="col" className="px-3 py-2.5 font-medium">Last session</th>
                    <th scope="col" className="px-3 py-2.5 font-medium">Signed up</th>
                    <th scope="col" className="px-3 py-2.5 font-medium"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {shown.map((r) => {
                    const pct = r.pooled && r.capMinutes > 0 ? Math.min(100, Math.max(0, (r.usedMinutes / r.capMinutes) * 100)) : 0;
                    const full = r.pooled && r.usedMinutes >= r.capMinutes;
                    const suspended = r.status === 'suspended';
                    return (
                      <tr key={r.partnerId} className={`border-t border-slate-100 align-top ${action?.partnerId === r.partnerId ? 'bg-blue-50/50' : ''}`}>
                        <th scope="row" className="min-w-[11rem] max-w-[15rem] px-3 py-2.5 font-normal">
                          <span className="block break-words font-medium text-slate-900">{nameOf(r)}</span>
                          <span className="block break-all font-mono text-xs text-slate-500">{r.partnerId}</span>
                        </th>
                        <td className="min-w-[13rem] max-w-[17rem] px-3 py-2.5 text-slate-700">
                          {r.owner ? (
                            <>
                              <a href={`mailto:${r.owner.email}`} className={`break-all ${linkClass}`}>{r.owner.email}</a>
                              <span className="block text-xs text-slate-500">
                                {r.owner.name && `${r.owner.name} · `}{r.people.toLocaleString()} {r.people === 1 ? 'person' : 'people'}
                              </span>
                            </>
                          ) : <span className="text-slate-400">—</span>}
                        </td>
                        <td className="px-3 py-2.5">
                          {r.plan
                            ? <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${r.plan === 'sandbox' ? 'bg-amber-50 text-amber-800' : 'bg-slate-100 text-slate-700'}`}>{r.plan}</span>
                            : <span className="text-slate-400">—</span>}
                        </td>
                        <td className="px-3 py-2.5">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${suspended ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>{r.status}</span>
                        </td>
                        <td className="px-3 py-2.5 text-slate-700">
                          {r.pooled ? (
                            <>
                              <span className="whitespace-nowrap tabular-nums">{num(r.usedMinutes)} / {num(r.capMinutes)}</span>
                              <div
                                role="progressbar" aria-label={`Minutes used by ${nameOf(r)}`} aria-valuemin={0} aria-valuemax={r.capMinutes} aria-valuenow={r.usedMinutes}
                                aria-valuetext={`${num(r.usedMinutes)} of ${num(r.capMinutes)} minutes used`}
                                className="mt-1 h-1.5 w-28 overflow-hidden rounded-full bg-slate-100"
                              >
                                <div className={`h-full rounded-full ${full ? 'bg-red-600' : 'bg-blue-600'}`} style={{ width: `${pct}%` }} />
                              </div>
                              {full && <span className="mt-0.5 block text-xs text-red-700">used up</span>}
                            </>
                          ) : <span className="text-slate-500">not pooled</span>}
                        </td>
                        <td className="px-3 py-2.5 text-right tabular-nums text-slate-700">
                          {r.sessions.toLocaleString()}
                          <span className="block whitespace-nowrap text-xs text-slate-500">{r.sessions7d.toLocaleString()} in 7 days</span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-2.5 text-slate-700">
                          {r.lastSessionAt ? <time dateTime={r.lastSessionAt}>{whenText(r.lastSessionAt)}</time> : <span className="text-slate-400">Never</span>}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2.5 text-slate-700">
                          {r.createdAt ? <time dateTime={r.createdAt}>{dayText(r.createdAt)}</time> : <span className="text-slate-400">—</span>}
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button" onClick={(e) => open({ kind: 'add_minutes', partnerId: r.partnerId }, e.currentTarget)}
                              disabled={pending || !r.pooled} title={r.pooled ? undefined : NOT_POOLED} aria-description={r.pooled ? undefined : NOT_POOLED}
                              className={`${secondaryButton} whitespace-nowrap px-2.5 py-1.5`}
                            >
                              <Plus className="h-3.5 w-3.5" aria-hidden />Add minutes<span className="sr-only"> to {nameOf(r)}</span>
                            </button>
                            <button
                              type="button" onClick={(e) => open({ kind: suspended ? 'resume' : 'suspend', partnerId: r.partnerId }, e.currentTarget)}
                              disabled={pending}
                              className={`${secondaryButton} whitespace-nowrap px-2.5 py-1.5 ${suspended ? '' : 'border-red-300 text-red-700 hover:bg-red-50'}`}
                            >
                              {suspended ? <Play className="h-3.5 w-3.5" aria-hidden /> : <Ban className="h-3.5 w-3.5" aria-hidden />}
                              {suspended ? 'Resume' : 'Suspend'}<span className="sr-only"> {nameOf(r)}</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {shown.length === 0 && (
                    <tr className="border-t border-slate-100">
                      <td colSpan={9} className="px-3 py-6 text-center text-slate-500">No partner matches &ldquo;{filter.trim()}&rdquo;.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {q && all.length > 0 && (
            <p className="mt-3 text-sm text-slate-500" aria-live="polite">{shown.length.toLocaleString()} of {all.length.toLocaleString()} shown.</p>
          )}
        </>
      )}
    </>
  );
}

/** The company the owner signed up with, else the partner row's name. */
function nameOf(r: DashAdminPartnerRow | undefined): string {
  return r ? r.owner?.company || r.name || r.partnerId : '';
}
