/**
 * Per-partner burst/quota/metering tests (M1c Task 7).
 *
 * Run: `npm run test:partner-limits`
 *
 * Fully hermetic: `checkPartnerLimits` takes an injected `LimitsDeps` (a
 * `bump` function, a clock, an env), so no test here touches Mongo. The
 * in-memory `makeCounterStore` below stands in for the real
 * PartnerCounterModel upsert — same key shape, same "returns the new count"
 * contract.
 *
 * The two failure-policy cases (burst fails OPEN, quota fails CLOSED but
 * only when a dailyQuota is configured) are the point of this task — see
 * spec section 6.1. Each is written so it would fail if the policy were
 * flipped or unified: the fail-open case asserts `ok: true` from a deps
 * object whose `bump` always throws, and the fail-closed case asserts a 402
 * from the same kind of always-throwing `bump`, distinguished only by
 * whether `dailyQuota` is set on the partner.
 *
 * Fix round 1 (I2) added the two REMAINING cells of the 2x2
 * {which counter throws} x {quota configured?} matrix: minute-only-throws
 * with a quota configured, and day-only-throws with no quota. Those two are
 * the only cells where the two failure policies can actually contradict
 * each other — a reviewer-planted mutation that let a burst-counter hiccup
 * 402 a quota'd partner passed all cases *except* these. If you are
 * "simplifying" this matrix, run the mutation in that comment first.
 */
import assert from 'node:assert';

import { checkPartnerLimits, type LimitsDeps } from '@/lib/tutor/portal/limits';
import type { PartnerRecord } from '@/lib/tutor/portal/registry';

let passed = 0;
let failed = 0;
async function test(name: string, fn: () => void | Promise<void>): Promise<void> {
  try {
    await fn();
    passed++;
    console.log(`  ok - ${name}`);
  } catch (e) {
    failed++;
    console.log(`  FAIL - ${name}`);
    console.error(e);
  }
}

const NOW_MS = Date.parse('2026-08-16T12:00:00.000Z');

function makePartner(over: Partial<PartnerRecord> = {}): PartnerRecord {
  return {
    partnerId: 'crimsora',
    kind: 'partner',
    status: 'active',
    secrets: ['s'],
    allowedEndpoints: ['/api/portal/v1/'],
    limits: { rpm: 600, burst: 1000, dailyQuota: null },
    flagOverrides: {},
    ...over,
  };
}

/** In-memory stand-in for the real Mongo counter store: same key shape,
 *  same "atomic increment, return the new count" contract. */
function makeCounterStore() {
  const counts = new Map<string, number>();
  const bump: LimitsDeps['bump'] = async (key) => {
    const k = `${key.partnerId}::${key.endpoint}::${key.windowKind}::${key.windowStart}`;
    const next = (counts.get(k) ?? 0) + 1;
    counts.set(k, next);
    return next;
  };
  return { bump, counts };
}

function makeDeps(over: Partial<LimitsDeps> = {}): LimitsDeps {
  const store = makeCounterStore();
  return {
    bump: store.bump,
    now: () => NOW_MS,
    env: {} as NodeJS.ProcessEnv,
    ...over,
  };
}

const alwaysThrows: LimitsDeps['bump'] = async () => {
  throw new Error('counter store unavailable');
};

/** Throws only for one windowKind — lets a test isolate which half of the
 *  store is down while the other keeps working normally. */
function throwsOnlyFor(windowKind: 'minute' | 'day') {
  const store = makeCounterStore();
  const bump: LimitsDeps['bump'] = async (key) => {
    if (key.windowKind === windowKind) throw new Error('counter store unavailable');
    return store.bump(key);
  };
  return bump;
}

(async () => {
  await test('under the burst limit allows', async () => {
    const partner = makePartner({ limits: { rpm: 600, burst: 3, dailyQuota: null } });
    const deps = makeDeps();
    const v = await checkPartnerLimits(partner, '/x', deps);
    assert.deepStrictEqual(v, { ok: true });
  });

  await test('over the burst limit blocks with 429 + retryAfterSec > 0', async () => {
    const partner = makePartner({ limits: { rpm: 600, burst: 2, dailyQuota: null } });
    const deps = makeDeps();
    await checkPartnerLimits(partner, '/x', deps); // count 1
    await checkPartnerLimits(partner, '/x', deps); // count 2
    const v = await checkPartnerLimits(partner, '/x', deps); // count 3 > burst 2
    assert.strictEqual(v.ok, false);
    if (!v.ok) {
      assert.strictEqual(v.status, 429);
      assert.strictEqual(v.reason, 'rate_limited');
      assert.ok((v.retryAfterSec ?? 0) > 0, `expected retryAfterSec > 0, got ${v.retryAfterSec}`);
    }
  });

  await test('a new minute window resets burst', async () => {
    const partner = makePartner({ limits: { rpm: 600, burst: 1, dailyQuota: null } });
    const store = makeCounterStore();
    let nowMs = Date.parse('2026-08-16T12:00:30.000Z');
    const deps: LimitsDeps = { bump: store.bump, now: () => nowMs, env: {} as NodeJS.ProcessEnv };

    const v1 = await checkPartnerLimits(partner, '/x', deps); // count 1, ok
    assert.deepStrictEqual(v1, { ok: true });
    const v2 = await checkPartnerLimits(partner, '/x', deps); // count 2, blocked
    assert.strictEqual(v2.ok, false);

    nowMs = Date.parse('2026-08-16T12:01:05.000Z'); // next minute window
    const v3 = await checkPartnerLimits(partner, '/x', deps); // count 1 again, ok
    assert.deepStrictEqual(v3, { ok: true });
  });

  await test('no dailyQuota configured never quota-blocks, however high the count', async () => {
    const partner = makePartner({ limits: { rpm: 600, burst: 1000, dailyQuota: null } });
    const deps = makeDeps();
    let last: Awaited<ReturnType<typeof checkPartnerLimits>> | undefined;
    for (let i = 0; i < 50; i++) last = await checkPartnerLimits(partner, '/x', deps);
    assert.deepStrictEqual(last, { ok: true });
  });

  await test('dailyQuota configured and exceeded blocks with 402 quota_exceeded', async () => {
    const partner = makePartner({ limits: { rpm: 600, burst: 1000, dailyQuota: 2 } });
    const deps = makeDeps();
    await checkPartnerLimits(partner, '/x', deps); // day count 1
    await checkPartnerLimits(partner, '/x', deps); // day count 2
    const v = await checkPartnerLimits(partner, '/x', deps); // day count 3 > quota 2
    assert.strictEqual(v.ok, false);
    if (!v.ok) {
      assert.strictEqual(v.status, 402);
      assert.strictEqual(v.reason, 'quota_exceeded');
    }
  });

  await test('store throws, no quota configured -> allowed (burst fails OPEN)', async () => {
    const partner = makePartner({ limits: { rpm: 600, burst: 1, dailyQuota: null } });
    const deps: LimitsDeps = { bump: alwaysThrows, now: () => NOW_MS, env: {} as NodeJS.ProcessEnv };
    const v = await checkPartnerLimits(partner, '/x', deps);
    assert.deepStrictEqual(v, { ok: true });
  });

  await test('store throws, quota configured -> blocked 402 (quota fails CLOSED)', async () => {
    const partner = makePartner({ limits: { rpm: 600, burst: 1000, dailyQuota: 5 } });
    const deps: LimitsDeps = { bump: alwaysThrows, now: () => NOW_MS, env: {} as NodeJS.ProcessEnv };
    const v = await checkPartnerLimits(partner, '/x', deps);
    assert.strictEqual(v.ok, false);
    if (!v.ok) assert.strictEqual(v.status, 402);
  });

  // Isolate which half is down, so the above two cases aren't accidentally
  // passing because BOTH halves throw at once.
  await test('day counter alone unavailable + quota configured -> 402, even though burst succeeded', async () => {
    const partner = makePartner({ limits: { rpm: 600, burst: 1000, dailyQuota: 5 } });
    const deps: LimitsDeps = { bump: throwsOnlyFor('day'), now: () => NOW_MS, env: {} as NodeJS.ProcessEnv };
    const v = await checkPartnerLimits(partner, '/x', deps);
    assert.strictEqual(v.ok, false);
    if (!v.ok) assert.strictEqual(v.status, 402);
  });

  await test('minute counter alone unavailable + no quota -> allowed, even though day succeeded', async () => {
    const partner = makePartner({ limits: { rpm: 600, burst: 1, dailyQuota: null } });
    const deps: LimitsDeps = { bump: throwsOnlyFor('minute'), now: () => NOW_MS, env: {} as NodeJS.ProcessEnv };
    const v = await checkPartnerLimits(partner, '/x', deps);
    assert.deepStrictEqual(v, { ok: true });
  });

  // --- I2 (fix round 1): the two cells above never put the SAME half of
  // the store on trial as the policy that half's failure decides — a
  // minute-only outage was always paired with "no quota", and a day-only
  // outage was always paired with "quota configured". That left the cross
  // cells uncovered, and they are exactly where the two policies can
  // contradict each other: a burst hiccup must NEVER 402 a quota'd
  // partner, and a quota-counter hiccup must NEVER matter when no quota
  // is configured in the first place.
  await test('I2: minute counter alone unavailable + quota configured -> still allowed (burst fails open regardless of quota)', async () => {
    const partner = makePartner({ limits: { rpm: 600, burst: 1000, dailyQuota: 10_000 } });
    const deps: LimitsDeps = { bump: throwsOnlyFor('minute'), now: () => NOW_MS, env: {} as NodeJS.ProcessEnv };
    const v = await checkPartnerLimits(partner, '/x', deps);
    assert.deepStrictEqual(v, { ok: true });
  });

  await test('I2: day counter alone unavailable + no quota -> allowed (mirrors the no-quota fail-open case)', async () => {
    const partner = makePartner({ limits: { rpm: 600, burst: 1000, dailyQuota: null } });
    const deps: LimitsDeps = { bump: throwsOnlyFor('day'), now: () => NOW_MS, env: {} as NodeJS.ProcessEnv };
    const v = await checkPartnerLimits(partner, '/x', deps);
    assert.deepStrictEqual(v, { ok: true });
  });

  await test('report-only mode allows an over-limit request, logs would-block, AND still meters it (I1)', async () => {
    const partner = makePartner({ limits: { rpm: 600, burst: 1, dailyQuota: null } });
    const store = makeCounterStore();
    const deps: LimitsDeps = {
      bump: store.bump,
      now: () => NOW_MS,
      env: { PORTAL_LIMITS_MODE: 'report-only' } as NodeJS.ProcessEnv,
    };
    const v1 = await checkPartnerLimits(partner, '/x', deps); // count 1, under limit, served
    assert.deepStrictEqual(v1, { ok: true });

    const originalWarn = console.warn;
    let logged = '';
    console.warn = (msg?: unknown) => { logged += String(msg); };
    let v2;
    try {
      v2 = await checkPartnerLimits(partner, '/x', deps); // count 2 > burst 1, would block, served anyway
    } finally {
      console.warn = originalWarn;
    }
    assert.deepStrictEqual(v2, { ok: true });
    assert.ok(logged.includes('would-block'), `expected a would-block log line, got: ${logged}`);

    // I1: both calls were served, so both must be metered. Before the fix,
    // block() returned before the day bump on every burst block —
    // report-only or not — so this second call went uncounted even though
    // it was served: exactly the over-limit traffic the report-only
    // rollout step exists to measure.
    const dayKey = `${partner.partnerId}::/x::day::2026-08-16`;
    assert.strictEqual(store.counts.get(dayKey), 2, 'both served calls must be metered in report-only mode');
  });

  await test('minor: a tighter rpm than burst is the cap that is enforced', async () => {
    // burst=1000 alone would allow this; rpm=1 is the tighter of the two
    // and must govern (rpm was previously read but never enforced).
    const partner = makePartner({ limits: { rpm: 1, burst: 1000, dailyQuota: null } });
    const deps = makeDeps();
    await checkPartnerLimits(partner, '/x', deps); // count 1, within rpm=1
    const v = await checkPartnerLimits(partner, '/x', deps); // count 2 > rpm=1
    assert.strictEqual(v.ok, false);
    if (!v.ok) assert.strictEqual(v.status, 429);
  });

  await test('minor: a tighter burst than rpm is the cap that is enforced', async () => {
    const partner = makePartner({ limits: { rpm: 1000, burst: 1, dailyQuota: null } });
    const deps = makeDeps();
    await checkPartnerLimits(partner, '/x', deps); // count 1, within burst=1
    const v = await checkPartnerLimits(partner, '/x', deps); // count 2 > burst=1
    assert.strictEqual(v.ok, false);
    if (!v.ok) assert.strictEqual(v.status, 429);
  });

  await test('minor: dailyQuota: 0 blocks the very first request (block-everything, not unlimited)', async () => {
    const partner = makePartner({ limits: { rpm: 600, burst: 1000, dailyQuota: 0 } });
    const deps = makeDeps();
    const v = await checkPartnerLimits(partner, '/x', deps); // day count 1 > quota 0
    assert.strictEqual(v.ok, false);
    if (!v.ok) assert.strictEqual(v.status, 402);
  });

  await test('the day counter increments exactly once per call (metering)', async () => {
    const partner = makePartner({ limits: { rpm: 600, burst: 1000, dailyQuota: null } });
    const store = makeCounterStore();
    const deps: LimitsDeps = { bump: store.bump, now: () => NOW_MS, env: {} as NodeJS.ProcessEnv };
    await checkPartnerLimits(partner, '/x', deps);
    await checkPartnerLimits(partner, '/x', deps);
    await checkPartnerLimits(partner, '/x', deps);
    const dayKey = `${partner.partnerId}::/x::day::2026-08-16`;
    assert.strictEqual(store.counts.get(dayKey), 3);
  });

  console.log(`\n${passed} passed, ${failed} failed\n`);
  if (failed > 0) process.exit(1);
})();
