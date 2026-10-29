/**
 * Opener-filler strip (demo-polish, 2026-10-29).
 *
 * The ack layer speaks a thinking filler ~450 ms after the student's turn
 * ends ("Hmm, let me see."). The brain then habitually opens its first
 * sentence with its own filler ("Okay, let's look at…"), and the two stack:
 * "Okay, let's see. Okay, let's look at the point…" (live
 * embed-1793240679836, Otter recording). When an ack or cover line was
 * spoken for the current turn, the brain's FIRST sentence loses a leading
 * filler word. Fillers only — never a verdict opener ("Exactly,", "Not
 * quite,"): those carry meaning the student is waiting for.
 *
 * Pure; client-safe. The caller decides WHEN (first sentence of a turn
 * whose ack spoke) — this only decides WHAT.
 */

const FILLER_OPENER_RE = /^\s*(okay|ok|alright|all right|so|right|now)\s*[,.—–-]?\s+(?=\S)/i;

/** Words that must remain for the sentence to still be a sentence. */
const MIN_REMAINING_WORDS = 3;

export function stripOpenerFiller(sentence: string): { text: string; removed: string | null } {
  const m = FILLER_OPENER_RE.exec(sentence);
  if (!m) return { text: sentence, removed: null };
  const rest = sentence.slice(m[0].length).trim();
  if (rest.split(/\s+/).filter(Boolean).length < MIN_REMAINING_WORDS) return { text: sentence, removed: null };
  const text = rest.charAt(0).toUpperCase() + rest.slice(1);
  return { text, removed: m[1] };
}
