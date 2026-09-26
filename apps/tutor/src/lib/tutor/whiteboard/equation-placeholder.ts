/**
 * show_equation placeholder guard (shared by the client validator in
 * VoiceTutorRealtime and the server-side processToolCall path).
 *
 * Live 2026-09-24 (portal-5b701ac0, GreenApple round 6 Task 5): the board
 * rendered `z = \text{(something)} - 24\frac{2}{9}` — the brain wrote a
 * placeholder word as math instead of the real expression (or instead of
 * only the step the student had stated). Generic: flags only placeholder
 * WORDS and `??`/`???`; numbers, variables and a lone `?` (a legitimate
 * "= ?" prompt) pass.
 */

const PLACEHOLDER_WORDS = [
  'something', 'anything', 'answer', 'value', 'result', 'number', 'expression',
  'unknown', 'blank', 'todo', 'tbd', 'placeholder', 'fill in', 'your answer',
];
const PLACEHOLDER_SET = new Set(PLACEHOLDER_WORDS);

/** `\text{…}` and its text-mode siblings, innermost (no nested braces). */
const TEXT_MACRO_RE = /\\(?:text|mathrm|textit|textbf|textrm)\s*\{([^{}]*)\}/g;

/** Bare `(something)` outside a text macro. */
const BARE_PAREN_RE = new RegExp(
  `\\(\\s*(?:${PLACEHOLDER_WORDS.map((w) => w.replace(/ /g, '\\s+')).join('|')})\\s*\\)`,
  'i',
);

/** Two or more consecutive question marks. A lone `?` is allowed. */
const MULTI_QUESTION_RE = /\?{2,}/;

/**
 * Fix round 1: brackets → spaces, drop ellipses, collapse whitespace, then
 * strip trailing punctuation (`: . , ; ! ?`) and ONE leading article /
 * possessive (`the|an|a|your|my`) so "the answer", "an answer", "Answer:"
 * all reduce to a list word.
 */
function normalizeInner(inner: string): string {
  return inner
    .replace(/[()[\]<>]/g, ' ')
    .replace(/\\[{}]/g, ' ')
    .replace(/\.{2,}|…/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .replace(/[:.,;!?\s]+$/, '')
    .replace(/^(?:the|an|a|your|my)\s+/, '')
    .trim();
}

/** Strip one layer of surrounding math delimiters: `$…$`, `$$…$$`, `\(…\)`, `\[…\]`. */
function stripMathDelimiters(latex: string): string {
  const t = latex.trim();
  const m = t.match(/^\$\$([\s\S]*)\$\$$/) || t.match(/^\$([\s\S]*)\$$/)
    || t.match(/^\\\(([\s\S]*)\\\)$/) || t.match(/^\\\[([\s\S]*)\\\]$/);
  return m ? m[1].trim() : t;
}

/** Text-mode macros (not \mathrm) that read as a heading when they open the card. */
const LEADING_LABEL_RE = /^\\(?:text|textit|textbf|textrm)\s*\{/;

/**
 * Final fix wave: a list word is a placeholder only as an OPERAND — directly
 * adjacent (ignoring whitespace) to `=`, `+`, `-`, `\cdot`, `\times`, `/`,
 * or inside `\frac{…}{…}`. As a function/probability argument
 * (`P(\text{number} > 3)`) it is real text.
 */
const OPERAND_BEFORE_RE = /(?:=|\+|-|\\cdot|\\times|\/|\\[dt]?frac\s*\{|\}\s*\{)\s*$/;
const OPERAND_AFTER_RE = /^\s*(?:=|\+|-|\\cdot|\\times|\/)/;
function isOperand(before: string, after: string, fracNumerator: boolean): boolean {
  return OPERAND_BEFORE_RE.test(before) || OPERAND_AFTER_RE.test(after) || fracNumerator;
}

/** Returns the offending placeholder token, or null when the latex is clean. */
export function equationPlaceholder(latex: string): string | null {
  const s = stripMathDelimiters(String(latex ?? ''));
  if (!s) return null;
  for (const m of s.matchAll(TEXT_MACRO_RE)) {
    const start = m.index ?? 0;
    const end = start + m[0].length;
    // Fix round 1: the whole card is just the label (`\text{Result}`) → heading.
    if (m[0] === s) continue;
    // Final wave (b): a text macro opening the card, followed by more content,
    // is a label (`\text{Answer: } x = 5`, `\text{Value} = 12`).
    if (start === 0 && LEADING_LABEL_RE.test(m[0])) continue;
    const inner = normalizeInner(m[1]);
    if (!PLACEHOLDER_SET.has(inner) && !MULTI_QUESTION_RE.test(inner)) continue;
    const before = s.slice(0, start);
    const after = s.slice(end);
    // `\frac{\text{value}}{2}`: macro fills the numerator group.
    const fracNumerator = /\\[dt]?frac\s*\{\s*$/.test(before) && /^\s*\}\s*\{/.test(after);
    if (isOperand(before, after, fracNumerator)) return m[0];
  }
  const q = s.match(MULTI_QUESTION_RE);
  if (q) return q[0];
  const bare = s.match(BARE_PAREN_RE);
  if (bare) return bare[0];
  return null;
}

export function equationPlaceholderReason(token: string): string {
  return `show_equation was rejected because the equation contains a placeholder (\`${token}\`). ` +
    'Write the real expression, or write only the step the student has actually stated; never a placeholder on the board.';
}
