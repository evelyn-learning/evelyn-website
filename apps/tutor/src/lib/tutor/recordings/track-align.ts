/**
 * Wall-clock alignment for recorded audio tracks (replay fidelity).
 *
 * Each session records two PCM tracks (student mic, tutor TTS) as chunk
 * streams. Replay plays both files from sample 0 on one shared 24 kHz
 * clock, so a track is only replayed correctly if sample index ≈ wall
 * time — i.e. every wall-clock span with no captured audio must exist in
 * the file as zero-filled silence.
 *
 * The tutor track always did this (silence inserted up to each chunk's
 * offsetMs). The student track did NOT (session-1784194326500: mic capture
 * stops during turn commits / WS reconnects collapsed ~14s of the session,
 * so every later student utterance replayed too early and the tutor
 * audibly "talked over" the student). Both tracks now route through this
 * helper.
 *
 * minGapSamples exists for the student track: mic chunks arrive
 * continuously (~170ms cadence) with scheduler jitter, and chunk offsets
 * are derived from Date.now() — filling every tiny positive gap would
 * sprinkle micro-silences into continuous speech. Gaps below the
 * threshold are treated as jitter and ignored (samples stay contiguous);
 * gaps at/above it are genuine capture holes and get zero-filled. The
 * tutor track passes 0 to keep its original fill-any-gap behavior.
 */

export interface TimedChunk {
  data: Float32Array;
  /** Wall-clock ms of the chunk START relative to session T0. */
  offsetMs: number;
}

export interface AlignResult {
  /** Chunks (audio + inserted silence) to append to the file, in order. */
  aligned: Float32Array[];
  /** Updated total samples written after appending `aligned`. */
  samplesWritten: number;
}

export function buildAlignedChunks(
  chunks: TimedChunk[],
  samplesWritten: number,
  sampleRate: number,
  minGapSamples: number,
): AlignResult {
  const aligned: Float32Array[] = [];
  for (const chunk of chunks) {
    const targetSampleOffset = Math.floor((chunk.offsetMs / 1000) * sampleRate);
    const gap = targetSampleOffset - samplesWritten;
    if (gap > 0 && gap >= minGapSamples) {
      aligned.push(new Float32Array(gap)); // zeros = silence
      samplesWritten += gap;
    }
    aligned.push(chunk.data);
    samplesWritten += chunk.data.length;
  }
  return { aligned, samplesWritten };
}

/**
 * A session origin older than this at recorder mount is a RESUME, not a
 * start: the page restored the session's original `startedAt` and handed it
 * to a brand-new recorder.
 */
export const STALE_ORIGIN_MS = 60_000;

/**
 * The wall-clock origin (T0) a freshly mounted recorder aligns its tracks to.
 *
 * Normally the session's `startedAt`, so sample 0 == session start. But a
 * recorder's samples-written counter starts at 0 on every mount, so handing a
 * RESUMED mount the original `startedAt` makes its first flush silence-pad
 * the entire elapsed session (minutes to hours of zeros in one upload — which
 * the body-size cap rejects, and the roll-back then retries forever). A stale
 * origin is therefore re-seeded to the mount time: the attempt records from
 * "now", and the origin it actually used travels with every chunk
 * (`attemptStartMs`) so the server anchors the attempt (attempt-anchors.ts)
 * and replay places it exactly. 0 = caller supplied nothing ("first audio
 * chunk wins", unchanged).
 */
export function resolveRecorderOrigin(sessionStartedAtMs: number | undefined, mountMs: number): number {
  if (!sessionStartedAtMs || !Number.isFinite(sessionStartedAtMs)) return 0;
  return mountMs - sessionStartedAtMs > STALE_ORIGIN_MS ? mountMs : sessionStartedAtMs;
}
