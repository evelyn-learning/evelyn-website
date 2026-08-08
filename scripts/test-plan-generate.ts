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
import fs from 'node:fs';
import { upsertLessonPlan, listLessonPlans, deleteLessonPlan, getLessonPlan } from '@/lib/tutor/lesson-plan/store';
import { topicCacheKey, findCachedPlan, CACHE_KEY_VERSION } from '@/lib/tutor/lesson-plan/generation-cache';
import { minutesPerLOForGrade } from '@/lib/tutor/lesson-plan/session-budget';
import { LessonPlanModel } from '@/models/LessonPlan';
import connectDB from '@/lib/db';

// Task 4 — POST /api/portal/v1/plan-generate. Mirrors test-portal-endpoints.ts's
// signing/invocation helper pattern to exercise the route handler directly.
process.env.PORTAL_PARTNER_SECRETS = JSON.stringify({ portalA: 'secret-a' });

import { signPortalRequest } from '@evelyn/portal-contract/auth';
import { POST as planGeneratePOST } from '@/app/api/portal/v1/plan-generate/route';
import { POST as planExpandPOST } from '@/app/api/portal/v1/plan-expand/route';
import {
  toResponse,
  generatedPlanMetadata,
  PlanGenerateResponseSchema,
  PlanExpandResponseSchema,
} from '@/lib/tutor/lesson-plan/plan-generate-contract';
import { buildPickerPlan, STAGE2_SYSTEM } from '@/lib/tutor/lesson-plan/generate-from-text';
import { resolveAdvanceTarget } from '@/lib/tutor/lesson-plan/context';
import type { LessonPlan } from '@/lib/tutor/lesson-plan/types';
import type { PlanMaterial } from '@evelyn/portal-contract/v1';
import type { NextRequest } from 'next/server';

// Task 3 (Phase-2 doc ingestion) — POST /api/portal/v1/plan-generate with
// `materials`. Fixtures are shared with test-material-extract.ts.
const FIXTURES_DIR = path.resolve(__dirname, 'fixtures');

function loadFixtureAsMaterial(filename: string, kind: PlanMaterial['kind'], mimeType?: string): PlanMaterial {
  const buf = fs.readFileSync(path.join(FIXTURES_DIR, filename));
  return { kind, data: buf.toString('base64'), name: filename, mimeType };
}

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
 *  (`includeGenerated: true`) for callers that resume a generation flow.
 *
 *  Also covers the store.ts fix: the generatedFromText exclusion must live
 *  IN THE MONGO QUERY, not just as a JS-side `.filter()` applied AFTER
 *  `.find(query).limit(200)` — a JS-only filter still lets accumulating
 *  gen- rows consume slots out of the 200-doc budget, starving curated
 *  listings. This test inserts several generated rows alongside one
 *  ordinary (non-generated) row and asserts the ordinary row still
 *  surfaces in the default listing — a cheap proxy for "generated rows
 *  don't compete for the limit" without actually inserting 200 rows. */
async function testGeneratedPlansHiddenFromListings() {
  const makeGenerated = (id: string) =>
    upsertLessonPlan({
      id,
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
  const plan = await makeGenerated('gen-test-hidden-1');
  const extraGenerated = await Promise.all(['gen-test-hidden-2', 'gen-test-hidden-3'].map(makeGenerated));
  const curated = await upsertLessonPlan({
    id: 'test-hidden-curated-1',
    title: 'Test Curated Plan',
    curriculum: 'freestyle',
    grade: '9-12',
    subject: 'math',
    los: [{ id: 'lo1', description: 'test lo' }],
    estimatedMinutes: 12,
    segments: [{ id: 'seg1', kind: 'hook', loId: 'lo1', goal: 'g' }],
    schemaVersion: 1,
    metadata: {},
  });
  try {
    const visible = await listLessonPlans({ subject: 'math', grade: '9-12' });
    assert.ok(!visible.some((p) => p.id === plan.id), 'generated plan must NOT appear in default listing');
    for (const g of extraGenerated) {
      assert.ok(!visible.some((p) => p.id === g.id), `generated plan ${g.id} must NOT appear in default listing`);
    }
    assert.ok(
      visible.some((p) => p.id === curated.id),
      'the non-generated (curated-proxy) row must still surface in the default listing alongside generated rows',
    );

    const withGenerated = await listLessonPlans({ subject: 'math', grade: '9-12', includeGenerated: true });
    assert.ok(withGenerated.some((p) => p.id === plan.id), 'generated plan MUST appear with includeGenerated');
    for (const g of extraGenerated) {
      assert.ok(withGenerated.some((p) => p.id === g.id), `generated plan ${g.id} MUST appear with includeGenerated`);
    }
  } finally {
    await deleteLessonPlan(plan.id);
    await Promise.all(extraGenerated.map((g) => deleteLessonPlan(g.id)));
    await deleteLessonPlan(curated.id);
  }
}

/** topicCacheKey must normalize whitespace/case on the topic and bucket
 *  grade + sessionMinutes into the same band/bucket so that two requests
 *  for "the same lesson" (different but grade-band-equivalent grades,
 *  different but bucket-equivalent session lengths) hit the same cache
 *  row. Grade 10 and 11 both fall in the 9-12 band; 28 and 22 minutes
 *  both fall in the <=30 'std' bucket. */
async function testTopicCacheKeySameBandAndBucketCollide() {
  const a = topicCacheKey({ topic: '  Pythagorean   Theorem ', subject: 'math', grade: '10', sessionMinutes: 28 });
  const b = topicCacheKey({ topic: 'pythagorean theorem', subject: 'Math', grade: '11', sessionMinutes: 22 });
  assert.strictEqual(a, b, `expected normalized keys to collide, got "${a}" vs "${b}"`);
}

/** topicCacheKey must still distinguish requests that are genuinely
 *  different — different grade band, different length bucket, different
 *  topic, different subject, different locale — otherwise the cache would
 *  serve wrong-fit (or outright wrong-subject / wrong-language) plans.
 *  Motivating bug (review finding #5): without subject/locale in the key,
 *  a "waves" request in physics could serve a cached music plan, and an
 *  es-locale request could serve an English-language plan. */
async function testTopicCacheKeyDifferentInputsDiverge() {
  const base = topicCacheKey({ topic: 'pythagorean theorem', subject: 'math', grade: '10', sessionMinutes: 28 });
  const differentGrade = topicCacheKey({ topic: 'pythagorean theorem', subject: 'math', grade: '4', sessionMinutes: 28 });
  const differentLength = topicCacheKey({ topic: 'pythagorean theorem', subject: 'math', grade: '10', sessionMinutes: 45 });
  const differentTopic = topicCacheKey({ topic: 'quadratic formula', subject: 'math', grade: '10', sessionMinutes: 28 });
  const differentSubject = topicCacheKey({ topic: 'waves', subject: 'physics', grade: '10', sessionMinutes: 28 });
  const sameTopicMusicSubject = topicCacheKey({ topic: 'waves', subject: 'music', grade: '10', sessionMinutes: 28 });
  const differentLocale = topicCacheKey({
    topic: 'pythagorean theorem',
    subject: 'math',
    grade: '10',
    sessionMinutes: 28,
    locale: 'es',
  });
  assert.notStrictEqual(base, differentGrade, 'different grade band must diverge');
  assert.notStrictEqual(base, differentLength, 'different length bucket must diverge');
  assert.notStrictEqual(base, differentTopic, 'different topic must diverge');
  assert.notStrictEqual(base, differentLocale, 'different locale must diverge');
  assert.notStrictEqual(differentSubject, sameTopicMusicSubject, 'same topic, different subject must diverge');
}

/** Review finding #4: the portal is likely to send band labels directly
 *  ('9-12'), not individual grade numbers. That literal string must map
 *  to the SAME band as a grade number within it, in BOTH
 *  gradeBandForCacheKey (via topicCacheKey) and minutesPerLOForGrade —
 *  the two are meant to be kept in lockstep. */
async function testGradeBandLiteral9To12MatchesNumberedGrades() {
  const viaLiteralBand = topicCacheKey({ topic: 'pythagorean theorem', subject: 'math', grade: '9-12', sessionMinutes: 20 });
  const viaNumberedGrade = topicCacheKey({ topic: 'pythagorean theorem', subject: 'math', grade: '10', sessionMinutes: 20 });
  assert.strictEqual(
    viaLiteralBand,
    viaNumberedGrade,
    `expected grade '9-12' to band-match grade '10', got "${viaLiteralBand}" vs "${viaNumberedGrade}"`,
  );
}

async function testMinutesPerLOForGrade9To12EqualsFive() {
  assert.strictEqual(minutesPerLOForGrade('9-12'), 5, "minutesPerLOForGrade('9-12') should be 5, matching '10'/'11'/'12'");
}

/** Final-review fix (E4 recap unreachable for already-cached plans): the
 *  key format had no version component, so a pre-deploy cached plan (up
 *  to 30 days old — including the incident topic on prod) kept matching
 *  new requests under the OLD key shape and served its recap-less
 *  content straight through E4's fix. Pins that the key now carries a
 *  trailing version segment (CACHE_KEY_VERSION) — any future bump of
 *  that constant is a deliberate, visible cache-busting decision, not a
 *  format change nobody thought to make. */
async function testTopicCacheKeyCarriesVersionSegment() {
  const key = topicCacheKey({ topic: 'pythagorean theorem', subject: 'math', grade: '10', sessionMinutes: 28 });
  assert.strictEqual(
    key,
    `pythagorean theorem|math|9-12|std|en|${CACHE_KEY_VERSION}`,
    `expected key to end with the version segment, got "${key}"`,
  );
  assert.ok(key.endsWith(`|${CACHE_KEY_VERSION}`), 'key must end with the version segment');
}

/** findCachedPlan must return a plan previously upserted with a matching
 *  metadata.cacheKey, parsed through the store's canonical getLessonPlan
 *  path (not a raw Mongo doc). */
async function testFindCachedPlanReturnsUpsertedPlan() {
  const cacheKey = topicCacheKey({ topic: 'gen cache hit test', subject: 'math', grade: '9', sessionMinutes: 20 });
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
  const cacheKey = topicCacheKey({ topic: 'gen cache expiry test', subject: 'math', grade: '9', sessionMinutes: 20 });
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

/** Fabricated base plan for the pure toResponse/generatedPlanMetadata
 *  tests below — no DB, no LLM. */
function fakePlan(over: Partial<LessonPlan> = {}): LessonPlan {
  return {
    id: 'freestyle-fake-1',
    title: 'Fake Plan',
    curriculum: 'freestyle',
    grade: '9-12',
    subject: 'math',
    los: [{ id: 'lo1', description: 'test lo' }],
    estimatedMinutes: 20,
    segments: [{ id: 'seg1', kind: 'hook', goal: 'g' }],
    schemaVersion: 1,
    metadata: {},
    ...over,
  };
}

/** Review finding #2: a picker plan's maxPickableLos in the response MUST
 *  be the plan's OWN stored metadata.allowedMaxLOs (the cap its prose
 *  already told the student about, and that plan-expand/Task 5 will
 *  enforce), not a fresh recompute from the CURRENT request's
 *  sessionMinutes — the 'long' length bucket spans 31-120 min, so
 *  maxLOsForBudget can swing widely within one bucket, and a cache hit
 *  could otherwise report a bigger number than the persisted plan
 *  actually allows. Pure — no DB, no LLM. */
async function testToResponsePickerPlanUsesStoredAllowedMaxLOs() {
  const picker = fakePlan({
    metadata: { pendingPicker: true, allowedMaxLOs: 3, generatorOk: true },
  });
  // sessionMinutes: 120 (top of the 'long' bucket) would recompute a much
  // bigger X than the plan's stored cap of 3 if maxPickableLos ignored
  // metadata.allowedMaxLOs.
  const res = toResponse(picker, { cached: true, sessionMinutes: 120 });
  assert.strictEqual(res.mode, 'picker');
  assert.strictEqual(res.maxPickableLos, 3, `expected the stored allowedMaxLOs (3), got ${res.maxPickableLos}`);
  PlanGenerateResponseSchema.parse(res);
}

/** Non-picker plans carry no stored cap, so maxPickableLos is a fresh,
 *  purely informational compute from the CURRENT request's
 *  sessionMinutes/grade. Pure — no DB, no LLM. */
async function testToResponseFullPlanRecomputesMaxPickableLos() {
  const full = fakePlan({ metadata: { generatorOk: true } });
  const res = toResponse(full, { cached: false, sessionMinutes: 20, generatorOk: true });
  assert.strictEqual(res.mode, 'full');
  assert.ok(res.maxPickableLos > 0, 'expected a positive recomputed maxPickableLos');
  PlanGenerateResponseSchema.parse(res);
}

/** toResponse must clamp maxPickableLos to the contract's max of 12
 *  (`PlanExpandRequestSchema.pickedLoIds` is `.max(12)`) — a stored
 *  allowedMaxLOs above that (e.g. a long-session picker plan) would
 *  otherwise tell the picker UI it can submit a pick that plan-expand
 *  would reject outright with `cap_exceeded`. Pure — no DB, no LLM. */
async function testToResponseClampsMaxPickableLosTo12() {
  const picker = fakePlan({
    metadata: { pendingPicker: true, allowedMaxLOs: 20, generatorOk: true },
  });
  const res = toResponse(picker, { cached: true, sessionMinutes: 20 });
  assert.strictEqual(res.maxPickableLos, 12, `expected maxPickableLos clamped to 12, got ${res.maxPickableLos}`);
  PlanGenerateResponseSchema.parse(res);
}

/** Review finding #1: generatedPlanMetadata must OMIT cacheKey when
 *  generatorOk is false — a fallback skeleton must never become the
 *  cached answer for its topic/band/bucket for the next 30 days. It's
 *  still persisted with everything else (generatedFromText,
 *  portalPartnerId, sessionMinutes) — just not findable via the cache.
 *  Pure — no DB, no LLM. */
async function testGeneratedPlanMetadataOmitsCacheKeyOnFallback() {
  const plan = fakePlan();
  const meta = generatedPlanMetadata(plan, {
    cacheKey: 'should-not-appear|math|9-12|std|en',
    generatorOk: false,
    portalPartnerId: 'portalA',
    sessionMinutes: 20,
  });
  assert.strictEqual(meta.cacheKey, undefined, 'cacheKey must be omitted when generatorOk is false');
  assert.strictEqual(meta.generatorOk, false);
  assert.strictEqual(meta.generatedFromText, true);
  assert.strictEqual(meta.portalPartnerId, 'portalA');
  assert.strictEqual(meta.sessionMinutes, 20);
}

/** ...and MUST include cacheKey when generatorOk is true — the happy path
 *  is what makes the cache useful at all. Pure — no DB, no LLM. */
async function testGeneratedPlanMetadataIncludesCacheKeyOnSuccess() {
  const plan = fakePlan();
  const meta = generatedPlanMetadata(plan, {
    cacheKey: 'pythagorean theorem|math|9-12|std|en',
    generatorOk: true,
    portalPartnerId: 'portalA',
    sessionMinutes: 20,
  });
  assert.strictEqual(meta.cacheKey, 'pythagorean theorem|math|9-12|std|en');
}

/** Task 4, cases 1+2 combined: a real (live Anthropic) generation must
 *  200 with a full-schema-valid PlanGenerateResponse (a "gen-"-prefixed
 *  planId, a mode of 'full' or 'picker') and durably persist the plan
 *  (getLessonPlan resolves it) with metadata.generatedFromText === true
 *  and metadata.cacheKey set (this generation succeeds, so per finding #1
 *  the cacheKey MUST be present — the omit-on-failure path is covered
 *  separately, purely, by testGeneratedPlanMetadataOmitsCacheKeyOnFallback).
 *  A second, identical request must then hit the Task 3 generation cache:
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
    const firstBody = PlanGenerateResponseSchema.parse(first.json);
    planId = firstBody.planId;
    assert.ok(planId.startsWith('gen-'), `planId should start with "gen-", got ${JSON.stringify(planId)}`);
    assert.ok(
      ['full', 'picker'].includes(firstBody.mode),
      `mode should be 'full' or 'picker', got ${JSON.stringify(firstBody.mode)}`,
    );
    assert.strictEqual(firstBody.cached, false, 'first request should not be a cache hit');

    const stored = await getLessonPlan(planId);
    assert.ok(stored, 'generated plan should be durably persisted');
    assert.strictEqual(stored?.metadata?.generatedFromText, true, 'metadata.generatedFromText should be true');
    assert.ok(stored?.metadata?.cacheKey, 'metadata.cacheKey should be set (generatorOk true on this path)');

    // E4: a 'full' mode plan (Y <= X, expanded inline — no picker
    // round-trip needed) must end with a deterministic recap segment.
    // 'picker' mode plans don't get one yet — they're unexpanded until
    // plan-expand runs, which is covered by
    // testPlanExpandCloneLeavesOriginalCacheUntouched below.
    if (firstBody.mode === 'full') {
      const storedSegments = stored?.segments ?? [];
      assert.ok(storedSegments.length > 0, 'expected the full plan to have segments');
      assert.strictEqual(
        storedSegments[storedSegments.length - 1]?.kind,
        'recap',
        `expected the last segment of a 'full' mode plan to be a recap, got "${storedSegments[storedSegments.length - 1]?.kind}"`,
      );
    }

    // Case 2: identical request → cache hit, same planId, no live regeneration.
    const second = await callPlanGenerate(
      planGeneratePOST,
      signedPlanGenerateRequest('POST', '/api/portal/v1/plan-generate', body),
    );
    assert.strictEqual(second.status, 200, `expected 200, got ${second.status}: ${JSON.stringify(second.json)}`);
    const secondBody = PlanGenerateResponseSchema.parse(second.json);
    assert.strictEqual(secondBody.cached, true, 'repeat request should be a cache hit');
    assert.strictEqual(secondBody.planId, planId, 'cache hit should return the same planId');
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

/** Task 3 (Phase-2 doc ingestion), happy path: a request carrying a
 *  `materials` attachment (the Task-2 DOCX fixture, small so this stays
 *  fast) must run `extractMaterials()` first, generate off the extracted
 *  `combinedText`, and SKIP the topic cache entirely — no `cacheKey`
 *  ends up in the persisted metadata, and `sourceKind`/`materialsMeta`
 *  are stamped instead. A 'full' mode plan must still end in a recap
 *  segment (shared generation path with the text-only case). A SECOND,
 *  IDENTICAL request must NOT hit a cache — it mints a brand-new planId
 *  (the only way to prove the cache truly was skipped is to observe two
 *  distinct live generations landing on two distinct ids), so this test
 *  makes two live Anthropic calls; the fixture is a two-sentence DOCX to
 *  keep both cheap. */
async function testPlanGenerateMaterialsHappyPathSkipsCache() {
  const body = {
    text: 'Review my attached notes',
    subject: 'science',
    grade: '9-12',
    sessionMinutes: 20,
    materials: [loadFixtureAsMaterial('sample.docx', 'docx')],
  };
  let planIdA: string | undefined;
  let planIdB: string | undefined;
  try {
    const first = await callPlanGenerate(
      planGeneratePOST,
      signedPlanGenerateRequest('POST', '/api/portal/v1/plan-generate', body),
    );
    assert.strictEqual(first.status, 200, `expected 200, got ${first.status}: ${JSON.stringify(first.json)}`);
    const firstBody = PlanGenerateResponseSchema.parse(first.json);
    planIdA = firstBody.planId;
    assert.ok(planIdA.startsWith('gen-'), `planId should start with "gen-", got ${JSON.stringify(planIdA)}`);
    assert.strictEqual(firstBody.cached, false, 'materials-derived plan must never be reported as a cache hit');

    const stored = await getLessonPlan(planIdA);
    assert.ok(stored, 'materials-derived plan should be durably persisted');
    assert.strictEqual(stored?.metadata?.sourceKind, 'materials', 'expected metadata.sourceKind === "materials"');
    assert.strictEqual(stored?.metadata?.cacheKey, undefined, 'materials-derived plan must NOT carry a cacheKey');
    const materialsMeta = stored?.metadata?.materialsMeta as
      | { count: number; kinds: string[]; totalChars: number }
      | undefined;
    assert.ok(materialsMeta, 'expected metadata.materialsMeta to be set');
    assert.strictEqual(materialsMeta?.count, 1, 'expected materialsMeta.count === 1');
    assert.deepStrictEqual(materialsMeta?.kinds, ['docx'], 'expected materialsMeta.kinds === ["docx"]');
    assert.ok(materialsMeta && materialsMeta.totalChars > 0, 'expected materialsMeta.totalChars > 0');

    if (firstBody.mode === 'full') {
      const storedSegments = stored?.segments ?? [];
      assert.ok(storedSegments.length > 0, 'expected the full plan to have segments');
      assert.strictEqual(
        storedSegments[storedSegments.length - 1]?.kind,
        'recap',
        `expected the last segment of a 'full' mode materials plan to be a recap, got "${storedSegments[storedSegments.length - 1]?.kind}"`,
      );
    }

    // Second, identical request: cache must be skipped entirely — a
    // fresh live generation, landing on a DIFFERENT planId.
    const second = await callPlanGenerate(
      planGeneratePOST,
      signedPlanGenerateRequest('POST', '/api/portal/v1/plan-generate', body),
    );
    assert.strictEqual(second.status, 200, `expected 200, got ${second.status}: ${JSON.stringify(second.json)}`);
    const secondBody = PlanGenerateResponseSchema.parse(second.json);
    planIdB = secondBody.planId;
    assert.strictEqual(secondBody.cached, false, 'second materials request must not be a cache hit either');
    assert.notStrictEqual(planIdB, planIdA, 'identical materials request must mint a DIFFERENT planId (cache provably skipped)');
  } finally {
    if (planIdA) await deleteLessonPlan(planIdA);
    if (planIdB) await deleteLessonPlan(planIdB);
  }
}

/** Task 3, error case: a scanned (no text layer) PDF material must be
 *  rejected with 422 and `error: 'scanned_pdf'` — a user-fixable input
 *  problem, not a 502 generation failure. No LLM call is reached (the
 *  extraction failure short-circuits before Stage 1). */
async function testPlanGenerateMaterialsScannedPdfReturns422() {
  const body = {
    text: 'Review my scanned notes',
    subject: 'science',
    grade: '9-12',
    materials: [loadFixtureAsMaterial('scanned-no-text.pdf', 'pdf')],
  };
  const { status, json } = await callPlanGenerate(
    planGeneratePOST,
    signedPlanGenerateRequest('POST', '/api/portal/v1/plan-generate', body),
  );
  assert.strictEqual(status, 422, `expected 422 for a scanned PDF, got ${status}: ${JSON.stringify(json)}`);
  assert.strictEqual(json.error, 'scanned_pdf', `expected error 'scanned_pdf', got ${JSON.stringify(json.error)}`);
}

/** Task 3, error case: an oversized material must be rejected with 422
 *  and `error: 'too_large'` before any LLM call — extractMaterials()
 *  enforces the decoded-size limit synchronously. Synthetic buffer, no
 *  fixture file needed.
 *
 *  Sized at 7.5MB decoded (base64 ≈10,000,000 chars): strictly ABOVE
 *  material-extract's MAX_DECODED_BYTES (7MB — see that module's comment
 *  for why 7MB, not the rounder 8MB, is the real enforceable ceiling)
 *  and strictly BELOW the contract's own `data` field cap
 *  (`PlanMaterialSchema.data`, 11,000,000 base64 chars). A larger buffer
 *  would round-trip through base64 to MORE than 11,000,000 chars and get
 *  rejected one layer up by `PlanGenerateRequestSchema` itself (400
 *  invalid_request) before ever reaching extractMaterials — this size is
 *  the one place that actually exercises extractMaterials' own
 *  too_large branch end-to-end through the route. */
async function testPlanGenerateMaterialsOversizedReturns422() {
  const oversized = Buffer.alloc(7_500_000, 'a');
  const body = {
    text: 'Review my attached notes',
    subject: 'science',
    grade: '9-12',
    materials: [{ kind: 'text', data: oversized.toString('base64') }],
  };
  const { status, json } = await callPlanGenerate(
    planGeneratePOST,
    signedPlanGenerateRequest('POST', '/api/portal/v1/plan-generate', body),
  );
  assert.strictEqual(status, 422, `expected 422 for an oversized material, got ${status}: ${JSON.stringify(json)}`);
  assert.strictEqual(json.error, 'too_large', `expected error 'too_large', got ${JSON.stringify(json.error)}`);
}

/** Deterministically builds and upserts a picker-mode plan for the
 *  plan-expand tests below — no LLM call. Mirrors the shape
 *  plan-generate (Task 4) produces via `buildPickerPlan` when Y > X, but
 *  built directly so setup is fast and doesn't depend on a live Stage 1
 *  extraction landing on a specific LO count. */
async function upsertTestPickerPlan(
  id: string,
  allowedMaxLOs: number,
  extraMetadata: Record<string, unknown> = {},
): Promise<LessonPlan> {
  const los = [
    { id: 'lo-a', description: 'First test learning objective' },
    { id: 'lo-b', description: 'Second test learning objective' },
    { id: 'lo-c', description: 'Third test learning objective' },
  ];
  const built = buildPickerPlan({
    input: { text: 'test picker source text', subject: 'math', grade: '9-12', locale: 'en' },
    titleSuggestion: 'Test Picker Plan',
    los,
    allowedMaxLOs,
    sessionMinutes: 20,
  });
  return upsertLessonPlan({ ...built, id, metadata: { ...built.metadata, ...extraMetadata } });
}

async function callPlanExpand(req: NextRequest) {
  const res = await planExpandPOST(req, undefined);
  return { status: res.status, json: await res.json() };
}

function signedPlanExpandRequest(bodyObj?: unknown): NextRequest {
  return signedPlanGenerateRequest('POST', '/api/portal/v1/plan-expand', bodyObj);
}

/** Task 5 + clone-on-expand fix, happy path: a picker plan built
 *  deterministically (no LLM) — seeded with a cacheKey, as a real
 *  plan-generate picker plan would carry — expanded via a live LLM call
 *  for a small 2-LO pick. This is the ONE live LLM call this suite makes
 *  for plan-expand; both the base expand behavior and the clone-on-expand
 *  fix are asserted off this single call rather than duplicating it.
 *
 *  Must 200 with a schema-valid PlanExpandResponse whose planId is a
 *  BRAND-NEW "gen-" id, distinct from the request's planId (the portal
 *  route writes via `writeMode: 'clone'` — see expand.ts's module doc).
 *  The clone must carry the expanded hook/concept/worked/try segments and
 *  drop cacheKey/pendingPicker entirely. The ORIGINAL picker plan at the
 *  request's planId must be completely untouched: still pendingPicker
 *  true, still its full 3-LO list, still its cacheKey — and
 *  findCachedPlan(cacheKey) must still resolve to that original plan
 *  (cache-immunity), not the clone. This is the regression test for the
 *  cache-poisoning bug: expanding used to rewrite the cached picker plan
 *  in place, so the next student hitting the same cache key would get the
 *  first student's narrowed pick served as mode:'full'. */
async function testPlanExpandCloneLeavesOriginalCacheUntouched() {
  const planId = 'gen-test-plan-expand-success-1';
  const cacheKey = topicCacheKey({
    topic: 'plan expand clone test topic',
    subject: 'math',
    grade: '9-12',
    sessionMinutes: 20,
  });
  await upsertTestPickerPlan(planId, 2, { cacheKey });
  let newPlanId: string | undefined;
  try {
    const { status, json } = await callPlanExpand(
      signedPlanExpandRequest({ planId, pickedLoIds: ['lo-a', 'lo-b'] }),
    );
    assert.strictEqual(status, 200, `expected 200, got ${status}: ${JSON.stringify(json)}`);
    const body = PlanExpandResponseSchema.parse(json);
    newPlanId = body.planId;
    assert.notStrictEqual(newPlanId, planId, 'expand must NOT write back to the request planId (clone-on-expand)');
    assert.ok(newPlanId.startsWith('gen-'), `expected the new planId to start with "gen-", got ${JSON.stringify(newPlanId)}`);
    assert.ok(body.expandedCount >= 1, `expected expandedCount >= 1, got ${body.expandedCount}`);
    assert.strictEqual(body.pendingExpansion, false, 'a full (non-priority) expand must not leave anything pending');

    // (c) the NEW plan: expanded segments, no cacheKey, no pendingPicker.
    const cloned = await getLessonPlan(newPlanId);
    assert.ok(cloned, 'expanded plan should be stored under the new id');
    assert.strictEqual(cloned?.metadata?.cacheKey, undefined, 'clone must NOT carry cacheKey');
    assert.strictEqual(cloned?.metadata?.pendingPicker, undefined, 'clone must NOT carry pendingPicker');
    const kinds = new Set((cloned?.segments ?? []).map((s) => s.kind));
    const expectedKinds = ['hook', 'concept', 'worked_example', 'try_yourself'] as const;
    for (const expectedKind of expectedKinds) {
      assert.ok(kinds.has(expectedKind), `expected a "${expectedKind}" segment among [${[...kinds].join(',')}]`);
    }

    // E4: a full (non-priority) expand must end with a deterministic
    // recap segment, and resolving `advance_lesson({ to: 'next' })` off
    // the last try_yourself segment must land on it — this is the fix
    // for the dangling-session bug (advance off the last -try segment
    // used to resolve to null because nothing followed it).
    const clonedSegments = cloned?.segments ?? [];
    assert.ok(clonedSegments.length > 0, 'expected the cloned plan to have segments');
    assert.strictEqual(
      clonedSegments[clonedSegments.length - 1]?.kind,
      'recap',
      `expected the last segment to be a recap, got "${clonedSegments[clonedSegments.length - 1]?.kind}"`,
    );
    const lastTry = [...clonedSegments].reverse().find((s) => s.kind === 'try_yourself');
    assert.ok(lastTry, 'expected at least one try_yourself segment in the cloned plan');
    const resolved = resolveAdvanceTarget(cloned as LessonPlan, lastTry!.id, 'next');
    assert.strictEqual(
      resolved,
      clonedSegments[clonedSegments.length - 1]?.id,
      `expected advance('next') off the last try segment to resolve to the recap segment, got "${resolved}"`,
    );

    // (b) the ORIGINAL picker plan: untouched — still pendingPicker true,
    // still its full LO list, still its cacheKey.
    const original = await getLessonPlan(planId);
    assert.ok(original, 'original picker plan should still exist under its original id');
    assert.strictEqual(original?.metadata?.pendingPicker, true, 'original picker plan must remain pendingPicker:true');
    assert.strictEqual(original?.metadata?.cacheKey, cacheKey, 'original picker plan must keep its cacheKey');
    assert.deepStrictEqual(
      (original?.los ?? []).map((lo) => lo.id).sort(),
      ['lo-a', 'lo-b', 'lo-c'],
      'original picker plan must keep its full (unpicked) LO list',
    );

    // Cache-immunity: findCachedPlan(cacheKey) must still resolve to the
    // ORIGINAL plan, id unchanged — not the clone, and not mutated.
    const cachedLookup = await findCachedPlan(cacheKey);
    assert.ok(cachedLookup, 'expected the cache key to still resolve to a plan');
    assert.strictEqual(cachedLookup?.id, planId, 'cache lookup must still resolve to the ORIGINAL picker plan');
    assert.strictEqual(cachedLookup?.metadata?.pendingPicker, true, 'cache-served plan must still be the untouched picker plan');
  } finally {
    await deleteLessonPlan(planId);
    if (newPlanId) await deleteLessonPlan(newPlanId);
  }
}

/** Task 5, error case: an unknown planId must 404 without attempting any
 *  expansion. Pure — no LLM call reached. */
async function testPlanExpandUnknownPlanIdReturns404() {
  const { status } = await callPlanExpand(
    signedPlanExpandRequest({ planId: 'gen-does-not-exist-plan-expand', pickedLoIds: ['lo-a'] }),
  );
  assert.strictEqual(status, 404, `expected 404 for unknown planId, got ${status}`);
}

/** Task 5, error case: pickedLoIds that don't match any LO in the plan
 *  must 400 rather than silently no-op or attempt an LLM call. */
async function testPlanExpandPickedIdsNotInPlanReturns400() {
  const planId = 'gen-test-plan-expand-bad-ids-1';
  await upsertTestPickerPlan(planId, 2);
  try {
    const { status } = await callPlanExpand(
      signedPlanExpandRequest({ planId, pickedLoIds: ['bogus-lo-1', 'bogus-lo-2'] }),
    );
    assert.strictEqual(status, 400, `expected 400 for unmatched pickedLoIds, got ${status}`);
  } finally {
    await deleteLessonPlan(planId);
  }
}

/** Task 5: the endpoint must enforce the plan's OWN stored
 *  metadata.allowedMaxLOs cap — a pick exceeding it is REJECTED (400),
 *  unlike the dev route's silent-truncate behaviour. This is what
 *  plan-generate's cache-hit path (Task 4, finding #2) relies on being
 *  enforced server-side. Pure — no LLM call reached (the cap check runs
 *  before expandSegmentsForLOs). */
async function testPlanExpandExceedsStoredCapReturns400() {
  const planId = 'gen-test-plan-expand-cap-1';
  await upsertTestPickerPlan(planId, 2);
  try {
    const { status } = await callPlanExpand(
      signedPlanExpandRequest({ planId, pickedLoIds: ['lo-a', 'lo-b', 'lo-c'] }),
    );
    assert.strictEqual(status, 400, `expected 400 for a pick exceeding allowedMaxLOs, got ${status}`);
  } finally {
    await deleteLessonPlan(planId);
  }
}

/** Task 5: an invalid body (missing pickedLoIds) must 400 via
 *  PlanExpandRequestSchema before touching the store. */
async function testPlanExpandInvalidBodyReturns400() {
  const { status } = await callPlanExpand(signedPlanExpandRequest({ planId: 'whatever' }));
  assert.strictEqual(status, 400, `expected 400 for a body missing pickedLoIds, got ${status}`);
}

/** E5: the stage-2 prompt must carry a hard authoring rule against
 *  number collisions (a context/setup number equal to the problem's
 *  expected answer) for hook/worked_example/try_yourself, and must cover
 *  the 'answer' / 'expectedAnswer' fields the prompt itself asks for.
 *  Content-quality of generated problems can't be cheaply unit-tested —
 *  this only asserts the rule text is present in the system prompt.
 *  Pure — no DB, no LLM. */
async function testStage2SystemPromptHasNumberCollisionRule() {
  assert.match(
    STAGE2_SYSTEM,
    /MUST/,
    'expected the number-collision rule to be phrased as a MUST',
  );
  assert.ok(
    /number[\s\S]*collision|collision[\s\S]*number/.test(STAGE2_SYSTEM.toLowerCase()),
    'expected a number-collision rule in STAGE2_SYSTEM',
  );
  assert.ok(
    STAGE2_SYSTEM.includes('expectedAnswer') && STAGE2_SYSTEM.includes("'answer'"),
    'expected the rule to reference both the worked_example answer field and the try_yourself expectedAnswer field',
  );
}

async function main() {
  console.log('\nRuntime lesson generation — engine store:\n');

  await test('generated plans hidden from listings by default, visible with includeGenerated', testGeneratedPlansHiddenFromListings);
  await test('topicCacheKey collides for same grade band + length bucket after normalization', testTopicCacheKeySameBandAndBucketCollide);
  await test(
    'topicCacheKey diverges for different grade band / length bucket / topic / subject / locale',
    testTopicCacheKeyDifferentInputsDiverge,
  );
  await test('findCachedPlan returns a previously upserted plan by cacheKey', testFindCachedPlanReturnsUpsertedPlan);
  await test('findCachedPlan returns null for an expired createdAt', testFindCachedPlanReturnsNullForExpired);

  console.log("\nFix review — grade band '9-12' literal (finding #4):\n");
  await test("topicCacheKey: grade '9-12' band-matches grade '10'", testGradeBandLiteral9To12MatchesNumberedGrades);
  await test("minutesPerLOForGrade('9-12') === 5", testMinutesPerLOForGrade9To12EqualsFive);
  await test('topicCacheKey carries the CACHE_KEY_VERSION segment (E4 recap cache-bust)', testTopicCacheKeyCarriesVersionSegment);

  console.log('\nFix review — toResponse / generatedPlanMetadata (findings #1, #2, #6a) — pure:\n');
  await test('toResponse: picker plan uses its own stored allowedMaxLOs, not a fresh recompute', testToResponsePickerPlanUsesStoredAllowedMaxLOs);
  await test('toResponse: full plan recomputes maxPickableLos from the current request', testToResponseFullPlanRecomputesMaxPickableLos);
  await test('toResponse: maxPickableLos is clamped to the contract max of 12', testToResponseClampsMaxPickableLosTo12);
  await test('generatedPlanMetadata: omits cacheKey when generatorOk is false', testGeneratedPlanMetadataOmitsCacheKeyOnFallback);
  await test('generatedPlanMetadata: includes cacheKey when generatorOk is true', testGeneratedPlanMetadataIncludesCacheKeyOnSuccess);

  console.log('\ngenplan-live-fixes E5 — stage-2 prompt number-collision rule — pure:\n');
  await test('STAGE2_SYSTEM carries a MUST-phrased number-collision rule covering answer/expectedAnswer', testStage2SystemPromptHasNumberCollisionRule);

  console.log('\nPOST /api/portal/v1/plan-generate (Task 4):\n');
  await test(
    'valid request → 200, schema-valid gen- planId, mode full|picker, durably persisted, full-mode ends in recap (E4); repeat request → cache hit',
    testPlanGenerateRealGenerationThenCacheHit,
  );
  await test('missing subject → 400', testPlanGenerateMissingSubjectReturns400);

  console.log('\nPOST /api/portal/v1/plan-generate — materials (Task 3, Phase-2 doc ingestion):\n');
  await test(
    'materials request → 200, sourceKind:"materials", no cacheKey, full-mode ends in recap; identical repeat → different planId (cache skipped)',
    testPlanGenerateMaterialsHappyPathSkipsCache,
  );
  await test('scanned-PDF material → 422 scanned_pdf', testPlanGenerateMaterialsScannedPdfReturns422);
  await test('oversized material → 422 too_large (no LLM call)', testPlanGenerateMaterialsOversizedReturns422);

  console.log('\nPOST /api/portal/v1/plan-expand (Task 5) + clone-on-expand fix:\n');
  await test(
    'valid pick on a cache-keyed picker plan → 200, new "gen-" planId, expanded clone ending in recap whose advance("next") resolves from the last try segment (E4); ORIGINAL cached picker plan untouched (clone-on-expand)',
    testPlanExpandCloneLeavesOriginalCacheUntouched,
  );
  await test('unknown planId → 404', testPlanExpandUnknownPlanIdReturns404);
  await test('pickedLoIds not in the plan → 400', testPlanExpandPickedIdsNotInPlanReturns400);
  await test('pick exceeding the plan\'s stored allowedMaxLOs → 400', testPlanExpandExceedsStoredCapReturns400);
  await test('invalid body (missing pickedLoIds) → 400', testPlanExpandInvalidBodyReturns400);

  console.log(`\n${passed} passed, ${failed} failed\n`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('Fatal error running test-plan-generate:', err);
  process.exit(1);
});
