'use client';

/**
 * Embeddable Voice Tutor — lives inside partner iframes.
 *
 * Reads session config from a JWT token query param.
 * Skips setup/summary — goes straight to the tutoring session.
 * Applies partner branding (colors, logo, product name).
 *
 * Engine: all embeds run on claude-brain. The legacy `engine` token
 * field (standard / premium) is accepted for backwards compatibility
 * but does not change routing — every session goes through the brain
 * orchestrator with realtime voice.
 */

import { useState, useCallback, useRef, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { buildDisplayName } from '@/lib/tutor/topic-taxonomy';
import TutorSession from '@/app/tutor/components/session/TutorSession';
import { type TutorMilestone, type TutorResumeState, type RealtimeHandle } from '@/app/tutor/components/VoiceTutorRealtime';
import type { SessionResult, LessonProgress, SocialThread, ProgressDigest } from '@evelyn/portal-contract/v1';
import type { LessonPlan } from '@/lib/tutor/lesson-plan/types';
import { buildLessonProgress } from '@/lib/tutor/portal/lesson-progress';
import { resolveResumeOutcome } from '@/lib/tutor/portal/resume';
import { acceptWhiteboardBatch, createSeedGuard } from '@/lib/tutor/whiteboard/resume-seed';
import { isPedagogyOpenerFlagValue } from '@/lib/tutor/ai/opening-behavior';
import type { TeacherPersonaWire } from '@/lib/tutor/ai/teacher-persona';

// Opener-recency / extraction-carrier gate (mirrors the same flag read in
// VoiceTutorRealtime.tsx and page.tsx — one env var, read per module).
const TUTOR_PEDAGOGY_OPENER_EMBED = isPedagogyOpenerFlagValue(process.env.NEXT_PUBLIC_TUTOR_PEDAGOGY_OPENER);

// Debug-event types persisted for embed sessions (prefix match). Measurement
// events only — keep this list short; every entry lands in Mongo for every
// real student session. turn_latency: Phase-0 humanlike-latency baseline;
// ack_/tts_ws_/render_dropped/rule8: later phases of the same plan.
// Round 29: the original measurement-only allowlist made portal incidents
// undiagnosable — a session where the student's reply never transcribed
// (portal-ed8acbfd, 2026-07-24) persisted just 2 events, with every
// perception/reliability breadcrumb dropped. The reliability families are
// one short line per utterance, so real-student volume stays modest.
const EMBED_DEBUG_EVENT_PREFIXES = [
  'turn_latency', 'ack_', 'tts_ws_', 'render_dropped', 'rule8',
  'perception_', 'ink_', 'error', 'MicSilentWarning', 'mic_',
  'brain_watchdog', 'dispatch_', 'production_ws_', 'session_mint',
  'try_alone',
  // Round-6e: the round-6b AEC/route diagnostics never persisted for portal
  // sessions — this whitelist silently ate them, so the app-switch reverb
  // investigation ran blind. stage3_ covers the timeout-resume recovery.
  'playback_route', 'shared_mic', 'stage3_', 'voice_mute', 'noise_nag',
];

/** The contract's milestone enum (derived from SessionResult — the package
 *  exports the type via this field rather than a standalone alias). */
type SessionMilestone = SessionResult['milestone'];

/** Ranking so the embed reports the FURTHEST milestone reached. Keyed by the
 *  contract enum — assigning a TutorMilestone here proves it maps to a valid
 *  SessionMilestone at compile time. */
const MILESTONE_RANK: Record<SessionMilestone, number> = {
  none: 0,
  first_concept_complete: 1,
  first_try_yourself_success: 2,
  recap_reached: 3,
};
import type { SessionGoal, TranscriptEntry } from '@/lib/tutor/types';
import type { MockReviewContext } from '@/lib/tutor/mock-exam/review-focus';
import type { WhiteboardCommand } from '@/lib/knowledge/types';
import type { OpenAIVoice } from '@/app/tutor/hooks/useOpenAIRealtime';

type InputMode = 'text' | 'voice';
type InternalEngine = 'claude-brain';

interface EmbedConfig {
  partner_id: string;
  student_id: string;
  student_name?: string;
  subject: string;
  topic?: string;
  level: string;
  session_goal?: SessionGoal;
  engine?: 'standard' | 'premium';
  locale?: string;
  input_mode?: InputMode;
  voice?: string;
  curriculum_module?: string;
  max_duration_minutes?: number;
  /** Demo time-box (P3): the graceful-wrap threshold in minutes. The portal
   *  sets it (alongside an explicit max_duration_minutes) ONLY for the
   *  anonymous timed homepage demo. Clamped to [1, max_duration_minutes - 1],
   *  default max_duration_minutes - 2. Absent for every non-demo session ⇒ no
   *  wrap phase. */
  wrap_at_minutes?: number;
  /** Stable session id minted by the portal (= Session.engineSessionId,
   *  "portal-<uuid>"). When present the engine keys its TutorSession on THIS
   *  instead of minting "embed-<Date.now()>" — unifies the two ids (E4). */
  session_id?: string;
  /** Continue an existing session rather than start fresh (E3). When true AND
   *  the session has a checkpoint within RESUME_MAX_AGE_MS, the engine
   *  rehydrates position + transcript + whiteboard and continues without
   *  auto-opening the mic. Otherwise starts fresh on the same lesson. */
  resume?: boolean;
  /** Task D1b — TRANSIENT session-scoped context from the portal's
   *  StudentContext. Read for THIS session only, never persisted engine-side.
   *  The academy resolves parental opt-out / trial to an absent/empty
   *  social_memory before minting the token. */
  social_memory?: SocialThread[];
  progress_digest?: ProgressDigest;
  /** Opener-recency (part A) — the PREVIOUS session's opener record (kind +
   *  a short content digest, ≤200 chars rendered). Same transient carrier
   *  semantics as social_memory: read for THIS session only, never
   *  persisted engine-side. The portal derives it from the prior session's
   *  captured opener record (outbound loop = part B, not built yet). */
  last_opener?: { kind: string; digest: string };
  /** Task E1 (pedagogy) — the academy's trial-flow marker. When true the
   *  engine resolves the demo-trial journey (opening behavior) and the
   *  brain receives the milestone-mode `<demo_stop>` directive (win boxed
   *  to completing the first concept) instead of the time-budget one.
   *  The academy's trial embed must set is_trial=true when minting the
   *  token; absent/false = not a trial. Only consumed when
   *  NEXT_PUBLIC_TUTOR_PEDAGOGY_OPENER is on. */
  is_trial?: boolean;
  /** Explicit session-target kind for the opening behavior. 'diagnostic'
   *  makes the opener/calibration no-op AND keeps the completion-gate/
   *  demo-stop machinery off the session — the academy's diagnostic
   *  (assessment) embeds should send it when minting the token. Absent =
   *  derived from curriculum_module presence (lessonNode vs freestyle),
   *  exactly as before. Only consumed when
   *  NEXT_PUBLIC_TUTOR_PEDAGOGY_OPENER is on. */
  target_kind?: 'lessonNode' | 'freestyle' | 'diagnostic';
  /** Teacher persona — the academy sends it for enrolled sessions so the
   *  engine teaches AS that specific teacher (name/intro/style/voice +
   *  identity bounds). Wire shape shared verbatim with the academy — see
   *  src/lib/tutor/ai/teacher-persona.ts. Passed through to the runtime;
   *  only consumed when NEXT_PUBLIC_TUTOR_PEDAGOGY_OPENER is on. */
  teacher?: TeacherPersonaWire;
  /** Prerequisite-readiness summary from the course-start diagnostic (prose),
   *  e.g. "the student scored 62% … Shakier foundations: … Already solid: …".
   *  TRANSIENT session-scoped context, same carrier semantics as
   *  progress_digest/last_opener: read for THIS session only, never
   *  persisted engine-side. Absent for every session minted before this
   *  field existed. Only consumed when NEXT_PUBLIC_TUTOR_PEDAGOGY_OPENER is
   *  on. */
  readiness_note?: string;
  /** Task WS3 — the completed mock attempt to review. When session_goal is
   *  'mock-review' the engine fetches the missed-item review context for this
   *  attempt and threads it to the brain. Absent ⇒ plain mock-review greeting
   *  session (degrade, never block). */
  mock_attempt_id?: string;
  /** Review agenda — item ids the student pinned for review (from the mock
   *  report screen). Passed to the context fetch as the `items` param so the
   *  pinned questions lead the focus list. Absent ⇒ pure miss-priority order. */
  mock_item_ids?: string[];
  branding?: {
    primary_color?: string;
    logo_url?: string;
    product_name?: string;
  };
  features?: {
    homework_upload?: boolean;
    text_mode?: boolean;
    voice_mode?: boolean;
  };
  metadata?: Record<string, unknown>;
}

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  operation: string;
  timestamp: Date;
  inputAudioTokens?: number;
  outputAudioTokens?: number;
  inputTextTokens?: number;
  outputTextTokens?: number;
}

function parseToken(tokenParam: string | null): EmbedConfig | null {
  if (!tokenParam) return null;
  try {
    // TODO: Replace with proper JWT verification using partner's API secret
    // For now, accept base64-encoded JSON for development/testing
    const decoded = atob(tokenParam);
    return JSON.parse(decoded);
  } catch {
    // Try plain JSON (for sandbox testing)
    try {
      return JSON.parse(decodeURIComponent(tokenParam));
    } catch {
      return null;
    }
  }
}

/** Origin of the page embedding this iframe. ancestorOrigins is the
 *  reliable signal in Chromium/Safari; referrer is the Firefox fallback.
 *  Returns undefined outside an iframe or when both are unavailable. */
function getEmbeddingHost(): string | undefined {
  try {
    const ancestors = window.location.ancestorOrigins;
    if (ancestors && ancestors.length > 0) return ancestors[0];
    if (document.referrer) return new URL(document.referrer).origin;
  } catch { /* cross-origin quirks — omit */ }
  return undefined;
}

function mapEngine(_engine?: string): InternalEngine {
  // All embeds run on claude-brain. The token's `engine` field is
  // ignored for routing — only kept on the type for backwards
  // compatibility with existing partner JWTs.
  return 'claude-brain';
}

function EmbedSession() {
  const searchParams = useSearchParams();
  const tokenParam = searchParams.get('token');
  const config = useMemo(() => parseToken(tokenParam), [tokenParam]);

  // If no valid config, show error
  if (!config) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-8">
        <div className="max-w-md text-center">
          <h1 className="mb-2 text-xl font-bold text-gray-900">Invalid Session Token</h1>
          <p className="text-sm text-gray-600">
            A valid session token is required to start a tutoring session.
            Please check your integration and try again.
          </p>
        </div>
      </div>
    );
  }

  return <EmbedSessionInner config={config} />;
}

function EmbedSessionInner({ config }: { config: EmbedConfig }) {
  const subject = config.subject;
  const level = config.level;
  const topic = config.topic || '';
  const studentName = config.student_name || '';
  // Default to 'concept-review' when the token omits the field: X2 made
  // 'practice' inject a strong no-new-teaching mandate every turn, so an
  // accidental missing field must NOT silently flip lessons into practice
  // mode (the portal always sends the field; sandbox/QA mints may not).
  const sessionGoal: SessionGoal = config.session_goal || 'concept-review';
  const inputMode: InputMode = config.input_mode || 'voice';
  const voiceEngine: InternalEngine = mapEngine(config.engine);
  const openAIVoice: OpenAIVoice = (config.voice as OpenAIVoice) || 'coral';
  // Honor the teacher persona's declared voice. A cartesia teacher voice drives
  // Cartesia TTS with that EXACT voiceId (the marketplace teacher's cloned
  // voice); the embed otherwise never wired a TTS provider and fell back to the
  // OpenAI Realtime voice (`openAIVoice`). Absent/openai teacher voice keeps
  // that prior behavior exactly — backward-compatible for existing partners.
  const teacherVoice = config.teacher?.voice;
  const useCartesiaVoice = teacherVoice?.provider === 'cartesia' && !!teacherVoice.voiceId;
  const ttsProvider: 'realtime' | 'cartesia' = useCartesiaVoice ? 'cartesia' : 'realtime';
  const cartesiaVoiceId = useCartesiaVoice ? teacherVoice.voiceId : undefined;
  // Clamp partner-supplied session length to [1, 120] min. The hard
  // ceiling matches the bound in lib/tutor/lesson-plan/session-budget
  // (MAX_SESSION_MINUTES) and exists to prevent runaway voice-API
  // costs and bad pedagogy from arbitrary partner-supplied values.
  // "Explicit" = the token actually carried max_duration_minutes (vs the
  // defaulted 30). Only an explicit value marks a real time-boxed demo — it
  // gates trial time-mode demo-stop AND the engine's hard wall-clock cap
  // (see VoiceTutorRealtime). A defaulted 30 keeps every non-demo session's
  // behavior exactly as before.
  const maxDurationExplicit =
    typeof config.max_duration_minutes === 'number' && Number.isFinite(config.max_duration_minutes);
  const maxDuration = Math.max(
    1,
    Math.min(120, maxDurationExplicit ? Math.floor(config.max_duration_minutes as number) : 30),
  );
  // Graceful-wrap threshold — meaningful only for a real time-boxed demo, so
  // it's computed only when max_duration_minutes was explicit. Clamp to
  // [1, maxDuration - 1], default maxDuration - 2. Undefined otherwise ⇒ the
  // runtime runs no wrap phase (untimed-demo behavior unchanged).
  const wrapAtMinutes = maxDurationExplicit
    ? Math.max(
        1,
        Math.min(
          maxDuration - 1,
          typeof config.wrap_at_minutes === 'number' && Number.isFinite(config.wrap_at_minutes)
            ? Math.floor(config.wrap_at_minutes)
            : maxDuration - 2,
        ),
      )
    : undefined;
  const branding = config.branding;

  // Apply branding color as CSS variable
  const brandStyle = branding?.primary_color
    ? { '--brand-color': branding.primary_color } as React.CSSProperties
    : {};

  // Session state. Transcript + whiteboard are mirrored from TutorSession via
  // its callbacks so saveSession + the session_ended postMessage have counts.
  // E4 — id unification: key the engine session on the portal-minted id when
  // the token carries one, so the portal's Session.engineSessionId and the
  // engine's TutorSession.sessionId are the same. Else legacy mint.
  const [sessionId] = useState(() => config.session_id || `embed-${Date.now()}`);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  // Each mirrored command carries its CAPTURE time. Stamping happens once, at
  // mirror-append, and the same stamp rides every subsequent save — stamping
  // at save time (pre-2026-07-15) collapsed the whole board onto the latest
  // periodic flush's `now`, which left replays with zero real WB timing and
  // forced ReplayPlayer's transcript-derived fallback.
  const [whiteboardCommands, setWhiteboardCommands] = useState<{ cmd: WhiteboardCommand; capturedAt: string }[]>([]);
  // Guards the mirror above against a replayed resume seed (TutorSession/VTR
  // remount while this page persists) — see resume-seed.ts. Same lifetime as
  // the mirror: both live for this embed page instance.
  const resumeSeedGuardRef = useRef(createSeedGuard());
  const [error, setError] = useState<string | null>(null);
  const [sessionEnded, setSessionEnded] = useState(false);
  const sessionStartRef = useRef(new Date());
  // Phase-0 instrumentation (humanlike-latency plan): the embed surface never
  // wired onDebugEvent, so portal sessions persisted ZERO debug events and
  // live latency baselines were uncapturable (found 2026-07-22). Persist a
  // small ALLOWLISTED subset — measurement events only, one short line per
  // turn — not the full /tutor-page firehose (real-student volume).
  const debugEventsRef = useRef<Array<{ type: string; message: string; timestamp: string }>>([]);
  const lastSavedDebugCountRef = useRef(0);
  const addDebugEvent = useCallback((type: string, message: string) => {
    if (!EMBED_DEBUG_EVENT_PREFIXES.some((p) => type.startsWith(p))) return;
    debugEventsRef.current.push({ type, message, timestamp: new Date().toISOString() });
  }, []);

  // E3 — resume boot. When the token asks to continue an existing session,
  // read the engine's persisted checkpoint and, if it's within
  // RESUME_MAX_AGE_MS (the engine is the decider — §1.4), rehydrate position +
  // transcript + whiteboard. The first render is gated on this read so the
  // runtime seeds cleanly instead of mounting empty then re-seeding. Any
  // failure / stale / missing checkpoint → fresh start on the same lesson.
  const wantsResume = !!(config.resume && config.session_id);
  const [resumeReady, setResumeReady] = useState(!wantsResume);
  const [resumeState, setResumeState] = useState<TutorResumeState | null>(null);
  // Stale-checkpoint marker (resume-stale opening journey): the checkpoint
  // EXISTED but fell outside RESUME_MAX_AGE_MS, so `resumeState` stays null
  // (cold start) and the runtime gets a light re-orient directive instead.
  // Mutually exclusive with a non-null resumeState (resolveResumeOutcome
  // never returns both). Only consumed when the pedagogy flag is on.
  const [checkpointStale, setCheckpointStale] = useState(false);
  useEffect(() => {
    if (!wantsResume) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/tutor/session-usage?sessionId=${encodeURIComponent(sessionId)}`);
        if (res.ok) {
          const { state: rs, hadStaleCheckpoint } = resolveResumeOutcome(await res.json());
          if (!cancelled) {
            if (rs) setResumeState(rs);
            if (hadStaleCheckpoint) setCheckpointStale(true);
          }
        }
      } catch {
        /* fresh start on any read error */
      }
      if (!cancelled) setResumeReady(true);
    })();
    return () => { cancelled = true; };
  }, [wantsResume, sessionId]);

  // Task WS3 — mock-review context boot. When the session is a mock-review and
  // the token carries the completed attempt, fetch the missed-item review
  // context and thread it to the brain. Degrade, never block: any non-200 /
  // network failure logs and leaves mockReview undefined, so the session still
  // starts as a plain mock-review greeting session.
  const [mockReview, setMockReview] = useState<MockReviewContext | undefined>(undefined);
  // Fetch (and re-fetch) the mock-review context. `pinItemIds` pins extra
  // items so they lead the focus list — the Agenda drawer's "switch to this
  // question" path. Always setMockReview's the fresh context AND returns it so
  // the caller (VoiceTutorRealtime.pickAgendaItem) can set its ref directly and
  // beat the prop-render race. Degrade, never block: a failure logs and returns
  // undefined, leaving the session running on whatever context it already had.
  const refetchMockReview = useCallback(
    async (pinItemIds?: string[]): Promise<MockReviewContext | undefined> => {
      if (!config.mock_attempt_id) return undefined;
      const ids = pinItemIds?.length ? pinItemIds : config.mock_item_ids;
      const pinned = ids?.length ? `&items=${encodeURIComponent(ids.join(','))}` : '';
      try {
        const r = await fetch(`/api/tutor/mock-review-context?attemptId=${encodeURIComponent(config.mock_attempt_id)}&studentId=${encodeURIComponent(config.student_id)}${pinned}`);
        if (!r.ok) throw new Error(`context ${r.status}`);
        const ctx = (await r.json()) as MockReviewContext;
        setMockReview(ctx);
        return ctx;
      } catch (e) {
        console.error('[mock-review] context fetch failed — session continues without it:', e);
        return undefined;
      }
    },
    [config.mock_attempt_id, config.student_id, config.mock_item_ids],
  );
  useEffect(() => {
    if (sessionGoal !== 'mock-review' || !config.mock_attempt_id) return;
    void refetchMockReview();
  }, [sessionGoal, config.mock_attempt_id, refetchMockReview]);

  const topicDisplayName = useMemo(
    () => topic ? buildDisplayName(subject, level, topic) : `${subject} — ${level}`,
    [subject, level, topic]
  );

  // Text-mode chat, the auto-greeting, voice callbacks, and homework upload
  // all moved into the shared <TutorSession> (per the decision to route typed
  // input through the brain). The embed only mirrors transcript/whiteboard via
  // TutorSession's callbacks for saveSession + the session_ended counts.

  // Save session to DB. 'active' = periodic flush (no endedAt/status);
  // 'completed'/'abandoned' add the end-of-session summary fields.
  //
  // Transcript + whiteboard ride EVERY save, periodic flushes included.
  // They were previously persisted only by the final save, and that save is
  // fragile: beforeunload doesn't fire on tab-kill/laptop-sleep, sendBeacon
  // silently refuses payloads over the UA's ~64KB quota, and a plain fetch
  // is aborted when the parent navigates the iframe away. Observed
  // 2026-07-13: a 47-minute Crimsora session recorded $2.43 of brain cost
  // (cost rides the small progress checkpoints) but ZERO transcript.
  // Mirrors the /tutor page's periodic-flush fix from 2026-04-29.
  const saveSession = useCallback((status: 'active' | 'completed' | 'abandoned') => {
    const now = new Date();
    const duration = Math.round((now.getTime() - sessionStartRef.current.getTime()) / 1000);
    // Slim base: everything except transcript/whiteboard — always fits the
    // sendBeacon/keepalive body quota, so the end-of-session facts
    // (endedAt, duration, counts, cost) survive even when the full payload
    // can't be delivered.
    const basePayload = {
      sessionId,
      subject,
      topic,
      level,
      sessionGoal,
      inputMode,
      voiceEngine,
      source: 'embed',
      sourcePartnerId: config?.partner_id || undefined,
      sourceHost: getEmbeddingHost(),
      studentName: studentName || undefined,
      studentId: config?.student_id || undefined,
      startedAt: sessionStartRef.current.toISOString(),
      duration,
      messageCount: transcript.length,
      whiteboardItemCount: whiteboardCommands.length,
      ...(status !== 'active' ? { endedAt: now.toISOString(), status } : {}),
      // A1: token/cost telemetry + covered topics (were always 0/empty for
      // embed sessions — this is what makes Sonnet-5 cost tracking visible).
      ...brainUsageTotals(),
      ...(() => {
        if (status === 'active') return {};
        const summary = sessionHandleRef.current?.getSessionSummary?.();
        return {
          ...(summary?.topicsCovered?.length ? { topicsCovered: summary.topicsCovered } : {}),
          ...(summary?.weakTopics?.length ? { weakTopics: summary.weakTopics } : {}),
        };
      })(),
    };
    const payload = {
      ...basePayload,
      ...(transcript.length > 0 ? {
        transcript: transcript.map(t => ({
          role: t.role,
          text: t.text,
          timestamp: t.timestamp.toISOString(),
          ...(t.whiteboardCommands?.length ? { whiteboardCommands: t.whiteboardCommands } : {}),
          ...(t.pedagogicalIntent ? { pedagogicalIntent: t.pedagogicalIntent } : {}),
        })),
      } : {}),
      ...(whiteboardCommands.length > 0 ? {
        whiteboardCommands: whiteboardCommands.map(({ cmd, capturedAt }) => ({
          action: cmd.action,
          data: { ...cmd, action: undefined },
          // Capture time, NOT save time (`now`): the replay reconstructs WB
          // timing from these stamps, and same-stamped arrays break it for
          // paused-and-resumed sessions (2026-07-15 replay fix).
          timestamp: capturedAt,
        })),
      } : {}),
      // Delta-append allowlisted debug events (same batching convention as
      // the /tutor page: count advances at send, at-most-once best-effort).
      ...(() => {
        const newDebugEvents = debugEventsRef.current.slice(lastSavedDebugCountRef.current);
        lastSavedDebugCountRef.current = debugEventsRef.current.length;
        return newDebugEvents.length > 0 ? { debugEvents: newDebugEvents } : {};
      })(),
    };
    const body = JSON.stringify(payload);

    if (status === 'active') {
      fetch('/api/tutor/session-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      }).catch(() => {});
      return;
    }

    if (status === 'abandoned') {
      // sendBeacon returns false (and sends NOTHING) when the payload
      // exceeds the UA's in-flight quota (~64KB) — exactly how the
      // 47-minute transcript vanished on 2026-07-13. Fall back to the slim
      // summary, which always fits; the transcript itself is already in the
      // DB courtesy of the periodic flush above.
      if (!navigator.sendBeacon('/api/tutor/session-usage', body)) {
        navigator.sendBeacon('/api/tutor/session-usage', JSON.stringify(basePayload));
      }
      return;
    }

    // completed: keepalive lets the save outlive the parent navigating the
    // iframe away mid-request (two such nginx 499 aborts observed
    // 2026-07-13) — but keepalive bodies share sendBeacon's ~64KB quota, so
    // an oversized payload goes as slim-keepalive + full best-effort fetch.
    if (new Blob([body]).size <= 60_000) {
      fetch('/api/tutor/session-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
      }).catch(() => {});
    } else {
      fetch('/api/tutor/session-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(basePayload),
        keepalive: true,
      }).catch(() => {});
      fetch('/api/tutor/session-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      }).catch(() => {});
    }
  }, [sessionId, subject, topic, level, sessionGoal, inputMode, voiceEngine, studentName, transcript, whiteboardCommands]);

  // Session-quality A1 (2026-07-08): accumulate per-attempt claude-brain
  // token usage so the TutorSession record stops reading 0 tokens / $0 for
  // embed sessions (Vanshika's 25-min session recorded nothing — the usage
  // was on the brain stream's done event all along, never surfaced). Cost
  // uses Claude Sonnet rates with the cache buckets priced separately;
  // inputTokens excludes cache reads/creations (Anthropic semantics), so
  // totalInputTokens below reports the full billed input volume.
  const BRAIN_PRICING = { input: 3.0, output: 15.0, cacheRead: 0.3, cacheWrite: 3.75 }; // $/1M tok
  const brainUsageRef = useRef({ inputTokens: 0, outputTokens: 0, cacheReadTokens: 0, cacheCreationTokens: 0 });
  const handleBrainUsage = useCallback((u: { inputTokens: number; outputTokens: number; cacheReadTokens: number; cacheCreationTokens: number }) => {
    const acc = brainUsageRef.current;
    acc.inputTokens += u.inputTokens;
    acc.outputTokens += u.outputTokens;
    acc.cacheReadTokens += u.cacheReadTokens;
    acc.cacheCreationTokens += u.cacheCreationTokens;
  }, []);
  const brainUsageTotals = useCallback(() => {
    const acc = brainUsageRef.current;
    const cost =
      (acc.inputTokens / 1_000_000) * BRAIN_PRICING.input +
      (acc.outputTokens / 1_000_000) * BRAIN_PRICING.output +
      (acc.cacheReadTokens / 1_000_000) * BRAIN_PRICING.cacheRead +
      (acc.cacheCreationTokens / 1_000_000) * BRAIN_PRICING.cacheWrite;
    return {
      totalInputTokens: acc.inputTokens + acc.cacheReadTokens + acc.cacheCreationTokens,
      totalOutputTokens: acc.outputTokens,
      estimatedCost: Math.round(cost * 10000) / 10000,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // A1: local handle so saveSession can read the runtime's session summary
  // (topicsCovered / weakTopics) — previously never consumed on the embed.
  const sessionHandleRef = useRef<RealtimeHandle | null>(null);

  // Furthest pedagogical milestone reached this session (from the runtime).
  // Defaults to 'none'; reported to the portal in session_ended.
  const milestoneRef = useRef<SessionMilestone>('none');
  const handleMilestone = useCallback((m: TutorMilestone) => {
    if (MILESTONE_RANK[m] > MILESTONE_RANK[milestoneRef.current]) milestoneRef.current = m;
  }, []);

  // Opener-recency loop (part B): the runtime reports which opener it used
  // this session (kind + digest, captured once on the opener turn — only
  // fires when NEXT_PUBLIC_TUTOR_PEDAGOGY_OPENER is on). Reported to the
  // portal in session_ended as `opener_record`; the academy stores it and
  // round-trips it back as the next session's EmbedConfig.last_opener so
  // the tutor never opens the same way twice in a row.
  const openerRecordRef = useRef<{ kind: string; digest: string } | null>(null);
  const handleOpenerRecord = useCallback((rec: { kind: string; digest: string }) => {
    openerRecordRef.current = rec;
  }, []);

  // Lesson-phase progress (contract v1.2.0). The two source callbacks fire
  // independently — onLessonProgressChange carries {plan, currentSegmentId}
  // (on plan load + each advance), onCompletedSegmentsChange carries the
  // completed ids — so we hold each in a ref and rebuild from the latest of
  // both. lessonProgressRef holds the last built value for session_ended.
  const planRef = useRef<LessonPlan | null>(null);
  const currentSegmentIdRef = useRef<string>('');
  const completedSegmentIdsRef = useRef<string[]>([]);
  const lessonProgressRef = useRef<LessonProgress | null>(null);
  const lastEmittedProgressRef = useRef<string>('');
  // Practice meter (2026-07-17): latest problem-work stats from the
  // runtime; rides the evelyn:progress message as an ADDITIVE field.
  const practiceStatsRef = useRef<{ active: boolean; presented: number; solved: number; streak: number } | null>(null);

  // Build LessonProgress from the latest position and surface it to the
  // portal: a live `evelyn:progress` postMessage (highlights the current pill,
  // updates the portal cache) PLUS a durable checkpoint POST (survives an
  // abrupt close; the authoritative source for the session-progress read +
  // resume). Fires once on plan load (manifest) and on every segment change.
  const emitProgress = useCallback(() => {
    const progress = buildLessonProgress(
      planRef.current,
      currentSegmentIdRef.current,
      completedSegmentIdsRef.current,
    );
    if (!progress) return;
    lessonProgressRef.current = progress;
    // Practice stats fold into the dedup signature so a solve/streak
    // change re-emits even when the segment position didn't move.
    const sig = JSON.stringify({ progress, practice: practiceStatsRef.current });
    if (sig === lastEmittedProgressRef.current) return;
    lastEmittedProgressRef.current = sig;

    window.parent.postMessage({
      type: 'evelyn:progress',
      data: {
        session_id: sessionId,
        lesson_progress: progress,
        // Additive (2026-07-17): live practice meter for the portal strip.
        // Older portals ignore unknown fields — contract-safe.
        ...(practiceStatsRef.current ? { practice: practiceStatsRef.current } : {}),
      },
    }, '*');

    // Identity fields included so this upsert inserts validly if it lands
    // before the first full save (required-field validation on insert).
    fetch('/api/tutor/session-usage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        subject, topic, level, sessionGoal, inputMode,
        voiceEngine, source: 'embed',
        sourcePartnerId: config?.partner_id || undefined,
        sourceHost: getEmbeddingHost(),
        studentName: studentName || undefined,
        studentId: config?.student_id || undefined,
        startedAt: sessionStartRef.current.toISOString(),
        lessonProgress: {
          lessonPlanId: progress.lessonPlanId,
          currentSegmentId: progress.currentSegmentId,
          completedSegmentIds: progress.completedSegmentIds,
        },
        // A1: flush running token totals with each checkpoint so telemetry
        // survives an abrupt close (beforeunload doesn't always fire).
        ...brainUsageTotals(),
      }),
    }).catch(() => {});
  }, [sessionId, subject, topic, level, sessionGoal, inputMode, voiceEngine, studentName]);

  // End session — save to DB + notify parent window
  const handleEndSession = useCallback((reason?: 'time_limit', endIntent?: 'finish' | 'discard') => {
    // A deliberate discard (round-4 item 5) is an abandonment, not a
    // completion — keep the engine's own record consistent with the
    // portal's abort.
    saveSession(endIntent === 'discard' ? 'abandoned' : 'completed');
    setSessionEnded(true);
    const duration = Math.round((Date.now() - sessionStartRef.current.getTime()) / 1000);
    // Post message to parent window for partner integration
    window.parent.postMessage({
      type: 'evelyn:session_ended',
      data: {
        session_id: sessionId,
        duration,
        message_count: transcript.length,
        whiteboard_items: whiteboardCommands.length,
        // Demo time-box (P3): additive — present ONLY when the engine's hard
        // wall-clock cap ended the session (not the student's End button), so
        // the portal can distinguish a timed-out demo from a normal finish.
        ...(reason === 'time_limit' ? { ended_reason: 'time_limit' as const } : {}),
        // Round-4 item 5 (additive): the Adaptive-menu Finish/Discard choice.
        // The portal branches on it (finish → finalize, discard → abort);
        // absent on a plain End/Pause, so older portals see no change.
        ...(endIntent ? { end_intent: endIntent } : {}),
        // Real engine milestone (value-boxed). 'none' if the student bailed
        // before completing a concept — the portal consumes this directly.
        milestone: milestoneRef.current,
        // Final lesson position (contract v1.2.0). Omitted for free-conversation
        // sessions with no plan (lessonProgressRef stays null).
        ...(lessonProgressRef.current ? { lesson_progress: lessonProgressRef.current } : {}),
        // Opener-recency loop (part B): which opener the tutor used this
        // session — the academy stores it and round-trips it as the next
        // session's last_opener. Only present when the pedagogy flag is on
        // (capture is flag-gated in the runtime).
        ...(openerRecordRef.current ? { opener_record: openerRecordRef.current } : {}),
        // Social-extraction carrier (Task D3 loop): a role/text transcript
        // (capped to the last 200 entries) the academy forwards on its
        // session-result emit so server-side thread extraction can run.
        // The academy applies the consent guards (non-trial, memory level,
        // parental opt-out) before forwarding; sending here is inert until
        // it does. Gated on the same pedagogy flag as the capture.
        ...(TUTOR_PEDAGOGY_OPENER_EMBED
          ? {
              transcript: transcript.slice(-200).map((t) => ({
                role: t.role === 'tutor' ? ('tutor' as const) : ('student' as const),
                text: t.text,
              })),
            }
          : {}),
      },
    }, '*');
  }, [saveSession, sessionId, transcript, whiteboardCommands.length]);

  // Task E8: mobile "expand" mode. The portal (task P6) owns the visual
  // growth — this iframe just relays the tap. SessionStage (deep inside
  // TutorSession's slot tree) owns the rail button and its own
  // expanded/collapsed state, and reaches this postMessage sender the same
  // way its transcript button already reaches SessionStage from up here
  // ('evelyn:open-transcript'), just running the other direction: a window
  // event SessionStage dispatches, relayed here to window.parent. Fixed
  // cross-repo contract with portal task P6 — do not rename either message.
  useEffect(() => {
    const relay = (type: 'evelyn:expand' | 'evelyn:collapse') => () => {
      window.parent.postMessage({ type }, '*');
    };
    const onExpand = relay('evelyn:expand');
    const onCollapse = relay('evelyn:collapse');
    window.addEventListener('evelyn:expand', onExpand);
    window.addEventListener('evelyn:collapse', onCollapse);
    return () => {
      window.removeEventListener('evelyn:expand', onExpand);
      window.removeEventListener('evelyn:collapse', onCollapse);
    };
  }, []);

  // P2 (demo feedback R2): relay the real session start (mic tap / first
  // gesture — the same moment the engine's own hard-stop clock anchors) to
  // the parent, so the portal's demo countdown can anchor there instead of
  // at iframe mount. Additive protocol message; older portals ignore it.
  useEffect(() => {
    const onStarted = (e: Event) => {
      const startedAtMs = (e as CustomEvent<{ startedAtMs?: number }>).detail?.startedAtMs;
      window.parent.postMessage(
        {
          type: 'evelyn:session_started',
          data: {
            session_id: sessionId,
            ...(typeof startedAtMs === 'number' && Number.isFinite(startedAtMs)
              ? { started_at_ms: startedAtMs }
              : {}),
          },
        },
        '*',
      );
    };
    window.addEventListener('evelyn:session-started', onStarted);
    return () => window.removeEventListener('evelyn:session-started', onStarted);
  }, [sessionId]);

  // Save as abandoned on page unload
  useEffect(() => {
    if (sessionEnded) return;
    const handleBeforeUnload = () => saveSession('abandoned');
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [sessionEnded, saveSession]);

  // Periodic active flush every 30s while the session runs, so an abnormal
  // end (tab kill, sleep, dropped final save) loses at most 30s of trailing
  // turns instead of the whole transcript.
  //
  // CRITICAL: the interval reads saveSession through a ref with a stable
  // effect dep list. saveSession's deps include `transcript`, so every turn
  // re-creates it — depending on it directly would tear down and recreate
  // the interval, restarting its 30s clock, and during an active
  // conversation the timer would never fire (same trap the /tutor page
  // documents).
  const saveSessionRef = useRef(saveSession);
  useEffect(() => {
    saveSessionRef.current = saveSession;
  }, [saveSession]);
  useEffect(() => {
    if (sessionEnded) return;
    const interval = setInterval(() => saveSessionRef.current('active'), 30_000);
    return () => clearInterval(interval);
  }, [sessionEnded]);

  // Session ended view
  if (sessionEnded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50" style={brandStyle}>
        <div className="max-w-md text-center p-8">
          <div className="mb-4 text-4xl">&#10003;</div>
          <h1 className="mb-2 text-xl font-bold text-gray-900">Session Complete</h1>
          <p className="text-sm text-gray-600">
            {transcript.length} messages exchanged, {whiteboardCommands.length} visuals generated.
          </p>
        </div>
      </div>
    );
  }

  // Resume boot in flight — hold the first render until the checkpoint read
  // resolves so the runtime seeds once, cleanly. Only reached when the token
  // asked to resume; a normal start has resumeReady=true from the outset.
  if (!resumeReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50" style={brandStyle}>
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Partner brand lockup shown in the new UI's top bar (keeps branding while
  // matching the /tutor look). primary_color rides the --brand-color var below.
  const headerBrand = (branding?.logo_url || branding?.product_name) ? (
    <div className="flex items-center gap-2">
      {branding?.logo_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={branding.logo_url} alt="" className="h-5" />
      )}
      {branding?.product_name && (
        <span className="text-sm font-semibold text-slate-800 truncate max-w-[38vw]">{branding.product_name}</span>
      )}
    </div>
  ) : undefined;

  return (
    <div style={brandStyle}>
      <TutorSession
        subject={subject}
        topic={topic || ''}
        level={level}
        studentName={studentName || undefined}
        studentId={config.student_id}
        sessionId={sessionId}
        // Round 29 (replay-desync audit): the embed never passed the
        // recorder's canonical T0, so portal tracks fell into the
        // "first audio chunk wins" fallback and drifted from the replay
        // timeline by the setup latency. Page-mount time ≈ the server's
        // TutorSession.startedAt for fresh sessions. (Resumed sessions
        // appending to an existing pcm file remain unsolved — needs the
        // per-chunk sidecar redesign.)
        sessionStartedAtMs={sessionStartRef.current.getTime()}
        sessionGoal={sessionGoal}
        mockReview={mockReview}
        refetchMockReview={refetchMockReview}
        lessonPlanId={config.curriculum_module || undefined}
        voice={openAIVoice}
        voiceEngine="claude-brain"
        ttsProvider={ttsProvider}
        cartesiaVoiceId={cartesiaVoiceId}
        sessionMaxMinutes={maxDuration}
        sessionWrapMinutes={wrapAtMinutes}
        maxDurationExplicit={maxDurationExplicit}
        socialMemory={config.social_memory}
        progressDigest={config.progress_digest}
        lastOpener={config.last_opener}
        readinessNote={config.readiness_note}
        onOpenerRecord={handleOpenerRecord}
        onBrainUsage={handleBrainUsage}
        onDebugEvent={addDebugEvent}
        handleRef={sessionHandleRef}
        isTrial={config.is_trial === true}
        targetKind={config.target_kind}
        checkpointStale={checkpointStale}
        teacherPersona={config.teacher}
        resumeState={resumeState}
        topicDisplayName={topicDisplayName}
        headerBrand={headerBrand}
        onEndSession={handleEndSession}
        embedded
        onMilestone={handleMilestone}
        onTranscriptUpdate={setTranscript}
        onWhiteboardCommand={(cmds, meta) => {
          if (!acceptWhiteboardBatch(resumeSeedGuardRef.current, meta)) return;
          // Capture time stamped at append (live batch-mates share one stamp —
          // they arrived in the same turn). A resume-seed batch instead keeps
          // each restored command's ORIGINAL draw stamp (meta.seedStamps) so
          // the replay timeline stays anchored to when the figure was actually
          // drawn, not the resume moment — a board drawn in attempt 1 and
          // resumed much later otherwise lands off the end of the replay
          // (session-1784507935152, 2026-07-19). Missing/empty stamp → now.
          const now = new Date().toISOString();
          setWhiteboardCommands((prev) => [...prev, ...cmds.map((cmd, i) => ({
            cmd,
            capturedAt: meta?.seedStamps?.[i]?.timestamp || now,
          }))]);
        }}
        onLessonProgressChange={(p) => {
          planRef.current = p.plan;
          currentSegmentIdRef.current = p.currentSegmentId;
          emitProgress();
        }}
        onCompletedSegmentsChange={(ids) => {
          completedSegmentIdsRef.current = ids;
          emitProgress();
        }}
        onPracticeStatsChange={(s) => {
          // Practice meter (2026-07-17): additive field on the progress
          // message — older portals ignore it (contract-safe).
          practiceStatsRef.current = s;
          emitProgress();
        }}
      />

      {/* Error toast */}
      {error && (
        <div className="fixed bottom-20 right-4 z-[70] flex items-center gap-2 rounded-lg border border-red-300 bg-red-100 px-4 py-3 text-red-700 shadow-lg">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">x</button>
        </div>
      )}
    </div>
  );
}

export default function EmbedPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    }>
      <EmbedSession />
    </Suspense>
  );
}
