'use client';

/**
 * TutorSession — the shared in-session experience (the new "Stage + Presence"
 * UI), rendered by BOTH the standalone `/tutor` page (new-UI branch) and the
 * partner embed (`/tutor-portal/embed`), so the two never drift.
 *
 * It owns the session-VIEW state (transcript, whiteboard, lesson progress,
 * voice/presence signals) and the simple session-internal handlers, and
 * composes `<SessionStage>` with its slots (WhiteboardCanvas, VoiceTutorRealtime,
 * TranscriptView, LessonPlanProgress, SessionControls + the ⋯ pacing/humor menu).
 *
 * Page-orchestration concerns (plan swap/confirm, freestyle plan-gen, debug,
 * analytics, homework upload, the free-practice nudge picker) are OPTIONAL
 * props — the standalone page passes its implementations; the embed omits what
 * it doesn't need. Persistence is the consumer's job via the callbacks
 * (onTranscriptUpdate / onWhiteboardCommand / onMilestone / onEndSession).
 */

import { useState, useCallback, useEffect, useRef, type ComponentProps, type MutableRefObject, type ReactNode } from 'react';
import Script from 'next/script';
import { Play, LogOut } from 'lucide-react';
import { InlineMathText } from '../whiteboard/InlineMathText';
import { TranscriptView } from '../TranscriptView';
import { SessionControls } from '../SessionControls';
import { WhiteboardCanvas } from '../whiteboard';
import { VoiceTutorRealtime, type RealtimeHandle } from '../VoiceTutorRealtime';
import { LessonPlanProgress } from '../LessonPlanProgress';
import { LessonNudgePicker } from '../LessonNudgePicker';
import SessionStage, { CaptionTicker, MicMeter, type VoiceState } from './SessionStage';
import { getQuickActions } from '@/lib/tutor/quick-actions';
import { gradeBandFor } from '@/lib/tutor/pedagogy/grade-profile';
import { useStudentPreferences } from '@/hooks/useStudentPreferences';
import type { StudentPreferences } from '@/lib/tutor/student-profile/types';
import type { SessionGoal, TranscriptEntry } from '@/lib/tutor/types';
import type { MockReviewContext, MockReviewAgendaItem, MockReviewDrawerRow } from '@/lib/tutor/mock-exam/review-focus';
import type { WhiteboardCommand } from '@/lib/knowledge/types';
import type { OpenAIVoice } from '../../hooks/useOpenAIRealtime';
import type { LessonPlan as LessonPlanType } from '@/lib/tutor/lesson-plan/types';
import type { SpokenCaption } from '@/lib/tutor/voice/caption-sync';
import type { StudentMarkEvent } from '@/lib/tutor/whiteboard/student-marks';
import { acceptWhiteboardBatch, createSeedGuard, type WhiteboardBatchMeta } from '@/lib/tutor/whiteboard/resume-seed';
import { DEFAULT_PACE_BIAS } from '@/lib/tutor/voice/pace-preference';
import { TUTOR_MANUAL_MIC } from '@/lib/tutor/orchestrator/flags';
import { lastQuestionSentence, stripMarkdownEmphasis } from '@/lib/tutor/question-gist-text';
import { latestSubstantiveTutorEntry } from '@/lib/tutor/qpin-behavior';
import { preStartDockCaption } from './prestart-affordances';
import { HeaderClock } from './HeaderClock';

type VTRProps = ComponentProps<typeof VoiceTutorRealtime>;
type BoardNav = Parameters<NonNullable<ComponentProps<typeof WhiteboardCanvas>['onNavChange']>>[0];

// Caption ↔ TTS word-sync (2026-07-04): audio-locked caption reveal.
// Default ON; 'off' restores the legacy fixed-rate typewriter. claude-brain
// only by construction (the handle returns null on other engines).
const TUTOR_CAPTION_SYNC = process.env.NEXT_PUBLIC_TUTOR_CAPTION_SYNC !== 'off';
// Q pin (2026-07-14): gist of the tutor's current question pinned over the
// board while the student thinks/answers. Kill switch, same pattern as above.
const TUTOR_QUESTION_PIN = process.env.NEXT_PUBLIC_TUTOR_QUESTION_PIN !== 'off';

/** Loose normalization for matching the caption-sync reveal against the
 *  question sentence (display text and spoken text differ in punctuation
 *  and markdown). */
function normalizeSpoken(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9 ]+/g, '').replace(/\s+/g, ' ').trim();
}

// Student whiteboard marks (Phase 1): tap-to-point. Default OFF.
const TUTOR_STUDENT_MARKS =
  process.env.NEXT_PUBLIC_TUTOR_STUDENT_MARKS === 'true';

export type TutorSessionVoiceEngine = 'realtime' | 'realtime-2' | 'realtime-validated' | 'claude-brain';

export interface TutorSessionProps {
  // Identity / config
  subject: string;
  topic: string;
  level: string;
  studentName?: string;
  studentId?: string;
  sessionId: string;
  sessionStartedAtMs?: number;
  sessionGoal: SessionGoal;
  /** Task WS3: mock-review context, forwarded to the runtime. Present only for
   *  a mock-review session whose context fetch succeeded. */
  mockReview?: MockReviewContext;
  /** Re-fetch the mock-review context, optionally pinning extra item ids
   *  (Agenda drawer "switch to this question"). Forwarded straight to the
   *  runtime. Absent ⇒ the drawer can only jump to already-focused items. */
  refetchMockReview?: (pinItemIds?: string[]) => Promise<MockReviewContext | undefined>;
  lessonPlanId?: string;
  voice: OpenAIVoice;
  voiceEngine: TutorSessionVoiceEngine;
  ttsProvider?: VTRProps['ttsProvider'];
  /** Cartesia voice id (Task 3). Only consumed when ttsProvider === 'cartesia'. */
  cartesiaVoiceId?: VTRProps['cartesiaVoiceId'];
  /** Per-voice Cartesia speed offset (R38 Task 6). Forwarded straight to the
   *  runtime, typed from VoiceTutorRealtime to avoid drift. */
  cartesiaVoiceSpeed?: VTRProps['cartesiaVoiceSpeed'];
  sessionMaxMinutes: number;
  /** Demo time-box (trial): wrap-phase threshold in minutes. Forwarded to the
   *  runtime, typed from VoiceTutorRealtime to avoid drift. */
  sessionWrapMinutes?: VTRProps['sessionWrapMinutes'];
  /** Whether the embed token carried an EXPLICIT max_duration_minutes (gates
   *  trial time-mode demo-stop + the hard wall-clock cap). Forwarded to the
   *  runtime, typed from VoiceTutorRealtime to avoid drift. */
  maxDurationExplicit?: VTRProps['maxDurationExplicit'];
  /** Prior-session snapshot to rehydrate (resume). Forwarded to the runtime. */
  resumeState?: VTRProps['resumeState'];
  /** Practice meter (2026-07-17): live problem-work stats bubbled up from
   *  the runtime (also consumed locally for the header meter). The embed
   *  page forwards these to the portal in the evelyn:progress message. */
  onPracticeStatsChange?: VTRProps['onPracticeStatsChange'];
  /** Task D1b — transient session-scoped social threads / progress digest
   *  from the portal's StudentContext (embed passes them; the standalone
   *  /tutor page has no source and omits both). Forwarded to the runtime,
   *  typed from VoiceTutorRealtime to avoid drift. */
  socialMemory?: VTRProps['socialMemory'];
  progressDigest?: VTRProps['progressDigest'];
  /** Opener-recency (part A) — previous session's opener record (same
   *  transient carrier as socialMemory/progressDigest). Forwarded to the
   *  runtime, typed from VoiceTutorRealtime to avoid drift. */
  lastOpener?: VTRProps['lastOpener'];
  /** Prerequisite-readiness summary from the course-start diagnostic (same
   *  transient carrier as socialMemory/progressDigest/lastOpener). Forwarded
   *  to the runtime, typed from VoiceTutorRealtime to avoid drift. */
  readinessNote?: VTRProps['readinessNote'];
  /** Opener-recency (part A) — fires once when this session's own opener
   *  record is captured. Forwarded to the runtime. */
  onOpenerRecord?: VTRProps['onOpenerRecord'];
  /** Task E1 (pedagogy) — the embed's `is_trial` signal (academy trial
   *  flow). Forwarded to the runtime, typed from VoiceTutorRealtime to
   *  avoid drift. Only consumed when TUTOR_PEDAGOGY_OPENER is on. */
  isTrial?: VTRProps['isTrial'];
  /** Explicit session-target kind (embed `target_kind` / dev hook) —
   *  'diagnostic' makes the opening behavior no-op. Forwarded to the
   *  runtime, typed from VoiceTutorRealtime to avoid drift. Only consumed
   *  when TUTOR_PEDAGOGY_OPENER is on. */
  targetKind?: VTRProps['targetKind'];
  /** Stale-checkpoint marker (a checkpoint existed but was too old to
   *  restore — resume-stale journey). Forwarded to the runtime, typed from
   *  VoiceTutorRealtime to avoid drift. Only consumed when
   *  TUTOR_PEDAGOGY_OPENER is on. */
  checkpointStale?: VTRProps['checkpointStale'];
  /** Teacher persona — the session is taught AS this specific teacher
   *  (demo picker on /tutor; the embed's `teacher` token field for
   *  enrolled sessions). Forwarded to the runtime, typed from
   *  VoiceTutorRealtime to avoid drift. Only consumed when
   *  TUTOR_PEDAGOGY_OPENER is on. */
  teacherPersona?: VTRProps['teacherPersona'];
  /** Display label for the topic (header / hero). */
  topicDisplayName?: string;
  /** Optional partner brand lockup shown in the top bar (embed branding). */
  headerBrand?: ReactNode;
  /** Inject the Desmos calculator script (embed needs it; default true). */
  loadDesmos?: boolean;

  // Required lifecycle. `reason` is 'time_limit' only when the demo hard-stop
  // timer fired (so the embed can tag session_ended); the End button omits it.
  // `endIntent` (round-4 item 5, embed-only) is the Adaptive-menu "Finish
  // lesson"/"Discard session" choice — the embed forwards it on
  // session_ended as the additive `end_intent` field for the portal.
  onEndSession: (reason?: 'time_limit', endIntent?: 'finish' | 'discard') => void;
  /** Round-4 item 5: true when hosted by the portal embed. Gates the
   *  Adaptive-menu Finish/Discard entries — those intents only mean
   *  something to a portal listening on session_ended. */
  embedded?: boolean;

  /** Share the parent's RealtimeHandle ref instead of an internal one. The
   *  standalone /tutor page needs this: its auto-start injection, end-session
   *  summary, topic-swap speech, and dev e2e hooks (__tutorSendText /
   *  __tutorTestState.connected) all read the PAGE-level ref — with an
   *  internal-only ref they silently no-op under the new session UI
   *  (observed 2026-07-03: every live harness run dropped its kickoff with
   *  "handle not ready"). Omit (embed) to use the internal ref. */
  handleRef?: MutableRefObject<RealtimeHandle | null>;

  // Optional integration callbacks (typed from VoiceTutorRealtime to avoid drift)
  onMilestone?: VTRProps['onMilestone'];
  onTranscriptUpdate?: (entries: TranscriptEntry[]) => void;
  onWhiteboardCommand?: (commands: WhiteboardCommand[], meta?: WhiteboardBatchMeta) => void;
  onUsageUpdate?: VTRProps['onUsageUpdate'];
  /** A1: per-attempt claude-brain token usage (see VoiceTutorRealtime). */
  onBrainUsage?: VTRProps['onBrainUsage'];
  onDebugEvent?: VTRProps['onDebugEvent'];
  onTrackInteraction?: VTRProps['onTrackInteraction'];
  onTranscriptionStatus?: VTRProps['onTranscriptionStatus'];
  onProposePlanSwap?: VTRProps['onProposePlanSwap'];
  onConfirmPlanLos?: VTRProps['onConfirmPlanLos'];
  onBeforeTypedSubmit?: VTRProps['onBeforeTypedSubmit'];
  onUploadHomework?: ComponentProps<typeof SessionControls>['onUploadHomework'];
  /** Mirror the active plan id back to the parent (nudge/freestyle changes). */
  onLessonPlanIdChange?: (id: string) => void;
  /** Mirror lesson progress back to the parent (for its own commit/analytics). */
  onLessonProgressChange?: (p: { plan: LessonPlanType | null; currentSegmentId: string }) => void;
  /** Mirror completed-segment ids back to the parent. */
  onCompletedSegmentsChange?: (ids: string[]) => void;

  // Optional UI
  /** Plans for the in-session free-practice nudge picker; omit to disable. */
  availableLessonPlans?: ComponentProps<typeof LessonNudgePicker>['plans'];
}

interface LessonProgressState {
  plan: LessonPlanType | null;
  currentSegmentId: string;
}

export default function TutorSession(props: TutorSessionProps) {
  const {
    subject, topic, level, studentName, studentId, sessionId, sessionStartedAtMs,
    sessionGoal, mockReview, refetchMockReview, lessonPlanId, voice, voiceEngine, ttsProvider, cartesiaVoiceId, cartesiaVoiceSpeed, sessionMaxMinutes,
    topicDisplayName, headerBrand, loadDesmos = true, onEndSession, embedded, onMilestone, onTranscriptUpdate,
    onWhiteboardCommand, onUsageUpdate, onBrainUsage, onDebugEvent, onTrackInteraction,
    onTranscriptionStatus, onProposePlanSwap, onConfirmPlanLos, onBeforeTypedSubmit,
    onUploadHomework, onLessonPlanIdChange, onLessonProgressChange,
    onCompletedSegmentsChange, availableLessonPlans, resumeState,
    socialMemory, progressDigest, lastOpener, readinessNote, onOpenerRecord, isTrial,
    targetKind, checkpointStale, teacherPersona, sessionWrapMinutes, maxDurationExplicit,
    onPracticeStatsChange,
  } = props;

  // Task E8: SessionStage's mobile "expand" button lives deep in this
  // component's slot tree and keeps its own expanded/collapsed local state.
  // That state must reset whenever the session ends (so it can't desync if
  // the student re-enters) — but every end path (End/Pause button, VTR- or
  // SessionControls-driven end incl. the demo time-limit auto-stop, header
  // back-nav) ultimately calls this one `onEndSession` prop. Wrapping it
  // ONCE here, at its single entry boundary, reaches every path below
  // without touching each call site's own teardown logic. Mirrors the
  // 'evelyn:open-transcript' window-event bridge already used to reach
  // SessionStage from up here.
  // Round-4 item 5: the Adaptive-menu Finish/Discard entries stash their
  // intent here BEFORE running VTR's endSession() teardown — that handle
  // calls onEndSession with no args, so the intent rides a ref through the
  // teardown and is forwarded at this single choke point.
  const endIntentRef = useRef<'finish' | 'discard' | undefined>(undefined);
  const handleEndSession = useCallback((reason?: 'time_limit') => {
    window.dispatchEvent(new Event('evelyn:session-ending'));
    onEndSession(reason, endIntentRef.current);
  }, [onEndSession]);

  // --- Session-view state (owned here) ---
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [whiteboardCommands, setWhiteboardCommands] = useState<WhiteboardCommand[]>([]);
  const [lessonProgress, setLessonProgress] = useState<LessonProgressState>({ plan: null, currentSegmentId: '' });
  const [completedSegmentIds, setCompletedSegmentIds] = useState<string[]>([]);
  const [liveVoiceState, setLiveVoiceState] = useState<VoiceState>('idle');
  // Wallclock ms when the student actually starts the voice session (mic tap).
  // Drives the SessionControls timer so it counts from start, not page mount.
  const [voiceStartedAtMs, setVoiceStartedAtMs] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [whiteboardActiveThisTurn, setWhiteboardActiveThisTurn] = useState(false);
  const [listeningHint, setListeningHint] = useState<'didnt-catch' | null>(null);
  const [boardNav, setBoardNav] = useState<BoardNav | null>(null);
  // True while a resumed session is rehydrated but the student hasn't continued
  // yet — drives the "Continue lesson" overlay over the board (its click is the
  // gesture that unlocks audio + kicks the brain to pick up the lesson).
  const [awaitingResume, setAwaitingResume] = useState(false);
  // R35 T-A: full-stage "joining" overlay (board + caption + dock) shown only
  // for the first voice mic-click of a fresh session, until the tutor's audio
  // actually starts — see VoiceTutorRealtime's onWarmupOverlayChange doc.
  const [warmupOverlay, setWarmupOverlay] = useState(false);
  // Task Y5: matches VoiceTutorRealtime's new -1 ("slow") default so the
  // pill renders correctly on first paint, before any onPaceBiasChange
  // callback fires (a callback only fires here when the resolved value
  // differs from the default — see pace-preference.ts).
  const [paceBias, setPaceBias] = useState(DEFAULT_PACE_BIAS);
  const [paceBiasFlash, setPaceBiasFlash] = useState(false);
  // Task W4: "Speak slower" TTS toggle — SEPARATE from paceBias above
  // (paceBias/"Slow down" changes explain depth; this only changes TTS
  // synthesis speed). Mirrored from VoiceTutorRealtime's internal state via
  // onSpeakingRateChange so the ⋯ menu item can render its ✓ state.
  const [speakingRate, setSpeakingRate] = useState<'slow' | 'normal'>('normal');
  // Task Y1: starter-chip practiceOverride state — mirrored from
  // VoiceTutorRealtime's internal ref via onPracticeOverrideChange so the
  // "Practice problems" chip can render its active state (Humor ✓ idiom).
  const [practiceOverrideActive, setPracticeOverrideActive] = useState(false);
  // Mock-review pre-start agenda — mirrored from VoiceTutorRealtime via
  // onMockAgendaChange. Non-empty ⇒ SessionStage shows the tappable question
  // list instead of the generic starter chips.
  const [mockAgenda, setMockAgenda] = useState<MockReviewAgendaItem[]>([]);
  const [mockAgendaRemaining, setMockAgendaRemaining] = useState<string | null>(null);
  // Mid-session Agenda drawer rows + pick handler — also mirrored from
  // VoiceTutorRealtime via onMockAgendaChange. Non-empty ⇒ SessionStage shows
  // the header "Agenda" button + the jump panel.
  const [mockDrawer, setMockDrawer] = useState<MockReviewDrawerRow[]>([]);
  // Agenda round 5: correct-question drawer rows (every non-miss served item),
  // shown behind the drawer's "show correct questions too" disclosure.
  const [mockCorrectDrawer, setMockCorrectDrawer] = useState<MockReviewDrawerRow[]>([]);
  // Agenda round 5: the mid-session Agenda drawer open-state, OWNED here (lifted
  // from SessionStage) so it can auto-open once at mock-review start and so the
  // open flag can drive SessionStage's pre-start collapse. Threaded down as a
  // controlled prop + change callback.
  const [agendaDrawerOpen, setAgendaDrawerOpen] = useState(false);
  // One-time latch: the drawer auto-opens exactly ONCE, when its data first
  // arrives (empty→non-empty) during pre-start. Never re-opens on later data
  // refreshes or after the student closes it.
  const agendaAutoOpenedRef = useRef(false);
  const pickAgendaItemRef = useRef<(itemId: string) => void>(() => {});
  // Agenda round 4: one-way latch flipped the instant a pre-start agenda row
  // or a drawer row is picked (both route through handleControlMessage / the
  // pick handler). SessionStage collapses the lingering pre-start chips to a
  // muted "Starting…" line so the list can't be double-tapped before the board
  // renders. Never reset — the board content hides the overlay from then on.
  const [agendaEngaged, setAgendaEngaged] = useState(false);
  // #7 hybrid (2026-07-17): standing difficulty preference — mirrored from
  // VoiceTutorRealtime via onDifficultyBiasChange (chip clicks AND blob
  // restore) so the Harder/Easier menu items render their sticky ✓×N state.
  const [difficultyBias, setDifficultyBias] = useState(0);
  // R34 T4: per-device Manual mic mode — mirrored from VoiceTutorRealtime
  // via onManualMicChange (⋯ menu toggle AND the runtime's mount-time
  // localStorage restore) so the ⋯ menu's Auto/Manual row renders the
  // correct active state on first paint.
  const [manualMic, setManualMic] = useState(false);
  // Practice meter (2026-07-17): live problem-work stats from the runtime.
  // Drives the header meter that REPLACES the segment beats when practice
  // mode is active (or no plan exists) — segment pills answer "where am I
  // in this lesson's content", which is the wrong question mid-practice.
  const [practiceStats, setPracticeStats] = useState<{ active: boolean; presented: number; solved: number; streak: number } | null>(null);
  const [, setIsPerceptionInterrupted] = useState(false);
  const [voiceTrouble, setVoiceTrouble] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pacingMenuOpen, setPacingMenuOpen] = useState(false);
  const [selectedLessonPlanId, setSelectedLessonPlanId] = useState<string | undefined>(lessonPlanId);
  const [nudgeDismissed, setNudgeDismissed] = useState(false);
  // Phase 2: pen mode + ink-fade epoch. The epoch bumps when a tutor turn
  // completes (isProcessing falling edge, tracked via the existing
  // prevBusyRef in handleTutorBusy) — strokes older than the current epoch
  // fade on the board.
  const [boardPenActive, setBoardPenActive] = useState(false);
  const [inkEpoch, setInkEpoch] = useState(0);
  // Stable identity: WhiteboardCanvas's idle-timer effect keys its 45s
  // timeout on this prop, so an inline arrow here (a new function every
  // TutorSession render — captions/voice state re-render often) would
  // re-arm the timer on every render and the idle-exit would rarely fire.
  const handlePenIdle = useCallback(() => setBoardPenActive(false), []);

  const micLevelRef = useRef(0);
  const localHandleRef = useRef<RealtimeHandle | null>(null);
  // Parent-shared when provided (see TutorSessionProps.handleRef); both are
  // stable useRef objects so this never changes identity across renders.
  const realtimeHandleRef = props.handleRef ?? localHandleRef;
  const paceBiasFlashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pacingMenuRef = useRef<HTMLDivElement>(null);
  const prevBusyRef = useRef(false);
  // P2 (demo feedback R2): one-shot guard for the session-started window
  // event — onSessionStarted can fire from several VTR paths; the portal
  // must see exactly one start signal (its countdown anchors on the first).
  // CRITICAL: resumed mounts must not re-emit (contract: resume does not
  // re-anchor the parent's demo clock — the original first start already
  // fired). Initialize as true when resuming so the dispatch never fires.
  const sessionStartedDispatchedRef = useRef(Boolean(resumeState));

  // R34 T1: End/Pause two-tap confirm. First click arms (3s window); a
  // stray/accidental tap no longer terminally ends the session (2026-07-26
  // trial failure: one tap ended a 38s demo). Second click within the
  // window runs the existing end path unchanged.
  const [endArmed, setEndArmed] = useState(false);
  const endArmTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Never leak the arm timer past unmount.
  useEffect(() => () => {
    if (endArmTimerRef.current) {
      clearTimeout(endArmTimerRef.current);
      endArmTimerRef.current = null;
    }
  }, []);

  // Close the adjust-lesson menu on outside click / Escape — without this
  // the only way to dismiss it was toggling the ⋯ button again (observed
  // live 2026-07-13).
  useEffect(() => {
    if (!pacingMenuOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (pacingMenuRef.current && !pacingMenuRef.current.contains(e.target as Node)) {
        setPacingMenuOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPacingMenuOpen(false);
    };
    // In the portal embed, a click on the PARENT page never reaches this
    // document — but it does steal focus, so window blur is the signal.
    const onBlur = () => setPacingMenuOpen(false);
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('blur', onBlur);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('blur', onBlur);
    };
  }, [pacingMenuOpen]);

  const {
    preferences: studentPreferencesForChip,
    setPreference: setStudentPreferenceForChip,
    clearPreference: clearStudentPreferenceForChip,
  } = useStudentPreferences();

  // --- Internal handlers ---
  const handleVoiceTranscriptUpdate = useCallback((entries: TranscriptEntry[]) => {
    setTranscript(entries);
    onTranscriptUpdate?.(entries);
  }, [onTranscriptUpdate]);

  // Resume-seed batches apply exactly once: `whiteboardCommands` above
  // outlives VoiceTutorRealtime instances (VTR is keyed on sessionId and can
  // remount within a session), so a replayed seed would append a duplicate of
  // the whole restored board (see resume-seed.ts). Guard lifetime ==
  // TutorSession instance == buffer lifetime; a dropped seed is not forwarded
  // (the parent's buffers already hold it too).
  const resumeSeedGuardRef = useRef(createSeedGuard());
  const handleVoiceWhiteboardCommand = useCallback((commands: WhiteboardCommand[], meta?: WhiteboardBatchMeta) => {
    if (!acceptWhiteboardBatch(resumeSeedGuardRef.current, meta)) return;
    setWhiteboardActiveThisTurn(true);
    setWhiteboardCommands((prev) => [...prev, ...commands]);
    onWhiteboardCommand?.(commands, meta);
  }, [onWhiteboardCommand]);

  const handleTutorBusy = useCallback((busy: boolean) => {
    if (busy && !prevBusyRef.current) setWhiteboardActiveThisTurn(false);
    // Phase 2 ink fade: a tutor turn just completed (falling edge) — bump the
    // epoch so older student strokes fade on the board.
    if (!busy && prevBusyRef.current) setInkEpoch((e) => e + 1);
    prevBusyRef.current = busy;
    setIsProcessing(busy);
  }, []);

  const handleTranscriptionStatus = useCallback<NonNullable<VTRProps['onTranscriptionStatus']>>((status, errorType) => {
    setVoiceTrouble(status === 'failed'
      ? "We're having a technical issue with voice right now — please use the typed chat below for the time being."
      : null);
    onTranscriptionStatus?.(status, errorType);
  }, [onTranscriptionStatus]);

  const handleUsage = useCallback<NonNullable<VTRProps['onUsageUpdate']>>((usage) => {
    onUsageUpdate?.(usage);
  }, [onUsageUpdate]);

  const applyLessonPlanId = useCallback((id: string) => {
    setSelectedLessonPlanId(id);
    onLessonPlanIdChange?.(id);
  }, [onLessonPlanIdChange]);

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

  // Control channel: a navigation/selection marker for the brain (e.g. an
  // agenda pick) that must NOT render a "Student wrote:" board card or get
  // wrapped as "[The student wrote on the whiteboard: …]". Same idiom as the
  // try-yourself marker — a bracketed synthetic send that relayUserTranscript
  // suppresses from the visible transcript. The marker itself carries the full
  // framing, so we just relay it verbatim.
  const handleControlMessage = useCallback((marker: string) => {
    // Agenda round 4: any control marker here is an agenda/drawer pick — latch
    // the pre-start cluster closed immediately (one-way).
    setAgendaEngaged(true);
    realtimeHandleRef.current?.sendTextMessage(marker);
  }, [realtimeHandleRef]);

  const handleStudentInput = useCallback((type: 'text' | 'drawing' | 'image', content: string) => {
    const cmd: WhiteboardCommand = type === 'image'
      ? { action: 'showSvgDiagram', title: 'Student Upload', svg: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><image href="${content}" x="5" y="5" width="390" height="290" preserveAspectRatio="xMidYMid meet"/></svg>` } as WhiteboardCommand
      : type === 'drawing'
      ? { action: 'showSvgDiagram', title: 'Student Drawing', svg: `<svg viewBox="0 0 400 150" xmlns="http://www.w3.org/2000/svg"><image href="${content}" x="5" y="5" width="390" height="140" preserveAspectRatio="xMidYMid meet"/></svg>` } as WhiteboardCommand
      : { action: 'showSvgDiagram', title: 'Student Answer', svg: `<svg viewBox="0 0 400 60" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="390" height="50" rx="8" fill="#eff6ff" stroke="#bfdbfe" stroke-width="1"/><text x="200" y="22" text-anchor="middle" font-size="11" fill="#6b7280">Student wrote:</text><text x="200" y="42" text-anchor="middle" font-size="16" font-weight="bold" fill="#1e40af">${content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</text></svg>` } as WhiteboardCommand;
    setWhiteboardCommands((prev) => [...prev, cmd]);
    if (realtimeHandleRef.current) {
      if (type === 'text') {
        realtimeHandleRef.current.sendTextMessage(`[The student wrote on the whiteboard: "${content}". Respond to what they wrote.]`);
      } else {
        const noun = type === 'drawing' ? 'drew on' : 'uploaded an image to';
        // Round-18 (2026-07-17): instant acknowledgment. The Vision
        // extraction below takes a few seconds, during which the dock shows
        // only a generic "Thinking…" — it reads as stuck and tempts the
        // student to re-click. Speak a canned one-liner the moment the
        // upload lands so the wait is explained; the brain's real response
        // follows once extraction returns.
        realtimeHandleRef.current?.speakText(
          type === 'drawing'
            ? 'Got your drawing — one sec while I take a look.'
            : 'Got your upload — one sec while I read it.',
        );
        (async () => {
          try {
            const base64Data = content.replace(/^data:image\/\w+;base64,/, '');
            const resp = await fetch('/api/tutor/extract-homework', {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ imageData: base64Data, mimeType: 'image/png', subject, topic, level }),
            });
            const data = await resp.json();
            if (data.extractedProblem && realtimeHandleRef.current) {
              realtimeHandleRef.current.sendTextMessage(`[The student ${noun} the whiteboard. It contains: "${data.extractedProblem}". Respond to what they shared.]`);
            } else {
              realtimeHandleRef.current?.sendTextMessage(`[The student ${noun} the whiteboard but the content could not be extracted. Ask them to describe what it shows.]`);
            }
          } catch {
            realtimeHandleRef.current?.sendTextMessage(`[The student ${noun} the whiteboard but it could not be analyzed. Ask them to describe what it shows.]`);
          }
        })();
      }
    }
    onTrackInteraction?.('click', `whiteboard-${type}`, { content: content.slice(0, 100) });
  }, [subject, topic, level, onTrackInteraction]);

  const dispatchQuick = useCallback((text: string) => {
    realtimeHandleRef.current?.stopSpeaking();
    realtimeHandleRef.current?.sendTextMessage(text);
  }, []);

  // #7 hybrid: bracketed directive sent alongside a difficulty-chip click.
  // Bracketed = synthetic (no session-start / timer side effects), and the
  // BRAIN decides the hybrid branch — it knows the conversation state
  // (mid-attempt vs between problems) better than any client heuristic.
  const difficultyChangeDirective = (bias: number): string => {
    const label = bias < 0 ? 'easier' : bias === 0 ? 'back to normal' : bias === 1 ? 'harder' : 'much harder';
    return `[difficulty-preference-changed: the student set their standing difficulty preference to "${label}" via the session controls. This governs every upcoming problem (see <difficulty_preference>) — they should not have to re-ask. If the student has FINISHED or given up on the current problem — or no problem is active — serve the NEXT problem now at the new level (generate_problem). If they are MID-attempt, acknowledge the change in a few words and continue the current problem unchanged; do NOT replace it.]`;
  };

  const handleStudentMark = useCallback((ev: StudentMarkEvent) => {
    realtimeHandleRef.current?.pushStudentMark?.(ev);
  }, [realtimeHandleRef]);

  // R2 E3: drag machinery for tutor ink notes bottoms out here — this is
  // the owner of `whiteboardCommands`/`setWhiteboardCommands` for the
  // live embed session (VoiceTutorRealtime itself never renders
  // WhiteboardCanvas or owns this state; it only appends via
  // onWhiteboardCommand). Addressed by the command's stamped `id`, not
  // array position — see InkNotesOverlay's NoteSource doc comment for why
  // an index can't be trusted once page-relocation/dedup/removeItems are
  // in play.
  //
  // Mutates the command object IN PLACE (matches this codebase's existing
  // convention — see VoiceTutorRealtime's handleWhiteboardCommand, which
  // freely stamps `id`/`targetId`/`_duplicateOf`/etc. onto the same
  // command objects rather than copying) rather than replacing it with a
  // spread copy. That matters here specifically: the embed page
  // (tutor-portal/embed/page.tsx) keeps its OWN `{cmd, capturedAt}[]`
  // mirror of these same command OBJECT REFERENCES for the session-save
  // payload, populated once when `onWhiteboardCommand` first appends a
  // batch and never re-synced afterward. A copy-on-write update here
  // would leave that mirror holding a stale pre-drag object — an in-place
  // mutation is visible from both arrays for free, no extra plumbing.
  // The returned array is still a NEW reference (spread) so React's
  // setState/useMemo dependency chain (WhiteboardCanvas's `pages` memo
  // keys off the `commands` array identity) re-renders normally.
  //
  // Safe under StrictMode's dev double-invoke of setState updaters: the
  // mutation is idempotent — re-running `(prev[idx] as any).userPos =
  // ref.userPos` a second time against the same `id` just assigns the
  // same `userPos` value again (a plain field overwrite, not an
  // accumulation like a counter increment would be), so invoking this
  // updater twice on the identical `prev` produces the identical result
  // either way.
  const handleInkNoteMoved = useCallback((ref: { kind: 'handwrite' | 'scribble'; id: string; userPos: { dx: number; dy: number } }) => {
    setWhiteboardCommands((prev) => {
      const idx = prev.findIndex((c) => (c as { id?: string }).id === ref.id && c.action === ref.kind);
      if (idx < 0) return prev;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (prev[idx] as any).userPos = ref.userPos;
      return [...prev];
    });
  }, []);

  // Student marks (tap-to-point + Phase 2 pen): flag AND claude-brain only —
  // the Realtime-authored engines have no dispatcher for resolveStudentMark.
  const studentMarksOn = TUTOR_STUDENT_MARKS && voiceEngine === 'claude-brain';

  // --- Composed slot elements ---
  const topicLabel = topicDisplayName || 'AI Tutor';

  const boardEl = (
    <div className="relative h-full">
      <WhiteboardCanvas
        commands={whiteboardCommands}
        tutorBusy={isProcessing && whiteboardActiveThisTurn}
        tutorTurnActive={isProcessing}
        onClear={() => setWhiteboardCommands([])}
        onAttentionShift={() => {}}
        onTryYourselfAnswer={handleTryYourselfAnswer}
        suppressEmptyState
        chrome="minimal"
        onNavChange={setBoardNav}
        openOnLastPage={!!resumeState}
        onStudentMark={studentMarksOn ? handleStudentMark : undefined}
        penMode={studentMarksOn && boardPenActive}
        onPenIdle={handlePenIdle}
        inkEpoch={inkEpoch}
        onInkNoteMoved={handleInkNoteMoved}
        className="h-full"
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
  );

  const transcriptEl = (
    <TranscriptView
      transcript={transcript}
      isProcessing={isProcessing}
      onQuickAnswer={(text) => {
        realtimeHandleRef.current?.stopSpeaking();
        realtimeHandleRef.current?.sendTextMessage(text);
      }}
      picker={availableLessonPlans && availableLessonPlans.length > 0 && !nudgeDismissed ? (
        <LessonNudgePicker
          plans={availableLessonPlans}
          recentTurns={transcript.slice(-6).map((t) => ({ role: t.role, text: t.text }))}
          lessonStarted={!!selectedLessonPlanId || !!lessonProgress.plan}
          currentTopicId={topic}
          introText={topicDisplayName ? `I see you chose ${topicDisplayName} — nice. You can tell me ANY topic in this area, or jump straight into one of these lessons:` : undefined}
          onSelect={(plan) => {
            applyLessonPlanId(plan.id);
            setNudgeDismissed(true);
            realtimeHandleRef.current?.sendTextMessage(
              `Let's do: ${plan.title}. [SYSTEM OVERRIDE: The student has explicitly selected the lesson "${plan.title}" via the in-session picker. Disregard any prior teasing or conversational tangent. This is now the active lesson. Begin teaching it immediately by calling show_segment_card with the FIRST authored segment id from the plan that is now loaded; do not invent segment ids and do not narrate any other topic.]`,
            );
          }}
          onDismiss={() => setNudgeDismissed(true)}
        />
      ) : undefined}
    />
  );

  // --- Derived presence/caption (computed BEFORE the dock so the caption can
  //     ride inside it as VTR's captionSlot — the one-line merged bar) ---
  // R38: `historyOnly` entries are the "(rendered: tool, tool, …)"
  // tool-only-turn placeholder (see TranscriptEntry.historyOnly doc) — they
  // exist purely for the brain's next-turn context and are never meant to
  // reach the student. lastTutorEntry now skips them everywhere it's used
  // (live caption text, the caption's click-to-scroll transcript id, and the
  // Q-pin's owning-turn tracking) — pointing the caption/click-target at one
  // of these would either leak debug text into the dock or scroll to an
  // entry TranscriptView filters out and never renders, so no consumer here
  // wants the raw latest entry including these placeholders.
  const lastTutorEntry = latestSubstantiveTutorEntry(transcript);
  const lastEntry = transcript[transcript.length - 1];
  const started = transcript.length > 0 || liveVoiceState !== 'idle';
  const derivedVoiceState: VoiceState =
    isProcessing ? 'thinking' : lastEntry?.role === 'tutor' ? 'speaking' : 'listening';
  const voiceState: VoiceState =
    liveVoiceState !== 'idle' ? liveVoiceState : started ? derivedVoiceState : 'idle';

  // Agenda round 5: auto-open the Agenda drawer ONCE when its rows first arrive,
  // but only during pre-start (session not yet started and no agenda pick made).
  // The one-way latch means later data refreshes and a student-initiated close
  // never re-trigger it. Pre-start + drawer-open makes SessionStage collapse the
  // center agenda list to a hint (the drawer is now the single agenda surface).
  useEffect(() => {
    if (agendaAutoOpenedRef.current) return;
    if (mockDrawer.length === 0) return;           // wait for data
    if (started || agendaEngaged) return;          // pre-start only
    agendaAutoOpenedRef.current = true;
    setAgendaDrawerOpen(true);
  }, [mockDrawer, started, agendaEngaged]);
  const liveCaption = lastTutorEntry?.text?.replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1') || undefined;
  // Caption word-sync: stable poll getter for the CaptionTicker. Reads the
  // engine handle imperatively — no React state churn at poll frequency.
  const getSpokenCaption = useCallback((): SpokenCaption | null => {
    return realtimeHandleRef.current?.getSpokenCaption?.() ?? null;
  }, [realtimeHandleRef]);
  // Dock caption (2026-07-14 one-line bar): the tutor's live sentence sits
  // INSIDE the voice dock, replacing VTR's state-text block. Tap → transcript
  // drawer, via the window event bridge (the drawer state lives in
  // SessionStage, two composition levels down from the VTR element).
  // CaptionTicker is mount-gated on liveCaption — load-bearing for its poll
  // probe (must not mount before VTR's handle-population effect has run).
  // With no caption yet, the slot doubles as the mic-state line (R1: the old
  // status row under the textbox is gone); once a caption exists, muted state
  // shows as a small MUTED chip beside it.
  // Round-5 feedback: the state cues ("Hearing you…", "Thinking…") must stay
  // visible even when a caption exists — they're how the student knows the
  // tutor isn't stuck. Transient perception/composition states REPLACE the
  // caption for their duration; while the tutor speaks, a SPEAKING chip +
  // waveform ride alongside the caption; muted keeps the MUTED chip.
  const statusOverride =
    listeningHint === 'didnt-catch' ? { text: 'Didn’t catch that — mind repeating?', cls: 'text-amber-600' }
    : voiceState === 'hearing' ? { text: 'Hearing you…', cls: 'text-blue-600' }
    : voiceState === 'processing' ? { text: 'Got that — one sec…', cls: 'text-amber-600' }
    : voiceState === 'thinking' ? { text: 'Thinking…', cls: 'text-slate-400' }
    // R34 T4: Manual mic mode has a buffered, unsent turn — same override
    // idiom as hearing/processing/thinking above (replaces the caption
    // rather than riding alongside it as a chip, like muted does) since
    // it's the actionable state the student needs to see until they tap ✓.
    : voiceState === 'manual-held' ? { text: 'Held — tap ✓ to send', cls: 'text-blue-600' }
    : null;
  // 2026-07-26 pre-start redesign: pre-start now reads "or start here — talk
  // or type", because the ORB is the primary start control and this line's
  // job is to tell a student who can't or won't speak that typing works too.
  const dockStatus = {
    text: preStartDockCaption({ started, muted: voiceState === 'muted' }),
    cls: voiceState === 'muted' ? 'text-slate-500' : started ? 'text-slate-400' : 'text-slate-500',
  };
  const dockCaptionEl = statusOverride ? (
    <span className={`block truncate text-xs font-medium ${statusOverride.cls}`}>{statusOverride.text}</span>
  ) : liveCaption ? (
    <button
      type="button"
      title="Open transcript"
      // Round-15 Issue 9 (2026-07-16): pass the last tutor entry's id so
      // TranscriptView scrolls to (and flashes) the message the caption is
      // showing — the bare event opened the drawer but TranscriptView's
      // listener early-returns without an entryId, leaving the scroll
      // wherever it last was. Same event shape as the Q-pill below; falls
      // back to the bare event when no tutor entry exists yet.
      onClick={() => window.dispatchEvent(
        lastTutorEntry?.id
          ? new CustomEvent('evelyn:open-transcript', { detail: { entryId: lastTutorEntry.id } })
          : new Event('evelyn:open-transcript'),
      )}
      className="w-full min-w-0 flex items-center gap-2 text-left"
    >
      {voiceState === 'muted' && (
        <span className="shrink-0 rounded bg-red-50 px-1 py-0.5 text-[10px] font-bold text-red-500">MUTED</span>
      )}
      {voiceState === 'speaking' && (
        <span className="shrink-0 rounded bg-emerald-50 px-1 py-0.5 text-[10px] font-bold text-emerald-600">SPEAKING</span>
      )}
      <CaptionTicker text={liveCaption} getSpoken={TUTOR_CAPTION_SYNC ? getSpokenCaption : undefined} />
      {voiceState === 'speaking' && <MicMeter level={0} speaking />}
    </button>
  ) : (
    <span className={`block truncate text-xs font-medium ${dockStatus.cls}`}>{dockStatus.text}</span>
  );

  // --- Q pin v2 (2026-07-15 round-4): pin the gist of the tutor's question.
  //     LLM-FIRST: the gist is fetched as soon as the turn TEXT is final
  //     (audio still playing — Haiku returns in ~200ms, long before the
  //     question sentence is reached), so the mid-cut ellipsis fallback that
  //     round-4 flagged never flashes. The complete last-"?"-sentence is the
  //     fallback ONLY when the API call fails. Reveal timing: the pin appears
  //     when the question sentence starts being SPOKEN (caption-sync poll
  //     matches its opening words) — or at audio end as the backstop —
  //     persists through the student's turn, and disappears when the next
  //     turn starts composing.
  const [questionPin, setQuestionPin] = useState<{ turnId: string; gist: string } | null>(null);
  const [pinShownForTurn, setPinShownForTurn] = useState<string | null>(null);
  const pinFetchedTurnRef = useRef<string | null>(null);
  // Round-28b: BOTH voice engines failed a sentence (Cartesia retries +
  // voice-matched ElevenLabs fallback) — show the unspoken text as a
  // transient captions pin at the board bottom. Cleared when the tutor's
  // audio actually resumes (voiceState → speaking) or after 30s.
  const [voiceHiccup, setVoiceHiccup] = useState<string | null>(null);
  const voiceHiccupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleVoiceHiccup = useCallback((text: string) => {
    setVoiceHiccup(text);
    if (voiceHiccupTimerRef.current) clearTimeout(voiceHiccupTimerRef.current);
    voiceHiccupTimerRef.current = setTimeout(() => setVoiceHiccup(null), 30_000);
  }, []);
  useEffect(() => {
    if (voiceState === 'speaking' && voiceHiccup) {
      // Audio is flowing again — the pin has served its purpose.
      if (voiceHiccupTimerRef.current) clearTimeout(voiceHiccupTimerRef.current);
      setVoiceHiccup(null);
    }
  }, [voiceState, voiceHiccup]);
  // Streaming entries update text sentence-by-sentence; only fetch once the
  // turn is finalized so the gist sees the whole turn. Finalization is the
  // `streaming` flag flipping false — the entry KEEPS its `tutor-streaming-*`
  // id on purpose (see TranscriptEntry.streaming doc), which is why an
  // id-prefix check here silently killed every pin (round-5 regression).
  const lastTutorFinal = lastTutorEntry && !lastTutorEntry.streaming ? lastTutorEntry : null;

  useEffect(() => {
    if (!TUTOR_QUESTION_PIN) return;
    const entry = lastTutorFinal;
    if (!entry || !entry.text || !entry.text.includes('?')) return;
    if (pinFetchedTurnRef.current === entry.id) return;
    pinFetchedTurnRef.current = entry.id;
    void fetch('/api/tutor/question-gist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ turnText: entry.text }),
    })
      // Task Y2: the route now returns non-200 for an internal failure
      // (Anthropic 5xx/timeout/parse) and 200 for every model verdict,
      // including deliberate NONE. Rejecting here on !r.ok is what makes
      // the .catch() fallback below an ERROR-only path — a deliberate
      // NONE resolves gist to '' in the .then branch and pins nothing,
      // without ever touching lastQuestionSentence.
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`gist ${r.status}`))))
      .then((d) => {
        // Strip markdown emphasis the Haiku producer sometimes emits
        // (Task X8: "*in order to*" showed as literal asterisks — the pin
        // renders through InlineMathText, which only special-cases $...$
        // math, not *emphasis*).
        const gist = typeof d?.gist === 'string' ? stripMarkdownEmphasis(d.gist.trim()) : '';
        // gist === '' means the model judged the turn's "?" conversational
        // plumbing (a repeat-request / mishear) — deliberately NO pin then.
        if (gist) setQuestionPin({ turnId: entry.id, gist });
      })
      .catch(() => {
        const fallback = lastQuestionSentence(entry.text);
        if (fallback) setQuestionPin({ turnId: entry.id, gist: fallback });
      });
  }, [lastTutorFinal]);

  // Reveal: poll the caption-sync audio-locked reveal while this turn is
  // speaking; when the question sentence's opening words have been spoken,
  // show the pin. In EVERY other voice state, mark it shown immediately —
  // round-6 found a hole where a gist landing after speech ended but during
  // 'thinking'/'hearing' (fast student answers) never got marked and the
  // pin silently skipped a turn. Marking is separate from display: the
  // render gate below still hides it once the turn goes stale or the next
  // turn is composing.
  useEffect(() => {
    if (!questionPin || pinShownForTurn === questionPin.turnId) return;
    if (voiceState !== 'speaking') { setPinShownForTurn(questionPin.turnId); return; }
    // R38: the staleness guard below (pin's turn must still be
    // lastTutorFinal) only matters for the speaking-probe path — it reads
    // lastTutorFinal.text to build the spoken-caption probe, which is
    // meaningless once a newer turn is the one actually speaking. Under the
    // persist-until-replaced semantics, a pin whose owning turn was
    // superseded (idle nudge, board-only turn) while NOT speaking is marked
    // shown by the branch above and never reaches this guard; it only fires
    // while the (now different) latest turn is mid-speech.
    if (questionPin.turnId !== lastTutorFinal?.id) return;
    const q = lastQuestionSentence(lastTutorFinal.text) ?? questionPin.gist;
    const probe = normalizeSpoken(q).slice(0, 16);
    if (!probe) return;
    const id = setInterval(() => {
      const c = getSpokenCaption();
      if (c?.live && normalizeSpoken(c.text).includes(probe)) {
        setPinShownForTurn(questionPin.turnId);
      }
    }, 300);
    return () => clearInterval(id);
  }, [questionPin, pinShownForTurn, voiceState, lastTutorFinal, getSpokenCaption]);

  // Task Y2 (2026-07-16): the marking effect above already encodes
  // reveal-safety (probe-matched while speaking, or marked-shown
  // immediately in any non-speaking state, including 'thinking') — a
  // second, narrower `voiceState !== 'thinking'` gate here silently
  // dropped gists that finished marking-shown but landed/settled during
  // the NEXT turn's 'thinking' (student answered fast).
  // R38: no lastTutorEntry staleness clause — the pin persists across
  // non-question tutor turns (idle nudge, board-only) and is retired only
  // by ✕ or by the gist effect pinning the NEXT question.
  // R23: the pin can obstruct the board — dismissable via ✕. The root is a
  // div[role=button] (not <button>) because the ✕ inside must be a real
  // button and nested buttons are invalid HTML. Dismiss = setQuestionPin(null)
  // only: pinFetchedTurnRef already blocks a same-turn re-fetch, so the pin
  // cannot re-appear until the next finalized turn.
  const questionPinEl =
    TUTOR_QUESTION_PIN && questionPin && pinShownForTurn === questionPin.turnId ? (
      <div
        role="button"
        tabIndex={0}
        onClick={() => window.dispatchEvent(new CustomEvent('evelyn:open-transcript', { detail: { entryId: questionPin.turnId } }))}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            window.dispatchEvent(new CustomEvent('evelyn:open-transcript', { detail: { entryId: questionPin.turnId } }));
          }
        }}
        title="The tutor's question — tap for the full transcript"
        className="ss-cap w-full flex items-center gap-2 rounded-xl bg-amber-50/95 border border-amber-200 shadow-md px-3 py-1.5 text-left cursor-pointer"
      >
        <span className="shrink-0 grid place-items-center w-5 h-5 rounded-md bg-amber-400 text-white text-[10px] font-bold">Q</span>
        <span className="min-w-0 text-sm font-medium leading-snug text-amber-900"><InlineMathText text={questionPin.gist} forceMath /></span>
        <button
          type="button"
          aria-label="Dismiss question pin"
          onClick={(e) => {
            e.stopPropagation();
            setQuestionPin(null);
          }}
          className="shrink-0 grid place-items-center w-5 h-5 rounded-md text-amber-700/70 hover:bg-amber-100 hover:text-amber-900"
        >
          ✕
        </button>
      </div>
    ) : undefined;

  // Round-28b: voice-hiccup captions pin — board-bottom sibling of the
  // Q-pin, shown only when a sentence could not be spoken by EITHER voice
  // engine. Renders the unspoken text (math via KaTeX) under a short
  // "shifting to captions" chip.
  const hiccupPinEl = voiceHiccup ? (
    <div className="ss-cap w-full flex items-start gap-2 rounded-xl bg-slate-50/95 border border-slate-300 shadow-md px-3 py-1.5">
      <span className="shrink-0 mt-0.5 rounded-md bg-slate-500 text-white text-[10px] font-bold px-1.5 py-0.5 whitespace-nowrap">Voice hiccup — captions</span>
      <span className="min-w-0 text-sm font-medium leading-snug text-slate-800"><InlineMathText text={voiceHiccup} /></span>
      <button
        type="button"
        aria-label="Dismiss captions pin"
        onClick={() => setVoiceHiccup(null)}
        className="shrink-0 grid place-items-center w-5 h-5 rounded-md text-slate-500 hover:bg-slate-200 hover:text-slate-800"
      >
        ✕
      </button>
    </div>
  ) : undefined;

  // R1: End/Pause in the header. MUST run VTR's full teardown (handleRef
  // endSession = TTS hard-stop + recording finalize + final profile commit)
  // — calling onEndSession directly would skip the final transcript commit.
  const endControlEl = (
    <button
      onClick={() => {
        if (!endArmed) {
          setEndArmed(true);
          if (endArmTimerRef.current) clearTimeout(endArmTimerRef.current);
          // 3s to confirm; disarm quietly if the student hesitates. Guards the
          // 2026-07-26 trial failure: one stray tap ended a 38s demo terminally.
          endArmTimerRef.current = setTimeout(() => setEndArmed(false), 3000);
          return;
        }
        if (endArmTimerRef.current) { clearTimeout(endArmTimerRef.current); endArmTimerRef.current = null; }
        setEndArmed(false);
        const h = realtimeHandleRef.current;
        if (h?.endSession) h.endSession();
        else handleEndSession();
      }}
      title={endArmed ? 'Tap again to end the session' : 'End or pause — your progress is saved, resume anytime'}
      aria-label={endArmed ? 'Tap again to end the session' : 'End or pause session'}
      className={`flex shrink-0 items-center gap-1.5 px-3 h-9 rounded-full text-xs font-semibold border transition-colors ${
        endArmed
          ? 'bg-red-600 text-white border-red-600 hover:bg-red-700'
          : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
      }`}
    >
      {/* Narrow (<sm): one fixed-width slot that swaps icon ↔ "End?" so the
          armed state always presents TEXT (2026-07-26 trial: color-only arm
          read as a broken button) while the pill geometry never changes —
          the second tap lands on the same hit target (R34 rule). */}
      <span className="inline-flex min-w-[2.25rem] justify-center sm:hidden">
        {endArmed ? 'End?' : <LogOut className="w-3.5 h-3.5" />}
      </span>
      <LogOut className="hidden sm:inline-block w-3.5 h-3.5" />
      {/* inline-block + min-w so the longer "End session?" label reserves
          the same slot as "End / Pause" — armed/unarmed never resize the
          pill, so the second tap always lands on the same hit target. */}
      <span className="hidden sm:inline-block sm:min-w-[6.5rem]">{endArmed ? 'End session?' : 'End / Pause'}</span>
      {/* Screen readers hear the arm regardless of viewport. */}
      <span aria-live="polite" className="sr-only">
        {endArmed ? 'Tap again to end the session' : ''}
      </span>
    </button>
  );

  const voiceInputEl = (
    <>
      {voiceTrouble && (
        <div className="mb-1 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-md text-xs text-amber-900 flex items-center gap-2"><span>⚠️</span><span>{voiceTrouble}</span></div>
      )}
      <VoiceTutorRealtime
        key={sessionId}
        subject={subject}
        topic={topic}
        level={level}
        studentName={studentName || undefined}
        studentId={studentId}
        socialMemory={socialMemory}
        progressDigest={progressDigest}
        lastOpener={lastOpener}
        readinessNote={readinessNote}
        onOpenerRecord={onOpenerRecord}
        isTrial={isTrial}
        targetKind={targetKind}
        checkpointStale={checkpointStale}
        teacherPersona={teacherPersona}
        sessionId={sessionId}
        sessionStartedAtMs={sessionStartedAtMs}
        sessionGoal={sessionGoal}
        mockReview={mockReview}
        lessonPlanId={selectedLessonPlanId || undefined}
        captionSlot={dockCaptionEl}
        hideEndButton
        voice={voice}
        onTranscriptUpdate={handleVoiceTranscriptUpdate}
        onWhiteboardCommand={handleVoiceWhiteboardCommand}
        onUsageUpdate={handleUsage}
        onBrainUsage={onBrainUsage}
        onDebugEvent={onDebugEvent}
        onError={(err) => setError(err.message)}
        onTranscriptionStatus={handleTranscriptionStatus}
        onEndSession={handleEndSession}
        onMilestone={onMilestone}
        onTrackInteraction={onTrackInteraction}
        handleRef={realtimeHandleRef}
        validateToolCalls={voiceEngine === 'realtime-validated'}
        claudeBrainMode={voiceEngine === 'claude-brain'}
        useRealtimeV2={voiceEngine === 'realtime-2'}
        ttsProvider={ttsProvider}
        cartesiaVoiceId={cartesiaVoiceId}
        cartesiaVoiceSpeed={cartesiaVoiceSpeed}
        onLessonPlanProgress={(p) => { setLessonProgress(p); onLessonProgressChange?.(p); }}
        onTutorBusy={handleTutorBusy}
        onVoiceStateChange={setLiveVoiceState}
        resumeState={resumeState}
        onResumeAwaitingTapChange={setAwaitingResume}
        onWarmupOverlayChange={setWarmupOverlay}
        onSessionStarted={() => {
          if (!sessionStartedDispatchedRef.current) {
            sessionStartedDispatchedRef.current = true;
            // Same window-event bridge as 'evelyn:session-ending' (above) —
            // the embed page relays it to the parent as a postMessage. The
            // timestamp rides in detail so the portal can anchor its
            // countdown on the exact same instant this component's own
            // timer uses (same-browser clock — no skew).
            window.dispatchEvent(
              new CustomEvent('evelyn:session-started', { detail: { startedAtMs: Date.now() } }),
            );
          }
          setVoiceStartedAtMs((prev) => prev ?? Date.now());
        }}
        onMicLevel={(l) => { micLevelRef.current = l; }}
        onListeningHint={setListeningHint}
        onVoiceHiccup={handleVoiceHiccup}
        onPaceBiasChange={(bias) => {
          setPaceBias(bias);
          setPaceBiasFlash(true);
          if (paceBiasFlashTimeoutRef.current) clearTimeout(paceBiasFlashTimeoutRef.current);
          paceBiasFlashTimeoutRef.current = setTimeout(() => setPaceBiasFlash(false), 1600);
        }}
        onSpeakingRateChange={setSpeakingRate}
        onPracticeOverrideChange={setPracticeOverrideActive}
        onMockAgendaChange={(agenda, remainingLine, drawer, onPick, correctDrawer) => {
          setMockAgenda(agenda); setMockAgendaRemaining(remainingLine);
          setMockDrawer(drawer); pickAgendaItemRef.current = onPick;
          setMockCorrectDrawer(correctDrawer ?? []);
        }}
        refetchMockReview={refetchMockReview}
        onStudentInput={handleStudentInput}
        onControlMessage={handleControlMessage}
        onDifficultyBiasChange={setDifficultyBias}
        onManualMicChange={setManualMic}
        onPracticeStatsChange={(s) => { setPracticeStats(s); onPracticeStatsChange?.(s); }}
        onInterruptedChange={setIsPerceptionInterrupted}
        onBeforeTypedSubmit={onBeforeTypedSubmit}
        onProposePlanSwap={onProposePlanSwap}
        onConfirmPlanLos={onConfirmPlanLos}
        onCompletedSegmentsChange={(ids) => { setCompletedSegmentIds([...ids]); onCompletedSegmentsChange?.([...ids]); }}
        sessionMaxMinutes={sessionMaxMinutes}
        sessionWrapMinutes={sessionWrapMinutes}
        maxDurationExplicit={maxDurationExplicit}
        dockVariant="island"
      />
    </>
  );

  // Practice meter: swaps in for the segment beats while practice mode is
  // active (and for plan-less sessions once a problem has been shown).
  const showPracticeMeter = !!practiceStats
    && (practiceStats.active || !lessonProgress.plan)
    && practiceStats.presented > 0;
  const practiceMeterEl = showPracticeMeter && practiceStats ? (
    <div className="flex items-center gap-2 text-xs whitespace-nowrap" aria-label="Practice progress">
      <span className="rounded-full bg-blue-50 border border-blue-200 text-blue-700 px-2 py-0.5 font-medium">
        {practiceStats.active ? 'Practice' : 'Problems'}
      </span>
      <span className="font-semibold text-slate-700">✓ {practiceStats.solved} solved</span>
      {practiceStats.streak >= 2 && (
        <span className="font-semibold text-amber-600">🔥 ×{practiceStats.streak}</span>
      )}
      <span className="text-slate-400">{practiceStats.presented} shown</span>
    </div>
  ) : null;
  const beatsEl = practiceMeterEl ?? (lessonProgress.plan ? (
    <LessonPlanProgress plan={lessonProgress.plan} currentSegmentId={lessonProgress.currentSegmentId} completedSegmentIds={completedSegmentIds} />
  ) : null);

  const controlsEl = (
    <SessionControls
      sessionId={sessionId}
      startedAtMs={voiceStartedAtMs}
      maxDuration={sessionMaxMinutes}
      onEndSession={handleEndSession}
      onUploadHomework={onUploadHomework ?? (() => {})}
      transcript={transcript}
      whiteboardCommands={whiteboardCommands}
      topicName={topicLabel}
      sessionGoal={sessionGoal}
      studentName={studentName || undefined}
      subject={subject}
      level={level}
    />
  );

  // ⋯ pacing + humor menu
  const humorBand = gradeBandFor(level || '');
  const HUMOR_CHOICES: Array<{ value: StudentPreferences['humorCeiling'] | null; label: string; minBand: 'K-2' | '3-5' | '6-8' | '9-12' }> = [
    { value: null, label: 'Default', minBand: 'K-2' },
    { value: 'off', label: 'Serious', minBand: 'K-2' },
    { value: 'light', label: 'A little funny', minBand: 'K-2' },
    { value: 'medium', label: 'Pretty funny', minBand: '3-5' },
    { value: 'heavy', label: 'Very funny', minBand: '6-8' },
  ];
  const BAND_RANK: Record<'K-2' | '3-5' | '6-8' | '9-12', number> = { 'K-2': 0, '3-5': 1, '6-8': 2, '9-12': 3 };
  const currentHumor = studentPreferencesForChip.humorCeiling ?? null;
  const adaptiveMenuEl = (
    <div ref={pacingMenuRef} className="relative flex items-center gap-1">
      {/* Task Y5: ALWAYS visible (not just when bias ≠ 0 / flashing) —
          discoverability was the whole point: a student should be able to
          see + tap into the pace control without ever having touched it.
          Subdued neutral styling at "normal" (0), warmer amber/green +
          transient flash highlight otherwise — same as before. Tappable
          (button, not span) to open this same adaptive/session menu. */}
      <button
        type="button"
        onClick={() => setPacingMenuOpen((o) => !o)}
        aria-label={paceBias < 0 ? 'Pace: slow — tap to adjust' : paceBias > 0 ? 'Pace: fast — tap to adjust' : 'Pace: normal — tap to adjust'}
        className={`text-[11px] px-2 py-0.5 rounded-full border transition-all duration-200 ${
          paceBiasFlash ? 'bg-blue-100 border-blue-400 text-blue-800'
          : paceBias < 0 ? 'bg-amber-50 border-amber-300 text-amber-800'
          : paceBias > 0 ? 'bg-green-50 border-green-300 text-green-800'
          : 'bg-slate-50 border-slate-200 text-slate-500'
        }`}
      >
        {paceBias < 0 ? `Pace: slow${Math.abs(paceBias) > 1 ? ` ×${Math.abs(paceBias)}` : ''}`
          : paceBias > 0 ? `Pace: fast${paceBias > 1 ? ` ×${paceBias}` : ''}`
          : 'Pace: normal'}
      </button>
      <button onClick={() => setPacingMenuOpen((o) => !o)} className="grid place-items-center w-9 h-9 rounded-full hover:bg-slate-100 text-slate-600 text-lg leading-none">⋯</button>
      {pacingMenuOpen && (
        <div className="absolute right-0 top-full mt-2 w-52 max-h-[70dvh] overflow-y-auto rounded-2xl bg-white border border-slate-200 shadow-xl p-1.5 z-50 text-sm">
          <p className="px-3 pt-1 pb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Adjust the lesson</p>
          {/* #7 hybrid (2026-07-17): Harder/Easier are now a STANDING
              preference, not a one-shot "give me a harder one" utterance.
              Each click steps the durable difficultyBias (sticky ✓×N, menu
              stays open — same idiom as the pace items below) and sends a
              bracketed directive letting the BRAIN apply the hybrid: fetch
              the next problem now at the new level if the student is
              between problems, or just acknowledge and keep the current
              problem if they're mid-attempt. The bias also rides every
              turn (<difficulty_preference>) and deterministically upgrades
              generate_problem's 'same' difficulty at the stream route, so
              the student never has to re-ask. */}
          <button onClick={() => { const next = Math.min(2, difficultyBias + 1); if (next !== difficultyBias) { realtimeHandleRef.current?.setDifficultyBias(next); realtimeHandleRef.current?.sendTextMessage(difficultyChangeDirective(next)); } }} className={`w-full text-left px-3 py-2 rounded-xl ${difficultyBias > 0 ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-slate-50 text-slate-700'}`}>
            <span className="inline-block w-3">{difficultyBias > 0 ? '✓' : ''}</span> Harder{difficultyBias > 0 ? ` ×${difficultyBias}` : ''}
          </button>
          <button onClick={() => { const next = Math.max(-1, difficultyBias - 1); if (next !== difficultyBias) { realtimeHandleRef.current?.setDifficultyBias(next); realtimeHandleRef.current?.sendTextMessage(difficultyChangeDirective(next)); } }} className={`w-full text-left px-3 py-2 rounded-xl ${difficultyBias < 0 ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-slate-50 text-slate-700'}`}>
            <span className="inline-block w-3">{difficultyBias < 0 ? '✓' : ''}</span> Easier
          </button>
          <div className="my-1 border-t border-slate-100" />
          {/* Task W3: pace items keep the menu OPEN on click (delta is
              ±1 per click, clamped ±2 — a second/third click must be able
              to land without re-opening the menu). Sticky ✓×N state
              mirrors the Humor ✓ pattern below so the active pace choice
              is visible on the menu item itself, not just the transient
              pill beside the ⋯ button. */}
          <button onClick={() => { realtimeHandleRef.current?.stepPaceBias(-1); }} className={`w-full text-left px-3 py-2 rounded-xl ${paceBias < 0 ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-slate-50 text-slate-700'}`}>
            <span className="inline-block w-3">{paceBias < 0 ? '✓' : ''}</span> Slow down{paceBias < 0 ? ` ×${Math.abs(paceBias)}` : ''}
          </button>
          <button onClick={() => { realtimeHandleRef.current?.stepPaceBias(1); }} className={`w-full text-left px-3 py-2 rounded-xl ${paceBias > 0 ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-slate-50 text-slate-700'}`}>
            <span className="inline-block w-3">{paceBias > 0 ? '✓' : ''}</span> Speed up{paceBias > 0 ? ` ×${paceBias}` : ''}
          </button>
          <div className="my-1 border-t border-slate-100" />
          <button onClick={() => { realtimeHandleRef.current?.stopSpeaking(); realtimeHandleRef.current?.sendTextMessage("I'm done — let's wrap up."); setPacingMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700">Wrap up</button>
          {/* Round-4 item 5 (embed-only): the portal's bottom-strip
              Finish/Discard buttons moved here. Each stashes its intent in
              endIntentRef, then runs VTR's FULL endSession() teardown (TTS
              hard-stop + recording finalize + final profile commit) — same
              fallback shape as the End button above; handleEndSession
              forwards the intent to the embed's session_ended postMessage. */}
          {embedded && !isTrial && (
            <>
              <div className="my-1 border-t border-slate-100" />
              <button
                onClick={() => {
                  setPacingMenuOpen(false);
                  endIntentRef.current = 'finish';
                  const h = realtimeHandleRef.current;
                  if (h?.endSession) h.endSession();
                  else handleEndSession();
                }}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700"
              >
                Finish lesson
              </button>
              <button
                onClick={() => {
                  setPacingMenuOpen(false);
                  endIntentRef.current = 'discard';
                  const h = realtimeHandleRef.current;
                  if (h?.endSession) h.endSession();
                  else handleEndSession();
                }}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-red-50 text-red-600"
              >
                Discard session
              </button>
            </>
          )}
          {/* Round-5: the TRIAL/demo counterpart. The demo funnel used to spend
              a whole portal row above the iframe on this one button; moving it
              here is what let that row go away on mobile. Only "finish" makes
              sense for a trial — there is no cross-session continuity to
              discard, and the host already treats session_ended as the wall
              trigger, so this needs no new host→engine contract. */}
          {embedded && isTrial && (
            <>
              <div className="my-1 border-t border-slate-100" />
              <button
                onClick={() => {
                  setPacingMenuOpen(false);
                  endIntentRef.current = 'finish';
                  const h = realtimeHandleRef.current;
                  if (h?.endSession) h.endSession();
                  else handleEndSession();
                }}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700"
              >
                I&rsquo;ve finished this concept
              </button>
            </>
          )}
          {/* R34 T4: Manual mic — per-device opt-in, TUTOR_MANUAL_MIC-gated.
              Auto/Manual segmented pair mirrors the "Pace: slow ×1" pill's
              active/inactive styling above; keeps the menu open on tap, same
              idiom as the Harder/Easier/pace rows (a mis-tap must be
              correctable without reopening). setManualMic (imperative
              handle) sends any buffered turn when leaving Manual — see
              VoiceTutorRealtime. */}
          {TUTOR_MANUAL_MIC && (
            <>
              <div className="my-1 border-t border-slate-100" />
              <div className="px-3 pt-1 pb-1.5 flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Mic</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => realtimeHandleRef.current?.setManualMic(false)}
                    className={`text-[11px] px-2 py-0.5 rounded-full border transition-all duration-200 ${
                      !manualMic ? 'bg-blue-50 border-blue-300 text-blue-800 font-medium' : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    Auto
                  </button>
                  <button
                    type="button"
                    onClick={() => realtimeHandleRef.current?.setManualMic(true)}
                    className={`text-[11px] px-2 py-0.5 rounded-full border transition-all duration-200 ${
                      manualMic ? 'bg-blue-50 border-blue-300 text-blue-800 font-medium' : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    Manual
                  </button>
                </div>
              </div>
            </>
          )}
          <div className="my-1 border-t border-slate-100" />
          <p className="px-3 pt-1 pb-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Humor</p>
          {HUMOR_CHOICES.filter((c) => BAND_RANK[humorBand] >= BAND_RANK[c.minBand]).map((c) => {
            const isSel = currentHumor === c.value;
            return (
              <button
                key={c.value ?? 'default'}
                onClick={() => {
                  if (c.value === null) clearStudentPreferenceForChip('humorCeiling');
                  else setStudentPreferenceForChip('humorCeiling', c.value);
                  setPacingMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl ${isSel ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-slate-50 text-slate-700'}`}
              >
                <span className="inline-block w-3">{isSel ? '✓' : ''}</span> {c.label}
              </button>
            );
          })}
          {/* Fix W4-review-1: only openai-mini honors
              voice.__experimental_controls.speed — Cartesia sonic-3.5
              ignores it (verified 2026-07-16, task-W4-report.md), and
              'realtime' does too, so the toggle would be a no-op (inert)
              for any non-openai-mini persona, including for embed
              students. Gate to openai-mini specifically rather than
              excluding cartesia alone. Plumbing (routes/cache/state) is
              intentionally kept; widen this gate only once another
              provider is verified to honor speed (validate with the
              provisioned TEST keys, never prod keys). */}
          {ttsProvider === 'openai-mini' && (
            <>
              <div className="my-1 border-t border-slate-100" />
              <p className="px-3 pt-1 pb-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Voice</p>
              {/* Task W4: "Speak slower" TTS toggle — a SEPARATE knob from
                  "Slow down" above (that one asks for more explanation depth;
                  this one only slows the synthesized audio). Sticky ✓ state
                  mirrors the Humor pattern above. */}
              <button
                onClick={() => {
                  realtimeHandleRef.current?.setSpeakingRate(speakingRate === 'slow' ? 'normal' : 'slow');
                  setPacingMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl ${speakingRate === 'slow' ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-slate-50 text-slate-700'}`}
              >
                <span className="inline-block w-3">{speakingRate === 'slow' ? '✓' : ''}</span> Speak slower
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );

  const objective = (() => {
    if (!lessonProgress.plan) return undefined;
    const segId = lessonProgress.currentSegmentId || '';
    const lo = lessonProgress.plan.los?.find((l) => segId.startsWith(`${l.id}-`) || segId === l.id);
    return lo?.description;
  })();

  const pacingChipsOn = (() => {
    const v = process.env.NEXT_PUBLIC_PACING_V2_BUTTONS;
    if (!v) return true;
    const s = String(v).trim().toLowerCase();
    return s !== 'false' && s !== '0' && s !== 'off' && s !== 'no';
  })();
  const quickActionItems = getQuickActions(transcript, { enablePacing: pacingChipsOn });
  const quickActionsEl = quickActionItems.length > 0 ? (
    <div className="flex flex-wrap items-center justify-center gap-1.5">
      {quickActionItems.map((a) => (
        <button
          key={a.label}
          disabled={isProcessing}
          onClick={() => dispatchQuick(a.text)}
          className={`px-3.5 py-1.5 text-sm font-medium rounded-full border transition disabled:opacity-40 disabled:cursor-not-allowed ${
            a.tone === 'stuck' ? 'bg-white text-amber-700 border-amber-300 hover:bg-amber-50'
            : a.tone === 'skip' ? 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            : 'bg-white text-blue-700 border-blue-300 hover:bg-blue-50'
          }`}
        >
          {a.label}
        </button>
      ))}
    </div>
  ) : null;

  return (
    <>
      {loadDesmos && (
        <Script src="https://www.desmos.com/api/v1.11/calculator.js?apiKey=47658ec5a4894397ae1e1a46a6174a9a" strategy="lazyOnload" />
      )}
      <SessionStage
        lessonTitle={lessonProgress.plan ? lessonProgress.plan.title : topicLabel}
        subtitle={
          lessonProgress.plan
            ? `${topicDisplayName} · grade ${lessonProgress.plan.grade}`
            : (mockReview || sessionGoal === 'mock-review')
              ? `${topicDisplayName || 'Mock exam'} · Mock exam review`
              : `${topicDisplayName || 'Open practice'} · Free practice`
        }
        headerBrand={headerBrand}
        hasPlan={!!lessonProgress.plan}
        isFreePractice={!lessonProgress.plan}
        objective={objective}
        beats={beatsEl}
        controls={controlsEl}
        headerClock={
          <HeaderClock
            startedAtMs={voiceStartedAtMs}
            maxMinutes={sessionMaxMinutes}
            countDown={!!maxDurationExplicit}
          />
        }
        adaptiveMenu={adaptiveMenuEl}
        endControl={endControlEl}
        questionPin={questionPinEl}
        questionPinKey={questionPinEl && questionPin ? questionPin.turnId : undefined}
        hiccupPin={hiccupPinEl}
        voiceState={voiceState}
        warmupOverlay={warmupOverlay}
        micLevelRef={micLevelRef}
        listeningHint={listeningHint}
        started={started}
        liveCaption={liveCaption}
        getSpokenCaption={TUTOR_CAPTION_SYNC ? getSpokenCaption : undefined}
        boardEmpty={whiteboardCommands.length === 0}
        board={boardEl}
        boardPages={boardNav ?? undefined}
        voiceInput={voiceInputEl}
        // Center-orb start (2026-07-26). Synchronous call into the handle —
        // handleMicClick's unlockAudio() must run inside this click's gesture
        // stack or iOS never resumes the AudioContext.
        onOrbStart={() => realtimeHandleRef.current?.startSession?.()}
        transcript={transcriptEl}
        transcriptCount={transcript.length}
        nudgeActive={!!availableLessonPlans && availableLessonPlans.length > 0 && !nudgeDismissed}
        quickActions={quickActionsEl}
        onStudentInput={handleStudentInput}
        onControlMessage={handleControlMessage}
        mockAgenda={mockAgenda}
        mockAgendaRemaining={mockAgendaRemaining}
        mockDrawer={mockDrawer}
        mockCorrectDrawer={mockCorrectDrawer}
        onPickAgendaItem={(itemId) => pickAgendaItemRef.current?.(itemId)}
        agendaDrawerOpen={agendaDrawerOpen}
        onAgendaDrawerOpenChange={setAgendaDrawerOpen}
        agendaEngaged={agendaEngaged}
        practiceOverrideActive={practiceOverrideActive}
        practiceModeActive={practiceOverrideActive || (practiceStats?.active ?? false)}
        onTogglePracticeOverride={(active) => realtimeHandleRef.current?.setPracticeOverride(active)}
        boardPenActive={boardPenActive}
        onToggleBoardPen={studentMarksOn ? () => setBoardPenActive((v) => !v) : undefined}
      />
      {error && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm">{error}</div>
      )}
    </>
  );
}
