/**
 * Tests for scripts/audit/compare.ts (pure — no network, no DB).
 * Run from apps/tutor:  npx tsx scripts/audit/compare.test.ts
 */
import assert from 'node:assert/strict';
import {
  afterStage2,
  afterTiebreak,
  compareDeterministic,
  compareMcq,
  csvCell,
  keyedLetterOf,
  normalizeItem,
  numbersAgree,
  parseSimpleNumber,
  parseWorklist,
  plannedCalls,
  resolveOptionLetter,
  solverViewOf,
} from './compare';
import { buildSolverPrompt } from './prompts';

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
const det = (k: string, s: string) => compareDeterministic(k, s).result;

// ── worklist shapes ─────────────────────────────────────────────────────────
t('tuple row, string choices', () => {
  const it = normalizeItem('a1', ['ALGEBRA_1', 'bank', 'mcq', 'Solve: |x - 4| = 7', 'A', ['x = 11 or x = -3', 'x = 11 or x = 3']]);
  assert.equal(it.course, 'ALGEBRA_1');
  assert.deepEqual(it.choices.map((c) => c.letter), ['A', 'B']);
  assert.equal(it.key, 'A');
  assert.equal(it.rubric, null);
});
t('tuple row, null key and null choices', () => {
  const it = normalizeItem('f1', ['AP_US_GOVERNMENT', 'seedtry', 'frq', 'Explain…', null, null]);
  assert.equal(it.key, null);
  assert.deepEqual(it.choices, []);
});
t('object row with rubric', () => {
  const it = normalizeItem('o1', { course: 'C', source: 's', format: 'frq', question: 'Q', expectedAnswer: '', rubric: 'two points' });
  assert.equal(it.key, null);
  assert.equal(it.rubric, 'two points');
});
t('parseWorklist: object keyed by id, and array', () => {
  assert.equal(parseWorklist({ x: ['C', 's', 'free', 'Q', 'K', null] })[0].id, 'x');
  assert.equal(parseWorklist([{ id: 'y', course: 'C', source: 's', format: 'free', question: 'Q', key: 'K' }])[0].id, 'y');
});

// ── MCQ key resolution (correctChoiceIdOf rule) ─────────────────────────────
const strChoices = normalizeItem('m', ['C', 'bank', 'mcq', 'Q', 'B', ['144', '6', '24', '36']]);
const objChoices = normalizeItem('m2', [
  'C', 'seedtry', 'mcq', 'Q', 'x = 4',
  [{ id: 'a', text: 'x = 4', correct: true }, { id: 'b', text: 'x = −4' }, { id: 'c', text: 'x = 6/5' }],
]);
t('key as a letter', () => assert.deepEqual(keyedLetterOf(strChoices), { letter: 'B', via: 'letter' }));
t('key as lower-case letter', () => assert.equal(keyedLetterOf({ ...strChoices, key: 'd' }).letter, 'D'));
t('key as option text', () => assert.deepEqual(keyedLetterOf({ ...strChoices, key: ' 36 ' }), { letter: 'D', via: 'text' }));
t('correct flag wins, agrees with key text', () => assert.deepEqual(keyedLetterOf(objChoices), { letter: 'A', via: 'flag' }));
t('correct flag with no key', () => assert.equal(keyedLetterOf({ ...objChoices, key: null }).letter, 'A'));
t('flag and key text disagree → conflict reported', () => {
  const k = keyedLetterOf({ ...objChoices, key: 'x = 6/5' });
  assert.equal(k.letter, 'A');
  assert.match(k.conflict ?? '', /resolves to C/);
});
t('options differing only by case resolve case-sensitively', () => {
  const g = normalizeItem('g', ['BIOLOGY', 'seedtry', 'mcq', 'Q', 'Both parents are Bb',
    [{ id: 'a', text: 'Both parents are BB' }, { id: 'b', text: 'Both parents are Bb', correct: true }]]);
  assert.deepEqual(keyedLetterOf(g), { letter: 'B', via: 'flag' });
  assert.equal(keyedLetterOf({ key: 'both parents are bb', choices: g.choices.map((c) => ({ ...c, correct: undefined })) }).letter, null);
});
t('two flagged options → unresolvable', () => {
  const two = { key: null, choices: objChoices.choices.map((c, i) => ({ ...c, correct: i < 2 })) };
  assert.equal(keyedLetterOf(two).letter, null);
});
t('letter out of range / unknown text → unresolvable', () => {
  assert.equal(keyedLetterOf({ ...strChoices, key: 'E' }).letter, null);
  assert.equal(keyedLetterOf({ ...strChoices, key: '37' }).letter, null);
});
t('solver letter shapes', () => {
  const ch = strChoices.choices;
  assert.equal(resolveOptionLetter('C', ch), 'C');
  assert.equal(resolveOptionLetter('(c)', ch), 'C');
  assert.equal(resolveOptionLetter('Option D.', ch), 'D');
  assert.equal(resolveOptionLetter('B) 6', ch), 'B');
  assert.equal(resolveOptionLetter('36', ch), 'D');
  assert.equal(resolveOptionLetter('F', ch), null);
  assert.equal(resolveOptionLetter('none of these', ch), null);
});
t('compareMcq', () => {
  assert.equal(compareMcq('A', 'A').result, 'same');
  assert.equal(compareMcq('A', 'C').result, 'different');
  assert.equal(compareMcq(null, 'C').result, 'unknown');
  assert.equal(compareMcq('A', null).result, 'unknown');
});

// ── numbers ─────────────────────────────────────────────────────────────────
t('parseSimpleNumber accepts single numbers', () => {
  assert.equal(parseSimpleNumber('13/3')!.value, 13 / 3);
  assert.equal(parseSimpleNumber('x = 13/3')!.value, 13 / 3);
  assert.equal(parseSimpleNumber('−4')!.value, -4);
  assert.equal(parseSimpleNumber('$4.50')!.value, 4.5);
  assert.equal(parseSimpleNumber('1,200')!.value, 1200);
  assert.equal(parseSimpleNumber('50%')!.value, 0.5);
  assert.equal(parseSimpleNumber('.5')!.value, 0.5);
  const u = parseSimpleNumber('38.4 N·s')!;
  assert.equal(u.value, 38.4);
  assert.equal(u.unit, 'ns');
  assert.equal(parseSimpleNumber('9.8 m/s^2')!.value, 9.8);
});
t('parseSimpleNumber rejects anything richer', () => {
  for (const s of ['−2x + 8', '2x', '3 or 5', 'x = 2 or x = 4', '3 × 10^8 m/s', '√2', '(2, 3)', 'Dotplot only', '', '5 and 7', '2 3']) {
    assert.equal(parseSimpleNumber(s), null, s);
  }
});
t('tolerance is max(0.01, 1%)', () => {
  assert.ok(numbersAgree(100, 100.9));
  assert.ok(!numbersAgree(100, 101.5));
  assert.ok(numbersAgree(0.333, 1 / 3));
  assert.ok(!numbersAgree(0.3, 1 / 3));
});
t('the client-reported item: key 11 vs 13/3 is DIFFERENT', () => {
  assert.equal(det('11', '13/3'), 'different');
  assert.equal(det('11', 'x = 13/3'), 'different');
  assert.equal(det('13/3', 'x = 4.33'), 'same');
});
t('numeric same / different / unknown', () => {
  assert.equal(det('9', '9'), 'same');
  assert.equal(det('9', 'x = 9'), 'same');
  assert.equal(det('38.4 N·s', '38.4 N·s'), 'same');
  assert.equal(det('38.4 N·s', '38.4'), 'same');
  assert.equal(det('0.5', '50%'), 'same');
  assert.equal(det('50', '50%'), 'same');
  assert.equal(det('5', '-5'), 'different');
  assert.equal(det('2 m', '200 cm'), 'unknown'); // units may explain it → judge
  assert.equal(det('5 m', '5 cm'), 'unknown');
  assert.equal(det('12', '3 or 4'), 'unknown');
});
t('sign and operators are never normalised away', () => {
  assert.notEqual(det('−2x + 8', '2x + 8'), 'same');
  assert.notEqual(det('x^-2', 'x^2'), 'same');
  assert.equal(det('−2x + 8', '-2x+8'), 'same');
  assert.equal(det('Dotplot only', 'dotplot only.'), 'same');
  assert.equal(det('Dotplot only', 'A dotplot'), 'unknown');
});

// ── relations ───────────────────────────────────────────────────────────────
t('inequalities use the exact relation comparator', () => {
  assert.equal(det('x < 5', '5 > x'), 'same');
  assert.equal(det('x ≤ 5', 'x <= 5'), 'same');
  assert.equal(det('-8 <= x <= 4', '−8 ≤ x ≤ 4'), 'same');
  assert.equal(det('x < 5', 'x <= 5'), 'different');
  assert.equal(det('x > 3', 'x < 3'), 'different');
  assert.equal(det('x < -4 or x > 5', 'x > 5 or x < -4'), 'unknown'); // compound → judge
});

// ── verdict logic ───────────────────────────────────────────────────────────
t('stage-2 routing', () => {
  assert.equal(afterStage2(false, 'SAME'), 'KEY_OK');
  assert.equal(afterStage2(false, 'KEY_INCOMPLETE'), 'KEY_INCOMPLETE');
  assert.equal(afterStage2(false, 'DIFFERENT'), 'TIEBREAK');
  assert.equal(afterStage2(false, 'CANNOT_JUDGE'), 'TIEBREAK');
  assert.equal(afterStage2(true, 'SAME'), 'TIEBREAK');
});
t('tie-break verdicts', () => {
  const v = (x: Parameters<typeof afterTiebreak>[0]) => afterTiebreak(x).verdict;
  assert.equal(afterTiebreak({ blindIllPosed: false, tiebreakIllPosed: false, vsKey: 'SAME' }).outcome, 'KEY_OK_SOLVER_ERRED');
  assert.equal(v({ blindIllPosed: false, tiebreakIllPosed: false, vsKey: 'SAME' }), 'KEY_OK');
  assert.equal(v({ blindIllPosed: false, tiebreakIllPosed: false, vsKey: 'DIFFERENT', vsBlind: 'SAME' }), 'KEY_WRONG');
  assert.equal(v({ blindIllPosed: false, tiebreakIllPosed: false, vsKey: 'DIFFERENT', vsBlind: 'DIFFERENT' }), 'NEEDS_HUMAN');
  assert.equal(v({ blindIllPosed: false, tiebreakIllPosed: false, vsKey: 'DIFFERENT', vsBlind: 'SAME', solverAssumed: true }), 'NEEDS_HUMAN');
  assert.equal(v({ blindIllPosed: false, tiebreakIllPosed: true }), 'NEEDS_HUMAN');
  assert.equal(v({ blindIllPosed: true, tiebreakIllPosed: true }), 'ILL_POSED');
  assert.equal(v({ blindIllPosed: true, tiebreakIllPosed: false, vsKey: 'SAME' }), 'KEY_OK');
  assert.equal(v({ blindIllPosed: true, tiebreakIllPosed: false, vsKey: 'DIFFERENT' }), 'NEEDS_HUMAN');
  assert.equal(v({ blindIllPosed: false, tiebreakIllPosed: false, vsKey: 'KEY_INCOMPLETE' }), 'KEY_INCOMPLETE');
  assert.equal(v({ blindIllPosed: false, tiebreakIllPosed: false, vsKey: 'CANNOT_JUDGE', vsBlind: 'CANNOT_JUDGE' }), 'NEEDS_HUMAN');
});

// ── the stored key can never reach a solver prompt ──────────────────────────
t('solver view + prompt carry no key and no correct flag', () => {
  const SENTINEL = 'ZZ-SECRET-KEY-93417';
  const free = normalizeItem('s1', ['C', 'gentry', 'free', 'What is the impulse?', SENTINEL, null]);
  const view = solverViewOf(free);
  assert.ok(!JSON.stringify(view).includes(SENTINEL));
  assert.ok(!('key' in view));
  const p = buildSolverPrompt(view);
  assert.ok(!(p.system + p.user).includes(SENTINEL));

  const mv = solverViewOf(objChoices);
  assert.ok(!JSON.stringify(mv).includes('correct'));
  const mp = buildSolverPrompt(mv);
  assert.ok(mp.user.includes('A) x = 4') && mp.user.includes('B) x = −4'));
  assert.ok(!/correct"?\s*:\s*true/.test(mp.user));

  const letterKeyed = normalizeItem('s2', ['C', 'bank', 'mcq', 'Pick one', 'D', ['p', 'q', 'r', 's']]);
  assert.ok(!/key|keyed|expected/i.test(buildSolverPrompt(solverViewOf(letterKeyed)).user));
});

// ── misc ────────────────────────────────────────────────────────────────────
t('plannedCalls', () => {
  assert.deepEqual(plannedCalls(strChoices, false), { min: 1, kind: 'mcq' });
  assert.equal(plannedCalls(normalizeItem('n', ['C', 'bank', 'numeric', 'Q', '13', []]), false).kind, 'numeric');
  assert.deepEqual(plannedCalls(normalizeItem('f', ['C', 'gentry', 'free', 'Q', 'K', null]), false), { min: 2, kind: 'text' });
  assert.equal(plannedCalls(normalizeItem('f', ['C', 'gentry', 'free', 'Q', 'K', null]), true).min, 1);
  assert.equal(plannedCalls(normalizeItem('r', ['C', 'seedtry', 'frq', 'Q', null, null]), false).kind, 'review');
});
t('csvCell', () => {
  assert.equal(csvCell('plain'), 'plain');
  assert.equal(csvCell('a,b'), '"a,b"');
  assert.equal(csvCell('say "hi"'), '"say ""hi"""');
  assert.equal(csvCell('two\nlines'), 'two ⏎ lines');
  assert.equal(csvCell(null), '');
});

console.log(`compare.test.ts: ${n} tests passed`);
