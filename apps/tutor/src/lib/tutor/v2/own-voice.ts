/**
 * Tutor brain v2 — is this recognised speech the tutor's own voice?
 *
 * The microphone hears the tutor through the speakers, so while it is speaking
 * the recogniser can hand back the tutor's own sentences. Those are not the
 * student. A transcript counts as the tutor's own when most of its words, in
 * order, sit inside what the tutor has just said. Short replies ("yes", "ok")
 * are never treated as an echo: a student's "yes" over the tutor is real.
 *
 * Japanese and Chinese are written without spaces, so split on spaces a whole
 * Japanese sentence was one "word", and the tutor's own Japanese was never
 * recognised as echo. Each character of those scripts is a word of its own
 * here, and counts as half a word towards the minimum: 「はい、そうです」 is
 * too short to be taken for an echo, as "yes it is" is.
 */
import { TUTOR_V2_OWN_VOICE_SKIP } from '../orchestrator/flags';

const CJK_CHAR = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\u30FC]/u;
const SPLIT = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\u30FC]|[^\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\u30FC]+/gu;
// 2026-11-24, \p{M}: a Devanagari word keeps its vowel signs. Cut at them, two Hindi words were five "words", enough to
// be taken for the tutor's own voice.
const words = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{M}\p{N}\s]/gu, ' ').split(/\s+/).filter(Boolean).flatMap((w) => (CJK_CHAR.test(w) ? w.match(SPLIT) ?? [] : [w]));
const weight = (ws: string[]) => ws.reduce((n, w) => n + (CJK_CHAR.test(w) ? 0.5 : 1), 0);
/** A heard word the recogniser may have rendered its own way: a CJK character or a number (三 heard as 3). Only these
 *  are passed over when the tutor did not say them; an English word the tutor did not say is the student's own
 *  ("wait so the derivative…" said over the tutor's "So the derivative…" is a student, final review I1). */
const SLIP = /^(?:\p{N}+|[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\u30FC])$/u;

export function isOwnVoice(transcript: string, recentlySpoken: string[], minWords = 4, share = 0.7, skipSlips: boolean = TUTOR_V2_OWN_VOICE_SKIP): boolean {
  return ownVoiceMatch(words(transcript), words(recentlySpoken.join(' ')), minWords, share, skipSlips).own;
}

/** The words the matcher compares, in its own split (CJK characters one word each). */
export const ownVoiceWords = (s: string): string[] => words(s);

/** The match behind isOwnVoice, with its score (share of the heard words found in order) and where in `said` the best run
 *  began, for the log (Task 7h: a dropped final names the tutor's sentence it matched). */
export interface OwnVoiceMatch { own: boolean; score: number; at: number }
export function ownVoiceMatch(heard: string[], said: string[], minWords = 4, share = 0.7, skipSlips: boolean = TUTOR_V2_OWN_VOICE_SKIP): OwnVoiceMatch {
  if (!heard.length || !said.length) return { own: false, score: 0, at: -1 };
  // Longest run of the transcript's words found in order within what was said.
  let best = 0; let at = -1;
  for (let start = 0; start < said.length; start++) {
    let i = 0; let j = start; let hit = 0; let first = -1;
    while (i < heard.length && j < said.length && j - start < heard.length * 2) {
      if (heard[i] === said[j]) { if (first < 0) first = j; hit += 1; i += 1; j += 1; continue; }
      if (!skipSlips || !SLIP.test(heard[i])) { j += 1; continue; }
      // A CJK character or number the tutor did not say within reach is the recogniser's slip (三 heard as 3): it is
      // passed over, where before it ran past everything the tutor said after it.
      const k = said.indexOf(heard[i], j);
      if (k < 0 || k - start >= heard.length * 2) i += 1; else j = k;
    }
    if (hit > best) { best = hit; at = first; }
  }
  const score = best / heard.length;
  return { own: weight(heard) >= minWords && score >= share, score, at };
}
