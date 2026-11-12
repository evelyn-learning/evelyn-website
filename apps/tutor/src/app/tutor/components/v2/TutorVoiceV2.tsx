'use client';
/**
 * Tutor brain v2 — the session client for VOICE sessions (design §4.8). FIRST CUT.
 *
 * Audio is the existing hook (useOpenAIRealtime in relay mode): it owns the
 * microphone, speech recognition, the speech queue and playback, exactly as it
 * does for v1. This file joins it to the v2 turn loop:
 *   student's words (recognised or typed)  → a turn
 *   each finished sentence of the reply     → the speech queue
 *   the student speaking over the tutor     → pause, then stop speaking and answer them
 *   a long silence                          → a turn that says the student is silent
 *
 * The student is heard through the recogniser hook (Cartesia Ink or the
 * Whisper socket, the same choice v1 makes): useOpenAIRealtime plays speech
 * but does not transcribe.
 *
 * EVERY callback handed to useOpenAIRealtime must keep its identity across
 * renders. The hook's unmount clean-up depends on them, so a fresh function
 * makes it disconnect on every render: the socket dies, the playback queue is
 * reset mid-sentence and chunks play on top of each other (Praveen's first
 * microphone session, embed-1794326349532: garbled voice, tutor deaf).
 *
 * NOT carried over from VoiceTutorRealtime yet (see the inventory,
 * docs/superpowers/specs/2026-11-09-vtr-non-teaching-inventory.md): the
 * sustained-energy barge-in gate, fillers, session recording, mic re-acquire
 * and the mute button, caption sync, resume, standby and host video.
 */
import { useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject, type ReactNode } from 'react';
import { useOpenAIRealtime, type OpenAIVoice } from '@/app/tutor/hooks/useOpenAIRealtime';
import { usePerceptionWS, type PerceptionTranscript } from '@/app/tutor/hooks/usePerceptionWS';
import { useCartesiaInkWS } from '@/app/tutor/hooks/useCartesiaInkWS';
import { TUTOR_STT_ENGINE_INK2 } from '@/lib/tutor/orchestrator/flags';
import { inkTurnEndTimeoutMs } from '@/lib/tutor/voice/ink-turn-end';
import type { RealtimeHandle } from '@/lib/tutor/orchestrator/types';
import type { WhiteboardCommand } from '@core/knowledge/types';
import { V2Composer, V2_HANDLE_STUBS } from './TutorClientV2';
import { V2FlagBar, V2_FLAGS_ON, type V2FlagState } from './V2FlagBar';
import { useV2Turns, type V2TurnsConfig } from './useV2Turns';
import { isOwnVoice } from '@/lib/tutor/v2/own-voice';
import { anchorSentenceIndex, asksAnywhere, inlineSentenceIndex } from '@/lib/tutor/v2/board-timing';
import { summariseBoardCall } from '@/lib/tutor/v2/board';
import { V2_NO_ASK_RECHECK_S } from '@/lib/tutor/v2/facts';
import { speakBonds, speakCoefficientLetters, speakDataRuns, speakFormulas, speakNumberPlurals, speakSlashes } from '@/lib/tutor/voice/tts-pronunciation';
import { cueStop, cueTick, cueTurnAccepted, initialThinkingCue } from '@/lib/tutor/voice/thinking-cue';
import { playThinkingPulse, playTurnChime, primeThinkingCueAudio } from '@/lib/tutor/voice/thinking-cue-audio';

export interface TutorVoiceV2Props extends Omit<V2TurnsConfig, 'mode' | 'onSentence' | 'onCut' | 'closeDelayMs'> {
  voice?: OpenAIVoice;
  ttsProvider?: 'realtime' | 'openai-mini' | 'cartesia' | 'silent';
  cartesiaVoiceId?: string;
  cartesiaVoiceSpeed?: number;
  speechRate?: number;
  tutorLanguages?: string[];
  standby?: boolean;
  /** The audible "got that, thinking" cue (a chime when a turn is accepted, soft pulses if the reply takes long). */
  thinkingCue?: boolean;
  composerSlot?: ReactNode;
  handleRef?: MutableRefObject<RealtimeHandle | null>;
  onVoiceStateChange?: (state: 'idle' | 'listening' | 'hearing' | 'processing' | 'thinking' | 'speaking' | 'muted' | 'manual-held' | 'error') => void;
}

/** The recogniser session only transcribes; it must never answer by itself. */
const TRANSPORT_ONLY = 'You are a voice transport layer, not a tutor or assistant. NEVER author your own response. If you receive a response.create with no explicit read-aloud instructions, output silence. When you do receive read-aloud instructions, read the supplied text verbatim. Do not call tools.';
/** Seconds of silence after the tutor stops speaking before it speaks again unprompted; then once more, later.
 *  Long on purpose: a student working a problem is silent, and a check-in after 25 s talked over their thinking
 *  (browser smoke run, 2026-11-09). */
const SILENCE_STEPS_S = [75, 120];
/** A pause taken when the student seems to be speaking is lifted after this long if no words arrive. */
const PAUSE_GIVE_UP_MS = 8000;
/** The microphone must have been quiet this long before a silence counts as silence. */
const QUIET_MIC_MS = 20000;
/** After a reply of silence, how long before the tutor is told the student has said nothing more. */
const WAITED_RECHECK_S = 7;
/** After a reply that asked nothing: how long after it finishes speaking before the tutor is told of the silence. */
const NO_ASK_RECHECK_S = V2_NO_ASK_RECHECK_S;
const MIC_SOUND_LEVEL = 0.12;
/** A held board item is painted after this long whatever the voice is doing. */
const BOARD_HOLD_MAX_MS = 45000;

export default function TutorVoiceV2(props: TutorVoiceV2Props) {
  const p = useRef(props); p.current = props;
  const spokenRef = useRef<string[]>([]);
  const startedRef = useRef(false);
  const [started, setStarted] = useState(false);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // A tester's flag is open (V2FlagBar, local development only): the tutor is paused and what is heard is a note.
  const flagRef = useRef<V2FlagState>({ active: false, words: [] });
  // Board timing (board-timing.ts): the sentences of the running reply as sent to the voice, how many have
  // started playing, and the board items waiting for theirs.
  const lastSoundAtRef = useRef(0);
  const lastTurnWasStudentRef = useRef(false);
  const openingTurnRef = useRef(true);
  const paintedThisTurnRef = useRef<Array<{ id: string; tool: string; summary: string }>>([]);
  const shownThenWithdrawnRef = useRef<Array<{ id: string; tool: string; summary: string }>>([]);
  const turnSentencesRef = useRef<string[]>([]);
  const startedCountRef = useRef(0);
  const heldBoardRef = useRef<Array<{ idx: number; id?: string; what?: string; untilDone?: boolean; isPage?: boolean; paint: () => void; timer: ReturnType<typeof setTimeout> }>>([]);
  const turnBusyRef = useRef(false);
  const paintFnsRef = useRef(new Map<string, () => void>());
  const unplacedBoardRef = useRef<Array<{ call: { id?: string; name: string; sayWith?: string; beforeTurn?: boolean; args?: Record<string, unknown> }; paint: () => void }>>([]);
  // Inline items: where the current stretch of speech began (the sentence count at the previous block).
  const segStartRef = useRef(0); const lastBlockAtRef = useRef(-1);
  // Where the paragraph being spoken began: working, a figure or a table goes with the paragraph it is written after.
  const paraStartRef = useRef(0); const pageTurnAtRef = useRef(0);
  /** Match waiting board items to the sentences known so far. `final`: no more sentences are coming. */
  const placeBoard = useCallback((final?: boolean) => {
    const still: typeof unplacedBoardRef.current = [];
    for (const u of unplacedBoardRef.current) {
      let idx = anchorSentenceIndex(u.call.sayWith, turnSentencesRef.current);
      // The quoted words are not in the reply: go by what the item is about, as for an inline item.
      if (idx < 0 && final) idx = turnSentencesRef.current.length ? inlineSentenceIndex(u.call.name === 'show_problem' ? 'show_problem' : 'other', summariseBoardCall(u.call.name, u.call.args ?? {}), turnSentencesRef.current, 0) : -1;
      // For words said before the reply turned the page: it goes up at once, on the page still in view.
      if (u.call.beforeTurn) { p.current.onDebugEvent?.('v2_board_timing', `${u.call.name}: belongs before the page turn — now`); u.paint(); continue; }
      if (idx < 0 && !final) { still.push(u); continue; }
      // Nothing is written on a new page before the page is turned (a parabola's graph went up on the circle's
      // page, and its note on the next, conic sections 2026-11-11).
      const pageHeld = heldBoardRef.current.some((h) => h.isPage);
      if (idx >= 0) idx = Math.max(idx, pageTurnAtRef.current);
      const hold = ((idx > 0 && startedCountRef.current <= idx) || pageHeld) && !openingTurnRef.current;
      p.current.onDebugEvent?.('v2_board_timing', `${u.call.name}: ${idx < 0 ? 'its sentence was not found' : `sentence ${idx + 1} of ${turnSentencesRef.current.length}`}, ${startedCountRef.current} started — ${hold ? 'held' : 'now'}`);
      if (!hold) { u.paint(); continue; }
      const entry = { idx, id: u.call.id, what: `${u.call.name}: ${summariseBoardCall(u.call.name, u.call.args ?? {}).slice(0, 80)}`, paint: u.paint, timer: setTimeout(() => { heldBoardRef.current = heldBoardRef.current.filter((h) => h !== entry); u.paint(); }, BOARD_HOLD_MAX_MS) };
      heldBoardRef.current.push(entry);
    }
    unplacedBoardRef.current = still;
  }, []);
  const releaseBoard = useCallback((upTo?: number) => {
    if (upTo === undefined) placeBoard(true);
    const keep: typeof heldBoardRef.current = [];
    let behindPage = false;
    for (const h of heldBoardRef.current) {
      // What comes after a page that is still waiting waits with it.
      if (behindPage && upTo !== undefined) { keep.push(h); continue; }
      // A problem card waits for the reply to be complete (see holdBoard): what the check adds for the answer
      // before it must go up first.
      if (upTo === undefined || (h.idx < upTo && !(h.untilDone && turnBusyRef.current))) { clearTimeout(h.timer); h.paint(); } else { keep.push(h); if (h.isPage) behindPage = true; }
    }
    heldBoardRef.current = keep;
  }, []);
  /** The student took the floor: what the tutor had not reached yet is never shown (a hint appeared after the
   *  student had already given the step it hinted at, embed-1794347950566). The tutor's record of the board
   *  is corrected, and it is told next turn what did not appear. */
  const dropBoard = useCallback(() => {
    // A problem card is the task the reply set, and the tutor's record of the lesson says it was set. Dropped
    // because the student spoke first, it left the tutor saying "try the pH problem on the board" over a board
    // with no problem on it (chemistry, embed-1794447993778). It goes up; everything else unreached is dropped.
    const kept = heldBoardRef.current.filter((h) => /^show_problem:/.test(h.what ?? ''));
    const lost = [...heldBoardRef.current.filter((h) => !kept.includes(h)).map((h) => ({ id: h.id, what: h.what })), ...unplacedBoardRef.current.map((u) => ({ id: u.call.id, what: `${u.call.name}: ${summariseBoardCall(u.call.name, u.call.args ?? {}).slice(0, 80)}` }))];
    for (const h of heldBoardRef.current) clearTimeout(h.timer);
    for (const h of kept) h.paint();
    heldBoardRef.current = []; unplacedBoardRef.current = [];
    if (!lost.length) return;
    p.current.onDebugEvent?.('v2_board_dropped', `${lost.length} item(s) the tutor had not reached: ${lost.map((x) => x.what).join(' | ').slice(0, 200)}`);
    const state = turnsRef.current?.stateRef.current;
    if (!state) return;
    const ids = new Set(lost.map((x) => x.id).filter(Boolean));
    for (const page of state.board.pages) page.items = page.items.filter((it) => !ids.has(it.id));
    state.boardProblems = [...(state.boardProblems ?? []), ...lost.map((x) => `${x.what ?? 'an item'}: the student spoke before you reached it, so it was NEVER shown and they have not seen it. It is not on the board and is not an open task`)];
  }, []);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const silenceStepRef = useRef(0);
  const realtimeRef = useRef<ReturnType<typeof useOpenAIRealtime> | null>(null);
  const turnsRef = useRef<ReturnType<typeof useV2Turns> | null>(null);

  // Thinking cue: the same chime and pulse as v1 (lib/tutor/voice/thinking-cue.ts). v2 thinks before it
  // speaks, so the student hears at once that they were heard.
  const cueRef = useRef(initialThinkingCue());
  const waitingRef = useRef(false);
  const play = (sound: 'chime' | 'pulse' | null) => { if (sound === 'chime') playTurnChime(); else if (sound === 'pulse') playThinkingPulse(); };
  useEffect(() => {
    if (!props.thinkingCue) return;
    const id = setInterval(() => {
      const r = cueTick(cueRef.current, waitingRef.current ? 'thinking' : 'speaking', Date.now());
      cueRef.current = r.state; play(r.play);
    }, 300);
    return () => clearInterval(id);
  }, [props.thinkingCue]);

  const soonAfterSpeechRef = useRef<number | undefined>(undefined);
  const clearSilence = () => { if (silenceTimerRef.current) { clearTimeout(silenceTimerRef.current); silenceTimerRef.current = null; } };
  const armSilence = useCallback((soonS?: number) => {
    clearSilence();
    const wait = soonS ?? SILENCE_STEPS_S[silenceStepRef.current];
    if (wait === undefined) return;
    silenceTimerRef.current = setTimeout(() => {
      const rt = realtimeRef.current; const turns = turnsRef.current;
      if (!rt || !turns || turns.isEnding()) return;
      if (rt.isSpeechPending() || flagRef.current.active) { armSilence(soonS); return; }
      // A student murmuring through a problem is not silent, even when no words were recognised.
      if (Date.now() - lastSoundAtRef.current < Math.min(QUIET_MIC_MS, wait * 500)) { armSilence(soonS); return; }
      if (!soonS) silenceStepRef.current += 1;
      p.current.onDebugEvent?.('idle_nudge_v2', `${wait}s of silence`);
      turns.nudge(wait);
    }, wait * 1000);
  }, []);

  const turns = useV2Turns({
    ...props,
    mode: 'voice',
    onSentence: (sentence, startsParagraph) => { if (startsParagraph || !turnSentencesRef.current.length) paraStartRef.current = turnSentencesRef.current.length; turnSentencesRef.current.push(sentence); placeBoard(); waitingRef.current = false; cueRef.current = cueStop(); spokenRef.current = [...spokenRef.current.slice(-7), sentence]; realtimeRef.current?.speakText(sentence); },
    onCut: () => { void realtimeRef.current?.clearSpeechQueue(); dropBoard(); },
    onBoardWithdraw: (id) => {
      const held = heldBoardRef.current.find((h) => h.id === id);
      if (held) { clearTimeout(held.timer); heldBoardRef.current = heldBoardRef.current.filter((h) => h !== held); }
      unplacedBoardRef.current = unplacedBoardRef.current.filter((u) => u.call.id !== id);
      const shown = held ? undefined : paintedThisTurnRef.current.find((x) => x.id === id);
      if (shown) shownThenWithdrawnRef.current.push(shown);
      p.current.onDebugEvent?.('v2_board_withdrawn', held ? `${held.what ?? id}: withdrawn before it was shown` : `${shown?.summary.slice(0, 80) ?? id}: withdrawn, but it had already been shown`);
    },
    holdBoard: (call, paintNow) => {
      const paint = () => { paintedThisTurnRef.current.push({ id: call.id, tool: call.name, summary: summariseBoardCall(call.name, call.args) }); paintNow(); };
      paintFnsRef.current.set(call.id, paint);
      // Items written just before this page turn, with no words between, belong on the new page (turn.ts): those
      // still waiting go behind the page; one already up is taken down and put up again after the turn.
      const carried: Array<() => void> = [];
      for (const id of call.name === 'new_page' ? call.carries ?? [] : []) {
        const waiting = heldBoardRef.current.find((h) => h.id === id);
        if (waiting) { clearTimeout(waiting.timer); heldBoardRef.current = heldBoardRef.current.filter((h) => h !== waiting); carried.push(waiting.paint); continue; }
        const again = paintFnsRef.current.get(id);
        if (again && paintedThisTurnRef.current.some((x) => x.id === id)) { paintedThisTurnRef.current = paintedThisTurnRef.current.filter((x) => x.id !== id); p.current.onWhiteboardCommand([{ action: 'removeItems', ids: [id] } as unknown as WhiteboardCommand]); carried.push(again); }
      }
      if (carried.length) p.current.onDebugEvent?.('v2_board_timing', `new_page: carries ${carried.length} item(s) written just before it`);
      const carryBehind = (idx: number, painted: boolean) => { for (const fn of carried) { if (painted) fn(); else { const e = { idx, id: undefined as string | undefined, what: 'carried to the new page', paint: fn, timer: setTimeout(() => { heldBoardRef.current = heldBoardRef.current.filter((h) => h !== e); fn(); }, BOARD_HOLD_MAX_MS) }; heldBoardRef.current.push(e); } } };
      // Written inline in the reply, right after the sentence that introduces it ("Here's the rule." [block]):
      // it appears as that sentence begins. The model places blocks after their sentence far more often than
      // before, whatever it is told (browser run, 2026-11-10), so the convention follows the habit.
      if (call.inline && realtimeRef.current) {
        const n = turnSentencesRef.current.length;
        // Blocks with no words between them share one stretch of speech.
        if (n !== lastBlockAtRef.current) { segStartRef.current = Math.max(0, lastBlockAtRef.current); lastBlockAtRef.current = n; }
        // A reply often opens with a paragraph on the last answer and then a paragraph on the next thing, with the
        // blocks for it at the end: the table for "Next is the Valladolid debate…" appeared under "Yes, both right"
        // (embed-1794416183291). An item that is not a problem starts with the paragraph it follows.
        const from = call.name === 'show_problem' ? segStartRef.current : Math.max(segStartRef.current, Math.min(paraStartRef.current, Math.max(0, n - 1)));
        // Nothing written on a page appears before the page is turned.
        const idx = Math.max(call.name === 'new_page' ? 0 : pageTurnAtRef.current, inlineSentenceIndex(call.name, summariseBoardCall(call.name, call.args), turnSentencesRef.current, from));
        if (call.name === 'new_page') pageTurnAtRef.current = idx;
        // The opening reply: nothing waits. A session must not begin on a bare board (embed-1794362141944).
        // The next problem is not shown until the whole reply is in, the check's additions included: the note
        // "Center (3, −2), radius 5: correct" came up underneath the problem that followed it (conic sections,
        // 2026-11-11). The card's sentence is near the end of the reply, so this rarely costs any time.
        // A page turn waits for the complete reply too: what the check adds for the answer before it goes on
        // the old page first. Whatever follows a waiting page waits behind it.
        const untilDone = (call.name === 'show_problem' || call.name === 'new_page') && turnBusyRef.current && !openingTurnRef.current;
        const pageHeld = heldBoardRef.current.some((h) => h.isPage);
        const hold = (startedCountRef.current <= idx && n > 0 && !openingTurnRef.current) || untilDone || (pageHeld && !openingTurnRef.current);
        p.current.onDebugEvent?.('v2_board_timing', `${call.name}: inline, with sentence ${idx + 1} of ${n} (stretch from ${from + 1}), ${startedCountRef.current} started — ${hold ? 'held' : 'now'}`);
        if (!hold) { paint(); carryBehind(idx, true); return; }
        const entry = { idx, id: call.id, what: `${call.name}: ${summariseBoardCall(call.name, call.args).slice(0, 80)}`, untilDone, isPage: call.name === 'new_page', paint, timer: setTimeout(() => { heldBoardRef.current = heldBoardRef.current.filter((h) => h !== entry); paint(); }, BOARD_HOLD_MAX_MS) };
        heldBoardRef.current.push(entry);
        carryBehind(idx, false);
        return;
      }
      if (!call.sayWith || !realtimeRef.current) { paint(); carryBehind(0, true); return; }
      // Its sentence may not have been written yet (the model can call the tool first and speak after):
      // wait for it, and place the item as soon as the sentence is known.
      unplacedBoardRef.current.push({ call, paint });
      placeBoard();
    },
    onTutorBusy: (busy) => {
      props.onTutorBusy?.(busy);
      turnBusyRef.current = busy;
      if (busy) { releaseBoard(); paintedThisTurnRef.current = []; paintFnsRef.current.clear(); turnSentencesRef.current = []; startedCountRef.current = 0; segStartRef.current = 0; paraStartRef.current = 0; pageTurnAtRef.current = 0; lastBlockAtRef.current = -1; clearSilence(); waitingRef.current = true; realtimeRef.current?.signalBrainThinking(true); p.current.onVoiceStateChange?.('thinking'); }
      else { waitingRef.current = false; cueRef.current = cueStop(); realtimeRef.current?.signalBrainThinking(false); placeBoard(true); if (!realtimeRef.current?.isSpeechPending()) releaseBoard(); else releaseBoard(startedCountRef.current);
        // The tutor chose to say nothing and wait (keep_listening). If the student was in fact finished, it finds out soon.
        const silentReply = turnSentencesRef.current.length === 0 && !turnsRef.current?.isEnding();
        // Nothing will be spoken, so no playback event will move the indicator off "Thinking…".
        if (silentReply && !realtimeRef.current?.isSpeechPending()) p.current.onVoiceStateChange?.('listening');
        // One early recheck, and only when the silence answered the student's own words: a silent answer
        // to a silence check-in goes back to the ordinary schedule (it looped every 12 s, embed-1794339843244).
        const recheck = silentReply && lastTurnWasStudentRef.current;
        // A reply that asked the student nothing leaves them not knowing whose move it is (the tutor made a
        // statement and waited 44 s, embed-1794355900794). It learns of the silence early, once, and can go on.
        const said = turnSentencesRef.current;
        const noAsk = !silentReply && (lastTurnWasStudentRef.current || openingTurnRef.current) && said.length > 0 && !asksAnywhere(said) && !turnsRef.current?.isEnding() && !turnsRef.current?.closed;
        lastTurnWasStudentRef.current = false;
        // The opening is the first reply only. Left on until the student spoke, a second reply before that put its
        // whole page up at once, a note, a formula and a problem together (AP Calc BC, embed-1794446765164).
        if (said.length > 0) openingTurnRef.current = false;
        // Board items the check withdrew after they were already on the board are still there: put them back in the tutor's record.
        const state = turnsRef.current?.stateRef.current;
        if (state && shownThenWithdrawnRef.current.length) {
          if (state.board.current < 0) { state.board.pages.push({ title: 'Page 1', items: [] }); state.board.current = 0; }
          for (const it of shownThenWithdrawnRef.current) if (!state.board.pages.some((pg) => pg.items.some((x) => x.id === it.id))) state.board.pages[state.board.current].items.push(it);
        }
        shownThenWithdrawnRef.current = [];
        soonAfterSpeechRef.current = recheck ? WAITED_RECHECK_S : noAsk ? NO_ASK_RECHECK_S : undefined;
        armSilence(soonAfterSpeechRef.current); }
    },
    // The session ends once the closing words have been spoken.
    closeDelayMs: async () => {
      const end = Date.now() + 60000;
      while (Date.now() < end && realtimeRef.current?.isSpeechPending()) await new Promise((r) => setTimeout(r, 300));
      await new Promise((r) => setTimeout(r, 1200));
    },
  });
  turnsRef.current = turns;

  // Pause-first: when words that are not the tutor's own start arriving, the tutor stops mid-sentence
  // without losing its place; the finished transcript then either cuts it (a real turn) or lets it go on.
  const liftPause = useCallback(() => {
    if (pauseTimerRef.current) { clearTimeout(pauseTimerRef.current); pauseTimerRef.current = null; }
    realtimeRef.current?.resumeSpeech();
  }, []);
  const hearingPartial = useCallback((text: string) => {
    const rt = realtimeRef.current;
    if (!rt?.isSpeechPending() || pauseTimerRef.current || flagRef.current.active) return;
    // Pause on the first words that are not the tutor's own (every word of an echo is in what it just said).
    if (!text.trim() || isOwnVoice(text, spokenRef.current, 1, 1)) return;
    if (rt.pauseSpeech()) {
      p.current.onDebugEvent?.('v2_bargein_pause', text.slice(0, 80));
      pauseTimerRef.current = setTimeout(() => { pauseTimerRef.current = null; realtimeRef.current?.resumeSpeech(); }, PAUSE_GIVE_UP_MS);
    }
  }, []);

  const heard = useCallback((transcript: string, opts?: { typed?: boolean }) => {
    const text = transcript.trim();
    if (!text) return;
    if (flagRef.current.active) { flagRef.current.words.push(text); return; }
    // The microphone hears the tutor too. Words that are the tutor's own, arriving while it speaks, are not the student.
    if (!opts?.typed && realtimeRef.current?.isSpeechPending() && isOwnVoice(text, spokenRef.current)) {
      p.current.onDebugEvent?.('v2_own_voice_dropped', text.slice(0, 80));
      liftPause();
      return;
    }
    if (pauseTimerRef.current) { clearTimeout(pauseTimerRef.current); pauseTimerRef.current = null; }
    // The student has taken the floor: whatever the tutor still had queued or paused is dropped, whether or
    // not a reply is still streaming. Clearing also restarts a paused playback clock; without it the next
    // reply queued behind a paused sentence and was never heard (embed-1794328944377, "you seem to have got stuck").
    if (realtimeRef.current?.isSpeechPending()) {
      p.current.onDebugEvent?.('v2_bargein', opts?.typed ? 'typed over the tutor' : 'spoke over the tutor');
      void realtimeRef.current.clearSpeechQueue();
    }
    dropBoard();
    realtimeRef.current?.resumeSpeech();
    silenceStepRef.current = 0;
    if (p.current.thinkingCue) { const r = cueTurnAccepted(cueRef.current, Date.now()); cueRef.current = r.state; play(r.play); }
    lastTurnWasStudentRef.current = true; openingTurnRef.current = false;
    turnsRef.current?.send(text);
  }, [liftPause, dropBoard]);

  // Stable identities, all of them: see the note at the top of this file.
  const onRealtimeError = useCallback((err: Error) => p.current.onError?.(err), []);
  const onRealtimeState = useCallback((state: string) => {
    if (state === 'speaking') p.current.onVoiceStateChange?.('speaking');
    else if (state === 'listening' || state === 'connected') p.current.onVoiceStateChange?.(turnsRef.current?.busy ? 'thinking' : 'listening');
    else if (state === 'error') p.current.onVoiceStateChange?.('error');
  }, []);
  const onPlayback = useCallback((event: string) => {
    // A sentence has begun playing: board items anchored to it (or to an earlier one) appear now.
    if (event === 'sentence-start') { startedCountRef.current += 1; releaseBoard(startedCountRef.current); if (flagRef.current.active) realtimeRef.current?.pauseSpeech(); }
    // The wait chosen when the reply ended (a short one after a reply with no question) still stands once its
    // speech has finished: arming the plain 75 s here threw the short wait away, and a tutor who had stopped
    // without a question sat silent (embed-1794374818774, embed-1794376295543).
    if (event === 'drain') { if (!turnsRef.current?.busy) { releaseBoard(); armSilence(soonAfterSpeechRef.current); } }
  }, [armSilence, releaseBoard]);
  const onRelayTranscript = useCallback((transcript: string, opts?: { typed?: boolean }) => heard(transcript, opts), [heard]);
  const languagesKey = (props.tutorLanguages ?? []).join(',');
  const scienceSpeech = useCallback((sentence: string, rewrite: (s: string) => string) => rewrite(speakFormulas(speakBonds(speakSlashes(speakNumberPlurals(speakDataRuns(sentence)))))), []);
  const mathsSpeech = useCallback((sentence: string, rewrite: (s: string) => string) => rewrite(speakCoefficientLetters(speakSlashes(speakNumberPlurals(speakDataRuns(sentence))))), []);
  const plainSpeech = useCallback((sentence: string, rewrite: (s: string) => string) => rewrite(speakSlashes(speakNumberPlurals(speakDataRuns(sentence)))), []);
  const relayMode = useMemo(() => ({
    instructions: TRANSPORT_ONLY,
    onUserTranscript: onRelayTranscript,
    ttsProvider: props.ttsProvider,
    cartesiaVoiceId: props.cartesiaVoiceId,
    cartesiaVoiceSpeed: props.cartesiaVoiceSpeed,
    ...(languagesKey ? { tutorLanguages: languagesKey.split(',') } : {}),
    ...(props.speechRate !== undefined ? { speechRate: props.speechRate } : {}),
    studentName: props.studentName,
    ...(props.subject === 'math' ? { ttsTextTransform: mathsSpeech } : props.subject === 'science' ? { ttsTextTransform: scienceSpeech } : { ttsTextTransform: plainSpeech }),
  }), [onRelayTranscript, props.subject, props.ttsProvider, props.cartesiaVoiceId, props.cartesiaVoiceSpeed, languagesKey, props.speechRate, props.studentName]);
  const realtime = useOpenAIRealtime({
    instructions: TRANSPORT_ONLY,
    voice: props.voice,
    reconnectEnabled: true,
    embedToken: props.embedToken,
    relayMode,
    onError: onRealtimeError,
    onStateChange: onRealtimeState,
    onTtsPlaybackProgress: onPlayback,
  });
  realtimeRef.current = realtime;

  // The student's voice. Exactly one recogniser owns the microphone, chosen as v1 chooses it.
  const listening = started && realtime.isConnected && !props.standby && !turns.closed;
  const onTranscript = useCallback((t: PerceptionTranscript) => heard(t.text), [heard]);
  const onPartial = useCallback((x: { text: string }) => hearingPartial(x.text), [hearingPartial]);
  const onSpeechStart = useCallback(() => { if (flagRef.current.active) return; clearSilence(); if (!realtimeRef.current?.isSpeechPending()) p.current.onVoiceStateChange?.('hearing'); }, []);
  const onSpeechStop = useCallback(() => { if (flagRef.current.active) return; if (!realtimeRef.current?.isSpeechPending() && !turnsRef.current?.busy) p.current.onVoiceStateChange?.('processing'); }, []);
  const onNoTranscript = useCallback((kind: string | undefined) => {
    p.current.onDebugEvent?.('v2_transcription_failed', String(kind ?? 'unknown'));
    if (flagRef.current.active) return;
    liftPause();
    if (!realtimeRef.current?.isSpeechPending() && !turnsRef.current?.busy) { p.current.onVoiceStateChange?.('listening'); armSilence(); }
  }, [liftPause, armSilence]);
  const onRecogniserError = useCallback((err: Error) => p.current.onDebugEvent?.('v2_recogniser_error', err.message.slice(0, 160)), []);
  const onMicLevel = useCallback((level: number) => { if (level > MIC_SOUND_LEVEL) lastSoundAtRef.current = Date.now(); }, []);
  const onInkDiagnostic = useCallback((type: string, message: string) => p.current.onDebugEvent?.(type, message), []);
  usePerceptionWS({
    enabled: listening && !TUTOR_STT_ENGINE_INK2,
    onTranscript, onSpeechStart, onSpeechStop, onMicLevel, onTranscriptionFailed: onNoTranscript, onError: onRecogniserError,
  });
  useCartesiaInkWS({
    enabled: listening && TUTOR_STT_ENGINE_INK2,
    turnEndTimeoutMs: inkTurnEndTimeoutMs(props.tutorLanguages),
    onTranscript, onPartialTranscript: onPartial, onSpeechStart, onSpeechStop, onMicLevel, onTranscriptionFailed: onNoTranscript, onError: onRecogniserError,
    onDiagnostic: onInkDiagnostic,
  });

  // Start needs a tap: browsers only release audio to a page after a gesture.
  const start = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    setStarted(true);
    const rt = realtimeRef.current!;
    rt.unlockAudio();
    if (p.current.thinkingCue) primeThinkingCueAudio();
    void rt.connect().then(() => { rt.startListening(); }).catch((err) => p.current.onError?.(err instanceof Error ? err : new Error(String(err))));
    // The tutor's first words do not wait for the microphone.
    turnsRef.current?.open();
  }, []);

  useEffect(() => () => { releaseBoard(); clearSilence(); if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current); turnsRef.current?.abort(); realtimeRef.current?.disconnect(); }, []);

  useEffect(() => {
    const ref = props.handleRef;
    if (!ref) return;
    ref.current = {
      ...V2_HANDLE_STUBS,
      startSession: start,
      sendTextMessage: (text) => { if (!startedRef.current) start(); heard(text, { typed: true }); },
      speakText: (text) => realtimeRef.current?.speakText(text),
      stopSpeaking: () => { void realtimeRef.current?.clearSpeechQueue(); },
      setTutorVoiceMuted: (muted) => realtimeRef.current?.setVoiceMuted(muted),
      endSession: () => { clearSilence(); void realtimeRef.current?.clearSpeechQueue(); turnsRef.current?.end(); },
      isEnding: () => turnsRef.current?.isEnding() ?? false,
    };
    return () => { ref.current = null; };
  }, [props.handleRef, start, heard]);

  const flagSession = useMemo(() => {
    try { return String(JSON.parse(atob((props.embedToken ?? '').split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))).student_id || 'session'); } catch { return 'session'; }
  }, [props.embedToken]);
  const flagSnapshot = useCallback(() => {
    const state = turnsRef.current?.stateRef.current;
    const text = (m: { content: unknown } | undefined) => !m ? '' : typeof m.content === 'string' ? m.content : (m.content as Array<{ type: string; text?: string }>).filter((b) => b.type === 'text').map((b) => b.text).join(' ');
    const last = (role: string) => text([...(state?.history ?? [])].reverse().find((m) => m.role === role));
    return {
      turns: state?.history.length ?? 0,
      minutesIn: state ? Math.round((Date.now() - state.startedAtMs) / 6000) / 10 : 0,
      tutorBusy: !!turnsRef.current?.busy,
      // The reply being spoken when the flag was raised: every sentence sent to the voice, and how many had begun.
      speaking: { sentences: turnSentencesRef.current, begun: startedCountRef.current },
      lastStudent: last('user').slice(-600), lastTutor: last('assistant').slice(-1500),
      boardWaiting: heldBoardRef.current.map((h) => h.what),
      board: state?.board,
    };
  }, []);
  const flagStart = useCallback(() => { clearSilence(); realtimeRef.current?.pauseSpeech(); p.current.onDebugEvent?.('v2_flag', 'opened'); }, []);
  const flagStop = useCallback(() => {
    p.current.onDebugEvent?.('v2_flag', 'closed');
    realtimeRef.current?.resumeSpeech();
    // Closing a flag starts nothing: the lesson is where it was. The indicator goes back to what is true now
    // (it showed "Thinking…" after a flag, as if the note had been taken for an answer).
    if (!realtimeRef.current?.isSpeechPending() && !turnsRef.current?.busy) { p.current.onVoiceStateChange?.('listening'); armSilence(soonAfterSpeechRef.current); }
  }, [armSilence]);

  return (<>
    {V2_FLAGS_ON && started && <V2FlagBar session={flagSession} flagRef={flagRef} snapshot={flagSnapshot} onStart={flagStart} onStop={flagStop} />}
    <V2Composer
      composerSlot={props.composerSlot}
      closed={turns.closed}
      busy={turns.busy}
      onSend={(text) => { if (!startedRef.current) start(); heard(text, { typed: true }); }}
      placeholder="Type here if you can't speak…"
    />
  </>);
}
