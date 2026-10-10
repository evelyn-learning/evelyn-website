/**
 * Mock-exam numeric scoring — `answersMatch` for `responseFormat: 'numeric'`.
 *
 * A mock exam grades a numeric item deterministically (no model judge), with
 * the SAME reader and rule as practice answers
 * (src/lib/tutor/portal/numeric-answer-rule.ts): the answer is correct when it
 * EQUALS the key at the precision the key is written to — never when it is
 * merely close. Before 2026-10-10 this path used `parseFloat` on both sides
 * and a 1% relative tolerance, so it read only the LEADING number of an answer
 * ("3/2" was 3, "1,200" was 1) and accepted any value within 1% of the key.
 *
 * Exam-specific decisions pinned here (there is no judge to hand an undecided
 * answer to, so every case must get a verdict):
 *   - an answer that is not ONE number is wrong;
 *   - a unit written after the number is ignored (the item asks for a number
 *     and nothing here can check a unit);
 *   - ONE key per item (`answer: string`); there is no multiple-key syntax;
 *   - a key that is not a plain number is read by the same reader; a key that
 *     is not a number at all falls back to exact text equality.
 *
 * No model calls, no database. Run: `npx tsx scripts/test-mock-exam-numeric-scoring.ts`
 */
import './lib/no-db-env';
import assert from 'node:assert/strict';
import { answersMatch, scoreMcqSections } from '../src/lib/tutor/mock-exam/scoring';
import { getBlueprint } from '../src/lib/tutor/mock-exam/blueprints';
import { FIXTURE_ITEMS } from '../src/lib/tutor/mock-exam/fixtures';

type Case = [key: string, given: string | undefined, expected: boolean, note?: string];

const GROUPS: Array<{ name: string; cases: Case[] }> = [
  {
    name: 'plain integers and decimals',
    cases: [
      ['42', '42', true],
      ['42', '43', false],
      ['42', '42.0', true, 'same value, other form'],
      ['10.81', '10.81', true],
      ['10.81', '10.8', false, 'fewer places than the key and not equal'],
      ['2.5', '2.5', true],
      ['0', '0', true],
      ['0', '0.0', true],
      ['0', '0.000000001', false],
    ],
  },
  {
    name: 'leading and trailing zeros',
    cases: [
      ['42', '042', true],
      ['0.5', '.5', true],
      ['0.5', '0.50', true],
      ['2.50', '2.5', true, 'equal value with fewer places'],
      ['42', '42.', true, 'trailing full stop'],
    ],
  },
  {
    name: 'thousands separators',
    cases: [
      ['1200', '1,200', true, 'parseFloat read 1'],
      ['1200', '1,2000', false],
      ['1', '1,200', false, 'parseFloat read 1 and accepted it'],
      ['1250000', '1,250,000', true],
    ],
  },
  {
    name: 'a unit after the number (ignored: nothing here can check it)',
    cases: [
      ['42', '42 cm', true],
      ['42', '42cm', true],
      ['9.8', '9.8 m/s^2', true],
      ['42', '43 cm', false],
      ['42', '$42', true, 'currency sign'],
    ],
  },
  {
    name: 'percent sign (the number as written, not divided by 100)',
    cases: [
      ['25', '25%', true],
      ['25', '25 %', true],
      ['0.25', '25%', false],
    ],
  },
  {
    name: 'fractions',
    cases: [
      ['1.5', '3/2', true, 'parseFloat read 3'],
      ['3', '3/2', false, 'parseFloat read 3 and accepted it'],
      ['0.5', '1/2', true],
      ['4.33', '13/3', true, 'exact value within half a unit of the key\'s last place'],
      ['3/2', '1.5', true, 'fraction key'],
      ['3/2', '6/4', true],
      ['13/3', '4.33', true, 'fraction key, answer rounded to 2+ places'],
      ['13/3', '4.3', false, 'fraction key, one place is too coarse'],
      ['1.5', '1 1/2', false, 'a mixed number is two numbers'],
      ['1', '1 1/2', false, 'parseFloat read 1 and accepted it'],
      ['1.5', '3/0', false],
    ],
  },
  {
    name: 'negatives',
    cases: [
      ['-5', '-5', true],
      ['-5', '5', false],
      ['5', '-5', false],
      ['-5', '−5', true, 'typographic minus; parseFloat gave NaN'],
      ['-0.25', '-.25', true],
      ['-1.5', '-3/2', true],
    ],
  },
  {
    name: 'scientific notation',
    cases: [
      ['1200', '1.2e3', true],
      ['1200', '1.2 × 10^3', true, 'parseFloat read 1.2'],
      ['1200', '1.2 x 10^3', true],
      ['1.2', '1.2 × 10^3', false, 'parseFloat read 1.2 and accepted it'],
      ['0.000012', '1.2e-5', true],
      ['0.000012', '1.3e-5', false],
    ],
  },
  {
    name: 'whitespace and an identifier prefix',
    cases: [
      ['42', '  42  ', true],
      ['42', '\t42\n', true],
      ['  42 ', '42', true, 'whitespace in the key'],
      ['-5', '- 5', true],
      ['42', 'x = 42', true, 'parseFloat gave NaN'],
      ['42', '4 2', false],
    ],
  },
  {
    name: 'wrong but close (equal, never "close")',
    cases: [
      ['42', '42.2', false, 'was accepted: within 1%'],
      ['42', '41.9', false, 'was accepted: within 1%'],
      ['1000', '1005', false, 'was accepted: within 1%'],
      ['1000', '995', false, 'was accepted: within 1%'],
      ['5', '4.976', false, 'was accepted: within 1%'],
      ['10.81', '10.80', false, 'was accepted: within 1%'],
      ['10.81', '10.9', false, 'was accepted: within 1%'],
      ['10.81', '10.812', true, 'more places, rounds to the key'],
      ['10.81', '10.816', false, 'more places, rounds to 10.82'],
      ['42', '44', false],
    ],
  },
  {
    name: 'more than one number, words, nothing',
    cases: [
      ['42', '42 or 43', false, 'parseFloat read 42 and accepted it'],
      ['2', '2-3', false, 'parseFloat read 2 and accepted it'],
      ['2', '2,5', false, 'parseFloat read 2 and accepted it'],
      ['42', 'forty-two', false],
      ['42', '', false],
      ['42', '   ', false],
      ['42', undefined, false],
    ],
  },
  {
    name: 'the key: one key per item, read by the same reader',
    cases: [
      ['1,200', '1200', true, 'parseFloat read the key as 1'],
      ['1,200', '1', false, 'parseFloat read the key as 1 and accepted it'],
      ['1.2e3', '1200', true],
      ['25%', '25', true],
      ['42 cm', '42', true],
      // No multiple-key syntax exists: such a key is text, matched only verbatim.
      ['3/2 or 1.5', '3', false, 'parseFloat read the key as 3 and accepted it'],
      ['3/2 or 1.5', '1.5', false],
      ['3/2 or 1.5', '3/2 OR 1.5', true, 'text fallback, case-insensitive'],
      ['n/a', 'N/A', true, 'text fallback'],
      ['n/a', '0', false],
    ],
  },
];

let passed = 0;
let failed = 0;

for (const group of GROUPS) {
  const failures: string[] = [];
  for (const [key, given, expected, note] of group.cases) {
    const got = answersMatch({ responseFormat: 'numeric', answer: key }, given);
    if (got !== expected) {
      failures.push(
        `key ${JSON.stringify(key)}, answer ${JSON.stringify(given)}: expected ${expected ? 'correct' : 'wrong'}, got ${got ? 'correct' : 'wrong'}${note ? ` (${note})` : ''}`,
      );
    }
  }
  if (failures.length === 0) {
    passed++;
    console.log(`  ✓ ${group.name} (${group.cases.length})`);
  } else {
    failed++;
    console.error(`  ✗ ${group.name} (${failures.length}/${group.cases.length} failed)`);
    for (const f of failures) console.error(`      ${f}`);
  }
}

function test(name: string, fn: () => void) {
  try {
    fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    failed++;
    console.error(`  ✗ ${name}`);
    console.error(`      ${(err as Error).message}`);
  }
}

test('mcq and text items are graded exactly as before', () => {
  const mcq = (answer: string, given: string | undefined) => answersMatch({ responseFormat: 'mcq', answer }, given);
  assert.equal(mcq('B', 'b'), true);
  assert.equal(mcq('B', 'B) 42'), true);
  assert.equal(mcq('B', ' b '), true);
  assert.equal(mcq('B', 'C'), false);
  assert.equal(mcq('B', ''), false);
  assert.equal(mcq('B', undefined), false);
  // A numeric-looking mcq answer is still a letter compare, not a number.
  assert.equal(mcq('1', '1.0'), true);
  assert.equal(mcq('1', '2'), false);
  const text = (answer: string, given: string | undefined) => answersMatch({ answer }, given);
  assert.equal(text('Paris', ' paris '), true);
  assert.equal(text('42', '42.0'), false);
  assert.equal(text('Paris', undefined), false);
});

test('scoreMcqSections counts a numeric item by the rule (fixture key 42)', () => {
  const bp = getBlueprint('fixture');
  const served = [
    { sectionIdx: 0, moduleId: 'm1', itemIds: ['fx-m1-1', 'fx-m1-2'] },
    { sectionIdx: 0, moduleId: 'm2-hard', itemIds: ['fx-m2h-1'] },
  ];
  const rawCorrect = (numeric: string | undefined) =>
    scoreMcqSections(
      bp,
      served,
      [{ itemId: 'fx-m1-1', answer: 'A' }, { itemId: 'fx-m1-2', answer: 'B' }, { itemId: 'fx-m2h-1', answer: numeric }],
      FIXTURE_ITEMS,
    ).rawSections[0];
  assert.deepEqual(rawCorrect('42'), { sectionId: 'sec1', rawCorrect: 3, rawTotal: 3 });
  assert.deepEqual(rawCorrect('84/2'), { sectionId: 'sec1', rawCorrect: 3, rawTotal: 3 });
  assert.deepEqual(rawCorrect('42.2'), { sectionId: 'sec1', rawCorrect: 2, rawTotal: 3 });
  assert.deepEqual(rawCorrect(undefined), { sectionId: 'sec1', rawCorrect: 2, rawTotal: 3 });
});

const total = GROUPS.reduce((n, g) => n + g.cases.length, 0);
console.log(`\n${passed} passed, ${failed} failed (${total} table cases)`);
process.exit(failed > 0 ? 1 : 0);
