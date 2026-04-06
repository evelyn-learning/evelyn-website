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
import { mapFunctionCallToCommand } from './toolDefinitions';

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

export interface RealtimeConfig {
  instructions: string;
  voice?: OpenAIVoice;
  vadThreshold?: number;
  vadSilenceDurationMs?: number;
  vadPrefixPaddingMs?: number;
  onTranscriptUpdate?: (role: 'user' | 'assistant', text: string, isFinal: boolean) => void;
  onWhiteboardCommand?: (commands: WhiteboardCommand[]) => void;
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
  // Track whether the session should be in listening mode (survives audio playback)
  const shouldListenRef = useRef(false);
  // Ref to hold startListening so playNextAudio can call it without circular deps
  const startListeningRef = useRef<() => void>(() => {});
  // Track whether audio has been appended to the input buffer (to avoid committing empty buffers)
  const hasAudioInBufferRef = useRef(false);

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
  const handleMessage = useCallback((event: MessageEvent) => {
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
              // Strategy 2: Replace literal control characters then parse
              try {
                const sanitized = rawArgsStr
                  .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // strip non-standard control chars
                  .replace(/\r\n?/g, '\\n')  // CR/CRLF → escaped newline
                  .replace(/\n/g, '\\n')      // LF → escaped newline
                  .replace(/\t/g, '\\t');     // tab → escaped tab
                funcArgs = JSON.parse(sanitized);
                parsed = true;
              } catch {
                // Strategy 3: Extract fields via regex (for SVG that breaks JSON structure)
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
              }
            }

            if (!parsed) {
              console.error('[Realtime] Could not parse function arguments at all:', rawArgsStr.substring(0, 200));
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
            lastResponseHadToolCallRef.current = true;

            // Convert function call to whiteboard command (shared logic)
            const command = mapFunctionCallToCommand(funcName, funcArgs);

            if (command) {
              onWhiteboardCommand?.([command]);
            }

            // Send function call result back to continue the conversation
            if (wsRef.current?.readyState === WebSocket.OPEN) {
              wsRef.current.send(JSON.stringify({
                type: 'conversation.item.create',
                item: {
                  type: 'function_call_output',
                  call_id: data.item.call_id,
                  output: JSON.stringify({ success: true, message: `Displayed ${funcName.replace('show_', '')} on whiteboard` }),
                },
              }));
              // Trigger continuation
              wsRef.current.send(JSON.stringify({
                type: 'response.create',
              }));
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
      // Get ephemeral token from our API
      const tokenResponse = await fetch('/api/tutor/realtime-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voice }),
      });

      if (!tokenResponse.ok) {
        const errorBody = await tokenResponse.text();
        console.error('[Realtime] Token request failed:', tokenResponse.status, errorBody);
        throw new Error(`Failed to get realtime token: ${tokenResponse.status}`);
      }

      const tokenData = await tokenResponse.json();
      const client_secret = tokenData.client_secret;
      if (!client_secret) {
        console.error('[Realtime] No client_secret in token response:', tokenData);
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

        // Configure session with instructions (GA format)
        ws.send(JSON.stringify({
          type: 'session.update',
          session: {
            type: 'realtime',
            instructions: instructions,
            tools: [
              {
                type: 'function',
                name: 'show_equation',
                description: 'Display an equation on the whiteboard. You MUST call this whenever you mention ANY equation, formula, or mathematical relationship in your speech. Always show equations visually — never just say them without also displaying them.',
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
                description: 'Display a code snippet on the whiteboard. You MUST call this whenever you discuss, explain, or reference any programming code. Always show code visually — never just describe code verbally without also displaying it.',
                parameters: {
                  type: 'object',
                  properties: {
                    code: { type: 'string', description: 'The code to display. Use \\n for newlines and spaces for indentation.' },
                    language: { type: 'string', description: 'Programming language (e.g., java, python, ruby, javascript, c, cpp)' },
                    label: { type: 'string', description: 'A short label/title for the code snippet' },
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
                description: 'Display a physics diagram on the whiteboard using SVG. Use for physical setups (pipes, ramps, pulleys, circuits, etc.), NOT for math function graphs. LAYOUT ZONES (viewBox 0 0 400 300): Title zone y=10-30, Shape zone y=60-200, Label zone y=210-290. ALL shapes must fit within x=30-370 and y=60-200. ALL text labels go OUTSIDE shapes — in the label zone below (y>210) or the title zone above (y<30). NEVER place text on top of colored shapes. Use leader lines to connect labels to shapes.',
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
                description: 'Display geometric figures with labeled vertices, segments, polygons, circles, and angle markers. The AI provides named points with (x,y) coordinates and the renderer draws everything precisely. Use for: triangles, quadrilaterals, circle theorems, transformations, proofs, constructions. ALWAYS use this instead of show_svg_diagram for geometric figures.',
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
                description: 'Display a tree diagram with auto-layout. Use for: probability trees, factor trees, decision trees, counting principles.',
                parameters: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    type: { type: 'string', enum: ['probability', 'factor', 'decision', 'generic'] },
                    root: { type: 'object', description: 'Recursive tree node: { label, value?, color?, children?: [{ label, probability?, node: TreeNode }] }' },
                    showLeafProbabilities: { type: 'boolean' },
                    direction: { type: 'string', enum: ['top-down', 'left-right'] },
                  },
                  required: ['root'],
                },
              },
              {
                type: 'function',
                name: 'show_venn_diagram',
                description: 'Display a 2 or 3 set Venn diagram. Use for: set operations, probability, logic, GCF/LCM.',
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
  }, [instructions, voice, vadThreshold, vadSilenceDurationMs, vadPrefixPaddingMs, handleMessage, onError, updateState]);

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

      processor.onaudioprocess = (e) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

        const inputData = e.inputBuffer.getChannelData(0);
        // Resample from audioContext rate to 24000 if needed
        const resampledData = inputData; // Assuming 24kHz context

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
