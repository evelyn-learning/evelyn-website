'use client';

/**
 * Cartesia Ink 2 STT Hook — Task 5 of
 * docs/superpowers/plans/2026-07-06-cartesia-migration-phase2.md.
 *
 * Drop-in alternative to usePerceptionWS.ts (READ THAT FILE FIRST — this
 * hook intentionally reuses its callback/state TYPES verbatim so the
 * mounting site in VoiceTutorRealtime.tsx can pass the exact same callback
 * closures to either hook and swap which one is `enabled` based on
 * `NEXT_PUBLIC_TUTOR_STT_ENGINE`).
 *
 * Differences from usePerceptionWS (by design, not oversight):
 *   - Connects to Cartesia's Ink 2 turn-detection WS instead of OpenAI
 *     Realtime transcription-only mode. Ink 2's own turn detector (VAD +
 *     semantic end-of-turn) replaces server_vad entirely — no
 *     session.update turn_detection config; thresholds are query params
 *     on the connect URL (see below).
 *   - Sends RAW Float32 PCM binary frames (pcm_f32le) — no PCM16
 *     downconvert, no base64 (WebSocket.send() accepts an ArrayBuffer/
 *     TypedArray directly; Ink 2's binary frames are raw samples, not a
 *     JSON envelope like OpenAI's input_audio_buffer.append).
 *   - No manual linear resample: this hook opens its OWN dedicated
 *     AudioContext at INK_SAMPLE_RATE (24000) — unlike getUserMedia's
 *     sampleRate constraint (an unenforced "ideal" hint the hardware can
 *     ignore), an explicit `new AudioContext({ sampleRate })` IS honored
 *     by the browser (it resamples internally), so ctx.sampleRate is
 *     reliably 24000 and onaudioprocess frames need no further work. A
 *     defensive console.warn fires if a browser ever violates this.
 *   - Auth: mints a short-lived Cartesia access token via
 *     POST /api/tutor/cartesia-token (Task 4) and passes it as the
 *     `access_token` query param (verified shape — see that route's header
 *     comment), never a header (browsers can't set custom WS headers) and
 *     never the raw CARTESIA_API_KEY.
 *   - Turn-detection thresholds are Ink 2 query params, env-tunable
 *     (NEXT_PUBLIC_TUTOR_INK_TURN_START/EAGER_END/END/END_TIMEOUT_MS),
 *     defaulting to the Phase-1-verified values (0.8/0.4/0.2/5600ms).
 *   - `onSpeechStart` fires on `turn.start` (barge-in timing signal).
 *     `onSpeechStop` fires on `turn.eager_end` (Ink 2's "turn is probably
 *     over" provisional signal — closest analogue to server_vad's
 *     speech_stopped; drives the "got that — one sec…" UI). The
 *     authoritative final transcript is delivered to `onTranscript` only
 *     on `turn.end`, reconstructed via `reconstructInkFinals` (see below).
 *
 * Verified live-API knowledge (Phase 1 voice-harness, do not re-discover —
 * see scripts/tutor/voice-harness/stt-clients.ts `ink2()` + its inline
 * comment, and the recorded artifacts/stt/run-<timestamp>/events/
 * en-us__sample1__ink2.jsonl fixtures):
 * Ink 2 emits a CUMULATIVE `transcript` string per `turn_id` on every
 * `turn.update` (strictly growing within a turn, never rewritten), then
 * `turn.eager_end` and `turn.end` repeat the same full cumulative text as
 * the last `turn.update` (turn.end is authoritative). End-of-audio control
 * message is `{type:'done'}` — NOT `finalize` (a `finalize` message gets a
 * 400 "Unrecognized message type" error, reproduced in the 20-line partial
 * recording). Endpoint: `wss://api.cartesia.ai/stt/turns/websocket`.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { PerceptionState, PerceptionTranscript, PerceptionSpeechEvent } from './usePerceptionWS';

// Re-exported so call sites (and this file) can use one name for either
// hook's state/event/transcript shapes without a second type family.
export type { PerceptionState as InkState };

export interface InkEvent {
  type?: string;
  turn_id?: string;
  transcript?: string;
  [k: string]: unknown;
}

/**
 * Pure delta-reconstruction, ported verbatim from
 * scripts/tutor/voice-harness/stt-clients.ts `ink2()`'s onMessage hook.
 *
 * Ink 2's `transcript` field is CUMULATIVE per `turn_id` (strictly
 * growing). Feeding a full recorded event stream (or just the messages for
 * a single turn) through this function reconstructs the sequence of
 * incremental deltas — `.join(' ')` on the result reproduces the full
 * utterance text. Because each delta is computed against the LAST cumulative
 * value seen for that turn_id, a repeat message carrying identical text
 * (e.g. turn.end repeating turn.eager_end's cumulative transcript verbatim,
 * the normal/observed sequence — or a genuine duplicate turn.end) yields an
 * empty delta and is silently skipped, so `finals` never double-counts text.
 */
export function reconstructInkFinals(events: InkEvent[]): string[] {
  const finals: string[] = [];
  const prevByTurn = new Map<string, string>();
  for (const evt of events) {
    if (
      (evt.type === 'turn.update' || evt.type === 'turn.eager_end' || evt.type === 'turn.end') &&
      evt.turn_id && typeof evt.transcript === 'string'
    ) {
      const prev = prevByTurn.get(evt.turn_id) ?? '';
      const delta = evt.transcript.startsWith(prev) ? evt.transcript.slice(prev.length).trim() : evt.transcript;
      prevByTurn.set(evt.turn_id, evt.transcript);
      if (delta) finals.push(delta);
    }
  }
  return finals;
}

export interface UseCartesiaInkWSOptions {
  /** Master enable. When false the hook is a no-op (no WS, no mic). The
   *  wiring layer sets this to `perceptionEnabled && STT_ENGINE === 'ink2'`
   *  so exactly one of {usePerceptionWS, useCartesiaInkWS} is ever live. */
  enabled: boolean;
  logPrefix?: string;
  /** Ink 2 turn-detection thresholds — env-tunable, defaults per the
   *  Phase-1-verified values (Global Constraints in the migration plan). */
  turnStartThreshold?: number;
  turnEagerEndThreshold?: number;
  turnEndThreshold?: number;
  turnEndTimeoutMs?: number;
  onSpeechStart?: (e: PerceptionSpeechEvent) => void;
  onSpeechStop?: (e: PerceptionSpeechEvent) => void;
  onMicLevel?: (level: number) => void;
  onTranscript?: (t: PerceptionTranscript) => void;
  onTranscriptionFailed?: (errorType: string | undefined) => void;
  onStateChange?: (state: PerceptionState) => void;
  onError?: (err: Error) => void;
}

export interface UseCartesiaInkWSResult {
  state: PerceptionState;
  connect: () => Promise<void>;
  disconnect: () => void;
  setMuted: (muted: boolean) => void;
}

const INK_SAMPLE_RATE = 24000;
const CARTESIA_VERSION = '2026-03-01';

// env-tunable turn-detection thresholds. NEXT_PUBLIC_* must be referenced
// via static `process.env.NEXT_PUBLIC_X` dot-access (not a computed lookup)
// for Next.js's build-time inlining to work.
function envFloat(raw: string | undefined, fallback: number): number {
  const n = raw !== undefined ? Number.parseFloat(raw) : NaN;
  return Number.isFinite(n) ? n : fallback;
}
const ENV_TURN_START_THRESHOLD = envFloat(process.env.NEXT_PUBLIC_TUTOR_INK_TURN_START, 0.8);
const ENV_TURN_EAGER_END_THRESHOLD = envFloat(process.env.NEXT_PUBLIC_TUTOR_INK_TURN_EAGER_END, 0.4);
const ENV_TURN_END_THRESHOLD = envFloat(process.env.NEXT_PUBLIC_TUTOR_INK_TURN_END, 0.2);
const ENV_TURN_END_TIMEOUT_MS = envFloat(process.env.NEXT_PUBLIC_TUTOR_INK_TURN_END_TIMEOUT_MS, 5600);

// Module-scoped so React StrictMode dev double-mounts share one
// AudioContext (mirrors usePerceptionWS's getPerceptionAudioContext — the
// same Chrome per-page AudioContext cap applies).
let inkAudioContext: AudioContext | null = null;
function getInkAudioContext(): AudioContext {
  if (!inkAudioContext) {
    inkAudioContext = new AudioContext({ sampleRate: INK_SAMPLE_RATE });
  }
  return inkAudioContext;
}

interface TurnBuffer {
  events: InkEvent[];
  finalized: boolean;
  eagerEndFired: boolean;
}

export function useCartesiaInkWS(options: UseCartesiaInkWSOptions): UseCartesiaInkWSResult {
  const {
    enabled,
    logPrefix = '[Ink2]',
    turnStartThreshold = ENV_TURN_START_THRESHOLD,
    turnEagerEndThreshold = ENV_TURN_EAGER_END_THRESHOLD,
    turnEndThreshold = ENV_TURN_END_THRESHOLD,
    turnEndTimeoutMs = ENV_TURN_END_TIMEOUT_MS,
    onSpeechStart,
    onSpeechStop,
    onMicLevel,
    onTranscript,
    onTranscriptionFailed,
    onStateChange,
    onError,
  } = options;

  const [state, setStateInternal] = useState<PerceptionState>('disabled');

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
  const mutedRef = useRef<boolean>(false);
  const inkT0Ref = useRef<number>(0);
  const speechStartedAtRef = useRef<number>(0);
  const intentionallyDisconnectedRef = useRef<boolean>(false);
  const reconnectAttemptsRef = useRef<number>(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cachedTokenRef = useRef<string | null>(null);
  const turnBuffersRef = useRef<Map<string, TurnBuffer>>(new Map());

  const thresholdsRef = useRef({ turnStartThreshold, turnEagerEndThreshold, turnEndThreshold, turnEndTimeoutMs });
  thresholdsRef.current = { turnStartThreshold, turnEagerEndThreshold, turnEndThreshold, turnEndTimeoutMs };

  const setState = useCallback((next: PerceptionState) => {
    setStateInternal((prev) => {
      if (prev === next) return prev;
      console.warn(`${logPrefix} state: ${prev} → ${next}`);
      try { onStateChangeRef.current?.(next); } catch {}
      return next;
    });
  }, [logPrefix]);

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
      const resp = await fetch('/api/tutor/cartesia-token', { method: 'POST' });
      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`cartesia-token ${resp.status}: ${text}`);
      }
      const data = await resp.json();
      if (!data?.token) throw new Error('cartesia-token: missing token');
      cachedTokenRef.current = data.token;
      return data.token as string;
    } catch (err) {
      console.error(`${logPrefix} mintToken error:`, err);
      onErrorRef.current?.(err instanceof Error ? err : new Error('cartesia-token failure'));
      return null;
    }
  }, [logPrefix]);

  const startMic = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: INK_SAMPLE_RATE,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      mediaStreamRef.current = stream;

      const ctx = getInkAudioContext();
      if (ctx.state === 'suspended') {
        try { await ctx.resume(); } catch {}
      }
      if (ctx.sampleRate !== INK_SAMPLE_RATE) {
        // Defensive only — an explicit `new AudioContext({ sampleRate })`
        // is expected to be honored by the browser (unlike getUserMedia's
        // hint-based constraints), so this should never fire. No manual
        // resample path exists here by design (see file header comment).
        console.warn(`${logPrefix} AudioContext sampleRate=${ctx.sampleRate}, expected ${INK_SAMPLE_RATE} — audio may be mis-pitched`);
      }

      const source = ctx.createMediaStreamSource(stream);
      const processor = ctx.createScriptProcessor(4096, 1, 1);

      processor.onaudioprocess = (e) => {
        const ws = wsRef.current;
        if (!ws || ws.readyState !== WebSocket.OPEN) return;
        if (mutedRef.current) { try { onMicLevelRef.current?.(0); } catch {} return; }
        const inputData = e.inputBuffer.getChannelData(0);
        let sumSq = 0;
        for (let i = 0; i < inputData.length; i++) sumSq += inputData[i] * inputData[i];
        const rms = Math.sqrt(sumSq / inputData.length);
        try { onMicLevelRef.current?.(Math.min(1, rms * 6)); } catch {}
        // Raw Float32 binary frame — no base64, no PCM16 downconvert.
        // inputData is a view into a reusable buffer owned by the audio
        // pipeline; copy it before handing to ws.send() so the browser
        // doesn't race a buffer reuse against the async send.
        try {
          ws.send(inputData.slice().buffer);
        } catch {
          // Send race during reconnect; safe to drop.
        }
      };

      source.connect(processor);
      processor.connect(ctx.destination);
      processorRef.current = processor;
      setState('listening');
      console.warn(`${logPrefix} microphone started (independent stream, ${ctx.sampleRate}Hz)`);
    } catch (err) {
      console.error(`${logPrefix} mic error:`, err);
      const e = err instanceof Error ? err : new Error('Ink2 mic access failed');
      onErrorRef.current?.(e);
      setState('error');
    }
  }, [logPrefix, setState]);

  // Delivers the turn.end's OWN cumulative `transcript` field verbatim
  // (it's already the full, correctly-spaced final text for the turn —
  // Cartesia does the reconstruction server-side). `reconstructInkFinals`
  // is used here only as an EMPTY-TURN filter: word-level delta-joining
  // (see that function's doc comment) can split mid-word on a partial-word
  // update boundary, so its `.join(' ')` output is a WER-style
  // APPROXIMATION good enough to prove "this turn.end carried no new
  // content" (empty deltas -> skip delivering a blank/no-op transcript)
  // but not accurate enough to hand to the brain pipeline as the actual
  // text. The actual DUPLICATE turn.end guard is the buffer deletion
  // below (`turnBuffersRef.current.delete(turnId)`): once a turn is
  // processed its entry is removed from the map, so a genuine repeated
  // turn.end for the same turn_id finds `buf` undefined on the next call
  // and returns immediately via the `!buf` check — `buf.finalized` is a
  // belt-and-suspenders flag for the (unobserved) case where delivery
  // re-enters before the delete has landed.
  const finalizeTurn = useCallback((turnId: string, rawTranscript: string) => {
    const buf = turnBuffersRef.current.get(turnId);
    if (!buf || buf.finalized) return; // duplicate turn.end — no double text
    buf.finalized = true;
    const deltas = reconstructInkFinals(buf.events);
    turnBuffersRef.current.delete(turnId);
    if (deltas.length === 0) return; // nothing new since the last delivered final
    const text = rawTranscript.trim();
    if (!text) return;
    reconnectAttemptsRef.current = 0;
    const now = Date.now();
    const tMs = inkT0Ref.current ? now - inkT0Ref.current : 0;
    const latencyMs = speechStartedAtRef.current ? now - speechStartedAtRef.current : 0;
    console.warn(`${logPrefix} transcript (${latencyMs}ms): ${JSON.stringify(text)}`);
    try { onTranscriptRef.current?.({ text, tMs, latencyMs, itemId: turnId }); } catch {}
  }, [logPrefix]);

  const handleMessage = useCallback((evt: MessageEvent) => {
    let data: InkEvent;
    try {
      data = JSON.parse(evt.data);
    } catch {
      return;
    }
    const type = data.type;
    if (!type) return;
    console.log(`${logPrefix} event:`, type);
    switch (type) {
      case 'connected':
        setState('connected');
        if (!processorRef.current) void startMic();
        else setState('listening');
        break;
      case 'turn.start': {
        if (data.turn_id) {
          turnBuffersRef.current.set(data.turn_id, { events: [], finalized: false, eagerEndFired: false });
        }
        const now = Date.now();
        speechStartedAtRef.current = now;
        const tMs = inkT0Ref.current ? now - inkT0Ref.current : 0;
        try { onSpeechStartRef.current?.({ tMs }); } catch {}
        break;
      }
      case 'turn.update': {
        if (data.turn_id) turnBuffersRef.current.get(data.turn_id)?.events.push(data);
        break;
      }
      case 'turn.eager_end': {
        if (data.turn_id) {
          const buf = turnBuffersRef.current.get(data.turn_id);
          if (buf) {
            buf.events.push(data);
            if (!buf.eagerEndFired) {
              buf.eagerEndFired = true;
              const now = Date.now();
              const tMs = inkT0Ref.current ? now - inkT0Ref.current : 0;
              try { onSpeechStopRef.current?.({ tMs }); } catch {}
            }
          }
        }
        break;
      }
      case 'turn.end': {
        if (data.turn_id) {
          turnBuffersRef.current.get(data.turn_id)?.events.push(data);
          finalizeTurn(data.turn_id, typeof data.transcript === 'string' ? data.transcript : '');
        }
        break;
      }
      case 'error': {
        const errorType = typeof data.title === 'string'
          ? data.title
          : (typeof data.message === 'string' ? data.message : 'ink_error');
        console.warn(`${logPrefix} server error:`, data);
        try { onTranscriptionFailedRef.current?.(errorType); } catch {}
        break;
      }
      default:
        break;
    }
  }, [finalizeTurn, logPrefix, setState, startMic]);

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
    inkT0Ref.current = inkT0Ref.current || Date.now();
    turnBuffersRef.current.clear();

    let token = cachedTokenRef.current;
    if (!token || reconnectAttemptsRef.current > 1) {
      token = await mintToken();
    }
    if (!token) {
      setState('error');
      scheduleReconnectRef.current?.();
      return;
    }

    const { turnStartThreshold: ts, turnEagerEndThreshold: te, turnEndThreshold: tn, turnEndTimeoutMs: tt } = thresholdsRef.current;
    const params = new URLSearchParams({
      model: 'ink-2',
      encoding: 'pcm_f32le',
      sample_rate: String(INK_SAMPLE_RATE),
      cartesia_version: CARTESIA_VERSION,
      access_token: token,
      turn_start_threshold: String(ts),
      turn_eager_end_threshold: String(te),
      turn_end_threshold: String(tn),
      turn_end_timeout_ms: String(tt),
    });
    const ws = new WebSocket(`wss://api.cartesia.ai/stt/turns/websocket?${params}`);

    ws.onopen = () => {
      console.warn(`${logPrefix} WS opened`);
      // No session.update needed — Ink 2's turn thresholds are connect-URL
      // query params; the 'connected' message (handleMessage) starts the mic.
    };

    ws.onmessage = handleMessage;

    ws.onerror = (e) => {
      // Mirrors usePerceptionWS: WebSocket `error` events carry no
      // actionable detail and are always followed by onclose, which owns
      // reconnect/'degraded' handling.
      console.warn(`${logPrefix} WS error (transient — onclose handles reconnect):`, e);
      onErrorRef.current?.(new Error('Ink2 WS error'));
    };

    ws.onclose = (e) => {
      console.log(`${logPrefix} WS closed:`, e.code, e.reason);
      wsRef.current = null;
      turnBuffersRef.current.clear();
      if (!intentionallyDisconnectedRef.current) {
        if (scheduleReconnectRef.current?.()) return;
      }
      setState(intentionallyDisconnectedRef.current ? 'disabled' : 'degraded');
    };

    wsRef.current = ws;
  }, [enabled, handleMessage, logPrefix, mintToken, setState]);
  connectRef.current = connect;

  const disconnect = useCallback(() => {
    intentionallyDisconnectedRef.current = true;
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    reconnectAttemptsRef.current = 0;
    turnBuffersRef.current.clear();
    teardownMic();
    teardownWS();
    setState('disabled');
  }, [teardownMic, teardownWS, setState]);

  useEffect(() => {
    if (enabled) {
      void connect();
    } else {
      disconnect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  useEffect(() => {
    return () => {
      intentionallyDisconnectedRef.current = true;
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      teardownMic();
      teardownWS();
    };
  }, [teardownMic, teardownWS]);

  // Dev-only forced-close trigger, mirrors usePerceptionWS's
  // __tutorForcePerceptionClose so reconnect scenarios can be reproduced
  // in seconds without waiting out a real idle timeout.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (process.env.NODE_ENV === 'production') return;
    const w = window as unknown as {
      __tutorForceInkClose?: () => void;
      __tutorInkState?: () => PerceptionState;
    };
    w.__tutorForceInkClose = () => {
      console.warn(`${logPrefix}[dev] __tutorForceInkClose() — simulating unintentional drop`);
      try { wsRef.current?.close(); } catch {}
    };
    w.__tutorInkState = () => state;
    return () => {
      delete w.__tutorForceInkClose;
      delete w.__tutorInkState;
    };
  }, [logPrefix, state]);

  const setMuted = useCallback((muted: boolean) => {
    // Local mute only — Cartesia's Ink 2 API has no documented equivalent
    // of OpenAI Realtime's `input_audio_buffer.clear` server-side command,
    // so there's nothing to send over the WS here; muting just stops the
    // processor from forwarding mic frames (see the `mutedRef` check at
    // the audio-worklet callback above).
    mutedRef.current = muted;
    console.warn(`${logPrefix} mic ${muted ? 'muted' : 'unmuted'}`);
  }, [logPrefix]);

  return { state, connect, disconnect, setMuted };
}
