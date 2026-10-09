/**
 * Tests for scripts/practice-extend/core.ts (pure — no network, no DB).
 * Run from apps/tutor:  npx tsx scripts/practice-extend/core.test.ts
 */
import assert from 'node:assert/strict';
import {
  Budget,
  chunkTargets,
  planEmptyTargets,
  QUALITY_CHECKS,
  confirmedFlags,
  contestedFlags,
  rebuttalClears,
  sameTaskLosers,
  shortfallOf,
  contentDefects,
  optionsEquivalent,
  qualityFlags,
  repeatedTaskTypes,
  taskTypeKey,
  BudgetExceeded,
  comparableOf,
  compareWithRules,
  costUsd,
  decide,
  itemIdOf,
  nearDuplicateOf,
  pickSample,
  planSkillTargets,
  planTargets,
  referencesFigure,
  simpleHash,
  trimToRequested,
  validateGeneration,
  validateItem,
  worstCaseUsd,
  type CoverageSkill,
  type GeneratedItem,
  type SolverOutcome,
} from './core';
import { parseJsonLoose } from './models';

let n = 0;
function t(name: string, fn: () => void) {
  try {
    fn();
    n++;
  } catch (e) {
    console.error(`FAIL  ${name}`);
    throw e;
  }
}

const skill = (id: string, servable: number[]): CoverageSkill => ({
  skillLoId: `${id}.lo-1`,
  planId: id,
  title: id,
  objectives: servable.map((s, i) => ({ loId: `${id}.lo-${i + 1}`, description: `objective ${i + 1}`, servable: s })),
});
const P = { minPerObjective: 2, minPerSkill: 8 };
const ns = (id: string, servable: number[], p = P) => {
  const targets = planSkillTargets(skill(id, servable), p);
  return servable.map((_, i) => targets.find((x) => x.objectiveLoId === `${id}.lo-${i + 1}`)?.n ?? 0);
};

// ── target planning ─────────────────────────────────────────────────────────

t('objective shortfall only, when the skill then reaches its minimum', () => {
  assert.deepEqual(ns('a', [6, 0, 1, 2]), [0, 2, 1, 0]); // 9 + 3 = 12 ≥ 8
});
t('top-up goes to the objectives with the fewest, in order', () => {
  // shortfall → [2,2,2] = 6; two more, one at a time, to the lowest (ties: first)
  assert.deepEqual(ns('a', [0, 0, 0]), [3, 3, 2]);
  // [3,1,0] → shortfall [0,1,2] → have+n = [3,2,2] = 7 → one more to lo-2
  assert.deepEqual(ns('a', [3, 1, 0]), [0, 2, 2]);
});
t('top-up prefers the emptier objective even when none is short', () => {
  assert.deepEqual(ns('a', [3, 2]), [1, 2]); // 5 → 8: lo-2, lo-1, lo-2
});
t('nothing requested when both minimums are met; such skills produce no target', () => {
  assert.deepEqual(ns('a', [4, 4]), [0, 0]);
  assert.equal(planTargets([skill('a', [4, 4])], P).length, 0);
});
t('targets carry what the objective has and omit objectives with n = 0', () => {
  const tg = planSkillTargets(skill('a', [6, 0, 5]), P);
  assert.deepEqual(tg, [{ skillLoId: 'a.lo-1', planId: 'a', objectiveLoId: 'a.lo-2', have: 0, n: 2 }]);
});
t('parameters are honoured; totals add up across skills', () => {
  assert.deepEqual(ns('a', [0, 1], { minPerObjective: 1, minPerSkill: 0 }), [1, 0]);
  assert.deepEqual(ns('a', [0, 0], { minPerObjective: 0, minPerSkill: 3 }), [2, 1]);
  const all = planTargets([skill('a', [0, 0, 0]), skill('b', [9, 0])], P);
  assert.equal(all.reduce((s, x) => s + x.n, 0), 8 + 2);
});
t('a skill with no objectives yields nothing (and does not loop)', () => {
  assert.deepEqual(planSkillTargets(skill('a', []), P), []);
});

t('excluded objectives are never requested or topped up, but what they have still counts', () => {
  const sk = skill('a', [0, 0, 3]);
  const tg = planSkillTargets(sk, P, new Set(['a.lo-1']));
  assert.deepEqual(tg.map((x) => [x.objectiveLoId, x.n]), [['a.lo-2', 4], ['a.lo-3', 1]]); // lo-1 gets nothing; 0+4+4 = 8
  assert.deepEqual(planSkillTargets(skill('a', [0, 0]), P, new Set(['a.lo-1', 'a.lo-2'])), []); // nothing open: no loop
  assert.deepEqual(planSkillTargets(skill('a', [1, 0, 6]), P, new Set(['a.lo-2'])).map((x) => [x.objectiveLoId, x.n]), [['a.lo-1', 1]]);
});

t('coverage mode: only empty, non-excluded objectives, a fixed number each, no minimums', () => {
  const tg = planEmptyTargets([skill('a', [0, 1, 0]), skill('b', [5, 0]), skill('c', [2, 3])], 3, new Set(['a.lo-3']));
  assert.deepEqual(tg.map((x) => [x.objectiveLoId, x.have, x.n]), [['a.lo-1', 0, 3], ['b.lo-2', 0, 3]]);
  assert.deepEqual(planEmptyTargets([skill('a', [1, 1])], 3), []);
});
t('a skill request is split into calls of at most N questions, objectives kept whole', () => {
  const tg = [3, 3, 3, 3, 3].map((n, i) => ({ id: i, n }));
  assert.deepEqual(chunkTargets(tg, 6).map((c) => c.map((x) => x.id)), [[0, 1], [2, 3], [4]]);
  assert.deepEqual(chunkTargets([{ n: 2 }, { n: 5 }, { n: 1 }], 6).map((c) => c.length), [1, 2]);
  assert.deepEqual(chunkTargets([{ n: 9 }, { n: 1 }], 6).map((c) => c.length), [1, 1]); // an oversize objective gets its own call
  assert.deepEqual(chunkTargets([], 6), []);
});

// ── sample ──────────────────────────────────────────────────────────────────

t('sample spreads evenly, prefers skills with an empty objective, is reproducible', () => {
  const cands = ['Bio', 'Chem', 'Phys'].flatMap((subject) =>
    [0, 1, 2, 3].map((i) => ({ skillLoId: `${subject}-${i}`, subject, zeroObjectives: i === 3 ? 2 : 0, descriptionOnly: false })),
  );
  const got = pickSample(cands, 6);
  assert.equal(got.length, 6);
  for (const s of ['Bio', 'Chem', 'Phys']) {
    assert.equal(got.filter((g) => g.startsWith(s)).length, 2);
    assert.ok(got.includes(`${s}-3`)); // the one with empty objectives
  }
  assert.deepEqual(pickSample(cands, 6), got);
  assert.equal(pickSample(cands, 4).length, 4); // remainder handled
  assert.deepEqual(pickSample([], 5), []);
});
t('sample includes exactly one description-only skill when there is one', () => {
  const cands = ['Bio', 'Chem'].flatMap((subject) =>
    [0, 1, 2, 3].map((i) => ({ skillLoId: `${subject}-${i}`, subject, zeroObjectives: 1, descriptionOnly: i >= 2 })),
  );
  const got = pickSample(cands, 4);
  assert.equal(got.length, 4);
  assert.equal(got.filter((g) => /-[23]$/.test(g)).length, 1);
});

// ── output validation ───────────────────────────────────────────────────────

const LOS = ['p.lo-1', 'p.lo-2', 'p.lo-3'];
const mcq = (over: Record<string, unknown> = {}) => ({
  objectiveLoId: 'p.lo-2',
  responseFormat: 'mcq',
  problemText: 'Which of the four statements below is the true one?',
  answer: 'C',
  choices: ['first statement', 'second statement', 'third statement', 'fourth statement'],
  hints: ['Test each statement.'],
  solutionText: 'Only the third holds.',
  difficulty: 2,
  covers: 'telling a true statement from false ones',
  taskType: 'pick the true statement',
  distractorRationales: ['misreads the first', 'misreads the second', 'misreads the third', 'misreads the fourth'],
  ...over,
});
const numeric = (over: Record<string, unknown> = {}) =>
  mcq({ responseFormat: 'numeric', problemText: 'A quantity doubles from 7. What is its new value?', answer: '14', choices: [], ...over });
const free = (over: Record<string, unknown> = {}) =>
  mcq({ responseFormat: 'free', problemText: 'Name the term for the quantity described here.', answer: 'osmosis', choices: [], ...over });
const errs = (raw: unknown) => validateItem(raw, LOS).errors.join(' | ');

t('valid items of each format pass and are normalised', () => {
  assert.deepEqual(validateItem(mcq(), LOS).errors, []);
  assert.deepEqual(validateItem(numeric(), LOS).errors, []);
  assert.deepEqual(validateItem(free(), LOS).errors, []);
  assert.deepEqual(validateItem(numeric({ answer: '13/3' }), LOS).errors, []);
  assert.deepEqual(validateItem(numeric({ answer: '−2.50' }), LOS).errors, []);
  // answer given as the option text → stored as its letter; "A) " prefixes dropped
  assert.equal(validateItem(mcq({ answer: 'third statement' }), LOS).item?.answer, 'C');
  assert.equal(validateItem(mcq({ answer: 'c' }), LOS).item?.answer, 'C');
  assert.deepEqual(validateItem(mcq({ choices: ['A) one', 'B) two', 'C) three', 'D) four'] }), LOS).item?.choices, ['one', 'two', 'three', 'four']);
});
t('objective must belong to the skill', () => {
  assert.match(errs(mcq({ objectiveLoId: 'other.lo-1' })), /not an objective of this skill/);
  assert.match(errs(mcq({ objectiveLoId: undefined })), /not an objective of this skill/);
});
t('multiple choice: exactly four different options and one resolvable answer', () => {
  assert.match(errs(mcq({ choices: ['a', 'b', 'c'] })), /exactly 4 choices/);
  assert.match(errs(mcq({ choices: ['a', 'b', 'c', 'd', 'e'] })), /exactly 4 choices/);
  assert.match(errs(mcq({ choices: ['a', 'b', 'c', 'C'] })), /not all different/);
  assert.match(errs(mcq({ choices: ['a', 'b', '', 'd'] })), /empty choice/);
  assert.match(errs(mcq({ answer: 'E' })), /letter \(A–D\)/);
  assert.match(errs(mcq({ answer: 'some other text' })), /letter \(A–D\)/);
});
t('numeric: one plain number, no units, no choices', () => {
  assert.match(errs(numeric({ answer: '14 m' })), /one plain number/);
  assert.match(errs(numeric({ answer: 'x = 14' })), /one plain number/);
  assert.match(errs(numeric({ answer: '50%' })), /one plain number/);
  assert.match(errs(numeric({ answer: '3 and 4' })), /one plain number/);
  assert.match(errs(numeric({ choices: ['1', '2', '3', '4'] })), /must not carry choices/);
});
t('free: short, no choices', () => {
  assert.match(errs(free({ answer: 'x'.repeat(300) })), /no essays/);
  assert.match(errs(free({ choices: ['a'] })), /must not carry choices/);
  assert.match(errs(free({ answer: '  ' })), /answer is empty/);
});
t('format, hints, difficulty, covers, solution and stem rules', () => {
  assert.match(errs(mcq({ responseFormat: 'frq' })), /not mcq \| numeric \| free/);
  assert.match(errs(mcq({ hints: [] })), /hints must be 1 or 2/);
  assert.match(errs(mcq({ hints: ['a', 'b', 'c'] })), /hints must be 1 or 2/);
  assert.match(errs(mcq({ difficulty: 5 })), /difficulty/);
  assert.match(errs(mcq({ difficulty: 2.5 })), /difficulty/);
  assert.match(errs(mcq({ covers: '' })), /covers note is empty/);
  assert.match(errs(mcq({ solutionText: '' })), /solutionText is empty/);
  assert.match(errs(mcq({ problemText: 'Too short' })), /too short/);
  assert.match(errs(mcq({ problemText: 'Evaluate $x^2 + 1 when the variable equals three.' })), /unclosed \$/);
  assert.match(errs(mcq({ problemText: 'Using the diagram below, name the labelled part.' })), /figure/);
});
t('figure references are caught; talking ABOUT a graph or diagram is not', () => {
  for (const s of [
    'Use the graph shown to find the slope.',
    'The figure below shows a circuit.',
    'As shown, the block slides down the ramp.',
    'Refer to the diagram and name part X.',
    'In Figure 2, which curve is steeper?',
    'The cell pictured below is in which phase?',
  ]) assert.equal(referencesFigure(s), true, s);
  for (const s of [
    'The graph of $y = x^2$ is shifted up 3 units. What is its new equation?',
    'Which forces appear in a free-body diagram of a book at rest on a table?',
    'A table has four legs; how many legs do three tables have?',
    'A student draws a graph of speed against time; what does its slope represent?',
  ]) assert.equal(referencesFigure(s), false, s);
});

const CTX = { skillObjectiveIds: LOS, requested: { 'p.lo-2': 2, 'p.lo-3': 1 } };
const second = mcq({ problemText: 'Which of these four other statements is the false one?', taskType: 'pick the false statement' });
const third = numeric({ objectiveLoId: 'p.lo-3' });

t('a complete, clean reply is ok', () => {
  const v = validateGeneration({ items: [mcq(), second, third], needsFigure: [] }, CTX);
  assert.equal(v.ok, true, v.errors.join(' | '));
  assert.equal(v.items.length, 3);
});
t('a needs-a-figure marker stands in for an objective’s items', () => {
  const v = validateGeneration({ items: [mcq(), second], needsFigure: [{ objectiveLoId: 'p.lo-3', needsFigure: true, reason: 'needs a labelled picture' }] }, CTX);
  assert.equal(v.ok, true, v.errors.join(' | '));
  assert.deepEqual(v.needsFigure, [{ objectiveLoId: 'p.lo-3', reason: 'needs a labelled picture' }]);
  // both items and a marker for one objective is a defect
  const both = validateGeneration({ items: [mcq(), second, third], needsFigure: [{ objectiveLoId: 'p.lo-3', needsFigure: true, reason: 'r' }] }, CTX);
  assert.equal(both.ok, false);
  // needsFigure: false is not a marker
  assert.equal(validateGeneration({ items: [mcq(), second, third], needsFigure: [{ objectiveLoId: 'p.lo-3', needsFigure: false, reason: '' }] }, CTX).ok, true);
});
t('wrong counts, unrequested objectives, repeats and bad items make the reply not ok — valid items are still returned', () => {
  assert.match(validateGeneration({ items: [mcq(), third], needsFigure: [] }, CTX).errors.join(' '), /2 item\(s\) requested, 1 valid/);
  assert.match(validateGeneration({ items: [mcq(), second, third, mcq({ objectiveLoId: 'p.lo-1', problemText: 'A further question that nobody asked for?' })], needsFigure: [] }, CTX).errors.join(' '), /was not requested/);
  assert.match(validateGeneration({ items: [mcq(), mcq(), third], needsFigure: [] }, CTX).errors.join(' '), /same problemText/);
  const bad = validateGeneration({ items: [mcq(), mcq({ problemText: 'Which other statement is the true one here?', choices: ['a'] }), third], needsFigure: [] }, CTX);
  assert.equal(bad.ok, false);
  assert.equal(bad.items.length, 2);
  assert.match(bad.errors[0], /^item 2: /);
  assert.equal(validateGeneration({}, CTX).ok, false);
  assert.equal(validateGeneration(null, CTX).ok, false);
  assert.match(validateGeneration({ items: [mcq(), second, third], needsFigure: [{ objectiveLoId: 'p.lo-1', needsFigure: true, reason: '' }] }, CTX).errors.join(' '), /not a requested objective/);
});
t('salvage keeps at most the requested number and nothing for a flagged objective', () => {
  const v = validateGeneration({ items: [mcq(), second, mcq({ problemText: 'A third question on the same objective, extra?', taskType: 'a third kind' }), third], needsFigure: [] }, CTX);
  assert.equal(trimToRequested(v.items, [], CTX.requested).length, 3);
  assert.equal(trimToRequested(v.items, [{ objectiveLoId: 'p.lo-3', reason: '' }], CTX.requested).length, 2);
});

// ── deterministic content checks ────────────────────────────────────────────

const item = (raw: Record<string, unknown>): GeneratedItem => {
  const v = validateItem(raw, LOS);
  assert.deepEqual(v.errors, [], v.errors.join(' | '));
  return v.item!;
};
const defects = (raw: Record<string, unknown>) => contentDefects(item(raw)).join(' | ');

t('clean items have no content defect', () => {
  assert.equal(defects(mcq()), '');
  assert.equal(defects(numeric()), '');
  assert.equal(defects(free()), '');
  assert.equal(defects(free({ answer: '12 m/s' })), '');
});
t('multiple choice: equivalent options, option = key + text, all/none of the above', () => {
  assert.match(defects(mcq({ choices: ['0.5', '2', '1/2', '4'], answer: 'B' })), /options A and C are equivalent/);
  assert.match(defects(mcq({ choices: ['x = 4', '3', 'x=4.0', '5'], answer: 'B' })), /options A and C are equivalent/);
  assert.match(defects(mcq({ choices: ['it rises', 'it falls', 'it falls and then levels off', 'no change'], answer: 'B' })), /option C is the correct option with text added/);
  assert.match(defects(mcq({ choices: ['one', 'two', 'three', 'None of the above'] })), /all \/ none of the above/);
  assert.match(defects(mcq({ choices: ['one', 'two', 'three', 'Both A and B'] })), /all \/ none of the above/);
  // expressions and bare numbers may contain one another without being a give-away
  assert.equal(defects(mcq({ choices: ['2x', '2x + 3', 'x + 3', '3x'], answer: 'A' })), '');
  assert.equal(defects(mcq({ choices: ['12', '-12', '1.2', '120'], answer: 'A' })), '');
  assert.equal(optionsEquivalent('3/4', '0.75'), true);
  assert.equal(optionsEquivalent('2.55', '2.56'), false);
});
t('short answers: at most twelve words and no justification in the key', () => {
  assert.match(defects(free({ answer: 'one two three four five six seven eight nine ten eleven twelve thirteen' })), /longer than 12 words/);
  assert.match(defects(free({ answer: 'the second one because it is larger' })), /justification/);
  assert.match(defects(free({ answer: 'x = \\frac{1}{2}' })), /LaTeX/);
});
t('the question must not contain the answer, offer an example or a hint', () => {
  assert.match(defects(free({ problemText: 'Is the process described here osmosis or diffusion?', answer: 'osmosis' })), /contains the answer/);
  assert.match(defects(mcq({ problemText: 'The third statement is odd. Which statement is the true one?' })), /contains the answer/);
  assert.match(defects(numeric({ problemText: 'Give the value as a decimal (e.g. 0.5) for the quantity at 7.' })), /example or a hint/);
  // a bare number or symbol appearing in the stem is not a give-away
  assert.equal(defects(numeric({ problemText: 'A quantity doubles from 7 to 14 and doubles again. What is it?', answer: '14' })), '');
  assert.equal(defects(free({ problemText: 'Of the quantities x and y defined here, which is larger?', answer: 'x' })), '');
});
t('bare $ delimiters in answers and options are repaired', () => {
  assert.equal(item(free({ answer: '$x = 2$' })).answer, 'x = 2');
  assert.deepEqual(item(mcq({ choices: ['$1$', '$2$', '$3$', '$4$'] })).choices, ['1', '2', '3', '4']);
});
t('task types must differ within an objective', () => {
  assert.equal(taskTypeKey('Solving for time'), taskTypeKey('solve for  times'));
  assert.notEqual(taskTypeKey('solve for time'), taskTypeKey('solve for height'));
  assert.deepEqual(
    repeatedTaskTypes([
      { objectiveLoId: 'a', taskType: 'solve for time' },
      { objectiveLoId: 'b', taskType: 'solve for time' },
      { objectiveLoId: 'a', taskType: 'Solving for time' },
      { objectiveLoId: 'a', taskType: 'interpret the result' },
    ]),
    [2],
  );
  const v = validateGeneration({ items: [mcq(), mcq({ problemText: 'Which of these four other statements is the false one?' }), third], needsFigure: [] }, CTX);
  assert.equal(v.ok, false);
  assert.match(v.errors.join(' '), /repeats another question of the same objective/);
  assert.equal(v.items.length, 3); // kept: the audit stage rejects the repeat by rule
  assert.match(errs(mcq({ taskType: '' })), /taskType label is empty/);
});
t('a content defect makes the reply not ok but keeps the item', () => {
  const v = validateGeneration({ items: [mcq(), second, numeric({ objectiveLoId: 'p.lo-3', problemText: 'Give the value (for example 3) of the quantity at 7.' })], needsFigure: [] }, CTX);
  assert.equal(v.ok, false);
  assert.equal(v.items.length, 3);
});

t('multiple choice: every wrong option needs its own named mistake', () => {
  assert.match(errs(mcq({ distractorRationales: [] })), /distractorRationales/);
  assert.match(defects(mcq({ distractorRationales: ['slip one', '', 'correct', 'slip three'] })), /no mistake named/);
  assert.match(defects(mcq({ distractorRationales: ['sign error', 'Sign errors', 'correct', 'forgot to divide'] })), /same mistake/);
  assert.deepEqual(item(numeric({ distractorRationales: ['x'] })).distractorRationales, []);
});
t('only clean items are kept; the shortfall is what a follow-up asks for', () => {
  const bad = mcq({ problemText: 'Which of these four other statements is the false one?', taskType: 'pick the false statement', choices: ['one', 'two', 'three', 'none of the above'] });
  const v = validateGeneration({ items: [mcq(), bad], needsFigure: [] }, CTX);
  assert.equal(v.items.length, 2);
  assert.equal(v.clean.length, 1);
  assert.deepEqual(shortfallOf(CTX.requested, v.clean, []), { 'p.lo-2': 1, 'p.lo-3': 1 });
  assert.deepEqual(shortfallOf(CTX.requested, v.clean, [{ objectiveLoId: 'p.lo-3', reason: '' }]), { 'p.lo-2': 1 });
  const full = validateGeneration({ items: [mcq(), second, third], needsFigure: [] }, CTX);
  assert.deepEqual(shortfallOf(CTX.requested, full.clean, []), {});
  // a repeated task type is not clean either
  const rpt = validateGeneration({ items: [mcq(), mcq({ problemText: 'Which of these four other statements is the false one?' }), third], needsFigure: [] }, CTX);
  assert.equal(rpt.clean.length, 2);
});

// ── quality gate ────────────────────────────────────────────────────────────

t('quality checklist: flags are read, inapplicable checks dropped, confirmation needs the same check twice', () => {
  const none = Object.fromEntries(QUALITY_CHECKS.map((c) => [c.id, { flag: false, reason: '' }]));
  const ctx = { format: 'free', hasEarlier: false };
  assert.deepEqual(qualityFlags(none, ctx), []);
  const first = qualityFlags({ ...none, gives_away: { flag: true, reason: 'names  the method' }, ambiguous: { flag: 'yes', reason: 'two readings' } }, ctx);
  assert.deepEqual(first, [{ id: 'gives_away', reason: 'names the method' }, { id: 'ambiguous', reason: 'two readings' }]);
  // options check on a question without options, same-task check with nothing to compare to
  assert.deepEqual(qualityFlags({ ...none, weak_options: { flag: true, reason: 'x' }, same_task: { flag: true, reason: 'y' } }, ctx), []);
  assert.equal(qualityFlags({ ...none, weak_options: { flag: true, reason: 'x' }, same_task: { flag: true, reason: 'y' } }, { format: 'mcq', hasEarlier: true }).length, 2);
  // malformed / missing replies are not flags
  assert.deepEqual(qualityFlags({ gives_away: 'maybe', ambiguous: null } as Record<string, unknown>, ctx), []);
  assert.deepEqual(qualityFlags({ gives_away: true }, ctx), [{ id: 'gives_away', reason: '' }]);
  const second2 = qualityFlags({ ...none, ambiguous: { flag: true, reason: 'also' }, recall_only: { flag: true, reason: 'r' } }, ctx);
  assert.deepEqual(confirmedFlags(first, second2), [{ id: 'ambiguous', reason: 'two readings' }]);
  assert.deepEqual(confirmedFlags(first, []), []);
});

t('strict checks: a one-sided flag is contested, and only an explicit reasoned disagreement clears it', () => {
  const f = (id: string, reason = 'r') => ({ id, reason }) as { id: 'gives_away'; reason: string };
  assert.deepEqual(contestedFlags([f('gives_away')], []), [{ id: 'gives_away', reason: 'r', raisedBy: 'first' }]);
  assert.deepEqual(contestedFlags([], [f('generic_task')]), [{ id: 'generic_task', reason: 'r', raisedBy: 'second' }]);
  assert.deepEqual(contestedFlags([f('gives_away')], [f('gives_away')]), []); // raised by both: confirmed, not contested
  assert.deepEqual(contestedFlags([f('ambiguous')], []), []); // not a strict check
  assert.equal(rebuttalClears({ agree: false, reason: 'the value is data, not the answer' }), true);
  assert.equal(rebuttalClears({ agree: false, reason: '  ' }), false);
  assert.equal(rebuttalClears({ agree: true, reason: 'yes it does' }), false);
  assert.equal(rebuttalClears({}), false);
});
t('same-task groups: all but the best of each group are dropped', () => {
  assert.deepEqual(sameTaskLosers({ groups: [] }, 3), []);
  assert.deepEqual(sameTaskLosers({ groups: [{ members: [1, 3], best: 3, reason: 'same steps' }] }, 3), [{ drop: 0, keep: 2, reason: 'same steps' }]);
  assert.deepEqual(sameTaskLosers({ groups: [{ members: [1, 2, 3], best: 2, reason: '' }] }, 3).map((l) => l.drop), [0, 2]);
  // best not in the group → the first member is kept; out-of-range and single-member groups ignored
  assert.deepEqual(sameTaskLosers({ groups: [{ members: [2, 3], best: 9, reason: '' }, { members: [1], best: 1 }, { members: [1, 7], best: 1 }] }, 3).map((l) => [l.drop, l.keep]), [[2, 1]]);
  assert.deepEqual(sameTaskLosers({}, 3), []);
});

// ── acceptance rule ─────────────────────────────────────────────────────────

const S = (vsKey: SolverOutcome['vsKey'], over: Partial<SolverOutcome> = {}): SolverOutcome => ({ illPosed: false, assumed: false, vsKey, ...over });
const ILL: SolverOutcome = { illPosed: true, assumed: false };

t('acceptance rule table', () => {
  const rows: Array<[SolverOutcome, SolverOutcome, SolverOutcome | undefined, string, string]> = [
    // both agree
    [S('SAME'), S('SAME'), undefined, 'ACCEPTED', 'both_solvers_agree'],
    // exactly one disagrees → tie-break
    [S('SAME'), S('DIFFERENT'), undefined, 'TIEBREAK', 'one_solver_disagrees'],
    [S('DIFFERENT'), S('SAME'), undefined, 'TIEBREAK', 'one_solver_disagrees'],
    [S('SAME'), S('KEY_INCOMPLETE'), undefined, 'TIEBREAK', 'one_solver_disagrees'],
    [S('CANNOT_JUDGE'), S('SAME'), undefined, 'TIEBREAK', 'one_solver_disagrees'],
    [S('SAME'), S('DIFFERENT'), S('SAME'), 'ACCEPTED', 'tiebreak_agrees_with_key'],
    [S('DIFFERENT'), S('SAME'), S('SAME'), 'ACCEPTED', 'tiebreak_agrees_with_key'],
    [S('SAME'), S('DIFFERENT'), S('DIFFERENT'), 'REJECTED', 'tiebreak_disagrees_with_key'],
    [S('SAME'), S('DIFFERENT'), S('KEY_INCOMPLETE'), 'REJECTED', 'tiebreak_disagrees_with_key'],
    [S('SAME'), S('DIFFERENT'), S('CANNOT_JUDGE'), 'REJECTED', 'tiebreak_disagrees_with_key'],
    [S('SAME'), S('DIFFERENT'), ILL, 'REJECTED', 'tiebreak_ill_posed'],
    [S('SAME'), S('DIFFERENT'), S('SAME', { assumed: true }), 'REJECTED', 'tiebreak_unstated_assumption'],
    // both disagree — a tie-break cannot rescue it
    [S('DIFFERENT'), S('DIFFERENT'), undefined, 'REJECTED', 'both_solvers_disagree'],
    [S('DIFFERENT'), S('KEY_INCOMPLETE'), undefined, 'REJECTED', 'both_solvers_disagree'],
    [S('CANNOT_JUDGE'), S('CANNOT_JUDGE'), undefined, 'REJECTED', 'both_solvers_disagree'],
    [S('DIFFERENT'), S('DIFFERENT'), S('SAME'), 'REJECTED', 'both_solvers_disagree'],
    // ill-posed from either solver
    [ILL, S('SAME'), undefined, 'REJECTED', 'ill_posed'],
    [S('SAME'), ILL, undefined, 'REJECTED', 'ill_posed'],
    [ILL, ILL, undefined, 'REJECTED', 'ill_posed'],
    [ILL, S('SAME'), S('SAME'), 'REJECTED', 'ill_posed'],
    // an unstated assumption from either solver, even when both agree with the key
    [S('SAME', { assumed: true }), S('SAME'), undefined, 'REJECTED', 'unstated_assumption'],
    [S('SAME'), S('SAME', { assumed: true }), undefined, 'REJECTED', 'unstated_assumption'],
    [S('SAME'), S('DIFFERENT', { assumed: true }), S('SAME'), 'REJECTED', 'unstated_assumption'],
    // a solver with no comparison at all counts as a disagreement
    [S(undefined), S('SAME'), undefined, 'TIEBREAK', 'one_solver_disagrees'],
  ];
  for (const [a, b, tb, status, reason] of rows) {
    const d = decide(a, b, tb);
    assert.deepEqual([d.status, d.reason], [status, reason], JSON.stringify([a, b, tb]));
  }
});

// ── comparing with the app's rules ──────────────────────────────────────────

const reply = (answer: string, chosenOption = '') => ({ illPosed: false, illPosedReason: '', assumptions: '', chosenOption, answer });
const CH = ['one', 'two', 'three', 'four'];

t('multiple choice is compared by option and never left to a judge', () => {
  const q = { format: 'mcq', question: 'q', key: 'B', choices: CH };
  assert.equal(compareWithRules(q, reply('two', 'B')).verdict, 'SAME');
  assert.equal(compareWithRules(q, reply('two', '')).verdict, 'SAME'); // by option text
  assert.equal(compareWithRules(q, reply('three', 'C')).verdict, 'DIFFERENT');
  assert.equal(compareWithRules(q, reply('something else', '')).verdict, 'CANNOT_JUDGE');
  assert.equal(compareWithRules({ ...q, key: 'Z' }, reply('two', 'B')).verdict, 'CANNOT_JUDGE');
});
t('numeric items use the app’s strict number rule', () => {
  const q = (key: string) => ({ format: 'numeric', question: 'q', key, choices: [] });
  assert.deepEqual([compareWithRules(q('5'), reply('5')).verdict, compareWithRules(q('5'), reply('5')).method], ['SAME', 'numeric-rule']);
  assert.equal(compareWithRules(q('5'), reply('4.976')).verdict, 'DIFFERENT'); // near is not equal
  assert.equal(compareWithRules(q('10.81'), reply('10.80')).verdict, 'DIFFERENT');
  assert.equal(compareWithRules(q('10.81'), reply('10.8103')).verdict, 'SAME'); // rounds to the key
  assert.equal(compareWithRules(q('4.33'), reply('13/3')).verdict, 'SAME');
  assert.equal(compareWithRules(q('13/3'), reply('4.33')).verdict, 'SAME');
  assert.equal(compareWithRules(q('0.5'), reply('x = 0.5')).verdict, 'SAME');
  // an answer with a unit is not decided by the number rule; the shared comparison takes it
  assert.equal(compareWithRules(q('12'), reply('12 m')).verdict, 'SAME');
});
t('free answers: identical text and plain numbers decide; anything else goes to the judge', () => {
  const q = (key: string) => ({ format: 'free', question: 'q', key, choices: [] });
  assert.equal(compareWithRules(q('Glycolysis'), reply('glycolysis')).verdict, 'SAME');
  assert.equal(compareWithRules(q('19 m'), reply('35 m')).verdict, 'DIFFERENT');
  assert.equal(compareWithRules(q('the first one'), reply('a quite different sentence')).verdict, null);
});

// ── ids ─────────────────────────────────────────────────────────────────────

t('content hash is the runtime generator’s (pinned to a stored production id)', () => {
  // ProblemBank row practice-gen.alg1.factoring-trinomials.113i83o
  assert.equal(simpleHash('Factor x² − 5x − 36.'), '113i83o');
  assert.equal(itemIdOf('alg1.factoring-trinomials', 'Factor x² − 5x − 36.'), 'practice-gen.alg1.factoring-trinomials.113i83o');
  assert.equal(simpleHash(''), (5381).toString(36));
});
t('id is practice-gen.<objective id>.<base-36 hash>, stable, and differs with the stem', () => {
  const lo = 'gen-0056dad8-ddbd-40fe-8edb-8f417de9eca0.lo-3';
  const id = itemIdOf(lo, 'What is $2 + 2$?');
  assert.match(id, /^practice-gen\.gen-[0-9a-f-]{36}\.lo-3\.[0-9a-z]{1,7}$/);
  assert.equal(id, itemIdOf(lo, 'What is $2 + 2$?'));
  assert.notEqual(id, itemIdOf(lo, 'What is $2 + 3$?'));
  assert.ok(id.startsWith(`practice-gen.${lo}.`));
});

// ── near-duplicates, cost, JSON ─────────────────────────────────────────────

t('near-duplicate check compares answers in words', () => {
  const a = comparableOf({ problemText: 'Which organelle carries out aerobic respiration in a cell?', answer: 'B', choices: ['nucleus', 'mitochondrion', 'ribosome', 'vacuole'] });
  assert.equal(a.answerText, 'mitochondrion');
  const same = comparableOf({ problemText: 'Which organelle carries out aerobic respiration in a cell?', answer: 'B', choices: ['nucleus', 'mitochondrion', 'ribosome', 'vacuole'] });
  assert.equal(nearDuplicateOf(a, [same])?.reason, 'duplicate');
  const other = comparableOf({ problemText: 'Factor $x^2 - 9$ completely over the integers.', answer: '(x-3)(x+3)' });
  assert.equal(nearDuplicateOf(a, [other]), null);
});
t('cost arithmetic and the budget hold the cap with calls in flight', () => {
  const rate = { input: 2, output: 10 };
  assert.equal(costUsd({ input: 1_000_000, output: 100_000, cacheRead: 0, cacheWrite: 0 }, rate), 3);
  assert.equal(worstCaseUsd(2500, 1000, rate), (1000 * 2 + 1000 * 10) / 1e6);
  const b = new Budget(1, 0.5);
  b.reserve(0.3);
  assert.throws(() => b.reserve(0.3), BudgetExceeded); // 0.5 spent + 0.3 in flight + 0.3 > 1
  b.settle(0.3, 0.1);
  assert.ok(Math.abs(b.spentUsd - 0.6) < 1e-12);
  b.reserve(0.3);
  assert.throws(() => b.reserve(0.2), BudgetExceeded);
});
t('loose JSON parsing survives code fences and single-backslash LaTeX', () => {
  assert.deepEqual(parseJsonLoose('```json\n{"a": 1}\n```'), { a: 1 });
  assert.deepEqual(parseJsonLoose('Here it is: {"a": "x"} done'), { a: 'x' });
  assert.equal(parseJsonLoose('{"a": "\\alpha + \\sqrt{2}"}').a, '\\alpha + \\sqrt{2}');
  assert.throws(() => parseJsonLoose('no json here'));
});

console.log(`practice-extend core: ${n} tests passed`);
