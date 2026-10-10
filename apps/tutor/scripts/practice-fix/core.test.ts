/**
 * Tests of the pure correction logic (core.ts). No database, no network.
 *
 *   cd apps/tutor && env -u MONGODB_URI npx tsx scripts/practice-fix/core.test.ts
 */
import '../lib/no-db-env';
import assert from 'node:assert/strict';
import {
  applyChanges,
  buildApplyData,
  classifyChange,
  correctTextOf,
  renderDiffMarkdown,
  ruleFindings,
  spelledArithmetic,
  spellsFinalArithmetic,
  validateFixFile,
  type BankRow,
  type Change,
  type FixFile,
  type FixItem,
} from './core';

let passed = 0;
function test(name: string, fn: () => void): void {
  fn();
  passed += 1;
  console.log(`ok - ${name}`);
}

const ID = (s: string): string => `practice-gen.gen-00000000-0000-4000-8000-000000000000.lo-1.${s}`;
const numeric: BankRow = {
  id: ID('num1'), loId: 'gen-0.lo-1', problemText: 'A pump does 2700 J of work in 45 seconds. Calculate its power in watts.', answer: '60', responseFormat: 'numeric',
  choices: [], hints: ['Power is work done per unit time.', 'Use the formula P = W/t.', 'Divide 2700 by 45.'], solutionText: 'P = W/t = 2700/45 = 60 W.', difficulty: 1,
};
const mcq: BankRow = {
  id: ID('mcq1'), loId: 'gen-0.lo-1', problemText: 'Green light ejects no electrons from potassium but violet light does. Why?', answer: 'C', responseFormat: 'mcq',
  choices: ['Violet light is slower than green light', 'Violet light is more intense than green light', 'Each violet photon carries more energy', 'Violet light is heavier'],
  hints: ['Photon energy depends on frequency.', 'Recall E = hf.'], solutionText: 'Violet photons carry more energy than green photons.',
};
const free: BankRow = {
  id: ID('free1'), loId: 'gen-0.lo-1', problemText: 'Find cos(θ) for the 8-15-17 ladder triangle as a fraction.', answer: '8/17', responseFormat: 'free',
  choices: [], hints: ['cos = adjacent / hypotenuse.', 'Check if 8 and 17 share any common factors.'], solutionText: 'cos θ = 8/17.',
};
const rows = new Map([numeric, mcq, free].map((r) => [r.id, r]));
const ctx = { rows, servedIds: new Set(rows.keys()), withdrawnIds: new Set<string>() };

const item = (row: BankRow, changes: Change[], extra: Partial<FixItem> = {}): FixItem => ({
  id: row.id, suffix: row.id.split('.').pop() as string, kind: 'fix', subject: 'PHYSICS', skill: 'Work and Power', format: row.responseFormat,
  category: 'truth', confidence: 'high', whatWasWrong: 'test', keyChanged: changes.some((c) => c.field === 'answer'), changes, ...extra,
});
const file = (...items: FixItem[]): FixFile => ({ formatVersion: 1, items });
const codes = (f: FixFile, level: 'error' | 'warning' = 'error'): string[] => validateFixFile(f, ctx).issues.filter((i) => i.level === level).map((i) => i.code);
const hint2: Change = { field: 'hints', index: 2, old: 'Divide 2700 by 45.', new: 'Check the units: J ÷ s gives W.' };

test('classifyChange: change / already / mismatch, both directions', () => {
  assert.deepEqual(classifyChange(numeric, hint2), { state: 'change' });
  const after = applyChanges(numeric, [hint2]);
  assert.deepEqual(classifyChange(after, hint2), { state: 'already' });
  assert.deepEqual(classifyChange(after, hint2, 'revert'), { state: 'change' });
  assert.equal(classifyChange({ ...numeric, hints: ['a', 'b', 'c!'] }, hint2).state, 'mismatch');
  assert.equal(classifyChange({ ...numeric, hints: ['a', 'b'] }, hint2).state, 'mismatch');
  assert.equal(classifyChange({ ...numeric, hints: null }, hint2).state, 'mismatch');
  assert.equal(classifyChange({ ...numeric, answer: 60 }, { field: 'answer', index: null, old: '60', new: '61' }).state, 'mismatch');
});

test('applyChanges: only the listed fields change; input untouched; revert restores', () => {
  const changes: Change[] = [hint2, { field: 'solutionText', index: null, old: numeric.solutionText, new: 'P = 60 W.' }];
  const after = applyChanges(numeric, changes);
  assert.equal(after.hints[2], hint2.new);
  assert.equal(after.solutionText, 'P = 60 W.');
  assert.deepEqual({ ...after, hints: numeric.hints, solutionText: numeric.solutionText }, numeric);
  assert.equal(numeric.hints[2], 'Divide 2700 by 45.');
  assert.deepEqual(applyChanges(after, changes, 'revert'), numeric);
  assert.throws(() => applyChanges(after, changes), /already in its target state/);
  assert.throws(() => applyChanges({ ...numeric, solutionText: 'x' }, changes), /stored value differs/);
});

test('spelledArithmetic / spellsFinalArithmetic', () => {
  assert.equal(spellsFinalArithmetic('Divide 2700 by 45.', '60'), 'Divide 2700 by 45');
  assert.equal(spellsFinalArithmetic('Compute 4 × 6 × 3.', '72'), '4 * 6 * 3');
  assert.equal(spellsFinalArithmetic('Average the two volumes: (30 + 38)/2.', '34'), '(30 + 38)/2');
  assert.equal(spellsFinalArithmetic('t = 24.5 / 9.8', '2.5'), '24.5 / 9.8');
  assert.equal(spellsFinalArithmetic('60,000 × 0.25 = ?', '15000'), '60000 * 0.25');
  assert.equal(spellsFinalArithmetic('Compute 2 raised to the 7th power.', '128'), '2 raised to the 7');
  assert.equal(spellsFinalArithmetic('1 divided by 0.05', '20'), '1 divided by 0.05');
  assert.equal(spellsFinalArithmetic('Simplify the fraction 14/(-4).', '-3.5'), '14/(-4)');
  assert.equal(spellsFinalArithmetic('5/6 rounds to two places', '0.83'), '5/6');
  assert.equal(spellsFinalArithmetic('Check the units: J ÷ s gives W.', '60'), null);
  assert.equal(spellsFinalArithmetic('Use h = ½gt² to solve for time.', '2'), null);
  assert.equal(spellsFinalArithmetic('Divide 2700 by 45.', 'sixty'), null);
  assert.deepEqual(spelledArithmetic('2 + 3 * 4').map((a) => a.value), [14]);
  assert.deepEqual(spelledArithmetic('2^3^2').map((a) => a.value), [512]);
});

test('ruleFindings: the item rules', () => {
  assert.deepEqual(ruleFindings(numeric).map((f) => f.code), ['hint_final_arithmetic']);
  assert.deepEqual(ruleFindings({ ...numeric, hints: ['Try 60.'] }).map((f) => f.code), ['hint_contains_key']);
  assert.deepEqual(ruleFindings({ ...numeric, hints: [], problemText: 'It is 60 W. What is it?' }).map((f) => f.code), ['stem_contains_key']);
  assert.deepEqual(ruleFindings({ ...numeric, hints: [], answer: '60 W' }).map((f) => f.code), ['numeric_key_not_bare_number']);
  assert.deepEqual(ruleFindings(mcq), []);
  assert.equal(correctTextOf(mcq), 'Each violet photon carries more energy');
  assert.deepEqual(ruleFindings({ ...mcq, answer: 'E' }).map((f) => f.code), ['mcq_key_not_an_option']);
  assert.deepEqual(ruleFindings({ ...mcq, choices: [mcq.choices[0], mcq.choices[0].toUpperCase(), mcq.choices[2], mcq.choices[3]] }).map((f) => f.code), ['mcq_options_not_distinct']);
  assert.deepEqual(ruleFindings({ ...mcq, choices: mcq.choices.slice(0, 2), answer: 'A' }).map((f) => f.code), ['mcq_option_count_not_4']);
  assert.deepEqual(ruleFindings({ ...mcq, solutionText: 'Option C is correct.' }).map((f) => f.code), ['option_referenced_by_position']);
  assert.deepEqual(ruleFindings({ ...mcq, hints: ['Each violet photon carries more energy than a green one.'] }).map((f) => f.code), ['hint_contains_key']);
  assert.deepEqual(ruleFindings(free), []); // "8 and 17" is not the key verbatim — a reader's call, not a rule
  assert.deepEqual(ruleFindings({ ...free, hints: ['The ratio is 8/17.'] }).map((f) => f.code), ['hint_contains_key']);
});

test('validate: a clean hint repair and a clean fix resolve', () => {
  const v = validateFixFile(file(item(numeric, [hint2], { kind: 'hint-repair' })), ctx);
  assert.equal(v.ok, true, JSON.stringify(v.issues));
  assert.equal(v.resolved.length, 1);
  assert.equal(v.resolved[0].after.hints[2], hint2.new);
  assert.deepEqual(v.totals.byField, { hints: 1 });
});

test('validate: old must equal the export; new must differ; one change per field', () => {
  assert.deepEqual(codes(file(item(numeric, [{ ...hint2, old: 'Divide 2700 by 45' }]))), ['old_mismatch']);
  assert.deepEqual(codes(file(item(numeric, [{ ...hint2, new: hint2.old }]))), ['no_change', 'old_mismatch'].slice(0, 1));
  assert.deepEqual(codes(file(item(numeric, [hint2, hint2]))), ['duplicate_change']);
  assert.deepEqual(codes(file(item(numeric, [{ ...hint2, index: 7 }]))), ['old_mismatch']);
  assert.deepEqual(codes(file(item(numeric, [{ ...hint2, index: null }]))), ['bad_index']);
  assert.deepEqual(codes(file(item(numeric, [{ field: 'topic' as never, index: null, old: 'a', new: 'b' }]))), ['bad_field']);
  assert.deepEqual(codes(file(item(numeric, [{ ...hint2, new: '  ' }]))), ['empty_new']);
  assert.deepEqual(codes(file(item(numeric, [hint2]), item(numeric, [hint2]))), ['duplicate_item']);
  assert.deepEqual(codes(file(item({ ...numeric, id: ID('zzz') }, [hint2]))), ['unknown_row']);
  assert.deepEqual(codes(file(item({ ...numeric, id: 'cphq-demo-mc-028' }, [hint2]))), ['bad_id', 'unknown_row']);
});

test('validate: served / withdrawn / scope rules', () => {
  assert.deepEqual(validateFixFile(file(item(numeric, [hint2])), { ...ctx, servedIds: new Set() }).issues.map((i) => i.code), ['not_served']);
  assert.deepEqual(validateFixFile(file(item(numeric, [hint2])), { ...ctx, withdrawnIds: new Set([numeric.id]) }).issues.map((i) => i.code), ['withdrawn_row']);
  assert.deepEqual(codes(file(item(numeric, [hint2, { field: 'solutionText', index: null, old: numeric.solutionText, new: 'x' }], { kind: 'hint-repair' }))), ['hint_repair_scope']);
});

test('validate: key changes need the flag and the working', () => {
  const key: Change = { field: 'answer', index: null, old: '60', new: '61' };
  assert.deepEqual(codes(file(item(numeric, [hint2, key], { keyChanged: false }))), ['key_flag']);
  assert.deepEqual(codes(file(item(numeric, [hint2], { keyChanged: true, working: 'w' }))), ['key_flag']);
  assert.deepEqual(codes(file(item(numeric, [hint2, key]))), ['key_working_missing']);
  assert.deepEqual(codes(file(item(numeric, [hint2, key], { working: '2745/45 = 61' }))), []);
  assert.equal(validateFixFile(file(item(numeric, [hint2, key], { working: 'w' })), ctx).totals.keyChanges, 1);
});

test('validate: a fix answers for the whole row; a hint repair for its own hints', () => {
  // fix that leaves the giveaway hint in place → error
  const sol: Change = { field: 'solutionText', index: null, old: numeric.solutionText, new: 'P = W/t = 60 W.' };
  assert.deepEqual(codes(file(item(numeric, [sol]))), ['hint_final_arithmetic']);
  // the same row as a hint repair of ANOTHER hint → the stored giveaway is a warning only
  const h0: Change = { field: 'hints', index: 0, old: numeric.hints[0], new: 'Power is the rate of doing work.' };
  const v = validateFixFile(file(item(numeric, [h0], { kind: 'hint-repair' })), ctx);
  assert.equal(v.ok, true);
  assert.deepEqual(v.issues.map((i) => i.code), ['hint_final_arithmetic_as_stored']);
  // a repaired hint that still prints the key → error
  assert.deepEqual(codes(file(item(numeric, [{ ...hint2, new: 'The answer is 60.' }], { kind: 'hint-repair' }))), ['hint_contains_key']);
  // new stem that prints the key → error unless waived; a waiver that is not needed is an error
  const stem: Change = { field: 'problemText', index: null, old: numeric.problemText, new: 'A 60 kg pump does 2700 J of work in 45 seconds. Calculate its power in watts.' };
  assert.deepEqual(codes(file(item(numeric, [stem, hint2]))), ['stem_contains_key']);
  const waived = validateFixFile(file(item(numeric, [stem, hint2], { waivers: { stemContainsKey: 'mass, not power' } })), ctx);
  assert.equal(waived.ok, true);
  assert.deepEqual(waived.issues.map((i) => i.code), ['waived_stem_contains_key']);
  assert.deepEqual(codes(file(item(numeric, [hint2], { waivers: { stemContainsKey: 'x' } }))), ['stale_waiver']);
});

test('validate: mcq invariants after the change', () => {
  const c1: Change = { field: 'choices', index: 1, old: mcq.choices[1], new: 'Violet light is more intense than red light' };
  assert.deepEqual(codes(file(item(mcq, [c1]))), []);
  assert.deepEqual(codes(file(item(mcq, [{ ...c1, new: mcq.choices[0] }]))), ['mcq_options_not_distinct']);
  assert.deepEqual(codes(file(item(mcq, [{ field: 'solutionText', index: null, old: mcq.solutionText, new: 'The third option is right.' }]))), ['option_referenced_by_position']);
  assert.deepEqual(codes(file(item(mcq, [{ field: 'answer', index: null, old: 'C', new: 'F' }], { working: 'w' }))), ['mcq_key_not_an_option']);
  // five options as stored: reported, never an error
  const five: BankRow = { ...mcq, id: ID('mcq5'), choices: [...mcq.choices, 'Linear'] };
  const v = validateFixFile(file(item(five, [{ field: 'solutionText', index: null, old: mcq.solutionText, new: 'Each violet photon has more energy.' }])), { ...ctx, rows: new Map([[five.id, five]]), servedIds: new Set([five.id]) });
  assert.equal(v.ok, true);
  assert.deepEqual(v.issues.map((i) => i.code), ['mcq_option_count_not_4']);
});

test('validate: a numeric key stays a bare number', () => {
  assert.deepEqual(codes(file(item(numeric, [hint2, { field: 'answer', index: null, old: '60', new: '60 W' }], { working: 'w' }))), ['numeric_key_not_bare_number']);
});

test('buildApplyData: sorted rows, counts, array lengths; the diff names every change', () => {
  const v = validateFixFile(file(item(numeric, [hint2], { kind: 'hint-repair' }), item(mcq, [{ field: 'choices', index: 1, old: mcq.choices[1], new: 'Violet light is brighter' }])), ctx);
  const data = buildApplyData(v.resolved);
  assert.deepEqual(data.counts, { rows: 2, fields: 2, keyChanges: 0 });
  assert.deepEqual(data.rows.map((r) => r.suffix), ['mcq1', 'num1']);
  assert.deepEqual(data.rows[0].arrayLengths, { hints: 2, choices: 4 });
  assert.equal(data.database, 'evelyn');
  assert.equal(data.collection, 'problembanks');
  const md = renderDiffMarkdown(v, 'test');
  assert.match(md, /\| PHYSICS \|/);
  assert.match(md, /…num1 — Work and Power/);
  assert.match(md, /\*\*Hint 3\*\* — old:\n\n> Divide 2700 by 45\.\n\nnew:\n\n> Check the units/);
  assert.match(md, /\*\*Option B\*\*/);
  assert.match(md, /key changed: \*\*no\*\*/);
});

console.log(`\n${passed} tests passed`);
