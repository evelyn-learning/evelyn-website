/**
 * Deterministic detector for a praise-then-contradiction turn (R38, session
 * embed-1785738371329): the brain's FIRST sentence opens by praising a
 * short value phrase ("Right — one half.") and a LATER sentence in the
 * same turn contradicts that exact phrase ("…you've gone one third of the
 * way, not one half."). The student hears the tutor affirm their wrong
 * answer, then walk it back — worse than a plain correction.
 *
 * Task 1 (this round) already fixed `isVerdictOpener` so dash-form
 * ("Right —") openers get HELD instead of spoken immediately, buying a
 * window to catch exactly this shape before any audio plays. This module
 * is the deterministic backstop for turns that are held but still wrong
 * once fully assembled — it is intended to run on the FULL accumulated
 * turn text (not sentence 0 alone), since the contradiction only shows up
 * once a later sentence has streamed in.
 *
 * Deterministic shape (no LLM, no FP class): sentence 1 opens with a
 * praise-class verdict word followed by a short value phrase, and a LATER
 * sentence contains "not <that same phrase>". Scoped narrowly — the
 * contradiction regex targets only the AFFIRMED phrase, so a legitimate
 * contrast against a DIFFERENT value ("Right — one third. Not one half,
 * like the last one — one third.") does not fire.
 *
 * VALUE-SUBSTITUTION SHAPE (2026-08-10 root cause, session
 * portal-7cfa226c, AP Calc BC): the "not <phrase>" branch above only
 * catches an EXPLICIT verbal walk-back. The live failure had no "not" at
 * all — the opener affirmed "$2x$", then a later sentence silently
 * substituted a different value into an equality: "the derivative of
 * $3x^2$ is $3 \cdot 2x = 6x$ — so $f''(x) = 6x$." The student hears the
 * tutor affirm one value and then, with zero acknowledgement, assert a
 * DIFFERENT one as the answer.
 *
 * This is scoped to short MATH-TOKEN affirmations only (has a digit,
 * operator, or `$`/`\(` wrapper, and no internal whitespace) — a prose
 * affirmation like "one half" or "great job" never enters this branch, so
 * it can't collide with the existing negation-only tests. Within that
 * scope: scan every inline-math `=` equality in the rest of the turn.  An
 * equality only counts as being ABOUT the affirmed value if the affirmed
 * token (normalized) appears as a substring somewhere on the equality's
 * left side — this is what lets "$3 \cdot 2x = 6x$" qualify (it contains
 * "2x" as a factor) while a same-turn but DIFFERENT problem's equality
 * ("Right. $2x$. Now try $g(x)=x^3$: $g'(x)=3x^2$") does NOT qualify
 * (neither "g(x)" nor "g'(x)" contains "2x") — the existing detector has
 * no cross-problem scoping of its own (it runs on the whole accumulated
 * turn text), so this substring gate is what keeps a topic shift from
 * false-positiving. Once at least one equality qualifies, the turn is
 * flagged only if the FINAL asserted value (the RHS of the LAST qualifying
 * or non-qualifying equality found — i.e. what the turn ultimately lands
 * on) differs from the affirmed token; an equality whose RHS still equals
 * the affirmed token ("$f'(x) = 2x$") is a restatement, not a
 * contradiction.
 *
 * Pure module — no imports, no side effects. Never throws.
 */

export const PRAISE_OPENER_RE =
  /^\s*(?:right|yes|exactly|correct|perfect|spot on|that'?s (?:right|correct|it))\s*[—–,.:!-]\s*([^!?\n]{1,120}?)[.!?](?:\s|$)/i;

/** Strips $, \( \), and braces, then all whitespace — used to compare an
 * affirmed value token against equation fragments regardless of delimiter
 * or spacing noise. */
function normalizeMathToken(s: string): string {
  return s
    .replace(/\\\(/g, '')
    .replace(/\\\)/g, '')
    .replace(/[${}]/g, '')
    .replace(/\s+/g, '');
}

/** True when the affirmed phrase looks like a compact math value (a
 * digit/operator/$-delimited token with no internal whitespace) rather
 * than prose ("one half", "great job") — the value-substitution branch is
 * scoped to this shape only. */
function isMathValueToken(affirmed: string): boolean {
  const raw = affirmed.trim();
  if (!raw) return false;
  if (/\s/.test(raw) && !/^\$.*\$$/.test(raw) && !/\\/.test(raw)) return false;
  return /[$\d^*/+\-\\]/.test(raw);
}

/** Finds every inline-math span ($...$ or \(...\)) in `text` containing at
 * least one "=" and returns, for each, its LHS-side text (everything
 * before the final "=") and its RHS token (normalized). */
function findEqualitiesInMath(text: string): Array<{ lhs: string; rhsNorm: string }> {
  const spanRe = /\$([^$]+)\$|\\\(([^)]+)\\\)/g;
  const out: Array<{ lhs: string; rhsNorm: string }> = [];
  let m: RegExpExecArray | null;
  while ((m = spanRe.exec(text)) !== null) {
    const content = m[1] ?? m[2] ?? '';
    const segments = content.split('=').map((s) => s.trim()).filter((s) => s.length > 0);
    if (segments.length < 2) continue;
    out.push({
      lhs: normalizeMathToken(segments.slice(0, -1).join('')),
      rhsNorm: normalizeMathToken(segments[segments.length - 1]),
    });
  }
  return out;
}

export function detectPraiseContradiction(turnText: string): { affirmed: string } | null {
  const m = turnText.match(PRAISE_OPENER_RE);
  if (!m) return null;
  const affirmed = m[1].replace(/\*/g, '').trim().replace(/\s+/g, ' ');
  if (!affirmed) return null;
  const rest = turnText.slice(m.index! + m[0].length).replace(/\*/g, '');
  const escaped = affirmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Trailing boundary uses a negative lookahead rather than \b: \b requires
  // a word\/non-word transition, which fails when the affirmed token itself
  // ends in a non-word char (e.g. a `$`-delimited math span) followed by
  // whitespace or end-of-string — both sides non-word, no transition, so a
  // literal "not $2x$" would never match. (?!\w) keeps the same protection
  // for word-ending tokens (still rejects "not one halves" as a match for
  // "one half") while correctly closing after symbol-ending tokens.
  const contra = new RegExp(`\\bnot\\s+${escaped}(?!\\w)`, 'i');
  if (contra.test(rest)) return { affirmed };

  if (isMathValueToken(affirmed)) {
    const affirmedNorm = normalizeMathToken(affirmed);
    const equalities = findEqualitiesInMath(rest);
    let qualifies = false;
    let finalRhsNorm: string | null = null;
    for (const eq of equalities) {
      if (eq.lhs.includes(affirmedNorm)) qualifies = true;
      finalRhsNorm = eq.rhsNorm;
    }
    if (qualifies && finalRhsNorm !== null && finalRhsNorm !== affirmedNorm) {
      return { affirmed };
    }
  }

  return null;
}

/** Extracts the affirmed value phrase from a praise opener (same capture and
 * cleanup as `detectPraiseContradiction`), independent of whether a later
 * contradiction exists in the turn. Returns null when there is no opener
 * match, no captured phrase, or the captured phrase is not a math-value
 * token (Task 4 uses this to seed echo/board comparisons for math-shaped
 * affirmations only — prose phrases like "one half" are out of scope here,
 * matching the value-substitution branch above). */
export function extractPraiseEcho(turnText: string): string | null {
  const m = turnText.match(PRAISE_OPENER_RE);
  if (!m) return null;
  const affirmed = m[1].replace(/\*/g, '').trim().replace(/\s+/g, ' ');
  if (!affirmed) return null;
  if (!isMathValueToken(affirmed)) return null;
  return affirmed;
}
