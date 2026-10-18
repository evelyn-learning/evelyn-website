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

/**
 * 2026-10-18 (GDI embed-1792338502233): no superlative streak, yet GPT's
 * report called the praise "scripted" — "Nice." opened four turns, いいですね
 * most of the rest. The language clause bans stock openers; this catches the
 * pattern when it persists anyway. A stock opener is a praise word or phrase
 * in the turn's first few characters, in either language.
 */
const STOCK_OPENER_RE =
  /^[\s"「『(（]*(?:nice|good|great|perfect|excellent|awesome|wonderful|well done|good job|exactly|correct|right|そうです|その通り|いいですね|いいね|すごい|素晴らしい|すばらしい|完璧|大正解|正解|ナイス|よくできました|ばっちり|お見事|上手)(?:です|ですね|ですよ|だね)?[\s!！.。,、—:：-]/i;

export function opensWithStockPraise(tutorText: string): boolean {
  return STOCK_OPENER_RE.test(`${tutorText ?? ''} `);
}

export function overusesStockPraiseOpener(recentTutorTurns: readonly string[]): boolean {
  const recent = recentTutorTurns.slice(-PRAISE_WINDOW_TURNS);
  if (recent.length < PRAISE_MIN_HITS) return false;
  const latest = recent[recent.length - 1] ?? '';
  if (!opensWithStockPraise(latest)) return false;
  return recent.filter((t) => opensWithStockPraise(t)).length >= PRAISE_MIN_HITS;
}

export const PRAISE_OPENER_NOTE =
  '[runtime note — not from the student] Most of your recent turns have opened with the same kind of stock praise ' +
  '(いいですね / Nice / 正解です). It sounds scripted. From now on do not open with a praise word: when the answer is right, ' +
  'start by naming in a few words what was right, or go straight to the next item; keep the warm word for a sentence ' +
  'the student built on their own. Apply this silently; never mention this note.';


/**
 * 2026-10-18 (embed-1792350642171): one plant was not enough — 完璧 ×6 with
 * the note planted once and not sticky. In a language lesson the note is
 * sticky from the FIRST plant; and in any lesson, four or more tutor turns
 * with a superlative make it sticky whether or not the four-turn window ever
 * trips (spread-out 完璧 is still 完璧).
 */
export const PRAISE_SESSION_SUPERLATIVE_STICKY = 4;

export function praiseStickyAfterPlants(languageLesson: boolean): number {
  return languageLesson ? 1 : PRAISE_STICKY_AFTER_PLANTS;
}

export function praiseNoteIsSticky(args: { plants: number; superlativeTurns: number; languageLesson: boolean }): boolean {
  return args.plants >= praiseStickyAfterPlants(args.languageLesson) || args.superlativeTurns >= PRAISE_SESSION_SUPERLATIVE_STICKY;
}
