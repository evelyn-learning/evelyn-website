/**
 * TTS recovery helpers (round-28b) — the "say less" fallback path.
 *
 * When Cartesia exhausts its retries, the fallback voice should speak a
 * SHORT recovery line rather than the full tail (minimizing time spent in
 * the non-primary voice). The tts-elevenlabs route first asks Haiku for a
 * ≤RECOVERY_MAX_WORDS compression; these pure helpers are the
 * deterministic net when that call times out or fails, plus the PCM
 * conversion the route needs (ElevenLabs emits pcm s16le; the playback
 * queue consumes pcm f32le — the client does `new Float32Array(buf)` on
 * the route's bytes, matching the Cartesia route contract).
 *
 * Pure + React-free — script-tested (test:tts-recovery).
 */

import { ABBREV_TAIL_RE } from './sentence-spacing';

/** Above this, the recovery text gets compressed before speaking. */
export const RECOVERY_MAX_WORDS = 18;

export function needsShortening(text: string): boolean {
  return text.trim().split(/\s+/).length > RECOVERY_MAX_WORDS;
}

/** Sentence-split that tolerates inline $...$ math (no periods inside
 *  spans in practice; decimals like 3.14 don't end on whitespace+capital
 *  so the boundary regex leaves them alone). Round 28: abbreviation
 *  tails ("U.S.", "Ms.") no longer count as boundaries — segments are
 *  re-merged via the shared ABBREV_TAIL_RE (this splitter previously had
 *  no abbreviation guard at all). */
function splitSentences(text: string): string[] {
  const parts = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const out: string[] = [];
  for (const part of parts) {
    const prev = out[out.length - 1];
    if (prev !== undefined && ABBREV_TAIL_RE.test(prev)) {
      out[out.length - 1] = `${prev} ${part}`;
    } else {
      out.push(part);
    }
  }
  return out;
}

/**
 * Deterministic "say less": the LAST question-shaped sentence (the
 * hand-back — the actionable part of a tutor turn), else the first
 * sentence.
 */
export function pickRecoveryLine(text: string): string {
  const sentences = splitSentences(text);
  if (sentences.length <= 1) return text.trim();
  for (let i = sentences.length - 1; i >= 0; i--) {
    if (sentences[i].endsWith('?')) return sentences[i];
  }
  return sentences[0];
}

/** s16le → f32le, scaled into [-1, 1]. */
export function pcm16ToFloat32(samples: Int16Array): Float32Array {
  const out = new Float32Array(samples.length);
  for (let i = 0; i < samples.length; i++) {
    const s = samples[i];
    out[i] = s < 0 ? s / 32768 : s / 32767;
  }
  return out;
}
