/**
 * Partner minute pool — the REAL Mongo store (mongoPoolStoreDeps): the
 * $ne/$push new-sitting CAS and the $elemMatch/positional update, under a
 * race. Needs a throwaway mongod; skipped unless PARTNER_POOL_TEST_MONGODB_URI
 * is set (never point it at 127.0.0.1:2710 — that is the prod tunnel).
 *
 *   mongod --dbpath "$TMP/db" --port 27099 --bind_ip 127.0.0.1 --fork --logpath "$TMP/mongod.log"
 *   PARTNER_POOL_TEST_MONGODB_URI=mongodb://127.0.0.1:27099/pooltest npx tsx scripts/test-partner-pool-mongo.ts
 */
import { strict as assert } from 'node:assert';
import mongoose from 'mongoose';
import { chargeSitting, mongoPoolStoreDeps } from '../src/lib/tutor/portal/partner-pool-store';
import { PartnerPoolModel } from '../src/models/PartnerPool';
import { TutorSession } from '../src/models/TutorSession';

const uri = process.env.PARTNER_POOL_TEST_MONGODB_URI;
if (!uri) { console.log('SKIP  test-partner-pool-mongo: PARTNER_POOL_TEST_MONGODB_URI not set'); process.exit(0); }
if (/:2710\b/.test(uri)) { console.error('REFUSED: :2710 is the prod tunnel'); process.exit(1); }

let passed = 0;
let failed = 0;
async function test(name: string, fn: () => Promise<void>) {
  try { await fn(); console.log(`PASS  ${name}`); passed++; }
  catch (err) { console.log(`FAIL  ${name}\n      ${(err as Error).message}`); failed++; }
}

async function main() {
  await mongoose.connect(uri as string);
  await PartnerPoolModel.deleteMany({});
  await TutorSession.deleteMany({ sessionId: /^pooltest-/ });
  await PartnerPoolModel.create({ _id: 'gameclass', capSec: 18000, usedSec: 0, updatedAt: new Date().toISOString() });
  const base = Date.now() - 600_000;
  // Raw insert: the fixture needs only the fields the store reads (schema validation is not under test).
  await TutorSession.collection.insertOne({ sessionId: 'pooltest-1', startedAt: new Date(base), createdAt: new Date(base), status: 'active', source: 'embed', sourcePartnerId: 'gameclass' });
  const real = mongoPoolStoreDeps();
  const deps = { ...real, now: () => base + 90_000 };
  const input = (engagedAtMs: number) => ({ partnerId: 'gameclass', sessionId: 'pooltest-1', reportedEngagedAtMs: engagedAtMs, save: { status: 'active' as const } });

  await test('two concurrent first reports of one sitting: exactly one charge, one entry', async () => {
    const [a, b] = await Promise.all([chargeSitting(input(base + 30_000), deps), chargeSitting(input(base + 30_000), deps)]);
    assert.equal([a, b].filter((r) => r.charged).length, 1, 'one winner');
    assert.equal([a, b].filter((r) => r.charged)[0].deltaSec, 60);
    const pool = await PartnerPoolModel.findById('gameclass').lean();
    assert.equal(pool!.usedSec, 60);
    const s = await TutorSession.findOne({ sessionId: 'pooltest-1' }).lean();
    assert.equal(s!.poolCharges!.length, 1);
    assert.equal(s!.poolCharges![0].chargedSec, 60);
  });

  await test('two concurrent later reports: one advances the entry (positional CAS), the other loses', async () => {
    const later = { ...real, now: () => base + 150_000 };
    const [a, b] = await Promise.all([chargeSitting(input(base + 30_000), later), chargeSitting(input(base + 30_000), later)]);
    assert.equal([a, b].filter((r) => r.charged).length, 1, 'one winner');
    const pool = await PartnerPoolModel.findById('gameclass').lean();
    assert.equal(pool!.usedSec, 120);
    const s = await TutorSession.findOne({ sessionId: 'pooltest-1' }).lean();
    assert.equal(s!.poolCharges!.length, 1);
    assert.equal(s!.poolCharges![0].chargedSec, 120);
  });

  await test('a second sitting (resume) gets its own entry from its own engagedAt', async () => {
    const resumed = { ...real, now: () => base + 460_000 };
    const r = await chargeSitting(input(base + 400_000), resumed);
    assert.equal(r.charged, true);
    assert.equal(r.deltaSec, 60);
    const s = await TutorSession.findOne({ sessionId: 'pooltest-1' }).lean();
    assert.equal(s!.poolCharges!.length, 2);
    assert.deepEqual(s!.poolCharges!.map((c) => c.chargedSec), [120, 60]);
    const pool = await PartnerPoolModel.findById('gameclass').lean();
    assert.equal(pool!.usedSec, 180);
  });

  await test('an abandoned save then an active save keeps advancing; the 100% alert crosses once', async () => {
    await PartnerPoolModel.updateOne({ _id: 'gameclass' }, { $set: { usedSec: 17_950 } });
    const t1 = { ...real, now: () => base + 500_000 };
    const r1 = await chargeSitting({ ...input(base + 400_000), save: { status: 'abandoned', endedAtMs: base + 500_000 } }, t1);
    assert.equal(r1.deltaSec, 40);
    assert.deepEqual(r1.crossed, []);
    const t2 = { ...real, now: () => base + 560_000 };
    const r2 = await chargeSitting(input(base + 400_000), t2);
    assert.equal(r2.deltaSec, 60);
    assert.deepEqual(r2.crossed, ['pct100']);
    assert.equal(r2.snapshot.pooled && r2.snapshot.exhausted, true);
  });

  await TutorSession.deleteMany({ sessionId: /^pooltest-/ });
  await PartnerPoolModel.deleteMany({});
  await mongoose.disconnect();
  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}
main().catch((err) => { console.error(err); process.exit(1); });
