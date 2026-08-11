/**
 * Tri-state comparator: does a spoken student utterance agree with an
 * expected answer? Pure module, no side effects, never throws.
 *
 * The `unknown` verdict is the round's core safety property — it must fire
 * NOTHING downstream. `disagree` requires a FULL parse of both sides;
 * anything with unparsed residue on either side falls back to `unknown`
 * rather than risk a false disagreement. Consumed by later detector tasks
 * in this round; do not weaken the unknown-on-ambiguity discipline.
 */
import { resolveMcqLetter, extractAnswerNumber } from '@/lib/tutor/voice/problem-generator';

export type AnswerMatchVerdict = 'agree' | 'disagree' | 'unknown';
export interface AnswerMatchResult { verdict: AnswerMatchVerdict; reason: string }

/** Canonicalize a symbolic math expression to a comparable string.
 *  Returns null when the input has residue we can't account for —
 *  callers treat null as "unknown", which fires nothing. */
export function canonicalizeMathExpression(s: string): string | null {
  let t = (s ?? '').trim()
    .replace(/\\\(|\\\)|\$/g, '')          // math delimiters
    .replace(/\*/g, '')                     // markdown emphasis leaks
    .replace(/−/g, '-')                     // unicode minus
    .replace(/\\[dt]?frac\{([^{}]+)\}\{([^{}]+)\}/g, '($1)/($2)')
    .replace(/\\sqrt\{([^{}]+)\}/g, 'sqrt($1)')
    .replace(/\\cdot|\\times|×|·/g, '*')
    .replace(/÷/g, '/')
    .replace(/\\left|\\right/g, '')
    .replace(/\\pi(?![a-zA-Z])|π/g, 'pi')
    .replace(/\\theta(?![a-zA-Z])|θ/g, 'theta')
    .replace(/[{}]/g, m => (m === '{' ? '(' : ')'))
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[.?!,;]+$/, '');
  if (!t) return null;
  if (/\\/.test(t)) return null;            // residual latex command → unparseable
  if (!/^[a-z0-9+\-*/^()=.,']+$/.test(t)) return null; // residue → unparseable
  if (hasProseResidue(t)) return null;      // dictionary-word runs → unparseable
  if (!/[a-z0-9]/.test(t)) return null;     // operators only, no operand → unparseable
  // explicit multiplication → juxtaposition so "3*2x"≡"3(2x)" comparisons
  // don't depend on the writer's style; keep '/' and '^' structural.
  t = t.replace(/\*/g, '');
  return t;
}

/** Known non-single-letter math tokens allowed to survive canonicalization
 *  (constants, function names, differentials). Any other multi-char run of
 *  letters is treated as prose residue — a spoken hedge/explanation, not an
 *  expression — and rejects the whole input as unparseable. */
const MATH_ATOMS = new Set([
  'pi', 'theta', 'sqrt', 'sin', 'cos', 'tan', 'log', 'ln', 'exp', 'lim',
  'cot', 'sec', 'csc', 'min', 'max', 'mod', 'abs', 'dx', 'dy', 'dt', 'du', 'dv',
]);

function hasProseResidue(t: string): boolean {
  const runs = t.match(/[a-z]+/g) ?? [];
  return runs.some(r => r.length > 1 && !MATH_ATOMS.has(r));
}

/** Tokens extractAnswerNumber itself normalizes into a numeric value before
 *  grepping for a digit run. Any OTHER letter run in a canonical form — a
 *  bare variable ('x','a'), or a function/differential name
 *  extractAnswerNumber doesn't evaluate ('theta', 'sin', 'dx') — means the
 *  number extractAnswerNumber grabbed is just the first digit it happened to
 *  find, not a real evaluation of the expression. Gates the numeric-eval
 *  fallback below: both sides must be free of that residue, or the fallback
 *  isn't allowed to fire (round-2 review finding — extractAnswerNumber('5a')
 *  / extractAnswerNumber('5b') both "evaluate" to 5 by accident, which must
 *  never read as agreement).
 *
 *  'sqrt' is deliberately NOT included, even though extractAnswerNumber does
 *  evaluate SOME sqrt forms: it only handles LaTeX `\sqrt{X}` and unicode
 *  `√X`, both of which canonicalizeMathExpression already folds down to a
 *  plain digit before this check ever runs. Bare-text 'sqrt(4)' canonicalizes
 *  to the literal string 'sqrt(4)' — extractAnswerNumber never recognizes
 *  that shape, so it just digit-greps the operand and returns 4, not 2. If
 *  'sqrt' were whitelisted here, 'sqrt(4)' vs '4' would read as agreement
 *  between 4 and 4 while the real values (2 vs 4) disagree — the exact
 *  false-agree class this whole gate exists to prevent (round-2 re-review
 *  finding). Excluding it only costs a conservative `unknown` miss on
 *  legitimately-equal bare-text sqrt pairs; that's the correct tradeoff. */
const NUMERIC_EVAL_ATOMS = new Set(['pi']);
function isNumericEvaluable(canon: string): boolean {
  const runs = canon.match(/[a-z]+/g) ?? [];
  return runs.every(r => NUMERIC_EVAL_ATOMS.has(r));
}

/** Strip parens wrapping a single atomic token (no operators inside) —
 *  needed only for equivalence comparison, e.g. "\frac{x+1}{2}" canonicalizes
 *  to "(x+1)/(2)" while a manually-typed "(x+1)/2" doesn't get the redundant
 *  parens around the bare denominator; they're the same expression. Does NOT
 *  touch the string canonicalizeMathExpression returns to callers. */
function stripAtomicParens(s: string): string {
  let prev: string;
  let cur = s;
  do {
    prev = cur;
    cur = cur.replace(/\(([a-z0-9.]+)\)/g, '$1');
  } while (cur !== prev);
  return cur;
}

/** Commutative top-level term comparison: split on top-level +/- (sign
 *  travels with its term, depth tracked over parens), sort, join. */
function termMultiset(canon: string): string[] {
  const terms: string[] = [];
  let depth = 0;
  let cur = '';
  for (let i = 0; i < canon.length; i++) {
    const ch = canon[i];
    if (ch === '(') depth++;
    else if (ch === ')') depth--;
    if (depth === 0 && ch === '-') {
      if (cur !== '') terms.push(cur);
      cur = '-'; // sign travels with the next term
    } else if (depth === 0 && ch === '+') {
      if (cur !== '') terms.push(cur);
      cur = ''; // '+' just splits — no sign carried
    } else {
      cur += ch;
    }
  }
  if (cur !== '') terms.push(cur);
  return terms;
}

function expressionsMatch(a: string, b: string): boolean {
  if (a === b) return true;
  const na = stripAtomicParens(a), nb = stripAtomicParens(b);
  if (na === nb) return true;
  const ta = termMultiset(na).sort().join('&');
  const tb = termMultiset(nb).sort().join('&');
  return ta === tb;
}

/** True when the utterance contains 2+ separate numeric values in a
 *  multi-assignment shape ("m is 4 and b is -2", or the symbolic "x=4, y=-2")
 *  — same class the R36 cover-layer extractAnswerToken refuses. The '='
 *  alternative (round-2 review finding) catches assignment written with an
 *  equals sign instead of the word "is" — without it, "x=4, y=-2" slipped
 *  past this guard and fell through to a false numeric-eval agreement. */
function isMultiValueUtterance(t: string): boolean {
  const nums = t.match(/-?\d+(?:\.\d+)?/g) ?? [];
  return nums.length >= 2 && /\b(and|,)\b|,/.test(t) && /\b(is|are|equals?)\b|=/.test(t);
}

/** Hedges/fillers a spoken answer opens with ("um, I think it's...",
 *  "is it 3x + 2?"). Stripped from the FRONT only — never mid-utterance,
 *  so e.g. "3x maybe with a constant" keeps its residue for the
 *  prose-rejection check downstream. Looped (bounded) to peel stacked
 *  hedges like "um, I think the answer is...". */
const HEDGE_PREFIX_RE = /^(?:um+|uh+|okay|ok|so|well|hmm+|oh|i think|i guess|i'd say|maybe|probably|it'?s|it is|that'?s|the answer is|my answer is|is it|would it be|could it be|i got|i get)\b[\s,]*/i;

/** Spoken math vocabulary → symbolic. Order matters: multi-word phrases
 *  ("e to the", "square root of", the fraction words) must be listed
 *  before any shorter phrase/single-word rule they overlap with, and ALL
 *  of them must run before the single-number-word pass below — otherwise
 *  "one half" becomes "1 half" before the fraction rule ever sees it. */
const SPOKEN_REPLACEMENTS: Array<[RegExp, string]> = [
  [/\bnegative\s+/gi, '-'], [/\bminus\s+/gi, '- '], [/\bplus\s+/gi, '+ '],
  [/\btimes\b/gi, '*'], [/\bmultiplied by\b/gi, '*'],
  [/\bdivided by\b/gi, '/'], [/\bover\b/gi, '/'],
  [/\bequals?\b/gi, '='],
  [/\bsquared\b/gi, '^2'], [/\bcubed\b/gi, '^3'],
  [/\be to the\b/gi, 'e^'], [/\bto the power of\b/gi, '^'], [/\bto the\b/gi, '^'],
  [/\bsquare root of\b/gi, 'sqrt'],
  [/\bone half\b/gi, '1/2'], [/\bone third\b/gi, '1/3'], [/\bone quarter\b/gi, '1/4'],
  [/\btwo thirds\b/gi, '2/3'], [/\bthree quarters\b/gi, '3/4'],
  [/\bpoint\b/gi, '.'], [/\bpi\b/gi, 'pi'],
];
const NUMBER_WORDS: Record<string, string> = {
  zero: '0', one: '1', two: '2', three: '3', four: '4', five: '5',
  six: '6', seven: '7', eight: '8', nine: '9', ten: '10', eleven: '11', twelve: '12',
};

/** Spoken-form math → symbolic, for the utterance side of the comparator
 *  only (the expected side is already symbolic — never run this on it).
 *  Never throws; unrecognized text just passes through untouched, which
 *  lets canonicalizeMathExpression's prose-residue check do its job
 *  downstream rather than this function trying to "clean" prose into
 *  something that looks parseable. */
export function normalizeSpokenMath(utterance: string): string {
  let t = (utterance ?? '').trim().replace(/[?.!]+$/, '');
  for (let i = 0; i < 4; i++) {           // strip stacked hedges: "um, I think it's..."
    const next = t.replace(HEDGE_PREFIX_RE, '');
    if (next === t) break;
    t = next;
  }
  for (const [re, sub] of SPOKEN_REPLACEMENTS) t = t.replace(re, sub);
  // single spoken number words → digits; deliberately AFTER the fraction-word
  // replacements above so "one half" resolves as a fraction, not "1 half".
  t = t.replace(/\b([a-z]+)\b/gi, (w: string) => NUMBER_WORDS[w.toLowerCase()] ?? w);
  // "3 x" → "3x" (spoken juxtaposition)
  t = t.replace(/(\d)\s+([a-z])\b/gi, '$1$2');
  // "e^ -2t" → "e^(-2t)": wrap a bare (parenless) exponent term in parens.
  // Guarded on a non-empty capture — when the exponent is ALREADY
  // parenthesized ("e^(-2t)", typed or from a prior step), the group can
  // only match empty here, and blindly wrapping would inject a stray "()"
  // right before the real parens (e.g. "-2e^(-2t)" → "-2e^()(-2t)"),
  // corrupting an already-correct expression.
  t = t.replace(/\^\s*(-?\s*\d*\.?\d*[a-z]*)/gi, (m: string, p: string) => {
    const clean = p.replace(/\s+/g, '');
    return clean ? `^(${clean})` : m;
  });
  // Collapse whitespace hugging a bare math operator ("3x + 2" → "3x+2").
  // Safe this late: every spoken operator word above has already become
  // its symbol, so remaining spaces next to +-*/^=. are just spoken pauses,
  // not text the multi-value guard's \b(and|is)\b checks depend on (those
  // key off word text like "and"/"is", never off operator-adjacent spacing).
  // '.' is included because the "point" rule above turns "three point five"
  // into "3 . 5" (it only replaces the word, not its surrounding spaces) —
  // without collapsing here, extractAnswerNumber digit-greps just "3" out
  // of the space-padded decimal and a correct spoken decimal answer reads
  // as a false `disagree` against the numeric expected side. Sentence-final
  // periods are already gone by this point (stripped as trailing punctuation
  // in the very first line), and a mid-string mid-word mid-digit period like
  // typed "3.5" has no surrounding whitespace to collapse, so this is a
  // no-op for it either way.
  t = t.replace(/\s*([+\-*/^=.])\s*/g, '$1');
  return t.trim();
}

export function matchUtteranceToAnswer(
  utterance: string,
  expected: string,
  choices?: Array<{ letter: string; text: string }>
): AnswerMatchResult {
  const u = normalizeSpokenMath(utterance), e = (expected ?? '').trim();
  if (!u || !e) return { verdict: 'unknown', reason: 'empty side' };
  // 1) MCQ path — only when choices are supplied
  if (choices && choices.length > 0) {
    const lu = resolveMcqLetter(u, choices), le = resolveMcqLetter(e, choices);
    if (lu && le) return lu === le
      ? { verdict: 'agree', reason: `mcq ${lu}` }
      : { verdict: 'disagree', reason: `mcq ${lu}≠${le}` };
    if (le && !lu) return { verdict: 'unknown', reason: 'mcq: utterance unresolvable' };
    // expected not letter-resolvable → fall through to numeric/expression
  }
  // 2) numeric path — answersAgree tolerance, multi-value guarded
  if (isMultiValueUtterance(u)) return { verdict: 'unknown', reason: 'multi-value utterance' };
  const nu = extractAnswerNumber(u), ne = extractAnswerNumber(e);
  const cu = canonicalizeMathExpression(u), ce = canonicalizeMathExpression(e);
  const uIsPureNumber = cu !== null && /^-?[0-9.,/()]+$/.test(cu);
  const eIsPureNumber = ce !== null && /^-?[0-9.,/()]+$/.test(ce);
  if (nu !== null && ne !== null && uIsPureNumber && eIsPureNumber) {
    const tol = Math.max(0.01, Math.abs(ne) * 0.01);
    return Math.abs(nu - ne) <= tol
      ? { verdict: 'agree', reason: `numeric ${nu}≈${ne}` }
      : { verdict: 'disagree', reason: `numeric ${nu}≠${ne}` };
  }
  // 3) expression path — full-parse required on BOTH sides for any verdict
  if (cu === null || ce === null) return { verdict: 'unknown', reason: 'unparseable side' };
  if (expressionsMatch(cu, ce)) return { verdict: 'agree', reason: 'expression match' };
  // π/4 vs 0.785-style: numeric fallback when both sides EVALUATE. Gated to
  // sides with no un-evaluated letter residue — extractAnswerNumber just
  // greps the first digit run, so "5a" vs "5b" must NOT reach here (round-2
  // review finding).
  if (
    nu !== null && ne !== null && nu !== 0 &&
    isNumericEvaluable(cu) && isNumericEvaluable(ce) &&
    Math.abs(nu - ne) <= Math.max(0.01, Math.abs(ne) * 0.01)
  ) {
    return { verdict: 'agree', reason: 'numeric-eval match' };
  }
  // Term-multisets disagree, but if either side still has ANY parens we
  // can't rule out a regrouped-but-equal expression — e.g. "3+(2-(1+4))" vs
  // "2-(1+4)+3" are both 0, but this comparator only does top-level term
  // comparison, not recursive re-association. Deliberately checked against
  // the RAW canonical forms (cu/ce), not the atomic-paren-stripped ones:
  // stripAtomicParens would erase "sqrt(4)" down to "sqrt4" (its argument
  // parens look "atomic" to that stripper), which would hide exactly the
  // un-evaluated-function-call case this check needs to catch — "sqrt(4)"
  // vs "4" must land here as unknown, not fall through to a false disagree
  // (round-2 re-review finding). A false `disagree` is worse than a missed
  // `agree`, so fall back to `unknown`.
  if (cu.includes('(') || ce.includes('(')) {
    return { verdict: 'unknown', reason: 'unresolved grouping' };
  }
  return { verdict: 'disagree', reason: `expr ${cu}≠${ce}` };
}
