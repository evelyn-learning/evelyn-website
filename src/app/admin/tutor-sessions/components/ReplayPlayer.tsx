'use client';

import { useState, useRef, useCallback, useMemo, useEffect, useLayoutEffect } from 'react';
import { Play, Pause, RotateCcw, X, MessageSquareText } from 'lucide-react';
import { WhiteboardCanvas } from '@/app/tutor/components/whiteboard/WhiteboardCanvas';
// R38 task 13: shared split-then-emphasize renderer (TranscriptView's own
// math/prose split core, minus its normalizeSentenceGaps display fixup —
// see inline-emphasis.tsx) so replay bubbles render *emphasis*/**strong**
// instead of raw asterisks, matching the live drawer. Math segments still
// route through InlineMathText internally.
import { renderBubbleEmphasis } from '@/app/tutor/components/inline-emphasis';
import type { WhiteboardCommand } from '@/lib/knowledge/types';
import ReplayTimeline, { type TimelineEvent } from './ReplayTimeline';
import { buildCompressedTimeline } from '@/lib/tutor/recordings/compressed-timeline';
import { alignEvenBytes, findSegmentAt, frontierSec, type SegmentSpan } from '@/lib/tutor/recordings/audio-segments';
import { computeReplayBoardFit, REPLAY_BOARD_DESIGN_WIDTH_PX } from '@/lib/tutor/recordings/replay-board-fit';

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

/** One conversation bubble (tutor left / student right, wall-clock stamp).
 *  Shared by the replay modal's progressive-reveal pane and the student
 *  replay page's static full-transcript view — keep the styling in sync by
 *  keeping it HERE. suppressHydrationWarning on the time: the static page
 *  server-renders it, and toLocaleTimeString legitimately differs between
 *  the server's timezone and the viewer's. */
export function TranscriptBubble({ entry }: { entry: { role: string; text: string; timestamp: string } }) {
  return (
    <div className={`flex ${entry.role === 'student' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm animate-in fade-in slide-in-from-bottom-1 duration-300 ${
        entry.role === 'student'
          ? 'bg-blue-500 text-white'
          : 'bg-gray-100 text-gray-800'
      }`}>
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[10px] font-semibold opacity-60 uppercase">{entry.role}</span>
          <span className="text-[10px] opacity-40" suppressHydrationWarning>
            {new Date(entry.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
        {/* Tutor speech carries $…$ KaTeX (live round-4: replay showed raw
            \dfrac source) and *emphasis* markers (R38 task 13: was raw
            asterisks) — render through the shared split-then-emphasize
            renderer, same core the live drawer uses. */}
        <p className="whitespace-pre-wrap leading-relaxed">{renderBubbleEmphasis(entry.text)}</p>
      </div>
    </div>
  );
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

// Stream a fetch response, reporting cumulative bytes received as chunks
// arrive (onProgress) and — for progressive playback (task E3) — handing each
// raw byte chunk to `onChunk` as it lands so the caller can decode ~20s audio
// segments before the whole (tens-of-MB) track finishes downloading. A raw
// PCM16 session-audio track runs tens of MB, so the previous single
// `resp.arrayBuffer()` await left the "Audio loading…" pill static — and
// playback unavailable — for the entire ~1min download. response.body may be
// absent in environments without streaming fetch (older Safari, some test
// runners) — fall back to the non-streaming path, still routing the whole
// body through onChunk once so the segment builder handles both paths.
//
// When onChunk is supplied the caller retains the decoded segments, so we do
// NOT also accumulate a merged copy here (that would hold the whole track in
// memory a second time — exactly what progressive playback exists to avoid).
// Without onChunk the legacy behavior is preserved: accumulate + return the
// assembled body.
async function readWithProgress(
  resp: Response,
  onProgress: (bytesReceived: number) => void,
  onChunk?: (bytes: Uint8Array) => void,
): Promise<ArrayBuffer> {
  if (!resp.body) {
    const buf = await resp.arrayBuffer();
    onChunk?.(new Uint8Array(buf));
    return buf;
  }
  const reader = resp.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value && value.byteLength > 0) {
      received += value.byteLength;
      onProgress(received);
      if (onChunk) onChunk(value);
      else chunks.push(value);
    }
  }
  if (onChunk) return new ArrayBuffer(0); // caller retains segments; no merged copy
  const merged = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return merged.buffer;
}

// Per-track progressive-audio state (task E3). Bytes stream in, get carried to
// 2-byte (Int16) alignment, buffered until ≥ one segment's worth, then decoded
// into an AudioContext-owned AudioBuffer. `frontierSec` is how far the track
// is decoded; `done` marks the stream fully read. See audio-segments.ts.
interface AudioSegment { startSec: number; durationSec: number; buffer: AudioBuffer }
interface TrackStream {
  sampleRate: number;
  segmentBytes: number;       // bytes per ~20s segment (20 * sampleRate * 2)
  segments: AudioSegment[];
  frontierSec: number;
  done: boolean;
  carry: number | null;       // dangling odd byte carried across reads
  pending: Uint8Array[];      // aligned bytes not yet flushed into a segment
  pendingLen: number;
}

const SEGMENT_SECONDS = 20;

interface AudioLoadProgress {
  loadedBytes: number;
  /** null ⇒ at least one track's Content-Length was absent (e.g. chunked
   *  transfer) — fall back to cumulative-only display. */
  totalBytes: number | null;
}

// Task W2: the standalone "Audio loading…"/"Buffering…" pill (and its
// Student/Tutor mute buttons + the duplicate time display alongside it) was
// deleted from the controls row — this now feeds a short inline fragment
// into ReplayTimeline's time row instead (`· loading 12/45MB` / `· buffering`),
// so idle/ready/none/error states render nothing here (no new chrome height).
// Signature takes the state as a literal union rather than importing the
// component-local `AudioState` alias (declared well below, inside
// ReplayPlayer) — the two are structurally identical, so this stays a
// module-level function without a forward reference.
function formatInlineAudioStatus(
  state: 'idle' | 'loading' | 'ready' | 'buffering' | 'none' | 'error',
  { loadedBytes, totalBytes }: AudioLoadProgress,
): string | null {
  if (state === 'buffering') return 'buffering';
  if (state === 'none') return 'no audio';
  if (state === 'error') return 'audio failed';
  if (state !== 'loading') return null;
  const loadedMB = Math.round(loadedBytes / 1_000_000);
  if (totalBytes != null && totalBytes > 0) {
    const totalMB = Math.max(loadedMB, Math.round(totalBytes / 1_000_000));
    return `loading ${loadedMB}/${totalMB}MB`;
  }
  return loadedMB > 0 ? `loading ${loadedMB}MB` : 'loading';
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
  const [visibleTranscriptCount, setVisibleTranscriptCount] = useState(0);
  const [visibleWbCount, setVisibleWbCount] = useState(0);

  // Transcript drawer (task R3): the board is now the permanent fixture and
  // the conversation lives in a slide-in drawer, mirroring SessionStage's
  // drawer idiom (src/app/tutor/components/session/SessionStage.tsx ~143-153,
  // 531-553) so replay FEELS like the live session. Closed by default —
  // opening is an explicit user action, same as the live drawer.
  const [drawerOpen, setDrawerOpen] = useState(false);
  // Unread affordance: badge on the header toggle button counts bubbles that
  // revealed while the drawer was CLOSED, and clears the instant it opens.
  // `lastSeenTranscriptCountRef` is the visibleTranscriptCount as of the last
  // time the drawer was open (or 0 before it's ever been opened) — the effect
  // below re-syncs it to "now" every render the drawer is open, so it always
  // reflects what the viewer has actually seen.
  const [unreadCount, setUnreadCount] = useState(0);
  const lastSeenTranscriptCountRef = useRef(0);
  useEffect(() => {
    if (drawerOpen) {
      lastSeenTranscriptCountRef.current = visibleTranscriptCount;
      setUnreadCount(0);
    } else {
      setUnreadCount(Math.max(0, visibleTranscriptCount - lastSeenTranscriptCountRef.current));
    }
  }, [visibleTranscriptCount, drawerOpen]);

  // Audio playback state.
  //   idle      — modal not yet opened / load not started.
  //   loading   — fetching; no playable segment covering the playhead yet.
  //   ready     — audio confirmed present and a covering segment is available;
  //               playback proceeds. Oscillates with `buffering` during play.
  //   buffering — playing, but the playhead has outrun BOTH tracks' downloaded
  //               frontiers and more is still streaming; playhead is held here
  //               until a covering segment lands (task E3).
  //   none      — nothing was recorded (both tracks empty/absent).
  //   error     — network/exception before any segment decoded (retryable).
  // NOTE: the E2 timeline rebuild is driven by the SEPARATE `audioConfirmed`
  // latch below, NOT by this state — so ready↔buffering churn can never flip
  // the compressed→identity mapping back and forth. See audioConfirmed.
  type AudioState = 'idle' | 'loading' | 'ready' | 'buffering' | 'none' | 'error';
  const [audioState, setAudioState] = useState<AudioState>('idle');
  // Ref mirror so playback callbacks never read a stale closure — the exact
  // bug that made play-before-load permanently silent (2026-07-04).
  const audioStateRef = useRef<AudioState>('idle');
  const setAudioStateBoth = useCallback((s: AudioState) => {
    audioStateRef.current = s;
    setAudioState(s);
  }, []);
  // Download progress for the "Audio loading…" pill — combined across the
  // student + tutor fetches (see loadAudio / readWithProgress above).
  const [audioProgress, setAudioProgress] = useState<AudioLoadProgress>({ loadedBytes: 0, totalBytes: null });
  const audioProgressBytesRef = useRef({ student: 0, tutor: 0 });
  const audioProgressTotalsRef = useRef<{ student: number | null; tutor: number | null }>({ student: null, tutor: null });
  // Throttle re-renders to whole-MB granularity — chunk callbacks can fire
  // hundreds of times over an 80MB download and the pill only shows MB.
  const lastReportedMBRef = useRef(-1);
  const reportProgress = useCallback(() => {
    const { student, tutor } = audioProgressBytesRef.current;
    const loaded = student + tutor;
    const { student: sTotal, tutor: tTotal } = audioProgressTotalsRef.current;
    const total = sTotal != null && tTotal != null ? sTotal + tTotal : null;
    const loadedMB = Math.floor(loaded / 1_000_000);
    if (loadedMB === lastReportedMBRef.current) return;
    lastReportedMBRef.current = loadedMB;
    setAudioProgress({ loadedBytes: loaded, totalBytes: total });
  }, []);
  const [studentMuted, setStudentMuted] = useState(false);
  const [tutorMuted, setTutorMuted] = useState(false);
  const studentMutedRef = useRef(false);
  const tutorMutedRef = useRef(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  // Progressive per-track segment queues (task E3) — replace the old
  // whole-file raw/buffer refs. Segments are decoded into AudioContext-owned
  // AudioBuffers as bytes arrive; playback schedules one source at a time per
  // track and chains the next via `onended`.
  const studentTrackRef = useRef<TrackStream | null>(null);
  const tutorTrackRef = useRef<TrackStream | null>(null);
  const studentSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const tutorSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const studentGainRef = useRef<GainNode | null>(null);
  const tutorGainRef = useRef<GainNode | null>(null);
  // Per-track generation counter — bumped whenever a track's source is stopped
  // or rescheduled, so a stale queued `onended` (from a source we've since
  // torn down on a seek/hot-attach) can't chain the wrong segment.
  const studentGenRef = useRef(0);
  const tutorGenRef = useRef(0);
  // `waiting` per track: playback wants this track at the current position but
  // no decoded segment covers it yet (its frontier hasn't reached the
  // playhead). Cleared when a covering segment lands and hot-attaches.
  const studentWaitingRef = useRef(false);
  const tutorWaitingRef = useRef(false);
  // True once audio is confirmed genuinely present (first segment decoded).
  // This — NOT audioState — is the single latched trigger for E2's
  // compressed→identity timeline rebuild (REQUIRED item #2): it flips false→
  // true exactly once and never reverts, so the identity mapping, once
  // trusted, stays trusted through any later ready↔buffering churn.
  // Round 29 (replay honesty): final per-track audio coverage in seconds,
  // set once both track downloads complete. When a track's recording is
  // shorter than the session timeline (recorder drift/truncation — the
  // 2026-07-24 audit: 27min of tutor audio against an 80min session), the
  // replay used to go silent with no indication; now the shortfall is a
  // visible fact in the status row.
  const [audioCoverageSec, setAudioCoverageSec] = useState<{ student: number; tutor: number } | null>(null);
  const [audioConfirmed, setAudioConfirmed] = useState(false);
  const audioConfirmedRef = useRef(false);
  const confirmAudio = useCallback(() => {
    if (audioConfirmedRef.current) return;
    audioConfirmedRef.current = true;
    setAudioConfirmed(true);
    // First segment decoded ⇒ audio is playable NOW; flip the pill off
    // "Audio loading…" so "Audio on" + the mute controls appear immediately,
    // instead of waiting for the whole (tens-of-MB) download to finish.
    if (audioStateRef.current === 'loading') setAudioStateBoth('ready');
  }, [setAudioStateBoth]);
  // True while the playhead is frozen waiting for the frontier to catch up.
  const bufferingRef = useRef(false);
  // Compressed-ms position the playhead is frozen at while buffering; playback
  // resumes once the max downloaded frontier passes it.
  const bufferingHeldMsRef = useRef(0);

  const playingRef = useRef(false);
  const currentTimeMsRef = useRef(0);
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
  // position = anchorMs + (ctx.currentTime − anchorCtxTime)·1000; rAF
  // becomes just the render heartbeat. Without audio, frame deltas remain
  // the fallback. Anchors re-set on every play/seek (playback is always 1x —
  // task R1 removed the 1x/2x/4x/8x speed control, so there is no longer a
  // speed-change re-anchor case).
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

  // Whether stored whiteboard timestamps are trustworthy CAPTURE times.
  // Two data generations exist:
  //   - capture-stamped (embeds from 2026-07-15 on): every mirror batch is
  //     stamped at append time — many distinct values, ~one per tutor turn.
  //   - save-stamped (legacy): the periodic flush stamped the WHOLE array
  //     with `now`, and each flush $set-replaces it wholesale, so the stored
  //     stamps collapse onto one (or a couple of) flush moments clustered at
  //     the END of the session. Treating those as item times pins every
  //     command to the scrubber's final seconds — live-tested 2026-07-15 as
  //     "Whiteboard 0 / 50 items" at every reachable playhead position (the
  //     old `allSameTimestamp` check passed a single stray second stamp).
  // So require genuine spread — every stamp parseable and at least one
  // distinct time per 10 commands — before trusting them; anything less
  // falls back to transcript-derived timing in sortedWb, which reveals each
  // item at the message that produced it.
  const wbTimesUsable = useMemo(() => {
    const wbTimes = whiteboardCommands.map(w => new Date(w.timestamp).getTime());
    if (wbTimes.length === 0 || wbTimes.some(t => !Number.isFinite(t))) return false;
    const distinct = new Set(wbTimes).size;
    return distinct > 1 && distinct >= Math.ceil(wbTimes.length / 10);
  }, [whiteboardCommands]);

  // The one compressed coordinate system every offset below maps through.
  //
  // hasAudio ordering note (tasks E2 + E3): the `hasAudio` PROP is a persisted
  // DB flag known synchronously at render — but the loader's own comment
  // (loadAudio, "flag may not be set due to race condition on session end")
  // says it can be a false negative, and it's never updated to reflect the
  // actual fetch outcome. The GROUND TRUTH for "audio is really playable" is
  // that we have actually decoded audio bytes for this session — but that
  // resolves ASYNCHRONOUSLY, after modal open, after this timeline is first
  // built. So we drive the rebuild off `audioConfirmed`, latched true the
  // instant the FIRST segment decodes (task E3 progressive load). That is the
  // earliest moment the identity mapping is trustworthy (single-attempt +
  // audio present, both now known) — and, being a one-way latch, it fires the
  // rebuild EXACTLY once and never reverts, even as audioState later churns
  // ready↔buffering (REQUIRED item #2). Before it, `hasAudio` is false and
  // behavior is identical to pre-E2 (compressed) — the safe audio-less
  // default. The one compressed→identity swap it triggers can land mid-
  // playback; the swap effect below remaps currentTimeMs through the old→new
  // mappings so the handle/reveal/audio never jump backward (REQUIRED #1).
  const audioAvailable = audioConfirmed;
  const compressedTimeline = useMemo(() => {
    const realOffsets = [
      ...transcript.map(t => new Date(t.timestamp).getTime() - startMs),
      ...debugEvents.map(d => new Date(d.timestamp).getTime() - startMs),
      ...(wbTimesUsable ? whiteboardCommands.map(w => new Date(w.timestamp).getTime() - startMs) : []),
    ];
    return buildCompressedTimeline(realOffsets, realEndMs, { hasAudio: audioAvailable });
  }, [transcript, debugEvents, whiteboardCommands, wbTimesUsable, startMs, realEndMs, audioAvailable]);

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
    if (wbTimesUsable) {
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
  }, [whiteboardCommands, transcript, startMs, totalDurationMs, wbTimesUsable, compressedTimeline]);

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

  // Store totalDurationMs / re-seek points / audio mapping in refs so tick
  // doesn't need deps
  const totalDurationMsRef = useRef(totalDurationMs);
  totalDurationMsRef.current = totalDurationMs;
  const audioReseekEndsRef = useRef<number[]>([]);
  audioReseekEndsRef.current = compressedTimeline.audioReseekEndsMs;
  const toAudioRef = useRef(compressedTimeline.toAudio);
  toAudioRef.current = compressedTimeline.toAudio;
  // Playhead frozen by an in-flight scrub debounce (task E3, Step 5): during a
  // drag we move only the visual playhead and hold the clock until the trailing
  // edge commits the audio restart. Distinct from bufferingRef (frontier wait).
  const seekPendingRef = useRef(false);

  // Animation loop — stable reference, reads everything from refs
  const tick = useCallback((now: number) => {
    if (!playingRef.current) return;

    // Frozen states: either the playhead is waiting for the download frontier
    // to catch up (buffering) or a scrub debounce is in flight. Keep the rAF
    // heartbeat alive (so a resume/commit can re-render) but do NOT advance —
    // the clock re-anchors when playback actually resumes, so no buffering /
    // scrub time leaks into the position.
    if (bufferingRef.current || seekPendingRef.current) {
      lastFrameRef.current = now;
      rafRef.current = requestAnimationFrame(tick);
      return;
    }

    const delta = now - lastFrameRef.current;
    lastFrameRef.current = now;

    // A4: audio clock is the master when live (survives rAF throttling);
    // frame-delta accumulation only when there's no running audio context.
    const ctx = audioCtxRef.current;
    const prevTime = currentTimeMsRef.current;
    const newTime = Math.min(
      clockAnchorCtxRef.current !== null && ctx && ctx.state === 'running'
        ? clockAnchorMsRef.current + (ctx.currentTime - clockAnchorCtxRef.current) * 1000
        : currentTimeMsRef.current + delta,
      totalDurationMsRef.current,
    );

    // Buffering (task E3): only the PLAYHEAD outrunning BOTH tracks' decoded
    // frontiers — while more is still streaming — holds. A track whose frontier
    // simply hasn't reached the playhead yet stays silent on its own (handled
    // in startTrackSource); it never blocks the other track or the clock.
    if (audioConfirmedRef.current) {
      const st = studentTrackRef.current;
      const tt = tutorTrackRef.current;
      const maxFrontierSec = Math.max(st?.frontierSec ?? 0, tt?.frontierSec ?? 0);
      const bufSec = toAudioRef.current(newTime) / 1000;
      const anyStreaming = (st ? !st.done : false) || (tt ? !tt.done : false);
      if (bufSec >= maxFrontierSec && anyStreaming) {
        // Freeze at newTime (never backward) and stop the now-exhausted
        // sources; onSegmentLanded resumes once the frontier passes here.
        bufferingRef.current = true;
        bufferingHeldMsRef.current = newTime;
        setAudioStateBoth('buffering');
        currentTimeMsRef.current = newTime;
        setCurrentTimeMs(newTime);
        applyTime(newTime);
        studentGenRef.current++; tutorGenRef.current++;
        try { studentSourceRef.current?.stop(); } catch {}
        try { tutorSourceRef.current?.stop(); } catch {}
        studentSourceRef.current = null; tutorSourceRef.current = null;
        studentWaitingRef.current = true; tutorWaitingRef.current = true;
        lastFrameRef.current = now;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
    }

    currentTimeMsRef.current = newTime;
    setCurrentTimeMs(newTime);
    applyTime(newTime);

    // Wall-clock audio tracks only (audioReseekEndsMs is empty for resumed
    // sessions AND for single-attempt-with-audio, which E2 leaves uncompressed
    // — so this scan is effectively dormant whenever audio actually plays; it
    // remains for the pre-confirm compressed transient): crossing the END of a
    // capped gap means the sources just played only the first 8s of a longer
    // recorded silence — re-seek them at the mapped wall offset so speech after
    // the gap stays aligned. Re-seek points are rare, so a linear scan is fine.
    if (clockAnchorCtxRef.current !== null) {
      for (const reseekEnd of audioReseekEndsRef.current) {
        if (prevTime < reseekEnd && reseekEnd <= newTime) {
          startAudioPlaybackRef.current(newTime);
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
  }, [applyTime, setAudioStateBoth]); // deps have stable identity, so tick is stable

  // Audio: load files when modal opens — try regardless of hasAudio flag
  // (flag may not be set due to race condition on session end).
  //
  // Progressive (task E3): each track's bytes stream in and are decoded into
  // ~20s AudioBuffer segments as they arrive, so playback can start within a
  // second or two of the FIRST segment instead of after the whole (tens-of-MB)
  // download. `audioConfirmed` latches true on the first decoded segment (the
  // E2 identity-timeline trigger); `onSegmentLanded` hot-attaches / un-buffers
  // as later segments land. Final states: none (nothing decoded — nothing was
  // recorded), error (network/exception BEFORE any segment; retryable), else
  // ready once the first segment lands (set via confirmAudio).
  const loadAudio = useCallback(async () => {
    if (!sessionId) { setAudioStateBoth('none'); return; }
    if (audioStateRef.current === 'loading' || audioStateRef.current === 'ready') return;
    setAudioStateBoth('loading');
    audioProgressBytesRef.current = { student: 0, tutor: 0 };
    audioProgressTotalsRef.current = { student: null, tutor: null };
    lastReportedMBRef.current = -1;
    setAudioProgress({ loadedBytes: 0, totalBytes: null });

    // The decode target context. Created here (loadAudio is reached via the
    // "Open Session Replay" click, a user gesture) so segment AudioBuffers are
    // owned by the very context that will play them — the same-context
    // ownership the old lazy-materialize path was protecting (Safari dislikes
    // buffers from a closed/foreign context).
    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      audioCtxRef.current = new AudioContext({ sampleRate: 24000 });
    }
    const ctx = audioCtxRef.current;

    try {
      const tokenParam = audioToken ? `&token=${encodeURIComponent(audioToken)}` : '';
      const [studentResp, tutorResp] = await Promise.all([
        fetch(`/api/tutor/session-audio?sessionId=${sessionId}&role=student${tokenParam}`),
        fetch(`/api/tutor/session-audio?sessionId=${sessionId}&role=tutor${tokenParam}`),
      ]);
      const intHeader = (resp: Response, name: string, fallback: number) =>
        parseInt(resp.headers.get(name) || String(fallback), 10) || fallback;
      const contentLength = (resp: Response): number | null => {
        const raw = resp.headers.get('content-length');
        const n = raw ? parseInt(raw, 10) : NaN;
        return Number.isFinite(n) && n > 0 ? n : null;
      };

      // Seed totals (and paint the pill once) before the — potentially
      // minutes-long — streaming reads below start.
      audioProgressTotalsRef.current = {
        student: studentResp.ok ? contentLength(studentResp) : 0,
        tutor: tutorResp.ok ? contentLength(tutorResp) : 0,
      };
      reportProgress();

      // Pull exactly `n` (even) bytes off the front of a track's pending queue
      // into a fresh, standalone ArrayBuffer safe to Int16-cast.
      const takeBytes = (stream: TrackStream, n: number): ArrayBuffer => {
        const out = new Uint8Array(n);
        let filled = 0;
        while (filled < n && stream.pending.length > 0) {
          const head = stream.pending[0];
          const need = n - filled;
          if (head.length <= need) {
            out.set(head, filled); filled += head.length; stream.pending.shift();
          } else {
            out.set(head.subarray(0, need), filled); filled += need;
            stream.pending[0] = head.subarray(need);
          }
        }
        stream.pendingLen -= n;
        return out.buffer;
      };

      // Decode one segment's bytes into a context-owned AudioBuffer, append it,
      // advance the frontier, confirm audio, and notify the scheduler.
      const appendSegment = (stream: TrackStream, which: 'student' | 'tutor', bytes: ArrayBuffer) => {
        const float32 = pcm16ToFloat32(bytes);
        if (float32.length === 0) return;
        const buffer = ctx.createBuffer(1, float32.length, stream.sampleRate);
        buffer.getChannelData(0).set(float32);
        const startSec = stream.frontierSec;
        const durationSec = buffer.duration;
        stream.segments.push({ startSec, durationSec, buffer });
        stream.frontierSec = startSec + durationSec;
        confirmAudio();
        onSegmentLandedRef.current(which);
      };

      const makeStream = (sampleRate: number): TrackStream => ({
        sampleRate,
        segmentBytes: SEGMENT_SECONDS * sampleRate * 2,
        segments: [], frontierSec: 0, done: false,
        carry: null, pending: [], pendingLen: 0,
      });

      const readTrack = (resp: Response, which: 'student' | 'tutor') => {
        const stream = makeStream(intHeader(resp, 'X-Sample-Rate', 24000));
        (which === 'student' ? studentTrackRef : tutorTrackRef).current = stream;
        return readWithProgress(
          resp,
          (bytesReceived) => { audioProgressBytesRef.current[which] = bytesReceived; reportProgress(); },
          (chunk) => {
            const { data, carry } = alignEvenBytes(stream.carry, chunk);
            stream.carry = carry;
            if (data.length > 0) { stream.pending.push(data); stream.pendingLen += data.length; }
            while (stream.pendingLen >= stream.segmentBytes) {
              appendSegment(stream, which, takeBytes(stream, stream.segmentBytes));
            }
          },
        ).then(() => {
          // Flush the tail (even part; a lone carried odd byte is a half-sample
          // — discard it) as the final segment, then mark the stream complete.
          const tail = stream.pendingLen - (stream.pendingLen % 2);
          if (tail > 0) appendSegment(stream, which, takeBytes(stream, tail));
          stream.done = true;
        });
      };

      await Promise.all([
        studentResp.ok ? readTrack(studentResp, 'student') : Promise.resolve(),
        tutorResp.ok ? readTrack(tutorResp, 'tutor') : Promise.resolve(),
      ]);
      setAudioCoverageSec({
        student: studentTrackRef.current?.frontierSec ?? 0,
        tutor: tutorTrackRef.current?.frontierSec ?? 0,
      });

      const decodedAny =
        (studentTrackRef.current?.segments.length ?? 0) > 0 ||
        (tutorTrackRef.current?.segments.length ?? 0) > 0;
      if (!decodedAny) setAudioStateBoth('none');
      // Normal-completion buffering release (mirror of the catch-path deadlock
      // fix below): if the buffering hold was entered in the awaited-reader
      // window and the tail flush appended ZERO new bytes (a track byte-length
      // that is an exact multiple of the segment size, so readTrack's `.then`
      // tail flush emits nothing), no onSegmentLanded ever fires after this
      // point — both streams are now `done` — so nothing else clears the hold
      // and the playhead freezes until pause/play. Clear it here exactly like
      // the catch clause: drop the hold, flip the pill, and re-anchor onto the
      // frame-delta clock (clockAnchorCtxRef = null) so the playhead runs on.
      else if (bufferingRef.current) {
        bufferingRef.current = false;
        setAudioStateBoth('ready');
        lastFrameRef.current = performance.now();
        clockAnchorCtxRef.current = null;
      }
      // Cast: the top-of-function guard narrows TS's view of the ref away from
      // 'loading', but setAudioStateBoth('loading') above set it at runtime.
      else if ((audioStateRef.current as AudioState) !== 'buffering') setAudioStateBoth('ready');
    } catch (err) {
      console.error('[ReplayPlayer] Audio load error:', err);
      // Keep whatever decoded already (partial playback beats none); only a
      // failure BEFORE the first segment is a hard error.
      if (audioConfirmedRef.current) {
        if (studentTrackRef.current) studentTrackRef.current.done = true;
        if (tutorTrackRef.current) tutorTrackRef.current.done = true;
        if (audioStateRef.current === 'buffering') setAudioStateBoth('ready');
        // Deadlock fix (review finding #1): both tracks are now marked done,
        // so if the error landed WHILE the playhead was frozen in a
        // buffering hold, no future segment will ever land to un-freeze it —
        // tick's top-of-function guard would hold the playhead forever.
        // Clear the hold and re-anchor exactly like stopAudioPlayback's
        // "no live audio" fallback (clockAnchorCtxRef = null ⇒ tick's
        // frame-delta path takes over from here), so the visual clock
        // resumes and can run to the end. Mirrors onSegmentLanded's
        // buffering-resume re-anchor.
        if (bufferingRef.current) {
          bufferingRef.current = false;
          lastFrameRef.current = performance.now();
          clockAnchorCtxRef.current = null;
        }
      } else {
        setAudioStateBoth('error');
      }
    }
  }, [sessionId, audioToken, setAudioStateBoth, reportProgress, confirmAudio]);

  // ---- Progressive segment scheduling (task E3) ----
  // One AudioBufferSourceNode at a time per track; onended chains the next
  // segment. Per-track refs are bundled here so the schedule helpers can treat
  // 'student'/'tutor' uniformly. All read from refs, so they stay stable.
  type TrackKey = 'student' | 'tutor';
  const trackGroup = useCallback((which: TrackKey) => (
    which === 'student'
      ? { stream: studentTrackRef, source: studentSourceRef, gain: studentGainRef, gen: studentGenRef, waiting: studentWaitingRef, mutedRef: studentMutedRef }
      : { stream: tutorTrackRef, source: tutorSourceRef, gain: tutorGainRef, gen: tutorGenRef, waiting: tutorWaitingRef, mutedRef: tutorMutedRef }
  ), []);

  const ensureGain = useCallback((ctx: AudioContext, which: TrackKey): GainNode => {
    const g = trackGroup(which);
    if (!g.gain.current || g.gain.current.context !== ctx) {
      const node = ctx.createGain();
      node.gain.value = g.mutedRef.current ? 0 : 1;
      node.connect(ctx.destination);
      g.gain.current = node;
    }
    return g.gain.current;
  }, [trackGroup]);

  // Schedule segment `index` at `offsetSec`, chaining the next on `onended`.
  // `gen` is captured so a source torn down by a later seek/hot-attach can't
  // chain a stale segment. Ref-indirect because it recurses through onended.
  const scheduleSegmentAtRef = useRef<(which: TrackKey, index: number, offsetSec: number, ctx: AudioContext, gen: number) => void>(() => {});
  const scheduleSegmentAt = useCallback((which: TrackKey, index: number, offsetSec: number, ctx: AudioContext, gen: number) => {
    const g = trackGroup(which);
    const stream = g.stream.current;
    if (!stream || g.gen.current !== gen) return;
    const seg = stream.segments[index];
    if (!seg) {
      // Reached the last decoded segment — resume from the frontier once more
      // arrives (hot-attach), or this is genuinely the end of the track.
      g.source.current = null;
      g.waiting.current = !stream.done;
      return;
    }
    const gain = ensureGain(ctx, which);
    const source = ctx.createBufferSource();
    source.buffer = seg.buffer;
    // playbackRate stays at its default (1) — task R1 removed the 1x/2x/4x/8x
    // speed control, so playback is always real-time.
    source.connect(gain);
    source.onended = () => {
      if (g.gen.current !== gen || !playingRef.current || bufferingRef.current || seekPendingRef.current) return;
      // Derive the next segment's start offset from the MASTER CLOCK rather
      // than assuming offset 0. onended fires at EVENT-DISPATCH time — some
      // latency after the audio actually ended — so scheduling index+1 at
      // offset 0 (the raw segment boundary) replays that latency's worth of
      // audio, leaking event-dispatch jitter into audio position at every
      // ~20s boundary (~180/hr; the error scales with playbackRate) while the
      // ctx-anchored master clock keeps honest time. Compute the current
      // buffer position from the same clock tick() uses and start index+1 at
      // bufSec - seg.startSec (clamped ≥ 0), so the boundary self-corrects.
      const nextSeg = stream.segments[index + 1];
      let offsetSec = 0;
      if (nextSeg) {
        const compressedMs = clockAnchorCtxRef.current !== null && ctx.state === 'running'
          ? clockAnchorMsRef.current + (ctx.currentTime - clockAnchorCtxRef.current) * 1000
          : currentTimeMsRef.current;
        const bufSec = toAudioRef.current(compressedMs) / 1000;
        offsetSec = Math.max(0, bufSec - nextSeg.startSec);
      }
      scheduleSegmentAtRef.current(which, index + 1, offsetSec, ctx, gen);
    };
    source.start(0, offsetSec);
    g.source.current = source;
    g.waiting.current = false;
  }, [trackGroup, ensureGain]);
  scheduleSegmentAtRef.current = scheduleSegmentAt;

  // (Re)start ONE track at buffer-time `bufferSec`: stop its current source,
  // bump its generation, and schedule the covering segment — or mark it
  // waiting if the frontier hasn't reached `bufferSec` yet. Touches only this
  // track, so a slower track never blocks or restarts the other.
  const startTrackSource = useCallback((which: TrackKey, bufferSec: number, ctx: AudioContext) => {
    const g = trackGroup(which);
    g.gen.current++;
    const gen = g.gen.current;
    try { g.source.current?.stop(); } catch {}
    g.source.current = null;
    const stream = g.stream.current;
    if (!stream || stream.segments.length === 0) { g.waiting.current = !(stream?.done ?? true); return; }
    const hit = findSegmentAt(stream.segments, bufferSec);
    if (!hit) { g.waiting.current = !stream.done; return; } // past frontier → silent, wait
    scheduleSegmentAt(which, hit.index, hit.offsetSec, ctx, gen);
  }, [trackGroup, scheduleSegmentAt]);

  // Audio: start (or restart) both tracks from compressed offset `offsetMs`.
  // Async because the AudioContext may be born `suspended` (autoplay policy)
  // and we MUST await `resume()` before `source.start()`, else the first play
  // silently drops audio until the next user interaction. Origin offset is
  // always 0 (capture pads leading silence so sample 0 == session start), so
  // there is no future-scheduling case. toAudio() maps compressed→buffer time.
  const startAudioPlayback = useCallback(async (offsetMs: number) => {
    if (!audioConfirmedRef.current) return; // nothing decoded to play yet
    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      audioCtxRef.current = new AudioContext({ sampleRate: 24000 });
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      try { await ctx.resume(); } catch (err) { console.warn('[ReplayPlayer] AudioContext resume failed', err); }
    }
    const bufferSec = compressedTimeline.toAudio(offsetMs) / 1000;
    startTrackSource('student', bufferSec, ctx);
    startTrackSource('tutor', bufferSec, ctx);
    // A4: anchor the master clock at this exact (position, ctx-time) pair.
    clockAnchorMsRef.current = offsetMs;
    clockAnchorCtxRef.current = ctx.currentTime;
  }, [compressedTimeline, startTrackSource]);
  const startAudioPlaybackRef = useRef(startAudioPlayback);
  startAudioPlaybackRef.current = startAudioPlayback;

  // HOT-ATTACH + un-buffer (task E3): called whenever a new segment lands.
  //  - If buffering, resume once the max frontier passes the frozen playhead.
  //  - Otherwise, if THIS track was silent (its frontier hadn't reached the
  //    playhead) and a covering segment just arrived, start only this track —
  //    the other track keeps playing undisturbed.
  const onSegmentLanded = useCallback((which: TrackKey) => {
    if (!playingRef.current) return;
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    if (bufferingRef.current) {
      // Finding #2: a segment can land inside the 150ms scrub debounce
      // window (seek() already stopped audio and set seekPendingRef before
      // its trailing edge fires). Don't restart playback from the stale
      // bufferingHeldMsRef position here — the trailing-edge seek commit
      // (which re-evaluates buffering itself) owns positioning once it fires.
      if (seekPendingRef.current) return;
      const maxFrontierSec = Math.max(studentTrackRef.current?.frontierSec ?? 0, tutorTrackRef.current?.frontierSec ?? 0);
      const heldBufSec = compressedTimeline.toAudio(bufferingHeldMsRef.current) / 1000;
      if (maxFrontierSec > heldBufSec) {
        bufferingRef.current = false;
        setAudioStateBoth('ready');
        lastFrameRef.current = performance.now();
        startAudioPlaybackRef.current(bufferingHeldMsRef.current);
      }
      return;
    }
    const g = trackGroup(which);
    if (!g.waiting.current) return;
    const bufSec = compressedTimeline.toAudio(currentTimeMsRef.current) / 1000;
    if (g.stream.current && findSegmentAt(g.stream.current.segments, bufSec)) {
      startTrackSource(which, bufSec, ctx);
    }
  }, [compressedTimeline, trackGroup, startTrackSource, setAudioStateBoth]);
  const onSegmentLandedRef = useRef(onSegmentLanded);
  onSegmentLandedRef.current = onSegmentLanded;

  // SWAP-DISCONTINUITY FIX (REQUIRED item #1). When `audioConfirmed` latches
  // true, E2's memo rebuilds the timeline compressed→identity in the SAME
  // render. `currentTimeMsRef` still holds an OLD-compressed offset that the
  // new identity mapping would reinterpret as a (smaller) real offset — a
  // backward jump of the handle, reveal, and audio. Remap it exactly through
  // OLD→real→NEW at the swap instant, in a layout effect (before paint) so
  // nothing flickers. The OLD timeline is single-attempt here (resumed never
  // uncompresses), so its `toAudio` == its `toReal`, giving real ms; the new
  // identity `toCompressed` maps that straight back. We fire ONLY on the
  // false→true edge AND only when totalMs actually changed (a real remap; for
  // resumed sessions the memo re-runs but the mapping is unchanged, so
  // toAudio-as-toReal would NOT hold — the totalMs guard skips those).
  const prevTimelineRef = useRef(compressedTimeline);
  const prevAudioConfirmedRef = useRef(audioConfirmed);
  useLayoutEffect(() => {
    const prevTL = prevTimelineRef.current;
    const justConfirmed = !prevAudioConfirmedRef.current && audioConfirmed;
    if (justConfirmed && compressedTimeline.totalMs !== prevTL.totalMs) {
      const realMs = prevTL.toAudio(currentTimeMsRef.current);
      const remapped = compressedTimeline.toCompressed(realMs);
      currentTimeMsRef.current = remapped;
      setCurrentTimeMs(remapped);
      applyTime(remapped);
      if (playingRef.current) startAudioPlaybackRef.current(remapped);
    }
    prevTimelineRef.current = compressedTimeline;
    prevAudioConfirmedRef.current = audioConfirmed;
  }, [compressedTimeline, audioConfirmed, applyTime]);

  // Audio: stop playback. Bump both generations so any queued `onended` from a
  // segment we're stopping mid-flight cannot chain the next one.
  const stopAudioPlayback = useCallback(() => {
    studentGenRef.current++;
    tutorGenRef.current++;
    try { studentSourceRef.current?.stop(); } catch {}
    try { tutorSourceRef.current?.stop(); } catch {}
    studentSourceRef.current = null;
    tutorSourceRef.current = null;
    studentWaitingRef.current = false;
    tutorWaitingRef.current = false;
    // A4: no live audio ⇒ fall back to frame-delta clock.
    clockAnchorCtxRef.current = null;
  }, []);

  // Trailing-edge debounce for scrub-driven audio restarts (task E3, Step 5).
  const seekDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearSeekDebounce = useCallback(() => {
    if (seekDebounceRef.current) { clearTimeout(seekDebounceRef.current); seekDebounceRef.current = null; }
    seekPendingRef.current = false;
  }, []);

  const play = useCallback(() => {
    if (currentTimeMsRef.current >= totalDurationMs) {
      currentTimeMsRef.current = 0;
      setCurrentTimeMs(0);
      applyTime(0);
    }
    bufferingRef.current = false;
    clearSeekDebounce();
    if (audioStateRef.current === 'buffering') setAudioStateBoth('ready');
    playingRef.current = true;
    setIsPlaying(true);
    lastFrameRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);
    startAudioPlayback(currentTimeMsRef.current);
  }, [totalDurationMs, tick, applyTime, startAudioPlayback, clearSeekDebounce, setAudioStateBoth]);

  const pause = useCallback(() => {
    playingRef.current = false;
    setIsPlaying(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    bufferingRef.current = false;
    clearSeekDebounce();
    if (audioStateRef.current === 'buffering') setAudioStateBoth('ready');
    stopAudioPlayback();
  }, [stopAudioPlayback, clearSeekDebounce, setAudioStateBoth]);

  const reset = useCallback(() => {
    pause();
    currentTimeMsRef.current = 0;
    setCurrentTimeMs(0);
    applyTime(0);
    // Final-review fix wave (2026-07-16, item 3): the unread high-water mark
    // above only re-syncs while the drawer is OPEN (see the effect above).
    // Resetting with the drawer closed left it stamped at whatever count was
    // last seen, which then suppressed the unread badge for transcript
    // bubbles revealed on the next playthrough (they never exceed a
    // high-water mark from a previous, now-rewound playthrough). Reset it
    // here so a fresh playthrough's badge starts from zero.
    lastSeenTranscriptCountRef.current = 0;
  }, [pause, applyTime]);

  const seek = useCallback((timeMs: number) => {
    const clamped = Math.max(0, Math.min(timeMs, totalDurationMs));
    currentTimeMsRef.current = clamped;
    setCurrentTimeMs(clamped);
    applyTime(clamped);
    if (!playingRef.current) return;
    // Debounced audio restart (E1 emits onSeek every pointer move during a
    // drag). Silence audio + freeze the clock NOW (seekPendingRef makes tick
    // hold), move only the visual playhead, and commit the actual source
    // (re)schedule + buffering re-eval on the trailing edge (~150ms after the
    // last onSeek) so a scrub isn't a storm of source restarts.
    stopAudioPlayback();
    seekPendingRef.current = true;
    if (seekDebounceRef.current) clearTimeout(seekDebounceRef.current);
    seekDebounceRef.current = setTimeout(() => {
      seekDebounceRef.current = null;
      seekPendingRef.current = false;
      if (!playingRef.current) return;
      bufferingRef.current = false;
      if (audioStateRef.current === 'buffering') setAudioStateBoth('ready');
      lastFrameRef.current = performance.now();
      startAudioPlaybackRef.current(currentTimeMsRef.current);
    }, 150);
  }, [totalDurationMs, applyTime, stopAudioPlayback, setAudioStateBoth]);

  // Update gain when mute toggles — mirror into the ref so newly scheduled
  // segment sources pick up the current mute without reading React state.
  useEffect(() => {
    studentMutedRef.current = studentMuted;
    if (studentGainRef.current) studentGainRef.current.gain.value = studentMuted ? 0 : 1;
  }, [studentMuted]);
  useEffect(() => {
    tutorMutedRef.current = tutorMuted;
    if (tutorGainRef.current) tutorGainRef.current.gain.value = tutorMuted ? 0 : 1;
  }, [tutorMuted]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (seekDebounceRef.current) clearTimeout(seekDebounceRef.current);
      try { studentSourceRef.current?.stop(); } catch {}
      try { tutorSourceRef.current?.stop(); } catch {}
      audioCtxRef.current?.close();
    };
  }, []);

  // Auto-scroll chat (task R3: only meaningful while the drawer is open — the
  // bubbles keep revealing underneath while it's closed, but there's nothing
  // to scroll into view; this also fires the instant the drawer opens,
  // landing on the newest bubble immediately).
  useEffect(() => {
    if (!drawerOpen) return;
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [visibleTranscriptCount, drawerOpen]);

  // Scroll containment (task R1): the modal is `fixed inset-0` over whatever
  // hosts it — a long admin table, or (for students) the portal iframe's
  // page — so exhausting scroll inside a pane chains to the page behind it,
  // most visibly as iOS Safari's rubber-band overscroll. Lock body scroll
  // for as long as the modal is open, capturing whatever value was already
  // there (rather than assuming '') so a host page with its own overflow
  // setting gets it back intact, and restore it on close/unmount either way.
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  // Whiteboard scale-to-fit (task R2). WhiteboardCanvas is rendered inside
  // `wbContentRef` at a FIXED design width (REPLAY_BOARD_DESIGN_WIDTH_PX,
  // matching the live board's max-w-3xl column) so its cards/diagrams lay
  // out exactly as they do live, then the whole thing is CSS-scaled down to
  // fit whatever width the pane (`wbPaneRef`) actually has — measured, not
  // assumed, so this keeps working unchanged when R3 widens the pane to a
  // board-dominant layout. See replay-board-fit.ts for why a fixed design
  // width + uniform scale beats letting the board's own fluid layout shrink
  // to the pane width (it would silently mismatch proportions rather than
  // fail loudly).
  const wbPaneRef = useRef<HTMLDivElement>(null);
  const wbContentRef = useRef<HTMLDivElement>(null);
  const [wbContainerWidth, setWbContainerWidth] = useState(0);
  const [wbContentSize, setWbContentSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Depends on `isOpen`: the pane this ref points to only exists in the
    // DOM once the modal is open (the `!isOpen` early-return below renders a
    // plain button instead). An empty dep array would run this effect
    // exactly once, at the component's very first mount — while `isOpen` is
    // still its initial `false` and `wbPaneRef.current` is still null — and
    // never again, permanently skipping the observer once the modal
    // actually mounts. Re-running on `isOpen` toggles re-attaches it every
    // time the pane comes into existence.
    if (!isOpen) return;
    const pane = wbPaneRef.current;
    if (!pane || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w != null) setWbContainerWidth(w);
    });
    ro.observe(pane);
    return () => ro.disconnect();
  }, [isOpen]);

  useEffect(() => {
    // Also gated on `isOpen` (see the container-width effect above for why):
    // if the modal is closed and reopened without a full page remount,
    // `visibleWbCount` alone might not change between the close and the
    // reopen, which would leave this effect pointed at a stale/torn-down
    // DOM node instead of re-attaching to the freshly mounted one.
    if (!isOpen) return;
    const content = wbContentRef.current;
    if (!content || typeof ResizeObserver === 'undefined') return;
    // Observes the UNSCALED content wrapper — ResizeObserver reports layout
    // size (unaffected by the `transform: scale()` we apply to this same
    // element for painting), so this stays the honest natural size even
    // while scaled. scrollWidth/scrollHeight (not the observed contentRect)
    // are used so any element that overflows past the design width is
    // captured too, not just the CSS-set width.
    const measure = () => setWbContentSize({ width: content.scrollWidth, height: content.scrollHeight });
    const ro = new ResizeObserver(measure);
    ro.observe(content);
    measure();
    return () => ro.disconnect();
  }, [isOpen, visibleWbCount]);

  const { ratio: wbRatio, scaledHeight: wbScaledHeight } = useMemo(
    () => computeReplayBoardFit({
      containerWidth: wbContainerWidth,
      contentWidth: wbContentSize.width,
      contentHeight: wbContentSize.height,
    }),
    [wbContainerWidth, wbContentSize],
  );

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
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overscroll-contain">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b bg-gray-50">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Session Replay</h2>
            <p className="text-xs text-gray-500">
              {studentName || 'Anonymous'} — {subject}/{topic} — {formatTime(totalDurationMs)} total
            </p>
          </div>
          <div className="flex items-center gap-1">
            {/* Transcript drawer toggle (task R3) — chat icon consistent with
                this header's existing icon buttons; badge shows bubbles that
                revealed while the drawer was closed and clears on open. */}
            <button
              onClick={() => setDrawerOpen((o) => !o)}
              title="Transcript"
              className="relative p-2 hover:bg-gray-200 rounded-lg"
            >
              <MessageSquareText className="h-5 w-5 text-gray-500" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center min-w-[16px] h-[16px] px-1 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                  {unreadCount}
                </span>
              )}
            </button>
            <button onClick={() => { pause(); setIsOpen(false); }} className="p-2 hover:bg-gray-200 rounded-lg">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Main content (task R3) — the board is now the permanent, full-width
            fixture (R2's scale-to-fit scaler measures `wbPaneRef`, which is
            this whole pane now, and adapts automatically); the conversation
            moved into a slide-in drawer, toggled from the header button
            above. This `relative` region is the drawer's positioning
            context, mirroring SessionStage's `fixed inset-0` stage root
            (SessionStage.tsx ~256, drawer ~561-583) scoped down to this
            modal's content box. */}
        <div className="flex-1 relative overflow-hidden">
          {/* Whiteboard — fills the content area */}
          <div className="absolute inset-0 flex flex-col">
            <div className="px-4 py-2 border-b bg-gray-50 flex items-center justify-between">
              {/* Denominator is sortedWb (the REPLAYABLE set), not the raw
                  store — legacy fallback timing can carry fewer items than
                  are stored, and "0 / 50" with a max reveal of 6 reads as
                  broken rather than approximate. */}
              <h3 className="text-sm font-medium text-gray-700">
                Whiteboard
                <span className="ml-2 text-xs text-gray-400">{visibleWbCount} / {sortedWb.length} items</span>
              </h3>
            </div>
            <div ref={wbPaneRef} className="flex-1 overflow-y-auto overscroll-contain">
              {visibleCommands.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                  No whiteboard content yet...
                </div>
              ) : (
                // Scale-to-fit wrapper (task R2): the outer div reports the
                // SCALED height to the scrollable pane above (so scrolling
                // matches the shrunk visual size); the inner div is fixed at
                // the live board's design width and CSS-scaled down/up to
                // fit. `overflow: hidden` is a safety net for any rounding —
                // the transform itself already paints entirely within the
                // scaled box, nothing is expected to actually clip.
                <div style={{ height: wbScaledHeight || undefined, overflow: 'hidden' }}>
                  <div
                    ref={wbContentRef}
                    style={{
                      width: REPLAY_BOARD_DESIGN_WIDTH_PX,
                      transform: `scale(${wbRatio})`,
                      transformOrigin: 'top left',
                    }}
                  >
                    <WhiteboardCanvas commands={visibleCommands} chrome="replay" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Transcript drawer backdrop — closes the drawer on backdrop tap,
              same as SessionStage's ~562. */}
          {drawerOpen && (
            <div
              className="absolute inset-0 z-40 bg-slate-900/20 backdrop-blur-[2px]"
              onClick={() => setDrawerOpen(false)}
            />
          )}

          {/* Transcript drawer — desktop right slide-in, mobile bottom sheet.
              Classes mirror SessionStage's drawer (~570) almost verbatim:
              same transform/transition idiom, same closed-state handling
              (mobile `hidden` removes it from layout entirely rather than
              relying on an off-screen translate — SessionStage's comment
              there explains why iOS Safari needs that). Kept ALWAYS mounted
              (not conditionally rendered on drawerOpen) so bubbles keep
              revealing underneath while closed and the auto-scroll effect
              above can act the instant it opens. */}
          <div
            className={`absolute z-50 bg-white shadow-2xl flex-col transition-transform duration-300 inset-x-0 top-[16%] bottom-0 rounded-t-3xl border-t border-slate-200 md:top-0 md:left-auto md:right-0 md:w-[380px] md:rounded-none md:rounded-l-3xl md:border-t-0 md:border-l ${
              drawerOpen
                ? 'flex translate-y-0 md:translate-x-0'
                : 'hidden md:flex translate-y-full md:translate-y-0 md:translate-x-full'
            }`}
          >
            <div className="md:hidden flex justify-center pt-2.5 shrink-0">
              <span className="w-10 h-1.5 rounded-full bg-slate-300" />
            </div>
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <MessageSquareText className="w-4 h-4 text-gray-400" /> Transcript
              </h3>
              <button
                onClick={() => setDrawerOpen(false)}
                className="grid place-items-center w-8 h-8 rounded-full hover:bg-gray-100 text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 py-3 space-y-2">
              {visibleMessages.length === 0 && (
                <p className="text-gray-400 text-sm text-center py-8">Press play to start replay...</p>
              )}
              {visibleMessages.map((entry, i) => (
                <TranscriptBubble key={i} entry={entry} />
              ))}
              <div ref={chatEndRef} />
            </div>
          </div>
        </div>

        {/* Controls (task W2: thinned to play/pause + restart — the
            audio-status pill, Student/Tutor mute buttons, and the duplicate
            time display that used to crowd this row at 390px are gone; the
            loading/buffering text now lives inline in ReplayTimeline's own
            time row via `audioStatusText` below. Mute state/gain wiring
            stays fully intact in code — see studentMuted/tutorMuted and
            their gain effects above — only the buttons were removed.) */}
        <div className="px-6 py-4 border-t bg-gray-50 space-y-2">
          {(() => {
            // Coverage warning: a track that ends well before the timeline
            // means the tail of this replay is structurally silent (and any
            // audio before it may be time-shifted — see the round-29
            // recorder audit). Surface it instead of replaying a mystery.
            if (!audioCoverageSec) return null;
            const totalSec = totalDurationMs / 1000;
            const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
            const short = (['student', 'tutor'] as const).filter(
              (r) => audioCoverageSec[r] > 0 && audioCoverageSec[r] < totalSec * 0.95,
            );
            if (short.length === 0 || totalSec <= 0) return null;
            return (
              <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1">
                ⚠ Audio covers only {short.map((r) => `${r}: ${fmt(audioCoverageSec[r])}`).join(', ')} of the {fmt(totalSec)} session — the remainder has no recording and earlier audio may be time-shifted.
              </div>
            );
          })()}
          <ReplayTimeline
            events={timeline}
            totalDurationMs={totalDurationMs}
            currentTimeMs={currentTimeMs}
            onSeek={seek}
            audioStatusText={formatInlineAudioStatus(audioState, audioProgress)}
            onAudioRetry={audioState === 'error' ? () => { setAudioStateBoth('idle'); loadAudio(); } : undefined}
          />

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
        </div>
      </div>
    </div>
  );
}
