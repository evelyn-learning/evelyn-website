'use client';

/**
 * Voice Tutor Realtime Component
 *
 * Uses OpenAI's Realtime API for low-latency voice conversations.
 * This replaces the separate STT -> Claude -> TTS pipeline with
 * a single real-time WebSocket connection to OpenAI.
 */

import { useState, useCallback, useEffect, useRef, type FormEvent } from 'react';
import { Mic, MicOff, Volume2, Loader2, AlertCircle, Square, Wifi, WifiOff, LogOut, Pause, Play, Send } from 'lucide-react';
import { useOpenAIRealtime, OpenAIVoice, RealtimeState, type RealtimeUsage, type WhiteboardCommandResult } from '../hooks/useOpenAIRealtime';
import { mapFunctionCallToCommand } from '../hooks/toolDefinitions';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { buildSystemPrompt, getInitialGreetingPrompt } from '@/lib/tutor/ai/system-prompt-builder';
import { useStudentPreferences } from '@/hooks/useStudentPreferences';
import { buildLessonPlanContext, resolveAdvanceTarget, getSegmentTruth } from '@/lib/tutor/lesson-plan/context';
import { getSegment } from '@/lib/tutor/lesson-plan/types';
import { buildWhiteboardSummary } from '@/lib/tutor/whiteboard/summary';
import { LessonPlanProgress } from './LessonPlanProgress';
import { loadModuleByParams } from '@/lib/knowledge/registry';
import { validateGeometryCommand, type GeometryCommand } from '@/lib/tutor/whiteboard/geometry-validator';
import { validateConicGraph } from '@/lib/tutor/whiteboard/conic-validator';
import { validateIntersectionPoints } from '@/lib/tutor/whiteboard/intersection-validator';
import {
  extractDeclarations,
  extractIntegrand,
  extractFinalAnswerClaim,
  normalizeRenamedFunction,
  isPureGreeting,
  isRejection,
  isWalkThroughRequest,
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
import type { WhiteboardCommand } from '@/lib/knowledge/types';
import type { FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';
import { buildManifestForCommand } from '@/lib/tutor/diagrams/manifests';
import { solveDiagram } from '@/lib/tutor/diagrams/catalog/manifest';
import { WhiteboardCatalog, buildShowSignature, extractCommandTitle } from '@/lib/tutor/whiteboard/catalog';
import type { InteractionType } from '@/hooks/useDemoTracking';

// ─── Topic-notes orchestrator guardrails ───
// Brain may emit expand_topic_notes_theory / add_topic_notes_method /
// add_topic_notes_pointer at segment boundaries. The orchestrator gates
// per the Q7+Q8 design in project_topic_notes_initiative.md:
//   - 3-segment warmup before tools become eligible (silent-drop earlier)
//   - per-session caps per bucket (silent-drop over-firing)
//   - active-topic binding (baselineId = current planId; brain doesn't choose)
//   - async fire-and-forget PATCH; failures log-only
// Dedup against baseline + existing overlays lives in apply-overlay.ts;
// the orchestrator just routes.
// Lowered 3 → 1 for v1 calibration: with the 3-segment gate, short test
// sessions never cleared warmup before ending, leaving the brain unable
// to fire even once. 1 lets the brain start adding notes after the
// student has shown any engagement at all (post-hook segment). Re-tune
// from telemetry once we see real over-firing patterns.
const TOPIC_NOTES_WARMUP_SEGMENTS = 1;
const TOPIC_NOTES_RATE_LIMITS = { theory: 5, methods: 3, pointers: 5 } as const;

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

export interface RealtimeHandle {
  sendTextMessage: (text: string) => void;
  /** Speak tutor-side text directly through TTS without routing
   *  through the brain. Used by the in-session lesson picker to
   *  voice its greeting bubble (the picker is a UI element rendered
   *  in the transcript area, not a brain turn, so without this it
   *  appears in the chat but isn't spoken aloud). */
  speakText: (text: string) => void;
  /** Cut off the current TTS bubble + drop queued sentences. Used
   *  when a quick-answer button tap should jump straight to the
   *  next turn instead of waiting for the prior one to finish. */
  stopSpeaking: () => void;
  getSessionSummary: () => {
    topicsCovered: string[];
    weakTopics: Array<{ topic: string; count: number }>;
  };
  /** Phase 3: step the session-level depth preference. Negative =
   *  more depth / slower teaching. Positive = less depth. Clamped
   *  -2..+2. Wired to ⋯ menu Slow down / Speed up items. Verbal
   *  cues like "slow down" / "faster" go through the boredom-cue
   *  regex inside callBrainOnce and call stepPaceBias internally. */
  stepPaceBias: (delta: -1 | 1) => void;
}

// --- Multi-language whiteboard intent detection ---
// Detects when the tutor claims to show, write, or display something visually.
// Two layers: (1) explicit keyword patterns for major languages, (2) a universal
// math/visual content heuristic that catches any language the patterns miss.
const WHITEBOARD_INTENT_PATTERNS = [
  // English
  /\b(show|display|put|write|post|look at|on the (?:white)?board|here(?:'| i)s|let me (?:draw|write|show|put)|i(?:'ll| will) (?:draw|write|show|put)|see (?:the|this)|check (?:the|this) out|take a look|written (?:it |everything )?(?:down|out))\b/i,
  // German
  /\b(zeig|schau|hier (?:siehst|sieht|ist|sind)|aufschreiben|aufgeschrieben|mitschreiben|hinschreiben|anschreiben|visuell|an die Tafel|auf (?:die|dem) (?:Tafel|Whiteboard|Board)|lass (?:uns|mich) (?:das )?(?:aufschreiben|anschauen|ansehen))\b/i,
  // Spanish
  /\b(mira|muestra|escrib|pon(?:go|er|gamos)|en la pizarra|aqu[ií] (?:est[áa]|tienes|ves)|te (?:muestro|enseño)|voy a (?:escribir|mostrar|dibujar)|fíjate)\b/i,
  // French
  /\b(montr|regarde|[ée]cri[st]|affich|sur le tableau|voici|voilà|je (?:te |vous )?montre|(?:je vais|laisse[z-]moi) (?:[ée]crire|montrer|dessiner))\b/i,
  // Italian
  /\b(guard[ai]|mostr[oi]|scriv[oi]|sulla lavagna|ecco|qui (?:c'è|vedi)|ti (?:mostro|faccio vedere))\b/i,
  // Portuguese
  /\b(olh[ae]|mostr[oa]|escrev[oa]|no quadro|aqui (?:está|tens|vês)|vou (?:escrever|mostrar|desenhar))\b/i,
  // Dutch
  /\b(kijk|laat (?:me |ik )?(?:zien|schrijven)|schrijf|op het (?:bord|whiteboard)|hier (?:is|staat|zie je))\b/i,
  // Russian / Cyrillic
  /\b(смотри|показ|запиш|напиш|на доск[еу]|вот (?:так|это|формула)|покажу|давай (?:запишем|напишем))\b/i,
  // Serbian / Croatian / Bosnian (Latin script)
  /\b(tabli|tabla|napisat|zapisa|prikazat|prika[zž]|pogledaj|evo|ovde|napisali|napisao)\b/i,
  // Turkish
  /\b(bak|göster|yaz|tahtaya|burada|şimdi (?:yazıyorum|gösteriyorum))\b/i,
  // Polish
  /\b(patrz|poka[żz]|pisz|na tablicy|tutaj (?:jest|masz|widzisz)|napiszę|pokażę)\b/i,
  // Czech / Slovak
  /\b(podívej|ukaž|napiš|na tabul[ie]|tady|ukážu|napíšu)\b/i,
  // Romanian
  /\b(uite|arăt|scriu|pe tablă|aici|hai să)\b/i,
  // Hungarian
  /\b(nézd|mutato|íro[mk]|táblára|itt (?:van|látod))\b/i,
  // Arabic (transliterated patterns that Whisper produces)
  /\b(شوف|أكتب|على السبورة|هنا|انظر|أريك|سأكتب)\b/,
  // Japanese (katakana/hiragana patterns)
  /(?:見て|書く|ここに|ホワイトボード|表示|見せ)/,
  // Korean
  /(?:보세요|써|칠판|여기|보여줄게)/,
  // Chinese
  /(?:看|写|黑板|白板|这里|显示)/,
  // Hindi (transliterated)
  /\b(dekh|likht?|board par|yahan|dikha)\b/i,
  // Swahili
  /\b(angalia|andika|ubao|hapa|nionyeshe)\b/i,
];

// Universal heuristic: if the tutor text contains mathematical notation
// (equations, variables, operators) without a tool call, it likely needs a whiteboard.
// This catches ANY language the patterns above might miss.
const MATH_CONTENT_PATTERN = /(?:[=+\-*/^].*[=+\-*/^]|[xy]\s*[=+\-]|\d+\s*[=<>]\s*\d+|\b(?:equation|formula|graph|diagram|table)\b)/i;

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
  voice?: OpenAIVoice;
  onTranscriptUpdate: (entries: TranscriptEntry[]) => void;
  onWhiteboardCommand: (commands: WhiteboardCommand[]) => void;
  onStateChange?: (state: RealtimeState) => void;
  onError?: (error: Error) => void;
  /** Voice transcription status from OpenAI Realtime. 'failed' surfaces
   *  rate-limit / auth / malformed-audio errors so the parent can prompt
   *  the student to type instead. 'completed' fires on every successful
   *  transcription so the parent can dismiss any "voice trouble" banner. */
  onTranscriptionStatus?: (status: 'failed' | 'completed', errorType?: string) => void;
  onEndSession?: () => void;
  onTrackInteraction?: (type: InteractionType, content?: string, metadata?: Record<string, unknown>, role?: 'student' | 'tutor') => void;
  onUsageUpdate?: (usage: RealtimeUsage) => void;
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
  /** TTS provider for relay-mode voicing of the brain's text.
   *  - 'realtime' (default): Realtime out-of-band response. Highest quality, expensive.
   *  - 'openai-mini': gpt-4o-mini-tts via /api/tutor/tts-openai. ~10× cheaper. */
  ttsProvider?: 'realtime' | 'openai-mini';
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
  /** Phase 3: fires whenever paceBias changes (button click OR matching
   *  verbal cue). Parent uses this to render an "ack" badge confirming
   *  the click landed and showing current bias state. */
  onPaceBiasChange?: (bias: number) => void;
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
}

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
  lessonPlanId,
  studentId,
  voice = 'shimmer',
  onTranscriptUpdate,
  onWhiteboardCommand,
  onStateChange,
  onError,
  onTranscriptionStatus,
  onEndSession,
  onTrackInteraction,
  onUsageUpdate,
  onDebugEvent,
  handleRef,
  validateToolCalls = false,
  claudeBrainMode = false,
  ttsProvider = 'realtime',
  onLessonPlanProgress,
  onTutorBusy,
  onPaceBiasChange,
  onBeforeTypedSubmit,
  onProposePlanSwap,
  onConfirmPlanLos,
  onCompletedSegmentsChange,
  sessionMaxMinutes = 30,
}: VoiceTutorRealtimeProps) {
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // Transient whiteboard status — e.g. "rendering problem…" when a tool
  // call gets dropped so the student sees the system is responding without
  // having to ask "I don't see anything". Cleared on next successful
  // whiteboard command or after a short timeout.
  const [whiteboardStatus, setWhiteboardStatus] = useState<string | null>(null);
  const whiteboardStatusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [instructions, setInstructions] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Persisted student preferences (humor / pacing / etc). Read from
  // localStorage synchronously, then synced from /api/tutor/student-profile
  // when studentId is present. Used to drive the humor block in the
  // system prompt so the brain reflects the student's chosen level.
  const { preferences: studentPreferences } = useStudentPreferences({ studentId });

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
  const speakTextRef = useRef<((text: string) => void) | null>(null);
  const clearSpeechQueueRef = useRef<(() => Promise<void>) | null>(null);
  // Full tutor system prompt. In claudeBrainMode the brain reads this; the
  // Realtime model gets a separate, much shorter relay-only prompt.
  const claudeSystemPromptRef = useRef<string>('');

  // Commit accumulated session events to the student profile (mastery,
  // gaps, recent-session memory + auto-generated notes). Fire-and-forget;
  // the user doesn't wait for notes generation. Safe to call multiple
  // times (the accumulator is reset after each commit so no double-
  // counting). No-op when studentId is unset (demo flow).
  const commitSessionToProfile = useCallback(async () => {
    if (!studentId) return;
    const accum = sessionAccumRef.current;
    if (accum.masteryDeltas.length === 0 && accum.gaps.length === 0 && accum.losTouched.size === 0) return;
    const transcript = transcriptRef.current
      .filter((t) => t.role === 'student' || t.role === 'tutor')
      .map((t) => ({ role: t.role as 'student' | 'tutor', text: t.text }));
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
      transcript,
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
    try {
      const res = await fetch(`/api/tutor/student-profile/${encodeURIComponent(studentId)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
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

  // Active lesson plan (when lessonPlanId prop is set). Held in refs so
  // the in-flight brain call always sees the latest segment id even if
  // it advances mid-turn via advance_lesson. Plan is fetched once at
  // mount; segment progression is tracked locally.
  const lessonPlanRef = useRef<import('@/lib/tutor/lesson-plan/types').LessonPlan | null>(null);
  const currentSegmentIdRef = useRef<string>('');
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
  useEffect(() => {
    onLessonPlanProgressRef.current?.({ plan: activePlan, currentSegmentId: activeSegmentId });
  }, [activePlan, activeSegmentId]);

  // Student profile context (when studentId prop is set). The block is
  // a pre-rendered string the brain reads on every turn. The accumulator
  // collects session events (mastery deltas from mark_segment_complete,
  // gaps from record_gap, LOs touched) and commits them at session end.
  const studentProfileBlockRef = useRef<string>('');
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
  const queuedTranscriptsRef = useRef<string[]>([]);

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
  const currentProblemRef = useRef<{ statement: string; kind: 'integral' | 'generic' } | null>(null);

  // Walk-through insistence counter for the current problem. The tutor should
  // default to Socratic; only switch to walk-through mode after the student
  // insists a second time ("no, just walk me through it", "I said show me,
  // don't ask"). Reset on new problem requests.
  const walkThroughInsistenceRef = useRef(0);

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

  // Engagement / fatigue tracking. We track the last N student reply lengths
  // and fire a diagnostic prompt when replies collapse to short monosyllables
  // ("ok", "k", "yea") — a reliable signal the student has disengaged or is
  // coasting. Also triggers a session-duration-based check-in at 45 min.
  const recentReplyLengthsRef = useRef<number[]>([]);
  const lastFatigueInjectionAtRef = useRef(0);
  const sessionStartMsRef = useRef<number>(Date.now());
  const longSessionCheckFiredRef = useRef(false);

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
  const paceBiasRef = useRef<number>(0);
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
  // Bridges callBrainOnce student-utterance bookkeeping → end-of-brain-
  // stream streak update. Captures the student utterance's
  // classification at turn-start so the post-stream code knows whether
  // to even consider streak changes. Pure-ack turns ("ok", "yeah")
  // never update the streak regardless of what the brain says next.
  const lastStudentVerificationRef = useRef<{ turn: number; segId: string; isVerification: boolean } | null>(null);
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
  const onPaceBiasChangeRef = useRef(onPaceBiasChange);
  useEffect(() => { onPaceBiasChangeRef.current = onPaceBiasChange; }, [onPaceBiasChange]);
  // Phase 4: persist pacing state to localStorage so it carries over
  // when the same lesson plan is re-launched. Keyed on plan.id;
  // session-unmount + paceBias-step both call this. No-op when no
  // plan is loaded (free-conversation).
  const persistPacingState = useCallback(() => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      const planId = lessonPlanRef.current?.id;
      if (!planId) return;
      const key = `evelyn:pacing-v2:${planId}`;
      const payload = {
        paceBias: paceBiasRef.current,
        correctStreakCount: studentStreakRef.current.count,
        incorrectStreakCount: studentIncorrectStreakRef.current.count,
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
    persistPacingState();
  }, [logPacing, persistPacingState]);

  // Flag flipped true when the tutor just emitted a show_equation with
  // label: "Final Answer". On the NEXT batch of whiteboard commands that
  // contains anything teaching-like (any show_*), we prepend a synthetic
  // newPage so the board is clear for the next example. Then we reset
  // the flag. This saves us from depending on the tutor remembering to
  // call newPage itself between examples.
  const recentlyFinishedProblemRef = useRef<string | null>(null);

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
        const classification = classifyTranscript(raw);
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
  }, [onTranscriptUpdate, onTrackInteraction, claudeBrainMode]);

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

  // Handle whiteboard commands from tool calls — validates geometry + optionally validates math via Claude
  const handleWhiteboardCommand = useCallback(async (commands: WhiteboardCommand[]): Promise<WhiteboardCommandResult> => {
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
      'newPage', 'clear', 'goToPage', 'scribble', 'scrollTo',
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
    const greetingGuardActive = !lessonPlanActive && priorStudentTurns <= 1 && isPureGreeting(lastStudentText);

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
        // Fix conic section math (focus, directrix, etc.) using exact formulas.
        const afterConic = validateConicGraph(original);
        // Drop mislabeled "intersection" points (e.g. a parabola's vertex
        // mislabeled as an intersection of two curves), and backfill real
        // intersections when we can compute them deterministically.
        const afterIntersections = validateIntersectionPoints(afterConic);
        if (afterIntersections !== original) {
          if (afterConic !== original) {
            console.log('[VoiceTutorRealtime] Conic validator fixed graph data');
          }
          if (afterIntersections !== afterConic) {
            console.log('[VoiceTutorRealtime] Intersection validator adjusted points');
          }
          return [{ ...cmd, data: afterIntersections } as WhiteboardCommand];
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

    // --- Always-on Wolfram math validation ---
    // User directive: "I want wolfram to check every math — the latency is
    // acceptable but the inaccuracy isn't." We validate every math-bearing
    // command here regardless of the legacy `validateToolCalls` flag.
    // Claude-based validation (geometry/number-line structural fixes)
    // remains gated so non-validated engines don't pay that latency twice.
    const recentContext = () => transcriptRef.current.slice(-4)
      .map(e => `${e.role === 'student' ? 'Student' : 'Tutor'}: ${e.text}`).join('\n');

    processed = await Promise.all(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      processed.map(async (cmd) => {
        // Graphs: Wolfram first, Claude fallback (only if validateToolCalls)
        if (cmd.action === 'showGraph') {
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

    // --- Track declarations + integrands + current problem for next turn ---
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const cmd of processed) {
      if (cmd.action === 'showProblem') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const p = (cmd as any).problem;
        if (p?.statement) {
          const kind: 'integral' | 'generic' = /\\int|Integral_|\bintegral\b/i.test(p.statement) ? 'integral' : 'generic';
          currentProblemRef.current = { statement: p.statement, kind };
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
          const next = resolveAdvanceTarget(plan, currentSegmentIdRef.current, to, { consumedHashes });
          if (next) {
            console.log(`[VoiceTutorRealtime] lesson advance: "${currentSegmentIdRef.current}" → "${next}"`);
            // Auto-mark "visited" segments: every segment from the
            // outgoing index (inclusive) up to the target index
            // (exclusive) is added to completedSegmentIdsRef. This
            // makes the progress strip show advancement-as-completion
            // even when the brain skipped past a segment without
            // explicitly calling mark_segment_complete on it. Without
            // this, skip-ahead clicks left the strip stuck at 0/4
            // because the brain only emits mark_segment_complete for
            // segments it taught (observed 2026-05-12 — 5 consecutive
            // skip clicks, strip frozen).
            const outgoingIdx = plan.segments.findIndex((s) => s.id === currentSegmentIdRef.current);
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
            // Mirror into the catalog so subsequent appends stamp the
            // new segment id. The brain's per-turn snapshot filter
            // uses this to scope its view to current-segment items.
            catalogRef.current.setCurrentSegment(next);
            // Auto-newPage for visual freshness: every segment
            // transition starts the student on a fresh whiteboard
            // page so they aren't scrolling through stacked content
            // from prior segments. Synthesized as a real catalog-aware
            // newPage command (uses the resolved segment's title when
            // available) so the page break shows up in the page nav.
            const nextSeg = plan.segments.find((s) => s.id === next);
            // Compute a sensible page title. For generated freestyle
            // plans the segment ids are "<loId>-hook" / "-concept" /
            // "-worked" / "-try" — derive the loId, look up its
            // description, and use that as the page heading. Falls
            // back to the segment's goal/problem/id if the id doesn't
            // match the pattern (curated plans, intro, etc.).
            let loHeading = '';
            if (next && plan.los?.length) {
              for (const lo of plan.los) {
                if (next.startsWith(`${lo.id}-`) || next === lo.id) {
                  // Kind suffix (Hook / Concept / Worked / Try) helps the
                  // student see which beat of the LO is on screen.
                  const KIND_MAP: Record<string, string> = {
                    hook: 'Hook',
                    concept: 'Concept',
                    worked: 'Worked Example',
                    try: 'Try Yourself',
                  };
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const kindLabel = KIND_MAP[(nextSeg as any)?.kind === 'worked_example' ? 'worked' : (nextSeg as any)?.kind === 'try_yourself' ? 'try' : (nextSeg as any)?.kind ?? ''];
                  loHeading = kindLabel ? `${lo.description} — ${kindLabel}` : lo.description;
                  break;
                }
              }
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const newPageTitle = loHeading || (nextSeg as any)?.goal || (nextSeg as any)?.problem || (nextSeg as any)?.question || nextSeg?.id || '';
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const newPageCmd: any = {
              action: 'newPage',
              title: typeof newPageTitle === 'string' ? newPageTitle.slice(0, 60) : '',
            };
            // Append the newPage to the running command stream so the
            // canvas page-grouping picks it up. Done OUTSIDE this
            // dispatch loop via the live commands array setter that
            // the canvas listens to.
            try {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onWhiteboardCommand?.([newPageCmd as any]);
              console.log(`[VoiceTutorRealtime] auto-newPage on segment advance → "${next}" ("${newPageCmd.title}")`);
              onDebugEvent?.('auto_newpage_on_advance', `${next}: ${newPageCmd.title}`);
            } catch (err) {
              console.warn('[VoiceTutorRealtime] auto-newPage emission failed:', err);
            }
          } else {
            console.warn(`[VoiceTutorRealtime] lesson advance failed: cannot resolve "${to}" from "${currentSegmentIdRef.current}"`);
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
        const plan = lessonPlanRef.current;
        const loId = plan?.los?.[0]?.id;
        if (loId && typeof c.masteryDelta === 'number') {
          sessionAccumRef.current.masteryDeltas.push({ loId, delta: c.masteryDelta });
          sessionAccumRef.current.losTouched.add(loId);
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

    // Auto-newPage triggers. Two reasons we'd prepend one:
    //   A) "Just-solved" — the previous batch ended with a Final Answer,
    //      and this batch is starting new teaching content.
    //   B) "Topic shift" — the student's last clean transcript was
    //      semantically far from the running signature (see
    //      topic-shift-detector.ts), so even within the same subject a
    //      fresh board makes sense.
    // Continuation guard takes precedence over BOTH — if the student's
    // last utterance was clearly a continuation ("for this", "got it
    // next", "show me the steps to find T for this"), the tutor is
    // answering a sub-question of the same problem and the fresh board
    // makes the student lose their place. (2026-04-24 vertical-spring
    // session: "Can you show me the steps to find T for this?" after
    // solving ω fired auto-newPage because ω was tagged as a Final Answer
    // in the prior batch.)
    const justSolvedPending = recentlyFinishedProblemRef.current;
    const topicShiftPending = topicShiftPendingRef.current;
    // Tutor-side same-context check also suppresses auto-newPage.
    const tutorCtxAuto = (justSolvedPending || topicShiftPending) && processed.length > 0
      ? detectTutorSameContext({
          batch: processed,
          tutorSpeech: pendingTutorTextRef.current || currentAssistantTextRef.current || '',
          catalog: catalogRef.current,
        })
      : { same: false, signals: [] as Array<'A' | 'B' | 'C' | 'D'>, decisive: false, reason: '' };
    const tutorCtxAutoStrip = tutorCtxAuto.same
      && decidePageStrip({ tutorContext: tutorCtxAuto, studentText: lastStudentText }).stripNewPage;
    if ((justSolvedPending || topicShiftPending) && processed.length > 0 && continuationGuardActive) {
      console.log('[VoiceTutorRealtime] Suppressed auto-newPage — student said a continuation:', lastStudentText.slice(0, 60));
      onDebugEvent?.('auto_new_page_suppressed_continuation', `"${lastStudentText.slice(0, 40)}…"`);
      // Clear both flags so this path doesn't fire again next batch.
      recentlyFinishedProblemRef.current = null;
      topicShiftPendingRef.current = null;
    } else if ((justSolvedPending || topicShiftPending) && processed.length > 0 && tutorCtxAutoStrip) {
      console.log('[VoiceTutorRealtime] Suppressed auto-newPage — tutor same-context:', tutorCtxAuto.reason);
      onDebugEvent?.('auto_new_page_suppressed_tutor_context', tutorCtxAuto.reason);
      recentlyFinishedProblemRef.current = null;
      topicShiftPendingRef.current = null;
    } else if ((justSolvedPending || topicShiftPending) && processed.length > 0) {
      // All show_* actions that represent "fresh teaching content" — i.e.
      // anything that should start on its own whiteboard page. Meta-
      // actions (scribble/scrollTo/newPage/clear/goToPage) and pure
      // annotations (highlight/drawVector/annotate) are excluded so they
      // don't spuriously trigger a page break.
      //
      // Must stay in sync with CommandRenderer's case list in
      // WhiteboardCanvas.tsx — new show_* renderers added there must be
      // registered here too, or auto-newPage injection silently fails
      // for them (2026-04-24 regression: showVennDiagram/showFlowchart/
      // showOrbital/showDna/showPendulum/showSimpleMachine missing).
      const teachingActions = new Set([
        // Legacy generic
        'showEquation', 'showDiagram', 'showGraph', 'showTable',
        'showProblem', 'showSolution', 'showSvgDiagram', 'showGeometry',
        'showCode', 'showDerivation',
        // Tier-1 structured renderers
        'showRayDiagram', 'showSpringMass', 'showWave', 'showFoodWeb',
        'showMotionDiagram', 'showProjectileMotion', 'showSimpleMachine',
        'showPendulum', 'showVector', 'showCoordinatePlane',
        'showScatterPlot', 'showCycleDiagram', 'showConceptMap',
        'showOrbitalDiagram', 'showPedigree', 'showCellDiagram',
        'showDna', 'showFreeBodyDiagram', 'showEnergyBars',
        'showCollision', 'showReactionCoordinate', 'showPunnett',
        'showLewis', 'showPeriodicTable', 'showAnnotatedPassage',
        'showCallStack', 'showFlowchart', 'showManipulative',
        'showNumberLine', 'showFractionBar', 'showTree',
        'showTimeline', 'showMap', 'showVennDiagram', 'showStats',
        'showUnitCircle', 'showCircuit', 'showMolecule',
      ]);
      const firstTeachingCmd = processed.find((c) => teachingActions.has(String(c.action)));
      const alreadyHasNewPage = processed[0]?.action === 'newPage';
      if (firstTeachingCmd && !alreadyHasNewPage) {
        const nextTitle =
          ('label' in firstTeachingCmd && typeof (firstTeachingCmd as { label?: string }).label === 'string' && (firstTeachingCmd as { label?: string }).label)
          || ('title' in firstTeachingCmd && typeof (firstTeachingCmd as { title?: string }).title === 'string' && (firstTeachingCmd as { title?: string }).title)
          || 'Next';
        const synthetic: WhiteboardCommand = { action: 'newPage', title: String(nextTitle) };
        processed = [synthetic, ...processed];
        const reason = justSolvedPending
          ? `After Final Answer "${justSolvedPending}" → "${nextTitle}"`
          : `After topic shift (dist=${topicShiftPending?.fromDistance.toFixed(3)}) → "${nextTitle}"`;
        console.log('[VoiceTutorRealtime] Auto-newPage injected:', reason);
        onDebugEvent?.('auto_new_page', reason);
      }
      // Either way, clear both flags so this fires at most once per event.
      recentlyFinishedProblemRef.current = null;
      topicShiftPendingRef.current = null;
    }

    // Detect Final Answer in this batch so the NEXT batch gets an auto-
    // newPage prepended. Stored as the latex text so the debug log is
    // useful; the actual trigger is a truthy check above.
    for (const cmd of processed) {
      if (
        cmd.action === 'showEquation'
        && 'label' in cmd
        && typeof cmd.label === 'string'
        && /\bfinal answer\b/i.test(cmd.label)
      ) {
        recentlyFinishedProblemRef.current = cmd.latex ? String(cmd.latex) : cmd.label;
        console.log('[VoiceTutorRealtime] Final Answer detected; next batch will get an auto-newPage');
      }
    }

    // Stamp a stable id onto every rendered whiteboard command BEFORE we
    // resolve scribble/scrollTo targets. ID format is `<action>-<counter>`
    // with a per-action counter so e.g. the second show_spring_mass becomes
    // showSpringMass-2. The counter persists across batches so IDs remain
    // stable for the entire session. Meta-commands (newPage / clear /
    // goToPage / scribble / scrollTo) do NOT get IDs — they're addressers
    // or structural markers, not addressable items themselves.
    const META_ACTIONS = new Set(['newPage', 'clear', 'goToPage', 'scribble', 'scrollTo']);
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
    for (const cmd of processed) {
      const action = String(cmd.action);
      if (action === 'newPage') {
        currentPageTitle = (cmd as { title?: string }).title;
        newPageThisBatch = true;
        newPageThisTurnRef.current = true;
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
      // Skip dedup when there's a newPage in the same batch OR earlier
      // in the same brain turn — brain explicitly wants this content on
      // a fresh page, even if it matches something on a prior page. The
      // turn-scoped guard catches the common pattern where new_page and
      // show_problem are emitted as separate tool calls in one turn.
      if (existing && !newPageThisBatch && !newPageThisTurnRef.current) {
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
      // Register in the authoritative session catalog. The catalog is the
      // single source of truth for tutor_scribble target resolution —
      // every feature the tutor may reference gets a row here.
      if (manifest && manifest.length > 0) {
        catalogRef.current.append({
          itemId: id,
          action,
          pageTitle: currentPageTitle,
          title: extractCommandTitle(cmd),
          signature,
          features: manifest,
        });
      }
    }
    // Strip duplicate-skipped commands from the render pipeline. They
    // remain in `commands` for index alignment in the duplicates[] array
    // returned to the Realtime hook.
    processed = processed.filter((c) => !droppedAsDuplicate.has(c));

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
        console.warn('[VoiceTutor] scribble-reject (silent drop): empty target');
        onDebugEvent?.('scribble_reject_empty_silent', '(no target)');
        cmdAny._scribbleRejected = true;
        continue;
      }
      const result = catalogRef.current.resolveTarget(raw);
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
        const isWholeItemAlias = result.canonical === result.itemId;
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
      const located = resolveTargetFromId(result.itemId);
      if (located) {
        cmdAny.targetItemIndex = located.itemIndex;
        cmdAny.targetPageIndex = located.pageIndex;
        if (located.pageTitle) cmdAny.targetPageTitle = located.pageTitle;
      }
      console.log(
        '[VoiceTutor] scribble-resolved: target="%s" → %s/%s (item %d, page %d)',
        raw, result.itemId, result.canonical,
        located?.itemIndex ?? -1, located?.pageIndex ?? -1,
      );
    }
    // Strip any scribbles we pushed rejections for — they get surfaced to
    // the tutor as tool_result errors, NOT rendered on the board.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    processed = processed.filter((c) => !(c as any)._scribbleRejected);

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
    const pagesAlreadyNavigatedThisBatch = new Set<string>();
    // Also track page-index navigations so the untitled implicit first
    // page ("page 0") doesn't get a duplicate scrollTo injected for
    // each successive scribble that targets it.
    const pageIndicesAlreadyNavigatedThisBatch = new Set<number>();
    // Emit either a pageTitle- or pageIndex-keyed scrollTo depending on
    // what the resolver returned. Titled pages use the title (robust
    // against page reordering); the untitled first page uses pageIndex=0.
    const pushPageScrollTo = (pageTitle: string | undefined, pageIndex: number) => {
      if (pageTitle) {
        if (pagesAlreadyNavigatedThisBatch.has(pageTitle)) return;
        withAutoScrolls.push({ action: 'scrollTo', target: 'page', pageTitle });
        pagesAlreadyNavigatedThisBatch.add(pageTitle);
      } else {
        if (pageIndicesAlreadyNavigatedThisBatch.has(pageIndex)) return;
        withAutoScrolls.push({ action: 'scrollTo', target: 'page', pageIndex });
        pageIndicesAlreadyNavigatedThisBatch.add(pageIndex);
      }
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
        const result = catalogRef.current.resolveTarget(raw);
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
              pushPageScrollTo(pageMatch.pageTitle, located.pageIndex);
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
          pushPageScrollTo(located.pageTitle, located.pageIndex);
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
            targetId: result.itemId,
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
        if (typeof effectivePageIndex === 'number') {
          pushPageScrollTo(effectivePageTitle, effectivePageIndex);
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

    onWhiteboardCommand(processed);
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
    return { rejected, assignedIds, manifests, duplicates, boardSnapshot };
  }, [onWhiteboardCommand, onTranscriptUpdate, onTrackInteraction, validateToolCalls, validateToolCallViaClaude, onDebugEvent]);

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
    const bulldozing = insistence < 2 && turnEqs.length >= 3 && computedAnswers.length >= 1;
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
  ]);

  // Handle errors
  const handleError = useCallback((error: Error) => {
    // Non-fatal warnings (e.g. MicSilentWarning) — record as a debug event
    // for the replay timeline but don't show the red error banner or bubble
    // up to the parent's onError (which may end the session).
    if (error.name && error.name.endsWith('Warning')) {
      console.warn('[VoiceTutorRealtime] Warning:', error);
      onDebugEvent?.(error.name, error.message);
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
      } catch (err) {
        console.warn('[VoiceTutorRealtime] student profile fetch failed:', err);
      }
    })();
    return () => { cancelled = true; };
  }, [studentId]);

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
                correctStreakCount?: number;
                incorrectStreakCount?: number;
                savedAt?: string;
              };
              const ageMs = prior.savedAt ? Date.now() - new Date(prior.savedAt).getTime() : Infinity;
              const TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
              if (ageMs <= TTL_MS) {
                if (typeof prior.paceBias === 'number' && prior.paceBias !== 0) {
                  paceBiasRef.current = Math.max(-2, Math.min(2, Math.round(prior.paceBias)));
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
                logPacing(`resumed-from-prior-session bias=${paceBiasRef.current} correctStreak=${studentStreakRef.current.count} incorrectStreak=${studentIncorrectStreakRef.current.count} ageDays=${(ageMs / (24 * 60 * 60 * 1000)).toFixed(1)} planId="${plan.id}"`);
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
  // Inner brain-call worker — does the actual fetch + dispatch. Pulled out
  // so the outer wrapper can serialize calls and process queued transcripts
  // without duplicating the body.
  const callBrainOnce = useCallback(async (transcript: string, opts?: { silent?: boolean }) => {
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

      // Round-7++++ Fix Issue 4: detect topic-switch student utterances
      // and clear currentSegmentIdRef so subsequent turns run in
      // free-conversation mode. Otherwise the segment cursor stays
      // pinned to the prior concept's last segment (e.g., "try-mean-2")
      // while the brain teaches the new concept (mode/median),
      // creating drift where the brain's lessonPlanContext describes
      // a stale segment. Triggers on explicit switch language:
      // "switch to X", "move to X", "let's do X", "let's try X",
      // "go to X", "do X now". Generic — works for any concept.
      const topicSwitchRe = /\b(?:switch(?:ing)?\s+to|move\s+(?:to|on\s+to|onto)|let'?s\s+(?:do|try|move\s+to|go\s+to|switch\s+to)|now\s+(?:do|try|let'?s)|go\s+to|head(?:ing)?\s+(?:to|over\s+to))\s+(?:the\s+)?(?:concept\s+of\s+)?\w+/i;
      if (topicSwitchRe.test(transcript) && currentSegmentIdRef.current) {
        console.log(`[brain-orchestrator] topic-switch detected ("${transcript.slice(0, 60)}…") — clearing currentSegmentIdRef from "${currentSegmentIdRef.current}" to free-conversation`);
        onDebugEvent?.('topic_switch_segment_cleared', `was="${currentSegmentIdRef.current}"`);
        currentSegmentIdRef.current = '';
        setActiveSegmentId('');
      }

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
        const isVerification = !isPureAck && !isHelpRequest && t.length >= 3 && (hasDigits || hasMathLang || wordCount >= 6);
        lastStudentVerificationRef.current = {
          turn: pacingTurnCounterRef.current,
          segId: segIdNow,
          isVerification,
        };
        // Streak segId-retag policy (revised post-2026-05-05 session
        // analysis). Streak tracks CONCEPT mastery across consecutive
        // segments testing the same skill, not within a single segment.
        // Reset cases:
        //   (a) topic-switch detected — segIdNow === '' (set above by
        //       topicSwitchRe handler clearing currentSegmentIdRef);
        //       this is the only "concept changed" signal at the
        //       segment-tracking layer.
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
        const hasButtonMarker = /\[(Skip-button-clicked|I'?m-stuck-button-clicked)/i.test(t);
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
      let runHistory = priorHistory;
      let runTranscript = transcript;
      let firstSentenceMs: number | null = null;
      let totalSentenceCount = 0;
      // Number of sentences actually dispatched to TTS this turn. Tracks
      // a strict subset of totalSentenceCount — sentences buffered in the
      // gate then dropped on rejection are counted in totalSentenceCount
      // but NOT here. Used by speakKillBridge to skip the bridge phrase
      // when no audible speech has happened yet (otherwise the bridge
      // becomes the first thing the student hears, which sounds wrong).
      let audibleSentenceCount = 0;
      let totalToolNamesSeen: string[] = [];
      let aggregatedFullText = '';
      let lastStopReason = 'unknown';
      let lastUsage: { inputTokens?: number; outputTokens?: number; cacheReadTokens?: number; cacheCreationTokens?: number } | undefined;
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
        }
        // Compose lesson plan context from the active plan + current
        // segment id (both ref-tracked so segment advances mid-turn are
        // picked up on the next call). Free-conversation sessions omit
        // this — `lessonPlanRef.current` is null.
        const plan = lessonPlanRef.current;
        const lessonPlanContext = plan && currentSegmentIdRef.current
          ? buildLessonPlanContext(plan, currentSegmentIdRef.current, [...completedSegmentIdsRef.current])
          : undefined;

        const res = await fetch('/api/tutor/brain/stream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemPrompt: claudeSystemPromptRef.current,
            conversationHistory: runHistory,
            studentTranscript: runTranscript,
            whiteboardSnapshot: catalogRef.current.getSnapshot(segmentSnapshotOpts),
            lessonPlanContext,
            studentProfileBlock: studentProfileBlockRef.current || undefined,
            grade: level,
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
              ? { statement: currentProblemRef.current.statement }
              : undefined,
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
        });
        pacingTelemetryRef.current = [];
        if (!res.ok || !res.body) {
          const err = res.body ? await res.text() : '(no body)';
          console.error('[brain-orchestrator] /api/tutor/brain/stream failed:', res.status, err);
          speakTextRef.current?.('Sorry, I lost my train of thought. Could you say that again?');
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buf = '';
        const toolNamesThisAttempt: string[] = [];
        const toolArgsThisAttempt: Array<Record<string, unknown>> = [];
        const rejectionsThisAttempt: Array<{ action: string; reason: string }> = [];
        let attemptText = '';
        // Once a tool call in this attempt is rejected, the attempt is
        // doomed and we'll retry. Stop voicing further sentences from
        // this attempt (otherwise the student hears both the bad voice-
        // over and the corrected one). Tool calls keep dispatching so
        // we collect ALL rejections in one pass for the retry message.
        let attemptKilled = false;

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
        const flushPending = () => {
          for (const s of pendingSentences) {
            speakTextRef.current?.(s);
            audibleSentenceCount++;
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
          gateState = 'closed';
          pendingSentences.length = 0;
        };
        const gateTimer = setTimeout(openGate, 1000);

        try {
          while (true) {
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
                  const selfCorrectionRe = /\b(?:wait,?\s+actually|actually,?\s+(?:i was wrong|i['’]m wrong|never mind)|let me re-?(?:check|verify|consider|examine)|my mistake|my apologies|sorry,?\s+i (?:was|['’]m) wrong|i (?:was|['’]m) wrong|never mind\s+(?:that|what i)|scratch that|hold on,?\s+i (?:was|['’]m) wrong)/i;
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
                  if (!attemptKilled && attempt === 0 && judgeRetriesUsed < MAX_JUDGE_RETRIES && selfCorrectionRe.test(updatedSentence)) {
                    const reason =
                      `You started self-correcting mid-turn ("${updatedSentence.slice(0, 120)}"). ` +
                      `That's confusing for the student to hear. Re-emit your response cleanly: ` +
                      `recompute the answer first, then speak ONLY the correct version. ` +
                      `Do not narrate your own confusion or backtrack out loud.`;
                    rejectionsThisAttempt.push({ action: 'mid_turn_self_correction', reason });
                    judgeRetriesUsed++;
                    attemptKilled = true;
                    clearTimeout(gateTimer);
                    closeGate();
                    await speakKillBridge();
                    console.warn('[brain-orchestrator] mid-turn self-correction detected — retrying:', updatedSentence.slice(0, 80));
                    onDebugEvent?.('self_correction_retry', updatedSentence.slice(0, 80));
                    continue;
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
                    attemptKilled = true;
                    clearTimeout(gateTimer);
                    closeGate();
                    await speakKillBridge();
                    console.warn('[brain-orchestrator] contradiction-inversion detected — retrying:', updatedSentence.slice(0, 80));
                    onDebugEvent?.('contradiction_inversion_retry', updatedSentence.slice(0, 80));
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
                  if (wordCount >= 4 && sentencesSpokenThisTurn.has(dedupNorm)) {
                    console.log('[brain-orchestrator] dropped duplicate sentence:', JSON.stringify(updatedSentence.slice(0, 80)));
                    onDebugEvent?.('duplicate_sentence_dropped', updatedSentence.slice(0, 80));
                    continue;
                  }
                  if (wordCount >= 4) sentencesSpokenThisTurn.add(dedupNorm);
                  totalSentenceCount++;
                  if (firstSentenceMs === null) firstSentenceMs = Date.now() - t0;
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
                    .replace(/\s--+\s/g, ', ');
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
                    if (gateState === 'gated') {
                      pendingSentences.push(sentenceForSpeech);
                    } else if (gateState === 'open') {
                      speakTextRef.current?.(sentenceForSpeech);
                      audibleSentenceCount++;
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
                      { ...existing, text: attemptText, streaming: true },
                      ...transcriptRef.current.slice(existingIdx + 1),
                    ];
                  } else {
                    transcriptRef.current = [
                      ...transcriptRef.current,
                      {
                        id: streamingId,
                        timestamp: new Date(),
                        role: 'tutor',
                        text: attemptText,
                        streaming: true,
                      } as TranscriptEntry,
                    ];
                    // Signal that a streaming bubble is now visible so
                    // the typing indicator can hide itself.
                    setStreamingEntryActive(true);
                  }
                  onTranscriptUpdate([...transcriptRef.current]);
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
                  toolNamesThisAttempt.push(name);
                  toolArgsThisAttempt.push(args);
                  totalToolNamesSeen.push(name);
                  // Mark brain-emitted new_page on event ARRIVAL (before
                  // any downstream stripping by the same-context guard).
                  // Used by the divergence guard + silent-substitute
                  // bypass to recognize topic-switch intent even when
                  // the new_page command never reaches the renderer.
                  if (name === 'new_page') {
                    brainEmittedNewPageThisTurnRef.current = true;
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
                        if (divergent && newPageInTurn) {
                          console.log(`[brain-orchestrator] show_worked_example divergence on "${segId}" — but new_page in turn (fresh context); bypassing substitute. brain="${[...brainNums].slice(0, 4).join(',')}" authored="${[...authoredNums].slice(0, 4).join(',')}"`);
                          onDebugEvent?.('show_worked_example_divergence_bypass', `new_page-in-turn; brain="${[...brainNums].slice(0, 3).join(',')}" authored="${[...authoredNums].slice(0, 3).join(',')}"`);
                          // Fall through — dispatch the brain's free-form
                          // worked example as-is. Do NOT substitute (the
                          // authored card is the wrong one for this turn).
                        } else if (divergent) {
                          console.warn(`[brain-orchestrator] show_worked_example payload diverges from authored worked_example for segment "${segId}". brain numbers="${[...brainNums].slice(0, 5).join(',')}", authored numbers="${[...authoredNums].slice(0, 5).join(',')}". Killing attempt for retry.`);
                          onDebugEvent?.('show_worked_example_divergence', `segId="${segId}" brain="${[...brainNums].slice(0, 3).join(',')}" authored="${[...authoredNums].slice(0, 3).join(',')}"`);
                          rejectionsThisAttempt.push({
                            action: 'show_worked_example',
                            reason: `Your show_worked_example payload describes a DIFFERENT scenario than the authored worked_example for segment "${segId}". Your example uses numbers [${[...brainNums].slice(0, 6).join(', ')}], but the authored problem uses [${[...authoredNums].slice(0, 6).join(', ')}]. The student would hear you walk through your invented example while seeing the authored card on the whiteboard — a chat-board mismatch. You have TWO recovery paths depending on intent: (A) IF you intended to walk through the AUTHORED worked example for the current segment: call show_segment_card({ segmentId: "${segId}" }) and narrate the authored steps verbatim. The authored problem is: "${truth.problemText.slice(0, 200)}". (B) IF you intended a TOPIC SWITCH (a NEW worked example unrelated to the current segment, e.g. student asked "show me another example"): emit BOTH new_page AND show_worked_example in the same response — the runtime treats new_page-in-turn as a fresh-context signal and lets your free-form worked example render. Make sure your spoken narration matches the example you're rendering. Pick path (A) or (B) based on what the student actually asked for.`,
                          });
                          if (!attemptKilled) {
                            attemptKilled = true;
                            clearTimeout(gateTimer);
                            closeGate();
                            await speakKillBridge();
                          }
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
                        } else if (targetsDiverge && newPageInTurn) {
                          console.log(`[brain-orchestrator] show_problem target divergence for segment "${segId}" — but new_page in same turn (fresh context); bypassing guard. brain="${brainTarget}" authored="${authoredTarget}"`);
                          onDebugEvent?.('show_problem_target_divergence_bypass', `new_page-in-batch; brain="${brainTarget}" authored="${authoredTarget}"`);
                          // Don't substitute either — the brain is
                          // intentionally rendering OFF-segment, and
                          // showing the authored card would be wrong.
                          // Fall through to dispatch show_problem with the
                          // brain's free-form statement as-is.
                        } else if (targetsDiverge) {
                          console.warn(`[brain-orchestrator] show_problem query-target divergence for segment "${segId}": brain asks for "${brainTarget}", authored asks for "${authoredTarget}". Killing attempt for retry.`);
                          onDebugEvent?.('show_problem_target_divergence', `brain="${brainTarget}" authored="${authoredTarget}" segId="${segId}"`);
                          rejectionsThisAttempt.push({
                            action: 'show_problem',
                            reason: `Your show_problem asked the student to find "${brainTarget}", but the authored ${truth.kind} for segment "${segId}" asks for "${authoredTarget}". This causes a chat-board mismatch where the student hears one question but sees another. You have TWO recovery paths depending on intent: (A) IF you intended to render the AUTHORED problem for the current segment: call show_segment_card({ segmentId: "${segId}" }) instead, and ensure your spoken narration is about finding "${authoredTarget}". The authored problem is: "${truth.problemText.slice(0, 200)}". (B) IF you intended a TOPIC SWITCH (new concept, e.g. switching mean → median at the student's request): emit BOTH new_page AND show_problem in the same response — the runtime treats new_page-in-turn as a fresh-context signal and lets your free-form show_problem render. Make sure your show_problem statement is well-formed and your narration matches the new target ("${brainTarget}"). Pick path (A) or (B) based on what the student actually asked for.`,
                          });
                          if (!attemptKilled) {
                            attemptKilled = true;
                            clearTimeout(gateTimer);
                            closeGate();
                            await speakKillBridge();
                          }
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
                        if (!attemptKilled) {
                          attemptKilled = true;
                          clearTimeout(gateTimer);
                          closeGate();
                          await speakKillBridge();
                        }
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
                        if (!attemptKilled) {
                          attemptKilled = true;
                          clearTimeout(gateTimer);
                          closeGate();
                          await speakKillBridge();
                        }
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
                            statement: truth.problemText,
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
                              statement: body,
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
                        rejectionsThisAttempt.push({
                          action: 'show_diagram',
                          reason: `Your show_diagram call (type="${diagType}") failed structural validation: ${msg}. Re-emit show_diagram with corrected params that satisfy the schema for kind "${diagType}". If you can't produce valid params for this diagram kind, fall back to show_table for tabular comparisons, show_equation for formulas, or describe the idea verbally without a render.`,
                        });
                        continue;
                      }
                    }
                  }
                  const cmd = resolvedCmd ?? mapFunctionCallToCommand(name, args);
                  if (cmd) {
                    const result = await handleWhiteboardCommand([cmd]);
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
                      if (!attemptKilled) {
                        attemptKilled = true;
                        clearTimeout(gateTimer);
                        closeGate();
                        await speakKillBridge();
                      }
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
                      if (!attemptKilled) {
                        attemptKilled = true;
                        clearTimeout(gateTimer);
                        closeGate();
                        await speakKillBridge();
                      }
                    } else if (gateState === 'gated') {
                      // Clean tool dispatch — open the gate and flush any
                      // sentences we held back while waiting for this
                      // verdict. Subsequent tools fall through (gate is
                      // already 'open'); subsequent rejections still kill
                      // this attempt as before.
                      clearTimeout(gateTimer);
                      openGate();
                    }
                  } else {
                    console.warn('[brain-orchestrator] unmapped tool call:', name);
                  }
                } else if (ev.type === 'done') {
                  lastStopReason = (ev.stopReason as string) ?? 'unknown';
                  attemptText = ((ev.fullText as string) ?? attemptText).trim();
                  lastUsage = ev.usage as typeof lastUsage;
                }
              }
            }
          }
        } finally {
          try { reader.releaseLock(); } catch { /* already released */ }
        }

        // Stream is fully drained. Stop the 1s gate timer (no longer
        // needed) and flush any sentences still gated. This covers fast
        // text-only turns that finished before the timer fired and any
        // stream that ended without a tool ever resolving the gate.
        // No-op when the gate already opened or closed.
        clearTimeout(gateTimer);
        openGate();

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
          attemptKilled = true;
          clearTimeout(gateTimer);
          closeGate();
          await speakKillBridge();
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
          const lastStudentMsgForSkip = transcriptRef.current
            .filter((e) => e.role === 'student')
            .slice(-1)[0]?.text || '';
          const skipMarkerPresent = /\[Skip-button-clicked/i.test(lastStudentMsgForSkip);
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
            attemptKilled = true;
            clearTimeout(gateTimer);
            closeGate();
            await speakKillBridge();
            console.warn('[brain-orchestrator] Skip-button KILL: student clicked Skip but brain emitted no advance_lesson / generate_problem this turn.');
            onDebugEvent?.('skip_button_no_advance', `tools=[${emittedToolsList}]`);
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
            const isSnapshotRace =
              showToolsEmitted > 0 &&
              (boardSummary === '(whiteboard is empty)' || !summaryReflectsNewTools);
            if (isSnapshotRace) {
              const reason =
                boardSummary === '(whiteboard is empty)'
                  ? 'empty snapshot'
                  : `stale snapshot — ${titlesEmitted.length} new tool title(s) not yet in summary`;
              console.warn(`[judge] skip — ${reason}; ${showToolsEmitted} show_* tool(s) just emitted. Letting speech through.`);
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
            const judgeRes = await fetch('/api/tutor/judge', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ boardSummary, spokenText: attemptText, focus }),
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
                if (advisoryIssues.length > 0) {
                  console.warn(`[brain-orchestrator] judge ADVISORY (no kill) — ${advisoryIssues.length} flagged claim(s):`,
                    advisoryIssues.map((i) => i.claim.slice(0, 80)));
                  onDebugEvent?.('judge_advisory_flag', `${advisoryIssues.length} issue(s): ${advisoryIssues[0].claim.slice(0, 60)}…`);
                }
                if (killIssues.length > 0) {
                  const summary = killIssues.map((i, idx) =>
                    `(${idx + 1}) Claim: "${i.claim.slice(0, 120)}" — ${i.why.slice(0, 200)}`
                  ).join(' ');
                  console.warn(`[brain-orchestrator] judge KILL — ${killIssues.length} board-contradiction claim(s):`, summary);
                  onDebugEvent?.('judge_kill', `${killIssues.length}: ${killIssues[0].claim.slice(0, 60)}…`);
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
                  const activeStatement = currentProblemRef.current?.statement?.slice(0, 200) ?? '(no active problem tracked)';
                  const reason = isReassertion
                    ? `STOP — you have just retried the SAME contradictory claim ${priorJudgeKillClaimsThisTurn.length + 1} times in a row. The judge keeps killing your speech because you keep re-asserting numbers / dataset literals / labels that are NOT on the active card. Latest issues: ${summary}. The active problem the student is looking at is: "${activeStatement}". HARD RESET: read the <active_problem> block + <whiteboard_state> snapshot LITERALLY token-by-token, and re-derive your next sentence from THAT content alone. Discard everything you've said earlier in this turn — your prior reasoning chain has anchored on stale context. If the active card's content does not match what you intended to teach, emit new_page + show_problem FIRST to reset the board, then narrate against the new card. Do NOT repeat the previous claim.`
                    : `The judge detected your spoken claim(s) directly contradict what's on the whiteboard — the student would experience an obvious chat-board mismatch. Issues: ${summary}. RETRY: re-derive your statement from the actual content of the active board card(s); do NOT reference numeric values, dataset literals, or labels that don't appear on the board. If the board content is correct and your reasoning needs different content, emit a new render tool (show_problem / show_equation / new_page) FIRST so the board reflects what you're about to say, then narrate.`;
                  if (isReassertion) {
                    console.warn(`[brain-orchestrator] judge KILL — ESCALATED (re-assertion loop, attempt ${priorJudgeKillClaimsThisTurn.length + 1}, overlap=${overlap})`);
                    onDebugEvent?.('judge_kill_escalated', `attempt=${priorJudgeKillClaimsThisTurn.length + 1} overlap=${overlap}`);
                  }
                  for (const i of killIssues) priorJudgeKillClaimsThisTurn.push(i.claim);
                  rejectionsThisAttempt.push({ action: 'judge', reason });
                  if (!attemptKilled) {
                    attemptKilled = true;
                    clearTimeout(gateTimer);
                    closeGate();
                    await speakKillBridge();
                  }
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

        // Only the WINNING attempt's text goes into aggregatedFullText
        // (which becomes the tutor turn in transcriptRef + the brain's
        // memory of "what I said"). Killed attempts are dropped — the
        // student didn't hear them and Claude shouldn't pretend it did.
        if (!attemptKilled) {
          aggregatedFullText = aggregatedFullText
            ? `${aggregatedFullText} ${attemptText}`
            : attemptText;
        }

        // No rejections OR we've burned the retry budget → done with this turn.
        if (rejectionsThisAttempt.length === 0 || attempt === MAX_VALIDATOR_RETRIES) {
          if (rejectionsThisAttempt.length > 0) {
            console.warn(
              `[brain-orchestrator] hit MAX_VALIDATOR_RETRIES with ${rejectionsThisAttempt.length} rejection(s); giving up.`,
            );
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
          ? `Your spoken text from the prior attempt was CUT OFF by a kill bridge, so the student heard only a partial version. Re-deliver the spoken portion in full so they get a complete narration. If you asked a question, re-ask it and wait; do not answer it yourself or skip ahead.`
          : `Your spoken text from the prior attempt was DELIVERED IN FULL to the student. Do NOT repeat the same narration — the student already heard it. In this turn, focus on emitting the corrected tool call(s) and speak only a brief connector (≤ one short sentence) if speech is needed at all. If you asked a question on the prior attempt and the student hasn't answered yet, just wait; do not re-ask.`;
        runTranscript =
          `[validator feedback — not from the student] Your last turn emitted ` +
          `tool call(s) that the runtime structural validator rejected:\n${summarizedRejections}\n` +
          `Re-emit the corrected tool call(s). Don't apologize; the student doesn't see this message. ` +
          speechDeliveryNote;
        // Remove the killed attempt's streaming entry from the chat
        // before the next attempt creates a fresh one. Without this,
        // the user would see the killed text remain alongside the new
        // attempt's text — and even with attempt-suffixed ids, the
        // killed entry is no longer the canonical "what the tutor
        // said" so it shouldn't linger in the transcript.
        const killedStreamingId = `tutor-streaming-${t0}-${attempt}`;
        const beforeLen = transcriptRef.current.length;
        transcriptRef.current = transcriptRef.current.filter((e) => e.id !== killedStreamingId);
        if (transcriptRef.current.length !== beforeLen) {
          onTranscriptUpdate([...transcriptRef.current]);
        }
      }

      const ms = Date.now() - t0;
      const fullText = aggregatedFullText.trim();
      console.log(
        `[brain-orchestrator] turn ok in ${ms}ms · ${totalToolNamesSeen.length} tool call(s) · ${totalSentenceCount} sentence(s) · ` +
        `first_sentence=${firstSentenceMs}ms · text="${fullText.slice(0, 80)}${fullText.length > 80 ? '…' : ''}" · ` +
        `tools=[${totalToolNamesSeen.join(', ')}] · stop=${lastStopReason} · ` +
        `in=${lastUsage?.inputTokens} out=${lastUsage?.outputTokens} cache_read=${lastUsage?.cacheReadTokens}`,
      );
      onDebugEvent?.('brain_turn', `Brain ${ms}ms · ${totalToolNamesSeen.length} tool call(s) · ${totalSentenceCount} sentence(s) · first_sentence=${firstSentenceMs}ms`);

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
            if (studentIncorrectStreakRef.current.segId === ver.segId
                && studentIncorrectStreakRef.current.count > 0) {
              studentIncorrectStreakRef.current = { segId: ver.segId, count: 0 };
            }
            logPacing(`streak-correct seg="${ver.segId}" count=${studentStreakRef.current.count}`);
            onDebugEvent?.('pacing_streak', `correct=${studentStreakRef.current.count}`);
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

      // Empty-turn fallback. Brain produced neither text nor tool calls.
      if (!fullText.trim() && totalToolNamesSeen.length === 0) {
        console.warn('[brain-orchestrator] brain returned empty stream — speaking fallback');
        speakTextRef.current?.('Sorry, could you say that again?');
        return;
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
      console.error('[brain-orchestrator] error:', err);
      onDebugEvent?.('brain_turn', `Brain failed: ${err instanceof Error ? err.message : String(err)}`);
      speakTextRef.current?.('Hmm, give me a moment — could you repeat that?');
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
  }, [handleWhiteboardCommand, onDebugEvent, onTranscriptUpdate, onTrackInteraction]);

  // Serialized entry point used by the relay-mode hook. Ensures only one
  // brain call is in flight at a time. Utterances arriving during an
  // in-flight call are queued, then combined and sent as a single
  // follow-up call once the current call finishes. Combining (rather
  // than serialing each individually) is what the user actually
  // expects: if they say "draw the perpendicular" then "now find the
  // area", they want one coherent response, not two responses where
  // the first is interrupted by the second.
  const handleStudentTranscriptForBrain = useCallback(async (transcript: string, opts?: { silent?: boolean }) => {
    console.log('[brain-orchestrator] turn start, transcript:', JSON.stringify(transcript).slice(0, 120));
    if (brainBusyRef.current) {
      console.log('[brain-orchestrator] queued (brain busy):', JSON.stringify(transcript).slice(0, 80));
      queuedTranscriptsRef.current.push(transcript);
      return;
    }
    brainBusyRef.current = true;
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
        brainBusyRef.current = false;
        queuedTranscriptsRef.current = [];
        onDebugEvent?.('brain_watchdog_reset', '90s timeout');
      }
    }, 90_000);
    try {
      await callBrainOnce(transcript, opts);
      // Drain the queue. If multiple utterances arrived while we were
      // processing, combine them into one transcript so Claude sees a
      // single follow-up question rather than a stale chain.
      while (queuedTranscriptsRef.current.length > 0) {
        const combined = queuedTranscriptsRef.current.splice(0).join(' ');
        console.log('[brain-orchestrator] processing queued combined:', JSON.stringify(combined).slice(0, 100));
        await callBrainOnce(combined);
      }
    } finally {
      clearTimeout(watchdog);
      brainBusyRef.current = false;
    }
  }, [callBrainOnce, onDebugEvent]);

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

  // Initialize the realtime connection
  const realtime = useOpenAIRealtime({
    instructions,
    voice,
    vadThreshold,
    vadSilenceDurationMs,
    vadPrefixPaddingMs,
    relayMode: claudeBrainMode
      ? {
          instructions: RELAY_MODE_PROMPT,
          onUserTranscript: handleStudentTranscriptForBrain,
          ttsProvider,
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
  });

  // Wire up refs so callbacks can access hook functions
  injectContextRef.current = realtime.injectContext;
  sendTextMessageRef.current = realtime.sendTextMessage;
  speakTextRef.current = realtime.speakText;
  clearSpeechQueueRef.current = realtime.clearSpeechQueue;

  // Expose sendTextMessage + session summary to parent via handleRef.
  useEffect(() => {
    if (handleRef) {
      handleRef.current = {
        sendTextMessage: (text: string) => realtime.sendTextMessage(text),
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
      };
    }
    return () => {
      if (handleRef) handleRef.current = null;
    };
  }, [handleRef, realtime, stepPaceBias]);

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
  }, [subject, topic, level, studentName, sessionGoal, studentPreferences]);

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

  // Toggle listening
  const handleMicClick = useCallback(() => {
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
        setHasStarted(true);
        // Immediate visual feedback while the brain composes its first turn.
        setIsWarmingUp(true);
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
          console.log('[VoiceTutorRealtime] claude-brain: kicking off lesson plan via brain.');
          handleStudentTranscriptForBrain('[start lesson]', { silent: true });
        } else {
          // Free-conversation mode: also kick the brain so it greets
          // first instead of leaving the student staring at "preparing
          // your tutor" until they type or speak. Without this nudge the
          // UI stays in isWarmingUp until the first student utterance,
          // which felt stuck (observed 2026-04-29 algebra-2 session
          // where the student had to type "teach me anything" to break
          // out of the preparing state).
          console.log('[VoiceTutorRealtime] claude-brain: free-conversation, kicking brain to greet first.');
          handleStudentTranscriptForBrain('[start session]', { silent: true });
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
  }, [realtime, sessionGoal, topic, hasStarted, isMicMuted, claudeBrainMode, handleStudentTranscriptForBrain]);

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

  // Toggle mute student mic — uses muteInput to clear buffer without triggering a response
  const toggleMicMute = useCallback(() => {
    setIsMicMuted((prev) => {
      const newMuted = !prev;
      if (newMuted) {
        realtime.muteInput();
        console.log('[VoiceTutorRealtime] Student mic muted (buffer cleared)');
        onDebugEvent?.('mic_mute', 'Student muted mic');
      } else {
        // On unmute, reset any stale orchestrator flags. A pending
        // brain call from before a mute can leave brainBusyRef=true; if
        // the orchestrator's promise threw without finalizing (network
        // hiccup, aborted fetch), subsequent turns get queued forever
        // and the UI shows "thinking" indefinitely.
        if (brainBusyRef.current) {
          console.log('[VoiceTutorRealtime] Unmute: clearing stale brain-busy flag');
          brainBusyRef.current = false;
          queuedTranscriptsRef.current = [];
        }
        realtime.startListening();
        console.log('[VoiceTutorRealtime] Student mic unmuted');
        onDebugEvent?.('mic_unmute', 'Student unmuted mic');
      }
      return newMuted;
    });
  }, [realtime, onDebugEvent]);

  // Handle user's "continue" choice on the 55-min rotation prompt. We
  // disconnect the current session and immediately reconnect; on fresh
  // connection, injectContext fires with a summary of what we covered.
  const handleContinueRotation = useCallback(async () => {
    setSessionRotationPrompt(false);
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
  }, [realtime, buildContextSummary]);

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
  // Also exit warm-up when the first tutor turn lands.
  useEffect(() => {
    if (!isWarmingUp) return;
    const hasTutorTurn = transcriptRef.current.some((t) => t.role === 'tutor' && t.text.trim());
    if (hasTutorTurn) setIsWarmingUp(false);
  });

  const baseStateUI = getStateUI();
  const stateUI = isWarmingUp
    ? {
        icon: <Loader2 className="w-5 h-5 animate-spin" />,
        text: 'Starting…',
        subtext: 'preparing your tutor',
        color: 'bg-yellow-500',
        pulse: false,
      }
    : baseStateUI;
  const isDisabled = realtime.state === 'connecting' || realtime.state === 'processing' || isWarmingUp;

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

  return (
    <div className="voice-tutor-realtime flex items-center gap-2 sm:gap-3 py-2 px-2 flex-wrap">
      {/* Connection indicator — hide on mobile to save horizontal room */}
      <div className={`hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
        realtime.isConnected ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
      }`}>
        {realtime.isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
        {realtime.isConnected ? 'Live' : 'Off'}
      </div>

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

          {/* Main mic button */}
          <button
            onClick={handleMicClick}
            disabled={isDisabled}
            className={`
              relative w-12 h-12 rounded-full text-white flex-shrink-0
              transition-all duration-200 flex items-center justify-center
              ${stateUI.color}
              ${isDisabled ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
              ${stateUI.pulse ? 'animate-pulse' : ''}
            `}
          >
            {stateUI.icon}
          </button>

          {/* State text — hidden on mobile to free room for the input.
              The mic button itself + its color/pulse already convey state. */}
          <div className="hidden md:block min-w-0">
            <p className="text-sm font-medium text-gray-700 truncate">{stateUI.text}</p>
            {stateUI.subtext && (
              <p className="text-xs text-gray-500 truncate">{stateUI.subtext}</p>
            )}
          </div>
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

      {/* Text input — for when the student can't speak. On mobile the
          input wraps to its own row (full width); on desktop it shares
          the row with the mic + status. */}
      <form
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
              brainBusyRef.current = false;
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
            // Send to AI. input.value was already cleared at the top of
            // this handler before the plan-from-text await so the box
            // empties immediately on submit, not at end of flow.
            realtime.sendTextMessage(text);
          }
        }}
      >
        <input
          name="studentText"
          type="text"
          placeholder="Type here if you can't speak..."
          // 16px font-size on mobile — anything smaller triggers iOS Safari's
          // auto-zoom on focus, which makes the entire page appear zoomed in
          // and pushes the send button off-screen. text-base = 16px.
          className="flex-1 min-w-0 text-base sm:text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
          disabled={!realtime.isConnected}
          onFocus={() => {
            // Mute mic while typing to prevent it picking up speech
            if (!isMicMuted && realtime.isConnected) {
              realtime.muteInput();
            }
          }}
          onBlur={() => {
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
        {!isPaused && (
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

        {onEndSession && (
          <button
            onClick={async () => {
              // Instant end — no recap delay, no spinner. Finalize
              // recording and commit profile in the background; the
              // student sees the summary page immediately.
              if (audioRecordEnabled) {
                try { await audioRecorder.finalize(); } catch {}
              }
              void commitSessionToProfile();
              onEndSession();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors"
          >
            {false ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span className="hidden sm:inline">Wrapping up… (click to finish)</span>
                <span className="sm:hidden">…</span>
              </>
            ) : (
              <>
                <LogOut className="w-3.5 h-3.5" />
                <span>End</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
