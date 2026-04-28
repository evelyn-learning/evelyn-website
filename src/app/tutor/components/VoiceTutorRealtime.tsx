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
import { buildLessonPlanContext, resolveAdvanceTarget, getSegmentTruth } from '@/lib/tutor/lesson-plan/context';
import { getSegment } from '@/lib/tutor/lesson-plan/types';
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
import { WhiteboardCatalog, buildShowSignature, extractCommandTitle } from '@/lib/tutor/whiteboard/catalog';
import type { InteractionType } from '@/hooks/useDemoTracking';

export interface RealtimeHandle {
  sendTextMessage: (text: string) => void;
  getSessionSummary: () => {
    topicsCovered: string[];
    weakTopics: Array<{ topic: string; count: number }>;
  };
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
}

// Map our voice IDs to OpenAI voices
const VOICE_MAP: Record<string, OpenAIVoice> = {
  'female-1': 'shimmer',  // Warm, friendly
  'female-2': 'coral',    // Professional
  'male-1': 'echo',       // Calm
  'male-2': 'alloy',      // Energetic
};

/** Coherence pass: compare a rendered problem statement against the
 *  segment's authored truth and return a 0..1 similarity. Tokenizes on
 *  word boundaries (keeping numbers + fractions intact — `1/2` is ONE
 *  token, not three), then scores prose and numeric content separately
 *  and returns min(prose, numeric). The min() matters: a prose-heavy
 *  authored problem like "Try this one: 1/4 + 2/3. Walk me through it."
 *  has so many filler words that a single weighted overlap would let
 *  number substitution slip through ("Try this one: 1/3 + 2/5. Walk me
 *  through it." would still score above 0.5). Splitting the two
 *  dimensions and taking the worst score forces drift in either to
 *  trigger a rejection. Operator swaps (+ vs -) still escape — that's
 *  an accepted hole for v1; if it shows up in real sessions, add a
 *  dedicated operator-swap detector rather than tightening this one. */
function problemSimilarity(rendered: string, authored: string): number {
  const tokenize = (s: string): string[] => {
    const lowered = s.toLowerCase()
      .replace(/\$([^$]+)\$/g, ' $1 ')
      // Collapse \frac{a}{b} → a/b so the latex form of "1/2" matches
      // the prose form. No spaces around the slash on purpose.
      .replace(/\\frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g, ' $1/$2 ')
      .replace(/\\(cdot|times)/g, ' * ')
      .replace(/\\[a-z]+/g, ' ')
      // Strip prose punctuation including period — "2/3." should
      // tokenize to "2/3", same as a bare "2/3" in the renderer.
      .replace(/[{}()\[\],;:!?"'.]/g, ' ');
    return lowered.split(/\s+/).filter((t) => t.length > 0);
  };
  const isNumeric = (t: string) => /^[-+]?\d+(?:\.\d+)?$|[\d/^*+\-=<>]/.test(t);
  const aTokens = tokenize(authored);
  if (aTokens.length === 0) return 1;
  const renderedSet = new Set(tokenize(rendered));
  const aNumerics = aTokens.filter(isNumeric);
  const aProse = aTokens.filter((t) => !isNumeric(t));
  const numericMatch = aNumerics.length === 0
    ? 1
    : aNumerics.filter((t) => renderedSet.has(t)).length / aNumerics.length;
  const proseMatch = aProse.length === 0
    ? 1
    : aProse.filter((t) => renderedSet.has(t)).length / aProse.length;
  return Math.min(numericMatch, proseMatch);
}

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
  const clearSpeechQueueRef = useRef<(() => void) | null>(null);
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
    };
    sessionAccumRef.current = { losTouched: new Set(), masteryDeltas: [], gaps: [] };
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
      if (data.notes) {
        console.log('[VoiceTutorRealtime] session notes generated:', data.notes.summary);
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
    gaps: Array<{ loId: string; description: string }>;
  }>({ losTouched: new Set(), masteryDeltas: [], gaps: [] });
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

  // Engagement / fatigue tracking. We track the last N student reply lengths
  // and fire a diagnostic prompt when replies collapse to short monosyllables
  // ("ok", "k", "yea") — a reliable signal the student has disengaged or is
  // coasting. Also triggers a session-duration-based check-in at 45 min.
  const recentReplyLengthsRef = useRef<number[]>([]);
  const lastFatigueInjectionAtRef = useRef(0);
  const sessionStartMsRef = useRef<number>(Date.now());
  const longSessionCheckFiredRef = useRef(false);

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
    commands = commands.filter((cmd) => {
      const action = String((cmd as { action?: string }).action ?? '');
      if (!isStructuralVisual(action)) return true;
      if (!visualActionsThisTurn.has(action)) {
        visualActionsThisTurn.add(action);
        console.log('[VoiceTutor] visual-emit first this turn: %s', action);
        return true;
      }
      const reason =
        `You already emitted ${action} on this turn and that is already on the whiteboard. `
        + `This second call to ${action} was dropped so the student doesn't see two duplicate figures. `
        + `Use tutor_scroll_whiteboard({ target: ... }) to bring the existing one back into view if needed.`;
      console.warn('[VoiceTutor] dedup-drop: %s — already emitted this turn', action);
      onDebugEvent?.('visual_dedup_drop', `${action} (duplicate)`);
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
        // Segment-truth drift check (coherence pass). When a lesson plan
        // is active and the current segment has authored ground truth
        // (try_yourself / worked_example / misconception_check / extension),
        // the rendered problem must match that text. Otherwise the brain
        // is teaching against a script the student can't see — answer
        // validation, hints, and progress-tracking all break. Threshold
        // is intentionally generous: we want to catch number-substitution
        // and operator-swap drift, not punish minor rewording.
        const planForDrift = lessonPlanRef.current;
        const segIdForDrift = currentSegmentIdRef.current;
        if (planForDrift && segIdForDrift) {
          const seg = getSegment(planForDrift, segIdForDrift);
          const truth = getSegmentTruth(seg);
          if (truth?.problemText) {
            const sim = problemSimilarity(statement, truth.problemText);
            if (sim < 0.5) {
              const reason =
                `show_problem text drifted from the segment's authored problem. ` +
                `You rendered: ${JSON.stringify(statement.slice(0, 200))}. ` +
                `The segment's authored problem is: ${JSON.stringify(truth.problemText.slice(0, 200))}. ` +
                `Re-emit show_problem with the EXACT authored text — same numbers, same operators, ` +
                `same wording. The student answers against what the board shows; if the board has a ` +
                `different problem than the script, your hints and the answer check won't line up.`;
              console.warn('[VoiceTutorRealtime] show_problem ↔ segment-truth drift', {
                rendered: statement.slice(0, 120),
                authored: truth.problemText.slice(0, 120),
                similarity: sim,
              });
              onDebugEvent?.('segment_truth_drift',
                `show_problem drift (sim=${sim.toFixed(2)}): board="${statement.slice(0, 60)}…" vs script="${truth.problemText.slice(0, 60)}…"`);
              rejected.push({ action: 'show_problem', reason });
              return [];
            }
          }
        }
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
        // Segment-truth drift check (coherence pass). When the brain
        // calls show_equation with a label like "Original Equation" /
        // "Problem" / "Given" but no show_problem precedes it (common
        // for try_yourself segments where the equation IS the problem),
        // the equation latex must align with the segment's authored
        // problemText. Catches the case where the brain renders a
        // different equation than the script's authored one.
        const eqLabelLower: string = (cmdAny.label || '').toLowerCase();
        const planForEqDrift = lessonPlanRef.current;
        const segIdForEqDrift = currentSegmentIdRef.current;
        if (planForEqDrift && segIdForEqDrift && /original|problem|given|restated/.test(eqLabelLower) && latex.length > 4) {
          const seg = getSegment(planForEqDrift, segIdForEqDrift);
          const truth = getSegmentTruth(seg);
          if (truth?.problemText) {
            const sim = problemSimilarity(latex, truth.problemText);
            if (sim < 0.5) {
              const reason =
                `show_equation labeled "${cmdAny.label}" doesn't match the segment's authored problem. ` +
                `You rendered latex: ${JSON.stringify(latex.slice(0, 200))}. ` +
                `The segment's authored problem is: ${JSON.stringify(truth.problemText.slice(0, 200))}. ` +
                `Re-emit show_equation with latex that matches the authored problem exactly. ` +
                `If the authored problem isn't an equation, render the actual problem text via ` +
                `show_problem instead and skip the labeled equation.`;
              console.warn('[VoiceTutorRealtime] show_equation ↔ segment-truth drift', {
                rendered: latex.slice(0, 120),
                authored: truth.problemText.slice(0, 120),
                similarity: sim,
              });
              onDebugEvent?.('segment_truth_drift',
                `show_equation drift (sim=${sim.toFixed(2)}): board="${latex.slice(0, 60)}…" vs script="${truth.problemText.slice(0, 60)}…"`);
              rejected.push({ action: 'show_equation', reason });
              return [];
            }
          }
        }
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
              if (!result.correct && result.correctedLatex && injectContextRef.current) {
                const kind = result.source === 'wolfram-derivative' ? 'derivative'
                  : result.source === 'wolfram-integral' ? 'integral'
                  : 'equation';
                injectContextRef.current(
                  `MATH CORRECTION: The ${kind} you just wrote "${latex}" is wrong. ` +
                  `The correct form is "${result.expected || result.correctedLatex}". ` +
                  `${(result.issues || []).join(' ')} ` +
                  `On your next turn, briefly tell the student you misspoke and re-emit the corrected equation on the whiteboard.`
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
          const next = resolveAdvanceTarget(plan, currentSegmentIdRef.current, to);
          if (next) {
            console.log(`[VoiceTutorRealtime] lesson advance: "${currentSegmentIdRef.current}" → "${next}"`);
            currentSegmentIdRef.current = next;
            setActiveSegmentId(next);
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
      if (cmd.action === 'recordGap') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const c = cmd as any;
        if (c.loId && c.description) {
          sessionAccumRef.current.gaps.push({ loId: c.loId, description: c.description });
          sessionAccumRef.current.losTouched.add(c.loId);
          console.log(`[VoiceTutorRealtime] gap recorded: [${c.loId}] ${c.description}`);
        }
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
    for (const cmd of processed) {
      const action = String(cmd.action);
      if (action === 'newPage') {
        currentPageTitle = (cmd as { title?: string }).title;
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
      if (existing) {
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
        const cands = catalogRef.current.getItems()
          .flatMap((it) => it.features.map((f) => f.labels[0] || f.canonical))
          .slice(0, 12);
        rejected.push({
          action: 'tutor_scribble',
          reason: cands.length > 0
            ? `tutor_scribble needs a target. Current whiteboard features: ${cands.map((c) => `"${c}"`).join(', ')}. Retry with one of these.`
            : 'tutor_scribble needs a target, but the whiteboard is empty. Render a show_* item first.',
        });
        console.warn('[VoiceTutor] scribble-reject: empty target');
        cmdAny._scribbleRejected = true;
        continue;
      }
      const result = catalogRef.current.resolveTarget(raw);
      if (!result.ok) {
        const hint = result.candidates.length > 0
          ? ` Valid targets right now: ${result.candidates.slice(0, 14).map((c) => `"${c.target}" on ${c.on}`).join(', ')}.`
          : '';
        // If the board has iframe-only items (Desmos graph, Ketcher
        // molecule), call them out explicitly. Tutor misses on names
        // like "intersection points" usually mean the target lives
        // INSIDE one of these; the right action is scrollTo, never a
        // redraw of the same item.
        const iframeItems = catalogRef.current.getNonScribbleableItems();
        const iframeNote = iframeItems.length > 0
          ? ` Items on the board that are SCROLL-ONLY iframes (cannot scribble inside them, do NOT redraw them): ${
              iframeItems.map((it) => `${it.action} → tutor_scroll_whiteboard({ target: "${it.features[0].labels[0] ?? it.features[0].canonical}" })`).join('; ')
            }. If "${raw}" is inside one of these, scroll to it and describe verbally.`
          : '';
        rejected.push({
          action: 'tutor_scribble',
          reason: `${result.message}${hint}${iframeNote} Retry with the exact name of an existing feature — do not invent names. Do NOT redraw an existing item to make a feature appear.`,
        });
        console.warn('[VoiceTutor] scribble-reject: target="%s" (%s)', raw, result.reason);
        onDebugEvent?.('scribble_reject_no_match', `"${raw}" (${result.reason})`);
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
        const isWholeItemAlias = result.canonical === result.itemId;
        if (isWholeItemAlias) {
          const item = catalogRef.current.getItem(result.itemId);
          const subFeatures = (item?.features ?? [])
            .filter((f) => f.scribbleable && f.canonical !== result.itemId)
            .slice(0, 6)
            .map((f) => `"${f.labels[0] || f.canonical}"`)
            .join(', ');
          rejected.push({
            action: 'tutor_scribble',
            reason:
              `"${raw}" refers to the whole ${result.action} item, not a single feature. ` +
              `To MARK something specific on it, retry tutor_scribble with one of: ${subFeatures || '(no sub-features available)'}. ` +
              `To just bring it into view, use tutor_scroll_whiteboard({ target: "${raw}" }) instead.`,
          });
          console.warn('[VoiceTutor] scribble-reject: target="%s" → whole-item alias (%s)', raw, result.action);
          onDebugEvent?.('scribble_reject_whole_item', `"${raw}" → ${result.action}`);
        } else {
          rejected.push({
            action: 'tutor_scribble',
            reason:
              `"${raw}" resolved to ${result.action} which is rendered in an iframe and cannot be marked. ` +
              `Use tutor_scroll_whiteboard({ target: "${raw}" }) to bring it into the student's view, ` +
              `then explain what to look at verbally. Do NOT retry tutor_scribble on this item.`,
          });
          console.warn('[VoiceTutor] scribble-reject: target="%s" → iframe (%s)', raw, result.action);
          onDebugEvent?.('scribble_reject_iframe', `"${raw}" → ${result.action}`);
        }
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
    // advanceLesson + markSegmentComplete + recordGap are state side-effects
    // already applied above (segment id advance, mastery deltas, gaps).
    // Without this filter the canvas tries to render them and shows
    // "Unknown command type" cards.
    processed = processed.filter(
      (c) =>
        c.action !== 'advanceLesson' &&
        c.action !== 'markSegmentComplete' &&
        c.action !== 'recordGap',
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

    // --- Long-session check-in (fires once around 45 min mark) ---
    const sessionMinutes = (Date.now() - sessionStartMsRef.current) / 60000;
    if (sessionMinutes >= 45 && !longSessionCheckFiredRef.current && injectContextRef.current) {
      longSessionCheckFiredRef.current = true;
      console.log('[VoiceTutorRealtime] 45-min check-in triggered');
      onDebugEvent?.('long_session_checkin', `Session hit ${sessionMinutes.toFixed(1)} min`);
      injectContextRef.current(
        'SESSION LENGTH CHECK: The student has been studying for 45+ minutes. ' +
        'Proactively offer a brief recap and a choice: "We\'ve been at this for a while — want me to recap what we covered, ' +
        'take a quick 2-minute break, or keep going?" Respect whatever they choose. Long uninterrupted sessions lead to fatigue ' +
        'and low retention, so a natural pause here is valuable.'
      );
    }

    // --- 55-min pre-emptive session rotation ---
    // OpenAI Realtime caps sessions around 60 min. At 55, surface a UI
    // prompt so the user can choose to continue or wrap up; if they choose
    // continue, we rotate into a fresh session with context pre-injected.
    if (sessionMinutes >= 55 && !sessionRotationFiredRef.current) {
      sessionRotationFiredRef.current = true;
      console.log('[VoiceTutorRealtime] 55-min rotation prompt shown');
      onDebugEvent?.('session_rotation_prompt', `Session at ${sessionMinutes.toFixed(1)} min`);
      setSessionRotationPrompt(true);
    }

    // --- 58-min silent auto-rotation fallback ---
    // If the student ignored the banner, rotate silently before OpenAI's
    // hard cap at ~60 min. Keeps the tutor from cold-restarting with a
    // re-greeting. Fires once, only if the banner is still up (i.e. the
    // student didn't click either button).
    if (sessionMinutes >= 58 && sessionRotationPrompt && !autoRotationFiredRef.current) {
      autoRotationFiredRef.current = true;
      console.warn('[VoiceTutorRealtime] 58-min silent auto-rotation — user ignored banner');
      onDebugEvent?.('session_auto_rotation', `Silent rotation at ${sessionMinutes.toFixed(1)} min`);
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
  useEffect(() => {
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
      } catch (err) {
        console.error('[VoiceTutorRealtime] lesson plan fetch failed:', err);
      }
    })();
    return () => { cancelled = true; };
  }, [lessonPlanId]);

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

      const whiteboardSnapshot = catalogRef.current.getSnapshot();
      const t0 = Date.now();

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
      let totalToolNamesSeen: string[] = [];
      let aggregatedFullText = '';
      let lastStopReason = 'unknown';
      let lastUsage: { inputTokens?: number; outputTokens?: number; cacheReadTokens?: number; cacheCreationTokens?: number } | undefined;

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
        }
        // Compose lesson plan context from the active plan + current
        // segment id (both ref-tracked so segment advances mid-turn are
        // picked up on the next call). Free-conversation sessions omit
        // this — `lessonPlanRef.current` is null.
        const plan = lessonPlanRef.current;
        const lessonPlanContext = plan && currentSegmentIdRef.current
          ? buildLessonPlanContext(plan, currentSegmentIdRef.current)
          : undefined;

        const res = await fetch('/api/tutor/brain/stream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemPrompt: claudeSystemPromptRef.current,
            conversationHistory: runHistory,
            studentTranscript: runTranscript,
            whiteboardSnapshot: catalogRef.current.getSnapshot(),
            lessonPlanContext,
            studentProfileBlock: studentProfileBlockRef.current || undefined,
            grade: level,
          }),
        });
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
        const rejectionsThisAttempt: Array<{ action: string; reason: string }> = [];
        let attemptText = '';
        // Once a tool call in this attempt is rejected, the attempt is
        // doomed and we'll retry. Stop voicing further sentences from
        // this attempt (otherwise the student hears both the bad voice-
        // over and the corrected one). Tool calls keep dispatching so
        // we collect ALL rejections in one pass for the retry message.
        let attemptKilled = false;

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
                  // safety net at the orchestrator layer. Only applies
                  // to the FIRST sentence of a turn (totalSentenceCount
                  // is still 0 when we get here).
                  const isFirstSentenceOfTurn = totalSentenceCount === 0;
                  if (isFirstSentenceOfTurn && hasPriorTutorTurn) {
                    const greetingRe = /^\s*(?:hey|hi|hello|howdy)(?:\s+[A-Z][a-z]+)?[!.,]*\s*/i;
                    const stripped = sentence.replace(greetingRe, '').trim();
                    if (stripped && stripped !== sentence.trim()) {
                      console.log('[brain-orchestrator] stripped mid-session re-greet from first sentence');
                      // Skip this sentence entirely if the greeting WAS
                      // the whole sentence; otherwise voice the rest.
                      if (stripped.length < 4) continue;
                      // Replace the sentence content with the stripped version.
                      (ev as { text?: string }).text = stripped;
                    }
                  }
                  const updatedSentence = (ev.text as string) || '';
                  if (!updatedSentence.trim()) continue;
                  totalSentenceCount++;
                  if (firstSentenceMs === null) firstSentenceMs = Date.now() - t0;
                  // KEEP markdown emphasis (*word*, **strong**) in the
                  // chat-bound text so TranscriptView can render it as
                  // italic / bold. Strip ONLY for TTS — the speaking
                  // layer doesn't need or want the asterisks.
                  const trimmedSentence = updatedSentence.trim();
                  const sentenceForSpeech = trimmedSentence
                    .replace(/\*\*([^*]+)\*\*/g, '$1')
                    .replace(/\*([^*]+)\*/g, '$1');
                  attemptText += (attemptText ? ' ' : '') + trimmedSentence;
                  if (!attemptKilled) {
                    speakTextRef.current?.(sentenceForSpeech);
                  }
                  // Streaming reveal in the chat: incrementally append
                  // each sentence to a tutor entry so the student sees
                  // the response materialize as it's being composed,
                  // not all at once at the end. Use a stable per-turn
                  // entry id so subsequent sentences update the same row.
                  const streamingId = `tutor-streaming-${t0}`;
                  const last = transcriptRef.current[transcriptRef.current.length - 1];
                  if (last && last.role === 'tutor' && last.id === streamingId) {
                    transcriptRef.current = [
                      ...transcriptRef.current.slice(0, -1),
                      { ...last, text: attemptText },
                    ];
                  } else {
                    transcriptRef.current = [
                      ...transcriptRef.current,
                      {
                        id: streamingId,
                        timestamp: new Date(),
                        role: 'tutor',
                        text: attemptText,
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
                  const name = ev.name as string;
                  const args = (ev.args as Record<string, unknown>) || {};
                  toolNamesThisAttempt.push(name);
                  totalToolNamesSeen.push(name);
                  const cmd = mapFunctionCallToCommand(name, args);
                  if (cmd) {
                    const result = await handleWhiteboardCommand([cmd]);
                    if (result && Array.isArray(result.rejected) && result.rejected.length > 0) {
                      for (const r of result.rejected) {
                        rejectionsThisAttempt.push(r);
                      }
                      // First rejection in this attempt → cancel any
                      // already-queued/playing audio + stop voicing further
                      // sentences from this attempt. The retry will speak
                      // a fresh corrected response.
                      if (!attemptKilled) {
                        attemptKilled = true;
                        clearSpeechQueueRef.current?.();
                      }
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
          clearSpeechQueueRef.current?.();
          console.warn('[brain-orchestrator] RULE8 violation: promise without visual — retrying');
          onDebugEvent?.('rule8_retry', `Promised visual but no show_* tool: "${promisedSnippet.slice(0, 80)}…"`);
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
        runTranscript =
          `[validator feedback — not from the student] Your last turn emitted ` +
          `tool call(s) that the runtime structural validator rejected:\n${summarizedRejections}\n` +
          `Re-emit the corrected tool call(s). Don't apologize; the student doesn't see this message. ` +
          `Keep your verbal response brief and natural — pretend the prior attempt didn't happen.`;
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
        const streamingId = `tutor-streaming-${t0}`;
        // Clear the streaming-active flag — the bubble is finalized,
        // any future composing event is a fresh turn.
        setStreamingEntryActive(false);
        const finalText = fullText.trim();
        const idx = transcriptRef.current.findIndex((e) => e.id === streamingId);
        if (idx >= 0) {
          // Upgrade the streaming entry: stable id + final text.
          const finalEntry: TranscriptEntry = {
            ...transcriptRef.current[idx],
            id: `tutor-${Date.now()}`,
            text: finalText,
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
              id: `tutor-${Date.now()}`,
              timestamp: new Date(),
              role: 'tutor',
              text: finalText,
            } as TranscriptEntry,
          ];
        }
        onTranscriptUpdate([...transcriptRef.current]);
      } else if (totalToolNamesSeen.length > 0) {
        const placeholderEntry: TranscriptEntry = {
          id: `tutor-${Date.now()}`,
          timestamp: new Date(),
          role: 'tutor',
          text: `(rendered: ${totalToolNamesSeen.join(', ')})`,
        };
        transcriptRef.current = [...transcriptRef.current, placeholderEntry];
        // Deliberately NOT calling onTranscriptUpdate — this entry is
        // for Claude's history only, not the UI transcript view.
      }
    } catch (err) {
      console.error('[brain-orchestrator] error:', err);
      onDebugEvent?.('brain_turn', `Brain failed: ${err instanceof Error ? err.message : String(err)}`);
      speakTextRef.current?.('Hmm, give me a moment — could you repeat that?');
    }
  }, [handleWhiteboardCommand, onDebugEvent, onTranscriptUpdate]);

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
      brainBusyRef.current = false;
    }
  }, [callBrainOnce]);

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
        getSessionSummary: () => ({
          topicsCovered: [...topicsCoveredRef.current],
          weakTopics: Array.from(weaknessesRef.current.entries())
            .map(([topic, count]) => ({ topic, count }))
            .sort((a, b) => b.count - a.count),
        }),
      };
    }
    return () => {
      if (handleRef) handleRef.current = null;
    };
  }, [handleRef, realtime]);

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
  }, [subject, topic, level, studentName, sessionGoal]);

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
          console.log('[VoiceTutorRealtime] claude-brain: free-conversation, brain greets after first student turn.');
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
          <button
            onClick={handleResume}
            className="w-10 h-10 rounded-full bg-green-500 text-white hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center flex-shrink-0"
          >
            <Play className="w-5 h-5 ml-0.5" />
          </button>
          <span className="text-sm font-medium text-amber-600">Paused</span>
        </>
      ) : (
        <>
          {/* Pause button */}
          {realtime.isConnected && (
            <button
              onClick={handlePause}
              className="w-9 h-9 rounded-full bg-amber-100 text-amber-600 hover:bg-amber-200 transition-all duration-200 flex items-center justify-center flex-shrink-0"
              title="Pause conversation"
            >
              <Pause className="w-4 h-4" />
            </button>
          )}

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
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          const input = (e.target as HTMLFormElement).elements.namedItem('studentText') as HTMLInputElement;
          const text = input?.value?.trim();
          if (text && realtime.isConnected) {
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
            // Fresh student message → fresh tutor turn. Same reset as the
            // voice-finalization path.
            visualActionsThisTurnRef.current = new Set();
            console.log('[VoiceTutor] Student turn start (typed) — cleared visualActionsThisTurn');
            // Run the same new-problem / topic-shift detectors we run on
            // voice-final transcripts, so typed prompts like "Draw a 30°
            // inclined plane…" trigger a fresh whiteboard page. Before
            // this hook, typed messages bypassed detection entirely.
            runStudentTurnDetection(text, 'typed');
            // Send to AI
            realtime.sendTextMessage(text);
            input.value = '';
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
