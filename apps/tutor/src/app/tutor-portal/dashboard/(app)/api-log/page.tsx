'use client';

import { useCallback, useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { DashApiError, dashFetch, errorText, type DashApiLogRow } from '../../dash-api';
import { Notice, secondaryButton } from '../../ui';
import { Card, PageHeader } from '../DashboardShell';

const whenText = (iso: string) => new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'medium' });

const SIGNATURE_HINT = <>The signature did not match. Sign <code className="break-all font-mono text-xs">timestamp.METHOD.path?query.body</code> exactly as sent, with your current secret.</>;
const CLOCK_HINT = 'Your server clock is more than 5 minutes off. Send the current time in milliseconds as the timestamp.';

/**
 * One line of plain words per error code. The codes are the ones the partner API answers with: the `reason`
 * strings of lib/tutor/portal/auth.ts and of the signature check it calls, and the `error` values that go
 * with them (a refused call answers { error: 'unauthorized' | 'forbidden', reason }). A code without a line
 * here is shown as it is.
 */
const HINTS: Record<string, React.ReactNode> = {
  unauthorized: <>The call was not accepted as yours. The <code className="font-mono text-xs">reason</code> field of the response says which: missing headers, an unknown partner id, a timestamp too far off, or a signature that did not match.</>,
  forbidden: <>The call was signed correctly but is not allowed. The <code className="font-mono text-xs">reason</code> field of the response says which: the account is suspended, or this endpoint is not open to it.</>,
  bad_signature: SIGNATURE_HINT,
  invalid_signature: SIGNATURE_HINT,
  stale_timestamp: CLOCK_HINT,
  timestamp_out_of_range: CLOCK_HINT,
  bad_timestamp: 'The timestamp header is not a number. Send the current time in milliseconds.',
  missing_auth_headers: 'The partner id, timestamp or signature header is missing from the call.',
  unknown_partner: 'The partner id in the call is not one we know. Check it against the API keys page.',
  partner_suspended: 'This account is suspended, so its calls are refused. Write to info@evelynlearning.com.',
  partner_cannot_authenticate: 'This partner id cannot call the API. Write to info@evelynlearning.com.',
  endpoint_not_allowed: 'This endpoint is not open to your account. Write to info@evelynlearning.com to have it added.',
  rate_limited: 'Too many calls in a short time. Wait for the number of seconds in the Retry-After header, then try again.',
  quota_exceeded: 'Your account has used its allowance of calls for this period.',
  quota_unverifiable: 'We could not check your allowance just then, so the call was refused. Try again.',
  bad_request: 'The call was understood but something in it is missing or wrong. The response body says what.',
  invalid_request: 'A field in the body is missing or has the wrong form. The response body lists each one.',
  invalid_json: 'The body is not valid JSON.',
  not_found: 'Nothing matches the id in the call (or it belongs to another partner).',
};

/** Status by number and by colour: the number is always shown, the colour only repeats it. */
function statusTone(status: number): string {
  if (status >= 500) return 'bg-red-50 text-red-700';
  if (status >= 400) return 'bg-amber-50 text-amber-800';
  if (status >= 200 && status < 300) return 'bg-green-50 text-green-700';
  return 'bg-slate-100 text-slate-700';
}
function statusWord(status: number): string {
  if (status >= 500) return 'server error';
  if (status >= 400) return 'refused';
  if (status >= 200 && status < 300) return 'ok';
  return '';
}

export default function DashboardApiLogPage() {
  const [rows, setRows] = useState<DashApiLogRow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loadedAt, setLoadedAt] = useState<Date | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const r = await dashFetch<{ rows: DashApiLogRow[] }>('api-log');
      setRows(r.rows ?? []);
      setLoadedAt(new Date());
    } catch (err) {
      if (!(err instanceof DashApiError && err.status === 401)) setError(errorText(err, 'We could not load your API log.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  return (
    <>
      <PageHeader title="API log">
        Your server&apos;s recent calls to <code className="font-mono text-xs">/api/portal/v1/*</code>, newest first, kept for 14 days. Times are in your local time zone.
      </PageHeader>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => void load()} disabled={loading} className={secondaryButton}>
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} aria-hidden />
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
        <p className="text-sm text-slate-500" aria-live="polite">
          {loadedAt && !loading && `Updated ${loadedAt.toLocaleTimeString(undefined, { timeStyle: 'medium' })}.`}
        </p>
      </div>

      {error && <div className="mb-4"><Notice>{error}</Notice></div>}

      {!rows && loading && (
        <div role="status" aria-label="Loading the API log" className="animate-pulse space-y-2">
          {Array.from({ length: 6 }, (_, i) => <div key={i} className="h-12 rounded-lg bg-slate-100" />)}
        </div>
      )}

      {rows && rows.length === 0 && (
        <div className="rounded-lg border border-dashed border-slate-300 px-6 py-12 text-center">
          <p className="text-base font-semibold text-slate-900">No API calls yet.</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-slate-600">
            Calls to <code className="font-mono text-xs">/api/portal/v1/*</code> appear here within a few seconds.
          </p>
        </div>
      )}

      {rows && rows.length > 0 && (
        <div className={`relative overflow-x-auto rounded-lg border border-slate-200 ${loading ? 'opacity-60' : ''}`} aria-busy={loading}>
          <table className="w-full min-w-[880px] text-left text-sm">
            <caption className="sr-only">Your recent API calls, newest first</caption>
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th scope="col" className="px-3 py-2.5 font-medium">Time</th>
                <th scope="col" className="px-3 py-2.5 font-medium">Method</th>
                <th scope="col" className="px-3 py-2.5 font-medium">Path</th>
                <th scope="col" className="px-3 py-2.5 font-medium">Status</th>
                <th scope="col" className="px-3 py-2.5 font-medium">Error</th>
                <th scope="col" className="px-3 py-2.5 text-right font-medium">Duration</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const hint = r.error ? HINTS[r.error] : undefined;
                return (
                  <tr key={`${r.at}-${i}`} className="border-t border-slate-100 align-top">
                    <td className="whitespace-nowrap px-3 py-2.5 text-slate-700">
                      <time dateTime={r.at}>{whenText(r.at)}</time>
                    </td>
                    <td className="px-3 py-2.5 font-mono text-xs text-slate-800">{r.method}</td>
                    <td className="min-w-[15rem] px-3 py-2.5"><span className="break-all font-mono text-xs text-slate-800">{r.path}</span></td>
                    <td className="px-3 py-2.5">
                      <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium tabular-nums ${statusTone(r.status)}`}>
                        {r.status}{statusWord(r.status) && ` ${statusWord(r.status)}`}
                      </span>
                    </td>
                    <td className="min-w-[14rem] max-w-[22rem] px-3 py-2.5">
                      {r.error ? (
                        <>
                          <span className="break-all font-mono text-xs text-slate-800">{r.error}</span>
                          {hint && <span className="mt-0.5 block text-xs text-slate-500">{hint}</span>}
                        </>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-right tabular-nums text-slate-700">{r.ms.toLocaleString()} ms</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 max-w-3xl space-y-6">
        <Card title="What is logged">
          <p className="text-sm text-slate-600">
            The time, method, path, status, error code and duration of each call. Bodies and query strings are not logged.
            A call refused for its signature is listed too, under the partner id it claimed.
          </p>
        </Card>

        <Card title="Common refusals">
          <p className="mb-3 text-sm text-slate-600">
            A refused call answers with an <code className="font-mono text-xs">error</code> and, for most, a{' '}
            <code className="font-mono text-xs">reason</code>. What each reason means:
          </p>
          <dl className="space-y-3 text-sm">
            {(['missing_auth_headers', 'unknown_partner', 'bad_signature', 'stale_timestamp', 'bad_timestamp', 'partner_suspended', 'endpoint_not_allowed', 'rate_limited'] as const).map((code) => (
              <div key={code}>
                <dt className="font-mono text-xs font-medium text-slate-900">{code}</dt>
                <dd className="mt-0.5 text-slate-600">{HINTS[code]}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>
    </>
  );
}
