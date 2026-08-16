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

  await test('report-only mode allows an over-limit request and logs would-block', async () => {
    const partner = makePartner({ limits: { rpm: 600, burst: 1, dailyQuota: null } });
    const deps = makeDeps({ env: { PORTAL_LIMITS_MODE: 'report-only' } as NodeJS.ProcessEnv });
    await checkPartnerLimits(partner, '/x', deps); // count 1, under limit

    const originalWarn = console.warn;
    let logged = '';
    console.warn = (msg?: unknown) => { logged += String(msg); };
    let v;
    try {
      v = await checkPartnerLimits(partner, '/x', deps); // count 2 > burst 1, would block
    } finally {
      console.warn = originalWarn;
    }
    assert.deepStrictEqual(v, { ok: true });
    assert.ok(logged.includes('would-block'), `expected a would-block log line, got: ${logged}`);
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
