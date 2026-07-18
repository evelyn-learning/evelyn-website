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

import katex from 'katex';

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
  //   4. Coordinate tuple (2026-07-17 — live AP Calc card showed literal
  //      "$(1,-1)$"): a parenthesized, comma-separated list of short
  //      operands (numbers, decimals, negatives, single identifiers).
  //      No prose word can appear (each operand caps at 4 word chars),
  //      so "$(low, high) prices$" stays literal.
  if (
    inner.length <= 24 &&
    /^[([]\s*-?[\w.]{1,4}\s*(?:,\s*-?[\w.]{1,4}\s*)+[)\]]$/.test(inner)
  ) return true;
  //   5. Compact operand-operator-operand (Round-21 — live transcript
  //      showed literal "$L + M$"): an arithmetic operator between short
  //      operands, no prose word. The prose guard keeps the currency
  //      pairing-artifact ("5 and shipping is") literal.
  if (
    inner.length <= 24 &&
    /[A-Za-z0-9)\]]\s*[-+*/·×^]\s*[A-Za-z0-9(\[]/.test(inner) &&
    !/[a-z]{3,}/.test(inner)
  ) return true;
  //   6. Prime/derivative span (Round-23 — live transcript and problem card
  //      showed literal "$f'(x)$", "$h'(1)$"): a single letter with 1–2
  //      primes and an optional short parenthesized argument. The
  //      prime-follows-first-letter shape can't match possessive prose
  //      ("Bob's") because prose has more letters before the apostrophe.
  if (/^[A-Za-z]'{1,2}(?:\([^\s()]{1,8}\))?$/.test(inner)) return true;
  //   7. Prime compositions & absolute values (Round-24 stress sweep):
  //      nested derivative shapes f'(f'(x)) / |f'(x)| carry no LaTeX
  //      signal char and defeat the anchored rule above. A span made only
  //      of math-word characters that contains a prime or a pipe PAIR —
  //      with no prose word (3+ consecutive lowercase) — is math. The
  //      prose guard keeps "don't", "Bob's fee", and every currency
  //      pairing artifact literal.
  if (
    inner.length <= 60 &&
    (/'/.test(inner) || /\|[^|]*\|/.test(inner)) &&
    /^[A-Za-z0-9'()|,.\s+\-*/^=<>≤≥]+$/.test(inner) &&
    !/[a-z]{3,}/.test(inner)
  ) return true;
  //   8. Conditional probability P(A|B) (Round-24): a single capital-letter
  //      function over a single-pipe argument — the pipe-PAIR clause above
  //      deliberately misses it.
  if (/^[A-Z]\([^|()]{1,12}\|[^()]{1,12}\)$/.test(inner)) return true;
  //   9. Chemical formula with an aggregation state (chem round — live
  //      shape "$NaCl(aq)$" has no LaTeX signal char): optional
  //      coefficient, element-symbol run, then a mandatory (aq|s|l|g)
  //      marker. The marker requirement keeps ordinary parenthesized
  //      prose ("$(loss)$") literal.
  if (/^\d{0,3}(?:[A-Z][a-z]?\d{0,3})+\(\s*(?:aq|s|l|g)\s*\)$/.test(inner)) return true;
  //  10. Numeric ratio (subject-notation round — "$9:3:3:1$" dihybrid
  //      phenotype ratio): two or more colon-separated integers. Without
  //      this the wrapped ratio showed literal "$9:3:3:1$" on cards.
  if (/^\d+(?::\d+)+$/.test(inner)) return true;
  return false;
}

/** Display-side sentence-gap normalization (Round-23). The brain sometimes
 *  omits the space after a sentence-ending period — "the slope is 1.So" or
 *  "…= \dfrac{1}{2}$.Now" — which round 21 fixed on the SPEECH side only
 *  (tts-pronunciation). Bubbles apply this before segmentation. The `$` in
 *  the left class covers the period-right-after-closing-math shape; the
 *  [A-Z][a-z] right side keeps decimals ("3.14") and initialisms ("U.S.A.")
 *  untouched. */
export function normalizeSentenceGaps(text: string): string {
  return text.replace(/([\w$])\.([A-Z][a-z])/g, '$1. $2');
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

// Auto-wrap pre-pass (Task E4, 2026-07-15): lesson-plan seeds and brain
// narration sometimes write bare LaTeX with NO $...$ delimiters at all
// (e.g. "Compute lim_{x→0} sin(5x)/(2x)." — ap-calcbc-u1-limits-algebraic-
// manipulation.ts:95). segment() only splits on $...$, so without this
// pass the underscore/caret render as literal characters on the card.
//
// The heuristic is deliberately conservative: it only wraps a contiguous
// run of "math-looking" tokens that contains at least one STRONG signal —
// a backslash command (\frac, \sqrt, ...), a known math-function call or
// limit pattern (sin(, lim_{...}), or a short (<=2 char) variable with a
// numeric/braced script (x^2, x_{1}). A run expands outward from that
// signal through whitespace-single-space-connected neighbor tokens that
// are plausibly math (contain a digit/operator/paren/bracket char) and
// are NOT themselves a plain-English word — this stops expansion at
// ordinary prose ("Compute", "for", "stays") so bare identifiers like
// snake_case_id or markdown _italics_ (no strong signal anywhere in
// them) are never touched. Every wrap is validated with
// katex.renderToString before being committed; a throw falls back to the
// original raw text untouched — the same safety net InlineMathText's
// Math component already has for genuine $...$ math (see Math() below).
//
// Already-$-delimited regions are treated as opaque and never rescanned,
// so this pass can never nest a $ inside an existing pair or change any
// already-working $-delimited card (mirrors segment()'s own dollar
// pairing so behavior composes cleanly with the currency guard above).
const MATH_FN_NAMES = ['sin', 'cos', 'tan', 'cot', 'sec', 'csc', 'log', 'ln', 'exp', 'lim', 'max', 'min', 'arg', 'det', 'dim', 'gcd', 'lcm', 'sinh', 'cosh', 'tanh'];
const FN_ALT = MATH_FN_NAMES.join('|');
// Isolated (whole-token, not a substring of a longer word) match of a
// known math-function name — used to strip fn names before the
// prose-word check ("using" must not be mistaken for "u" + "sin" + "g").
const FN_NAME_ISOLATED_RE = new RegExp(`(?<![A-Za-z])(?:${FN_ALT})(?![A-Za-z])`, 'gi');
// fn name immediately followed by "(" (a call, e.g. "sin(") or "_" (a
// scripted limit, e.g. "lim_{...}") — underscore counts as a \w char so a
// plain \b after the name would NOT be a boundary; the lookaheads here
// are boundary-correct for that case.
const FN_CALL_OR_SCRIPT_RE = new RegExp(`(?<![A-Za-z])(?:${FN_ALT})[_(]`, 'i');
// A short (1-2 char) variable immediately followed by ^ or _ and then a
// digit or a brace group: x^2, x_{1}, y_2. Deliberately excludes a bare
// letter run after the script marker (x_ray) — that's prose, not math.
const SHORT_VAR_SCRIPT_RE = /\b[A-Za-z]{1,2}[\^_](?:\{|\d)/;
const BACKSLASH_CMD_RE = /\\[a-zA-Z]+/;
const BACKSLASH_CMD_RE_G = /\\[a-zA-Z]+/g;
// Characters that show up in a bare math run (digits, operators, parens,
// braces, common unicode math symbols) but never in ordinary English
// prose words — used to admit a token as a candidate NEIGHBOR of a
// strong-signal token (never as a seed by itself).
const MATHY_CHAR_RE = /[0-9+\-*/=<>≤≥≠(){}^_\\²³√π×÷·−]/;
const TRAILING_PUNCT_RE = /^(.*?)([.,;:!?]+)$/;

function stripTrailingPunct(chunk: string): { core: string; trail: string } {
  const m = chunk.match(TRAILING_PUNCT_RE);
  return m ? { core: m[1], trail: m[2] } : { core: chunk, trail: '' };
}

function chunkIsProseWord(core: string): boolean {
  // Strip known math-function names AND backslash commands before
  // checking for a leftover English word — otherwise a LaTeX command
  // name like "\frac"/"\sqrt" reads as the prose word "frac"/"sqrt" and
  // wrongly blocks it from joining a run as a neighbor chunk.
  const stripped = core.replace(FN_NAME_ISOLATED_RE, '').replace(BACKSLASH_CMD_RE_G, '');
  return /[a-z]{3,}/.test(stripped);
}

function chunkHasStrongSignal(core: string): boolean {
  return BACKSLASH_CMD_RE.test(core) || FN_CALL_OR_SCRIPT_RE.test(core) || SHORT_VAR_SCRIPT_RE.test(core);
}

function chunkIsCandidate(core: string): boolean {
  if (!core || chunkIsProseWord(core)) return false;
  return MATHY_CHAR_RE.test(core);
}

interface Chunk { start: number; core: string; trail: string; }

function tokenizeChunks(plain: string): Chunk[] {
  const chunks: Chunk[] = [];
  const re = /\S+/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(plain))) {
    const { core, trail } = stripTrailingPunct(m[0]);
    chunks.push({ start: m.index, core, trail });
  }
  return chunks;
}

// TeX-special characters that alter parsing WITHOUT reliably throwing, so
// katex.renderToString({throwOnError:true}) is not a sufficient safety net
// for them on its own. The critical one: an un-escaped `%` starts a TeX
// comment, so `katex.renderToString('x^2% + y^2', {throwOnError:true})`
// SUCCEEDS while silently truncating the render to just "x^2" — the
// content after `%` never reaches the student, with no error to catch.
// `#` (macro-parameter marker) and `&` (alignment tab) are guarded the
// same way for defense in depth even though KaTeX happens to throw on
// them outside tabular/macro contexts today — that's an implementation
// detail we shouldn't rely on for a silent-content-loss class of bug.
// An escaped form (`\%`, `\#`, `\&`) is the deliberate, correct way to
// author a literal character and is NOT flagged: TeX escaping is
// parity-based (`\\` is a complete "printed backslash" command, so it
// does NOT itself escape the character after it), so a character is
// treated as escaped only when preceded by an ODD number of consecutive
// backslashes.
const TEX_SPECIAL_CHARS = new Set(['%', '#', '&']);
function hasUnescapedTexSpecial(s: string): boolean {
  for (let i = 0; i < s.length; i++) {
    if (!TEX_SPECIAL_CHARS.has(s[i])) continue;
    let backslashes = 0;
    let j = i - 1;
    while (j >= 0 && s[j] === '\\') { backslashes++; j--; }
    if (backslashes % 2 === 0) return true; // unescaped
  }
  return false;
}

function isValidLatex(latex: string): boolean {
  if (hasUnescapedTexSpecial(latex)) return false;
  try {
    katex.renderToString(latex, { throwOnError: true, displayMode: false, strict: false, trust: true });
    return true;
  } catch {
    return false;
  }
}

// Scan a plain-text (no $ in it) span for bare-LaTeX runs and wrap the
// validated ones in $...$.
function autoWrapPlainText(plain: string): string {
  const chunks = tokenizeChunks(plain);
  if (chunks.length === 0) return plain;

  const candidateOk = chunks.map((c) => chunkIsCandidate(c.core));
  const strongOk = chunks.map((c) => chunkHasStrongSignal(c.core));

  let result = '';
  let cursor = 0;
  let i = 0;
  // Tracks the highest chunk index already folded into a previous run so
  // that a second, later seed can't expand backward and re-claim chunks
  // (and re-emit their text) a prior run already consumed — e.g. two
  // strong-signal chunks sharing one connector chunk between them
  // ("\frac{1}{2} + \frac{1}{3}": both \frac chunks are seeds; without
  // this guard the second seed's left-expansion walks back through "+"
  // and re-wraps it, duplicating "+" across two overlapping $...$ spans).
  let lastConsumedHi = -1;
  while (i < chunks.length) {
    if (!strongOk[i]) { i++; continue; }
    let lo = i;
    while (lo - 1 > lastConsumedHi && candidateOk[lo - 1] && plain.slice(chunks[lo - 1].start + chunks[lo - 1].core.length + chunks[lo - 1].trail.length, chunks[lo].start) === ' ') lo--;
    let hi = i;
    while (
      hi < chunks.length - 1 &&
      candidateOk[hi + 1] &&
      plain.slice(chunks[hi].start + chunks[hi].core.length + chunks[hi].trail.length, chunks[hi + 1].start) === ' '
    ) hi++;

    const runStart = chunks[lo].start;
    const last = chunks[hi];
    const runEnd = last.start + last.core.length; // excludes the LAST chunk's trailing punctuation
    const trailPunct = last.trail;
    const rawRun = plain.slice(runStart, runEnd);

    // Commit a wrap only when BOTH gates accept the run:
    //   - isValidLatex: KaTeX renders it (no throw, no silent TeX-special
    //     truncation).
    //   - looksLikeMath: segment()'s OWN currency guard will accept it
    //     downstream.
    // A run whose only strong signal is a fn-call (e.g. "sin(3x)/(6x)") is
    // valid LaTeX but has no `\ ^ _ { }` / relation, so looksLikeMath rejects
    // it — wrapping it in $…$ here would just make segment() strip the math
    // back out and the dollars render LITERALLY on the card
    // ("Evaluate sin(3x)/(6x) directly." → "$sin(3x)/(6x)$"). Leave the raw
    // text untouched in that case. Runs that carry a real LaTeX signal
    // (lim_{x→0} …, x^2, \frac…) pass looksLikeMath's first branch and still
    // wrap as before.
    if (isValidLatex(rawRun) && looksLikeMath(rawRun)) {
      result += plain.slice(cursor, runStart) + `$${rawRun}$` + trailPunct;
    } else {
      result += plain.slice(cursor, runEnd + trailPunct.length);
    }
    cursor = runEnd + trailPunct.length;
    lastConsumedHi = hi;
    i = hi + 1;
  }
  result += plain.slice(cursor);
  return result;
}

/** Auto-wrap bare (un-delimited) LaTeX runs in $...$ so they reach
 *  segment()/KaTeX. See the block comment above for the heuristic and
 *  its false-positive guards. Skips over any already-$-delimited region
 *  verbatim (opaque passthrough) so it never touches working $ math or
 *  the currency guard's territory. */
export function autoWrapLatex(text: string): string {
  if (!text) return text;
  const out: string[] = [];
  let i = 0;
  while (i < text.length) {
    const dollar = text.indexOf('$', i);
    if (dollar < 0) { out.push(autoWrapPlainText(text.slice(i))); break; }
    if (dollar > 0 && text[dollar - 1] === '\\') {
      out.push(autoWrapPlainText(text.slice(i, dollar - 1)));
      out.push('\\$');
      i = dollar + 1;
      continue;
    }
    const close = text.indexOf('$', dollar + 1);
    if (close < 0) { out.push(autoWrapPlainText(text.slice(i))); break; }
    out.push(autoWrapPlainText(text.slice(i, dollar)));
    out.push(text.slice(dollar, close + 1)); // already-delimited — opaque passthrough
    i = close + 1;
  }
  return out.join('');
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
