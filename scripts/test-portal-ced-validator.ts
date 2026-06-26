/**
 * AP-Stats CED-code validator unit tests + LIVE AUDIT of all AP-Stats seeds.
 *
 * Run: `npm run test:portal-ced`
 *
 * The audit imports the real SEED_PLANS, filters topic==='ap-statistics', and
 * asserts every plan's LOs carry a valid CED code — a permanent regression
 * guard on the "every AP-Stats LO has a validated standard" policy.
 */

import assert from 'node:assert';
import {
  isValidApStatsCedCode,
  isSingleTopicApStatsCed,
  validateApStatsPlanLOs,
} from '@/lib/tutor/lesson-plan/validate-ced-code';
import { SEED_PLANS } from '@/lib/tutor/lesson-plan/store';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try {
    fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    failed++;
    console.error(`  ✗ ${name}`);
    console.error(`    ${(err as Error).message}`);
  }
}

console.log('\nAP-Stats CED validator — unit:\n');

test('accepts single topic AP-STATS-1.10', () => assert.ok(isValidApStatsCedCode('AP-STATS-1.10')));
test('accepts range AP-STATS-1.1-1.4', () => assert.ok(isValidApStatsCedCode('AP-STATS-1.1-1.4')));
test('accepts FRQ marker AP-STATS-1-FRQ', () => assert.ok(isValidApStatsCedCode('AP-STATS-1-FRQ')));
test('rejects skill-code form VAR-1.A', () => assert.ok(!isValidApStatsCedCode('VAR-1.A')));
test('rejects empty / undefined', () => {
  assert.ok(!isValidApStatsCedCode(''));
  assert.ok(!isValidApStatsCedCode(undefined));
});
test('rejects bare prefix AP-STATS-', () => assert.ok(!isValidApStatsCedCode('AP-STATS-')));
test('rejects wrong course prefix AP-CALC-1.1', () => assert.ok(!isValidApStatsCedCode('AP-CALC-1.1')));
test('rejects lowercase ap-stats-1.10', () => assert.ok(!isValidApStatsCedCode('ap-stats-1.10')));

test('single-topic lint: 1.10 yes; range/FRQ no', () => {
  assert.ok(isSingleTopicApStatsCed('AP-STATS-1.10'));
  assert.ok(!isSingleTopicApStatsCed('AP-STATS-1.1-1.4'));
  assert.ok(!isSingleTopicApStatsCed('AP-STATS-1-FRQ'));
});

console.log('\nAP-Stats CED audit — all seed plans (live):\n');

const apStatsPlans = SEED_PLANS.filter((p) => p.topic === 'ap-statistics');

test('found AP-Stats plans (expected 48)', () => {
  assert.ok(apStatsPlans.length > 0, 'no AP-Stats plans found — wrong filter?');
  assert.strictEqual(apStatsPlans.length, 48, `expected 48, found ${apStatsPlans.length}`);
});

test('every AP-Stats plan LO carries a valid CED code', () => {
  const allErrors: string[] = [];
  for (const plan of apStatsPlans) {
    const r = validateApStatsPlanLOs(plan);
    if (!r.ok) allErrors.push(...r.errors);
  }
  assert.strictEqual(allErrors.length, 0, `CED coverage failures:\n  ${allErrors.join('\n  ')}`);
});

console.log(`\n${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
