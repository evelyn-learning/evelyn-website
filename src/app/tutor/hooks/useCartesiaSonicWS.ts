'use client';

/**
 * Cartesia Sonic TTS WebSocket Hook — Task 3.1 of
 * docs/superpowers/plans/2026-07-20-tutor-humanlike-latency-sync.md.
 * Modeled on useCartesiaInkWS.ts (READ THAT FIRST — token mint, reconnect
 * ladder, and teardown idioms are ports); differences by design:
 *
 *  - TTS, not STT: no mic, no AudioContext. One persistent WS carries
 *    interleaved frames for every in-flight sentence, demuxed by
 *    context_id (SonicContextDemux — pure, tested via test:sonic-ws).
 *  - `synthesize()` resolves `false` when the transport can't take the
 *    sentence (disabled / degraded / connect+open failed) BEFORE any
 *    callback fires, so the caller falls back to the HTTP path with its
 *    full retry/ElevenLabs/captions chain intact. It resolves `true` once
 *    the generation request is SENT — per-sentence outcomes then arrive
 *    via the opts callbacks (onChunk/onWords/onDone/onError).
 *  - Word timestamps: `add_timestamps: true` on every generation request;
 *    offsets are relative to the sentence's own audio (t=0 = its first
 *    sample), which is exactly what the word clock needs. Validated live
 *    on our plan/token 2026-07-22 (scripts/spike-cartesia-ws-tts.ts).
 *  - Degradation is SESSION-STICKY: after the reconnect ladder exhausts
 *    (3 attempts), the hook goes 'degraded', fires onFallback ONCE (the
 *    caller emits the `tts_ws_fallback` debug event), and every later
 *    synthesize() resolves false immediately. A mid-session WS drop fails
 *    all in-flight sentences (demux.failAll → their onError → per-sentence
 *    HTTP fallback) while the ladder retries in the background.
 *  - Auth mirrors Ink: POST /api/tutor/cartesia-token (now minting
 *    stt+tts grants), token as `access_token` QUERY PARAM (browsers can't
 *    set WS headers), re-minted when within a minute of expiry. The route
 *    also ships CARTESIA_VOICE_SUBSTITUTIONS (test-key voice remaps) so
 *    the browser can apply what the HTTP route applies server-side.
 *
 * The caller owns text preparation: pass ALREADY-REWRITTEN text
 * (rewriteForTTS) — this hook sends `transcript` verbatim, mirroring the
 * HTTP route's server-side rewrite exactly once.
 */

import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  SonicContextDemux,
  type SonicContextHandlers,
  type SonicFrame,
} from '@/lib/tutor/voice/sonic-ws';
import {
  CARTESIA_DEFAULT_VOICE_ID,
  applyCartesiaVoiceSubstitutions,
} from '@/lib/tutor/voice/cartesia-voice-registry';

const CARTESIA_VERSION = '2026-03-01';
const SONIC_WS_URL = 'wss://api.cartesia.ai/tts/websocket';
// How long synthesize() waits for a CONNECTING socket before giving up and
// letting the sentence fall back to HTTP (the ladder keeps retrying in the
// background for later sentences).
const OPEN_WAIT_MS = 4000;
// Re-mint when the cached token is within this margin of expiry.
const TOKEN_EXPIRY_MARGIN_MS = 60_000;

export type SonicWSState = 'idle' | 'connecting' | 'open' | 'reconnecting' | 'degraded';

export interface SonicSynthesizeOpts extends SonicContextHandlers {
  /** Unique per sentence — the plan's `<turnId>:<sentenceIdx>` convention. */
  contextId: string;
  /** Raw (unsubstituted) Cartesia voice id; defaults like the HTTP route. */
  voiceId?: string;
  /** Cartesia __experimental_controls.speed — preset label (e.g. 'slow') or
   *  raw numeric offset ∈ [-1,1] (per-voice cadence normalization, R38 Task
   *  6). Omitted ⇢ no speed field on the wire (byte-identical to before). */
  speed?: string | number;
}

export interface UseCartesiaSonicWSOptions {
  /** Master enable (flag && provider === 'cartesia'). When false the hook
   *  is inert and synthesize() always resolves false. */
  enabled: boolean;
  logPrefix?: string;
  /** Fired ONCE per session when the transport degrades permanently —
   *  the caller emits the tts_ws_fallback debug event. */
  onFallback?: (reason: string) => void;
}

export interface UseCartesiaSonicWSResult {
  /** Ask the WS to synthesize one sentence. Resolves false ⇢ caller must
   *  use the HTTP path (no callbacks have fired, none will). */
  synthesize(text: string, opts: SonicSynthesizeOpts): Promise<boolean>;
  /** Drop a sentence (kill/supersede): its remaining frames are discarded.
   *  No callbacks fire after this returns. */
  cancel(contextId: string): void;
  /** Pre-open the socket (call at session start so sentence 1 doesn't pay
   *  token-mint + WS handshake). Safe to call repeatedly. */
  prewarm(): void;
}

export function useCartesiaSonicWS(options: UseCartesiaSonicWSOptions): UseCartesiaSonicWSResult {
  const { enabled, logPrefix = '[SonicWS]', onFallback } = options;

  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;
  const onFallbackRef = useRef(onFallback);
  onFallbackRef.current = onFallback;

  const wsRef = useRef<WebSocket | null>(null);
  const stateRef = useRef<SonicWSState>('idle');
  const demuxRef = useRef<SonicContextDemux>(new SonicContextDemux());
  const tokenRef = useRef<{ token: string; expiresAt: number; voiceSubs: string | undefined } | null>(null);
  const connectPromiseRef = useRef<Promise<WebSocket | null> | null>(null);
  const failedConnectsRef = useRef(0);
  const fallbackFiredRef = useRef(false);
  const unmountedRef = useRef(false);

  const degrade = useCallback((reason: string) => {
    stateRef.current = 'degraded';
    if (!fallbackFiredRef.current) {
      fallbackFiredRef.current = true;
      console.warn(`${logPrefix} degraded for the session — ${reason}`);
      try { onFallbackRef.current?.(reason); } catch {}
    }
  }, [logPrefix]);

  const mintToken = useCallback(async (): Promise<{ token: string; voiceSubs: string | undefined } | null> => {
    const cached = tokenRef.current;
    if (cached && Date.now() < cached.expiresAt - TOKEN_EXPIRY_MARGIN_MS) {
      return { token: cached.token, voiceSubs: cached.voiceSubs };
    }
    try {
      const resp = await fetch('/api/tutor/cartesia-token', { method: 'POST' });
      if (!resp.ok) throw new Error(`cartesia-token ${resp.status}`);
      const data = await resp.json();
      if (!data?.token) throw new Error('cartesia-token: missing token');
      tokenRef.current = {
        token: data.token,
        expiresAt: typeof data.expires_at === 'number' ? data.expires_at : Date.now() + 3_000_000,
        voiceSubs: typeof data.voice_substitutions === 'string' ? data.voice_substitutions : undefined,
      };
      return { token: data.token, voiceSubs: tokenRef.current.voiceSubs };
    } catch (err) {
      console.warn(`${logPrefix} token mint failed:`, err);
      return null;
    }
  }, [logPrefix]);

  // One physical connect attempt: mint token → open WS → resolve on open
  // (or null on timeout/close). onmessage/onclose handlers installed here
  // live for the socket's whole life.
  const attemptConnect = useCallback(async (): Promise<WebSocket | null> => {
    const minted = await mintToken();
    if (!minted) return null;
    stateRef.current = failedConnectsRef.current > 0 ? 'reconnecting' : 'connecting';
    const params = new URLSearchParams({
      cartesia_version: CARTESIA_VERSION,
      access_token: minted.token,
    });
    return await new Promise<WebSocket | null>((resolve) => {
      let settled = false;
      const ws = new WebSocket(`${SONIC_WS_URL}?${params}`);
      const openTimeout = setTimeout(() => {
        if (!settled) { settled = true; try { ws.close(); } catch {} resolve(null); }
      }, OPEN_WAIT_MS);

      ws.onopen = () => {
        clearTimeout(openTimeout);
        if (settled) return;
        settled = true;
        console.warn(`${logPrefix} WS open`);
        stateRef.current = 'open';
        failedConnectsRef.current = 0;
        wsRef.current = ws;
        resolve(ws);
      };
      ws.onmessage = (evt) => {
        let frame: SonicFrame;
        try { frame = JSON.parse(evt.data as string); } catch { return; }
        demuxRef.current.handleFrame(frame);
      };
      ws.onerror = () => {
        // No actionable detail on WS error events; onclose owns recovery.
      };
      ws.onclose = (e) => {
        clearTimeout(openTimeout);
        if (wsRef.current === ws) wsRef.current = null;
        // Mid-session drop: every in-flight sentence fails NOW so each
        // falls back to HTTP instead of waiting on frames that will
        // never come. (No-op when the demux is empty.)
        demuxRef.current.failAll(`ws closed (${e.code})`);
        if (stateRef.current !== 'degraded') stateRef.current = 'idle';
        if (!settled) { settled = true; resolve(null); }
      };
    });
  }, [logPrefix, mintToken]);

  /**
   * Returns an OPEN WebSocket or null (degraded / connect failed). One
   * in-flight connect is shared by concurrent callers; a failed attempt
   * counts toward the 3-strike ladder and the NEXT synthesize retries
   * (per-sentence pacing replaces Ink's timer ladder — there's no point
   * reconnecting a TTS socket with nothing to say).
   */
  const ensureOpen = useCallback(async (): Promise<WebSocket | null> => {
    if (!enabledRef.current || stateRef.current === 'degraded' || unmountedRef.current) return null;
    const existing = wsRef.current;
    if (existing && existing.readyState === WebSocket.OPEN) return existing;
    if (connectPromiseRef.current) return connectPromiseRef.current;

    const attempt = (async (): Promise<WebSocket | null> => {
      const ws = await attemptConnect();
      // Failure accounting lives HERE (inside the shared, single-execution
      // promise) — counting once per AWAITER would let one network blip
      // eat the whole 3-strike ladder when several sentences race.
      if (!ws) {
        failedConnectsRef.current++;
        // A fresh token on the next attempt — the failure may be auth-side.
        tokenRef.current = null;
        if (failedConnectsRef.current >= 3) degrade('3 consecutive connect failures');
      }
      return ws;
    })();

    connectPromiseRef.current = attempt;
    const ws = await attempt;
    connectPromiseRef.current = null;
    return ws;
  }, [attemptConnect, degrade]);

  const synthesize = useCallback(async (text: string, opts: SonicSynthesizeOpts): Promise<boolean> => {
    const ws = await ensureOpen();
    if (!ws) return false;
    const voiceSubs = tokenRef.current?.voiceSubs;
    const request = {
      model_id: 'sonic-3.5',
      transcript: text,
      voice: {
        mode: 'id' as const,
        id: applyCartesiaVoiceSubstitutions(opts.voiceId ?? CARTESIA_DEFAULT_VOICE_ID, voiceSubs),
        // R38: WS path previously sent NO speed at all — a per-voice fix
        // applied only to the HTTP route silently skips most sentences when
        // NEXT_PUBLIC_TUTOR_TTS_WS=on.
        ...(opts.speed !== undefined ? { __experimental_controls: { speed: opts.speed } } : {}),
      },
      language: 'en',
      output_format: { container: 'raw', encoding: 'pcm_f32le', sample_rate: 24000 },
      context_id: opts.contextId,
      add_timestamps: true,
      continue: false,
    };
    demuxRef.current.register(opts.contextId, {
      onChunk: opts.onChunk,
      onWords: opts.onWords,
      onDone: opts.onDone,
      onError: opts.onError,
    });
    try {
      ws.send(JSON.stringify(request));
      return true;
    } catch (err) {
      // Send race against a closing socket — clean up and let the caller
      // fall back before any callback has fired.
      demuxRef.current.unregister(opts.contextId);
      console.warn(`${logPrefix} send failed:`, err);
      return false;
    }
  }, [ensureOpen, logPrefix]);

  const cancel = useCallback((contextId: string) => {
    demuxRef.current.unregister(contextId);
    // Best effort server-side stop; unregister above already guarantees
    // no more callbacks client-side even if this send is a no-op.
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      try { ws.send(JSON.stringify({ context_id: contextId, cancel: true })); } catch {}
    }
  }, []);

  const prewarm = useCallback(() => {
    if (!enabledRef.current) return;
    void ensureOpen();
  }, [ensureOpen]);

  useEffect(() => {
    unmountedRef.current = false;
    if (!enabled) {
      // Disable: drop the socket; in-flight sentences fail over to HTTP.
      const ws = wsRef.current;
      wsRef.current = null;
      if (ws) { try { ws.close(); } catch {} }
    }
    return () => {
      unmountedRef.current = true;
      const ws = wsRef.current;
      wsRef.current = null;
      if (ws) { try { ws.close(); } catch {} }
    };
  }, [enabled]);

  // Stable identity — consumers fold this into useCallback dep arrays.
  return useMemo(() => ({ synthesize, cancel, prewarm }), [synthesize, cancel, prewarm]);
}
