/**
 * Pure answer-key comparison (no I/O, no env, no network, no DB).
 *
 * "Does this stored key say the same thing as an independent solve?" — the
 * comparison half of the blind-solve key check. Shared by the creation-time
 * verifier (./key-verify.ts) and the offline audit
 * (scripts/audit/compare.ts re-exports everything here; the logic was moved
 * from there on 2026-10-04 so `src/` never imports from `scripts/`).
 *
 * It reuses the engine's own primitives so a key is judged the way the
 * product grades a student:
 *   - `extractAnswerNumber` / `normMcqText` (voice/answer-primitives.ts) and the
 *     max(0.01, 1 %) tolerance of `answersAgree` — except that a key WRITTEN
 *     as a decimal must match a solve stated to at least as many places within
 *     half a unit of the key's last place (`decimalKeyHolds`): 1 % calls
 *     `10.80` and `10.81` the same, and a key off by one in its last stated
 *     place is a wrong key;
 *   - `compareRelationTexts` (voice/relation-sampling.ts) for inequalities —
 *     an exact solution-set comparison, so `-4 < x <= 2` and `-4 <= x < 2`
 *     differ even though their first numbers match;
 *   - the MCQ key rule of `correctChoiceIdOf` (academy practice/shared.tsx):
 *     `correct` flag first, then a bare letter, then the option's text.
 *
 * Deterministic answers here are CONSERVATIVE: anything that is not plainly a
 * single number / relation / identical string returns 'unknown', and the caller
 * hands it to the model judge. A wrong deterministic "same" would hide a bad
 * key, so when in doubt this module does not decide.
 *
 * Relative imports only (client-safe, and loadable by relative-import-only
 * modules).
 */
import { extractAnswerNumber, normMcqText } from '../voice/answer-primitives';
import { compareRelationTexts } from '../voice/relation-sampling';

export interface Choice {
  letter: string; // positional: A, B, C …
  id?: string; // the stored id when choices are objects
  text: string;
  correct?: boolean;
}

export type Agreement = 'same' | 'different' | 'unknown';
export interface CompareResult {
  result: Agreement;
  method: 'mcq' | 'relation' | 'numeric' | 'text-exact' | 'none';
  reason: string;
}

export type JudgeVerdict = 'SAME' | 'DIFFERENT' | 'KEY_INCOMPLETE' | 'CANNOT_JUDGE';

const LETTERS = 'ABCDEFGHIJ';

/** Raw choices (strings, or `{ id?, text|label, correct? }` objects) → positional
 *  `Choice`s (A, B, C …). */
export function toChoices(raw: unknown): Choice[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((c, i): Choice => {
    const letter = LETTERS[i] ?? String(i + 1);
    if (typeof c === 'string') return { letter, text: c };
    const o = (c ?? {}) as Record<string, unknown>;
    return {
      letter,
      id: o.id != null ? String(o.id) : undefined,
      text: String(o.text ?? o.label ?? ''),
      correct: o.correct === true ? true : undefined,
    };
  });
}

// ── multiple choice ─────────────────────────────────────────────────────────

export interface KeyedLetter {
  letter: string | null;
  via: 'flag' | 'letter' | 'text' | 'text-normalized' | 'none';
  /** Set when the `correct` flag and the stored key point at different options. */
  conflict?: string;
}

function letterFromKeyText(key: string, choices: Choice[]): { letter: string | null; via: KeyedLetter['via'] } {
  const ea = key.trim();
  if (!ea) return { letter: null, via: 'none' };
  // A bare letter (the bank stores the correct LETTER). Also accepts a stored
  // choice id ("a") and letters past E when there are that many options.
  if (/^[A-Za-z]$/.test(ea)) {
    const up = ea.toUpperCase();
    const byPos = choices.find((c) => c.letter === up);
    if (byPos) return { letter: byPos.letter, via: 'letter' };
    const byId = choices.find((c) => (c.id ?? '').toUpperCase() === up);
    if (byId) return { letter: byId.letter, via: 'letter' };
    return { letter: null, via: 'none' };
  }
  // Case-sensitive first: options can differ ONLY by case ("BB" vs "Bb"), where
  // the app's case-insensitive match would pick whichever comes first.
  const exact = choices.find((c) => c.text.trim() === ea);
  if (exact) return { letter: exact.letter, via: 'text' };
  const ci = choices.filter((c) => c.text.trim().toLowerCase() === ea.toLowerCase());
  if (ci.length === 1) return { letter: ci[0].letter, via: 'text' };
  if (ci.length > 1) return { letter: null, via: 'none' };
  const n = normMcqText(ea);
  const loose = n ? choices.filter((c) => normMcqText(c.text) === n) : [];
  if (loose.length === 1) return { letter: loose[0].letter, via: 'text-normalized' };
  return { letter: null, via: 'none' };
}

/** Which option the item is keyed to — `correctChoiceIdOf`'s rule, expressed as
 *  a positional letter. */
export function keyedLetterOf(item: { key: string | null; choices: Choice[] }): KeyedLetter {
  const flagged = item.choices.filter((c) => c.correct);
  const fromKey = item.key ? letterFromKeyText(item.key, item.choices) : { letter: null, via: 'none' as const };
  if (flagged.length > 1) {
    return { letter: null, via: 'none', conflict: `${flagged.length} options carry the correct flag (${flagged.map((c) => c.letter).join(', ')})` };
  }
  if (flagged.length === 1) {
    const f = flagged[0].letter;
    if (fromKey.letter && fromKey.letter !== f) {
      return { letter: f, via: 'flag', conflict: `correct flag is on ${f} but the stored key "${item.key}" resolves to ${fromKey.letter}` };
    }
    return { letter: f, via: 'flag' };
  }
  return fromKey;
}

/** Resolve a solver's reply to an option letter: a bare/decorated letter, else
 *  an exact (normalised) match on option text. */
export function resolveOptionLetter(answer: string, choices: Array<{ letter: string; text: string }>): string | null {
  const t = (answer ?? '').trim();
  if (!t) return null;
  const valid = new Set(choices.map((c) => c.letter));
  const m =
    t.match(/^\(?([A-Ja-j])\)?[.):]?$/) ??
    t.match(/^(?:option|choice|answer(?:\s+is)?)[:\s]+\(?([A-Ja-j])\)?[.):]?\s*$/i) ??
    t.match(/^\(?([A-Ja-j])[).:]\s+\S/);
  if (m && valid.has(m[1].toUpperCase())) return m[1].toUpperCase();
  const n = normMcqText(t);
  const hits = n ? choices.filter((c) => normMcqText(c.text) === n) : [];
  return hits.length === 1 ? hits[0].letter : null;
}

export function compareMcq(keyLetter: string | null, solverLetter: string | null): CompareResult {
  if (!keyLetter) return { result: 'unknown', method: 'mcq', reason: 'stored key does not resolve to an option' };
  if (!solverLetter) return { result: 'unknown', method: 'mcq', reason: 'solver did not choose an option' };
  return keyLetter === solverLetter
    ? { result: 'same', method: 'mcq', reason: `both ${keyLetter}` }
    : { result: 'different', method: 'mcq', reason: `key ${keyLetter}, solver ${solverLetter}` };
}

// ── numbers / relations / text ──────────────────────────────────────────────

/** Notation-only clean-up; keeps signs, operators and case-insensitive text. */
export function normText(s: string): string {
  return (s ?? '')
    .replace(/[−–—]/g, '-')
    .replace(/≤/g, '<=')
    .replace(/≥/g, '>=')
    .replace(/[·×]/g, '*')
    .replace(/\$/g, '')
    .replace(/\\\(|\\\)|\\left|\\right/g, '')
    .replace(/\s+/g, '')
    .replace(/[.;,]+$/, '')
    .toLowerCase();
}

export interface SimpleNumber {
  value: number;
  unit: string; // normalised, '' when none
  percent: boolean;
  /** Decimal places as written ("10.81" → 2, "5" → 0); 0 for a fraction. */
  places: number;
  /** Written as a fraction ("13/3") — an exact value. */
  fraction: boolean;
}

/**
 * Parse an answer that is ONE number and nothing else of substance:
 * "13/3", "x = 13/3", "−4", "$4.50", "38.4 N·s", "50%", "≈ 2.5 m/s", "1,200".
 * Returns null for anything richer ("2x + 8", "3 or 5", "3 × 10^8", "√2", "(2, 3)")
 * — those are not for a deterministic number comparison.
 */
export function parseSimpleNumber(raw: string): SimpleNumber | null {
  let t = (raw ?? '').trim().replace(/[−–—]/g, '-').replace(/\s+/g, ' ');
  if (!t) return null;
  t = t.replace(/[.;]$/, '').trim();
  t = t.replace(/^[A-Za-z]\w{0,2}\s*(?:=|≈)\s*/, ''); // "x = ", "v0 = "
  t = t.replace(/^(?:≈|~|about |approximately )\s*/i, '');
  t = t.replace(/^\$\s*/, '');
  const m = t.match(/^(-?(?:\d{1,3}(?:,\d{3})+|\d+)?(?:\.\d+)?)(?:\s*\/\s*(-?\d+(?:\.\d+)?))?\s*(%?)(?:\s+(.+))?$/);
  if (!m || !m[1] || !/\d/.test(m[1])) return null;
  const unitRaw = (m[4] ?? '').trim();
  if (unitRaw) {
    // A unit is words/symbols; digits may only appear as exponents ("m/s^2", "cm²").
    if (/(?<![\^a-zA-Z²³])\d/.test(unitRaw.replace(/\^-?\d+/g, ''))) return null;
    if (/\b(?:or|and|to)\b|[=<>±,;]/i.test(unitRaw)) return null;
    if (unitRaw.length > 40) return null;
  }
  const numText = m[2] != null ? `${m[1].replace(/,/g, '')}/${m[2]}` : m[1];
  const value = extractAnswerNumber(numText + (m[3] ? '%' : ''));
  if (value === null || !Number.isFinite(value)) return null;
  const fraction = m[2] != null;
  const dot = m[1].indexOf('.');
  const places = fraction || dot < 0 ? 0 : m[1].length - dot - 1;
  return { value, unit: unitRaw.toLowerCase().replace(/[\s.·*⋅]/g, ''), percent: m[3] === '%', places, fraction };
}

/** The engine's `answersAgree` tolerance: max(0.01, 1 % of the solved value). */
export function numbersAgree(key: number, solved: number): boolean {
  const tol = Math.max(0.01, Math.abs(solved) * 0.01);
  return Math.abs(key - solved) <= tol;
}

/**
 * The decimal-key tightening. When the KEY is written as a decimal with d ≥ 1
 * places and the solve is exact (a fraction) or stated to at least d places,
 * the two agree only if the solve is within half a unit of the key's last
 * place — the same half-unit rule the student grader uses
 * (./numeric-answer-rule.ts). Returns true ("no objection") for every other
 * pairing — an integer or fraction key, a solve stated to FEWER places than
 * the key, a percent on one side only — which keep the `numbersAgree`
 * tolerance: there the solver's rounding, not the key, is the coarser one.
 */
export function decimalKeyHolds(key: SimpleNumber, solved: SimpleNumber): boolean {
  if (key.fraction || key.places < 1) return true;
  if (key.percent !== solved.percent) return true;
  if (!solved.fraction && solved.places < key.places) return true;
  const scale = key.percent ? 0.01 : 1; // percent values are stored ÷ 100
  return Math.abs(key.value - solved.value) <= (0.5 * 10 ** -key.places + 1e-12) * scale;
}

/** An inequality comparator, typed, Unicode or LaTeX (`\\le`, `\\geq`, …). `=` is
 *  deliberately not one: "x = 5" is a plain number answer. */
export const RELATION_RE = /<=|>=|[<>≤≥]|\\(?:leq?|geq?|lt|gt)(?![a-zA-Z])/;

/**
 * Deterministic comparison of a stored key against a solver's final answer for
 * non-multiple-choice items. 'unknown' means "ask the judge".
 */
export function compareDeterministic(key: string, solved: string): CompareResult {
  const k = (key ?? '').trim();
  const s = (solved ?? '').trim();
  if (!k || !s) return { result: 'unknown', method: 'none', reason: 'empty side' };

  if (normText(k) === normText(s)) return { result: 'same', method: 'text-exact', reason: 'identical after notation clean-up' };

  // Inequalities / relations → the engine's exact solution-set comparator.
  if (RELATION_RE.test(k) || RELATION_RE.test(s)) {
    const prep = (x: string) => x.replace(/[−–—]/g, '-').replace(/≤/g, '<=').replace(/≥/g, '>=');
    const cmp = compareRelationTexts(prep(k), prep(s));
    if (cmp.verdict === 'equivalent') return { result: 'same', method: 'relation', reason: 'same solution set' };
    if (cmp.verdict === 'differs') return { result: 'different', method: 'relation', reason: `solution sets differ (${cmp.kind})` };
    return { result: 'unknown', method: 'relation', reason: `relation comparator: ${cmp.reason}` };
  }

  const a = parseSimpleNumber(k);
  const b = parseSimpleNumber(s);
  if (!a || !b) return { result: 'unknown', method: 'none', reason: 'not both single numbers' };

  const unitsCompatible = a.unit === b.unit || !a.unit || !b.unit;
  let agree = numbersAgree(a.value, b.value) && decimalKeyHolds(a, b);
  // "50" vs "50%": one side written as a percent, the other as the bare figure.
  if (!agree && a.percent !== b.percent) {
    const av = a.percent ? a.value * 100 : a.value;
    const bv = b.percent ? b.value * 100 : b.value;
    agree = numbersAgree(av, bv);
  }
  if (agree) {
    return unitsCompatible
      ? { result: 'same', method: 'numeric', reason: `${a.value} ≈ ${b.value} (tolerance max(0.01, 1%); a decimal key to its last place)` }
      : { result: 'unknown', method: 'numeric', reason: `numbers agree but units differ ("${a.unit}" vs "${b.unit}")` };
  }
  // Different numbers are only a deterministic "different" when the units
  // cannot explain it (2 m vs 200 cm must go to the judge).
  if (a.unit === b.unit && a.percent === b.percent) {
    return { result: 'different', method: 'numeric', reason: `${a.value} vs ${b.value}` };
  }
  return { result: 'unknown', method: 'numeric', reason: `numbers differ (${a.value} vs ${b.value}) and units/percent differ` };
}

// ── key vs independent solve ────────────────────────────────────────────────

export interface KeyCompareInput {
  /** The stored key (a letter / option text for multiple choice). */
  claimedAnswer: string;
  /** Present and non-empty ⇒ multiple choice. */
  choices?: Choice[];
  /** The independent solver's final answer. */
  solverAnswer: string;
  /** The option the solver chose (multiple choice), when it named one. */
  solverOption?: string | null;
}

/**
 * Deterministic comparison of a stored key with an independent solve:
 * multiple choice by OPTION, everything else via `compareDeterministic`
 * (identical text → relation → single number). 'unknown' = not decidable here.
 */
export function compareKeyToSolve(input: KeyCompareInput): CompareResult {
  const choices = input.choices ?? [];
  if (choices.length > 0) {
    const keyed = keyedLetterOf({ key: input.claimedAnswer?.trim() ? input.claimedAnswer : null, choices });
    if (keyed.conflict) return { result: 'unknown', method: 'mcq', reason: keyed.conflict };
    const solved =
      resolveOptionLetter(input.solverOption ?? '', choices) ?? resolveOptionLetter(input.solverAnswer ?? '', choices);
    return compareMcq(keyed.letter, solved);
  }
  return compareDeterministic(input.claimedAnswer, input.solverAnswer);
}

/** Model judge for answers the deterministic comparison cannot decide.
 *  ANSWER 1 is always the stored key. Injected — this module stays pure. */
export type KeyJudge = (answer1: string, answer2: string) => Promise<{ verdict: JudgeVerdict; reason: string }>;

/**
 * `compareKeyToSolve`, then — only for a non-multiple-choice 'unknown' — the
 * injected judge. Multiple choice is never judged: an option that does not
 * resolve stays CANNOT_JUDGE. A judge that throws propagates to the caller.
 */
export async function compareKeyWithJudge(
  input: KeyCompareInput,
  judge?: KeyJudge,
): Promise<{ verdict: JudgeVerdict; method: CompareResult['method'] | 'judge'; reason: string }> {
  const det = compareKeyToSolve(input);
  if (det.result === 'same') return { verdict: 'SAME', method: det.method, reason: det.reason };
  if (det.result === 'different') return { verdict: 'DIFFERENT', method: det.method, reason: det.reason };
  if ((input.choices ?? []).length > 0 || !judge) return { verdict: 'CANNOT_JUDGE', method: det.method, reason: det.reason };
  const j = await judge(input.claimedAnswer, input.solverAnswer);
  return { verdict: j.verdict, method: 'judge', reason: j.reason };
}
