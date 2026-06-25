'use client';

/**
 * Perception WS Hook — Stage 0 of the Voice Perception Layer
 *
 * Parallel WebSocket to `gpt-realtime-2` running in TRANSCRIPTION-ONLY mode.
 * Does not affect the production WS (`useOpenAIRealtime`) in any way:
 *
 *   - Owns its own getUserMedia (separate MediaStream from production).
 *   - Never authors audio, text, or tool calls.
 *   - Never gates the production WS's mic.
 *   - Emits events upward via callbacks; the caller decides what to do
 *     with them. At Stage 0 the caller logs them and nothing else.
 *
 * See `memory/project_voice_perception_layer_design.md` for the locked
 * design (decisions Q1, Q1.5, Q4, Q6 govern this hook).
 *
 * Discipline contract: stages 0-3 ADD code, they do not modify existing
 * useOpenAIRealtime.ts behaviour. The reversal lever is removing the
 * `NEXT_PUBLIC_TUTOR_PERCEPTION_STAGE` env var (or returning early in
 * the wiring layer), at which point this hook is a no-op.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

export type PerceptionState =
  | 'disabled'
  | 'connecting'
  | 'connected'
  | 'listening'
  | 'reconnecting'
  | 'degraded'
  | 'error';

export interface PerceptionTranscript {
  /** Transcript text as returned by the perception model. */
  text: string;
  /** ms since perception session start (perceptionT0). */
  tMs: number;
  /** ms-resolution duration from speech_started → transcription.completed.
   *  Useful to compare against the production WS's transcription latency. */
  latencyMs: number;
  /** OpenAI-side item id, useful to delete if we ever needed to scrub. */
  itemId?: string;
}

export interface PerceptionSpeechEvent {
  /** ms since perception session start. */
  tMs: number;
  /** Audio offset in the input buffer (server-reported). */
  audioStartMs?: number;
  audioEndMs?: number;
}

export interface UsePerceptionWSOptions {
  /** Master enable. When false the hook is a no-op (no WS, no mic). Default
   *  false; the wiring layer flips this based on
   *  NEXT_PUBLIC_TUTOR_PERCEPTION_STAGE and the runtime override
   *  window.__tutorPerceptionStage. */
  enabled: boolean;
  /** Tag attached to every console line so logs can be filtered in dev. */
  logPrefix?: string;
  /** Voice Activity Detection parameters; mirror the production WS so the
   *  perception WS detects the same turns. Defaults match the production
   *  defaults (0.8 / 1500 / 500). */
  vadThreshold?: number;
  vadSilenceDurationMs?: number;
  vadPrefixPaddingMs?: number;
  /** Callbacks — all optional. At Stage 0 the wiring layer subscribes to
   *  onTranscript so it can write a `[PERCEPTION]` log line tagged with the
   *  current production WS state. */
  onSpeechStart?: (e: PerceptionSpeechEvent) => void;
  onSpeechStop?: (e: PerceptionSpeechEvent) => void;
  /** Live student-mic amplitude (0..1, already scaled) emitted ~12×/sec from
   *  the audio processor, for the "being heard" indicator. Emits 0 while muted. */
  onMicLevel?: (level: number) => void;
  onTranscript?: (t: PerceptionTranscript) => void;
  onTranscriptionFailed?: (errorType: string | undefined) => void;
  onStateChange?: (state: PerceptionState) => void;
  onError?: (err: Error) => void;
}

export interface UsePerceptionWSResult {
  state: PerceptionState;
  /** Manual control surface — the wiring layer hooks these into the session
   *  Start button so the perception WS comes up alongside the production WS. */
  connect: () => Promise<void>;
  disconnect: () => void;
  /** Mute/unmute the perception mic. Wired to the student mute button so
   *  muting actually stops input now that perception owns the mic (Stage 4). */
  setMuted: (muted: boolean) => void;
}

const PERCEPTION_SAMPLE_RATE = 24000;
const TRANSCRIPTION_WATCHDOG_MS = 12000;

interface ResamplerState { phase: number; carry: number | null }

function resampleLinear(
  input: Float32Array,
  fromRate: number,
  toRate: number,
  state: ResamplerState,
): Float32Array {
  if (fromRate === toRate) return input;
  const ratio = fromRate / toRate;
  const out = new Float32Array(Math.ceil(input.length / ratio) + 1);
  let outIdx = 0;
  let srcIdx = state.phase;
  while (srcIdx < input.length) {
    const i0 = Math.floor(srcIdx);
    const frac = srcIdx - i0;
    let s0: number;
    let s1: number;
    if (i0 < 0) {
      s0 = state.carry ?? input[0];
      s1 = input[0];
    } else if (i0 + 1 >= input.length) {
      break;
    } else {
      s0 = input[i0];
      s1 = input[i0 + 1];
    }
    out[outIdx++] = s0 * (1 - frac) + s1 * frac;
    srcIdx += ratio;
  }
  state.phase = srcIdx - input.length;
  state.carry = input[input.length - 1];
  return out.subarray(0, outIdx);
}

function float32ToBase64PCM16(input: Float32Array): string {
  const int16 = new Int16Array(input.length);
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]));
    int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  const bytes = new Uint8Array(int16.buffer);
  let binary = '';
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode.apply(
      null,
      Array.from(bytes.subarray(i, i + CHUNK)),
    );
  }
  return btoa(binary);
}

// Module-scoped so multiple hook instances inside React StrictMode dev
// double-mounts share the same AudioContext (Chrome caps total contexts
// per page).
let perceptionAudioContext: AudioContext | null = null;
function getPerceptionAudioContext(): AudioContext {
  if (!perceptionAudioContext) {
    perceptionAudioContext = new AudioContext({ sampleRate: PERCEPTION_SAMPLE_RATE });
  }
  return perceptionAudioContext;
}

export function usePerceptionWS(options: UsePerceptionWSOptions): UsePerceptionWSResult {
  const {
    enabled,
    logPrefix = '[Perception]',
    vadThreshold = 0.8,
    vadSilenceDurationMs = 1500,
    vadPrefixPaddingMs = 500,
    onSpeechStart,
    onSpeechStop,
    onMicLevel,
    onTranscript,
    onTranscriptionFailed,
    onStateChange,
    onError,
  } = options;

  const [state, setStateInternal] = useState<PerceptionState>('disabled');

  // Refs so stable callbacks see the latest values without re-instantiating.
  const onSpeechStartRef = useRef(onSpeechStart);
  const onSpeechStopRef = useRef(onSpeechStop);
  const onMicLevelRef = useRef(onMicLevel);
  const onTranscriptRef = useRef(onTranscript);
  const onTranscriptionFailedRef = useRef(onTranscriptionFailed);
  const onStateChangeRef = useRef(onStateChange);
  const onErrorRef = useRef(onError);
  onSpeechStartRef.current = onSpeechStart;
  onSpeechStopRef.current = onSpeechStop;
  onMicLevelRef.current = onMicLevel;
  onTranscriptRef.current = onTranscript;
  onTranscriptionFailedRef.current = onTranscriptionFailed;
  onStateChangeRef.current = onStateChange;
  onErrorRef.current = onError;

  const wsRef = useRef<WebSocket | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  // Mute gate (2026-06-16). With perception as the sole input authority,
  // the student mute button must gate THIS mic — otherwise muting only
  // silences the (now input-less) production WS while perception keeps
  // transcribing ambient sound (observed: train announcements fired brain
  // turns while "muted"). When true, onaudioprocess stops appending audio.
  const mutedRef = useRef<boolean>(false);
  const sessionUpdateSentRef = useRef<boolean>(false);
  const perceptionT0Ref = useRef<number>(0);
  const speechStartedAtRef = useRef<number>(0);
  const intentionallyDisconnectedRef = useRef<boolean>(false);
  const transcriptionWatchdogRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttemptsRef = useRef<number>(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cachedClientSecretRef = useRef<string | null>(null);

  // Mirror VAD params in refs so the connect closure (constructed once)
  // sees latest values.
  const vadRef = useRef({ vadThreshold, vadSilenceDurationMs, vadPrefixPaddingMs });
  vadRef.current = { vadThreshold, vadSilenceDurationMs, vadPrefixPaddingMs };

  const setState = useCallback((next: PerceptionState) => {
    setStateInternal((prev) => {
      if (prev === next) return prev;
      // warn-level so the browser→server log bridge surfaces lifecycle
      // transitions in the dev terminal alongside the production WS logs.
      console.warn(`${logPrefix} state: ${prev} → ${next}`);
      try { onStateChangeRef.current?.(next); } catch {}
      return next;
    });
  }, [logPrefix]);

  const clearWatchdog = useCallback(() => {
    if (transcriptionWatchdogRef.current) {
      clearTimeout(transcriptionWatchdogRef.current);
      transcriptionWatchdogRef.current = null;
    }
  }, []);

  const teardownMic = useCallback(() => {
    if (processorRef.current) {
      try { processorRef.current.disconnect(); } catch {}
      processorRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
  }, []);

  const teardownWS = useCallback(() => {
    if (wsRef.current) {
      try { wsRef.current.close(); } catch {}
      wsRef.current = null;
    }
  }, []);

  const mintToken = useCallback(async (): Promise<string | null> => {
    try {
      const resp = await fetch('/api/tutor/perception-token', { method: 'POST' });
      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`perception-token ${resp.status}: ${text}`);
      }
      const data = await resp.json();
      if (!data?.client_secret) throw new Error('perception-token: missing client_secret');
      cachedClientSecretRef.current = data.client_secret;
      return data.client_secret;
    } catch (err) {
      console.error(`${logPrefix} mintToken error:`, err);
      onErrorRef.current?.(err instanceof Error ? err : new Error('perception-token failure'));
      return null;
    }
  }, [logPrefix]);

  const sendSessionUpdate = useCallback((ws: WebSocket) => {
    if (sessionUpdateSentRef.current) return;
    if (ws.readyState !== WebSocket.OPEN) return;
    sessionUpdateSentRef.current = true;
    const { vadThreshold: t, vadSilenceDurationMs: s, vadPrefixPaddingMs: p } = vadRef.current;
    ws.send(JSON.stringify({
      type: 'session.update',
      session: {
        type: 'realtime',
        // No tools, no output audio — transcription-only.
        audio: {
          input: {
            transcription: { model: 'whisper-1' },
            turn_detection: {
              type: 'server_vad',
              threshold: t,
              prefix_padding_ms: p,
              silence_duration_ms: s,
              // Never let the server author a response: this WS is a
              // pure sink for student audio → transcripts.
              create_response: false,
            },
          },
        },
      },
    }));
    console.warn(`${logPrefix} session.update sent (transcription-only)`);
  }, [logPrefix]);

  const startMic = useCallback(async () => {
    try {
      // Independent MediaStream from the production WS. Browsers share
      // the underlying hardware but each consumer gets its own track.
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: PERCEPTION_SAMPLE_RATE,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      mediaStreamRef.current = stream;

      const ctx = getPerceptionAudioContext();
      if (ctx.state === 'suspended') {
        try { await ctx.resume(); } catch {}
      }

      const source = ctx.createMediaStreamSource(stream);
      const processor = ctx.createScriptProcessor(4096, 1, 1);
      const captureRate = ctx.sampleRate;
      const resamplerState: ResamplerState = { phase: 0, carry: null };

      processor.onaudioprocess = (e) => {
        const ws = wsRef.current;
        if (!ws || ws.readyState !== WebSocket.OPEN) return;
        // Muted: don't forward audio to the perception transcriber, and report
        // a flat level so the "being heard" meter goes calm.
        if (mutedRef.current) { try { onMicLevelRef.current?.(0); } catch {} return; }
        const inputData = e.inputBuffer.getChannelData(0);
        // Live mic amplitude (RMS) for the "being heard" indicator. Cheap over
        // 4096 samples; this processor fires ~12×/sec so no extra throttle is
        // needed. Scaled so normal speech lands mid-range, then clamped 0..1.
        let sumSq = 0;
        for (let i = 0; i < inputData.length; i++) sumSq += inputData[i] * inputData[i];
        const rms = Math.sqrt(sumSq / inputData.length);
        try { onMicLevelRef.current?.(Math.min(1, rms * 6)); } catch {}
        const resampled = captureRate === PERCEPTION_SAMPLE_RATE
          ? inputData
          : resampleLinear(inputData, captureRate, PERCEPTION_SAMPLE_RATE, resamplerState);
        const base64Audio = float32ToBase64PCM16(resampled);
        try {
          ws.send(JSON.stringify({
            type: 'input_audio_buffer.append',
            audio: base64Audio,
          }));
        } catch {
          // Send race during reconnect; safe to drop.
        }
      };

      source.connect(processor);
      processor.connect(ctx.destination);
      processorRef.current = processor;
      setState('listening');
      console.warn(`${logPrefix} microphone started (independent stream)`);
    } catch (err) {
      console.error(`${logPrefix} mic error:`, err);
      const e = err instanceof Error ? err : new Error('Perception mic access failed');
      onErrorRef.current?.(e);
      setState('error');
    }
  }, [logPrefix, setState]);

  const handleMessage = useCallback((evt: MessageEvent) => {
    let data: { type?: string; [k: string]: unknown };
    try {
      data = JSON.parse(evt.data);
    } catch {
      return;
    }
    const type = data.type;
    if (!type) return;
    if (!type.startsWith('rate_limits')) {
      // Verbose log; useful for Stage 0 comparison work.
      console.log(`${logPrefix} event:`, type);
    }
    switch (type) {
      case 'session.created':
        setState('connected');
        // Some realtime servers will accept session.update only after
        // session.created lands; resend defensively.
        if (wsRef.current) sendSessionUpdate(wsRef.current);
        break;
      case 'session.updated':
        break;
      case 'input_audio_buffer.speech_started': {
        const now = Date.now();
        speechStartedAtRef.current = now;
        const tMs = perceptionT0Ref.current ? now - perceptionT0Ref.current : 0;
        const audioStartMs = typeof data.audio_start_ms === 'number' ? data.audio_start_ms : undefined;
        try { onSpeechStartRef.current?.({ tMs, audioStartMs }); } catch {}
        break;
      }
      case 'input_audio_buffer.speech_stopped': {
        const now = Date.now();
        const tMs = perceptionT0Ref.current ? now - perceptionT0Ref.current : 0;
        const audioEndMs = typeof data.audio_end_ms === 'number' ? data.audio_end_ms : undefined;
        try { onSpeechStopRef.current?.({ tMs, audioEndMs }); } catch {}
        // Arm the transcription watchdog. Fires if Whisper never returns
        // (matches the production WS pattern; recover via reconnect).
        clearWatchdog();
        transcriptionWatchdogRef.current = setTimeout(() => {
          console.warn(`${logPrefix} transcription watchdog fired — no transcript in ${TRANSCRIPTION_WATCHDOG_MS}ms`);
          transcriptionWatchdogRef.current = null;
          const ws = wsRef.current;
          if (ws && ws.readyState !== WebSocket.OPEN && !intentionallyDisconnectedRef.current) {
            // Tear-down will trigger ws.onclose → scheduleReconnect.
            try { ws.close(); } catch {}
          }
        }, TRANSCRIPTION_WATCHDOG_MS);
        break;
      }
      case 'conversation.item.input_audio_transcription.completed': {
        clearWatchdog();
        reconnectAttemptsRef.current = 0;
        const text = typeof data.transcript === 'string' ? data.transcript.trim() : '';
        const now = Date.now();
        const tMs = perceptionT0Ref.current ? now - perceptionT0Ref.current : 0;
        const latencyMs = speechStartedAtRef.current ? now - speechStartedAtRef.current : 0;
        const itemId = typeof data.item_id === 'string' ? data.item_id : undefined;
        // warn-level so each perception transcript appears in the dev
        // terminal next to the production hook's `[Realtime] User transcript:`
        // lines — the Stage 0 (and Stage 1) agreement-rate review signal.
        console.warn(`${logPrefix} transcript (${latencyMs}ms): ${JSON.stringify(text)}`);
        try { onTranscriptRef.current?.({ text, tMs, latencyMs, itemId }); } catch {}
        break;
      }
      case 'conversation.item.input_audio_transcription.failed': {
        clearWatchdog();
        const errorType = typeof (data.error as { type?: string } | undefined)?.type === 'string'
          ? (data.error as { type?: string }).type
          : undefined;
        console.warn(`${logPrefix} transcription failed:`, errorType);
        try { onTranscriptionFailedRef.current?.(errorType); } catch {}
        break;
      }
      case 'error': {
        console.error(`${logPrefix} server error:`, data.error);
        break;
      }
      default:
        break;
    }
  }, [clearWatchdog, logPrefix, sendSessionUpdate, setState]);

  // Connect + reconnect ladder. Modeled on the production WS pattern from
  // commit 8bc8aab (0/1s/3s, max 3 attempts, reset on
  // transcription.completed).
  const connectRef = useRef<() => Promise<void>>(async () => {});
  const scheduleReconnectRef = useRef<() => boolean>(() => false);

  const scheduleReconnect = useCallback((): boolean => {
    if (intentionallyDisconnectedRef.current) return false;
    if (reconnectAttemptsRef.current >= 3) {
      console.warn(`${logPrefix} reconnect ladder exhausted — degrading`);
      reconnectAttemptsRef.current = 0;
      setState('degraded');
      return false;
    }
    const attemptIndex = reconnectAttemptsRef.current;
    const delayMs = [0, 1000, 3000][attemptIndex] ?? 3000;
    reconnectAttemptsRef.current = attemptIndex + 1;
    setState('reconnecting');
    console.warn(`${logPrefix} scheduling reconnect ${attemptIndex + 1}/3 in ${delayMs}ms`);
    if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
    reconnectTimerRef.current = setTimeout(() => {
      reconnectTimerRef.current = null;
      connectRef.current().catch((err) => {
        console.error(`${logPrefix} reconnect attempt error:`, err);
      });
    }, delayMs);
    return true;
  }, [logPrefix, setState]);
  scheduleReconnectRef.current = scheduleReconnect;

  const connect = useCallback(async (): Promise<void> => {
    if (!enabled) return;
    if (wsRef.current && wsRef.current.readyState <= WebSocket.OPEN) return;

    intentionallyDisconnectedRef.current = false;
    setState('connecting');
    perceptionT0Ref.current = perceptionT0Ref.current || Date.now();

    // Re-use cached secret on first reconnect; mint fresh on initial
    // connect + on subsequent ladder attempts (cheap; OpenAI tokens
    // are stateless).
    let secret = cachedClientSecretRef.current;
    if (!secret || reconnectAttemptsRef.current > 1) {
      secret = await mintToken();
    }
    if (!secret) {
      setState('error');
      // Fall through the reconnect ladder anyway — transient mint failures
      // shouldn't tank the session.
      scheduleReconnectRef.current?.();
      return;
    }

    // Use the same hostname / model id pattern as the production hook.
    // Model id is hardcoded here (matches the route default); change
    // both together if the model identifier ever needs a swap.
    const model = 'gpt-realtime-2';
    const ws = new WebSocket(
      `wss://api.openai.com/v1/realtime?model=${model}`,
      ['realtime', `openai-insecure-api-key.${secret}`],
    );

    sessionUpdateSentRef.current = false;

    ws.onopen = () => {
      console.warn(`${logPrefix} WS opened`);
      sendSessionUpdate(ws);
      // Start mic only after WS is open so audio chunks land in a live
      // socket (avoids onaudioprocess racing the handshake).
      if (!processorRef.current) {
        void startMic();
      } else {
        setState('listening');
      }
    };

    ws.onmessage = handleMessage;

    ws.onerror = (e) => {
      // WebSocket `error` events carry no actionable detail (they serialize
      // to `{}`) and are ALWAYS followed by `onclose`, which owns the
      // reconnect / 'degraded' handling. The common trigger is the OpenAI
      // Realtime session hitting its ~30-min max duration (close 1006/1005),
      // which auto-recovers — so warn, not error. console.error here tripped
      // the Next.js dev error overlay on a benign, recovered drop (Console5).
      console.warn(`${logPrefix} WS error (transient — onclose handles reconnect):`, e);
      onErrorRef.current?.(new Error('Perception WS error'));
    };

    ws.onclose = (e) => {
      console.log(`${logPrefix} WS closed:`, e.code, e.reason);
      wsRef.current = null;
      sessionUpdateSentRef.current = false;
      clearWatchdog();
      if (!intentionallyDisconnectedRef.current) {
        if (scheduleReconnectRef.current?.()) return;
      }
      setState(intentionallyDisconnectedRef.current ? 'disabled' : 'degraded');
    };

    wsRef.current = ws;
  }, [enabled, handleMessage, logPrefix, mintToken, sendSessionUpdate, startMic, setState, clearWatchdog]);
  connectRef.current = connect;

  const disconnect = useCallback(() => {
    intentionallyDisconnectedRef.current = true;
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    reconnectAttemptsRef.current = 0;
    clearWatchdog();
    teardownMic();
    teardownWS();
    setState('disabled');
  }, [clearWatchdog, teardownMic, teardownWS, setState]);

  // Auto-connect / auto-disconnect on the enabled flag.
  useEffect(() => {
    if (enabled) {
      void connect();
    } else {
      disconnect();
    }
    // We intentionally only re-run on `enabled` — connect/disconnect are
    // stable enough via refs that tying to them would re-run on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  // Tear down on unmount.
  useEffect(() => {
    return () => {
      intentionallyDisconnectedRef.current = true;
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      clearWatchdog();
      teardownMic();
      teardownWS();
    };
  }, [clearWatchdog, teardownMic, teardownWS]);

  // Dev-only triggers. Mirrors the production WS's
  // __tutorForceRealtimeClose pattern (commit 8bc8aab) so reconnect
  // scenarios can be reproduced in seconds, single-variable.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (process.env.NODE_ENV === 'production') return;
    const w = window as unknown as {
      __tutorForcePerceptionClose?: () => void;
      __tutorPerceptionState?: () => PerceptionState;
    };
    w.__tutorForcePerceptionClose = () => {
      console.warn(`${logPrefix}[dev] __tutorForcePerceptionClose() — simulating unintentional drop`);
      try { wsRef.current?.close(); } catch {}
    };
    w.__tutorPerceptionState = () => state;
    return () => {
      delete w.__tutorForcePerceptionClose;
      delete w.__tutorPerceptionState;
    };
  }, [logPrefix, state]);

  // Mute / unmute the perception mic. Called by the student mute button so
  // muting actually stops input now that perception owns the mic. On mute we
  // also clear the server-side input buffer so a partial utterance captured
  // before the mute doesn't transcribe afterward.
  const setMuted = useCallback((muted: boolean) => {
    mutedRef.current = muted;
    if (muted) {
      const ws = wsRef.current;
      if (ws && ws.readyState === WebSocket.OPEN) {
        try { ws.send(JSON.stringify({ type: 'input_audio_buffer.clear' })); } catch {}
      }
    }
    console.warn(`${logPrefix} mic ${muted ? 'muted' : 'unmuted'}`);
  }, [logPrefix]);

  return { state, connect, disconnect, setMuted };
}
