'use client';

/**
 * Audio Playback Hook
 *
 * Handles streaming audio playback for TTS using Web Audio API.
 * Supports interruption and queue management.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import type { VoiceId } from '@/lib/tutor/types';

export type PlaybackState = 'idle' | 'loading' | 'playing' | 'paused';

export interface AudioPlaybackOptions {
  voiceId?: VoiceId;
  speed?: number;
  onPlaybackStart?: () => void;
  onPlaybackEnd?: () => void;
  onError?: (error: Error) => void;
}

export interface AudioPlaybackResult {
  state: PlaybackState;
  speak: (text: string) => Promise<void>;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  setVoice: (voiceId: VoiceId) => void;
  setSpeed: (speed: number) => void;
}

const SAMPLE_RATE = 24000; // Cartesia outputs 24kHz

export function useAudioPlayback(options: AudioPlaybackOptions = {}): AudioPlaybackResult {
  const {
    voiceId: initialVoiceId = 'female-1',
    speed: initialSpeed = 1.0,
    onPlaybackStart,
    onPlaybackEnd,
    onError,
  } = options;

  const [state, setState] = useState<PlaybackState>('idle');
  const voiceIdRef = useRef<VoiceId>(initialVoiceId);
  const speedRef = useRef<number>(initialSpeed);

  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const scheduledSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isPlayingRef = useRef<boolean>(false);

  // Initialize audio context lazily
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      audioContextRef.current = new AudioContext({ sampleRate: SAMPLE_RATE });
    }
    return audioContextRef.current;
  }, []);

  // Stop current playback
  const stop = useCallback(() => {
    // Abort any pending fetch
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // Stop all scheduled sources
    scheduledSourcesRef.current.forEach(source => {
      try {
        source.stop();
        source.disconnect();
      } catch {
        // Ignore errors if already stopped
      }
    });
    scheduledSourcesRef.current = [];

    // Stop current audio source
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop();
      } catch {
        // Ignore errors if already stopped
      }
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }

    isPlayingRef.current = false;
    setState('idle');
  }, []);

  // Speak text using TTS with chunked streaming playback
  const speak = useCallback(async (text: string) => {
    if (!text.trim()) return;

    // Stop any current playback
    stop();

    setState('loading');
    isPlayingRef.current = true;

    // Create abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      // Fetch audio from TTS API
      const response = await fetch('/api/tutor/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voiceId: voiceIdRef.current,
          speed: speedRef.current,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`TTS request failed: ${response.status}`);
      }

      // Get audio context ready
      const audioContext = getAudioContext();
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      // Stream and play audio chunks
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      let nextPlayTime = audioContext.currentTime;
      let hasStartedPlaying = false;
      const CHUNK_DURATION = 0.5; // seconds per chunk
      const SAMPLES_PER_CHUNK = SAMPLE_RATE * CHUNK_DURATION;
      const BYTES_PER_CHUNK = SAMPLES_PER_CHUNK * 4; // 4 bytes per float32
      let leftoverBytes = new Uint8Array(0);
      scheduledSourcesRef.current = [];

      const playChunk = (chunkData: Float32Array) => {
        if (!isPlayingRef.current) return;

        const audioBuffer = audioContext.createBuffer(1, chunkData.length, SAMPLE_RATE);
        audioBuffer.getChannelData(0).set(chunkData);

        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);

        // Schedule this chunk to play after the previous one
        const startTime = Math.max(nextPlayTime, audioContext.currentTime);
        source.start(startTime);
        scheduledSourcesRef.current.push(source);

        nextPlayTime = startTime + audioBuffer.duration;

        if (!hasStartedPlaying) {
          hasStartedPlaying = true;
          setState('playing');
          onPlaybackStart?.();
        }
      };

      // Read and play chunks as they arrive
      while (true) {
        const { done, value } = await reader.read();

        if (!isPlayingRef.current) {
          reader.cancel();
          scheduledSourcesRef.current.forEach(s => { try { s.stop(); } catch {} });
          return;
        }

        if (value) {
          // Combine with leftover bytes
          const combined = new Uint8Array(leftoverBytes.length + value.length);
          combined.set(leftoverBytes);
          combined.set(value, leftoverBytes.length);

          // Process complete chunks
          let offset = 0;
          while (offset + BYTES_PER_CHUNK <= combined.length) {
            const chunkBytes = combined.slice(offset, offset + BYTES_PER_CHUNK);
            const float32Data = new Float32Array(chunkBytes.buffer, chunkBytes.byteOffset, chunkBytes.length / 4);
            playChunk(float32Data);
            offset += BYTES_PER_CHUNK;
          }

          // Save leftover bytes for next iteration
          leftoverBytes = combined.slice(offset);
        }

        if (done) break;
      }

      // Play any remaining audio
      if (leftoverBytes.length > 0 && isPlayingRef.current) {
        // Ensure we have a multiple of 4 bytes (float32)
        const validLength = Math.floor(leftoverBytes.length / 4) * 4;
        if (validLength > 0) {
          const float32Data = new Float32Array(leftoverBytes.buffer, leftoverBytes.byteOffset, validLength / 4);
          playChunk(float32Data);
        }
      }

      // Wait for last chunk to finish
      if (scheduledSourcesRef.current.length > 0) {
        const lastSource = scheduledSourcesRef.current[scheduledSourcesRef.current.length - 1];
        lastSource.onended = () => {
          if (isPlayingRef.current) {
            isPlayingRef.current = false;
            setState('idle');
            onPlaybackEnd?.();
          }
        };
        sourceNodeRef.current = lastSource;
      } else {
        isPlayingRef.current = false;
        setState('idle');
        onPlaybackEnd?.();
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // Request was aborted (intentional)
        return;
      }

      console.error('[AudioPlayback] Error:', error);
      const err = error instanceof Error ? error : new Error('Playback failed');
      onError?.(err);
      setState('idle');
      isPlayingRef.current = false;
    }
  }, [stop, getAudioContext, onPlaybackStart, onPlaybackEnd, onError]);

  // Pause playback (not fully supported with streaming, so we just stop)
  const pause = useCallback(() => {
    const context = audioContextRef.current;
    if (context && state === 'playing') {
      context.suspend();
      setState('paused');
    }
  }, [state]);

  // Resume playback
  const resume = useCallback(() => {
    const context = audioContextRef.current;
    if (context && state === 'paused') {
      context.resume();
      setState('playing');
    }
  }, [state]);

  // Set voice
  const setVoice = useCallback((voiceId: VoiceId) => {
    voiceIdRef.current = voiceId;
  }, []);

  // Set speed
  const setSpeed = useCallback((speed: number) => {
    speedRef.current = Math.max(0.5, Math.min(2.0, speed));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, [stop]);

  return {
    state,
    speak,
    stop,
    pause,
    resume,
    setVoice,
    setSpeed,
  };
}

/**
 * Hook for managing a queue of utterances
 */
export interface UseUtteranceQueueResult {
  state: PlaybackState;
  enqueue: (text: string) => void;
  clear: () => void;
  stop: () => void;
  queueLength: number;
}

export function useUtteranceQueue(options: AudioPlaybackOptions = {}): UseUtteranceQueueResult {
  const queueRef = useRef<string[]>([]);
  const [queueLength, setQueueLength] = useState(0);
  const isProcessingRef = useRef(false);

  const playback = useAudioPlayback({
    ...options,
    onPlaybackEnd: () => {
      options.onPlaybackEnd?.();
      // Process next item in queue
      processQueue();
    },
  });

  const processQueue = useCallback(() => {
    if (queueRef.current.length === 0) {
      isProcessingRef.current = false;
      return;
    }

    const text = queueRef.current.shift()!;
    setQueueLength(queueRef.current.length);
    playback.speak(text);
  }, [playback]);

  const enqueue = useCallback((text: string) => {
    queueRef.current.push(text);
    setQueueLength(queueRef.current.length);

    if (!isProcessingRef.current) {
      isProcessingRef.current = true;
      processQueue();
    }
  }, [processQueue]);

  const clear = useCallback(() => {
    queueRef.current = [];
    setQueueLength(0);
    playback.stop();
    isProcessingRef.current = false;
  }, [playback]);

  const stop = useCallback(() => {
    clear();
  }, [clear]);

  return {
    state: playback.state,
    enqueue,
    clear,
    stop,
    queueLength,
  };
}
