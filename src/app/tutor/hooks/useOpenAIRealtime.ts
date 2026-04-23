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
import { mapFunctionCallToCommand, WHITEBOARD_TOOLS, toOpenAITools } from './toolDefinitions';

// Tier-1 structured tools added 2026-04-22 — sourced from WHITEBOARD_TOOLS
// rather than duplicated inline to keep the two registries in sync.
const TIER1_NEW_TOOL_NAMES = new Set([
  'show_coordinate_plane', 'show_scatter_plot', 'show_cycle_diagram',
  'show_concept_map', 'show_motion_diagram', 'show_projectile_motion',
  'show_simple_machine', 'show_pendulum', 'show_spring_mass',
  'show_ray_diagram', 'show_wave', 'show_vector', 'show_orbital_diagram',
  'show_pedigree', 'show_cell_diagram', 'show_dna', 'show_food_web',
]);

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
}

export interface RealtimeConfig {
  instructions: string;
  voice?: OpenAIVoice;
  vadThreshold?: number;
  vadSilenceDurationMs?: number;
  vadPrefixPaddingMs?: number;
  onTranscriptUpdate?: (role: 'user' | 'assistant', text: string, isFinal: boolean) => void;
  // The callback may be async and may return rejection info. When it does,
  // the Realtime hook reports those drops back to the LLM as tool-call
  // failures so the model can apologize / retry instead of narrating as if
  // the whiteboard content is live.
  onWhiteboardCommand?: (
    commands: WhiteboardCommand[],
  ) => void | Promise<void | WhiteboardCommandResult>;
  onResponseDone?: (usage?: RealtimeUsage) => void;
  onError?: (error: Error) => void;
  onStateChange?: (state: RealtimeState) => void;
  onStudentAudioChunk?: (float32: Float32Array) => void;
  onTutorAudioChunk?: (float32: Float32Array) => void;
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
    vadThreshold = 0.8, vadSilenceDurationMs = 2000, vadPrefixPaddingMs = 500,
    onTranscriptUpdate, onWhiteboardCommand, onResponseDone, onError, onStateChange,
    onStudentAudioChunk, onTutorAudioChunk,
  } = config;

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
  // Ref to hold startListening so playNextAudio can call it without circular deps
  const startListeningRef = useRef<() => void>(() => {});
  // Track whether audio has been appended to the input buffer (to avoid committing empty buffers)
  const hasAudioInBufferRef = useRef(false);

  // --- Parallel-connect plumbing ---------------------------------------------
  // Goal: shave ~1–2 s off session start-up. Previously we serialized
  //   buildInstructions → POST /realtime-token → open WS → send session.update.
  // Now POST /realtime-token and open WS happen in parallel with
  // buildInstructions, and session.update is sent whenever (a) the WS is open
  // AND (b) the instructions string has arrived — whichever completes last.
  const tokenPromiseRef = useRef<Promise<string | null> | null>(null);
  const sessionUpdateSentRef = useRef(false);
  const currentInstructionsRef = useRef(instructions);
  const trySendSessionUpdateRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    currentInstructionsRef.current = instructions;
  }, [instructions]);

  // Update state and notify parent
  const updateState = useCallback((newState: RealtimeState) => {
    setState(newState);
    onStateChange?.(newState);
  }, [onStateChange]);

  // Play queued audio
  const playNextAudio = useCallback(() => {
    if (audioQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      // If mic is running, go straight back to listening
      if (audioProcessorRef.current && mediaStreamRef.current) {
        updateState('listening');
      } else if (shouldListenRef.current) {
        // Mic should be on but isn't (e.g. homework upload before mic click) — start it
        updateState('listening');
        startListeningRef.current();
      } else {
        updateState('connected');
      }
      return;
    }

    isPlayingRef.current = true;
    updateState('speaking');

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
          break;

        case 'input_audio_buffer.committed':
          console.log('[Realtime] Audio committed');
          hasAudioInBufferRef.current = false;
          break;

        case 'conversation.item.input_audio_transcription.completed':
          // User's speech transcription
          if (data.transcript) {
            console.log('[Realtime] User transcript:', JSON.stringify(data.transcript));
            lastUserInputRef.current = Date.now();
            onTranscriptUpdate?.('user', data.transcript, true);
          }
          break;

        // GA API uses response.output_audio.delta
        case 'response.output_audio.delta':
        case 'response.audio.delta':
          // Audio chunk from the model
          if (data.delta) {
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
          const timeSinceLastResponse = Date.now() - lastResponseDoneRef.current;
          const timeSinceUserInput = Date.now() - lastUserInputRef.current;
          const noUserInputSinceLastResponse =
            lastResponseDoneRef.current > 0 &&
            timeSinceLastResponse < 3000 &&
            timeSinceUserInput > timeSinceLastResponse;

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
            } else if (shouldListenRef.current) {
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

                if (funcName === 'show_svg_diagram') {
                  // Match SVG tag — it may contain escaped quotes from JSON context
                  const svgMatch = rawArgsStr.match(/<svg[\s\S]*?<\/svg>/);
                  const titleMatch = rawArgsStr.match(/"title"\s*:\s*"((?:[^"\\]|\\.)*)"/);
                  const descMatch = rawArgsStr.match(/"description"\s*:\s*"((?:[^"\\]|\\.)*)"/);
                  if (svgMatch) {
                    // Unescape JSON escapes so SVG attributes have real quotes
                    funcArgs = {
                      svg: unescapeJsonString(svgMatch[0]),
                      title: titleMatch ? unescapeJsonString(titleMatch[1]) : 'Diagram',
                      description: descMatch ? unescapeJsonString(descMatch[1]) : '',
                    };
                    parsed = true;
                  }
                } else if (funcName === 'show_equation') {
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
            if (command) {
              try {
                const result = await onWhiteboardCommand?.([command]);
                if (result && typeof result === 'object' && Array.isArray(result.rejected) && result.rejected.length > 0) {
                  rejectionReason = result.rejected.map(r => `${r.action}: ${r.reason}`).join('; ');
                  console.warn('[Realtime] Tool call was rejected by handler:', rejectionReason);
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

            // Send function call result back to continue the conversation
            if (wsRef.current?.readyState === WebSocket.OPEN) {
              wsRef.current.send(JSON.stringify({
                type: 'conversation.item.create',
                item: {
                  type: 'function_call_output',
                  call_id: data.item.call_id,
                  output: JSON.stringify(rejectionReason
                    ? {
                        success: false,
                        message: `The ${funcName} call did not render. Reason: ${rejectionReason}. Do NOT tell the student the item is on the whiteboard. Apologize briefly and address the underlying issue (ask the student what they need, or retry with a full statement).`,
                      }
                    : { success: true, message: `Displayed ${funcName.replace('show_', '')} on whiteboard` }
                  ),
                },
              }));
              // Only trigger continuation if we haven't hit the consecutive
              // rejection cap. Beyond the cap, stay silent and wait for the
              // student to speak — otherwise the LLM keeps cycling tool
              // retries with no new information.
              if (consecutiveRejectionsRef.current <= MAX_CONSECUTIVE_REJECTIONS) {
                wsRef.current.send(JSON.stringify({
                  type: 'response.create',
                }));
              } else {
                console.warn(
                  '[Realtime] Consecutive tool-call rejections hit cap',
                  consecutiveRejectionsRef.current,
                  '— not triggering continuation. Waiting for student input.'
                );
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
  }, [updateState, onTranscriptUpdate, onWhiteboardCommand, onResponseDone, onError, queueAudio]);

  // Connect to OpenAI Realtime API
  const connect = useCallback(async () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('[Realtime] Already connected');
      return;
    }

    updateState('connecting');
    setError(null);

    try {
      // Reuse a pre-fetched token if one is already in flight (see
      // prefetchToken below — fired on mount from the UI layer so the network
      // round-trip overlaps with buildInstructions).
      if (!tokenPromiseRef.current) {
        tokenPromiseRef.current = fetch('/api/tutor/realtime-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ voice }),
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
          console.log('[Realtime] Sending session.update (instructions length:', inst.length, ')');
          sessionUpdateSentRef.current = true;
          ws.send(JSON.stringify({
          type: 'session.update',
          session: {
            type: 'realtime',
            instructions: inst,
            tools: [
              {
                type: 'function',
                name: 'show_equation',
                description: 'Display an equation on the whiteboard using LaTeX (rendered with KaTeX). You MUST call this whenever you mention ANY equation, formula, or mathematical relationship in your speech. Always show equations visually — never just say them without also displaying them.\n\nLATEX FORMATTING:\n• Plain math renders fine: "x^2 + 2x - 3 = 0", "\\frac{a}{b}", "\\int_0^\\pi x \\sin(x)\\, dx".\n• For ENGLISH WORDS mixed with math, you MUST wrap the words in \\text{...}. Math mode treats consecutive letters as multiplied variables, so "Expression with 2^x" renders as the concatenated letters "Expressionwith2^x".\n  Correct: "\\text{Expression with } 2^x" or "\\text{Area} = \\pi r^2"\n  Wrong: "Expression with 2^x" or "Area = pi r^2"\n• Table cells passed to show_table are rendered as MATH too — use \\text{} for prose cells there as well.',
                parameters: {
                  type: 'object',
                  properties: {
                    latex: { type: 'string', description: 'The equation in LaTeX format' },
                    label: { type: 'string', description: 'A label for the equation' },
                  },
                  required: ['latex'],
                },
              },
              {
                type: 'function',
                name: 'show_function_graph',
                description: 'Plot mathematical functions on the whiteboard using Desmos. Use this INSTEAD of show_svg_diagram for graphs. Supports: equations (y=f(x), x=f(y)), implicit equations (x²+y²=1), inequalities, labeled points, and shaded regions. Function expressions use LaTeX math notation: use ^ for exponents, \\frac{a}{b} for fractions, \\sqrt{x} for square root, \\sin, \\cos, \\tan, \\pi, e. You can also provide implicit equations like "x^2/4 + y^2 = 1" directly. For y=f(x) curves, use "functions". For x=f(y) curves, use "functionsOfY". For vertical lines x=c, use functionsOfY with expr "c". For horizontal lines y=c, use functions with expr "c". ALWAYS provide a label for each function.',
                parameters: {
                  type: 'object',
                  properties: {
                    title: { type: 'string', description: 'Title for the graph' },
                    xLabel: { type: 'string', description: 'X-axis label (default: "x")' },
                    yLabel: { type: 'string', description: 'Y-axis label (default: "y")' },
                    xRange: { type: 'array', items: { type: 'number' }, description: 'Visible x-axis range as [min, max], e.g. [-5, 10]' },
                    yRange: { type: 'array', items: { type: 'number' }, description: 'Visible y-axis range as [min, max], e.g. [-5, 5]' },
                    functions: {
                      type: 'array',
                      description: 'y=f(x) functions or implicit equations to plot.',
                      items: {
                        type: 'object',
                        properties: {
                          expr: { type: 'string', description: 'LaTeX expression, e.g. "x^2", "\\sin(x)", "\\frac{x^2}{4} + y^2 = 1". Can be an equation or just a function of x.' },
                          color: { type: 'string', description: 'Color hex, e.g. "#dc2626"' },
                          label: { type: 'string', description: 'Legend label, e.g. "y = x²". ALWAYS provide a readable label.' },
                          domain: { type: 'array', items: { type: 'number' }, description: 'Optional x-domain restriction [min, max]' },
                        },
                        required: ['expr', 'label'],
                      },
                    },
                    functionsOfY: {
                      type: 'array',
                      description: 'x=f(y) functions to plot (curves where x depends on y, or vertical lines).',
                      items: {
                        type: 'object',
                        properties: {
                          expr: { type: 'string', description: 'LaTeX expression using y, e.g. "y^3", "3y - 2", or a constant like "-1" for vertical line x=-1' },
                          color: { type: 'string', description: 'Color hex' },
                          label: { type: 'string', description: 'Legend label. ALWAYS provide a readable label.' },
                          domain: { type: 'array', items: { type: 'number' }, description: 'Optional y-domain restriction [min, max]' },
                        },
                        required: ['expr', 'label'],
                      },
                    },
                    points: {
                      type: 'array',
                      description: 'Labeled points to mark on the graph',
                      items: {
                        type: 'object',
                        properties: {
                          x: { type: 'number' },
                          y: { type: 'number' },
                          label: { type: 'string', description: 'e.g. "(1, 1)"' },
                          color: { type: 'string' },
                        },
                        required: ['x', 'y'],
                      },
                    },
                    shadedRegion: {
                      type: 'object',
                      description: 'Shade the area between two curves. For integrating over y (horizontal slices), set axis="y" and provide two x=f(y) expressions. For integrating over x (vertical slices), set axis="x" and provide two y=f(x) expressions.',
                      properties: {
                        axis: { type: 'string', enum: ['x', 'y'], description: '"x" for vertical slices (between y=f(x) curves), "y" for horizontal slices (between x=f(y) curves)' },
                        between: { type: 'array', items: { type: 'string' }, description: 'Two function expressions. For axis="y": two x=f(y) expressions. For axis="x": two y=f(x) expressions.' },
                        from: { type: 'number', description: 'Lower integration bound' },
                        to: { type: 'number', description: 'Upper integration bound' },
                        color: { type: 'string', description: 'Shade color (default: green)' },
                        opacity: { type: 'number', description: 'Fill opacity 0-1 (default: 0.3)' },
                      },
                      required: ['axis', 'between', 'from', 'to'],
                    },
                  },
                  required: ['title'],
                },
              },
              {
                type: 'function',
                name: 'new_page',
                description: 'Start a new whiteboard page. Use this BEFORE showing content for a new concept or topic. Related items (e.g., an equation and its graph, a problem and its solution) should stay on the same page — only call new_page when transitioning to a genuinely different topic.',
                parameters: {
                  type: 'object',
                  properties: {
                    title: { type: 'string', description: 'Short title for this page (e.g., "Velocity Equation", "Free Body Diagram"). Used for navigation.' },
                  },
                  required: ['title'],
                },
              },
              {
                type: 'function',
                name: 'go_to_page',
                description: 'Navigate the whiteboard back (or forward) to a previously created page by its title. Use this when referring back to an earlier concept, equation, or diagram you already showed.',
                parameters: {
                  type: 'object',
                  properties: {
                    title: { type: 'string', description: 'The title of the page to navigate to (must match a previously used new_page title)' },
                  },
                  required: ['title'],
                },
              },
              {
                type: 'function',
                name: 'show_code',
                description: 'Display a code snippet on the whiteboard. You MUST call this whenever you discuss, explain, or reference any programming code. Always show code visually — never just describe code verbally without also displaying it.\n\nWhen the snippet is a JavaScript/TypeScript solution the student should verify, include optional `testCases` and `entryName`: the system will auto-run the code in a sandbox and post pass/fail results back to you so you can tell the student which tests their solution passes. The entry function must return the computed result.',
                parameters: {
                  type: 'object',
                  properties: {
                    code: { type: 'string', description: 'The code to display. Use \\n for newlines and spaces for indentation.' },
                    language: { type: 'string', description: 'Programming language (e.g., java, python, ruby, javascript, c, cpp)' },
                    label: { type: 'string', description: 'A short label/title for the code snippet' },
                    entryName: { type: 'string', description: 'Name of the function to run the test cases against (default: "solve"). Only used when language is javascript/typescript.' },
                    testCases: {
                      type: 'array',
                      description: 'Optional list of input/expected pairs to verify the solution. Only runs for JavaScript/TypeScript code.',
                      items: {
                        type: 'object',
                        properties: {
                          name: { type: 'string', description: 'Short test name, e.g. "empty list" or "negative input".' },
                          input: { type: 'string', description: 'JSON-encoded array of positional args, e.g. "[1, 2]" or "[[3,4,5]]".' },
                          expected: { type: 'string', description: 'JSON-encoded expected return value, e.g. "3", "true", "[1,2]".' },
                        },
                      },
                    },
                  },
                  required: ['code', 'language'],
                },
              },
              {
                type: 'function',
                name: 'show_table',
                description: 'Display a table on the whiteboard. Use for showing data, comparison tables, truth tables, or any tabular information.',
                parameters: {
                  type: 'object',
                  properties: {
                    headers: { type: 'array', items: { type: 'string' }, description: 'Column headers' },
                    rows: { type: 'array', items: { type: 'array', items: { type: 'string' } }, description: 'Table rows, each row is an array of cell values' },
                  },
                  required: ['headers', 'rows'],
                },
              },
              {
                type: 'function',
                name: 'show_svg_diagram',
                description: 'Display a physics or biology diagram on the whiteboard using SVG. Use for physical setups (pipes, ramps, pulleys, circuits) OR biology diagrams (pedigrees, cells, organs). NOT for math function graphs.\n\nLAYOUT ZONES (viewBox 0 0 400 300): Title zone y=10-30, Shape zone y=60-200, Label zone y=210-290. ALL shapes must fit within x=30-370 and y=60-200.\n\nLABEL RULES:\n• NEVER place text on top of colored shapes.\n• For SINGLE-FOCUS diagrams (one pipe, one ramp), all labels can go in the label zone below.\n• For MULTI-SHAPE DIAGRAMS where each shape has its OWN label (pedigrees, where each person needs "Unaffected" / "Carrier" / "Affected"), put each label DIRECTLY UNDERNEATH its shape, centered on the shape\'s x-coordinate, at shape_y + shape_height + 18. Never put 3+ disparate labels in a single row below a diagram — the student cannot tell which label belongs to which shape.\n\nPEDIGREE CONVENTIONS: squares = male, circles = female, filled = affected, unfilled = unaffected, half-filled = carrier. Mother-father are connected by a horizontal line; children hang below via a vertical line.',
                parameters: {
                  type: 'object',
                  properties: {
                    title: { type: 'string', description: 'Title for the visual' },
                    description: { type: 'string', description: 'Brief description of what the visual shows' },
                    svg: { type: 'string', description: 'SVG markup. Start with <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">. STRICT LAYOUT (nothing outside 0-400 x 0-300): ZONE 1 Title y=20-30. ZONE 2 Shapes y=50-160. ZONE 3 Arrow y=175 (flow direction arrow ONLY, no text on this line). ZONE 4 Labels y=200-290 (text-anchor=middle, font-size 13). Shapes must stay within x=40-330. For PIPE/HOSE: wide rect x=40 y=55 width=160 height=95, narrow rect x=200 y=80 width=130 height=45. Flow arrow: <line x1="40" y1="175" x2="330" y2="175" stroke="#dc2626" stroke-width="3"/> + arrowhead polygon. Labels in ZONE 4 ONLY — row 1 at y=205 (e.g. left radius x=120, right radius x=265), row 2 at y=230 (flow rate x=200), row 3 at y=255 if needed. NEVER place text on or near arrows or shapes. Colors: #2563eb blue shapes, #dc2626 red arrows, #16a34a green. No newlines in SVG.' },
                  },
                  required: ['svg', 'title'],
                },
              },
              // ── New structured math diagram tools ──
              {
                type: 'function',
                name: 'show_number_line',
                description: 'Display a number line with points, intervals, and hops. Use for: inequalities, fractions on a line, integer operations, domain/range, solution sets. ALWAYS use this instead of show_svg_diagram when you need a number line.',
                parameters: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    min: { type: 'number', description: 'Left bound of the number line' },
                    max: { type: 'number', description: 'Right bound of the number line' },
                    step: { type: 'number', description: 'Tick mark interval (auto if omitted)' },
                    points: { type: 'array', items: { type: 'object', properties: { value: { type: 'number' }, label: { type: 'string' }, color: { type: 'string' }, style: { type: 'string', enum: ['filled', 'open'] } }, required: ['value'] } },
                    intervals: { type: 'array', items: { type: 'object', properties: { from: { type: 'number' }, to: { type: 'number' }, fromInclusive: { type: 'boolean' }, toInclusive: { type: 'boolean' }, color: { type: 'string' }, label: { type: 'string' } }, required: ['from', 'to'] } },
                    segments: { type: 'array', items: { type: 'object', properties: { from: { type: 'number' }, to: { type: 'number' }, label: { type: 'string' }, color: { type: 'string' }, arc: { type: 'boolean' } }, required: ['from', 'to'] } },
                    fractionTicks: { type: 'object', properties: { denominator: { type: 'number' }, showLabels: { type: 'boolean' } } },
                  },
                  required: ['min', 'max'],
                },
              },
              {
                type: 'function',
                name: 'show_geometry',
                description: 'Display geometric figures with labeled vertices, segments, polygons, circles, and angle markers. Use for: triangles, quadrilaterals, circle theorems, transformations, proofs, constructions. ALWAYS use this instead of show_svg_diagram for geometric figures.\n\nLABELING:\n- Point `label`: if the prompt gives explicit coordinates (e.g. "A=(0,0)"), include them in the label: `label: "A(0, 0)"`. Otherwise just the letter: `label: "A"`.\n- Segment `label`: use "AB" or the length "6" if known. Never blank when labeling sides was requested.\n- Angle `label`: prefer the measure ("53°", "90°"). OMIT `label` to let the renderer auto-compute the measure from geometry — do NOT set it to just "∠".',
                parameters: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    points: { type: 'array', description: 'Named points with coordinates', items: { type: 'object', properties: { id: { type: 'string' }, x: { type: 'number' }, y: { type: 'number' }, label: { type: 'string' }, color: { type: 'string' } }, required: ['id', 'x', 'y'] } },
                    segments: { type: 'array', items: { type: 'object', properties: { from: { type: 'string' }, to: { type: 'string' }, style: { type: 'string', enum: ['solid', 'dashed', 'dotted'] }, color: { type: 'string' }, label: { type: 'string' }, tickMarks: { type: 'number' } }, required: ['from', 'to'] } },
                    polygons: { type: 'array', items: { type: 'object', properties: { vertices: { type: 'array', items: { type: 'string' } }, fill: { type: 'string' }, stroke: { type: 'string' }, label: { type: 'string' } }, required: ['vertices'] } },
                    circles: { type: 'array', items: { type: 'object', properties: { center: { type: 'string' }, radius: { type: 'number' }, style: { type: 'string', enum: ['solid', 'dashed'] }, color: { type: 'string' } }, required: ['center', 'radius'] } },
                    angles: { type: 'array', items: { type: 'object', properties: { vertex: { type: 'string' }, from: { type: 'string' }, to: { type: 'string' }, label: { type: 'string' }, style: { type: 'string', enum: ['arc', 'square'] }, color: { type: 'string' } }, required: ['vertex', 'from', 'to'] } },
                    showGrid: { type: 'boolean' },
                    showAxes: { type: 'boolean' },
                  },
                  required: ['points'],
                },
              },
              {
                type: 'function',
                name: 'show_unit_circle',
                description: 'Display the unit circle with angle markers, reference triangles, and trig coordinates. The renderer computes all positions using exact trigonometry. Use for: trig functions, radian/degree conversion, reference angles, trig identities. ALWAYS use this instead of show_svg_diagram for unit circle diagrams.',
                parameters: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    highlightAngles: { type: 'array', description: 'Angles to highlight on the circle', items: { type: 'object', properties: { angle: { type: 'number', description: 'Angle in degrees' }, color: { type: 'string' }, showTriangle: { type: 'boolean', description: 'Draw reference triangle to x-axis' }, showCoords: { type: 'boolean', description: 'Show (cos,sin) coordinates' }, label: { type: 'string', description: 'Custom label like pi/6' } }, required: ['angle'] } },
                    showAllStandard: { type: 'boolean', description: 'Show all 16 standard angles (0,30,45,60,...,330) with exact coordinates' },
                    showRadians: { type: 'boolean' },
                    showDegrees: { type: 'boolean' },
                    showArc: { type: 'object', properties: { from: { type: 'number' }, to: { type: 'number' }, color: { type: 'string' }, label: { type: 'string' } } },
                  },
                  required: [],
                },
              },
              {
                type: 'function',
                name: 'show_fraction_bar',
                description: 'Display fraction visualizations as bars, pie charts, or area grids. Use for: teaching fractions, equivalent fractions, comparing fractions, ratios, percentages.',
                parameters: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    items: { type: 'array', items: { type: 'object', properties: { numerator: { type: 'number' }, denominator: { type: 'number' }, label: { type: 'string' }, highlightColor: { type: 'string' }, style: { type: 'string', enum: ['bar', 'circle', 'grid'] } }, required: ['numerator', 'denominator'] } },
                    layout: { type: 'string', enum: ['vertical', 'horizontal'] },
                    showComparison: { type: 'boolean' },
                  },
                  required: ['items'],
                },
              },
              {
                type: 'function',
                name: 'show_tree',
                description: 'Display a tree diagram with auto-layout. Use for: probability trees, factor trees, decision trees, counting principles.\n\nSCHEMA — a child is an EDGE wrapper `{ label, probability?, node }`, NOT a bare node. The nested subtree goes under `node`. Example for a coin flip: children: [ { label: "H", probability: "1/2", node: { label: "H" } }, { label: "T", probability: "1/2", node: { label: "T" } } ]. NEVER send children: [{ label: "H" }] without the `node` wrapper.\n\nFOR PROBABILITY TREES: set type: "probability", showLeafProbabilities: true. Every edge has a `probability` string like "1/2" or "0.5"; leaf labels describe the outcome (e.g. "HHH").',
                parameters: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    type: { type: 'string', enum: ['probability', 'factor', 'decision', 'generic'] },
                    root: { type: 'object', description: 'Recursive tree node: { label, value?, color?, children?: [{ label, probability?, node: TreeNode }] }. A child is an EDGE wrapper, not a bare node.' },
                    showLeafProbabilities: { type: 'boolean' },
                    direction: { type: 'string', enum: ['top-down', 'left-right'] },
                  },
                  required: ['root'],
                },
              },
              {
                type: 'function',
                name: 'show_venn_diagram',
                description: 'Display a 2- or 3-set Venn diagram. Each call REPLACES the diagram — when the student gives counts after an empty diagram, IMMEDIATELY call this again with `regions` populated; do not stall by asking "which region first?".\n\nREGION KEYS (use exactly): 2-set → onlyA|onlyB|intersection|neither. 3-set → onlyA|onlyB|onlyC|AB|AC|BC|ABC|neither. AB means "in A and B but NOT in C" (lens minus center). ABC is the all-three center.\n\nIf the student gives CUMULATIVE counts (|M|=100 includes overlaps), compute exclusive region counts: ABC=triple; AB=|A∩B|−ABC; onlyA=|A|−AB−AC−ABC; etc. If the student gives EXCLUSIVE counts already, assign directly.\n\nExample: regions = { onlyA: {value:"100"}, onlyB: {value:"200"}, onlyC: {value:"300"}, AB: {value:"75"}, AC: {value:"55"}, BC: {value:"65"}, ABC: {value:"10"} }.',
                parameters: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    sets: { type: 'array', description: '2 or 3 sets', items: { type: 'object', properties: { label: { type: 'string' }, color: { type: 'string' } }, required: ['label'] } },
                    regions: { type: 'object', description: 'Region keys: onlyA, onlyB, intersection, neither (2 sets) or onlyA, onlyB, onlyC, AB, AC, BC, ABC, neither (3 sets). Each value: { value?, highlight?, items? }' },
                    universalLabel: { type: 'string' },
                  },
                  required: ['sets', 'regions'],
                },
              },
              {
                type: 'function',
                name: 'show_matrix',
                description: 'Display a matrix with brackets, augmented lines, and row operations. Use for: systems of equations, matrix operations, row reduction, determinants.',
                parameters: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    rows: { type: 'array', description: 'Matrix rows, each an array of string cell values', items: { type: 'array', items: { type: 'string' } } },
                    brackets: { type: 'string', enum: ['square', 'round', 'pipes', 'double-pipes'] },
                    augmented: { type: 'number', description: 'Column index for augmented line' },
                    rowLabels: { type: 'array', items: { type: 'string' } },
                    colLabels: { type: 'array', items: { type: 'string' } },
                    rowOperations: { type: 'array', items: { type: 'object', properties: { description: { type: 'string' }, targetRow: { type: 'number' } } } },
                    resultMatrix: { type: 'object', properties: { rows: { type: 'array', items: { type: 'array', items: { type: 'string' } } }, brackets: { type: 'string' } } },
                    operatorSymbol: { type: 'string' },
                  },
                  required: ['rows'],
                },
              },
              {
                type: 'function',
                name: 'show_stats',
                description: 'Display statistical charts: histogram, box plot, dot plot, bar chart, or pie chart. Use for: data analysis, distributions, comparing datasets.',
                parameters: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    type: { type: 'string', enum: ['histogram', 'boxplot', 'dotplot', 'bar', 'pie'] },
                    data: { type: 'array', description: 'Raw data values (for histogram/dotplot)', items: { type: 'number' } },
                    binWidth: { type: 'number' },
                    xLabel: { type: 'string' },
                    yLabel: { type: 'string' },
                    boxplot: { type: 'object', properties: { datasets: { type: 'array', items: { type: 'object', properties: { label: { type: 'string' }, min: { type: 'number' }, q1: { type: 'number' }, median: { type: 'number' }, q3: { type: 'number' }, max: { type: 'number' }, outliers: { type: 'array', items: { type: 'number' } }, color: { type: 'string' } }, required: ['label', 'min', 'q1', 'median', 'q3', 'max'] } }, showValues: { type: 'boolean' } } },
                    bar: { type: 'object', properties: { categories: { type: 'array', items: { type: 'string' } }, values: { type: 'array', items: { type: 'number' } }, colors: { type: 'array', items: { type: 'string' } } } },
                    pie: { type: 'object', properties: { slices: { type: 'array', items: { type: 'object', properties: { label: { type: 'string' }, value: { type: 'number' }, color: { type: 'string' } }, required: ['label', 'value'] } }, showPercentages: { type: 'boolean' } } },
                  },
                  required: ['type'],
                },
              },
              {
                type: 'function',
                name: 'show_problem',
                description: 'Display a complete problem as a formatted card on the whiteboard. Use whenever the student asks for a practice problem, quiz question, or says "give me a problem", "quiz me", "I want to practice", or similar.\n\nREQUIRED FIELDS — THE CALL WILL BE REJECTED IF YOU OMIT EITHER:\n• statement: the full problem text, written out as ONE complete string. Never empty. Never a placeholder.\n• format: one of "multiple-choice" | "grid-in" | "free-response" | "short-answer" | "true-false".\n\nFORMATTING — THE STATEMENT SUPPORTS INLINE LATEX:\nWrite math in LaTeX using single-dollar delimiters `$...$`. Do NOT spell math out in English prose on the statement card — the student needs to SEE the equation, not read the words "2 raised to the power of x plus 1".\n• Correct: "Solve for $x$: $2^{x+1} - 3 \\cdot 2^{x+2} = 0$"\n• Wrong: "Solve for x: 2 raised to the power of x plus 1 minus 3 times 2 raised to the x plus 2 equals 0"\n• Correct: "Find the area enclosed by $y = x^2$ and $y = 4x - x^2$"\n• Wrong: "Find the area enclosed by y equals x squared and y equals 4x minus x squared"\n\nCORRECT EXAMPLE (copy this shape):\n{"statement":"Find the area of the region enclosed by the curves $y = x^2$ and $y = 4x - x^2$.","format":"free-response","title":"AP Calculus AB – Area Between Curves","source":"AP Calculus AB FRQ","difficulty":"medium"}\n\nMatch the format to the test the student is prepping for (SAT/ACT/AP: A–D choices; JEE: 4 choices; GRE Quant: 5 choices). After the call, narrate briefly: "Here is a problem for you — take a look and tell me when you are ready." Do not start teaching until the student has read it.',
                parameters: {
                  type: 'object',
                  properties: {
                    statement: { type: 'string', description: 'REQUIRED. Full problem text as one complete string. Never empty.' },
                    format: { type: 'string', enum: ['multiple-choice', 'grid-in', 'free-response', 'short-answer', 'true-false'], description: 'Presentation format. Required.' },
                    answerChoices: {
                      type: 'array',
                      description: 'REQUIRED when format is "multiple-choice". Use the letter convention of the actual test.',
                      items: { type: 'object', properties: { letter: { type: 'string' }, text: { type: 'string' } }, required: ['letter', 'text'] },
                    },
                    title: { type: 'string', description: 'Short header, e.g. "SAT No-Calc Problem"' },
                    source: { type: 'string', description: 'Test/exam + section tag, e.g. "AP Calculus AB FRQ"' },
                    difficulty: { type: 'string', enum: ['easy', 'medium', 'hard'] },
                    givens: {
                      type: 'array',
                      items: { type: 'object', properties: { symbol: { type: 'string' }, value: { type: 'string' }, unit: { type: 'string' } }, required: ['symbol', 'value'] },
                    },
                  },
                  required: ['statement', 'format'],
                },
              },
              {
                type: 'function',
                name: 'show_punnett',
                description: 'Display a Punnett-square cross on the whiteboard. Pass both parent genotypes as allele-pair strings (monohybrid "Pp", dihybrid "RrYy"). The renderer derives the correct gamete headers and offspring cells — do NOT use show_table for genetics crosses or the axis labels can collapse. Use for any monohybrid, dihybrid, test cross, incomplete-dominance, or codominance example.',
                parameters: {
                  type: 'object',
                  properties: {
                    parent1: { type: 'string', description: 'Parent 1 genotype, e.g. "Pp", "RrYy", "I-A I-O".' },
                    parent2: { type: 'string', description: 'Parent 2 genotype, e.g. "pp", "rrYy".' },
                    title: { type: 'string', description: 'Optional title, e.g. "Monohybrid Cross — Pea Height".' },
                    trait: { type: 'string', description: 'Optional trait name for context (e.g. "Pea height", "Flower color").' },
                    showPhenotypeRatio: { type: 'boolean', description: 'Default true — render the phenotype ratio summary below the grid.' },
                  },
                  required: ['parent1', 'parent2'],
                },
              },
              {
                type: 'function',
                name: 'show_molecule',
                description: 'Display a molecular structure on the whiteboard using an interactive chemistry editor. The editor renders a proper 2D structural formula from the SMILES notation with correct bond angles and atom positions. Students can modify the structure. Use for: organic molecules, functional groups, chemical structures, reactions.',
                parameters: {
                  type: 'object',
                  properties: {
                    smiles: { type: 'string', description: 'SMILES notation (e.g., "CCO" for ethanol, "c1ccccc1" for benzene, "CC(=O)O" for acetic acid)' },
                    title: { type: 'string', description: 'Title/name of the molecule' },
                    description: { type: 'string', description: 'What to notice about this structure' },
                    interactive: { type: 'boolean', description: 'Allow student to edit the structure' },
                  },
                  required: ['smiles', 'title'],
                },
              },
              {
                type: 'function',
                name: 'show_collision',
                description: 'Display a before/after collision diagram. ALWAYS use this instead of show_svg_diagram when teaching conservation of momentum, elastic / inelastic / perfectly-inelastic collisions. Bodies render as filled circles sized by mass with velocity arrows scaled by speed. For type "perfectly-inelastic", the after-panel auto-merges bodies into one blob.\n\nCONSERVATION — CRITICAL:\n• You MUST verify Σm·v (total momentum) is the same before and after BEFORE calling this tool. The renderer flags mismatches with a red warning, which embarrasses you.\n• For ELASTIC collisions (type="elastic") you additionally MUST verify Σ½m·v² (total KE) is equal before and after.\n• Use the 1D elastic formulas — v1\' = ((m1−m2)/(m1+m2))·v1 + (2·m2/(m1+m2))·v2; v2\' = (2·m1/(m1+m2))·v1 + ((m2−m1)/(m1+m2))·v2. Plug in and verify arithmetic.\n• Example check for 2 kg @ 5 m/s into 3 kg @ 1 m/s elastic: v1\' = (−1/5)·5 + (6/5)·1 = 0.2 m/s; v2\' = (4/5)·5 + (1/5)·1 = 4.2 m/s. Verify: 2·0.2 + 3·4.2 = 13 ✓ (initial: 2·5+3·1 = 13 ✓). DO NOT guess; compute.\n\nEXAMPLE (1D elastic, stationary target):\n{"title":"Elastic collision","type":"elastic","before":[{"label":"A","mass":2,"velocity":5},{"label":"B","mass":3,"velocity":0}],"after":[{"label":"A","mass":2,"velocity":-1},{"label":"B","mass":3,"velocity":4}],"momentumAnnotation":"p = Σmv = 10 kg·m/s (conserved)"}',
                parameters: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    dimension: { type: 'string', enum: ['1D', '2D'] },
                    type: { type: 'string', enum: ['elastic', 'inelastic', 'perfectly-inelastic'] },
                    before: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          label: { type: 'string' },
                          mass: { type: 'number' },
                          velocity: { type: 'number', description: '1D signed velocity (positive = right).' },
                          vx: { type: 'number' },
                          vy: { type: 'number', description: '2D y-velocity (positive = up).' },
                          color: { type: 'string' },
                        },
                      },
                    },
                    after: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          label: { type: 'string' },
                          mass: { type: 'number' },
                          velocity: { type: 'number' },
                          vx: { type: 'number' },
                          vy: { type: 'number' },
                          color: { type: 'string' },
                        },
                      },
                    },
                    momentumAnnotation: { type: 'string' },
                    notes: { type: 'string' },
                  },
                  required: ['before', 'after'],
                },
              },
              {
                type: 'function',
                name: 'show_reaction_coordinate',
                description: 'Display a chemistry reaction coordinate (energy profile) diagram: horizontal reactants baseline on the left, horizontal products baseline on the right, and one or more smooth bezier humps between them showing the activation-energy barrier. ALWAYS use this instead of show_function_graph for activation-energy / reaction-coordinate / energy-profile prompts — this renderer auto-handles the negative y-axis for exothermic reactions, auto-labels ΔH and Ea, and supports multi-curve catalyst comparisons in one diagram.\n\nEXAMPLE (exothermic reaction with catalyst comparison):\n{"title":"Reaction coordinate","reactants_energy":0,"products_energy":-120,"activation_energies":[50,30],"curve_labels":["Without catalyst","With catalyst"]}\n\nEXAMPLE (endothermic, single curve):\n{"title":"Endothermic reaction","reactants_energy":0,"products_energy":40,"activation_energies":[75]}\n\nKEY POINTS:\n• Reactants energy usually 0 (reference level). Products energy is NEGATIVE for exothermic, POSITIVE for endothermic.\n• `activation_energies` is a list — one per curve. Use [Ea] for single curve; use [Ea_no_cat, Ea_with_cat] to draw both barriers in one diagram, automatically colored.\n• Catalysts LOWER activation energy but do NOT change ΔH (products_energy stays the same).\n• Units default to "kJ/mol". Override with `units` field if needed.',
                parameters: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    reactants_energy: { type: 'number', description: 'Energy of reactants (reference level). Usually 0.' },
                    products_energy: { type: 'number', description: 'Energy of products. Negative for exothermic.' },
                    activation_energies: {
                      type: 'array',
                      items: { type: 'number' },
                      description: 'One activation energy per curve (e.g. [50] for single, [50, 30] for without/with catalyst).',
                    },
                    curve_labels: {
                      type: 'array',
                      items: { type: 'string' },
                      description: 'Optional label per curve for the legend.',
                    },
                    reactant_label: { type: 'string', description: 'Default "Reactants".' },
                    product_label: { type: 'string', description: 'Default "Products".' },
                    units: { type: 'string', description: 'Default "kJ/mol".' },
                  },
                  required: ['products_energy', 'activation_energies'],
                },
              },
              {
                type: 'function',
                name: 'show_energy_bars',
                description: 'Display a conservation-of-energy bar chart showing KE, gravitational PE, spring PE, and thermal (friction-loss) at multiple labeled positions. ALWAYS use this instead of show_svg_diagram for conservation-of-energy visualization, spring-loaded problems, roller-coaster / pendulum energy transforms, or friction dissipation. Each position is a stacked column; when totals match, a dashed "total energy (conserved)" line is drawn automatically.\n\nEXAMPLE (ball dropped from rest):\n{"title":"Ball dropped","positions":[{"label":"Top","pe":100,"ke":0},{"label":"Middle","pe":50,"ke":50},{"label":"Bottom","pe":0,"ke":100}]}',
                parameters: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    positions: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          label: { type: 'string', description: 'Short label (e.g. "Top", "A", "Before collision").' },
                          ke: { type: 'number', description: 'Kinetic energy.' },
                          pe: { type: 'number', description: 'Gravitational PE.' },
                          spring: { type: 'number', description: 'Spring / elastic PE.' },
                          thermal: { type: 'number', description: 'Energy lost to friction/heat.' },
                        },
                        required: ['label'],
                      },
                    },
                    yAxisLabel: { type: 'string' },
                    showTotalLine: { type: 'boolean' },
                    notes: { type: 'string' },
                  },
                  required: ['positions'],
                },
              },
              {
                type: 'function',
                name: 'show_free_body_diagram',
                description: 'Display a physics free-body diagram with force vectors. ALWAYS use this instead of show_svg_diagram for any free-body / force / Newton\'s-laws visualization. Semantic parameters only — you provide the object shape, surface type (or none), and a list of forces; the renderer draws arrows, arrowheads, and labels. Force colors auto-assign by name convention (W/Mg → green gravity, N → amber normal, f/friction → purple, T → blue tension, default red applied).\n\nSURFACE — CHOOSE CAREFULLY:\n• "horizontal" — object rests on a flat floor (book on table, car on road)\n• "inclined" — ramp/slope (REQUIRES angle field in degrees)\n• "vertical" — object against a wall\n• "none" — HANGING, suspended by ropes, in free fall, in space, floating, elevator with no visible floor. Omitting surface or using "none" draws no floor. DO NOT use "horizontal" for hanging/suspended objects — the floor will look wrong.\n\nNAME + MAGNITUDE FIELDS — STRICT RULES:\n• `name`: a SHORT force symbol, 1–5 characters (e.g. "W", "N", "T_1", "F_app", "f_k"). Never a descriptive phrase like "Normal from wall" or "Friction from floor" — those collide with neighbors and overflow labels.\n• `magnitude`: optional, and when present must be PLAIN TEXT — NOT LaTeX. Use unicode math symbols directly (θ, π, ², μ, Δ) or ASCII (e.g. "mg", "mv²/r", "mg sin θ", "20 N", "μmg"). NEVER use LaTeX commands like "\\\\frac{mv^2}{r}" — that renders as literal backslashes on the whiteboard, not as a fraction.\n• Do NOT echo the name as the magnitude. {name:"N", magnitude:"N"} is forbidden — just omit magnitude if you don\'t have a specific expression.\n\nDIRECTION OPTIONS:\n• Cardinal: "up", "down", "left", "right", "up-left", "up-right", "down-left", "down-right"\n• Slope-relative (inclined surfaces only): "normal" (perpendicular-out), "up-slope", "down-slope", "into-surface"\n• Numeric: angle in degrees as a string (math convention, CCW from +x — so "90"=up, "180"=left, "45"=up-right)\n\nFRICTION DIRECTION — CRITICAL:\n• Friction from a contact surface acts PARALLEL to that surface, opposing the tendency to slide. It is NEVER at an oblique angle to the surface.\n• If the surface is horizontal (floor), friction is horizontal (left or right) — never diagonal.\n• If the surface is vertical (wall), friction is vertical (up or down) — never diagonal. A person leaning against a vertical wall has friction straight up from the wall, not at an angle.\n• If the surface is inclined, use "up-slope" or "down-slope" — never a cardinal direction.\n• "Person at 15° from vertical leaning on a wall" does NOT mean tilt the coordinate system. The wall is still vertical; friction on the person from the wall is still vertical.\n\nEXAMPLES:\n• Block on 30° frictionless incline:\n  {"title":"Block on incline","object":{"shape":"box","mass":"5 kg"},"surface":{"type":"inclined","angle":30},"forces":[{"name":"W","magnitude":"mg","direction":"down"},{"name":"N","direction":"normal"}]}\n• Box hanging from two ropes at 30° and 45° from vertical:\n  {"title":"Box on two ropes","object":{"shape":"box","mass":"m"},"surface":{"type":"none"},"forces":[{"name":"T_1","direction":"120"},{"name":"T_2","direction":"45"},{"name":"W","magnitude":"mg","direction":"down"}]}\n• Person in an upward-accelerating elevator:\n  {"title":"Person in elevator","object":{"shape":"person"},"surface":{"type":"horizontal"},"forces":[{"name":"N","direction":"up"},{"name":"W","magnitude":"mg","direction":"down"}],"notes":"Elevator accelerating upward, so N > W"}',
                parameters: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    object: {
                      type: 'object',
                      properties: {
                        shape: { type: 'string', enum: ['box', 'circle', 'person'] },
                        label: { type: 'string' },
                        mass: { type: 'string' },
                      },
                    },
                    surface: {
                      type: 'object',
                      properties: {
                        type: { type: 'string', enum: ['horizontal', 'inclined', 'vertical', 'none'] },
                        angle: { type: 'number' },
                        friction: { type: 'boolean' },
                      },
                      required: ['type'],
                    },
                    forces: {
                      type: 'array',
                      description: 'Force vectors radiating from the object\'s center.',
                      items: {
                        type: 'object',
                        properties: {
                          name: { type: 'string' },
                          magnitude: { type: 'string' },
                          direction: { type: 'string', description: 'Named direction (e.g. "up", "normal", "up-slope") OR a numeric angle in degrees as a string (e.g. "45", "-135").' },
                          color: { type: 'string' },
                          scale: { type: 'number' },
                        },
                        required: ['name', 'direction'],
                      },
                    },
                    notes: { type: 'string' },
                  },
                  required: ['object', 'forces'],
                },
              },
              {
                type: 'function',
                name: 'show_timeline',
                description: 'Display a horizontal timeline of dated events — for history, biography, scientific discovery, literature periods, or any topic where sequence-in-time matters. Events auto-space by year when dates parse to numbers (supports BCE via negative years, "500 BCE", "1492 CE", "1776"); falls back to even spacing for string dates. Use `category` to color-group related events.',
                parameters: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    events: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          date: { type: 'string', description: 'Freeform date string, e.g. "1776", "1492 CE", "500 BCE".' },
                          title: { type: 'string', description: 'Short event name — keep under ~5 words.' },
                          description: { type: 'string' },
                          category: { type: 'string', description: 'Optional bucket label for color-grouping related events.' },
                          color: { type: 'string' },
                        },
                        required: ['date', 'title'],
                      },
                    },
                    orientation: { type: 'string', enum: ['horizontal', 'vertical'] },
                  },
                  required: ['events'],
                },
              },
              {
                type: 'function',
                name: 'show_map',
                description: 'Display a map with real country outlines (from Natural Earth) and pins at specific cities / states. Use for geography, history, civics, economics.\n\nPIN COORDINATES — USE REAL LAT/LON:\nAlways pass `lat` and `lon` on each pin — the actual geographic latitude and longitude of the city. The renderer projects them onto the active `background` preset automatically, so pins land on the correct country/state. You do NOT need to compute 0–100 normalized coords; just state the real coordinates.\n\nEXAMPLES:\n• USA state capitals: {lat: 33.4, lon: -112.1, label: "Phoenix"}, {lat: 30.3, lon: -97.7, label: "Austin"}, {lat: 42.4, lon: -71.1, label: "Boston"}\n• Middle East cities: {lat: 30.0, lon: 31.2, label: "Cairo"}, {lat: 31.8, lon: 35.2, label: "Jerusalem"}, {lat: 41.0, lon: 29.0, label: "Istanbul"}, {lat: 33.3, lon: 44.4, label: "Baghdad"}\n• European cities: {lat: 51.5, lon: -0.1, label: "London"}, {lat: 48.9, lon: 2.3, label: "Paris"}, {lat: 41.9, lon: 12.5, label: "Rome"}\n\nFALLBACK: if you must place a pin without a real lat/lon (e.g. an abstract label like "Western Front"), pass `x` and `y` in a 0–100 coord system (0,0 = top-left). Always prefer lat/lon when the pin represents a real place.\n\nBACKGROUND PRESETS: blank, world, north-america, south-america, europe, asia, africa, australia, usa, india, china, middle-east, mediterranean. Choose the preset whose bounding box contains the cities you want to show.',
                parameters: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    background: {
                      type: 'string',
                      enum: ['blank', 'world', 'north-america', 'south-america', 'europe', 'asia', 'africa', 'australia', 'usa', 'india', 'china', 'middle-east', 'mediterranean'],
                    },
                    pins: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          lat: { type: 'number', description: 'Geographic latitude (PREFERRED). Positive = north.' },
                          lon: { type: 'number', description: 'Geographic longitude (PREFERRED). Positive = east.' },
                          x: { type: 'number', description: 'Fallback: 0–100 normalized x. Only used if lat/lon omitted.' },
                          y: { type: 'number', description: 'Fallback: 0–100 normalized y.' },
                          label: { type: 'string' },
                          color: { type: 'string' },
                        },
                        required: ['label'],
                      },
                    },
                    regions: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          points: { type: 'string', description: 'Polygon points in the 0–100 system, e.g. "10,20 30,20 30,40".' },
                          path: { type: 'string', description: 'Raw SVG path data in the underlying 600x400 coordinate system.' },
                          label: { type: 'string' },
                          color: { type: 'string' },
                        },
                      },
                    },
                    caption: { type: 'string' },
                  },
                },
              },
              {
                type: 'function',
                name: 'show_circuit',
                description: 'Display a schematic circuit diagram with standard IEEE symbols (zigzag resistors, parallel-plate capacitors, inductor coils, battery cells, switches, bulbs, voltmeters, ammeters, ground). Use for AP Physics 2, AP Physics C: E&M, and college intro physics.\n\nNETLIST-ONLY SCHEMA:\nDescribe the circuit as a pure NETLIST — a list of components, each with a `from` node id and a `to` node id. The renderer auto-lays out nodes and draws rail wires; you do NOT specify any coordinates. Use any string ids for nodes (e.g. "a", "b", "n1", "top", "junction_1"). Components sharing the same {from, to} pair are laid out as parallel branches automatically.\n\nCLOSED-LOOP RULE — MOST IMPORTANT:\nEvery circuit MUST form a closed loop. Starting from one terminal of the battery, you should be able to trace through components and return to the other terminal. If your components only form a chain (a→b→c→d with no return), the renderer will warn "⚠ open circuit" and the student sees a broken circuit. ALWAYS include a component whose `to` node is the battery\'s other terminal (or reaches it via other components).\n\nEXAMPLES:\n• Simple RC loop (12V battery + 1kΩ resistor + 100µF capacitor + switch in series):\n  components: [\n    {"type":"battery","from":"a","to":"b","value":"12","unit":"V"},\n    {"type":"resistor","from":"b","to":"c","value":"1000","unit":"Ω","label":"R"},\n    {"type":"capacitor","from":"c","to":"d","value":"100","unit":"µF","label":"C"},\n    {"type":"switch-open","from":"d","to":"a"}\n  ]\n  // Note the switch returns from d back to a — closes the loop.\n\n• Parallel resistors (9V battery || 150Ω || 100Ω, with ammeter on the 150Ω branch):\n  components: [\n    {"type":"battery","from":"a","to":"b","value":"9","unit":"V"},\n    {"type":"resistor","from":"a","to":"b","value":"100","unit":"Ω","label":"R_2"},\n    {"type":"ammeter","from":"a","to":"m"},\n    {"type":"resistor","from":"m","to":"b","value":"150","unit":"Ω","label":"R_1"}\n  ]\n  // The battery and R_2 go directly a→b (parallel). The ammeter+R_1 form a third parallel branch via intermediate node m.\n\n• Series batteries with parallel resistors (6V + 9V batteries, three 100Ω in parallel):\n  components: [\n    {"type":"battery","from":"a","to":"b","value":"6","unit":"V"},\n    {"type":"battery","from":"b","to":"c","value":"9","unit":"V"},\n    {"type":"resistor","from":"c","to":"a","value":"100","unit":"Ω","label":"R_1"},\n    {"type":"resistor","from":"c","to":"a","value":"100","unit":"Ω","label":"R_2"},\n    {"type":"resistor","from":"c","to":"a","value":"100","unit":"Ω","label":"R_3"}\n  ]\n  // Batteries chained a→b→c. Three parallel resistors return c→a.\n\n• Wheatstone bridge (4 arms + galvanometer + battery) — uses 4 nodes in a diamond:\n  components: [\n    {"type":"battery","from":"a","to":"d","value":"9","unit":"V"},\n    {"type":"resistor","from":"a","to":"b","value":"100","unit":"Ω","label":"R_1"},\n    {"type":"resistor","from":"b","to":"d","value":"100","unit":"Ω","label":"R_2"},\n    {"type":"resistor","from":"a","to":"c","value":"100","unit":"Ω","label":"R_3"},\n    {"type":"resistor","from":"c","to":"d","value":"100","unit":"Ω","label":"R_4"},\n    {"type":"galvanometer","from":"b","to":"c"}\n  ]\n  // Battery between a and d. Two arms (R_1, R_2) via b, two arms (R_3, R_4) via c. Galvanometer bridges b to c. A Wheatstone ALWAYS has 6 components: battery + 4 arms + bridge element.\n\nCOMPONENT FIELDS:\n• `from`, `to`: node ids (any strings). Direction matters for battery polarity (+ is on the `from` side).\n• `value`: the numeric magnitude only (e.g. "150", "9", "100"). Do NOT include units here.\n• `unit`: the unit symbol separately (e.g. "Ω", "V", "µF", "H", "A").\n• `label`: a variable name like "R_1" or "ε". OMIT `label` for ammeters/voltmeters/batteries — the symbol already tells the student which component it is.\n• `value` and `label` should NEVER be the same string. Don\'t send {label:"9V", value:"9"} — pick one or the other.',
                parameters: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    components: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          type: {
                            type: 'string',
                            enum: ['resistor', 'capacitor', 'inductor', 'battery', 'wire', 'switch-open', 'switch-closed', 'bulb', 'voltmeter', 'ammeter', 'galvanometer', 'ground'],
                          },
                          from: { type: 'string', description: 'Node id — any string (e.g. "a", "n1", "junction").' },
                          to: { type: 'string', description: 'Node id — any string.' },
                          value: { type: 'string' },
                          unit: { type: 'string', description: 'e.g. "Ω", "μF", "V", "H", "A".' },
                          label: { type: 'string', description: 'Variable name, e.g. "R_1" or "ε".' },
                        },
                        required: ['type', 'from', 'to'],
                      },
                    },
                    showNodes: { type: 'boolean' },
                  },
                  required: ['components'],
                },
              },
              {
                type: 'function',
                name: 'show_lewis',
                description: 'Display a 2D Lewis dot structure — atoms connected by single/double/triple bonds, with lone pair electrons as dots and optional formal charges. Use for chemistry teaching of bonding, resonance, formal charge, electron accounting. Place atoms at x,y in a normalized 0–100 coordinate system (keep atoms ~30 units apart for clear bonds). DIFFERENT from show_molecule: use this for 2D Lewis structures and show_molecule for SMILES-based structural formulas.\n\nCANONICAL FORMS — CRITICAL:\n• For sugars and cyclic biomolecules, ALWAYS draw the RING (cyclic) form since it is the dominant form in biology, NOT the open-chain form. Glucose/galactose/mannose → pyranose (6-member ring with one O). Fructose/ribose/deoxyribose → furanose (5-member ring with one O). Drawing glucose as a linear chain is misleading to students.\n• For benzene / aromatic rings, draw the 6-carbon ring with alternating double bonds (or with the central circle as shorthand, if requested).\n• For amino acids, draw at physiological pH (zwitterion: NH3+ and COO-).\n• Prefer show_molecule (SMILES) for canonical biomolecule structures when the student wants the "real" structural formula.',
                parameters: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    formula: { type: 'string', description: 'Molecular formula shown above the structure (e.g., "H2O", "CO2").' },
                    atoms: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          element: { type: 'string', description: 'Element symbol with optional charge, e.g. "C", "O", "N", "Na+", "Cl-".' },
                          x: { type: 'number' },
                          y: { type: 'number' },
                          lonePairs: { type: 'number' },
                          formalCharge: { type: 'number' },
                        },
                        required: ['id', 'element', 'x', 'y'],
                      },
                    },
                    bonds: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          from: { type: 'string' },
                          to: { type: 'string' },
                          order: { type: 'number', description: 'Bond order: 1 = single, 2 = double, 3 = triple.' },
                          style: { type: 'string', enum: ['solid', 'dashed', 'wedge', 'dash-wedge'] },
                        },
                        required: ['from', 'to', 'order'],
                      },
                    },
                    geometry: { type: 'string', description: 'Optional geometry label shown below, e.g. "bent", "trigonal planar", "tetrahedral".' },
                  },
                  required: ['atoms'],
                },
              },
              {
                type: 'function',
                name: 'show_periodic_table',
                description: 'Display the full periodic table with all 118 elements arranged in the standard group/period layout. Elements are colored by category with a legend. Use to teach periodic trends, group chemistry, element properties, or to point out specific elements. Highlights focus attention: `highlight` for specific symbols, `highlightGroup` (1–18), `highlightPeriod` (1–7), `highlightCategory` for element classes.',
                parameters: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    highlight: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          symbol: { type: 'string', description: 'Element symbol e.g. "Na", "Cl", "Fe".' },
                          color: { type: 'string' },
                          note: { type: 'string' },
                        },
                        required: ['symbol'],
                      },
                    },
                    highlightGroup: { type: 'number', description: '1–18.' },
                    highlightPeriod: { type: 'number', description: '1–7.' },
                    highlightCategory: {
                      type: 'string',
                      enum: ['alkali', 'alkaline-earth', 'transition', 'post-transition', 'metalloid', 'reactive-nonmetal', 'halogen', 'noble-gas', 'lanthanide', 'actinide'],
                    },
                    showMass: { type: 'boolean' },
                  },
                },
              },
              {
                type: 'function',
                name: 'show_annotated_passage',
                description: 'Display a reading passage with line numbers, highlighted text spans, and margin notes — the core ELA teaching artifact for close reading, literary analysis, rhetoric, and SAT/ACT/AP reading comprehension. Provide the passage as a single `passage` string (split on newlines) OR as pre-split `lines`. Highlights reference text by line number + substring. Margin notes attach to a line number and appear in a right-hand gutter. Use colors thoughtfully — yellow for imagery, blue for evidence, green for thesis.',
                parameters: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    source: { type: 'string', description: 'Author + work attribution, e.g. "Frankenstein, Mary Shelley, Chapter 5".' },
                    passage: { type: 'string', description: 'Full passage text. Will be split on newlines.' },
                    lines: { type: 'array', items: { type: 'string' } },
                    startLineNumber: { type: 'number' },
                    highlights: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          line: { type: 'number', description: '1-based line number.' },
                          text: { type: 'string', description: 'Substring to highlight within that line.' },
                          color: { type: 'string', description: 'CSS color — e.g. "#fef08a" (yellow), "#bae6fd" (blue), "#bbf7d0" (green).' },
                          note: { type: 'string' },
                        },
                        required: ['line', 'text'],
                      },
                    },
                    marginNotes: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          line: { type: 'number' },
                          text: { type: 'string' },
                        },
                        required: ['line', 'text'],
                      },
                    },
                  },
                },
              },
              {
                type: 'function',
                name: 'show_call_stack',
                description: 'Display a visual call stack for teaching recursion, scope, and function invocation. Provide `frames` with the OLDEST frame first (bottom of stack, usually `main`) and the newest call LAST (top). Each frame shows its function signature, arguments, locals, and optionally the currently-executing line. Use `returnValue` on a frame to indicate it is about to return.',
                parameters: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    frames: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          function: { type: 'string', description: 'Frame label, e.g. "factorial(3)" or "main()".' },
                          args: { type: 'string', description: 'JSON-encoded object mapping arg name → value, e.g. "{\\"n\\": 3}". (Encoded as string because OpenAI strict schemas forbid free-form objects.)' },
                          locals: { type: 'string', description: 'JSON-encoded object of local variable bindings, e.g. "{\\"i\\": 0, \\"sum\\": 0}".' },
                          currentLine: { type: 'number' },
                          returnValue: { type: 'string' },
                          highlight: { type: 'boolean', description: 'Mark this frame as the active one.' },
                        },
                        required: ['function'],
                      },
                    },
                    finalReturn: { type: 'string' },
                  },
                  required: ['frames'],
                },
              },
              {
                type: 'function',
                name: 'show_flowchart',
                description: 'Display a flowchart. Node types: "start" / "end" (pills), "process" (rectangle), "decision" (diamond), "io" (parallelogram). ALWAYS include `edges`. Label every decision-branch edge with "yes" / "no".\n\nLAYOUT RULES for branching / looping algorithms (always use explicit x,y):\n1. Main spine at x=50.\n2. Off-spine branches at x=15 / x=85. Decision "yes" and "no" should exit OPPOSITE sides so they don\'t collide with the loop-back.\n3. `end` at x=50 (bottom center) so return paths converge.\n4. Short labels (≤18 chars; auto-wraps if longer).\n\nTHE RENDERER AUTO-ROUTES: back-edges and forward edges that would pass through intermediate nodes route orthogonally around a side channel. Channel side is chosen opposite the target\'s occupied side.\n\n(a) Euclidean gcd — simple loop:\nnodes: start(50,10) input(50,25) cond-diamond(50,40) returnA(85,40) body(50,60) end(50,85).\nedges: start→input, input→cond, cond→returnA ("yes"), cond→body ("no"), body→cond (BACK-EDGE), returnA→end.\n\n(b) Binary search:\nnodes: start(50,5) input(50,15) init(50,25) loopCond-diamond(50,35) midCalc(50,45) eqCheck-diamond(50,55) returnMid(85,55) gtCheck-diamond(50,65) highUpdate(15,75) lowUpdate(85,75) returnNotFound(50,85) end(50,95).\nedges: start→input, input→init, init→loopCond, loopCond→midCalc ("yes"), loopCond→returnNotFound ("no"), midCalc→eqCheck, eqCheck→returnMid ("yes"), eqCheck→gtCheck ("no"), gtCheck→highUpdate ("yes"), gtCheck→lowUpdate ("no"), highUpdate→loopCond (BACK-EDGE, NOT midCalc), lowUpdate→loopCond (BACK-EDGE, NOT midCalc), returnMid→end, returnNotFound→end.\n\nCRITICAL: loop-backs MUST target the condition diamond, not the body. Without explicit coords, layout is a top-down chain — only for linear procedures.',
                parameters: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    nodes: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          type: { type: 'string', enum: ['start', 'end', 'process', 'decision', 'io'] },
                          label: { type: 'string' },
                          x: { type: 'number' },
                          y: { type: 'number' },
                        },
                        required: ['id', 'type', 'label'],
                      },
                    },
                    edges: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          from: { type: 'string' },
                          to: { type: 'string' },
                          label: { type: 'string' },
                        },
                        required: ['from', 'to'],
                      },
                    },
                    layout: { type: 'string', enum: ['top-down', 'left-right'] },
                  },
                  required: ['nodes'],
                },
              },
              {
                type: 'function',
                name: 'show_manipulative',
                description: 'Display an elementary-math visual manipulative for K-5. Types: "base-10" (ones/tens/hundreds/thousands blocks for place value), "ten-frame" (2×5 grid with counters for counting 0–20), "area-model" (partitioned rectangle for multi-digit multiplication). Base-10 for place value and regrouping; ten-frame for counting, addition, subitizing; area-model for multiplication strategies and later distributive property.\n\nFOR ADDITION-WITH-REGROUPING demos, issue TWO calls: (1) "before regrouping" with the raw sums, e.g. 47+28 → { tens: 6, ones: 15 } showing all 15 ones visible so the student sees the overflow, and (2) "after regrouping" with the carried result { tens: 8, ones: 5 }. Ones up to 18 are supported (wraps to 2 rows). DO NOT pre-carry the ones in the "before" step — the whole point is to SEE the regrouping happen.',
                parameters: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    type: { type: 'string', enum: ['base-10', 'ten-frame', 'area-model'] },
                    base10: {
                      type: 'object',
                      properties: {
                        ones: { type: 'number' },
                        tens: { type: 'number' },
                        hundreds: { type: 'number' },
                        thousands: { type: 'number' },
                        showTotal: { type: 'boolean' },
                      },
                    },
                    tenFrame: {
                      type: 'object',
                      properties: {
                        count: { type: 'number', description: 'Number of filled dots, 0–20.' },
                        color: { type: 'string' },
                        label: { type: 'string' },
                      },
                    },
                    areaModel: {
                      type: 'object',
                      properties: {
                        rows: { type: 'array', items: { type: 'number' } },
                        cols: { type: 'array', items: { type: 'number' } },
                        showProducts: { type: 'boolean' },
                        showSum: { type: 'boolean' },
                        rowLabel: { type: 'string' },
                        colLabel: { type: 'string' },
                      },
                    },
                  },
                  required: ['type'],
                },
              },
              // Tier-1 structured tools (batch 2026-04-22) — sourced from
              // WHITEBOARD_TOOLS via toOpenAITools() so we only maintain
              // schemas in one place.
              ...toOpenAITools(WHITEBOARD_TOOLS.filter((t) => TIER1_NEW_TOOL_NAMES.has(t.name))),
            ],
            tool_choice: 'auto',
            audio: {
              input: {
                transcription: { model: 'whisper-1' },
                turn_detection: {
                  type: 'server_vad',
                  threshold: vadThreshold,              // Higher threshold = less sensitive to quiet sounds (0-1)
                  prefix_padding_ms: vadPrefixPaddingMs, // Audio included before detected speech
                  silence_duration_ms: vadSilenceDurationMs, // Wait this long before responding
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
        updateState('disconnected');
      };

      wsRef.current = ws;
    } catch (err) {
      console.error('[Realtime] Connection error:', err);
      const error = err instanceof Error ? err : new Error('Connection failed');
      setError(error);
      onError?.(error);
      updateState('error');
    }
  }, [voice, vadThreshold, vadSilenceDurationMs, vadPrefixPaddingMs, handleMessage, onError, updateState]);

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

        hasAudioInBufferRef.current = true;
        wsRef.current.send(JSON.stringify({
          type: 'input_audio_buffer.append',
          audio: base64Audio,
        }));
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

    // Commit audio buffer and request a response
    if (wsRef.current?.readyState === WebSocket.OPEN && hasAudioInBufferRef.current) {
      wsRef.current.send(JSON.stringify({
        type: 'input_audio_buffer.commit',
      }));
      // Explicitly request a response — server VAD auto-responds only after
      // its own speech_stopped detection, but manual stop bypasses that.
      wsRef.current.send(JSON.stringify({
        type: 'response.create',
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
  };
}
