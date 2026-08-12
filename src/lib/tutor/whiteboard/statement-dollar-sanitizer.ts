/**
 * Stray-dollar sanitizer for problem statements.
 *
 * Live bug (R47, session portal-1349716e): the brain emitted a show_problem
 * statement with a `$` glued directly to the next word instead of a sentence
 * boundary — "...You choose the movie ticket.$What is the opportunity cost
 * of that choice?" — a typo'd period, not an opened math delimiter. The
 * card (WhiteboardCanvas's showProblem, TryYourselfRenderer's showTryYourself)
 * renders it literally because InlineMathText's segmenter treats it as an
 * unterminated `$` and falls back to literal text.
 *
 * This module runs BEFORE that segmenter, as a narrow, deterministic cleanup
 * pass — NOT a general math/currency classifier (that's inline-math.ts's
 * job). It only removes a `$` when ALL of the following hold:
 *
 *   (a) the `$` is immediately followed by a letter (glued to a word, not a
 *       space or a digit — currency like "$20" is never touched);
 *   (b) the text from that `$` to the next `$`-or-end-of-string reads as
 *       PROSE, not math: no LaTeX/math signal characters (`^ _ \ =`)
 *       anywhere in the span, no digit sitting within 2 characters of one of
 *       those signal characters (rules out "$x=2$", "$x^2$" — a digit
 *       glued to an actual math operator), and at least two space-separated
 *       alphabetic words — UNLESS this `$` is the ONLY `$` in the whole
 *       string, in which case one word is enough (a lone, unpaired `$`
 *       glued to a letter can never be a valid `$...$` math delimiter —
 *       there is no partner `$` to close it — so the stricter multi-word
 *       bar that guards against misreading a genuine `$word$` identifier
 *       doesn't apply). A bare quantity digit that ISN'T signal-adjacent —
 *       "What is 2 times the ticket price?", "She bought 3 more." — does
 *       NOT disqualify a span: math content routinely follows a stray-$
 *       sentence break, and rejecting on any digit anywhere in the span
 *       left that whole slice of the live bug unfixed (a math-tutor
 *       follow-up question almost always mentions a number). `$f(3)$` and
 *       `$x+2$` still stay untouched — not via this digit rule, but because
 *       their span is a single un-spaced token ("f(3)", "x+2") and so never
 *       clears the two-word bar in the first place;
 *   (c) removing every `$` that passes (a)+(b) leaves every `$` still in the
 *       string currency-shaped (`$` immediately followed by a digit) or
 *       leaves no `$` at all. This is an all-or-nothing global guard: if
 *       stripping the candidates would leave the string with some OTHER
 *       ambiguous `$` (e.g. a real `$f(3)$` pair elsewhere), none of the
 *       candidates are removed and the string is returned untouched.
 *
 * Anything else — a statement with no `$`, a `$` followed by a digit or
 * space, a `$...$` span that reads as math — passes through unchanged.
 */

const MATH_SIGNAL_CHARS = /[\^_\\=]/;
// A digit within 2 chars of a math-signal char (either order, up to 2
// whitespace/other chars between) — "x=2", "x^2", "x = 2" all match; a bare
// quantity digit elsewhere in otherwise-prose text ("is 2 times", "bought 3
// more") does not.
const DIGIT_NEAR_MATH_SIGNAL_RE = /[\^_\\=].{0,2}\d|\d.{0,2}[\^_\\=]/;
const WORD_RE = /[A-Za-z']+/g;

export function sanitizeStatementDollars(text: string | undefined | null): string {
  if (!text) return text ?? '';
  if (text.indexOf('$') === -1) return text;

  const dollarIndices: number[] = [];
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '$') dollarIndices.push(i);
  }
  const onlyOneDollar = dollarIndices.length === 1;
  const minWords = onlyOneDollar ? 1 : 2;

  const candidates = new Set<number>();
  for (const idx of dollarIndices) {
    const next = text[idx + 1];
    if (!next || !/[A-Za-z]/.test(next)) continue; // (a)

    let end = text.indexOf('$', idx + 1);
    if (end === -1) end = text.length;
    const span = text.slice(idx + 1, end);

    if (MATH_SIGNAL_CHARS.test(span)) continue; // (b) math signal chars anywhere in span
    if (DIGIT_NEAR_MATH_SIGNAL_RE.test(span)) continue; // (b) digit glued to a math signal (belt-and-suspenders — MATH_SIGNAL_CHARS above already catches every case this can match, since it rejects on the signal char's mere presence; kept explicit per the plan's literal digit-adjacency clause)

    const words = span.match(WORD_RE) || [];
    if (words.length < minWords) continue; // (b) word-count bar

    candidates.add(idx);
  }

  if (candidates.size === 0) return text;

  let result = '';
  for (let i = 0; i < text.length; i++) {
    if (candidates.has(i)) continue;
    result += text[i];
  }

  // (c) global safety check on the post-removal string.
  for (let i = 0; i < result.length; i++) {
    if (result[i] !== '$') continue;
    const next = result[i + 1];
    if (!next || !/\d/.test(next)) return text; // abort — leave everything untouched
  }

  return result;
}
