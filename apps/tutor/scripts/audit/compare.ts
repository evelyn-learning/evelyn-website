/**
 * Pure comparison / normalisation logic for the answer-key audit
 * (scripts/audit/audit-answer-keys.ts). No I/O, no env, no network, no DB.
 *
 * It deliberately reuses the engine's own primitives so the audit judges a key
 * the way the product grades a student:
 *   - `extractAnswerNumber` / `normMcqText` (voice/answer-primitives.ts) and the
 *     max(0.01, 1 %) tolerance of `answersAgree` (voice/problem-generator.ts —
 *     NOT imported: that module pulls in mongoose + connectDB, and nothing in
 *     the audit may be able to open a database connection).
 *   - `compareRelationTexts` (voice/relation-sampling.ts) for inequalities.
 *   - the MCQ key rule of `correctChoiceIdOf` (academy practice/shared.tsx):
 *     `correct` flag first, then a bare letter, then the option's text.
 *
 * Deterministic answers here are CONSERVATIVE: anything that is not plainly a
 * single number / relation / identical string returns 'unknown', and the caller
 * hands it to the model judge. A wrong deterministic "same" would hide a bad
 * key, so when in doubt this module does not decide.
 */
import { extractAnswerNumber, normMcqText } from '../../src/lib/tutor/voice/answer-primitives';
import { compareRelationTexts } from '../../src/lib/tutor/voice/relation-sampling';

export type Format = 'mcq' | 'numeric' | 'free' | 'frq' | string;

export interface Choice {
  letter: string; // positional: A, B, C …
  id?: string; // the stored id when choices are objects
  text: string;
  correct?: boolean;
}

export interface Item {
  id: string;
  course: string;
  source: string;
  format: Format;
  question: string;
  /** Stored expected answer; null = no single expected answer (rubric-graded). */
  key: string | null;
  choices: Choice[];
  /** Rubric text when the worklist carries one (the current file does not). */
  rubric: string | null;
}

/** What a solver is allowed to see. There is no `key` and no `correct` flag on
 *  this type — solver prompts are built ONLY from a SolverView. */
export interface SolverView {
  format: Format;
  question: string;
  options: Array<{ letter: string; text: string }>;
}

export type Agreement = 'same' | 'different' | 'unknown';
export interface CompareResult {
  result: Agreement;
  method: 'mcq' | 'relation' | 'numeric' | 'text-exact' | 'none';
  reason: string;
}

const LETTERS = 'ABCDEFGHIJ';

// ── worklist normalisation ──────────────────────────────────────────────────

function toChoices(raw: unknown): Choice[] {
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

const strOrNull = (v: unknown): string | null => {
  if (v == null) return null;
  const s = String(v);
  return s.trim() === '' ? null : s;
};

/**
 * Accepts both worklist row shapes:
 *   tuple  [course, source, format, question, key|null, choices|null]  (servable.json)
 *   object { course, source, format, question, key|expectedAnswer, choices, rubric? }
 */
export function normalizeItem(id: string, raw: unknown): Item {
  if (Array.isArray(raw)) {
    const [course, source, format, question, key, choices, rubric] = raw as unknown[];
    return {
      id,
      course: String(course ?? ''),
      source: String(source ?? ''),
      format: String(format ?? ''),
      question: String(question ?? ''),
      key: strOrNull(key),
      choices: toChoices(choices),
      rubric: strOrNull(rubric),
    };
  }
  const o = (raw ?? {}) as Record<string, unknown>;
  const rubric = o.rubric == null ? null : typeof o.rubric === 'string' ? o.rubric : JSON.stringify(o.rubric);
  return {
    id: String(o.id ?? id),
    course: String(o.course ?? ''),
    source: String(o.source ?? ''),
    format: String(o.format ?? ''),
    question: String(o.question ?? o.prompt ?? ''),
    key: strOrNull(o.key ?? o.expectedAnswer),
    choices: toChoices(o.choices),
    rubric: strOrNull(rubric),
  };
}

/** Worklist file → items. Top level may be { id: row } or [row, …]. */
export function parseWorklist(json: unknown): Item[] {
  if (Array.isArray(json)) {
    return json.map((row, i) => normalizeItem(String((row as { id?: unknown })?.id ?? i), row));
  }
  if (json && typeof json === 'object') {
    return Object.entries(json as Record<string, unknown>).map(([id, row]) => normalizeItem(id, row));
  }
  throw new Error('worklist must be a JSON object keyed by id, or an array of rows');
}

export function solverViewOf(item: Item): SolverView {
  return {
    format: item.format,
    question: item.question,
    options: item.choices.map((c) => ({ letter: c.letter, text: c.text })),
  };
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
export function keyedLetterOf(item: Pick<Item, 'key' | 'choices'>): KeyedLetter {
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
  return { value, unit: unitRaw.toLowerCase().replace(/[\s.·*⋅]/g, ''), percent: m[3] === '%' };
}

/** The engine's `answersAgree` tolerance: max(0.01, 1 % of the solved value). */
export function numbersAgree(key: number, solved: number): boolean {
  const tol = Math.max(0.01, Math.abs(solved) * 0.01);
  return Math.abs(key - solved) <= tol;
}

const RELATION_RE = /<=|>=|[<>≤≥]/;

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
  let agree = numbersAgree(a.value, b.value);
  // "50" vs "50%": one side written as a percent, the other as the bare figure.
  if (!agree && a.percent !== b.percent) {
    const av = a.percent ? a.value * 100 : a.value;
    const bv = b.percent ? b.value * 100 : b.value;
    agree = numbersAgree(av, bv);
  }
  if (agree) {
    return unitsCompatible
      ? { result: 'same', method: 'numeric', reason: `${a.value} ≈ ${b.value} (tolerance max(0.01, 1%))` }
      : { result: 'unknown', method: 'numeric', reason: `numbers agree but units differ ("${a.unit}" vs "${b.unit}")` };
  }
  // Different numbers are only a deterministic "different" when the units
  // cannot explain it (2 m vs 200 cm must go to the judge).
  if (a.unit === b.unit && a.percent === b.percent) {
    return { result: 'different', method: 'numeric', reason: `${a.value} vs ${b.value}` };
  }
  return { result: 'unknown', method: 'numeric', reason: `numbers differ (${a.value} vs ${b.value}) and units/percent differ` };
}

// ── verdict logic (pure, so it is testable without a model) ─────────────────

export type JudgeVerdict = 'SAME' | 'DIFFERENT' | 'KEY_INCOMPLETE' | 'CANNOT_JUDGE';
export type Verdict = 'KEY_OK' | 'KEY_WRONG' | 'ILL_POSED' | 'KEY_INCOMPLETE' | 'NEEDS_HUMAN' | 'ERROR';

/** Stage-2 outcome → either a final verdict or "go to the tie-break". */
export function afterStage2(blindIllPosed: boolean, cmp: JudgeVerdict): Verdict | 'TIEBREAK' {
  if (blindIllPosed) return 'TIEBREAK';
  if (cmp === 'SAME') return 'KEY_OK';
  if (cmp === 'KEY_INCOMPLETE') return 'KEY_INCOMPLETE';
  return 'TIEBREAK';
}

export interface TiebreakInput {
  blindIllPosed: boolean;
  tiebreakIllPosed: boolean;
  /** tie-break answer vs stored key (undefined when the tie-break was ill-posed) */
  vsKey?: JudgeVerdict;
  /** tie-break answer vs blind answer (undefined when not needed / not possible) */
  vsBlind?: JudgeVerdict;
  /** A solver had to assume a value/convention the question does not state. */
  solverAssumed?: boolean;
}

export function afterTiebreak(t: TiebreakInput): { verdict: Verdict; outcome: string } {
  if (t.tiebreakIllPosed) {
    return t.blindIllPosed
      ? { verdict: 'ILL_POSED', outcome: 'BOTH_SOLVERS_ILL_POSED' }
      : { verdict: 'NEEDS_HUMAN', outcome: 'TIEBREAK_ILL_POSED' };
  }
  if (t.vsKey === 'SAME') return { verdict: 'KEY_OK', outcome: 'KEY_OK_SOLVER_ERRED' };
  if (t.vsKey === 'KEY_INCOMPLETE') return { verdict: 'KEY_INCOMPLETE', outcome: 'TIEBREAK_KEY_INCOMPLETE' };
  if (t.blindIllPosed) return { verdict: 'NEEDS_HUMAN', outcome: 'BLIND_ILL_POSED_TIEBREAK_DISAGREES_WITH_KEY' };
  if (t.vsBlind === 'SAME' || t.vsBlind === 'KEY_INCOMPLETE') {
    // Two solvers agreeing proves little when both filled the same gap in the
    // question the same way (e.g. an unstated constant): the key may simply use
    // the other standard value. That is a human call, not a KEY_WRONG.
    return t.solverAssumed
      ? { verdict: 'NEEDS_HUMAN', outcome: 'SOLVERS_AGREE_AGAINST_KEY_BUT_ASSUMED_UNSTATED_VALUE' }
      : { verdict: 'KEY_WRONG', outcome: 'TWO_SOLVERS_AGREE_AGAINST_KEY' };
  }
  return { verdict: 'NEEDS_HUMAN', outcome: 'ALL_THREE_DIFFER' };
}

/** Minimum / expected model calls for one item (for --dry-run). */
export function plannedCalls(item: Item, stage1Only: boolean): { min: number; kind: 'mcq' | 'numeric' | 'text' | 'review' } {
  if (item.key === null && !item.choices.some((c) => c.correct)) return { min: 1, kind: 'review' };
  if (item.choices.length > 0) return { min: 1, kind: 'mcq' };
  if (item.format === 'numeric') return { min: 1, kind: 'numeric' };
  return { min: stage1Only ? 1 : 2, kind: 'text' };
}

export function csvCell(v: unknown): string {
  const s = String(v ?? '').replace(/\r?\n/g, ' ⏎ ');
  return /[",\n]/.test(s) || /^\s|\s$/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
