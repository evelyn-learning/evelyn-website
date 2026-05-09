/**
 * Standalone unit test for `applyCrossSessionPromotion` in
 * src/lib/tutor/student-profile/store.ts.
 *
 * Run with:
 *   npx ts-node --compiler-options '{"module":"commonjs"}' scripts/test-cross-session-promotion.ts
 *
 * Or via npm script (added to package.json):
 *   npm run test:gaps
 *
 * No test framework — just imports the pure function, sets up fake
 * profiles, runs assertions via node:assert, prints PASS/FAIL per case.
 * Exits non-zero on any failure so it's CI-friendly.
 *
 * Why standalone instead of a framework: the project has no jest /
 * vitest / mocha configured, and adding one for a single regression
 * test isn't worth the dependency. The pure-function nature of
 * applyCrossSessionPromotion makes table-driven assertions trivial.
 */

import { strict as assert } from 'node:assert';
import { applyCrossSessionPromotion, resolveSettledGaps } from '../src/lib/tutor/student-profile/store';
import type { StudentProfile, GapEntry, MasteryEntry } from '../src/lib/tutor/student-profile/types';

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.log(`  ✗ ${name}`);
    console.log(`      ${(err as Error).message}`);
    failed++;
  }
}

function makeProfile(gaps: GapEntry[] = []): StudentProfile {
  return {
    id: 'test-student',
    mastery: {},
    gaps,
    recentSessions: [],
    preferences: {},
    createdAt: '2026-05-09T00:00:00.000Z',
    updatedAt: '2026-05-09T00:00:00.000Z',
    schemaVersion: 1,
  };
}

function makeMastery(overrides: Partial<MasteryEntry> = {}): MasteryEntry {
  return {
    loId: 'lo-1',
    score: 0.5,
    exposures: 1,
    lastTouchedAt: '2026-05-09T00:00:00.000Z',
    ...overrides,
  };
}

function makeGap(overrides: Partial<GapEntry> = {}): GapEntry {
  return {
    id: 'gap_test',
    kind: 'lo',
    loId: 'lo-1',
    status: 'candidate',
    confidence: 0.25,
    sessionIds: ['s1'],
    firstSeenAt: '2026-05-08T00:00:00.000Z',
    lastSeenAt: '2026-05-08T00:00:00.000Z',
    evidence: {
      signals: ['MISCONCEPTION_DETECTED'],
      observation: 'Test observation',
      studentQuotes: [],
    },
    ...overrides,
  };
}

console.log('\napplyCrossSessionPromotion\n');

test('no matching gap on the loId → profile reference unchanged', () => {
  const profile = makeProfile();
  const result = applyCrossSessionPromotion(profile, [{ loId: 'lo-1', delta: 0.2 }], 's2');
  assert.strictEqual(result, profile, 'returned a different reference when nothing should have changed');
});

test('candidate + delta < 0.5 + new sessionId → promoted to confirmed; sessionIds bumped', () => {
  const gap = makeGap({ sessionIds: ['s1'] });
  const profile = makeProfile([gap]);
  const result = applyCrossSessionPromotion(profile, [{ loId: 'lo-1', delta: 0.2 }], 's2');
  assert.notStrictEqual(result, profile, 'expected a new profile reference');
  assert.strictEqual(result.gaps.length, 1);
  assert.strictEqual(result.gaps[0].status, 'confirmed', 'gap should have been promoted');
  assert.deepStrictEqual(result.gaps[0].sessionIds, ['s1', 's2'], 'sessionIds should include both sessions');
  assert.notStrictEqual(result.gaps[0].lastSeenAt, gap.lastSeenAt, 'lastSeenAt should have been updated');
});

test('delta of exactly 0.5 → strict less-than → no fire', () => {
  const gap = makeGap({ sessionIds: ['s1'] });
  const profile = makeProfile([gap]);
  const result = applyCrossSessionPromotion(profile, [{ loId: 'lo-1', delta: 0.5 }], 's2');
  assert.strictEqual(result, profile, 'delta of exactly 0.5 should NOT trigger promotion');
});

test('delta > 0.5 → no fire', () => {
  const gap = makeGap({ sessionIds: ['s1'] });
  const profile = makeProfile([gap]);
  const result = applyCrossSessionPromotion(profile, [{ loId: 'lo-1', delta: 0.8 }], 's2');
  assert.strictEqual(result, profile);
});

test('negative delta (clear struggle) → fires and promotes', () => {
  const gap = makeGap({ sessionIds: ['s1'] });
  const profile = makeProfile([gap]);
  const result = applyCrossSessionPromotion(profile, [{ loId: 'lo-1', delta: -0.5 }], 's2');
  assert.strictEqual(result.gaps[0].status, 'confirmed');
  assert.deepStrictEqual(result.gaps[0].sessionIds, ['s1', 's2']);
});

test('sessionId already in sessionIds → dedup, no double-count', () => {
  const gap = makeGap({ sessionIds: ['s1', 's2'] });
  const profile = makeProfile([gap]);
  const result = applyCrossSessionPromotion(profile, [{ loId: 'lo-1', delta: 0.2 }], 's2');
  assert.strictEqual(result, profile, 'already-included sessionId should be skipped (dedup safety net for brain re-fire + fallback collision)');
});

test('resolved gap → not touched', () => {
  const gap = makeGap({ status: 'resolved', sessionIds: ['s1'] });
  const profile = makeProfile([gap]);
  const result = applyCrossSessionPromotion(profile, [{ loId: 'lo-1', delta: 0.2 }], 's2');
  assert.strictEqual(result, profile, 'resolved gap should not be touched');
});

test('confirmed gap + new session → sessionIds bumped, status stays confirmed', () => {
  const gap = makeGap({ status: 'confirmed', sessionIds: ['s1'] });
  const profile = makeProfile([gap]);
  const result = applyCrossSessionPromotion(profile, [{ loId: 'lo-1', delta: 0.2 }], 's2');
  assert.strictEqual(result.gaps[0].status, 'confirmed');
  assert.deepStrictEqual(result.gaps[0].sessionIds, ['s1', 's2']);
});

test('legacy "open" status → migrated to "confirmed" on touch', () => {
  const gap = makeGap({ status: 'open', sessionIds: undefined });
  const profile = makeProfile([gap]);
  const result = applyCrossSessionPromotion(profile, [{ loId: 'lo-1', delta: 0.3 }], 's2');
  assert.strictEqual(result.gaps[0].status, 'confirmed', 'legacy open should migrate to confirmed');
});

test('multiple deltas: only matching loIds with delta < 0.5 promote', () => {
  const gap1 = makeGap({ id: 'g1', loId: 'lo-1', sessionIds: ['s1'] });
  const gap2 = makeGap({ id: 'g2', loId: 'lo-2', sessionIds: ['s1'] });
  const profile = makeProfile([gap1, gap2]);
  const result = applyCrossSessionPromotion(profile, [
    { loId: 'lo-1', delta: 0.2 },  // triggers
    { loId: 'lo-2', delta: 0.8 },  // doesn't trigger (delta too high)
    { loId: 'lo-3', delta: 0.1 },  // no matching gap
  ], 's2');
  const g1 = result.gaps.find((g) => g.id === 'g1');
  const g2 = result.gaps.find((g) => g.id === 'g2');
  assert.ok(g1 && g2);
  assert.strictEqual(g1!.status, 'confirmed', 'matching low-delta gap should promote');
  assert.deepStrictEqual(g1!.sessionIds, ['s1', 's2']);
  assert.strictEqual(g2!.status, 'candidate', 'high-delta gap should NOT promote');
  assert.deepStrictEqual(g2!.sessionIds, ['s1']);
});

test('prerequisite gap → never touched (kind=prerequisite has no loId match)', () => {
  const gap = makeGap({
    kind: 'prerequisite',
    loId: undefined,
    conceptLabel: 'multiplication facts',
    sessionIds: ['s1'],
  });
  const profile = makeProfile([gap]);
  const result = applyCrossSessionPromotion(profile, [{ loId: 'lo-1', delta: 0.2 }], 's2');
  assert.strictEqual(result, profile, 'prerequisite gap should not be touched by LO-keyed fallback');
});

test('empty masteryDeltas → no change', () => {
  const profile = makeProfile([makeGap()]);
  const result = applyCrossSessionPromotion(profile, [], 's2');
  assert.strictEqual(result, profile);
});

test('empty sessionId → no change', () => {
  const profile = makeProfile([makeGap()]);
  const result = applyCrossSessionPromotion(profile, [{ loId: 'lo-1', delta: 0.2 }], '');
  assert.strictEqual(result, profile, 'empty sessionId should be ignored');
});

test('non-numeric delta (NaN) → ignored', () => {
  const profile = makeProfile([makeGap()]);
  const result = applyCrossSessionPromotion(profile, [{ loId: 'lo-1', delta: NaN }], 's2');
  // NaN < 0.5 is FALSE in JS, so it should naturally be skipped. Asserting
  // the behavior either way: no fire, profile unchanged.
  assert.strictEqual(result, profile, 'NaN delta should not trigger');
});

test('first-fire single session (sessionIds.length=0 then 1) → stays candidate, NOT promoted', () => {
  // Edge case: a gap that already exists in the profile but has empty sessionIds[]
  // (perhaps from a hand-crafted entry). delta < 0.5 bumps to length=1, which
  // is below the promotion threshold of 2. Should remain candidate.
  const gap = makeGap({ sessionIds: [] });
  const profile = makeProfile([gap]);
  const result = applyCrossSessionPromotion(profile, [{ loId: 'lo-1', delta: 0.2 }], 's2');
  assert.strictEqual(result.gaps[0].status, 'candidate', 'should not promote with only 1 session');
  assert.deepStrictEqual(result.gaps[0].sessionIds, ['s2']);
});

console.log('\nresolveSettledGaps\n');

test('no mastery entry for the loId → no resolution', () => {
  const gap = makeGap({ status: 'confirmed' });
  const profile = makeProfile([gap]);
  const result = resolveSettledGaps(profile);
  assert.strictEqual(result, profile, 'profile reference should be unchanged');
});

test('score >= 0.8 + exposures >= 3 → resolves', () => {
  const gap = makeGap({ status: 'confirmed' });
  const profile = makeProfile([gap]);
  profile.mastery['lo-1'] = makeMastery({ score: 0.85, exposures: 4 });
  const result = resolveSettledGaps(profile);
  assert.strictEqual(result.gaps[0].status, 'resolved');
});

test('boundary: score === 0.8 AND exposures === 3 (both inclusive) → resolves', () => {
  const gap = makeGap({ status: 'confirmed' });
  const profile = makeProfile([gap]);
  profile.mastery['lo-1'] = makeMastery({ score: 0.8, exposures: 3 });
  const result = resolveSettledGaps(profile);
  assert.strictEqual(result.gaps[0].status, 'resolved', 'thresholds are inclusive (>=)');
});

test('score below threshold (0.79) → no resolution even with high exposures', () => {
  const gap = makeGap({ status: 'confirmed' });
  const profile = makeProfile([gap]);
  profile.mastery['lo-1'] = makeMastery({ score: 0.79, exposures: 10 });
  const result = resolveSettledGaps(profile);
  assert.strictEqual(result, profile);
});

test('exposures below threshold (2) → no resolution even with high score', () => {
  const gap = makeGap({ status: 'confirmed' });
  const profile = makeProfile([gap]);
  profile.mastery['lo-1'] = makeMastery({ score: 0.95, exposures: 2 });
  const result = resolveSettledGaps(profile);
  assert.strictEqual(result, profile, 'one-shot 0.95 is noisy; require sustained');
});

test('candidate gap can also resolve (not only confirmed)', () => {
  const gap = makeGap({ status: 'candidate' });
  const profile = makeProfile([gap]);
  profile.mastery['lo-1'] = makeMastery({ score: 0.85, exposures: 4 });
  const result = resolveSettledGaps(profile);
  assert.strictEqual(result.gaps[0].status, 'resolved');
});

test('legacy "open" status can resolve', () => {
  const gap = makeGap({ status: 'open' });
  const profile = makeProfile([gap]);
  profile.mastery['lo-1'] = makeMastery({ score: 0.9, exposures: 5 });
  const result = resolveSettledGaps(profile);
  assert.strictEqual(result.gaps[0].status, 'resolved');
});

test('already-resolved gap → no-op (idempotent)', () => {
  const gap = makeGap({ status: 'resolved' });
  const profile = makeProfile([gap]);
  profile.mastery['lo-1'] = makeMastery({ score: 0.9, exposures: 5 });
  const result = resolveSettledGaps(profile);
  assert.strictEqual(result, profile, 'already resolved should not be re-touched');
});

test('prerequisite gap → never resolved (no LO mastery to key on)', () => {
  const gap = makeGap({
    kind: 'prerequisite',
    loId: undefined,
    conceptLabel: 'multiplication facts',
    status: 'confirmed',
  });
  const profile = makeProfile([gap]);
  // Even with mastery present on some LO, prereq gap should not be touched
  profile.mastery['lo-1'] = makeMastery({ score: 0.95, exposures: 10 });
  const result = resolveSettledGaps(profile);
  assert.strictEqual(result, profile, 'prereq gap stays — needs concept registry to resolve');
});

test('multiple gaps, multiple mastery entries: only matching+settled resolve', () => {
  const g1 = makeGap({ id: 'g1', loId: 'lo-1', status: 'confirmed' });
  const g2 = makeGap({ id: 'g2', loId: 'lo-2', status: 'confirmed' });
  const g3 = makeGap({ id: 'g3', loId: 'lo-3', status: 'candidate' });
  const profile = makeProfile([g1, g2, g3]);
  profile.mastery['lo-1'] = makeMastery({ loId: 'lo-1', score: 0.9, exposures: 5 }); // resolves
  profile.mastery['lo-2'] = makeMastery({ loId: 'lo-2', score: 0.6, exposures: 5 }); // score too low
  profile.mastery['lo-3'] = makeMastery({ loId: 'lo-3', score: 0.95, exposures: 1 }); // exposures too low
  const result = resolveSettledGaps(profile);
  assert.strictEqual(result.gaps.find((g) => g.id === 'g1')!.status, 'resolved');
  assert.strictEqual(result.gaps.find((g) => g.id === 'g2')!.status, 'confirmed');
  assert.strictEqual(result.gaps.find((g) => g.id === 'g3')!.status, 'candidate');
});

test('lastSeenAt updated on resolution (telemetry)', () => {
  const gap = makeGap({ status: 'confirmed' });
  const profile = makeProfile([gap]);
  profile.mastery['lo-1'] = makeMastery({ score: 0.85, exposures: 4 });
  const before = gap.lastSeenAt;
  const result = resolveSettledGaps(profile);
  assert.notStrictEqual(result.gaps[0].lastSeenAt, before, 'lastSeenAt should bump');
});

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
