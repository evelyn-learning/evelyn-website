/**
 * Tests of key-form-core.ts. No database, no network.
 *
 *   cd apps/tutor && env -u MONGODB_URI npx tsx scripts/practice-fix/key-form-core.test.ts
 */
import '../lib/no-db-env';
import assert from 'node:assert/strict';
import { gradeNumericAnswer } from '../../src/lib/tutor/portal/numeric-answer-rule';
import { extraForms, stemEdit, stemInstruction, unroundedInSolution } from './key-form-core';

let passed = 0;
function test(name: string, fn: () => void): void {
  fn();
  passed += 1;
  console.log(`ok - ${name}`);
}
const forms = (answer: string, problemText: string, solutionText: string): string[] => extraForms({ answer, problemText, solutionText }).map((f) => `${f.kind}:${f.text}:${f.expect}`);
const accepts = (key: string, answer: string): boolean => { const v = gradeNumericAnswer(key, answer); return v.decided && v.correct; };

test('stemInstruction', () => {
  assert.deepEqual(stemInstruction('Give your answer to 2 decimal places.'), { rounding: true, fraction: false, decimal: false });
  assert.deepEqual(stemInstruction('Find cos(2φ) as a fraction.'), { rounding: false, fraction: true, decimal: false });
  assert.deepEqual(stemInstruction('rounded to the nearest cent'), { rounding: true, fraction: false, decimal: false });
  assert.deepEqual(stemInstruction('the surrounding atmospheric pressure is 1.15 atm … in kelvins.'), { rounding: false, fraction: false, decimal: false });
});

test('unroundedInSolution', () => {
  assert.equal(unroundedInSolution('63.62', '43.596 + 20.02 = 63.616 ≈ 63.62 amu'), '63.616');
  assert.equal(unroundedInSolution('0.69', 'D = 1 - 0.315 = 0.685, which rounds to 0.69.'), '0.685');
  assert.equal(unroundedInSolution('2.5', 't = 24.5/9.8 = 2.5 seconds'), null);
  assert.equal(unroundedInSolution('0.18', 'dh/dt = -9/(16π) ≈ -0.179 cm/s'), '0.179');
  assert.equal(unroundedInSolution('20/3', 'k = 6.667'), null);
});

test('extraForms: what a correct student could type', () => {
  assert.deepEqual(forms('0.68', 'Give your answer as a fraction.', 'cos(2φ) = 21/25 − 4/25 = 17/25.'), ['fraction-from-solution:17/25:accept', 'one-place-fewer:0.7:coarse']);
  assert.deepEqual(forms('20/3', 'What scalar multiple?', 'k = 20/3'), ['decimal-1dp:6.7:coarse', 'decimal-2dp:6.67:accept', 'decimal-3dp:6.667:accept']);
  assert.deepEqual(forms('101.9', 'Round your answer to 1 decimal place.', '3.50 mol × 29.1 kJ/mol = 101.85 kJ, which rounds to 101.9 kJ.'), ['unrounded-from-solution:101.85:accept']);
  assert.deepEqual(forms('36', 'what is the probability (as a percent)?', '= 36%'), ['percent-sign-spaced:36 %:accept']);
  assert.deepEqual(forms('5', 'Find x.', 'x = 5'), []);
  assert.deepEqual(forms('five', 'Find x.', 'x = 5'), []);
});

test('the product rule on those forms (what the report relies on)', () => {
  assert.equal(accepts('0.68', '17/25'), true); // a fraction answer to a decimal key
  assert.equal(accepts('0.68', '68%'), false);
  assert.equal(accepts('20/3', '6.67'), true);
  assert.equal(accepts('20/3', '6.7'), false);
  assert.equal(accepts('101.9', '101.85'), true);
  assert.equal(accepts('101.9', '101.8'), false); // the half-even reading of the tie
  assert.equal(accepts('0.69', '0.68'), false);
  assert.equal(accepts('0.69', '0.685'), true);
  assert.equal(accepts('275', '275.1'), false); // an integer key takes nothing but the same value
  assert.equal(accepts('275', '275.0'), true);
  assert.equal(accepts('0.565', '0.57'), false);
  assert.equal(accepts('35.45', '35.46'), false);
  assert.equal(accepts('1/729', '0.00'), true); // the weak spot noted in the report
  assert.equal(accepts('5', '5.0'), true);
});

test('stemEdit: append and replace, exact old and new', () => {
  assert.deepEqual(stemEdit('Find A, rounded to the nearest cent.', { type: 'append', text: ' Keep full calculator values until the final step.' }),
    { field: 'problemText', old: 'Find A, rounded to the nearest cent.', new: 'Find A, rounded to the nearest cent. Keep full calculator values until the final step.' });
  assert.deepEqual(stemEdit('calculate T in kelvins.', { type: 'replace', old: 'in kelvins.', new: 'in kelvins, to the nearest whole kelvin.' })?.new, 'calculate T in kelvins, to the nearest whole kelvin.');
  assert.equal(stemEdit('x', { type: 'withdraw' }), null);
  assert.throws(() => stemEdit('a b a', { type: 'replace', old: 'a', new: 'c' }), /occurs 2 time/);
  assert.throws(() => stemEdit('a', { type: 'replace', old: 'z', new: 'c' }), /occurs 0 time/);
  assert.throws(() => stemEdit('Find x. Keep it.', { type: 'append', text: ' Keep it.' }), /already holds/);
  assert.throws(() => stemEdit('Find x.', { type: 'append', text: 'Keep it.' }), /starts with one space/);
});

console.log(`\n${passed} tests passed`);
