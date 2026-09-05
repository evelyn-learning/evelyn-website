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
import { applyCrossSessionPromotion, resolveSettledGaps, isGapStale, upsertSessionMemory, recordGap, INFERRED_CONFIDENCE_CAP } from '../src/lib/tutor/student-profile/store';
import type { StudentProfile, GapEntry, MasteryEntry, SessionMemory } from '../src/lib/tutor/student-profile/types';

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

console.log('\nisGapStale (lazy decay TTL)\n');

const NOW = new Date('2026-05-09T00:00:00.000Z').getTime();
const daysAgo = (n: number) => new Date(NOW - n * 86_400_000).toISOString();

test('candidate 10 days old → not stale (under 21)', () => {
  const gap = makeGap({ status: 'candidate', lastSeenAt: daysAgo(10) });
  assert.strictEqual(isGapStale(gap, NOW), false);
});

test('candidate exactly 21 days old → not stale (strict greater-than)', () => {
  const gap = makeGap({ status: 'candidate', lastSeenAt: daysAgo(21) });
  assert.strictEqual(isGapStale(gap, NOW), false, '21.0 days is NOT stale; ageDays > 21 required');
});

test('candidate 22 days old → stale', () => {
  const gap = makeGap({ status: 'candidate', lastSeenAt: daysAgo(22) });
  assert.strictEqual(isGapStale(gap, NOW), true);
});

test('confirmed 60 days old → not stale (under 90)', () => {
  const gap = makeGap({ status: 'confirmed', lastSeenAt: daysAgo(60) });
  assert.strictEqual(isGapStale(gap, NOW), false);
});

test('confirmed 91 days old → stale', () => {
  const gap = makeGap({ status: 'confirmed', lastSeenAt: daysAgo(91) });
  assert.strictEqual(isGapStale(gap, NOW), true);
});

test('legacy "open" status uses confirmed TTL (60 days → not stale)', () => {
  const gap = makeGap({ status: 'open', lastSeenAt: daysAgo(60) });
  assert.strictEqual(isGapStale(gap, NOW), false);
});

test('legacy "open" status: 100 days → stale', () => {
  const gap = makeGap({ status: 'open', lastSeenAt: daysAgo(100) });
  assert.strictEqual(isGapStale(gap, NOW), true);
});

test('resolved gap → never stale (independent semantics)', () => {
  const gap = makeGap({ status: 'resolved', lastSeenAt: daysAgo(365) });
  assert.strictEqual(isGapStale(gap, NOW), false, 'resolved is independently filtered, not subject to decay');
});

test('candidate just barely past threshold (21.5 days) → stale', () => {
  const gap = makeGap({ status: 'candidate', lastSeenAt: new Date(NOW - 21.5 * 86_400_000).toISOString() });
  assert.strictEqual(isGapStale(gap, NOW), true);
});

test('confirmed just barely past threshold (90.5 days) → stale', () => {
  const gap = makeGap({ status: 'confirmed', lastSeenAt: new Date(NOW - 90.5 * 86_400_000).toISOString() });
  assert.strictEqual(isGapStale(gap, NOW), true);
});

test('malformed lastSeenAt ("not-a-date") → not stale (defensive)', () => {
  const gap = makeGap({ status: 'candidate', lastSeenAt: 'not-a-date' });
  assert.strictEqual(isGapStale(gap, NOW), false, 'unparseable timestamp should not silently hide gap');
});

test('empty lastSeenAt → not stale (defensive)', () => {
  const gap = makeGap({ status: 'candidate', lastSeenAt: '' });
  assert.strictEqual(isGapStale(gap, NOW), false);
});

test('future lastSeenAt (clock skew) → not stale (negative age guarded)', () => {
  const gap = makeGap({ status: 'candidate', lastSeenAt: daysAgo(-5) });
  assert.strictEqual(isGapStale(gap, NOW), false);
});

test('default `now` parameter (no second arg) → uses current time', () => {
  // Make a gap 100 days ago in real time. With no `now` passed, the
  // function uses Date.now(). 100 days > 90 → stale (for confirmed).
  const realDaysAgo = new Date(Date.now() - 100 * 86_400_000).toISOString();
  const gap = makeGap({ status: 'confirmed', lastSeenAt: realDaysAgo });
  assert.strictEqual(isGapStale(gap), true, 'should default to Date.now()');
});

// ---------------------------------------------------------------------------
// upsertSessionMemory — idempotent per-sessionId merge (learning-gaps
// blending, 2026-07-05). Makes the commit endpoint safe for incremental
// flushes: same-session commits MERGE into one SessionMemory entry,
// distinct sessions still append.
// ---------------------------------------------------------------------------
console.log('\nupsertSessionMemory:');

function makeMemory(overrides: Partial<SessionMemory> = {}): SessionMemory {
  return {
    sessionId: 's1',
    endedAt: '2026-07-05T10:00:00.000Z',
    losTouched: [],
    ...overrides,
  };
}

test('no existing entry → appends (today\'s behavior)', () => {
  const p = makeProfile();
  const out = upsertSessionMemory(p, makeMemory({ losTouched: ['lo-a'] }));
  assert.strictEqual(out.recentSessions.length, 1);
  assert.deepStrictEqual(out.recentSessions[0].losTouched, ['lo-a']);
});

test('distinct sessionIds → both entries kept', () => {
  let p = makeProfile();
  p = upsertSessionMemory(p, makeMemory({ sessionId: 's1' }));
  p = upsertSessionMemory(p, makeMemory({ sessionId: 's2' }));
  assert.strictEqual(p.recentSessions.length, 2);
});

test('same sessionId → single entry (no duplicate SessionMemory spam)', () => {
  let p = makeProfile();
  p = upsertSessionMemory(p, makeMemory());
  p = upsertSessionMemory(p, makeMemory());
  assert.strictEqual(p.recentSessions.length, 1);
});

test('merge unions losTouched (no duplicates)', () => {
  let p = makeProfile();
  p = upsertSessionMemory(p, makeMemory({ losTouched: ['lo-a', 'lo-b'] }));
  p = upsertSessionMemory(p, makeMemory({ losTouched: ['lo-b', 'lo-c'] }));
  assert.deepStrictEqual([...p.recentSessions[0].losTouched].sort(), ['lo-a', 'lo-b', 'lo-c']);
});

test('merge concats masteryDeltas (increments, never double-applied here)', () => {
  let p = makeProfile();
  p = upsertSessionMemory(p, makeMemory({ masteryDeltas: [{ loId: 'lo-a', delta: 0.5 }] }));
  p = upsertSessionMemory(p, makeMemory({ masteryDeltas: [{ loId: 'lo-a', delta: 0.2 }] }));
  assert.deepStrictEqual(p.recentSessions[0].masteryDeltas, [
    { loId: 'lo-a', delta: 0.5 },
    { loId: 'lo-a', delta: 0.2 },
  ]);
});

test('merge sums notesOverlays per bucket', () => {
  let p = makeProfile();
  p = upsertSessionMemory(p, makeMemory({ notesOverlaysAddedThisSession: { theory: 1, methods: 0, pointers: 2 } }));
  p = upsertSessionMemory(p, makeMemory({ notesOverlaysAddedThisSession: { theory: 0, methods: 1, pointers: 1 } }));
  assert.deepStrictEqual(p.recentSessions[0].notesOverlaysAddedThisSession, { theory: 1, methods: 1, pointers: 3 });
});

test('merge takes newer endedAt; new non-empty summary wins, else keeps old', () => {
  let p = makeProfile();
  p = upsertSessionMemory(p, makeMemory({ endedAt: '2026-07-05T10:00:00.000Z', summary: 'first' }));
  p = upsertSessionMemory(p, makeMemory({ endedAt: '2026-07-05T10:20:00.000Z' }));
  assert.strictEqual(p.recentSessions[0].endedAt, '2026-07-05T10:20:00.000Z');
  assert.strictEqual(p.recentSessions[0].summary, 'first', 'absent new summary keeps old');
  p = upsertSessionMemory(p, makeMemory({ endedAt: '2026-07-05T10:30:00.000Z', summary: 'final' }));
  assert.strictEqual(p.recentSessions[0].summary, 'final', 'new non-empty summary wins');
});

test('merge keeps existing subject/topic/grade/lessonPlanId, fills when absent', () => {
  let p = makeProfile();
  p = upsertSessionMemory(p, makeMemory({ subject: 'math', topic: 'fractions' }));
  p = upsertSessionMemory(p, makeMemory({ subject: 'SHOULD-NOT-WIN', grade: '5' }));
  assert.strictEqual(p.recentSessions[0].subject, 'math');
  assert.strictEqual(p.recentSessions[0].topic, 'fractions');
  assert.strictEqual(p.recentSessions[0].grade, '5', 'absent field fills from new');
});

test('merge preserves entry position (session stays in place, other sessions unaffected)', () => {
  let p = makeProfile();
  p = upsertSessionMemory(p, makeMemory({ sessionId: 's1' }));
  p = upsertSessionMemory(p, makeMemory({ sessionId: 's2', losTouched: ['x'] }));
  p = upsertSessionMemory(p, makeMemory({ sessionId: 's1', losTouched: ['y'] }));
  assert.strictEqual(p.recentSessions.length, 2);
  assert.strictEqual(p.recentSessions[0].sessionId, 's1');
  assert.deepStrictEqual(p.recentSessions[0].losTouched, ['y']);
  assert.deepStrictEqual(p.recentSessions[1].losTouched, ['x'], 'other session untouched');
});

// ---------------------------------------------------------------------------
// recordGap — holistic-pedagogy round: recurrence / inferred cap / recap
// record (spec §A.7/§B.6). Engine-only evidence fields the orchestrator's
// struggle-ledger + close_session_notes flow feed into recordGap.
// ---------------------------------------------------------------------------
console.log('\nrecordGap: recurrence / inferred cap / recap record (holistic-pedagogy round)\n');

let gapProfile = makeProfile();
gapProfile = recordGap(gapProfile, {
  kind: 'lo', loId: 'lo1', observation: 'Inferred from behaviour: 2 incorrect attempts', studentQuotes: [],
  signals: ['INCORRECT_STREAK_2_PLUS', 'NO_RECOVERY', 'STUCK_CUE'], sessionId: 's1', inferred: true,
});

test('inferred gap with 3 signals stays candidate (confidence capped)', () => {
  const g = gapProfile.gaps[0];
  assert.strictEqual(g.status, 'candidate');
  assert.ok((g.confidence ?? 1) <= INFERRED_CONFIDENCE_CAP, 'confidence should be capped at INFERRED_CONFIDENCE_CAP');
});

test('inferred flag persisted on evidence', () => {
  assert.strictEqual(gapProfile.gaps[0].evidence?.inferred, true);
});

gapProfile = recordGap(gapProfile, {
  kind: 'lo', loId: 'lo1', observation: 'again', studentQuotes: [], signals: ['NO_RECOVERY'], sessionId: 's1',
  recurrences: 2, recap: { offered: 1, outcome: 'declined' },
});

test('recurrenceCount accumulates on merge', () => {
  assert.strictEqual(gapProfile.gaps[0].evidence?.recurrenceCount, 2);
});

test('recap record merged', () => {
  const recap = gapProfile.gaps[0].evidence?.recap;
  assert.ok(recap, 'expected a recap record');
  assert.strictEqual(recap!.offers, 1);
  assert.strictEqual(recap!.declines, 1);
  assert.strictEqual(recap!.lastOutcome, 'declined');
});

gapProfile = recordGap(gapProfile, {
  kind: 'lo', loId: 'lo1', observation: 'again2', studentQuotes: [], signals: ['NO_RECOVERY'], sessionId: 's2',
  recurrences: 1, recap: { offered: 1, outcome: 'accepted' },
});

test('second merge adds to counters (recurrenceCount=3, recap offers=2 accepts=1)', () => {
  const g = gapProfile.gaps[0];
  assert.strictEqual(g.evidence?.recurrenceCount, 3);
  assert.strictEqual(g.evidence?.recap?.offers, 2);
  assert.strictEqual(g.evidence?.recap?.accepts, 1);
});

// Task 18 ruling 1: the recap state machine writes 'accepted' at REPLY
// time and the return-time outcome ('improved' / 'still_struggling') on a
// later increment. A flush between the two must not count the accept
// twice — the second increment carries offered:0 and only moves
// lastOutcome.
gapProfile = recordGap(gapProfile, {
  kind: 'lo', loId: 'lo1', observation: 'recap returned', studentQuotes: [], signals: [], sessionId: 's2',
  recap: { offered: 0, outcome: 'improved' },
});

test('return-time outcome does not double-count the accept (accepts=1, lastOutcome=improved)', () => {
  const r = gapProfile.gaps[0].evidence?.recap;
  assert.ok(r, 'expected a recap record');
  assert.strictEqual(r!.offers, 2);
  assert.strictEqual(r!.accepts, 1);
  assert.strictEqual(r!.lastOutcome, 'improved');
});

// Task 18 fix round 1 (Important 3): the recap state machine pushes TWO
// accumulator entries for the same loId when the recap opens and returns
// inside ONE commit window — the reply-time accept and the return-time
// outcome. The commit route calls recordGap once per entry with the same
// sessionId; the pair must merge to one offer and one accept.
let sameCommit = makeProfile();
sameCommit = recordGap(sameCommit, {
  kind: 'lo', loId: 'loX', observation: 'Recap offered this session.', studentQuotes: [], signals: [], sessionId: 'sX',
  recap: { offered: 1, outcome: 'accepted' },
});
sameCommit = recordGap(sameCommit, {
  kind: 'lo', loId: 'loX', observation: 'Recap helped this session.', studentQuotes: [], signals: [], sessionId: 'sX',
  recap: { offered: 0, outcome: 'improved' },
});

test('two entries for one loId in ONE commit merge to offers 1 / accepts 1 / lastOutcome improved', () => {
  assert.strictEqual(sameCommit.gaps.length, 1);
  const r = sameCommit.gaps[0].evidence?.recap;
  assert.ok(r, 'expected a recap record');
  assert.strictEqual(r!.offers, 1);
  assert.strictEqual(r!.accepts, 1);
  assert.strictEqual(r!.declines, 0);
  assert.strictEqual(r!.lastOutcome, 'improved');
});

test('two sessions still promote (unchanged rule)', () => {
  assert.strictEqual(gapProfile.gaps[0].status, 'confirmed');
});

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
