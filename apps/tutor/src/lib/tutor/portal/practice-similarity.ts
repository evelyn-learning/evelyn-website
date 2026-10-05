/**
 * Duplicate detection for generated practice items. Pure — no I/O.
 *
 * Why (pre-generation audit, 2026-10-05): 9 of 21 failed items were
 * duplicates the exact-text hash cannot see — the twins differed by a word
 * ("carries" / "has"), or by a clause added to the skill's one stored
 * question. Two parallel slots of one request produced 5 of them.
 *
 * The first rule written for this compared WORDING and the numbers only, and
 * (review, same day) rejected distinct items wholesale: on the real bank it
 * called 167 pairs of different authored questions twins — the derivative of
 * x² sin(x) and of sin(x²), "Factor x² − 9" and "Factor x² − 9x", every
 * "Which sentence is punctuated correctly?" question against every other.
 * Shared wording is what questions on one skill HAVE; it is not evidence.
 *
 * The rule now acts only on the unmistakable case. Two items are the same
 * when the WHOLE item matches:
 *
 *   'duplicate' — the same content words in the stem, AND the same ordered
 *       sequence of mathematical tokens (numbers, variables, operators,
 *       function names, formulas), AND — for multiple choice — the same set
 *       of options, AND the same answer (when both are known).
 *
 *   'reworded' — a twin in other words. Needs ALL of:
 *       · both answers known and the same (for multiple choice the correct
 *         option's text; an answer in words may also contain the other:
 *         "glycolysis" / "glycolysis; occurs in the cytoplasm");
 *       · the same mathematical content — one question's tokens are all in
 *         the other's (a twin may restate the expression or add an
 *         incidental number: "into 8 strips", "in the form (x + a)²"; a
 *         different item changes the data, so neither contains the other);
 *       · the stems largely coincide (`REWORDED_JACCARD`), or one is
 *         restated inside the other (`REWORDED_CONTAINMENT`);
 *       · an answer that can carry the identification: a phrase or an
 *         expression. A bare number, letter or yes / no agrees between
 *         unrelated questions all the time ("How many valence electrons does
 *         oxygen / sulfur have?" — 6 and 6), so with such an answer only the
 *         whole-item 'duplicate' rule applies.
 *
 * Same wording with a different expression, a different answer or different
 * options is NOT a duplicate. What the rule misses is pinned in
 * scripts/test-practice-review6.ts; missing a twin costs a repeated
 * question, a false positive costs the skill its practice.
 */

const STOPWORDS = new Set(
  ('a an the and or but if then so of in on at to from by for with without into onto over under as is are was were be been being ' +
    'it its this that these those which what who whom whose when where why how do does did has have had can could will would ' +
    'shall should may might must not no yes each every all any some one two there here their his her your our you we they he she ' +
    'find calculate compute determine give state identify write name evaluate solve answer value following given using use used ' +
    'problem question express show').split(' '),
);

/** Lower-cased text with maths delimiters / LaTeX commands flattened and
 *  superscript / subscript digits folded to plain ones. */
export function normalizeItemText(text: string): string {
  const sup = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  const sub = '₀₁₂₃₄₅₆₇₈₉';
  return (text ?? '')
    .toLowerCase()
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, (c) => `^${sup.indexOf(c)}`)
    .replace(/[₀₁₂₃₄₅₆₇₈₉]/g, (c) => String(sub.indexOf(c)))
    .replace(/[−–—]/g, '-')
    .replace(/\\[()[\]]|\$+/g, ' ')
    .replace(/\\([a-z]+)/g, ' $1 ')
    .replace(/[{}]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function contentWords(text: string): Set<string> {
  const words = normalizeItemText(text).match(/[a-z][a-z0-9]*|\d+(?:\.\d+)?/g) ?? [];
  return new Set(words.filter((w) => w.length > 1 && !STOPWORDS.has(w)).map((w) => (w.length > 4 ? w.replace(/(?:es|s|ing|ed)$/, '') : w)));
}

const MATH_WORDS =
  'sin|cos|tan|sec|csc|cot|arcsin|arccos|arctan|sinh|cosh|tanh|ln|log|lim|exp|sqrt|frac|dfrac|tfrac|sum|prod|int|pi|theta|alpha|beta|gamma|delta|lambda|sigma|omega|phi|infty|cdot|div|pm|leq|geq|neq|binom';
/** In order: a number; a formula-like word with a digit in it (h2so4, x1);
 *  a maths word; a single-letter variable — any lone letter but "a" and "i",
 *  and those two as well when they sit in an expression ("a²", "9a", "(a + b)",
 *  "a = 3") rather than in a sentence; an operator or bracket. A letter is
 *  "lone" when no other letter touches it, so the x of "9x" counts. A hyphen
 *  inside a word is not an operator, and neither is an em dash between clauses. */
const MATH_TOKEN_RE = new RegExp(
  [
    String.raw`\d+(?:\.\d+)?`,
    String.raw`[a-z]+\d[a-z0-9]*`,
    String.raw`(?<![a-z])(?:${MATH_WORDS})(?![a-z])`,
    String.raw`(?<![a-z'’])[b-hj-z](?![a-z'’])`,
    String.raw`(?<![a-z'’])[ai](?![a-z'’])(?:(?<=[\d^_(+*/=<>-][ai])|(?=[\d^_)]|\s*[+*/^=<>]))`,
    String.raw`(?<![a-z])-|-(?![a-z])`,
    String.raw`[+*/^=<>≤≥≠±×÷·√∑∫∞→()\[\]|!%°]`,
  ].join('|'),
  'g',
);

/** The ordered mathematical tokens of a text — its numbers, variables,
 *  operators, function names and formulas — with numbers in canonical form. */
export function mathTokens(text: string): string[] {
  const flat = normalizeItemText((text ?? '').replace(/—/g, ' , '));
  return (flat.match(MATH_TOKEN_RE) ?? []).map((t) => (/^\d/.test(t) ? String(Number(t)) : t));
}

function jaccard<T>(a: Set<T>, b: Set<T>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let both = 0;
  for (const x of a) if (b.has(x)) both++;
  return both / (a.size + b.size - both);
}

/** Share of the SMALLER set found in the other: a short question restated
 *  inside a longer one scores high here and low on Jaccard. */
function containment<T>(a: Set<T>, b: Set<T>): number {
  const [small, large] = a.size <= b.size ? [a, b] : [b, a];
  if (small.size === 0) return 0;
  let both = 0;
  for (const x of small) if (large.has(x)) both++;
  return both / small.size;
}

/** What is compared: the question, the answer in WORDS when known (for
 *  multiple choice the correct option's text, never its letter) and, for
 *  multiple choice, the texts of all the options. */
export interface ComparableItem {
  problemText: string;
  answerText?: string;
  choices?: readonly string[];
}

function normalizeAnswer(answer: string | undefined): string {
  return normalizeItemText(answer ?? '').replace(/^[a-e]\s*[).:]\s*/, '').replace(/[^a-z0-9./^+*=<>-]+/g, ' ').trim();
}

export const REWORDED_JACCARD = 0.6;
export const REWORDED_CONTAINMENT = 0.65;
/** Longest answer (in words of four letters or more) that may contain the other. */
export const ANSWER_INSIDE_MAX_WORDS = 8;
/** Fewest content words the shorter stem needs before containment counts. */
export const REWORDED_MIN_WORDS = 4;

export type NearDuplicateReason = 'duplicate' | 'reworded';

/** True when every token of the smaller list is in the larger (as a multiset). */
function tokensContained(a: string[], b: string[]): boolean {
  const [small, large] = a.length <= b.length ? [a, b] : [b, a];
  const pool = [...large];
  for (const t of small) {
    const at = pool.indexOf(t);
    if (at < 0) return false;
    pool.splice(at, 1);
  }
  return true;
}

function sameSequence(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((t, i) => t === b[i]);
}

function sameSet<T>(a: Set<T>, b: Set<T>): boolean {
  if (a.size !== b.size) return false;
  for (const x of a) if (!b.has(x)) return false;
  return true;
}

/** How many labelled parts a question asks for: "(a) … (b) … (c) …". */
function labelledParts(text: string): number {
  return new Set((text ?? '').toLowerCase().match(/\((?:[a-e]|i{1,3}|iv|v)\)/g) ?? []).size;
}

function optionSet(choices: readonly string[] | undefined): string[] {
  return (choices ?? []).map((c) => normalizeAnswer(c)).sort();
}

/** An answer that identifies its question: a phrase (a word of four letters
 *  or more that is not just true / false / none) or an expression (letters
 *  with an operator or bracket). */
function identifyingAnswer(ans: string): boolean {
  const words = (ans.match(/[a-z]{4,}/g) ?? []).filter((w) => !['true', 'false', 'none', 'both', 'neither', 'undefined', 'increase', 'decrease'].includes(w));
  if (words.length > 0) return true;
  return /[a-z]/.test(ans) && /[+*/^=()-]/.test(ans) && ans.length >= 5;
}

/** Why two items are the same item, or null when they are not. */
export function nearDuplicateReason(a: ComparableItem, b: ComparableItem): NearDuplicateReason | null {
  const ma = mathTokens(a.problemText);
  const mb = mathTokens(b.problemText);
  const wa = contentWords(a.problemText);
  const wb = contentWords(b.problemText);
  const ansA = normalizeAnswer(a.answerText);
  const ansB = normalizeAnswer(b.answerText);
  const bothAnswers = !!ansA && !!ansB;
  const oa = optionSet(a.choices);
  const ob = optionSet(b.choices);
  const optionsKnown = oa.length > 0 && ob.length > 0;

  // The whole item matches.
  if (
    (wa.size > 0 || ma.length > 0) && sameSet(wa, wb) &&
    sameSequence(ma, mb) &&
    (oa.length === 0 && ob.length === 0 ? true : optionsKnown && sameSequence(oa, ob)) &&
    (!bothAnswers || ansA === ansB)
  ) return 'duplicate';

  // A twin in other words.
  if (!bothAnswers) return null;
  if (!identifyingAnswer(ansA) || !identifyingAnswer(ansB)) return null;
  if (ansA !== ansB && !answerInside(ansA, ansB)) return null;
  if (!tokensContained(ma, mb)) return null;
  // One asks for several labelled parts, the other for one thing: the short
  // one is a PART of the long one, not its twin.
  if ((labelledParts(a.problemText) >= 2) !== (labelledParts(b.problemText) >= 2)) return null;
  const j = jaccard(wa, wb);
  const c = Math.min(wa.size, wb.size) >= REWORDED_MIN_WORDS ? containment(wa, wb) : 0;
  return j >= REWORDED_JACCARD || c >= REWORDED_CONTAINMENT ? 'reworded' : null;
}

/** An answer in words wholly inside the other ("glycolysis" / "glycolysis;
 *  occurs in the cytoplasm"), with the same numbers and formulas in both —
 *  "1 round : 1 wrinkled" is not inside "9 round : 3 wrinkled". */
function answerInside(ansA: string, ansB: string): boolean {
  const data = (ans: string) => mathTokens(ans).filter((t) => /\d/.test(t)).sort();
  if (!sameSequence(data(ansA), data(ansB))) return false;
  const verbal = (ans: string) => new Set([...contentWords(ans)].filter((w) => /^[a-z]{4,}$/.test(w)));
  const va = verbal(ansA);
  const vb = verbal(ansB);
  if (Math.max(va.size, vb.size) > ANSWER_INSIDE_MAX_WORDS) return false; // a paragraph contains everything
  return va.size > 0 && vb.size > 0 && containment(va, vb) >= 0.99;
}

/** The first of `others` that `item` duplicates, with the reason. */
export function findNearDuplicate<T extends ComparableItem>(
  item: ComparableItem,
  others: readonly T[],
): { of: T; reason: NearDuplicateReason } | null {
  for (const other of others) {
    const reason = nearDuplicateReason(item, other);
    if (reason) return { of: other, reason };
  }
  return null;
}
