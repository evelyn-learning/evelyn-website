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
import { SKIP_KEYS } from './wb-emphasis-strip';

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
  //   4b. Bare comma-separated list (transcript-drawer regression — showed
  //      literal "$2, 3, 4, 5, 31$"): the tuple rule above requires a
  //      leading ( or [, so an unbracketed list missed every clause. Same
  //      short-operand shape (2+ operands, each ≤4 word chars, optional
  //      minus), with a prose guard the tuple rule doesn't need: filler
  //      speech like "so, um, yes" is also a 1–4-letter comma list, so a
  //      bare list must additionally contain a digit somewhere OR be made
  //      entirely of single-character operands ("x, y, z").
  //      R45 (live, session portal-d7ec8e42): each operand may carry a
  //      trailing "!" — "$0!, 1!, 2!$" showed literal because "!" wasn't in
  //      the operand charset. The "!" is anchored to the END of an operand
  //      already capped at 4 word/dot characters, so it can only ever glue
  //      to a short numeric/single-letter item, never mid-word ("Hello!"
  //      is 5 letters before the "!" and can't fit the {1,4} cap; "world"
  //      has no "!" or digit and fails the digit-or-single-char guard).
  if (
    inner.length <= 24 &&
    /^-?[\w.]{1,4}!?(?:,\s*-?[\w.]{1,4}!?)+$/.test(inner) &&
    (/\d/.test(inner) || /^\w!?(?:,\s*\w!?)+$/.test(inner))
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
  //   5b. Function evaluation (mock-exam sweep 2026-07-20 — items showed
  //      literal "$f(-3)$", "$h(10)$"): a 1–2 letter function name over a
  //      short whitespace-free parenthesized argument. Prose like
  //      "a(n) increase" never arrives wrapped in a $ pair, and longer
  //      names ("cost(x)") carry a prose word and stay literal — EXCEPT an
  //      allowlist of known 3-letter math functions (sin/cos/tan/log/ln/
  //      exp/max/min), which the same drawer regression showed literal as
  //      "$sin(x)$". The argument may also be a two-part comma+space list
  //      of short comma-free tokens for the N(0, 1) / P(A, B) shape.
  if (/^(?:[A-Za-z]{1,2}|sin|cos|tan|log|ln|exp|max|min)\((?:[^\s()]{1,8}|[^\s(),]{1,8},\s?[^\s(),]{1,8})\)$/.test(inner)) return true;
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
/**
 * Is this "latex" field actually a plain-prose sentence? Live 2026-09-18
 * (portal-7cefb23d, a pharmacy-technician worked example): the brain filled a
 * showSolution step's `result` with "Less waiting at the counter", the card
 * handed it to the display-math renderer, and KaTeX painted
 * "Lesswaitingatthecounter" — math mode drops spaces and italicises. Callers
 * that receive brain-authored equation fields for non-STEM lessons use this
 * to route prose to the text renderer instead.
 *
 * Prose = no LaTeX/math signal at all (no `\ ^ _ { } $`, no relation
 * `= < > ≤ ≥ ≠`, no arithmetic operator between operands) AND at least
 * three whitespace-separated words AND a real word of 4+ letters. Anything
 * with a math signal stays math; short fragments like "2x" or "sin x" stay
 * math (a 3-letter function name is not a prose word).
 */
export function isProseNotLatex(latex: string): boolean {
  const t = (latex ?? '').trim();
  if (!t) return false;
  if (/[\\^_{}$]/.test(t)) return false;
  if (/[=<>≤≥≠±×÷]/.test(t)) return false;
  if (/\S\s*[+\-*/]\s*\S/.test(t) && /\d/.test(t) && !/[a-zA-Z]{4,}/.test(t)) return false;
  const words = t.split(/\s+/).filter(Boolean);
  if (words.length < 3) return false;
  return /[A-Za-z]{4,}/.test(t);
}

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
// R32 (session-1784825448372): a single-LETTER exponent is math too — the
// Try Yourself card printed "e^x = 2x + 1" with a raw caret because this
// gate only accepted `{` or a digit after ^/_. A caret never appears in
// prose, so letter^letter is unambiguous; the \b keeps it to a single
// letter ("e^x", "a_n") without claiming longer words.
const SHORT_VAR_SCRIPT_RE = /\b[A-Za-z]{1,2}[\^_](?:\{|\d|[A-Za-z]\b)/;
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

// A text-mode group inside maths — `\text{ or }`, `\mathrm{cm}`. Its
// contents are words ON PURPOSE (the author marked them as text), so they
// must not count as "prose" when deciding whether a chunk/string is maths.
const TEXT_GROUP_RE_G = /\\(?:text(?:bf|it|rm|sf|tt|normal)?|mathrm|mathit|mathbf|mathsf|mbox|operatorname)\s*\{[^{}]*\}/g;

function chunkIsProseWord(core: string): boolean {
  // Strip known math-function names AND backslash commands before
  // checking for a leftover English word — otherwise a LaTeX command
  // name like "\frac"/"\sqrt" reads as the prose word "frac"/"sqrt" and
  // wrongly blocks it from joining a run as a neighbor chunk. A complete
  // text group goes first, contents and all (see TEXT_GROUP_RE_G).
  const stripped = core
    .replace(TEXT_GROUP_RE_G, '')
    .replace(FN_NAME_ISOLATED_RE, '')
    .replace(BACKSLASH_CMD_RE_G, '');
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

// Index just past the `}` matching the `{` at `open`, or -1 when the group
// is unbalanced or runs across a line break. Escaped braces (`\{`, `\}`)
// are literal characters, not group delimiters.
function matchingBraceEnd(s: string, open: number): number {
  let depth = 0;
  for (let i = open; i < s.length; i++) {
    const ch = s[i];
    if (ch === '\n') return -1;
    if (ch === '\\') { i++; continue; }
    if (ch === '{') depth++;
    else if (ch === '}') { depth--; if (depth === 0) return i + 1; }
  }
  return -1;
}

// Split on whitespace, EXCEPT inside a balanced LaTeX argument group: a
// `{` that directly follows a command name, a script marker or a previous
// group (`\text{ or }`, `x_{n + 1}`, `\frac{a + b}{2}`) keeps its whole
// group in one chunk even when it contains spaces. Live MCQ card: the
// option `x \le -3 \text{ or } x > 5` was split into `\text{`, `or`, `}`,
// the run ended on an unclosed brace, KaTeX threw, and the option showed
// as raw source. A brace that is NOT an argument (prose "{see note}") or
// that never closes splits on whitespace exactly as before.
function tokenizeChunks(plain: string): Chunk[] {
  const chunks: Chunk[] = [];
  let i = 0;
  while (i < plain.length) {
    if (/\s/.test(plain[i])) { i++; continue; }
    const start = i;
    while (i < plain.length && !/\s/.test(plain[i])) {
      if (plain[i] === '{' && i > start && /[A-Za-z_^}]/.test(plain[i - 1])) {
        const end = matchingBraceEnd(plain, i);
        if (end > 0) { i = end; continue; }
      }
      i++;
    }
    const { core, trail } = stripTrailingPunct(plain.slice(start, i));
    chunks.push({ start, core, trail });
  }
  return chunks;
}

// A chunk that is, on its own, a relation or binary operator.
const OPERATOR_CHUNK_RE = /^(?:[=<>≤≥≠+\-−*/×÷·±]|\\(?:le|leq|ge|geq|lt|gt|ne|neq|approx|equiv|sim|cong|propto|parallel|perp|cdot|times|div|pm|mp|in|notin|subset|subseteq|cup|cap|setminus|to|rightarrow|Rightarrow|implies|iff))$/;
const SINGLE_LETTER_RE = /^[A-Za-z]$/;

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

// Commands after which a SPACED `{` can only be a set literal: relations
// and binary operators take no brace argument ("\cup {4}", "\in {1, 2}").
const SET_CONTEXT_CMD_RE = /^(?:le|leq|ge|geq|lt|gt|ne|neq|approx|equiv|sim|cong|propto|parallel|perp|cdot|times|div|pm|mp|in|notin|ni|subset|subseteq|supset|supseteq|subsetneq|cup|cap|setminus|to|rightarrow|Rightarrow|Leftrightarrow|implies|iff|mid|colon|land|lor|wedge|vee|oplus|triangle|mapsto)$/;

/**
 * Make SET-LITERAL braces visible. In maths mode a bare `{…}` is a TeX
 * group — KaTeX draws nothing for it — so a span containing "{1, 2, 3}"
 * rendered "1, 2, 3": `A \cup B = {1, 2, 3}` showed "A ∪ B = 1, 2, 3", a
 * mathematically wrong board. Every `{` that is not an ARGUMENT brace is
 * rewritten, with its partner, to `\{ … \}`.
 *
 * Argument brace = directly preceded (no space) by a command name, `_`,
 * `^`, a closing `]` or the `}` of a previous argument group — the shape
 * tokenizeChunks keeps together. A `{` after whitespace is a set literal
 * when what precedes the space is not a command / argument group, or is a
 * relation/operator command (SET_CONTEXT_CMD_RE), or when the group holds a
 * top-level comma. What is left — `\frac{1} {2}`, `\alpha {x}` — could be
 * either, so the answer is null: the caller must NOT wrap that string.
 * Unbalanced braces also return null (KaTeX would throw on them anyway).
 */
function escapeSetBraces(latex: string): string | null {
  if (!latex.includes('{') && !latex.includes('}')) return latex;
  const stack: Array<{ pos: number; arg: boolean }> = [];
  const escapeAt: number[] = [];
  let lastArgClose = -2; // index of the `}` that most recently closed an ARGUMENT group
  // Is s[..end) ending in a command name? Returns the name, or null.
  const cmdEndingAt = (end: number): string | null => {
    let j = end;
    while (j > 0 && /[A-Za-z]/.test(latex[j - 1])) j--;
    if (j === end || j === 0 || latex[j - 1] !== '\\') return null;
    // `\\name` is a line break followed by letters, not a command.
    let b = 0;
    for (let k = j - 1; k >= 0 && latex[k] === '\\'; k--) b++;
    return b % 2 === 1 ? latex.slice(j, end) : null;
  };
  for (let i = 0; i < latex.length; i++) {
    const ch = latex[i];
    if (ch === '\\') { i++; continue; } // \{ \} \\ and the first letter of a command
    if (ch === '{') {
      let arg: boolean;
      const prev = i > 0 ? latex[i - 1] : '';
      if (prev === '_' || prev === '^' || prev === ']' || lastArgClose === i - 1 || cmdEndingAt(i) !== null) {
        arg = true;
      } else if (/\s/.test(prev)) {
        let j = i;
        while (j > 0 && /\s/.test(latex[j - 1])) j--;
        const cmd = cmdEndingAt(j);
        const afterArgGroup = lastArgClose === j - 1;
        if ((cmd === null && !afterArgGroup) || (cmd !== null && SET_CONTEXT_CMD_RE.test(cmd))) {
          arg = false;
        } else {
          // Ambiguous unless a top-level comma marks it as a list.
          const end = matchingBraceEnd(latex, i);
          if (end < 0) return null;
          let depth = 0;
          let comma = false;
          for (let k = i + 1; k < end - 1; k++) {
            if (latex[k] === '\\') { k++; continue; }
            if (latex[k] === '{') depth++;
            else if (latex[k] === '}') depth--;
            else if (latex[k] === ',' && depth === 0) { comma = true; break; }
          }
          if (!comma) return null;
          arg = false;
        }
      } else {
        arg = false;
      }
      stack.push({ pos: i, arg });
    } else if (ch === '}') {
      const open = stack.pop();
      if (!open) return null;
      if (open.arg) lastArgClose = i;
      else escapeAt.push(open.pos, i);
    }
  }
  if (stack.length > 0) return null;
  if (escapeAt.length === 0) return latex;
  const at = new Set(escapeAt);
  let out = '';
  for (let i = 0; i < latex.length; i++) out += at.has(i) ? `\\${latex[i]}` : latex[i];
  return out;
}

// Scan a plain-text (no $ in it) span for bare-LaTeX runs and wrap the
// validated ones in $...$.
function autoWrapPlainText(plain: string): string {
  const chunks = tokenizeChunks(plain);
  if (chunks.length === 0) return plain;

  const candidateOk = chunks.map((c) => chunkIsCandidate(c.core));
  const strongOk = chunks.map((c) => chunkHasStrongSignal(c.core));

  // A bare single-letter variable ("x" in "-3 \le x \le 5") has no mathy
  // character, so it used to end the run and render upright between two
  // maths fragments. It may join a run ONLY as an operand of an operator
  // chunk whose OTHER side is also an operand — "x \le 5", "2 + x". That
  // shape is what separates a variable from the article "a" / pronoun "I":
  // "a \frac{1}{2} cup" has no operator, and "a \le sign" has prose on the
  // far side of the operator, so neither joins.
  const isLetter = chunks.map((c) => SINGLE_LETTER_RE.test(c.core));
  const isOperator = chunks.map((c) => OPERATOR_CHUNK_RE.test(c.core));
  const tight = (a: number, b: number) =>
    a >= 0 && b < chunks.length && chunks[a].trail === '' &&
    plain.slice(chunks[a].start + chunks[a].core.length, chunks[b].start) === ' ';
  const operand = (k: number) => k >= 0 && k < chunks.length && (candidateOk[k] || isLetter[k]) && !isOperator[k];
  const letterJoins = chunks.map((_c, k) => isLetter[k] && (
    (isOperator[k + 1] && tight(k, k + 1) && tight(k + 1, k + 2) && operand(k + 2)) ||
    (isOperator[k - 1] && tight(k - 1, k) && tight(k - 2, k - 1) && operand(k - 2))
  ));
  for (let k = 0; k < chunks.length; k++) if (letterJoins[k]) candidateOk[k] = true;

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
    // Set-literal braces in the run are made visible (see escapeSetBraces);
    // a run it cannot settle (null) is not wrapped at all.
    const run = escapeSetBraces(rawRun);
    if (run !== null && isValidLatex(run) && looksLikeMath(run)) {
      result += plain.slice(cursor, runStart) + `$${run}$` + trailPunct;
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

// Short English words that, standing alone in a string, mean it is a
// sentence and not an expression ("so x \le 5", "x \le 5 or x \ge 7").
// Lower-case / Capitalised only — "AB", "AS" in capitals are segment names.
// The brace/script guards keep subscripts like `v_{in}` out of it.
const SHORT_PROSE_WORD_RE = /(?<![A-Za-z0-9_^{\\])(?:[Oo]r|[Ii]f|[Ss]o|[Ii]s|[Oo]f|[Tt]o|[Ii]n|[Oo]n|[Aa]t|[Bb]y|[Aa]s|[Ww]e|[Ii]t|[Bb]e|[Aa]n|[Nn]o|[Dd]o|[Hh]e|[Mm]e|[Mm]y|[Uu]p|[Uu]s|[Aa]m|[Gg]o)(?![A-Za-z0-9_^}])/;

/** Is this (already validated) LaTeX string an expression rather than a
 *  sentence that happens to contain a command? After removing what is
 *  legitimately made of letters in maths — text groups (`\text{ or }`),
 *  command names, function names — nothing word-like may remain: no run of
 *  3+ letters containing a lower-case letter, and no short English word.
 *  Anything that fails falls through to the partial-run pass, i.e. the
 *  conservative behaviour, so a miss here costs nothing new. */
function isMathsOverall(latex: string): boolean {
  const residue = latex
    .replace(TEXT_GROUP_RE_G, ' ')
    .replace(BACKSLASH_CMD_RE_G, ' ')
    .replace(FN_NAME_ISOLATED_RE, ' ');
  // A 3+ letter run in ALL capitals is a label ("ABC" is a triangle).
  const runs = residue.match(/[A-Za-z]{3,}/g) ?? [];
  if (runs.some((r) => /[a-z]/.test(r))) return false;
  return !SHORT_PROSE_WORD_RE.test(residue);
}

/** Whole-string wrap for a `$`-free string that is ONE bare expression —
 *  the answer-choice shape (`x \le -3 \text{ or } x > 5`). Returns null
 *  when the string is not that, so the caller runs the partial-run pass.
 *  Requires a backslash command (the only signal that cannot be prose),
 *  a single line (segment() treats a multi-line $ pair as literal), valid
 *  LaTeX as a whole, and isMathsOverall. Outer whitespace and trailing
 *  sentence punctuation stay outside the span. */
function wrapWholeIfMaths(text: string): string | null {
  const m = text.match(/^(\s*)([\s\S]*?)(\s*)$/);
  if (!m) return null;
  const { core, trail } = stripTrailingPunct(m[2]);
  if (!core || core.includes('\n') || !BACKSLASH_CMD_RE.test(core)) return null;
  if (!isMathsOverall(core)) return null;
  // Set-literal braces become \{ … \}; a string that cannot be settled
  // (null) is left to the partial-run pass.
  const body = escapeSetBraces(core);
  if (body === null || !isValidLatex(body) || !looksLikeMath(body)) return null;
  return `${m[1]}$${body}$${trail}${m[3]}`;
}

/** Auto-wrap bare (un-delimited) LaTeX runs in $...$ so they reach
 *  segment()/KaTeX. See the block comment above for the heuristic and
 *  its false-positive guards. Skips over any already-$-delimited region
 *  verbatim (opaque passthrough) so it never touches working $ math or
 *  the currency guard's territory. */
export function autoWrapLatex(text: string): string {
  if (!text) return text;
  const enumerator = leadingEnumerator(text);
  if (enumerator) return enumerator + wrapBareLatex(text.slice(enumerator.length));
  return wrapBareLatex(text);
}

// A leading enumerator — option letter `A.` `B)` `(C)`, number `1.` `2)`
// `(3)`, or a labelled number `Q1:` `Step 2:` — followed by whitespace.
// Lower-case letters count only in a bracketed form (`a)`, `(b)`): "x. " is
// far likelier a variable than a label.
const ENUMERATOR_RE = /^\s*(?:\(?[A-Za-z]\)|[A-Z]\.|\(?\d{1,2}\)|\d{1,2}\.|(?:Q|Question|Step|Part|Problem|Option|Choice|Example|Case)\s?\d{1,2}[:.)])[ \t]+/;

/** The enumerator prefix of `text` (with its trailing whitespace), or ''.
 *  It must stay OUTSIDE any maths span: `$A. x \le -3$` reads as the
 *  product "A.x" and `$Q1: x \le 3$` italicises the label. Not an
 *  enumerator when what follows starts with an operator — "(A) \cup (B)",
 *  "(x) \cdot 2" are operands — or when nothing follows. */
function leadingEnumerator(text: string): string {
  const m = ENUMERATOR_RE.exec(text);
  if (!m) return '';
  const rest = text.slice(m[0].length);
  const first = /^\S+/.exec(rest)?.[0];
  if (!first || OPERATOR_CHUNK_RE.test(stripTrailingPunct(first).core)) return '';
  return m[0];
}

function wrapBareLatex(text: string): string {
  if (!text) return text;
  if (!text.includes('$')) {
    const whole = wrapWholeIfMaths(text);
    if (whole !== null) return whole;
  }
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
/** A $…$ span whose inner text reads as PROSE that opened with a money
 *  amount — "$120 give a different result than on $100" pairs the two
 *  currency signs into one bogus math span. Shape: a bare amount, then
 *  whitespace, then a real word (3+ letters) somewhere, and no LaTeX
 *  command (a `\text{…}` or `\times` span is math however it starts).
 *  Live check 6 (2026-09-07, portal-63ee9f2c): the Q-pin gist echoed the
 *  tutor's spoken prices and `forceMath` rendered them as math. */
export function looksLikeCurrencySpan(inner: string): boolean {
  return /^\s*\d[\d,]*(?:\.\d+)?\s+\S/.test(inner)
    && /[A-Za-z]{3,}/.test(inner)
    && !/\\[A-Za-z]+/.test(inner);
}

/** `forceMath` (2026-07-15, Q pin): relax the currency guard — a balanced
 *  $...$ pair is math even when `looksLikeMath` is unsure ("$2 - x$"), for
 *  contexts where the text comes from a prompt that says $...$ means LaTeX
 *  (the question-gist route). Since 2026-09-07 it still yields to a span
 *  that is unmistakably two currency amounts around prose
 *  (`looksLikeCurrencySpan`) — the gist echoes spoken prices verbatim. */
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
    if (!looksLikeMath(inner) && (!forceMath || looksLikeCurrencySpan(inner))) {
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

/**
 * Pre-KaTeX normalization shared by the inline-math renderers
 * (InlineMathText / EquationRenderer): collapse model double-escapes
 * (\\frac → \frac) and convert literal "\n" escapes to real newlines.
 *
 * The newline conversion carries a negative lookahead so it never eats
 * the start of \n-prefixed LaTeX commands — \neq, \not, \nabla, \nu,
 * \ne, \nmid… Round-28 (live 2026-07-18): InlineMathText shipped the
 * unguarded form, so "x\neq2" lost its backslash and rendered as italic
 * "xeq2" in problem cards and transcript bubbles, while EquationRenderer
 * (which already had the guard) rendered the same input correctly.
 */
export function preprocessKatexBody(latex: string): string {
  return latex
    .replace(/\\\\(?=[a-zA-Z{])/g, '\\')
    .replace(/\\n(?![a-zA-Z])/g, '\n');
}

/**
 * Is `\name` a command KaTeX knows? Asked of the parser itself rather than
 * a hand-kept list: an unknown name is the one failure KaTeX reports as
 * "Undefined control sequence"; any other outcome (it rendered, or it
 * complained about a missing argument, as `\text` alone does) means the
 * command exists.
 */
const KNOWN_COMMAND_CACHE = new Map<string, boolean>();
function isKnownLatexCommand(name: string): boolean {
  const cached = KNOWN_COMMAND_CACHE.get(name);
  if (cached !== undefined) return cached;
  let known = true;
  try {
    katex.renderToString(`\\${name}`, { throwOnError: true, displayMode: false, strict: false, trust: true });
  } catch (err) {
    known = !/undefined control sequence/i.test(String((err as Error)?.message ?? err));
  }
  KNOWN_COMMAND_CACHE.set(name, known);
  return known;
}

/* ── Literal backslash-n as a LINE SEPARATOR ────────────────────────────
 *
 * Live: the brain's `show_problem` statement for an uploaded worksheet held
 * the two characters `\` + `n` between sentences and numbered items (LaTeX-
 * style escaping over-applied to a line break). `preprocessKatexBody` only
 * ever runs on maths segments, so the card and the PDF printed them.
 *
 * Review 2026-10-04: the first cut converted ANY backslash-n / backslash-t
 * that did not start a KaTeX command, and that damaged real content —
 * string literals (`print("a\nb")`), Windows paths, prose ABOUT escapes,
 * macros KaTeX does not know (`\textcelsius`). Backslash-n is content far
 * more often than it is a mistake, so the rule is now: convert only the
 * unmistakable separator, and when unsure leave the text alone.
 *
 * A literal backslash-n is converted only when ALL of these hold:
 *   1. what follows it (after any further backslash-n's / spaces) has the
 *      shape of a new line: a list marker, a capitalised word, a `$`, a
 *      digit, or the end of the string after sentence punctuation;
 *   2. it is not inside a quoted / backticked span or a `$…$` maths span;
 *   3. nothing in the string says the text is ABOUT escapes or paths
 *      (another backslash escape in prose, a drive path, the words
 *      "newline" / "backslash" / …, a programming cue) — any of those
 *      leaves the WHOLE string untouched.
 * Backslash-t is never converted: a tab separator has no realistic use on
 * the board, and every `\t…` is far likelier a LaTeX command or a path.
 */

/** Signs that the string is about escape sequences, code or file paths. */
const ESCAPE_TOPIC_RE = new RegExp([
  String.raw`\bnew-?lines?\b`, String.raw`\bline[- ]?feeds?\b`, String.raw`\bcarriage returns?\b`,
  String.raw`\bescap(?:e|es|ed|ing)\b(?!\s+(?:velocit|speed|energ))`,
  String.raw`\btab characters?\b`, String.raw`\bback-?slash(?:es)?\b`,
  String.raw`\bstring literals?\b`, String.raw`\bregex(?:es|p)?\b`, String.raw`\bregular expressions?\b`,
  // Language / tool names that are not also everyday or science words
  // ("shell", "rust", "echo", "print", "puts" are — they stay out).
  String.raw`\b(?:python|javascript|typescript|java|php|kotlin|bash|powershell|pseudocode)\b`,
  String.raw`\bc\+\+`, String.raw`\bc#`, String.raw`\bprogramming\b`, String.raw`\bsource code\b`, String.raw`\bcode snippet\b`,
  String.raw`\b(?:printf|println|grep|awk|cout|stdout|stdin)\b`,
  String.raw`\bconsole\.log\b`, String.raw`\bsystem\.out\b`, 
  // a call with a quoted argument: print("…"), s.split('…')
  String.raw`\w\(\s*["'\x60]`,
].join('|'), 'i');
/** A backslash + letter in prose that is not our own token (backslash-n, or
 *  the CRLF pair backslash-r backslash-n): another escape, a LaTeX command
 *  outside `$…$`, or a path segment. A doubled backslash is not counted. */
const OTHER_BACKSLASH_RE = /(?<!\\)\\(?!n)(?!r\\n)[a-zA-Z]/;
const DRIVE_PATH_RE = /(?:^|[^a-zA-Z])[a-zA-Z]:\\/;

/** `$…$` spans that are maths, by `segment`'s own rule (so currency prose —
 *  "Maya has $50.\nBen has $15." — is the prose it is). The escape itself
 *  must not be what makes a pair "look like maths" (a backslash is a LaTeX
 *  signal), so the pair is judged with its backslash-n's blanked out. */
function mathSpanRanges(text: string): Array<[number, number]> {
  const ranges: Array<[number, number]> = [];
  let i = 0;
  while (i < text.length) {
    const dollar = text.indexOf('$', i);
    if (dollar < 0) break;
    if (dollar > 0 && text[dollar - 1] === '\\') { i = dollar + 1; continue; }
    const close = text.indexOf('$', dollar + 1);
    if (close < 0) break;
    const inner = text.slice(dollar + 1, close);
    const probe = inner.replace(/(?<!\\)(?:\\r)?\\n(?![a-z])/g, ' ').replace(/\n/g, ' ');
    if (!inner.trim() || inner.includes('\n') || !looksLikeMath(probe)) {
      // Not a maths span: this "$" is literal prose; the closing one may
      // still open a real span, so resume right after the opener.
      i = dollar + 1;
      continue;
    }
    ranges.push([dollar, close + 1]);
    i = close + 1;
  }
  return ranges;
}

const OPEN_QUOTES: Record<string, string> = { '"': '"', "'": "'", '`': '`', '“': '”', '‘': '’' };
const isWordChar = (c: string | undefined) => !!c && /[A-Za-z0-9]/.test(c);

/** Quoted / backticked spans: anything between matching quotes on the same
 *  line is string or code content. An opening quote must not follow a
 *  letter or digit (so apostrophes — don't, Maya's, students' — primes and
 *  inch marks never open a span), and an apostrophe between two letters
 *  never closes one. `masked` has maths spans blanked out already. */
function quotedSpanRanges(masked: string): Array<[number, number]> {
  const ranges: Array<[number, number]> = [];
  let i = 0;
  while (i < masked.length) {
    const closer = OPEN_QUOTES[masked[i]];
    if (!closer || (masked[i] !== '`' && isWordChar(masked[i - 1]))) { i++; continue; }
    let j = i + 1;
    let end = -1;
    for (; j < masked.length && masked[j] !== '\n'; j++) {
      if (masked[j] !== closer) continue;
      if ((closer === "'" || closer === '’') && isWordChar(masked[j - 1]) && /[A-Za-z]/.test(masked[j + 1] ?? '')) continue;
      end = j;
      break;
    }
    if (end < 0) { i++; continue; }
    ranges.push([i, end + 1]);
    i = end + 1;
  }
  return ranges;
}

/** One literal backslash-n (optionally the CRLF pair). The lookbehind
 *  leaves a doubled backslash alone: `\\n` is a LaTeX row break followed by
 *  the letter n. */
const LITERAL_BREAK_RE = /(?<!\\)(?:\\r)?\\n/g;
/** Further separators / blanks between this one and what the line starts with. */
const BREAK_RUN_RE = /^(?:(?:\\r)?\\n|[ \r\n])*/;
const LIST_MARKER_RE = /^(?:\d+[.)]|\((?:\d+|[a-zA-Z])\)|[-•*–−](?=[\s\d$a-zA-Z(]))/;
/** "a) " — a lettered item. It must be followed by whitespace, and it is
 *  trusted only where letteredMarkerAllowed says so: "\nu) is" is the
 *  command \nu before a bracket far more often than an item "u)". */
const LETTERED_MARKER_RE = /^[a-zA-Z]\)(?=\s)/;
/** Every lettered marker in the string: at its start, or after a real or
 *  literal line break. */
const LETTERED_ITEMS_RE = /(?:^|\n|(?<!\\)\\n)[ \t]*([a-zA-Z])\)(?=\s)/g;

/** Does the string hold a lettered LIST — two markers whose letters are
 *  neighbours in the alphabet ("d)" and "e)")? */
function hasLetteredList(text: string): boolean {
  const codes = [...text.matchAll(LETTERED_ITEMS_RE)].map((m) => m[1].toLowerCase().charCodeAt(0));
  return codes.some((c) => codes.includes(c + 1));
}

export function normalizeLiteralLineBreaks(text: string): string {
  if (typeof text !== 'string' || !text.includes('\\n')) return text;

  const maths = mathSpanRanges(text);
  let masked = text;
  for (const [a, b] of maths) masked = masked.slice(0, a) + ' '.repeat(b - a) + masked.slice(b);
  // Whole-string vetoes: the text is about escapes, code or paths.
  if (OTHER_BACKSLASH_RE.test(masked) || DRIVE_PATH_RE.test(masked) || ESCAPE_TOPIC_RE.test(masked)) return text;

  const guarded = [...maths, ...quotedSpanRanges(masked)];
  const isGuarded = (idx: number) => guarded.some(([a, b]) => idx >= a && idx < b);

  let parenDepth = 0;
  let scanned = 0;
  return text.replace(LITERAL_BREAK_RE, (m: string, offset: number) => {
    // Open "(" count in the prose before this point: "(\nu)" is a
    // parenthesised symbol, not the list item "u)".
    for (; scanned < offset; scanned++) {
      if (masked[scanned] === '(') parenDepth++;
      else if (masked[scanned] === ')' && parenDepth > 0) parenDepth--;
    }
    if (isGuarded(offset)) return m;
    const after = text.slice(offset + m.length);
    const rest = after.slice(BREAK_RUN_RE.exec(after)![0].length);
    if (rest === '') {
      // Trailing separator: only after a finished sentence or item, never a
      // string that IS the escape (an answer choice "\n") or ends in one.
      return /[.?!:;)$]\s*(?:(?:\\r)?\\n|\s)*$/.test(text.slice(0, offset)) ? '\n' : m;
    }
    // List markers are tested BEFORE the LaTeX-command guard: in
    // "…\nd) four\ne) five" the last item spells the command \ne.
    // A lettered marker counts only when it is unmistakable — it opens the
    // string or follows sentence punctuation, or the string holds a second
    // lettered item next to it in the alphabet. "frequency \nu) is" is
    // neither, and falls through to the command guard below.
    if (LIST_MARKER_RE.test(rest)) return '\n';
    if (parenDepth === 0 && LETTERED_MARKER_RE.test(rest)
      && (/(?:^|[.?!:;])(?:(?:\\r)?\\n|\s)*$/.test(text.slice(0, offset)) || hasLetteredList(text))) return '\n';
    if (rest[0] === '$' || /^\d/.test(rest)) return '\n';
    if (rest !== after) {
      // A run of separators / blanks sits between this one and the text.
      return /^[A-Z][A-Za-z]/.test(rest) ? '\n' : m;
    }
    // Letters glued to the backslash-n: a KaTeX command (\nRightarrow,
    // \nLeftarrow…) is never a break, a capitalised word ("\nSolve") is.
    const run = /^[a-zA-Z]*/.exec(rest)![0];
    if (isKnownLatexCommand('n' + run)) return m;
    return /^[A-Z][A-Za-z]/.test(rest) ? '\n' : m;
  });
}

/** Keys whose ENTIRE subtree is left byte-identical: maths, code, data and
 *  lookup keys (wb-emphasis-strip's SKIP_KEYS — built FROM it, so the two
 *  cannot drift), the call-stack value fields and raw `svg`, and — review
 *  2026-10-04 — every answer-bearing or tabular field. A choice list must
 *  keep byte-identity with the key it is compared against (`expectedAnswer`
 *  was skipped while `answerChoices` was rewritten, so they stopped
 *  matching), and a table cell that IS an escape ("\n" | "newline") is the
 *  content. */
const LITERAL_BREAK_EXTRA_SKIP_KEYS = [
  'frames', 'args', 'locals', 'returnValue', 'finalReturn', 'svg',
  'answerChoices', 'choices', 'options', 'answer', 'answers', 'correctAnswer', 'correctChoice', 'solution',
  'expected', 'value', 'values', 'rows', 'headers', 'cells', 'columns', 'resultMatrix', 'rowLabels', 'colLabels',
  'highlights', 'lines', 'id', 'path',
];
const LITERAL_BREAK_SKIP_KEYS = new Set<string>([...SKIP_KEYS, ...LITERAL_BREAK_EXTRA_SKIP_KEYS]);

/** The ONLY keys whose strings are converted: fields that hold a prose
 *  statement. An allow-list, because a new tool field is far likelier to be
 *  data than a place a model types a multi-line statement. Names checked
 *  against WHITEBOARD_TOOLS in toolDefinitions.ts (2026-10-04). */
export const LITERAL_BREAK_PROSE_KEYS: ReadonlySet<string> = new Set<string>([
  'statement', 'problem', 'problemText', 'text', 'caption', 'title', 'label', 'description',
  'hint', 'hints', 'note', 'notes', 'instruction', 'instructions', 'prompt', 'explanation',
  'body', 'content', 'summary',
  // further prose fields the tool schemas use
  'question', 'passage', 'keyIdea', 'keyTakeaways', 'checkQuestion', 'tutorSays',
]);

function deepNormalizeUnderKey(value: unknown, proseKey: boolean): unknown {
  if (typeof value === 'string') return proseKey ? normalizeLiteralLineBreaks(value) : value;
  // An array inherits its key: hints: ["…", "…"].
  if (Array.isArray(value)) return value.map((v) => deepNormalizeUnderKey(v, proseKey));
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = LITERAL_BREAK_SKIP_KEYS.has(k) ? v : deepNormalizeUnderKey(v, LITERAL_BREAK_PROSE_KEYS.has(k));
    }
    return out;
  }
  return value;
}

/** normalizeLiteralLineBreaks over the PROSE fields of a tool-args tree
 *  (see LITERAL_BREAK_PROSE_KEYS); everything else is copied through.
 *  Returns a NEW structure; never mutates the input. */
export function deepNormalizeLiteralLineBreaks(value: unknown): unknown {
  return deepNormalizeUnderKey(value, false);
}
