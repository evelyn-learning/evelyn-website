/**
 * Learner-model estimator — pure/deterministic tests against
 * src/lib/tutor/learner-model/estimator.ts. No DB, no LLM calls (Task 6).
 * Task 7 extends this script with a DB-backed section for appendEvidence.
 *
 * Usage: npx tsx scripts/test-learner-model.ts  (npm run test:learner-model)
 */
import { estimateLo, trendOf, nextReviewAt } from '../src/lib/tutor/learner-model/estimator';

let passed = 0;
let failed = 0;
function assert(cond: boolean, name: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}`); }
}

const now = new Date('2026-08-10T00:00:00Z');
const d = (days: number) => new Date(now.getTime() - days * 86400000);

// weighting: a fresh mock success outweighs an old practice failure
const e1 = estimateLo([
  { source: 'practice', outcome: 0, occurredAt: d(60) },
  { source: 'mock', outcome: 1, occurredAt: d(1) },
], now)!;
assert(e1.estimate > 0.8, 'recency+source weighting');

// empty → null
assert(estimateLo([], now) === null, 'no evidence → null');

// confidence bands from n_eff
assert(
  estimateLo([{ source: 'session', outcome: 1, occurredAt: d(0) }], now)!.confidence === 'low',
  'one event low',
);

// trend
assert(
  trendOf(0.8, 0.7) === 'up' && trendOf(0.71, 0.7) === 'flat' && trendOf(null, 0.5) === 'flat',
  'trend rule',
);

// review: 2 spaced successes → h = 2*2^1 = 4d after the last one; weak LO never scheduled
const evs = [
  { source: 'practice' as const, outcome: 1, occurredAt: d(10) },
  { source: 'practice' as const, outcome: 1, occurredAt: d(5) },
];
assert(
  nextReviewAt(evs, 0.75, now)!.getTime() === d(5).getTime() + 4 * 86400000,
  'half-life doubling',
);
assert(nextReviewAt(evs, 0.4, now) === null, 'weak LO → remediation, not review');

// same-day successes count once for k
assert(
  nextReviewAt([...evs, { source: 'practice', outcome: 1, occurredAt: d(5) }], 0.75, now)!.getTime()
    === d(5).getTime() + 4 * 86400000,
  'min spacing for k',
);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
