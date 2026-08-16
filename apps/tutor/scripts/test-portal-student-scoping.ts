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

/**
 * Run `fn` with `process.env[key]` set to `value`, then restore whatever was
 * there before — not just `delete` it. M1c Task 5 (fix round 4): a bare
 * `delete process.env[KEY]` in a `finally` clobbers a value that existed
 * before this test touched it (harmless for `EMBED_TOKEN_ENFORCE` in this
 * process today, but a contagious pattern to avoid regardless).
 */
async function withEnv<T>(key: string, value: string, fn: () => Promise<T>): Promise<T> {
  const prev = process.env[key];
  process.env[key] = value;
  try {
    return await fn();
  } finally {
    if (prev === undefined) delete process.env[key];
    else process.env[key] = prev;
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
      await withEnv('EMBED_TOKEN_ENFORCE', 'on', async () => {
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
      });
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
      await withEnv('EMBED_TOKEN_ENFORCE', 'on', async () => {
        const { GET } = await import('../src/app/api/tutor/topic-notes/[studentId]/[baselineId]/route');
        const req = new Request(
          'https://engine.test/api/tutor/topic-notes/stu-retail-1/not-a-registered-baseline',
          { method: 'GET' },
        ) as unknown as NextRequest;
        const res = await GET(req, {
          params: Promise.resolve({ studentId: 'stu-retail-1', baselineId: 'not-a-registered-baseline' }),
        });
        assert.notStrictEqual(res.status, 401, 'a retail (no-token) topic-notes GET must never 401');
      });
    },
  );

  await test(
    'fix round 4, spec §4.0 refinement: a PRESENT but invalid token gets 401 (with a log line), ' +
      'never a silent evelyn write',
    async () => {
      // The regression this proves: partnerIdForInternalRoute alone (round
      // 3) fell back to 'evelyn' for a present-but-invalid token the same
      // as a genuinely absent one — so a partner session whose token
      // expired mid-session (or any tampered/malformed token) would have
      // every subsequent topic-notes PATCH silently land under
      // ('evelyn', rawStudentId) instead of erroring. A present token is
      // NOT retail; it must reject, not degrade.
      await withEnv('EMBED_TOKEN_ENFORCE', 'on', async () => {
        const { PATCH } = await import('../src/app/api/tutor/topic-notes/[studentId]/[baselineId]/route');
        const req = new Request(
          'https://engine.test/api/tutor/topic-notes/stu-retail-1/some.baseline.id',
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'x-embed-token': 'not-a-valid-jwt' },
            body: JSON.stringify({ bucket: 'theory', sessionId: 's1', input: {} }),
          },
        ) as unknown as NextRequest;
        const originalError = console.error;
        const errorCalls: unknown[][] = [];
        console.error = (...args: unknown[]) => { errorCalls.push(args); };
        let res: Response;
        try {
          res = await PATCH(req, {
            params: Promise.resolve({ studentId: 'stu-retail-1', baselineId: 'some.baseline.id' }),
          });
        } finally {
          console.error = originalError;
        }
        assert.strictEqual(res.status, 401, 'a present-but-invalid token must 401, not silently resolve under evelyn');
        const json = (await res.json()) as { error?: string; reason?: string };
        assert.strictEqual(json.error, 'unauthorized');
        assert.ok(json.reason, 'the rejection reason is reported, not swallowed');
        assert.ok(
          errorCalls.length > 0,
          'a log line was emitted — this must never be a SILENT misattribution (the exact failure mode ' +
            "\"'on' mode returns {allow:false} with no log line\" that made round 3's gap invisible)",
        );
      });
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

  await test(
    'A-I6 STATIC CHECK: every /api/tutor/student-profile fetch in useStudentPreferences attaches x-embed-token, ' +
      'and VoiceTutorRealtime supplies one',
    () => {
      // The last un-audited embed-originated fetch pair. Every other one had
      // the header added across rounds 2-4; this hook was missed, and is
      // benign today only by accident (the in-session humor chip calls the
      // hook with no studentId, so the write early-returns). One partner
      // link to /tutor/settings, or one change giving that chip a studentId,
      // splits a partner student's preferences into an ('evelyn', <partner
      // uuid>) shadow profile.
      //
      // This is a STATIC check, not a behavioural one: the hook is React and
      // this suite has no renderer. It is written to be falsifiable — the
      // counts are per CALL SITE, so removing the header from either fetch
      // (not merely from the file) fails it.
      const fs = require('node:fs') as typeof import('node:fs');
      const hookPath = path.join(__dirname, '..', 'src', 'hooks', 'useStudentPreferences.ts');
      const hook = fs.readFileSync(hookPath, 'utf8');
      const profileFetches = hook.split('fetch(`/api/tutor/student-profile/').length - 1;
      assert.strictEqual(profileFetches, 2, 'sanity: the hook still has exactly two student-profile call sites (GET + PATCH)');
      const headerAttachments = hook.split("'x-embed-token'").length - 1;
      assert.strictEqual(
        headerAttachments, profileFetches,
        'every student-profile fetch in this hook must attach x-embed-token — one per call site',
      );
      assert.ok(hook.includes('embedToken?: string'), 'the hook must accept an embedToken option');

      const componentPath = path.join(__dirname, '..', 'src', 'app', 'tutor', 'components', 'VoiceTutorRealtime.tsx');
      const component = fs.readFileSync(componentPath, 'utf8');
      assert.ok(
        /useStudentPreferences\(\{[^}]*embedToken[^}]*\}\)/.test(component),
        'VoiceTutorRealtime (the embed-rendered caller, which already holds the token) must pass embedToken to the hook',
      );
    },
  );

  // -------------------------------------------------------------------------
  // M1c final review, A-I5: the round-4 embed-token rule reached four of the
  // six identity-deriving internal routes. `student-profile/[id]` GET and
  // POST gated only on `!auth.allow` — and in EMBED_TOKEN_ENFORCE='log'
  // checkEmbedAuth returns `{allow: true, reason, payload}` for a token that
  // FAILED verification, so `!auth.allow` is false, the request proceeds,
  // and partnerIdForInternalRoute degrades it to 'evelyn'. POST is the
  // session-end commit: mastery deltas, gaps and segmentOutcomes evidence
  // for the whole session, written under ('evelyn', rawStudentId).
  //
  // The existing round-4 test covers only topic-notes PATCH in 'on' mode,
  // where `!auth.allow` catches it — so it could not have caught this.
  // These run in 'log' mode specifically.
  // -------------------------------------------------------------------------

  async function callWithCapturedErrors<T>(fn: () => Promise<T>): Promise<{ result: T; errorCalls: unknown[][] }> {
    const originalError = console.error;
    const errorCalls: unknown[][] = [];
    console.error = (...args: unknown[]) => { errorCalls.push(args); };
    try {
      return { result: await fn(), errorCalls };
    } finally {
      console.error = originalError;
    }
  }

  await test(
    "A-I5 (EMBED_TOKEN_ENFORCE='log'): a present-but-invalid token on student-profile POST 401s — it never " +
      'proceeds to write the session outcome under evelyn',
    async () => {
      await withEnv('EMBED_TOKEN_ENFORCE', 'log', async () => {
        const { POST } = await import('../src/app/api/tutor/student-profile/[id]/route');
        const req = new Request('https://engine.test/api/tutor/student-profile/stu-partner-1', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-embed-token': 'not-a-valid-jwt' },
          body: JSON.stringify({ sessionId: 's1', masteryDeltas: [{ loId: 'lo.1', delta: 0.2 }] }),
        }) as unknown as NextRequest;
        const { result: res, errorCalls } = await callWithCapturedErrors(() =>
          POST(req, { params: Promise.resolve({ id: 'stu-partner-1' }) }),
        );
        assert.strictEqual(res.status, 401, "'log' mode must not let a present-but-invalid token through this write path");
        const json = (await res.json()) as { error?: string; reason?: string };
        assert.strictEqual(json.error, 'unauthorized');
        assert.ok(json.reason, 'the rejection reason is reported, not swallowed');
        assert.ok(errorCalls.length > 0, 'a console.error line must be emitted — a silent misattribution is the failure mode');
      });
    },
  );

  await test(
    "A-I5 (EMBED_TOKEN_ENFORCE='log'): a present-but-invalid token on student-profile GET 401s too",
    async () => {
      await withEnv('EMBED_TOKEN_ENFORCE', 'log', async () => {
        const { GET } = await import('../src/app/api/tutor/student-profile/[id]/route');
        const req = new Request('https://engine.test/api/tutor/student-profile/stu-partner-1', {
          method: 'GET',
          headers: { 'x-embed-token': 'not-a-valid-jwt' },
        }) as unknown as NextRequest;
        const { result: res, errorCalls } = await callWithCapturedErrors(() =>
          GET(req, { params: Promise.resolve({ id: 'stu-partner-1' }) }),
        );
        assert.strictEqual(res.status, 401);
        assert.ok(errorCalls.length > 0, 'the rejection must be logged');
      });
    },
  );

  await test(
    "A-I5: a token-LESS student-profile GET/POST still succeeds in 'log' mode — an absent token is retail, not a rejection",
    async () => {
      await withEnv('EMBED_TOKEN_ENFORCE', 'log', async () => {
        const { GET, POST } = await import('../src/app/api/tutor/student-profile/[id]/route');
        const getRes = await GET(
          new Request('https://engine.test/api/tutor/student-profile/stu-retail-2', { method: 'GET' }) as unknown as NextRequest,
          { params: Promise.resolve({ id: 'stu-retail-2' }) },
        );
        assert.notStrictEqual(getRes.status, 401, 'a retail (no-token) profile GET must never 401');
        const postRes = await POST(
          new Request('https://engine.test/api/tutor/student-profile/stu-retail-2', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId: 's-retail-1' }),
          }) as unknown as NextRequest,
          { params: Promise.resolve({ id: 'stu-retail-2' }) },
        );
        assert.notStrictEqual(postRes.status, 401, 'a retail (no-token) profile POST must never 401');
      });
    },
  );

  // -------------------------------------------------------------------------
  // M1c final review, reviewer B finding 8 (mutations M38, M39, M41, M42):
  // spec §4.1 compliance at the REAL call sites was guarded only by the
  // file-granular STATIC CHECK above. Reverting a single store call inside a
  // file that already contains the string `resolveProfileIdOrRaw` shipped
  // green — including reverting the WHOLE learner-state projection query,
  // the gaps profile read, emitSessionResult's resolve and
  // submitAssessment's resolve. That is the exact bug class Task 5 round 1
  // shipped at six sites.
  //
  // These four tests are behavioural: they run the real call sites and
  // observe WHICH id reaches the student-keyed store, with the flag on and
  // with it off.
  //
  // Why the machinery below: with no MONGODB_URI, `resolveProfileIdOrRaw`
  // degrades to the raw id on ANY resolution failure — so flag-on and
  // flag-off would be indistinguishable unless resolution actually
  // SUCCEEDS. So `connectDB` is stubbed and the resolver's single Mongo
  // call (`StudentProfileModel.findOneAndUpdate`, reached through the real
  // `defaultResolverDeps`, through the real `identityFilter`) is stubbed to
  // mint `resolved::<partnerId>::<externalStudentId>`. Everything between
  // the route handler and that one call is production code. `bufferCommands
  // = false` makes every OTHER (unstubbed) model call fail fast, exactly as
  // the real `connectDB()` throw does today, so the surrounding degrade
  // paths behave as they already do in this suite.
  // -------------------------------------------------------------------------

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const storeModule = require('@/lib/tutor/student-profile/store') as Record<string, any>;
  const learnerModelModule = require('@/lib/tutor/learner-model/store') as Record<string, any>;
  const dbModule = require('@core/db') as Record<string, any>;
  const { StudentProfileModel } = require('@/models/StudentProfile') as Record<string, any>;
  const { LearnerStateProjectionModel, LearnerStateSnapshotModel } = require('@/models') as Record<string, any>;
  const mongooseLib = require('mongoose') as Record<string, any>;

  /** A stand-in for a Mongoose query: chainable AND awaitable. */
  function fakeQuery(result: unknown): any {
    const node: any = {
      lean: () => node,
      select: () => node,
      sort: () => node,
      exec: async () => result,
      then: (res: (v: unknown) => unknown, rej: (e: unknown) => unknown) => Promise.resolve(result).then(res, rej),
    };
    return node;
  }

  /** Install property patches and return a restore function. */
  function patchAll(entries: Array<[Record<string, any>, string, unknown]>): () => void {
    const saved = entries.map(([obj, key]) => [obj, key, obj[key]] as [Record<string, any>, string, unknown]);
    for (const [obj, key, value] of entries) obj[key] = value;
    return () => { for (const [obj, key, value] of saved) obj[key] = value; };
  }

  /** The stub the resolver's ONE Mongo call is replaced by. Reads the filter
   *  the real `identityFilter` produced, so a filter that dropped
   *  `partnerId` mints `resolved::undefined::…` and the cross-partner
   *  assertions below fail. */
  function resolverUpsertStub(filter: any): any {
    return fakeQuery({ _id: `resolved::${filter.partnerId}::${filter.externalStudentId}` });
  }

  const identityStubs: Array<[Record<string, any>, string, unknown]> = [
    [dbModule, 'default', async () => undefined],
    [StudentProfileModel, 'findOneAndUpdate', resolverUpsertStub],
  ];

  function signedGet(partnerId: string, pathWithQuery: string): NextRequest {
    const timestamp = String(Date.now());
    const sig = signPortalRequest(SECRET, { method: 'GET', path: pathWithQuery, timestamp, body: '' });
    return new Request(`https://engine.test${pathWithQuery}`, {
      method: 'GET',
      headers: {
        'x-evelyn-partner': partnerId,
        'x-evelyn-timestamp': timestamp,
        'x-evelyn-signature': sig,
      },
    }) as unknown as NextRequest;
  }

  const savedBufferCommands = mongooseLib.get('bufferCommands');
  mongooseLib.set('bufferCommands', false);

  await test(
    'B-8 / M39: /api/portal/v1/gaps reads the profile under the RESOLVED id when the flag is on, and the RAW id when it is off',
    async () => {
      const seen: string[] = [];
      const restore = patchAll([
        ...identityStubs,
        [storeModule, 'getOrCreateStudentProfile', async (id: string) => { seen.push(id); return { id, gaps: [] }; }],
      ]);
      try {
        const { GET } = await import('../src/app/api/portal/v1/gaps/route');

        process.env.PORTAL_IDENTITY_RESOLUTION = 'on';
        const onRes = await GET(signedGet('crimsora', '/api/portal/v1/gaps?studentId=user_1'), undefined);
        assert.strictEqual(onRes.status, 200, 'sanity: the request must actually reach the handler');
        assert.strictEqual(seen.at(-1), 'resolved::crimsora::user_1', 'the profile read must use the RESOLVED id');

        await GET(signedGet('academy', '/api/portal/v1/gaps?studentId=user_1'), undefined);
        assert.strictEqual(
          seen.at(-1), 'resolved::academy::user_1',
          'the same external id from a different partner must reach a DIFFERENT profile id',
        );

        delete process.env.PORTAL_IDENTITY_RESOLUTION;
        await GET(signedGet('crimsora', '/api/portal/v1/gaps?studentId=user_1'), undefined);
        assert.strictEqual(seen.at(-1), 'user_1', 'flag off must pass the raw id through, byte-identical to pre-M1c');
      } finally {
        restore();
        delete process.env.PORTAL_IDENTITY_RESOLUTION;
      }
    },
  );

  await test(
    'B-8 / M38: /api/portal/v1/learner-state queries LearnerStateProjection under the RESOLVED id (flag on) and the RAW id (flag off)',
    async () => {
      const projQueries: Array<{ studentId?: string }> = [];
      const snapQueries: Array<{ studentId?: string }> = [];
      const restore = patchAll([
        ...identityStubs,
        [storeModule, 'getOrCreateStudentProfile', async (id: string) => ({ id, gaps: [] })],
        [LearnerStateProjectionModel, 'find', (q: any) => { projQueries.push(q); return fakeQuery([]); }],
        [LearnerStateSnapshotModel, 'findOne', (q: any) => { snapQueries.push(q); return fakeQuery(null); }],
      ]);
      try {
        const { GET } = await import('../src/app/api/portal/v1/learner-state/route');

        process.env.PORTAL_IDENTITY_RESOLUTION = 'on';
        const onRes = await GET(signedGet('crimsora', '/api/portal/v1/learner-state?studentId=user_1'), undefined);
        assert.strictEqual(onRes.status, 200, 'sanity: the request must actually reach the projection query');
        assert.strictEqual(
          projQueries.at(-1)?.studentId, 'resolved::crimsora::user_1',
          'the projection query is a student-keyed store too — spec §4.1: one identity space, not two',
        );
        assert.strictEqual(snapQueries.at(-1)?.studentId, 'resolved::crimsora::user_1', 'and the snapshot read');

        delete process.env.PORTAL_IDENTITY_RESOLUTION;
        await GET(signedGet('crimsora', '/api/portal/v1/learner-state?studentId=user_1'), undefined);
        assert.strictEqual(projQueries.at(-1)?.studentId, 'user_1', 'flag off must query on the raw id');
      } finally {
        restore();
        delete process.env.PORTAL_IDENTITY_RESOLUTION;
      }
    },
  );

  await test(
    'B-8 / M41: emitSessionResult commits the session under the RESOLVED id (flag on) and the RAW id (flag off)',
    async () => {
      const seen: string[] = [];
      const restore = patchAll([
        ...identityStubs,
        [storeModule, 'getOrCreateStudentProfile', async (id: string) => {
          seen.push(id);
          return { id, mastery: {}, gaps: [], recentSessions: [], preferences: {}, schemaVersion: 1 };
        }],
      ]);
      try {
        const { emitSessionResult } = await import('../src/lib/tutor/portal/session-result');
        const req = {
          sessionId: 'sess-b8-1', studentId: 'user_1', courseId: 'course-1',
          status: 'completed' as const, milestone: 'none' as const,
          losTouched: [], masteryDeltas: [], gaps: [], notesTouched: [],
        };

        process.env.PORTAL_IDENTITY_RESOLUTION = 'on';
        const result = await emitSessionResult(req, { partnerId: 'crimsora' });
        assert.strictEqual(seen.at(-1), 'resolved::crimsora::user_1', 'the session-end commit must use the RESOLVED id');
        assert.strictEqual(
          result.studentId, 'user_1',
          'the CONTRACT response still echoes the raw external id — the portal has no concept of our surrogate',
        );

        await emitSessionResult({ ...req, sessionId: 'sess-b8-2' }, { partnerId: 'academy' });
        assert.strictEqual(seen.at(-1), 'resolved::academy::user_1', 'two partners, same external id, two profiles');

        delete process.env.PORTAL_IDENTITY_RESOLUTION;
        await emitSessionResult({ ...req, sessionId: 'sess-b8-3' }, { partnerId: 'crimsora' });
        assert.strictEqual(seen.at(-1), 'user_1', 'flag off must commit under the raw id');
      } finally {
        restore();
        delete process.env.PORTAL_IDENTITY_RESOLUTION;
      }
    },
  );

  await test(
    'B-8 / M42: submitAssessment stamps its evidence rows with the RESOLVED id (flag on) and the RAW id (flag off)',
    async () => {
      const evidenceStudentIds: string[] = [];
      const restore = patchAll([
        ...identityStubs,
        [storeModule, 'getOrCreateStudentProfile', async (id: string) => ({
          id, mastery: {}, gaps: [], recentSessions: [], preferences: {}, schemaVersion: 1,
        })],
        [learnerModelModule, 'appendEvidence', async (rows: Array<{ studentId: string }>) => {
          for (const r of rows) evidenceStudentIds.push(r.studentId);
        }],
      ]);
      try {
        const { submitAssessment } = await import('../src/lib/tutor/portal/assessment');
        const submission = (sessionId: string) => ({
          assessmentId: 'asmt-b8', studentId: 'user_1', courseId: 'course-1', sessionId,
          responses: [{ itemId: 'i1', loId: 'lo.1', response: { text: '5' } }],
        });
        // Every item resolves to null → the "unresolved item" branch, which
        // still emits an evidence row stamped with `profileId`. No grading
        // deps are ever reached.
        const resolveItem = async () => null;
        const gradeDeps = { judgeSingleAnswer: async () => { throw new Error('grading must not be reached'); } };

        process.env.PORTAL_IDENTITY_RESOLUTION = 'on';
        evidenceStudentIds.length = 0;
        await submitAssessment(submission('diag-b8-1') as any, gradeDeps as any, resolveItem as any, 'crimsora');
        assert.ok(evidenceStudentIds.length > 0, 'sanity: at least one evidence row must have been emitted');
        assert.deepStrictEqual(
          [...new Set(evidenceStudentIds)], ['resolved::crimsora::user_1'],
          'EVERY evidence row this submission produced must carry the resolved id',
        );

        delete process.env.PORTAL_IDENTITY_RESOLUTION;
        evidenceStudentIds.length = 0;
        await submitAssessment(submission('diag-b8-2') as any, gradeDeps as any, resolveItem as any, 'crimsora');
        assert.ok(evidenceStudentIds.length > 0);
        assert.deepStrictEqual([...new Set(evidenceStudentIds)], ['user_1'], 'flag off must stamp the raw id');
      } finally {
        restore();
        delete process.env.PORTAL_IDENTITY_RESOLUTION;
      }
    },
  );

  mongooseLib.set('bufferCommands', savedBufferCommands);
  /* eslint-enable @typescript-eslint/no-explicit-any */

  console.log(`\n${passed} passed, ${failed} failed\n`);
  if (failed > 0) process.exit(1);
})();
