'use client';

/**
 * useVoice Hook
 *
 * Provides audio recording and playback capabilities for voice tutoring.
 * Handles microphone access, audio streaming, and playback.
 */

import { useState, useCallback, useRef, useEffect } from 'react';

export type VoiceState = 'idle' | 'recording' | 'playing' | 'processing';

export interface UseVoiceOptions {
  onAudioData?: (data: Float32Array) => void;
  onRecordingComplete?: (blob: Blob) => void;
  sampleRate?: number;
}

export interface UseVoiceReturn {
  state: VoiceState;
  isRecording: boolean;
  isPlaying: boolean;
  error: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  playAudio: (audioData: ArrayBuffer) => Promise<void>;
  stopPlayback: () => void;
  hasPermission: boolean;
  requestPermission: () => Promise<boolean>;
}

export function useVoice(options: UseVoiceOptions = {}): UseVoiceReturn {
  const { onAudioData, onRecordingComplete, sampleRate = 16000 } = options;

  const [state, setState] = useState<VoiceState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const playbackSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Request microphone permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop tracks immediately - we just wanted to check permission
      stream.getTracks().forEach((track) => track.stop());
      setHasPermission(true);
      setError(null);
      return true;
    } catch (err) {
      console.error('Microphone permission denied:', err);
      setError('Microphone permission denied');
      setHasPermission(false);
      return false;
    }
  }, []);

  // Start recording
  const startRecording = useCallback(async () => {
    try {
      setError(null);

      // Get audio stream
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
      setHasPermission(true);

      // Create audio context for processing
      audioContextRef.current = new AudioContext({ sampleRate });
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);

      // Create processor for real-time audio data
      processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);
      processorRef.current.onaudioprocess = (event) => {
        if (onAudioData) {
          const audioData = event.inputBuffer.getChannelData(0);
          onAudioData(new Float32Array(audioData));
        }
      };

      sourceRef.current.connect(processorRef.current);
      processorRef.current.connect(audioContextRef.current.destination);

      // Also record as blob for backup/fallback
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });

      audioChunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        if (onRecordingComplete) {
          onRecordingComplete(blob);
        }
      };

      mediaRecorderRef.current.start(100); // Collect data every 100ms
      setState('recording');
    } catch (err) {
      console.error('Failed to start recording:', err);
      setError('Failed to start recording');
      setState('idle');
    }
  }, [onAudioData, onRecordingComplete, sampleRate]);

  // Stop recording
  const stopRecording = useCallback(() => {
    // Stop media recorder
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }

    // Disconnect processor
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }

    // Disconnect source
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }

    // Close audio context
    if (audioContextRef.current?.state !== 'closed') {
      audioContextRef.current?.close();
      audioContextRef.current = null;
    }

    // Stop all tracks
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    setState('idle');
  }, []);

  // Play audio from ArrayBuffer
  const playAudio = useCallback(async (audioData: ArrayBuffer) => {
    try {
      setState('playing');

      // Create audio context if needed
      if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        audioContextRef.current = new AudioContext();
      }

      // Resume context if suspended
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      // Decode audio data
      const audioBuffer = await audioContextRef.current.decodeAudioData(
        audioData.slice(0) // Clone the buffer
      );

      // Create source and play
      playbackSourceRef.current = audioContextRef.current.createBufferSource();
      playbackSourceRef.current.buffer = audioBuffer;
      playbackSourceRef.current.connect(audioContextRef.current.destination);

      playbackSourceRef.current.onended = () => {
        setState('idle');
        playbackSourceRef.current = null;
      };

      playbackSourceRef.current.start();
    } catch (err) {
      console.error('Failed to play audio:', err);
      setError('Failed to play audio');
      setState('idle');
    }
  }, []);

  // Stop playback
  const stopPlayback = useCallback(() => {
    if (playbackSourceRef.current) {
      playbackSourceRef.current.stop();
      playbackSourceRef.current = null;
    }
    setState('idle');
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecording();
      stopPlayback();
    };
  }, [stopRecording, stopPlayback]);

  return {
    state,
    isRecording: state === 'recording',
    isPlaying: state === 'playing',
    error,
    startRecording,
    stopRecording,
    playAudio,
    stopPlayback,
    hasPermission,
    requestPermission,
  };
}
