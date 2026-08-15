/**
 * Intra-sentence resume-from-cut (P5) — pure clause-tail extraction.
 *
 * When a confirmed-noise pause interrupts the tutor mid-sentence, Stage 3.1
 * re-speaks the WHOLE current sentence from its start (it only tracks unplayed
 * SENTENCES), which makes students afraid to make any sound. This computes the
 * TAIL to resume instead: given the sentence text and the fraction of its audio
 * already played (derived from played vs queued chunk durations — exact word
 * timing isn't available in either TTS path), snap to the latest clause boundary
 * at-or-before the cut and return the tail from there. Early cut (no prior
 * boundary) → restart the whole sentence. See project_tutor_work_queue (P5).
 *
 * Gated behind NEXT_PUBLIC_TUTOR_RESUME_FROM_CLAUSE in the orchestrator. Pure +
 * unit-tested (`npm run test:resume-cut`); the audio plumbing is ear-tested.
 */

/** Coordinating conjunctions / subordinators that BEGIN a clause. Resuming from
 *  one of these is a natural spoken re-entry point ("…and the balloon rises"). */
const CLAUSE_LEADERS = new Set([
  'and', 'but', 'so', 'or', 'yet', 'because', 'while', 'when', 'where',
  'which', 'that', 'if', 'since', 'as', 'though', 'although', 'then',
]);

/**
 * The tail of `sentence` to re-speak after a cut at `fraction` (0..1) of its
 * audio. Snaps to the latest clause boundary at-or-before the cut — a clause
 * boundary is the position right AFTER a comma/semicolon/colon/dash (+space) or
 * right BEFORE a clause-leader word. Returns the whole sentence when the cut is
 * in the opening clause (no earlier boundary → restart). Always re-speaks the
 * clause that CONTAINS the cut, so the student re-grounds on the partial clause
 * plus everything they never heard.
 */
export function clauseTailFromFraction(sentence: string, fraction: number): string {
  const s = String(sentence ?? '');
  if (!s.trim()) return s;
  const f = Math.max(0, Math.min(1, Number.isFinite(fraction) ? fraction : 0));
  const cut = Math.round(f * s.length);

  let best = -1; // latest clause-start offset at-or-before the cut

  // Punctuation boundaries: position is the start of the clause AFTER the mark.
  const punct = /[,;:—–]\s+|\s-\s+/g;
  let m: RegExpExecArray | null;
  while ((m = punct.exec(s)) !== null) {
    const pos = m.index + m[0].length;
    if (pos <= cut) best = Math.max(best, pos);
    else break;
  }

  // Clause-leader word boundaries: position is the start of the leader word.
  const wordRe = /\b([a-zA-Z]+)\b/g;
  while ((m = wordRe.exec(s)) !== null) {
    if (m.index > cut) break;
    if (m.index > 0 && CLAUSE_LEADERS.has(m[1].toLowerCase())) {
      best = Math.max(best, m.index);
    }
  }

  if (best <= 0) return s; // early cut / no boundary → restart the whole sentence
  return s.slice(best).trimStart();
}

/**
 * Precise fraction (0..1) of the current sentence's audio actually HEARD at the
 * moment of a cut. Pure arithmetic over the playback-clock refs kept by
 * useOpenAIRealtime's playNextAudio:
 *
 *  - `playedIncludingCurrentChunkSec` — accumulated dequeued-chunk seconds of
 *    the sentence, where the in-flight chunk was counted IN FULL at dequeue
 *    time (currentSentencePlayedSecRef). Chunk-granular: on the whole-buffer
 *    TTS path (one chunk = one sentence) this alone always reads 1.0.
 *  - `currentChunkDurSec` — duration of the chunk playing right now.
 *  - `inFlightSec` — wall-clock progress into that chunk
 *    (AudioContext.currentTime - chunkStartCtxTime); clamped here to
 *    [0, currentChunkDurSec], so callers may pass it raw. Pass
 *    `currentChunkDurSec` when no live clock is available — the result then
 *    degrades to the old chunk-granular fraction, never worse.
 *  - `queuedSameSentenceSec` — queued-but-unplayed chunk seconds of the SAME
 *    sentence (0 on the whole-buffer path; a lower bound while streaming).
 *
 * played = (playedIncl - currentChunkDur)  ← completed chunks only
 *        + clamp(inFlight, 0, currentChunkDur)
 * total  = playedIncl + queued             ← all arrived audio of the sentence
 *
 * Whole-buffer path: playedIncl = chunkDur = D, queued = 0 → fraction =
 * inFlight/D, a genuine mid-sentence position. Streaming path: same
 * denominator as before (arrived-so-far), numerator now stops at the true
 * playhead instead of the end of the in-flight chunk.
 */
export function preciseSentenceFraction(
  playedIncludingCurrentChunkSec: number,
  currentChunkDurSec: number,
  inFlightSec: number,
  queuedSameSentenceSec: number,
): number {
  const playedIncl = Number.isFinite(playedIncludingCurrentChunkSec)
    ? playedIncludingCurrentChunkSec : 0;
  if (playedIncl <= 0) return 0; // nothing dequeued yet → nothing heard
  const chunkDur = Math.max(0, Number.isFinite(currentChunkDurSec) ? currentChunkDurSec : 0);
  const inFlight = Math.max(0, Math.min(
    Number.isFinite(inFlightSec) ? inFlightSec : chunkDur,
    chunkDur,
  ));
  const queued = Math.max(0, Number.isFinite(queuedSameSentenceSec) ? queuedSameSentenceSec : 0);
  const played = Math.max(0, playedIncl - chunkDur) + inFlight;
  const total = playedIncl + queued;
  return total > 0 ? Math.min(1, played / total) : 0;
}
