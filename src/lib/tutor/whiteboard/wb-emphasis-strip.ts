/**
 * Whiteboard markdown-emphasis strip — the ONE implementation for tool-call
 * display strings (2026-07-24 full-surface audit, after live round 6 showed
 * "*same*" printed literally in a try-yourself card).
 *
 * The brain writes markdown emphasis into tool args ("the *same* number",
 * "**Your turn**"). Chat bubbles render markdown, but board renderers print
 * strings verbatim (or via InlineMathText, which only special-cases $...$),
 * so students see literal asterisks. The round-2 strip (860135be) covered
 * only top-level label/title; every nested display field leaked.
 *
 * Two protections the sibling helpers each had HALF of:
 *  - math-span awareness (question-gist-text.ts): $...$ spans are never
 *    emphasis — split them out, strip only the surrounding prose;
 *  - multiplication/exponent guards (round-2 toolDefinitions regex):
 *    "a*b", "2*3", "x ** y", "a**2 + b**2" are math, not markup — a star
 *    adjacent to a word char on the OUTSIDE of the pair is never an
 *    emphasis marker, and pair content must not start/end with whitespace.
 *
 * deepStripWbEmphasis() walks a whole funcArgs tree so every renderer
 * inherits, skipping subtrees under SKIP_KEYS: fields where asterisks are
 * legitimate content (latex/code/expressions/DNA), or that are lookup /
 * matching keys where any rewrite breaks semantics (scribble target,
 * link from/to, handwrite near, expectedAnswer answer-matching).
 */

/** A $...$ math span. Content must not itself contain "$" or a newline —
 *  same shape as question-gist-text.ts and the TTS layer. */
const DOLLAR_MATH_RE = /\$[^$\n]*\$/g;

/** **bold**: outside edges must not touch word chars (rejects a**2 + b**2),
 *  content must be non-empty and not whitespace-edged (rejects x ** y ** z). */
const BOLD_RE = /(?<![\w*])\*\*(\S(?:[^*]*\S)?)\*\*(?![\w*])/g;

/** *italic*: identical guards to the shipped round-2 regex. */
const ITALIC_RE = /(?<![\w*])\*([^*\s][^*]*?)\*(?![\w*])/g;

/** Strip *italic* / **bold** emphasis from one display string, preserving
 *  $...$ math spans and bare-asterisk math untouched. */
export function stripWbEmphasisText(s: string): string {
  const mathSpans = s.match(DOLLAR_MATH_RE) ?? [];
  return s
    .split(DOLLAR_MATH_RE)
    .map((part) => part.replace(BOLD_RE, '$1').replace(ITALIC_RE, '$1'))
    .reduce((out, part, i) => out + part + (mathSpans[i] ?? ''), '');
}

/** Flatten $...$ math for text surfaces that have NO KaTeX renderer — the
 *  ink/handwrite overlay (canvas-measured cursive), scribble labels, and
 *  link labels (round 29, live: a note rendered literally as "$10$ is
 *  even"). Unwraps the delimiters and downgrades the few LaTeX commands
 *  the brain actually emits in note-length text; everything KaTeX-bound
 *  keeps its spans (do NOT wire this into deepStripWbEmphasis). */
export function stripInlineMathForInk(s: string): string {
  return s
    .replace(/\$([^$\n]{1,160})\$/g, '$1')
    .replace(/\\(?:times|cdot)\b/g, '×')
    .replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, '$1/$2')
    .replace(/\\text\{([^{}]*)\}/g, '$1')
    .replace(/[{}]/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/** Keys whose ENTIRE subtree must never be rewritten. Grouped by reason. */
const SKIP_KEYS = new Set<string>([
  // math / expressions — asterisks are content
  'latex', 'expr', 'fn', 'formula', 'equation', 'expression',
  'substitution', 'result', 'trendLineEquation', 'expectedUnit',
  'symbol', 'unit', 'units',
  // code — ** is exponentiation, * is deref/glob/multiply
  'code', 'language', 'entry', 'entryName', 'testCases', 'tests',
  // chem / bio data
  'smiles', 'sequence', 'complement', 'mrna', 'parent1', 'parent2',
  'configuration', 'highlight',
  // board-map lookup keys — must match feature names byte-for-byte
  'target', 'near', 'from', 'to',
  // answer matching — dual display/compare use; a rewrite could flip verdicts
  'expectedAnswer',
  // resource locators
  'src', 'query', 'background',
]);

/** Recursively strip emphasis from every string in a tool-args tree,
 *  skipping SKIP_KEYS subtrees. Returns a NEW structure — never mutates
 *  the input (raw args are still read for telemetry/manifests). */
export function deepStripWbEmphasis(value: unknown): unknown {
  if (typeof value === 'string') return stripWbEmphasisText(value);
  if (Array.isArray(value)) return value.map((v) => deepStripWbEmphasis(v));
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = SKIP_KEYS.has(k) ? v : deepStripWbEmphasis(v);
    }
    return out;
  }
  return value;
}
