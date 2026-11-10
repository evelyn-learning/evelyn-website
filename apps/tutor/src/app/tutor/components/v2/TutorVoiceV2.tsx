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
import { V2Composer, V2_HANDLE_STUBS } from './TutorClientV2';
import { useV2Turns, type V2TurnsConfig } from './useV2Turns';
import { isOwnVoice } from '@/lib/tutor/v2/own-voice';
import { anchorSentenceIndex } from '@/lib/tutor/v2/board-timing';
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
const WAITED_RECHECK_S = 12;
const MIC_SOUND_LEVEL = 0.12;
/** A held board item is painted after this long whatever the voice is doing. */
const BOARD_HOLD_MAX_MS = 45000;

export default function TutorVoiceV2(props: TutorVoiceV2Props) {
  const p = useRef(props); p.current = props;
  const spokenRef = useRef<string[]>([]);
  const startedRef = useRef(false);
  const [started, setStarted] = useState(false);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Board timing (board-timing.ts): the sentences of the running reply as sent to the voice, how many have
  // started playing, and the board items waiting for theirs.
  const lastSoundAtRef = useRef(0);
  const turnSentencesRef = useRef<string[]>([]);
  const startedCountRef = useRef(0);
  const heldBoardRef = useRef<Array<{ idx: number; paint: () => void; timer: ReturnType<typeof setTimeout> }>>([]);
  const unplacedBoardRef = useRef<Array<{ call: { name: string; sayWith?: string }; paint: () => void }>>([]);
  /** Match waiting board items to the sentences known so far. `final`: no more sentences are coming. */
  const placeBoard = useCallback((final?: boolean) => {
    const still: typeof unplacedBoardRef.current = [];
    for (const u of unplacedBoardRef.current) {
      const idx = anchorSentenceIndex(u.call.sayWith, turnSentencesRef.current);
      if (idx < 0 && !final) { still.push(u); continue; }
      const hold = idx > 0 && startedCountRef.current <= idx;
      p.current.onDebugEvent?.('v2_board_timing', `${u.call.name}: ${idx < 0 ? 'its sentence was not found' : `sentence ${idx + 1} of ${turnSentencesRef.current.length}`}, ${startedCountRef.current} started — ${hold ? 'held' : 'now'}`);
      if (!hold) { u.paint(); continue; }
      const entry = { idx, paint: u.paint, timer: setTimeout(() => { heldBoardRef.current = heldBoardRef.current.filter((h) => h !== entry); u.paint(); }, BOARD_HOLD_MAX_MS) };
      heldBoardRef.current.push(entry);
    }
    unplacedBoardRef.current = still;
  }, []);
  const releaseBoard = useCallback((upTo?: number) => {
    if (upTo === undefined) placeBoard(true);
    const keep: typeof heldBoardRef.current = [];
    for (const h of heldBoardRef.current) {
      if (upTo === undefined || h.idx < upTo) { clearTimeout(h.timer); h.paint(); } else keep.push(h);
    }
    heldBoardRef.current = keep;
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

  const clearSilence = () => { if (silenceTimerRef.current) { clearTimeout(silenceTimerRef.current); silenceTimerRef.current = null; } };
  const armSilence = useCallback((soonS?: number) => {
    clearSilence();
    const wait = soonS ?? SILENCE_STEPS_S[silenceStepRef.current];
    if (wait === undefined) return;
    silenceTimerRef.current = setTimeout(() => {
      const rt = realtimeRef.current; const turns = turnsRef.current;
      if (!rt || !turns || turns.isEnding()) return;
      if (rt.isSpeechPending()) { armSilence(soonS); return; }
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
    onSentence: (sentence) => { turnSentencesRef.current.push(sentence); placeBoard(); waitingRef.current = false; cueRef.current = cueStop(); spokenRef.current = [...spokenRef.current.slice(-7), sentence]; realtimeRef.current?.speakText(sentence); },
    onCut: () => { void realtimeRef.current?.clearSpeechQueue(); releaseBoard(); },
    holdBoard: (call, paint) => {
      if (!call.sayWith || !realtimeRef.current) { paint(); return; }
      // Its sentence may not have been written yet (the model can call the tool first and speak after):
      // wait for it, and place the item as soon as the sentence is known.
      unplacedBoardRef.current.push({ call, paint });
      placeBoard();
    },
    onTutorBusy: (busy) => {
      props.onTutorBusy?.(busy);
      if (busy) { releaseBoard(); turnSentencesRef.current = []; startedCountRef.current = 0; clearSilence(); waitingRef.current = true; realtimeRef.current?.signalBrainThinking(true); p.current.onVoiceStateChange?.('thinking'); }
      else { waitingRef.current = false; cueRef.current = cueStop(); realtimeRef.current?.signalBrainThinking(false); placeBoard(true); if (!realtimeRef.current?.isSpeechPending()) releaseBoard();
        // The tutor chose to say nothing and wait (keep_listening). If the student was in fact finished, it finds out soon.
        armSilence(turnSentencesRef.current.length === 0 && !turnsRef.current?.isEnding() ? WAITED_RECHECK_S : undefined); }
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
    if (!rt?.isSpeechPending() || pauseTimerRef.current) return;
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
    releaseBoard();
    realtimeRef.current?.resumeSpeech();
    silenceStepRef.current = 0;
    if (p.current.thinkingCue) { const r = cueTurnAccepted(cueRef.current, Date.now()); cueRef.current = r.state; play(r.play); }
    turnsRef.current?.send(text);
  }, [liftPause, releaseBoard]);

  // Stable identities, all of them: see the note at the top of this file.
  const onRealtimeError = useCallback((err: Error) => p.current.onError?.(err), []);
  const onRealtimeState = useCallback((state: string) => {
    if (state === 'speaking') p.current.onVoiceStateChange?.('speaking');
    else if (state === 'listening' || state === 'connected') p.current.onVoiceStateChange?.(turnsRef.current?.busy ? 'thinking' : 'listening');
    else if (state === 'error') p.current.onVoiceStateChange?.('error');
  }, []);
  const onPlayback = useCallback((event: string) => {
    // A sentence has begun playing: board items anchored to it (or to an earlier one) appear now.
    if (event === 'sentence-start') { startedCountRef.current += 1; releaseBoard(startedCountRef.current); }
    if (event === 'drain') { if (!turnsRef.current?.busy) { releaseBoard(); armSilence(); } }
  }, [armSilence, releaseBoard]);
  const onRelayTranscript = useCallback((transcript: string, opts?: { typed?: boolean }) => heard(transcript, opts), [heard]);
  const languagesKey = (props.tutorLanguages ?? []).join(',');
  const relayMode = useMemo(() => ({
    instructions: TRANSPORT_ONLY,
    onUserTranscript: onRelayTranscript,
    ttsProvider: props.ttsProvider,
    cartesiaVoiceId: props.cartesiaVoiceId,
    cartesiaVoiceSpeed: props.cartesiaVoiceSpeed,
    ...(languagesKey ? { tutorLanguages: languagesKey.split(',') } : {}),
    ...(props.speechRate !== undefined ? { speechRate: props.speechRate } : {}),
    studentName: props.studentName,
  }), [onRelayTranscript, props.ttsProvider, props.cartesiaVoiceId, props.cartesiaVoiceSpeed, languagesKey, props.speechRate, props.studentName]);
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
  const onSpeechStart = useCallback(() => { clearSilence(); if (!realtimeRef.current?.isSpeechPending()) p.current.onVoiceStateChange?.('hearing'); }, []);
  const onSpeechStop = useCallback(() => { if (!realtimeRef.current?.isSpeechPending() && !turnsRef.current?.busy) p.current.onVoiceStateChange?.('processing'); }, []);
  const onNoTranscript = useCallback((kind: string | undefined) => {
    p.current.onDebugEvent?.('v2_transcription_failed', String(kind ?? 'unknown'));
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

  return (
    <V2Composer
      composerSlot={props.composerSlot}
      closed={turns.closed}
      busy={turns.busy}
      onSend={(text) => { if (!startedRef.current) start(); heard(text, { typed: true }); }}
      placeholder="Type here if you can't speak…"
    />
  );
}
