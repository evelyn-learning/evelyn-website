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
import { lookupModelRate } from '@/lib/tutor/ai/model-rates';
import TutorSession from '@/app/tutor/components/session/TutorSession';
import { type TutorMilestone, type TutorResumeState, type RealtimeHandle } from '@/app/tutor/components/VoiceTutorRealtime';
import type { SessionResult, LessonProgress, SocialThread, ProgressDigest } from '@evelyn/portal-contract/v1';
import type { LessonPlan } from '@/lib/tutor/lesson-plan/types';
import { buildLessonProgress } from '@/lib/tutor/portal/lesson-progress';
import { resolveResumeOutcome } from '@/lib/tutor/portal/resume';
import { acceptWhiteboardBatch, createSeedGuard } from '@/lib/tutor/whiteboard/resume-seed';
import { parseEmbedConfig } from '@/lib/tutor/portal/parse-embed-config';
import { isPedagogyOpenerFlagValue } from '@/lib/tutor/ai/opening-behavior';
import { TUTOR_TELEMETRY_SURVIVAL, TUTOR_DEFER_SESSION_DOC } from '@/lib/tutor/orchestrator/flags';
import { shouldFlushEarly } from '@/lib/tutor/orchestrator/flush-policy';
import type { TeacherPersonaWire } from '@core/ai/teacher-persona';
import { cartesiaSpeedForVoiceId } from '@core/voice/cartesia-voice-registry';

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
  // Round-7g: idle re-engagement nudge firings (idle_nudge_sent).
  'idle_nudge',
  // R40: a Start tap that landed before the relay connected and was queued
  // (the dead-first-tap class, embed-1785808658013) — proves the queue ran.
  // 2026-08-17 (portal-96a436f0): 'start_' also admits start_tap — every
  // orb/mic tap now records its resolved action, so a swallowed pre-start
  // tap can never again leave a zero-telemetry dead session.
  'start_',
  // 2026-08-17 (portal-35b9a5d8): figure_evolve_replace / figure_redraw_replace
  // / figure_evolve_removed — the supersede trail for "the diagram is
  // overlapping, redraw it" fixes; without these the portal replay can't
  // show WHY an item vanished.
  'figure_',
  // 2026-08-18 (portal-a972c7e9): denied_answer_stashed /
  // denied_answer_reversal_kill — the deny-then-assert self-contradiction
  // guard's trail.
  'denied_answer',
  // 2026-08-07 triage (embed-1786076855391): the brain/judge/tool families
  // were all absent from this list, so an embed session that misbehaved
  // (request treated as a correct answer) persisted 13 events and NO record
  // of what the brain did or what the judge said about it — the same triage
  // on a /tutor session had 166. Trap discovered: 'brain_watchdog' above
  // does NOT cover 'brain_turn' (prefix match). All one-short-line-per-turn
  // families; real-student volume stays modest vs the transcript payload.
  'brain_', 'judge', 'tool_call', 'verdict_', 'render_sync', 'cover_silent',
  'turn_length', 'completion_gated', 'auto_', 'pacing_', 'improvised_answer',
  //   R58: solver-dispute correction note + false-final-assertion kill:
  'improvised_mismatch_note_planted', 'false_assertion_kill', 'verdict_replant_requested',
  //   R58: student-declared hold family (armed/active/swallowed/resumed/
  //   check_in) + first-session tip + noise-floor nudge:
  'student_hold_', 'first_session_tip', 'noise_floor_',
  'scribble_dedup', 'queue_drain', 'student_echo', 'vbs_',
  // Agenda rail (2026-08-10): agenda_rail_active — one line per fresh plan
  // start, proves the opener resolved a non-zero agenda item count (rail
  // preview clause armed). No card is ever dispatched.
  'agenda_',
  // R42 (2026-08-10): transcript_drawer — every open/close of the
  // transcript drawer with its trigger source (icon/caption/qpin/event),
  // added to diagnose the header-icon ghost-second-open bug.
  'transcript_',
  // R42: mcq_letter_normalized — a spoken letter homophone ("See.") was
  // rewritten to the literal MCQ choice letter before dispatch.
  'mcq_letter_normalized',
  // Task 4, verdict-detector round (2026-08-10): praise_echo_kill (the
  // opener disagreeing with what the STUDENT said, praise-echo-check.ts)
  // was absent from this list — same class of gap as the 2026-08-07
  // brain_/judge_/tool_call_ triage above.
  'praise_echo',
  // Fold-in, round-3 whole-branch review: praise_contradiction_kill (R38,
  // the brain contradicting its OWN opener later in the same turn) was the
  // gap flagged as out-of-scope in the note above — closing it here so
  // embed sessions get the same triage coverage /tutor sessions already have.
  'praise_contradiction',
  // Task 5, verdict-detector round (2026-08-10): inverse_verdict_kill /
  // inverse_verdict_advisory / inverse_verdict_unverified_pinned /
  // inverse_verdict_correction_note_planted — the false-DENIAL counterpart
  // to praise_echo above (tutor denies an answer that matches the verified
  // expected answer). Same triage-gap class.
  'inverse_verdict',
  // Task 6, verdict-detector round (2026-08-10): echo_carveout — the
  // perception classifier rescued a would-be self-echo drop because the
  // utterance matched the verified expected answer and the tutor never
  // spoke it (perception-classifier.ts, expectedAnswerCarveOut). Same
  // triage-gap class as the two entries above.
  'echo_carveout',
  // R48 Task 2 (2026-08-12): exercise_no_board — a posed voice-only
  // exercise (Rule 3e, exercise-board-check.ts) with zero board-rendering
  // tool calls this turn. No existing prefix covers 'exercise_'; same
  // triage-gap class as the 2026-08-07 brain_/judge_/tool_call_ note above.
  'exercise_',
  // R48 Task 3 (2026-08-12): evidence_held / evidence_late_fire — the
  // explicit-complete segment-evidence row is now HELD across the stream and
  // released at post-stream credit resolution, so the learner-model outcome
  // reflects the same turn's verified-correct answer. No existing prefix
  // covers 'evidence_' (the older 'segment_evidence_on_advance' was likewise
  // uncovered); two short lines per completed evaluative segment.
  'evidence_',
  // ⚠ R54 (2026-08-22) — THIRD TIME THIS LIST HAS SILENTLY EATEN A FAMILY.
  // The two notes above record the first two. This time an audit found
  // **148 of 283 emitted event types uncovered**, i.e. 52% of the engine's
  // instrumentation discarded for the surface where essentially all real
  // students are. Consequences that had already reached conclusions:
  //   · `posed_problem_unboarded` (R51) was shipped WITH A WATCH CONDITION —
  //     "if it never fires on a turn nobody wrote it for it is over-narrow" —
  //     that was UNFALSIFIABLE, because the event never reached Mongo.
  //   · `quantities_unanchored` (R49b) reading 0 across the corpus measured
  //     this allowlist, not the detector.
  //   · `image_upload` reading 0 across 318 embed sessions was reported as
  //     evidence uploads never worked. It was evidence of this filter.
  // A coverage gate now exists (scripts/test-embed-debug-coverage.ts) so a
  // new event type can never again be dropped silently — adding one forces
  // a choice between persisting it and naming it as deliberately excluded.
  //
  // Added here: the R50-R53 diagnostic families, plus the correctness family
  // (a tutor stating something false is the single most important thing to
  // have a record of, and NONE of it was being kept).
  'qpin_', 'segment_overlong', 'posed_problem_unboarded',
  'quantities_unanchored', 'board_contradiction', 'map_pins_', 'image_upload',
  'whiteboard_false_claim', 'fact_wrong', 'wrong_final_answer',
  'answer_miscorrection', 'spoken_card_mismatch', 'voice_board_mismatch',
  'context_loss', 'uncertain_transcript', 'noise_filtered',
  // R54 continued — the remaining families the audit surfaced. These are
  // INCIDENT-level events (one row when something goes wrong), not per-turn
  // breadcrumbs, so the volume argument for keeping this list short does not
  // apply to them. Grouped by what they let you answer during triage:
  //   why a claim was killed / retried:
  'arith_claim_kill', 'simplification_verdict_kill', 'give_up_render_kill',
  'contradiction_inversion_retry', 'self_correction_retry',
  'nonanswer_praise_retry', 'kill_suppressed_final_attempt',
  //   why something vanished from the board:
  'killed_render', 'figure_evolve_removed', 'prescribed_render',
  //   portal-704e3e01 (2026-09-04): a lesson-STATE tool withheld because its
  //   turn was already killed (kill-scope.ts) — the advance/mark_complete
  //   counterpart to the killed_render family above.
  'kill_withheld_lesson_tool',
  //   whether the card matched what was said (content drift):
  'show_problem_', 'show_problem_substitution_skipped', 'show_segment_card', 'show_worked_example',
  'problem_equation_drift', 'board_anchor_flagged', 'meta_narration_dropped',
  //   pedagogy advisories:
  'bare_praise_ending_advisory', 'affirmative_no_advance_advisory',
  'disclaimer_verbatim_reuse_advisory', 'socratic_bulldozing',
  'try_yourself', 'turn_cap_flagged', 'required_phrase_missing',
  //   the dedup family (R49b's retry-context bug lived here):
  'dedup_',
  //   learner-model writes:
  'evidence_', 'segment_evidence', 'mark_segment_complete_cross_lo_rejected',
  //   R58 backward-mark exemption (accepts "advance then mark prior LO"):
  'mark_segment_complete_prior_lo_accepted',
  'advance_', 'inferred_advance_from_segment_card',
  //   latency covers + startup/recovery failures:
  'cover_', 'cutoff_resume', 'warmup_', 'listening_no_dispatch',
  //   problem pipeline:
  'generate_problem_unrendered', 'generated_problem_received',
  'no_problem_available_observed', 'new_problem_keyword',
  'expected_answer_pinned', 'student_problem_detected',
  //   session dynamics + resume:
  'topic_shift', 'fatigue_detected', 'long_session_checkin', 'session_',
  'resume_from_clause', 'mid_session_regreet_dropped', 'duplicate_response',
  'skip_button', 'opener_', 'student_turn_detection_error',
  // Session-triage fixes (2026-09-01): one of the two evidence sessions
  // fixed by this branch was an embed session — these three are its
  // diagnostics, so they must persist for embed sessions too. Full names
  // (not broad prefixes) so unrelated future events under the same
  // family root don't get swept in unintentionally.
  //   a false-assertion kill downgraded because its anchor had gone stale:
  'false_assertion_downgraded_stale_anchor',
  //   a queue-time merge/drop decision for a near-duplicate student final:
  'student_turn_coalesced',
  //   the "give me a moment" think-time hold armed for a turn:
  'think_time_hold_set',
  // portal-704e3e01 (2026-09-04): page retitled from the problem that actually
  // renders instead of the authored one from segment advance time.
  'auto_newpage_retitled_from_render',
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
import type { WhiteboardCommand } from '@core/knowledge/types';
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

// Non-authoritative UI config parsing only — see parse-embed-config.ts for
// why this never verifies a signature (that's the API routes' job, via
// verifyEmbedToken/checkEmbedAuth) and for the signed-JWT / legacy-base64 /
// plain-JSON fallback chain this wraps.
function parseToken(tokenParam: string | null): EmbedConfig | null {
  return parseEmbedConfig<EmbedConfig>(tokenParam);
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

  return <EmbedSessionInner config={config} embedToken={tokenParam ?? undefined} />;
}

function EmbedSessionInner({ config, embedToken }: { config: EmbedConfig; embedToken?: string }) {
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
  // R38: an openai-provider teacher voice was silently discarded (only the
  // cartesia branch below read teacher.voice) — honor its voiceId ahead of
  // the token-level `voice` field and the 'coral' default.
  const openAIVoice: OpenAIVoice =
    (config.teacher?.voice?.provider === 'openai' && config.teacher.voice.voiceId
      ? (config.teacher.voice.voiceId as OpenAIVoice)
      : (config.voice as OpenAIVoice)) || 'coral';
  // Honor the teacher persona's declared voice. A cartesia teacher voice drives
  // Cartesia TTS with that EXACT voiceId (the marketplace teacher's cloned
  // voice); the embed otherwise never wired a TTS provider and fell back to the
  // OpenAI Realtime voice (`openAIVoice`). Absent/openai teacher voice keeps
  // that prior behavior exactly — backward-compatible for existing partners.
  const teacherVoice = config.teacher?.voice;
  const useCartesiaVoice = teacherVoice?.provider === 'cartesia' && !!teacherVoice.voiceId;
  const ttsProvider: 'realtime' | 'cartesia' = useCartesiaVoice ? 'cartesia' : 'realtime';
  const cartesiaVoiceId = useCartesiaVoice ? teacherVoice.voiceId : undefined;
  // R38 Task 6 fix round: the embed supplies a raw voiceId (not a
  // teacherId), so resolveCartesiaVoice()'s teacher-keyed lookup never runs
  // here — cartesiaSpeedForVoiceId scans by id instead. Elena/Katie is the
  // marketing-demo persona, so this is the surface where the "too fast" bug
  // is most visible; unknown/marketplace voice ids resolve undefined (no
  // speed sent — unchanged behavior for every other partner voice).
  const cartesiaVoiceSpeed = cartesiaSpeedForVoiceId(cartesiaVoiceId);
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
  const [whiteboardCommands, setWhiteboardCommands] = useState<{ cmd: WhiteboardCommand; capturedAt: string; sourceMessageIndex?: number }[]>([]);
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
  const debugEventsRef = useRef<Array<{ type: string; message: string; timestamp: string; data?: Record<string, unknown> }>>([]);
  const lastSavedDebugCountRef = useRef(0);
  // Task 12/13 (portal-00fa1bb7 / -5bc0fc1e / -c3007206): latches the moment
  // this session became real, from WHICHEVER of THREE signals fires first
  // (fix-round-3 renamed this from a name that named only one of them).
  // Three rounds each closed one named entry point and uncovered another —
  // enumerating entry points was the wrong shape of fix, so the third
  // source latches on the INVARIANT instead: a session is one where the
  // tutor actually did something, and every path that costs money ends in a
  // brain turn, which produces transcript. That closes every present and
  // future entry point without naming any of them.
  //  - start_tap (VTR fires it on every orb/mic tap, see resolveStartTap):
  //    covers a tap that FAILS to start — the dead-start class this whole
  //    telemetry effort exists to diagnose. session-started never fires for
  //    that case, so latching on it alone would silently drop dead starts.
  //  - evelyn:session-started (window event, listened for below): covers
  //    gesture/typed-first-message starts, which never emit start_tap.
  //  - transcript GROWTH past the resume baseline (effect further below,
  //    fix-round-3 backstop, baselined in fix-round-4): the "Continue
  //    lesson" overlay resume, the resume-await toolbar (Draw / Text note /
  //    Camera — interactive and gated on nothing during that window) and a
  //    restored try-yourself card all end in a real, costed brain turn
  //    while bypassing both signals above. This is the ONE latch source
  //    that is not an enumeration — it closes the class, not an instance.
  //    It is `> resumeState.transcript.length`, not `> 0`, because a resume
  //    DOES restore transcript at mount with no gesture (VTR's resume-seed
  //    effect calls onTranscriptUpdate straight into this page's
  //    setTranscript); `> 0` made merely PREVIEWING a resumable session
  //    latch, and the resulting abandoned save overwrote the real prior
  //    session's duration/endedAt/status.
  // Keep all three: start_tap and session-started fire EARLIER than the
  // first transcript entry, so the early-flush window opens sooner and a
  // session that dies between tap and first turn still gets its row. The
  // transcript latch is the backstop, not a replacement. `=== null` on each
  // setter means the first signal wins and the rest are no-ops.
  const sessionEngagedAtRef = useRef<number | null>(null);
  // Single definition of the gate (fix-round-1: the reviewer flagged the
  // duplicated three-line check at the two write sites below). A page load
  // is not a session (portal-00fa1bb7 / -5bc0fc1e / -c3007206): hold every
  // tutorsessions write until sessionEngagedAtRef latches, so a load that
  // neither taps, starts, resumes, nor produces transcript writes nothing.
  const sessionNotYetEngaged = () => TUTOR_DEFER_SESSION_DOC && sessionEngagedAtRef.current === null;
  // 2026-08-07: signature matches VTR's onDebugEvent — the third `data` arg
  // used to be silently dropped here (every embed event persisted without its
  // structured payload). Message truncation mirrors /tutor's collector.
  const addDebugEvent = useCallback((type: string, message: string, data?: Record<string, unknown>) => {
    if (type === 'start_tap' && sessionEngagedAtRef.current === null) {
      sessionEngagedAtRef.current = Date.now();
    }
    if (!EMBED_DEBUG_EVENT_PREFIXES.some((p) => type.startsWith(p))) return;
    debugEventsRef.current.push({
      type,
      message: message.slice(0, 500),
      timestamp: new Date().toISOString(),
      ...(data ? { data } : {}),
    });
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
        const res = await fetch(
          `/api/tutor/session-usage?sessionId=${encodeURIComponent(sessionId)}`,
          embedToken ? { headers: { 'x-embed-token': embedToken } } : undefined,
        );
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
  }, [wantsResume, sessionId, embedToken]);

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
        // M1c Task 5 (fix round 2, CRITICAL B) — same header every other
        // embed fetch in this component attaches: without it the engine
        // route has no verified partner_id claim to resolve identity
        // under, and falls back to 'evelyn'.
        const r = await fetch(
          `/api/tutor/mock-review-context?attemptId=${encodeURIComponent(config.mock_attempt_id)}&studentId=${encodeURIComponent(config.student_id)}${pinned}`,
          embedToken ? { headers: { 'x-embed-token': embedToken } } : undefined,
        );
        if (!r.ok) throw new Error(`context ${r.status}`);
        const ctx = (await r.json()) as MockReviewContext;
        setMockReview(ctx);
        return ctx;
      } catch (e) {
        console.error('[mock-review] context fetch failed — session continues without it:', e);
        return undefined;
      }
    },
    // M1c Task 5 (fix round 3) — embedToken added: the fetch above reads it
    // (line ~471) but the dep array omitted it. Harmless today (embedToken
    // is mount-stable — parsed once from the URL query param, see
    // `EmbedSessionInner`'s props), fixed for correctness anyway.
    [config.mock_attempt_id, config.student_id, config.mock_item_ids, embedToken],
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
    // A page load is not a session (portal-00fa1bb7 / -5bc0fc1e / -c3007206).
    // The session-usage upsert runs on mount, so browsing the partner's lesson
    // menu minted one abandoned row per click — indistinguishable from a real
    // failed start. sessionNotYetEngaged() latches on WHICHEVER of start_tap,
    // evelyn:session-started, or transcript growth past the resume baseline
    // fires first (see
    // sessionEngagedAtRef above) — a tap that never became a session must
    // still get its row and its telemetry, and so must a session resumed or
    // engaged through a path that never taps or dispatches at all.
    if (sessionNotYetEngaged()) {
      return;
    }
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
      // Task 4: sendBeacon can't set headers, so the raw embed token rides in
      // the JSON body instead — the session-usage route accepts either.
      ...(embedToken ? { embedToken } : {}),
      ...(status !== 'active' ? { endedAt: now.toISOString(), status } : {}),
      // A1: token/cost telemetry + covered topics (were always 0/empty for
      // embed sessions — this is what makes Sonnet-5 cost tracking visible).
      ...brainUsageTotals(),
      ...(() => {
        if (status === 'active') return {};
        const summary = sessionHandleRef.current?.getSessionSummary?.();
        return {
          ...(summary?.topicsCovered?.length ? { topicsCovered: summary.topicsCovered } : {}),
          ...(summary?.conceptsCovered?.length ? { conceptsCovered: summary.conceptsCovered } : {}),
          ...(summary?.weakTopics?.length ? { weakTopics: summary.weakTopics } : {}),
        };
      })(),
    };
    // Snapshot the debug-event delta BEFORE building the payload, but do not
    // advance the high-water mark until the events are actually handed off.
    const newDebugEvents = debugEventsRef.current.slice(lastSavedDebugCountRef.current);
    const debugEventsHighWater = lastSavedDebugCountRef.current + newDebugEvents.length;
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
        whiteboardCommands: whiteboardCommands.map(({ cmd, capturedAt, sourceMessageIndex }) => ({
          action: cmd.action,
          data: { ...cmd, action: undefined },
          // Capture time, NOT save time (`now`): the replay reconstructs WB
          // timing from these stamps, and same-stamped arrays break it for
          // paused-and-resumed sessions (2026-07-15 replay fix).
          timestamp: capturedAt,
          // 2026-08-07: command↔message anchor, parity with /tutor. Omitted
          // (not -1) when unknown so legacy consumers see the same absence
          // shape as pre-fix rows.
          ...(typeof sourceMessageIndex === 'number' && sourceMessageIndex >= 0 ? { sourceMessageIndex } : {}),
        })),
      } : {}),
      // Delta-append allowlisted debug events. The high-water mark is NOT
      // advanced here — see commitDebugEvents() below.
      ...(newDebugEvents.length > 0 ? { debugEvents: newDebugEvents } : {}),
    };
    const body = JSON.stringify(payload);

    /** Advance the delta high-water mark. Called ONLY once the events have
     *  actually been handed off — sendBeacon returned true, or a fetch was
     *  issued with `body` (which carries them). Never on a basePayload
     *  fallback: basePayload has no debugEvents, so advancing there loses the
     *  delta forever. That used to be survivable because the fallback could
     *  fire at most once per session; visibilitychange → hidden now calls
     *  saveSession('abandoned') on EVERY tab-hide, so a long session could
     *  drop several deltas — in the round whose whole point is telemetry
     *  survival. Best-effort remains at-most-once by design: a fetch that is
     *  issued and then fails still counts as handed off. */
    const commitDebugEvents = () => { lastSavedDebugCountRef.current = debugEventsHighWater; };

    if (status === 'active') {
      fetch('/api/tutor/session-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(embedToken ? { 'x-embed-token': embedToken } : {}) },
        body,
      }).catch(() => {});
      commitDebugEvents();   // issued WITH the events
      return;
    }

    if (status === 'abandoned') {
      // sendBeacon returns false (and sends NOTHING) when the payload
      // exceeds the UA's in-flight quota (~64KB) — exactly how the
      // 47-minute transcript vanished on 2026-07-13. Fall back to the slim
      // summary, which always fits; the transcript itself is already in the
      // DB courtesy of the periodic flush above.
      if (navigator.sendBeacon('/api/tutor/session-usage', body)) {
        commitDebugEvents();   // accepted WITH the events
      } else {
        // Slim fallback carries NO debugEvents — leave the high-water mark
        // where it is so the delta rides the next save instead of vanishing.
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
        headers: { 'Content-Type': 'application/json', ...(embedToken ? { 'x-embed-token': embedToken } : {}) },
        body,
        keepalive: true,
      }).catch(() => {});
      commitDebugEvents();   // issued WITH the events
    } else {
      fetch('/api/tutor/session-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(embedToken ? { 'x-embed-token': embedToken } : {}) },
        body: JSON.stringify(basePayload),
        keepalive: true,
      }).catch(() => {});
      fetch('/api/tutor/session-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(embedToken ? { 'x-embed-token': embedToken } : {}) },
        body,
      }).catch(() => {});
      commitDebugEvents();   // the second fetch carries the events
    }
  }, [sessionId, subject, topic, level, sessionGoal, inputMode, voiceEngine, studentName, transcript, whiteboardCommands, embedToken]);

  // Session-quality A1 (2026-07-08): accumulate per-attempt claude-brain
  // token usage so the TutorSession record stops reading 0 tokens / $0 for
  // embed sessions (Vanshika's 25-min session recorded nothing — the usage
  // was on the brain stream's done event all along, never surfaced). Cost
  // is model-aware (registry era, 2026-08-30): the done event stamps the
  // serving model id, priced via the shared rate card; sessions predating
  // the stamp fall back to Sonnet-4.6-era rates (the old hardcoded values).
  // inputTokens excludes cache reads/creations (Anthropic semantics), so
  // totalInputTokens below reports the full billed input volume.
  const FALLBACK_PRICING = { input: 3.0, output: 15.0, cacheRead: 0.3, cacheWrite: 3.75 }; // $/1M tok
  const brainUsageRef = useRef({ inputTokens: 0, outputTokens: 0, cacheReadTokens: 0, cacheCreationTokens: 0, model: undefined as string | undefined });
  const handleBrainUsage = useCallback((u: { inputTokens: number; outputTokens: number; cacheReadTokens: number; cacheCreationTokens: number; model?: string }) => {
    const acc = brainUsageRef.current;
    acc.inputTokens += u.inputTokens;
    acc.outputTokens += u.outputTokens;
    acc.cacheReadTokens += u.cacheReadTokens;
    acc.cacheCreationTokens += u.cacheCreationTokens;
    if (u.model) acc.model = u.model;
  }, []);
  const brainUsageTotals = useCallback(() => {
    const acc = brainUsageRef.current;
    const r = lookupModelRate(acc.model);
    const cost =
      (acc.inputTokens / 1_000_000) * (r?.input ?? FALLBACK_PRICING.input) +
      (acc.outputTokens / 1_000_000) * (r?.output ?? FALLBACK_PRICING.output) +
      (acc.cacheReadTokens / 1_000_000) * (r ? (r.cacheRead ?? r.input * 0.1) : FALLBACK_PRICING.cacheRead) +
      (acc.cacheCreationTokens / 1_000_000) * (r ? (r.cacheWrite1h ?? 0) : FALLBACK_PRICING.cacheWrite);
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

    // A page load is not a session (portal-00fa1bb7 / -5bc0fc1e / -c3007206).
    // lessonPlanId (config.curriculum_module) can be set at mount, so a plan
    // load — and this checkpoint — used to fire before any engagement signal,
    // independently of saveSession's gate. Same latch (sessionNotYetEngaged,
    // see sessionEngagedAtRef above), same reasoning: hold the write until
    // the session actually engages (tap, start, resume, or transcript); the
    // postMessage above still tells the parent frame the plan loaded, which
    // is not a DB write.
    if (sessionNotYetEngaged()) {
      return;
    }

    // Identity fields included so this upsert inserts validly if it lands
    // before the first full save (required-field validation on insert).
    fetch('/api/tutor/session-usage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(embedToken ? { 'x-embed-token': embedToken } : {}) },
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
  }, [sessionId, subject, topic, level, sessionGoal, inputMode, voiceEngine, studentName, embedToken]);

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
      // Fix-round-1 (portal-00fa1bb7 etc.): a second signal that can latch
      // sessionEngagedAtRef — first-writer-wins, matching the addDebugEvent
      // setter above. Covers gesture/typed-first-message starts (typed
      // message, agenda pick), which never emit start_tap. NOT the resume
      // path: TutorSession seeds sessionStartedDispatchedRef to true
      // whenever resumeState is set, so this event is deliberately
      // suppressed on every resumed mount — resumeContinue() now emits
      // start_tap directly instead (fix-round-2), and a resume-await
      // toolbar action or restored try-yourself card that bypasses BOTH of
      // those still latches on the transcript backstop (fix-round-3, effect
      // further below — measured against the resume baseline, not zero,
      // since a resumed mount seeds the restored transcript with no
      // gesture).
      if (sessionEngagedAtRef.current === null) {
        sessionEngagedAtRef.current = Date.now();
      }
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

  // Third latch, and the only one that is not an enumeration (fix-round-3,
  // portal-00fa1bb7 / -5bc0fc1e / -c3007206). A session is one where the
  // tutor actually did something, and every path that costs money — mic
  // tap, typed first message, agenda pick, "Continue lesson", the student
  // tools cluster during a resume-await window, a restored try-yourself
  // card — ends in a brain turn, which produces transcript. Latching on
  // that closes every present and future entry point without naming any of
  // them. Three earlier rounds each closed one named path and found
  // another.
  //
  // Fix-round-4 — measured against a BASELINE, not against zero. A resume
  // DOES restore transcript, contrary to what this comment claimed through
  // round 3: VoiceTutorRealtime's resume-seed effect (the one-time
  // `resumeContentSeededRef` effect) runs at MOUNT, with no user gesture,
  // and does `onTranscriptUpdate([...resumeState.transcript])` — wired
  // through TutorSession's pass-through handleVoiceTranscriptUpdate to this
  // page's setTranscript. So latching on `> 0` made merely OPENING a
  // resumable session engage the gate. The row isn't newly minted (a resume
  // reuses config.session_id), but the preview-and-close then overwrote the
  // real prior session's duration/endedAt/status with an 'abandoned' save
  // timed from this mount — reopening the same hole from the other side: a
  // false POSITIVE, where rounds 1-3 were fighting false negatives.
  //
  // The baseline is exactly what the seed will write, and it is race-free:
  // the first render of <TutorSession> is gated on `resumeReady` (see the
  // early return below), and the checkpoint effect calls setResumeState
  // before setResumeReady(true) in the same continuation, so resumeState is
  // final before VTR — and therefore its seed — can mount. setResumeState
  // has exactly one call site, so it never moves afterwards.
  //   pure load of a resumable session → length === baseline  → no latch
  //   any live turn (fresh or resumed) → length  >  baseline  → latch
  //   fresh session                    → baseline 0, first turn latches
  const resumedTranscriptBaseline = resumeState?.transcript.length ?? 0;
  useEffect(() => {
    if (transcript.length > resumedTranscriptBaseline && sessionEngagedAtRef.current === null) {
      sessionEngagedAtRef.current = Date.now();
    }
  }, [transcript.length, resumedTranscriptBaseline]);

  // Save as abandoned on page unload.
  // beforeunload alone is not enough: this page runs in an IFRAME on the
  // partner's site, where it is the least reliably delivered unload event.
  // pagehide fires on bfcache navigation and iframe teardown; a
  // visibilitychange to 'hidden' is the only signal on mobile tab-kill.
  // All three funnel into the same idempotent saveSession('abandoned'):
  // lastSavedDebugCountRef advances synchronously once the events are handed
  // off (so a second call's debug-event delta is empty; it deliberately does
  // NOT advance when the oversized-body fallback drops them, which is why a
  // per-tab-hide 'abandoned' save can no longer lose a delta) and
  // transcript/whiteboardCommands are $set to the client's current full array
  // on the server, not $push — replaying the same array twice is a no-op, not
  // a duplicate.
  useEffect(() => {
    if (sessionEnded) return;
    const handleUnload = () => saveSession('abandoned');
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') saveSession('abandoned');
    };
    window.addEventListener('beforeunload', handleUnload);
    if (TUTOR_TELEMETRY_SURVIVAL) {
      window.addEventListener('pagehide', handleUnload);
      document.addEventListener('visibilitychange', handleVisibility);
    }
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      window.removeEventListener('pagehide', handleUnload);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
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

  // Early-window flush (portal-00fa1bb7): the first debug events arrive
  // within ~2s of the student's first start tap, and a dead-start page is
  // gone well before the 30s tick, so without this every dead start
  // persists nothing at all. Measured from sessionEngagedAtRef — latched on
  // WHICHEVER of start_tap (in addDebugEvent), evelyn:session-started (in
  // the onStarted listener), or transcript growth past the resume baseline
  // (the effect above) fires first — NOT from mount: a load with none of
  // the three is
  // plain navigation and should mint no save; a tap that never became a
  // session is exactly the dead-start case this exists to capture, so it
  // must flush. The first two fire earlier than the transcript backstop, so
  // most sessions still open this window at the true engagement moment.
  useEffect(() => {
    if (!TUTOR_TELEMETRY_SURVIVAL || sessionEnded) return;
    const t = setInterval(() => {
      const tapAt = sessionEngagedAtRef.current;
      if (tapAt === null) return; // no tap yet — nothing to flush early
      if (shouldFlushEarly({
        eventCount: debugEventsRef.current.length,
        lastFlushedCount: lastSavedDebugCountRef.current,
        msSinceMount: Date.now() - tapAt,
      })) {
        saveSessionRef.current('active');
      }
    }, 2_000);
    return () => clearInterval(t);
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
        embedToken={embedToken}
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
        cartesiaVoiceSpeed={cartesiaVoiceSpeed}
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
          // 2026-08-07 parity fix: stamp the nearest tutor transcript index at
          // emission time, same convention as /tutor — embed sessions saved
          // whiteboardCommands with NO sourceMessageIndex, so replays/PDFs
          // lost the command↔message anchor (embed-1786076855391: 12/12
          // commands unanchored). Resume-seed batches keep their ORIGINAL
          // stamp+index (meta.seedStamps), mirroring /tutor's reader.
          const lastTutorIdx = (() => {
            for (let i = transcript.length - 1; i >= 0; i--) {
              if (transcript[i].role === 'tutor') return i;
            }
            return -1;
          })();
          setWhiteboardCommands((prev) => [...prev, ...cmds.map((cmd, i) => {
            const seed = meta?.seedStamps?.[i];
            return {
              cmd,
              capturedAt: seed?.timestamp || now,
              sourceMessageIndex: typeof seed?.sourceMessageIndex === 'number' ? seed.sourceMessageIndex : lastTutorIdx,
            };
          })]);
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
