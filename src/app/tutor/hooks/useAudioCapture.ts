'use client';

/**
 * Audio Capture Hook
 *
 * Handles microphone access, audio recording, and streaming
 * for real-time speech-to-text transcription.
 */

import { useState, useCallback, useRef, useEffect } from 'react';

export type AudioCaptureState = 'idle' | 'requesting' | 'recording' | 'error';

export interface AudioCaptureOptions {
  sampleRate?: number;
  onAudioData?: (data: Float32Array) => void;
  onError?: (error: Error) => void;
  silenceThreshold?: number;
  silenceTimeout?: number;
}

export interface AudioCaptureResult {
  state: AudioCaptureState;
  error: Error | null;
  isSupported: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  getAudioLevel: () => number;
}

const DEFAULT_SAMPLE_RATE = 16000; // Deepgram expects 16kHz

export function useAudioCapture(options: AudioCaptureOptions = {}): AudioCaptureResult {
  const {
    sampleRate = DEFAULT_SAMPLE_RATE,
    onAudioData,
    onError,
  } = options;

  const [state, setState] = useState<AudioCaptureState>('idle');
  const [error, setError] = useState<Error | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioLevelRef = useRef<number>(0);

  // Check if audio capture is supported
  const isSupported = typeof window !== 'undefined' &&
    'mediaDevices' in navigator &&
    'getUserMedia' in navigator.mediaDevices;

  // Cleanup function
  const cleanup = useCallback(() => {
    if (workletNodeRef.current) {
      workletNodeRef.current.disconnect();
      workletNodeRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;
  }, []);

  // Start recording
  const startRecording = useCallback(async () => {
    if (!isSupported) {
      const err = new Error('Audio capture not supported in this browser');
      setError(err);
      setState('error');
      onError?.(err);
      return;
    }

    setState('requesting');
    setError(null);

    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      mediaStreamRef.current = stream;

      // Create audio context
      const audioContext = new AudioContext({ sampleRate });
      audioContextRef.current = audioContext;

      // Create source from microphone
      const source = audioContext.createMediaStreamSource(stream);

      // Create analyser for audio level metering
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Use ScriptProcessor for audio data (AudioWorklet requires separate file)
      // ScriptProcessor is deprecated but more compatible
      const bufferSize = 4096;
      const scriptProcessor = audioContext.createScriptProcessor(bufferSize, 1, 1);

      let chunkCount = 0;
      scriptProcessor.onaudioprocess = (event) => {
        const inputData = event.inputBuffer.getChannelData(0);
        chunkCount++;

        // Calculate audio level
        let sum = 0;
        for (let i = 0; i < inputData.length; i++) {
          sum += inputData[i] * inputData[i];
        }
        const rms = Math.sqrt(sum / inputData.length);
        audioLevelRef.current = rms;

        // Debug logging every 25 chunks (~1 second)
        if (chunkCount % 25 === 0) {
          console.log(`[AudioCapture] Chunk #${chunkCount}, RMS: ${rms.toFixed(6)}, Samples: ${inputData.length}`);
        }

        // Send audio data
        if (onAudioData) {
          // Copy the data since the buffer will be reused
          const dataCopy = new Float32Array(inputData.length);
          dataCopy.set(inputData);
          onAudioData(dataCopy);
        }
      };

      source.connect(scriptProcessor);
      // Round-6f: zero-gain sink — a ScriptProcessor wired straight to the
      // destination is a latent mic→speaker path (WebKit interruption bug
      // class; see useOpenAIRealtime's identical fix for the full story).
      const silentSink = audioContext.createGain();
      silentSink.gain.value = 0;
      scriptProcessor.connect(silentSink);
      silentSink.connect(audioContext.destination);

      // Store reference for cleanup (reusing workletNodeRef for script processor)
      workletNodeRef.current = scriptProcessor as unknown as AudioWorkletNode;

      setState('recording');
    } catch (err) {
      console.error('[AudioCapture] Error:', err);
      const error = err instanceof Error ? err : new Error('Failed to access microphone');
      setError(error);
      setState('error');
      onError?.(error);
      cleanup();
    }
  }, [isSupported, sampleRate, onAudioData, onError, cleanup]);

  // Stop recording
  const stopRecording = useCallback(() => {
    cleanup();
    setState('idle');
    audioLevelRef.current = 0;
  }, [cleanup]);

  // Get current audio level (0-1)
  const getAudioLevel = useCallback(() => {
    return audioLevelRef.current;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    state,
    error,
    isSupported,
    startRecording,
    stopRecording,
    getAudioLevel,
  };
}

/**
 * Convert Float32Array audio to Int16Array (PCM16)
 * Required for Deepgram
 */
export function float32ToInt16(float32Array: Float32Array): Int16Array {
  const int16Array = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    // Clamp and convert
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return int16Array;
}

/**
 * Convert Int16Array to ArrayBuffer for sending over network
 */
export function int16ToArrayBuffer(int16Array: Int16Array): ArrayBuffer {
  // Create a new ArrayBuffer and copy the data to avoid SharedArrayBuffer issues
  const buffer = new ArrayBuffer(int16Array.byteLength);
  const view = new Int16Array(buffer);
  view.set(int16Array);
  return buffer;
}
