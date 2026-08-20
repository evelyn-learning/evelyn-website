/**
 * Spoken-money answer reconciliation — pure, no I/O.
 *
 * ROOT CAUSE (R49, 2026-08-20, session portal-2d53e403 at 317.0s): the tutor
 * asked for $10.50 − $6.75. The student said "three seventy-five", which is
 * right. Ink2 transcribed it as "375." — money read aloud loses its decimal
 * point, because nobody says "three point seven five" about dollars.
 * `extractAnswerNumber` then yields 375 against an expected 3.75, the
 * integer branch of matchUtteranceToAnswer applies its 0.01 epsilon, and the
 * pair reads as a mismatch. The tutor said "Not quite — close though." and
 * then derived 3.75 itself 115 seconds later, contradicting its own verdict
 * in front of the student. `denied_answer_stashed "375"` is in the session's
 * debug events; `pacing_streak incorrect=1` is the cost.
 *
 * WHY THIS IS NARROW. "375" for 3.75 is ALSO the textbook misplaced-decimal
 * error, and a decimals lesson is exactly where a student might make it.
 * Reconciling it unconditionally would trade a false denial for a false
 * PRAISE — strictly worse, because a student told they are right when they
 * are wrong learns the error. So every one of these must hold:
 *
 *   1. the caller says the context is monetary (currency markers in the
 *      problem or expected answer — never inferred from the digits alone);
 *   2. the expected value has EXACTLY two decimal places, i.e. it is a
 *      cents-shaped quantity rather than an arbitrary decimal;
 *   3. the expected value is at least one whole unit, so "4" is never
 *      quietly accepted for $0.04;
 *   4. the utterance is a BARE integer — no decimal point, no fraction. A
 *      student who did say "3.75" needs no reconciliation;
 *   5. the integer equals the expected value's total cents, sign included.
 *
 * Anything short of all five is left to the normal comparison path, which
 * is free to call it a mismatch.
 *
 * Exercised by `npm run test:spoken-money`.
 */

export interface SpokenMoneyInput {
  /** TUTOR_SPOKEN_MONEY. False ⇒ always false; pre-R49 behaviour. */
  enabled: boolean;
  /** Does the surrounding problem/answer carry currency markers? Supplied by
   *  the caller — deliberately never inferred from the numbers themselves. */
  monetary: boolean;
  /** The student's (already spoken-math-normalized) answer text. */
  utterance: string;
  /** The expected answer text. */
  expected: string;
}

/** A bare signed integer and nothing else — the shape STT produces for money
 *  spoken aloud ("three seventy-five" → "375"). Trailing sentence punctuation
 *  is tolerated because transcripts carry it. */
const BARE_INTEGER_RE = /^([+-]?)(\d{1,9})[.!?]?$/;

/** A cents-shaped decimal: optional sign, whole part, exactly two decimals. */
const TWO_DECIMAL_RE = /^([+-]?)(\d{1,9})\.(\d{2})$/;

/** Strip currency symbols/commas and surrounding whitespace for matching. */
function bare(s: string): string {
  return (s ?? '').trim().replace(/[$£€,\s]/g, '');
}

export function spokenMoneyMatches(input: SpokenMoneyInput): boolean {
  if (!input.enabled || !input.monetary) return false;

  const e = TWO_DECIMAL_RE.exec(bare(input.expected));
  if (!e) return false;
  const [, eSign, eWhole, eCents] = e;
  // Guard 3: below one whole unit the reconciliation stops being a reading
  // of the same quantity and starts being a coincidence ("4" vs $0.04).
  if (Number(eWhole) < 1) return false;

  const u = BARE_INTEGER_RE.exec(bare(input.utterance));
  if (!u) return false;
  const [, uSign, uDigits] = u;

  const norm = (sign: string) => (sign === '-' ? '-' : '+');
  if (norm(uSign) !== norm(eSign)) return false;

  // Integer arithmetic throughout — 10.50 * 100 is 1050.0000000000001 in
  // binary floating point, and this comparison must be exact.
  const expectedCents = Number(eWhole) * 100 + Number(eCents);
  return Number(uDigits) === expectedCents;
}

/** Currency markers, in the problem statement or the expected answer.
 *
 *  Word-boundary anchored on purpose: a substring test for "cent" matches
 *  "century"/"centre" and one for "$" is fine, but "dollar"/"cost"/"price"
 *  need boundaries or ordinary prose starts reading as money. This is the
 *  ONLY thing standing between the cents reconciliation and a decimals
 *  lesson, so it errs toward false. */
const MONEY_RE = /[$£€¥₹]|\b(?:dollars?|cents?|pounds?|euros?|rupees?|price[ds]?|cost(?:s|ed|ing)?|paid|pay(?:s|ing)?|change|balance|allowance)\b/i;

export function looksMonetary(text: string): boolean {
  return MONEY_RE.test(text ?? '');
}
