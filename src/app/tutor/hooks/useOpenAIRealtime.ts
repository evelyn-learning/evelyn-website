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

// OpenAI Realtime voice options
export type OpenAIVoice = 'alloy' | 'ash' | 'ballad' | 'coral' | 'echo' | 'sage' | 'shimmer' | 'verse';

export interface RealtimeConfig {
  instructions: string;
  voice?: OpenAIVoice;
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
  const { instructions, voice = 'alloy', onTranscriptUpdate, onWhiteboardCommand, onError, onStateChange } = config;

  const [state, setState] = useState<RealtimeState>('disconnected');
  const [error, setError] = useState<Error | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const audioQueueRef = useRef<Float32Array[]>([]);
  const isPlayingRef = useRef(false);
  const currentResponseTextRef = useRef('');
  const playbackSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Update state and notify parent
  const updateState = useCallback((newState: RealtimeState) => {
    setState(newState);
    onStateChange?.(newState);
  }, [onStateChange]);

  // Play queued audio
  const playNextAudio = useCallback(() => {
    if (audioQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      updateState('connected');
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
          // If no audio was played, go back to connected state
          if (!isPlayingRef.current && audioQueueRef.current.length === 0) {
            updateState('connected');
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
            const funcArgs = JSON.parse(data.item.arguments || '{}');
            console.log('[Realtime] Function call:', funcName, funcArgs);

            // Convert function call to whiteboard command
            let command: WhiteboardCommand | null = null;

            if (funcName === 'show_equation') {
              command = {
                action: 'showEquation',
                latex: funcArgs.latex,
                label: funcArgs.label,
              };
            } else if (funcName === 'show_graph') {
              command = {
                action: 'showGraph',
                type: funcArgs.graph_type || 'generic-xy',
                data: {
                  title: funcArgs.title || '',
                  xLabel: funcArgs.x_label || 'x',
                  yLabel: funcArgs.y_label || 'y',
                  xRange: [0, 10] as [number, number],
                  yRange: [0, 10] as [number, number],
                },
              };
            } else if (funcName === 'show_diagram') {
              const diagramType = funcArgs.diagram_type || 'vectors';
              // Build params based on what the AI provided
              const diagramParams: Record<string, unknown> = {
                description: funcArgs.description,
                title: funcArgs.title,
              };

              // Handle different diagram types with AI-provided parameters
              if (diagramType === 'projectile') {
                diagramParams.v0 = funcArgs.initial_velocity || funcArgs.v0 || 20;
                diagramParams.angle = funcArgs.launch_angle || funcArgs.angle || 45;
              } else if (diagramType === 'free-body') {
                diagramParams.forces = funcArgs.forces || [
                  { magnitude: 10, direction: 270, label: 'W', color: '#dc2626' },
                ];
                diagramParams.showNet = funcArgs.show_resultant;
              } else if (diagramType === 'vectors' || diagramType === 'velocity' || diagramType === 'triangle') {
                // Use vectors provided by AI, or construct from triangle parameters
                if (funcArgs.vectors && funcArgs.vectors.length > 0) {
                  diagramParams.vectors = funcArgs.vectors;
                } else if (funcArgs.height || funcArgs.base || funcArgs.angle) {
                  // Construct vectors for a triangle/geometry problem
                  const vectors = [];
                  if (funcArgs.height) {
                    vectors.push({
                      magnitude: funcArgs.height,
                      direction: 90, // vertical (up)
                      label: `h = ${funcArgs.height}m`,
                    });
                  }
                  if (funcArgs.base) {
                    vectors.push({
                      magnitude: funcArgs.base,
                      direction: 0, // horizontal (right)
                      label: `d = ${funcArgs.base}m`,
                    });
                  }
                  // If we have height and angle, we can show the hypotenuse/line of sight
                  if (funcArgs.height && funcArgs.angle) {
                    const angleRad = (funcArgs.angle * Math.PI) / 180;
                    const hypotenuse = funcArgs.height / Math.sin(angleRad);
                    vectors.push({
                      magnitude: hypotenuse,
                      direction: funcArgs.angle, // angle from horizontal
                      label: `θ = ${funcArgs.angle}°`,
                      color: '#9333ea',
                    });
                  }
                  diagramParams.vectors = vectors.length > 0 ? vectors : [
                    { magnitude: 5, direction: 90, label: 'height' },
                    { magnitude: 5, direction: 0, label: 'distance' },
                  ];
                } else {
                  diagramParams.vectors = [
                    { magnitude: 5, direction: 0, label: 'v₁' },
                    { magnitude: 3, direction: 90, label: 'v₂' },
                  ];
                }
                diagramParams.showResultant = funcArgs.show_resultant;
                diagramParams.showAxes = true;
              } else if (diagramType === 'circular-path') {
                diagramParams.radius = funcArgs.radius || 3;
              } else if (diagramType === 'motion') {
                diagramParams.positions = funcArgs.positions;
              }

              command = {
                action: 'showDiagram',
                type: diagramType === 'triangle' ? 'vectors' : diagramType,
                params: diagramParams,
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
                name: 'show_graph',
                description: 'Display a graph on the whiteboard. Use this for position-time, velocity-time, or other graphs.',
                parameters: {
                  type: 'object',
                  properties: {
                    graph_type: { type: 'string', enum: ['position-time', 'velocity-time', 'acceleration-time', 'generic-xy'], description: 'Type of graph' },
                    title: { type: 'string', description: 'Title of the graph' },
                    x_label: { type: 'string', description: 'X-axis label' },
                    y_label: { type: 'string', description: 'Y-axis label' },
                  },
                  required: ['graph_type'],
                },
              },
              {
                type: 'function',
                name: 'show_diagram',
                description: 'Display a physics diagram on the whiteboard. Choose the RIGHT type: "free-body" for ANY force analysis including buoyancy/floating/sinking (buoyant force up, weight down), "vectors" for comparing velocities or vector addition, "projectile" for trajectories, "circular-path" for circular motion, "motion" for position dots over time. For buoyancy/fluid problems, ALWAYS use "free-body" with upward buoyant force and downward weight force.',
                parameters: {
                  type: 'object',
                  properties: {
                    diagram_type: {
                      type: 'string',
                      enum: ['vectors', 'free-body', 'projectile', 'circular-path', 'motion', 'triangle'],
                      description: 'Type of diagram: vectors (for showing multiple vectors with magnitudes and angles), free-body (forces on object), projectile (trajectory), circular-path, motion (position vs time), triangle (for geometry/trig problems)'
                    },
                    title: { type: 'string', description: 'Title for the diagram' },
                    // For vectors diagram
                    vectors: {
                      type: 'array',
                      description: 'Array of vectors to show (for vectors type). Each vector has magnitude, direction (degrees from east, counterclockwise), and label.',
                      items: {
                        type: 'object',
                        properties: {
                          magnitude: { type: 'number', description: 'Length/magnitude of vector' },
                          direction: { type: 'number', description: 'Angle in degrees (0=east/right, 90=north/up, 180=west, 270=south)' },
                          label: { type: 'string', description: 'Label for this vector (e.g., "v", "F", "height=3400m")' }
                        }
                      }
                    },
                    show_resultant: { type: 'boolean', description: 'Whether to show the resultant/sum vector' },
                    // For projectile diagram
                    initial_velocity: { type: 'number', description: 'Initial velocity in m/s (for projectile)' },
                    launch_angle: { type: 'number', description: 'Launch angle in degrees (for projectile)' },
                    // For free-body diagram
                    forces: {
                      type: 'array',
                      description: 'Array of forces (for free-body type)',
                      items: {
                        type: 'object',
                        properties: {
                          magnitude: { type: 'number' },
                          direction: { type: 'number', description: 'Angle in degrees' },
                          label: { type: 'string', description: 'Force label (e.g., "W", "N", "F")' }
                        }
                      }
                    },
                    // For triangle/geometry problems
                    height: { type: 'number', description: 'Vertical height (for triangle problems)' },
                    base: { type: 'number', description: 'Horizontal base (for triangle problems)' },
                    angle: { type: 'number', description: 'Angle in degrees (for triangle problems)' },
                    description: { type: 'string', description: 'Additional description of what the diagram represents' },
                  },
                  required: ['diagram_type'],
                },
              },
            ],
            tool_choice: 'auto',
            audio: {
              input: {
                transcription: { model: 'whisper-1', language: 'en' },
                turn_detection: {
                  type: 'server_vad',
                  threshold: 0.6,              // Higher threshold = less sensitive to quiet sounds
                  prefix_padding_ms: 500,      // More padding before speech
                  silence_duration_ms: 1500,   // Wait 1.5 seconds of silence before responding
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
  }, [instructions, voice, handleMessage, onError, updateState]);

  // Disconnect
  const disconnect = useCallback(() => {
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
