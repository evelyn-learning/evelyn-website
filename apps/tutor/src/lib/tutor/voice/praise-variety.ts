/**
 * Praise calibration — the same superlative, turn after turn.
 *
 * GDI starter session embed-1792261973710 (2026-10-17): 完璧 ("perfect") in
 * seven of eighteen tutor turns, including one for a sentence the student had
 * just been handed to repeat and one for an answer the tutor then rejected.
 * The evaluator's read: "premature mastery claims", praise that no longer
 * carries information. The prompt already asks for short, earned praise; a
 * per-turn note is what the brain follows.
 *
 * Deterministic half: when a superlative appears in at least `min` of the
 * last `window` delivered tutor turns (the latest included), the next brain
 * turn gets a note to name what was right instead, vary the wording, and
 * reserve superlatives for independent production.
 */

const SUPERLATIVE_RE =
  /完璧|パーフェクト|大正解|素晴らしい|すばらしい|お見事|\b(?:perfect|excellent|amazing|wonderful|brilliant|flawless|outstanding)\b/i;

export const PRAISE_WINDOW_TURNS = 4;
/** embed-1792266148587: the note held for a turn or two, then 完璧 came back —
 *  four plantings, 13 superlatives in 29 turns. From the second planting on,
 *  the note rides with every remaining turn of the session. */
export const PRAISE_STICKY_AFTER_PLANTS = 2;
export const PRAISE_MIN_HITS = 3;

/** Does this tutor turn carry a superlative? */
export function hasSuperlativePraise(tutorText: string): boolean {
  return SUPERLATIVE_RE.test(tutorText ?? '');
}

/**
 * `recentTutorTurns`: the delivered tutor turns, oldest first, latest last.
 * True when the latest turn has a superlative and at least PRAISE_MIN_HITS of
 * the last PRAISE_WINDOW_TURNS do.
 */
export function overusesSuperlative(recentTutorTurns: readonly string[]): boolean {
  const recent = recentTutorTurns.slice(-PRAISE_WINDOW_TURNS);
  if (recent.length < PRAISE_MIN_HITS) return false;
  const latest = recent[recent.length - 1] ?? '';
  if (!hasSuperlativePraise(latest)) return false;
  return recent.filter((t) => hasSuperlativePraise(t)).length >= PRAISE_MIN_HITS;
}

export const PRAISE_VARIETY_NOTE =
  '[runtime note — not from the student] You have called most of the recent answers perfect (完璧). ' +
  'Calibrate: in one short clause name exactly what was right, vary the wording, and keep words like 完璧 / perfect ' +
  'for a sentence the student produced on their own without a model or a hint to copy. A repeated or prompted sentence ' +
  'gets a plain confirmation, not a superlative. Apply this silently; never mention this note.';
