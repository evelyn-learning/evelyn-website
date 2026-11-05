'use client';

import { useEffect, useState } from 'react';
import ExportSessionPDFButton from '@/components/session/ExportSessionPDFButton';
import type { LearnerSessionRow, SummaryState } from '@/lib/tutor/portal/learner-summary-store';
import { LocalTime } from '@/components/session/LocalTime';
import { rowLabel, levelBadge, nextPollDelayMs, cardShouldPoll } from './home-rows';
import SummaryBody from './SummaryBody';

function formatDuration(sec: number): string {
  const m = Math.round(sec / 60);
  return m < 1 ? '<1 min' : `${m} min`;
}

export default function LearnerSessionCard(
  { row, replayUrl, token, pollUrl, productName, summaryDisabled = false, nowMs }: {
    row: LearnerSessionRow; replayUrl: string | null; token: string; pollUrl: string; productName?: string;
    /** TUTOR_LEARNER_SUMMARY=off: a static line, no polling, no Retry (Replay/PDF stay). */
    summaryDisabled?: boolean;
    /** Server render time, so the "In progress" label matches on hydration. */
    nowMs: number;
  },
) {
  const [state, setState] = useState<SummaryState>(row.summary);
  const [retrying, setRetrying] = useState(false);
  const [expired, setExpired] = useState(false);
  const label = rowLabel(row, nowMs);
  const badge = summaryDisabled ? null : levelBadge(state);
  // Any stored summary is shown: kept while regenerating and after a failed regeneration.
  const s = summaryDisabled ? undefined : state.summary;

  useEffect(() => {
    if (!cardShouldPoll(state, { summaryDisabled, expired })) return;
    const t0 = Date.now();
    let stop = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const schedule = () => {
      const delay = nextPollDelayMs(Date.now() - t0);
      if (delay === null) {
        setState((prev) => ({ ...prev, status: 'failed', error: 'Summary is taking longer than expected' }));
        return;
      }
      if (timer) clearTimeout(timer);
      timer = setTimeout(tick, delay);
    };
    const tick = async () => {
      if (stop) return;
      try {
        const r = await fetch(pollUrl, { cache: 'no-store' });
        if (stop) return;
        if (r.status === 401 || r.status === 403) { setExpired(true); return; }
        const j = r.ok ? await r.json() : null;
        if (stop) return;
        if (j?.state && j.state.status !== 'pending' && j.state.status !== 'none') { setState(j.state); return; }
      } catch { /* keep polling */ }
      if (!stop) schedule();
    };
    schedule();
    return () => { stop = true; if (timer) clearTimeout(timer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status, pollUrl, summaryDisabled, expired]);

  async function retry() {
    setRetrying(true);
    setState((prev) => ({ ...prev, status: 'pending' }));
    try {
      const r = await fetch('/api/tutor-portal/learner-summary', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-embed-token': token },
        body: JSON.stringify({ sessionId: row.sessionId }),
      });
      if (r.status === 401 || r.status === 403) { setExpired(true); return; }
      const j = await r.json();
      setState((prev) => j?.state ?? { ...prev, status: 'failed' });
    } catch {
      setState((prev) => ({ ...prev, status: 'failed' }));
    } finally {
      setRetrying(false);
    }
  }

  return (
    <section className="space-y-3 rounded-xl bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-gray-900">{label.title}</h2>
          <p className="text-xs text-gray-500"><LocalTime iso={label.when} kind="datetime" /> · {formatDuration(row.durationSec)}</p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${label.status === 'Completed' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
            {label.status}
          </span>
          {badge && (
            <span className="rounded-full px-2.5 py-1 text-xs font-medium text-white" style={{ backgroundColor: 'var(--brand-color, #2563eb)' }}>
              {badge}
            </span>
          )}
        </div>
      </div>

      {summaryDisabled ? (
        <p className="text-sm text-gray-500">Summary not available</p>
      ) : expired ? (
        <p className="text-sm text-gray-600">This link has expired. Ask for a new one.</p>
      ) : label.status === 'In progress' && state.status === 'none' ? (
        <p className="text-sm text-gray-500">Your summary will be ready after the lesson ends.</p>
      ) : (
        <>
          {(state.status === 'pending' || state.status === 'none') && (
            <p className="text-sm text-gray-500">{s ? 'Updating your summary…' : 'Preparing your summary…'}</p>
          )}
          {state.status === 'failed' && (
            <p className="text-sm text-gray-600">
              {s ? 'Could not update this summary — ' : 'Summary not available — '}
              <button type="button" onClick={retry} disabled={retrying} className="font-medium underline disabled:opacity-50">Retry</button>
            </p>
          )}
        </>
      )}

      {s && <SummaryBody summary={s} />}

      <div className="flex flex-wrap items-center gap-2">
        {replayUrl && (
          <a href={replayUrl} target="_blank" rel="noopener" className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700">
            {row.hasAudio ? 'Replay with audio' : 'Replay'}
          </a>
        )}
        <ExportSessionPDFButton
          transcript={row.transcript as never}
          whiteboardCommands={row.whiteboardCommands as never}
          topic={row.topic}
          subject={row.subject}
          level={row.level}
          sessionGoal={row.sessionGoal}
          studentName={row.studentName}
          productName={productName}
        />
      </div>
    </section>
  );
}
