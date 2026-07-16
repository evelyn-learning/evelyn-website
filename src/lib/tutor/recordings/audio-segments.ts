/**
 * Pure math/byte helpers for progressive session-audio playback (task E3).
 *
 * ReplayPlayer decodes an arriving raw-PCM16 track into ~20s AudioBuffer
 * *segments* as bytes land, instead of awaiting the whole (tens-of-MB) file.
 * The two fiddly, off-by-one-prone bits are extracted here so they can be
 * unit-tested (scripts/test-replay-scrubber.ts) WITHOUT dragging in the
 * component's React/Web-Audio/whiteboard dependency chain — the same reason
 * compressed-timeline.ts was extracted in task C1.
 *
 * Nothing here touches the Web Audio API: `alignEvenBytes` is pure byte
 * bookkeeping and `findSegmentAt` is pure interval math. The actual
 * AudioBuffer decode/schedule wiring stays in ReplayPlayer where the shared
 * AudioContext lives.
 */

/**
 * PCM16 samples are 2 bytes each, but a streamed fetch hands us chunks split
 * at arbitrary byte boundaries — a chunk can end mid-sample. Casting an
 * odd-length byte run to Int16Array would drop/misalign the trailing byte and
 * desync every subsequent sample (a rising static hiss). This carries the
 * dangling odd byte across reads: prepend the previous carry, then peel off a
 * new trailing byte if the (possibly extended) run is still odd, so the
 * returned `data` is always even-length and safe to Int16-cast.
 *
 * Invariant: concatenating every returned `data` (in call order), with the
 * final leftover `carry` appended, reproduces the original byte stream exactly
 * — no byte is ever lost or duplicated.
 */
export function alignEvenBytes(
  carry: number | null,
  incoming: Uint8Array,
): { data: Uint8Array; carry: number | null } {
  let data = incoming;
  if (carry !== null) {
    const merged = new Uint8Array(incoming.length + 1);
    merged[0] = carry;
    merged.set(incoming, 1);
    data = merged;
  }
  if (data.length % 2 === 1) {
    return { data: data.subarray(0, data.length - 1), carry: data[data.length - 1] };
  }
  return { data, carry: null };
}

export interface SegmentSpan {
  /** Buffer-time offset (seconds) of this segment's first sample. */
  startSec: number;
  /** Length of this segment in seconds. */
  durationSec: number;
}

/**
 * Find the segment covering buffer-time `tSec` and the intra-segment offset to
 * start a source at. Segments are contiguous and ascending by `startSec`
 * (segment i+1 starts where segment i ends), so this is a clean binary search.
 *
 * Returns null when `tSec` is negative or at/past the downloaded frontier
 * (`startSec + durationSec` of the last segment) — the caller treats that as
 * "this track has no audio here yet": stay silent and hot-attach once a
 * covering segment lands, or (if the whole track is downloaded) it is simply
 * past the end of the recording.
 */
export function findSegmentAt(
  segments: SegmentSpan[],
  tSec: number,
): { index: number; offsetSec: number } | null {
  if (!(tSec >= 0) || segments.length === 0) return null;
  let lo = 0;
  let hi = segments.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const s = segments[mid];
    if (tSec < s.startSec) {
      hi = mid - 1;
    } else if (tSec >= s.startSec + s.durationSec) {
      lo = mid + 1;
    } else {
      return { index: mid, offsetSec: tSec - s.startSec };
    }
  }
  return null;
}

/** Downloaded frontier (seconds) — end of the last decoded segment, or 0. */
export function frontierSec(segments: SegmentSpan[]): number {
  if (segments.length === 0) return 0;
  const last = segments[segments.length - 1];
  return last.startSec + last.durationSec;
}
