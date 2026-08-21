/**
 * "Give me another one" detection — pure, no I/O.
 *
 * ROOT CAUSE (R49b, live 2026-08-20 portal-2d53e403 at 1429.1s). The
 * student said "Yeah, sure. Uh, let's try fractions." — an explicit ask for
 * ANOTHER fraction problem. The brain re-posed the IDENTICAL one
 * (-1/4 + 1/2). `show_*-dedup` correctly dropped the duplicate render, and
 * the validator handed the brain a retry reason that opens:
 *
 *   "The student is still looking at the previous problem."
 *
 * True as a statement about the board, and exactly wrong as guidance here.
 * The brain took it at face value and narrated the OLD card from the top —
 * "Fourths — since half is just two fourths... That's already up on the
 * board." — a near-verbatim replay of its own 1006.7s turn from seven
 * minutes earlier. The student was handed the same problem twice,
 * introduced as though it were new.
 *
 * The dedup machinery did its job; the retry message was simply blind to
 * what the student had just asked for. This supplies that missing signal so
 * the recovery instruction can say "they asked for a NEW one — re-showing
 * or re-narrating the old one is not an option" instead of pointing the
 * brain back at the card it must not reuse.
 *
 * DELIBERATELY CONSERVATIVE. A false positive here only sharpens an
 * instruction the brain already had ("improvise clearly different
 * content"), so it is cheap; but "let me try again" means the OPPOSITE —
 * the student wants another go at the SAME problem — and must never match.
 * Answers and help-requests must never match either, since those are the
 * overwhelming majority of student turns.
 *
 * Exercised by `npm run test:another-problem`.
 */

/** Wants a fresh item: "another one", "one more", "a different one", "next one". */
const ANOTHER_RE =
  /\b(?:another|a\s+new|a\s+different|one\s+more|next)\s+(?:one|problem|question|example|go)\b|\banother\b(?=\s*(?:\.|,|$|please))|\bone\s+more\b|\bnext\s+one\b/i;

/** Proposes moving to a topic/kind: "let's try decimals", "can we do fractions". */
const LETS_TRY_RE =
  /\b(?:let'?s|lets|can\s+we|could\s+we|shall\s+we|how\s+about)\s+(?:try|do|go\s+to|move\s+to|switch\s+to)\b/i;

/**
 * Wants ANOTHER GO at the SAME problem — the inverse of this signal.
 * Checked first and wins outright: "can I have another go at this one"
 * contains "another" but is a retry, not a request for new material.
 */
const RETRY_SAME_RE =
  /\btry\s+(?:that|it|this|again)\b|\b(?:again|another\s+go|one\s+more\s+time)\b\s*(?:at\s+(?:this|that|it))?|\bre-?try\b/i;

/** Asking for help, not for new material. */
const HELP_RE =
  /\b(?:repeat|say\s+that\s+again|hint|help|don'?t\s+(?:get|understand)|confused|stuck)\b/i;

export function detectAnotherProblemRequest(text: string): boolean {
  const t = (text ?? '').trim();
  if (!t) return false;
  // A retry of the same item, or a plea for help, is never a request for a
  // new problem — even when it contains "another".
  if (RETRY_SAME_RE.test(t)) return false;
  if (HELP_RE.test(t)) return false;
  return ANOTHER_RE.test(t) || LETS_TRY_RE.test(t);
}
