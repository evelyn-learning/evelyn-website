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
import { mapFunctionCallToCommand, WHITEBOARD_TOOLS, toOpenAITools } from './toolDefinitions';
import { classifyTranscript } from '@/lib/tutor/voice/transcript-filters';
import { rewriteForTTS } from '@/lib/tutor/voice/tts-pronunciation';

// OpenAI Realtime voice options
export type OpenAIVoice = 'alloy' | 'ash' | 'ballad' | 'coral' | 'echo' | 'sage' | 'shimmer' | 'verse';

export interface RealtimeUsage {
  totalTokens: number;
  inputTokens: number;
  outputTokens: number;
  inputTextTokens: number;
  inputAudioTokens: number;
  outputTextTokens: number;
  outputAudioTokens: number;
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
    onUserTranscript: (transcript: string) => void | Promise<void>;
    /** TTS engine for voicing the brain's text in relay mode.
     *  - 'realtime' (default): use Realtime's out-of-band response. Highest
     *    voice quality; expensive (full Realtime audio output billing).
     *  - 'openai-mini': use gpt-4o-mini-tts via /api/tutor/tts-openai.
     *    ~10× cheaper than Realtime audio; voice quality very close. */
    ttsProvider?: 'realtime' | 'openai-mini';
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
  error: Error | null;
  connect: () => Promise<void>;
  prefetchToken: () => Promise<string | null>;
  disconnect: () => void;
  startListening: () => void;
  stopListening: () => void;
  muteInput: () => void;
  interrupt: () => void;
  pause: () => void;
  sendTextMessage: (text: string) => void;
  injectContext: (contextText: string) => void;
  /**
   * Voice the given text through Realtime's TTS without authoring it.
   * Used in relay mode: an external brain (Claude) decided what to say,
   * Realtime just speaks it. Sends a `response.create` with explicit
   * instructions to read the text verbatim. No-op when not connected.
   */
  speakText: (text: string) => void;
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
    onTranscriptUpdate, onWhiteboardCommand, onQueryFeatures, onResponseDone, onError, onTranscriptionStatus, onStateChange,
    onStudentAudioChunk, onTutorAudioChunk, relayMode,
  } = config;
  // Effective instructions: relay-mode overrides the caller's instructions
  // so the Realtime model behaves as a transport layer, not a tutor.
  const effectiveInstructions = relayMode?.instructions ?? instructions;
  const isRelay = Boolean(relayMode);

  const [state, setState] = useState<RealtimeState>('disconnected');
  const [error, setError] = useState<Error | null>(null);

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
  const connectRef = useRef<() => Promise<void>>(async () => {});
  const scheduleReconnectRef = useRef<(() => boolean) | null>(null);
  const reconnectEnabledRef = useRef(reconnectEnabled);
  reconnectEnabledRef.current = reconnectEnabled;
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
  // Monotonic counter bumped inside clearSpeechQueue. Each TTS dispatch
  // captures the epoch at start and re-checks before pushing decoded
  // PCM into audioQueueRef. If the epoch changed during the in-flight
  // fetch (i.e., the orchestrator killed the turn), drop the push so
  // the killed sentence doesn't play despite clearSpeechQueue having
  // already fired. Without this, the kill+retry flow plays the killed
  // turn's audio AND the retry's audio back-to-back — observed
  // 2026-05-04 Linear-Functions session.
  const speakEpochRef = useRef(0);
  // Pre-fetch cache for the openai-mini path. While sentence N is
  // playing, we kick off the HTTP fetch for sentence N+1 in parallel,
  // so its PCM bytes are ready the moment N's audio ends. Without this,
  // each sentence pays a 200-400ms HTTP round-trip after the previous
  // ends, producing audible gaps between sentences. The map is keyed by
  // the sentence text; cleared when the bytes are consumed.
  const ttsPrefetchCacheRef = useRef<Map<string, Promise<Float32Array | null>>>(new Map());

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
  const ttsProviderRef = useRef<'realtime' | 'openai-mini'>(
    relayMode?.ttsProvider ?? 'realtime',
  );
  useEffect(() => {
    ttsProviderRef.current = relayMode?.ttsProvider ?? 'realtime';
  }, [relayMode?.ttsProvider]);
  const ttsAbortRef = useRef<AbortController | null>(null);

  // Update state and notify parent
  const updateState = useCallback((newState: RealtimeState) => {
    setState(newState);
    onStateChange?.(newState);
  }, [onStateChange]);

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
    } catch (err) {
      console.warn('[Realtime] unlockAudio failed:', err);
    }
  }, []);

  // Play queued audio
  const playNextAudio = useCallback(() => {
    if (audioQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      // Re-enable mic tracks when playback ends (echo-loop prevention).
      // On phone speakers, the device's hardware echo cancellation isn't
      // perfect — Whisper picks up the tutor's own voice and transcribes
      // it as student speech. Disabling tracks during playback eliminates
      // the loop. Restore here when the queue empties, unless the user
      // explicitly muted.
      if (mediaStreamRef.current && !userMutedRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => { t.enabled = true; });
      }
      // openai-mini path has no response.done event to drive the queue,
      // so drain the next sentence here when the audio finishes. The
      // realtime path leaves this branch alone — its drain runs from
      // response.done in the message handler.
      if (
        isRelayRef.current &&
        ttsProviderRef.current === 'openai-mini' &&
        speakTextQueueRef.current.length > 0
      ) {
        const next = speakTextQueueRef.current.shift()!;
        speakTextInFlightRef.current = false;
        sendOneSpeakTextViaOpenAITTSRef.current?.(next);
        return;
      }
      if (isRelayRef.current && ttsProviderRef.current === 'openai-mini') {
        speakTextInFlightRef.current = false;
      }
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
    // Disable mic tracks during playback — see comment in the
    // queue-empty branch above for the echo-loop reasoning.
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => { t.enabled = false; });
    }

    const ctx = getAudioContext();
    const chunk = audioQueueRef.current.shift()!;
    const buffer = ctx.createBuffer(1, chunk.length, 24000);
    buffer.getChannelData(0).set(chunk);

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.onended = () => {
      playNextAudio();
    };
    playbackSourceRef.current = source;
    source.start();
  }, [updateState]);

  // Queue audio for playback
  const queueAudio = useCallback((base64Audio: string) => {
    const float32 = base64ToFloat32(base64Audio);

    // Tap tutor audio for recording
    onTutorAudioChunk?.(float32);

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
            } else if (wsRef.current?.readyState === WebSocket.OPEN) {
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
            queueAudio(data.delta);
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
          if (typeof createdRespId === 'string') {
            currentResponseIdRef.current = createdRespId;
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
          body: JSON.stringify({ voice, instructions: initInstructions }),
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
      const client_secret = await tokenPromiseRef.current;
      if (!client_secret) {
        throw new Error('Invalid token response: missing client_secret');
      }
      console.log('[Realtime] Got client secret, connecting...');

      // Connect to OpenAI Realtime API (GA version)
      const ws = new WebSocket(
        `wss://api.openai.com/v1/realtime?model=gpt-realtime`,
        ['realtime', `openai-insecure-api-key.${client_secret}`]
      );

      ws.onopen = () => {
        console.log('[Realtime] WebSocket connected');

        // Fire session.update when instructions are ready. If they haven't
        // arrived yet, defer — the instructions-useEffect below will call us
        // again once they appear.
        const trySendSessionUpdate = () => {
          if (sessionUpdateSentRef.current) return;
          const inst = currentInstructionsRef.current;
          if (!inst) {
            console.log('[Realtime] WS open but instructions not ready — deferring session.update');
            return;
          }
          if (ws.readyState !== WebSocket.OPEN) return;
          console.log('[Realtime] Sending session.update (instructions length:', inst.length, ', relay:', isRelayRef.current, ')');
          sessionUpdateSentRef.current = true;
          // Relay mode: omit tools entirely. Realtime is STT+TTS only;
          // Claude (called from VoiceTutorRealtime via /api/tutor/brain)
          // is the author of every tool call.
          const toolsBlock = isRelayRef.current
            ? {}
            : { tools: toOpenAITools(WHITEBOARD_TOOLS), tool_choice: 'auto' as const };
          ws.send(JSON.stringify({
          type: 'session.update',
          session: {
            type: 'realtime',
            instructions: inst,
            ...toolsBlock,
            audio: {
              input: {
                transcription: { model: 'whisper-1' },
                turn_detection: {
                  type: 'server_vad',
                  threshold: vadThreshold,              // Higher threshold = less sensitive to quiet sounds (0-1)
                  prefix_padding_ms: vadPrefixPaddingMs, // Audio included before detected speech
                  silence_duration_ms: vadSilenceDurationMs, // Wait this long before responding
                  // Do NOT let the server auto-generate a reply on every VAD
                  // commit. We call response.create manually from the
                  // transcription-completed handler once we know the
                  // student actually said something worth responding to.
                  // Without this, the tutor fills silence with "let me
                  // re-engage" filler on every phantom turn from ambient
                  // noise (see 2026-04-23 Physics session screenshot).
                  create_response: false,
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
      };

      ws.onmessage = handleMessage;

      ws.onerror = (event) => {
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
  }, [updateState, onTranscriptionStatus]);
  scheduleReconnectRef.current = scheduleReconnect;

  // Fire the ephemeral-token fetch early so it can overlap with
  // buildInstructions (saves ~500–1500 ms on typical startup). Safe to call
  // multiple times — the promise is cached in tokenPromiseRef.
  const prefetchToken = useCallback(() => {
    if (tokenPromiseRef.current) return tokenPromiseRef.current;
    tokenPromiseRef.current = fetch('/api/tutor/realtime-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ voice }),
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
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }

    // Close WebSocket
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    // Clear audio queue
    audioQueueRef.current = [];
    isPlayingRef.current = false;
    hasAudioInBufferRef.current = false;

    // Reset parallel-connect state so the next connect() does a fresh fetch.
    tokenPromiseRef.current = null;
    sessionUpdateSentRef.current = false;
    trySendSessionUpdateRef.current = null;

    updateState('disconnected');
  }, [updateState]);

  // Start listening (microphone capture)
  const startListening = useCallback(async () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.error('[Realtime] Not connected');
      return;
    }

    // Explicitly calling startListening is intent to un-mute. Clear the
    // user-muted override so future auto-start paths can proceed.
    userMutedRef.current = false;
    // Stamp the unmute time so the transcription handler can drop
    // phantom audio captured in the first ~1.5s.
    unmuteAtRef.current = Date.now();

    // If mic is already active, re-enable tracks (may have been muted) and update state
    if (audioProcessorRef.current && mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => { track.enabled = true; });
      shouldListenRef.current = true;
      updateState('listening');
      return;
    }

    shouldListenRef.current = true;

    try {
      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      mediaStreamRef.current = stream;

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
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

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

        // Tap student audio for recording (use ref to avoid stale closure)
        onStudentAudioChunkRef.current?.(resampledData);

        const base64Audio = float32ToBase64PCM16(resampledData);

        // Q2 readyState guard (caching-initiative lever 2). onaudioprocess
        // fires ~every 85ms; during a reconnect gap wsRef.current is null
        // (ws.onclose) or a closed socket → an unguarded .send() crashes
        // the audio thread. Dropping gap audio is correct: it has no
        // valid session to land in (same as today's dead-socket
        // behavior). Also closes a latent PRE-EXISTING crash — even on
        // the frozen baseline, an onclose mid-speech hit this same
        // null.send(). hasAudioInBufferRef stays false when nothing was
        // sent (no audio in the server buffer to commit).
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          hasAudioInBufferRef.current = true;
          wsRef.current.send(JSON.stringify({
            type: 'input_audio_buffer.append',
            audio: base64Audio,
          }));
        }
      };

      source.connect(processor);
      processor.connect(ctx.destination);
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
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
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

    // Disable mic tracks without destroying them so unmute can re-enable instantly
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => { track.enabled = false; });
    }

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
    // Stop playback
    if (playbackSourceRef.current) {
      try {
        playbackSourceRef.current.stop();
      } catch {}
      playbackSourceRef.current = null;
    }
    audioQueueRef.current = [];
    isPlayingRef.current = false;

    // Cancel current response
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'response.cancel',
      }));
    }

    updateState('connected');
  }, [updateState]);

  // Pause - stop mic and audio without disconnecting WebSocket
  const pause = useCallback(() => {
    shouldListenRef.current = false;
    // Stop audio capture without committing buffer
    if (audioProcessorRef.current) {
      audioProcessorRef.current.disconnect();
      audioProcessorRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }

    // Stop playback
    if (playbackSourceRef.current) {
      try { playbackSourceRef.current.stop(); } catch {}
      playbackSourceRef.current = null;
    }
    audioQueueRef.current = [];
    isPlayingRef.current = false;

    // Cancel any in-progress response and clear uncommitted audio
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'response.cancel' }));
      wsRef.current.send(JSON.stringify({ type: 'input_audio_buffer.clear' }));
    }
    hasAudioInBufferRef.current = false;

    updateState('connected');
  }, [updateState]);

  // Send text message (for testing or fallback)
  const sendTextMessage = useCallback((text: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.error('[Realtime] Not connected');
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
        relayUserTranscriptRef.current?.(text);
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
    const rewritten = rewriteForTTS(trimmed);
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
  const fetchTTSPromise = useCallback((trimmed: string): Promise<Float32Array | null> => {
    const cache = ttsPrefetchCacheRef.current;
    const cached = cache.get(trimmed);
    if (cached) return cached;
    const promise = (async (): Promise<Float32Array | null> => {
      try {
        const res = await fetch('/api/tutor/tts-openai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: trimmed }),
        });
        if (!res.ok) {
          console.error('[Realtime] openai-mini TTS fetch failed:', res.status);
          return null;
        }
        const buf = await res.arrayBuffer();
        return new Float32Array(buf);
      } catch (err) {
        if ((err as { name?: string })?.name !== 'AbortError') {
          console.error('[Realtime] openai-mini TTS error:', err);
        }
        return null;
      }
    })();
    cache.set(trimmed, promise);
    return promise;
  }, []);

  // Alternative TTS path for relay mode: gpt-4o-mini-tts via HTTP. Returns
  // Float32 PCM at 24kHz, dropped directly into the audio playback queue.
  // Cheaper than Realtime audio output; chosen via relayMode.ttsProvider.
  const sendOneSpeakTextViaOpenAITTS = useCallback(async (trimmed: string) => {
    speakTextInFlightRef.current = true;
    updateState('processing');
    // Capture the speak epoch at dispatch time. If clearSpeechQueue runs
    // during the await below, the epoch will have changed and we must
    // NOT push these bytes into the playback queue — the sentence was
    // killed.
    const dispatchEpoch = speakEpochRef.current;
    try {
      const float32 = await fetchTTSPromise(trimmed);
      // Consume the cache entry now that we're playing it.
      ttsPrefetchCacheRef.current.delete(trimmed);
      if (dispatchEpoch !== speakEpochRef.current) {
        // Killed mid-fetch. Drop the bytes silently. Don't touch
        // speakTextInFlightRef here — clearSpeechQueue already reset
        // it, and the next legitimate dispatch will set it again.
        return;
      }
      if (!float32) {
        speakTextInFlightRef.current = false;
        return;
      }
      onTutorAudioChunk?.(float32);
      audioQueueRef.current.push(float32);
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
  }, [updateState, onTutorAudioChunk, playNextAudio, fetchTTSPromise]);
  const sendOneSpeakTextViaOpenAITTSRef = useRef(sendOneSpeakTextViaOpenAITTS);
  sendOneSpeakTextViaOpenAITTSRef.current = sendOneSpeakTextViaOpenAITTS;

  const dispatchSpeakText = useCallback((trimmed: string) => {
    if (isRelayRef.current && ttsProviderRef.current === 'openai-mini') {
      sendOneSpeakTextViaOpenAITTS(trimmed);
    } else {
      sendOneSpeakText(trimmed);
    }
  }, [sendOneSpeakText, sendOneSpeakTextViaOpenAITTS]);

  const speakText = useCallback((text: string) => {
    const usingOpenAITTS = isRelayRef.current && ttsProviderRef.current === 'openai-mini';
    if (!usingOpenAITTS && (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN)) {
      // Quietly skip when the disconnect is intentional (End tapped).
      if (!intentionallyDisconnectedRef.current) {
        console.error('[Realtime] speakText: not connected');
      }
      return;
    }
    if (!text || !text.trim()) return;
    const trimmed = text.trim();
    if (speakTextInFlightRef.current) {
      speakTextQueueRef.current.push(trimmed);
      return;
    }
    dispatchSpeakText(trimmed);
  }, [dispatchSpeakText]);

  // Stable ref so the response.done handler (long-lived closure) can
  // drain the queue without depending on speakText's identity.
  const drainSpeakTextQueueRef = useRef<() => void>(() => {});
  drainSpeakTextQueueRef.current = () => {
    speakTextInFlightRef.current = false;
    const next = speakTextQueueRef.current.shift();
    if (!next) return;
    if (isRelayRef.current && ttsProviderRef.current === 'openai-mini') {
      sendOneSpeakTextViaOpenAITTSRef.current(next);
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
    const droppedCount = speakTextQueueRef.current.length;
    speakTextQueueRef.current = [];
    // Drop any pre-fetched TTS bytes — they're for sentences we're
    // about to skip via clearSpeechQueue (validator-feedback retry).
    ttsPrefetchCacheRef.current.clear();
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
      ttsProviderRef.current === 'openai-mini' &&
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
    unlockAudio,
  };
}
