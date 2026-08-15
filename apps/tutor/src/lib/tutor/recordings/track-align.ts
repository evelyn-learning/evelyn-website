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
