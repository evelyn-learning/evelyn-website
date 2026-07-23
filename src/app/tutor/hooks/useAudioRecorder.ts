'use client';

import { useRef, useCallback, useEffect } from 'react';
import { buildAlignedChunks, type TimedChunk } from '@/lib/tutor/recordings/track-align';

const SAMPLE_RATE = 24000;
// Student-track gap threshold: mic chunks arrive continuously (~170ms
// cadence) so sub-500ms positive "gaps" are Date.now() scheduler jitter,
// not real capture holes — filling them would slice micro-silences into
// continuous speech. Real holes (stopListening turn commits, WS
// reconnects) are seconds long. See track-align.ts.
const STUDENT_MIN_GAP_SAMPLES = Math.floor(0.5 * SAMPLE_RATE);

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
  const studentBufferRef = useRef<TimedChunk[]>([]);
  const tutorBufferRef = useRef<TimedChunk[]>([]);
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
  // Samples written so far per track (to calculate silence gaps). The
  // student counter is what makes the student track wall-clock aligned —
  // pre-2026-07-19 it was concatenate-only, which collapsed every
  // stop-listening / reconnect window and made replays drift (the tutor
  // audibly talked over the student, session-1784194326500).
  const studentSamplesWrittenRef = useRef(0);
  const tutorSamplesWrittenRef = useRef(0);
  // Guards double-finalize (explicit end + unmount cleanup both fire).
  const finalizedRef = useRef(false);

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
        // Finalize signals are empty-bodied and must survive page/component
        // teardown (unmount-finalize below) — keepalive keeps them alive.
        keepalive: finalize,
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

      // Flush student buffer — silence-fill real capture gaps (turn
      // commits, reconnects) so the file stays wall-clock aligned; the
      // jitter threshold keeps continuous speech contiguous.
      if (studentBufferRef.current.length > 0) {
        const result = buildAlignedChunks(
          studentBufferRef.current, studentSamplesWrittenRef.current, SAMPLE_RATE, STUDENT_MIN_GAP_SAMPLES,
        );
        studentBufferRef.current = [];
        studentSamplesWrittenRef.current = result.samplesWritten;
        const bytes = float32ToPCM16Bytes(result.aligned);
        if (bytes) {
          promises.push(sendChunk('student', bytes, studentChunkIndexRef.current++, false));
        }
      }

      // Flush tutor buffer — insert silence gaps to time-align with session
      // (fill-any-gap: TTS chunks are bursty, so every gap is real).
      if (tutorBufferRef.current.length > 0) {
        const result = buildAlignedChunks(
          tutorBufferRef.current, tutorSamplesWrittenRef.current, SAMPLE_RATE, 0,
        );
        tutorBufferRef.current = [];
        tutorSamplesWrittenRef.current = result.samplesWritten;
        const bytes = float32ToPCM16Bytes(result.aligned);
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
    if (!enabledRef.current || finalizedRef.current) return;
    finalizedRef.current = true;

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
    // A mic chunk ARRIVES when its capture buffer fills, so Date.now()
    // marks the chunk's END; subtract its duration to stamp the START.
    // (Leading silence at session start falls out of the same gap logic
    // that fills mid-session capture holes — see flush.)
    const durMs = (float32.length / SAMPLE_RATE) * 1000;
    const offsetMs = Math.max(0, Date.now() - sessionStartRef.current - durMs);
    studentBufferRef.current.push({
      data: new Float32Array(float32), // copy to avoid mutation
      offsetMs,
    });
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

  // Flush + finalize on unmount. Flush-only used to leave any session that
  // ended via remount/navigation (rather than the explicit End button) as a
  // stuck-"active" audio recording with no finalizedAt — observed as zombie
  // audio sessions in the session-id double-mint investigation (2026-07-24
  // pre-Phase-4 find). Finalize is guarded (finalizedRef) so the explicit
  // End-path call stays the primary one; this is the safety net.
  useEffect(() => {
    return () => {
      if (!enabledRef.current || finalizedRef.current) return;
      const everSentAudio = studentChunkIndexRef.current > 0 || tutorChunkIndexRef.current > 0
        || studentBufferRef.current.length > 0 || tutorBufferRef.current.length > 0;
      if (everSentAudio) {
        // Best-effort — can't await in cleanup; sendChunk uses keepalive for
        // the finalize signal so it survives teardown.
        void finalize().catch(() => {});
      }
    };
  }, [finalize]);

  return { pushStudentChunk, pushTutorChunk, flush, finalize };
}
