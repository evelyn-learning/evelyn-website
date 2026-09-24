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

function normalizeInner(inner: string): string {
  return inner
    .replace(/[()[\]<>]/g, ' ')
    .replace(/\\[{}]/g, ' ')
    .replace(/\.{2,}|…/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/** Returns the offending placeholder token, or null when the latex is clean. */
export function equationPlaceholder(latex: string): string | null {
  const s = String(latex ?? '');
  if (!s) return null;
  for (const m of s.matchAll(TEXT_MACRO_RE)) {
    const inner = normalizeInner(m[1]);
    if (PLACEHOLDER_SET.has(inner) || MULTI_QUESTION_RE.test(inner)) return m[0];
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
