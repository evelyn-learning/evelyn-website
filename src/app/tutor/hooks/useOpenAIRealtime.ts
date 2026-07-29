'use client';

/**
 * OpenAI Realtime API Hook
 *
 * Handles WebSocket connection to OpenAI's Realtime API for
 * low-latency voice conversations. Replaces the separate
 * STT -> LLM -> TTS pipeline with a single real-time connection.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import type { WhiteboardCommand } from '@/lib/knowledge/types';
import type { FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';
import { mapFunctionCallToCommand, WHITEBOARD_TOOLS, toOpenAITools, type ToolDefinition } from './toolDefinitions';
import { classifyTranscript } from '@/lib/tutor/voice/transcript-filters';
import { rewriteForTTS } from '@/lib/tutor/voice/tts-pronunciation';
import { shouldDrainAfterOrphanedFetch, shouldFireSpeakingWatchdog } from '@/lib/tutor/voice/bargein-gate';
import { shouldSurfaceWsError, shouldReconnectOnForeground } from '@/lib/tutor/voice/ws-recovery';
import {
  acquireSharedMicStream,
  releaseSharedMicStream,
  setSharedMicConsumerMuted,
} from '@/lib/tutor/voice/shared-mic';
import {
  getPlaybackTarget,
  measureFirstPlayback,
  primePlaybackRoute,
  silencePlaybackRoute,
  unsilencePlaybackRoute,
} from '@/lib/tutor/voice/playback-route';
import { openPcmChunkStream, type PcmChunkStream } from '@/lib/tutor/voice/pcm-stream';
import { TUTOR_TTS_STREAM_HEAD, TTS_STREAM_HEAD_SAMPLES, TTS_STREAM_FOLLOW_SAMPLES, TTS_STREAM_TAIL_TIMEOUT_MS, TUTOR_TTS_WS, SONIC_WS_FIRST_CHUNK_TIMEOUT_MS } from '@/lib/tutor/orchestrator/flags';
import { wordIndexAt } from '@/lib/tutor/voice/sonic-ws';
import { preciseSentenceFraction } from '@/lib/tutor/voice/resume-from-cut';
import { useCartesiaSonicWS } from './useCartesiaSonicWS';
import type { SpokenProgress } from '@/lib/tutor/voice/caption-sync';

// OpenAI Realtime voice options
export type OpenAIVoice = 'alloy' | 'ash' | 'ballad' | 'coral' | 'echo' | 'sage' | 'shimmer' | 'verse';

/** 'silent' TTS test mode: synthetic per-word duration for the zero-filled
 *  PCM buffers fetchTTSPromise fabricates. 0.15 s/word ≈ 2.5× real speech
 *  (~0.37 s/word) — fast enough for cheap automated runs, long enough that
 *  sentence-start/drain events and caption pacing stay plausibly timed. */
const SILENT_TTS_SECONDS_PER_WORD = 0.15;

// Task X3 (2026-07-16) stuck-SPEAKING defensive watchdog. Root cause of the
// live wedge (session portal-da5b97a6) is fixed at the epoch-guard drain in
// sendOneSpeakTextViaOpenAITTS, but a hung TTS fetch or a missed
// AudioBufferSource 'ended' could strand the same shape with no recovery. If
// state sits at 'speaking' with a fully EMPTY audio pipeline (not playing,
// audio queue empty) for longer than the window, the turn can never advance on
// its own — force a clean drain back to listening. The window comfortably
// exceeds any normal inter-sentence fetch gap (prefetched; worst-case bounded
// retry backoff ~0.75s), so it never fires during healthy playback.
const STUCK_SPEAKING_WATCHDOG_MS = 8000;
const STUCK_SPEAKING_WATCHDOG_POLL_MS = 2000;

export interface RealtimeUsage {
  totalTokens: number;
  inputTokens: number;
  outputTokens: number;
  inputTextTokens: number;
  inputAudioTokens: number;
  outputTextTokens: number;
  outputAudioTokens: number;
  /** GPT-Realtime-2: server-cached input tokens (prompt + tools cached
   *  across turns, billed far cheaper than uncached input). Optional —
   *  the GA gpt-realtime and Gemini engines do not report it. */
  inputCachedTokens?: number;
}

/**
 * Result returned from the onWhiteboardCommand callback when it processes
 * tool calls. If `rejected` is non-empty, the Realtime hook will send a
 * success:false function_call_output so the LLM knows the tool failed.
 */
export interface WhiteboardCommandResult {
  rejected?: Array<{ action: string; reason: string }>;
  /**
   * IDs assigned to the accepted commands, in order. Surfaced back to the
   * model in the function_call_output so it can reference earlier items by
   * id (e.g. { targetId: "showSpringMass-1" }) in later scribble / scrollTo
   * calls. Omit for commands that don't get an id (newPage, scribble,
   * scrollTo, etc.).
   */
  assignedIds?: string[];
  /**
   * Structured feature manifests for each rendered command, keyed by the
   * same index as assignedIds. Surfaced to the tutor in the tool-result JSON
   * so it uses authoritative names for targetFeature instead of guessing.
   * Undefined for commands whose renderer hasn't been migrated yet.
   */
  manifests?: Array<FeatureManifestEntry[] | undefined>;
  /**
   * If a show_* call was a duplicate of an existing item (same args),
   * the entry at the matching index carries the existing itemId + the
   * already-registered features. The Realtime hook surfaces this as a
   * non-render success so the tutor switches to scroll/scribble.
   */
  duplicates?: Array<
    | {
        existingItemId: string;
        existingFeatures: Array<{ target: string; canonical: string; kind: string; description?: string }>;
      }
    | undefined
  >;
  /**
   * Compact list of every catalog item currently on the board. Surfaced
   * with every show_* tool_result so the tutor sees what's already drawn
   * and routes through scroll/scribble for repeat references instead of
   * re-rendering. Production root cause for issue #1 in 2026-04-25 session.
   */
  boardSnapshot?: Array<{
    itemId: string;
    action: string;
    title?: string;
    pageTitle?: string;
    featureCount: number;
  }>;
}

export interface RealtimeConfig {
  instructions: string;
  voice?: OpenAIVoice;
  vadThreshold?: number;
  vadSilenceDurationMs?: number;
  vadPrefixPaddingMs?: number;
  /** Reconnect-resilience (caching-initiative levers 2+3, 2026-05-18).
   *  When true: an unintentional ws.onclose OR a transcription-watchdog
   *  fire on a non-OPEN socket triggers a bounded reconnect ladder
   *  (reuse cached key → re-mint) instead of dead-ending to the
   *  "technical issue" banner. Default false ⇒ byte-identical to the
   *  frozen 7de734c behavior (instant, code-free revert). Read from
   *  NEXT_PUBLIC_TUTOR_REALTIME_RECONNECT in VoiceTutorRealtime,
   *  mirroring the vad* env-prop convention. */
  reconnectEnabled?: boolean;
  /** GPT-Realtime-2 native engine. When true the hook connects to the
   *  gpt-realtime-2 model, adds reasoning.effort to session.update, and
   *  lets the server auto-create a response on each VAD commit
   *  (turn_detection.create_response:true) instead of the manual
   *  response.create the GA gpt-realtime path uses. Default false ⇒
   *  byte-identical to the existing gpt-realtime behavior. */
  useRealtimeV2?: boolean;
  /** Override the whiteboard tools registered in the realtime session.
   *  When omitted the hook registers the full WHITEBOARD_TOOLS; realtime-2
   *  passes a subject-filtered subset so an off-subject session doesn't
   *  carry irrelevant tools. */
  tools?: ToolDefinition[];
  onTranscriptUpdate?: (role: 'user' | 'assistant', text: string, isFinal: boolean) => void;
  // The callback may be async and may return rejection info. When it does,
  // the Realtime hook reports those drops back to the LLM as tool-call
  // failures so the model can apologize / retry instead of narrating as if
  // the whiteboard content is live.
  onWhiteboardCommand?: (
    commands: WhiteboardCommand[],
  ) => void | Promise<void | WhiteboardCommandResult>;
  /**
   * Resolve a feature-manifest lookup for the list_whiteboard_features tool.
   * Called by this hook directly — the query does not go through the command
   * pipeline. Returns every item on the whiteboard (or just the one matching
   * args.id) along with the tutor-facing `target` string for each feature.
   * The tutor passes that string verbatim as tutor_scribble.target.
   */
  onQueryFeatures?: (args: { id?: string }) => Array<{
    itemId: string;
    action: string;
    pageTitle?: string;
    features: Array<{
      target: string;
      canonical: string;
      kind: string;
      description?: string;
    }>;
  }> | null;
  onResponseDone?: (usage?: RealtimeUsage) => void;
  onError?: (error: Error) => void;
  /**
   * Fires when the server reports an input-audio-transcription state change
   * for the *student*'s mic. 'failed' means Whisper rejected this commit
   * (rate_limit_error, auth, malformed audio); the student's turn never
   * reaches the brain. 'completed' fires on every successful Whisper
   * transcription. Caller uses this to surface a "voice having trouble —
   * type instead" banner without burying the student in a dead voice loop.
   */
  onTranscriptionStatus?: (status: 'failed' | 'completed', errorType?: string) => void;
  onStateChange?: (state: RealtimeState) => void;
  onStudentAudioChunk?: (float32: Float32Array) => void;
  onTutorAudioChunk?: (float32: Float32Array) => void;
  /**
   * Render↔speech sync (2026-06-19): fires as TTS playback crosses sentence
   * boundaries so the brain orchestrator can flush buffered whiteboard renders
   * in sync with the narrating sentence. `'sentence-start'` fires when
   * playNextAudio dequeues a chunk belonging to a NEW sentence (audio for that
   * sentence is now beginning); `'drain'` fires when the audio queue empties
   * (the turn's last sentence has finished playing). Additive + inert unless
   * consumed; only the claude-brain orchestrator wires it (gated on
   * NEXT_PUBLIC_TUTOR_RENDER_SYNC). See project_tutor_render_speech_sync.
   *
   * Task 3.1 (humanlike-latency plan): `'word'` fires as playback crosses a
   * word boundary — only when the sentence was synthesized over the Cartesia
   * TTS WebSocket (TUTOR_TTS_WS), which returns word timestamps. `wordPos`
   * accompanies ONLY 'word' events: `sentenceIdx` is the playback-started
   * COUNT while the sentence plays (1-based — counts 'sentence-start'
   * emissions since the last drain/kill, so it aligns with the consumer's
   * own count and with render-sync's anchorM numbering), and `wordIdx`
   * indexes the REWRITTEN transcript's words (rewriteForTTS output — what
   * is actually spoken). HTTP-path sentences emit no 'word' events;
   * consumers degrade to sentence-level semantics. After a mid-turn
   * kill+resume this counter restarts while a consumer's may not — a
   * too-low sentenceIdx can only fail to accelerate, never mis-release.
   */
  onTtsPlaybackProgress?: (event: 'sentence-start' | 'drain' | 'word', wordPos?: { sentenceIdx: number; wordIdx: number }) => void;
  /** Task 3.1: the Cartesia TTS WebSocket transport degraded permanently for
   *  this session (connect ladder exhausted) — sentences now use the HTTP
   *  path. Fires at most once; the caller emits the `tts_ws_fallback` debug
   *  event. Per-sentence WS hiccups do NOT fire this (they fall back / retry
   *  silently per sentence). */
  onTtsTransportFallback?: (reason: string) => void;
  /**
   * TTS delivery trouble (2026-07-15, follow-up to the mid-turn wedge fix):
   * 'retrying' fires when a sentence's TTS fetch failed and is being
   * re-attempted; 'skipped' when it failed terminally and playback moved on
   * without that sentence. Callers surface a transient "audio hiccup" notice
   * so the gap doesn't read as the tutor being stuck.
   */
  onTtsIssue?: (kind: 'retrying' | 'skipped') => void;
  /** Round-28b: BOTH voice engines failed for a sentence (Cartesia retries
   *  + the voice-matched ElevenLabs fallback) — surface the unspoken text
   *  as a transient captions pin at the board bottom. Never a third voice. */
  onVoiceHiccupCaption?: (text: string) => void;
  /**
   * Self-voice echo defence, layer 2 (V2, 2026-07-15). Fires as each TTS
   * sentence crosses a playback lifecycle boundary so the caller can stamp its
   * perception self-voice buffer at REAL playback time instead of dispatch
   * time. `scriptId` is the id the caller passed to `speakText(text, scriptId)`.
   *   - 'start': the sentence's audio actually began playing (real
   *     spokenStartedAt; end is left live until 'end').
   *   - 'end':   the sentence's audio finished — naturally or cut by barge-in.
   *   - 'skip':  the sentence never played (TTS fetch failed terminally, or a
   *     barge-in drained it while still queued) → the caller zeroes its window
   *     so a never-heard line can't match real student speech.
   * Additive + inert unless consumed. See src/lib/tutor/voice/tts-script-buffer.ts.
   */
  onTtsSentencePlayback?: (ev: {
    scriptId: number;
    phase: 'start' | 'end' | 'skip';
    atMs: number;
  }) => void;
  /**
   * Relay mode — when set, Realtime is used purely as STT + TTS. The hook
   * suppresses Realtime's own response generation (no auto-`response.create`
   * on student transcript completion) and hands the transcript to the caller
   * via `onUserTranscript`. The caller is then responsible for calling the
   * external brain (e.g. Claude), dispatching any whiteboard tool calls, and
   * voicing the brain's text via the `speakText` method on the hook return.
   *
   * When this option is set:
   *   - `tools` are omitted from the session.update (Claude is the author).
   *   - `instructions` here OVERRIDE the top-level `instructions` so the
   *     model is told to behave as a transport layer.
   *   - The student-transcript handler does NOT call response.create.
   */
  relayMode?: {
    instructions: string;
    /** Forwards a student transcript (or a synthetic deliberate-input
     *  message — Skip button text, typed form input, lesson kickoff)
     *  to the caller-owned brain orchestrator.
     *  Opts (2026-06-15): forwarded for deliberate-input dispatches via
     *  `sendTextMessage`. The perception layer's production-WS suppress
     *  window and mid-utterance guard were designed to drop duplicate
     *  Whisper transcripts — they should NOT block user-initiated
     *  buttons or typed input. When this hook calls `onUserTranscript`
     *  from `sendTextMessage`'s relay branch, it sets both bypass
     *  flags; production-WS-transcript path calls without opts and
     *  remains gated by both. */
    onUserTranscript: (
      transcript: string,
      opts?: {
        bypassPerceptionDedupe?: boolean;
        bypassMidUtteranceGuard?: boolean;
        /** Task X10: true when this dispatch is a TYPED student message (vs
         *  voice / button / kickoff). Threaded to the brain orchestrator so
         *  a brain-outage fallback for a typed turn renders text instead of
         *  speaking "say that again". */
        typed?: boolean;
      },
    ) => void | Promise<void>;
    /** TTS engine for voicing the brain's text in relay mode.
     *  - 'realtime' (default): use Realtime's out-of-band response. Highest
     *    voice quality; expensive (full Realtime audio output billing).
     *  - 'openai-mini': use gpt-4o-mini-tts via /api/tutor/tts-openai.
     *    ~10× cheaper than Realtime audio; voice quality very close.
     *  - 'cartesia': use Cartesia sonic-3.5 via /api/tutor/tts-cartesia.
     *    Reuses the exact same HTTP-TTS dispatch/queue/cancel path as
     *    'openai-mini' (Cartesia migration Phase 2, Task 3) — only the
     *    fetch URL/body differ.
     *  - 'silent': test mode (Crimsora v2 Phase 2E). No TTS API is called;
     *    fetchTTSPromise resolves a zero-filled Float32Array sized
     *    words × SILENT_TTS_SECONDS_PER_WORD × 24kHz, so the buffer plays
     *    as real (inaudible) WebAudio and every completion signal the
     *    render-sync / kill-bridge / drain machinery depends on
     *    (sentence-start, drain, AudioBufferSource 'ended') fires with
     *    plausible timing. Automated harnesses only. */
    ttsProvider?: 'realtime' | 'openai-mini' | 'cartesia' | 'silent';
    /** Cartesia voice id to send with each /api/tutor/tts-cartesia request
     *  (Task 3). Ignored unless ttsProvider === 'cartesia'. Resolved by the
     *  caller via resolveCartesiaVoice() (src/lib/tutor/voice/
     *  cartesia-voice-registry.ts) — this hook just carries it through. */
    cartesiaVoiceId?: string;
    /** Task W4: per-session "Speak slower" toggle, independent of the
     *  explain-pace (paceBias) knob. 'slow' asks the HTTP-TTS provider to
     *  synthesize noticeably slower speech; 'normal' (default, or omitted)
     *  leaves each provider's own default rate untouched. The concrete
     *  per-provider value (Cartesia label vs. OpenAI numeric multiplier) is
     *  chosen in fetchTTSPromise below, not here — this flag only carries
     *  the student-facing intent. */
    speakingRate?: 'slow' | 'normal';
    /** Student's name for name-aware TTS rewrites (vocative-comma drop in
     *  rewriteForTTS works for ANY name shape only when it knows the
     *  name — 2026-07-19, session-1784194326500 "baby"). Forwarded to the
     *  HTTP-TTS routes and used directly on the realtime verbatim path. */
    studentName?: string;
  };
}

export type RealtimeState =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'listening'
  | 'processing'
  | 'speaking'
  | 'error';

export interface RealtimeResult {
  state: RealtimeState;
  isConnected: boolean;
  isSpeaking: boolean;
  /**
   * Voice Perception Q9 (2026-06-16). True for ~300ms after a perception
   * cancel fires; auto-clears. UI consumers (mic indicator, button
   * row, typed-input form) read this to render a yellow-flash and
   * briefly disable interactions, giving the student a visible "I
   * heard you" signal even before the classifier verdict resolves.
   * Independent of the underlying state machine — `state` keeps
   * evolving normally underneath.
   */
  isInterrupted: boolean;
  /**
   * Voice Perception Q9 (2026-06-16). Called by the perception cancel
   * handlers in VoiceTutorRealtime (onSpeechStart cancel, retro-cancel
   * useEffect, dev __tutorForceFalseBargein trigger) to enter the
   * 'interrupted' transient signal. Idempotent — repeated calls
   * restart the 300ms window cleanly.
   */
  markInterrupted: () => void;
  error: Error | null;
  connect: () => Promise<void>;
  prefetchToken: () => Promise<string | null>;
  disconnect: () => void;
  startListening: () => void;
  stopListening: () => void;
  muteInput: () => void;
  interrupt: () => void;
  pause: () => void;
  sendTextMessage: (text: string, meta?: { typed?: boolean }) => void;
  injectContext: (contextText: string) => void;
  /**
   * Voice the given text through Realtime's TTS without authoring it.
   * Used in relay mode: an external brain (Claude) decided what to say,
   * Realtime just speaks it. Sends a `response.create` with explicit
   * instructions to read the text verbatim. No-op when not connected.
   */
  speakText: (text: string, scriptId?: number) => void;
  /**
   * Cancel the in-flight speakText response (if any) and drop everything
   * waiting in the speakText queue. Used on validator-feedback retry so
   * the rejected attempt's voice doesn't bleed into the corrected one.
   *
   * Returns a Promise that resolves once the in-flight AudioBufferSource
   * has actually finished tearing down (its `onended` fired). Awaiting
   * this avoids the kill-path overlap where the bridge phrase + the
   * retry's first sentence start playing while the dying source's tail
   * is still audible. Callers that don't care (barge-in / user-typed
   * input) may fire-and-forget the promise.
   */
  clearSpeechQueue: () => Promise<void>;
  /**
   * Voice Perception Stage 3.1 (2026-06-16). Non-destructive snapshot of
   * the pending speakText queue — sentences that the brain emitted but
   * have NOT yet been dispatched to TTS. The currently-playing sentence
   * (in-flight) is NOT in this snapshot; once popped from the queue and
   * dispatched, it leaves the queue.
   *
   * Used by the perception cancel sites: capture the snapshot BEFORE
   * calling `clearSpeechQueue` so a false-positive cancel verdict
   * (noise/filler/drop_self_voice) can resume the unplayed sentences
   * via `resumeSpeakText` instead of refiring the brain.
   */
  peekSpeechQueue: () => string[];
  /**
   * Voice Perception Stage 3.1 (2026-06-16). Re-queue an ordered list
   * of sentences for TTS playback. Each sentence enters the same
   * `speakTextQueueRef` machinery as `speakText`, played one at a
   * time as the prior finishes. Used by `applyPerceptionVerdict` to
   * resume queued content after a false-positive cancel, without
   * paying the latency/duplication cost of re-firing the whole brain
   * call.
   */
  resumeSpeakText: (sentences: string[]) => void;
  /** Resume-from-cut (P5): fraction (0..1) of the current sentence's audio played. */
  getCurrentSentenceFraction: () => number;
  /** Caption word-sync: live playback progress of the sentence playing NOW. */
  getSpokenProgress: () => SpokenProgress;
  /**
   * Stage 4 regression fix (2026-06-16). Drive the 'processing'
   * ("Thinking…") indicator from the claude-brain orchestrator. With the
   * perception WS as the sole input authority, the production WS no longer
   * transcribes student speech, so it never enters 'processing' on
   * `input_audio_buffer.speech_stopped` — the UI sat on 'listening' through
   * the entire brain fetch. The orchestrator calls this `true` when it
   * dispatches a brain turn and `false` when the turn ends. `true` only
   * promotes from an idle state (listening/connected); `false` only resets
   * if still 'processing' (if TTS already started, state is 'speaking' and
   * playNextAudio owns the return to 'listening').
   */
  signalBrainThinking: (on: boolean) => void;
  /**
   * Resume the playback AudioContext synchronously inside a user gesture.
   * iOS Safari requires audio playback to be initiated from a user gesture
   * (touch / click). Without this call on the Start button, the AudioContext
   * stays suspended and TTS chunks queue silently until a later gesture
   * (often the Unmute click) inadvertently unlocks it.
   */
  unlockAudio: () => void;
}

/**
 * Pick the most natural-language label from a manifest entry to surface
 * back to the model as the `target` string. Avoid pure dash-cased
 * canonicals — when the model sees "bar-release-10-m", it generalizes
 * "bar-" as a universal prefix and invents "bar-Top" / "bar-1" /
 * "bar-Release-ke" on later turns. Spaced labels ("the Release bar",
 * "Release") work as targets AND don't pattern-train invention.
 */
function pickManifestDisplayLabel(f: FeatureManifestEntry): string {
  if (Array.isArray(f.labels)) {
    for (const l of f.labels) {
      const trimmed = (l || '').trim();
      if (!trimmed) continue;
      if (/^[a-z0-9]+(-[a-z0-9]+)+$/.test(trimmed)) continue;
      if (trimmed.includes(' ')) return trimmed;
    }
    for (const l of f.labels) {
      if (l && l !== f.name) return l;
    }
    if (f.labels[0]) return f.labels[0];
  }
  return f.name;
}

/** Identity for this hook's handle on the shared mic (see shared-mic.ts). */
const MIC_CONSUMER = 'production-ws';

// Audio context for playback
let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext({ sampleRate: 24000 });
  }
  return audioContext;
}

// Convert base64 to Float32Array for Web Audio API
function base64ToFloat32(base64: string): Float32Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  // OpenAI returns PCM16, convert to Float32
  const int16 = new Int16Array(bytes.buffer);
  const float32 = new Float32Array(int16.length);
  for (let i = 0; i < int16.length; i++) {
    float32[i] = int16[i] / 32768.0;
  }
  return float32;
}

// Linearly resample a Float32Array from `fromRate` to `toRate`. Stateful via
// `state.phase`, which carries the fractional source index across calls so we
// don't introduce per-chunk discontinuities (clicks) at non-2:1 ratios.
interface ResamplerState { phase: number; carry: number | null }
function resampleLinear(
  input: Float32Array,
  fromRate: number,
  toRate: number,
  state: ResamplerState,
): Float32Array {
  if (fromRate === toRate) return input;
  const ratio = fromRate / toRate; // > 1 when downsampling (the common case)
  // Worst-case output length
  const out = new Float32Array(Math.ceil(input.length / ratio) + 1);
  let outIdx = 0;
  let srcIdx = state.phase;
  // `carry` is the last sample of the previous chunk, used when interpolation
  // straddles the chunk boundary (srcIdx in [-1, 0)).
  while (srcIdx < input.length) {
    const i0 = Math.floor(srcIdx);
    const frac = srcIdx - i0;
    let s0: number;
    let s1: number;
    if (i0 < 0) {
      s0 = state.carry ?? input[0];
      s1 = input[0];
    } else if (i0 + 1 >= input.length) {
      // Need next chunk for the right neighbor — stop here and carry phase
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

// Convert Float32Array to base64 PCM16
function float32ToBase64PCM16(float32: Float32Array): string {
  const int16 = new Int16Array(float32.length);
  for (let i = 0; i < float32.length; i++) {
    const s = Math.max(-1, Math.min(1, float32[i]));
    int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  const bytes = new Uint8Array(int16.buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Escape literal control characters (newlines, tabs, etc.) that appear INSIDE
// JSON string literals, leaving structural whitespace (between object keys,
// values, etc.) untouched. Used as strategy 2 in the function-call arguments
// parser — the OpenAI Realtime function-call payload is sometimes emitted as
// pretty-printed JSON with newlines between properties, and sometimes contains
// unescaped newlines inside long string values. A naive global replace of \n
// with \\n corrupts the first case; a string-aware pass fixes both.
function escapeControlCharsInsideStrings(source: string): string {
  // Strip non-printable control chars that are never valid in JSON source.
  const cleaned = source.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  const out: string[] = [];
  let inString = false;
  let escaped = false;
  for (let i = 0; i < cleaned.length; i++) {
    const ch = cleaned[i];
    if (escaped) {
      out.push(ch);
      escaped = false;
      continue;
    }
    if (ch === '\\') {
      out.push(ch);
      escaped = true;
      continue;
    }
    if (ch === '"') {
      out.push(ch);
      inString = !inString;
      continue;
    }
    if (inString && ch === '\n') { out.push('\\n'); continue; }
    if (inString && ch === '\r') { out.push('\\r'); continue; }
    if (inString && ch === '\t') { out.push('\\t'); continue; }
    out.push(ch);
  }
  return out.join('');
}

// Best-effort repair for truncated JSON — when the Realtime API cuts off a
// function-call argument stream mid-generation (e.g. user barges in and the
// response is cancelled), the arguments arrive incomplete. This closes any
// unclosed strings, trims dangling trailing tokens like `"x` or `,`, and
// appends the right sequence of `]` / `}` to rebalance structures so as much
// of the payload as possible survives.
function repairTruncatedJson(source: string): string {
  const cleaned = source.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  const stack: string[] = []; // stack of open '{' or '[' characters
  let inString = false;
  let escaped = false;
  for (let i = 0; i < cleaned.length; i++) {
    const ch = cleaned[i];
    if (escaped) { escaped = false; continue; }
    if (ch === '\\') { escaped = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === '{' || ch === '[') stack.push(ch);
    else if (ch === '}' && stack[stack.length - 1] === '{') stack.pop();
    else if (ch === ']' && stack[stack.length - 1] === '[') stack.pop();
  }
  let repaired = cleaned;
  if (inString) repaired += '"';
  // Trim dangling trailing keys/colons/commas that can't be completed.
  // e.g. `..., "x` → close string, then strip the trailing `, "x"` so the
  //      object doesn't have a key with no value.
  // Repeat until we find a safe terminator.
  // We only trim if the last non-whitespace token is in an unsafe position.
  for (let guard = 0; guard < 200; guard++) {
    const trimmed = repaired.replace(/\s+$/, '');
    const last = trimmed[trimmed.length - 1];
    // Unsafe trailing tokens (inside an object/array):
    //  - ','  : trailing comma
    //  - ':'  : key with no value
    //  - '"'  : dangling string (could be an unclosed key or a complete string)
    // Safe terminators: '}', ']', digit, 'e'/'l' (true/false/null end), or matched scalar.
    if (last === ',' || last === ':') {
      repaired = trimmed.slice(0, -1);
      continue;
    }
    // If last is a quote, check if the preceding meaningful char is `:` or `,` without a pair.
    // Pattern like `"key"` at the top is complete, but `..., "key` (now closed to `"key"`) is a dangling key.
    // We detect: the last "..." was preceded by `,` or `[` or `{` — meaning it's a key/value start with no colon after.
    if (last === '"') {
      // Walk back to find the matching open quote
      let j = trimmed.length - 2;
      while (j >= 0) {
        if (trimmed[j] === '"' && trimmed[j - 1] !== '\\') break;
        j--;
      }
      // j is now at the opening quote. Find the char before it (skipping whitespace).
      let k = j - 1;
      while (k >= 0 && /\s/.test(trimmed[k])) k--;
      const prev = trimmed[k];
      // If preceded by `,` `{` `[` → it's a dangling key or array element; strip it.
      // If preceded by `:` → it's a complete string value; safe.
      if (prev === ',' || prev === '{' || prev === '[') {
        repaired = trimmed.slice(0, j).replace(/[,\s]+$/, '');
        continue;
      }
      break;
    }
    break;
  }
  // Append closers for any remaining open structures, innermost first.
  while (stack.length > 0) {
    const open = stack.pop();
    repaired += open === '{' ? '}' : ']';
  }
  return repaired;
}

// Parse whiteboard commands from text
function parseWhiteboardCommands(text: string): { cleanText: string; commands: WhiteboardCommand[] } {
  const commands: WhiteboardCommand[] = [];
  const cleanText = text.replace(/```whiteboard\s*([\s\S]*?)```/g, (_, content) => {
    try {
      const cmd = JSON.parse(content.trim());
      commands.push(cmd);
    } catch {
      console.warn('[Realtime] Failed to parse whiteboard command:', content);
    }
    return '';
  }).trim();
  return { cleanText, commands };
}

export function useOpenAIRealtime(config: RealtimeConfig): RealtimeResult {
  const {
    instructions, voice = 'alloy',
    vadThreshold = 0.9, vadSilenceDurationMs = 2500, vadPrefixPaddingMs = 500,
    reconnectEnabled = false,
    useRealtimeV2 = false,
    tools: toolDefs,
    onTranscriptUpdate, onWhiteboardCommand, onQueryFeatures, onResponseDone, onError, onTranscriptionStatus, onStateChange,
    onStudentAudioChunk, onTutorAudioChunk, onTtsPlaybackProgress, onTtsIssue, onTtsSentencePlayback, onVoiceHiccupCaption, onTtsTransportFallback, relayMode,
  } = config;
  // Effective instructions: relay-mode overrides the caller's instructions
  // so the Realtime model behaves as a transport layer, not a tutor.
  const effectiveInstructions = relayMode?.instructions ?? instructions;
  const isRelay = Boolean(relayMode);

  const [state, setState] = useState<RealtimeState>('disconnected');
  // Live mirror of `state` for callbacks that need the current value
  // synchronously (the `state` closure is stale). Kept in sync in updateState,
  // the only setState caller.
  const stateRef = useRef<RealtimeState>('disconnected');
  const [error, setError] = useState<Error | null>(null);
  // Voice Perception Q9 (2026-06-16): transient signal flag that's true
  // for ~300ms after a perception cancel fires. Layered on top of the
  // existing state machine — the underlying `state` ('speaking',
  // 'listening', 'processing') continues evolving normally; the UI
  // checks isInterrupted independently to render a yellow-flash on the
  // mic indicator + briefly disable buttons. Auto-clears after the
  // window so the signal is bounded; markInterrupted is idempotent
  // (back-to-back cancels restart the window cleanly).
  const [isInterrupted, setIsInterrupted] = useState(false);
  const interruptedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep audio chunk callbacks in refs to avoid stale closures in onaudioprocess
  const onStudentAudioChunkRef = useRef(onStudentAudioChunk);
  onStudentAudioChunkRef.current = onStudentAudioChunk;

  const wsRef = useRef<WebSocket | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const audioQueueRef = useRef<Float32Array[]>([]);
  const isPlayingRef = useRef(false);
  const currentResponseTextRef = useRef('');
  const playbackSourceRef = useRef<AudioBufferSourceNode | null>(null);
  // B1 hard-cancel (2026-05-14): track the in-flight Realtime response id
  // and the set of ids we've cancelled via clearSpeechQueue. The WS
  // `response.cancel` we send is async — the server keeps streaming
  // `response.audio.delta` events for tens of ms after we send cancel.
  // Without this filter, those in-flight deltas land in audioQueueRef
  // AFTER clearSpeechQueue emptied it, and play interleaved with the
  // kill-bridge / retry audio. The filter drops any delta whose
  // response_id is in cancelledResponseIdsRef.
  const currentResponseIdRef = useRef<string | null>(null);
  const cancelledResponseIdsRef = useRef<Set<string>>(new Set());
  // Stage 3 fix #10 (2026-05-28): grace window after clearSpeechQueue
  // during which any newly-created response.created auto-adds its id
  // to cancelledResponseIdsRef. Covers the multi-response race where
  // the brain orchestrator's emit loop is still in flight when
  // clearSpeechQueue runs, and queues more speakText calls after
  // speakTextInFlightRef has been reset to false — those calls go
  // DIRECTLY to dispatchSpeakText → sendOneSpeakText → response.create,
  // bypassing the queue. The new response gets a fresh id that is NOT
  // in the cancelled set (only the original in-flight id was added),
  // so audio.delta events for the new response play normally. The
  // grace window catches these auto-cancelling them server-side AND
  // dropping their deltas client-side. 1000ms covers SSE buffer drain
  // (typical 100-300ms) plus the orchestrator-side speakTextBlockedUntilRef
  // gate window (600ms), with margin.
  const responseCancelWindowUntilRef = useRef<number>(0);
  const RESPONSE_CANCEL_WINDOW_MS = 1000;
  // Anti-double-response: track when last response finished and when user last spoke
  const lastResponseDoneRef = useRef<number>(0);
  const lastUserInputRef = useRef<number>(0);
  const lastResponseHadToolCallRef = useRef(false);
  // Track post-tool-call response: allow exactly ONE follow-up after a tool call,
  // then cancel any further VAD-triggered responses until the student speaks
  const postToolCallResponseCountRef = useRef(0);
  // Track consecutive tool-call rejections. If the handler rejects too many
  // tool calls in a row without student input (e.g. LLM retries empty problem
  // cards endlessly), stop triggering response.create to break the cascade.
  const consecutiveRejectionsRef = useRef(0);
  const MAX_CONSECUTIVE_REJECTIONS = 2;
  // Track whether the session should be in listening mode (survives audio playback)
  const shouldListenRef = useRef(false);
  // Set in disconnect() so speakText() can swallow the "not connected"
  // path silently when the user has explicitly ended the session
  // (avoids a noisy console error on the way out — the ws is closed
  // because we closed it). 2026-04-29 ocean session.
  const intentionallyDisconnectedRef = useRef(false);
  // Transcription watchdog timeout. Set on speech_stopped; cleared on
  // transcription.completed / .failed; force-resets state if the
  // transcription event never arrives. Catches the silently-stuck
  // "Thinking…" bug from the 2026-04-29 electricity session.
  const transcriptionWatchdogRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Reconnect-resilience state (caching-initiative levers 2+3,
  // 2026-05-18). reconnectAttemptsRef: per-drop attempt counter, max 3,
  // reset to 0 on transcription.completed (proven end-to-end recovery —
  // also subsumes the flap-breaker). reconnectTimerRef: the backoff
  // timer. connectRef / scheduleReconnectRef: break the connect↔reconnect
  // circular dep via the file's existing latest-fn-in-a-ref idiom (cf.
  // startListeningRef). reconnectEnabledRef: synced each render so the
  // long-lived ws.onclose / watchdog closures read the live flag without
  // touching any useCallback dep array (minimal frozen-file churn).
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const everConnectedRef = useRef(false);
  const connectRef = useRef<() => Promise<void>>(async () => {});
  const scheduleReconnectRef = useRef<(() => boolean) | null>(null);
  const reconnectEnabledRef = useRef(reconnectEnabled);
  reconnectEnabledRef.current = reconnectEnabled;
  // useRealtimeV2 synced each render so long-lived closures (handleMessage,
  // connect's onopen) read the current value rather than a stale capture.
  const useRealtimeV2Ref = useRef(useRealtimeV2);
  useRealtimeV2Ref.current = useRealtimeV2;
  // Optional subject-filtered tool set (realtime-2). Ref'd so connect's
  // onopen closure reads the current value rather than a stale capture.
  const toolDefsRef = useRef(toolDefs);
  toolDefsRef.current = toolDefs;
  // True when the user has explicitly muted themselves. Distinct from
  // shouldListenRef (which is the INTENT — "we want to listen after the
  // tutor stops talking"). userMutedRef is the OVERRIDE — "never open
  // the mic without an explicit unmute, regardless of shouldListenRef."
  // Fixes the mute-before-start path where sendTextMessage sets
  // shouldListenRef=true for the greeting, and the mic then auto-opens
  // when the greeting audio ends — bypassing any UI-level mute state.
  const userMutedRef = useRef(false);
  // Timestamp of the most recent unmute. The first ~1.5s of audio after
  // unmute often captures ambient noise, AirPods button clicks, or echo
  // from prior tutor speech that Whisper hallucinates as words. We
  // suppress transcription-completed events that arrive within this
  // grace window so the brain doesn't react to phantom turns.
  const unmuteAtRef = useRef(0);
  const UNMUTE_GRACE_MS = 1500;
  // Ref to hold startListening so playNextAudio can call it without circular deps
  const startListeningRef = useRef<() => void>(() => {});
  // R32 T10: typed messages queued while the WS is down (silence audit §7 —
  // sendTextMessage used to silently DISCARD on a dead socket, only logging
  // console.error; the input box gates on state-derived isConnected, which
  // lags the actual socket state, so submissions vanished). Cap 5; flushed
  // by connect()'s onopen handler on reconnect.
  const pendingTypedRef = useRef<Array<{ text: string; meta?: { typed?: boolean } }>>([]);
  // Ref to hold sendTextMessage so connect's onopen (defined earlier in the
  // file, before sendTextMessage exists) can flush the queue above without a
  // circular dep — latest-fn-in-a-ref idiom (cf. startListeningRef above).
  const sendTextMessageRef = useRef<(text: string, meta?: { typed?: boolean }) => void>(() => {});
  // Track whether audio has been appended to the input buffer (to avoid committing empty buffers)
  const hasAudioInBufferRef = useRef(false);
  // ── speakText queue (Phase 5 streaming brain → Realtime) ──────────────────
  // Realtime allows only ONE response.create in flight at a time. With
  // streaming, the orchestrator may call speakText() per sentence and a
  // brain turn can produce 2–5 sentences in quick succession. Without
  // a queue, the second response.create races the first and one of them
  // is lost. The queue holds pending sentences; response.done drains it.
  const speakTextQueueRef = useRef<string[]>([]);
  const speakTextInFlightRef = useRef(false);
  // Stage 3.1 enhancement v2 (2026-06-16): track sentences based on
  // AUDIO PLAYBACK state, not server response state. response.done
  // fires when the SERVER has finished generating TTS audio for a
  // response, but the audio chunks for that response are still in
  // audioQueueRef and being played out for several more seconds. The
  // first version of this enhancement (commit f435560) tracked
  // sentences via server response.done, so by cancel time the in-flight
  // sentence ref was already nulled by drain even though the student
  // was still hearing the audio. Now:
  //  - audioQueueSentenceRef: parallel to audioQueueRef, one sentence
  //    string per audio chunk. Push on chunk arrival, shift on chunk
  //    dequeue for playback.
  //  - currentSpeakTextRef: the sentence whose chunk was most recently
  //    DEQUEUED for playback. Updated in playNextAudio. Reflects what
  //    the student is hearing right now.
  //  - pendingDispatchSentenceRef: sentence sent to Realtime but its
  //    response.created hasn't echoed back yet. Bridge for getting
  //    sentence text into the response_id → sentence map.
  //  - responseIdToSentenceRef: maps Realtime response_id to sentence
  //    text. Populated in response.created handler.
  // peekSpeechQueue returns unique sentence list = [currentSpeakText,
  //  ...audioQueueSentenceRef (deduped), ...speakTextQueueRef].
  const currentSpeakTextRef = useRef<string | null>(null);
  const audioQueueSentenceRef = useRef<string[]>([]);
  // Resume-from-cut (P5): audio-seconds of the CURRENT sentence already played
  // (accumulated in playNextAudio, reset on a sentence transition). With the
  // queued-but-unplayed chunks of the same sentence it yields the fraction
  // spoken at a noise cut. See getCurrentSentenceFraction.
  const currentSentencePlayedSecRef = useRef(0);
  // Caption word-sync: live playback clock for the CURRENT sentence, read by
  // getSpokenProgress(). Parallel to (never replacing) the resume-from-cut
  // accounting above: playedBeforeChunkSecRef counts COMPLETED chunks of the
  // current sentence; the in-flight chunk's progress is derived from
  // AudioContext.currentTime at read time.
  const chunkStartCtxTimeRef = useRef(0);
  const currentChunkDurSecRef = useRef(0);
  const playedBeforeChunkSecRef = useRef(0);
  // Render↔speech sync: ref-mirror the playback-progress callback so
  // playNextAudio can fire it without re-creating on every render.
  const onTtsPlaybackProgressRef = useRef(onTtsPlaybackProgress);
  onTtsPlaybackProgressRef.current = onTtsPlaybackProgress;
  // Round 29: recorder tap moved to playNextAudio's dequeue (playback
  // time) — ref-mirrored for the same stable-callback reason as above.
  const onTutorAudioChunkRef = useRef(onTutorAudioChunk);
  onTutorAudioChunkRef.current = onTutorAudioChunk;
  const onTtsIssueRef = useRef(onTtsIssue);
  onTtsIssueRef.current = onTtsIssue;
  const onVoiceHiccupCaptionRef = useRef(onVoiceHiccupCaption);
  onVoiceHiccupCaptionRef.current = onVoiceHiccupCaption;
  // Round-28b Cartesia circuit breaker: after 2 consecutive sentence-level
  // failures, later sentences make ONE quick Cartesia attempt (an automatic
  // recovery probe — "keep trying") instead of the full retry ladder, so a
  // sustained outage doesn't add seconds of dead air per sentence. Any
  // Cartesia success closes the breaker.
  const cartesiaConsecFailRef = useRef(0);
  const onTtsSentencePlaybackRef = useRef(onTtsSentencePlayback);
  onTtsSentencePlaybackRef.current = onTtsSentencePlayback;
  const pendingDispatchSentenceRef = useRef<string | null>(null);
  const responseIdToSentenceRef = useRef<Map<string, string>>(new Map());
  // V2 (2026-07-15) self-voice playback-time stamping. These id refs run
  // PARALLEL to the sentence-text refs above (never replacing them, so
  // peekSpeechQueue / resume-from-cut / caption-sync stay byte-identical) and
  // carry each sentence's perception-buffer scriptId through the same
  // dispatch → queue → playback path. undefined = a speakText call with no
  // scriptId (kill-bridge / greeting / error-fallback) — those aren't in the
  // perception buffer, so they simply fire no stamp.
  const speakTextScriptIdQueueRef = useRef<(number | undefined)[]>([]); // ∥ speakTextQueueRef
  const audioQueueScriptIdRef = useRef<(number | undefined)[]>([]);     // ∥ audioQueueSentenceRef
  const currentScriptIdRef = useRef<number | undefined>(undefined);     // ∥ currentSpeakTextRef
  const pendingDispatchScriptIdRef = useRef<number | undefined>(undefined); // ∥ pendingDispatchSentenceRef
  const responseIdToScriptIdRef = useRef<Map<string, number>>(new Map()); // ∥ responseIdToSentenceRef
  // Fire a playback stamp iff the sentence carried a scriptId.
  const emitPlaybackStamp = useCallback(
    (scriptId: number | undefined, phase: 'start' | 'end' | 'skip') => {
      if (scriptId == null) return;
      onTtsSentencePlaybackRef.current?.({ scriptId, phase, atMs: Date.now() });
    },
    [],
  );
  // Monotonic counter bumped inside clearSpeechQueue. Each TTS dispatch
  // captures the epoch at start and re-checks before pushing decoded
  // PCM into audioQueueRef. If the epoch changed during the in-flight
  // fetch (i.e., the orchestrator killed the turn), drop the push so
  // the killed sentence doesn't play despite clearSpeechQueue having
  // already fired. Without this, the kill+retry flow plays the killed
  // turn's audio AND the retry's audio back-to-back — observed
  // 2026-05-04 Linear-Functions session.
  const speakEpochRef = useRef(0);
  // Task 1.1 (humanlike-latency): non-null while a streamed sentence's HEAD
  // has been queued but its TAIL is still arriving. Token identity (not just
  // the epoch) guards the tail push — interrupt()/pause() clear this without
  // bumping the epoch, and a tail-timeout swaps it to null so a late tail
  // can't land mid-next-sentence. playNextAudio's empty-queue branch treats
  // a live pending tail as an intra-sentence gap: no end stamp, no drain,
  // no next-sentence advance.
  const pendingTailRef = useRef<{ epoch: number } | null>(null);
  // Task X3: timestamp when the stuck-SPEAKING condition first became true, so
  // the watchdog fires only after the strand PERSISTS past the window (a normal
  // inter-sentence gap clears it long before). null = not currently stranded.
  const strandedSpeakingSinceRef = useRef<number | null>(null);
  // Pre-fetch cache for the openai-mini path. While sentence N is
  // playing, we kick off the HTTP fetch for sentence N+1 in parallel,
  // so its PCM bytes are ready the moment N's audio ends. Without this,
  // each sentence pays a 200-400ms HTTP round-trip after the previous
  // ends, producing audible gaps between sentences. The map is keyed by
  // the sentence text; cleared when the bytes are consumed.
  const ttsPrefetchCacheRef = useRef<Map<string, Promise<Float32Array | null>>>(new Map());

  // ── Task 3.1 (humanlike-latency): Cartesia TTS WebSocket transport ──────
  // One persistent WS synthesizes sentences with word timestamps. Each
  // sentence is a WsSynthJob: chunks buffer in the job until its dispatch
  // attaches a sink (then they flow straight into audioQueueRef, exactly
  // like the HTTP streamed-head path's pump). Word timestamps accumulate on
  // the job and are exposed to the word clock via sentenceWordsRef, keyed by
  // the ORIGINAL sentence text (the same key space as
  // audioQueueSentenceRef/currentSpeakTextRef labels).
  const onTtsTransportFallbackRef = useRef(onTtsTransportFallback);
  onTtsTransportFallbackRef.current = onTtsTransportFallback;
  const sonicWS = useCartesiaSonicWS({
    enabled: TUTOR_TTS_WS && isRelay && relayMode?.ttsProvider === 'cartesia',
    onFallback: (reason) => onTtsTransportFallbackRef.current?.(reason),
  });
  interface WsSynthJob {
    contextId: string;
    /** Undelivered chunks; emptied into the audio queue when a sink attaches. */
    chunks: Float32Array[];
    /** Word timestamps (rewritten-transcript words; startSec relative to the
     *  sentence's own audio). Live-appended — sentenceWordsRef holds this
     *  same object, so the word clock sees late frames automatically. */
    words: string[];
    starts: number[];
    done: boolean;
    failed: boolean;
    sink: ((chunk: Float32Array) => void) | null;
    /** Dispatch-time hook run on done/error while attached (tail release). */
    onTerminal: (() => void) | null;
    /** Resolves at the first audio chunk or terminal event — the dispatch's
     *  go/fallback decision point. */
    firstEvent: Promise<'chunk' | 'done' | 'error'>;
  }
  const wsSynthJobsRef = useRef<Map<string, WsSynthJob>>(new Map());
  const wsSynthSeqRef = useRef(0);
  const sentenceWordsRef = useRef<Map<string, { words: string[]; starts: number[] }>>(new Map());
  // Word clock: counts 'sentence-start' emissions since the last drain/kill
  // (same stream the consumer counts) + the last announced word index.
  const wsSentenceStartCountRef = useRef(0);
  const wordClockRef = useRef<{ sentence: string | null; wordIdx: number }>({ sentence: null, wordIdx: -1 });

  const startWsSynthJob = useCallback((trimmed: string): WsSynthJob | null => {
    if (!TUTOR_TTS_WS || ttsProviderRef.current !== 'cartesia') return null;
    // The slow-rate preset rides voice.__experimental_controls on the HTTP
    // route; keep the WS request surface minimal and let slow-mode sentences
    // use the proven HTTP path.
    if (speakingRateRef.current === 'slow') return null;
    const contextId = `s${speakEpochRef.current}-${wsSynthSeqRef.current++}`;
    let resolveFirst: (v: 'chunk' | 'done' | 'error') => void = () => {};
    const firstEvent = new Promise<'chunk' | 'done' | 'error'>((r) => { resolveFirst = r; });
    const job: WsSynthJob = {
      contextId, chunks: [], words: [], starts: [],
      done: false, failed: false, sink: null, onTerminal: null, firstEvent,
    };
    // Same rewrite the HTTP route applies server-side (rounds 12–24
    // pronunciation rules) — the WS transport sends transcripts verbatim.
    const spoken = rewriteForTTS(trimmed, { studentName: studentNameRef.current });
    void sonicWS
      .synthesize(spoken, {
        contextId,
        voiceId: cartesiaVoiceIdRef.current,
        onChunk: (chunk) => {
          if (job.sink) job.sink(chunk);
          else job.chunks.push(chunk);
          resolveFirst('chunk');
        },
        onWords: (w, s) => { job.words.push(...w); job.starts.push(...s); },
        onDone: () => { job.done = true; resolveFirst('done'); job.onTerminal?.(); },
        onError: (msg) => {
          job.failed = true;
          console.warn('[Realtime] sonic-ws sentence failed (HTTP fallback):', msg);
          resolveFirst('error');
          job.onTerminal?.();
        },
      })
      .then((accepted) => {
        if (!accepted) { job.failed = true; resolveFirst('error'); job.onTerminal?.(); }
      });
    wsSynthJobsRef.current.set(trimmed, job);
    return job;
  }, [sonicWS]);

  // Kill/supersede: cancel every WS synthesis (prefetched or in-flight) and
  // drop their word timestamps. Called from clearSpeechQueue.
  const cancelAllWsSynth = useCallback(() => {
    for (const job of wsSynthJobsRef.current.values()) {
      job.sink = null;
      job.onTerminal = null;
      sonicWS.cancel(job.contextId);
    }
    wsSynthJobsRef.current.clear();
    sentenceWordsRef.current.clear();
    wsSentenceStartCountRef.current = 0;
    wordClockRef.current = { sentence: null, wordIdx: -1 };
  }, [sonicWS]);

  // --- Parallel-connect plumbing ---------------------------------------------
  // Goal: shave ~1–2 s off session start-up. Previously we serialized
  //   buildInstructions → POST /realtime-token → open WS → send session.update.
  // Now POST /realtime-token and open WS happen in parallel with
  // buildInstructions, and session.update is sent whenever (a) the WS is open
  // AND (b) the instructions string has arrived — whichever completes last.
  const tokenPromiseRef = useRef<Promise<string | null> | null>(null);
  const sessionUpdateSentRef = useRef(false);
  const currentInstructionsRef = useRef(effectiveInstructions);
  const trySendSessionUpdateRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    currentInstructionsRef.current = effectiveInstructions;
  }, [effectiveInstructions]);
  // Stable ref to the relay-mode transcript handler so the WebSocket
  // message handler (long-lived closure) always sees the latest callback.
  const relayUserTranscriptRef = useRef(relayMode?.onUserTranscript);
  useEffect(() => {
    relayUserTranscriptRef.current = relayMode?.onUserTranscript;
  }, [relayMode?.onUserTranscript]);
  const isRelayRef = useRef(isRelay);
  useEffect(() => {
    isRelayRef.current = isRelay;
  }, [isRelay]);
  const ttsProviderRef = useRef<'realtime' | 'openai-mini' | 'cartesia' | 'silent'>(
    relayMode?.ttsProvider ?? 'realtime',
  );
  useEffect(() => {
    ttsProviderRef.current = relayMode?.ttsProvider ?? 'realtime';
  }, [relayMode?.ttsProvider]);
  // Cartesia migration Phase 2, Task 3: voiceId for /api/tutor/tts-cartesia
  // requests. Session-static in practice (one teacher persona per session),
  // but mirrored via a ref + effect like ttsProviderRef so a mid-session
  // prop change (e.g. teacher swap) would take effect on the next dispatch.
  const cartesiaVoiceIdRef = useRef<string | undefined>(relayMode?.cartesiaVoiceId);
  useEffect(() => {
    cartesiaVoiceIdRef.current = relayMode?.cartesiaVoiceId;
  }, [relayMode?.cartesiaVoiceId]);
  // Task W4: "Speak slower" toggle. UNLIKE ttsProviderRef/cartesiaVoiceIdRef
  // above, this is NOT session-static — the ⋯ menu can flip it mid-session.
  // fetchTTSPromise's cache key below folds this in for exactly that reason.
  const speakingRateRef = useRef<'slow' | 'normal'>(relayMode?.speakingRate ?? 'normal');
  useEffect(() => {
    speakingRateRef.current = relayMode?.speakingRate ?? 'normal';
  }, [relayMode?.speakingRate]);
  // Student name for name-aware TTS rewrites. Session-static; ref+effect
  // mirrors the cartesiaVoiceIdRef pattern above.
  const studentNameRef = useRef<string | undefined>(relayMode?.studentName);
  useEffect(() => {
    studentNameRef.current = relayMode?.studentName;
  }, [relayMode?.studentName]);
  // Both HTTP-based TTS providers (openai-mini, cartesia) share the exact
  // same dispatch/queue/cancel semantics — neither ever produces a Realtime
  // response.created/response.done event, so every place that gates on the
  // mini path (queue-drain in playNextAudio, dispatchSpeakText, speakText's
  // guard, drainSpeakTextQueueRef, clearSpeechQueue's immediate-stop branch)
  // must treat 'cartesia' identically. Centralized here so the widening is
  // one edit instead of six scattered ones. 'silent' (test mode) rides the
  // identical path — it only short-circuits the fetch inside fetchTTSPromise,
  // so the queue/cancel/drain semantics are byte-identical to openai-mini.
  const isHttpTtsProvider = useCallback(
    (p: 'realtime' | 'openai-mini' | 'cartesia' | 'silent') =>
      p === 'openai-mini' || p === 'cartesia' || p === 'silent',
    [],
  );
  const ttsAbortRef = useRef<AbortController | null>(null);

  // Update state and notify parent
  const updateState = useCallback((newState: RealtimeState) => {
    stateRef.current = newState;
    setState(newState);
    onStateChange?.(newState);
  }, [onStateChange]);

  // Stage 4 regression fix (2026-06-16): orchestrator-driven 'processing'
  // indicator. See the signalBrainThinking doc on RealtimeResult. Reads the
  // live state via stateRef (state is stale inside this callback) and only
  // transitions when it won't clobber 'speaking'/'connecting'/etc.
  const signalBrainThinking = useCallback((on: boolean) => {
    const cur = stateRef.current;
    if (on) {
      if (cur === 'listening' || cur === 'connected') updateState('processing');
    } else if (cur === 'processing') {
      updateState(shouldListenRef.current ? 'listening' : 'connected');
    }
  }, [updateState]);

  // Unlock the playback AudioContext from inside a user gesture. iOS
  // Safari starts contexts in 'suspended' state until any user-gesture-
  // bound code path calls .resume(). Without this, queued audio buffers
  // fire silently and the user only hears them when some LATER gesture
  // (often the Unmute tap) inadvertently resumes the context.
  const unlockAudio = useCallback(() => {
    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        void ctx.resume();
      }
      // Round-6 opener-echo fix: build the AEC reference route (media-element
      // playback path) NOW, inside the same session-start gesture — not
      // lazily at the first opener TTS chunk. Measured on portal-b3838f70:
      // the canceller only became effective ~10s after the route appeared,
      // which with lazy creation meant the entire opening turn leaked the
      // tutor's own voice into the mic (~-21dB at ~220ms — the raw
      // speaker→mic path). Priming here starts that clock before the mic
      // hears any tutor audio, and keeps el.play() inside the gesture chain
      // (a lazy first call after transient activation expires risks
      // play()-rejection → permanent fallback off the reference path).
      primePlaybackRoute(ctx);
    } catch (err) {
      console.warn('[Realtime] unlockAudio failed:', err);
    }
  }, []);

  // Play queued audio
  const playNextAudio = useCallback(() => {
    if (audioQueueRef.current.length === 0) {
      // Task 1.1: the streamed head finished but its tail is still arriving —
      // an INTRA-sentence gap, not a sentence end. Hold: no end stamp, no
      // drain, no next-sentence dispatch (audio order). The tail's resolution
      // (or its timeout) re-enters playNextAudio. Epoch check: a killed
      // sentence's pending tail must not hold the drain hostage.
      if (pendingTailRef.current && pendingTailRef.current.epoch === speakEpochRef.current) {
        isPlayingRef.current = false;
        return;
      }
      isPlayingRef.current = false;
      // V2 self-voice: the sentence whose audio just finished ends NOW. This
      // covers both the openai-mini inter-sentence gap (each sentence hits
      // this branch as it finishes) and the turn-final drain below.
      emitPlaybackStamp(currentScriptIdRef.current, 'end');
      currentScriptIdRef.current = undefined;
      // Stage 3.1 v2: nothing left in the audio pipeline. Null the
      // in-flight sentence so a subsequent cancel doesn't try to
      // resume audio that already played out.
      currentSpeakTextRef.current = null;
      currentSentencePlayedSecRef.current = 0;
      playedBeforeChunkSecRef.current = 0;
      currentChunkDurSecRef.current = 0;
      // HTTP-based TTS (openai-mini, cartesia) has no response.done event to
      // drive the queue, so drain the next sentence here when the audio
      // finishes. The realtime path leaves this branch alone — its drain
      // runs from response.done in the message handler.
      if (
        isRelayRef.current &&
        isHttpTtsProvider(ttsProviderRef.current) &&
        speakTextQueueRef.current.length > 0
      ) {
        // Inter-sentence gap in mini/cartesia-relay mode (the queue empties
        // between each sentence's fetch) — NOT a turn-end. Shift the next
        // sentence and keep going WITHOUT firing 'drain', so render↔speech
        // sync doesn't mistake the gap for the turn's last sentence.
        const next = speakTextQueueRef.current.shift()!;
        const nextId = speakTextScriptIdQueueRef.current.shift();
        pendingDispatchScriptIdRef.current = nextId;
        speakTextInFlightRef.current = false;
        sendOneSpeakTextViaOpenAITTSRef.current?.(next, nextId);
        return;
      }
      if (isRelayRef.current && isHttpTtsProvider(ttsProviderRef.current)) {
        speakTextInFlightRef.current = false;
      }
      // Render↔speech sync: truly nothing left to play (no queued sentence
      // to advance to) — the turn's last dispatched sentence has finished.
      // Fire 'drain' so the orchestrator flushes any remaining buffered
      // tail renders (turn-tail anchor).
      // Task 3.1 word clock: turn over — reset the sentence counter (the
      // consumer resets its playback-started count on the same boundary)
      // and drop this turn's word timestamps.
      wsSentenceStartCountRef.current = 0;
      wordClockRef.current = { sentence: null, wordIdx: -1 };
      sentenceWordsRef.current.clear();
      onTtsPlaybackProgressRef.current?.('drain');
      // If mic is running, go straight back to listening
      if (audioProcessorRef.current && mediaStreamRef.current) {
        updateState('listening');
      } else if (shouldListenRef.current && !userMutedRef.current) {
        // Mic should be on but isn't (e.g. homework upload before mic click) — start it.
        // Skip when the user has explicitly muted, otherwise mute-before-start would
        // silently un-mute once the opening greeting finishes playing.
        updateState('listening');
        startListeningRef.current();
      } else {
        updateState('connected');
      }
      return;
    }

    isPlayingRef.current = true;
    updateState('speaking');
    // Stage 4 cleanup (2026-06-15): the hard mic-gate that disabled
    // production-WS mic tracks during TTS is gone. It was a defense
    // against Whisper picking up the tutor's own voice — irrelevant
    // now that production WS doesn't transcribe. Perception WS has
    // its own MediaStream and handles self-voice via the classifier's
    // script-cancellation defense (Q1.5 layer 1).

    const ctx = getAudioContext();
    const chunk = audioQueueRef.current.shift()!;
    // Round 29 (replay-desync fix): tap the recorder HERE — at playback
    // start — not at the five synthesis/enqueue sites. Stamping at
    // synthesis wrote a 30s utterance into a 5s wall-clock window and,
    // worse, barge-ins/cancels discarded the queue in 8 places with the
    // full synthesized audio already recorded — audio the student never
    // heard, permanently shifting the track ahead of wall clock (the
    // "tutor talking to itself" replay artifact, portal-1c5b4c9f).
    // Dequeue is the single chokepoint every provider path funnels
    // through, and unplayed chunks now simply never reach the file.
    onTutorAudioChunkRef.current?.(chunk);
    // Stage 3.1 v2: dequeue the parallel sentence text and bind it as
    // the currently-heard sentence. If the chunk arrived without
    // sentence context (e.g., a rare pre-mapping race), leave the
    // ref alone — better stale than wrong.
    const sentText = audioQueueSentenceRef.current.shift();
    const sentScriptId = audioQueueScriptIdRef.current.shift();
    // Resume-from-cut (P5): accumulate audio-seconds played of the CURRENT
    // sentence (chunk samples / 24000). Reset on a sentence transition. At a
    // noise cut this + the queued-but-unplayed chunks of the same sentence give
    // the fraction spoken → which clause to resume from. See resume-from-cut.
    const chunkSec = chunk.length / 24000;
    if (sentText) {
      // Render↔speech sync: a chunk for a NEW sentence is being dequeued
      // (audio for it begins now) → fire 'sentence-start' so the
      // orchestrator can release renders anchored to the prior sentence.
      // Guard on a real transition so multi-chunk sentences fire once.
      if (sentText !== currentSpeakTextRef.current) {
        // V2 self-voice: a new sentence's audio begins now. The PREVIOUS
        // sentence (if one is still tracked — realtime path keeps multiple
        // sentences queued; the openai-mini path already ended it at the
        // empty-queue branch and cleared currentScriptIdRef) ends here.
        emitPlaybackStamp(currentScriptIdRef.current, 'end');
        emitPlaybackStamp(sentScriptId, 'start');
        currentScriptIdRef.current = sentScriptId;
        // Task 3.1 word clock: count the same emission stream the consumer
        // counts, so 'word' events' sentenceIdx aligns with its
        // playback-started count.
        wsSentenceStartCountRef.current++;
        onTtsPlaybackProgressRef.current?.('sentence-start');
        currentSentencePlayedSecRef.current = chunkSec;
        playedBeforeChunkSecRef.current = 0;                                  // caption clock: new sentence
      } else {
        currentSentencePlayedSecRef.current += chunkSec;
        playedBeforeChunkSecRef.current += currentChunkDurSecRef.current;     // caption clock: prior chunk done
      }
      currentSpeakTextRef.current = sentText;
    } else {
      currentSentencePlayedSecRef.current += chunkSec;
      playedBeforeChunkSecRef.current += currentChunkDurSecRef.current;       // caption clock: unlabeled chunk
    }
    currentChunkDurSecRef.current = chunkSec;                                 // caption clock
    chunkStartCtxTimeRef.current = ctx.currentTime;                          // caption clock
    const buffer = ctx.createBuffer(1, chunk.length, 24000);
    buffer.getChannelData(0).set(chunk);

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    // Round-5 echo fix: route to the media path so the browser's echo
    // canceller has a reference copy of what the speaker is playing. Falls
    // back to ctx.destination itself if that route is off or unavailable.
    source.connect(getPlaybackTarget(ctx));
    source.onended = () => {
      playNextAudio();
    };
    playbackSourceRef.current = source;
    // Re-open the AEC media route (no-op when it was never silenced, and when
    // the route is off). Doing it per chunk makes any stray silence
    // self-healing rather than a permanently mute tutor.
    unsilencePlaybackRoute(ctx);
    source.start();
    // Round-7 item 4: on the FIRST chunk per context, measure whether the
    // media-element sink plays faster than wall clock over the next 10s
    // (Android first-turn fast speech; self-guards to once per ctx).
    measureFirstPlayback(ctx);
  }, [updateState, isHttpTtsProvider, emitPlaybackStamp]);

  // Queue audio for playback
  const queueAudio = useCallback((base64Audio: string) => {
    const float32 = base64ToFloat32(base64Audio);

    // Recorder tap now lives in playNextAudio (playback time) — round 29.
    audioQueueRef.current.push(float32);

    if (!isPlayingRef.current) {
      playNextAudio();
    }
  }, [playNextAudio, onTutorAudioChunk]);

  // Handle WebSocket messages
  const handleMessage = useCallback(async (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);

      // Log all events for debugging (except rate_limits)
      if (!data.type.startsWith('rate_limits')) {
        console.log('[Realtime] Event:', data.type, data);
      }

      switch (data.type) {
        case 'session.created':
          console.log('[Realtime] Session created');
          updateState('connected');
          break;

        case 'session.updated':
          console.log('[Realtime] Session updated');
          break;

        case 'input_audio_buffer.speech_started':
          console.log('[Realtime] Speech detected');
          lastUserInputRef.current = Date.now(); // Mark user input at speech start, not transcription (which is delayed)
          postToolCallResponseCountRef.current = 0; // Reset post-tool-call counter on new student speech
          consecutiveRejectionsRef.current = 0;    // Reset rejection cascade on new student speech
          updateState('listening');
          break;

        case 'input_audio_buffer.speech_stopped':
          console.log('[Realtime] Speech ended');
          updateState('processing');
          // Start a transcription watchdog. If speech_stopped fires but
          // the transcription event never arrives within 12s (Whisper
          // is normally <2s; 12s = network/processing failure), force
          // the UI back to 'listening' so the student isn't stuck on
          // "Thinking…" with no recovery path. Cleared by either
          // transcription.completed or transcription.failed.
          if (transcriptionWatchdogRef.current) {
            clearTimeout(transcriptionWatchdogRef.current);
          }
          transcriptionWatchdogRef.current = setTimeout(() => {
            console.warn('[Realtime] Transcription watchdog fired — no transcript event in 12s; resetting state');
            transcriptionWatchdogRef.current = null;
            // Lever 3 / W2: if the SOCKET itself is dead/half-dead
            // (ws.onclose may not have fired), recover via the reconnect
            // ladder instead of dead-ending at the banner. ONLY when the
            // socket is not OPEN — an OPEN socket with no transcription
            // is the watchdog's ORIGINAL scope (server-side Whisper
            // stall); reconnecting wouldn't help and would churn the
            // session, so that case keeps the exact frozen behavior.
            // < 3 gate ⇒ an exhausted ladder also falls to the frozen
            // banner below (no reliance on scheduleReconnect's internal
            // exhaustion path here).
            if (
              reconnectEnabledRef.current &&
              !intentionallyDisconnectedRef.current &&
              wsRef.current?.readyState !== WebSocket.OPEN &&
              reconnectAttemptsRef.current < 3 &&
              scheduleReconnectRef.current?.()
            ) {
              return;
            }
            updateState(shouldListenRef.current ? 'listening' : 'connected');
            // Surface the silent failure to the parent. Without this, the
            // student's utterance disappears with no visible signal: audio
            // committed, Whisper never returned, state reset, conversation
            // looks frozen. Triggering the same 'failed' callback as the
            // explicit failure event lets the parent show its "voice is
            // having trouble — type instead" banner so the student isn't
            // stuck talking into the void.
            onTranscriptionStatus?.('failed');
          }, 12_000);
          break;

        case 'input_audio_buffer.committed':
          console.log('[Realtime] Audio committed');
          hasAudioInBufferRef.current = false;
          break;

        case 'conversation.item.input_audio_transcription.failed':
          // Whisper transcription failed (server-side). Without this
          // case, the watchdog above would kick in eventually — but it's
          // cleaner to handle the explicit failure event when the server
          // sends one.
          console.warn('[Realtime] Transcription failed:', data.error);
          if (transcriptionWatchdogRef.current) {
            clearTimeout(transcriptionWatchdogRef.current);
            transcriptionWatchdogRef.current = null;
          }
          updateState(shouldListenRef.current ? 'listening' : 'connected');
          onTranscriptionStatus?.('failed', data.error?.type);
          break;

        case 'conversation.item.input_audio_transcription.completed': {
          // Transcription completed — clear the watchdog (success path).
          if (transcriptionWatchdogRef.current) {
            clearTimeout(transcriptionWatchdogRef.current);
            transcriptionWatchdogRef.current = null;
          }
          // Q3: reset the reconnect ladder ONLY on proven end-to-end
          // recovery (a real transcription round-tripped). This also
          // subsumes the flap-breaker — a socket that reopens but never
          // delivers a transcription never resets, so it hits 3 and
          // falls back to the banner instead of looping forever.
          reconnectAttemptsRef.current = 0;
          onTranscriptionStatus?.('completed');
          // User's speech transcription.
          //
          // With turn_detection.create_response: false the server no longer
          // auto-generates a reply on every VAD commit; we manually call
          // response.create here ONLY for transcripts that look like real
          // speech. Phantom turns (ambient noise, empty transcripts, YouTube
          // hallucinations, phonetic garbage) get the user item deleted and
          // do not trigger a reply, so the tutor stays quiet when the
          // student isn't actually saying anything.
          const transcript = (data.transcript ?? '').trim();
          // Unmute grace window: drop the first transcription-completed
          // event within UNMUTE_GRACE_MS of an unmute. The audio in that
          // window is typically ambient noise / Bluetooth click / echo
          // and Whisper hallucinates words from it. Without this, every
          // unmute spawns a phantom student turn the brain reacts to.
          const sinceUnmute = Date.now() - unmuteAtRef.current;
          if (unmuteAtRef.current > 0 && sinceUnmute < UNMUTE_GRACE_MS) {
            console.log(`[Realtime] Dropping transcript within unmute grace window (${sinceUnmute}ms):`, JSON.stringify(transcript));
            if (data.item_id && wsRef.current?.readyState === WebSocket.OPEN) {
              wsRef.current.send(JSON.stringify({ type: 'conversation.item.delete', item_id: data.item_id }));
            }
            // Clear the timestamp so subsequent legitimate transcripts
            // pass through normally.
            unmuteAtRef.current = 0;
            // CRITICAL: reset state from 'processing' back to 'listening'
            // (or 'connected' if mic is off). speech_stopped flipped us to
            // 'processing'; if we drop the transcript without forwarding,
            // nothing else flips us back, and the UI sticks on "Thinking…"
            // forever. ROOT CAUSE of the 2026-04-29 electricity-session
            // stuck-tutor bug — the student spoke "I don't think so", the
            // audio committed, transcription either returned empty or was
            // dropped, and the indicator stayed up indefinitely.
            updateState(shouldListenRef.current ? 'listening' : 'connected');
            break;
          }
          const classification = classifyTranscript(transcript);
          if (classification === 'noise') {
            console.log('[Realtime] Dropping phantom turn (noise):', JSON.stringify(transcript));
            // Remove the phantom item from the server's conversation state
            // so it doesn't bloat the context window. item_id may be absent
            // for some pre-GA events — defensive check.
            if (data.item_id && wsRef.current?.readyState === WebSocket.OPEN) {
              wsRef.current.send(JSON.stringify({
                type: 'conversation.item.delete',
                item_id: data.item_id,
              }));
            }
            // Do NOT call onTranscriptUpdate (keeps the UI clean) and do NOT
            // trigger response.create. The tutor stays silent.
            // BUT — reset state. speech_stopped previously flipped us to
            // 'processing'; without this reset the UI hangs on "Thinking…"
            // forever waiting for a brain response that will never come
            // (we silently dropped the transcript). Same root cause as the
            // unmute-grace path above.
            updateState(shouldListenRef.current ? 'listening' : 'connected');
            break;
          }
          // 'clean' or 'uncertain' — surface to the UI and trigger a reply.
          if (transcript) {
            console.log('[Realtime] User transcript:', JSON.stringify(transcript), `(${classification})`);
            lastUserInputRef.current = Date.now();
            onTranscriptUpdate?.('user', transcript, true);
            if (isRelayRef.current) {
              // Relay mode: hand the transcript to the external brain. The
              // caller is responsible for orchestrating the response and
              // calling speakText() with the text Realtime should voice.
              // We do NOT send response.create here — that would let
              // Realtime author its own reply against the relay-mode
              // instructions (which tell it to relay only).
              try {
                relayUserTranscriptRef.current?.(transcript);
              } catch (err) {
                console.error('[Realtime] relayMode.onUserTranscript threw:', err);
              }
            } else if (!useRealtimeV2Ref.current && wsRef.current?.readyState === WebSocket.OPEN) {
              // GA gpt-realtime: manually trigger the reply. realtime-2 sets
              // turn_detection.create_response:true, so the server already
              // created the response on VAD commit — a manual response.create
              // here would double-respond.
              wsRef.current.send(JSON.stringify({ type: 'response.create' }));
            }
          } else {
            // Defensive: classifier returned non-noise but transcript is
            // empty (shouldn't happen — empty strings classify as noise
            // via NOISE_PATTERNS / length === 0 — but if a future change
            // breaks that invariant, the state would stick on 'processing'
            // forever. Reset back to listening here too.
            console.warn('[Realtime] Empty transcript reached forward path — resetting state');
            updateState(shouldListenRef.current ? 'listening' : 'connected');
          }
          break;
        }

        // GA API uses response.output_audio.delta
        case 'response.output_audio.delta':
        case 'response.audio.delta':
          // Audio chunk from the model
          if (data.delta) {
            // B1 hard-cancel: drop deltas that belong to a response we've
            // already cancelled. Otherwise the post-cancel in-flight
            // chunks slip into audioQueueRef after clearSpeechQueue
            // emptied it, and play on top of the bridge / retry audio.
            const respId = typeof data.response_id === 'string' ? data.response_id : null;
            if (respId && cancelledResponseIdsRef.current.has(respId)) {
              break;
            }
            console.log('[Realtime] Audio chunk received, length:', data.delta.length);
            // Stage 3.1 v2: tag this chunk with its sentence text so
            // peekSpeechQueue knows what audio is in the playback
            // pipeline. queueAudio pushes the chunk; the sentence push
            // happens in parallel.
            const sentText = respId ? (responseIdToSentenceRef.current.get(respId) ?? '') : '';
            const sentScriptId = respId ? responseIdToScriptIdRef.current.get(respId) : undefined;
            queueAudio(data.delta);
            audioQueueSentenceRef.current.push(sentText);
            audioQueueScriptIdRef.current.push(sentScriptId); // V2: ∥ scriptId
          }
          break;

        // GA API uses response.output_audio_transcript.delta
        case 'response.output_audio_transcript.delta':
        case 'response.audio_transcript.delta':
          // Incremental transcript of model's speech
          if (data.delta) {
            currentResponseTextRef.current += data.delta;
            onTranscriptUpdate?.('assistant', currentResponseTextRef.current, false);
          }
          break;

        // GA API uses response.output_audio_transcript.done
        case 'response.output_audio_transcript.done':
        case 'response.audio_transcript.done':
          // Final transcript of model's speech
          if (data.transcript) {
            currentResponseTextRef.current = data.transcript;
            onTranscriptUpdate?.('assistant', data.transcript, true);

            // Parse whiteboard commands from the response
            const { commands } = parseWhiteboardCommands(data.transcript);
            if (commands.length > 0) {
              onWhiteboardCommand?.(commands);
            }
          }
          break;

        // Cancel unwanted follow-up responses (model sends multiple without user input)
        case 'response.created': {
          // B1 hard-cancel: track this response's id so clearSpeechQueue
          // can register it in the cancelled set on KILL. Cleared on
          // response.done (the response completed naturally — no cancel
          // needed and any further deltas after this are unexpected).
          const createdRespId = data.response?.id;
          // Stage 3.1 v2: bind the response_id to the sentence text that
          // was just dispatched. Audio chunks for this response can then
          // be tagged with sentence text so peekSpeechQueue knows what
          // the student is hearing.
          if (typeof createdRespId === 'string' && pendingDispatchSentenceRef.current) {
            responseIdToSentenceRef.current.set(createdRespId, pendingDispatchSentenceRef.current);
            pendingDispatchSentenceRef.current = null;
            // V2: bind the same response to its perception scriptId so the
            // audio-chunk push can carry it (∥ responseIdToSentenceRef).
            if (pendingDispatchScriptIdRef.current != null) {
              responseIdToScriptIdRef.current.set(createdRespId, pendingDispatchScriptIdRef.current);
            }
            pendingDispatchScriptIdRef.current = undefined;
          }
          if (typeof createdRespId === 'string') {
            currentResponseIdRef.current = createdRespId;
            // Stage 3 fix #10 (2026-05-28): if a clearSpeechQueue fired
            // recently, any response.created within the grace window is
            // from the brain orchestrator's emit-after-abort race. Mark
            // it cancelled and send response.cancel immediately so the
            // server stops generating + any audio.delta still in transit
            // drops on arrival (the audio.delta handler reads from
            // cancelledResponseIdsRef).
            if (Date.now() < responseCancelWindowUntilRef.current) {
              cancelledResponseIdsRef.current.add(createdRespId);
              if (cancelledResponseIdsRef.current.size > 64) {
                const first = cancelledResponseIdsRef.current.values().next().value;
                if (first) cancelledResponseIdsRef.current.delete(first);
              }
              if (wsRef.current?.readyState === WebSocket.OPEN) {
                wsRef.current.send(JSON.stringify({ type: 'response.cancel' }));
              }
              console.warn(`[Realtime] STAGE-3 fix #10: auto-cancelled response ${createdRespId} (within ${RESPONSE_CANCEL_WINDOW_MS}ms grace after clearSpeechQueue)`);
              // Don't fall through to the unwanted-follow-up logic below
              // — we've already cancelled.
              break;
            }
          }
          const timeSinceLastResponse = Date.now() - lastResponseDoneRef.current;
          const timeSinceUserInput = Date.now() - lastUserInputRef.current;
          const noUserInputSinceLastResponse =
            lastResponseDoneRef.current > 0 &&
            timeSinceLastResponse < 3000 &&
            timeSinceUserInput > timeSinceLastResponse;

          // In brain-relay mode the brain emits N sentences per turn and we
          // queue them as separate response.creates. Each one fires a
          // response.created with no user input since the last response,
          // which would normally be cancelled. Exempt those: if the in-
          // flight flag is set, this response was issued by sendOneSpeakText
          // and must be allowed to play.
          if (noUserInputSinceLastResponse && speakTextInFlightRef.current) {
            break;
          }

          if (noUserInputSinceLastResponse) {
            if (lastResponseHadToolCallRef.current && postToolCallResponseCountRef.current === 0) {
              // Allow exactly ONE follow-up after a tool call (model speaks about what it drew)
              postToolCallResponseCountRef.current = 1;
              console.log('[Realtime] Allowing post-tool-call response (1 of 1)');
            } else {
              // Cancel any other follow-up — either non-tool-call or already used the one allowed
              console.log('[Realtime] Cancelling unwanted follow-up response (no user input since last response)');
              if (wsRef.current?.readyState === WebSocket.OPEN) {
                wsRef.current.send(JSON.stringify({ type: 'response.cancel' }));
              }
            }
          }
          lastResponseHadToolCallRef.current = false;
          break;
        }

        case 'response.done': {
          console.log('[Realtime] Response complete');
          lastResponseDoneRef.current = Date.now();
          currentResponseTextRef.current = '';
          // B1: response finished naturally — no longer in-flight for
          // cancel purposes. Don't touch cancelledResponseIdsRef here:
          // a response can transition to done AFTER we cancelled it
          // (server confirms cancel), in which case keeping the id in
          // the cancelled set is correct so any late deltas still drop.
          currentResponseIdRef.current = null;
          // Drain one queued speakText sentence (Phase 5 streaming brain).
          // Idempotent: if no queue, this just clears the in-flight flag.
          // Must run BEFORE the listening-state branch below, so a queued
          // sentence can fire before we open the mic.
          drainSpeakTextQueueRef.current();

          // Extract usage data from response.done event
          const responseUsage = data.response?.usage;
          let usage: RealtimeUsage | undefined;
          if (responseUsage) {
            usage = {
              totalTokens: responseUsage.total_tokens || 0,
              inputTokens: responseUsage.input_tokens || 0,
              outputTokens: responseUsage.output_tokens || 0,
              inputTextTokens: responseUsage.input_token_details?.text_tokens || 0,
              inputAudioTokens: responseUsage.input_token_details?.audio_tokens || 0,
              outputTextTokens: responseUsage.output_token_details?.text_tokens || 0,
              outputAudioTokens: responseUsage.output_token_details?.audio_tokens || 0,
              // GPT-Realtime-2 reports server-cached input tokens here;
              // GA gpt-realtime omits the field, so this is 0 there.
              inputCachedTokens: responseUsage.input_token_details?.cached_tokens || 0,
            };
            console.log('[Realtime] Usage:', JSON.stringify(usage));
          }
          onResponseDone?.(usage);
          // If no audio is playing/queued, resume listening
          if (!isPlayingRef.current && audioQueueRef.current.length === 0) {
            if (audioProcessorRef.current && mediaStreamRef.current) {
              updateState('listening');
            } else if (shouldListenRef.current && !userMutedRef.current) {
              // Same mute-before-start guard as in playNextAudio — don't auto-open
              // the mic after the greeting (or any response) if the user is muted.
              updateState('listening');
              startListeningRef.current();
            } else {
              updateState('connected');
            }
          }
          break;
        }

        // Handle output item events for text content
        case 'response.output_item.added':
          console.log('[Realtime] Output item added:', data.item?.type);
          break;

        case 'response.content_part.added':
          console.log('[Realtime] Content part added:', data.part?.type);
          break;

        // Handle function calls for whiteboard commands
        case 'response.output_item.done':
          if (data.item?.type === 'function_call') {
            const funcName = data.item.name;
            const rawArgsStr: string = data.item.arguments || '{}';

            // Try to parse function arguments, with multiple fallback strategies
            let funcArgs: Record<string, string> = {};
            let parsed = false;

            // Strategy 1: Direct JSON.parse
            try {
              funcArgs = JSON.parse(rawArgsStr);
              parsed = true;
            } catch {
              // Strategy 2: Escape literal control characters that appear
              // INSIDE string literals, leaving structural whitespace alone.
              //
              // Old version blanketly replaced every \n / \r / \t with \\n / \\r / \\t,
              // which broke pretty-printed JSON (newlines between object properties
              // became `\n` tokens outside strings — not valid JSON).
              try {
                const sanitized = escapeControlCharsInsideStrings(rawArgsStr);
                funcArgs = JSON.parse(sanitized);
                parsed = true;
              } catch {
                // Strategy 3: Best-effort repair for truncated JSON (response
                // cancelled mid-generation, buffer cut off, etc.). Closes
                // unclosed strings/braces/brackets and trims dangling keys.
                try {
                  const repaired = repairTruncatedJson(
                    escapeControlCharsInsideStrings(rawArgsStr),
                  );
                  funcArgs = JSON.parse(repaired);
                  parsed = true;
                  console.warn(
                    `[Realtime] JSON was truncated (len=${rawArgsStr.length}); recovered via repair`,
                  );
                } catch {
                // Strategy 4: Extract fields via regex (for SVG that breaks JSON structure)
                console.warn('[Realtime] JSON parse failed, extracting fields via regex');

                // Helper: unescape JSON string escape sequences from regex-extracted content
                const unescapeJsonString = (s: string): string =>
                  s.replace(/\\"/g, '"')
                   .replace(/\\\\/g, '\\')
                   .replace(/\\n/g, '\n')
                   .replace(/\\r/g, '\r')
                   .replace(/\\t/g, '\t')
                   .replace(/\\'/g, "'")
                   .replace(/\\\//g, '/');

                if (funcName === 'show_equation') {
                  const latexMatch = rawArgsStr.match(/"latex"\s*:\s*"((?:[^"\\]|\\.)*)"/);
                  const labelMatch = rawArgsStr.match(/"label"\s*:\s*"((?:[^"\\]|\\.)*)"/);
                  if (latexMatch) {
                    funcArgs = {
                      latex: unescapeJsonString(latexMatch[1]),
                      label: labelMatch ? unescapeJsonString(labelMatch[1]) : '',
                    };
                    parsed = true;
                  }
                }
                }  // end Strategy 3 catch body (= Strategy 4 regex-extract block)
              }  // end Strategy 2 catch body
            }  // end Strategy 1 catch body

            if (!parsed) {
              console.error(
                `[Realtime] Could not parse function arguments (funcName=${funcName}, len=${rawArgsStr.length}); head=${rawArgsStr.slice(0, 200)} | tail=${rawArgsStr.slice(-200)}`,
              );
              // Still send function result to avoid hanging the conversation
              if (wsRef.current?.readyState === WebSocket.OPEN) {
                wsRef.current.send(JSON.stringify({
                  type: 'conversation.item.create',
                  item: {
                    type: 'function_call_output',
                    call_id: data.item.call_id,
                    output: JSON.stringify({ success: false, message: 'Failed to parse arguments' }),
                  },
                }));
                wsRef.current.send(JSON.stringify({ type: 'response.create' }));
              }
              break;
            }

            console.log('[Realtime] Function call:', funcName, JSON.stringify(funcArgs).substring(0, 300));
            console.log('[Realtime] Function call args (full):', JSON.stringify(funcArgs));
            console.log('[Realtime] Function call raw args string:', rawArgsStr.slice(0, 500));
            lastResponseHadToolCallRef.current = true;

            // Handle query tools that don't map to a whiteboard command.
            // list_whiteboard_features is a pure lookup — the tutor calls
            // it to re-surface a prior item's manifest when the original
            // tool-result has rolled out of the Realtime context window.
            if (funcName === 'list_whiteboard_features') {
              const lookup = onQueryFeatures?.({ id: typeof funcArgs.id === 'string' ? funcArgs.id : undefined });
              if (wsRef.current?.readyState === WebSocket.OPEN) {
                wsRef.current.send(JSON.stringify({
                  type: 'conversation.item.create',
                  item: {
                    type: 'function_call_output',
                    call_id: data.item.call_id,
                    output: JSON.stringify(lookup && lookup.length > 0
                      ? {
                          success: true,
                          items: lookup,
                          usageNote: 'To mark any of these, call tutor_scribble with target set to the feature\'s "target" string exactly. Do not invent names — retry with a miss-hint if your first try does not resolve.',
                        }
                      : {
                          success: false,
                          message: 'The whiteboard is empty or that id does not exist. Render a show_* item first, then scribble on it using one of the target strings returned in that tool\'s result.',
                        }
                    ),
                  },
                }));
                wsRef.current.send(JSON.stringify({ type: 'response.create' }));
              }
              break;
            }
            // Reset the post-tool-call follow-up budget on every new tool call.
            // When the model chains multiple drawings (e.g. draw circle, then add
            // chord) we want it to narrate each one — not go silent after the
            // second. Without this reset, the "allow exactly ONE follow-up"
            // guard in the response.created handler cancels the second
            // narration because the budget was already spent on the first.
            postToolCallResponseCountRef.current = 0;

            // Convert function call to whiteboard command (shared logic)
            const command = mapFunctionCallToCommand(funcName, funcArgs);

            // Await the handler so we can learn whether it rejected the
            // command (empty problem, placeholder equation, etc.). When it
            // does, we must tell the LLM the tool call FAILED — otherwise
            // it narrates as if the whiteboard has content and rapidly
            // cascades more tool calls retrying the same broken content.
            let rejectionReason: string | null = null;
            let assignedId: string | null = null;
            let manifest: FeatureManifestEntry[] | null = null;
            let duplicateOf: {
              existingItemId: string;
              existingFeatures: Array<{ target: string; canonical: string; kind: string; description?: string }>;
            } | null = null;
            let boardSnapshot: Array<{
              itemId: string;
              action: string;
              title?: string;
              pageTitle?: string;
              featureCount: number;
            }> | null = null;
            if (command) {
              try {
                const result = await onWhiteboardCommand?.([command]);
                if (result && typeof result === 'object') {
                  if (Array.isArray(result.rejected) && result.rejected.length > 0) {
                    rejectionReason = result.rejected.map(r => `${r.action}: ${r.reason}`).join('; ');
                    console.warn('[Realtime] Tool call was rejected by handler:', rejectionReason);
                  }
                  if (Array.isArray(result.assignedIds) && result.assignedIds.length > 0) {
                    assignedId = result.assignedIds[0];
                  }
                  if (Array.isArray(result.manifests) && result.manifests.length > 0) {
                    const first = result.manifests[0];
                    if (Array.isArray(first) && first.length > 0) manifest = first;
                  }
                  if (Array.isArray(result.duplicates) && result.duplicates.length > 0) {
                    const dup = result.duplicates[0];
                    if (dup) duplicateOf = dup;
                  }
                  if (Array.isArray(result.boardSnapshot)) {
                    boardSnapshot = result.boardSnapshot;
                  }
                }
              } catch (err) {
                console.error('[Realtime] Handler threw for tool call:', err);
                rejectionReason = 'Handler threw an error while processing the command.';
              }
            } else {
              rejectionReason = `Unknown or unsupported function: ${funcName}`;
            }

            // Track consecutive rejections so we can break runaway retry
            // cascades. Reset on a successful tool call.
            if (rejectionReason) {
              consecutiveRejectionsRef.current += 1;
            } else {
              consecutiveRejectionsRef.current = 0;
            }

            // Send function call result back to continue the conversation.
            //
            // Three outcomes are possible for a show_* call:
            //   - duplicate: same args as an existing item — the handler
            //     skipped the render and returned the existing itemId. We
            //     surface that as `success: false, duplicate: true` so the
            //     tutor switches to scrollTo/scribble instead of redrawing.
            //   - rejected: validation failure (empty problem, etc.).
            //   - rendered: everything ok; surface the manifest features.
            //
            // boardSnapshot is appended to EVERY successful path so the
            // tutor sees what's already on the board at decision time.
            const snapshotPayload = boardSnapshot && boardSnapshot.length > 0
              ? {
                  boardSnapshot: boardSnapshot.map((s) => ({
                    itemId: s.itemId,
                    action: s.action,
                    ...(s.title ? { title: s.title } : {}),
                    ...(s.pageTitle ? { pageTitle: s.pageTitle } : {}),
                    featureCount: s.featureCount,
                  })),
                  boardSnapshotNote: 'These items are already on the whiteboard. If a future student request refers to one of them ("show the chart again", "explain that step"), use tutor_scroll_whiteboard or tutor_scribble — do NOT re-render with a show_* tool.',
                }
              : {};
            if (wsRef.current?.readyState === WebSocket.OPEN) {
              wsRef.current.send(JSON.stringify({
                type: 'conversation.item.create',
                item: {
                  type: 'function_call_output',
                  call_id: data.item.call_id,
                  output: JSON.stringify(duplicateOf
                    ? {
                        success: false,
                        duplicate: true,
                        message: `Skipped — an equivalent ${funcName} item is already on the whiteboard (${duplicateOf.existingItemId}). Do NOT redraw it. Use tutor_scroll_whiteboard to bring it into the student's view, or tutor_scribble to mark a specific feature on it.`,
                        existingItemId: duplicateOf.existingItemId,
                        existingFeatures: duplicateOf.existingFeatures,
                        ...snapshotPayload,
                      }
                    : rejectionReason
                    ? {
                        success: false,
                        message: `The ${funcName} call did not render. Reason: ${rejectionReason}. Do NOT tell the student the item is on the whiteboard. Apologize briefly and address the underlying issue (ask the student what they need, or retry with a full statement).`,
                        ...snapshotPayload,
                      }
                    : {
                        success: true,
                        message: `Displayed ${funcName.replace('show_', '')} on whiteboard`,
                        ...(assignedId ? { id: assignedId } : {}),
                        ...(manifest
                          ? {
                              features: manifest.map((f) => ({
                                target: pickManifestDisplayLabel(f),
                                canonical: f.name,
                                kind: f.kind,
                                ...(f.description ? { description: f.description } : {}),
                              })),
                              featuresNote: 'To mark any of these features later, call tutor_scribble and pass one of the "target" strings above as the `target` parameter. That is the ONLY way to address a feature — do not invent names, do not pass ids. If this list has rolled out of your context, call list_whiteboard_features to get it back.',
                            }
                          : {}),
                        ...snapshotPayload,
                      }
                  ),
                },
              }));
              // Trigger continuation. When the consecutive-rejection cap is
              // hit, FORCE a verbal-only correction instead of silence —
              // otherwise the model has already streamed phantom narration
              // ("I've circled X") and the student is left believing the
              // mark is on the board. The cap-mode prompt tells the model
              // to tool-stop and verbally retract.
              if (consecutiveRejectionsRef.current <= MAX_CONSECUTIVE_REJECTIONS) {
                wsRef.current.send(JSON.stringify({
                  type: 'response.create',
                }));
              } else {
                console.warn(
                  '[Realtime] Consecutive tool-call rejections hit cap',
                  consecutiveRejectionsRef.current,
                  '— forcing verbal-only retraction.'
                );
                wsRef.current.send(JSON.stringify({
                  type: 'response.create',
                  response: {
                    modalities: ['audio', 'text'],
                    instructions:
                      "STOP calling tools this turn. You burned your retry budget on a target that doesn't exist on the whiteboard. Tell the student briefly and honestly that you couldn't find the exact spot to mark, and ask them to describe it differently (e.g., 'which step number?' or 'which bar by name?'). Do NOT claim you marked, circled, highlighted, or underlined anything.",
                  },
                }));
              }
            }
          }
          break;

        case 'response.text.delta':
          // Text-only response delta
          if (data.delta) {
            currentResponseTextRef.current += data.delta;
            onTranscriptUpdate?.('assistant', currentResponseTextRef.current, false);
          }
          break;

        case 'response.text.done':
          // Text response complete
          if (data.text) {
            onTranscriptUpdate?.('assistant', data.text, true);
            const { commands } = parseWhiteboardCommands(data.text);
            if (commands.length > 0) {
              onWhiteboardCommand?.(commands);
            }
          }
          break;

        case 'error':
          const errorMessage = data.error?.message || 'Realtime API error';
          // Ignore non-critical errors
          if (errorMessage.includes('no active response found') ||
              errorMessage.includes('already has an active response') ||
              errorMessage.includes('buffer too small')) {
            console.log('[Realtime] Non-critical error (ignoring):', errorMessage);
            break;
          }
          console.error('[Realtime] Error:', data.error);
          const err = new Error(errorMessage);
          setError(err);
          onError?.(err);
          updateState('error');
          break;

        default:
          // Events we don't need to handle explicitly
          break;
      }
    } catch (err) {
      console.error('[Realtime] Failed to parse message:', err);
    }
  }, [updateState, onTranscriptUpdate, onWhiteboardCommand, onResponseDone, onError, onTranscriptionStatus, queueAudio]);

  // Connect to OpenAI Realtime API
  const connect = useCallback(async () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('[Realtime] Already connected');
      return;
    }

    intentionallyDisconnectedRef.current = false;
    updateState('connecting');
    setError(null);

    // [STARTUP] breadcrumbs — diagnose the "preparing your tutor" hang by
    // showing which connect phase stalls + elapsed ms (2026-06-23 recursion
    // startup-hang investigation). The phase with no following breadcrumb is
    // where it hung.
    const startupT0 = Date.now();
    const sb = (m: string) => console.log(`[STARTUP +${Date.now() - startupT0}ms] ${m}`);
    sb(`connect() begin — engine=${useRealtimeV2Ref.current ? 'realtime-2' : 'gpt-realtime'} relay=${isRelayRef.current} instrReady=${!!currentInstructionsRef.current}`);

    try {
      // Reuse a pre-fetched token if one is already in flight (see
      // prefetchToken below — fired on mount from the UI layer so the network
      // round-trip overlaps with buildInstructions).
      if (!tokenPromiseRef.current) {
        // Pass the relay-mode prompt at session-creation time so the session
        // is born with no default-tutor persona. Without this, the session
        // briefly runs with OpenAI's default ("You are a helpful, witty, and
        // friendly AI...") before our session.update lands — and even after
        // the update, behavior is sticky enough that Realtime still authors
        // greetings and answers questions in the brain's text instead of
        // voicing it verbatim.
        const initInstructions = isRelayRef.current
          ? currentInstructionsRef.current
          : undefined;
        tokenPromiseRef.current = fetch('/api/tutor/realtime-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ voice, instructions: initInstructions, engine: useRealtimeV2Ref.current ? 'realtime-2' : 'realtime' }),
        })
          .then(async (r) => {
            if (!r.ok) {
              const body = await r.text();
              console.error('[Realtime] Token request failed:', r.status, body);
              throw new Error(`Failed to get realtime token: ${r.status}`);
            }
            const d = await r.json();
            return (d.client_secret as string) || null;
          })
          .catch((err) => {
            console.error('[Realtime] Token fetch threw:', err);
            tokenPromiseRef.current = null; // allow retry
            throw err;
          });
      }
      sb('awaiting realtime-token…');
      const client_secret = await tokenPromiseRef.current;
      if (!client_secret) {
        throw new Error('Invalid token response: missing client_secret');
      }
      sb('token resolved → opening WS');
      console.log('[Realtime] Got client secret, connecting...');

      // Connect to OpenAI Realtime API. realtime-2 connects to the
      // gpt-realtime-2 model; every other engine uses the GA gpt-realtime.
      const realtimeModel = useRealtimeV2Ref.current ? 'gpt-realtime-2' : 'gpt-realtime';
      const ws = new WebSocket(
        `wss://api.openai.com/v1/realtime?model=${realtimeModel}`,
        ['realtime', `openai-insecure-api-key.${client_secret}`]
      );

      ws.onopen = () => {
        sb('WS onopen');
        console.log('[Realtime] WebSocket connected');
        everConnectedRef.current = true;

        // Fire session.update when instructions are ready. If they haven't
        // arrived yet, defer — the instructions-useEffect below will call us
        // again once they appear.
        const trySendSessionUpdate = () => {
          if (sessionUpdateSentRef.current) return;
          const inst = currentInstructionsRef.current;
          if (!inst) {
            sb('session.update DEFERRED — instructions (system prompt) not built yet');
            console.log('[Realtime] WS open but instructions not ready — deferring session.update');
            return;
          }
          if (ws.readyState !== WebSocket.OPEN) return;
          sb(`session.update SENT — instr len ${inst.length}`);
          console.log('[Realtime] Sending session.update (instructions length:', inst.length, ', relay:', isRelayRef.current, ')');
          sessionUpdateSentRef.current = true;
          // Relay mode: omit tools entirely. Realtime is STT+TTS only;
          // Claude (called from VoiceTutorRealtime via /api/tutor/brain)
          // is the author of every tool call.
          // realtime-2 may pass a subject-filtered tool subset; every
          // other engine registers the full WHITEBOARD_TOOLS.
          const sessionToolDefs = toolDefsRef.current ?? WHITEBOARD_TOOLS;
          const toolsBlock = isRelayRef.current
            ? {}
            : { tools: toOpenAITools(sessionToolDefs), tool_choice: 'auto' as const };
          if (!isRelayRef.current) {
            console.log('[Realtime] tools registered:', sessionToolDefs.length, 'of', WHITEBOARD_TOOLS.length);
          }
          // GPT-Realtime-2: attach reasoning.effort (env-tunable) and let
          // the server auto-create a response on each VAD commit. The GA
          // gpt-realtime path keeps create_response:false and drives
          // response.create manually from the transcription handler.
          const v2 = useRealtimeV2Ref.current;
          const reasoningBlock = v2
            ? { reasoning: { effort: process.env.NEXT_PUBLIC_TUTOR_RT2_REASONING_EFFORT || 'medium' } }
            : {};
          // Stage 4 cleanup (2026-06-15): perception WS is the sole
          // input authority. This WS omits the transcription config
          // and acts as a pure TTS sink. Server VAD block stays
          // configured but is inert without audio frames arriving
          // (input_audio_buffer.append is also skipped — see
          // onaudioprocess below). The whisper-1 transcription path is
          // gone; perception WS handles all student-input transcription
          // via its own MediaStream + gpt-realtime-2 connection.
          ws.send(JSON.stringify({
          type: 'session.update',
          session: {
            type: 'realtime',
            instructions: inst,
            ...toolsBlock,
            ...reasoningBlock,
            audio: {
              input: {
                turn_detection: {
                  type: 'server_vad',
                  threshold: vadThreshold,
                  prefix_padding_ms: vadPrefixPaddingMs,
                  silence_duration_ms: vadSilenceDurationMs,
                  create_response: v2,
                },
              },
              output: {
                voice: voice,
              },
            },
          },
        }));
        };  // end trySendSessionUpdate
        trySendSessionUpdateRef.current = trySendSessionUpdate;
        trySendSessionUpdate();

        // R32 T10: flush any typed messages queued while the WS was down.
        // Runs after session.update so the flushed sendTextMessage calls
        // land against an initialized session. sendTextMessageRef (not the
        // direct sendTextMessage closure) because sendTextMessage is
        // declared later in the file and its identity can change across
        // renders — the ref always points at the latest one.
        if (pendingTypedRef.current.length > 0) {
          const pending = pendingTypedRef.current.splice(0);
          console.log(`[Realtime] flushing ${pending.length} queued typed message(s)`);
          for (const p of pending) sendTextMessageRef.current(p.text, p.meta);
        }
      };

      ws.onmessage = handleMessage;

      ws.onerror = (event) => {
        // Round-7 item 3: a WS 'error' is always followed by onclose,
        // which owns the reconnect ladder when the flag is on. Surfacing
        // here bannered 'WebSocket connection error' mid-recovery and
        // nothing cleared it after the ladder succeeded (portal-b2fe010e:
        // banner stuck while the reconnect completed within ~1s).
        if (!shouldSurfaceWsError({
          intentionallyDisconnected: intentionallyDisconnectedRef.current,
          reconnectEnabled: reconnectEnabledRef.current,
        })) {
          console.warn('[Realtime] WebSocket error (transient — onclose owns reconnect):', event);
          return;
        }
        console.error('[Realtime] WebSocket error:', event);
        const err = new Error('WebSocket connection error');
        setError(err);
        onError?.(err);
        updateState('error');
      };

      ws.onclose = (event) => {
        console.log('[Realtime] WebSocket closed:', event.code, event.reason);
        wsRef.current = null;
        // Lever 2: an UNINTENTIONAL close (network drop, idle/session
        // expiry) attempts a bounded reconnect instead of dead-ending.
        // scheduleReconnect sets state to 'connecting' itself (Q5 — no
        // new UI) and returns true when a retry was scheduled. When the
        // flag is off, the disconnect is intentional, or the ladder is
        // exhausted, it returns false and we keep the frozen behavior.
        if (
          !intentionallyDisconnectedRef.current &&
          reconnectEnabledRef.current &&
          scheduleReconnectRef.current?.()
        ) {
          return;
        }
        updateState('disconnected');
      };

      wsRef.current = ws;

      // Dev-only test scaffold (caching-initiative Q6). Closes the raw
      // socket WITHOUT going through disconnect(), so ws.onclose sees
      // !intentionallyDisconnectedRef → exercises the exact lever-2
      // path. Lets every reconnect scenario be reproduced in seconds,
      // repeatedly, single-variable — no ~2h wait for real expiry, no
      // live tutoring session, zero inference spend. NODE_ENV-guarded;
      // never ships to production. Not a behavior change.
      if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
        (window as unknown as { __tutorForceRealtimeClose?: () => void }).__tutorForceRealtimeClose = () => {
          console.warn('[Realtime][dev] __tutorForceRealtimeClose() — simulating unintentional drop');
          wsRef.current?.close();
        };
      }
    } catch (err) {
      console.error('[Realtime] Connection error:', err);
      const error = err instanceof Error ? err : new Error('Connection failed');
      setError(error);
      onError?.(error);
      updateState('error');
    }
  }, [voice, vadThreshold, vadSilenceDurationMs, vadPrefixPaddingMs, handleMessage, onError, updateState]);

  // Break the connect↔reconnect circular dep via the file's existing
  // latest-fn-in-a-ref idiom (cf. startListeningRef below).
  connectRef.current = connect;

  /**
   * Reconnect ladder (caching-initiative levers 2+3, 2026-05-18).
   * Returns true when it has HANDLED the drop (scheduled a retry, or
   * exhausted the ladder and shown the frozen banner) so the caller
   * skips its own fallback; false when the caller should keep the
   * frozen dead-end behavior (flag off / intentional disconnect).
   *
   * Q3 ladder: 0 / 1 s / 3 s backoff, max 3 attempts, the counter
   * resets only on transcription.completed (proven end-to-end —
   * subsumes the flap-breaker). Q4 token: attempt 1 reuses the cached
   * client_secret (lever 1 keeps it valid 2 h → sub-second recovery,
   * no token round-trip); a prior failed attempt nulls tokenPromiseRef
   * so attempts 2-3 re-mint. W1/W3/W4 applied on every initiate.
   * Never tears down mic capture (Q2 guard covers the gap) and never
   * sets intentionallyDisconnectedRef.
   */
  const scheduleReconnect = useCallback((): boolean => {
    if (!reconnectEnabledRef.current || intentionallyDisconnectedRef.current) {
      return false;
    }
    if (reconnectAttemptsRef.current >= 3) {
      // Ladder exhausted — graceful degradation to the frozen behavior:
      // the existing voice-trouble banner + state reset (mirrors the
      // transcription.failed handler exactly). No new UX.
      console.warn('[Realtime] Reconnect ladder exhausted (3/3) — falling back to voice-trouble banner');
      if (reconnectTimerRef.current) { clearTimeout(reconnectTimerRef.current); reconnectTimerRef.current = null; }
      updateState(shouldListenRef.current ? 'listening' : 'connected');
      onTranscriptionStatus?.('failed');
      return true; // handled — caller must NOT also banner
    }
    const attemptIndex = reconnectAttemptsRef.current; // 0,1,2
    const delayMs = [0, 1000, 3000][attemptIndex] ?? 3000;

    // W1: kill any pending transcription watchdog — its utterance is
    // lost (audio went to a dead socket); the student re-speaks after
    // recovery. Without this it fires mid-reconnect and banners.
    if (transcriptionWatchdogRef.current) {
      clearTimeout(transcriptionWatchdogRef.current);
      transcriptionWatchdogRef.current = null;
    }
    // W4: drop stale playback from the dead session (don't let a
    // half-played reply resume / confuse the audio thread).
    audioQueueRef.current = [];
    isPlayingRef.current = false;
    hasAudioInBufferRef.current = false;
    // V2 self-voice fix wave (2026-07-15): this drain force-stops playback
    // without going through clearSpeechQueue, so the currently-playing
    // sentence's window (spokenEndedAt=null, set by the 'start' stamp) was
    // never closed — it stayed perpetually open until the 60s retention
    // trim, able to false-match a genuine student utterance that shares
    // vocabulary with the dead session's last line. Close it here, same as
    // clearSpeechQueue does for a barge-in cut. The sentence-level queues
    // (audioQueueScriptIdRef / speakTextScriptIdQueueRef /
    // pendingDispatchScriptIdRef) aren't cleared on this path, so there's
    // nothing queued-but-unplayed to skip-stamp.
    emitPlaybackStamp(currentScriptIdRef.current, 'end');
    currentScriptIdRef.current = undefined;
    // W3: force a fresh session.update on the next ws.onopen so the
    // reconnected session is re-armed with the BYTE-IDENTICAL frozen
    // config (server_vad + env threshold/silence/prefix +
    // create_response:false + whisper-1 + instructions) via the
    // existing trySendSessionUpdate. Reconnect introduces ZERO
    // VAD/turn-detection change.
    sessionUpdateSentRef.current = false;
    trySendSessionUpdateRef.current = null;
    // Q4 token: reuse the cached key on attempt 1; re-mint after a
    // prior failed attempt.
    if (attemptIndex > 0) {
      tokenPromiseRef.current = null;
    }

    reconnectAttemptsRef.current = attemptIndex + 1;
    updateState('connecting'); // Q5: reuse existing state, no new UI
    console.log(
      `[Realtime] Scheduling reconnect ${attemptIndex + 1}/3 in ${delayMs}ms ` +
      `(token=${attemptIndex > 0 ? 're-mint' : 'reuse'})`,
    );
    if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
    reconnectTimerRef.current = setTimeout(() => {
      reconnectTimerRef.current = null;
      if (intentionallyDisconnectedRef.current) return; // ended during backoff
      connectRef.current().catch((err) => {
        // A thrown connect() produces no ws.onclose — re-arm directly
        // so recovery doesn't stall mid-ladder.
        console.error('[Realtime] Reconnect attempt threw:', err);
        scheduleReconnectRef.current?.();
      });
    }, delayMs);
    return true;
  }, [updateState, onTranscriptionStatus, emitPlaybackStamp]);
  scheduleReconnectRef.current = scheduleReconnect;

  // Round-7 item 3: foreground re-arm. A backgrounded tab throttles the
  // ladder's timers and drops the network, so all 3 attempts can burn out
  // with the socket already gone — no onclose ever comes and voice stays
  // dead until reload. On visible: fresh ladder, and if the socket is
  // genuinely dead (never before session start, not while a backoff timer
  // is pending), reconnect silently through the existing ladder.
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const onVisibility = () => {
      if (document.visibilityState !== 'visible') return;
      if (!reconnectEnabledRef.current || intentionallyDisconnectedRef.current) return;
      reconnectAttemptsRef.current = 0;
      if (shouldReconnectOnForeground({
        visible: true,
        intentionallyDisconnected: intentionallyDisconnectedRef.current,
        everConnected: everConnectedRef.current,
        wsReadyState: wsRef.current ? wsRef.current.readyState : null,
        reconnectTimerPending: reconnectTimerRef.current !== null,
      })) {
        console.warn('[Realtime] foreground with dead socket — reconnecting');
        scheduleReconnectRef.current?.();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  // Fire the ephemeral-token fetch early so it can overlap with
  // buildInstructions (saves ~500–1500 ms on typical startup). Safe to call
  // multiple times — the promise is cached in tokenPromiseRef.
  const prefetchToken = useCallback(() => {
    if (tokenPromiseRef.current) return tokenPromiseRef.current;
    // MUST pass `engine` here too: connect() reuses this cached token
    // promise, so a prefetch minted for the wrong model leaves the WS
    // (opened with ?model=gpt-realtime-2) mismatched against the token's
    // gpt-realtime session.
    tokenPromiseRef.current = fetch('/api/tutor/realtime-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ voice, engine: useRealtimeV2Ref.current ? 'realtime-2' : 'realtime' }),
    })
      .then(async (r) => {
        if (!r.ok) {
          console.error('[Realtime] Token prefetch failed:', r.status, await r.text());
          tokenPromiseRef.current = null;
          return null;
        }
        const d = await r.json();
        return (d.client_secret as string) || null;
      })
      .catch((err) => {
        console.error('[Realtime] Token prefetch threw:', err);
        tokenPromiseRef.current = null;
        return null;
      });
    return tokenPromiseRef.current;
  }, [voice]);

  // When `instructions` arrives after the WebSocket is already open (parallel
  // startup path), poke the deferred session.update send.
  useEffect(() => {
    if (instructions) {
      trySendSessionUpdateRef.current?.();
    }
  }, [instructions]);

  // Disconnect
  const disconnect = useCallback(() => {
    shouldListenRef.current = false;
    // Mark as intentionally disconnected so any in-flight speakText
    // calls (final brain sentence still streaming when "End" was
    // tapped) silently skip instead of logging "speakText: not
    // connected" — observed 2026-04-29 ocean session.
    intentionallyDisconnectedRef.current = true;
    // Clear any pending transcription watchdog so it doesn't fire
    // post-disconnect and try to flip state back to 'listening' on
    // a torn-down session.
    if (transcriptionWatchdogRef.current) {
      clearTimeout(transcriptionWatchdogRef.current);
      transcriptionWatchdogRef.current = null;
    }
    // Cancel any pending reconnect backoff + reset the ladder counter
    // (caching-initiative lever 2). intentionallyDisconnectedRef is
    // already true above, so the timer callback's guard would also
    // catch this, but clearing the timer prevents the connect() call
    // outright. Counter reset gives a future fresh session a clean
    // ladder. Pass criterion #5 (End-tap / unmount during a pending
    // reconnect must NOT reconnect).
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    reconnectAttemptsRef.current = 0;

    // Stop audio capture
    if (audioProcessorRef.current) {
      audioProcessorRef.current.disconnect();
      audioProcessorRef.current = null;
    }
    if (mediaStreamRef.current) {
      // Release, don't stop: the Ink2 STT hook may still hold the same shared
      // capture. Tracks stop when the last holder releases (shared-mic.ts).
      releaseSharedMicStream(MIC_CONSUMER);
      mediaStreamRef.current = null;
    }

    // Close WebSocket
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    // Hard-stop the PLAYING AudioBufferSourceNode. 2026-07-11 (user
    // report): this teardown cleared the queue below but never stopped
    // the in-flight source — an End/Pause tap (unmount → this disconnect)
    // navigated away while the current TTS sentence played to the end of
    // its buffer. interrupt() and pause() both already stop it; disconnect
    // is the only teardown that didn't. (Pure WebAudio stop — does not
    // touch clearSpeechQueue's Promise-drain bridge machinery.)
    if (playbackSourceRef.current) {
      try { playbackSourceRef.current.stop(); } catch { /* may already be stopped */ }
      playbackSourceRef.current = null;
    }

    // Clear audio queue
    audioQueueRef.current = [];
    isPlayingRef.current = false;
    hasAudioInBufferRef.current = false;
    // R32 T10: drop any typed messages still queued for a dead socket — a
    // fresh connect() should not resurrect a prior session's stale input.
    pendingTypedRef.current = [];
    // V2 self-voice fix wave (2026-07-15): close the perpetually-open
    // window on whatever sentence was playing when this teardown fires —
    // see the reconnect-W4 comment above for why (same force-stop-without-
    // clearSpeechQueue gap).
    emitPlaybackStamp(currentScriptIdRef.current, 'end');
    currentScriptIdRef.current = undefined;

    // Reset parallel-connect state so the next connect() does a fresh fetch.
    tokenPromiseRef.current = null;
    sessionUpdateSentRef.current = false;
    trySendSessionUpdateRef.current = null;

    updateState('disconnected');
  }, [updateState, emitPlaybackStamp]);

  // Start listening (microphone capture)
  const startListening = useCallback(async () => {
    // Round-6 fix (portal-d7b24797: 43-min session with tutor.pcm16 but NO
    // student.pcm16): this used to hard-return when the production WS wasn't
    // OPEN — vestigial from when the processor streamed mic audio to the WS.
    // Since Stage 4 the WS is a pure TTS sink and the mic path's only
    // consumer is the session recorder (+ the perception energy window), so
    // a closed WS is no reason to skip opening the mic. Nothing ever retried
    // startListening, so one unlucky tap during a WS reconnect silently cost
    // the entire session's student track and pinned prod state at
    // 'connected' (every dispatch in that session logged prod=connected).
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.warn('[Realtime] startListening with production WS not open — proceeding (mic path is WS-independent since Stage 4)');
    }

    // Explicitly calling startListening is intent to un-mute. Clear the
    // user-muted override so future auto-start paths can proceed.
    userMutedRef.current = false;
    // Stamp the unmute time so the transcription handler can drop
    // phantom audio captured in the first ~1.5s.
    unmuteAtRef.current = Date.now();

    // If mic is already active, withdraw our mute intent (may have been
    // muted) and update state
    if (audioProcessorRef.current && mediaStreamRef.current) {
      setSharedMicConsumerMuted(MIC_CONSUMER, false);
      shouldListenRef.current = true;
      updateState('listening');
      return;
    }

    shouldListenRef.current = true;

    try {
      // Get microphone access. Round-5 echo fix: this is now the SHARED
      // capture, not a second independent getUserMedia running alongside the
      // Ink2 STT hook's. Two concurrent captures were costing us mobile
      // Safari's echo cancellation — see shared-mic.ts for the measurements.
      const stream = await acquireSharedMicStream(MIC_CONSUMER);
      mediaStreamRef.current = stream;
      // The shared stream may come back hardware-muted — a previous
      // muteInput() intent survives while the Ink2 hook keeps the stream
      // alive, so this "fresh" open inherits the muted track rather than the
      // enabled-by-default one a private getUserMedia would have returned.
      // Callers only reach startListening when they intend to listen (every
      // auto-start path checks userMutedRef first), so withdraw our intent.
      setSharedMicConsumerMuted(MIC_CONSUMER, false);

      // Create audio processor
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      const source = ctx.createMediaStreamSource(stream);
      const processor = ctx.createScriptProcessor(4096, 1, 1);

      // Browsers honor `new AudioContext({ sampleRate: 24000 })` inconsistently
      // (Safari and some Chromium states fall back to device native, usually
      // 48 kHz). We MUST convert mic audio to 24 kHz before sending it to the
      // OpenAI Realtime API (which expects pcm16@24kHz) AND before tapping it
      // for session recording (which assumes 24 kHz in storage + replay).
      const captureRate = ctx.sampleRate;
      const resamplerState: ResamplerState = { phase: 0, carry: null };
      if (captureRate !== 24000) {
        console.warn(
          `[Realtime] AudioContext running at ${captureRate} Hz; resampling mic to 24000 Hz`,
        );
      }

      // Silent-mic detector: accumulate the first ~1s of mic samples and
      // verify the track actually carries audio. We've seen sessions where
      // getUserMedia returned a stream but every sample was zero (e.g. OS-level
      // mic mute, or another consumer holding the device). Surface as a
      // non-fatal Error via onError so the tutor page logs it as a debug event.
      const SILENCE_PROBE_SAMPLES = 24000; // 1s at 24kHz
      const silenceProbe = { samples: 0, sumSq: 0, peak: 0, fired: false };

      processor.onaudioprocess = (e) => {
        // No WS guard here (round-6, portal-d7b24797): frames are never sent
        // to the production WS (Stage 4 — it's a TTS sink); this callback
        // only feeds the silence probe + the session recorder, and gating it
        // on WS state made the student track silently stop whenever the WS
        // dropped mid-session (and never exist if it was closed at tap time).
        const inputData = e.inputBuffer.getChannelData(0);
        const resampledData =
          captureRate === 24000
            ? inputData
            : resampleLinear(inputData, captureRate, 24000, resamplerState);

        // Silence probe — only inspect until we've gathered the probe window
        if (!silenceProbe.fired) {
          for (let i = 0; i < resampledData.length; i++) {
            const v = resampledData[i];
            const a = v < 0 ? -v : v;
            if (a > silenceProbe.peak) silenceProbe.peak = a;
            silenceProbe.sumSq += v * v;
          }
          silenceProbe.samples += resampledData.length;
          if (silenceProbe.samples >= SILENCE_PROBE_SAMPLES) {
            silenceProbe.fired = true;
            const rms = Math.sqrt(silenceProbe.sumSq / silenceProbe.samples);
            const peakDb = silenceProbe.peak > 0 ? 20 * Math.log10(silenceProbe.peak) : -Infinity;
            const rmsDb = rms > 0 ? 20 * Math.log10(rms) : -Infinity;
            // Threshold: peak below -60 dBFS over a full second = effectively
            // dead silence (typical room noise sits around -50 to -45 dBFS).
            if (peakDb < -60) {
              const msg = `Mic appears silent (peak=${peakDb.toFixed(1)}dBFS rms=${rmsDb.toFixed(1)}dBFS). Check OS-level mic permissions or device.`;
              console.warn('[Realtime]', msg);
              const err = new Error(msg);
              err.name = 'MicSilentWarning';
              onError?.(err);
            }
          }
        }

        // Tap student audio for recording (use ref to avoid stale closure).
        // The recorded audio is the only consumer of the resampled mic
        // stream now — production WS no longer transcribes (Stage 4
        // cleanup, 2026-06-15). Perception WS captures its own audio
        // via a separate MediaStream in usePerceptionWS.
        onStudentAudioChunkRef.current?.(resampledData);
      };

      source.connect(processor);
      // Round-6f (portal-8fded37f: "reverb on app switch" with the playback
      // route measured HEALTHY through every switch — el playing, track
      // live, ctx running): a ScriptProcessor must reach the destination to
      // keep firing, but wiring it DIRECTLY connects the MIC to the SPEAKER
      // through whatever the processor's output buffer holds. Spec says
      // that buffer starts silent; WebKit after an audio-session
      // interruption is exactly where "should be silent" has historically
      // broken down, and mic→speaker passthrough is the one remaining
      // mechanism that matches the symptom (the room + the tutor's own
      // speaker output re-amplified ≈ reverberation). Interpose a
      // zero-gain node — the processor still runs, and NOTHING it outputs
      // can ever be audible, on any engine, in any state.
      const silentSink = ctx.createGain();
      silentSink.gain.value = 0;
      processor.connect(silentSink);
      silentSink.connect(ctx.destination);
      audioProcessorRef.current = processor;

      updateState('listening');
      console.log('[Realtime] Microphone started');
    } catch (err) {
      console.error('[Realtime] Microphone error:', err);
      const error = err instanceof Error ? err : new Error('Microphone access failed');
      setError(error);
      onError?.(error);
    }
  }, [onError, updateState]);

  // Keep ref in sync for playNextAudio to call
  startListeningRef.current = startListening;

  // Stop listening
  const stopListening = useCallback(() => {
    // Stop audio capture
    if (audioProcessorRef.current) {
      audioProcessorRef.current.disconnect();
      audioProcessorRef.current = null;
    }
    if (mediaStreamRef.current) {
      // Release, don't stop: the Ink2 STT hook may still hold the same shared
      // capture. Tracks stop when the last holder releases (shared-mic.ts).
      releaseSharedMicStream(MIC_CONSUMER);
      mediaStreamRef.current = null;
    }

    // Commit the audio buffer. We used to send response.create here as
    // well, because server VAD only auto-responds on its own speech_stopped
    // detection and manual stop bypasses that. But with
    // turn_detection.create_response: false we gate response.create on the
    // classifyTranscript verdict in the transcription-completed handler, so
    // this commit will route through that same path — phantom (silent)
    // stops now produce no reply, just like phantom VAD turns.
    if (wsRef.current?.readyState === WebSocket.OPEN && hasAudioInBufferRef.current) {
      wsRef.current.send(JSON.stringify({
        type: 'input_audio_buffer.commit',
      }));
      hasAudioInBufferRef.current = false;
      updateState('processing');
    } else {
      hasAudioInBufferRef.current = false;
      updateState('connected');
    }
  }, [updateState]);

  // Mute input — stops mic capture and clears buffer WITHOUT committing or triggering a response.
  // Used when the student mutes their mic to prevent noise from being sent.
  const muteInput = useCallback(() => {
    // Record explicit mute intent so auto-start paths (playNextAudio,
    // response.done) honour it even if the mic hasn't been opened yet.
    userMutedRef.current = true;

    // Register OUR mute intent without destroying the tracks so unmute can
    // re-enable instantly. Round-6 fix (mute-grace regression): this used to
    // hardware-disable the shared capture outright, which deafened Ink2 the
    // instant the student muted — the mute-grace window ("perception listens
    // briefly to capture the in-flight utterance, then mutes") never heard a
    // thing. The track now goes hardware-off only once Ink2's own intent
    // (driven by the start-gate effect after grace expires) is muted too, so
    // "student muted" still ends fully silent — just not prematurely.
    setSharedMicConsumerMuted(MIC_CONSUMER, true);

    // If the student was speaking (audio in buffer), commit it so the AI processes it;
    // otherwise clear the buffer to discard any background noise
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      if (hasAudioInBufferRef.current) {
        wsRef.current.send(JSON.stringify({ type: 'input_audio_buffer.commit' }));
      } else {
        wsRef.current.send(JSON.stringify({ type: 'input_audio_buffer.clear' }));
      }
    }
    hasAudioInBufferRef.current = false;
    updateState('connected');
  }, [updateState]);

  // Interrupt playback
  const interrupt = useCallback(() => {
    // Stop playback. Stopping the BufferSource is not enough on the AEC
    // media route: samples already handed to the MediaStream keep playing and
    // bled over the next sentence (round-5 live test — "voice shakes until it
    // speaks again"). Zero the route's gain so nothing further enters it.
    silencePlaybackRoute(getAudioContext());
    if (playbackSourceRef.current) {
      try {
        playbackSourceRef.current.stop();
      } catch {}
      playbackSourceRef.current = null;
    }
    audioQueueRef.current = [];
    // Final-review fix wave (2026-07-16, item 2): clear the parallel label
    // arrays alongside audioQueueRef, mirroring clearSpeechQueue's handling
    // (~2816-2820). Left populated, a stale sentence/scriptId at the front
    // of these arrays would get shifted off and paired with the NEXT fresh
    // audio chunk pushed after this cut, wrongly 'start'-stamping and
    // re-opening a window for an old, already-cut sentence.
    audioQueueSentenceRef.current = [];
    audioQueueScriptIdRef.current = [];
    // Task 1.1: drop any in-flight streamed tail with the queue it belonged
    // to (interrupt/pause don't bump the speak epoch — token identity in the
    // tail handler does the rest).
    pendingTailRef.current = null;
    isPlayingRef.current = false;
    // V2 self-voice fix wave (2026-07-15): this is a genuine barge-in cut —
    // the sentence WAS audible up to now, same as clearSpeechQueue's drain.
    // Close its window instead of leaving spokenEndedAt=null (perpetually
    // open), which would let a real student utterance sharing vocabulary
    // with the cut sentence false-match as self-voice.
    emitPlaybackStamp(currentScriptIdRef.current, 'end');
    currentScriptIdRef.current = undefined;

    // Cancel current response
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'response.cancel',
      }));
    }

    updateState('connected');
  }, [updateState, emitPlaybackStamp]);

  // Pause - stop mic and audio without disconnecting WebSocket
  const pause = useCallback(() => {
    shouldListenRef.current = false;
    // Stop audio capture without committing buffer
    if (audioProcessorRef.current) {
      audioProcessorRef.current.disconnect();
      audioProcessorRef.current = null;
    }
    if (mediaStreamRef.current) {
      // Release, don't stop: the Ink2 STT hook may still hold the same shared
      // capture. Tracks stop when the last holder releases (shared-mic.ts).
      releaseSharedMicStream(MIC_CONSUMER);
      mediaStreamRef.current = null;
    }

    // Stop playback (see interrupt() for why the route is silenced too).
    silencePlaybackRoute(getAudioContext());
    if (playbackSourceRef.current) {
      try { playbackSourceRef.current.stop(); } catch {}
      playbackSourceRef.current = null;
    }
    audioQueueRef.current = [];
    // Final-review fix wave (2026-07-16, item 2): clear the parallel label
    // arrays alongside audioQueueRef — see interrupt() above for why.
    audioQueueSentenceRef.current = [];
    audioQueueScriptIdRef.current = [];
    // Task 1.1: drop any in-flight streamed tail with the queue it belonged
    // to (interrupt/pause don't bump the speak epoch — token identity in the
    // tail handler does the rest).
    pendingTailRef.current = null;
    isPlayingRef.current = false;
    // V2 self-voice fix wave (2026-07-15): close the window on whatever was
    // playing when pause() cut it — see interrupt() above for why.
    emitPlaybackStamp(currentScriptIdRef.current, 'end');
    currentScriptIdRef.current = undefined;

    // Cancel any in-progress response and clear uncommitted audio
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'response.cancel' }));
      wsRef.current.send(JSON.stringify({ type: 'input_audio_buffer.clear' }));
    }
    hasAudioInBufferRef.current = false;

    updateState('connected');
  }, [updateState, emitPlaybackStamp]);

  // Send text message (for testing or fallback)
  const sendTextMessage = useCallback((text: string, meta?: { typed?: boolean }) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      // R32: typed messages used to be silently DISCARDED here (silence audit
      // §7) — the input box gates on state-derived isConnected, which lags a
      // dead socket, so submissions vanished with only a console.error. Queue
      // and flush on reconnect instead (see connect()'s onopen handler).
      if (pendingTypedRef.current.length < 5) {
        pendingTypedRef.current.push({ text, meta });
        console.warn(`[Realtime] WS not open — queued typed message (${pendingTypedRef.current.length})`);
      } else {
        console.error('[Realtime] typed-message queue full — dropping');
      }
      return;
    }

    // Mark session as active — mic should auto-start after AI responds
    shouldListenRef.current = true;
    lastUserInputRef.current = Date.now();
    consecutiveRejectionsRef.current = 0; // Fresh student input breaks the rejection cascade

    // Relay mode: don't author a Realtime reply. Hand the text to the brain
    // orchestrator which decides what to say + which tools to call, then
    // voices the result via speakText. Without this branch, typed input
    // and any other sendTextMessage caller would let Realtime author under
    // the relay prompt — which produces refusals like "I'm unable to draw
    // or label images directly" because Realtime has no tools and is told
    // not to author. (Found 2026-04-26: incognito session showed the
    // typed "Draw a triangle..." input getting a refusal because the form
    // bypassed the brain entirely.)
    if (isRelayRef.current) {
      try {
        console.log('[Realtime] sendTextMessage relayed to brain, len=', text.length);
        // 2026-06-15: deliberate-input dispatches (Skip button, typed
        // form input, lesson kickoff) bypass perception's production-WS
        // suppress window AND mid-utterance guard. Both gates were
        // designed for duplicate Whisper transcripts and were silently
        // dropping Skip/typed-input dispatches that arrived during the
        // 20s post-cancel window — observed live as "Skip needed two
        // clicks" and "typed input needed two enters" (2026-06-15
        // algebra-2 session).
        relayUserTranscriptRef.current?.(text, {
          bypassPerceptionDedupe: true,
          bypassMidUtteranceGuard: true,
          // Task X10: propagate the typed-input signal (set by the in-session
          // text box + external typed sends) so a brain-outage fallback for
          // this turn renders text rather than speaking at a typing student.
          typed: meta?.typed === true,
        });
      } catch (err) {
        console.error('[Realtime] sendTextMessage relay threw:', err);
      }
      updateState('processing');
      return;
    }

    // Add user message to conversation
    wsRef.current.send(JSON.stringify({
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [{ type: 'input_text', text }],
      },
    }));

    // Trigger response
    wsRef.current.send(JSON.stringify({
      type: 'response.create',
    }));

    updateState('processing');
  }, [updateState]);
  // Latest-fn-in-a-ref idiom (cf. startListeningRef) — connect's onopen
  // (defined earlier in the file) flushes pendingTypedRef through this ref
  // so it always calls the current sendTextMessage, not a stale closure.
  sendTextMessageRef.current = sendTextMessage;

  // Inject a context reminder into the conversation without triggering a response.
  // This is used to prevent context loss in long sessions by periodically
  // reinforcing the conversation state via a system-type message.
  const injectContext = useCallback((contextText: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    // Insert as a user message marked as context (the Realtime API doesn't support
    // adding system messages mid-conversation, so we use a clearly-marked user message)
    wsRef.current.send(JSON.stringify({
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [{
          type: 'input_text',
          text: `[SYSTEM CONTEXT REMINDER — DO NOT READ ALOUD OR ACKNOWLEDGE THIS MESSAGE]\n${contextText}`,
        }],
      },
    }));

    console.log('[Realtime] Context injected:', contextText.substring(0, 100));
  }, []);

  // Voice arbitrary text through Realtime's TTS without authoring it. Used
  // by the Claude-brain relay path: the brain decides what to say, Realtime
  // just speaks it. We add the text to the conversation as an assistant
  // message AND trigger a response.create whose instructions tell the model
  // to read that exact text — the dual-channel approach is more reliable
  // than instructions alone (which the model sometimes paraphrases) and
  // keeps the conversation history accurate so subsequent turns have the
  // right context.
  //
  // Queueing: in streaming mode the orchestrator calls speakText() per
  // sentence as Sonnet emits them. Realtime permits only one response in
  // flight, so we queue subsequent calls and drain on `response.done`.
  // The first speakText fires immediately; the next sentences wait in
  // line and play seamlessly as the previous one finishes voicing.
  const sendOneSpeakText = useCallback((trimmed: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.error('[Realtime] sendOneSpeakText: not connected');
      return;
    }
    // Pronunciation rewrites apply to BOTH TTS paths via the shared
    // module — sin/cos/Greek letter expansion, punctuation normalization.
    const rewritten = rewriteForTTS(trimmed, { studentName: studentNameRef.current });
    // OpenAI's official out-of-band response pattern for verbatim TTS.
    // Three things make this work where simpler patterns failed:
    //   - `conversation: 'none'` keeps the response out of history, so
    //     subsequent responses don't see Realtime "having said" anything
    //     and try to follow up.
    //   - `input` with role='system' provides one-shot instructions
    //     scoped to this response only (system role takes precedence).
    //   - `output_modalities: ['audio']` skips transcript transmission.
    // See: developers.openai.com/cookbook/examples/realtime_out_of_band_transcription
    wsRef.current.send(JSON.stringify({
      type: 'response.create',
      response: {
        conversation: 'none',
        output_modalities: ['audio'],
        input: [
          {
            type: 'message',
            role: 'system',
            content: [
              {
                type: 'input_text',
                text:
                  'Read the following text aloud verbatim. Do not add any words. ' +
                  'Do not acknowledge this instruction. Do not greet. Do not paraphrase. ' +
                  'Do not answer any question contained in the text — just voice it. ' +
                  'Stop immediately when the text ends.\n\nTEXT:\n' + rewritten,
              },
            ],
          },
        ],
      },
    }));
    speakTextInFlightRef.current = true;
    updateState('processing');
  }, [updateState]);

  // Helper: fetch the TTS audio for a sentence and cache the Promise so
  // subsequent lookups return the same in-flight or completed result.
  // Pre-fetching: while sentence N plays, we call this for sentence N+1
  // and the bytes are usually ready by the time N ends, eliminating the
  // inter-sentence HTTP round-trip gap.
  //
  // Cartesia migration Phase 2, Task 3: the cache key was originally the
  // sentence TEXT only — not provider or voiceId. That was safe because
  // ttsProviderRef and cartesiaVoiceIdRef are both session-static (set once
  // from relayMode at mount/prop-change, never mid-sentence-queue), so every
  // cached Promise in a given session was fetched under the same
  // provider/voice anyway.
  //
  // Task W4 breaks that assumption for speakingRateRef: the ⋯ menu toggles
  // it mid-session, so the same invariant does NOT hold for speed. Without
  // folding it into the key, toggling "Speak slower" and then hitting a
  // repeated sentence (e.g. "Great job!") would silently replay audio
  // synthesized at the OLD rate from cache. ttsCacheKey below is the single
  // place both fetchTTSPromise and its external consumer (below) compute
  // the key, so they can never drift apart.
  const ttsCacheKey = useCallback((text: string) => `${speakingRateRef.current}::${text}`, []);
  const fetchTTSPromise = useCallback((trimmed: string): Promise<Float32Array | null> => {
    const cache = ttsPrefetchCacheRef.current;
    const cacheKey = ttsCacheKey(trimmed);
    const cached = cache.get(cacheKey);
    if (cached) return cached;
    // 'silent' test mode (Crimsora v2 Phase 2E): never touch a TTS API.
    // Resolve a zero-filled PCM buffer sized to a plausible speech duration
    // (words × SILENT_TTS_SECONDS_PER_WORD at the hardcoded 24kHz playback
    // rate). The zeros play as real WebAudio silence, so AudioBufferSource
    // 'ended' → playNextAudio recursion → sentence-start/drain events and
    // clearSpeechQueue's drain-promise all fire exactly as with real audio.
    // Do NOT return an empty/near-empty buffer: render-sync anchors visuals
    // to sentence completion, and a 0-length source never fires 'ended'.
    if (ttsProviderRef.current === 'silent') {
      const words = trimmed.split(/\s+/).filter(Boolean).length || 1;
      const samples = Math.max(
        Math.round(words * SILENT_TTS_SECONDS_PER_WORD * 24000),
        Math.round(0.1 * 24000), // ≥100ms floor so 'ended' timing stays sane
      );
      const promise = Promise.resolve(new Float32Array(samples));
      cache.set(cacheKey, promise);
      return promise;
    }
    const promise = (async (): Promise<Float32Array | null> => {
      const useCartesia = ttsProviderRef.current === 'cartesia';
      const url = useCartesia ? '/api/tutor/tts-cartesia' : '/api/tutor/tts-openai';
      // Task W4: map the student-facing 'slow' | 'normal' intent to each
      // provider's own speed contract.
      //  - Cartesia (sonic-3.5): voice.__experimental_controls.speed takes
      //    either its own tuned preset label ('slowest'|'slow'|'normal'|
      //    'fast'|'fastest') or a raw relative number in [-1.0, 1.0]. The
      //    label 'slow' is Cartesia's own calibrated preset — it reads more
      //    natural than guessing a numeric offset, so we use it as-is.
      //  - OpenAI (gpt-4o-mini-tts, /v1/audio/speech): `speed` is a flat
      //    multiplier, 0.25-4.0, default 1.0. 0.85 was picked as an
      //    audible-but-not-robotic slowdown — verified via a duration check
      //    against the dev route (see task-W4-report.md).
      // 'normal' omits the field entirely so every existing call is
      // byte-for-byte unchanged when the toggle is off.
      const speed = speakingRateRef.current === 'slow' ? (useCartesia ? 'slow' : 0.85) : undefined;
      const body = useCartesia
        ? { text: trimmed, voiceId: cartesiaVoiceIdRef.current, studentName: studentNameRef.current, ...(speed !== undefined ? { speed } : {}) }
        : { text: trimmed, studentName: studentNameRef.current, ...(speed !== undefined ? { speed } : {}) };
      // Bounded retry (2026-07-15 incident): a single mid-session transient
      // (ERR_HTTP2_PROTOCOL_ERROR → "Failed to fetch") killed a sentence
      // with no second attempt and wedged the turn. Network faults and 5xx
      // get 2 more tries with short backoff; 4xx fails fast (a bad request
      // won't get better). Round-28b: with the Cartesia breaker open
      // (2+ consecutive failed sentences), each sentence makes ONE quick
      // probe attempt instead — fast fallback during a sustained outage,
      // automatic recovery the moment Cartesia is healthy.
      const attemptCap = useCartesia && cartesiaConsecFailRef.current >= 2 ? 1 : 3;
      for (let attempt = 0; attempt < attemptCap; attempt++) {
        if (attempt > 0) {
          onTtsIssueRef.current?.('retrying');
          await new Promise((r) => setTimeout(r, 250 * attempt));
        }
        try {
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          });
          if (!res.ok) {
            console.error(`[Realtime] ${useCartesia ? 'cartesia' : 'openai-mini'} TTS fetch failed (attempt ${attempt + 1}):`, res.status);
            if (res.status < 500) return null;
            continue;
          }
          const buf = await res.arrayBuffer();
          if (buf.byteLength === 0) {
            // Defensive: a 200 with an empty body is a failed synthesis.
            console.error(`[Realtime] ${useCartesia ? 'cartesia' : 'openai-mini'} TTS returned empty body (attempt ${attempt + 1})`);
            continue;
          }
          if (useCartesia) cartesiaConsecFailRef.current = 0; // breaker closes on success
          return new Float32Array(buf);
        } catch (err) {
          if ((err as { name?: string })?.name === 'AbortError') return null;
          console.error(`[Realtime] TTS error (attempt ${attempt + 1}):`, err);
        }
      }
      // Round-28b (2026-07-18, replaces round-18's OpenAI-voice fallback —
      // a sudden accent change mid-lesson was a user dealbreaker): when
      // Cartesia exhausts, speak a SHORTENED recovery line through the
      // VOICE-MATCHED ElevenLabs fallback (Praveen's own clone / a
      // gender+accent match — see elevenlabs-voice-map.ts; the route
      // compresses the text server-side so the fallback voice says less).
      // If ElevenLabs also fails (outage / no subscription), degrade to
      // the captions pin at the board bottom — never a third voice.
      if (useCartesia) {
        cartesiaConsecFailRef.current++;
        onTtsIssueRef.current?.('retrying');
        try {
          const res = await fetch('/api/tutor/tts-elevenlabs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: trimmed, cartesiaVoiceId: cartesiaVoiceIdRef.current, studentName: studentNameRef.current }),
          });
          if (res.ok) {
            const buf = await res.arrayBuffer();
            if (buf.byteLength > 0) {
              console.warn('[Realtime] Cartesia exhausted — recovery line spoken via voice-matched ElevenLabs fallback');
              return new Float32Array(buf);
            }
          } else {
            console.error('[Realtime] ElevenLabs fallback failed:', res.status, await res.text().catch(() => ''));
          }
        } catch (err) {
          console.error('[Realtime] ElevenLabs fallback error:', err);
        }
        // Both voice engines down for this sentence → transient captions
        // pin with the unspoken text (round-28b captions fallback).
        onVoiceHiccupCaptionRef.current?.(trimmed);
      }
      return null;
    })();
    cache.set(cacheKey, promise);
    // A failed sentence must not be cached as permanently failed — evict it
    // so a later dispatch of the same text gets a fresh fetch (the old code
    // cached the rejected result forever).
    void promise.then((r) => { if (r === null) cache.delete(cacheKey); });
    return promise;
  }, [ttsCacheKey]);

  // Task 1.1 (humanlike-latency): single-attempt streaming fetch for the
  // COLD first dispatch of a Cartesia sentence. Resolves a playable ~0.4s
  // head as soon as it arrives; the rest streams into tailPromise. Any
  // failure (network, !ok, empty body) returns null and the caller falls
  // back to fetchTTSPromise's whole-buffer path — retries + ElevenLabs +
  // captions chain fully intact. Deliberately NOT cached: the result is
  // consumed by exactly one dispatch (prefetched sentences stay
  // whole-buffer; their bytes are ready before playback anyway).
  const fetchCartesiaStreamedHead = useCallback(async (trimmed: string): Promise<PcmChunkStream | null> => {
    const speed = speakingRateRef.current === 'slow' ? 'slow' : undefined;
    try {
      const res = await fetch('/api/tutor/tts-cartesia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: trimmed,
          voiceId: cartesiaVoiceIdRef.current,
          studentName: studentNameRef.current,
          ...(speed !== undefined ? { speed } : {}),
        }),
      });
      if (!res.ok || !res.body) return null;
      return await openPcmChunkStream(res.body, TTS_STREAM_HEAD_SAMPLES, TTS_STREAM_FOLLOW_SAMPLES);
    } catch (err) {
      if ((err as { name?: string })?.name !== 'AbortError') {
        console.warn('[Realtime] streamed TTS fetch failed — falling back to whole-buffer:', err);
      }
      return null;
    }
  }, []);

  // Alternative TTS path for relay mode: gpt-4o-mini-tts via HTTP. Returns
  // Float32 PCM at 24kHz, dropped directly into the audio playback queue.
  // Cheaper than Realtime audio output; chosen via relayMode.ttsProvider.
  const sendOneSpeakTextViaOpenAITTS = useCallback(async (trimmed: string, scriptId?: number) => {
    speakTextInFlightRef.current = true;
    updateState('processing');
    // Capture the speak epoch at dispatch time. If clearSpeechQueue runs
    // during the await below, the epoch will have changed and we must
    // NOT push these bytes into the playback queue — the sentence was
    // killed.
    const dispatchEpoch = speakEpochRef.current;
    try {
      // Task 3.1 (humanlike-latency): Cartesia over WebSocket with word
      // timestamps. Same gating as the streamed-head path below (Cartesia,
      // breaker closed, cache miss) plus normal speaking rate (slow-mode
      // rides the HTTP route's __experimental_controls). Every sentence —
      // cold or WS-prefetched — flows through here, so the whole turn gets
      // word timestamps; any per-sentence WS failure falls through to the
      // battle-tested HTTP chain (streamed head → whole-buffer → retries →
      // ElevenLabs → captions).
      if (
        TUTOR_TTS_WS &&
        ttsProviderRef.current === 'cartesia' &&
        speakingRateRef.current !== 'slow' &&
        cartesiaConsecFailRef.current < 2 &&
        !ttsPrefetchCacheRef.current.has(ttsCacheKey(trimmed))
      ) {
        const job = wsSynthJobsRef.current.get(trimmed) ?? startWsSynthJob(trimmed);
        if (job) {
          // Consumed by this dispatch — a repeat of the same text later
          // starts a fresh synthesis.
          wsSynthJobsRef.current.delete(trimmed);
          // Wait (bounded) for the first audio chunk. 'done'/'error' without
          // audio → fallback; a wedged WS must not stall the turn.
          const first = await Promise.race([
            job.firstEvent,
            new Promise<'timeout'>((r) => setTimeout(() => r('timeout'), SONIC_WS_FIRST_CHUNK_TIMEOUT_MS)),
          ]);
          if (dispatchEpoch !== speakEpochRef.current) {
            // Killed mid-wait — cancelAllWsSynth (via clearSpeechQueue)
            // already dropped the job; same orphaned-fetch handling as the
            // paths below (X3 wedge, invariant 3).
            sonicWS.cancel(job.contextId);
            if (
              shouldDrainAfterOrphanedFetch({
                isPlaying: isPlayingRef.current,
                audioQueueLen: audioQueueRef.current.length,
                speakTextInFlight: speakTextInFlightRef.current,
                speakTextQueueLen: speakTextQueueRef.current.length,
              })
            ) {
              playNextAudio();
            }
            return;
          }
          if ((first === 'chunk' || first === 'done') && job.chunks.length > 0) {
            cartesiaConsecFailRef.current = 0;
            // Word clock source: the job's live-appended words/starts.
            sentenceWordsRef.current.set(trimmed, job);
            const pushChunk = (chunk: Float32Array) => {
              audioQueueRef.current.push(chunk);
              audioQueueSentenceRef.current.push(trimmed);
              audioQueueScriptIdRef.current.push(scriptId);
            };
            for (const c of job.chunks) pushChunk(c);
            job.chunks = [];
            if (!job.done && !job.failed) {
              // Tail bookkeeping — identical semantics to the streamed-head
              // path (invariants 1–3): same-text continuation chunks, one
              // sentence-start stamp, pending-tail hold in playNextAudio.
              const tailToken = { epoch: dispatchEpoch };
              pendingTailRef.current = tailToken;
              const tailTimeout = setTimeout(() => {
                if (pendingTailRef.current === tailToken) {
                  console.warn('[Realtime] sonic-ws tail timeout — ending sentence early (truncated)');
                  pendingTailRef.current = null;
                  job.sink = null;
                  sonicWS.cancel(job.contextId);
                  if (!isPlayingRef.current) playNextAudio();
                }
              }, TTS_STREAM_TAIL_TIMEOUT_MS);
              job.sink = (chunk) => {
                if (pendingTailRef.current !== tailToken) {
                  job.sink = null;
                  sonicWS.cancel(job.contextId);
                  return;
                }
                if (dispatchEpoch !== speakEpochRef.current) {
                  pendingTailRef.current = null;
                  job.sink = null;
                  sonicWS.cancel(job.contextId);
                  return;
                }
                pushChunk(chunk);
                if (!isPlayingRef.current) playNextAudio();
              };
              job.onTerminal = () => {
                clearTimeout(tailTimeout);
                if (pendingTailRef.current !== tailToken) return;
                pendingTailRef.current = null;
                if (!isPlayingRef.current) playNextAudio();
              };
            }
            if (!isPlayingRef.current) playNextAudio();
            // Prefetch the NEXT queued sentence over the WS too (replaces
            // the HTTP prefetch on this path) so it ALSO carries word
            // timestamps and its audio is already streaming at its dispatch.
            const nextWs = speakTextQueueRef.current[0];
            if (nextWs && !wsSynthJobsRef.current.has(nextWs)) void startWsSynthJob(nextWs);
            return;
          }
          // No audio from the WS (error / timeout / empty done) → cancel and
          // fall through to the HTTP paths below.
          sonicWS.cancel(job.contextId);
          sentenceWordsRef.current.delete(trimmed);
        }
      }
      // Task 1.1: stream the cold first dispatch (flag-gated; Cartesia only;
      // cache-miss only — invariant 5; breaker-closed only, so the sustained-
      // outage probe path stays whole-buffer with its fast fallback).
      if (
        TUTOR_TTS_STREAM_HEAD &&
        ttsProviderRef.current === 'cartesia' &&
        cartesiaConsecFailRef.current < 2 &&
        !ttsPrefetchCacheRef.current.has(ttsCacheKey(trimmed))
      ) {
        const streamed = await fetchCartesiaStreamedHead(trimmed);
        if (streamed) {
          if (dispatchEpoch !== speakEpochRef.current) {
            // Killed mid-fetch — same orphaned-fetch handling as the
            // whole-buffer path below (X3 wedge, invariant 3).
            if (
              shouldDrainAfterOrphanedFetch({
                isPlaying: isPlayingRef.current,
                audioQueueLen: audioQueueRef.current.length,
                speakTextInFlight: speakTextInFlightRef.current,
                speakTextQueueLen: speakTextQueueRef.current.length,
              })
            ) {
              playNextAudio();
            }
            return;
          }
          cartesiaConsecFailRef.current = 0;
          audioQueueRef.current.push(streamed.head);
          audioQueueSentenceRef.current.push(trimmed);
          audioQueueScriptIdRef.current.push(scriptId);
          // Tail bookkeeping: follow-chunks carry the SAME sentence text, so
          // playNextAudio's transition guard skips the re-stamp (invariant 1)
          // and sentence completion only fires once the pump ends and the
          // last chunk drains (invariant 2, via the pending-tail hold).
          // Chunks are pumped INCREMENTALLY (~0.5s windows) — the 2026-07-22
          // live round showed a single monolithic tail gaps audibly while
          // the remainder synthesizes.
          if (!streamed.done) {
            const tailToken = { epoch: dispatchEpoch };
            pendingTailRef.current = tailToken;
            const tailTimeout = setTimeout(() => {
              if (pendingTailRef.current === tailToken) {
                console.warn('[Realtime] streamed tail timeout — ending sentence early (truncated)');
                pendingTailRef.current = null;
                if (!isPlayingRef.current) playNextAudio();
              }
            }, TTS_STREAM_TAIL_TIMEOUT_MS);
            void streamed.pump((chunk) => {
              // Token mismatch = timed out or a reset site cleared us
              // (interrupt/pause don't bump the epoch); epoch mismatch =
              // killed (invariant 3). Either way: stop pumping, reader
              // cancels, no more pushes.
              if (pendingTailRef.current !== tailToken) return false;
              if (dispatchEpoch !== speakEpochRef.current) {
                pendingTailRef.current = null;
                return false;
              }
              audioQueueRef.current.push(chunk);
              audioQueueSentenceRef.current.push(trimmed);
              audioQueueScriptIdRef.current.push(scriptId);
              if (!isPlayingRef.current) playNextAudio();
              return true;
            }).then(() => {
              clearTimeout(tailTimeout);
              if (pendingTailRef.current !== tailToken) return;
              pendingTailRef.current = null;
              // Pump complete: if the queue already drained (held branch),
              // re-enter so the sentence can end properly.
              if (!isPlayingRef.current) playNextAudio();
            });
          }
          if (!isPlayingRef.current) playNextAudio();
          // Prefetch the NEXT queued sentence exactly as the whole-buffer
          // path does (those land in the cache and play whole-buffer).
          const nextStreamed = speakTextQueueRef.current[0];
          if (nextStreamed) void fetchTTSPromise(nextStreamed);
          return;
        }
        // streamed === null → fall through to the standard whole-buffer path.
      }
      const float32 = await fetchTTSPromise(trimmed);
      // Consume the cache entry now that we're playing it. Must use the same
      // ttsCacheKey() the fetch was stored under (Task W4: the key now folds
      // in speakingRate) or this delete silently no-ops and the entry never
      // gets evicted.
      ttsPrefetchCacheRef.current.delete(ttsCacheKey(trimmed));
      if (dispatchEpoch !== speakEpochRef.current) {
        // Killed mid-fetch. Drop the bytes silently. Don't touch
        // speakTextInFlightRef here — clearSpeechQueue already reset
        // it, and the next legitimate dispatch will set it again.
        //
        // Task X3 (2026-07-16) stuck-SPEAKING wedge (session portal-da5b97a6):
        // when this parked dispatch was the queue's RESUME point — an
        // inter-sentence gap, where playNextAudio's empty-queue branch shifted
        // the next sentence, set isPlaying=false, and dispatched us — a bare
        // return here STRANDS the state machine. clearSpeechQueue (the barge-in
        // that bumped the epoch) called stop() on a source that had ALREADY
        // fired 'ended', so no onended re-runs playNextAudio to drain back to
        // 'listening'; state pins at 'speaking' with an empty pipeline until the
        // student manually toggles the mic. If nothing is playing and the audio
        // queue is empty, drive the drain-to-idle explicitly so the turn always
        // ends cleanly. (When a source IS still playing, its onended owns the
        // transition — leave it alone.)
        //
        // Fix-wave (X3 review, finding 1): the naive `!isPlaying &&
        // audioQueueLen === 0` check ALSO matches a legitimate new-turn
        // mid-fetch window (a NEW dispatch in flight with the next sentence
        // already queued, chunk just not arrived yet) — an orphaned pre-kill
        // fetch resolving in THAT window would wrongly hijack dispatch and
        // reorder/overlap sentences. Gate on all four via the pure predicate;
        // in the TRUE wedge all four are false/empty at once, because
        // clearSpeechQueue (the barge-in that bumped the epoch and produced
        // this orphaned fetch) resets speakTextInFlightRef and empties
        // speakTextQueueRef as part of the SAME kill — nothing else is in
        // flight or queued to hijack, so draining is safe.
        if (
          shouldDrainAfterOrphanedFetch({
            isPlaying: isPlayingRef.current,
            audioQueueLen: audioQueueRef.current.length,
            speakTextInFlight: speakTextInFlightRef.current,
            speakTextQueueLen: speakTextQueueRef.current.length,
          })
        ) {
          playNextAudio();
        }
        return;
      }
      if (!float32) {
        speakTextInFlightRef.current = false;
        // Terminal TTS failure for THIS sentence (fetch layer already
        // retried). 2026-07-15 incident: a bare return here orphaned the
        // remaining queued sentences and left state stuck at 'processing' —
        // the perception checkpoint then swallowed the student's next
        // utterance and the voice loop stayed wedged until a typed message
        // force-cleared it. Instead: skip the failed sentence and let
        // playNextAudio run the SAME advance/drain logic a finished chunk
        // would — dispatch the next queued sentence, or fire 'drain' and
        // return to listening when nothing is left.
        console.warn(`[Realtime] TTS terminally failed — skipping sentence: "${trimmed.slice(0, 60)}"`);
        onTtsIssueRef.current?.('skipped');
        // V2 self-voice: this sentence never reaches the speaker → zero its
        // perception window so the never-heard line can't match real speech.
        emitPlaybackStamp(scriptId, 'skip');
        if (!isPlayingRef.current) playNextAudio();
        return;
      }
      audioQueueRef.current.push(float32);
      // Stage 3.1 v2: tag this chunk with its sentence text. The
      // openai-mini path pushes a whole sentence as one chunk so the
      // mapping is trivial (no response_id needed — the sentence text
      // is right here).
      audioQueueSentenceRef.current.push(trimmed);
      audioQueueScriptIdRef.current.push(scriptId); // V2: ∥ scriptId
      if (!isPlayingRef.current) playNextAudio();
      // Pre-fetch the NEXT queued sentence's audio in parallel so its
      // bytes are ready when this one ends. Idempotent — repeat calls
      // for the same text return the cached Promise.
      const nextSentence = speakTextQueueRef.current[0];
      if (nextSentence) {
        // Fire-and-forget; result lands in the cache for the next dispatch.
        void fetchTTSPromise(nextSentence);
      }
    } finally {
      ttsAbortRef.current = null;
    }
  }, [updateState, onTutorAudioChunk, playNextAudio, fetchTTSPromise, emitPlaybackStamp, ttsCacheKey, sonicWS, startWsSynthJob]);
  const sendOneSpeakTextViaOpenAITTSRef = useRef(sendOneSpeakTextViaOpenAITTS);
  sendOneSpeakTextViaOpenAITTSRef.current = sendOneSpeakTextViaOpenAITTS;

  const dispatchSpeakText = useCallback((trimmed: string, scriptId?: number) => {
    if (isRelayRef.current && isHttpTtsProvider(ttsProviderRef.current)) {
      sendOneSpeakTextViaOpenAITTS(trimmed, scriptId);
    } else {
      // Realtime path carries scriptId via pendingDispatchScriptIdRef →
      // responseIdToScriptIdRef (set by the caller before dispatch).
      sendOneSpeakText(trimmed);
    }
  }, [sendOneSpeakText, sendOneSpeakTextViaOpenAITTS, isHttpTtsProvider]);

  const speakText = useCallback((text: string, scriptId?: number) => {
    const usingOpenAITTS = isRelayRef.current && isHttpTtsProvider(ttsProviderRef.current);
    if (!usingOpenAITTS && (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN)) {
      // Skip + warn (NOT error) when the WS isn't open. Stay fully quiet when
      // the disconnect is intentional (End tapped) OR we're mid-(re)connect —
      // a transient where a prior turn's stream is orphaned (e.g. a new-session
      // remount, or React StrictMode's dev-only connect→cleanup→connect
      // double-invoke). Downgraded from console.error because Next's dev
      // overlay promotes any console.error to a full-screen error panel, which
      // made this benign skip look like a crash/bounce on new-session start
      // (2026-06-23 Test 3). Prod builds don't double-invoke effects, so this
      // path is essentially dev-only.
      if (!intentionallyDisconnectedRef.current && stateRef.current !== 'connecting') {
        console.warn('[Realtime] speakText skipped — WS not open (transient)');
      }
      return;
    }
    if (!text || !text.trim()) return;
    const trimmed = text.trim();
    // Task 3.1: open the TTS WebSocket alongside the first sentence's
    // dispatch (idempotent; no-op unless flag+provider match or once
    // degraded) so the handshake overlaps brain latency instead of
    // preceding audio.
    if (TUTOR_TTS_WS && ttsProviderRef.current === 'cartesia') sonicWS.prewarm();
    if (speakTextInFlightRef.current) {
      speakTextQueueRef.current.push(trimmed);
      speakTextScriptIdQueueRef.current.push(scriptId); // V2: ∥ scriptId
      return;
    }
    // Stage 3.1 v2: stash text in pendingDispatchSentenceRef so the
    // response.created handler can map the Realtime response_id back
    // to this sentence. Audio chunks then carry sentence text through
    // audioQueueSentenceRef. currentSpeakTextRef is NOT set here —
    // it gets set when a chunk dequeues for playback.
    pendingDispatchSentenceRef.current = trimmed;
    pendingDispatchScriptIdRef.current = scriptId; // V2: ∥ scriptId
    dispatchSpeakText(trimmed, scriptId);
  }, [dispatchSpeakText, isHttpTtsProvider, sonicWS]);

  // Stable ref so the response.done handler (long-lived closure) can
  // drain the queue without depending on speakText's identity.
  const drainSpeakTextQueueRef = useRef<() => void>(() => {});
  drainSpeakTextQueueRef.current = () => {
    speakTextInFlightRef.current = false;
    const next = speakTextQueueRef.current.shift();
    if (!next) return;
    const nextId = speakTextScriptIdQueueRef.current.shift(); // V2: ∥ scriptId
    // Stage 3.1 v2: stash next sentence for the response.created
    // mapping. Don't touch currentSpeakTextRef — that's driven by
    // chunk dequeue in playNextAudio.
    pendingDispatchSentenceRef.current = next;
    pendingDispatchScriptIdRef.current = nextId;
    if (isRelayRef.current && isHttpTtsProvider(ttsProviderRef.current)) {
      sendOneSpeakTextViaOpenAITTSRef.current(next, nextId);
    } else {
      sendOneSpeakText(next);
    }
  };

  // Cancel any in-flight TTS response and drop pending sentences.
  // Used by the orchestrator's validator-feedback retry path so the
  // rejected attempt's voice doesn't bleed into the corrected one.
  //
  // Returns a Promise that resolves AFTER the playing AudioBufferSource
  // has fired its `onended` event (or immediately if nothing was playing).
  // The native `source.stop()` call returns synchronously but the actual
  // audio tail can keep playing for a frame or two while the WebAudio
  // graph tears down. Without awaiting the drain, the kill-path bridge
  // phrase queued right after stop() can start audibly overlapping the
  // dying tail — observed during round-7 judge-KILL spirals where the
  // student heard the previous attempt's last word bleeding into "Let me
  // try that a different way."
  const clearSpeechQueue = useCallback((): Promise<void> => {
    // Bump the speak epoch BEFORE we clear queues — any TTS dispatch
    // currently parked at `await fetchTTSPromise` will compare against
    // this new value when it resumes and silently drop the bytes
    // instead of pushing them into the freshly-emptied audio queue.
    // Without this, the killed turn's pre-fetched sentences leak
    // through the clear and play after the kill (observed 2026-05-04
    // Linear-Functions kill-then-retry overlap).
    speakEpochRef.current++;
    // Stage 3 fix #10 (2026-05-28): open the response-cancel grace
    // window. Any response.created that fires within this window will
    // be auto-cancelled (added to cancelledResponseIdsRef + server-side
    // response.cancel sent) — closes the emit-after-abort race for the
    // queued-but-not-yet-active responses that the brain orchestrator's
    // SSE buffer may have queued just before the AbortError propagated.
    responseCancelWindowUntilRef.current = Date.now() + RESPONSE_CANCEL_WINDOW_MS;
    const droppedCount = speakTextQueueRef.current.length;
    speakTextQueueRef.current = [];
    // V2 self-voice: reconcile the perception buffer for a barge-in drain.
    // The sentence that was PLAYING (currentScriptIdRef) really was audible
    // up to now → 'end' at cut time (keeps its real start). Everything that
    // was queued/fetching but NEVER started — future realtime chunks
    // (audioQueueScriptIdRef), the in-flight fetch (pendingDispatchScriptIdRef),
    // and undispatched pending sentences (speakTextScriptIdQueueRef) — is
    // 'skip'ped so those never-heard lines can't match real student speech.
    emitPlaybackStamp(currentScriptIdRef.current, 'end');
    const skipped = new Set<number>();
    const collectSkip = (id: number | undefined) => {
      if (id != null && id !== currentScriptIdRef.current) skipped.add(id);
    };
    for (const id of audioQueueScriptIdRef.current) collectSkip(id);
    for (const id of speakTextScriptIdQueueRef.current) collectSkip(id);
    collectSkip(pendingDispatchScriptIdRef.current);
    for (const id of skipped) emitPlaybackStamp(id, 'skip');
    // Stage 3.1 v2: clear the sentence tracking. peekSpeechQueue was
    // called BEFORE this so the snapshot is already captured. Leaving
    // these populated past this point would wrongly include them in
    // a SUBSEQUENT cancel's snapshot.
    currentSpeakTextRef.current = null;
    audioQueueSentenceRef.current = [];
    // Task 1.1: the epoch bump above already invalidates the tail push;
    // clear the hold so the empty-queue branch can't misread a stale token.
    pendingTailRef.current = null;
    pendingDispatchSentenceRef.current = null;
    // V2: clear the parallel id tracking in lockstep.
    currentScriptIdRef.current = undefined;
    audioQueueScriptIdRef.current = [];
    speakTextScriptIdQueueRef.current = [];
    pendingDispatchScriptIdRef.current = undefined;
    // Drop any pre-fetched TTS bytes — they're for sentences we're
    // about to skip via clearSpeechQueue (validator-feedback retry).
    ttsPrefetchCacheRef.current.clear();
    // Task 3.1: cancel WS syntheses (prefetched AND in-flight) the same way.
    cancelAllWsSynth();
    // openai-mini path: abort any in-flight TTS fetch + stop playback.
    if (ttsAbortRef.current) {
      ttsAbortRef.current.abort();
      ttsAbortRef.current = null;
    }
    // Capture the source we're about to stop so we can await its
    // teardown. Both branches below null this out implicitly via
    // `audioQueueRef.current = []` clearing the playback chain, but
    // the source's `onended` is what actually signals the drain.
    const sourceBeingStopped = playbackSourceRef.current;
    let stopped = false;
    if (
      isRelayRef.current &&
      isHttpTtsProvider(ttsProviderRef.current) &&
      speakTextInFlightRef.current
    ) {
      try { playbackSourceRef.current?.stop(); } catch { /* may already be stopped */ }
      audioQueueRef.current = [];
      isPlayingRef.current = false;
      speakTextInFlightRef.current = false;
      stopped = true;
    }
    if (speakTextInFlightRef.current && wsRef.current?.readyState === WebSocket.OPEN) {
      // B1 hard-cancel: register the in-flight response id BEFORE
      // sending response.cancel so any audio.delta still in transit
      // from the server drops on arrival instead of slipping into
      // audioQueueRef after we just emptied it.
      const cancelId = currentResponseIdRef.current;
      if (cancelId) {
        cancelledResponseIdsRef.current.add(cancelId);
        // Cap the set so repeated kills over a long session don't grow
        // it unbounded. 64 is generous — the most aggressive observed
        // session has ~10 kills total.
        if (cancelledResponseIdsRef.current.size > 64) {
          const first = cancelledResponseIdsRef.current.values().next().value;
          if (first) cancelledResponseIdsRef.current.delete(first);
        }
      }
      wsRef.current.send(JSON.stringify({ type: 'response.cancel' }));
      // Stop client-side audio that's already arrived.
      try { playbackSourceRef.current?.stop(); } catch { /* may already be stopped */ }
      audioQueueRef.current = [];
      isPlayingRef.current = false;
      speakTextInFlightRef.current = false;
      stopped = true;
    }
    // Voice Perception Layer (Stage 3, 2026-05-26) — defensive third
    // branch. When the brain has finished emitting but the
    // AudioBufferSource is still playing through client-side queued
    // chunks (response.done fired but audio is draining), the two
    // branches above do nothing because speakTextInFlightRef is false.
    // Without this, Stage 3 barge-in CANNOT cut the tutor off in the
    // common case where the brain emit ended just before the student
    // spoke (observed live 2026-05-26: both barge-in attempts left
    // the tutor talking through the entire utterance). For pre-Stage-3
    // callers (validator-feedback retry, B1 hard-cancel) this branch
    // is moot — they always have an in-flight response and stopped is
    // already true. Purely additive.
    if (!stopped && playbackSourceRef.current) {
      silencePlaybackRoute(getAudioContext());
      try { playbackSourceRef.current.stop(); } catch { /* may already be stopped */ }
      audioQueueRef.current = [];
      isPlayingRef.current = false;
      console.log('[Realtime] clearSpeechQueue: hard-stopped post-response audio');
      stopped = true;
    }
    if (droppedCount > 0) {
      console.log(`[Realtime] clearSpeechQueue: dropped ${droppedCount} queued sentence(s)`);
    }
    // Resolve when the dying source has actually emitted `onended`. The
    // existing `source.onended = playNextAudio` handler runs first (and
    // sees an empty audioQueueRef → returns to listening); we chain a
    // second listener via `addEventListener` so we don't clobber it.
    // Fail-safe timeout (60ms) so we never hang if the audio context
    // already torn down or the event was missed in some browser edge case.
    if (!stopped || !sourceBeingStopped) return Promise.resolve();
    return new Promise<void>((resolve) => {
      let resolved = false;
      const done = () => {
        if (resolved) return;
        resolved = true;
        resolve();
      };
      try {
        sourceBeingStopped.addEventListener('ended', done, { once: true });
      } catch {
        // Older browsers / non-standard nodes — fall through to the
        // timeout below as the only resolution path.
      }
      setTimeout(done, 60);
    });
  }, [isHttpTtsProvider, emitPlaybackStamp, cancelAllWsSynth]);

  // Task X3 (2026-07-16) defensive stuck-SPEAKING watchdog. The confirmed root
  // cause (a barge-in's clearSpeechQueue firing during an inter-sentence gap,
  // whose epoch-guarded resume dispatch then dropped its bytes without draining
  // to idle) is fixed directly at that dispatch. This is defense-in-depth for
  // the same OBSERVABLE strand from any other cause (a hung TTS fetch that never
  // resolves, a browser that drops a source's 'ended'): if state sits at
  // 'speaking' with a fully empty audio pipeline for longer than the window,
  // nothing will advance it, so force a clean drain. clearSpeechQueue bumps the
  // epoch (invalidating any parked fetch) and empties the queues; playNextAudio
  // then runs its empty-queue branch → 'drain' + return to listening/connected.
  // Fix-wave (X3 review, finding 4): this watchdog is scoped to the
  // 'speaking' + empty-pipeline strand ONLY. A DIFFERENT wedge variant pins
  // production state at 'processing' instead — a terminal TTS-fetch failure
  // (see `sendOneSpeakTextViaOpenAITTS`'s `!float32` branch a few hundred
  // lines up) — and is NOT covered here (`shouldFireSpeakingWatchdog` returns
  // false whenever `state !== 'speaking'`, by design). That variant is
  // already self-healing: the `!float32` branch skips the failed sentence and
  // calls `playNextAudio` itself, so no watchdog is needed for it.
  useEffect(() => {
    const id = setInterval(() => {
      const stranded =
        stateRef.current === 'speaking' &&
        !isPlayingRef.current &&
        audioQueueRef.current.length === 0;
      if (!stranded) {
        strandedSpeakingSinceRef.current = null;
        return;
      }
      const now = Date.now();
      if (strandedSpeakingSinceRef.current === null) {
        strandedSpeakingSinceRef.current = now;
        return;
      }
      const silentForMs = now - strandedSpeakingSinceRef.current;
      if (
        shouldFireSpeakingWatchdog({
          state: stateRef.current,
          isPlaying: isPlayingRef.current,
          silentForMs,
          thresholdMs: STUCK_SPEAKING_WATCHDOG_MS,
        })
      ) {
        console.warn(
          `[Realtime] stuck-SPEAKING watchdog: 'speaking' with empty audio pipeline for ${silentForMs}ms — forcing drain-to-idle`,
        );
        strandedSpeakingSinceRef.current = null;
        void clearSpeechQueue();
        playNextAudio();
      }
    }, STUCK_SPEAKING_WATCHDOG_POLL_MS);
    return () => clearInterval(id);
  }, [clearSpeechQueue, playNextAudio]);

  // Voice Perception Stage 3.1 v2 (2026-06-16): snapshot of TTS content
  // the student would have heard if not cut. Now tracked at audio-
  // playback granularity, not server-response granularity (v1 nulled
  // currentSpeakTextRef when response.done fired but the audio was
  // still playing — a 1-2 sentence response then had nothing to
  // resume).
  // Composed in playback order, deduplicated:
  //   1. currentSpeakTextRef — the sentence whose chunk is being
  //      played NOW (most recently dequeued from audioQueueRef).
  //   2. Unique sentences from the remaining audioQueueSentenceRef —
  //      future chunks waiting to play (could be more chunks for
  //      the current sentence, or chunks for sentences whose
  //      response.done has fired but whose audio is still queued).
  //   3. speakTextQueueRef — sentences not yet dispatched to Realtime.
  // Caller pattern: peek BEFORE clearSpeechQueue.
  const peekSpeechQueue = useCallback((): string[] => {
    const unique: string[] = [];
    const seen = new Set<string>();
    const push = (s: string | null | undefined): void => {
      if (!s || seen.has(s)) return;
      unique.push(s);
      seen.add(s);
    };
    push(currentSpeakTextRef.current);
    for (const s of audioQueueSentenceRef.current) push(s);
    for (const s of speakTextQueueRef.current) push(s);
    return unique;
  }, []);

  // Voice Perception Stage 3.1 (2026-06-16): re-queue an ordered array
  // of sentences via the existing speakText machinery. Each sentence
  // enters the queue and plays one at a time as the prior finishes,
  // identical to brain-orchestrator-driven playback. Used after a
  // false-positive cancel to resume queued content without paying the
  // ~3-15s latency cost of re-firing the brain call.
  const resumeSpeakText = useCallback((sentences: string[]) => {
    for (const s of sentences) {
      speakText(s);
    }
  }, [speakText]);

  // Resume-from-cut (P5): fraction (0..1) of the CURRENT sentence's audio the
  // student has actually HEARD. Read at a noise cut to decide which clause to
  // resume from (see resume-from-cut.clauseTailFromFraction). 0 when nothing is
  // playing. currentSentencePlayedSecRef is chunk-granular (the in-flight chunk
  // is counted in FULL at dequeue — on the whole-buffer TTS path, one chunk =
  // one sentence, so it alone always reads 1.0); preciseSentenceFraction
  // subtracts the in-flight chunk and adds back the real wall-clock position
  // from the caption clock (chunkStartCtxTimeRef / currentChunkDurSecRef).
  const getCurrentSentenceFraction = useCallback((): number => {
    const cur = currentSpeakTextRef.current;
    let queued = 0;
    const q = audioQueueRef.current;
    const labels = audioQueueSentenceRef.current;
    for (let i = 0; i < q.length; i++) {
      if (labels[i] === cur) queued += q[i].length / 24000;
    }
    let inFlight: number;
    try {
      // Same live playback clock as getSpokenProgress (clamped in the helper).
      inFlight = getAudioContext().currentTime - chunkStartCtxTimeRef.current;
    } catch {
      // No clock → count the in-flight chunk in full (old chunk-granular behavior).
      inFlight = currentChunkDurSecRef.current;
    }
    return preciseSentenceFraction(
      currentSentencePlayedSecRef.current,
      currentChunkDurSecRef.current,
      inFlight,
      queued,
    );
  }, []);

  // Caption word-sync: live progress of the sentence the student is hearing
  // RIGHT NOW. elapsed = completed chunks + the in-flight chunk's wall-clock
  // progress (capped at its duration). arrivedTotal additionally counts
  // queued-but-unplayed chunks of the SAME sentence — exact on the
  // openai-mini path (one chunk = one sentence), a growing lower bound on
  // the Realtime path (the consumer floors it with a char-rate estimate).
  const getSpokenProgress = useCallback((): SpokenProgress => {
    const sentence = currentSpeakTextRef.current;
    if (!sentence || !isPlayingRef.current) {
      return { sentence: null, elapsedSec: 0, arrivedTotalSec: 0, playing: false };
    }
    let inFlight = 0;
    try {
      const ctx = getAudioContext();
      inFlight = Math.max(0, Math.min(
        ctx.currentTime - chunkStartCtxTimeRef.current,
        currentChunkDurSecRef.current,
      ));
    } catch {
      inFlight = currentChunkDurSecRef.current;
    }
    const elapsedSec = playedBeforeChunkSecRef.current + inFlight;
    let queuedSec = 0;
    const q = audioQueueRef.current;
    const labels = audioQueueSentenceRef.current;
    for (let i = 0; i < q.length; i++) {
      if (labels[i] === sentence) queuedSec += q[i].length / 24000;
    }
    const remainingInChunk = currentChunkDurSecRef.current - inFlight;
    return {
      sentence,
      elapsedSec,
      arrivedTotalSec: elapsedSec + remainingInChunk + queuedSec,
      playing: true,
    };
  }, []);

  // Task 3.1 (humanlike-latency): the word clock. A rAF loop compares the
  // current sentence's playback position (same chunk-clock math as
  // getSpokenProgress) against its WS word timestamps and emits a 'word'
  // progress event each time the boundary index advances (≈ word rate,
  // 2–5/s — an advance of several words in one frame emits ONE event with
  // the latest index; it never regresses, see wordIndexAt). Sentences
  // without timestamps (HTTP path, realtime path, silent mode) simply never
  // match sentenceWordsRef and cost one Map lookup per frame while playing.
  useEffect(() => {
    if (!TUTOR_TTS_WS) return;
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!isPlayingRef.current) return;
      const sentence = currentSpeakTextRef.current;
      if (!sentence) return;
      const entry = sentenceWordsRef.current.get(sentence);
      if (!entry || entry.starts.length === 0) return;
      const clock = wordClockRef.current;
      if (clock.sentence !== sentence) {
        clock.sentence = sentence;
        clock.wordIdx = -1;
      }
      let inFlight = 0;
      try {
        const ctx = getAudioContext();
        inFlight = Math.max(0, Math.min(
          ctx.currentTime - chunkStartCtxTimeRef.current,
          currentChunkDurSecRef.current,
        ));
      } catch {
        inFlight = currentChunkDurSecRef.current;
      }
      const elapsedSec = playedBeforeChunkSecRef.current + inFlight;
      const idx = wordIndexAt(entry.starts, elapsedSec, clock.wordIdx);
      if (idx > clock.wordIdx) {
        clock.wordIdx = idx;
        if (process.env.NODE_ENV !== 'production') {
          // Dev-only: lets e2e console capture verify monotonic word progress.
          console.log(`[WordClock] s${wsSentenceStartCountRef.current} w${idx} "${entry.words[idx] ?? ''}" @${elapsedSec.toFixed(2)}s`);
        }
        onTtsPlaybackProgressRef.current?.('word', {
          // The playback-started COUNT while this sentence plays (1-based)
          // — directly comparable to render-sync's anchorM, which uses the
          // same numbering (see flushableCount's word-anchor tests).
          sentenceIdx: wsSentenceStartCountRef.current,
          wordIdx: idx,
        });
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Voice Perception Q9 (2026-06-16): enter the 'interrupted' transient
  // signal for 300ms. Restarts the window cleanly if called again before
  // the timer fires.
  const markInterrupted = useCallback(() => {
    setIsInterrupted(true);
    if (interruptedTimerRef.current) {
      clearTimeout(interruptedTimerRef.current);
    }
    interruptedTimerRef.current = setTimeout(() => {
      setIsInterrupted(false);
      interruptedTimerRef.current = null;
    }, 300);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    state,
    isConnected: state !== 'disconnected' && state !== 'connecting' && state !== 'error',
    isSpeaking: state === 'speaking',
    isInterrupted,
    markInterrupted,
    error,
    connect,
    prefetchToken,
    disconnect,
    startListening,
    stopListening,
    muteInput,
    interrupt,
    pause,
    sendTextMessage,
    injectContext,
    speakText,
    clearSpeechQueue,
    peekSpeechQueue,
    resumeSpeakText,
    getCurrentSentenceFraction,
    getSpokenProgress,
    signalBrainThinking,
    unlockAudio,
  };
}
