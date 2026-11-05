'use client';

import { useEffect, useRef, useState } from 'react';
import ExportSessionPDFButton from '@/components/session/ExportSessionPDFButton';
import type { SummaryState } from '@/lib/tutor/portal/learner-summary-store';
import SummaryBody from '../home/SummaryBody';
import { panelPollDelayMs } from '../home/home-rows';

type Props = {
  sessionId: string;
  token?: string;
  transcript: unknown[];
  whiteboardCommands: unknown[];
  studentName?: string;
  subject?: string;
  topic?: string;
  level?: string;
  sessionGoal?: string;
  productName?: string;
  showHomeLink?: boolean;
};

const API = '/api/tutor-portal/learner-summary';
const FIRST_POST_DELAY_MS = 1500;

/** End-of-lesson screen: summary (POST once, then poll GET), replay, PDF, back-to-home. */
export default function LessonSummaryPanel(p: Props) {
  const [state, setState] = useState<SummaryState>({ status: 'pending' });
  const [replayUrl, setReplayUrl] = useState<string | null>(null);
  const [hasAudio, setHasAudio] = useState(false);
  const [denied, setDenied] = useState(false);
  const [run, setRun] = useState(0); // bump to restart (Retry)
  const headers = { 'x-embed-token': p.token ?? '' };

  useEffect(() => {
    let stop = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const t0 = Date.now();
    const apply = (j: { state?: SummaryState; replayUrl?: string | null; hasAudio?: boolean } | null) => {
      if (!j) return;
      if (j.replayUrl) setReplayUrl(j.replayUrl);
      if (typeof j.hasAudio === 'boolean') setHasAudio(j.hasAudio);
      if (j.state && j.state.status !== 'none') setState(j.state);
    };
    const poll = async () => {
      if (stop) return;
      try {
        const r = await fetch(`${API}?sessionId=${encodeURIComponent(p.sessionId)}`, { method: 'GET', headers, cache: 'no-store' });
        if (r.status === 401 || r.status === 403) { setDenied(true); return; }
        const j = r.ok ? await r.json() : null;
        if (stop) return;
        apply(j);
        if (j?.state && (j.state.status === 'ready' || j.state.status === 'failed')) return;
      } catch { /* keep polling */ }
      if (stop) return;
      const d = panelPollDelayMs(Date.now() - t0);
      if (d === null) { setState({ status: 'failed', error: 'Summary is taking longer than expected' }); return; }
      timer = setTimeout(poll, d);
    };
    const start = async () => {
      if (stop) return;
      try {
        const r = await fetch(API, {
          method: 'POST',
          headers: { 'content-type': 'application/json', ...headers },
          body: JSON.stringify({ sessionId: p.sessionId }),
        });
        if (r.status === 401 || r.status === 403) { setDenied(true); return; }
        const j = r.ok ? await r.json() : null;
        if (stop) return;
        apply(j);
        if (j?.state && (j.state.status === 'ready' || j.state.status === 'failed')) return;
      } catch { /* fall through to polling */ }
      if (!stop) timer = setTimeout(poll, panelPollDelayMs(0) ?? 2000);
    };
    // The completed save is fire-and-forget: give it a moment to land.
    timer = setTimeout(start, FIRST_POST_DELAY_MS);
    return () => { stop = true; if (timer) clearTimeout(timer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p.sessionId, p.token, run]);

  if (denied) {
    return (
      <div className="max-w-md text-center p-8">
        <div className="mb-4 text-4xl">&#10003;</div>
        <h1 className="mb-2 text-xl font-bold text-gray-900">Session Complete</h1>
        <p className="text-sm text-gray-600">
          {p.transcript.length} messages exchanged, {p.whiteboardCommands.length} visuals generated.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg space-y-4 p-6">
      <div className="text-center">
        <div className="mb-2 text-3xl">&#10003;</div>
        <h1 className="text-xl font-bold text-gray-900">Lesson complete</h1>
      </div>
      <section className="space-y-3 rounded-xl bg-white p-4 shadow-sm">
        {state.status === 'pending' && <p className="text-sm text-gray-500">Preparing your summary…</p>}
        {state.status === 'failed' && (
          <p className="text-sm text-gray-600">
            {state.error === 'Summary is taking longer than expected' ? `${state.error} — ` : 'Summary not available — '}
            <button
              type="button"
              className="font-medium underline"
              onClick={async () => {
                setState({ status: 'pending' });
                try {
                  const r = await fetch(API, { method: 'POST', headers: { 'content-type': 'application/json', ...headers }, body: JSON.stringify({ sessionId: p.sessionId }) });
                  if (r.status === 401 || r.status === 403) { setDenied(true); return; }
                  const j = await r.json();
                  if (j?.replayUrl) setReplayUrl(j.replayUrl);
                  setState(j?.state ?? { status: 'failed' });
                } catch { setState({ status: 'failed' }); }
              }}
            >
              Retry
            </button>
          </p>
        )}
        {state.status === 'ready' && state.summary && <SummaryBody summary={state.summary} />}
        <div className="flex flex-wrap items-center gap-2">
          {replayUrl && (
            <a href={replayUrl} target="_blank" rel="noopener" className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700">
              {hasAudio ? 'Replay with audio' : 'Replay'}
            </a>
          )}
          <ExportSessionPDFButton
            transcript={p.transcript as never}
            whiteboardCommands={p.whiteboardCommands as never}
            topic={p.topic}
            subject={p.subject}
            level={p.level}
            sessionGoal={p.sessionGoal}
            studentName={p.studentName}
            productName={p.productName}
          />
        </div>
      </section>
      {p.showHomeLink && p.token && (
        <div className="text-center">
          <a href={`/tutor-portal/home?token=${encodeURIComponent(p.token)}`} className="text-sm font-medium underline" style={{ color: 'var(--brand-color, #2563eb)' }}>
            Back to your lessons
          </a>
        </div>
      )}
    </div>
  );
}
