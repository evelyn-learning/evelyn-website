'use client';

import { useRef, useCallback, useEffect } from 'react';

interface UseAudioRecorderConfig {
  sessionId: string;
  enabled: boolean;
  // Wallclock ms at which the session officially started (the same value the
  // server stores in TutorSession.startedAt). The recorder uses this as the
  // canonical T0 for both tracks so that sample 0 of each .pcm16 file lines
  // up with the session timeline used by the replay UI. If omitted, the
  // recorder falls back to "first audio chunk wins" — this only happens for
  // legacy callers and produces tracks that drift from the chat timeline.
  sessionStartedAtMs?: number;
  flushIntervalMs?: number; // default 30000
}

interface UseAudioRecorderResult {
  pushStudentChunk: (float32: Float32Array) => void;
  pushTutorChunk: (float32: Float32Array) => void;
  flush: () => Promise<void>;
  finalize: () => Promise<void>;
}

// Returns raw PCM16 bytes (ArrayBuffer) for the concatenated float32
// chunks. We POST these directly to /api/tutor/session-audio as an
// application/octet-stream body — cheaper than base64 and not subject
// to the 10MB JSON-body cap that bit long sessions on 2026-04-24.
function float32ToPCM16Bytes(chunks: Float32Array[]): ArrayBuffer | null {
  // Calculate total length
  let totalLength = 0;
  for (const chunk of chunks) totalLength += chunk.length;
  if (totalLength === 0) return null;

  // Convert to int16
  const int16 = new Int16Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    for (let i = 0; i < chunk.length; i++) {
      const s = Math.max(-1, Math.min(1, chunk[i]));
      int16[offset++] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
  }
  return int16.buffer;
}

export function useAudioRecorder({
  sessionId,
  enabled,
  sessionStartedAtMs,
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
  // Canonical T0 for the session. Both student and tutor tracks are aligned
  // such that sample 0 corresponds to this moment. If the caller did not
  // supply sessionStartedAtMs, we degrade to "first audio chunk wins" — same
  // (buggy) behavior as the original implementation, kept for safety.
  const sessionStartRef = useRef(sessionStartedAtMs ?? 0);
  // Has the first student chunk been observed yet? (Used to inject leading
  // silence the very first time, so the file aligns with sessionStartedAtMs.)
  const studentPrimedRef = useRef(false);
  // Track how many tutor samples have been written so far (to calculate silence gaps)
  const tutorSamplesWrittenRef = useRef(0);

  const sendChunk = useCallback(async (
    role: 'student' | 'tutor',
    audio: ArrayBuffer | null,
    chunkIndex: number,
    finalize: boolean,
  ) => {
    try {
      const qs = new URLSearchParams({
        sessionId: sessionIdRef.current,
        role,
        chunkIndex: String(chunkIndex),
        finalize: finalize ? 'true' : 'false',
      });
      await fetch(`/api/tutor/session-audio?${qs.toString()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        body: audio ?? new ArrayBuffer(0),
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
        const bytes = float32ToPCM16Bytes(studentBufferRef.current);
        studentBufferRef.current = [];
        if (bytes) {
          promises.push(sendChunk('student', bytes, studentChunkIndexRef.current++, false));
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

        const bytes = float32ToPCM16Bytes(alignedChunks);
        if (bytes) {
          promises.push(sendChunk('tutor', bytes, tutorChunkIndexRef.current++, false));
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

    // Send finalize signals (empty body — the server only reads the
    // finalize flag from the query string in this mode).
    await Promise.all([
      sendChunk('student', null, studentChunkIndexRef.current, true),
      sendChunk('tutor', null, tutorChunkIndexRef.current, true),
    ]);

    console.log('[AudioRecorder] Finalized audio recording for session', sessionIdRef.current);
  }, [flush, sendChunk]);

  const pushStudentChunk = useCallback((float32: Float32Array) => {
    if (!enabledRef.current) return;
    // Fallback for legacy callers that don't supply sessionStartedAtMs:
    // anchor T0 to the first audio chunk we see (matches old behavior).
    if (sessionStartRef.current === 0) {
      sessionStartRef.current = Date.now();
    }
    // First student chunk: pad with leading silence so sample 0 of
    // student.pcm16 corresponds to sessionStartRef rather than to "the
    // moment the mic happened to activate" (which can be many seconds late
    // if the tutor greeted the student first or mic permission took time).
    if (!studentPrimedRef.current) {
      studentPrimedRef.current = true;
      const leadingMs = Math.max(0, Date.now() - sessionStartRef.current);
      const leadingSamples = Math.floor((leadingMs / 1000) * 24000);
      if (leadingSamples > 0) {
        studentBufferRef.current.push(new Float32Array(leadingSamples)); // zeros = silence
      }
    }
    studentBufferRef.current.push(new Float32Array(float32)); // copy to avoid mutation
  }, []);

  const pushTutorChunk = useCallback((float32: Float32Array) => {
    if (!enabledRef.current) return;
    // Same fallback as student. With sessionStartedAtMs set, this is a no-op.
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
