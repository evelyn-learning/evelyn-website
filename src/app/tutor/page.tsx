'use client';

/**
 * AI Voice Tutor - Main Page
 *
 * The primary interface for voice tutoring sessions.
 * Supports both text and voice modes.
 */

import { useState, useCallback, useRef, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { ArrowLeft, Play, Send, Loader2, Mic, MessageSquare } from 'lucide-react';
import { useDemoTracker } from '@/components/demos/DemoTracker';
import {
  SUBJECTS,
  SESSION_GOALS,
  getLevelsForSubject,
  getTopicsForSubjectLevel,
  buildDisplayName,
  getTopicLabel,
} from '@/lib/tutor/topic-taxonomy';
import Link from 'next/link';
import { TranscriptView } from './components/TranscriptView';
import { SessionControls } from './components/SessionControls';
import { WhiteboardCanvas } from './components/whiteboard';
import { VoiceTutor } from './components/VoiceTutor';
import { VoiceTutorRealtime, type RealtimeHandle } from './components/VoiceTutorRealtime';
import { LessonPlanProgress } from './components/LessonPlanProgress';
import { LessonNudgePicker } from './components/LessonNudgePicker';
import PlanSearchBar, { type PlanSearchResult } from './components/PlanSearchBar';
import type { LessonPlan as LessonPlanType } from '@/lib/tutor/lesson-plan/types';
import { unitLabel } from '@/lib/tutor/lesson-plan/unit-titles';
import { VoiceTutorGemini } from './components/VoiceTutorGemini';
import { getInitialGreetingPrompt } from '@/lib/tutor/ai/system-prompt-builder';
import { gradeBandFor } from '@/lib/tutor/pedagogy/grade-profile';
import { useStudentPreferences } from '@/hooks/useStudentPreferences';
import type { StudentPreferences } from '@/lib/tutor/student-profile/types';
import type { SessionGoal, TranscriptEntry, VoiceId, AVAILABLE_VOICES } from '@/lib/tutor/types';
import type { WhiteboardCommand } from '@/lib/knowledge/types';
import type { OpenAIVoice } from './hooks/useOpenAIRealtime';

type InputMode = 'text' | 'voice';
type VoiceEngine = 'classic' | 'realtime' | 'realtime-2' | 'realtime-validated' | 'claude-brain' | 'gemini-live';

// Voice settings from environment variables (hides UI options)
const ENV_VOICE_ENGINE = (process.env.NEXT_PUBLIC_TUTOR_VOICE_ENGINE as VoiceEngine) || 'classic';
const ENV_OPENAI_VOICE = (process.env.NEXT_PUBLIC_TUTOR_VOICE_OPENAI as OpenAIVoice) || 'alloy';
const ENV_CLASSIC_VOICE = (process.env.NEXT_PUBLIC_TUTOR_VOICE_CLASSIC as VoiceId) || 'male-1';

// Token usage tracking
interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  operation: string;
  timestamp: Date;
  // Realtime-specific: audio vs text token breakdown
  inputAudioTokens?: number;
  outputAudioTokens?: number;
  inputTextTokens?: number;
  outputTextTokens?: number;
  // GPT-Realtime-2: server-cached input tokens (billed ~80x cheaper than
  // uncached audio input). Captured for cost analysis.
  inputCachedTokens?: number;
}

// Pricing per 1M tokens
const PRICING = {
  // Claude Sonnet 4 (text chat mode)
  input: 3.0,   // $3 per 1M input tokens
  output: 15.0, // $15 per 1M output tokens
};

const REALTIME_PRICING = {
  // OpenAI Realtime API (voice mode) — GA gpt-realtime rate card
  audioInput: 100.0,   // $100 per 1M audio input tokens
  audioOutput: 200.0,  // $200 per 1M audio output tokens
  textInput: 5.0,      // $5 per 1M text input tokens
  textOutput: 20.0,    // $20 per 1M text output tokens
};

// GPT-Realtime-2 rate card — used only when voiceEngine === 'realtime-2'.
// Audio input is billed at the uncached rate below; the cached portion
// (captured per-turn as inputCachedTokens) is far cheaper at $0.40/1M, so
// the realtime-2 cost figure is a slight OVER-estimate. Compute the cached
// saving post-hoc from the inputCachedTokens totals.
const REALTIME_2_PRICING = {
  audioInput: 32.0,        // $32 per 1M uncached audio input tokens
  audioInputCached: 0.40,  // $0.40 per 1M cached audio input tokens (post-hoc)
  audioOutput: 64.0,       // $64 per 1M audio output tokens
  textInput: 4.0,          // $4 per 1M text input tokens
  textOutput: 24.0,        // $24 per 1M text output tokens
};


interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function TutorPageWrapper() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" /></div>}>
      <TutorPage />
    </Suspense>
  );
}

/** Compact pill showing one setup step's done-or-pending state. */
function StepChip({ label, done }: { label: string; done: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
        done ? 'bg-green-100 text-green-800' : 'bg-white text-blue-700 border border-blue-300'
      }`}
    >
      {done ? '✓' : '○'} {label}
    </span>
  );
}

function TutorPage() {
  // Demo tracking
  const { onView, onTry, onComplete, trackInteraction } = useDemoTracker('voice-tutor', 'AI Voice Tutor');

  // Track view on mount
  useEffect(() => {
    onView();
  }, [onView]);

  // Engine selection is strictly env-controlled (NEXT_PUBLIC_TUTOR_VOICE_ENGINE).
  // The previous ?engine=<x> URL override was removed so demo / retail / whitelabel
  // surfaces all run on the same engine the deployment was built for.
  const searchParams = useSearchParams();
  // /tutor?tts=mini switches relay-mode TTS to gpt-4o-mini-tts for cost
  // comparison. Default 'realtime' (out-of-band response, highest quality).
  const ttsParam = searchParams.get('tts');
  const ttsProvider: 'realtime' | 'openai-mini' = ttsParam === 'mini' ? 'openai-mini' : 'realtime';
  // /tutor?studentId=X passes a stable identity to the realtime component
  // so cross-session memory (mastery, gaps, recent sessions) commits at
  // session-end via /api/tutor/student-profile/[id]. Without this, the
  // commit guard `if (!studentId) return;` short-circuits — gaps still
  // get captured in the brain layer but never persist. The settings page
  // at /tutor/settings already uses this same param shape.
  const studentIdParam = searchParams.get('studentId') || undefined;

  const [stage, setStage] = useState<'setup' | 'session' | 'summary'>('setup');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState('');
  // Lesson-plan selection. Optional — when set, the brain runs in
  // plan-driven mode (treats segments as a teaching script) instead of
  // free-conversation mode.
  const [availableLessonPlans, setAvailableLessonPlans] = useState<Array<{
    id: string;
    title: string;
    topic?: string;
    los: Array<{ id: string; description: string }>;
    estimatedMinutes: number;
    /** Slim metadata exposed by /api/tutor/lesson-plans for UI grouping
     *  (UNIT headers in the picker dropdown). Full metadata lives on the
     *  per-plan endpoint. */
    metadata?: { cedUnit?: unknown; cedTopic?: unknown; cedTitle?: unknown };
  }>>([]);
  const [selectedLessonPlanId, setSelectedLessonPlanId] = useState('');
  // Sticky-dismiss for the in-session lesson nudge. Once the student
  // hides it, don't pop it back up later in the same session.
  const [nudgeDismissed, setNudgeDismissed] = useState(false);
  // Anchor position for the picker bubble inside TranscriptView. Set
  // ONCE when the picker first becomes eligible (right after the
  // brain's first turn lands) and frozen for the rest of the session.
  // Without this, the picker — rendered as a transcript "footer" —
  // floated to the bottom and visibly drifted on every new turn
  // (observed 2026-04-29 geometry session).
  const [pickerAnchorIndex, setPickerAnchorIndex] = useState<number | null>(null);
  // Pacing v2 — Phase 3: ⋯ menu open state. Holds Harder / Easier /
  // Slow down / Speed up / Wrap up actions that are too rare to
  // deserve their own visible button. Default closed.
  const [pacingMenuOpen, setPacingMenuOpen] = useState(false);
  // Phase 3: current paceBias value, mirrored from VoiceTutorRealtime
  // via onPaceBiasChange. Drives the visible badge near the ⋯ menu so
  // the student can verify their Slow down / Speed up clicks landed
  // (the actual depth shift only manifests in subsequent brain turns,
  // so the click otherwise feels inert). Also flashes briefly to ack
  // each click.
  const [paceBias, setPaceBias] = useState(0);
  const [paceBiasFlash, setPaceBiasFlash] = useState(false);
  const paceBiasFlashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Voice Perception Q9 (2026-06-16): true for ~300ms after a perception
  // cancel fires. Drives the yellow-flash on the typed-input area to give
  // the student a visible "I heard you" signal even before the classifier
  // verdict resolves. Forwarded from VoiceTutorRealtime via the
  // onInterruptedChange callback.
  const [isPerceptionInterrupted, setIsPerceptionInterrupted] = useState(false);

  // Stage 4: humor preference accessor for the in-session ⋯ menu chip.
  // localStorage-only here (no studentId on this page yet); the settings
  // page at /tutor/settings is the place that does DB sync via
  // ?studentId=. Both write the same localStorage key, so a chip change
  // is reflected on the settings page next visit and vice versa.
  const {
    preferences: studentPreferencesForChip,
    setPreference: setStudentPreferenceForChip,
    clearPreference: clearStudentPreferenceForChip,
  } = useStudentPreferences();
  const [sessionGoal, setSessionGoal] = useState<SessionGoal>('practice');
  const [studentName, setStudentName] = useState('');
  const [inputMode, setInputMode] = useState<InputMode>('voice');
  // Voice settings: query param > env var > default
  const selectedVoice: VoiceId = ENV_CLASSIC_VOICE;
  const baseVoiceEngine: VoiceEngine = ENV_VOICE_ENGINE;
  // Lesson plans need an engine that consumes lessonPlanContext. The
  // claude-brain orchestrator does this server-side; realtime-2 does it
  // natively (the plan is injected straight into the RT-2 session). Force
  // the engine to claude-brain when a plan is selected so the user
  // doesn't have to know about engine flags — but leave realtime-2
  // deployments on realtime-2, since that engine runs plans itself.
  const voiceEngine: VoiceEngine = selectedLessonPlanId
    ? (baseVoiceEngine === 'realtime-2' ? 'realtime-2' : 'claude-brain')
    : baseVoiceEngine;
  const selectedOpenAIVoice: OpenAIVoice = ENV_OPENAI_VOICE;

  // Session state
  const [sessionId, setSessionId] = useState(() => `session-${Date.now()}`);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);
  const [whiteboardCommands, setWhiteboardCommands] = useState<WhiteboardCommand[]>([]);
  // Lesson-plan progress state — fed by VoiceTutorRealtime via onLessonPlanProgress.
  const [lessonProgress, setLessonProgress] = useState<{ plan: LessonPlanType | null; currentSegmentId: string }>({ plan: null, currentSegmentId: '' });
  // Real (mark_segment_complete–derived) completion set for the progress
  // strip. Array form so React's referential comparison treats each
  // update as a re-render trigger.
  const [completedSegmentIds, setCompletedSegmentIds] = useState<ReadonlyArray<string>>([]);
  // Plan id we're expecting to land after an expand-plan-los call. When
  // the plan reload completes, we auto-fire a synthetic prompt so the
  // brain starts teaching the first LO without the student needing to
  // say "ok, begin" first. Otherwise the session stalls after the
  // picker confirmation.
  const pendingAutoStartPlanIdRef = useRef<string | null>(null);
  // Source-of-truth event log for whiteboard commands. Each entry is captured
  // at the moment a command is emitted so we keep accurate timestamps and a
  // best-effort link to the surrounding transcript message. This avoids the
  // bug where the save path tried to reverse-engineer order/timing from a
  // walk over `transcript[].whiteboardCommands`, which silently dropped or
  // duplicated commands when the realtime tool calls fired before the tutor
  // transcript entry existed.
  const whiteboardEventsRef = useRef<Array<{
    command: WhiteboardCommand;
    timestamp: Date;
    sourceMessageIndex: number;
  }>>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  // True only after a whiteboard command has actually landed in the
  // current brain turn. Drives the "Tutor is preparing something…"
  // skeleton so it never flashes on text-only turns (which used to
  // show the skeleton for the entire brain.stream duration despite
  // never producing any whiteboard work).
  const [whiteboardActiveThisTurn, setWhiteboardActiveThisTurn] = useState(false);
  const wasProcessingRef = useRef(false);
  useEffect(() => {
    if (isProcessing && !wasProcessingRef.current) {
      setWhiteboardActiveThisTurn(false);
    }
    wasProcessingRef.current = isProcessing;
  }, [isProcessing]);
  const prevCommandCountRef = useRef(0);
  useEffect(() => {
    if (whiteboardCommands.length > prevCommandCountRef.current) {
      setWhiteboardActiveThisTurn(true);
    }
    prevCommandCountRef.current = whiteboardCommands.length;
  }, [whiteboardCommands.length]);
  // Watchdog for the "Thinking…" indicator. If something flips
  // isProcessing=true and forgets to flip it back (stuck brain
  // request, dropped voice transcription, network hiccup), the user
  // stares at "Thinking…" forever. Observed 2026-04-29 electricity
  // session: voice "I don't think so" never reached the brain, the
  // indicator stayed up for ~90s until the user typed. Auto-clear
  // after 15 seconds — short enough that the UX recovers quickly,
  // long enough that legitimate slow turns (T1 first-content batch
  // observed at 10.5s first_sentence 2026-05-24, multi-tool batches
  // up to ~22s total brain.stream) don't false-fire.
  useEffect(() => {
    if (!isProcessing) return;
    const t = setTimeout(() => {
      console.warn('[tutor/page] isProcessing watchdog fired — clearing stuck indicator after 15s');
      setIsProcessing(false);
      setStatusMessage('That took a moment — try saying it again, or type below if I missed it.');
      setTimeout(() => setStatusMessage(null), 6000);
    }, 15_000);
    return () => clearTimeout(t);
  }, [isProcessing]);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Token usage tracking
  const [tokenUsage, setTokenUsage] = useState<TokenUsage[]>([]);
  const sessionStartTimeRef = useRef<Date | null>(null);
  const lastSavedTokenCountRef = useRef(0); // track what we've already pushed to avoid duplicates

  // Debug events — persisted to DB for post-session analysis
  interface DebugEvent {
    type: string;
    message: string;
    timestamp: string;
    data?: Record<string, unknown>;
  }
  const debugEventsRef = useRef<DebugEvent[]>([]);
  const lastSavedDebugCountRef = useRef(0);
  const sessionEndedRef = useRef(false);

  const addDebugEvent = useCallback((type: string, message: string, data?: Record<string, unknown>) => {
    debugEventsRef.current.push({
      type,
      message: message.slice(0, 500),
      timestamp: new Date().toISOString(),
      ...(data ? { data } : {}),
    });
  }, []);

  // Save session usage to DB (fire-and-forget, tolerates failures)
  const saveSessionUsage = useCallback((status: 'active' | 'completed' | 'abandoned' = 'active') => {
    if (!selectedTopicId || stage === 'setup') return;

    const now = new Date();
    const startTime = sessionStartTimeRef.current || now;
    const duration = Math.round((now.getTime() - startTime.getTime()) / 1000);
    const totalIn = tokenUsage.reduce((s, u) => s + u.inputTokens, 0);
    const totalOut = tokenUsage.reduce((s, u) => s + u.outputTokens, 0);

    // Calculate cost with correct pricing per operation type
    let cost = 0;
    for (const u of tokenUsage) {
      if (u.operation === 'realtime-response') {
        // OpenAI Realtime: separate audio and text token pricing.
        // realtime-2 has its own (much lower) rate card; every other
        // realtime engine uses the GA gpt-realtime rates. The engine is
        // fixed for the whole session, so voiceEngine is authoritative.
        const rt = voiceEngine === 'realtime-2' ? REALTIME_2_PRICING : REALTIME_PRICING;
        const audioIn = u.inputAudioTokens || 0;
        const audioOut = u.outputAudioTokens || 0;
        const textIn = u.inputTextTokens || 0;
        const textOut = u.outputTextTokens || 0;
        // Audio input priced at the uncached rate — for realtime-2 the
        // cached portion (u.inputCachedTokens) is billed far cheaper, so
        // this is a slight over-estimate; derive the saving post-hoc.
        cost += (audioIn / 1_000_000) * rt.audioInput
              + (audioOut / 1_000_000) * rt.audioOutput
              + (textIn / 1_000_000) * rt.textInput
              + (textOut / 1_000_000) * rt.textOutput;
      } else {
        // Claude API: standard text token pricing
        cost += (u.inputTokens / 1_000_000) * PRICING.input
              + (u.outputTokens / 1_000_000) * PRICING.output;
      }
    }

    // Only push new token entries since last save
    const newEntries = tokenUsage.slice(lastSavedTokenCountRef.current);
    lastSavedTokenCountRef.current = tokenUsage.length;

    // Only push new debug events since last save
    const newDebugEvents = debugEventsRef.current.slice(lastSavedDebugCountRef.current);
    lastSavedDebugCountRef.current = debugEventsRef.current.length;

    const isFinal = status === 'completed' || status === 'abandoned';

    const payload: Record<string, unknown> = {
      sessionId,
      subject: selectedSubject,
      topic: selectedTopicId,
      level: selectedLevel,
      sessionGoal,
      inputMode,
      voiceEngine: inputMode === 'voice' ? voiceEngine : undefined,
      source: 'tutor',
      studentName: studentName || undefined,
      startedAt: startTime.toISOString(),
      endedAt: status !== 'active' ? now.toISOString() : undefined,
      duration,
      messageCount: transcript.length,
      whiteboardItemCount: whiteboardCommands.length,
      totalInputTokens: totalIn,
      totalOutputTokens: totalOut,
      estimatedCost: Math.round(cost * 10000) / 10000,
      status,
      ...(newEntries.length > 0 ? { tokenUsage: newEntries.map(u => ({
        operation: u.operation,
        inputTokens: u.inputTokens,
        outputTokens: u.outputTokens,
        timestamp: u.timestamp.toISOString(),
        ...(u.inputAudioTokens ? { inputAudioTokens: u.inputAudioTokens } : {}),
        ...(u.outputAudioTokens ? { outputAudioTokens: u.outputAudioTokens } : {}),
        ...(u.inputTextTokens ? { inputTextTokens: u.inputTextTokens } : {}),
        ...(u.outputTextTokens ? { outputTextTokens: u.outputTextTokens } : {}),
        ...(u.inputCachedTokens ? { inputCachedTokens: u.inputCachedTokens } : {}),
      })) } : {}),
      ...(newDebugEvents.length > 0 ? { debugEvents: newDebugEvents } : {}),
      // Always include the full transcript + whiteboard snapshot. Was
      // previously gated on isFinal, but that meant sessions ending
      // abnormally (mobile swipe-away, tab kill, network drop) lost
      // their entire transcript — beforeunload doesn't always fire and
      // the abandoned-on-unmount path can race with the page tearing
      // down. Sending it on each periodic active flush is bounded
      // bandwidth (transcripts are small text payloads) and means the
      // DB copy stays current within the 30s flush window.
      ...(transcript.length > 0 ? {
        transcript: transcript.map(t => ({
          role: t.role,
          text: t.text,
          timestamp: t.timestamp.toISOString(),
          ...(t.whiteboardCommands?.length ? { whiteboardCommands: t.whiteboardCommands } : {}),
          ...(t.pedagogicalIntent ? { pedagogicalIntent: t.pedagogicalIntent } : {}),
        })),
      } : {}),
      // Whiteboard commands also flushed on active saves so abnormal
      // exits don't lose them. Same rationale as transcript above.
      ...((whiteboardEventsRef.current.length > 0 || whiteboardCommands.length > 0) ? {
        whiteboardCommands: (() => {
          // Primary source of truth: the event log captured at emission time.
          // Each entry carries its own timestamp + transcript anchor, so the
          // replay UI gets a clean monotonic timeline with no dropped or
          // duplicated commands.
          if (whiteboardEventsRef.current.length > 0) {
            return whiteboardEventsRef.current.map((evt) => ({
              action: evt.command.action,
              data: { ...(evt.command as unknown as Record<string, unknown>), action: undefined },
              timestamp: evt.timestamp.toISOString(),
              sourceMessageIndex: evt.sourceMessageIndex,
            }));
          }
          // Fallback for non-voice flows that don't push through
          // handleVoiceWhiteboardCommand (text mode, homework upload). Just
          // dump the top-level state with a session-end timestamp — replay
          // timing won't be precise, but we don't lose commands.
          return whiteboardCommands.map((cmd) => ({
            action: cmd.action,
            data: { ...cmd, action: undefined },
            timestamp: now.toISOString(),
            sourceMessageIndex: -1,
          }));
        })(),
      } : {}),
    };

    // On final save, include the session-level topics-covered + weak-topics
    // map from the voice tutor handle so future sessions can surface targeted
    // review at the start.
    if (isFinal && realtimeHandleRef.current?.getSessionSummary) {
      try {
        const summary = realtimeHandleRef.current.getSessionSummary();
        if (summary.topicsCovered?.length) payload.topicsCovered = summary.topicsCovered;
        if (summary.weakTopics?.length) payload.weakTopics = summary.weakTopics;
      } catch (err) {
        console.warn('[saveSessionUsage] getSessionSummary threw:', err);
      }
    }

    // Use sendBeacon for unload, fetch otherwise
    if (status === 'abandoned') {
      navigator.sendBeacon('/api/tutor/session-usage', JSON.stringify(payload));
    } else {
      fetch('/api/tutor/session-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {});
    }
  }, [sessionId, selectedSubject, selectedLevel, selectedTopicId, stage, sessionGoal, inputMode, voiceEngine, studentName, transcript.length, whiteboardCommands.length, tokenUsage]);

  // Save on page unload (tab close) or component unmount (in-app navigation/back button)
  useEffect(() => {
    if (stage !== 'session') return;

    const handleBeforeUnload = () => {
      saveSessionUsage('abandoned');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Save abandoned session on component unmount (e.g. browser back button in SPA)
      // Skip if session was already explicitly ended
      if (!sessionEndedRef.current) {
        saveSessionUsage('abandoned');
      }
    };
  }, [stage, saveSessionUsage]);

  // Periodic active flush. Without this, sessions that end abnormally
  // (mobile tab swipe-away, OS-level kill, network drop, etc.) don't
  // fire beforeunload reliably and lose their entire transcript.
  // Observed 2026-04-29: physical-science session showed 2 student
  // messages on the dashboard but had NO record in the DB — the user
  // closed the tab on mobile before any tutor turn landed, beforeunload
  // didn't fire, and the abandoned-on-unmount save never reached the
  // server. Periodic flush every 30s while in session keeps the DB
  // copy current — at most we lose 30s of trailing turns.
  //
  // CRITICAL: must use a ref to hold `saveSessionUsage` and a stable
  // effect dep list. The callback's deps include transcript.length,
  // tokenUsage, etc. — every new turn re-creates the callback, which
  // would tear down + recreate the interval, restarting its 30s clock.
  // During an active conversation that timer would never fire (turns
  // arrive faster than 30s), defeating the entire flush.
  const saveSessionUsageRef = useRef(saveSessionUsage);
  useEffect(() => {
    saveSessionUsageRef.current = saveSessionUsage;
  }, [saveSessionUsage]);

  // Capture the picker anchor position the first time the picker is
  // eligible to show. Anchored to the visible-transcript length AFTER
  // the brain's first turn lands, so the picker bubble sits naturally
  // between "What are we working on today?" and the next message —
  // and stays there as the conversation grows.
  // Also voice the picker greeting through TTS the first time it
  // shows. The picker is rendered as JSX inside TranscriptView, so
  // without this it appeared visually but wasn't spoken aloud
  // (observed 2026-04-29 physics-basics session).
  useEffect(() => {
    if (stage !== 'session') return;
    if (pickerAnchorIndex !== null) return;
    if (nudgeDismissed) return;
    if (availableLessonPlans.length === 0) return;
    // Suppress when a lesson plan was already chosen at setup. The picker
    // is for "I haven't picked a lesson yet" prompting; if the student
    // already locked one in, the greeting is wrong (it cites the
    // configured TOPIC, not the chosen LESSON, and contradicts what the
    // brain is teaching). Observed 2026-04-30: student picked Calculus
    // integration plan but the picker greeting said "I see you chose
    // Trigonometry" — confusing and false.
    if (selectedLessonPlanId || lessonProgress.plan) return;
    const hasTutorMsg = transcript.some((t) => t.role === 'tutor');
    if (!hasTutorMsg) return;
    setPickerAnchorIndex(transcript.length);
    const topic = selectedTopicId ? buildDisplayName(selectedSubject, selectedLevel, selectedTopicId) : '';
    if (topic && realtimeHandleRef.current?.speakText) {
      realtimeHandleRef.current.speakText(
        `I see you chose ${topic} — nice. You can tell me ANY topic in this area, or jump straight into one of these lessons.`,
      );
    }
  }, [stage, transcript, availableLessonPlans.length, nudgeDismissed, pickerAnchorIndex, selectedSubject, selectedLevel, selectedTopicId, selectedLessonPlanId, lessonProgress.plan]);
  useEffect(() => {
    if (stage !== 'session') return;
    const interval = setInterval(() => {
      if (sessionEndedRef.current) return;
      saveSessionUsageRef.current('active');
    }, 30_000);
    return () => clearInterval(interval);
  }, [stage]);

  // Derived taxonomy state
  const availableLevels = useMemo(() => getLevelsForSubject(selectedSubject), [selectedSubject]);
  const availableTopics = useMemo(() => getTopicsForSubjectLevel(selectedSubject, selectedLevel), [selectedSubject, selectedLevel]);
  const topicDisplayName = useMemo(
    () => selectedTopicId ? buildDisplayName(selectedSubject, selectedLevel, selectedTopicId) : '',
    [selectedSubject, selectedLevel, selectedTopicId]
  );
  const canStartSession = !!(selectedSubject && selectedLevel && selectedTopicId);

  // Reset downstream selections when parent changes
  const handleSubjectChange = useCallback((subjectId: string) => {
    setSelectedSubject(subjectId);
    setSelectedLevel('');
    setSelectedTopicId('');
    setSelectedLessonPlanId('');
    setAvailableLessonPlans([]);
  }, []);

  const handleLevelChange = useCallback((levelId: string) => {
    setSelectedLevel(levelId);
    setSelectedTopicId('');
    setSelectedLessonPlanId('');
    setAvailableLessonPlans([]);
  }, []);

  // Search-bar plan pick: derive subject + level band + topic from the
  // chosen plan's metadata so the structured pickers stay in sync (they
  // still drive the rest of the page) and the lesson is ready to start.
  // Falls back gracefully when a band can't be inferred — the rest of
  // the dropdowns just stay empty and the user can fix manually.
  const handleSearchSelect = useCallback((plan: PlanSearchResult) => {
    // Subject mapping — plan.subject uses short codes ('sci', 'ss',
    // 'ela', 'math', 'cs') OR long forms; UI uses long. Normalise.
    const subjectMap: Record<string, string> = {
      sci: 'science',
      science: 'science',
      ss: 'social-studies',
      'social-studies': 'social-studies',
      ela: 'ela',
      math: 'math',
      cs: 'cs',
      languages: 'languages',
      'test-prep': 'test-prep',
    };
    const uiSubject = subjectMap[plan.subject] ?? plan.subject;
    // Grade → level band. Plan grades are single ('k', '3', '11') or
    // multi ('k-2', '11-12'). Map to the closest UI level.
    const gradeToBand = (g: string): string => {
      const norm = g.trim().toLowerCase();
      if (norm.includes('-')) return norm; // already a band
      if (norm === 'k' || norm === '1' || norm === '2') return 'k-2';
      if (['3', '4', '5'].includes(norm)) return '3-5';
      if (['6', '7', '8'].includes(norm)) return '6-8';
      if (['9', '10'].includes(norm)) return '9-10';
      if (['11', '12'].includes(norm)) return '11-12';
      // Curriculum-based fallbacks (AP / SAT-ACT / IITJEE / GRE etc).
      const c = plan.curriculum.toUpperCase();
      if (c.includes('AP') || c.includes('IB-DP') || c === 'IB-DP') return 'ap';
      if (c === 'GCSE' || c === 'A-LEVEL') return '11-12';
      if (norm === 'graduate') return 'graduate';
      return '11-12';
    };
    const uiLevel = gradeToBand(plan.grade);
    setSelectedSubject(uiSubject);
    setSelectedLevel(uiLevel);
    setSelectedTopicId(plan.topic ?? '');
    setSelectedLessonPlanId(plan.id);
    // Pre-fill the available-plans state so the dropdown shows the pick
    // immediately, even before the (subject,level,topic) effect re-fetches.
    setAvailableLessonPlans([{
      id: plan.id,
      title: plan.title,
      topic: plan.topic,
      los: plan.los,
      estimatedMinutes: plan.estimatedMinutes,
    }]);
    // Scroll the Start button into view so it's clear what to do next.
    setTimeout(() => {
      document.getElementById('tutor-start-btn')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }, []);

  // Fetch available lesson plans when (subject, level, topic) is set.
  // Plans are filtered server-side; the demo UI only shows a dropdown
  // when at least one plan matches.
  useEffect(() => {
    if (!selectedSubject || !selectedTopicId) {
      setAvailableLessonPlans([]);
      setSelectedLessonPlanId('');
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const params = new URLSearchParams();
        params.set('subject', selectedSubject);
        if (selectedLevel) params.set('grade', selectedLevel);
        if (selectedTopicId) params.set('topic', selectedTopicId);
        const res = await fetch(`/api/tutor/lesson-plans?${params.toString()}`);
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        setAvailableLessonPlans(data.items || []);
      } catch {
        if (!cancelled) setAvailableLessonPlans([]);
      }
    })();
    return () => { cancelled = true; };
  }, [selectedSubject, selectedLevel, selectedTopicId]);

  // Resizable split between transcript and whiteboard (percentage for transcript)
  const [splitPercent, setSplitPercent] = useState(50);
  // Mobile tab state — on screens narrower than `lg`, the split-panel
  // layout doesn't fit. Show one panel at a time via a tab toggle and
  // let the user switch between the chat and whiteboard.
  const [mobileTab, setMobileTab] = useState<'chat' | 'whiteboard'>('whiteboard');
  // SSR-safe desktop detection. Defaults to false on the server (renders
  // mobile-friendly layout) then flips to true on the client when the
  // viewport is wider than the lg breakpoint (1024px). Listens to resize.
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = typeof window !== 'undefined' ? window.matchMedia('(min-width: 1024px)') : null;
    if (!mq) return;
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  const isDraggingSplit = useRef(false);
  const splitContainerRef = useRef<HTMLDivElement>(null);

  const handleSplitMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingSplit.current = true;

    const onMove = (ev: MouseEvent) => {
      if (!isDraggingSplit.current || !splitContainerRef.current) return;
      const rect = splitContainerRef.current.getBoundingClientRect();
      const pct = ((ev.clientX - rect.left) / rect.width) * 100;
      setSplitPercent(Math.max(25, Math.min(75, pct)));
    };

    const onUp = () => {
      isDraggingSplit.current = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, []);

  // Vertical resizable split between main content and input area (pixels from bottom)
  const [inputHeight, setInputHeight] = useState(64); // default compact height for voice bar
  const isDraggingVertical = useRef(false);
  const pageContainerRef = useRef<HTMLDivElement>(null);

  const handleVerticalMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingVertical.current = true;

    const onMove = (ev: MouseEvent) => {
      if (!isDraggingVertical.current || !pageContainerRef.current) return;
      const rect = pageContainerRef.current.getBoundingClientRect();
      const fromBottom = rect.bottom - ev.clientY;
      setInputHeight(Math.max(48, Math.min(300, fromBottom)));
    };

    const onUp = () => {
      isDraggingVertical.current = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, []);


  // Input state
  const [inputText, setInputText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const realtimeHandleRef = useRef<RealtimeHandle | null>(null);

  // Auto-start watcher: when handleConfirmPlanLos arms
  // pendingAutoStartPlanIdRef with a plan id, wait for that plan's
  // segments to land in lessonProgress (it propagates from the child
  // after the lessonPlanId → fetch effect completes), then fire a
  // synthetic system prompt so the brain begins teaching the first LO
  // immediately. Without this the brain ends its "Let's jump in" turn
  // and the session stalls because brain turns are gated on student
  // input. The bracketed prefix is stripped from the chat-bubble
  // renderer per the existing convention (see VoiceTutorRealtime
  // typed-input form comment).
  useEffect(() => {
    const target = pendingAutoStartPlanIdRef.current;
    if (!target) return;
    if (lessonProgress.plan?.id !== target) return;
    // Plan now reflects the expanded version. Fire once and clear.
    pendingAutoStartPlanIdRef.current = null;
    const handle = realtimeHandleRef.current;
    if (!handle) {
      console.warn('[auto-start] no realtime handle; cannot trigger brain turn');
      return;
    }
    console.log(`[auto-start] firing synthetic start prompt for plan ${target}`);
    handle.sendTextMessage(
      '[orchestrator: the lesson plan has just been expanded with the picked LOs. Begin teaching immediately — call advance_lesson to move from the intro segment to the first LO\'s first segment (the hook or concept depending on Rule 12), then start the lesson. Do NOT re-acknowledge the pick or re-list LOs; the student has already moved past that step.]',
    );
  }, [lessonProgress.plan?.id]);

  // Send message to tutor API
  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim() || isProcessing || !selectedTopicId) return;

      setIsProcessing(true);
      setError(null);

      // Add user message to transcript
      const userEntry: TranscriptEntry = {
        id: `user-${Date.now()}`,
        timestamp: new Date(),
        role: 'student',
        text: message,
      };
      setTranscript((prev) => [...prev, userEntry]);
      trackInteraction('message', message, undefined, 'student');

      try {
        const response = await fetch('/api/tutor/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message,
            conversationHistory,
            subject: selectedSubject,
            topic: selectedTopicId,
            level: selectedLevel,
            studentName: studentName || undefined,
            sessionGoal,
          }),
        });

        const data = await response.json();

        // Handle API errors gracefully
        if (!response.ok || data.error) {
          throw new Error(data.error || 'Failed to get response from tutor');
        }

        // Track token usage
        if (data.usage) {
          setTokenUsage((prev) => [...prev, {
            inputTokens: data.usage.inputTokens,
            outputTokens: data.usage.outputTokens,
            operation: 'chat',
            timestamp: new Date(),
          }]);
        }

        // Add tutor response to transcript
        const tutorEntry: TranscriptEntry = {
          id: `tutor-${Date.now()}`,
          timestamp: new Date(),
          role: 'tutor',
          text: data.text,
          whiteboardCommands: data.whiteboardCommands,
          pedagogicalIntent: data.pedagogicalIntent,
        };
        setTranscript((prev) => [...prev, tutorEntry]);
        trackInteraction('message', data.text, data.pedagogicalIntent ? { pedagogicalIntent: data.pedagogicalIntent } : undefined, 'tutor');

        // Update conversation history for context
        setConversationHistory((prev) => [
          ...prev,
          { role: 'user', content: message },
          { role: 'assistant', content: data.rawText || data.text },
        ]);

        // Add whiteboard commands
        if (data.whiteboardCommands?.length > 0) {
          setWhiteboardCommands((prev) => [...prev, ...data.whiteboardCommands]);
          data.whiteboardCommands.forEach((cmd: WhiteboardCommand) => {
            trackInteraction('tool_use', 'whiteboard', { ...cmd });
          });
        }
      } catch (err) {
        console.error('Error sending message:', err);
        setError(err instanceof Error ? err.message : 'Failed to send message');
      } finally {
        setIsProcessing(false);
      }
    },
    [conversationHistory, selectedSubject, selectedLevel, selectedTopicId, studentName, sessionGoal, isProcessing, trackInteraction]
  );

  // Handle form submit
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (inputText.trim()) {
        sendMessage(inputText);
        setInputText('');
      }
    },
    [inputText, sendMessage]
  );

  // Start session with greeting
  const handleStartSession = useCallback(async () => {
    if (!canStartSession) return;

    // Track demo try
    onTry();
    trackInteraction('navigation', 'session_start', { topic: selectedTopicId, goal: sessionGoal, inputMode });

    // Full reset BEFORE flipping stage so the freshly-mounting
    // VoiceTutorRealtime (key={sessionId}) starts with no carry-over.
    // Spillover bug observed 2026-04-29 algebra-1 session: clicking
    // "Start New Session" then re-starting carried session 1's
    // transcript and lesson plan into session 2 — brain narrated
    // Systems-of-Linear-Equations content in a "no plan" session
    // because selectedLessonPlanId, lesson progress, picker dismissal,
    // wb event log, debug log, and the VoiceTutorRealtime internal
    // refs (transcriptRef, lessonPlanRef, queuedTranscriptsRef, the
    // catalog) all carried over.
    setSessionId(`session-${Date.now()}`);
    setTranscript([]);
    setConversationHistory([]);
    setWhiteboardCommands([]);
    whiteboardEventsRef.current = [];
    setTokenUsage([]);
    setLessonProgress({ plan: null, currentSegmentId: '' });
    setNudgeDismissed(false);
    setPickerAnchorIndex(null);
    setStatusMessage(null);
    setError(null);
    debugEventsRef.current = [];
    lastSavedDebugCountRef.current = 0;
    sessionStartTimeRef.current = new Date();
    lastSavedTokenCountRef.current = 0;
    sessionEndedRef.current = false;
    setStage('session');

    // For voice mode, VoiceTutor handles initialization
    if (inputMode === 'voice') {
      return;
    }

    // For text mode, get initial greeting (context-aware)
    const topicLabel = getTopicLabel(selectedSubject, selectedLevel, selectedTopicId);
    const greetingMessage = getInitialGreetingPrompt(sessionGoal, topicLabel);

    setIsProcessing(true);
    try {
      const response = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: greetingMessage,
          conversationHistory: [],
          subject: selectedSubject,
          topic: selectedTopicId,
          level: selectedLevel,
          studentName: studentName || undefined,
          sessionGoal,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Track token usage
        if (data.usage) {
          setTokenUsage([{
            inputTokens: data.usage.inputTokens,
            outputTokens: data.usage.outputTokens,
            operation: 'greeting',
            timestamp: new Date(),
          }]);
        }

        const tutorEntry: TranscriptEntry = {
          id: `tutor-${Date.now()}`,
          timestamp: new Date(),
          role: 'tutor',
          text: data.text,
          whiteboardCommands: data.whiteboardCommands,
        };
        setTranscript([tutorEntry]);
        setConversationHistory([
          { role: 'user', content: greetingMessage },
          { role: 'assistant', content: data.rawText || data.text },
        ]);
        if (data.whiteboardCommands?.length > 0) {
          setWhiteboardCommands(data.whiteboardCommands);
        }
      }
    } catch (err) {
      console.error('Error starting session:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [canStartSession, selectedSubject, selectedLevel, selectedTopicId, studentName, sessionGoal, inputMode, onTry, trackInteraction]);

  // Handle transcript updates from VoiceTutor
  const handleVoiceTranscriptUpdate = useCallback((entries: TranscriptEntry[]) => {
    setTranscript(entries);
  }, []);

  // Voice-transcription trouble banner. Set when OpenAI Realtime reports
  // an input-audio-transcription failure (rate_limit_error, auth, etc.)
  // so the student knows to fall back to typing instead of waiting in a
  // dead voice loop. Auto-clears on the next successful transcription.
  const [voiceTrouble, setVoiceTrouble] = useState<string | null>(null);
  const handleTranscriptionStatus = useCallback((status: 'failed' | 'completed') => {
    if (status === 'failed') {
      setVoiceTrouble("We're having a technical issue with voice right now — please use the typed chat below for the time being.");
    } else {
      setVoiceTrouble(null);
    }
  }, []);

  // Handle whiteboard commands from VoiceTutor
  const handleVoiceWhiteboardCommand = useCallback((commands: WhiteboardCommand[]) => {
    console.log('[TutorPage] Received whiteboard commands:', commands.length, commands.map(c => c.action));
    // Capture the emission moment + nearest tutor transcript index right now,
    // before the next tutor turn lands. We don't try to be clever about which
    // message a command "belongs to" — for replay we only care that the
    // timeline is monotonic and the timestamps are real.
    const now = new Date();
    const lastTutorIdx = (() => {
      for (let i = transcript.length - 1; i >= 0; i--) {
        if (transcript[i].role === 'tutor') return i;
      }
      return -1;
    })();
    for (const command of commands) {
      whiteboardEventsRef.current.push({ command, timestamp: now, sourceMessageIndex: lastTutorIdx });
    }
    setWhiteboardCommands((prev) => {
      const next = [...prev, ...commands];
      console.log('[TutorPage] Total whiteboard commands now:', next.length);
      return next;
    });
  }, [transcript]);

  // Freestyle-text interception: when a typed student message looks like
  // pasted study material (long text or structured list), kick off
  // on-the-fly lesson-plan generation and BOUNDED-await it.
  //
  // Why bounded-await (not pure fire-and-forget):
  //  - If the brain's turn 1 runs before the plan loads, the brain
  //    freestyles a generic ack and never sees the picker segment —
  //    the student then gets two turns of "which one do you want?"
  //    instead of the structured LO list (observed 2026-05-12 ~4.7s
  //    brain race vs 4.9s plan-gen).
  //  - Hard-await defeats the original goal (30s waits were
  //    unacceptable). 6s ceiling matches typical Stage-1 latency
  //    (~3-4s for Haiku) with safety margin; falls back to freestyle
  //    past that.
  //
  // No-op when a plan is already active — we don't override a
  // student-selected plan mid-session.
  const handleBeforeTypedSubmit = useCallback(
    async (text: string): Promise<{ setLessonPlanId: string | null } | void> => {
      if (selectedLessonPlanId || lessonProgress.plan) return;
      const { detectFreestyleText } = await import('@/lib/tutor/lesson-plan/freestyle-trigger');
      const trigger = detectFreestyleText(text);
      if (!trigger.shouldGeneratePlan) return;
      const subject = selectedSubject;
      const grade = selectedLevel;
      const topic = selectedTopicId;
      const startedAt = Date.now();
      // Race the plan-from-text fetch against a timeout. Whichever
      // wins decides whether the brain's turn 1 has picker context.
      const PLAN_WAIT_MS = 6000;
      const fetchPlan = (async () => {
        try {
          const res = await fetch('/api/tutor/plan-from-text', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, subject, grade, topic, sessionMinutes: 30 }),
          });
          if (!res.ok) {
            console.warn('[freestyle] plan-from-text non-ok:', res.status);
            return null;
          }
          return await res.json();
        } catch (err) {
          console.warn('[freestyle] plan-from-text threw:', err);
          return null;
        }
      })();
      const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), PLAN_WAIT_MS));
      const data = await Promise.race([fetchPlan, timeout]);
      const elapsed = Date.now() - startedAt;
      if (!data) {
        // Timed out OR fetch failed. Let the fetch keep running in the
        // background so the plan still lands eventually (next turn will
        // pick it up). Brain turn 1 happens freestyle.
        console.log(`[freestyle] plan not ready in ${elapsed}ms (deadline ${PLAN_WAIT_MS}ms) — proceeding without plan; background fetch will land for next turn`);
        void fetchPlan.then((late) => {
          const lateId = late?.plan?.id;
          if (typeof lateId === 'string' && lateId) {
            setSelectedLessonPlanId((prev) => {
              if (prev) return prev;
              console.log(`[freestyle] late-landing plan ${lateId} applied (took ${Date.now() - startedAt}ms total)`);
              return lateId;
            });
          }
        });
        return;
      }
      const planId = data?.plan?.id;
      if (typeof planId !== 'string' || !planId) {
        console.warn('[freestyle] plan-from-text response missing plan id');
        return;
      }
      console.log(
        `[freestyle] plan ${planId} ready in ${elapsed}ms (mode=${data.mode}, segments=${data.plan.segments?.length})`,
      );
      // Set the plan synchronously so the child's useEffect picks it
      // up. Returning { setLessonPlanId } tells the child to wait for
      // lessonPlanRef to load before forwarding the typed turn — so the
      // brain's first turn sees the picker segment.
      setSelectedLessonPlanId(planId);
      return { setLessonPlanId: planId };
    },
    [selectedLessonPlanId, lessonProgress.plan, selectedSubject, selectedLevel, selectedTopicId],
  );

  // Picker-segment commit. Two-call expansion to minimise the wait
  // between "Let's get into it!" and the first teaching turn:
  //
  //   Call A (priority, awaited): expand ONLY the first picked LO —
  //     ~3-4s of Haiku time for 4 segments. Plan reloads with
  //     intro + first LO ready. Brain auto-starts teaching it.
  //
  //   Call B (full, background): expand ALL picked LOs — ~15s. By
  //     the time the brain finishes LO 1 (minutes of teaching), the
  //     full plan has landed silently. Brain advances to LO 2 with
  //     segments already in place.
  //
  // The plan id is preserved across both calls; each upsert replaces
  // the prior plan doc. The metadata.pendingExpansion field tells
  // the orchestrator the partial-state shape if needed.
  const handleConfirmPlanLos = useCallback(
    async ({ planId, pickedLoIds }: { planId: string; pickedLoIds: string[] }): Promise<void> => {
      if (pickedLoIds.length === 0) return;
      const priorityLoIds = [pickedLoIds[0]];
      try {
        // Call A — priority. Awaited so we can trigger auto-start the
        // moment the first LO's segments are ready.
        const resA = await fetch('/api/tutor/expand-plan-los', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ planId, pickedLoIds, priorityLoIds }),
        });
        if (!resA.ok) {
          console.warn('[plan-pick] priority call non-ok:', resA.status);
          return;
        }
        const dataA = await resA.json();
        setSelectedLessonPlanId('');
        setTimeout(() => setSelectedLessonPlanId(planId), 10);
        pendingAutoStartPlanIdRef.current = planId;
        const noticeText = `Plan ready — starting first item (${dataA.pendingExpansion?.length ?? 0} more loading)`;
        const notice: TranscriptEntry = {
          id: `system-${Date.now()}`,
          timestamp: new Date(),
          role: 'system',
          text: noticeText,
        };
        setTranscript((prev) => [...prev, notice]);
        console.log(
          `[plan-pick] priority expand ok plan=${planId} expanded=${dataA.expandedCount} pending=${dataA.pendingExpansion?.length ?? 0} ms=${dataA.timing?.totalMs}`,
        );

        // Call B — full set, fire-and-forget. Plan reloads silently
        // when this completes; existing useEffect in VoiceTutorRealtime
        // picks up the new segments without disrupting the brain's
        // current teaching state (currentSegmentId still points at the
        // LO-1 segment the brain is in).
        if (pickedLoIds.length > priorityLoIds.length) {
          void (async () => {
            try {
              const resB = await fetch('/api/tutor/expand-plan-los', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planId, pickedLoIds }),
              });
              if (!resB.ok) {
                console.warn('[plan-pick] background full-expand non-ok:', resB.status);
                return;
              }
              const dataB = await resB.json();
              console.log(
                `[plan-pick] background full-expand ok plan=${planId} expanded=${dataB.expandedCount} ms=${dataB.timing?.totalMs}`,
              );
              // Force a re-fetch of the plan so the child picks up the
              // newly-expanded later-LO segments. Same trick as call A.
              setSelectedLessonPlanId('');
              setTimeout(() => setSelectedLessonPlanId(planId), 10);
            } catch (err) {
              console.warn('[plan-pick] background full-expand threw:', err);
            }
          })();
        }
      } catch (err) {
        console.warn('[plan-pick] priority call threw:', err);
      }
    },
    [],
  );

  // Mid-session plan swap. The brain emits propose_plan_swap when the
  // student asks for a different sub-topic inside the same configured
  // subject + topic (Rule 7). Server-side /api/tutor/swap-plan does
  // the topic-scoped curated lookup + freestyle fallback. We just
  // route the resolved plan id into selectedLessonPlanId so the existing
  // useEffect in VoiceTutorRealtime loads it on the next render.
  const handleProposePlanSwap = useCallback(
    async ({ targetSubTopic, reason }: { targetSubTopic: string; reason?: string }): Promise<void> => {
      try {
        const res = await fetch('/api/tutor/swap-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            targetSubTopic,
            subject: selectedSubject,
            grade: selectedLevel,
            topic: selectedTopicId,
            reason,
          }),
        });
        if (!res.ok) {
          console.warn('[plan-swap] non-ok:', res.status);
          return;
        }
        const data = await res.json();
        const newPlanId = data?.plan?.id;
        if (typeof newPlanId !== 'string' || !newPlanId) {
          console.warn('[plan-swap] response missing plan id');
          return;
        }
        // Inject a one-line system notice into the chat so the student
        // sees the rails change. Uses the same TranscriptEntry shape as
        // student/tutor turns with a distinct role so the renderer can
        // style it differently.
        const newPlanTitle: string = typeof data?.plan?.title === 'string' ? data.plan.title : 'New plan';
        const notice: TranscriptEntry = {
          id: `system-${Date.now()}`,
          timestamp: new Date(),
          role: 'system',
          text: `Plan changed → ${newPlanTitle}`,
        };
        setTranscript((prev) => [...prev, notice]);
        console.log(
          `[plan-swap] applied new plan ${newPlanId} (source=${data.source}, title="${newPlanTitle}")`,
        );
        setSelectedLessonPlanId(newPlanId);
      } catch (err) {
        console.warn('[plan-swap] failed:', err);
      }
    },
    [selectedSubject, selectedLevel, selectedTopicId],
  );

  // Handle token usage from OpenAI Realtime responses
  const handleRealtimeUsage = useCallback((usage: { totalTokens: number; inputTokens: number; outputTokens: number; inputTextTokens: number; inputAudioTokens: number; outputTextTokens: number; outputAudioTokens: number; inputCachedTokens?: number }) => {
    if (usage.totalTokens === 0) return;
    setTokenUsage((prev) => [...prev, {
      inputTokens: usage.inputTokens,
      outputTokens: usage.outputTokens,
      inputAudioTokens: usage.inputAudioTokens,
      outputAudioTokens: usage.outputAudioTokens,
      inputTextTokens: usage.inputTextTokens,
      outputTextTokens: usage.outputTextTokens,
      inputCachedTokens: usage.inputCachedTokens,
      operation: 'realtime-response',
      timestamp: new Date(),
    }]);
  }, []);

  // Handle conversation history updates from VoiceTutor
  const handleVoiceConversationHistoryUpdate = useCallback((history: ConversationMessage[]) => {
    setConversationHistory(history);
  }, []);

  // End session
  const handleEndSession = useCallback(() => {
    // Track demo complete
    onComplete({
      topic: selectedTopicId,
      messagesExchanged: transcript.length,
      sessionGoal
    });
    // Save session as completed to DB
    sessionEndedRef.current = true;
    saveSessionUsage('completed');
    setStage('summary');
  }, [onComplete, selectedTopicId, transcript.length, sessionGoal, saveSessionUsage]);

  // Upload homework and extract problems
  const handleUploadHomework = useCallback(async (imageData: string, mimeType: string) => {
    if (!selectedTopicId) return;
    console.log('[Tutor] Processing homework upload:', mimeType);
    addDebugEvent('image_upload', `Homework upload: ${mimeType}`);
    setIsProcessing(true);
    setError(null);
    setStatusMessage('📷 Analyzing your problem...');

    try {
      // Call the homework extraction API
      const response = await fetch('/api/tutor/extract-homework', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageData,
          mimeType,
          subject: selectedSubject,
          topic: selectedTopicId,
          level: selectedLevel,
          conversationHistory,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process homework image');
      }

      const data = await response.json();

      // Track token usage (includes both extraction and tutor response)
      if (data.usage) {
        setTokenUsage((prev) => [...prev, {
          inputTokens: data.usage.inputTokens,
          outputTokens: data.usage.outputTokens,
          operation: 'homework-extraction',
          timestamp: new Date(),
        }]);
      }

      // Build user message that includes the extracted problem for context
      const userMessageForHistory = data.extractedProblem
        ? `I uploaded a homework problem. Here's what it says:\n\n${data.extractedProblem}\n\nCan you help me understand it and work through it?`
        : 'Here is my homework problem. Can you help me understand it and work through it?';

      // If in realtime voice mode, send extracted problem through the WebSocket
      // so the AI acknowledges it verbally and speaks its response
      if (inputMode === 'voice' && voiceEngine === 'realtime' && realtimeHandleRef.current && data.extractedProblem) {
        console.log('[Tutor] Sending extracted homework to realtime API for voice response');

        // Add user upload message to transcript for display only
        const userEntry: TranscriptEntry = {
          id: `user-${Date.now()}`,
          timestamp: new Date(),
          role: 'student',
          text: '[Uploaded homework image]',
        };
        setTranscript((prev) => [...prev, userEntry]);

        // Show the uploaded image on the whiteboard
        setWhiteboardCommands(prev => [...prev, {
          action: 'showSvgDiagram',
          title: 'Uploaded Homework',
          svg: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
            <image href="${imageData}" x="10" y="10" width="380" height="280" preserveAspectRatio="xMidYMid meet"/>
          </svg>`,
        } as WhiteboardCommand]);

        // Send extracted problem to realtime WebSocket — the AI will speak its response
        realtimeHandleRef.current.sendTextMessage(
          `The student just uploaded a homework problem image. Here is the extracted text:\n\n${data.extractedProblem}\n\nYou MUST do ALL of the following:\n1. Draw the problem setup on the whiteboard — if it involves graphing functions or curves, use show_function_graph with the function expressions. For physics diagrams (objects, forces, circuits), use show_svg_diagram.\n2. Verbally acknowledge the upload and briefly summarize what the problem asks.\n3. As you work through each solution step, call show_equation to display each equation and substitution on the whiteboard.\n4. Guide the student through the solution step by step, asking them questions along the way.`
        );
      } else {
        // Text mode: add both entries to transcript
        const userEntry: TranscriptEntry = {
          id: `user-${Date.now()}`,
          timestamp: new Date(),
          role: 'student',
          text: '[Uploaded homework image]',
        };

        const tutorEntry: TranscriptEntry = {
          id: `tutor-${Date.now()}`,
          timestamp: new Date(),
          role: 'tutor',
          text: data.text,
        };

        setTranscript((prev) => [...prev, userEntry, tutorEntry]);

        // Store the FULL extracted problem in conversation history for context
        setConversationHistory((prev) => [
          ...prev,
          { role: 'user', content: userMessageForHistory },
          { role: 'assistant', content: data.text },
        ]);

        // Add whiteboard commands from homework extraction
        if (data.whiteboardCommands?.length > 0) {
          setWhiteboardCommands((prev) => [...prev, ...data.whiteboardCommands]);
        }
      }

      console.log('[Tutor] Homework processed successfully');
    } catch (err) {
      console.error('[Tutor] Homework upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to process homework');
    } finally {
      setIsProcessing(false);
      setStatusMessage(null);
    }
  }, [selectedSubject, selectedLevel, selectedTopicId, conversationHistory, inputMode, voiceEngine]);

  // Focus input when session starts
  useEffect(() => {
    if (stage === 'session' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [stage]);

  // Render setup stage
  if (stage === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">AI Tutor</h1>
            <p className="text-gray-600 mt-2">
              Practice with an AI tutor across any subject and level.
            </p>
          </div>

          {/* Setup form */}
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-5">
            {/* Quick-start search — fastest path to a session. Type
                what you want ("AP Calc derivatives", "GCSE quadratics",
                "phonics") and press Enter. Searches the entire
                catalog of 700+ lesson plans by title, topic, and
                learning objective. Selecting a plan auto-fills the
                structured pickers below. Cmd-K from anywhere on page. */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ⚡ Quick start
              </label>
              <PlanSearchBar onSelect={handleSearchSelect} />
              <p className="mt-2 text-xs text-gray-500">
                Or scroll down to browse by subject and level.
              </p>
            </div>

            {/* Visual divider between fast-path and structured browse. */}
            <div className="relative my-4" aria-hidden>
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
              <div className="relative flex justify-center"><span className="bg-white px-3 text-xs uppercase tracking-wider text-gray-400 font-semibold">or browse</span></div>
            </div>

            {/* Status header — shows the user exactly which steps remain
                so they don't feel like they're walking down an unknown
                tunnel of dropdowns. Subject → Level → Topic → Start. */}
            <div className="rounded-lg bg-blue-50/60 border border-blue-100 px-4 py-3">
              <div className="flex items-center gap-2 flex-wrap text-sm">
                <span className="font-semibold text-blue-900">3 quick choices to begin:</span>
                <StepChip label="Subject" done={!!selectedSubject} />
                <span className="text-blue-300">›</span>
                <StepChip label="Level" done={!!selectedLevel} />
                <span className="text-blue-300">›</span>
                <StepChip label="Topic" done={!!selectedTopicId} />
                <span className="text-blue-300">›</span>
                <span className="text-blue-700/70 text-xs italic">then Start</span>
              </div>
            </div>

            {/* Name input */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Your Name (optional)
              </label>
              <input
                id="name"
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Subject selection */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold mr-2">1</span>
                Subject
              </label>
              <select
                id="subject"
                value={selectedSubject}
                onChange={(e) => handleSubjectChange(e.target.value)}
                onInput={(e) => handleSubjectChange((e.target as HTMLSelectElement).value)}
                onBlur={(e) => {
                  const v = (e.target as HTMLSelectElement).value;
                  if (v !== selectedSubject) handleSubjectChange(v);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">Select a subject…</option>
                {SUBJECTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.icon} {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Level selection */}
            {selectedSubject && (
              <div>
                <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold mr-2">2</span>
                  Level
                </label>
                <select
                  id="level"
                  value={selectedLevel}
                  onChange={(e) => handleLevelChange(e.target.value)}
                  onInput={(e) => handleLevelChange((e.target as HTMLSelectElement).value)}
                  onBlur={(e) => {
                    const v = (e.target as HTMLSelectElement).value;
                    if (v !== selectedLevel) handleLevelChange(v);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">Select a level…</option>
                  {availableLevels.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Topic selection */}
            {selectedLevel && availableTopics.length > 0 && (
              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold mr-2">3</span>
                  Topic
                </label>
                <select
                  id="topic"
                  value={selectedTopicId}
                  onChange={(e) => setSelectedTopicId(e.target.value)}
                  onInput={(e) => setSelectedTopicId((e.target as HTMLSelectElement).value)}
                  onBlur={(e) => {
                    const v = (e.target as HTMLSelectElement).value;
                    if (v !== selectedTopicId) setSelectedTopicId(v);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">Select a topic…</option>
                  {availableTopics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Lesson plan — the primary "what are we doing today" picker.
                Visually emphasized: bigger, bolder, blue accent. When blank,
                the tutor runs in free-conversation mode. */}
            {selectedTopicId && availableLessonPlans.length > 0 && (
              <div className="rounded-lg border-2 border-blue-200 bg-blue-50/40 p-4">
                <label htmlFor="lesson-plan" className="block text-base font-semibold text-blue-900 mb-1">
                  ✨ Pick a lesson
                </label>
                <p className="text-xs text-blue-700/70 mb-3">
                  Or leave blank for open conversation.
                </p>
                <select
                  id="lesson-plan"
                  value={selectedLessonPlanId}
                  onChange={(e) => setSelectedLessonPlanId(e.target.value)}
                  onInput={(e) => setSelectedLessonPlanId((e.target as HTMLSelectElement).value)}
                  className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-base"
                >
                  <option value="">— Just chat (no plan) —</option>
                  {(() => {
                    // Group plans by CED unit when metadata.cedUnit is present.
                    // Falls back to a flat list when no plans have unit metadata
                    // (preserves current behavior for non-AP courses until they
                    // ship unit-grouping). See unit-titles.ts for the grouping
                    // helper that powers labels and keys uniformly.
                    const groups = new Map<string, typeof availableLessonPlans>();
                    let anyGrouped = false;
                    for (const p of availableLessonPlans) {
                      const md = p.metadata;
                      const cedUnit = md && typeof md.cedUnit === 'string' ? md.cedUnit : '';
                      const key = cedUnit || '__flat__';
                      if (cedUnit) anyGrouped = true;
                      const list = groups.get(key) ?? [];
                      list.push(p);
                      groups.set(key, list);
                    }
                    if (!anyGrouped) {
                      return availableLessonPlans.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title} · {p.estimatedMinutes} min
                        </option>
                      ));
                    }
                    // Render each group as <optgroup> with a UNIT header label.
                    // Sort group keys numerically so UNIT 1 → 2 → … → 10 order.
                    const sortedKeys = Array.from(groups.keys()).sort((a, b) => {
                      if (a === '__flat__') return 1;
                      if (b === '__flat__') return -1;
                      const an = parseFloat(a);
                      const bn = parseFloat(b);
                      if (Number.isFinite(an) && Number.isFinite(bn)) return an - bn;
                      return a.localeCompare(b);
                    });
                    return sortedKeys.map((groupKey) => {
                      const groupPlans = groups.get(groupKey) ?? [];
                      const sample = groupPlans[0];
                      // Use shared unit-titles helper so AP Calc BC, AP
                      // Stats, etc. ship the same grouping the moment they
                      // add a UNIT_TITLES entry — no per-page changes.
                      const label = groupKey === '__flat__'
                        ? 'Other'
                        : (sample ? unitLabel(sample) : `UNIT ${groupKey}`);
                      return (
                        <optgroup key={groupKey} label={label}>
                          {groupPlans.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.title} · {p.estimatedMinutes} min
                            </option>
                          ))}
                        </optgroup>
                      );
                    });
                  })()}
                </select>
              </div>
            )}

            {/* Mode is fixed to Voice — the in-session UI lets the
                student type as a fallback. No setup-time choice. */}


            {/* Start button */}
            <button
              id="tutor-start-btn"
              onClick={handleStartSession}
              disabled={!canStartSession}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {inputMode === 'voice' ? <Mic className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              Start {inputMode === 'voice' ? 'Voice' : ''} Session
            </button>
          </div>

          {/* Info */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Sessions are 30 minutes. You can end early anytime.</p>
            {inputMode === 'voice' && (
              <p className="mt-1 text-blue-600">Microphone access required for voice mode</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Render session stage
  if (stage === 'session') {
    return (
      <div ref={pageContainerRef} className="lg:fixed lg:inset-0 lg:overflow-hidden min-h-screen bg-gray-100 flex flex-col overflow-x-hidden">
        {/* Desmos Graphing Calculator API */}
        <Script
          src="https://www.desmos.com/api/v1.11/calculator.js?apiKey=47658ec5a4894397ae1e1a46a6174a9a"
          strategy="lazyOnload"
        />
        {/* Header */}
        <header className="flex-shrink-0 bg-white border-b px-4 py-2">
          <div className="container mx-auto flex items-center justify-between gap-2 sm:gap-4">
            <div className="min-w-0 flex-shrink-0 max-w-[60%] sm:max-w-[40%]">
              {/* When a lesson plan is active, the title IS the lesson — the
                  topic + level live in the subtitle. Otherwise, fall back
                  to topic display name + session-goal subtitle. */}
              {lessonProgress.plan ? (
                <>
                  <h1 className="font-semibold text-gray-900 truncate text-sm sm:text-base">
                    {lessonProgress.plan.title}
                  </h1>
                  {(() => {
                    // Current-LO subtitle: shows which LO the brain is
                    // currently in, derived from the conventional
                    // "<loId>-<kind>" segment id. Falls back to the
                    // topic + grade subtitle when no LO can be resolved
                    // (intro / picker / curated plan with non-loId
                    // segment ids).
                    const segId = lessonProgress.currentSegmentId || '';
                    const matchedLo = lessonProgress.plan?.los?.find(
                      (lo) => segId.startsWith(`${lo.id}-`) || segId === lo.id,
                    );
                    if (matchedLo) {
                      const idx = lessonProgress.plan.los.findIndex((lo) => lo.id === matchedLo.id);
                      return (
                        <p
                          className="text-xs text-blue-700 truncate"
                          title={matchedLo.description}
                        >
                          <span className="font-medium">LO {idx + 1}:</span>{' '}
                          {matchedLo.description}
                        </p>
                      );
                    }
                    return (
                      <p className="text-xs text-gray-500 truncate hidden sm:block">
                        {topicDisplayName} · grade {lessonProgress.plan.grade}
                      </p>
                    );
                  })()}
                </>
              ) : (
                <>
                  <h1 className="font-semibold text-gray-900 truncate">
                    {topicDisplayName || 'AI Tutor'}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {sessionGoal === 'practice'
                      ? 'Practice Session'
                      : sessionGoal === 'homework-help'
                      ? 'Homework Help'
                      : sessionGoal === 'concept-review'
                      ? 'Concept Review'
                      : 'Test Prep'}
                  </p>
                </>
              )}
            </div>
            {/* Lesson-plan progress strip — sits inline with the title on
                desktop; wraps to its own row on mobile so chips/LO pills
                aren't crushed by the title and timer. Hidden when no plan
                is active. */}
            {lessonProgress.plan && (
              <div className="w-full md:w-auto md:flex-1 min-w-0 overflow-x-auto">
                <LessonPlanProgress
                  plan={lessonProgress.plan}
                  currentSegmentId={lessonProgress.currentSegmentId}
                  completedSegmentIds={completedSegmentIds}
                />
              </div>
            )}
          </div>
        </header>

        {/* Session controls */}
        <div className="flex-shrink-0 container mx-auto px-4 py-1">
          <SessionControls
            sessionId={sessionId}
            maxDuration={30}
            onEndSession={handleEndSession}
            onUploadHomework={handleUploadHomework}
            transcript={transcript}
            whiteboardCommands={whiteboardCommands}
            topicName={topicDisplayName || 'AI Tutor'}
            sessionGoal={sessionGoal}
            studentName={studentName || undefined}
            subject={selectedSubject}
            level={selectedLevel}
          />
        </div>

        {/* The in-session lesson picker (LessonNudgePicker) used to
            render here as a separate strip above the chat. It now
            renders INSIDE TranscriptView as a tutor-style chat bubble
            via the `footer` prop — it feels like part of the
            conversation rather than a UI panel grafted on top. */}

        {/* Main content - resizable split on desktop, tabbed on mobile */}
        <div
          ref={splitContainerRef}
          className="flex-1 min-h-0 px-2 sm:px-4 py-1 flex flex-col"
        >
          {/* Status message banner */}
          {statusMessage && (
            <div className="flex items-center justify-center gap-2 py-1.5 px-4 mb-1 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700 animate-pulse flex-shrink-0">
              <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              {statusMessage}
            </div>
          )}

          {/* Mobile-only tab toggle. On desktop (lg+) the split layout
              shows both panels side-by-side and these tabs are hidden. */}
          <div className="lg:hidden flex gap-1 mb-2 bg-gray-100 rounded-lg p-1 flex-shrink-0">
            <button
              onClick={() => setMobileTab('chat')}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
                mobileTab === 'chat' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600'
              }`}
            >
              💬 Chat
            </button>
            <button
              onClick={() => setMobileTab('whiteboard')}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
                mobileTab === 'whiteboard' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600'
              }`}
            >
              📝 Board
              {whiteboardCommands.length > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                  {whiteboardCommands.length}
                </span>
              )}
            </button>
          </div>

          <div className="flex-1 min-h-0 flex flex-col lg:flex-row">
          {/* Transcript */}
          <div
            className={`min-h-0 bg-white rounded-lg shadow-lg overflow-hidden flex-col ${
              mobileTab === 'chat' ? 'flex' : 'hidden'
            } lg:flex`}
            style={{ width: isDesktop ? `${splitPercent}%` : '100%' }}
          >
            {/* Pacing v2 — Phase 3 ⋯ menu. Sits at the top-right of the
                transcript column. Holds rare-use pacing actions (Harder,
                Easier, Slow down, Speed up, Wrap up). Hidden when the
                NEXT_PUBLIC_PACING_V2_BUTTONS flag is off. */}
            {(() => {
              const v = process.env.NEXT_PUBLIC_PACING_V2_BUTTONS;
              const flagOn = v === undefined || v === null || v === ''
                ? true
                : !['false', '0', 'off', 'no'].includes(String(v).trim().toLowerCase());
              if (!flagOn) return null;
              const menuAction = (text: string) => {
                if (realtimeHandleRef.current) {
                  realtimeHandleRef.current.stopSpeaking();
                  realtimeHandleRef.current.sendTextMessage(text);
                }
                setPacingMenuOpen(false);
              };
              const paceBiasAction = (delta: -1 | 1) => {
                realtimeHandleRef.current?.stepPaceBias(delta);
                setPacingMenuOpen(false);
              };
              return (
                <div className="relative flex justify-end items-center gap-2 px-2 py-1 border-b border-gray-100">
                  {/* Phase 3: paceBias badge. Visible whenever bias ≠ 0
                      so the student knows the Slow down / Speed up
                      clicks took effect (the actual depth shift only
                      manifests on subsequent brain turns, so the click
                      would otherwise feel inert). Briefly flashes on
                      each step regardless of direction — including
                      clamp no-ops so the student gets acknowledgement
                      that the click was registered even when at ±2. */}
                  {(paceBias !== 0 || paceBiasFlash) && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border transition-all duration-200 ${
                        paceBiasFlash
                          ? 'bg-blue-100 border-blue-400 text-blue-800'
                          : paceBias < 0
                            ? 'bg-amber-50 border-amber-300 text-amber-800'
                            : 'bg-green-50 border-green-300 text-green-800'
                      }`}
                      aria-label={paceBias < 0 ? 'Pace: slower' : paceBias > 0 ? 'Pace: faster' : 'Pace neutral'}
                    >
                      {paceBias < 0 ? `Slower ×${Math.abs(paceBias)}` : paceBias > 0 ? `Faster ×${paceBias}` : 'Pace'}
                    </span>
                  )}
                  <button
                    type="button"
                    aria-label="Pacing options"
                    onClick={() => setPacingMenuOpen((o) => !o)}
                    className="px-2 py-1 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded text-base leading-none"
                  >
                    ⋯
                  </button>
                  {pacingMenuOpen && (
                    <>
                      {/* Backdrop catches outside-click to dismiss. */}
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setPacingMenuOpen(false)}
                      />
                      <div className="absolute right-2 top-full mt-1 z-20 w-44 bg-white border border-gray-200 rounded-md shadow-lg py-1 text-sm">
                        <button
                          type="button"
                          onClick={() => menuAction('Give me a harder one.')}
                          className="block w-full text-left px-3 py-1.5 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                        >
                          Harder
                        </button>
                        <button
                          type="button"
                          onClick={() => menuAction('Give me an easier one.')}
                          className="block w-full text-left px-3 py-1.5 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                        >
                          Easier
                        </button>
                        <div className="my-1 border-t border-gray-100" />
                        <button
                          type="button"
                          onClick={() => paceBiasAction(-1)}
                          className="block w-full text-left px-3 py-1.5 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                        >
                          Slow down
                        </button>
                        <button
                          type="button"
                          onClick={() => paceBiasAction(+1)}
                          className="block w-full text-left px-3 py-1.5 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                        >
                          Speed up
                        </button>
                        <div className="my-1 border-t border-gray-100" />
                        <button
                          type="button"
                          onClick={() => menuAction("I'm done — let's wrap up.")}
                          className="block w-full text-left px-3 py-1.5 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                        >
                          Wrap up
                        </button>
                        <div className="my-1 border-t border-gray-100" />
                        <div className="px-3 pt-1 pb-0.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Humor</div>
                        {(() => {
                          // Stage 4: in-session humor toggle. Grade-band cap
                          // hides medium/heavy for K-2 (the resolver clamps
                          // them anyway, but showing them would let the
                          // student pick something that silently doesn't
                          // apply). selectedLevel may be empty in setup
                          // mode but the menu itself only renders inside a
                          // running session, so it's reliably populated.
                          const band = gradeBandFor(selectedLevel || '');
                          const HUMOR_CHOICES: Array<{ value: StudentPreferences['humorCeiling'] | null; label: string; minBand: 'K-2' | '3-5' | '6-8' | '9-12' }> = [
                            { value: null, label: 'Default', minBand: 'K-2' },
                            { value: 'off', label: 'Serious', minBand: 'K-2' },
                            { value: 'light', label: 'A little funny', minBand: 'K-2' },
                            { value: 'medium', label: 'Pretty funny', minBand: '3-5' },
                            { value: 'heavy', label: 'Very funny', minBand: '6-8' },
                          ];
                          const BAND_RANK: Record<'K-2' | '3-5' | '6-8' | '9-12', number> = { 'K-2': 0, '3-5': 1, '6-8': 2, '9-12': 3 };
                          const current = studentPreferencesForChip.humorCeiling ?? null;
                          return HUMOR_CHOICES
                            .filter((c) => BAND_RANK[band] >= BAND_RANK[c.minBand])
                            .map((c) => {
                              const isSelected = current === c.value;
                              return (
                                <button
                                  key={c.value ?? 'default'}
                                  type="button"
                                  onClick={() => {
                                    if (c.value === null) clearStudentPreferenceForChip('humorCeiling');
                                    else setStudentPreferenceForChip('humorCeiling', c.value);
                                    setPacingMenuOpen(false);
                                  }}
                                  className={`block w-full text-left px-3 py-1 text-sm ${
                                    isSelected
                                      ? 'text-blue-700 bg-blue-50 font-medium'
                                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                                  }`}
                                >
                                  <span className="inline-block w-3">{isSelected ? '✓' : ''}</span>
                                  {' '}{c.label}
                                </button>
                              );
                            });
                        })()}
                      </div>
                    </>
                  )}
                </div>
              );
            })()}
            <div className="flex-1 min-h-0 overflow-y-auto">
              <TranscriptView
                transcript={transcript}
                isProcessing={isProcessing}
                pickerAnchorIndex={pickerAnchorIndex}
                // Pacing v2 — Phase 3: Skip ahead + I'm stuck chips.
                // Gated by NEXT_PUBLIC_PACING_V2_BUTTONS (default ON
                // for the combined Phase 1-3 test cycle). Set to
                // 'false' / '0' / 'off' to hide chips and ⋯ menu.
                enablePacingChips={(() => {
                  const v = process.env.NEXT_PUBLIC_PACING_V2_BUTTONS;
                  if (v === undefined || v === null || v === '') return true;
                  const s = String(v).trim().toLowerCase();
                  return s !== 'false' && s !== '0' && s !== 'off' && s !== 'no';
                })()}
                onQuickAnswer={(text) => {
                  // Quick-answer button tap: cut off the in-flight TTS
                  // bubble so the student isn't waiting on the prior
                  // turn to finish, then dispatch through the same
                  // channel as typed input. Bracketed system text in
                  // the message is stripped from the chat by
                  // TranscriptView's filter.
                  if (realtimeHandleRef.current) {
                    realtimeHandleRef.current.stopSpeaking();
                    realtimeHandleRef.current.sendTextMessage(text);
                  }
                }}
                picker={!nudgeDismissed && availableLessonPlans.length > 0 ? (
                  <LessonNudgePicker
                    plans={availableLessonPlans}
                    recentTurns={transcript.slice(-6).map(t => ({ role: t.role, text: t.text }))}
                    lessonStarted={!!selectedLessonPlanId || !!lessonProgress.plan}
                    currentTopicId={selectedTopicId}
                    introText={(() => {
                      const topic = topicDisplayName;
                      if (topic) {
                        return `I see you chose ${topic} — nice. You can tell me ANY topic in this area, or jump straight into one of these lessons:`;
                      }
                      return undefined;
                    })()}
                    onSelect={(plan) => {
                      setSelectedLessonPlanId(plan.id);
                      setNudgeDismissed(true);
                      if (realtimeHandleRef.current) {
                        // Combined message: student-visible prefix +
                        // bracketed system instruction. TranscriptView
                        // strips the bracketed part at render time so
                        // the student sees a clean "Let's do: ..." chat
                        // bubble (visual confirmation that their tap
                        // registered) while the brain receives the
                        // full text including the bracketed instruction
                        // not to invent segment ids (2026-04-29:
                        // hallucinated "intro" / "intro-1" because the
                        // brain didn't have the segments[] schema in
                        // context — the resolver also has a fallback
                        // to the first segment when the id is unknown).
                        // Strong OVERRIDE wording — earlier message
                        // was treated as soft suggestion and the brain
                        // ignored it, narrating an unrelated topic
                        // instead (2026-04-29 geometry session: brain
                        // taught Projectile Motion when the student
                        // had explicitly tapped Pythagorean Theorem,
                        // because its prior turn had teased "fun
                        // physics" and the synthetic msg was weak).
                        // Be explicit: cancel any prior tangent, this
                        // is the active lesson now.
                        // Also avoid nested brackets — the
                        // TranscriptView strip-regex is non-greedy.
                        realtimeHandleRef.current.sendTextMessage(
                          `Let's do: ${plan.title}. [SYSTEM OVERRIDE: The student has explicitly selected the lesson "${plan.title}" via the in-session picker. Disregard any prior teasing or conversational tangent. This is now the active lesson. Begin teaching it immediately by calling show_segment_card with the FIRST authored segment id from the plan that is now loaded; do not invent segment ids and do not narrate any other topic.]`,
                        );
                      }
                    }}
                    onDismiss={() => setNudgeDismissed(true)}
                  />
                ) : undefined}
              />
            </div>
          </div>

          {/* Draggable split handle */}
          <div
            onMouseDown={handleSplitMouseDown}
            className="hidden lg:flex w-4 cursor-col-resize items-center justify-center group hover:bg-blue-100 active:bg-blue-200 transition-colors flex-shrink-0 rounded"
            title="Drag to resize panels"
          >
            <div className="flex flex-col gap-1 items-center">
              <div className="w-1 h-1 rounded-full bg-gray-400 group-hover:bg-blue-500" />
              <div className="w-1 h-1 rounded-full bg-gray-400 group-hover:bg-blue-500" />
              <div className="w-1 h-1 rounded-full bg-gray-400 group-hover:bg-blue-500" />
              <div className="w-1 h-1 rounded-full bg-gray-400 group-hover:bg-blue-500" />
              <div className="w-1 h-1 rounded-full bg-gray-400 group-hover:bg-blue-500" />
              <div className="w-1 h-1 rounded-full bg-gray-400 group-hover:bg-blue-500" />
            </div>
          </div>

          {/* Whiteboard — full width on mobile (when its tab is active),
              splitPercent-based width on desktop. */}
          <div
            className={`min-h-0 bg-white rounded-lg shadow-lg overflow-hidden flex-col h-full ${
              mobileTab === 'whiteboard' ? 'flex' : 'hidden'
            } lg:flex`}
            style={{ width: isDesktop ? `${100 - splitPercent}%` : '100%' }}
          >
            <WhiteboardCanvas
              commands={whiteboardCommands}
              tutorBusy={isProcessing && whiteboardActiveThisTurn}
              onClear={() => setWhiteboardCommands([])}
              onAttentionShift={() => {
                // Tutor wants the student to look at the board — auto-
                // switch mobile tabs so they actually see it. No-op on
                // desktop where both panels are visible.
                if (!isDesktop) setMobileTab('whiteboard');
              }}
              onTryYourselfAnswer={(answer, expected, isCorrect) => {
                // Route the student's submitted answer back to the brain
                // as a synthetic student turn so the tutor can react with
                // personalized feedback. Wrap in a marker the brain
                // recognizes as a structured submission (not free chat).
                //
                // The marker is intentionally NEUTRAL when isCorrect is
                // null (compareAnswer returns null for FRQ where string
                // normalization is unreliable — see WhiteboardCanvas.tsx).
                // Asserting "does not match expected" in that case biased
                // the brain toward calling correct-but-different-form
                // answers wrong (the 2026-04-29 pre-calc session: student
                // wrote -1/√2, expected -√2/2 — algebraically identical
                // but the marker said "does not match" and the brain had
                // to fight that bias).
                const verdict =
                  isCorrect === true ? 'matches the expected answer (string-equal)'
                  : isCorrect === false ? 'does NOT match the expected answer'
                  : '(undecidable by string match — judge equivalence yourself, accepting any algebraically-correct form)';
                // Wrap the WHOLE marker in [...] so TranscriptView strips
                // it from the visible chat. Previously only the
                // "[try-yourself submission]" prefix was bracketed; the
                // rest leaked into the student bubble (observed
                // 2026-04-30 pre-calc session). Brain still sees the
                // full text in its prompt.
                //
                // ALSO note: do NOT advance to a new problem on a wrong
                // verdict. Re-prompt the same try-yourself with a hint.
                // (Reinforced via the system prompt's
                // answer-validation gate, but called out here too so
                // anyone reading this code understands the intent.)
                const marker = expected
                  ? `[try-yourself submission. The student submitted: "${answer}". Expected: ${expected}. Verdict: ${verdict}. If "does NOT match", stay on this same try-yourself — give a hint, do NOT call new_page or show a different problem. If undecidable, judge algebraic equivalence yourself.]`
                  : `[try-yourself submission. The student submitted: "${answer}". No expected answer set — judge correctness yourself. If wrong, stay on this same try-yourself; do NOT advance to a new problem.]`;
                if (realtimeHandleRef.current) {
                  realtimeHandleRef.current.sendTextMessage(marker);
                }
              }}
              onStudentInput={(type, content) => {
                // Add student input to whiteboard as a command
                const cmd: WhiteboardCommand = type === 'image'
                  ? { action: 'showSvgDiagram', title: 'Student Upload', svg: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><image href="${content}" x="5" y="5" width="390" height="290" preserveAspectRatio="xMidYMid meet"/></svg>` } as WhiteboardCommand
                  : type === 'drawing'
                  ? { action: 'showSvgDiagram', title: 'Student Drawing', svg: `<svg viewBox="0 0 400 150" xmlns="http://www.w3.org/2000/svg"><image href="${content}" x="5" y="5" width="390" height="140" preserveAspectRatio="xMidYMid meet"/></svg>` } as WhiteboardCommand
                  // Plain text — render as SVG text, NOT LaTeX (avoids mangling x, =, etc.)
                  : { action: 'showSvgDiagram', title: 'Student Answer', svg: `<svg viewBox="0 0 400 60" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="390" height="50" rx="8" fill="#eff6ff" stroke="#bfdbfe" stroke-width="1"/><text x="200" y="22" text-anchor="middle" font-size="11" fill="#6b7280">Student wrote:</text><text x="200" y="42" text-anchor="middle" font-size="16" font-weight="bold" fill="#1e40af">${content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</text></svg>` } as WhiteboardCommand;

                setWhiteboardCommands(prev => [...prev, cmd]);

                // Show status message while processing
                if (type === 'drawing') setStatusMessage('✏️ Reading your drawing...');
                else if (type === 'image') setStatusMessage('📷 Analyzing your image...');
                else if (type === 'text') setStatusMessage('💬 Processing...');

                // Notify the AI about the student's input
                if (realtimeHandleRef.current) {
                  if (type === 'text') {
                    realtimeHandleRef.current.sendTextMessage(
                      `[The student wrote on the whiteboard: "${content}". Respond to what they wrote.]`
                    );
                    setTimeout(() => setStatusMessage(null), 1000);
                  } else if (type === 'drawing') {
                    // Send drawing to Claude to extract what's written, then tell the AI
                    (async () => {
                      try {
                        // Strip data URL prefix to get raw base64
                        const base64Data = content.replace(/^data:image\/\w+;base64,/, '');
                        const resp = await fetch('/api/tutor/extract-homework', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            imageData: base64Data,
                            mimeType: 'image/png',
                            subject: selectedSubject,
                            topic: selectedTopicId,
                            level: selectedLevel,
                          }),
                        });
                        const data = await resp.json();
                        setStatusMessage(null);
                        if (data.extractedProblem && realtimeHandleRef.current) {
                          realtimeHandleRef.current.sendTextMessage(
                            `[The student drew on the whiteboard. Their drawing contains: "${data.extractedProblem}". Respond to what they drew and wrote.]`
                          );
                        } else if (realtimeHandleRef.current) {
                          realtimeHandleRef.current.sendTextMessage(
                            `[The student drew something on the whiteboard. Ask them to explain what they drew.]`
                          );
                        }
                      } catch {
                        setStatusMessage(null);
                        realtimeHandleRef.current?.sendTextMessage(
                          `[The student drew something on the whiteboard. Ask them to explain what they drew.]`
                        );
                      }
                    })();
                  } else if (type === 'image') {
                    // Process image through vision to extract content before telling the AI
                    (async () => {
                      try {
                        const base64Data = content.replace(/^data:image\/\w+;base64,/, '');
                        const resp = await fetch('/api/tutor/extract-homework', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            imageData: base64Data,
                            mimeType: 'image/png',
                            subject: selectedSubject,
                            topic: selectedTopicId,
                            level: selectedLevel,
                          }),
                        });
                        const data = await resp.json();
                        setStatusMessage(null);
                        if (data.extractedProblem && realtimeHandleRef.current) {
                          realtimeHandleRef.current.sendTextMessage(
                            `[The student uploaded an image to the whiteboard. The image contains: "${data.extractedProblem}". Respond to what they shared.]`
                          );
                        } else if (realtimeHandleRef.current) {
                          realtimeHandleRef.current.sendTextMessage(
                            `[The student uploaded an image to the whiteboard but the content could not be extracted. Ask them to describe what the image shows.]`
                          );
                        }
                      } catch {
                        setStatusMessage(null);
                        realtimeHandleRef.current?.sendTextMessage(
                          `[The student uploaded an image to the whiteboard but it could not be analyzed. Ask them to describe what the image shows.]`
                        );
                      }
                    })();
                  }
                }

                trackInteraction('click', `whiteboard-${type}`, { content: content.slice(0, 100) });
              }}
            />
          </div>
          </div>{/* close inner flex */}
        </div>

        {/* Vertical resize handle — desktop only; mobile uses tabs and
            doesn't need a vertical drag-to-resize splitter. */}
        <div
          onMouseDown={handleVerticalMouseDown}
          className="hidden lg:flex flex-shrink-0 h-2 cursor-row-resize items-center justify-center group hover:bg-blue-100 active:bg-blue-200 transition-colors bg-white border-t"
          title="Drag to resize"
        >
          <div className="flex gap-1 items-center">
            <div className="w-1 h-1 rounded-full bg-gray-400 group-hover:bg-blue-500" />
            <div className="w-1 h-1 rounded-full bg-gray-400 group-hover:bg-blue-500" />
            <div className="w-1 h-1 rounded-full bg-gray-400 group-hover:bg-blue-500" />
            <div className="w-1 h-1 rounded-full bg-gray-400 group-hover:bg-blue-500" />
            <div className="w-1 h-1 rounded-full bg-gray-400 group-hover:bg-blue-500" />
            <div className="w-1 h-1 rounded-full bg-gray-400 group-hover:bg-blue-500" />
          </div>
        </div>

        {/* Input area. On mobile, the voice-tutor's text input wraps to a
            second row (flex-wrap), which a fixed-height parent + overflow-hidden
            would clip. So height is fixed only on desktop; on mobile we let
            the row grow to fit its wrapped contents. */}
        <div
          className={`bg-white flex-shrink-0 ${inputMode === 'voice' ? 'px-2 py-0' : 'px-4 py-4 overflow-hidden'} lg:overflow-hidden`}
          style={isDesktop ? { height: `${inputHeight}px` } : undefined}
        >
          <div className={inputMode === 'voice' ? '' : 'container mx-auto'}>
            {voiceTrouble && inputMode === 'voice' && (
              <div className="mb-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-md text-xs text-amber-900 flex items-center gap-2">
                <span>⚠️</span>
                <span>{voiceTrouble}</span>
              </div>
            )}
            {inputMode === 'voice' && selectedTopicId ? (
              (voiceEngine === 'realtime' || voiceEngine === 'realtime-2' || voiceEngine === 'realtime-validated' || voiceEngine === 'claude-brain') ? (
                <VoiceTutorRealtime
                  // key={sessionId} forces a remount on every new session
                  // so the component's internal refs (transcriptRef,
                  // lessonPlanRef, catalogRef, queuedTranscriptsRef, the
                  // judge/brain busy flags) start fresh. Without this,
                  // session 2 inherits session 1's state — observed
                  // 2026-04-29: a stale lessonPlanRef in a "no plan"
                  // re-start narrated Systems-of-Linear-Equations
                  // because the prior plan was still loaded.
                  key={sessionId}
                  subject={selectedSubject}
                  topic={selectedTopicId}
                  level={selectedLevel}
                  studentName={studentName || undefined}
                  studentId={studentIdParam}
                  sessionId={sessionId}
                  sessionStartedAtMs={sessionStartTimeRef.current?.getTime()}
                  sessionGoal={sessionGoal}
                  lessonPlanId={selectedLessonPlanId || undefined}
                  voice={selectedOpenAIVoice}
                  onTranscriptUpdate={handleVoiceTranscriptUpdate}
                  onWhiteboardCommand={handleVoiceWhiteboardCommand}
                  onUsageUpdate={handleRealtimeUsage}
                  onDebugEvent={addDebugEvent}
                  onError={(err) => setError(err.message)}
                  onTranscriptionStatus={handleTranscriptionStatus}
                  onEndSession={handleEndSession}
                  onTrackInteraction={trackInteraction}
                  handleRef={realtimeHandleRef}
                  validateToolCalls={voiceEngine === 'realtime-validated'}
                  claudeBrainMode={voiceEngine === 'claude-brain'}
                  useRealtimeV2={voiceEngine === 'realtime-2'}
                  ttsProvider={ttsProvider}
                  onLessonPlanProgress={setLessonProgress}
                  onTutorBusy={setIsProcessing}
                  onPaceBiasChange={(bias) => {
                    setPaceBias(bias);
                    setPaceBiasFlash(true);
                    if (paceBiasFlashTimeoutRef.current) clearTimeout(paceBiasFlashTimeoutRef.current);
                    paceBiasFlashTimeoutRef.current = setTimeout(() => setPaceBiasFlash(false), 1600);
                  }}
                  onInterruptedChange={setIsPerceptionInterrupted}
                  onBeforeTypedSubmit={handleBeforeTypedSubmit}
                  onProposePlanSwap={handleProposePlanSwap}
                  onConfirmPlanLos={handleConfirmPlanLos}
                  onCompletedSegmentsChange={setCompletedSegmentIds}
                  sessionMaxMinutes={30}
                />
              ) : voiceEngine === 'gemini-live' ? (
                <VoiceTutorGemini
                  key={sessionId}
                  subject={selectedSubject}
                  topic={selectedTopicId}
                  level={selectedLevel}
                  studentName={studentName || undefined}
                  sessionGoal={sessionGoal}
                  voice={selectedOpenAIVoice}
                  onTranscriptUpdate={handleVoiceTranscriptUpdate}
                  onWhiteboardCommand={handleVoiceWhiteboardCommand}
                  onUsageUpdate={handleRealtimeUsage}
                  onError={(err) => setError(err.message)}
                  onEndSession={handleEndSession}
                  onTrackInteraction={trackInteraction}
                />
              ) : (
                <VoiceTutor
                  subject={selectedSubject}
                  topic={selectedTopicId}
                  level={selectedLevel}
                  studentName={studentName || undefined}
                  sessionGoal={sessionGoal}
                  voiceId={selectedVoice}
                  externalConversationHistory={conversationHistory}
                  externalTranscript={transcript}
                  onTranscriptUpdate={handleVoiceTranscriptUpdate}
                  onWhiteboardCommand={handleVoiceWhiteboardCommand}
                  onConversationHistoryUpdate={handleVoiceConversationHistoryUpdate}
                  onError={(err) => setError(err.message)}
                  onEndSession={handleEndSession}
                  onTrackInteraction={trackInteraction}
                />
              )
            ) : inputMode === 'text' ? (
              <form onSubmit={handleSubmit} className="flex gap-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isProcessing}
                  // Q9: yellow ring during the perception-cancel transient
                  // window (~300ms) so the student sees a visible "I heard
                  // you" signal even before the classifier verdict
                  // resolves.
                  className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 ${
                    isPerceptionInterrupted
                      ? 'border-yellow-400 ring-4 ring-yellow-400 ring-opacity-50'
                      : 'border-gray-300'
                  }`}
                />
                <button
                  type="submit"
                  disabled={isProcessing || !inputText.trim()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {isProcessing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                  Send
                </button>
              </form>
            ) : (
              <div className="text-center text-gray-500 py-4">
                Loading session...
              </div>
            )}
          </div>
        </div>

        {/* Error toast */}
        {error && (
          <div className="fixed bottom-20 right-4 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}
      </div>
    );
  }

  // Render summary stage
  // Pull what was covered + how far the lesson plan got + minutes used.
  const sessionSummary = realtimeHandleRef.current?.getSessionSummary?.() ?? { topicsCovered: [], weakTopics: [] };
  const segmentsCompletedIdx = lessonProgress.plan
    ? lessonProgress.plan.segments.findIndex((s) => s.id === lessonProgress.currentSegmentId)
    : -1;
  const segmentsCompleted = lessonProgress.plan
    ? (segmentsCompletedIdx >= 0 ? segmentsCompletedIdx : lessonProgress.plan.segments.length)
    : 0;
  const totalSegments = lessonProgress.plan?.segments.length ?? 0;
  const planCompletePct = totalSegments > 0 ? Math.round((segmentsCompleted / totalSegments) * 100) : 0;
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🎉</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Nice work, {studentName || 'student'}!
          </h1>
          <p className="text-gray-600">
            {lessonProgress.plan
              ? `You spent time on ${lessonProgress.plan.title}.`
              : `You spent time on ${topicDisplayName || 'AI Tutor'}.`}
          </p>
        </div>

        {/* Lesson plan progress card — only when a plan was active. */}
        {lessonProgress.plan && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="text-base font-semibold text-gray-800">Lesson progress</h2>
              <span className="text-sm font-medium text-gray-600">
                {segmentsCompleted} of {totalSegments} segments · {planCompletePct}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-gray-100 overflow-hidden mb-4">
              <div className="h-full bg-blue-600 transition-all" style={{ width: `${planCompletePct}%` }} />
            </div>
            <div className="flex flex-wrap gap-2">
              {lessonProgress.plan.segments.map((s, i) => {
                const done = i < segmentsCompleted;
                return (
                  <span
                    key={s.id}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      done ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {done ? '✓' : '○'} {s.kind.replace(/_/g, ' ')}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* What you covered */}
        {sessionSummary.topicsCovered.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-base font-semibold text-gray-800 mb-3">What you covered</h2>
            <ul className="space-y-1.5">
              {sessionSummary.topicsCovered.map((t, i) => (
                <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Areas to revisit (only when present) */}
        {sessionSummary.weakTopics.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-l-4 border-amber-400">
            <h2 className="text-base font-semibold text-gray-800 mb-1">Worth revisiting</h2>
            <p className="text-xs text-gray-500 mb-3">Topics that came up more than once — try a focused practice session.</p>
            <ul className="space-y-1.5">
              {sessionSummary.weakTopics.slice(0, 5).map((w, i) => (
                <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">⚡</span>
                  <span>{w.topic}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Suggested next step — pull from the lesson plan's followUps if any */}
        {lessonProgress.plan && lessonProgress.plan.followUps && lessonProgress.plan.followUps.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <h2 className="text-base font-semibold text-blue-900 mb-2">Suggested next</h2>
            <p className="text-sm text-blue-800">
              When you&apos;re ready, the natural next step is one of: <span className="font-medium">{lessonProgress.plan.followUps.join(', ')}</span>
            </p>
          </div>
        )}

        {/* Stats card */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-lg shadow p-3 text-center">
            <p className="text-xs text-gray-500">Messages</p>
            <p className="text-xl font-bold text-gray-900">{transcript.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-3 text-center">
            <p className="text-xs text-gray-500">Whiteboard items</p>
            <p className="text-xl font-bold text-gray-900">{whiteboardCommands.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-3 text-center">
            <p className="text-xs text-gray-500">Topic</p>
            <p className="text-sm font-medium text-gray-900 truncate" title={topicDisplayName}>{topicDisplayName || 'N/A'}</p>
          </div>
        </div>

        <div className="flex gap-4 justify-center flex-wrap">
          {transcript.length > 0 && (
            <button
              onClick={async () => {
                try {
                  const { exportTutorSessionPDF } = await import('@/lib/utils/export/pdf-tutor-session');
                  await exportTutorSessionPDF(
                    transcript,
                    whiteboardCommands,
                    topicDisplayName || 'AI Tutor',
                    sessionGoal,
                    studentName || undefined,
                    { subject: selectedSubject, level: selectedLevel }
                  );
                } catch (err) {
                  console.error('PDF export error:', err);
                }
              }}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Session PDF
            </button>
          )}
          <button
            onClick={() => {
              // Full reset between sessions. Earlier minimal version
              // left selectedLessonPlanId, lesson progress, picker
              // dismissal, debug events, and the wb event log dirty;
              // session 2 then loaded the prior session's plan + ref
              // state. Match handleStartSession so both entry points
              // start clean.
              setSessionId(`session-${Date.now()}`);
              setTranscript([]);
              setConversationHistory([]);
              setWhiteboardCommands([]);
              whiteboardEventsRef.current = [];
              setTokenUsage([]);
              setSelectedLessonPlanId('');
              setLessonProgress({ plan: null, currentSegmentId: '' });
              setNudgeDismissed(false);
              setPickerAnchorIndex(null);
              setStatusMessage(null);
              setError(null);
              debugEventsRef.current = [];
              lastSavedDebugCountRef.current = 0;
              lastSavedTokenCountRef.current = 0;
              sessionEndedRef.current = false;
              setStage('setup');
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start New Session
          </button>
          <Link
            href="/"
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
