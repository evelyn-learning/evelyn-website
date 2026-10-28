/**
 * Partner minute pool — pure helpers in lib/tutor/portal/partner-pool.ts
 * (spec: docs/superpowers/specs/2026-10-21-partner-minute-pool-design.md).
 * Wall-clock per sitting, CAS-friendly charge arithmetic, start gate, thresholds.
 *
 * Run: npm run test:partner-pool
 */
import { strict as assert } from 'node:assert';
import {
  DEFAULT_IDLE_END_SEC,
  DEFAULT_SESSION_MAX_SEC,
  POOL_BLOCKED_LINE,
  POOL_CHARGE_SLACK_SEC,
  POOL_GOODBYE_LINE,
  POOL_MIN_START_SEC,
  clampEngagedAt,
  clockPoolSeconds,
  effectiveCapSec,
  poolFlagOn,
  poolView,
  sittingCharge,
  sittingEndMs,
  startDecision,
  thresholdsCleared,
  thresholdsCrossed,
} from '../src/lib/tutor/portal/partner-pool';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`PASS  ${name}`); passed++; }
  catch (err) { console.log(`FAIL  ${name}\n      ${(err as Error).message}`); failed++; }
}

test('constants', () => {
  assert.equal(POOL_MIN_START_SEC, 60);
  assert.equal(POOL_CHARGE_SLACK_SEC, 120);
  assert.equal(DEFAULT_SESSION_MAX_SEC, 900);
  assert.equal(DEFAULT_IDLE_END_SEC, 1800);
  assert.equal(POOL_BLOCKED_LINE, 'Tutoring minutes for this program are used up.');
  assert.equal(POOL_GOODBYE_LINE, 'The tutoring minutes for this program are used up for now.');
});

test('poolView: null doc → not pooled', () => {
  assert.deepEqual(poolView(null), { pooled: false });
});

test('poolView: remaining, defaults, exhausted under the start floor', () => {
  const v = poolView({ _id: 'g', capSec: 18000, usedSec: 17950 });
  assert.equal(v.pooled, true);
  if (!v.pooled) return;
  assert.equal(v.capSec, 18000);
  assert.equal(v.usedSec, 17950);
  assert.equal(v.remainingSec, 50);
  assert.equal(v.exhausted, true);
  assert.equal(v.sessionMaxSec, 900);
  assert.equal(v.idleEndSec, 1800);
});

test('poolView: used over cap → remaining 0; explicit per-partner fields pass through', () => {
  const v = poolView({ _id: 'g', capSec: 100, usedSec: 500, sessionMaxSec: 600, idleEndSec: 300 });
  if (!v.pooled) throw new Error('expected pooled');
  assert.equal(v.remainingSec, 0);
  assert.equal(v.exhausted, true);
  assert.equal(v.sessionMaxSec, 600);
  assert.equal(v.idleEndSec, 300);
  const w = poolView({ _id: 'g', capSec: 18000, usedSec: 100 });
  if (!w.pooled) throw new Error('expected pooled');
  assert.equal(w.remainingSec, 17900);
  assert.equal(w.exhausted, false);
});

test('sittingEndMs: active ignores a stale endedAt; abandoned/completed use their own end', () => {
  assert.equal(sittingEndMs({ status: 'active', endedAtMs: 1000 }, 5000), 5000);
  assert.equal(sittingEndMs({ status: 'abandoned', endedAtMs: 1000 }, 5000), 1000);
  assert.equal(sittingEndMs({ status: 'completed' }, 5000), 5000);
  assert.equal(sittingEndMs({ status: 'completed', endedAtMs: null }, 5000), 5000);
});

test('sittingCharge: wall seconds minus already charged', () => {
  assert.deepEqual(sittingCharge({ engagedAtMs: 0, endMs: 100_000, chargedSec: 40, sessionMaxSec: 900 }), { wallSec: 100, deltaSec: 60 });
});

test('sittingCharge: clamp at sessionMax + slack', () => {
  const r = sittingCharge({ engagedAtMs: 0, endMs: 2_000_000, chargedSec: 0, sessionMaxSec: 900 });
  assert.equal(r.wallSec, 1020);
  assert.equal(r.deltaSec, 1020);
});

test('sittingCharge: never negative delta; end before engaged → 0', () => {
  assert.equal(sittingCharge({ engagedAtMs: 0, endMs: 100_000, chargedSec: 150, sessionMaxSec: 900 }).deltaSec, 0);
  const r = sittingCharge({ engagedAtMs: 50_000, endMs: 10_000, chargedSec: 0, sessionMaxSec: 900 });
  assert.equal(r.wallSec, 0);
  assert.equal(r.deltaSec, 0);
});

test('clampEngagedAt: floor = createdAt − 60 s, ceiling = now, prev sitting raises the floor', () => {
  const b = { createdAtMs: 10_000, nowMs: 50_000 };
  assert.equal(clampEngagedAt(5_000, b), 5_000);
  assert.equal(clampEngagedAt(-100_000, b), -50_000);
  assert.equal(clampEngagedAt(99_000, b), 50_000);
  assert.equal(clampEngagedAt(15_000, { ...b, prevEngagedAtMs: 20_000 }), 20_000);
});

test('effectiveCapSec = min(token max ?? 1800, session max, remaining)', () => {
  assert.equal(effectiveCapSec({ tokenMaxSec: 3600, sessionMaxSec: 900, remainingSec: 5000 }), 900);
  assert.equal(effectiveCapSec({ tokenMaxSec: undefined, sessionMaxSec: 900, remainingSec: 400 }), 400);
  assert.equal(effectiveCapSec({ tokenMaxSec: 300, sessionMaxSec: 900, remainingSec: 5000 }), 300);
  assert.equal(effectiveCapSec({ tokenMaxSec: undefined, sessionMaxSec: 3000, remainingSec: 5000 }), 1800);
});

test('startDecision: no pool → start; exhausted → blocked; else cap + idle', () => {
  assert.deepEqual(startDecision({ pooled: false }), { start: true });
  const ex = poolView({ _id: 'g', capSec: 100, usedSec: 100 });
  assert.deepEqual(startDecision(ex), { start: false, reason: 'minutes_exhausted' });
  const ok = poolView({ _id: 'g', capSec: 1000, usedSec: 600 });
  assert.deepEqual(startDecision(ok), { start: true, capSec: 400, idleEndSec: 1800 });
});

test('thresholdsCrossed at 80% and 100%', () => {
  assert.deepEqual(thresholdsCrossed(14_000, 14_400, 18_000), ['pct80']);
  assert.deepEqual(thresholdsCrossed(17_900, 18_100, 18_000), ['pct100']);
  assert.deepEqual(thresholdsCrossed(10_000, 18_100, 18_000), ['pct80', 'pct100']);
  assert.deepEqual(thresholdsCrossed(14_400, 14_500, 18_000), []);
});

test('thresholdsCleared: alerts that no longer apply after a top-up', () => {
  assert.deepEqual(thresholdsCleared(10_000, 18_000, { pct80At: 'x', pct100At: 'y' }), ['pct80', 'pct100']);
  assert.deepEqual(thresholdsCleared(15_000, 18_000, { pct80At: 'x' }), []);
  assert.deepEqual(thresholdsCleared(15_000, 18_000, undefined), []);
});

test('clockPoolSeconds: remaining or undefined', () => {
  assert.equal(clockPoolSeconds({ pooled: false }), undefined);
  assert.equal(clockPoolSeconds(null), undefined);
  assert.equal(clockPoolSeconds(poolView({ _id: 'g', capSec: 1000, usedSec: 877 })), 123);
});

test('poolFlagOn: default ON, only "off" disables', () => {
  assert.equal(poolFlagOn(undefined), true);
  assert.equal(poolFlagOn('off'), false);
  assert.equal(poolFlagOn('on'), true);
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
