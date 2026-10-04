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
import { toChoices, type Choice, type Agreement, type CompareResult, type JudgeVerdict } from '../../src/lib/tutor/portal/key-compare';

export type { Choice, Agreement, CompareResult, JudgeVerdict };

export type Format = 'mcq' | 'numeric' | 'free' | 'frq' | string;

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

// ── worklist normalisation ──────────────────────────────────────────────────

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

// ── shared pure comparison (moved to src/ so the engine can use it too) ─────
export {
  keyedLetterOf,
  resolveOptionLetter,
  compareMcq,
  normText,
  parseSimpleNumber,
  numbersAgree,
  compareDeterministic,
} from '../../src/lib/tutor/portal/key-compare';
export type { KeyedLetter, SimpleNumber } from '../../src/lib/tutor/portal/key-compare';

// ── verdict logic (pure, so it is testable without a model) ─────────────────

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
