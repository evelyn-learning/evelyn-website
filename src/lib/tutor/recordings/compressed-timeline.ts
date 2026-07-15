/**
 * Compressed monotonic timeline (2026-07-15).
 *
 * `startedAt` is $setOnInsert-pinned to a session's FIRST attempt while
 * `duration` is $set to the LATEST attempt's span (session-usage route), so a
 * paused-and-resumed session anchors every post-resume item HOURS past the
 * scrubber's end — the student replay showed one message, "0 / 39" whiteboard
 * items and an empty timeline. Instead of trusting absolute wall-clock
 * offsets, we walk all timestamped items in order and cap each inter-item gap
 * at GAP_CAP_MS (mirroring buildSpeakerSegments' 20s silence cap): a 4.5h
 * resume gap becomes an 8s beat, while a session with no big gaps compresses
 * to (almost) exactly its real timeline. Every consumer — reveal gates,
 * scrubber, speaker strip, debug markers — uses this SAME compressed
 * coordinate system.
 *
 * Audio note: the PCM tracks' coordinate system depends on whether the
 * session was resumed. useAudioRecorder aligns sample 0 with startedAt and
 * silence-pads to wall offsets, so a single-attempt track runs on WALL time:
 * playback maps compressed → wall when scheduling a source and re-seeks the
 * sources at every capped gap's end so speech after a long silence stays
 * aligned. A RESUMED session's attempts each APPEND to the same .pcm16 with
 * T0 re-anchored to the new attempt's start, so that file is concatenated
 * ACTIVE time with no wall gap — wall-clock offsets overshoot the buffer
 * (live-tested 2026-07-15: 13min wall vs ~4min audio → every seek landed
 * past the track's end → total silence). There the compressed playhead
 * itself is the closest available approximation of buffer time, used
 * directly with no re-seeks. buildCompressedTimeline picks the mode per
 * session and exposes it via toAudio() / audioReseekEndsMs.
 *
 * Extracted from ReplayPlayer.tsx (task C1, 2026-07-15) so this pure math can
 * be unit-tested (scripts/test-replay-scrubber.ts) without pulling in
 * ReplayPlayer's React/audio/whiteboard dependency chain.
 */

export const GAP_CAP_MS = 8_000;
// Minimum run-out after the last item so the final reveal isn't glued to the
// scrubber's end; the real trailing gap is honored up to GAP_CAP_MS.
export const MIN_TAIL_MS = 3_000;
// Items ending this far past the recorded `duration` can only mean startedAt
// belongs to an EARLIER attempt than duration — i.e. the session was paused
// and resumed. Slack absorbs flush/finalize timing around a normal close.
export const RESUME_DETECT_SLACK_MS = 60_000;

export interface CompressedTimeline {
  /** Replay length in compressed ms. Always a finite, positive number — see
   *  the totalMs guard in buildCompressedTimeline below; every consumer
   *  (the handle's render guard AND the timeline's click-handler guard)
   *  trusts this invariant instead of each re-deriving its own validity
   *  check. */
  totalMs: number;
  /** Wall-clock offset (ms from startedAt) → compressed offset. NaN input
   *  clamps to the END of the timeline (defensive end-anchor: a late item is
   *  recoverable, an unreachable one is not); negatives clamp to 0. */
  toCompressed: (realMs: number) => number;
  /** Compressed offset → audio-buffer offset (ms). Wall-clock mapping for
   *  single-attempt sessions, identity for resumed ones — see Audio note. */
  toAudio: (compressedMs: number) => number;
  /** Compressed offsets where tick() must re-seek live audio sources (the
   *  ends of capped gaps — wall-clock tracks only; empty for resumed). */
  audioReseekEndsMs: number[];
}

export function buildCompressedTimeline(realOffsetsMs: number[], realEndMs: number): CompressedTimeline {
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
  const rawTotalMs = real.length === 1
    ? Math.max(realEndMs, MIN_TAIL_MS)
    : lastComp + Math.min(Math.max(realEndMs - lastReal, MIN_TAIL_MS), GAP_CAP_MS);
  // Guard against a malformed `startedAt`/`endedAt` (NaN dates) propagating
  // into totalMs — the same class of corrupt-data defect ab39e4a7 hit for
  // markers ("NaN% guard"). Every consumer downstream (the handle's render
  // guard `totalDurationMs > 0` AND the timeline's click-handler guard) must
  // agree on what counts as a usable duration; fixing it HERE, once, at the
  // single shared source, means they can never disagree — no scattered
  // per-consumer validity check can drift out of sync with another one.
  const totalMs = Number.isFinite(rawTotalMs) && rawTotalMs > 0 ? rawTotalMs : Math.max(lastComp, MIN_TAIL_MS);

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

  // Audio coordinate mode — see the Audio note in the block comment above.
  // Single attempt ⇒ tracks run on wall time: map compressed → wall and
  // re-seek at capped-gap ends (exact; preserves pre-compression behavior).
  // Resumed ⇒ tracks are concatenated active time: the compressed playhead
  // is the best proxy for buffer time, so use it as-is and never re-seek
  // (playhead and buffer then advance in lockstep by construction).
  const resumed = lastReal > realEndMs + RESUME_DETECT_SLACK_MS;
  const toAudio = (compressedMs: number): number => (resumed ? compressedMs : toReal(compressedMs));
  const audioReseekEndsMs = resumed ? [] : skipEndsMs;

  return { totalMs, toCompressed, toAudio, audioReseekEndsMs };
}
