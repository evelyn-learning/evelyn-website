/**
 * Withdrawn practice items — ids an answer-key audit flagged (wrong key,
 * ill-posed question, or undecided) must never be SERVED again, from any
 * source, while an answer to an item already issued keeps grading.
 *
 * Under test:
 *   - src/data/withdrawn-practice-items.json (the committed list) and
 *     portal/withdrawn-items.ts (`isWithdrawnItem`);
 *   - portal/practice.ts `retrievePractice` — bank rows AND plan
 *     try-yourselves are dropped before de-dup/slicing, so a withdrawn item
 *     never takes a slot and the shortfall top-up still runs;
 *   - portal/practice-gen.ts `generatePracticeItems` — a withdrawn item is
 *     never a generation ANCHOR, and a regeneration that lands on a withdrawn
 *     id is not served;
 *   - portal/assessment.ts `buildAssessment` and practice-assign/resolve.ts
 *     `resolveAssignmentItems` inherit the rule (both go through
 *     `retrievePractice`);
 *   - portal/adapters.ts `resolveGradeItem` / `resolveAssessmentItem` are
 *     UNCHANGED: a withdrawn id still resolves for grading.
 *   - LIVE SESSION (key dropped, question kept): `effectiveSegment` strips the
 *     stored key of a withdrawn `<planId>::<segId>`; `getSegmentTruth`, the
 *     brain prompt blocks (`formatSegmentTruth`, `formatLessonPlanContext`,
 *     `formatLessonPlanForRealtime`) print no stored answer and one neutral
 *     "no verified answer" line; `planAuthoredFallback` never re-serves a
 *     withdrawn try-yourself; the generate_problem anchor drops its answer.
 *     Non-withdrawn output is pinned byte-identical (sha256 of the output of
 *     the code BEFORE this change, taken on the real seed plan).
 *
 * No database: pure fakes only.
 *
 * Run (ts-node/commonjs, same as test:practice-plan-scoping):
 *   TS_NODE_BASEURL=./ npx ts-node -r tsconfig-paths/register \
 *     --compiler-options '{"module":"commonjs","baseUrl":"./"}' scripts/test-withdrawn-items.ts
 */
import { strict as assert } from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import {
  retrievePractice,
  type PracticeSources,
  type PlanLite,
  type BankLite,
} from '@/lib/tutor/portal/practice';
import { generatePracticeItems, type PracticeGenSources } from '@/lib/tutor/portal/practice-gen';
import {
  isWithdrawnItem,
  WITHDRAWN_ITEM_IDS,
  withdrawnVerdict,
  effectiveSegment,
  NO_VERIFIED_ANSWER_LINE,
} from '@/lib/tutor/portal/withdrawn-items';
import { createHash } from 'node:crypto';
import { SEED_AP_CALCBC_U1_INTRODUCING_CALCULUS as REAL_SEED } from '@/lib/tutor/lesson-plan/seeds/ap-calcbc-u1-introducing-calculus';
import { buildLessonPlanContext, getSegmentTruth } from '@/lib/tutor/lesson-plan/context';
import { formatSegmentTruth, formatLessonPlanContext } from '@/lib/tutor/voice/claude-brain';
import { formatLessonPlanForRealtime } from '@/lib/tutor/orchestrator/format-lesson-plan';
import { planAuthoredFallback, effectiveAnchor } from '@/lib/tutor/voice/problem-generator';
import { buildAssessment } from '@/lib/tutor/portal/assessment';
import { resolveGradeItem, resolveAssessmentItem, type ItemKeyDeps } from '@/lib/tutor/portal/adapters';
import { resolveAssignmentItems } from '@/lib/tutor/practice-assign/resolve';
import type { IProblemBank } from '@/models/ProblemBank';
import type { LessonPlan } from '@/lib/tutor/lesson-plan/types';
import type { PracticeItem, RetrievePracticeRequest } from '@evelyn/portal-contract/v1';

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
  } finally {
    delete process.env.PRACTICE_GEN;
  }
}

// ---------------------------------------------------------------------------
// Real ids from the 2026-10-04 audit list
// ---------------------------------------------------------------------------

/** The one withdrawn BANK row (a banked generate-on-exhaustion item). */
const BANK_LO = 'gen-ba15a88f-6de6-46aa-8466-da3dd259478f.lo-1';
const WITHDRAWN_BANK_ID = `practice-gen.${BANK_LO}.16aropq`;

/** A withdrawn try-yourself of a generated (course-built) plan. */
const GEN_PLAN = 'gen-0938830f-7023-4e1d-b13a-2a45c834500a';
const GEN_LO = `${GEN_PLAN}.lo-5`;
const WITHDRAWN_GEN_TRY = `${GEN_PLAN}::${GEN_LO}-try`;

/** A withdrawn try-yourself of a curated seed plan. */
const SEED_PLAN = 'evelyn.ap.calcbc.introducing-calculus.v1';
const WITHDRAWN_SEED_TRY = `${SEED_PLAN}::try-compute`;

/** A withdrawn try-yourself of a (private) review plan. */
const WITHDRAWN_REV_TRY = 'rev-1cd3cb42-8107-488f-9412-81139ce9eed3::alg1.one-two-step-equations-try';

const WITHDRAWN_TEXT = 'WITHDRAWN-PROBLEM-TEXT what is 2 + 2?';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const genPlan: PlanLite = {
  id: GEN_PLAN,
  topic: 'Some course topic',
  los: [{ id: `${GEN_PLAN}.lo-4` }, { id: GEN_LO }],
  segments: [
    { kind: 'try_yourself', id: `${GEN_PLAN}.lo-4-try`, problem: 'LO-4 problem: compute 6 * 7.', expectedAnswer: '42' },
    { kind: 'try_yourself', id: `${GEN_LO}-try`, problem: WITHDRAWN_TEXT, expectedAnswer: '5' },
    { kind: 'try_yourself', id: `${GEN_LO}-try2`, problem: 'LO-5 second problem: compute 3 * 3.', expectedAnswer: '9' },
  ],
};

const seedPlan: PlanLite = {
  id: SEED_PLAN,
  topic: 'calc-bc-intro',
  los: [{ id: 'apcalcbc.introducing-calculus' }],
  segments: [
    { kind: 'try_yourself', id: 'try-compute', problem: WITHDRAWN_TEXT, expectedAnswer: 'wrong' },
    { kind: 'try_yourself', id: 'try-other', problem: 'Average velocity of f(t) = t^2 on [0, 2]?', expectedAnswer: '2' },
  ],
};

function bankRow(id: string, over: Partial<BankLite> = {}): BankLite {
  return { id, problemText: `Bank problem ${id}: compute 1 + 1.`, answer: '2', responseFormat: 'numeric', difficulty: 2, loId: BANK_LO, ...over };
}

function sourcesOf(plans: PlanLite[], bank: BankLite[]): PracticeSources {
  return {
    async plansForLoId(loId) { return plans.filter((p) => p.los.some((l) => l.id === loId)); },
    async plansForTopic(topicId) { return plans.filter((p) => p.topic === topicId); },
    async bankForLoId(loId, difficulty) { return bank.filter((b) => b.loId === loId && (!difficulty || b.difficulty === difficulty)); },
    async bankForTopic() { return bank; },
  };
}

function req(loId: string, over: Partial<RetrievePracticeRequest> = {}): RetrievePracticeRequest {
  return { studentId: 's1', courseId: 'c1', scope: { loId }, count: 10, ...over };
}

/** Generator spy — records every prompt it was asked to generate from. */
function genSpy(hashes?: string[]): { gen: PracticeGenSources; prompts: string[] } {
  process.env.PRACTICE_GEN = 'on';
  const prompts: string[] = [];
  let n = 0;
  const gen = {
    async reserve(_s: string, _l: string, want: number) { return want; },
    async generateAndVerify(userPrompt: string) {
      prompts.push(userPrompt);
      const hash = hashes?.[n] ?? `fresh${n + 1}`;
      n++;
      return { gen: { problemText: `Fresh generated problem ${n}?`, finalAnswer: String(n), responseFormat: 'numeric' }, hash };
    },
    async persist() {},
  } as unknown as PracticeGenSources;
  return { gen, prompts };
}

const ids = (r: { items: Array<{ id: string }> }) => r.items.map((i) => i.id);

/** Capture `[practice] withdrawn item skipped <id>` log lines. */
async function captureLogs<T>(fn: () => Promise<T>): Promise<{ result: T; lines: string[] }> {
  const lines: string[] = [];
  const orig = console.log;
  console.log = (...args: unknown[]) => { lines.push(args.map(String).join(' ')); };
  try {
    return { result: await fn(), lines };
  } finally {
    console.log = orig;
  }
}

(async () => {
  console.log('withdrawn practice items');

  // -------------------------------------------------------------------------
  // The committed list
  // -------------------------------------------------------------------------
  await test('the JSON holds exactly 392 ids, each with a verdict', () => {
    const file = path.join(__dirname, '..', 'src', 'data', 'withdrawn-practice-items.json');
    const data = JSON.parse(fs.readFileSync(file, 'utf8')) as { generatedAt: string; source: string; items: Record<string, string> };
    assert.equal(data.generatedAt, '2026-10-04');
    assert.equal(data.source, 'answer-key audit 2026-10-04');
    assert.equal(Object.keys(data.items).length, 392);
    assert.ok(WITHDRAWN_REV_TRY in data.items);
    for (const [id, verdict] of Object.entries(data.items)) {
      assert.ok(id.length > 0 && id === id.trim(), `bad id ${JSON.stringify(id)}`);
      assert.ok(/^[A-Z_]+$/.test(verdict), `bad verdict for ${id}: ${verdict}`);
    }
  });

  await test('isWithdrawnItem / the set reflect the JSON', () => {
    assert.equal(WITHDRAWN_ITEM_IDS.size, 392);
    for (const id of [WITHDRAWN_BANK_ID, WITHDRAWN_GEN_TRY, WITHDRAWN_SEED_TRY, WITHDRAWN_REV_TRY]) {
      assert.equal(isWithdrawnItem(id), true, id);
    }
    assert.equal(withdrawnVerdict(WITHDRAWN_REV_TRY), 'KEY_WRONG');
    assert.equal(withdrawnVerdict('nope'), undefined);
    assert.equal(isWithdrawnItem('openstax.stats.0042'), false);
    assert.equal(isWithdrawnItem(`${GEN_PLAN}::${GEN_LO}-try2`), false);
    // The bare segment id alone is NOT withdrawn — segment ids collide across plans.
    assert.equal(isWithdrawnItem('try-compute'), false);
    assert.equal(isWithdrawnItem(undefined), false);
    assert.equal(isWithdrawnItem(''), false);
    // No prototype-chain false positives.
    assert.equal(isWithdrawnItem('constructor'), false);
    assert.equal(isWithdrawnItem('toString'), false);
  });

  // -------------------------------------------------------------------------
  // retrievePractice — bank
  // -------------------------------------------------------------------------
  await test('a withdrawn bank id is not served (LO scope), and one line is logged', async () => {
    const src = sourcesOf([], [bankRow(WITHDRAWN_BANK_ID), bankRow('bank-ok-1'), bankRow('bank-ok-2')]);
    const { result, lines } = await captureLogs(() => retrievePractice(req(BANK_LO), src));
    assert.deepEqual(ids(result), ['bank-ok-1', 'bank-ok-2']);
    assert.deepEqual(lines.filter((l) => l.includes('withdrawn')), [`[practice] withdrawn item skipped ${WITHDRAWN_BANK_ID}`]);
  });

  await test('a withdrawn bank id is not served (topic scope)', async () => {
    const src = sourcesOf([], [bankRow(WITHDRAWN_BANK_ID), bankRow('bank-ok-1')]);
    const res = await retrievePractice({ studentId: 's1', courseId: 'c1', scope: { topicId: 't' }, count: 10 }, src);
    assert.deepEqual(ids(res), ['bank-ok-1']);
  });

  await test('a withdrawn bank item never takes a slot: count is filled from the remaining pool', async () => {
    // Withdrawn row FIRST: a post-slice filter would return only 1 item.
    const src = sourcesOf([], [bankRow(WITHDRAWN_BANK_ID), bankRow('bank-ok-1'), bankRow('bank-ok-2'), bankRow('bank-ok-3')]);
    const res = await retrievePractice(req(BANK_LO, { count: 2 }), src);
    assert.deepEqual(ids(res), ['bank-ok-1', 'bank-ok-2']);
  });

  // -------------------------------------------------------------------------
  // retrievePractice — plan try-yourselves
  // -------------------------------------------------------------------------
  await test('a withdrawn `<planId>::<segId>` is not served; the plan\'s other try-yourselves still are (generated plan)', async () => {
    const src = sourcesOf([genPlan], []);
    const { result, lines } = await captureLogs(() => retrievePractice(req(GEN_LO), src));
    assert.deepEqual(ids(result), [`${GEN_PLAN}::${GEN_LO}-try2`]);
    assert.deepEqual(lines.filter((l) => l.includes('withdrawn')), [`[practice] withdrawn item skipped ${WITHDRAWN_GEN_TRY}`]);
    const other = await retrievePractice(req(`${GEN_PLAN}.lo-4`), src);
    assert.deepEqual(ids(other), [`${GEN_PLAN}::${GEN_PLAN}.lo-4-try`]);
  });

  await test('a withdrawn seed-plan try-yourself is not served; its sibling still is (LO + topic scope)', async () => {
    const src = sourcesOf([seedPlan], []);
    const byLo = await retrievePractice(req('apcalcbc.introducing-calculus'), src);
    assert.deepEqual(ids(byLo), [`${SEED_PLAN}::try-other`]);
    const byTopic = await retrievePractice({ studentId: 's1', courseId: 'c1', scope: { topicId: 'calc-bc-intro' }, count: 10 }, src);
    assert.deepEqual(ids(byTopic), [`${SEED_PLAN}::try-other`]);
  });

  await test('a segment with the same id in ANOTHER plan is not withdrawn', async () => {
    const twin: PlanLite = { ...seedPlan, id: 'evelyn.some.other-plan.v1' };
    const res = await retrievePractice(req('apcalcbc.introducing-calculus'), sourcesOf([twin], []));
    assert.deepEqual(ids(res), ['evelyn.some.other-plan.v1::try-compute', 'evelyn.some.other-plan.v1::try-other']);
  });

  // -------------------------------------------------------------------------
  // Shortfall top-up + anchors
  // -------------------------------------------------------------------------
  await test('the shortfall left by a withdrawn item is topped up by generation', async () => {
    const { gen, prompts } = genSpy();
    const res = await retrievePractice(req(GEN_LO, { count: 2 }), sourcesOf([genPlan], []), gen);
    assert.deepEqual(ids(res), [`${GEN_PLAN}::${GEN_LO}-try2`, `practice-gen.${GEN_LO}.fresh1`]);
    assert.equal(prompts.length, 1);
  });

  await test('a withdrawn item is never a generation anchor (retrievePractice)', async () => {
    // The LO's ONLY items are withdrawn: with the withdrawn try-yourself in
    // the anchor pool the prompt would quote it. Repeated to defeat sampling.
    const onlyWithdrawn: PlanLite = { ...genPlan, segments: genPlan.segments.filter((s) => s.id !== `${GEN_LO}-try2`) };
    for (let i = 0; i < 20; i++) {
      const { gen, prompts } = genSpy();
      const res = await retrievePractice(req(GEN_LO, { count: 2 }), sourcesOf([onlyWithdrawn], []), gen);
      assert.equal(prompts.length, 2);
      for (const p of prompts) assert.ok(!p.includes('WITHDRAWN-PROBLEM-TEXT'), 'withdrawn item used as anchor');
      assert.ok(!ids(res).includes(WITHDRAWN_GEN_TRY));
      assert.equal(res.items.length, 2);
    }
  });

  await test('a withdrawn item is never a generation anchor (generatePracticeItems, any caller)', async () => {
    const withdrawnAnchor: PracticeItem = { id: WITHDRAWN_GEN_TRY, source: 'plan-try-yourself', problemText: WITHDRAWN_TEXT, expectedAnswer: '5', loId: GEN_LO };
    const okAnchor: PracticeItem = { id: 'ok-anchor', source: 'bank', problemText: 'OK-ANCHOR-TEXT compute 8 - 3.', expectedAnswer: '5', loId: GEN_LO };
    for (let i = 0; i < 20; i++) {
      const { gen, prompts } = genSpy();
      const out = await generatePracticeItems(
        { studentId: 's1', loId: GEN_LO, topic: 't', shortfall: 2, anchorItems: [withdrawnAnchor, okAnchor] },
        gen,
      );
      assert.equal(out.length, 2);
      assert.equal(prompts.length, 2);
      for (const p of prompts) {
        assert.ok(!p.includes('WITHDRAWN-PROBLEM-TEXT'), 'withdrawn item used as anchor');
        assert.ok(p.includes('OK-ANCHOR-TEXT'), 'the remaining anchor should be used');
      }
    }
  });

  await test('a regeneration that lands on a withdrawn id is not served', async () => {
    // Same content hash → same `practice-gen.<loId>.<hash>` id as the withdrawn row.
    const { gen } = genSpy(['16aropq', 'fresh-b']);
    const direct = await generatePracticeItems({ studentId: 's1', loId: BANK_LO, topic: 't', shortfall: 2, anchorItems: [] }, gen);
    assert.deepEqual(direct.map((i) => i.id), [`practice-gen.${BANK_LO}.fresh-b`]);

    const spy2 = genSpy(['16aropq', 'fresh-b']);
    const plan: PlanLite = { id: 'gen-ba15a88f-6de6-46aa-8466-da3dd259478f', topic: 'T', los: [{ id: BANK_LO }], segments: [] };
    const res = await retrievePractice(req(BANK_LO, { count: 3 }), sourcesOf([plan], [bankRow(WITHDRAWN_BANK_ID), bankRow('bank-ok-1')]), spy2.gen);
    assert.deepEqual(ids(res), ['bank-ok-1', `practice-gen.${BANK_LO}.fresh-b`]);
  });

  // -------------------------------------------------------------------------
  // Callers that inherit the rule
  // -------------------------------------------------------------------------
  await test('buildAssessment never includes a withdrawn item', async () => {
    const src = sourcesOf([genPlan], [bankRow(WITHDRAWN_BANK_ID, { loId: GEN_LO }), bankRow('bank-ok-1', { loId: GEN_LO })]);
    const set = await buildAssessment({ studentId: 's1', courseId: 'c1', loIds: [GEN_LO, `${GEN_PLAN}.lo-4`], maxPerLo: 10 } as Parameters<typeof buildAssessment>[0], src, undefined);
    const got = set.items.map((i) => i.itemId);
    assert.ok(got.length > 0);
    assert.ok(!got.includes(WITHDRAWN_BANK_ID) && !got.includes(WITHDRAWN_GEN_TRY), got.join(','));
    assert.ok(got.includes(`${GEN_PLAN}::${GEN_LO}-try2`));
  });

  await test('resolveAssignmentItems (assigned practice) never includes a withdrawn item and still fills from the pool', async () => {
    const src = sourcesOf([genPlan], [bankRow(WITHDRAWN_BANK_ID, { loId: GEN_LO }), bankRow('bank-ok-1', { loId: GEN_LO }), bankRow('bank-ok-2', { loId: GEN_LO })]);
    const out = await resolveAssignmentItems(
      { los: [{ loId: GEN_LO, title: 'LO 5' }], band: 'steady', seenItemIds: [], studentId: 's1', courseId: 'c1', cap: 2 },
      src,
    );
    assert.deepEqual(out.map((l) => l.items.map((i) => i.id)), [['bank-ok-1', 'bank-ok-2']]);
  });

  // -------------------------------------------------------------------------
  // Grading of already-issued ids is untouched
  // -------------------------------------------------------------------------
  const ISSUED_REV = {
    id: 'rev-1cd3cb42-8107-488f-9412-81139ce9eed3',
    title: 'Review',
    topic: 'review',
    los: [{ id: 'alg1.one-two-step-equations' }],
    segments: [
      { kind: 'try_yourself', id: 'alg1.one-two-step-equations-try', problem: 'Solve: (3x + 7)/2 = 10. What is x?', expectedAnswer: '11', responseFormat: 'numeric' },
    ],
    metadata: { reviewPlan: true },
  } as unknown as LessonPlan;
  const keyDeps: ItemKeyDeps = {
    async getStoredPlan(id) { return id === ISSUED_REV.id ? ISSUED_REV : null; },
    async findBankRow(id) {
      return id === WITHDRAWN_BANK_ID
        ? ({ id, problemText: 'p', answer: '7', responseFormat: 'numeric' } as unknown as IProblemBank)
        : null;
    },
  };

  await test('resolveGradeItem still resolves a withdrawn plan try-yourself id', async () => {
    const item = await resolveGradeItem(WITHDRAWN_REV_TRY, keyDeps);
    assert.ok(item);
    assert.equal(item.itemId, WITHDRAWN_REV_TRY);
    assert.equal(item.expectedAnswer, '11');
  });

  await test('resolveGradeItem still resolves a withdrawn bank id', async () => {
    const item = await resolveGradeItem(WITHDRAWN_BANK_ID, keyDeps);
    assert.ok(item);
    assert.equal(item.expectedAnswer, '7');
  });

  await test('resolveAssessmentItem still resolves withdrawn ids', async () => {
    const a = await resolveAssessmentItem(WITHDRAWN_REV_TRY, keyDeps);
    assert.ok(a);
    assert.equal(a.expectedAnswer, '11');
    const b = await resolveAssessmentItem(WITHDRAWN_BANK_ID, keyDeps);
    assert.ok(b);
    assert.equal(b.expectedAnswer, '7');
  });

  // -------------------------------------------------------------------------
  // Live session: the stored key of a withdrawn segment is dropped
  // -------------------------------------------------------------------------
  const sha = (x: string) => createHash('sha256').update(x).digest('hex').slice(0, 16);
  const realSeg = (id: string) => {
    const seg = REAL_SEED.segments.find((sg) => sg.id === id);
    assert.ok(seg, `seed segment ${id} missing`);
    return seg;
  };
  const WITHDRAWN_SEG = realSeg('try-compute');
  const OK_SEG = realSeg('try-define');
  const rec = (x: unknown) => x as Record<string, unknown>;
  const storedKey = String(rec(WITHDRAWN_SEG).expectedAnswer);

  await test('fixture sanity: the real seed plan holds the withdrawn segment, with a stored key', () => {
    assert.equal(REAL_SEED.id, SEED_PLAN);
    assert.equal(isWithdrawnItem(`${REAL_SEED.id}::try-compute`), true);
    assert.equal(isWithdrawnItem(`${REAL_SEED.id}::try-define`), false);
    assert.ok(storedKey.length > 20);
    assert.ok(Array.isArray(rec(WITHDRAWN_SEG).hints));
  });

  await test('effectiveSegment strips the stored key of a withdrawn segment, keeps the question, marks keyWithdrawn', () => {
    const before = JSON.stringify(WITHDRAWN_SEG);
    const eff = rec(effectiveSegment(REAL_SEED.id, WITHDRAWN_SEG));
    assert.equal(eff.keyWithdrawn, true);
    assert.equal(eff.problem, rec(WITHDRAWN_SEG).problem);
    assert.equal(eff.id, 'try-compute');
    assert.equal(eff.kind, 'try_yourself');
    assert.equal(eff.responseFormat, 'numeric');
    for (const k of ['expectedAnswer', 'hints', 'rubric', 'modelResponse']) assert.ok(!(k in eff), `${k} survived`);
    assert.ok(!JSON.stringify(eff).includes(storedKey.slice(0, 30)));
    // Pure: the plan's own segment object is untouched.
    assert.equal(JSON.stringify(WITHDRAWN_SEG), before);
    // Idempotent.
    assert.deepEqual(effectiveSegment(REAL_SEED.id, eff), eff);
  });

  await test('effectiveSegment strips every stored-answer field (rubric, model response, worked steps, answer)', () => {
    const loaded = {
      ...rec(WITHDRAWN_SEG),
      rubric: { parts: [{ criterionId: 'a', maxPoints: 1, scoringCriteria: 'c', modelResponse: 'm' }] },
      modelResponse: 'MODEL',
      answer: 'ANS',
      steps: ['s1'],
      solution: 'SOL',
      workedSolution: ['w'],
      correctChoice: 'B',
      correctLetter: 'B',
      correctAnswer: 'B',
    };
    const eff = rec(effectiveSegment(REAL_SEED.id, loaded));
    assert.deepEqual(Object.keys(eff).sort(), ['estimatedMinutes', 'id', 'keyWithdrawn', 'kind', 'problem', 'responseFormat'].sort());
  });

  await test('effectiveSegment leaves any other segment byte-identical (same reference)', () => {
    for (const seg of REAL_SEED.segments) {
      if (seg.id === 'try-compute') continue;
      const before = JSON.stringify(seg);
      const eff = effectiveSegment(REAL_SEED.id, seg);
      assert.equal(eff, seg, seg.id);
      assert.equal(JSON.stringify(eff), before);
      assert.ok(!('keyWithdrawn' in rec(eff)));
    }
    // Same segment id in ANOTHER plan, or no plan id at all, is not withdrawn.
    assert.equal(effectiveSegment('evelyn.some.other-plan.v1', WITHDRAWN_SEG), WITHDRAWN_SEG);
    assert.equal(effectiveSegment(undefined, WITHDRAWN_SEG), WITHDRAWN_SEG);
    assert.equal(effectiveSegment(REAL_SEED.id, undefined), undefined);
  });

  await test('an MCQ segment loses its correct marker; choice ids and texts stay', () => {
    const mcq = {
      id: 'try-compute',
      kind: 'try_yourself',
      problem: 'Which is the average velocity?',
      expectedAnswer: 'B',
      responseFormat: 'mcq',
      choices: [
        { id: 'A', text: '7 m/s' },
        { id: 'B', text: '8 m/s', correct: true },
        { id: 'C', text: '9 m/s', correct: false },
      ],
    };
    const eff = rec(effectiveSegment(REAL_SEED.id, mcq));
    assert.deepEqual(eff.choices, [{ id: 'A', text: '7 m/s' }, { id: 'B', text: '8 m/s' }, { id: 'C', text: '9 m/s' }]);
    assert.ok(!('expectedAnswer' in eff));
    assert.equal(eff.keyWithdrawn, true);
    assert.equal(mcq.choices[1].correct, true, 'input mutated');
    // Not withdrawn under another plan: untouched.
    assert.equal(effectiveSegment('evelyn.some.other-plan.v1', mcq), mcq);
  });

  await test('getSegmentTruth: withdrawn → question kept, no expectedAnswer, keyWithdrawn; others unchanged', () => {
    const t = getSegmentTruth(WITHDRAWN_SEG, REAL_SEED.id);
    assert.deepEqual(t, { problemText: rec(WITHDRAWN_SEG).problem, expectedAnswer: undefined, kind: 'try_yourself', keyWithdrawn: true });
    // An already-stripped segment (what the client sends the server) reads the same.
    assert.deepEqual(getSegmentTruth(effectiveSegment(REAL_SEED.id, WITHDRAWN_SEG), REAL_SEED.id), t);
    for (const [id, pin] of [['try-define', 'a5299684b319562b'], ['try-why-limits', '0415a67b65cff49f'], ['worked-falling-ball', '3b972f6c50e18355']] as const) {
      assert.equal(sha(JSON.stringify(getSegmentTruth(realSeg(id), REAL_SEED.id))), pin, id);
    }
    // Same segment under another plan id keeps its key (pre-change pin).
    assert.equal(sha(JSON.stringify(getSegmentTruth(WITHDRAWN_SEG, 'evelyn.some.other-plan.v1'))), '7e3675eedd70c376');
  });

  await test('formatSegmentTruth: withdrawn prints no expected answer and the neutral line', () => {
    const out = formatSegmentTruth(WITHDRAWN_SEG, REAL_SEED.id);
    assert.ok(!out.includes('expectedAnswer:'), out);
    assert.ok(!out.includes(storedKey.slice(0, 30)));
    assert.ok(out.includes(NO_VERIFIED_ANSWER_LINE));
    assert.ok(out.includes(`problemText: ${JSON.stringify(rec(WITHDRAWN_SEG).problem)}`));
    assert.ok(/no verified answer/i.test(NO_VERIFIED_ANSWER_LINE) && /work (it|the answer) out/i.test(NO_VERIFIED_ANSWER_LINE));
  });

  await test('formatSegmentTruth: non-withdrawn output is byte-identical to before', () => {
    assert.equal(sha(formatSegmentTruth(OK_SEG, REAL_SEED.id)), '146661d8145c4580');
    assert.equal(sha(formatSegmentTruth(realSeg('try-why-limits'), REAL_SEED.id)), '824f2f78bbd1d99e');
    assert.equal(sha(formatSegmentTruth(realSeg('worked-falling-ball'), REAL_SEED.id)), 'fd3a7c495e2f3827');
    // The withdrawn segment's text under ANOTHER plan id is not withdrawn.
    assert.equal(sha(formatSegmentTruth(WITHDRAWN_SEG, 'evelyn.some.other-plan.v1')), 'e0d3df6edb4ed600');
    assert.ok(!formatSegmentTruth(OK_SEG, REAL_SEED.id).includes(NO_VERIFIED_ANSWER_LINE));
  });

  await test('buildLessonPlanContext + formatLessonPlanContext: the <lesson_plan> dump carries no stored key', () => {
    const ctx = buildLessonPlanContext(REAL_SEED, 'try-compute', []);
    assert.ok(ctx);
    const cur = rec(ctx.currentSegment);
    assert.ok(!('expectedAnswer' in cur) && !('hints' in cur));
    assert.equal(cur.keyWithdrawn, true);
    const out = formatLessonPlanContext(ctx);
    assert.ok(!out.includes(storedKey.slice(0, 30)), 'stored key printed');
    assert.ok(!out.includes('expectedAnswer'));
    assert.ok(!out.includes('  hints:'));
    assert.ok(out.includes(String(cur.problem)));
    // A caller that hands the formatter the RAW segment is still covered.
    const raw = formatLessonPlanContext({ ...ctx, currentSegment: WITHDRAWN_SEG });
    assert.equal(raw, out);
  });

  await test('formatLessonPlanContext: non-withdrawn output is byte-identical to before', () => {
    for (const [id, pin] of [['try-define', 'ce1d3d390e0bcb15'], ['try-why-limits', '025a5b5c0070270c'], ['worked-falling-ball', '3c456982f8a2a0ae']] as const) {
      const ctx = buildLessonPlanContext(REAL_SEED, id, []);
      assert.ok(ctx);
      assert.equal(ctx.currentSegment, realSeg(id));
      assert.equal(sha(formatLessonPlanContext(ctx)), pin, id);
    }
  });

  await test('formatLessonPlanForRealtime: withdrawn prints no expected answer and the neutral line; others byte-identical', () => {
    const out = formatLessonPlanForRealtime(REAL_SEED, 'try-compute', []);
    assert.ok(out);
    assert.ok(!out.includes('Expected answer:'));
    assert.ok(!out.includes(storedKey.slice(0, 30)));
    assert.ok(out.includes(NO_VERIFIED_ANSWER_LINE));
    assert.ok(out.includes(`Authored problem (render verbatim): ${rec(WITHDRAWN_SEG).problem}`));
    for (const [id, pin] of [['try-define', '246375d1602429e6'], ['try-why-limits', '42d141a46cf98e76'], ['worked-falling-ball', '2546e2e9a9931694']] as const) {
      assert.equal(sha(formatLessonPlanForRealtime(REAL_SEED, id, []) ?? ''), pin, id);
    }
  });

  await test('planAuthoredFallback skips a withdrawn try-yourself and still serves a sibling', async () => {
    const withdrawnProblem = String(rec(WITHDRAWN_SEG).problem);
    // Anchor = the withdrawn problem itself: it would be the best token match.
    for (let i = 0; i < 5; i++) {
      const { result, lines } = await captureLogs(async () => planAuthoredFallback(REAL_SEED, withdrawnProblem, []));
      assert.ok(result, 'a non-withdrawn sibling should be served');
      assert.notEqual(result.trackingId, 'try-compute');
      assert.notEqual(result.canonicalText, withdrawnProblem);
      assert.ok(lines.includes(`[practice] withdrawn item skipped ${REAL_SEED.id}::try-compute`));
    }
    // Only the withdrawn try-yourself in the plan → nothing is served.
    const only = { ...REAL_SEED, segments: REAL_SEED.segments.filter((sg) => sg.kind !== 'try_yourself' || sg.id === 'try-compute') };
    assert.equal(planAuthoredFallback(only, withdrawnProblem, []), null);
    // Control: the same segments under a non-withdrawn plan id ARE served.
    const twin = { ...only, id: 'evelyn.some.other-plan.v1' };
    const served = planAuthoredFallback(twin, withdrawnProblem, []);
    assert.ok(served);
    assert.equal(served.trackingId, 'try-compute');
    assert.equal(served.expectedAnswer, storedKey);
  });

  await test('generate_problem anchor: a withdrawn segment\'s answer is not used as the anchor answer', () => {
    const withdrawnProblem = String(rec(WITHDRAWN_SEG).problem);
    assert.deepEqual(
      effectiveAnchor(REAL_SEED, { statement: `  ${withdrawnProblem.replace(/ /g, '  ')} `, expectedAnswer: storedKey, difficulty: 2 }),
      { statement: `  ${withdrawnProblem.replace(/ /g, '  ')} `, difficulty: 2 },
    );
    // Any other anchor is returned untouched (same reference).
    const other = { statement: String(rec(OK_SEG).problem), expectedAnswer: 'x' };
    assert.equal(effectiveAnchor(REAL_SEED, other), other);
    const twin = { ...REAL_SEED, id: 'evelyn.some.other-plan.v1' };
    const same = { statement: withdrawnProblem, expectedAnswer: storedKey };
    assert.equal(effectiveAnchor(twin, same), same);
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
})();
