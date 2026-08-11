/**
 * Pure string transform behind CellContent's whole-cell (non-$-delimited)
 * KaTeX path. Lives in its own plain .ts file — not CellContent.tsx —
 * because CellContent.tsx transitively imports EquationRenderer, which does
 * `import 'katex/dist/katex.min.css'`; that side-effect CSS import makes the
 * file un-importable from node test scripts run outside a bundler (tsx/
 * ts-node choke on raw CSS). Keeping the normalization pure and CSS-free
 * here is what makes it testable (see scripts/test-cell-content-normalize.ts),
 * matching the existing pattern of choiceLabel.ts and
 * src/lib/tutor/whiteboard/inline-math.ts in this codebase.
 */

/** Named math functions KaTeX would render upright anyway (sin, cos, ...) —
 *  never candidates for \text{} wrapping even when they read like prose. */
const MATH_FN_NAMES = new Set(['sin', 'cos', 'tan', 'cot', 'sec', 'csc', 'log', 'ln', 'exp', 'lim', 'max', 'min', 'arg', 'det', 'dim', 'gcd', 'lcm']);

/** Filler/prose words whose presence signals "this cell has English text in
 *  it, not just math" — gates whether we attempt \text{}-wrapping at all.
 *  Kept narrow so pure-math cells (e.g. "e^{kx}, sin(kx), cos(kx)") aren't
 *  touched: none of their tokens are in this list. */
const PROSE_SIGNAL_RE = /\b(with|and|the|of|in|to|from|then|for|using|given|or|as|it|is|are|each|both|let|apply|rewrite|simplify|substitution|substitute|multiply|divide|expression|original|result|answer|step|formula|final|combined|limit|upper|lower|angle|base|height|width|length|opp|adj|hyp|radius|side|area|perimeter|diameter)\b/i;

/** Glue characters that keep two adjacent prose words in the SAME \text{}
 *  run (spaces + light punctuation: commas, colons, semicolons, hyphens,
 *  en/em-dashes). Anything else between two words (a math token, digits,
 *  braces, …) breaks the run. */
const GLUE_ONLY_RE = /^[\s,;:—–-]*$/;

/**
 * Pure string transform applied to a cell's LaTeX source right before it's
 * handed to KaTeX, in the whole-cell (non-$-delimited) path. Two fixes:
 *
 * (a) Brace bare parenthesized superscripts: `f^(n)` → `f^{(n)}`. Unbraced,
 *     KaTeX treats `^(` as "superscript the '(' only", gluing the exponent
 *     to a lone open-paren and leaving the rest ("n)") as a separate math
 *     token — the 2026-08-11 "f^(" + glued "n" bug (portal-d7ec8e42).
 *
 * (b) Wrap prose word-RUNS (not single words) in `\text{...}`, absorbing the
 *     whitespace immediately touching each run into the \text{} content.
 *     KaTeX math mode discards bare whitespace outside \text{} — the earlier
 *     version of this wrap (one \text{} per word) produced
 *     "\text{Best} \text{strategy} \text{for}", and the spaces BETWEEN those
 *     \text{} blocks are math-mode whitespace, so KaTeX rendered
 *     "Beststrategyfor" (portal-d7ec8e42 live failure). Wrapping the whole
 *     run as one \text{Best strategy for } block keeps the spaces where
 *     KaTeX actually preserves them: inside \text{}.
 *
 * Only runs of the form "prose word\S{2,}" (2+ letters) count, so single-
 * letter math variables (f, n, x) and named math functions (sin, cos, ...)
 * are left outside any \text{} — they stay in math mode.
 */
export function normalizeCellForKatex(value: string): string {
  // (a) brace bare parenthesized superscripts, e.g. f^(n) -> f^{(n)}.
  const s = value.replace(/\^\(([^()]{1,8})\)/g, '^{($1)}');

  // Gate: only attempt prose wrapping if the cell reads like it has English
  // filler words in it. Pure-math cells (no filler words) pass through
  // unchanged — this is what keeps "e^{kx}, sin(kx), cos(kx)" byte-identical.
  if (!PROSE_SIGNAL_RE.test(s)) return s;

  // Collect every 2+ letter alphabetic word and its position.
  const words: { start: number; end: number; text: string }[] = [];
  const wordRe = /[A-Za-z]{2,}/g;
  let m: RegExpExecArray | null;
  while ((m = wordRe.exec(s))) {
    words.push({ start: m.index, end: m.index + m[0].length, text: m[0] });
  }

  const isSkippable = (w: { start: number; text: string }) =>
    s[w.start - 1] === '\\' || MATH_FN_NAMES.has(w.text.toLowerCase());

  // Merge consecutive words into runs when only "glue" (spaces / light
  // punctuation) separates them — this is what keeps a multi-word phrase in
  // ONE \text{} block instead of one-per-word.
  const runs: { start: number; end: number }[] = [];
  let i = 0;
  while (i < words.length) {
    const w = words[i];
    if (isSkippable(w)) { i++; continue; }
    let runEnd = w.end;
    let j = i + 1;
    while (j < words.length) {
      const nw = words[j];
      const glue = s.slice(runEnd, nw.start);
      if (!isSkippable(nw) && GLUE_ONLY_RE.test(glue)) {
        runEnd = nw.end;
        j++;
      } else break;
    }
    runs.push({ start: w.start, end: runEnd });
    i = j;
  }
  if (runs.length === 0) return s;

  // Emit: literal text between runs stays as-is, except whitespace directly
  // touching a run's boundary is pulled INSIDE the \text{} so KaTeX doesn't
  // eat it.
  let result = '';
  let cursor = 0;
  for (const run of runs) {
    // Trailing whitespace of the literal segment before this run becomes
    // leading whitespace inside this run's \text{}.
    let literalEnd = run.start;
    while (literalEnd > cursor && /\s/.test(s[literalEnd - 1])) literalEnd--;
    const leadWs = s.slice(literalEnd, run.start);
    result += s.slice(cursor, literalEnd);

    // Leading whitespace right after this run becomes trailing whitespace
    // inside the \text{}.
    let after = run.end;
    while (after < s.length && /\s/.test(s[after])) after++;
    const trailWs = s.slice(run.end, after);

    result += `\\text{${leadWs}${s.slice(run.start, run.end)}${trailWs}}`;
    cursor = after;
  }
  result += s.slice(cursor);
  return result;
}
