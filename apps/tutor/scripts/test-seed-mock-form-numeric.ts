/**
 * Mock-form ingest — the numeric verify check (`solveMatchesNumericKey`,
 * scripts/lib/mock-form-numeric-match.ts, used by scripts/seed-mock-form.ts).
 *
 * The seeder's verify gate compares an independent solve with the item's key.
 * It must use the rule live scoring uses (src/lib/tutor/mock-exam/scoring.ts →
 * src/lib/tutor/portal/numeric-answer-rule.ts): equal at the key's written
 * precision, never "within 1%". Otherwise a key the live scorer rejects the
 * true answer for is ingested as verified.
 *
 * The seeder itself is NOT run or imported here (it connects to Mongo and
 * calls a model); its source is only read as text.
 *
 * No model calls, no database. Run: `npx tsx scripts/test-seed-mock-form-numeric.ts`
 */
import './lib/no-db-env';
import assert from 'node:assert/strict';
import * as fs from 'fs';
import * as path from 'path';
import { solveMatchesNumericKey } from './lib/mock-form-numeric-match';
import { answersMatch } from '../src/lib/tutor/mock-exam/scoring';

type Case = [key: string, solve: string, expected: boolean, note?: string];
const CASES: Case[] = [
  // equal values, any form
  ['42', '42', true],
  ['42', '42.0', true],
  ['42', '84/2', true],
  ['-7', '−7', true, 'typographic minus'],
  ['1200', '1,200', true],
  ['0.5', '1/2', true],
  // the old 1% band — every one of these used to pass
  ['42', '42.3', false, 'within 1% of the key'],
  ['42', '41.6', false],
  ['100', '100.9', false],
  ['5', '4.976', false],
  ['10.81', '10.80', false],
  ['0', '0.005', false, 'old absolute floor of 0.01'],
  ['1000', '1009', false],
  // a decimal key is a rounding: the unrounded solve agrees with it
  ['10.81', '10.8083', true],
  ['10.81', '10.8149', true],
  ['10.81', '10.8151', false],
  ['10.81', '10.8', false, 'fewer places than the key and not equal'],
  ['0.33', '1/3', true, 'an exact fraction within half a unit of the last place'],
  ['2.0', '2', true],
  ['2.0', '2.04', true],
  ['2.0', '2.06', false],
  // the solve must be ONE number
  ['42', '42 or 43', false],
  ['42', '', false],
  ['42', 'forty-two', false],
  ['3', '3/2', false],
  // the seeder's own requirement: the key is a plain number
  ['forty-two', 'forty-two', false, 'live scoring falls back to text equality; ingest does not'],
  ['42 cm', '42', false],
  ['', '', false],
];

let passed = 0;
for (const [key, solve, expected, note] of CASES) {
  assert.equal(solveMatchesNumericKey(key, solve), expected, `key "${key}" vs solve "${solve}"${note ? ` (${note})` : ''}`);
  passed++;
}
console.log(`  ✓ ${passed} key/solve cases`);

// For every plain-number key the ingest check IS the live scorer.
let agreed = 0;
for (const key of ['5', '-12', '10.81', '2.0', '0.125', '13/3', '0', '1000']) {
  for (const solve of ['5', '5.0', '4.99', '-12', '10.81', '10.805', '10.8', '2', '2.04', '0.125', '0.1251', '1/8', '13/3', '4.33', '4.3', '0', '1000', '1e3', '1,000', '999.9', 'x = 5', '5 m']) {
    assert.equal(solveMatchesNumericKey(key, solve), answersMatch({ responseFormat: 'numeric', answer: key }, solve), `key "${key}" vs "${solve}"`);
    agreed++;
  }
}
console.log(`  ✓ ${agreed} pairs: ingest check === live mock-exam scoring`);

// The seeder uses the helper and carries no tolerance of its own.
const src = fs.readFileSync(path.join(__dirname, 'seed-mock-form.ts'), 'utf8');
assert.match(src, /import \{ solveMatchesNumericKey \} from '\.\/lib\/mock-form-numeric-match';/);
assert.match(src, /const numericMatch = solveMatchesNumericKey;/);
assert.doesNotMatch(src, /\* 0\.01|Math\.max\(0\.01|function parseNum\b/, 'seed-mock-form.ts must not carry its own numeric tolerance');
assert.match(src, /numericMatch\(item\.answer, modelAnswer\)/);
console.log('  ✓ seed-mock-form.ts uses the shared check, no local tolerance');

console.log('\nall passed');
