/**
 * Diagnostic / assessment mode tests (v1.1.0).
 *
 * Run: `npm run test:portal-assessment`
 *
 * Unit (network-free): build set strips answers; grading → low-exposure
 * mastery + CANDIDATE gaps; idempotency. Endpoint: auth + contract
 * conformance (the submit 200 path can call a model, so only auth/validation
 * are exercised there — grading logic is covered by the unit tests).
 */

import assert from 'node:assert';

process.env.PORTAL_PARTNER_SECRETS = JSON.stringify({ portalA: 'secret-a' });

import { signPortalRequest } from '@evelyn/portal-contract/auth';
import {
  StudentContextSchema,
  AssessmentSetSchema,
  SessionResultSchema,
} from '@evelyn/portal-contract/v1';
import {
  buildAssessment,
  submitAssessment,
  type AssessmentItemResolver,
} from '@/lib/tutor/portal/assessment';
import type { PracticeSources, PlanLite, BankLite } from '@/lib/tutor/portal/practice';
import type { GradeDeps } from '@/lib/tutor/portal/grade-free-response';
import type { ResolvedAssessmentKey } from '@/lib/tutor/portal/adapters';
import type { NextRequest } from 'next/server';

import { resolveAssessmentItem } from '@/lib/tutor/portal/adapters';
import { POST as assessmentPOST } from '@/app/api/portal/v1/assessment/route';
import { POST as submitPOST } from '@/app/api/portal/v1/assessment/submit/route';

let passed = 0;
let failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
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

// --- Fixtures -------------------------------------------------------------

const LO_A = 'apstats.lo-a';
const LO_B = 'apstats.lo-b';

const planA: PlanLite = {
  los: [{ id: LO_A, standard: 'AP-STATS-1.1' }],
  segments: [
    { kind: 'try_yourself', id: 'a1', problem: 'Compute', responseFormat: 'numeric', expectedAnswer: '5' },
    {
      kind: 'try_yourself',
      id: 'a2',
      problem: 'Pick',
      responseFormat: 'mcq',
      choices: [{ id: 'A', text: 'right', correct: true }, { id: 'B', text: 'wrong' }],
    },
  ],
};
const bankA: BankLite = { id: 'bank-a1', problemText: 'bank q', answer: '5', responseFormat: 'numeric', difficulty: 2, loId: LO_A };

class FakeSources implements PracticeSources {
  constructor(private plans: PlanLite[], private bank: BankLite[]) {}
  async plansForLoId(loId: string) {
    return this.plans.filter((p) => p.los.some((l) => l.id === loId));
  }
  async plansForTopic() {
    return this.plans;
  }
  async bankForLoId(loId: string) {
    return this.bank.filter((b) => b.loId === loId);
  }
  async bankForTopic() {
    return this.bank;
  }
}

// Deterministic resolver + judge (judge unused for numeric/mcq paths).
const KEYS: Record<string, ResolvedAssessmentKey> = {
  a1: { responseFormat: 'numeric', expectedAnswer: '5' },
  a2: { responseFormat: 'mcq', expectedAnswer: 'A', correctChoiceId: 'A', choices: [{ id: 'A', text: 'right' }, { id: 'B', text: 'wrong' }] },
  b1: { responseFormat: 'numeric', expectedAnswer: '5' },
  b2: { responseFormat: 'numeric', expectedAnswer: '5' },
};
const fakeResolver: AssessmentItemResolver = async (id) => KEYS[id] ?? null;
const fakeDeps: GradeDeps = {
  async gradeRubricPart() {
    return { pointsAwarded: 0, feedback: '' };
  },
  async judgeSingleAnswer() {
    return { correct: false, feedback: 'fake (should not be called for numeric/mcq)' };
  },
};

// --- Signed-request helpers (endpoint tests) ------------------------------

function signed(method: string, path: string, bodyObj?: unknown): NextRequest {
  const body = bodyObj === undefined ? '' : JSON.stringify(bodyObj);
  const timestamp = String(Date.now());
  const sig = signPortalRequest('secret-a', { method, path, timestamp, body });
  const headers: Record<string, string> = {
    'x-evelyn-partner': 'portalA',
    'x-evelyn-timestamp': timestamp,
    'x-evelyn-signature': sig,
  };
  const init: RequestInit = { method, headers };
  if (method !== 'GET' && body) init.body = body;
  return new Request(`https://engine.test${path}`, init) as unknown as NextRequest;
}
async function call(h: (r: NextRequest, c: unknown) => Promise<Response>, req: NextRequest) {
  const res = await h(req, undefined);
  return { status: res.status, json: await res.json() };
}

// ---------------------------------------------------------------------------
(async () => {
  console.log('\nDiagnostic mode — contract + buildAssessment:\n');

  await test('StudentContext accepts the diagnostic target kind', () => {
    const ok = StudentContextSchema.safeParse({
      studentId: 's', isTrial: true, courseId: 'ap-statistics',
      profile: { name: 'Sam', grade: '12' }, preferences: {},
      target: { kind: 'diagnostic', loIds: [LO_A, LO_B] },
      sessionConfig: { voiceEngine: 'claude-brain' },
    });
    assert.ok(ok.success);
  });

  await test('buildAssessment — items answer-stripped, ≤ maxPerLo per LO, schema-valid', async () => {
    const set = await buildAssessment(
      { studentId: 's', courseId: 'ap-statistics', loIds: [LO_A], maxPerLo: 2 },
      new FakeSources([planA], [bankA]),
    );
    assert.ok(AssessmentSetSchema.safeParse(set).success, 'AssessmentSet must validate');
    assert.ok(set.items.length > 0 && set.items.length <= 2, 'respects maxPerLo');
    for (const it of set.items) {
      assert.strictEqual(it.loId, LO_A);
      assert.ok(!('expectedAnswer' in it), 'no expectedAnswer leaked');
      assert.ok(!('answer' in it), 'no answer leaked');
      for (const c of it.choices ?? []) {
        assert.deepStrictEqual(Object.keys(c).sort(), ['id', 'text'], 'choices must not leak `correct`');
      }
    }
  });

  console.log('\nsubmitAssessment — grading → preliminary read:\n');

  const submission = (sessionId: string) => ({
    assessmentId: 'asmt-1',
    studentId: 'portalA:diag',
    courseId: 'ap-statistics',
    sessionId,
    responses: [
      { itemId: 'a1', loId: LO_A, response: { text: '5' } }, // correct
      { itemId: 'a2', loId: LO_A, response: { text: 'A' } }, // correct
      { itemId: 'b1', loId: LO_B, response: { text: '1' } }, // wrong
      { itemId: 'b2', loId: LO_B, response: { text: '2' } }, // wrong
    ],
  });

  let firstResult: Awaited<ReturnType<typeof submitAssessment>>;
  await test('grades, writes low-exposure mastery + candidate gap for the weak LO', async () => {
    firstResult = await submitAssessment(submission('diag-s1'), fakeDeps, fakeResolver, 'test-partner');
    assert.ok(SessionResultSchema.safeParse(firstResult).success, 'must be a valid SessionResult');

    const mA = firstResult.learningStateDelta.mastery.find((m) => m.loId === LO_A)!;
    const mB = firstResult.learningStateDelta.mastery.find((m) => m.loId === LO_B)!;
    assert.ok(mA && mB, 'both LOs have mastery');
    assert.strictEqual(mA.exposures, 1, 'low exposures (1)');
    assert.strictEqual(mB.exposures, 1, 'low exposures (1)');
    assert.ok(mA.score > 0.5, `strong LO score ${mA.score} > 0.5`);
    assert.ok(mB.score < 0.5, `weak LO score ${mB.score} < 0.5`);

    const newGaps = firstResult.learningStateDelta.gaps.new;
    const gapB = newGaps.find((g) => g.loId === LO_B);
    assert.ok(gapB, 'weak LO produced a gap');
    assert.strictEqual(gapB!.status, 'candidate', 'gap is candidate, not confirmed');
    assert.ok(!newGaps.some((g) => g.loId === LO_A), 'strong LO produced no gap');
    assert.strictEqual(firstResult.learningStateDelta.gaps.promoted.length, 0, 'nothing promoted');
  });

  await test('idempotent on sessionId — re-submit yields no new deltas', async () => {
    const again = await submitAssessment(submission('diag-s1'), fakeDeps, fakeResolver, 'test-partner');
    assert.strictEqual(again.learningStateDelta.gaps.new.length, 0);
  });

  await test('returns a points-based score breakdown (v1.4.0)', async () => {
    // firstResult graded a1✓ a2✓ (LO_A) and b1✗ b2✗ (LO_B): 2 of 4 pts.
    const score = firstResult.score!;
    assert.ok(score, 'score present');
    assert.strictEqual(score.pointsAwarded, 2);
    assert.strictEqual(score.maxPoints, 4);
    assert.strictEqual(score.percent, 50);
    const a = score.perLo.find((p) => p.loId === LO_A)!;
    const b = score.perLo.find((p) => p.loId === LO_B)!;
    assert.deepStrictEqual([a.pointsAwarded, a.maxPoints], [2, 2], 'LO_A full');
    assert.deepStrictEqual([b.pointsAwarded, b.maxPoints], [0, 2], 'LO_B zero');
  });

  await test('returns a per-item review with revealed keys (v1.4.0)', async () => {
    const review = firstResult.review!;
    assert.strictEqual(review.length, 4, 'one review row per response');
    const a1 = review.find((x) => x.itemId === 'a1')!;
    assert.ok(a1.correct, 'a1 correct');
    assert.strictEqual(a1.expectedAnswer, '5', 'key revealed post-submit');
    const b1 = review.find((x) => x.itemId === 'b1')!;
    assert.strictEqual(b1.correct, false, 'b1 wrong');
    assert.strictEqual(b1.maxPoints, 1);
  });

  await test('FRQ with a rubric awards PARTIAL credit in the score', async () => {
    const LO_F = 'apstats.lo-frq';
    const rubricKey: ResolvedAssessmentKey = {
      responseFormat: 'frq',
      rubric: {
        parts: [
          { criterionId: 'p1', maxPoints: 2, scoringCriteria: 'states H0/Ha', modelResponse: '…' },
          { criterionId: 'p2', maxPoints: 2, scoringCriteria: 'computes statistic', modelResponse: '…' },
        ],
      },
    };
    const rubricResolver: AssessmentItemResolver = async (id) => (id === 'f1' ? rubricKey : null);
    // Award 1.5 / 2 on each part → 3 / 4 total.
    const rubricDeps: GradeDeps = {
      async gradeRubricPart(args) {
        return { pointsAwarded: 1.5, feedback: `partial on ${args.criterionId}` };
      },
      async judgeSingleAnswer() {
        return { correct: false, feedback: 'should not be called for rubric FRQ' };
      },
    };
    const res = await submitAssessment(
      {
        assessmentId: 'asmt-frq', studentId: 'portalA:frq', courseId: 'ap-statistics', sessionId: 'frq-s1',
        responses: [{ itemId: 'f1', loId: LO_F, response: { text: 'my answer' } }],
      },
      rubricDeps,
      rubricResolver,
      'test-partner',
    );
    const score = res.score!;
    assert.strictEqual(score.pointsAwarded, 3, 'partial 1.5+1.5');
    assert.strictEqual(score.maxPoints, 4, 'rubric maxPoints summed');
    assert.strictEqual(score.percent, 75);
    // Partial (0.75 > 0.5) → strong-ish: no candidate gap, positive mastery.
    assert.ok(!res.learningStateDelta.gaps.new.some((g) => g.loId === LO_F), 'no gap at 75%');
    const m = res.learningStateDelta.mastery.find((x) => x.loId === LO_F)!;
    assert.ok(m.score > 0.5, 'partial-credit FRQ lifts mastery');
  });

  await test('numeric grader accepts an equivalent simple fraction (25/10 == 2.5)', async () => {
    const key: ResolvedAssessmentKey = { responseFormat: 'numeric', expectedAnswer: '2.5' };
    const resolver: AssessmentItemResolver = async () => key;
    const res = await submitAssessment(
      { assessmentId: 'a', studentId: 'p', courseId: 'c', sessionId: 'frac-1',
        responses: [{ itemId: 'n1', loId: 'apstats.lo-n', response: { text: '25/10' } }] },
      fakeDeps, resolver, 'test-partner',
    );
    assert.strictEqual(res.review!.find((r) => r.itemId === 'n1')!.correct, true, '25/10 should grade as 2.5');
  });

  await test('review feedback carries a hint-based rationale for mcq/numeric', async () => {
    const key: ResolvedAssessmentKey = { responseFormat: 'numeric', expectedAnswer: '5', hints: ['divide the total by n'] };
    const resolver: AssessmentItemResolver = async () => key;
    const res = await submitAssessment(
      { assessmentId: 'a', studentId: 'p', courseId: 'c', sessionId: 'fb-1',
        responses: [{ itemId: 'n2', loId: 'apstats.lo-n', response: { text: '5' } }] },
      fakeDeps, resolver, 'test-partner',
    );
    const r = res.review!.find((x) => x.itemId === 'n2')!;
    assert.ok(r.correct);
    assert.ok((r.feedback ?? '').includes('divide the total by n'), 'feedback surfaces the hint rationale');
  });

  console.log('\nItem-id resolution — collision safety (qualified plan-TY ids):\n');

  await test('qualified plan-TY id resolves to the NAMED plan, not a same-segment-id collision', async () => {
    // `try-comparison` exists in BOTH the AP Stats categorical plan and the AP
    // Calc BC logistic-models plan. Before qualification a whole-corpus scan
    // returned the Calc answer for the Stats question (the logistic-growth bug).
    const statsKey = await resolveAssessmentItem('evelyn.ap.stats.categorical-data.v1::try-comparison');
    const calcKey = await resolveAssessmentItem('evelyn.ap.calcbc.logistic-models.v1::try-comparison');
    assert.ok(statsKey?.expectedAnswer, 'stats key resolved');
    assert.ok(calcKey?.expectedAnswer, 'calc key resolved');
    assert.ok(/pass rate|80\/200/i.test(statsKey!.expectedAnswer!), 'stats id → stats (pass-rate) answer');
    assert.ok(!/logistic|exponential/i.test(statsKey!.expectedAnswer!), 'stats id must NOT resolve the Calc answer');
    assert.ok(/logistic|exponential/i.test(calcKey!.expectedAnswer!), 'calc id → calc (logistic) answer');
  });

  await test('qualified id for a missing plan/segment resolves to null (no fallback scan)', async () => {
    const gone = await resolveAssessmentItem('evelyn.no.such.plan.v1::try-comparison');
    assert.strictEqual(gone, null);
  });

  console.log('\nEndpoints (auth + conformance):\n');

  await test('assessment POST unsigned → 401', async () => {
    const req = new Request('https://engine.test/api/portal/v1/assessment', { method: 'POST' }) as unknown as NextRequest;
    const { status } = await call(assessmentPOST, req);
    assert.strictEqual(status, 401);
  });
  await test('assessment POST (real LO) → 200, AssessmentSet-valid, no leak', async () => {
    const body = { studentId: 'portalA:diag2', courseId: 'ap-statistics', loIds: ['apstats.normal-distribution'], maxPerLo: 2 };
    const { status, json } = await call(assessmentPOST, signed('POST', '/api/portal/v1/assessment', body));
    assert.strictEqual(status, 200);
    assert.ok(AssessmentSetSchema.safeParse(json).success);
    assert.ok(json.items.length > 0, 'curated try-yourselves returned');
    for (const it of json.items) for (const c of it.choices ?? []) {
      assert.ok(!('correct' in c), 'no correct flag leaked');
    }
  });
  await test('submit POST malformed → 400', async () => {
    const { status } = await call(submitPOST, signed('POST', '/api/portal/v1/assessment/submit', { assessmentId: 'x' }));
    assert.strictEqual(status, 400);
  });
  await test('submit POST unsigned → 401', async () => {
    const req = new Request('https://engine.test/api/portal/v1/assessment/submit', { method: 'POST' }) as unknown as NextRequest;
    const { status } = await call(submitPOST, req);
    assert.strictEqual(status, 401);
  });

  console.log(`\n${passed} passed, ${failed} failed\n`);
  // REPO NIT fix: explicit exit code either way (mirrors test-learner-model.ts)
  // — falling off the end of this IIFE never returned control to
  // `npm run test:portal`'s aggregate script when something upstream kept
  // the event loop open (e.g. a live DB/connection handle), which meant a
  // successful run could hang instead of exiting 0.
  process.exit(failed > 0 ? 1 : 0);
})().catch((err) => {
  console.error('Fatal error running portal-assessment tests:', err);
  process.exit(1);
});
