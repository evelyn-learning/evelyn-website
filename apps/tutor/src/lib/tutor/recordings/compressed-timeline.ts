/**
 * Compressed monotonic timeline (2026-07-15).
 *
 * `startedAt` is $setOnInsert-pinned to a session's FIRST attempt while
 * `duration` holds ACTIVE seconds only — since 2026-10-03 the total across
 * every sitting of a resumed session (pauses between sittings excluded);
 * before that, the LATEST attempt's span alone. Either way it is shorter than
 * the wall span, so a paused-and-resumed session anchors every post-resume
 * item HOURS past the scrubber's end — the student replay showed one message, "0 / 39" whiteboard
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
 * Attempt-mapped mode (2026-10-03) — the paragraph above is only half true:
 * WITHIN an attempt the recorder silence-pads to wall time, so a resumed
 * track is [attempt 1, wall-aligned][attempt 2, wall-aligned]… with only the
 * gap BETWEEN attempts collapsed. Capping every 8s+ gap while treating the
 * buffer as active time therefore skipped silences the audio still contains
 * (production: audio 37s behind the timeline after one minute, 937s by the
 * end). When the caller supplies per-track attempts (attempt-anchors.ts —
 * from the recorder's sidecar anchors, or derived from debug events for
 * older recordings) the timeline runs on wall time inside every attempt,
 * collapses ONLY the stretch between attempts where no track has audio, and
 * maps each track through its own attempts (toAudioFor). Without attempts
 * the behaviour above is unchanged.
 *
 * Extracted from ReplayPlayer.tsx (task C1, 2026-07-15) so this pure math can
 * be unit-tested (scripts/test-replay-scrubber.ts) without pulling in
 * ReplayPlayer's React/audio/whiteboard dependency chain.
 */

import { attemptAudioLenMs, wallToAudioMs, type AudioAttempt } from './attempt-anchors';

export const GAP_CAP_MS = 8_000;
// Minimum run-out after the last item so the final reveal isn't glued to the
// scrubber's end; the real trailing gap is honored up to GAP_CAP_MS.
export const MIN_TAIL_MS = 3_000;
// Items ending this far past the recorded `duration` can only mean startedAt
// belongs to an EARLIER attempt than duration — i.e. the session was paused
// and resumed. Slack absorbs flush/finalize timing around a normal close.
export const RESUME_DETECT_SLACK_MS = 60_000;

// Attempt starts on different tracks this close together are one remount
// (both recorders restart on the same page mount).
const REMOUNT_CLUSTER_MS = 2_000;

export type AudioRole = 'student' | 'tutor';

/** One track's attempts, for attempt-mapped mode. */
export interface AudioTrackAttempts {
  /** Ascending by audioStartMs (attemptsFromAnchors / deriveLegacyAttempts). */
  attempts: AudioAttempt[];
  /** Track length in ms when known — bounds the last attempt's audio. */
  fileMs?: number | null;
}

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
  /** Compressed offset → wall-clock offset (ms from startedAt). The inverse
   *  of toCompressed (within a collapsed gap: linear across it). */
  toReal: (compressedMs: number) => number;
  /** Compressed offset → audio-buffer offset (ms), track-agnostic. Wall-clock
   *  mapping for single-attempt sessions, identity for resumed ones — see
   *  Audio note. In attempt-mapped mode: the furthest buffer position any
   *  track needs at (or next after) this moment — for download-frontier
   *  checks only; schedule sources with toAudioFor. */
  toAudio: (compressedMs: number) => number;
  /** Compressed offset → offset in ONE track's buffer (ms), or null when that
   *  track holds no audio for the moment (between attempts, or after the
   *  track's attempt ran out) — the source must be stopped, not started.
   *  Outside attempt-mapped mode this is toAudio for both tracks. */
  toAudioFor: (role: AudioRole, compressedMs: number) => number | null;
  /** Compressed offsets where tick() must restart live audio sources: the
   *  ends of capped gaps (wall-clock tracks; empty for legacy resumed), and
   *  in attempt-mapped mode every point where a track's attempt audio ends or
   *  the next attempt begins (a source left running would play straight on
   *  into the next attempt's bytes). */
  audioReseekEndsMs: number[];
}

export interface CompressedTimelineOptions {
  /** True when this session has playable audio AND is single-attempt
   *  (non-resumed). In that case the honest axis is real time: chat and
   *  audio inherently share one clock, so the gap cap is disabled entirely
   *  (compressed timeline == real timeline, no skips, no re-seeks). Audio-less
   *  sessions and RESUMED sessions (even with audio — the structural fix for
   *  those is a separate, later round) keep today's capped/compressed
   *  behavior unconditionally — see the `resumed` check below, which wins
   *  over `hasAudio` on purpose. Optional and additive so existing callers
   *  (and E3) are unaffected. */
  hasAudio?: boolean;
  /** Per-track attempts. Used only with hasAudio, and only when they are
   *  safe to act on: a session that looks resumed must show at least two
   *  attempts on some track, otherwise the legacy resumed behaviour stays
   *  (a single known attempt cannot say where the pause was). */
  audioTracks?: Partial<Record<AudioRole, AudioTrackAttempts>>;
  /** The session is known to have been resumed (e.g. more than one recorded
   *  attempt span) even though `realEndMs` covers its whole wall span, which
   *  defeats the overhang test below. */
  resumed?: boolean;
}

/** Wall intervals between attempts in which NO track has audio. */
function collapsedGaps(tracks: AudioTrackAttempts[]): Array<{ startMs: number; endMs: number }> {
  const starts: number[] = [];
  for (const t of tracks) {
    for (let k = 1; k < t.attempts.length; k++) {
      // A later attempt on the SAME origin (see wallToAudioMs) is no remount gap.
      if (t.attempts[k].wallStartMs > t.attempts[k - 1].wallStartMs) starts.push(t.attempts[k].wallStartMs);
    }
  }
  starts.sort((a, b) => a - b);
  const gaps: Array<{ startMs: number; endMs: number }> = [];
  let prevEnd = -Infinity;
  for (const s of starts) {
    if (s - prevEnd <= REMOUNT_CLUSTER_MS) continue; // other track, same remount
    // The gap opens where the LAST track to fall silent ran out of audio.
    let audioEndMs = -Infinity;
    for (const t of tracks) {
      let j = -1;
      for (let k = 0; k < t.attempts.length; k++) if (t.attempts[k].wallStartMs < s) j = k;
      if (j < 0) continue;
      const len = attemptAudioLenMs(t.attempts, j, t.fileMs);
      if (Number.isFinite(len)) audioEndMs = Math.max(audioEndMs, Math.min(t.attempts[j].wallStartMs + len, s));
    }
    const startMs = Math.max(audioEndMs, prevEnd, 0);
    if (Number.isFinite(audioEndMs) && s > startMs) gaps.push({ startMs, endMs: s });
    prevEnd = s;
  }
  return gaps;
}

export function buildCompressedTimeline(realOffsetsMs: number[], realEndMs: number, opts?: CompressedTimelineOptions): CompressedTimeline {
  // Anchor pairs (real[i], comp[i]), both strictly ascending, seeded with the
  // session origin. Items at or before the origin (clock skew) create no
  // anchor — toCompressed clamps them to 0 instead.
  const sorted = realOffsetsMs.filter((v) => Number.isFinite(v)).sort((a, b) => a - b);
  // Real offsets are cap-independent (they're just the sorted, deduped
  // timestamps), so build this pass BEFORE deciding whether to cap at all —
  // the resume check below needs `lastReal` and must NOT itself depend on the
  // cap that check is about to help choose.
  const itemReal: number[] = [0];
  for (const r of sorted) {
    if (r > itemReal[itemReal.length - 1]) itemReal.push(r); // skip duplicate / pre-origin timestamps
  }
  const lastReal = itemReal[itemReal.length - 1];
  // Resumed sessions must stay byte-identical to today regardless of
  // hasAudio (global constraint — the structural resumed-replay fix is a
  // later round). Only a genuinely single-attempt session with audio gets
  // the uncapped identity axis.
  const resumed = lastReal > realEndMs + RESUME_DETECT_SLACK_MS || opts?.resumed === true;

  // Attempt-mapped mode — see the block comment. Guarded: needs audio, and a
  // resumed-looking session must show ≥2 attempts on some track.
  const mappedTracks: Partial<Record<AudioRole, AudioTrackAttempts>> = {};
  const mappedList: AudioTrackAttempts[] = [];
  if (opts?.hasAudio && opts.audioTracks) {
    for (const role of ['student', 'tutor'] as const) {
      const t = opts.audioTracks[role];
      if (t && t.attempts.length > 0) { mappedTracks[role] = t; mappedList.push(t); }
    }
  }
  const mapped = mappedList.length > 0 && (!resumed || mappedList.some((t) => t.attempts.length > 1));
  const gaps = mapped ? collapsedGaps(mappedList) : [];

  const gapCapMs = mapped || (opts?.hasAudio && !resumed) ? Infinity : GAP_CAP_MS;

  // In mapped mode the collapsed gaps' edges become anchors too, so the
  // piecewise map breaks exactly where the audio does.
  let real = itemReal;
  if (gaps.length > 0) {
    const merged = [...itemReal, ...gaps.flatMap((g) => [g.startMs, g.endMs])].sort((a, b) => a - b);
    real = [0];
    for (const r of merged) if (r > real[real.length - 1]) real.push(r);
  }
  // Compressed length of the segment real[i-1]→real[i]: inside a collapsed
  // gap it takes its proportional share of the gap's (capped) beat.
  const gapScale = (fromMs: number, toMs: number): number => {
    for (const g of gaps) {
      if (fromMs >= g.startMs && toMs <= g.endMs) return Math.min(1, GAP_CAP_MS / (g.endMs - g.startMs));
    }
    return 1;
  };

  const comp: number[] = [0];
  const skipEndsMs: number[] = [];
  for (let i = 1; i < real.length; i++) {
    const gap = real[i] - real[i - 1];
    const c = comp[comp.length - 1] + (mapped ? gap * gapScale(real[i - 1], real[i]) : Math.min(gap, gapCapMs));
    if (gap > gapCapMs) skipEndsMs.push(c);
    comp.push(c);
  }
  const lastComp = comp[comp.length - 1];
  // Tail: honor the real run-out after the last item, bounded to the gap cap.
  // The max() matters for resumed sessions, where realEndMs (duration spans
  // only the latest attempt) can land BEFORE the last item's real offset.
  // With no items at all there is nothing to compress — keep the real length.
  // (`real` may end on a gap edge in mapped mode; the tail is still measured
  // from the last ITEM, so re-base it onto the last anchor.)
  const rawTotalMs = real.length === 1
    ? Math.max(realEndMs, MIN_TAIL_MS)
    : lastComp + Math.max(0, Math.min(Math.max(realEndMs - lastReal, MIN_TAIL_MS), gapCapMs) - (real[real.length - 1] - lastReal));
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
      return Math.min(comp[i] + Math.min(realMs - real[i], gapCapMs), totalMs);
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
  // (playhead and buffer then advance in lockstep by construction). `resumed`
  // was already computed above (it decided gapCapMs) — reused here as-is.
  if (!mapped) {
    const toAudio = (compressedMs: number): number => (resumed ? compressedMs : toReal(compressedMs));
    const audioReseekEndsMs = resumed ? [] : skipEndsMs;
    return { totalMs, toCompressed, toReal, toAudio, toAudioFor: (_role, compressedMs) => toAudio(compressedMs), audioReseekEndsMs };
  }

  // Attempt-mapped: each track through its own attempts. A track with no
  // attempts of its own (file missing, or nothing derivable for it) stays on
  // the wall clock, which is what the axis now is.
  const toAudioFor = (role: AudioRole, compressedMs: number): number | null => {
    const t = mappedTracks[role];
    const wallMs = toReal(compressedMs);
    return t ? wallToAudioMs(t.attempts, wallMs) : wallMs;
  };
  // Furthest buffer position any track needs now — or, where a track is
  // silent, at its next attempt (so a frontier check waits for the bytes
  // playback is about to need).
  const toAudio = (compressedMs: number): number => {
    const wallMs = toReal(compressedMs);
    let furthest = 0;
    for (const t of mappedList) {
      const at = wallToAudioMs(t.attempts, wallMs);
      const next = at ?? t.attempts.find((a) => a.wallStartMs > wallMs)?.audioStartMs ?? 0;
      if (next > furthest) furthest = next;
    }
    return furthest;
  };
  // Restart points: wherever some track's attempt audio ends (stop it) or an
  // attempt begins (start it at the mapped offset). That includes the FIRST
  // attempt when it starts after the session origin: before it the track
  // maps to null and the player stops it, and only a restart point (or a
  // seek / pause-play) starts it again — without this, playing from zero
  // stayed silent until the user scrubbed. A first attempt at or before the
  // origin is dropped by the `w > 0` filter below.
  const reseekWall = new Set<number>();
  for (const t of mappedList) {
    for (let k = 0; k < t.attempts.length; k++) {
      reseekWall.add(t.attempts[k].wallStartMs);
      const len = attemptAudioLenMs(t.attempts, k, k < t.attempts.length - 1 ? t.fileMs : null);
      if (Number.isFinite(len)) reseekWall.add(t.attempts[k].wallStartMs + len);
    }
  }
  const audioReseekEndsMs = [...new Set([...reseekWall].filter((w) => w > 0).map(toCompressed))]
    .filter((c) => c > 0 && c < totalMs)
    .sort((a, b) => a - b);

  return { totalMs, toCompressed, toReal, toAudio, toAudioFor, audioReseekEndsMs };
}
