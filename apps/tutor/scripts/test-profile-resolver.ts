/**
 * Profile identity resolution tests (M1c Task 4).
 *
 * Run: `npm run test:profile-resolver`
 *
 * THE test in this milestone is `two partners sending the same external id
 * get two profiles`. That is the defect M1c exists to eliminate.
 *
 * Hermetic: an in-memory fake stands in for the collection, including its
 * unique-index behaviour — any write attempt against an already-taken
 * (partnerId, externalStudentId) key is REJECTED with a real `code: 11000`,
 * mirroring what the real unique index (Task 6) does — so this counts in
 * the oracle. A second layer (the mutation-guard test below) additionally
 * asserts call *shape* — that a fresh resolve is a single atomic upsert,
 * not a read followed by a write — because a fake that merely rejects
 * duplicates can still pass against a read-then-write implementation that
 * happens to produce the same answer.
 */
import assert from 'node:assert';
import { resolveProfileId, identityFilter, type ResolverDeps } from '@/lib/tutor/student-profile/store';

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>): Promise<void> {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.log(`  FAIL - ${name}`); console.error(e); }
}

/** Fake collection enforcing unique (partnerId, externalStudentId): any
 *  write attempt against a key that's already taken throws a real
 *  `code: 11000`, exactly like an insert colliding with a unique index.
 *  The resolver is responsible for catching that and re-reading via
 *  `findExisting` — this fake does NOT quietly resolve duplicates itself,
 *  because doing so would let a read-then-write implementation pass too. */
function fakeStore() {
  const rows = new Map<string, string>(); // "partner|ext" -> _id
  let seq = 0;
  const deps: ResolverDeps = {
    newId: () => `gen-${++seq}`,
    findExisting: async ({ partnerId, externalStudentId }) => {
      const id = rows.get(`${partnerId}|${externalStudentId}`);
      return id ? { _id: id } : null;
    },
    findOneAndUpsert: async ({ partnerId, externalStudentId, newId }) => {
      const k = `${partnerId}|${externalStudentId}`;
      if (rows.has(k)) {
        const err = new Error('E11000 duplicate key error') as Error & { code?: number };
        err.code = 11000;
        throw err;
      }
      rows.set(k, newId);
      return { _id: newId };
    },
  };
  return { deps, rows };
}

(async () => {

await test('creates a profile id for a new (partner, student) pair', async () => {
  const { deps } = fakeStore();
  const id = await resolveProfileId({ partnerId: 'crimsora', externalStudentId: 'user_1' }, deps);
  assert.ok(id);
});

await test('is stable — the same pair resolves to the same id', async () => {
  const { deps } = fakeStore();
  const a = await resolveProfileId({ partnerId: 'crimsora', externalStudentId: 'user_1' }, deps);
  const b = await resolveProfileId({ partnerId: 'crimsora', externalStudentId: 'user_1' }, deps);
  assert.strictEqual(a, b);
});

await test('THE COLLISION TEST: two partners, same external id, two profiles', async () => {
  const { deps } = fakeStore();
  const a = await resolveProfileId({ partnerId: 'crimsora', externalStudentId: 'user_1' }, deps);
  const b = await resolveProfileId({ partnerId: 'academy', externalStudentId: 'user_1' }, deps);
  assert.notStrictEqual(a, b, 'two partners sharing an external id MUST NOT share a profile');
});

await test('retail students resolve under the evelyn namespace', async () => {
  const { deps } = fakeStore();
  const retail = await resolveProfileId({ partnerId: 'evelyn', externalStudentId: 'user_1' }, deps);
  const partner = await resolveProfileId({ partnerId: 'crimsora', externalStudentId: 'user_1' }, deps);
  assert.notStrictEqual(retail, partner);
});

await test('a duplicate-key race re-reads instead of throwing', async () => {
  const { deps, rows } = fakeStore();
  let first = true;
  const racing: ResolverDeps = {
    ...deps,
    findOneAndUpsert: async (args) => {
      if (first) {
        first = false;
        // Simulate the competitor winning between our miss and our insert.
        rows.set(`${args.partnerId}|${args.externalStudentId}`, 'winner-id');
        const err = new Error('E11000 duplicate key error') as Error & { code?: number };
        err.code = 11000;
        throw err;
      }
      return deps.findOneAndUpsert(args);
    },
  };
  const id = await resolveProfileId(
    { partnerId: 'crimsora', externalStudentId: 'racer' }, racing,
  );
  assert.strictEqual(id, 'winner-id', 'must adopt the winner rather than surface E11000');
});

await test('rejects an empty partnerId', async () => {
  const { deps } = fakeStore();
  await assert.rejects(
    () => resolveProfileId({ partnerId: '', externalStudentId: 'user_1' }, deps),
    /partnerId/,
  );
});

await test('rejects an empty externalStudentId', async () => {
  const { deps } = fakeStore();
  await assert.rejects(
    () => resolveProfileId({ partnerId: 'crimsora', externalStudentId: '' }, deps),
    /externalStudentId/,
  );
});

await test('MUTATION GUARD: a fresh resolve is one atomic upsert — findExisting is never called on the happy path', async () => {
  const { deps } = fakeStore();
  let existingCalls = 0;
  const counting: ResolverDeps = {
    ...deps,
    findExisting: async (input) => { existingCalls++; return deps.findExisting(input); },
  };
  const id = await resolveProfileId({ partnerId: 'crimsora', externalStudentId: 'fresh_1' }, counting);
  assert.ok(id);
  assert.strictEqual(
    existingCalls, 0,
    'read-then-write (findExisting before findOneAndUpsert) is exactly the race the atomic upsert exists to avoid',
  );
});

await test('identityFilter pins the guarantee-bearing Mongo filter shape', () => {
  const filter = identityFilter({ partnerId: 'crimsora', externalStudentId: 'user_1' });
  assert.deepStrictEqual(
    filter,
    { partnerId: 'crimsora', externalStudentId: 'user_1' },
    'the production filter MUST key on both partnerId and externalStudentId — filtering on externalStudentId alone is the exact regression M1c exists to prevent',
  );
});

  console.log(`\n${passed} passed, ${failed} failed\n`);
  if (failed > 0) process.exit(1);
})();
