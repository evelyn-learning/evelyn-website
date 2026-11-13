'use client';

/**
 * Live tutor demo for /products/voice-tutor#demo — the REAL tutor in an
 * iframe on the existing /tutor-portal/embed surface, behind a
 * click-to-start cover (no engine cost until a human commits; mic
 * permission needs the gesture anyway). Replaced the mocked
 * VoiceTutorPreview loop 2026-08-02 (demo-funnel plan, Option A).
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Check, Mic, ChevronDown, ExternalLink, RotateCcw } from 'lucide-react';
import {
  CURATED_DEMO_LESSONS,
  type CuratedDemoLesson,
} from '@core/demo/curated-demo-lessons';
import {
  ACCENT_CARD_HINTS,
} from '@core/demo/teacher-display';
import {
  DEMO_TEACHERS,
  resolveInitialTeacherId,
  type TeacherPersonaWire,
} from '@core/ai/teacher-persona';
import { accentFromTimezone } from '@core/voice/geo-accent';
import { teachersForAccent } from '@core/voice/cartesia-voice-registry';
import { trackEvent } from '@/lib/analytics/events';

// Same key as /tutor so a choice made here carries into the full app.
const TEACHER_STORE_KEY = 'evelyn:tutor:selectedTeacher';

const TONE_DOT: Record<CuratedDemoLesson['tone'], string> = {
  indigo: 'bg-indigo-500',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
};

/**
 * Public lesson-chip shape for this component. `CuratedDemoLesson` (which
 * also carries a `tone` used only for the default chip dot color) is mapped
 * down into this shape for the default lesson list below — callers passing
 * their own `lessons` (e.g. /solutions/[segment]) only need these five
 * fields.
 */
export interface DemoLessonOption {
  planId: string;
  title: string;
  subjectLabel: string;
  levelLabel: string;
  hook: string;
}

const DEFAULT_LESSONS: DemoLessonOption[] = CURATED_DEMO_LESSONS.map(
  ({ planId, title, subjectLabel, levelLabel, hook }) => ({ planId, title, subjectLabel, levelLabel, hook }),
);

const DEFAULT_SOURCE = 'products-voice-tutor-demo';

/** Length of the free session (Praveen 2026-11-12: 20 → 30). */
const DEMO_MINUTES = 30;

/** Topics offered as one-tap examples under the "anything" field: one per subject, so the range is plain. */
const EXAMPLE_TOPICS = ['Adding fractions', 'Photosynthesis', 'The French Revolution', 'Python loops', 'Writing a thesis statement'];
const TYPED_LEVELS = ['Elementary', 'Middle school', 'High school', 'College'];

/** The subject a typed topic falls under, for the tutor's subject label. Rough on purpose: the tutor is told
 *  the topic itself, and the label only chooses its defaults. */
export function subjectOfTopic(topic: string): string {
  const t = topic.toLowerCase();
  if (/fraction|algebra|geometr|calculus|equation|trig|decimal|percent|multipl|divis|math|statistic|probab|graph|integral|derivative|logarithm|number/.test(t)) return 'Math';
  if (/python|javascript|java\b|coding|program|algorithm|loop|recursion|html|css|sql|computer/.test(t)) return 'Computer Science';
  if (/essay|thesis|grammar|writing|poem|poetry|novel|shakespeare|reading|vocabulary|literature|paragraph|verb|noun/.test(t)) return 'English';
  if (/history|revolution|war\b|empire|government|constitution|econom|geograph|civil|ancient|democracy|supply and demand/.test(t)) return 'Social Studies';
  if (/photosynth|cell|atom|molecul|chemi|physic|biolog|force|energy|gravity|electric|genetic|planet|ecosystem|reaction|science|motion|dna|evolution/.test(t)) return 'Science';
  return 'General';
}

// Chip dot color for the curated defaults, keyed by planId (DemoLessonOption
// has no `tone` field). Non-default lessons fall back to a neutral blue dot.
const DEFAULT_TONE_DOT: Record<string, string> = Object.fromEntries(
  CURATED_DEMO_LESSONS.map((l) => [l.planId, TONE_DOT[l.tone]]),
);
const FALLBACK_TONE_DOT = 'bg-blue-500';

// Demo gate (2026-08-29): same dotted-domain regex the engine's gate
// enforces server-side — stricter than HTML5's, which accepts `user@gmail`.
const DEMO_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type DemoStartResult =
  | { ok: true; token: string }
  | { ok: false; kind: 'limited'; reason: string }
  | { ok: false; kind: 'error' };

/** Read-only quota check (2026-08-30). Fails open — a fetch error just means
 *  no proactive messaging; demo-start remains the enforcement point. */
async function refreshDemoStatus(set: (v: boolean) => void): Promise<void> {
  try {
    const res = await fetch('/api/tutor/demo-status');
    if (!res.ok) return;
    const d = (await res.json()) as { exhausted?: boolean };
    set(d.exhausted === true);
  } catch {}
}

/** The end-of-demos continuation choice — the two live implementations of the
 *  tutor engine, picked by how the visitor wants to learn. Factual copy only
 *  (cross-promotion guardrail). */
function ContinueChoicePanel({ onTrack }: { onTrack: (site: string) => void }) {
  return (
    <div className="rounded-2xl border-2 border-blue-200 bg-white p-6 mb-4">
      <p className="font-bold text-lg text-slate-900 text-center mb-1">That was your last free demo — keep going</p>
      <p className="text-sm text-slate-600 text-center mb-5">
        The same tutor engine runs in two live products. Pick the one that fits how you want to learn.
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        <a
          href="https://www.evelyntutor.com"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onTrack('evelyntutor')}
          className="group rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition p-5 flex flex-col"
        >
          <span className="font-semibold text-slate-900 group-hover:text-blue-600">Evelyn Tutor</span>
          <span className="text-sm text-slate-600 mt-1 flex-1">
            1-on-1 voice tutoring on any topic you bring — your progress carries between sessions.
          </span>
          <span className="text-sm font-medium text-blue-600 mt-3">Continue on evelyntutor.com →</span>
        </a>
        <a
          href="https://www.crimsora.com"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onTrack('crimsora')}
          className="group rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition p-5 flex flex-col"
        >
          <span className="font-semibold text-slate-900 group-hover:text-blue-600">Crimsora</span>
          <span className="text-sm text-slate-600 mt-1 flex-1">
            Full structured courses — lesson plans, practice, and the tutor teaching every lesson.
          </span>
          <span className="text-sm font-medium text-blue-600 mt-3">Explore crimsora.com →</span>
        </a>
      </div>
      <p className="text-xs text-slate-400 mt-4 text-center">
        Building something of your own?{' '}
        <Link href="/contact?product=voice-tutor" className="underline">Talk to us</Link> about the tutor engine.
      </p>
    </div>
  );
}

/**
 * Token contract: a signed HS256 JWT minted by the engine's gated
 * /api/tutor/demo-start (demo-abuse restrictions, 2026-08-29 — replaces the
 * ungated /api/tutor-portal/demo-token call + client-side btoa fallback,
 * which together let anyone run unlimited demo sessions; one demo student
 * ran 16 from a single IP through this widget). The gate takes the now-
 * MANDATORY name + email, enforces per-email/IP/device/day quotas, and sets
 * the demo-grant cookie the engine's costly routes require — same-origin
 * here (nginx routes /api/tutor/* to the engine), so the cookie rides into
 * the iframe's fetches automatically. A 429 is a real "you've used your free
 * demos" answer and must surface as one, not silently degrade; the old
 * unsigned-btoa fallback is gone because gated routes reject it anyway.
 */
async function startGatedDemo(
  lesson: DemoLessonOption,
  teacher: TeacherPersonaWire,
  source: string,
  studentName: string,
  studentEmail: string,
): Promise<DemoStartResult> {
  // A ready lesson names its plan; a topic the visitor typed has none, and the tutor teaches it from the topic.
  const cfg = {
    subject: lesson.subjectLabel.toLowerCase(),
    level: lesson.levelLabel,
    ...(lesson.planId ? { curriculum_module: lesson.planId } : { topic: lesson.title }),
    max_duration_minutes: DEMO_MINUTES,
    wrap_at_minutes: DEMO_MINUTES - 2,
    input_mode: 'voice',
    target_kind: lesson.planId ? 'lessonNode' : 'freestyle',
    // 2026-09-10: the demo is a showcase, not an enrolled lesson — let the
    // visitor take it anywhere (engine honors propose_plan_swap across
    // subjects and drops the Rule 7(b) "this session is scoped to…" reply).
    open_scope: true,
    teacher,
    features: { voice_mode: true, text_mode: true, homework_upload: false },
    metadata: { source },
  };
  try {
    const res = await fetch('/api/tutor/demo-start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: studentName, email: studentEmail, config: cfg }),
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

export interface VoiceTutorLiveDemoProps {
  /** Lesson chips to offer. Defaults to the curated flagship spread. */
  lessons?: DemoLessonOption[];
  /** Embed token `metadata.source`, for funnel attribution. */
  source?: string;
}

export default function VoiceTutorLiveDemo({
  lessons = DEFAULT_LESSONS,
  source = DEFAULT_SOURCE,
}: VoiceTutorLiveDemoProps = {}) {
  // GA4 `surface` dimension: preserve the exact historical value on the
  // default (product-page) path, and attribute everyone else (e.g. the
  // /solutions/[segment] pages) by their own `source` instead of lumping
  // them all under 'product_embed'.
  const surface = source === DEFAULT_SOURCE ? 'product_embed' : source;

  // `lessons[0]` may be undefined if a caller passes `lessons={[]}` — fall
  // back to an inert placeholder so the hooks below never dereference
  // undefined. The real guard (render nothing) comes after all hooks run,
  // per the Rules of Hooks — see the `if (lessons.length === 0)` below.
  // Nothing is chosen for the visitor. The first lesson used to be selected already, and people who wanted
  // something else started it anyway (Praveen 2026-11-12).
  const [picked, setPicked] = useState<DemoLessonOption | null>(null);
  const [typedTopic, setTypedTopic] = useState('');
  const [typedLevel, setTypedLevel] = useState('High school');
  const typed = typedTopic.trim().replace(/\s+/g, ' ');
  const lesson: DemoLessonOption = useMemo(
    () => (typed.length >= 3
      ? { planId: '', title: typed.charAt(0).toUpperCase() + typed.slice(1), subjectLabel: subjectOfTopic(typed), levelLabel: typedLevel, hook: '' }
      : picked ?? { planId: '', title: '', subjectLabel: '', levelLabel: '', hook: '' }),
    [typed, typedLevel, picked],
  );
  const hasTopic = lesson.title.length > 0;
  const [teacherId, setTeacherId] = useState<string>(DEMO_TEACHERS[0].id);
  const [geoPairIds, setGeoPairIds] = useState<string[]>([]);
  const [teacherOpen, setTeacherOpen] = useState(false);
  const [embedSrc, setEmbedSrc] = useState<string | null>(null);
  // Demo gate (2026-08-29): name + email are now MANDATORY (parity with
  // /tutor, where the tutor greets by name). Persisted so a returning
  // visitor doesn't retype them — same keys as /tutor.
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  // Quota hit (429 from demo-start) → render the limit card instead of the
  // start cover. startError is the transient "something went wrong" case.
  const [limited, setLimited] = useState<string | null>(null);
  const [startError, setStartError] = useState(false);
  // 2026-08-30: read-only quota status. Checked on mount (show the limit
  // card BEFORE a doomed form-fill) and when a session ends (offer the
  // evelyntutor/crimsora continuation choice after the LAST free demo).
  const [demoExhausted, setDemoExhausted] = useState(false);
  // R39: set when the embed reports its session ended — surfaces the
  // "Choose another lesson" affordance now that the header links are gone.
  const [sessionEnded, setSessionEnded] = useState(false);
  // Task 5: buildEmbedToken now awaits a mint fetch — guard against a
  // double-click firing two concurrent embed sessions during that round trip.
  const [starting, setStarting] = useState(false);
  const teacherPanelRef = useRef<HTMLDivElement>(null);

  // R39: the header's "Change lesson" / "Open full screen" links are removed
  // ("Open full screen" read as a whiteboard-fullscreen control but navigated
  // to the /tutor lobby; "Change lesson" duplicated End/Pause). The way back
  // to the picker is now event-driven: the embed posts evelyn:session_ended
  // when the session finishes, and we offer the picker then — the embed's own
  // end-of-session summary stays visible until the student chooses.
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if ((e.data as { type?: string } | null)?.type === 'evelyn:session_ended') {
        setSessionEnded(true);
        trackEvent('demo_session_ended', { plan_id: lesson.planId, surface });
        // Ended session may have been the visitor's last free demo — refresh
        // quota status so the continuation choice can render (2026-08-30).
        void refreshDemoStatus(setDemoExhausted);
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [lesson.planId]);

  // Proactive limit messaging (2026-08-30): a visitor whose demos are already
  // used sees the limit card immediately, not after filling the form.
  useEffect(() => {
    void refreshDemoStatus(setDemoExhausted);
  }, []);

  // Teacher restore + geo pre-select — same semantics as /tutor (stored
  // choice wins; first visit picks from the local accent pair and persists).
  useEffect(() => {
    // The name and email are typed each time (Praveen 2026-11-12): they used to be kept in the browser and
    // filled in again, so the form looked already completed with whatever was typed last. What an earlier
    // version kept is cleared.
    try {
      window.localStorage.removeItem('evelyn:demo:studentName');
      window.localStorage.removeItem('evelyn:demo:studentEmail');
    } catch {}
    try {
      const raw = window.localStorage.getItem(TEACHER_STORE_KEY);
      const accent = accentFromTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
      const pair = accent ? teachersForAccent(accent) : {};
      setGeoPairIds([pair.female, pair.male].filter((id): id is string => !!id));
      if (raw !== null) {
        setTeacherId(resolveInitialTeacherId(raw));
        return;
      }
      const pick = Math.random() < 0.5 ? (pair.female ?? pair.male) : (pair.male ?? pair.female);
      if (pick) {
        setTeacherId(pick);
        window.localStorage.setItem(TEACHER_STORE_KEY, pick);
      }
    } catch {}
  }, []);

  // Light-dismiss for the teacher popover.
  useEffect(() => {
    if (!teacherOpen) return;
    const onDown = (e: PointerEvent) => {
      if (!teacherPanelRef.current?.contains(e.target as Node)) setTeacherOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setTeacherOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [teacherOpen]);

  const teacher = useMemo(
    () => DEMO_TEACHERS.find((t) => t.id === teacherId) ?? DEMO_TEACHERS[0],
    [teacherId],
  );
  const orderedTeachers = useMemo(() => {
    if (!geoPairIds.length) return DEMO_TEACHERS;
    const pair = geoPairIds
      .map((id) => DEMO_TEACHERS.find((t) => t.id === id))
      .filter((t): t is TeacherPersonaWire => !!t);
    return [...pair, ...DEMO_TEACHERS.filter((t) => !geoPairIds.includes(t.id))];
  }, [geoPairIds]);

  // Must come after every hook above (Rules of Hooks) — `lessons={[]}`
  // typechecks but leaves nothing to demo, so render nothing rather than
  // crash on the placeholder lesson's empty planId.
  if (lessons.length === 0) return null;

  const pickLesson = (l: DemoLessonOption) => {
    setPicked(l);
    setTypedTopic('');
    trackEvent('lesson_selected', { plan_id: l.planId, surface });
  };
  const typeTopic = (value: string) => {
    setTypedTopic(value.slice(0, 80));
    if (value.trim().length >= 3) setPicked(null);
  };

  const pickTeacher = (id: string) => {
    setTeacherId(id);
    try {
      window.localStorage.setItem(TEACHER_STORE_KEY, id);
    } catch {}
    setTeacherOpen(false);
    trackEvent('teacher_changed', { teacher_id: id, surface });
  };

  const name = studentName.trim();
  const email = studentEmail.trim();
  const identityOk = name.length > 0 && DEMO_EMAIL_RE.test(email);

  const start = async () => {
    if (starting || !identityOk || !hasTopic) return;
    trackEvent('demo_start_click', { plan_id: lesson.planId || 'typed_topic', teacher_id: teacher.id });
    setStarting(true);
    setStartError(false);
    try {
      const result = await startGatedDemo(lesson, teacher, source, name, email);
      if (!result.ok) {
        if (result.kind === 'limited') {
          setLimited(result.reason);
          trackEvent('demo_limited', { plan_id: lesson.planId, surface, reason: result.reason });
        } else {
          setStartError(true);
        }
        return;
      }
      setSessionEnded(false);
      setEmbedSrc(`/tutor-portal/embed?token=${encodeURIComponent(result.token)}`);
    } finally {
      setStarting(false);
    }
  };

  const teacherHint = ACCENT_CARD_HINTS[teacher.id]
    ?? (geoPairIds.includes(teacher.id) ? 'Picked for your region' : 'House favorite');

  if (embedSrc) {
    return (
      <div>
        {/* 2026-08-30: that session was the visitor's LAST free demo — offer
            the continuation choice right here, above the embed's own
            end-of-session summary (which stays visible below). */}
        {sessionEnded && demoExhausted && (
          <ContinueChoicePanel
            onTrack={(site) => trackEvent('demo_limited', { plan_id: lesson.planId, surface, reason: `continue_${site}` })}
          />
        )}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <p className="text-sm text-slate-600">
            <span className="font-semibold text-slate-900">{lesson.title}</span> with {teacher.name}, free {DEMO_MINUTES}-minute session
          </p>
          {sessionEnded && !demoExhausted && (
            <button
              type="button"
              onClick={() => {
                setEmbedSrc(null);
                setSessionEnded(false);
                trackEvent('demo_change_lesson_after_end', { plan_id: lesson.planId, surface });
              }}
              className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Choose another lesson
            </button>
          )}
        </div>
        <iframe
          src={embedSrc}
          allow="microphone"
          title="Evelyn AI Voice Tutor — live demo"
          className="w-full h-[70vh] min-h-[480px] max-h-[720px] rounded-2xl border border-slate-200 shadow-lg bg-white"
        />
      </div>
    );
  }

  if (limited) {
    return (
      <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-8 md:p-10 text-center">
        <p className="font-bold text-lg text-slate-900">
          {limited === 'email_limit'
            ? "You've used all the free demos for this email"
            : limited === 'demo_busy'
              ? 'The demo is at capacity today'
              : "You've reached the demo limit for today"}
        </p>
        <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
          Want to keep going? The same tutor engine runs in production at{' '}
          <a href="https://www.evelyntutor.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium">evelyntutor.com</a>{' '}
          and{' '}
          <a href="https://www.crimsora.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium">crimsora.com</a>{' '}
          — try it there, or talk to us about your own use case.
        </p>
        <Link
          href="/contact?product=voice-tutor"
          className="mt-5 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
        >
          Contact us
        </Link>
      </div>
    );
  }

  // 2026-08-30: demos already used up (checked on mount) — the picker would
  // only lead to a 429, so the continuation choice IS the demo surface now.
  if (demoExhausted) {
    return (
      <ContinueChoicePanel
        onTrack={(site) => trackEvent('demo_limited', { plan_id: lesson.planId, surface, reason: `continue_${site}` })}
      />
    );
  }

  const missing = !hasTopic ? 'Choose what to learn first' : !name ? 'Add your name' : !DEMO_EMAIL_RE.test(email) ? 'Add your email' : '';
  const inputClass = 'w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none';

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden text-left">
      {/* 1. What to learn: anything typed, or a ready lesson. */}
      <div className="p-6 md:p-8">
        <label htmlFor="demo-topic" className="block text-xl md:text-2xl font-bold text-slate-900">
          What do you want to learn?
        </label>
        <p className="mt-1 text-sm text-slate-600">
          Type any topic from any subject, or pick one of the ready lessons below. You can change topic at any point by asking the tutor.
        </p>
        <input
          id="demo-topic"
          type="text"
          value={typedTopic}
          onChange={(e) => typeTopic(e.target.value)}
          placeholder="For example: long division, the water cycle, the causes of World War I"
          maxLength={80}
          autoComplete="off"
          className="mt-4 w-full px-5 py-4 text-base md:text-lg border-2 border-slate-300 rounded-2xl bg-white placeholder:text-slate-400 focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none"
        />
        {typed.length >= 3 ? (
          <div className="mt-3 flex flex-wrap items-center gap-2" role="radiogroup" aria-label="Your level">
            <span className="text-sm text-slate-600 mr-1">Your level</span>
            {TYPED_LEVELS.map((lv) => (
              <button
                key={lv}
                type="button"
                role="radio"
                aria-checked={typedLevel === lv}
                onClick={() => setTypedLevel(lv)}
                className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                  typedLevel === lv ? 'border-blue-600 bg-blue-600 text-white font-semibold' : 'border-slate-300 bg-white text-slate-700 hover:border-blue-400'
                }`}
              >
                {lv}
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-sm text-slate-500 mr-1">Try</span>
            {EXAMPLE_TOPICS.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => { typeTopic(ex); trackEvent('lesson_selected', { plan_id: 'example_topic', surface }); }}
                className="rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700"
              >
                {ex}
              </button>
            ))}
          </div>
        )}

        <p className="mt-7 text-sm font-semibold text-slate-900">Ready lessons</p>
        <div className="mt-3 grid grid-cols-2 lg:grid-cols-4 gap-2.5" role="radiogroup" aria-label="Ready lessons">
          {lessons.map((l) => {
            const selected = typed.length < 3 && picked?.planId === l.planId;
            return (
              <button
                key={l.planId}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => pickLesson(l)}
                className={`relative min-w-0 rounded-xl border-2 px-3 sm:px-4 py-3 text-left transition-colors ${
                  selected ? 'border-blue-600 bg-blue-50' : 'border-slate-200 bg-white hover:border-blue-300'
                }`}
              >
                <span className="flex items-center gap-2 text-xs text-slate-500">
                  <span className={`w-2 h-2 rounded-full ${DEFAULT_TONE_DOT[l.planId] ?? FALLBACK_TONE_DOT}`} aria-hidden />
                  {l.subjectLabel}, {l.levelLabel.toLowerCase() === 'ap' ? 'AP' : l.levelLabel.toLowerCase()}
                </span>
                <span className={`mt-1 block font-semibold ${selected ? 'text-blue-800' : 'text-slate-900'}`}>{l.title}</span>
                <span className="mt-0.5 hidden sm:block text-xs text-slate-500">{l.hook}</span>
                {selected && <Check className="absolute top-3 right-3 w-4 h-4 text-blue-600" aria-hidden />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Who teaches, and 3. start. */}
      <div className="border-t border-slate-200 bg-slate-50 p-6 md:p-8 grid grid-cols-1 gap-6 md:grid-cols-[1fr_1.15fr]">
        <div ref={teacherPanelRef} className="min-w-0">
          <p className="text-sm font-semibold text-slate-900">Your tutor</p>
          <div className="mt-3 flex items-center gap-3">
            <span className="w-10 h-10 shrink-0 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
              {teacher.name.replace(/^(Ms\.|Mr\.|Dr\.)\s*/, '').charAt(0)}
            </span>
            <span className="min-w-0">
              <span className="block font-semibold text-slate-900 truncate">{teacher.name}</span>
              <span className="block text-xs text-slate-500">{teacherHint}</span>
            </span>
            <button
              type="button"
              onClick={() => setTeacherOpen((v) => !v)}
              aria-expanded={teacherOpen}
              className="ml-auto inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:border-blue-400"
            >
              Change
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${teacherOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
          {teacherOpen && (
            <div
              role="radiogroup"
              aria-label="Choose your tutor"
              className="mt-3 max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white divide-y divide-slate-100"
            >
              {orderedTeachers.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="radio"
                  aria-checked={t.id === teacherId}
                  onClick={() => pickTeacher(t.id)}
                  className={`w-full text-left px-3.5 py-2.5 text-sm flex items-center justify-between gap-2 hover:bg-blue-50 ${
                    t.id === teacherId ? 'bg-blue-50 font-semibold text-blue-700' : 'text-slate-800'
                  }`}
                >
                  <span className="truncate">{t.name}</span>
                  <span className="shrink-0 text-xs text-slate-400">{ACCENT_CARD_HINTS[t.id] ?? ''}</span>
                </button>
              ))}
            </div>
          )}
          <p className="mt-3 text-xs text-slate-500">
            {DEMO_TEACHERS.length} tutors with native accents, matched to where you are.
          </p>
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900">Start your free {DEMO_MINUTES}-minute session</p>
          <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Your name"
              aria-label="Your name"
              required
              maxLength={40}
              className={inputClass}
            />
            <input
              type="email"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              placeholder="you@example.com"
              aria-label="Your email"
              required
              maxLength={254}
              className={inputClass}
            />
          </div>
          <button
            type="button"
            onClick={start}
            disabled={starting || !identityOk || !hasTopic}
            aria-busy={starting}
            className="mt-3 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            <Mic className="w-4 h-4 shrink-0" />
            <span className="truncate">
              {starting ? 'Starting…' : hasTopic ? `Start: ${lesson.title} with ${teacher.name}` : 'Start voice session'}
            </span>
          </button>
          {startError ? (
            <p className="mt-2 text-xs text-rose-600" role="alert">
              The session did not start. Check your connection and press Start again.
            </p>
          ) : (
            <p className="mt-2 text-xs text-slate-500" aria-live="polite">
              {missing ? `${missing}. ` : ''}You talk, the tutor talks back and writes on a whiteboard. Uses your microphone.
            </p>
          )}
          <Link
            href="/tutor"
            onClick={() => trackEvent('demo_expand_fullscreen', { plan_id: lesson.planId || 'typed_topic' })}
            className="mt-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Or open the full-screen tutor
          </Link>
        </div>
      </div>
    </div>
  );
}
