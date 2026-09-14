'use client';

import { useEffect, useState } from 'react';
import { voiceEngines } from '../../data/engines';

/**
 * Portal live demo (tutor.evelynlearning.com/demo).
 *
 * 2026-09-14 rewrite. The previous version built an UNSIGNED base64 token
 * client-side and rendered the iframe at `${base}/embed` where `base` was
 * computed from `window` — so the server-rendered src was
 * `/tutor-portal/embed`, the tutor.* middleware double-prefixed it to
 * `/tutor-portal/tutor-portal/embed`, and the frame 404'd (React does not
 * patch a mismatched attribute on hydration). Even with the path fixed, the
 * demo gate (2026-08-29) rejects unsigned evelyn-marketing tokens on every
 * costly route, so the session would have died on its first brain call.
 *
 * Now: same contract as the marketing widget — mandatory name + email,
 * POST /api/tutor/demo-start mints a signed, gated token and sets the
 * demo-grant cookie (same-origin, so it rides into the iframe's fetches),
 * and the iframe always uses the host-independent `/tutor-portal/embed`
 * path (the middleware passes already-prefixed paths through).
 */

const DEMO_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_KEY = 'evelyn:demo:studentName';
const EMAIL_KEY = 'evelyn:demo:studentEmail';

function buildDemoConfig(studentName: string) {
  return {
    subject: 'cs',
    level: 'ap',
    topic: 'ap-cs-principles',
    // Boot a real seed lesson plan so the tutor starts teaching it instead of
    // asking "what are we working on?" — the embed threads curriculum_module →
    // lessonPlanId → VoiceTutorRealtime, which fetches the plan by id.
    curriculum_module: 'evelyn.ap.csp.algorithms-abstraction.v1',
    student_name: studentName,
    session_goal: 'practice',
    input_mode: 'voice',
    max_duration_minutes: 10,
    wrap_at_minutes: 8,
    // Showcase, not an enrolled lesson — let the visitor steer it anywhere.
    open_scope: true,
    features: { voice_mode: true, text_mode: true, homework_upload: false },
    metadata: { source: 'tutor-portal-demo' },
  };
}

type StartResult =
  | { ok: true; token: string }
  | { ok: false; kind: 'limited'; reason: string }
  | { ok: false; kind: 'error' };

async function startGatedDemo(name: string, email: string): Promise<StartResult> {
  try {
    const res = await fetch('/api/tutor/demo-start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, config: buildDemoConfig(name) }),
    });
    if (res.status === 429) {
      const d = (await res.json().catch(() => ({}))) as { reason?: string };
      return { ok: false, kind: 'limited', reason: d.reason || 'limit' };
    }
    if (!res.ok) return { ok: false, kind: 'error' };
    const { token } = (await res.json()) as { token?: string };
    if (typeof token !== 'string' || !token) return { ok: false, kind: 'error' };
    return { ok: true, token };
  } catch {
    return { ok: false, kind: 'error' };
  }
}

const LIMIT_COPY: Record<string, string> = {
  email_limit: 'This email has used all of its free demo sessions.',
  ip_limit: 'This network has used all of its free demo sessions for today.',
  demo_busy: 'The demo is at capacity right now — please try again later.',
};

export function EngineSelector() {
  const engine = voiceEngines[0]!;
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [starting, setStarting] = useState(false);
  const [startError, setStartError] = useState(false);
  const [limited, setLimited] = useState<string | null>(null);
  const [embedSrc, setEmbedSrc] = useState<string | null>(null);

  useEffect(() => {
    try {
      const n = window.localStorage.getItem(NAME_KEY);
      const e = window.localStorage.getItem(EMAIL_KEY);
      if (n) setStudentName(n);
      if (e) setStudentEmail(e);
    } catch {}
  }, []);

  const name = studentName.trim();
  const email = studentEmail.trim();
  const identityOk = name.length > 0 && DEMO_EMAIL_RE.test(email);

  const start = async () => {
    if (starting || !identityOk) return;
    try {
      window.localStorage.setItem(NAME_KEY, name);
      window.localStorage.setItem(EMAIL_KEY, email);
    } catch {}
    setStarting(true);
    setStartError(false);
    try {
      const result = await startGatedDemo(name, email);
      if (!result.ok) {
        if (result.kind === 'limited') setLimited(result.reason);
        else setStartError(true);
        return;
      }
      // Host-independent path: works on tutor.* (middleware passes it
      // through) and on the bare app origin alike.
      setEmbedSrc(`/tutor-portal/embed?token=${encodeURIComponent(result.token)}`);
    } finally {
      setStarting(false);
    }
  };

  return (
    <div>
      {/* Engine description */}
      <div className="mb-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="mb-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <span className="font-medium text-slate-700">{engine.name}</span>
          <span>{engine.latency} response time</span>
          <span>·</span>
          <span>${engine.costPerMinute.toFixed(2)}/min</span>
        </div>
        <p className="text-sm text-slate-600">{engine.description}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {engine.features.slice(0, 5).map((f) => (
            <span key={f} className="rounded-full bg-white px-2.5 py-1 text-xs text-slate-600 shadow-sm">
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Tutor frame */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-400" />
            <div className="h-3 w-3 rounded-full bg-yellow-400" />
            <div className="h-3 w-3 rounded-full bg-green-400" />
          </div>
          <span className="text-xs text-slate-400">
            tutor.evelynlearning.com/embed
          </span>
          <div className="w-14" />
        </div>

        {embedSrc ? (
          <iframe
            src={embedSrc}
            width="100%"
            height="760"
            allow="microphone; camera; autoplay"
            className="border-0"
            title={`AI Voice Tutor — ${engine.name}`}
          />
        ) : limited ? (
          <div className="flex min-h-[420px] flex-col items-center justify-center gap-3 p-10 text-center">
            <p className="text-lg font-semibold text-slate-900">Free demo limit reached</p>
            <p className="max-w-md text-sm text-slate-600">
              {LIMIT_COPY[limited] || 'The free demo limit has been reached.'} To keep evaluating,
              request a sandbox — it comes with its own free minutes and your own signed keys.
            </p>
            <a
              href="/sandbox"
              className="mt-2 inline-block rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
            >
              Request Sandbox Access
            </a>
          </div>
        ) : (
          <div className="flex min-h-[420px] flex-col items-center justify-center gap-3 p-10 text-center">
            <p className="text-lg font-semibold text-slate-900">Start a live voice session</p>
            <p className="max-w-md text-sm text-slate-500">
              AP Computer Science Principles · Algorithms &amp; abstraction · 10-minute demo.
              Ask the tutor to switch topics any time.
            </p>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Your name"
              aria-label="Your name"
              required
              maxLength={40}
              className="w-full max-w-[280px] rounded-xl border border-slate-200 px-4 py-2.5 text-center text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              placeholder="you@example.com"
              aria-label="Your email"
              required
              maxLength={254}
              className="w-full max-w-[280px] rounded-xl border border-slate-200 px-4 py-2.5 text-center text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={start}
              disabled={starting || !identityOk}
              aria-busy={starting}
              className="mt-2 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {starting ? 'Starting…' : 'Start voice session'}
            </button>
            {startError && (
              <p className="text-xs text-rose-600" role="alert">
                Couldn&apos;t start the demo — please try again.
              </p>
            )}
            <p className="text-xs text-slate-400">
              Uses your microphone · voice + whiteboard · free demo, up to 3 sessions per email
            </p>
          </div>
        )}
      </div>

      {/* Embed code snippet */}
      <div className="mt-6">
        <p className="mb-2 text-sm font-medium text-slate-700">Integration code:</p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm text-green-400">
          <code>{`<iframe
  src="https://tutor.evelynlearning.com/embed?token=YOUR_JWT"
  width="100%" height="700"
  allow="microphone; camera"
  frameborder="0"
></iframe>`}</code>
        </pre>
      </div>
    </div>
  );
}
