'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { DEMO_LANGUAGES } from '@core/demo/demo-languages';
import { DashApiError, dashFetch, errorText, type DashSessionRow } from '../../dash-api';
import { Notice, primaryButton, secondaryButton } from '../../ui';
import { PageHeader } from '../DashboardShell';

interface SessionsPage { rows: DashSessionRow[]; total: number; page: number; pages: number }

const languageName = (code: string) => DEMO_LANGUAGES.find((l) => l.code === code)?.english ?? code;
const startedText = (iso: string) => new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

const STATUS_TONE: Record<string, string> = {
  active: 'bg-blue-50 text-blue-700',
  completed: 'bg-green-50 text-green-700',
  ended: 'bg-green-50 text-green-700',
};

export default function DashboardSessionsPage() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<SessionsPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Per row: the replay being opened, and the row whose replay could not be opened.
  const [opening, setOpening] = useState<string | null>(null);
  const [replayError, setReplayError] = useState<{ sessionId: string; text: string } | null>(null);

  const load = useCallback(async (p: number) => {
    setLoading(true);
    setError('');
    try {
      setData(await dashFetch<SessionsPage>(`sessions?page=${p}`));
    } catch (err) {
      if (!(err instanceof DashApiError && err.status === 401)) setError(errorText(err, 'We could not load your sessions.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(page); }, [load, page]);

  async function openReplay(sessionId: string) {
    if (opening) return;
    setOpening(sessionId);
    setReplayError(null);
    // Opened in the click itself: a tab opened after the answer arrives is blocked as a pop-up. It has no
    // opener (set before it goes anywhere) and gets the replay address when the call answers.
    const tab = window.open('', '_blank');
    if (tab) tab.opener = null;
    try {
      const r = await dashFetch<{ url: string }>('sessions/replay', { body: { sessionId } });
      if (tab) tab.location.replace(r.url);
      else window.location.assign(r.url);
    } catch (err) {
      tab?.close();
      const notFound = err instanceof DashApiError && err.status === 404;
      setReplayError({ sessionId, text: notFound ? 'No replay is available for this session.' : errorText(err, 'We could not open the replay.') });
    } finally {
      setOpening(null);
    }
  }

  const rows = data?.rows ?? [];

  return (
    <>
      <PageHeader title="Sessions">
        Every session started with your keys, newest first. Times are in your local time zone.
      </PageHeader>

      {error && (
        <div className="mb-4 space-y-3">
          <Notice>{error}</Notice>
          <button type="button" onClick={() => void load(page)} className={secondaryButton}>Try again</button>
        </div>
      )}

      {!data && loading && (
        <div role="status" aria-label="Loading sessions" className="animate-pulse space-y-2">
          {Array.from({ length: 6 }, (_, i) => <div key={i} className="h-12 rounded-lg bg-slate-100" />)}
        </div>
      )}

      {data && data.total === 0 && (
        <div className="rounded-lg border border-dashed border-slate-300 px-6 py-12 text-center">
          <p className="text-base font-semibold text-slate-900">No sessions yet</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-slate-600">Run a test lesson and it shows up here, with its transcript and whiteboard replay.</p>
          <Link href="/dashboard/try" className={`${primaryButton} mt-5`}>Try it</Link>
        </div>
      )}

      {data && data.total > 0 && (
        <>
          <div className={`relative overflow-x-auto rounded-lg border border-slate-200 ${loading ? 'opacity-60' : ''}`} aria-busy={loading}>
            <table className="w-full min-w-[720px] text-left text-sm">
              <caption className="sr-only">Your sessions, page {data.page} of {data.pages}</caption>
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th scope="col" className="px-3 py-2.5 font-medium">Started</th>
                  <th scope="col" className="px-3 py-2.5 font-medium">Student</th>
                  <th scope="col" className="px-3 py-2.5 font-medium">Language</th>
                  <th scope="col" className="px-3 py-2.5 font-medium">Subject / topic</th>
                  <th scope="col" className="px-3 py-2.5 font-medium">Mode</th>
                  <th scope="col" className="px-3 py-2.5 text-right font-medium">Minutes</th>
                  <th scope="col" className="px-3 py-2.5 font-medium">Status</th>
                  <th scope="col" className="px-3 py-2.5 font-medium"><span className="sr-only">Replay</span></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.sessionId} className="border-t border-slate-100 align-top">
                    <td className="whitespace-nowrap px-3 py-2.5 text-slate-700">
                      <time dateTime={r.startedAt}>{startedText(r.startedAt)}</time>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="break-all font-mono text-xs text-slate-800">{r.studentId || '—'}</span>
                      {r.test && <span className="ml-2 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800">test</span>}
                    </td>
                    <td className="px-3 py-2.5 text-slate-700">{r.languages.map(languageName).join(', ')}</td>
                    <td className="max-w-[16rem] px-3 py-2.5 text-slate-700">
                      <span className="font-medium text-slate-900">{r.subject || '—'}</span>
                      {r.topic && <span className="block truncate text-slate-500" title={r.topic}>{r.topic}</span>}
                    </td>
                    <td className="px-3 py-2.5 capitalize text-slate-700">{r.inputMode}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-slate-700">{r.minutes.toLocaleString(undefined, { maximumFractionDigits: 1 })}</td>
                    <td className="px-3 py-2.5">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_TONE[r.status] ?? 'bg-slate-100 text-slate-700'}`}>{r.status}</span>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button type="button" onClick={() => void openReplay(r.sessionId)} disabled={opening !== null} className={`${secondaryButton} whitespace-nowrap px-2.5 py-1.5`}>
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                        {opening === r.sessionId ? 'Opening…' : 'View replay'}
                        <span className="sr-only"> of the session started {startedText(r.startedAt)} (opens in a new tab)</span>
                      </button>
                      {replayError?.sessionId === r.sessionId && (
                        <p role="alert" className="mt-1 text-xs text-red-700">{replayError.text}</p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <nav aria-label="Session pages" className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-500" aria-live="polite">
              Page {data.page} of {data.pages} · {data.total.toLocaleString()} {data.total === 1 ? 'session' : 'sessions'}
            </p>
            <div className="flex gap-2">
              <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={loading || data.page <= 1} className={secondaryButton}>
                <ChevronLeft className="h-4 w-4" aria-hidden />Previous
              </button>
              <button type="button" onClick={() => setPage((p) => p + 1)} disabled={loading || data.page >= data.pages} className={secondaryButton}>
                Next<ChevronRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </nav>
        </>
      )}
    </>
  );
}
