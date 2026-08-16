/**
 * Portal call-site identity scoping (M1c Task 5).
 *
 * Run: `npm run test:portal-student-scoping`
 *
 * Task 4 proved `resolveProfileId` itself is partner-scoped and atomic.
 * This suite proves the WIRING at the entry point: a portal handler that
 * reads a `studentId` off its (verified) request resolves it through
 * `resolveProfileId({ partnerId: auth.partnerId, externalStudentId })` —
 * the verified header-derived partner, NEVER anything read off the body —
 * and that the raw body `studentId` never itself reaches the profile store
 * as a key.
 *
 * It also pins the Task 5 rollout-safety constraint: with
 * `PORTAL_IDENTITY_RESOLUTION` unset (the shipped default), the handler
 * passes the raw studentId straight through, byte-identical to pre-M1c
 * behavior — this is what makes the deploy safe ahead of the Task 6
 * backfill (see identityResolutionEnabled's doc comment in store.ts).
 *
 * Hermetic: `__setRegistryOverrideForTests` (Task 3) stands in for the
 * partner registry (no DB), and a fake `ResolverDeps` (same shape as
 * test-profile-resolver.ts's) stands in for the Mongo upsert (no DB).
 * `resolveProfileId` itself is exercised for real — only its Mongo-facing
 * deps are faked — so this suite tests the actual production call shape,
 * not a re-implementation of it.
 *
 * Fix round 1 (MINOR 5) added the STATIC CHECK at the bottom: the
 * hand-copied `buildHandler` pattern above only proves the WIRING PATTERN
 * works — it can't catch a real route that forgot to apply it (which is
 * exactly how CRITICAL 1's two missed call sites hid in round 1). The
 * static check greps the real source tree for every direct caller of the
 * profile store and asserts each shows resolution evidence.
 */
import assert from 'node:assert';
import { randomBytes } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

// Mirrors scripts/test-portal-auth-registry.ts's setup: some import in the
// withPortalAuth chain (secret-box.ts, transitively) wants this set before
// first import, even though this suite never decrypts a real secret (the
// registry override below bypasses that path entirely).
process.env.PORTAL_SECRET_ENC_KEY = randomBytes(32).toString('base64');

import { signPortalRequest } from '@evelyn/portal-contract/auth';
import type { NextRequest } from 'next/server';

import { __setRegistryOverrideForTests, withPortalAuth, type PortalAuth } from '@/lib/tutor/portal/auth';
import type { PartnerRecord } from '@/lib/tutor/portal/registry';
import {
  resolveProfileId,
  resolveProfileIdOrRaw,
  identityResolutionEnabled,
  ProfileIdentityError,
  type ResolverDeps,
} from '@/lib/tutor/student-profile/store';

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

// ---------------------------------------------------------------------------
// Harness (request construction mirrors scripts/test-portal-auth-registry.ts)
// ---------------------------------------------------------------------------

const SECRET = 'secret-x';

function signedRequest(opts: { partnerId: string; bodyObj: unknown; path?: string }): NextRequest {
  const method = 'POST';
  const path = opts.path ?? '/api/portal/v1/x';
  const signedBody = JSON.stringify(opts.bodyObj);
  const timestamp = String(Date.now());
  const sig = signPortalRequest(SECRET, { method, path, timestamp, body: signedBody });
  const headers: Record<string, string> = {
    'x-evelyn-partner': opts.partnerId,
    'x-evelyn-timestamp': timestamp,
    'x-evelyn-signature': sig,
  };
  return new Request(`https://engine.test${path}`, { method, headers, body: signedBody }) as unknown as NextRequest;
}

function makePartner(partnerId: string): PartnerRecord {
  return {
    partnerId,
    kind: 'partner',
    status: 'active',
    secrets: [SECRET],
    allowedEndpoints: ['/api/portal/v1/'],
    limits: { rpm: 600, burst: 60, dailyQuota: null },
    flagOverrides: {},
  };
}

/** Both `crimsora` and `academy` are live, valid partners for this suite. */
function setRegistry(): void {
  __setRegistryOverrideForTests(async (id) =>
    id === 'crimsora' || id === 'academy' ? makePartner(id) : null,
  );
}

/** Fake, hermetic ResolverDeps — same collision-enforcing shape as
 *  scripts/test-profile-resolver.ts's fakeStore(), so a bug that let two
 *  partners collide on the same key would fail here the same way. */
function fakeResolverDeps(): ResolverDeps {
  const rows = new Map<string, string>();
  let seq = 0;
  return {
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
}

/**
 * The exact Step 4 pattern every real portal call site now runs (gaps/,
 * mastery/, learner-state/, session-result/, plan-generate/, review-plan/,
 * mock/attempts/report/ routes): resolve `body.studentId` under the
 * VERIFIED `auth.partnerId`, gated by `identityResolutionEnabled`. The only
 * difference from production is the injected fake `deps` — production uses
 * `resolveProfileId`'s default (real-Mongo) deps.
 *
 * Uses the REAL `identityResolutionEnabled()` (store.ts) — not a
 * reimplementation — so a change to the flag's env var name or semantics
 * fails this suite too.
 */
function buildHandler(deps: ResolverDeps) {
  return withPortalAuth(async (_req, auth: PortalAuth) => {
    const body = auth.body as { studentId: string };
    const profileId = identityResolutionEnabled()
      ? await resolveProfileId({ partnerId: auth.partnerId, externalStudentId: body.studentId }, deps)
      : body.studentId;
    return (await import('next/server')).NextResponse.json({ profileId });
  });
}

async function resolvedIdFor(handler: ReturnType<typeof buildHandler>, partnerId: string): Promise<string> {
  const req = signedRequest({ partnerId, bodyObj: { studentId: 'user_1' } });
  const res = await handler(req, undefined);
  assert.strictEqual(res.status, 200, `expected 200, got ${res.status}`);
  const json = (await res.json()) as { profileId: string };
  return json.profileId;
}

// ---------------------------------------------------------------------------
(async () => {
  console.log('\nPortal student-id scoping — entry points (M1c Task 5):\n');

  setRegistry();

  await test('flag ON: crimsora resolves under partnerId "crimsora", never the raw string', async () => {
    process.env.PORTAL_IDENTITY_RESOLUTION = 'on';
    const handler = buildHandler(fakeResolverDeps());
    const id = await resolvedIdFor(handler, 'crimsora');
    assert.notStrictEqual(id, 'user_1', 'the raw body studentId must never reach the store as a key');
    assert.ok(id, 'a resolved id must be returned');
  });

  await test('flag ON: the same body from academy resolves to a DIFFERENT id than crimsora', async () => {
    process.env.PORTAL_IDENTITY_RESOLUTION = 'on';
    const deps = fakeResolverDeps(); // shared store — proves cross-partner isolation, not just per-call uniqueness
    const handler = buildHandler(deps);
    const crimsoraId = await resolvedIdFor(handler, 'crimsora');
    const academyId = await resolvedIdFor(handler, 'academy');
    assert.notStrictEqual(
      crimsoraId, academyId,
      'two partners sending the same externalStudentId must never share a profile',
    );
    assert.notStrictEqual(crimsoraId, 'user_1');
    assert.notStrictEqual(academyId, 'user_1');
  });

  await test('flag ON: resolution is STABLE — the same partner+student resolves to the same id twice', async () => {
    process.env.PORTAL_IDENTITY_RESOLUTION = 'on';
    const deps = fakeResolverDeps();
    const handler = buildHandler(deps);
    const a = await resolvedIdFor(handler, 'crimsora');
    const b = await resolvedIdFor(handler, 'crimsora');
    assert.strictEqual(a, b);
  });

  await test(
    'flag ON, MULTI-STORE (fix round 1, CRITICAL 2 / fix round 2, MINOR F / amended acceptance ' +
      'gate §3): the collision guarantee holds past StudentProfile — resolving ONCE and reusing ' +
      'that id for a profile store, a projection store, an Elo store, AND a topic-notes store ' +
      'keeps all four consistent for one partner and correctly SEPARATE across two partners',
    async () => {
      process.env.PORTAL_IDENTITY_RESOLUTION = 'on';
      const deps = fakeResolverDeps();
      // Four independent fake stores, standing in for StudentProfile,
      // LearnerStateProjection, EloRating, and StudentTopicNotes — exactly
      // the shape learner-state/route.ts's and the topic-notes routes'
      // single `profileId` now feeds into (spec §4.1: "one identity space,
      // not two"). Topic notes is here per fix round 2's MINOR F: it's the
      // collection this suite (and the amended acceptance gate) had missed
      // — the one Task 5 itself only found by independently auditing
      // /api/tutor/topic-notes/**, not from the reviewer's original list.
      // A regression that resolved once for the profile but left another
      // store on the raw external id (round 1's actual bug, at 6 different
      // sites) would show up here as an entry present in `profiles` but
      // ABSENT from one of the other three under the same key.
      const profiles = new Map<string, { touched: boolean }>();
      const projections = new Map<string, { estimate: number }>();
      const elo = new Map<string, { rating: number }>();
      const topicNotes = new Map<string, { baselineId: string }>();

      // Mirrors the real Step-4-plus-§4.1 pattern: resolve ONCE per
      // request, then use that SAME id for every store. Returns the
      // resolved id so callers can assert against it directly, rather than
      // reverse-engineering "which id was this" from the stores' own
      // contents (fix round 2, MINOR F: the previous version derived its
      // assertion subject via a `.filter()` over these same maps, then
      // asserted the very predicate it had just filtered by — a tautology
      // that could never fail).
      async function handleLikeLearnerState(partnerId: string, studentId: string): Promise<string> {
        const profileId = await resolveProfileId({ partnerId, externalStudentId: studentId }, deps);
        profiles.set(profileId, { touched: true });
        projections.set(profileId, { estimate: 0.5 });
        elo.set(profileId, { rating: 1500 });
        topicNotes.set(profileId, { baselineId: 'course.unit1.v1' });
        return profileId;
      }

      const crimsoraId1 = await handleLikeLearnerState('crimsora', 'user_1');
      const academyId = await handleLikeLearnerState('academy', 'user_1'); // same external id, different partner

      assert.strictEqual(profiles.size, 2, 'two partners sending the same external id must get two profiles');
      assert.strictEqual(projections.size, 2, 'and two projections — not one shared with the profile split');
      assert.strictEqual(elo.size, 2, 'and two Elo rows — not one shared with the profile split');
      assert.strictEqual(topicNotes.size, 2, 'and two topic-notes docs — not one shared with the profile split');
      assert.notStrictEqual(crimsoraId1, academyId);

      // Same partner, same student, called twice (e.g. /gaps then
      // /learner-state in the same session) — must land on the SAME id in
      // every store, not just the profile.
      const crimsoraId2 = await handleLikeLearnerState('crimsora', 'user_1');
      assert.strictEqual(crimsoraId2, crimsoraId1, 'a repeat resolve for the same pair must reuse the same id');
      assert.strictEqual(profiles.size, 2, 'a repeat resolve for the same pair must not mint a new profile');
      assert.strictEqual(projections.size, 2);
      assert.strictEqual(elo.size, 2);
      assert.strictEqual(topicNotes.size, 2);
      assert.ok(profiles.has(crimsoraId1), 'the profile for this student must be found under the resolved id');
      assert.ok(projections.has(crimsoraId1), 'and the projection');
      assert.ok(elo.has(crimsoraId1), 'and the Elo row');
      assert.ok(topicNotes.has(crimsoraId1), 'and the topic-notes doc');
    },
  );

  await test(
    'fix round 2, IMPORTANT E (fix round 3, MINOR F): resolveProfileIdOrRaw NEVER resolves a ' +
      'trial:-prefixed id, flag ON or OFF — deps are provably never touched',
    async () => {
      process.env.PORTAL_IDENTITY_RESOLUTION = 'on';
      // MINOR F (fix round 3): the original version of this test asserted
      // only the RETURN VALUE, which cannot fail — resolveProfileIdOrRaw's
      // own degrade-on-failure catch ALSO returns the raw id whenever
      // resolveProfileId throws a plain (non-ProfileIdentityError) Error,
      // which is exactly what `connectDB()` throws in this hermetic
      // environment (no MONGODB_URI). So deleting the short-circuit
      // entirely would still make the old assertion pass, via the degrade
      // path instead of the short-circuit — the same "prove the deps were
      // never invoked" technique Task 4's MUTATION GUARD test used against
      // the read-then-write anti-pattern. A counting `deps` proves it here:
      // if the short-circuit is ever removed or reordered after this
      // point, `newId`/`findOneAndUpsert` would be called at least once.
      let depsCalls = 0;
      const explodingDeps: ResolverDeps = {
        newId: () => { depsCalls++; throw new Error('deps must not be touched for a trial: id'); },
        findExisting: async () => { depsCalls++; throw new Error('deps must not be touched for a trial: id'); },
        findOneAndUpsert: async () => { depsCalls++; throw new Error('deps must not be touched for a trial: id'); },
      };
      const id = await resolveProfileIdOrRaw({ partnerId: 'crimsora', externalStudentId: 'trial:abc123' }, explodingDeps);
      assert.strictEqual(id, 'trial:abc123', 'a trial: id must pass through completely unresolved');
      assert.strictEqual(depsCalls, 0, 'the resolver deps must never be invoked for a trial: id');
    },
  );

  await test(
    'fix round 2, IMPORTANT D: a ProfileIdentityError (e.g. missing partnerId) stays LOUD — never degrades',
    async () => {
      process.env.PORTAL_IDENTITY_RESOLUTION = 'on';
      // Empty partnerId trips resolveProfileId's own guard BEFORE it ever
      // touches deps (real Mongo), so this is safe to run hermetically —
      // and it's exactly the "caller forgot to thread partnerId" case
      // IMPORTANT C's required-param change is supposed to make
      // unreachable in `src/`. This is the backstop: if it ever DID happen,
      // it must not silently degrade to the raw externalStudentId.
      await assert.rejects(
        () => resolveProfileIdOrRaw({ partnerId: '', externalStudentId: 'user_1' }),
        (err: unknown) => {
          assert.ok(err instanceof ProfileIdentityError, `expected ProfileIdentityError, got ${err}`);
          return true;
        },
      );
    },
  );

  await test('flag OFF (unset): the raw body studentId passes through UNCHANGED — the default-safe path', async () => {
    delete process.env.PORTAL_IDENTITY_RESOLUTION;
    // A resolver that throws on any call — proves the off-branch never even
    // reaches resolveProfileId, not just that it happens to return the same
    // value.
    const explodingDeps: ResolverDeps = {
      newId: () => { throw new Error('resolveProfileId must not run while the flag is off'); },
      findExisting: async () => { throw new Error('resolveProfileId must not run while the flag is off'); },
      findOneAndUpsert: async () => { throw new Error('resolveProfileId must not run while the flag is off'); },
    };
    const handler = buildHandler(explodingDeps);
    const id = await resolvedIdFor(handler, 'crimsora');
    assert.strictEqual(id, 'user_1', 'flag off must pass the raw id through exactly as pre-M1c code did');
  });

  await test('flag explicitly "off" (not just unset) also passes the raw id through', async () => {
    process.env.PORTAL_IDENTITY_RESOLUTION = 'off';
    const explodingDeps: ResolverDeps = {
      newId: () => { throw new Error('must not run'); },
      findExisting: async () => { throw new Error('must not run'); },
      findOneAndUpsert: async () => { throw new Error('must not run'); },
    };
    const handler = buildHandler(explodingDeps);
    const id = await resolvedIdFor(handler, 'academy');
    assert.strictEqual(id, 'user_1');
  });

  delete process.env.PORTAL_IDENTITY_RESOLUTION;

  await test(
    'fix round 3, CRITICAL A1: a token-less preferences PATCH succeeds (200) — never 401 — even ' +
      'with EMBED_TOKEN_ENFORCE=on',
    async () => {
      // The regression this proves: an earlier version of this route
      // required a valid embed token and 401'd everyone else.
      // /tutor/settings (this route's only client, useStudentPreferences.ts)
      // is retail and sends no token at all, so that 401 would have fired
      // on every real user the moment the code shipped — independent of
      // PORTAL_IDENTITY_RESOLUTION, since this auth check isn't gated by
      // that flag. Runs with EMBED_TOKEN_ENFORCE='on' (the strictest mode)
      // specifically to prove the no-token path survives even there.
      process.env.EMBED_TOKEN_ENFORCE = 'on';
      try {
        const { PATCH } = await import('../src/app/api/tutor/student-profile/[id]/preferences/route');
        const req = new Request('https://engine.test/api/tutor/student-profile/stu-retail-1/preferences', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ humorCeiling: 'light' }),
        }) as unknown as NextRequest;
        const res = await PATCH(req, { params: Promise.resolve({ id: 'stu-retail-1' }) });
        assert.strictEqual(res.status, 200, 'a retail (no-token) preferences PATCH must succeed, not 401');
        const json = (await res.json()) as { preferences?: { humorCeiling?: string } };
        assert.strictEqual(json.preferences?.humorCeiling, 'light', 'the preference actually persisted');
      } finally {
        delete process.env.EMBED_TOKEN_ENFORCE;
      }
    },
  );

  await test(
    'fix round 3, CRITICAL A1: a token-less topic-notes GET never 401s, even with EMBED_TOKEN_ENFORCE=on',
    async () => {
      // Same regression as above, for /tutor/dev/notes (this route's other
      // no-auth-history caller). Asserts !== 401 rather than === 200
      // because this specific baselineId isn't a registered baseline (a
      // 404 is the correct, unrelated business-logic outcome) — the only
      // thing under test is that the auth layer never blocks it.
      process.env.EMBED_TOKEN_ENFORCE = 'on';
      try {
        const { GET } = await import('../src/app/api/tutor/topic-notes/[studentId]/[baselineId]/route');
        const req = new Request(
          'https://engine.test/api/tutor/topic-notes/stu-retail-1/not-a-registered-baseline',
          { method: 'GET' },
        ) as unknown as NextRequest;
        const res = await GET(req, {
          params: Promise.resolve({ studentId: 'stu-retail-1', baselineId: 'not-a-registered-baseline' }),
        });
        assert.notStrictEqual(res.status, 401, 'a retail (no-token) topic-notes GET must never 401');
      } finally {
        delete process.env.EMBED_TOKEN_ENFORCE;
      }
    },
  );

  await test(
    'STATIC CHECK (fix round 1, MINOR 5): every direct caller of the profile store shows resolution evidence',
    () => {
      // This is the exact regression class CRITICAL 1 was: the enumeration
      // grep excluded student-profile/store.ts, hiding that
      // updateStudentPreferences is a THIRD entry point into the store
      // whose own getOrCreateStudentProfile call lives inside that excluded
      // file — so a call site could go completely unresolved while the
      // grep (and this suite, in round 1) reported "all accounted for".
      // This check runs the CORRECTED grep (no store.ts exclusion) and
      // fails if any matched file shows no evidence of resolution — either
      // a direct `resolveProfileIdOrRaw` call, or the `M1C-IDENTITY:
      // resolved by caller` marker for the few files that deliberately
      // receive an already-resolved id from their own caller instead of
      // resolving themselves (context-block.ts, mock-exam/report.ts — see
      // each file's own comment for why).
      //
      // LIMITATION (fix round 2, MINOR F): this check is FILE-granular and
      // only greps for the three profile-store entry points
      // (getOrCreateStudentProfile / getStudentProfile / updateStudentPreferences).
      // It would NOT have caught fix round 1's CRITICAL 2 (six OTHER
      // student-keyed stores — LearnerStateProjection, EvidenceEvent,
      // StudentTopicNotes, MockAttempt, EloRating — left on the raw id in a
      // file that already resolved for the profile) because a file with a
      // resolved profile call already passes this check regardless of what
      // its OTHER store calls in the same file do. The multi-store test
      // above is what actually exercises that cross-store guarantee.
      const srcDir = path.join(__dirname, '..', 'src');
      const grepOut = execFileSync(
        'grep',
        ['-rlE', 'getOrCreateStudentProfile|getStudentProfile\\(|updateStudentPreferences', srcDir],
        { encoding: 'utf8' },
      );
      const files = grepOut
        .split('\n')
        .map((f) => f.trim())
        .filter((f) => f && !f.endsWith('student-profile/store.ts') && !f.endsWith('.test.ts'));
      assert.ok(files.length > 0, 'sanity: the grep should match at least the known call sites');

      const unaccounted: string[] = [];
      for (const f of files) {
        const contents = require('node:fs').readFileSync(f, 'utf8') as string;
        const resolved =
          contents.includes('resolveProfileIdOrRaw') ||
          contents.includes('M1C-IDENTITY: resolved by caller');
        if (!resolved) unaccounted.push(f);
      }
      assert.deepStrictEqual(
        unaccounted, [],
        `these files call the profile store but show no resolution evidence: ${unaccounted.join(', ')}`,
      );
    },
  );

  console.log(`\n${passed} passed, ${failed} failed\n`);
  if (failed > 0) process.exit(1);
})();
