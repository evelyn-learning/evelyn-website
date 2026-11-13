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
import type { TutorMilestone } from '@/lib/tutor/orchestrator/types';
import { V2_OPENING_BLOCK_START, clearV2State, loadV2State, saveV2State, v2StateFromCheckpoint } from '@/lib/tutor/v2/resume';
import { v2MemoryLines, v2ProfileCommit } from '@/lib/tutor/v2/memory';
import { V2_BACKGROUND_MAX_LINES } from '@/lib/tutor/v2/background';
import { v2Progress } from '@/lib/tutor/v2/progress';
import { useCallback, useEffect, useRef, useState, type MutableRefObject } from 'react';
import type { WhiteboardCommand } from '@core/knowledge/types';
import { mapFunctionCallToCommand } from '@/app/tutor/hooks/toolDefinitions';
import type { TranscriptEntry } from '@/lib/tutor/types';
import { paintsOnBoard, streamV2Turn, type V2ClientSession } from '@/lib/tutor/v2/client';
import { foldInterruptedTurn } from '@/lib/tutor/v2/interrupted';
import { SentenceStream } from '@/lib/tutor/v2/sentences';
import { V2_CONTROL_TOOL_NAMES } from '@/lib/tutor/v2/tool-names';
import { mentionsTool } from '@/lib/tutor/v2/tool-talk';
import { newV2State, type V2State, type V2ToolCall } from '@/lib/tutor/v2/types';

export interface V2TurnsConfig {
  mode: 'text' | 'voice';
  subject: string;
  level: string;
  studentName?: string;
  lessonPlanId?: string;
  embedToken?: string;
  sessionMaxMinutes?: number;
  /** The teacher persona's name and manner, and whether this is a free trial (types.ts V2Session). */
  teacher?: { name: string; nameIsRole?: boolean; style?: string };
  trial?: boolean;
  /** The topic asked for when there is no lesson plan. */
  topic?: string;
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
  /** Voice: a turn was cut short (the student spoke over it); stop speaking. */
  onCut?: () => void;
  /** How long after the closing words the session ends. Voice passes a function that waits for the speech to finish. */
  closeDelayMs?: number | (() => Promise<void>);
}

const CLOSE_READ_MS = 4000;
/** How long a finished sentence waits to learn what follows it; and how long it waits for a board block that has begun. */
const KEEP_BRIEF_MS = 250;
const KEEP_FOR_BLOCK_MS = 2500;
const UNREACHABLE = "I couldn't reach the tutor just now. Please send that again.";

export interface V2Turns {
  /** A student message. While a turn is running: text mode queues it; voice mode cuts the running turn and answers this instead. */
  send: (text: string) => void;
  /** The tutor's opening turn (once). */
  open: () => void;
  /** A turn with no student words: the student has been silent. */
  nudge: (silenceSeconds: number) => void;
  end: () => void;
  abort: () => void;
  isEnding: () => boolean;
  busy: boolean;
  closed: boolean;
  openedRef: MutableRefObject<boolean>;
  /** This page load picked up an earlier session (resume.ts). */
  resumedRef: MutableRefObject<boolean>;
  stateRef: MutableRefObject<V2State>;
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
  const reportProgress = useCallback(() => {
    const plan = planRef.current; if (!plan) return;
    const now = v2Progress(plan, stateRef.current.goals);
    const sig = `${now.currentSegmentId}|${now.completedSegmentIds.join(',')}`;
    if (sig !== reportedRef.current) { reportedRef.current = sig; p.current.onLessonPlanProgress?.({ plan, currentSegmentId: now.currentSegmentId }); p.current.onCompletedSegmentsChange?.(now.completedSegmentIds); }
    if (now.milestone && now.milestone !== milestoneRef.current) { milestoneRef.current = now.milestone; p.current.onMilestone?.(now.milestone); }
  }, []);
  useEffect(() => {
    const id = config.lessonPlanId; if (!id) return;
    let gone = false;
    void fetch(`/api/tutor/lesson-plans/${encodeURIComponent(id)}`).then((r) => (r.ok ? r.json() : null)).then((data: { plan?: LessonPlan } | null) => {
      if (gone || !data?.plan?.segments?.length) return;
      planRef.current = data.plan; reportProgress();
    }).catch(() => { /* no plan, no report: the lesson itself does not depend on it */ });
    return () => { gone = true; };
  }, [config.lessonPlanId, reportProgress]);
  const transcriptRef = useRef<TranscriptEntry[]>([]);
  const busyRef = useRef(false);
  const pendingRef = useRef<string | null>(null);
  // An opening turn asked for while an earlier one is still being torn down
  // (React runs effects twice in development: start, clean up, start again).
  const pendingOpenRef = useRef(false);
  const openedRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const endingRef = useRef(false);
  const [busy, setBusy] = useState(false);
  const [closed, setClosed] = useState(false);

  const publish = () => p.current.onTranscriptUpdate([...transcriptRef.current]);

  const runTurn = useCallback(async (studentSaid: string | null, silenceSeconds?: number) => {
    if (stateRef.current.closed || endingRef.current) return;
    if (busyRef.current) {
      if (studentSaid) {
        pendingRef.current = pendingRef.current ? `${pendingRef.current}\n${studentSaid}` : studentSaid;
        // Spoken words over a running reply are an interruption: stop it and answer them.
        if (p.current.mode === 'voice') { p.current.onCut?.(); abortRef.current?.abort(); }
      } else if (!silenceSeconds) pendingOpenRef.current = true;
      return;
    }
    busyRef.current = true; setBusy(true); p.current.onTutorBusy?.(true);
    const stamp = Date.now();
    if (studentSaid) transcriptRef.current = [...transcriptRef.current, { id: `student-${stamp}`, timestamp: new Date(), role: 'student', text: studentSaid }];
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
    const session: V2ClientSession = {
      studentName: p.current.studentName, subject: p.current.subject, level: p.current.level, mode: p.current.mode,
      ...(p.current.sessionMaxMinutes ? { timeBoxMinutes: p.current.sessionMaxMinutes } : {}),
      ...(p.current.lessonPlanId ? { lessonPlanId: p.current.lessonPlanId } : {}),
      ...(p.current.topic && !p.current.lessonPlanId ? { topic: p.current.topic } : {}),
      ...(p.current.background?.length || memoryRef.current.length ? { background: [...(p.current.background ?? []), ...memoryRef.current].slice(0, V2_BACKGROUND_MAX_LINES) } : {}),
      ...(p.current.teacher ? { teacher: p.current.teacher } : {}),
      ...(p.current.trial ? { trial: true } : {}),
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
    try {
      const done = await streamV2Turn({
        session, state: stateRef.current, studentSaid, embedToken: p.current.embedToken, signal: abort.signal,
        ...(silenceSeconds ? { silenceSeconds } : {}),
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
        onToolCall: (call) => {
          settled.push(call);
          p.current.onDebugEvent?.('tool_call', `${call.name} → ${call.outcome}${call.sayWith ? ` · with "${call.sayWith}"` : ''}${call.inline ? ' · inline' : ''}`);
          // Written again, a thing already on the page is pointed at: the board glides back to it and marks it
          // ("it would have been awesome had it slowly scrolled up and showed me that problem", AP Precalculus).
          if (call.pointsAt) { p.current.onWhiteboardCommand([{ action: 'scrollTo', target: 'item', targetId: call.pointsAt, pulse: true } as unknown as WhiteboardCommand]); return; }
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
          // A rewritten item stands where the one it replaces stood (WhiteboardCanvas.tsx).
          if (cmd && call.replaces) (cmd as unknown as { takesPlaceOf?: string }).takesPlaceOf = call.replaces;
          if (cmd) { const paint = () => { void drawn.then(() => p.current.onWhiteboardCommand([cmd])); }; if (p.current.holdBoard) p.current.holdBoard(call, paint); else paint(); }
          if (text && !/\n\n$/.test(text)) text += '\n\n';
        },
      });
      letGo(); speak(sentences.flush());
      stateRef.current = done.state;
      if (done.state.closed) clearV2State(p.current.sessionId); else saveV2State(p.current.sessionId, done.state);
      reportProgress();
      setTutor(done.spoken || text.trim(), false, settled.some((c) => c.name === 'show_problem' && /^painted/.test(c.outcome)));
      p.current.onBrainUsage?.(done.usage);
      p.current.onDebugEvent?.('brain_turn', `Brain ${done.totalMs}ms · first_sentence=${done.firstTextMs ?? done.totalMs}ms · in=${done.usage.inputTokens} out=${done.usage.outputTokens} cr=${done.usage.cacheReadTokens} cc=${done.usage.cacheCreationTokens} · v2`);
      if (done.state.closed) {
        commitProfile();
        assignPractice(settled.find((c) => c.name === 'end_lesson' && !/^not /.test(c.outcome)));
        setClosed(true);
        p.current.onDebugEvent?.('lesson_closed', 'end_lesson');
        p.current.onLessonClosed?.('end_lesson');
        endingRef.current = true;
        const wait = p.current.closeDelayMs;
        if (typeof wait === 'function') void wait().then(() => p.current.onEndSession?.());
        else setTimeout(() => p.current.onEndSession?.(), wait ?? CLOSE_READ_MS);
      }
    } catch (err) {
      if (abort.signal.aborted) {
        // Cut short (interrupted, unmounted or ended). The server's state for this turn is
        // lost, so the tutor is left remembering exactly what reached the student.
        stateRef.current = foldInterruptedTurn(stateRef.current, studentSaid ?? (stateRef.current.history.length === 0 ? '[The session has just started. The student has joined and is waiting for you to begin the lesson.]' : '[The student has not replied.]'), text, settled);
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

  // The time box is a hard stop, as it is in v1: partner minute pools and demo limits depend on a
  // session not running past it. The tutor is told the time every turn and closes by itself well
  // before this in the normal case; this is the backstop.
  // What the engine remembers of this student (memory.ts): read as the page loads, committed when the session
  // ends, however it ends. A session of a few exchanges or fewer leaves nothing worth remembering.
  const memoryRef = useRef<string[]>([]); const committedAtRef = useRef(0); const memoryReadyRef = useRef<Promise<unknown>>(Promise.resolve());
  useEffect(() => {
    const id = config.studentId; if (!id || config.trial) return;
    let gone = false;
    memoryReadyRef.current = fetch(`/api/tutor/student-profile/${encodeURIComponent(id)}`, p.current.embedToken ? { headers: { 'x-embed-token': p.current.embedToken } } : undefined)
      .then((r) => (r.ok ? r.json() : null)).then((data: { profile?: unknown } | null) => { if (!gone && data?.profile) memoryRef.current = v2MemoryLines(data.profile as never, p.current.sessionId); })
      .catch(() => { /* no profile: the lesson starts without it */ });
    return () => { gone = true; };
  }, [config.studentId, config.trial]);
  const commitProfile = useCallback((keepalive = false) => {
    const c = p.current; const said = transcriptRef.current.length;
    if (!c.studentId || !c.sessionId || c.trial || said < 4 || said === committedAtRef.current) return;
    committedAtRef.current = said;
    const body = v2ProfileCommit({ sessionId: c.sessionId, subject: c.subject, level: c.level, topic: c.topic, lessonPlanId: c.lessonPlanId, plan: planRef.current, state: stateRef.current, transcript: transcriptRef.current });
    void fetch(`/api/tutor/student-profile/${encodeURIComponent(c.studentId)}`, { method: 'POST', keepalive, headers: { 'Content-Type': 'application/json', ...(c.embedToken ? { 'x-embed-token': c.embedToken } : {}) }, body: JSON.stringify(body) })
      .then((r) => c.onDebugEvent?.('v2_profile_commit', `status=${r.status} gaps=${(body.gaps as unknown[]).length} turns=${said}`))
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

  const hardStopRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const armHardStop = useCallback(() => {
    const minutes = p.current.sessionMaxMinutes;
    if (!minutes || hardStopRef.current) return;
    hardStopRef.current = setTimeout(() => {
      if (endingRef.current) return;
      endingRef.current = true;
      abortRef.current?.abort();
      p.current.onCut?.();
      p.current.onDebugEvent?.('v2_time_limit', `${minutes} min`);
      commitProfile(true);
      p.current.onEndSession?.('time_limit');
    // A resumed session's box runs from when the lesson first began.
    }, Math.max(5000, minutes * 60000 - (resumedRef.current ? Date.now() - stateRef.current.startedAtMs : 0)));
  }, []);
  useEffect(() => () => { if (hardStopRef.current) clearTimeout(hardStopRef.current); }, []);

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
    armHardStop();
    p.current.onSessionStarted?.();
    p.current.onDebugEvent?.('start_v2', `tutor ${resumedRef.current ? 'welcomes the student back' : 'opens'} (${p.current.mode})`);
    if (resumedRef.current) { resumeTurnRef.current = true; void runTurn(null).finally(() => { resumeTurnRef.current = false; }); return; }
    void runTurn(null);
  }, [runTurn, armHardStop]);

  const send = useCallback((raw: string) => {
    const text = raw.trim();
    // Bracketed strings are v1 runtime markers ("[start lesson]"); v2 has no use for them.
    if (!text || /^\[/.test(text)) return;
    if (!openedRef.current) { openedRef.current = true; p.current.onSessionStarted?.(); armHardStop(); }
    void runTurn(text);
  }, [runTurn, armHardStop]);

  const nudge = useCallback((silenceSeconds: number) => { if (openedRef.current && !busyRef.current) void runTurn(null, silenceSeconds); }, [runTurn]);
  const abort = useCallback(() => { abortRef.current?.abort(); }, []);
  const end = useCallback(() => { endingRef.current = true; abortRef.current?.abort(); commitProfile(true); p.current.onEndSession?.(); }, [commitProfile]);
  const isEnding = useCallback(() => endingRef.current, []);

  return { send, open, nudge, end, abort, isEnding, busy, closed, openedRef, stateRef, resumedRef };
}
