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
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { buildSystemPrompt, getInitialGreetingPrompt } from '@/lib/tutor/ai/system-prompt-builder';
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
}

// Map our voice IDs to OpenAI voices
const VOICE_MAP: Record<string, OpenAIVoice> = {
  'female-1': 'shimmer',  // Warm, friendly
  'female-2': 'coral',    // Professional
  'male-1': 'echo',       // Calm
  'male-2': 'alloy',      // Energetic
};

export function VoiceTutorRealtime({
  subject,
  topic,
  level,
  studentName,
  sessionId,
  sessionStartedAtMs,
  sessionGoal,
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
  // targetId into "which page + which item" at render time.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const commandByIdRef = useRef<Map<string, { cmd: any; order: number }>>(new Map());
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

      const response = await fetch('/api/tutor/generate-whiteboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tutorText,
          studentText: lastStudentMsg || '',
          sessionId: sessionIdRef.current,
          recentContext,
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
          void checkTopicShift(topicShiftStateRef.current, raw).then((result) => {
            topicShiftStateRef.current = result.nextState;
            if (result.shifted) {
              topicShiftPendingRef.current = { fromDistance: result.distance ?? 0 };
              console.log('[VoiceTutorRealtime] Topic shift detected (distance=', result.distance?.toFixed(3), ')');
              onDebugEvent?.('topic_shift', `dist=${result.distance?.toFixed(3)} — next whiteboard batch will get newPage`);
            }
          });

          // Keyword-based new-problem detector — separate from the
          // embedding-based topic shift. Fires when the student asks for
          // a new problem / example / diagram with phrases that are
          // semantically close to prior topic (so embedding distance may
          // not trip) but structurally signal a board-clearing moment.
          // Requires at least one prior show_* so the very first problem
          // of the session doesn't trigger it.
          if (commandByIdRef.current.size > 0) {
            const rawLower = raw.toLowerCase();
            const newProblemPatterns = [
              /\bdraw (a|an|me a|me an)\b/,
              /\bshow (me )?(a|an)\b/,
              /\bnow (do|show|draw|give me)\b/,
              /\bnext (problem|one|example)\b/,
              /\banother (one|example|problem)\b/,
              /\blet'?s try (a|another)\b/,
              /\bmove on to\b/,
              /\bnew (problem|example|one)\b/,
            ];
            if (newProblemPatterns.some((re) => re.test(rawLower))) {
              topicShiftPendingRef.current = { fromDistance: 0 };
              console.log('[VoiceTutorRealtime] New-problem keyword trigger fired for:', rawLower.slice(0, 80));
              onDebugEvent?.('new_problem_keyword', `next batch will get newPage`);
            }
          }
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
  }, [onTranscriptUpdate, onTrackInteraction]);

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

  // Handle whiteboard commands from tool calls — validates geometry + optionally validates math via Claude
  const handleWhiteboardCommand = useCallback(async (commands: WhiteboardCommand[]): Promise<WhiteboardCommandResult> => {
    turnHadToolCallRef.current = true;
    // Accumulator: reasons we rejected a command so the Realtime hook can
    // report truth to the LLM instead of lying with success:true.
    const rejected: Array<{ action: string; reason: string }> = [];

    console.log('[VoiceTutorRealtime] handleWhiteboardCommand called, validateToolCalls:', validateToolCalls, 'commands:', commands.map(c => c.action));
    onDebugEvent?.('tool_call', `Whiteboard tool: ${commands.map(c => c.action).join(', ')}`);

    // Heuristic safety net: if a scribble/scrollTo arrives without a
    // targetId, try to resolve it by matching the scribble's label or
    // targetFeature OR the student's recent speech to a recent show_*
    // command's action or title. Upgrades the command with targetId in
    // place when the match is unambiguous. Runs BEFORE the hard rejection
    // below so models in the transitional period (or brief forgetting
    // their tool_result ids) still get served correctly.
    const existingIdEntries = Array.from(commandByIdRef.current.entries());
    if (existingIdEntries.length > 0) {
      const recentStudentWords = transcriptRef.current
        .slice(-4)
        .filter((e) => e.role === 'student')
        .map((e) => e.text)
        .join(' ')
        .toLowerCase();

      for (const cmd of commands) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const c = cmd as any;
        if (c.action !== 'scribble' && c.action !== 'scrollTo') continue;
        if (typeof c.targetId === 'string' && c.targetId) continue;

        // Pool of keywords to hunt for across the id catalog:
        //   - scribble.label (e.g. "shark")
        //   - scribble.targetFeature (e.g. "species-shark" → "shark")
        //   - last few student words ("point at the shark")
        const hayParts: string[] = [];
        if (typeof c.label === 'string') hayParts.push(c.label.toLowerCase());
        if (typeof c.targetFeature === 'string') {
          hayParts.push(c.targetFeature.toLowerCase().replace(/-/g, ' '));
        }
        if (recentStudentWords) hayParts.push(recentStudentWords);
        const hay = hayParts.join(' ');
        if (!hay) continue;

        // For each recent show_* id, score by how many of its "keywords"
        // (action verb + title/label words) appear in the haystack. Most
        // recent + highest-score wins.
        type Cand = { id: string; score: number; order: number };
        const candidates: Cand[] = [];
        for (const [id, entry] of existingIdEntries) {
          const cmdObj = entry.cmd as Record<string, unknown>;
          const actionWords = id.replace(/-\d+$/, '').replace(/^show/, '').replace(/([A-Z])/g, ' $1').trim().toLowerCase();
          const titleWords = typeof cmdObj.title === 'string' ? (cmdObj.title as string).toLowerCase() : '';
          const labelWords = typeof cmdObj.label === 'string' ? (cmdObj.label as string).toLowerCase() : '';
          const signal = `${actionWords} ${titleWords} ${labelWords}`.trim();
          if (!signal) continue;
          let score = 0;
          for (const word of signal.split(/\s+/).filter((w) => w.length > 2)) {
            if (hay.includes(word)) score += 1;
          }
          if (score > 0) candidates.push({ id, score, order: entry.order });
        }

        if (candidates.length > 0) {
          // Tie-break: highest score, then most recent (highest order).
          candidates.sort((a, b) => (b.score - a.score) || (b.order - a.order));
          const winner = candidates[0];
          c.targetId = winner.id;
          console.log('[VoiceTutorRealtime] Heuristic resolved', c.action, '→ targetId:', winner.id, `(score=${winner.score})`);
          onDebugEvent?.('scribble_heuristic_resolve', `${c.action} → ${winner.id} (hay="${hay.slice(0, 80)}")`);
        }
      }
    }

    // Force stable-id adoption: once a session has 4+ addressable items,
    // scribble/scrollTo that STILL arrive without targetId (heuristic
    // above didn't find a match) get rejected with a catalog of available
    // ids in the failure message. The model learns by failure within the
    // same turn — faster than waiting for the prompt alone to take hold.
    const existingIds = Array.from(commandByIdRef.current.keys());
    if (existingIds.length >= 4) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      commands = commands.filter((cmd: any) => {
        if (cmd.action !== 'scribble' && cmd.action !== 'scrollTo') return true;
        if (typeof cmd.targetId === 'string' && cmd.targetId.trim()) return true;
        const action = cmd.action === 'scribble' ? 'tutor_scribble' : 'tutor_scroll_whiteboard';
        const catalog = existingIds.slice(-10).join(', '); // last 10 keeps the message short
        rejected.push({
          action,
          reason:
            `This session has ${existingIds.length} addressable items — ${action} must use targetId. ` +
            `Available ids (most recent first): ${existingIds.slice().reverse().slice(0, 10).join(', ')}. ` +
            `Pick the one matching the item you want to reference and retry. ` +
            `Positional targetItemIndex is no longer accepted once the session has 4+ items. ` +
            `If pointing at a labeled feature inside the item (object, focal, mass-1, species-shark, ...), also pass targetFeature for precise coordinates.`,
        });
        console.warn('[VoiceTutorRealtime] Rejected', action, 'without targetId; session has', existingIds.length, 'items. Catalog:', catalog);
        onDebugEvent?.('scribble_rejected_no_targetid', `${action} without targetId after ${existingIds.length} items`);
        return false;
      });
    }

    // --- Greeting guard: suppress spurious show_problem / show_equation ---
    // If the student's last utterance is a pure greeting (e.g. "hi") and we
    // have no content signals in the session yet, the tutor has no reason to
    // emit a Problem card or an equation. Drop those commands so we don't
    // hallucinate random math on the first exchange.
    const lastStudentText = transcriptRef.current
      .filter(e => e.role === 'student')
      .slice(-1)[0]?.text || '';
    const priorStudentTurns = transcriptRef.current.filter(e => e.role === 'student').length;
    const greetingGuardActive = priorStudentTurns <= 1 && isPureGreeting(lastStudentText);

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
          ? 'show_tree was called without `root`. Provide the full tree as root: { label, children: [{ label, probability?, node: {...} }, ...] }.'
          : !(root as Record<string, unknown>).children || !Array.isArray((root as Record<string, unknown>).children) || ((root as Record<string, unknown>).children as unknown[]).length === 0
            ? 'show_tree root has no `children`. A single-node tree is never useful — send the full branching structure.'
            : checkNode(root, 'root');
        if (err) {
          const reason = `show_tree rejected: ${err}. Retry with a full, valid tree. For a coin-flip × 3 probability tree: root: { label: "Start", children: [ { label: "H", probability: "1/2", node: { label: "H", children: [ { label: "H", probability: "1/2", node: { label: "HH", children: [ { label: "H", probability: "1/2", node: { label: "HHH" } }, { label: "T", probability: "1/2", node: { label: "HHT" } } ] } }, { label: "T", probability: "1/2", node: { label: "HT", children: [ { label: "H", probability: "1/2", node: { label: "HTH" } }, { label: "T", probability: "1/2", node: { label: "HTT" } } ] } } ] } }, { label: "T", probability: "1/2", node: { /* mirror */ } } ] }.`;
          console.warn('[VoiceTutorRealtime] Dropping invalid show_tree:', err);
          onDebugEvent?.('tool_call', `Dropped invalid show_tree: ${err}`);
          rejected.push({ action: 'show_tree', reason });
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
    const justSolvedPending = recentlyFinishedProblemRef.current;
    const topicShiftPending = topicShiftPendingRef.current;
    if ((justSolvedPending || topicShiftPending) && processed.length > 0) {
      const teachingActions = new Set([
        'showEquation', 'showDiagram', 'showGraph', 'showTable',
        'showProblem', 'showSolution', 'showSvgDiagram', 'showGeometry',
        'showCode', 'showDerivation',
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
    for (const cmd of processed) {
      const action = String(cmd.action);
      if (META_ACTIONS.has(action)) continue;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cmdWithId = cmd as any;
      if (cmdWithId.id) continue; // caller already assigned
      const next = (idCountersRef.current.get(action) ?? 0) + 1;
      idCountersRef.current.set(action, next);
      const id = `${action}-${next}`;
      cmdWithId.id = id;
      commandByIdRef.current.set(id, { cmd: cmdWithId, order: nextCommandOrderRef.current++ });
    }

    // Resolve scribble / scrollTo targetId → targetItemIndex + targetPageTitle
    // so the existing per-page rendering path works. Also note which page
    // the referenced item lives on (by walking backward to the last newPage
    // preceding it in the session log) for auto page-switch injection.
    const resolveTargetFromId = (targetId: string): { itemIndex: number; pageTitle?: string; order: number } | null => {
      const entry = commandByIdRef.current.get(targetId);
      if (!entry) return null;
      // Walk the running commands list (including this batch) in order.
      // Count real items within each page bucket; find which bucket holds
      // the referenced order value.
      const fullList = [...whiteboardCommandsRef.current, ...processed];
      let pageTitle: string | undefined;
      let itemIndexInPage = 0;
      let foundIndex = -1;
      for (let i = 0, o = 0; i < fullList.length; i++) {
        const c = fullList[i];
        const act = String(c.action);
        if (act === 'newPage') {
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
      return { itemIndex: foundIndex, pageTitle, order: entry.order };
    };

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
    for (const cmd of processed) {
      if (cmd.action === 'scrollTo') {
        if (cmd.target === 'item' && typeof cmd.itemIndex === 'number') {
          itemsAlreadyScrolledThisBatch.add(cmd.itemIndex);
        }
        if (cmd.target === 'page' && cmd.pageTitle) {
          pagesAlreadyNavigatedThisBatch.add(cmd.pageTitle);
        }
        // Resolve scrollTo by targetId if present.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tid = (cmd as any).targetId;
        if (typeof tid === 'string') {
          const resolved = resolveTargetFromId(tid);
          if (resolved) {
            if (resolved.pageTitle && !pagesAlreadyNavigatedThisBatch.has(resolved.pageTitle)) {
              withAutoScrolls.push({ action: 'scrollTo', target: 'page', pageTitle: resolved.pageTitle });
              pagesAlreadyNavigatedThisBatch.add(resolved.pageTitle);
            }
            withAutoScrolls.push({ action: 'scrollTo', target: 'item', itemIndex: resolved.itemIndex });
            itemsAlreadyScrolledThisBatch.add(resolved.itemIndex);
            continue; // swallow the original id-only scrollTo
          }
        }
      }

      if (cmd.action === 'scribble') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tid = (cmd as any).targetId;
        let effectiveIndex = cmd.targetItemIndex;
        let effectivePageTitle: string | undefined;
        if (typeof tid === 'string') {
          const resolved = resolveTargetFromId(tid);
          if (resolved) {
            effectiveIndex = resolved.itemIndex;
            effectivePageTitle = resolved.pageTitle;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (cmd as any).targetItemIndex = effectiveIndex;
          } else {
            console.warn('[VoiceTutorRealtime] Scribble targetId not found:', tid);
          }
        }
        // Page navigation first (if cross-page)
        if (effectivePageTitle && !pagesAlreadyNavigatedThisBatch.has(effectivePageTitle)) {
          withAutoScrolls.push({ action: 'scrollTo', target: 'page', pageTitle: effectivePageTitle });
          pagesAlreadyNavigatedThisBatch.add(effectivePageTitle);
          console.log('[VoiceTutorRealtime] Auto-page-switch injected before scribble →', effectivePageTitle);
          onDebugEvent?.('auto_page_switch_before_scribble', effectivePageTitle);
        }
        // Item scroll next (if not already scrolled)
        if (typeof effectiveIndex === 'number' && !itemsAlreadyScrolledThisBatch.has(effectiveIndex)) {
          withAutoScrolls.push({ action: 'scrollTo', target: 'item', itemIndex: effectiveIndex });
          itemsAlreadyScrolledThisBatch.add(effectiveIndex);
          console.log('[VoiceTutorRealtime] Auto-scrollTo injected before scribble for item', effectiveIndex);
          onDebugEvent?.('auto_scroll_before_scribble', `Item ${effectiveIndex}`);
        }
      }
      withAutoScrolls.push(cmd);
    }
    processed = withAutoScrolls;

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
    return { rejected, assignedIds };
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
    const shouldValidate = !turnHadToolCallRef.current && (claimsToShowVisual(tutorText) || studentRequestedVisualRef.current);
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

  // Initialize the realtime connection
  const realtime = useOpenAIRealtime({
    instructions,
    voice,
    vadThreshold,
    vadSilenceDurationMs,
    vadPrefixPaddingMs,
    onTranscriptUpdate: handleTranscriptUpdate,
    onWhiteboardCommand: handleWhiteboardCommand,
    onResponseDone: handleResponseDone,
    onError: handleError,
    onStateChange,
    onStudentAudioChunk: audioRecordEnabled ? audioRecorder.pushStudentChunk : undefined,
    onTutorAudioChunk: audioRecordEnabled ? audioRecorder.pushTutorChunk : undefined,
  });

  // Wire up refs so callbacks can access hook functions
  injectContextRef.current = realtime.injectContext;
  sendTextMessageRef.current = realtime.sendTextMessage;

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

        // Fetch prior-session weak topics for this student+subject+topic
        // so the opening greeting can surface targeted review. Time-boxed to
        // 400 ms — if Mongo is slow we proceed without personalization rather
        // than hold up the connection. Session-open latency matters more than
        // a (often empty) prior-progress block.
        let priorProgress: { sessionCount: number; weakTopics: Array<{ topic: string; count: number }>; topicsCovered: string[] } | null = null;
        if (studentName) {
          try {
            const fetchPromise = fetch('/api/tutor/student-progress', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ studentName, subject, topic, level }),
            }).then(r => r.ok ? r.json() : null);
            priorProgress = await Promise.race([
              fetchPromise,
              new Promise<null>((resolve) => setTimeout(() => {
                console.warn('[VoiceTutorRealtime] student-progress lookup >600ms — skipping prior-session block');
                resolve(null);
              }, 600)),
            ]);
          } catch (err) {
            console.warn('[VoiceTutorRealtime] student-progress lookup failed:', err);
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
        });

        // Personalized prior-session block — appended to instructions so the
        // tutor can open with targeted review instead of a cold greeting.
        //
        // IMPORTANT: skip the block entirely when we have NO real content to
        // share (no weak topics AND no covered topics). Previously we injected
        // the block whenever sessionCount > 0, which forced the tutor to
        // invent a memory ("I remember last time we tackled X") pulling X
        // from the student's current question — a confabulation that
        // students noticed and called out. A cold greeting is better than a
        // fabricated one.
        let priorBlock = '';
        if (priorProgress && priorProgress.sessionCount > 0) {
          const weak = priorProgress.weakTopics.slice(0, 3).map(w => w.topic).filter(Boolean);
          const covered = priorProgress.topicsCovered.slice(0, 6);
          if (weak.length > 0 || covered.length > 0) {
            priorBlock = `\n\n## Prior Session Context\nThis student has had ${priorProgress.sessionCount} prior session(s) with you on this subject.\n` +
              (covered.length > 0 ? `Previously covered: ${covered.join(', ')}.\n` : '') +
              (weak.length > 0 ? `Areas they struggled with most: ${weak.join(', ')}.\n` : '') +
              `\nAFTER your greeting, briefly check in: mention you remember where you left off (referencing ONLY the specific topics listed above — never invent other topics), and offer to either (a) revisit the weak spots above with a quick review problem, or (b) move on to new material. Keep this check-in to one sentence — do NOT lecture about what they got wrong last time. Respect whatever they pick.`;
          }
        }

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

## Visual Tools — MANDATORY USAGE

CRITICAL: You MUST use whiteboard tools proactively. Students learn visually.

### show_equation — USE EVERY TIME you mention a formula
Call show_equation EVERY TIME you mention ANY equation, formula, or mathematical relationship.
- Say "pressure equals rho g h" → MUST also call show_equation with latex "P = \\\\rho g h"
- Say "buoyant force equals weight of displaced fluid" → call show_equation with "F_b = \\\\rho_{fluid} \\\\cdot V_{disp} \\\\cdot g"
- ANY time you reference a formula in speech, you MUST also display it. No exceptions.

### show_function_graph — USE for ALL mathematical function graphs
This is your tool for plotting mathematical functions, curves, and shaded regions. The rendering engine computes exact coordinates automatically — you just provide function expressions.
- Use this INSTEAD of show_svg_diagram whenever you need to plot y=f(x) or x=f(y) curves.
- "functions" array: y=f(x) plots. Expression uses "x" variable with JS math: "4 - 0.5*x", "x**2", "Math.sin(x)".
- "functionsOfY" array: x=f(y) plots (e.g. x=y³). Expression uses "y" variable: "y**3", "3*y - 2".
- "points" array: labeled intersection points or key points to mark.
- "shadedRegion": shade area between two curves. Set axis="y" for horizontal slices (provide x=f(y) expressions), axis="x" for vertical slices (provide y=f(x) expressions), with from/to bounds.
- Set xRange and yRange to show the relevant portion of the coordinate plane.
- ALWAYS choose ranges that show the full region of interest including all intersection points and labeled features.

### Structured diagram tools (PREFER these over show_svg_diagram)
When a structured tool covers the scenario, you MUST use it — free-form SVG produces colliding labels and inconsistent layout.

• **show_free_body_diagram** — ALWAYS use for free-body diagrams, force analyses, Newton's-laws problems, inclined planes. You supply object shape, surface type, and a list of forces with names + directions; the renderer draws arrows and places labels automatically. Force colors auto-assign by name convention (W/Mg → green, N → amber, f → purple, T → blue).
• **show_energy_bars** — ALWAYS use for conservation-of-energy visualization, roller-coaster / pendulum / spring energy transforms, and friction dissipation. Supply a \`positions\` array — each item has a label plus optional ke / pe / spring / thermal values. The renderer stacks bars and draws a dashed "total energy (conserved)" line automatically when totals match across positions.
• **show_collision** — ALWAYS use for conservation of momentum, elastic/inelastic/perfectly-inelastic collisions, and any two-object interaction before/after. Supply \`before\` and \`after\` arrays of bodies with mass and velocity. The renderer scales circles by mass, scales arrows by speed, and merges bodies automatically for perfectly-inelastic collisions. Pass \`type: "perfectly-inelastic"\` for stick-together collisions, \`"elastic"\` for bounce-apart, \`"inelastic"\` for energy-loss-but-separate.

### show_svg_diagram — FALLBACK for novel scenarios only
Use this for physical setups that don't fit a structured tool above (pipes, custom machinery, uncommon illustrations). NOT for free-body diagrams, NOT for mathematical function graphs.
- Draw SVG with viewBox="0 0 400 300". Use actual shapes, arrows, labels.
- For diagrams: draw realistic shapes (e.g. actual car shapes for motion, actual pipes for fluid flow). Use fill colors, stroke, and clear labels.
- Use ACTUAL VALUES from the problem being discussed. Include title and description.
- Make diagrams educational, detailed, and visually appealing. Think like a textbook illustrator.
- CRITICAL — PROPORTIONAL SIZING: When drawing objects with different dimensions (e.g. a hose and nozzle), the SVG element sizes MUST be proportional to the actual values.
- SVG markup must be on a single line — do NOT include literal newlines in the SVG string.

RULE: If you say "let me show you" or describe any visual, you MUST call the tool. Never describe visuals without showing them.

RULE — NO EXTRANEOUS DIAGRAMS: Only render diagrams that directly answer what the student asked. If the question is about reaction energetics (activation energy / ΔH / energy profile), use show_reaction_coordinate alone — do NOT also draw a Lewis structure of a reactant the student didn't ask about. If the question is about a map, do NOT also draw a timeline. One question, one visual artifact — unless the student explicitly asked for multiple. Extra diagrams are not helpful "bonus content"; they clutter the whiteboard and distract from the point.

### Homework uploads
When a student uploads a homework problem:
1. IMMEDIATELY draw the problem setup on the whiteboard:
   - For problems involving graphing functions/curves: use show_function_graph with the function expressions
   - For free-body / force / Newton's-laws problems: use show_free_body_diagram (structured, always preferred for this scenario)
   - For other physics setups that don't fit a structured tool: use show_svg_diagram
2. Verbally acknowledge the upload and summarize what the problem asks.
3. As you work through each solution step, call show_equation for every formula and substitution.
4. Guide the student step by step, asking questions to check understanding.

### Solution steps on the whiteboard
As you solve problems, show EACH step on the whiteboard:
- The starting equation (show_equation)
- Each substitution with actual values (show_equation)
- Intermediate results (show_equation)
- **The final answer** (show_equation with label "Final Answer") — THIS IS REQUIRED. When the problem is solved (whether you stated the result or the student did), you MUST close with a show_equation whose latex restates the original problem = the final result, and whose label is "Final Answer". Example: after solving ∫₀² (4x − x²) dx, call show_equation with latex "\\int_0^2 (4x - x^2)\\, dx = \\frac{16}{3}" and label "Final Answer". The student should be able to glance at the board and see the one-line summary of what was solved. Do NOT end a problem without this summary equation.
The student should be able to follow the entire solution by looking at the whiteboard.

Start by warmly greeting the student and asking how you can help them today.`;

        setInstructions(openAIInstructions + priorBlock);
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
      // On first click, send context-aware greeting to get tutor's introduction
      if (!hasStarted) {
        setHasStarted(true);
        const greetingMessage = getInitialGreetingPrompt(sessionGoal, topic);
        realtime.sendTextMessage(greetingMessage);
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
  }, [realtime, sessionGoal, topic, hasStarted, isMicMuted]);

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
        realtime.startListening();
        console.log('[VoiceTutorRealtime] Student mic unmuted');
        onDebugEvent?.('mic_unmute', 'Student unmuted mic');
      }
      return newMuted;
    });
  }, [realtime]);

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

  const stateUI = getStateUI();
  const isDisabled = realtime.state === 'connecting' || realtime.state === 'processing';

  return (
    <div className="voice-tutor-realtime flex items-center gap-3 py-2 px-2">
      {/* Connection indicator */}
      <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
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

          {/* State text */}
          <div className="min-w-0">
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

      {/* Text input — for when the student can't speak */}
      <form
        className="flex-1 flex items-center gap-2 min-w-0"
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
          className="flex-1 min-w-0 text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
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
              // First click: trigger the recap + practice-problem flow and
              // give the tutor up to 20 seconds to deliver. During that
              // window the button flips to "Finish" for an immediate exit.
              // If the user had already clicked once (isWrappingUp), a
              // second click skips the wait and exits immediately.
              if (!isWrappingUp && injectContextRef.current) {
                setIsWrappingUp(true);
                injectContextRef.current(buildRecapPrompt());
                onDebugEvent?.('session_recap_triggered',
                  `Topics=${topicsCoveredRef.current.length}, weak=${weaknessesRef.current.size}`);
                // Auto-finish after 20 seconds max
                setTimeout(async () => {
                  if (audioRecordEnabled) {
                    try { await audioRecorder.finalize(); } catch {}
                  }
                  onEndSession();
                }, 20000);
                return;
              }
              // Immediate finish (either no inject available, or 2nd click)
              if (audioRecordEnabled) {
                try { await audioRecorder.finalize(); } catch {}
              }
              onEndSession();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors"
          >
            {isWrappingUp ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Wrapping up… (click to finish)
              </>
            ) : (
              <>
                <LogOut className="w-3.5 h-3.5" />
                End
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
