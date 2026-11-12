'use client';
/**
 * Tutor brain v2 — the turn loop, shared by the text and the voice client.
 *
 * One job: the student's words in; the tutor's words streamed into the
 * transcript (and, sentence by sentence, to whoever speaks them); painted tool
 * calls to the whiteboard; the next state kept for the following turn. It
 * holds no audio and no lesson policy.
 */
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
    const session: V2ClientSession = {
      studentName: p.current.studentName, subject: p.current.subject, level: p.current.level, mode: p.current.mode,
      ...(p.current.sessionMaxMinutes ? { timeBoxMinutes: p.current.sessionMaxMinutes } : {}),
      ...(p.current.lessonPlanId ? { lessonPlanId: p.current.lessonPlanId } : {}),
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
          // A sketch is drawn by its own service from the one-line description; the request starts now and the
          // item goes up when both its sentence and its drawing have arrived. No drawing: a labelled card instead.
          const drawn: Promise<void> = cmd && (cmd as { action?: string }).action === 'showSketch' ? resolveSketch(cmd as unknown as SketchCommand, p.current.embedToken, (m) => p.current.onDebugEvent?.('v2_sketch', m)) : Promise.resolve();
          if (cmd) { const paint = () => { void drawn.then(() => p.current.onWhiteboardCommand(call.replaces ? [{ action: 'removeItems', ids: [call.replaces] } as unknown as WhiteboardCommand, cmd] : [cmd])); }; if (p.current.holdBoard) p.current.holdBoard(call, paint); else paint(); }
          if (text && !/\n\n$/.test(text)) text += '\n\n';
        },
      });
      letGo(); speak(sentences.flush());
      stateRef.current = done.state;
      setTutor(done.spoken || text.trim(), false, settled.some((c) => c.name === 'show_problem' && /^painted/.test(c.outcome)));
      p.current.onBrainUsage?.(done.usage);
      p.current.onDebugEvent?.('brain_turn', `Brain ${done.totalMs}ms · first_sentence=${done.firstTextMs ?? done.totalMs}ms · in=${done.usage.inputTokens} out=${done.usage.outputTokens} cr=${done.usage.cacheReadTokens} cc=${done.usage.cacheCreationTokens} · v2`);
      if (done.state.closed) {
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
        p.current.onDebugEvent?.('turn_cut_v2', `${text.trim().split(/\s+/).filter(Boolean).length} words kept, ${settled.length} tool call(s)`);
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
  const hardStopRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const armHardStop = useCallback(() => {
    const minutes = p.current.sessionMaxMinutes;
    if (!minutes || hardStopRef.current) return;
    hardStopRef.current = setTimeout(() => {
      if (endingRef.current) return;
      endingRef.current = true;
      abortRef.current?.abort();
      p.current.onCut?.();
      p.current.onDebugEvent?.('time_limit_v2', `${minutes} min`);
      p.current.onEndSession?.('time_limit');
    }, minutes * 60000);
  }, []);
  useEffect(() => () => { if (hardStopRef.current) clearTimeout(hardStopRef.current); }, []);

  const open = useCallback(() => {
    if (openedRef.current) return;
    openedRef.current = true;
    armHardStop();
    p.current.onSessionStarted?.();
    p.current.onDebugEvent?.('start_v2', `tutor opens (${p.current.mode})`);
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
  const end = useCallback(() => { endingRef.current = true; abortRef.current?.abort(); p.current.onEndSession?.(); }, []);
  const isEnding = useCallback(() => endingRef.current, []);

  return { send, open, nudge, end, abort, isEnding, busy, closed, openedRef, stateRef };
}
