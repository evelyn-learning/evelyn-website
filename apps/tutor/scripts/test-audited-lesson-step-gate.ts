/**
 * Audited lesson steps — EVERY step of a generated course plan is held to the
 * audited lesson-step list for an audited-only partner.
 *
 * Defect this pins (2026-10-10): for a partner on
 * PRACTICE_GEN_AUDITED_ONLY_PARTNERS only the steps skill scope drew from
 * objectives 2..N were gated. The objective-1 step of every skill, a step
 * asked for by its own objective (assigned practice asks per objective), the
 * step of an "expanded" plan (`E::P.lo-1-try`) and a topic-scope step were
 * served with a key nobody had audited — and the list builder refused
 * objective-1 ids, so they could not even be listed.
 *
 * Under test:
 *   - portal/audited-items.ts — the switch `TUTOR_PRACTICE_AUDITED_ALL_STEPS`
 *     (default ON), `withoutUnauditedLessonSteps` with an injected list;
 *   - portal/practice.ts — `isGeneratedCoursePlan` and `retrievePractice` on
 *     every path that serves a plan try-yourself: skill scope, one objective,
 *     an expanded plan, a misfiled gain (scripts/test-misfiled-practice-items.ts
 *     has more), topic scope;
 *   - the callers that draw through it: `buildAssessment`,
 *     `resolveAssignmentItems`, the generation anchor pool;
 *   - what must NOT change: another partner, an unknown caller, authored /
 *     private / student-owned plans, the switch off;
 *   - scripts/audit/build-audited-lesson-steps.ts — objective-1 ids and the
 *     `E::P.lo-K-…` form are accepted; the refusals.
 *
 * No database, no model: injected fakes and an injected audited list
 * (`RetrievePracticeOptions.auditedLessonSteps`), so nothing here depends on
 * what src/data/audited-lesson-steps.json holds today.
 *
 * Run:
 *   npm run test:audited-lesson-step-gate
 *   npx tsx scripts/test-audited-lesson-step-gate.ts
 */
// FIRST, before anything loads `@core/db`: no run of this file can reach a database.
import './lib/no-db-env';
import { strict as assert } from 'node:assert';
import {
  retrievePractice,
  isCourseSkillPlan,
  isGeneratedCoursePlan,
  isSkillScopePlan,
  type PracticeSources,
  type PlanLite,
  type RetrievePracticeOptions,
} from '@/lib/tutor/portal/practice';
import type { PracticeGenSources } from '@/lib/tutor/portal/practice-gen';
import {
  AUDITED_ALL_STEPS_ENV,
  AUDITED_LESSON_STEP_IDS,
  AUDITED_ONLY_PARTNERS_ENV,
  auditedAllStepsEnabled,
  withoutUnauditedLessonSteps,
} from '@/lib/tutor/portal/audited-items';
import { WITHDRAWN_ITEM_IDS } from '@/lib/tutor/portal/withdrawn-items';
import { buildAssessment } from '@/lib/tutor/portal/assessment';
import { resolveAssignmentItems, NO_GEN_SOURCES } from '@/lib/tutor/practice-assign/resolve';
import { buildAuditedLessonStepList, isExpandedPlanStep, lessonStepObjective } from './audit/build-audited-lesson-steps';
import type { RetrievePracticeRequest } from '@evelyn/portal-contract/v1';

const SKILL_FLAG = 'TUTOR_PRACTICE_SKILL_SCOPE';

let passed = 0;
let failed = 0;
async function test(name: string, fn: () => void | Promise<void>): Promise<void> {
  const log = console.log;
  try {
    console.log = () => {}; // the retrieval logs one line per skipped item
    await fn();
    console.log = log;
    passed++;
    console.log(`  ok - ${name}`);
  } catch (e) {
    console.log = log;
    failed++;
    console.log(`  FAIL - ${name}`);
    console.error(e);
  } finally {
    console.log = log;
    delete process.env.PRACTICE_GEN;
    delete process.env[SKILL_FLAG];
    delete process.env[AUDITED_ALL_STEPS_ENV];
    // Every test starts with the audited-only partner listed.
    process.env[AUDITED_ONLY_PARTNERS_ENV] = LISTED;
  }
}

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

/** The audited-only partner, and one that is not listed. */
const LISTED = 'greenapple';
const OTHER = 'partner-two';
process.env[AUDITED_ONLY_PARTNERS_ENV] = LISTED;

const lo = (planId: string, k: number) => `${planId}.lo-${k}`;
/** `<holder>::<owner>.lo-K-try` — holder ≠ owner for an expanded plan. */
const step = (planId: string, k: number, ownerPlanId = planId) => `${planId}::${ownerPlanId}.lo-${k}-try`;

/** A plan holding one try-yourself per objective of `ownerPlanId` (its own
 *  objectives unless it is an expanded plan built for another plan's). */
function plan(planId: string, objectives: number, over: Partial<PlanLite> = {}, ownerPlanId = planId): PlanLite {
  const los = Array.from({ length: objectives }, (_, i) => ({ id: lo(ownerPlanId, i + 1) }));
  const segments: PlanLite['segments'] = [];
  los.forEach((l, i) => {
    segments.push({ kind: 'concept', id: `${l.id}-concept` });
    segments.push({ kind: 'try_yourself', id: `${l.id}-try`, problem: `Objective ${i + 1}: compute ${i + 1} + ${i + 1}.`, expectedAnswer: String(2 * (i + 1)), responseFormat: 'numeric' });
  });
  return { id: planId, title: `Skill ${planId}`, topic: `Topic ${ownerPlanId}`, partnerId: LISTED, los, segments, ...over };
}

const A = 'gen-aaaaaaaa-0000-4000-8000-000000000001';
/** Picker plan P (objectives, no steps) and its expanded plan E (the text). */
const P = 'gen-pppppppp-0000-4000-8000-000000000002';
const E = 'gen-eeeeeeee-0000-4000-8000-000000000003';
const S = 'gen-11111111-0000-4000-8000-000000000004'; // single-objective course plan
const planA = plan(A, 3);
const picker: PlanLite = { ...plan(P, 3), segments: [{ kind: 'hook', id: 'intro' }, { kind: 'concept', id: 'picker' }] };
const expanded = plan(E, 3, {}, P);
const single = plan(S, 1);
/** Authored plan whose segment ids name its LOs. */
const authored: PlanLite = {
  id: 'authored-per-lo', topic: 'authored-topic',
  los: [{ id: 'auth.one' }, { id: 'auth.two' }],
  segments: [
    { kind: 'try_yourself', id: 'auth.one-try', problem: 'One?', expectedAnswer: '1' },
    { kind: 'try_yourself', id: 'auth.two-try', problem: 'Two?', expectedAnswer: '2' },
  ],
};

function sourcesOf(plans: PlanLite[]): PracticeSources {
  return {
    plansForLoId: async (loId) => plans.filter((p) => p.los.some((l) => l.id === loId)),
    plansForTopic: async (topicId) => plans.filter((p) => p.topic === topicId),
    bankForLoId: async () => [],
    bankForTopic: async () => [],
  };
}
const req = (loId: string, count = 50): RetrievePracticeRequest => ({ studentId: 'stu-1', courseId: 'course-1', scope: { loId }, count });
const ids = (r: { items: Array<{ id: string }> }) => r.items.map((i) => i.id);
/** Draw as `partnerId` with `listed` as the whole audited lesson-step list. */
const draw = (loId: string, plans: PlanLite[], listed: string[] = [], partnerId: string = LISTED, over: RetrievePracticeOptions = {}) =>
  retrievePractice(req(loId), sourcesOf(plans), NO_GEN_SOURCES, { partnerId }, { auditedLessonSteps: new Set(listed), ...over });
const stampedFor = (p: PlanLite, partnerId: string): PlanLite => ({ ...p, partnerId });

async function main(): Promise<void> {
  console.log('\nThe switch and the rule:\n');

  await test('TUTOR_PRACTICE_AUDITED_ALL_STEPS is default ON; only "off" disables', () => {
    assert.equal(AUDITED_ALL_STEPS_ENV, 'TUTOR_PRACTICE_AUDITED_ALL_STEPS');
    assert.equal(auditedAllStepsEnabled({}), true);
    assert.equal(auditedAllStepsEnabled({ [AUDITED_ALL_STEPS_ENV]: '' }), true);
    assert.equal(auditedAllStepsEnabled({ [AUDITED_ALL_STEPS_ENV]: 'on' }), true);
    assert.equal(auditedAllStepsEnabled({ [AUDITED_ALL_STEPS_ENV]: 'off' }), false);
    assert.equal(auditedAllStepsEnabled({ [AUDITED_ALL_STEPS_ENV]: ' OFF ' }), false);
  });

  await test('isGeneratedCoursePlan: a gen- plan that is not private and not student-owned — expanded and single-objective plans included', () => {
    for (const p of [planA, picker, expanded, single]) assert.equal(isGeneratedCoursePlan(p), true, p.id);
    // The expanded and the single-objective plan are NOT skill plans — which
    // is why the skill-scope gate never reached them.
    assert.equal(isCourseSkillPlan(expanded), false);
    assert.equal(isCourseSkillPlan(single), false);
    assert.equal(isSkillScopePlan(expanded, lo(P, 1)), false);
    assert.equal(isGeneratedCoursePlan(authored), false);
    assert.equal(isGeneratedCoursePlan(plan(A, 3, { privateKind: 'homework' })), false);
    assert.equal(isGeneratedCoursePlan(plan(A, 3, { privateKind: 'review' })), false);
    assert.equal(isGeneratedCoursePlan(plan(A, 3, { studentOwned: true })), false);
    assert.equal(isGeneratedCoursePlan(plan('rev-11111111', 2)), false);
    assert.equal(isGeneratedCoursePlan(plan('freestyle-1700000000000-abcd1234', 2)), false);
    assert.equal(isGeneratedCoursePlan({ ...planA, id: undefined }), false);
  });

  await test('withoutUnauditedLessonSteps: an injected list replaces the committed one; not listed partner ⇒ the same array', () => {
    const items = [{ id: step(A, 1) }, { id: step(A, 2) }];
    assert.deepEqual(withoutUnauditedLessonSteps(items, LISTED, 't'), []);
    assert.deepEqual(withoutUnauditedLessonSteps(items, LISTED, 't', new Set([step(A, 1)])), [{ id: step(A, 1) }]);
    assert.equal(withoutUnauditedLessonSteps(items, OTHER, 't', new Set()), items);
    assert.equal(withoutUnauditedLessonSteps(items, undefined, 't', new Set()), items);
    // Withdrawn wins over a listing.
    const w = [...WITHDRAWN_ITEM_IDS].find((id) => id.includes('::')) as string;
    assert.deepEqual(withoutUnauditedLessonSteps([{ id: w }], LISTED, 't', new Set([w])), []);
  });

  console.log('\nSkill scope:\n');

  await test('objective-1 step NOT listed → not served to the audited-only partner', async () => {
    assert.deepEqual(ids(await draw(lo(A, 1), [planA])), []);
    assert.deepEqual(ids(await draw(lo(A, 1), [planA], [step(A, 2), step(A, 3)])), [step(A, 2), step(A, 3)]);
  });

  await test('objective-1 step listed → served', async () => {
    assert.deepEqual(ids(await draw(lo(A, 1), [planA], [step(A, 1)])), [step(A, 1)]);
    const all = await draw(lo(A, 1), [planA], [step(A, 1), step(A, 2), step(A, 3)]);
    assert.deepEqual(ids(all), [step(A, 1), step(A, 2), step(A, 3)]);
    assert.ok(all.items.every((i) => i.loId === lo(A, 1) && i.source === 'plan-try-yourself'));
  });

  await test('the committed list is what applies when none is injected', async () => {
    const r = await retrievePractice(req(lo(A, 1)), sourcesOf([planA]), NO_GEN_SOURCES, { partnerId: LISTED });
    assert.deepEqual(ids(r), [], 'the fixture ids are on no committed list');
    assert.ok(!AUDITED_LESSON_STEP_IDS.has(step(A, 1)));
  });

  await test('another partner, and the same partner when not listed: served as before, list or no list', async () => {
    const theirs = stampedFor(planA, OTHER);
    assert.deepEqual(ids(await draw(lo(A, 1), [theirs], [], OTHER)), [step(A, 1), step(A, 2), step(A, 3)]);
    delete process.env[AUDITED_ONLY_PARTNERS_ENV];
    assert.deepEqual(ids(await draw(lo(A, 1), [planA])), [step(A, 1), step(A, 2), step(A, 3)]);
    // An unknown caller is served no partner-stamped plan at all (unchanged).
    assert.deepEqual(ids(await retrievePractice(req(lo(A, 1)), sourcesOf([planA]), NO_GEN_SOURCES, undefined, { auditedLessonSteps: new Set() })), []);
  });

  await test('switch off → as before: objective 1 is not gated, objectives 2..N are', async () => {
    process.env[AUDITED_ALL_STEPS_ENV] = 'off';
    assert.deepEqual(ids(await draw(lo(A, 1), [planA])), [step(A, 1)]);
    assert.deepEqual(ids(await draw(lo(A, 1), [planA], [step(A, 3)])), [step(A, 1), step(A, 3)]);
  });

  console.log('\nOne objective asked for:\n');

  await test('objective 1 alone (skill scope off) and a single-objective plan: unlisted → not served; listed → served', async () => {
    assert.deepEqual(ids(await draw(lo(S, 1), [single])), []);
    assert.deepEqual(ids(await draw(lo(S, 1), [single], [step(S, 1)])), [step(S, 1)]);
    process.env[SKILL_FLAG] = 'off';
    assert.deepEqual(ids(await draw(lo(A, 1), [planA])), []);
    assert.deepEqual(ids(await draw(lo(A, 1), [planA], [step(A, 1), step(A, 2)])), [step(A, 1)]);
  });

  await test('objective 2..N asked for directly (assigned practice asks per objective): held to the list as well', async () => {
    assert.deepEqual(ids(await draw(lo(A, 2), [planA])), []);
    assert.deepEqual(ids(await draw(lo(A, 2), [planA], [step(A, 2)])), [step(A, 2)]);
    assert.deepEqual(ids(await draw(lo(A, 2), [planA], [step(A, 1), step(A, 3)])), []);
  });

  await test('other partner / switch off: a single-objective request is exactly what it was', async () => {
    assert.deepEqual(ids(await draw(lo(S, 1), [stampedFor(single, OTHER)], [], OTHER)), [step(S, 1)]);
    assert.deepEqual(ids(await draw(lo(A, 2), [stampedFor(planA, OTHER)], [], OTHER)), [step(A, 2)]);
    process.env[AUDITED_ALL_STEPS_ENV] = 'off';
    assert.deepEqual(ids(await draw(lo(S, 1), [single])), [step(S, 1)]);
    assert.deepEqual(ids(await draw(lo(A, 2), [planA])), [step(A, 2)]);
    process.env[SKILL_FLAG] = 'off';
    assert.deepEqual(ids(await draw(lo(A, 1), [planA])), [step(A, 1)]);
  });

  console.log('\nExpanded plan (E holds the text for picker plan P\'s objectives):\n');

  await test('the skill request reads E for objective 1 only, and its id is E::P.lo-1-try', async () => {
    delete process.env[AUDITED_ONLY_PARTNERS_ENV];
    assert.deepEqual(ids(await draw(lo(P, 1), [picker, expanded])), [step(E, 1, P)]);
    assert.equal(step(E, 1, P), `${E}::${P}.lo-1-try`);
  });

  await test('E::P.lo-1-try unlisted → not served to the audited-only partner; listed → served; listing P::P or E::E does not serve it', async () => {
    assert.deepEqual(ids(await draw(lo(P, 1), [picker, expanded])), []);
    assert.deepEqual(ids(await draw(lo(P, 1), [picker, expanded], [step(P, 1), step(E, 1)])), []);
    const served = await draw(lo(P, 1), [picker, expanded], [step(E, 1, P)]);
    assert.deepEqual(ids(served), [step(E, 1, P)]);
    assert.equal(served.items[0].loId, lo(P, 1));
  });

  await test('E\'s step asked for by a later objective is gated the same way; other partner and switch off are unchanged', async () => {
    assert.deepEqual(ids(await draw(lo(P, 2), [picker, expanded])), []);
    assert.deepEqual(ids(await draw(lo(P, 2), [picker, expanded], [step(E, 2, P)])), [step(E, 2, P)]);
    const theirs = [stampedFor(picker, OTHER), stampedFor(expanded, OTHER)];
    assert.deepEqual(ids(await draw(lo(P, 1), theirs, [], OTHER)), [step(E, 1, P)]);
    process.env[AUDITED_ALL_STEPS_ENV] = 'off';
    assert.deepEqual(ids(await draw(lo(P, 1), [picker, expanded])), [step(E, 1, P)]);
    assert.deepEqual(ids(await draw(lo(P, 2), [picker, expanded])), [step(E, 2, P)]);
  });

  console.log('\nOther paths that draw plan try-yourselves:\n');

  await test('topic scope: a generated course plan\'s steps are held to the list', async () => {
    const topic = (listed: string[], partnerId = LISTED, plans = [planA]) =>
      retrievePractice({ studentId: 's', courseId: 'c', scope: { topicId: `Topic ${A}` }, count: 50 }, sourcesOf(plans), NO_GEN_SOURCES, { partnerId }, { auditedLessonSteps: new Set(listed) });
    assert.deepEqual(ids(await topic([])), []);
    assert.deepEqual(ids(await topic([step(A, 2)])), [step(A, 2)]);
    assert.deepEqual(ids(await topic([], OTHER, [stampedFor(planA, OTHER)])), [step(A, 1), step(A, 2), step(A, 3)]);
    process.env[AUDITED_ALL_STEPS_ENV] = 'off';
    assert.deepEqual(ids(await topic([])), [step(A, 1), step(A, 2), step(A, 3)]);
  });

  await test('a misfiled gain of the objective-1 step is held to the list', async () => {
    const marks = new Map<string, string | null>([[step(A, 1), lo(A, 2)]]);
    assert.deepEqual(ids(await draw(lo(A, 2), [planA], [step(A, 2)], LISTED, { misfiledMarks: marks })), [step(A, 2)]);
    assert.deepEqual(ids(await draw(lo(A, 2), [planA], [step(A, 1), step(A, 2)], LISTED, { misfiledMarks: marks })), [step(A, 2), step(A, 1)]);
    process.env[AUDITED_ALL_STEPS_ENV] = 'off';
    assert.deepEqual(ids(await draw(lo(A, 2), [planA], [], LISTED, { misfiledMarks: marks })), [step(A, 2), step(A, 1)]);
  });

  await test('assessment (buildAssessment) and assigned practice (resolveAssignmentItems) draw through the same gate', async () => {
    // Neither can inject a list: the committed one applies, and it holds none
    // of the fixture ids — so the listed partner gets nothing, another all.
    const set = await buildAssessment({ studentId: 's', courseId: 'c', loIds: [lo(A, 1), lo(S, 1), lo(P, 1)], maxPerLo: 4 }, sourcesOf([planA, single, picker, expanded]), NO_GEN_SOURCES, { partnerId: LISTED });
    assert.deepEqual(set.items, []);
    const hw = await resolveAssignmentItems(
      { los: [{ loId: lo(A, 1), title: 'A' }, { loId: lo(A, 2), title: 'A2' }, { loId: lo(S, 1), title: 'S' }], band: 'developing' as never, seenItemIds: [], studentId: 's', courseId: 'c' },
      { ...sourcesOf([planA, single]), caller: { partnerId: LISTED } },
    );
    assert.deepEqual(hw, []);

    const theirs = [planA, single, picker, expanded].map((p) => stampedFor(p, OTHER));
    const open = await buildAssessment({ studentId: 's', courseId: 'c', loIds: [lo(A, 1), lo(S, 1), lo(P, 1)], maxPerLo: 4 }, sourcesOf(theirs), NO_GEN_SOURCES, { partnerId: OTHER });
    assert.deepEqual(open.items.map((i) => i.itemId), [step(A, 1), step(A, 2), step(A, 3), step(S, 1), step(E, 1, P)]);
    const hwOpen = await resolveAssignmentItems(
      { los: [{ loId: lo(S, 1), title: 'S' }], band: 'developing' as never, seenItemIds: [], studentId: 's', courseId: 'c' },
      { ...sourcesOf(theirs), caller: { partnerId: OTHER } },
    );
    assert.deepEqual(hwOpen.map((l) => l.items.map((i) => i.id)), [[step(S, 1)]]);
  });

  await test('generation anchors: nothing is generated for the listed partner, so an unaudited step is never an anchor', async () => {
    process.env.PRACTICE_GEN = 'on';
    let calls = 0;
    const gen: PracticeGenSources = {
      async generateAndVerify() { calls++; return null; },
      async reserve() { calls++; return 2; },
      async persist() {},
    };
    const r = await retrievePractice(req(lo(S, 1)), sourcesOf([single]), gen, { partnerId: LISTED }, { auditedLessonSteps: new Set() });
    assert.deepEqual(ids(r), []);
    assert.equal(r.emptyReason, 'none_available');
    assert.equal(calls, 0);
  });

  console.log('\nPlans the gate does not apply to:\n');

  await test('authored, private and student-owned plans are served to the audited-only partner exactly as before', async () => {
    assert.deepEqual(ids(await draw('auth.one', [authored])), ['authored-per-lo::auth.one-try']);
    // A student's own material (gen- id, owner-stamped) and a homework plan
    // reached through its own plan-scoped LO.
    const mine = plan(A, 2, { studentOwned: true });
    assert.deepEqual(ids(await draw(lo(A, 1), [mine])), [step(A, 1)]);
    assert.deepEqual(ids(await draw(lo(A, 2), [mine])), [step(A, 2)]);
    const hw = plan(A, 2, { privateKind: 'homework' });
    assert.deepEqual(ids(await draw(lo(A, 1), [hw])), [step(A, 1)]);
    const free = plan('freestyle-1700000000000-abcd1234', 2);
    assert.deepEqual(ids(await draw(free.los[0].id, [free])), [`${free.id}::${free.los[0].id}-try`]);
  });

  console.log('\nThe list builder:\n');

  await test('accepts objective-1 ids and the E::P.lo-K-… form; output sorted', () => {
    const none = new Set<string>();
    const input = [step(E, 2, P), step(A, 2), step(A, 1), step(E, 1, P), step(S, 1)];
    const list = buildAuditedLessonStepList(input, '2026-10-10', 's', none);
    assert.deepEqual(Object.keys(list.items), [...input].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0)));
    assert.ok(Object.values(list.items).every((v) => v === 'AUDITED'));
    assert.equal(lessonStepObjective(step(A, 1)), 1);
    assert.equal(lessonStepObjective(step(E, 1, P)), 1);
    assert.equal(lessonStepObjective(step(E, 4, P)), 4);
    assert.equal(lessonStepObjective(`${A}::${lo(A, 12)}-try2`), 12);
    assert.equal(isExpandedPlanStep(step(E, 1, P)), true);
    assert.equal(isExpandedPlanStep(step(A, 1)), false);
    assert.equal(isExpandedPlanStep('alg1-linear-equations::try-1'), false);
  });

  await test('refuses: a non-gen plan id on either side, no objective, objective 0, bank ids, duplicates, withdrawn', () => {
    const none = new Set<string>();
    const refuse = (id: string, why: RegExp, withdrawn: ReadonlySet<string> = none) =>
      assert.throws(() => buildAuditedLessonStepList([id], 'd', 's', withdrawn), why, id);
    const shape = /not a generated-plan lesson step/;
    refuse(`${A}::authored.lo-1-try`, shape);
    refuse(`authored-plan::${lo(A, 1)}-try`, shape);
    refuse(`rev-11111111::${lo(A, 1)}-try`, shape);
    refuse(`${E}::freestyle-1700000000000-abcd1234.lo-1-try`, shape);
    refuse('alg1-linear-equations::try-1', shape);
    refuse(`${A}::try-1`, shape);
    refuse(`${A}::${A}.lo-0-try`, shape);
    refuse(`${A}::${A}.lo-x-try`, shape);
    refuse(`${A}::${A}.lo-1`, shape);
    refuse(`${A}::${A}.homework-lo-1-try`, shape);
    refuse(`practice-gen.${lo(A, 1)}.abc`, shape);
    refuse(lo(A, 1), shape);
    refuse('', /empty id/);
    assert.throws(() => buildAuditedLessonStepList([step(A, 1), step(A, 1)], 'd', 's', none), /duplicate/);
    assert.throws(() => buildAuditedLessonStepList([step(E, 1, P), step(E, 1, P)], 'd', 's', none), /duplicate/);
    refuse(step(A, 1), /withdrawn/, new Set([step(A, 1)]));
    refuse(step(E, 1, P), /withdrawn/, new Set([step(E, 1, P)]));
    // A real withdrawn objective-1 step is refused against the committed list.
    const real = [...WITHDRAWN_ITEM_IDS].find((id) => lessonStepObjective(id) === 1);
    assert.ok(real, 'fixture: a withdrawn objective-1 step');
    refuse(real as string, /withdrawn/, WITHDRAWN_ITEM_IDS);
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
