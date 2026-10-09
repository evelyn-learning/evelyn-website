/**
 * Tests for scripts/practice-extend/ingest-core.ts (pure — no network, no DB).
 * Run from apps/tutor:  npx tsx scripts/practice-extend/ingest-core.test.ts
 */
import assert from 'node:assert/strict';
import { itemIdOf } from './core';
import {
  assertLetterPointsAtCorrect,
  containsVerbatim,
  coverageAfter,
  detectMcqKey,
  finalizeDecision,
  ingestFile,
  judgeSolverReply,
  keyWordCount,
  normaliseWritten,
  planBatches,
  referencesOptionByLetter,
  shuffleMcq,
  statusOf,
  writtenItemDefects,
  type DisplayItem,
  type FinalizeInput,
  type Pack,
  type ReaderGrade,
} from './ingest-core';

let passed = 0;
function test(name: string, fn: () => void): void {
  fn();
  passed++;
  console.log(`  ok  ${name}`);
}

const LO = 'gen-00000000-0000-0000-0000-000000000000';
const pack: Pack = {
  skillLoId: `${LO}.lo-1`,
  subject: 'ALGEBRA_2',
  skill: 'Lines',
  objectives: [
    { objectiveLoId: `${LO}.lo-1`, description: 'Find the slope of a line.', figureDependent: false, have: 1, need: 2, existingItems: [{ question: 'What is the slope of the line through (0, 0) and (2, 6)?', answer: '3' }] },
    { objectiveLoId: `${LO}.lo-2`, description: 'Sketch a line.', figureDependent: true, have: 0, need: 0, existingItems: [] },
    { objectiveLoId: `${LO}.lo-3`, description: 'Classify lines as parallel or perpendicular.', figureDependent: false, have: 0, need: 3, existingItems: [] },
  ],
};
const base = { hints: ['Compare the two coefficients of x.'], solutionText: 'Work it through.', difficulty: 2, taskType: 'decide which case applies', covers: 'slopes', verified: 'by hand' };
const v2mcq = (stem: string, correct: string, wrong: string[], extra: Record<string, unknown> = {}) => ({ objectiveLoId: `${LO}.lo-3`, responseFormat: 'mcq', problemText: stem, choices: [correct, ...wrong], answer: correct, ...base, ...extra });
const rulesOf = (raw: unknown, p: Pack = pack) => normaliseWritten(raw, p).defects.map((d) => d.rule);

// ── the two file formats ────────────────────────────────────────────────────

test('v2: the answer is an option’s text — wherever that option stands', () => {
  assert.deepEqual(detectMcqKey('two', ['two', 'one', 'three', 'four']), { format: 'v2', correctIndex: 0 });
  assert.deepEqual(detectMcqKey(' three ', ['two', 'one', 'three', 'four']), { format: 'v2', correctIndex: 2 });
});
test('v1: a single letter A–D that is not an option text names the position', () => {
  assert.deepEqual(detectMcqKey('C', ['two', 'one', 'three', 'four']), { format: 'v1', correctIndex: 2 });
  assert.deepEqual(detectMcqKey('A', ['two', 'one', 'three', 'four']), { format: 'v1', correctIndex: 0 });
});
test('a letter that IS an option text is read as text (v2), not as a position', () => {
  assert.deepEqual(detectMcqKey('C', ['C', 'A', 'B', 'D']), { format: 'v2', correctIndex: 0 });
  assert.deepEqual(detectMcqKey('B', ['A', 'B', 'C', 'D']), { format: 'v2', correctIndex: 1 });
});
test('an answer that names no option, or two, resolves to nothing', () => {
  assert.equal(detectMcqKey('five', ['two', 'one', 'three', 'four']).correctIndex, -1);
  assert.equal(detectMcqKey('c', ['two', 'one', 'three', 'four']).correctIndex, -1);
  assert.equal(detectMcqKey('E', ['two', 'one', 'three', 'four']).correctIndex, -1);
  assert.equal(detectMcqKey('two', ['two', 'two', 'three', 'four']).correctIndex, -1);
  assert.equal(detectMcqKey('D', ['two', 'one', 'three']).correctIndex, -1);
});
test('both formats normalise to the correct option’s text', () => {
  const a = normaliseWritten(v2mcq('The lines y = 2x + 1 and y = 2x − 4 are which of these?', 'parallel', ['perpendicular', 'the same line', 'intersecting once']), pack);
  assert.deepEqual(a.defects, []);
  assert.equal(a.item.sourceFormat, 'v2');
  assert.equal(a.item.correctText, 'parallel');
  const b = normaliseWritten({ ...v2mcq('The lines y = 2x + 1 and y = 2x − 4 are which of these?', 'x', []), choices: ['perpendicular', 'the same line', 'parallel', 'intersecting once'], answer: 'C' }, pack);
  assert.deepEqual(b.defects, []);
  assert.equal(b.item.sourceFormat, 'v1');
  assert.equal(b.item.correctText, 'parallel');
});

// ── form validation ─────────────────────────────────────────────────────────

test('the item must belong to the pack, on an objective that needs no figure', () => {
  assert.deepEqual(rulesOf(v2mcq('The lines y = 2x + 1 and y = 2x − 4 are which?', 'parallel', ['a', 'b', 'c'], { objectiveLoId: 'gen-other.lo-1' })), ['unknown_objective']);
  assert.deepEqual(rulesOf(v2mcq('The lines y = 2x + 1 and y = 2x − 4 are which?', 'parallel', ['a', 'b', 'c'], { objectiveLoId: `${LO}.lo-2` })), ['figure_dependent_objective']);
});
test('multiple choice: exactly four different options, exactly one of them the key', () => {
  assert.deepEqual(rulesOf(v2mcq('The lines y = 2x + 1 and y = 2x − 4 are which?', 'parallel', ['a', 'b'])), ['mcq_option_count']);
  assert.deepEqual(rulesOf(v2mcq('The lines y = 2x + 1 and y = 2x − 4 are which?', 'parallel', ['a', 'a', 'b'])), ['mcq_options_not_distinct']);
  assert.deepEqual(rulesOf(v2mcq('The lines y = 2x + 1 and y = 2x − 4 are which?', 'parallel', ['a', 'b', 'c'], { answer: 'skew' })), ['mcq_key_not_one_option']);
  assert.ok(rulesOf(v2mcq('The lines y = 2x + 1 and y = 2x − 4 are which?', 'parallel', ['parallel', 'b', 'c'])).includes('mcq_key_not_one_option'));
});
test('numeric: one plain number; free: at most four words; no options on either', () => {
  const num = (answer: string, extra: Record<string, unknown> = {}) => rulesOf({ objectiveLoId: `${LO}.lo-1`, responseFormat: 'numeric', problemText: 'What is the slope of the line 4x − 2y = 7?', choices: null, answer, ...base, ...extra });
  assert.deepEqual(num('2'), []);
  assert.deepEqual(num('-0.5'), []);
  assert.deepEqual(num('3/4'), []);
  assert.deepEqual(num('2 m/s'), ['numeric_key_not_number']);
  assert.deepEqual(num('2 or 3'), ['numeric_key_not_number']);
  assert.deepEqual(num('2', { choices: ['2', '3'] }), ['non_mcq_has_choices']);
  const free = (answer: string) => rulesOf({ objectiveLoId: `${LO}.lo-1`, responseFormat: 'free', problemText: 'Write the equation of the line with slope 2 through the origin.', choices: null, answer, ...base });
  assert.deepEqual(free('y = 2x'), []);
  assert.deepEqual(free('the line y equals two x'), ['free_key_too_long']);
  assert.deepEqual(rulesOf({ objectiveLoId: `${LO}.lo-1`, responseFormat: 'essay', problemText: 'Write the equation of the line.', answer: 'x', ...base }), ['bad_format']);
});
test('a free key is counted in words, not in operators', () => {
  assert.equal(keyWordCount('(x + 3)/(x + 4)'), 3);
  assert.equal(keyWordCount('y = −3'), 2);
  assert.equal(keyWordCount('fail to reject'), 3);
  assert.equal(keyWordCount('(x − 3)² + (y + 6)² = 36'), 5);
});
test('hints, solution and difficulty are required in the job’s ranges', () => {
  const it = v2mcq('The lines y = 2x + 1 and y = 2x − 4 are which?', 'parallel', ['a', 'b', 'c']);
  assert.deepEqual(rulesOf({ ...it, hints: [] }), ['hints_count']);
  assert.deepEqual(rulesOf({ ...it, hints: ['a', 'b', 'c'] }), ['hints_count']);
  assert.deepEqual(rulesOf({ ...it, solutionText: ' ' }), ['solution_missing']);
  assert.deepEqual(rulesOf({ ...it, difficulty: 5 }), ['difficulty_range']);
});

// ── shuffle + letter ────────────────────────────────────────────────────────

test('the shuffle is deterministic and keeps the four options', () => {
  const a = shuffleMcq('practice-gen.x.1', 'right', ['w1', 'w2', 'w3'], [0, 0, 0, 0]);
  const b = shuffleMcq('practice-gen.x.1', 'right', ['w1', 'w2', 'w3'], [0, 0, 0, 0]);
  assert.deepEqual(a, b);
  assert.deepEqual([...a.choices].sort(), ['right', 'w1', 'w2', 'w3']);
  assert.equal(a.choices['ABCD'.indexOf(a.letter)], 'right');
});
test('different ids give different orders (the seed is the id)', () => {
  const orders = new Set(Array.from({ length: 40 }, (_, i) => shuffleMcq(`practice-gen.x.${i}`, 'right', ['w1', 'w2', 'w3'], [0, 0, 0, 0]).choices.join('|')));
  assert.ok(orders.size > 10, `only ${orders.size} distinct orders in 40`);
});
test('the correct letter only goes to a position the skill has used least', () => {
  assert.equal(shuffleMcq('practice-gen.x.1', 'right', ['w1', 'w2', 'w3'], [2, 2, 1, 2]).letter, 'C');
  for (let i = 0; i < 50; i++) assert.ok('BD'.includes(shuffleMcq(`id-${i}`, 'right', ['w1', 'w2', 'w3'], [3, 2, 3, 2]).letter));
});
test('LETTER INVARIANT: over many items the letter always points at the correct text, and the letters are spread evenly over the skill', () => {
  const big: Pack = { ...pack, objectives: [{ objectiveLoId: `${LO}.lo-3`, description: 'x', figureDependent: false, have: 0, need: 400, existingItems: [] }] };
  const topics = ['granite', 'rainfall', 'copper wire', 'a pendulum', 'yeast cells', 'a glacier', 'sound waves', 'an enzyme', 'a comet', 'a magnet'];
  const verbs = ['measured', 'heated', 'cooled', 'weighed', 'counted', 'dissolved', 'stretched', 'timed', 'filtered', 'compressed'];
  const raw = Array.from({ length: 203 }, (_, i) => {
    const stem = `In trial ${i * 7919 + 13}, a student ${verbs[i % 10]} ${topics[(i * 3) % 10]} ${i + 2} times and recorded ${i * 31 + 5} units. Which statement is supported?`;
    // v1 and v2 mixed; in v1 the correct option stands at a varying position.
    const options = [`outcome ${i}-right`, `outcome ${i}-w1`, `outcome ${i}-w2`, `outcome ${i}-w3`];
    if (i % 5 === 0) {
      const at = i % 4;
      const shown = [...options.slice(1)];
      shown.splice(at, 0, options[0]);
      return { ...v2mcq(stem, 'x', []), choices: shown, answer: 'ABCD'[at], taskType: `task ${i}` };
    }
    return { ...v2mcq(stem, options[0], options.slice(1)), taskType: `task ${i}` };
  });
  const out = ingestFile(big, raw);
  assert.equal(out.length, 203);
  const counts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
  out.forEach((it, i) => {
    assert.deepEqual(it.defects, [], `item ${i}: ${JSON.stringify(it.defects)}`);
    assert.equal(it.correctText, `outcome ${i}-right`);
    assert.equal(it.choices['ABCD'.indexOf(it.answer)], it.correctText);
    assert.deepEqual([...it.choices].sort(), [`outcome ${i}-right`, `outcome ${i}-w1`, `outcome ${i}-w2`, `outcome ${i}-w3`].sort());
    assertLetterPointsAtCorrect(it);
    counts[it.answer]++;
  });
  assert.ok(Math.max(...Object.values(counts)) - Math.min(...Object.values(counts)) <= 1, JSON.stringify(counts));
  // The same file again gives the same display order.
  assert.deepEqual(ingestFile(big, raw).map((x) => x.answer + x.choices.join('|')), out.map((x) => x.answer + x.choices.join('|')));
});
test('the invariant check throws on a letter that points elsewhere', () => {
  const ok = { id: 'x', responseFormat: 'mcq', choices: ['a', 'b', 'c', 'd'], answer: 'B', correctText: 'b' };
  assertLetterPointsAtCorrect(ok);
  assert.throws(() => assertLetterPointsAtCorrect({ ...ok, answer: 'C' }));
  assert.throws(() => assertLetterPointsAtCorrect({ ...ok, answer: 'b' }));
  assert.throws(() => assertLetterPointsAtCorrect({ ...ok, answer: '' }));
  assert.throws(() => assertLetterPointsAtCorrect({ ...ok, choices: ['a', 'b', 'b', 'd'] }));
  assertLetterPointsAtCorrect({ id: 'n', responseFormat: 'numeric', choices: [], answer: '12', correctText: '12' });
});
test('an item an earlier run stored keeps its display order, and its letter counts towards the spread', () => {
  const raw = [
    v2mcq('The lines y = 3x + 1 and y = 3x − 9 are related how?', 'parallel', ['perpendicular', 'identical', 'crossing once'], { taskType: 'one' }),
    v2mcq('A line has slope 4. What is the slope of every line at right angles to it?', '−1/4', ['+1/4', '−4/1', '+4/1'], { taskType: 'two' }),
  ];
  const first = ingestFile(pack, raw);
  const storedOrder = { answer: 'D', choices: ['perpendicular', 'identical', 'crossing once', 'parallel'] };
  const again = ingestFile(pack, raw, new Map([[first[0].id, storedOrder]]));
  assert.deepEqual({ answer: again[0].answer, choices: again[0].choices }, storedOrder);
  assert.notEqual(again[1].answer, 'D'); // D is taken once; the next key goes elsewhere
  // A stored order that no longer matches the written options is not reused.
  const stale = ingestFile(pack, raw, new Map([[first[0].id, { answer: 'A', choices: ['parallel', 'old', 'older', 'oldest'] }]]));
  assert.deepEqual([...stale[0].choices].sort(), ['crossing once', 'identical', 'parallel', 'perpendicular']);
  assertLetterPointsAtCorrect(stale[0]);
});

// ── rule checks ─────────────────────────────────────────────────────────────

const display = (over: Partial<DisplayItem>): DisplayItem => ({
  id: 'practice-gen.x.1', objectiveLoId: `${LO}.lo-3`, responseFormat: 'mcq',
  problemText: 'Two lines have slopes 2 and −1/2. How are the lines related?',
  choices: ['They are parallel lines', 'They meet at right angles', 'They are the same line', 'They never meet at all'], answer: 'B', correctText: 'They meet at right angles',
  hints: ['Multiply the two slopes.'], solutionText: 'The product of the slopes is −1.', difficulty: 2, taskType: 'decide which case applies', covers: 'slopes', ...over,
});
const rules = (over: Partial<DisplayItem>) => writtenItemDefects(display(over)).map((d) => d.rule);

test('a sound item has no defect', () => {
  assert.deepEqual(rules({}), []);
});
test('the job’s own checks are applied and named', () => {
  assert.deepEqual(rules({ choices: ['They are parallel lines', 'They meet at right angles', 'They are the same line', 'None of the above'] }), ['all_or_none_of_the_above']);
  assert.deepEqual(rules({ choices: ['0.5', '1/2', '2', '4'], answer: 'C', correctText: '2' }), ['equivalent_options']);
  assert.deepEqual(rules({ problemText: 'Two lines have slopes 2 and −1/2, as shown in the graph below. How are they related?' }), ['figure_reference']);
  assert.deepEqual(rules({ responseFormat: 'free', choices: [], answer: 'perpendicular', correctText: 'perpendicular', problemText: 'Two lines have slopes 2 and −1/2. Are the lines parallel or perpendicular?' }), ['key_in_stem']);
  assert.deepEqual(rules({ responseFormat: 'free', choices: [], answer: 'perpendicular because −1', correctText: 'perpendicular because −1' }), ['key_has_justification']);
  assert.deepEqual(rules({ choices: ['They are parallel lines', 'They meet at right angles', 'They are the same line', '\\frac{1}{2}'] }), ['latex_in_key_or_option']);
});
test('options that differ only in letter case are what the app would match as one: named as equivalent, not as identical', () => {
  const raw = v2mcq('A test cross gives offspring in a 1 : 1 ratio of the two phenotypes. Which cross was made?', 'Aa × aa', ['AA × aa', 'Aa × Aa', 'aa × aa']);
  assert.deepEqual(normaliseWritten(raw, pack).defects, []);
  assert.deepEqual([...new Set(ingestFile(pack, [raw])[0].defects.map((d) => d.rule))], ['equivalent_options']);
});
test('the correct option may not be the longest by more than 25%', () => {
  assert.deepEqual(rules({ choices: ['parallel', 'perpendicular to each other here', 'identical lines', 'skew lines'], answer: 'B', correctText: 'perpendicular to each other here' }), ['key_is_longest_option']);
  // exactly 25% longer is allowed; a longer WRONG option is not this defect
  assert.deepEqual(rules({ choices: ['12345678', '1234567890', '1234', '123456'], answer: 'B', correctText: '1234567890' }), []);
  assert.deepEqual(rules({ choices: ['12345678', '12345678901', '1234', '123456'], answer: 'B', correctText: '12345678901' }), ['key_is_longest_option']);
  assert.deepEqual(rules({ choices: ['a much, much longer wrong option', 'short key', 'another wrong one', 'a third wrong one'], answer: 'B', correctText: 'short key' }), []);
});
test('no reference to an option by letter or position — in the question, a hint or the solution', () => {
  assert.deepEqual(rules({ solutionText: 'Option B is the only one whose product is −1.' }), ['option_referenced_by_letter']);
  assert.deepEqual(rules({ hints: ['Rule out choices A and C first.'] }), ['option_referenced_by_letter']);
  assert.deepEqual(rules({ problemText: 'Two lines have slopes 2 and −1/2. Which is right — the first option or the last option?' }), ['option_referenced_by_letter']);
  assert.deepEqual(rules({ solutionText: 'B is correct because the product is −1.' }), ['option_referenced_by_letter']);
  for (const fine of ['Test each option with the case of equal slopes.', 'None of the other choices gives a product of −1.', 'Point A is at (2, 3) and point B is at (4, 7).', 'The first chair has 7 choices, then 6.', 'Vitamin C is correct for scurvy prevention? No: the slope is.', 'Call the lines A and B.']) {
    assert.equal(referencesOptionByLetter(fine), false, fine);
  }
});
test('a hint may not contain the key verbatim', () => {
  assert.deepEqual(rules({ hints: ['Remember: lines whose slopes multiply to −1? They meet at right angles.'] }), ['hint_contains_key']);
  assert.deepEqual(rules({ responseFormat: 'numeric', choices: [], answer: '12', correctText: '12', hints: ['The product is 12.'] }), ['hint_contains_key']);
  assert.deepEqual(rules({ responseFormat: 'numeric', choices: [], answer: '12', correctText: '12', hints: ['Start from 120 and 3.12, then halve.'] }), []);
  assert.equal(containsVerbatim('Factor to get (x-3)(x+1).', '-3'), false);
  assert.equal(containsVerbatim('The value is −3 here.', '-3'), true);
  assert.equal(containsVerbatim('Think about kinases in general.', 'kinase'), false);
  assert.equal(containsVerbatim('It is a Kinase.', 'kinase'), true);
  assert.equal(containsVerbatim('anything', ''), false);
});
test('near-duplicates: of an item the skill already has, and of an earlier item of the file', () => {
  const num = (stem: string, answer: string, taskType: string) => ({ objectiveLoId: `${LO}.lo-1`, responseFormat: 'numeric', problemText: stem, choices: null, answer, ...base, hints: ['Use rise over run.'], taskType });
  const out = ingestFile(pack, [
    num('What is the slope of the line through (0, 0) and (2, 6)?', '3', 'compute'),
    num('A ramp rises 5 m over a horizontal run of 20 m. What is its slope, as a decimal?', '0.25', 'apply to a context'),
    num('A ramp rises 5 m over a horizontal run of 20 m. What is its slope, as a decimal?  ', '0.25', 'apply again'),
  ]);
  assert.deepEqual(out[0].defects.map((d) => d.rule), ['near_duplicate_of_existing']);
  assert.deepEqual(out[1].defects, []);
  assert.deepEqual(out[2].defects.map((d) => d.rule), ['duplicate_stem']);
  assert.equal(out[2].id, `${out[1].id}#2`);
  assert.equal(out[1].id, itemIdOf(`${LO}.lo-1`, 'A ramp rises 5 m over a horizontal run of 20 m. What is its slope, as a decimal?'));
});
test('the same task type twice on one objective: the later item is the defect', () => {
  const out = ingestFile(pack, [
    v2mcq('The lines y = 3x + 1 and y = 3x − 9 are related how?', 'parallel', ['perpendicular', 'identical', 'crossing once'], { taskType: 'Decide which case applies' }),
    v2mcq('A line has slope 4. What is the slope of every line at right angles to it?', '−1/4', ['+1/4', '−4/1', '+4/1'], { taskType: 'decide which case applies' }),
  ]);
  assert.deepEqual(out[0].defects, []);
  assert.deepEqual(out[1].defects.map((d) => d.rule), ['task_type_repeats']);
});
test('the id is the job’s: practice-gen.<objective>.<hash of the trimmed stem>', () => {
  const [it] = ingestFile(pack, [{ ...v2mcq('  The lines y = 3x + 1 and y = 3x − 9 are related how?\n', 'parallel', ['perpendicular', 'identical', 'crossing once']) }]);
  assert.equal(it.id, itemIdOf(`${LO}.lo-3`, 'The lines y = 3x + 1 and y = 3x − 9 are related how?'));
  assert.match(it.id, /^practice-gen\.gen-[0-9a-f-]+\.lo-3\.[0-9a-z]+$/);
});

// ── the solver's reply ──────────────────────────────────────────────────────

const reply = (over: Partial<{ illPosed: boolean; illPosedReason: string; assumptions: string; chosenOption: string; answer: string }>) => ({ illPosed: false, illPosedReason: '', assumptions: '', chosenOption: '', answer: '', ...over });
const mcqQ = { format: 'mcq', question: 'q', key: 'B', choices: ['red', 'green', 'blue', 'grey'] };

test('multiple choice: the letter AND the text have to be the keyed option', () => {
  assert.equal(judgeSolverReply(mcqQ, 'green', reply({ chosenOption: 'B', answer: 'green' })).outcome, 'agree');
  assert.equal(judgeSolverReply(mcqQ, 'green', reply({ chosenOption: 'C', answer: 'blue' })).outcome, 'disagree');
  assert.equal(judgeSolverReply(mcqQ, 'green', reply({ chosenOption: 'B', answer: 'blue' })).outcome, 'undecided');
  assert.equal(judgeSolverReply(mcqQ, 'green', reply({ chosenOption: '', answer: 'something else' })).outcome, 'undecided');
  assert.equal(judgeSolverReply(mcqQ, 'green', reply({ chosenOption: '', answer: 'Green' })).outcome, 'agree');
  // a keyed letter that does not point at the correct text is never an agreement
  assert.equal(judgeSolverReply(mcqQ, 'blue', reply({ chosenOption: 'B', answer: 'green' })).outcome, 'undecided');
});
test('numeric and free answers: the job’s deterministic compare; undecidable text → undecided', () => {
  const num = { format: 'numeric', question: 'q', key: '0.25', choices: [] };
  assert.equal(judgeSolverReply(num, '0.25', reply({ answer: '1/4' })).outcome, 'agree');
  assert.equal(judgeSolverReply(num, '0.25', reply({ answer: '0.4' })).outcome, 'disagree');
  const free = { format: 'free', question: 'q', key: 'y = −3', choices: [] };
  assert.equal(judgeSolverReply(free, 'y = −3', reply({ answer: 'y = -3' })).outcome, 'agree');
  const term = { format: 'free', question: 'q', key: 'observational study', choices: [] };
  assert.equal(judgeSolverReply(term, 'observational study', reply({ answer: 'Observational study' })).outcome, 'agree');
  assert.equal(judgeSolverReply(term, 'observational study', reply({ answer: 'it is an observational design' })).outcome, 'undecided');
});
test('ill-posed wins over any answer', () => {
  assert.equal(judgeSolverReply(mcqQ, 'green', reply({ illPosed: true, illPosedReason: 'two options hold', chosenOption: 'B', answer: 'green' })).outcome, 'ill-posed');
});
test('status of an item', () => {
  assert.equal(statusOf([{ rule: 'x', detail: '' }], 'agree'), 'rules_rejected');
  assert.equal(statusOf([], undefined), null);
  assert.equal(statusOf([], 'agree'), 'ready_for_read');
  assert.equal(statusOf([], 'undecided'), 'ready_for_read');
  assert.equal(statusOf([], 'disagree'), 'solver_disagrees');
  assert.equal(statusOf([], 'ill-posed'), 'solver_ill_posed');
});

// ── reading batches ─────────────────────────────────────────────────────────

test('batches: one subject each, whole skills, at most the maximum', () => {
  const mk = (subject: string, p: string, n: number) => Array.from({ length: n }, (_, i) => ({ id: `${p}-${i}`, subject, pack: p }));
  const b = planBatches([...mk('PHYSICS', '010', 30), ...mk('ALGEBRA_2', '002', 50), ...mk('ALGEBRA_2', '001', 40), ...mk('PHYSICS', '011', 50), ...mk('ALGEBRA_2', '003', 30)], 80);
  assert.deepEqual(b.map((x) => [x.subject, x.packs, x.items.length]), [['ALGEBRA_2', ['001'], 40], ['ALGEBRA_2', ['002', '003'], 80], ['PHYSICS', ['010', '011'], 80]]);
  for (const x of b) assert.ok(new Set(x.items.map((i) => i.subject)).size === 1 && x.items.length <= 80);
  assert.deepEqual(planBatches(mk('PHYSICS', '010', 170), 80).map((x) => x.items.length), [80, 80, 10]);
  assert.deepEqual(planBatches([], 80), []);
});

// ── finalize: the selection table ───────────────────────────────────────────

const mcqItem = (over: Partial<FinalizeInput>): FinalizeInput => ({ status: 'ready_for_read', solverOutcome: 'agree', format: 'mcq', choices: ['red', 'green', 'blue', 'grey'], key: 'B', question: 'q', ...over });
const g = (over: Partial<ReaderGrade>): ReaderGrade => ({ id: 'x', blindAnswer: 'B', agreesWithKey: true, grade: 'good', reason: '', ...over });

test('finalize selection table', () => {
  const table: Array<[string, FinalizeInput, ReaderGrade[], string]> = [
    // solver agreed
    ['agree + reader agrees + good', mcqItem({}), [g({})], 'export:solver_and_reader'],
    ['agree + reader agrees + acceptable', mcqItem({}), [g({ grade: 'acceptable' })], 'export:solver_and_reader'],
    ['agree + reader agrees + poor', mcqItem({}), [g({ grade: 'poor' })], 'drop:reader_grade_poor'],
    ['agree + reader disagrees', mcqItem({}), [g({ agreesWithKey: false, blindAnswer: 'C' })], 'drop:reader_disagrees_with_key'],
    ['agree + corrected key', mcqItem({}), [g({ agreesWithKey: false, blindAnswer: 'C', correctedKey: 'C' })], 'rewrite:reader_corrected_key'],
    ['agree + corrected key even with a good grade', mcqItem({}), [g({ correctedKey: 'C' })], 'rewrite:reader_corrected_key'],
    ['agree + empty corrected key is no correction', mcqItem({}), [g({ correctedKey: '' })], 'export:solver_and_reader'],
    ['agree + no grade', mcqItem({}), [], 'drop:no_reader_grade'],
    ['agree + grade missing', mcqItem({}), [g({ grade: undefined })], 'drop:reader_grade_missing_or_unknown'],
    ['agree + two readers, one says poor', mcqItem({}), [g({}), g({ grade: 'poor' })], 'drop:reader_grade_poor'],
    // the rules could not compare the solver's answer
    ['undecided + reader agrees (text cannot be compared by rule)', { status: 'ready_for_read', solverOutcome: 'undecided', format: 'free', choices: [], key: 'observational study', question: 'q' }, [g({ blindAnswer: 'an observational one' })], 'export:reader_decided'],
    ['undecided + reader disagrees', { status: 'ready_for_read', solverOutcome: 'undecided', format: 'free', choices: [], key: 'observational study', question: 'q' }, [g({ agreesWithKey: false })], 'drop:reader_disagrees_with_key'],
    // disputed
    ['disagree + reader’s blind answer is the key + good', mcqItem({ status: 'solver_disagrees', solverOutcome: 'disagree' }), [g({})], 'export:reader_adjudicated'],
    ['ill-posed + reader’s blind answer is the key + acceptable', mcqItem({ status: 'solver_ill_posed', solverOutcome: 'ill-posed' }), [g({ grade: 'acceptable' })], 'export:reader_adjudicated'],
    ['disagree + reader says agrees but the blind answer is another option', mcqItem({ status: 'solver_disagrees', solverOutcome: 'disagree' }), [g({ blindAnswer: 'C' })], 'drop:reader_blind_answer_differs_from_key'],
    ['disagree + no blind answer', mcqItem({ status: 'solver_disagrees', solverOutcome: 'disagree' }), [g({ blindAnswer: '' })], 'drop:reader_gave_no_blind_answer'],
    ['disagree + reader does not reach the key', mcqItem({ status: 'solver_disagrees', solverOutcome: 'disagree' }), [g({ agreesWithKey: false, blindAnswer: 'C' })], 'drop:disputed_reader_does_not_reach_key'],
    ['disagree + poor', mcqItem({ status: 'solver_disagrees', solverOutcome: 'disagree' }), [g({ grade: 'poor' })], 'drop:reader_grade_poor'],
    ['disagree + corrected key', mcqItem({ status: 'solver_disagrees', solverOutcome: 'disagree' }), [g({ agreesWithKey: false, correctedKey: 'C' })], 'rewrite:reader_corrected_key'],
    ['disagree (numeric) + blind answer equals the key in another form', { status: 'solver_disagrees', solverOutcome: 'disagree', format: 'numeric', choices: [], key: '0.25', question: 'q' }, [g({ blindAnswer: '1/4' })], 'export:reader_adjudicated'],
    ['disagree (numeric) + blind answer is another number', { status: 'solver_disagrees', solverOutcome: 'disagree', format: 'numeric', choices: [], key: '0.25', question: 'q' }, [g({ blindAnswer: '0.4' })], 'drop:reader_blind_answer_differs_from_key'],
    // never exported
    ['rule-rejected, even if somebody graded it', mcqItem({ status: 'rules_rejected', solverOutcome: undefined }), [g({})], 'drop:rules_rejected'],
    ['withdrawn from its file', mcqItem({ superseded: true }), [g({})], 'drop:no_longer_in_written_file'],
  ];
  for (const [name, item, grades, want] of table) {
    const d = finalizeDecision(item, grades);
    const got = d.action === 'export' ? `export:${d.basis}` : `${d.action}:${d.reason}`;
    assert.equal(got, want, name);
  }
});

test('coverage after: have + exported against the target of 3', () => {
  const c = coverageAfter([{ pack: '000', ...pack }], new Map([[`${LO}.lo-1`, 2], [`${LO}.lo-3`, 1]]));
  assert.deepEqual(c.objectives.map((o) => [o.have, o.exported, o.after, o.meetsTarget]), [[1, 2, 3, true], [0, 0, 0, false], [0, 1, 1, false]]);
  assert.deepEqual(c.textOnly, { objectives: 2, meetTarget: 1, belowTarget: 1, with0: 0, exported: 3 });
  assert.equal(c.figureDependent.objectives, 1);
  assert.equal(c.target, 3);
});

console.log(`\ningest-core: ${passed} tests passed`);
