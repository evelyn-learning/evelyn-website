/**
 * Phase 4 — portal endpoint integration tests (auth + contract conformance +
 * idempotency + Rule-0 notes-render characterization).
 *
 * Run: `npm run test:portal-endpoints`
 *
 * No DB / no network: the store uses its in-memory ephemeral fallback, and we
 * avoid the grade 200 path (which calls a model). Route handlers are invoked
 * directly with signed Requests.
 */

import assert from 'node:assert';

process.env.PORTAL_PARTNER_SECRETS = JSON.stringify({ portalA: 'secret-a' });

import { signPortalRequest } from '@evelyn/portal-contract/auth';
import {
  StudentContextSchema,
  GapsReadSchema,
  MasteryReadSchema,
  NotesReadSchema,
  RetrievePracticeResponseSchema,
  SessionResultSchema,
} from '@evelyn/portal-contract/v1';
import { getOrCreateStudentProfile } from '@/lib/tutor/student-profile/store';
import type { NextRequest } from 'next/server';

import { POST as contextPOST } from '@/app/api/portal/v1/context/route';
import { GET as notesGET } from '@/app/api/portal/v1/notes/route';
import { GET as gapsGET } from '@/app/api/portal/v1/gaps/route';
import { GET as masteryGET } from '@/app/api/portal/v1/mastery/route';
import { POST as practicePOST } from '@/app/api/portal/v1/practice/route';
import { POST as gradePOST } from '@/app/api/portal/v1/grade/route';
import { POST as sessionPOST } from '@/app/api/portal/v1/session-result/route';

const SECRET = 'secret-a';
const PARTNER = 'portalA';

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

function signed(method: string, pathWithQuery: string, bodyObj?: unknown): NextRequest {
  const body = bodyObj === undefined ? '' : JSON.stringify(bodyObj);
  const timestamp = String(Date.now());
  const sig = signPortalRequest(SECRET, { method, path: pathWithQuery, timestamp, body });
  const headers: Record<string, string> = {
    'x-evelyn-partner': PARTNER,
    'x-evelyn-timestamp': timestamp,
    'x-evelyn-signature': sig,
  };
  const init: RequestInit = { method, headers };
  if (method !== 'GET' && body) init.body = body;
  return new Request(`https://engine.test${pathWithQuery}`, init) as unknown as NextRequest;
}
function unsigned(method: string, pathWithQuery: string): NextRequest {
  return new Request(`https://engine.test${pathWithQuery}`, { method }) as unknown as NextRequest;
}
async function call(h: (r: NextRequest, c: unknown) => Promise<Response>, req: NextRequest) {
  const res = await h(req, undefined);
  return { status: res.status, json: await res.json() };
}

const ctxBody = (studentId: string) => ({
  studentId,
  isTrial: false,
  courseId: 'ap-statistics',
  profile: { name: 'Sam', grade: '12' },
  preferences: { humorCeiling: 'light', interests: ['spider-man'], socialMemoryLevel: 'warm' },
  socialMemory: [{ id: 't1', note: 'new Spider-Man Sat', kind: 'event', capturedAt: '2026-06-20T00:00:00.000Z' }],
  target: { kind: 'lessonNode', lessonNodeId: 'evelyn.ap.stats.normal-distribution.v1' },
  sessionConfig: { voiceEngine: 'claude-brain' },
});

(async () => {
  console.log('\nPhase 4 — auth enforcement:\n');
  await test('context POST without signature → 401', async () => {
    const { status } = await call(contextPOST, unsigned('POST', '/api/portal/v1/context'));
    assert.strictEqual(status, 401);
  });
  await test('gaps GET without signature → 401', async () => {
    const { status } = await call(gapsGET, unsigned('GET', '/api/portal/v1/gaps?studentId=x'));
    assert.strictEqual(status, 401);
  });

  console.log('\nContext ingest:\n');
  await test('valid StudentContext → 200, interests persisted, socialMemory transient', async () => {
    const sid = 'portalA:ctx-1';
    // sanity: the body is a valid StudentContext
    assert.ok(StudentContextSchema.safeParse(ctxBody(sid)).success);
    const { status, json } = await call(contextPOST, signed('POST', '/api/portal/v1/context', ctxBody(sid)));
    assert.strictEqual(status, 200);
    assert.strictEqual(json.ok, true);
    assert.deepStrictEqual(json.transient.socialMemory.length, 1);
    const profile = await getOrCreateStudentProfile(sid);
    assert.deepStrictEqual(profile.preferences.interests, ['spider-man']);
    assert.strictEqual(profile.preferences.socialMemoryLevel, 'warm');
    assert.strictEqual(profile.preferences.humorCeiling, 'light');
  });
  await test('malformed context → 400', async () => {
    const { status } = await call(contextPOST, signed('POST', '/api/portal/v1/context', { studentId: 'x' }));
    assert.strictEqual(status, 400);
  });

  console.log('\nReads (gaps / mastery / notes):\n');
  await test('gaps GET → 200, GapsRead-valid (empty)', async () => {
    const { status, json } = await call(gapsGET, signed('GET', '/api/portal/v1/gaps?studentId=portalA:reader'));
    assert.strictEqual(status, 200);
    assert.ok(GapsReadSchema.safeParse(json).success);
  });
  await test('mastery GET → 200, MasteryRead-valid', async () => {
    const { status, json } = await call(masteryGET, signed('GET', '/api/portal/v1/mastery?studentId=portalA:reader&courseId=ap-statistics'));
    assert.strictEqual(status, 200);
    assert.ok(MasteryReadSchema.safeParse(json).success);
  });
  await test('notes GET unknown baseline → 404', async () => {
    const { status } = await call(notesGET, signed('GET', '/api/portal/v1/notes?studentId=portalA:reader&baselineId=does.not.exist'));
    assert.strictEqual(status, 404);
  });
  await test('notes GET real baseline → 200, NotesRead-valid (Rule-0 render passthrough)', async () => {
    const path = '/api/portal/v1/notes?studentId=portalA:reader&baselineId=evelyn.ap.macro.loanable-funds-market.v1';
    const { status, json } = await call(notesGET, signed('GET', path));
    assert.strictEqual(status, 200);
    assert.ok(NotesReadSchema.safeParse(json).success, 'notes must conform to NotesRead');
    // Render passthrough: no student overlays for a fresh student.
    assert.strictEqual(json.methods.overlays.length, 0);
    assert.strictEqual(json.theory.studentAdds.length, 0);
    assert.ok(json.theory.perLO.length > 0, 'baseline theory should be present');
  });

  console.log('\nPractice retrieval:\n');
  await test('practice POST loId scope → 200, response-valid, items tagged with the LO', async () => {
    const body = { studentId: 'portalA:reader', courseId: 'ap-statistics', scope: { loId: 'apstats.normal-distribution' }, count: 5 };
    const { status, json } = await call(practicePOST, signed('POST', '/api/portal/v1/practice', body));
    assert.strictEqual(status, 200);
    assert.ok(RetrievePracticeResponseSchema.safeParse(json).success);
    assert.ok(json.items.length > 0, 'curated plan try-yourselves should be returned');
    assert.ok(json.items.every((i: { loId?: string }) => i.loId === 'apstats.normal-distribution'));
  });

  console.log('\nGrading (auth + error paths only — 200 path calls a model):\n');
  await test('grade POST malformed → 400', async () => {
    const { status } = await call(gradePOST, signed('POST', '/api/portal/v1/grade', { itemId: 'x' }));
    assert.strictEqual(status, 400);
  });
  await test('grade POST unknown itemId → 404', async () => {
    const body = { studentId: 'portalA:reader', itemId: 'no-such-item', response: { text: 'a' } };
    const { status } = await call(gradePOST, signed('POST', '/api/portal/v1/grade', body));
    assert.strictEqual(status, 404);
  });

  console.log('\nSession-result emitter:\n');
  const emitBody = (over: Record<string, unknown> = {}) => ({
    sessionId: 'sr-1',
    studentId: 'portalA:emit',
    courseId: 'ap-statistics',
    status: 'completed',
    milestone: 'recap_reached',
    losTouched: ['apstats.normal-distribution'],
    masteryDeltas: [{ loId: 'apstats.normal-distribution', delta: 0.3 }],
    gaps: [{ kind: 'lo', loId: 'apstats.normal-distribution', observation: 'z-score confusion', studentQuotes: [], signals: ['MISCONCEPTION_DETECTED'] }],
    notesTouched: [],
    renderedArtifacts: { quizzes: [{ items: [{ id: 'q1', question: 'pick', format: 'mcq' }] }], conceptMaps: [] },
    ...over,
  });
  await test('completed emit → 200, SessionResult-valid, 1 new gap, artifacts echoed', async () => {
    const { status, json } = await call(sessionPOST, signed('POST', '/api/portal/v1/session-result', emitBody()));
    assert.strictEqual(status, 200);
    assert.ok(SessionResultSchema.safeParse(json).success, 'must conform to SessionResult');
    assert.strictEqual(json.learningStateDelta.gaps.new.length, 1);
    assert.strictEqual(json.renderedArtifacts.quizzes.length, 1);
  });
  await test('re-emit same sessionId → idempotent (no new deltas)', async () => {
    const { status, json } = await call(sessionPOST, signed('POST', '/api/portal/v1/session-result', emitBody()));
    assert.strictEqual(status, 200);
    assert.strictEqual(json.learningStateDelta.gaps.new.length, 0);
  });
  await test('checkpoint (in_progress) → 200, snapshot, no new gaps', async () => {
    const { status, json } = await call(
      sessionPOST,
      signed('POST', '/api/portal/v1/session-result', emitBody({ sessionId: 'sr-cp', studentId: 'portalA:cp', status: 'in_progress' })),
    );
    assert.strictEqual(status, 200);
    assert.strictEqual(json.status, 'in_progress');
    assert.strictEqual(json.learningStateDelta.gaps.new.length, 0);
  });

  console.log(`\n${passed} passed, ${failed} failed\n`);
  if (failed > 0) process.exit(1);
})();
