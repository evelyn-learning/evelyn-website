/**
 * Partner minute pool — store layer (lib/tutor/portal/partner-pool-store.ts)
 * with an in-memory PoolStoreDeps fake: per-sitting CAS charge, atomic pool
 * increment, thresholds, fail-open. Plus source scans of the Mongo model, the
 * TutorSession field and the frame read route.
 *
 * Run: npm run test:partner-pool-store
 */
import { strict as assert } from 'node:assert';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { PoolDoc } from '../src/lib/tutor/portal/partner-pool';
import { chargeSitting, readPoolSnapshot, type PoolStoreDeps } from '../src/lib/tutor/portal/partner-pool-store';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void | Promise<void>): Promise<void> {
  return Promise.resolve()
    .then(fn)
    .then(() => { console.log(`PASS  ${name}`); passed++; })
    .catch((err) => { console.log(`FAIL  ${name}\n      ${(err as Error).message}`); failed++; });
}

type Sitting = { engagedAtMs: number; chargedSec: number };

function fakeDeps(opts: {
  pool?: PoolDoc | null;
  createdAtMs?: number;
  sittings?: Sitting[];
  now: number;
  casAlwaysLoses?: boolean;
  readPoolThrows?: boolean;
}) {
  const pools = new Map<string, PoolDoc>();
  if (opts.pool) pools.set(opts.pool._id, { ...opts.pool });
  const sittings = new Map<string, Sitting[]>();
  sittings.set('s1', (opts.sittings ?? []).map((s) => ({ ...s })));
  const calls: string[] = [];
  let now = opts.now;
  const deps: PoolStoreDeps = {
    async readPool(partnerId) {
      calls.push(`readPool:${partnerId}`);
      if (opts.readPoolThrows) throw new Error('mongo down');
      return pools.get(partnerId) ?? null;
    },
    async casSittingCharge({ sessionId, engagedAtMs, prevChargedSec, newChargedSec }) {
      calls.push(`cas:${sessionId}:${engagedAtMs}:${prevChargedSec}->${newChargedSec}`);
      if (opts.casAlwaysLoses) return false;
      const list = sittings.get(sessionId) ?? [];
      const entry = list.find((s) => s.engagedAtMs === engagedAtMs);
      if (prevChargedSec === null) {
        if (entry) return false;
        list.push({ engagedAtMs, chargedSec: newChargedSec });
        sittings.set(sessionId, list);
        return true;
      }
      if (!entry || entry.chargedSec !== prevChargedSec) return false;
      entry.chargedSec = newChargedSec;
      return true;
    },
    async incPool(partnerId, deltaSec) {
      calls.push(`incPool:${partnerId}:${deltaSec}`);
      const p = pools.get(partnerId);
      if (!p) return null;
      p.usedSec += deltaSec;
      return { ...p };
    },
    async readSitting(sessionId) {
      calls.push(`readSitting:${sessionId}`);
      const list = sittings.get(sessionId);
      if (!list) return null;
      return { createdAtMs: opts.createdAtMs ?? 0, sittings: list.map((s) => ({ ...s })) };
    },
    now: () => now,
  };
  return { deps, pools, sittings, calls, setNow: (n: number) => { now = n; } };
}

const POOL: PoolDoc = { _id: 'gameclass', capSec: 18000, usedSec: 0 };

async function main() {
  await test('first report of a sitting charges from engagedAt to now and creates the entry', async () => {
    const f = fakeDeps({ pool: POOL, createdAtMs: 0, now: 90_000 });
    const r = await chargeSitting({ partnerId: 'gameclass', sessionId: 's1', reportedEngagedAtMs: 30_000, save: { status: 'active' } }, f.deps);
    assert.equal(r.charged, true);
    assert.equal(r.deltaSec, 60);
    assert.equal(f.pools.get('gameclass')!.usedSec, 60);
    assert.deepEqual(f.sittings.get('s1'), [{ engagedAtMs: 30_000, chargedSec: 60 }]);
    assert.equal(r.snapshot.pooled, true);
    if (r.snapshot.pooled) assert.equal(r.snapshot.remainingSec, 17940);
  });

  await test('second report advances by the elapsed delta; a duplicate that loses the CAS charges nothing', async () => {
    const f = fakeDeps({ pool: POOL, createdAtMs: 0, now: 90_000 });
    await chargeSitting({ partnerId: 'gameclass', sessionId: 's1', reportedEngagedAtMs: 30_000, save: { status: 'active' } }, f.deps);
    f.setNow(150_000);
    const r2 = await chargeSitting({ partnerId: 'gameclass', sessionId: 's1', reportedEngagedAtMs: 30_000, save: { status: 'active' } }, f.deps);
    assert.equal(r2.deltaSec, 60);
    assert.equal(f.sittings.get('s1')![0].chargedSec, 120);
    assert.equal(f.pools.get('gameclass')!.usedSec, 120);

    const g = fakeDeps({ pool: { ...POOL, usedSec: 120 }, createdAtMs: 0, now: 150_000, sittings: [{ engagedAtMs: 30_000, chargedSec: 60 }], casAlwaysLoses: true });
    const dup = await chargeSitting({ partnerId: 'gameclass', sessionId: 's1', reportedEngagedAtMs: 30_000, save: { status: 'active' } }, g.deps);
    assert.equal(dup.charged, false);
    assert.equal(dup.deltaSec, 0);
    assert.equal(g.pools.get('gameclass')!.usedSec, 120);
    assert.ok(!g.calls.some((c) => c.startsWith('incPool')), 'no incPool after a lost CAS');
  });

  await test('an abandoned save then an active save: charging keeps advancing (end by status)', async () => {
    const f = fakeDeps({ pool: POOL, createdAtMs: 0, now: 100_000 });
    const a = await chargeSitting({ partnerId: 'gameclass', sessionId: 's1', reportedEngagedAtMs: 30_000, save: { status: 'abandoned', endedAtMs: 100_000 } }, f.deps);
    assert.equal(a.deltaSec, 70);
    f.setNow(200_000);
    const b = await chargeSitting({ partnerId: 'gameclass', sessionId: 's1', reportedEngagedAtMs: 30_000, save: { status: 'active' } }, f.deps);
    assert.equal(b.deltaSec, 100);
    assert.equal(f.sittings.get('s1')![0].chargedSec, 170);
    assert.equal(f.pools.get('gameclass')!.usedSec, 170);
  });

  await test('a resumed sitting gets its own entry from its own engagedAt; the first entry is untouched', async () => {
    const f = fakeDeps({ pool: { ...POOL, usedSec: 120 }, createdAtMs: 0, now: 460_000, sittings: [{ engagedAtMs: 30_000, chargedSec: 120 }] });
    const r = await chargeSitting({ partnerId: 'gameclass', sessionId: 's1', reportedEngagedAtMs: 400_000, save: { status: 'active' } }, f.deps);
    assert.equal(r.deltaSec, 60);
    assert.deepEqual(f.sittings.get('s1'), [{ engagedAtMs: 30_000, chargedSec: 120 }, { engagedAtMs: 400_000, chargedSec: 60 }]);
    assert.equal(f.pools.get('gameclass')!.usedSec, 180);
  });

  await test('a sitting entry is clamped: the sitting cannot exceed sessionMax + 120 s', async () => {
    const f = fakeDeps({ pool: POOL, createdAtMs: 0, now: 5_000_000 });
    const r = await chargeSitting({ partnerId: 'gameclass', sessionId: 's1', reportedEngagedAtMs: 30_000, save: { status: 'active' } }, f.deps);
    assert.equal(r.deltaSec, 1020);
  });

  await test('no pool doc → not pooled, nothing charged, no incPool', async () => {
    const f = fakeDeps({ pool: null, createdAtMs: 0, now: 90_000 });
    const r = await chargeSitting({ partnerId: 'nopool', sessionId: 's1', reportedEngagedAtMs: 30_000, save: { status: 'active' } }, f.deps);
    assert.equal(r.charged, false);
    assert.equal(r.snapshot.pooled, false);
    assert.ok(!f.calls.some((c) => c.startsWith('incPool')));
  });

  await test('readPool throws → fail open: charged false, snapshot not pooled, no throw', async () => {
    const f = fakeDeps({ pool: POOL, createdAtMs: 0, now: 90_000, readPoolThrows: true });
    const r = await chargeSitting({ partnerId: 'gameclass', sessionId: 's1', reportedEngagedAtMs: 30_000, save: { status: 'active' } }, f.deps);
    assert.equal(r.charged, false);
    assert.deepEqual(r.snapshot, { pooled: false });
  });

  await test('crossed: a charge that takes usage over 80% reports pct80', async () => {
    const f = fakeDeps({ pool: { ...POOL, usedSec: 14_300 }, createdAtMs: 0, now: 230_000 });
    const r = await chargeSitting({ partnerId: 'gameclass', sessionId: 's1', reportedEngagedAtMs: 30_000, save: { status: 'active' } }, f.deps);
    assert.equal(r.deltaSec, 200);
    assert.deepEqual(r.crossed, ['pct80']);
  });

  await test('readPoolSnapshot: throwing dep → { pooled: false }; doc → view', async () => {
    const f = fakeDeps({ pool: POOL, now: 0, readPoolThrows: true });
    assert.deepEqual(await readPoolSnapshot('gameclass', f.deps), { pooled: false });
    const g = fakeDeps({ pool: { ...POOL, usedSec: 100 }, now: 0 });
    const s = await readPoolSnapshot('gameclass', g.deps);
    assert.equal(s.pooled, true);
    if (s.pooled) assert.equal(s.remainingSec, 17900);
  });

  await test('source: TutorSession has poolCharges; PartnerPool model exists on partnerpools', () => {
    const ts = readFileSync(join(__dirname, '../src/models/TutorSession.ts'), 'utf8');
    assert.ok(ts.includes('poolCharges'), 'TutorSession.poolCharges');
    const pp = readFileSync(join(__dirname, '../src/models/PartnerPool.ts'), 'utf8');
    assert.ok(pp.includes("'partnerpools'") || pp.includes('PartnerPool'), 'PartnerPool model');
    const alerts = readFileSync(join(__dirname, '../src/lib/tutor/portal/partner-pool-alerts.ts'), 'utf8');
    assert.ok(alerts.includes('PARTNER_POOL_ALERT_TO') && alerts.includes('praveen@evelynlearning.com'), 'alert recipient');
    assert.ok(alerts.includes('nodemailer'), 'alerts use nodemailer');
  });

  await test('source: GET /api/tutor/partner-pool route verifies the embed token and returns pooled', () => {
    const p = join(__dirname, '../src/app/api/tutor/partner-pool/route.ts');
    assert.ok(existsSync(p), 'route file exists');
    const src = readFileSync(p, 'utf8');
    assert.ok(src.includes('checkEmbedAuthAsync'), 'uses checkEmbedAuthAsync');
    assert.ok(src.includes('readPoolSnapshot'), 'uses readPoolSnapshot');
    assert.ok(src.includes("'partner-pool:GET'"), 'route tag');
    assert.ok(src.includes('pooled'), 'returns pooled');
    assert.ok(src.includes("'unavailable'"), 'read failure → unavailable');
    assert.ok(src.includes('poolFlagOn'), 'honours the flag');
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main();
