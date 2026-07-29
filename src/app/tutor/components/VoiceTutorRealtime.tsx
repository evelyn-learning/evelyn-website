'use client';

/**
 * Voice Tutor Realtime Component
 *
 * Uses OpenAI's Realtime API for low-latency voice conversations.
 * This replaces the separate STT -> Claude -> TTS pipeline with
 * a single real-time WebSocket connection to OpenAI.
 */

import { useState, useCallback, useEffect, useMemo, useRef, type FormEvent, type ReactNode } from 'react';
import { Mic, MicOff, Volume2, Loader2, AlertCircle, Square, Wifi, WifiOff, LogOut, Pause, Play, Send, Check } from 'lucide-react';
import { useOpenAIRealtime, OpenAIVoice, RealtimeState, type RealtimeUsage, type WhiteboardCommandResult } from '../hooks/useOpenAIRealtime';
import { usePerceptionWS, type PerceptionState, type PerceptionTranscript, type PerceptionSpeechEvent } from '../hooks/usePerceptionWS';
import { useCartesiaInkWS } from '../hooks/useCartesiaInkWS';
import {
  classifyHeuristic,
  type RecentTtsScript,
  type ProductionStateForClassifier,
  type PerceptionVerdict,
} from '@/lib/tutor/voice/perception-classifier';
import { pushTtsScript, applyPlaybackStamp } from '@/lib/tutor/voice/tts-script-buffer';
import { decideStage2TimeoutRestore, STAGE2_NO_VERDICT_RESTORE_MS } from '@/lib/tutor/voice/stage2-restore';
import { mapFunctionCallToCommand, WHITEBOARD_TOOLS, inkNotesEnabled } from '../hooks/toolDefinitions';
import { stripWbEmphasisText } from '@/lib/tutor/whiteboard/wb-emphasis-strip';
import { shouldClientRequestRepair } from '@/lib/tutor/voice/rule8-client';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { buildSystemPrompt, buildOpenerClause, getInitialGreetingPrompt, STALE_CHECKPOINT_REORIENT_CLAUSE, type SystemPromptContext } from '@/lib/tutor/ai/system-prompt-builder';
import { renderTeacherIntroDirective, renderTeacherStyleReminder, CATCHPHRASE_TURN_INTERVAL, type TeacherPersonaWire } from '@/lib/tutor/ai/teacher-persona';
import {
  resolveOpeningBehavior,
  assembleOpeningInput,
  detectEntryMode,
  deriveResumeSignal,
  shouldIntroduceTeacher,
  shouldRetireOpeningDirective,
  type OpeningSignals,
  type SessionMode,
} from '@/lib/tutor/ai/opening-behavior';
import {
  shouldEmitOpenerFallback,
  buildOpenerFallbackCommand,
} from '@/lib/tutor/ai/opener-fallback';
import { renderTransientContextBlock, type LastOpenerRecord } from '@/lib/tutor/student-profile/transient-context';
import type { SocialThread, ProgressDigest } from '@evelyn/portal-contract/v1';
import {
  resolveCompletionOutcome,
  shouldFireRecapMilestone,
} from '@/lib/tutor/ai/completion-gate';
import { filterToolsForSubject, resolveToolSubjects } from '@/lib/tutor/ai/tool-subject-taxonomy';
import { useStudentPreferences } from '@/hooks/useStudentPreferences';
import { buildLessonPlanContext, resolveAdvanceTarget, getSegmentTruth } from '@/lib/tutor/lesson-plan/context';
import { getSegment, type LessonPlan } from '@/lib/tutor/lesson-plan/types';
import { buildWhiteboardSummary } from '@/lib/tutor/whiteboard/summary';
import { getCommandTypeLabel } from '@/app/tutor/components/whiteboard/WhiteboardCanvas';
import { LessonPlanProgress } from './LessonPlanProgress';
import { loadModuleByParams } from '@/lib/knowledge/registry';
import { validateGeometryCommand, type GeometryCommand } from '@/lib/tutor/whiteboard/geometry-validator';
import { validateConicGraph } from '@/lib/tutor/whiteboard/conic-validator';
import { validateIntersectionPoints } from '@/lib/tutor/whiteboard/intersection-validator';
import { validateGraphLinearConsistency, validateFunctionGraphVars, validateFunctionValuePoints, validateFeaturePoints } from '@/lib/tutor/whiteboard/graph-consistency-validator';
import { validateSecantTangentGraph } from '@/lib/tutor/whiteboard/secant-tangent-validator';
import {
  anchorWordIndex,
  extractAnchorKeywords,
  sentenceIntroducesAnchor,
  type AnchorKeywords,
} from '@/lib/tutor/whiteboard/board-anchor-assist';
import { rewriteForTTS } from '@/lib/tutor/voice/tts-pronunciation';
import { setDrawOnPaceHint } from './whiteboard/useDrawOn';
import type { SpokenProgress } from '@/lib/tutor/voice/caption-sync';
import { clauseTailFromFraction } from '@/lib/tutor/voice/resume-from-cut';
import { checkArithmeticClaims } from '@/lib/tutor/voice/arithmetic-claim-check';
import { createTurnLatencyLedger, formatTurnLatency, type TurnLatencyLedger } from '@/lib/tutor/voice/turn-latency';
import { shouldSpeakAck, pickAck, type AckInput } from '@/lib/tutor/voice/ack-layer';
import { classifyCover, pickCoverPhrase, pickLivenessReply, COVER_FIRE_MS, createEscalationState, decideEscalation, TURN_GIVE_UP_MS, createNoiseNagState, recordNoiseDrop, NOISE_NAG_LINE, createWarmupState, decideWarmupAction, type CoverVerdict, type WarmupState } from '@/lib/tutor/voice/cover-layer';
import { endsMidThought, mergeHeldTranscript, HOLD_MS as INCOMPLETE_HOLD_MS } from '@/lib/tutor/voice/utterance-hold';
import { CancelStormGovernor } from '@/lib/tutor/voice/cancel-storm';
import { DispatchDeduper } from '@/lib/tutor/voice/dispatch-dedupe';
import { selectDemoStopPayload } from '@/lib/tutor/voice/demo-stop-mode';
import { derivePracticeMode } from '@/lib/tutor/voice/practice-mode';
import { DEFAULT_PACE_BIAS, resolvePaceBiasOnLoad } from '@/lib/tutor/voice/pace-preference';
import {
  extractDeclarations,
  extractIntegrand,
  extractFinalAnswerClaim,
  normalizeRenamedFunction,
  computeGreetingGuard,
  isRejection,
  isWalkThroughRequest,
  isTryAloneRequest,
  isNewProblemRequest,
  looksLikeComputedAnswer,
  extractMathClaims,
  spokenToRoughLatex,
  type DeclaredFunction,
} from '@/lib/tutor/validation/continuity';
import {
  validateGenotypeAssertion,
  extractReceiveClaim,
  validateReceiveClaim,
  repairPunnettHeaders,
  looksLikePunnett,
} from '@/lib/tutor/validation/biology';
import type { SessionGoal, TranscriptEntry } from '@/lib/tutor/types';
import type { MockReviewContext, MockReviewAgendaItem, MockReviewDrawerRow } from '@/lib/tutor/mock-exam/review-focus';
import { buildMockReviewAgenda, buildMockReviewDrawer, buildMockReviewCorrectRows } from '@/lib/tutor/mock-exam/review-focus';
import type { WhiteboardCommand } from '@/lib/knowledge/types';
import type { FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';
import { buildManifestForCommand } from '@/lib/tutor/diagrams/manifests';
import { solveDiagram } from '@/lib/tutor/diagrams/catalog/manifest';
import { WhiteboardCatalog, buildShowSignature, extractCommandTitle, computeAnchorKey, isPrimaryFigure, computeFigureCategory } from '@/lib/tutor/whiteboard/catalog';
import { shouldScrollToDedupedItem } from '@/lib/tutor/whiteboard/dedup-scroll';
import type { WhiteboardBatchMeta } from '@/lib/tutor/whiteboard/resume-seed';
import { createReactionState, recordReactionEvent, NOISE_INTERRUPTION_REACTION } from '@/lib/tutor/voice/tutor-reactions';
import { decideKillKeep, type KillRenderDesc } from '@/lib/tutor/whiteboard/kill-keep';
import { decidePageForBatch, isTeachingRender as isTeachingRenderAction, weightOfAction, STALE_TURNS } from '@/lib/tutor/whiteboard/page-grouping';
import { isCurveLessConic, findPriorConic, carryForwardConicCurve } from '@/lib/tutor/whiteboard/conic-construction';
import { flushableCount } from '@/lib/tutor/whiteboard/render-sync';
import type { InteractionType } from '@/hooks/useDemoTracking';

import {
  TUTOR_BRAIN_FAST_OPENER,
  TUTOR_ACK_LAYER,
  TUTOR_COVER_V2,
  TUTOR_INCOMPLETE_HOLD,
  TUTOR_MANUAL_MIC,
  TUTOR_SKIP_DETERMINISTIC,
  TUTOR_RENDER_SYNC,
  TUTOR_RENDER_WORD_ANCHOR,
  TUTOR_RENDER_FALLBACK_CARD,
  TUTOR_CLIENT_RULE8_REPAIR,
  TUTOR_STUDENT_MARKS,
  TUTOR_BOARD_ANCHOR_ASSIST,
  TUTOR_RESUME_FROM_CLAUSE,
  TUTOR_PEDAGOGY_OPENER,
  TUTOR_VALIDATE_BEFORE_SPEAK,
  TUTOR_KEEP_VALIDATED_ON_KILL,
  TUTOR_WOLFRAM_MATH_CHECK,
  TUTOR_STUDENT_PROBLEM_GROUNDING,
  TUTOR_NOISE_NAG,
  TUTOR_CONTENT_VARIETY,
  TUTOR_STT_ENGINE_INK2,
  TOPIC_NOTES_WARMUP_SEGMENTS,
  TOPIC_NOTES_RATE_LIMITS,
  BOARD_RENDER_META_ACTIONS,
  SKETCH_TIMEOUT_MS,
  RENDER_SYNC_STALL_MS,
  RENDER_SYNC_FRONT_LOAD_MAX_ANCHOR,
  VALIDATE_BEFORE_SPEAK_CAP_MS,
  VERDICT_HOLD_CAP_MS,
  TUTOR_TURN_CAP,
  TURN_CAP_SOFT_SENTENCES,
  TURN_CAP_HARD_SENTENCES,
  TURN_CAP_WORDS,
  TUTOR_BOARD_ANCHOR_NET,
  BARGEIN_SUSTAIN_MS,
  OPENER_BARGEIN_SUSTAIN_MS,
  SELF_ECHO_CANCEL_IMMUNITY_MS,
  BARGEIN_ENERGY_THRESHOLD,
  BARGEIN_ENERGY_FLOOR,
  BARGEIN_ECHO_MARGIN,
  BARGEIN_BASELINE_LOOKBACK_MS,
  BARGEIN_GATE_POLL_MS,
  BARGEIN_GATE_MAX_MS,
} from '@/lib/tutor/orchestrator/flags';
import {
  shouldFireBargeInKill,
  shouldFireDeferredBargeInKill,
  resolveBargeInEnergyThreshold,
} from '@/lib/tutor/voice/bargein-gate';
import { isSubstantiveAsk, isBoardContentTool, buildBoardAnchorNote } from '@/lib/tutor/voice/question-anchor';
import { lastQuestionSentence } from '@/lib/tutor/question-gist-text';
import { decideFallbackCard } from '@/lib/tutor/whiteboard/process-tool-call';
import { shouldKillNonAnswerPraise, nonAnswerPraiseFeedback } from '@/lib/tutor/voice/nonanswer-praise';
import {
  WHITEBOARD_INTENT_PATTERNS,
  MATH_CONTENT_PATTERN,
  rendersStudentProblem,
  detectStudentBroughtProblem,
  isSafeOpener,
  isVerdictOpener,
  judgeKillContentWords,
  isJudgeKillRestatement,
  extractSentence1Normalized,
  deepEqualParams,
  isMuteMeCommand,
  latexProseFiller,
  duplicateFunctionDef,
} from '@/lib/tutor/orchestrator/text-heuristics';
import { rasterizeGestureStrokes, sanitizeInkOcrText } from '@/lib/tutor/orchestrator/ink-capture';
import { formatLessonPlanForRealtime } from '@/lib/tutor/orchestrator/format-lesson-plan';
import { inferAdvanceFromSegmentCard } from '@/lib/tutor/orchestrator/segment-advance';
import type { RealtimeHandle, TutorMilestone, TutorResumeState } from '@/lib/tutor/orchestrator/types';

export type { RealtimeHandle, TutorMilestone, TutorResumeState } from '@/lib/tutor/orchestrator/types';
export { isMuteMeCommand } from '@/lib/tutor/orchestrator/text-heuristics';

async function dispatchTopicNotesOverlay(
  studentId: string | undefined,
  baselineId: string,
  sessionId: string,
  bucket: 'theory' | 'methods' | 'pointers',
  input: Record<string, unknown>,
): Promise<void> {
  if (!studentId) return; // demo flow without studentId — drop silently
  try {
    const res = await fetch(
      `/api/tutor/topic-notes/${encodeURIComponent(studentId)}/${encodeURIComponent(baselineId)}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bucket, sessionId, input }),
      },
    );
    if (!res.ok) {
      console.warn('[VoiceTutorRealtime] topic-notes PATCH failed:', res.status);
      return;
    }
    const result = await res.json();
    console.log(
      `[VoiceTutorRealtime] topic-notes ${bucket} ${result.status}: overlayId=${result.overlay?.overlayId ?? 'none'}`,
    );
  } catch (err) {
    console.warn('[VoiceTutorRealtime] topic-notes PATCH error:', err);
  }
}

// Words that Whisper commonly misrecognizes as inappropriate
import { filterTranscriptText, classifyTranscript, wrapUncertainTranscript, isContextLossGreeting } from '@/lib/tutor/voice/transcript-filters';
import { checkTopicShift, createTopicShiftState, type TopicShiftDetectorState } from '@/lib/tutor/voice/topic-shift-detector';
import { detectStudentIntent, isContinuationRequest } from '@/lib/tutor/voice/student-intent';
import { detectTutorSameContext, decidePageStrip } from '@/lib/tutor/voice/tutor-context-detector';
import { validateCircuit } from '@/lib/tutor/diagrams/circuit-validator';
import { validateCollision } from '@/lib/tutor/diagrams/collision-validator';
import { validateEnergyBars } from '@/lib/tutor/diagrams/energy-bars-validator';
import { validateSpringMass } from '@/lib/tutor/diagrams/spring-mass-validator';
import { validateReactionCoordinate } from '@/lib/tutor/diagrams/reaction-coordinate-validator';
import { validateManipulative } from '@/lib/tutor/diagrams/manipulative-validator';
import { validatePedigree } from '@/lib/tutor/diagrams/pedigree-validator';
import { validateFlowchart } from '@/lib/tutor/diagrams/flowchart-validator';
import { getGradeProfile } from '@/lib/tutor/pedagogy/grade-profile';
import { CaptionSyncTracker } from '@/lib/tutor/voice/caption-sync';
import { showsDockMuteButton } from '@/app/tutor/components/session/prestart-affordances';
import {
  resolveStudentMark,
  formatStudentMarks,
  MAX_PENDING_MARKS,
  type StudentMarkEvent,
  type ResolvedMark,
} from '@/lib/tutor/whiteboard/student-marks';

const isBoardRenderCommand = (c: unknown): boolean => {
  const a = String((c as { action?: string })?.action ?? '');
  if (BOARD_RENDER_META_ACTIONS.has(a)) return false;
  return a.startsWith('show') || ['scribble', 'link', 'handwrite', 'tutorHandwrite', 'drawVector', 'annotate', 'highlight'].includes(a);
};
// A show_sketch REQUEST = the doodle hasn't been generated yet (no primitives).
// Once the doodler resolves, primitives are mutated on and it's a normal render.
const isSketchRequestCommand = (c: unknown): boolean => {
  const cmd = c as { action?: string; primitives?: unknown[] };
  return cmd?.action === 'showSketch' && !(Array.isArray(cmd.primitives) && cmd.primitives.length > 0);
};
interface VoiceTutorRealtimeProps {
  subject: string;
  topic: string;
  level: string;
  studentName?: string;
  sessionId?: string;
  // Wallclock ms for session.startedAt — passed through to the audio recorder
  // so both .pcm16 tracks align with the chat timeline in the replay UI.
  sessionStartedAtMs?: number;
  sessionGoal: SessionGoal;
  /** Task WS3: mock-review context for a mock-review session. When present the
   *  brain receives a `<mock_review>` block every turn (missed items + answer
   *  key + review directives). Absent ⇒ block omitted, session unchanged. */
  mockReview?: MockReviewContext;
  /** Optional lesson plan id. When set, the brain runs in plan-driven
   *  mode: each turn carries lessonPlanContext (current segment + plan
   *  metadata) and segment transitions are managed via advance_lesson /
   *  mark_segment_complete tools. Blank = free-conversation mode. */
  lessonPlanId?: string;
  /** Optional student id. When set, the brain receives a
   *  <student_profile> block on every turn (mastery, gaps, recent
   *  sessions) and end-of-session deltas are committed. Demo flows
   *  without auth omit this — the session is ephemeral. */
  studentId?: string;
  /** Task D1b (pedagogy opener) — TRANSIENT session-scoped social threads
   *  from the portal's StudentContext (embed carrier). Read once at mount,
   *  rendered into a <student_context_transient> block appended to the
   *  per-turn studentProfileBlock. NEVER persisted engine-side. Only
   *  consumed when TUTOR_PEDAGOGY_OPENER is on; the main /tutor page has no
   *  source for these today and simply omits them. */
  socialMemory?: SocialThread[];
  /** Task D1b — portal-computed enrollment/progress digest (same carrier,
   *  same transient semantics as `socialMemory`). */
  progressDigest?: ProgressDigest;
  /** Opener-recency (part A) — the PREVIOUS session's opener record (same
   *  transient carrier/semantics as socialMemory/progressDigest). Rendered
   *  into the <student_context_transient> block as a do-NOT-repeat
   *  directive so this session's opener varies in kind AND content. Only
   *  consumed when TUTOR_PEDAGOGY_OPENER is on. */
  lastOpener?: LastOpenerRecord;
  /** Prerequisite-readiness summary from the course-start diagnostic (prose;
   *  same transient carrier/semantics as socialMemory/progressDigest/
   *  lastOpener). Rendered into the <student_context_transient> block as a
   *  prerequisite-readiness line so the brain scaffolds shaky prerequisites.
   *  NEVER persisted engine-side. Only consumed when TUTOR_PEDAGOGY_OPENER is
   *  on. */
  readinessNote?: string;
  /** Opener-recency (part A) — fires at most ONCE per session, when this
   *  session's OWN opener record is captured (the opener turn's finalized
   *  tutor text + the resolved opener kind). Dev/e2e consumer today (the
   *  /tutor page stashes it for __tutorTestState); the production
   *  outbound loop (part B) will consume the same callback later. Only
   *  ever fired when TUTOR_PEDAGOGY_OPENER is on. */
  onOpenerRecord?: (record: LastOpenerRecord) => void;
  /** Task E1 (pedagogy opener) — the embed's `is_trial` signal (academy
   *  trial flow). Feeds the OpeningSignals construction in buildInstructions
   *  (activates the demo-trial journey B6 already resolves) AND selects the
   *  milestone-mode `<demo_stop>` directive instead of the time-budget one.
   *  Only consumed when TUTOR_PEDAGOGY_OPENER is on. Default false — the
   *  main /tutor page has no trial concept and omits it. */
  isTrial?: boolean;
  /** Explicit session-target kind for the opening-behavior resolution
   *  (OpeningSignals.targetKind). When omitted, derived exactly as before:
   *  lessonPlanId present ⇒ 'lessonNode', else 'freestyle'. 'diagnostic'
   *  makes resolveOpeningBehavior's rule 1 fire (opener/calibration no-op)
   *  and ALSO keeps the completion gate + demo-stop machinery off an
   *  assessment session. Sources: the embed's `target_kind` token field
   *  (production — the academy's diagnostic embeds) and the dev-only
   *  __tutorTestStart hook (pedagogy harness). Only consumed when
   *  TUTOR_PEDAGOGY_OPENER is on. */
  targetKind?: SessionMode;
  /** Stale-checkpoint marker (OpeningSignals.resume.checkpointStale): the
   *  student HAD a lesson checkpoint but it fell outside RESUME_MAX_AGE_MS,
   *  so no `resumeState` was seeded and the session cold-starts. Activates
   *  the resume-stale journey (light re-orient, no full calibration).
   *  Mutually exclusive with `resumeState` at every real source
   *  (portal/resume.ts's resolveResumeOutcome); if both ever arrive, the
   *  seeded resumeState wins (see deriveResumeSignal). Only consumed when
   *  TUTOR_PEDAGOGY_OPENER is on. Default false. */
  checkpointStale?: boolean;
  /** Teacher persona — the session is taught AS this specific teacher.
   *  Sources: the /tutor demo page's "Your teacher" picker (DEMO_TEACHERS)
   *  and the embed's `teacher` token field (the academy sends it for
   *  enrolled sessions). Feeds (a) buildSystemPrompt's session-static
   *  <teacher_identity> block and (b) a one-sentence introduce-yourself
   *  directive prepended to the per-turn opening directive. Only consumed
   *  when TUTOR_PEDAGOGY_OPENER is on; absent ⇒ byte-identical prompts. */
  teacherPersona?: TeacherPersonaWire;
  voice?: OpenAIVoice;
  onTranscriptUpdate: (entries: TranscriptEntry[]) => void;
  /** Live turn batches carry no meta. The resume-seed replay (mount-time
   *  rehydration of a restored board) passes `{ resumeSeed: true }` so parents
   *  can accept it exactly once per buffer lifetime — a VTR remount re-fires
   *  the seed, and an unguarded parent append duplicates the whole board
   *  (see src/lib/tutor/whiteboard/resume-seed.ts). */
  onWhiteboardCommand: (commands: WhiteboardCommand[], meta?: WhiteboardBatchMeta) => void;
  onStateChange?: (state: RealtimeState) => void;
  onError?: (error: Error) => void;
  /** Voice transcription status from OpenAI Realtime. 'failed' surfaces
   *  rate-limit / auth / malformed-audio errors so the parent can prompt
   *  the student to type instead. 'completed' fires on every successful
   *  transcription so the parent can dismiss any "voice trouble" banner. */
  onTranscriptionStatus?: (status: 'failed' | 'completed', errorType?: string) => void;
  /** End the session via the graceful path. `reason` is set to 'time_limit'
   *  only when the demo hard-stop timer fired (so the embed can tag the
   *  session_ended postMessage); the student's End button passes nothing. */
  onEndSession?: (reason?: 'time_limit') => void;
  onTrackInteraction?: (type: InteractionType, content?: string, metadata?: Record<string, unknown>, role?: 'student' | 'tutor') => void;
  onUsageUpdate?: (usage: RealtimeUsage) => void;
  /** Session-quality A1 (2026-07-08): per-attempt claude-brain token usage.
   *  The brain stream's `done` event carried usage all along but it was only
   *  debug-logged — never surfaced — so brain-mode sessions (all embeds)
   *  recorded totalInputTokens=0 / estimatedCost=$0. Fires once per stream
   *  attempt (kill+retry attempts each burn real tokens, so each reports).
   *  Anthropic semantics: inputTokens EXCLUDES cache reads/creations —
   *  consumers price the four buckets separately. */
  onBrainUsage?: (usage: { inputTokens: number; outputTokens: number; cacheReadTokens: number; cacheCreationTokens: number }) => void;
  /** Fires once per pedagogical milestone as the orchestrator genuinely
   *  crosses it (a real concept completion / try-yourself success / reaching
   *  recap — NOT segment skips). Additive + optional; absent ⇒ no-op. The
   *  consumer tracks the furthest reached. See `TutorMilestone`. */
  onMilestone?: (milestone: TutorMilestone) => void;
  onDebugEvent?: (type: string, message: string, data?: Record<string, unknown>) => void;
  handleRef?: React.MutableRefObject<RealtimeHandle | null>;
  validateToolCalls?: boolean;
  /**
   * When true, the Realtime API is used as a thin STT+TTS relay. Every
   * student turn is routed to Claude (via /api/tutor/brain) which decides
   * what to say and which tools to call. Realtime voices the brain's text
   * verbatim; the existing structural validators / dedup / catalog flow
   * still runs on whatever tool calls the brain emits.
   *
   * Default false — the legacy "Realtime authors everything" path.
   */
  claudeBrainMode?: boolean;
  /**
   * When true, the GPT-Realtime-2 native engine is used: the Realtime
   * session connects to gpt-realtime-2, receives the full tutor system
   * prompt + all whiteboard tools directly, and authors every turn
   * itself (no Claude relay). Lesson plans are injected straight into
   * the RT-2 session. Mutually exclusive with claudeBrainMode.
   *
   * Default false.
   */
  useRealtimeV2?: boolean;
  /** TTS provider for relay-mode voicing of the brain's text.
   *  - 'realtime' (default): Realtime out-of-band response. Highest quality, expensive.
   *  - 'openai-mini': gpt-4o-mini-tts via /api/tutor/tts-openai. ~10× cheaper.
   *  - 'cartesia': Cartesia sonic-3.5 via /api/tutor/tts-cartesia. Same
   *    HTTP-TTS flow as 'openai-mini' (Cartesia migration Phase 2, Task 3).
   *  - 'silent': test mode — no TTS API calls; zero-filled buffers with
   *    plausible durations keep render-sync/drain timing intact
   *    (Crimsora v2 Phase 2E). Select via ?tts=silent or
   *    NEXT_PUBLIC_TUTOR_TTS_ENGINE=silent. */
  ttsProvider?: 'realtime' | 'openai-mini' | 'cartesia' | 'silent';
  /** Cartesia voice id for the persona-mapped teacher voice (Task 3).
   *  Only consumed when ttsProvider === 'cartesia'; resolved by the caller
   *  via resolveCartesiaVoice() (src/lib/tutor/voice/cartesia-voice-registry.ts). */
  cartesiaVoiceId?: string;
  /** Fires whenever the active lesson plan or current segment changes.
   *  Lets the parent render a progress strip above the whiteboard. */
  onLessonPlanProgress?: (info: {
    plan: import('@/lib/tutor/lesson-plan/types').LessonPlan | null;
    currentSegmentId: string;
  }) => void;
  /** Fires whenever the tutor enters / leaves a "composing" state — the
   *  brain is fetching a response, warm-up is in progress, or TTS is
   *  rendering. Parent can use this to drive a typing indicator. */
  onTutorBusy?: (busy: boolean) => void;
  /** Coarse voice-engine state for the new SessionStage "tutor presence"
   *  orb (Direction 4). Mirrors the underlying RealtimeState machine plus the
   *  perception "being heard" states: speaking (TTS) · thinking (composing) ·
   *  processing (student stopped, transcribing — "got that, one sec") · hearing
   *  (student speaking now) · listening (mic open, idle) · muted · error · idle.
   *  Fires on every transition. */
  onVoiceStateChange?: (state: 'idle' | 'listening' | 'hearing' | 'processing' | 'thinking' | 'speaking' | 'muted' | 'manual-held' | 'error') => void;
  /** Fires once, the first time the student clicks the mic to start the voice
   *  session (the "Click to start" tap). Lets the session timer begin counting
   *  from the actual start rather than from page mount. */
  onSessionStarted?: () => void;
  /** When set, the runtime boots in RESUME mode: it seeds transcript +
   *  whiteboard + segment position from this prior-session snapshot and
   *  continues the same conversation (no fresh lesson kickoff, mic stays
   *  closed until the student acts). Null/undefined = normal fresh start. */
  resumeState?: TutorResumeState | null;
  /** Fires when the "awaiting the resume first interaction" state flips: true
   *  once a resume snapshot is seeded and the session hasn't started, false the
   *  moment the student continues. The host renders a "Continue lesson" overlay
   *  while true (its click calls handleRef.resumeContinue()). */
  onResumeAwaitingTapChange?: (awaiting: boolean) => void;
  /** R35 T-A (demo-polish): fires when the "joining" overlay should show/hide
   *  over the WHOLE stage (board + caption + dock), not just the mic button's
   *  own disabled look. True only for the very first voice-mic-click kickoff
   *  of a fresh session (NOT typed-first / agenda-pick / resume — those have
   *  their own affordances already: the student is mid-typing or tapped
   *  "Continue lesson", so a full-frame block would fight their own action).
   *  Cleared the moment the tutor's audio ACTUALLY starts playing
   *  (realtime.state === 'speaking' — the sample-accurate signal set the
   *  instant playNextAudio() calls source.start(), see useOpenAIRealtime.ts)
   *  or when the R32 T9 warmup watchdog gives up (40s) and shows the "Trouble
   *  starting" pill instead — never left true once the mic is usable again.
   *  Deliberately NOT the same signal as `isWarmingUp`: that flag flips false
   *  as soon as the first sentence's TEXT is ready to speak (realtime.state
   *  hits 'processing', or the first tutor transcript entry lands) — which is
   *  BEFORE the TTS fetch resolves and audio actually plays. That gap (TTS
   *  synthesis/network latency, not a fixed ~1.5s — it varies with sentence
   *  length and provider) is exactly the window where the mic button
   *  re-enables and a student's early speech or a stray tap gets folded into
   *  the first turn instead of being visibly "still loading". */
  onWarmupOverlayChange?: (show: boolean) => void;
  /** Live student-mic amplitude (0..1) for the "being heard" meter. ~12×/sec. */
  onMicLevel?: (level: number) => void;
  /** Transient listening hint: 'didnt-catch' when the student clearly spoke but
   *  nothing reached the brain (likely dropped); null clears it. */
  onListeningHint?: (hint: 'didnt-catch' | null) => void;
  /** Round-28b: both voice engines failed for a sentence — the host shows
   *  a transient "voice hiccup" captions pin with the unspoken text. */
  onVoiceHiccup?: (text: string) => void;
  /** Phase 3: fires whenever paceBias changes (button click OR matching
   *  verbal cue). Parent uses this to render an "ack" badge confirming
   *  the click landed and showing current bias state. */
  onPaceBiasChange?: (bias: number) => void;
  /** #7 hybrid (2026-07-17): fires whenever the standing difficulty
   *  preference changes (chip click or blob restore) so the ⋯ menu's
   *  sticky ✓ state stays in sync. */
  onDifficultyBiasChange?: (bias: number) => void;
  /** Practice meter (2026-07-17): live problem-work stats for the
   *  practice/no-plan progress display. `active` mirrors the current
   *  derived practiceMode; `presented` counts distinct problem cards
   *  shown; `solved` counts brain-affirmed genuine verifications;
   *  `streak` is the current correct streak. Fires on every change. */
  onPracticeStatsChange?: (s: { active: boolean; presented: number; solved: number; streak: number }) => void;
  /** Task W4: fires whenever the "Speak slower" TTS toggle changes (menu
   *  click OR prior-session restore). SEPARATE knob from paceBias/explain-
   *  pace above — this only affects synthesis speed, not depth/verbosity.
   *  Parent uses this to render the ✓ state on the menu item. */
  onSpeakingRateChange?: (rate: 'slow' | 'normal') => void;
  /** Task Y1: fires whenever the starter-chip practiceOverride changes
   *  (chip click OR prior-session pacing-v2 restore). Parent uses this to
   *  render the chip's active state (Humor ✓ idiom — see SessionStage's
   *  Chip). See practiceOverrideRef below + derivePracticeMode for the
   *  full precedence contract. */
  onPracticeOverrideChange?: (active: boolean) => void;
  /** R34 T4: fires whenever the per-device "Manual mic" mode changes (⋯ menu
   *  toggle OR the mount-time localStorage restore) so the ⋯ menu's Auto/
   *  Manual segmented row stays in sync. */
  onManualMicChange?: (v: boolean) => void;
  /** Mock-review pre-start agenda. Fires (on mount + whenever mockReview
   *  changes) with the tappable question list derived from the review context
   *  plus the muted "+ N more missed…" line (null when none). The parent holds
   *  it in state and passes it to SessionStage, which replaces the generic
   *  starter chips with the agenda. Empty array + null ⇒ no context (degraded
   *  mock-review or non-mock session): SessionStage keeps the generic chips. */
  onMockAgendaChange?: (
    agenda: MockReviewAgendaItem[],
    remainingLine: string | null,
    /** Mid-session Agenda drawer rows (every miss). */
    drawer: MockReviewDrawerRow[],
    /** Stable pick handler for a drawer row — see pickAgendaItem. */
    onPickAgendaItem: (itemId: string) => void,
    /** Agenda round 5: drawer rows for every CORRECT (non-miss) item, shown
     *  behind the "show correct questions too" disclosure. Same pick handler. */
    correctDrawer: MockReviewDrawerRow[],
  ) => void;
  /** Re-fetch the mock-review context, optionally PINNING extra item ids so
   *  they lead the focus list (drawer "switch to this question" path). Returns
   *  the fresh context (and also setMockReview's it in the parent). Provided by
   *  the embed page; absent ⇒ the drawer can only jump to already-focused items. */
  refetchMockReview?: (pinItemIds?: string[]) => Promise<MockReviewContext | undefined>;
  /** Render a student turn on the board + send it to the brain — the SAME
   *  pipeline the SessionStage starter chips use (TutorSession.handleStudentInput).
   *  Used by pickAgendaItem to fire the "switch to item" utterance. */
  onStudentInput?: (type: 'text' | 'drawing' | 'image', content: string) => void;
  /** Control channel for navigation/selection markers (agenda picks). Unlike
   *  onStudentInput this renders NO board card and applies no whiteboard
   *  framing — the bracketed marker is relayed verbatim to the brain and
   *  suppressed from the visible transcript. pickAgendaItem prefers this;
   *  it falls back to onStudentInput when the prop is absent. */
  onControlMessage?: (marker: string) => void;
  /** Voice Perception Q9 (2026-06-16). Fires true when a perception
   *  cancel fires (yellow-flash window opens) and false ~300ms later
   *  when the window closes. Parent uses this to render a visible
   *  "I heard you" signal on the input area + briefly disable typed
   *  input / quick-answer buttons. */
  onInterruptedChange?: (interrupted: boolean) => void;
  /** Fires before a typed student message is forwarded to the brain.
   *  When set, the parent can intercept (e.g. to detect a freestyle
   *  study-text paste and kick off plan generation). The promise's
   *  resolved value indicates whether the parent took action — when
   *  `setLessonPlanId` is non-null, the child will wait for the new
   *  lessonPlanId prop to land before forwarding the message, so the
   *  next brain call sees the generated plan. Generic by design: the
   *  child doesn't know what the parent did, only that it might have
   *  swapped the active plan. */
  onBeforeTypedSubmit?: (text: string) => Promise<{ setLessonPlanId: string | null } | void>;
  /** Fires when the brain emits propose_plan_swap. Parent is expected
   *  to resolve a new lesson plan (curated lookup → freestyle fallback,
   *  all topic-scoped server-side via /api/tutor/swap-plan) and call
   *  setSelectedLessonPlanId so the new plan loads via the existing
   *  lessonPlanId prop flow. The child has already logged the event
   *  and emitted the debug telemetry; the parent's responsibility is
   *  state + UX (chat notice, progress-strip update). */
  onProposePlanSwap?: (args: { targetSubTopic: string; reason?: string }) => Promise<void>;
  /** Fires when the brain emits confirm_plan_los in response to a
   *  picker segment. Parent calls /api/tutor/expand-plan-los which
   *  upserts the same plan id with expanded segments; the child's
   *  existing useEffect picks the changes up on the next render. */
  onConfirmPlanLos?: (args: { planId: string; pickedLoIds: string[] }) => Promise<void>;
  /** Fires whenever the set of completed segment ids grows (the brain
   *  emits mark_segment_complete). Parent uses this to drive a
   *  truthful progress strip — "completed" means actually-marked-
   *  complete, not array-position-before-current (which would falsely
   *  count skipped segments). */
  onCompletedSegmentsChange?: (ids: ReadonlyArray<string>) => void;
  /** Total session time in minutes. Drives the long-session check-in,
   *  pre-rotation prompt, and silent auto-rotation timing — each one
   *  scales to a fraction of T rather than the legacy 45/55/58
   *  hardcodes. Floors apply: rotation events are also bounded by
   *  OpenAI's ~60-min Realtime session cap, so for T>60 the rotation
   *  still fires before the cap. Defaults to 30 (demo). */
  sessionMaxMinutes?: number;
  /** Demo time-box (trial): wrap-phase threshold in whole minutes. When set
   *  AND minutesElapsed >= it, the per-turn `<demo_stop>` block switches to the
   *  graceful-wrap directive. Passed only for a real time-boxed demo (the embed
   *  computes it from the token's `wrap_at_minutes`); undefined ⇒ no wrap phase
   *  (pre-existing untimed-demo behavior). */
  sessionWrapMinutes?: number;
  /** Whether the embed token carried an EXPLICIT `max_duration_minutes` (vs the
   *  defaulted 30). Distinguishes a real time-boxed demo from an untimed one:
   *  gates trial time-mode demo-stop selection AND the hard wall-clock cap.
   *  Default false — non-embed callers and untimed embeds. */
  maxDurationExplicit?: boolean;
  /** Visual arrangement of the dock chrome. 'default' = the legacy split-pane
   *  row (connection pill · mic · state · input · mute · End). 'island' = the
   *  new SessionStage floating dock: no redundant connection pill, a HERO mic,
   *  tighter single-row layout. The SessionStage wrapper supplies the rounded
   *  background, so the island variant adds none of its own. (Flag-gated host;
   *  default keeps every legacy caller byte-identical.) */
  dockVariant?: 'default' | 'island';
  /** One-line merged bar (2026-07-14): when set, the dock renders this node
   *  (the live caption ticker, composed by TutorSession) in place of the
   *  state-text block next to the mic — [mic][caption][input][mute][end].
   *  The mic button's color/pulse still conveys the voice state. */
  captionSlot?: ReactNode;
  /** R1 dock (2026-07-14): suppress the dock's own End/Pause button — the
   *  host renders its own (header) control via handleRef.endSession, which
   *  runs the same full teardown. */
  hideEndButton?: boolean;
}

// Round-7c: how long to hold a "quiet but finite" MicSilentWarning after the
// opening turn's audio has finished before showing the banner, provided the
// student still hasn't been heard at all. See pendingMicNoticeRef.
const MIC_NOTICE_GRACE_MS = 20_000;

// Map our voice IDs to OpenAI voices
const VOICE_MAP: Record<string, OpenAIVoice> = {
  'female-1': 'shimmer',  // Warm, friendly
  'female-2': 'coral',    // Professional
  'male-1': 'echo',       // Calm
  'male-2': 'alloy',      // Energetic
};

// Coherence pass v1 (problemSimilarity, extractConstants,
// extractCoefficients) was retired 2026-04-29 in favor of A + B1:
//   Lever A — show_segment_card resolves segmentId → authored data
//             at dispatch time, so the brain can't drift on authored
//             problems (it isn't writing the statement anymore).
//   Lever B1 — judge LLM (/api/tutor/judge) checks the brain's spoken
//             text against the post-render board snapshot for any
//             ungrounded claim, and pushes a synthetic rejection on
//             drift so the existing retry loop re-prompts the brain.
// The fuzzy thresholds (0.5 / 0.8) are gone. See git history for the
// helpers if a fast-path becomes useful again.

export function VoiceTutorRealtime({
  subject,
  topic,
  level,
  studentName,
  sessionId,
  sessionStartedAtMs,
  sessionGoal,
  mockReview,
  lessonPlanId,
  studentId,
  socialMemory,
  progressDigest,
  lastOpener,
  readinessNote,
  onOpenerRecord,
  isTrial = false,
  targetKind,
  checkpointStale = false,
  teacherPersona,
  voice = 'shimmer',
  onTranscriptUpdate,
  onWhiteboardCommand,
  onStateChange,
  onError,
  onTranscriptionStatus,
  onEndSession,
  onTrackInteraction,
  onUsageUpdate,
  onBrainUsage,
  onMilestone,
  onDebugEvent,
  handleRef,
  validateToolCalls = false,
  claudeBrainMode = false,
  useRealtimeV2 = false,
  ttsProvider = 'realtime',
  cartesiaVoiceId,
  onLessonPlanProgress,
  onTutorBusy,
  onVoiceStateChange,
  onSessionStarted,
  resumeState,
  onResumeAwaitingTapChange,
  onWarmupOverlayChange,
  onMicLevel,
  onListeningHint,
  onVoiceHiccup,
  onPaceBiasChange,
  onDifficultyBiasChange,
  onPracticeStatsChange,
  onSpeakingRateChange,
  onPracticeOverrideChange,
  onManualMicChange,
  onMockAgendaChange,
  refetchMockReview,
  onStudentInput,
  onControlMessage,
  onInterruptedChange,
  onBeforeTypedSubmit,
  onProposePlanSwap,
  onConfirmPlanLos,
  onCompletedSegmentsChange,
  sessionMaxMinutes = 30,
  sessionWrapMinutes,
  maxDurationExplicit = false,
  dockVariant = 'default',
  captionSlot,
  hideEndButton = false,
}: VoiceTutorRealtimeProps) {
  const [isMicMuted, setIsMicMuted] = useState(false);
  // Sync mirror of isMicMuted for the perception onTranscript callback,
  // which needs the live value synchronously to drop transcripts that were
  // already in flight when the student muted (perception latency is 5–14s,
  // so a transcript can arrive well after the mute click).
  const isMicMutedRef = useRef(false);
  isMicMutedRef.current = isMicMuted;
  // R34 T4: per-device "Manual mic" mode — opt-in (localStorage), gated by
  // TUTOR_MANUAL_MIC. Finalized transcripts buffer instead of dispatching;
  // the student taps a ✓ send affordance to submit the combined turn.
  // Same ref-mirror convention as isMicMuted above: perceptionOnTranscript
  // needs the live value synchronously.
  const [manualMic, setManualMicState] = useState(false);
  const manualMicRef = useRef(false);
  manualMicRef.current = manualMic;
  // Buffered, not-yet-sent transcript parts. A ref (perceptionOnTranscript
  // needs synchronous push/read) mirrored by a small count in state so the
  // JSX (send-button visibility, dock hint via onVoiceStateChange) re-renders
  // when it changes.
  const manualBufferRef = useRef<string[]>([]);
  const [manualBufferCount, setManualBufferCount] = useState(0);
  // One-shot: armed when the student taps ✓ send while mid-utterance
  // (perceptionHearing true, no finalized transcript yet). Mirrors
  // submitPendingUtteranceRef's mute-to-submit pattern (see toggleMicMute) —
  // the in-flight utterance's transcript, once it finalizes, merges into the
  // buffer and dispatches immediately instead of just being buffered.
  const manualSendPendingRef = useRef(false);
  // Mount-safe localStorage read (SSR/hydration-safe: first render always
  // renders the `false` default on server + client; this effect then syncs
  // the real per-device choice once mounted — same pattern used by the
  // per-plan pacing-v2 restore below).
  useEffect(() => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      if (window.localStorage.getItem('evelyn-manual-mic') === 'on') {
        manualMicRef.current = true;
        setManualMicState(true);
        onManualMicChangeRef.current?.(true);
      }
    } catch (err) {
      console.warn('[VoiceTutorRealtime] manual-mic localStorage read failed:', err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // Transient whiteboard status — e.g. "rendering problem…" when a tool
  // call gets dropped so the student sees the system is responding without
  // having to ask "I don't see anything". Cleared on next successful
  // whiteboard command or after a short timeout.
  const [whiteboardStatus, setWhiteboardStatus] = useState<string | null>(null);
  const whiteboardStatusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Transient "audio hiccup" notice (TTS retry/skip) — see onTtsIssue below.
  const [ttsNotice, setTtsNotice] = useState<string | null>(null);
  const ttsNoticeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Round 28: student-facing mic-silent notice. MicSilentWarning was only
  // recorded as a debug event, so a student with a dead/OS-muted mic
  // (2026-07-24 incident: peak −75dBFS, tutor "not responding") got no
  // signal that the tutor couldn't hear them. Auto-dismisses; cleared for
  // good the moment any real transcript proves the mic works.
  const [micNotice, setMicNotice] = useState<string | null>(null);
  const micNoticeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Round-7c: mic-silent false positive on Android session start. Every
  // Android session showed the banner ~11s in while the opener was still
  // playing — the student simply hadn't spoken yet, and Android's
  // noiseSuppression gates real signal below the -60dBFS probe threshold
  // for anyone who hasn't. A `peak=-Infinity` message (see MIC_TRULY_DEAD
  // below) is a genuinely dead capture (permission/device failure) and is
  // still shown immediately; anything else is "quiet but finite" and is
  // gated behind: opening-turn audio done + a 20s grace + the student
  // never having been heard at all (no ASR speech-start/final ever
  // arrived). pendingMicNoticeRef holds the held banner text;
  // micEverHeardRef is a one-way latch set by any real ASR activity.
  const pendingMicNoticeRef = useRef<string | null>(null);
  const micEverHeardRef = useRef<boolean>(false);
  const micNoticeGateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [instructions, setInstructions] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  // R34 T1: End/Pause two-tap confirm (mirrors TutorSession's header
  // control). First click arms (3s window) — a stray/accidental tap no
  // longer terminally ends the session (2026-07-26 trial: one tap ended a
  // 38s demo). Second click within the window runs the existing end path.
  const [endArmed, setEndArmed] = useState(false);
  const endArmTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Never leak the end-confirm arm timer past unmount.
  useEffect(() => () => {
    if (endArmTimerRef.current) {
      clearTimeout(endArmTimerRef.current);
      endArmTimerRef.current = null;
    }
  }, []);

  // Round-7c: never leak the mic-notice grace timer past unmount (a session
  // that ends inside the 20s window would otherwise fire setMicNotice on an
  // unmounted component).
  useEffect(() => () => {
    if (micNoticeGateTimerRef.current) {
      clearTimeout(micNoticeGateTimerRef.current);
      micNoticeGateTimerRef.current = null;
    }
  }, []);

  // Persisted student preferences (humor / pacing / etc). Read from
  // localStorage synchronously, then synced from /api/tutor/student-profile
  // when studentId is present. Used to drive the humor block in the
  // system prompt so the brain reflects the student's chosen level.
  const { preferences: studentPreferences } = useStudentPreferences({ studentId });
  // Mirror the active humor level in a ref so the brain turn-start log can show
  // it every turn (the prompt-build log only fires at mount/pref-change, which a
  // late log capture can miss). Diagnostic only.
  const humorCeilingRef = useRef(studentPreferences?.humorCeiling);
  humorCeilingRef.current = studentPreferences?.humorCeiling;

  // Audio recording for session replay
  const audioRecordEnabled = sessionId && process.env.NEXT_PUBLIC_TUTOR_RECORD_AUDIO !== 'false';
  const audioRecorder = useAudioRecorder({
    sessionId: sessionId || '',
    enabled: !!audioRecordEnabled,
    sessionStartedAtMs,
  });

  const transcriptRef = useRef<TranscriptEntry[]>([]);
  const currentUserTextRef = useRef('');
  const currentAssistantTextRef = useRef('');

  // Voice Perception Layer — Stage 1 state (Q1.5/Q2 in design doc).
  // ttsScriptBufferRef holds the rolling ~8s of tutor TTS scripts for the
  // self-voice script-cancellation defence layer. Populated from BOTH
  // (a) handleTranscriptUpdate's assistant branch (legacy Realtime
  // authoring) and (b) the brain orchestrator's speakText call sites
  // (claude-brain + openai-mini TTS — Realtime audio_transcript events
  // don't fire there, so we have to capture at the dispatch site).
  const ttsScriptBufferRef = useRef<RecentTtsScript[]>([]);
  // V2 (2026-07-15): monotonic id per dispatched sentence. Threaded through
  // speakText → the audio queue → per-sentence playback callbacks so the
  // buffer entry's timing window is stamped at REAL playback time, not
  // dispatch time (see tts-script-buffer.ts + useOpenAIRealtime playback
  // callbacks). Returns the id so the dispatch site can hand it to speakText.
  const ttsScriptIdCounterRef = useRef(0);
  const pushTtsScriptForPerception = useCallback((text: string): number | undefined => {
    const id = ttsScriptIdCounterRef.current++;
    // Round-6e (portal-386d96cb): store the POST-pronunciation form — what
    // the speaker actually emits and therefore what an echo's STT transcript
    // contains. The raw script has "x_a"; the TTS says "X sub A"; the echo
    // transcript "XD sub A." shares zero tokens with the raw form, so every
    // overlap score missed it and Haiku dispatched it as a barge-in. The
    // buffer doc always said "ideally the post-TTS-pronunciation form" —
    // now it is.
    let spoken = text;
    try { spoken = rewriteForTTS(text); } catch {}
    const entry = pushTtsScript(ttsScriptBufferRef.current, spoken, id, Date.now());
    return entry ? id : undefined;
  }, []);
  // V2: apply a real-playback lifecycle stamp (start/end/skip) from the audio
  // queue to the matching buffer entry by id.
  const applyTtsPlaybackStamp = useCallback(
    (ev: { scriptId: number; phase: 'start' | 'end' | 'skip'; atMs: number }) => {
      applyPlaybackStamp(ttsScriptBufferRef.current, ev);
    },
    [],
  );
  // Circuit breaker for the Haiku perception-classify endpoint per Q6:
  // 5 consecutive failures opens the circuit for 60s, during which the
  // 'escalate' verdict short-circuits to 'noise' (fail-open). Resets on
  // a successful call.
  const perceptionClassifyFailCountRef = useRef(0);
  const perceptionClassifyCircuitOpenAtRef = useRef<number>(0);
  // Stage 2 cancellation surface. inFlightBrainAbortRef holds the
  // AbortController of the in-flight callBrainOnce fetch so the
  // perception layer can abort the brain stream when the student
  // starts speaking during 'processing'. lastBrainCallContextRef
  // remembers the (transcript, opts) of the most recent brain call
  // so the perception verdict handler can RESTORE (re-fire with the
  // original input on a noise/filler false positive) or MERGE
  // (re-fire with the original + perception text for a continuation).
  // perceptionInterruptCheckpointRef gates the verdict handler so
  // only verdicts following a Stage-2 cancel trigger restore/merge.
  const inFlightBrainAbortRef = useRef<AbortController | null>(null);
  const lastBrainCallContextRef = useRef<{ transcript: string; opts?: { silent?: boolean } } | null>(null);
  // Q3 timestamped-history (2026-06-16): wall-clock ms at which the
  // current/last brain turn actually started streaming (set in
  // callBrainOnce at the t0 reassignment). Used by applyPerceptionVerdict
  // to compute the relative `[t+N.Ns]` offset on the interrupted-tutor
  // <cut> history entry and to scope ttsScriptBufferRef to this turn's
  // spoken sentences. 0 = no turn has started yet.
  const brainTurnStartedAtRef = useRef<number>(0);
  const perceptionInterruptCheckpointRef = useRef<
    | {
        originalTranscript: string;
        originalOpts?: { silent?: boolean };
        cancelledAt: number;
        /** Bug 1 fix: minimum transcript-sequence number whose verdict
         *  is allowed to dispatch against THIS checkpoint. Set at cancel
         *  time to perceptionTranscriptSeqRef.current — any Haiku verdict
         *  whose source transcript had a seq <= this value is from a
         *  perception transcript that ARRIVED BEFORE the cancel and
         *  must be dropped. */
        minSeqForDispatch: number;
        /** Stage 3: which production state was the cancel triggered in?
         *  'processing' = Stage 2 ("thinking") — brain in flight, no TTS
         *  yet. RESTORE/FILLER/NOISE can safely re-fire the brain.
         *  'speaking'   = Stage 3 — TTS was playing, partial response
         *  already delivered. RESTORE/FILLER/NOISE accept the cut
         *  silently (no refire would just duplicate); MERGE/FRESH still
         *  fire a fresh brain turn for substantive interrupts. */
        cancelledDuringState: 'processing' | 'speaking';
        /** Stage 3 fix #14 (2026-06-15): was the brain actually in
         *  flight at cancel time, or had it already finished (TTS
         *  prep / playback)? Captured from inFlightBrainAbortRef.current
         *  !== null at cancel time. RESTORE only makes sense when the
         *  brain was mid-flight — re-firing a transcript whose brain
         *  call already completed produces a DUPLICATE brain response
         *  (observed live 2026-06-15 phys-sci session: 4 dispatches
         *  of "Can you do a diagram demo..." — 2 of them from brief-
         *  noise retro-cancels triggering RESTORE-after-finished). */
        brainWasInFlight: boolean;
        /** Stage 3.1 (2026-06-16): snapshot of the speakText queue at
         *  cancel time — sentences the brain emitted but were waiting
         *  in the queue when the cancel fired (the currently-playing
         *  sentence is NOT included; once dispatched to TTS it left
         *  the queue). On false-positive cancel verdict
         *  (noise/filler/drop_self_voice) during 'speaking', resume
         *  these via realtime.resumeSpeakText instead of refiring the
         *  brain. Lossy on the partially-played sentence's tail —
         *  the rest of B is gone, but C / D / … are recovered. */
        unplayedSentencesSnapshot: string[];
        /** Resume-from-cut (P5): fraction (0..1) of the in-flight sentence
         *  (snapshot[0]) already played at cut time — picks which clause to
         *  resume from when TUTOR_RESUME_FROM_CLAUSE is on. */
        cutFraction: number;
      }
    | null
  >(null);
  // Bug 1 fix: per-perception-transcript sequence number. Incremented
  // once per onTranscript entry. Closure-captured by Haiku callbacks
  // so the then-handler can check whether its verdict is still fresh
  // when the dispatch slot is opened.
  const perceptionTranscriptSeqRef = useRef(0);
  // Bug 2 fix: after a Stage-2 cancel, record the perception transcript
  // that drove the merge so we can dedupe the inevitable production-WS
  // transcript of the same utterance (production WS still mics during
  // 'processing' state — Stage 4 takes its input role away, Stage 2 has
  // to suppress the duplicate in-band).
  const productionWsTranscriptSuppressRef = useRef<{ text: string; until: number } | null>(null);
  // Stage 3 fix #4 (2026-05-28): perception mid-utterance tracker for
  // the state-race fix. speech_started sets this to true; speech_stopped
  // clears it. The realtime-state effect uses it to fire a retroactive
  // cancel if production state flips to 'speaking'/'processing' while
  // the student is mid-utterance — the gate-at-speech_started check
  // would otherwise miss any utterance that began during 'listening'
  // and spans into 'speaking' (observed live 2026-05-28: user spoke
  // "All right, hold on. I think I got this wrong. So...17 and 48" but
  // only the fragment "All right, hold on I think I got this" reached
  // the brain because the corrected answer was lost to the gate).
  const perceptionMidUtteranceRef = useRef<boolean>(false);
  // ── "Being heard" indicator state (2026-06-24) ──────────────────────────
  // Drive an honest, turn-level feedback signal so the student doesn't have to
  // guess whether they were heard. `perceptionHearing` = perception VAD says
  // the student is speaking right now (speech_started→stopped). `awaitingDispatch`
  // = they stopped and we're transcribing/deciding (the multi-second perception
  // latency window) → shown as "Got that — one sec…". If that window elapses
  // with no brain dispatch AND the utterance was long enough to be real speech,
  // we surface a gentle "didn't catch that" hint (item D).
  const [perceptionHearing, setPerceptionHearing] = useState(false);
  const [perceptionAwaitingDispatch, setPerceptionAwaitingDispatch] = useState(false);
  const speechWindowStartRef = useRef<number>(0);
  // Final-review Finding 3: real speech_started→speech_stopped duration of
  // the most recently closed utterance, stamped in perceptionOnSpeechStop.
  // Distinct from PerceptionTranscript.latencyMs, which spans
  // speech_started→transcription.completed and therefore includes the
  // 1-3s+ transcription latency — using latencyMs as a "how long did they
  // speak" signal let short coughs slip past a duration floor meant to
  // gate on real speech time.
  const lastSpeechDurationMsRef = useRef<number>(0);
  const awaitingDispatchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Mute-to-submit (2026-06-24): when the student mutes right after finishing an
  // utterance (phone-like "I'm done"), submit that in-flight utterance and THEN
  // go quiet, instead of discarding it. Set true at mute time if an utterance is
  // in flight; lets the next transcript through the muted-drop guard once.
  const submitPendingUtteranceRef = useRef<boolean>(false);
  // Manual `input_audio_buffer.commit` errors on the transcription WS, so we
  // can't force-commit a mid-utterance buffer. Instead, on a mute-with-in-flight
  // we keep perception LISTENING for a short grace window so the server VAD
  // finishes + commits the utterance naturally; then we actually mute. The
  // start-gate effect honours muteGrace (perception stays unmuted while true).
  const [muteGrace, setMuteGrace] = useState<boolean>(false);
  const muteGraceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Holds the parent's "show/clear listening hint" callback (the onListeningHint
  // prop), so the perception handlers + didn't-catch timer can surface or clear
  // the gentle "didn't catch that" nudge.
  const onListeningHintRef = useRef<((hint: 'didnt-catch' | null) => void) | null>(null);
  onListeningHintRef.current = onListeningHint ?? null;
  // Opening-turn barge-in guard (2026-06-16). The very first brain turn is
  // a synthetic kickoff ([start lesson] / [start session]) — the student
  // isn't responding to anything yet, so a perception "barge-in" here is
  // almost always ambient noise (observed live: a train announcement
  // retro-cancelled the opening turn, the utterance never resolved to a
  // transcript so RESTORE never re-fired, and the lesson stalled with a
  // seemingly-dead start button). We suppress perception-initiated cancels
  // until the first brain turn completes; flips true at the first "turn ok".
  const tutorFirstTurnDoneRef = useRef<boolean>(false);
  // Opening-turn audio shield (2026-07-04): tutorFirstTurnDoneRef flips when
  // the first brain turn's TEXT completes, but its TTS audio can keep
  // playing for tens of seconds (long teacher-intro openers). Perception
  // cancels honoured in that window abort the opener audio mid-sentence on
  // phantom self-echo transcripts. This latch flips only when the first
  // turn's AUDIO is done: the realtime state leaves 'speaking' after having
  // been 'speaking' post-text-done — with a hard 90s cap from text-done as
  // the no-audio fallback (muted/headless runs where TTS never plays).
  const firstTurnAudioDoneRef = useRef<boolean>(false);
  const firstTurnSawSpeakingRef = useRef<boolean>(false);
  const tutorFirstTurnDoneAtRef = useRef<number>(0);
  // Round-7c: wall-clock time firstTurnAudioDoneRef latched true. Read by
  // handleError (declared earlier in this component, so it closes over this
  // ref rather than calling openingTurnFullyDelivered — that function is
  // declared later in the file and isn't in scope at handleError's
  // definition point) to tell a late/re-fired MicSilentWarning whether the
  // 20s mic-notice grace period has already elapsed.
  const openingAudioDoneAtRef = useRef<number>(0);
  // Stage 3 fix #11 (2026-05-28): watchdog timeout for the mid-utterance
  // flag. If perception WS misses a speech_stopped event (network blip,
  // server bug), the flag would stay stuck → all subsequent brain
  // dispatches blocked by the defer-on-dispatch guard. 30s is generous
  // for any real utterance length; if a student genuinely speaks past
  // 30s, the flag clears + the next perception verdict still dispatches
  // (the eventual transcript routes normally through applyPerceptionVerdict
  // or the production-WS fallback).
  const perceptionMidUtteranceWatchdogRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Round-28 (live 2026-07-18, session portal-f31017f0): STAGE-2 cancels
  // whose interrupting sound never resolves to a transcript get NO verdict,
  // so RESTORE never re-fires and the lesson stalls in silence (38s of dead
  // air observed; the stale checkpoint only cleared at the NEXT student
  // turn). This timer, armed at 'processing'-cancel time, re-fires the
  // aborted turn once the no-verdict window elapses — decision logic lives
  // in the pure decideStage2TimeoutRestore (test:stage2-restore).
  const stage2TimeoutRestoreTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Clears the post-speech "Got that — one sec…" state + its didn't-catch timer.
  // Called when a real student turn reaches the brain, the tutor starts talking,
  // or the student begins a new utterance.
  const resolveAwaitingDispatch = useCallback(() => {
    if (awaitingDispatchTimerRef.current) {
      clearTimeout(awaitingDispatchTimerRef.current);
      awaitingDispatchTimerRef.current = null;
    }
    setPerceptionAwaitingDispatch(false);
  }, []);
  const PERCEPTION_MID_UTTERANCE_WATCHDOG_MS = 30_000;
  // Stage 3 fix #10 (2026-05-28): synchronous speakText gate for the
  // brain orchestrator's emit-after-abort race. When a perception
  // cancel fires (onSpeechStart, retro-cancel useEffect, or any
  // applyPerceptionVerdict branch that re-fires the brain), the
  // in-flight callBrainOnce's `for await` loop continues processing
  // 1-3 already-buffered sentence SSE events before the AbortError
  // propagates. Without this gate those sentences reach speakText() →
  // sendOneSpeakText() → response.create, racing the response.cancel +
  // clearSpeechQueue that fired at cancel time. Symptoms: tutor leaks
  // 1-2 sentences of audio between successive student utterances; self-
  // cancellation of just-dispatched FRESH refire leaves residual audio.
  // The gate stores an expiry timestamp; callBrainOnce checks it
  // SYNCHRONOUSLY before every brain-sentence speakText emission and
  // silently drops the sentence if blocked. 600ms covers SSE buffer
  // drain + AbortError propagation comfortably; refire's first sentence
  // typically lands at ~1-3s (HTTP RT + brain stream startup) so the
  // gate has expired by then. If a refire IS fast enough to land
  // inside the gate, its first sentence is dropped — accepted cost.
  const speakTextBlockedUntilRef = useRef<number>(0);
  const SPEAK_TEXT_GATE_MS = 600;
  // Cancel-storm governor (2026-07-09, session-1783615559112): caps
  // stage2/3 cancels in a rolling window so a student re-speaking into
  // silence can't livelock the tutor by aborting every nascent reply.
  // speechKilledAtRef marks barge-in kills so the delivery-detection
  // effect can tell a natural playback finish from a killed one.
  const cancelStormRef = useRef<CancelStormGovernor>(new CancelStormGovernor());
  const speechKilledAtRef = useRef<number>(0);
  // Perception dispatch dedupe (2026-07-09, session-1783615623994): the
  // direct-dispatch/late-fallback paths bypass the production-WS
  // suppress window, so a perception re-emission (post-reconnect) fired
  // the same utterance twice → two brain replies. Short exact-text window.
  const perceptionDispatchDeduperRef = useRef<DispatchDeduper>(new DispatchDeduper());
  // Consecutive-noise nag (R32 T8, silence audit §5): real speech
  // repeatedly misclassified as noise was an unbounded silent drop —
  // two >=1.5s "noise" drops within 30s speaks one "didn't catch that"
  // line (60s cooldown). Persists across the noise-drop branch below.
  const noiseNagStateRef = useRef(createNoiseNagState());
  // Stage 2 verdict → action dispatcher. Filled in once
  // handleStudentTranscriptForBrain is defined further down (forward
  // reference via ref to avoid hoisting issues). Called from the
  // perception onTranscript callback's heuristic + Haiku paths.
  const applyPerceptionVerdictRef = useRef<((verdict: PerceptionVerdict, perceptionText: string) => void) | null>(null);
  // R34 T3: incomplete-utterance hold (TUTOR_INCOMPLETE_HOLD). A finalized
  // transcript ending on a dangling function word ("give me a…") is parked
  // here for HOLD_MS instead of dispatched, so the student's resumed speech
  // can merge into it. Same forward-ref-via-ref pattern as
  // applyPerceptionVerdictRef above: the flush timer re-enters
  // perceptionOnTranscript (bypassHold=true) via perceptionOnTranscriptRef
  // so it always calls the latest render's closure, not a stale one
  // captured at hold-time.
  const heldTranscriptRef = useRef<{
    text: string;
    tMs: number;
    latencyMs: number;
    itemId?: string;
    // Review round 1 (Finding 2): the ABSOLUTE speechStartedAt computed at
    // hold-time (t.latencyMs > 0 ? holdNowMs - t.latencyMs : undefined) —
    // same formula the Stage-1 self-voice-defense block uses. Stored so the
    // flush path (which runs up to HOLD_MS later) can hand the classifier
    // the timestamp it would have seen unheld, instead of re-deriving it
    // from flush-time Date.now() and shifting the 30s TTS-echo lookback
    // window later by up to HOLD_MS.
    speechStartedAt: number | undefined;
    timer: ReturnType<typeof setTimeout>;
  } | null>(null);
  const perceptionOnTranscriptRef = useRef<((t: PerceptionTranscript, bypassHold?: boolean, heldSpeechStartedAt?: number, bypassManualBuffer?: boolean) => void) | null>(null);
  // Stage 2 dev-only verdict pin. When set via
  // window.__tutorForceClassifierVerdict('continuation'), the next
  // perception transcript skips heuristic + Haiku and dispatches the
  // pinned verdict directly. Consumed once then auto-cleared.
  const pinnedClassifierVerdictRef = useRef<PerceptionVerdict | null>(null);
  // Dev-only (window.__tutorForceKill): when set, the brain orchestrator's
  // streaming loop fires a synthetic content kill after the next audible
  // sentence — deterministically exercising the judge-kill Stage 3.1
  // snapshot → retry → restatement/resume path without needing to land a
  // real structural validator rejection. Consumed once per arm. The string
  // payload becomes the retry's rejection reason (steers restate vs correct).
  const forceKillPendingRef = useRef<string | null>(null);
  // Dev-only (window.__tutorForceKillAfterRenders): when set, the synthetic
  // kill waits until the attempt has painted at least this many renders (rather
  // than firing after the first audible sentence). Deterministically exercises
  // the keep-validated-on-kill path — a kill AFTER validated renders landed,
  // which is the precondition the post-sentence force-kill can't produce.
  const forceKillAfterRendersRef = useRef<number | null>(null);

  // --- Render↔speech sync (2026-06-19) ---------------------------------
  // Per-turn buffer of whiteboard render batches whose VISUAL dispatch
  // (onWhiteboardCommand) is deferred until their introducing sentence has
  // been spoken. Everything else about each render (validation, id
  // assignment, dedup catalog, page-grouping, brain-feedback return) ran
  // synchronously inside handleWhiteboardCommand — only the pixels wait.
  // See project_tutor_render_speech_sync.
  // Caption word-sync: display↔speech sentence registry + reveal state.
  // Fed per-attempt from the brain stream loop; read via the handle's
  // getSpokenCaption poll. See caption-sync.ts.
  const captionSyncRef = useRef(new CaptionSyncTracker());

  // Student marks (Phase 1): pending tap buffer + idle-send timer. Marks
  // NEVER interrupt anything — the buffer is read only at brain-turn start
  // (callBrainOnce) and by the idle-send further down (armStudentMarkIdleSend,
  // declared after `realtime` so it can read live speaking state).
  const pendingStudentMarksRef = useRef<ResolvedMark[]>([]);
  const studentMarkIdleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Writing-gesture OCRs currently in flight — the idle-send must not fire
  // while one is pending, or a tick+written-answer combo splits across two
  // brain turns (final review 2026-07-05).
  const studentMarkOcrInFlightRef = useRef(0);
  // Student is composing in the dock's text input (focused). Marks must
  // wait and attach to the typed message rather than idle-sending mid-
  // composition (user-identified gap, 2026-07-05). Set by the input's
  // existing focus/blur handlers.
  const studentTypingRef = useRef(false);
  // Task X10: modality of the CURRENT brain turn's input — true when the
  // student TYPED it (in-session text box / external typed dispatch), false
  // for voice / button / kickoff. Set at the unified relay entry point
  // (handleStudentTranscriptForBrain) from the dispatch's `typed` opt and
  // read by the honest empty-stream fallback, which renders a text bubble
  // (never speaks "say that again") for a typed exchange during a brain outage.
  const currentTurnTypedRef = useRef(false);

  // Tutor reactions (noise-nagging v1, fixes-queue-v2 item 2): situation
  // counter → one-time spoken suggestion. Events are recorded in
  // applyPerceptionVerdict's noise-family branch; on threshold the rule's
  // directive is stashed here and delivered by the reaction idle-send
  // (armReactionIdleSend, declared after `realtime` like the student-marks
  // idle-send it mirrors, reached from the verdict path via ref
  // indirection). Session-scoped by construction — VTR remounts per session.
  const noiseReactionStateRef = useRef(createReactionState());
  const pendingReactionDirectiveRef = useRef<string | null>(null);
  const reactionIdleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const armReactionIdleSendRef = useRef<() => void>(() => {});

  const renderBufferRef = useRef<Array<{
    processed: WhiteboardCommand[];
    anchorM: number;
    // Board-anchor re-anchor (assist): a turn-opening equation/figure held
    // until the sentence that names it plays. anchorKeywords drives the match.
    pendingReanchor?: boolean;
    anchorKeywords?: AnchorKeywords;
    // Pull-early release (2026-07-24 round): set by the sentence-start
    // content matcher when the sentence NAMING this render starts playing
    // before its anchorM would release it (Rule 15 violation — tool call
    // parked after its narration). flushableCount already honors it.
    capExpired?: boolean;
    // Async doodle placeholder (show_sketch): held until the doodler resolves
    // its primitives (mutated onto the command) or the entry is spliced out
    // (fail/timeout). See project_tutor_sketch_capability.
    pendingAsync?: boolean;
    // Task 3.2 (word-anchored flush): index of the referring word within the
    // introducing sentence's SPOKEN words — releases the render the moment
    // that word plays (accelerator over sentence semantics; see render-sync).
    anchorWord?: number;
  }>>([]);
  // Task 3.2: latest word-clock position from 'word' playback-progress
  // events. Cleared at per-turn reset + kill reset so a stale position from
  // a prior turn can never satisfy a fresh entry's word anchor.
  const lastWordPosRef = useRef<{ sentenceIdx: number; wordIdx: number } | null>(null);
  // Task 3.3: live playback-position getter (wired after the realtime hook
  // mounts, like the other realtime refs) — flushReadyRenders reads it to
  // pace the draw-on ink to the narrating sentence's remaining audio.
  const getSpokenProgressRef = useRef<(() => SpokenProgress) | null>(null);
  // In-flight doodle fetches — aborted on turn kill / buffer drop.
  const sketchAbortsRef = useRef<Set<AbortController>>(new Set());
  // Board-anchor assist, per turn: the narration spoken so far (for the
  // transformation-arrow fallback) + whether ANY board render fired this turn
  // (so the fallback only fires when the brain drew nothing). Reset at turn start.
  const turnNarrationRef = useRef<string[]>([]);
  // Task B3 (flag-gated): whether the NEXT callBrainOnce call to complete is
  // the proactive-opener turn, and how many valid (post-validation) board
  // renders it dispatches. Only ever written/read when TUTOR_PEDAGOGY_OPENER
  // is on (see the mount effect that seeds it from `beh.opener !== 'none'`
  // and the callBrainOnce finally that consumes it). See opener-fallback.ts
  // + task-B3-brief.md.
  const openingTurnPendingRef = useRef(false);
  const openingTurnValidRenderCountRef = useRef(0);
  // Per-turn opening directive (flag-ON follow-up #1 from the whole-branch
  // review): the B4 opener clause used to be baked into the SESSION-STATIC
  // system prompt (a byte-stable 1h-cached prefix — see runBrainTurn's
  // cache_control), so it persisted ALL session. It now rides along in the
  // per-turn user content as `<opening_directive>` while the opening phase
  // is active, then retires — WITHOUT ever touching the cached prefix.
  // Retirement (see callBrainOnce + applyResolvedAdvance): the brain
  // advancing the lesson (teaching started), or the
  // OPENING_DIRECTIVE_MAX_BRAIN_TURNS ceiling. Seeded once per mount in
  // buildInstructions under the same openingTurnArmedRef latch as the
  // fallback arm (a mid-session studentPreferences rebuild must not
  // resurrect a retired directive). Fresh per session via key={sessionId}.
  const openingDirectiveRef = useRef<string | null>(null);
  const openingDirectiveBrainTurnsRef = useRef(0);
  // Teacher self-intro (2026-07-09): carried SEPARATELY from the opening
  // directive so it rides the FIRST brain turn only — the directive
  // itself rides ≤4 turns, and the embedded intro was re-spoken on each
  // of them (up to 4 self-intros in session-1783615226008).
  const teacherIntroDirectiveRef = useRef<string | null>(null);
  // Session-start greeting window (2026-07-09): until the student's
  // first real turn dispatches, greeting-only utterances ("Hello.") are
  // exempt from the noise filter — a real greeting was being dropped as
  // a Whisper hallucination (session-1783615226008).
  const studentHasSpokenRef = useRef<boolean>(false);
  // Teacher-persona mid-session style salience (2026-07-04): the compact
  // per-turn <teacher_style> body (renderTeacherStyleReminder output),
  // seeded once under the same one-shot latch as the opening directive.
  // callBrainOnce attaches it ONLY on turns where the opening directive is
  // NOT riding — the directive already carries identity salience, so the
  // reminder takes over exactly at retirement and never retires itself
  // (style must persist all session; the T1 judge kept scoring
  // style-consistent 4/5 "not strongly distinctive beyond the opening").
  // null ⇒ flag off / no persona / diagnostic session ⇒ never attached.
  // Holds the PERSONA (not a prebuilt string) because the reminder is now
  // rebuilt per turn: catchphrases are offered only every Nth turn (see
  // CATCHPHRASE_TURN_INTERVAL — a prebuilt string would offer them always).
  const teacherStylePersonaRef = useRef<TeacherPersonaWire | null>(null);
  /** Counts style-reminder turns, i.e. brain turns after the opening
   *  directive retires. Drives the catchphrase interval. */
  const teacherStyleTurnRef = useRef(0);
  // Task B3 review fix: session-scoped one-shot latch. buildInstructions'
  // effect (below) re-runs mid-session whenever studentPreferences changes
  // (e.g. the in-session humor/pacing chip), which would otherwise re-arm
  // openingTurnPendingRef after the real opener turn already consumed it —
  // firing a spurious fallback render on an unrelated later turn. This latch
  // ensures the pending flag is armed at most once per component mount
  // (== once per session, since VoiceTutorRealtime remounts via
  // key={sessionId} in page.tsx for every new session, giving this ref a
  // fresh false value for free — see page.tsx ~2224).
  const openingTurnArmedRef = useRef(false);
  // Task C1 (flag-gated): the session mode resolved by resolveOpeningBehavior
  // ('demo' | 'subscribed'), stashed at mount time under the SAME one-shot
  // latch above so callBrainOnce can attach it per-turn to lessonPlanContext
  // (plan-as-seed framing). buildInstructions runs at mount; callBrainOnce
  // needs the value on every turn — hence the ref. Only ever written when
  // TUTOR_PEDAGOGY_OPENER is on; flag off ⇒ stays null ⇒ the sessionMode
  // field is never present on the wire ⇒ server output byte-identical.
  const sessionModeRef = useRef<'demo' | 'subscribed' | null>(null);
  // Task C2 (flag-gated): compress-and-confirm completion gate. Segments the
  // student DEMONSTRATED this session — populated at the post-stream
  // affirmation site (same guard placement as the pacing correct-streak
  // increment, so it inherits its exclusions: pure acks, help requests,
  // too-short turns, and judge-kill/restatement retries never count). Read
  // by the markSegmentComplete handler via resolveCompletionOutcome and by
  // the recap_reached milestone via shouldFireRecapMilestone — see
  // completion-gate.ts. Only ever written when TUTOR_PEDAGOGY_OPENER is on.
  // Fresh per session via key={sessionId} remount; no manual reset needed.
  const demonstratedSegmentsRef = useRef<Set<string>>(new Set());
  // Whether the completion gate is active this session: TUTOR_PEDAGOGY_OPENER
  // && lessonNode target (lessonPlanId present). Seeded under the SAME
  // openingTurnArmedRef one-shot latch as sessionModeRef. Flag off ⇒ stays
  // false ⇒ resolveCompletionOutcome reproduces today's behavior exactly.
  const completionGateActiveRef = useRef(false);
  // Single shared stall timer (see RENDER_SYNC_STALL_MS). Reset on every
  // buffer-add + playback-progress event; fires only on a genuine stall.
  const renderStallTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Sentences DISPATCHED to TTS this turn (anchor source) and sentences
  // that have STARTED playing this turn (flush driver). Turn-global: reset
  // once at callBrainOnce start, not per attempt — stays aligned for the
  // common no-kill / rejection-retry path. A kill drops the buffer and the
  // counters drift (cleared audio never fires sentence-start), so post-kill
  // renders degrade gracefully to cap-based flush.
  const ttsDispatchedCountRef = useRef(0);
  const ttsPlaybackStartedCountRef = useRef(0);
  // Phase-0 instrumentation (humanlike-latency plan): per-turn latency ledger.
  // Created lazily at eager_end/turn.end, emitted + nulled at brain_turn end.
  // Marks use Date.now() — must stay consistent within a turn (never mix with
  // performance.now()).
  const turnLatencyRef = useRef<TurnLatencyLedger | null>(null);
  // Set when the brain stream finished before the first audio stamp (short
  // turns): the sentence-start handler owns the emit instead, so TOTAL is
  // non-null on every turn that actually reaches the speaker.
  const turnLatencyAwaitingAudioRef = useRef(false);
  // Phase 2 (humanlike-latency): acknowledgment micro-turn timer + rotation
  // state. Armed per dispatch in handleStudentTranscriptForBrain; cleared at
  // first-sentence arrival, closeGate, perception kill/verdict. Fire-time
  // guards (ack-layer.ts) re-check everything, so a stray late fire is safe.
  const ackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ackTurnCounterRef = useRef(0);
  const lastAckIndexRef = useRef<number | null>(null);
  // R32: per-category last-index rotation state for classifier-driven cover
  // phrases (TUTOR_COVER_V2). Keyed by CoverCategory; unused when the flag
  // is off (legacy pickAck path keeps using lastAckIndexRef above).
  const lastCoverIndexRef = useRef<Partial<Record<string, number>>>({});
  // R32 Task 4: escalation poller for in-flight covers (9s/25s tiers) + the
  // 45s give-up. Armed alongside the cover block, cleared at every site that
  // clears ackTimerRef (sentence-0 arrival, closeGate, perception verdict/
  // kill) — a sick turn's escalation must not outlive the turn it covers.
  const escalationTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // True once the 45s give-up has fired for the in-flight turn — the abort
  // catch (callBrainOnce) checks this to skip its own spoken fallback and
  // any later resume (Task 5) so we don't double-speak or re-open a turn
  // we already told the student we lost.
  const escalationGaveUpRef = useRef(false);
  // R32 Task 5: true once the partial-emitted cutoff resume has been ARMED
  // (not necessarily dispatched — see pendingCutoffResumeRef below) for
  // the in-flight turn — caps it at one continuation attempt per turn (a
  // stream that dies twice in a row gets the 45s give-up, not an endless
  // resume loop). Reset at the per-TURN relay entry point (see
  // visualActionsThisTurnRef and friends below), NOT the per-attempt
  // brainTurnAbortedRef reset — a retried attempt within the same turn
  // must not get a second resume shot.
  const cutoffResumeFiredRef = useRef(false);
  // R32 Task 5 (review round 1, Finding 1): the resume marker text, staged
  // here instead of dispatched immediately. The finalize site that detects
  // the cutoff (inside callBrainOnce) runs while brainBusyRef is STILL
  // true — a same-turn dispatch through handleStudentTranscriptForBrain
  // would deterministically hit the busy-queue branch, which stores only
  // the bare transcript STRING (dropping silent/bypassPerceptionDedupe)
  // and can get concatenated with a genuine queued student utterance by
  // the drain loop, leaking the internal marker to the brain as visible
  // text. Staging it here and dispatching only after the whole busy
  // cycle (incl. its own queue-drain) has closed — see the post-finally
  // check in handleStudentTranscriptForBrain — avoids both hazards.
  const pendingCutoffResumeRef = useRef<string | null>(null);
  // True only while a brain stream is actively buffering — gates whether
  // handleWhiteboardCommand's visual dispatch buffers (brain stream) vs
  // fires immediately (enricher validation pass, non-brain callers).
  const renderSyncActiveRef = useRef(false);
  // Paused while a perception cancel is mid-flight (verdict pending). On
  // abort → buffer dropped; on resume → whole buffer flushed.
  const renderBufferPausedRef = useRef(false);

  // Track whiteboard tool calls per response turn for validation pass
  const turnHadToolCallRef = useRef(false);
  const pendingTutorTextRef = useRef<string | null>(null);
  const validationInFlightRef = useRef(false);
  const validationQueueRef = useRef<string[]>([]);
  const sessionIdRef = useRef(`session-${Date.now()}`);
  // Track if student requested visual in their last message
  const studentRequestedVisualRef = useRef(false);
  // Track total whiteboard commands added — used to verify claims
  const whiteboardCommandCountRef = useRef(0);

  // Context keeper — prevents context loss in long Realtime sessions
  const tutorTurnCountRef = useRef(0);
  const CONTEXT_INJECT_INTERVAL = 6; // Inject context summary every N tutor turns
  const injectContextRef = useRef<((text: string) => void) | null>(null);
  // Claude-brain mode: refs filled after the useOpenAIRealtime call so the
  // orchestrator (which is constructed BEFORE the hook returns) can call
  // hook methods. Pattern matches sendTextMessageRef / injectContextRef.
  const speakTextRef = useRef<((text: string, scriptId?: number) => void) | null>(null);
  const clearSpeechQueueRef = useRef<(() => Promise<void>) | null>(null);
  // Stage 3.1 (2026-06-16): refs to the new resume-from-cut hook
  // methods. Following the same long-lived-closure pattern as
  // speakTextRef / clearSpeechQueueRef.
  const peekSpeechQueueRef = useRef<(() => string[]) | null>(null);
  const resumeSpeakTextRef = useRef<((sentences: string[]) => void) | null>(null);
  // Resume-from-cut (P5): read the in-flight sentence's played fraction at cut time.
  const getCurrentSentenceFractionRef = useRef<(() => number) | null>(null);
  // Sustained-energy barge-in gate (Task V1). getPerceptionEnergyWindowRef is
  // wired to usePerceptionWS.getEnergyWindow (OpenAI perception only); null when
  // the Ink2 hook owns the mic (no energy window → gate falls back to instant).
  // bargeInGateTimerRef holds the poll that waits out the sustain window before
  // a 'speaking'-state speech_started is allowed to fire the stage-3 kill.
  const getPerceptionEnergyWindowRef = useRef<(() => { tMs: number; energy: number }[]) | null>(null);
  const bargeInGateTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Task X3: deferred-kill timer for the Ink2 STT path, which has NO energy
  // window. speech_started arms it; speech_stopped (or a fresh onset) disarms
  // it; if it reaches BARGEIN_SUSTAIN_MS while still 'speaking' it fires the
  // same stage-3 kill. This is the sustain gate expressed purely in time (see
  // shouldFireDeferredBargeInKill) rather than mic energy.
  const bargeInDeferredKillRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Never leak the sustain-gate timers past unmount.
  useEffect(() => () => {
    if (bargeInGateTimerRef.current) {
      clearInterval(bargeInGateTimerRef.current);
      bargeInGateTimerRef.current = null;
    }
    if (bargeInDeferredKillRef.current) {
      clearTimeout(bargeInDeferredKillRef.current);
      bargeInDeferredKillRef.current = null;
    }
  }, []);
  // Stage 4 regression fix (2026-06-16): drive the 'processing' ("Thinking…")
  // indicator from the brain orchestrator. realtime is defined later in
  // render order, so reach it through a ref (same pattern as the queue refs).
  const signalBrainThinkingRef = useRef<((on: boolean) => void) | null>(null);
  // Full tutor system prompt. In claudeBrainMode the brain reads this; the
  // Realtime model gets a separate, much shorter relay-only prompt.
  const claudeSystemPromptRef = useRef<string>('');

  // Commit accumulated session events to the student profile (mastery,
  // gaps, recent-session memory + auto-generated notes). Fire-and-forget;
  // the user doesn't wait for notes generation. Safe to call multiple
  // times (the accumulator is reset after each commit so no double-
  // counting, and the endpoint upserts SessionMemory by sessionId).
  // No-op when studentId is unset (demo flow).
  //
  // Learning-gaps blending (2026-07-05): commits are now INCREMENTAL, not
  // End-button-only. Previously the sole call site was the End/Pause click,
  // so a tab close / mobile swipe-away / reload silently lost the whole
  // session's mastery deltas + gap evidence — for enrolled students that
  // starved the gaps loop of data, leaving nothing to blend into future
  // sessions (same failure class the transcript persistence fixed 2026-04).
  // Now: a debounced flush fires as the accumulator gains entries, a
  // pagehide keepalive commit covers abnormal exits, and the End button
  // stays the final commit. `final` gates the expensive parts: only the
  // final commit sends the transcript + generates the LLM session summary;
  // intermediate flushes send just the deltas (generateNotes: false).
  const commitSessionToProfile = useCallback(async (opts?: { final?: boolean; keepalive?: boolean }) => {
    if (!studentId) return;
    const accum = sessionAccumRef.current;
    const accumEmpty = accum.masteryDeltas.length === 0 && accum.gaps.length === 0 && accum.losTouched.size === 0;
    // Content variety (phase 1): a FINAL commit must still post to CAPTURE the
    // fillings shown, even on a session that accumulated nothing gradeable
    // (e.g. a hook-only session the student didn't finish) — otherwise the
    // seen-memory never populates and the next session can't diverge. Scoped
    // to the flag so flag-off behavior is unchanged.
    const finalCapture = opts?.final === true && TUTOR_CONTENT_VARIETY && !!lessonPlanId;
    // Intermediate flushes with nothing new are pure no-ops. A FINAL commit
    // with an empty accumulator still posts when prior flushes committed data
    // this session (transcript → summary on the upserted SessionMemory) OR
    // when it needs to capture content fillings.
    if (accumEmpty && !(opts?.final && profileFlushCountRef.current > 0) && !finalCapture) return;
    const isFinal = opts?.final === true;
    const transcript = isFinal
      ? transcriptRef.current
          .filter((t) => t.role === 'student' || t.role === 'tutor')
          .map((t) => ({ role: t.role as 'student' | 'tutor', text: t.text }))
      : undefined;
    const notesCount = accum.topicNotesCount;
    const totalNotesOverlays = notesCount.theory + notesCount.methods + notesCount.pointers;
    const body = {
      sessionId: sessionIdRef.current,
      endedAt: new Date().toISOString(),
      subject,
      topic,
      grade: level,
      lessonPlanId,
      losTouched: Array.from(accum.losTouched),
      masteryDeltas: accum.masteryDeltas,
      gaps: accum.gaps,
      ...(isFinal ? { transcript } : { generateNotes: false }),
      // Content variety (phase 1): only the FINAL commit carries the transcript
      // the extraction reads, so only it requests filling-capture. Flag-gated
      // + plan-only ⇒ flag-off / demo / free-convo omit the field entirely.
      ...(isFinal && TUTOR_CONTENT_VARIETY && lessonPlanId ? { captureContentFillings: true } : {}),
      // Only stamp when at least one overlay tool fired — keeps SessionMemory
      // entries lean on sessions that didn't touch topic-notes.
      notesOverlaysAddedThisSession: totalNotesOverlays > 0 ? notesCount : undefined,
    };
    sessionAccumRef.current = {
      losTouched: new Set(),
      masteryDeltas: [],
      gaps: [],
      topicNotesCount: { theory: 0, methods: 0, pointers: 0 },
    };
    profileFlushCountRef.current += 1;
    try {
      const res = await fetch(`/api/tutor/student-profile/${encodeURIComponent(studentId)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        // pagehide path: let the request outlive the page teardown.
        ...(opts?.keepalive ? { keepalive: true } : {}),
      });
      if (!res.ok) {
        console.warn('[VoiceTutorRealtime] profile commit failed:', res.status);
        return;
      }
      const data = await res.json();
      if (data.summary) {
        console.log('[VoiceTutorRealtime] session summary generated:', data.summary);
      }
    } catch (err) {
      console.warn('[VoiceTutorRealtime] profile commit error:', err);
    }
  }, [studentId, subject, topic, level, lessonPlanId]);
  // Count of commits already posted this session — lets the final commit
  // post transcript+summary even when its own accumulator increment is
  // empty (everything already flushed incrementally).
  const profileFlushCountRef = useRef(0);
  // Debounced intermediate flush. Called at each accumulation site
  // (mastery delta push, gap pushes) — 20s debounce coalesces a burst of
  // segment completions into one commit; each commit sends only the
  // increment since the last one.
  const PROFILE_FLUSH_DEBOUNCE_MS = 20_000;
  const profileFlushTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scheduleProfileFlush = useCallback(() => {
    if (!studentId) return;
    if (profileFlushTimerRef.current) clearTimeout(profileFlushTimerRef.current);
    profileFlushTimerRef.current = setTimeout(() => {
      profileFlushTimerRef.current = null;
      void commitSessionToProfile();
    }, PROFILE_FLUSH_DEBOUNCE_MS);
  }, [studentId, commitSessionToProfile]);
  // Abnormal-exit coverage: pagehide fires on tab close / navigation /
  // mobile background-then-kill (more reliably than beforeunload on iOS).
  // keepalive lets the POST complete after teardown. Cheap no-op when the
  // accumulator is empty. Timer cleared here too — the page is going away.
  useEffect(() => {
    if (!studentId) return;
    const onPageHide = () => {
      if (profileFlushTimerRef.current) {
        clearTimeout(profileFlushTimerRef.current);
        profileFlushTimerRef.current = null;
      }
      void commitSessionToProfile({ keepalive: true });
    };
    window.addEventListener('pagehide', onPageHide);
    return () => {
      window.removeEventListener('pagehide', onPageHide);
      if (profileFlushTimerRef.current) {
        clearTimeout(profileFlushTimerRef.current);
        profileFlushTimerRef.current = null;
      }
    };
  }, [studentId, commitSessionToProfile]);

  // Active lesson plan (when lessonPlanId prop is set). Held in refs so
  // the in-flight brain call always sees the latest segment id even if
  // it advances mid-turn via advance_lesson. Plan is fetched once at
  // mount; segment progression is tracked locally.
  const lessonPlanRef = useRef<import('@/lib/tutor/lesson-plan/types').LessonPlan | null>(null);
  const currentSegmentIdRef = useRef<string>('');
  // realtime-2: guards one-time lesson-plan injection per plan, and holds
  // the inject-current-segment function (assigned after the hook call so
  // it can close over injectContextRef).
  const lessonPlanV2InjectedRef = useRef(false);
  const injectLessonPlanV2Ref = useRef<() => void>(() => {});
  // Last on-plan segment before the brain released the cursor via
  // advance_lesson({to:"free"}) (off-plan / topic-switch). Lets a
  // later advance_lesson({to:"next"|"previous"}) resume from where the
  // student left the plan instead of failing to resolve from an empty
  // cursor. Empty when never released, or released from plan start.
  const segmentBeforeFreeRef = useRef<string>('');
  // UI-facing state — refs above are for the brain orchestrator, but the
  // progress bar / segment chips / time remaining must re-render on
  // changes. Kept in sync with the refs by the loader and the advance
  // handler below.
  const [activePlan, setActivePlan] = useState<import('@/lib/tutor/lesson-plan/types').LessonPlan | null>(null);
  const [activeSegmentId, setActiveSegmentId] = useState<string>('');
  // Notify parent whenever the plan or segment changes so it can render
  // a progress strip outside this control row.
  const onLessonPlanProgressRef = useRef(onLessonPlanProgress);
  useEffect(() => { onLessonPlanProgressRef.current = onLessonPlanProgress; }, [onLessonPlanProgress]);

  // Task WS3: mock-review context mirrored to a ref. The embed fetches it
  // asynchronously AFTER mount, and callBrainOnce (memoized, mockReview not in
  // its deps) closes over this ref so a late-arriving context still reaches the
  // brain payload without a stale-closure miss.
  const mockReviewRef = useRef(mockReview);
  useEffect(() => { mockReviewRef.current = mockReview; }, [mockReview]);

  // Pre-start "review agenda" (deliverable 4) + mid-session Agenda drawer:
  // derive the pre-start list + "+ N more" line AND the drawer rows (every
  // miss) from the review context and report them up so SessionStage can
  // render both. Memoized on mockReview; reported via a stable ref so a
  // changing callback identity doesn't re-fire it. Empty/degraded ⇒ generic
  // chips stay + no Agenda button.
  const onMockAgendaChangeRef = useRef(onMockAgendaChange);
  useEffect(() => { onMockAgendaChangeRef.current = onMockAgendaChange; }, [onMockAgendaChange]);
  const refetchMockReviewRef = useRef(refetchMockReview);
  useEffect(() => { refetchMockReviewRef.current = refetchMockReview; }, [refetchMockReview]);
  const onStudentInputRef = useRef(onStudentInput);
  useEffect(() => { onStudentInputRef.current = onStudentInput; }, [onStudentInput]);
  const onControlMessageRef = useRef(onControlMessage);
  useEffect(() => { onControlMessageRef.current = onControlMessage; }, [onControlMessage]);
  const mockAgenda = useMemo(() => buildMockReviewAgenda(mockReview), [mockReview]);
  const mockDrawer = useMemo(() => buildMockReviewDrawer(mockReview), [mockReview]);
  const mockCorrectDrawer = useMemo(() => buildMockReviewCorrectRows(mockReview), [mockReview]);

  // One-time session-start sequence (clock + unlockAudio + hasStarted), owned
  // by the handleRef effect below where the state setters live, and mirrored
  // here so pickAgendaItem can fire it inside the tap's gesture stack. Default
  // no-op until that effect assigns the real function.
  const gestureSessionStartRef = useRef<() => void>(() => {});

  // Mirror of handleMicClick for the handle's startSession (the SessionStage
  // center orb, 2026-07-26). The handleRef effect below runs before
  // handleMicClick is declared, so it reads through this ref — same idiom as
  // gestureSessionStartRef immediately above.
  const micClickRef = useRef<(() => void) | null>(null);

  // R32 T9: warmup watchdog. A stalled [start lesson] / [Session-resumed…] /
  // typed-first kickoff used to pin isWarmingUp (and the DISABLED mic) forever
  // — nothing was watching the clock. Every setIsWarmingUp(true) site below
  // stamps a fresh warmupStateRef; the 5s interval effect near isWarmingUp's
  // declaration drives it. warmupKickoffRef only holds a transcript at the two
  // sites whose original dispatch is a known-safe silent re-send through
  // handleStudentTranscriptForBrain ([start lesson]/[start session]/
  // [Session-resumed…]) — the typed-first/agenda gesture site leaves it null
  // (its dispatch mechanism varies by caller and isn't safely replayable), so
  // that site gets the 40s fail safety net (spinner clears, mic re-enables)
  // but no 20s auto-rekick.
  const warmupStateRef = useRef<WarmupState | null>(null);
  const warmupKickoffRef = useRef<string | null>(null);

  // Drawer row tap: switch the tutor to a specific missed item. Stable identity
  // (reads refs) so re-firing onMockAgendaChange doesn't churn. If the item is
  // ALREADY in the current focus list, just nudge to its number; the numbered
  // brain block makes it unambiguous. Otherwise refetch the context PINNING it
  // (so the fresh block puts it at Item 1) and, critically, set mockReviewRef
  // DIRECTLY before firing the utterance — the next brain turn reads the ref
  // synchronously and would otherwise beat the prop-driven re-render. On a
  // refetch failure we log and do nothing (no broken utterance).
  const pickAgendaItem = useCallback(async (itemId: string) => {
    const ctx = mockReviewRef.current;
    if (!ctx) return;
    // Agenda round 4 (Round-16 reincarnation): a pick IS the student's first
    // real gesture in an agenda-only session. Fire the one-time session start
    // (clock + unlockAudio + hasStarted) NOW, synchronously in this tap's call
    // stack — the beyond-focus branch below awaits a refetch before send(),
    // which would leave the gesture context and make the marker-driven start
    // (in sendTextMessage) too late for unlockAudio to resume the AudioContext.
    // Idempotent, so the marker's own start call is a harmless no-op.
    gestureSessionStartRef.current();
    // A pick is navigation, not an answer: relay a bracketed control marker (no
    // "Student wrote:" board card, suppressed from the visible transcript).
    // Fall back to the legacy student-input path only when the control channel
    // isn't wired.
    const send = (marker: string) => {
      if (onControlMessageRef.current) onControlMessageRef.current(marker);
      else onStudentInputRef.current?.('text', marker);
    };
    const focusIdx = ctx.focusItems.findIndex((f) => f.itemId === itemId);
    if (focusIdx >= 0) {
      send(`[Via their review-agenda menu, the student switched to Item ${focusIdx + 1}. Move to it now.]`);
      return;
    }
    const refetch = refetchMockReviewRef.current;
    if (!refetch) {
      console.warn('[mock-review] agenda pick: item not in focus and no refetch available — ignoring');
      return;
    }
    try {
      const fresh = await refetch([itemId]);
      if (!fresh) { console.warn('[mock-review] agenda pick: refetch returned no context — ignoring'); return; }
      mockReviewRef.current = fresh; // beat the prop-render race for the next brain turn
      send('[Via their review-agenda menu, the student selected a new question — it is now Item 1 in your mock_review list. Move to it now.]');
    } catch (e) {
      console.error('[mock-review] agenda pick: refetch failed — ignoring:', e);
    }
  }, []);

  useEffect(() => {
    onMockAgendaChangeRef.current?.(mockAgenda.agenda, mockAgenda.remainingLine, mockDrawer, pickAgendaItem, mockCorrectDrawer);
  }, [mockAgenda, mockDrawer, mockCorrectDrawer, pickAgendaItem]);

  // Milestone reporting (mirrored to a ref so the emit helper has stable
  // identity and never goes stale inside the tool dispatch). Each milestone
  // fires at most once per session-component lifetime.
  const onMilestoneRef = useRef(onMilestone);
  useEffect(() => { onMilestoneRef.current = onMilestone; }, [onMilestone]);
  const firedMilestonesRef = useRef<Set<TutorMilestone>>(new Set());
  const emitMilestone = useCallback((m: TutorMilestone) => {
    if (firedMilestonesRef.current.has(m)) return;
    firedMilestonesRef.current.add(m);
    onMilestoneRef.current?.(m);
  }, []);
  useEffect(() => {
    onLessonPlanProgressRef.current?.({ plan: activePlan, currentSegmentId: activeSegmentId });
  }, [activePlan, activeSegmentId]);

  // Student profile context (when studentId prop is set). The block is
  // a pre-rendered string the brain reads on every turn. The accumulator
  // collects session events (mastery deltas from mark_segment_complete,
  // gaps from record_gap, LOs touched) and commits them at session end.
  const studentProfileBlockRef = useRef<string>('');
  // Content variety (phase 1): the current plan's seen-memory slice, read
  // once from the profile GET at mount. null ⇒ never varied (first time on
  // this plan, flag off, or no studentId).
  const planContentSeenRef = useRef<{ hooks: string[]; examples: string[]; problems: string[] } | null>(null);
  // Task D1b — transient social/progress context block. Computed ONCE per
  // mount (session-scoped, immutable for the session, never persisted).
  // Flag off or props absent ⇒ stays null ⇒ the per-turn compose below is
  // byte-identical to the old `studentProfileBlockRef.current || undefined`.
  const transientContextBlockRef = useRef<string | null>(null);
  const transientContextComputedRef = useRef(false);
  if (!transientContextComputedRef.current) {
    transientContextComputedRef.current = true;
    transientContextBlockRef.current =
      TUTOR_PEDAGOGY_OPENER && (socialMemory?.length || progressDigest || lastOpener || readinessNote)
        ? renderTransientContextBlock({ socialMemory, progressDigest, lastOpener, readinessNote })
        : null;
  }
  // Opener-recency (part A) — THIS session's own opener record, captured
  // once when the opener turn's text finalizes in callBrainOnce (see the
  // capture site near `const fullText = …`). kind is stashed at seed time
  // (beh.opener, same one-shot latch as sessionModeRef) because the
  // resolved OpeningBehavior isn't in scope at capture time. Only ever
  // written when TUTOR_PEDAGOGY_OPENER is on; fresh per session via
  // key={sessionId} remount.
  const sessionOpenerKindRef = useRef<string | null>(null);
  const sessionOpenerRecordRef = useRef<LastOpenerRecord | null>(null);
  const sessionAccumRef = useRef<{
    losTouched: Set<string>;
    masteryDeltas: Array<{ loId: string; delta: number }>;
    /** Rich gap entries collected mid-session, committed at session-end.
     *  Both record_gap (kind='lo') and flag_prerequisite_gap (kind='prerequisite')
     *  land here. `signals` is already the merged set of brain-emitted
     *  (signalsObserved) + orchestrator-stamped objective signals
     *  (INCORRECT_STREAK_2_PLUS, STUCK_CUE, SLOW_SEGMENT) at the moment
     *  of the tool call. The store layer computes confidence + handles
     *  candidate→confirmed promotion at commit time. */
    gaps: Array<{
      kind: 'lo' | 'prerequisite';
      loId?: string;
      conceptLabel?: string;
      observation: string;
      studentQuotes: string[];
      signals: string[];
    }>;
    /** Per-session topic-notes ATTEMPT counts, used by the orchestrator
     *  rate-limit gate. Counts every accepted (post-warmup, pre-rate-cap)
     *  dispatch to the PATCH endpoint — not the eventual `added` outcome
     *  reported by the API (`added` vs `reinforced` vs
     *  `duplicate-of-baseline`). The "actually persisted" delta tracking
     *  needed for SessionMemory.notesOverlaysAddedThisSession (Step 10)
     *  will read PATCH responses asynchronously. */
    topicNotesCount: { theory: number; methods: number; pointers: number };
  }>({
    losTouched: new Set(),
    masteryDeltas: [],
    gaps: [],
    topicNotesCount: { theory: 0, methods: 0, pointers: 0 },
  });
  // Serialization for brain calls. When a student utterance arrives while
  // a brain call is in flight, the second call's speakText would interrupt
  // the first one's audio — observed 2026-04-26 when the user typed two
  // requests in rapid succession and the first request's response was
  // silently discarded. Queue overlapping utterances and combine them
  // into one follow-up call after the in-flight one completes.
  const brainBusyRef = useRef(false);
  // State mirror of brainBusyRef purely for the status pill. getStatusDisplay
  // reads the ref, but a ref change doesn't re-render — during a long
  // render-only phase (e.g. a 48s Skip turn dumping a formula sheet) there's no
  // state change to refresh the status, so it goes stale on "Click to speak"
  // (observed 2026-06-16 JEE Skip turn). Driving the status off this state
  // guarantees a re-render whenever the brain starts/stops composing. Always
  // flip both together via setBrainBusy so the ref stays the synchronous source
  // of truth for the gating logic that reads it mid-turn.
  const [isBrainResponding, setIsBrainResponding] = useState(false);
  const setBrainBusy = useCallback((v: boolean) => {
    brainBusyRef.current = v;
    setIsBrainResponding(v);
  }, []);
  // True iff the most recent brain call actually threw AbortError (a perception
  // cancel that landed mid-stream). Reset at the start of every brain attempt,
  // set in the AbortError catch. The RESTORE-after-noise path reads this to
  // avoid the race where a barge-in fires while the brain is in flight but the
  // stream FINISHES before the abort propagates: the cancel-time
  // `brainWasInFlight` snapshot says "true" yet the turn completed normally, so
  // re-firing the original transcript duplicates an already-delivered answer
  // (observed 2026-06-16 JEE session: "Yeah, yeah, yeah." noise during TTS of a
  // completed turn re-fired "Perpendicular to BNC?" → duplicate turn).
  const brainTurnAbortedRef = useRef(false);
  // Whiteboard kill-recovery (B, 2026-06-16). On a content kill we DEFER the
  // rollback of the killed attempt's renders instead of yanking them
  // immediately — that immediate remove + the retry's re-add is what makes the
  // board flash. The killed render ids land here; they stay on the board (and
  // in the dedup catalog) so a restatement retry that re-renders them
  // identically dedup-drops and CONFIRMS them (id removed from this set → kept,
  // no flash). Whatever ids remain at end-of-call were NOT re-confirmed (a
  // correction rendered different content, or the turn aborted) → rolled back
  // in the finally. Cleared at the start of each brain call. (Visual dim layer
  // is phase A, on top of this.)
  const pendingRevisionRef = useRef<Set<string>>(new Set());
  // Kill-recovery (B) keep-on-no-replacement (2026-06-17): true if the WINNING
  // (final) attempt of the current brain call rendered anything. Reset at the
  // top of each attempt; read in the finally to decide whether a diverged /
  // abandoned retry actually superseded the killed renders (rendered a
  // replacement → sweep) or just failed to re-emit them (rendered nothing →
  // keep, so a valid render the student asked for doesn't vanish).
  const winningAttemptRenderedRef = useRef(false);
  const queuedTranscriptsRef = useRef<string[]>([]);
  // R32 (H1 review round 1, Finding 1): a queueOnMidUtterance push has a
  // guaranteed drain ONLY when brainBusyRef was true at push time (the
  // while-loop drain / 90s busy-watchdog own it then). When brainBusyRef is
  // false at push time — the common case, since the aborted call's finally
  // clears it well before the async verdict resolves — nothing else is
  // watching the push. This timer is that guarantee: see the arm site in
  // handleStudentTranscriptForBrain's mid-utterance guard.
  const queueMidUtteranceDrainTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Round-16 Issue 1: live mirror of the hasStarted state for closures that
  // capture stale state (the handleRef effect). See the sync effect near the
  // hasStarted declaration.
  const hasStartedRef = useRef(false);

  // Variable-name continuity: track declared functions across the session.
  // When the tutor silently renames f→g without redeclaring, we rewrite the
  // incoming equation back to the declared name before rendering.
  const declaredFunctionsRef = useRef<DeclaredFunction[]>([]);

  // Equations emitted on the whiteboard during the current response turn.
  // Used for voice↔whiteboard math-consistency check at response.done.
  const turnEquationsRef = useRef<string[]>([]);

  // Last latex rendered on the whiteboard. Used to dedup consecutive identical
  // showEquation emissions (the model sometimes re-emits the same formula —
  // e.g. after a student says "I don't see it" — leaving two copies on the
  // board). A trailing whitespace / casing difference is treated as identical.
  const lastEquationLatexRef = useRef<string>('');
  // Session-scoped registry of show_equation labels seen so far.
  // Keyed by normalized-label (decorations stripped — see use site for
  // the strip list). Used to surface label-duplicate emissions back to
  // the brain as a tool rejection so it learns to either keep the
  // original card or pick a structurally different label, instead of
  // decorating with ✓ / ✗ / (final) / (1) and producing duplicate
  // cards. Observed 2026-05-02 session.
  const equationLabelsThisSessionRef = useRef<Map<string, { originalLabel: string; originalLatex: string; latexNormalized: string }>>(new Map());

  // Set of step indices already emitted on the CURRENT page via a
  // showEquation labeled "Step N: …" or "Step N — …". Used to drop
  // sentences in which the brain refers to "Step N" / "step three"
  // when no such step has been put on the board for the active
  // problem yet. Observed 2026-05-04 JEE coord-geo session: brain
  // narrated "Step 3 — do you see why the line through the foot of
  // perpendicular …" before any step-cards were emitted, pulling
  // a generic-template formula into a problem where it didn't
  // belong (h·x + k·y = h² + k² for foot-of-perpendicular, against
  // a parabola midpoint locus problem). Cleared on every newPage.
  const stepsEmittedOnCurrentPageRef = useRef<Set<number>>(new Set());

  // The current problem being worked (from show_problem or a top-level
  // `Integral_a^b ... dx`-style equation). Used for spoken-final-answer
  // verification: when the tutor says "the answer is X", we ask Wolfram to
  // compute the true answer and compare.
  const currentProblemRef = useRef<{ statement: string; kind: 'integral' | 'generic'; source?: 'student' | 'generated' | 'card'; expectedAnswer?: string; hasChoices?: boolean } | null>(null);
  // R33: whitespace-collapsed statements of every problem card served this
  // session (showProblem + try-yourself). The show_problem divergence guard
  // consults it: substituting the authored segment card is WRONG when that
  // card was already served — the student just solved it and asked for
  // another one (live 2026-07-25: "Are you giving me the same problem?").
  const servedProblemStatementsRef = useRef<Set<string>>(new Set());
  // 2026-07-17 (expectedAnswer pin): the most recent generate_problem
  // resolution, delivered via the 'generated-problem' SSE event. When the
  // brain's follow-up show_problem renders the matching canonicalText, the
  // expectedAnswer is attached to currentProblemRef so it rides EVERY later
  // turn's <active_problem> block — the fix for verification drift (the
  // brain re-deriving mid-thread, dropping a factor, and affirming a wrong
  // answer while the verified one sat in a stale tool_result).
  const pendingGeneratedAnswerRef = useRef<{ statement: string; expectedAnswer?: string } | null>(null);

  // Walk-through insistence counter for the current problem. The tutor should
  // default to Socratic; only switch to walk-through mode after the student
  // insists a second time ("no, just walk me through it", "I said show me,
  // don't ask"). Reset on new problem requests.
  const walkThroughInsistenceRef = useRef(0);
  // Round 29: hands-off mode — student asked to work without guidance.
  // Set by isTryAloneRequest, cleared when they ask for help again.
  const tryAloneRequestedRef = useRef(false);

  // Adaptive-pacing v1 — session-scoped dedup for `generate_problem`.
  // Bank IDs (when bank entries are shown) and content hashes (for
  // brain-gen + plan-authored fallbacks) accumulate during the
  // session and are sent on each brain turn so the pipeline excludes
  // already-shown problems. Reset on session start (handled implicitly
  // by component remount).
  //   shownProblemIdsRef     → bank rows shown this session.
  //   shownProblemHashesRef  → simpleHash(problemText) for non-bank
  //                            problems shown this session.
  // The brain MAY explicitly ask to repeat (intent class
  // `repeat_previous`); the dedup is then bypassed at the call site.
  const shownProblemIdsRef = useRef<string[]>([]);
  const shownProblemHashesRef = useRef<string[]>([]);
  // Tracks whether the brain narrated language consistent with the
  // pipeline returning no_problem_available (e.g. "I don't have a
  // clean follow-up", "the bank's tapped out") earlier in this
  // session. Server-side `generate_problem` outcomes aren't directly
  // observable on the client, but the brain's narration is — so we
  // pattern-match on it. Used by the dedup-rejection feedback to push
  // the brain toward improvise-with-disclaimer instead of retrying
  // generate_problem when the bank is genuinely exhausted (observed
  // 2026-05-02: brain re-emitted show_segment_card three times
  // because the rejection feedback listed generate_problem as the
  // first recovery option, but generate_problem had already returned
  // null earlier in the session).
  const noProblemAvailableObservedRef = useRef(false);
  // Round-7+++ Fix: track segment ids the brain has already marked
  // complete this session. Used to block show_segment_card calls that
  // would regress the student to a previously-solved problem.
  // Observed 2026-05-03 session: after several rounds of harder
  // improvised problems, brain emitted show_segment_card("try-mean-1")
  // on a "harder problem" request, dragging the student all the way
  // back to the original {2,4,6,8,10} mean problem they'd already
  // solved. The system-prompt ban on this is in place but Sonnet
  // sometimes ignores it; orchestrator-side enforcement is the
  // safety net.
  const completedSegmentIdsRef = useRef<Set<string>>(new Set());
  // 2026-05-15: per-segment requiredPhrases enforcement. Tracks segments
  // whose first non-trivial turn has been checked; the check fires once
  // per segment so we don't re-narrate mid-trace. See the post-stream
  // check site for the matching condition.
  const segmentRequiredPhrasesCheckedRef = useRef<Set<string>>(new Set());
  // 2026-05-23: opener-merge-stress session T18 + T19 both started with
  // verbatim "Let me see what I have for you. Off the top of my head —
  // here's one for you." across consecutive generate_problem hits. The
  // prompt rule (Bridge utterance for generate_problem — VARY across
  // turns; disclaimer pool — VARY) was being ignored by the brain. This
  // ref stores a normalized prefix of the previous turn's text so the
  // post-stream guard can detect verbatim reuse and force a one-retry
  // variation. Only updated on a non-killed final attempt — see the
  // post-stream commit site below.
  const lastBrainOpenerNormalizedRef = useRef<string>('');
  // Round-7+++++ Issue 3 fix: track number-tuples of equations that
  // Wolfram has verified as CORRECT this session. The judge LLM
  // periodically hallucinates arithmetic ("511 ÷ 7 = 72.857"; actually
  // 511/7 = 73 exactly since 7×73 = 511) and kills the brain's
  // correct claim. When the judge's kill claim numerically overlaps
  // with a Wolfram-verified equation, downgrade the kill to advisory
  // — Wolfram's exact arithmetic outranks the judge's heuristic check.
  // Stored as Set of joined integer tokens (e.g., "511|7|73") so a
  // judge claim citing those same numbers can be matched fast.
  const wolframVerifiedNumberSetsRef = useRef<Set<string>>(new Set());
  // Per-equation token sets. Each Wolfram-verified equation contributes
  // ONE entry (a Set<string> of its integer tokens). Used by the
  // wolfram-override path to require that a judge-killed claim's
  // tokens substantially overlap with A SINGLE verified equation, not
  // just the flat union across all session-verified equations. The
  // flat union (wolframVerifiedNumberSetsRef above) is preserved for
  // single-token claims ("the mean is 73") where per-equation
  // matching is unnecessary. Observed 2026-05-06 session: brain wrote
  // "(16+24+32+40+48)/5 = 160/5 = 30" (wrong: actual = 32); judge
  // KILLed correctly; flat-union override saw 24, 30, 40 overlap with
  // earlier-session verified equations and downgraded the kill →
  // brain's wrong answer slipped through.
  const wolframVerifiedEquationsRef = useRef<Array<Set<string>>>([]);
  // Round-7++++ Fix Issue 8: bridge-phrase rotation. Track the last
  // generate_problem hedged-bridge sentence the brain spoke. When the
  // brain repeats the SAME phrase next turn (Sonnet defaults to "Let
  // me see what I have for you" 5/7 turns observed 2026-05-04 even
  // with a system-prompt rotation rule), the orchestrator swaps the
  // sentence to a different alternate from the pool BEFORE TTS dispatches.
  // Same applies to the post-tool improvise-with-disclaimer opener.
  // Stored as the normalized form so casing/punctuation drift doesn't
  // cause false misses.
  const lastBridgePhraseRef = useRef<string>('');
  const lastDisclaimerPhraseRef = useRef<string>('');

  // Whiteboard markup initiative — Phase 1 (audit 2026-05-13).
  // Targets the brain passed to tutor_scribble that the runtime silently
  // dropped (no_match / whole-item alias / iframe). One-turn lifetime:
  // pushed at each silent-drop branch below, drained into the next
  // brain stream request as `<unrealized_marks>` advisory, then cleared.
  // Compatible with Round-7+ silent-drop: surfaces NEXT turn, not same
  // turn — no audio cascade. Brain reads the advisory and adjusts
  // narration so it stops promising marks that won't land.
  const unrealizedMarkRef = useRef<string[]>([]);
  // show_* tool calls collapsed by cross-turn dedup (structuralAxesFor
  // axes match an existing catalog item). The brain otherwise has no
  // way to know its re-render was suppressed and proceeds to teach
  // against the cell content from the second (unrendered) emission —
  // catastrophe observed 2026-05-13 G5 comparison_table session where
  // student typed the correct cell from the visible table and brain
  // corrected to a cell from its unrendered re-render. Same pattern as
  // unrealizedMarkRef: drained into the next brain stream request as
  // `<deduplicated_renders>` advisory, cleared after dispatch.
  const deduplicatedShowsRef = useRef<string[]>([]);
  // Deferred auto-newPage from a prior segment advance. The advance_lesson
  // handler used to emit a fresh newPage UNCONDITIONALLY on every segment
  // transition (line ~2440-2455), which leaves a blank page when the next
  // segment's teaching content is structurally identical to the prior
  // segment's (organizer dedup fires, no fresh content lands). Now we
  // store the would-be newPage here and only fire it on the next batch
  // IF at least one teaching command in that batch will actually render
  // (not dedup). If every teaching command dedups, the page stays
  // deferred — preventing the empty-page-after-advance bug observed
  // 2026-05-13 (10) session.
  const pendingAdvanceNewPageRef = useRef<{ title: string; segmentId: string } | null>(null);

  // Engagement / fatigue tracking. We track the last N student reply lengths
  // and fire a diagnostic prompt when replies collapse to short monosyllables
  // ("ok", "k", "yea") — a reliable signal the student has disengaged or is
  // coasting. Also triggers a session-duration-based check-in at 45 min.
  const recentReplyLengthsRef = useRef<number[]>([]);
  const lastFatigueInjectionAtRef = useRef(0);
  const sessionStartMsRef = useRef<number>(Date.now());
  const longSessionCheckFiredRef = useRef(false);
  // Task E1 (pedagogy): wallclock ms when the session ACTUALLY started —
  // the student's first Start/mic tap or resume-continue (the same moments
  // that fire onSessionStarted, which drives the visible SessionControls
  // timer). sessionStartMsRef above is MOUNT time and is reset by session
  // rotation; the demo-stop clock (and the demo hard-stop cap) must count
  // teaching time from the real start, so it gets its own ref that survives
  // rotation. null until the session starts (the demo-stop computation falls
  // back to mount time — a conservative overestimate for the pre-start edge
  // case; the hard-stop timer simply waits until it's non-null). Stamped
  // UNCONDITIONALLY at first start (was flag-gated): the hard-stop cap is a
  // product/safety timer that must work even with TUTOR_PEDAGOGY_OPENER off,
  // and the flag-gated demo-stop read is unaffected by an always-set value.
  const voiceSessionStartedAtMsRef = useRef<number | null>(null);
  // Mirror of the onSessionStarted prop for stable access from the handleRef
  // effect (same pattern as sendTextMessageRef / resumeContinueRef — the
  // effect's dep list must not churn every render to see the latest closure).
  const onSessionStartedRef = useRef<typeof onSessionStarted>(onSessionStarted);
  onSessionStartedRef.current = onSessionStarted;
  // Demo hard-stop one-shot latch — guarantees the wall-clock cap ends the
  // session exactly once even if the timer effect re-subscribes (onEndSession
  // identity churns per turn via the embed's useCallback deps).
  const hardStopFiredRef = useRef(false);

  // Pacing v2 — Phase 1 (inert): student-aware difficulty/depth
  // modulation signals. These refs accumulate signals from the student's
  // answer stream. Phase 1 only logs + surfaces them as a counter block
  // in the brain prompt; Phase 2 will gate advisory hints; Phase 3 will
  // wire UI buttons + paceBias depth preference. Keyed on
  // currentSegmentIdRef so segment changes naturally reset the streak.
  // Reset rules + composite-correctness definition documented in
  // project_pacing_v2_design.md.
  const studentStreakRef = useRef<{ segId: string; count: number }>({ segId: '', count: 0 });
  const studentIncorrectStreakRef = useRef<{ segId: string; count: number }>({ segId: '', count: 0 });
  const studentCueRef = useRef<{ cue: string; turn: number } | null>(null);
  // Session-level depth preference. -2..+2. Negative = student wants more
  // depth/explanation. Positive = student wants less. Stepped by Slow
  // down / Speed up button clicks (Phase 3) AND matching verbal cues.
  // Resets only on session unmount.
  // Task Y5: defaults to -1 ("slow") rather than neutral 0 for every new
  // session — better pedagogical default, still fully adjustable, clamps
  // unchanged. A persisted pacing-v2 blob (any explicit numeric paceBias,
  // including 0) still wins on resume — see resolvePaceBiasOnLoad /
  // pace-preference.ts for the full derivation + the "never set" vs "set
  // to 0" writeup.
  const paceBiasRef = useRef<number>(DEFAULT_PACE_BIAS);
  // Task W4: "Speak slower" TTS toggle. A SEPARATE knob from paceBias above
  // — this only asks the HTTP-TTS provider (relayMode.speakingRate, read by
  // useOpenAIRealtime's fetchTTSPromise) to synthesize slower audio; it does
  // NOT change depth/verbosity the way paceBias does. Modeled as React state
  // (not a bare ref like paceBiasRef) because relayMode is rebuilt every
  // render — the nested useOpenAIRealtime call only picks up a new
  // speakingRate value if THIS component actually re-renders, which a plain
  // ref mutation would not trigger. speakingRateRef below mirrors the state
  // purely so persistPacingState (a ref-only closure, see below) can read
  // the current value without adding state to its dependency array.
  const [speakingRate, setSpeakingRateState] = useState<'slow' | 'normal'>('normal');
  const speakingRateRef = useRef<'slow' | 'normal'>('normal');
  useEffect(() => { speakingRateRef.current = speakingRate; }, [speakingRate]);
  // Task Y1: starter-chip practiceOverride. "Practice problems" sets it,
  // "Explain a concept" clears it — see derivePracticeMode for the full
  // precedence contract (sessionGoal = launch context, this = in-session
  // intent, ORs in and only ever forces practiceMode ON). Persisted in the
  // same pacing-v2 blob as paceBias/speakingRate (persistPacingState below)
  // so it survives a resume of the same plan. Bare ref, not state — nothing
  // in THIS component's own render depends on the value; only the per-turn
  // brain-call body reads it (via setPracticeOverride's setter below) and
  // the parent's chip UI (via onPracticeOverrideChange).
  const practiceOverrideRef = useRef<boolean>(false);
  // Set when mark_segment_complete fires AND streak >= 2 at that moment.
  // Renders a "segment-mastered" hint in next-turn student_state block.
  // Cleared on segment change (one-shot signal).
  const segmentMasteredFlagRef = useRef<{ segId: string; streakAtComplete: number } | null>(null);
  // Per-session monotonic turn counter. Used to gate cue freshness
  // (sticky for one student turn, dropped on the next) and to compute
  // "applied since N turns ago" for paceBias. Incremented on every
  // student utterance arrival path (transcript, typed input, button
  // injection).
  const pacingTurnCounterRef = useRef<number>(0);
  // Per-segment student-turn count. Used by the segment-boundary
  // check-in eligibility gate (Phase 4 / Q4 (c)). Incremented on every
  // verification turn within a segment. Resets on segment change.
  const segmentTurnCountRef = useRef<{ segId: string; count: number }>({ segId: '', count: 0 });
  // Boredom-cue regex (verbatim per design). Matches case-insensitive,
  // word-bounded where word-bounded matters. "skip" matches "skip this"
  // / "let's skip" but not "skipper". Verbal "slow down" / "speed up"
  // also feed paceBias steps in Phase 3.
  const boredomCueRegex = /\b(i\s+know\s+this|obviously|skip(\s+this)?|duh|easy|boring|next|too\s+fast|slow\s+down|slower|faster|speed\s+up)\b/i;
  // Brain-affirmation regex with negation guard. Matches at start of
  // brain's sentence (post strip). Negation lookahead prevents "Good
  // thinking, BUT…" or "Correct so far, however…" from incrementing
  // streak. Used for non-Wolfram subjects (ELA, history, biology).
  // Broadened post-2026-05-05 session: brain frequently opens correct-
  // answer affirmations with "Yes — N!" / "Right — N." / "Nice — N!" /
  // "Great — that's it!" — original list (exactly, that's right, ...)
  // missed all of these. Generic terms only; negation lookahead unchanged.
  // 2nd round (post-2026-05-06 session): brain commonly markdown-bolds
  // the affirmation word ("*Exactly* — six!", "*Yes* — eight!"). The
  // anchor `^` previously failed on the leading `*`. Allow zero or more
  // markdown emphasis prefix chars (`*`, `_`, `~`) before the word.
  const brainAffirmationRegex = /^[*_~`]*(exactly|that'?s right|that is right|correct|perfect|nice work|nice job|nice|good job|good|great|right|yes|yep|yeah|spot[\s-]?on|absolutely|you got it|you'?ve got it|you have got it|you'?re right|bingo)(?!.*\b(but|however|not\s+quite|almost|let\s+me\s+(?:re)?check|wait|actually|hmm|hold on|wrong|incorrect))/i;
  // Brain-correction regex. Matches phrases that indicate the student
  // got the answer wrong. Resets correct-streak, increments wrong-streak.
  const brainCorrectionRegex = /\b(not\s+quite|that's\s+not|that\s+is\s+not|let's\s+(?:re)?check|almost|close\s+but|incorrect)\b/i;
  // Session-end signal regex (Task Y4 farewell-exemption fix). Mirrors the
  // "Session-end signals" trigger-phrase list verbatim from the
  // system-prompt (system-prompt-builder.ts ~907-913) — that section is a
  // prompt-only HARD RULE with no prior code-side detector. Scope is
  // intentionally narrow: it classifies the STUDENT's utterance that
  // preceded this brain turn, not the tutor's own reply. When it matches,
  // the tutor's upcoming turn is expected to be a farewell/wrap-up close
  // per that rule, so any "must end with a next move" corrective (Rule 20 /
  // the bare-praise-ending advisory below) must NOT fire against it — Rule
  // 20 explicitly carves out "a genuine session-end signal from the
  // student" as the one case where ending without a next move is correct.
  // Deliberately generous (short words like "stop"/"quit"/"exit" match
  // anywhere in the utterance): a false POSITIVE here only skips planting
  // an advisory note for one turn (low cost — same "advisory, not a kill"
  // tolerance already accepted for this detector); a false NEGATIVE would
  // reintroduce the exact bug this fix targets.
  const sessionEndSignalRegex = /\b(i'?m\s+done|i\s+am\s+done|i'?m\s+finished|stop|wrap\s+it\s+up|wrap\s+up|end\s+the\s+session|end\s+here|i\s+want\s+to\s+end|quit|exit|i'?m\s+out|goodbye|good\s+bye|bye|see\s+you)\b/i;
  // Bridges callBrainOnce student-utterance bookkeeping → end-of-brain-
  // stream streak update. Captures the student utterance's
  // classification at turn-start so the post-stream code knows whether
  // to even consider streak changes. Pure-ack turns ("ok", "yeah")
  // never update the streak regardless of what the brain says next.
  const lastStudentVerificationRef = useRef<{ turn: number; segId: string; isVerification: boolean; isSessionEndSignal: boolean; activeStatement?: string } | null>(null);
  // Buffer of [pacing] events fired during the most recent brain turn.
  // Forwarded server-side on the NEXT brain stream request body so the
  // /api/tutor/brain/stream route can write them to the server log
  // (browser console.log doesn't reach serverlog_*.txt reliably). Drained
  // after each brain stream call.
  const pacingTelemetryRef = useRef<string[]>([]);
  // Helper: log a [pacing] line to BOTH the browser console (immediate
  // diagnostics in DevTools) AND the server-forward buffer (so the next
  // brain stream call can ship it to serverlog via the route's
  // pacingTelemetry handler). Caller passes the body without the
  // "[pacing] " prefix; helper adds it.
  const logPacing = useCallback((body: string) => {
    const line = `[pacing] ${body}`;
    console.log(line);
    pacingTelemetryRef.current.push(line);
  }, []);
  // Phase 3: paceBias step. Negative = student wants more depth/slower
  // teaching; positive = less depth/faster. Clamped -2..+2. Caller is
  // either a button click (Slow down / Speed up) or a matched verbal
  // cue ("slow down" / "faster" etc — see boredomCueRegex extension
  // below). Records `<pace_preference>` setting time so the prompt
  // formatter can compute "applied since N turns ago".
  const paceBiasSetTurnRef = useRef<number>(0);
  // Round-15 Issue 6: true once the pace was set via the BUTTONS this
  // session (or restored from a button-marked blob). Only button-set bias
  // persists as a durable cross-session preference — cue-derived bumps
  // (STT mishears, content phrases like "the car speeds up") stay
  // session-local. See resolvePaceBiasOnLoad (pace-preference.ts).
  const paceBiasButtonSetRef = useRef(false);
  const onPaceBiasChangeRef = useRef(onPaceBiasChange);
  useEffect(() => { onPaceBiasChangeRef.current = onPaceBiasChange; }, [onPaceBiasChange]);
  // #7 hybrid: standing problem-difficulty preference. -1 (easier) .. +2
  // (much harder), 0 = neutral. Set ONLY by the Harder/Easier menu chips
  // (inherently button-set — no verbal-cue path, so the round-15 cue-vs-
  // button persistence split doesn't apply: any persisted value restores).
  const difficultyBiasRef = useRef(0);
  const onDifficultyBiasChangeRef = useRef(onDifficultyBiasChange);
  useEffect(() => { onDifficultyBiasChangeRef.current = onDifficultyBiasChange; }, [onDifficultyBiasChange]);
  // Practice meter (2026-07-17): distinct problems shown + brain-affirmed
  // solves this session. Presented increments at the shownProblemHashes
  // new-hash site (every distinct problem card, any provenance); solved at
  // the post-stream affirmed-verification site (same guard as the pacing
  // streak, so pure acks / retries never count). Surfaced via
  // onPracticeStatsChange for the practice/no-plan progress display.
  const practicePresentedRef = useRef(0);
  const practiceSolvedRef = useRef(0);
  // Round-19 (2026-07-17, live: "✓ 6 solved · 4 shown"): solved was
  // counting affirmed-verification TURNS — multi-step problems produce
  // several affirmations each, and hook-phase Q&A affirmations counted
  // with no problem on the board at all. A problem now counts as solved
  // ONCE (statement-hash set) and only when a problem is actually active.
  const practiceSolvedHashesRef = useRef<Set<string>>(new Set());
  // Round-22: SESSION-LOCAL solve streak for the meter. The pacing streak
  // resumes across sessions (by design), which read as "🔥 ×11" beside
  // "0 solved" on a fresh session — incoherent. The meter's flame now
  // counts consecutive solves THIS session, reset on a wrong answer.
  const practiceStreakRef = useRef(0);
  const onPracticeStatsChangeRef = useRef(onPracticeStatsChange);
  useEffect(() => { onPracticeStatsChangeRef.current = onPracticeStatsChange; }, [onPracticeStatsChange]);
  // Ref-assigned every render (endSessionNowRef pattern) so every call
  // site — command loop, post-stream verification, override setter — can
  // fire it without threading it through dependency arrays.
  const emitPracticeStatsRef = useRef<() => void>(() => {});
  const onSpeakingRateChangeRef = useRef(onSpeakingRateChange);
  useEffect(() => { onSpeakingRateChangeRef.current = onSpeakingRateChange; }, [onSpeakingRateChange]);
  const onPracticeOverrideChangeRef = useRef(onPracticeOverrideChange);
  useEffect(() => { onPracticeOverrideChangeRef.current = onPracticeOverrideChange; }, [onPracticeOverrideChange]);
  // R34 T4: manual-mic mode change notifier — ref-mirrored (same pattern as
  // the pacing callbacks above) so setManualMic below always calls the
  // latest parent callback without needing it in a dependency array. The
  // ref's initial value (set here, during render) already covers the
  // mount-time localStorage-restore effect above, which fires before this
  // effect re-syncs on prop changes.
  const onManualMicChangeRef = useRef(onManualMicChange);
  useEffect(() => { onManualMicChangeRef.current = onManualMicChange; }, [onManualMicChange]);
  // R34 T4: join the buffer (mergeHeldTranscript reduction — same merge
  // logic Task 3's incomplete-hold uses) and dispatch it through the SAME
  // processing continuation the auto path uses (perceptionOnTranscript,
  // re-entered via its forward-ref exactly like the hold-flush timer does).
  // bypassHold=true — a joined manual turn is never itself held; heldSpeech-
  // StartedAt is omitted (undefined) — this text was never "held" in Task
  // 3's sense, so the self-voice-defense window derives its anchor fresh
  // from tMs/latencyMs like any ordinary transcript. bypassManualBuffer=true
  // — this call IS the manual buffer's own exit path; without it the joined
  // text would just re-buffer itself.
  const flushManualBuffer = useCallback(() => {
    if (manualBufferRef.current.length === 0) return;
    const parts = manualBufferRef.current.splice(0);
    setManualBufferCount(0);
    const joined = parts.reduce((acc, part) => (acc ? mergeHeldTranscript(acc, part) : part), '');
    onDebugEvent?.('manual_sent', joined.slice(0, 60));
    perceptionOnTranscriptRef.current?.(
      { text: joined, tMs: Date.now(), latencyMs: 0, itemId: `manual-${Date.now()}` },
      true,
      undefined,
      true,
    );
  }, [onDebugEvent]);
  // R34 T4: set the per-device Manual mic mode (⋯ menu Auto/Manual row via
  // handleRef.setManualMic). Manual→Auto with a non-empty buffer sends it
  // FIRST (never drops words — brief Step 4); Auto→Manual is a bare flip
  // (nothing buffered yet, since buffering only happens while already in
  // manual mode).
  const setManualMic = useCallback((v: boolean) => {
    if (manualMicRef.current === v) return;
    if (!v) {
      flushManualBuffer();
      // Review round 1 (Finding 2): a ✓ tap while mid-utterance arms
      // manualSendPendingRef and leaves it armed until the in-flight
      // transcript finalizes (see the manual-buffer branch above). If the
      // student switches to Auto before that happens, the flag would stay
      // armed — re-enabling Manual later would then silently auto-flush the
      // NEXT buffered transcript without a tap. Clear it here, on every
      // Manual→Auto transition, so leaving manual mode always fully retires
      // any pending manual-mode intent.
      manualSendPendingRef.current = false;
    }
    manualMicRef.current = v;
    setManualMicState(v);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        if (v) window.localStorage.setItem('evelyn-manual-mic', 'on');
        else window.localStorage.removeItem('evelyn-manual-mic');
      }
    } catch (err) {
      console.warn('[VoiceTutorRealtime] manual-mic localStorage write failed:', err);
    }
    onDebugEvent?.('manual_mode_toggled', v ? 'manual' : 'auto');
    onManualMicChangeRef.current?.(v);
  }, [flushManualBuffer, onDebugEvent]);
  // Session end/unmount: clear the buffer (Step 4 teardown hygiene — a
  // component unmount is not a "send", it's the session going away).
  useEffect(() => () => {
    manualBufferRef.current = [];
  }, []);
  // Phase 4: persist pacing state to localStorage so it carries over
  // when the same lesson plan is re-launched. Keyed on plan.id;
  // session-unmount + paceBias-step both call this. No-op when no
  // plan is loaded (free-conversation).
  // Task W4: speakingRate rides in the SAME evelyn:pacing-v2:<planId> blob
  // (matches paceBias's persistence choice exactly, per task brief) rather
  // than a second localStorage key — one read, one write, one TTL.
  const persistPacingState = useCallback(() => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      const planId = lessonPlanRef.current?.id;
      if (!planId) return;
      const key = `evelyn:pacing-v2:${planId}`;
      const payload = {
        paceBias: paceBiasRef.current,
        // Round-15 Issue 6: mark bias that the student chose via the pace
        // BUTTONS. On a FRESH session (vs resume), resolvePaceBiasOnLoad
        // only honors button-marked bias — unmarked (legacy / cue-derived)
        // values fall back to the slow default instead of leaking a stale
        // "fast" into a brand-new session (the 2026-07-16 live bug).
        ...(paceBiasButtonSetRef.current ? { paceBiasSource: 'button' } : {}),
        // #7 hybrid: standing difficulty preference. Only chips set it, so
        // no source marker needed — any persisted value is deliberate.
        ...(difficultyBiasRef.current !== 0 ? { difficultyBias: difficultyBiasRef.current } : {}),
        correctStreakCount: studentStreakRef.current.count,
        incorrectStreakCount: studentIncorrectStreakRef.current.count,
        speakingRate: speakingRateRef.current,
        // Task Y1: only persist the override when it's actually set — an
        // absent key (rather than `false`) keeps old blobs (pre-Y1)
        // forwards-compatible and matches the "no forced-off state" design
        // (see practice-mode.ts): nothing to restore ⇒ token goal governs.
        ...(practiceOverrideRef.current ? { practiceOverride: true } : {}),
        savedAt: new Date().toISOString(),
      };
      window.localStorage.setItem(key, JSON.stringify(payload));
    } catch (err) {
      console.warn('[VoiceTutorRealtime] pacing-v2 persistence save failed:', err);
    }
  }, []);
  // Save on unmount (most common session-end path — `key={sessionId}`
  // remount). Also save on visibilitychange → hidden so tab-close /
  // tab-switch captures recent state. The save is idempotent and
  // cheap (small JSON write); double-saves are fine.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onHide = () => {
      if (document.visibilityState === 'hidden') persistPacingState();
    };
    document.addEventListener('visibilitychange', onHide);
    return () => {
      document.removeEventListener('visibilitychange', onHide);
      persistPacingState();
    };
  }, [persistPacingState]);
  const stepPaceBias = useCallback((delta: -1 | 1, source: 'button' | 'cue', detail?: string) => {
    const from = paceBiasRef.current;
    const to = Math.max(-2, Math.min(2, from + delta));
    if (to === from) {
      logPacing(`pace-bias-step delta=${delta} from=${from} to=${to} source=${source} (clamped${detail ? `, ${detail}` : ''})`);
      // Even on clamp, surface the no-op so the parent can flash a
      // "max reached" hint if it wants. The bias value didn't change
      // but the user's intent was registered.
      onPaceBiasChangeRef.current?.(to);
      return;
    }
    paceBiasRef.current = to;
    paceBiasSetTurnRef.current = pacingTurnCounterRef.current;
    logPacing(`pace-bias-step delta=${delta} from=${from} to=${to} source=${source}${detail ? ` cue="${detail}"` : ''}`);
    onPaceBiasChangeRef.current?.(to);
    // Round-15 Issue 6: only a BUTTON step marks the bias as a durable
    // cross-session preference; cue steps adjust this session only.
    if (source === 'button') paceBiasButtonSetRef.current = true;
    persistPacingState();
  }, [logPacing, persistPacingState]);
  // Task W4: "Speak slower" toggle, set directly (not stepped like
  // paceBias) — the ⋯ menu item just flips between 'slow' and 'normal'.
  // setSpeakingRateState triggers a re-render of THIS component so the
  // relayMode object passed to useOpenAIRealtime is rebuilt with the new
  // value (see speakingRate state declaration above for why a bare ref
  // mutation would not be picked up by the nested hook call).
  const setSpeakingRate = useCallback((rate: 'slow' | 'normal') => {
    if (speakingRateRef.current === rate) return;
    speakingRateRef.current = rate;
    setSpeakingRateState(rate);
    logPacing(`speaking-rate-set rate=${rate}`);
    onSpeakingRateChangeRef.current?.(rate);
    persistPacingState();
  }, [logPacing, persistPacingState]);
  // Task Y1: starter-chip practiceOverride, set directly (not stepped) — the
  // "Practice problems" chip sets it true, "Explain a concept" clears it to
  // false. Bare ref (no state re-render needed — see practiceOverrideRef
  // declaration above), so this is just a mutation + notify + persist.
  const setPracticeOverride = useCallback((active: boolean) => {
    if (practiceOverrideRef.current === active) return;
    practiceOverrideRef.current = active;
    logPacing(`practice-override-set active=${active}`);
    onPracticeOverrideChangeRef.current?.(active);
    // Practice meter: mode flips swap the progress display immediately.
    emitPracticeStatsRef.current();
    persistPacingState();
  }, [logPacing, persistPacingState]);
  // #7 hybrid: set the standing difficulty preference. Clamped to the
  // Difficulty scale's reachable notches (-1 = slightly_easier is the only
  // easier notch; +2 = much_harder). Persisted in the same pacing blob.
  const setDifficultyBias = useCallback((bias: number) => {
    const to = Math.max(-1, Math.min(2, Math.round(bias)));
    if (difficultyBiasRef.current === to) return;
    difficultyBiasRef.current = to;
    logPacing(`difficulty-bias-set bias=${to}`);
    onDifficultyBiasChangeRef.current?.(to);
    persistPacingState();
  }, [logPacing, persistPacingState]);

  // Monotonic ID counters per action type — stamped onto every rendered
  // whiteboard command so the tutor can reference items it created earlier
  // via targetId (e.g. "showSpringMass-1"). Surfaced in tool_call_output
  // responses so the tutor sees the id and can remember it.
  const idCountersRef = useRef<Map<string, number>>(new Map());
  // Map from assigned id back to the command object itself + the batch
  // order in which it arrived. Used by scribble/scrollTo to resolve
  // targetId into "which page + which item" at render time. Also stores
  // the feature manifest (if the renderer has been migrated) so the
  // list_whiteboard_features tool can resurface it when the original
  // tool-result has rolled out of the Realtime context window.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const commandByIdRef = useRef<Map<string, { cmd: any; order: number; manifest?: FeatureManifestEntry[] }>>(new Map());
  // Authoritative session catalog — every rendered item + its labeled
  // features, keyed by itemId. scribble.target is resolved against this
  // deterministically (no fuzzy DOM lookup, no featAliases). The tutor
  // never picks an itemId or a canonical feature name — it picks a
  // human-readable target and the catalog finds the match.
  const catalogRef = useRef<WhiteboardCatalog>(new WhiteboardCatalog());
  // Tracks structural-visual actions (show_* other than
  // Equation/Code/Table/SvgDiagram) already emitted in the current tutor
  // turn. Used by handleWhiteboardCommand to drop a SECOND call to the
  // SAME action within one turn (e.g. showCoordinatePlane emitted twice).
  // Different actions (showProblem + showGraph) are legitimate and pass.
  // Reset on every student transcript finalization.
  const visualActionsThisTurnRef = useRef<Set<string>>(new Set());
  // Tracks whether a newPage tool was dispatched anywhere in the current
  // brain turn. Used to override cross-turn dedup: when the brain has
  // explicitly opened a fresh page in this turn, a follow-up show_*
  // command shouldn't be silently dedup'd against something on a prior
  // page — the student is on a blank page and needs the content there.
  // Observed 2026-04-30 SHM session: brain emitted new_page +
  // show_problem in the same turn but as separate handleWhiteboardCommand
  // calls; the per-batch flag missed it and the misconception question
  // never re-rendered after a wave-diagram detour. Reset alongside
  // visualActionsThisTurnRef on every student transcript finalization.
  const newPageThisTurnRef = useRef(false);
  // Monotonic brain-turn counter for the cross-turn page-grouping staleness
  // backstop (a page gone N render-less turns is auto-closed). Incremented +
  // mirrored into the catalog (setCurrentTurn) at brain-call start; the
  // catalog stamps it onto Page.lastRenderTurn on every render append. See
  // project_tutor_page_grouping_design.md.
  const pageTurnRef = useRef(0);
  // Distinct from newPageThisTurnRef: tracks whether the brain EMITTED
  // a new_page tool-call in the current turn, regardless of whether the
  // tutor-side same-context guard later stripped that command. Set on
  // tool-call event arrival (BEFORE mapFunctionCallToCommand /
  // handleWhiteboardCommand). The divergence guard + silent-substitute
  // bypass uses this so a topic-switch new_page that gets stripped by
  // the same-context guard still suppresses divergence kills + wrong
  // segment substitutes downstream — exact failure mode in the
  // 2026-05-02 incoherence test where mean → median switch deadlocked.
  const brainEmittedNewPageThisTurnRef = useRef(false);
  // Round-7+++++ Issue 1 fix: track generate_problem emission this
  // turn. When the brain calls generate_problem and follows up with
  // show_problem in the same turn, the show_problem statement IS the
  // canonicalText returned by the pipeline — NOT a re-render of the
  // current segment's authored content. The show_problem auto-
  // substitute (which swaps free-form show_problem to show_segment_card
  // when targets match) must NOT fire in this case, because the
  // segment may already be marked complete and the substitute would
  // collapse to a blocked render. Observed 2026-05-04: brain on
  // "Yes" → generate_problem({12,14,16,18,20}) + show_problem(...).
  // currentSegmentIdRef pinned to "try-mean-1" (completed). show_problem
  // substituted to show_segment_card("try-mean-1") → completion-block
  // fired → MAX_VALIDATOR_RETRIES → student stuck.
  const generateProblemThisTurnRef = useRef(false);
  // Round-15 Issue 1: segment id the cursor was inferred-advanced to this
  // turn because show_segment_card resolved to a later segment than the
  // pedagogical cursor (the brain skipped advance_lesson). A relative
  // advance_lesson({to:"next"}) later in the same turn is treated as
  // already satisfied by this inference so the two paths can't
  // double-advance. Cleared at every student-turn entry point;
  // deliberately NOT cleared on validator retries — the cursor move
  // survives the retry, so a retry's advance_lesson must still be
  // absorbed.
  const inferredAdvanceThisTurnRef = useRef('');
  const nextCommandOrderRef = useRef(0);
  // Running log of every whiteboard command this component has dispatched
  // — used by targetId resolution to walk the history and figure out which
  // page a referenced command sits on. Kept in the component (rather than
  // borrowed from the parent) so lookup is synchronous.
  const whiteboardCommandsRef = useRef<WhiteboardCommand[]>([]);

  // Rolling embedding signature of recent student turns. When a new turn
  // lands semantically far from the signature (e.g. ray diagrams →
  // "draw a map of USA"), we inject a synthetic newPage so the
  // whiteboard starts fresh on the new topic — the tutor model itself
  // misses this about half the time. See topic-shift-detector.ts.
  const topicShiftStateRef = useRef<TopicShiftDetectorState>(createTopicShiftState());
  // When the detector fires, we set this flag so the next batch of
  // whiteboard commands gets a synthetic newPage prepended. Same
  // mechanism as the "just-solved" trigger above; they coexist safely
  // (first one to fire wins; the other clears on the same batch).
  const topicShiftPendingRef = useRef<{ fromDistance: number } | null>(null);

  // Most-recent geometry command — kept around so geometry-numeric can
  // verify spoken distance/angle/area claims against the rendered figure.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lastGeometryRef = useRef<{ points: any[]; title?: string } | null>(null);

  // Topics covered + weaknesses tracker. Each time the tutor emits a
  // show_problem / show_equation / newPage, we record the label as the
  // current topic. When the tutor rejects a student answer or the student
  // says "i don't know", we increment the weakness count for the current
  // topic. On session end, we generate a recap + 3 targeted practice
  // problems for the top-weakness topics.
  const currentTopicRef = useRef<string | null>(null);
  const topicsCoveredRef = useRef<string[]>([]);
  const weaknessesRef = useRef<Map<string, number>>(new Map());
  const [isWrappingUp, setIsWrappingUp] = useState(false);

  // 60-minute session-cap proactive rotation. OpenAI Realtime sessions hard
  // cap around 60 minutes; when they drop, the next connection is a fresh
  // session that re-greets the student. We pre-empt this at 55 minutes by
  // surfacing a choice to the student. If they choose to continue, we
  // rotate into a new session with a context summary pre-injected so the
  // tutor resumes from where we left off.
  const [sessionRotationPrompt, setSessionRotationPrompt] = useState(false);
  const sessionRotationFiredRef = useRef(false);
  const autoRotationFiredRef = useRef(false);
  // Ref populated later so handleResponseDone (defined above handleContinueRotation)
  // can trigger a silent rotation when the banner is ignored.
  const continueRotationRef = useRef<(() => Promise<void>) | null>(null);
  // End/Pause teardown — assigned every render below (see the assignment near
  // handleContinueRotation) and read by both the dock button and handleRef.
  const endSessionNowRef = useRef<() => Promise<void>>(async () => {});
  // Turn-length cap (2026-07-15): when a finished turn exceeded the hard cap
  // with zero whiteboard actions, this holds a [cadence note] that rides into
  // the NEXT brain call's transcript and is then cleared. Next-turn (not
  // retry) because enforcement runs post-stream — a retry would re-narrate a
  // turn the student already heard.
  const pendingCadenceNoteRef = useRef<string | null>(null);
  // Bare-praise-ending advisory (Task Y4 addendum): same next-turn-note
  // lifecycle as pendingCadenceNoteRef, but a SEPARATE ref/concern (not
  // gated by TUTOR_TURN_CAP, which is a turn-LENGTH kill-switch unrelated
  // to this lapse). Holds a note when a full-correct-confirmation turn
  // ended with no question and no next-move tool call; spliced into the
  // next callBrainOnce's transcript and cleared, same convention as above.
  const pendingNoAdvanceNoteRef = useRef<string | null>(null);
  // R2 E2: pending board-anchor corrective — same lifecycle as
  // pendingCadenceNoteRef but a SEPARATE ref/concern (a turn can lapse on
  // cadence and anchoring independently).
  const pendingBoardAnchorNoteRef = useRef<string | null>(null);
  // Populated after toggleMicMute is defined so the brain orchestrator (which
  // lives above it) can honour a "mute me" voice command without a forward ref.
  const muteMicRef = useRef<(() => void) | null>(null);

  // Check if text claims to show/display something visually (multi-language)
  // Uses explicit language patterns + a universal math content heuristic
  const claimsToShowVisual = useCallback((text: string): boolean => {
    return WHITEBOARD_INTENT_PATTERNS.some(pattern => pattern.test(text)) || MATH_CONTENT_PATTERN.test(text);
  }, []);

  // Process a single whiteboard validation request
  const processValidationRequest = useCallback(async (tutorText: string) => {
    try {
      // Get the last student message for context
      const lastStudentMsg = transcriptRef.current
        .filter(e => e.role === 'student')
        .slice(-1)[0]?.text;

      // Build recent context (last 4 messages)
      const recentContext = transcriptRef.current
        .slice(-4)
        .map(e => `${e.role === 'student' ? 'Student' : 'Tutor'}: ${e.text}`)
        .join('\n');

      // Actions the tutor ALREADY emitted on this turn (via function_call).
      // Passed to the enricher so it doesn't duplicate commands the tutor
      // handled directly. Limited to the last ~8 to keep the payload small.
      const recentActions = whiteboardCommandsRef.current
        .slice(-8)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((c) => String((c as any).action ?? ''))
        .filter(Boolean);

      const response = await fetch('/api/tutor/generate-whiteboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tutorText,
          studentText: lastStudentMsg || '',
          sessionId: sessionIdRef.current,
          recentContext,
          recentActions,
        }),
      });

      if (!response.ok) return;

      const data = await response.json();
      if (data.commands?.length > 0) {
        console.log('[VoiceTutorRealtime] Validation pass generated', data.commands.length, 'whiteboard command(s):', data.commands.map((c: WhiteboardCommand) => c.action));
        onDebugEvent?.('whiteboard_validation_pass', `Generated ${data.commands.length} command(s)`, { actions: data.commands.map((c: WhiteboardCommand) => c.action) });
        onWhiteboardCommand(data.commands as WhiteboardCommand[]);
        whiteboardCommandCountRef.current += data.commands.length;

        // Find the transcript entry that matches this tutor text and attach commands
        const matchIdx = transcriptRef.current.findIndex(
          (e) => e.role === 'tutor' && e.text === tutorText && !e.whiteboardCommands?.length
        );
        if (matchIdx >= 0) {
          transcriptRef.current[matchIdx] = {
            ...transcriptRef.current[matchIdx],
            whiteboardCommands: data.commands,
          };
          onTranscriptUpdate([...transcriptRef.current]);
        }

        data.commands.forEach((cmd: WhiteboardCommand) => {
          onTrackInteraction?.('tool_use', 'whiteboard', { ...cmd, source: 'validation-pass' });
        });
      } else {
        console.warn('[VoiceTutorRealtime] Validation pass returned 0 commands for tutor text:', tutorText.substring(0, 100));
      }
    } catch (err) {
      console.error('[VoiceTutorRealtime] Whiteboard validation pass failed:', err);
    }
  }, [onWhiteboardCommand, onTranscriptUpdate, onTrackInteraction]);

  // Request missing whiteboard commands from Claude — queues if one is already in flight
  const generateMissingWhiteboardCommands = useCallback(async (tutorText: string) => {
    if (validationInFlightRef.current) {
      // Queue instead of dropping
      validationQueueRef.current.push(tutorText);
      console.log('[VoiceTutorRealtime] Validation in flight, queued request. Queue size:', validationQueueRef.current.length);
      return;
    }
    validationInFlightRef.current = true;

    try {
      await processValidationRequest(tutorText);

      // Process queued requests
      while (validationQueueRef.current.length > 0) {
        const nextText = validationQueueRef.current.shift()!;
        await processValidationRequest(nextText);
      }
    } finally {
      validationInFlightRef.current = false;
    }
  }, [processValidationRequest]);

  // Handle transcript updates from the realtime API
  const handleTranscriptUpdate = useCallback((role: 'user' | 'assistant', text: string, isFinal: boolean) => {
    if (role === 'user') {
      currentUserTextRef.current = text;
      if (isFinal && text.trim()) {
        const raw = text.trim();
        // Stage 3 fix #2 (2026-05-26): suppress chat-add when the
        // production-WS dedupe slot is armed. After a Stage-2/3 cancel,
        // perception WS handles the utterance via FRESH/MERGE; the
        // production WS then re-enables its mic (post hard-stop) and
        // catches the TAIL of the SAME utterance as its own transcript.
        // handleStudentTranscriptForBrain already drops the duplicate
        // brain call, but it runs AFTER this entry-add. Without this
        // guard, the chat shows the same message twice (observed live
        // 2026-05-26: "Why are you writing half and not the full?"
        // duplicated). PEEK only — handleStudentTranscriptForBrain
        // consumes the slot so the brain-call drop also fires.
        const suppress = productionWsTranscriptSuppressRef.current;
        if (suppress && Date.now() < suppress.until) {
          console.warn(`[VoiceTutorRealtime] suppressed production-WS chat-add (perception just handled this utterance): ${JSON.stringify(raw).slice(0, 80)}`);
          onDebugEvent?.('production_ws_chatadd_suppressed', `"${raw.slice(0, 40)}"`);
          currentUserTextRef.current = '';
          return;
        }
        const classification = classifyTranscript(raw, { allowGreetings: !studentHasSpokenRef.current });
        if (classification === 'noise') {
          console.log('[VoiceTutorRealtime] Dropped noise transcript:', raw);
          onDebugEvent?.('noise_filtered', `Filtered: "${raw}"`);
          currentUserTextRef.current = '';
          return;
        }
        // 'uncertain' → forward wrapped so the tutor asks rather than guesses.
        // 'clean'     → forward with the normal spellcheck pass applied.
        const filteredText =
          classification === 'uncertain'
            ? wrapUncertainTranscript(raw)
            : filterTranscriptText(raw);
        if (classification === 'uncertain') {
          onDebugEvent?.('uncertain_transcript', `Wrapped: "${raw}"`);
        }

        // Fire-and-forget: update the topic-shift detector with THIS clean
        // turn's embedding, and if it detects a large semantic jump, set
        // a flag so the next batch of whiteboard commands starts a new
        // page. Skip for 'uncertain' turns — we don't want a garbled
        // transcript to look like a topic pivot.
        if (classification === 'clean') {
          runStudentTurnDetection(raw, 'voice');
        }
        // Add finalized user message to transcript
        const entry: TranscriptEntry = {
          id: `user-${Date.now()}`,
          timestamp: new Date(),
          role: 'student',
          text: filteredText,
        };
        transcriptRef.current = [...transcriptRef.current, entry];
        onTranscriptUpdate(transcriptRef.current);
        onTrackInteraction?.('message', filteredText, undefined, 'student');
        currentUserTextRef.current = '';
        // Fresh student message → fresh tutor turn. Reset the per-turn
        // visual-action tracker so the tutor gets a clean slot to draw
        // one of each visual type for this message.
        visualActionsThisTurnRef.current = new Set();
        newPageThisTurnRef.current = false;
        brainEmittedNewPageThisTurnRef.current = false;
        generateProblemThisTurnRef.current = false;
        inferredAdvanceThisTurnRef.current = '';
        console.log('[VoiceTutor] Student turn start — cleared visualActionsThisTurn');

        // Detect if student is requesting a visual (e.g., "show it on the board")
        const studentRequestsVisual = /\b(show|board|whiteboard|draw|write it|display|diagram|see it|visual)\b/i.test(filteredText);
        studentRequestedVisualRef.current = studentRequestsVisual;

        // Walk-through insistence tracking. A "new problem" request resets the
        // counter; a walk-through phrase increments it. The tutor should only
        // enter walk-through mode when the count reaches 2+.
        if (isNewProblemRequest(filteredText)) {
          walkThroughInsistenceRef.current = 0;
        }
        if (isWalkThroughRequest(filteredText)) {
          walkThroughInsistenceRef.current += 1;
          console.log('[VoiceTutorRealtime] Walk-through insistence count:', walkThroughInsistenceRef.current);
          // Asking for help again ends hands-off mode.
          tryAloneRequestedRef.current = false;
        }
        // Round 29: student asked to work WITHOUT guidance — arm hands-off
        // mode so the bulldozing (SOCRATIC CORRECTION) injection can't
        // re-order the brain to ask a guiding question right after the
        // student asked for the opposite.
        if (isTryAloneRequest(filteredText)) {
          tryAloneRequestedRef.current = true;
          onDebugEvent?.('try_alone_requested', filteredText.slice(0, 80));
        }

        // Engagement tracker — keep a rolling window of the last 6 reply
        // word-counts. Fire a diagnostic if 5+ consecutive replies are ≤2
        // words (typical disengagement pattern: "ok", "k", "yea", "sure").
        const wordCount = filteredText.split(/\s+/).filter(Boolean).length;
        recentReplyLengthsRef.current.push(wordCount);
        if (recentReplyLengthsRef.current.length > 6) recentReplyLengthsRef.current.shift();
        const recent = recentReplyLengthsRef.current;
        const shortCount = recent.filter(n => n <= 2).length;
        const SHORT_THRESHOLD = 5;
        const FATIGUE_COOLDOWN_MS = 5 * 60 * 1000; // at most once per 5 min
        if (recent.length >= SHORT_THRESHOLD
            && shortCount >= SHORT_THRESHOLD
            && Date.now() - lastFatigueInjectionAtRef.current > FATIGUE_COOLDOWN_MS
            && injectContextRef.current) {
          lastFatigueInjectionAtRef.current = Date.now();
          console.warn('[VoiceTutorRealtime] Student fatigue detected — injecting diagnostic prompt');
          onDebugEvent?.('fatigue_detected',
            `${shortCount} of last ${recent.length} replies were ≤2 words`);
          injectContextRef.current(
            'ENGAGEMENT CHECK: The student has given several very short replies in a row ("ok", "yea", "k"). ' +
            'On your next turn, pause the march through new material and ask a diagnostic question instead. ' +
            'Pick the last concept you covered and say something like: ' +
            '"Let me pause for a sec — in your own words, can you explain [the last concept] back to me?" ' +
            'Do NOT move forward to a new topic until you get a substantive answer. ' +
            'If the student still gives a short answer, offer a 30-second break or a recap.'
          );
        }

        // Reset tool call tracking for next response turn
        turnHadToolCallRef.current = false;
      }
    } else {
      currentAssistantTextRef.current = text;
      if (isFinal && text.trim()) {
        // Remove whiteboard command blocks from displayed text
        const cleanText = text
          .replace(/```whiteboard[\s\S]*?```/g, '')
          .replace(/\[Whiteboard\][^\n]*/gi, '')
          .replace(/\[whiteboard command[^\]]*\][^\n]*/gi, '')
          .trim();

        // Perception layer (Stage 1) — capture spoken text into the rolling
        // TTS-script buffer so the classifier's self-voice defence layer
        // can detect tutor-voice contamination on the perception WS. Fires
        // for BOTH engines (claude-brain + legacy Realtime authoring) and
        // happens BEFORE the engine-specific early returns below. No effect
        // when the perception flag is off — the buffer just isn't read.
        if (cleanText) {
          const nowMs = Date.now();
          ttsScriptBufferRef.current.push({
            text: cleanText,
            spokenStartedAt: nowMs,
            spokenEndedAt: nowMs,
          });
          // Keep the buffer trimmed to the last ~8s + padding.
          const cutoff = nowMs - 60_000;
          while (
            ttsScriptBufferRef.current.length > 0 &&
            ttsScriptBufferRef.current[0].spokenStartedAt < cutoff
          ) {
            ttsScriptBufferRef.current.shift();
          }
        }

        // In claude-brain mode the brain orchestrator is the authoritative
        // source of tutor turns: it appends to transcriptRef BEFORE
        // calling speakText. When Realtime then echoes the audio
        // transcript back here, the duplicate detection below sees
        // the orchestrator's entry and (a) injects a spurious
        // "you just repeated yourself" context reminder and
        // (b) appends a second copy. Both wreck subsequent brain
        // turns. Skip the duplicate-detection + append paths in
        // claude-brain mode; just keep the housekeeping.
        if (claudeBrainMode) {
          currentAssistantTextRef.current = '';
          pendingTutorTextRef.current = cleanText;
          return;
        }

        // Duplicate response detection — check if this is identical to a recent tutor message
        const recentTutorMessages = transcriptRef.current
          .filter(e => e.role === 'tutor')
          .slice(-3);
        const isDuplicate = recentTutorMessages.some(
          m => m.text === cleanText || (cleanText.length > 20 && m.text.includes(cleanText.substring(0, Math.floor(cleanText.length * 0.8))))
        );
        if (isDuplicate) {
          console.warn('[VoiceTutorRealtime] Duplicate tutor response detected, injecting correction:', cleanText.substring(0, 80));
          onDebugEvent?.('duplicate_response', `Duplicate: "${cleanText.substring(0, 100)}"`);
          if (injectContextRef.current) {
            injectContextRef.current(
              'You just repeated yourself verbatim. The student already heard this exact response. ' +
              'Acknowledge that the previous answer may not have been clear, and try a DIFFERENT approach — ' +
              'rephrase, use an analogy, or ask the student a clarifying question.'
            );
          }
        }

        // Add finalized assistant message to transcript
        const entry: TranscriptEntry = {
          id: `tutor-${Date.now()}`,
          timestamp: new Date(),
          role: 'tutor',
          text: cleanText,
        };
        transcriptRef.current = [...transcriptRef.current, entry];
        onTranscriptUpdate(transcriptRef.current);
        onTrackInteraction?.('message', cleanText, undefined, 'tutor');
        currentAssistantTextRef.current = '';

        // Store pending text for validation after response.done
        pendingTutorTextRef.current = cleanText;
      }
    }
  }, [onTranscriptUpdate, onTrackInteraction, claudeBrainMode, onDebugEvent]);

  // Validate a tool call via Claude (async, for openai-realtime-validated engine)
  const validateToolCallViaClaude = useCallback(async (
    functionName: string,
    command: WhiteboardCommand,
  ): Promise<WhiteboardCommand> => {
    try {
      const recentContext = transcriptRef.current
        .slice(-4)
        .map(e => `${e.role === 'student' ? 'Student' : 'Tutor'}: ${e.text}`)
        .join('\n');

      // For showGraph, send the inner data for validation (not the wrapper)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cmdAny = command as any;
      const argsToValidate = cmdAny.action === 'showGraph' ? cmdAny.data : command;

      const response = await fetch('/api/tutor/validate-tool-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          functionName,
          arguments: argsToValidate,
          conversationContext: recentContext,
        }),
      });

      if (!response.ok) {
        console.error('[VoiceTutorRealtime] Validation API returned', response.status);
        return command;
      }
      const result = await response.json();

      if (result.corrected && result.data) {
        console.log('[VoiceTutorRealtime] Claude corrected tool call:', result.issues);
        // For showGraph, re-wrap the corrected data
        if (cmdAny.action === 'showGraph') {
          return { ...command, data: result.data } as WhiteboardCommand;
        }
        return { ...command, ...result.data } as WhiteboardCommand;
      }
      return command;
    } catch (err) {
      console.error('[VoiceTutorRealtime] Validation request failed:', err);
      return command; // Fallback to original on error
    }
  }, []);

  // Run student-turn detection (topic-shift embedding + new-problem
  // keyword). Shared between the voice-final handler and the typed-input
  // submit path so typed prompts like "Draw a 30° inclined plane…" don't
  // bypass newPage triggering. No-ops on empty text.
  const runStudentTurnDetection = useCallback((rawText: string, source: 'voice' | 'typed') => {
    const text = (rawText || '').trim();
    if (!text) return;
    // Keyword-based new-problem detector — fires synchronously off the
    // shared pattern set. Guarded by "must have at least one prior
    // show_*" so the very first problem of the session doesn't trigger.
    if (commandByIdRef.current.size > 0) {
      const intent = detectStudentIntent(text);
      if (intent.newProblem) {
        topicShiftPendingRef.current = { fromDistance: 0 };
        console.log(
          `[VoiceTutorRealtime] New-problem keyword (${source}):`,
          intent.matchedPattern,
          '—', text.slice(0, 80),
        );
        onDebugEvent?.('new_problem_keyword', `(${source}) next batch will get newPage`);
      }
    }
    // Embedding-based topic shift (async) — catches pivots that the
    // keyword list misses (e.g. "What's photosynthesis?" after a physics
    // thread).
    void checkTopicShift(topicShiftStateRef.current, text).then((result) => {
      topicShiftStateRef.current = result.nextState;
      if (result.shifted) {
        topicShiftPendingRef.current = { fromDistance: result.distance ?? 0 };
        console.log(
          '[VoiceTutorRealtime] Topic shift detected (distance=',
          result.distance?.toFixed(3), ')',
        );
        onDebugEvent?.('topic_shift', `dist=${result.distance?.toFixed(3)} — next whiteboard batch will get newPage`);
      }
    });
  }, [onDebugEvent]);

  // Apply a RESOLVED lesson-plan advance — move the segment cursor to
  // `next` and run every side-effect a segment transition needs. Shared
  // by the brain-driven advance_lesson command branch (handleWhiteboard-
  // Command, below) and the app-side deterministic Skip-button advance
  // (callBrainOnce, FIX B). `next` MUST be a real segment id already
  // resolved via resolveAdvanceTarget — this helper does not validate it.
  const applyResolvedAdvance = useCallback((plan: LessonPlan, fromSegId: string, next: string) => {
    console.log(`[VoiceTutorRealtime] lesson advance: "${currentSegmentIdRef.current}" → "${next}"`);
    // Auto-mark "visited" segments: every segment from the outgoing
    // index (inclusive) up to the target index (exclusive) is added to
    // completedSegmentIdsRef. Keeps the progress strip advancing even
    // when the brain skipped a segment without mark_segment_complete
    // (observed 2026-05-12 — 5 consecutive skip clicks, strip frozen).
    const outgoingIdx = plan.segments.findIndex((s) => s.id === fromSegId);
    const targetIdx = plan.segments.findIndex((s) => s.id === next);
    if (outgoingIdx >= 0 && targetIdx > outgoingIdx) {
      let mutated = false;
      for (let i = outgoingIdx; i < targetIdx; i++) {
        const segId = plan.segments[i].id;
        if (!completedSegmentIdsRef.current.has(segId)) {
          completedSegmentIdsRef.current.add(segId);
          mutated = true;
        }
      }
      if (mutated) {
        onCompletedSegmentsChange?.([...completedSegmentIdsRef.current]);
      }
    }
    currentSegmentIdRef.current = next;
    setActiveSegmentId(next);
    // Pedagogy opener: the brain advancing the lesson IS the "opening phase
    // over, teaching started" signal (decision #11 — the brain owns the
    // transition; the orchestrator only observes it). Retire the per-turn
    // opening directive so it stops riding along in the brain body.
    if (TUTOR_PEDAGOGY_OPENER) openingDirectiveRef.current = null;
    // Reaching the recap segment is a milestone (value-boxed progress).
    // Task C2: with the completion gate active, arriving at recap only
    // counts if at least one segment was demonstrated this session (gate
    // inactive ⇒ shouldFireRecapMilestone is always true — today's behavior).
    if (getSegment(plan, next)?.kind === 'recap'
        && shouldFireRecapMilestone({
          gateActive: completionGateActiveRef.current,
          demonstratedCount: demonstratedSegmentsRef.current.size,
        })) {
      emitMilestone('recap_reached');
    }
    // Re-entered the plan — drop the stashed pre-free segment.
    segmentBeforeFreeRef.current = '';
    // Mirror into the catalog so subsequent appends stamp the new
    // segment id + the brain's per-turn snapshot filter scopes correctly.
    catalogRef.current.setCurrentSegment(next);
    // realtime-2: re-inject the lesson plan so RT-2 sees the new segment.
    if (useRealtimeV2) injectLessonPlanV2Ref.current();
    // Clear the focus card so the judge doesn't carry a stale
    // currentProblemRef across the segment boundary (observed 2026-05-15:
    // stale focus → Path B mis-fired a KILL on a correct affirmation).
    currentProblemRef.current = null;
    // Item P4 (2026-05-24) — clear the equation-label dedup map on
    // segment advance. The map's purpose is to catch "Final Answer
    // (x=12)" then "Final Answer (x=5)" within the SAME segment (a
    // brain habit of reusing the same label for different equations
    // makes the board confusing). Across segments though, the second
    // segment's "Final Answer" is conceptually a fresh artifact — the
    // prior was already accepted to a now-completed segment's history.
    // Observed 2026-05-23 (opener-merge-stress T11): brain emitted
    // show_equation(label="Final Answer", latex="x=15/3=5") on entry
    // to try-ratio after the prior try-percent had used the SAME label
    // for "0.15×80=12". The runtime silently dropped the linear
    // equation, but the brain narrated as if it rendered. Per-segment
    // scoping eliminates the false collision without changing intra-
    // segment dedup behavior.
    equationLabelsThisSessionRef.current.clear();
    // Auto-newPage for visual freshness: every segment transition starts
    // the student on a fresh whiteboard page. Page title: for generated
    // freestyle plans the segment ids are "<loId>-hook/-concept/-worked/
    // -try" — derive the loId + its description; else fall back to the
    // segment's goal/problem/id.
    const nextSeg = plan.segments.find((s) => s.id === next);
    // Stage prefix for the page title (Hook: / Concept: / Example: / Try: /
    // Recap:). Comes from the segment's `kind` (authored plans) OR the segment
    // id prefix (convention "try-…" / "worked-…" / "hook-…" / "concept-…" /
    // "recap-…"). Previously this was only derived for FREESTYLE plans whose
    // ids are "<loId>-try" etc., so an authored Try-Yourself page (id
    // "try-histogram") fell through to the raw problem statement and the page
    // never read as "Try" (2026-06-24 ear-test, Image 21).
    const STAGE_PREFIX: Record<string, string> = {
      hook: 'Hook', concept: 'Concept', worked: 'Example', worked_example: 'Example',
      example: 'Example', try: 'Try', try_yourself: 'Try', recap: 'Recap', practice: 'Practice',
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const segKind = ((nextSeg as any)?.kind as string | undefined)?.toLowerCase();
    const idPrefix = (next || '').split('-')[0].toLowerCase();
    const stage = STAGE_PREFIX[segKind ?? ''] ?? STAGE_PREFIX[idPrefix] ?? '';
    // Descriptive part: prefer the LO description (freestyle structured ids),
    // else the segment's own goal/problem/question text.
    let loDesc = '';
    if (next && plan.los?.length) {
      for (const lo of plan.los) {
        if (next.startsWith(`${lo.id}-`) || next === lo.id) { loDesc = lo.description; break; }
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const descRaw = loDesc || (nextSeg as any)?.goal || (nextSeg as any)?.problem || (nextSeg as any)?.question || '';
    const desc = (typeof descRaw === 'string' ? descRaw : '').trim();
    const newPageTitle = stage && desc ? `${stage}: ${desc}` : stage || desc || nextSeg?.id || '';
    const pageTitleStr = String(newPageTitle).slice(0, 70);
    // Defer the auto-newPage to the next batch — fire only if that batch
    // contains a command that actually renders (see pendingAdvanceNewPageRef).
    pendingAdvanceNewPageRef.current = { title: pageTitleStr, segmentId: next };
    console.log(`[VoiceTutorRealtime] auto-newPage on segment advance DEFERRED → "${next}" ("${pageTitleStr}")`);
    onDebugEvent?.('auto_newpage_on_advance_deferred', `${next}: ${pageTitleStr}`);
  }, [onCompletedSegmentsChange, useRealtimeV2, onDebugEvent]);

  // --- Render↔speech sync control surface --------------------------------
  // Flush whatever FIFO prefix of the render buffer is ready right now
  // (anchor sentence has completed, cap fired, or turn audio drained).
  // Pure decision in flushableCount(); this drives the side effects.
  const flushReadyRenders = useCallback((opts: { drainAll?: boolean } = {}) => {
    const buf = renderBufferRef.current;
    if (buf.length === 0) return;
    const n = flushableCount(buf, ttsPlaybackStartedCountRef.current, {
      drainAll: opts.drainAll,
      paused: renderBufferPausedRef.current,
      // Task 3.2: word clock position (flag-gated; null degrades every
      // entry to sentence semantics inside flushableCount).
      wordPos: TUTOR_RENDER_WORD_ANCHOR ? lastWordPosRef.current ?? undefined : undefined,
    });
    if (n === 0) return;
    const ready = buf.splice(0, n);
    // Task 3.3: pace the ink to the narrating sentence — stamp its REMAINING
    // audio so the write-on finishes with (not after) the sentence. Cheap +
    // best-effort; expired/absent hints fall back to default stroke budgets.
    try {
      const p = getSpokenProgressRef.current?.();
      if (p?.playing && p.sentence) {
        const remainMs = Math.round((p.arrivedTotalSec - p.elapsedSec) * 1000);
        if (remainMs > 0) setDrawOnPaceHint(remainMs);
      }
    } catch { /* pacing is a hint, never a failure */ }
    for (const entry of ready) onWhiteboardCommand(entry.processed);
    if (onDebugEvent) {
      const flushedIds = ready.flatMap((e) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        e.processed.map((c) => (c as any).id).filter((id: unknown): id is string => typeof id === 'string'),
      );
      onDebugEvent('render_sync_flush', `${ready.length} render(s) painted${flushedIds.length ? ` (${flushedIds.join(',')})` : ''}`);
    }
    // Nothing left to hold → cancel the stall timer.
    if (renderBufferRef.current.length === 0 && renderStallTimerRef.current) {
      clearTimeout(renderStallTimerRef.current);
      renderStallTimerRef.current = null;
    }
  }, [onWhiteboardCommand, onDebugEvent]);

  // (Re)arm the shared stall timer. Called on each buffer-add and each
  // playback-progress event; only fires after RENDER_SYNC_STALL_MS of NO
  // progress, then releases the whole buffer (narration isn't coming).
  const armRenderStall = useCallback(() => {
    if (renderStallTimerRef.current) clearTimeout(renderStallTimerRef.current);
    renderStallTimerRef.current = setTimeout(() => {
      renderStallTimerRef.current = null;
      if (renderBufferRef.current.length === 0 || renderBufferPausedRef.current) return;
      onDebugEvent?.('render_sync_stall_flush', `${renderBufferRef.current.length} render(s) released on stall`);
      flushReadyRenders({ drainAll: true });
    }, RENDER_SYNC_STALL_MS);
  }, [onDebugEvent, flushReadyRenders]);

  // ── Async doodle (show_sketch) ──────────────────────────────────────────
  // A sketch arrives as a REQUEST (concept/labels, no primitives). It's
  // already cataloged-by-title (so dedup / evolve-in-place work); here we hold
  // a pendingAsync render-sync slot (preserving stream order) and resolve the
  // primitives off-thread. On success we MUTATE primitives onto the same
  // command object (every ref — buffer entry, commandById, mirror — sees it),
  // clear pendingAsync, and flush. On fail/timeout we splice the slot + retract
  // the catalog entry (fail-to-nothing). See project_tutor_sketch_capability.
  const dropPendingSketch = useCallback(
    (entry: { pendingAsync?: boolean }, cmdId: string | undefined, why: string) => {
      const buf = renderBufferRef.current;
      const i = buf.indexOf(entry as (typeof buf)[number]);
      if (i >= 0) buf.splice(i, 1);
      if (typeof cmdId === 'string') {
        whiteboardCommandsRef.current = whiteboardCommandsRef.current.filter(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (c) => (c as any).id !== cmdId,
        );
        whiteboardCommandCountRef.current = Math.max(0, whiteboardCommandCountRef.current - 1);
        commandByIdRef.current.delete(cmdId);
        catalogRef.current.removeByIds([cmdId]);
      }
      onDebugEvent?.('sketch_dropped', `${why} id=${cmdId ?? '?'}`);
      onDebugEvent?.('render_dropped', `show_sketch — ${why}`);
      flushReadyRenders();
    },
    [onDebugEvent, flushReadyRenders],
  );

  const bufferAsyncSketch = useCallback(
    (cmd: WhiteboardCommand, anchorM: number) => {
      const entry = { processed: [cmd], anchorM, pendingAsync: true };
      renderBufferRef.current.push(entry);
      // The turn this sketch belongs to. If the doodler resolves AFTER the turn
      // ends (brain emitted show_sketch late + 2–3s gen), the entry's anchorM is
      // stale in the next turn's reset counters and would never satisfy — so on a
      // stale resolve we force a drainAll flush instead of stranding it for turns
      // (the 2026-06-23 "didn't doodle on turn 1, appeared 2 turns later" bug).
      const entryTurn = pageTurnRef.current;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const c = cmd as any;
      const concept: string = typeof c.concept === 'string' ? c.concept : '';
      const labels: string[] = Array.isArray(c.labels) ? c.labels : [];
      const cmdId: string | undefined = typeof c.id === 'string' ? c.id : undefined;
      onDebugEvent?.('sketch_request', `anchor=${anchorM} "${concept.slice(0, 50)}" id=${cmdId ?? '?'}`);

      // When the doodler ABSTAINS (concept needs precision the rough sketch
      // can't convey) or fails, don't leave the board blank under board-anchored
      // narration ("as you can see…"). Replace the sketch with a clean labeled
      // card in the SAME render-sync slot, flushed at the same anchor the sketch
      // would have used — so the deictic reference always lands on something.
      // Keeps the cataloged board item (no retract). See project_tutor_sketch_capability.
      const showFallbackCard = (why: string) => {
        c.primitives = undefined;
        c.fallbackCard = { title: typeof c.title === 'string' ? c.title : undefined, concept, labels };
        entry.pendingAsync = false;
        const stale = pageTurnRef.current !== entryTurn;
        onDebugEvent?.('sketch_fallback_card', `${why} id=${cmdId ?? '?'}${stale ? ' (stale→drainAll)' : ''}`);
        flushReadyRenders(stale || !renderSyncActiveRef.current ? { drainAll: true } : {});
        armRenderStall();
      };
      const canCard = () => Boolean(concept || labels.length || typeof c.title === 'string');

      const controller = new AbortController();
      sketchAbortsRef.current.add(controller);
      const timer = setTimeout(() => controller.abort(), SKETCH_TIMEOUT_MS);

      fetch('/api/tutor/sketch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ concept, labels, sessionId: sessionIdRef.current }),
        signal: controller.signal,
      })
        .then((r) => (r.ok ? r.json() : { primitives: null }))
        .then((data: { primitives?: unknown[] | null }) => {
          clearTimeout(timer);
          sketchAbortsRef.current.delete(controller);
          // Entry may have been dropped (turn kill) while the fetch was inflight.
          if (!renderBufferRef.current.includes(entry)) return;
          const prims = Array.isArray(data?.primitives) && data.primitives.length > 0 ? data.primitives : null;
          if (prims) {
            c.primitives = prims; // attach the visual payload to the cataloged command
            entry.pendingAsync = false;
            const stale = pageTurnRef.current !== entryTurn;
            onDebugEvent?.('sketch_resolved', `${prims.length} prims id=${cmdId ?? '?'}${stale ? ' (stale→drainAll)' : ''}`);
            // Stale (resolved after its turn) OR sync inactive (turn audio drained)
            // → release now via drainAll; its anchor sentence is gone. Otherwise
            // flush normally against its introducing sentence (in-turn sync).
            flushReadyRenders(stale || !renderSyncActiveRef.current ? { drainAll: true } : {});
            armRenderStall();
          } else if (canCard()) {
            showFallbackCard('empty/invalid');
          } else {
            dropPendingSketch(entry, cmdId, 'empty/invalid');
          }
        })
        .catch(() => {
          clearTimeout(timer);
          sketchAbortsRef.current.delete(controller);
          if (renderBufferRef.current.includes(entry)) {
            if (canCard()) showFallbackCard('fetch-failed/timeout');
            else dropPendingSketch(entry, cmdId, 'fetch-failed/timeout');
          }
        });
    },
    [onDebugEvent, flushReadyRenders, armRenderStall, dropPendingSketch],
  );

  // Buffer one render batch (or dispatch immediately when render-sync is
  // off / not on the brain-stream path). Anchored to the count of
  // sentences dispatched to TTS so far this turn.
  const dispatchVisualRef = useRef<(processed: WhiteboardCommand[], anchorOverride?: number) => void>(() => {});
  dispatchVisualRef.current = (processed: WhiteboardCommand[], anchorOverride?: number) => {
    // Task B3 (flag-gated): count valid (post-validation, about-to-render)
    // board renders this batch contributes toward the opener turn, so the
    // finally-block check can tell "opener drew nothing" from "opener drew
    // something". Independent of TUTOR_BOARD_ANCHOR_ASSIST's own counter
    // above (different flag, different lifetime — this one is read once at
    // end-of-turn and only while openingTurnPendingRef is armed).
    if (TUTOR_PEDAGOGY_OPENER && openingTurnPendingRef.current) {
      openingTurnValidRenderCountRef.current += processed.filter(isBoardRenderCommand).length;
    }
    if (!TUTOR_RENDER_SYNC || !renderSyncActiveRef.current) {
      onWhiteboardCommand(processed);
      return;
    }
    // A Rule-8 repair frame carries its own introducing-sentence number
    // (the dispatch count has already run past it by the time it arrives);
    // everything else anchors to the live TTS dispatch count as before.
    const anchorM = anchorOverride ?? ttsDispatchedCountRef.current;
    // Async doodle: a show_sketch request can't render yet (no primitives). Hold
    // a pendingAsync slot per sketch + kick the doodler; flush non-sketch
    // commands in the same batch normally (preserving order). Sketches arrive
    // essentially alone (one tool call), at most preceded by meta newPage/scrollTo.
    if (processed.some(isSketchRequestCommand)) {
      let run: WhiteboardCommand[] = [];
      const flushRun = () => {
        if (run.length) {
          renderBufferRef.current.push({ processed: run, anchorM });
          run = [];
        }
      };
      for (const c of processed) {
        if (isSketchRequestCommand(c)) {
          flushRun();
          bufferAsyncSketch(c, anchorM);
        } else {
          run.push(c);
        }
      }
      flushRun();
      onDebugEvent?.('render_sync_buffer', `anchor=${anchorM} depth=${renderBufferRef.current.length} (async-sketch)`);
      armRenderStall();
      flushReadyRenders();
      return;
    }
    // Re-anchor: a FRONT-LOADED discussable equation/figure — emitted at the top
    // of the turn (anchor ≤ RENDER_SYNC_FRONT_LOAD_MAX_ANCHOR) AND whose
    // preceding sentence does NOT name it — is held (pendingReanchor) until the
    // later sentence that names it plays, instead of surfacing during the
    // opening/hook sentence. The preceding-sentence check means a render that's
    // already introduced in sync (its anchor sentence names it) is NOT held.
    // Fail-safe: drain/cap release it at turn-end.
    let pendingReanchor = false;
    let anchorKeywords: AnchorKeywords | undefined;
    // Both assists key off "the sentence being dispatched RIGHT NOW" — for a
    // post-turn repair frame that sentence is unrelated, so neither applies:
    // the server-provided anchor is already the introducing sentence.
    if (anchorOverride === undefined && TUTOR_BOARD_ANCHOR_ASSIST && anchorM <= RENDER_SYNC_FRONT_LOAD_MAX_ANCHOR) {
      const lastSentence = turnNarrationRef.current[turnNarrationRef.current.length - 1] ?? '';
      for (const c of processed) {
        const kw = extractAnchorKeywords(c);
        if (kw && !sentenceIntroducesAnchor(lastSentence, kw)) {
          anchorKeywords = kw;
          pendingReanchor = true;
          break;
        }
      }
    }
    // Task 3.2 (flag-gated): word-level anchor — find the referring word in
    // the introducing sentence's SPOKEN words (rewriteForTTS output, the
    // words the WS TTS timestamps). Only meaningful when the entry is NOT
    // pending-reanchor (that path re-times to a LATER sentence entirely).
    // No match / no sentence → undefined → plain sentence semantics.
    let anchorWord: number | undefined;
    if (anchorOverride === undefined && TUTOR_RENDER_WORD_ANCHOR && !pendingReanchor) {
      const introSentence = turnNarrationRef.current[turnNarrationRef.current.length - 1] ?? '';
      if (introSentence) {
        const spokenWords = rewriteForTTS(introSentence, { studentName }).split(/\s+/).filter(Boolean);
        for (const c of processed) {
          const kw = extractAnchorKeywords(c);
          if (kw) {
            anchorWord = anchorWordIndex(spokenWords, kw);
            if (anchorWord !== undefined) break;
          }
        }
      }
    }
    // Pull-early matcher input (2026-07-24 round): keywords for EVERY entry,
    // not just front-loaded reanchor holds — the sentence-start handler uses
    // them to release a render the moment the sentence naming it begins
    // playing, even when its anchorM sits sentences in the future (tool call
    // parked after its narration — the "equation paints after it was spoken"
    // class). Cheap: one extractAnchorKeywords pass per batch.
    if (!anchorKeywords) {
      for (const c of processed) {
        const kw = extractAnchorKeywords(c);
        if (kw) { anchorKeywords = kw; break; }
      }
    }
    renderBufferRef.current.push({ processed, anchorM, pendingReanchor, anchorKeywords, anchorWord });
    onDebugEvent?.('render_sync_buffer', `anchor=${anchorM} depth=${renderBufferRef.current.length}${pendingReanchor ? ' pending-reanchor' : ''}${anchorWord !== undefined ? ` word=${anchorWord}` : ''}${anchorOverride !== undefined ? ' repair-anchor' : ''}`);
    armRenderStall();
    // A boundary may already have passed (e.g. anchor sentence completed
    // before this batch finished its synchronous validation) — try now.
    flushReadyRenders();
  };

  // Drop the buffer WITHOUT flushing (turn kill / abort). The renders were
  // never shown, so no removeItems is needed — but they WERE recorded in the
  // catalog / command mirror synchronously at handleWhiteboardCommand time
  // (catalog leads pixels), so we must RETRACT them. Otherwise a retry that
  // re-emits the same figure would dedup against the never-shown catalog
  // entry and suppress the re-render (the figure would never appear).
  const dropRenderBuffer = useCallback(() => {
    if (renderStallTimerRef.current) {
      clearTimeout(renderStallTimerRef.current);
      renderStallTimerRef.current = null;
    }
    // Abort any in-flight doodle fetches — their late resolve must not paint
    // onto a killed/replaced turn. The resolve handler also no-ops because the
    // entry is gone from the buffer (cleared below).
    if (sketchAbortsRef.current.size > 0) {
      for (const ctrl of sketchAbortsRef.current) ctrl.abort();
      sketchAbortsRef.current.clear();
    }
    const buf = renderBufferRef.current;
    if (buf.length === 0) { renderBufferPausedRef.current = false; return; }
    const ids: string[] = [];
    for (const entry of buf) {
      for (const c of entry.processed) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const id = (c as any).id;
        if (typeof id === 'string') ids.push(id);
      }
    }
    const dropped = buf.length;
    renderBufferRef.current = [];
    if (ids.length > 0) {
      const idSet = new Set(ids);
      whiteboardCommandsRef.current = whiteboardCommandsRef.current.filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (c) => !idSet.has((c as any).id),
      );
      whiteboardCommandCountRef.current = Math.max(0, whiteboardCommandCountRef.current - ids.length);
      for (const id of ids) commandByIdRef.current.delete(id);
      catalogRef.current.removeByIds(ids);
    }
    renderBufferPausedRef.current = false;
    onDebugEvent?.('render_sync_drop', `${dropped} buffered render(s) dropped + retracted (${ids.length} id)`);
    onDebugEvent?.('render_dropped', `render_buffer — kill retraction of ${dropped} buffered (${ids.length} id)`);
  }, [onDebugEvent]);

  // Flush the ENTIRE buffer immediately, ignoring anchors (perception
  // resume — the held tail content is being replayed; or turn teardown).
  const flushAllRenderBuffer = useCallback(() => {
    renderBufferPausedRef.current = false;
    flushReadyRenders({ drainAll: true });
  }, [flushReadyRenders]);

  // Keep-validated-on-kill (TUTOR_KEEP_VALIDATED_ON_KILL, work-queue #5+#7).
  // Decide which of `candidateIds` (killed-attempt renders) to KEEP vs SWEEP:
  // a render is swept only if a later same-turn render supersedes it (same
  // figure-category + page; non-figure renders get a unique slot → always
  // kept). Context = the whole current board, so older content (lower order)
  // can never trigger a false sweep. Pure decision in kill-keep.ts; this
  // resolves slots from the catalog + the id→cmd map.
  const planKillKeep = useCallback((candidateIds: string[]): { keep: string[]; sweep: string[] } => {
    const descFor = (id: string): KillRenderDesc | null => {
      const it = catalogRef.current.getItem(id);
      const entry = commandByIdRef.current.get(id);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cmd: any = entry?.cmd;
      const action: string = it?.action ?? cmd?.action ?? '';
      if (!action) return null;
      const order = it?.order ?? entry?.order ?? 0;
      if (isPrimaryFigure(action)) {
        const category = computeFigureCategory(action, cmd ?? {});
        return { id, slot: `fig:${category}:${it?.pageId ?? 'nopage'}`, order };
      }
      return { id, slot: `uniq:${id}`, order };
    };
    const candidates = candidateIds
      .map(descFor)
      .filter((d): d is KillRenderDesc => d !== null);
    const context = catalogRef.current
      .getItems()
      .map((it) => descFor(it.itemId))
      .filter((d): d is KillRenderDesc => d !== null);
    return decideKillKeep(candidates, context);
  }, []);

  // Handle whiteboard commands from tool calls — validates geometry + optionally validates math via Claude
  // opts.anchorSentence (Phase 4.1 Rule-8 repair): a server repair frame
  // arrives AFTER the turn's `done`, so the live TTS dispatch count no
  // longer describes its introducing sentence — the server tells us which
  // 1-based sentence spoke the content and the render buffers against THAT.
  const handleWhiteboardCommand = useCallback(async (commands: WhiteboardCommand[], opts?: { anchorSentence?: number }): Promise<WhiteboardCommandResult> => {
    turnHadToolCallRef.current = true;
    // Structured entry log — gives us the shape of every batch arriving
    // at the handler (from Realtime function_call, from text-parse, or
    // from the enricher's validation pass). Easy to grep for
    // `[VoiceTutor] batch` when diagnosing "why did X show up on the
    // board" from server/browser logs.
    console.log(
      '[VoiceTutor] batch arrived — count=%d actions=%s turnHadVisual=%s',
      commands.length,
      commands.map((c) => String((c as { action?: string }).action ?? '?')).join(','),
      Array.from(visualActionsThisTurnRef.current).join(',') || 'none',
    );

    // Per-turn EXACT-ACTION dedup. We only drop two calls to the SAME
    // show_* action within one turn (e.g. showCoordinatePlane emitted
    // twice for the same triangle). DIFFERENT actions in one turn — a
    // showProblem followed by a showGraph for that problem, or a
    // showSolution after a showCoordinatePlane — are legitimate and
    // pass through. The earlier "first structural visual wins" rule
    // killed the graph in the 2026-04-25 pre-calc session: tutor emitted
    // showProblem then showGraph; only the problem rendered, the graph
    // was rejected, and the later "show me the graph" scrollTo had
    // nothing on the board to navigate to.
    const NON_VISUAL_ACTIONS = new Set([
      'showEquation', 'showCode', 'showTable', 'showSvgDiagram',
    ]);
    const DEDUP_META_ACTIONS = new Set([
      'newPage', 'clear', 'goToPage', 'scribble', 'link', 'scrollTo',
      'highlight', 'drawVector', 'annotate',
    ]);
    const isStructuralVisual = (action: string): boolean =>
      action.startsWith('show')
      && !NON_VISUAL_ACTIONS.has(action)
      && !DEDUP_META_ACTIONS.has(action);

    // Accumulator: reasons we rejected a command so the Realtime hook can
    // report truth to the LLM instead of lying with success:true. Hoisted
    // above the dedup filter so we can push dedup-drops into it.
    const rejected: Array<{ action: string; reason: string }> = [];

    const visualActionsThisTurn = visualActionsThisTurnRef.current;
    // Per-turn dedup signature. Key on action + a stable content hash
    // so two DIFFERENT figures of the same kind in one turn both
    // render (e.g., showEarlyMath{place_value, ones:8} for "Pile 1"
    // and showEarlyMath{place_value, tens:1, ones:2} for "Pile 2"
    // are clearly distinct). The original action-name-only key was
    // dropping legitimate side-by-side primitives. The exact-content
    // case (brain re-emitting an identical figure twice in one turn,
    // the original failure mode this dedup catches) still fires
    // because the JSON of two literally-identical calls hashes the
    // same.
    const cmdSignature = (cmd: unknown): string => {
      try {
        // JSON.stringify with sorted keys would be more robust against
        // ordering, but the brain emits keys in stable order per call
        // and the cost of sorting outweighs the benefit here.
        return JSON.stringify(cmd);
      } catch {
        return '';
      }
    };
    commands = commands.filter((cmd) => {
      const action = String((cmd as { action?: string }).action ?? '');
      if (!isStructuralVisual(action)) return true;
      const sig = `${action}::${cmdSignature(cmd)}`;
      if (!visualActionsThisTurn.has(sig)) {
        visualActionsThisTurn.add(sig);
        // Action-only marker too, so logs read the same as before for
        // grep-based diagnostics — first-emit per action still logs.
        if (!visualActionsThisTurn.has(action)) {
          visualActionsThisTurn.add(action);
          console.log('[VoiceTutor] visual-emit first this turn: %s', action);
        } else {
          console.log('[VoiceTutor] visual-emit additional this turn: %s (different params)', action);
        }
        return true;
      }
      const reason =
        `You already emitted ${action} with these exact params on this turn. `
        + `This duplicate call was dropped so the student doesn't see two identical figures. `
        + `Use tutor_scroll_whiteboard({ target: ... }) to bring the existing one back into view if needed, `
        + `or call ${action} again with DIFFERENT params if you want to render a related-but-distinct figure.`;
      console.warn('[VoiceTutor] dedup-drop: %s — same params already emitted this turn', action);
      onDebugEvent?.('visual_dedup_drop', `${action} (duplicate params)`);
      rejected.push({ action, reason });
      return false;
    });
    if (commands.length === 0) {
      // All commands in the batch were dedup-dropped. Return early with
      // the rejection list so the Realtime hook tells the tutor none
      // rendered.
      for (const r of rejected) onDebugEvent?.('render_dropped', `${r.action} — ${r.reason.slice(0, 120)}`);
      return {
        rejected,
        assignedIds: [],
        manifests: [],
        boardSnapshot: catalogRef.current.getSnapshot(),
      };
    }

    console.log('[VoiceTutorRealtime] handleWhiteboardCommand called, validateToolCalls:', validateToolCalls, 'commands:', commands.map(c => c.action));
    onDebugEvent?.('tool_call', `Whiteboard tool: ${commands.map(c => c.action).join(', ')}`);

    // --- Greeting guard: suppress spurious show_problem / show_equation ---
    // If the student's last utterance is a pure greeting (e.g. "hi") and we
    // have no content signals in the session yet, the tutor has no reason to
    // emit a Problem card or an equation. Drop those commands so we don't
    // hallucinate random math on the first exchange.
    const lastStudentText = transcriptRef.current
      .filter(e => e.role === 'student')
      .slice(-1)[0]?.text || '';
    const priorStudentTurns = transcriptRef.current.filter(e => e.role === 'student').length;
    // Greeting guard: when the student has just said hi and not yet
    // asked for a problem, the brain shouldn't hallucinate one. EXCEPT
    // when a lesson plan is active — the plan's Hook segment frequently
    // *opens* with a problem on the board (that's the whole point of a
    // hook), and dropping it leaves the brain narrating an empty
    // whiteboard. Disable the guard whenever the orchestrator has a
    // plan loaded.
    const lessonPlanActive = !!lessonPlanRef.current;
    // Mock-review sessions arrive with an agenda (the student's missed exam
    // items) — presenting the first one unprompted is the whole point, so the
    // greeting guard must not eat it (2026-07-21 live-gate retry/kill loop).
    const greetingGuardActive = computeGreetingGuard({
      lessonPlanActive,
      priorStudentTurns,
      lastStudentText,
      mockReviewActive: !!mockReviewRef.current,
    });

    // Continuation guard: if the student's last utterance was clearly a
    // continuation of the current problem ("got it, next?", "ok next",
    // "keep going"), the tutor sometimes still emits a newPage because
    // its prompt lists "next" as a new-problem signal. Strip those
    // markers so the same-problem content stays on the same board
    // (2026-04-24 geometry session: "got it, next?" opened a new page
    // mid-triangle-area walkthrough).
    const continuationGuardActive = isContinuationRequest(lastStudentText);
    if (continuationGuardActive) {
      const beforeCount = commands.length;
      commands = commands.filter((cmd) => {
        if (cmd.action !== 'newPage') return true;
        console.log('[VoiceTutorRealtime] Stripped tutor-emitted newPage — student said a continuation:', lastStudentText.slice(0, 60));
        onDebugEvent?.('continuation_guard_strip_newpage', `"${lastStudentText.slice(0, 40)}…"`);
        return false;
      });
      if (commands.length !== beforeCount) {
        console.log('[VoiceTutorRealtime] Continuation guard removed', beforeCount - commands.length, 'newPage marker(s)');
      }
    }

    // Duplicate-title guard: strip a newPage whose title matches the
    // MOST-RECENT existing page title (case-insensitive, trimmed). The
    // brain occasionally re-emits new_page("Human Impact") on every
    // turn while it's still teaching that section, which produces a
    // sequence of empty duplicate pages and makes the student scroll
    // through stacked blanks (observed 2026-05-07 G5 carbon-cycle test
    // session: 4-5 consecutive new_page("Human Impact") + same image).
    // Scoped to most-recent only — if the brain genuinely wants a fresh
    // page that recycles a much-older title, don't fight it.
    if (commands.some((c) => c.action === 'newPage')) {
      const norm = (s: string | undefined): string => (s ?? '').trim().toLowerCase();
      // Most-recent committed page title (from history).
      let mostRecentTitle: string | undefined;
      for (let i = whiteboardCommandsRef.current.length - 1; i >= 0; i--) {
        const c = whiteboardCommandsRef.current[i];
        if (c.action === 'newPage') {
          mostRecentTitle = (c as { title?: string }).title;
          break;
        }
      }
      const beforeCount = commands.length;
      const filtered: WhiteboardCommand[] = [];
      for (const cmd of commands) {
        if (cmd.action === 'newPage') {
          const t = norm((cmd as { title?: string }).title);
          if (t && t === norm(mostRecentTitle)) {
            console.log('[VoiceTutorRealtime] Duplicate-title newPage stripped:', t);
            onDebugEvent?.('duplicate_newpage_strip', `title="${t}"`);
            // The follow-up show_* commands land on the existing page.
            continue;
          }
          // Update the running cursor as we walk this batch so a batch
          // that itself contains multiple identical-title newPages also
          // collapses (rare, but defensive).
          mostRecentTitle = (cmd as { title?: string }).title;
        }
        filtered.push(cmd);
      }
      if (filtered.length !== beforeCount) {
        commands = filtered;
        console.log('[VoiceTutorRealtime] Duplicate-title guard removed', beforeCount - filtered.length, 'newPage marker(s)');
      }
    }

    // Tutor-side same-context guard: strip a tutor-emitted newPage when
    // the new content is structurally or referentially a continuation
    // of an existing catalog item. See tutor-context-detector.ts.
    if (commands.some((c) => c.action === 'newPage')) {
      const tutorCtx = detectTutorSameContext({
        batch: commands,
        tutorSpeech: pendingTutorTextRef.current || currentAssistantTextRef.current || '',
        catalog: catalogRef.current,
      });
      const decision = decidePageStrip({
        tutorContext: tutorCtx,
        studentText: lastStudentText,
      });
      if (decision.stripNewPage) {
        const before = commands.length;
        commands = commands.filter((c) => c.action !== 'newPage');
        if (commands.length !== before) {
          console.log('[VoiceTutorRealtime] Tutor-side same-context guard stripped', before - commands.length, 'newPage marker(s):', decision.reason);
          onDebugEvent?.('tutor_context_strip_newpage', decision.reason);
        }
      }
    }

    // Placeholder / unfinished-equation patterns. LLMs sometimes emit
    // "[Using Integration by Parts]" or "[TODO]" as an RHS — we reject
    // those outright since they render as a non-equation bracketed string.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isPlaceholderLatex = (latex: string): boolean => {
      if (!latex) return true;
      const rhs = latex.includes('=') ? latex.split('=').pop()!.trim() : latex.trim();
      // Bracketed prose is the telltale sign. Accept `|_a^b` definite-integral
      // brackets and standard matrix/case brackets, but reject prose in [...].
      // Heuristic: if the RHS or any segment is [ <alpha-word-words> ] with
      // more than one word and no math operators inside, it's a placeholder.
      const placeholderRe = /\[[^\[\]]*[a-zA-Z][a-zA-Z\s,.;:]{5,}\][^\[\]]*$/;
      if (placeholderRe.test(rhs)) {
        // Allow if the bracket contents ALSO contain a digit/operator
        const bracketed = rhs.match(/\[([^\[\]]*)\]/)?.[1] || '';
        if (!/[\d+*/^=]/.test(bracketed)) return true;
      }
      // Also explicit phrases
      if (/\[\s*(using|todo|coming soon|to be done|insert|placeholder|same as|[a-z]+ again|[a-z]+ formula)\b/i.test(rhs)) return true;
      return false;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let processed = commands.flatMap(cmd => {
      // --- Unconditional structural guards ---
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cmdAny = cmd as any;
      // Board Map (project_tutor_board_map_design): resolve
      // go_to_page({page:N}) to a page TITLE the canvas can navigate by.
      // The canvas matches pages by title; the brain's page number is the
      // `Page N` handle from catalog.getPages() (the map it was shown), which
      // is the safe anchor — the canvas's own page index can drift by an
      // implicit untitled "page 0". Out-of-range number → title stays unset
      // and the canvas no-ops the nav (fail-safe).
      if (cmd.action === 'goToPage') {
        const g = cmdAny as { title?: string; page?: number };
        if ((!g.title || !String(g.title).trim()) && typeof g.page === 'number') {
          const pg = catalogRef.current.getPages()[g.page - 1];
          if (pg?.title) g.title = pg.title;
        }
      }
      // Round-21 (2026-07-17, session portal-83b4bb89): duplicate function
      // definition in one equation card. The brain's latex drifted from its
      // narration (it SPOKE about f and g, but the card read
      // "g(x)=2x^2-3, g(x)=x+4" — the same name defined twice with
      // different bodies, which is ALWAYS an authoring error). Reject +
      // retry with a pointed corrective; single-definition or repeated
      // identical definitions pass untouched.
      if (cmd.action === 'showEquation') {
        const latex = String(cmdAny.latex ?? '');
        // Extracted to text-heuristics (duplicateFunctionDef) and hardened
        // 2026-07-23: the inline version failed open on `\\`-separated
        // multi-line cards and on `\left(x\right)` argument delimiters.
        const dupName = duplicateFunctionDef(latex);
        if (dupName) {
          const reason = `Your show_equation latex defines the function "${dupName}" TWICE with different bodies (${latex.slice(0, 140)}). One of them is a DIFFERENT function — this is copy-paste letter drift (e.g. writing g(x) where your narration says f(x)). Re-emit the equation with each function under the letter your NARRATION uses; every letter in the latex must match what you speak.`;
          console.warn('[VoiceTutorRealtime] Dropping show_equation — duplicate function definition:', dupName);
          onDebugEvent?.('equation_duplicate_definition', `${dupName}: ${latex.slice(0, 80)}`);
          rejected.push({ action: 'show_equation', reason });
          return [];
        }
        // Round-25 (2026-07-18, session portal-59ae30c7): the brain aborted
        // a self-correction mid-thought INSIDE the latex arg — the board
        // rendered "e^x \sin x' \cdot wait" verbatim. Conversational filler
        // in latex is always an authoring error; reject + corrective.
        const filler = latexProseFiller(latex);
        if (filler) {
          const reason = `Your show_equation latex contains the conversational filler "${filler}" (${latex.slice(0, 140)}). You typed a mid-thought reaction INTO the card. Never put prose fillers in latex — if you catch a mistake while writing a card, finish the latex cleanly or re-emit the whole corrected equation. Re-emit this card with pure math only.`;
          console.warn('[VoiceTutorRealtime] Dropping show_equation — prose filler in latex:', filler);
          onDebugEvent?.('equation_prose_filler', `${filler}: ${latex.slice(0, 80)}`);
          rejected.push({ action: 'show_equation', reason });
          return [];
        }
      }
      if (cmd.action === 'showProblem') {
        const statement = cmdAny.problem?.statement?.trim() || '';
        // Adaptive-pacing v1 dedup: append the rendered problem's hash
        // to the session-scoped exclusion list so subsequent
        // generate_problem calls don't return the same statement.
        // Tracks ALL show_problem dispatches (bank, brain-gen,
        // plan-authored) — dedup is "don't show me anything I've
        // already seen this session," regardless of source.
        if (statement.length >= 10) {
          // simpleHash is the same djb2 variant used in the pipeline
          // so client + server hash to the same string for the same
          // statement.
          let h = 5381;
          for (let i = 0; i < statement.length; i++) h = (h * 33) ^ statement.charCodeAt(i);
          const hash = (h >>> 0).toString(36);
          if (!shownProblemHashesRef.current.includes(hash)) {
            shownProblemHashesRef.current.push(hash);
            // Cap at last ~40 entries to keep request payloads small.
            if (shownProblemHashesRef.current.length > 40) {
              shownProblemHashesRef.current.shift();
            }
            // Practice meter: a NEW distinct problem card was presented.
            practicePresentedRef.current++;
            emitPracticeStatsRef.current();
          }
        }
        // Empty/near-empty problem card is never useful. Drop regardless of
        // whether the student was greeting or asking for a problem — if the
        // tutor genuinely has a problem to show, it can retry with content.
        if (statement.length < 10) {
          const snapshot = JSON.stringify(cmdAny.problem);
          const reason = 'show_problem was rejected because `statement` is missing or empty. ' +
            'RETRY with this EXACT shape, replacing the example content with your actual problem:\n' +
            '{"statement":"<WRITE THE FULL PROBLEM TEXT HERE AS ONE STRING — not empty>","format":"free-response","title":"<short header>","source":"<test name if applicable>","difficulty":"easy|medium|hard"}\n' +
            'The `statement` field is REQUIRED and must contain the complete problem the student will read. ' +
            'Do NOT call show_problem again until you have written the full problem text. ' +
            'If you cannot produce the full problem text right now, speak the problem aloud instead and skip the tool call.';
          console.warn('[VoiceTutorRealtime] Dropping empty show_problem card:', snapshot);
          onDebugEvent?.('tool_call', `Dropped empty show_problem. Payload: ${snapshot}`);
          rejected.push({ action: 'show_problem', reason });
          return [];
        }
        if (greetingGuardActive) {
          const reason = 'The student only said a greeting — they have not yet asked for a problem. Do not show a problem card until they ask.';
          console.warn('[VoiceTutorRealtime] Dropping show_problem — student only greeted, did not ask for a problem');
          onDebugEvent?.('tool_call', 'Dropped show_problem (student greeted, no problem request)');
          rejected.push({ action: 'show_problem', reason });
          return [];
        }
        // Segment-truth drift check (fuzzy similarity) was retired
        // 2026-04-29 in favor of show_segment_card (Lever A) +
        // judge LLM (Lever B1). The brain SHOULD use show_segment_card
        // for any authored segment; if it falls back to free-form
        // show_problem instead, the judge will catch any spoken claim
        // that contradicts the rendered card. The fuzzy 0.5 threshold
        // had escapes documented in git history (operator swap, RHS
        // drift on shared-shape problems) that exact tools handle now.
      }
      if (cmd.action === 'showCircuit') {
        const components = Array.isArray(cmdAny.components) ? cmdAny.components : [];
        const result = validateCircuit(components, lastStudentText);
        if (!result.ok) {
          console.warn('[VoiceTutorRealtime] showCircuit validation failed:', result.reason);
          onDebugEvent?.('tool_call', `Rejected show_circuit: ${result.reason}`);
          rejected.push({ action: 'show_circuit', reason: result.reason || 'circuit validation failed' });
          return [];
        }
      }
      if (cmd.action === 'showCollision') {
        const result = validateCollision({
          dimension: cmdAny.dimension,
          type: cmdAny.type,
          before: cmdAny.before,
          after: cmdAny.after,
        });
        if (!result.ok) {
          console.warn('[VoiceTutorRealtime] showCollision validation failed:', result.reason);
          onDebugEvent?.('tool_call', `Rejected show_collision: ${result.reason}`);
          rejected.push({ action: 'show_collision', reason: result.reason || 'collision validation failed' });
          return [];
        }
      }
      if (cmd.action === 'showEnergyBars') {
        const result = validateEnergyBars({ positions: cmdAny.positions });
        if (!result.ok) {
          console.warn('[VoiceTutorRealtime] showEnergyBars validation failed:', result.reason);
          onDebugEvent?.('tool_call', `Rejected show_energy_bars: ${result.reason}`);
          rejected.push({ action: 'show_energy_bars', reason: result.reason || 'energy_bars validation failed' });
          return [];
        }
      }
      if (cmd.action === 'showSpringMass') {
        const result = validateSpringMass({
          elements: cmdAny.elements,
          k: cmdAny.k,
          mass: cmdAny.mass,
          displacement: cmdAny.displacement,
        });
        if (!result.ok) {
          console.warn('[VoiceTutorRealtime] showSpringMass validation failed:', result.reason);
          onDebugEvent?.('tool_call', `Rejected show_spring_mass: ${result.reason}`);
          rejected.push({ action: 'show_spring_mass', reason: result.reason || 'spring_mass validation failed' });
          return [];
        }
      }
      if (cmd.action === 'showReactionCoordinate') {
        const result = validateReactionCoordinate({
          reactants_energy: cmdAny.reactants_energy,
          products_energy: cmdAny.products_energy,
          activation_energies: cmdAny.activation_energies,
          curve_labels: cmdAny.curve_labels,
        });
        if (!result.ok) {
          console.warn('[VoiceTutorRealtime] showReactionCoordinate validation failed:', result.reason);
          onDebugEvent?.('tool_call', `Rejected show_reaction_coordinate: ${result.reason}`);
          rejected.push({ action: 'show_reaction_coordinate', reason: result.reason || 'reaction_coordinate validation failed' });
          return [];
        }
      }
      if (cmd.action === 'showManipulative') {
        const result = validateManipulative({
          type: cmdAny.type,
          base10: cmdAny.base10,
          tenFrame: cmdAny.tenFrame,
          areaModel: cmdAny.areaModel,
        });
        if (!result.ok) {
          console.warn('[VoiceTutorRealtime] showManipulative validation failed:', result.reason);
          onDebugEvent?.('tool_call', `Rejected show_manipulative: ${result.reason}`);
          rejected.push({ action: 'show_manipulative', reason: result.reason || 'manipulative validation failed' });
          return [];
        }
      }
      if (cmd.action === 'showPedigree') {
        const result = validatePedigree({
          individuals: cmdAny.individuals,
          marriages: cmdAny.marriages,
          children: cmdAny.children,
        });
        if (!result.ok) {
          console.warn('[VoiceTutorRealtime] showPedigree validation failed:', result.reason);
          onDebugEvent?.('tool_call', `Rejected show_pedigree: ${result.reason}`);
          rejected.push({ action: 'show_pedigree', reason: result.reason || 'pedigree validation failed' });
          return [];
        }
      }
      if (cmd.action === 'showFlowchart') {
        const result = validateFlowchart({
          nodes: cmdAny.nodes,
          edges: cmdAny.edges,
        });
        if (!result.ok) {
          console.warn('[VoiceTutorRealtime] showFlowchart validation failed:', result.reason);
          onDebugEvent?.('tool_call', `Rejected show_flowchart: ${result.reason}`);
          rejected.push({ action: 'show_flowchart', reason: result.reason || 'flowchart validation failed' });
          return [];
        }
      }
      // Pre-validate showGeometryConstructed by running the same solver
      // the renderer uses. Without this, a malformed construction (e.g.,
      // polygon_regular emitted with `vertices` instead of `on`+`sides`)
      // throws inside the renderer, which catches it and shows a small
      // red error box — but the orchestrator never learns the figure
      // failed, so the brain proceeds reasoning about a non-existent
      // diagram. The 2026-04-29 geometry session #5 was exactly this
      // case: brain emitted `polygon_regular {vertices: [A,B,C]}` →
      // solver threw "Expected circle 'undefined', got undefined" → the
      // renderer showed a red error → the brain narrated arithmetic for
      // a triangle the student couldn't see. solveGeometry is pure
      // (no side effects) so we can call it as a validator.
      if (cmd.action === 'showGeometryConstructed') {
        // Conic curve-drop guard (project_tutor_conic_construction_fix): a conic
        // figure (recognized by title) emitted with NO base curve step renders
        // directrices/foci/asymptotes floating with no ellipse/parabola/hyperbola
        // — and the curve-less redraw supersedes the original full figure, wiping
        // the curve. If a prior same-subject conic exists in history, carry its
        // curve step forward so the figure can't render curve-less; otherwise
        // reject with a hint. Deterministic — no system-prompt mandate needed.
        if (isCurveLessConic(cmd)) {
          const prior = findPriorConic(cmd, whiteboardCommandsRef.current);
          if (prior) {
            const merged = carryForwardConicCurve(cmd as unknown as Parameters<typeof carryForwardConicCurve>[0], prior);
            cmdAny.given = merged.given;
            cmdAny.steps = merged.steps;
            console.log('[VoiceTutorRealtime] conic curve-drop: carried curve from prior "%s" into "%s"', prior.title, cmdAny.title);
            onDebugEvent?.('conic_curve_carried', `${prior.title} → ${cmdAny.title}`);
          } else {
            const reason =
              `show_geometry_constructed: the conic figure "${cmdAny.title ?? ''}" has no base curve step, ` +
              `so it would render annotations (directrices / foci / asymptotes) with no ellipse / parabola / ` +
              `hyperbola. Include the base conic curve step in the SAME construction and derive the ` +
              `annotations from it (conic_directrix / conic_foci / conic_vertices / conic_asymptotes).`;
            console.warn('[VoiceTutorRealtime] conic curve-drop: no prior to carry from — rejecting "%s"', cmdAny.title);
            onDebugEvent?.('tool_call', `Rejected curve-less conic: ${cmdAny.title}`);
            rejected.push({ action: 'show_geometry_constructed', reason });
            return [];
          }
        }
        try {
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          const { solveGeometry } = require('@/lib/tutor/diagrams/geometry-solver') as typeof import('@/lib/tutor/diagrams/geometry-solver');
          solveGeometry({
            title: cmdAny.title,
            given: cmdAny.given,
            steps: cmdAny.steps,
            display: cmdAny.display,
          });
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          // Targeted hint when the brain misuses polygon_regular —
          // by far the most common failure mode (it sounds like a more
          // descriptive `polygon` so the brain reaches for it).
          const polygonRegularHint = /polygon_regular|Expected circle.*undefined/i.test(msg)
            ? ' Hint: polygon_regular requires `on` (a circle id) and `sides` (number) — it inscribes a regular n-gon in an EXISTING circle. If you just want a polygon defined by named vertices, use `kind: "polygon"` with `vertices: [id1, id2, ...]` instead.'
            : '';
          const reason =
            `show_geometry_constructed solver rejected the spec: ${msg}.${polygonRegularHint} ` +
            `Re-emit show_geometry_constructed with the corrected step shape. Check each step's required fields against the schema.`;
          console.warn('[VoiceTutorRealtime] showGeometryConstructed solver failed:', msg);
          onDebugEvent?.('tool_call', `Rejected show_geometry_constructed: ${msg}`);
          rejected.push({ action: 'show_geometry_constructed', reason });
          return [];
        }
      }
      if (cmd.action === 'showEquation') {
        const latex = cmdAny.latex?.trim() || '';
        if (isPlaceholderLatex(latex)) {
          const reason = `The latex "${latex}" is a placeholder, not a real equation. Emit the actual math (e.g. "F = ma") rather than bracketed prose like "[Using Integration by Parts]".`;
          console.warn('[VoiceTutorRealtime] Dropping placeholder equation:', latex);
          onDebugEvent?.('tool_call', `Dropped placeholder equation: ${latex}`);
          rejected.push({ action: 'show_equation', reason });
          return [];
        }
        if (greetingGuardActive) {
          const label = cmdAny.label?.trim() || '';
          if (!label || label.length < 3) {
            const reason = 'The student only greeted — do not write random equations. Ask what they want to work on first.';
            console.warn('[VoiceTutorRealtime] Dropping unlabeled equation after greeting:', latex);
            onDebugEvent?.('tool_call', 'Dropped show_equation (greeting context, no teaching label)');
            rejected.push({ action: 'show_equation', reason });
            return [];
          }
        }
        // Dedup consecutive identical emissions. The model sometimes re-emits
        // the same formula after the student says "I don't see it" (usually
        // caused by a validation-induced render delay), leaving two copies on
        // the whiteboard. Normalize whitespace + case before comparing.
        const normalized = latex.replace(/\s+/g, '').toLowerCase();
        if (normalized && normalized === lastEquationLatexRef.current) {
          console.warn('[VoiceTutorRealtime] Dropping duplicate equation:', latex);
          onDebugEvent?.('tool_call', `Dropped duplicate equation: ${latex.slice(0, 80)}`);
          return [];
        }
        lastEquationLatexRef.current = normalized;
        // Label-normalization dedup. Brain bypasses the "one label,
        // one card" system-prompt rule by adding decorations like ✓,
        // ✗, " (final)", etc. — observed 2026-05-02 session: emitted
        // "Step 1: Sum" with `=?` then "Step 1: Sum ✓" with `=400` as
        // separate cards. Strip common decorations before comparing
        // labels; if two equations have label-equivalent identifiers
        // emitted in the same session, drop the new one with feedback
        // telling the brain to either pick a unique label or avoid the
        // redundant emission.
        const rawLabel = (cmdAny.label?.trim() || '');
        if (rawLabel) {
          const normalizedLabel = rawLabel
            .toLowerCase()
            // Strip decorative suffixes / annotations.
            .replace(/[✓✗✔✘☐☑]/g, '')
            .replace(/\s*\(final\)\s*$/i, '')
            .replace(/\s*\(corrected\)\s*$/i, '')
            .replace(/\s*\(updated\)\s*$/i, '')
            .replace(/\s*\(\d+\)\s*$/i, '')
            .replace(/\s+/g, ' ')
            .trim();
          if (normalizedLabel) {
            const seen = equationLabelsThisSessionRef.current.get(normalizedLabel);
            if (seen && seen.latexNormalized !== normalized) {
              // Round-7+ Fix: silently drop label-duplicate equations.
              // Previously this pushed a rejection that triggered a
              // validator-feedback retry cascade — observed 2026-05-03
              // session: brain emitted show_equation(label="Final
              // Answer", new latex), runtime pushed rejection, brain on
              // retry MISINTERPRETED the rejection and emitted a fresh
              // show_problem({old dataset}) instead of fixing the
              // label, regressing the student to the FIRST mean problem.
              // The label-dup is purely cosmetic (the math may even be
              // identical or a refinement); surfacing it as a rejection
              // is more harmful than just dropping the duplicate.
              console.warn(`[VoiceTutorRealtime] Dropping label-duplicate equation: "${rawLabel}" (normalizes to "${normalizedLabel}", clashes with prior "${seen.originalLabel}") — silent drop, no retry`);
              onDebugEvent?.('show_equation_label_duplicate_silent', `"${rawLabel}" ~= "${seen.originalLabel}"`);
              return [];
            }
            equationLabelsThisSessionRef.current.set(normalizedLabel, {
              originalLabel: rawLabel,
              originalLatex: latex,
              latexNormalized: normalized,
            });
            // If the label looks like "Step N…" or "Step N: …",
            // record N so any future spoken reference to step N is
            // grounded. Generic — doesn't care about subject content.
            const stepMatch = /^step\s+(\d+)\b/i.exec(rawLabel);
            if (stepMatch) {
              const n = Number(stepMatch[1]);
              if (Number.isFinite(n)) stepsEmittedOnCurrentPageRef.current.add(n);
            }
          }
        }
        // show_equation segment-truth drift check (fuzzy similarity)
        // was retired 2026-04-29 alongside the show_problem one. The
        // judge LLM (Lever B1) catches the speech-side claim mismatches
        // these checks were aimed at. For authored content the brain
        // should render via show_segment_card (Lever A) instead of a
        // free-form show_equation labeled "Original Equation".
      }

      // Punnett-square repair: when show_table has collapsed gamete headers
      // (both axes labeled "P" instead of "P"/"p"), infer the correct pair
      // from the cell contents and fix the axis labels before render.
      if (cmd.action === 'showTable') {
        const headers: string[] = cmdAny.headers || [];
        const rows: string[][] = cmdAny.rows || [];
        if (looksLikePunnett(headers, rows)) {
          const repaired = repairPunnettHeaders(headers, rows);
          if (repaired) {
            console.warn('[VoiceTutorRealtime] Repaired Punnett-square headers',
              { before: headers, after: repaired.headers });
            onDebugEvent?.('punnett_repaired',
              `Headers fixed: [${headers.join(',')}] → [${repaired.headers.join(',')}]`);
            return [{ ...cmd, headers: repaired.headers, rows: repaired.rows } as WhiteboardCommand];
          }
        }
      }

      if (cmd.action === 'showTree') {
        // Validate tree shape: root must exist AND have children (a bare
        // single-node "tree" is never useful), and every child must be an
        // EDGE wrapper ({label, probability?, node}), NOT a bare node.
        const root = cmdAny.root;
        const checkNode = (n: unknown, path: string): string | null => {
          if (!n || typeof n !== 'object') return `${path} is missing or not an object`;
          const asRec = n as Record<string, unknown>;
          const children = asRec.children;
          if (children === undefined || children === null) return null; // leaf, ok
          if (!Array.isArray(children)) return `${path}.children must be an array`;
          for (let i = 0; i < children.length; i++) {
            const child = children[i] as Record<string, unknown> | undefined;
            if (!child || typeof child !== 'object') {
              return `${path}.children[${i}] is missing — each child must be { label, probability?, node }`;
            }
            if (child.node === undefined || child.node === null) {
              return `${path}.children[${i}] is missing the 'node' field — a child is an EDGE wrapper { label, probability?, node }, not a bare node`;
            }
            const sub = checkNode(child.node, `${path}.children[${i}].node`);
            if (sub) return sub;
          }
          return null;
        };
        const err = !root
          ? 'show_tree requires `root: { label: string, children?: TreeChild[] }` where TreeChild = { label: string, probability?: string, node: TreeNode }.'
          : !(root as Record<string, unknown>).children || !Array.isArray((root as Record<string, unknown>).children) || ((root as Record<string, unknown>).children as unknown[]).length === 0
            ? 'show_tree `root` has no `children`. Provide the full branching structure.'
            : checkNode(root, 'root');
        if (err) {
          console.warn('[VoiceTutorRealtime] Dropping invalid show_tree:', err);
          onDebugEvent?.('tool_call', `Dropped invalid show_tree: ${err}`);
          // Allow the model's retry to pass through the dedup filter — this
          // call never actually rendered, so it shouldn't count as "emitted".
          visualActionsThisTurnRef.current.delete('showTree');
          rejected.push({ action: 'show_tree', reason: err });
          // Phase 4.2: the tree's TEXT is usually fine even when its shape
          // isn't — paint the labels as a plain card in this batch's slot so
          // the narration lands on something (brain still gets the reject).
          if (TUTOR_RENDER_FALLBACK_CARD) {
            const spec = decideFallbackCard('show_tree', cmd as unknown as Record<string, unknown>, err);
            if (spec) {
              onDebugEvent?.('render_fallback_card', `show_tree → "${spec.title}"`);
              return [{ action: 'showFallbackCard', ...spec, sourceAction: 'show_tree' } as WhiteboardCommand];
            }
          }
          return [];
        }
      }

      if (cmd.action === 'showGeometry') {
        // Remember the latest geometry so geometry-numeric can validate
        // any spoken claims about sides/angles/area over the next few turns.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const geomAny = cmd as any;
        if (Array.isArray(geomAny.points)) {
          lastGeometryRef.current = { points: geomAny.points, title: geomAny.title };
        }
        const validated = validateGeometryCommand(cmd as unknown as GeometryCommand);
        if (validated._incomplete) {
          const reason = `The geometry command was incomplete (${validated._incompleteReason || 'missing required primitives'}). Retry with a full shape definition.`;
          console.warn(
            '[VoiceTutorRealtime] Dropping incomplete geometry command:',
            validated._incompleteReason,
            { title: validated.title, pointCount: validated.points?.length }
          );
          onDebugEvent?.('tool_call', `Dropped incomplete geometry: ${validated._incompleteReason}`);
          rejected.push({ action: 'show_geometry', reason });
          return [];
        }
        return [validated as unknown as WhiteboardCommand];
      }
      if (cmd.action === 'showGraph' && (cmd as any).data) {
        const original = (cmd as any).data;
        // A y=f(x) `functions` entry must be a function of x. Reject a polar
        // curve r=f(θ) that the brain converted to a Cartesian-implicit form and
        // stuffed into `functions` (renders garbage) — steer it to polar_graph.
        const varsCheck = validateFunctionGraphVars(original);
        if (!varsCheck.ok) {
          console.warn('[VoiceTutorRealtime] showGraph wrong-variable:', varsCheck.reason);
          onDebugEvent?.('tool_call', `Rejected show_function_graph: ${varsCheck.reason}`);
          rejected.push({ action: 'show_function_graph', reason: varsCheck.reason });
          return [];
        }
        // Fix conic section math (focus, directrix, etc.) using exact formulas.
        const afterConic = validateConicGraph(original);
        // Drop mislabeled "intersection" points (e.g. a parabola's vertex
        // mislabeled as an intersection of two curves), and backfill real
        // intersections when we can compute them deterministically.
        const afterIntersections = validateIntersectionPoints(afterConic);
        // MVT-class repair: snap secant endpoints + c onto the curve, refit
        // the secant, rewrite/backfill the true tangent at c, contain the
        // curve in yRange (2026-07-23 AP Calc BC session: tangent rendered
        // invisibly under the secant / was narrated but never plotted).
        const afterSecTan = validateSecantTangentGraph(afterIntersections);
        // Slope guard: refit a straight line whose slope is inconsistent with
        // its own labeled points (e.g. V=0.667·T plotted against (300,2)/(600,4)
        // — should be 0.00667·T). See graph-consistency-validator.
        const afterLinear = validateGraphLinearConsistency(afterSecTan);
        // Last resort AFTER all repairs: a single curve missing its own
        // value-claim labeled points ("f(5) = 7") can't be refit — reject
        // with a corrective so the brain re-emits (R32 "The Puzzle" graph).
        const valuePoints = validateFunctionValuePoints(afterLinear);
        if (!valuePoints.ok) {
          console.warn('[VoiceTutorRealtime] showGraph value-point mismatch:', valuePoints.reason);
          onDebugEvent?.('tool_call', `Rejected show_function_graph: ${valuePoints.reason}`);
          rejected.push({ action: 'show_function_graph', reason: valuePoints.reason });
          return [];
        }
        // Feature labels (local max/min/inflection) must be true of the
        // plotted curve — reject so the brain re-derives the expression (R35:
        // "plot f/f'/f'' for this problem" invented a cubic whose labeled
        // max/min/inflection were all false for its own curves).
        const features = validateFeaturePoints(afterLinear);
        if (!features.ok) {
          console.warn('[VoiceTutorRealtime] showGraph feature-point mismatch:', features.reason);
          onDebugEvent?.('tool_call', `Rejected show_function_graph: ${features.reason}`);
          rejected.push({ action: 'show_function_graph', reason: features.reason });
          return [];
        }
        if (afterLinear !== original) {
          if (afterConic !== original) {
            console.log('[VoiceTutorRealtime] Conic validator fixed graph data');
          }
          if (afterIntersections !== afterConic) {
            console.log('[VoiceTutorRealtime] Intersection validator adjusted points');
          }
          if (afterSecTan !== afterIntersections) {
            console.log('[VoiceTutorRealtime] Secant/tangent validator repaired MVT-class graph');
            onDebugEvent?.('tool_call', 'Secant/tangent validator repaired MVT-class graph data');
          }
          if (afterLinear !== afterSecTan) {
            console.log('[VoiceTutorRealtime] Linear-consistency guard refit slope to labeled points');
          }
          return [{ ...cmd, data: afterLinear } as WhiteboardCommand];
        }
      }
      return [cmd];
    });

    // --- Variable-name continuity ---
    // Pre-pass: for each showEquation, detect silent renames (f→g without
    // redeclaring) and rewrite back to the declared name before validation.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    processed = processed.map(cmd => {
      if (cmd.action !== 'showEquation') return cmd;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cmdAny = cmd as any;
      const latex: string = cmdAny.latex || '';
      if (!latex) return cmd;
      const { latex: fixedLatex, changed, oldName, newName } = normalizeRenamedFunction(
        latex,
        declaredFunctionsRef.current,
      );
      if (changed) {
        console.warn(`[VoiceTutorRealtime] Renamed ${oldName}→${newName} to match declared function`);
        onDebugEvent?.('tool_call', `Normalized ${oldName}→${newName} for continuity`);
        return { ...cmd, latex: fixedLatex } as WhiteboardCommand;
      }
      return cmd;
    });

    // --- Code sandbox auto-run on show_code with testCases ---
    for (const cmd of processed) {
      if (cmd.action !== 'showCode') continue;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cmdAny = cmd as any;
      const code: string = cmdAny.code || '';
      const language: string = (cmdAny.language || '').toLowerCase();
      const rawTestCases = Array.isArray(cmdAny.testCases) ? cmdAny.testCases : null;
      if (!code || !rawTestCases || rawTestCases.length === 0) continue;
      if (!['javascript', 'js', 'typescript', 'ts'].includes(language)) continue;
      // Decode JSON-encoded input/expected strings. The tool schema declares
      // them as strings so OpenAI's strict validator accepts the definition;
      // we parse them back into real values here before running the sandbox.
      const decodedTests: Array<{ name?: string; input?: unknown[]; expected?: unknown }> = [];
      for (const tc of rawTestCases) {
        const t = tc as { name?: string; input?: unknown; expected?: unknown };
        let input: unknown[] | undefined;
        let expected: unknown;
        try {
          if (typeof t.input === 'string') {
            const parsed = JSON.parse(t.input);
            input = Array.isArray(parsed) ? parsed : [parsed];
          } else if (Array.isArray(t.input)) {
            input = t.input as unknown[];
          }
        } catch {
          continue;
        }
        try {
          expected = typeof t.expected === 'string' ? JSON.parse(t.expected) : t.expected;
        } catch {
          expected = t.expected;
        }
        decodedTests.push({ name: t.name, input, expected });
      }
      if (decodedTests.length === 0) continue;
      fetch('/api/tutor/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: 'code-run',
          claim: { code, language, tests: decodedTests, entryName: cmdAny.entryName },
        }),
      })
        .then(r => r.ok ? r.json() : null)
        .then(result => {
          if (!result) return;
          const data = result.data || {};
          const tests = Array.isArray(data.tests) ? data.tests : [];
          const passed = tests.filter((t: { passed: boolean }) => t.passed).length;
          const total = tests.length;
          console.log(`[VoiceTutorRealtime] code-run: ${passed}/${total} tests passed`);
          onDebugEvent?.('code_run', `${passed}/${total} tests — ${result.correct ? 'all passed' : 'failures present'}`);
          if (injectContextRef.current) {
            if (result.correct) {
              injectContextRef.current(
                `CODE VERIFICATION: The code on the board passed ${passed}/${total} test cases. ` +
                `You can confidently tell the student their solution works across all cases.`
              );
            } else {
              const failures = (result.issues || []).slice(0, 3).join(' | ');
              injectContextRef.current(
                `CODE CORRECTION: The code on the board failed the sandbox: ${passed}/${total} tests passing. ` +
                `Failing cases: ${failures}. ` +
                `On your next turn, walk the student through WHY one of these inputs breaks their code.`
              );
            }
          }
        })
        .catch(err => console.error('[VoiceTutorRealtime] code-run threw:', err));
    }

    // --- SMILES verification on show_molecule ---
    for (const cmd of processed) {
      if (cmd.action !== 'showMolecule') continue;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cmdAny = cmd as any;
      const smiles: string = cmdAny.smiles || '';
      const title: string = cmdAny.title || '';
      if (!smiles || !title) continue;
      fetch('/api/tutor/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: 'chemistry-smiles', claim: { smiles, name: title } }),
      })
        .then(r => r.ok ? r.json() : null)
        .then(result => {
          if (!result || result.correct !== false) return;
          onDebugEvent?.('smiles_mismatch',
            `"${title}" SMILES ${smiles} doesn't match canonical for that name (expected ${result.expected})`);
          if (injectContextRef.current && result.expected) {
            injectContextRef.current(
              `CHEMISTRY CORRECTION: You just labeled a molecule "${title}" with SMILES "${smiles}" — but the canonical SMILES for "${title}" is "${result.expected}". ` +
              `Either the structure or the name is wrong. On your next turn, verify which you meant and correct the student.`
            );
          }
        })
        .catch(err => console.error('[VoiceTutorRealtime] smiles check threw:', err));
    }

    // --- Domain detection: chemistry equations + physics formulas ---
    // For each showEquation we send to the validator dispatcher in parallel
    // if the content looks chemistry-ish or physics-ish. Results arrive
    // after the turn and inject corrections into the NEXT tutor response
    // rather than blocking render.
    for (const cmd of processed) {
      if (cmd.action !== 'showEquation') continue;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cmdAny = cmd as any;
      const latex: string = cmdAny.latex || '';
      const label: string = cmdAny.label || '';
      if (!latex) continue;

      const looksChemistry = /[→⟶]|->/.test(latex)
        || /\b\d?[A-Z][a-z]?(?:_?\d+)?(?:\s*\+\s*\d?[A-Z])/.test(latex);
      if (looksChemistry) {
        fetch('/api/tutor/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ domain: 'chemistry-balance', claim: { equation: latex } }),
        })
          .then(r => r.ok ? r.json() : null)
          .then(result => {
            if (!result) return;
            const isBalanced = result.correct !== false;
            // Narrator-sanity: label declares the equation unbalanced but atoms
            // already match on both sides. The model does this when it opens
            // a "balancing walkthrough" on an equation that needs no balancing
            // (e.g. Fe + Cl_2 -> FeCl_2). Flag so the tutor doesn't waste the
            // student's time walking through a fake balancing exercise.
            const labelSaysUnbalanced = /\bunbalanced\b/i.test(label);
            if (isBalanced && labelSaysUnbalanced) {
              onDebugEvent?.('narrator_mismatch',
                `label "${label}" claims unbalanced but validator: balanced — ${latex.slice(0, 80)}`);
              if (injectContextRef.current) {
                injectContextRef.current(
                  `NARRATOR MISMATCH: You just labeled "${latex}" as "${label}", but atom counts already ` +
                  `match on both sides — this equation IS balanced. Do NOT walk the student through ` +
                  `balancing it. On your next turn, acknowledge it's already balanced and either move ` +
                  `on to a genuinely unbalanced example or pick a different direction.`
                );
              }
              return;
            }
            if (!isBalanced) {
              console.warn('[VoiceTutorRealtime] Chemistry balance off:', result.issues);
              onDebugEvent?.('chem_unbalanced',
                `${latex.slice(0, 80)} — ${(result.issues || []).join('; ')}`);
              if (injectContextRef.current && result.expected) {
                // Narrator-sanity (inverse): label declares the equation balanced
                // but it's not. Stronger wording so the tutor doesn't claim a
                // false victory on the board.
                const labelSaysBalanced = /\bbalanced\b/i.test(label) && !labelSaysUnbalanced;
                const prefix = labelSaysBalanced
                  ? `NARRATOR MISMATCH + CHEMISTRY CORRECTION: You just labeled "${latex}" as "${label}" — but it is NOT balanced. `
                  : `CHEMISTRY CORRECTION: The equation you just wrote "${latex}" is NOT balanced. `;
                injectContextRef.current(
                  prefix +
                  `${(result.issues || []).join(' ')} ` +
                  `The balanced form is: ${result.expected}. ` +
                  `On your next turn, acknowledge the imbalance briefly and show the corrected equation.`
                );
              }
            }
          })
          .catch(err => console.error('[VoiceTutorRealtime] chemistry-balance threw:', err));
      }

      // Acid-base pH check: extract pH / pOH / [H+] / [OH-] claims from the
      // equation and fire the acid-base-ph dispatcher when at least 2 of
      // these four are present (so consistency can be checked).
      {
        const phM = latex.match(/\bpH\s*=\s*(-?\d+(?:\.\d+)?)/i);
        const pohM = latex.match(/\bpOH\s*=\s*(-?\d+(?:\.\d+)?)/i);
        const hM = latex.match(/\[\s*H\s*\+?\s*\]\s*=\s*(-?\d+(?:\.\d+)?(?:\s*[\\×x]\s*10\s*\^?-?\d+)?)/i);
        const ohM = latex.match(/\[\s*OH\s*-?\s*\]\s*=\s*(-?\d+(?:\.\d+)?(?:\s*[\\×x]\s*10\s*\^?-?\d+)?)/i);
        const parseSciOrPlain = (s: string): number | null => {
          const clean = s.replace(/\s+/g, '').replace(/×|\\times/g, '*').replace(/\^/, '**');
          try {
            // eslint-disable-next-line no-new-func
            const val = Function(`return (${clean})`)();
            return typeof val === 'number' && isFinite(val) ? val : null;
          } catch { return null; }
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const phClaim: any = {};
        if (phM) phClaim.pH = parseFloat(phM[1]);
        if (pohM) phClaim.pOH = parseFloat(pohM[1]);
        if (hM) phClaim.hConc = parseSciOrPlain(hM[1]);
        if (ohM) phClaim.ohConc = parseSciOrPlain(ohM[1]);
        const phKeysPresent = Object.keys(phClaim).length;
        if (phKeysPresent >= 2) {
          fetch('/api/tutor/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ domain: 'acid-base-ph', claim: phClaim }),
          })
            .then(r => r.ok ? r.json() : null)
            .then(result => {
              if (!result || result.correct !== false) return;
              onDebugEvent?.('acid_base_inconsistent',
                `${latex.slice(0, 80)} — ${(result.issues || []).join('; ')}`);
              if (injectContextRef.current) {
                injectContextRef.current(
                  `ACID-BASE CORRECTION: The values in "${latex}" are not internally consistent. ` +
                  `${(result.issues || []).join(' ')} ` +
                  `Remember at 25°C: pH + pOH = 14, and [H+][OH-] = 1e-14. On your next turn, recheck the arithmetic.`
                );
              }
            })
            .catch(err => console.error('[VoiceTutorRealtime] acid-base-ph threw:', err));
        }
      }

      // Physics dimensional check: fire when label matches a known quantity
      // name and the formula has an "=" sign so both sides can be parsed.
      const physicsUnitClaim = /\b(force|energy|momentum|power|pressure|work|kinetic|potential)\b/i.test(label);
      if (physicsUnitClaim && latex.includes('=')) {
        fetch('/api/tutor/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ domain: 'dimensional-analysis', claim: { formula: latex } }),
        })
          .then(r => r.ok ? r.json() : null)
          .then(result => {
            if (!result || result.correct !== false) return;
            console.warn('[VoiceTutorRealtime] Dimensional mismatch:', result.issues);
            onDebugEvent?.('dim_mismatch',
              `${latex.slice(0, 80)} (${label}) — ${(result.issues || []).join('; ')}`);
            // Confidence gate (2026-06-16): this validator is unreliable on
            // SYMBOLIC physics — it maps single-letter VARIABLES onto base
            // dimension symbols (so "L = I\omega", angular momentum, reads L as
            // Length), can't parse implicit multiplication ("I\omega" → one
            // unknown symbol "Iomega"), and bails on multi-part formulas. Each
            // such case produced a FALSE "PHYSICS CORRECTION" injected into the
            // brain (observed 2026-06-16 JEE session, 4× on a correct L=Iω).
            // Only inject when the parse looks trustworthy: drop it when the
            // issues admit unknown / assumed-dimensionless symbols or an
            // unsupported multi-equation, or when the LHS is a lone letter that
            // collides with a dimension symbol (L/M/T/I/N/J) — the exact cases
            // it gets wrong. Telemetry above still fires for tuning.
            const issuesText = (result.issues || []).join(' ').toLowerCase();
            const lowConfidence = /unknown symbol|assumed dimensionless|single[- ]equation|only single/.test(issuesText);
            const lhs = latex.split('=')[0].replace(/\\[a-zA-Z]+|[{}\\\s$]/g, '').trim();
            const lhsCollidesWithDimension = /^[LMTINJ]$/.test(lhs);
            if (lowConfidence || lhsCollidesWithDimension) {
              onDebugEvent?.('dim_mismatch_suppressed', `lhs=${lhs || '?'} — ${issuesText.slice(0, 80)}`);
              return;
            }
            if (injectContextRef.current) {
              injectContextRef.current(
                `PHYSICS CORRECTION: The formula "${latex}" labeled "${label}" does not check out dimensionally. ` +
                `${(result.issues || []).join(' ')} ` +
                `Re-derive the formula on your next turn — one of the sides has the wrong units.`
              );
            }
          })
          .catch(err => console.error('[VoiceTutorRealtime] dimensional-analysis threw:', err));
      }
    }

    // --- Wolfram math validation (SCOPED DOWN 2026-06-20, default OFF) ---
    // The old "check every math" directive is retired: measurement showed
    // Wolfram caught zero real errors (only false-positives) at real cost +
    // commercial-terms risk. Gated behind TUTOR_WOLFRAM_MATH_CHECK (default
    // OFF); the FREE local validators ran in the earlier block. Claude-based
    // validation (geometry/number-line structural fixes) remains gated on
    // validateToolCalls as before.
    const recentContext = () => transcriptRef.current.slice(-4)
      .map(e => `${e.role === 'student' ? 'Student' : 'Tutor'}: ${e.text}`).join('\n');

    processed = await Promise.all(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      processed.map(async (cmd) => {
        // Graphs: Wolfram first, Claude fallback (only if validateToolCalls)
        if (cmd.action === 'showGraph') {
          // Wolfram scoped down (default OFF) — the FREE local validateConicGraph
          // already ran (earlier block) and catches the real conic errors.
          if (!TUTOR_WOLFRAM_MATH_CHECK) return cmd;
          let wolframFailed = false;
          try {
            console.log('[VoiceTutorRealtime] Sending graph to Wolfram for validation');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const resp = await fetch('/api/tutor/validate-graph-wolfram', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ graphData: (cmd as any).data }),
            });
            if (resp.ok) {
              const result = await resp.json();
              if (result.corrected && result.data) {
                console.log('[VoiceTutorRealtime] Wolfram corrected graph:', result.issues);
                onDebugEvent?.('tool_call', `Graph validated via wolfram: ${result.issues?.join(', ')}`);
                return { ...cmd, data: result.data } as WhiteboardCommand;
              }
              return cmd;
            }
            wolframFailed = true;
          } catch (err) {
            console.error('[VoiceTutorRealtime] Wolfram validation failed:', err);
            wolframFailed = true;
          }
          if (wolframFailed && validateToolCalls) {
            console.log('[VoiceTutorRealtime] Wolfram failed, falling back to Claude for graph validation');
            onDebugEvent?.('tool_call', 'Graph Wolfram failed, falling back to Claude');
            return await validateToolCallViaClaude('show_function_graph', cmd);
          }
          return cmd;
        }

        // Equations: fire-and-forget Wolfram/Claude validation. Rendering is
        // NOT gated on the validator — a 10s Claude round-trip on a symbolic
        // formula used to leave the whiteboard blank and prompted students to
        // complain "I don't see it on the board." Instead, we render now and
        // inject a correction into the NEXT tutor turn if the validator finds
        // an error. This mirrors the pattern used by chemistry-balance,
        // chemistry-smiles, code-run, etc.
        if (cmd.action === 'showEquation') {
          // Wolfram scoped down (default OFF). Equation renders as-is; the
          // fire-and-forget Wolfram check caught nothing real (measured) and
          // produced false-positives. Re-enable via the flag if licensed.
          if (!TUTOR_WOLFRAM_MATH_CHECK) return cmd;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const cmdAny = cmd as any;
          const latex: string = cmdAny.latex || '';
          const label: string = cmdAny.label || '';
          console.log('[VoiceTutorRealtime] Queuing equation validation (non-blocking):', latex.substring(0, 80));
          fetch('/api/tutor/validate-math-wolfram', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              latex,
              label,
              conversationContext: recentContext(),
              declaredFunctions: declaredFunctionsRef.current.map(d => ({
                name: d.name, argVar: d.argVar, body: d.body,
              })),
            }),
          })
            .then(r => r.ok ? r.json() : null)
            .then(result => {
              if (!result) return;
              console.log(`[VoiceTutorRealtime] Math validation (${result.source}):`, result.correct ? 'correct' : result.issues);
              onDebugEvent?.('tool_call', `Equation validated via ${result.source}: ${result.correct ? 'correct' : result.issues?.join(', ')}`);
              // Round-7+++++ Issue 3 fix: when Wolfram verifies an
              // equation as CORRECT, store its integer-number tuple so
              // a later judge KILL that disputes the same numbers can
              // be downgraded. Tokens: all multi-digit integers in the
              // latex. We keep singletons too (the brain may say "73
              // is the mean" — kill claim cites 73 alone — and we want
              // to recognize that 73 was a verified result).
              if (result.correct === true) {
                const intTokens: string[] = [];
                const numRe = /\d+/g;
                let m: RegExpExecArray | null;
                while ((m = numRe.exec(latex)) !== null) intTokens.push(m[0]);
                if (intTokens.length > 0) {
                  const key = [...new Set(intTokens)].sort().join('|');
                  wolframVerifiedNumberSetsRef.current.add(key);
                  // Also store each individual token so single-number
                  // judge claims like "73" can match.
                  for (const t of intTokens) wolframVerifiedNumberSetsRef.current.add(t);
                  // Round-7++++++ Issue 5 fix: also store the per-equation
                  // token SET so the override can match against a single
                  // verified equation rather than the flat session union.
                  // Without this the flat union accumulates dozens of
                  // tokens across a long session, and any unrelated brain
                  // hallucination with 2-3 token overlap gets the kill
                  // wrongly downgraded (observed 2026-05-06 session: 30
                  // affirmed for mean of {16,24,32,40,48} which is 32).
                  wolframVerifiedEquationsRef.current.push(new Set(intTokens));
                }
              }
              // Numeric-mismatch promotion: previously this branch only
              // fired when Wolfram produced a `correctedLatex`. For
              // pure verification mismatches (e.g. "4+7+2+7+3+7+5+4
              // ≈ 39 but 40 ≈ 40 (mismatch)" — the brain wrote a
              // wrong sum), Wolfram returns the issue text but no
              // correctedLatex, so the next-turn correction never
              // fired and the brain confidently propagated the wrong
              // value through downstream computations. Now: inject a
              // correction whenever Wolfram says !correct, regardless
              // of whether it produced a fully-corrected latex. The
              // brain reads the issue text, extracts the right value,
              // and apologizes / re-emits on the next turn.
              if (!result.correct && injectContextRef.current && (result.correctedLatex || (result.issues && result.issues.length > 0))) {
                const kind = result.source === 'wolfram-derivative' ? 'derivative'
                  : result.source === 'wolfram-integral' ? 'integral'
                  : 'equation';
                const correctedHint = result.correctedLatex
                  ? `The correct form is "${result.expected || result.correctedLatex}". `
                  : '';
                injectContextRef.current(
                  `MATH CORRECTION (HARD — DO NOT IGNORE): The ${kind} you just wrote "${latex}" is wrong. ` +
                  `${correctedHint}` +
                  `Validator details: ${(result.issues || []).join(' ')}. ` +
                  `On your VERY NEXT turn you MUST: (1) explicitly apologize for the slip in one short sentence, ` +
                  `(2) re-emit a corrected show_equation with the right numeric value extracted from the validator details, ` +
                  `(3) update any DOWNSTREAM derivations or final-answer cards that used the wrong value. ` +
                  `Do not pretend the prior emission was right; do not propagate the bad value forward. ` +
                  `Do not call show_problem or advance_lesson until you have re-emitted the corrected equation.`
                );
              }
            })
            .catch(err => console.error('[VoiceTutorRealtime] Equation validation threw:', err));
          return cmd;
        }

        // Number lines: always Wolfram verify the extremes + labeled numbers
        if (cmd.action === 'showNumberLine') {
          // Claude validator is best-effort here (only when enabled). Wolfram
          // couldn't add structured guarantees beyond the synchronous client
          // side math, so we defer to Claude when allowed.
          if (validateToolCalls) {
            return await validateToolCallViaClaude(cmd.action, cmd);
          }
          return cmd;
        }

        // Geometry: Claude only when enabled (local geometry-validator already ran)
        if (cmd.action === 'showGeometry') {
          if (validateToolCalls) {
            console.log('[VoiceTutorRealtime] Sending geometry to Claude for validation');
            return await validateToolCallViaClaude(cmd.action, cmd);
          }
          return cmd;
        }
        return cmd;
      })
    );

    // ===== Brain new_page is ADVISORY (topic/segment-level grouping) =====
    // The orchestrator (page-grouping.ts) owns pagination. A brain-emitted
    // new_page must NOT create a page or a visual break — figures of the same
    // topic stay together; splits happen only on segment-advance / topic-shift
    // / reset / overflow. So STRIP brain new_page from `processed` here, BEFORE
    // the side-effect loop below opens a catalog page for it. We preserve its
    // dedup-bypass role (newPageThisTurnRef — the divergence guard that lets
    // fresh/off-plan content render, per system-prompt-builder.ts:604) and
    // stash its title as a hint the page-grouping apply block prefers when the
    // runtime DOES open a page this turn. Synthetic newPages (added after the
    // decision) are appended later, so this filter only catches brain ones.
    let brainNewPageTitleHint: string | undefined;
    {
      const brainPages = processed.filter((c) => c.action === 'newPage');
      if (brainPages.length > 0) {
        newPageThisTurnRef.current = true;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const lastTitle = String((brainPages[brainPages.length - 1] as any).title || '').trim();
        if (lastTitle) {
          brainNewPageTitleHint = lastTitle;
          currentTopicRef.current = lastTitle;
          if (!topicsCoveredRef.current.includes(lastTitle)) topicsCoveredRef.current.push(lastTitle);
        }
        processed = processed.filter((c) => c.action !== 'newPage');
        console.log(`[VoiceTutorRealtime] brain new_page(s) stripped (advisory) — runtime owns pagination; hint="${brainNewPageTitleHint ?? ''}"`);
      }
    }

    // --- Track declarations + integrands + current problem for next turn ---
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const cmd of processed) {
      if (cmd.action === 'showProblem') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const p = (cmd as any).problem;
        if (p?.statement) {
          const kind: 'integral' | 'generic' = /\\int|Integral_|\bintegral\b/i.test(p.statement) ? 'integral' : 'generic';
          // expectedAnswer pin (2026-07-17): if this render is the
          // generate_problem canonicalText the server just resolved, carry
          // its verified answer on the tracked problem. Whitespace-collapsed
          // comparison — the brain quotes canonicalText verbatim per the
          // tool contract, but sentence-assembly can normalize whitespace.
          const pendingGen = pendingGeneratedAnswerRef.current;
          const norm = (s: string) => s.replace(/\s+/g, ' ').trim();
          const genMatch = pendingGen && norm(pendingGen.statement) === norm(p.statement) ? pendingGen : null;
          currentProblemRef.current = {
            statement: p.statement,
            kind,
            // Round-22: MCQ marker so the verification classifier can accept
            // a bare choice letter ("d") as the student's answer.
            hasChoices: Array.isArray(p.answerChoices) && p.answerChoices.length > 0,
            ...(genMatch ? { source: 'generated' as const, expectedAnswer: genMatch.expectedAnswer } : {}),
          };
          if (genMatch) {
            pendingGeneratedAnswerRef.current = null;
            console.log('[VoiceTutorRealtime] expectedAnswer pinned to active problem:', (genMatch.expectedAnswer ?? '').slice(0, 60));
            onDebugEvent?.('expected_answer_pinned', (genMatch.expectedAnswer ?? '').slice(0, 60));
          }
          servedProblemStatementsRef.current.add(norm(p.statement));
          console.log('[VoiceTutorRealtime] Tracked current problem:', p.statement.slice(0, 80));
          // New problem → reset walk-through insistence counter. The tutor
          // needs to re-enter Socratic mode; any walk-through request will
          // need to be re-asserted for this new problem.
          walkThroughInsistenceRef.current = 0;
          // Set the current topic from the problem title or source tag.
          const topic = (p.title || p.sourceTag || p.statement.slice(0, 40)).trim();
          if (topic) {
            currentTopicRef.current = topic;
            if (!topicsCoveredRef.current.includes(topic)) topicsCoveredRef.current.push(topic);
          }
        }
      }
      // Live round 5 (session-1784778855564): a try-yourself card is ALSO the
      // active problem — without this the brain had no record of the card's
      // numbers ("A 5 kg box … 30 N"), invented a replacement problem with
      // different values, and graded the student's correct card answer wrong.
      // source:'card' gets its own <active_problem> wording (the declared
      // expectedAnswer is what the typed-submit auto-scorer uses, so spoken
      // grading must agree with it).
      if (cmd.action === 'showTryYourself') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tyAny = cmd as any;
        const statement = String(tyAny.problem ?? '').trim();
        if (statement) {
          const declared = typeof tyAny.expectedAnswer === 'string' ? tyAny.expectedAnswer.trim() : '';
          currentProblemRef.current = {
            statement,
            kind: 'generic',
            source: 'card',
            hasChoices: Array.isArray(tyAny.choices) && tyAny.choices.length > 0,
            ...(declared ? { expectedAnswer: declared } : {}),
          };
          walkThroughInsistenceRef.current = 0;
          servedProblemStatementsRef.current.add(statement.replace(/\s+/g, ' ').trim());
          console.log('[VoiceTutorRealtime] Tracked current problem (try-yourself card):', statement.slice(0, 80));
        }
      }
      if (cmd.action === 'newPage') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const title = ((cmd as any).title || '').trim();
        if (title) {
          currentTopicRef.current = title;
          if (!topicsCoveredRef.current.includes(title)) topicsCoveredRef.current.push(title);
        }
        // Mirror current-page state into the catalog so getSnapshot
        // can flag isOnCurrentPage on each entry. Brain reads the
        // flag to decide whether to scroll or re-render before
        // referencing an item.
        catalogRef.current.setCurrentPage(title || undefined);
      }

      // Lesson-plan navigation. The brain emits advance_lesson when it
      // wants to move within the active plan; we resolve "next" /
      // "previous" / explicit segment id and update currentSegmentIdRef
      // so the NEXT brain turn ships the new segment in lessonPlanContext.
      // The command itself is consumed here — it does not flow to the
      // whiteboard renderer (no visual side effect).
      if (cmd.action === 'advanceLesson') {
        const plan = lessonPlanRef.current;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const to = (cmd as any).to as string | undefined;
        if (plan && to) {
          // Brain-driven topic-switch (replaces the retired
          // topicSwitchRe heuristic). The brain calls
          // advance_lesson({to:"free"}) when the student wants off the
          // planned track for something this plan doesn't cover.
          // Release the segment cursor → free-conversation mode
          // (lessonPlanContext omitted next turn; requiredPhrases /
          // prescribedRender / segment-card guardrails relax so they
          // don't drag the brain back to a stale segment). Stash the
          // prior segment so a later {to:"next"} can resume where the
          // student left the plan. Idempotent.
          if (to === 'free') {
            if (currentSegmentIdRef.current) {
              segmentBeforeFreeRef.current = currentSegmentIdRef.current;
              console.log(`[VoiceTutorRealtime] advance_lesson({to:"free"}) — releasing cursor from "${currentSegmentIdRef.current}" → free-conversation`);
              onDebugEvent?.('advance_free_cursor_released', `was="${currentSegmentIdRef.current}"`);
              currentSegmentIdRef.current = '';
              setActiveSegmentId('');
              currentProblemRef.current = null;
              catalogRef.current.setCurrentSegment('');
            }
            continue;
          }
          // Round-15 Issue 1: a show_segment_card earlier in this turn
          // already moved the cursor via inferred advance. A relative
          // advance_lesson({to:"next"}) in the same turn expresses the
          // SAME transition the card implied — resolving it now (from
          // the already-moved cursor) would double-advance past the
          // segment the student is looking at. Consume the inference
          // instead. Explicit segment-id targets still resolve normally.
          if (to === 'next' && inferredAdvanceThisTurnRef.current
              && currentSegmentIdRef.current === inferredAdvanceThisTurnRef.current) {
            console.log(`[VoiceTutorRealtime] advance_lesson({to:"next"}) already satisfied by inferred advance to "${inferredAdvanceThisTurnRef.current}" this turn — skipping double-advance.`);
            onDebugEvent?.('advance_satisfied_by_inference', inferredAdvanceThisTurnRef.current);
            inferredAdvanceThisTurnRef.current = '';
            continue;
          }
          // Pass shownProblemHashesRef so resolveAdvanceTarget skips
          // try-yourself / misconception / extension segments whose
          // authored problem text the student already saw earlier in
          // the session — typically because generate_problem returned
          // that segment's text as a Layer-4 plan-authored fallback.
          // Without this, Skip / advance_lesson re-renders a problem
          // the student just worked through, which feels like a stall
          // (observed 2026-05-07 K-2 test session: 3 Skip clicks
          // needed to get past content the student had already done).
          const consumedHashes = new Set(shownProblemHashesRef.current);
          // Resume-from-free: when the cursor was released, resolve
          // relative to the segment the student left the plan at —
          // resolveAdvanceTarget can't position from an empty cursor,
          // which is what silently stranded the student off-plan
          // before this fix. Falls back to plan-start resume inside
          // resolveAdvanceTarget when there is no stashed segment.
          const fromSegId = currentSegmentIdRef.current || segmentBeforeFreeRef.current;
          const next = resolveAdvanceTarget(plan, fromSegId, to, { consumedHashes });
          if (next) {
            // Behavior-preserving extraction (2026-05-22): the advance-
            // apply side-effects now live in applyResolvedAdvance so the
            // app-side deterministic Skip-button advance (FIX B) runs the
            // exact same transition logic.
            applyResolvedAdvance(plan, fromSegId, next);
          } else {
            console.warn(`[VoiceTutorRealtime] lesson advance failed: cannot resolve "${to}" from "${fromSegId || '(empty cursor / free-conversation)'}"`);
            // 2026-05-15: when `to: "next"` from the LAST segment fails
            // (no segment after recap), surface an explicit cue so the
            // brain knows to use generate_problem (or end the lesson)
            // instead of silently re-attempting. Without this the
            // advance fails quietly, the brain's narration about
            // "moving on" plays, and the lesson stalls — observed in
            // judge-sync-stress session #7 (advance_lesson({to:"next"})
            // from "recap" failed silently while brain narrated a
            // wrap-up summary).
            const planForReject = lessonPlanRef.current;
            const currentSegIdx = planForReject
              ? planForReject.segments.findIndex((s) => s.id === fromSegId)
              : -1;
            const isAtLastSegment = planForReject
              ? currentSegIdx === planForReject.segments.length - 1
              : false;
            const reason = isAtLastSegment
              ? `advance_lesson({to: "${to}"}) failed: the current segment "${fromSegId}" is the LAST segment in the lesson plan, so there is no "next" to advance to. If the student wants more practice, call generate_problem (with difficulty matching the pacing hint). If they want to wrap up, acknowledge briefly and stop.`
              : `advance_lesson({to: "${to}"}) failed: could not resolve target "${to}"${fromSegId ? ` from segment "${fromSegId}"` : ' (no active plan position — session is in free conversation; advance by an explicit segment id to re-enter the plan, or just keep teaching)'}. Valid targets are "next", "previous", or an explicit segment id from this plan.`;
            rejected.push({ action: 'advance_lesson', reason });
          }
        }
        continue;
      }
      if (cmd.action === 'markSegmentComplete') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const c = cmd as any;
        console.log(`[VoiceTutorRealtime] segment complete: "${c.segmentId}"${typeof c.masteryDelta === 'number' ? ` Δ=${c.masteryDelta}` : ''}${c.notes ? ` — ${c.notes}` : ''}`);
        // Track completed segment for downstream show_segment_card block.
        if (typeof c.segmentId === 'string' && c.segmentId) {
          const before = completedSegmentIdsRef.current.size;
          completedSegmentIdsRef.current.add(c.segmentId);
          if (completedSegmentIdsRef.current.size > before) {
            // Notify parent of the new completion set (truthful basis
            // for the progress strip's per-LO count).
            onCompletedSegmentsChange?.([...completedSegmentIdsRef.current]);
          }
        }
        // Report pedagogical milestones on GENUINE completion. (Skips
        // auto-mark via applyResolvedAdvance and deliberately do NOT fire a
        // milestone — the conversion wall must be value-boxed on real work.)
        // Task C2: milestone + mastery-push decisions are routed through
        // resolveCompletionOutcome (completion-gate.ts). Gate inactive
        // (flag off, or freestyle session) ⇒ the helper reproduces the
        // pre-C2 inline logic exactly. Gate active ⇒ both additionally
        // require the student to have DEMONSTRATED the segment (see
        // demonstratedSegmentsRef). The completedSegmentIdsRef add above
        // stays unconditional in both modes — a gated segment is still
        // "visited" for the progress strip.
        const planNow = lessonPlanRef.current;
        const hasSegId = typeof c.segmentId === 'string' && !!c.segmentId;
        const doneSeg = hasSegId && planNow ? getSegment(planNow, c.segmentId) : undefined;
        // Treat completion as success unless an explicit non-positive
        // mastery delta marks it a miss (try_yourself milestone only).
        const md = typeof c.masteryDelta === 'number' ? c.masteryDelta : undefined;
        const outcome = resolveCompletionOutcome({
          gateActive: completionGateActiveRef.current,
          segmentKind: doneSeg?.kind,
          masteryDelta: md,
          demonstrated: hasSegId && demonstratedSegmentsRef.current.has(c.segmentId),
        });
        if (outcome.milestone) emitMilestone(outcome.milestone);
        if (outcome.visitedNotMastered) {
          console.log(`[VoiceTutorRealtime] completion gated: seg="${c.segmentId}" visited, not mastered (no demonstrated attempt)`);
          onDebugEvent?.('completion_gated', `seg="${c.segmentId}" visited, not mastered (no demonstrated attempt)`);
        }
        // Pacing v2 — Phase 1 (inert): segment-mastered booster.
        // When mark_segment_complete fires AND the student's correct-streak
        // for this segment was >= 2, set a one-shot "mastered" flag that
        // the next-turn student_state block surfaces. Strong "this student
        // didn't just answer one problem right, they finished cleanly"
        // signal. Cleared on segment change (handled at student-utterance
        // arrival point above).
        if (typeof c.segmentId === 'string' && c.segmentId
            && studentStreakRef.current.segId === c.segmentId
            && studentStreakRef.current.count >= 2) {
          segmentMasteredFlagRef.current = {
            segId: c.segmentId,
            streakAtComplete: studentStreakRef.current.count,
          };
          logPacing(`segment-mastered seg="${c.segmentId}" streakAtComplete=${studentStreakRef.current.count}`);
          onDebugEvent?.('pacing_segment_mastered', `seg="${c.segmentId}" streak=${studentStreakRef.current.count}`);
        }
        // Push the mastery delta into the session accumulator so it
        // commits at end-of-session. We tag it with the lesson plan's
        // first LO when available — the segment itself doesn't carry an
        // LO id directly, but the plan is the proximate scope.
        // Task C2: outcome.recordMastery ⇔ typeof c.masteryDelta === 'number'
        // when the gate is inactive (pre-C2 condition, verbatim); the loId
        // presence check stays here in the caller.
        const loId = planNow?.los?.[0]?.id;
        if (loId && outcome.recordMastery && md !== undefined) {
          sessionAccumRef.current.masteryDeltas.push({ loId, delta: md });
          sessionAccumRef.current.losTouched.add(loId);
          // Learning-gaps blending: durably persist the increment soon —
          // waiting for the End button lost the whole session on abnormal
          // exits (tab close / swipe-away), starving the gaps loop.
          scheduleProfileFlush();
        }
        continue;
      }
      if (cmd.action === 'confirmPlanLos') {
        // Student picked their X LOs from a picker segment. Hand off to
        // the parent so it can call /api/tutor/expand-plan-los and the
        // existing useEffect reloads the plan with expanded segments.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const c = cmd as any;
        const pickedLoIds: string[] = Array.isArray(c.pickedLoIds) ? c.pickedLoIds : [];
        const planId = lessonPlanRef.current?.id;
        if (!planId) {
          console.warn('[VoiceTutorRealtime] confirmPlanLos but no active plan, ignoring');
          continue;
        }
        if (pickedLoIds.length === 0) {
          console.warn('[VoiceTutorRealtime] confirmPlanLos with empty pickedLoIds, ignoring');
          continue;
        }
        if (!onConfirmPlanLos) {
          console.warn('[VoiceTutorRealtime] confirmPlanLos fired but no onConfirmPlanLos handler — ignoring');
          continue;
        }
        void (async () => {
          try {
            await onConfirmPlanLos({ planId, pickedLoIds });
          } catch (err) {
            console.warn('[VoiceTutorRealtime] onConfirmPlanLos threw:', err);
          }
        })();
        console.log(`[VoiceTutorRealtime] confirm_plan_los planId=${planId} picked=[${pickedLoIds.join(',')}]`);
        onDebugEvent?.('confirm_plan_los', `planId=${planId} picked=[${pickedLoIds.join(',')}]`);
        continue;
      }
      if (cmd.action === 'proposePlanSwap') {
        // Mid-session plan swap. The brain has asked the orchestrator to
        // route the session to a different lesson plan within the same
        // configured subject + topic. Fire the swap-plan endpoint
        // server-side: it does the catalog lookup (and falls back to
        // generation) constrained to the session's topic, so the brain
        // can't escape scope. On success, invoke the parent's callback
        // so it can setSelectedLessonPlanId and inject the chat notice.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const c = cmd as any;
        const targetSubTopic: string = typeof c.targetSubTopic === 'string' ? c.targetSubTopic : '';
        const reason: string | undefined = typeof c.reason === 'string' ? c.reason : undefined;
        if (!targetSubTopic) {
          console.warn('[VoiceTutorRealtime] proposePlanSwap missing targetSubTopic, dropping');
          continue;
        }
        if (!onProposePlanSwap) {
          console.warn('[VoiceTutorRealtime] proposePlanSwap fired but no onProposePlanSwap handler wired — ignoring');
          continue;
        }
        // Don't block the current dispatch loop. Fire-and-forget; the
        // parent handler resolves the swap async. By the time the
        // brain's NEXT turn runs, the new plan is loaded via the
        // existing useEffect and lessonPlanContext reflects it.
        void (async () => {
          try {
            await onProposePlanSwap({ targetSubTopic, reason });
          } catch (err) {
            console.warn('[VoiceTutorRealtime] onProposePlanSwap threw:', err);
          }
        })();
        console.log(`[VoiceTutorRealtime] propose_plan_swap target="${targetSubTopic}"${reason ? ` reason="${reason}"` : ''}`);
        onDebugEvent?.('propose_plan_swap', `target="${targetSubTopic}"${reason ? ` reason="${reason}"` : ''}`);
        continue;
      }
      if (cmd.action === 'recordGap' || cmd.action === 'flagPrerequisiteGap') {
        // Orchestrator-stamped objective signals — derived from refs that
        // mirror the same state the brain sees in <student_state>.
        // SLOW_SEGMENT threshold (6) is a v1 heuristic; can move to a
        // grade-keyed constant later without schema change.
        const objectiveSignals: string[] = [];
        if (studentIncorrectStreakRef.current.count >= 2) {
          objectiveSignals.push('INCORRECT_STREAK_2_PLUS');
        }
        const cue = studentCueRef.current?.cue;
        if (cue && /\b(stuck|skip|don't know|dont know|i don't get|help me|can't do)\b/i.test(cue)) {
          objectiveSignals.push('STUCK_CUE');
        }
        if (segmentTurnCountRef.current.count >= 6) {
          objectiveSignals.push('SLOW_SEGMENT');
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const c = cmd as any;
        const observation: string = typeof c.observation === 'string' ? c.observation : '';
        const studentQuotes: string[] = Array.isArray(c.studentQuotes) ? c.studentQuotes : [];
        const brainSignals: string[] = Array.isArray(c.signalsObserved) ? c.signalsObserved : [];
        // Union — preserves order, dedupes.
        const signals = Array.from(new Set([...brainSignals, ...objectiveSignals]));
        if (cmd.action === 'recordGap') {
          if (c.loId && observation) {
            sessionAccumRef.current.gaps.push({
              kind: 'lo',
              loId: c.loId,
              observation,
              studentQuotes,
              signals,
            });
            sessionAccumRef.current.losTouched.add(c.loId);
            console.log(`[VoiceTutorRealtime] gap recorded: kind=lo loId="${c.loId}" signals=[${signals.join(',')}] obs="${observation.slice(0, 80)}"`);
            scheduleProfileFlush();
          }
        } else {
          if (c.conceptLabel && observation) {
            sessionAccumRef.current.gaps.push({
              kind: 'prerequisite',
              conceptLabel: c.conceptLabel,
              observation,
              studentQuotes,
              signals,
            });
            console.log(`[VoiceTutorRealtime] gap recorded: kind=prerequisite concept="${c.conceptLabel}" signals=[${signals.join(',')}] obs="${observation.slice(0, 80)}"`);
            scheduleProfileFlush();
          }
        }
        continue;
      }
      // Topic-notes overlay tools — fire silently to the per-student
      // overlay store. Three guardrails before async dispatch:
      //   1. Active-topic binding: baselineId == lessonPlanId; no plan → drop.
      //   2. Warmup: drop until ≥3 segments completed (let student show range).
      //   3. Per-session rate limit per bucket; over-firing silent-drops.
      // Dedup against baseline + existing overlays lives in apply-overlay.ts.
      // sourceGapId pairing (Q11c) deferred — gap IDs are server-issued at
      // commit time, so the orchestrator can't link to them yet without
      // extending the gap pipeline. v1 leaves sourceGapId blank.
      if (
        cmd.action === 'expandTopicNotesTheory' ||
        cmd.action === 'addTopicNotesMethod' ||
        cmd.action === 'addTopicNotesPointer'
      ) {
        const baselineId = lessonPlanId;
        if (!baselineId) {
          console.log('[VoiceTutorRealtime] topic-notes call dropped — no active plan');
          continue;
        }
        if (completedSegmentIdsRef.current.size < TOPIC_NOTES_WARMUP_SEGMENTS) {
          console.log(
            `[VoiceTutorRealtime] topic-notes call dropped — warmup (${completedSegmentIdsRef.current.size}/${TOPIC_NOTES_WARMUP_SEGMENTS} segments completed)`,
          );
          continue;
        }
        const counts = sessionAccumRef.current.topicNotesCount;
        let bucket: 'theory' | 'methods' | 'pointers';
        let limit: number;
        if (cmd.action === 'expandTopicNotesTheory') {
          bucket = 'theory';
          limit = TOPIC_NOTES_RATE_LIMITS.theory;
        } else if (cmd.action === 'addTopicNotesMethod') {
          bucket = 'methods';
          limit = TOPIC_NOTES_RATE_LIMITS.methods;
        } else {
          bucket = 'pointers';
          limit = TOPIC_NOTES_RATE_LIMITS.pointers;
        }
        if (counts[bucket] >= limit) {
          console.log(
            `[VoiceTutorRealtime] topic-notes call dropped — rate limit (${bucket} at ${counts[bucket]}/${limit})`,
          );
          continue;
        }
        counts[bucket] += 1;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const c = cmd as any;
        let input: Record<string, unknown>;
        if (cmd.action === 'expandTopicNotesTheory') {
          input = {
            loId: c.loId,
            kind: c.kind,
            conceptLabel: c.conceptLabel,
            title: c.title,
            content: c.content,
            rationale: c.rationale,
          };
        } else if (cmd.action === 'addTopicNotesMethod') {
          input = {
            title: c.title,
            when_to_use: c.when_to_use,
            steps: c.steps,
            alternativeTo: c.alternativeTo,
            relatedLoIds: c.relatedLoIds,
            rationale: c.rationale,
          };
        } else {
          input = {
            content: c.content,
            kind: c.kind,
            relatedLoIds: c.relatedLoIds,
            rationale: c.rationale,
          };
        }
        void dispatchTopicNotesOverlay(
          studentId,
          baselineId,
          sessionIdRef.current,
          bucket,
          input,
        );
        console.log(
          `[VoiceTutorRealtime] topic-notes ${bucket} dispatched (count ${counts[bucket]}/${limit}): action=${cmd.action}`,
        );
        continue;
      }
      // Problem ↔ original-equation drift check. When the tutor emits a
      // showEquation labeled like "Original Equation" or "Problem" right
      // after a showProblem, the equation latex must match what the problem
      // statement describes — otherwise the tutor has silently mutated the
      // problem mid-setup (witnessed: statement said 2^(x+1) - 3·2^(x+2) = 0
      // but board drew 2^(2x-1) - 3·2^(x+2) = 0).
      if (cmd.action === 'showEquation' && currentProblemRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const cmdAny = cmd as any;
        const label: string = (cmdAny.label || '').toLowerCase();
        const latex: string = cmdAny.latex || '';
        if (/original|problem|given|restated/.test(label) && latex.length > 4) {
          const stmt = currentProblemRef.current.statement;
          // Extract any latex in the statement (between $...$) or plain math
          const stmtMath = stmt.match(/\$([^$]+)\$/)?.[1] || stmt;
          // Coarse comparison via rough normalization — fraction-safe.
          const norm = (s: string) => s.toLowerCase()
            .replace(/\\frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g, '$1/$2')
            .replace(/\s+/g, '')
            .replace(/\\(cdot|times)/g, '*')
            .replace(/\\[a-z]+/g, '')
            .replace(/[{}]/g, '')
            .replace(/[()]/g, '');
          const a = norm(stmtMath);
          const b = norm(latex);
          // Heuristic: if the equation shares < 40% of its tokens with the
          // statement's math, flag drift. We use a simple char-overlap ratio.
          const overlap = a.length > 0 ? [...a].filter(ch => b.includes(ch)).length / a.length : 1;
          if (overlap < 0.4) {
            console.warn('[VoiceTutorRealtime] Problem↔equation drift detected',
              { statement: stmtMath, boardEquation: latex });
            onDebugEvent?.('problem_equation_drift',
              `Problem says "${stmtMath.slice(0, 80)}" but board shows "${latex.slice(0, 80)}"`);
            if (injectContextRef.current) {
              injectContextRef.current(
                `CORRECTION: The problem you just showed has a DIFFERENT equation than the "Original Equation" you drew on the board. ` +
                `The problem statement has: ${stmtMath}. ` +
                `But the whiteboard is showing: ${latex}. ` +
                `On your next turn, redraw the "Original Equation" exactly as it appears in the problem statement, then continue. Do not work with a different equation than the one the student is looking at.`
              );
            }
          }
        }
      }
      if (cmd.action === 'showEquation') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const cmdAny = cmd as any;
        const latex: string = cmdAny.latex || '';
        const label: string = cmdAny.label || '';

        // Named-function declarations (f(x) = ...)
        const decls = extractDeclarations(latex);
        if (decls.length > 0) {
          for (const d of decls) {
            const idx = declaredFunctionsRef.current.findIndex(x => x.name === d.name);
            if (idx >= 0) declaredFunctionsRef.current[idx] = d;
            else declaredFunctionsRef.current.push(d);
          }
          console.log('[VoiceTutorRealtime] Tracked declarations:', decls.map(d => `${d.name}(${d.argVar})`).join(', '));
        }

        // Integrand tracking: "Integral to Evaluate: Integral_0^1 ... dx"
        // stores the integrand under name "I" so later "Integral of First Term"
        // style labels can look it up.
        const integrand = extractIntegrand(latex, label);
        if (integrand) {
          const idx = declaredFunctionsRef.current.findIndex(x => x.name === 'I');
          if (idx >= 0) declaredFunctionsRef.current[idx] = integrand;
          else declaredFunctionsRef.current.push(integrand);
          console.log('[VoiceTutorRealtime] Tracked integrand:', integrand.body, '(var:', integrand.argVar + ')');

          // If we don't have a problem statement yet but the tutor is showing
          // an integral to evaluate, promote it to the current problem.
          if (!currentProblemRef.current && /evaluate|to evaluate|integral to/i.test(label)) {
            currentProblemRef.current = { statement: latex, kind: 'integral' };
          }
        }

        turnEquationsRef.current.push(latex);
      }
    }

    // Within-batch same-type dual-emit dedup. When the brain emits
    // show_diagram with the SAME `type` twice in one batch (intro-then-
    // refine pattern observed 2026-05-13 session #8: KWL chart emitted
    // 2× with different know/want content; both rendered stacked),
    // keep only the LAST emission. Walks processed once to find the
    // latest index for each (action, type) signature; earlier
    // emissions of the same signature drop. Pure cosmetic dedup —
    // doesn't surface to the brain as a rejection, since the brain's
    // intent is "the second one is the refinement of the first".
    // Companion to the cross-batch B2 dedup higher up (which injects
    // new_page when the duplicate is in a DIFFERENT batch).
    {
      const lastIdxBySigKey = new Map<string, number>();
      for (let i = processed.length - 1; i >= 0; i--) {
        const cmd = processed[i];
        const action = String(cmd.action);
        if (action !== 'showDiagram') continue;
        const t = (cmd as { type?: string }).type;
        if (typeof t !== 'string' || t.length === 0) continue;
        const key = `${action}|${t}`;
        if (!lastIdxBySigKey.has(key)) lastIdxBySigKey.set(key, i);
      }
      const droppedIdx = new Set<number>();
      processed.forEach((cmd, i) => {
        const action = String(cmd.action);
        if (action !== 'showDiagram') return;
        const t = (cmd as { type?: string }).type;
        if (typeof t !== 'string') return;
        const key = `${action}|${t}`;
        const lastIdx = lastIdxBySigKey.get(key);
        if (lastIdx !== undefined && i !== lastIdx) droppedIdx.add(i);
      });
      if (droppedIdx.size > 0) {
        const droppedSummaries = Array.from(droppedIdx)
          .map((i) => `[${i}] show_diagram(${(processed[i] as { type?: string }).type ?? '?'})`)
          .join(', ');
        console.log('[VoiceTutorRealtime] within-batch same-type dedup: dropping', droppedSummaries);
        onDebugEvent?.('within_batch_dual_emit_dedup', `dropped ${droppedIdx.size}: ${droppedSummaries}`);
        processed = processed.filter((_, i) => !droppedIdx.has(i));
      }
    }

    // ===== Cross-turn page grouping (page-grouping.ts) =====
    // The page-break decision — group onto the active page, open a new page,
    // overflow to a continuation, or pin a kill-recovery replacement in
    // place — is owned by the pure decidePageForBatch module. This block only
    // sources its inputs from orchestrator refs + the catalog Page model and
    // applies the result. See project_tutor_page_grouping_design.md for the
    // full tiered precedence (Tier 0 kill-pin → 1 structural → 2 continuation
    // → 3 topic-shift → 4 default → overflow) and the do-NOT-regress set
    // (e.g. 2026-04-24 "show me the steps to find T for this" stays on page:
    // Tier-2 continuation beats Tier-3 topic-shift).
    // Student-redraw intent ("draw this again", "show me the tree once
    // more"). NO LONGER a page trigger (design Q6) — it is now a DEDUP-BYPASS
    // signal only: the re-render lands on the active page (grouped) and
    // bypasses the signature dedup gate below so it actually shows
    // (preserving the 2026-05-14 BST silent-drop fix). redrawRequested is
    // consumed at the dedup gate (~line 3817).
    const redrawIntentRegex = /\b(?:redraw|draw|show|render|display)\b.{0,60}\b(?:this|that|it|tree|diagram|graph|chart|figure|picture|image|again|once more)\b/i;
    const redrawRequested = redrawIntentRegex.test(lastStudentText);

    // Tier-3 heuristic signal: topic-shift (embedding distance). One-shot.
    const topicShiftPending = topicShiftPendingRef.current;
    // Tier-2 suppressor: tutor narration indicates same-context continuation.
    // Only relevant to the topic-shift heuristic (Tier-1 structural breaks
    // beat continuation anyway), so compute it only when a shift is pending.
    const tutorCtxAuto = topicShiftPending && processed.length > 0
      ? detectTutorSameContext({
          batch: processed,
          tutorSpeech: pendingTutorTextRef.current || currentAssistantTextRef.current || '',
          catalog: catalogRef.current,
        })
      : { same: false, signals: [] as Array<'A' | 'B' | 'C' | 'D'>, decisive: false, reason: '' };
    const tutorSameContext = tutorCtxAuto.same
      && decidePageStrip({ tutorContext: tutorCtxAuto, studentText: lastStudentText }).stripNewPage;

    // Blank-page guard input: is the first teaching command an organizer-kind
    // show_diagram whose signature already exists (→ it WILL dedup-drop)?
    // Injecting a page break in front of a guaranteed-dedup leaves a blank
    // page (2026-05-13 comparison_table regression), so the module suppresses
    // the break in that case.
    const firstTeachingCmdForGrouping = processed.find((c) => isTeachingRenderAction(String(c.action)));
    const firstTeachingWillDedup = (() => {
      if (!firstTeachingCmdForGrouping) return false;
      const a = String(firstTeachingCmdForGrouping.action);
      // Any teaching render whose exact signature already exists in the catalog
      // WILL dedup-drop at the gate below. Breaking to a new page in front of it
      // leaves a blank page — and worse, the page break sets newPageThisBatch,
      // which then SKIPS the dedup so the duplicate renders anyway. That is the
      // resume re-render bug: after a reload the brain re-emits an existing
      // equation/figure, the runtime opens a fresh page for it, and the dedup
      // never fires → a duplicate page of identical content. Suppressing the
      // break keeps newPageThisBatch false so the dedup runs. Match the dedup
      // gate's own conditions (skip when the student explicitly asked for a
      // redraw, or the brain already broke to a new page earlier this turn).
      // (Was restricted to showDiagram organizers; generalized to every teaching
      // action so re-emitted equations/figures on resume dedup too.)
      if (redrawRequested || newPageThisTurnRef.current) return false;
      try {
        return !!catalogRef.current.findBySignature(buildShowSignature(a, firstTeachingCmdForGrouping));
      } catch {
        return false;
      }
    })();

    // Tier-0 input: is this batch a kill-recovery replacement? If killed
    // renders are still dimmed in the pending-revision set, pin the
    // replacement to their page (replace-in-place beats any split signal).
    const killRecoveryPinPageId = (() => {
      if (pendingRevisionRef.current.size === 0) return null;
      for (const id of pendingRevisionRef.current) {
        const it = catalogRef.current.getItem(id);
        if (it?.pageId) return it.pageId;
      }
      return null;
    })();

    // Active-page view for the decision (weighted load + subject anchor).
    const activePageObj = catalogRef.current.getActivePage();
    const activePageView = activePageObj
      ? {
          id: activePageObj.id,
          title: activePageObj.title,
          segmentId: activePageObj.segmentId,
          anchorKey: activePageObj.anchorKey,
          weightedLoad: catalogRef.current.getItems().reduce(
            (sum, it) => (it.pageId === activePageObj.id ? sum + weightOfAction(it.action) : sum),
            0,
          ),
          lastRenderTurn: activePageObj.lastRenderTurn,
        }
      : null;

    const pageDecision = decidePageForBatch({
      batch: processed,
      studentText: lastStudentText,
      activePage: activePageView,
      currentTurn: pageTurnRef.current,
      signals: {
        topicShiftDistance: topicShiftPending ? topicShiftPending.fromDistance : null,
        continuationGuardActive,
        tutorSameContext,
        // Prior-turn deferred segment advance is handled by the B1 flush
        // block immediately below — don't double-count it here.
        segmentAdvancePending: false,
        killRecoveryPinPageId,
        firstTeachingWillDedup,
      },
    });
    // Topic-shift is one-shot — clear it now that the decision consumed it.
    topicShiftPendingRef.current = null;

    if (pageDecision.action === 'newPage' || pageDecision.action === 'continuation') {
      // Prefer the brain's stripped new_page title (often the most descriptive,
      // e.g. "Ellipse: Standard Form") for a fresh page; a continuation keeps
      // its "(cont.)" title.
      const pageTitle = pageDecision.action === 'newPage' && brainNewPageTitleHint
        ? brainNewPageTitleHint
        : pageDecision.title;
      const synthetic: WhiteboardCommand = { action: 'newPage', title: pageTitle };
      processed = [synthetic, ...processed];
      // Open the page in the catalog Page model NOW. Synthetic newPages are
      // prepended AFTER the step-1 side-effect loop (~line 2961), so the
      // setCurrentPage bridge there never sees them. A continuation inherits
      // the active page's subject (anchorKey) so grouping + Board Map treat
      // the unit as one. setCurrentPage afterward syncs the VIEW marker
      // (isOnCurrentPage) without re-opening (idempotent on same title).
      catalogRef.current.openPage(
        pageDecision.action === 'continuation'
          ? { title: pageTitle, isContinuation: true, parentPageId: activePageView?.id }
          : { title: pageTitle },
      );
      catalogRef.current.setCurrentPage(pageTitle);
      console.log(`[VoiceTutorRealtime] page-grouping → ${pageDecision.action}: ${pageDecision.reason}${brainNewPageTitleHint ? ` (title="${pageTitle}")` : ''}`);
      onDebugEvent?.(pageDecision.event, pageDecision.reason);
    } else if (pageDecision.action === 'pin') {
      // Kill-recovery replace: no synthetic break. The append loop stamps the
      // replacement onto killRecoveryPinPageId (see the append call below).
      console.log(`[VoiceTutorRealtime] page-grouping → pin to ${pageDecision.pageId}: ${pageDecision.reason}`);
      onDebugEvent?.('page_grouping_pin', `${pageDecision.pageId}: ${pageDecision.reason}`);
    }

    // Flush a deferred auto-newPage from a prior segment advance — but
    // only if this batch has at least one teaching command that will
    // actually render (i.e. signature does not match an existing catalog
    // item). If every teaching command would dedup, keep the newPage
    // deferred for a future batch — the brain may emit fresh content
    // later. See pendingAdvanceNewPageRef declaration.
    if (pendingAdvanceNewPageRef.current) {
      // "Fresh teaching content" = any teaching render not already on the board.
      // Uses the canonical isTeachingRender predicate (page-grouping.ts) rather
      // than a hand-maintained action allow-list. The old list had drifted and
      // was MISSING showGeometryConstructed (+ showBalancedEquation, showMatrix,
      // showGraphicOrganizer, showLabeledImage, showLewisConstructed, showEarlyMath,
      // showPhonics, showSolvedExample, showTryYourself, showWritingFrame, …): a
      // conic FIGURE drawn right after a segment advance therefore failed to flush
      // the deferred new-page and leaked onto the PRIOR page while its equations
      // landed on the new one — the parabola/ellipse split in the 2026-06-19 conic
      // session. The predicate is the single source of truth, so new show_* tools
      // never re-introduce this drift. showSegmentCard is OR'd back in to preserve
      // its prior flush behavior (it's excluded from isTeachingRender by design).
      const hasFreshTeaching = processed.some((cmd) => {
        const a = String(cmd.action);
        if (!isTeachingRenderAction(a) && a !== 'showSegmentCard') return false;
        try {
          const sig = buildShowSignature(a, cmd);
          return !catalogRef.current.findBySignature(sig);
        } catch {
          return true; // signature failure shouldn't suppress legitimate page
        }
      });
      if (hasFreshTeaching) {
        const deferred = pendingAdvanceNewPageRef.current;
        processed = [{ action: 'newPage', title: deferred.title } as WhiteboardCommand, ...processed];
        // Open the deferred page in the catalog Page model (this synthetic
        // newPage is prepended after the step-1 side-effect loop, so the
        // setCurrentPage bridge never sees it). setCurrentPage syncs the view.
        catalogRef.current.openPage({ title: deferred.title, segmentId: deferred.segmentId });
        catalogRef.current.setCurrentPage(deferred.title);
        console.log(`[VoiceTutorRealtime] auto-newPage on segment advance FLUSHED (deferred) → "${deferred.segmentId}" ("${deferred.title}")`);
        onDebugEvent?.('auto_newpage_on_advance_flushed', `${deferred.segmentId}: ${deferred.title}`);
        pendingAdvanceNewPageRef.current = null;
      } else {
        console.log('[VoiceTutorRealtime] auto-newPage on segment advance STILL deferred — no fresh teaching content this batch');
      }
    }

    // (Final-Answer → next-batch new page ["justSolved"] retired with
    // cross-turn page grouping — it was subsumed by H6/H2/grouping and was
    // the source of the 2026-04-24 "find T for this" misfire. See design Q10.)

    // Stamp a stable id onto every rendered whiteboard command BEFORE we
    // resolve scribble/scrollTo targets. ID format is `<action>-<counter>`
    // with a per-action counter so e.g. the second show_spring_mass becomes
    // showSpringMass-2. The counter persists across batches so IDs remain
    // stable for the entire session. Meta-commands (newPage / clear /
    // goToPage / scribble / scrollTo) do NOT get IDs — they're addressers
    // or structural markers, not addressable items themselves.
    // Bookkeeping actions are state side-effects applied EARLIER in this
    // function (segment advance, mastery deltas, topic-notes PATCH, gap
    // accumulator) and are stripped from the render pipeline before
    // onWhiteboardCommand at line ~3467. They must NOT increment
    // nextCommandOrderRef either — otherwise the order counter drifts
    // ahead of whiteboardCommandsRef.current and resolveTargetFromId's
    // `o` walk can't find later items by their entry.order. Symptom:
    // tutor_scribble emitted in a turn that also has advance_lesson +
    // mark_segment_complete + add_topic_notes_pointer resolved through
    // the catalog but had targetItemIndex=undefined → page-filter
    // dropped them → no paint on the board. Observed 2026-05-13 Phase
    // 2a session (the gov_branches "Legislative" circle that vanished
    // despite catalog success).
    const META_ACTIONS = new Set([
      'newPage', 'clear', 'goToPage', 'scribble', 'link', 'scrollTo',
      'advanceLesson', 'markSegmentComplete',
      'proposePlanSwap', 'confirmPlanLos',
      'recordGap', 'flagPrerequisiteGap',
      'expandTopicNotesTheory', 'addTopicNotesMethod', 'addTopicNotesPointer',
    ]);
    // Running page title used to stamp catalog entries with the page
    // they were rendered on. Updated whenever we see a newPage in the
    // full history up to and including the current batch.
    let currentPageTitle: string | undefined;
    for (const c of whiteboardCommandsRef.current) {
      if (c.action === 'newPage') currentPageTitle = (c as { title?: string }).title;
    }
    // Track which input commands turned out to be duplicates of items
    // already in the catalog (same args). The Realtime hook surfaces
    // these to the tutor as success:false / duplicate:true so it
    // switches to scrollTo / scribble instead of redrawing.
    const duplicates: Array<
      | {
          existingItemId: string;
          existingFeatures: Array<{ target: string; canonical: string; kind: string; description?: string }>;
        }
      | undefined
    > = commands.map(() => undefined);
    const droppedAsDuplicate = new Set<WhiteboardCommand>();
    // Track whether THIS BATCH started with a newPage. If so, the brain
    // explicitly intended to redraw on a fresh page — skip the dedup
    // for show_* commands that follow the newPage in the same batch
    // (otherwise we leave a blank new page while the original card
    // sits on a previous page, and the student stares at an empty
    // board while the brain insists the problem is "right there").
    // Observed 2026-04-30 rational-expressions session: brain emitted
    // newPage + show_problem(same statement) four times in a row,
    // each show_problem dedupped, leaving four blank new pages and
    // the brain switching to Malay trying to apologize.
    let newPageThisBatch = false;
    // Generic evolve-in-place (project_tutor_figure_identity_design): prior
    // figures this batch's re-emissions supersede. A same-subject re-emit with
    // added annotations has a DIFFERENT signature (so the dedup above misses it)
    // but the SAME subject — instead of letting them coexist (figure-
    // multiplication + "which ellipse?" nav ambiguity), we remove the prior
    // after the loop and keep only the freshly-drawn one. Collected here,
    // applied below the loop (mirrors the kill-recovery rollback).
    const evolveReplaceIds: string[] = [];
    for (const cmd of processed) {
      const action = String(cmd.action);
      if (action === 'newPage') {
        currentPageTitle = (cmd as { title?: string }).title;
        newPageThisBatch = true;
        newPageThisTurnRef.current = true;
        // Uniform catalog Page-model sync point: ensure a Page is opened +
        // active for EVERY newPage as the loop walks it, regardless of source
        // (brain / synthetic / B1-deferred) — so subsequent renders in this
        // batch stamp onto the right page. Idempotent: a page already opened
        // upstream (step-1 bridge for titled brain newPages, or the
        // page-grouping openPage for synthetic ones) is a no-op here; this
        // catches the gaps (e.g. an empty-title brain newPage, which the
        // title-gated step-1 bridge skips).
        catalogRef.current.setCurrentPage(currentPageTitle);
        // Reset per-page step tracking — references to "Step N" on
        // a fresh page must be re-grounded by new emissions.
        stepsEmittedOnCurrentPageRef.current = new Set();
        continue;
      }
      if (META_ACTIONS.has(action)) continue;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cmdWithId = cmd as any;
      if (cmdWithId.id) continue; // caller already assigned

      // Idempotency check: hash the tool args and look up an item with
      // the same signature. If found, skip the render entirely and
      // surface the existing itemId + its features. The tutor reads
      // `duplicate: true` in the tool_result and routes through
      // tutor_scroll_whiteboard / tutor_scribble. Production root cause
      // for issue #1 in the 2026-04-25 session: tutor re-rendered an
      // energy bar chart in response to "show me the chart" because
      // chat-history advice to use scroll was drowned out.
      const signature = buildShowSignature(action, cmd);
      const existing = catalogRef.current.findBySignature(signature);
      // Diagnostic: log every show_* call's dedup decision so we can
      // see WHY a dedup didn't fire (signature mismatch vs newPage bypass
      // vs no existing). Pruning candidate — keep until comparison_table
      // dedup is verified rock-solid across sessions, then drop.
      if (action !== 'newPage' && !META_ACTIONS.has(action)) {
        console.log(
          '[VoiceTutor] dedup-check: action=%s, sig=%s, existing=%s, newPageThisBatch=%s, newPageThisTurnRef=%s, catalogSize=%d',
          action,
          signature.length > 100 ? signature.slice(0, 100) + '…' : signature,
          existing ? existing.itemId : '(none)',
          newPageThisBatch,
          newPageThisTurnRef.current,
          catalogRef.current.getItems().length,
        );
      }
      // Skip dedup when there's a newPage in the same batch OR earlier
      // in the same brain turn — brain explicitly wants this content on
      // a fresh page, even if it matches something on a prior page. The
      // turn-scoped guard catches the common pattern where new_page and
      // show_problem are emitted as separate tool calls in one turn.
      // EXCEPTION (2026-05-13): organizer-shaped show_diagram kinds
      // (comparison_table, t_chart, frayer_model, etc. — see
      // structuralAxesFor) ALWAYS dedup against an existing
      // structurally-identical item, regardless of newPage state. These
      // kinds re-emit with reworded cells frequently and the brain has
      // no legitimate reason to want a duplicate on a fresh page —
      // observed session: brain emitted comparison_table 2× with same
      // axes, both rendered, scribble target resolved ambiguously.
      const cmdForAxes = cmd as { type?: string; params?: unknown };
      const isOrganizerKind = action === 'showDiagram'
        && typeof cmdForAxes.type === 'string'
        && new Set([
          'comparison_table', 't_chart', 'frayer_model',
          'hierarchy_pyramid', 'argument_structure', 'government_branches',
          'body_system', 'life_cycle', 'water_cycle', 'rock_cycle',
        ]).has(cmdForAxes.type);
      const dedupAllowedDespiteNewPage = isOrganizerKind;
      if (existing && (dedupAllowedDespiteNewPage || (!newPageThisBatch && !newPageThisTurnRef.current && !redrawRequested))) {
        const inputIdx = commands.indexOf(cmd);
        if (inputIdx >= 0) {
          duplicates[inputIdx] = {
            existingItemId: existing.itemId,
            existingFeatures: existing.features.map((f) => ({
              target: (f.labels && f.labels[0]) || f.canonical,
              canonical: f.canonical,
              kind: f.kind,
              ...(f.description ? { description: f.description } : {}),
            })),
          };
        }
        droppedAsDuplicate.add(cmd);
        cmdWithId._duplicateOf = existing.itemId;
        console.warn('[VoiceTutor] show_*-dedup: %s matched existing %s by signature', action, existing.itemId);
        onDebugEvent?.('show_dedup_skip', `${action} → ${existing.itemId}`);
        onDebugEvent?.('render_dropped', `${action} — duplicate of ${existing.itemId}`);
        // The brain re-showed this figure because it's about to narrate it.
        // Dropping the duplicate is right; leaving the student on another
        // page is not (session-1783693044096: the tutor described the
        // photosynthesis diagram while the student sat two pages away).
        // Scroll to it — but never yank the view for a same-page repeat.
        if (shouldScrollToDedupedItem({
          itemPageTitle: existing.pageTitle,
          currentPageTitle: catalogRef.current.getCurrentPageTitle(),
        })) {
          onWhiteboardCommand([{
            action: 'scrollTo',
            target: 'item',
            targetId: existing.itemId,
          } as unknown as WhiteboardCommand]);
          onDebugEvent?.('dedup_scroll_to_existing', `${existing.itemId} on "${existing.pageTitle}"`);
        }
        // Whiteboard kill-recovery (B): a deferred ("revising") render that the
        // retry just re-emitted identically dedup-dropped right here — that's
        // the CONFIRM signal. Keep the original (drop it from the pending set
        // so it survives the end-of-call cleanup), giving a flash-free
        // restatement: the killed render never left the board.
        if (pendingRevisionRef.current.delete(existing.itemId)) {
          onDebugEvent?.('killed_render_confirmed', existing.itemId);
          // Phase A: un-dim — the retry re-confirmed this render, so it stays
          // at full opacity (it never left the board).
          onWhiteboardCommand([{ action: 'reviseItems', ids: [existing.itemId], revising: false }]);
        }
        // Whiteboard markup Phase 1: record the dedup so the brain
        // learns next turn that its re-emission was suppressed. Include
        // the show_diagram type when present so the advisory reads
        // naturally for the brain ("show_diagram(comparison_table) →
        // existing showDiagram-1"). One-turn lifetime: drained into
        // the next brain stream request and cleared after dispatch.
        {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const diagType = (cmd as any).type;
          const label = typeof diagType === 'string' && diagType.length > 0
            ? `${action}(${diagType}) → existing ${existing.itemId}`
            : `${action} → existing ${existing.itemId}`;
          deduplicatedShowsRef.current.push(label);
        }
        continue;
      }

      const next = (idCountersRef.current.get(action) ?? 0) + 1;
      idCountersRef.current.set(action, next);
      const id = `${action}-${next}`;
      cmdWithId.id = id;
      // Build the feature manifest for this command synchronously so we can
      // surface authoritative feature names in the tool-result JSON. Only
      // migrated renderers produce a non-null manifest; unknown actions get
      // undefined and fall back to the prompt's per-renderer feature docs.
      const manifest = buildManifestForCommand(cmd) ?? undefined;
      commandByIdRef.current.set(id, { cmd: cmdWithId, order: nextCommandOrderRef.current++, manifest });
      // Generic evolve-in-place: compute the subject anchorKey for every PRIMARY
      // figure (so future re-emits can find THIS one), then look up the most
      // recent non-stale same-subject prior. On a confident match the prior is
      // superseded — collect it for removal after the loop. The replacement
      // lands on the active page (the canvas derives pages from the stream, not
      // catalog pageId, so a fresh render can't be relocated onto an arbitrary
      // earlier page; removing the prior + GC'ing its now-empty page leaves
      // exactly one figure either way). Fail-safe: only on isFigureEvolution
      // (containment, same category) + non-stale; kill-recovery owns the replace
      // on its own batches (skip then), and we never yank a render still pending
      // kill-recovery confirmation. See project_tutor_figure_identity_design.md.
      const anchorKey = isPrimaryFigure(action) ? computeAnchorKey(action, cmd) : undefined;
      if (anchorKey && !killRecoveryPinPageId) {
        const prior = catalogRef.current.findEvolvableFigure(anchorKey, STALE_TURNS);
        if (prior && prior.itemId !== id && !pendingRevisionRef.current.has(prior.itemId)) {
          evolveReplaceIds.push(prior.itemId);
          console.log(`[VoiceTutorRealtime] evolve-in-place: ${id} (${anchorKey}) supersedes ${prior.itemId} on ${prior.pageId ?? '(no page)'}`);
          onDebugEvent?.('figure_evolve_replace', `${id} ⟵ ${prior.itemId}`);
        }
      }
      // Register in the authoritative session catalog. The catalog is the
      // single source of truth for tutor_scribble target resolution AND
      // for the show_*-dedup signature lookup. UNCONDITIONAL registration
      // (no manifest-length gate) — items WITHOUT a manifest still need
      // catalog entries so subsequent same-content emissions dedup
      // against them. The catalog's append() synthesizes a whole-item
      // feature from `wholeItemLabelsFor(action, title)` so non-manifest
      // items still have addressable labels.
      // Observed broken 2026-05-15 session: show_code has no manifest
      // dispatch case, so it was being skipped here, and 4 identical
      // emissions across 4 turns all rendered (the brain re-emits the
      // code on every turn habitually). Same gap applies to ~15 other
      // non-manifested renderers (show_run_code, show_early_math,
      // show_phonics, show_graphic_organizer, show_writing_frame,
      // show_solved_example, show_quiz, show_balanced_equation,
      // show_dimensional_check, show_labeled_image, etc.).
      catalogRef.current.append({
        itemId: id,
        action,
        pageTitle: currentPageTitle,
        // Kill-recovery replace (Tier 0): pin the replacement onto the killed
        // render's page so it replaces in place, beating any boundary signal.
        // Otherwise undefined → the catalog stamps the active page.
        pageId: killRecoveryPinPageId ?? undefined,
        title: extractCommandTitle(cmd),
        signature,
        // Subject key for PRIMARY figures only (undefined for supporting
        // renders) — drives generic evolve-in-place on future re-emits.
        anchorKey,
        features: manifest ?? [],
      });
    }
    // Strip duplicate-skipped commands from the render pipeline. They
    // remain in `commands` for index alignment in the duplicates[] array
    // returned to the Realtime hook.
    processed = processed.filter((c) => !droppedAsDuplicate.has(c));

    // Apply generic evolve-in-place removals collected in the loop: pull the
    // superseded prior figures off the board (canvas removeItems pre-pass + PDF
    // export filter) and prune every local structure that maps id → render so
    // dedup / scribble-target resolution / Board Map don't reference a figure
    // the student can no longer see. Mirrors the kill-recovery rollback
    // (rollbackKilledRenders). The replacement was already appended above and
    // lives on the active page, so removing the prior never GCs the page it now
    // occupies; a DIFFERENT page emptied by the removal is GC'd inside
    // removeByIds → gcEmptyPages, and the canvas drops the matching empty bucket.
    if (evolveReplaceIds.length > 0) {
      const unique = Array.from(new Set(evolveReplaceIds));
      const idSet = new Set(unique);
      onWhiteboardCommand([{ action: 'removeItems', ids: unique }]);
      const beforeMirror = whiteboardCommandsRef.current.length;
      whiteboardCommandsRef.current = whiteboardCommandsRef.current.filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (c) => !idSet.has((c as any).id),
      );
      const prunedFromMirror = beforeMirror - whiteboardCommandsRef.current.length;
      whiteboardCommandCountRef.current = Math.max(0, whiteboardCommandCountRef.current - prunedFromMirror);
      for (const id of unique) commandByIdRef.current.delete(id);
      const prunedFromCatalog = catalogRef.current.removeByIds(unique);
      console.warn(
        `[VoiceTutorRealtime] evolve-in-place removed ${unique.length} superseded figure(s): ` +
          `mirror-${prunedFromMirror} catalog-${prunedFromCatalog} [${unique.join(', ')}]`,
      );
      onDebugEvent?.('figure_evolve_removed', `${unique.length}: ${unique.join(',')}`);
    }

    // Set / transfer the active (or pinned) page's subject anchor from this
    // batch's first PRIMARY figure, so the H6 same-segment-different-figure
    // backstop compares against the real figure's subject key. Covers the
    // first figure on a fresh page AND the kill-recovery/redraw replace case
    // (the replacement figure becomes the new anchor — anchor-transfer, Q5).
    // Only figures that actually rendered have an `id` (dedup-dropped ones
    // were skipped before id assignment), so this never anchors to a phantom.
    for (const cmd of processed) {
      const a = String(cmd.action);
      if (!isPrimaryFigure(a)) continue;
      const id = (cmd as { id?: string }).id;
      if (!id) continue;
      const it = catalogRef.current.getItem(id);
      if (!it?.pageId) continue;
      catalogRef.current.setPageAnchor(it.pageId, id, computeAnchorKey(a, cmd));
      break; // first primary figure only
    }

    // Resolve a stamped targetId → which page + item index it lives at,
    // by walking the running command history. The catalog gives us the
    // itemId; this step maps that id onto (pageIndex, itemIndexInPage)
    // so the overlay router + auto-scroll injector can place the mark.
    const resolveTargetFromId = (targetId: string): { itemIndex: number; pageTitle?: string; pageIndex: number; order: number } | null => {
      const entry = commandByIdRef.current.get(targetId);
      if (!entry) return null;
      const fullList = [...whiteboardCommandsRef.current, ...processed];
      let pageTitle: string | undefined;
      let pageIndex = 0;
      let itemIndexInPage = 0;
      let foundIndex = -1;
      for (let i = 0, o = 0; i < fullList.length; i++) {
        const c = fullList[i];
        const act = String(c.action);
        if (act === 'newPage') {
          if (pageIndex === 0 && itemIndexInPage === 0 && pageTitle === undefined) {
            // Implicit page 0 had no content — this newPage IS page 0.
          } else {
            pageIndex += 1;
          }
          pageTitle = (c as { title?: string }).title;
          itemIndexInPage = 0;
          continue;
        }
        if (META_ACTIONS.has(act) && act !== 'newPage') continue;
        // Handwrite is filtered OUT of renderableCommands in
        // WhiteboardCanvas (it renders via the page-level overlay,
        // not inline as a renderable item). If we counted it toward
        // itemIndexInPage here, scribbles whose target is on an
        // unrelated show_* item AFTER a handwrite would route to the
        // wrong itemIndex relative to the DOM-rendered items list.
        // Skip the increment so handwrites don't take a slot — they
        // still get cataloged and addressable, just not as a per-page
        // item index. Phase 1' of the whiteboard markup initiative.
        if (act === 'handwrite' && o !== entry.order) {
          o += 1;
          continue;
        }
        itemIndexInPage += 1;
        if (o === entry.order) { foundIndex = itemIndexInPage; break; }
        o += 1;
      }
      if (foundIndex < 0) return null;
      return { itemIndex: foundIndex, pageTitle, pageIndex, order: entry.order };
    };

    // Resolve every scribble's `target` string against the session catalog.
    // The catalog is the single source of truth — no DOM lookup, no
    // featAliases, no fuzzy fallback. If a scribble's target fails to
    // resolve, push a structured error into `rejected` with the current
    // feature list so the tutor's next response picks a real target.
    for (const cmd of processed) {
      if (cmd.action !== 'scribble') continue;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cmdAny = cmd as any;
      const raw = typeof cmdAny.target === 'string' ? cmdAny.target.trim() : '';
      if (!raw) {
        // Round-7+ Fix: silently drop empty-target scribble. Soft
        // pedagogy aid; not worth a retry cascade.
        // Phase 1 (2026-05-13): no advisory for empty target — brain
        // can't act on an empty string anyway.
        console.warn('[VoiceTutor] scribble-reject (silent drop): empty target');
        onDebugEvent?.('scribble_reject_empty_silent', '(no target)');
        cmdAny._scribbleRejected = true;
        continue;
      }
      const result = catalogRef.current.resolveTarget(raw, {
        page: typeof cmdAny.page === 'number' ? cmdAny.page : undefined,
      });
      if (result.ok && result.pageFallback) {
        // Board Map fail-open: the brain page-qualified to a page that did
        // NOT contain the target, so resolution fell back to the whole board.
        // The mark still landed (correct item via newest-first); surface the
        // mismatch for verification. Not pushed to unrealized_marks — that
        // block means "mark failed", and this one succeeded.
        console.log('[VoiceTutor] scribble page-scope fallback: target="%s" page=%s → resolved board-wide', raw, cmdAny.page);
        onDebugEvent?.('scribble_page_fallback', `"${raw}" (page ${cmdAny.page} → board)`);
      }
      if (!result.ok) {
        // Round-7+ Fix: silently drop tutor_scribble no-match. Previously
        // this pushed a rejection that triggered the full retry cascade
        // — observed 2026-05-03 session: brain emitted tutor_scribble
        // with a bad target ("the problem statement text"), runtime
        // rejected, brain retried with another tutor_scribble, audio
        // overlapped between attempts producing the "gibberish" the
        // user reported. tutor_scribble is a SOFT pedagogy aid (a
        // highlight/circle on the board) — getting the target wrong
        // doesn't break the lesson, and the brain's spoken narration
        // is independently usable. Drop the bad scribble silently and
        // let the speech land cleanly without a retry cascade.
        //
        // Phase 1 (2026-05-13): also record the failed target so the
        // brain learns next turn via `<unrealized_marks>` advisory.
        // NOT a same-turn rejection — fires NEXT turn only.
        unrealizedMarkRef.current.push(raw);
        console.warn('[VoiceTutor] scribble-reject (silent drop): target="%s" (%s)', raw, result.reason);
        onDebugEvent?.('scribble_reject_no_match_silent', `"${raw}" (${result.reason})`);
        cmdAny._scribbleRejected = true;
        continue;
      }
      // Non-scribbleable feature. Two cases:
      //   (a) the synthetic whole-item alias (canonical === itemId) —
      //       tutor should scroll, then scribble a sub-feature.
      //   (b) iframe-backed item (Desmos graph, Ketcher molecule) — the
      //       overlay can't reach inside a third-party iframe; the
      //       right action is scrollTo + verbal explanation.
      if (result.scribbleable === false) {
        // Round-7+ Fix: silently drop whole-item-alias and iframe-target
        // scribbles. Same rationale as the no-match silent-drop above —
        // tutor_scribble is a soft pedagogy aid; failing to scribble
        // doesn't break the lesson, and surfacing as a rejection
        // triggers a retry cascade with overlapping audio.
        // Phase 1: record so brain learns next turn (whole-item alias is
        // a real signal — brain promised a sub-feature mark but only
        // pointed at the wrapper).
        const isWholeItemAlias = result.canonical === result.itemId;
        unrealizedMarkRef.current.push(raw);
        console.warn('[VoiceTutor] scribble-reject (silent drop): target="%s" → %s (%s)', raw, isWholeItemAlias ? 'whole-item alias' : 'iframe', result.action);
        onDebugEvent?.(isWholeItemAlias ? 'scribble_reject_whole_item_silent' : 'scribble_reject_iframe_silent', `"${raw}" → ${result.action}`);
        cmdAny._scribbleRejected = true;
        continue;
      }
      // Catalog match — stamp the resolved addressing onto the command
      // so downstream (auto-scroll, overlay router, PDF capture) can
      // place the mark without any further guessing.
      cmdAny.targetId = result.itemId;
      cmdAny.targetFeature = result.canonical;
      // Friendly display name straight from the manifest. The strip
      // reads this and skips the DOM lookup entirely — no canonical-
      // first phase, no typewriter intermediate state.
      if (result.displayName) {
        cmdAny._displayName = result.displayName;
      }
      const located = resolveTargetFromId(result.itemId);
      if (located) {
        cmdAny.targetItemIndex = located.itemIndex;
        cmdAny.targetPageIndex = located.pageIndex;
        if (located.pageTitle) cmdAny.targetPageTitle = located.pageTitle;
      }
      // Cross-turn dedup: if an identical scribble (same target item +
      // feature + shape + color + label) is already on the board,
      // silently drop the re-emission. The brain often re-narrates a
      // visual and re-emits the same scribble call — without dedup
      // each turn adds another mark, the label-staggerer alternates
      // positions, and you see two "key traits!" labels stacked on
      // the same highlight (observed 2026-05-13 Phase 2a session #5
      // on the frayer characteristics quadrant).
      //
      // Signature mirrors show_* dedup: stable across turns, scoped
      // to a single render target. itemId is part of the key so the
      // same scribble re-emitted on a fresh diagram (e.g., a redrawn
      // t_chart with different content) still lands.
      const sig = JSON.stringify({
        itemId: result.itemId,
        feature: result.canonical,
        shape: cmdAny.shape,
        color: cmdAny.color ?? null,
        label: cmdAny.label ?? null,
      });
      const isDuplicate = whiteboardCommandsRef.current.some((priorCmd) => {
        if (priorCmd.action !== 'scribble') return false;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const p = priorCmd as any;
        if (!p.targetId || !p.targetFeature) return false;
        const priorSig = JSON.stringify({
          itemId: p.targetId,
          feature: p.targetFeature,
          shape: p.shape,
          color: p.color ?? null,
          label: p.label ?? null,
        });
        return priorSig === sig;
      });
      if (isDuplicate) {
        cmdAny._scribbleRejected = true;
        console.warn('[VoiceTutor] scribble-dedup: same target+shape+color+label already on board, silent drop');
        onDebugEvent?.('scribble_dedup_silent', `${result.itemId}/${result.canonical} ${cmdAny.shape}`);
        continue;
      }
      console.log(
        '[VoiceTutor] scribble-resolved: target="%s" → %s/%s (item %d, page %d)',
        raw, result.itemId, result.canonical,
        located?.itemIndex ?? -1, located?.pageIndex ?? -1,
      );
      // R2 E3: scribble commands skip the generic id-stamping loop above
      // (it `continue`s on every META_ACTIONS member, and 'scribble' is
      // one) — handwrite gets a stable `id` there "for free", scribble
      // does not. The ink-note drag needs an EXACT, stable way to address
      // a specific command back in `whiteboardCommands` for a `userPos`
      // mutation: the overlay's rendered array is page-scoped and can
      // reorder relative to the raw stream (cross-page scribble
      // relocation in WhiteboardCanvas's `pages` memo, `dedupeSupersededCommands`,
      // `removeItems` pruning), so an index recomputed on the VTR side
      // cannot be trusted to name the same command. A stamped id sidesteps
      // that reconstruction entirely — stamp once, guarded so a resumed/
      // replayed scribble that already carries an id (persisted from a
      // prior save) is never re-stamped.
      if (!cmdAny.id) {
        const nextScribbleId = (idCountersRef.current.get('scribble') ?? 0) + 1;
        idCountersRef.current.set('scribble', nextScribbleId);
        cmdAny.id = `scribble-${nextScribbleId}`;
      }
    }
    // Strip any scribbles we pushed rejections for — they get surfaced to
    // the tutor as tool_result errors, NOT rendered on the board.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    processed = processed.filter((c) => !(c as any)._scribbleRejected);

    // Post-redesign (2026-05-13): tutor_handwrite is now a pure
    // text-into-strip command — no more `position` / `margin`
    // resolution, no more central-pin escape, no more PDF vs live
    // asymmetry. The schema dropped these fields, but a stale brain
    // may continue emitting them for a few sessions until the system-
    // prompt cache turns over. Silently strip any legacy fields so the
    // strip renderer sees only `{ action, text, color }`.
    //
    // SmoothDraw Phase 3 (default ON post-legibility-gate; kill switch
    // `NEXT_PUBLIC_TUTOR_INK_NOTES=off`): when ink notes are enabled and
    // the command carries a `near` string, resolve it through the same
    // catalog tutor_scribble uses instead of stripping it. Kill switch
    // on, `near` is stripped exactly like the legacy fields below.
    for (const cmd of processed) {
      if (cmd.action !== 'handwrite') continue;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cmdAny = cmd as any;
      // R2 E3: `userPos` (student drag) is client-stamped and MUST survive
      // this normalization — it is never brain-emitted, only re-ingested on
      // resume/replay. This loop only deletes fields it names explicitly
      // below, so `userPos` is untouched by construction; left unset here
      // so a resumed command's stamped `userPos` is never overwritten.
      // Legacy spatial fields are ALWAYS stripped (pre-2026-05-13 brains).
      if ('position' in cmdAny) delete cmdAny.position;
      if ('margin' in cmdAny) delete cmdAny.margin;
      if (inkNotesEnabled() && typeof cmdAny.near === 'string' && cmdAny.near.trim()) {
        // SmoothDraw P3: resolve `near` through the catalog exactly like
        // scribble targets. Failure is SILENT (round-7): the note keeps
        // no target stamp and the overlay places it in the margin column.
        const res = catalogRef.current.resolveTarget(cmdAny.near);
        if (res.ok) {
          cmdAny.targetFeature = res.canonical;
          cmdAny.targetId = res.itemId;
        } else {
          delete cmdAny.targetFeature;
          delete cmdAny.targetId;
        }
        delete cmdAny.near; // resolved (or margin) — the raw string never renders
      } else {
        if ('near' in cmdAny) delete cmdAny.near;
        if ('targetId' in cmdAny) delete cmdAny.targetId;
        if ('targetFeature' in cmdAny) delete cmdAny.targetFeature;
      }
      if ('targetItemIndex' in cmdAny) delete cmdAny.targetItemIndex;
      if ('targetPageIndex' in cmdAny) delete cmdAny.targetPageIndex;
      if ('targetPageTitle' in cmdAny) delete cmdAny.targetPageTitle;
    }

    // SmoothDraw P4: resolve link endpoints through the catalog. Both must
    // resolve or the arrow drops SILENTLY (round-7 — soft pedagogy aid).
    // Cross-turn dedup: an identical from→to(+label) already on the page is
    // a re-emission habit, not a new arrow — drop it silently too.
    //
    // v1 exclusions (deliberate): links get NO auto-scroll injection, NO
    // cross-page relocation (the scribble relocate in WhiteboardCanvas), and
    // do NOT feed the context-detector's Signal A — links carry no
    // page-position stamps (only from/to Feature+Id), and v1 renders arrows
    // only when both endpoints measure on the current page's DOM. A future
    // cross-page arrow story would need page stamps on both endpoints first.
    for (const cmd of processed) {
      if (cmd.action !== 'link') continue;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const c = cmd as any;
      const f = catalogRef.current.resolveTarget(c.from);
      const t = catalogRef.current.resolveTarget(c.to);
      if (!f.ok || !t.ok || (f.canonical === t.canonical && f.itemId === t.itemId)) {
        c._linkRejected = true;
        onDebugEvent?.('link_dropped', `${c.from} -> ${c.to} (${!f.ok ? 'from-miss' : !t.ok ? 'to-miss' : 'self-link'})`);
        continue;
      }
      // itemId is part of the key, same rationale as the scribble dedup
      // above: the same link legitimately re-emitted after its endpoint
      // item was replaced (evolve-in-place / kill-recovery / clear
      // redraws a figure under a fresh itemId) must still land, not be
      // silently dropped forever because an old, now-gone item shared
      // the canonical+label signature.
      const dupe = whiteboardCommandsRef.current.some((prev) => {
        if ((prev as { action?: string }).action !== 'link') return false;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const p = prev as any;
        return p.fromFeature === f.canonical && p.fromId === f.itemId && p.toFeature === t.canonical && p.toId === t.itemId && (p.label ?? '') === (c.label ?? '');
      });
      if (dupe) { c._linkRejected = true; onDebugEvent?.('link_dropped', 'duplicate'); continue; }
      c.fromFeature = f.canonical; c.fromId = f.itemId;
      c.toFeature = t.canonical; c.toId = t.itemId;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    processed = processed.filter((cmd) => !(cmd as any)._linkRejected);

    // Auto-inject scrollTo before any scribble that doesn't have one.
    // The tutor sometimes emits tutor_scribble without tutor_scroll_whiteboard
    // first, leaving the student unable to see the mark (2026-04-23 session 7).
    // Walk processed in order; for each scribble, check whether a scrollTo
    // to the SAME target was emitted earlier in this batch. If not,
    // synthesise one just before the scribble. Also handle cross-page —
    // if the referenced item lives on a different page, inject a page
    // navigation scrollTo first.
    const withAutoScrolls: WhiteboardCommand[] = [];
    const itemsAlreadyScrolledThisBatch = new Set<number>();
    // Dedup key per batch: the stable targetId when we have one, else the
    // title, else the index — so the same page isn't navigated twice.
    const pagesAlreadyNavigatedThisBatch = new Set<string>();
    // Emit a page-switch scrollTo for a resolved target. Prefer the STABLE
    // targetId for cross-page navigation: page TITLES repeat (a lesson segment
    // spanning two pages titles both the same) and the newPage-counted
    // pageINDEX can drift from the canvas's rendered page list when
    // evolve-in-place / kill-recovery removeItems empties a bucket (the canvas
    // drops empty pages; resolveTargetFromId's walk doesn't). Either alone can
    // land the auto-page-switch on the WRONG page, so the scribble overlay then
    // searches a DOM that lacks the feature and never resolves (2026-06-19
    // ellipse session: "circle the focus" switched to the TANGENT ellipse's
    // page — same segment title — not the FOCI ellipse's page → 79 resolve-miss,
    // no paint). The canvas locates the page that actually CONTAINS targetId;
    // title + index ride along as fallbacks for targets without a stamped id.
    const pushPageScrollTo = (pageTitle: string | undefined, pageIndex: number, targetId?: string) => {
      const dedupKey = targetId ?? pageTitle ?? `#${pageIndex}`;
      if (pagesAlreadyNavigatedThisBatch.has(dedupKey)) return;
      pagesAlreadyNavigatedThisBatch.add(dedupKey);
      withAutoScrolls.push({
        action: 'scrollTo',
        target: 'page',
        ...(targetId ? { targetId } : {}),
        ...(pageTitle ? { pageTitle } : {}),
        pageIndex,
      });
    };
    for (const cmd of processed) {
      if (cmd.action === 'scrollTo') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const cmdAny = cmd as any;
        const raw = typeof cmdAny.target === 'string' ? cmdAny.target.trim() : '';
        // Reserved keywords scroll the current page edges. Keep the
        // command as-is so WhiteboardCanvas's scrollTo handler runs it.
        if (raw === 'top' || raw === 'bottom') {
          // Re-stamp into the WhiteboardCanvas-friendly shape.
          cmdAny.target = raw;
          withAutoScrolls.push(cmd);
          continue;
        }
        // Feature-name path: resolve via the session catalog. On hit,
        // emit a page-switch (if cross-page) + an item scroll. On miss,
        // surface a structured error so the tutor retries.
        if (!raw) {
          rejected.push({ action: 'tutor_scroll_whiteboard', reason: 'target is required.' });
          continue;
        }
        const result = catalogRef.current.resolveTarget(raw, {
          page: typeof cmdAny.page === 'number' ? cmdAny.page : undefined,
        });
        if (result.ok && result.pageFallback) {
          // Board Map fail-open (see scribble path): page-scope missed, fell
          // back to the whole board; the scroll still resolves to an item.
          console.log('[VoiceTutor] scrollTo page-scope fallback: target="%s" page=%s → resolved board-wide', raw, cmdAny.page);
          onDebugEvent?.('scrollTo_page_fallback', `"${raw}" (page ${cmdAny.page} → board)`);
        }
        if (!result.ok) {
          // Page-title fallback: the brain often emits a page title as
          // the scroll target (e.g. `target:"Six Kingdoms"` right after
          // a new_page call) — that's not a feature name so the regular
          // resolver misses it. Match against tracked page titles before
          // rejecting.
          const pageMatch = catalogRef.current.resolvePageTitle(raw);
          if (pageMatch) {
            const located = resolveTargetFromId(pageMatch.itemId);
            if (located) {
              pushPageScrollTo(pageMatch.pageTitle, located.pageIndex, pageMatch.itemId);
              console.log(
                '[VoiceTutor] scrollTo-page-title-match: target="%s" → page "%s" (page %d)',
                raw, pageMatch.pageTitle, located.pageIndex,
              );
              onDebugEvent?.(
                'scrollTo_page_title_match',
                `"${raw}" → page "${pageMatch.pageTitle}"`,
              );
              continue;
            }
          }
          const hint = result.candidates.length > 0
            ? ` Valid targets: ${result.candidates.slice(0, 14).map((c) => `"${c.target}" on ${c.on}`).join(', ')}.`
            : '';
          rejected.push({
            action: 'tutor_scroll_whiteboard',
            reason: `${result.message}${hint} Retry with the exact name of an existing feature, or "top"/"bottom" to scroll the current page.`,
          });
          console.warn('[VoiceTutor] scrollTo-reject: target="%s" (%s)', raw, result.reason);
          onDebugEvent?.('scrollTo_reject_no_match', `"${raw}" (${result.reason})`);
          continue;
        }
        const located = resolveTargetFromId(result.itemId);
        if (located) {
          pushPageScrollTo(located.pageTitle, located.pageIndex, result.itemId);
          // Stamp targetFeature so the renderer's scroll handler can
          // scrollIntoView() the specific feature element (not just the
          // item's top). Avoids landing above a feature that lives near
          // the bottom of a tall item — e.g. "scroll to intersection
          // points" landed at the top of the graph instead of where
          // the points sit.
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (withAutoScrolls as any).push({
            action: 'scrollTo', target: 'item',
            itemIndex: located.itemIndex,
            targetId: result.itemId, // canvas resolves the item by id (index drifts)
            targetFeature: result.canonical,
          });
          itemsAlreadyScrolledThisBatch.add(located.itemIndex);
          console.log(
            '[VoiceTutor] scrollTo-resolved: target="%s" → %s (item %d, page %d)',
            raw, result.itemId, located.itemIndex, located.pageIndex,
          );
        }
        continue; // original feature-name scrollTo is replaced by the synthesised pair
      }

      if (cmd.action === 'scribble') {
        // The catalog-driven resolver above already stamped targetId,
        // targetFeature, targetItemIndex, targetPageIndex, and (when
        // available) targetPageTitle. Here we just inject any needed
        // page-switch + item-scroll before the scribble renders.
        const effectiveIndex = cmd.targetItemIndex;
        const effectivePageTitle = cmd.targetPageTitle;
        const effectivePageIndex = cmd.targetPageIndex;
        const effectiveTargetId = cmd.targetId;
        if (typeof effectivePageIndex === 'number') {
          pushPageScrollTo(effectivePageTitle, effectivePageIndex, effectiveTargetId);
          console.log(
            '[VoiceTutorRealtime] Auto-page-switch injected before scribble →',
            effectivePageTitle ?? `page ${effectivePageIndex}`,
          );
          onDebugEvent?.(
            'auto_page_switch_before_scribble',
            effectivePageTitle ?? `page ${effectivePageIndex}`,
          );
        }
        if (typeof effectiveIndex === 'number' && !itemsAlreadyScrolledThisBatch.has(effectiveIndex)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const tf = (cmd as any).targetFeature as string | undefined;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (withAutoScrolls as any).push({
            action: 'scrollTo', target: 'item',
            itemIndex: effectiveIndex,
            ...(effectiveTargetId ? { targetId: effectiveTargetId } : {}), // canvas resolves by id (index drifts)
            ...(tf ? { targetFeature: tf } : {}),
          });
          itemsAlreadyScrolledThisBatch.add(effectiveIndex);
          console.log('[VoiceTutorRealtime] Auto-scrollTo injected before scribble for item', effectiveIndex, 'feature', tf ?? '(none)');
          onDebugEvent?.('auto_scroll_before_scribble', `Item ${effectiveIndex}${tf ? ` (${tf})` : ''}`);
        }
      }
      withAutoScrolls.push(cmd);
    }
    processed = withAutoScrolls;

    // Drop non-visual bookkeeping commands before they reach the renderer.
    // advanceLesson + markSegmentComplete + recordGap + flagPrerequisiteGap
    // + the 3 topic-notes overlays are state side-effects already applied
    // above (segment id advance, mastery deltas, gap accumulator, overlay
    // PATCH dispatch). Without this filter the canvas tries to render
    // them and shows "Unknown command type" cards.
    processed = processed.filter(
      (c) =>
        c.action !== 'advanceLesson' &&
        c.action !== 'markSegmentComplete' &&
        c.action !== 'proposePlanSwap' &&
        c.action !== 'confirmPlanLos' &&
        c.action !== 'recordGap' &&
        c.action !== 'flagPrerequisiteGap' &&
        c.action !== 'expandTopicNotesTheory' &&
        c.action !== 'addTopicNotesMethod' &&
        c.action !== 'addTopicNotesPointer',
    );

    // Render↔speech sync: on the brain-stream path this BUFFERS the visual
    // dispatch (flushed when the introducing sentence is spoken); off-path
    // or with the flag off it dispatches immediately. Everything below —
    // catalog mirror, transcript attach, the synchronously-returned
    // assignedIds/boardSnapshot/rejected — runs NOW regardless, so brain
    // retry-feedback + dedup ordering are unaffected (catalog leads pixels).
    dispatchVisualRef.current(processed, opts?.anchorSentence);
    // Mirror into our local running log so targetId lookups across future
    // batches can walk the full session history without round-tripping
    // through the parent's state.
    whiteboardCommandsRef.current = [...whiteboardCommandsRef.current, ...processed];
    whiteboardCommandCountRef.current += processed.length;
    console.log('[VoiceTutorRealtime] Whiteboard command count now:', whiteboardCommandCountRef.current);

    // Attach validated commands to the most recent tutor transcript entry
    const lastIdx = transcriptRef.current.length - 1;
    if (lastIdx >= 0 && transcriptRef.current[lastIdx].role === 'tutor') {
      const existing = transcriptRef.current[lastIdx].whiteboardCommands || [];
      transcriptRef.current[lastIdx] = {
        ...transcriptRef.current[lastIdx],
        whiteboardCommands: [...existing, ...processed],
      };
      onTranscriptUpdate([...transcriptRef.current]);
    }

    processed.forEach((cmd) => {
      onTrackInteraction?.('tool_use', 'whiteboard', { ...cmd });
    });

    // Hand the Realtime hook the rejection list so it can honestly report
    // success:false to the LLM for any drops and stop the cascade of retries.
    // Surface a transient status to the student UI so they know the system
    // is recovering, without having to prompt "I don't see anything".
    if (rejected.length > 0) {
      const firstAction = rejected[0].action;
      const friendly = firstAction === 'show_problem' ? 'Re-rendering problem…'
        : firstAction === 'show_equation' ? 'Re-rendering equation…'
        : firstAction === 'show_geometry' ? 'Re-rendering diagram…'
        : 'Re-rendering whiteboard…';
      setWhiteboardStatus(friendly);
      if (whiteboardStatusTimerRef.current) clearTimeout(whiteboardStatusTimerRef.current);
      whiteboardStatusTimerRef.current = setTimeout(() => setWhiteboardStatus(null), 4500);
    } else if (processed.length > 0) {
      // Successful render — clear any lingering "retrying" status.
      if (whiteboardStatus) setWhiteboardStatus(null);
      if (whiteboardStatusTimerRef.current) {
        clearTimeout(whiteboardStatusTimerRef.current);
        whiteboardStatusTimerRef.current = null;
      }
    }
    // Surface the ids we stamped on this batch so the Realtime hook can
    // include them in the tool_call_output — the tutor will see them and
    // can reference them later via targetId.
    const assignedIds = processed
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((c) => (c as any).id)
      .filter((id): id is string => typeof id === 'string');
    // Mirror manifests in the same order as assignedIds so the Realtime
    // hook can zip them together when building the tool-result payload.
    const manifests = assignedIds.map((id) => commandByIdRef.current.get(id)?.manifest);
    // Per-turn whiteboard snapshot — every show_* tool_result echoes the
    // current board state so the tutor sees what's already drawn at
    // decision time and routes through scroll/scribble for repeats.
    const boardSnapshot = catalogRef.current.getSnapshot();
    // Phase 4.2 drop telemetry: one uniform event per validator-rejected
    // command (the per-site events above are heterogeneous; this is the
    // grep-able / embed-persisted roll-up — see EMBED_DEBUG_EVENT_PREFIXES).
    for (const r of rejected) onDebugEvent?.('render_dropped', `${r.action} — ${r.reason.slice(0, 120)}`);
    return { rejected, assignedIds, manifests, duplicates, boardSnapshot };
  }, [onWhiteboardCommand, onTranscriptUpdate, onTrackInteraction, validateToolCalls, validateToolCallViaClaude, onDebugEvent, applyResolvedAdvance]);

  // Build a context summary from the current transcript
  const buildContextSummary = useCallback(() => {
    const entries = transcriptRef.current;
    if (entries.length === 0) return '';

    // Include the last 6 messages as verbatim context
    const recent = entries.slice(-6)
      .map(e => `${e.role === 'student' ? 'Student' : 'Tutor'}: ${e.text.slice(0, 200)}`)
      .join('\n');

    // Build a high-level summary of what's been covered
    const topicsCovered = entries
      .filter(e => e.role === 'tutor' && e.text.length > 50)
      .slice(-3)
      .map(e => e.text.slice(0, 100))
      .join('; ');

    return `Session context: Subject=${subject}, Topic=${topic}, Level=${level}, Student=${studentName || 'unknown'}, Goal=${sessionGoal}. The session has ${entries.length} messages so far. We are in the MIDDLE of a tutoring session — do NOT re-introduce yourself or greet the student again.\n\nTopics covered so far: ${topicsCovered}\n\nRecent conversation:\n${recent}`;
  }, [subject, topic, level, studentName, sessionGoal]);

  // Detect if the tutor response looks like a context-loss greeting
  const detectContextLoss = useCallback((text: string): boolean => {
    if (tutorTurnCountRef.current < 3) return false; // Too early to tell
    return isContextLossGreeting(text);
  }, []);

  // --- Verify a student's prior answer when the tutor is about to reject it.
  // If Wolfram says the student was right, inject a self-correction so the
  // tutor reconciles instead of gaslighting the student. Runs asynchronously
  // relative to response.done so voice playback is unaffected.
  const verifyStudentAnswerIfRejected = useCallback(async (tutorText: string) => {
    if (!isRejection(tutorText)) return;

    // Get the student's most recent utterance before this tutor turn
    const studentUtterances = transcriptRef.current.filter(e => e.role === 'student');
    const lastStudent = studentUtterances[studentUtterances.length - 1]?.text?.trim();
    if (!lastStudent) return;

    // Only proceed if the student's utterance looks like a math answer
    const hasMath = /[\d]|\^|\bx\b|\bsqrt|\bpi\b|\bplus\b|\bminus\b|\btimes\b|\bover\b/i.test(lastStudent);
    if (!hasMath) return;
    // Wolfram scoped down (default OFF) — see TUTOR_WOLFRAM_MATH_CHECK.
    if (!TUTOR_WOLFRAM_MATH_CHECK) return;

    // Build a verification prompt: compare tutor-claimed correct answer vs student's
    const studentLatex = spokenToRoughLatex(lastStudent);
    // Try to pull the "correct" answer the tutor just asserted
    const assertedMatch = tutorText.match(/(?:correct|right)\s+answer\s+is\s+([^.,;!?]+)/i)
      || tutorText.match(/actually,?\s+(?:it'?s|the answer is)\s+([^.,;!?]+)/i);
    const tutorClaimed = assertedMatch ? spokenToRoughLatex(assertedMatch[1]) : null;

    // Ask Wolfram whether student's answer is equivalent to tutor's claim, or
    // — if tutor only said "not quite" without stating their own answer — whether
    // the student's answer is equivalent to the last declared-function operation
    // (derivative / integral) the session is working on.
    try {
      const resp = await fetch('/api/tutor/validate-math-wolfram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latex: tutorClaimed
            ? `${tutorClaimed} = ${studentLatex}`
            : studentLatex,
          label: 'student answer verification',
          conversationContext: transcriptRef.current.slice(-6)
            .map(e => `${e.role === 'student' ? 'Student' : 'Tutor'}: ${e.text}`).join('\n'),
          declaredFunctions: declaredFunctionsRef.current.map(d => ({
            name: d.name, argVar: d.argVar, body: d.body,
          })),
          // Hint: if the session was working on a derivative, check the student's
          // answer against the derivative of the most recently declared function.
          expectedOperation: /derivat/i.test(tutorText) || /derivat/i.test(lastStudent)
            ? 'derivative'
            : /integral/i.test(tutorText) || /integral/i.test(lastStudent)
              ? 'integral'
              : undefined,
        }),
      });
      if (!resp.ok) return;
      const result = await resp.json();

      // For a context-verified student answer that IS correct, Wolfram returns
      // `correct: true` on a derivative/integral check. Meaning: the student
      // really was right and the tutor was wrong to reject them.
      if (result.correct === true && (result.source === 'wolfram-derivative' || result.source === 'wolfram-integral')) {
        console.warn('[VoiceTutorRealtime] Tutor rejected a CORRECT student answer. Injecting self-correction.');
        onDebugEvent?.('answer_miscorrection', `Tutor rejected correct student answer: "${lastStudent}"`);
        if (injectContextRef.current) {
          injectContextRef.current(
            `IMPORTANT CORRECTION: You just told the student their answer was wrong (or "close but not right"), ` +
            `but their answer "${lastStudent}" IS actually correct. ` +
            `Apologize briefly for the mix-up, affirm their answer, and move on. Do not invent a new "correct answer" that contradicts the student's — they had it right.`
          );
        }
      }
    } catch (err) {
      console.error('[VoiceTutorRealtime] Student-answer verification failed:', err);
    }
  }, [onDebugEvent]);

  // --- Spoken final-answer verification.
  // When the tutor announces a final answer verbally ("the final answer is X"),
  // cross-check X against Wolfram's computation of the current problem.
  // Catches cases where the tutor never wrote the answer on the board
  // (so the voice↔whiteboard check can't fire) but still states it aloud.
  const verifySpokenFinalAnswer = useCallback(async (tutorText: string) => {
    const claim = extractFinalAnswerClaim(tutorText);
    if (!claim) return;
    const problem = currentProblemRef.current;
    if (!problem) return;

    // Only handle integrals for now — the highest-value case. Generic problems
    // are harder because Wolfram needs a specific query shape.
    if (problem.kind !== 'integral') return;

    try {
      // Ask Wolfram for the exact value of the problem.
      // The problem.statement can be latex OR prose; send it as-is — Wolfram
      // parses both "Integral_0^1 (x^2 e^x)/(x+1)^2 dx" and "integrate..." forms.
      const query = problem.statement
        .replace(/Integral_/g, 'integrate_')  // mild nudge; Wolfram handles both
        .replace(/\\int/g, 'integrate');
      const resp = await fetch('/api/tutor/validate-math-wolfram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Treat the whole thing as a single claim "<problem> = <tutor claim>"
          // and let Wolfram decide if the RHS matches the LHS value.
          latex: `${query} = ${spokenToRoughLatex(claim)}`,
          label: 'final answer verification',
          conversationContext: transcriptRef.current.slice(-6)
            .map(e => `${e.role === 'student' ? 'Student' : 'Tutor'}: ${e.text}`).join('\n'),
          declaredFunctions: declaredFunctionsRef.current.map(d => ({
            name: d.name, argVar: d.argVar, body: d.body,
          })),
        }),
      });
      if (!resp.ok) return;
      const result = await resp.json();
      if (result.correct === false && result.issues?.length) {
        console.warn('[VoiceTutorRealtime] Spoken final answer is WRONG:', claim, '→', result.issues);
        onDebugEvent?.('wrong_final_answer', `Tutor spoke "${claim}" but Wolfram disagrees: ${result.issues.join('; ')}`);
        if (injectContextRef.current) {
          injectContextRef.current(
            `IMPORTANT CORRECTION: You just verbally told the student the final answer is "${claim}", ` +
            `but Wolfram Alpha verification shows that is incorrect (${result.issues.join('; ')}). ` +
            `Tell the student you need to recheck that calculation. Do NOT re-assert the wrong value. ` +
            `Start again from the last correct step and guide the student through the integral carefully.`
          );
        }
      } else if (result.correct === true) {
        console.log('[VoiceTutorRealtime] Spoken final answer verified correct:', claim);
      }
    } catch (err) {
      console.error('[VoiceTutorRealtime] Final-answer verification failed:', err);
    }
  }, [onDebugEvent]);

  // --- Voice ↔ whiteboard math consistency check.
  // If the tutor's spoken claim ("the derivative is 4x³ - 12x² + 4") doesn't
  // match any equation on the whiteboard this turn, inject a correction so
  // the next tutor utterance reconciles spoken with written math.
  const checkVoiceWhiteboardConsistency = useCallback((tutorText: string) => {
    const spokenClaims = extractMathClaims(tutorText);
    if (spokenClaims.length === 0) return;
    const boardExprs = turnEquationsRef.current;
    if (boardExprs.length === 0) return;

    for (const claim of spokenClaims) {
      const rough = spokenToRoughLatex(claim);
      if (rough.length < 3) continue;
      // Does any board equation contain this spoken claim (loosely)?
      const matches = boardExprs.some(eq => {
        // Convert \frac{a}{b} → a/b BEFORE stripping other latex commands,
        // otherwise "\frac{16}{3}" becomes "163" and fails fraction match.
        const eqNorm = eq.toLowerCase()
          .replace(/\\frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g, '$1/$2')
          .replace(/\\sqrt\s*\{([^{}]+)\}/g, 'sqrt($1)')
          .replace(/\s+/g, '')
          .replace(/\\[a-z]+/g, '')
          .replace(/\{|\}/g, '');
        return eqNorm.includes(rough) || rough.includes(eqNorm.replace(/^.*=/, ''));
      });
      if (!matches) {
        console.warn(`[VoiceTutorRealtime] Voice claim "${claim}" doesn't match whiteboard. Injecting reconciliation.`);
        onDebugEvent?.('voice_board_mismatch', `Spoken "${claim}" vs board ${boardExprs.join(' | ')}`);
        if (injectContextRef.current) {
          injectContextRef.current(
            `CONSISTENCY CHECK: You just spoke "${claim}" but the whiteboard shows something different (${boardExprs.join('; ')}). ` +
            `The whiteboard is the source of truth — it has been Wolfram-validated. ` +
            `Read from the whiteboard on your next turn and correct what you said out loud.`
          );
        }
        return; // One correction per turn is enough
      }
    }
  }, [onDebugEvent]);

  // Handle response.done — run whiteboard validation + context keeper + usage tracking
  const handleResponseDone = useCallback((usage?: RealtimeUsage) => {
    // Forward usage to parent for cost tracking
    if (usage && onUsageUpdate) {
      onUsageUpdate(usage);
    }

    const tutorText = pendingTutorTextRef.current;
    pendingTutorTextRef.current = null;

    if (!tutorText) {
      turnEquationsRef.current = [];
      return;
    }

    tutorTurnCountRef.current++;

    // --- Context loss detection ---
    if (detectContextLoss(tutorText)) {
      console.warn('[VoiceTutorRealtime] Context loss detected — tutor re-greeted mid-session. Injecting context.');
      onDebugEvent?.('context_loss', `Tutor re-greeted at turn ${tutorTurnCountRef.current}: "${tutorText.substring(0, 100)}"`);
      const summary = buildContextSummary();
      if (summary && injectContextRef.current) {
        injectContextRef.current(summary + '\n\nIMPORTANT: You just lost context and re-greeted the student. Continue where we left off. Do NOT greet or introduce yourself again.');
      }
    }

    // --- Periodic context injection ---
    if (tutorTurnCountRef.current > 0 && tutorTurnCountRef.current % CONTEXT_INJECT_INTERVAL === 0) {
      console.log('[VoiceTutorRealtime] Periodic context injection at turn', tutorTurnCountRef.current);
      const summary = buildContextSummary();
      if (summary && injectContextRef.current) {
        injectContextRef.current(summary);
      }
    }

    // --- Whiteboard verification ---
    // If the tutor claims content is "on the whiteboard" but no commands exist,
    // inject a correction so the tutor doesn't gaslight the student.
    // Triggers on: explicit board references ("on the whiteboard now"), OR
    // introductory phrases that imply freshly-rendered content ("here's a ...",
    // "take a look at the problem") — but only when no whiteboard commands
    // have ever succeeded in the session.
    const claimsOnBoard = /\b(on the (?:white)?board now|right (?:on |there on )?the (?:white)?board|you should see|check (?:the|your) (?:display|whiteboard|board))\b/i.test(tutorText)
      || /\b(here'?s (?:a|the|an) (?:tricky |tough |interesting |simple )?(?:identity|problem|equation|question|integral|derivative|function|graph|diagram)|take a look at (?:the |this )?(?:problem|identity|equation|question|integral|graph|diagram)|it should be up (?:now)?|should be (?:up )?on the (?:white)?board)\b/i.test(tutorText);
    if (claimsOnBoard && whiteboardCommandCountRef.current === 0) {
      console.warn('[VoiceTutorRealtime] Tutor falsely claims whiteboard content exists (0 commands). Injecting correction.');
      onDebugEvent?.('whiteboard_false_claim', `Tutor claimed "${tutorText.substring(0, 100)}" but 0 whiteboard commands exist`);
      if (injectContextRef.current) {
        injectContextRef.current(
          'CORRECTION: You just told the student something is on the whiteboard, but NOTHING was actually drawn or displayed. ' +
          'The whiteboard is empty. Apologize briefly, then describe the concept verbally or try to draw it using your tools. ' +
          'Do NOT claim the whiteboard shows something if you did not successfully use a whiteboard tool.'
        );
      }
    }

    // --- Whiteboard validation pass ---
    // Trigger if: (a) tutor claims to show something visually, OR (b) student asked for visual in their last message
    // SKIP in claudeBrainMode — the brain emits tool calls directly, so this
    // fallback would duplicate visuals and run on Realtime's relay prompt
    // refusals ("I can't draw...") which we never want on the whiteboard.
    const shouldValidate = !claudeBrainMode
      && !turnHadToolCallRef.current
      && (claimsToShowVisual(tutorText) || studentRequestedVisualRef.current);
    if (shouldValidate) {
      console.log('[VoiceTutorRealtime] No tool call but visual expected — running validation pass',
        { tutorClaims: claimsToShowVisual(tutorText), studentRequested: studentRequestedVisualRef.current });
      generateMissingWhiteboardCommands(tutorText);
    }
    studentRequestedVisualRef.current = false;

    // (Pacing v2 streak update moved to callBrainOnce post-stream
    // finalization — handleResponseDone runs per Realtime audio-transcript
    // chunk in claude-brain mode, not per brain turn, so it sees partial
    // text and the affirmation/correction regexes miss reliably.)

    // realtime-2: post-turn judge groundedness check. Fully async — the
    // turn has already played, so the judge never interrupts it. Instead,
    // when it flags ungrounded claim(s) we inject a soft correction note
    // so RT-2 reconciles them on its NEXT turn (the non-interrupting
    // correction loop). claude-brain runs its own judge inside the
    // orchestrator; the GA realtime engine has no judge — so this block
    // is realtime-2 only.
    if (useRealtimeV2 && tutorText.trim()) {
      const boardSummary = buildWhiteboardSummary(catalogRef.current.getSnapshot());
      // focus = the problem the student is currently attending to. Passing
      // it sharply cuts the judge's false-positive rate (it stops flagging
      // grounded speech that simply references a different board card).
      const focus = currentProblemRef.current?.statement;
      fetch('/api/tutor/judge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ boardSummary, spokenText: tutorText, ...(focus ? { focus } : {}) }),
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((judge: { grounded?: boolean; issues?: Array<{ claim: string; why: string; severity?: string }> } | null) => {
          if (!judge?.issues?.length) return;
          const kills = judge.issues.filter((i) => i.severity === 'kill');
          onDebugEvent?.(
            kills.length > 0 ? 'rt2_judge_kill' : 'rt2_judge_advisory',
            `${judge.issues.length}: ${judge.issues[0].claim.slice(0, 80)}`,
          );
          if (kills.length > 0) {
            console.warn('[realtime-2 judge] KILL flagged (correction queued, not interrupting):',
              kills.map((k) => k.claim).join(' | '));
          }
          // Non-interrupting correction loop. The judge can't kill an RT-2
          // turn (already spoken), so feed the flagged claims back as a
          // context note for the NEXT turn. Phrased softly: realtime-2 has
          // no retry / wolfram-override safety net around the judge, so
          // RT-2 must evaluate the flag, not blindly comply.
          if (injectContextRef.current) {
            const issueLines = judge.issues
              .map((i) => `- "${i.claim}"${i.why ? ` — ${i.why}` : ''}`)
              .join('\n');
            injectContextRef.current(
              'GROUNDEDNESS CHECK — a review of your last turn flagged spoken claim(s) that ' +
              'may not match the whiteboard:\n' + issueLines +
              '\nOn your NEXT turn, silently re-check each against the current board. If a claim ' +
              'was genuinely wrong, correct it naturally with the student. If it was actually ' +
              'correct, disregard this. If the board itself is wrong, render the corrected content. ' +
              'Do not mention this check to the student.',
            );
          }
        })
        .catch((err) => console.warn('[realtime-2 judge] failed (ignored):', err));
    }

    // --- Student-answer verification (async, non-blocking) ---
    verifyStudentAnswerIfRejected(tutorText).catch(err =>
      console.error('[VoiceTutorRealtime] verifyStudentAnswerIfRejected threw:', err)
    );

    // --- Spoken final-answer verification (async, non-blocking) ---
    verifySpokenFinalAnswer(tutorText).catch(err =>
      console.error('[VoiceTutorRealtime] verifySpokenFinalAnswer threw:', err)
    );

    // --- Geometry numeric claims — verify tutor's spoken distance/angle/area
    // against the most recent rendered figure. Only fires if geometry has
    // been drawn in this session.
    if (lastGeometryRef.current?.points?.length) {
      fetch('/api/tutor/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: 'geometry-numeric',
          claim: { text: tutorText, points: lastGeometryRef.current.points },
        }),
      })
        .then(r => r.ok ? r.json() : null)
        .then(result => {
          if (!result || result.correct !== false) return;
          onDebugEvent?.('geometry_mismatch', (result.issues || []).join('; '));
          if (injectContextRef.current) {
            injectContextRef.current(
              `GEOMETRY CORRECTION: A numeric claim you just made doesn't match the figure on the board. ` +
              `${(result.issues || []).join(' ')} ` +
              `Double-check your measurement and correct it on your next turn.`
            );
          }
        })
        .catch(err => console.error('[VoiceTutorRealtime] geometry-numeric threw:', err));
    }

    // --- Biology: genotype notation check ---
    // Catches the Xx-vs-xx affirmation bug — if the tutor says "Xx is
    // homozygous recessive", we classify Xx as heterozygous and inject
    // a correction so the next turn anchors the student back to the
    // right notation.
    const genotypeCheck = validateGenotypeAssertion(tutorText);
    if (!genotypeCheck.correct && genotypeCheck.actual && genotypeCheck.claimed) {
      console.warn('[VoiceTutorRealtime] Genotype notation mismatch',
        { genotype: genotypeCheck.genotype, actual: genotypeCheck.actual, claimed: genotypeCheck.claimed });
      onDebugEvent?.('genotype_mismatch',
        `${genotypeCheck.genotype} is ${genotypeCheck.actual}, not ${genotypeCheck.claimed}`);
      if (injectContextRef.current) {
        injectContextRef.current(
          `GENETICS CORRECTION: You just said "${genotypeCheck.genotype} is ${genotypeCheck.claimed.replace('-', ' ')}", ` +
          `but ${genotypeCheck.genotype} is actually ${genotypeCheck.actual.replace('-', ' ')}. ` +
          `Remember: uppercase letter = dominant allele, lowercase = recessive. ` +
          `Xx / Pp / Rr = heterozygous (one of each). xx / pp / rr = homozygous recessive. XX / PP / RR = homozygous dominant. ` +
          `Correct this on your next turn and re-anchor the student.`
        );
      }
    }

    // --- Biology: blood-type compatibility check ---
    // Catches claims like "AB- can receive A-, B-, AB-, O-" that miss or
    // add incorrect donor types. Uses a deterministic rule table.
    const receiveClaim = extractReceiveClaim(tutorText);
    if (receiveClaim) {
      const check = validateReceiveClaim(receiveClaim.recipient, receiveClaim.types);
      if (!check.correct) {
        console.warn('[VoiceTutorRealtime] Blood-type receive claim mismatch',
          { recipient: receiveClaim.recipient, claimed: receiveClaim.types, expected: check.expected });
        onDebugEvent?.('blood_type_mismatch',
          `${receiveClaim.recipient} can actually receive ${check.expected.join(', ')} (tutor said ${receiveClaim.types.join(', ')})`);
        if (injectContextRef.current) {
          const missing = check.missing.length ? ` missed: ${check.missing.join(', ')}.` : '';
          const extra = check.extra.length ? ` incorrectly included: ${check.extra.join(', ')}.` : '';
          injectContextRef.current(
            `BLOOD-TYPE CORRECTION: A ${receiveClaim.recipient} recipient can receive from: ${check.expected.join(', ')}. ` +
            `You said they can receive ${receiveClaim.types.join(', ')}.${missing}${extra} ` +
            `Re-state the correct list to the student on your next turn.`
          );
        }
      }
    }

    // --- Voice ↔ whiteboard math consistency check ---
    checkVoiceWhiteboardConsistency(tutorText);

    // --- Subject-conditional: grammar (ELA) + fact (history) ---
    // Kept behind subject gates so the validators don't fire noisily on
    // math/physics sessions where the tutor routinely writes equations
    // that grammar tools can't parse, or history claims that Wikidata
    // doesn't know. Gating by `subject` keeps cost + noise bounded.
    const subj = (subject || '').toLowerCase();

    if (/\b(ela|english|writing|literature|esl|tesol)\b/.test(subj) && tutorText.length > 40) {
      fetch('/api/tutor/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: 'grammar', claim: { text: tutorText, language: 'en-US' } }),
      })
        .then(r => r.ok ? r.json() : null)
        .then(result => {
          if (!result || result.correct !== false) return;
          const issues = (result.issues || []).slice(0, 2);
          // Grammar issues in the tutor's spoken text are usually transcription
          // artifacts — we log but don't inject unless there are clear typos.
          onDebugEvent?.('grammar_issues', issues.join(' | '));
        })
        .catch(err => console.error('[VoiceTutorRealtime] grammar threw:', err));
    }

    if (/\b(history|social[-\s]?studies|geography|civics|world[-\s]?history|us[-\s]?history)\b/.test(subj)) {
      // Fact-check the tutor's claim. Three patterns we try to extract:
      //   "capital of X is Y"
      //   "X was born in YYYY"
      //   "<event> happened in YYYY"
      const capMatch = tutorText.match(/\bcapital of ([A-Z][a-zA-Z ]+?)\s+is\s+([A-Z][a-zA-Z ]+)/);
      const bornMatch = tutorText.match(/\b([A-Z][a-zA-Z ]+?)\s+was born in\s+(\d{3,4})/);
      const eventMatch = tutorText.match(/\b(?:the\s+)?([A-Z][a-zA-Z' ]+?)\s+(?:happened in|occurred in|took place in|was in)\s+(\d{3,4})/);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const factClaim: { kind: 'capital' | 'birth-year' | 'event-year'; subject: string; claimedValue: string | number } | null =
        capMatch ? { kind: 'capital', subject: capMatch[1].trim(), claimedValue: capMatch[2].trim() }
        : bornMatch ? { kind: 'birth-year', subject: bornMatch[1].trim(), claimedValue: parseInt(bornMatch[2], 10) }
        : eventMatch ? { kind: 'event-year', subject: eventMatch[1].trim(), claimedValue: parseInt(eventMatch[2], 10) }
        : null;
      if (factClaim) {
        fetch('/api/tutor/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ domain: 'fact', claim: factClaim }),
        })
          .then(r => r.ok ? r.json() : null)
          .then(result => {
            if (!result || result.correct !== false) return;
            onDebugEvent?.('fact_wrong',
              `${factClaim.kind} ${factClaim.subject}=${factClaim.claimedValue}, expected ${result.expected}`);
            if (injectContextRef.current && result.expected) {
              injectContextRef.current(
                `FACT CORRECTION: You said ${factClaim.kind} of ${factClaim.subject} is ${factClaim.claimedValue}, ` +
                `but according to Wikidata it's ${result.expected}. ` +
                `On your next turn, correct this quickly so the student doesn't walk away with the wrong fact.`
              );
            }
          })
          .catch(err => console.error('[VoiceTutorRealtime] fact threw:', err));
      }
    }

    // --- Weakness tracking ---
    // Increment the current topic's weakness count when:
    //  • The tutor's response contains a rejection pattern (they corrected
    //    the student's previous answer).
    //  • The last student reply was an explicit "i don't know" / "not sure".
    const lastStudentMsg = transcriptRef.current
      .filter(e => e.role === 'student')
      .slice(-1)[0]?.text || '';
    const studentGaveUp = /\b(i\s*don'?t\s*know|idk|no\s+idea|not\s+sure)\b/i.test(lastStudentMsg);
    const topic = currentTopicRef.current;
    if (topic && (isRejection(tutorText) || studentGaveUp)) {
      const prev = weaknessesRef.current.get(topic) || 0;
      weaknessesRef.current.set(topic, prev + 1);
      console.log('[VoiceTutorRealtime] Weakness +1 on topic:', topic, '→', prev + 1);
    }

    // --- Time-based session lifecycle ---
    // Three checkpoints scaled to T (sessionMaxMinutes):
    //   check-in     at 0.75 * T   — "want a recap / break / keep going?"
    //   rotation     at min(0.92*T, 55)  — OpenAI Realtime caps at ~60 min
    //                                       so for T>60 we still rotate before
    //                                       OpenAI cold-restarts the session.
    //   auto-rotate  at min(0.97*T, 58)  — silent fallback if student ignores
    //                                       the rotation banner.
    // Both rotation events are floored against OpenAI's hard limit; the
    // check-in is purely T-relative (no need to floor).
    const sessionMinutes = (Date.now() - sessionStartMsRef.current) / 60000;
    const T = sessionMaxMinutes;
    const checkInThreshold = 0.75 * T;
    const rotationThreshold = Math.min(0.92 * T, 55);
    const autoRotationThreshold = Math.min(0.97 * T, 58);
    if (sessionMinutes >= checkInThreshold && !longSessionCheckFiredRef.current && injectContextRef.current) {
      longSessionCheckFiredRef.current = true;
      console.log(`[VoiceTutorRealtime] long-session check-in triggered at ${sessionMinutes.toFixed(1)} min (threshold ${checkInThreshold.toFixed(1)})`);
      onDebugEvent?.('long_session_checkin', `Session hit ${sessionMinutes.toFixed(1)} min (T=${T})`);
      injectContextRef.current(
        `SESSION LENGTH CHECK: The student has been studying for ${Math.floor(sessionMinutes)}+ minutes (of a ${T}-minute session). ` +
        'Proactively offer a brief recap and a choice: "We\'ve been at this for a while — want me to recap what we covered, ' +
        'take a quick 2-minute break, or keep going?" Respect whatever they choose. Long uninterrupted sessions lead to fatigue ' +
        'and low retention, so a natural pause here is valuable.'
      );
    }

    // Pre-emptive session rotation — surfaces a UI prompt so the user
    // can choose to continue (rotates the underlying realtime session)
    // or wrap up. See thresholds comment above.
    if (sessionMinutes >= rotationThreshold && !sessionRotationFiredRef.current) {
      sessionRotationFiredRef.current = true;
      console.log(`[VoiceTutorRealtime] rotation prompt shown at ${sessionMinutes.toFixed(1)} min (threshold ${rotationThreshold.toFixed(1)})`);
      onDebugEvent?.('session_rotation_prompt', `Session at ${sessionMinutes.toFixed(1)} min (T=${T})`);
      setSessionRotationPrompt(true);
    }

    // Silent auto-rotation fallback.
    if (sessionMinutes >= autoRotationThreshold && sessionRotationPrompt && !autoRotationFiredRef.current) {
      autoRotationFiredRef.current = true;
      console.warn(`[VoiceTutorRealtime] silent auto-rotation at ${sessionMinutes.toFixed(1)} min (threshold ${autoRotationThreshold.toFixed(1)}) — user ignored banner`);
      onDebugEvent?.('session_auto_rotation', `Silent rotation at ${sessionMinutes.toFixed(1)} min (T=${T})`);
      // Reuse the "Continue" handler path via ref (defined after this callback).
      continueRotationRef.current?.().catch(err =>
        console.error('[VoiceTutorRealtime] Auto-rotation failed:', err)
      );
    }

    // --- Socratic bulldozing check ---
    // If the student has NOT insisted 2+ times on walk-through, the tutor
    // should not work the whole problem in one go. A bulldozing turn looks
    // like: many equations, at least one of which has a computed answer.
    // If detected, inject a correction telling the tutor to pull back to
    // a single guiding question.
    const turnEqs = turnEquationsRef.current;
    const computedAnswers = turnEqs.filter(looksLikeComputedAnswer);
    const insistence = walkThroughInsistenceRef.current;
    // Round 29: when the student asked to try alone, the corrective would
    // order the brain to "ask ONE simple guiding question" — the exact
    // opposite of what the student requested. Hands-off mode suppresses it.
    const bulldozing = !tryAloneRequestedRef.current
      && insistence < 2 && turnEqs.length >= 3 && computedAnswers.length >= 1;
    if (bulldozing) {
      console.warn(
        '[VoiceTutorRealtime] Socratic bulldozing detected:',
        { insistence, turnEqs: turnEqs.length, computed: computedAnswers.length }
      );
      onDebugEvent?.(
        'socratic_bulldozing',
        `Tutor dumped ${turnEqs.length} equations (${computedAnswers.length} computed) after only ${insistence} walk-through insistence(s)`
      );
      if (injectContextRef.current) {
        injectContextRef.current(
          'SOCRATIC CORRECTION: You just worked out a full solution (or multiple problems) without the student asking you to. ' +
          "The student has not insisted on walk-through mode yet. On your next turn, pull back: " +
          'acknowledge what you showed, then ask ONE simple guiding question like "What do you think the first step would be?" ' +
          'Do NOT compute or reveal answers on the board until the student has tried or explicitly insisted again. ' +
          'When they ask for "a problem" (singular), give ONE problem at a time — not a bundle.'
        );
      }
    }

    turnEquationsRef.current = [];
  }, [
    claimsToShowVisual, generateMissingWhiteboardCommands, detectContextLoss, buildContextSummary,
    onUsageUpdate, verifyStudentAnswerIfRejected, verifySpokenFinalAnswer, checkVoiceWhiteboardConsistency,
    useRealtimeV2,
  ]);

  // Handle errors
  const handleError = useCallback((error: Error) => {
    // Non-fatal warnings (e.g. MicSilentWarning) — record as a debug event
    // for the replay timeline but don't show the red error banner or bubble
    // up to the parent's onError (which may end the session).
    if (error.name && error.name.endsWith('Warning')) {
      console.warn('[VoiceTutorRealtime] Warning:', error);
      onDebugEvent?.(error.name, error.message);
      // Mic-silent is actionable BY the student — surface a gentle notice
      // instead of leaving them talking to a tutor that can't hear them.
      // Round-7c: not every MicSilentWarning deserves an immediate banner.
      // `peak=-Infinity` means the probe saw literally zero samples — a
      // real permission/device failure, shown right away as before.
      // Anything else is "quiet but finite", which is exactly what
      // Android's noiseSuppression produces for a student who simply
      // hasn't spoken yet — and the 1s post-open probe almost always
      // lands during the opener's own audio. Gate those instead of
      // alarming a student who was never given a chance to speak.
      if (error.name === 'MicSilentWarning') {
        const bannerText = "I can't hear you — your mic looks silent. Check the mic permission or volume, or type below.";
        const trulyDead = /peak=-Infinity/.test(error.message);
        if (trulyDead) {
          setMicNotice(bannerText);
          if (micNoticeTimerRef.current) clearTimeout(micNoticeTimerRef.current);
          micNoticeTimerRef.current = setTimeout(() => setMicNotice(null), 20000);
        } else if (!micEverHeardRef.current) {
          pendingMicNoticeRef.current = bannerText;
          // Re-fires (startListening runs again after any stop/pause) go
          // through this same gate. Usually the grace timer armed at
          // opening-audio-done (below) is what eventually shows this, but
          // if this fires AFTER that timer already ran out (a late
          // re-probe), the timer won't come back around — check directly.
          if (
            openingAudioDoneAtRef.current > 0 &&
            Date.now() - openingAudioDoneAtRef.current >= MIC_NOTICE_GRACE_MS
          ) {
            setMicNotice(bannerText);
            pendingMicNoticeRef.current = null;
            if (micNoticeTimerRef.current) clearTimeout(micNoticeTimerRef.current);
            micNoticeTimerRef.current = setTimeout(() => setMicNotice(null), 20000);
          }
        }
      }
      return;
    }
    console.error('[VoiceTutorRealtime] Error:', error);
    setErrorMessage(error.message);
    onDebugEvent?.('error', error.message);
    onError?.(error);
  }, [onError, onDebugEvent]);

  // Listen for molecule changes from the Ketcher editor
  // Use a ref to access sendTextMessage without re-creating the listener
  const sendTextMessageRef = useRef<((text: string) => void) | null>(null);

  // Task B2 (flag-gated): whether this student has any prior recorded
  // sessions, read off the SAME student-profile fetch below (no new
  // network call) — feeds OpeningSignals.hasPriorSessions.
  const studentHasPriorSessionsRef = useRef(false);
  // Task H2 race fix (flag-gated, was the documented B2 limitation): the
  // profile fetch below is async, but the mount-time buildInstructions
  // effect used to read studentHasPriorSessionsRef SYNCHRONOUSLY at mount —
  // always seeing its initial `false`, which made the warm-resume
  // (subscribed-returning) journey unreachable. This state flips true when
  // the fetch SETTLES (success, non-ok, or error — fail-open) for
  // studentId sessions; buildInstructions gates its one-shot opening seed
  // on it and re-runs via its dep array once settled. Anonymous sessions
  // (no studentId) never consult it (they seed immediately), and with
  // TUTOR_PEDAGOGY_OPENER off it is never set, so the dep never changes
  // and flag-off timing is byte-identical to before.
  const [profileFetchSettled, setProfileFetchSettled] = useState(false);

  // Load the student profile block at mount when a studentId is
  // configured. The block is a pre-rendered string the brain reads on
  // every turn. Errors are swallowed — a missing profile block is fine
  // (brain just runs without cross-session memory for this turn).
  useEffect(() => {
    if (!studentId) {
      studentProfileBlockRef.current = '';
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/tutor/student-profile/${encodeURIComponent(studentId)}`);
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        studentProfileBlockRef.current = data.block ?? '';
        if (TUTOR_PEDAGOGY_OPENER) {
          studentHasPriorSessionsRef.current = Array.isArray(data?.profile?.recentSessions)
            && data.profile.recentSessions.length > 0;
        }
        // Content variety (phase 1): arm the seen-memory ONLY when there's
        // actually prior content for THIS plan to diverge from (≥1 slot
        // non-empty). First session on a plan leaves this null → no
        // <content_variety> block → authored content, unchanged.
        if (TUTOR_CONTENT_VARIETY && lessonPlanId) {
          const s = data?.profile?.planContentSeen?.[lessonPlanId];
          if (s && (s.hooks?.length || s.examples?.length || s.problems?.length)) {
            planContentSeenRef.current = {
              hooks: s.hooks ?? [], examples: s.examples ?? [], problems: s.problems ?? [],
            };
          }
        }
      } catch (err) {
        console.warn('[VoiceTutorRealtime] student profile fetch failed:', err);
      } finally {
        // H2 race fix: signal settle on EVERY outcome (ok / non-ok / thrown)
        // so a failed fetch still lets the opening seed proceed with the
        // conservative default (hasPriorSessions=false) instead of stalling
        // the opener forever. Flag-gated so flag-off render timing is
        // untouched (the state would otherwise still trigger the
        // buildInstructions dep re-run below).
        if (!cancelled && TUTOR_PEDAGOGY_OPENER) setProfileFetchSettled(true);
      }
    })();
    return () => { cancelled = true; };
  }, [studentId]);

  // RESUME (E3) — one-time guards. Position is applied inside the plan-load
  // effect (it must run AFTER the plan resets to segment 1); transcript +
  // whiteboard are seeded by the effect below (no plan dependency).
  const resumePositionConsumedRef = useRef(false);
  const resumeContentSeededRef = useRef(false);
  useEffect(() => {
    if (!resumeState || resumeContentSeededRef.current) return;
    resumeContentSeededRef.current = true;
    // Transcript → seeds the chat UI (onTranscriptUpdate) AND the brain's
    // conversation history (callBrainOnce derives `priorHistory` straight from
    // transcriptRef), so the next turn continues the same dialogue.
    if (resumeState.transcript.length) {
      transcriptRef.current = [...resumeState.transcript];
      onTranscriptUpdate([...transcriptRef.current]);
      // A resumed session is past the greeting window — greeting-only
      // utterances go back to being hallucination noise.
      studentHasSpokenRef.current = true;
    }
    // Whiteboard → restore prior figures both in the runtime's own ref (so its
    // board-awareness / dedup logic doesn't think the board is empty) and in
    // the rendered board (onWhiteboardCommand → parent's canvas state).
    if (resumeState.whiteboardCommands.length) {
      whiteboardCommandsRef.current = [...resumeState.whiteboardCommands];
      // Tagged as the resume seed: parents accept it exactly once per buffer
      // lifetime (resume-seed.ts guard). resumeContentSeededRef above only
      // protects THIS instance — on a VTR remount (same session, resumeState
      // still set) the effect re-fires with a fresh ref, and an unguarded
      // parent append would duplicate the entire restored board (observed
      // session-1783123067235: items 0–12 ≡ 13–25).
      onWhiteboardCommand([...resumeState.whiteboardCommands], {
        resumeSeed: true,
        // Preserve each restored figure's original draw stamp so replay
        // timing stays anchored to attempt 1 (2026-07-19 replay-timeline fix).
        seedStamps: resumeState.whiteboardCommandStamps,
      });
      // Seed the catalog so cross-turn dedup recognizes the RESTORED board.
      // Without this, findBySignature is empty after a reload, so the brain's
      // resume reflex ("re-render the interrupted visual") sails past the dedup
      // gate and stacks a duplicate page of identical content (the F=ma / Newton
      // re-render bug). We replay the page structure (newPage → openPage) and
      // register each teaching render's signature — the SAME keys the live
      // dispatch uses (buildShowSignature strips title/label, so a re-emit under
      // a new heading still matches). Catalog entries are pure metadata (no
      // render side-effect); features are omitted (scribble-target resolution on
      // resumed items degrades gracefully — dedup, the actual bug, is restored).
      resumeState.whiteboardCommands.forEach((cmd, i) => {
        const action = String((cmd as { action?: string }).action ?? '');
        if (!action) return;
        // Advance the per-action id counter past every restored id so renders
        // AFTER the resume get fresh, unique ids. The counter is in-memory and
        // restarts at 0 on reload; without this the next render reuses a
        // restored id (e.g. a 2nd showEquation-1 on a different page), which
        // breaks view-follow (it resolves the id to the FIRST page holding it,
        // snapping the view to the wrong page) plus id-based scribble / dedup /
        // removeItems. Keyed on the id's prefix (= action).
        const cmdId = (cmd as { id?: string }).id;
        if (cmdId) {
          const m = /^(.+)-(\d+)$/.exec(cmdId);
          if (m && Number.isFinite(Number(m[2]))) {
            idCountersRef.current.set(m[1], Math.max(idCountersRef.current.get(m[1]) ?? 0, Number(m[2])));
          }
        }
        if (action === 'newPage') {
          const title = (cmd as { title?: string }).title ?? '';
          catalogRef.current.openPage({ title });
          catalogRef.current.setCurrentPage(title);
          return;
        }
        if (!isTeachingRenderAction(action) && action !== 'showSegmentCard') return;
        try {
          catalogRef.current.append({
            itemId: (cmd as { id?: string }).id || `resume-${action}-${i}`,
            action,
            title: extractCommandTitle(cmd),
            signature: buildShowSignature(action, cmd),
            features: [],
          });
        } catch { /* a bad command shouldn't abort the whole seed */ }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeState]);

  // Load the active lesson plan (when lessonPlanId is set) at mount.
  // The plan is held in lessonPlanRef so the brain-call assembler always
  // sees the latest segment id without re-rendering.
  //
  // Plan-swap reset: any state keyed on segment ids carries over from
  // the old plan into the new one if not cleared explicitly. The most
  // important one is completedSegmentIdsRef — generated freestyle plans
  // reuse ids like "lo1-hook" / "lo1-concept" across instances, so a
  // stale id in the set would falsely mark a new plan's segment as
  // already-done. Reset it (and any peer set) whenever lessonPlanId
  // changes.
  useEffect(() => {
    completedSegmentIdsRef.current = new Set();
    onCompletedSegmentsChange?.([]);
    // R33: served-problem statements are plan-scoped for the divergence
    // guard's purposes — a new plan's authored card may legitimately repeat
    // text served under the old plan (freestyle plans reuse content), and a
    // stale entry would wrongly kill its first render.
    servedProblemStatementsRef.current = new Set();
    // realtime-2: a new plan must be re-injected into the RT-2 session.
    lessonPlanV2InjectedRef.current = false;
    if (!lessonPlanId) {
      lessonPlanRef.current = null;
      currentSegmentIdRef.current = '';
      setActivePlan(null);
      setActiveSegmentId('');
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/tutor/lesson-plans/${encodeURIComponent(lessonPlanId)}`);
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        const plan = data.plan as import('@/lib/tutor/lesson-plan/types').LessonPlan | undefined;
        if (!plan || !plan.segments?.length) return;
        lessonPlanRef.current = plan;
        currentSegmentIdRef.current = plan.segments[0].id;
        setActivePlan(plan);
        setActiveSegmentId(plan.segments[0].id);
        console.log(`[VoiceTutorRealtime] lesson plan loaded: "${plan.title}" — starting at segment "${plan.segments[0].id}"`);
        // RESUME (E3): override the fresh-start position with the prior
        // session's checkpoint, once. Only honor ids that exist in THIS plan
        // (guards against a stale checkpoint from a since-edited plan). The
        // pills + % then reflect where the student left off instead of segment 1.
        if (resumeState && !resumePositionConsumedRef.current) {
          resumePositionConsumedRef.current = true;
          const valid = new Set(plan.segments.map((s) => s.id));
          const resumedCompleted = resumeState.completedSegmentIds.filter((id) => valid.has(id));
          completedSegmentIdsRef.current = new Set(resumedCompleted);
          onCompletedSegmentsChange?.([...completedSegmentIdsRef.current]);
          if (resumeState.currentSegmentId && valid.has(resumeState.currentSegmentId)) {
            currentSegmentIdRef.current = resumeState.currentSegmentId;
            setActiveSegmentId(resumeState.currentSegmentId);
            catalogRef.current.setCurrentSegment(resumeState.currentSegmentId);
          }
        }
        // Phase 4: per-plan persistence. Look up prior session's
        // pacing state for this plan in localStorage and pre-populate
        // refs. Bounded TTL — don't resume state from a session > 30
        // days old (preferences drift, student may have grown). On
        // success, surface via [pacing] resumed-from-prior-session
        // event so it shows in the server log AND fires the badge
        // ack flash.
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            const key = `evelyn:pacing-v2:${plan.id}`;
            const raw = window.localStorage.getItem(key);
            if (raw) {
              const prior = JSON.parse(raw) as {
                paceBias?: number;
                paceBiasSource?: string;
                difficultyBias?: number;
                correctStreakCount?: number;
                incorrectStreakCount?: number;
                speakingRate?: 'slow' | 'normal';
                practiceOverride?: boolean;
                savedAt?: string;
              };
              const ageMs = prior.savedAt ? Date.now() - new Date(prior.savedAt).getTime() : Infinity;
              const TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
              if (ageMs <= TTL_MS) {
                // Task Y5: any explicit numeric paceBias in the blob — INCLUDING
                // 0 — wins over the new -1 default (a student who dialed back
                // down to "normal" keeps that choice on resume). Only a truly
                // absent field falls through to DEFAULT_PACE_BIAS, which
                // paceBiasRef is already initialized to, so the comparison
                // below is a genuine no-op in that case (see pace-preference.ts).
                // Round-15 Issue 6: fresh-vs-resume gating. A FRESH session
                // only restores bias the student set via the pace BUTTONS
                // (paceBiasSource === 'button'); a genuine resume restores
                // any numeric bias for mid-session continuity. This is what
                // stops a discarded session's cue-derived "fast" from
                // leaking into a brand-new session on the same plan.
                const resolvedBias = resolvePaceBiasOnLoad(prior, { isResume: !!resumeState });
                if (prior.paceBiasSource === 'button') {
                  // Keep the durable marker across re-persists so the
                  // preference survives future sessions too.
                  paceBiasButtonSetRef.current = true;
                }
                // #7 hybrid: restore the standing difficulty preference on
                // BOTH resume and fresh starts — chips are its only writer,
                // so any persisted value is a deliberate button choice
                // (the round-15 cue-contamination concern doesn't exist).
                if (typeof prior.difficultyBias === 'number' && Number.isFinite(prior.difficultyBias) && prior.difficultyBias !== 0) {
                  difficultyBiasRef.current = Math.max(-1, Math.min(2, Math.round(prior.difficultyBias)));
                  onDifficultyBiasChangeRef.current?.(difficultyBiasRef.current);
                }
                if (resolvedBias !== paceBiasRef.current) {
                  paceBiasRef.current = resolvedBias;
                  paceBiasSetTurnRef.current = 0;
                  // Notify parent so the badge updates immediately
                  // on session start.
                  onPaceBiasChangeRef.current?.(paceBiasRef.current);
                }
                if (typeof prior.correctStreakCount === 'number' && prior.correctStreakCount > 0) {
                  studentStreakRef.current = { segId: plan.segments[0].id, count: prior.correctStreakCount };
                }
                if (typeof prior.incorrectStreakCount === 'number' && prior.incorrectStreakCount > 0) {
                  studentIncorrectStreakRef.current = { segId: plan.segments[0].id, count: prior.incorrectStreakCount };
                }
                // Task W4: restore the "Speak slower" toggle the same way.
                if (prior.speakingRate === 'slow' || prior.speakingRate === 'normal') {
                  speakingRateRef.current = prior.speakingRate;
                  setSpeakingRateState(prior.speakingRate);
                  onSpeakingRateChangeRef.current?.(prior.speakingRate);
                }
                // Task Y1: restore the starter-chip practiceOverride ONLY on
                // genuine RESUME of a prior session — fresh sessions re-invite
                // the choice. Distinction: paceBias/speakingRate are comfort
                // settings (legitimately persist across fresh loads); mode
                // (practiceOverride) is a choice that should be re-made on each
                // fresh start. On resume, the intent survives exactly like
                // paceBias/speakingRate do. Absent/false ⇒ leave the ref at its
                // false default (no forced-off state to restore — see
                // practice-mode.ts).
                if (resumeState && prior.practiceOverride === true) {
                  practiceOverrideRef.current = true;
                  onPracticeOverrideChangeRef.current?.(true);
                  // Practice meter: restored mode must reach the display.
                  emitPracticeStatsRef.current();
                }
                logPacing(`resumed-from-prior-session bias=${paceBiasRef.current} correctStreak=${studentStreakRef.current.count} incorrectStreak=${studentIncorrectStreakRef.current.count} speakingRate=${speakingRateRef.current} practiceOverride=${practiceOverrideRef.current} ageDays=${(ageMs / (24 * 60 * 60 * 1000)).toFixed(1)} planId="${plan.id}"`);
              } else {
                logPacing(`prior-session-stale ageDays=${(ageMs / (24 * 60 * 60 * 1000)).toFixed(1)} planId="${plan.id}" (skipped resume)`);
                window.localStorage.removeItem(key);
              }
            }
          }
        } catch (err) {
          console.warn('[VoiceTutorRealtime] pacing-v2 persistence load failed:', err);
        }
      } catch (err) {
        console.error('[VoiceTutorRealtime] lesson plan fetch failed:', err);
      }
    })();
    return () => { cancelled = true; };
  }, [lessonPlanId, logPacing]);

  useEffect(() => {
    // Debounce to avoid false triggers from SMILES normalization on load
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    let changeCount = 0;

    const handleMoleculeChanged = (event: Event) => {
      const detail = (event as CustomEvent).detail;
      if (!detail?.smiles) return;

      // Skip the first change (SMILES normalization on load)
      changeCount++;
      if (changeCount <= 1) {
        console.log('[VoiceTutorRealtime] Skipping initial SMILES normalization');
        return;
      }

      // Debounce — wait 3s after last change before notifying AI
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(async () => {
        console.log('[VoiceTutorRealtime] Student modified molecule:', detail.smiles);

        // Validate SMILES parseability BEFORE forwarding to the tutor. If the
        // student drew something chemically impossible (e.g. an H carrying
        // three bonds, or an O with three bonds), RDKit fails to canonicalize
        // — in that case we tell the tutor explicitly that the structure is
        // invalid instead of letting it narrate nonsense.
        let validationNote = '';
        try {
          const resp = await fetch('/api/tutor/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ domain: 'chemistry-smiles', claim: { smiles: detail.smiles } }),
          });
          if (resp.ok) {
            const result = await resp.json();
            if (result && result.correct === false) {
              const issue = (result.issues && result.issues[0]) || 'SMILES failed to parse.';
              validationNote = ` The new SMILES is NOT a valid molecular structure — ${issue} ` +
                `Do NOT describe it as if it were a real compound. Point out the structural problem ` +
                `(likely a valence violation — e.g. hydrogen with more than one bond, or oxygen with ` +
                `more than two) and ask the student to revise the drawing.`;
              onDebugEvent?.('smiles_invalid',
                `Student drew invalid SMILES: ${detail.smiles} — ${issue}`);
            }
          }
        } catch (err) {
          console.error('[VoiceTutorRealtime] student SMILES validation threw:', err);
        }

        // Send as a text message so the AI responds (unlike injectContext which is silent)
        if (sendTextMessageRef.current) {
          sendTextMessageRef.current(
            `[The student just modified the molecule on the whiteboard. ` +
            `Original: ${detail.title || 'unknown'} (${detail.originalSmiles}). ` +
            `New SMILES: ${detail.smiles}.${validationNote} ` +
            `Identify what changed and discuss it with the student.]`
          );
        }

        // Add to transcript
        const entry: TranscriptEntry = {
          id: `student-action-${Date.now()}`,
          timestamp: new Date(),
          role: 'student',
          text: `[Modified molecule: ${detail.smiles}]`,
        };
        transcriptRef.current = [...transcriptRef.current, entry];
        onTranscriptUpdate(transcriptRef.current);
        onTrackInteraction?.('click', 'molecule-edit', { newSmiles: detail.smiles, originalSmiles: detail.originalSmiles });
      }, 3000);
    };

    window.addEventListener('molecule-changed', handleMoleculeChanged);
    return () => {
      window.removeEventListener('molecule-changed', handleMoleculeChanged);
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [onTranscriptUpdate, onTrackInteraction, onDebugEvent]);

  // Read VAD tuning from env vars (NEXT_PUBLIC_ so they're available client-side)
  const vadThreshold = parseFloat(process.env.NEXT_PUBLIC_TUTOR_VAD_THRESHOLD || '0.8');
  const vadSilenceDurationMs = parseInt(process.env.NEXT_PUBLIC_TUTOR_VAD_SILENCE_MS || '1500', 10);
  const vadPrefixPaddingMs = parseInt(process.env.NEXT_PUBLIC_TUTOR_VAD_PREFIX_MS || '500', 10);
  // Reconnect-resilience (caching-initiative levers 2+3, 2026-05-18).
  // Default OFF ⇒ byte-identical to the frozen 7de734c voice behavior;
  // set NEXT_PUBLIC_TUTOR_REALTIME_RECONNECT=true to enable (build-time
  // inlined → dev-server restart required to flip, same as the
  // NEXT_PUBLIC_TUTOR_VAD_* knobs). Unsetting it is the instant,
  // code-free revert.
  const reconnectEnabled = process.env.NEXT_PUBLIC_TUTOR_REALTIME_RECONNECT === 'true';

  // ── Claude-brain orchestrator ────────────────────────────────────────────
  // When claudeBrainMode is on, every student transcript completion is
  // routed here instead of letting the Realtime model author its own reply.
  // The flow is: build conversation history + whiteboard snapshot → POST
  // to /api/tutor/brain → receive { text, toolCalls } → dispatch tool calls
  // through the existing handleWhiteboardCommand pipeline → speak the text
  // through Realtime's TTS via speakTextRef.
  useEffect(() => {
    if (claudeBrainMode) {
      console.log('[VoiceTutorRealtime] claude-brain engine ACTIVE — Realtime is STT+TTS only, Claude Sonnet 4.6 is the author.');
    } else {
      console.log('[VoiceTutorRealtime] Realtime engine active (legacy authoring path), validateToolCalls=', validateToolCalls);
    }
  }, [claudeBrainMode, validateToolCalls]);
  // Student marks (Phase 1): catalog-backed labels for formatStudentMarks.
  // Feature labels come from the item's feature registry (same registry
  // tutor_scribble resolves against, via catalogRef); item labels use
  // getCommandTypeLabel (WhiteboardCanvas's prettifier) so they read like
  // "the graph" rather than the raw action string "showGraph".
  // Null (stale id / missing item) → the formatter degrades to page-level
  // wording. Declared ABOVE callBrainOnce (which calls drainStudentMarks
  // below) — required declaration order, not just style.
  const lookupMarkLabels = useCallback((mark: ResolvedMark) => {
    if (!mark.itemId) return mark.itemIndex !== undefined ? {} : null;
    const item = catalogRef.current.getItem(mark.itemId);
    if (!item) return null;
    const pretty = getCommandTypeLabel(item.action).toLowerCase();
    const itemLabel = item.pageTitle
      ? `the ${pretty} ("${item.pageTitle}")`
      : `the ${pretty}`;
    const feature = mark.feature;
    if (!feature) return { itemLabel };
    const feat = item.features.find((f) => f.canonical === feature || f.labels.includes(feature));
    return { itemLabel, featureLabel: feat ? `"${feat.labels[0] || feat.canonical}"` : `"${feature}"` };
  }, []);

  // Format + drain the pending tap buffer. Returns undefined when empty so
  // the brain POST body's `studentMarks` field stays undefined (flag off /
  // no taps this turn ⇒ byte-identical request).
  const drainStudentMarks = useCallback((): string | undefined => {
    const marks = pendingStudentMarksRef.current;
    if (marks.length === 0) return undefined;
    pendingStudentMarksRef.current = [];
    if (studentMarkIdleTimerRef.current) {
      clearTimeout(studentMarkIdleTimerRef.current);
      studentMarkIdleTimerRef.current = null;
    }
    return formatStudentMarks(marks, lookupMarkLabels);
  }, [lookupMarkLabels]);

  // Student marks + tutor reactions: clear armed idle-send timers on unmount.
  useEffect(() => {
    return () => {
      if (studentMarkIdleTimerRef.current) {
        clearTimeout(studentMarkIdleTimerRef.current);
        studentMarkIdleTimerRef.current = null;
      }
      if (reactionIdleTimerRef.current) {
        clearTimeout(reactionIdleTimerRef.current);
        reactionIdleTimerRef.current = null;
      }
      // R32 (H1 review round 1, Finding 1): the queueOnMidUtterance
      // drain-guarantee poller — same idle-send shape, same cleanup need.
      if (queueMidUtteranceDrainTimerRef.current) {
        clearTimeout(queueMidUtteranceDrainTimerRef.current);
        queueMidUtteranceDrainTimerRef.current = null;
      }
      // Final-review Finding 4: the ack/escalation timers get the same
      // unmount treatment as every other armed timer in this effect —
      // left running past unmount they'd fire into stale closures.
      if (ackTimerRef.current) {
        clearTimeout(ackTimerRef.current);
        ackTimerRef.current = null;
      }
      if (escalationTimerRef.current) {
        clearInterval(escalationTimerRef.current);
        escalationTimerRef.current = null;
      }
      // R34 T3: the incomplete-hold timer gets the same unmount treatment —
      // left running past unmount it would flush a held fragment into a
      // stale closure.
      if (heldTranscriptRef.current) {
        clearTimeout(heldTranscriptRef.current.timer);
        heldTranscriptRef.current = null;
      }
    };
  }, []);

  // Inner brain-call worker — does the actual fetch + dispatch. Pulled out
  // so the outer wrapper can serialize calls and process queued transcripts
  // without duplicating the body.
  const callBrainOnce = useCallback(async (
    transcript: string,
    opts?: {
      silent?: boolean;
      // Q3 timestamped-history (2026-06-16): ephemeral history entries
      // spliced in AFTER the transcriptRef-derived prior history and
      // BEFORE this turn's <student_said> wrapper. Used by the perception
      // MERGE/FRESH paths to inject the interrupted tutor turn as its own
      // {role:'assistant'} entry carrying a `<cut>` marker — replacing the
      // old bracketed-addendum synthetic string. These entries are NOT
      // written to transcriptRef, so they affect only THIS brain call and
      // vanish from history on the next turn (the interrupted partial was
      // never a committed tutor turn).
      injectedHistoryTail?: Array<{ role: 'user' | 'assistant'; content: string }>;
    },
  ) => {
    // Brain-turn start timestamp. Declared OUTSIDE the try so the catch
    // block can reference it for streaming-entry cleanup (Fix 9).
    // Re-assigned inside the try once we know the turn actually starts.
    let t0 = Date.now();
    // Defensive per-turn reset of new-page tracking refs. The intended
    // reset path is handleTranscriptUpdate (line ~1005) for voice and
    // sendTextMessage for typed input. In practice the timing between
    // those handlers and this brain call is racy in voice mode (observed
    // 2026-05-12 AP Macro session: turn 6 emitted new_page → ref true;
    // turn 7's identical show_diagram should have dedup'd against the
    // turn 6 catalog entry but did not — newPageThisTurnRef still true
    // at turn 7's dedup check). Resetting here is idempotent (the brain
    // sets the ref again at line 2752 if it emits new_page in this turn)
    // and removes the race. Logged when the reset was necessary so we
    // can spot frequency from telemetry.
    if (newPageThisTurnRef.current) {
      console.warn('[brain-orchestrator] newPageThisTurnRef was still true at brain-call start; defensively resetting to re-enable dedup');
    }
    newPageThisTurnRef.current = false;
    brainEmittedNewPageThisTurnRef.current = false;
    // Advance the page-grouping turn counter (staleness backstop) and mirror
    // it into the catalog so render appends stamp the current turn onto their
    // page's lastRenderTurn.
    pageTurnRef.current += 1;
    catalogRef.current.setCurrentTurn(pageTurnRef.current);
    // Render↔speech sync: per-turn reset. Release any stragglers from the
    // prior turn (their narration is long over), zero the turn-global
    // counters, and arm buffering for this turn's stream. Cleared in the
    // finally so post-stream the buffer keeps flushing against playing
    // audio but no NEW batches buffer.
    flushAllRenderBuffer();
    ttsDispatchedCountRef.current = 0;
    ttsPlaybackStartedCountRef.current = 0;
    lastWordPosRef.current = null; // Task 3.2: stale word clock must not satisfy fresh anchors
    renderBufferPausedRef.current = false;
    renderSyncActiveRef.current = true;
    // Board-anchor re-anchoring: fresh per-turn narration.
    turnNarrationRef.current = [];
    // Task B3 (flag-gated): fresh per-turn valid-render counter for the
    // opener-fallback check. openingTurnPendingRef itself is NOT reset here
    // (it's a one-shot "is this the opener turn" flag seeded once at mount
    // and consumed in the finally below, not a per-turn flag).
    if (TUTOR_PEDAGOGY_OPENER) openingTurnValidRenderCountRef.current = 0;
    try {
      // Make sure the student turn is in transcriptRef so subsequent turns
      // see it as conversation history. In voice mode the hook's
      // handleTranscriptUpdate appends before this runs; in typed-input
      // and relayed-sendTextMessage paths nobody else does, so we have to.
      // `silent` skips this — used by lesson-plan kickoff where the
      // transcript is a synthetic trigger ("I'm ready — let's begin")
      // that shouldn't appear in the chat or in conversation history.
      // Auto-detect bracketed system messages like
      // "[The student drew...]" — these are runtime-injected hints to
      // the brain, not actual student speech, and shouldn't appear in
      // the visible chat. The brain still receives them via studentTranscript.
      const trimmedT = transcript.trim();
      const isBracketed = trimmedT.startsWith('[') && trimmedT.endsWith(']');
      const silent = opts?.silent || isBracketed;

      // ── FIX B — app-side deterministic Skip-button advance ──────────
      // The Skip-ahead button injects a "[Skip-button-clicked: ...]"
      // marker telling the brain to call advance_lesson; when the brain
      // forgot, the orchestrator burned a full retry (the "Skip-button
      // KILL", ~5-15s). But a one-segment advance is deterministic —
      // resolveAdvanceTarget already computes it. So perform the advance
      // HERE, before the brain call, and hand the brain the resulting
      // FACT instead of the instruction. Rewriting the marker out of
      // `transcript` makes skipTurnMarkerPresent / skipMarkerPresent
      // (both downstream) go false on their own, so the Skip-KILL retry
      // is structurally dead for the resolvable case — no code deleted.
      // Scoped to the Skip BUTTON only (a deterministic one-segment
      // advance); verbal whole-LO skips stay brain-driven (Rule 12).
      // `originalTranscript` preserves the pre-rewrite text so the
      // boredom-cue suppression further down still sees the button marker.
      const originalTranscript = transcript;
      if (TUTOR_SKIP_DETERMINISTIC && /\[Skip-button-clicked/i.test(transcript)) {
        const skipPlan = lessonPlanRef.current;
        const skipFromSegId = currentSegmentIdRef.current;
        if (skipPlan && skipFromSegId) {
          const consumedHashes = new Set(shownProblemHashesRef.current);
          const skipNext = resolveAdvanceTarget(skipPlan, skipFromSegId, 'next', { consumedHashes });
          if (skipNext) {
            const skipNextSeg = skipPlan.segments.find((s) => s.id === skipNext);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const skipNextKind = (skipNextSeg as any)?.kind ? ` (a ${(skipNextSeg as any).kind} segment)` : '';
            applyResolvedAdvance(skipPlan, skipFromSegId, skipNext);
            // Replace the action-INSTRUCTION marker with a state FACT.
            // Still bracketed ⇒ TranscriptView strips it from the visible
            // chat; the brain reads it as the current student turn and
            // teaches the new segment without being asked to advance.
            transcript = transcript.replace(
              /\[Skip-button-clicked[^\]]*\]/i,
              `[Lesson auto-advanced: the student clicked Skip-ahead and the lesson pointer has ALREADY moved to segment "${skipNext}"${skipNextKind}. Introduce THAT segment now, but keep it LIGHT — a sentence or two plus AT MOST ONE anchor visual, not the segment's full set of cards/formulas. A Skip is brisk navigation, not a re-teach; the student can ask for depth. Extra show_* renders past the first are capped and silently dropped. Do NOT call advance_lesson — the advance is already done. Skip is a navigation action, not an answer: do NOT affirm, grade, or state an expected answer for any prior question.]`,
            );
            console.warn(`[brain-orchestrator] Skip-button: app-side deterministic advance "${skipFromSegId}" → "${skipNext}" (brain told as fact; Skip-KILL retry bypassed).`);
            onDebugEvent?.('skip_button_app_advance', `"${skipFromSegId}" → "${skipNext}"`);
          } else {
            // End of plan — no resolvable next segment. Leave the marker
            // INTACT: the existing Skip-KILL retry stays alive ONLY for
            // this case and drives the brain to generate_problem.
            console.warn(`[brain-orchestrator] Skip-button: no resolvable next from "${skipFromSegId}" (end of plan) — marker left for the brain (generate_problem path + Skip-KILL retry retained).`);
            onDebugEvent?.('skip_button_app_advance_skipped', `no next from "${skipFromSegId}"`);
          }
        }
      }

      const lastEntry = transcriptRef.current[transcriptRef.current.length - 1];
      if (!silent && (!lastEntry || lastEntry.role !== 'student' || lastEntry.text !== transcript)) {
        const studentEntry: TranscriptEntry = {
          id: `student-${Date.now()}`,
          timestamp: new Date(),
          role: 'student',
          text: transcript,
        };
        transcriptRef.current = [...transcriptRef.current, studentEntry];
        onTranscriptUpdate([...transcriptRef.current]);
      }
      // Convert the transcript log to the Claude conversation shape. We
      // collapse 'system' entries (greeting prompts, etc.) — they're not
      // genuine turns from Claude's perspective.
      const history = transcriptRef.current
        .filter((e) => e.role === 'student' || e.role === 'tutor')
        .map((e) => ({
          role: (e.role === 'student' ? 'user' : 'assistant') as 'user' | 'assistant',
          content: e.text,
        }));
      // Drop the just-recorded user turn from history; it goes in the
      // dedicated studentTranscript field.
      const priorWithoutCurrent = history.length > 0 && history[history.length - 1].role === 'user' && history[history.length - 1].content === transcript
        ? history.slice(0, -1)
        : history;
      // Synthetic greeting prepend: the tutor system prompt has a Rule 6
      // ("opening response is 'Hey [name]!' — three words. Wait for the
      // student.") that was tuned for a flow where the tutor greets BEFORE
      // the student speaks. In claude-brain mode the student speaks first,
      // so without this synthetic turn the brain wastes its first response
      // greeting instead of answering the actual request. Faking a prior
      // assistant turn moves the conversation into the "working phase"
      // (per Rule 6) so the brain engages with content immediately.
      const hasPriorTutorTurn = priorWithoutCurrent.some((m) => m.role === 'assistant');
      const priorHistory = hasPriorTutorTurn
        ? priorWithoutCurrent
        : [
            { role: 'assistant' as const, content: studentName ? `Hey ${studentName}!` : 'Hey there!' },
            ...priorWithoutCurrent,
          ];

      // Topic-switch / off-plan handling is BRAIN-DRIVEN as of
      // 2026-05-15. The old programmatic topicSwitchRe heuristic
      // (Round-7 Issue 4) cleared currentSegmentIdRef on a regex match;
      // it was brittle both ways — false positives on ubiquitous
      // directional ANSWERS ("I'd go to the right") that silently
      // stranded the student off-plan, and false negatives on phrasings
      // it didn't anticipate. The brain (which sees the utterance + the
      // lesson-plan context every turn) is the right detector: it now
      // calls advance_lesson({to:"free"}) to release the cursor when
      // the student wants off the planned track (handled in the
      // advanceLesson command branch above; system-prompt topic-switch
      // rule instructs it). resolveAdvanceTarget resumes gracefully
      // from an empty cursor so a later {to:"next"} can't strand the
      // student. No regex here on purpose.

      // Pacing v2 — Phase 1 (inert): student-utterance arrival bookkeeping.
      // Runs AFTER topic-switch (which may clear segId) so the new segId
      // is what the streak refs key against on this turn. Handles:
      //   - turn counter increment
      //   - segment-change streak reset (lazy: only when we observe new segId)
      //   - verification-turn classification (digits/math/long substantive
      //     vs pure ack — pure acks don't drive streak even if brain says
      //     "exactly!" because the student didn't actually answer anything)
      //   - boredom-cue regex match (sticky for ONE turn — clears at the
      //     start of the next student turn before the new match)
      //   - segment student-turn count for boundary check-in eligibility
      // None of this changes brain behavior in Phase 1; it just populates
      // refs that the student_state block will surface and that
      // handleResponseDone reads to decide whether to update streak.
      if (!silent && !isBracketed) {
        pacingTurnCounterRef.current += 1;
        const segIdNow = currentSegmentIdRef.current;
        // Clear stale cue from prior turn before evaluating this one
        studentCueRef.current = null;
        // Verification-turn classifier — generic, no subject-specific terms
        const t = transcript.trim();
        const lower = t.toLowerCase();
        const isPureAck = /^(ok(ay)?|yes|yeah|yep|yup|sure|got\s+it|alright|fine|cool|nice|go|next|done|ready|hi|hey|hmm|uh\s*huh|mhm|mmm|uh|umm)[!.\s]*$/i.test(t);
        const hasDigits = /\d/.test(t);
        const hasMathLang = /\b(equals?|sum|product|mean|median|mode|answer|because|therefore|simplif|factor|derivat|integral|root|solv|so\s+(?:it'?s|the))\b/i.test(lower);
        const wordCount = t.split(/\s+/).filter(Boolean).length;
        // Help-request exclusion: utterances asking for guidance / a
        // breakdown / a hint should NOT count as verification turns,
        // even if they meet the word-count threshold. Otherwise an
        // I'm stuck button click ("I'm stuck on this — can you break
        // it down?", 9 words) classifies as verification AND any
        // brain affirmation in response false-increments the streak.
        // Observed 2026-05-06 lines session.
        const isHelpRequest = /\b(i'?m\s+stuck|i\s+am\s+stuck|can\s+you\s+(?:break|walk|explain|help|show\s+me)|break\s+(?:it|this)\s+down|walk\s+me\s+through|step[\s-]by[\s-]step|don'?t\s+(?:know|understand|get)|need\s+(?:a\s+)?(?:hint|help)|how\s+do\s+i)\b/i.test(lower);
        // Round-22 (2026-07-17, session portal-cbd93b08): a single-letter
        // MCQ answer ("d") failed every verification signal — no digits, no
        // math language, 1 word, length < 3 — so two correct MCQ answers
        // moved neither the streak nor the practice meter ("0 solved" beside
        // two answered problems). When the ACTIVE problem is multiple-choice,
        // a bare choice letter IS the student's answer.
        const isMcqLetterAnswer = !!currentProblemRef.current?.hasChoices && /^[a-eA-E][).\s]*$/.test(t);
        const isVerification = !isPureAck && !isHelpRequest
          && ((t.length >= 3 && (hasDigits || hasMathLang || wordCount >= 6)) || isMcqLetterAnswer);
        // Session-end signal (Task Y4 farewell-exemption fix) — see
        // sessionEndSignalRegex definition above for scope/rationale.
        const isSessionEndSignal = sessionEndSignalRegex.test(lower);
        lastStudentVerificationRef.current = {
          turn: pacingTurnCounterRef.current,
          segId: segIdNow,
          isVerification,
          isSessionEndSignal,
          // Round-22: snapshot the ACTIVE problem at answer time — the
          // post-stream solve counter previously read currentProblemRef
          // AFTER the turn, where a same-turn segment advance had already
          // cleared it (a second silent under-count).
          activeStatement: currentProblemRef.current?.statement ?? '',
        };
        // Streak segId-retag policy (revised post-2026-05-05 session
        // analysis). Streak tracks CONCEPT mastery across consecutive
        // segments testing the same skill, not within a single segment.
        // Reset cases:
        //   (a) cursor released — segIdNow === '' because the brain
        //       called advance_lesson({to:"free"}) on a prior turn
        //       (off-plan / topic switch); this is the "concept
        //       changed" signal at the segment-tracking layer.
        //   (b) brain emits a correction utterance — handled in the
        //       post-stream streak update (resets correct-streak when
        //       brainCorrectionRegex matches).
        // For ordinary segment-change (try-easy-1 → try-easy-2 etc.),
        // we just retag the segId and keep the count. The original
        // design Q10 spec called for segment-change reset, but that
        // makes streak unable to build past 1 in lesson plans where
        // each segment has 1 try-yourself problem (the common case).
        // Concept mastery, not segment occupancy, is the signal we
        // care about.
        const isTopicSwitchReset = segIdNow === '' && studentStreakRef.current.segId !== '';
        if (studentStreakRef.current.segId !== segIdNow) {
          if (isTopicSwitchReset && studentStreakRef.current.count > 0) {
            logPacing(`streak-correct seg="${studentStreakRef.current.segId}" count=0 (topic-switch reset; was ${studentStreakRef.current.count})`);
            studentStreakRef.current = { segId: segIdNow, count: 0 };
          } else {
            studentStreakRef.current = { segId: segIdNow, count: studentStreakRef.current.count };
          }
        }
        if (studentIncorrectStreakRef.current.segId !== segIdNow) {
          if (isTopicSwitchReset && studentIncorrectStreakRef.current.count > 0) {
            logPacing(`streak-incorrect seg="${studentIncorrectStreakRef.current.segId}" count=0 (topic-switch reset; was ${studentIncorrectStreakRef.current.count})`);
            studentIncorrectStreakRef.current = { segId: segIdNow, count: 0 };
          } else {
            studentIncorrectStreakRef.current = { segId: segIdNow, count: studentIncorrectStreakRef.current.count };
          }
        }
        if (segmentTurnCountRef.current.segId !== segIdNow) {
          segmentTurnCountRef.current = { segId: segIdNow, count: 0 };
        }
        if (segmentMasteredFlagRef.current && segmentMasteredFlagRef.current.segId !== segIdNow) {
          segmentMasteredFlagRef.current = null;
        }
        if (isVerification) {
          segmentTurnCountRef.current = { segId: segIdNow, count: segmentTurnCountRef.current.count + 1 };
        }
        // Boredom-cue regex — verbatim match logged for telemetry. Cue
        // is consumed by the next-turn student_state block formatter.
        // EXCEPTION: when the student transcript carries an explicit
        // button marker ([Skip-button-clicked] or [I'm-stuck-button-
        // clicked]), suppress the cue. The button's instruction body
        // already tells the brain exactly what to do (advance now / walk
        // me through Socratically); the boredom-cue hint piles on
        // "verbally offer harder / skip / different topic", which
        // contradicts the button's intent and produces multi-choice
        // verbosity instead of action. Observed 2026-05-06 G5 earth-
        // systems: clicked Skip → tutor offered three choices instead
        // of advancing.
        // Test the ORIGINAL transcript: FIX B may have rewritten the
        // Skip-button marker into a "[Lesson auto-advanced…]" fact, but
        // the boredom-cue must still be suppressed on a Skip turn.
        const hasButtonMarker = /\[(Skip-button-clicked|I'?m-stuck-button-clicked)/i.test(originalTranscript);
        const cueMatch = !hasButtonMarker && t.match(boredomCueRegex);
        if (hasButtonMarker) {
          logPacing(`student-cue suppressed (explicit button click) turn=${pacingTurnCounterRef.current}`);
        }
        if (cueMatch) {
          studentCueRef.current = { cue: cueMatch[0], turn: pacingTurnCounterRef.current };
          logPacing(`student-cue cue="${cueMatch[0]}" turn=${pacingTurnCounterRef.current}`);
          onDebugEvent?.('pacing_cue', `cue="${cueMatch[0]}"`);
          // Phase 3: pace-direction cues additionally step paceBias.
          // "slow down" / "slower" → -1 (more depth). "faster" / "speed
          // up" → +1 (less depth). Other cues (skip/easy/boring/etc.)
          // do NOT step bias — they're concept-level signals, not
          // depth-of-teaching signals.
          const cueLower = cueMatch[0].toLowerCase();
          if (/slow\s+down|slower/.test(cueLower)) {
            stepPaceBias(-1, 'cue', cueMatch[0]);
          } else if (/faster|speed\s+up/.test(cueLower)) {
            stepPaceBias(+1, 'cue', cueMatch[0]);
          }
        }
      }
      // Mirror current segment id into the catalog so subsequent
      // appends are stamped with it AND getSnapshot's filter scopes
      // the brain's view to current-segment items only. Items appended
      // before this wire-up (no segmentId) always pass the filter.
      catalogRef.current.setCurrentSegment(currentSegmentIdRef.current || '');
      const segmentSnapshotOpts = currentSegmentIdRef.current
        ? { currentSegmentId: currentSegmentIdRef.current }
        : undefined;
      const whiteboardSnapshot = catalogRef.current.getSnapshot(segmentSnapshotOpts);
      t0 = Date.now();
      // Q3 timestamped-history: anchor for the relative `[t+N.Ns]` cut
      // offset + the ttsScriptBuffer turn-scoping filter in
      // applyPerceptionVerdict. Set once per turn at the real start.
      brainTurnStartedAtRef.current = t0;

      // Validator-feedback retry loop (Phase 5 Option B). When a tool
      // call is rejected by a structural validator (circuit topology,
      // pedigree, flowchart, etc.), capture the rejection reason and
      // re-prompt Claude with that reason as a synthetic user message
      // so it can self-correct in a follow-up turn. Without this, a
      // rejected tool call leaves the user with no figure and Claude
      // doesn't learn from the rejection until the next student turn.
      // Capped at MAX_VALIDATOR_RETRIES to prevent runaway.
      const MAX_VALIDATOR_RETRIES = 2;
      // RULE8 (promise-without-visual) gets a SEPARATE single-shot
      // budget. Don't let promised-visual retries stack with structural
      // validator retries — a brain that's spamming "let me draw" with
      // no follow-through after one repair is unlikely to recover from
      // a second nudge, and we don't want the student waiting through
      // three full turns of silence.
      const MAX_RULE8_RETRIES = 1;
      let rule8RetriesUsed = 0;
      // Judge LLM (Lever B1 of the coherence redesign) gets its own
      // single-shot budget. Calls /api/tutor/judge with the post-render
      // board snapshot + the brain's spoken text; if Haiku flags any
      // ungrounded claim ("you said 12 but the board has 16"), we
      // promote that to a synthetic rejection so the existing retry
      // loop re-prompts the brain with the issues attached. One repair
      // attempt is enough — if the brain still drifts after seeing the
      // explicit issue list, a second judge call is unlikely to help
      // and the student is waiting on each round-trip.
      const MAX_JUDGE_RETRIES = 1;
      let judgeRetriesUsed = 0;
      // Round-7 Fix D: kill-loop escalation. Track every judge KILL
      // claim text we've already rejected in this turn. When a NEW kill
      // shares structural tokens (numbers / multi-char identifiers /
      // dataset literals) with a prior one, the brain is stuck in a
      // re-assertion loop on the SAME wrong content — observed
      // 2026-05-02 as five consecutive KILLs about "{2,4,6,8,10}, mean
      // is 6" while the active card was {12,14,16,18,20}. The standard
      // "re-derive from the board" rejection didn't break it because
      // the brain kept anchoring on stale conversation context. The
      // escalated rejection (used on the second-or-later overlap kill)
      // tells the brain literally that it has retried this claim, lists
      // the active-problem statement verbatim, and demands a literal
      // re-read of the board snapshot. Empty until the first KILL.
      const priorJudgeKillClaimsThisTurn: string[] = [];
      // Catches BOTH verb-form ("Let me draw / I'll plot") and noun-form
      // ("Here's a graph / Here is a quick diagram") visual promises.
      // The server-side telemetry regex (brain/stream/route.ts) only
      // covers verb-form; this one is the superset because we need
      // higher recall for the rejection path. Optional article + size
      // adjective ("a quick", "the small") between subject and noun
      // handles the most common phrasings.
      const visualPromiseRegex = /\b(let me|i['’]ll|i will|here['’]s|here is|i['’]m going to)\s+(?:(?:a|an|the|this|that|some)\s+(?:quick\s+|simple\s+|small\s+|nice\s+)?)?(draw|plot|show|sketch|display|render|graph|create|drawing|chart|diagram|figure|illustration|visualization|image|picture|rendering)\b/i;
      // Q3 timestamped-history: splice any ephemeral injected entries
      // (e.g. the interrupted tutor `<cut>` turn from a perception
      // MERGE/FRESH) between the prior history and this turn's
      // <student_said> wrapper. buildBrainMessages appends the volatile
      // userContent as the final message, so the injected tail lands in
      // the correct position: ...prior, [cut turn], <student_said>.
      let runHistory = opts?.injectedHistoryTail?.length
        ? [...priorHistory, ...opts.injectedHistoryTail]
        : priorHistory;
      let runTranscript = transcript;
      // Turn-length cap: deliver the pending cadence corrective with this
      // turn's input (same "[… — not from the student]" convention as the
      // validator feedback below), then clear it — one corrective per lapse.
      if (TUTOR_TURN_CAP && pendingCadenceNoteRef.current) {
        runTranscript = `${pendingCadenceNoteRef.current}\n\n${runTranscript}`;
        pendingCadenceNoteRef.current = null;
      }
      // Bare-praise-ending corrective (Task Y4 addendum) — same convention,
      // independent of TUTOR_TURN_CAP (a distinct concern from turn length).
      if (pendingNoAdvanceNoteRef.current) {
        runTranscript = `${pendingNoAdvanceNoteRef.current}\n\n${runTranscript}`;
        pendingNoAdvanceNoteRef.current = null;
      }
      // R2 E2: board-anchor corrective — same convention, own concern.
      if (pendingBoardAnchorNoteRef.current) {
        runTranscript = `${pendingBoardAnchorNoteRef.current}\n\n${runTranscript}`;
        pendingBoardAnchorNoteRef.current = null;
      }
      let firstSentenceMs: number | null = null;
      let totalSentenceCount = 0;
      // Word-budget corrective sibling to totalSentenceCount — same
      // lifecycle (declared once per callBrainOnce invocation, accumulated
      // across the retry loop below, never reset mid-turn), so it can't
      // drift out of sync with the sentence counter it rides alongside.
      // Incremented at the same site as totalSentenceCount++ (reusing the
      // per-sentence wordCount already computed there for the dedup guard).
      let totalWordCount = 0;
      // Number of sentences actually dispatched to TTS this turn. Tracks
      // a strict subset of totalSentenceCount — sentences buffered in the
      // gate then dropped on rejection are counted in totalSentenceCount
      // but NOT here. Used by speakKillBridge to skip the bridge phrase
      // when no audible speech has happened yet (otherwise the bridge
      // becomes the first thing the student hears, which sounds wrong).
      let audibleSentenceCount = 0;
      let totalToolNamesSeen: string[] = [];
      // Rule-8 v2: renders that actually landed on the board this turn.
      // Counts assignedIds across attempts, so a killed attempt's rolled-back
      // renders still count — the client repair then UNDER-fires (skips a
      // turn it could have repaired), never double-paints. Conservative by
      // design.
      let totalPaintedCount = 0;
      let aggregatedFullText = '';
      let lastStopReason = 'unknown';
      let lastUsage: { inputTokens?: number; outputTokens?: number; cacheReadTokens?: number; cacheCreationTokens?: number } | undefined;
      // Task X10 — brain-unavailability signal from the stream route. When the
      // server exhausts its bounded retries (or hits a non-retryable error)
      // with ZERO content produced, the terminal done event carries
      // brainUnavailable=true. It drives the HONEST empty-stream fallback
      // (below) instead of the mis-blaming "could you say that again?" line.
      // `serverBrainRetries` is server-side retry count, surfaced in telemetry.
      let brainUnavailable = false;
      let serverBrainRetries = 0;
      // Judge-kill Stage 3.1 (2026-06-16): cross-attempt resume-from-cut
      // state. When a content kill leaves an unplayed TTS tail, performKill
      // captures it here; the NEXT attempt (the retry) consumes it, holds
      // its opener, and — if the retry is a re-statement — replays this
      // tail instead of re-speaking the overlap. null = no pending resume.
      let judgeKillResumeSnapshot: string[] | null = null;
      let judgeKillResumeKilledText: string | null = null;
      // Count of sentences the killed attempt DISPATCHED to TTS before the
      // kill (== audibleSentenceCount at kill time). The snapshot is the
      // unplayed subset of these, so this is the total content already
      // accounted for by (heard-before-kill + snapshot replay). A restatement
      // retry re-delivers these N sentences AND any further sentences the
      // brain only emits AFTER the kill point — those extras must still be
      // spoken, so the suppress-audio path speaks retry sentences beyond N.
      let judgeKillResumeCoveredCount = 0;
      // E3 — renderer-error spoken bridge. When the FIRST kill of this
      // turn fires (validator rejection / RULE8 / judge / show_problem
      // block), we cancel the audio queue + speak a brief acknowledgment
      // so the student doesn't experience 5-15s of silence before the
      // retry's first sentence arrives. Once per turn (don't compound
      // bridges across multiple kills) and only when there's been
      // audible speech to bridge from.
      let bridgeSpokenThisTurn = false;
      // Round-7+ Fix 4: verbatim-sentence dedup within a turn. The brain
      // sometimes emits the same sentence twice in one block of text
      // ("What's the mode of {4, 7, 4, 9, 2}?What's the mode of {4, 7, 4, 9, 2}?")
      // — observed 2026-05-03 mode segment. Sentence buffer splits these
      // into two `sentence` events; without a dedup at this layer both
      // get voiced AND added to the chat transcript. Track normalized
      // form (lowercase, punctuation stripped, whitespace collapsed) and
      // skip the second emission when ≥4 words match verbatim. Threshold
      // avoids false positives on short echoes like "Yes!" / "Right.".
      const sentencesSpokenThisTurn = new Set<string>();
      const normalizeForDedup = (s: string): string =>
        s
          .toLowerCase()
          .replace(/[*_~`]/g, '')
          .replace(/[.,!?;:'"\-—–()\[\]{}]/g, '')
          .replace(/\s+/g, ' ')
          .trim();
      // Round-7+++++ Issue: the prior bridge phrases ("Actually,
      // hold on — let me redo that") were too long and read as the
      // tutor self-correcting in a confused way, which itself was
      // disruptive. Shortened to terse, soft acknowledgments that
      // bridge the silence without sounding like the tutor is
      // walking back its own claims.
      const BRIDGE_PHRASES = [
        // 'One sec.' was dropped 2026-05-04: TTS in math contexts
        // pronounces the abbreviation as "One secant" (treats it as
        // the trig function). User reported hearing "one secant"
        // mid-kill on the Linear-Functions ladder turn.
        'One moment.',
        'Hmm.',
      ];
      // Round-7 Fix C: drain any in-flight TTS audio FIRST, then speak
      // the bridge. Without the await, `clearSpeechQueue` returns the
      // moment `source.stop()` is called — but the AudioBufferSourceNode's
      // tail can keep playing for a frame or two while the WebAudio graph
      // tears down. The bridge phrase enqueued immediately after would
      // then start audibly overlapping the dying tail, which compounds
      // the kill-spiral confusion (student hears bits of two attempts +
      // a bridge in rapid succession). Awaiting the drain produces a
      // clean cut before the bridge plays.
      //
      // The clear is run unconditionally — even when bridgeSpokenThisTurn
      // is already set or audibleSentenceCount is 0, we still want any
      // queued/in-flight audio gone before the retry's first sentence
      // arrives. Returns when the audio is fully torn down.
      const speakKillBridge = async () => {
        await clearSpeechQueueRef.current?.();
        if (bridgeSpokenThisTurn) return;
        // No point bridging if no speech has happened yet — would just
        // be the first thing the student hears for the turn. Use the
        // audible count rather than totalSentenceCount so a turn that
        // buffered sentences in the gate (and is now dropping them)
        // doesn't trigger a bridge for speech that never played.
        // Threshold raised to 2 — when only 1 short sentence played,
        // the bridge phrase is itself more disruptive than the
        // ~1-2 second silence the student would otherwise experience.
        if (audibleSentenceCount < 2) return;
        bridgeSpokenThisTurn = true;
        const phrase = BRIDGE_PHRASES[Math.floor(Math.random() * BRIDGE_PHRASES.length)];
        speakTextRef.current?.(phrase);
        console.log('[brain-orchestrator] kill-bridge spoken:', phrase);
        onDebugEvent?.('kill_bridge_spoken', phrase);
      };

      // Roll back the renders dispatched by a killed attempt. The
      // student heard a kill bridge and the attempt's narration was
      // dropped from aggregatedFullText / chat — but any show_* tool it
      // already dispatched is still on the board (and in the catalog,
      // the id map, and the PDF export). Left in place it produces an
      // orphaned figure with no narration, and on a tool-swap retry two
      // contradictory figures (observed 2026-05-15: killed
      // show_geometry_constructed BST persisted next to the retry's
      // show_diagram binary_tree; killed show_problem persisted into the
      // wrap-up). Emit a 'removeItems' command (parent appends → canvas
      // page-builder + PDF export filter it out), and prune every local
      // structure that resolves ids → renders so dedup / scribble-target
      // resolution / the empty-board gate don't reference vanished
      // figures. The killed streaming chat entry is removed separately
      // by the existing retry/give-up cleanup, so its attached
      // whiteboardCommands go with it — no transcript work needed here.
      const rollbackKilledRenders = (ids: string[]): void => {
        const unique = Array.from(new Set(ids.filter(Boolean)));
        if (unique.length === 0) return;
        const idSet = new Set(unique);
        onWhiteboardCommand([{ action: 'removeItems', ids: unique }]);
        const beforeMirror = whiteboardCommandsRef.current.length;
        whiteboardCommandsRef.current = whiteboardCommandsRef.current.filter(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (c) => !idSet.has((c as any).id),
        );
        const prunedFromMirror = beforeMirror - whiteboardCommandsRef.current.length;
        whiteboardCommandCountRef.current = Math.max(
          0,
          whiteboardCommandCountRef.current - prunedFromMirror,
        );
        for (const id of unique) commandByIdRef.current.delete(id);
        const prunedFromCatalog = catalogRef.current.removeByIds(unique);
        console.warn(
          `[brain-orchestrator] rolled back ${unique.length} killed render(s): ` +
            `mirror-${prunedFromMirror} catalog-${prunedFromCatalog} [${unique.join(', ')}]`,
        );
        onDebugEvent?.('killed_render_rollback', `${unique.length}: ${unique.join(',')}`);
        onDebugEvent?.('render_dropped', `painted — kill rollback of ${unique.length} render(s)`);
      };

      // #4 (2026-05-15): Skip-turn pre-emptive TTS gating. A correct
      // response to a Skip click is short and advance-FIRST ("Got it,
      // moving on!" + advance_lesson). A bad one answers the skipped
      // question instead and gets Skip-KILLed post-stream — but by then
      // the partial answer + a "one moment" bridge have already been
      // spoken (observed Issue 2: "Integer dot value of 30. one
      // moment."). Since the advance is a discrete event we can wait
      // for, hold the gate on Skip turns until advance_lesson /
      // generate_problem actually dispatches: a good turn opens it in
      // real time at that dispatch; a bad turn never opens it, so the
      // Skip-KILL drops the buffered text silently — nothing spoken, no
      // bridge. `transcript` is the turn's actual student input and is
      // stable across validator retries.
      const skipTurnMarkerPresent = /\[Skip-button-clicked/i.test(transcript);

      // Kill-recovery (B): fresh per-call deferred-rollback set. Any kill this
      // call defers its renders here; the finally rolls back whatever the retry
      // didn't re-confirm.
      pendingRevisionRef.current = new Set();
      // Kill-recovery (B) — keep-on-no-replacement (2026-06-17). Tracks
      // whether the WINNING (final) attempt rendered anything. Reset at the
      // top of each attempt, set on every render; after the loop it reflects
      // only the last attempt's render activity. The finally uses it to decide
      // whether a diverged/abandoned retry actually superseded the killed
      // renders (winning attempt rendered a replacement → sweep) or simply
      // failed to re-emit them (winning attempt rendered nothing → KEEP, so a
      // valid graph the student asked for doesn't vanish — server_5
      // 2026-06-17: brain bailed to a next-steps offer after repeated
      // validation rejections and a valid show_function_graph was swept).
      winningAttemptRenderedRef.current = false;

      // Student marks (Phase 1): drain ONCE per logical turn, BEFORE the
      // validator-retry loop — a killed attempt 0 must not eat the marks
      // (the retry that the student actually hears re-sends the same block;
      // duplicating context to a rejected, invisible attempt is harmless,
      // losing it on the surviving one is not).
      // Student marks: a writing-gesture OCR may still be in flight when the
      // student's turn dispatches (they scribble an answer then immediately
      // ask about it). Wait briefly so the resolved text rides THIS turn —
      // otherwise it straggles in as a standalone message and the brain
      // answers twice (live 2026-07-05, "am I right?" double-response).
      // Bounded: worst case adds ~3s to turn start, only when OCR is pending.
      if (TUTOR_STUDENT_MARKS && studentMarkOcrInFlightRef.current > 0) {
        const ocrDeadline = Date.now() + 3000;
        while (studentMarkOcrInFlightRef.current > 0 && Date.now() < ocrDeadline) {
          await new Promise((r) => setTimeout(r, 100));
        }
      }
      const studentMarksForTurn = TUTOR_STUDENT_MARKS ? drainStudentMarks() : undefined;

      for (let attempt = 0; attempt <= MAX_VALIDATOR_RETRIES; attempt++) {
        // On retry attempts, clear the per-turn dedup set so the brain's
        // CORRECTED tool call (e.g. show_collision with proper momentum)
        // isn't dropped as a duplicate of the rejected one. Without this,
        // attempts 2-N never reach the validator — they're filtered out
        // by the dedup pre-check that ran before the original validator
        // rejection (observed 2026-04-26 with the inelastic-collision
        // prompt: brain corrected its momentum value across 3 attempts
        // but every retry's show_collision was dedup-dropped so the user
        // saw nothing rendered and the validator kept rejecting the
        // stale-but-still-bad attempt-1 args).
        if (attempt > 0) {
          visualActionsThisTurnRef.current = new Set();
          newPageThisTurnRef.current = false;
          brainEmittedNewPageThisTurnRef.current = false;
          generateProblemThisTurnRef.current = false;
          // Kill-recovery (B): also clear the consecutive-equation guard. It
          // fires BEFORE the catalog-signature dedup, so without this a retry
          // re-emitting the killed equation verbatim would be dropped here and
          // never reach the catalog dedup where the deferred render gets
          // CONFIRMED — leaving it stranded in pendingRevisionRef and swept at
          // end-of-call (the equation would vanish). Clearing lets the re-emit
          // flow to the catalog dedup → confirm → kept. Consistent with the
          // other per-retry dedup resets above.
          lastEquationLatexRef.current = '';
        }
        // Compose lesson plan context from the active plan + current
        // segment id (both ref-tracked so segment advances mid-turn are
        // picked up on the next call). Free-conversation sessions omit
        // this — `lessonPlanRef.current` is null.
        const plan = lessonPlanRef.current;
        const baseLessonPlanContext = plan && currentSegmentIdRef.current
          ? buildLessonPlanContext(plan, currentSegmentIdRef.current, [...completedSegmentIdsRef.current])
          : undefined;
        // Task C1 (flag-gated): attach the resolved session mode so
        // formatLessonPlanContext renders the plan-as-seed framing
        // ('subscribed' = seed + LO coverage contract; 'demo' = raw
        // material). Flag off ⇒ sessionModeRef stays null ⇒ the field is
        // never present ⇒ server-side block byte-identical to pre-C1.
        const lessonPlanContext = baseLessonPlanContext
          ? {
              ...baseLessonPlanContext,
              ...(TUTOR_PEDAGOGY_OPENER && sessionModeRef.current ? { sessionMode: sessionModeRef.current } : {}),
              // Content variety (phase 1): inject seen-memory only when armed
              // (repeat session on this plan + flag on). Absent ⇒ no
              // <content_variety> block ⇒ byte-identical request.
              ...(TUTOR_CONTENT_VARIETY && planContentSeenRef.current ? { contentVariety: planContentSeenRef.current } : {}),
            }
          : baseLessonPlanContext;

        // Student-problem grounding (coherence fix): if the student brought
        // their OWN concrete problem (request-framed, concrete, divergent from
        // BOTH the authored example and the current active problem), anchor on
        // THEIRS — set currentProblemRef(source:'student') so it surfaces as
        // <active_problem> and the brain renders the student's problem (the
        // authored <segment_truth> mandate is suppressed server-side, and the
        // divergence-guard relax lets the render through). Persists until the
        // brain advances (clears the ref) or the student brings another.
        if (TUTOR_STUDENT_PROBLEM_GROUNDING) {
          const lastStudent = transcriptRef.current.filter((e) => e.role === 'student').slice(-1)[0]?.text ?? '';
          const authoredText = getSegmentTruth(lessonPlanContext?.currentSegment as Parameters<typeof getSegmentTruth>[0])?.problemText ?? '';
          const activeStmt = currentProblemRef.current?.statement ?? '';
          const brought = detectStudentBroughtProblem(lastStudent, authoredText, activeStmt);
          if (brought) {
            currentProblemRef.current = { statement: brought, kind: 'generic', source: 'student' };
            console.log(`[VoiceTutorRealtime] student-brought problem detected → grounding on it: "${brought.slice(0, 80)}"`);
            onDebugEvent?.('student_problem_detected', brought.slice(0, 90));
          }
        }

        // Pedagogy opener: attach the per-turn `<opening_directive>` while
        // the opening phase is active. Retirement here is the TURN CEILING
        // only (OPENING_DIRECTIVE_MAX_BRAIN_TURNS); the intended retirement
        // — the brain calling advance_lesson — clears the ref in
        // applyResolvedAdvance. Flag off ⇒ ref is never seeded ⇒ the field
        // stays undefined and JSON.stringify omits it (request byte-identical).
        let openingDirective: string | undefined;
        if (TUTOR_PEDAGOGY_OPENER && openingDirectiveRef.current) {
          if (
            shouldRetireOpeningDirective({
              lessonAdvanced: false,
              brainTurnsCompleted: openingDirectiveBrainTurnsRef.current,
            })
          ) {
            openingDirectiveRef.current = null;
            teacherIntroDirectiveRef.current = null;
          } else {
            // Teacher self-intro rides the FIRST opening turn only, then
            // clears — the pedagogy directive keeps riding its ≤4 turns
            // without re-triggering "introduce yourself".
            const intro = teacherIntroDirectiveRef.current;
            openingDirective = intro
              ? `${intro} ${openingDirectiveRef.current}`
              : openingDirectiveRef.current;
            teacherIntroDirectiveRef.current = null;
            openingDirectiveBrainTurnsRef.current += 1;
          }
        }

        // Teacher-persona mid-session style salience: attach the compact
        // <teacher_style> reminder on every turn where the opening
        // directive is NOT riding (it takes over exactly at retirement —
        // while the directive rides, identity is already salient). Never
        // retires: style must stay audible all session. Flag off / no
        // persona / diagnostic ⇒ ref is null ⇒ field stays undefined ⇒
        // request byte-identical.
        let styleReminder: string | undefined;
        if (TUTOR_PEDAGOGY_OPENER && teacherStylePersonaRef.current && !openingDirective) {
          const turn = teacherStyleTurnRef.current++;
          styleReminder = renderTeacherStyleReminder(teacherStylePersonaRef.current, {
            brainTurnIndex: turn,
          }) ?? undefined;
          if (styleReminder) {
            console.log(`[teacher-style] attaching per-turn style reminder (turn ${turn}, catchphrases ${turn % CATCHPHRASE_TURN_INTERVAL === 0 ? 'offered' : 'withheld'})`);
          }
        }

        // Task E1 (pedagogy): budget-aware satisfying stop — DEMO sessions
        // only. Flag off ⇒ sessionModeRef stays null ⇒ the field stays
        // undefined and JSON.stringify omits it (request byte-identical).
        // Subscribed sessions never carry it either — their pacing is owned
        // by the plan + pacing v2. mode 'milestone' when the embed's
        // is_trial signal is present (win boxed to the first completed
        // concept); else 'time' with the session's minute budget and whole
        // minutes elapsed since the student actually started (mic tap /
        // resume-continue; falls back to mount time before that).
        let demoStop: ReturnType<typeof selectDemoStopPayload> | undefined;
        if (TUTOR_PEDAGOGY_OPENER && sessionModeRef.current === 'demo') {
          // Milestone vs time-budget is a pure decision (is_trial × explicit
          // time box); the wrap threshold rides along in time mode. A trial
          // WITH an explicit max_duration_minutes (the homepage timed demo)
          // now gets time mode + graceful wrap instead of milestone.
          const startedAtMs = voiceSessionStartedAtMsRef.current ?? sessionStartMsRef.current;
          demoStop = selectDemoStopPayload({
            isTrial,
            maxDurationExplicit,
            budgetMinutes: sessionMaxMinutes,
            minutesElapsed: Math.max(0, Math.floor((Date.now() - startedAtMs) / 60000)),
            wrapAtMinutes: sessionWrapMinutes,
          });
        }

        // Stage 2 perception cancellation surface. Create an
        // AbortController for this brain call and expose it via
        // inFlightBrainAbortRef so the perception layer's
        // speech_started callback can call .abort() when the student
        // starts speaking during 'processing' (= design's "thinking").
        // No effect when perception isn't running — nothing reads the
        // ref, signal is never aborted, fetch behaves identically.
        const brainAbort = new AbortController();
        inFlightBrainAbortRef.current = brainAbort;
        // Fresh attempt — clear the aborted flag; only an AbortError this
        // attempt re-sets it (see the RESTORE-after-noise guard).
        brainTurnAbortedRef.current = false;
        const brainFetchInit: RequestInit = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: brainAbort.signal,
          body: JSON.stringify({
            systemPrompt: claudeSystemPromptRef.current,
            conversationHistory: runHistory,
            studentTranscript: runTranscript,
            // Board Map (project_tutor_board_map_design): send the FULL-board
            // snapshot (NOT segment-scoped) + the page list. buildWhiteboardSummary
            // now owns segment-scoping — it expands current-segment + current-view
            // + top-N off-segment pages and collapses the rest, so off-segment
            // pages still need their item detail available here. The judge path
            // (separate call) keeps its segment-scoped snapshot.
            whiteboardSnapshot: catalogRef.current.getSnapshot(),
            whiteboardPages: catalogRef.current.getPages(),
            lessonPlanContext,
            // D1b: append the transient context block (null when the
            // pedagogy-opener flag is off / no portal context) WITHOUT
            // mutating studentProfileBlockRef. Flag off ⇒ exactly the old
            // `studentProfileBlockRef.current || undefined` value.
            studentProfileBlock:
              [studentProfileBlockRef.current, transientContextBlockRef.current]
                .filter(Boolean)
                .join('\n\n') || undefined,
            // Pedagogy opener: opening-phase directive (undefined once
            // retired / when the flag is off — see the block above).
            openingDirective,
            // Teacher-persona style salience: per-turn reminder, present
            // exactly when the opening directive is NOT (see block above).
            styleReminder,
            // Student marks (Phase 1): drained tap buffer for THIS turn,
            // captured once above the retry loop (undefined when the flag
            // is off or nothing was tapped — see the block above).
            studentMarks: studentMarksForTurn,
            // Task E1: demo-only budget-aware stop (undefined when the flag
            // is off or the session is subscribed — see the block above).
            demoStop,
            // Task X2: durable practice-mode contract. sessionGoal rides the
            // embed token on EVERY mint (initial + resume), so deriving the
            // flag from the stable prop each turn makes the mode durable across
            // resume with no client persistence — the `<practice_session>`
            // block re-renders every turn. Absent/false ⇒ block omitted.
            // Task Y1: OR in the starter-chip practiceOverride (durably
            // forced by the "Practice problems" chip, cleared by "Explain a
            // concept", persisted in the pacing-v2 blob) — see
            // derivePracticeMode / practice-mode.ts for the full precedence
            // contract (token = launch context, override = in-session
            // intent that wins while set).
            practiceMode: derivePracticeMode(sessionGoal, practiceOverrideRef.current),
            // Task WS3: durable mock-review context (undefined for non-mock-
            // review sessions or when the embed's context fetch failed —
            // degrade, never block). Read from the ref so a late async arrival
            // isn't missed by this memoized callback.
            mockReview: mockReviewRef.current,
            grade: level,
            // Lever A tools-array subject filter (server-side, behind
            // TUTOR_TOOL_SUBJECT_FILTER; off ⇒ ignored). Configured
            // session subject, immutable for the session ⇒ cache-safe.
            // When a future mid-session subject-change feature ships,
            // STOP sending this on/after the change (⇒ sticky fail open)
            // — see project_lever_a_tools_filter.md.
            subject,
            // Adaptive-pacing v1 dedup state. Empty arrays for sessions
            // that haven't shown any generated problems yet — fine,
            // pipeline treats absent + empty identically.
            shownProblemIds: shownProblemIdsRef.current,
            shownProblemHashes: shownProblemHashesRef.current,
            // Round-7 fix: the most recently rendered problem statement,
            // tracked client-side on every showProblem dispatch (line
            // 1829). Surfaces to the brain as `<active_problem>` so it
            // anchors verification on THIS card rather than on a prior
            // problem still visible in the segment-scoped snapshot.
            // Catastrophe without this: generate_problem returns a fresh
            // canonicalText, brain renders it, brain on the NEXT turn
            // verifies the student's correct answer against the OLD
            // problem (judge KILL spiral, observed 2026-05-02).
            activeProblem: currentProblemRef.current?.statement
              ? {
                  statement: currentProblemRef.current.statement,
                  source: currentProblemRef.current.source,
                  // expectedAnswer pin (2026-07-17): the pipeline-verified
                  // answer rides every turn while this problem is active so
                  // the brain verifies against it instead of re-deriving
                  // (verification-drift fix — see <active_problem> block).
                  expectedAnswer: currentProblemRef.current.expectedAnswer,
                }
              : undefined,
            // Whiteboard markup Phase 1 (2026-05-13 audit): drain the
            // unrealized-marks buffer accumulated during the prior turn's
            // tutor_scribble silent-drops. Surfaces to the brain as the
            // `<unrealized_marks>` advisory so it learns its scribble
            // narration did not produce a visual mark — and adjusts on
            // this turn. NOT a tool-result rejection (no audio cascade).
            // Cleared immediately after we snapshot the array so the
            // next turn starts empty.
            unrealizedMarks: unrealizedMarkRef.current.length > 0
              ? [...unrealizedMarkRef.current] : undefined,
            // Whiteboard markup Phase 1: dedup-blindness fix. Sibling
            // of unrealizedMarks — see deduplicatedShowsRef declaration.
            deduplicatedShows: deduplicatedShowsRef.current.length > 0
              ? [...deduplicatedShowsRef.current] : undefined,
            // Pacing v2: student-state snapshot for the brain prompt.
            // Block omitted by the formatter when no signal is
            // interesting. Phase 2 includes thresholds → formatter
            // emits hint: line when crossed; server-side env-var gate
            // strips thresholds if PACING_V2_ADVISORIES=false.
            // Streak refs are now keyed loosely (retag-on-segment-change
            // without reset) so segId match check is just a sanity guard.
            pacingState: {
              correctStreak: studentStreakRef.current.count,
              incorrectStreak: studentIncorrectStreakRef.current.count,
              cue: studentCueRef.current?.cue,
              segmentTurns: segmentTurnCountRef.current.segId === currentSegmentIdRef.current
                ? segmentTurnCountRef.current.count : 0,
              segmentMastered: segmentMasteredFlagRef.current ?? undefined,
              // Phase 4: per-plan thresholds override gradeProfile
              // defaults when the plan declares its own. Lets a
              // partner / curriculum author tune ramp + offer +
              // inverse-streak thresholds per the plan's intended
              // pacing (test-prep wants more drilling; K-2 wants
              // earlier ramps; etc.).
              thresholds: lessonPlanRef.current?.pacingThresholds
                ?? getGradeProfile(level).pacingThresholds,
              // Phase 3: session-level depth preference. 0 = neutral
              // (block omitted by formatter). Set by buttons or verbal
              // cue. Never resets within a session.
              paceBias: paceBiasRef.current,
              paceBiasAppliedSinceTurns: paceBiasRef.current !== 0
                ? Math.max(0, pacingTurnCounterRef.current - paceBiasSetTurnRef.current)
                : undefined,
              // #7 hybrid: standing difficulty preference → renders as
              // <difficulty_preference> + deterministic 'same'-upgrade at
              // the route's generate_problem resolver.
              difficultyBias: difficultyBiasRef.current,
            },
            // Pacing v2 telemetry events buffered since the previous
            // brain call. Drained here. The /api/tutor/brain/stream
            // route writes each line server-side so they appear in
            // serverlog_*.txt for grep-based verification (browser
            // console.log doesn't reach there reliably).
            pacingTelemetry: pacingTelemetryRef.current.length > 0
              ? [...pacingTelemetryRef.current] : undefined,
            // Topic-notes orchestrator state — tells the brain whether
            // tools are eligible (warmup cleared) + remaining capacity
            // per bucket. Without this signal the brain has no way to
            // know if its tool calls would land vs. silent-drop. Only
            // sent when the session is plan-driven (free-conversation
            // sessions can't anchor overlays anyway).
            topicNotesState: lessonPlanId
              ? {
                  baselineId: lessonPlanId,
                  completedSegments: completedSegmentIdsRef.current.size,
                  warmupSegmentsRequired: TOPIC_NOTES_WARMUP_SEGMENTS,
                  remaining: {
                    theory: Math.max(0, TOPIC_NOTES_RATE_LIMITS.theory - sessionAccumRef.current.topicNotesCount.theory),
                    methods: Math.max(0, TOPIC_NOTES_RATE_LIMITS.methods - sessionAccumRef.current.topicNotesCount.methods),
                    pointers: Math.max(0, TOPIC_NOTES_RATE_LIMITS.pointers - sessionAccumRef.current.topicNotesCount.pointers),
                  },
                }
              : undefined,
          }),
        };
        let res = await fetch('/api/tutor/brain/stream', brainFetchInit);
        pacingTelemetryRef.current = [];
        // Whiteboard markup Phase 1: drain the unrealized-marks +
        // deduplicated-shows buffers immediately after the fetch is
        // dispatched (body already serialized into the request).
        // One-turn lifetime per the grilling decision — surfaced once,
        // then cleared. Mirrors the pacingTelemetryRef clear pattern.
        unrealizedMarkRef.current = [];
        deduplicatedShowsRef.current = [];
        // Deploy-window resilience (2026-07-24 incident): a pm2 restart
        // mid-session 502s every endpoint for tens of seconds, and the old
        // path spoke the "trouble thinking" fallback on the FIRST 502.
        // Nothing has been emitted for this turn yet, so re-fetching is
        // always safe here. Three retries (1.5s/3s/5s) ride out a typical
        // server reboot; the honest fallback below still fires if the
        // backend stays down. Aborts (student barge-in) exit immediately.
        for (
          let httpRetry = 1;
          httpRetry <= 3 && !res.ok && res.status >= 500 && !brainAbort.signal.aborted;
          httpRetry++
        ) {
          const delayMs = httpRetry === 1 ? 1500 : httpRetry === 2 ? 3000 : 5000;
          console.warn(`[brain-orchestrator] /api/tutor/brain/stream ${res.status} — retrying (${httpRetry}/3) in ${delayMs}ms`);
          onDebugEvent?.('brain_http_retry', `status=${res.status} attempt=${httpRetry}`);
          await new Promise((r) => setTimeout(r, delayMs));
          if (brainAbort.signal.aborted) break;
          res = await fetch('/api/tutor/brain/stream', brainFetchInit);
        }
        if (!res.ok || !res.body) {
          const err = res.body ? await res.text() : '(no body)';
          console.error('[brain-orchestrator] /api/tutor/brain/stream failed:', res.status, err);
          // Task X10: an HTTP-level failure is the brain being unreachable —
          // not the student mishearing. Be honest, and match the empty-stream
          // fallback's modality split (typed ⇒ text bubble, voice ⇒ spoken).
          onDebugEvent?.('brain_http_error', `status=${res.status}`);
          if (currentTurnTypedRef.current) {
            const msg = "I'm having trouble reaching my brain right now — give me a moment and try again.";
            transcriptRef.current = [
              ...transcriptRef.current,
              {
                id: `tutor-${t0}-brain-http-error`,
                timestamp: new Date(),
                role: 'tutor',
                text: msg,
              } as TranscriptEntry,
            ];
            onTranscriptUpdate([...transcriptRef.current]);
            onTrackInteraction?.('message', msg, undefined, 'tutor');
          } else {
            speakTextRef.current?.("I'm having trouble thinking right now — one moment.");
          }
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buf = '';
        const toolNamesThisAttempt: string[] = [];
        const toolArgsThisAttempt: Array<Record<string, unknown>> = [];
        const rejectionsThisAttempt: Array<{ action: string; reason: string }> = [];
        // Stamped ids of every render this attempt actually dispatched.
        // If the attempt is killed, these are rolled back so no orphaned
        // figure survives the dropped narration (see rollbackKilledRenders).
        const renderIdsThisAttempt: string[] = [];
        // Reset the winning-attempt render flag at the top of each attempt.
        // After the loop it holds only the LAST attempt's render activity
        // (keep-on-no-replacement, see the finally).
        winningAttemptRenderedRef.current = false;
        // Snapshot of renderIdsThisAttempt.length captured at the moment
        // advance_lesson / generate_problem dispatches. Item B fix
        // (2026-05-24): if the attempt is killed AFTER an advance, the
        // pre-advance renders belong to the PRIOR segment which was
        // already marked complete + committed — they MUST NOT be rolled
        // back as collateral damage from a post-advance failure. Observed
        // live 2026-05-23 (opener-merge-stress T3): batch was [show_eq
        // "0.15×80=12" (percent final answer), mark_complete try-percent,
        // advance, show_problem try-proportion (prescribedRender
        // mismatch)]. The mismatch kill called rollbackKilledRenders on
        // ALL renderIdsThisAttempt, taking down the percent's already-
        // accepted final-answer equation. Null = no advance dispatched
        // (rollback scope = full attempt, original behavior).
        let renderCountAtAdvance: number | null = null;
        let attemptText = '';
        // Validate-before-speak chat gating: the streaming chat bubble shows
        // `attemptText`, which keeps accumulating even AFTER a kill (the
        // killed attempt streams to completion, audio-gated by attemptKilled
        // but still recorded) — so the wrong/post-kill content flashes in
        // chat then gets dimmed+corrected (the 2026-06-20 visual leak). When
        // the flag is on we reveal `chatRevealText` instead, which only
        // accumulates pre-kill content (the bubble freezes at what was
        // actually voiced, the retry replaces it). Per-attempt (resets with
        // attemptText). Normal turns: chatRevealText == attemptText.
        let chatRevealText = '';
        // Caption word-sync: fresh registry per attempt. Same key as the
        // streaming chat entry so a kill→retry naturally re-keys the caption.
        captionSyncRef.current.beginAttempt(`tutor-streaming-${t0}-${attempt}`);
        // Once a tool call in this attempt is rejected, the attempt is
        // doomed and we'll retry. Stop voicing further sentences from
        // this attempt (otherwise the student hears both the bad voice-
        // over and the corrected one). Tool calls keep dispatching so
        // we collect ALL rejections in one pass for the retry message.
        let attemptKilled = false;

        // Judge-kill Stage 3.1: this attempt's resume-decision state. Armed
        // when the PRIOR attempt left a resume snapshot (a content kill with
        // an unplayed TTS tail). Consume the cross-attempt slot here so a
        // kill on THIS attempt can re-arm it cleanly for the next one.
        // performKill only arms with a non-empty tail, so armed ⇔ length>0.
        const resumeSnapshot: string[] = judgeKillResumeSnapshot ?? [];
        const resumeKilledText: string = judgeKillResumeKilledText ?? '';
        const resumeArmed = resumeSnapshot.length > 0;
        // Sentences the killed attempt already covered (heard + snapshot). On a
        // restatement, retry sentences at index ≤ this are suppressed (audio
        // comes from the snapshot replay); sentences BEYOND it are content the
        // kill pre-empted and must still be spoken. `resumeRetryCount` tracks
        // the retry's running sentence index through emitBrainSpeak.
        const resumeCoveredCount = judgeKillResumeCoveredCount;
        let resumeRetryCount = 0;
        judgeKillResumeSnapshot = null;
        judgeKillResumeKilledText = null;
        judgeKillResumeCoveredCount = 0;
        // Decision bookkeeping: until we've seen enough of the retry's
        // opener to judge restatement-vs-correction, its sentences are HELD
        // (not spoken). Once decided: restatement → replay the snapshot and
        // suppress this attempt's audio (chat-only); correction → speak the
        // held opener live and continue normally.
        let resumeDecided = false;
        let resumeSuppressAudio = false;
        const resumeHeldSentences: string[] = [];
        let resumeHeldText = '';

        // TTS gate. Buffer sentences until the first tool dispatch
        // resolves so a rejected tool can drop its narration before the
        // student hears it. Falls open via a 1s timer for text-only
        // turns (the brain emitted no tools); closes (drops queued +
        // future text from this attempt) on the first rejection — the
        // validator-feedback retry attempt speaks the corrected version.
        // Cost: ~1s of added latency on the first sentence of every
        // turn. Trade accepted to eliminate audibly bad narration when
        // the brain promises a render that gets dedup'd or rejected.
        // (Reverted from 500ms after gibberish reports — 1s is the
        // empirically-stable timeout that gives the first tool dispatch
        // enough time to resolve before sentences flush.)
        let gateState: 'gated' | 'open' | 'closed' = 'gated';
        const pendingSentences: string[] = [];
        // Validate-before-speak rolling-hold state (project_tutor_validate_
        // before_speak). When ON, the gate does NOT fully open on the first
        // clean tool — it flushes the sentences that preceded that tool but
        // STAYS 'gated' (vbsRolling=true) so later sentences keep buffering
        // until THEIR following tool's verdict (or vbsCapTimer). A later
        // rejecting tool's performKill→closeGate then drops the still-
        // buffered wrong sentence before it's ever spoken.
        let vbsRolling = false;
        let vbsCapTimer: ReturnType<typeof setTimeout> | null = null;
        // Round-19 (2026-07-17, session portal-fef3fbb0): set when the
        // 'generated-problem' SSE event lands (the pipeline RETURNED a
        // problem this attempt). If the stream then ends without any
        // show_problem, the brain spoke its bridge ("let me see what I
        // have…") and froze — checked at stream end, kill + retry.
        let generatedProblemReceivedThisAttempt = false;
        const clearVbsCap = () => {
          if (vbsCapTimer) { clearTimeout(vbsCapTimer); vbsCapTimer = null; }
        };
        // Stage 3 fix #10 (2026-05-28): synchronous speakText gate check.
        // Returns true if perception has armed the cancel gate within
        // the SPEAK_TEXT_GATE_MS window. Drops the sentence silently so
        // the orchestrator's SSE for-await buffer drain after an abort
        // signal doesn't leak audio past the cancel. NOT used by the
        // kill-bridge / error-fallback speakText paths — they live
        // outside the brain-emit race window and have their own
        // semantics.
        const speakTextGated = (): boolean => {
          if (Date.now() < speakTextBlockedUntilRef.current) {
            return true;
          }
          return false;
        };
        // Raw TTS dispatch: push to the perception self-voice buffer, speak,
        // count as audible. The single place a brain sentence actually
        // reaches the speaker.
        const speakOne = (s: string): void => {
          // V2: capture the perception scriptId and hand it to speakText so the
          // audio queue can stamp this sentence's window at real playback time.
          const scriptId = pushTtsScriptForPerception(s);
          speakTextRef.current?.(s, scriptId);
          audibleSentenceCount++;
          // Always recorded (was gated behind TUTOR_BOARD_ANCHOR_ASSIST):
          // the anchor assists read only the last element, and rule-8 v2's
          // client repair needs the full spoken-sentence list at turn end.
          turnNarrationRef.current.push(s);
          if (TUTOR_BOARD_ANCHOR_ASSIST) {
            // Re-anchor: if a held turn-opening anchor is NAMED by this sentence,
            // bind it here so it flushes as this sentence plays. anchorM =
            // sentences dispatched BEFORE this one = the current (pre-increment)
            // count, so it becomes flushable when this sentence starts.
            for (const e of renderBufferRef.current) {
              if (e.pendingReanchor && e.anchorKeywords && sentenceIntroducesAnchor(s, e.anchorKeywords)) {
                e.anchorM = ttsDispatchedCountRef.current;
                e.pendingReanchor = false;
                onDebugEvent?.('render_sync_reanchor', `anchor→${e.anchorM} "${s.slice(0, 40)}"`);
              }
            }
          }
          // Render↔speech sync: a sentence just reached TTS. Renders
          // buffered AFTER this point anchor to the new count, so they
          // flush only once this sentence (and all before it) has played.
          ttsDispatchedCountRef.current++;
          turnLatencyRef.current?.mark('firstTtsFetch', Date.now());
        };
        // Round-15 Issue 2 (2026-07-16): verdict hold. The first sentence
        // of a turn that opens with a judgment of the student's answer
        // ("Not quite…" / "That's right…") is held OUT of the TTS queue —
        // along with its successors, to preserve order — until the verdict
        // is settled: two further sentences arrive without a contradiction
        // signal, the cap timer fires, or the stream ends. A contradiction
        // detected while holding kills PRE-AUDIO (the whole point): the
        // observed live failure was speak-then-kill — TTS played "Not
        // qu—", the inversion regex on a LATER sentence tripped
        // performKill which chopped the audio mid-word, then the retry
        // affirmed the same answer the student gave. Only attempt 0
        // holds (retries are already post-kill corrections; the kill
        // regexes don't fire there, and the Stage-3.1 resume machinery
        // owns retry pacing).
        let verdictHoldActive = false;
        let verdictSeenThisAttempt = false;
        let verdictHeldText = '';
        const verdictHeld: string[] = [];
        let verdictHoldTimer: ReturnType<typeof setTimeout> | null = null;
        const clearVerdictCap = () => {
          if (verdictHoldTimer) { clearTimeout(verdictHoldTimer); verdictHoldTimer = null; }
        };
        const releaseVerdictHold = (): void => {
          clearVerdictCap();
          if (!verdictHoldActive) return;
          verdictHoldActive = false;
          const held = verdictHeld.splice(0, verdictHeld.length);
          verdictHeldText = '';
          if (held.length > 0) {
            onDebugEvent?.('verdict_hold_released', `${held.length} sentence(s)`);
          }
          for (const s of held) {
            if (!speakTextGated()) speakOne(s);
          }
        };
        const dropVerdictHold = (why: string): void => {
          clearVerdictCap();
          if (!verdictHoldActive && verdictHeld.length === 0) return;
          if (verdictHeld.length > 0) {
            console.log(`[brain-orchestrator] verdict hold: DROPPED ${verdictHeld.length} held sentence(s) pre-audio (${why}, never spoken):`, verdictHeld.map((s) => s.slice(0, 60)));
            onDebugEvent?.('verdict_hold_dropped', `${verdictHeld.length} sentence(s) — ${why}`);
          }
          verdictHoldActive = false;
          verdictHeld.length = 0;
          verdictHeldText = '';
        };
        const armVerdictCap = () => {
          clearVerdictCap();
          verdictHoldTimer = setTimeout(() => {
            verdictHoldTimer = null;
            releaseVerdictHold();
          }, VERDICT_HOLD_CAP_MS);
        };
        // Judge-kill Stage 3.1: decide restatement-vs-correction for a
        // post-content-kill retry, using whatever opener text we've held so
        // far. Restatement (≥60% content-word overlap + no changed number)
        // → replay the killed attempt's unplayed tail and suppress this
        // retry's audio (chat-only). Correction (or nothing to resume) →
        // speak the held opener live and continue normally.
        const decideResume = (): void => {
          resumeDecided = true;
          const restated =
            resumeSnapshot.length > 0 &&
            isJudgeKillRestatement(resumeHeldText, resumeKilledText);
          if (restated) {
            resumeSuppressAudio = true;
            console.warn(
              `[brain-orchestrator] judge-kill Stage 3.1: retry is a restatement — replaying ${resumeSnapshot.length} unplayed sentence(s), suppressing retry audio`,
            );
            onDebugEvent?.('judge_kill_resume', `${resumeSnapshot.length} sentences`);
            resumeSpeakTextRef.current?.(resumeSnapshot);
            // Held sentences beyond the covered range are NEW content the kill
            // fired before the brain emitted (so the snapshot can't carry
            // them). The held opener's array index i maps to retry sentence
            // index i+1 — speak the ones past resumeCoveredCount so the turn
            // doesn't end abruptly after the replay.
            resumeHeldSentences.forEach((s, i) => {
              if (i + 1 > resumeCoveredCount && !speakTextGated()) speakOne(s);
            });
            // Restatement = content unchanged → KEEP the killed renders rather
            // than rolling them back at end-of-call. The brain commonly
            // re-delivers the SPEECH (and even scribbles on the existing render)
            // without re-emitting the render tool call, so the dedup-confirm
            // path never fires and they'd be swept — dimmed then removed, with
            // any fresh scribble left orphaned (observed 2026-06-17 live test).
            // Clear the pending set (so the finally keeps them) and un-dim.
            if (pendingRevisionRef.current.size > 0) {
              const keptIds = [...pendingRevisionRef.current];
              pendingRevisionRef.current = new Set();
              onWhiteboardCommand([{ action: 'reviseItems', ids: keptIds, revising: false }]);
              onDebugEvent?.('killed_render_kept_restatement', `${keptIds.length}: ${keptIds.join(',')}`);
            }
          } else {
            resumeSuppressAudio = false;
            // Speak the opener we held while deciding, then continue live.
            for (const s of resumeHeldSentences) {
              if (speakTextGated()) continue;
              speakOne(s);
            }
            if (resumeSnapshot.length > 0) {
              console.warn(
                '[brain-orchestrator] judge-kill Stage 3.1: retry diverged (correction / no overlap) — speaking retry live, snapshot discarded',
              );
              onDebugEvent?.('judge_kill_resume_diverged', `held=${resumeHeldSentences.length}`);
            }
          }
        };
        // Unified brain-sentence emit. Routes every brain sentence through
        // (1) the perception cancel gate, then (2) the judge-kill resume
        // hold/decision, before the raw speakOne. flushPending + the
        // gate-open path both call this so the resume logic is applied
        // consistently regardless of TTS-gate timing.
        const emitBrainSpeak = (s: string): void => {
          if (speakTextGated()) {
            console.warn('[brain-orchestrator] STAGE-3 fix #10: brain sentence dropped — perception cancel gate active:', s.slice(0, 80));
            onDebugEvent?.('speak_text_gated_emit', s.slice(0, 80));
            return;
          }
          // Count every retry sentence (held or not) so the suppress path can
          // tell which ones the snapshot already covers vs. which are new.
          if (resumeArmed) resumeRetryCount++;
          if (resumeArmed && !resumeDecided) {
            // Hold the opener until we have enough signal to judge
            // restatement-vs-correction (a sentence/buffer with ≥4 content
            // words, or a 2nd held sentence as a cap to bound latency).
            resumeHeldSentences.push(s);
            resumeHeldText += (resumeHeldText ? ' ' : '') + s;
            const enough =
              judgeKillContentWords(resumeHeldText).length >= 4 ||
              resumeHeldSentences.length >= 2;
            if (enough) decideResume();
            return;
          }
          if (resumeArmed && resumeDecided && resumeSuppressAudio) {
            // Restatement path. Sentences within the killed attempt's covered
            // range get their audio from the snapshot replay → chat-only here.
            // But a kill that fired early (e.g. after sentence 1) never saw the
            // brain's later sentences, so the snapshot can't cover them — those
            // would be silently dropped (observed 2026-06-16: tutor spoke the
            // first sentence then went quiet on the rest). Speak retry
            // sentences beyond the covered range so the turn finishes.
            if (resumeRetryCount > resumeCoveredCount) {
              speakOne(s);
            }
            return;
          }
          // Round-15 Issue 2: verdict hold (attempt 0 only — see the hold
          // state block above). Intercepting HERE covers every dispatch
          // route uniformly: the gated flush (flushPending), the rolling
          // 1-deep hold release, and direct gate-open emissions.
          if (attempt === 0) {
            if (verdictHoldActive) {
              verdictHeld.push(s);
              verdictHeldText += (verdictHeldText ? ' ' : '') + s;
              // Verdict + 2 clean successors = settled (each successor
              // already passed the self-correction / inversion / cross-
              // sentence checks before reaching this dispatch).
              if (verdictHeld.length >= 3) releaseVerdictHold();
              else armVerdictCap();
              return;
            }
            if (!verdictSeenThisAttempt && isVerdictOpener(s)) {
              verdictSeenThisAttempt = true;
              verdictHoldActive = true;
              verdictHeld.push(s);
              verdictHeldText = s;
              onDebugEvent?.('verdict_hold_started', s.slice(0, 60));
              armVerdictCap();
              return;
            }
          }
          speakOne(s);
        };
        const flushPending = () => {
          clearVbsCap();
          for (const s of pendingSentences) {
            emitBrainSpeak(s);
          }
          pendingSentences.length = 0;
        };
        const openGate = () => {
          if (gateState === 'gated') {
            gateState = 'open';
            flushPending();
          }
        };
        const closeGate = () => {
          clearVbsCap();
          // Phase 2: a closing gate means this turn is being killed or
          // rejected — an ack after that would voice over the retry.
          if (ackTimerRef.current) { clearTimeout(ackTimerRef.current); ackTimerRef.current = null; }
          if (escalationTimerRef.current) { clearInterval(escalationTimerRef.current); escalationTimerRef.current = null; }
          // Validate-before-speak: if a kill/abort closes the gate while we
          // were rolling, the buffered (un-played) sentences are dropped
          // BEFORE the speaker — the headline win. Log the count so a live
          // test can see the wrong narration get retracted pre-audio.
          if (vbsRolling && pendingSentences.length > 0) {
            console.log(`[brain-orchestrator] validate-before-speak: DROPPED ${pendingSentences.length} buffered sentence(s) pre-audio on gate close (never spoken):`, pendingSentences.map((s) => s.slice(0, 60)));
            onDebugEvent?.('vbs_dropped_pre_audio', `${pendingSentences.length} sentence(s)`);
          }
          gateState = 'closed';
          pendingSentences.length = 0;
          // Round-15 Issue 2: a kill/abort closing the gate also drops the
          // held verdict pre-audio — the retry re-speaks the settled one.
          dropVerdictHold('gate close');
        };
        // Rolling-hold verbal-tail flush: a buffered sentence with no
        // following tool flushes after VALIDATE_BEFORE_SPEAK_CAP_MS so the
        // tail of a tool turn (and pure narration after the last tool) isn't
        // stranded. Re-armed on every buffered sentence; cleared whenever
        // pending is flushed/dropped. Only used while vbsRolling.
        const armVbsCap = () => {
          clearVbsCap();
          vbsCapTimer = setTimeout(() => {
            vbsCapTimer = null;
            if (gateState === 'gated' && pendingSentences.length > 0) flushPending();
          }, VALIDATE_BEFORE_SPEAK_CAP_MS);
        };
        // v2 divergence-substitute: drop the held narration WITHOUT closing
        // the gate (the turn continues — we substitute the authored card and
        // let the brain's subsequent sentences keep streaming). closeGate
        // would end the turn; this just retracts the buffered wrong sentence
        // so it's never spoken, then we keep rolling.
        const dropPendingForSubstitute = (why: string) => {
          clearVbsCap();
          if (pendingSentences.length > 0) {
            console.log(`[brain-orchestrator] validate-before-speak: DROPPED ${pendingSentences.length} buffered sentence(s) pre-audio (${why}, never spoken):`, pendingSentences.map((s) => s.slice(0, 60)));
            onDebugEvent?.('vbs_dropped_pre_audio', `${pendingSentences.length} sentence(s) — ${why}`);
            pendingSentences.length = 0;
          }
        };
        // Skip turns (#4): never auto-open on the 1s timer — the gate
        // opens only when advance_lesson / generate_problem dispatches,
        // or stays shut so the Skip-KILL drops the turn silently. The
        // long value is just a cleared-anyway backstop against a hung
        // stream. All other turns keep the 1s first-tool grace.
        const gateTimer = setTimeout(openGate, skipTurnMarkerPresent ? 3_600_000 : 1000);

        // Final-attempt kill suppression. When attempt ===
        // MAX_VALIDATOR_RETRIES, the retry budget is exhausted — a
        // kill here would silence the brain's last attempted text
        // without a follow-up to replace it, freezing the lesson
        // (observed Phase 6 stress test 2026-05-13: judge confused
        // seed try-yourself problem text with brain-emitted
        // show_problem values, three KILLs in a row, MAX hit, final
        // attempt audio dropped → silence). All kill sites route
        // through performKill() so the rule is enforced consistently.
        // The helper is also idempotent across multi-kill within a
        // single attempt.
        const performKill = async (): Promise<void> => {
          if (attempt === MAX_VALIDATOR_RETRIES) {
            console.warn(`[brain-orchestrator] kill suppressed on final attempt (${attempt}/${MAX_VALIDATOR_RETRIES}) — audio plays through; rejection logged but no bridge.`);
            onDebugEvent?.('kill_suppressed_final_attempt', `attempt=${attempt}/${MAX_VALIDATOR_RETRIES}`);
            return;
          }
          if (attemptKilled) return;
          attemptKilled = true;
          clearTimeout(gateTimer);
          closeGate();
          // Render↔speech sync: this attempt's still-buffered renders were
          // never shown — drop them + retract from the catalog so the
          // retry's re-emit isn't dedup-suppressed against a never-shown
          // figure. Already-FLUSHED renders stay on the existing
          // pendingRevisionRef dim/rollback path untouched.
          dropRenderBuffer();
          // The kill's clearSpeechQueue (below) drains the dispatched-but-
          // unplayed audio, so the dispatched/playback counts would drift
          // permanently apart and the retry's renders would never reach
          // their anchor (flushing only on stall = early). Reset both so the
          // retry re-anchors against its own fresh audio.
          ttsDispatchedCountRef.current = 0;
          ttsPlaybackStartedCountRef.current = 0;
          lastWordPosRef.current = null; // Task 3.2: clock resets with the counts
          // Judge-kill Stage 3.1: capture the unplayed TTS tail BEFORE the
          // bridge's clearSpeechQueue drains it, so a restatement retry can
          // replay it instead of re-speaking the overlap. Armed only when
          // the student actually heard narration this attempt
          // (audibleSentenceCount > 0) AND there's an unplayed tail — this
          // scopes the resume to content kills with real spoken content
          // (Skip-KILL never opens the gate, so audibleSentenceCount stays
          // 0; dedup-suppression `continue`s without killing). peekSpeechQueue
          // returns [in-flight, ...queued] per Stage 3.1 f435560.
          if (audibleSentenceCount > 0) {
            const tail = peekSpeechQueueRef.current?.() ?? [];
            if (tail.length > 0) {
              judgeKillResumeSnapshot = tail;
              judgeKillResumeKilledText = attemptText;
              judgeKillResumeCoveredCount = audibleSentenceCount;
              onDebugEvent?.('judge_kill_snapshot', `${tail.length} unplayed · heard=${audibleSentenceCount}`);
              // Resume is armed → SUPPRESS the kill bridge (user feedback
              // 2026-06-16). The retry either replays the snapshot as a
              // seamless continuation (restatement) or speaks corrected
              // content after a brief natural pause; a "Hmm."/"One moment."
              // filler here reads as the tutor hesitating/self-correcting —
              // the exact symptom Stage 3.1 exists to remove. We still drain
              // the in-flight audio (the bridge's first job) but skip the
              // spoken phrase. Kills with nothing to resume fall through to
              // the normal bridge below.
              await clearSpeechQueueRef.current?.();
              return;
            }
          }
          await speakKillBridge();
        };

        // Dev-only forced kill (window.__tutorForceKill). Fires a synthetic
        // content kill once at least one sentence is audible — deterministically
        // exercising the judge-kill Stage 3.1 snapshot → bridge-suppress →
        // retry → restate/resume path without a real validator rejection.
        // Checked at the top of the loop (so it catches sentences that became
        // audible via a gate flush, not just inside a sentence event) and once
        // after stream-end (so a short, fully-gated turn still fires). The
        // armed flag PERSISTS across turns until it actually fires, so arming
        // between turns or on a too-short turn still lands on the next one.
        const tryForceKill = async (): Promise<void> => {
          if (!forceKillPendingRef.current) return;
          if (attemptKilled || attempt >= MAX_VALIDATOR_RETRIES) return;
          const needRenders = forceKillAfterRendersRef.current;
          if (needRenders != null) {
            // Wait for the attempt to paint enough renders (keep-validated test).
            if (renderIdsThisAttempt.length < needRenders) return;
          } else if (audibleSentenceCount < 1) {
            return;
          }
          const forcedReason = forceKillPendingRef.current;
          forceKillPendingRef.current = null;
          forceKillAfterRendersRef.current = null;
          rejectionsThisAttempt.push({ action: 'dev_forced_kill', reason: forcedReason });
          const tailLen = peekSpeechQueueRef.current?.()?.length ?? 0;
          console.warn(`[brain-orchestrator] dev __tutorForceKill: synthetic content kill after ${audibleSentenceCount} audible sentence(s), tail=${tailLen}${tailLen === 0 ? ' (no resumable tail — speak a longer explanation to test the resume path)' : ''}`);
          onDebugEvent?.('dev_forced_kill', `audible=${audibleSentenceCount} tail=${tailLen}`);
          await performKill();
        };

        try {
          while (true) {
            await tryForceKill();
            const { done, value } = await reader.read();
            if (done) break;
            buf += decoder.decode(value, { stream: true });
            let idx;
            while ((idx = buf.indexOf('\n\n')) >= 0) {
              const block = buf.slice(0, idx);
              buf = buf.slice(idx + 2);
              for (const line of block.split('\n')) {
                if (!line.startsWith('data: ')) continue;
                let ev: { type: string; [k: string]: unknown };
                try {
                  ev = JSON.parse(line.slice(6)) as { type: string; [k: string]: unknown };
                } catch (parseErr) {
                  console.warn('[brain-orchestrator] failed to parse SSE frame:', parseErr, line);
                  continue;
                }
                if (ev.type === 'sentence') {
                  const sentence = (ev.text as string) || '';
                  if (!sentence.trim()) continue;
                  // Mid-session greeting filter: if the brain opens a
                  // mid-session response with "Hey/Hi/Hello [name]!"
                  // when there's already a prior tutor turn in history,
                  // drop that opener entirely. The brain occasionally
                  // re-greets despite the prompt rule; this is a hard
                  // safety net at the orchestrator layer.
                  // Greeting can land in two shapes:
                  //   (a) entire first sentence is just a greeting
                  //       ("Hey Praveen!") — drop the whole sentence and
                  //       fall through *without* incrementing
                  //       totalSentenceCount, so the NEXT sentence is
                  //       still treated as first-of-turn (it might also
                  //       open with a greeting we want to strip).
                  //   (b) greeting is a prefix on a longer sentence
                  //       ("Hey Praveen! No worries — let me draw…") —
                  //       strip the prefix, voice the remainder.
                  // The 2026-04-29 trig session hit case (a): brain
                  // emitted "Hey Praveen!" as a standalone sentence
                  // after the student's first content reply. The prior
                  // version of this filter only handled (b), so the
                  // greeting-only sentence got voiced. The student then
                  // replied "hello" thinking the session had restarted.
                  const isFirstSentenceOfTurn = totalSentenceCount === 0;
                  if (isFirstSentenceOfTurn && hasPriorTutorTurn) {
                    // \b after the greeting word so "Heyo" / "Hilarious" /
                    // "Howdoyou" don't get falsely stripped as "Hey" / "Hi" /
                    // "Howdy" + leftover. The word boundary requires a
                    // non-word char (or end of string) right after the match.
                    const greetingRe = /^\s*(?:hey|hi|hello|howdy)\b(?:\s+[A-Z][a-z]+)?[!.,]*\s*/i;
                    if (greetingRe.test(sentence)) {
                      const stripped = sentence.replace(greetingRe, '').trim();
                      if (!stripped || stripped.length < 4) {
                        console.log('[brain-orchestrator] dropped greeting-only mid-session sentence:', JSON.stringify(sentence.slice(0, 60)));
                        onDebugEvent?.('mid_session_regreet_dropped', sentence.slice(0, 60));
                        // continue WITHOUT incrementing totalSentenceCount
                        // so the next sentence still counts as first-of-turn.
                        continue;
                      }
                      if (stripped !== sentence.trim()) {
                        console.log('[brain-orchestrator] stripped mid-session re-greet prefix:', JSON.stringify(sentence.slice(0, 40)));
                        (ev as { text?: string }).text = stripped;
                      }
                    }
                  }
                  const updatedSentence = (ev.text as string) || '';
                  if (!updatedSentence.trim()) continue;
                  // Mid-turn self-correction detection. Observed
                  // 2026-04-29 grammar session: brain wrong-claimed "3
                  // nouns" then visibly walked it back ("third is park
                  // — wait, you already said that... my mistake"). The
                  // student watched the bot self-correct in real time
                  // ("how can you make the mistake"). When the brain
                  // emits a phrase that signals a mid-turn walkback,
                  // kill the rest of the attempt, suppress audio, and
                  // route to a judge retry — the brain has already
                  // told us it doesn't trust its own output.
                  //
                  // Only match phrases where the bot is clearly attributing
                  // wrongness to ITSELF. Earlier broader version had high
                  // FP risk: "wait, that's a great question" (filler),
                  // "wait, let me show you" (legit pedagogical), "actually,
                  // that's wrong" / "sorry, that's wrong" (correcting the
                  // STUDENT's wrong answer — extremely common in tutor
                  // turns), "actually, let me reframe", "hmm, actually" all
                  // false-positived. Keep only unambiguous self-attribution.
                  // 2026-05-15: widened to catch additional "wait,…"
                  // walkback markers. Observed Issue C: brain said the
                  // first clause, then "…, wait, [restated different
                  // clause]" within a single sentence. Pure semantic
                  // re-statement ("X is A … wait, X is B") cannot be
                  // detected without LLM-level inspection, but explicit
                  // correction markers (wait+no, wait+sorry, wait+i
                  // meant, or rather, or actually, correction:) can be.
                  // Keep markers GENERIC — structural correction words
                  // only, no subject content.
                  //
                  // 2026-05-15 second pass: observed "Actually, let me
                  // back up — the correct path is …" after the brain
                  // realized it had gone down a wrong-direction trace.
                  // Added "back up" / "redo" / "restart" / "try again"
                  // as standalone correction markers. "back up" is
                  // gated on a preceding "actually," to avoid catching
                  // pedagogical "let me back up and explain why" uses
                  // that don't signal a walkback.
                  // Round-15 Issue 3 (2026-07-16): widened with narrated-
                  // verification markers. Observed live walk-back: "…which
                  // is antagonist behavior. Wait — let me be precise here…
                  // that's antagonist — you had it right the first time."
                  // The old regex matched "let me re-check/verify" but NOT
                  // "let me be precise" / "let me double-check", and the
                  // em-dash after "wait" defeated the "wait,\s+…" forms.
                  // The prompt now forbids voicing the verification process
                  // outright (SILENT_VERIFICATION_RULE); this is the
                  // orchestrator safety net for when the brain does it
                  // anyway. "you had it right the first time" requires the
                  // trailing qualifier — a bare "you had it right" is a
                  // legit reassurance to a self-doubting student.
                  const selfCorrectionRe = /\b(?:wait,?\s+actually|wait,?\s+no\b|wait,?\s+i\s+(?:meant|said|mean)\b|wait,?\s+sorry|wait\s*[—–-]+\s*let me\b|actually,?\s+(?:i was wrong|i['’]m wrong|never mind|i meant|let me back up|let me re-?\w+)|let me re-?(?:check|verify|consider|examine|state|phrase)|let me (?:redo|restart|try again)\b|let me be (?:precise|careful|exact)\b|let me double-?check\b|you had it right the first time\b|is that right\?\s*(?:no|wait|hmm)|(?:^|\.\s+)wait[,.]?\s+is that\b|i mean,?\s+(?:no|actually)\b|i meant\s+to\s+(?:say|write)\b|my mistake|my apologies|sorry,?\s+i (?:was|['’]m) wrong|i (?:was|['’]m) wrong|never mind\s+(?:that|what i)|scratch that|hold on,?\s+i (?:was|['’]m) wrong|correction:)/i;
                  // Round-17 (2026-07-17, session portal-ef215ea0): "or
                  // rather / or actually" moved out of the main regex into a
                  // SOFT tier that never fires on a QUESTION. Live FP: "…want
                  // to stick with algebraic limits and go harder, or actually
                  // switch flavors?" — an alternatives-offering question, not
                  // a walk-back — got killed, and the retry deflected the
                  // student's genuine question. A real self-correction ("it's
                  // 12 — or actually, 13.") is declarative and still caught.
                  const softCorrectionRe = /\b(?:or rather|or actually)\b/i;
                  const isInterrogativeSentence = /\?\s*$/.test(updatedSentence.trim());
                  const selfCorrectionHit = selfCorrectionRe.test(updatedSentence)
                    || (!isInterrogativeSentence && softCorrectionRe.test(updatedSentence));
                  // Round-7+++ Fix Issue 2: skip self-correction
                  // detection on RETRY attempts. The brain's retry
                  // following a judge KILL or rejection legitimately
                  // says "my mistake — X is actually Y" to acknowledge
                  // the prior wrong claim. Treating that as another
                  // self-correction triggers a third attempt and
                  // produces audible 3-attempt cascades. Observed
                  // 2026-05-03 weighted-mean turn (91 × 0.50 spoken as
                  // 47.5 → judge KILL → retry "My mistake — 91 times
                  // 0.50 is *45.5*, not 47.5" → false-positive
                  // self-correction → another retry). Only fire on
                  // the FIRST attempt of a turn; retries are already
                  // corrections, not confused walkbacks.
                  if (!attemptKilled && attempt === 0 && judgeRetriesUsed < MAX_JUDGE_RETRIES && selfCorrectionHit) {
                    const reason =
                      `You started self-correcting mid-turn ("${updatedSentence.slice(0, 120)}"). ` +
                      `That's confusing for the student to hear. Re-emit your response cleanly: ` +
                      `recompute the answer first, then speak ONLY the correct version. ` +
                      `Do not narrate your own confusion or backtrack out loud.`;
                    rejectionsThisAttempt.push({ action: 'mid_turn_self_correction', reason });
                    judgeRetriesUsed++;
                    await performKill();
                    console.warn('[brain-orchestrator] mid-turn self-correction detected — retrying:', updatedSentence.slice(0, 80));
                    onDebugEvent?.('self_correction_retry', updatedSentence.slice(0, 80));
                    continue;
                  }
                  // Deterministic arithmetic-claim check (2026-07-24, the
                  // "$18 - 3$ isn't $15$" incident): the brain denied the
                  // student's CORRECT subtraction; the LLM judge flagged it
                  // with kill severity but Pillar 2b downgraded it to
                  // advisory (LLM kills were retired for false positives).
                  // This check is pure arithmetic — no LLM, no false-
                  // positive class — so it may kill. Fires on any attempt
                  // (a retry that re-asserts false arithmetic is just as
                  // wrong; a retry ACKNOWLEDGING the error states TRUE
                  // arithmetic and passes), capped by judgeRetriesUsed.
                  if (!attemptKilled && judgeRetriesUsed < MAX_JUDGE_RETRIES) {
                    const arith = checkArithmeticClaims(updatedSentence);
                    if (arith.verdict !== 'ok') {
                      const reason =
                        arith.verdict === 'false_denial'
                          ? `You denied correct arithmetic: "${arith.claim}" is wrong — in fact ${arith.correct}. ` +
                            `The student's answer may have been RIGHT. Recompute, and if their answer matches ${arith.correct}, affirm it plainly.`
                          : `You asserted incorrect arithmetic: "${arith.claim}" is false — in fact ${arith.correct}. ` +
                            `Recompute and re-emit your response with the corrected value.`;
                      rejectionsThisAttempt.push({ action: 'false_arithmetic_claim', reason });
                      judgeRetriesUsed++;
                      await performKill();
                      console.warn(`[brain-orchestrator] deterministic arithmetic check: ${arith.verdict} in "${updatedSentence.slice(0, 80)}" (${arith.correct}) — kill + retry`);
                      onDebugEvent?.('arith_claim_kill', `${arith.verdict}: ${arith.claim ?? '?'} → ${arith.correct ?? '?'}`);
                      continue;
                    }
                  }
                  // Round-7+ Fix 5: contradiction-inversion within a
                  // single sentence ("not quite right ... actually
                  // correct" / "wrong ... you're right"). The brain
                  // misjudges the student's answer, then walks the
                  // judgment back inside the same utterance. The student
                  // hears "you're wrong — actually you're correct" which
                  // is worse than just saying "correct" outright. Treat
                  // as a self-correction signal: kill the rest of the
                  // attempt and retry. Narrow regex on the inversion
                  // pattern only — broader catches would false-positive
                  // on legit "not exactly, but close" clarifications.
                  const contradictionInversionRe = /\b(?:not (?:quite|exactly|really)?\s*right|that'?s?\s+(?:not|wrong)|wrong)\b[\s\S]{0,80}?\b(?:actually (?:correct|right)|you'?re (?:actually )?(?:correct|right)|that'?s (?:actually )?(?:correct|right))/i;
                  // Same gate as selfCorrectionRe above — only fire on
                  // attempt 0. Retry attempts that contain "wrong …
                  // actually right" patterns are typically the brain
                  // re-grounding after a judge KILL, not a confused
                  // mid-utterance flip.
                  if (!attemptKilled && attempt === 0 && judgeRetriesUsed < MAX_JUDGE_RETRIES && contradictionInversionRe.test(updatedSentence)) {
                    const reason =
                      `Your sentence contradicts itself: "${updatedSentence.slice(0, 160)}". ` +
                      `You started by saying the answer was wrong, then immediately said it was correct. ` +
                      `Decide BEFORE you speak whether the student's answer is right or wrong, and speak only that single judgment. ` +
                      `Re-emit cleanly: if the answer is correct, affirm it directly. If it is wrong, explain what's wrong without an immediate reversal.`;
                    rejectionsThisAttempt.push({ action: 'contradiction_inversion', reason });
                    judgeRetriesUsed++;
                    await performKill();
                    console.warn('[brain-orchestrator] contradiction-inversion detected — retrying:', updatedSentence.slice(0, 80));
                    onDebugEvent?.('contradiction_inversion_retry', updatedSentence.slice(0, 80));
                    continue;
                  }
                  // Round-15 Issue 2 (2026-07-16): CROSS-SENTENCE
                  // contradiction against the HELD verdict. The single-
                  // sentence inversion regex above misses the live-test
                  // failure shape — "Not quite." as its own sentence (no
                  // trailing "right", so the first branch never matches),
                  // the reversal ("…is actually right") in a LATER
                  // sentence. While the verdict hold is buffering
                  // (pre-audio), test the held verdict + this sentence
                  // combined with a wider pattern: bare negation opener
                  // allowed, affirmation branch kept EXPLICIT ("you're
                  // right" / "that's it" / "actually correct" — NOT bare
                  // "<subject> is right", which would false-kill partial-
                  // credit feedback like "Your setup is right, but…"). A
                  // match kills BEFORE the verdict was ever voiced, so
                  // the retry's settled judgment is the only thing the
                  // student hears — no more "Not qu—" audio chop.
                  const crossSentenceInversionRe = /\b(?:not\s+(?:quite|exactly|really|right|correct)|that'?s?\s+(?:not|wrong)|nope|wrong)\b[\s\S]{0,160}?\b(?:actually\s+(?:correct|right)|you(?:'re|\s+are|\s+were)\s+(?:actually\s+)?(?:correct|right)|that'?s\s+(?:actually\s+)?(?:correct|right|exactly\s+it|it)\b|you\s+(?:got|had)\s+it\b|(?:is|was)\s+actually\s+(?:right|correct)|spot\s+on\b|bingo\b)/i;
                  if (!attemptKilled && attempt === 0 && judgeRetriesUsed < MAX_JUDGE_RETRIES && verdictHoldActive
                      && crossSentenceInversionRe.test(`${verdictHeldText} ${updatedSentence}`)) {
                    const reason =
                      `Your response contradicts itself across sentences: you opened with "${verdictHeldText.slice(0, 100)}" and then said "${updatedSentence.slice(0, 120)}". ` +
                      `Decide BEFORE you speak whether the student's answer is right or wrong, and speak only that single settled judgment. ` +
                      `Re-emit cleanly: if the answer is correct, affirm it directly. If it is wrong, explain what's wrong without reversing yourself.`;
                    rejectionsThisAttempt.push({ action: 'contradiction_inversion', reason });
                    judgeRetriesUsed++;
                    await performKill();
                    console.warn('[brain-orchestrator] cross-sentence contradiction vs held verdict — retrying:', `held="${verdictHeldText.slice(0, 60)}" now="${updatedSentence.slice(0, 60)}"`);
                    onDebugEvent?.('contradiction_inversion_retry', `held="${verdictHeldText.slice(0, 40)}" + "${updatedSentence.slice(0, 40)}"`);
                    continue;
                  }
                  // Live round 5 (2026-07-23, session-1784778855564): praise +
                  // value-reveal to a NON-answer ("Oh, okay." → "Exactly.4
                  // meters per second squared"). The per-turn <verdict_guard>
                  // was attached and the model blew through it under praise-
                  // opener momentum — this is the deterministic backstop, same
                  // tier as the contradiction-inversion kill above. Narrow by
                  // construction (closed ack-phrase list + praise-then-digit
                  // shape); see nonanswer-praise.ts.
                  const nonAnswerTextSoFar = (attemptText ? attemptText + ' ' : '') + updatedSentence;
                  if (!attemptKilled && attempt === 0 && judgeRetriesUsed < MAX_JUDGE_RETRIES && shouldKillNonAnswerPraise(transcript, nonAnswerTextSoFar)) {
                    rejectionsThisAttempt.push({ action: 'nonanswer_praise', reason: nonAnswerPraiseFeedback(transcript) });
                    judgeRetriesUsed++;
                    await performKill();
                    console.warn('[brain-orchestrator] praise+reveal to a non-answer — retrying:', `student="${transcript.slice(0, 40)}" text="${nonAnswerTextSoFar.slice(0, 60)}"`);
                    onDebugEvent?.('nonanswer_praise_retry', `student="${transcript.slice(0, 30)}" → "${nonAnswerTextSoFar.slice(0, 50)}"`);
                    continue;
                  }
                  // Round-7++ meta-narration filter. The system prompt
                  // already forbids speaking internal reasoning ("the
                  // student said X — that's a greenlight to advance",
                  // "let me mark this segment complete", "the active
                  // problem is …"), but Sonnet still leaks meta
                  // sentences regularly — observed 2026-05-03 session:
                  // brain spoke "The student already solved this one —
                  // 16 is correct for {12, 14, 16, 18, 20}." and "Let
                  // me check — the *active* problem is the dataset
                  // {2, 4, 6, 8, 10}." Soft prompt rules are not
                  // enough; orchestrator-side filtering is the safety
                  // net. Detect canonical leak patterns and drop the
                  // sentence from TTS + transcript without retrying.
                  // Generic patterns only — no subject content.
                  const metaNarrationRe = /^\s*(?:the student\b|the active problem\b|let me mark\b|since the student\b|the runtime\b|the system\b|that'?s? a greenlight\b)/i
                    .test(updatedSentence)
                    || /\bactive problem\b|\bgreenlight to advance\b|\bmark (?:it|this|the)? *(?:segment )?complete\b|\b(?:current|active) *segment\s*[Ii][Dd]?\b|\bcanonicaltext\b|\btool[_ ]result\b/i
                    .test(updatedSentence);
                  if (metaNarrationRe) {
                    console.warn('[brain-orchestrator] dropped meta-narration sentence:', JSON.stringify(updatedSentence.slice(0, 100)));
                    onDebugEvent?.('meta_narration_dropped', updatedSentence.slice(0, 80));
                    continue;
                  }
                  // Ghost-step filter. If the brain narrates "Step N"
                  // / "step three" / "in step 2" but no equation
                  // labeled "Step N…" has been emitted on the current
                  // page, the sentence is referring to a step that
                  // doesn't exist on the board — a generic-template
                  // leak from a different problem. Drop the sentence
                  // and continue, so the next sentence (if any) can
                  // recover. Generic regex; no subject content.
                  const stepRefRe = /\bstep\s+(?:(\d+)|one|two|three|four|five|six|seven|eight|nine)\b/i;
                  const stepRefMatch = stepRefRe.exec(updatedSentence);
                  if (stepRefMatch) {
                    const wordToNum: Record<string, number> = {
                      one: 1, two: 2, three: 3, four: 4, five: 5,
                      six: 6, seven: 7, eight: 8, nine: 9,
                    };
                    const n = stepRefMatch[1]
                      ? Number(stepRefMatch[1])
                      : (wordToNum[stepRefMatch[0].split(/\s+/).pop()!.toLowerCase()] ?? NaN);
                    if (Number.isFinite(n) && !stepsEmittedOnCurrentPageRef.current.has(n)) {
                      console.warn(`[brain-orchestrator] dropped ghost-step sentence (Step ${n} not yet on board):`, JSON.stringify(updatedSentence.slice(0, 100)));
                      onDebugEvent?.('ghost_step_dropped', `Step ${n} referenced but no labeled card emitted on current page`);
                      continue;
                    }
                  }
                  // Round-7++++ Fix Issue 8: bridge / disclaimer
                  // phrase rotation. Sonnet defaults to the SAME hedged
                  // pre-tool bridge ("Let me see what I have for you")
                  // and the SAME post-tool disclaimer opener ("Off the
                  // top of my head, not from the standard bank...")
                  // turn after turn — observed 5/7 turns in 2026-05-04
                  // session. The system-prompt rotation rule is weak;
                  // orchestrator-side rewrite is the safety net.
                  // Detect a sentence that matches a known bridge /
                  // disclaimer pattern; if it's identical (normalized)
                  // to the LAST one used, swap to a different option
                  // from the pool before TTS.
                  const bridgePool = [
                    // 'One sec — ...' dropped 2026-05-04: TTS in math
                    // contexts pronounces "sec" as the trig function
                    // "secant".
                    'Let me see what I have for you.',
                    'Looking for a good one for you.',
                    'Let me grab something.',
                    'Hold on — picking one out.',
                    'Searching for a good fit.',
                    'On it — checking the bank.',
                  ];
                  const disclaimerPool = [
                    'Off the top of my head — here\'s one for you.',
                    'Quick one I\'ll cook up — try this:',
                    'Let me sketch a fresh one for you.',
                    'Improvising — here\'s one to try:',
                    'Made one up on the spot — here you go.',
                    'Off the top of my head, not from the standard bank — here\'s one for you.',
                  ];
                  const sentenceNorm = updatedSentence.trim().toLowerCase().replace(/\s+/g, ' ');
                  const matchesBridge = /^(let me see what i have|one sec|looking for a good|let me grab|hold on|searching for|on it).{0,60}$/i
                    .test(updatedSentence.trim());
                  const matchesDisclaimer = /^(off the top of my head|quick one i'?ll cook up|let me sketch a fresh|improvising|made one up on the spot)/i
                    .test(updatedSentence.trim());
                  if (matchesBridge && lastBridgePhraseRef.current === sentenceNorm) {
                    // Pick a different one from the pool.
                    const alternatives = bridgePool.filter((p) => p.toLowerCase().replace(/\s+/g, ' ') !== sentenceNorm);
                    const swap = alternatives[Math.floor(Math.random() * alternatives.length)];
                    console.log(`[brain-orchestrator] bridge phrase repeat — swapping "${updatedSentence.slice(0, 50)}…" → "${swap}"`);
                    onDebugEvent?.('bridge_phrase_swapped', `→ ${swap}`);
                    (ev as { text?: string }).text = swap;
                    lastBridgePhraseRef.current = swap.toLowerCase().replace(/\s+/g, ' ');
                  } else if (matchesBridge) {
                    lastBridgePhraseRef.current = sentenceNorm;
                  }
                  if (matchesDisclaimer && lastDisclaimerPhraseRef.current === sentenceNorm) {
                    const alternatives = disclaimerPool.filter((p) => p.toLowerCase().replace(/\s+/g, ' ') !== sentenceNorm);
                    const swap = alternatives[Math.floor(Math.random() * alternatives.length)];
                    console.log(`[brain-orchestrator] disclaimer repeat — swapping "${updatedSentence.slice(0, 50)}…" → "${swap}"`);
                    onDebugEvent?.('disclaimer_phrase_swapped', `→ ${swap}`);
                    (ev as { text?: string }).text = swap;
                    lastDisclaimerPhraseRef.current = swap.toLowerCase().replace(/\s+/g, ' ');
                  } else if (matchesDisclaimer) {
                    lastDisclaimerPhraseRef.current = sentenceNorm;
                  }
                  // Re-read the (possibly swapped) sentence text.
                  const finalSentence = (ev.text as string) || updatedSentence;
                  // Round-7+ Fix 4: verbatim-sentence dedup within turn.
                  // Skip TTS + transcript add when this exact sentence
                  // already played this turn AND it has ≥4 words. Avoids
                  // false-positive drops of legit short echoes.
                  const dedupNorm = normalizeForDedup(finalSentence);
                  const wordCount = dedupNorm ? dedupNorm.split(/\s+/).filter(Boolean).length : 0;
                  // Judge-kill Stage 3.1 (2026-06-16): suppress this cross-turn
                  // dedup while a resume is armed. A post-kill RESTATEMENT retry
                  // re-delivers the killed content verbatim, so every sentence
                  // trips this dedup and `continue`s out BEFORE reaching
                  // emitBrainSpeak. That starves the resume hold —
                  // resumeHeldText stays empty, so decideResume misclassifies
                  // the restatement as "diverged" and DISCARDS the snapshot,
                  // leaving the unplayed tail never spoken (silent retry +
                  // status stuck on "Click to speak", observed 2026-06-16 SAT
                  // session via __tutorForceKill). It also empties the retry's
                  // fresh chat entry (the killed attempt's was already removed
                  // on retry). While resumeArmed, let emitBrainSpeak own the
                  // hold/decision instead: a restatement suppresses this retry's
                  // audio (the snapshot supplies it) and a correction speaks
                  // live — neither double-speaks, so the dedup adds no value here.
                  if (wordCount >= 4 && sentencesSpokenThisTurn.has(dedupNorm) && !resumeArmed) {
                    console.log('[brain-orchestrator] dropped duplicate sentence:', JSON.stringify(updatedSentence.slice(0, 80)));
                    onDebugEvent?.('duplicate_sentence_dropped', updatedSentence.slice(0, 80));
                    continue;
                  }
                  // Only record sentences the student actually HEARD. A killed
                  // attempt keeps streaming after performKill (gated from audio
                  // by the `if (!attemptKilled)` block below), so its post-kill
                  // sentences were never spoken — adding them here would make
                  // the dedup drop them on the re-delivery retry, silencing
                  // them for good (observed 2026-06-16 JEE session: the kill's
                  // tail=0 path armed no resume, so the retry's verbatim
                  // "What do you think the slope…?" matched a gated attempt-0
                  // emission and was dropped — the student never heard the
                  // question). Gating the add on !attemptKilled keeps the
                  // within-turn duplicate guard for real double-emissions while
                  // letting a post-kill retry re-speak content that was cut off.
                  if (wordCount >= 4 && !attemptKilled) sentencesSpokenThisTurn.add(dedupNorm);
                  totalSentenceCount++;
                  totalWordCount += wordCount;
                  if (firstSentenceMs === null) firstSentenceMs = Date.now() - t0;
                  turnLatencyRef.current?.mark('firstSentence', Date.now());
                  // Phase 2: brain sentence-0 arrived — a pending ack is now
                  // redundant (fire-time guard would refuse anyway).
                  if (ackTimerRef.current) { clearTimeout(ackTimerRef.current); ackTimerRef.current = null; }
                  if (escalationTimerRef.current) { clearInterval(escalationTimerRef.current); escalationTimerRef.current = null; }
                  // KEEP markdown emphasis (*word*, **strong**) in the
                  // chat-bound text so TranscriptView can render it as
                  // italic / bold. Strip ONLY for TTS — the speaking
                  // layer doesn't need or want the asterisks.
                  // Use finalSentence so the bridge/disclaimer rotation
                  // swap (Fix Issue 8 above) is reflected in both
                  // chat-bound text AND TTS.
                  const trimmedSentence = finalSentence.trim();
                  // TTS-only normalization. The chat-bound text keeps the
                  // brain's punctuation (exclamation marks for emphasis,
                  // em-dashes for parenthetical clauses) so the transcript
                  // reads naturally. The spoken layer drops these because:
                  //   - Exclamation marks make the TTS voice sound forced
                  //     and over-enthusiastic ("Great work!" → "Great work.").
                  //   - Em-dashes make the voice run on without the natural
                  //     pause a comma gives, so the speech feels rushed
                  //     ("Right — a sub 1 is the first" → "Right, a sub 1
                  //     is the first").
                  const sentenceForSpeech = trimmedSentence
                    .replace(/\*\*([^*]+)\*\*/g, '$1')
                    .replace(/\*([^*]+)\*/g, '$1')
                    .replace(/!+/g, '.')
                    .replace(/\s*[—–]\s*/g, ', ')
                    .replace(/\s--+\s/g, ', ')
                    // Combining macron over a letter/digit is the brain's
                    // mean notation ("x̄"). Sent to TTS raw, the malformed
                    // grapheme is dropped or mangled (observed 2026-06-16 IB
                    // AA session: "x̄ = 6" reached the speaker as bare "x").
                    // Verbalize as "x bar", then strip any other stray
                    // combining marks (U+0300–U+036F) so they can't corrupt
                    // the spoken token.
                    .replace(/([A-Za-z0-9])\u0304/g, '$1 bar')
                    .replace(/[\u0300-\u036F]/g, '');
                  attemptText += (attemptText ? ' ' : '') + trimmedSentence;
                  // Detect brain narration that signals the pipeline
                  // returned no_problem_available. Generic patterns —
                  // any utterance roughly meaning "I have nothing
                  // appropriate to source for this anchor" sets the
                  // session-scoped flag. Used by dedup-rejection
                  // feedback to gate the recovery options (don't tell
                  // the brain to retry generate_problem when the
                  // bank's already known to be exhausted).
                  if (!noProblemAvailableObservedRef.current
                    && /\b(?:don'?t have a clean follow[- ]up|no clean follow[- ]up|bank.{0,30}(?:tapped out|exhausted|empty)|no (?:more )?(?:fresh|relevant|new) problems?\b|exhausted|no problem available)\b/i.test(trimmedSentence)) {
                    noProblemAvailableObservedRef.current = true;
                    onDebugEvent?.('no_problem_available_observed', trimmedSentence.slice(0, 100));
                  }
                  if (!attemptKilled) {
                    // Validate-before-speak chat gating: record this sentence
                    // for the chat bubble ONLY while the attempt is alive.
                    // Post-kill sentences (attemptKilled=true) skip this, so
                    // they never appear in chat — the bubble freezes at the
                    // voiced content and the retry replaces it (no flash of
                    // wrong/post-kill text). Mirrors the attemptText concat.
                    chatRevealText += (chatRevealText ? ' ' : '') + trimmedSentence;
                    // Caption word-sync: pair the display form with the speech
                    // form the audio layer will report back. Registered only
                    // while the attempt is alive — post-kill sentences never
                    // reach TTS, so the caption freezes at voiced content.
                    captionSyncRef.current.registerSentence(sentenceForSpeech, trimmedSentence);
                    // FIX A — fast opener. The brain is prompted to open
                    // every turn with a short content-free runway phrase
                    // (TURN_OPENER_RULE). Voice that sentence-0 the moment
                    // it arrives — bypassing the TTS gate — WITHOUT opening
                    // the gate, so sentences 1+ stay buffered until the
                    // first tool dispatch resolves. The opener is retry-
                    // safe by construction (isSafeOpener re-gates anything
                    // that looks substantive), so a doomed-then-retried
                    // turn never lets the student hear two voices of
                    // CONTENT. Restricted to attempt 0 (retries already
                    // played a bridge / silence — avoids opener cascades)
                    // and to non-Skip turns (a real Skip turn with FIX B
                    // off must keep #4's silent-drop on a botched skip).
                    // Round-15 Issue 2: a verdict is NOT a content-free
                    // runway phrase, even though it passes isSafeOpener
                    // (short, no digits/operators/question — "Not quite."
                    // and "Spot on." both qualify). Voicing it ungated is
                    // exactly the speak-then-kill window; route it through
                    // the gate + verdict hold instead.
                    const fastOpenerEligible =
                      TUTOR_BRAIN_FAST_OPENER &&
                      attempt === 0 &&
                      !skipTurnMarkerPresent &&
                      totalSentenceCount === 1 &&
                      gateState === 'gated' &&
                      isSafeOpener(trimmedSentence) &&
                      !isVerdictOpener(trimmedSentence);
                    if (fastOpenerEligible) {
                      if (speakTextGated()) {
                        console.warn('[brain-orchestrator] STAGE-3 fix #10: fast-opener dropped — perception cancel gate active:', sentenceForSpeech.slice(0, 80));
                        onDebugEvent?.('speak_text_gated_opener', sentenceForSpeech.slice(0, 80));
                      } else {
                        const openerScriptId = pushTtsScriptForPerception(sentenceForSpeech);
                        speakTextRef.current?.(sentenceForSpeech, openerScriptId);
                        audibleSentenceCount++;
                        // Render↔speech sync: count the fast-opener too (it
                        // bypasses speakOne but still reaches the speaker).
                        ttsDispatchedCountRef.current++;
                        turnLatencyRef.current?.mark('firstTtsFetch', Date.now());
                      }
                    } else if (gateState === 'gated') {
                      if (vbsRolling) {
                        // Rolling-hold = 1-DEEP lookahead. Hold AT MOST one
                        // sentence. A new sentence means the previously-held
                        // one is now safe (no rejecting tool arrived between
                        // it and this one), so release it BEFORE buffering
                        // the new one. This keeps TTS flowing one sentence at
                        // a time at the normal cadence — NOT accumulated into
                        // a burst-flush (the 2026-06-20 "one word at a time"
                        // stutter, Console7). A rejecting tool still drops
                        // this single held sentence via closeGate; the cap
                        // flushes it if no successor/tool arrives.
                        if (pendingSentences.length > 0) flushPending();
                        pendingSentences.push(sentenceForSpeech);
                        armVbsCap();
                      } else {
                        // Pre-first-tool turn-open hold (unchanged): the
                        // gateTimer owns the flush; these flush together when
                        // the first tool validates (typically 1-2 sentences).
                        pendingSentences.push(sentenceForSpeech);
                      }
                    } else if (gateState === 'open') {
                      // Routes through the perception cancel gate AND the
                      // judge-kill Stage 3.1 resume hold/decision.
                      emitBrainSpeak(sentenceForSpeech);
                    }
                  }
                  // Streaming reveal in the chat: incrementally append
                  // each sentence to a tutor entry so the student sees
                  // the response materialize as it's being composed,
                  // not all at once at the end.
                  //
                  // The id is per-ATTEMPT, not per-turn — when judge or
                  // RULE8 retry fires, the old attempt's entry is
                  // removed (see retry-cleanup below) and the new
                  // attempt creates its own entry. Without the attempt
                  // suffix, retries collided on a shared
                  // `tutor-streaming-${t0}` key and React threw
                  // "Encountered two children with the same key"
                  // (observed 2026-04-29 algebra session, 3 duplicate
                  // renders during a judge retry).
                  // Stable per-attempt id. Used as the React key in
                  // TranscriptView; we DON'T rename it on finalization
                  // (just clear `streaming`), so the chat bubble keeps
                  // the same key across the streaming → final transition
                  // and React doesn't unmount/remount it (which produced
                  // visible flicker before 2026-04-29).
                  const streamingId = `tutor-streaming-${t0}-${attempt}`;
                  // Validate-before-speak: reveal only pre-kill content in the
                  // bubble (chatRevealText) when the flag is on; else the full
                  // accumulated attemptText (today's behavior). Always
                  // non-empty by the time we reveal (the first sentence is
                  // pre-kill), so no empty-bubble guard needed.
                  const revealText = TUTOR_VALIDATE_BEFORE_SPEAK ? chatRevealText : attemptText;
                  // Locate ANY existing entry with this streaming id —
                  // not just the last one. If a user turn (e.g. typed
                  // input) lands BETWEEN two of our sentence events,
                  // the last-only check sees the user entry, fails to
                  // match, and pushes a NEW streaming entry with the
                  // SAME id as the prior one. Two entries → React
                  // duplicate-key warning ("Encountered two children
                  // with the same key, tutor-streaming-...") — exact
                  // failure mode in the 2026-05-02 typed-input session
                  // which spammed the server log with the warning and
                  // produced 4-5 duplicate chat bubbles for one turn.
                  const existingIdx = transcriptRef.current.findIndex(
                    (e) => e.id === streamingId
                  );
                  if (existingIdx >= 0) {
                    const existing = transcriptRef.current[existingIdx];
                    transcriptRef.current = [
                      ...transcriptRef.current.slice(0, existingIdx),
                      { ...existing, text: revealText, streaming: true },
                      ...transcriptRef.current.slice(existingIdx + 1),
                    ];
                  } else {
                    // A retry bubble is now appearing — drop any dimmed
                    // ("revising") bubbles from THIS turn that the kill left in
                    // place for the hand-off, so the fresh bubble replaces them
                    // smoothly instead of stacking beside them.
                    const turnStreamingPrefix = `tutor-streaming-${t0}-`;
                    transcriptRef.current = [
                      ...transcriptRef.current.filter(
                        (e) => !(e.revising && typeof e.id === 'string' && e.id.startsWith(turnStreamingPrefix)),
                      ),
                      {
                        id: streamingId,
                        timestamp: new Date(),
                        role: 'tutor',
                        text: revealText,
                        streaming: true,
                      } as TranscriptEntry,
                    ];
                    // Signal that a streaming bubble is now visible so
                    // the typing indicator can hide itself.
                    setStreamingEntryActive(true);
                  }
                  onTranscriptUpdate([...transcriptRef.current]);
                } else if (ev.type === 'generated-problem') {
                  // 2026-07-17 expectedAnswer pin: generate_problem resolved
                  // server-side. Stash the canonicalText + verified answer;
                  // the follow-up show_problem dispatch attaches it to
                  // currentProblemRef (see the tracked-problem site), from
                  // where it rides every later turn's <active_problem>.
                  const st = typeof ev.statement === 'string' ? ev.statement : '';
                  if (st) {
                    generatedProblemReceivedThisAttempt = true;
                    const expAns = typeof ev.expectedAnswer === 'string' ? ev.expectedAnswer : undefined;
                    // Late-pin robustness (Round-17): if the matching card is
                    // ALREADY the tracked problem (event arrived after the
                    // render), attach directly; else stage for the render.
                    const normWs = (s: string) => s.replace(/\s+/g, ' ').trim();
                    if (currentProblemRef.current && normWs(currentProblemRef.current.statement) === normWs(st)) {
                      currentProblemRef.current.expectedAnswer = expAns;
                      onDebugEvent?.('expected_answer_pinned', (expAns ?? '').slice(0, 60));
                    } else {
                      pendingGeneratedAnswerRef.current = { statement: st, expectedAnswer: expAns };
                    }
                    onDebugEvent?.('generated_problem_received', st.slice(0, 60));
                  }
                } else if (ev.type === 'pause') {
                  // P-02 comprehension pause. The brain or the engine asked
                  // us to wait before voicing the next sentence so the
                  // student can read what just landed on the board / let
                  // a key idea settle. Honored only when this attempt is
                  // still alive — a killed attempt skips its tail anyway.
                  if (!attemptKilled) {
                    const ms = Math.max(0, Math.min(4000, (ev.ms as number) || 0));
                    if (ms > 0) await new Promise((r) => setTimeout(r, ms));
                  }
                } else if (ev.type === 'tool-call') {
                  let name = ev.name as string;
                  let args = (ev.args as Record<string, unknown>) || {};
                  if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
                    // Dev-only RAW tool-call capture for the render-harness fixture
                    // harvester (scripts/tutor-render-harness/harvest.ts). Captured
                    // here, before any prescribed-render substitution mutates name/args.
                    const w = window as unknown as { __tutorToolCalls?: Array<{ name: string; args: Record<string, unknown> }> };
                    (w.__tutorToolCalls ||= []).push({ name, args });
                  }
                  toolNamesThisAttempt.push(name);
                  toolArgsThisAttempt.push(args);
                  // Round-17 (2026-07-17): improvised / student-brought
                  // answer verification. The tool contract has the brain
                  // declare its derived answer on any free-form
                  // show_problem. Capture + STRIP it here — it must never
                  // reach the renderer, board persistence, or the PDF
                  // export — then blind-solve server-side (the solver never
                  // sees the claim). On agreement, pin via the same
                  // expectedAnswer machinery pipeline problems use: late-pin
                  // if the card is already tracked by the time the ~1-3s
                  // verification returns (the normal case), else stage in
                  // pendingGeneratedAnswerRef for the render (kill/retry
                  // case). On mismatch nothing is pinned — a single-solve
                  // disagreement trusts neither answer — but the divergence
                  // is logged as an early warning that the brain may be
                  // about to mis-grade.
                  if ((name === 'show_problem' || name === 'show_equation') && typeof (args as Record<string, unknown>).expectedAnswer === 'string') {
                    const claimedAnswer = String((args as Record<string, unknown>).expectedAnswer).trim();
                    // Round-19: the show_equation path (the brain often
                    // renders a student-brought problem as an equation card
                    // rather than a problem card) verifies against the
                    // ACTIVE problem's statement — that's what grading will
                    // run against — falling back to the card's latex.
                    const claimedStatement = name === 'show_problem'
                      ? (typeof (args as Record<string, unknown>).statement === 'string'
                          ? String((args as Record<string, unknown>).statement).trim() : '')
                      : ((currentProblemRef.current?.statement
                          ?? (typeof (args as Record<string, unknown>).latex === 'string' ? String((args as Record<string, unknown>).latex) : ''))).trim();
                    delete (args as Record<string, unknown>).expectedAnswer;
                    if (claimedAnswer && claimedStatement) {
                      onDebugEvent?.('improvised_answer_verifying', claimedAnswer.slice(0, 40));
                      // Round-17b: pass MCQ choices so the blind solver can
                      // answer with a letter (without them it answered the
                      // correct choice's text — a false mismatch vs "D").
                      const rawChoices = (args as Record<string, unknown>).answerChoices;
                      const verifyChoices = Array.isArray(rawChoices)
                        ? rawChoices
                            .filter((c): c is { letter: string; text: string } =>
                              !!c && typeof (c as { letter?: unknown }).letter === 'string' && typeof (c as { text?: unknown }).text === 'string')
                            .map((c) => ({ letter: c.letter, text: c.text }))
                        : undefined;
                      void fetch('/api/tutor/verify-answer', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ statement: claimedStatement, claimedAnswer, choices: verifyChoices }),
                      })
                        .then((r) => (r.ok ? r.json() : null))
                        .then((v: { agree?: boolean; solved?: string } | null) => {
                          if (!v) return;
                          if (v.agree === true) {
                            const normWs = (s: string) => s.replace(/\s+/g, ' ').trim();
                            if (currentProblemRef.current && normWs(currentProblemRef.current.statement) === normWs(claimedStatement)) {
                              currentProblemRef.current.expectedAnswer = claimedAnswer;
                            } else {
                              pendingGeneratedAnswerRef.current = { statement: claimedStatement, expectedAnswer: claimedAnswer };
                            }
                            console.log('[VoiceTutorRealtime] improvised answer VERIFIED + pinned:', claimedAnswer.slice(0, 60));
                            onDebugEvent?.('improvised_answer_verified', claimedAnswer.slice(0, 60));
                          } else {
                            console.warn(`[VoiceTutorRealtime] improvised answer MISMATCH — claimed "${claimedAnswer.slice(0, 60)}" vs blind solve "${(v.solved ?? '').slice(0, 60)}" — nothing pinned.`);
                            onDebugEvent?.('improvised_answer_mismatch', `claimed="${claimedAnswer.slice(0, 40)}" solved="${(v.solved ?? '').slice(0, 40)}"`);
                          }
                        })
                        .catch(() => { /* verification is best-effort */ });
                    }
                  }
                  totalToolNamesSeen.push(name);
                  // #4: a Skip turn that actually advances is a legit
                  // "moving on" response — open the held gate the moment
                  // advance_lesson / generate_problem dispatches so the
                  // brief acknowledgement speaks in real time instead of
                  // buffering to stream-end. (generate_problem also opens
                  // the gate via its own handler below; advance_lesson
                  // otherwise wouldn't, since the skip-turn render-tool
                  // open is suppressed.)
                  if (
                    skipTurnMarkerPresent &&
                    (name === 'advance_lesson' || name === 'generate_problem') &&
                    gateState === 'gated'
                  ) {
                    clearTimeout(gateTimer);
                    openGate();
                  }
                  // Item B (2026-05-24) — capture pre-advance render
                  // count before this lesson-control tool dispatches.
                  // Snapshot only once per attempt (first advance wins);
                  // a later generate_problem in the same attempt is part
                  // of the new-segment work and shouldn't move the line.
                  if (
                    (name === 'advance_lesson' || name === 'generate_problem') &&
                    renderCountAtAdvance === null
                  ) {
                    renderCountAtAdvance = renderIdsThisAttempt.length;
                  }
                  // Mark brain-emitted new_page on event ARRIVAL (before
                  // any downstream stripping by the same-context guard).
                  // Used by the divergence guard + silent-substitute
                  // bypass to recognize topic-switch intent even when
                  // the new_page command never reaches the renderer.
                  if (name === 'new_page') {
                    brainEmittedNewPageThisTurnRef.current = true;
                  }
                  // prescribedRender contract enforcement. When the
                  // current segment carries a `prescribedRender` field
                  // and the brain emits the matching tool, deep-equal
                  // the params against the authored prescription. On
                  // mismatch, push a validator rejection so the brain
                  // retries with the prescribed params. Built 2026-05-14
                  // after Phase 5 stress session showed the brain
                  // freelancing a 9-node BST instead of the teacherNote-
                  // prescribed 6-node example, with no enforcement.
                  // teacherNote alone is guidance; this is the contract.
                  {
                    const plan = lessonPlanRef.current;
                    const segId = currentSegmentIdRef.current;
                    if (plan && segId) {
                      const seg = getSegment(plan, segId);
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      const prescribed = (seg as any)?.prescribedRender as
                        | { tool: string; params: Record<string, unknown> }
                        | undefined;
                      // Bypass conditions — when these fire, the brain is
                      // legitimately moving past the prescribed render
                      // (improvising via generate_problem fallback, opening
                      // a fresh page, or working on a segment that's
                      // already complete). Observed 2026-05-15 session:
                      // after try-yourself completed, "try another
                      // practice problem" triggered generate_problem →
                      // no_problem_available → brain improvises
                      // show_problem → prescribedRender mis-fired → retry
                      // cascade → MAX_VALIDATOR_RETRIES → stuck. Mirrors
                      // the existing show_problem_target_divergence
                      // bypass for new_page-in-batch.
                      const segCompleted = completedSegmentIdsRef.current.has(segId);
                      const bypassPrescribed =
                        generateProblemThisTurnRef.current ||
                        brainEmittedNewPageThisTurnRef.current ||
                        segCompleted;
                      if (prescribed && !bypassPrescribed) {
                        const isShowTool = /^show[A-Z]/.test(name);
                        // toolNamesThisAttempt already includes `name` at
                        // this point (pushed earlier in the loop), so
                        // slice(0, -1) checks emissions BEFORE the current.
                        const prescribedEmittedEarlier = toolNamesThisAttempt
                          .slice(0, -1)
                          .some((n) => n === prescribed.tool);
                        // Case A — matching tool, wrong params.
                        if (
                          prescribed.tool === name &&
                          !deepEqualParams(args, prescribed.params)
                        ) {
                          // Pillar 1 (silent substitution): the orchestrator
                          // owns the authored prescription verbatim, so swap
                          // the brain's deviating params for the prescribed
                          // ones and dispatch — instead of killing + a
                          // 3-8s retry. The prescribed render is the
                          // segment's pinned teaching artifact and the
                          // brain's narration is about that artifact, so the
                          // board now matches both the script and the
                          // narration. Mirrors the show_worked_example /
                          // show_problem auto-substitute pattern.
                          const emittedJson = JSON.stringify(args);
                          args = prescribed.params;
                          console.warn(
                            `[brain-orchestrator] prescribedRender mismatch for segment "${segId}", tool "${name}" — auto-substituting prescribed params (no kill). Emitted=${emittedJson.slice(0, 120)}…`,
                          );
                          onDebugEvent?.(
                            'prescribed_render_substituted',
                            `segId="${segId}" tool=${name} (params swapped)`,
                          );
                        }
                        // Case B — wrong tool entirely (and prescribed
                        // hasn't fired yet in this attempt). Brain emitted
                        // a different show_* before the prescribed one.
                        // Observed 2026-05-15 session #5: BST segment with
                        // prescribed show_diagram(binary_tree) — brain
                        // emitted show_geometry_constructed first
                        // (different tool name, so Case A above didn't
                        // fire). The geometry tree rendered, then later
                        // the prescribed show_diagram rendered too — two
                        // trees on the page. Force the brain to emit
                        // the prescribed tool BEFORE any other show_*
                        // on this segment.
                        if (
                          isShowTool &&
                          prescribed.tool !== name &&
                          !prescribedEmittedEarlier
                        ) {
                          // Pillar 1 (silent substitution): the brain emitted
                          // a different show_* before the prescribed render
                          // (the 2026-05-15 "two trees on the page" bug).
                          // Instead of killing + retry, swap this wrong tool
                          // for the prescribed one. If the brain ALSO emits
                          // the real prescribed render later this turn, the
                          // catalog dedup collapses the identical signature,
                          // so the net result is a single prescribed render —
                          // no double-tree, no abort. Narration is render-
                          // generic ("here's the tree"), so the swap is safe.
                          const emittedTool = name;
                          name = prescribed.tool;
                          args = prescribed.params;
                          console.warn(
                            `[brain-orchestrator] prescribedRender wrong-tool for segment "${segId}": emitted "${emittedTool}" before prescribed "${prescribed.tool}" — auto-substituting prescribed render (no kill).`,
                          );
                          onDebugEvent?.(
                            'prescribed_render_tool_substituted',
                            `segId="${segId}" emitted=${emittedTool} → ${prescribed.tool}`,
                          );
                        }
                      }
                    }
                  }
                  // Server-only tools — no whiteboard render expected. The
                  // brain calls these for SIDE EFFECTS resolved server-side
                  // by claude-brain.ts's toolResultProvider; the result
                  // flows back via tool_result and the brain decides what
                  // to do with it. We must NOT route these through
                  // mapFunctionCallToCommand (which would log "unmapped tool
                  // call" and leave the gate stuck), and we must open the
                  // gate so any narration the brain emitted between this
                  // tool call and a real render-tool gets voiced.
                  //
                  // Currently in the set: generate_problem (adaptive-pacing
                  // v1 — Phase 1). Add new server-only tools here as the
                  // pipeline grows.
                  if (name === 'generate_problem') {
                    if (gateState === 'gated') {
                      clearTimeout(gateTimer);
                      openGate();
                    }
                    // Round-7+++++ Issue 1 fix: mark this turn as
                    // generate_problem-emitting so the show_problem
                    // auto-substitute (downstream) can bypass.
                    generateProblemThisTurnRef.current = true;
                    onDebugEvent?.('server_only_tool', name);
                    continue;
                  }
                  // Authored-truth guard: when the active segment has an
                  // authored card, free-form show_problem is forbidden.
                  // The brain MUST use show_segment_card so the rendered
                  // text comes from the lesson plan verbatim. Otherwise
                  // the brain's free-form variant ends up coexisting on
                  // the board with the authored card the brain emits in
                  // a later turn — observed 2026-04-29 algebra session:
                  // brain emitted show_problem("3x+2y=16, x+2y=8") in
                  // turn N, then show_segment_card → authored
                  // ("3x+2y=12, 5x-2y=4") in turn N+1. Both stayed on
                  // the board, brain narrated arithmetic for the
                  // authored one while the student looked at the
                  // free-form one ("they r same. so subtract" / brain:
                  // "Almost! y-terms are opposite"). The judge LLM
                  // can't catch this because both cards are on the
                  // board and the brain's claim IS grounded against
                  // ONE of them.
                  // show_worked_example bypasses the show_problem
                  // auto-substitute, so the brain can render an INVENTED
                  // walkthrough on a segment whose authored truth is
                  // different — observed 2026-05-02 session, brain
                  // emitted show_worked_example with {4,7,13,2,9} → 7
                  // for the worked-mean segment whose authored problem
                  // is {70,75,80,85,90} → 80. Lesson appeared to "start
                  // with the example already solved," skipping the
                  // interactive walk-through. Catch this here:
                  // substitute show_worked_example → show_segment_card
                  // when the active segment is itself a worked_example
                  // with authored truth.
                  if (name === 'show_worked_example') {
                    const plan = lessonPlanRef.current;
                    const segId = currentSegmentIdRef.current;
                    if (plan && segId) {
                      const seg = getSegment(plan, segId);
                      const truth = getSegmentTruth(seg);
                      if (truth?.problemText && truth.kind === 'worked_example') {
                        // Divergence-KILL guard, mirroring the show_problem
                        // pattern (see ~50 lines below). Silent-substitute
                        // alone swaps the BOARD to the authored card but
                        // leaves the brain's spoken walkthrough untouched —
                        // observed 2026-05-07 AP Macro session: brain
                        // emitted show_worked_example with a Sofia/$120
                        // scenario for the authored Maya/$50 worked-budget
                        // segment. Substitute swapped the card to Maya;
                        // brain spoke "Sofia has $120…" → catastrophic
                        // chat-board mismatch.
                        // Detection: compare the set of numbers in the
                        // brain's example.problem.statement against the
                        // authored problemText. If both sides have numbers
                        // and the Jaccard similarity is below 0.5, the
                        // brain has invented a structurally different
                        // scenario and must re-narrate.
                        const ex = (args as { example?: { problem?: { statement?: unknown } } }).example;
                        const brainStatement = typeof ex?.problem?.statement === 'string' ? ex.problem.statement : '';
                        const numRe = /-?\d+(?:\.\d+)?/g;
                        const brainNums = new Set(brainStatement.match(numRe) || []);
                        const authoredNums = new Set(truth.problemText.match(numRe) || []);
                        let divergent = false;
                        if (brainNums.size > 0 && authoredNums.size > 0) {
                          let intersect = 0;
                          brainNums.forEach((n) => { if (authoredNums.has(n)) intersect += 1; });
                          const denom = Math.max(brainNums.size, authoredNums.size);
                          if (intersect / denom < 0.5) divergent = true;
                        }
                        // new_page-in-turn bypass: a topic-switch
                        // (e.g. student asks "show me another example")
                        // legitimately renders a fresh, off-segment worked
                        // example. The brain signals this by emitting
                        // new_page in the same turn. Mirrors the
                        // show_problem bypass pattern.
                        const newPageInTurn = brainEmittedNewPageThisTurnRef.current;
                        // Student-problem grounding: the divergence is the
                        // STUDENT's own stated problem (their numbers), not brain
                        // drift → teach theirs, don't substitute the authored
                        // example. Structural: rendered numbers match the recent
                        // student message.
                        const recentStudentMsg = TUTOR_STUDENT_PROBLEM_GROUNDING
                          ? transcriptRef.current.filter((e) => e.role === 'student').slice(-2).map((e) => e.text).join(' ')
                          : '';
                        const studentBrought = divergent && TUTOR_STUDENT_PROBLEM_GROUNDING
                          && rendersStudentProblem(brainNums, recentStudentMsg);
                        if (divergent && (newPageInTurn || studentBrought)) {
                          const why = studentBrought ? 'matches the student\'s stated problem' : 'new_page in turn (fresh context)';
                          console.log(`[brain-orchestrator] show_worked_example divergence on "${segId}" — but ${why}; teaching it as-is (no substitute). brain="${[...brainNums].slice(0, 4).join(',')}" authored="${[...authoredNums].slice(0, 4).join(',')}"`);
                          onDebugEvent?.(studentBrought ? 'student_problem_grounding_worked_example' : 'show_worked_example_divergence_bypass', `${why}; segId="${segId}"`);
                          // Fall through — dispatch the brain's worked example
                          // as-is (the student's problem, or a fresh-context one).
                        } else if (divergent && TUTOR_VALIDATE_BEFORE_SPEAK) {
                          // v2 divergence-substitute (project_tutor_validate_
                          // before_speak): the brain narrated an INVENTED
                          // scenario and the validating tool diverges from the
                          // authored card. With the rolling buffer holding the
                          // narration, DROP the buffered invented-setup
                          // sentence(s) (never spoken) and SUBSTITUTE the
                          // authored card — no kill, no 3-8s retry, no wrong
                          // content on the board. The brain's subsequent
                          // sentences continue (the accepted residual: an
                          // occasional later sentence may still reference the
                          // invented scenario — monitored, see the memo).
                          dropPendingForSubstitute('worked_example divergence');
                          console.warn(`[brain-orchestrator] show_worked_example divergence for segment "${segId}" — DROP held narration + substitute authored card (no kill). brain="${[...brainNums].slice(0, 4).join(',')}" authored="${[...authoredNums].slice(0, 4).join(',')}"`);
                          onDebugEvent?.('show_worked_example_divergence_substituted', `segId="${segId}"`);
                          name = 'show_segment_card';
                          args = { segmentId: segId };
                        } else if (divergent) {
                          console.warn(`[brain-orchestrator] show_worked_example payload diverges from authored worked_example for segment "${segId}". brain numbers="${[...brainNums].slice(0, 5).join(',')}", authored numbers="${[...authoredNums].slice(0, 5).join(',')}". Killing attempt for retry.`);
                          onDebugEvent?.('show_worked_example_divergence', `segId="${segId}" brain="${[...brainNums].slice(0, 3).join(',')}" authored="${[...authoredNums].slice(0, 3).join(',')}"`);
                          rejectionsThisAttempt.push({
                            action: 'show_worked_example',
                            reason: `Your show_worked_example payload describes a DIFFERENT scenario than the authored worked_example for segment "${segId}". Your example uses numbers [${[...brainNums].slice(0, 6).join(', ')}], but the authored problem uses [${[...authoredNums].slice(0, 6).join(', ')}]. The student would hear you walk through your invented example while seeing the authored card on the whiteboard — a chat-board mismatch. You have TWO recovery paths depending on intent: (A) IF you intended to walk through the AUTHORED worked example for the current segment: call show_segment_card({ segmentId: "${segId}" }) and narrate the authored steps verbatim. The authored problem is: "${truth.problemText.slice(0, 200)}". (B) IF you intended a TOPIC SWITCH (a NEW worked example unrelated to the current segment, e.g. student asked "show me another example"): emit BOTH new_page AND show_worked_example in the same response — the runtime treats new_page-in-turn as a fresh-context signal and lets your free-form worked example render. Make sure your spoken narration matches the example you're rendering. Pick path (A) or (B) based on what the student actually asked for.`,
                          });
                          await performKill();
                          continue;
                        } else {
                          // Numbers match (or weren't extractable) → the
                          // brain's payload roughly matches authored, so
                          // silent-substitute is safe.
                          console.log(`[brain-orchestrator] auto-substitute show_worked_example → show_segment_card for segment "${segId}" (authored worked_example truth exists; brain's invented walkthrough would override authored content)`);
                          onDebugEvent?.('show_worked_example_substituted', `→ show_segment_card("${segId}")`);
                          name = 'show_segment_card';
                          args = { segmentId: segId };
                        }
                      }
                    }
                  }
                  if (name === 'show_problem') {
                    const plan = lessonPlanRef.current;
                    const segId = currentSegmentIdRef.current;
                    if (plan && segId) {
                      const seg = getSegment(plan, segId);
                      const truth = getSegmentTruth(seg);
                      if (truth?.problemText) {
                        // Auto-substitute show_problem → show_segment_card
                        // when the active segment has authored truth, with
                        // a query-target divergence guard layered on top.
                        //
                        // Original behavior (committed a331607): SILENTLY
                        // substitute. Cheap; preserves narration; avoids
                        // 5-8s retry dead air. Works perfectly when the
                        // brain's free-form statement is a slight rewording
                        // of the authored problem.
                        //
                        // Failure mode (2026-05-01 JEE Physics session):
                        // brain emitted show_problem("…Find the SPEED at
                        // the bottom") for a worked-rolling-incline
                        // segment whose authored problem reads "…Find its
                        // ACCELERATION". The substitute swapped the BOARD
                        // to the authored card, but the brain's narration
                        // ("find speed at the bottom") was already
                        // streaming — student saw "Find its acceleration"
                        // on the board while the chat read "find the speed
                        // at the bottom." Catastrophic mismatch.
                        //
                        // New layered behavior:
                        //   1. Extract the QUERY TARGET from each statement
                        //      (the noun after find/calculate/determine).
                        //   2. If both targets resolve AND differ → KILL
                        //      this attempt with a validator-feedback
                        //      rejection. The brain retries, this time
                        //      narrating the authored target.
                        //   3. Otherwise → silent-substitute as before.
                        const brainStatement = typeof (args as { statement?: unknown }).statement === 'string'
                          ? ((args as { statement: string }).statement)
                          : '';
                        const targetRegex = /\b(?:find|calculate|determine|compute|express|what\s+is|what's|whats|how\s+(?:much|many|fast|long))\s+(?:the\s+|its\s+|a\s+|an\s+)?([a-z]{4,})/i;
                        const brainTarget = brainStatement.match(targetRegex)?.[1]?.toLowerCase();
                        const authoredTarget = truth.problemText.match(targetRegex)?.[1]?.toLowerCase();
                        const targetsDiverge = !!brainTarget && !!authoredTarget && brainTarget !== authoredTarget;

                        // Incoherence-fix BYPASS: when the brain emitted
                        // new_page in the SAME TURN before this
                        // show_problem, treat this as a fresh-context
                        // render (e.g. student asked to switch topic from
                        // mean → median; brain creates a new page with the
                        // new problem). The currentSegmentIdRef may still
                        // point at the prior segment (no advance_lesson
                        // happened, or it failed at end-of-plan), so the
                        // divergence guard would otherwise misfire and
                        // deadlock the session — exact failure mode in the
                        // 2026-05-02 incoherence test.
                        //
                        // We use brainEmittedNewPageThisTurnRef here, NOT
                        // newPageThisTurnRef. The latter only flips after
                        // the new_page command survives the tutor-side
                        // same-context guard's strip; the former flips
                        // when the brain emits a new_page tool-call
                        // EVENT, regardless of whether it later gets
                        // stripped. The 2026-05-02 retest deadlocked at
                        // exactly this gap: same-context guard stripped
                        // the topic-switch new_page → render-tracking
                        // ref stayed false → divergence guard interpreted
                        // it as on-segment and killed the legitimate
                        // topic switch.
                        const newPageInTurn = brainEmittedNewPageThisTurnRef.current;
                        // Round-7+++++ Issue 1 fix: when the brain
                        // emitted generate_problem THIS turn, the
                        // follow-up show_problem statement IS the
                        // canonicalText returned by the pipeline — NOT
                        // a free-form re-render of the segment's
                        // authored content. Bypass both the divergence
                        // KILL and the substitute. Otherwise (observed
                        // 2026-05-04): brain emits generate_problem +
                        // show_problem for a fresh dataset, the
                        // currentSegmentIdRef points at a completed
                        // segment, the substitute swaps to
                        // show_segment_card on that completed segment,
                        // and the new completion-block fires →
                        // MAX_VALIDATOR_RETRIES → student stuck.
                        const generateProblemInTurn = generateProblemThisTurnRef.current;
                        if (generateProblemInTurn) {
                          console.log(`[brain-orchestrator] show_problem follows generate_problem in same turn — bypassing substitute + divergence kill (segId="${segId}", brain target="${brainTarget}")`);
                          onDebugEvent?.('show_problem_post_generate_bypass', `segId="${segId}" target="${brainTarget}"`);
                          // Fall through. Treat the brain's show_problem
                          // statement as canonicalText — render as-is.
                        } else if (targetsDiverge && (newPageInTurn || (TUTOR_STUDENT_PROBLEM_GROUNDING && rendersStudentProblem(new Set(brainStatement.match(/-?\d+(?:\.\d+)?/g) || []), transcriptRef.current.filter((e) => e.role === 'student').slice(-2).map((e) => e.text).join(' '))))) {
                          const sb = !newPageInTurn;
                          const why = sb ? 'matches the student\'s stated problem' : 'new_page in same turn (fresh context)';
                          console.log(`[brain-orchestrator] show_problem target divergence for segment "${segId}" — but ${why}; rendering as-is. brain="${brainTarget}" authored="${authoredTarget}"`);
                          onDebugEvent?.(sb ? 'student_problem_grounding_show_problem' : 'show_problem_target_divergence_bypass', `${why}; brain="${brainTarget}" authored="${authoredTarget}"`);
                          // Don't substitute — the brain is intentionally
                          // rendering the student's brought problem (or a
                          // fresh-context one); the authored card would be wrong.
                          // Fall through to dispatch show_problem as-is.
                        } else if (targetsDiverge && servedProblemStatementsRef.current.has(stripWbEmphasisText(truth.problemText).replace(/\s+/g, ' ').trim())) {
                          // (Lookup strips wb-emphasis markup first: the
                          // substitute path renders the authored card through
                          // stripWbEmphasisText, so the SERVED set holds the
                          // stripped form — raw problemText would never match
                          // for authored content carrying *emphasis*.)
                          // R33 (live 2026-07-25, AP Stats): substituting the
                          // authored card is WRONG when that card was already
                          // served — the student solved it, asked "give me a
                          // difficult one", the brain authored its own problem
                          // (skipping generate_problem), and the substitute
                          // re-served the finished card ("Are you giving me
                          // the same problem?"). Kill for retry with feedback
                          // steering to the sanctioned generate_problem path,
                          // whose canonicalText render bypasses this guard.
                          console.warn(`[brain-orchestrator] show_problem target divergence for segment "${segId}" (brain="${brainTarget}" authored="${authoredTarget}") — authored card ALREADY SERVED this session; killing for retry instead of re-serving it.`);
                          onDebugEvent?.('show_problem_divergence_already_served', `brain="${brainTarget}" authored="${authoredTarget}" segId="${segId}"`);
                          rejectionsThisAttempt.push({
                            action: 'show_problem',
                            reason: `Your show_problem asked for "${brainTarget}" while segment "${segId}"'s authored problem asks for "${authoredTarget}" — and that authored problem was ALREADY served to the student this session, so re-rendering it would repeat a problem they finished. If the student asked for another / harder / easier problem: call generate_problem FIRST (speak a hedged bridge sentence, then the tool) and render the returned canonicalText via show_problem — never author your own problem and never re-render a completed card. If you intended a TOPIC SWITCH instead, emit BOTH new_page AND show_problem in the same response.`,
                          });
                          await performKill();
                          continue;
                        } else if (targetsDiverge && TUTOR_VALIDATE_BEFORE_SPEAK) {
                          // v2 divergence-substitute: brain asked for a
                          // different target than authored on the current
                          // segment (a drift). DROP the held narration about
                          // the brain's target (never spoken) + SUBSTITUTE the
                          // authored card — no kill, no retry, no chat-board
                          // mismatch. (A genuine topic switch carries new_page,
                          // handled by the bypass above. An already-served
                          // authored card kills for retry, handled just above.)
                          dropPendingForSubstitute('show_problem target divergence');
                          console.warn(`[brain-orchestrator] show_problem target divergence for segment "${segId}" (brain="${brainTarget}" authored="${authoredTarget}") — DROP held narration + substitute authored card (no kill).`);
                          onDebugEvent?.('show_problem_target_divergence_substituted', `brain="${brainTarget}" authored="${authoredTarget}" segId="${segId}"`);
                          name = 'show_segment_card';
                          args = { segmentId: segId };
                        } else if (targetsDiverge) {
                          console.warn(`[brain-orchestrator] show_problem query-target divergence for segment "${segId}": brain asks for "${brainTarget}", authored asks for "${authoredTarget}". Killing attempt for retry.`);
                          onDebugEvent?.('show_problem_target_divergence', `brain="${brainTarget}" authored="${authoredTarget}" segId="${segId}"`);
                          rejectionsThisAttempt.push({
                            action: 'show_problem',
                            reason: `Your show_problem asked the student to find "${brainTarget}", but the authored ${truth.kind} for segment "${segId}" asks for "${authoredTarget}". This causes a chat-board mismatch where the student hears one question but sees another. You have TWO recovery paths depending on intent: (A) IF you intended to render the AUTHORED problem for the current segment: call show_segment_card({ segmentId: "${segId}" }) instead, and ensure your spoken narration is about finding "${authoredTarget}". The authored problem is: "${truth.problemText.slice(0, 200)}". (B) IF you intended a TOPIC SWITCH (new concept, e.g. switching mean → median at the student's request): emit BOTH new_page AND show_problem in the same response — the runtime treats new_page-in-turn as a fresh-context signal and lets your free-form show_problem render. Make sure your show_problem statement is well-formed and your narration matches the new target ("${brainTarget}"). Pick path (A) or (B) based on what the student actually asked for.`,
                          });
                          await performKill();
                          continue;
                        }
                        // Substitute path: only when targets match (or
                        // aren't extractable) AND the brain didn't emit
                        // new_page in this turn (which signals a fresh
                        // off-segment render). Without this latter
                        // guard, a brain emitting `new_page +
                        // show_problem` for "harder one" with the SAME
                        // target word but DIFFERENT numbers would get
                        // its show_problem swapped back to the current
                        // segment's authored card — exact failure in the
                        // 2026-05-02 retest where harder {12,14,16,18,20}
                        // problem became the original {2,4,6,8,10} card
                        // because both were "find the mean".
                        if (!targetsDiverge && !newPageInTurn && !generateProblemInTurn) {
                          console.log(`[brain-orchestrator] auto-substitute show_problem → show_segment_card for segment "${segId}" (authored truth exists)`);
                          onDebugEvent?.('show_problem_substituted', `→ show_segment_card("${segId}")`);
                          name = 'show_segment_card';
                          args = { segmentId: segId };
                        } else if (!targetsDiverge && newPageInTurn) {
                          console.log(`[brain-orchestrator] show_problem on segment "${segId}" with matching target but new_page in turn — fresh-context render, NOT substituting.`);
                          onDebugEvent?.('show_problem_substitute_bypass', `new_page-in-turn; segId="${segId}" target="${brainTarget}"`);
                          // Fall through to dispatch the brain's
                          // free-form show_problem as-is.
                        }
                      }
                    }
                  }
                  // Lever A — show_segment_card resolution. Brain emits a
                  // segment id; the runtime pulls authored data from the
                  // active lesson plan and synthesizes the equivalent
                  // show_problem command. The brain literally cannot drift
                  // from the script with this path because it isn't
                  // writing the script. Falls back to a logged warning if
                  // the segment id is unknown or has no authored card.
                  let resolvedCmd: ReturnType<typeof mapFunctionCallToCommand> | null = null;
                  if (name === 'show_segment_card') {
                    const requestedId = typeof args.segmentId === 'string' ? args.segmentId : '';
                    const plan = lessonPlanRef.current;
                    if (plan) {
                      // Resolve the brain's requested segment id. If the
                      // brain hallucinates an id ("intro", "intro-1"
                      // observed 2026-04-29) we fall back to the first
                      // segment of the plan that has renderable
                      // content — better than silently dropping the
                      // call and leaving the board blank.
                      let seg = requestedId ? getSegment(plan, requestedId) : undefined;
                      let segId = requestedId;
                      if (!seg && plan.segments && plan.segments.length > 0) {
                        seg = plan.segments[0];
                        segId = seg.id;
                        console.warn(`[brain-orchestrator] show_segment_card: unknown segmentId "${requestedId}" — falling back to first segment "${segId}".`);
                        onDebugEvent?.('show_segment_card_fallback_first', `requested="${requestedId}" → "${segId}"`);
                      }
                      // Round-7+++ Fix Issue 1: block show_segment_card
                      // on a segment already marked complete this
                      // session. Observed 2026-05-03: brain emitted
                      // show_segment_card("try-mean-1") on "harder
                      // problem" after several improvised harder
                      // problems, dragging the student all the way
                      // back to the original easy problem. The
                      // brain bypassed generate_problem entirely. Block
                      // the regression at the orchestrator and surface
                      // a strong correction telling the brain to call
                      // generate_problem (or improvise) instead.
                      if (segId && completedSegmentIdsRef.current.has(segId)) {
                        console.warn(`[brain-orchestrator] show_segment_card: segment "${segId}" already marked COMPLETE — blocking re-render.`);
                        onDebugEvent?.('show_segment_card_completed_blocked', segId);
                        rejectionsThisAttempt.push({
                          action: 'show_segment_card',
                          reason: `Segment "${segId}" is already marked COMPLETE this session — the student already solved it. Re-rendering it would regress the student to easier content they've already done. RECOVERY: (1) PREFERRED — call generate_problem with anchorProblem set to the most-recent problem the student solved, anchorAnswer set to its answer, and difficulty="slightly_harder" or "much_harder"; (2) if you've already received no_problem_available for the current concept, IMPROVISE an ad-hoc show_problem with clearly different content (different numbers, different scenario) than anything previously rendered, prefixed with the disclaimer "Off the top of my head, not from the standard bank — here's one for you." Do NOT call show_segment_card again on any segment id you've previously marked complete. The list of completed segments this session: [${[...completedSegmentIdsRef.current].join(', ')}].`,
                        });
                        await performKill();
                        continue;
                      }
                      const truth = getSegmentTruth(seg);
                      // Off-topic guard: refuse to render a try_yourself
                      // segment that's marked offTopic via passive
                      // natural-flow advance. Test plans use this to
                      // bait the runtime; real plans should never have
                      // offTopic segments routed via show_segment_card
                      // either (off-topic content belongs in a separate
                      // plan or a topic-switch via new_page +
                      // show_problem). Surface as a tool rejection so
                      // the brain learns to skip rather than render +
                      // congratulate the student for an unrelated
                      // answer — exact failure mode in the 2026-05-02
                      // session where brain said "Paris -- correct!" in
                      // a statistics lesson.
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      if (seg && (seg as any).offTopic === true) {
                        console.warn(`[brain-orchestrator] show_segment_card: segment "${segId}" is marked offTopic — refusing passive render.`);
                        onDebugEvent?.('show_segment_card_offtopic_refused', segId);
                        rejectionsThisAttempt.push({
                          action: 'show_segment_card',
                          reason: `Segment "${segId}" is marked OFF-TOPIC relative to the rest of this lesson plan and will not be rendered via passive natural-flow advance. The student likely intended to advance within the current concept, NOT into an unrelated drill. Recovery options: (a) call generate_problem to source a topic-relevant practice problem, (b) emit a topic-switch via new_page + show_problem if the student explicitly asked for a different concept, (c) wrap up the session if there's no relevant content left. DO NOT call show_segment_card("${segId}") again — render-refusal is structural, not transient.`,
                        });
                        await performKill();
                        continue;
                      }
                      if (seg && truth?.problemText) {
                        // Stamp the catalog with this segment id BEFORE
                        // appending the resolved show_problem so the
                        // card belongs to the segment it represents
                        // (even if the brain calls show_segment_card
                        // before advance_lesson). Without this, an
                        // out-of-order emission would tag the new
                        // segment's card with the prior segment id and
                        // the snapshot filter would hide it on the
                        // next turn. Idempotent — same segId is fine.
                        catalogRef.current.setCurrentSegment(segId);
                        resolvedCmd = {
                          action: 'showProblem',
                          problem: {
                            // resolvedCmd short-circuits mapFunctionCallToCommand
                            // (cmd = resolvedCmd ?? map(...)), so authored text
                            // needs its own emphasis strip.
                            statement: stripWbEmphasisText(truth.problemText),
                            format: 'free-response',
                            title: truth.kind === 'try_yourself' ? 'Try Yourself'
                              : truth.kind === 'worked_example' ? 'Worked Example'
                              : truth.kind === 'misconception_check' ? 'Check'
                              : truth.kind === 'extension' ? 'Extension'
                              : undefined,
                          },
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        } as unknown as any;
                        console.log(`[brain-orchestrator] show_segment_card resolved: ${segId} → "${truth.problemText.slice(0, 60)}…"`);
                        onDebugEvent?.('show_segment_card_resolved', `${segId}: "${truth.problemText.slice(0, 50)}…"`);
                      } else if (seg) {
                        // Hook / concept / recap segments don't have a
                        // problem field, but they DO have authored
                        // content (script / keyIdeas / mustRemember)
                        // worth rendering. Earlier path silently
                        // dropped them, leaving the board blank while
                        // the brain narrated — observed 2026-04-29
                        // algebra-2 session: brain said "Here's a
                        // real-life puzzle..." but the board stayed
                        // empty because show_segment_card("hook") fell
                        // through. Render a labeled text card from
                        // each segment kind's authored content.
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const s = seg as any;
                        let title: string | undefined;
                        let body: string | undefined;
                        if (seg.kind === 'hook' && typeof s.script === 'string' && s.script.length > 0) {
                          title = 'Hook';
                          body = s.script;
                        } else if (seg.kind === 'concept' && Array.isArray(s.keyIdeas) && s.keyIdeas.length > 0) {
                          title = 'Key ideas';
                          body = s.keyIdeas.map((k: string, i: number) => `${i + 1}. ${k}`).join('\n');
                        } else if (seg.kind === 'recap' && Array.isArray(s.mustRemember) && s.mustRemember.length > 0) {
                          title = 'Recap';
                          body = s.mustRemember.map((k: string) => `• ${k}`).join('\n');
                        }
                        if (title && body) {
                          catalogRef.current.setCurrentSegment(segId);
                          resolvedCmd = {
                            action: 'showProblem',
                            problem: {
                              statement: stripWbEmphasisText(body),
                              format: 'free-response',
                              title,
                            },
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          } as unknown as any;
                          console.log(`[brain-orchestrator] show_segment_card resolved (${seg.kind}): ${segId} → "${body.slice(0, 60)}…"`);
                          onDebugEvent?.('show_segment_card_resolved', `${segId} (${seg.kind})`);
                        } else {
                          console.warn(`[brain-orchestrator] show_segment_card: segment "${segId}" (kind=${seg.kind}) has no renderable content; ignoring.`);
                          onDebugEvent?.('show_segment_card_no_truth', segId);
                        }
                      } else {
                        console.warn(`[brain-orchestrator] show_segment_card: plan has no segments to fall back on.`);
                      }
                      // Round-15 Issue 1 (2026-07-16): the brain walks the
                      // board forward with show_segment_card alone and never
                      // calls advance_lesson, so the pedagogical cursor (and
                      // the portal progress pills it drives) freezes at the
                      // opening segment — hit in BOTH live-test sessions
                      // (AP Psych pill stuck on "Hook" 0/7 after two Try-
                      // Yourself problems). When the card resolves to a
                      // segment strictly LATER in the plan than the cursor,
                      // the transition already happened conversationally —
                      // apply it through applyResolvedAdvance (auto-marks
                      // skipped-over segments complete, moves the cursor,
                      // and defers the transition newPage that this very
                      // render will consume). advance_lesson({to:"next"})
                      // later in the same turn is absorbed via
                      // inferredAdvanceThisTurnRef (see advanceLesson
                      // branch) so the two paths can't double-advance.
                      if (resolvedCmd) {
                        const cursorId = currentSegmentIdRef.current;
                        if (inferAdvanceFromSegmentCard(plan.segments.map((s) => s.id), cursorId, segId)) {
                          console.log(`[brain-orchestrator] show_segment_card implies lesson advance "${cursorId}" → "${segId}" (brain skipped advance_lesson) — applying inferred advance.`);
                          onDebugEvent?.('inferred_advance_from_segment_card', `${cursorId} → ${segId}`);
                          applyResolvedAdvance(plan, cursorId, segId);
                          inferredAdvanceThisTurnRef.current = segId;
                        }
                      }
                    } else {
                      console.warn(`[brain-orchestrator] show_segment_card: no active plan.`);
                    }
                  }
                  // Round-7+++++ Issue 5 fix: pre-validate show_diagram
                  // params against the catalog solver. The solver runs
                  // client-side in CommandRenderer; if it throws (e.g.
                  // comparison_table cells row count mismatch with
                  // items.length), the canvas shows
                  // "✏️ Tutor is figuring out how to draw this…" forever
                  // and the brain never gets feedback to retry. Run the
                  // solver here so we surface a structural rejection
                  // through the validator-feedback loop. Observed
                  // 2026-05-04 JEE rotational session: brain emitted
                  // comparison_table with items=[3 entries] but cells
                  // rows had 2 entries each → WB stuck on placeholder
                  // for the entire session.
                  if (name === 'show_diagram') {
                    const diagType = typeof (args as { type?: unknown }).type === 'string'
                      ? ((args as { type: string }).type)
                      : '';
                    const rawParams = (args as { params?: unknown }).params;
                    const paramsObj = rawParams && typeof rawParams === 'object' && !Array.isArray(rawParams)
                      ? (rawParams as Record<string, unknown>)
                      : {};
                    if (diagType) {
                      try {
                        solveDiagram(diagType, paramsObj);
                      } catch (err) {
                        const msg = err instanceof Error ? err.message : String(err);
                        console.warn(`[brain-orchestrator] show_diagram solver pre-check rejected: ${msg}`);
                        onDebugEvent?.('show_diagram_solver_rejected', `${diagType}: ${msg.slice(0, 100)}`);
                        onDebugEvent?.('render_dropped', `show_diagram — solver pre-check: ${msg.slice(0, 100)}`);
                        rejectionsThisAttempt.push({
                          action: 'show_diagram',
                          reason: `Your show_diagram call (type="${diagType}") failed structural validation: ${msg}. Re-emit show_diagram with corrected params that satisfy the schema for kind "${diagType}". If you can't produce valid params for this diagram kind, fall back to show_table for tabular comparisons, show_equation for formulas, or describe the idea verbally without a render.`,
                        });
                        // Phase 4.2: organizer text is usually well-formed even
                        // when the structure fails the solver — paint it as a
                        // plain card so the narration lands on the content.
                        if (TUTOR_RENDER_FALLBACK_CARD) {
                          const spec = decideFallbackCard('show_diagram', args, msg);
                          if (spec) {
                            onDebugEvent?.('render_fallback_card', `show_diagram(${diagType}) → "${spec.title}"`);
                            void handleWhiteboardCommand([
                              { action: 'showFallbackCard', ...spec, sourceAction: 'show_diagram' } as WhiteboardCommand,
                            ]);
                          }
                        }
                        continue;
                      }
                    }
                  }
                  const cmd = resolvedCmd ?? mapFunctionCallToCommand(name, args);
                  if (cmd) {
                    // Phase 4.1: a Rule-8 repair frame (post-`done`) names its
                    // introducing sentence; sanitize and pass it through so the
                    // render buffers against that sentence, not the dead count.
                    const rawAnchor = (ev as { anchorSentence?: unknown }).anchorSentence;
                    const repairAnchor =
                      typeof rawAnchor === 'number' && Number.isInteger(rawAnchor) && rawAnchor >= 1
                        ? rawAnchor
                        : undefined;
                    const result = await handleWhiteboardCommand(
                      [cmd],
                      repairAnchor !== undefined ? { anchorSentence: repairAnchor } : undefined,
                    );
                    // Track what actually landed so a later kill can
                    // roll exactly these renders back off the board.
                    if (result?.assignedIds?.length) {
                      renderIdsThisAttempt.push(...result.assignedIds);
                      totalPaintedCount += result.assignedIds.length;
                      // Keep-on-no-replacement: this attempt produced a render.
                      // If it turns out to be the winning attempt, the finally
                      // treats these as a replacement for any killed renders.
                      winningAttemptRenderedRef.current = true;
                    }
                    // Incoherence-fix: surface dedup-suppressed renders
                    // for show_segment_card / show_problem as synthetic
                    // rejections. Otherwise the brain narrates "here's
                    // your next problem" while the board didn't update —
                    // exact failure mode in the 2026-05-01 JEE Physics
                    // session and 2026-05-02 incoherence test (brain
                    // re-emits show_segment_card for an already-completed
                    // segment after no_problem_available, dedup catches
                    // it silently).
                    const dedupSuppressed = result?.duplicates?.some?.((d) => !!d) ?? false;
                    const isProblemRender = name === 'show_segment_card' || name === 'show_problem';
                    if (isProblemRender && dedupSuppressed && (!result?.rejected || result.rejected.length === 0)) {
                      const segId = typeof args.segmentId === 'string' ? args.segmentId : currentSegmentIdRef.current;
                      // Round-7+ Fix 1: verification-turn dedup suppression.
                      // When the student's last utterance looks like an
                      // ANSWER attempt (numeric / step-of-computation
                      // language) AND the active card on the board is
                      // already the focus of verification, the dedup'd
                      // render call is just a defensive habit by the brain
                      // ("show the card again before I check the answer").
                      // Surfacing this as a rejection forces a retry that
                      // re-anchors the brain on the segment's authored
                      // truth and abandons the active improvised card —
                      // exact failure mode in 2026-05-03 session where
                      // brain on a brain-improvised {3,7,11,15,19} card
                      // emitted show_segment_card("try-mean-1") during
                      // verification, dedup'd to {2,4,6,8,10}, retry
                      // chain dragged the brain back to {2,4,6,8,10}.
                      // Silently drop the rejection here — the brain's
                      // narration in this turn is what matters, and Fix
                      // A1's <active_problem> block already pins it to
                      // the correct card.
                      const verificationIntentRe = /\d|=|\bsum\b|\bmean\b|\bdivide\b|\bdivided\b|\bequals?\b|\bplus\b|\bminus\b|\btimes\b|\bover\b|\bso\b|first step|step (?:1|one|two|2)|let me try/i;
                      const studentVerifying = verificationIntentRe.test(transcript);
                      const activeStatement = currentProblemRef.current?.statement?.trim() ?? '';
                      // Round-7+ Fix 2/7: detect off-segment / off-plan
                      // active card. When currentProblemRef differs from
                      // the segment's authored problemText, the active
                      // card is brain-improvised on top of the segment;
                      // the dedup target (segment authored card) is NOT
                      // what the student is looking at. The rejection
                      // text must NOT push the brain toward the segment's
                      // authored content — it should reaffirm the active
                      // (improvised) card as the focus and tell the brain
                      // to just continue the conversation.
                      let segmentAuthored = '';
                      try {
                        const plan = lessonPlanRef.current;
                        if (plan && segId) {
                          const seg = getSegment(plan, segId);
                          const truth = getSegmentTruth(seg);
                          segmentAuthored = (truth?.problemText ?? '').trim();
                        }
                      } catch { /* lookup is best-effort */ }
                      const activeIsOffSegment = !!activeStatement
                        && !!segmentAuthored
                        && activeStatement !== segmentAuthored;
                      if (studentVerifying && !!activeStatement) {
                        console.log(`[brain-orchestrator] dedup silently dropped during verification (active="${activeStatement.slice(0, 60)}…")`);
                        onDebugEvent?.('dedup_silent_drop_verify', `${name} → active="${activeStatement.slice(0, 50)}…"`);
                        // Don't push a rejection. Don't kill the attempt.
                        // The brain's already-streaming narration is the
                        // verification; the redundant render call was
                        // harmless and would have showed the same card.
                        continue;
                      }
                      // Round-7+ Fix 8: silent dedup on RETRY attempts.
                      // When attempt > 0, the retry exists because a
                      // PRIOR attempt got killed by the judge / RULE8 /
                      // a different validator. The brain's retry then
                      // re-emits the same render tools (because it sees
                      // its prior attempt's tool calls in conversation
                      // history and replays them). Dedup catches these
                      // re-emissions correctly — but surfacing them as
                      // rejections triggers ANOTHER retry, and this
                      // cascades up to MAX_VALIDATOR_RETRIES with each
                      // retry's spoken sentences playing audibly.
                      // Observed 2026-05-03 session opening "ready"
                      // turn: 3 attempts spoke in succession (judge KILL
                      // → bridge → retry-1 dedup → bridge → retry-2
                      // dedup → MAX), producing the "gibberish" the
                      // user reported. Silently dropping dedup on retry
                      // attempts lets the corrected speech land cleanly
                      // without re-triggering the cascade.
                      if (attempt > 0) {
                        console.log(`[brain-orchestrator] dedup silently dropped on retry attempt ${attempt} (${name})`);
                        onDebugEvent?.('dedup_silent_drop_retry', `attempt=${attempt} ${name} → ${segId}`);
                        continue;
                      }
                      // State-aware recovery: if we've already observed
                      // no_problem_available patterns from the brain
                      // earlier this session, retrying generate_problem
                      // is futile. Push the brain toward improvise-with-
                      // disclaimer or wrap-up first.
                      const noProblemObserved = noProblemAvailableObservedRef.current;
                      const reason = activeIsOffSegment
                        ? `Your ${name} call was suppressed because the active card is already on the board. NOTE: the active card is BRAIN-IMPROVISED / off-segment — the student is currently working on "${activeStatement.slice(0, 200)}", which differs from segment "${segId}"'s authored content. Do NOT try to re-render the segment's authored card; the student's focus is on the improvised one. RECOVERY: just continue the conversation against the active card — verify the student's answer, give a hint, or wait for their next attempt. If the student is genuinely done with the active card and wants to move on, call advance_lesson or ask them what they want next; do NOT silently render a different problem.`
                        : noProblemObserved
                        ? `Your ${name} call was suppressed because the same problem is already on the board (session-scoped dedup) AND you've already received no_problem_available from generate_problem earlier this session — the bank/plan is exhausted for this concept. RETRY this attempt with ONE of: (1) PREFERRED — improvise an ad-hoc show_problem with clearly different content from anything previously rendered, prefixed by a disclaimer in narration ("here's one off the top of my head, not from the standard bank…"); or (2) ask the student whether they want to switch topic or wrap up. DO NOT call generate_problem again for this anchor — you've already exhausted it. DO NOT re-emit show_segment_card / show_problem with content matching any prior board card. Suppressed: ${JSON.stringify({ name, segId }).slice(0, 200)}.`
                        : `Your ${name} call was suppressed because the same problem is already on the board (session-scoped dedup hit). The student is still looking at the previous problem. Do NOT re-emit show_segment_card or show_problem for an already-completed segment. Recovery options, in order: (1) call generate_problem if you haven't already exhausted it for this anchor; (2) improvise an ad-hoc show_problem with clearly different content + explicit "off-the-cuff" disclaimer in narration; (3) ask the student whether to switch topic or wrap up. Suppressed: ${JSON.stringify({ name, segId }).slice(0, 200)}.`;
                      rejectionsThisAttempt.push({ action: name, reason });
                      await performKill();
                      onDebugEvent?.('dedup_surfaced_as_rejection', `${name} → ${segId}${activeIsOffSegment ? ' (off-segment)' : ''}`);
                      continue;
                    }
                    if (result && Array.isArray(result.rejected) && result.rejected.length > 0) {
                      for (const r of result.rejected) {
                        rejectionsThisAttempt.push(r);
                      }
                      // First rejection in this attempt → cancel any
                      // already-queued/playing audio + stop voicing further
                      // sentences from this attempt. The retry will speak
                      // a fresh corrected response. The kill-bridge phrase
                      // ("Let me try that a different way") plays only if
                      // audible speech has already happened — when the
                      // gate buffered everything and we close it here, no
                      // bridge is needed (the student heard nothing yet).
                      await performKill();
                    } else if (gateState === 'gated' && !skipTurnMarkerPresent) {
                      // Clean tool dispatch — flush any sentences we held
                      // back while waiting for this verdict. Subsequent
                      // rejections still kill this attempt as before.
                      // #4: a render tool does NOT open the gate on a
                      // Skip turn — only advance_lesson/generate_problem
                      // does (handled above). A Skip turn that renders
                      // instead of advancing is exactly the bad case the
                      // Skip-KILL drops; opening here would leak its
                      // partial narration audibly (the Issue 2 bug).
                      clearTimeout(gateTimer);
                      if (TUTOR_VALIDATE_BEFORE_SPEAK) {
                        // Rolling-hold: flush the sentences that preceded
                        // THIS validated tool, but STAY 'gated' so the next
                        // sentences keep buffering until their own following
                        // tool's verdict (or the cap). This is what lets a
                        // LATER rejecting tool drop the wrong sentence before
                        // it's spoken — the gap today's one-shot openGate
                        // leaves open for the rest of the turn.
                        if (!vbsRolling) {
                          console.log('[brain-orchestrator] validate-before-speak: rolling-hold engaged (later sentences buffer until their tool verdict)');
                          onDebugEvent?.('vbs_rolling_engaged', `tool=${name}`);
                        }
                        flushPending();
                        vbsRolling = true;
                      } else {
                        // Legacy: open fully — every later sentence streams
                        // straight to TTS for the rest of the turn.
                        openGate();
                      }
                    }
                  } else {
                    console.warn('[brain-orchestrator] unmapped tool call:', name);
                  }
                } else if (ev.type === 'tool-rejected') {
                  // Server-side validateToolCall reject (claude-brain). Was
                  // silently ignored here; now at least ledgered — and, with
                  // the fallback flag on, content-bearing rejects paint a
                  // plain card (current server reject classes are all
                  // correctness/emptiness, so decideFallbackCard usually
                  // returns null — the hook is for future validator classes).
                  const rejName = (ev as { name?: string }).name ?? '?';
                  const rejReason = (ev as { reason?: string }).reason ?? '';
                  onDebugEvent?.('render_dropped', `${rejName} — ${rejReason.slice(0, 120)} (server-validate)`);
                  if (TUTOR_RENDER_FALLBACK_CARD) {
                    const rejArgs = ((ev as { args?: unknown }).args ?? {}) as Record<string, unknown>;
                    const spec = decideFallbackCard(rejName, rejArgs, rejReason);
                    if (spec) {
                      onDebugEvent?.('render_fallback_card', `${rejName} → "${spec.title}"`);
                      void handleWhiteboardCommand([
                        { action: 'showFallbackCard', ...spec, sourceAction: rejName } as WhiteboardCommand,
                      ]);
                    }
                  }
                } else if (ev.type === 'render-dropped') {
                  // Phase 4.2 drop telemetry: server dropped a render before
                  // it ever reached us (image URL/search failures). Ledger
                  // only — nothing to dispatch or roll back.
                  onDebugEvent?.('render_dropped', `${(ev as { action?: string }).action ?? '?'} — ${(ev as { reason?: string }).reason ?? ''} (server)`);
                } else if (ev.type === 'done') {
                  lastStopReason = (ev.stopReason as string) ?? 'unknown';
                  // `||` not `??`: a give-up done frame (stop=error) can carry
                  // an EMPTY fullText even though sentences were already
                  // spoken — clobbering attemptText to '' purged the turn's
                  // transcript bubble and history entry (2026-07-24 stall
                  // incident: "said something but it got rejected" + stale
                  // caption replay). The server now backfills fullText from
                  // its sentence ledger too; this is the client-side guard.
                  attemptText = (((ev.fullText as string) || attemptText) ?? '').trim();
                  lastUsage = ev.usage as typeof lastUsage;
                  // Task X10: carry the server's brain-unavailable + retry
                  // signals out to the post-stream empty-turn fallback.
                  if (typeof (ev as { retries?: number }).retries === 'number') {
                    serverBrainRetries = (ev as { retries?: number }).retries ?? 0;
                  }
                  if ((ev as { brainUnavailable?: boolean }).brainUnavailable === true) {
                    brainUnavailable = true;
                  }
                  // A1: surface per-attempt usage for cost telemetry (was
                  // debug-log-only, leaving brain sessions at $0 recorded).
                  if (lastUsage) {
                    onBrainUsage?.({
                      inputTokens: lastUsage.inputTokens ?? 0,
                      outputTokens: lastUsage.outputTokens ?? 0,
                      cacheReadTokens: lastUsage.cacheReadTokens ?? 0,
                      cacheCreationTokens: lastUsage.cacheCreationTokens ?? 0,
                    });
                  }
                }
              }
            }
          }
        } finally {
          try { reader.releaseLock(); } catch { /* already released */ }
        }

        // Stream is fully drained. Stop the gate timer (no longer
        // needed) and flush any sentences still gated. This covers fast
        // text-only turns that finished before the timer fired and any
        // stream that ended without a tool ever resolving the gate.
        // No-op when the gate already opened or closed.
        clearTimeout(gateTimer);
        clearVbsCap();
        // #4: a Skip turn that never advanced is about to be Skip-KILLed
        // (deterministic: marker present + no advance). Keep the gate
        // SHUT so that kill drops the buffered partial silently — no
        // audible answer-to-a-skipped-question, no "one moment" bridge
        // (audibleSentenceCount stays 0, so the bridge self-suppresses).
        // On the final attempt the kill is suppressed (audio must play
        // to avoid a frozen lesson) so we flush there as normal. Skip
        // turns that DID advance already opened the gate at that
        // dispatch; every non-skip turn is unaffected.
        const skipNoAdvanceAtStreamEnd =
          skipTurnMarkerPresent &&
          attempt !== MAX_VALIDATOR_RETRIES &&
          !totalToolNamesSeen.some(
            (n) => n === 'advance_lesson' || n === 'generate_problem',
          );
        if (!skipNoAdvanceAtStreamEnd) {
          openGate();
          // Round-15 Issue 2: the stream is done — no further sentence can
          // contradict the held verdict, so it's settled. Flush it (no-op
          // when the hold already released via lookahead/cap, or when a
          // kill dropped it via closeGate).
          releaseVerdictHold();
        }

        // Round-19 (2026-07-17): generation returned a problem but the brain
        // ended its turn without rendering it — the student heard the bridge
        // sentence and then nothing (observed live: "Alright, let me see
        // what I have for you." → stop=end_turn → frozen session). Surface
        // as a rejection so the retry renders the canonicalText.
        if (!attemptKilled
            && generatedProblemReceivedThisAttempt
            && !toolNamesThisAttempt.includes('show_problem')) {
          rejectionsThisAttempt.push({
            action: 'generate_problem_unrendered',
            reason: 'You called generate_problem and RECEIVED a canonicalText in the tool_result, but ended your turn WITHOUT rendering it. The student heard your bridge sentence and then silence — the session looks frozen. RETRY: emit show_problem with `statement` set to the EXACT canonicalText from the tool_result, plus one short spoken line introducing the problem.',
          });
          console.warn('[brain-orchestrator] generate_problem returned a problem but no show_problem followed — killing for retry.');
          onDebugEvent?.('generate_problem_unrendered', 'kill + retry');
          await performKill();
        }

        // Dev forced kill: a short, fully-gated turn flushes its only
        // sentence at stream-end (above), so audibleSentenceCount becomes ≥1
        // only now — fire here too so __tutorForceKill lands even on
        // single-sentence turns (the in-loop check ran before the flush).
        await tryForceKill();

        // Judge-kill Stage 3.1: if this was a post-kill retry whose opener
        // we were still HOLDING (stream ended before we had ≥4 content
        // words / a 2nd sentence — e.g. a 1-sentence or tool-only retry),
        // decide now with whatever's held so the held opener isn't
        // stranded unspoken. Empty held text → not a restatement → snapshot
        // discarded (no replay of unverified content).
        if (resumeArmed && !resumeDecided) {
          decideResume();
        }

        // RULE8 coherence check (promise-without-visual). The brain
        // SAID "let me draw / I'll show / I'm going to plot" but emitted
        // zero render tools (`show_*`). Today this would silently leave
        // the student staring at an empty board while the tutor narrates.
        // Promote to a synthetic rejection so the existing retry loop
        // re-prompts the brain with explicit feedback. Render-only check
        // (show_* prefix) — non-visual tools like advance_lesson /
        // mark_segment_complete / new_page don't satisfy a visual
        // promise. Suppressed once attemptKilled is set so we don't
        // double-stack RULE8 on top of a structural rejection.
        if (
          !attemptKilled &&
          rule8RetriesUsed < MAX_RULE8_RETRIES &&
          attemptText &&
          visualPromiseRegex.test(attemptText) &&
          !toolNamesThisAttempt.some((n) => n.startsWith('show_'))
        ) {
          const promisedSnippet = attemptText.slice(0, 160);
          const reason =
            `You promised a visual ("${promisedSnippet}…") but emitted no show_* render tool. ` +
            `Re-emit your response and INCLUDE the render tool call you promised. ` +
            `If you can't produce a renderable figure right now, rephrase your verbal response to ` +
            `not promise a visual — describe the idea in words instead.`;
          rejectionsThisAttempt.push({ action: 'rule8_promise_without_visual', reason });
          rule8RetriesUsed++;
          await performKill();
          console.warn('[brain-orchestrator] RULE8 violation: promise without visual — retrying');
          onDebugEvent?.('rule8_retry', `Promised visual but no show_* tool: "${promisedSnippet.slice(0, 80)}…"`);
        }

        // Skip-button compliance check. When the student message
        // contains the synthetic [Skip-button-clicked] marker, the
        // system prompt (system-prompt-builder.ts:412) REQUIRES the
        // brain to call advance_lesson (or generate_problem if no
        // segment remains). Observed 2026-05-07 AP Macro session: brain
        // received Skip on try-textbook and emitted new_page +
        // show_segment_card("try-textbook") — the SAME segment, no
        // advance. The render was deduped (same card on board) and the
        // brain narrated "Here's your next problem" while the board sat
        // unchanged. The generic dedup-rejection feedback didn't tell
        // the brain "Skip needs advance" — it just retried with
        // show_problem carrying the identical statement. Detect this
        // structural omission directly.
        if (!attemptKilled) {
          // Source the Skip marker from THIS turn's actual student input
          // (`transcript`, the callBrainOnce arg) — NOT the last pushed
          // 'student' transcript entry. Bracketed synthetic turns
          // (try-yourself submissions, "[The student wrote…]", drawing
          // extraction) are intentionally NOT pushed to transcriptRef
          // (callBrainOnce silent-skip ~line 4571), so a slice(-1) read
          // would return the PREVIOUS real student message — e.g. a
          // stale [Skip-button-clicked] — and re-fire this kill on a
          // turn the student never skipped (observed 2026-05-15: Skip
          // then a try-yourself submission → spurious Skip KILL +
          // ignored submission). `transcript` is stable across validator
          // retries (retries reassign runTranscript, not transcript), so
          // Skip enforcement still persists across a kill→retry within
          // the same genuine Skip turn.
          const skipMarkerPresent = /\[Skip-button-clicked/i.test(transcript);
          // Use totalToolNamesSeen (cross-attempt), NOT toolNamesThisAttempt.
          // The brain only needs to advance ONCE per turn — if attempt 0
          // already emitted advance_lesson and a later attempt is retrying
          // a different rejection (e.g. show_diagram solver failure → retry
          // with show_table), that retry won't re-emit advance_lesson and
          // shouldn't be KILL'd for it. Observed 2026-05-07 AP Macro
          // session: attempt 0 fired advance_lesson + show_diagram; the
          // diagram failed solver pre-check → retry; attempt 1 fired
          // show_table only; per-attempt check false-fired Skip KILL,
          // producing a double "moving on" preamble in the chat.
          const advancedThisTurn = totalToolNamesSeen.some(
            (n) => n === 'advance_lesson' || n === 'generate_problem',
          );
          if (skipMarkerPresent && !advancedThisTurn) {
            const emittedToolsList = totalToolNamesSeen.length > 0
              ? totalToolNamesSeen.join(', ')
              : '(none)';
            const reason =
              `The student clicked the Skip-ahead button — this is a NAVIGATION action requiring the lesson pointer to MOVE. ` +
              `You emitted [${emittedToolsList}] but no advance_lesson and no generate_problem, so the lesson pointer stayed on the current segment and the student saw the same problem they tried to leave. ` +
              `Re-emit your response and INCLUDE either advance_lesson({to: "next"}) (preferred — moves to the next on-topic segment) or generate_problem (if you've reached the end of the lesson plan and need a fresh problem at the current level). ` +
              `Skip is NOT an answer to your prior question — do not affirm, do not state the expected answer, do not re-render the same segment card the student just skipped past. Acknowledge briefly ("got it, moving on") and advance.`;
            rejectionsThisAttempt.push({ action: 'skip_button_no_advance', reason });
            await performKill();
            console.warn('[brain-orchestrator] Skip-button KILL: student clicked Skip but brain emitted no advance_lesson / generate_problem this turn.');
            onDebugEvent?.('skip_button_no_advance', `tools=[${emittedToolsList}]`);
          }
        }

        // Affirmative-after-continuation check (former Rule 15, moved
        // to orchestrator 2026-05-14). When the previous tutor turn
        // ended with a continuation question ("Ready to move on?",
        // "Should we continue?", etc.) and the student replies with a
        // plain affirmative ("yes", "yeah", "sure", "ok", "ready"),
        // the brain MUST advance — but it commonly re-emits scribbles
        // on the same segment instead. Skip-button is handled above;
        // this catches the verbal-affirmative variant. Skip the
        // check when the skip marker is present (already handled) or
        // when the student message carries content beyond the
        // affirmative (e.g. "yes but why X?" — let the brain teach).
        if (!attemptKilled) {
          const lastTutorMsg = transcriptRef.current
            .filter((e) => e.role === 'tutor')
            .slice(-2, -1)[0]?.text || ''; // -2 because the streaming entry for THIS turn is -1
          // Same staleness fix as the Skip check above: source the
          // student message from THIS turn's actual input (`transcript`),
          // not the last pushed 'student' entry. Otherwise a bracketed
          // synthetic turn (e.g. a try-yourself submission) following a
          // plain "yes" after a continuation question would re-read the
          // stale "yes" and spuriously fire affirmative-no-advance.
          // Bracketed synthetic input never matches affirmativeOnlyRegex
          // (leading '['), so synthetic turns correctly skip this gate.
          const lastStudentMsgForAffirm = transcript;
          // Continuation-question detector: tutor's prior turn ended
          // with a "shall we move on?"-style ask. Conservative —
          // requires the question mark within ~80 chars of an
          // advance-intent verb so we don't false-fire on rhetorical
          // "what do you think?".
          const continuationQuestionRegex = /\b(?:ready (?:to|for)|want to|should we|shall we|on to the|move on|got it|next one)\b[^?]{0,80}\?\s*$/i;
          // Affirmative detector: student message is JUST an
          // affirmative (one or two words). Compound replies like
          // "yes but why X?" do NOT match — those carry teaching
          // content the brain should address.
          const affirmativeOnlyRegex = /^\s*(?:yes|yeah|yep|yup|yas|sure|ok|okay|ready|alright|sounds good|let'?s go|let'?s do it|onwards?|next|continue|go|good|cool|fine|great|all good)[\s.!,]*$/i;
          const isAffirmative = affirmativeOnlyRegex.test(lastStudentMsgForAffirm.trim());
          const continuationAsked = continuationQuestionRegex.test(lastTutorMsg.trim());
          const isSkipMsg = /\[Skip-button-clicked/i.test(lastStudentMsgForAffirm);
          const alreadyAdvanced = totalToolNamesSeen.some(
            (n) => n === 'advance_lesson' || n === 'generate_problem',
          );
          if (
            continuationAsked &&
            isAffirmative &&
            !isSkipMsg &&
            !alreadyAdvanced
          ) {
            // SOFT advisory (was a KILL pre-2026-05-23). The kill was
            // tearing down coherent turns: 2026-05-23 opener-merge-stress
            // session, recap segment — brain offered "harder vs wrap up?",
            // student said "Yes", brain (incorrectly) defaulted to the
            // wrap-up branch and rendered a recap table + asked again.
            // KILL fired, rolled back the table, ran a retry that called
            // generate_problem. Student heard ~2s of "Solid session today.
            // Four problems, four key ideas — all up on the board…" CUT,
            // then "Let me see what I have for you. Off the top of my
            // head — here's one for you…" — the "spoke garbage, sounded
            // like correcting itself" UX symptom.
            //
            // The brain's choice (recap table) was a valid response to
            // the ambiguous "Yes"; the rule it violated is the prompt-
            // level "default to continuation on ambiguous yes" guidance.
            // That's a narration-shape rule the orchestrator can't fix
            // mid-stream without UX damage. Surface as a debug event
            // instead — the violation is observable in telemetry, and
            // the conversation history naturally carries the signal into
            // the next brain turn (the brain sees its own non-advance
            // and the student's follow-up; it can self-correct).
            console.warn(
              '[brain-orchestrator] Affirmative-no-advance ADVISORY (no kill): student said "',
              lastStudentMsgForAffirm.trim(),
              '" after a continuation question, brain emitted no advance — tools=[',
              totalToolNamesSeen.join(', ') || '(none)',
              ']. Letting the turn play through.',
            );
            onDebugEvent?.(
              'affirmative_no_advance_advisory',
              `student="${lastStudentMsgForAffirm.slice(0, 30)}" tools=[${totalToolNamesSeen.join(', ')}]`,
            );
          }
        }

        // Try-yourself answer-reveal check (former Rule 18, moved to
        // orchestrator 2026-05-14). When the brain emits show_problem
        // / show_segment_card resolving to a try_yourself segment AND
        // also emits show_equation / show_solution in the SAME turn,
        // the answer is revealed alongside the question — collapses
        // the learning loop. Reject the answer-revealing emission;
        // brain can re-emit it next turn after the student attempts.
        // Limited to try_yourself segments — worked_example
        // intentionally walks through the solution, so show_equation
        // alongside the problem there is correct.
        if (!attemptKilled) {
          const planForRule18 = lessonPlanRef.current;
          const segIdForRule18 = currentSegmentIdRef.current;
          if (planForRule18 && segIdForRule18) {
            const segForRule18 = getSegment(planForRule18, segIdForRule18);
            const isTryYourself = segForRule18?.kind === 'try_yourself';
            if (isTryYourself) {
              // Batch attribution: when the brain transitioned segments
              // mid-turn (advance_lesson / generate_problem in the batch),
              // tools emitted BEFORE that transition belong to the PRIOR
              // segment. A show_equation that lands BEFORE the advance is
              // the prior segment's final-answer reveal on completion —
              // legitimate, NOT an answer-reveal of the new try_yourself.
              // Observed 2026-05-23 (opener-merge-stress session, try-
              // linear → try-ratio): brain emitted [show_equation
              // "x=15/3=5", mark_segment_complete try-linear, advance,
              // show_segment_card try-ratio]; the equation was for the
              // just-completed try-linear but the flat-name check matched
              // against the new try-ratio segment, KILL'd three turns in
              // a row, MAX_VALIDATOR_RETRIES hit, mid-stream audio cut
              // each time → "spoke garbage, sounded like correcting
              // itself" UX symptom.
              const advanceIdx = totalToolNamesSeen.findIndex(
                (n) => n === 'advance_lesson' || n === 'generate_problem',
              );
              const emittedShowProblemForCurrent =
                advanceIdx === -1
                  ? totalToolNamesSeen.some(
                      (n) => n === 'show_problem' || n === 'show_segment_card',
                    )
                  : totalToolNamesSeen.some(
                      (n, i) =>
                        i >= advanceIdx &&
                        (n === 'show_problem' || n === 'show_segment_card'),
                    );
              const emittedAnswerRevealForCurrent =
                advanceIdx === -1
                  ? totalToolNamesSeen.some(
                      (n) => n === 'show_equation' || n === 'show_solution',
                    )
                  : totalToolNamesSeen.some(
                      (n, i) =>
                        i >= advanceIdx &&
                        (n === 'show_equation' || n === 'show_solution'),
                    );
              if (emittedShowProblemForCurrent && emittedAnswerRevealForCurrent) {
                const reason =
                  `You emitted both show_problem/show_segment_card AND show_equation/show_solution for try_yourself segment "${segIdForRule18}" in the same turn — that reveals the answer alongside the question and collapses the learning loop. ` +
                  `Re-emit this turn WITHOUT the show_equation/show_solution. Present only the problem and wait for the student's attempt. After the student answers (correctly or not), THAT'S when you reveal the worked answer / equation in a follow-up turn. ` +
                  `Tool whitelist for this turn: show_problem (or show_segment_card), new_page, scribble/handwrite on the problem card, and a brief verbal prompt. No equation, no solution, no answer narration.`;
                rejectionsThisAttempt.push({ action: 'try_yourself_answer_reveal', reason });
                await performKill();
                console.warn(`[brain-orchestrator] try_yourself answer-reveal KILL on segment "${segIdForRule18}".`);
                onDebugEvent?.('try_yourself_answer_reveal', `segId="${segIdForRule18}" tools=[${totalToolNamesSeen.join(', ')}]`);
              } else if (
                advanceIdx !== -1 &&
                totalToolNamesSeen.some(
                  (n, i) =>
                    i < advanceIdx && (n === 'show_equation' || n === 'show_solution'),
                )
              ) {
                // Exempt path — there WAS a show_equation/show_solution
                // in the batch, but it landed before the advance and so
                // belongs to the prior segment. Surface as a debug event
                // for observability; not a kill.
                onDebugEvent?.(
                  'try_yourself_answer_reveal_exempt_prior_segment',
                  `segId="${segIdForRule18}" advanceIdx=${advanceIdx} tools=[${totalToolNamesSeen.join(', ')}]`,
                );
              }
            }
          }
        }

        // Disclaimer verbatim-reuse guard (2026-05-23). The
        // "Bridge utterance for generate_problem" prompt rule says to
        // VARY the hedged bridge + improvise disclaimer across turns,
        // but the brain reuses them verbatim on consecutive
        // generate_problem hits — observed live in T18 + T19 of the
        // opener-merge-stress session: both turns opened with "Let me
        // see what I have for you. Off the top of my head — here's one
        // for you." byte-identical. Hearing the same disclaimer twice
        // in 10s is the failure mode this guard prevents. Detection:
        // normalize the brain's first 60 chars and compare against the
        // prior turn's stored value; on identity AND a generate_problem
        // tool call this turn, kill + retry to force variation. One-
        // retry cost (~$0.07) is cheap vs the UX cost. Limited to
        // attempt 0 — if the retry still produces a match, we let it
        // play through (MAX_VALIDATOR_RETRIES caps the loop anyway).
        if (!attemptKilled && attempt === 0 && attemptText) {
          const calledGenerateProblem = totalToolNamesSeen.includes('generate_problem');
          // Tightened 2026-05-24 (item A): compare sentence-1 ONLY, not
          // the first 60 chars. Sentence-1 comparison is the right
          // granularity for the "VARY across turns" rule, which is
          // about the spoken opener.
          //
          // Softened 2026-05-24 from kill+retry → silent advisory.
          // Live experience 2026-05-24: a verbatim-reuse kill produces
          // a kill bridge sound + a retry, which the student perceives
          // as a stutter/hiccup — worse UX than just hearing the same
          // opener twice. Same logic as the Affirmative-no-advance
          // softening: log the violation for telemetry, let the turn
          // play through. Brain sees its own duplicate in conversation
          // history and naturally rotates on the next turn.
          const normalized = extractSentence1Normalized(attemptText);
          if (
            calledGenerateProblem &&
            normalized.length >= 15 &&
            lastBrainOpenerNormalizedRef.current &&
            lastBrainOpenerNormalizedRef.current === normalized
          ) {
            console.warn(
              `[brain-orchestrator] disclaimer verbatim-reuse ADVISORY (no kill) — sentence-1 matches prior turn ("${normalized.slice(0, 60)}"). Letting the turn play through; brain should self-rotate next turn.`,
            );
            onDebugEvent?.(
              'disclaimer_verbatim_reuse_advisory',
              `s1="${normalized.slice(0, 60)}"`,
            );
          }
        }

        // requiredPhrases narrative-anchor check. When a segment
        // declares `requiredPhrases: [...]`, the brain's narration on
        // the FIRST non-trivial turn (≥3 sentences) for that segment
        // must contain each phrase as a case-insensitive substring.
        // Observed 2026-05-15: BST segment description specified
        // "search for value 6" but the brain substituted 13 — the
        // whole multi-turn trace ran against the wrong target, judge
        // kills came late, retries thrashed. requiredPhrases pins the
        // narrative param at segment-entry so substitution gets caught
        // before the trace commits. Fires once per segment; later
        // turns aren't checked (mid-trace re-narration is worse than
        // letting the anchor slide). Threshold of 3 sentences avoids
        // false-firing on a brief connector turn that legitimately
        // delays the example.
        if (!attemptKilled) {
          const planForPhrases = lessonPlanRef.current;
          const segIdForPhrases = currentSegmentIdRef.current;
          // 2026-05-15 (#3): suppress the check on a turn that
          // auto-advanced INTO this segment. When the brain emits
          // advance_lesson / generate_problem mid-turn, currentSegmentId
          // is already the NEW segment but attemptText is the PRIOR
          // segment's affirmation + a brief transition ("Exactly right!
          // … Nice work! Let's move on…") — not teaching content for the
          // new segment, so it legitimately won't contain the anchor
          // phrase. Killing here false-positives a correct, well-formed
          // turn (observed: ArrayList answer affirmed → killed because
          // BST's 'value 6' wasn't said yet → student heard their
          // correct answer cut by a kill bridge). Defer the anchor to
          // the next turn that actually teaches the segment (don't kill,
          // don't mark checked) so it still fires on the real teaching
          // turn and still catches sustained value-substitution.
          const advancedIntoSegmentThisTurn = totalToolNamesSeen.some(
            (n) => n === 'advance_lesson' || n === 'generate_problem',
          );
          if (
            planForPhrases &&
            segIdForPhrases &&
            advancedIntoSegmentThisTurn &&
            !segmentRequiredPhrasesCheckedRef.current.has(segIdForPhrases)
          ) {
            console.warn(
              `[brain-orchestrator] requiredPhrases check deferred on "${segIdForPhrases}" — turn auto-advanced into the segment (transition turn, not a teaching turn).`,
            );
            onDebugEvent?.('required_phrase_check_deferred', `segId="${segIdForPhrases}" (auto-advance transition turn)`);
          }
          if (
            planForPhrases &&
            segIdForPhrases &&
            !advancedIntoSegmentThisTurn &&
            !segmentRequiredPhrasesCheckedRef.current.has(segIdForPhrases)
          ) {
            const segForPhrases = getSegment(planForPhrases, segIdForPhrases);
            const required = (segForPhrases as { requiredPhrases?: string[] } | undefined)?.requiredPhrases;
            if (Array.isArray(required) && required.length > 0 && totalSentenceCount >= 3 && attemptText) {
              const haystack = attemptText.toLowerCase();
              const missing = required.filter((p) => !haystack.includes(p.toLowerCase()));
              if (missing.length > 0) {
                const reason =
                  `Your narration for segment "${segIdForPhrases}" is missing required phrase(s): ${missing.map((m) => `"${m}"`).join(', ')}. ` +
                  `This segment pins specific narrative parameters (target values, example inputs, etc.) that you must reference verbatim — substituting a different value mid-segment desynchronizes the lesson from the board/segment-card and the student's tracking. ` +
                  `Re-emit your response with each required phrase appearing at least once in the spoken narration.`;
                rejectionsThisAttempt.push({ action: 'required_phrase_missing', reason });
                await performKill();
                console.warn(`[brain-orchestrator] requiredPhrases miss on segment "${segIdForPhrases}": missing=[${missing.join(', ')}]`);
                onDebugEvent?.(
                  'required_phrase_missing',
                  `segId="${segIdForPhrases}" missing=[${missing.join(', ')}]`,
                );
              }
              segmentRequiredPhrasesCheckedRef.current.add(segIdForPhrases);
            }
          }
        }

        // Judge LLM groundedness check (Lever B1). Only fires when the
        // attempt produced spoken text AND wasn't already killed by a
        // structural rejection (no point judging speech we're about to
        // throw away). Calls Haiku with the post-render board snapshot
        // + the brain's full spoken text; ungrounded claims become a
        // synthetic rejection that feeds the existing retry loop.
        // Domain-agnostic by design — works for math number mismatches,
        // chemistry diagram claims, ELA passage refs, code line refs.
        if (!attemptKilled && judgeRetriesUsed < MAX_JUDGE_RETRIES && attemptText && attemptText.trim().length > 0) {
          try {
            const boardSummary = buildWhiteboardSummary(catalogRef.current.getSnapshot(segmentSnapshotOpts));
            // Diagnostic: log the boardSummary head so the judge's view
            // of the whiteboard is visible in serverlog_*.txt next to the
            // KILL decision. Helps debug false-empty kills where the
            // catalog snapshot doesn't reflect tools the brain just
            // emitted (timing race, segment-filter exclusion, etc.).
            console.log(`[judge] boardSummary chars=${boardSummary.length} head="${boardSummary.slice(0, 120).replace(/\n/g, ' ⏎ ')}"`);
            // Defensive short-circuit: if the snapshot reads empty but
            // the brain just successfully emitted at least one show_*
            // tool in THIS attempt, skip the judge call. The judge can
            // never know more than the catalog; if the catalog is empty
            // when render tools just fired, it's a snapshot-timing race
            // (or segment-filter exclusion), not a real chat-board
            // mismatch. Killing on this would loop until
            // MAX_VALIDATOR_RETRIES with no real fix possible (observed
            // 2026-05-07 K-2 comparing-numbers test session).
            const showToolsEmitted = toolNamesThisAttempt.filter((n) => n.startsWith('show_')).length;
            // Two snapshot-race cases produce false KILLs:
            //   (a) boardSummary === empty but show_* tools just emitted —
            //       catalog hasn't registered yet (original case).
            //   (b) boardSummary is NON-empty but stale (contains prior-turn
            //       content) and the just-emitted show_* tools haven't
            //       propagated yet. Brain narrates the new content and the
            //       judge contradicts it against the old snapshot — observed
            //       2026-05-07 incline-pulley session, three KILLs in a row
            //       hit MAX_VALIDATOR_RETRIES and the final reply never
            //       reached the chat. Detect (b) by checking whether ANY
            //       title/identifier the brain just emitted appears in the
            //       summary; if not, the summary is stale.
            const titlesEmitted = toolArgsThisAttempt
              .map((args) => {
                if (!args || typeof args !== 'object') return '';
                const a = args as Record<string, unknown>;
                const t = a.title;
                return typeof t === 'string' ? t : '';
              })
              .filter((s) => s.length > 0);
            const summaryReflectsNewTools =
              titlesEmitted.length === 0
                ? true
                : titlesEmitted.some((t) => boardSummary.includes(t));
            // Compute studentAnswer first — used for both the
            // snapshot-race decision below and the judge request body.
            // Strip synthetic markers so the judge sees just the
            // student's words. Empty / synthetic transcripts → undefined.
            const studentAnswer = (() => {
              if (typeof transcript !== 'string') return undefined;
              const stripped = transcript
                .replace(/\[(?:Skip-button-clicked|I'm-stuck-button-clicked|start lesson|validator feedback)[^\]]*\]/gi, '')
                .trim();
              return stripped.length > 0 ? stripped : undefined;
            })();
            const isSnapshotRace =
              showToolsEmitted > 0 &&
              (boardSummary === '(whiteboard is empty)' || !summaryReflectsNewTools);
            // Stale-snapshot handling: Path A (board contradiction) can't
            // operate on a stale board, but Path B (self-contradicting
            // affirmation) doesn't need the board at all — it only needs
            // studentAnswer + brain spokenText. Previously we skipped the
            // judge entirely on stale snapshot, which let wrong-answer
            // affirmations through unchecked (observed 2026-05-15: brain
            // affirmed "Exactly!" on student's wrong remove(20), turn
            // emitted new_page + show_geometry_constructed → judge
            // skipped → no Path B). When stale AND studentAnswer is
            // present, run the judge with an EMPTY boardSummary. Path A
            // can't fabricate a citation against nothing; Path B runs
            // normally.
            const shouldRunJudgeOnStale = isSnapshotRace && !!studentAnswer;
            if (isSnapshotRace && !shouldRunJudgeOnStale) {
              const reason =
                boardSummary === '(whiteboard is empty)'
                  ? 'empty snapshot'
                  : `stale snapshot — ${titlesEmitted.length} new tool title(s) not yet in summary`;
              console.warn(`[judge] skip — ${reason}; ${showToolsEmitted} show_* tool(s) just emitted; no studentAnswer. Letting speech through.`);
              onDebugEvent?.('judge_skip_empty_snapshot', `tools=${showToolsEmitted}; ${reason}`);
              // Pass through — no judge fetch, treat as grounded.
            } else {
            // Focus = the most recently rendered problem statement.
            // Without focus, the judge passes any speech that's grounded
            // against ANY card on the board — exactly the failure mode
            // in the 2026-04-29 algebra session where two coexisting
            // problem cards (free-form 16/8 + authored 12/4) let the
            // judge pass speech that matched ONE while the student
            // attended to the OTHER. Focus tells the judge "this is
            // the card the student is looking at; flag claims that
            // contradict it specifically."
            const focus = currentProblemRef.current?.statement ?? undefined;
            // When running on stale snapshot, send empty boardSummary so
            // Path A can't fire and Path B still has what it needs.
            const judgeBoardSummary = shouldRunJudgeOnStale ? '' : boardSummary;
            if (shouldRunJudgeOnStale) {
              console.warn(`[judge] stale snapshot but studentAnswer present — running with empty board for Path B coverage.`);
              onDebugEvent?.('judge_stale_snapshot_path_b_only', `tools=${showToolsEmitted}`);
            }
            const judgeRes = await fetch('/api/tutor/judge', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ boardSummary: judgeBoardSummary, spokenText: attemptText, focus, studentAnswer }),
            });
            if (judgeRes.ok) {
              const judgeJson = await judgeRes.json() as { grounded: boolean; issues: Array<{ claim: string; why: string; severity?: 'kill' | 'advisory' }> };
              // Per-issue severity gating. Default policy is still
              // ADVISORY (no kill) for soft claims — the 2026-04-29
              // ocean session showed false-positive kills are worse
              // than false-negative misses for tone/phrasing/common-
              // knowledge issues. BUT for narrow concrete claims that
              // produce an obvious chat-board mismatch (numeric /
              // dataset / literal contradictions of the board), the
              // judge can mark severity="kill" and the orchestrator
              // honors it. 2026-05-02 session showed the judge
              // correctly flagged a brain-hallucinated dataset that
              // wasn't on the board, but advisory-only logging let
              // the brain teach with the wrong dataset for the rest
              // of the median walkthrough.
              if (!judgeJson.grounded && judgeJson.issues.length > 0) {
                const rawKillIssues = judgeJson.issues.filter((i) => i.severity === 'kill');
                const advisoryIssues: Array<{ claim: string; why: string; severity?: 'kill' | 'advisory' }> = judgeJson.issues.filter((i) => i.severity !== 'kill');
                // Round-7+++++ Issue 3 fix: Wolfram-verified override.
                // The judge sometimes hallucinates arithmetic and KILLs
                // a brain claim that's actually correct (and already
                // wolfram-verified on the board). When a kill claim's
                // integer tokens overlap with a wolfram-verified
                // equation's tokens, downgrade the kill to advisory —
                // Wolfram's exact arithmetic outranks the judge LLM's
                // heuristic check. Threshold: ≥2 tokens overlap OR
                // the single key result token (e.g., "73") is in the
                // verified set, which catches "73 is the mean" claim
                // matching a verified "511/7=73" equation.
                const wolframOverrideHits: typeof rawKillIssues = [];
                const killIssues: typeof rawKillIssues = [];
                for (const issue of rawKillIssues) {
                  const claimNums = (issue.claim.match(/\d+/g) ?? []).filter((n) => n.length > 0);
                  // Round-7++++++ Issue 5 fix: tighter override match.
                  // Three accept conditions:
                  //   (a) joined-key exact tuple match — strongest signal
                  //       that the claim references a specific verified
                  //       equation.
                  //   (b) for SHORT claims (≤ 2 unique tokens), any of
                  //       those tokens being in the flat verified union
                  //       is sufficient — covers "the mean is 73" /
                  //       "73 is the answer" against a verified
                  //       511/7=73 equation.
                  //   (c) for LONGER claims (≥ 3 unique tokens), require
                  //       that some SINGLE verified equation's token set
                  //       overlaps the claim's tokens by ≥ ceil(N/2) AND
                  //       that overlap is ≥ half of THAT equation's set
                  //       too (so a verified short equation doesn't
                  //       accidentally match a long unrelated claim by
                  //       coincidence). The flat-union test is dropped
                  //       for longer claims — it accumulates across the
                  //       session and produces false matches once many
                  //       integers have been verified.
                  const uniqClaim = [...new Set(claimNums)];
                  const joinedKey = uniqClaim.sort().join('|');
                  const joinedHit = !!joinedKey && wolframVerifiedNumberSetsRef.current.has(joinedKey);
                  let perEqHit = false;
                  if (uniqClaim.length <= 2) {
                    // Short-claim path: any flat-union overlap counts.
                    for (const n of uniqClaim) {
                      if (wolframVerifiedNumberSetsRef.current.has(n)) { perEqHit = true; break; }
                    }
                  } else {
                    // Long-claim path: require strong overlap against a
                    // SINGLE verified equation.
                    const claimSet = new Set(uniqClaim);
                    const claimReq = Math.ceil(uniqClaim.length / 2);
                    for (const eqSet of wolframVerifiedEquationsRef.current) {
                      let overlap = 0;
                      for (const t of claimSet) {
                        if (eqSet.has(t)) overlap++;
                      }
                      const eqReq = Math.ceil(eqSet.size / 2);
                      if (overlap >= claimReq && overlap >= eqReq) {
                        perEqHit = true;
                        break;
                      }
                    }
                  }
                  if (joinedHit || perEqHit) {
                    wolframOverrideHits.push(issue);
                  } else {
                    killIssues.push(issue);
                  }
                }
                if (wolframOverrideHits.length > 0) {
                  console.warn(`[brain-orchestrator] judge KILL → ADVISORY (wolfram-override) — ${wolframOverrideHits.length} claim(s) match wolfram-verified equations`);
                  onDebugEvent?.('judge_kill_wolfram_override', `${wolframOverrideHits.length}: ${wolframOverrideHits[0].claim.slice(0, 60)}…`);
                  for (const i of wolframOverrideHits) advisoryIssues.push(i);
                }
                // Round-7+++++ Issue 4 fix: judge-claim grounding override.
                // Sometimes the judge LLM hallucinates a claim the brain
                // never actually said and KILLs based on it; the retry
                // then plays alongside the (correct) original audio,
                // producing a "two voices" overlap and confusing speech.
                // Conservative grounding check: if the kill claim's text
                // (3-word n-grams of alphanumeric tokens) doesn't appear
                // with substantial overlap in the brain's spoken text
                // from this turn, downgrade to advisory. Threshold (30%
                // matched trigrams) is calibrated so paraphrases of real
                // claims still trigger the kill; pure hallucinations
                // don't. Observed 2026-05-04 JEE rolling-step turn:
                // judge KILLed on alleged "I_P = I_cm + MR²" but brain's
                // actual text only referenced
                // "L_before = ½MR²·(v/R) + Mv(R-h/4)" — different
                // equation, judge fabricated the form.
                const normForGrounding = (s: string): string => s
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, ' ')
                  .replace(/\s+/g, ' ')
                  .trim();
                const sourceNorm = normForGrounding(attemptText);
                const groundingOverrideHits: typeof rawKillIssues = [];
                for (let kIdx = killIssues.length - 1; kIdx >= 0; kIdx--) {
                  const issue = killIssues[kIdx];
                  const claimNorm = normForGrounding(issue.claim);
                  const claimWords = claimNorm.length > 0 ? claimNorm.split(' ') : [];
                  // Need at least 3 words for trigrams. Short claims
                  // default to keep-as-kill (over-conservative — better
                  // a false-positive kill on a short claim than a
                  // false-negative-downgrade of a real contradiction).
                  if (claimWords.length < 3) continue;
                  let matched = 0;
                  let total = 0;
                  for (let i = 0; i <= claimWords.length - 3; i++) {
                    const tri = claimWords.slice(i, i + 3).join(' ');
                    total++;
                    if (sourceNorm.includes(tri)) matched++;
                  }
                  const ratio = total > 0 ? matched / total : 1;
                  if (ratio < 0.3) {
                    groundingOverrideHits.push(issue);
                    advisoryIssues.push(issue);
                    killIssues.splice(kIdx, 1);
                  }
                }
                if (groundingOverrideHits.length > 0) {
                  console.warn(`[brain-orchestrator] judge KILL → ADVISORY (grounding-override) — ${groundingOverrideHits.length} claim(s) not substantially present in brain's spoken text`);
                  onDebugEvent?.('judge_kill_grounding_override', `${groundingOverrideHits.length}: ${groundingOverrideHits[0].claim.slice(0, 60)}…`);
                }
                // Defense-in-depth: as of 2026-05-15 the judge prompt
                // restricts kill severity to Path B (self-contradicting
                // affirmation) only. Board-contradiction claims are
                // flagged as advisory by the prompt and never reach this
                // path. The Wolfram and grounding overrides above still
                // catch the deterministic numeric / spoken-text cases.
                // The citation-verification override that used to live
                // here was retired in the same commit — Haiku could
                // fabricate citations confidently, so the deterministic
                // approach is to not let the LLM judge kill on board
                // claims at all.
                if (advisoryIssues.length > 0) {
                  console.warn(`[brain-orchestrator] judge ADVISORY (no kill) — ${advisoryIssues.length} flagged claim(s):`,
                    advisoryIssues.map((i) => i.claim.slice(0, 80)));
                  onDebugEvent?.('judge_advisory_flag', `${advisoryIssues.length} issue(s): ${advisoryIssues[0].claim.slice(0, 60)}…`);
                }
                if (killIssues.length > 0) {
                  const summary = killIssues.map((i, idx) =>
                    `(${idx + 1}) Claim: "${i.claim.slice(0, 120)}" — ${i.why.slice(0, 200)}`
                  ).join(' ');
                  // Pillar 2b (robustness): the judge is now ADVISORY-ONLY.
                  // This branch is the last LLM kill path — and it's
                  // POST-STREAM, so a kill here re-fetches + re-narrates a
                  // turn the student already heard (the "spoke-then-
                  // corrected" UX) on a HIGH-false-positive signal (Haiku
                  // can flag claims the brain never made). Telemetry +
                  // reassertion detection are preserved; the performKill is
                  // removed. The brain still self-grounds from the
                  // <whiteboard_state> snapshot each turn, and the
                  // deterministic Wolfram/grounding overrides above still
                  // suppress the numeric false positives.
                  console.warn(`[brain-orchestrator] judge ADVISORY (no kill — Pillar 2b) — ${killIssues.length} board-contradiction claim(s):`, summary);
                  onDebugEvent?.('judge_advisory_was_kill', `${killIssues.length}: ${killIssues[0].claim.slice(0, 60)}…`);
                  // Round-7 Fix D: detect re-assertion loops. Tokenize
                  // each new claim into structural tokens (multi-digit
                  // numbers, multi-char identifiers, and bracketed
                  // dataset fragments — exactly the kinds of literals
                  // the judge flags as contradictory). Compare against
                  // the bag of tokens accumulated from prior KILLs in
                  // this turn. ≥2 shared tokens → same-pattern repeat.
                  // 0-1 shared → genuinely different content (escalate
                  // would mis-fire). The threshold is calibrated to
                  // catch dataset-restated kills (those overlap on
                  // every digit) without firing on shared filler words.
                  const tokenize = (s: string): string[] => {
                    const out: string[] = [];
                    const re = /\d{2,}|[A-Za-z]{4,}|\{[^}]{1,40}\}/g;
                    let m: RegExpExecArray | null;
                    while ((m = re.exec(s.toLowerCase())) !== null) out.push(m[0]);
                    return out;
                  };
                  const newTokens = new Set(killIssues.flatMap((i) => tokenize(i.claim)));
                  const priorTokens = new Set(priorJudgeKillClaimsThisTurn.flatMap(tokenize));
                  let overlap = 0;
                  for (const t of newTokens) if (priorTokens.has(t)) overlap++;
                  const isReassertion = priorJudgeKillClaimsThisTurn.length > 0 && overlap >= 2;
                  // Reassertion telemetry retained (advisory now): a repeated
                  // same-token flag across the turn is still a useful signal
                  // even though we no longer kill on it.
                  if (isReassertion) {
                    console.warn(`[brain-orchestrator] judge advisory — ESCALATED (re-assertion loop, ${priorJudgeKillClaimsThisTurn.length + 1}× this turn, overlap=${overlap})`);
                    onDebugEvent?.('judge_advisory_escalated', `count=${priorJudgeKillClaimsThisTurn.length + 1} overlap=${overlap}`);
                  }
                  for (const i of killIssues) priorJudgeKillClaimsThisTurn.push(i.claim);
                }
              } else {
                onDebugEvent?.('judge_pass', `grounded · ${attemptText.slice(0, 50)}…`);
              }
            } else {
              console.warn('[brain-orchestrator] judge call failed:', judgeRes.status);
            }
            } // close: empty-snapshot short-circuit guard's else branch
          } catch (err) {
            // Fail-open on network errors — don't block the conversation
            // on a flaky judge call. The error is logged for observability.
            console.warn('[brain-orchestrator] judge error (failing open):', err);
          }
        }

        // #4 safety backstop: after every post-stream check, if the
        // gate is still held and the attempt was NOT killed, flush now.
        // Guarantees no turn ends with buffered-but-unspoken text and no
        // kill (a silent turn). A killed skip-no-advance attempt leaves
        // attemptKilled=true here, so its buffered partial correctly
        // stays dropped; every other path already opened the gate.
        if (gateState === 'gated' && !attemptKilled) {
          openGate();
        }

        // Only the WINNING attempt's text goes into aggregatedFullText
        // (which becomes the tutor turn in transcriptRef + the brain's
        // memory of "what I said"). Killed attempts are dropped — the
        // student didn't hear them and Claude shouldn't pretend it did.
        if (!attemptKilled) {
          aggregatedFullText = aggregatedFullText
            ? `${aggregatedFullText} ${attemptText}`
            : attemptText;
          // 2026-05-23 disclaimer verbatim-reuse guard — commit this
          // attempt's normalized opener as the comparison baseline for
          // the NEXT turn. Only on non-killed attempts so a killed
          // duplicate doesn't pollute the baseline (the retry's text is
          // what actually landed). Empty attemptText falls through to
          // an empty string, which is harmless: the next turn's check
          // requires normalized.length >= 20 to fire.
          if (attemptText) {
            lastBrainOpenerNormalizedRef.current = extractSentence1Normalized(attemptText);
          }
        }

        // No rejections OR we've burned the retry budget → done with this turn.
        if (rejectionsThisAttempt.length === 0 || attempt === MAX_VALIDATOR_RETRIES) {
          if (rejectionsThisAttempt.length > 0) {
            console.warn(
              `[brain-orchestrator] hit MAX_VALIDATOR_RETRIES with ${rejectionsThisAttempt.length} rejection(s); giving up.`,
            );
            // 2026-05-15: when give-up includes a show_* render failure
            // (solver pre-check rejection, prescribedRender mismatch,
            // prescribedRender wrong-tool), the brain's narration has
            // likely referenced board content that never landed (e.g.,
            // "Take a look at the PPC on the board — points A, B, C,
            // and D all sit on the curve" when show_diagram was
            // rejected). Without cancellation the student hears
            // narration anchored to absent renders. Cancel in-flight
            // TTS, mark attempt as killed (so text isn't added to
            // aggregatedFullText / brain memory), and remove the
            // streaming chat entry. The student is left with a clean
            // page state; their next input triggers a fresh brain turn
            // that re-emits the corrected render.
            const hasRenderFailure = rejectionsThisAttempt.some((r) => {
              const a = r.action || '';
              return a.startsWith('show_') || a.includes('_prescribed_');
            });
            if (hasRenderFailure && !attemptKilled) {
              await clearSpeechQueueRef.current?.();
              attemptKilled = true;
              closeGate();
              const killedStreamingId = `tutor-streaming-${t0}-${attempt}`;
              const beforeLen = transcriptRef.current.length;
              transcriptRef.current = transcriptRef.current.filter((e) => e.id !== killedStreamingId);
              if (transcriptRef.current.length !== beforeLen) {
                onTranscriptUpdate([...transcriptRef.current]);
              }
              console.warn('[brain-orchestrator] give-up included show_* render failure — cancelled TTS + dropped attempt text to avoid orphaned narration.');
              onDebugEvent?.(
                'give_up_render_kill',
                `rejections=${rejectionsThisAttempt.map((r) => r.action).join(',')}`,
              );
              // Pull any renders this give-up attempt DID land off the
              // board too — the narration was just cancelled, so they
              // would otherwise sit orphaned (and export into the PDF).
              // Item B scope: only renders emitted AFTER advance_lesson
              // are part of the failed-new-segment work; pre-advance
              // renders belong to the now-completed prior segment.
              const giveUpRollbackTargets =
                renderCountAtAdvance !== null
                  ? renderIdsThisAttempt.slice(renderCountAtAdvance)
                  : renderIdsThisAttempt;
              if (TUTOR_KEEP_VALIDATED_ON_KILL) {
                // Keep validated renders that no later render superseded (e.g.
                // wolfram-correct equations collateral to the failed figure);
                // sweep only the genuinely stale ones. The give-up targets were
                // freshly painted (never dimmed), so kept ones need no un-dim.
                const { keep, sweep } = planKillKeep(giveUpRollbackTargets);
                if (sweep.length > 0) rollbackKilledRenders(sweep);
                if (keep.length > 0) {
                  onDebugEvent?.('killed_render_kept_validated', `give-up ${keep.length}: ${keep.join(',')}`);
                }
              } else {
                rollbackKilledRenders(giveUpRollbackTargets);
              }
            }
          }
          break;
        }

        // Build a follow-up turn that echoes Claude's just-completed
        // attempt as an assistant turn (so Claude can see what it
        // emitted) and frames the rejection as a system-style user
        // turn (validators are the runtime, not the student).
        console.log(
          `[brain-orchestrator] attempt ${attempt + 1} produced ${rejectionsThisAttempt.length} rejection(s); retrying.`,
        );
        onDebugEvent?.(
          'brain_validator_retry',
          `Retrying: ${rejectionsThisAttempt.map((r) => `${r.action}: ${r.reason.slice(0, 60)}`).join('; ')}`,
        );
        const summarizedRejections = rejectionsThisAttempt
          .map((r, i) => `[${i + 1}] ${r.action}: ${r.reason}`)
          .join('\n');
        runHistory = [
          ...runHistory,
          { role: 'user', content: runTranscript },
          { role: 'assistant', content: attemptText || '(emitted only tool calls)' },
        ];
        // Speech-delivery hint: the prior attempt's spoken text was
        // either delivered in full (no judge KILL → no kill bridge) or
        // cut off mid-stream (judge KILL fired). The brain needs to
        // know which one happened so it doesn't re-narrate text the
        // student already heard. Without this distinction, structural
        // retries cause the brain to re-state its full hook + question,
        // and aggregatedFullText accumulates BOTH versions — the
        // student hears the same content twice (sometimes with
        // contradicting numbers if the judge KILLed a stat that the
        // brain then "corrected" in re-narration).
        const speechDeliveryNote = attemptKilled
          ? `Your spoken text from the prior attempt was CUT OFF by a kill bridge, so the student heard only a partial version. Re-deliver the spoken portion in full so they get a complete narration. If you asked a question, re-ask it and wait; do not answer it yourself or skip ahead. No new student input has occurred since your last attempt. Do NOT open with an affirmation or reference any student answer (real or imagined) — just re-deliver your prior teaching content with the required correction applied.`
          : `Your spoken text from the prior attempt was DELIVERED IN FULL to the student. Do NOT repeat the same narration — the student already heard it. In this turn, focus on emitting the corrected tool call(s) and speak only a brief connector (≤ one short sentence) if speech is needed at all. If you asked a question on the prior attempt and the student hasn't answered yet, just wait; do not re-ask.`;
        runTranscript =
          `[validator feedback — not from the student] Your last turn emitted ` +
          `tool call(s) that the runtime structural validator rejected:\n${summarizedRejections}\n` +
          `Re-emit the corrected tool call(s). Don't apologize; the student doesn't see this message. ` +
          speechDeliveryNote;
        // Kill-recovery (B): DEFER rolling the killed attempt's renders off the
        // board. Yanking them here and re-adding on the retry is the board
        // flash. Instead, stash the ids in pendingRevisionRef and leave the
        // renders on the board + in the dedup catalog. A restatement retry that
        // re-emits them identically will dedup-drop and CONFIRM them (kept, no
        // flash); a correction renders different content and these stale ids
        // are rolled back in the end-of-call cleanup (which still fixes the
        // 2026-05-15 two-BSTs pile-up — just at end-of-call instead of
        // pre-retry). Gated on attemptKilled; Item B scope (2026-05-24): only
        // renders emitted AFTER advance_lesson are part of the failed segment.
        if (attemptKilled) {
          const retryRollbackTargets =
            renderCountAtAdvance !== null
              ? renderIdsThisAttempt.slice(renderCountAtAdvance)
              : renderIdsThisAttempt;
          const deferIds = retryRollbackTargets.filter(Boolean);
          for (const id of deferIds) pendingRevisionRef.current.add(id);
          // Phase A: dim the deferred renders during the recovery gap. They're
          // un-dimmed on confirm (restatement re-render dedup-drops) or removed
          // on cleanup (correction / abort).
          if (deferIds.length > 0) {
            onWhiteboardCommand([{ action: 'reviseItems', ids: deferIds, revising: true }]);
          }
        }
        // DIM (don't yank) the killed attempt's streaming bubble. A retry is
        // coming, so instead of removing the text — which leaves a blank gap
        // until the retry re-streams seconds later (jarring, esp. on a slow
        // link) — we mark it `revising` so TranscriptView fades it. The new
        // attempt's bubble removes all revising bubbles for this turn the
        // moment it starts streaming (see the streaming-reveal block), giving
        // a smooth dim → replace hand-off rather than vanish → reappear.
        const killedStreamingId = `tutor-streaming-${t0}-${attempt}`;
        let changedRevise = false;
        transcriptRef.current = transcriptRef.current.map((e) => {
          if (e.id === killedStreamingId && !e.revising) {
            changedRevise = true;
            return { ...e, revising: true, streaming: false };
          }
          return e;
        });
        if (changedRevise) {
          onTranscriptUpdate([...transcriptRef.current]);
        }
      }

      const ms = Date.now() - t0;
      const fullText = aggregatedFullText.trim();
      console.log(
        `[brain-orchestrator] turn ok in ${ms}ms · ${totalToolNamesSeen.length} tool call(s) · ${totalSentenceCount} sentence(s) · ` +
        `first_sentence=${firstSentenceMs}ms · text="${fullText.slice(0, 80)}${fullText.length > 80 ? '…' : ''}" · ` +
        `tools=[${totalToolNamesSeen.join(', ')}] · stop=${lastStopReason} · retries=${serverBrainRetries}${brainUnavailable ? ' BRAIN_UNAVAILABLE' : ''} · ` +
        `in=${lastUsage?.inputTokens} out=${lastUsage?.outputTokens} cache_read=${lastUsage?.cacheReadTokens}`,
      );
      onDebugEvent?.('brain_turn', `Brain ${ms}ms · ${totalToolNamesSeen.length} tool call(s) · ${totalSentenceCount} sentence(s) · first_sentence=${firstSentenceMs}ms`);
      // R32: a stream that died AFTER sentences played used to just... stop —
      // indistinguishable from the tutor finishing (silence audit, worst unmarked
      // gap; live case: the 35.7s stop=error turn in portal-3d7800b3). Ask the
      // brain to finish its own thought. One attempt per turn; skip if the 45s
      // give-up already reset the turn.
      //
      // Review round 1 (Finding 1): do NOT dispatch here. This finalize
      // code runs from inside callBrainOnce while brainBusyRef is still
      // true (setBrainBusy(false) doesn't run until handleStudentTranscript-
      // ForBrain's finally, well after this call returns) — a same-turn
      // dispatch would deterministically hit the busy-queue branch, which
      // stores only the bare marker STRING (losing silent/bypassPerception-
      // Dedupe) and risks the drain loop concatenating it with a genuine
      // queued student utterance, leaking the internal marker to the brain
      // as visible text. Stage it in pendingCutoffResumeRef instead; the
      // actual dispatch happens after the busy cycle (incl. its own
      // queue-drain) fully closes — see the post-finally check below.
      //
      // Review round 1 (Finding 2): the `!transcript.trim().startsWith(...)`
      // check below is a structural chain-guard — a resume turn's OWN
      // `transcript` param is the exact continuation marker we dispatched,
      // so this refuses to arm a SECOND-generation resume even though
      // cutoffResumeFiredRef (reset per top-level dispatch) would
      // otherwise allow one. This caps any error→resume chain at length
      // 1 regardless of how many turns feed into it — see the report's
      // re-derived loop-safety argument.
      if (
        TUTOR_COVER_V2 &&
        lastStopReason === 'error' &&
        fullText.length > 0 &&
        !escalationGaveUpRef.current &&
        !cutoffResumeFiredRef.current &&
        !transcript.trim().startsWith('[Continuation-after-cutoff')
      ) {
        cutoffResumeFiredRef.current = true;
        // fullText (= aggregatedFullText.trim(), just above), not attemptText —
        // attemptText is scoped inside the per-attempt retry loop and is out
        // of scope here; fullText is this turn's accumulated spoken text
        // across all attempts, already trimmed.
        const lastSpoken = fullText.split(/\n\n+/).pop()?.slice(-160) ?? '';
        const marker = `[Continuation-after-cutoff: your previous reply was cut off mid-stream after: "${lastSpoken}" — briefly finish the thought; do not repeat what you already said]`;
        pendingCutoffResumeRef.current = marker;
        onDebugEvent?.('cutoff_resume_armed', `${lastSpoken.length} chars tail`);
      }
      {
        const led = turnLatencyRef.current;
        if (led) {
          const lat = led.summarize();
          if (!lat.complete && led.has('firstTtsFetch')) {
            // Stream done but first audio hasn't stamped yet — defer the
            // emit to the sentence-start handler so TOTAL lands non-null.
            turnLatencyAwaitingAudioRef.current = true;
          } else {
            onDebugEvent?.('turn_latency', formatTurnLatency(lat));
            turnLatencyRef.current = null;
          }
        }
      }
      // Turn-length telemetry (always) + cap corrective (flag-gated). The cap
      // is on UNANCHORED monologue: sentences with zero whiteboard actions —
      // subject-agnostic by design (2026-07-15, user-approved). Telemetry
      // feeds per-subject threshold tuning from real sessions.
      onDebugEvent?.('turn_length', `${totalSentenceCount} sentence(s) · ${totalWordCount} word(s) · ${totalToolNamesSeen.length} tool call(s)`, {
        sentences: totalSentenceCount,
        words: totalWordCount,
        toolCalls: totalToolNamesSeen.length,
        subject,
      });
      // Two independent triggers, ONE corrective. A turn can run wordy
      // sentences and stay under the sentence cap (or vice versa) — either
      // is grounds for a next-turn note, but the pendingCadenceNoteRef slot
      // holds a single note, so the sentence trigger takes priority when
      // both fire (else-if) rather than planting/overwriting twice.
      if (TUTOR_TURN_CAP && totalSentenceCount > TURN_CAP_HARD_SENTENCES && totalToolNamesSeen.length === 0) {
        pendingCadenceNoteRef.current =
          `[cadence note — not from the student] Your previous turn ran ${totalSentenceCount} spoken sentences ` +
          `with no whiteboard action — too long to follow by ear. From this turn on: at most ` +
          `${TURN_CAP_SOFT_SENTENCES} sentences in a row before you either anchor what you're saying on the ` +
          `board or hand the turn back to the student.`;
        console.warn(`[brain-orchestrator] turn cap: ${totalSentenceCount} sentences, 0 tools — cadence note planted`);
        onDebugEvent?.('turn_cap_flagged', `${totalSentenceCount} sentences · 0 tool calls — cadence note planted for next turn`);
      } else if (TUTOR_TURN_CAP && totalWordCount > TURN_CAP_WORDS && totalToolNamesSeen.length === 0) {
        pendingCadenceNoteRef.current =
          `[cadence note — not from the student] Your previous turn ran ${totalWordCount} words with no ` +
          `whiteboard action — too wordy to follow by ear. Condense: one idea per sentence, cut restatement ` +
          `(don't explain, then analogize, then recap the same point) — anchor what you're saying on the ` +
          `board or hand the turn back to the student instead.`;
        console.warn(`[brain-orchestrator] word cap: ${totalWordCount} words, 0 tools — cadence note planted`);
        onDebugEvent?.('turn_cap_flagged', `${totalWordCount} words · 0 tool calls — cadence note planted for next turn`);
      }
      // R2 E2: substantive final question + zero content board writes →
      // plant a board-anchor note for the next turn. Independent of the
      // cadence triggers (own ref) — both can fire on the same turn.
      if (TUTOR_BOARD_ANCHOR_NET) {
        const finalQuestion = lastQuestionSentence(fullText);
        const paintedContent = totalToolNamesSeen.some((n) => isBoardContentTool(n));
        if (finalQuestion && !paintedContent && isSubstantiveAsk(finalQuestion)) {
          pendingBoardAnchorNoteRef.current = buildBoardAnchorNote(finalQuestion);
          console.warn('[brain-orchestrator] board-anchor net: substantive question, 0 content tools — note planted');
          onDebugEvent?.('board_anchor_flagged', `question with no board write — note planted for next turn`);
        }
      }
      // Opener-recency (part A): capture THIS session's opener record once,
      // on the opener turn. openingTurnPendingRef is still armed here — it's
      // consumed unconditionally in the finally below, but the finally can't
      // see the turn's text (aggregatedFullText/fullText are declared inside
      // this try block), so the capture lives at the point where fullText is
      // finalized instead. Skipped when the opener turn produced no text
      // (aborted/empty stream) — there's no opener content to avoid
      // repeating next session. Fires the optional callback exactly once.
      if (
        TUTOR_PEDAGOGY_OPENER
        && openingTurnPendingRef.current
        && !sessionOpenerRecordRef.current
        && fullText
      ) {
        sessionOpenerRecordRef.current = {
          kind: sessionOpenerKindRef.current ?? 'proactive',
          digest: fullText.slice(0, 160),
        };
        onDebugEvent?.('opener_record_captured', `[${sessionOpenerRecordRef.current.kind}] ${sessionOpenerRecordRef.current.digest.slice(0, 60)}`);
        onOpenerRecord?.(sessionOpenerRecordRef.current);
      }
      // Opening-turn barge-in guard: the first brain turn's TEXT stream has
      // now landed. NOTE this is NOT "safe to cancel from here on": the TTS
      // audio for a long opener keeps playing for tens of seconds after this
      // point, and phantom perception transcripts (the mic hearing the
      // tutor's own voice through speakers) were observed cancelling that
      // still-playing audio mid-sentence (2026-07-04, teacher-intro opener:
      // audio died at "…teaching AP Calc for year—" while captions ran on).
      // The cancel sites therefore ALSO wait for firstTurnAudioDoneRef —
      // see the state-watcher effect near the perception wiring.
      tutorFirstTurnDoneRef.current = true;
      tutorFirstTurnDoneAtRef.current = Date.now();

      // Pacing v2 — Phase 1 (inert): streak update from brain
      // affirmation/correction. Runs ONCE per brain turn at end-of-stream
      // when fullText is finalized (handleResponseDone runs per Realtime
      // audio-transcript chunk and saw partial text — moved here).
      // Keyed on ver.segId NOT currentSegmentIdRef.current — the brain
      // frequently auto-advances mid-turn via advance_lesson, so by the
      // time we evaluate, currentSegmentIdRef is on the NEXT segment but
      // the answer was given on the prior segment. Only updates the
      // streak when the prior student turn was classified as a
      // verification turn (numeric/math-bearing answer); pure-ack turns
      // ("ok", "yeah") never trigger streak change even if brain replies
      // "exactly!". On segment-mastered booster: if mark_segment_complete
      // already fired this turn, the increment we apply NOW (post-stream)
      // doesn't reach the booster check. So also re-evaluate the booster
      // here against the same segId-pinned streak count.
      try {
        const ver = lastStudentVerificationRef.current;
        if (ver && ver.isVerification && fullText.length > 0) {
          const head = fullText.slice(0, 200);
          const isAffirm = brainAffirmationRegex.test(head);
          const isCorrect = brainCorrectionRegex.test(fullText);
          if (isAffirm && !isCorrect) {
            // Streak ref keyed on the segment the student ANSWERED on
            // (ver.segId), not whatever segment the brain advanced to.
            const priorCount = studentStreakRef.current.segId === ver.segId
              ? studentStreakRef.current.count : 0;
            studentStreakRef.current = { segId: ver.segId, count: priorCount + 1 };
            // Task C2 (flag-gated): a brain-affirmed genuine verification
            // turn IS the "student demonstrated this segment" signal for the
            // completion gate. Same guard placement as the streak increment
            // so it inherits every existing exclusion (pure acks, help
            // requests, too-short turns, judge-kill/restatement retries).
            if (TUTOR_PEDAGOGY_OPENER && ver.segId) {
              demonstratedSegmentsRef.current.add(ver.segId);
            }
            if (studentIncorrectStreakRef.current.segId === ver.segId
                && studentIncorrectStreakRef.current.count > 0) {
              studentIncorrectStreakRef.current = { segId: ver.segId, count: 0 };
            }
            logPacing(`streak-correct seg="${ver.segId}" count=${studentStreakRef.current.count}`);
            onDebugEvent?.('pacing_streak', `correct=${studentStreakRef.current.count}`);
            // Practice meter: a brain-affirmed genuine verification is a
            // solve — once per PROBLEM (multi-step problems affirm several
            // times), and only when a problem is actually on the board
            // (hook-phase Q&A affirmations don't count).
            {
              // Round-22: use the TURN-START snapshot — a same-turn segment
              // advance clears currentProblemRef before this post-stream
              // code runs, silently dropping the solve.
              const solvedStmt = (ver.activeStatement ?? currentProblemRef.current?.statement ?? '').trim();
              if (solvedStmt.length >= 10) {
                let sh = 5381;
                for (let i = 0; i < solvedStmt.length; i++) sh = (sh * 33) ^ solvedStmt.charCodeAt(i);
                const solvedHash = (sh >>> 0).toString(36);
                if (!practiceSolvedHashesRef.current.has(solvedHash)) {
                  practiceSolvedHashesRef.current.add(solvedHash);
                  practiceSolvedRef.current++;
                  practiceStreakRef.current++;
                }
              }
            }
            emitPracticeStatsRef.current();
            // Late-fire segment-mastered: if completedSegmentIdsRef
            // contains ver.segId (i.e. brain emitted mark_segment_complete
            // earlier in this turn) AND the new streak is >= 2, fire the
            // booster now. The on-mark_segment_complete site reads the
            // streak BEFORE the post-stream increment, so it misses this
            // case.
            if (completedSegmentIdsRef.current.has(ver.segId)
                && studentStreakRef.current.count >= 2
                && (!segmentMasteredFlagRef.current
                    || segmentMasteredFlagRef.current.segId !== ver.segId)) {
              segmentMasteredFlagRef.current = {
                segId: ver.segId,
                streakAtComplete: studentStreakRef.current.count,
              };
              logPacing(`segment-mastered seg="${ver.segId}" streakAtComplete=${studentStreakRef.current.count} (post-stream late-fire)`);
              onDebugEvent?.('pacing_segment_mastered', `seg="${ver.segId}" streak=${studentStreakRef.current.count}`);
            }
          } else if (isCorrect) {
            const priorIncCount = studentIncorrectStreakRef.current.segId === ver.segId
              ? studentIncorrectStreakRef.current.count : 0;
            studentIncorrectStreakRef.current = { segId: ver.segId, count: priorIncCount + 1 };
            if (studentStreakRef.current.segId === ver.segId
                && studentStreakRef.current.count > 0) {
              studentStreakRef.current = { segId: ver.segId, count: 0 };
            }
            logPacing(`streak-incorrect seg="${ver.segId}" count=${studentIncorrectStreakRef.current.count}`);
            onDebugEvent?.('pacing_streak', `incorrect=${studentIncorrectStreakRef.current.count}`);
            // Practice meter: a wrong answer resets the session solve streak.
            practiceStreakRef.current = 0;
            emitPracticeStatsRef.current();
          }

          // Bare-praise-ending advisory (Task Y4 addendum). Same shape as
          // the word-budget corrective below (post-stream detection →
          // plant a "[… — not from the student]" note for the NEXT turn),
          // but SOFT like the Affirmative-no-advance advisory above — no
          // kill, no retry. A kill here would cut audio that already
          // finished playing correctly, and the dead air the student just
          // sat through has already happened by the time we can detect
          // it — planting a note can't undo THIS turn, but it makes the
          // same lapse less likely to recur later in the session (the
          // brain sees its own omission named in its own context, same
          // self-correction path as the cadence note). Fires only on the
          // SAME full-correct-confirmation gate as the streak-correct
          // branch above (isAffirm && !isCorrect, genuine verification
          // turn) AND only when the turn shows neither a trailing
          // question nor a next-move tool call (advance_lesson /
          // generate_problem open the next segment or problem;
          // show_problem / show_segment_card render one directly). ALSO
          // gated on !ver.isSessionEndSignal (review fix, Y4 addendum):
          // Rule 20's own text explicitly exempts "a genuine session-end
          // signal from the student" — a farewell turn is allowed to close
          // without a next move because there is no next move. Without
          // this gate, a student closing with "Thanks, that's all for
          // today!" gets a tutor farewell turn ("Nailed it — see you next
          // time!") flagged by this detector, planting a note that
          // contradicts Rule 20's own exception and risks colliding with
          // the "One sign-off only" rule (system-prompt-builder.ts ~919) if
          // the brain "corrects" by tacking on a second next-move prompt.
          // ver.isSessionEndSignal is set from the STUDENT turn that
          // preceded this brain turn (sessionEndSignalRegex, defined
          // above), mirroring the "Session-end signals" trigger-phrase list
          // in system-prompt-builder.ts ~907-913 — that section was
          // prompt-only with no code-side detector before this fix.
          if (isAffirm && !isCorrect && !ver.isSessionEndSignal) {
            const endsWithQuestion = /\?\s*$/.test(fullText.trim());
            const opensNextMove = totalToolNamesSeen.some(
              (n) => n === 'advance_lesson' || n === 'generate_problem'
                || n === 'show_problem' || n === 'show_segment_card',
            );
            if (!endsWithQuestion && !opensNextMove) {
              pendingNoAdvanceNoteRef.current =
                `[cadence note — not from the student] Your previous turn confirmed the student was fully ` +
                `correct but ended without a next move — no question, no new segment or problem. From this ` +
                `turn on: when you confirm a fully-correct answer, always close with the next question, the ` +
                `next segment's opening, or an explicit choice ("ready for the next one?") — never end on ` +
                `bare praise.`;
              console.warn(`[brain-orchestrator] bare-praise-ending ADVISORY (no kill): full-correct confirmation on seg="${ver.segId}" ended with no question and no next-move tool — cadence note planted for next turn.`);
              onDebugEvent?.('bare_praise_ending_advisory', `seg="${ver.segId}" tools=[${totalToolNamesSeen.join(', ')}]`);
            }
          }
        }
      } catch (err) {
        console.error('[pacing] post-stream streak update threw:', err);
      }

      // Round-7+ Fix 9: defensive cleanup of any residual streaming
      // entries from this turn. The for-loop's per-iteration cleanup at
      // line ~4471 removes the PRIOR attempt's killed entry on retry,
      // but if the FINAL attempt is also killed and we exit via
      // MAX_VALIDATOR_RETRIES, that final attempt's streaming entry is
      // never filtered. Result: the bubble lingers in transcriptRef
      // with `streaming: true`, the cursor blinks forever, and the
      // streamingEntryActive flag stays true. Observed 2026-05-03
      // session opening turn: 3 attempts all killed, residual bubble
      // kept blinking through subsequent turns. Filter ANY remaining
      // streaming-* entries from this t0 here so the transcript is
      // clean before we either finalize the winning attempt's text or
      // fall through to the tool-only / empty placeholder paths.
      const turnStreamingPrefix = `tutor-streaming-${t0}-`;
      const beforeCleanupLen = transcriptRef.current.length;
      transcriptRef.current = transcriptRef.current.filter((e) => {
        if (typeof e.id !== 'string' || !e.id.startsWith(turnStreamingPrefix)) return true;
        // Keep the entry only if it has TEXT — the winning attempt's
        // entry survives so the finalize step below can convert it in
        // place. Empty / killed-attempt entries get filtered.
        return typeof e.text === 'string' && e.text.trim().length > 0 && fullText.trim().length > 0;
      });
      if (transcriptRef.current.length !== beforeCleanupLen) {
        onTranscriptUpdate([...transcriptRef.current]);
      }
      // Always reset the streaming-active flag on turn exit. Required
      // for tool-only and empty-turn paths that previously skipped the
      // setStreamingEntryActive(false) call inside the fullText branch.
      setStreamingEntryActive(false);

      // Drop any leftover dimmed ("revising") bubbles from this turn. The
      // streaming-reveal block clears them when a retry bubble appears, but a
      // retry that emits no chat text (tool-only) would otherwise strand the
      // dimmed bubble. Also keeps the finalize findIndex below from latching
      // onto a revising entry instead of the winning one.
      {
        const turnStreamingPrefix = `tutor-streaming-${t0}-`;
        const beforeRevise = transcriptRef.current.length;
        transcriptRef.current = transcriptRef.current.filter(
          (e) => !(e.revising && typeof e.id === 'string' && e.id.startsWith(turnStreamingPrefix)),
        );
        if (transcriptRef.current.length !== beforeRevise) {
          onTranscriptUpdate([...transcriptRef.current]);
        }
      }

      // Empty-turn fallback. Brain produced neither text nor tool calls.
      if (!fullText.trim() && totalToolNamesSeen.length === 0) {
        // Task X10 — HONEST fallback when the server exhausted its bounded
        // retries during a brain outage (overloaded_error / transient). The
        // empty stream is NOT the student's fault, so never say "say that
        // again". Typed turn ⇒ a text bubble where their typed exchange
        // lives (speaking a typed reply is jarring); voice turn ⇒ a short
        // spoken honest line. Only the brainUnavailable path diverges — a
        // genuine empty stream (brain chose silence / all gates dropped)
        // keeps the pre-existing behavior.
        if (brainUnavailable) {
          const typed = currentTurnTypedRef.current;
          console.warn(
            `[brain-orchestrator] brain UNAVAILABLE after ${serverBrainRetries} server ` +
            `retr${serverBrainRetries === 1 ? 'y' : 'ies'} — honest ${typed ? 'text' : 'voice'} fallback`,
          );
          onDebugEvent?.('brain_unavailable', `retries=${serverBrainRetries} · ${typed ? 'typed' : 'voice'}`);
          if (typed) {
            const msg = "I'm having trouble reaching my brain right now — give me a moment and try again.";
            transcriptRef.current = [
              ...transcriptRef.current,
              {
                id: `tutor-${t0}-brain-unavailable`,
                timestamp: new Date(),
                role: 'tutor',
                text: msg,
              } as TranscriptEntry,
            ];
            onTranscriptUpdate([...transcriptRef.current]);
            onTrackInteraction?.('message', msg, undefined, 'tutor');
          } else {
            const voiceMsg = "I'm having trouble thinking right now — one moment.";
            speakTextRef.current?.(voiceMsg);
            // R32 Task 5: also append a chat bubble — mirrors the typed
            // branch above so the transcript isn't blank for this turn.
            // Unflagged: this closes an audited unbounded-silence hole
            // (bug fix), not a new feature gated behind TUTOR_COVER_V2.
            transcriptRef.current = [
              ...transcriptRef.current,
              {
                id: `tutor-${t0}-brain-unavailable`,
                timestamp: new Date(),
                role: 'tutor',
                text: voiceMsg,
              } as TranscriptEntry,
            ];
            onTranscriptUpdate([...transcriptRef.current]);
            onTrackInteraction?.('message', voiceMsg, undefined, 'tutor');
          }
          return;
        }
        console.warn('[brain-orchestrator] brain returned empty stream — speaking fallback');
        // Typed turns get a text reply (a spoken "say that again" both
        // blames the student and makes no sense for text input) — same
        // modality split as the brainUnavailable path above.
        if (currentTurnTypedRef.current) {
          const msg = "Hmm, I didn't come up with anything for that — mind rephrasing?";
          transcriptRef.current = [
            ...transcriptRef.current,
            { id: `tutor-fallback-${Date.now()}`, role: 'tutor' as const, text: msg, timestamp: new Date() },
          ];
          onTranscriptUpdate([...transcriptRef.current]);
        } else {
          speakTextRef.current?.('Sorry, could you say that again?');
        }
        return;
      }

      // ── Rule-8 v2 (flag TUTOR_CLIENT_RULE8_REPAIR): the in-stream server
      // repair pass fires only when the turn emitted ZERO tools — it cannot
      // see client-side drops. If the server sent tools but every one was
      // dropped here (dedup / validator / kill / solver pre-check), request
      // repairs ourselves. Fire-and-forget: turn finalize below must not
      // wait on Haiku; late ink beats no ink, but ink from a PREVIOUS turn
      // must never land mid-next-turn (pageTurn staleness guard).
      if (
        TUTOR_CLIENT_RULE8_REPAIR &&
        shouldClientRequestRepair({
          serverToolCount: totalToolNamesSeen.length,
          paintedCount: totalPaintedCount,
          sentenceCount: turnNarrationRef.current.length,
        })
      ) {
        const repairTurn = pageTurnRef.current;
        const repairSentences = [...turnNarrationRef.current];
        const repairToolCount = totalToolNamesSeen.length;
        onDebugEvent?.('rule8_client_repair', `requesting: sent=${repairToolCount} painted=0 sentences=${repairSentences.length}`);
        void (async () => {
          try {
            const res = await fetch('/api/tutor/rule8-repair', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                sentences: repairSentences,
                serverToolCount: repairToolCount,
                paintedCount: 0,
                sessionId: sessionIdRef.current,
              }),
            });
            if (!res.ok) return;
            const { frames } = (await res.json()) as {
              frames?: Array<{ name: string; args: Record<string, unknown>; anchorSentence?: number }>;
            };
            if (!Array.isArray(frames) || frames.length === 0) return;
            if (pageTurnRef.current !== repairTurn) {
              onDebugEvent?.('rule8_client_repair', `stale: turn advanced, dropping ${frames.length} frame(s)`);
              return;
            }
            let dispatched = 0;
            for (const frame of frames) {
              if (typeof frame?.name !== 'string' || typeof frame?.args !== 'object' || frame.args === null) continue;
              const cmd = mapFunctionCallToCommand(frame.name, frame.args as Record<string, unknown>);
              if (!cmd) continue;
              const anchor = Number.isInteger(frame.anchorSentence) && (frame.anchorSentence as number) >= 1
                ? { anchorSentence: frame.anchorSentence as number }
                : undefined;
              handleWhiteboardCommand([cmd], anchor);
              dispatched++;
            }
            onDebugEvent?.('rule8_client_repair', `dispatched ${dispatched}/${frames.length} frame(s)`);
          } catch { /* fail-to-nothing — the turn already played fine */ }
        })();
      }

      // Finalize the tutor turn in transcriptRef. The streaming reveal
      // above incrementally pushed sentences into a "tutor-streaming-*"
      // entry as they arrived; here we either upgrade that entry's id
      // to its final form, or — if no sentences streamed — create a
      // placeholder for tool-only turns.
      if (fullText.trim()) {
        // Find the WINNING attempt's streaming entry (id includes the
        // attempt index now). The winning attempt is whatever attempt
        // didn't get killed — count actual attempts that ran. Easiest:
        // search for the highest-numbered tutor-streaming-${t0}-N entry
        // that's still in the transcript.
        const streamingPrefix = `tutor-streaming-${t0}-`;
        // Clear the streaming-active flag — the bubble is finalized,
        // any future composing event is a fresh turn.
        setStreamingEntryActive(false);
        const finalText = fullText.trim();
        const idx = transcriptRef.current.findIndex((e) => typeof e.id === 'string' && e.id.startsWith(streamingPrefix));
        if (idx >= 0) {
          // Finalize in place: KEEP the same id (so React doesn't
          // remount the bubble — pre-2026-04-29 we renamed the id to
          // tutor-${Date.now()} here, which changed the React key and
          // produced visible flicker on every turn). Just clear the
          // streaming flag and replace the text with the final
          // aggregated value.
          const finalEntry: TranscriptEntry = {
            ...transcriptRef.current[idx],
            text: finalText,
            streaming: false,
          };
          transcriptRef.current = [
            ...transcriptRef.current.slice(0, idx),
            finalEntry,
            ...transcriptRef.current.slice(idx + 1),
          ];
        } else {
          // No streaming entry existed (shouldn't happen, but be safe).
          transcriptRef.current = [
            ...transcriptRef.current,
            {
              id: `tutor-${t0}-final`,
              timestamp: new Date(),
              role: 'tutor',
              text: finalText,
            } as TranscriptEntry,
          ];
        }
        onTranscriptUpdate([...transcriptRef.current]);
        // Mirror the Realtime path (line ~1150): record the finalized tutor
        // turn in the DemoInteraction stream. handleTranscriptUpdate's
        // assistant branch returns early in claudeBrainMode (line ~1116), so
        // without this call the interactions collection never sees tutor
        // messages — and the admin-side PDF export (which rebuilds transcripts
        // from interactions, not TutorSession.transcript) renders 0 tutor
        // messages even though Mongo has them.
        onTrackInteraction?.('message', finalText, undefined, 'tutor');
      } else if (totalToolNamesSeen.length > 0) {
        const placeholderEntry: TranscriptEntry = {
          id: `tutor-${Date.now()}`,
          timestamp: new Date(),
          role: 'tutor',
          text: `(rendered: ${totalToolNamesSeen.join(', ')})`,
          // historyOnly: prevents the chat UI from rendering this
          // tool-summary placeholder. Earlier comment said "we don't
          // call onTranscriptUpdate" but the entry still got flushed
          // by every later onTranscriptUpdate call, leaking
          // "(rendered: show_segment_card)" debug strings into the
          // student's chat feed (observed 2026-05-02 session).
          // TranscriptView filters on this flag.
          historyOnly: true,
        };
        transcriptRef.current = [...transcriptRef.current, placeholderEntry];
        // Still skip the immediate update — keeps the previous
        // intent of not flushing for tool-only turns. Later updates
        // will flush but TranscriptView filters out historyOnly.
      }
    } catch (err) {
      // Stage 2: a perception-initiated abort surfaces as DOMException
      // name='AbortError' OR a TypeError whose message includes
      // 'aborted'. Treat both as silent — the perception layer will
      // re-fire (restore or merge) once the verdict lands; the user
      // shouldn't hear "lost my train of thought" mid-thinking.
      const isAbort =
        (err instanceof DOMException && err.name === 'AbortError') ||
        (err instanceof Error && /abort/i.test(err.message));
      if (isAbort) {
        brainTurnAbortedRef.current = true;
        console.log('[brain-orchestrator] aborted (perception-initiated cancel)');
        // Clean up the streaming chat entries so the cursor doesn't
        // keep blinking; do NOT speak a fallback line.
        const turnStreamingPrefix = `tutor-streaming-${t0}-`;
        const beforeLen = transcriptRef.current.length;
        transcriptRef.current = transcriptRef.current.filter((e) =>
          typeof e.id !== 'string' || !e.id.startsWith(turnStreamingPrefix),
        );
        if (transcriptRef.current.length !== beforeLen) {
          onTranscriptUpdate([...transcriptRef.current]);
        }
        setStreamingEntryActive(false);
      } else {
        console.error('[brain-orchestrator] error:', err);
        onDebugEvent?.('brain_turn', `Brain failed: ${err instanceof Error ? err.message : String(err)}`);
        if (turnLatencyRef.current) {
          onDebugEvent?.('turn_latency', formatTurnLatency(turnLatencyRef.current.summarize()));
          turnLatencyRef.current = null;
          turnLatencyAwaitingAudioRef.current = false;
        }
        // R32 Task 4: the give-up path already spoke its own honest reset
        // line and called abort() itself — if that abort somehow lands
        // here (non-AbortError-shaped) instead of the isAbort branch above,
        // don't double-speak a second "repeat that?" on top of it.
        if (escalationGaveUpRef.current) {
          onDebugEvent?.('cover_giveup_abort_swallowed', `t0=${t0}`);
        } else {
          speakTextRef.current?.('Hmm, give me a moment — could you repeat that?');
        }
        // Round-7+ Fix 9 (catch path): clear any residual streaming
        // entries + reset the active flag so the cursor doesn't keep
        // blinking after a thrown error mid-turn.
        const turnStreamingPrefix = `tutor-streaming-${t0}-`;
        const beforeLen = transcriptRef.current.length;
        transcriptRef.current = transcriptRef.current.filter((e) =>
          typeof e.id !== 'string' || !e.id.startsWith(turnStreamingPrefix),
        );
        if (transcriptRef.current.length !== beforeLen) {
          onTranscriptUpdate([...transcriptRef.current]);
        }
        setStreamingEntryActive(false);
      }
    } finally {
      // Stage 2: clear the perception cancellation surface — this brain
      // call is no longer in flight so a later abort() would be a no-op
      // against a stale controller.
      inFlightBrainAbortRef.current = null;
      // Kill-recovery (B): roll back any deferred killed renders the retry did
      // NOT re-confirm. Restatement-confirmed ids were dropped from the set at
      // dedup time, so this only sweeps genuinely superseded (a correction
      // rendered different content) or abandoned (the call aborted) renders —
      // preserving the old anti-orphan guarantee, just at end-of-call instead
      // of pre-retry. Mirrors rollbackKilledRenders (which is try-scoped and
      // unreachable here); kept compact since it runs on every call.
      if (pendingRevisionRef.current.size > 0) {
        const staleIds = [...pendingRevisionRef.current];
        pendingRevisionRef.current = new Set();
        // Hard-remove deferred ids off the board + mirror + id-map + catalog.
        const sweepDeferred = (ids: string[]): void => {
          if (ids.length === 0) return;
          onWhiteboardCommand([{ action: 'removeItems', ids }]);
          const idSet = new Set(ids);
          const beforeMirror = whiteboardCommandsRef.current.length;
          whiteboardCommandsRef.current = whiteboardCommandsRef.current.filter(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (c) => !idSet.has((c as any).id),
          );
          whiteboardCommandCountRef.current = Math.max(
            0,
            whiteboardCommandCountRef.current - (beforeMirror - whiteboardCommandsRef.current.length),
          );
          for (const id of ids) commandByIdRef.current.delete(id);
          catalogRef.current.removeByIds(ids);
        };
        if (TUTOR_KEEP_VALIDATED_ON_KILL) {
          // Keep-validated-on-kill (#5+#7): replace the all-or-nothing
          // winningAttemptRendered gate with per-render supersession. Un-dim
          // the kept (validated, not superseded) renders; sweep only the ones
          // a later same-slot render actually replaced.
          const { keep, sweep } = planKillKeep(staleIds);
          if (keep.length > 0) {
            onWhiteboardCommand([{ action: 'reviseItems', ids: keep, revising: false }]);
            console.warn(`[brain-orchestrator] kill-recovery: kept ${keep.length} validated render(s) [${keep.join(', ')}]`);
            onDebugEvent?.('killed_render_kept_validated', `deferred ${keep.length}: ${keep.join(',')}`);
          }
          if (sweep.length > 0) {
            sweepDeferred(sweep);
            console.warn(`[brain-orchestrator] kill-recovery: rolled back ${sweep.length} superseded render(s) [${sweep.join(', ')}]`);
            onDebugEvent?.('killed_render_rollback_deferred', `${sweep.length}: ${sweep.join(',')}`);
          }
        } else if (!winningAttemptRenderedRef.current) {
          // Keep-on-no-replacement (2026-06-17): the winning attempt rendered
          // NOTHING, so it never superseded these killed renders — it just
          // diverged in speech (or the brain bailed to a next-steps offer
          // after repeated validation rejections, server_5 2026-06-17).
          // Sweeping here would blank the board for content the student
          // explicitly asked for (a valid show_function_graph vanished). Keep
          // them and un-dim instead. The pile-up case the sweep exists for
          // always has the winning attempt render a replacement (→ the else
          // branch still fires).
          onWhiteboardCommand([{ action: 'reviseItems', ids: staleIds, revising: false }]);
          console.warn(`[brain-orchestrator] kill-recovery: kept ${staleIds.length} render(s) — winning attempt rendered no replacement [${staleIds.join(', ')}]`);
          onDebugEvent?.('killed_render_kept_no_replacement', `${staleIds.length}: ${staleIds.join(',')}`);
        } else {
          sweepDeferred(staleIds);
          console.warn(`[brain-orchestrator] kill-recovery: rolled back ${staleIds.length} unconfirmed render(s) [${staleIds.join(', ')}]`);
          onDebugEvent?.('killed_render_rollback_deferred', `${staleIds.length}: ${staleIds.join(',')}`);
        }
      }
      // Board-anchor auto-fire REMOVED (2026-07-10, session-1783693044096).
      // It regex-scanned the turn's narration and drew on the brain's behalf
      // whenever no render survived the turn. Three failure modes, all live:
      //  • it transcribed sentence fragments verbatim — "turns them into food"
      //    became the board equation "them → food" (pronoun and all);
      //  • its sketches were drawn by an isolated doodler that sees only the
      //    extracted phrase, so a Calvin-cycle lesson got an unlabelled
      //    "kneading dough" doodle with no ATP/NADPH anywhere;
      //  • worst, the gate misread dedup. When the brain re-showed a figure
      //    already on the board (exactly the right move), the dedup filter
      //    dropped the command before dispatchVisual ran, boardRenderFired
      //    stayed false, and the assist "rescued" the turn by drawing a
      //    redundant sketch INSTEAD of the figure the brain asked for.
      // The brain owns show_sketch directly (TUTOR_SKETCH tool path): it has
      // the board state, the lesson context, and a labels argument — none of
      // which a regex over prose has. Re-anchoring (extractAnchorKeywords /
      // sentenceIntroducesAnchor) is unaffected and still runs in render-sync.
      // Task B3 (flag-gated): fail-to-simple opener render fallback. If this
      // was the proactive-opener turn (openingTurnPendingRef, seeded once at
      // mount from beh.opener !== 'none') and it dispatched zero valid board
      // renders across every attempt/retry, paint ONE guaranteed-renderable
      // fallback (a 'handwrite' line — see opener-fallback.ts for why that
      // primitive can't be rejected) so the student never faces a blank
      // board on their first impression. The spoken opener already played
      // (this runs after the stream/attempt loop, purely visual) — nothing
      // here touches speech. The pending flag is consumed unconditionally so
      // this can fire at most once per session, on the opener turn only.
      if (TUTOR_PEDAGOGY_OPENER && openingTurnPendingRef.current) {
        openingTurnPendingRef.current = false;
        if (shouldEmitOpenerFallback({
          openingPhase: true,
          validRendersThisTurn: openingTurnValidRenderCountRef.current,
          // Blank-board guard: a resumed session restores the board (incl.
          // the original fallback line) before this opener turn runs — a
          // populated board must suppress the fallback or it duplicates
          // (live 2026-07-04 reload repro). whiteboardCommandsRef (not the
          // catalog) is the signal: it receives EVERY restored command at
          // rehydration, including handwrites, which never become catalog
          // items — so a board holding only the original fallback line
          // still counts as non-blank.
          boardItemCount: whiteboardCommandsRef.current.length,
        })) {
          onWhiteboardCommand([buildOpenerFallbackCommand({ topic })]);
          onDebugEvent?.('opener_fallback_rendered', topic || '(no topic)');
        }
      }
      // Render↔speech sync: the stream is done — stop buffering NEW batches.
      // The buffer itself is NOT cleared here: TTS lags the stream, so any
      // remaining buffered renders keep flushing against the still-playing
      // audio (sentence-start / drain / cap) after this call returns.
      renderSyncActiveRef.current = false;
      captionSyncRef.current.markStreamEnd();
    }
  }, [handleWhiteboardCommand, onDebugEvent, onTranscriptUpdate, onTrackInteraction, applyResolvedAdvance, flushAllRenderBuffer, dropRenderBuffer, planKillKeep, onOpenerRecord, drainStudentMarks]);

  // R32 Task 6: extracted from the original ack/escalation-arm site inside
  // handleStudentTranscriptForBrain (Tasks 3 + 4) so the SAME cover
  // machinery can arm for queue-drained turns too (called a second time
  // from the drain loop below) — closes silence-audit §1 hole 1, where a
  // drained/combined follow-up got zero cover for its own full brain turn.
  // Exact logic moved verbatim; only the enclosing function boundary
  // changed. Every ref/const referenced below is either a component-scope
  // ref (stable identity) or a module-level pure import — see the
  // useCallback deps for the two non-ref component values it touches.
  const armCoverForDispatch = useCallback((transcript: string) => {
    // Phase 2: arm the acknowledgment micro-turn. Only REAL dispatches
    // reach this point (classify/noise-filter run upstream; retries live
    // inside callBrainOnce and never re-arm), so classification='clean'
    // and attempt=0 hold by construction. All other guards re-check at
    // fire time via live refs.
    if (TUTOR_ACK_LAYER) {
      if (ackTimerRef.current) clearTimeout(ackTimerRef.current);
      const ackTurnIndex = ++ackTurnCounterRef.current;
      const ackArmedAt = Date.now();
      const ackTranscript = transcript;
      // R32: classify up front so liveness checks can answer instantly and
      // silent verdicts skip arming the timer entirely. Legacy behavior
      // (TUTOR_COVER_V2 off) hard-codes the old 'cover'/'generic' verdict
      // so the branches below degrade byte-identically to pre-R32.
      const verdict: CoverVerdict = TUTOR_COVER_V2
        ? classifyCover(ackTranscript)
        : { kind: 'cover', category: 'generic' };

      if (TUTOR_COVER_V2 && verdict.kind === 'silent') {
        onDebugEvent?.('cover_silent', verdict.reason);
      } else if (TUTOR_COVER_V2 && verdict.kind === 'instant') {
        // Liveness check: the student is asking whether we're alive
        // BECAUSE of our latency — answer instantly, brain turn continues
        // normally. Same speak-gate the fast opener respects.
        if (Date.now() >= speakTextBlockedUntilRef.current) {
          const text = pickLivenessReply(ackTurnIndex);
          const sid = pushTtsScriptForPerception(text);
          speakTextRef.current?.(text, sid);
          ttsDispatchedCountRef.current++;
          turnLatencyRef.current?.mark('firstTtsFetch', Date.now());
          onDebugEvent?.('cover_liveness', `"${text}" turn=${ackTurnIndex}`);
        }
      } else {
        // COVER_FIRE_MS (1200) > the legacy 450ms fire delay; shouldSpeakAck's
        // >=450 msSinceTurnEnd window check stays valid either way.
        const delayMs = TUTOR_COVER_V2 ? COVER_FIRE_MS : 450;
        ackTimerRef.current = setTimeout(() => {
          ackTimerRef.current = null;
          const input: AckInput = {
            classification: 'clean',
            attempt: 0,
            skipTurn: /\[Skip-button-clicked/i.test(ackTranscript),
            // Round 28: session-opening kickoff turns never ack (see
            // AckInput.openingTurn). Detected by the synthetic bracketed
            // marker OR the armed opening ref — belt and suspenders.
            openingTurn: openingTurnPendingRef.current
              || /^\[(?:start (?:lesson|session)|session-resumed)/i.test(ackTranscript.trim()),
            fastOpenerSpoken: turnLatencyRef.current?.has('firstTtsFetch') ?? false,
            brainSentence0Dispatched: turnLatencyRef.current?.has('firstSentence') ?? false,
            msSinceTurnEnd: Date.now() - ackArmedAt,
            turnIndex: ackTurnIndex,
          };
          if (!shouldSpeakAck(input)) {
            const reason = input.openingTurn ? 'opening-turn'
              : input.brainSentence0Dispatched ? 'sentence0'
              : input.fastOpenerSpoken ? 'tts-already-dispatched'
              : input.skipTurn ? 'skip-turn' : 'damping';
            onDebugEvent?.('ack_suppressed', reason);
            return;
          }
          // Same gate the fast opener respects (perception-cancel window).
          if (Date.now() < speakTextBlockedUntilRef.current) {
            onDebugEvent?.('ack_suppressed', 'speak-gate');
            return;
          }
          let text: string; let index: number;
          if (TUTOR_COVER_V2 && verdict.kind === 'cover') {
            const catKey = verdict.category;
            ({ text, index } = pickCoverPhrase(catKey, ackTranscript, ackTurnIndex,
              lastCoverIndexRef.current[catKey] ?? null));
            lastCoverIndexRef.current[catKey] = index;
          } else {
            ({ text, index } = pickAck(ackTurnIndex, lastAckIndexRef.current));
            lastAckIndexRef.current = index;
          }
          // Fast-opener call shape: perception self-voice push + speak.
          const ackScriptId = pushTtsScriptForPerception(text);
          speakTextRef.current?.(text, ackScriptId);
          // Render↔speech sync: count the ack the same way the fast opener
          // is counted — symmetric dispatch+playback increments keep
          // anchorM aligned (verified at the opener call site).
          ttsDispatchedCountRef.current++;
          // turn_latency: with the ack layer on, the turn's first audio IS
          // the ack — mark its fetch too so tts→audio stays coherent and
          // TOTAL reads as perceived-first-sound (the Phase-2 metric).
          turnLatencyRef.current?.mark('firstTtsFetch', Date.now());
          onDebugEvent?.('ack_spoken', `"${text}" turn=${ackTurnIndex}${TUTOR_COVER_V2 && verdict.kind === 'cover' ? ` cat=${verdict.category}` : ''}`);
        }, delayMs);
      }
    }
    // R32 Task 4: escalating in-flight covers. The head cover above only
    // fires once at COVER_FIRE_MS; a genuinely sick turn (server retry
    // ladder, silence audit) needs tier-1 (~9s), tier-2 (~25s, honest
    // about the cause), and a 45s give-up so the client stops riding the
    // server's ~93s retry chain in silence.
    if (TUTOR_ACK_LAYER && TUTOR_COVER_V2) {
      if (escalationTimerRef.current) clearInterval(escalationTimerRef.current);
      escalationGaveUpRef.current = false;
      const esState = createEscalationState();
      const dispatchedAt = Date.now();
      const esTurnIndex = ackTurnCounterRef.current;
      const isSynthetic = transcript.trim().startsWith('[');
      if (!isSynthetic) {
        escalationTimerRef.current = setInterval(() => {
          // Sentence-0 arrived or the turn is over → stand down.
          if (turnLatencyRef.current?.has('firstSentence') || inFlightBrainAbortRef.current === null) {
            if (escalationTimerRef.current) clearInterval(escalationTimerRef.current);
            escalationTimerRef.current = null;
            return;
          }
          const act = decideEscalation(esState, Date.now() - dispatchedAt, esTurnIndex);
          if (act.action === 'wait') return;
          if (act.action === 'speak') {
            if (Date.now() < speakTextBlockedUntilRef.current) return; // retry next tick? no — tier already consumed; acceptable
            const sid = pushTtsScriptForPerception(act.text);
            speakTextRef.current?.(act.text, sid);
            ttsDispatchedCountRef.current++;
            onDebugEvent?.('cover_escalation', `tier=${act.tier} "${act.text}"`);
            return;
          }
          // give-up: stop waiting on a sick turn (would otherwise ride ~93s of
          // server retries — silence audit). Abort, speak an honest reset line.
          if (escalationTimerRef.current) clearInterval(escalationTimerRef.current);
          escalationTimerRef.current = null;
          escalationGaveUpRef.current = true;
          inFlightBrainAbortRef.current?.abort();
          const text = "Sorry about that, I lost my thread. Say that once more for me?";
          const sid = pushTtsScriptForPerception(text);
          speakTextRef.current?.(text, sid);
          onDebugEvent?.('cover_giveup', `after=${Date.now() - dispatchedAt}ms`);
        }, 1000);
      }
    }
  }, [onDebugEvent, pushTtsScriptForPerception]);

  // Serialized entry point used by the relay-mode hook. Ensures only one
  // brain call is in flight at a time. Utterances arriving during an
  // in-flight call are queued, then combined and sent as a single
  // follow-up call once the current call finishes. Combining (rather
  // than serialing each individually) is what the user actually
  // expects: if they say "draw the perpendicular" then "now find the
  // area", they want one coherent response, not two responses where
  // the first is interrupted by the second.
  const handleStudentTranscriptForBrain = useCallback(async (
    transcript: string,
    opts?: {
      silent?: boolean;
      bypassPerceptionDedupe?: boolean;
      bypassMidUtteranceGuard?: boolean;
      // R32 (H1): when the mid-utterance guard below would otherwise DROP
      // this dispatch, queue it instead — it drains once the student's
      // current utterance finishes its own turn. Used by RESTORE/MERGE/FRESH
      // so a perception verdict that lands mid-speech is deferred, not lost
      // (previously an unbounded-silence hole: the dropped dispatch never
      // re-fired and nothing else was watching it).
      queueOnMidUtterance?: boolean;
      // Task X10: true when this dispatch originated from the student TYPING
      // (in-session text box / external typed send), false/undefined for
      // voice, buttons, and synthetic kickoffs. Recorded into
      // currentTurnTypedRef so the honest brain-outage fallback can render a
      // text bubble instead of speaking "say that again" at a typing student.
      typed?: boolean;
      // Q3 timestamped-history: forwarded verbatim to callBrainOnce (the
      // direct first call only — queue-drained follow-ups are separate
      // turns and intentionally don't carry it).
      injectedHistoryTail?: Array<{ role: 'user' | 'assistant'; content: string }>;
    },
  ) => {
    // Task X10: stamp this turn's input modality for the honest fallback.
    currentTurnTypedRef.current = opts?.typed === true;
    console.log('[brain-orchestrator] turn start, transcript:', JSON.stringify(transcript).slice(0, 120), `· humor=${humorCeilingRef.current ?? 'default'}`);
    // "Mute me" / "stop listening" voice command — mute the mic instead of
    // sending it to the brain (which would otherwise try to "answer" it). Only
    // for real student speech, never synthetic kickoffs (those are silent).
    if (!opts?.silent && isMuteMeCommand(transcript)) {
      console.log('[brain-orchestrator] "mute me" voice command — muting mic, not dispatching to brain');
      onDebugEvent?.('voice_mute_command', transcript.slice(0, 60));
      muteMicRef.current?.();
      return;
    }
    // Stage 3 fix #11 (2026-05-28): defer-on-dispatch guard. If the
    // student is CURRENTLY mid-utterance, drop this dispatch — the
    // user is actively speaking and any brain response we fire now
    // would just talk over them. The eventual perception verdict for
    // the in-flight utterance will route through applyPerceptionVerdict
    // and dispatch its own brain call. Closes the residual race where
    // fix #10 doesn't catch the brain because the cancel-target brain
    // hasn't STARTED yet at retro-cancel time (observed live
    // 2026-05-28: late-arriving MERGE verdict dispatched Brain-6 while
    // student was already saying "And also like factorials..."; Brain-6
    // emitted 6 sentences past the 600ms speakText gate and 1000ms
    // response-cancel grace). bypassMidUtteranceGuard opt for internal
    // dispatches that need to fire regardless (none yet, reserved for
    // future).
    if (
      perceptionMidUtteranceRef.current &&
      !opts?.bypassMidUtteranceGuard
    ) {
      // R32 (H1): a bare drop here left RESTORE/MERGE/FRESH dispatches that
      // land mid-utterance with nothing watching them — unbounded silence if
      // the interrupting speech never resolves to its own transcript. Queue
      // instead when the caller opts in; the queue drains after the current
      // utterance's own turn completes.
      if (opts?.queueOnMidUtterance) {
        // Final-review Finding 2: a synthetic dispatch (kickoff/rekick,
        // '['-prefixed) has its own retry machinery — kickoffs re-arm via
        // the warmup watchdog, so queuing one here just risks it draining
        // later joined with a genuine utterance and leaking the marker
        // into visible chat as concatenated text. Drop, don't queue.
        if (transcript.startsWith('[')) {
          onDebugEvent?.('queue_skip_synthetic', transcript.slice(0, 40));
          return;
        }
        queuedTranscriptsRef.current.push(transcript);
        onDebugEvent?.('dispatch_queued_mid_utterance', transcript.slice(0, 60));
        // R32 (H1 review round 1, Finding 1): this push has a guaranteed
        // drain only when brainBusyRef is true right now (the while-loop
        // drain in the busy branch below, or the 90s busy-watchdog, own it
        // then). The common case for a RESTORE/MERGE/FRESH re-dispatch is
        // brainBusyRef already false — the aborted call's finally cleared
        // it well before this async verdict resolved — so nothing else is
        // watching this push. Arm a bounded poller: if the interrupting
        // speech never itself resolves to a transcript and the student
        // says nothing further, this is the only thing that will ever
        // drain the queue (otherwise: unbounded silence one layer deeper
        // than the bug this option was meant to fix). One timer covers the
        // whole queue regardless of how many pushes land while it's armed.
        if (!brainBusyRef.current && !queueMidUtteranceDrainTimerRef.current) {
          const checkQueueDrain = () => {
            queueMidUtteranceDrainTimerRef.current = null;
            if (queuedTranscriptsRef.current.length === 0) return; // drained normally already
            if (brainBusyRef.current) return; // busy machinery now owns the queue — stand down
            if (perceptionMidUtteranceRef.current) {
              // Still (or newly) mid-utterance — don't talk over them;
              // recheck shortly. Bounded by the 30s mid-utterance
              // watchdog, so this can't poll forever.
              queueMidUtteranceDrainTimerRef.current = setTimeout(checkQueueDrain, 2_000);
              return;
            }
            const stuck = queuedTranscriptsRef.current.splice(0);
            // Final-review Finding 2, defense-in-depth: the push sites already
            // keep '['-prefixed synthetic markers out of this queue — filter
            // again here so a marker can never be concatenated into text that
            // reaches the brain (and the visible student chat bubble) as if
            // the student had said it.
            const joined = stuck.filter((s) => !s.startsWith('[')).join(' ').trim();
            if (!joined) return;
            console.warn(`[brain-orchestrator] STAGE-3 H1 queue-drain timeout: dispatching ${stuck.length} queued transcript(s) that had no other drain path`);
            onDebugEvent?.('dispatch_queue_drain_timeout', `${stuck.length} queued, ${joined.length} chars`);
            // bypassPerceptionDedupe: same escape hatch as every other
            // orchestrator-authored re-dispatch (RESTORE/MERGE/FRESH,
            // watchdog requeue) — this is a synthetic internal drain, not
            // a fresh perception event.
            void handleStudentTranscriptForBrain(joined, { bypassPerceptionDedupe: true });
          };
          queueMidUtteranceDrainTimerRef.current = setTimeout(checkQueueDrain, 4_000);
        }
        return;
      }
      console.warn(
        `[brain-orchestrator] STAGE-3 fix #11: dispatch dropped — student is mid-utterance (perceptionMidUtteranceRef=true): ${JSON.stringify(transcript).slice(0, 80)}`,
      );
      onDebugEvent?.('dispatch_dropped_mid_utterance', transcript.slice(0, 80));
      return;
    }
    // "Being heard" indicator: a real student turn has reached the orchestrator
    // (passed the mute + mid-utterance guards), so resolve the "got that — one
    // sec…" window and clear any "didn't catch" nudge. Synthetic/silent
    // kickoffs don't count.
    if (!opts?.silent) {
      resolveAwaitingDispatch();
      onListeningHintRef.current?.(null);
      studentHasSpokenRef.current = true;
    }
    // Bug 2 fix: production-WS dedupe after a Stage-2 cancel. If a
    // recent cancel armed the suppression slot AND this call did NOT
    // come from the perception refire path, drop it — perception is
    // already handling the same utterance via MERGE/FRESH/RESTORE.
    //
    // Stage-3 fix #7 (2026-05-28): the slot is WINDOW-based, not
    // consume-once. Whisper on the production WS routinely splits a
    // long student utterance into 2+ transcripts at the speaker's
    // mid-sentence pauses — the original consume-on-first-hit logic
    // dropped the first fragment but let later ones through as
    // separate brain turns. Observed live: "Oh, okay. So, the first,
    // the 2AP..." was suppressed, then "pq minus 1 times k." (the
    // tail of the same utterance) slipped through and fired a brain
    // turn, after which the queued perception MERGE drained as
    // ANOTHER turn — making the tutor sound like it was repeating
    // the student's earlier speech. Now: drop every production-WS
    // turn within the 20s window. The slot times out naturally.
    const suppress = productionWsTranscriptSuppressRef.current;
    if (suppress && !opts?.bypassPerceptionDedupe) {
      const now = Date.now();
      if (now < suppress.until) {
        console.warn(
          `[brain-orchestrator] suppressed production-WS turn within ${Math.round((suppress.until - now) / 1000)}s of perception cancel: ${JSON.stringify(transcript).slice(0, 80)}`,
        );
        onDebugEvent?.('production_ws_suppressed', `${Math.round((suppress.until - now) / 1000)}s left`);
        // Do NOT null the slot — leave it active for the rest of the
        // window so subsequent fragments of the same utterance also drop.
        return;
      }
      // Window expired — clean up the stale slot.
      productionWsTranscriptSuppressRef.current = null;
    }
    if (brainBusyRef.current) {
      // Final-review Finding 2: same synthetic-marker isolation as the
      // queueOnMidUtterance branch above — a bare-string busy-queue push
      // drops opts (e.g. silent:true), so a queued '['-prefixed dispatch
      // that later drains through the join loop reads as visible text.
      // Kickoffs/rekicks have their own retry machinery; dropping here is
      // correct, not lossy.
      if (transcript.startsWith('[')) {
        onDebugEvent?.('queue_skip_synthetic', transcript.slice(0, 40));
        return;
      }
      console.log('[brain-orchestrator] queued (brain busy):', JSON.stringify(transcript).slice(0, 80));
      queuedTranscriptsRef.current.push(transcript);
      return;
    }
    setBrainBusy(true);
    // Stage 4 regression fix (2026-06-16): show the 'processing' ("Thinking…")
    // indicator while the brain fetch is in flight. The production WS no
    // longer transcribes input (perception is the sole input authority), so
    // it never enters 'processing' on its own — without this the UI sat on
    // 'listening' for the full 2–22s brain turn (observed CS session). Set
    // here, AFTER the mid-utterance / suppression early-returns above (so a
    // deferred/dropped dispatch doesn't flip the indicator), and cleared in
    // the finally. queueAudio promotes 'processing'→'speaking' when the
    // first TTS sentence plays; the finally only resets if no audio started.
    signalBrainThinkingRef.current?.(true);
    // Item P3 (2026-05-24) — reset per-turn refs at the relay-mode entry
    // point. This is the unified pipe ALL student-driven turns flow
    // through: voice transcripts (realtime hook onUserTranscript), Skip
    // / I'm-stuck button clicks (page.tsx → realtime.sendTextMessage
    // → relay branch), typed input via sendTextMessage, and lesson
    // kickoff. Previously only the voice handleTranscriptUpdate path
    // (line ~1226) and the typed-input form handler (line ~8394) reset
    // the refs — button clicks bypassed both. Each session that used
    // Skip+I'm-stuck buttons heavily fired the defensive-reset warning
    // at callBrainOnce 4× per session (2026-05-24). Resetting here at
    // the relay entry covers every path; the defensive reset at
    // callBrainOnce remains as a paranoid backstop. `silent` opt-out
    // not needed — a fresh transcript (synthetic or otherwise) is
    // always a fresh student turn.
    visualActionsThisTurnRef.current = new Set();
    newPageThisTurnRef.current = false;
    brainEmittedNewPageThisTurnRef.current = false;
    generateProblemThisTurnRef.current = false;
    inferredAdvanceThisTurnRef.current = '';
    // R32 Task 5: reset here (not the flag-gated escalation-arm block below,
    // and not the per-attempt brainTurnAbortedRef site in callBrainOnce) so
    // the cutoff-resume cap is unconditionally per-turn regardless of
    // TUTOR_ACK_LAYER/TUTOR_COVER_V2 — this relay entry point is the one
    // pipe every student-driven turn flows through (see P3 comment above).
    cutoffResumeFiredRef.current = false;
    // Watchdog: if callBrainOnce hangs (network never resolves, no
    // error thrown), brainBusyRef stays true forever and every
    // subsequent student turn gets queued silently. Observed
    // 2026-04-29 electricity session: voice "I don't think so" never
    // reached the brain and the user stared at "Thinking…" until they
    // gave up and typed it. 90-second hard cap forces the flag back
    // to false and clears the queue so the next input can flow.
    const watchdog = setTimeout(() => {
      if (brainBusyRef.current) {
        console.warn('[brain-orchestrator] watchdog: brain stuck > 90s — force-resetting busy flag');
        // R32 Task 6: the queue used to be discarded silently here — any
        // student utterances that piled up behind the stuck call vanished
        // with no cover and no retry. Snapshot + clear it as before, but
        // once the busy flag is actually reset, re-dispatch the surviving
        // text as a single combined turn (bypassPerceptionDedupe: true —
        // this is a synthetic internal re-fire, not a fresh perception
        // event, so the perception-dedupe suppression slot must not apply).
        const stuck = queuedTranscriptsRef.current.splice(0);
        setBrainBusy(false);
        onDebugEvent?.('brain_watchdog_reset', '90s timeout');
        if (stuck.length > 0) {
          // Final-review Finding 2, defense-in-depth: same marker filter as
          // the H1 drain-guarantee poller above — belt and braces against a
          // synthetic '['-prefixed dispatch ever reaching the brain joined
          // with real student text.
          const joined = stuck.filter((s) => !s.startsWith('[')).join(' ').trim();
          onDebugEvent?.('brain_watchdog_requeue', String(stuck.length));
          if (joined) {
            // Dispatched AFTER setBrainBusy(false) above (which updates
            // brainBusyRef synchronously) so this re-fire lands as a fresh
            // dispatch rather than being swallowed by the busy check and
            // queued right back onto the ref we just cleared.
            void handleStudentTranscriptForBrain(joined, { bypassPerceptionDedupe: true });
          }
        }
      }
    }, 90_000);
    // R32 Task 5 (review round 1, Finding 1): tracks whether a genuine
    // (non-synthetic) student utterance was queued-and-drained during
    // THIS busy cycle. Declared outside the try so it's still readable
    // after the finally below, where it gates the staged cutoff-resume
    // dispatch (a real utterance arriving means the student already
    // spoke — their new turn supersedes finishing the old cut-off
    // thought, so the resume is skipped rather than risking any
    // concatenation with it).
    let studentSpokeDuringBusyWindow = false;
    try {
      // Stage 2 (perception cancellation): remember the args so a
      // post-cancel verdict can RESTORE (re-fire with these exact
      // args) or MERGE (re-fire with these + perception text).
      lastBrainCallContextRef.current = { transcript, opts };
      // Typed turns never pass through perception (no eagerEnd/turnEnd) —
      // create the ledger here so brain_first/tts→audio still measure.
      turnLatencyRef.current ??= createTurnLatencyLedger();
      turnLatencyRef.current.mark('brainFetch', Date.now());
      // R32 Task 6: cover-arm (Task 3) + escalation-poller (Task 4) extracted
      // to armCoverForDispatch above — same call, now shared with the
      // queue-drain site below.
      armCoverForDispatch(transcript);
      await callBrainOnce(transcript, opts);
      // Drain the queue. If multiple utterances arrived while we were
      // processing, combine them into one transcript so Claude sees a
      // single follow-up question rather than a stale chain.
      while (queuedTranscriptsRef.current.length > 0) {
        // Stage 3 fix #12 (2026-05-29): dedup identical queued transcripts
        // before combining. When both perception WS and production WS
        // transcribe the same student utterance during a no-cancel
        // window (e.g. session kickoff, where the [start lesson] brain
        // is in flight but no perception cancel fires because student
        // spoke during prod='listening'), both paths reach
        // handleStudentTranscriptForBrain and queue identical text.
        // Without dedup the queue drain joined them into
        // "Yeah, sure. Let's go. Yeah, sure. Let's go." → produced a
        // duplicate-text student chat entry (observed live 2026-05-29
        // JEE trig kickoff). Normalize whitespace + case for the
        // comparison so trivial Whisper/perception capitalization
        // differences still dedup.
        // Final-review Finding 2, defense-in-depth: the busy-push and
        // queueOnMidUtterance push sites already keep '['-prefixed synthetic
        // markers out of this queue — filter again here so the join below
        // can never concatenate one into text the brain (and the student
        // chat bubble) sees as genuine speech.
        const all = queuedTranscriptsRef.current.splice(0).filter((s) => !s.startsWith('['));
        // R32 Task 5 (review round 1): every entry here is a genuine
        // student-originated dispatch — the cutoff-resume marker is
        // staged in pendingCutoffResumeRef, never pushed onto this queue
        // (see that ref's declaration comment), so a non-empty splice
        // means the student actually spoke during this busy cycle.
        if (all.length > 0) studentSpokeDuringBusyWindow = true;
        // Stage 3 fix #15 (2026-06-15): fuzzy similarity helper for
        // near-duplicate dedup. Perception WS (gpt-realtime-2) and
        // production WS (Whisper) often transcribe the same audio
        // with minor differences ("Can it speak in Tamil?" vs "Can I
        // speak in Tamil?"). Fix #12's exact-match dedup misses these.
        // Use length-normalized Levenshtein distance — if <15% edit
        // distance (i.e., >85% character similarity), treat as duplicate.
        const lev = (a: string, b: string): number => {
          if (a === b) return 0;
          if (!a.length) return b.length;
          if (!b.length) return a.length;
          // Single-row DP — O(min(a, b)) memory.
          let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
          let curr = new Array<number>(b.length + 1);
          for (let i = 1; i <= a.length; i++) {
            curr[0] = i;
            for (let j = 1; j <= b.length; j++) {
              const cost = a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1;
              curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
            }
            [prev, curr] = [curr, prev];
          }
          return prev[b.length];
        };
        const isFuzzyDup = (a: string, b: string): boolean => {
          if (a === b) return true;
          const maxLen = Math.max(a.length, b.length);
          // Skip fuzzy for short strings — short questions can differ
          // semantically with very few edits ("what is an AP" vs
          // "what is an MP" → lev=1, ratio 0.07, would wrongly dedup).
          // 20-char minimum keeps short-clause questions safe while
          // catching real perception/production transcript variants of
          // longer utterances (Tamil case = 21 chars, diagram-demo = 71).
          if (maxLen < 20) return false;
          const d = lev(a, b);
          return d / maxLen <= 0.15;
        };
        const dedupedNorms: string[] = [];
        const deduped = all.filter((t) => {
          const norm = t.trim().toLowerCase().replace(/\s+/g, ' ');
          if (!norm) return false;
          if (dedupedNorms.some((seenNorm) => isFuzzyDup(seenNorm, norm))) {
            return false;
          }
          dedupedNorms.push(norm);
          return true;
        });
        if (deduped.length < all.length) {
          console.log(`[brain-orchestrator] STAGE-3 fix #12+#15: queue-drain dedup ${all.length} → ${deduped.length}`);
          onDebugEvent?.('queue_drain_dedup', `${all.length}→${deduped.length}`);
        }
        const combined = deduped.join(' ');
        if (!combined.trim()) continue;
        console.log('[brain-orchestrator] processing queued combined:', JSON.stringify(combined).slice(0, 100));
        // Stage 3 fix #12 (cont): if the combined text already appears
        // as the last student chat entry (production WS or a perception
        // path added it during the busy window), suppress callBrainOnce's
        // chat-add via silent=true. Without this, the brain's chat-add
        // step duplicates an already-visible student turn.
        // Fix #15: match the chat entry with fuzzy too — production
        // and perception transcripts of the same audio can differ.
        const lastEntry = transcriptRef.current[transcriptRef.current.length - 1];
        const normalizedCombined = combined.trim().toLowerCase().replace(/\s+/g, ' ');
        const lastEntryNorm = lastEntry?.role === 'student'
          ? lastEntry.text.trim().toLowerCase().replace(/\s+/g, ' ')
          : '';
        const alreadyInChat = !!lastEntryNorm && isFuzzyDup(lastEntryNorm, normalizedCombined);
        if (alreadyInChat) {
          console.log('[brain-orchestrator] STAGE-3 fix #12: combined matches last chat entry — dispatching silent');
          onDebugEvent?.('queue_drain_silent', 'matches_last_chat');
        }
        lastBrainCallContextRef.current = { transcript: combined };
        // R32 Task 6 (silence-audit §1 hole 1): drained/combined turns
        // previously got zero cover for their own full brain turn — the
        // head cover + escalation poller only ever armed for the ORIGINAL
        // dispatch above, not for follow-ups combined off the queue while
        // that original call was in flight. Arm the same machinery here so
        // a drained turn covers itself exactly like a direct dispatch.
        armCoverForDispatch(combined);
        await callBrainOnce(combined, alreadyInChat ? { silent: true } : undefined);
      }
    } finally {
      clearTimeout(watchdog);
      setBrainBusy(false);
      // Clear the thinking indicator. No-op if TTS already promoted the
      // state to 'speaking' (signalBrainThinking only resets when still
      // 'processing'), so a turn that produced audio is unaffected; this
      // catches tool-only / empty / errored turns that would otherwise
      // leave the UI stuck on "Thinking…".
      signalBrainThinkingRef.current?.(false);
    }
    // R32 Task 5 (review round 1, Finding 1): dispatch the staged cutoff
    // resume (if any) only now — AFTER the finally above has run
    // setBrainBusy(false), so brainBusyRef.current is already false when
    // the recursive dispatch below re-enters this function. Dispatching
    // any earlier (e.g. from the finalize site inside callBrainOnce,
    // while this very call is still in flight) deterministically hit the
    // busy-queue branch, which stores only the bare marker STRING —
    // dropping {silent, bypassPerceptionDedupe} — and let the drain loop
    // above concatenate it with a genuine queued student utterance,
    // leaking the internal marker into the brain's input as visible text.
    //
    // Skip entirely if a real utterance was queued-and-drained during
    // this busy cycle (studentSpokeDuringBusyWindow) — the student
    // already spoke, so finishing the old cut-off thought is moot and
    // their new turn (already answered above by the drain loop) takes
    // priority.
    //
    // Deliberately NOT passing bypassMidUtteranceGuard (Finding 3): if
    // the student is mid-utterance at this exact instant, the recursive
    // call drops through the existing guard inside
    // handleStudentTranscriptForBrain and that guard emits its own
    // 'dispatch_dropped_mid_utterance' debug event — so telemetry shows
    // the drop, not a misleading 'cutoff_resume_dispatched' with no
    // actual delivery.
    const pendingResume = pendingCutoffResumeRef.current;
    if (pendingResume) {
      pendingCutoffResumeRef.current = null;
      if (studentSpokeDuringBusyWindow) {
        onDebugEvent?.('cutoff_resume_skipped', 'student utterance queued during busy window — new turn supersedes');
      } else {
        onDebugEvent?.('cutoff_resume_dispatched', `${pendingResume.length} chars`);
        void handleStudentTranscriptForBrain(pendingResume, { silent: true, bypassPerceptionDedupe: true });
      }
    }
  }, [callBrainOnce, onDebugEvent, armCoverForDispatch]);

  // Resume-from-cut granularity (P5), factored so both resume sites — the
  // verdict-driven 'speaking' branch below and the R32 (H3) timeout-resume
  // poller (perceptionOnSpeechStart / decideStage2TimeoutRestore verdict
  // 'resume-tts') — stay byte-identical instead of maintaining two copies
  // that can drift (R32 review round 1, Finding 2). snapshot[0] is the
  // in-flight (partially-played) sentence; by default it's re-spoken
  // WHOLE, but with TUTOR_RESUME_FROM_CLAUSE on, it's replaced with just
  // the tail from the clause the cut landed in (clauseTailFromFraction) so
  // we don't re-speak content the student already heard. Early-cut → tail
  // === the whole sentence (no-op).
  const applyClauseTailSnapshot = useCallback((snapshot: string[], cutFraction: number): string[] => {
    if (!TUTOR_RESUME_FROM_CLAUSE || snapshot.length === 0) return snapshot;
    const tail = clauseTailFromFraction(snapshot[0], cutFraction);
    if (!tail || tail === snapshot[0]) return snapshot;
    console.warn(
      `[RESUME-CUT] clause-snap @${cutFraction.toFixed(2)}: "${snapshot[0].slice(0, 40)}…" → "${tail.slice(0, 40)}…"`,
    );
    onDebugEvent?.('resume_from_clause', `@${cutFraction.toFixed(2)} tail="${tail.slice(0, 50)}"`);
    return [tail, ...snapshot.slice(1)];
  }, [onDebugEvent]);

  // Stage 2 — perception verdict dispatcher. Called after a perception
  // cancel checkpoint is set (perceptionInterruptCheckpointRef populated
  // by onSpeechStart). Picks an action based on the verdict:
  //   - noise / filler           → RESTORE: re-fire the original call
  //   - drop_self_voice          → DROP: no re-fire (false alarm; the
  //                                "speech" we heard was the tutor's
  //                                own voice leaking back)
  //   - continuation             → MERGE: re-fire with original
  //                                transcript + bracketed perception
  //                                addendum (Q3 simplification — true
  //                                timestamped history deferred)
  //   - barge_in / new_turn      → FRESH: re-fire with perception
  //                                transcript as the new student turn
  // Checkpoint is cleared in every branch so a stale checkpoint never
  // triggers a refire on a later unrelated verdict.
  const applyPerceptionVerdict = useCallback((
    verdict: PerceptionVerdict,
    perceptionText: string,
  ) => {
    const checkpoint = perceptionInterruptCheckpointRef.current;
    if (!checkpoint) return;
    perceptionInterruptCheckpointRef.current = null;
    // Round-28: a real verdict is consuming the checkpoint — the
    // no-verdict timeout-RESTORE is moot.
    if (stage2TimeoutRestoreTimerRef.current) {
      clearTimeout(stage2TimeoutRestoreTimerRef.current);
      stage2TimeoutRestoreTimerRef.current = null;
    }
    // Stage 3 fix #10: re-arm the speakText gate AT VERDICT TIME. The
    // original cancel-site arm (in onSpeechStart / retro-cancel) may
    // have expired by the time Haiku returns (300-1500ms typical, up to
    // 3000ms timeout). Re-arming here covers any straggler sentence
    // from the cancelled orchestrator that the loop is still draining.
    // RESTORE/MERGE/FRESH paths below dispatch NEW brain calls; those
    // calls' first sentences typically arrive 1-3s later, well after
    // this 600ms gate expires.
    speakTextBlockedUntilRef.current = Date.now() + SPEAK_TEXT_GATE_MS;
    // Phase 2: a verdict is resolving a cancelled turn (FRESH/RESTORE/MERGE
    // re-dispatch will re-arm their own ack) — drop any pending ack.
    if (ackTimerRef.current) { clearTimeout(ackTimerRef.current); ackTimerRef.current = null; }
    if (escalationTimerRef.current) { clearInterval(escalationTimerRef.current); escalationTimerRef.current = null; }
    const elapsedMs = Date.now() - checkpoint.cancelledAt;
    const cleanPerceptionText = (perceptionText || '').trim();
    const stage = checkpoint.cancelledDuringState;
    const stageLabel = stage === 'speaking' ? 'STAGE-3' : 'STAGE-2';
    if (verdict === 'noise' || verdict === 'filler' || verdict === 'drop_self_voice') {
      // Tutor reaction (noise-nagging): every entry here means a cancel
      // actually paused the tutor's speech or aborted its thinking on a
      // sound that turned out to be non-substantive (environmental noise,
      // filler pickup, or self-voice leakage — mic-pickup false positives
      // all three, and the suggested remedies apply to each). Count it;
      // on threshold, stash the one-time directive and let the idle-send
      // voice it at the next quiet beat. Never interrupts the resume paths
      // below — recording is pure bookkeeping.
      if (TUTOR_NOISE_NAG && recordReactionEvent(noiseReactionStateRef.current, NOISE_INTERRUPTION_REACTION, Date.now())) {
        pendingReactionDirectiveRef.current = NOISE_INTERRUPTION_REACTION.directive;
        onDebugEvent?.('noise_nag_armed', `threshold hit (${NOISE_INTERRUPTION_REACTION.threshold} noise cancels in window)`);
        armReactionIdleSendRef.current();
      }
      // Round-6d: a CONFIRMED self-echo kill arms cancel immunity — the
      // resumed/restored audio's own echo must not re-kill it (the audible
      // kill→replay loop of portal-37c0e0bf: overlapping tails heard as
      // "reverberation" + the cut clause replayed, "exactly right" twice).
      if (verdict === 'drop_self_voice') {
        selfEchoCancelImmunityUntilRef.current = Date.now() + SELF_ECHO_CANCEL_IMMUNITY_MS;
      }
      // drop_self_voice takes the SAME recovery paths as noise/filler in
      // every stage (round-6c fix, portal-28ee6557). It used to early-return
      // "drop, no refire" for Stage 2 — but a stage-2 cancel ABORTS the
      // in-flight brain call, and when the trigger was the tutor's own echo
      // the aborted turn was entirely legitimate. Observed live: the opener
      // echo retro-cancelled during 'processing', verdict drop_self_voice
      // dropped it, and the tutor sat silent for ~91s (until the student
      // spoke again) with the rest of the opening turn never delivered. The
      // shared stage-2 path below already has the correct semantics: RESTORE
      // (re-fire the original) only when the brain was genuinely cut off
      // (brainWasInFlight && aborted), silent-drop when the turn had already
      // completed — the duplicate-response guard that motivated the old
      // early-return.
      if (stage === 'speaking') {
        // Stage 3.1 (2026-06-16): RESUME-FROM-CUT — the proper Q5 B2
        // fix. The verdict says the cancel was a false positive (noise,
        // filler, or self-voice). If we have unplayed sentences from
        // the speakText queue at cut time, re-queue them via
        // resumeSpeakText — the student hears ~500ms of silence then
        // the queued content resumes naturally. The partially-played
        // sentence's tail is lost (not in the snapshot), but C / D /
        // E… all replay cleanly. This is dramatically better UX than
        // the refire-on-noise quick fix (~3-15s gap + brain restart
        // from beginning).
        //
        // Applies regardless of brainWasInFlight: we're not generating
        // new content, just replaying queued content. No duplication
        // risk because the brain isn't being called again.
        if (checkpoint.unplayedSentencesSnapshot.length > 0) {
          const n = checkpoint.unplayedSentencesSnapshot.length;
          const resumeQueue = applyClauseTailSnapshot(checkpoint.unplayedSentencesSnapshot, checkpoint.cutFraction);
          console.warn(
            `[PERCEPTION] STAGE-3.1 resume-from-cut (${verdict}, ${elapsedMs}ms): re-queuing ${n} unplayed sentence(s)`,
          );
          onDebugEvent?.('perception_stage3_1_resume', `${verdict} after ${elapsedMs}ms · ${n} sentences`);
          resumeSpeakTextRef.current?.(resumeQueue);
          // Render↔speech sync: the held tail is being replayed → release
          // the whole buffer so its renders land with the resumed narration.
          flushAllRenderBuffer();
          return;
        }

        // Stage 3.1 fallback to the quick-fix (refire-on-noise) for
        // the case where the snapshot is empty (brain was mid-emit
        // but the queue was momentarily drained between sentences, or
        // the brain hadn't queued anything yet). Refire restores the
        // content via a fresh brain call — audible glitch but
        // recoverable.
        if (checkpoint.brainWasInFlight) {
          console.warn(
            `[PERCEPTION] STAGE-3 refire-on-noise fallback (${verdict}, ${elapsedMs}ms): empty queue snapshot, brain was in flight, refiring originalTranscript=${JSON.stringify(checkpoint.originalTranscript).slice(0, 80)}`,
          );
          onDebugEvent?.('perception_stage3_refire_on_noise', `${verdict} after ${elapsedMs}ms`);
          dropRenderBuffer(); // render↔speech sync: refire redraws from scratch
          // R32 (H1 review round 1, Finding 3): this refire hits the exact
          // same mid-utterance bare-drop guard as RESTORE/MERGE/FRESH — same
          // bug class. queueOnMidUtterance (+ its drain-guarantee timer,
          // Finding 1) makes queuing here safe instead of silently dropping.
          void handleStudentTranscriptForBrain(checkpoint.originalTranscript, {
            ...(checkpoint.originalOpts || {}),
            bypassPerceptionDedupe: true,
            queueOnMidUtterance: true,
          });
          return;
        }

        // Brain had already finished AND queue was empty — TTS was
        // fully drained when the cancel hit (or near-fully drained).
        // Nothing to resume, nothing in flight. Silent-accept.
        console.warn(
          `[PERCEPTION] ${stageLabel} verdict=${verdict} (${elapsedMs}ms): silent-accept (no unplayed content to resume, brain already finished)`,
        );
        onDebugEvent?.('perception_stage3_silent_accept', `${verdict} after ${elapsedMs}ms`);
        // Render↔speech sync: content was delivered (no refire) → release
        // any buffered renders that belong to the played narration.
        flushAllRenderBuffer();
        return;
      }
      // Stage 3 fix #14 (2026-06-15): RESTORE-after-finished guard.
      // If the brain was NOT in flight at cancel time, it already
      // produced its response and TTS is just playing out. Re-firing
      // the same transcript would generate a DUPLICATE brain response
      // (observed live 2026-06-15 phys-sci session: brief noise during
      // post-brain TTS triggered Stage 2 retro-cancel + heuristic
      // filler + RESTORE, which re-fired the prior brain call's
      // transcript and produced the same "diagram demo" tutor reply
      // twice more). When brainWasInFlight is false, treat
      // noise/filler/drop_self_voice as DROP — TTS is already drained
      // by the cancel-site clearSpeechQueue, no re-fire needed.
      // Two ways the original turn is already safely delivered → DROP rather
      // than re-fire (either would duplicate an answer the student already got):
      //   (a) brain wasn't in flight at cancel time (TTS-only playout), or
      //   (b) it WAS in flight but the stream finished before the abort landed,
      //       so the turn completed normally (brainTurnAbortedRef stayed false).
      // Only re-fire when the turn was genuinely cut off (actually aborted).
      if (!checkpoint.brainWasInFlight || !brainTurnAbortedRef.current) {
        // Round-6d (portal-37c0e0bf): "brain done" does NOT mean "delivered".
        // A 'processing' cancel can land in the inter-sentence gap — every
        // sentence already emitted to the speakText queue, brain finished —
        // and the cancel's clearSpeechQueue killed the UNPLAYED tail. This
        // branch used to pure-drop, which cut the demo intro to its first
        // sentence and left the student in silence (~2.5 min until they
        // re-engaged). If the cancel was a false alarm and sentences were
        // queued, resume them — same replay-only semantics as stage-3.1
        // (no brain re-fire, so no duplication risk).
        if (checkpoint.unplayedSentencesSnapshot.length > 0) {
          const n = checkpoint.unplayedSentencesSnapshot.length;
          const resumeQueue = applyClauseTailSnapshot(checkpoint.unplayedSentencesSnapshot, checkpoint.cutFraction);
          console.warn(
            `[PERCEPTION] ${stageLabel} verdict=${verdict} (${elapsedMs}ms): brain done but ${n} unplayed sentence(s) were killed — resuming them`,
          );
          onDebugEvent?.('perception_stage2_brain_done_resume', `${verdict} after ${elapsedMs}ms · ${n} sentences`);
          resumeSpeakTextRef.current?.(resumeQueue);
          flushAllRenderBuffer();
          return;
        }
        console.warn(
          `[PERCEPTION] ${stageLabel} verdict=${verdict} (${elapsedMs}ms): RESTORE-after-finished DROP (brain response already delivered — inFlight=${checkpoint.brainWasInFlight}, aborted=${brainTurnAbortedRef.current}; not re-firing to avoid duplicate)`,
        );
        onDebugEvent?.('perception_stage2_restore_dropped_brain_done', `${verdict} after ${elapsedMs}ms · snapshot=0`);
        // Render↔speech sync: original turn already delivered, no refire →
        // release its buffered renders rather than dropping them.
        flushAllRenderBuffer();
        return;
      }
      // Stage 2: brain hadn't started speaking yet. Re-fire the
      // original transcript — brain produces a fresh response.
      console.warn(
        `[PERCEPTION] ${stageLabel} verdict=${verdict} (${elapsedMs}ms): RESTORE — re-firing original transcript=${JSON.stringify(checkpoint.originalTranscript).slice(0, 80)}`,
      );
      onDebugEvent?.('perception_stage2_restore', `${verdict} after ${elapsedMs}ms`);
      dropRenderBuffer(); // render↔speech sync: refire redraws from scratch
      // bypassPerceptionDedupe: our own refire must not be dropped by
      // the production-WS suppression slot armed at cancel time.
      // R32 (H1): queue instead of drop if this refire lands mid-utterance
      // — the checkpoint is already consumed by this verdict, so a bare
      // drop here would lose the RESTORE outright with nothing to recover
      // it (unbounded silence).
      void handleStudentTranscriptForBrain(checkpoint.originalTranscript, {
        ...(checkpoint.originalOpts || {}),
        bypassPerceptionDedupe: true,
        queueOnMidUtterance: true,
      });
      return;
    }
    // Q3 timestamped-history protocol (2026-06-16): both MERGE
    // (continuation) and FRESH (barge_in/new_turn) below now represent the
    // interrupted tutor turn as its OWN {role:'assistant'} history entry
    // carrying a `<cut>` marker — replacing the old bracketed-addendum
    // synthetic string ("X [Student interrupted you mid-response with: Y]").
    // The brain reads the separate entries naturally (...prior, the cut
    // partial, then the student's interrupting words as <student_said>);
    // no new prompt rule needed (design Q3).
    //
    // The cut entry is built ONLY when the brain was genuinely mid-flight
    // at cancel time. If it had already finished, its full response is
    // committed to transcriptRef by handleResponseDone and lives in
    // history on its own — injecting a cut entry would duplicate it (same
    // duplicate-response hazard fix #14 addressed for the RESTORE path).
    const cutTurn = ((): { role: 'assistant'; content: string } | null => {
      if (!checkpoint.brainWasInFlight) return null;
      const turnStart = brainTurnStartedAtRef.current;
      const tCutSec = turnStart > 0
        ? Math.max(0, (checkpoint.cancelledAt - turnStart) / 1000)
        : null;
      const timeTag = tCutSec != null ? `[t+${tCutSec.toFixed(1)}s] ` : '';
      // What the student actually HEARD before the cut = every sentence
      // dispatched to TTS this turn (ttsScriptBuffer, scoped to this turn
      // via brainTurnStartedAt) MINUS the never-heard queued tail.
      // unplayedSentencesSnapshot is [in-flight, ...queued] (Stage 3.1
      // f435560); the in-flight sentence WAS partially heard, so it stays
      // as the cut boundary — drop only slice(1) (the queue that never
      // reached the speaker).
      const neverHeard = new Set(checkpoint.unplayedSentencesSnapshot.slice(1));
      const heard = ttsScriptBufferRef.current
        .filter((s) => turnStart > 0 && s.spokenStartedAt >= turnStart)
        .map((s) => s.text)
        .filter((t) => !neverHeard.has(t));
      const spokenText = heard.join(' ').trim();
      // 'speaking' with spoken text → "[t+N.Ns] <partial> <cut>".
      // 'thinking' (or speaking before any audio) → "[t+N.Ns] <cut>"
      // (interrupted before saying anything).
      return {
        role: 'assistant',
        content: spokenText ? `${timeTag}${spokenText} <cut>` : `${timeTag}<cut>`,
      };
    })();
    if (verdict === 'continuation') {
      // MERGE: the student added to / built on what they were saying. The
      // interrupting words are dispatched as a normal (visible) student
      // turn; the cut partial rides along as injected history so the
      // brain knows it was mid-utterance. No silent pre-add dance — Y is
      // the actual current student turn, so callBrainOnce adds it to chat
      // exactly once. When there's no perception text, fall back to
      // re-firing the original transcript.
      const freshText = cleanPerceptionText || checkpoint.originalTranscript;
      console.warn(
        `[PERCEPTION] ${stageLabel} verdict=${verdict} (${elapsedMs}ms): MERGE — cutTurn=${cutTurn ? `"${cutTurn.content.slice(0, 60)}"` : 'none'}, fresh=${JSON.stringify(freshText).slice(0, 80)}`,
      );
      onDebugEvent?.(`perception_${stageLabel.toLowerCase().replace('-', '')}_merge`, `${verdict} after ${elapsedMs}ms`);
      dropRenderBuffer(); // render↔speech sync: new merged turn redraws
      // R32 (H1): queue rather than drop if MERGE lands mid-utterance.
      void handleStudentTranscriptForBrain(freshText, {
        bypassPerceptionDedupe: true,
        queueOnMidUtterance: true,
        ...(cutTurn ? { injectedHistoryTail: [cutTurn] } : {}),
      });
      return;
    }
    // barge_in / new_turn / escalate (escalate shouldn't reach here
    // post-Haiku, but handle defensively) → FRESH new turn. The cut
    // partial rides along as injected history so the brain knows the
    // student talked over it (rather than answering an idle prompt).
    const fresh = cleanPerceptionText || checkpoint.originalTranscript;
    console.warn(
      `[PERCEPTION] ${stageLabel} verdict=${verdict} (${elapsedMs}ms): FRESH new turn, cutTurn=${cutTurn ? 'yes' : 'none'}, transcript=${JSON.stringify(fresh).slice(0, 80)}`,
    );
    onDebugEvent?.(`perception_${stageLabel.toLowerCase().replace('-', '')}_fresh`, `${verdict} after ${elapsedMs}ms`);
    dropRenderBuffer(); // render↔speech sync: fresh turn redraws
    // R32 (H1): queue rather than drop if FRESH lands mid-utterance.
    void handleStudentTranscriptForBrain(fresh, {
      bypassPerceptionDedupe: true,
      queueOnMidUtterance: true,
      ...(cutTurn ? { injectedHistoryTail: [cutTurn] } : {}),
    });
  }, [handleStudentTranscriptForBrain, onDebugEvent, dropRenderBuffer, flushAllRenderBuffer, applyClauseTailSnapshot]);
  // Publish to the ref so the perception callbacks (defined earlier in
  // render order via useCallback closures) can call it through the ref
  // surface without a hoisting reference issue.
  applyPerceptionVerdictRef.current = applyPerceptionVerdict;

  // Short relay-mode prompt for Realtime when claudeBrainMode is on.
  // Realtime is reduced to STT + verbatim TTS. It does not author content.
  // Critically: if response.create ever fires WITHOUT explicit read-aloud
  // instructions, Realtime must produce ZERO output — not "I'm sorry I
  // can't do that", not "let me think", nothing. Otherwise you get the
  // refusal-narration bug where Realtime authors against the relay prompt
  // and says things like "I can't plot or draw directly".
  const RELAY_MODE_PROMPT = [
    'You are a voice transport layer, not a tutor or assistant.',
    'NEVER author your own response. NEVER refuse, NEVER apologize,',
    'NEVER explain that you can\'t do something. If you receive a',
    'response.create with no explicit read-aloud instructions, output',
    'silence — produce no audio, no text. The application drives every',
    'utterance via response.create with explicit read-aloud instructions.',
    'When you do receive read-aloud instructions, read the supplied text',
    'verbatim — no paraphrasing, no greetings, no additions, no apologies.',
    'Do not call tools.',
  ].join(' ');

  // realtime-2: subject-filter the whiteboard tools registered in the RT-2
  // session so e.g. an AP Physics session doesn't carry chemistry / biology
  // / ELA tools. Fail-open — resolveToolSubjects returns null for subjects
  // it can't map and filterToolsForSubject then returns the full set. Other
  // engines leave this undefined; the hook registers the full WHITEBOARD_TOOLS.
  const realtimeV2Tools = useRealtimeV2
    ? filterToolsForSubject(WHITEBOARD_TOOLS, resolveToolSubjects(subject)).tools
    : undefined;

  // Initialize the realtime connection
  // ── Perception stage resolution. Was originally needed pre-Stage-4
  // for the inputAuthority prop derivation; after the Stage 4 cleanup
  // (2026-06-15) the realtime hook always treats perception as the
  // sole input authority. perceptionStage now just gates whether the
  // perception WS is enabled at all (>=0 enables; the value is also
  // read by some legacy STAGE-3/STAGE-3.1 cancel-path log labels).
  const perceptionEnvStage = process.env.NEXT_PUBLIC_TUTOR_PERCEPTION_STAGE;
  const [perceptionRuntimeStage, setPerceptionRuntimeStage] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (process.env.NODE_ENV === 'production') return;
    const w = window as unknown as { __tutorPerceptionStage?: string | number };
    if (w.__tutorPerceptionStage !== undefined) {
      setPerceptionRuntimeStage(String(w.__tutorPerceptionStage));
    }
  }, []);
  const perceptionStageRaw = perceptionRuntimeStage ?? perceptionEnvStage;
  const perceptionStage = (() => {
    const n = Number.parseInt(perceptionStageRaw ?? '', 10);
    return Number.isFinite(n) && n >= 0 && n <= 4 ? n : -1;
  })();

  const realtime = useOpenAIRealtime({
    instructions,
    voice,
    vadThreshold,
    vadSilenceDurationMs,
    vadPrefixPaddingMs,
    reconnectEnabled,
    useRealtimeV2,
    tools: realtimeV2Tools,
    relayMode: claudeBrainMode
      ? {
          instructions: RELAY_MODE_PROMPT,
          onUserTranscript: handleStudentTranscriptForBrain,
          ttsProvider,
          cartesiaVoiceId,
          speakingRate,
          studentName,
        }
      : undefined,
    onTranscriptUpdate: handleTranscriptUpdate,
    onWhiteboardCommand: handleWhiteboardCommand,
    onQueryFeatures: (args) => {
      // Resolve list_whiteboard_features against the session catalog.
      // With an id, return just that item's features; otherwise return
      // every feature currently on the whiteboard so the tutor can pick
      // any target without needing an id.
      const catalog = catalogRef.current;
      const items = args.id
        ? (catalog.getItem(args.id) ? [catalog.getItem(args.id)!] : [])
        : catalog.getItems();
      if (items.length === 0) return null;
      return items.map((item) => ({
        itemId: item.itemId,
        action: item.action,
        pageTitle: item.pageTitle,
        features: item.features.map((f) => ({
          target: f.labels[0] || f.canonical,
          canonical: f.canonical,
          kind: f.kind,
          description: f.description,
        })),
      }));
    },
    onResponseDone: handleResponseDone,
    onError: handleError,
    onTranscriptionStatus,
    onStateChange,
    onStudentAudioChunk: audioRecordEnabled ? audioRecorder.pushStudentChunk : undefined,
    onTutorAudioChunk: audioRecordEnabled ? audioRecorder.pushTutorChunk : undefined,
    // Audio-hiccup visibility (2026-07-15): a mid-turn TTS retry/skip used to
    // read as the tutor silently freezing. Transient dock notice, auto-clears.
    onTtsIssue: (kind) => {
      setTtsNotice(kind === 'retrying' ? 'Audio hiccup — retrying…' : 'Audio hiccup — skipped a line (it’s in the transcript)');
      if (ttsNoticeTimerRef.current) clearTimeout(ttsNoticeTimerRef.current);
      ttsNoticeTimerRef.current = setTimeout(() => setTtsNotice(null), kind === 'retrying' ? 4000 : 6000);
    },
    // Round-28b: Cartesia AND the voice-matched ElevenLabs fallback both
    // failed this sentence — hand the unspoken text to the host chrome for
    // the transient board-bottom captions pin.
    onVoiceHiccupCaption: (text) => onVoiceHiccup?.(text),
    // V2 self-voice echo defence (2026-07-15): stamp the perception buffer at
    // REAL TTS playback time so late sentences in long turns keep an accurate
    // timing window and their verbatim echoes get dropped by the matcher.
    onTtsSentencePlayback: applyTtsPlaybackStamp,
    // Render↔speech sync: drive the buffered-render flush off TTS playback.
    // 'sentence-start' = a new sentence's audio began (the prior one
    // completed) → release renders anchored to that prior sentence.
    // 'drain' = all dispatched audio has played → release the tail.
    onTtsPlaybackProgress: (event, wordPos) => {
      // Caption word-sync: a drain AFTER stream-end finalizes the caption
      // (the tracker ignores mid-stream drains itself).
      if (event === 'drain') captionSyncRef.current.notifyDrain();
      // turn_latency: first audible sentence of the turn (first-wins; must
      // stamp BEFORE the render-sync flag gate — instrumentation is
      // unconditional).
      if (event === 'sentence-start') {
        turnLatencyRef.current?.mark('firstAudio', Date.now());
        if (turnLatencyAwaitingAudioRef.current && turnLatencyRef.current) {
          turnLatencyAwaitingAudioRef.current = false;
          onDebugEvent?.('turn_latency', formatTurnLatency(turnLatencyRef.current.summarize()));
          turnLatencyRef.current = null;
        }
      }
      if (!TUTOR_RENDER_SYNC) return;
      if (event === 'sentence-start') {
        ttsPlaybackStartedCountRef.current++;
        // Pull-early (2026-07-24 round): the buffer could only ever DELAY a
        // render past its stream position, never advance it — so a tool
        // call the brain parked AFTER its narration (Rule 15 violation)
        // painted only when its late anchor sentence completed, i.e. after
        // the content had already been spoken. If the sentence starting NOW
        // names a buffered render, release it and everything before it (a
        // stream-order prefix, so board order is preserved) via capExpired —
        // the pure core's existing release valve. Sentence texts play in
        // dispatch order, so the starting sentence is turnNarration[count-1].
        const startingSentence =
          turnNarrationRef.current[ttsPlaybackStartedCountRef.current - 1] ?? '';
        if (startingSentence && renderBufferRef.current.length > 0) {
          const buf = renderBufferRef.current;
          let matchedIdx = -1;
          for (let i = buf.length - 1; i >= 0; i--) {
            const e = buf[i];
            if (e.pendingAsync || e.capExpired) continue;
            // Entries already releasable on their own anchor need no pull —
            // and everything before them is an even-earlier anchor.
            if (!e.pendingReanchor && ttsPlaybackStartedCountRef.current >= e.anchorM + 1) break;
            if (e.anchorKeywords && sentenceIntroducesAnchor(startingSentence, e.anchorKeywords)) {
              matchedIdx = i;
              break;
            }
          }
          if (matchedIdx >= 0) {
            for (let i = 0; i <= matchedIdx; i++) {
              if (!buf[i].pendingAsync) buf[i].capExpired = true;
            }
            onDebugEvent?.('render_sync_pull_early',
              `sentence ${ttsPlaybackStartedCountRef.current} names buffered idx=${matchedIdx} (anchorM=${buf[matchedIdx].anchorM}) — releasing ${matchedIdx + 1} entr${matchedIdx === 0 ? 'y' : 'ies'}`);
          }
        }
        // Progress happened → reset the stall timer so it can't fire
        // while sentences are steadily playing toward an anchor.
        if (renderBufferRef.current.length > 0) armRenderStall();
        flushReadyRenders();
      } else if (event === 'word') {
        // Task 3.2 (flag-gated): advance the word clock and try a
        // word-anchored release. Word ticks ALSO reset the stall timer —
        // a mid-sentence-anchored render in a long sentence would
        // otherwise false-trigger the drainAll stall (the shared timer
        // used to reset only on sentence progress).
        if (TUTOR_RENDER_WORD_ANCHOR && wordPos) {
          lastWordPosRef.current = wordPos;
          if (renderBufferRef.current.length > 0) {
            armRenderStall();
            flushReadyRenders();
          }
        }
      } else if (event === 'drain') {
        // Turn audio drained → release the tail; no stall re-arm needed.
        // (Explicit branch — Task 3.1 adds 'word' events to this stream,
        // which MUST NOT drainAll; Task 3.2 will consume them for
        // word-anchored flushes.)
        flushReadyRenders({ drainAll: true });
      }
    },
    // Task 3.1: the Cartesia TTS WebSocket degraded for this session
    // (sentences fall back to the proven HTTP path — audible behavior
    // unchanged, word-level render sync unavailable). Debug-event only;
    // allowlisted for embed persistence via the tts_ws_ prefix.
    onTtsTransportFallback: (reason) => {
      onDebugEvent?.('tts_ws_fallback', reason);
    },
  });

  // Wire up refs so callbacks can access hook functions
  injectContextRef.current = realtime.injectContext;
  sendTextMessageRef.current = realtime.sendTextMessage;
  speakTextRef.current = realtime.speakText;
  clearSpeechQueueRef.current = realtime.clearSpeechQueue;
  peekSpeechQueueRef.current = realtime.peekSpeechQueue;
  resumeSpeakTextRef.current = realtime.resumeSpeakText;
  getCurrentSentenceFractionRef.current = realtime.getCurrentSentenceFraction;
  getSpokenProgressRef.current = realtime.getSpokenProgress; // Task 3.3 ink pacing
  signalBrainThinkingRef.current = realtime.signalBrainThinking;

  // ── Voice Perception Layer (Stage 0 — shadowed, logs only) ─────────────
  // See memory/project_voice_perception_layer_design.md for the locked
  // architecture. Stage 0 spins up a parallel gpt-realtime-2 WS in
  // transcription-only mode so we can measure transcript-agreement rate
  // against the production WS WITHOUT altering production behaviour.
  //
  // Enable: NEXT_PUBLIC_TUTOR_PERCEPTION_STAGE=0 (or higher; later stages
  // layer behaviour on top). Default unset ⇒ feature OFF entirely.
  // Runtime override: window.__tutorPerceptionStage = 0..4 (dev only;
  // changes the resolved stage on the NEXT effect run — refresh the page
  // or call window.__tutorForcePerceptionClose() to re-enter).
  // perceptionStage / perceptionRuntimeStage / perceptionEnvStage are
  // declared just above the useOpenAIRealtime call (Stage 4 needs the
  // resolved stage to derive inputAuthority).
  // Only open the perception WS once the production WS is connected — this
  // avoids issuing a mic-permission prompt before the user clicks Start.
  const perceptionEnabled = perceptionStage >= 0 && realtime.isConnected;

  // Keep production WS state in a ref so the perception onTranscript callback
  // can tag every log with what the production WS was doing at the moment
  // perception saw the transcript. Stage 0 review uses this to filter
  // self-voice contamination (perception logs during state='speaking').
  const productionStateRef = useRef<RealtimeState>(realtime.state);
  productionStateRef.current = realtime.state;

  // Round-6 live-test fix (portal-cca76850): recorded 'speaking' windows —
  // [start, end] wall-clock spans during which the tutor was audibly
  // speaking. The classifier's onset-during-playback echo gate needs "was
  // the tutor talking when this utterance STARTED?", and script playback
  // stamps can't answer it reliably: a barge-in kill + resume splinters the
  // turn so the killed sentence's window is closed by the time its echo's
  // transcript arrives (observed live: "Last we tackled" dispatched as
  // new_turn 6.7s after the kill). State transitions are stamp-mess-proof.
  // Effect timing lags the real transition by a render flush (~ms), well
  // inside the ε the lookup applies.
  const speakingWindowsRef = useRef<Array<{ start: number; end: number | null }>>([]);
  useEffect(() => {
    const now = Date.now();
    const wins = speakingWindowsRef.current;
    const last = wins[wins.length - 1];
    if (realtime.state === 'speaking') {
      if (!last || last.end !== null) wins.push({ start: now, end: null });
    } else if (last && last.end === null) {
      last.end = now;
    }
    // Prune windows older than the classifier's 30s lookback (plus slack).
    while (wins.length && (wins[0].end ?? now) < now - 60_000) wins.shift();
  }, [realtime.state]);
  const wasTutorSpeakingAt = useCallback((tMs: number): boolean => {
    const EPS = 300; // VAD-onset slop + effect-flush lag
    const now = Date.now();
    return speakingWindowsRef.current.some(
      (w) => tMs >= w.start - EPS && tMs <= (w.end ?? now) + EPS,
    );
  }, []);

  // Round-6d: cancel immunity after a CONFIRMED self-echo kill — see
  // SELF_ECHO_CANCEL_IMMUNITY_MS in flags.ts. Stamped by
  // applyPerceptionVerdict when a verdict resolves drop_self_voice; read by
  // the onSpeechStart cancel paths and the retro-cancel effect.
  const selfEchoCancelImmunityUntilRef = useRef<number>(0);

  // Round-6: forward playback-route + shared-mic lifecycle (plain modules
  // with no onDebugEvent access) into the session's persisted debug events —
  // the round-6 live test was blind on whether the AEC route's play()
  // succeeded on the user's device, because those modules only console.warn.
  useEffect(() => {
    const onRoute = (e: Event) => {
      const d = (e as CustomEvent<{ kind?: string; detail?: string }>).detail;
      onDebugEvent?.('playback_route', `${d?.kind}: ${d?.detail ?? ''}`);
    };
    const onMic = (e: Event) => {
      const d = (e as CustomEvent<{ kind?: string; detail?: string }>).detail;
      onDebugEvent?.('shared_mic', `${d?.kind}: ${d?.detail ?? ''}`);
    };
    window.addEventListener('evelyn:playback-route', onRoute);
    window.addEventListener('evelyn:shared-mic', onMic);
    return () => {
      window.removeEventListener('evelyn:playback-route', onRoute);
      window.removeEventListener('evelyn:shared-mic', onMic);
    };
  }, [onDebugEvent]);

  // Student marks (Phase 1) idle-send: fires ~4s after the last mark, ONLY
  // when the tutor is not speaking (productionStateRef, the existing
  // production-WS state mirror above) and no brain call is in flight
  // (brainBusyRef — the same "only one brain call in flight" serialization
  // ref handleStudentTranscriptForBrain checks); otherwise re-arms and
  // checks again. Sends through the existing bracketed context-injection
  // path (DrawPad precedent) so it flows as a normal student turn. Declared
  // here (after `realtime`/productionStateRef exist) rather than next to
  // drainStudentMarks — nothing before this point in the component needs
  // it (only the handle's pushStudentMark, populated further down, calls
  // it), so declaration order is a non-issue.
  const STUDENT_MARK_IDLE_MS = 4000;
  const armStudentMarkIdleSend = useCallback(() => {
    if (studentMarkIdleTimerRef.current) clearTimeout(studentMarkIdleTimerRef.current);
    studentMarkIdleTimerRef.current = setTimeout(() => {
      studentMarkIdleTimerRef.current = null;
      if (pendingStudentMarksRef.current.length === 0) return;
      // Busy = tutor talking, a brain call in flight, OR the STUDENT is
      // mid-utterance / their transcription is still landing — firing a
      // mark turn under a live student utterance gets retro-cancelled by
      // perception Stage 2 and divorces the marks from the words they
      // disambiguate (final review, 2026-07-05). Also re-arm while the
      // student is TYPING in the dock — marks should attach to the typed
      // message, not idle-send mid-composition (user-identified gap,
      // 2026-07-05).
      const busy =
        productionStateRef.current === 'speaking' ||
        brainBusyRef.current ||
        perceptionMidUtteranceRef.current ||
        awaitingDispatchTimerRef.current != null ||
        studentMarkOcrInFlightRef.current > 0 ||
        studentTypingRef.current;
      if (busy) { armStudentMarkIdleSend(); return; }
      const block = drainStudentMarks();
      if (block) {
        onDebugEvent?.('student_mark_idle_send', block.slice(0, 90));
        sendTextMessageRef.current?.(`[${block} Respond to what they are pointing at.]`);
      }
    }, STUDENT_MARK_IDLE_MS);
  }, [drainStudentMarks, onDebugEvent]);

  // Tutor-reaction idle-send (noise-nagging v1): mirrors the student-marks
  // idle-send above — waits for a quiet beat (~4s after arming), re-arms
  // while the tutor is talking / a brain call is in flight / the student is
  // mid-utterance or typing, then dispatches the pending reaction directive
  // as a silent bracketed brain turn ([start lesson] / [Session-resumed…]
  // precedent: no student chat bubble; the tutor's spoken response lands as
  // a normal tutor turn). One directive slot — reactions fire at most once
  // per session per rule, so a queue is unnecessary.
  const REACTION_IDLE_MS = 4000;
  const armReactionIdleSend = useCallback(() => {
    if (reactionIdleTimerRef.current) clearTimeout(reactionIdleTimerRef.current);
    reactionIdleTimerRef.current = setTimeout(() => {
      reactionIdleTimerRef.current = null;
      const directive = pendingReactionDirectiveRef.current;
      if (!directive) return;
      const busy =
        productionStateRef.current === 'speaking' ||
        brainBusyRef.current ||
        perceptionMidUtteranceRef.current ||
        awaitingDispatchTimerRef.current != null ||
        studentTypingRef.current;
      if (busy) { armReactionIdleSend(); return; }
      pendingReactionDirectiveRef.current = null;
      onDebugEvent?.('noise_nag_sent', directive.slice(0, 90));
      // bypassPerceptionDedupe: the noise cancels that ARMED this reaction
      // also armed the 20s production-WS suppression window, and the
      // idle-send always fires inside it — without the bypass the directive
      // is swallowed as a suspected duplicate mic transcript (observed in
      // live verification 2026-07-05). Orchestrator-authored dispatches use
      // the same escape hatch as the RESTORE/refire paths.
      void handleStudentTranscriptForBrain(directive, { silent: true, bypassPerceptionDedupe: true });
    }, REACTION_IDLE_MS);
  }, [handleStudentTranscriptForBrain, onDebugEvent]);
  armReactionIdleSendRef.current = armReactionIdleSend;

  // Stage 3 fix #4 (2026-05-28): retroactive cancel for the state-race.
  // When the user starts speaking BEFORE the tutor TTS begins,
  // perception's speech_started fires during 'listening' — the cancel
  // gate misses. But if production state later TRANSITIONS to 'speaking'
  // Opening-turn audio shield (2026-07-04). "Fully delivered" = the first
  // brain turn's TEXT stream completed AND its TTS audio finished playing
  // (or the 90s no-audio cap passed — muted/headless runs where TTS never
  // starts). Both perception cancel sites gate on this instead of the bare
  // text-done flag: a long teacher-intro opener keeps speaking for tens of
  // seconds after text-done, and phantom self-echo transcripts (the mic
  // hearing the tutor through speakers) were cancelling that audio
  // mid-sentence while the captions ran on.
  const FIRST_TURN_AUDIO_CAP_MS = 90_000;
  const openingTurnFullyDelivered = useCallback(() => {
    if (!tutorFirstTurnDoneRef.current) return false;
    if (firstTurnAudioDoneRef.current) return true;
    return tutorFirstTurnDoneAtRef.current > 0
      && Date.now() - tutorFirstTurnDoneAtRef.current > FIRST_TURN_AUDIO_CAP_MS;
  }, []);
  // Latch the audio-done flag: state leaves 'speaking' after having been
  // 'speaking', with the first turn's text already done. (If the audio
  // finished before text-done, the leave-'speaking' transition after the
  // next state change latches it; the 90s cap is the final backstop.)
  useEffect(() => {
    if (firstTurnAudioDoneRef.current) return;
    if (realtime.state === 'speaking') {
      firstTurnSawSpeakingRef.current = true;
      return;
    }
    if (tutorFirstTurnDoneRef.current && firstTurnSawSpeakingRef.current) {
      firstTurnAudioDoneRef.current = true;
      console.log('[PERCEPTION] opening-turn audio delivered — cancels now honoured');
      onDebugEvent?.('perception_opening_audio_done', realtime.state);
      // Round-7c: opening audio is done — arm the mic-notice grace timer.
      // If a "quiet but finite" MicSilentWarning is (or becomes) pending
      // and the student still hasn't been heard from at all after this
      // much longer, THAT's the false-positive-free moment to tell them —
      // not the ~11s-in probe that fires while the opener is still
      // talking.
      openingAudioDoneAtRef.current = Date.now();
      if (micNoticeGateTimerRef.current) clearTimeout(micNoticeGateTimerRef.current);
      micNoticeGateTimerRef.current = setTimeout(() => {
        micNoticeGateTimerRef.current = null;
        if (micEverHeardRef.current) {
          pendingMicNoticeRef.current = null;
          return;
        }
        if (pendingMicNoticeRef.current) {
          setMicNotice(pendingMicNoticeRef.current);
          pendingMicNoticeRef.current = null;
          if (micNoticeTimerRef.current) clearTimeout(micNoticeTimerRef.current);
          micNoticeTimerRef.current = setTimeout(() => setMicNotice(null), 20000);
        }
      }, MIC_NOTICE_GRACE_MS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realtime.state]);
  // Cancel-storm delivery detection: leaving 'speaking' WITHOUT a recent
  // barge-in kill means a tutor reply actually played out to the student
  // — the loop is healthy, so reset the governor's cancel history. A
  // killed queue also leaves 'speaking', hence the speechKilledAtRef
  // window check (kills mark it at cancel time, transition follows
  // within tens of ms; 3s is generous).
  const wasSpeakingRef = useRef<boolean>(false);
  useEffect(() => {
    const speaking = realtime.state === 'speaking';
    if (wasSpeakingRef.current && !speaking
        && Date.now() - speechKilledAtRef.current > 3000) {
      cancelStormRef.current.recordDelivery();
    }
    wasSpeakingRef.current = speaking;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realtime.state]);

  // (or 'processing' for Stage 2) while the student is still mid-utterance,
  // fire the cancel retroactively so the eventual perception transcript
  // dispatches normally. Without this, the corrected answer in a long
  // utterance is lost (observed live 2026-05-28: user said "17 and 48"
  // but only the fragment "All right, hold on I think I got this"
  // reached the brain — the rest was spoken after production WS's mic
  // was disabled by the TTS-state mic-gate).
  useEffect(() => {
    if (!perceptionMidUtteranceRef.current) return;
    if (perceptionInterruptCheckpointRef.current) return;
    if (!lastBrainCallContextRef.current) return;
    const toState = realtime.state;
    const canRetroStage2 = perceptionStage >= 2 && toState === 'processing';
    const canRetroStage3 = perceptionStage >= 3 && toState === 'speaking';
    if (!canRetroStage2 && !canRetroStage3) return;
    // Opening-turn guard: don't let ambient noise retro-cancel the synthetic
    // kickoff turn before the tutor has FULLY delivered it — text AND audio.
    // (2026-07-04: phantom self-echo transcripts were cancelling the long
    // teacher-intro opener's still-playing audio after the text stream done.)
    if (!openingTurnFullyDelivered()) {
      console.warn('[PERCEPTION] retro-cancel suppressed — opening turn not yet delivered');
      onDebugEvent?.('perception_cancel_suppressed_opening', `→${toState}`);
      return;
    }
    // Cancel-storm breaker: repeated cancels with no delivered reply is
    // the "tutor is deaf" livelock — let the in-flight turn play out;
    // the student's transcript queues behind the busy brain instead.
    if (!cancelStormRef.current.allowCancel(Date.now())) {
      console.warn('[PERCEPTION] retro-cancel suppressed — cancel storm (letting reply play out)');
      onDebugEvent?.('perception_cancel_storm_suppressed', `→${toState}`);
      return;
    }
    // Round-6d: a verdict just CONFIRMED the previous kill was the tutor's
    // own echo — the resumed audio's echo re-triggering this path is the
    // kill→replay loop (portal-37c0e0bf). Suppress inside the window.
    if (Date.now() < selfEchoCancelImmunityUntilRef.current) {
      console.warn('[PERCEPTION] retro-cancel suppressed — self-echo immunity window');
      onDebugEvent?.('perception_cancel_suppressed_self_echo', `→${toState} (retro)`);
      return;
    }
    const ctx = lastBrainCallContextRef.current;
    const cancelStage: 'processing' | 'speaking' = canRetroStage3 ? 'speaking' : 'processing';
    const stageLabel = canRetroStage3 ? 'STAGE-3' : 'STAGE-2';
    const executeRetroCancel = () => {
      // Deferred-execution re-checks (round-6d): by gate-fire time another
      // cancel path may have opened a checkpoint, or the turn context may
      // have rotated — bail rather than double-cancel.
      if (perceptionInterruptCheckpointRef.current) return;
      console.warn(
        `[PERCEPTION] ${stageLabel} retro-cancel: prod transitioned mid-utterance → '${toState}' (originalTranscript=${JSON.stringify(ctx.transcript).slice(0, 80)})`,
      );
      onDebugEvent?.(
        canRetroStage3 ? 'perception_stage3_retro_cancel' : 'perception_stage2_retro_cancel',
        `→${toState}`,
      );
      perceptionInterruptCheckpointRef.current = {
        originalTranscript: ctx.transcript,
        originalOpts: ctx.opts,
        cancelledAt: Date.now(),
        minSeqForDispatch: perceptionTranscriptSeqRef.current,
        cancelledDuringState: cancelStage,
        // Stage 3 fix #14: capture whether the brain was actually in
        // flight at cancel time. Read inFlightBrainAbortRef BEFORE the
        // abort() call below — once aborted, the ref state is
        // ambiguous. If the brain had already finished and we're just
        // mid-TTS, this is false and RESTORE will not re-fire.
        brainWasInFlight: inFlightBrainAbortRef.current !== null,
        // Stage 3.1 (2026-06-16): snapshot the pending speakText queue
        // BEFORE clearSpeechQueue empties it, so a false-positive
        // cancel verdict can resume the unplayed sentences instead of
        // re-firing the brain.
        unplayedSentencesSnapshot: peekSpeechQueueRef.current?.() ?? [],
        // Resume-from-cut (P5): how far into the in-flight sentence the cut landed,
        // captured BEFORE clearSpeechQueue empties the audio queue.
        cutFraction: getCurrentSentenceFractionRef.current?.() ?? 0,
      };
      // Stage 3 fix #10: arm the speakText gate BEFORE abort so any
      // sentence drained from the in-flight orchestrator's SSE buffer
      // between this point and AbortError propagation drops silently.
      speakTextBlockedUntilRef.current = Date.now() + SPEAK_TEXT_GATE_MS;
      cancelStormRef.current.recordCancel(Date.now());
      speechKilledAtRef.current = Date.now();
      // Render↔speech sync: PAUSE the render buffer before clearSpeechQueue's
      // drain so the cancel doesn't flush buffered renders — the verdict
      // decides drop (abort/re-fire) vs flush-all (resume/deliver).
      renderBufferPausedRef.current = true;
      try { inFlightBrainAbortRef.current?.abort(); } catch {}
      try { void clearSpeechQueueRef.current?.(); } catch {}
      productionWsTranscriptSuppressRef.current = { text: '', until: Date.now() + 20000 };
      // Q9 (2026-06-16): visible signal to the student that we heard
      // them — yellow flash on the mic indicator + briefly disabled
      // buttons / typed input for ~300ms. Independent of the verdict
      // resolution downstream.
      realtime.markInterrupted();
    };
    // Round-6d (portal-37c0e0bf): the stage-3 retro-cancel was the LAST
    // instant kill path — every other stage-3 kill goes through the
    // sustained-energy gate, and with post-app-switch AEC de-convergence
    // this was the path echo used to kill (and re-kill) live TTS. When an
    // energy window exists, defer the retro kill behind the same gate: a
    // genuine student already mid-utterance is sustained and loud (passes in
    // ~BARGEIN_SUSTAIN_MS); echo hugs the pre-onset floor and never fires.
    // speech_stopped and fresh onsets clear bargeInGateTimerRef exactly as
    // for the direct-path gate. No window (non-ink2, no perception energy) →
    // instant kill as before.
    const getRetroWindow = getPerceptionEnergyWindowRef.current;
    if (canRetroStage3 && getRetroWindow) {
      if (bargeInGateTimerRef.current) return; // a kill decision is already being evaluated
      const gateStartedAt = Date.now();
      const energyThreshold = resolveBargeInEnergyThreshold({
        frames: getRetroWindow(),
        fromMs: gateStartedAt - BARGEIN_BASELINE_LOOKBACK_MS,
        toMs: gateStartedAt,
        floor: BARGEIN_ENERGY_FLOOR,
        ceiling: BARGEIN_ENERGY_THRESHOLD,
        margin: BARGEIN_ECHO_MARGIN,
      });
      onDebugEvent?.('perception_bargein_gate_armed', `sustain=${BARGEIN_SUSTAIN_MS}ms threshold=${energyThreshold.toFixed(3)} (retro)`);
      bargeInGateTimerRef.current = setInterval(() => {
        const now = Date.now();
        if (productionStateRef.current !== 'speaking' || now - gateStartedAt > BARGEIN_GATE_MAX_MS) {
          if (bargeInGateTimerRef.current) {
            clearInterval(bargeInGateTimerRef.current);
            bargeInGateTimerRef.current = null;
          }
          return;
        }
        const fire = shouldFireBargeInKill({
          state: 'speaking',
          speechStartMs: gateStartedAt,
          nowMs: now,
          frames: getRetroWindow(),
          energyThreshold,
          sustainMs: BARGEIN_SUSTAIN_MS,
        });
        if (fire) {
          if (bargeInGateTimerRef.current) {
            clearInterval(bargeInGateTimerRef.current);
            bargeInGateTimerRef.current = null;
          }
          onDebugEvent?.('perception_bargein_gate_passed', `latencyMs=${now - gateStartedAt} (retro)`);
          executeRetroCancel();
        }
      }, BARGEIN_GATE_POLL_MS);
      return;
    }
    executeRetroCancel();
  }, [realtime, perceptionStage, onDebugEvent]);

  // ── STT engine gating (Cartesia migration Phase 2, Task 5) ─────────────
  // TUTOR_STT_ENGINE_INK2 selects useCartesiaInkWS in place of
  // usePerceptionWS. Both hooks are always called (React hooks rule) but
  // only one is ever `enabled`, so exactly one owns the mic + WS at a
  // time. The callback closures below are shared verbatim between both
  // hooks — same onTranscript/onSpeechStart/onSpeechStop/etc. — so every
  // downstream consumer (Haiku classifier, barge-in cancel, dedupe) is
  // byte-identical regardless of which STT engine is live. Flag-off
  // (TUTOR_STT_ENGINE_INK2 === false): perceptionWS gets `enabled:
  // perceptionEnabled` exactly as before, perceptionInk2's `enabled` is
  // always false (no-op hook — no mic, no WS) — byte-identical behavior.
  const perceptionOnTranscript = useCallback((t: PerceptionTranscript, bypassHold = false, heldSpeechStartedAt?: number, bypassManualBuffer = false) => {
      // Tagged log for Stage 0+ transcript-agreement review. Pair with the
      // production hook's `[Realtime] User transcript:` lines at similar
      // timestamps to compute agreement rate. warn-level so the
      // browser→server log bridge surfaces it in the dev terminal.
      const prodState = productionStateRef.current;
      // Bug 1 fix: capture per-transcript sequence number. Used by Haiku
      // then-handler closures to detect stale verdicts and by the heuristic
      // direct-dispatch path to gate against the cancel checkpoint.
      const mySeq = ++perceptionTranscriptSeqRef.current;
      console.warn(
        `[PERCEPTION] (prod=${prodState}, t=${t.tMs}ms, lat=${t.latencyMs}ms, seq=${mySeq}): ${JSON.stringify(t.text)}`,
      );
      // Any real ASR final proves the mic is capturing — clear the
      // mic-silent notice so it can't linger over a working session.
      if (micNoticeTimerRef.current) { clearTimeout(micNoticeTimerRef.current); micNoticeTimerRef.current = null; }
      setMicNotice(null);
      // Round-7c: a final transcript is definitive proof the mic works —
      // permanently drop any gated/pending mic-silent notice so it can
      // never surface later in this session.
      micEverHeardRef.current = true;
      pendingMicNoticeRef.current = null;
      if (micNoticeGateTimerRef.current) { clearTimeout(micNoticeGateTimerRef.current); micNoticeGateTimerRef.current = null; }
      // turn_latency: authoritative transcript. A leftover ledger that already
      // has turnEnd belongs to a turn that never dispatched (noise/filtered)
      // or whose deferred audio emit never fired (killed) — emit it as
      // incomplete and start fresh so stale marks can't inflate this turn.
      if (turnLatencyRef.current?.has('turnEnd')) {
        if (turnLatencyAwaitingAudioRef.current) {
          onDebugEvent?.('turn_latency', formatTurnLatency(turnLatencyRef.current.summarize()));
        }
        turnLatencyRef.current = null;
      }
      turnLatencyAwaitingAudioRef.current = false;
      turnLatencyRef.current ??= createTurnLatencyLedger();
      turnLatencyRef.current.mark('turnEnd', Date.now());
      // Checkpoint watchdog (2026-07-15 TTS-wedge incident): a checkpoint is
      // only ever cleared inside applyPerceptionVerdict — if its verdict
      // never arrives (e.g. input_audio_buffer.cleared with no transcript),
      // it gates BOTH direct-dispatch paths below forever and voice wedges
      // while typed input still works. A checkpoint this old can no longer
      // get a legitimate verdict (perception latency tops out well under
      // this); clear it so the CURRENT utterance dispatches normally.
      {
        const cp = perceptionInterruptCheckpointRef.current;
        const ageMs = cp ? Date.now() - cp.cancelledAt : 0;
        if (cp && ageMs > 20000) {
          console.warn(`[PERCEPTION] stale checkpoint cleared by watchdog (age=${ageMs}ms)`);
          onDebugEvent?.('perception_checkpoint_stale_cleared', `age=${ageMs}ms`);
          perceptionInterruptCheckpointRef.current = null;
          // The arm site paused the render buffer pending the verdict —
          // un-pause so buffered renders aren't stuck too.
          renderBufferPausedRef.current = false;
        }
      }
      // R34 T3: incomplete-utterance hold (TUTOR_INCOMPLETE_HOLD). Placed
      // after the bookkeeping above (mic-notice clear, turn-latency marks,
      // checkpoint watchdog) and BEFORE the mute/noise branches below, so
      // that (a) a merged, complete transcript flows through the FULL
      // existing pipeline (mute check, noise check, nag, classifier, cover
      // arm, dispatch) and (b) a still-held fragment is invisible to all of
      // that until it's released. bypassHold=true is the flush re-entry
      // path (below) — it skips straight past this block into the mute
      // check so a released/merged transcript is never held twice.
      if (TUTOR_INCOMPLETE_HOLD && !bypassHold) {
        // A resumed thought merges into the held fragment first, before any
        // other processing sees it.
        if (heldTranscriptRef.current) {
          const held = heldTranscriptRef.current;
          clearTimeout(held.timer);
          heldTranscriptRef.current = null;
          t.text = mergeHeldTranscript(held.text, t.text);
          console.warn(`[PERCEPTION] merged resumed speech into held fragment: ${JSON.stringify(t.text).slice(0, 100)}`);
          onDebugEvent?.('transcript_merged', t.text.slice(0, 60));
        }
        // Hold a fresh dangling fragment — only while the student owns the
        // floor. Never hold during 'speaking'/'processing': that's exactly
        // when barge-in timing matters, and a held fragment would delay the
        // cancel signal reaching applyPerceptionVerdict. Same prodState
        // signal the noise-nag gate below uses. Review round 1 (Finding 1):
        // also skip while muted — a muted transcript belongs to the mute
        // gate below (immediate drop, or submit-on-mute), not a 1.4s hold;
        // this only guards the FRESH-hold branch — the held-then-muted
        // flush path (toggleMicMute, below) is untouched and still fires
        // immediately on mute regardless of this check.
        if (endsMidThought(t.text) && !isMicMutedRef.current && prodState !== 'speaking' && prodState !== 'processing') {
          const heldText = t.text;
          const heldTMs = t.tMs;
          const heldLatencyMs = t.latencyMs;
          const heldItemId = t.itemId;
          // Review round 1 (Finding 2): capture the ABSOLUTE speechStartedAt
          // now, at hold-time — the exact formula Stage 1 below uses. The
          // flush path (up to INCOMPLETE_HOLD_MS later) hands this back in
          // instead of letting Stage 1 re-derive it from flush-time
          // Date.now(), which would shift the 30s TTS-echo lookback window
          // later by up to HOLD_MS and could clip real self-voice matches
          // at the boundary.
          const heldSpeechStartedAt = heldLatencyMs > 0 ? Date.now() - heldLatencyMs : undefined;
          console.warn(`[PERCEPTION] holding dangling-word transcript for ${INCOMPLETE_HOLD_MS}ms: ${JSON.stringify(heldText)}`);
          onDebugEvent?.('transcript_held', heldText.slice(-30));
          heldTranscriptRef.current = {
            text: heldText,
            tMs: heldTMs,
            latencyMs: heldLatencyMs,
            itemId: heldItemId,
            speechStartedAt: heldSpeechStartedAt,
            timer: setTimeout(() => {
              heldTranscriptRef.current = null;
              onDebugEvent?.('transcript_hold_flushed', heldText.slice(-30));
              perceptionOnTranscriptRef.current?.(
                { text: heldText, tMs: heldTMs, latencyMs: heldLatencyMs, itemId: heldItemId },
                true,
                heldSpeechStartedAt,
              );
            }, INCOMPLETE_HOLD_MS),
          };
          return;
        }
      }
      // Mute gate (2026-06-16). Drop any transcript that arrives while the
      // student is muted. The perception mic stops appending audio on mute
      // (usePerceptionWS.setMuted), but a transcript captured BEFORE the
      // mute can still land here up to ~14s later — this catches it so a
      // muted student never triggers a brain turn from ambient sound.
      if (isMicMutedRef.current) {
        // Mute-to-submit: if the student muted right after finishing an
        // utterance, let THIS (the in-flight one) through to the brain, then
        // resume dropping. Phone-like "I'm done — send it and go quiet."
        if (submitPendingUtteranceRef.current) {
          submitPendingUtteranceRef.current = false;
          // Utterance captured — end the grace window now so perception actually
          // mutes (don't wait out the full timeout).
          if (muteGraceTimerRef.current) { clearTimeout(muteGraceTimerRef.current); muteGraceTimerRef.current = null; }
          setMuteGrace(false);
          console.warn(`[PERCEPTION] muted, but submitting the in-flight utterance the student finished before mute: ${JSON.stringify(t.text).slice(0, 80)}`);
          onDebugEvent?.('perception_submit_on_mute', t.text.slice(0, 80));
        } else {
          console.warn(`[PERCEPTION] dropped — student muted: ${JSON.stringify(t.text).slice(0, 80)}`);
          onDebugEvent?.('perception_dropped_muted', t.text.slice(0, 80));
          return;
        }
      }

      // Stage 3 fix #6 (2026-05-28): apply the SAME noise filter the
      // production WS uses (line 1310). Whisper has well-known
      // hallucinations from its YouTube training data — "Thanks for
      // watching!", "由 Amara.org 社群提供的字幕", "Subscribe!" etc. —
      // that production WS already drops as noise. Without this filter
      // in the perception path, Haiku has no way to recognize them as
      // hallucinations (the text reads as plausibly intentional speech)
      // and labels them barge_in/new_turn, then the Stage-3 late-fallback
      // fires them as fresh brain turns. Observed live 2026-05-28:
      // phantom "Thanks for watching!" reached the brain and produced a
      // wasted "Sorry, could you say that again?" turn. Match production
      // WS's behaviour exactly — same filter, same drop.
      const noiseCheck = classifyTranscript(t.text, { allowGreetings: !studentHasSpokenRef.current });
      if (noiseCheck === 'noise') {
        console.warn(`[PERCEPTION] dropped as noise (classifyTranscript): ${JSON.stringify(t.text)}`);
        onDebugEvent?.('perception_noise_dropped', t.text.slice(0, 80));
        // R32 T8 (silence audit §5): consecutive real speech
        // misclassified as noise was an UNBOUNDED silent drop with zero
        // feedback. spokeMs is lastSpeechDurationMsRef — the real
        // speech_started→speech_stopped duration stamped in
        // perceptionOnSpeechStop, NOT t.latencyMs (which spans
        // speech_started→transcription.completed and would inflate a
        // short cough past NOISE_NAG_MIN_SPOKE_MS with 1-3s+ of
        // transcription latency); a true short ambient burst never
        // crosses the floor, so this never fires on real background
        // noise. Gated on prodState
        // (the production-WS state mirror already captured above) so we
        // never nag over the tutor's own speech — same TTS-busy signal
        // the fast-opener path checks (productionStateRef.current ===
        // 'speaking'), plus the speakText gate so a just-blocked slot
        // isn't double-spoken into.
        const spokeMs = lastSpeechDurationMsRef.current;
        const { nag } = recordNoiseDrop(noiseNagStateRef.current, Date.now(), spokeMs);
        if (nag && Date.now() >= speakTextBlockedUntilRef.current && prodState !== 'speaking') {
          const sid = pushTtsScriptForPerception(NOISE_NAG_LINE);
          speakTextRef.current?.(NOISE_NAG_LINE, sid);
          onDebugEvent?.('noise_nag_spoken', `${spokeMs}ms utterance`);
        }
        // Stage 3 quick-fix (2026-06-16): if a cancel checkpoint is
        // armed (i.e., a STAGE-2/3 cancel fired at speech_started and
        // killed the brain mid-flight), this noise-classified transcript
        // means the cancel was a false positive. Dispatch a 'noise'
        // verdict so applyPerceptionVerdict's brainWasInFlight refire
        // path can recover. Without this, the checkpoint dangles, the
        // brain stays dead, the student sits in silence.
        if (perceptionStage >= 2 && perceptionInterruptCheckpointRef.current) {
          const cp = perceptionInterruptCheckpointRef.current;
          if (mySeq <= cp.minSeqForDispatch) {
            // R32 (H5): stale relative to THIS checkpoint, but the
            // checkpoint is still open — a bare return here left it
            // dangling if nothing else ever resolved it (unbounded
            // silence). 'noise' is text-agnostic downstream
            // (applyPerceptionVerdict reads checkpoint state, not this
            // transcript), so dispatching it anyway is safe — rescue
            // instead of dropping.
            console.warn(`[PERCEPTION] noise-dispatch stale-seq (mySeq=${mySeq} <= minSeq=${cp.minSeqForDispatch}) — rescuing open checkpoint anyway`);
            onDebugEvent?.('perception_bare_return_rescued', 'noise_stale_seq');
          }
          applyPerceptionVerdictRef.current?.('noise', t.text);
        }
        return;
      }

      // "Being heard" indicator: a transcript ARRIVED for the student's
      // utterance, so it wasn't lost — resolve the "got that — one sec…"
      // window. R32 T8 (silence audit §9): this now runs AFTER the noise
      // check above has decided the transcript will actually dispatch
      // (moved from before the mute/noise drop branches), so a transcript
      // that arrives and is immediately discarded as noise no longer
      // cancels the 18s "didn't catch that" listening-hint — the hint is
      // exactly the fallback that should survive a noise-classified drop.
      // Still fires ONLY on a true transcription hang (no transcript at
      // all), never on the normal 9–15s perception latency.
      resolveAwaitingDispatch();

      // R34 T4: Manual mic mode. Placed AFTER Task 3's hold/merge block
      // (above) and after the mute + noise gates (above) — a buffered turn
      // must be a real, unmuted, non-noise transcript, exactly like every
      // other transcript that reaches this point. bypassManualBuffer=true is
      // flushManualBuffer's own re-entry (the joined, already-buffered text
      // must not re-buffer itself); a natural Task-3 hold-flush or a
      // mute-triggered held-fragment flush (toggleMicMute's submit-on-mute)
      // both omit it (default false) and so DO land in the buffer here
      // while manual mode is on — the natural, correct consequence of
      // running after that block, not a special case.
      //
      // Review round 1 (Finding 1): this branch ALSO needs the same
      // prodState !== 'speaking'/'processing' gate Task 3's hold block uses
      // one block above — the SAME signal, not a new one. Reasoning: the
      // upstream speech_started cancel (which arms a perception interrupt
      // checkpoint) is a SEPARATE event from THIS transcript's verdict
      // (restore/merge/fresh), which is decided further down this same
      // function (Stage 1 heuristic / Haiku / applyPerceptionVerdictRef).
      // Without this gate, a barge-in transcript arriving while the tutor
      // is 'speaking'/'processing' would get pushed into the manual buffer
      // and the function would return HERE — the open checkpoint never
      // gets a normal verdict, only recovering via the 7s
      // decideStage2TimeoutRestore fallback, which re-fires the
      // PRE-interruption turn while the student's actual interrupting words
      // sit parked in the buffer, unseen. Invariant: manual mode owns ONLY
      // the plain-listening path; barge-in verdicts must never be buffered
      // — they always flow through the existing perception verdict
      // machinery untouched, exactly as if manual mode were off.
      if (
        TUTOR_MANUAL_MIC && manualMicRef.current && !bypassManualBuffer &&
        prodState !== 'speaking' && prodState !== 'processing'
      ) {
        manualBufferRef.current.push(t.text);
        setManualBufferCount(manualBufferRef.current.length);
        onDebugEvent?.('manual_buffered', `${manualBufferRef.current.length} part(s)`);
        // Mid-utterance send: the student tapped ✓ while still speaking, so
        // the send button armed this one-shot instead of flushing an empty/
        // stale buffer. Now that a transcript actually arrived, push it
        // (above) then flush immediately — mirrors submitPendingUtteranceRef's
        // mute-to-submit pattern (toggleMicMute) for the send button.
        if (manualSendPendingRef.current) {
          manualSendPendingRef.current = false;
          flushManualBuffer();
        }
        return;
      }

      // Stage 2 dev-only verdict pin. When set, skip heuristic + Haiku
      // and dispatch the pinned verdict directly so the developer can
      // exercise every restore/merge/fresh/drop branch deterministically
      // without crafting a real-audio scenario.
      const pinned = pinnedClassifierVerdictRef.current;
      if (pinned && perceptionStage >= 2) {
        pinnedClassifierVerdictRef.current = null;
        const cp = perceptionInterruptCheckpointRef.current;
        if (!cp) {
          // Bug 3 fix: explicit no-op log when no Stage-2 checkpoint is
          // open. Production WS handles the turn via its own path.
          console.warn(`[CLASSIFIER] PINNED verdict=${pinned} but skipped (no Stage-2 checkpoint — speech_started fired during 'listening' or '${prodState}')`);
          onDebugEvent?.('perception_pinned_verdict_skipped', `${pinned}:no-checkpoint`);
          return;
        }
        if (mySeq <= cp.minSeqForDispatch) {
          // Bug 1 fix: this transcript predates the cancel; pinned verdict
          // applied to a stale transcript would still drive the wrong
          // dispatch text-wise.
          // R32 (H5): but the checkpoint is still open here — dropping
          // bare left it dangling (dev-only pin path, but the same
          // unbounded-silence hazard). Dispatch the pinned verdict anyway
          // so the checkpoint resolves.
          console.warn(`[CLASSIFIER] PINNED verdict=${pinned} stale-seq (mySeq=${mySeq} <= minSeq=${cp.minSeqForDispatch}) — rescuing open checkpoint anyway`);
          onDebugEvent?.('perception_bare_return_rescued', 'pinned_stale_seq');
        }
        console.warn(`[CLASSIFIER] PINNED verdict=${pinned} (seq=${mySeq}) — dispatching`);
        onDebugEvent?.('perception_pinned_verdict', pinned);
        applyPerceptionVerdictRef.current?.(pinned, t.text);
        return;
      }

      // ── Stage 1: heuristic classifier + Haiku escalation (logged, not enforced)
      // Per design Q2 + Q6, every perception transcript runs through the
      // heuristic; ambiguous mid-utterances escalate to Haiku. Verdicts are
      // logged ONLY at this stage — no cancellation, no refire. The signal
      // we're measuring is verdict distribution + Haiku FP rate over 5
      // sessions before Stage 2 ships any state change.
      if (perceptionStage >= 1) {
        const nowMs = Date.now();
        // Review round 1 (Finding 2): a flushed hold (heldSpeechStartedAt
        // set) carries the ABSOLUTE speechStartedAt captured back when the
        // fragment was originally held, not re-derived from THIS flush-time
        // nowMs — re-deriving here would shift it later by up to HOLD_MS
        // and narrow the 30s TTS-echo lookback below at the boundary. A
        // merged transcript (fresh arrival, heldSpeechStartedAt undefined)
        // is unaffected — its own t.latencyMs is fresh, so the normal
        // derivation already anchors on when the resumed speech itself
        // started, which is what the self-voice-defense window wants.
        const speechStartedAt = heldSpeechStartedAt ?? (t.latencyMs > 0 ? nowMs - t.latencyMs : undefined);
        // Stage-3 fix #5 (2026-05-28): anchor the buffer read on
        // SPEECH_STARTED, not nowMs. The relevant question for self-voice
        // is "what was the tutor saying when the student STARTED
        // speaking?" — perception transcript latency (6-16s) was
        // pushing the relevant tutor speech outside the old 8s
        // nowMs-anchored window, leaving the defence with empty data
        // and sv=0.00 even when the student transcript was clearly
        // a verbatim copy of recent tutor speech.
        // Zero-latency onset (production "no VAD") becomes undefined, which
        // triggers the classifier's fail-safe path (anchor disabled).
        const studentT = speechStartedAt ?? nowMs;
        const recentTtsScripts: RecentTtsScript[] = ttsScriptBufferRef.current.filter(
          (s) => s.spokenStartedAt >= studentT - 30_000,
        );
        const heur = classifyHeuristic({
          transcript: t.text,
          productionState: prodState as ProductionStateForClassifier,
          recentTtsScripts,
          now: nowMs,
          speechStartedAt,
          // Round-6: state-window evidence for the onset-during-playback
          // echo gate — survives the script-stamp splintering a kill+resume
          // causes (see speakingWindowsRef).
          onsetDuringTutorSpeech:
            speechStartedAt !== undefined && wasTutorSpeakingAt(speechStartedAt),
        });
        const ttsBufLen = recentTtsScripts.length;
        const svScore = heur.selfVoiceScore !== undefined
          ? heur.selfVoiceScore.toFixed(2)
          : 'n/a';
        console.warn(
          `[CLASSIFIER] heuristic=${heur.verdict} (sv=${svScore}, ttsBuf=${ttsBufLen}, prod=${prodState}) — ${heur.reason}`,
        );
        onDebugEvent?.('perception_heuristic', `${heur.verdict}:${heur.reason}`);

        // ── Stage 2: if a perception cancel fired (checkpoint set),
        // route every NON-escalate heuristic verdict to restore/refire
        // immediately. Escalate falls through to the Haiku call below
        // and the Haiku then-handler does the same routing.
        // Bug 1 fix: gate on mySeq > minSeqForDispatch so a stale
        // transcript (one that arrived BEFORE the cancel set this
        // checkpoint) can't drive dispatch.
        if (perceptionStage >= 2 && perceptionInterruptCheckpointRef.current && heur.verdict !== 'escalate') {
          const cp = perceptionInterruptCheckpointRef.current;
          if (mySeq <= cp.minSeqForDispatch) {
            // R32 (H5): checkpoint still open — rescue instead of
            // dropping bare (unbounded silence otherwise).
            console.warn(`[CLASSIFIER] heuristic=${heur.verdict} stale-seq (mySeq=${mySeq} <= minSeq=${cp.minSeqForDispatch}) — rescuing open checkpoint anyway`);
            onDebugEvent?.('perception_bare_return_rescued', 'heuristic_stale_seq');
          }
          applyPerceptionVerdictRef.current?.(heur.verdict, t.text);
          return;
        }

        // Stage 3 fix #4 part B — late-arrival fallback. If the
        // perception transcript carries a substantive verdict
        // (barge_in / continuation / new_turn) AND no checkpoint
        // exists AND prod state is 'speaking' or 'processing' at
        // transcript time, the student was very likely speaking during
        // tutor activity but speech_started fired during 'listening'
        // so the cancel gate (and even the retro-cancel effect, if the
        // state transition happened after speech_stopped) missed.
        // Fire as a FRESH new turn so the student's content reaches
        // the brain. Without this, long answers spanning the
        // listening→speaking boundary are silently dropped (observed
        // live 2026-05-28: "17 and 48" lost; only fragment captured).
        if (
          perceptionStage >= 3 &&
          !perceptionInterruptCheckpointRef.current &&
          (prodState === 'speaking' || prodState === 'processing') &&
          (heur.verdict === 'barge_in' || heur.verdict === 'new_turn' || heur.verdict === 'continuation')
        ) {
          console.warn(`[PERCEPTION] STAGE-3 late-fallback (no checkpoint, prod=${prodState}): firing as FRESH new turn, transcript=${JSON.stringify(t.text).slice(0, 80)}`);
          onDebugEvent?.('perception_stage3_late_fallback', `${heur.verdict} at prod=${prodState}`);
          // Stage 3 fix #12 (2026-05-29) + fix #13 (2026-06-15): arm
          // production-WS suppress so any production-WS transcript for
          // this utterance window that arrives AFTER late-fallback
          // gets dropped (both chat-add and brain dispatch).
          // Fix #13: bumped 5s→20s after live evidence (2026-06-15
          // chemistry session) of production-WS Whisper transcripts
          // arriving ~10s after late-fallback fired — the 5s window
          // expired 154ms before the production-WS dispatch landed,
          // producing a duplicate brain call for "Can I speak in
          // Tamil?" (near-duplicate of the perception-handled "Can
          // it speak in Tamil?"). 20s matches the cancel-time window;
          // production-WS transcripts within 20s of a perception-
          // handled utterance are almost always either Whisper
          // duplicates or Whisper context-bias hallucinations.
          // Production-WS transcripts that already fired BEFORE
          // late-fallback are caught by the queue-drain dedup above.
          productionWsTranscriptSuppressRef.current = { text: '', until: Date.now() + 20000 };
          if (!perceptionDispatchDeduperRef.current.shouldDispatch(t.text, Date.now())) {
            console.warn(`[PERCEPTION] late-fallback duplicate dropped: ${JSON.stringify(t.text).slice(0, 80)}`);
            onDebugEvent?.('perception_dispatch_duplicate_dropped', t.text.slice(0, 80));
            return;
          }
          void handleStudentTranscriptForBrain(t.text, { bypassPerceptionDedupe: true });
          return;
        }

        // Stage 4 (2026-06-15): perception WS as sole input authority.
        // When prod is 'listening'/'connected' the heuristic returns
        // 'new_turn' (perception-classifier.ts:274). At Stage ≤3 this
        // verdict is intentionally a no-op — production WS owns the
        // listening-state input pathway and its transcript dispatches
        // the brain. At Stage 4 production WS has no transcription, so
        // perception must dispatch directly; otherwise listening-state
        // student turns never reach the brain. The 20s suppress arming
        // is a defense-in-depth no-op at Stage 4 (production WS isn't
        // transcribing) but matches the late-fallback pattern.
        // Stage 4 cleanup (2026-06-15): perception is the sole input
        // authority whenever it's enabled; the perceptionStage >= 4
        // gate is now perceptionStage >= 0 (perception WS enabled
        // at all). Production WS no longer transcribes regardless of
        // stage value.
        if (
          perceptionStage >= 0 &&
          heur.verdict === 'new_turn' &&
          !perceptionInterruptCheckpointRef.current
        ) {
          console.warn(`[PERCEPTION] direct-dispatch (new_turn, prod=${prodState}): firing as student turn, transcript=${JSON.stringify(t.text).slice(0, 80)}`);
          onDebugEvent?.('perception_direct_dispatch', `${heur.verdict} at prod=${prodState}`);
          productionWsTranscriptSuppressRef.current = { text: '', until: Date.now() + 20000 };
          if (!perceptionDispatchDeduperRef.current.shouldDispatch(t.text, Date.now())) {
            console.warn(`[PERCEPTION] direct-dispatch duplicate dropped: ${JSON.stringify(t.text).slice(0, 80)}`);
            onDebugEvent?.('perception_dispatch_duplicate_dropped', t.text.slice(0, 80));
            return;
          }
          void handleStudentTranscriptForBrain(t.text, { bypassPerceptionDedupe: true });
          return;
        }

        if (heur.verdict === 'escalate') {
          // Circuit breaker: skip Haiku if the circuit is open.
          const circuitOpenAt = perceptionClassifyCircuitOpenAtRef.current;
          if (circuitOpenAt > 0 && nowMs - circuitOpenAt < 60_000) {
            console.warn('[CLASSIFIER] haiku skipped (circuit open)');
            // R32 (H4): a checkpoint left open here (STAGE-2/3 cancel armed,
            // heuristic escalated, then the circuit breaker skipped Haiku)
            // used to dangle forever — no classifier verdict was ever going
            // to arrive to resolve it. No verdict is in scope at this site,
            // so fall back to 'noise' — applyPerceptionVerdict's downstream
            // resume/restore logic reads checkpoint state, not this text.
            if (perceptionStage >= 2 && perceptionInterruptCheckpointRef.current) {
              const cp = perceptionInterruptCheckpointRef.current;
              // R32 review round 1 (Minor, deferred to ledger): deliberately
              // asymmetric vs the stale-seq rescues below (2-5), which rescue
              // even when stale. Here, unlike those, there's no substantive
              // verdict already computed for THIS transcript to fall back on
              // — only the constant 'noise' — so a stale mySeq additionally
              // means we can't even confirm this escalate call belongs to the
              // checkpoint that's currently open; skip rather than guess.
              if (mySeq > cp.minSeqForDispatch) {
                onDebugEvent?.('perception_bare_return_rescued', 'haiku_circuit_breaker');
                applyPerceptionVerdictRef.current?.('noise', t.text);
              }
            }
            return;
          }
          if (circuitOpenAt > 0) {
            perceptionClassifyCircuitOpenAtRef.current = 0;
            perceptionClassifyFailCountRef.current = 0;
          }
          const lastStudentEntry = [...transcriptRef.current]
            .reverse()
            .find((e) => e.role === 'student');
          const recentTutorScript = recentTtsScripts
            .map((s) => s.text)
            .join(' ');
          const ctrl = new AbortController();
          const tHaiku0 = Date.now();
          // 3000ms: observed Haiku p95 in dev was 1200–1600ms (first
          // Stage-1 live session, 2026-05-25), above the design's
          // aspirational 500ms target. Bump until prompt-cache warm-up
          // settles in production; revisit when we have real p95 data.
          const timeoutId = setTimeout(() => ctrl.abort(), 3000);
          fetch('/api/tutor/perception-classify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              transcript: t.text,
              productionState: prodState,
              recentTutorScript,
              lastStudentTurn: lastStudentEntry?.text,
            }),
            signal: ctrl.signal,
          })
            .then((r) => r.json())
            .then((data: { verdict?: PerceptionVerdict; reason?: string }) => {
              clearTimeout(timeoutId);
              const haikuMs = Date.now() - tHaiku0;
              const verdict = data?.verdict ?? 'noise';
              const reason = data?.reason ?? 'no reason';
              console.warn(
                `[CLASSIFIER] haiku=${verdict} (${haikuMs}ms) — ${reason}`,
              );
              onDebugEvent?.('perception_haiku', `${verdict}:${reason}`);
              perceptionClassifyFailCountRef.current = 0;
              // Stage 2: route to restore/refire if a cancel checkpoint is set.
              // Bug 1 fix: gate on mySeq > minSeqForDispatch. Without this,
              // a Haiku verdict for a transcript that arrived BEFORE the
              // cancel can leak into a checkpoint opened by a LATER
              // speech_started — observed live 2026-05-26 ("MERGE — len=106"
              // with self-referential addendum).
              if (perceptionStage >= 2 && perceptionInterruptCheckpointRef.current) {
                const cp = perceptionInterruptCheckpointRef.current;
                if (mySeq <= cp.minSeqForDispatch) {
                  // R32 (H5): checkpoint still open — rescue instead of
                  // dropping bare (unbounded silence otherwise).
                  console.warn(`[CLASSIFIER] haiku=${verdict} stale-seq (mySeq=${mySeq} <= minSeq=${cp.minSeqForDispatch}, verdict from pre-cancel transcript) — rescuing open checkpoint anyway`);
                  onDebugEvent?.('perception_bare_return_rescued', 'haiku_success_stale_seq');
                }
                applyPerceptionVerdictRef.current?.(verdict, t.text);
              } else if (
                perceptionStage >= 3 &&
                !perceptionInterruptCheckpointRef.current &&
                (prodState === 'speaking' || prodState === 'processing') &&
                (verdict === 'barge_in' || verdict === 'new_turn' || verdict === 'continuation')
              ) {
                // Stage 3 fix #4 part B — same late-fallback as the
                // heuristic path. Escalate verdicts that come back as
                // substantive interruptions during prod 'speaking'/'processing'
                // without a checkpoint also fire as FRESH new turn so
                // the student's content reaches the brain.
                console.warn(`[PERCEPTION] STAGE-3 late-fallback (haiku, no checkpoint, prod=${prodState}): firing as FRESH new turn, transcript=${JSON.stringify(t.text).slice(0, 80)}`);
                onDebugEvent?.('perception_stage3_late_fallback', `haiku:${verdict} at prod=${prodState}`);
                // Stage 3 fix #12 + fix #13: same suppress arming as
                // the heuristic late-fallback above. 20s window per
                // fix #13 — see comment there for rationale.
                productionWsTranscriptSuppressRef.current = { text: '', until: Date.now() + 20000 };
                void handleStudentTranscriptForBrain(t.text, { bypassPerceptionDedupe: true });
              }
            })
            .catch((err: unknown) => {
              clearTimeout(timeoutId);
              perceptionClassifyFailCountRef.current += 1;
              const fails = perceptionClassifyFailCountRef.current;
              console.warn(
                `[CLASSIFIER] haiku failed (${fails}/5):`,
                err instanceof Error ? err.message : String(err),
              );
              if (fails >= 5) {
                perceptionClassifyCircuitOpenAtRef.current = Date.now();
                console.warn('[CLASSIFIER] haiku circuit OPEN for 60s');
              }
              // Stage 2: fail-open — treat Haiku timeout/error as 'noise'
              // (restore the original brain call). Don't leave the
              // student hanging because the classifier endpoint was slow.
              // Bug 1 fix: same stale-verdict gate as the success path.
              if (perceptionStage >= 2 && perceptionInterruptCheckpointRef.current) {
                const cp = perceptionInterruptCheckpointRef.current;
                // R32 (H5): checkpoint still open — rescue instead of
                // dropping bare even when stale (unbounded silence
                // otherwise); 'noise' is what this fail-open path already
                // dispatches for the non-stale case, so it's safe here too.
                if (mySeq <= cp.minSeqForDispatch) {
                  onDebugEvent?.('perception_bare_return_rescued', 'haiku_fail_stale_seq');
                }
                applyPerceptionVerdictRef.current?.('noise', t.text);
              }
            });
        }
      }
  }, [onDebugEvent, perceptionStage, handleStudentTranscriptForBrain, flushManualBuffer, wasTutorSpeakingAt]);
  // R34 T3: always points at the latest render's perceptionOnTranscript, so
  // the hold-flush timer and the mic-mute flush (toggleMicMute, below) never
  // re-enter a stale closure — same forward-ref-via-ref pattern as
  // applyPerceptionVerdictRef.current assignment elsewhere in this file.
  perceptionOnTranscriptRef.current = perceptionOnTranscript;
  const perceptionOnSpeechStart = useCallback((e: PerceptionSpeechEvent) => {
      const prodState = productionStateRef.current;
      console.warn(`[PERCEPTION] speech_started (prod=${prodState}, t=${e.tMs}ms)`);
      // Round-7c: the mic picking up speech at all — even before any
      // transcript resolves — is proof it isn't silent. Permanently drop
      // any gated/pending mic-silent notice; a stuck-open mic ("dead"
      // between two real turns) shouldn't get a stale banner once the
      // student has actually been heard.
      micEverHeardRef.current = true;
      pendingMicNoticeRef.current = null;
      if (micNoticeGateTimerRef.current) { clearTimeout(micNoticeGateTimerRef.current); micNoticeGateTimerRef.current = null; }
      // "Being heard" indicator: student is speaking now. Clear any pending
      // "Got that / didn't catch" state from a previous utterance.
      speechWindowStartRef.current = Date.now();
      setPerceptionHearing(true);
      resolveAwaitingDispatch();
      onListeningHintRef.current?.(null); // a fresh utterance supersedes any prior "didn't catch" nudge
      // Stage 3 fix #4: track mid-utterance for the state-race retro-cancel.
      perceptionMidUtteranceRef.current = true;
      // Stage 3 fix #11: watchdog reset for the mid-utterance flag.
      // Clears any prior watchdog (overlapping speech_started events
      // shouldn't happen, but be idempotent), then schedules a 30s
      // timeout that clears the flag if speech_stopped never fires.
      if (perceptionMidUtteranceWatchdogRef.current) {
        clearTimeout(perceptionMidUtteranceWatchdogRef.current);
      }
      perceptionMidUtteranceWatchdogRef.current = setTimeout(() => {
        if (perceptionMidUtteranceRef.current) {
          console.warn('[PERCEPTION] STAGE-3 fix #11 watchdog: clearing stuck perceptionMidUtteranceRef after 30s');
          onDebugEvent?.('perception_mid_utterance_watchdog', '30s timeout');
          perceptionMidUtteranceRef.current = false;
        }
        perceptionMidUtteranceWatchdogRef.current = null;
      }, PERCEPTION_MID_UTTERANCE_WATCHDOG_MS);
      // ── Stage 2 + Stage 3: cancel-on-speech_started ─────────────────
      // Stage 2 fires the cancel during 'processing' (brain in flight,
      // no TTS yet — Q5's "thinking" window). Stage 3 extends to
      // 'speaking' (TTS playing, full barge-in). Both produce the same
      // checkpoint shape; the dispatcher branches on cancelledDuringState
      // because RESTORE-after-speaking can't truly resume the partial
      // TTS (Stage 3 MVP accepts the cut on noise/filler — true
      // resume-from-cut is Stage 3.1 polish per design Q5 B2).
      //
      // Q5 explicitly accepts ~5-10% FP rate during 'speaking' as the
      // price of fast barge-in. Browser AEC + the TTS-script self-voice
      // defence cover most of the speaker→mic loop in practice — the
      // Stage-2 verify session (2026-05-26) showed real student
      // barge-ins were correctly classified as sv=0.00 despite TTS
      // playing concurrently (log lines 1020 + 2087).
      //
      // Double-fire guard: if a cancel is already pending (checkpoint
      // set, verdict not yet dispatched), don't fire another. The
      // existing checkpoint will dispatch and dedupe handles followups.
      const canStage2 = perceptionStage >= 2 && prodState === 'processing';
      const canStage3 = perceptionStage >= 3 && prodState === 'speaking';
      // ── The stage-2/3 kill body, extracted so it can fire EITHER instantly
      // (non-'speaking' states — today's behavior) OR deferred behind the
      // sustained-energy gate (Task V1, 'speaking' only). Reads live refs, so
      // deferral is safe. All guards (checkpoint / ctx / cancel-storm breaker)
      // live inside and are evaluated at ACTUAL fire time — cancel-storm
      // semantics unchanged, and a gate that never passes records NO cancel.
      const runPerceptionKill = (cancelStage: 'processing' | 'speaking') => {
        if (perceptionInterruptCheckpointRef.current) return;
        // Round-6d: a verdict just CONFIRMED the previous kill was self-echo
        // — don't let the resumed audio's echo re-kill (portal-37c0e0bf's
        // kill→replay loop). Checked at fire time so a gate armed before
        // the verdict landed is covered too.
        if (Date.now() < selfEchoCancelImmunityUntilRef.current) {
          console.warn(`[PERCEPTION] cancel suppressed — self-echo immunity window (stage=${cancelStage})`);
          onDebugEvent?.('perception_cancel_suppressed_self_echo', `prod=${prodState} stage=${cancelStage}`);
          return;
        }
        const ctx = lastBrainCallContextRef.current;
        // For Stage 3 'speaking' cancels, the brain may already have
        // finished emitting (just TTS playing out the queue) — ctx is
        // still set from the most recent brain call so RESTORE/MERGE
        // have an anchor. brain abort below is a no-op if not in flight.
        if (!ctx) {
          console.warn(`[PERCEPTION] cancel skipped: no lastBrainCallContext (stage=${cancelStage})`);
          return;
        }
        // Cancel-storm breaker: see retro-cancel site. Without this, a
        // student re-speaking into silence aborts every nascent reply
        // and no turn ever completes (session-1783615559112).
        if (!cancelStormRef.current.allowCancel(Date.now())) {
          console.warn(`[PERCEPTION] cancel suppressed — cancel storm (letting reply play out, stage=${cancelStage})`);
          onDebugEvent?.('perception_cancel_storm_suppressed', `prev=${prodState} stage=${cancelStage}`);
          return;
        }
        const stageLabel = cancelStage === 'speaking' ? 'STAGE-3' : 'STAGE-2';
        // Phase 2: the student is interrupting — never ack over them.
        if (ackTimerRef.current) { clearTimeout(ackTimerRef.current); ackTimerRef.current = null; }
        if (escalationTimerRef.current) { clearInterval(escalationTimerRef.current); escalationTimerRef.current = null; }
        console.warn(
          `[PERCEPTION] ${stageLabel} cancel: aborting in '${cancelStage}' (originalTranscript=${JSON.stringify(ctx.transcript).slice(0, 80)})`,
        );
        onDebugEvent?.(
          cancelStage === 'speaking' ? 'perception_stage3_cancel' : 'perception_stage2_cancel',
          `prev=${prodState} stage=${cancelStage}`,
        );
        perceptionInterruptCheckpointRef.current = {
          originalTranscript: ctx.transcript,
          originalOpts: ctx.opts,
          cutFraction: getCurrentSentenceFractionRef.current?.() ?? 0,
          cancelledAt: Date.now(),
          // Only verdicts from perception transcripts whose seq is
          // STRICTLY GREATER than this snapshot may dispatch against
          // this checkpoint. Earlier (in-flight) Haiku calls from a
          // pre-cancel perception transcript are stale and get dropped.
          minSeqForDispatch: perceptionTranscriptSeqRef.current,
          cancelledDuringState: cancelStage,
          // Stage 3 fix #14: see retro-cancel useEffect for rationale.
          // Captured BEFORE the abort below.
          brainWasInFlight: inFlightBrainAbortRef.current !== null,
          // Stage 3.1: snapshot the pending speakText queue BEFORE
          // clearSpeechQueue empties it. See retro-cancel useEffect.
          unplayedSentencesSnapshot: peekSpeechQueueRef.current?.() ?? [],
        };
        // Round-28: no-verdict recovery for 'processing' cancels. If the
        // interrupting sound never resolves to a transcript, no verdict
        // ever consumes this checkpoint — re-fire the aborted turn after
        // the window instead of stalling until the student re-prompts.
        //
        // R32 (H3): also arm for 'speaking' cancels. Same unbounded-silence
        // class — a 'speaking' cancel whose interrupting sound never
        // transcribes leaves unplayed TTS content stranded on the
        // checkpoint with nothing to resume it. decideStage2TimeoutRestore
        // resolves both states now; 'speaking' resolves to 'resume-tts'
        // rather than 'restore'.
        {
          const armedCheckpoint = perceptionInterruptCheckpointRef.current;
          if (stage2TimeoutRestoreTimerRef.current) clearTimeout(stage2TimeoutRestoreTimerRef.current);
          const checkTimeoutRestore = () => {
            stage2TimeoutRestoreTimerRef.current = null;
            const cp = perceptionInterruptCheckpointRef.current;
            const verdict = decideStage2TimeoutRestore({
              checkpointActive: cp !== null && cp === armedCheckpoint,
              cancelledDuringState: armedCheckpoint!.cancelledDuringState,
              brainWasInFlight: armedCheckpoint!.brainWasInFlight,
              brainTurnAborted: brainTurnAbortedRef.current,
              midUtterance: perceptionMidUtteranceRef.current,
              newBrainCallInFlight: inFlightBrainAbortRef.current !== null,
              ageMs: Date.now() - armedCheckpoint!.cancelledAt,
              hasUnplayedSnapshot: (armedCheckpoint!.unplayedSentencesSnapshot?.length ?? 0) > 0,
            });
            if (verdict === 'defer') {
              stage2TimeoutRestoreTimerRef.current = setTimeout(checkTimeoutRestore, 2_000);
              return;
            }
            if (verdict === 'resume-tts') {
              // R32 (H3): re-queue the unplayed tail through the same
              // resume-from-cut path the 'speaking' verdict branch uses
              // (applyPerceptionVerdict, noise/filler/drop_self_voice ×
              // 'speaking'), including the clauseTailFromFraction
              // snapshot[0] handling so we don't re-speak already-heard
              // content.
              const n = armedCheckpoint!.unplayedSentencesSnapshot.length;
              // R32 review round 1, Finding 2: shares applyClauseTailSnapshot
              // with the 'speaking' verdict branch above (including its
              // [RESUME-CUT] console.warn + 'resume_from_clause' debug
              // event on truncation) instead of a second inline copy.
              const resumeQueue = applyClauseTailSnapshot(armedCheckpoint!.unplayedSentencesSnapshot, armedCheckpoint!.cutFraction);
              console.warn(
                `[PERCEPTION] STAGE-3 timeout-resume (no verdict after ${Date.now() - armedCheckpoint!.cancelledAt}ms): re-queuing ${n} unplayed sentence(s)`,
              );
              onDebugEvent?.('stage3_timeout_resume', `no verdict after ${Date.now() - armedCheckpoint!.cancelledAt}ms · ${n} sentences`);
              perceptionInterruptCheckpointRef.current = null;
              resumeSpeakTextRef.current?.(resumeQueue);
              flushAllRenderBuffer();
              return;
            }
            if (verdict !== 'restore') return;
            console.warn(
              `[PERCEPTION] STAGE-2 timeout-RESTORE (no verdict after ${Date.now() - armedCheckpoint!.cancelledAt}ms): re-firing original transcript=${JSON.stringify(armedCheckpoint!.originalTranscript).slice(0, 80)}`,
            );
            onDebugEvent?.('perception_stage2_timeout_restore', `no verdict after ${Date.now() - armedCheckpoint!.cancelledAt}ms`);
            perceptionInterruptCheckpointRef.current = null;
            // Same re-fire discipline as the verdict-driven STAGE-2
            // RESTORE: re-arm the speakText gate, drop buffered renders
            // (refire redraws from scratch), bypass the perception dedupe
            // armed at cancel time.
            speakTextBlockedUntilRef.current = Date.now() + SPEAK_TEXT_GATE_MS;
            dropRenderBuffer();
            void handleStudentTranscriptForBrain(armedCheckpoint!.originalTranscript, {
              ...(armedCheckpoint!.originalOpts || {}),
              bypassPerceptionDedupe: true,
            });
          };
          stage2TimeoutRestoreTimerRef.current = setTimeout(checkTimeoutRestore, STAGE2_NO_VERDICT_RESTORE_MS);
        }
        // Stage 3 fix #10: arm the speakText gate BEFORE abort so any
        // sentence drained from the in-flight orchestrator's SSE buffer
        // between this point and AbortError propagation drops silently.
        speakTextBlockedUntilRef.current = Date.now() + SPEAK_TEXT_GATE_MS;
        cancelStormRef.current.recordCancel(Date.now());
        speechKilledAtRef.current = Date.now();
        // Render↔speech sync: PAUSE the buffer before the drain (see
        // retro-cancel) — verdict decides drop vs flush-all.
        renderBufferPausedRef.current = true;
        // Abort brain stream if still in flight. For 'speaking' cancels
        // the brain may have already finished (ref is null after
        // callBrainOnce's finally clears it) — abort is a no-op.
        try { inFlightBrainAbortRef.current?.abort(); } catch {}
        // Drain TTS. For 'processing' usually empty; for 'speaking'
        // this is the actual barge-in kill.
        try { void clearSpeechQueueRef.current?.(); } catch {}
        // Production-WS dedupe. During 'processing' production WS still
        // mics and would independently transcribe the same utterance →
        // duplicate brain turn. During 'speaking' production WS mic is
        // hardware-disabled (useOpenAIRealtime ~line 691) so the dedupe
        // is mostly inert; harmless to arm anyway.
        productionWsTranscriptSuppressRef.current = { text: '', until: Date.now() + 20000 };
        // Q9 (2026-06-16): visible "I heard you" signal. See retro-cancel.
        realtime.markInterrupted();
      };
      // A fresh onset supersedes any pending sustain gate.
      if (bargeInGateTimerRef.current) {
        clearInterval(bargeInGateTimerRef.current);
        bargeInGateTimerRef.current = null;
      }
      if (bargeInDeferredKillRef.current) {
        clearTimeout(bargeInDeferredKillRef.current);
        bargeInDeferredKillRef.current = null;
      }
      // Opening-turn guard (rewritten 2026-07-22). History: blanket
      // suppression until the FULL opener delivered (2026-07-04, self-echo
      // phantoms aborting the kickoff) made real first-turn barge-ins
      // impossible — a student spoke 12 straight seconds over the opener,
      // unheard (APUSH + mock-review live sessions). Echo phantoms are
      // short (~264ms measured); genuine speech sustains. So during
      // 'speaking' with opener audio underway, DEFER the kill behind the
      // longer OPENER_BARGEIN_SUSTAIN_MS window (speech_stopped disarms it,
      // a fresh onset supersedes it, and every runPerceptionKill guard —
      // checkpoint / ctx / cancel-storm — still applies at fire time).
      // 'processing' cancels stay suppressed: the instant stage-2 kill has
      // no gate and could still abort the kickoff before any audio played.
      if ((canStage2 || canStage3) && !openingTurnFullyDelivered()) {
        if (canStage3 && firstTurnSawSpeakingRef.current) {
          // Round-6 live-test fix (portal-cca76850/b3838f70): the blind
          // TIME-only opener timer is worthless against pre-AEC-convergence
          // echo — measured PCM shows mobile echo cancellation only becomes
          // effective after ~15-30s of PLAYED audio, so during the opener
          // the mic carries the tutor's voice CONTINUOUSLY and every timer
          // window "sustains" (prod events: kills passing at exactly
          // 350-351ms, six times across two sessions, cutting the opener
          // off on its own echo every time). Ink2 has exposed an energy
          // window since round-5: when it (or the OpenAI perception window)
          // is available, gate the opener kill on ENERGY like the
          // mid-lesson path — the adaptive threshold is derived from the
          // pre-onset echo floor, which is exactly what the mic is carrying
          // during unconverged opener playback, so echo stays below it
          // while genuine student speech (~10x hotter, measured) passes.
          // The TIME-only timer remains the no-window fallback.
          const getOpenerWindow = getPerceptionEnergyWindowRef.current;
          if (getOpenerWindow) {
            const gateStartedAt = Date.now();
            const speechStartMs = gateStartedAt;
            const energyThreshold = resolveBargeInEnergyThreshold({
              frames: getOpenerWindow(),
              fromMs: speechStartMs - BARGEIN_BASELINE_LOOKBACK_MS,
              toMs: speechStartMs,
              floor: BARGEIN_ENERGY_FLOOR,
              ceiling: BARGEIN_ENERGY_THRESHOLD,
              margin: BARGEIN_ECHO_MARGIN,
            });
            onDebugEvent?.('perception_bargein_gate_armed',
              `sustain=${OPENER_BARGEIN_SUSTAIN_MS}ms threshold=${energyThreshold.toFixed(3)} (opening turn)`);
            bargeInGateTimerRef.current = setInterval(() => {
              const now = Date.now();
              if (productionStateRef.current !== 'speaking' || now - gateStartedAt > BARGEIN_GATE_MAX_MS) {
                if (bargeInGateTimerRef.current) {
                  clearInterval(bargeInGateTimerRef.current);
                  bargeInGateTimerRef.current = null;
                }
                return;
              }
              const fire = shouldFireBargeInKill({
                state: 'speaking',
                speechStartMs,
                nowMs: now,
                frames: getOpenerWindow(),
                energyThreshold,
                sustainMs: OPENER_BARGEIN_SUSTAIN_MS,
              });
              if (fire) {
                if (bargeInGateTimerRef.current) {
                  clearInterval(bargeInGateTimerRef.current);
                  bargeInGateTimerRef.current = null;
                }
                onDebugEvent?.('perception_bargein_gate_passed', `latencyMs=${now - gateStartedAt} (opening turn)`);
                runPerceptionKill('speaking');
              }
            }, BARGEIN_GATE_POLL_MS);
            return;
          }
          const armedAt = Date.now();
          onDebugEvent?.('perception_bargein_deferred_armed', `sustain=${OPENER_BARGEIN_SUSTAIN_MS}ms (opening turn)`);
          bargeInDeferredKillRef.current = setTimeout(() => {
            bargeInDeferredKillRef.current = null;
            const fire = shouldFireDeferredBargeInKill({
              state: productionStateRef.current,
              speechStopped: false,
              elapsedMs: Date.now() - armedAt,
              sustainMs: OPENER_BARGEIN_SUSTAIN_MS,
            });
            if (fire) {
              onDebugEvent?.('perception_bargein_deferred_passed', `latencyMs=${Date.now() - armedAt} (opening turn)`);
              runPerceptionKill('speaking');
            } else {
              onDebugEvent?.('perception_bargein_deferred_abandoned', `prod=${productionStateRef.current} (opening turn)`);
            }
          }, OPENER_BARGEIN_SUSTAIN_MS);
        } else {
          console.warn('[PERCEPTION] cancel suppressed — opening turn not yet delivered');
          onDebugEvent?.('perception_cancel_suppressed_opening', `prev=${prodState}`);
        }
        return;
      }
      // Stage 2 ('processing'): INSTANT kill — unchanged, no energy gate. The
      // brain is only thinking (no TTS to echo), so there is nothing for the
      // tutor's own voice to trigger; today's fast cancel stands.
      if (canStage2) {
        runPerceptionKill('processing');
        return;
      }
      // Stage 3 ('speaking'): SUSTAINED-ENERGY GATE (Task V1). The tutor's TTS
      // echoes into the mic and fires this speech_started; killing here on the
      // raw onset cuts the tutor off on its own voice (session portal-81f2b582).
      // Echo bursts are short/playback-correlated; a genuine barge-in is
      // sustained. So poll the energy window and only kill once mic energy has
      // stayed above threshold for ≥ BARGEIN_SUSTAIN_MS. If sustain is never met
      // the speech_started is treated as if it never fired for KILL purposes —
      // later transcript classification (V2/V3) still proceeds independently.
      if (canStage3) {
        const getWindow = getPerceptionEnergyWindowRef.current;
        if (!getWindow) {
          // Ink2 owns the mic → NO energy window. Task X3: instead of the
          // documented V1 fallback (instant kill — which cut the tutor off on
          // its own echo, session portal-da5b97a6), apply the sustain gate as a
          // TIME-based deferred-kill timer. speech_stopped (disarm below) or a
          // fresh onset (supersede above) cancels it; if it survives the full
          // BARGEIN_SUSTAIN_MS while the tutor is still 'speaking', the same
          // stage-3 kill fires. A short self-echo blip ends (speech_stopped ~264ms
          // in the live capture) well before that and is disarmed.
          //
          // Known asymmetry vs. V1's energy gate (X3 fix-wave, findings 3+4;
          // documented, accepted as-is): this timer measures TIME between VAD
          // events, not energy level. A sustained LOW-energy sound that Ink2's
          // own VAD holds "in speech" for the full window (e.g. quiet
          // background chatter, a fan, a soft continuous hum) reaches
          // BARGEIN_SUSTAIN_MS and kills — where V1's energy gate would have
          // required that same duration ABOVE `BARGEIN_ENERGY_THRESHOLD` and
          // would not fire on a merely-sustained-but-quiet signal. No energy
          // window exists on the Ink2 path to gate on, so this is the accepted
          // trade-off: still bounded to BARGEIN_SUSTAIN_MS latency, still far
          // better than the prior instant kill, just less selective than V1.
          const armedAt = Date.now();
          onDebugEvent?.('perception_bargein_deferred_armed', `sustain=${BARGEIN_SUSTAIN_MS}ms (ink2, no energy window)`);
          bargeInDeferredKillRef.current = setTimeout(() => {
            bargeInDeferredKillRef.current = null;
            // Pure predicate (shouldFireDeferredBargeInKill): fire only if still
            // 'speaking' and the utterance never stopped. speech_stopped clears
            // this timer, so speechStopped is false whenever this callback runs.
            const fire = shouldFireDeferredBargeInKill({
              state: productionStateRef.current,
              speechStopped: false,
              elapsedMs: Date.now() - armedAt,
              sustainMs: BARGEIN_SUSTAIN_MS,
            });
            if (fire) {
              onDebugEvent?.('perception_bargein_deferred_passed', `latencyMs=${Date.now() - armedAt}`);
              runPerceptionKill('speaking');
            } else {
              onDebugEvent?.('perception_bargein_deferred_abandoned', `prod=${productionStateRef.current}`);
            }
          }, BARGEIN_SUSTAIN_MS);
          return;
        }
        const gateStartedAt = Date.now();
        const speechStartMs = gateStartedAt; // onset in the Date.now() domain
        // Round-5 echo fix: derive the "voice present" threshold from THIS
        // device's echo floor instead of the fixed desktop-calibrated 0.15.
        // The baseline is sampled from the frames just BEFORE the onset —
        // the tutor is speaking, so the mic is carrying echo + ambient and
        // nothing else, which is exactly the level a real barge-in has to
        // clear. Resolved ONCE at arm time (not per poll) so the threshold
        // can't drift upward as the student's own speech enters the window
        // and raises the median — that would be self-defeating.
        const energyThreshold = resolveBargeInEnergyThreshold({
          frames: getWindow(),
          fromMs: speechStartMs - BARGEIN_BASELINE_LOOKBACK_MS,
          toMs: speechStartMs,
          floor: BARGEIN_ENERGY_FLOOR,
          ceiling: BARGEIN_ENERGY_THRESHOLD,
          margin: BARGEIN_ECHO_MARGIN,
        });
        onDebugEvent?.('perception_bargein_gate_armed',
          `sustain=${BARGEIN_SUSTAIN_MS}ms threshold=${energyThreshold.toFixed(3)} (fixed=${BARGEIN_ENERGY_THRESHOLD})`);
        bargeInGateTimerRef.current = setInterval(() => {
          const now = Date.now();
          // Abandon the gate if the tutor has stopped talking (nothing left to
          // interrupt) or the safety cap elapsed (never leak a live interval).
          if (productionStateRef.current !== 'speaking' || now - gateStartedAt > BARGEIN_GATE_MAX_MS) {
            if (bargeInGateTimerRef.current) {
              clearInterval(bargeInGateTimerRef.current);
              bargeInGateTimerRef.current = null;
            }
            return;
          }
          const fire = shouldFireBargeInKill({
            state: 'speaking',
            speechStartMs,
            nowMs: now,
            frames: getWindow(),
            energyThreshold,
            sustainMs: BARGEIN_SUSTAIN_MS,
          });
          if (fire) {
            if (bargeInGateTimerRef.current) {
              clearInterval(bargeInGateTimerRef.current);
              bargeInGateTimerRef.current = null;
            }
            onDebugEvent?.('perception_bargein_gate_passed', `latencyMs=${now - gateStartedAt}`);
            runPerceptionKill('speaking');
          }
        }, BARGEIN_GATE_POLL_MS);
        return;
      }
  }, [onDebugEvent, perceptionStage, realtime]);
  const perceptionOnSpeechStop = useCallback((e: PerceptionSpeechEvent) => {
      console.warn(`[PERCEPTION] speech_stopped (prod=${productionStateRef.current}, t=${e.tMs}ms)`);
      // turn_latency: provisional endpoint (Ink-2 fires this on turn.eager_end).
      // First-wins keeps the ORIGINAL endpoint across turn.resume re-fires.
      turnLatencyRef.current ??= createTurnLatencyLedger();
      turnLatencyRef.current.mark('eagerEnd', Date.now());
      // Task V1: the utterance ended — if a sustained-energy barge-in gate is
      // still pending, the onset never sustained (echo blip / brief noise), so
      // cancel it. The gate's own energy check would reach the same verdict; this
      // just stops the poll promptly.
      if (bargeInGateTimerRef.current) {
        clearInterval(bargeInGateTimerRef.current);
        bargeInGateTimerRef.current = null;
      }
      // Task X3: disarm the Ink2 time-based deferred kill — the utterance ended
      // before BARGEIN_SUSTAIN_MS, so it was an echo blip / brief noise, not a
      // sustained barge-in. (Matches the energy gate's speech_stopped disarm.)
      if (bargeInDeferredKillRef.current) {
        clearTimeout(bargeInDeferredKillRef.current);
        bargeInDeferredKillRef.current = null;
      }
      // Stage 3 fix #4: clear mid-utterance flag.
      perceptionMidUtteranceRef.current = false;
      // "Being heard" indicator: student stopped. Enter the "Got that — one
      // sec…" processing state covering the transcribe+dispatch latency. If the
      // utterance was long enough to be real speech (not a cough/blip) and no
      // brain dispatch lands within the window, surface a gentle "didn't catch
      // that" nudge (item D). A real dispatch / new speech / tutor reply clears
      // this via resolveAwaitingDispatch.
      setPerceptionHearing(false);
      const spokeMs = Date.now() - (speechWindowStartRef.current || Date.now());
      // Final-review Finding 3: stamp the real speech_started→speech_stopped
      // duration for the noise-nag floor (below, keyed off the transcript
      // that resolves from THIS utterance) — latencyMs on that transcript
      // event would additionally include transcription latency.
      lastSpeechDurationMsRef.current = spokeMs;
      if (awaitingDispatchTimerRef.current) clearTimeout(awaitingDispatchTimerRef.current);
      // Only for SUSTAINED speech (≥2s — not a cough/blip). Show "got that…"
      // and arm a LONG fallback: perception latency runs 9–15s, and any arriving
      // transcript resolves this immediately (see onTranscript), so the only way
      // this timer fires is a true transcription hang (no transcript at all).
      if (spokeMs >= 2000) {
        setPerceptionAwaitingDispatch(true);
        awaitingDispatchTimerRef.current = setTimeout(() => {
          awaitingDispatchTimerRef.current = null;
          setPerceptionAwaitingDispatch(false);
          if (isMicMutedRef.current) return; // student muted in the meantime — no nudge
          onListeningHintRef.current?.('didnt-catch');
          onDebugEvent?.('listening_no_dispatch', `Spoke ${(spokeMs / 1000).toFixed(1)}s, no transcript within window`);
        }, 18000);
      }
      // Stage 3 fix #11: clear the watchdog timer — flag was cleared
      // normally via speech_stopped, no need for the safety reset.
      if (perceptionMidUtteranceWatchdogRef.current) {
        clearTimeout(perceptionMidUtteranceWatchdogRef.current);
        perceptionMidUtteranceWatchdogRef.current = null;
      }
  }, [onDebugEvent]);
  // Live mic amplitude → parent "being heard" meter (no React state here;
  // the parent stores it in a ref so it doesn't re-render the page 12×/sec).
  const perceptionOnTranscriptionFailed = useCallback((errorType: string | undefined) => {
    console.warn(`[PERCEPTION] transcription_failed errorType=${errorType ?? 'unknown'}`);
  }, []);
  const perceptionOnStateChange = useCallback((next: PerceptionState) => {
    onDebugEvent?.('perception_state', next);
  }, [onDebugEvent]);
  const perceptionOnError = useCallback((err: Error) => {
    onDebugEvent?.('perception_error', err.message);
  }, [onDebugEvent]);

  const perceptionWS = usePerceptionWS({
    enabled: perceptionEnabled && !TUTOR_STT_ENGINE_INK2,
    vadThreshold,
    vadSilenceDurationMs,
    vadPrefixPaddingMs,
    onTranscript: perceptionOnTranscript,
    onSpeechStart: perceptionOnSpeechStart,
    onSpeechStop: perceptionOnSpeechStop,
    onMicLevel,
    onTranscriptionFailed: perceptionOnTranscriptionFailed,
    onStateChange: perceptionOnStateChange,
    onError: perceptionOnError,
  });
  // Cartesia Ink 2 STT hook (Task 5). `enabled` is the mirror-image gate of
  // perceptionWS above, so exactly one hook ever owns the mic + WS.
  const perceptionInk2 = useCartesiaInkWS({
    enabled: perceptionEnabled && TUTOR_STT_ENGINE_INK2,
    onSpeechStart: perceptionOnSpeechStart,
    onSpeechStop: perceptionOnSpeechStop,
    onMicLevel,
    onTranscript: perceptionOnTranscript,
    onTranscriptionFailed: perceptionOnTranscriptionFailed,
    onStateChange: perceptionOnStateChange,
    onError: perceptionOnError,
    // Round 28: persist Ink-internal drop paths (no-buffer finals, no-delta
    // finals, transcription watchdog) into the session debugEvents trail —
    // they were console-only and invisible in prod (2026-07-24 incident).
    onDiagnostic: (type, message) => onDebugEvent?.(type, message),
  });
  const perception = TUTOR_STT_ENGINE_INK2 ? perceptionInk2 : perceptionWS;
  // Task V1: feed the sustained-energy barge-in gate from whichever perception
  // hook owns the mic. Round-5 (2026-07-27): Ink2 now exposes the SAME window
  // shape, so the gate is live on the production STT path too. Before this it
  // was hard-nulled for Ink2 — which made BARGEIN_ENERGY_THRESHOLD dead code in
  // prod and left every barge-in TIME-only, so the tutor's own echo (which
  // sustains for the whole sentence) killed it mid-speech.
  getPerceptionEnergyWindowRef.current = TUTOR_STT_ENGINE_INK2
    ? perceptionInk2.getEnergyWindow
    : perceptionWS.getEnergyWindow;
  // Reference for lint cleanliness; explicit read so a future stage that
  // surfaces a status pill / closes barge-in gaps has something to consume.
  void perception.state;

  // ── Stage 2 dev-only test triggers ────────────────────────────────
  // window.__tutorForceFalseBargein() — fully synthetic cancel+restore
  // exercise. Sets a checkpoint, aborts the in-flight brain call,
  // drains TTS, then dispatches a 'noise' verdict (the RESTORE path).
  // Use this to verify the orchestrator-side cancel+restore plumbing
  // without needing to time a real student utterance into the narrow
  // 'processing' window.
  //
  // window.__tutorForceClassifierVerdict('continuation' | 'barge_in' |
  // 'new_turn' | 'noise' | 'filler' | 'drop_self_voice') — pin the next
  // perception transcript's verdict. The next real perception event
  // skips heuristic + Haiku and routes through applyPerceptionVerdict
  // with the pinned label. Lets you exercise every branch (MERGE,
  // FRESH, DROP, etc.) with a single real utterance.
  //
  // NODE_ENV-guarded so neither helper ships to production.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (process.env.NODE_ENV === 'production') return;
    const VERDICT_SET: ReadonlySet<PerceptionVerdict> = new Set([
      'drop_self_voice', 'noise', 'filler', 'new_turn',
      'continuation', 'barge_in', 'escalate',
    ]);
    const w = window as unknown as {
      __tutorForceFalseBargein?: () => void;
      __tutorForceClassifierVerdict?: (verdict: string) => void;
      __tutorForceKill?: (reason?: string) => void;
      __tutorForceKillAfterRenders?: (n?: number, reason?: string) => void;
      __tutorRenderBuffer?: () => void;
      __tutorFlushRenderBuffer?: () => void;
    };
    w.__tutorForceFalseBargein = () => {
      if (perceptionStage < 2) {
        console.warn('[dev] __tutorForceFalseBargein: needs perceptionStage >= 2, current=', perceptionStage);
        return;
      }
      const prodState = productionStateRef.current;
      if (prodState !== 'processing' && prodState !== 'speaking') {
        console.warn(`[dev] __tutorForceFalseBargein: prodState=${prodState}, expected 'processing' or 'speaking'. Run while brain is in flight or TTS is playing.`);
      }
      const ctx = lastBrainCallContextRef.current;
      if (!ctx) {
        console.warn('[dev] __tutorForceFalseBargein: no in-flight brain context — call after a turn starts');
        return;
      }
      const cancelStage: 'processing' | 'speaking' = prodState === 'speaking' ? 'speaking' : 'processing';
      console.warn(`[dev] __tutorForceFalseBargein: synthetic ${cancelStage} cancel + ${cancelStage === 'speaking' ? 'silent-accept' : 'restore'}`);
      perceptionInterruptCheckpointRef.current = {
        originalTranscript: ctx.transcript,
        originalOpts: ctx.opts,
          cutFraction: getCurrentSentenceFractionRef.current?.() ?? 0,
        cancelledAt: Date.now(),
        // Parity with real cancel: any verdict from a transcript whose
        // seq is > this snapshot may dispatch. The synthetic 'noise'
        // dispatch below skips classifier entirely so this guard is
        // moot for the trigger itself, but keeps shape parity.
        minSeqForDispatch: perceptionTranscriptSeqRef.current,
        cancelledDuringState: cancelStage,
        // Stage 3 fix #14: parity with real cancel — capture
        // brainWasInFlight before abort. Dev trigger usually fires
        // mid-turn so this is true; included for shape parity.
        brainWasInFlight: inFlightBrainAbortRef.current !== null,
        // Stage 3.1: parity with real cancel — snapshot the queue
        // before clearSpeechQueue empties it.
        unplayedSentencesSnapshot: peekSpeechQueueRef.current?.() ?? [],
      };
      // Render↔speech sync: PAUSE the buffer before the drain (dev trigger
      // parity with the real cancel sites).
      renderBufferPausedRef.current = true;
      try { inFlightBrainAbortRef.current?.abort(); } catch {}
      try { void clearSpeechQueueRef.current?.(); } catch {}
      // Arm dedupe so a concurrent production-WS transcript doesn't
      // sneak through as a second brain turn (matches real-cancel flow).
      productionWsTranscriptSuppressRef.current = { text: '', until: Date.now() + 20000 };
      // Q9: visible signal parity with the real cancel sites.
      realtime.markInterrupted();
      // Dispatch RESTORE on a short delay so the abort/finally chain
      // completes first (brainBusyRef releases, queue clears).
      setTimeout(() => {
        applyPerceptionVerdictRef.current?.('noise', '');
      }, 150);
    };
    w.__tutorForceClassifierVerdict = (verdict: string) => {
      if (!VERDICT_SET.has(verdict as PerceptionVerdict) || verdict === 'escalate') {
        console.warn(`[dev] __tutorForceClassifierVerdict: invalid '${verdict}'. Use one of:`,
          [...VERDICT_SET].filter((v) => v !== 'escalate'));
        return;
      }
      pinnedClassifierVerdictRef.current = verdict as PerceptionVerdict;
      console.warn(`[dev] __tutorForceClassifierVerdict: pinned next verdict = ${verdict}`);
    };
    // __tutorForceKill(reason?) — arm a synthetic content kill on the
    // in-flight (or next) brain turn. The orchestrator fires performKill()
    // after the first audible sentence: snapshots the unplayed tail,
    // suppresses the kill bridge, retries. With no reason (default) the
    // retry is told to re-deliver verbatim → a RESTATEMENT, so Stage 3.1
    // replays the snapshot (resume path). Pass a correction-style reason
    // (e.g. "your value was wrong, recompute") to drive the DIVERGE path
    // where the retry speaks live instead.
    w.__tutorForceKill = (reason?: string) => {
      if (!brainBusyRef.current) {
        console.warn('[dev] __tutorForceKill: no brain turn in flight yet — arming anyway; it fires on the next turn.');
      }
      forceKillPendingRef.current = (reason && reason.trim())
        ? reason.trim()
        : 'Internal delivery hiccup on the prior attempt — re-deliver your previous spoken response verbatim. The content was correct; do not change any values or wording.';
      console.warn('[dev] __tutorForceKill: armed — next audible sentence triggers a synthetic content kill + retry.');
    };
    // Dev-only: force a synthetic kill AFTER the attempt paints `n` renders
    // (default 1), instead of after the first sentence. Deterministically
    // exercises keep-validated-on-kill (a kill once validated renders are on
    // the board → the deferred-sweep keep/sweep decision runs).
    w.__tutorForceKillAfterRenders = (n?: number, reason?: string) => {
      forceKillAfterRendersRef.current = Math.max(1, Number(n) || 1);
      forceKillPendingRef.current = (reason && reason.trim())
        ? reason.trim()
        : 'Internal delivery hiccup — re-deliver your previous response. The content was correct; do not change any values or wording.';
      console.warn(`[dev] __tutorForceKillAfterRenders: armed — kill fires after ${forceKillAfterRendersRef.current} render(s) this attempt.`);
    };
    // Render↔speech sync inspection/force-flush (Q7d). __tutorRenderBuffer()
    // logs the live buffer (depth, anchors, counters); __tutorFlushRenderBuffer()
    // force-flushes everything immediately (bypasses anchors), to verify a
    // stuck render manually.
    w.__tutorRenderBuffer = () => {
      const buf = renderBufferRef.current;
      console.warn(
        `[dev] render-sync buffer: depth=${buf.length} dispatched=${ttsDispatchedCountRef.current} playbackStarted=${ttsPlaybackStartedCountRef.current} paused=${renderBufferPausedRef.current} active=${renderSyncActiveRef.current} stallArmed=${renderStallTimerRef.current !== null}`,
        buf.map((e) => ({ anchorM: e.anchorM, actions: e.processed.map((c) => (c as { action?: string }).action) })),
      );
    };
    w.__tutorFlushRenderBuffer = () => {
      console.warn('[dev] __tutorFlushRenderBuffer: force-flushing entire render buffer');
      flushAllRenderBuffer();
    };
    return () => {
      delete w.__tutorForceFalseBargein;
      delete w.__tutorForceClassifierVerdict;
      delete w.__tutorForceKill;
      delete w.__tutorForceKillAfterRenders;
      delete w.__tutorRenderBuffer;
      delete w.__tutorFlushRenderBuffer;
    };
  }, [perceptionStage, flushAllRenderBuffer]);

  // realtime-2: assemble + inject the lesson plan context into the RT-2
  // session. Called once on connect (effect below) and again after every
  // advance_lesson so RT-2 always teaches the live segment.
  injectLessonPlanV2Ref.current = () => {
    if (!useRealtimeV2) return;
    const plan = lessonPlanRef.current;
    if (!plan) return;
    const segId = currentSegmentIdRef.current || plan.segments[0]?.id || '';
    const text = formatLessonPlanForRealtime(plan, segId, [...completedSegmentIdsRef.current]);
    if (!text) return;
    injectContextRef.current?.(text);
    onDebugEvent?.('rt2_lesson_plan_injected', `segment="${segId}"`);
  };

  // Always-current pointer to resumeContinue (defined further down, after the
  // state/refs it closes over). The handle below + dock both fire through this
  // ref so neither has to reference the callback before its declaration.
  const resumeContinueRef = useRef<() => void>(() => {});

  // Expose sendTextMessage + session summary to parent via handleRef.
  useEffect(() => {
    // One-time "session start" side effects that MUST run inside a real
    // user-gesture call stack (unlockAudio can only resume a suspended
    // AudioContext from a gesture). Idempotent — both guards no-op once the
    // session has started. Shared by sendTextMessage (real typed/board/agenda
    // input) and pickAgendaItem via gestureSessionStartRef.
    const runGestureSessionStart = () => {
      if (voiceSessionStartedAtMsRef.current === null) {
        voiceSessionStartedAtMsRef.current = Date.now();
        onSessionStartedRef.current?.();
      }
      if (!hasStartedRef.current && !resumeState) {
        hasStartedRef.current = true;
        setHasStarted(true);
        setIsWarmingUp(true);
        // R32 T9: arm the watchdog. No stashed kickoff here — the caller
        // (sendTextMessage / pickAgendaItem) dispatches the actual first
        // message through its own, varying mechanism right after this
        // returns, so there's nothing safe to auto-replay. The 40s fail
        // path still fires to clear the spinner and re-enable the mic.
        warmupStateRef.current = createWarmupState(Date.now());
        warmupKickoffRef.current = null;
        setWarmupFailed(false);
        realtime.unlockAudio();
      }
    };
    gestureSessionStartRef.current = runGestureSessionStart;
    if (handleRef) {
      handleRef.current = {
        startSession: () => {
          // Straight through to the dock mic's own handler — no duplicated
          // start logic. Synchronous by design (iOS audio unlock needs the
          // caller's gesture stack).
          micClickRef.current?.();
        },
        sendTextMessage: (text: string) => {
          // Timer + demo-cap parity for typed-first students (2026-07-10
          // audit): the session clock was keyed to the first MIC tap only,
          // so a "type here if you can't speak" student watched 0:00 all
          // session — and a typed-only trial never armed the demo hard-stop
          // cap (voiceSessionStartedAtMsRef stayed null). A real typed
          // message starts both. Bracketed strings are synthetic (kickoff /
          // reactions / harness) and must not start the clock — EXCEPT the
          // student-board-action wrappers ("[The student wrote/drew/
          // uploaded …]"): those carry a REAL student gesture (starter
          // chip, typed whiteboard answer, image upload) that TutorSession
          // brackets for the brain contract. Round-16 Issue 1 (2026-07-17,
          // session portal-f0c496ca): the Practice chip fired pre-start,
          // was classed synthetic, and the session never "started" — timer
          // pinned at 0:00, no unlockAudio (suspended AudioContext → TTS
          // sources never fire onended → dock wedged on SPEAKING for 9
          // minutes), and hasStarted stayed false so the eventual mic tap
          // fired a redundant [start lesson] re-opener.
          // Agenda round 4 (Round-16 reincarnation): the mock-review agenda
          // markers ("[Via their review-agenda menu, …]") are the SAME class
          // of real gesture — a student tapping a question row to begin — so
          // they too must start the clock + unlockAudio, else an agenda-only
          // session (never touching the mic) shows 0:00 forever with a
          // wedged AudioContext. They join the board-action exception here;
          // pickAgendaItem additionally fires the start sequence synchronously
          // inside the tap's own stack (its refetch path awaits before this
          // marker lands, which would leave the gesture context).
          const isStudentBoardAction = /^\s*\[(?:The student (?:wrote|drew|uploaded)|Via their review-agenda menu)/i.test(text);
          const isSynthetic = /^\s*\[/.test(text) && !isStudentBoardAction;
          // Round-16 Issue 1: a real input landing BEFORE the mic-tap start
          // runs the same one-time session-start sequence the tap would —
          // most critically unlockAudio(), which must execute inside this
          // click's gesture call stack for the AudioContext to resume. The
          // brain turn this message triggers replaces the [start lesson]
          // kickoff (hasStarted=true makes the later mic tap skip it).
          // Resume sessions keep their dedicated resumeContinue gesture.
          // Shared with pickAgendaItem via gestureSessionStartRef so an
          // agenda pick fires it inside its own tap stack too (idempotent).
          if (!isSynthetic) runGestureSessionStart();
          // Task X10: a non-bracketed external send is a real typed/text
          // message; bracketed strings are synthetic (kickoff / reactions /
          // harness) and get the voice-style fallback path. Student-board
          // actions came from typing/clicking → typed path.
          realtime.sendTextMessage(text, { typed: !isSynthetic });
        },
        speakText: (text: string) => realtime.speakText(text),
        stopSpeaking: () => {
          realtime.clearSpeechQueue();
          realtime.interrupt();
        },
        getSessionSummary: () => ({
          topicsCovered: [...topicsCoveredRef.current],
          weakTopics: Array.from(weaknessesRef.current.entries())
            .map(([topic, count]) => ({ topic, count }))
            .sort((a, b) => b.count - a.count),
        }),
        stepPaceBias: (delta: -1 | 1) => stepPaceBias(delta, 'button'),
        setSpeakingRate,
        setPracticeOverride,
        setDifficultyBias,
        setManualMic,
        resumeContinue: () => resumeContinueRef.current(),
        endSession: () => { void endSessionNowRef.current(); },
        getSpokenCaption: () => {
          if (!claudeBrainMode) return null;
          return captionSyncRef.current.poll(realtime.getSpokenProgress());
        },
        pushStudentMark: (ev: StudentMarkEvent) => {
          if (!TUTOR_STUDENT_MARKS || !claudeBrainMode) return;
          const resolved = resolveStudentMark(ev);
          if (resolved.kind === 'writing' && ev.type === 'gesture' && resolved.strokesBBox) {
            // Async OCR (DrawPad precedent): the mark joins the buffer only
            // when the text resolves; failure degrades to the unreadable
            // wording. An OCR that misses this turn rides the next one.
            const imageData = rasterizeGestureStrokes(ev.strokes, resolved.strokesBBox);
            const enqueue = (mark: ResolvedMark) => {
              const buf = pendingStudentMarksRef.current;
              buf.push(mark);
              if (buf.length > MAX_PENDING_MARKS) {
                buf.shift();
                onDebugEvent?.('student_mark_dropped', 'buffer cap');
              }
              onDebugEvent?.('student_mark', `writing p${mark.pageIndex + 1} "${(mark.text || '').slice(0, 40)}"`);
              armStudentMarkIdleSend();
            };
            if (!imageData) { enqueue(resolved); return; }
            studentMarkOcrInFlightRef.current++;
            void (async () => {
              const ocrAbort = new AbortController();
              const ocrTimeout = setTimeout(() => ocrAbort.abort(), 8000);
              try {
                const resp = await fetch('/api/tutor/extract-homework', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ imageData, mimeType: 'image/png', subject, topic, level, mode: 'transcribe' }),
                  signal: ocrAbort.signal,
                });
                const data = await resp.json();
                enqueue({ ...resolved, text: sanitizeInkOcrText(data.extractedProblem) });
              } catch {
                enqueue(resolved);
              } finally {
                clearTimeout(ocrTimeout);
                studentMarkOcrInFlightRef.current--;
              }
            })();
            return;
          }
          const buf = pendingStudentMarksRef.current;
          buf.push(resolved);
          if (buf.length > MAX_PENDING_MARKS) {
            buf.shift();
            onDebugEvent?.('student_mark_dropped', 'buffer cap');
          }
          onDebugEvent?.(
            'student_mark',
            `${resolved.feature ?? (resolved.itemId ?? 'page')} p${resolved.pageIndex + 1}`,
          );
          armStudentMarkIdleSend();
        },
      };
    }
    return () => {
      if (handleRef) handleRef.current = null;
    };
  }, [handleRef, realtime, stepPaceBias, setSpeakingRate, setPracticeOverride, setDifficultyBias, setManualMic, claudeBrainMode, armStudentMarkIdleSend, onDebugEvent, subject, topic, level, resumeState]);

  // realtime-2: inject the lesson plan into the RT-2 session once the
  // session is connected and the plan has loaded. claude-brain mode feeds
  // the plan through the brain orchestrator, so this guard no-ops there.
  useEffect(() => {
    if (!useRealtimeV2) return;
    if (!activePlan) return;
    if (!realtime.isConnected) return;
    if (lessonPlanV2InjectedRef.current) return;
    lessonPlanV2InjectedRef.current = true;
    injectLessonPlanV2Ref.current();
  }, [useRealtimeV2, activePlan, realtime.isConnected]);

  // Build system prompt / instructions on mount
  useEffect(() => {
    const buildInstructions = async () => {
      try {
        // Load knowledge module
        let knowledgeModule = null;
        try {
          knowledgeModule = await loadModuleByParams(subject, topic, level);
        } catch (e) {
          console.log('[VoiceTutorRealtime] Module not loaded, using base prompts');
        }

        // Task B2 (flag-gated): opener/self-report context fields (B4/B5)
        // for buildSystemPrompt, computed from resolveOpeningBehavior. When
        // TUTOR_PEDAGOGY_OPENER is off, `openerFields` stays `{}` and the
        // spread below adds nothing — the call is IDENTICAL (same keys,
        // same values) to the pre-B2 call. See task-B2-report.md for the
        // per-signal availability notes (entryMode is not reliably
        // available at this call site and defaults 'button' per the B2
        // brief's conservative-default rule; isTrial/targetKind/
        // checkpointStale now arrive as props from the embed token + dev
        // hook and default false / derived / false).
        const openerFields: Partial<SystemPromptContext> = {};
        // Task H2 race fix (flag-gated): for studentId sessions, the opening
        // seed must WAIT for the profile fetch to settle — otherwise
        // studentHasPriorSessionsRef reads its initial `false` and the
        // warm-resume (subscribed-returning) journey is unreachable. Until
        // it settles we skip the whole flag-on block (this run builds a
        // prompt identical to the flag-off build) and the profileFetchSettled
        // dep re-runs this effect once settled. The one-shot latch
        // (openingTurnArmedRef) is untouched by the skip path, so it arms
        // exactly once: immediately for anonymous sessions, and on the
        // post-settle run for studentId sessions. Later re-runs (mid-session
        // preference changes) still hit the armed latch and cannot re-arm.
        const openerSignalsReady = !studentId || profileFetchSettled;
        if (TUTOR_PEDAGOGY_OPENER && openerSignalsReady) {
          const sig: OpeningSignals = {
            // Explicit targetKind prop when the caller supplies one (embed
            // `target_kind` / dev hook — 'diagnostic' is only reachable that
            // way); else derived exactly as before: lessonPlanId presence ⇒
            // 'lessonNode', else 'freestyle'.
            targetKind: targetKind ?? (lessonPlanId ? 'lessonNode' : 'freestyle'),
            // Task E1: the embed's is_trial signal (EmbedConfig →
            // TutorSession → isTrial prop). The main /tutor page has no
            // trial concept and leaves the prop at its false default.
            isTrial,
            // studentId absent ⇔ demo flow without auth (see the studentId
            // prop doc comment above) — the existing, already-documented
            // proxy for "no StudentContext".
            hasPortalContext: !!studentId,
            hasPriorSessions: studentHasPriorSessionsRef.current,
            // resumeState is only ever populated with a FRESH checkpoint
            // (portal/resume.ts filters staleness before it reaches this
            // prop); a checkpoint that EXISTED but was too old arrives as
            // the checkpointStale prop instead (resolveResumeOutcome / dev
            // hook), which deriveResumeSignal maps to the resume-stale
            // journey. A seeded resumeState always wins over a stray stale
            // flag.
            resume: deriveResumeSignal(!!resumeState, checkpointStale),
          };
          const beh = resolveOpeningBehavior(assembleOpeningInput(sig));
          // Round-7 demo persistence: a RESUMED trial's journey is resume-live/-stale
          // (those outrank demo-trial), but it is still a demo — without this the
          // <demo_stop> wrap directive vanishes on resume and the hard stop lands
          // with no pedagogical wind-down.
          openerFields.sessionMode = isTrial || beh.journey.startsWith('demo-') ? 'demo' : 'subscribed';
          // NOTE: openingPhase is deliberately NOT set here anymore (flag-ON
          // follow-up #1): the static system prompt is a byte-stable cached
          // prefix reused every turn, so an opener clause baked into it
          // persisted ALL session. The clause now travels per-turn instead —
          // see openingDirectiveRef below + the callBrainOnce body field.
          // Task B3: arm the fail-to-simple opener render fallback for the
          // FIRST callBrainOnce turn to complete. Consumed once in
          // callBrainOnce's finally, see opener-fallback.ts.
          // Review fix: this effect re-runs mid-session on a studentPreferences
          // change (see the dep array below), so gate the arm behind the
          // openingTurnArmedRef latch — only the FIRST run this mount may arm
          // the pending flag; later re-runs (mid-session settings changes)
          // must not re-arm it after the opener turn already consumed it.
          // No first-student-utterance signal reaches this mount-time call
          // (buildInstructions runs before any student input exists) — see
          // report. Always resolves 'button', which is the structurally
          // correct value at this call site today.
          openerFields.entryMode = detectEntryMode(undefined);
          openerFields.isReturning = beh.journey === 'subscribed-returning';
          openerFields.selfReportRouting = true;
          // Teacher persona — session-static <teacher_identity> block in the
          // system prompt. Only ever set inside this flag-on block, so flag-
          // off builds stay byte-identical (openerFields stays {}).
          if (teacherPersona) openerFields.teacherPersona = teacherPersona;
          if (!openingTurnArmedRef.current) {
            openingTurnPendingRef.current = beh.opener !== 'none';
            // Task C1: stash the resolved session mode for per-turn reads in
            // callBrainOnce (plan-as-seed framing on lessonPlanContext).
            // Same one-shot latch — a mid-session prompt rebuild must not
            // re-resolve/flip the mode after the session started.
            sessionModeRef.current = openerFields.sessionMode ?? null;
            // Opener-recency (part A): stash the resolved opener KIND for
            // the capture site in callBrainOnce (the record's `kind` field).
            // Same one-shot latch — the kind must reflect the behavior the
            // session actually opened with, never a mid-session re-resolve.
            sessionOpenerKindRef.current = beh.opener;
            // Task C2: arm the completion gate for lessonNode sessions only
            // (never for freestyle OR diagnostic). Freestyle/free-
            // conversation sessions keep today's behavior — their
            // milestones/mastery are already no-ops without a plan. A
            // diagnostic session may CARRY a lessonPlanId, but assessment
            // sessions must stay outside the demo/completion machinery, so
            // the resolved targetKind gates it too.
            completionGateActiveRef.current =
              TUTOR_PEDAGOGY_OPENER && !!lessonPlanId && sig.targetKind !== 'diagnostic';
            // Seed the per-turn opening directive under the SAME one-shot
            // latch (a mid-session prompt rebuild must not resurrect a
            // retired directive — the exact bug pattern the B3 review
            // caught for the fallback arm).
            const openerClause = buildOpenerClause({
              ...openerFields,
              openingPhase: beh.opener !== 'none',
              studentName,
              subject,
              topic,
              level,
            } as SystemPromptContext);
            // Resume-stale nuance: the student HAD started this lesson but
            // the checkpoint was too old to restore — prepend the one-line
            // re-orient instruction to the same directive (no new machinery;
            // rides the existing per-turn <opening_directive> block).
            const baseDirective =
              beh.journey === 'resume-stale' && openerClause
                ? `${STALE_CHECKPOINT_REORIENT_CLAUSE} ${openerClause}`
                : openerClause;
            // Teacher persona: the one-sentence introduce-yourself directive
            // is stashed SEPARATELY (rides the first brain turn only — see
            // the attach site) and ONLY for first-meeting journeys. Pickups,
            // resumes, and returning students already know this teacher; the
            // re-intro on those journeys was the "introduced herself 3×" bug
            // (session-1783615226008) and the enrolled-student re-intro.
            openingDirectiveRef.current = baseDirective;
            teacherIntroDirectiveRef.current =
              teacherPersona && baseDirective && shouldIntroduceTeacher(beh.journey)
                ? renderTeacherIntroDirective(teacherPersona)
                : null;
            // Mid-session style salience: seed the session-static
            // <teacher_style> body under the same one-shot latch.
            // Diagnostic sessions stay outside the persona theatrics —
            // same targetKind gate as the completion gate above. null
            // (no persona / no audible style markers) ⇒ never attached.
            teacherStylePersonaRef.current =
              teacherPersona && sig.targetKind !== 'diagnostic' ? teacherPersona : null;
            openingTurnArmedRef.current = true;
          }
        }

        // Build system prompt using existing builder
        const systemPrompt = buildSystemPrompt({
          module: knowledgeModule,
          studentName,
          sessionGoal,
          timeRemainingMinutes: 30,
          currentState: 'greeting',
          subject,
          topic,
          level,
          studentPreferences,
          realtimeV2: useRealtimeV2,
          ...openerFields,
        });

        // Read optional voice personality from env
        const voicePersonality = process.env.NEXT_PUBLIC_TUTOR_VOICE_PERSONALITY
          || 'Be upbeat, enthusiastic, and warm. Use an encouraging and energetic tone — like a favorite teacher who genuinely loves the subject. Celebrate small wins ("Nice!", "Exactly!", "You\'re getting it!"). Vary your energy to keep the student engaged.';

        // Add OpenAI-specific voice instructions
        const openAIInstructions = `${systemPrompt}

## Voice Personality & Tone
${voicePersonality}

## Voice Interaction Guidelines
- You are in a real-time voice conversation. Responses are spoken aloud.
- Keep responses concise: 1-3 sentences for most exchanges.
- Use natural conversational speech patterns.
- React naturally to student responses - you'll hear them in real-time.
- If the student interrupts, acknowledge it and adjust your response.

## Visual Tools

Whiteboard tool rules and the structured-tool catalog are covered in the system prompt above. Two reminders specific to the realtime voice channel:

- **One question, one visual.** Render only the visual that directly answers what the student asked. Do NOT add an unrequested second diagram (e.g. a Lewis structure alongside a reaction-coordinate diagram, a timeline alongside a map). Extra visuals clutter the board.
- **Final-answer equation.** When a problem is solved, close with show_equation whose label is "Final Answer" and whose latex restates the original problem on the left and the result on the right (e.g. "\\\\int_0^2 (4x - x^2)\\\\, dx = \\\\frac{16}{3}"). One-line glanceable summary.

Open with "Hey [name]!" — three words. Wait for the student.`;

        // Stash the full prompt for Claude (read by the brain orchestrator).
        // In relay mode the actual Realtime `instructions` get overridden
        // with the short RELAY_MODE_PROMPT inside the hook, but Claude still
        // needs the full tutoring rules to author the conversation.
        // Diagnostic: log the humor pref each (re)build so a MID-SESSION change
        // via the ⋯ menu is visible — confirms the new level reached the brain.
        console.log(`[VoiceTutorRealtime] system prompt (re)built — humorCeiling=${studentPreferences?.humorCeiling ?? '(default)'}`);
        claudeSystemPromptRef.current = openAIInstructions;
        setInstructions(openAIInstructions);
        setIsInitialized(true);
      } catch (err) {
        console.error('[VoiceTutorRealtime] Failed to build instructions:', err);
        setErrorMessage('Failed to initialize tutor');
      }
    };

    buildInstructions();
    // studentPreferences included so a settings change between sessions
    // (or via the in-session chip in Stage 4) rebuilds the system prompt
    // with the new humor level. Object identity is stable until the user
    // mutates a field, so this doesn't cause spurious rebuilds.
    // profileFetchSettled (H2 race fix) re-runs the build once the student
    // profile fetch settles so the opening seed sees the real
    // hasPriorSessions value; it only ever flips when TUTOR_PEDAGOGY_OPENER
    // is on AND studentId is set, so flag-off / anonymous timing is
    // unchanged. All opening refs are latched one-shot, so the re-run is
    // safe (see openerSignalsReady above).
  }, [subject, topic, level, studentName, sessionGoal, studentPreferences, profileFetchSettled]);

  // Kick the ephemeral-token fetch immediately on mount so it runs in parallel
  // with buildInstructions — that alone saves ~500–1500 ms, and it is safe to
  // do before instructions are ready (the token is just a credential).
  useEffect(() => {
    realtime.prefetchToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Open the WebSocket only once instructions are ready, so session.update can
  // ship immediately when ws.onopen fires. Previous aggressive-parallel attempt
  // could leave the WS open with no session configured for several seconds,
  // which OpenAI's server reacts to by closing the connection.
  useEffect(() => {
    if (isInitialized && instructions && realtime.state === 'disconnected') {
      realtime.connect();
    }
  }, [isInitialized, instructions, realtime]);

  // When connected, prompt user to click to start
  // Don't auto-send greeting - let user initiate by clicking the mic
  useEffect(() => {
    if (realtime.isConnected && realtime.state === 'connected') {
      console.log('[VoiceTutorRealtime] Connected and ready - click mic to start');
    }
  }, [realtime.isConnected, realtime.state]);

  // Track if we've started the session (state, not ref, so pause button renders)
  const [hasStarted, setHasStarted] = useState(false);
  // Round-16 Issue 1: ref mirror of hasStarted for the handleRef closure
  // (the handle effect closes over state that would otherwise be stale).
  // Written directly at every setHasStarted(true) site.
  useEffect(() => { hasStartedRef.current = hasStarted; }, [hasStarted]);

  // RESUME first-interaction: the single gesture that unlocks TTS audio AND
  // kicks the brain to pick up a rehydrated session. The brain has the restored
  // history + board, so it re-orients, RE-RENDERS any interrupted visual, and
  // continues — voiced + drawn through the normal turn path (tools actually run,
  // which a raw relay re-voice never could). bypassMidUtteranceGuard mirrors the
  // [start lesson] kickoff: the synthetic opener must not be dropped by a
  // transient startup-noise mid-utterance flag. Shared by the "Continue lesson"
  // overlay (handleRef.resumeContinue) AND the mic dock's resume tap. Guarded so
  // a second trigger after the session has started is a harmless no-op.
  const resumeContinue = useCallback(() => {
    if (hasStarted || !resumeState) return;
    hasStartedRef.current = true;
    setHasStarted(true);
    // Task E1 / demo time-box: stamp the actual session start for the demo-stop
    // clock AND the hard-stop cap. Unconditional (not flag-gated) — the cap
    // must work with TUTOR_PEDAGOGY_OPENER off.
    if (voiceSessionStartedAtMsRef.current === null) {
      voiceSessionStartedAtMsRef.current = Date.now();
    }
    onSessionStarted?.();
    setIsWarmingUp(true); // the brain is composing the resume turn now
    // R32 T9: arm the watchdog with the exact kickoff text so a stall can be
    // silently re-kicked once (20s) before failing visibly (40s).
    warmupStateRef.current = createWarmupState(Date.now());
    setWarmupFailed(false);
    const resumeKickoff =
      '[Session-resumed: the student reloaded mid-session; pick up exactly where you left off]';
    warmupKickoffRef.current = resumeKickoff;
    realtime.unlockAudio();
    handleStudentTranscriptForBrain(
      resumeKickoff,
      { silent: true, bypassMidUtteranceGuard: true },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasStarted, resumeState, onSessionStarted, realtime, handleStudentTranscriptForBrain]);
  resumeContinueRef.current = resumeContinue;

  // Demo hard-stop cap (demo time-box): a wall-clock timer that ends the
  // session when a TRIAL carrying an EXPLICIT max_duration_minutes reaches its
  // budget. Intentionally NOT gated on TUTOR_PEDAGOGY_OPENER — this is a
  // product/safety cap, not a pedagogy experiment. Exempt for diagnostics
  // (Rule 1 disables demo-stop; guard here too — they never carry is_trial +
  // timebox, but be defensive). Anchored to voiceSessionStartedAtMsRef, which
  // is stamped once at first real start and SURVIVES rotation (only
  // sessionStartMsRef resets on rotation), so the cap counts teaching time and
  // rotation does not extend it. Polls because the anchor is a ref (no
  // re-render on write); a coarse tick is plenty for a minute-granularity cap.
  // Ends through the EXISTING graceful path (onEndSession) — the same one the
  // student's End button uses — so the normal evelyn:session_ended postMessage
  // fires, tagged reason='time_limit'. hardStopFiredRef guarantees one fire.
  useEffect(() => {
    if (!(isTrial && maxDurationExplicit)) return;
    if (targetKind === 'diagnostic') return;
    if (!onEndSession) return;
    const capMs = sessionMaxMinutes * 60000;
    const intervalId = setInterval(() => {
      if (hardStopFiredRef.current) return;
      const startedAtMs = voiceSessionStartedAtMsRef.current;
      if (startedAtMs === null) return; // session hasn't really started yet
      if (Date.now() - startedAtMs >= capMs) {
        hardStopFiredRef.current = true;
        clearInterval(intervalId);
        console.log(
          `[demo-time-box] hard stop reached ${sessionMaxMinutes}min cap — ending session (reason=time_limit)`,
        );
        onEndSession('time_limit');
      }
    }, 5000);
    return () => clearInterval(intervalId);
  }, [isTrial, maxDurationExplicit, targetKind, sessionMaxMinutes, onEndSession]);

  // Toggle listening
  const handleMicClick = useCallback(() => {
    // RESUME first-tap — handled BEFORE the connection gate below. On a fresh
    // reload the relay WS churns, so a tap can land while realtime.isConnected
    // is still false; the gated path would no-op (dead tap). Here we mark the
    // session started (which unmutes the perception mic — the input authority in
    // claude-brain) and kick the BRAIN to resume the turn. The brain has the
    // rehydrated history + restored board, so it re-orients, RE-RENDERS any
    // interrupted visual, and continues — voiced + drawn through the normal
    // turn path (reliable; no relay-timing races, and tools actually run, which
    // a raw relay re-voice could never do). bypassMidUtteranceGuard mirrors the
    // [start lesson] kickoff: the synthetic opener must not be dropped by a
    // transient startup-noise mid-utterance flag.
    if (resumeState && !hasStarted && realtime.state !== 'listening' && realtime.state !== 'speaking') {
      resumeContinue();
      return;
    }
    if (realtime.state === 'listening') {
      realtime.stopListening();
    } else if (realtime.state === 'speaking') {
      realtime.interrupt();
      // Respect the student's muted state even when interrupting the tutor.
      if (!isMicMuted) realtime.startListening();
    } else if (realtime.isConnected) {
      // On first click, send context-aware greeting to get tutor's introduction.
      // In claudeBrainMode the greeting prompt is a system-style instruction
      // ("Open with 'Hey [name]!' — three words. Wait for the student.") that
      // would confuse the brain if routed as a student transcript. Skip the
      // auto-greeting; the student initiates with their first utterance and
      // the brain greets in its first turn (the system prompt already
      // instructs it to open with the student's name).
      if (!hasStarted) {
        hasStartedRef.current = true;
        setHasStarted(true);
        // Task E1 / demo time-box: stamp the actual session start for the
        // demo-stop clock AND the hard-stop cap. Unconditional (not flag-gated)
        // — the cap must work with TUTOR_PEDAGOGY_OPENER off.
        if (voiceSessionStartedAtMsRef.current === null) {
          voiceSessionStartedAtMsRef.current = Date.now();
        }
        // Session has truly begun now (student tapped the mic) — start the
        // session timer from here, not from page mount.
        onSessionStarted?.();
        // Immediate visual feedback while the brain composes its first turn.
        setIsWarmingUp(true);
        // R35 T-A: this IS the voice mic-click kickoff (as opposed to
        // typed-first / agenda-pick / resume, which arm isWarmingUp too but
        // NOT this overlay — see onWarmupOverlayChange's doc comment). Only
        // this branch shows the full-stage "joining" overlay; it's cleared
        // by the effect near isWarmingUp's declaration the moment audio
        // actually starts (or the watchdog gives up).
        setShowWarmupOverlay(true);
        // R32 T9: arm the watchdog. Stashed below per-branch only where the
        // kickoff is a known literal string safely re-sendable through
        // handleStudentTranscriptForBrain; the non-claude-brain greeting
        // branch dispatches via realtime.sendTextMessage instead, so it
        // leaves warmupKickoffRef null (fail-only safety net, no auto-rekick).
        warmupStateRef.current = createWarmupState(Date.now());
        warmupKickoffRef.current = null;
        setWarmupFailed(false);
        console.log(`[STARTUP] start → isWarmingUp=true (connected=${realtime.isConnected}, state=${realtime.state}, claudeBrain=${claudeBrainMode}, plan=${!!lessonPlanRef.current})`);
        // CRITICAL on iOS: the user's Start tap is the gesture iOS uses
        // to "unlock" audio playback. Calling resume() synchronously
        // inside this handler ensures TTS chunks play audibly. Without
        // this, audio queues silently until some other gesture (like
        // unmute) inadvertently unlocks the AudioContext.
        realtime.unlockAudio();
        if (!claudeBrainMode) {
          const greetingMessage = getInitialGreetingPrompt(sessionGoal, topic);
          realtime.sendTextMessage(greetingMessage);
        } else if (lessonPlanRef.current) {
          // Lesson-plan-driven session: the brain owns the opening (Hook
          // segment). Kick it with a synthetic student-side trigger so it
          // starts teaching immediately rather than waiting for a "hi".
          console.log('[STARTUP] claude-brain: kicking off lesson plan via brain ([start lesson]).');
          // bypassMidUtteranceGuard: the synthetic kickoff is the OPENER — it
          // cannot "talk over" the student. Without this, transient perception
          // noise at session start (e.g. mic catches an ambient "you", classified
          // + dropped as noise a moment later) sets perceptionMidUtteranceRef=true
          // for the instant the kickoff fires, so STAGE-3 fix #11 DROPS the
          // kickoff and it is NEVER retried → the lesson never starts → "preparing
          // your tutor" hangs forever (2026-06-23 recursion startup-hang repro).
          // R32 T9: stash it so the watchdog can silently re-kick once at 20s.
          warmupKickoffRef.current = '[start lesson]';
          handleStudentTranscriptForBrain('[start lesson]', { silent: true, bypassMidUtteranceGuard: true });
        } else {
          // Free-conversation mode: also kick the brain so it greets
          // first instead of leaving the student staring at "preparing
          // your tutor" until they type or speak. Without this nudge the
          // UI stays in isWarmingUp until the first student utterance,
          // which felt stuck (observed 2026-04-29 algebra-2 session
          // where the student had to type "teach me anything" to break
          // out of the preparing state).
          console.log('[VoiceTutorRealtime] claude-brain: free-conversation, kicking brain to greet first.');
          // bypassMidUtteranceGuard: same as the lesson kickoff above — the
          // synthetic opener must not be dropped by a transient startup-noise
          // mid-utterance flag (else "preparing your tutor" hangs).
          // R32 T9: stash it so the watchdog can silently re-kick once at 20s.
          warmupKickoffRef.current = '[start session]';
          handleStudentTranscriptForBrain('[start session]', { silent: true, bypassMidUtteranceGuard: true });
        }
      }
      // If the student hit the Mute button BEFORE clicking Start, honour that
      // the whole way through — send the greeting but do not open the mic.
      // They can unmute whenever they're ready; startListening fires from
      // toggleMicMute's unmute branch.
      if (!isMicMuted) {
        realtime.startListening();
      } else {
        console.log('[VoiceTutorRealtime] Start clicked while muted — skipping startListening');
      }
    }
  }, [realtime, sessionGoal, topic, hasStarted, isMicMuted, claudeBrainMode, handleStudentTranscriptForBrain, onSessionStarted, resumeState, resumeContinue]);

  // Keep the handle's startSession pointed at the CURRENT handleMicClick
  // closure — it reads hasStarted / isMicMuted / realtime.state, so a stale
  // capture would send a duplicate kickoff or ignore a pre-start mute.
  useEffect(() => {
    micClickRef.current = handleMicClick;
  }, [handleMicClick]);

  // Pause conversation (stop mic + audio, keep connection)
  const handlePause = useCallback(() => {
    setIsPaused(true);
    realtime.pause();
  }, [realtime]);

  // Resume conversation
  const handleResume = useCallback(() => {
    setIsPaused(false);
    realtime.startListening();
  }, [realtime]);

  // Toggle mute student mic. Side effects run OUTSIDE a setState updater (which
  // runs during render) — calling other setStates there throws "update during
  // render". We read isMicMutedRef (kept in sync) for the current value.
  const toggleMicMute = useCallback(() => {
    const newMuted = !isMicMutedRef.current;
    isMicMutedRef.current = newMuted;
    // Gate BOTH inputs. perception owns the mic now (Stage 4); it's muted by the
    // start-gate effect (single owner, watches isMicMuted + hasStarted + muteGrace).
    if (newMuted) {
      // R34 T3: a dangling-word fragment held for resumption ("give me a…")
      // must not be silently dropped by the ordinary muted-drop guard in
      // perceptionOnTranscript — the student muting mid-hold means the
      // resumed speech that would have merged with it is never coming.
      // Flush it now, through the same submitPendingUtteranceRef one-shot
      // the mid-utterance case below uses, so it still reaches the brain
      // instead of vanishing. isMicMutedRef.current is already true (set
      // above), so this flush call falls straight into the mute
      // gate's "submit the in-flight utterance" branch.
      if (heldTranscriptRef.current) {
        const held = heldTranscriptRef.current;
        clearTimeout(held.timer);
        heldTranscriptRef.current = null;
        console.log('[VoiceTutorRealtime] mute with held dangling-word fragment — flushing through submit-on-mute');
        onDebugEvent?.('transcript_hold_flushed', held.text.slice(-30));
        submitPendingUtteranceRef.current = true;
        perceptionOnTranscriptRef.current?.(
          { text: held.text, tMs: held.tMs, latencyMs: held.latencyMs, itemId: held.itemId },
          true,
          held.speechStartedAt,
        );
      }
      // Mute-to-submit: if an utterance is in flight (still speaking, or stopped
      // and transcribing), keep perception LISTENING for a short grace window so
      // the server VAD commits it; arm the one-shot pass so its transcript
      // reaches the brain. Then we actually go quiet. Phone-like "I'm done".
      if (perceptionMidUtteranceRef.current || awaitingDispatchTimerRef.current != null) {
        submitPendingUtteranceRef.current = true;
        if (muteGraceTimerRef.current) clearTimeout(muteGraceTimerRef.current);
        setMuteGrace(true);
        muteGraceTimerRef.current = setTimeout(() => { muteGraceTimerRef.current = null; setMuteGrace(false); }, 3500);
        console.log('[VoiceTutorRealtime] mute with in-flight utterance — perception listens briefly to capture it, then mutes');
      }
      realtime.muteInput();
      console.log('[VoiceTutorRealtime] Student mic muted');
      onDebugEvent?.('mic_mute', 'Student muted mic');
    } else {
      // Clear any unused mute-to-submit one-shot + grace so they can't leak a
      // later ambient transcript through the muted guard.
      submitPendingUtteranceRef.current = false;
      if (muteGraceTimerRef.current) { clearTimeout(muteGraceTimerRef.current); muteGraceTimerRef.current = null; }
      setMuteGrace(false);
      // On unmute, reset any stale orchestrator flags (a pending brain call from
      // before a mute can leave brainBusyRef=true and hang the UI on "thinking").
      if (brainBusyRef.current) {
        console.log('[VoiceTutorRealtime] Unmute: clearing stale brain-busy flag');
        setBrainBusy(false);
        queuedTranscriptsRef.current = [];
      }
      realtime.startListening();
      console.log('[VoiceTutorRealtime] Student mic unmuted');
      onDebugEvent?.('mic_unmute', 'Student unmuted mic');
    }
    setIsMicMuted(newMuted);
  }, [realtime, onDebugEvent]);

  // ===== Start-gate: keep the perception mic MUTED until explicit Start =====
  // The perception WS connects warm on mount (perceptionEnabled, above) so
  // there's no connect latency when the student begins — but it must not hear
  // anything until the student explicitly clicks the mic to start (hasStarted)
  // and hasn't muted. Muted = onaudioprocess drops frames, so nothing is
  // transcribed or dispatched to the brain. This closes the long-standing
  // "session auto-starts on ambient noise / pre-start speech is captured" gap
  // (the production WS is already gated — it only startListening()s on Start).
  // Single owner of perception mute: toggleMicMute flips isMicMuted and this
  // effect applies it. setMuted logs + clears the server buffer, so we only
  // apply it on a real transition (guard ref), never every render.
  const perceptionSetMuted = perception.setMuted;
  const lastPerceptionMutedRef = useRef<boolean | null>(null);
  useEffect(() => {
    // muteGrace keeps perception LISTENING for a beat after a mute-with-in-flight
    // so the VAD can commit the student's last utterance (mute-to-submit).
    const shouldMute = (!hasStarted || isMicMuted) && !muteGrace;
    if (lastPerceptionMutedRef.current === shouldMute) return;
    lastPerceptionMutedRef.current = shouldMute;
    perceptionSetMuted(shouldMute);
  }, [perceptionSetMuted, hasStarted, isMicMuted, muteGrace]);

  // Handle user's "continue" choice on the 55-min rotation prompt. We
  // disconnect the current session and immediately reconnect; on fresh
  // connection, injectContext fires with a summary of what we covered.
  const handleContinueRotation = useCallback(async () => {
    setSessionRotationPrompt(false);
    // The disconnect+reconnect below only exists to beat OpenAI's ~60-min
    // Realtime session cap. If we're well under it (the common case — e.g. a
    // 30-min session whose rotation prompt fires at ~0.92*T = 27.6 min), there
    // is NO need to tear down the live session, which cuts off the tutor
    // mid-sentence (observed 2026-06-24). Do a LIGHT continue instead: keep the
    // session, and suppress the imminent silent auto-rotation. A real rotation
    // only happens once we actually approach the cap.
    const HARD_ROTATE_MIN = 50;
    const sessionMinutes = (Date.now() - sessionStartMsRef.current) / 60000;
    if (sessionMinutes < HARD_ROTATE_MIN) {
      autoRotationFiredRef.current = true;     // don't let the 0.97*T fallback tear down
      sessionRotationFiredRef.current = true;  // already shown; don't re-prompt on the T-relative threshold
      console.log(`[VoiceTutorRealtime] continue (light, no reconnect) at ${sessionMinutes.toFixed(1)} min — keeping live session`);
      onDebugEvent?.('session_continue_light', `Continue without reconnect at ${sessionMinutes.toFixed(1)} min`);
      return;
    }
    const summary = buildContextSummary();
    realtime.disconnect();
    // Reset session-start timestamp so the new session gets its own 45/55 gates.
    sessionStartMsRef.current = Date.now();
    longSessionCheckFiredRef.current = false;
    sessionRotationFiredRef.current = false;
    // Small delay so the disconnect completes before reconnecting.
    await new Promise(r => setTimeout(r, 500));
    await realtime.connect();
    // Wait for connection to finish then inject the summary. We rely on the
    // existing injectContext pipeline — it queues until the socket is open.
    setTimeout(() => {
      if (injectContextRef.current && summary) {
        injectContextRef.current(
          summary + '\n\nIMPORTANT: This is a session rotation — we have been studying together already. ' +
          'Do NOT greet the student as if meeting for the first time. Pick up from where we left off.'
        );
      }
    }, 1500);
  }, [realtime, buildContextSummary, onDebugEvent]);

  const handleWrapUpRotation = useCallback(() => {
    setSessionRotationPrompt(false);
    if (injectContextRef.current) {
      injectContextRef.current(
        'SESSION CLOSE: Deliver a 3-sentence recap of what we covered together in this session, ' +
        'name the 1-2 areas the student should review most, and end with encouragement. ' +
        'Keep it warm and brief.'
      );
    }
  }, []);

  // Build a personalized recap prompt for the tutor to deliver at session
  // close. Surfaces the topics covered and the 2 weakest topics so the
  // tutor can target practice problems at what the student struggled with.
  const buildRecapPrompt = useCallback(() => {
    const topics = topicsCoveredRef.current;
    const weaknessList = Array.from(weaknessesRef.current.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([topic]) => topic);
    const topicsBlock = topics.length > 0 ? `Topics covered this session: ${topics.join(', ')}.` : '';
    const weakBlock = weaknessList.length > 0
      ? `The student struggled most with: ${weaknessList.join(' and ')}.`
      : 'No clear weak spots emerged.';
    const practiceBlock = weaknessList.length > 0
      ? `After your spoken recap, call show_problem TWO to THREE times to give the student practice problems targeting exactly those weak spots (${weaknessList.join(', ')}). Each problem should be short, focused, and solvable without re-teaching.`
      : 'After your spoken recap, call show_problem ONCE with a summary problem that covers the core concept of this session.';
    return `SESSION CLOSE TIME. ${topicsBlock} ${weakBlock} ` +
      `Deliver a 3-4 sentence spoken recap: what we covered, what the student did well, and what to review. ` +
      `${practiceBlock} ` +
      `After the practice cards are on the board, say a warm one-sentence send-off. Keep it brief — the student is about to leave the session.`;
  }, []);

  // Expose the rotation handler to the response-done callback via ref so
  // auto-rotation at 58 min can fire without a forward-reference problem.
  continueRotationRef.current = handleContinueRotation;
  // Practice meter: ref-assigned every render (same pattern as the two
  // refs above) so any call site can fire without dependency plumbing.
  emitPracticeStatsRef.current = () => {
    onPracticeStatsChangeRef.current?.({
      active: derivePracticeMode(sessionGoal, practiceOverrideRef.current),
      presented: practicePresentedRef.current,
      solved: practiceSolvedRef.current,
      // Round-22: session-local SOLVE streak (the resumed cross-session
      // pacing streak read as "×11" beside "0 solved" — incoherent).
      streak: practiceStreakRef.current,
    });
  };
  // End/Pause teardown, shared by the dock's own button and the handleRef's
  // endSession (header control). Ref-assigned every render (same pattern as
  // continueRotationRef) so the handleRef effect — whose deps don't include
  // onEndSession/audioRecorder — never captures a stale closure.
  // 2026-07-11 round 3 (user report): End/Pause mid-speech must hard-stop
  // the PLAYING AudioBufferSourceNode, not just the queue — hence
  // clearSpeechQueue + interrupt before anything else.
  endSessionNowRef.current = async () => {
    try { void realtime.clearSpeechQueue(); } catch {}
    try { realtime.interrupt(); } catch {}
    // Instant end — no recap delay, no spinner. Finalize recording and
    // commit profile in the background; the student sees the summary
    // page immediately.
    // Round-15 Issue 10 (2026-07-16): actually background the finalize.
    // The old `await` here flushed up to 30s of buffered PCM for BOTH
    // tracks (~2.9 MB) over a no-timeout fetch before navigating — the
    // observed ~15s hang between clicking End/Pause and reaching the
    // lessons page. The server tolerates unfinalized sessions (hasAudio
    // is set on early chunks — api/tutor/session-audio/route.ts); worst
    // case a teardown races the flush and the final <30s audio tail is
    // lost from the recording, which is the accepted trade for an
    // instant exit.
    if (audioRecordEnabled) {
      void audioRecorder.finalize().catch(() => {});
    }
    // final: carries the transcript + generates the session summary
    // (intermediate flushes already persisted deltas incrementally).
    void commitSessionToProfile({ final: true });
    onEndSession?.();
  };
  // Expose "ensure muted" to the brain orchestrator (defined above toggleMicMute)
  // for the "mute me" voice command. Mutes only if not already muted.
  muteMicRef.current = () => { if (!isMicMutedRef.current) toggleMicMute(); };

  // Get state-specific UI
  const getStateUI = () => {
    switch (realtime.state) {
      case 'connecting':
        return {
          icon: <Loader2 className="w-5 h-5 animate-spin" />,
          text: 'Connecting...',
          subtext: '',
          color: 'bg-yellow-500',
          pulse: false,
        };
      case 'listening':
        // Same desync guard as the `default` branch below: after a kill drains
        // the TTS queue, playNextAudio parks the state on 'listening' while the
        // retry recomposes, so the student sees "Listening…" while the tutor is
        // actually mid-reply (observed 2026-06-16 JEE forcekill session). In a
        // normal turn the brain drives 'processing'→'speaking', never
        // 'listening', so brainBusy here means an active reply, not the
        // student's turn. Presentational only — realtime.state is unchanged.
        if (isBrainResponding) {
          return {
            icon: <Volume2 className="w-5 h-5" />,
            text: 'Tutor responding',
            subtext: '',
            color: 'bg-green-500',
            pulse: true,
          };
        }
        return {
          icon: <Square className="w-4 h-4" />,
          text: 'Listening...',
          subtext: 'Click to stop',
          color: 'bg-red-500',
          pulse: true,
        };
      case 'processing':
        return {
          icon: <Loader2 className="w-5 h-5 animate-spin" />,
          text: 'Thinking...',
          subtext: '',
          color: 'bg-yellow-500',
          pulse: false,
        };
      case 'speaking':
        return {
          icon: <Volume2 className="w-5 h-5" />,
          text: 'Tutor speaking',
          subtext: 'Click to interrupt',
          color: 'bg-green-500',
          pulse: true,
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-5 h-5" />,
          text: 'Error',
          subtext: '',
          color: 'bg-red-600',
          pulse: false,
        };
      case 'disconnected':
        return {
          icon: <WifiOff className="w-5 h-5" />,
          text: 'Disconnected',
          subtext: '',
          color: 'bg-gray-500',
          pulse: false,
        };
      default:
        // Status desync guard (2026-06-16): in claude-brain mode the chat text
        // streams from the brain SSE while TTS audio round-trips to the relay
        // sentence-by-sentence. Between sentences realtime.state drops to
        // 'connected' (this default branch) even though the turn is still in
        // flight — on a high-latency link those gaps are long enough that the
        // student sees "Click to speak" while the tutor is plainly mid-reply.
        // While the brain is actively composing, show an active label instead.
        // Purely presentational — does not touch the barge-in state machine
        // (perception keys off realtime.state, which is unchanged here).
        if (isBrainResponding) {
          return {
            icon: <Volume2 className="w-5 h-5" />,
            text: 'Tutor responding',
            subtext: '',
            color: 'bg-green-500',
            pulse: true,
          };
        }
        return {
          icon: <Mic className="w-5 h-5" />,
          text: transcriptRef.current.length === 0 ? 'Click to start' : 'Click to speak',
          subtext: 'Voice mode',
          color: 'bg-blue-500',
          pulse: false,
        };
    }
  };

  // While the brain is composing its first turn (claude-brain mode kickoff),
  // realtime.state stays 'connected' until the first audio chunk arrives —
  // which can take 5-8s. The button needs an instant visual reaction so the
  // user knows the click landed. `isWarmingUp` flips true on the click and
  // resets when the realtime state moves to processing/listening/speaking
  // OR when the first whiteboard command renders OR when the first
  // tutor sentence appears in the transcript.
  const [isWarmingUp, setIsWarmingUp] = useState(false);
  // R35 T-A: full-stage "joining" overlay. Set true ONLY at the voice
  // mic-click kickoff (see the setShowWarmupOverlay(true) call above, inside
  // handleMicClick's `if (!hasStarted)` branch) — deliberately a SEPARATE
  // flag from isWarmingUp because isWarmingUp exits early (see the two exit
  // effects below: on 'processing'/'speaking'/'error' OR on the first tutor
  // transcript text), which is BEFORE audio actually plays. This flag's own
  // exit effect (after the watchdog effect below, once warmupFailed is in
  // scope) waits for the true audio-start signal instead.
  const [showWarmupOverlay, setShowWarmupOverlay] = useState(false);
  useEffect(() => {
    if (!isWarmingUp) return;
    // Only exit warm-up on STRONG signals that the tutor's response is
    // imminent or arriving — not on intermediate states like 'listening'
    // (which just means mic opened, brain hasn't returned yet) or
    // generic 'connected'. The skeleton must persist through the gap
    // between mic-grant and first brain output.
    const exitStates = ['processing', 'speaking', 'error'];
    if (exitStates.includes(realtime.state)) setIsWarmingUp(false);
  }, [realtime.state, isWarmingUp]);
  // Round-7 item 3: nothing ever cleared errorMessage, so a transient
  // 'WebSocket connection error' banner outlived a successful reconnect
  // (portal-b2fe010e — banner stuck while TTS kept talking). Proven audio
  // flow means voice is healthy again; drop the stale banner.
  useEffect(() => {
    if (realtime.state === 'listening' || realtime.state === 'speaking') {
      setErrorMessage(null);
    }
  }, [realtime.state]);
  // Also exit warm-up when the first tutor turn lands.
  useEffect(() => {
    if (!isWarmingUp) return;
    const hasTutorTurn = transcriptRef.current.some((t) => t.role === 'tutor' && t.text.trim());
    if (hasTutorTurn) setIsWarmingUp(false);
  });

  // R32 T9: warmup watchdog. Every setIsWarmingUp(true) site above stamps
  // warmupStateRef fresh; while isWarmingUp is true this 5s poll drives it —
  // 20s → re-kick once (only where warmupKickoffRef holds a safely-replayable
  // literal kickoff), 40s → give up visibly. Depending on isWarmingUp means
  // the interval is torn down by React's cleanup the instant either of the
  // two exit effects above flips it false (normal completion) OR our own
  // 'fail' branch below does (watchdog give-up) — so a fired 'fail' can never
  // re-fire, and a successful rekick that lets the turn land stops the poll
  // for good, same as any other warmup exit.
  const [warmupFailed, setWarmupFailed] = useState(false);
  useEffect(() => {
    if (!isWarmingUp) return;
    const id = setInterval(() => {
      const ws = warmupStateRef.current;
      if (!ws) return;
      const act = decideWarmupAction(ws, Date.now());
      if (act === 'rekick') {
        if (warmupKickoffRef.current) {
          // Final-review Finding 2: a rekick queued behind a hung busy
          // call is pointless — handleStudentTranscriptForBrain's
          // busy-push branch would just store it (now dropped as
          // synthetic, see the '['-prefixed guard there) and the 40s
          // fail path still fires on schedule regardless. Skip firing it
          // at all rather than dispatching into a call that can't run it.
          if (brainBusyRef.current) {
            onDebugEvent?.('warmup_rekick_skipped_busy', warmupKickoffRef.current.slice(0, 40));
          } else {
            onDebugEvent?.('warmup_rekick', warmupKickoffRef.current.slice(0, 40));
            void handleStudentTranscriptForBrain(warmupKickoffRef.current, {
              silent: true,
              bypassMidUtteranceGuard: true,
              bypassPerceptionDedupe: true,
            });
          }
        }
      } else if (act === 'fail') {
        setIsWarmingUp(false);
        setWarmupFailed(true);
        onDebugEvent?.('warmup_failed', 'watchdog');
        // Reuse the transient status pill used for TTS issues (ttsNotice /
        // ttsNoticeTimerRef, set in onTtsIssue above) — same rendering slot,
        // same auto-clear pattern.
        setTtsNotice('Trouble starting — tap the mic to retry.');
        if (ttsNoticeTimerRef.current) clearTimeout(ttsNoticeTimerRef.current);
        ttsNoticeTimerRef.current = setTimeout(() => setTtsNotice(null), 8000);
      }
    }, 5000);
    return () => clearInterval(id);
  }, [isWarmingUp, handleStudentTranscriptForBrain, onDebugEvent]);

  // R35 T-A: clear the overlay on the REAL audio-start signal
  // (realtime.state === 'speaking' — stamped synchronously right before
  // source.start() in useOpenAIRealtime's playNextAudio, i.e. audio is
  // genuinely about to be heard, not just composed) or on 'error', or the
  // instant the 40s warmup watchdog gives up (warmupFailed) — matching the
  // R34 fail path: mic re-enables + "Trouble starting" pill, so the overlay
  // must not keep the frame blocked underneath it.
  useEffect(() => {
    if (!showWarmupOverlay) return;
    if (realtime.state === 'speaking' || realtime.state === 'error' || warmupFailed) {
      setShowWarmupOverlay(false);
    }
  }, [realtime.state, warmupFailed, showWarmupOverlay]);
  useEffect(() => {
    onWarmupOverlayChange?.(showWarmupOverlay);
  }, [showWarmupOverlay, onWarmupOverlayChange]);

  const baseStateUI = getStateUI();
  const stateUI = isWarmingUp
    ? {
        icon: <Loader2 className="w-5 h-5 animate-spin" />,
        text: 'Starting…',
        subtext: 'preparing your tutor',
        color: 'bg-yellow-500',
        pulse: false,
      }
    : (isMicMuted && realtime.isConnected && !isBrainResponding && realtime.state !== 'speaking' && realtime.state !== 'processing')
    // Muted, student's turn: show "Muted" rather than the misleading "Click to
    // start"/"Click to speak" (the mic is off; the separate mute button unmutes).
    ? { ...baseStateUI, text: 'Muted', subtext: 'tap the mic button to talk', color: 'bg-slate-400', pulse: false }
    : (hasStarted && !isMicMuted && realtime.isConnected && !isBrainResponding && realtime.state !== 'speaking' && realtime.state !== 'processing' && realtime.state !== 'listening' && realtime.state !== 'connecting')
    // Stage 4: perception is the always-open mic, so between turns the production
    // WS sits at 'connected' — but the student IS being heard. Show "Listening…"
    // (matching the real 'listening' state) instead of "Click to speak", which
    // wrongly implies they must click before talking.
    ? { icon: <Square className="w-4 h-4" />, text: 'Listening…', subtext: 'Click to stop', color: 'bg-red-500', pulse: true }
    : baseStateUI;
  // A resume's first tap must be accepted even while the relay WS is still
  // 'connecting' (it churns on a fresh reload): the tap queues the re-voice and
  // unmutes the perception mic regardless of relay state, and the re-voice is
  // fired later by the flush effect once connected. Without this exception the
  // disabled button swallowed the tap entirely (handleMicClick never ran), which
  // is why the resume was silent.
  const resumeAwaitingFirstTap = !!resumeState && !hasStarted;
  // R32 T9: mirrors the resumeAwaitingFirstTap override immediately above —
  // once the warmup watchdog gives up (40s), force the mic enabled even if
  // realtime.state is still 'connecting'/'processing' (the resume path's WS
  // can still be churning at that point), same as the resume override does.
  const isDisabled = (realtime.state === 'connecting' || realtime.state === 'processing' || isWarmingUp) && !resumeAwaitingFirstTap && !warmupFailed;

  // Surface the awaiting-resume state so the host (SessionStage / legacy board)
  // can render the "Continue lesson" overlay. Flips false the moment the student
  // continues (resumeContinue → hasStarted = true).
  useEffect(() => {
    onResumeAwaitingTapChange?.(resumeAwaitingFirstTap);
  }, [resumeAwaitingFirstTap, onResumeAwaitingTapChange]);

  // Surface composing state to the parent. The typing indicator should
  // only appear when the brain is composing AND no streaming bubble has
  // landed yet — once even one sentence has streamed in, the bubble
  // itself is the visible signal of activity. So:
  //   busy = (warmingUp OR processing) AND no in-flight tutor entry yet
  // We deliberately exclude 'speaking' — by the time we're speaking,
  // the streaming bubble has appeared and the indicator is redundant.
  // `streamingEntryActive` tracks whether a tutor-streaming-* bubble
  // is currently in transcriptRef. Set true when the brain orchestrator
  // pushes the first sentence; cleared when the entry is finalized.
  // Drives suppression of the typing indicator so it disappears the
  // moment text starts arriving.
  const [streamingEntryActive, setStreamingEntryActive] = useState(false);
  useEffect(() => {
    const composing = isWarmingUp || realtime.state === 'processing';
    if (!composing || streamingEntryActive) {
      onTutorBusy?.(false);
    } else {
      onTutorBusy?.(true);
    }
  }, [isWarmingUp, realtime.state, onTutorBusy, streamingEntryActive]);

  // Q9: forward the perception-cancel transient signal to the parent
  // so it can render a visible "I heard you" flash on the input area
  // while the classifier verdict is pending. Independent of onTutorBusy
  // (which tracks brain composition state).
  useEffect(() => {
    onInterruptedChange?.(realtime.isInterrupted);
  }, [realtime.isInterrupted, onInterruptedChange]);

  // Direction 4 + "being heard" (2026-06-24): surface a richer voice state for
  // the SessionStage presence orb. Priority: tutor activity (speaking/thinking)
  // outranks the student-side perception states (processing/hearing/listening).
  // The tutor talking/thinking also resolves any pending "got that" window.
  // When the tutor becomes active (composing or speaking), the student's turn
  // is over — clear the "got that" window + any "didn't catch" nudge. Backstop
  // for verdict paths (MERGE/FRESH) that don't run through the orchestrator's
  // own resolve above.
  useEffect(() => {
    if (isWarmingUp || isBrainResponding || realtime.state === 'speaking' || realtime.state === 'processing') {
      resolveAwaitingDispatch();
      onListeningHintRef.current?.(null);
    }
  }, [realtime.state, isWarmingUp, isBrainResponding, resolveAwaitingDispatch]);

  useEffect(() => {
    if (!onVoiceStateChange) return;
    const s = realtime.state;
    const next =
      s === 'error' ? 'error'
      : s === 'speaking' ? 'speaking'
      : (isWarmingUp || isBrainResponding || s === 'processing') ? 'thinking'
      : (hasStarted && isMicMuted) ? 'muted'
      : perceptionAwaitingDispatch ? 'processing'
      : perceptionHearing ? 'hearing'
      // R34 T4: Manual mic mode has a buffered, unsent turn — surface it as
      // the resting state ahead of plain "Listening…" so the student sees
      // "Held — tap ✓ to send" instead of the misleading default. Below
      // 'hearing' on purpose: while actively mid-utterance the ordinary
      // hearing/VU-meter feedback is more useful than the held-turn hint.
      : (manualMic && manualBufferCount > 0) ? 'manual-held'
      // Once started, the perception mic is the real (always-open) input, so the
      // resting state is "listening" even when the production WS (a TTS sink in
      // Stage 4) reports 'connected' between sentences.
      : hasStarted ? 'listening'
      : 'idle';
    onVoiceStateChange(next);
  }, [realtime.state, isWarmingUp, isBrainResponding, hasStarted, isMicMuted, perceptionHearing, perceptionAwaitingDispatch, manualMic, manualBufferCount, onVoiceStateChange]);

  const isIsland = dockVariant === 'island';

  return (
    <div className={`voice-tutor-realtime flex items-center flex-wrap ${isIsland ? 'py-1 px-1 gap-2 sm:gap-2.5' : 'py-2 px-2 gap-2 sm:gap-3'}`}>
      {/* Connection indicator — hide on mobile to save horizontal room.
          The island dock drops it entirely: the presence orb + mic state
          already convey "connected", and a redundant pill clutters the
          floating dock. (Only the error/Reconnect affordance below remains.) */}
      {!isIsland && (
        <div className={`hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
          realtime.isConnected ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
        }`}>
          {realtime.isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
          {realtime.isConnected ? 'Live' : 'Off'}
        </div>
      )}

      {isPaused ? (
        <>
          {/* Pause/Resume button hidden — kept here in case we want to bring it back.
          <button
            onClick={handleResume}
            className="w-10 h-10 rounded-full bg-green-500 text-white hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center flex-shrink-0"
          >
            <Play className="w-5 h-5 ml-0.5" />
          </button>
          <span className="text-sm font-medium text-amber-600">Paused</span>
          */}
        </>
      ) : (
        <>
          {/* Pause button hidden — kept here in case we want to bring it back.
          {realtime.isConnected && (
            <button
              onClick={handlePause}
              className="w-9 h-9 rounded-full bg-amber-100 text-amber-600 hover:bg-amber-200 transition-all duration-200 flex items-center justify-center flex-shrink-0"
              title="Pause conversation"
            >
              <Pause className="w-4 h-4" />
            </button>
          )}
          */}

          {/* Main mic button — the HERO control. The island dock keeps it
              compact (R1 slim bar, 2026-07-14) — the color/pulse carries the
              state, not the size. */}
          <button
            onClick={handleMicClick}
            disabled={isDisabled}
            data-testid="tutor-mic-button"
            className={`
              relative rounded-full text-white flex-shrink-0
              transition-all duration-200 flex items-center justify-center
              ${isIsland ? 'w-10 h-10 shadow-md' : 'w-12 h-12'}
              ${stateUI.color}
              ${isDisabled ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
              ${stateUI.pulse ? 'animate-pulse' : ''}
              ${realtime.isInterrupted ? 'ring-4 ring-yellow-400 ring-opacity-75' : ''}
            `}
          >
            {stateUI.icon}
          </button>

          {/* R34 T4: Manual mic send affordance — a companion button beside
              the mic rather than rewiring the mic's own state machine (the
              brief's explicitly-sanctioned simpler path). Visible only in
              Manual mode with something to send: either the buffer already
              has parts, or the student is mid-utterance right now (tapping
              arms the one-shot manualSendPendingRef — see
              perceptionOnTranscript — so the in-flight utterance dispatches
              the instant it finalizes instead of just buffering). */}
          {TUTOR_MANUAL_MIC && manualMic && (manualBufferCount > 0 || perceptionHearing) && (
            <button
              type="button"
              onClick={() => {
                if (perceptionHearing) {
                  manualSendPendingRef.current = true;
                  onDebugEvent?.('manual_send_armed', `${manualBufferRef.current.length} buffered, mid-utterance`);
                } else {
                  flushManualBuffer();
                }
              }}
              title="Send"
              aria-label="Send buffered turn"
              className={`
                relative rounded-full text-white flex-shrink-0 bg-blue-600
                transition-all duration-200 flex items-center justify-center
                ${isIsland ? 'w-8 h-8 shadow-md' : 'w-9 h-9'}
                hover:scale-105 active:scale-95
                ${manualBufferCount > 0 ? 'animate-pulse' : ''}
              `}
            >
              <Check className={isIsland ? 'w-4 h-4' : 'w-5 h-5'} />
            </button>
          )}

          {/* Caption slot (one-line merged bar) replaces the state text when
              provided; otherwise the legacy state text, hidden on mobile to
              free room for the input. The mic button's color/pulse conveys
              state either way. */}
          {captionSlot ? (
            <div className="flex-1 min-w-0">{captionSlot}</div>
          ) : (
            <div className="hidden md:block min-w-0">
              <p className="text-sm font-medium text-gray-700 truncate">{stateUI.text}</p>
              {stateUI.subtext && (
                <p className="text-xs text-gray-500 truncate">{stateUI.subtext}</p>
              )}
            </div>
          )}
        </>
      )}

      {/* Session rotation prompt — fires once at 55 min to avoid hard cap */}
      {sessionRotationPrompt && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-800 flex-shrink-0">
          <span>You&apos;ve been studying for almost an hour. Keep going?</span>
          <button
            onClick={handleContinueRotation}
            className="px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Continue
          </button>
          <button
            onClick={handleWrapUpRotation}
            className="px-2 py-1 rounded bg-white text-blue-700 border border-blue-300 hover:bg-blue-50"
          >
            Wrap up
          </button>
        </div>
      )}

      {/* Audio-hiccup notice (transient — TTS retry/skip; see onTtsIssue) */}
      {ttsNotice && (
        <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded flex items-center gap-1.5 flex-shrink-0">
          <Loader2 className="w-3 h-3 animate-spin" />
          {ttsNotice}
        </span>
      )}

      {/* Whiteboard status toast (transient — e.g. "Re-rendering problem…") */}
      {whiteboardStatus && (
        <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded flex items-center gap-1.5 flex-shrink-0">
          <Loader2 className="w-3 h-3 animate-spin" />
          {whiteboardStatus}
        </span>
      )}

      {/* Error inline */}
      {errorMessage && (
        <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded truncate max-w-[200px]">
          {errorMessage}
        </span>
      )}

      {/* Mic-silent notice (transient, student-actionable) */}
      {micNotice && !errorMessage && (
        <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded flex-shrink min-w-0">
          {micNotice}
        </span>
      )}

      {/* Text input — for when the student can't speak. On mobile the
          input wraps to its own row (full width); on desktop it shares
          the row with the mic + status. */}
      <form
        autoComplete="off"
        className="order-last w-full md:order-none md:flex-1 md:w-auto flex items-center gap-2 min-w-0"
        onSubmit={async (e: FormEvent) => {
          e.preventDefault();
          const input = (e.target as HTMLFormElement).elements.namedItem('studentText') as HTMLInputElement;
          const rawText = input?.value?.trim();
          // Round-7++++ Fix Issue 5: strip LaTeX inline-math wrappers
          // (\(...\) and \[...\]) from typed input. Students sometimes
          // paste replies that contain LaTeX-formatted numbers from
          // notes / external tools (observed 2026-05-04: "The new
          // sixth number is \(53\), which increases the sum from
          // \(312\) to \(324\)..."). The literal \(...\) markup
          // confuses chat rendering and the brain's parsing. Keep
          // inner content, drop wrappers.
          const text = rawText
            ? rawText
                .replace(/\\\(([^)]*)\\\)/g, '$1')
                .replace(/\\\[([^\]]*)\\\]/g, '$1')
                .replace(/\\\$([^$]*)\\\$/g, '$1')
            : rawText;
          if (text && realtime.isConnected) {
            // The student typing into this textbox is a strong signal
            // they think the system is stuck — clear any stale brain-
            // busy flag and queued transcripts so the typed turn
            // doesn't get silently swallowed behind a hung previous
            // request. Observed 2026-04-29 electricity session.
            if (brainBusyRef.current) {
              console.warn('[VoiceTutor] typed input while brainBusy=true — force-clearing stale busy flag');
              setBrainBusy(false);
              queuedTranscriptsRef.current = [];
            }
            // Clear the input box immediately so the student sees their
            // typed text leave the field as soon as they hit send. Without
            // this, the box still shows the paste through the entire
            // ~5s plan-from-text wait below, which looks like a hang.
            input.value = '';
            // Add to transcript
            const entry: TranscriptEntry = {
              id: `user-${Date.now()}`,
              timestamp: new Date(),
              role: 'student',
              text,
            };
            transcriptRef.current = [...transcriptRef.current, entry];
            onTranscriptUpdate(transcriptRef.current);
            onTrackInteraction?.('message', text, undefined, 'student');
            // Signal "tutor is preparing" so the chat shows the typing
            // dots while plan-from-text runs. Without this, the wait
            // looks like nothing is happening.
            onTutorBusy?.(true);
            // Fresh student message → fresh tutor turn. Same reset as the
            // voice-finalization path.
            visualActionsThisTurnRef.current = new Set();
            newPageThisTurnRef.current = false;
            console.log('[VoiceTutor] Student turn start (typed) — cleared visualActionsThisTurn');
            // Run the same new-problem / topic-shift detectors we run on
            // voice-final transcripts, so typed prompts like "Draw a 30°
            // inclined plane…" trigger a fresh whiteboard page. Before
            // this hook, typed messages bypassed detection entirely.
            runStudentTurnDetection(text, 'typed');
            // Freestyle-text interception: if a parent handler is
            // wired, let it inspect this message before forwarding.
            // The parent currently uses this to fire plan-from-text
            // generation in the background — non-blocking, so the
            // student doesn't wait. If a future caller wants to
            // synchronously swap the active plan it can return
            // { setLessonPlanId }, and we'll wait (bounded) for the
            // child's plan-load effect to reflect the new id.
            if (onBeforeTypedSubmit) {
              try {
                const result = await onBeforeTypedSubmit(text);
                if (result && result.setLessonPlanId) {
                  const targetId = result.setLessonPlanId;
                  const deadlineAt = Date.now() + 4000;
                  while (Date.now() < deadlineAt) {
                    if (lessonPlanRef.current?.id === targetId) break;
                    await new Promise((r) => setTimeout(r, 50));
                  }
                  if (lessonPlanRef.current?.id !== targetId) {
                    console.warn(
                      `[VoiceTutor] onBeforeTypedSubmit set plan ${targetId} but lessonPlanRef did not load in time; proceeding anyway`,
                    );
                  } else {
                    console.log(`[VoiceTutor] generated plan ${targetId} loaded; forwarding typed turn`);
                  }
                }
              } catch (err) {
                console.warn('[VoiceTutor] onBeforeTypedSubmit threw — proceeding without plan:', err);
              }
            }
            // Cut off any in-flight tutor TTS before dispatching the typed
            // turn — otherwise the student waits for the prior bubble to
            // finish before their message reaches the brain. Mirrors the
            // quick-answer button path in page.tsx (stopSpeaking →
            // sendTextMessage).
            //
            // NOTE: barge-in here is purely an audio-experience cut-off.
            // The chat bubble is canonical; the student is assumed to
            // have READ the full bubble text regardless of how much
            // audio played. So we do NOT annotate conversation history
            // — the brain receives the prior tutor turn's text in full
            // and interprets the typed reply as a response to that
            // full text.
            realtime.clearSpeechQueue();
            realtime.interrupt();
            // Typed-FIRST-message start parity (2026-07-12): a student who
            // never taps the mic and opens the session by typing here got a
            // clock stuck at 0:00 and an unarmed demo hard-stop cap — the
            // 2026-07-10 parity fix covered only the external
            // handleRef.sendTextMessage path, not this in-session form.
            // Mirror its guard: stamp once, first real message only. The
            // submit is also a user gesture, so unlock TTS audio here the
            // way the mic-tap start does (iOS queues audio silently until
            // some gesture calls resume()).
            if (voiceSessionStartedAtMsRef.current === null) {
              voiceSessionStartedAtMsRef.current = Date.now();
              onSessionStartedRef.current?.();
              realtime.unlockAudio();
            }
            // Send to AI. input.value was already cleared at the top of
            // this handler before the plan-from-text await so the box
            // empties immediately on submit, not at end of flow.
            // Task X10: this is the canonical TYPED path — mark it so a
            // brain-outage fallback renders text, not spoken "say that again".
            realtime.sendTextMessage(text, { typed: true });
          }
        }}
      >
        <input
          name="studentText"
          type="text"
          // Suppress the browser's autofill/history dropdown (it surfaced prior
          // submitted answers — "hello", "yes", "ready" — over the board). The
          // belt-and-suspenders attrs cover Chrome, which ignores autoComplete
          // alone for some text inputs.
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          data-1p-ignore
          data-lpignore="true"
          placeholder="Type here if you can't speak..."
          // 16px font-size on mobile — anything smaller triggers iOS Safari's
          // auto-zoom on focus, which makes the entire page appear zoomed in
          // and pushes the send button off-screen. text-base = 16px.
          className="flex-1 min-w-0 text-base sm:text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
          disabled={!realtime.isConnected}
          onFocus={() => {
            studentTypingRef.current = true;
            // Mute mic while typing to prevent it picking up speech
            if (!isMicMuted && realtime.isConnected) {
              realtime.muteInput();
            }
          }}
          onBlur={() => {
            studentTypingRef.current = false;
            // Resume mic when done typing (only if student hasn't manually muted)
            if (!isMicMuted && realtime.isConnected) {
              realtime.startListening();
            }
          }}
        />
        <button
          type="submit"
          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-30"
          disabled={!realtime.isConnected}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Controls on the right */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* 2026-07-26 pre-start redesign: hidden until the session starts.
            Pre-start there is nothing to mute, and a second mic glyph beside
            the start mic read as a competing start control (trial feedback:
            "dual microphone icons / choice paralysis"). Mute-BEFORE-start is
            still honored end-to-end for anyone already muted — handleMicClick's
            `if (!isMicMuted)` guard is untouched. */}
        {showsDockMuteButton({ hasStarted, isPaused }) && (
          <button
            onClick={toggleMicMute}
            className={`p-2 rounded-lg text-sm ${isMicMuted ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            title={isMicMuted ? 'Unmute your mic' : 'Mute your mic'}
          >
            {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
        )}

        {(realtime.state === 'error' || realtime.state === 'disconnected') && (
          <button
            onClick={() => { setErrorMessage(null); realtime.connect(); }}
            className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-xs hover:bg-blue-600"
          >
            Reconnect
          </button>
        )}

        {onEndSession && !hideEndButton && (
          <button
            onClick={() => {
              if (!endArmed) {
                setEndArmed(true);
                if (endArmTimerRef.current) clearTimeout(endArmTimerRef.current);
                // 3s to confirm; disarm quietly if the student hesitates. Guards
                // the 2026-07-26 trial failure: one stray tap ended a 38s demo.
                endArmTimerRef.current = setTimeout(() => setEndArmed(false), 3000);
                return;
              }
              if (endArmTimerRef.current) { clearTimeout(endArmTimerRef.current); endArmTimerRef.current = null; }
              setEndArmed(false);
              void endSessionNowRef.current();
            }}
            // Ending is non-destructive now: the session checkpoint (transcript
            // + whiteboard + position) is saved, so the student can resume from
            // the summary screen or a reload. Label reflects the dual role.
            title={endArmed ? 'Tap again to end the session' : 'End or pause — your progress is saved, resume anytime'}
            aria-label={endArmed ? 'Tap again to end the session' : 'End or pause session'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${
              endArmed
                ? 'bg-red-600 text-white hover:bg-red-700 shadow-sm'
                : isIsland
                ? 'bg-red-500 text-white hover:bg-red-600 shadow-sm'
                : 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
            }`}
          >
            <LogOut className="w-3.5 h-3.5" />
            {/* inline-block + min-w so "End session?" reserves the same slot
                as "End / Pause" — armed/unarmed never resize the button, so
                the second tap always lands on the same hit target. */}
            <span className="inline-block min-w-[6.5rem]">{endArmed ? 'End session?' : 'End / Pause'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
