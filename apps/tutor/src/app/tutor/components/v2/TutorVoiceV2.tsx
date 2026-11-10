'use client';
/**
 * Tutor brain v2 — the session client for VOICE sessions (design §4.8). FIRST CUT.
 *
 * Audio is the existing hook (useOpenAIRealtime in relay mode): it owns the
 * microphone, speech recognition, the speech queue and playback, exactly as it
 * does for v1. This file joins it to the v2 turn loop:
 *   student's words (recognised or typed)  → a turn
 *   each finished sentence of the reply     → the speech queue
 *   the student speaking over the tutor     → stop speaking, answer them
 *   a long silence                          → a turn that says the student is silent
 *
 * NOT carried over from VoiceTutorRealtime yet (see the inventory,
 * docs/superpowers/specs/2026-11-09-vtr-non-teaching-inventory.md): the
 * perception socket and its barge-in gating, pause-first interruption, the
 * thinking cue and fillers, session recording, mic re-acquire, caption sync,
 * resume, standby and host video, the hard time stop. This cut has not been
 * tried with a real microphone.
 */
import { useCallback, useEffect, useRef, type MutableRefObject, type ReactNode } from 'react';
import { useOpenAIRealtime, type OpenAIVoice } from '@/app/tutor/hooks/useOpenAIRealtime';
import type { RealtimeHandle } from '@/lib/tutor/orchestrator/types';
import { V2Composer, V2_HANDLE_STUBS } from './TutorClientV2';
import { useV2Turns, type V2TurnsConfig } from './useV2Turns';
import { isOwnVoice } from '@/lib/tutor/v2/own-voice';
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

export default function TutorVoiceV2(props: TutorVoiceV2Props) {
  const p = useRef(props); p.current = props;
  const spokenRef = useRef<string[]>([]);
  const startedRef = useRef(false);
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
  const armSilence = useCallback(() => {
    clearSilence();
    const wait = SILENCE_STEPS_S[silenceStepRef.current];
    if (wait === undefined) return;
    silenceTimerRef.current = setTimeout(() => {
      const rt = realtimeRef.current; const turns = turnsRef.current;
      if (!rt || !turns || turns.isEnding()) return;
      if (rt.isSpeechPending()) { armSilence(); return; }
      silenceStepRef.current += 1;
      p.current.onDebugEvent?.('idle_nudge_v2', `${wait}s of silence`);
      turns.nudge(wait);
    }, wait * 1000);
  }, []);

  const turns = useV2Turns({
    ...props,
    mode: 'voice',
    onSentence: (sentence) => { waitingRef.current = false; cueRef.current = cueStop(); spokenRef.current = [...spokenRef.current.slice(-7), sentence]; realtimeRef.current?.speakText(sentence); },
    onCut: () => { void realtimeRef.current?.clearSpeechQueue(); p.current.onDebugEvent?.('bargein_v2', 'student spoke over the tutor'); },
    onTutorBusy: (busy) => {
      props.onTutorBusy?.(busy);
      if (busy) { clearSilence(); waitingRef.current = true; realtimeRef.current?.signalBrainThinking(true); p.current.onVoiceStateChange?.('thinking'); }
      else { waitingRef.current = false; cueRef.current = cueStop(); realtimeRef.current?.signalBrainThinking(false); armSilence(); }
    },
    // The session ends once the closing words have been spoken.
    closeDelayMs: async () => {
      const end = Date.now() + 60000;
      while (Date.now() < end && realtimeRef.current?.isSpeechPending()) await new Promise((r) => setTimeout(r, 300));
      await new Promise((r) => setTimeout(r, 1200));
    },
  });
  turnsRef.current = turns;

  const heard = useCallback((transcript: string, opts?: { typed?: boolean }) => {
    const text = transcript.trim();
    if (!text) return;
    // The microphone hears the tutor too. Words that are the tutor's own, arriving while it speaks, are not the student.
    if (!opts?.typed && realtimeRef.current?.isSpeechPending() && isOwnVoice(text, spokenRef.current)) {
      p.current.onDebugEvent?.('own_voice_dropped_v2', text.slice(0, 80));
      return;
    }
    silenceStepRef.current = 0;
    if (p.current.thinkingCue) { const r = cueTurnAccepted(cueRef.current, Date.now()); cueRef.current = r.state; play(r.play); }
    turnsRef.current?.send(text);
  }, []);

  const realtime = useOpenAIRealtime({
    instructions: TRANSPORT_ONLY,
    voice: props.voice,
    reconnectEnabled: true,
    embedToken: props.embedToken,
    relayMode: {
      instructions: TRANSPORT_ONLY,
      onUserTranscript: (transcript, opts) => heard(transcript, opts),
      ttsProvider: props.ttsProvider,
      cartesiaVoiceId: props.cartesiaVoiceId,
      cartesiaVoiceSpeed: props.cartesiaVoiceSpeed,
      ...(props.tutorLanguages ? { tutorLanguages: props.tutorLanguages } : {}),
      ...(props.speechRate !== undefined ? { speechRate: props.speechRate } : {}),
      studentName: props.studentName,
    },
    onError: (err) => props.onError?.(err),
    onStateChange: (state) => {
      if (state === 'speaking') p.current.onVoiceStateChange?.('speaking');
      else if (state === 'listening' || state === 'connected') p.current.onVoiceStateChange?.(turnsRef.current?.busy ? 'thinking' : 'listening');
      else if (state === 'error') p.current.onVoiceStateChange?.('error');
    },
    onTtsPlaybackProgress: (event) => { if (event === 'drain' && !turnsRef.current?.busy) armSilence(); },
  });
  realtimeRef.current = realtime;

  // Start needs a tap: browsers only release audio to a page after a gesture.
  const start = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    const rt = realtimeRef.current!;
    rt.unlockAudio();
    if (p.current.thinkingCue) primeThinkingCueAudio();
    void rt.connect().then(() => { rt.startListening(); }).catch((err) => p.current.onError?.(err instanceof Error ? err : new Error(String(err))));
    // The tutor's first words do not wait for the microphone.
    turnsRef.current?.open();
  }, []);

  useEffect(() => () => { clearSilence(); turnsRef.current?.abort(); realtimeRef.current?.disconnect(); }, []);

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
