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
  SESSION_GOALS,
  buildDisplayName,
  getTopicLabel,
} from '@/lib/tutor/topic-taxonomy';
import Link from 'next/link';
import { TranscriptView } from './components/TranscriptView';
import { SessionControls } from './components/SessionControls';
import { WhiteboardCanvas } from './components/whiteboard';
import { VoiceTutor } from './components/VoiceTutor';
import { VoiceTutorRealtime, type RealtimeHandle, type TutorResumeState } from './components/VoiceTutorRealtime';
import { LessonPlanProgress } from './components/LessonPlanProgress';
import { LessonNudgePicker } from './components/LessonNudgePicker';
import LessonPicker from './components/LessonPicker';
import { type VoiceState } from './components/session/SessionStage';
import TutorSession from './components/session/TutorSession';
import { getQuickActions } from '@/lib/tutor/quick-actions';
import { usePlanIndex } from './hooks/usePlanIndex';
import type { PlanIndexEntry } from '@/lib/tutor/lesson-plan/plan-index-types';
import type { LessonPlan as LessonPlanType } from '@/lib/tutor/lesson-plan/types';
import { VoiceTutorGemini } from './components/VoiceTutorGemini';
import { getInitialGreetingPrompt } from '@/lib/tutor/ai/system-prompt-builder';
import { gradeBandFor } from '@/lib/tutor/pedagogy/grade-profile';
import { buildResumeState, type PriorSessionRead } from '@/lib/tutor/portal/resume';
import {
  resolveOpeningBehavior,
  assembleOpeningInput,
  deriveResumeSignal,
  isPedagogyOpenerFlagValue,
  type OpeningSignals,
  type SessionMode,
} from '@/lib/tutor/ai/opening-behavior';
import { shouldShowDemoCta } from '@/lib/tutor/demo-cta';
import { detectDemoIntent } from '@/lib/tutor/demo-intent';
import { DEMO_TEACHERS } from '@/lib/tutor/ai/teacher-persona';
import { useStudentPreferences } from '@/hooks/useStudentPreferences';
import type { StudentPreferences } from '@/lib/tutor/student-profile/types';
import type { LastOpenerRecord } from '@/lib/tutor/student-profile/transient-context';
import type { SessionGoal, TranscriptEntry, VoiceId, AVAILABLE_VOICES } from '@/lib/tutor/types';
import type { SocialThread, ProgressDigest } from '@evelyn/portal-contract/v1';
import type { WhiteboardCommand } from '@/lib/knowledge/types';
import type { OpenAIVoice } from './hooks/useOpenAIRealtime';

type InputMode = 'text' | 'voice';
type VoiceEngine = 'classic' | 'realtime' | 'realtime-2' | 'realtime-validated' | 'claude-brain' | 'gemini-live';

// Voice settings from environment variables (hides UI options)
const ENV_VOICE_ENGINE = (process.env.NEXT_PUBLIC_TUTOR_VOICE_ENGINE as VoiceEngine) || 'classic';
const ENV_OPENAI_VOICE = (process.env.NEXT_PUBLIC_TUTOR_VOICE_OPENAI as OpenAIVoice) || 'alloy';
const ENV_CLASSIC_VOICE = (process.env.NEXT_PUBLIC_TUTOR_VOICE_CLASSIC as VoiceId) || 'male-1';
// Task B2 — proactive opener wiring (orchestrator). Client-side, DEFAULT OFF.
// Mirrors the same flag read in VoiceTutorRealtime.tsx (single env var,
// read independently in each module — no shared runtime state needed).
// See project_tutor_pedagogy_opener_calibration + .superpowers/sdd/task-B2-brief.md.
const TUTOR_PEDAGOGY_OPENER = isPedagogyOpenerFlagValue(process.env.NEXT_PUBLIC_TUTOR_PEDAGOGY_OPENER);

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
  // Task H2 (dev-only): the pedagogy-harness driver can override/augment the
  // subscribed-session identity via the NODE_ENV-guarded __tutorTestStart
  // hook below, without needing a page navigation. These are only ever set
  // by that hook (never by production UI), so in production builds they stay
  // at their initial values and `effectiveStudentId === studentIdParam`.
  //   - testStudentIdOverride → flows everywhere studentIdParam used to
  //     (profile-block fetch, opener hasPortalContext, session-end commits).
  //   - testSocialMemory / testProgressDigest → the TRANSIENT context props
  //     (Task D1b, embed carrier) which the main page has no source for —
  //     passed to both VoiceTutorRealtime render sites, gated on
  //     TUTOR_PEDAGOGY_OPENER so flag-off sessions are unchanged.
  const [testStudentIdOverride, setTestStudentIdOverride] = useState<string | undefined>(undefined);
  const [testSocialMemory, setTestSocialMemory] = useState<SocialThread[] | undefined>(undefined);
  const [testProgressDigest, setTestProgressDigest] = useState<ProgressDigest | undefined>(undefined);
  // Opener-recency (part A): testLastOpener rides the same dev-only carrier
  // as testSocialMemory (the __tutorTestStart hook is its only writer);
  // testOpenerRecordRef stashes the session's OWN captured opener record
  // (VoiceTutorRealtime's onOpenerRecord callback) for __tutorTestState.
  const [testLastOpener, setTestLastOpener] = useState<LastOpenerRecord | undefined>(undefined);
  // Harness overrides for signals the standalone page has no production
  // source for (same dev-only carrier as testSocialMemory — the
  // __tutorTestStart hook is the only writer, so production markup is
  // unchanged at the defaults):
  //   - testSessionMaxMinutes → the sessionMaxMinutes prop at both render
  //     sites (default 30 = the literal the page always passed), so the E2
  //     soft-close row can run against a live-testable ~5-minute budget.
  //   - testTargetKind → explicit OpeningSignals.targetKind ('diagnostic'
  //     is only reachable this way on this page; embeds use target_kind).
  //   - testCheckpointStale → OpeningSignals.resume.checkpointStale (the
  //     resume-stale journey; embeds derive it via resolveResumeOutcome).
  const [testSessionMaxMinutes, setTestSessionMaxMinutes] = useState(30);
  const [testTargetKind, setTestTargetKind] = useState<SessionMode | undefined>(undefined);
  const [testCheckpointStale, setTestCheckpointStale] = useState(false);
  const testOpenerRecordRef = useRef<LastOpenerRecord | null>(null);
  const handleOpenerRecord = useCallback((rec: LastOpenerRecord) => {
    testOpenerRecordRef.current = rec;
  }, []);
  const effectiveStudentId = testStudentIdOverride ?? studentIdParam;
  // /tutor?sid=<sessionId> — a stable session id carried in the URL so a
  // reload reconnects to the same engine session instead of minting a fresh
  // one. Written on session start (window.history.replaceState); read here to
  // drive reload auto-resume below.
  const sidParam = searchParams.get('sid') || '';

  const [stage, setStage] = useState<'setup' | 'session' | 'summary'>('setup');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState('');
  // Lesson-plan selection. Optional — when set, the brain runs in
  // plan-driven mode (treats segments as a teaching script) instead of
  // free-conversation mode.
  const [selectedLessonPlanId, setSelectedLessonPlanId] = useState('');
  // In-memory catalog index — powers instant quick-search + the cascade and
  // (below) the in-session lesson nudge, with zero per-interaction DB hits.
  const planIndex = usePlanIndex();
  // Lessons available for the active (resolved) cell — derived in-memory from
  // the index (replaces the old per-cascade DB fetch). Used by the setup
  // picker and the in-session nudge.
  const availableLessonPlans = useMemo(() => {
    if (!selectedSubject || !selectedLevel || !selectedTopicId) return [];
    return planIndex.lessonsFor(selectedSubject, selectedLevel, selectedTopicId).map((e) => ({
      id: e.id,
      title: e.title,
      topic: e.cellTopic ?? e.topic,
      los: e.firstLo ? [{ id: 'lo0', description: e.firstLo }] : [],
      estimatedMinutes: e.estimatedMinutes,
      metadata: { cedUnit: e.cedUnit, cedTopic: e.cedTopic, cedTitle: e.cedTitle },
    }));
  }, [planIndex, selectedSubject, selectedLevel, selectedTopicId]);
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
  // Teacher persona (demo picker) — flag-gated on TUTOR_PEDAGOGY_OPENER.
  // Default = first house teacher; the setup stage renders a "Your teacher"
  // selector (flag-on only) and the dev __tutorTestStart hook can pin one
  // via cfg.teacherId. Flag off ⇒ selectedTeacher is never passed anywhere
  // and effectiveOpenAIVoice === selectedOpenAIVoice (markup unchanged).
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(DEMO_TEACHERS[0].id);
  const selectedTeacher = useMemo(
    () => DEMO_TEACHERS.find((t) => t.id === selectedTeacherId) ?? DEMO_TEACHERS[0],
    [selectedTeacherId],
  );
  // When the chosen teacher maps to an OpenAI Realtime voice, the session
  // speaks in THAT voice (flag-on only).
  const effectiveOpenAIVoice: OpenAIVoice =
    TUTOR_PEDAGOGY_OPENER && selectedTeacher.voice?.provider === 'openai'
      ? (selectedTeacher.voice.voiceId as OpenAIVoice)
      : selectedOpenAIVoice;

  // Session state
  // Reuse the URL's sid on reload so the engine session id is stable; else mint.
  const [sessionId, setSessionId] = useState(() => sidParam || `session-${Date.now()}`);
  // Resume snapshot to seed the runtime when reloading into an in-progress
  // session (null = fresh). resumeBooting holds the first render while the
  // checkpoint read is in flight so we don't flash the setup screen.
  const [resumeState, setResumeState] = useState<TutorResumeState | null>(null);
  const [resumeBooting, setResumeBooting] = useState(() => !!sidParam);
  // Legacy-layout "Continue lesson" overlay gate (the new SessionStage UI owns
  // its own overlay inside TutorSession). True while a resumed session is
  // rehydrated but the student hasn't tapped Continue yet.
  const [awaitingResume, setAwaitingResume] = useState(false);
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
  // e2e: always-fresh mirror of the full transcript (the turn-ok console log
  // truncates spoken text to ~80 chars; the Phase-2 judge needs the FULL
  // narration). A ref because a tutor turn is one entry whose text grows
  // mid-stream without changing transcript.length — a length-keyed closure
  // would capture stale text.
  const transcriptStateRef = useRef<TranscriptEntry[]>([]);

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
      // Lesson-phase position checkpoint (contract v1.2.0) so a reload can
      // resume where the student left off. Only present for plan-driven
      // sessions; written on every save (periodic + the per-advance save).
      ...(lessonProgress.plan ? {
        lessonProgress: {
          lessonPlanId: lessonProgress.plan.id,
          currentSegmentId: lessonProgress.currentSegmentId,
          completedSegmentIds: [...completedSegmentIds],
        },
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
  }, [sessionId, selectedSubject, selectedLevel, selectedTopicId, stage, sessionGoal, inputMode, voiceEngine, studentName, transcript.length, whiteboardCommands.length, tokenUsage, lessonProgress.plan, lessonProgress.currentSegmentId, completedSegmentIds]);

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

  // Persist the position checkpoint promptly on each segment change (the 30s
  // periodic flush would otherwise leave resume up to 30s stale). saveSessionUsage
  // already carries the lessonProgress checkpoint; this just triggers it.
  useEffect(() => {
    if (stage !== 'session' || !lessonProgress.plan) return;
    saveSessionUsageRef.current('active');
  }, [stage, lessonProgress.plan, lessonProgress.currentSegmentId, completedSegmentIds]);

  // Reload auto-resume: when the URL carries a ?sid= and that session has a
  // fresh checkpoint, rebuild the session config from the persisted doc, seed
  // the runtime (position + transcript + whiteboard via resumeState), and boot
  // straight into the session — skipping setup. Runs once on mount. Anything
  // missing / stale / completed → fall through to the normal setup screen.
  useEffect(() => {
    if (!sidParam) return; // resumeBooting already false → normal setup
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/tutor/session-usage?sessionId=${encodeURIComponent(sidParam)}`);
        if (res.ok) {
          const data = (await res.json()) as PriorSessionRead;
          const rs = buildResumeState(data);
          // Resume whenever a FRESH checkpoint exists — regardless of status.
          // 'completed'/'abandoned' both resume (the student reloaded or ended
          // and wants to continue); freshness is bounded by RESUME_MAX_AGE_MS
          // inside buildResumeState. (Was gated on status !== 'completed', which
          // silently refused to resume any session the student had ended — the
          // real reason reload-resume looked "still silent" in testing.)
          if (!cancelled && rs && data.exists) {
            if (data.subject) setSelectedSubject(data.subject);
            if (data.level) setSelectedLevel(data.level);
            if (data.topic) setSelectedTopicId(data.topic);
            if (data.lessonProgress?.lessonPlanId) setSelectedLessonPlanId(data.lessonProgress.lessonPlanId);
            if (data.sessionGoal) setSessionGoal(data.sessionGoal as SessionGoal);
            if (data.studentName) setStudentName(data.studentName);
            if (data.inputMode === 'text' || data.inputMode === 'voice') setInputMode(data.inputMode);
            sessionStartTimeRef.current = data.startedAt ? new Date(data.startedAt) : new Date();
            // Start the whiteboard persistence buffers empty so the resume seed
            // (replayed once through onWhiteboardCommand) populates them exactly
            // once — no doubling. On a fresh reload these are already empty; the
            // clear keeps the invariant explicit and matches the summary-resume path.
            whiteboardEventsRef.current = [];
            setWhiteboardCommands([]);
            setResumeState(rs);
            setStage('session');
          }
        }
      } catch {
        // Read failed → fall through to the normal setup screen below.
      }
      if (!cancelled) setResumeBooting(false);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Derived taxonomy state
  const topicDisplayName = useMemo(
    () => selectedTopicId ? buildDisplayName(selectedSubject, selectedLevel, selectedTopicId) : '',
    [selectedSubject, selectedLevel, selectedTopicId]
  );
  const canStartSession = !!(selectedSubject && selectedLevel && selectedTopicId);

  // Reset downstream selections when a parent dropdown changes. (availableLessonPlans
  // is derived from the index, so it clears automatically.)
  const handleSubjectChange = useCallback((subjectId: string) => {
    setSelectedSubject(subjectId);
    setSelectedLevel('');
    setSelectedTopicId('');
    setSelectedLessonPlanId('');
  }, []);

  const handleLevelChange = useCallback((levelId: string) => {
    setSelectedLevel(levelId);
    setSelectedTopicId('');
    setSelectedLessonPlanId('');
  }, []);

  const handleTopicChange = useCallback((topicId: string) => {
    setSelectedTopicId(topicId);
    setSelectedLessonPlanId('');
  }, []);

  // Search-bar plan pick: snap the structured pickers to the plan's RESOLVED
  // taxonomy cell (so subject/level/topic stay in sync and the Topic dropdown
  // always has the option) and pre-select the lesson. The index entry carries
  // the resolved cell (see resolve-cell.ts); for an orphan plan (no cell) we
  // fall back to its raw tags so it still starts. availableLessonPlans then
  // recomputes from the index on the next render — no DB round-trip.
  const handleSearchSelect = useCallback((entry: PlanIndexEntry) => {
    setSelectedSubject(entry.cellSubject ?? entry.subject);
    setSelectedLevel(entry.cellLevel ?? entry.grade);
    setSelectedTopicId(entry.cellTopic ?? entry.topic ?? '');
    setSelectedLessonPlanId(entry.id);
    setTimeout(() => {
      document.getElementById('tutor-start-btn')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }, []);

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
    // Task B2 (flag-gated): when the pedagogy opener is on, this injection
    // is handled by the opener-aware effect below instead (it must not
    // pre-empt an in-progress proactive opener/calibration exchange). When
    // the flag is off this line is a no-op (TUTOR_PEDAGOGY_OPENER is
    // `false`) and everything below executes exactly as before.
    if (TUTOR_PEDAGOGY_OPENER) return;
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

  // Task B2 (flag-gated) — opener-aware auto-start. Re-implements the same
  // trigger as the effect above, but (a) only runs when
  // NEXT_PUBLIC_TUTOR_PEDAGOGY_OPENER is on, and (b) waits until the tutor
  // has produced its first turn before firing the "Begin teaching
  // immediately" injection, so it never pre-empts an in-progress proactive
  // opener/calibration exchange. When the session's resolved opener is
  // 'none' (e.g. silent pickup / warm-resume / diagnostic — see
  // resolveOpeningBehavior), there's nothing to wait for and it fires
  // immediately, matching the flag-off behavior above.
  useEffect(() => {
    if (!TUTOR_PEDAGOGY_OPENER) return;
    const target = pendingAutoStartPlanIdRef.current;
    if (!target) return;
    if (lessonProgress.plan?.id !== target) return;
    const sig: OpeningSignals = {
      // testTargetKind: dev-hook override (undefined in production) so this
      // effect resolves the SAME journey the runtime's buildInstructions does.
      targetKind: testTargetKind ?? (selectedLessonPlanId ? 'lessonNode' : 'freestyle'),
      isTrial: false, // no isTrial signal reaches this page today — see task-B2-report.md
      hasPortalContext: !!effectiveStudentId,
      // resumeState is only produced by an authenticated sessionId lookup
      // (portal/resume.ts), so hasLiveCheckpoint ⇒ a portal-context student;
      // the demo-logged-out + resume-live combination cannot occur through this
      // wiring (which would otherwise resolve to resume-live and mislabel the
      // student 'subscribed' via journey.startsWith('demo-')).
      // testCheckpointStale (dev hook, false in production) maps the
      // stale-checkpoint marker in via the same deriveResumeSignal rule the
      // runtime uses (a seeded resumeState wins over a stray stale flag).
      resume: deriveResumeSignal(!!resumeState, testCheckpointStale),
    };
    const beh = resolveOpeningBehavior(assembleOpeningInput(sig));
    if (beh.opener !== 'none') {
      const tutorHasSpoken = transcript.some((entry) => entry.role === 'tutor');
      if (!tutorHasSpoken) return; // defer — opener hasn't produced its first line yet
    }
    // Plan now reflects the expanded version, and the opener (if any) has
    // already produced its first line. Fire once and clear.
    pendingAutoStartPlanIdRef.current = null;
    const handle = realtimeHandleRef.current;
    if (!handle) {
      console.warn('[auto-start] no realtime handle; cannot trigger brain turn');
      return;
    }
    console.log(`[auto-start] firing synthetic start prompt for plan ${target} (pedagogy-opener wiring)`);
    // Flag-ON follow-up #2 (whole-branch review): the flag-off text ordered
    // "Begin teaching immediately", which collapsed the multi-turn opening/
    // calibration exchange into one turn. This variant hands the TIMING to
    // the brain (decision #11 — no orchestrator state machine): finish the
    // opening exchange first, then advance. The brain holds the exchange
    // in-context and knows when calibration has run its course.
    handle.sendTextMessage(
      '[orchestrator: the lesson plan has just been expanded with the picked LOs. If you are still in your opening/calibration exchange, continue it naturally first — keep it brief, at most a couple more short exchanges. As soon as it has run its course, transition into teaching: call advance_lesson to move from the intro segment to the first LO\'s first segment (the hook or concept depending on Rule 12) and start the lesson. Do NOT re-acknowledge the pick or re-list LOs; the student has already moved past that step.]',
    );
  }, [lessonProgress.plan?.id, transcript, selectedLessonPlanId, effectiveStudentId, resumeState, testTargetKind, testCheckpointStale]);

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
    const newSessionId = `session-${Date.now()}`;
    setSessionId(newSessionId);
    // Carry the session id in the URL so a reload reconnects to THIS session
    // (reload auto-resume). replaceState avoids a Next navigation/remount.
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('sid', newSessionId);
      window.history.replaceState(window.history.state, '', url.toString());
    }
    // Fresh start — never inherit a prior session's resume snapshot.
    setResumeState(null);
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
    setVoiceStartedAtMs(null);
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

  // ── Dev-only e2e test hooks (Playwright harness) ──────────────────────────
  // NODE_ENV-guarded window hooks so the tutor-e2e harness can drive a real
  // claude-brain session through the TYPED-INPUT path (no mic/voice needed):
  //   __tutorTestStart({subject, level, topic, lessonPlanId, studentName?,
  //                     studentId?, socialMemory?, progressDigest?, resume?})
  //       — set the picker selections + start the session. Selecting a
  //         lessonPlanId flips voiceEngine→claude-brain automatically.
  //         The optional subscribed-persona fields (Task H2) are documented
  //         on the cfg type below.
  //   __tutorSendText(text) — dispatch a student turn (= typed input).
  //   __tutorTestState() — poll observable state for turn-synchronization.
  // See project_tutor_test_automation. Counterpart dev triggers
  // (__tutorForceKill, __tutorRenderBuffer, …) live in VoiceTutorRealtime.
  const pendingTestStartRef = useRef(false);
  // Task H2: resume checkpoint injected via __tutorTestStart. Applied AFTER
  // handleStartSession's own `setResumeState(null)` reset (both land in the
  // same batch below; the later write wins) — setting it directly in the
  // hook would be wiped by that reset.
  const pendingTestResumeRef = useRef<TutorResumeState | null>(null);
  const turnsCompletedRef = useRef(0);
  const prevBrainBusyRef = useRef(false);
  useEffect(() => {
    // A brain turn completed when isProcessing (onTutorBusy) falls true→false.
    if (prevBrainBusyRef.current && !isProcessing) turnsCompletedRef.current += 1;
    prevBrainBusyRef.current = isProcessing;
  }, [isProcessing]);
  // Fire the deferred start once the selections have actually landed in state
  // (setState is async, so __tutorTestStart can't call handleStartSession
  // synchronously — canStartSession would still be false).
  useEffect(() => {
    if (pendingTestStartRef.current && canStartSession && stage === 'setup') {
      pendingTestStartRef.current = false;
      void handleStartSession();
      // Task H2: apply an injected resume checkpoint AFTER the start reset
      // (handleStartSession's sync prelude runs to completion — including
      // its setResumeState(null) — before control returns here, so this
      // later write wins within the same batch).
      if (pendingTestResumeRef.current) {
        setResumeState(pendingTestResumeRef.current);
        pendingTestResumeRef.current = null;
      }
    }
  }, [canStartSession, stage, handleStartSession]);
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    w.__tutorTestStart = (cfg: {
      subject: string; level: string; topic: string; lessonPlanId?: string; studentName?: string;
      // Task H2 — subscribed-persona injection for the pedagogy harness.
      // These reach the SAME paths a real subscribed session uses:
      //   studentId       → effectiveStudentId (profile-block fetch, opener
      //                     hasPortalContext, session-end commits) — the
      //                     ?studentId= query-param-equivalent flow.
      //   socialMemory /
      //   progressDigest  → the transient-context props (Task D1b, embed
      //                     carrier) passed at both VoiceTutorRealtime render
      //                     sites, flag-gated on TUTOR_PEDAGOGY_OPENER.
      //   resume          → a PRE-BUILT TutorResumeState (post-buildResumeState
      //                     shape — the caller is responsible for staleness
      //                     filtering, mirroring portal/resume.ts). Feeds the
      //                     same setResumeState path the ?sid= reload-resume
      //                     flow uses.
      //   lastOpener      → opener-recency (part A): the PREVIOUS session's
      //                     opener record, rendered into the transient
      //                     context block as a do-NOT-repeat directive.
      //   sessionMaxMinutes → the sessionMaxMinutes prop at both render
      //                     sites (default 30 — the value the page always
      //                     passed). Lets the E2 soft-close row run with a
      //                     live-testable ~5-minute budget.
      //   targetKind      → explicit OpeningSignals.targetKind
      //                     ('diagnostic' journeys are only reachable via
      //                     this / the embed's target_kind).
      //   checkpointStale → stale-checkpoint marker (resume-stale journey):
      //                     a checkpoint existed but was too old to restore.
      //                     Pass WITHOUT `resume` (mutually exclusive — a
      //                     seeded resume wins, see deriveResumeSignal).
      //   teacherId       → pins a demo teacher persona (resolved against
      //                     DEMO_TEACHERS; unknown id ⇒ ignored, keeping
      //                     the default = first teacher).
      studentId?: string;
      socialMemory?: SocialThread[];
      progressDigest?: ProgressDigest;
      lastOpener?: LastOpenerRecord;
      resume?: TutorResumeState;
      sessionMaxMinutes?: number;
      targetKind?: SessionMode;
      checkpointStale?: boolean;
      teacherId?: string;
    }) => {
      setSelectedSubject(cfg.subject);
      setSelectedLevel(cfg.level);
      setSelectedTopicId(cfg.topic);
      setSelectedLessonPlanId(cfg.lessonPlanId || '');
      setInputMode('voice');
      // Pass an omitted studentName through as EMPTY, not a placeholder:
      // the pedagogy harness's anon persona is intentionally nameless, and
      // a 'Test Student' default here reached the brain as if it were the
      // student's real name (observed live 2026-07-03: "Hey Test Student!").
      // Callers that want a name (scripts/tutor-e2e/run.ts) pass one
      // explicitly; canStartSession does not require a name.
      setStudentName(cfg.studentName || '');
      setTestStudentIdOverride(cfg.studentId || undefined);
      setTestSocialMemory(cfg.socialMemory);
      setTestProgressDigest(cfg.progressDigest);
      setTestLastOpener(cfg.lastOpener);
      setTestSessionMaxMinutes(cfg.sessionMaxMinutes ?? 30);
      setTestTargetKind(cfg.targetKind);
      setTestCheckpointStale(cfg.checkpointStale === true);
      // Teacher persona pin: unknown ids are IGNORED (selection keeps its
      // current value — the default first teacher) rather than erroring.
      if (cfg.teacherId) {
        const t = DEMO_TEACHERS.find((d) => d.id === cfg.teacherId);
        if (t) setSelectedTeacherId(t.id);
      }
      // Fresh capture slot per started session — a replay's session 2 must
      // not read session 1's stale record out of __tutorTestState.
      testOpenerRecordRef.current = null;
      // Stashed, not set: handleStartSession resets resumeState to null in
      // its fresh-start prelude; the deferred-start effect re-applies this
      // right after (see pendingTestResumeRef).
      pendingTestResumeRef.current = cfg.resume ?? null;
      turnsCompletedRef.current = 0;
      pendingTestStartRef.current = true;
      console.warn('[tutor-e2e] __tutorTestStart', JSON.stringify(cfg).slice(0, 400));
    };
    w.__tutorSendText = (text: string) => {
      if (!realtimeHandleRef.current) { console.warn('[tutor-e2e] __tutorSendText: handle not ready'); return; }
      console.warn('[tutor-e2e] __tutorSendText', JSON.stringify(text).slice(0, 120));
      realtimeHandleRef.current.sendTextMessage(text);
    };
    w.__tutorTestState = () => ({
      stage,
      brainBusy: isProcessing,
      connected: !!realtimeHandleRef.current,
      transcriptLen: transcript.length,
      turnsCompleted: turnsCompletedRef.current,
      error,
      // e2e telemetry: full debug-event stream (render-sync / kill-recovery /
      // substitution events). Persisted to /api/demos/session in prod, but that
      // POST 500s under the e2e harness, so expose it directly for capture.
      debugEvents: debugEventsRef.current,
      // e2e: FULL per-turn transcript (untruncated) for the Phase-2 judge.
      // `streaming`/`revising` ride along so harness drivers can tell a
      // finalized tutor turn from an in-flight partial / killed-attempt
      // bubble (the T1 duplicate-turn capture bug, 2026-07-04).
      transcript: transcriptStateRef.current.map((e) => ({ role: e.role, text: e.text, streaming: e.streaming === true, revising: e.revising === true })),
      // Opener-recency (part A): this session's OWN captured opener record
      // (kind + first ~160 chars of the opener turn's text), or null if the
      // opener turn hasn't completed / flag off. The harness's replay driver
      // reads this to build session 2's lastOpener.
      sessionOpenerRecord: testOpenerRecordRef.current,
    });
    return () => { delete w.__tutorTestStart; delete w.__tutorSendText; delete w.__tutorTestState; };
  }, [stage, isProcessing, transcript.length, error, canStartSession, handleStartSession]);

  // e2e: keep transcriptStateRef in sync with the full transcript (every
  // change, incl. mid-stream text growth) so __tutorTestState reads fresh text.
  useEffect(() => { transcriptStateRef.current = transcript; }, [transcript]);

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
    // Task E3 (pedagogy, flag-gated): demo-intent capture — ANALYTICS ONLY.
    // Demo (logged-out) sessions only; runs the conservative detector over
    // the student's own words and, when something clearly matched, attaches
    // one label through the page's existing demo tracker. NEVER writes to
    // any student profile/record — demo sessions stay zero-persistence.
    if (TUTOR_PEDAGOGY_OPENER && !effectiveStudentId) {
      const intent = detectDemoIntent(
        transcript.filter((e) => e.role === 'student').map((e) => e.text),
      );
      if (intent) {
        trackInteraction('click', `demo_intent_${intent}`, { intent });
      }
    }
    // Save session as completed to DB
    sessionEndedRef.current = true;
    saveSessionUsage('completed');
    setStage('summary');
  }, [onComplete, selectedTopicId, transcript, sessionGoal, saveSessionUsage, effectiveStudentId, trackInteraction]);

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

  // Live voice-engine state for the new SessionStage presence orb (fed by
  // VoiceTutorRealtime's onVoiceStateChange). 'idle' until the engine reports.
  const [liveVoiceState, setLiveVoiceState] = useState<VoiceState>('idle');

  // Wallclock ms when the student actually starts the voice session (mic tap).
  // Drives the SessionControls timer so it counts from start, not from when the
  // session view mounted. Reset to null on each new session in handleStartSession.
  const [voiceStartedAtMs, setVoiceStartedAtMs] = useState<number | null>(null);

  // Page-nav state surfaced from the (chromeless) WhiteboardCanvas so the new
  // SessionStage can render its own slim page switcher. null until first fire.
  const [boardNav, setBoardNav] = useState<{ index: number; count: number; titles: string[]; goTo: (i: number) => void } | null>(null);

  // Export-PDF feedback on the summary screen (the button gave no signal that
  // a download was in progress / done — observed 2026-06-24 ear-test).
  const [summaryPdfState, setSummaryPdfState] = useState<'idle' | 'working' | 'done'>('idle');

  // "Being heard" indicator (2026-06-24). Mic amplitude lives in a REF so the
  // ~12×/sec updates from the audio processor don't re-render this whole page;
  // SessionStage polls it. The transient "didn't catch that" hint is state.
  const micLevelRef = useRef(0);
  const [listeningHint, setListeningHint] = useState<'didnt-catch' | null>(null);
  useEffect(() => {
    if (listeningHint !== 'didnt-catch') return;
    const id = setTimeout(() => setListeningHint(null), 6000);
    return () => clearTimeout(id);
  }, [listeningHint]);

  // Close the adaptive ⋯ menu on an outside click. A plain `fixed inset-0`
  // backdrop doesn't work in the new stage: the top bar has `backdrop-blur`,
  // which (like a transform) makes `position:fixed` size to the bar, not the
  // viewport — so the backdrop never covers the board. A document listener is
  // robust regardless of stacking/containing-block.
  const pacingMenuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!pacingMenuOpen) return;
    const handler = (e: PointerEvent) => {
      if (!pacingMenuRef.current?.contains(e.target as Node)) setPacingMenuOpen(false);
    };
    // Defer so the click that OPENED the menu doesn't immediately close it.
    const id = setTimeout(() => document.addEventListener('pointerdown', handler), 0);
    return () => { clearTimeout(id); document.removeEventListener('pointerdown', handler); };
  }, [pacingMenuOpen]);

  // Flag for the new "Stage + Presence" in-session layout (Direction 4).
  // Default OFF → legacy split-pane render is unchanged. See
  // [[project-tutor-session-ui-redesign]].
  const NEW_SESSION_UI = (() => {
    const v = process.env.NEXT_PUBLIC_TUTOR_NEW_SESSION_UI;
    if (!v) return false;
    return ['1', 'true', 'on', 'yes'].includes(String(v).trim().toLowerCase());
  })();

  // Shared student-input handlers — extracted so BOTH the legacy whiteboard
  // panel and the new SessionStage tools cluster route through identical logic.
  const handleTryYourselfAnswer = useCallback((answer: string, expected: string | undefined, isCorrect: boolean | null) => {
    const verdict =
      isCorrect === true ? 'matches the expected answer (string-equal)'
      : isCorrect === false ? 'does NOT match the expected answer'
      : '(undecidable by string match — judge equivalence yourself, accepting any algebraically-correct form)';
    const marker = expected
      ? `[try-yourself submission. The student submitted: "${answer}". Expected: ${expected}. Verdict: ${verdict}. If "does NOT match", stay on this same try-yourself — give a hint, do NOT call new_page or show a different problem. If undecidable, judge algebraic equivalence yourself.]`
      : `[try-yourself submission. The student submitted: "${answer}". No expected answer set — judge correctness yourself. If wrong, stay on this same try-yourself; do NOT advance to a new problem.]`;
    realtimeHandleRef.current?.sendTextMessage(marker);
  }, []);

  const handleStudentInput = useCallback((type: 'text' | 'drawing' | 'image', content: string) => {
    const cmd: WhiteboardCommand = type === 'image'
      ? { action: 'showSvgDiagram', title: 'Student Upload', svg: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><image href="${content}" x="5" y="5" width="390" height="290" preserveAspectRatio="xMidYMid meet"/></svg>` } as WhiteboardCommand
      : type === 'drawing'
      ? { action: 'showSvgDiagram', title: 'Student Drawing', svg: `<svg viewBox="0 0 400 150" xmlns="http://www.w3.org/2000/svg"><image href="${content}" x="5" y="5" width="390" height="140" preserveAspectRatio="xMidYMid meet"/></svg>` } as WhiteboardCommand
      : { action: 'showSvgDiagram', title: 'Student Answer', svg: `<svg viewBox="0 0 400 60" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="390" height="50" rx="8" fill="#eff6ff" stroke="#bfdbfe" stroke-width="1"/><text x="200" y="22" text-anchor="middle" font-size="11" fill="#6b7280">Student wrote:</text><text x="200" y="42" text-anchor="middle" font-size="16" font-weight="bold" fill="#1e40af">${content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</text></svg>` } as WhiteboardCommand;
    setWhiteboardCommands(prev => [...prev, cmd]);
    if (type === 'drawing') setStatusMessage('✏️ Reading your drawing...');
    else if (type === 'image') setStatusMessage('📷 Analyzing your image...');
    else if (type === 'text') setStatusMessage('💬 Processing...');
    if (realtimeHandleRef.current) {
      if (type === 'text') {
        realtimeHandleRef.current.sendTextMessage(`[The student wrote on the whiteboard: "${content}". Respond to what they wrote.]`);
        setTimeout(() => setStatusMessage(null), 1000);
      } else {
        const noun = type === 'drawing' ? 'drew on' : 'uploaded an image to';
        (async () => {
          try {
            const base64Data = content.replace(/^data:image\/\w+;base64,/, '');
            const resp = await fetch('/api/tutor/extract-homework', {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ imageData: base64Data, mimeType: 'image/png', subject: selectedSubject, topic: selectedTopicId, level: selectedLevel }),
            });
            const data = await resp.json();
            setStatusMessage(null);
            if (data.extractedProblem && realtimeHandleRef.current) {
              realtimeHandleRef.current.sendTextMessage(`[The student ${noun} the whiteboard. It contains: "${data.extractedProblem}". Respond to what they shared.]`);
            } else {
              realtimeHandleRef.current?.sendTextMessage(`[The student ${noun} the whiteboard but the content could not be extracted. Ask them to describe what it shows.]`);
            }
          } catch {
            setStatusMessage(null);
            realtimeHandleRef.current?.sendTextMessage(`[The student ${noun} the whiteboard but it could not be analyzed. Ask them to describe what it shows.]`);
          }
        })();
      }
    }
    trackInteraction('click', `whiteboard-${type}`, { content: content.slice(0, 100) });
  }, [selectedSubject, selectedTopicId, selectedLevel, trackInteraction]);

  // Render setup stage. Guard on !resumeBooting: on a ?sid= reload the initial
  // stage is 'setup' while the checkpoint read is in flight — without this the
  // setup/picker screen flashes for a frame before the resume boot flips to the
  // session. The resumeBooting loader below owns that interim render.
  if (stage === 'setup' && !resumeBooting) {
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
          <LessonPicker
            studentName={studentName}
            onStudentName={setStudentName}
            subject={selectedSubject}
            level={selectedLevel}
            topicId={selectedTopicId}
            lessonPlanId={selectedLessonPlanId}
            onSubjectChange={handleSubjectChange}
            onLevelChange={handleLevelChange}
            onTopicChange={handleTopicChange}
            onLessonPlanChange={setSelectedLessonPlanId}
            onSearchSelect={handleSearchSelect}
            canStart={canStartSession}
            onStart={handleStartSession}
            inputMode={inputMode}
          />

          {/* Your teacher — demo persona picker (flag-gated; radio-card style
              matching the setup card). Selection feeds the teacherPersona
              prop + the session voice at both render sites. */}
          {TUTOR_PEDAGOGY_OPENER && (
            <div className="mt-6 bg-white rounded-xl shadow-lg p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900">Your teacher</h2>
              <p className="text-xs text-gray-500 mt-1 mb-4">Pick who you&apos;d like to learn with today.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Your teacher">
                {DEMO_TEACHERS.map((t) => {
                  const isSel = t.id === selectedTeacherId;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      role="radio"
                      aria-checked={isSel}
                      onClick={() => setSelectedTeacherId(t.id)}
                      className={`text-left rounded-xl border-2 p-4 transition-colors ${
                        isSel
                          ? 'border-blue-500 bg-blue-50/60'
                          : 'border-gray-200 bg-white hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-gray-900">{t.name}</span>
                        <span
                          className={`shrink-0 inline-flex items-center justify-center w-4 h-4 rounded-full border-2 ${
                            isSel ? 'border-blue-600 bg-blue-600' : 'border-gray-300 bg-white'
                          }`}
                          aria-hidden
                        >
                          {isSel && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1.5 leading-snug">{t.intro}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

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

  // Reload auto-resume in flight — hold the first paint until the checkpoint
  // read resolves so we don't flash the setup screen before booting into the
  // resumed session.
  if (resumeBooting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // ===== NEW "Stage + Presence" in-session layout (flag-gated, additive) =====
  if (stage === 'session' && NEW_SESSION_UI && (voiceEngine === 'realtime' || voiceEngine === 'realtime-2' || voiceEngine === 'realtime-validated' || voiceEngine === 'claude-brain')) {
    return (
      <TutorSession
        subject={selectedSubject}
        topic={selectedTopicId}
        level={selectedLevel}
        studentName={studentName || undefined}
        studentId={effectiveStudentId}
        sessionId={sessionId}
        sessionStartedAtMs={sessionStartTimeRef.current?.getTime()}
        sessionGoal={sessionGoal}
        lessonPlanId={selectedLessonPlanId || undefined}
        // Teacher persona voice wins when the flag is on (effectiveOpenAIVoice
        // === selectedOpenAIVoice when the flag is off — markup unchanged).
        voice={effectiveOpenAIVoice}
        voiceEngine={voiceEngine}
        ttsProvider={ttsProvider}
        // Dev-hook override, default 30 — identical to the literal the page
        // always passed (production markup unchanged).
        sessionMaxMinutes={testSessionMaxMinutes}
        resumeState={resumeState}
        // Task H2 (dev-only source): transient context injected via the
        // __tutorTestStart hook. Flag-gated so flag-off sessions pass
        // undefined exactly as before.
        socialMemory={TUTOR_PEDAGOGY_OPENER ? testSocialMemory : undefined}
        progressDigest={TUTOR_PEDAGOGY_OPENER ? testProgressDigest : undefined}
        lastOpener={TUTOR_PEDAGOGY_OPENER ? testLastOpener : undefined}
        targetKind={TUTOR_PEDAGOGY_OPENER ? testTargetKind : undefined}
        checkpointStale={TUTOR_PEDAGOGY_OPENER ? testCheckpointStale : undefined}
        teacherPersona={TUTOR_PEDAGOGY_OPENER ? selectedTeacher : undefined}
        onOpenerRecord={handleOpenerRecord}
        topicDisplayName={topicDisplayName}
        availableLessonPlans={availableLessonPlans}
        onEndSession={handleEndSession}
        onTranscriptUpdate={handleVoiceTranscriptUpdate}
        onWhiteboardCommand={handleVoiceWhiteboardCommand}
        onUsageUpdate={handleRealtimeUsage}
        onDebugEvent={addDebugEvent}
        onTrackInteraction={trackInteraction}
        onTranscriptionStatus={handleTranscriptionStatus}
        onProposePlanSwap={handleProposePlanSwap}
        onConfirmPlanLos={handleConfirmPlanLos}
        onBeforeTypedSubmit={handleBeforeTypedSubmit}
        onUploadHomework={handleUploadHomework}
        onLessonPlanIdChange={setSelectedLessonPlanId}
        onLessonProgressChange={setLessonProgress}
        onCompletedSegmentsChange={setCompletedSegmentIds}
        handleRef={realtimeHandleRef}
      />
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
            startedAtMs={voiceStartedAtMs}
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
            <div className="relative w-full h-full">
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
                onTryYourselfAnswer={handleTryYourselfAnswer}
                onStudentInput={handleStudentInput}
                openOnLastPage={!!resumeState}
              />
              {awaitingResume && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-white/65 backdrop-blur-[1.5px]">
                  <button
                    onClick={() => realtimeHandleRef.current?.resumeContinue()}
                    className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-blue-600 text-white text-base font-semibold shadow-lg hover:bg-blue-700 hover:scale-[1.03] active:scale-95 transition-all"
                  >
                    <Play className="w-5 h-5" />
                    Continue lesson
                  </button>
                  <p className="text-sm text-slate-600">Pick up where you left off</p>
                </div>
              )}
            </div>
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
                  studentId={effectiveStudentId}
                  sessionId={sessionId}
                  sessionStartedAtMs={sessionStartTimeRef.current?.getTime()}
                  sessionGoal={sessionGoal}
                  lessonPlanId={selectedLessonPlanId || undefined}
                  resumeState={resumeState}
                  // Task H2 (dev-only source): transient context injected via
                  // the __tutorTestStart hook. Flag-gated so flag-off
                  // sessions pass undefined exactly as before.
                  socialMemory={TUTOR_PEDAGOGY_OPENER ? testSocialMemory : undefined}
                  progressDigest={TUTOR_PEDAGOGY_OPENER ? testProgressDigest : undefined}
                  lastOpener={TUTOR_PEDAGOGY_OPENER ? testLastOpener : undefined}
                  targetKind={TUTOR_PEDAGOGY_OPENER ? testTargetKind : undefined}
                  checkpointStale={TUTOR_PEDAGOGY_OPENER ? testCheckpointStale : undefined}
                  teacherPersona={TUTOR_PEDAGOGY_OPENER ? selectedTeacher : undefined}
                  onOpenerRecord={handleOpenerRecord}
                  onResumeAwaitingTapChange={setAwaitingResume}
                  // Teacher persona voice wins when the flag is on (identical
                  // to selectedOpenAIVoice when the flag is off).
                  voice={effectiveOpenAIVoice}
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
                  onSessionStarted={() => setVoiceStartedAtMs((prev) => prev ?? Date.now())}
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
                  // Dev-hook override, default 30 — identical to the literal
                  // the page always passed (production markup unchanged).
                  sessionMaxMinutes={testSessionMaxMinutes}
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

        {/* Task E2 (pedagogy, flag-gated): demo-only enrol CTA. The tutor
            itself never sells (close directive keeps the goodbye in-character);
            THIS card owns the conversion ask, and only on the demo end
            surface. shouldShowDemoCta is false whenever the flag is off or a
            studentId is present, so those renders are byte-identical. The
            site has no /academy or enrolment route today — /contact is its
            conversion path; data-cta marks the link for analytics/repointing
            once a real enrolment page exists. */}
        {shouldShowDemoCta({ flagOn: TUTOR_PEDAGOGY_OPENER, studentId: effectiveStudentId, sessionEnded: stage === 'summary' }) && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6 text-center">
            <h2 className="text-base font-semibold text-blue-900 mb-1">Enjoyed this?</h2>
            <p className="text-sm text-blue-800 mb-4">
              Real sessions remember your progress, adapt to you, and build week over week.
            </p>
            <Link
              href="/contact"
              data-cta="tutor-demo-enrol"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Set up real sessions
            </Link>
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
          {/* Resume the session the student just left (End / back chevron both
              land here). All session state is still in memory, so we rebuild
              the resume snapshot directly and re-enter — no DB round-trip. Only
              offered for plan-driven sessions (the resumable kind). */}
          {lessonProgress.plan && (
            <button
              onClick={() => {
                const rs: TutorResumeState = {
                  currentSegmentId: lessonProgress.currentSegmentId,
                  completedSegmentIds: [...completedSegmentIds],
                  transcript,
                  whiteboardCommands,
                };
                // Reset the whiteboard persistence buffers BEFORE re-entering.
                // Re-entering remounts VoiceTutorRealtime, whose resume seed
                // replays rs.whiteboardCommands through onWhiteboardCommand —
                // which appends them to whiteboardEventsRef + whiteboardCommands.
                // Without clearing, the seed stacks a 2nd copy onto the still-
                // populated buffers → the saved board (and every page) doubles,
                // compounding on each Resume. rs already captured the snapshot.
                whiteboardEventsRef.current = [];
                setWhiteboardCommands([]);
                // Re-enable saves (End set this true) + keep the sid in the URL
                // so a later reload still auto-resumes this same session.
                sessionEndedRef.current = false;
                if (typeof window !== 'undefined') {
                  const url = new URL(window.location.href);
                  url.searchParams.set('sid', sessionId);
                  window.history.replaceState(window.history.state, '', url.toString());
                }
                setResumeState(rs);
                setStage('session');
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              Resume session
            </button>
          )}
          {transcript.length > 0 && (
            <button
              disabled={summaryPdfState === 'working'}
              onClick={async () => {
                setSummaryPdfState('working');
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
                  setSummaryPdfState('done');
                  // Revert the "Downloaded ✓" confirmation after a few seconds
                  // so the button is reusable.
                  setTimeout(() => setSummaryPdfState('idle'), 4000);
                } catch (err) {
                  console.error('PDF export error:', err);
                  setError('Could not export the session PDF. Please try again.');
                  setSummaryPdfState('idle');
                }
              }}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {summaryPdfState === 'working' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : summaryPdfState === 'done' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )}
              {summaryPdfState === 'working' ? 'Exporting…' : summaryPdfState === 'done' ? 'Downloaded ✓' : 'Export Session PDF'}
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
              // Drop the prior session's sid + resume snapshot so a reload from
              // the setup screen starts clean (handleStartSession re-stamps a
              // fresh sid into the URL when the next session actually begins).
              setResumeState(null);
              if (typeof window !== 'undefined') {
                const url = new URL(window.location.href);
                url.searchParams.delete('sid');
                window.history.replaceState(window.history.state, '', url.toString());
              }
              setTranscript([]);
              setConversationHistory([]);
              setWhiteboardCommands([]);
              whiteboardEventsRef.current = [];
              setTokenUsage([]);
              // PRESERVE selectedLessonPlanId + subject/level/topic so a
              // same-topic restart resumes the last lesson (pre-filled on the
              // setup screen with a "Change" option) instead of dropping to
              // free-practice and re-asking the topic. The new session still
              // starts clean: VoiceTutorRealtime remounts via key={sessionId}
              // (fresh brain/plan refs) and the live state below is reset.
              setLessonProgress({ plan: null, currentSegmentId: '' });
              setNudgeDismissed(false);
              setPickerAnchorIndex(null);
              setStatusMessage(null);
              setError(null);
              setVoiceStartedAtMs(null);
              debugEventsRef.current = [];
              lastSavedDebugCountRef.current = 0;
              lastSavedTokenCountRef.current = 0;
              sessionEndedRef.current = false;
              setStage('setup');
            }}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
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
