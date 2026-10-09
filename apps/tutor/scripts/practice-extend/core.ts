/**
 * Pure logic for the offline practice-item extension job
 * (scripts/practice-extend/practice-extend.ts). No I/O, no env, no network,
 * no database — everything here is testable without a model
 * (core.test.ts).
 *
 * It reuses the engine's own rules so "verified" means "the app would grade
 * it the same way":
 *   - numeric keys / answers: portal/numeric-answer-rule.ts
 *   - multiple choice, text, relations, numbers with units: portal/key-compare.ts
 *   - near-duplicates: portal/practice-similarity.ts
 */
import {
  compareDeterministic,
  compareMcq,
  keyedLetterOf,
  normText,
  resolveOptionLetter,
  toChoices,
  type JudgeVerdict,
} from '../../src/lib/tutor/portal/key-compare';
import { gradeNumericAnswer, parseNumericKey } from '../../src/lib/tutor/portal/numeric-answer-rule';
import { findNearDuplicate, normalizeItemText, type ComparableItem } from '../../src/lib/tutor/portal/practice-similarity';
import { normMcqText } from '../../src/lib/tutor/voice/answer-primitives';

// ── inputs ──────────────────────────────────────────────────────────────────

export interface CoverageObjective {
  loId: string;
  description: string;
  servable: number;
  itemIds?: string[];
}
export interface CoverageSkill {
  skillLoId: string;
  planId: string;
  title: string;
  objectives: CoverageObjective[];
}

// ── 1. target planning ──────────────────────────────────────────────────────

export interface Target {
  skillLoId: string;
  planId: string;
  objectiveLoId: string;
  /** Servable items the objective has today. */
  have: number;
  /** Items requested from the generator. */
  n: number;
}

export interface PlanParams {
  minPerObjective: number;
  minPerSkill: number;
}

/**
 * Targets for one skill:
 *  1. every objective below `minPerObjective` gets its shortfall;
 *  2. while the skill (existing + requested) is below `minPerSkill`, one more
 *     item goes to the objective that would have the fewest — ties broken by
 *     objective order.
 * Objectives that end with nothing requested are omitted. Objectives in
 * `exclude` are never requested and never topped up.
 */
export function planSkillTargets(skill: CoverageSkill, p: PlanParams, exclude?: ReadonlySet<string>): Target[] {
  const rows = skill.objectives.map((o) => {
    const have = Math.max(0, Math.floor(Number(o.servable) || 0));
    const open = !exclude?.has(o.loId);
    return { loId: o.loId, have, open, n: open ? Math.max(0, p.minPerObjective - have) : 0 };
  });
  // Excluded objectives (e.g. ones that need a figure) get nothing, but what
  // they already have still counts towards the skill's total.
  const open = rows.filter((r) => r.open);
  if (open.length > 0) {
    let total = rows.reduce((s, r) => s + r.have + r.n, 0);
    while (total < p.minPerSkill) {
      let best = open[0];
      for (const r of open) if (r.have + r.n < best.have + best.n) best = r;
      best.n++;
      total++;
    }
  }
  return rows
    .filter((r) => r.n > 0)
    .map((r) => ({ skillLoId: skill.skillLoId, planId: skill.planId, objectiveLoId: r.loId, have: r.have, n: r.n }));
}

/**
 * Coverage mode: ONLY objectives that have no servable item (and are not
 * excluded) are requested, `n` each. No shortfall top-up, no per-skill minimum.
 */
export function planEmptyTargets(skills: CoverageSkill[], n: number, exclude?: ReadonlySet<string>): Target[] {
  return skills.flatMap((s) =>
    s.objectives
      .filter((o) => !(Number(o.servable) > 0) && !exclude?.has(o.loId))
      .map((o) => ({ skillLoId: s.skillLoId, planId: s.planId, objectiveLoId: o.loId, have: 0, n })),
  );
}

/**
 * Split one skill's targets into requests of at most `maxItems` questions, so
 * that no single reply is long enough to be cut short. Objectives are kept
 * whole and in order; one that alone exceeds the limit gets a call of its own.
 */
export function chunkTargets<T extends { n: number }>(targets: T[], maxItems: number): T[][] {
  const out: T[][] = [];
  let cur: T[] = [];
  let size = 0;
  for (const t of targets) {
    if (cur.length > 0 && size + t.n > maxItems) {
      out.push(cur);
      cur = [];
      size = 0;
    }
    cur.push(t);
    size += t.n;
  }
  if (cur.length > 0) out.push(cur);
  return out;
}

export function planTargets(skills: CoverageSkill[], p: PlanParams, exclude?: ReadonlySet<string>): Target[] {
  return skills.flatMap((s) => planSkillTargets(s, p, exclude));
}

export interface SampleCandidate {
  skillLoId: string;
  subject: string;
  /** Objectives with no servable item. */
  zeroObjectives: number;
  /** A plan that stores no lesson material for its objectives. */
  descriptionOnly: boolean;
}

/**
 * `n` skills spread evenly over the subjects (the remainder goes to the
 * subjects with the most empty objectives). Within a subject, skills that
 * have an empty objective come first; order is otherwise by skill id, which
 * is a random uuid — so the sample is arbitrary but reproducible. When any
 * description-only skill exists, exactly one slot is given to one so the
 * sample exercises that path.
 */
export function pickSample(cands: SampleCandidate[], n: number): string[] {
  const bySubject = new Map<string, SampleCandidate[]>();
  for (const c of cands) {
    if (!bySubject.has(c.subject)) bySubject.set(c.subject, []);
    bySubject.get(c.subject)!.push(c);
  }
  const zeros = (list: SampleCandidate[]) => list.reduce((s, c) => s + c.zeroObjectives, 0);
  const subjects = [...bySubject.keys()].sort(
    (a, b) => zeros(bySubject.get(b)!) - zeros(bySubject.get(a)!) || a.localeCompare(b),
  );
  if (subjects.length === 0 || n <= 0) return [];
  const quota = new Map<string, number>();
  subjects.forEach((s, i) => quota.set(s, Math.floor(n / subjects.length) + (i < n % subjects.length ? 1 : 0)));

  const order = (list: SampleCandidate[]) =>
    [...list].sort(
      (a, b) => Number(b.zeroObjectives > 0) - Number(a.zeroObjectives > 0) || a.skillLoId.localeCompare(b.skillLoId),
    );
  const picked: string[] = [];
  let needDescriptionOnly = cands.some((c) => c.descriptionOnly);
  for (const s of subjects) {
    const want = quota.get(s) ?? 0;
    if (want === 0) continue;
    const ordered = order(bySubject.get(s)!);
    const lessonBased = ordered.filter((c) => !c.descriptionOnly);
    const descOnly = ordered.filter((c) => c.descriptionOnly);
    const take: SampleCandidate[] = [];
    if (needDescriptionOnly && descOnly.length > 0) {
      take.push(descOnly[0]);
      needDescriptionOnly = false;
    }
    for (const c of [...lessonBased, ...descOnly.slice(take.length)]) {
      if (take.length >= want) break;
      take.push(c);
    }
    picked.push(...take.map((c) => c.skillLoId));
  }
  return picked;
}

// ── 2. generated output: schema + strict validation ─────────────────────────

export type ItemFormat = 'mcq' | 'numeric' | 'free';

export interface GeneratedItem {
  objectiveLoId: string;
  responseFormat: ItemFormat;
  problemText: string;
  /** mcq → the letter A–D; numeric → a plain number; free → the short answer. */
  answer: string;
  /** Exactly four for mcq, empty otherwise. */
  choices: string[];
  hints: string[];
  solutionText: string;
  difficulty: number;
  covers: string;
  /** The kind of task, in general terms — distinct within one objective. */
  taskType: string;
  /** Multiple choice only, one per option in order: the specific mistake that
   *  leads to a wrong option ("correct" for the right one). Used by the
   *  checks and the quality review; never exported. */
  distractorRationales: string[];
}

export interface FigureMarker {
  objectiveLoId: string;
  reason: string;
}

/** JSON schema handed to the generator (structured output). */
export const GENERATION_SCHEMA: Record<string, unknown> = {
  type: 'object',
  additionalProperties: false,
  required: ['items', 'needsFigure'],
  properties: {
    items: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['objectiveLoId', 'responseFormat', 'problemText', 'answer', 'choices', 'hints', 'solutionText', 'difficulty', 'covers', 'taskType', 'distractorRationales'],
        properties: {
          objectiveLoId: { type: 'string' },
          responseFormat: { type: 'string', enum: ['mcq', 'numeric', 'free'] },
          problemText: { type: 'string' },
          answer: { type: 'string' },
          choices: { type: 'array', items: { type: 'string' } },
          hints: { type: 'array', items: { type: 'string' } },
          solutionText: { type: 'string' },
          difficulty: { type: 'integer' },
          covers: { type: 'string' },
          taskType: { type: 'string' },
          distractorRationales: { type: 'array', items: { type: 'string' } },
        },
      },
    },
    needsFigure: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['objectiveLoId', 'needsFigure', 'reason'],
        properties: {
          objectiveLoId: { type: 'string' },
          needsFigure: { type: 'boolean' },
          reason: { type: 'string' },
        },
      },
    },
  },
};

/** A stem that points at something the text does not carry. Deliberately
 *  about REFERENCES ("the graph below", "as shown") — a question may talk
 *  about a graph or a diagram in words. */
const FIGURE_REFERENCE_RE = new RegExp(
  [
    String.raw`\b(?:the|this|that|following|accompanying)\s+(?:figure|diagram|graph|picture|image|illustration|sketch|chart|plot|map|drawing|photo(?:graph)?)\s+(?:below|above|shown|here|provided|given|at\s+(?:the\s+)?(?:right|left)|to\s+the\s+(?:right|left))`,
    String.raw`\b(?:figure|diagram|graph|picture|image|illustration|sketch|chart|plot|map|drawing)\s+(?:below|above|shown|provided)\b`,
    String.raw`\b(?:shown|pictured|depicted|illustrated|drawn|sketched|labell?ed|plotted)\s+(?:below|above|here|in\s+the\s+(?:figure|diagram|graph|picture|image|sketch|chart|plot))`,
    String.raw`\b(?:see|refer\s+to|look\s+at|use|using|from|in|on)\s+the\s+(?:(?:following|accompanying|given|provided|attached)\s+)?(?:figure|diagram|picture|image|illustration)\b`,
    String.raw`\bas\s+shown\b`,
    String.raw`\bfig(?:ure)?\.?\s*\d`,
  ].join('|'),
  'i',
);

export function referencesFigure(text: string): boolean {
  return FIGURE_REFERENCE_RE.test(text ?? '');
}

export const LIMITS = { stemMin: 15, stemMax: 1400, freeAnswerMax: 220, coversMax: 240, choiceMax: 400, taskTypeMax: 60, freeKeyMaxWords: 12 };

const isStr = (v: unknown): v is string => typeof v === 'string';
const oneLine = (s: string) => s.replace(/\s+/g, ' ').trim();

/** An unescaped `$` count that is odd means a maths span was left open. */
function dollarsBalanced(s: string): boolean {
  const n = (s.replace(/\\\$/g, '').match(/\$/g) ?? []).length;
  return n % 2 === 0;
}

export interface ValidationContext {
  /** Every objective id of the skill. */
  skillObjectiveIds: string[];
  /** Requested count per target objective. */
  requested: Record<string, number>;
}

export interface ValidationResult {
  ok: boolean;
  items: GeneratedItem[];
  needsFigure: FigureMarker[];
  /** The items that can be kept as they are: valid, free of content defects
   *  and not repeating a task type. */
  clean: GeneratedItem[];
  /** Human-readable defects; also sent back to the model on the follow-up. */
  errors: string[];
}

/** Validate one item in isolation. Returns the normalised item or the defects. */
export function validateItem(raw: unknown, skillObjectiveIds: string[]): { item?: GeneratedItem; errors: string[]; defects: string[] } {
  const e: string[] = [];
  const o = (raw ?? {}) as Record<string, unknown>;
  const lo = isStr(o.objectiveLoId) ? o.objectiveLoId.trim() : '';
  if (!lo || !skillObjectiveIds.includes(lo)) e.push(`objectiveLoId "${lo}" is not an objective of this skill`);
  const format = o.responseFormat;
  if (format !== 'mcq' && format !== 'numeric' && format !== 'free') e.push(`responseFormat "${String(format)}" is not mcq | numeric | free`);
  const stem = isStr(o.problemText) ? o.problemText.trim() : '';
  if (stem.length < LIMITS.stemMin) e.push('problemText is missing or too short');
  if (stem.length > LIMITS.stemMax) e.push(`problemText is longer than ${LIMITS.stemMax} characters`);
  if (referencesFigure(stem)) e.push('problemText refers to a figure, diagram or graph that is not in the text');
  if (!dollarsBalanced(stem)) e.push('problemText has an unclosed $ maths span');

  // Repair: answers and options are plain text — drop bare $ delimiters.
  const plain = (t: string) => (/\\/.test(t) ? t : t.replace(/\$/g, '')).trim();
  let answer = isStr(o.answer) ? plain(o.answer) : '';
  if (!answer) e.push('answer is empty');
  const rawChoices = Array.isArray(o.choices) ? o.choices : [];
  let choices: string[] = [];
  if (format === 'mcq') {
    choices = rawChoices.map((c) => (isStr(c) ? plain(c).replace(/^[A-Da-d][).:]\s+/, '') : ''));
    if (choices.length !== 4) e.push(`mcq needs exactly 4 choices (got ${choices.length})`);
    if (choices.some((c) => !c)) e.push('mcq has an empty choice');
    if (choices.some((c) => c.length > LIMITS.choiceMax)) e.push('mcq has an over-long choice');
    if (new Set(choices.map((c) => oneLine(c).toLowerCase())).size !== choices.length) e.push('mcq choices are not all different');
    if (choices.length === 4 && answer) {
      const letter = /^[A-Da-d]$/.test(answer) ? answer.toUpperCase() : null;
      const byText = choices.map((c, i) => (oneLine(c) === oneLine(answer) ? 'ABCD'[i] : null)).filter(Boolean);
      if (letter) answer = letter;
      else if (byText.length === 1) answer = byText[0]!;
      else e.push('mcq answer must be the letter (A–D) of exactly one choice');
    }
  } else {
    if (rawChoices.length > 0) e.push(`${String(format)} item must not carry choices`);
    if (format === 'numeric' && answer && !parseNumericKey(answer)) {
      e.push('numeric answer must be one plain number (integer, decimal or a/b fraction) with no units or words');
    }
    if (format === 'free' && answer.length > LIMITS.freeAnswerMax) e.push(`free answer is longer than ${LIMITS.freeAnswerMax} characters (no essays)`);
  }

  const hints = Array.isArray(o.hints) ? o.hints.filter(isStr).map((h) => h.trim()).filter(Boolean) : [];
  if (hints.length < 1 || hints.length > 2) e.push(`hints must be 1 or 2 (got ${hints.length})`);
  const solutionText = isStr(o.solutionText) ? o.solutionText.trim() : '';
  if (!solutionText) e.push('solutionText is empty');
  const difficulty = Number(o.difficulty);
  if (!Number.isInteger(difficulty) || difficulty < 1 || difficulty > 4) e.push('difficulty must be an integer 1–4');
  const covers = isStr(o.covers) ? oneLine(o.covers) : '';
  if (!covers) e.push('covers note is empty');
  if (covers.length > LIMITS.coversMax) e.push('covers note must be one short line');
  const taskType = isStr(o.taskType) ? oneLine(o.taskType) : '';
  if (!taskType) e.push('taskType label is empty');
  if (taskType.length > LIMITS.taskTypeMax) e.push('taskType must be a label of two to five words');

  const rationales = format === 'mcq' && Array.isArray(o.distractorRationales) ? o.distractorRationales.map((r) => (isStr(r) ? oneLine(r) : '')) : [];
  if (format === 'mcq' && rationales.length !== 4) e.push('mcq needs distractorRationales: one entry per option, in order');

  if (e.length > 0) return { errors: e, defects: [] };
  const item: GeneratedItem = { objectiveLoId: lo, responseFormat: format as ItemFormat, problemText: stem, answer, choices, hints, solutionText, difficulty, covers, taskType, distractorRationales: rationales };
  return { item, errors: [], defects: contentDefects(item) };
}

// ── 2b. deterministic content checks ────────────────────────────────────────

const BANNED_OPTION_RE = /\b(?:all|none|both|neither|any|some)\s+of\s+(?:the\s+)?(?:above|these|them|the\s+options)\b|\b(?:both|either|neither)\s+[A-D]\s+(?:and|or|nor)\s+[A-D]\b|^\s*[A-D]\s+and\s+[A-D]\s*$/i;
const JUSTIFICATION_RE = /\b(?:because|since|so\s+that|therefore|thus|hence|due\s+to|as\s+a\s+result|which\s+means|owing\s+to)\b/i;
/** A stem that offers a sample, a hint or a pointer to the answer's form. */
const LEADING_STEM_RE = /\be\.\s?g\.|\bfor\s+example\b|\bfor\s+instance\b|\bhint\s*:|\(hint\b/i;

/** Word-level tokens of a text after the engine's notation clean-up. */
function wordTokens(text: string): string[] {
  return normalizeItemText(text).match(/-?\d+(?:\.\d+)?|[a-z]+|[^\sa-z0-9]/g) ?? [];
}
function containsSequence(hay: string[], needle: string[]): boolean {
  if (needle.length === 0 || needle.length > hay.length) return false;
  outer: for (let i = 0; i + needle.length <= hay.length; i++) {
    for (let j = 0; j < needle.length; j++) if (hay[i + j] !== needle[j]) continue outer;
    return true;
  }
  return false;
}
/** An answer in words (not a bare number, letter or short symbol): the only
 *  kind whose appearance in the question text, or inside another option,
 *  gives something away. */
function isWordedAnswer(tokens: string[]): boolean {
  const words = tokens.filter((t) => /^[a-z]{3,}$/.test(t));
  return words.length >= 2 || (words.length === 1 && words[0].length >= 5);
}

/** Two option texts the app would treat as the same answer. */
export function optionsEquivalent(a: string, b: string): boolean {
  if (normText(a) === normText(b)) return true;
  // The app's option-text match drops every non-alphanumeric character, so
  // it cannot tell "12" from "-12" or "1.2": use it for worded options only.
  const na = normMcqText(a);
  if (na && !/\d/.test(na) && na === normMcqText(b)) return true;
  const ab = gradeNumericAnswer(a, b);
  const ba = gradeNumericAnswer(b, a);
  if ((ab.decided && ab.correct) || (ba.decided && ba.correct)) return true;
  return compareDeterministic(a, b).result === 'same';
}

export function wordCount(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Defects one item has on its own, by rule (no model). An item with any
 * defect is never audited or exported. The wording is also what the
 * generator is told on its one retry.
 */
export function contentDefects(it: GeneratedItem): string[] {
  const d: string[] = [];
  const stemTokens = wordTokens(it.problemText);
  if (referencesFigure(it.problemText)) d.push('the question refers to a figure that is not in the text');
  if (LEADING_STEM_RE.test(it.problemText)) d.push('the question offers an example or a hint');
  if (/\\[a-zA-Z]/.test(it.answer) || it.choices.some((c) => /\\[a-zA-Z]/.test(c))) d.push('the answer or an option contains LaTeX');

  let answerText = it.answer;
  if (it.responseFormat === 'mcq') {
    const keyed = keyedLetterOf({ key: it.answer, choices: toChoices(it.choices) });
    const idx = keyed.letter ? 'ABCD'.indexOf(keyed.letter) : -1;
    if (it.choices.length !== 4) d.push('multiple choice needs exactly four options');
    if (idx < 0 || keyed.conflict) d.push('the answer does not resolve to exactly one option');
    answerText = idx >= 0 ? it.choices[idx] : '';
    if (it.choices.some((c) => BANNED_OPTION_RE.test(c))) d.push('an option is "all / none of the above" or a combination of other options');
    for (let i = 0; i < it.choices.length; i++) {
      for (let j = i + 1; j < it.choices.length; j++) {
        if (optionsEquivalent(it.choices[i], it.choices[j])) d.push(`options ${'ABCD'[i]} and ${'ABCD'[j]} are equivalent`);
      }
    }
    // Each wrong option must rest on its own, named mistake.
    const why = (it.distractorRationales ?? []).map((r, i) => (i === idx ? '' : taskTypeKey(r)));
    if (idx >= 0 && it.distractorRationales?.length === 4) {
      const wrong = why.filter((_, i) => i !== idx);
      if (wrong.some((w) => !w || w === 'correct')) d.push('a wrong option has no mistake named behind it');
      else if (new Set(wrong).size !== wrong.length) d.push('two wrong options rest on the same mistake');
    }
    const keyTokens = wordTokens(answerText);
    if (idx >= 0 && isWordedAnswer(keyTokens)) {
      it.choices.forEach((c, i) => {
        const t = wordTokens(c);
        if (i !== idx && t.length > keyTokens.length && containsSequence(t, keyTokens)) d.push(`option ${'ABCD'[i]} is the correct option with text added`);
      });
    }
  }
  if (it.responseFormat === 'free') {
    if (wordCount(it.answer) > LIMITS.freeKeyMaxWords) d.push(`the answer is longer than ${LIMITS.freeKeyMaxWords} words`);
    if (JUSTIFICATION_RE.test(it.answer)) d.push('the answer carries a justification (reasoning belongs in solutionText)');
  }
  if (it.responseFormat !== 'numeric' && answerText) {
    const keyTokens = wordTokens(answerText);
    if (isWordedAnswer(keyTokens) && containsSequence(stemTokens, keyTokens)) d.push('the question text contains the answer');
  }
  return d;
}

/** Normalised task-type label, for the "distinct within an objective" rule. */
export function taskTypeKey(label: string): string {
  return (label ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((w) => (w.length > 3 ? w.replace(/(?:ing|es|ed|e|s)$/, '') : w))
    .sort()
    .join(' ');
}

/** Ids (by index) of items whose task type repeats an EARLIER item of the
 *  same objective. */
export function repeatedTaskTypes(items: Array<Pick<GeneratedItem, 'objectiveLoId' | 'taskType'>>): number[] {
  const seen = new Set<string>();
  const out: number[] = [];
  items.forEach((it, i) => {
    const k = `${it.objectiveLoId}|${taskTypeKey(it.taskType)}`;
    if (seen.has(k)) out.push(i);
    else seen.add(k);
  });
  return out;
}

/**
 * Strict validation of a whole generator reply. `ok` only when every item is
 * valid and free of content defects, no two items share a stem or — within
 * one objective — a task type, every target objective got exactly the
 * requested number of items or a needs-a-figure marker (not both), and
 * nothing was written for an objective that was not requested.
 * `items` holds every schema-valid item, `clean` the ones that can be kept
 * as they are — the caller asks again only for what `clean` leaves missing.
 */
export function validateGeneration(raw: unknown, ctx: ValidationContext): ValidationResult {
  const errors: string[] = [];
  const o = (raw ?? {}) as Record<string, unknown>;
  if (!Array.isArray(o.items)) return { ok: false, items: [], clean: [], needsFigure: [], errors: ['reply has no items array'] };

  const targetIds = Object.keys(ctx.requested);
  const needsFigure: FigureMarker[] = [];
  for (const m of Array.isArray(o.needsFigure) ? o.needsFigure : []) {
    const r = (m ?? {}) as Record<string, unknown>;
    if (r.needsFigure === false) continue;
    const lo = isStr(r.objectiveLoId) ? r.objectiveLoId.trim() : '';
    if (!targetIds.includes(lo)) {
      errors.push(`needsFigure marker for "${lo}", which is not a requested objective`);
      continue;
    }
    if (!needsFigure.some((x) => x.objectiveLoId === lo)) needsFigure.push({ objectiveLoId: lo, reason: isStr(r.reason) ? oneLine(r.reason) : '' });
  }

  const items: GeneratedItem[] = [];
  const defective = new Set<GeneratedItem>();
  const seen = new Set<string>();
  o.items.forEach((rawItem, i) => {
    const v = validateItem(rawItem, ctx.skillObjectiveIds);
    if (!v.item) {
      errors.push(...v.errors.map((m) => `item ${i + 1}: ${m}`));
      return;
    }
    // Content defects make the reply not ok (→ the one retry) but the item
    // is kept: if it survives the retry, the audit stage rejects it by rule.
    errors.push(...v.defects.map((m) => `item ${i + 1}: ${m}`));
    if (!targetIds.includes(v.item.objectiveLoId)) {
      errors.push(`item ${i + 1}: objective ${v.item.objectiveLoId} was not requested`);
      return;
    }
    const key = oneLine(v.item.problemText).toLowerCase();
    if (seen.has(key)) {
      errors.push(`item ${i + 1}: same problemText as an earlier item`);
      return;
    }
    seen.add(key);
    items.push(v.item);
    if (v.defects.length > 0) defective.add(v.item);
  });
  for (const i of repeatedTaskTypes(items)) {
    defective.add(items[i]);
    errors.push(`question "${items[i].problemText.slice(0, 60)}…": its task type "${items[i].taskType}" repeats another question of the same objective — it must be a different kind of task`);
  }

  for (const lo of targetIds) {
    const got = items.filter((it) => it.objectiveLoId === lo).length;
    const flagged = needsFigure.some((m) => m.objectiveLoId === lo);
    if (flagged && got > 0) errors.push(`objective ${lo}: has both items and a needsFigure marker`);
    else if (!flagged && got !== ctx.requested[lo]) errors.push(`objective ${lo}: ${ctx.requested[lo]} item(s) requested, ${got} valid item(s) returned`);
  }
  return { ok: errors.length === 0, items, clean: items.filter((it) => !defective.has(it)), needsFigure, errors };
}

/** What is still missing per objective once `kept` items are counted
 *  (objectives flagged as needing a figure are not missing anything). */
export function shortfallOf(requested: Record<string, number>, kept: Array<Pick<GeneratedItem, 'objectiveLoId'>>, needsFigure: FigureMarker[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [lo, n] of Object.entries(requested)) {
    if (needsFigure.some((m) => m.objectiveLoId === lo)) continue;
    const missing = n - kept.filter((it) => it.objectiveLoId === lo).length;
    if (missing > 0) out[lo] = missing;
  }
  return out;
}

/** Keep at most the requested number per objective, and nothing for an
 *  objective flagged as needing a figure (used when salvaging). */
export function trimToRequested(items: GeneratedItem[], needsFigure: FigureMarker[], requested: Record<string, number>): GeneratedItem[] {
  const count: Record<string, number> = {};
  return items.filter((it) => {
    if (needsFigure.some((m) => m.objectiveLoId === it.objectiveLoId)) return false;
    count[it.objectiveLoId] = (count[it.objectiveLoId] ?? 0) + 1;
    return count[it.objectiveLoId] <= (requested[it.objectiveLoId] ?? 0);
  });
}

// ── ids ─────────────────────────────────────────────────────────────────────

/**
 * The runtime generator's content hash — a copy of `simpleHash`
 * (src/lib/tutor/voice/problem-generator.ts). Copied, not imported: that
 * module pulls in mongoose + connectDB and nothing in this job may be able
 * to open a database connection. core.test.ts pins it against ids the
 * runtime actually stored.
 */
export function simpleHash(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i);
  return (h >>> 0).toString(36);
}

/** `practice-gen.<objectiveLoId>.<hash of the stem>` — the runtime's id scheme
 *  (practice-gen.ts `generateOne`). */
export function itemIdOf(objectiveLoId: string, problemText: string): string {
  return `practice-gen.${objectiveLoId}.${simpleHash(problemText)}`;
}

// ── 3. comparing a solver's answer with the key ─────────────────────────────

export interface KeyedQuestion {
  format: string;
  question: string;
  key: string;
  /** Option texts, in order (A, B, C …); empty when not multiple choice. */
  choices: string[];
}

export interface SolverReply {
  illPosed: boolean;
  illPosedReason: string;
  assumptions: string;
  /** The option letter the solver named, as written. */
  chosenOption: string;
  answer: string;
}

export interface Comparison {
  /** SAME / DIFFERENT, or null = the rules cannot decide → ask the judge. */
  verdict: JudgeVerdict | null;
  method: string;
  reason: string;
}

/**
 * Deterministic comparison, in the order the app itself would grade:
 * multiple choice by option; a numeric item by the app's strict number rule;
 * then identical text / relation / single number with units. Multiple choice
 * is never sent to a judge: an option that does not resolve is CANNOT_JUDGE.
 */
export function compareWithRules(q: KeyedQuestion, s: SolverReply): Comparison {
  if (q.choices.length > 0) {
    const choices = toChoices(q.choices);
    const keyed = keyedLetterOf({ key: q.key.trim() ? q.key : null, choices });
    if (keyed.conflict || !keyed.letter) return { verdict: 'CANNOT_JUDGE', method: 'mcq', reason: keyed.conflict ?? 'the key matches no option' };
    const solved = resolveOptionLetter(s.chosenOption ?? '', choices) ?? resolveOptionLetter(s.answer ?? '', choices);
    const c = compareMcq(keyed.letter, solved);
    return { verdict: c.result === 'same' ? 'SAME' : c.result === 'different' ? 'DIFFERENT' : 'CANNOT_JUDGE', method: 'mcq', reason: c.reason };
  }
  if (q.format === 'numeric') {
    const g = gradeNumericAnswer(q.key, s.answer);
    if (g.decided) {
      return { verdict: g.correct ? 'SAME' : 'DIFFERENT', method: 'numeric-rule', reason: g.correct ? 'the app marks this answer correct' : g.feedback };
    }
  }
  const d = compareDeterministic(q.key, s.answer);
  if (d.result === 'same') return { verdict: 'SAME', method: d.method, reason: d.reason };
  if (d.result === 'different') return { verdict: 'DIFFERENT', method: d.method, reason: d.reason };
  return { verdict: null, method: d.method, reason: d.reason };
}

// ── 3b. the acceptance rule ─────────────────────────────────────────────────

export interface SolverOutcome {
  illPosed: boolean;
  /** The solver had to assume something the question does not state. */
  assumed: boolean;
  /** Its answer against the key (undefined when it said ill-posed). */
  vsKey?: JudgeVerdict;
}

export type Decision =
  | { status: 'ACCEPTED'; reason: 'both_solvers_agree' | 'tiebreak_agrees_with_key' }
  | { status: 'TIEBREAK'; reason: 'one_solver_disagrees' }
  | {
      status: 'REJECTED';
      reason: 'ill_posed' | 'unstated_assumption' | 'both_solvers_disagree' | 'tiebreak_disagrees_with_key' | 'tiebreak_ill_posed' | 'tiebreak_unstated_assumption';
    };

/**
 * ACCEPTED only when both first solvers agree with the key. Either says
 * ill-posed, or needed an unstated assumption → REJECTED. Both disagree →
 * REJECTED. Exactly one disagrees → the tie-break solve decides: it agrees
 * with the key → ACCEPTED, anything else → REJECTED. Only SAME counts as
 * agreement (an incomplete key or an undecidable comparison is a disagreement).
 */
export function decide(a: SolverOutcome, b: SolverOutcome, tiebreak?: SolverOutcome): Decision {
  if (a.illPosed || b.illPosed) return { status: 'REJECTED', reason: 'ill_posed' };
  if (a.assumed || b.assumed) return { status: 'REJECTED', reason: 'unstated_assumption' };
  const agree = [a, b].filter((s) => s.vsKey === 'SAME').length;
  if (agree === 2) return { status: 'ACCEPTED', reason: 'both_solvers_agree' };
  if (agree === 0) return { status: 'REJECTED', reason: 'both_solvers_disagree' };
  if (!tiebreak) return { status: 'TIEBREAK', reason: 'one_solver_disagrees' };
  if (tiebreak.illPosed) return { status: 'REJECTED', reason: 'tiebreak_ill_posed' };
  if (tiebreak.assumed) return { status: 'REJECTED', reason: 'tiebreak_unstated_assumption' };
  return tiebreak.vsKey === 'SAME'
    ? { status: 'ACCEPTED', reason: 'tiebreak_agrees_with_key' }
    : { status: 'REJECTED', reason: 'tiebreak_disagrees_with_key' };
}

// ── near-duplicates ─────────────────────────────────────────────────────────

/** An item in the form the engine's duplicate rule compares: the answer in
 *  WORDS (for multiple choice the correct option's text, never its letter). */
export function comparableOf(it: { problemText: string; answer?: string | null; choices?: readonly string[] | null }): ComparableItem {
  const choices = (it.choices ?? []).filter((c) => typeof c === 'string');
  const answer = (it.answer ?? '').trim();
  const idx = /^[A-J]$/.test(answer) ? 'ABCDEFGHIJ'.indexOf(answer) : -1;
  return {
    problemText: it.problemText,
    answerText: choices.length > 0 && idx >= 0 && idx < choices.length ? choices[idx] : answer || undefined,
    choices: choices.length > 0 ? choices : undefined,
  };
}

export function nearDuplicateOf<T extends ComparableItem>(item: ComparableItem, others: readonly T[]) {
  return findNearDuplicate(item, others);
}

// ── cost ────────────────────────────────────────────────────────────────────

export interface Rate {
  input: number;
  output: number;
  cacheRead?: number;
  cacheWrite5m?: number;
}
export interface TokenUsage {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
}

export function costUsd(u: TokenUsage, r: Rate): number {
  return (
    (u.input * r.input + u.output * r.output + u.cacheRead * (r.cacheRead ?? r.input * 0.1) + u.cacheWrite * (r.cacheWrite5m ?? r.input * 1.25)) / 1e6
  );
}

/** Upper bound for one call before it is made: the prompt priced generously
 *  (2.5 characters per token) plus the full output allowance. */
export function worstCaseUsd(promptChars: number, maxOutputTokens: number, r: Rate): number {
  return (Math.ceil(promptChars / 2.5) * r.input + maxOutputTokens * r.output) / 1e6;
}

export class BudgetExceeded extends Error {}

/** Running spend with reservations: a call must reserve its worst case
 *  first, so the cap holds even with calls in flight. */
export class Budget {
  private reserved = 0;
  constructor(
    readonly maxUsd: number,
    private spent = 0,
  ) {}
  get spentUsd(): number {
    return this.spent;
  }
  reserve(worst: number): void {
    if (this.spent + this.reserved + worst > this.maxUsd) {
      throw new BudgetExceeded(
        `budget: spent $${this.spent.toFixed(4)} + in flight $${this.reserved.toFixed(4)} + next call up to $${worst.toFixed(4)} would pass the cap of $${this.maxUsd.toFixed(2)}`,
      );
    }
    this.reserved += worst;
  }
  settle(worst: number, actual: number): void {
    this.reserved = Math.max(0, this.reserved - worst);
    this.spent += actual;
  }
}

// ── 4. quality gate (pure parts) ────────────────────────────────────────────

/** The fixed checklist. `flag: true` always means a defect. */
export const QUALITY_CHECKS = [
  { id: 'gives_away', label: 'the question gives away the answer or names the method', question: 'Does the question text state or give away the outcome or answer, lead to it, narrow the answer or its form more than a student needs — or name the formula, rule or method that the objective is supposed to make the student choose? (Stating a value of a constant, a convention or a rounding rule that the answer depends on is not a give-away.)' },
  { id: 'generic_task', label: 'generic arithmetic or reading, not the objective\u2019s idea', question: 'Could a student answer it with generic arithmetic or by reading the answer off the wording, without using the idea the objective is about — the subject\u2019s vocabulary is only a costume?' },
  { id: 'needs_assumption', label: 'it cannot be answered without an unstated assumption', question: 'To answer it as written, would a student have to assume something the question does not state, where another reasonable assumption would change the answer?' },
  { id: 'off_objective', label: 'it does not practise the stated objective', question: 'Does the question fail to practise the stated objective — for instance because it really practises one of the other objectives, or something outside the skill? (A question that uses the relationship, rule or method the objective is about, but asks for a different one of its quantities than the objective names, DOES practise the objective and is not a defect.)' },
  { id: 'recall_only', label: 'recall only, where the objective asks for more', question: 'Does the objective ask the student to apply, calculate, analyse, compare, predict or explain, while this question can be answered by recalling a fact or definition alone?' },
  { id: 'weak_options', label: 'the options are weak', question: 'Multiple choice only: is any wrong option implausible to a student who has not mastered the objective, not the result of the mistake named behind it, a restatement of another option, or arguably also correct — or does the correct option stand out by its length, detail or form?' },
  { id: 'ambiguous', label: 'the wording is ambiguous', question: 'Is anything in the wording open to more than one reading that would lead to different answers?' },
  { id: 'same_task', label: 'the same task as a question the objective already has', question: 'Judging by what the student must DO (not by wording, values, names or context): is this the same task as one of the existing questions listed for the objective?' },
  { id: 'figure_workaround', label: 'a figure task turned into words', question: 'Does the objective require the student to produce or read a figure (sketch, draw, plot, a graph or diagram), which this question replaces with a verbal description? (A question done from values written out in the text is not such a replacement.)' },
] as const;

export type QualityCheckId = (typeof QUALITY_CHECKS)[number]['id'];
export interface QualityFlag {
  id: QualityCheckId;
  reason: string;
}

/** A reviewer's reply → the checks it flagged. Unknown keys are ignored; a
 *  missing or malformed check counts as not flagged. Checks that cannot
 *  apply are dropped whatever the reviewer said. */
export function qualityFlags(reply: Record<string, unknown>, ctx: { format: string; hasEarlier: boolean }): QualityFlag[] {
  const out: QualityFlag[] = [];
  for (const c of QUALITY_CHECKS) {
    if (c.id === 'weak_options' && ctx.format !== 'mcq') continue;
    if (c.id === 'same_task' && !ctx.hasEarlier) continue;
    const r = reply?.[c.id];
    const o = (r && typeof r === 'object' ? r : { flag: r }) as { flag?: unknown; reason?: unknown };
    const flag = o.flag === true || (typeof o.flag === 'string' && /^(?:true|yes)$/i.test(o.flag.trim()));
    if (flag) out.push({ id: c.id, reason: typeof o.reason === 'string' ? o.reason.replace(/\s+/g, ' ').trim() : '' });
  }
  return out;
}

/** Checks where ONE reviewer's flag is enough unless the other explicitly
 *  clears it: the defects that reached the accepted set under the
 *  both-must-agree rule. */
export const STRICT_CHECKS: readonly QualityCheckId[] = ['gives_away', 'generic_task'];

/** Strict-check flags raised by exactly one of the two reviewers. */
export function contestedFlags(first: QualityFlag[], second: QualityFlag[]): Array<QualityFlag & { raisedBy: 'first' | 'second' }> {
  const one = (mine: QualityFlag[], theirs: QualityFlag[], raisedBy: 'first' | 'second') =>
    mine.filter((f) => STRICT_CHECKS.includes(f.id) && !theirs.some((t) => t.id === f.id)).map((f) => ({ ...f, raisedBy }));
  return [...one(first, second, 'first'), ...one(second, first, 'second')];
}

/** The other reviewer's answer to a contested flag clears it only when it
 *  explicitly disagrees AND says why. */
export function rebuttalClears(reply: Record<string, unknown>): boolean {
  const agree = reply?.agree;
  const disagrees = agree === false || (typeof agree === 'string' && /^(?:false|no)$/i.test(agree.trim()));
  return disagrees && typeof reply.reason === 'string' && reply.reason.trim().length > 0;
}

/**
 * Reply of the same-task grouping call → the questions to drop (1-based
 * numbers in, 0-based indices out): in every group of two or more, all but
 * its `best`. A malformed group is ignored; a question is dropped at most once.
 */
export function sameTaskLosers(reply: Record<string, unknown>, n: number): Array<{ drop: number; keep: number; reason: string }> {
  const out: Array<{ drop: number; keep: number; reason: string }> = [];
  const used = new Set<number>();
  for (const g of Array.isArray(reply?.groups) ? reply.groups : []) {
    const o = (g ?? {}) as { members?: unknown; best?: unknown; reason?: unknown };
    const members = [...new Set((Array.isArray(o.members) ? o.members : []).map(Number).filter((m) => Number.isInteger(m) && m >= 1 && m <= n))];
    if (members.length < 2 || members.some((m) => used.has(m))) continue;
    const best = members.includes(Number(o.best)) ? Number(o.best) : members[0];
    for (const m of members) {
      used.add(m);
      if (m !== best) out.push({ drop: m - 1, keep: best - 1, reason: typeof o.reason === 'string' ? o.reason.replace(/\s+/g, ' ').trim() : '' });
    }
  }
  return out;
}

/** A flag is CONFIRMED when the second reviewer raises the same check. */
export function confirmedFlags(first: QualityFlag[], second: QualityFlag[]): QualityFlag[] {
  return first.filter((f) => second.some((s) => s.id === f.id));
}
