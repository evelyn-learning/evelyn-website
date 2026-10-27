/**
 * "Add objectives" — pure core (no files, no database, no network).
 *
 * 45 stored lesson plans were expanded from a picker plan with teaching text
 * for the first five objectives only. This module validates the writers'
 * text for the remaining objectives and turns it into the data the generated
 * mongosh script applies: new `los` entries, four new segments per objective
 * inserted before `recap`, and the fields that repeat the objective list
 * (recap `mustRemember` / `teacherNote`, the intro goal, `estimatedMinutes`,
 * `metadata.pickedLoIds` / `allowedMaxLOs`).
 *
 * Design and evidence: …/integration/lesson-add-2026-10-12/design.md.
 */
import crypto from 'node:crypto';
import { containsAnswerVerbatim, markupStyleOf, recapTeacherNote, unbalancedMarkup, type LessonSegment } from './core';

export interface Objective {
  id: string;
  description: string;
  shortTitle: string;
}

export interface PracticeItemRef {
  question: string;
  answer: string;
  responseFormat?: string;
  source: string;
}

export interface MissingObjective extends Objective {
  /** 6, 7 or 8. */
  number: number;
  figureDependent: boolean;
  existingPracticeItems: PracticeItemRef[];
}

/** One writer input file (`packs/NNN.json`). */
export interface AddPack {
  pack: string;
  planId: string;
  pickerPack: string;
  pickerPlanId: string;
  subject: string;
  title: string;
  topic: string;
  grade: string;
  existingObjectives: Objective[];
  existingSegments: LessonSegment[];
  missingObjectives: MissingObjective[];
}

/** The stored fields this tooling reads before a write and changes. */
export interface PreState {
  planId: string;
  los: Objective[];
  segmentIds: string[];
  segmentKinds: string[];
  introGoal: string;
  recapMustRemember: string[];
  recapTeacherNote: string;
  estimatedMinutes: number;
  pickedLoIds: string[];
  allowedMaxLOs: number;
  availableLOs: Array<{ id: string; description: string }>;
  /** Fingerprint of the existing teaching text (see `textSha256`). */
  textSha256: string;
  /** The same per segment, in `segmentIds` order — lets the script name the
   *  segments whose stored text is not the expected text. */
  segmentTextSha256: string[];
}

export const SEGMENT_SUFFIXES = ['hook', 'concept', 'worked', 'try'] as const;
export const SEGMENT_KINDS = ['hook', 'concept', 'worked_example', 'try_yourself'] as const;

/** Teaching fields per kind, in stored order; `true` = array of strings. */
export const TEACHING_FIELDS: Readonly<Record<string, ReadonlyArray<readonly [string, boolean]>>> = {
  hook: [['goal', false]],
  concept: [['goal', false], ['keyIdeas', true]],
  worked_example: [['problem', false], ['steps', true], ['answer', false]],
  try_yourself: [['problem', false], ['expectedAnswer', false]],
};

/** Fields stored as a literal `null` after the teaching fields, per kind —
 *  the generator's plan round-trips through the parser and the driver writes
 *  `undefined` as `null`. Taken from the 10-06 dump (add-core.test.ts checks
 *  the built shape against every segment of the 45 stored plans). */
const TRAILING_NULLS: Readonly<Record<string, readonly string[]>> = {
  hook: ['script', 'suggestedTools'],
  concept: ['vocabulary', 'suggestedTools', 'references'],
  worked_example: [],
  try_yourself: ['hints', 'responseFormat', 'choices'],
};

/** A segment exactly as the collection holds one written by the generator:
 *  same keys, same key order, `null` where the generator left a field out. */
export function storedSegment(seg: LessonSegment): Record<string, unknown> {
  const fields = TEACHING_FIELDS[seg.kind];
  if (!fields) throw new Error(`no stored shape for segment kind ${seg.kind}`);
  const out: Record<string, unknown> = {
    id: seg.id,
    teacherNote: null,
    estimatedMinutes: null,
    prescribedRender: null,
    requiredPhrases: null,
    kind: seg.kind,
  };
  for (const [f, isArray] of fields) out[f] = isArray ? [...(seg[f] as string[])] : seg[f];
  for (const f of TRAILING_NULLS[seg.kind]) out[f] = null;
  return out;
}

/** The intro goal exactly as lesson-plan/expand.ts writes it. */
export function introGoal(n: number): string {
  return `Acknowledge the student's pick of ${n} learning objectives, list them in the planned order in 1 sentence, and propose starting with the first one. Stay brief — under 25 spoken words.`;
}

/** lesson-plan/session-budget.ts `minutesPerLOForGrade` gives 5 minutes per
 *  objective for every grade band these plans carry (9–12, AP). */
export const MINUTES_PER_ADDED_OBJECTIVE = 5;
export const FIVE_MINUTE_GRADES: ReadonlySet<string> = new Set(['9', '10', '11', '12', '9-10', '11-12', '9-12', 'ap']);

export function estimatedMinutesAfter(before: number, added: number): number {
  return before + MINUTES_PER_ADDED_OBJECTIVE * added;
}

const TEXT_FIELDS = ['goal', 'keyIdeas', 'problem', 'steps', 'answer', 'expectedAnswer'] as const;

function canonSegment(s: Record<string, unknown>): unknown[] {
  return [s.id, s.kind, ...TEXT_FIELDS.map((f) => (s[f] === undefined ? null : s[f]))];
}

/** Fingerprint of a plan's teaching text: every segment but `intro` and
 *  `recap` (those two are rewritten by the additions and guarded value by
 *  value). The generated script computes the same value from the stored
 *  segments (same canonical form). */
export function textSha256(segments: ReadonlyArray<Record<string, unknown>>): string {
  const teaching = segments.filter((s) => s.id !== 'intro' && s.id !== 'recap');
  return crypto.createHash('sha256').update(JSON.stringify(teaching.map(canonSegment)), 'utf8').digest('hex');
}

export function segmentTextSha256(segment: Record<string, unknown>): string {
  return crypto.createHash('sha256').update(JSON.stringify(canonSegment(segment)), 'utf8').digest('hex');
}

/* ------------------------------------------------------------------ */
/* Text comparison                                                     */
/* ------------------------------------------------------------------ */

export function normaliseStem(s: string): string {
  return s.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}

/** Share of distinct words two texts have in common (Jaccard), 0–1. */
export function stemSimilarity(a: string, b: string): number {
  const A = new Set(normaliseStem(a).split(' ').filter(Boolean));
  const B = new Set(normaliseStem(b).split(' ').filter(Boolean));
  if (A.size === 0 || B.size === 0) return 0;
  let both = 0;
  for (const w of A) if (B.has(w)) both += 1;
  return both / (A.size + B.size - both);
}

/** A number followed by a unit or a word and nothing else ("325 K",
 *  "48 meters", "120°", "45%"). The product grades a plain-number key by rule
 *  (portal/numeric-answer-rule.ts); a key with a unit goes to the model judge. */
export function isNumberWithUnit(answer: string): boolean {
  const a = answer.trim().replace(/\.$/, '');
  if (/^[-−+]?\d[\d,]*(?:\.\d+)?\s*(?:°|%)[A-Za-z]?$/.test(a)) return true;
  const m = /^[-−+]?\d[\d,]*(?:\.\d+)?(?:\s*[×x·*]\s*10\^?[-−⁻]?[\d⁰-⁹]+)?\s+(\S+(?:\s\S+)?)$/.exec(a);
  if (!m) return false;
  if (/\d|=/.test(m[1])) return false;
  return !/^(or|and|to|only|is|each|per)\b/i.test(m[1]);
}

/** Does the expected answer appear in the problem? A plain-number answer is
 *  compared with the problem's whole numbers ("600" is not in "1,600" or
 *  "0.600"); anything else is a verbatim whole-run match. */
export function answerInProblem(problem: string, answer: string): boolean {
  const a = answer.normalize('NFKC').trim();
  if (/^\d[\d.,]*$/.test(a)) {
    const numbers: string[] = problem.normalize('NFKC').match(/\d[\d.,]*\d|\d/g) ?? [];
    return numbers.includes(a.replace(/[.,]+$/, ''));
  }
  return containsAnswerVerbatim(problem, answer);
}

/* ------------------------------------------------------------------ */
/* Validation of one writer file                                       */
/* ------------------------------------------------------------------ */

export interface AddIssue {
  level: 'error' | 'warning';
  code: string;
  pack: string;
  loId?: string;
  segmentId?: string;
  field?: string;
  message: string;
}

export interface WrittenObjective {
  loId: string;
  segments: LessonSegment[];
  check: string;
}

export interface WrittenFile {
  pack: string;
  planId: string;
  pickerPlanId: string;
  objectives: WrittenObjective[];
}

/** Bounds measured over the 315 stored lessons with teaching text
 *  (packs/conventions.json): [minimum, maximum] seen, and the 5th–95th
 *  percentile band used for length warnings. */
export const BOUNDS = {
  keyIdeas: { min: 3, max: 4 },
  steps: { min: 2, max: 4 },
  chars: {
    'hook.goal': [30, 100],
    'concept.goal': [15, 110],
    'concept.keyIdeas': [10, 135],
    'worked_example.problem': [13, 245],
    'worked_example.steps': [5, 160],
    'worked_example.answer': [1, 110],
    'try_yourself.problem': [10, 185],
    'try_yourself.expectedAnswer': [1, 135],
  } as Readonly<Record<string, readonly [number, number]>>,
  /** Longest expected answer, in words, the spec allows. */
  expectedAnswerWords: 12,
} as const;

// eslint-disable-next-line no-control-regex
const CONTROL_RE = /[\u0000-\u001F\u007F-\u009F]/;
const INVISIBLE_RE = /[​-‏‪-‮⁠﻿�]/;
const DRAW_ONLY_RE = /^\s*(sketch|draw|graph|plot|label|shade)\b/i;
const NEEDS_FIGURE_RE = /\b(shown|pictured|in the (figure|diagram|graph|picture|image)|the (figure|diagram|graph) (above|below)|see the)\b/i;

function isPlain(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

export function validateWritten(raw: unknown, pack: AddPack): { issues: AddIssue[]; file: WrittenFile | null } {
  const issues: AddIssue[] = [];
  const add = (level: AddIssue['level'], code: string, message: string, at: Partial<AddIssue> = {}): void => {
    issues.push({ level, code, pack: pack.pack, message, ...at });
  };
  if (!isPlain(raw)) {
    add('error', 'file_shape', 'the file must be one JSON object');
    return { issues, file: null };
  }
  if (raw.pack !== pack.pack) add('error', 'wrong_pack', `"pack" is ${JSON.stringify(raw.pack)}, expected "${pack.pack}"`);
  if (raw.planId !== pack.planId) add('error', 'wrong_plan', `"planId" is ${JSON.stringify(raw.planId)}, expected "${pack.planId}"`);
  if (raw.pickerPlanId !== pack.pickerPlanId) add('error', 'wrong_plan', `"pickerPlanId" is ${JSON.stringify(raw.pickerPlanId)}, expected "${pack.pickerPlanId}"`);
  if (!Array.isArray(raw.objectives)) {
    add('error', 'file_shape', '"objectives" must be an array');
    return { issues, file: null };
  }
  const wantIds = pack.missingObjectives.map((o) => o.id);
  const gotIds = raw.objectives.map((o) => (isPlain(o) ? String(o.loId) : '?'));
  if (JSON.stringify(gotIds) !== JSON.stringify(wantIds)) {
    add('error', 'objective_list', `objectives must be exactly ${wantIds.map((i) => i.slice(-4)).join(', ')} in this order; got ${gotIds.map((i) => i.slice(-4)).join(', ') || 'none'}`);
    return { issues, file: null };
  }

  const existingText = JSON.stringify(pack.existingSegments);
  const existingStyles = markupStyleOf(existingText);
  const existingProblems = pack.existingSegments
    .filter((s) => typeof s.problem === 'string')
    .map((s) => ({ id: s.id, text: s.problem as string }));
  const seenProblems: Array<{ id: string; text: string }> = [];
  const objectives: WrittenObjective[] = [];

  raw.objectives.forEach((o, oi) => {
    const want = pack.missingObjectives[oi];
    const at = { loId: want.id };
    if (!isPlain(o)) return;
    if (typeof o.check !== 'string' || o.check.trim().length < 10) {
      add('error', 'no_check', '"check" must say how every number and fact in this objective was recomputed or verified', at);
    }
    for (const k of Object.keys(o)) if (!['loId', 'segments', 'check', 'notes'].includes(k)) add('error', 'extra_field', `unexpected field "${k}" on the objective`, at);
    if (!Array.isArray(o.segments) || o.segments.length !== 4) {
      add('error', 'segment_list', 'each objective needs exactly four segments: hook, concept, worked_example, try_yourself', at);
      return;
    }
    const segs: LessonSegment[] = [];
    o.segments.forEach((s, si) => {
      const id = `${want.id}-${SEGMENT_SUFFIXES[si]}`;
      const kind = SEGMENT_KINDS[si];
      const sAt = { ...at, segmentId: id };
      if (!isPlain(s)) { add('error', 'segment_shape', 'segment is not an object', sAt); return; }
      if (s.id !== id) add('error', 'segment_id', `segment ${si + 1} must have id "${id}", got ${JSON.stringify(s.id)}`, sAt);
      if (s.kind !== kind) add('error', 'segment_kind', `segment ${si + 1} must have kind "${kind}", got ${JSON.stringify(s.kind)}`, sAt);
      const allowed = ['id', 'kind', ...TEACHING_FIELDS[kind].map(([f]) => f)];
      for (const k of Object.keys(s)) if (!allowed.includes(k)) add('error', 'extra_field', `field "${k}" is not written for a ${kind} segment (the stored value is null)`, sAt);
      let ok = s.id === id && s.kind === kind;
      for (const [f, isArray] of TEACHING_FIELDS[kind]) {
        const v = s[f];
        const fAt = { ...sAt, field: f };
        const texts: string[] = [];
        if (isArray) {
          if (!Array.isArray(v) || v.length === 0 || v.some((x) => typeof x !== 'string')) { add('error', 'empty_field', `"${f}" must be a non-empty array of strings`, fAt); ok = false; continue; }
          texts.push(...(v as string[]));
          const b = f === 'keyIdeas' ? BOUNDS.keyIdeas : BOUNDS.steps;
          if (v.length < b.min || v.length > b.max) add('error', 'count', `"${f}" has ${v.length} entries; the stored lessons have ${b.min}–${b.max}`, fAt);
          if (new Set(texts.map(normaliseStem)).size !== texts.length) add('error', 'duplicate_entry', `"${f}" repeats an entry`, fAt);
        } else {
          if (typeof v !== 'string') { add('error', 'empty_field', `"${f}" must be a string`, fAt); ok = false; continue; }
          texts.push(v);
        }
        const [lo, hi] = BOUNDS.chars[`${kind}.${f}`];
        for (const t of texts) {
          if (t.trim().length === 0) { add('error', 'empty_field', `"${f}" has an empty string`, fAt); ok = false; continue; }
          if (t !== t.trim()) add('error', 'edge_space', `"${f}" has leading or trailing white space`, fAt);
          if (CONTROL_RE.test(t)) add('error', 'control_char', `"${f}" contains a line break, tab or control character (stored text has none)`, fAt);
          if (INVISIBLE_RE.test(t)) add('error', 'invisible_char', `"${f}" contains an invisible or replacement character`, fAt);
          if (/ {2,}/.test(t)) add('warning', 'double_space', `"${f}" has a double space`, fAt);
          const bal = unbalancedMarkup(t);
          if (bal.hard.length) add('error', 'unbalanced_markup', `"${f}" has unbalanced ${bal.hard.join(', ')}`, fAt);
          if (bal.soft.length) add('warning', 'unbalanced_brackets', `"${f}" has unbalanced ${bal.soft.join(', ')} (fine for a half-open interval or a currency sign — check)`, fAt);
          const style = markupStyleOf(t).filter((m) => !existingStyles.includes(m));
          const hardStyle = style.filter((m) => m !== '$…$');
          if (hardStyle.length) add('error', 'markup', `"${f}" uses ${hardStyle.join(', ')}; the stored text is plain text with Unicode symbols`, fAt);
          else if (style.length) add('warning', 'dollar_pair', `"${f}" has two $ signs — fine for money, never for maths markup`, fAt);
          if (t.length < lo || t.length > hi) add('warning', 'length', `"${f}" is ${t.length} characters; stored lessons range ${lo}–${hi}`, fAt);
        }
      }
      if (ok) segs.push(s as LessonSegment);
    });
    if (segs.length !== 4) return;
    const [, , worked, tri] = segs;
    const wp = worked.problem as string;
    const tp = tri.problem as string;
    const ea = tri.expectedAnswer as string;
    const tAt = { ...at, segmentId: tri.id };
    if (answerInProblem(tp, ea)) add('error', 'answer_in_problem', `the expected answer ${JSON.stringify(ea)} appears in its own problem`, { ...tAt, field: 'expectedAnswer' });
    if (isNumberWithUnit(ea)) add('error', 'numeric_answer_has_unit', `expected answer ${JSON.stringify(ea)} is a number with a unit: name the unit in the problem and give the bare number`, { ...tAt, field: 'expectedAnswer' });
    if (ea.trim().split(/\s+/).length > BOUNDS.expectedAnswerWords) add('error', 'long_answer', `expected answer has more than ${BOUNDS.expectedAnswerWords} words — ask a question with a short, single answer`, { ...tAt, field: 'expectedAnswer' });
    if (/\b(e\.g\.|for example|such as|answers? (may|will) vary|any (one|two|of))\b/i.test(ea)) add('error', 'open_answer', 'expected answer is open-ended; the key must be the one accepted answer', { ...tAt, field: 'expectedAnswer' });
    if (DRAW_ONLY_RE.test(tp)) add('error', 'drawing_task', 'a try_yourself that asks only for a drawing or graph has no typed answer', { ...tAt, field: 'problem' });
    for (const s of [worked, tri]) {
      if (NEEDS_FIGURE_RE.test(s.problem as string)) add('error', 'needs_figure', 'the problem refers to a figure; lesson text has no figures — describe the situation in words', { ...at, segmentId: s.id, field: 'problem' });
    }
    if (normaliseStem(wp) === normaliseStem(tp)) add('error', 'try_equals_worked', 'the try_yourself problem is the worked example', tAt);
    else if (stemSimilarity(wp, tp) >= 0.9) add('warning', 'try_like_worked', `the try_yourself is ${Math.round(stemSimilarity(wp, tp) * 100)}% the same words as the worked example — it must be a different problem, not the same one again`, tAt);
    if (normaliseStem(worked.answer as string) === normaliseStem(ea) && normaliseStem(ea).length > 0 && /\d/.test(ea)) add('warning', 'same_answer', 'the try_yourself has the same answer as the worked example', tAt);
    for (const item of want.existingPracticeItems) {
      if (normaliseStem(item.question) === normaliseStem(tp)) add('error', 'try_equals_practice_item', `the try_yourself repeats an existing practice item: ${JSON.stringify(item.question.slice(0, 90))}`, tAt);
      else if (stemSimilarity(item.question, tp) >= 0.8) add('warning', 'try_like_practice_item', `the try_yourself is ${Math.round(stemSimilarity(item.question, tp) * 100)}% the same words as an existing practice item: ${JSON.stringify(item.question.slice(0, 90))}`, tAt);
    }
    for (const p of [{ id: worked.id, text: wp }, { id: tri.id, text: tp }]) {
      const dupe = [...existingProblems, ...seenProblems].find((e) => e.id !== worked.id && normaliseStem(e.text) === normaliseStem(p.text));
      if (dupe) add('error', 'repeats_lesson_problem', `the problem repeats ${dupe.id.slice(-10)} of this lesson`, { ...at, segmentId: p.id });
      seenProblems.push(p);
    }
    objectives.push({ loId: want.id, segments: segs, check: String(o.check ?? '') });
  });

  const errors = issues.some((i) => i.level === 'error');
  return {
    issues,
    file: errors || objectives.length !== wantIds.length ? null : { pack: pack.pack, planId: pack.planId, pickerPlanId: pack.pickerPlanId, objectives },
  };
}

/* ------------------------------------------------------------------ */
/* Apply data                                                          */
/* ------------------------------------------------------------------ */

export interface AddPlanData {
  pack: string;
  planId: string;
  pickerPlanId: string;
  subject: string;
  pre: PreState;
  add: { los: Objective[]; segments: Array<Record<string, unknown>> };
  post: { introGoal: string; recapTeacherNote: string; estimatedMinutes: number; allowedMaxLOs: number };
}

export interface AddData {
  formatVersion: 1;
  kind: 'lesson-additions';
  database: 'evelyn';
  collection: 'lessonplans';
  /** What must have been applied before this data (printed on a mismatch). */
  requires: string;
  counts: { plans: number; objectives: number; segments: number };
  plans: AddPlanData[];
}

/** One plan's entry. Throws when the pack, the stored pre-state and the
 *  writer's file do not describe the same plan — never guessed around. */
export function buildPlanData(pack: AddPack, pre: PreState, file: WrittenFile): AddPlanData {
  const fail = (m: string): never => { throw new Error(`pack ${pack.pack}: ${m}`); };
  if (pre.planId !== pack.planId || file.planId !== pack.planId) fail('plan ids differ between pack, stored state and written file');
  if (JSON.stringify(pre.los) !== JSON.stringify(pack.existingObjectives)) fail('the pack\'s existing objectives are not the stored objectives');
  if (pre.textSha256 !== textSha256(pack.existingSegments)) fail('the pack\'s existing segments are not the stored (corrected) text');
  const n0 = pre.los.length;
  const last = pre.segmentIds.length - 1;
  if (pre.segmentIds[0] !== 'intro' || pre.segmentIds[last] !== 'recap') fail('stored plan does not start with intro and end with recap');
  if (pre.introGoal !== introGoal(n0)) fail('stored intro goal is not the generator\'s text');
  if (pre.recapTeacherNote !== recapTeacherNote(pre.los.map((l) => l.description))) fail('stored recap note is not the generator\'s formula');
  if (JSON.stringify(pre.recapMustRemember) !== JSON.stringify(pre.los.map((l) => l.description))) fail('stored recap mustRemember is not the objective descriptions');
  if (JSON.stringify(pre.pickedLoIds) !== JSON.stringify(pre.los.map((l) => l.id))) fail('metadata.pickedLoIds is not the objective ids');
  if (pre.allowedMaxLOs !== n0) fail('metadata.allowedMaxLOs is not the objective count');
  if (!FIVE_MINUTE_GRADES.has(pack.grade.toLowerCase())) fail(`grade "${pack.grade}" is not a 5-minutes-per-objective band`);
  const addLos: Objective[] = pack.missingObjectives.map((o) => ({ id: o.id, description: o.description, shortTitle: o.shortTitle }));
  addLos.forEach((lo, i) => {
    if (lo.id !== `${pack.pickerPlanId}.lo-${n0 + i + 1}`) fail(`missing objective ${i + 1} has id ${lo.id}`);
    const avail = pre.availableLOs[n0 + i];
    if (!avail || avail.id !== lo.id || avail.description !== lo.description) fail(`${lo.id} is not entry ${n0 + i + 1} of the stored metadata.availableLOs`);
  });
  if (pre.availableLOs.length !== n0 + addLos.length) fail('the stored plan lists a different number of available objectives');
  const allDescriptions = [...pre.los, ...addLos].map((l) => l.description);
  if (new Set(allDescriptions).size !== allDescriptions.length) fail('two objectives share one description (the revert removes recap entries by value)');
  if (JSON.stringify(file.objectives.map((o) => o.loId)) !== JSON.stringify(addLos.map((l) => l.id))) fail('written objectives are not the missing objectives');
  const segments = file.objectives.flatMap((o) => o.segments.map(storedSegment));
  const ids = segments.map((s) => s.id as string);
  if (new Set([...pre.segmentIds, ...ids]).size !== pre.segmentIds.length + ids.length) fail('a new segment id already exists in the plan');
  return {
    pack: pack.pack,
    planId: pack.planId,
    pickerPlanId: pack.pickerPlanId,
    subject: pack.subject,
    pre,
    add: { los: addLos, segments },
    post: {
      introGoal: introGoal(n0 + addLos.length),
      recapTeacherNote: recapTeacherNote(allDescriptions),
      estimatedMinutes: estimatedMinutesAfter(pre.estimatedMinutes, addLos.length),
      allowedMaxLOs: n0 + addLos.length,
    },
  };
}

export function buildAddData(plans: readonly AddPlanData[], requires: string): AddData {
  const sorted = [...plans].sort((a, b) => a.pack.localeCompare(b.pack));
  return {
    formatVersion: 1,
    kind: 'lesson-additions',
    database: 'evelyn',
    collection: 'lessonplans',
    requires,
    counts: {
      plans: sorted.length,
      objectives: sorted.reduce((a, p) => a + p.add.los.length, 0),
      segments: sorted.reduce((a, p) => a + p.add.segments.length, 0),
    },
    plans: sorted,
  };
}

/** The pre-state of one stored document (as dumped, corrections applied). */
export function preStateOf(doc: Record<string, unknown>): PreState {
  const segs = doc.segments as Array<Record<string, unknown>>;
  const meta = doc.metadata as Record<string, unknown>;
  const recap = segs[segs.length - 1];
  return {
    planId: doc._id as string,
    los: (doc.los as Objective[]).map((l) => ({ id: l.id, description: l.description, shortTitle: l.shortTitle })),
    segmentIds: segs.map((s) => s.id as string),
    segmentKinds: segs.map((s) => s.kind as string),
    introGoal: segs[0].goal as string,
    recapMustRemember: [...(recap.mustRemember as string[])],
    recapTeacherNote: recap.teacherNote as string,
    estimatedMinutes: doc.estimatedMinutes as number,
    pickedLoIds: [...(meta.pickedLoIds as string[])],
    allowedMaxLOs: meta.allowedMaxLOs as number,
    availableLOs: (meta.availableLOs as Array<{ id: string; description: string }>).map((a) => ({ id: a.id, description: a.description })),
    textSha256: textSha256(segs),
    segmentTextSha256: segs.map(segmentTextSha256),
  };
}

/** The stored document after the additions — the independent expectation the
 *  generated script's writes are compared against in the simulation. */
export function expectedAfter(doc: Record<string, unknown>, plan: AddPlanData): Record<string, unknown> {
  const out = JSON.parse(JSON.stringify(doc)) as Record<string, unknown>;
  const segs = out.segments as Array<Record<string, unknown>>;
  const recap = segs[segs.length - 1];
  (out.los as Objective[]).push(...plan.add.los.map((l) => ({ ...l })));
  segs[0].goal = plan.post.introGoal;
  (recap.mustRemember as string[]).push(...plan.add.los.map((l) => l.description));
  recap.teacherNote = plan.post.recapTeacherNote;
  segs.splice(segs.length - 1, 0, ...(JSON.parse(JSON.stringify(plan.add.segments)) as Array<Record<string, unknown>>));
  out.estimatedMinutes = plan.post.estimatedMinutes;
  const meta = out.metadata as Record<string, unknown>;
  (meta.pickedLoIds as string[]).push(...plan.add.los.map((l) => l.id));
  meta.allowedMaxLOs = plan.post.allowedMaxLOs;
  meta.addedLoIds = plan.add.los.map((l) => l.id);
  return out;
}
