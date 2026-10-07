/**
 * The student's own problem text — readable form, comparison form, and the
 * expressions in it (2026-10-06c, owner live sessions portal-c301c9ad and
 * portal-818996c1).
 *
 * Three uses, one normalisation:
 *   - a page title shown to the student must not be raw LaTeX source
 *     (`\dfrac{x^2 - 9}{x - 3}` was shown as typed) — `readableMathText`;
 *   - a problem card is "the student's homework problem" when its expressions
 *     are the problem's, however it is typeset — `cardMatchesProblem`;
 *   - the problem text is the STUDENT'S: a homework problem card or an
 *     enumerated entry that carries a relation the student never wrote
 *     (portal-818996c1: "y < −2x + 4 and 2x + y < 4" for a system the student
 *     typed as "2x + y < 4 and x − 3y > 2") is not their problem as written —
 *     `ungroundedRelations`.
 *
 * Generic: no subject content. Pure; never throws.
 * `npm run test:owner-session-1006c`.
 */

const SUPERSCRIPT: Record<string, string> = {
  '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', 'ⁿ': 'n',
};

/** Index just past the brace group that opens at `open` ('{'), or -1. */
function braceEnd(s: string, open: number): number {
  if (s[open] !== '{') return -1;
  let depth = 0;
  for (let i = open; i < s.length; i++) {
    if (s[i] === '{') depth++;
    else if (s[i] === '}') { depth--; if (depth === 0) return i + 1; }
  }
  return -1;
}

/** `\frac{A}{B}` (and \dfrac, \tfrac) → `(A)/(B)`, nested groups included. */
function expandFractions(s: string): string {
  let out = s;
  for (let guard = 0; guard < 20; guard++) {
    const m = /\\[dt]?frac\s*(?=\{)/.exec(out);
    if (!m) break;
    const aStart = m.index + m[0].length;
    const aEnd = braceEnd(out, aStart);
    if (aEnd < 0) break;
    let bStart = aEnd;
    while (out[bStart] === ' ') bStart++;
    const bEnd = braceEnd(out, bStart);
    if (bEnd < 0) break;
    const a = out.slice(aStart + 1, aEnd - 1);
    const b = out.slice(bStart + 1, bEnd - 1);
    out = `${out.slice(0, m.index)}(${a})/(${b})${out.slice(bEnd)}`;
  }
  return out;
}

/**
 * Maths written as a person would read it, with no LaTeX source left:
 * "Simplify $f(x) = \dfrac{x^2 - 9}{x - 3}$" → "Simplify f(x) = (x^2 − 9)/(x − 3)".
 */
export function readableMathText(text: string): string {
  let t = String(text ?? '');
  t = expandFractions(t);
  t = t
    .replace(/\\(?:left|right|displaystyle|textstyle|,|;|!|quad|qquad)(?![a-zA-Z])/g, '')
    .replace(/\\lim_\{([^{}]*)\}/g, 'lim($1)')
    .replace(/\\sqrt\s*\{([^{}]*)\}/g, '√($1)')
    .replace(/\\(?:le|leq|leqslant)(?![a-zA-Z])/g, '≤')
    .replace(/\\(?:ge|geq|geqslant)(?![a-zA-Z])/g, '≥')
    .replace(/\\(?:ne|neq)(?![a-zA-Z])/g, '≠')
    .replace(/\\lt(?![a-zA-Z])/g, '<')
    .replace(/\\gt(?![a-zA-Z])/g, '>')
    .replace(/\\(?:to|rightarrow)(?![a-zA-Z])/g, '→')
    .replace(/\\(?:cdot|times)(?![a-zA-Z])/g, '·')
    .replace(/\\div(?![a-zA-Z])/g, '÷')
    .replace(/\\pm(?![a-zA-Z])/g, '±')
    .replace(/\\infty(?![a-zA-Z])/g, '∞')
    .replace(/\\pi(?![a-zA-Z])/g, 'π')
    .replace(/\\theta(?![a-zA-Z])/g, 'θ')
    .replace(/\\(?:text|mathrm|mathbf|mathit|operatorname)\s*\{([^{}]*)\}/g, '$1')
    // Any other command: its name, without the backslash ("\sin" → "sin").
    .replace(/\\([a-zA-Z]+)/g, '$1')
    .replace(/\\/g, '')
    .replace(/\^\{([^{}]*)\}/g, '^$1')
    .replace(/_\{([^{}]*)\}/g, '_$1')
    .replace(/[{}]/g, '')
    .replace(/\$+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  // A minus between spaces reads as a minus sign.
  return t.replace(/ - /g, ' − ');
}

/** The comparison form: case, spacing, typesetting and multiplication signs
 *  removed, so the same expression compares equal however it was written. */
export function compactMath(text: string): string {
  let t = readableMathText(text).toLowerCase();
  t = t.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹ⁿ]/g, (c) => SUPERSCRIPT[c] ?? c)
    .replace(/[−–—]/g, '-')
    .replace(/≤/g, '<=').replace(/≥/g, '>=')
    .replace(/÷/g, '/')
    .replace(/[×·*]/g, '');
  return t.replace(/[^a-z0-9=<>+\-/.≠→π∞√]/g, '');
}

const RELATION_RE = /[=<>≤≥≠]/;
const OPERATOR_RE = /[=<>≤≥≠+\-−/^×·*÷]/;
/** A token that can be part of an expression. */
const MATH_TOKEN_RE = /^[a-z0-9().+\-−/^=<>≤≥≠×·*÷,_√π∞→⁰¹²³⁴⁵⁶⁷⁸⁹ⁿ]+$/i;
const PROSE_SINGLE_LETTERS = new Set(['a', 'i', 'A', 'I']);
/** "(a)", "b)", "(ii)" — a part marker, not maths. */
const PART_MARKER_RE = /^\(?(?:[a-h]|i{1,3}|iv|vi{0,3})\)$/i;

/** The expressions in a text — maximal runs of maths tokens that carry an
 *  operator or a relation — each in its readable form. */
export function mathRuns(text: string): string[] {
  const tokens = readableMathText(text).split(/\s+/).map((w) => w.replace(/[.,;:?!]+$/, ''));
  const runs: string[] = [];
  let cur: string[] = [];
  const flush = () => {
    const run = cur.join(' ').trim();
    if (run && OPERATOR_RE.test(run) && compactMath(run).length >= 3) runs.push(run);
    cur = [];
  };
  for (const w of tokens) {
    const mathy = w.length > 0 && MATH_TOKEN_RE.test(w) && !PROSE_SINGLE_LETTERS.has(w) && !PART_MARKER_RE.test(w)
      && (/[\d()=<>≤≥≠+\-−/^×·*÷√π∞]/.test(w) || /^[a-z]$/i.test(w));
    if (mathy) cur.push(w);
    else flush();
  }
  flush();
  return runs;
}

/** The relations (equations, inequalities) of `card` that do not occur,
 *  in any typesetting, in `source`. */
export function ungroundedRelations(card: string, source: string): string[] {
  const src = compactMath(source);
  if (!src) return [];
  return mathRuns(card).filter((r) => RELATION_RE.test(r) && !src.includes(compactMath(r)));
}

const comparableStatement = (t: string): string => t.toLowerCase().replace(/\\[a-z]+/g, '').replace(/[^a-z0-9<>=+\-]/g, '');
const CONTENT_WORD_RE = /[a-z]{4,}/g;

/**
 * Is this problem card the problem `problemText` — however the card typesets
 * it? (2b58aacf only compared the first 24 characters: the card
 * "Simplify $f(x) = \dfrac{x^2 - 9}{x - 3}$" for a problem typed with its
 * parts after the function was not "Problem 1".) True when the old prefix
 * test passes, when one of the card's expressions is in the problem, or —
 * for a card with no expressions — when most of its words are.
 */
export function cardMatchesProblem(card: string, problemText: string): boolean {
  const own = comparableStatement(problemText ?? '');
  const c = comparableStatement(card ?? '');
  if (!own || !c) return false;
  if (own.includes(c.slice(0, 24)) || c.includes(own.slice(0, 24))) return true;
  const src = compactMath(problemText);
  const runs = mathRuns(card);
  if (runs.length > 0) return runs.some((r) => { const k = compactMath(r); return k.length >= 3 && src.includes(k); });
  const words = Array.from(new Set((card.toLowerCase().match(CONTENT_WORD_RE) ?? [])));
  if (words.length < 3) return false;
  const hw = problemText.toLowerCase();
  return words.filter((w) => hw.includes(w)).length / words.length >= 0.6;
}

/** Whitespace normalisation only — what "verbatim" allows. */
export function verbatimText(text: string): string {
  return String(text ?? '').replace(/\s+/g, ' ').trim();
}

