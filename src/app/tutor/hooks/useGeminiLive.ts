'use client';

/**
 * Google Gemini 2.0 Flash Multimodal Live API Hook
 *
 * Handles WebSocket connection to Google's Gemini Multimodal Live API for
 * low-latency voice conversations. Drop-in replacement for useOpenAIRealtime
 * with the same RealtimeConfig / RealtimeResult interface.
 *
 * Key differences from OpenAI Realtime:
 * - Audio input: PCM 16-bit, 16kHz (vs 24kHz for OpenAI)
 * - Audio output: PCM 16-bit, 24kHz
 * - VAD is server-side with no explicit commit needed
 * - Uses setup message instead of session.update
 * - Tool calls arrive as `toolCall` messages (not response.output_item.done)
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import type { WhiteboardCommand } from '@/lib/knowledge/types';
import { WHITEBOARD_TOOLS, toGeminiTools, mapFunctionCallToCommand } from './toolDefinitions';

// Re-export shared types so consumers can import from either hook
export type { RealtimeUsage, RealtimeConfig, RealtimeState, RealtimeResult } from './useOpenAIRealtime';

import type { RealtimeConfig, RealtimeState, RealtimeResult, RealtimeUsage } from './useOpenAIRealtime';

// Gemini voice options
export type GeminiVoice = 'Aoede' | 'Charon' | 'Fenrir' | 'Kore' | 'Puck';

// Map OpenAI voice names to Gemini equivalents (best-effort mapping)
const VOICE_MAP: Record<string, GeminiVoice> = {
  alloy: 'Kore',
  ash: 'Charon',
  ballad: 'Aoede',
  coral: 'Kore',
  echo: 'Fenrir',
  sage: 'Puck',
  shimmer: 'Aoede',
  verse: 'Charon',
};

// ── Audio helpers ───────────────────────────────────────────────────────────

// Audio context for playback at 24kHz (Gemini output sample rate)
let playbackCtx: AudioContext | null = null;

function getPlaybackContext(): AudioContext {
  if (!playbackCtx) {
    playbackCtx = new AudioContext({ sampleRate: 24000 });
  }
  return playbackCtx;
}

// Separate capture context at 16kHz for Gemini input
let captureCtx: AudioContext | null = null;

function getCaptureContext(): AudioContext {
  if (!captureCtx) {
    captureCtx = new AudioContext({ sampleRate: 16000 });
  }
  return captureCtx;
}

/** Convert base64 PCM16 to Float32Array for Web Audio API playback */
function base64ToFloat32(base64: string): Float32Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const int16 = new Int16Array(bytes.buffer);
  const float32 = new Float32Array(int16.length);
  for (let i = 0; i < int16.length; i++) {
    float32[i] = int16[i] / 32768.0;
  }
  return float32;
}

/** Convert Float32Array to base64 PCM16 for sending to Gemini */
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

/** Resample audio from source rate to target rate using linear interpolation */
function resample(input: Float32Array, srcRate: number, dstRate: number): Float32Array {
  if (srcRate === dstRate) return input;
  const ratio = srcRate / dstRate;
  const outputLength = Math.round(input.length / ratio);
  const output = new Float32Array(outputLength);
  for (let i = 0; i < outputLength; i++) {
    const srcIdx = i * ratio;
    const idx = Math.floor(srcIdx);
    const frac = srcIdx - idx;
    const a = input[idx] || 0;
    const b = input[Math.min(idx + 1, input.length - 1)] || 0;
    output[i] = a + frac * (b - a);
  }
  return output;
}

// Parse whiteboard commands from text (mirrors OpenAI hook)
function parseWhiteboardCommands(text: string): { cleanText: string; commands: WhiteboardCommand[] } {
  const commands: WhiteboardCommand[] = [];
  const cleanText = text.replace(/```whiteboard\s*([\s\S]*?)```/g, (_, content) => {
    try {
      const cmd = JSON.parse(content.trim());
      commands.push(cmd);
    } catch {
      console.warn('[GeminiLive] Failed to parse whiteboard command:', content);
    }
    return '';
  }).trim();
  return { cleanText, commands };
}

// ── Hook ────────────────────────────────────────────────────────────────────

export function useGeminiLive(config: RealtimeConfig): RealtimeResult {
  const {
    instructions,
    voice = 'alloy',
    onTranscriptUpdate,
    onWhiteboardCommand,
    onResponseDone,
    onError,
    onStateChange,
  } = config;

  const [state, setState] = useState<RealtimeState>('disconnected');
  const [error, setError] = useState<Error | null>(null);

  // Keep instructions in a ref so connect() always gets the latest value
  const instructionsRef = useRef(instructions);
  instructionsRef.current = instructions;

  const wsRef = useRef<WebSocket | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const audioQueueRef = useRef<Float32Array[]>([]);
  const isPlayingRef = useRef(false);
  const currentResponseTextRef = useRef('');
  const playbackSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const shouldListenRef = useRef(false);
  const startListeningRef = useRef<() => void>(() => {});
  // Track cumulative usage across the session
  const usageRef = useRef<RealtimeUsage>({
    totalTokens: 0,
    inputTokens: 0,
    outputTokens: 0,
    inputTextTokens: 0,
    inputAudioTokens: 0,
    outputTextTokens: 0,
    outputAudioTokens: 0,
  });
  // Whether setup acknowledgement has been received
  const setupCompleteRef = useRef(false);

  // Update state and notify parent
  const updateState = useCallback((newState: RealtimeState) => {
    setState(newState);
    onStateChange?.(newState);
  }, [onStateChange]);

  // ── Audio playback queue ──────────────────────────────────────────────────

  const playNextAudio = useCallback(() => {
    if (audioQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      if (audioProcessorRef.current && mediaStreamRef.current) {
        updateState('listening');
      } else if (shouldListenRef.current) {
        updateState('listening');
        startListeningRef.current();
      } else {
        updateState('connected');
      }
      return;
    }

    isPlayingRef.current = true;
    updateState('speaking');

    const ctx = getPlaybackContext();
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

  const queueAudio = useCallback((base64Audio: string) => {
    const float32 = base64ToFloat32(base64Audio);
    audioQueueRef.current.push(float32);
    if (!isPlayingRef.current) {
      playNextAudio();
    }
  }, [playNextAudio]);

  // ── WebSocket message handler ─────────────────────────────────────────────

  const handleMessage = useCallback(async (event: MessageEvent) => {
    try {
      // Gemini may send Blob (binary) or string messages
      let raw = event.data;
      if (raw instanceof Blob) {
        raw = await raw.text();
      }
      const data = JSON.parse(raw);

      // Log non-audio messages for debugging
      if (!data.serverContent?.modelTurn?.parts?.some((p: { inlineData?: unknown }) => p.inlineData)) {
        console.log('[GeminiLive] Message:', JSON.stringify(data).slice(0, 300));
      }

      // ── Setup acknowledgement ──
      if (data.setupComplete) {
        console.log('[GeminiLive] Setup complete');
        setupCompleteRef.current = true;
        updateState('connected');
        return;
      }

      // ── Server content (text + audio) ──
      if (data.serverContent) {
        const serverContent = data.serverContent;

        // Turn complete
        if (serverContent.turnComplete) {
          console.log('[GeminiLive] Turn complete');
          currentResponseTextRef.current = '';

          // Report accumulated usage
          onResponseDone?.(usageRef.current);

          // Resume listening if no audio is playing
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
          return;
        }

        // Interrupted — server signals it was cut off
        if (serverContent.interrupted) {
          console.log('[GeminiLive] Server interrupted');
          return;
        }

        // Model turn with parts
        const parts = serverContent.modelTurn?.parts;
        if (Array.isArray(parts)) {
          for (const part of parts) {
            // Audio part
            if (part.inlineData) {
              const { mimeType, data: audioData } = part.inlineData;
              if (mimeType?.startsWith('audio/') && audioData) {
                console.log('[GeminiLive] Audio chunk received, size:', audioData.length);
                queueAudio(audioData);
              }
            }

            // Text part — Gemini 2.5 sends "thinking" text (internal reasoning)
            // which should NOT be shown to the user as transcript.
            // However, thinking text may describe tool calls the model intends
            // to make but doesn't execute as formal toolCall messages.
            if (typeof part.text === 'string') {
              const text = part.text;

              // All text from native audio model is thinking/reasoning — not spoken
              // The spoken content comes as audio, not text
              console.log('[GeminiLive] Thinking:', text.slice(0, 100));

              // Update state to show user the model is thinking
              if (state !== 'speaking') {
                updateState('processing');
              }
            }
          }
        }

        // Usage metadata (Gemini reports this in serverContent)
        if (serverContent.usageMetadata) {
          const um = serverContent.usageMetadata;
          usageRef.current = {
            totalTokens: (um.promptTokenCount || 0) + (um.candidatesTokenCount || 0),
            inputTokens: um.promptTokenCount || 0,
            outputTokens: um.candidatesTokenCount || 0,
            // Gemini doesn't break down text vs audio tokens individually
            inputTextTokens: um.promptTokenCount || 0,
            inputAudioTokens: 0,
            outputTextTokens: um.candidatesTokenCount || 0,
            outputAudioTokens: 0,
          };
        }

        return;
      }

      // ── Tool calls ──
      if (data.toolCall) {
        const functionCalls = data.toolCall.functionCalls;
        if (Array.isArray(functionCalls)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const functionResponses: any[] = [];

          for (const call of functionCalls) {
            const funcName: string = call.name;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const funcArgs: Record<string, any> = call.args || {};
            const callId: string = call.id;

            console.log('[GeminiLive] Function call:', funcName, funcArgs);

            const command = mapFunctionCallToCommand(funcName, funcArgs);

            if (command) {
              onWhiteboardCommand?.([command]);
            }

            functionResponses.push({
              id: callId,
              response: {
                result: command
                  ? `Displayed ${funcName.replace('show_', '')} on whiteboard`
                  : 'Unknown function',
              },
            });
          }

          // Send tool responses back to Gemini
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
              toolResponse: { functionResponses },
            }));
          }
        }
        return;
      }

      // ── Tool call cancellation ──
      if (data.toolCallCancellation) {
        console.log('[GeminiLive] Tool call cancelled:', data.toolCallCancellation.ids);
        return;
      }

      // ── Input transcription (user's speech) ──
      if (data.inputTranscription) {
        const text = data.inputTranscription.text || data.inputTranscription;
        if (typeof text === 'string' && text.trim()) {
          console.log('[GeminiLive] User transcription:', text);
          onTranscriptUpdate?.('user', text, true);
        }
        return;
      }

      // ── Output transcription (model's speech) ──
      if (data.outputTranscription) {
        const text = data.outputTranscription.text || data.outputTranscription;
        if (typeof text === 'string' && text.trim()) {
          console.log('[GeminiLive] Tutor transcription:', text);
          currentResponseTextRef.current = text;
          onTranscriptUpdate?.('assistant', text, true);
        }
        return;
      }

      // Log anything we don't explicitly handle
      console.log('[GeminiLive] Unhandled message:', JSON.stringify(data).substring(0, 200));
    } catch (err) {
      console.error('[GeminiLive] Failed to parse message:', err);
    }
  }, [updateState, onTranscriptUpdate, onWhiteboardCommand, onResponseDone, queueAudio]);

  // ── Connect ───────────────────────────────────────────────────────────────

  const connect = useCallback(async () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('[GeminiLive] Already connected');
      return;
    }

    updateState('connecting');
    setError(null);
    setupCompleteRef.current = false;

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('NEXT_PUBLIC_GEMINI_API_KEY is not configured');
      }

      const geminiVoice: GeminiVoice = VOICE_MAP[voice] || 'Kore';

      const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${apiKey}`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('[GeminiLive] WebSocket connected, sending setup...');

        // Send setup message (must be the first message)
        // Start without tools first — add them after connection is verified
        const setupMsg: Record<string, unknown> = {
          setup: {
            model: 'models/gemini-2.5-flash-native-audio-latest',
            generationConfig: {
              responseModalities: ['AUDIO'],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: {
                    voiceName: geminiVoice,
                  },
                },
              },
            },
            systemInstruction: {
              parts: [{ text: instructionsRef.current }],
            },
            tools: toGeminiTools(WHITEBOARD_TOOLS),
          },
        };
        console.log('[GeminiLive] Sending setup:', JSON.stringify(setupMsg).slice(0, 500));
        ws.send(JSON.stringify(setupMsg));
      };

      ws.onmessage = handleMessage;

      ws.onerror = (event) => {
        console.error('[GeminiLive] WebSocket error:', event);
        const err = new Error('WebSocket connection error');
        setError(err);
        onError?.(err);
        updateState('error');
      };

      ws.onclose = (event) => {
        console.log('[GeminiLive] WebSocket closed:', event.code, event.reason);
        wsRef.current = null;
        setupCompleteRef.current = false;
        updateState('disconnected');
      };

      wsRef.current = ws;
    } catch (err) {
      console.error('[GeminiLive] Connection error:', err);
      const error = err instanceof Error ? err : new Error('Connection failed');
      setError(error);
      onError?.(error);
      updateState('error');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voice, handleMessage, onError, updateState]);

  // ── Disconnect ────────────────────────────────────────────────────────────

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
    setupCompleteRef.current = false;

    updateState('disconnected');
  }, [updateState]);

  // ── Start listening (microphone capture) ──────────────────────────────────

  const startListening = useCallback(async () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.error('[GeminiLive] Not connected');
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
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      mediaStreamRef.current = stream;

      // Use the 16kHz capture context for Gemini's expected input rate
      const ctx = getCaptureContext();
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      const source = ctx.createMediaStreamSource(stream);
      const processor = ctx.createScriptProcessor(4096, 1, 1);

      processor.onaudioprocess = (e) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

        const inputData = e.inputBuffer.getChannelData(0);

        // Copy the data (the buffer gets reused)
        const copy = new Float32Array(inputData.length);
        copy.set(inputData);

        // Resample from capture context sample rate to 16kHz if needed
        const resampled = ctx.sampleRate !== 16000
          ? resample(copy, ctx.sampleRate, 16000)
          : copy;

        const base64Audio = float32ToBase64PCM16(resampled);

        try {
          // Gemini uses realtimeInput.mediaChunks format
          wsRef.current.send(JSON.stringify({
            realtimeInput: {
              mediaChunks: [{
                mimeType: 'audio/pcm;rate=16000',
                data: base64Audio,
              }],
            },
          }));
        } catch (sendErr) {
          console.error('[GeminiLive] Audio send error:', sendErr);
        }
      };

      source.connect(processor);
      processor.connect(ctx.destination);
      audioProcessorRef.current = processor;

      updateState('listening');
      console.log('[GeminiLive] Microphone started (16kHz)');
    } catch (err) {
      console.error('[GeminiLive] Microphone error:', err);
      const error = err instanceof Error ? err : new Error('Microphone access failed');
      setError(error);
      onError?.(error);
    }
  }, [onError, updateState]);

  // Keep ref in sync for playNextAudio to call
  startListeningRef.current = startListening;

  // ── Stop listening ────────────────────────────────────────────────────────

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

    // Gemini handles VAD server-side — no explicit commit needed.
    // The server will detect end of speech and respond automatically.
    updateState('processing');
  }, [updateState]);

  // ── Interrupt playback ────────────────────────────────────────────────────

  const interrupt = useCallback(() => {
    // Stop playback
    if (playbackSourceRef.current) {
      try {
        playbackSourceRef.current.stop();
      } catch { /* ignore */ }
      playbackSourceRef.current = null;
    }
    audioQueueRef.current = [];
    isPlayingRef.current = false;

    updateState('connected');
  }, [updateState]);

  // ── Pause ─────────────────────────────────────────────────────────────────

  const pause = useCallback(() => {
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

    // Stop playback
    if (playbackSourceRef.current) {
      try { playbackSourceRef.current.stop(); } catch { /* ignore */ }
      playbackSourceRef.current = null;
    }
    audioQueueRef.current = [];
    isPlayingRef.current = false;

    updateState('connected');
  }, [updateState]);

  // ── Send text message ─────────────────────────────────────────────────────

  const sendTextMessage = useCallback((text: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.error('[GeminiLive] Not connected');
      return;
    }

    shouldListenRef.current = true;

    // Gemini Live accepts text via clientContent
    wsRef.current.send(JSON.stringify({
      clientContent: {
        turns: [{
          role: 'user',
          parts: [{ text }],
        }],
        turnComplete: true,
      },
    }));

    updateState('processing');
  }, [updateState]);

  // ── Inject context ────────────────────────────────────────────────────────

  const injectContext = useCallback((contextText: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    // Send as a user message marked as system context (same pattern as OpenAI hook)
    wsRef.current.send(JSON.stringify({
      clientContent: {
        turns: [{
          role: 'user',
          parts: [{
            text: `[SYSTEM CONTEXT REMINDER — DO NOT READ ALOUD OR ACKNOWLEDGE THIS MESSAGE]\n${contextText}`,
          }],
        }],
        turnComplete: true,
      },
    }));

    console.log('[GeminiLive] Context injected:', contextText.substring(0, 100));
  }, []);

  // ── Cleanup on unmount ────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  // ── Return ────────────────────────────────────────────────────────────────

  return {
    state,
    isConnected: state !== 'disconnected' && state !== 'connecting' && state !== 'error',
    isSpeaking: state === 'speaking',
    error,
    connect,
    // Gemini's connection flow doesn't have a separate token-mint step, so
    // prefetchToken is a no-op here — provided only to satisfy the shared
    // RealtimeResult shape so the UI layer can call it uniformly.
    prefetchToken: async () => null,
    disconnect,
    startListening,
    stopListening,
    muteInput: stopListening, // Gemini handles VAD server-side; stop listening is equivalent
    interrupt,
    pause,
    sendTextMessage,
    injectContext,
  };
}
