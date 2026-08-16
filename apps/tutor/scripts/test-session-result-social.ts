/**
 * Unit tests for Task D3 — socialMemoryDelta on the session-result emit
 * (src/lib/tutor/portal/session-result.ts). See
 * project_tutor_pedagogy_opener_calibration.
 *
 * Run: npx tsx scripts/test-session-result-social.ts   (npm run test:pedagogy-d3)
 * No DB / no network: the store uses its in-memory ephemeral fallback and the
 * extractor is dependency-injected as a stub (house injectable style — same
 * seam as D2's opts.complete).
 */

import { strict as assert } from 'node:assert';

// Flag ON by default for the suite; individual tests toggle it. The flag is
// read at CALL time inside buildSocialMemoryDelta, so per-test toggling works.
process.env.NEXT_PUBLIC_TUTOR_PEDAGOGY_OPENER = 'true';

import {
  emitSessionResult,
  extractSocialCarrier,
  type SocialEmitOptions,
} from '../src/lib/tutor/portal/session-result';
import { extractSocialThreads } from '../src/lib/tutor/portal/extract-social-threads';
import { updateStudentPreferences } from '../src/lib/tutor/student-profile/store';
import { stripNullsDeep } from '../src/lib/tutor/portal/serialize';
import {
  SessionResultSchema,
  SocialMemoryDeltaSchema,
  type SessionEmitRequest,
  type SocialThread,
} from '@evelyn/portal-contract/v1';

let passed = 0;
let failed = 0;
async function test(name: string, fn: () => Promise<void> | void) {
  try { await fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}

// ── Fixtures ────────────────────────────────────────────────────────────────

let seq = 0;
function freshReq(overrides: Partial<SessionEmitRequest> = {}): SessionEmitRequest {
  seq += 1;
  return {
    sessionId: `sess-d3-${seq}`,
    studentId: `stu-d3-${seq}`,
    courseId: 'course-1',
    status: 'completed',
    milestone: 'none',
    losTouched: [],
    masteryDeltas: [],
    gaps: [],
    notesTouched: [],
    ...overrides,
  };
}

const TRANSCRIPT: SocialEmitOptions['transcript'] = [
  { role: 'tutor', text: 'Welcome back! How was the weekend?' },
  { role: 'student', text: 'Good, I had a football game.' },
];

const EXISTING: SocialThread[] = [
  { id: 'thr_existing', note: 'Likes chess', kind: 'interest', capturedAt: '2026-06-01T00:00:00.000Z' },
];

/** Stub extractor factory (dependency-injected via opts.social.extract). */
function makeStub(result: Awaited<ReturnType<typeof extractSocialThreads>>) {
  const calls: Array<{ transcript: unknown; existingThreads: SocialThread[] }> = [];
  const stub: typeof extractSocialThreads = async (transcript, existingThreads) => {
    calls.push({ transcript, existingThreads });
    return result;
  };
  return { stub, calls };
}

const ONE_SUGGESTION = {
  suggestedThreads: [{ kind: 'interest' as const, note: 'Plays football on weekends' }],
  referencedThreadIds: ['thr_existing'],
};
const EMPTY_EXTRACTION = { suggestedThreads: [], referencedThreadIds: [] };

/** A subscribed student = portal context ingested ⇒ socialMemoryLevel stamped. */
async function subscribe(studentId: string, level: 'off' | 'light' | 'warm' = 'light') {
  await updateStudentPreferences(studentId, { socialMemoryLevel: level });
}

async function main() {
  console.log('emitSessionResult socialMemoryDelta — Task D3\n');

  await test('subscribed + flag on + stub extraction → delta present, schema-valid, no nulls', async () => {
    const req = freshReq();
    await subscribe(req.studentId);
    const { stub, calls } = makeStub(ONE_SUGGESTION);
    const result = await emitSessionResult(req, {
      social: { transcript: TRANSCRIPT, existingThreads: EXISTING, extract: stub },
      partnerId: 'test-partner-d3',
    });

    assert.ok(result.socialMemoryDelta, 'socialMemoryDelta must be present');
    const delta = result.socialMemoryDelta!;
    assert.equal(delta.new.length, 1);
    assert.ok(delta.new[0].id.startsWith('thr_'), 'synthesized id');
    assert.equal(delta.new[0].note, 'Plays football on weekends');
    assert.equal(delta.new[0].kind, 'interest');
    assert.ok(!Number.isNaN(Date.parse(delta.new[0].capturedAt)), 'capturedAt is ISO now');
    assert.deepEqual(delta.referenced, ['thr_existing']);

    // Schema-validation proof: the delta AND the whole result parse clean.
    SocialMemoryDeltaSchema.parse(delta);
    SessionResultSchema.parse(result);
    // stripNullsDeep is a no-op ⇒ no nulls anywhere on the wire.
    assert.deepEqual(stripNullsDeep(result), result);

    // The injected extractor received the inbound threads for dedupe/ref-filtering.
    assert.equal(calls.length, 1);
    assert.deepEqual(calls[0].existingThreads, EXISTING);
  });

  await test('flag off → no delta, extractor never called', async () => {
    delete process.env.NEXT_PUBLIC_TUTOR_PEDAGOGY_OPENER;
    try {
      const req = freshReq();
      await subscribe(req.studentId);
      const { stub, calls } = makeStub(ONE_SUGGESTION);
      const result = await emitSessionResult(req, {
        social: { transcript: TRANSCRIPT, existingThreads: EXISTING, extract: stub },
        partnerId: 'test-partner-d3',
      });
      assert.ok(!('socialMemoryDelta' in result), 'field must be absent');
      assert.equal(calls.length, 0, 'extractor must not run when the flag is off');
      SessionResultSchema.parse(result);
    } finally {
      process.env.NEXT_PUBLIC_TUTOR_PEDAGOGY_OPENER = 'true';
    }
  });

  await test("socialMemoryLevel 'off' → no delta, extractor never called", async () => {
    const req = freshReq();
    await subscribe(req.studentId, 'off');
    const { stub, calls } = makeStub(ONE_SUGGESTION);
    const result = await emitSessionResult(req, {
      social: { transcript: TRANSCRIPT, extract: stub },
      partnerId: 'test-partner-d3',
    });
    assert.ok(!('socialMemoryDelta' in result));
    assert.equal(calls.length, 0);
  });

  await test('socialMemoryLevel never set (no context ingest) → treated as opted out', async () => {
    const req = freshReq(); // fresh ephemeral profile, preferences = {}
    const { stub, calls } = makeStub(ONE_SUGGESTION);
    const result = await emitSessionResult(req, {
      social: { transcript: TRANSCRIPT, extract: stub },
      partnerId: 'test-partner-d3',
    });
    assert.ok(!('socialMemoryDelta' in result));
    assert.equal(calls.length, 0);
  });

  await test('no social carrier (demo/trial analog: caller sends no transcript) → no delta', async () => {
    const req = freshReq();
    await subscribe(req.studentId);
    const result = await emitSessionResult(req, { partnerId: 'test-partner-d3' });
    assert.ok(!('socialMemoryDelta' in result));
    SessionResultSchema.parse(result);
  });

  await test('empty extraction → field omitted entirely (never {new:[],referenced:[]})', async () => {
    const req = freshReq();
    await subscribe(req.studentId);
    const { stub, calls } = makeStub(EMPTY_EXTRACTION);
    const result = await emitSessionResult(req, {
      social: { transcript: TRANSCRIPT, extract: stub },
      partnerId: 'test-partner-d3',
    });
    assert.equal(calls.length, 1, 'extractor DID run');
    assert.ok(!('socialMemoryDelta' in result), 'empty delta must be omitted, not sent');
  });

  await test("checkpoint (status 'in_progress') → snapshot only, extractor never called", async () => {
    const req = freshReq({ status: 'in_progress' });
    await subscribe(req.studentId);
    const { stub, calls } = makeStub(ONE_SUGGESTION);
    const result = await emitSessionResult(req, {
      social: { transcript: TRANSCRIPT, extract: stub },
      partnerId: 'test-partner-d3',
    });
    assert.ok(!('socialMemoryDelta' in result));
    assert.equal(calls.length, 0);
  });

  await test('idempotent replay STILL extracts (live-flow ordering: runtime commit lands first)', async () => {
    // In production the engine runtime commits the session (same client
    // sessionId) BEFORE the academy's session-ended emit arrives — so the
    // replay branch is the NORMAL path for that emit. The pedagogical
    // deltas stay a no-op snapshot, but the social carrier must still be
    // extracted or the loop is dead in the live flow. Repeats are safe:
    // the academy dedupes threads and recency bumps are idempotent.
    const req = freshReq();
    await subscribe(req.studentId);
    const { stub, calls } = makeStub(ONE_SUGGESTION);
    const social: SocialEmitOptions = { transcript: TRANSCRIPT, existingThreads: EXISTING, extract: stub };
    const first = await emitSessionResult(req, { social, partnerId: 'test-partner-d3' });
    assert.ok(first.socialMemoryDelta, 'first emit carries the delta');
    const replay = await emitSessionResult(req, { social, partnerId: 'test-partner-d3' });
    assert.ok(replay.socialMemoryDelta, 'replay emit ALSO carries the delta (ordering fix)');
    assert.deepEqual(replay.learningStateDelta.gaps, { new: [], promoted: [], resolved: [] }, 'pedagogical deltas stay a no-op snapshot on replay');
    assert.equal(calls.length, 2, 'extractor ran on both emits');
  });

  await test('extractor throwing never breaks the emit (defensive wrap)', async () => {
    const req = freshReq();
    await subscribe(req.studentId);
    const throwing: typeof extractSocialThreads = async () => { throw new Error('boom'); };
    const result = await emitSessionResult(req, {
      social: { transcript: TRANSCRIPT, extract: throwing },
      partnerId: 'test-partner-d3',
    });
    assert.ok(!('socialMemoryDelta' in result));
    SessionResultSchema.parse(result);
  });

  // ── extractSocialCarrier (the route's loose-body reader) ──────────────
  console.log('\nextractSocialCarrier:');

  await test('valid loose body → transcript filtered + socialMemory schema-validated', () => {
    const carrier = extractSocialCarrier({
      sessionId: 'x', // contract fields ride along untouched
      transcript: [
        { role: 'tutor', text: 'hi' },
        { role: 'student', text: 'hello' },
        { role: 'system', text: 'dropped — unknown role' },
        { role: 'student', text: '   ' }, // dropped — blank
        'garbage',
      ],
      socialMemory: [
        EXISTING[0],
        { id: 'bad' }, // dropped — fails SocialThreadSchema
      ],
    });
    assert.ok(carrier);
    assert.deepEqual(carrier!.transcript, [
      { role: 'tutor', text: 'hi' },
      { role: 'student', text: 'hello' },
    ]);
    assert.deepEqual(carrier!.existingThreads, [EXISTING[0]]);
  });

  await test('absent/empty/malformed transcript → undefined (no extraction)', () => {
    assert.equal(extractSocialCarrier({ sessionId: 'x' }), undefined);
    assert.equal(extractSocialCarrier({ transcript: [] }), undefined);
    assert.equal(extractSocialCarrier({ transcript: 'nope' }), undefined);
    assert.equal(extractSocialCarrier(null), undefined);
    assert.equal(extractSocialCarrier('nope'), undefined);
    assert.equal(extractSocialCarrier([1, 2]), undefined);
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
  process.exit(0); // ephemeral store keeps no handles, but exit explicitly for safety
}

main().catch((err) => { console.error(err); process.exit(1); });
