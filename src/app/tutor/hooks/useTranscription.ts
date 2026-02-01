'use client';

/**
 * Transcription Hook
 *
 * Handles speech-to-text transcription by recording audio
 * and sending it to the STT API when stopped.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { useAudioCapture, float32ToInt16, int16ToArrayBuffer } from './useAudioCapture';

export interface TranscriptionOptions {
  onPartialTranscript?: (text: string) => void;
  onError?: (error: Error) => void;
}

export interface TranscriptionResult {
  isListening: boolean;
  isTranscribing: boolean;
  error: Error | null;
  startListening: () => Promise<void>;
  stopListening: () => Promise<string>;
  audioLevel: number;
}

export function useTranscription(options: TranscriptionOptions = {}): TranscriptionResult {
  const { onError } = options;

  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const audioBufferRef = useRef<Float32Array[]>([]);
  const audioLevelIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Handle audio data from microphone
  const handleAudioData = useCallback((data: Float32Array) => {
    audioBufferRef.current.push(data);

    // Calculate RMS for audio level display
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum += data[i] * data[i];
    }
    const rms = Math.sqrt(sum / data.length);
    setAudioLevel(Math.min(rms * 10, 1)); // Scale for visibility

    // Debug: log buffer growth
    if (audioBufferRef.current.length % 25 === 0) {
      const totalSamples = audioBufferRef.current.reduce((sum, chunk) => sum + chunk.length, 0);
      console.log(`[Transcription] Buffer: ${audioBufferRef.current.length} chunks, ${totalSamples} samples (${(totalSamples / 16000).toFixed(1)}s)`);
    }
  }, []);

  const audioCapture = useAudioCapture({
    sampleRate: 16000,
    onAudioData: handleAudioData,
    onError: (err) => {
      setError(err);
      onError?.(err);
    },
  });

  // Start listening
  const startListening = useCallback(async () => {
    setError(null);
    audioBufferRef.current = [];

    try {
      await audioCapture.startRecording();
      setIsListening(true);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to start recording');
      setError(error);
      onError?.(error);
    }
  }, [audioCapture, onError]);

  // Stop listening and transcribe
  const stopListening = useCallback(async (): Promise<string> => {
    console.log('[Transcription] Stop listening called');
    setIsListening(false);
    audioCapture.stopRecording();

    // Get all recorded audio
    const chunks = audioBufferRef.current;
    audioBufferRef.current = [];

    console.log(`[Transcription] Captured ${chunks.length} chunks`);

    if (chunks.length === 0) {
      console.log('[Transcription] No chunks captured!');
      return '';
    }

    // Combine all audio chunks
    const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
    const durationSeconds = totalLength / 16000;
    console.log(`[Transcription] Total: ${totalLength} samples (${durationSeconds.toFixed(2)}s)`);

    // Skip if too short (less than 0.3 seconds at 16kHz)
    if (totalLength < 4800) {
      console.log('[Transcription] Audio too short, skipping');
      return '';
    }

    const combinedFloat32 = new Float32Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      combinedFloat32.set(chunk, offset);
      offset += chunk.length;
    }

    setIsTranscribing(true);

    try {
      // Convert to PCM16 for Deepgram
      const int16Data = float32ToInt16(combinedFloat32);
      const audioBuffer = int16ToArrayBuffer(int16Data);

      // Send to STT API
      console.log(`[Transcription] Sending ${audioBuffer.byteLength} bytes to STT API`);
      const response = await fetch('/api/tutor/stt', {
        method: 'POST',
        headers: { 'Content-Type': 'audio/pcm' },
        body: audioBuffer,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('[Transcription] STT API error:', errorData);
        throw new Error(errorData.error || `STT request failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('[Transcription] STT result:', result);
      return result.text?.trim() || '';
    } catch (err) {
      console.error('[Transcription] Error:', err);
      const error = err instanceof Error ? err : new Error('Transcription failed');
      setError(error);
      onError?.(error);
      return '';
    } finally {
      setIsTranscribing(false);
      setAudioLevel(0);
    }
  }, [audioCapture, onError]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (audioLevelIntervalRef.current) {
        clearInterval(audioLevelIntervalRef.current);
      }
    };
  }, []);

  return {
    isListening,
    isTranscribing,
    error,
    startListening,
    stopListening,
    audioLevel,
  };
}
