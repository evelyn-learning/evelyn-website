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
import { Play } from 'lucide-react';
import { TranscriptView } from '../TranscriptView';
import { SessionControls } from '../SessionControls';
import { WhiteboardCanvas } from '../whiteboard';
import { VoiceTutorRealtime, type RealtimeHandle } from '../VoiceTutorRealtime';
import { LessonPlanProgress } from '../LessonPlanProgress';
import { LessonNudgePicker } from '../LessonNudgePicker';
import SessionStage, { type VoiceState } from './SessionStage';
import { getQuickActions } from '@/lib/tutor/quick-actions';
import { gradeBandFor } from '@/lib/tutor/pedagogy/grade-profile';
import { useStudentPreferences } from '@/hooks/useStudentPreferences';
import type { StudentPreferences } from '@/lib/tutor/student-profile/types';
import type { SessionGoal, TranscriptEntry } from '@/lib/tutor/types';
import type { WhiteboardCommand } from '@/lib/knowledge/types';
import type { OpenAIVoice } from '../../hooks/useOpenAIRealtime';
import type { LessonPlan as LessonPlanType } from '@/lib/tutor/lesson-plan/types';
import type { SpokenCaption } from '@/lib/tutor/voice/caption-sync';
import type { StudentMarkEvent } from '@/lib/tutor/whiteboard/student-marks';
import { acceptWhiteboardBatch, createSeedGuard, type WhiteboardBatchMeta } from '@/lib/tutor/whiteboard/resume-seed';

type VTRProps = ComponentProps<typeof VoiceTutorRealtime>;
type BoardNav = Parameters<NonNullable<ComponentProps<typeof WhiteboardCanvas>['onNavChange']>>[0];

// Caption ↔ TTS word-sync (2026-07-04): audio-locked caption reveal.
// Default ON; 'off' restores the legacy fixed-rate typewriter. claude-brain
// only by construction (the handle returns null on other engines).
const TUTOR_CAPTION_SYNC = process.env.NEXT_PUBLIC_TUTOR_CAPTION_SYNC !== 'off';

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
  lessonPlanId?: string;
  voice: OpenAIVoice;
  voiceEngine: TutorSessionVoiceEngine;
  ttsProvider?: VTRProps['ttsProvider'];
  /** Cartesia voice id (Task 3). Only consumed when ttsProvider === 'cartesia'. */
  cartesiaVoiceId?: VTRProps['cartesiaVoiceId'];
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
  onEndSession: (reason?: 'time_limit') => void;

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
    sessionGoal, lessonPlanId, voice, voiceEngine, ttsProvider, cartesiaVoiceId, sessionMaxMinutes,
    topicDisplayName, headerBrand, loadDesmos = true, onEndSession, onMilestone, onTranscriptUpdate,
    onWhiteboardCommand, onUsageUpdate, onBrainUsage, onDebugEvent, onTrackInteraction,
    onTranscriptionStatus, onProposePlanSwap, onConfirmPlanLos, onBeforeTypedSubmit,
    onUploadHomework, onLessonPlanIdChange, onLessonProgressChange,
    onCompletedSegmentsChange, availableLessonPlans, resumeState,
    socialMemory, progressDigest, lastOpener, readinessNote, onOpenerRecord, isTrial,
    targetKind, checkpointStale, teacherPersona, sessionWrapMinutes, maxDurationExplicit,
  } = props;

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
  const [paceBias, setPaceBias] = useState(0);
  const [paceBiasFlash, setPaceBiasFlash] = useState(false);
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
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
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

  const handleStudentMark = useCallback((ev: StudentMarkEvent) => {
    realtimeHandleRef.current?.pushStudentMark?.(ev);
  }, [realtimeHandleRef]);

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
        lessonPlanId={selectedLessonPlanId || undefined}
        voice={voice}
        onTranscriptUpdate={handleVoiceTranscriptUpdate}
        onWhiteboardCommand={handleVoiceWhiteboardCommand}
        onUsageUpdate={handleUsage}
        onBrainUsage={onBrainUsage}
        onDebugEvent={onDebugEvent}
        onError={(err) => setError(err.message)}
        onTranscriptionStatus={handleTranscriptionStatus}
        onEndSession={onEndSession}
        onMilestone={onMilestone}
        onTrackInteraction={onTrackInteraction}
        handleRef={realtimeHandleRef}
        validateToolCalls={voiceEngine === 'realtime-validated'}
        claudeBrainMode={voiceEngine === 'claude-brain'}
        useRealtimeV2={voiceEngine === 'realtime-2'}
        ttsProvider={ttsProvider}
        cartesiaVoiceId={cartesiaVoiceId}
        onLessonPlanProgress={(p) => { setLessonProgress(p); onLessonProgressChange?.(p); }}
        onTutorBusy={handleTutorBusy}
        onVoiceStateChange={setLiveVoiceState}
        resumeState={resumeState}
        onResumeAwaitingTapChange={setAwaitingResume}
        onSessionStarted={() => setVoiceStartedAtMs((prev) => prev ?? Date.now())}
        onMicLevel={(l) => { micLevelRef.current = l; }}
        onListeningHint={setListeningHint}
        onPaceBiasChange={(bias) => {
          setPaceBias(bias);
          setPaceBiasFlash(true);
          if (paceBiasFlashTimeoutRef.current) clearTimeout(paceBiasFlashTimeoutRef.current);
          paceBiasFlashTimeoutRef.current = setTimeout(() => setPaceBiasFlash(false), 1600);
        }}
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

  const beatsEl = lessonProgress.plan ? (
    <LessonPlanProgress plan={lessonProgress.plan} currentSegmentId={lessonProgress.currentSegmentId} completedSegmentIds={completedSegmentIds} />
  ) : null;

  const controlsEl = (
    <SessionControls
      sessionId={sessionId}
      startedAtMs={voiceStartedAtMs}
      maxDuration={sessionMaxMinutes}
      onEndSession={onEndSession}
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
      {(paceBias !== 0 || paceBiasFlash) && (
        <span className={`text-[11px] px-2 py-0.5 rounded-full border transition-all duration-200 ${
          paceBiasFlash ? 'bg-blue-100 border-blue-400 text-blue-800'
          : paceBias < 0 ? 'bg-amber-50 border-amber-300 text-amber-800'
          : 'bg-green-50 border-green-300 text-green-800'
        }`}>
          {paceBias < 0 ? `Slower ×${Math.abs(paceBias)}` : paceBias > 0 ? `Faster ×${paceBias}` : 'Pace'}
        </span>
      )}
      <button onClick={() => setPacingMenuOpen((o) => !o)} className="grid place-items-center w-9 h-9 rounded-full hover:bg-slate-100 text-slate-600 text-lg leading-none">⋯</button>
      {pacingMenuOpen && (
        <div className="absolute right-0 top-full mt-2 w-52 max-h-[70dvh] overflow-y-auto rounded-2xl bg-white border border-slate-200 shadow-xl p-1.5 z-50 text-sm">
          <p className="px-3 pt-1 pb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Adjust the lesson</p>
          <button onClick={() => { realtimeHandleRef.current?.stopSpeaking(); realtimeHandleRef.current?.sendTextMessage('Give me a harder one.'); setPacingMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700">Harder</button>
          <button onClick={() => { realtimeHandleRef.current?.stopSpeaking(); realtimeHandleRef.current?.sendTextMessage('Give me an easier one.'); setPacingMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700">Easier</button>
          <div className="my-1 border-t border-slate-100" />
          <button onClick={() => { realtimeHandleRef.current?.stepPaceBias(-1); setPacingMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700">Slow down</button>
          <button onClick={() => { realtimeHandleRef.current?.stepPaceBias(1); setPacingMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700">Speed up</button>
          <div className="my-1 border-t border-slate-100" />
          <button onClick={() => { realtimeHandleRef.current?.stopSpeaking(); realtimeHandleRef.current?.sendTextMessage("I'm done — let's wrap up."); setPacingMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700">Wrap up</button>
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
        </div>
      )}
    </div>
  );

  // --- Derived presence/caption/quick-actions ---
  const lastTutorEntry = [...transcript].reverse().find((t) => t.role === 'tutor');
  const lastEntry = transcript[transcript.length - 1];
  const started = transcript.length > 0 || liveVoiceState !== 'idle';
  const derivedVoiceState: VoiceState =
    isProcessing ? 'thinking' : lastEntry?.role === 'tutor' ? 'speaking' : 'listening';
  const voiceState: VoiceState =
    liveVoiceState !== 'idle' ? liveVoiceState : started ? derivedVoiceState : 'idle';
  const liveCaption = lastTutorEntry?.text?.replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1') || undefined;
  // Caption word-sync: stable poll getter for the CaptionTicker. Reads the
  // engine handle imperatively — no React state churn at poll frequency.
  const getSpokenCaption = useCallback((): SpokenCaption | null => {
    return realtimeHandleRef.current?.getSpokenCaption?.() ?? null;
  }, [realtimeHandleRef]);
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
        subtitle={lessonProgress.plan ? `${topicDisplayName} · grade ${lessonProgress.plan.grade}` : `${topicDisplayName || 'Open practice'} · Free practice`}
        headerBrand={headerBrand}
        hasPlan={!!lessonProgress.plan}
        isFreePractice={!lessonProgress.plan}
        objective={objective}
        beats={beatsEl}
        controls={controlsEl}
        adaptiveMenu={adaptiveMenuEl}
        voiceState={voiceState}
        micLevelRef={micLevelRef}
        listeningHint={listeningHint}
        started={started}
        liveCaption={liveCaption}
        getSpokenCaption={TUTOR_CAPTION_SYNC ? getSpokenCaption : undefined}
        boardEmpty={whiteboardCommands.length === 0}
        board={boardEl}
        boardPages={boardNav ?? undefined}
        voiceInput={voiceInputEl}
        transcript={transcriptEl}
        transcriptCount={transcript.length}
        nudgeActive={!!availableLessonPlans && availableLessonPlans.length > 0 && !nudgeDismissed}
        quickActions={quickActionsEl}
        onStudentInput={handleStudentInput}
        onBack={onEndSession}
        boardPenActive={boardPenActive}
        onToggleBoardPen={studentMarksOn ? () => setBoardPenActive((v) => !v) : undefined}
      />
      {error && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm">{error}</div>
      )}
    </>
  );
}
