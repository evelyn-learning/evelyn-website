'use client';

/**
 * OpenAI Realtime API Hook
 *
 * Handles WebSocket connection to OpenAI's Realtime API for
 * low-latency voice conversations. Replaces the separate
 * STT -> LLM -> TTS pipeline with a single real-time connection.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import type { WhiteboardCommand, ShadedRegion } from '@/lib/knowledge/types';

// OpenAI Realtime voice options
export type OpenAIVoice = 'alloy' | 'ash' | 'ballad' | 'coral' | 'echo' | 'sage' | 'shimmer' | 'verse';

export interface RealtimeConfig {
  instructions: string;
  voice?: OpenAIVoice;
  vadThreshold?: number;
  vadSilenceDurationMs?: number;
  vadPrefixPaddingMs?: number;
  onTranscriptUpdate?: (role: 'user' | 'assistant', text: string, isFinal: boolean) => void;
  onWhiteboardCommand?: (commands: WhiteboardCommand[]) => void;
  onError?: (error: Error) => void;
  onStateChange?: (state: RealtimeState) => void;
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
  interrupt: () => void;
  pause: () => void;
  sendTextMessage: (text: string) => void;
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
    vadThreshold = 0.6, vadSilenceDurationMs = 1500, vadPrefixPaddingMs = 500,
    onTranscriptUpdate, onWhiteboardCommand, onError, onStateChange,
  } = config;

  const [state, setState] = useState<RealtimeState>('disconnected');
  const [error, setError] = useState<Error | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const audioQueueRef = useRef<Float32Array[]>([]);
  const isPlayingRef = useRef(false);
  const currentResponseTextRef = useRef('');
  const playbackSourceRef = useRef<AudioBufferSourceNode | null>(null);
  // Track whether the session should be in listening mode (survives audio playback)
  const shouldListenRef = useRef(false);
  // Ref to hold startListening so playNextAudio can call it without circular deps
  const startListeningRef = useRef<() => void>(() => {});

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
    audioQueueRef.current.push(float32);

    if (!isPlayingRef.current) {
      playNextAudio();
    }
  }, [playNextAudio]);

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
          updateState('listening');
          break;

        case 'input_audio_buffer.speech_stopped':
          console.log('[Realtime] Speech ended');
          updateState('processing');
          break;

        case 'input_audio_buffer.committed':
          console.log('[Realtime] Audio committed');
          break;

        case 'conversation.item.input_audio_transcription.completed':
          // User's speech transcription
          if (data.transcript) {
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

        case 'response.done':
          console.log('[Realtime] Response complete');
          currentResponseTextRef.current = '';
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
                      latex: latexMatch[1],
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

            console.log('[Realtime] Function call:', funcName, funcArgs);

            // Convert function call to whiteboard command
            let command: WhiteboardCommand | null = null;

            if (funcName === 'show_equation') {
              command = {
                action: 'showEquation',
                latex: funcArgs.latex,
                label: funcArgs.label,
              };
            } else if (funcName === 'show_svg_diagram') {
              command = {
                action: 'showSvgDiagram',
                svg: funcArgs.svg,
                title: funcArgs.title,
                description: funcArgs.description,
              };
            } else if (funcName === 'show_function_graph') {
              // Build GraphData from structured AI parameters
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const fns = Array.isArray(funcArgs.functions) ? funcArgs.functions : [];
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const fnsOfY = Array.isArray(funcArgs.functionsOfY) ? funcArgs.functionsOfY : [];
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const graphFunctions = fns.map((f: any) => ({
                fn: String(f.expr || ''),
                color: f.color,
                label: f.label,
                domain: f.domain,
              }));
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const graphFunctionsOfY = fnsOfY.map((f: any) => ({
                fn: String(f.expr || ''),
                color: f.color,
                label: f.label,
                domain: f.domain,
              }));
              const xRange = (Array.isArray(funcArgs.xRange) ? funcArgs.xRange : [-5, 5]) as [number, number];
              const yRange = (Array.isArray(funcArgs.yRange) ? funcArgs.yRange : [-5, 5]) as [number, number];
              command = {
                action: 'showGraph',
                type: 'generic-xy' as const,
                data: {
                  title: funcArgs.title || '',
                  xLabel: funcArgs.xLabel || 'x',
                  yLabel: funcArgs.yLabel || 'y',
                  xRange,
                  yRange,
                  functions: graphFunctions,
                  functionsOfY: graphFunctionsOfY,
                  points: Array.isArray(funcArgs.points) ? funcArgs.points : [],
                  shadedRegion: funcArgs.shadedRegion ? funcArgs.shadedRegion as unknown as ShadedRegion : undefined,
                },
              };
            }

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
              errorMessage.includes('already has an active response')) {
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
  }, [updateState, onTranscriptUpdate, onWhiteboardCommand, onError, queueAudio]);

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
        throw new Error('Failed to get realtime token');
      }

      const { client_secret } = await tokenResponse.json();
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
                description: 'Plot mathematical functions accurately on the whiteboard. Use this tool INSTEAD of show_svg_diagram whenever you need to graph mathematical functions (y=f(x) or x=f(y)), show curves, or shade regions between curves. The rendering engine computes exact coordinates — you just provide the function expressions as strings. Supports: y=f(x) functions, x=f(y) functions, labeled points, and shaded regions between two curves. Function expressions use JavaScript math syntax: use ** for exponents (not ^), Math.sin, Math.cos, Math.sqrt, Math.abs, Math.PI, Math.E. Variable names: use "x" for f(x) functions, "y" for f(y) functions.',
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
                      description: 'y=f(x) functions to plot. Each has expr (JS math string using "x"), color, label, domain.',
                      items: {
                        type: 'object',
                        properties: {
                          expr: { type: 'string', description: 'Function expression using x, e.g. "4 - 0.5*x", "x**2", "Math.sin(x)"' },
                          color: { type: 'string', description: 'Color hex, e.g. "#dc2626"' },
                          label: { type: 'string', description: 'Legend label, e.g. "y = 4 - x/2"' },
                          domain: { type: 'array', items: { type: 'number' }, description: 'Optional x-domain restriction [min, max]' },
                        },
                        required: ['expr'],
                      },
                    },
                    functionsOfY: {
                      type: 'array',
                      description: 'x=f(y) functions to plot (curves where x depends on y). Each has expr (JS math string using "y"), color, label, domain.',
                      items: {
                        type: 'object',
                        properties: {
                          expr: { type: 'string', description: 'Function expression using y, e.g. "y**3", "3*y - 2"' },
                          color: { type: 'string', description: 'Color hex' },
                          label: { type: 'string', description: 'Legend label, e.g. "x = y³"' },
                          domain: { type: 'array', items: { type: 'number' }, description: 'Optional y-domain restriction [min, max]' },
                        },
                        required: ['expr'],
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
                name: 'show_svg_diagram',
                description: 'Display a physics diagram, illustration, or non-mathematical visual on the whiteboard using raw SVG markup. Use this for physical setups (pipes, cars, ramps, pulleys, circuits, etc.), NOT for mathematical function graphs — use show_function_graph for those instead. Rules: (1) For physics diagrams, draw REALISTIC shapes — actual car silhouettes for motion problems, actual pipe shapes for fluid flow, block shapes for free body diagrams. (2) Use filled shapes, gradients, and colors for professional quality. (3) Always include labeled arrows, dimensions, values, and titles.',
                parameters: {
                  type: 'object',
                  properties: {
                    title: { type: 'string', description: 'Title for the visual' },
                    description: { type: 'string', description: 'Brief description of what the visual shows' },
                    svg: { type: 'string', description: 'Complete SVG markup. MUST start with <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">. Rules: (1) For containers (tubes, tanks, pipes), draw WALLS as separate <rect> elements, then fill fluid as colored <rect> inside. (2) For arrows, use <line> + <polygon> arrowhead. (3) Use colors: #2563eb (blue), #dc2626 (red), #16a34a (green), #9333ea (purple), #f59e0b (amber), #64748b (gray). (4) Labels: <text font-family="Arial, sans-serif" font-size="14">. (5) End with </svg>. (6) PROPORTIONAL SIZING: SVG element sizes MUST be proportional to actual values. (7) Do NOT include literal newlines inside SVG — keep SVG on one line or use spaces.' },
                  },
                  required: ['svg', 'title'],
                },
              },
            ],
            tool_choice: 'auto',
            audio: {
              input: {
                transcription: { model: 'whisper-1', language: 'en' },
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

    updateState('disconnected');
  }, [updateState]);

  // Start listening (microphone capture)
  const startListening = useCallback(async () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.error('[Realtime] Not connected');
      return;
    }

    // If mic is already active, just update state
    if (audioProcessorRef.current && mediaStreamRef.current) {
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

        const base64Audio = float32ToBase64PCM16(resampledData);

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

    // Commit audio buffer
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'input_audio_buffer.commit',
      }));
    }

    updateState('processing');
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
    interrupt,
    pause,
    sendTextMessage,
  };
}
