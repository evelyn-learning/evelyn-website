/**
 * Pure logic of the `ingest` / `finalize` stages of the offline practice job
 * (ingest.ts): practice items WRITTEN BY PEOPLE OR AGENTS into local JSON
 * files go through the job's own checks. No I/O, no env, no network, no
 * database — tested by ingest-core.test.ts.
 *
 * What is here:
 *   - reading a written item in either of its two file formats and
 *     normalising it to "the correct option's text";
 *   - the rule checks (the job's `contentDefects` + near-duplicates + three
 *     checks that only make sense for hand-written items);
 *   - the shuffle of the options, done in CODE and seeded by the item id;
 *   - turning a blind solver's reply into agree / disagree / ill-posed / undecided;
 *   - grouping items into reading batches;
 *   - the selection rule of `finalize`.
 */
import { resolveOptionLetter, toChoices } from '../../src/lib/tutor/portal/key-compare';
import { parseNumericKey } from '../../src/lib/tutor/portal/numeric-answer-rule';
import {
  LIMITS,
  comparableOf,
  compareWithRules,
  contentDefects,
  itemIdOf,
  nearDuplicateOf,
  referencesFigure,
  repeatedTaskTypes,
  type GeneratedItem,
  type ItemFormat,
  type KeyedQuestion,
  type SolverReply,
} from './core';

// ── inputs ──────────────────────────────────────────────────────────────────

export interface PackObjective {
  objectiveLoId: string;
  description: string;
  figureDependent: boolean;
  have: number;
  need: number;
  workedExample?: { problem?: string; answer?: string } | null;
  existingItems?: Array<{ question: string; answer?: string }> | null;
}
export interface Pack {
  skillLoId: string;
  subject: string;
  skill: string;
  grade?: string;
  objectives: PackObjective[];
}

/** v2: the correct option is written FIRST and `answer` is its text.
 *  v1: the options are in display order and `answer` is the letter. */
export type SourceFormat = 'v1' | 'v2';

export interface Defect {
  rule: string;
  detail: string;
}

/** Free keys of written items: one bare term, expression or value. */
export const WRITTEN_FREE_KEY_MAX_WORDS = 4;
/** The correct option may be at most this much longer than the longest wrong one. */
export const KEY_LONGEST_RATIO = 1.25;

const LETTERS = 'ABCD';
const isStr = (v: unknown): v is string => typeof v === 'string';
const oneLine = (s: string): string => s.replace(/\s+/g, ' ').trim();

// ── 1. the two file formats ─────────────────────────────────────────────────

/**
 * Which option is the correct one. `answer` equal to an option's text → v2
 * (whatever its position). Otherwise a single letter A–D → v1, the option at
 * that position. `correctIndex` is -1 when the answer names no option, or
 * more than one.
 */
export function detectMcqKey(answer: string, choices: string[]): { format: SourceFormat; correctIndex: number } {
  const a = oneLine(answer ?? '');
  const hits = choices.map((c, i) => (oneLine(c) === a ? i : -1)).filter((i) => i >= 0);
  if (hits.length > 0) return { format: 'v2', correctIndex: hits.length === 1 ? hits[0] : -1 };
  if (/^[A-D]$/.test(a)) {
    const i = LETTERS.indexOf(a);
    return { format: 'v1', correctIndex: i < choices.length ? i : -1 };
  }
  return { format: 'v2', correctIndex: -1 };
}

/** Words of a free key: its space-separated parts that carry a letter or a
 *  digit. A bare operator is not a word, so "(x + 3)/(x + 4)" counts three. */
export function keyWordCount(key: string): number {
  return (key ?? '').trim().split(/\s+/).filter((t) => /[\p{L}\p{N}]/u.test(t)).length;
}

/** A written item after normalisation: options in the order they were
 *  written, the key as the correct option's TEXT (for numeric / free: the key). */
export interface NormalisedItem {
  objectiveLoId: string;
  responseFormat: ItemFormat;
  problemText: string;
  /** mcq: the four option texts as written; otherwise empty. */
  options: string[];
  correctText: string;
  hints: string[];
  solutionText: string;
  difficulty: number;
  taskType: string;
  covers: string;
  verified: string;
  sourceFormat: SourceFormat;
}

/**
 * Normalise one written item and validate its form against its pack. The
 * item is returned whenever it could be read at all; `defects` lists what
 * is wrong with it (an item with any defect is `rules_rejected`).
 */
export function normaliseWritten(raw: unknown, pack: Pack): { item: NormalisedItem; defects: Defect[] } {
  const d: Defect[] = [];
  const add = (rule: string, detail: string) => d.push({ rule, detail });
  const o = (raw ?? {}) as Record<string, unknown>;

  const lo = isStr(o.objectiveLoId) ? o.objectiveLoId.trim() : '';
  const objective = pack.objectives.find((x) => x.objectiveLoId === lo);
  if (!objective) add('unknown_objective', `objectiveLoId "${lo}" is not an objective of this pack`);
  else if (objective.figureDependent) add('figure_dependent_objective', 'the objective is marked as needing a figure');

  const format = o.responseFormat;
  const formatOk = format === 'mcq' || format === 'numeric' || format === 'free';
  if (!formatOk) add('bad_format', `responseFormat "${String(format)}" is not mcq | numeric | free`);

  const stem = isStr(o.problemText) ? o.problemText.trim() : '';
  if (stem.length < LIMITS.stemMin) add('stem_missing', 'problemText is missing or too short');
  if (stem.length > LIMITS.stemMax) add('stem_too_long', `problemText is longer than ${LIMITS.stemMax} characters`);

  const answer = isStr(o.answer) ? o.answer.trim() : typeof o.answer === 'number' ? String(o.answer) : '';
  if (!answer) add('key_missing', 'answer is empty');
  const rawChoices = Array.isArray(o.choices) ? o.choices : [];
  let options: string[] = [];
  let correctText = answer;
  let sourceFormat: SourceFormat = 'v2';
  if (format === 'mcq') {
    options = rawChoices.map((c) => (isStr(c) ? c.trim() : ''));
    if (options.length !== 4) add('mcq_option_count', `mcq needs exactly 4 options (got ${options.length})`);
    if (options.some((c) => !c)) add('mcq_empty_option', 'mcq has an empty option');
    if (options.some((c) => c.length > LIMITS.choiceMax)) add('mcq_option_too_long', 'mcq has an over-long option');
    // Identical texts only. Options that differ in letter case alone (genotypes: "Aa × aa" / "AA × aa")
    // are left to the job's equivalence rule, which says what the app's own option match would do.
    if (new Set(options.map((c) => oneLine(c))).size !== options.length) add('mcq_options_not_distinct', 'mcq options are not all different');
    const key = detectMcqKey(answer, options);
    sourceFormat = key.format;
    if (key.correctIndex < 0) {
      if (answer) add('mcq_key_not_one_option', 'the answer is not the text (or the letter) of exactly one option');
      correctText = '';
    } else {
      correctText = options[key.correctIndex];
    }
  } else if (formatOk) {
    if (rawChoices.length > 0) add('non_mcq_has_choices', `${String(format)} item must not carry choices`);
    if (format === 'numeric' && answer && !parseNumericKey(answer)) add('numeric_key_not_number', 'the numeric key is not one plain number');
    if (format === 'free' && keyWordCount(answer) > WRITTEN_FREE_KEY_MAX_WORDS) add('free_key_too_long', `the free key is longer than ${WRITTEN_FREE_KEY_MAX_WORDS} words`);
  }

  const hints = Array.isArray(o.hints) ? o.hints.filter(isStr).map((h) => h.trim()).filter(Boolean) : [];
  if (hints.length < 1 || hints.length > 2) add('hints_count', `hints must be 1 or 2 (got ${hints.length})`);
  const solutionText = isStr(o.solutionText) ? o.solutionText.trim() : '';
  if (!solutionText) add('solution_missing', 'solutionText is empty');
  const difficulty = Number(o.difficulty);
  if (!Number.isInteger(difficulty) || difficulty < 1 || difficulty > 4) add('difficulty_range', 'difficulty must be an integer 1–4');

  const item: NormalisedItem = {
    objectiveLoId: lo,
    responseFormat: formatOk ? (format as ItemFormat) : 'free',
    problemText: stem,
    options,
    correctText,
    hints,
    solutionText,
    difficulty: Number.isInteger(difficulty) ? difficulty : 0,
    taskType: isStr(o.taskType) ? oneLine(o.taskType) : '',
    covers: isStr(o.covers) ? oneLine(o.covers) : '',
    verified: isStr(o.verified) ? oneLine(o.verified) : '',
    sourceFormat,
  };
  return { item, defects: d };
}

// ── 2. shuffle + letter, in code ────────────────────────────────────────────

/** A small deterministic generator (mulberry32) seeded from a string. */
export function seededRng(seed: string): () => number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Display order for one multiple-choice item. The correct option goes to one
 * of the positions the skill has used LEAST so far (`counts`, one per letter;
 * not modified), picked by the item id; the wrong options are shuffled into
 * the other positions by the same id. Same id + same counts → same order.
 */
export function shuffleMcq(id: string, correctText: string, wrong: string[], counts: readonly number[]): { choices: string[]; letter: string } {
  const rng = seededRng(id);
  const n = wrong.length + 1;
  const used = Array.from({ length: n }, (_, i) => counts[i] ?? 0);
  const min = Math.min(...used);
  const open = used.map((c, i) => (c === min ? i : -1)).filter((i) => i >= 0);
  const pos = open[Math.floor(rng() * open.length)];
  const rest = [...wrong];
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [rest[i], rest[j]] = [rest[j], rest[i]];
  }
  const choices: string[] = [];
  for (let i = 0; i < n; i++) choices.push(i === pos ? correctText : rest.shift()!);
  return { choices, letter: LETTERS[pos] };
}

/** The invariant every stored multiple-choice item must satisfy: the letter
 *  points at the correct option's text. Throws when it does not. */
export function assertLetterPointsAtCorrect(it: { id: string; responseFormat: string; choices: readonly string[]; answer: string; correctText: string }): void {
  if (it.responseFormat !== 'mcq') return;
  const i = /^[A-D]$/.test(it.answer) ? LETTERS.indexOf(it.answer) : -1;
  if (i < 0 || i >= it.choices.length || it.choices[i] !== it.correctText) {
    throw new Error(`${it.id}: answer letter "${it.answer}" does not point at the correct option text`);
  }
  if (it.choices.filter((c) => c === it.correctText).length !== 1) throw new Error(`${it.id}: the correct option text is not exactly one of the choices`);
}

// ── 3. rule checks ──────────────────────────────────────────────────────────

/** The job's `contentDefects` messages → a short rule name for counting. */
const CONTENT_RULES: Array<[RegExp, string]> = [
  [/refers to a figure/, 'figure_reference'],
  [/offers an example or a hint/, 'stem_offers_example_or_hint'],
  [/contains LaTeX/, 'latex_in_key_or_option'],
  [/exactly four options/, 'mcq_option_count'],
  [/does not resolve to exactly one option/, 'mcq_key_not_one_option'],
  [/all \/ none of the above/, 'all_or_none_of_the_above'],
  [/are equivalent/, 'equivalent_options'],
  [/correct option with text added/, 'option_is_key_with_text_added'],
  [/answer is longer than/, 'free_key_too_long'],
  [/carries a justification/, 'key_has_justification'],
  [/question text contains the answer/, 'key_in_stem'],
];
const ruleOfContentDefect = (message: string): string => CONTENT_RULES.find(([re]) => re.test(message))?.[1] ?? 'content_rule';

/** A reference to an option by its letter or its position. */
const OPTION_REFERENCE_RES: RegExp[] = [
  /\b(?:[Oo]ptions?|[Cc]hoices?|[Aa]lternatives?|[Dd]istractors?)\s+\(?[A-D]\)?(?![A-Za-z0-9'’])/,
  /\b[Aa]nswers?\s+\([A-D]\)/,
  /\b(?:first|second|third|fourth|last|1st|2nd|3rd|4th)\s+(?:option|choice|alternative|answer\s+choice)\b/i,
  /\b(?:option|choice|alternative)s?\s+(?:[1-4]|one|two|three|four)\b/i,
  // "B is correct" — at the start of a clause only ("Vitamin C is correct …" is not a reference)
  /(?:^|[.;:,(]\s*)(?:(?:so|thus|hence|therefore|only|and|but)\s+)?\(?[A-D]\)?\s+(?:is|are|was|would\s+be)\s+(?:the\s+)?(?:correct|incorrect|wrong|right)\b/i,
];

export function referencesOptionByLetter(text: string): boolean {
  return OPTION_REFERENCE_RES.some((re) => re.test(text ?? ''));
}

const foldText = (s: string): string => (s ?? '').toLowerCase().replace(/[−–]/g, '-').replace(/\s+/g, ' ').trim();

/**
 * Does `text` contain `key` verbatim (case, spacing and the kind of minus
 * sign aside)? The match has to stand on its own: "12" is not found inside
 * "120" or "3.12", a word not inside a longer word, and a key with a leading
 * minus not inside a subtraction ("x-3").
 */
export function containsVerbatim(text: string, key: string): boolean {
  const h = foldText(text);
  const k = foldText(key);
  if (!k) return false;
  const alnum = /[a-z0-9]/;
  for (let i = h.indexOf(k); i >= 0; i = h.indexOf(k, i + 1)) {
    const before = h[i - 1] ?? ' ';
    const after = h[i + k.length] ?? ' ';
    const first = k[0];
    const last = k[k.length - 1];
    const joinedBefore =
      (alnum.test(first) && (alnum.test(before) || (/\d/.test(first) && /[.,]/.test(before) && /\d/.test(h[i - 2] ?? '')))) ||
      (first === '-' && /[a-z0-9)\]]/.test(before));
    const joinedAfter = alnum.test(last) && (alnum.test(after) || (/\d/.test(last) && /[.,]/.test(after) && /\d/.test(h[i + k.length + 1] ?? '')));
    if (!joinedBefore && !joinedAfter) return true;
  }
  return false;
}

/** An item in display form: for mcq `choices` in the order shown and
 *  `answer` the letter; `correctText` is the key in words either way. */
export interface DisplayItem {
  id: string;
  objectiveLoId: string;
  responseFormat: ItemFormat;
  problemText: string;
  choices: string[];
  answer: string;
  correctText: string;
  hints: string[];
  solutionText: string;
  difficulty: number;
  taskType: string;
  covers: string;
}

/**
 * Rule defects of one item on its own: the job's `contentDefects` plus the
 * checks for written items — no LaTeX anywhere, the correct option not the
 * longest by more than 25%, no reference to an option by letter or position,
 * and no hint that contains the key.
 */
export function writtenItemDefects(it: DisplayItem): Defect[] {
  const d: Defect[] = [];
  const asGenerated: GeneratedItem = {
    objectiveLoId: it.objectiveLoId, responseFormat: it.responseFormat, problemText: it.problemText, answer: it.answer, choices: it.choices,
    hints: it.hints, solutionText: it.solutionText, difficulty: it.difficulty, covers: it.covers, taskType: it.taskType, distractorRationales: [],
  };
  for (const m of contentDefects(asGenerated)) d.push({ rule: ruleOfContentDefect(m), detail: m });

  const prose = [it.problemText, ...it.hints, it.solutionText];
  if (prose.some((t) => /\\[a-zA-Z]{2,}/.test(t))) d.push({ rule: 'latex_in_text', detail: 'the question, a hint or the solution contains a LaTeX command' });
  if ([...it.hints, it.solutionText].some((t) => referencesFigure(t))) d.push({ rule: 'figure_reference', detail: 'a hint or the solution refers to a figure that is not in the text' });

  if (it.responseFormat === 'mcq' && it.choices.length > 1) {
    const wrong = it.choices.filter((c) => c !== it.correctText);
    const longestWrong = Math.max(...wrong.map((c) => oneLine(c).length));
    const keyLen = oneLine(it.correctText).length;
    if (it.correctText && keyLen > KEY_LONGEST_RATIO * longestWrong) {
      d.push({ rule: 'key_is_longest_option', detail: `the correct option (${keyLen} characters) is more than 25% longer than the longest wrong option (${longestWrong})` });
    }
    const where = [['the question', it.problemText], ...it.hints.map((h) => ['a hint', h]), ['the solution', it.solutionText]].filter(([, t]) => referencesOptionByLetter(t));
    if (where.length > 0) d.push({ rule: 'option_referenced_by_letter', detail: `${[...new Set(where.map(([w]) => w))].join(' and ')} refers to an option by letter or position` });
  }
  if (it.correctText && it.hints.some((h) => containsVerbatim(h, it.correctText))) d.push({ rule: 'hint_contains_key', detail: 'a hint contains the key verbatim' });
  return d;
}

// ── 4. one written file ─────────────────────────────────────────────────────

export interface IngestedItem extends DisplayItem {
  /** Position in the written file's `items`. */
  index: number;
  sourceFormat: SourceFormat;
  verified: string;
  defects: Defect[];
}

/**
 * Everything the rules can say about one written file, item by item and in
 * file order: normalise, give the id, order the options, run the rule
 * checks, and compare with what the skill already has and with the earlier
 * items of the file.
 *
 * `prior`: items of this pack that an earlier run already stored (id →
 * letter). Their display order is NOT changed — they keep the stored letter,
 * which also counts towards the spread of letters over the skill.
 */
export function ingestFile(pack: Pack, rawItems: unknown[], prior?: ReadonlyMap<string, { answer: string; choices: string[] }>): IngestedItem[] {
  const counts = [0, 0, 0, 0];
  for (const p of prior?.values() ?? []) {
    const i = /^[A-D]$/.test(p.answer) && p.choices.length === 4 ? LETTERS.indexOf(p.answer) : -1;
    if (i >= 0) counts[i]++;
  }
  // What the skill already has, as the duplicate rule compares it.
  const known: Array<{ id: string; problemText: string; answerText?: string; choices?: readonly string[] }> = pack.objectives.flatMap((o) => [
    ...(o.existingItems ?? []).map((e, i) => ({ id: `existing item ${i + 1} of ${o.objectiveLoId}`, ...comparableOf({ problemText: e.question ?? '', answer: e.answer }) })),
    ...(o.workedExample?.problem ? [{ id: `worked example of ${o.objectiveLoId}`, ...comparableOf({ problemText: o.workedExample.problem, answer: o.workedExample.answer }) }] : []),
  ]);

  const seenIds = new Map<string, number>();
  const out: IngestedItem[] = [];
  rawItems.forEach((raw, index) => {
    const { item, defects } = normaliseWritten(raw, pack);
    let id = item.objectiveLoId && item.problemText ? itemIdOf(item.objectiveLoId, item.problemText) : `unreadable.${pack.skillLoId}.${index}`;
    const repeat = seenIds.get(id) ?? 0;
    seenIds.set(id, repeat + 1);
    if (repeat > 0) {
      defects.push({ rule: 'duplicate_stem', detail: 'same objective and question text as an earlier item of the file' });
      id = `${id}#${repeat + 1}`;
    }

    let choices: string[] = [];
    let answer = item.correctText;
    if (item.responseFormat === 'mcq') {
      const stored = prior?.get(id);
      const sound = item.options.length === 4 && item.correctText !== '' && item.options.filter((c) => c === item.correctText).length === 1;
      if (stored && sound && stored.choices.length === 4 && [...stored.choices].sort().join('\u0000') === [...item.options].sort().join('\u0000') && stored.choices[LETTERS.indexOf(stored.answer)] === item.correctText) {
        ({ choices, answer } = stored);
      } else if (sound) {
        const s = shuffleMcq(id, item.correctText, item.options.filter((c) => c !== item.correctText), counts);
        choices = s.choices;
        answer = s.letter;
        counts[LETTERS.indexOf(s.letter)]++;
      } else {
        choices = item.options; // unsound: kept as written, already a defect
        answer = '';
      }
    }
    const display: DisplayItem = {
      id, objectiveLoId: item.objectiveLoId, responseFormat: item.responseFormat, problemText: item.problemText, choices, answer, correctText: item.correctText,
      hints: item.hints, solutionText: item.solutionText, difficulty: item.difficulty, taskType: item.taskType, covers: item.covers,
    };
    if (defects.length === 0) {
      assertLetterPointsAtCorrect(display);
      defects.push(...writtenItemDefects(display));
    }
    const me = comparableOf({ problemText: display.problemText, answer: display.answer, choices: display.choices });
    if (defects.length === 0) {
      const dup = nearDuplicateOf(me, known);
      if (dup) defects.push({ rule: /^practice-gen\./.test(dup.of.id) ? 'near_duplicate_of_new_item' : 'near_duplicate_of_existing', detail: `${dup.reason} of ${dup.of.id}` });
    }
    // Later items are compared with this one whether or not a solver or a
    // reader finally keeps it: a twin of a rejected item is still a twin.
    if (defects.length === 0) known.push({ id, ...me });
    out.push({ ...display, index, sourceFormat: item.sourceFormat, verified: item.verified, defects });
  });

  // The same kind of task twice on one objective (the job's own rule):
  // the later one is the defect.
  const clean = out.filter((x) => x.defects.length === 0);
  for (const i of repeatedTaskTypes(clean)) {
    clean[i].defects.push({ rule: 'task_type_repeats', detail: `its task type "${clean[i].taskType}" repeats another new question of the same objective` });
  }
  return out;
}

// ── 5. the blind solver's reply ─────────────────────────────────────────────

export type SolverOutcomeKind = 'agree' | 'disagree' | 'ill-posed' | 'undecided';

export interface SolverJudgement {
  outcome: SolverOutcomeKind;
  method: string;
  reason: string;
}

/**
 * Deterministic only — no judge model. `undecided` when the rules cannot
 * tell (a free-text answer in other words, a multiple-choice reply that names
 * no option or names one option by letter and another by text): a reader
 * decides those.
 */
export function judgeSolverReply(q: KeyedQuestion, correctText: string, s: SolverReply): SolverJudgement {
  if (s.illPosed) return { outcome: 'ill-posed', method: 'solver', reason: s.illPosedReason || 'the solver said the question cannot be answered as written' };
  if (q.choices.length > 0) {
    const choices = toChoices(q.choices);
    const byLetter = resolveOptionLetter(s.chosenOption ?? '', choices);
    const byText = resolveOptionLetter(s.answer ?? '', choices);
    if (byLetter && byText && byLetter !== byText) return { outcome: 'undecided', method: 'mcq', reason: `the solver named option ${byLetter} but wrote the text of option ${byText}` };
    const c = compareWithRules(q, s);
    if (c.verdict === 'SAME') {
      const picked = byLetter ?? byText;
      const text = picked ? q.choices[LETTERS.indexOf(picked)] : undefined;
      if (text !== correctText) return { outcome: 'undecided', method: 'mcq', reason: 'the keyed letter and the correct option text do not agree' };
      return { outcome: 'agree', method: c.method, reason: c.reason };
    }
    return { outcome: c.verdict === 'DIFFERENT' ? 'disagree' : 'undecided', method: c.method, reason: c.reason };
  }
  const c = compareWithRules(q, s);
  if (c.verdict === 'SAME') return { outcome: 'agree', method: c.method, reason: c.reason };
  if (c.verdict === 'DIFFERENT') return { outcome: 'disagree', method: c.method, reason: c.reason };
  return { outcome: 'undecided', method: c.method, reason: c.reason };
}

export type IngestStatus = 'rules_rejected' | 'solver_disagrees' | 'solver_ill_posed' | 'ready_for_read';

export function statusOf(defects: Defect[], outcome: SolverOutcomeKind | undefined): IngestStatus | null {
  if (defects.length > 0) return 'rules_rejected';
  if (!outcome) return null; // not solved yet
  return outcome === 'disagree' ? 'solver_disagrees' : outcome === 'ill-posed' ? 'solver_ill_posed' : 'ready_for_read';
}

// ── 6. reading batches ──────────────────────────────────────────────────────

export const BATCH_MAX = 80;

/**
 * Batches of at most `max` items; a batch holds whole skills (packs) of ONE
 * subject. Subjects and packs are taken in order. A skill that alone
 * exceeds `max` is split across batches of its own.
 */
export function planBatches<T extends { id: string; subject: string; pack: string }>(items: T[], max = BATCH_MAX): Array<{ subject: string; packs: string[]; items: T[] }> {
  const bySubject = new Map<string, Map<string, T[]>>();
  for (const it of items) {
    if (!bySubject.has(it.subject)) bySubject.set(it.subject, new Map());
    const packs = bySubject.get(it.subject)!;
    packs.set(it.pack, [...(packs.get(it.pack) ?? []), it]);
  }
  const out: Array<{ subject: string; packs: string[]; items: T[] }> = [];
  for (const subject of [...bySubject.keys()].sort()) {
    let cur: { subject: string; packs: string[]; items: T[] } | null = null;
    const packs = bySubject.get(subject)!;
    for (const pack of [...packs.keys()].sort()) {
      let list = packs.get(pack)!;
      if (cur && cur.items.length + list.length > max) {
        out.push(cur);
        cur = null;
      }
      while (list.length > max) {
        out.push({ subject, packs: [pack], items: list.slice(0, max) });
        list = list.slice(max);
      }
      cur ??= { subject, packs: [], items: [] };
      cur.packs.push(pack);
      cur.items.push(...list);
    }
    if (cur && cur.items.length > 0) out.push(cur);
  }
  return out;
}

// ── 7. finalize: which items are exported ───────────────────────────────────

export interface ReaderGrade {
  id: string;
  blindAnswer?: string;
  agreesWithKey?: boolean;
  grade?: string;
  reason?: string;
  correctedKey?: string | null;
}

export interface FinalizeInput {
  status: IngestStatus;
  /** The DeepSeek blind solve (absent for rule-rejected items). */
  solverOutcome?: SolverOutcomeKind;
  format: string;
  /** Options in display order (empty unless multiple choice). */
  choices: string[];
  /** The stored key: the letter for multiple choice. */
  key: string;
  question: string;
  /** No longer in its written file (the file was edited after the ingest). */
  superseded?: boolean;
}

export type FinalizeDecision =
  | { action: 'export'; basis: 'solver_and_reader' | 'reader_adjudicated' | 'reader_decided' }
  | { action: 'rewrite'; reason: 'reader_corrected_key' }
  | { action: 'drop'; reason: string };

const GOOD_GRADES = new Set(['good', 'acceptable']);

/**
 * The selection rule, for one item and the grade(s) its readers gave:
 *  - rule-rejected, withdrawn or ungraded → not exported;
 *  - a reader supplied `correctedKey` → NOT exported, listed for a rewrite;
 *  - grade must be good or acceptable and the reader must agree with the key;
 *  - the solver agreed → exported;
 *  - the solver disagreed / said ill-posed (a disputed item), or its answer
 *    could not be compared by rule → exported only when the reader's own
 *    blind answer matches the key: by the job's deterministic compare, or —
 *    where that cannot decide a free-text answer — on the reader's word.
 * Several grades for one item: every one of them has to pass.
 */
export function finalizeDecision(item: FinalizeInput, grades: ReaderGrade[]): FinalizeDecision {
  if (item.superseded) return { action: 'drop', reason: 'no_longer_in_written_file' };
  if (item.status === 'rules_rejected') return { action: 'drop', reason: 'rules_rejected' };
  if (grades.length === 0) return { action: 'drop', reason: 'no_reader_grade' };
  if (grades.some((g) => typeof g.correctedKey === 'string' && g.correctedKey.trim() !== '')) return { action: 'rewrite', reason: 'reader_corrected_key' };
  const disputed = item.status !== 'ready_for_read';
  for (const g of grades) {
    const grade = String(g.grade ?? '').trim().toLowerCase();
    if (!GOOD_GRADES.has(grade)) return { action: 'drop', reason: grade === 'poor' ? 'reader_grade_poor' : 'reader_grade_missing_or_unknown' };
    if (g.agreesWithKey !== true) return { action: 'drop', reason: disputed ? 'disputed_reader_does_not_reach_key' : 'reader_disagrees_with_key' };
  }
  if (!disputed && item.solverOutcome === 'agree') return { action: 'export', basis: 'solver_and_reader' };
  if (!disputed && item.solverOutcome !== 'undecided') return { action: 'drop', reason: 'no_solver_result' };
  // The reader's blind answer has to be the key.
  for (const g of grades) {
    const blind = String(g.blindAnswer ?? '').trim();
    if (!blind) return { action: 'drop', reason: 'reader_gave_no_blind_answer' };
    const c = compareWithRules(
      { format: item.format, question: item.question, key: item.key, choices: item.choices },
      { illPosed: false, illPosedReason: '', assumptions: '', chosenOption: item.choices.length > 0 ? blind : '', answer: blind },
    );
    if (c.verdict === 'DIFFERENT') return { action: 'drop', reason: 'reader_blind_answer_differs_from_key' };
    if (c.verdict !== 'SAME' && item.choices.length > 0) return { action: 'drop', reason: 'reader_blind_answer_names_no_option' };
  }
  return { action: 'export', basis: disputed ? 'reader_adjudicated' : 'reader_decided' };
}

/** The target the depth run works towards, per objective. */
export const COVERAGE_TARGET = 3;

export function coverageAfter(packs: Array<{ pack: string } & Pack>, exportedByObjective: ReadonlyMap<string, number>, target = COVERAGE_TARGET) {
  const objectives = packs.flatMap((p) =>
    p.objectives.map((o) => {
      const exported = exportedByObjective.get(o.objectiveLoId) ?? 0;
      const have = Math.max(0, Math.floor(Number(o.have) || 0));
      return { pack: p.pack, subject: p.subject, skill: p.skill, objectiveLoId: o.objectiveLoId, description: o.description, figureDependent: !!o.figureDependent, have, exported, after: have + exported, target, meetsTarget: have + exported >= target };
    }),
  );
  const tally = (list: typeof objectives) => ({ objectives: list.length, meetTarget: list.filter((o) => o.meetsTarget).length, belowTarget: list.filter((o) => !o.meetsTarget).length, with0: list.filter((o) => o.after === 0).length, exported: list.reduce((n, o) => n + o.exported, 0) });
  const bySubject: Record<string, ReturnType<typeof tally>> = {};
  for (const s of [...new Set(objectives.map((o) => o.subject))].sort()) bySubject[s] = tally(objectives.filter((o) => o.subject === s));
  return { target, all: tally(objectives), textOnly: tally(objectives.filter((o) => !o.figureDependent)), figureDependent: tally(objectives.filter((o) => o.figureDependent)), bySubject, objectives };
}
