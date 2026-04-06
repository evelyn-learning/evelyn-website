'use client';

import { useRef, useCallback, useEffect } from 'react';

interface UseAudioRecorderConfig {
  sessionId: string;
  enabled: boolean;
  flushIntervalMs?: number; // default 30000
}

interface UseAudioRecorderResult {
  pushStudentChunk: (float32: Float32Array) => void;
  pushTutorChunk: (float32: Float32Array) => void;
  flush: () => Promise<void>;
  finalize: () => Promise<void>;
}

function float32ToPCM16Base64(chunks: Float32Array[]): string {
  // Calculate total length
  let totalLength = 0;
  for (const chunk of chunks) totalLength += chunk.length;
  if (totalLength === 0) return '';

  // Convert to int16
  const int16 = new Int16Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    for (let i = 0; i < chunk.length; i++) {
      const s = Math.max(-1, Math.min(1, chunk[i]));
      int16[offset++] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
  }

  // Convert to base64
  const bytes = new Uint8Array(int16.buffer);
  let binary = '';
  // Process in chunks to avoid call stack overflow with large arrays
  const CHUNK_SIZE = 32768;
  for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
    const slice = bytes.subarray(i, Math.min(i + CHUNK_SIZE, bytes.length));
    for (let j = 0; j < slice.length; j++) {
      binary += String.fromCharCode(slice[j]);
    }
  }
  return btoa(binary);
}

export function useAudioRecorder({
  sessionId,
  enabled,
  flushIntervalMs = 30000,
}: UseAudioRecorderConfig): UseAudioRecorderResult {
  const studentBufferRef = useRef<Float32Array[]>([]);
  const tutorBufferRef = useRef<{ data: Float32Array; offsetMs: number }[]>([]);
  const studentChunkIndexRef = useRef(0);
  const tutorChunkIndexRef = useRef(0);
  const flushingRef = useRef(false);
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;
  const sessionIdRef = useRef(sessionId);
  sessionIdRef.current = sessionId;
  // Session start is set when the first student audio chunk arrives (= mic starts recording)
  // This ensures tutor offsets are aligned with the student track
  const sessionStartRef = useRef(0);
  // Track how many tutor samples have been written so far (to calculate silence gaps)
  const tutorSamplesWrittenRef = useRef(0);

  const sendChunk = useCallback(async (
    role: 'student' | 'tutor',
    audio: string,
    chunkIndex: number,
    finalize: boolean,
  ) => {
    try {
      await fetch('/api/tutor/session-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          role,
          chunkIndex,
          audio,
          finalize,
        }),
      });
    } catch (err) {
      console.error(`[AudioRecorder] Failed to send ${role} chunk ${chunkIndex}:`, err);
    }
  }, []);

  const flush = useCallback(async () => {
    if (!enabledRef.current || flushingRef.current) return;
    flushingRef.current = true;

    try {
      const promises: Promise<void>[] = [];

      // Flush student buffer (continuous mic — already time-aligned)
      if (studentBufferRef.current.length > 0) {
        const base64 = float32ToPCM16Base64(studentBufferRef.current);
        studentBufferRef.current = [];
        if (base64) {
          promises.push(sendChunk('student', base64, studentChunkIndexRef.current++, false));
        }
      }

      // Flush tutor buffer — insert silence gaps to time-align with session
      if (tutorBufferRef.current.length > 0) {
        const chunks = tutorBufferRef.current;
        tutorBufferRef.current = [];

        // Build time-aligned tutor audio: for each chunk, calculate how much
        // silence is needed before it based on its session offset
        const alignedChunks: Float32Array[] = [];
        for (const chunk of chunks) {
          // How many samples should exist at this point in the session
          const targetSampleOffset = Math.floor((chunk.offsetMs / 1000) * 24000);
          const silenceSamples = targetSampleOffset - tutorSamplesWrittenRef.current;

          if (silenceSamples > 0) {
            // Insert silence gap
            alignedChunks.push(new Float32Array(silenceSamples)); // zeros = silence
            tutorSamplesWrittenRef.current += silenceSamples;
          }

          alignedChunks.push(chunk.data);
          tutorSamplesWrittenRef.current += chunk.data.length;
        }

        const base64 = float32ToPCM16Base64(alignedChunks);
        if (base64) {
          promises.push(sendChunk('tutor', base64, tutorChunkIndexRef.current++, false));
        }
      }

      await Promise.all(promises);
    } finally {
      flushingRef.current = false;
    }
  }, [sendChunk]);

  const finalize = useCallback(async () => {
    if (!enabledRef.current) return;

    // Flush remaining buffers
    await flush();

    // Send finalize signals
    await Promise.all([
      sendChunk('student', '', studentChunkIndexRef.current, true),
      sendChunk('tutor', '', tutorChunkIndexRef.current, true),
    ]);

    console.log('[AudioRecorder] Finalized audio recording for session', sessionIdRef.current);
  }, [flush, sendChunk]);

  const pushStudentChunk = useCallback((float32: Float32Array) => {
    if (!enabledRef.current) return;
    // Set session start on first student chunk (= mic recording started)
    if (sessionStartRef.current === 0) {
      sessionStartRef.current = Date.now();
    }
    studentBufferRef.current.push(new Float32Array(float32)); // copy to avoid mutation
  }, []);

  const pushTutorChunk = useCallback((float32: Float32Array) => {
    if (!enabledRef.current) return;
    // If session hasn't started yet (no student audio), start it now
    if (sessionStartRef.current === 0) {
      sessionStartRef.current = Date.now();
    }
    const offsetMs = Date.now() - sessionStartRef.current;
    tutorBufferRef.current.push({
      data: new Float32Array(float32),
      offsetMs,
    });
  }, []);

  // Periodic flush
  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      flush();
    }, flushIntervalMs);

    return () => clearInterval(interval);
  }, [enabled, flushIntervalMs, flush]);

  // Flush on unmount
  useEffect(() => {
    return () => {
      if (enabledRef.current && (studentBufferRef.current.length > 0 || tutorBufferRef.current.length > 0)) {
        // Best-effort flush on unmount — can't await in cleanup
        flush();
      }
    };
  }, [flush]);

  return { pushStudentChunk, pushTutorChunk, flush, finalize };
}
