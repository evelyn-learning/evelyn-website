'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { RefreshCw, Send } from 'lucide-react';
import { CodeBlock } from '../../../docs/components/CodeBlock';
import { DashApiError, dashFetch, errorText, type DashWebhook, type DashWebhookDelivery } from '../../dash-api';
import { webhookPayloadExample, webhookVerifySnippet } from '../../snippets';
import { CopyButton, Notice, inputClass, labelClass, linkClass, primaryButton, secondaryButton } from '../../ui';
import { Card, PageHeader, useDash } from '../DashboardShell';

const whenText = (iso: string) => new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'medium' });
const code = 'rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-800';

const EVENTS: Array<{ type: string; when: string }> = [
  { type: 'session.ended', when: 'Once per session, when its end is saved.' },
  { type: 'pool.low', when: '80% of your minutes are used.' },
  { type: 'pool.exhausted', when: 'All of your minutes are used.' },
  { type: 'webhook.test', when: 'You pressed "Send test event" on this page.' },
];

/** Why a delivery or a test did not go through, in plain words. A code without a line is shown as it is. */
const DELIVERY_ERROR: Record<string, string> = {
  timeout: 'No answer within 6 seconds.',
  unreachable: 'We could not connect to your server.',
  redirect_not_followed: 'Your server answered with a redirect, which we do not follow.',
  private_host: 'That host is not reachable from the internet.',
  invalid_url: 'The saved URL no longer resolves to a server.',
  https_only: 'The URL must start with https://',
  no_secret: 'This account has no secret to sign with. Write to info@evelynlearning.com.',
  no_webhook: 'Save a webhook URL first.',
  not_sent: 'The event was not sent.',
};

interface TestResult { ok: boolean; status: number; error?: string }

/** The one sentence a test ends on. */
function testText(r: TestResult): string {
  if (r.error === 'redirect_not_followed') return 'Your server answered with a redirect, which we do not follow.';
  if (r.status > 0) return `Your server answered ${r.status}.`;
  return (r.error && DELIVERY_ERROR[r.error]) || 'Your server did not answer.';
}

/** A delivery's result as a number and a word; the colour only repeats them. */
function resultBadge(d: DashWebhookDelivery): { text: string; tone: string } {
  if (d.ok) return { text: `${d.status} delivered`, tone: 'bg-green-50 text-green-700' };
  if (d.status === 0) return { text: 'no answer', tone: 'bg-red-50 text-red-700' };
  if (d.status >= 300 && d.status < 400) return { text: `${d.status} redirect`, tone: 'bg-amber-50 text-amber-800' };
  return { text: `${d.status} refused`, tone: d.status >= 500 ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-800' };
}

export default function DashboardWebhooksPage() {
  const { me } = useDash();
  const isOwner = me.account.role === 'owner';

  const [data, setData] = useState<DashWebhook | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [url, setUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ kind: 'error' | 'success'; text: string } | null>(null);
  // Removing takes two clicks (no window.confirm): the first asks, the second does it.
  const [confirmRemove, setConfirmRemove] = useState(false);

  const [testing, setTesting] = useState(false);
  const [test, setTest] = useState<{ kind: 'error' | 'success'; text: string } | null>(null);

  const load = useCallback(async (opts: { keepField?: boolean } = {}) => {
    setLoading(true);
    setError('');
    try {
      const d = await dashFetch<DashWebhook>('webhook');
      setData(d);
      if (!opts.keepField) setUrl(d.url ?? '');
    } catch (err) {
      if (!(err instanceof DashApiError && err.status === 401)) setError(errorText(err, 'We could not load your webhook.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function put(next: string) {
    if (saving) return;
    setSaving(true);
    setSaveMsg(null);
    setTest(null);
    try {
      const r = await dashFetch<{ ok: true; url: string | null }>('webhook', { method: 'PUT', body: { url: next } });
      setData((d) => ({ url: r.url, deliveries: d?.deliveries ?? [] }));
      setUrl(r.url ?? '');
      setSaveMsg({ kind: 'success', text: r.url ? 'Saved. Send a test event to check that your server answers.' : 'Removed. No events are sent.' });
    } catch (err) {
      if (!(err instanceof DashApiError && err.status === 401)) setSaveMsg({ kind: 'error', text: errorText(err, 'We could not save that. Nothing was changed.') });
    } finally {
      setSaving(false);
      setConfirmRemove(false);
    }
  }

  function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (url.trim()) void put(url.trim());
  }

  async function sendTest() {
    if (testing) return;
    setTesting(true);
    setTest(null);
    try {
      const r = await dashFetch<TestResult>('webhook', { method: 'POST', body: {} });
      setTest({ kind: r.ok ? 'success' : 'error', text: testText(r) });
      void load({ keepField: true });
    } catch (err) {
      if (!(err instanceof DashApiError && err.status === 401)) setTest({ kind: 'error', text: errorText(err, 'We could not send the test event. Try again.') });
    } finally {
      setTesting(false);
    }
  }

  const saved = data?.url ?? null;
  const dirty = url.trim() !== (saved ?? '');
  const deliveries = data?.deliveries ?? [];

  return (
    <>
      <PageHeader title="Webhooks">
        Our server sends a POST to yours when a session ends or your minutes run low. It is sent from our side, so it
        arrives even if the student closed the tab.
      </PageHeader>

      {error && (
        <div className="mb-4 space-y-3">
          <Notice>{error}</Notice>
          <button type="button" onClick={() => void load()} className={secondaryButton}>Try again</button>
        </div>
      )}

      <div className="max-w-3xl space-y-6">
        <Card title="Your endpoint">
          {!data && loading ? (
            <div role="status" aria-label="Loading your webhook" className="h-11 animate-pulse rounded-lg bg-slate-100" />
          ) : (
            <>
              <form onSubmit={save}>
                <label htmlFor="webhook-url" className={labelClass}>Webhook URL</label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    id="webhook-url" type="text" inputMode="url" autoComplete="off" spellCheck={false} autoCapitalize="off" maxLength={500}
                    placeholder="https://example.com/hooks/evelyn"
                    value={url} onChange={(e) => setUrl(e.target.value)} disabled={saving} readOnly={!isOwner}
                    aria-describedby="webhook-hint" className={`${inputClass} font-mono sm:flex-1`}
                  />
                  {isOwner && (
                    <button type="submit" disabled={saving || !dirty || !url.trim()} className={`${primaryButton} shrink-0`}>
                      {saving && !confirmRemove ? 'Saving…' : 'Save'}
                    </button>
                  )}
                </div>
                <p id="webhook-hint" className="mt-1 text-xs text-slate-500">
                  {isOwner
                    ? 'An https:// address on the public internet, on port 443 or 8443. One URL receives every event.'
                    : saved ? 'Only the account owner can change the webhook URL.' : 'No webhook is set. Only the account owner can set one.'}
                </p>
              </form>

              {isOwner && saved && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {confirmRemove ? (
                    <>
                      <button type="button" onClick={() => void put('')} disabled={saving} className={`${secondaryButton} border-red-300 text-red-700 hover:bg-red-50`}>
                        {saving ? 'Removing…' : 'Confirm remove'}
                      </button>
                      <button type="button" onClick={() => setConfirmRemove(false)} disabled={saving} className={secondaryButton}>Cancel</button>
                    </>
                  ) : (
                    <button type="button" onClick={() => setConfirmRemove(true)} disabled={saving} className={secondaryButton}>Remove</button>
                  )}
                </div>
              )}
              <div aria-live="polite" className="mt-3">{saveMsg && <Notice kind={saveMsg.kind}>{saveMsg.text}</Notice>}</div>

              <div className="mt-4 border-t border-slate-100 pt-4">
                <button
                  type="button" onClick={() => void sendTest()} disabled={testing || !saved || dirty}
                  aria-describedby="test-hint" className={secondaryButton}
                >
                  <Send className="h-4 w-4" aria-hidden />{testing ? 'Waiting for your server…' : 'Send test event'}
                </button>
                <p id="test-hint" className="mt-2 text-xs text-slate-500">
                  {!saved ? 'Save a URL first.' : dirty ? 'Save the changed URL first.' : <>Sends a signed <code className="font-mono">webhook.test</code> event to the saved URL and waits up to 6 seconds for the answer.</>}
                </p>
                <div aria-live="polite" className="mt-3">{test && <Notice kind={test.kind}>{test.text}</Notice>}</div>
              </div>
            </>
          )}
        </Card>

        <Card title="Events">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">The events sent to your webhook</caption>
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th scope="col" className="pb-3 pr-4 font-medium text-slate-500">type</th>
                  <th scope="col" className="pb-3 font-medium text-slate-500">Sent when</th>
                </tr>
              </thead>
              <tbody>
                {EVENTS.map((e) => (
                  <tr key={e.type} className="border-b border-slate-100 last:border-0">
                    <td className="whitespace-nowrap py-2.5 pr-4"><code className={code}>{e.type}</code></td>
                    <td className="py-2.5 text-slate-600">{e.when}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <CodeBlock language="json" title="The body of session.ended">{webhookPayloadExample(me.partnerId)}</CodeBlock>
          <p className="text-sm text-slate-600">
            The transcript and whiteboard are not in the event: they are in the session&apos;s replay, on the{' '}
            <Link href="/dashboard/sessions" className={linkClass}>Sessions</Link> page.
          </p>
        </Card>

        <Card title="Verifying an event">
          <p className="text-sm text-slate-600">Every request carries three headers:</p>
          <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
            <li><code className={code}>x-evelyn-event</code> the event type.</li>
            <li><code className={code}>x-evelyn-timestamp</code> when it was sent, in Unix milliseconds.</li>
            <li>
              <code className={code}>x-evelyn-signature</code> the hex HMAC-SHA256 of{' '}
              <code className={`${code} break-all`}>{'`${timestamp}.${rawBody}`'}</code> with your partner secret.
            </li>
          </ul>
          <p className="mt-3 text-sm text-slate-600">
            Compute the same signature over the raw body, before any JSON parsing, and refuse the request if it differs or
            if the timestamp is more than 5 minutes old. The secret is the one on the{' '}
            <Link href="/dashboard/keys" className={linkClass}>API keys</Link> page.
          </p>
          <CodeBlock language="js" title="Node (Express)">{webhookVerifySnippet}</CodeBlock>
          <CopyButton value={webhookVerifySnippet} label="Copy snippet" />
        </Card>

        <Card title="Delivery rules">
          <ul className="list-disc space-y-1.5 pl-5 text-sm text-slate-600">
            <li>Answer with a 2xx status within 6 seconds.</li>
            <li>We try three times: at once, after 3 seconds, and after 15 seconds.</li>
            <li>A 4xx answer other than 408 or 429 is not retried.</li>
            <li>Redirects are not followed.</li>
            <li>Deliveries are listed on this page for 14 days.</li>
          </ul>
        </Card>
      </div>

      <section aria-labelledby="deliveries-heading" className="mt-8">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 id="deliveries-heading" className="text-base font-semibold text-slate-900">Deliveries</h2>
          <button type="button" onClick={() => void load({ keepField: true })} disabled={loading} className={secondaryButton}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} aria-hidden />
            {loading ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>

        {data && deliveries.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-300 px-6 py-12 text-center">
            <p className="text-base font-semibold text-slate-900">No deliveries yet</p>
            <p className="mx-auto mt-1 max-w-sm text-sm text-slate-600">
              {saved ? 'Send a test event, or end a session, and it is listed here.' : 'Save a webhook URL and send a test event; it is listed here.'}
            </p>
          </div>
        )}

        {deliveries.length > 0 && (
          <div className={`relative overflow-x-auto rounded-lg border border-slate-200 ${loading ? 'opacity-60' : ''}`} aria-busy={loading}>
            <table className="w-full min-w-[760px] text-left text-sm">
              <caption className="sr-only">Recent webhook deliveries, newest first</caption>
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th scope="col" className="px-3 py-2.5 font-medium">Time</th>
                  <th scope="col" className="px-3 py-2.5 font-medium">Event</th>
                  <th scope="col" className="px-3 py-2.5 font-medium">Result</th>
                  <th scope="col" className="px-3 py-2.5 text-right font-medium">Attempts</th>
                  <th scope="col" className="px-3 py-2.5 text-right font-medium">Duration</th>
                  <th scope="col" className="px-3 py-2.5 font-medium">Error</th>
                </tr>
              </thead>
              <tbody>
                {deliveries.map((d, i) => {
                  const badge = resultBadge(d);
                  return (
                    <tr key={`${d.at}-${d.event}-${i}`} className="border-t border-slate-100 align-top">
                      <td className="whitespace-nowrap px-3 py-2.5 text-slate-700"><time dateTime={d.at}>{whenText(d.at)}</time></td>
                      <td className="whitespace-nowrap px-3 py-2.5 font-mono text-xs text-slate-800">{d.event}</td>
                      <td className="px-3 py-2.5">
                        <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium tabular-nums ${badge.tone}`}>{badge.text}</span>
                      </td>
                      <td className="px-3 py-2.5 text-right tabular-nums text-slate-700">{d.attempts}</td>
                      <td className="whitespace-nowrap px-3 py-2.5 text-right tabular-nums text-slate-700">
                        {d.ms == null ? <span className="text-slate-400">—</span> : `${d.ms.toLocaleString()} ms`}
                      </td>
                      <td className="min-w-[14rem] max-w-[22rem] px-3 py-2.5">
                        {d.error ? (
                          <>
                            <span className="break-all font-mono text-xs text-slate-800">{d.error}</span>
                            {DELIVERY_ERROR[d.error] && <span className="mt-0.5 block text-xs text-slate-500">{DELIVERY_ERROR[d.error]}</span>}
                          </>
                        ) : <span className="text-slate-400">—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
