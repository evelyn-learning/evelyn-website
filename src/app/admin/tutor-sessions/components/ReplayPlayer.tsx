'use client';

import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { Play, Pause, RotateCcw, X, Volume2, VolumeX } from 'lucide-react';
import { WhiteboardCanvas } from '@/app/tutor/components/whiteboard/WhiteboardCanvas';
import type { WhiteboardCommand } from '@/lib/knowledge/types';
import ReplayTimeline, { type TimelineEvent } from './ReplayTimeline';

interface TranscriptEntry {
  role: string;
  text: string;
  timestamp: string;
  pedagogicalIntent?: string;
  whiteboardCommands?: Record<string, unknown>[];
}

interface WhiteboardEntry {
  action: string;
  data: Record<string, unknown>;
  timestamp: string;
  sourceMessageIndex?: number;
}

interface DebugEntry {
  type: string;
  message: string;
  timestamp: string;
  data?: Record<string, unknown>;
}

interface ReplayPlayerProps {
  transcript: TranscriptEntry[];
  whiteboardCommands: WhiteboardEntry[];
  debugEvents: DebugEntry[];
  startedAt: string;
  endedAt?: string;
  duration?: number;
  studentName?: string;
  subject?: string;
  topic?: string;
  sessionId?: string;
  hasAudio?: boolean;
  /** Student replay: signed replay token forwarded to the session-audio
   *  route (which requires it for non-admin callers). Absent on the admin
   *  pages, where the NextAuth session authorizes the fetch instead. */
  audioToken?: string;
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

// ---------------------------------------------------------------------------
// Compressed monotonic timeline (2026-07-15).
//
// `startedAt` is $setOnInsert-pinned to a session's FIRST attempt while
// `duration` is $set to the LATEST attempt's span (session-usage route), so a
// paused-and-resumed session anchors every post-resume item HOURS past the
// scrubber's end — the student replay showed one message, "0 / 39" whiteboard
// items and an empty timeline. Instead of trusting absolute wall-clock
// offsets, we walk all timestamped items in order and cap each inter-item gap
// at GAP_CAP_MS (mirroring buildSpeakerSegments' 20s silence cap): a 4.5h
// resume gap becomes an 8s beat, while a session with no big gaps compresses
// to (almost) exactly its real timeline. Every consumer — reveal gates,
// scrubber, speaker strip, debug markers — uses this SAME compressed
// coordinate system.
//
// Audio note: the recorded PCM tracks run on REAL elapsed time (sample 0 =
// session start), so playback maps compressed → real when scheduling a
// source, and re-seeks the sources whenever the playhead crosses the end of a
// capped gap (a "skip point") so speech after a long silence stays aligned.
// For resumed sessions the post-resume audio was never aligned to the first
// attempt's origin anyway (replay audio there was already broken), so the
// mapping is best-effort by design; non-resumed sessions with no capped gaps
// get an identity mapping and behave exactly as before.
// ---------------------------------------------------------------------------

const GAP_CAP_MS = 8_000;
// Minimum run-out after the last item so the final reveal isn't glued to the
// scrubber's end; the real trailing gap is honored up to GAP_CAP_MS.
const MIN_TAIL_MS = 3_000;

interface CompressedTimeline {
  /** Replay length in compressed ms. */
  totalMs: number;
  /** Compressed offsets at which a capped (skipped) gap ENDS — the audio
   *  re-seek points. */
  skipEndsMs: number[];
  /** Wall-clock offset (ms from startedAt) → compressed offset. NaN input
   *  clamps to the END of the timeline (defensive end-anchor: a late item is
   *  recoverable, an unreachable one is not); negatives clamp to 0. */
  toCompressed: (realMs: number) => number;
  /** Compressed offset → wall-clock offset, for seeking the audio tracks. */
  toReal: (compressedMs: number) => number;
}

function buildCompressedTimeline(realOffsetsMs: number[], realEndMs: number): CompressedTimeline {
  // Anchor pairs (real[i], comp[i]), both strictly ascending, seeded with the
  // session origin. Items at or before the origin (clock skew) create no
  // anchor — toCompressed clamps them to 0 instead.
  const sorted = realOffsetsMs.filter((v) => Number.isFinite(v)).sort((a, b) => a - b);
  const real: number[] = [0];
  const comp: number[] = [0];
  const skipEndsMs: number[] = [];
  for (const r of sorted) {
    const prevReal = real[real.length - 1];
    if (r <= prevReal) continue; // duplicate / pre-origin timestamp
    const gap = r - prevReal;
    const c = comp[comp.length - 1] + Math.min(gap, GAP_CAP_MS);
    if (gap > GAP_CAP_MS) skipEndsMs.push(c);
    real.push(r);
    comp.push(c);
  }
  const lastReal = real[real.length - 1];
  const lastComp = comp[comp.length - 1];
  // Tail: honor the real run-out after the last item, bounded to the gap cap.
  // The max() matters for resumed sessions, where realEndMs (duration spans
  // only the latest attempt) can land BEFORE the last item's real offset.
  // With no items at all there is nothing to compress — keep the real length.
  const totalMs = real.length === 1
    ? Math.max(realEndMs, MIN_TAIL_MS)
    : lastComp + Math.min(Math.max(realEndMs - lastReal, MIN_TAIL_MS), GAP_CAP_MS);

  // Index of the last anchor at or before `v` (arr is ascending, arr[0] = 0).
  const lastAtOrBefore = (arr: number[], v: number): number => {
    let lo = 0, hi = arr.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (arr[mid] <= v) lo = mid; else hi = mid - 1;
    }
    return lo;
  };

  const toCompressed = (realMs: number): number => {
    if (!Number.isFinite(realMs)) return totalMs; // defensive end-anchor
    if (realMs <= 0) return 0;
    const i = lastAtOrBefore(real, realMs);
    if (i === real.length - 1) {
      // Past the last anchor: slope-1 run-out, clamped to the timeline end.
      return Math.min(comp[i] + Math.min(realMs - real[i], GAP_CAP_MS), totalMs);
    }
    // Piecewise-linear inside a segment: uncapped gaps keep slope 1, capped
    // gaps map their real span proportionally onto the 8s compressed beat.
    const t = (realMs - real[i]) / (real[i + 1] - real[i]);
    return Math.min(comp[i] + t * (comp[i + 1] - comp[i]), totalMs);
  };

  const toReal = (compressedMs: number): number => {
    if (!Number.isFinite(compressedMs) || compressedMs <= 0) return 0;
    const i = lastAtOrBefore(comp, compressedMs);
    if (i === comp.length - 1) return real[i] + (compressedMs - comp[i]); // slope-1 tail
    const t = (compressedMs - comp[i]) / (comp[i + 1] - comp[i]);
    return real[i] + t * (real[i + 1] - real[i]);
  };

  return { totalMs, skipEndsMs, toCompressed, toReal };
}

// Decode raw PCM16 ArrayBuffer into a Float32Array (sample-rate independent).
// We deliberately do NOT create an AudioContext here — the AudioBuffer is
// allocated later inside the shared playback context so that the buffer is
// owned by the same context that plays it (some browsers, notably Safari,
// behave erratically when an AudioBuffer's origin context has been closed).
function pcm16ToFloat32(arrayBuffer: ArrayBuffer): Float32Array {
  const int16 = new Int16Array(arrayBuffer);
  const float32 = new Float32Array(int16.length);
  for (let i = 0; i < int16.length; i++) {
    float32[i] = int16[i] / 32768.0;
  }
  return float32;
}

export default function ReplayPlayer({
  transcript,
  whiteboardCommands,
  debugEvents,
  startedAt,
  endedAt,
  duration,
  studentName,
  subject,
  topic,
  sessionId,
  hasAudio,
  audioToken,
}: ReplayPlayerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeMs, setCurrentTimeMs] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [visibleTranscriptCount, setVisibleTranscriptCount] = useState(0);
  const [visibleWbCount, setVisibleWbCount] = useState(0);

  // Audio playback state
  type AudioState = 'idle' | 'loading' | 'ready' | 'none' | 'error';
  const [audioState, setAudioState] = useState<AudioState>('idle');
  // Ref mirror so playback callbacks never read a stale closure — the exact
  // bug that made play-before-load permanently silent (2026-07-04).
  const audioStateRef = useRef<AudioState>('idle');
  const setAudioStateBoth = useCallback((s: AudioState) => {
    audioStateRef.current = s;
    setAudioState(s);
  }, []);
  const [studentMuted, setStudentMuted] = useState(false);
  const [tutorMuted, setTutorMuted] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  // Raw decoded samples + capture sample rate, set during loadAudio. The
  // playable AudioBuffer is materialized lazily in the shared playback
  // context the first time we actually start a source.
  const studentRawRef = useRef<{ float32: Float32Array; sampleRate: number } | null>(null);
  const tutorRawRef = useRef<{ float32: Float32Array; sampleRate: number } | null>(null);
  const studentBufferRef = useRef<AudioBuffer | null>(null);
  const tutorBufferRef = useRef<AudioBuffer | null>(null);
  const studentSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const tutorSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const studentGainRef = useRef<GainNode | null>(null);
  const tutorGainRef = useRef<GainNode | null>(null);

  const playingRef = useRef(false);
  const currentTimeMsRef = useRef(0);
  const speedRef = useRef(1);
  const lastFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  // A4 (2026-07-08) — single monotonic clock. The replay used to run TWO
  // clocks: the visual position accumulated rAF frame deltas while the audio
  // played on the AudioContext's hardware clock. rAF throttles (background
  // tab, heavy paint) freeze the visual clock while audio keeps going, so
  // playhead/WB drift away from what's heard, and the next pause+play SNAPS
  // audio back to the stale visual position (the reported position jump).
  // Fix: while audio is live, the AudioContext clock IS the master —
  // position = anchorMs + (ctx.currentTime − anchorCtxTime)·1000·speed; rAF
  // becomes just the render heartbeat. Without audio, frame deltas remain
  // the fallback. Anchors re-set on every play/seek/speed-change.
  const clockAnchorMsRef = useRef(0);
  const clockAnchorCtxRef = useRef<number | null>(null); // null ⇒ no audio clock

  // Store sorted offset arrays in refs so tick doesn't depend on memoized values
  const transcriptOffsetsRef = useRef<number[]>([]);
  const wbOffsetsRef = useRef<number[]>([]);

  const startMs = useMemo(() => new Date(startedAt).getTime(), [startedAt]);

  // Real (wall-clock) end estimate — this only feeds the compressed
  // timeline's tail now. It is NOT a safe scrubber bound: for resumed
  // sessions `duration` spans only the latest attempt while item offsets are
  // measured from the first attempt's startedAt (see block comment above).
  const realEndMs = useMemo(() => {
    if (duration) return duration * 1000;
    if (endedAt) return new Date(endedAt).getTime() - startMs;
    // Fallback: use last event timestamp
    const allTimestamps = [
      ...transcript.map(t => new Date(t.timestamp).getTime()),
      ...whiteboardCommands.map(w => new Date(w.timestamp).getTime()),
      ...debugEvents.map(d => new Date(d.timestamp).getTime()),
    ];
    return allTimestamps.length > 0 ? Math.max(...allTimestamps) - startMs + 2000 : 60000;
  }, [duration, endedAt, startMs, transcript, whiteboardCommands, debugEvents]);

  // Whether stored whiteboard timestamps are real capture times. Pre-
  // 2026-07-15 embeds stamped every command at SAVE time, so the whole array
  // shares one timestamp — those sessions get transcript-derived timing in
  // sortedWb below and their WB entries must NOT anchor the compressed
  // timeline (one bogus save-time stamp would masquerade as an item).
  const wbTimesDistinct = useMemo(() => {
    const wbTimes = whiteboardCommands.map(w => new Date(w.timestamp).getTime());
    return wbTimes.length > 0 && !(wbTimes.length > 1 && new Set(wbTimes).size <= 1);
  }, [whiteboardCommands]);

  // The one compressed coordinate system every offset below maps through.
  const compressedTimeline = useMemo(() => {
    const realOffsets = [
      ...transcript.map(t => new Date(t.timestamp).getTime() - startMs),
      ...debugEvents.map(d => new Date(d.timestamp).getTime() - startMs),
      ...(wbTimesDistinct ? whiteboardCommands.map(w => new Date(w.timestamp).getTime() - startMs) : []),
    ];
    return buildCompressedTimeline(realOffsets, realEndMs);
  }, [transcript, debugEvents, whiteboardCommands, wbTimesDistinct, startMs, realEndMs]);

  const totalDurationMs = compressedTimeline.totalMs;

  // Build unified timeline (offsets in compressed coordinates)
  const timeline = useMemo<TimelineEvent[]>(() => {
    const toCompressed = compressedTimeline.toCompressed;
    const events: TimelineEvent[] = [
      ...transcript.map((t, i) => ({
        type: 'transcript' as const,
        offsetMs: toCompressed(new Date(t.timestamp).getTime() - startMs),
        data: { ...t, _index: i },
      })),
      ...whiteboardCommands.map((w, i) => ({
        type: 'whiteboard' as const,
        offsetMs: toCompressed(new Date(w.timestamp).getTime() - startMs),
        data: { ...w, _index: i },
      })),
      ...debugEvents.map(d => ({
        type: 'debug' as const,
        offsetMs: toCompressed(new Date(d.timestamp).getTime() - startMs),
        data: { ...d },
      })),
    ];
    return events.sort((a, b) => a.offsetMs - b.offsetMs);
  }, [transcript, whiteboardCommands, debugEvents, startMs, compressedTimeline]);

  // Convert stored whiteboard entries back to WhiteboardCommand format
  const wbAsCommands = useMemo<WhiteboardCommand[]>(() => {
    return whiteboardCommands.map(entry => {
      const cmd = { action: entry.action, ...entry.data };
      return cmd as unknown as WhiteboardCommand;
    });
  }, [whiteboardCommands]);

  // Sorted transcript entries for progressive reveal (compressed offsets —
  // toCompressed is monotonic, so sorting by real timestamp keeps the offset
  // array ascending for applyTime's early-break scan)
  const sortedTranscript = useMemo(() => {
    const sorted = [...transcript].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    transcriptOffsetsRef.current = sorted.map(t => compressedTimeline.toCompressed(new Date(t.timestamp).getTime() - startMs));
    return sorted;
  }, [transcript, startMs, compressedTimeline]);

  // Build whiteboard commands with timing — derive from transcript if DB timestamps are identical
  const sortedWb = useMemo(() => {
    if (wbTimesDistinct) {
      // Timestamps are real capture times — use them directly
      const sorted = [...whiteboardCommands].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      wbOffsetsRef.current = sorted.map(w => compressedTimeline.toCompressed(new Date(w.timestamp).getTime() - startMs));
      return sorted.map(entry => ({ action: entry.action, ...entry.data } as unknown as WhiteboardCommand));
    }

    // Fallback (pre-2026-07-15 sessions, all commands stamped at save time):
    // derive timing from transcript entries that carry whiteboardCommands
    const derivedCommands: { cmd: WhiteboardCommand; offsetMs: number }[] = [];
    const sortedT = [...transcript].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    for (const t of sortedT) {
      if (t.whiteboardCommands?.length) {
        const offsetMs = compressedTimeline.toCompressed(new Date(t.timestamp).getTime() - startMs);
        for (const wbCmd of t.whiteboardCommands) {
          derivedCommands.push({
            cmd: wbCmd as unknown as WhiteboardCommand,
            offsetMs,
          });
        }
      }
    }

    // If we got commands from transcript, use those
    if (derivedCommands.length > 0) {
      wbOffsetsRef.current = derivedCommands.map(d => d.offsetMs);
      return derivedCommands.map(d => d.cmd);
    }

    // Last resort: distribute evenly across the (compressed) session
    wbOffsetsRef.current = whiteboardCommands.map((_, i) =>
      Math.round((totalDurationMs * (i + 1)) / (whiteboardCommands.length + 1))
    );
    return whiteboardCommands.map(entry => ({ action: entry.action, ...entry.data } as unknown as WhiteboardCommand));
  }, [whiteboardCommands, transcript, startMs, totalDurationMs, wbTimesDistinct, compressedTimeline]);

  // Apply current time to visible counts using pre-computed offset arrays
  const applyTime = useCallback((timeMs: number) => {
    // Binary-search-like count: how many offsets <= timeMs
    let tCount = 0;
    for (const offset of transcriptOffsetsRef.current) {
      if (offset <= timeMs) tCount++;
      else break;
    }
    setVisibleTranscriptCount(tCount);

    let wCount = 0;
    for (const offset of wbOffsetsRef.current) {
      if (offset <= timeMs) wCount++;
      else break;
    }
    setVisibleWbCount(wCount);
  }, []); // No deps — reads from refs

  // Store totalDurationMs / skip points in refs so tick doesn't need deps
  const totalDurationMsRef = useRef(totalDurationMs);
  totalDurationMsRef.current = totalDurationMs;
  const skipEndsRef = useRef<number[]>([]);
  skipEndsRef.current = compressedTimeline.skipEndsMs;

  // Animation loop — stable reference, reads everything from refs
  const tick = useCallback((now: number) => {
    if (!playingRef.current) return;

    const delta = now - lastFrameRef.current;
    lastFrameRef.current = now;

    // A4: audio clock is the master when live (survives rAF throttling);
    // frame-delta accumulation only when there's no running audio context.
    const ctx = audioCtxRef.current;
    const prevTime = currentTimeMsRef.current;
    const newTime = Math.min(
      clockAnchorCtxRef.current !== null && ctx && ctx.state === 'running'
        ? clockAnchorMsRef.current + (ctx.currentTime - clockAnchorCtxRef.current) * 1000 * speedRef.current
        : currentTimeMsRef.current + delta * speedRef.current,
      totalDurationMsRef.current,
    );
    currentTimeMsRef.current = newTime;
    setCurrentTimeMs(newTime);
    applyTime(newTime);

    // Compressed timeline: crossing the END of a capped gap means the audio
    // sources (which run on REAL elapsed time) just played only the first 8s
    // of a much longer silence — re-seek them at the mapped real offset so
    // speech after the gap stays aligned. Skip points are rare (one per
    // pause/resume or long silence), so a linear scan per frame is fine.
    if (clockAnchorCtxRef.current !== null) {
      for (const skipEnd of skipEndsRef.current) {
        if (prevTime < skipEnd && skipEnd <= newTime) {
          startAudioPlaybackRef.current(newTime, speedRef.current);
          break;
        }
      }
    }

    if (newTime >= totalDurationMsRef.current) {
      playingRef.current = false;
      setIsPlaying(false);
      return;
    }

    rafRef.current = requestAnimationFrame(tick);
  }, [applyTime]); // applyTime has no deps, so tick is stable

  // Audio: load files when modal opens — try regardless of hasAudio flag
  // (flag may not be set due to race condition on session end)
  // Distinguishes: ready (≥1 non-empty track), none (both tracks
  // absent/empty — nothing was recorded), error (network/exception —
  // retryable via the status pill).
  const loadAudio = useCallback(async () => {
    if (!sessionId) { setAudioStateBoth('none'); return; }
    if (audioStateRef.current === 'loading' || audioStateRef.current === 'ready') return;
    setAudioStateBoth('loading');
    try {
      const tokenParam = audioToken ? `&token=${encodeURIComponent(audioToken)}` : '';
      const [studentResp, tutorResp] = await Promise.all([
        fetch(`/api/tutor/session-audio?sessionId=${sessionId}&role=student${tokenParam}`),
        fetch(`/api/tutor/session-audio?sessionId=${sessionId}&role=tutor${tokenParam}`),
      ]);
      const intHeader = (resp: Response, name: string, fallback: number) =>
        parseInt(resp.headers.get(name) || String(fallback), 10) || fallback;

      if (studentResp.ok) {
        const buf = await studentResp.arrayBuffer();
        if (buf.byteLength > 0) {
          studentRawRef.current = {
            float32: pcm16ToFloat32(buf),
            sampleRate: intHeader(studentResp, 'X-Sample-Rate', 24000),
          };
        }
      }
      if (tutorResp.ok) {
        const buf = await tutorResp.arrayBuffer();
        if (buf.byteLength > 0) {
          tutorRawRef.current = {
            float32: pcm16ToFloat32(buf),
            sampleRate: intHeader(tutorResp, 'X-Sample-Rate', 24000),
          };
        }
      }
      setAudioStateBoth(studentRawRef.current || tutorRawRef.current ? 'ready' : 'none');
    } catch (err) {
      console.error('[ReplayPlayer] Audio load error:', err);
      setAudioStateBoth('error');
    }
  }, [sessionId, audioToken, setAudioStateBoth]);

  // Audio: start playback from offset.
  // Async because the AudioContext may be born `suspended` (autoplay policy)
  // and we MUST await `resume()` before calling `source.start()`, otherwise
  // the first play silently drops audio until the next user interaction.
  const startAudioPlayback = useCallback(async (offsetMs: number, playbackRate: number) => {
    if (audioStateRef.current !== 'ready') return;

    // Create or resume the shared playback AudioContext
    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      audioCtxRef.current = new AudioContext({ sampleRate: 24000 });
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      try { await ctx.resume(); } catch (err) { console.warn('[ReplayPlayer] AudioContext resume failed', err); }
    }

    // Lazily materialize AudioBuffers in this context the first time we play.
    // Doing it here (rather than in loadAudio) keeps the buffer's owner context
    // alive for the entire playback lifecycle and avoids the closed-context
    // quirks we hit when buffers were decoded in a throwaway temporary context.
    if (!studentBufferRef.current && studentRawRef.current) {
      const { float32, sampleRate } = studentRawRef.current;
      const buf = ctx.createBuffer(1, float32.length, sampleRate);
      buf.getChannelData(0).set(float32);
      studentBufferRef.current = buf;
    }
    if (!tutorBufferRef.current && tutorRawRef.current) {
      const { float32, sampleRate } = tutorRawRef.current;
      const buf = ctx.createBuffer(1, float32.length, sampleRate);
      buf.getChannelData(0).set(float32);
      tutorBufferRef.current = buf;
    }

    // Create gain nodes if needed
    if (!studentGainRef.current) {
      studentGainRef.current = ctx.createGain();
      studentGainRef.current.connect(ctx.destination);
    }
    if (!tutorGainRef.current) {
      tutorGainRef.current = ctx.createGain();
      tutorGainRef.current.connect(ctx.destination);
    }

    // Apply mute state
    studentGainRef.current.gain.value = studentMuted ? 0 : 1;
    tutorGainRef.current.gain.value = tutorMuted ? 0 : 1;

    // Stop existing sources
    try { studentSourceRef.current?.stop(); } catch {}
    try { tutorSourceRef.current?.stop(); } catch {}

    // Schedule a track at the REAL buffer offset for the compressed timeline
    // position `offsetMs` (origin offset is always 0 — capture-side
    // leading-silence padding already aligns sample 0 with session start —
    // so there is no future-scheduling case to handle here). The tracks run
    // on wall-clock elapsed time while the replay runs on the compressed
    // timeline, hence the toReal() mapping; tick() re-seeks at every capped
    // gap's end to keep the two clocks aligned across skips.
    const bufferOffsetSec = compressedTimeline.toReal(offsetMs) / 1000;
    const scheduleTrack = (
      buffer: AudioBuffer | null,
      gain: GainNode | null,
    ): AudioBufferSourceNode | null => {
      if (!buffer || !gain) return null;
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.playbackRate.value = playbackRate;
      source.connect(gain);
      if (bufferOffsetSec >= buffer.duration) return null; // past end of track
      source.start(0, bufferOffsetSec);
      return source;
    };

    studentSourceRef.current = scheduleTrack(studentBufferRef.current, studentGainRef.current);
    tutorSourceRef.current = scheduleTrack(tutorBufferRef.current, tutorGainRef.current);

    // A4: anchor the master clock at this exact (position, ctx-time) pair.
    // Valid even when both tracks were past their end — ctx.currentTime is
    // still the most reliable monotonic clock available.
    clockAnchorMsRef.current = offsetMs;
    clockAnchorCtxRef.current = ctx.currentTime;
  }, [studentMuted, tutorMuted, compressedTimeline]);

  // HOT-ATTACH (the core bug fix): if audio finishes loading while the
  // visual replay is already playing, start it at the current position —
  // previously the user had to rewind/pause+play to get sound.
  // startAudioPlayback rides a ref so this effect fires ONLY on the
  // loading→ready transition — with the callback in the dep array, every
  // mute toggle would recreate it and needlessly restart the sources.
  const startAudioPlaybackRef = useRef(startAudioPlayback);
  startAudioPlaybackRef.current = startAudioPlayback;
  useEffect(() => {
    if (audioState === 'ready' && playingRef.current) {
      startAudioPlaybackRef.current(currentTimeMsRef.current, speedRef.current);
    }
  }, [audioState]);

  // Audio: stop playback
  const stopAudioPlayback = useCallback(() => {
    try { studentSourceRef.current?.stop(); } catch {}
    try { tutorSourceRef.current?.stop(); } catch {}
    studentSourceRef.current = null;
    tutorSourceRef.current = null;
    // A4: no live audio ⇒ fall back to frame-delta clock.
    clockAnchorCtxRef.current = null;
  }, []);

  const play = useCallback(() => {
    if (currentTimeMsRef.current >= totalDurationMs) {
      currentTimeMsRef.current = 0;
      setCurrentTimeMs(0);
      applyTime(0);
    }
    playingRef.current = true;
    setIsPlaying(true);
    lastFrameRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);
    startAudioPlayback(currentTimeMsRef.current, speedRef.current);
  }, [totalDurationMs, tick, applyTime, startAudioPlayback]);

  const pause = useCallback(() => {
    playingRef.current = false;
    setIsPlaying(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    stopAudioPlayback();
  }, [stopAudioPlayback]);

  const reset = useCallback(() => {
    pause();
    currentTimeMsRef.current = 0;
    setCurrentTimeMs(0);
    applyTime(0);
  }, [pause, applyTime]);

  const seek = useCallback((timeMs: number) => {
    const clamped = Math.max(0, Math.min(timeMs, totalDurationMs));
    currentTimeMsRef.current = clamped;
    setCurrentTimeMs(clamped);
    applyTime(clamped);
    // If playing, restart audio from new position
    if (playingRef.current) {
      stopAudioPlayback();
      startAudioPlayback(clamped, speedRef.current);
    }
  }, [totalDurationMs, applyTime, stopAudioPlayback, startAudioPlayback]);

  const changeSpeed = useCallback((newSpeed: number) => {
    // A4: re-anchor the audio master clock BEFORE the rate changes — the
    // position formula is linear in speed, so a mid-flight speed change
    // must restart the line from the current position.
    if (clockAnchorCtxRef.current !== null && audioCtxRef.current) {
      clockAnchorMsRef.current = currentTimeMsRef.current;
      clockAnchorCtxRef.current = audioCtxRef.current.currentTime;
    }
    speedRef.current = newSpeed;
    setSpeed(newSpeed);
    // Update audio playback rate if playing
    if (studentSourceRef.current) studentSourceRef.current.playbackRate.value = newSpeed;
    if (tutorSourceRef.current) tutorSourceRef.current.playbackRate.value = newSpeed;
  }, []);

  // Update gain when mute toggles
  useEffect(() => {
    if (studentGainRef.current) studentGainRef.current.gain.value = studentMuted ? 0 : 1;
  }, [studentMuted]);
  useEffect(() => {
    if (tutorGainRef.current) tutorGainRef.current.gain.value = tutorMuted ? 0 : 1;
  }, [tutorMuted]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      try { studentSourceRef.current?.stop(); } catch {}
      try { tutorSourceRef.current?.stop(); } catch {}
      audioCtxRef.current?.close();
    };
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [visibleTranscriptCount]);

  // Visible slices
  const visibleMessages = sortedTranscript.slice(0, visibleTranscriptCount);
  const visibleCommands = sortedWb.slice(0, visibleWbCount);

  if (!isOpen) {
    return (
      <button
        onClick={() => { setIsOpen(true); loadAudio(); }}
        className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition-colors shadow-lg"
      >
        <Play className="h-5 w-5" />
        Open Session Replay
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b bg-gray-50">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Session Replay</h2>
            <p className="text-xs text-gray-500">
              {studentName || 'Anonymous'} — {subject}/{topic} — {formatTime(totalDurationMs)} total
            </p>
          </div>
          <button onClick={() => { pause(); setIsOpen(false); }} className="p-2 hover:bg-gray-200 rounded-lg">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Main content — two panes */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Transcript */}
          <div className="w-1/2 border-r flex flex-col">
            <div className="px-4 py-2 border-b bg-gray-50">
              <h3 className="text-sm font-medium text-gray-700">Conversation</h3>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
              {visibleMessages.length === 0 && (
                <p className="text-gray-400 text-sm text-center py-8">Press play to start replay...</p>
              )}
              {visibleMessages.map((entry, i) => (
                <div key={i} className={`flex ${entry.role === 'student' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm animate-in fade-in slide-in-from-bottom-1 duration-300 ${
                    entry.role === 'student'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-semibold opacity-60 uppercase">{entry.role}</span>
                      <span className="text-[10px] opacity-40">
                        {new Date(entry.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap leading-relaxed">{entry.text}</p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
          </div>

          {/* Right: Whiteboard */}
          <div className="w-1/2 flex flex-col">
            <div className="px-4 py-2 border-b bg-gray-50 flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700">
                Whiteboard
                <span className="ml-2 text-xs text-gray-400">{visibleWbCount} / {wbAsCommands.length} items</span>
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto">
              {visibleCommands.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                  No whiteboard content yet...
                </div>
              ) : (
                <WhiteboardCanvas commands={visibleCommands} />
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="px-6 py-4 border-t bg-gray-50 space-y-2">
          <ReplayTimeline
            events={timeline}
            totalDurationMs={totalDurationMs}
            currentTimeMs={currentTimeMs}
            onSeek={seek}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={isPlaying ? pause : play}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
              </button>
              <button
                onClick={reset}
                className="p-2 rounded-lg hover:bg-gray-200 text-gray-500 transition-colors"
                title="Reset"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-1">
              {[1, 2, 4, 8].map(s => (
                <button
                  key={s}
                  onClick={() => changeSpeed(s)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    speed === s
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>

            {/* Audio status pill */}
            <div className="flex items-center gap-2 border-l pl-3 ml-2">
              {audioState === 'loading' && (
                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-500">Audio loading…</span>
              )}
              {audioState === 'none' && (
                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-400">No audio recorded</span>
              )}
              {audioState === 'error' && (
                <button
                  onClick={() => { setAudioStateBoth('idle'); loadAudio(); }}
                  className="rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-100"
                >
                  Audio failed — Retry
                </button>
              )}
              {audioState === 'ready' && (
                <>
                  <span className="rounded-full bg-green-50 px-2 py-1 text-xs text-green-600">Audio on</span>
                  <button
                    onClick={() => setStudentMuted(!studentMuted)}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                      studentMuted ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-600'
                    }`}
                    title={studentMuted ? 'Unmute student' : 'Mute student'}
                  >
                    {studentMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                    Student
                  </button>
                  <button
                    onClick={() => setTutorMuted(!tutorMuted)}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                      tutorMuted ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                    }`}
                    title={tutorMuted ? 'Unmute tutor' : 'Mute tutor'}
                  >
                    {tutorMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                    Tutor
                  </button>
                </>
              )}
            </div>

            <div className="text-sm text-gray-500 font-mono">
              {formatTime(currentTimeMs)} / {formatTime(totalDurationMs)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
