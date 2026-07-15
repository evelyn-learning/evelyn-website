/**
 * Pure text→segment engine behind InlineMathText: splits a string that
 * mixes prose and inline $...$ LaTeX into alternating text/math segments.
 *
 * Lives outside the component so it stays importable from node test
 * scripts (the component pulls in katex CSS, which only bundlers parse).
 * See InlineMathText.tsx for the rendering half.
 *
 * Currency vs. math: a $...$ pair is treated as math ONLY if the inner
 * content looks like math (LaTeX signal, short identifier, or a compact
 * relation) — see looksLikeMath. Without that, the $ is treated as
 * literal text so prose like "Maya has $50 and a $15 movie" renders
 * correctly instead of being parsed as a math segment "50 and a 15 movie".
 */

// Reject candidate math segments that look like prose with currency.
// Accepted shapes:
//   1. At least one LaTeX-only signal (backslash command, caret/underscore
//      for sup/subscript, or braces).
//   2. Short whitespace-free identifier: $x$, $T$, $ABC$.
//   3. Compact relation (2026-07-11 — problem card showed literal
//      "$A = 50°$", "$AB = 6$" while "$ABC$" rendered): a relation symbol
//      with real content on BOTH sides and no prose word (3+ consecutive
//      lowercase letters). The prose-word guard keeps "$5 is less than
//      the $9 fee" literal; the both-sides guard keeps "$20 < $30" prose
//      literal (its first candidate inner is "20 < ").
// Anything else fails and the surrounding $ stay literal.
function looksLikeMath(inner: string): boolean {
  if (/[\\^_{}]/.test(inner)) return true;
  if (inner.length <= 4 && !/\s/.test(inner)) return true;
  if (
    inner.length <= 40 &&
    /\S\s*[=<>≤≥≠]\s*\S/.test(inner) &&
    !/[a-z]{3,}/.test(inner)
  ) return true;
  return false;
}

// Pre-pass: auto-wrap Unicode math symbols with limits in $...$ so they
// render through KaTeX. Seeds and brain narration commonly write
// "∫_0^4 x² dx" without any math delimiters; without this pass the
// underscore/caret render as literal characters (observed 2026-05-08
// AP Calc BC riemann-sums session — the worked-example card showed
// "∫_0^4" with literal `_` and `^` instead of stacked limits). Handles
// ∫ ∑ ∏ with either _<lo>^<hi> or ^<hi>_<lo> ordering. Token shapes
// supported: alphanumeric run, {brace group}, (paren group). Plain
// symbols without limits are NOT wrapped — they render fine as Unicode
// and wrapping a bare ∫ in math mode forces a font swap that looks
// inconsistent with the surrounding prose.
const MATH_SYMBOL_TO_CMD: Record<string, string> = { '∫': '\\int', '∑': '\\sum', '∏': '\\prod' };
const LIMIT_TOKEN = '\\{[^}]*\\}|\\([^)]*\\)|[A-Za-z0-9]+';
const SYMBOL_WITH_LIMITS_RE = new RegExp(
  `([∫∑∏])(?:_(${LIMIT_TOKEN})\\^(${LIMIT_TOKEN})|\\^(${LIMIT_TOKEN})_(${LIMIT_TOKEN}))`,
  'g',
);
export function autoWrapUnicodeMath(text: string): string {
  if (!text) return text;
  return text.replace(SYMBOL_WITH_LIMITS_RE, (_match, sym, lowerA, upperA, upperB, lowerB) => {
    const cmd = MATH_SYMBOL_TO_CMD[sym] ?? sym;
    const lo = lowerA ?? lowerB;
    const hi = upperA ?? upperB;
    return `$${cmd}_{${lo}}^{${hi}}$`;
  });
}

/** Decode the small set of HTML entities the brain habitually emits
 *  when generating code in plain-text fields (Java generics, C++
 *  templates, comparisons, etc.). The show_problem statement is
 *  rendered as plain text — entities would otherwise display literally
 *  ("ArrayList&lt;Integer&gt;" instead of "ArrayList<Integer>").
 *  Observed 2026-05-15 session. The set is restricted to the entities
 *  with unambiguous text equivalents; numeric entities (&#N;) and
 *  named entities beyond this set are intentionally NOT decoded to
 *  avoid surprising rewrites of intentional content. */
export function decodeHtmlEntities(s: string): string {
  return s
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&#39;/gi, "'")
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&'); // amp last
}

// Split a string into alternating plain-text and math segments.
// Math is anything between matched single $...$ that doesn't include whitespace-only
// content, doesn't span across a newline, and passes the looksLikeMath check.
/** `forceMath` (2026-07-15, Q pin): skip the currency guard — every balanced
 *  $...$ pair is math. For contexts where the text comes from a prompt that
 *  guarantees $...$ means LaTeX (the question-gist route), where the guard's
 *  conservatism otherwise leaves simple math like "$2 - x$" as literal text. */
export function segment(text: string, forceMath = false): Array<{ kind: 'text' | 'math'; body: string }> {
  if (!text) return [];
  const out: Array<{ kind: 'text' | 'math'; body: string }> = [];
  let i = 0;
  while (i < text.length) {
    const dollar = text.indexOf('$', i);
    if (dollar < 0) {
      out.push({ kind: 'text', body: text.slice(i) });
      break;
    }
    // Escaped \$ → treat as literal dollar
    if (dollar > 0 && text[dollar - 1] === '\\') {
      out.push({ kind: 'text', body: text.slice(i, dollar - 1) + '$' });
      i = dollar + 1;
      continue;
    }
    const close = text.indexOf('$', dollar + 1);
    if (close < 0) {
      // Unmatched — emit remainder as text
      out.push({ kind: 'text', body: text.slice(i) });
      break;
    }
    const inner = text.slice(dollar + 1, close);
    // Skip empty / whitespace-only / multi-line pairs; treat as literal text
    if (!inner.trim() || inner.includes('\n')) {
      out.push({ kind: 'text', body: text.slice(i, close + 1) });
      i = close + 1;
      continue;
    }
    // Currency guard: if the inner doesn't look like math, treat the
    // opening $ as a literal character and resume scanning AFTER it (do
    // NOT consume the closing $, which may pair legitimately with a
    // later $ later in the string).
    if (!forceMath && !looksLikeMath(inner)) {
      out.push({ kind: 'text', body: text.slice(i, dollar + 1) });
      i = dollar + 1;
      continue;
    }
    if (dollar > i) out.push({ kind: 'text', body: text.slice(i, dollar) });
    out.push({ kind: 'math', body: inner });
    i = close + 1;
  }
  return out;
}
