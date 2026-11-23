'use client';
/**
 * Tutor brain v2 — the turn loop, shared by the text and the voice client.
 *
 * One job: the student's words in; the tutor's words streamed into the
 * transcript (and, sentence by sentence, to whoever speaks them); painted tool
 * calls to the whiteboard; the next state kept for the following turn. It
 * holds no audio and no lesson policy.
 */
import type { LessonPlan } from '@/lib/tutor/lesson-plan/types';
import { homeworkProblemOf, type HomeworkProblemMeta } from '@/lib/tutor/lesson-plan/homework-problem-meta';
import { homeworkProblemsOf } from '@/lib/tutor/lesson-plan/homework';
import type { TutorMilestone } from '@/lib/tutor/orchestrator/types';
import { V2_OPENING_BLOCK_START, clearV2State, loadV2State, saveV2State, v2StateFromCheckpoint } from '@/lib/tutor/v2/resume';
import { v2MemoryLines, v2ProfileCommit } from '@/lib/tutor/v2/memory';
import { V2_BACKGROUND_MAX_LINES } from '@/lib/tutor/v2/background';
import { V2PagesHeld, v2ProgressAsPainted } from '@/lib/tutor/v2/progress';
import { useCallback, useEffect, useRef, useState, type MutableRefObject } from 'react';
import type { WhiteboardCommand } from '@core/knowledge/types';
import { mapFunctionCallToCommand } from '@/app/tutor/hooks/toolDefinitions';
import type { TranscriptEntry } from '@/lib/tutor/types';
import { paintsOnBoard, streamV2Turn, type V2ClientSession } from '@/lib/tutor/v2/client';
import { foldInterruptedTurn, v2CutWordsCarried, v2WithCarried } from '@/lib/tutor/v2/interrupted';
import { closeDueMinutes } from '@/lib/tutor/v2/close-heard';
import { KEYED_VERDICT_DEBUG_TYPE, formatKeyedVerdictDebug } from '@/lib/tutor/voice/keyed-verdict';
import { SentenceStream } from '@/lib/tutor/v2/sentences';
import { V2_UNHEARD_SAID } from '@/lib/tutor/v2/heard';
import { V2_CONTROL_TOOL_NAMES } from '@/lib/tutor/v2/tool-names';
import { mentionsTool } from '@/lib/tutor/v2/tool-talk';
import { newV2State, type V2State, type V2ToolCall } from '@/lib/tutor/v2/types';
import { TUTOR_V2_TIME_CHECK_AFTER_SPEECH, TUTOR_LESSON_CLOSE_AUTO_END, TUTOR_V2_CHIP_ON_PAINT, TUTOR_V2_UNHEARD_ASK_OWED, TUTOR_V2_CLOSE_REOPENED, TUTOR_V2_FLAG_CLOCK_PAUSE, TUTOR_V2_TIME_BOX, TUTOR_WORKING_LEVEL, TUTOR_WORKING_LEVEL_ESTIMATE } from '@/lib/tutor/orchestrator/flags';
import { V2_CLOCK_PAUSE_HONOURED, v2ClientMarginMin, v2HardStop, v2HardStopDelayMs, v2StartClock } from '@/lib/tutor/v2/time-box';
import { v2HardStopNextTime } from '@/lib/tutor/v2/close-invite';
import { goodbyeLine } from '@/lib/tutor/voice/timebox-lines';
import { parseWorkingLevel, type WorkingLevel } from '@/lib/tutor/level/working-level';
import { v2LevelEstimateDue, v2SeedWorkingLevel, v2WorkingLevelCommit } from '@/lib/tutor/v2/working-level';
import { v2WithPronunciationHeard, type V2PronunciationHeard } from '@/lib/tutor/v2/pronunciation';
import { V2ClosingWords, v2BoxDuringClose, v2CloseHears } from '@/lib/tutor/v2/close-mic';

export interface V2TurnsConfig {
  mode: 'text' | 'voice';
  subject: string;
  level: string;
  studentName?: string;
  lessonPlanId?: string;
  embedToken?: string;
  sessionMaxMinutes?: number;
  /** The host's wrap minute, two before the box (partner-pool.ts `poolTimeBox`, the embed page's `wrap_at_minutes`):
   *  from it the facts tell the tutor to finish the exchange and summarise (v2/time-box.ts). */
  sessionWrapMinutes?: number;
  /** Task 7f F: the most minutes the session may run, whatever the overrun margin: a partner pool's remaining balance (the embed
   *  page), and the partner's own max_duration_minutes when it set one. A part-flow lesson's hard stop is at the box plus the
   *  margin (TUTOR_V2_TIME_OVERRUN), never past this; every other session stops at the box (time-box.ts v2MarginMin). */
  sessionStopCeilingMinutes?: number;
  /** The partner's `lessonCloseAutoEnd` (partner-session-options.ts, on by default; TUTOR_LESSON_CLOSE_AUTO_END):
   *  off, the tutor's close leaves the session open for the student or the host to end. */
  lessonCloseAutoEnd?: boolean;
  /** The teacher persona's name and manner, and whether this is a free trial (types.ts V2Session). */
  teacher?: { name: string; nameIsRole?: boolean; style?: string; intro?: string; background?: string };
  trial?: boolean;
  /** The partner checks the learner's working level once and remembers it (partner-session-options.ts `levelCheck`,
   *  v2/working-level.ts). Under the TUTOR_WORKING_LEVEL kill switch. */
  levelCheck?: boolean;
  /** Voice: the partner measures pronunciation (partner-session-options.ts `pronunciation`, v2/pronunciation.ts). The voice
   *  client sets it only when it can record (the kill switch on, a session id for the assess route). */
  pronunciation?: boolean;
  /** Voice: the score of the armed reply, awaited (bounded) before each turn and put in the state for its facts. */
  pronunciationHeard?: () => Promise<V2PronunciationHeard | null>;
  /** Voice: after each turn, the reply the state has armed for recording (null: none). */
  onPronunciationArm?: (armed: { seq: number; reference: string } | null) => void;
  /** The topic asked for when there is no lesson plan. */
  topic?: string;
  /** The session's teaching languages, English first (a partner's `tutor_languages`); a second one makes the lesson bilingual (v2/languages.ts). */
  tutorLanguages?: string[];
  /** What the partner's portal knows about the student (background.ts). */
  background?: string[];
  /** The session's id, under which its state is kept for a reload (resume.ts). */
  sessionId?: string;
  /** For practice set at the close (assignPractice, below): whose it is, and where the portal shows it. */
  studentId?: string;
  practiceLocator?: string;
  /** The student arrived mid-activity in a host's own flow: the host owns any follow-up. */
  inFlow?: boolean;
  /** The host's checkpoint, when this page load is a resume: the transcript, the board and what was finished. */
  resumeState?: { transcript: TranscriptEntry[]; whiteboardCommands: WhiteboardCommand[]; completedSegmentIds?: string[] } | null;
  /** Where the lesson stands, for the host page and a partner's portal (progress.ts): the same three reports v1 makes. */
  onLessonPlanProgress?: (p: { plan: LessonPlan | null; currentSegmentId: string }) => void;
  onCompletedSegmentsChange?: (ids: string[]) => void;
  onMilestone?: (m: TutorMilestone) => void;
  onTranscriptUpdate: (entries: TranscriptEntry[]) => void;
  /** Whole-sheet homework: the problem in play (by position), the sheet's size and how many are solved. */
  onHomeworkProgress?: (p: { current: number; total: number; text?: string; solved?: number } | null) => void;
  /** The session's plan is one problem of a homework sheet (null for any other plan): the stage shows it. */
  onHomeworkProblem?: (meta: HomeworkProblemMeta | null) => void;
  onWhiteboardCommand: (commands: WhiteboardCommand[]) => void;
  onEndSession?: (reason?: 'time_limit') => void;
  onLessonClosed?: (source: string) => void;
  onSessionStarted?: () => void;
  onTutorBusy?: (busy: boolean) => void;
  onBrainUsage?: (usage: { inputTokens: number; outputTokens: number; cacheReadTokens: number; cacheCreationTokens: number; model?: string }) => void;
  onDebugEvent?: (type: string, message: string, data?: Record<string, unknown>) => void;
  onError?: (error: Error) => void;
  /** Voice: each finished sentence of the reply, in order, as soon as it is complete. */
  onSentence?: (sentence: string, startsParagraph?: boolean) => void;
  /** Voice: decide when a board item is painted. Called once per item, after every sentence of the reply up to
   *  that point has gone to onSentence; `paint` may be called at once or later. Absent: painted at once. */
  holdBoard?: (call: V2ToolCall, paint: () => void) => void;
  /** Voice: the board check withdrew this item; if it is still waiting for its sentence it must not be painted. */
  onBoardWithdraw?: (id: string) => void;
  /** Voice (Task 7m, CARD_STRESS_SPOKEN): a board call has arrived, told before the sentence kept for it goes to the voice. */
  onBoardCallArrived?: (call: V2ToolCall) => void;
  /** Voice: a turn was cut short (the student spoke over it); stop speaking. */
  onCut?: () => void;
  /** The voice client's record of what was actually played of the reply being cut short, or null if it has none. */
  heardSoFar?: () => string | null;
  /** Ids of board items of the reply in hand that were dropped before the student saw them (the voice client). */
  notShown?: () => Set<string>;
  /** Voice: how many times other voices in the room were left out, while the student is still to be told of it
   *  (room-voices.ts). Asked as each turn is sent. */
  roomVoices?: () => number | undefined;
  /** How long after the closing words the session ends. Voice passes a function that waits for the speech to finish. */
  closeDelayMs?: number | (() => Promise<void>);
  /** Voice, at the box: resolves once the tutor's speech under way has finished (true), or at `maxMs` with it still
   *  going (false). Absent (text): nothing is playing. */
  untilQuiet?: (maxMs: number) => Promise<boolean>;
  /** Voice: the tutor's speech is still playing (Task 8j fix round 1: the time check waits for it to end). Absent (text): never. */
  speechPending?: () => boolean;
}

const CLOSE_READ_MS = 4000;
/** Task 8j fix round 1: the quiet after the tutor's voice before the time check makes a turn, and how many 1 s checks it waits at most. */
export const V2_TIME_CHECK_QUIET_MS = 15000;
export const V2_TIME_CHECK_WAIT_TRIES = 120;
/** How long a finished sentence waits to learn what follows it; and how long it waits for a board block that has begun. */
const KEEP_BRIEF_MS = 250;
const KEEP_FOR_BLOCK_MS = 2500;
const UNREACHABLE = "I couldn't reach the tutor just now. Please send that again.";

export interface V2Turns {
  /** A student message. While a turn is running: text mode queues it; voice mode cuts the running turn and answers this instead. */
  send: (text: string, opts?: { unheard?: boolean }) => void;
  /** The tutor's opening turn (once). */
  open: () => void;
  /** A turn with no student words: the student has been silent. */
  nudge: (silenceSeconds: number) => void;
  end: (opts?: { farewell?: string }) => void;
  abort: () => void;
  isEnding: () => boolean;
  /** Task 7h (CLOSE_HEARS): the tutor has closed the lesson and its closing words are still being said; the microphone
   *  is open, and words over them other than thanks or a goodbye call the close off (v2/close-mic.ts). */
  isClosing: () => boolean;
  /** Task 7n (FLAG_CLOCK_PAUSE): the tester's debug flag panel opened (true) or closed (false): the lesson clock is held meanwhile. */
  pauseClock: (paused: boolean) => void;
  busy: boolean;
  closed: boolean;
  openedRef: MutableRefObject<boolean>;
  /** This page load picked up an earlier session (resume.ts). */
  resumedRef: MutableRefObject<boolean>;
  stateRef: MutableRefObject<V2State>;
  /** The last reply handed the floor to the student (keep_listening). */
  keptListeningRef: MutableRefObject<boolean>;
}

interface SketchCommand { concept?: string; labels?: string[]; title?: string; primitives?: unknown[]; fallbackCard?: { title?: string; concept: string; labels: string[] } }
const SKETCH_TIMEOUT_MS = 12000;
/** Fetch the drawing for a sketch request and attach it to the command (the board renders nothing without it). */
async function resolveSketch(c: SketchCommand, embedToken: string | undefined, log: (m: string) => void): Promise<void> {
  const concept = c.concept ?? ''; const labels = c.labels ?? [];
  const ctl = new AbortController(); const timer = setTimeout(() => ctl.abort(), SKETCH_TIMEOUT_MS);
  try {
    const res = await fetch('/api/tutor/sketch', { method: 'POST', headers: { 'Content-Type': 'application/json', ...(embedToken ? { 'x-embed-token': embedToken } : {}) }, body: JSON.stringify({ concept, labels, sessionId: 'v2' }), signal: ctl.signal });
    const data = res.ok ? await res.json() as { primitives?: unknown[] | null } : { primitives: null };
    if (Array.isArray(data.primitives) && data.primitives.length) { c.primitives = data.primitives; log(`drawn: ${data.primitives.length} strokes — ${concept.slice(0, 80)}`); return; }
    log(`no drawing (${res.status}) — card instead: ${concept.slice(0, 80)}`);
  } catch (err) { log(`failed (${err instanceof Error ? err.message : String(err)}) — card instead`); }
  finally { clearTimeout(timer); }
  c.fallbackCard = { title: c.title, concept, labels };
}

export function useV2Turns(config: V2TurnsConfig): V2Turns {
  const p = useRef(config); p.current = config;
  const stateRef = useRef<V2State>(newV2State());
  // The plan is read once, for the progress report only: the turn route loads its own copy for the tutor.
  const planRef = useRef<LessonPlan | null>(null); const reportedRef = useRef(''); const milestoneRef = useRef<TutorMilestone | null>(null);
  // Task 7n (CHIP_ON_PAINT): the board shown while a page of this reply is still held for its sentence (null: all painted), and
  // the reply's page calls held and not yet painted.
  const pagesHeldRef = useRef(new V2PagesHeld());
  const reportProgress = useCallback(() => {
    const plan = planRef.current; if (!plan) return;
    const now = v2ProgressAsPainted(plan, stateRef.current.goals, stateRef.current, pagesHeldRef.current.shown);
    const sig = `${now.currentSegmentId}|${now.completedSegmentIds.join(',')}`;
    if (sig !== reportedRef.current) { reportedRef.current = sig; p.current.onLessonPlanProgress?.({ plan, currentSegmentId: now.currentSegmentId }); p.current.onCompletedSegmentsChange?.(now.completedSegmentIds); }
    if (now.milestone && now.milestone !== milestoneRef.current) { milestoneRef.current = now.milestone; p.current.onMilestone?.(now.milestone); }
  }, []);
  useEffect(() => {
    const id = config.lessonPlanId; if (!id) return;
    let gone = false;
    void fetch(`/api/tutor/lesson-plans/${encodeURIComponent(id)}`).then((r) => (r.ok ? r.json() : null)).then((data: { plan?: LessonPlan } | null) => {
      if (gone || !data?.plan) return;
      // A one-problem homework plan: its problem (and figure) go in the stage's panel, as in v1. A sheet: its
      // problems go on the rail.
      p.current.onHomeworkProblem?.(homeworkProblemOf(data.plan as { metadata?: Record<string, unknown> }));
      sheetRef.current = homeworkProblemOf(data.plan as { metadata?: Record<string, unknown> }) ? null : homeworkProblemsOf(data.plan as { metadata?: Record<string, unknown> });
      reportSheet();
      if (!data.plan.segments?.length) return;
      planRef.current = data.plan; reportProgress();
    }).catch(() => { /* no plan, no report: the lesson itself does not depend on it */ });
    return () => { gone = true; };
  }, [config.lessonPlanId, reportProgress]);
  const transcriptRef = useRef<TranscriptEntry[]>([]);
  const busyRef = useRef(false);
  // Whole-sheet homework: the rail shows the problem in play and how many are solved (SessionStage).
  const sheetRef = useRef<Array<{ n: number; text: string }> | null>(null);
  const reportSheet = useCallback(() => {
    const problems = sheetRef.current; if (!problems?.length) return;
    const rec = stateRef.current?.homework?.sheet;
    const at = Math.max(0, problems.findIndex((x) => x.n === (rec?.current ?? problems[0].n)));
    p.current.onHomeworkProgress?.({ current: at + 1, total: problems.length, text: problems[at]?.text, solved: rec?.solved.length ?? 0 });
  }, []);
  const pendingRef = useRef<string | null>(null);
  /** Task 7v (SELF_CORRECTION): words of a turn cut before anything reached them, for the next turn. */
  const carriedSaidRef = useRef<string | null>(null);
  // An opening turn asked for while an earlier one is still being torn down
  // (React runs effects twice in development: start, clean up, start again).
  const pendingOpenRef = useRef(false);
  const openedRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  /** The student's words from a turn that never reached them (see the cut branch of runTurn). */
  const unansweredRef = useRef<string | null>(null);
  const endingRef = useRef(false);
  // onEndSession has been called (the close, the box, the End button or the host), or the page has gone: nothing ends
  // the session a second time (review 5a I1).
  const endedRef = useRef(false);
  const endOnce = (reason?: 'time_limit') => { if (endedRef.current) return; endedRef.current = true; p.current.onEndSession?.(reason); };
  /** Task 7h: the closing words of a spoken close, still being said (v2/close-mic.ts). */
  const closingRef = useRef(new V2ClosingWords());
  /** The last reply handed the floor to the student (keep_listening), with or without words of its own. */
  const keptListeningRef = useRef(false);
  /** The tutor has been told, by a turn's facts or by the timer, that the session is nearly out of time. */
  const timeCheckedRef = useRef(false);
  const homeworkDoneRecordedRef = useRef(false);
  const [busy, setBusy] = useState(false);
  const [closed, setClosed] = useState(false);

  const publish = () => p.current.onTranscriptUpdate([...transcriptRef.current]);

  // The working level (v2/working-level.ts): remembered on the profile, or estimated this lesson when the tutor left
  // the level check without setting one. Each is put into the state before a turn that holds none.
  const levelCheckOn = () => TUTOR_WORKING_LEVEL && !!p.current.levelCheck;
  const knownLevelRef = useRef<WorkingLevel | null>(null);
  const estimatedLevelRef = useRef<WorkingLevel | null>(null);
  const loggedLevelRef = useRef<WorkingLevel | null>(null);
  const estimateAskedRef = useRef(false);
  // v1 Task 14 §G (the tool was never called and the whole lesson ran unlevelled): once the lesson is past the
  // level-check part with no level, the student's answers so far go to the estimate route, once.
  const requestLevelEstimate = () => {
    const c = p.current; const plan = planRef.current;
    if (!TUTOR_WORKING_LEVEL_ESTIMATE || !levelCheckOn() || !c.sessionId || !plan || estimateAskedRef.current) return;
    if (!v2LevelEstimateDue(plan, stateRef.current.goals, stateRef.current.workingLevel)) return;
    estimateAskedRef.current = true;
    const answers = transcriptRef.current.filter((e) => e.role === 'student' && e.text?.trim()).map((e) => e.text);
    if (!answers.length) { c.onDebugEvent?.('working_level_estimate_skipped', 'no student turns (v2)'); return; }
    c.onDebugEvent?.('working_level_estimate_requested', `answers=${answers.length} (v2)`);
    void fetch('/api/tutor/level/estimate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId: c.sessionId, answers }) })
      .then((r) => (r.ok ? r.json() : { status: 'unavailable', reason: `http ${r.status}` }))
      .then((d: { status?: string; level?: unknown; reason?: unknown }) => {
        const level = d?.status === 'ok' ? parseWorkingLevel(d.level) : null;
        if (!level) { c.onDebugEvent?.('working_level_estimate_failed', `${String(d?.reason ?? 'unavailable')} (v2)`); return; }
        // Taken into the state before the next turn, unless the tutor has set a level by then.
        if (!stateRef.current.workingLevel) estimatedLevelRef.current = level;
      })
      .catch((e) => c.onDebugEvent?.('working_level_estimate_failed', String((e as Error)?.message ?? e).slice(0, 80)));
  };

  const runTurn = useCallback(async (studentSaid: string | null, silenceSeconds?: number, unheard?: boolean, timeCheck?: boolean) => {
    // Task 7h (CLOSE_HEARS): the closing words are still being said. Words of the student's over them call the close off
    // and the lesson goes on from them; thanks, a goodbye or a silence check let it end (v2/close-mic.ts).
    const overClose = endingRef.current ? 'not-closing' : closingRef.current.heard(unheard ? null : studentSaid);
    if (overClose === 'let-end') return;
    if (overClose === 'reopen') {
      // Task 7k (CLOSE_REOPENED): the close is reopened: the turn route re-arms the invitation (asks "more, or finish?").
      stateRef.current = { ...stateRef.current, closed: false, ...(TUTOR_V2_CLOSE_REOPENED ? { closeReopened: Date.now() } : {}) };
      saveV2State(p.current.sessionId, stateRef.current);
      p.current.onCut?.();
      p.current.onDebugEvent?.('v2_close_called_off', `the student spoke over the closing words: "${(studentSaid ?? '').slice(0, 80)}"`);
    }
    if (stateRef.current.closed || endingRef.current) return;
    // Noise over a running reply is nothing to answer (heard.ts v2HeardIsNoise).
    if (busyRef.current && unheard) return;
    if (busyRef.current) {
      if (studentSaid) {
        pendingRef.current = pendingRef.current ? `${pendingRef.current}\n${studentSaid}` : studentSaid;
        // Spoken words over a running reply are an interruption: stop it and answer them.
        if (p.current.mode === 'voice') { p.current.onCut?.(); abortRef.current?.abort(); }
      } else if (!silenceSeconds) pendingOpenRef.current = true;
      return;
    }
    busyRef.current = true; setBusy(true); p.current.onTutorBusy?.(true);
    keptListeningRef.current = false;
    // What the student said just before, when no word of its reply reached them, is part of what they are saying now.
    // Merge with main (Task 8e): they go to the brain with these words (brainSaid, below); the transcript keeps each as it was said.
    const unanswered = studentSaid && !unheard ? unansweredRef.current : null;
    if (studentSaid && !unheard) unansweredRef.current = null;
    // A turn that starts inside the last minutes is told of the time by its facts: the timer need not say it again.
    { const box = p.current.sessionMaxMinutes; if (box && openedRef.current && box - (Date.now() - stateRef.current.startedAtMs) / 60000 <= closeDueMinutes(box)) timeCheckedRef.current = true; }
    const stamp = Date.now();
    // Noise is not stored as their words: 5,000 characters of 、 and 号 went into the session's transcript (Task 6e).
    // Task 7z (UNHEARD_ASK_OWED): the entry keeps the sentences of the last reply these words came over unheard (the barge-in record), so a
    // question pin among them is not cleared by them (TutorSession, qpin-behavior.ts).
    const overUnheard = TUTOR_V2_UNHEARD_ASK_OWED && stateRef.current.unheard?.length ? [...stateRef.current.unheard] : null;
    if (studentSaid && !unheard) transcriptRef.current = [...transcriptRef.current, { id: `student-${stamp}`, timestamp: new Date(), role: 'student', text: studentSaid, ...(overUnheard ? { overUnheard } : {}) }];
    // Task 7v (SELF_CORRECTION): their words of a turn cut before anything reached them go to the brain with the words that cut it
    // (the transcript already holds them): "for senior bosses." reached it alone and was corrected as a fragment (embed-1795067373124).
    const carried = carriedSaidRef.current; carriedSaidRef.current = null;
    const brainSaid = v2WithCarried(carried, unanswered && studentSaid ? `${unanswered} ${studentSaid}` : studentSaid);
    const tutorId = `tutor-${stamp}`;
    publish();
    // The tutor's entry appears with its first words: the session save refuses an entry with no text.
    const setTutor = (text: string, streaming: boolean, askOnBoard = false) => {
      if (!text) return;
      transcriptRef.current = transcriptRef.current.some((e) => e.id === tutorId)
        ? transcriptRef.current.map((e) => (e.id === tutorId ? { ...e, text, streaming, ...(askOnBoard ? { askOnBoard } : {}) } : e))
        : [...transcriptRef.current, { id: tutorId, timestamp: new Date(), role: 'tutor', text, streaming, ...(askOnBoard ? { askOnBoard } : {}) }];
      publish();
    };
    // The greeting waits a moment for the student's profile if it is still on its way: it is what lets the
    // tutor say where the last session left off.
    if (!stateRef.current.history.length) await Promise.race([memoryReadyRef.current, new Promise((r) => setTimeout(r, 1500))]);
    // The working level goes into the state the turn carries: an estimate made this lesson, else the one on the profile.
    if (levelCheckOn()) stateRef.current = v2SeedWorkingLevel(stateRef.current, { known: knownLevelRef.current, estimated: estimatedLevelRef.current });
    // The score of the armed reply goes into the state the turn carries (v2/pronunciation.ts).
    if (p.current.pronunciation && p.current.pronunciationHeard) { const heard = await p.current.pronunciationHeard(); stateRef.current = v2WithPronunciationHeard(stateRef.current, heard); }
    const session: V2ClientSession = {
      studentName: p.current.studentName, subject: p.current.subject, level: p.current.level, mode: p.current.mode,
      ...((p.current.tutorLanguages?.length ?? 0) > 1 ? { languages: p.current.tutorLanguages } : {}),
      ...(p.current.sessionMaxMinutes ? { timeBoxMinutes: p.current.sessionMaxMinutes } : {}),
      ...(p.current.sessionMaxMinutes && p.current.sessionWrapMinutes ? { wrapMinutes: p.current.sessionWrapMinutes } : {}),
      // Task 8h (ruling 2): the host's own maximum, so the tutor is told of a margin only where the hard stop below has one.
      ...(p.current.sessionMaxMinutes && p.current.sessionStopCeilingMinutes ? { stopCeilingMinutes: p.current.sessionStopCeilingMinutes } : {}),
      ...(p.current.lessonPlanId ? { lessonPlanId: p.current.lessonPlanId } : {}),
      ...(p.current.topic && !p.current.lessonPlanId ? { topic: p.current.topic } : {}),
      ...(p.current.background?.length || memoryRef.current.length ? { background: [...(p.current.background ?? []), ...memoryRef.current].slice(0, V2_BACKGROUND_MAX_LINES) } : {}),
      ...(p.current.teacher ? { teacher: p.current.teacher } : {}),
      ...(p.current.trial ? { trial: true } : {}),
      ...(levelCheckOn() ? { levelCheck: true } : {}),
      ...(p.current.pronunciation ? { pronunciation: true } : {}),
    };
    const abort = new AbortController(); abortRef.current = abort;
    const sentences = new SentenceStream();
    // A sentence that names a tool is never spoken (tool-talk.ts).
    // Each sentence goes out with whether it begins a paragraph (sentences.ts), counted in the order the stream cut them.
    let cutSoFar = 0; let paraOwed = false;
    const speak = (list: string[]) => { if (abort.signal.aborted) return; for (const s of list) { if (sentences.paragraphStarts.has(cutSoFar++)) paraOwed = true; if (mentionsTool(s)) continue; p.current.onSentence?.(s, paraOwed); paraOwed = false; } };
    // Voice: the newest finished sentence is kept back for a moment, until what follows it is known. If a board
    // block follows, the sentence goes to the voice only once the block has arrived, so the item is ready to
    // appear as the sentence starts and not a second into it ("the problem showed up at the end of the
    // sentence", embed-1794345628228). Earlier sentences are already playing, so this rarely costs a pause.
    let kept: string | null = null; let keptTimer: ReturnType<typeof setTimeout> | null = null;
    const letGo = () => { if (keptTimer) { clearTimeout(keptTimer); keptTimer = null; } if (kept !== null) { const s = kept; kept = null; speak([s]); } };
    const keep = (s: string, ms: number) => { letGo(); kept = s; keptTimer = setTimeout(letGo, ms); };
    const sayAll = (list: string[]) => {
      if (p.current.mode !== 'voice' || !list.length) { speak(list); return; }
      letGo(); speak(list.slice(0, -1)); keep(list[list.length - 1], KEEP_BRIEF_MS);
    };
    let text = '';
    const settled: V2ToolCall[] = [];
    // Task 7n (CHIP_ON_PAINT): this reply's page calls held for their sentence; the chip moves when the last is painted.
    const turnNo = pagesHeldRef.current.begin(stateRef.current.board);
    const pageShown = () => { if (pagesHeldRef.current.painted(turnNo)) reportProgress(); };
    const roomVoices = p.current.roomVoices?.();
    try {
      const done = await streamV2Turn({
        session, state: stateRef.current, studentSaid: brainSaid, embedToken: p.current.embedToken, signal: abort.signal,
        ...(silenceSeconds ? { silenceSeconds } : {}),
        ...(timeCheck ? { timeCheck: true } : {}),
        ...(roomVoices ? { roomVoices } : {}),
        ...(resumeTurnRef.current ? { resumed: true } : {}),
        onText: (delta) => {
          // Typed sessions: once the reply is appearing, the shell's "Thinking…" state is over.
          if (!text && p.current.mode === 'text') p.current.onTutorBusy?.(false);
          text += delta; setTutor(text, true);
          const finished = sentences.push(delta);
          // More words have come: nothing but speech follows the kept sentence.
          if (kept !== null && (finished.length || sentences.hasPending())) letGo();
          sayAll(finished);
          if (kept !== null && sentences.hasPending()) letGo();
        },
        // A board block is arriving: keep the sentence until it is here (bounded: a block that never completes must not mute the tutor).
        onBoardOpen: () => { if (kept !== null) { const s = kept; kept = null; keep(s, KEEP_FOR_BLOCK_MS); } },
        onBoardWithdraw: (id) => { p.current.onBoardWithdraw?.(id); },
        // Homework mode: the same debug events v1 records, which the academy's outcome route reads
        // (homework-build/outcome.ts). Done is recorded once.
        onHomework: (ev) => {
          if (ev.type === 'homework-keyed-verdict') p.current.onDebugEvent?.(KEYED_VERDICT_DEBUG_TYPE, formatKeyedVerdictDebug(ev.part, ev.verdict, ev.value));
          else if (ev.type === 'homework-sheet-solved') p.current.onDebugEvent?.('homework_problem_solved', `pos=${ev.position} solved=[${ev.solved.join(',')}] total=${ev.total}`);
          else if (!homeworkDoneRecordedRef.current) { homeworkDoneRecordedRef.current = true; p.current.onDebugEvent?.('homework_problem_done', 'all key parts confirmed'); }
        },
        onToolCall: (call) => {
          settled.push(call); p.current.onBoardCallArrived?.(call);
          p.current.onDebugEvent?.('tool_call', `${call.name}${call.name === 'set_goal_status' ? ` ${String(call.args.goal ?? '')}=${String(call.args.status ?? '')}` : call.name === 'end_lesson' ? ` because=${String(call.args.because ?? '')}` : ''} → ${call.outcome}${call.sayWith ? ` · with "${call.sayWith}"` : ''}${call.inline ? ' · inline' : ''}`);
          // Written again, a thing already on the page is pointed at: the board glides back to it and marks it
          // ("it would have been awesome had it slowly scrolled up and showed me that problem", AP Precalculus).
          if (call.pointsAt) {
            // On another page: the board turns back to it first, and what is written next goes there.
            const turn = call.turnsTo !== undefined ? [{ ...(mapFunctionCallToCommand('go_to_page', { pageIndex: call.turnsTo, page: call.turnsTo + 1, title: stateRef.current.board.pages[call.turnsTo]?.title }) as unknown as Record<string, unknown>), writesThere: true } as unknown as WhiteboardCommand] : [];
            p.current.onWhiteboardCommand([...turn, { action: 'scrollTo', target: 'item', targetId: call.pointsAt, pulse: true } as unknown as WhiteboardCommand]);
            return;
          }
          if (!paintsOnBoard(call, V2_CONTROL_TOOL_NAMES)) return;
          const cmd = mapFunctionCallToCommand(call.name, call.args as Record<string, unknown>);
          // The words written before and after a tool call are separate paragraphs.
          letGo(); speak(sentences.flush());
          // Every item carries its own id: the board animates an item once and keys its row by it (without one a
          // card drew itself again whenever the next card arrived), and a redrawn graph removes the one it replaces.
          if (cmd && !(cmd as { id?: string }).id) (cmd as { id?: string }).id = call.id;
          // Lines of working get room between them: fractions and roots on consecutive lines ran into each other
          // (AP Statistics, embed-1794447717307). Done here, so the tutor's record keeps the equation as written.
          if (cmd && (cmd as { action?: string }).action === 'showEquation' && typeof (cmd as { latex?: unknown }).latex === 'string') (cmd as unknown as { latex: string }).latex = (cmd as unknown as { latex: string }).latex.replace(/\\\\(?!\s*\[)/g, '\\\\[0.5em]');
          // Two statements set side by side on one line are two lines: left as one, the board broke the long line
          // where it liked and the second statement's left side hung at the end of the first (AP Statistics,
          // embed-1794460149936).
          if (cmd && (cmd as { action?: string }).action === 'showEquation' && typeof (cmd as { latex?: unknown }).latex === 'string') { const eq = cmd as unknown as { latex: string }; if (!/\\\\|\\begin\{/.test(eq.latex) && /\\qquad/.test(eq.latex) && eq.latex.length > 60) eq.latex = `\\begin{gathered} ${eq.latex.split(/\s*\\qquad\s*/).filter(Boolean).join(' \\\\[0.5em] ')} \\end{gathered}`; }
          // A sketch is drawn by its own service from the one-line description; the request starts now and the
          // item goes up when both its sentence and its drawing have arrived. No drawing: a labelled card instead.
          const drawn: Promise<void> = cmd && (cmd as { action?: string }).action === 'showSketch' ? resolveSketch(cmd as unknown as SketchCommand, p.current.embedToken, (m) => p.current.onDebugEvent?.('v2_sketch', m)) : Promise.resolve();
          if (cmd && call.before) (cmd as unknown as { placeBefore?: string }).placeBefore = call.before;
          // Turned back to an earlier page, the tutor writes on it (WhiteboardCanvas.tsx).
          if (cmd && (cmd as { action?: string }).action === 'goToPage') (cmd as unknown as { writesThere?: boolean }).writesThere = true;
          // A rewritten item stands where the one it replaces stood (WhiteboardCanvas.tsx).
          if (cmd && call.replaces) (cmd as unknown as { takesPlaceOf?: string }).takesPlaceOf = call.replaces;
          const pageHeld = TUTOR_V2_CHIP_ON_PAINT && !!p.current.holdBoard && (call.name === 'new_page' || call.name === 'go_to_page');
          if (cmd && pageHeld) pagesHeldRef.current.hold(turnNo);
          if (cmd) { const paint = () => { void drawn.then(() => { p.current.onWhiteboardCommand([cmd]); if (pageHeld) pageShown(); }); }; if (p.current.holdBoard) p.current.holdBoard(call, paint); else paint(); }
          if (text && !/\n\n$/.test(text)) text += '\n\n';
        },
      });
      letGo(); speak(sentences.flush());
      if (levelCheckOn() && done.state.workingLevel?.from === 'this_lesson' && done.state.workingLevel.level !== loggedLevelRef.current) {
        loggedLevelRef.current = done.state.workingLevel.level;
        p.current.onDebugEvent?.('working_level_set', `${done.state.workingLevel.level}${done.state.workingLevel.level === estimatedLevelRef.current ? ' source=estimate' : ''} (v2)`);
      }
      // Task 7n (FLAG_CLOCK_PAUSE): a pause closed while the turn ran is kept. (CHIP_ON_PAINT): a page still held, the chip stays.
      stateRef.current = pausedTotalRef.current > (done.state.clockPausedMs ?? 0) ? { ...done.state, clockPausedMs: pausedTotalRef.current } : done.state;
      pagesHeldRef.current.done(turnNo);
      if (p.current.pronunciation) { const a = done.state.pronunciation?.armed; p.current.onPronunciationArm?.(a ? { seq: a.seq, reference: a.reference } : null); }
      requestLevelEstimate();
      keptListeningRef.current = settled.some((c) => c.name === 'keep_listening' && !/^not /.test(c.outcome));
      reportSheet();
      if (done.state.closed) clearV2State(p.current.sessionId); else saveV2State(p.current.sessionId, done.state);
      reportProgress();
      setTutor(done.spoken || text.trim(), false, settled.some((c) => c.name === 'show_problem' && /^painted/.test(c.outcome)));
      p.current.onBrainUsage?.(done.usage);
      p.current.onDebugEvent?.('brain_turn', `Brain ${done.totalMs}ms · first_sentence=${done.firstTextMs ?? done.totalMs}ms · in=${done.usage.inputTokens} out=${done.usage.outputTokens} cr=${done.usage.cacheReadTokens} cc=${done.usage.cacheCreationTokens} · v2`);
      // Task 7q: the turn's own session events (adaptive.ts: v2_practice_signal, v2_support_step, v2_retest_*), recorded as any other.
      for (const e of Array.isArray(done.events) ? done.events : []) if (e && typeof e.type === 'string') p.current.onDebugEvent?.(e.type, String(e.message ?? ''));
      if (done.state.closed) {
        const closing = settled.find((c) => c.name === 'end_lesson' && !/^not /.test(c.outcome));
        needsPracticeRef.current = (Array.isArray(closing?.args.needs_practice) ? (closing?.args.needs_practice as unknown[]) : []).map((n) => planRef.current?.los[Number(n) - 1]?.id).filter((x): x is string => !!x);
        commitProfile();
        assignPractice(settled.find((c) => c.name === 'end_lesson' && !/^not /.test(c.outcome)));
        // Task 7h (CLOSE_HEARS): a spoken close is closed once its words have been said (below); until then the
        // microphone stays open.
        const wait = p.current.closeDelayMs;
        const hears = v2CloseHears(p.current.mode, typeof wait === 'function');
        if (!hears) setClosed(true);
        p.current.onDebugEvent?.('lesson_closed', 'end_lesson');
        // A one-problem homework session closed by the tutor reads, for the academy's outcome, as the finish
        // button does (homework-build/outcome.ts): done when every part is, needs review otherwise.
        if (homeworkProblemOf(planRef.current as { metadata?: Record<string, unknown> } | null)) p.current.onDebugEvent?.('homework_session_closed', 'end_lesson');
        p.current.onLessonClosed?.('end_lesson');
        // A partner that keeps the session open after the close (lessonCloseAutoEnd off, as v1 reads it) leaves the end
        // to the student or the host; the box still ends it (armHardStop). No turn runs either way: the state is closed.
        const autoEnd = TUTOR_LESSON_CLOSE_AUTO_END && p.current.lessonCloseAutoEnd !== false;
        if (hears && typeof wait === 'function') {
          // The microphone stays open until the closing words have been said; the session closes (and ends) then, unless
          // the student called the close off (runTurn, above) or the box or the host ended it first.
          const round = closingRef.current.begin();
          p.current.onDebugEvent?.('v2_close_listening', 'the microphone stays open while the closing words are said');
          void wait().then(() => {
            if (!closingRef.current.said(round)) return;
            setClosed(true);
            if (autoEnd) { endingRef.current = true; endOnce(); }
          });
          if (!autoEnd) p.current.onDebugEvent?.('lesson_closed_stays_open', 'the partner ends the session itself (lessonCloseAutoEnd off)');
        } else if (autoEnd) {
          endingRef.current = true;
          if (typeof wait === 'function') void wait().then(() => endOnce());
          else setTimeout(() => endOnce(), wait ?? CLOSE_READ_MS);
        } else p.current.onDebugEvent?.('lesson_closed_stays_open', 'the partner ends the session itself (lessonCloseAutoEnd off)');
      }
    } catch (err) {
      if (abort.signal.aborted) {
        // Cut short (interrupted, unmounted or ended). The server's state for this turn is
        // lost, so the tutor is left remembering exactly what reached the student.
        // What reached the student is what was played, when the voice client knows it: text that had
        // arrived but not been spoken was never heard.
        const reached = p.current.heardSoFar?.() ?? text;
        // Task 7v (SELF_CORRECTION): nothing of the reply reached them: the record keeps no trace of the turn, so their words go on to
        // the next turn with the words that cut it.
        // Task 8h (final review M5): never the placeholder of a turn for words not heard (main's carry below has the same test); M4: the
        // carry is logged under main's event name too.
        carriedSaidRef.current = unheard ? null : v2CutWordsCarried(brainSaid, reached, settled.length, pendingRef.current);
        if (carriedSaidRef.current) p.current.onDebugEvent?.('v2_unanswered_carried', carriedSaidRef.current.slice(0, 80));
        // Merge with main (Task 8e): main carries the same words by its own ref (211dfda8: "Oh, at most means less than or equal
        // to", then "right?" over the reply, Digital SAT, portal-b0efc3c2). One carry only: with SELF_CORRECTION on the words are in
        // carriedSaidRef (joined on a new line for the brain); with it off, main's ref holds them (joined into brainSaid in runTurn's head).
        if (!carriedSaidRef.current && brainSaid && studentSaid && !unheard && !reached.trim() && settled.length === 0 && pendingRef.current) { unansweredRef.current = brainSaid; p.current.onDebugEvent?.('v2_unanswered_carried', brainSaid.slice(0, 80)); }
        // An item dropped before it was shown is not on the board, and the tutor is told so: recorded as painted, a
        // problem the student never saw was "the one on the board" in the next reply (ACT Math, portal-87303e9f).
        const hidden = p.current.notShown?.() ?? new Set<string>();
        const asSeen = settled.map((c) => (hidden.has(c.id) ? { ...c, outcome: 'not painted: the student spoke before you reached it, so it never went up' } : c));
        stateRef.current = foldInterruptedTurn(stateRef.current, brainSaid ?? (stateRef.current.history.length === 0 ? '[The session has just started. The student has joined and is waiting for you to begin the lesson.]' : '[The student has not replied.]'), reached, asSeen);
        p.current.onDebugEvent?.('v2_turn_cut', `${text.trim().split(/\s+/).filter(Boolean).length} words kept, ${settled.length} tool call(s)`);
        if (text.trim()) setTutor(text.trim(), false);
      } else {
        // The state is unchanged, so the same message can simply be sent again.
        setTutor(text.trim() ? `${text.trim()}\n\n${UNREACHABLE}` : UNREACHABLE, false);
        p.current.onDebugEvent?.('brain_v2_error', String((err as Error)?.message ?? err).slice(0, 200));
        p.current.onError?.(err instanceof Error ? err : new Error(String(err)));
      }
    } finally {
      busyRef.current = false; setBusy(false); p.current.onTutorBusy?.(false);
      const next = pendingRef.current; pendingRef.current = null;
      const reopen = pendingOpenRef.current; pendingOpenRef.current = false;
      if (next && !endingRef.current) void runTurn(next);
      else if (reopen && !endingRef.current && stateRef.current.history.length === 0) void runTurn(null);
    }
  }, []);

  // What the engine remembers of this student (memory.ts): read as the page loads, committed when the session
  // ends, however it ends. A session of a few exchanges or fewer leaves nothing worth remembering.
  const memoryRef = useRef<string[]>([]); const committedAtRef = useRef(0); const committedLevelRef = useRef(''); const needsPracticeRef = useRef<string[]>([]); const sentMasteryRef = useRef<Set<string>>(new Set()); const memoryReadyRef = useRef<Promise<unknown>>(Promise.resolve());
  // A trial keeps no memory, except the working level when the partner checks it (v2/working-level.ts): a partner's
  // trial link is the learner's link, and v1 remembered the level on it.
  const levelCheck = !!config.levelCheck;
  useEffect(() => {
    const id = config.studentId; if (!id || (config.trial && !(TUTOR_WORKING_LEVEL && levelCheck))) return;
    let gone = false;
    memoryReadyRef.current = fetch(`/api/tutor/student-profile/${encodeURIComponent(id)}`, p.current.embedToken ? { headers: { 'x-embed-token': p.current.embedToken } } : undefined)
      .then((r) => (r.ok ? r.json() : null)).then((data: { profile?: { workingLevel?: { level?: unknown } } } | null) => {
        if (gone || !data?.profile) return;
        if (!config.trial) memoryRef.current = v2MemoryLines(data.profile as never, p.current.sessionId);
        const known = levelCheckOn() ? parseWorkingLevel(data.profile.workingLevel?.level) : null;
        if (known) { knownLevelRef.current = known; p.current.onDebugEvent?.('working_level_known', `${known} (v2)`); }
      })
      .catch(() => { /* no profile: the lesson starts without it */ });
    return () => { gone = true; };
  }, [config.studentId, config.trial, levelCheck]);
  const commitProfile = useCallback((keepalive = false) => {
    const c = p.current; const said = transcriptRef.current.length;
    // A trial commits the working level alone, once per level (v2/working-level.ts).
    if (c.trial && c.studentId && c.sessionId && levelCheckOn()) {
      const body = v2WorkingLevelCommit({ sessionId: c.sessionId, subject: c.subject, lessonPlanId: c.lessonPlanId, state: stateRef.current });
      const level = (body?.workingLevel as { level?: string } | undefined)?.level ?? '';
      if (body && level !== committedLevelRef.current) {
        committedLevelRef.current = level;
        void fetch(`/api/tutor/student-profile/${encodeURIComponent(c.studentId)}`, { method: 'POST', keepalive, headers: { 'Content-Type': 'application/json', ...(c.embedToken ? { 'x-embed-token': c.embedToken } : {}) }, body: JSON.stringify(body) })
          .then((r) => c.onDebugEvent?.('working_level_saved', `status=${r.status} ${level} (v2 trial)`))
          .catch((e) => c.onDebugEvent?.('working_level_saved', `failed ${String((e as Error).message).slice(0, 80)}`));
      }
      return;
    }
    if (!c.studentId || !c.sessionId || c.trial || said < 4 || said === committedAtRef.current) return;
    committedAtRef.current = said;
    const body = v2ProfileCommit({ sessionId: c.sessionId, subject: c.subject, level: c.level, topic: c.topic, lessonPlanId: c.lessonPlanId, plan: planRef.current, state: stateRef.current, transcript: transcriptRef.current, needsPracticeLoIds: needsPracticeRef.current });
    // A session can commit more than once (the close, then the page going away): each mastery step and each
    // evidence row is sent once.
    const fresh = <T,>(rows: T[], key: (r: T) => string) => rows.filter((r) => { const k = key(r); if (sentMasteryRef.current.has(k)) return false; sentMasteryRef.current.add(k); return true; });
    body.masteryDeltas = fresh(body.masteryDeltas as Array<{ loId: string; delta: number }>, (r) => `lo:${r.loId}`);
    body.segmentOutcomes = fresh(body.segmentOutcomes as Array<{ segmentId: string }>, (r) => `seg:${r.segmentId}`);
    void fetch(`/api/tutor/student-profile/${encodeURIComponent(c.studentId)}`, { method: 'POST', keepalive, headers: { 'Content-Type': 'application/json', ...(c.embedToken ? { 'x-embed-token': c.embedToken } : {}) }, body: JSON.stringify(body) })
      .then((r) => c.onDebugEvent?.('v2_profile_commit', `status=${r.status} gaps=${(body.gaps as unknown[]).length} mastery=${JSON.stringify(body.masteryDeltas)} evidence=${(body.segmentOutcomes as unknown[]).length} turns=${said}`))
      .catch((e) => c.onDebugEvent?.('v2_profile_commit', `failed ${String((e as Error).message).slice(0, 80)}`));
  }, []);
  useEffect(() => { const onHide = () => commitProfile(true); window.addEventListener('pagehide', onHide); return () => window.removeEventListener('pagehide', onHide); }, [commitProfile]);

  // Practice after the lesson. The tutor names, as it closes, the objectives the student has not yet done
  // alone; the same two calls v1 makes then draft items for them from the bank and assign them, and the
  // portal shows them. The tutor does not announce it: the calls finish after its goodbye, and may find
  // nothing in the bank.
  const assignPractice = useCallback((call: V2ToolCall | undefined) => {
    const plan = planRef.current; const c = p.current;
    const picked = Array.isArray(call?.args.needs_practice) ? (call?.args.needs_practice as unknown[]) : [];
    const loIds = [...new Set(picked.map((n) => plan?.los[Number(n) - 1]?.id).filter((x): x is string => !!x))];
    if (!plan || !loIds.length || !c.studentId || !c.lessonPlanId || !c.sessionId || c.inFlow || c.trial) return;
    const headers = { 'Content-Type': 'application/json', ...(c.embedToken ? { 'x-embed-token': c.embedToken } : {}) };
    const base = { studentId: c.studentId, sessionId: c.sessionId };
    void (async () => {
      try {
        const d = await fetch('/api/tutor/practice-assign/draft', { method: 'POST', headers, keepalive: true, body: JSON.stringify({ ...base, lessonPlanId: c.lessonPlanId, subject: c.subject, loIds, trigger: 'close_tool', locator: c.practiceLocator }) });
        c.onDebugEvent?.(d.status === 200 ? 'practice_draft_upserted' : d.status === 204 ? 'practice_draft_empty' : 'practice_draft_failed', `lo=[${loIds.join(',')}] trigger=close_tool status=${d.status} (v2)`);
        const f = await fetch('/api/tutor/practice-assign/finalize', { method: 'POST', headers, keepalive: true, body: JSON.stringify({ ...base, source: 'close_tool', reason: String(call?.args.summary ?? '').slice(0, 400) || 'Your tutor picked these to follow up on today\'s lesson.', locator: c.practiceLocator }) });
        c.onDebugEvent?.('v2_practice_assign', `finalize status=${f.status}`);
      } catch (e) { c.onDebugEvent?.('practice_draft_failed', `v2 ${String((e as Error).message).slice(0, 80)}`); }
    })();
  }, []);

  // The time box is a hard stop, as it is in v1: partner minute pools and demo limits depend on a
  // session not running past it. The tutor is told the time every turn, the wrap among it, and closes by
  // itself before this in the normal case; this is the backstop. It ends with a goodbye, said after the
  // tutor's speech under way (v2/time-box.ts): v2 ended mid-sentence with none. Task 7f F: the box is the target; the stop
  // is at the box plus the overrun margin, never past the ceiling the host gives (a partner pool's remaining balance).
  const hardStopRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timeCheckRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const runTurnRef = useRef<typeof runTurn | null>(null);
  runTurnRef.current = runTurn;
  // Task 7n (FLAG_CLOCK_PAUSE): `afterPause`: re-armed after the flag panel held the clock, at the lesson time left.
  const armHardStop = useCallback((afterPause?: boolean) => {
    const minutes = p.current.sessionMaxMinutes;
    if (!minutes || hardStopRef.current) return;
    // Task 7f F (TIME_OVERRUN): the box is the target; the stop is at the box plus the margin, never past the host's maximum.
    // Task 8h (final review I2, ruling 2): only in a session whose tutor is told of the margin (time-box.ts v2MarginMin: a
    // part-flow lesson, never past the partner's own max_duration_minutes or the pool's balance). Every other session (homework,
    // a discussion, a maths lesson) stops at the box, as on main. The stop is armed for the box and the margin is read there:
    // the plan that decides it is loaded after the session mounts.
    const stopMinNow = () => minutes + v2ClientMarginMin({ mode: p.current.mode, plan: planRef.current, boxMin: minutes, ceilingMin: p.current.sessionStopCeilingMinutes });
    const byLessonClock = afterPause || (TUTOR_V2_FLAG_CLOCK_PAUSE && resumedRef.current);
    // Two minutes before the end the tutor says so and uses what is left well (facts.ts). A turn that happens
    // then is told by its facts; when no one is speaking, this makes the turn happen. Without it a quiet
    // student met the end of the session with no warning.
    // Merge with main (Task 8e): re-armed after the flag panel held the clock (7n), the check is timed by the lesson clock as the
    // stop is, and an earlier timer is dropped. Measured to the box, not the stop (7f F): the close is due two minutes before the box.
    if (timeCheckRef.current) { clearTimeout(timeCheckRef.current); timeCheckRef.current = null; }
    const checkMin = minutes - closeDueMinutes(minutes);
    const dueMs = afterPause || (TUTOR_V2_FLAG_CLOCK_PAUSE && resumedRef.current) ? v2HardStopDelayMs(checkMin, stateRef.current, Date.now()) : checkMin * 60000 - (resumedRef.current ? Date.now() - stateRef.current.startedAtMs : 0);
    if (dueMs > 5000) {
      let tries = 0;
      // Task 8j fix round 1 (TIME_CHECK_AFTER_SPEECH): not while the tutor's voice still plays, and then only after
      // V2_TIME_CHECK_QUIET_MS of quiet with no turn (a turn inside the last minutes sets timeCheckedRef, and the check is not needed).
      // Mic test 13 (embed-1795453600266, 18:02): it fired while the summary and the check question were still being spoken, and the
      // tutor asked the check question a second time. Checked every second, for at most V2_TIME_CHECK_WAIT_TRIES seconds.
      let waits = 0; let quietSince = 0; let heardSpeech = false;
      const check = () => {
        if (endingRef.current || closingRef.current.active || stateRef.current.closed || timeCheckedRef.current) return;
        if (busyRef.current) { if (++tries <= 8) timeCheckRef.current = setTimeout(check, 4000); return; }
        if (TUTOR_V2_TIME_CHECK_AFTER_SPEECH && p.current.speechPending && waits < V2_TIME_CHECK_WAIT_TRIES) {
          if (p.current.speechPending()) { heardSpeech = true; quietSince = 0; waits += 1; timeCheckRef.current = setTimeout(check, 1000); return; }
          if (heardSpeech) {
            if (!quietSince) quietSince = Date.now();
            if (Date.now() - quietSince < V2_TIME_CHECK_QUIET_MS) { waits += 1; timeCheckRef.current = setTimeout(check, 1000); return; }
          }
        }
        timeCheckedRef.current = true;
        p.current.onDebugEvent?.('v2_time_check', `${closeDueMinutes(minutes)} min left of ${minutes}`);
        void runTurnRef.current?.(null, undefined, false, true);
      };
      timeCheckRef.current = setTimeout(check, dueMs);
    }
    const stop = (stopMin: number) => {
      if (endingRef.current) return;
      // Task 7h: a close still being said when the box comes is not interruptible either: the microphone closes, and
      // (fix round 1, I1) the closing words play out, bounded, then the session ends as the close would have.
      const wasClosing = closingRef.current.active;
      endingRef.current = true; closingRef.current.stop();
      p.current.onDebugEvent?.('v2_time_limit', `${stopMin} min (box ${minutes})`);
      if (wasClosing) {
        setClosed(true);
        const settle = p.current.closeDelayMs;
        void v2BoxDuringClose({
          ...(p.current.untilQuiet ? { untilQuiet: p.current.untilQuiet } : {}),
          cut: () => p.current.onCut?.(),
          settle: () => (typeof settle === 'function' ? settle() : Promise.resolve()),
          end: () => endOnce(),
          ended: () => endedRef.current,
          log: (type, message) => p.current.onDebugEvent?.(type, message),
        });
        return;
      }
      // A lesson that has already said its goodbye (kept open by its partner) is not said goodbye to twice.
      const bye = TUTOR_V2_TIME_BOX && !stateRef.current.closed ? goodbyeLine(p.current.studentName) : null;
      // Task 7d fix round 1 (M10): the next-time line waits for the reply that closes; when the box comes first, its goodbye says it.
      const nextTime = bye ? v2HardStopNextTime({ mode: p.current.mode, plan: planRef.current ?? undefined, languages: p.current.tutorLanguages, pronunciation: p.current.pronunciation }, planRef.current, stateRef.current) : null;
      const farewell = bye && nextTime ? `${nextTime} ${bye}` : bye;
      // The microphone closes: the student's words are no longer answered, and must not cut the goodbye.
      if (farewell) setClosed(true);
      const wait = p.current.closeDelayMs;
      void v2HardStop({
        stopTurn: () => abortRef.current?.abort(),
        ...(p.current.untilQuiet ? { untilQuiet: p.current.untilQuiet } : {}),
        cut: () => p.current.onCut?.(),
        say: (line) => {
          transcriptRef.current = [...transcriptRef.current, { id: `tutor-time-up-${Date.now()}`, timestamp: new Date(), role: 'tutor', text: line }]; publish();
          p.current.onSentence?.(line, true);
        },
        commit: () => commitProfile(true),
        afterGoodbye: () => (typeof wait === 'function' ? wait() : new Promise<void>((r) => setTimeout(r, wait ?? CLOSE_READ_MS))),
        end: () => endOnce('time_limit'),
        ended: () => endedRef.current,
        log: (type, message) => p.current.onDebugEvent?.(type, message),
      }, farewell);
    };
    hardStopRef.current = setTimeout(() => {
      if (endingRef.current) return;
      const stopMin = stopMinNow();
      if (!(stopMin > minutes)) { stop(minutes); return; }
      hardStopRef.current = setTimeout(() => stop(stopMin), byLessonClock ? v2HardStopDelayMs(stopMin, stateRef.current, Date.now()) : Math.max(0, stopMin * 60000 - (Date.now() - stateRef.current.startedAtMs)));
    // A resumed session's box runs from when the lesson first began.
    }, byLessonClock ? v2HardStopDelayMs(minutes, stateRef.current, Date.now()) : Math.max(5000, minutes * 60000 - (resumedRef.current ? Date.now() - stateRef.current.startedAtMs : 0)));
  }, []);
  // Unmounted: a stop under way (waiting on the last words or the goodbye) does nothing more.
  // (Set false on mount: React's development double mount runs this clean-up once before the real mount.)
  useEffect(() => { endedRef.current = false; return () => { endedRef.current = true; if (hardStopRef.current) clearTimeout(hardStopRef.current); if (timeCheckRef.current) clearTimeout(timeCheckRef.current); }; }, []);

  // A resume (resume.ts): the transcript and the board go back up as the page loads, and the state is the one
  // kept in this browser or, failing that, one rebuilt from the host's checkpoint.
  const resumedRef = useRef(false); const resumeTurnRef = useRef(false);
  useEffect(() => {
    const cp = p.current.resumeState;
    if (!cp || resumedRef.current || openedRef.current || !cp.transcript.length) return;
    const kept = loadV2State(p.current.sessionId);
    stateRef.current = kept ?? v2StateFromCheckpoint(cp, Date.now(), `${V2_OPENING_BLOCK_START} The student has joined.]`);
    if (!stateRef.current.history.length) return;
    resumedRef.current = true;
    transcriptRef.current = [...cp.transcript]; publish();
    if (cp.whiteboardCommands.length) p.current.onWhiteboardCommand(cp.whiteboardCommands);
    p.current.onDebugEvent?.('v2_resume', kept ? 'state kept in this browser' : 'state rebuilt from the checkpoint');
    reportProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const open = useCallback(() => {
    if (openedRef.current) return;
    openedRef.current = true;
    // Task 7g (CLOCK_FROM_START): the engine's clock starts here, with the visible timer (onSessionStarted), not at mount.
    if (!resumedRef.current) stateRef.current = v2StartClock(stateRef.current, Date.now());
    armHardStop();
    p.current.onSessionStarted?.();
    p.current.onDebugEvent?.('start_v2', `tutor ${resumedRef.current ? 'welcomes the student back' : 'opens'} (${p.current.mode})`);
    if (resumedRef.current) { resumeTurnRef.current = true; void runTurn(null).finally(() => { resumeTurnRef.current = false; }); return; }
    void runTurn(null);
  }, [runTurn, armHardStop]);

  const send = useCallback((raw: string, opts?: { unheard?: boolean }) => {
    // What was heard was the recogniser's noise (heard.ts): the brain is told nothing could be made out.
    if (opts?.unheard) { if (openedRef.current) void runTurn(V2_UNHEARD_SAID, undefined, true); return; }
    const text = raw.trim();
    // Bracketed strings are v1 runtime markers ("[start lesson]"); v2 has no use for them.
    if (!text || /^\[/.test(text)) return;
    if (!openedRef.current) { openedRef.current = true; if (!resumedRef.current) stateRef.current = v2StartClock(stateRef.current, Date.now()); p.current.onSessionStarted?.(); armHardStop(); }
    void runTurn(text);
  }, [runTurn, armHardStop]);

  const nudge = useCallback((silenceSeconds: number) => { if (openedRef.current && !busyRef.current) void runTurn(null, silenceSeconds); }, [runTurn]);
  const abort = useCallback(() => { abortRef.current?.abort(); }, []);
  // The host's end carries a line for the student ("Saved — pick this up from your list…", host-end.ts): it is
  // the tutor's last words before the session closes.
  const end = useCallback((opts?: { farewell?: string }) => {
    endingRef.current = true; closingRef.current.stop(); abortRef.current?.abort();
    // Already ended (the box's stop, the close): no second farewell, commit or end.
    if (endedRef.current) return;
    const farewell = opts?.farewell?.trim();
    if (farewell) { transcriptRef.current = [...transcriptRef.current, { id: `tutor-farewell-${Date.now()}`, timestamp: new Date(), role: 'tutor', text: farewell }]; publish(); }
    commitProfile(true); endOnce();
  }, [commitProfile]);
  const isEnding = useCallback(() => endingRef.current, []);
  const isClosing = useCallback(() => closingRef.current.active, []);
  // Task 7n (FLAG_CLOCK_PAUSE): the debug flag panel holds the lesson clock: the hard stop waits, and the paused total goes into the
  // state the turns send (subtracted by the turn route's time rules). Billing and the recorded length read the wall clock.
  const pauseSinceRef = useRef<number | null>(null); const pausedTotalRef = useRef(0);
  const pauseClock = useCallback((paused: boolean) => {
    if (!TUTOR_V2_FLAG_CLOCK_PAUSE || !V2_CLOCK_PAUSE_HONOURED || !openedRef.current || endingRef.current) return;
    if (paused) { if (pauseSinceRef.current === null) { pauseSinceRef.current = Date.now(); if (hardStopRef.current) { clearTimeout(hardStopRef.current); hardStopRef.current = null; } } return; }
    const since = pauseSinceRef.current; if (since === null) return; pauseSinceRef.current = null;
    pausedTotalRef.current = Math.max(pausedTotalRef.current, stateRef.current.clockPausedMs ?? 0) + (Date.now() - since);
    stateRef.current = { ...stateRef.current, clockPausedMs: pausedTotalRef.current };
    p.current.onDebugEvent?.('v2_clock_paused', `${Math.round(pausedTotalRef.current / 1000)} s in all`);
    armHardStop(true);
  }, [armHardStop]);

  return { send, open, nudge, end, abort, isEnding, isClosing, pauseClock, busy, closed, openedRef, stateRef, resumedRef, keptListeningRef };
}
