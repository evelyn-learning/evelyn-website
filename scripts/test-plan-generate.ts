/**
 * Runtime lesson generation — engine-side store behavior.
 *
 * Covers the pieces of the "generate a lesson plan from raw text/topic at
 * runtime" workstream that live in `src/lib/tutor/lesson-plan/store.ts` and
 * friends. This script is extended by later tasks in the same workstream
 * (topic-plan generation cache, plan-generate / plan-expand routes) — keep
 * new tests as additional named async functions invoked from `main()`.
 *
 * Run: `npm run test:plan-generate`
 *
 * Requires: MONGODB_URI (loaded from .env.local below) — this script talks
 * to the real lesson-plan collection and cleans up its own rows.
 */

import { config } from 'dotenv';
import path from 'path';

config({ path: path.resolve(process.cwd(), '.env.local') });

import assert from 'node:assert';
import { upsertLessonPlan, listLessonPlans, deleteLessonPlan, getLessonPlan } from '@/lib/tutor/lesson-plan/store';
import { topicCacheKey, findCachedPlan } from '@/lib/tutor/lesson-plan/generation-cache';
import { LessonPlanModel } from '@/models/LessonPlan';
import connectDB from '@/lib/db';

// Task 4 — POST /api/portal/v1/plan-generate. Mirrors test-portal-endpoints.ts's
// signing/invocation helper pattern to exercise the route handler directly.
process.env.PORTAL_PARTNER_SECRETS = JSON.stringify({ portalA: 'secret-a' });

import { signPortalRequest } from '@evelyn/portal-contract/auth';
import { POST as planGeneratePOST } from '@/app/api/portal/v1/plan-generate/route';
import type { NextRequest } from 'next/server';

const PLAN_GENERATE_SECRET = 'secret-a';
const PLAN_GENERATE_PARTNER = 'portalA';

function signedPlanGenerateRequest(method: string, pathWithQuery: string, bodyObj?: unknown): NextRequest {
  const body = bodyObj === undefined ? '' : JSON.stringify(bodyObj);
  const timestamp = String(Date.now());
  const sig = signPortalRequest(PLAN_GENERATE_SECRET, { method, path: pathWithQuery, timestamp, body });
  const headers: Record<string, string> = {
    'x-evelyn-partner': PLAN_GENERATE_PARTNER,
    'x-evelyn-timestamp': timestamp,
    'x-evelyn-signature': sig,
  };
  const init: RequestInit = { method, headers };
  if (method !== 'GET' && body) init.body = body;
  return new Request(`https://engine.test${pathWithQuery}`, init) as unknown as NextRequest;
}

async function callPlanGenerate(h: (r: NextRequest, c: unknown) => Promise<Response>, req: NextRequest) {
  const res = await h(req, undefined);
  return { status: res.status, json: await res.json() };
}

let passed = 0;
let failed = 0;

async function test(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    failed++;
    console.error(`  ✗ ${name}`);
    console.error(`    ${(err as Error).message}`);
  }
}

/** Generated plans (metadata.generatedFromText === true) must not surface
 *  in default listLessonPlans() results — only curated/seed content should
 *  populate pickers. They remain reachable with an explicit opt-in filter
 *  (`includeGenerated: true`) for callers that resume a generation flow. */
async function testGeneratedPlansHiddenFromListings() {
  const plan = await upsertLessonPlan({
    id: 'gen-test-hidden-1',
    title: 'Test Gen Plan',
    curriculum: 'freestyle',
    grade: '9-12',
    subject: 'math',
    los: [{ id: 'lo1', description: 'test lo' }],
    estimatedMinutes: 12,
    segments: [{ id: 'seg1', kind: 'hook', loId: 'lo1', goal: 'g' }],
    schemaVersion: 1,
    metadata: { generatedFromText: true },
  });
  try {
    const visible = await listLessonPlans({ subject: 'math', grade: '9-12' });
    assert.ok(!visible.some((p) => p.id === plan.id), 'generated plan must NOT appear in default listing');
    const withGenerated = await listLessonPlans({ subject: 'math', grade: '9-12', includeGenerated: true });
    assert.ok(withGenerated.some((p) => p.id === plan.id), 'generated plan MUST appear with includeGenerated');
  } finally {
    await deleteLessonPlan(plan.id);
  }
}

/** topicCacheKey must normalize whitespace/case on the topic and bucket
 *  grade + sessionMinutes into the same band/bucket so that two requests
 *  for "the same lesson" (different but grade-band-equivalent grades,
 *  different but bucket-equivalent session lengths) hit the same cache
 *  row. Grade 10 and 11 both fall in the 9-12 band; 28 and 22 minutes
 *  both fall in the <=30 'std' bucket. */
async function testTopicCacheKeySameBandAndBucketCollide() {
  const a = topicCacheKey({ topic: '  Pythagorean   Theorem ', grade: '10', sessionMinutes: 28 });
  const b = topicCacheKey({ topic: 'pythagorean theorem', grade: '11', sessionMinutes: 22 });
  assert.strictEqual(a, b, `expected normalized keys to collide, got "${a}" vs "${b}"`);
}

/** topicCacheKey must still distinguish requests that are genuinely
 *  different — different grade band, different length bucket, different
 *  topic — otherwise the cache would serve wrong-fit plans. */
async function testTopicCacheKeyDifferentInputsDiverge() {
  const base = topicCacheKey({ topic: 'pythagorean theorem', grade: '10', sessionMinutes: 28 });
  const differentGrade = topicCacheKey({ topic: 'pythagorean theorem', grade: '4', sessionMinutes: 28 });
  const differentLength = topicCacheKey({ topic: 'pythagorean theorem', grade: '10', sessionMinutes: 45 });
  const differentTopic = topicCacheKey({ topic: 'quadratic formula', grade: '10', sessionMinutes: 28 });
  assert.notStrictEqual(base, differentGrade, 'different grade band must diverge');
  assert.notStrictEqual(base, differentLength, 'different length bucket must diverge');
  assert.notStrictEqual(base, differentTopic, 'different topic must diverge');
}

/** findCachedPlan must return a plan previously upserted with a matching
 *  metadata.cacheKey, parsed through the store's canonical getLessonPlan
 *  path (not a raw Mongo doc). */
async function testFindCachedPlanReturnsUpsertedPlan() {
  const cacheKey = topicCacheKey({ topic: 'gen cache hit test', grade: '9', sessionMinutes: 20 });
  const plan = await upsertLessonPlan({
    id: 'gen-test-cache-hit-1',
    title: 'Test Gen Cache Plan',
    curriculum: 'freestyle',
    grade: '9-12',
    subject: 'math',
    los: [{ id: 'lo1', description: 'test lo' }],
    estimatedMinutes: 20,
    segments: [{ id: 'seg1', kind: 'hook', loId: 'lo1', goal: 'g' }],
    schemaVersion: 1,
    metadata: { generatedFromText: true, cacheKey },
  });
  try {
    const found = await findCachedPlan(cacheKey);
    assert.ok(found, 'expected a cached plan to be found');
    assert.strictEqual(found?.id, plan.id);
    assert.strictEqual(found?.metadata?.cacheKey, cacheKey);
  } finally {
    await deleteLessonPlan(plan.id);
  }
}

/** findCachedPlan must treat rows older than the TTL (default 30 days) as
 *  a miss — a topic's "best current explanation" can go stale. */
async function testFindCachedPlanReturnsNullForExpired() {
  const cacheKey = topicCacheKey({ topic: 'gen cache expiry test', grade: '9', sessionMinutes: 20 });
  const plan = await upsertLessonPlan({
    id: 'gen-test-cache-expired-1',
    title: 'Test Gen Cache Expired Plan',
    curriculum: 'freestyle',
    grade: '9-12',
    subject: 'math',
    los: [{ id: 'lo1', description: 'test lo' }],
    estimatedMinutes: 20,
    segments: [{ id: 'seg1', kind: 'hook', loId: 'lo1', goal: 'g' }],
    schemaVersion: 1,
    metadata: { generatedFromText: true, cacheKey },
  });
  try {
    await connectDB();
    const expiredCreatedAt = new Date(Date.now() - 31 * 24 * 60 * 60 * 1000);
    // Go through the raw driver collection, not the Mongoose model — the
    // model's timestamps middleware strips a user-supplied `createdAt`
    // out of $set on non-upsert updates (by design, so app code can't
    // accidentally rewrite it), so `LessonPlanModel.updateOne(...)` is a
    // no-op here even with `{ timestamps: false }` passed as an option.
    await LessonPlanModel.collection.updateOne(
      { _id: plan.id } as Record<string, unknown>,
      { $set: { createdAt: expiredCreatedAt } },
    );
    const found = await findCachedPlan(cacheKey);
    assert.strictEqual(found, null, 'expected expired row to be a cache miss');
  } finally {
    await deleteLessonPlan(plan.id);
  }
}

/** Task 4, cases 1+2 combined: a real (live Anthropic) generation must
 *  200 with a "gen-"-prefixed planId, a mode of 'full' or 'picker', and
 *  durably persist the plan (getLessonPlan resolves it) with
 *  metadata.generatedFromText === true and metadata.cacheKey set. A
 *  second, identical request must then hit the Task 3 generation cache:
 *  cached: true, same planId, no second live generation. */
async function testPlanGenerateRealGenerationThenCacheHit() {
  const body = { text: 'pythagorean theorem', subject: 'math', grade: '9-12', sessionMinutes: 20 };
  let planId: string | undefined;
  try {
    const first = await callPlanGenerate(
      planGeneratePOST,
      signedPlanGenerateRequest('POST', '/api/portal/v1/plan-generate', body),
    );
    assert.strictEqual(first.status, 200, `expected 200, got ${first.status}: ${JSON.stringify(first.json)}`);
    planId = first.json.planId;
    assert.ok(
      typeof planId === 'string' && planId.startsWith('gen-'),
      `planId should start with "gen-", got ${JSON.stringify(planId)}`,
    );
    assert.ok(
      ['full', 'picker'].includes(first.json.mode),
      `mode should be 'full' or 'picker', got ${JSON.stringify(first.json.mode)}`,
    );
    assert.strictEqual(first.json.cached, false, 'first request should not be a cache hit');

    const stored = await getLessonPlan(planId as string);
    assert.ok(stored, 'generated plan should be durably persisted');
    assert.strictEqual(stored?.metadata?.generatedFromText, true, 'metadata.generatedFromText should be true');
    assert.ok(stored?.metadata?.cacheKey, 'metadata.cacheKey should be set');

    // Case 2: identical request → cache hit, same planId, no live regeneration.
    const second = await callPlanGenerate(
      planGeneratePOST,
      signedPlanGenerateRequest('POST', '/api/portal/v1/plan-generate', body),
    );
    assert.strictEqual(second.status, 200, `expected 200, got ${second.status}: ${JSON.stringify(second.json)}`);
    assert.strictEqual(second.json.cached, true, 'repeat request should be a cache hit');
    assert.strictEqual(second.json.planId, planId, 'cache hit should return the same planId');
  } finally {
    if (planId) await deleteLessonPlan(planId);
  }
}

/** Task 4, case 3: a request missing the required `subject` field must be
 *  rejected by the local PlanGenerateRequestSchema before any generation
 *  is attempted. */
async function testPlanGenerateMissingSubjectReturns400() {
  const body = { text: 'pythagorean theorem', grade: '9-12' };
  const { status } = await callPlanGenerate(
    planGeneratePOST,
    signedPlanGenerateRequest('POST', '/api/portal/v1/plan-generate', body),
  );
  assert.strictEqual(status, 400, `expected 400 for missing subject, got ${status}`);
}

async function main() {
  console.log('\nRuntime lesson generation — engine store:\n');

  await test('generated plans hidden from listings by default, visible with includeGenerated', testGeneratedPlansHiddenFromListings);
  await test('topicCacheKey collides for same grade band + length bucket after normalization', testTopicCacheKeySameBandAndBucketCollide);
  await test('topicCacheKey diverges for different grade band / length bucket / topic', testTopicCacheKeyDifferentInputsDiverge);
  await test('findCachedPlan returns a previously upserted plan by cacheKey', testFindCachedPlanReturnsUpsertedPlan);
  await test('findCachedPlan returns null for an expired createdAt', testFindCachedPlanReturnsNullForExpired);

  console.log('\nPOST /api/portal/v1/plan-generate (Task 4):\n');
  await test(
    'valid request → 200, gen- planId, mode full|picker, durably persisted; repeat request → cache hit',
    testPlanGenerateRealGenerationThenCacheHit,
  );
  await test('missing subject → 400', testPlanGenerateMissingSubjectReturns400);

  console.log(`\n${passed} passed, ${failed} failed\n`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('Fatal error running test-plan-generate:', err);
  process.exit(1);
});
