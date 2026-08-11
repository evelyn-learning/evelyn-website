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
import { Mic, ChevronDown, ExternalLink, RotateCcw } from 'lucide-react';
import {
  CURATED_DEMO_LESSONS,
  type CuratedDemoLesson,
} from '@/lib/tutor/demo/curated-demo-lessons';
import {
  ACCENT_CARD_HINTS,
} from '@/lib/tutor/demo/teacher-display';
import {
  DEMO_TEACHERS,
  resolveInitialTeacherId,
  type TeacherPersonaWire,
} from '@/lib/tutor/ai/teacher-persona';
import { accentFromTimezone } from '@/lib/tutor/voice/geo-accent';
import { teachersForAccent } from '@/lib/tutor/voice/cartesia-voice-registry';
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

// Chip dot color for the curated defaults, keyed by planId (DemoLessonOption
// has no `tone` field). Non-default lessons fall back to a neutral blue dot.
const DEFAULT_TONE_DOT: Record<string, string> = Object.fromEntries(
  CURATED_DEMO_LESSONS.map((l) => [l.planId, TONE_DOT[l.tone]]),
);
const FALLBACK_TONE_DOT = 'bg-blue-500';

/**
 * Token contract: base64 JSON (legacy) or a signed HS256 JWT (learner-model
 * Phase C, Task 5) — either way decoded by parseToken/verifyEmbedToken in
 * tutor-portal/embed. Preferred path: POST the config to the engine's own
 * mint endpoint so the auth-bearing claims (`partner_id`, `student_id`,
 * `exp`) get server-forced and HMAC-signed — a browser can't hold the
 * partner secret to sign itself. That endpoint NEVER hard-fails the demo:
 * on any network/response error this falls back to the previous client-side
 * btoa encoding, so a mint outage degrades to "unsigned token" (same as
 * before Task 1 shipped) rather than a broken demo.
 */
async function buildEmbedToken(
  lesson: DemoLessonOption,
  teacher: TeacherPersonaWire,
  source: string,
  studentName?: string,
): Promise<string> {
  const cfg = {
    partner_id: 'evelyn-marketing',
    student_id: `demo-${Math.random().toString(36).slice(2, 10)}`,
    // R40: /tutor collects a name and the tutor greets with it — the demo now
    // does the same (optional; omitted → the opener stays name-less by design).
    ...(studentName ? { student_name: studentName } : {}),
    subject: lesson.subjectLabel.toLowerCase(),
    level: lesson.levelLabel,
    curriculum_module: lesson.planId,
    max_duration_minutes: 10,
    wrap_at_minutes: 8,
    input_mode: 'voice',
    target_kind: 'lessonNode',
    teacher,
    features: { voice_mode: true, text_mode: true, homework_upload: false },
    metadata: { source },
  };
  try {
    const res = await fetch('/api/tutor-portal/demo-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ config: cfg }),
    });
    if (!res.ok) throw new Error(`demo-token mint failed: ${res.status}`);
    const { token } = (await res.json()) as { token?: string };
    if (typeof token !== 'string' || !token) throw new Error('demo-token mint returned no token');
    return token;
  } catch {
    // UTF-8-safe btoa fallback (teacher intros contain no exotic chars
    // today, but the token must never break if one gains an em dash or
    // accent). Client-forced partner_id/student_id here are exactly what
    // the mint endpoint would have forced anyway — this is the same demo
    // identity, just unsigned.
    return btoa(unescape(encodeURIComponent(JSON.stringify(cfg))));
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
  const [lesson, setLesson] = useState<DemoLessonOption>(
    lessons[0] ?? { planId: '', title: '', subjectLabel: '', levelLabel: '', hook: '' },
  );
  const [teacherId, setTeacherId] = useState<string>(DEMO_TEACHERS[0].id);
  const [geoPairIds, setGeoPairIds] = useState<string[]>([]);
  const [teacherOpen, setTeacherOpen] = useState(false);
  const [embedSrc, setEmbedSrc] = useState<string | null>(null);
  // R40: optional student name, greeted by the tutor (parity with /tutor).
  // Persisted so a returning visitor doesn't retype it.
  const [studentName, setStudentName] = useState('');
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
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [lesson.planId]);

  // Teacher restore + geo pre-select — same semantics as /tutor (stored
  // choice wins; first visit picks from the local accent pair and persists).
  useEffect(() => {
    try {
      const storedName = window.localStorage.getItem('evelyn:demo:studentName');
      if (storedName) setStudentName(storedName);
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
    setLesson(l);
    trackEvent('lesson_selected', { plan_id: l.planId, surface });
  };

  const pickTeacher = (id: string) => {
    setTeacherId(id);
    try {
      window.localStorage.setItem(TEACHER_STORE_KEY, id);
    } catch {}
    setTeacherOpen(false);
    trackEvent('teacher_changed', { teacher_id: id, surface });
  };

  const start = async () => {
    if (starting) return;
    trackEvent('demo_start_click', { plan_id: lesson.planId, teacher_id: teacher.id });
    const name = studentName.trim();
    try {
      if (name) window.localStorage.setItem('evelyn:demo:studentName', name);
    } catch {}
    setStarting(true);
    try {
      const token = await buildEmbedToken(lesson, teacher, source, name || undefined);
      setSessionEnded(false);
      setEmbedSrc(`/tutor-portal/embed?token=${encodeURIComponent(token)}`);
    } finally {
      setStarting(false);
    }
  };

  const teacherHint = ACCENT_CARD_HINTS[teacher.id]
    ?? (geoPairIds.includes(teacher.id) ? 'Picked for your region' : 'House favorite');

  if (embedSrc) {
    return (
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <p className="text-sm text-slate-600">
            <span className="font-semibold text-slate-900">{lesson.title}</span> with {teacher.name} — 10-minute demo
          </p>
          {sessionEnded && (
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

  return (
    <div>
      {/* Lesson chips */}
      <div className="flex flex-wrap justify-center gap-2 mb-5">
        {lessons.map((l) => {
          const selected = l.planId === lesson.planId;
          return (
            <button
              key={l.planId}
              type="button"
              onClick={() => pickLesson(l)}
              aria-pressed={selected}
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                selected
                  ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${DEFAULT_TONE_DOT[l.planId] ?? FALLBACK_TONE_DOT}`} aria-hidden />
              {l.title}
              <span className="hidden sm:inline text-xs text-slate-400 font-normal">· {l.subjectLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Cover card */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden">
        <div className="grid md:grid-cols-[1.2fr_1fr]">
          {/* Start side */}
          <div className="p-8 md:p-10 flex flex-col items-center justify-center text-center gap-3 md:border-r border-b md:border-b-0 border-slate-100">
            <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center">
              <Mic className="w-6 h-6" />
            </div>
            <p className="font-bold text-lg text-slate-900">Start live demo — {lesson.title}</p>
            <p className="text-sm text-slate-500">
              {lesson.subjectLabel} · {lesson.levelLabel} · {lesson.hook}
            </p>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Your name (optional)"
              aria-label="Your name (optional)"
              maxLength={40}
              className="w-full max-w-[260px] px-4 py-2.5 text-sm text-center border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <button
              type="button"
              onClick={start}
              disabled={starting}
              aria-busy={starting}
              className="mt-2 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-wait"
            >
              <Mic className="w-4 h-4" />
              {starting ? 'Starting…' : 'Start voice session'}
            </button>
            <p className="text-xs text-slate-400">
              Uses your microphone · voice + whiteboard · 10-minute demo · no signup
            </p>
          </div>

          {/* Teacher side */}
          <div className="p-6 md:p-8" ref={teacherPanelRef}>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-3">Your tutor</p>
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center font-semibold">
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
                className="ml-auto inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:border-blue-300"
              >
                Change
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${teacherOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {teacherOpen && (
              <div
                role="radiogroup"
                aria-label="Choose your tutor"
                className="mt-3 max-h-56 overflow-y-auto rounded-xl border border-slate-200 divide-y divide-slate-100"
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
                    <span className="shrink-0 text-xs text-slate-400">
                      {ACCENT_CARD_HINTS[t.id] ?? ''}
                    </span>
                  </button>
                ))}
              </div>
            )}

            <p className="mt-3 text-xs text-slate-400">
              {DEMO_TEACHERS.length} tutors · native accents — matched to where you are
            </p>

            <div className="mt-5 pt-4 border-t border-dashed border-slate-200">
              <Link
                href="/tutor"
                onClick={() => trackEvent('demo_expand_fullscreen', { plan_id: lesson.planId })}
                className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Or open the full-screen tutor
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
