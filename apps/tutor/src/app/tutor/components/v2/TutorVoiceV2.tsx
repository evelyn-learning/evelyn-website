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
 * Carried over from VoiceTutorRealtime: a sound pauses the tutor only past the
 * energy gate (v2/sound-gate.ts), the microphone is opened again when the
 * device changes (v2/mic-watch.ts), and the caption follows the voice
 * (v2/captions.ts). NOT carried over yet (see the inventory,
 * docs/superpowers/specs/2026-11-09-vtr-non-teaching-inventory.md): fillers,
 * the mute button, standby and host video.
 */
import { useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject, type ReactNode } from 'react';
import { useOpenAIRealtime, type OpenAIVoice } from '@/app/tutor/hooks/useOpenAIRealtime';
import { usePerceptionWS, type PerceptionTranscript } from '@/app/tutor/hooks/usePerceptionWS';
import { useCartesiaInkWS } from '@/app/tutor/hooks/useCartesiaInkWS';
import { useAudioRecorder } from '@/app/tutor/hooks/useAudioRecorder';
import { BARGEIN_GATE_POLL_MS, TUTOR_MIC_REACQUIRE, TUTOR_PRONUNCIATION_ASSESS, TUTOR_STT_ENGINE_INK2, TUTOR_V2_BARGEIN_ENERGY_GATE, TUTOR_V2_HEARD_NOISE, TUTOR_V2_NO_WORDS_RECOVER, TUTOR_V2_SPOKEN_SOUNDS, TUTOR_V2_TARGET_PAUSE, TUTOR_V2_TARGET_PUNCT, TUTOR_V2_CARD_STRESS_SPOKEN, TUTOR_V2_WAVE_DASH, TUTOR_V2_FLAG_CLOCK_PAUSE, TUTOR_V2_ASK_ONE_TEST, TUTOR_V2_CARD_AT_SENTENCE, TUTOR_V2_PAUSE_NOT_ECHO, TUTOR_V2_MOSTLY_HEARD } from '@/lib/tutor/orchestrator/flags';
import { v2AsksTheLearner } from '@/lib/tutor/v2/one-question';
import type { BargeInFrame } from '@/lib/tutor/voice/bargein-gate';
import { armV2SoundGate, stepV2SoundGate } from '@/lib/tutor/v2/sound-gate';
import { V2MicWatch } from '@/lib/tutor/v2/mic-watch';
import { V2Captions } from '@/lib/tutor/v2/captions';
import { getSharedMicLabel, reacquireSharedMicStream, sharedMicCaptureOpen, sharedMicReacquireInFlight, sharedMicTrackMuted } from '@/lib/tutor/voice/shared-mic';
import { V2PronunciationRecorder } from '@/lib/tutor/v2/pronunciation-recorder';
import { PRONUNCIATION_NOTE_WAIT_MS } from '@/lib/tutor/pronunciation/clip-capture';
import { decideTutorAudioCapture } from '@/lib/tutor/voice/tutor-audio-capture';
import { inkTurnEndTimeoutMs } from '@/lib/tutor/voice/ink-turn-end';
import type { RealtimeHandle } from '@/lib/tutor/orchestrator/types';
import type { WhiteboardCommand } from '@core/knowledge/types';
import { ROOM_CHECK_TIMEOUT_MS, ROOM_HAND_TURN_MS, ROOM_LOOK_EVERY_MS, ROOM_LOOK_MIN_WORDS, ROOM_NOISY_AFTER, ROOM_VOICES_ON, afterWords, partialIsConfirmed, partialIsJudged, plainlyTheStudent, sameWords, waitsForCheck } from '@/lib/tutor/v2/room-voices';
import { type V2ComposerStatus, V2Composer, V2_HANDLE_STUBS } from './TutorClientV2';
import { V2FlagBar, V2_FLAGS_ON, reviewNotesClaim, type V2FlagState } from './V2FlagBar';
import { useV2Turns, type V2TurnsConfig } from './useV2Turns';
import { isOwnVoice, ownVoiceWords } from '@/lib/tutor/v2/own-voice';
import { V2EchoClock, v2HeardCount, v2IsEcho, v2PartialVerdict } from '@/lib/tutor/v2/echo-window';
import { V2BoardPause, v2BoardDropSplit, v2PlaceHold, type V2HoldTimer } from '@/lib/tutor/v2/board-pause';
import { v2CloseCalledOff } from '@/lib/tutor/v2/close-mic';
import { withTargetPauses, type V2CardStress } from '@/lib/tutor/v2/target-pauses';
import { v2HeardIsNoise } from '@/lib/tutor/v2/heard';
import { WordsWatch } from '@/lib/tutor/v2/words-watch';
import { V2_CLOCK_PAUSE_HONOURED, v2LessonNowMs } from '@/lib/tutor/v2/time-box';
import { v2SpeechParts } from '@/lib/tutor/v2/languages';
import { v2SpeakSounds, v2SpeakWaveDash } from '@/lib/tutor/v2/spoken-sounds';
import { answeredAsItEnded, trimToSpoken } from '@/lib/tutor/v2/interrupted';
import { isMathsSubject, isScienceSubject } from '@/lib/tutor/v2/session-kind';
import { anchorSentenceIndex, asksAnywhere, inlineSentenceIndex, v2TimedItemIndex } from '@/lib/tutor/v2/board-timing';
import { summariseBoardCall } from '@/lib/tutor/v2/board';
import { V2_NO_ASK_RECHECK_S, V2_WAITED_RECHECK_S } from '@/lib/tutor/v2/facts';
import { asksToWait } from '@/lib/tutor/v2/close-heard';
import { useMicReacquire } from '../../hooks/useMicReacquire';
import { outsideMathSpans, speakBonds, speakCoefficientLetters, speakCoefficientNames, speakDataRuns, speakFormulas, speakLessonNotation, speakLetterUnits, speakGroups, speakNumberPlurals, speakReEndings, speakSlashes } from '@/lib/tutor/voice/tts-pronunciation';
import { cueStop, cueTick, cueTurnAccepted, initialThinkingCue, micChangedLabel, thinkingCueLanguage } from '@/lib/tutor/voice/thinking-cue';
import { useScreenAwake } from './useScreenAwake';
import { playThinkingPulse, playTurnChime, primeThinkingCueAudio } from '@/lib/tutor/voice/thinking-cue-audio';

export interface TutorVoiceV2Props extends Omit<V2TurnsConfig, 'mode' | 'onSentence' | 'onCut' | 'closeDelayMs' | 'untilQuiet'> {
  voice?: OpenAIVoice;
  ttsProvider?: 'realtime' | 'openai-mini' | 'cartesia' | 'silent';
  cartesiaVoiceId?: string;
  cartesiaVoiceSpeed?: number;
  speechRate?: number;
  /** A resumed session is waiting for the student's tap (the host shows "Continue lesson"). */
  onResumeAwaitingTapChange?: (awaiting: boolean) => void;
  /** The session whose student microphone track is kept (the same store as v1's recordings). Without it nothing
   *  is recorded: three flagged sessions could not be replayed through other recognisers (2026-11-12). */
  recordSessionId?: string;
  standby?: boolean;
  /** The audible "got that, thinking" cue (a chime when a turn is accepted, soft pulses if the reply takes long). */
  thinkingCue?: boolean;
  composerSlot?: ReactNode;
  handleRef?: MutableRefObject<RealtimeHandle | null>;
  /** A line for the stage while the microphone is being switched to a new device (null: take it down). */
  onStageNotice?: (text: string | null) => void;
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
/** A pause taken on a sound alone (the recogniser heard speech begin, no words yet) is lifted after this long if
 *  no words of the student's follow. */
/** The longest the greeting's sound waits for the microphone, and the pause after the microphone comes live. */
// Longer on both counts after the first word was lost again (economics, embed-1794534621326): the microphone can take
// more than 3.5 s to open, and the output takes longer than a third of a second to settle once it has.
const OPENING_SPEECH_WAIT_MS = 6000; const MIC_SETTLE_MS = 900;
const SOUND_PAUSE_MS = 2500;
/** After this many pauses on a sound that turned out to be nothing, the tutor waits for words again. */
const SOUND_PAUSE_MISSES = 2;
/** The microphone must have been quiet this long before a silence counts as silence. */
const QUIET_MIC_MS = 20000;
/** After a reply of silence, how long before the tutor is told the student has said nothing more. */
const WAITED_RECHECK_S = V2_WAITED_RECHECK_S;
/** After a reply that asked nothing: how long after it finishes speaking before the tutor is told of the silence. */
const NO_ASK_RECHECK_S = V2_NO_ASK_RECHECK_S;
/** Task 7m (WAVE_DASH): a wave dash standing for "something" is not read "kara" (v2/spoken-sounds.ts). */
const waveDash = (s: string) => (TUTOR_V2_WAVE_DASH ? v2SpeakWaveDash(s) : s);
const MIC_SOUND_LEVEL = 0.12;
/** A held board item is painted after this long whatever the voice is doing. */
const BOARD_HOLD_MAX_MS = 45000;

export default function TutorVoiceV2(props: TutorVoiceV2Props) {
  const p = useRef(props); p.current = props;
  const spokenRef = useRef<string[]>([]);
  // Task 7h (ECHO_BY_PLAYBACK): what the voice has actually played, and when (v2/echo-window.ts).
  const echoRef = useRef<V2EchoClock>(null as unknown as V2EchoClock);
  if (!echoRef.current) echoRef.current = new V2EchoClock();
  const playProgress = () => realtimeRef.current?.getSpokenProgress() ?? null;
  /** The partials of this utterance already logged as the tutor's own voice. */
  const ownPartialLoggedRef = useRef(false);
  /** What had been fully played of a reply still streaming when the student came in (null: no cut this turn). */
  const cutHeardRef = useRef<string | null>(null);
  /** Board items of the reply in hand that were dropped unseen (dropBoard); told to the record of a cut turn. */
  const lostIdsRef = useRef<Set<string>>(new Set());
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
  // What the composer's status chip shows: the same states the host page is told, plus the student's words so far.
  const [composerStatus, setComposerStatus] = useState<V2ComposerStatus>({ state: 'idle' });
  const showState = useCallback((state: 'listening' | 'hearing' | 'processing' | 'thinking' | 'speaking' | 'error') => { setComposerStatus((was) => (was.state === state ? was : { state, ...(state === 'hearing' || state === 'processing' ? { heard: was.heard } : {}), level: was.level, ...(was.quiet && state !== 'hearing' ? { quiet: true } : {}), ...(was.micChanged ? { micChanged: true } : {}), ...(was.room ? { room: true } : {}), ...(was.muted ? { muted: true } : {}) })); p.current.onVoiceStateChange?.(micMutedRef.current && (state === 'listening' || state === 'hearing') ? 'muted' : state); }, []);
  const micUiAtRef = useRef(0);
  // The student's own switch for the microphone (the mic button by the text box, as v1 had).
  const micMutedRef = useRef(false); const handUnmuteAtRef = useRef(0);
  /** The words of the stretch now being spoken, as far as the recogniser has got. */
  const lastPartialRef = useRef('');
  const openingSpeechRef = useRef<string[] | null>([]); const micLiveRef = useRef(false); const micLiveAtRef = useRef(0); const tapAtRef = useRef(0);
  const paintedThisTurnRef = useRef<Array<{ id: string; tool: string; summary: string }>>([]);
  const shownThenWithdrawnRef = useRef<Array<{ id: string; tool: string; summary: string }>>([]);
  const turnSentencesRef = useRef<string[]>([]);
  /** Task 7r (ASK_ONE_TEST): this reply's whole sentences as written (turnSentencesRef holds the voice's language parts). */
  const turnWholeRef = useRef<string[]>([]);
  /** Task 7m (CARD_STRESS_SPOKEN): this reply's sentence cards and their stressed words. */
  const cardStressRef = useRef<V2CardStress[]>([]);
  const startedCountRef = useRef(0);
  const heldBoardRef = useRef<Array<{ idx: number; id?: string; what?: string; untilDone?: boolean; isPage?: boolean; paint: () => void; timer: V2HoldTimer }>>([]);
  // Task 7y (PAUSE_HOLDS_BOARD): a paused voice pauses the board (v2/board-pause.ts): nothing is painted, the hold timers stand still.
  const boardPauseRef = useRef<V2BoardPause>(null as unknown as V2BoardPause);
  if (!boardPauseRef.current) boardPauseRef.current = new V2BoardPause(BOARD_HOLD_MAX_MS);
  /** A held entry with its give-up timer (painted after BOARD_HOLD_MAX_MS of voice time, whatever else). */
  type HeldEntry = (typeof heldBoardRef.current)[number];
  const holdEntry = (e: Omit<HeldEntry, 'timer'>, at?: number): void => {
    const entry = e as HeldEntry;
    entry.timer = boardPauseRef.current.arm(() => { heldBoardRef.current = heldBoardRef.current.filter((h) => h !== entry); e.paint(); });
    if (at === undefined) heldBoardRef.current.push(entry); else heldBoardRef.current.splice(at, 0, entry);
  };
  const cancelHold = (h: { timer: V2HoldTimer }) => boardPauseRef.current.cancel(h.timer);
  const turnBusyRef = useRef(false);
  const paintFnsRef = useRef(new Map<string, () => void>());
  const unplacedBoardRef = useRef<Array<{ call: { id?: string; name: string; sayWith?: string; beforeTurn?: boolean; args?: Record<string, unknown>; timed?: 'next' | 'text' }; paint: () => void }>>([]);
  /** Task 7u (CARD_AT_SENTENCE): the latest sentence an item of this reply marked `timed` was placed with: none after goes earlier. */
  const timedFloorRef = useRef(0); const floorIsCardLineRef = useRef(false);
  const isPageCall = (name: string) => name === 'new_page' || name === 'go_to_page';
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
      if (u.call.beforeTurn) {
        // Task 7y (PAUSE_HOLDS_BOARD): the voice paused: it waits, ahead of any page turn waiting.
        if (boardPauseRef.current.holding) { const page = heldBoardRef.current.findIndex((h) => h.isPage); p.current.onDebugEvent?.('v2_board_timing', `${u.call.name}: belongs before the page turn — held (the voice is paused)`); holdEntry({ idx: 0, id: u.call.id, what: `${u.call.name}: ${summariseBoardCall(u.call.name, u.call.args ?? {}).slice(0, 80)}`, paint: u.paint }, page < 0 ? undefined : page); continue; }
        p.current.onDebugEvent?.('v2_board_timing', `${u.call.name}: belongs before the page turn — now`); u.paint(); continue;
      }
      if (idx < 0 && !final) { still.push(u); continue; }
      // Nothing is written on a new page before the page is turned (a parabola's graph went up on the circle's
      // page, and its note on the next, conic sections 2026-11-11).
      const pageHeld = heldBoardRef.current.some((h) => h.isPage);
      if (idx >= 0) idx = Math.max(idx, pageTurnAtRef.current);
      // Task 7u (CARD_AT_SENTENCE): an anchored item of a language lesson is never placed before one the reply wrote earlier.
      if (idx >= 0 && TUTOR_V2_CARD_AT_SENTENCE && u.call.timed && !isPageCall(u.call.name)) { idx = Math.max(idx, timedFloorRef.current); if (idx > timedFloorRef.current) floorIsCardLineRef.current = false; timedFloorRef.current = idx; }
      // Task 7y (PAUSE_HOLDS_BOARD): the voice paused: held, whatever else (mic test 8, wall 10:15: two cards painted into a pause).
      const paused = boardPauseRef.current.holding;
      const hold = v2PlaceHold({ idx, started: startedCountRef.current, pageHeld, opening: openingTurnRef.current, holding: paused });
      p.current.onDebugEvent?.('v2_board_timing', `${u.call.name}: ${idx < 0 ? 'its sentence was not found' : `sentence ${idx + 1} of ${turnSentencesRef.current.length}`}, ${startedCountRef.current} started — ${hold ? 'held' : 'now'}${paused ? ' (the voice is paused)' : ''}`);
      if (!hold) { u.paint(); continue; }
      holdEntry({ idx: paused ? Math.max(0, idx) : idx, id: u.call.id, what: `${u.call.name}: ${summariseBoardCall(u.call.name, u.call.args ?? {}).slice(0, 80)}`, paint: u.paint });
    }
    unplacedBoardRef.current = still;
  }, []);
  const releaseBoard = useCallback((upTo?: number) => {
    if (upTo === undefined) placeBoard(true);
    // Task 7y (PAUSE_HOLDS_BOARD): nothing goes up while the voice is paused; the release comes again as it goes on (voiceResumed).
    if (boardPauseRef.current.holding) return;
    const keep: typeof heldBoardRef.current = [];
    let behindPage = false;
    for (const h of heldBoardRef.current) {
      // What comes after a page that is still waiting waits with it.
      if (behindPage && upTo !== undefined) { keep.push(h); continue; }
      // A problem card waits for the reply to be complete (see holdBoard): what the check adds for the answer
      // before it must go up first.
      if (upTo === undefined || (h.idx < upTo && !(h.untilDone && turnBusyRef.current))) { cancelHold(h); h.paint(); } else { keep.push(h); if (h.isPage) behindPage = true; }
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
    // The page the card was written for goes up with it: with the turn dropped and the card kept, the first
    // vectors problem sat at the foot of the parametric page, and the tutor's record had it on a page the
    // student never saw (AP Precalculus, embed-1794456849622).
    // Only a card whose task the tutor had begun to say: one it had not reached was never set, and it went
    // up after the student had asked for a different problem (AP Physics, embed-1794496967839).
    // Task 7y (PAUSE_HOLDS_BOARD): items held because the voice was paused are dropped here like any other not painted.
    const split = v2BoardDropSplit(heldBoardRef.current, startedCountRef.current);
    const kept = split.kept;
    const lost = [...split.lost.map((h) => ({ id: h.id, what: h.what })), ...unplacedBoardRef.current.map((u) => ({ id: u.call.id, what: `${u.call.name}: ${summariseBoardCall(u.call.name, u.call.args ?? {}).slice(0, 80)}` }))];
    for (const h of heldBoardRef.current) cancelHold(h);
    for (const h of kept) h.paint();
    heldBoardRef.current = []; unplacedBoardRef.current = [];
    if (!lost.length) return;
    p.current.onDebugEvent?.('v2_board_dropped', `${lost.length} item(s) the tutor had not reached: ${lost.map((x) => x.what).join(' | ').slice(0, 200)}`);
    const state = turnsRef.current?.stateRef.current;
    if (!state) return;
    const ids = new Set(lost.map((x) => x.id).filter(Boolean));
    for (const id of ids) lostIdsRef.current.add(id as string);
    for (const page of state.board.pages) page.items = page.items.filter((it) => !ids.has(it.id));
    // A page that was never turned to is not a page: left in the record, the tutor believed it was on it.
    for (const x of lost) { const m = /^new_page:\s*(.*)$/.exec(x.what ?? ''); const last = state.board.pages[state.board.pages.length - 1]; if (m && last && state.board.pages.length > 1 && !last.items.length && last.title.slice(0, 80) === m[1]) { state.board.pages.pop(); state.board.current = state.board.pages.length - 1; } }
    state.boardProblems = [...(state.boardProblems ?? []), ...lost.map((x) => `${x.what ?? 'an item'}: the student spoke before you reached it, so it was NEVER shown and they have not seen it. It is not on the board and is not an open task`)];
  }, []);
  /** Task 7y: the voice was paused (a barge-in pause, a sound pause, the flag panel). The echo clock's played stretch ends here
   *  (PAUSE_NOT_ECHO) and the board stands still (PAUSE_HOLDS_BOARD). */
  const voicePaused = () => { echoRef.current.paused(Date.now()); boardPauseRef.current.pause(heldBoardRef.current.map((h) => h.timer)); };
  /** Task 7y: the voice goes on (or its queue was cleared): the echo clock and the board with it; what waited for a sentence that
   *  has begun goes up now (all of it once the reply is complete and nothing is left to play). */
  const voiceResumed = () => {
    echoRef.current.resumed();
    if (!boardPauseRef.current.resume(heldBoardRef.current.map((h) => h.timer))) return;
    const pending = !!realtimeRef.current?.isSpeechPending();
    releaseBoard(!pending && !turnBusyRef.current ? undefined : startedCountRef.current);
  };
  const pauseVoice = (): boolean => { const ok = !!realtimeRef.current?.pauseSpeech(); if (ok) voicePaused(); return ok; };
  const resumeVoice = () => { realtimeRef.current?.resumeSpeech(); voiceResumed(); };
  // The caption follows the voice (v2/captions.ts); the host polls it through the handle's getSpokenCaption.
  const captionsRef = useRef<V2Captions>(null as unknown as V2Captions);
  if (!captionsRef.current) captionsRef.current = new V2Captions();
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Other voices in the room (room-voices.ts): how many stretches of speech were judged not the student's, the
  // last of them, whether the student is still to be told, and the early judgement of the stretch now being spoken.
  const roomHitsRef = useRef(0); const roomEarlierRef = useRef<string[]>([]);
  const roomNoticeOwedRef = useRef(false); const roomNoticeSentRef = useRef(false);
  const partialVerdictRef = useRef<'none' | 'pending' | 'doubt' | 'background' | 'student'>('none');
  // A noisy room: the stretch being spoken is looked at every few seconds for words of the student's. `taken`:
  // how many of its words have been dealt with; `last`: what the previous look found; `gen`: which stretch.
  const rollRef = useRef({ taken: 0, last: '', lookedAt: 0, pending: false, gen: 0 });
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
  const lastStudentSaidRef = useRef('');
  const clearSilence = () => { if (silenceTimerRef.current) { clearTimeout(silenceTimerRef.current); silenceTimerRef.current = null; } };
  const armSilence = useCallback((soonS?: number, delayS?: number) => {
    clearSilence();
    const wait = soonS ?? SILENCE_STEPS_S[silenceStepRef.current];
    if (wait === undefined) return;
    silenceTimerRef.current = setTimeout(() => {
      const rt = realtimeRef.current; const turns = turnsRef.current;
      if (!rt || !turns || turns.isEnding()) return;
      if (rt.isSpeechPending() || flagRef.current.active) { armSilence(soonS); return; }
      // A student murmuring through a problem is not silent, even when no words were recognised.
      // In a room with a television the microphone is never quiet: there the wait is counted from the tutor's last words alone.
      if (roomHitsRef.current < ROOM_NOISY_AFTER && Date.now() - lastSoundAtRef.current < Math.min(QUIET_MIC_MS, wait * 500)) { armSilence(soonS, soonS ? 1 : undefined); return; }
      if (!soonS) silenceStepRef.current += 1;
      p.current.onDebugEvent?.('idle_nudge_v2', `${wait}s of silence`);
      turns.nudge(wait);
    }, (delayS ?? wait) * 1000);
  }, []);

  // Speech heard and no words after it, and no failure either (v2/words-watch.ts, Task 6e fix round 1 F6): the page goes
  // back to listening and the idle nudge is armed again. Without it a turn the recogniser ended empty left the page on
  // "One moment…" with the silence timer cleared, and no nudge came for four minutes (v2audio-6e/stall).
  const wordsWatchRef = useRef<WordsWatch>(null as unknown as WordsWatch);
  if (!wordsWatchRef.current) wordsWatchRef.current = new WordsWatch(() => {
    p.current.onDebugEvent?.('v2_words_lost', 'speech was heard and no transcript or failure followed: listening again');
    // Task 7h fix round 1 (C1): that utterance is over; its start must not stand for the next one.
    echoRef.current.settled(); ownPartialLoggedRef.current = false; partialWordsRef.current = 0;
    if (turnsRef.current?.isEnding() || turnsRef.current?.busy || realtimeRef.current?.isSpeechPending()) return;
    showState('listening'); armSilence();
  }, undefined, TUTOR_V2_NO_WORDS_RECOVER);

  // Measured pronunciation (v2/pronunciation.ts): the partner's option, the kill switch, and a session id for the assess
  // route. Off: no recorder, the microphone frames go to the session recorder alone, as before.
  const pronunciationOn = TUTOR_PRONUNCIATION_ASSESS && !!props.pronunciation && !!props.sessionId;
  const pronRef = useRef<V2PronunciationRecorder | null>(null);
  if (pronunciationOn && !pronRef.current) pronRef.current = new V2PronunciationRecorder({ sessionId: props.sessionId!, log: (type, message) => p.current.onDebugEvent?.(type, message) });

  const turns = useV2Turns({
    ...props,
    mode: 'voice',
    pronunciation: pronunciationOn,
    pronunciationHeard: () => pronRef.current?.take(PRONUNCIATION_NOTE_WAIT_MS) ?? Promise.resolve(null),
    onPronunciationArm: (armed) => { if (armed) pronRef.current?.arm(armed.seq, armed.reference); else pronRef.current?.disarm(); },
    // A sentence that quotes a long span of the other teaching language goes to the voice in parts, each in its own
    // voice language (v2/languages.ts). Each part is a sentence here too: the voice reports each part as it starts,
    // and the board is timed by that count.
    onSentence: (sentence, startsParagraph) => { if (startsParagraph || !turnSentencesRef.current.length) paraStartRef.current = turnSentencesRef.current.length; const parts = v2SpeechParts(sentence, p.current.tutorLanguages); captionsRef.current.sentence(sentence, parts); turnWholeRef.current.push(sentence); if (parts.length > 1) p.current.onDebugEvent?.('tts_sentence_split', `${parts.length} parts: ${parts.map((x) => `"${x.slice(0, 30)}"`).join(' | ')}`); turnSentencesRef.current.push(...parts); placeBoard(); waitingRef.current = false; cueRef.current = cueStop(); spokenRef.current = [...spokenRef.current.slice(-7), sentence]; for (const part of parts) { if (openingSpeechRef.current) openingSpeechRef.current.push(part); else realtimeRef.current?.speakText(part); } },
    onCut: () => { echoRef.current.stopped(Date.now()); void realtimeRef.current?.clearSpeechQueue(); captionsRef.current.cut(); dropBoard(); voiceResumed(); },
    heardSoFar: () => cutHeardRef.current,
    notShown: () => lostIdsRef.current,
    // The student is told of the other voices once: the line rides on each turn until a reply carrying it has been spoken.
    roomVoices: () => { if (!roomNoticeOwedRef.current) return undefined; roomNoticeSentRef.current = true; return roomHitsRef.current; },
    onBoardWithdraw: (id) => {
      const held = heldBoardRef.current.find((h) => h.id === id);
      if (held) { cancelHold(held); heldBoardRef.current = heldBoardRef.current.filter((h) => h !== held); }
      unplacedBoardRef.current = unplacedBoardRef.current.filter((u) => u.call.id !== id);
      const shown = held ? undefined : paintedThisTurnRef.current.find((x) => x.id === id);
      // Shown already, it stays: a card that appears and is gone two seconds later is worse than one that says a
      // little too much ("a red card appeared and then vanished", AP Physics, embed-1794493438983). If the check
      // then writes its own version of the same thing, that takes its place (see paint, below), so the board never
      // holds the two together (the same figure twice, chemistry, embed-1794459147431).
      if (shown) shownThenWithdrawnRef.current.push(shown);
      p.current.onDebugEvent?.('v2_board_withdrawn', held ? `${held.what ?? id}: withdrawn before it was shown` : `${shown?.summary.slice(0, 80) ?? id}: withdrawn after it was shown, left up unless it is rewritten`);
    },
    // Task 7m (CARD_STRESS_SPOKEN): this reply's sentence cards and their stressed words, for the voice (plainSpeech). Told as the
    // call arrives, before the sentence kept for it (useV2Turns) is spoken. Fix round 1 (M1): only a card the server put up (or
    // pointed back at), never one it refused.
    onBoardCallArrived: (call) => { if (call.name === 'show_sentence' && (!/^not /.test(call.outcome) || !!call.pointsAt) && typeof call.args.sentence === 'string' && Array.isArray(call.args.emphasis)) cardStressRef.current.push({ sentence: call.args.sentence, stress: (call.args.emphasis as unknown[]).map(String) }); },
    holdBoard: (call, paintNow) => {
      const paint = () => {
        const old = shownThenWithdrawnRef.current.find((x) => x.tool === call.name);
        if (old) {
          shownThenWithdrawnRef.current = shownThenWithdrawnRef.current.filter((x) => x !== old); paintedThisTurnRef.current = paintedThisTurnRef.current.filter((x) => x.id !== old.id);
          p.current.onWhiteboardCommand([{ action: 'removeItems', ids: [old.id] } as unknown as WhiteboardCommand]);
          p.current.onDebugEvent?.('v2_board_withdrawn', `${old.summary.slice(0, 60)}: replaced by the rewritten one`);
        }
        paintedThisTurnRef.current.push({ id: call.id, tool: call.name, summary: summariseBoardCall(call.name, call.args) }); paintNow();
      };
      paintFnsRef.current.set(call.id, paint);
      // Items written just before this page turn, with no words between, belong on the new page (turn.ts): those
      // still waiting go behind the page; one already up is taken down and put up again after the turn.
      const carried: Array<() => void> = [];
      for (const id of call.name === 'new_page' ? call.carries ?? [] : []) {
        const waiting = heldBoardRef.current.find((h) => h.id === id);
        if (waiting) { cancelHold(waiting); heldBoardRef.current = heldBoardRef.current.filter((h) => h !== waiting); carried.push(waiting.paint); continue; }
        const again = paintFnsRef.current.get(id);
        if (again && paintedThisTurnRef.current.some((x) => x.id === id)) { paintedThisTurnRef.current = paintedThisTurnRef.current.filter((x) => x.id !== id); p.current.onWhiteboardCommand([{ action: 'removeItems', ids: [id] } as unknown as WhiteboardCommand]); carried.push(again); }
      }
      if (carried.length) p.current.onDebugEvent?.('v2_board_timing', `new_page: carries ${carried.length} item(s) written just before it`);
      const carryBehind = (idx: number, painted: boolean) => { for (const fn of carried) { if (painted) fn(); else holdEntry({ idx, id: undefined as string | undefined, what: 'carried to the new page', paint: fn }); } };
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
        const found = inlineSentenceIndex(call.name, summariseBoardCall(call.name, call.args), turnSentencesRef.current, from);
        // A page the student has just agreed to turns as the reply begins, unless the tutor names it further in.
        const agreedPage = call.name === 'new_page' && !!(call as { agreed?: boolean }).agreed;
        // Task 7u (CARD_AT_SENTENCE): a card or note of a language lesson goes with the sentence that speaks it, never before an item
        // the reply wrote earlier (board-timing.ts v2TimedItemIndex).
        const timed = TUTOR_V2_CARD_AT_SENTENCE && call.timed && !isPageCall(call.name) ? call.timed : undefined;
        const placed = timed ? v2TimedItemIndex({ name: call.name, timed, ...(typeof call.args.sentence === 'string' ? { text: call.args.sentence } : {}) }, turnSentencesRef.current, found, timedFloorRef.current, pageTurnAtRef.current, floorIsCardLineRef.current) : found;
        const idx = Math.max(call.name === 'new_page' ? 0 : pageTurnAtRef.current, agreedPage && found >= n ? 0 : placed);
        if (timed) { const line = timed === 'next' && idx === n; if (idx > timedFloorRef.current || line) floorIsCardLineRef.current = line; timedFloorRef.current = Math.max(timedFloorRef.current, idx); }
        if (call.name === 'new_page') pageTurnAtRef.current = idx;
        // The opening reply: nothing waits. A session must not begin on a bare board (embed-1794362141944).
        // The next problem is not shown until the whole reply is in, the check's additions included: the note
        // "Center (3, −2), radius 5: correct" came up underneath the problem that followed it (conic sections,
        // 2026-11-11). The card's sentence is near the end of the reply, so this rarely costs any time.
        // A page turn waits for the complete reply too: what the check adds for the answer before it goes on
        // the old page first. Whatever follows a waiting page waits behind it.
        const untilDone = (call.name === 'show_problem' || call.name === 'new_page') && !agreedPage && turnBusyRef.current && !openingTurnRef.current;
        const pageHeld = heldBoardRef.current.some((h) => h.isPage);
        // What the reply writes after a problem card belongs under it: the graph for the next problem came up
        // straight after the last answer, with its problem still to come (grade 7, embed-1794453532197).
        const cardHeld = heldBoardRef.current.some((h) => h.untilDone && !h.isPage);
        // Task 7y (PAUSE_HOLDS_BOARD): the voice paused: held, whatever else.
        const paused = boardPauseRef.current.holding;
        const hold = (startedCountRef.current <= idx && n > 0 && !openingTurnRef.current) || untilDone || ((pageHeld || cardHeld) && !openingTurnRef.current) || paused;
        p.current.onDebugEvent?.('v2_board_timing', `${call.name}: inline, with sentence ${idx + 1} of ${n} (stretch from ${from + 1}), ${startedCountRef.current} started — ${hold ? 'held' : 'now'}${paused ? ' (the voice is paused)' : ''}`);
        if (!hold) { paint(); carryBehind(idx, true); return; }
        holdEntry({ idx, id: call.id, what: `${call.name}: ${summariseBoardCall(call.name, call.args).slice(0, 80)}`, untilDone: untilDone || (cardHeld && !untilDone ? true : false), isPage: call.name === 'new_page', paint });
        carryBehind(idx, false);
        return;
      }
      if (!call.sayWith || !realtimeRef.current) {
        // Task 7y (PAUSE_HOLDS_BOARD): the voice paused: held until it goes on.
        if (realtimeRef.current && boardPauseRef.current.holding) { p.current.onDebugEvent?.('v2_board_timing', `${call.name}: no sentence — held (the voice is paused)`); holdEntry({ idx: 0, id: call.id, what: `${call.name}: ${summariseBoardCall(call.name, call.args).slice(0, 80)}`, paint }); carryBehind(0, false); return; }
        paint(); carryBehind(0, true); return;
      }
      // Its sentence may not have been written yet (the model can call the tool first and speak after):
      // wait for it, and place the item as soon as the sentence is known.
      unplacedBoardRef.current.push({ call, paint });
      placeBoard();
    },
    onTutorBusy: (busy) => {
      props.onTutorBusy?.(busy);
      turnBusyRef.current = busy;
      if (!busy && roomNoticeSentRef.current) { roomNoticeSentRef.current = false; if (turnSentencesRef.current.length > 0 && cutHeardRef.current === null) { roomNoticeOwedRef.current = false; p.current.onDebugEvent?.('v2_room_voices_told', `the student was told of other voices in the room (${roomHitsRef.current} left out so far)`); } }
      if (busy) { cardStressRef.current = []; captionsRef.current.begin(); cutHeardRef.current = null; lostIdsRef.current = new Set(); releaseBoard(); paintedThisTurnRef.current = []; paintFnsRef.current.clear(); turnSentencesRef.current = []; turnWholeRef.current = []; startedCountRef.current = 0; segStartRef.current = 0; paraStartRef.current = 0; pageTurnAtRef.current = 0; timedFloorRef.current = 0; floorIsCardLineRef.current = false; lastBlockAtRef.current = -1; clearSilence(); waitingRef.current = true; realtimeRef.current?.signalBrainThinking(true); showState('thinking'); }
      else { captionsRef.current.streamEnd(); waitingRef.current = false; cueRef.current = cueStop(); realtimeRef.current?.signalBrainThinking(false); placeBoard(true); if (!realtimeRef.current?.isSpeechPending()) releaseBoard(); else releaseBoard(startedCountRef.current);
        // The tutor chose to say nothing and wait (keep_listening). If the student was in fact finished, it finds out soon.
        const silentReply = turnSentencesRef.current.length === 0 && !turnsRef.current?.isEnding();
        // Nothing will be spoken, so no playback event will move the indicator off "Thinking…".
        if (silentReply && !realtimeRef.current?.isSpeechPending()) showState('listening');
        // One early recheck, and only when the silence answered the student's own words: a silent answer
        // to a silence check-in goes back to the ordinary schedule (it looped every 12 s, embed-1794339843244).
        const recheck = silentReply && lastTurnWasStudentRef.current && !asksToWait(lastStudentSaidRef.current);
        // A reply that asked the student nothing leaves them not knowing whose move it is (the tutor made a
        // statement and waited 44 s, embed-1794355900794). It learns of the silence early, once, and can go on.
        const said = turnSentencesRef.current;
        const noAsk = !silentReply && (lastTurnWasStudentRef.current || openingTurnRef.current) && said.length > 0 && !asksAnywhere(said) && !(TUTOR_V2_ASK_ONE_TEST && v2AsksTheLearner(turnWholeRef.current.join(' '))) && !turnsRef.current?.isEnding() && !turnsRef.current?.closed && !turnsRef.current?.isClosing()
          // The tutor said it would wait, or the student asked it to: the silence that follows is theirs to break
          // ("pause for a second" was answered "I'll wait", and the lesson went on five seconds later, portal-50a1e584).
          && !turnsRef.current?.keptListeningRef.current && !asksToWait(lastStudentSaidRef.current);
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
    // At the box (v2/time-box.ts): the goodbye waits for the sentence under way. A reply the student had come in over
    // (paused) is theirs now: its rest is dropped, not played before the goodbye.
    untilQuiet: async (maxMs) => {
      clearSilence();
      stopSoundGate();
      if (pauseTimerRef.current) { clearTimeout(pauseTimerRef.current); pauseTimerRef.current = null; soundPauseRef.current = false; echoRef.current.stopped(Date.now()); void realtimeRef.current?.clearSpeechQueue(); captionsRef.current.cut(); dropBoard(); voiceResumed(); }
      const end = Date.now() + maxMs;
      while (Date.now() < end && realtimeRef.current?.isSpeechPending()) await new Promise((r) => setTimeout(r, 300));
      return !realtimeRef.current?.isSpeechPending();
    },
  });
  turnsRef.current = turns;

  // Pause-first: when words that are not the tutor's own start arriving, the tutor stops mid-sentence
  // without losing its place; the finished transcript then either cuts it (a real turn) or lets it go on.
  const soundPauseRef = useRef(false); const soundMissesRef = useRef(0);
  // The energy gate on a pause for a sound (v2/sound-gate.ts): the levels come from the recogniser that owns the
  // microphone (its energy window), so its frames are tapped once, for the recogniser, the recording and the
  // pronunciation clip as before.
  const energyWindowRef = useRef<() => BargeInFrame[]>(() => []);
  const soundGateRef = useRef<ReturnType<typeof setInterval> | null>(null);
  function stopSoundGate() { if (soundGateRef.current) { clearInterval(soundGateRef.current); soundGateRef.current = null; } }
  const liftPause = useCallback(() => {
    if (pauseTimerRef.current) { clearTimeout(pauseTimerRef.current); pauseTimerRef.current = null; }
    if (soundPauseRef.current) { soundPauseRef.current = false; soundMissesRef.current += 1; }
    resumeVoice();
  }, []);
  /** Task 7y (PAUSE_NOT_ECHO): heard words in this utterance so far (a partial that adds words keeps a pause going). */
  const partialWordsRef = useRef(0);
  /** The pause taken on a sound: lifted after SOUND_PAUSE_MS unless words of the student's follow (Task 7y: or any words grow). */
  const armSoundPause = () => {
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => {
      pauseTimerRef.current = null;
      if (soundPauseRef.current) { soundPauseRef.current = false; soundMissesRef.current += 1; p.current.onDebugEvent?.('v2_bargein_pause_expired', `no words of the student's within ${SOUND_PAUSE_MS} ms: speaking again (false alarms ${soundMissesRef.current} of ${SOUND_PAUSE_MISSES})`); }
      if (!flagRef.current.active) resumeVoice();
    }, SOUND_PAUSE_MS);
  };
  /** Was this said to the tutor? False: another voice in the room. A check that fails or is slow answers true. */
  const saidToTutor = useCallback(async (text: string): Promise<boolean> => {
    const ctl = new AbortController(); const timer = setTimeout(() => ctl.abort(), ROOM_CHECK_TIMEOUT_MS); const t0 = Date.now();
    try {
      const res = await fetch('/api/tutor/heard-addressed', { method: 'POST', headers: { 'Content-Type': 'application/json', ...(p.current.embedToken ? { 'x-embed-token': p.current.embedToken } : {}) }, body: JSON.stringify({ heard: text, tutorSaid: spokenRef.current.join(' '), earlier: roomEarlierRef.current }), signal: ctl.signal });
      if (!res.ok) throw new Error(`status ${res.status}`);
      return (await res.json() as { background?: boolean }).background !== true;
    } catch (err) { p.current.onDebugEvent?.('v2_room_check_failed', `${err instanceof Error ? err.message.slice(0, 80) : 'error'} after ${Date.now() - t0} ms: taken as the student`); return true; } finally { clearTimeout(timer); }
  }, []);
  /** The student's own words out of a stretch that may hold a television's too; null when none of it is theirs.
   *  `orNothing`: a check that fails finds nothing (an early look, which the end of the stretch repeats);
   *  otherwise a failed check hands the stretch back whole. */
  const studentWords = useCallback(async (text: string, orNothing?: boolean): Promise<string | null> => {
    const ctl = new AbortController(); const timer = setTimeout(() => ctl.abort(), ROOM_CHECK_TIMEOUT_MS * 2); const t0 = Date.now();
    try {
      const res = await fetch('/api/tutor/heard-addressed', { method: 'POST', headers: { 'Content-Type': 'application/json', ...(p.current.embedToken ? { 'x-embed-token': p.current.embedToken } : {}) }, body: JSON.stringify({ extract: true, heard: text, tutorSaid: spokenRef.current.join(' '), earlier: roomEarlierRef.current }), signal: ctl.signal });
      if (!res.ok) throw new Error(`status ${res.status}`);
      const words = (await res.json() as { student?: string | null }).student;
      return typeof words === 'string' && words.trim() ? words.trim() : null;
    } catch (err) { p.current.onDebugEvent?.('v2_room_check_failed', `${err instanceof Error ? err.message.slice(0, 80) : 'error'} after ${Date.now() - t0} ms: ${orNothing ? 'this look found nothing' : 'taken as the student'}`); return orNothing ? null : text; } finally { clearTimeout(timer); }
  }, []);
  /** The room has turned out noisy and the student has not been told: the tutor says so as soon as it has the
   *  floor. Left to ride on its next reply, it was never said, because in that room no reply was ever asked for
   *  (local test, embed-1795054401972). */
  const sayRoomNotice = useCallback(() => {
    setTimeout(() => {
      const t = turnsRef.current;
      if (!roomNoticeOwedRef.current || roomNoticeSentRef.current || !t || t.busy || t.isEnding() || t.closed || realtimeRef.current?.isSpeechPending() || flagRef.current.active) return;
      p.current.onDebugEvent?.('v2_room_voices_notice', 'the tutor speaks up about the other voices');
      t.nudge(6);
    }, 1200);
  }, []);
  /** A noisy room: the stretch still being spoken is looked at for words of the student's. A television does not
   *  stop for them, so the stretch may not end for half a minute. Words found the same on two looks running have
   *  stopped growing: the student has finished, and they take the floor. */
  const lookForStudent = useCallback((text: string) => {
    const r = rollRef.current; const now = Date.now();
    if (r.pending || now - r.lookedAt < ROOM_LOOK_EVERY_MS) return;
    const rest = afterWords(text, r.taken); const total = text.trim().split(/\s+/).filter(Boolean).length;
    if (total - r.taken < ROOM_LOOK_MIN_WORDS) return;
    r.pending = true; r.lookedAt = now; const gen = r.gen;
    void studentWords(rest, true).then((words) => {
      if (rollRef.current.gen !== gen) return; // the stretch has ended since: its end is dealt with in `heard`
      r.pending = false;
      if (flagRef.current.active || micMutedRef.current) return;
      if (!words || isOwnVoice(words, spokenRef.current)) { r.last = ''; return; }
      if (!sameWords(words, r.last)) { r.last = words; return; }
      r.taken = total; r.last = '';
      p.current.onDebugEvent?.('v2_room_student_words', `found among other voices, while still being said: "${words.slice(0, 300)}" out of: ${rest.slice(0, 600)}`);
      takeFloorRef.current?.(words);
    });
  }, [studentWords]);
  /** The stretch being spoken is judged once, early, so a pause for a television is a short one. */
  const judgePartial = useCallback((text: string, second = false) => {
    partialVerdictRef.current = 'pending';
    void saidToTutor(text).then((student) => {
      if (partialVerdictRef.current !== 'pending') return; // the stretch has ended since
      // No other voice has been found in this room yet: a first reading of "another voice" is asked about again
      // on more words before the tutor speaks over what may be its student (room-voices.ts).
      if (!student && !second && roomHitsRef.current < ROOM_NOISY_AFTER) { partialVerdictRef.current = 'doubt'; p.current.onDebugEvent?.('v2_room_voice_doubt', `read as another voice on its first words; the tutor stays paused until more is heard: ${text.slice(0, 80)}`); return; }
      partialVerdictRef.current = student ? 'student' : 'background';
      if (flagRef.current.active) return;
      if (!student) { p.current.onDebugEvent?.('v2_room_voice', `not the student (still being said), the tutor goes on: ${text.slice(0, 80)}`); liftPause(); return; }
    });
  }, [saidToTutor, liftPause]);
  const hearingPartial = useCallback((text: string) => {
    const rt = realtimeRef.current;
    if (text.trim()) echoRef.current.heardWords(text, Date.now(), playProgress());
    // Task 7y (PAUSE_NOT_ECHO): did this partial add words to the utterance?
    const nWords = ownVoiceWords(text).length;
    const grew = nWords > partialWordsRef.current; partialWordsRef.current = nWords;
    // A noisy room: nothing pauses the tutor but words found to be the student's, whether it is speaking or waiting.
    if (ROOM_VOICES_ON && roomHitsRef.current >= ROOM_NOISY_AFTER && !flagRef.current.active && !micMutedRef.current && text.trim() && !plainlyTheStudent(text)) { lookForStudent(text); return; }
    // The session is ending (the close said, or the box): its last words are not paused.
    if (!rt?.isSpeechPending() || flagRef.current.active || turnsRef.current?.isEnding()) return;
    // Pause on the first words that are not the tutor's own (every word of an echo is in what it just played: Task 7h).
    if (!text.trim()) return;
    const giveUp = () => setTimeout(() => { pauseTimerRef.current = null; if (!flagRef.current.active) resumeVoice(); }, PAUSE_GIVE_UP_MS);
    const echo = v2IsEcho({ text, nowMs: Date.now(), clock: echoRef.current, progress: playProgress(), speechPending: true, written: spokenRef.current, minWords: 1, share: 1, isOwnVoice });
    const verdict = v2PartialVerdict(echo, text);
    if (verdict !== 'learner') {
      if (!ownPartialLoggedRef.current) { ownPartialLoggedRef.current = true; p.current.onDebugEvent?.(verdict === 'own' ? 'v2_own_voice_partial' : 'v2_echo_undecided', `"${text.slice(0, 60)}" not paused for${verdict === 'undecided' ? ' (one word: not enough to call it the echo)' : ''}: matched "${(echo.part ?? '').slice(0, 60)}" score=${echo.score} · ${echo.timing}`); }
      // Task 7y (PAUSE_NOT_ECHO): a pause under way and the words grew: it is kept (an echo cannot grow while the speakers are
      // silent); it ends on the transcript or on silence. Mic test 8 (embed-1795115593161, wall 19:10–19:12): his words of the
      // repeat model, matched to what had played, let the 2.5 s sound pause run out and the voice spoke over him.
      if (TUTOR_V2_PAUSE_NOT_ECHO && grew && pauseTimerRef.current) {
        if (soundPauseRef.current) armSoundPause(); else { clearTimeout(pauseTimerRef.current); pauseTimerRef.current = giveUp(); }
      }
      return;
    }
    // Merge with main (Task 8e): words that are not the tutor's echo (above) may still be another voice in the room: judged once,
    // early, as on main. A stretch judged another voice pauses nothing; one in doubt keeps the pause until more is heard.
    if (ROOM_VOICES_ON && !plainlyTheStudent(text)) {
      // This stretch has been judged another voice in the room: the tutor goes on through the rest of it.
      if (partialVerdictRef.current === 'background') return;
      if (partialVerdictRef.current === 'none' && partialIsJudged(text, false)) judgePartial(text);
      else if (partialVerdictRef.current === 'doubt' && partialIsConfirmed(text)) judgePartial(text, true);
    }
    // Words of the student's: a pause taken on the sound alone was right.
    if (soundPauseRef.current) { soundPauseRef.current = false; soundMissesRef.current = 0; }
    // Already paused and the student is still talking: the wait runs from their latest words. Counted from the
    // first, a student who spoke for longer than the wait heard the tutor start up again under them every few
    // seconds (AP Precalculus, embed-1794456849622: four restarts inside one 35-second question).
    if (pauseTimerRef.current) { clearTimeout(pauseTimerRef.current); pauseTimerRef.current = giveUp(); return; }
    stopSoundGate();
    if (!pauseVoice()) { p.current.onDebugEvent?.('v2_heard_over_tutor', `words, not paused (nothing playing yet): ${text.slice(0, 60)}`); return; }
    {
      p.current.onDebugEvent?.('v2_bargein_pause', text.slice(0, 80));
      pauseTimerRef.current = giveUp();
    }
  }, [judgePartial, lookForStudent]);

  /** Merge with main (Task 8e): `heard` keeps the ending and the closing words from being cut (its own checks, in this branch's
   *  order); main's look for the student's words among other voices (lookForStudent) reaches `takeFloor` without passing `heard`,
   *  so the same two are asked here. */
  const notForATurn = (text: string): boolean => {
    if (turnsRef.current?.isEnding()) { p.current.onDebugEvent?.('v2_heard_while_ending', text.slice(0, 80)); return true; }
    if (turnsRef.current?.isClosing() && !v2CloseCalledOff(text)) {
      p.current.onDebugEvent?.('v2_heard_while_closing', `${text.slice(0, 80)}: thanks or a goodbye, the close goes on`);
      liftPause();
      return true;
    }
    return false;
  };
  /** The student's words take the floor: the tutor stops, and they are sent as a turn. `noise` (Task 6e): the recogniser's noise
   *  with the floor free: sent as nothing that could be made out. */
  const takeFloor = useCallback((text: string, opts?: { typed?: boolean; noise?: boolean }) => {
    if (notForATurn(text)) return;
    const noise = opts?.noise === true;
    stopSoundGate();
    if (pauseTimerRef.current) { clearTimeout(pauseTimerRef.current); pauseTimerRef.current = null; }
    soundPauseRef.current = false; soundMissesRef.current = 0;
    // The student has taken the floor: whatever the tutor still had queued or paused is dropped, whether or
    // not a reply is still streaming. Clearing also restarts a paused playback clock; without it the next
    // reply queued behind a paused sentence and was never heard (embed-1794328944377, "you seem to have got stuck").
    if (realtimeRef.current?.isSpeechPending()) {
      p.current.onDebugEvent?.('v2_bargein', opts?.typed ? 'typed over the tutor' : 'spoke over the tutor');
      // Task 7y (MOSTLY_HEARD): how much of the sentence playing had played, read before the clock is stopped.
      const playedShare = TUTOR_V2_MOSTLY_HEARD ? echoRef.current.playedShare(playProgress(), realtimeRef.current?.getSpokenAudioState?.()) : null;
      echoRef.current.stopped(Date.now());
      void realtimeRef.current.clearSpeechQueue();
      captionsRef.current.cut();
      // A finished reply cut short: the record keeps only what was heard (a reply still streaming is folded
      // by useV2Turns instead).
      // The sentence playing when they came in is counted as unheard: cut at "What's your first…", the
      // question did not get through, and the tutor says it again. Task 7y (MOSTLY_HEARD): unless about 80 % of its words had
      // played (v2/echo-window.ts v2HeardCount).
      // Merge with main (Task 8e): or it is the reply's closing question and they have plainly answered it (interrupted.ts).
      const answered = answeredAsItEnded(text, turnSentencesRef.current, startedCountRef.current);
      const heardCount = answered ? startedCountRef.current : v2HeardCount(startedCountRef.current, playedShare);
      if (!answered && heardCount === startedCountRef.current && heardCount > 0) p.current.onDebugEvent?.('v2_mostly_heard', `sentence ${heardCount} counted heard: ${Math.round((playedShare ?? 0) * 100)}% of its audio had played`);
      const st = turnsRef.current?.stateRef.current;
      if (turnsRef.current?.busy) cutHeardRef.current = turnSentencesRef.current.slice(0, heardCount).join(' ');
      else if (st) {
        const trimmed = trimToSpoken(st, turnSentencesRef.current, heardCount);
        if (trimmed !== st) { turnsRef.current!.stateRef.current = trimmed; p.current.onDebugEvent?.('v2_unheard_trimmed', `${turnSentencesRef.current.length - heardCount} sentence(s) not fully heard; the record keeps ${heardCount}`); }
      }
    }
    // Nothing queued or playing, and the reply still being written: what was heard is the sentences that played.
    else if (turnsRef.current?.busy && cutHeardRef.current === null) cutHeardRef.current = turnSentencesRef.current.slice(0, startedCountRef.current).join(' ');
    dropBoard();
    resumeVoice();
    silenceStepRef.current = 0;
    if (p.current.thinkingCue) { const r = cueTurnAccepted(cueRef.current, Date.now()); cueRef.current = r.state; play(r.play); }
    lastTurnWasStudentRef.current = true; openingTurnRef.current = false; lastStudentSaidRef.current = text;
    if (noise) turnsRef.current?.send(text, { unheard: true });
    else turnsRef.current?.send(text);
  }, [liftPause, dropBoard]);
  const takeFloorRef = useRef<typeof takeFloor | null>(null); takeFloorRef.current = takeFloor;

  const heard = useCallback((transcript: string, opts?: { typed?: boolean }) => {
    wordsWatchRef.current.settled();
    const text = transcript.trim();
    if (!text) return;
    // Task 7h: judged against what had been played when these words began; the next words are a new utterance.
    const echo = opts?.typed ? null : v2IsEcho({ text, nowMs: Date.now(), clock: echoRef.current, progress: playProgress(), speechPending: !!realtimeRef.current?.isSpeechPending(), written: spokenRef.current, isOwnVoice });
    echoRef.current.settled(); ownPartialLoggedRef.current = false; partialWordsRef.current = 0;
    if (flagRef.current.active) { flagRef.current.words.push(text); return; }
    // The stretch has ended: its early judgement goes with it, and so does what was already taken out of it.
    // Merge with main (Task 8e): before any of the returns below (the ending, noise, the tutor's own voice, thanks over the close),
    // so a stretch that ends on one of them leaves no judgement behind for the next stretch.
    const early = partialVerdictRef.current; const taken = rollRef.current.taken;
    if (!opts?.typed) { lastPartialRef.current = ''; partialVerdictRef.current = 'none'; rollRef.current = { taken: 0, last: '', lookedAt: 0, pending: false, gen: rollRef.current.gen + 1 }; }
    // The session is ending (the close, or the box): nothing is answered now, and clearing the speech queue for these
    // words would cut the goodbye.
    if (turnsRef.current?.isEnding()) { p.current.onDebugEvent?.('v2_heard_while_ending', text.slice(0, 80)); return; }
    // The recogniser's noise, not words (heard.ts v2HeardIsNoise; Task 6e: "I'" and 5,000 characters of 、 and 号). It
    // never cuts the tutor and is never stored; with the floor free, the tutor is told nothing could be made out.
    const noise = !opts?.typed && TUTOR_V2_HEARD_NOISE && v2HeardIsNoise(text);
    if (noise) {
      p.current.onDebugEvent?.('v2_heard_noise', `${text.length} chars: ${text.replace(/\s+/g, ' ').slice(0, 40)}`);
      if (realtimeRef.current?.isSpeechPending()) { liftPause(); return; }
      if (turnsRef.current?.busy) return;
    }
    // The microphone hears the tutor too. Words that are the tutor's own, arriving while it speaks, are not the student.
    if (echo?.own) {
      p.current.onDebugEvent?.('v2_own_voice_dropped', `${text.slice(0, 80)} · matched "${(echo.part ?? '').slice(0, 60)}" score=${echo.score} · ${echo.timing}`);
      liftPause();
      return;
    }
    // Task 7h (CLOSE_HEARS): over the closing words, thanks or a goodbye are not answered and do not cut them.
    if (turnsRef.current?.isClosing() && !v2CloseCalledOff(text)) {
      p.current.onDebugEvent?.('v2_heard_while_closing', `${text.slice(0, 80)}: thanks or a goodbye, the close goes on`);
      liftPause();
      return;
    }
    // Noise with the floor free is not words: there is nothing in it to ask the room check about.
    if (noise) { takeFloor(text, { noise: true }); return; }
    const rest = opts?.typed ? text : afterWords(text, taken);
    const backToWaiting = () => { liftPause(); if (!realtimeRef.current?.isSpeechPending() && !turnsRef.current?.busy) { showState('listening'); armSilence(soonAfterSpeechRef.current); } };
    if (!rest) { backToWaiting(); return; }
    // A reply being worked out is cut by a turn as surely as one being spoken.
    const speaking = !!realtimeRef.current?.isSpeechPending() || !!turnsRef.current?.busy;
    // Judged the student's while it was still being said: it is not asked about twice.
    if (early === 'student' || !waitsForCheck({ text: rest, typed: opts?.typed, speaking, suspect: roomHitsRef.current > 0 })) { takeFloor(rest, opts); return; }
    // Words picked up while the tutor is talking, or in a room where other voices have been heard: only the part
    // said to the tutor takes the floor (room-voices.ts). The tutor stays paused while that is asked.
    void studentWords(rest).then((found) => {
      const words = found && !(speaking && isOwnVoice(found, spokenRef.current)) ? found : null;
      if (flagRef.current.active) { flagRef.current.words.push(words ?? rest); return; }
      if (words) {
        // A stretch that was all the student's, in a room not yet known to be noisy, clears a single earlier reading
        // of "another voice": that reading is wrong often enough on a short answer ("That is a 100 pi") that two
        // of them, lessons apart, must not mark the room noisy for good (ACT Math, portal-87303e9f).
        if (sameWords(words, rest) && roomHitsRef.current > 0 && roomHitsRef.current < ROOM_NOISY_AFTER) { roomHitsRef.current = 0; roomEarlierRef.current = []; }
        if (!sameWords(words, rest)) p.current.onDebugEvent?.('v2_room_student_words', `found among other voices: "${words.slice(0, 300)}" out of: ${rest.slice(0, 600)}`);
        takeFloor(words, opts); return;
      }
      roomHitsRef.current += 1; roomEarlierRef.current = [...roomEarlierRef.current.slice(-1), rest];
      const noisy = roomHitsRef.current >= ROOM_NOISY_AFTER;
      p.current.onDebugEvent?.('v2_room_voice', `not the student, left out (${roomHitsRef.current}${noisy ? ', the room is noisy' : ''}; the tutor was ${speaking ? 'speaking and goes on' : 'waiting and goes on waiting'}): ${rest.slice(0, 600)}`);
      if (roomHitsRef.current === ROOM_NOISY_AFTER) roomNoticeOwedRef.current = true;
      if (noisy) setComposerStatus((was) => (was.room ? was : { ...was, room: true }));
      // Nothing was said to the tutor: it is still the student's move, and the wait for them runs on.
      backToWaiting();
      if (roomNoticeOwedRef.current) sayRoomNotice();
    });
  }, [liftPause, studentWords, armSilence, takeFloor, sayRoomNotice]);

  // Stable identities, all of them: see the note at the top of this file.
  // A microphone that gives no sound in its first second is common and harmless (Bluetooth earphones open
  // silent), and the recorder's warning about it is a line for the log: shown to the student, a red banner with
  // decibel readings sat over the board for a whole lesson that was being heard perfectly well (Praveen,
  // embed-1794595194384). The line by the text box says it quietly until sound arrives.
  const onRealtimeError = useCallback((err: Error) => {
    if (err.name === 'MicSilentWarning') { p.current.onDebugEvent?.('v2_mic_quiet', err.message.slice(0, 160)); setComposerStatus((was) => ({ ...was, quiet: true })); return; }
    p.current.onError?.(err);
  }, []);
  const onRealtimeState = useCallback((state: string) => {
    if (state === 'speaking') showState('speaking');
    else if (state === 'listening' || state === 'connected') showState(turnsRef.current?.busy ? 'thinking' : 'listening');
    else if (state === 'error') showState('error');
  }, []);
  const onPlayback = useCallback((event: string) => {
    // A sentence has begun playing: board items anchored to it (or to an earlier one) appear now.
    if (event === 'sentence-start') { startedCountRef.current += 1; echoRef.current.started(turnSentencesRef.current[startedCountRef.current - 1] ?? '', Date.now()); releaseBoard(startedCountRef.current); if (flagRef.current.active && realtimeRef.current?.pauseSpeech()) voicePaused(); }
    // The wait chosen when the reply ended (a short one after a reply with no question) still stands once its
    // speech has finished: arming the plain 75 s here threw the short wait away, and a tutor who had stopped
    // without a question sat silent (embed-1794374818774, embed-1794376295543).
    // Task 8g (PRON_ONSET_GRACE): an armed attempt begun just before the voice ended is recorded (pronunciation-recorder.ts). Fix round 1
    // (I3): only the drain once the reply has finished (the turn no longer busy), not one between its streamed sentences.
    if (event === 'drain') { echoRef.current.stopped(Date.now()); captionsRef.current.drain(); pronRef.current?.tutorVoiceEnded(!turnsRef.current?.busy); if (!turnsRef.current?.busy) { releaseBoard(); armSilence(soonAfterSpeechRef.current); if (roomNoticeOwedRef.current) sayRoomNotice(); } }
  }, [armSilence, releaseBoard, sayRoomNotice]);
  const onRelayTranscript = useCallback((transcript: string, opts?: { typed?: boolean }) => heard(transcript, opts), [heard]);
  const languagesKey = (props.tutorLanguages ?? []).join(',');
  const scienceSpeech = useCallback((sentence: string, rewrite: (s: string) => string) => speakGroups(rewrite(outsideMathSpans(sentence, (w) => speakFormulas(speakBonds(speakSlashes(speakNumberPlurals(speakDataRuns(speakLessonNotation(speakLetterUnits(speakReEndings(w))))))))))), []);
  const mathsSpeech = useCallback((sentence: string, rewrite: (s: string) => string) => speakGroups(rewrite(outsideMathSpans(sentence, (w) => speakCoefficientLetters(speakSlashes(speakNumberPlurals(speakDataRuns(speakLessonNotation(speakReEndings(speakCoefficientNames(w)))))))))), []);
  // Task 7c (SPOKEN_SOUNDS): a sound in phonetic symbols ("/z/") is said in words first: speakSlashes read "/s/" as "per second".
  // Task 7h (TARGET_PAUSE): in a lesson that teaches a language, a short quoted target is set apart by a pause either side
  // (v2/target-pauses.ts): marked before the rest of the path; after it dashes (a comma in Japanese, Task 7l), or with TARGET_PUNCT off the voice's break tags.
  // Task 7m: a sentence card's stressed words set apart too (CARD_STRESS_SPOKEN); a wave dash standing for "something" not read
  // "kara" (WAVE_DASH).
  const plainSpeech = useCallback((sentence: string, rewrite: (s: string) => string) => withTargetPauses(sentence, (sentence) => rewrite(speakSlashes(speakNumberPlurals(speakDataRuns(waveDash(speakLessonNotation(speakReEndings(TUTOR_V2_SPOKEN_SOUNDS ? v2SpeakSounds(sentence) : sentence))))))), TUTOR_V2_TARGET_PAUSE && ((p.current.tutorLanguages?.length ?? 0) >= 2 || !!p.current.pronunciation), TUTOR_V2_TARGET_PUNCT, TUTOR_V2_CARD_STRESS_SPOKEN ? cardStressRef.current : []), []);
  const relayMode = useMemo(() => ({
    instructions: TRANSPORT_ONLY,
    onUserTranscript: onRelayTranscript,
    ttsProvider: props.ttsProvider,
    cartesiaVoiceId: props.cartesiaVoiceId,
    cartesiaVoiceSpeed: props.cartesiaVoiceSpeed,
    ...(languagesKey ? { tutorLanguages: languagesKey.split(',') } : {}),
    ...(props.speechRate !== undefined ? { speechRate: props.speechRate } : {}),
    studentName: props.studentName,
    // The subject arrives as 'math' or 'maths', 'science' or 'sci': matched whole, a physics lesson given as 'sci'
    // fell through to plain speech and "3 A" was read as the letter (AP Physics, embed-1794500923861).
    ...(isMathsSubject(props.subject) ? { ttsTextTransform: mathsSpeech } : isScienceSubject(props.subject) ? { ttsTextTransform: scienceSpeech } : { ttsTextTransform: plainSpeech }),
  }), [onRelayTranscript, props.subject, props.ttsProvider, props.cartesiaVoiceId, props.cartesiaVoiceSpeed, languagesKey, props.speechRate, props.studentName]);
  // Both tracks of the session recording. The tutor's is tapped where its audio is played (useOpenAIRealtime's
  // dequeue), so only what the student heard is kept. v2 tapped the microphone alone, and every v2 replay was
  // the student by themselves (embed-1794832831433, embed-1794829907553). A silent tutor has no track.
  const recordOn = !!props.recordSessionId && process.env.NEXT_PUBLIC_TUTOR_RECORD_AUDIO !== 'false';
  const recorder = useAudioRecorder({ sessionId: props.recordSessionId ?? '', enabled: recordOn });
  const tutorAudioCapture = decideTutorAudioCapture({ recordEnabled: recordOn, sessionMode: 'voice', ttsProvider: props.ttsProvider });
  const realtime = useOpenAIRealtime({
    instructions: TRANSPORT_ONLY,
    voice: props.voice,
    reconnectEnabled: true,
    embedToken: props.embedToken,
    relayMode,
    onError: onRealtimeError,
    onStateChange: onRealtimeState,
    onTtsPlaybackProgress: onPlayback,
    onTutorAudioChunk: tutorAudioCapture.capture ? recorder.pushTutorChunk : undefined,
  });
  realtimeRef.current = realtime;

  // The student's voice. Exactly one recogniser owns the microphone, chosen as v1 chooses it.
  const listening = started && realtime.isConnected && !props.standby && !turns.closed;
  // The screen stays on while the conversation runs (useScreenAwake.ts).
  useScreenAwake(started && !turns.closed, props.onDebugEvent);
  const onTranscript = useCallback((t: PerceptionTranscript) => heard(t.text), [heard]);
  const onPartial = useCallback((x: { text: string }) => { if (micMutedRef.current) return; wordsWatchRef.current.speech('partial'); lastPartialRef.current = x.text; setComposerStatus((was) => ({ ...was, heard: x.text })); hearingPartial(x.text); }, [hearingPartial]);
  const onSpeechStart = useCallback((e?: { resume?: boolean }) => {
    // Fix round 2: only the recogniser's own resume (Ink's turn.resume) is the same utterance; every other start is new.
    echoRef.current.speechStart(Date.now(), playProgress(), !!e?.resume);
    if (!e?.resume) partialWordsRef.current = 0;
    if (flagRef.current.active) return;
    wordsWatchRef.current.speech('start');
    // An armed pronunciation reply starts recording here, unless the tutor's own voice is what was heard.
    pronRef.current?.speechStart(!!realtimeRef.current?.isSpeechPending());
    clearSilence();
    const rt = realtimeRef.current;
    if (!rt?.isSpeechPending()) { showState('hearing'); return; }
    // The session is ending (the close said, or the box): its last words are not paused.
    if (turnsRef.current?.isEnding()) return;
    // The tutor is speaking and the recogniser hears speech begin. Waiting for the first recognised words let
    // the tutor run on for six or seven more of its own (AP Physics, embed-1794493438983), so it pauses on the
    // sound and goes on if no words of the student's follow. A room where sounds keep turning out to be
    // nothing (a cough, the tutor's own voice from the speakers) goes back to waiting for words.
    const noisyRoom = ROOM_VOICES_ON && roomHitsRef.current >= ROOM_NOISY_AFTER;
    if (pauseTimerRef.current || soundGateRef.current || noisyRoom || partialVerdictRef.current === 'background' || soundMissesRef.current >= SOUND_PAUSE_MISSES) { p.current.onDebugEvent?.('v2_heard_over_tutor', `a sound, not paused: ${pauseTimerRef.current ? 'already paused' : soundGateRef.current ? 'already gated' : noisyRoom || partialVerdictRef.current === 'background' ? 'other voices in this room' : 'sounds have been false alarms'}`); return; }
    const pauseOnSound = (what: string) => {
      if (!pauseVoice()) { p.current.onDebugEvent?.('v2_heard_over_tutor', 'a sound, not paused: nothing playing yet'); return; }
      soundPauseRef.current = true;
      p.current.onDebugEvent?.('v2_bargein_pause', what);
      armSoundPause();
    };
    // The tutor's own voice from the speakers is heard as speech beginning too: the sound pauses the tutor only once
    // the microphone has carried energy well above its level just before (v2/sound-gate.ts). No levels: at once.
    const gate = TUTOR_V2_BARGEIN_ENERGY_GATE ? armV2SoundGate(energyWindowRef.current(), Date.now()) : null;
    if (!gate) { pauseOnSound('(a sound, no words yet)'); return; }
    p.current.onDebugEvent?.('v2_bargein_gate_armed', `threshold=${gate.threshold.toFixed(3)}`);
    soundGateRef.current = setInterval(() => {
      const step = stepV2SoundGate(gate, energyWindowRef.current(), Date.now(), !!realtimeRef.current?.isSpeechPending() && !flagRef.current.active);
      if (step === 'wait') return;
      stopSoundGate();
      if (step === 'drop') { p.current.onDebugEvent?.('v2_bargein_gate_dropped', `after ${Date.now() - gate.onsetMs} ms`); return; }
      if (!pauseTimerRef.current) pauseOnSound(`(a sound held ${Date.now() - gate.onsetMs} ms, no words yet)`);
    }, BARGEIN_GATE_POLL_MS);
  }, []);
  // Speech stopped before the gate passed: a blip or the tutor's own voice, not an interruption.
  const onSpeechStop = useCallback(() => { echoRef.current.speechStop(Date.now()); if (soundGateRef.current) { stopSoundGate(); p.current.onDebugEvent?.('v2_bargein_gate_dropped', 'speech stopped first'); } if (flagRef.current.active) return; wordsWatchRef.current.speech('stop'); pronRef.current?.speechStop(); if (!realtimeRef.current?.isSpeechPending() && !turnsRef.current?.busy) showState('processing'); }, []);
  const onNoTranscript = useCallback((kind: string | undefined) => {
    echoRef.current.settled(); ownPartialLoggedRef.current = false; partialWordsRef.current = 0;
    wordsWatchRef.current.settled();
    p.current.onDebugEvent?.('v2_transcription_failed', String(kind ?? 'unknown'));
    lastPartialRef.current = ''; partialVerdictRef.current = 'none'; rollRef.current = { taken: 0, last: '', lookedAt: 0, pending: false, gen: rollRef.current.gen + 1 };
    if (flagRef.current.active) return;
    liftPause();
    if (!realtimeRef.current?.isSpeechPending() && !turnsRef.current?.busy) { showState('listening'); armSilence(); }
  }, [liftPause, armSilence]);
  const onRecogniserError = useCallback((err: Error) => p.current.onDebugEvent?.('v2_recogniser_error', err.message.slice(0, 160)), []);
  // The first words wait for the microphone to be live. The microphone opens about two seconds after the tap,
  // just as the greeting starts to play, and the browser's switch of audio route as it opens swallowed the
  // first word or two ("Hi" or "Hi Praveen" went missing, chemistry, embed-1794512595935). The reply itself is
  // asked for at once; only its sound is held, and never for longer than OPENING_SPEECH_WAIT_MS.
  // Each release is recorded with its timings, so a clipped greeting can be traced to what the microphone was doing.
  const releaseOpeningSpeech = useCallback(() => { const held = openingSpeechRef.current; if (!held) return; openingSpeechRef.current = null; const since = (t: number) => (t && tapAtRef.current ? `${t - tapAtRef.current} ms` : 'never'); p.current.onDebugEvent?.('v2_opening_speech', `released ${since(Date.now())} after the tap; microphone live at ${since(micLiveAtRef.current)}${micLiveAtRef.current ? '' : ' (the wait ran out)'}; ${held.length} sentence(s) were waiting`); for (const s of held) realtimeRef.current?.speakText(s); }, []);
  const onMicLevel = useCallback((level: number) => { if (openingSpeechRef.current && !micLiveRef.current) { micLiveRef.current = true; micLiveAtRef.current = Date.now(); setTimeout(releaseOpeningSpeech, MIC_SETTLE_MS); } if (level > MIC_SOUND_LEVEL) lastSoundAtRef.current = Date.now(); const now = Date.now(); if (now - micUiAtRef.current > 110) { micUiAtRef.current = now; setComposerStatus((was) => (Math.abs((was.level ?? 0) - level) < 0.04 && !(was.quiet && level > MIC_SOUND_LEVEL) ? was : { ...was, level, ...(level > MIC_SOUND_LEVEL ? { quiet: false } : {}) })); } }, [releaseOpeningSpeech]);
  // Fix round 2: a turn that ended with no words is over for the echo clock (Ink gives no transcript for it).
  const onTurnEndedEmpty = useCallback(() => { echoRef.current.settled(); ownPartialLoggedRef.current = false; partialWordsRef.current = 0; }, []);
  const onInkDiagnostic = useCallback((type: string, message: string) => p.current.onDebugEvent?.(type, message), []);
  // The microphone follows the student to a new input device (AirPods taken by a phone, a headset unplugged):
  // without it the lesson went on speaking to a student it could no longer hear (portal-1f1d7348).
  const onMicNotice = useCallback((up: boolean) => setComposerStatus((was) => (!!was.micChanged === up ? was : { ...was, micChanged: up })), []);
  const onMicEvent = useCallback((type: string, message: string) => p.current.onDebugEvent?.(type, message), []);
  useMicReacquire({ enabled: listening, onDebugEvent: onMicEvent, onNotice: onMicNotice });
  // The recogniser's microphone frames (24 kHz) feed the session recording and, when it is on, the pronunciation clip
  // (v1 Task 24 §A1 taps the same frames the recogniser hears).
  const pushStudentChunkRef = useRef(recorder.pushStudentChunk); pushStudentChunkRef.current = recorder.pushStudentChunk;
  const onStudentFrame = useCallback((f: Float32Array) => { pushStudentChunkRef.current(f); pronRef.current?.frame(f); }, []);
  const onPronunciationFrame = useCallback((f: Float32Array) => pronRef.current?.frame(f), []);
  const perception = usePerceptionWS({
    enabled: listening && !TUTOR_STT_ENGINE_INK2,
    // This recogniser's frames never went to the session recording; they feed the clip alone.
    ...(pronunciationOn ? { onStudentAudioFrame: onPronunciationFrame } : {}),
    onTranscript, onSpeechStart, onSpeechStop, onMicLevel, onTranscriptionFailed: onNoTranscript, onError: onRecogniserError,
  });
  const ink = useCartesiaInkWS({
    enabled: listening && TUTOR_STT_ENGINE_INK2,
    onStudentAudioFrame: pronunciationOn ? onStudentFrame : recorder.pushStudentChunk,
    turnEndTimeoutMs: inkTurnEndTimeoutMs(props.tutorLanguages),
    onTranscript, onPartialTranscript: onPartial, onSpeechStart, onSpeechStop, onMicLevel, onTranscriptionFailed: onNoTranscript, onError: onRecogniserError,
    onDiagnostic: onInkDiagnostic,
    onTurnEndedEmpty: onTurnEndedEmpty,
  });
  energyWindowRef.current = TUTOR_STT_ENGINE_INK2 ? ink.getEnergyWindow : perception.getEnergyWindow;

  // The microphone opened again when the device changes (v2/mic-watch.ts, v1 Task 27 §G).
  useEffect(() => {
    if (!TUTOR_MIC_REACQUIRE || typeof window === 'undefined') return;
    const md = typeof navigator !== 'undefined' ? navigator.mediaDevices : undefined;
    const watch = new V2MicWatch({
      captureOpen: sharedMicCaptureOpen, inFlight: sharedMicReacquireInFlight, trackMuted: sharedMicTrackMuted, label: getSharedMicLabel,
      ...(typeof md?.enumerateDevices === 'function' ? { listDevices: () => md.enumerateDevices() } : {}),
      reacquire: (reason) => reacquireSharedMicStream(reason).then((stream) => ({ label: stream.getAudioTracks()[0]?.label ?? '' })),
      log: (type, message) => p.current.onDebugEvent?.(type, message),
      notice: (on) => p.current.onStageNotice?.(on ? micChangedLabel(thinkingCueLanguage(p.current.tutorLanguages, spokenRef.current[spokenRef.current.length - 1])) : null),
      now: () => Date.now(), setTimer: (fn, ms) => setTimeout(fn, ms), clearTimer: (h) => clearTimeout(h as ReturnType<typeof setTimeout>),
    });
    const onDeviceChange = () => watch.deviceChange();
    const onTrack = (e: Event) => watch.trackEvent((e as CustomEvent<{ kind?: string }>).detail?.kind);
    const onFrame = () => watch.frame();
    md?.addEventListener?.('devicechange', onDeviceChange);
    window.addEventListener('evelyn:shared-mic-track', onTrack);
    window.addEventListener('evelyn:shared-mic-frame', onFrame);
    return () => { md?.removeEventListener?.('devicechange', onDeviceChange); window.removeEventListener('evelyn:shared-mic-track', onTrack); window.removeEventListener('evelyn:shared-mic-frame', onFrame); watch.dispose(); };
  }, []);

  // The student's switch for their microphone. Off, nothing in the room reaches the tutor; a student in a noisy
  // room keeps it off while they listen and turns it on to speak (v1 had the button; v2 had lost it).
  const recogniserRef = useRef<{ setMuted: (muted: boolean) => void } | null>(null); recogniserRef.current = TUTOR_STT_ENGINE_INK2 ? ink : perception;
  const toggleMic = useCallback(() => {
    const muted = !micMutedRef.current;
    micMutedRef.current = muted;
    recogniserRef.current?.setMuted(muted);
    p.current.onDebugEvent?.('v2_mic', muted ? 'switched off by the student' : 'switched on by the student');
    if (!muted) handUnmuteAtRef.current = Date.now();
    else {
      // With the microphone off the recogniser is sent nothing, so the stretch being spoken never ends by itself
      // (its end arrives when the student next speaks). What it holds so far is dealt with now.
      const total = lastPartialRef.current.trim().split(/\s+/).filter(Boolean).length;
      const rest = afterWords(lastPartialRef.current, rollRef.current.taken);
      rollRef.current = { ...rollRef.current, taken: total, last: '' };
      const byHand = handUnmuteAtRef.current > 0 && Date.now() - handUnmuteAtRef.current < ROOM_HAND_TURN_MS;
      handUnmuteAtRef.current = 0;
      liftPause();
      if (rest && !flagRef.current.active && !isOwnVoice(rest, spokenRef.current)) {
        // Switched on, spoken, switched off: a turn taken by hand, theirs without being asked about.
        if (byHand || !ROOM_VOICES_ON) { p.current.onDebugEvent?.('v2_mic', `a turn taken by hand (on, speak, off): ${rest.slice(0, 300)}`); takeFloorRef.current?.(rest); }
        else void studentWords(rest).then((words) => { if (words && !flagRef.current.active) takeFloorRef.current?.(words); });
      }
    }
    setComposerStatus((was) => ({ ...was, muted, ...(muted ? { heard: undefined } : {}) }));
    p.current.onVoiceStateChange?.(muted ? 'muted' : realtimeRef.current?.isSpeechPending() ? 'speaking' : turnsRef.current?.busy ? 'thinking' : 'listening');
  }, [liftPause, studentWords]);

  // Start needs a tap: browsers only release audio to a page after a gesture.
  const start = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    setStarted(true);
    const rt = realtimeRef.current!;
    rt.unlockAudio(); tapAtRef.current = Date.now();
    setTimeout(releaseOpeningSpeech, OPENING_SPEECH_WAIT_MS);
    if (p.current.thinkingCue) primeThinkingCueAudio();
    void rt.connect().then(() => { rt.startListening(); }).catch((err) => p.current.onError?.(err instanceof Error ? err : new Error(String(err))));
    // The tutor's first words do not wait for the microphone.
    turnsRef.current?.open();
  }, []);

  useEffect(() => () => { wordsWatchRef.current.settled(); echoRef.current.settled(); stopSoundGate(); pronRef.current?.disarm(); releaseBoard(); clearSilence(); if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current); turnsRef.current?.abort(); realtimeRef.current?.disconnect(); }, []);

  // A resumed session waits for a tap, as any session does (audio needs one): the page shows "Continue lesson".
  useEffect(() => { if (turns.resumedRef.current && !startedRef.current) p.current.onResumeAwaitingTapChange?.(true); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const ref = props.handleRef;
    if (!ref) return;
    ref.current = {
      ...V2_HANDLE_STUBS,
      startSession: start,
      resumeContinue: () => { p.current.onResumeAwaitingTapChange?.(false); start(); },
      sendTextMessage: (text) => { if (!startedRef.current) start(); heard(text, { typed: true }); },
      speakText: (text) => realtimeRef.current?.speakText(text),
      stopSpeaking: () => { echoRef.current.stopped(Date.now()); void realtimeRef.current?.clearSpeechQueue(); voiceResumed(); },
      setTutorVoiceMuted: (muted) => realtimeRef.current?.setVoiceMuted(muted),
      endSession: (opts) => { clearSilence(); echoRef.current.stopped(Date.now()); void realtimeRef.current?.clearSpeechQueue(); voiceResumed(); turnsRef.current?.end(opts); },
      isEnding: () => turnsRef.current?.isEnding() ?? false,
      getSpokenCaption: () => captionsRef.current.poll(realtimeRef.current?.getSpokenProgress() ?? null),
    };
    return () => { ref.current = null; };
  }, [props.handleRef, start, heard]);

  const flagSession = useMemo(() => {
    // One folder per session: by student, every session's flags ran together in one file.
    if (props.sessionId) return props.sessionId;
    try { return String(JSON.parse(atob((props.embedToken ?? '').split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))).student_id || 'session'); } catch { return 'session'; }
  }, [props.embedToken, props.sessionId]);
  const flagSnapshot = useCallback(() => {
    const state = turnsRef.current?.stateRef.current;
    const text = (m: { content: unknown } | undefined) => !m ? '' : typeof m.content === 'string' ? m.content : (m.content as Array<{ type: string; text?: string }>).filter((b) => b.type === 'text').map((b) => b.text).join(' ');
    const last = (role: string) => text([...(state?.history ?? [])].reverse().find((m) => m.role === role));
    return {
      turns: state?.history.length ?? 0,
      // Task 7n fix round 1 (M7): the lesson clock (less the flag time), as the engine reads it.
      minutesIn: state ? Math.round(((TUTOR_V2_FLAG_CLOCK_PAUSE ? v2LessonNowMs(Date.now(), state) : Date.now()) - state.startedAtMs) / 6000) / 10 : 0,
      tutorBusy: !!turnsRef.current?.busy,
      // The reply being spoken when the flag was raised: every sentence sent to the voice, and how many had begun.
      speaking: { sentences: turnSentencesRef.current, begun: startedCountRef.current },
      lastStudent: last('user').slice(-600), lastTutor: last('assistant').slice(-1500),
      boardWaiting: heldBoardRef.current.map((h) => h.what),
      board: state?.board,
    };
  }, []);
  const reviewNotes = useMemo(() => reviewNotesClaim(props.embedToken), [props.embedToken]);
  const reviewNote = useCallback((lines: string[]) => { for (const line of lines) p.current.onDebugEvent?.('v2_review_note', line); }, []);
  // Task 7n (FLAG_CLOCK_PAUSE): an open flag holds the lesson clock (useV2Turns pauseClock) and the host's clock message (the
  // embed page's evelyn:clock, told by a window event). Only this debug tool pauses the clock.
  const holdClock = (paused: boolean) => {
    if (!TUTOR_V2_FLAG_CLOCK_PAUSE || !V2_CLOCK_PAUSE_HONOURED) return;
    turnsRef.current?.pauseClock(paused);
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('evelyn:lesson-clock-paused', { detail: { paused } }));
  };
  const flagStart = useCallback(() => { clearSilence(); stopSoundGate(); if (pauseTimerRef.current) { clearTimeout(pauseTimerRef.current); pauseTimerRef.current = null; } soundPauseRef.current = false; realtimeRef.current?.pauseSpeech(); voicePaused(); p.current.onDebugEvent?.('v2_flag', 'opened'); holdClock(true); }, []);
  const flagStop = useCallback(() => {
    p.current.onDebugEvent?.('v2_flag', 'closed');
    holdClock(false);
    resumeVoice();
    // Closing a flag starts nothing: the lesson is where it was. The indicator goes back to what is true now
    // (it showed "Thinking…" after a flag, as if the note had been taken for an answer).
    if (!realtimeRef.current?.isSpeechPending() && !turnsRef.current?.busy) { showState('listening'); armSilence(soonAfterSpeechRef.current); }
  }, [armSilence]);

  return (<>
    {(V2_FLAGS_ON || reviewNotes) && started && <V2FlagBar session={flagSession} flagRef={flagRef} snapshot={flagSnapshot} onStart={flagStart} onStop={flagStop} onReviewNote={reviewNotes ? reviewNote : undefined} ended={turns.closed} />}
    <V2Composer
      composerSlot={props.composerSlot}
      closed={turns.closed}
      busy={turns.busy}
      onSend={(text) => { if (!startedRef.current) start(); heard(text, { typed: true }); }}
      placeholder="Type here if you can't speak…"
      status={started ? composerStatus : undefined}
      mic={started && !turns.closed ? { muted: !!composerStatus.muted, onToggle: toggleMic } : undefined}
    />
  </>);
}
