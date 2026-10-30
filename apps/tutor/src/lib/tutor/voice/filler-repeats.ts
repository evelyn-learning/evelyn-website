/**
 * Spoken fillers and stutter repeats (moved out of correct-retry.ts in Task 18
 * fix round 3 so sentence-board.ts can use them without an import cycle).
 * Pure: no imports.
 */

/** Spoken fillers, as standalone (lower-cased) tokens. */
export const FILLER_TOKENS = new Set(['uh', 'um', 'umm', 'uhm', 'er', 'erm', 'ah', 'hmm', 'like']);

/** Tokens with fillers dropped and an immediately repeated run of one to
 *  four words collapsed ("my department my department sells" → "my
 *  department sells"; "to um to think" → "to think"). */
export function dropFillersAndRepeats(toks: readonly string[]): string[] {
  const out = toks.filter((t) => !FILLER_TOKENS.has(t));
  let changed = true;
  while (changed) {
    changed = false;
    for (let n = 4; n >= 1 && !changed; n--) {
      for (let i = 0; i + 2 * n <= out.length; i++) {
        let same = true;
        for (let j = 0; j < n; j++) if (out[i + j] !== out[i + n + j]) { same = false; break; }
        if (same) { out.splice(i, n); changed = true; break; }
      }
    }
  }
  return out;
}
