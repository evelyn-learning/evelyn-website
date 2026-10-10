/**
 * Misfiled practice items — an older item filed under one objective of a
 * skill (nearly always its first, an "understand / define" objective) that
 * actually tests a neighbouring objective of the same skill is MARKED with
 * the objective it tests. Nothing is re-filed or deleted.
 *
 * Under test:
 *   - src/data/misfiled-practice-items.json (the committed marks) and
 *     scripts/audit/build-misfiled-list.ts (its builder);
 *   - portal/misfiled-items.ts — the flag `TUTOR_PRACTICE_MISFILED_MARKS`
 *     (default ON, `off` only), the pure selection rules;
 *   - portal/practice.ts `retrievePractice`:
 *       · a request for ONE objective skips an item marked for another
 *         objective (or for none) and gains the items marked for it that are
 *         filed under another objective of the same skill plan — through the
 *         withdrawn / audited gates, never from another plan;
 *       · a SKILL request returns the same items, with the same id and
 *         `loId`, and only the objective spread reads the mark;
 *       · flag off ⇒ exactly the behaviour without marks.
 *
 * No database, no model: injected fakes; marks are injected through
 * `RetrievePracticeOptions.misfiledMarks` (production uses the committed list).
 *
 * Run:  npm run test:misfiled-practice-items
 */
// FIRST, before anything loads `@core/db`: no run of this file can reach a database.
import './lib/no-db-env';
import { strict as assert } from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import {
  retrievePractice,
  type PracticeSources,
  type PlanLite,
  type BankLite,
  type RetrievePracticeOptions,
} from '@/lib/tutor/portal/practice';
import {
  MISFILED_ITEM_MARKS,
  MISFILED_MARKS_ENV,
  idsMarkedFor,
  misfiledMarksEnabled,
  spreadObjectiveOf,
  withoutMisfiledFor,
  type MisfiledMarks,
} from '@/lib/tutor/portal/misfiled-items';
import { AUDITED_ALL_STEPS_ENV, AUDITED_GENERATED_ITEM_IDS, AUDITED_LESSON_STEP_IDS, AUDITED_ONLY_PARTNERS_ENV } from '@/lib/tutor/portal/audited-items';
import { WITHDRAWN_ITEM_IDS } from '@/lib/tutor/portal/withdrawn-items';
import { NO_GEN_SOURCES } from '@/lib/tutor/practice-assign/resolve';
import { buildMisfiledList, filedObjectiveOfItemId, readMisfiledRows, type MisfiledRow } from './audit/build-misfiled-list';
import type { RetrievePracticeRequest } from '@evelyn/portal-contract/v1';

const FLAG = 'TUTOR_PRACTICE_MISFILED_MARKS';
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
    delete process.env[FLAG];
    delete process.env[SKILL_FLAG];
    delete process.env[AUDITED_ONLY_PARTNERS_ENV];
    delete process.env[AUDITED_ALL_STEPS_ENV];
    delete process.env.PRACTICE_GEN;
  }
}

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const P1 = 'partner-one';
const A = 'gen-aaaaaaaa-0000-4000-8000-000000000001';
const B = 'gen-bbbbbbbb-0000-4000-8000-000000000002';
const lo = (planId: string, k: number) => `${planId}.lo-${k}`;
const step = (planId: string, k: number) => `${planId}::${planId}.lo-${k}-try`;
const gen = (planId: string, k: number, hash: string) => `practice-gen.${planId}.lo-${k}.${hash}`;

function genPlan(planId: string, objectives: number, over: Partial<PlanLite> = {}): PlanLite {
  const los = Array.from({ length: objectives }, (_, i) => ({ id: lo(planId, i + 1) }));
  const segments: PlanLite['segments'] = [];
  los.forEach((l, i) => {
    segments.push({ kind: 'concept', id: `${l.id}-concept` });
    segments.push({ kind: 'try_yourself', id: `${l.id}-try`, problem: `Objective ${i + 1}: compute ${i + 1} + ${i + 1}.`, expectedAnswer: String(2 * (i + 1)), responseFormat: 'numeric' });
  });
  return { id: planId, title: `Skill ${planId}`, topic: `Topic ${planId}`, partnerId: P1, los, segments, ...over };
}
const bankRow = (id: string, loId: string, over: Partial<BankLite> = {}): BankLite => ({
  id, problemText: `Bank ${id}`, answer: '1', responseFormat: 'numeric', loId, ...over,
});
function sourcesOf(plans: PlanLite[], bank: BankLite[] = [], calls?: string[]): PracticeSources {
  return {
    plansForLoId: async (loId) => plans.filter((p) => p.los.some((l) => l.id === loId)),
    plansForTopic: async (topicId) => plans.filter((p) => p.topic === topicId),
    bankForLoId: async (loId, difficulty) => {
      calls?.push(loId);
      return bank.filter((b) => b.loId === loId && (!difficulty || b.difficulty === difficulty));
    },
    bankForTopic: async () => [],
  };
}
const req = (loId: string, count = 50, excludeIds?: string[]): RetrievePracticeRequest => ({
  studentId: 'stu-1', courseId: 'course-1', scope: { loId }, count, ...(excludeIds ? { excludeIds } : {}),
});
const ids = (r: { items: Array<{ id: string }> }) => r.items.map((i) => i.id);
const draw = (loId: string, sources: PracticeSources, marks: MisfiledMarks | undefined, count = 50, partnerId: string | undefined = P1, excludeIds?: string[]) => {
  const options: RetrievePracticeOptions = marks ? { misfiledMarks: marks } : {};
  return retrievePractice(req(loId, count, excludeIds), sources, NO_GEN_SOURCES, partnerId ? { partnerId } : undefined, options);
};

// Skill A: 4 objectives. Bank: three rows filed under lo-1 (one fits, one
// really tests lo-2, one really tests lo-3), two under lo-2, one under lo-3.
const planA = genPlan(A, 4);
const planB = genPlan(B, 3);
const A1_FIT = gen(A, 1, 'fit');
const A1_IS2 = gen(A, 1, 'is2');
const A1_IS3 = gen(A, 1, 'is3');
const A1_OFF = gen(A, 1, 'off');
const A2_X = gen(A, 2, 'x');
const A2_Y = gen(A, 2, 'y');
const A3_X = gen(A, 3, 'x');
const B1_X = gen(B, 1, 'x');
const bankA: BankLite[] = [
  bankRow(A1_FIT, lo(A, 1)), bankRow(A1_IS2, lo(A, 1)), bankRow(A1_IS3, lo(A, 1)), bankRow(A1_OFF, lo(A, 1)),
  bankRow(A2_X, lo(A, 2)), bankRow(A2_Y, lo(A, 2)), bankRow(A3_X, lo(A, 3)),
  bankRow(B1_X, lo(B, 1)),
];
/** lo-1's own lesson step really tests lo-2 as well. */
const MARKS: MisfiledMarks = new Map<string, string | null>([
  [A1_IS2, lo(A, 2)],
  [A1_IS3, lo(A, 3)],
  [A1_OFF, null],
  [step(A, 1), lo(A, 2)],
  ['practice-gen.gen-no-such-plan.lo-1.zzz', 'gen-no-such-plan.lo-2'], // unknown id
]);
const srcA = () => sourcesOf([planA, planB], bankA);

(async () => {
  console.log('misfiled practice items');

  // -------------------------------------------------------------------------
  // The committed list + its builder
  // -------------------------------------------------------------------------
  const file = path.join(__dirname, '..', 'src', 'data', 'misfiled-practice-items.json');
  const data = JSON.parse(fs.readFileSync(file, 'utf8')) as { generatedAt: string; source: string; items: Record<string, string | null> };

  await test('the JSON holds exactly 344 marks: sorted, each target another objective of the SAME skill, 3 marked null', () => {
    assert.equal(data.generatedAt, '2026-10-17');
    assert.equal(Object.keys(data.items).length, 344);
    assert.deepEqual(Object.keys(data.items), [...Object.keys(data.items)].sort(), 'ids are sorted');
    let nulls = 0;
    for (const [id, target] of Object.entries(data.items)) {
      const filed = filedObjectiveOfItemId(id);
      assert.ok(filed, `no filed objective readable from ${id}`);
      if (target === null) { nulls++; continue; }
      const skill = (filed as string).slice(0, (filed as string).lastIndexOf('.lo-'));
      assert.match(target, /^gen-[0-9a-f-]{36}\.lo-\d+$/, id);
      assert.ok(target.startsWith(`${skill}.lo-`), `${id}: target ${target} is not in skill ${skill}`);
      assert.notEqual(target, filed, id);
    }
    assert.equal(nulls, 3);
    assert.equal(MISFILED_ITEM_MARKS.size, 344);
  });

  await test('no marked id is on the withdrawn list; every marked generated row is on the audited list', () => {
    assert.deepEqual(Object.keys(data.items).filter((id) => WITHDRAWN_ITEM_IDS.has(id)), []);
    const generated = Object.keys(data.items).filter((id) => id.startsWith('practice-gen.'));
    assert.equal(generated.length, 329);
    assert.deepEqual(generated.filter((id) => !AUDITED_GENERATED_ITEM_IDS.has(id)), []);
  });

  await test('builder: rebuilding from the reviewed input reproduces the committed file byte for byte', () => {
    const csvPath = path.join(__dirname, '..', '..', '..', '..', '..', '..', 'docs', 'whitelabel', 'greenapple', 'integration', 'misfiled-audit-2026-10-16', 'resolved-ids.csv');
    if (!fs.existsSync(csvPath)) { console.log('    (reviewed input not present in this checkout — skipped)'); return; }
    const rebuilt = buildMisfiledList(readMisfiledRows(fs.readFileSync(csvPath, 'utf8'), csvPath), data.generatedAt, data.source, WITHDRAWN_ITEM_IDS);
    assert.equal(JSON.stringify(rebuilt, null, 2) + '\n', fs.readFileSync(file, 'utf8'));
  });

  await test('builder: reads the filed objective off a bank id, a lesson-step id and an expanded-plan step id', () => {
    assert.equal(filedObjectiveOfItemId(gen(A, 1, 'abc')), lo(A, 1));
    assert.equal(filedObjectiveOfItemId(step(A, 3)), lo(A, 3));
    assert.equal(filedObjectiveOfItemId(`${B}::${A}.lo-2-try`), lo(A, 2)); // expanded plan B carries picker plan A's objective ids
    assert.equal(filedObjectiveOfItemId('alg1-authored-001'), null);
    assert.equal(filedObjectiveOfItemId('plan::try-1'), null);
  });

  await test('builder: sorted output, `none` ⇒ null, CSV with quoted cells', () => {
    const csv = `id,filedUnder,shouldBe,match,subject,question\n${gen(B, 1, 'q')},${lo(B, 1)},none,exact,X,"a, b"\n${gen(A, 1, 'q')},${lo(A, 1)},${lo(A, 3)},exact,X,q\n`;
    assert.deepEqual(buildMisfiledList(readMisfiledRows(csv, 'x.csv'), '2026-10-17', 'src', new Set()), {
      generatedAt: '2026-10-17', source: 'src', items: { [gen(A, 1, 'q')]: lo(A, 3), [gen(B, 1, 'q')]: null },
    });
  });

  await test('builder: refuses a withdrawn id, a target in another skill, a target equal to the filed objective, a wrong filedUnder, a duplicate, a blank target, an unreadable id', () => {
    const row = (over: Partial<MisfiledRow> = {}): MisfiledRow => ({ id: gen(A, 1, 'q'), filedUnder: lo(A, 1), shouldBe: lo(A, 2), ...over });
    const build = (rows: MisfiledRow[], withdrawn: string[] = []) => buildMisfiledList(rows, '2026-10-17', 's', new Set(withdrawn));
    assert.doesNotThrow(() => build([row()]));
    assert.throws(() => build([row()], [gen(A, 1, 'q')]), /withdrawn/);
    assert.throws(() => build([row({ shouldBe: lo(B, 2) })]), /not in the same skill/);
    assert.throws(() => build([row({ shouldBe: `${A}.lo-2-try` })]), /not in the same skill/);
    assert.throws(() => build([row({ shouldBe: lo(A, 1) })]), /same as the objective it is filed under/);
    assert.throws(() => build([row({ filedUnder: lo(A, 2) })]), /filedUnder/);
    assert.throws(() => build([row(), row()]), /duplicate/);
    assert.throws(() => build([row({ shouldBe: '' })]), /shouldBe/);
    assert.throws(() => build([row({ id: 'alg1-authored-001' })]), /no objective/);
    assert.throws(() => build([row({ id: '' })]), /empty id/);
    assert.throws(() => readMisfiledRows('id,filedUnder\na,b\n', 'x.csv'), /shouldBe/);
  });

  // -------------------------------------------------------------------------
  // The flag
  // -------------------------------------------------------------------------
  await test('TUTOR_PRACTICE_MISFILED_MARKS: default ON; only `off` turns it off; read at call time', () => {
    assert.equal(MISFILED_MARKS_ENV, FLAG);
    assert.equal(misfiledMarksEnabled({}), true);
    assert.equal(misfiledMarksEnabled({ [FLAG]: '' }), true);
    assert.equal(misfiledMarksEnabled({ [FLAG]: 'on' }), true);
    assert.equal(misfiledMarksEnabled({ [FLAG]: 'false' }), true);
    assert.equal(misfiledMarksEnabled({ [FLAG]: 'off' }), false);
    assert.equal(misfiledMarksEnabled({ [FLAG]: ' OFF ' }), false);
    assert.equal(misfiledMarksEnabled(), true);
    process.env[FLAG] = 'off';
    assert.equal(misfiledMarksEnabled(), false);
    delete process.env[FLAG];
    assert.equal(misfiledMarksEnabled(), true);
  });

  // -------------------------------------------------------------------------
  // The pure rules
  // -------------------------------------------------------------------------
  await test('withoutMisfiledFor: drops an item marked for another objective or for none; keeps unmarked items and items marked for this one', () => {
    const items = [A1_FIT, A1_IS2, A1_IS3, A1_OFF, step(A, 1)].map((id) => ({ id }));
    assert.deepEqual(ids({ items: withoutMisfiledFor(items, lo(A, 1), MARKS) }), [A1_FIT]);
    assert.deepEqual(ids({ items: withoutMisfiledFor(items, lo(A, 2), MARKS) }), [A1_FIT, A1_IS2, step(A, 1)]);
    const none = new Map<string, string | null>();
    assert.equal(withoutMisfiledFor(items, lo(A, 1), none), items, 'nothing marked ⇒ the same array');
  });

  await test('idsMarkedFor: exactly the ids whose mark is this objective', () => {
    assert.deepEqual([...idsMarkedFor(lo(A, 2), MARKS)].sort(), [A1_IS2, step(A, 1)].sort());
    assert.deepEqual([...idsMarkedFor(lo(A, 3), MARKS)], [A1_IS3]);
    assert.equal(idsMarkedFor(lo(A, 4), MARKS).size, 0);
    assert.equal(idsMarkedFor(lo(A, 1), MARKS).size, 0);
    // The committed list, through its cached index.
    const [someId, someTarget] = [...MISFILED_ITEM_MARKS].find(([, t]) => t !== null) as [string, string];
    assert.ok(idsMarkedFor(someTarget, MISFILED_ITEM_MARKS).has(someId));
    assert.equal(idsMarkedFor('constructor', MISFILED_ITEM_MARKS).size, 0);
  });

  await test('spreadObjectiveOf: the marked objective when it is one of the skill\'s; otherwise the filed one', () => {
    const objectives = [1, 2, 3, 4].map((k) => lo(A, k));
    assert.equal(spreadObjectiveOf(A1_IS2, lo(A, 1), objectives, MARKS), lo(A, 2));
    assert.equal(spreadObjectiveOf(A1_FIT, lo(A, 1), objectives, MARKS), lo(A, 1));
    assert.equal(spreadObjectiveOf(A1_OFF, lo(A, 1), objectives, MARKS), lo(A, 1), 'marked null ⇒ stays where it is filed');
    assert.equal(spreadObjectiveOf(A1_IS2, lo(A, 1), [lo(A, 1)], MARKS), lo(A, 1), 'a target outside the skill is ignored');
  });

  // -------------------------------------------------------------------------
  // A request for ONE objective
  // -------------------------------------------------------------------------
  await test('objective 2: gains the lo-1 bank row and the lo-1 lesson step marked for it; id and loId are the item\'s own', async () => {
    const res = await draw(lo(A, 2), srcA(), MARKS);
    assert.deepEqual(ids(res).sort(), [A2_X, A2_Y, A1_IS2, step(A, 2), step(A, 1)].sort());
    const byId = new Map(res.items.map((it) => [it.id, it]));
    assert.equal(byId.get(A1_IS2)?.loId, lo(A, 1), 'a gained bank row keeps the loId it is filed under');
    assert.equal(byId.get(step(A, 1))?.loId, lo(A, 1), 'a gained step keeps the loId it is filed under');
    assert.equal(byId.get(A2_X)?.loId, lo(A, 2));
    assert.equal(byId.get(A1_IS2)?.source, 'bank');
    assert.equal(byId.get(step(A, 1))?.source, 'plan-try-yourself');
    // Own items first, gained after — within bank and within steps.
    assert.deepEqual(ids(res), [A2_X, A2_Y, A1_IS2, step(A, 2), step(A, 1)]);
  });

  await test('objective 3 gains only what is marked for objective 3; objective 4 (nothing marked) is unchanged and makes no extra bank read', async () => {
    assert.deepEqual(ids(await draw(lo(A, 3), srcA(), MARKS)), [A3_X, A1_IS3, step(A, 3)]);
    const calls: string[] = [];
    assert.deepEqual(ids(await draw(lo(A, 4), sourcesOf([planA, planB], bankA, calls), MARKS)), [step(A, 4)]);
    assert.deepEqual(calls, [lo(A, 4)]);
  });

  await test('objective 1 asked for ALONE (skill scope off): the marked items are skipped, including the one marked null', async () => {
    process.env[SKILL_FLAG] = 'off';
    assert.deepEqual(ids(await draw(lo(A, 1), srcA(), MARKS)), [A1_FIT]);
    // …and objective 2 still gains them.
    assert.deepEqual(ids(await draw(lo(A, 2), srcA(), MARKS)).sort(), [A2_X, A2_Y, A1_IS2, step(A, 2), step(A, 1)].sort());
  });

  await test('a gained item respects excludeIds, the difficulty filter and count like any other', async () => {
    assert.deepEqual(ids(await draw(lo(A, 2), srcA(), MARKS, 50, P1, [A1_IS2, A2_X])), [A2_Y, step(A, 2), step(A, 1)]);
    assert.equal((await draw(lo(A, 2), srcA(), MARKS, 2)).items.length, 2);
    const bank = [bankRow(A1_IS2, lo(A, 1), { difficulty: 4 }), bankRow(A2_X, lo(A, 2), { difficulty: 2 })];
    const res = await retrievePractice({ ...req(lo(A, 2)), difficulty: 2 }, sourcesOf([planA], bank), NO_GEN_SOURCES, { partnerId: P1 }, { misfiledMarks: MARKS });
    assert.ok(!ids(res).includes(A1_IS2), 'the difficulty filter applies to the gained row');
    assert.ok(ids(res).includes(A2_X));
  });

  await test('never from another skill or plan: a mark cannot pull in a row or step filed outside the requested objective\'s own plan', async () => {
    // Hostile / mistaken marks: plan B's items "marked" as testing A.lo-2.
    const cross: MisfiledMarks = new Map<string, string | null>([[B1_X, lo(A, 2)], [step(B, 1), lo(A, 2)]]);
    const calls: string[] = [];
    const res = await draw(lo(A, 2), sourcesOf([planA, planB], bankA, calls), cross);
    assert.deepEqual(ids(res), [A2_X, A2_Y, step(A, 2)]);
    assert.ok(calls.every((c) => c.startsWith(`${A}.`)), `bank read outside plan A: ${calls.join(', ')}`);
    // A source that answers a sibling read with a row filed elsewhere: not gained.
    const leaky: PracticeSources = { ...sourcesOf([planA], bankA), bankForLoId: async (loId) => (loId === lo(A, 2) ? [bankRow(A2_X, lo(A, 2))] : [bankRow(B1_X, lo(B, 1))]) };
    assert.deepEqual(ids(await draw(lo(A, 2), leaky, cross)), [A2_X, step(A, 2)]);
  });

  await test('expanded plan: a step stored in the expanded plan under the skill plan\'s objective ids is skipped and gained the same way', async () => {
    // The picker plan A holds the objectives and no steps; plan E (its own
    // id, A's objective ids) holds the lesson. Item id = `E::A.lo-K-try`.
    const E = 'gen-eeeeeeee-0000-4000-8000-00000000000e';
    const picker: PlanLite = { ...genPlan(A, 4), segments: [] };
    const expanded: PlanLite = { ...genPlan(A, 3), id: E };
    const eStep = (k: number) => `${E}::${A}.lo-${k}-try`;
    const m: MisfiledMarks = new Map<string, string | null>([[eStep(1), lo(A, 2)]]);
    const src = () => sourcesOf([picker, expanded, planB], bankA);
    assert.deepEqual(ids(await draw(lo(A, 2), src(), m)), [A2_X, A2_Y, eStep(2), eStep(1)]);
    assert.deepEqual(ids(await draw(lo(A, 3), src(), m)), [A3_X, eStep(3)]);
    // Skill request for the picker's first objective: same items either way.
    assert.deepEqual(ids(await draw(lo(A, 1), src(), m)).sort(), ids(await draw(lo(A, 1), src(), new Map())).sort());
    process.env[SKILL_FLAG] = 'off';
    assert.ok(!ids(await draw(lo(A, 1), src(), m)).includes(eStep(1)));
    assert.ok(ids(await draw(lo(A, 1), src(), new Map())).includes(eStep(1)));
  });

  await test('another partner\'s plan, a private plan and an authored plan give and gain nothing', async () => {
    // Partner two may not see plan A, so there is no skill plan to name the
    // sibling objectives: nothing is gained (fail closed).
    assert.deepEqual(ids(await draw(lo(A, 2), srcA(), MARKS, 50, 'partner-two')), [A2_X, A2_Y]);
    assert.deepEqual(ids(await draw(lo(A, 2), sourcesOf([genPlan(A, 4, { privateKind: 'homework' })], bankA), MARKS)), [A2_X, A2_Y, step(A, 2)], 'a private plan is not a course skill');
    const auth: PlanLite = { id: 'authored-per-lo', los: [{ id: 'auth.one' }, { id: 'auth.two' }], segments: [
      { kind: 'try_yourself', id: 'auth.one-try', problem: 'One?', expectedAnswer: '1' },
      { kind: 'try_yourself', id: 'auth.two-try', problem: 'Two?', expectedAnswer: '2' },
    ] };
    const m: MisfiledMarks = new Map<string, string | null>([['authored-per-lo::auth.one-try', 'auth.two']]);
    // The step is skipped under auth.one (it is marked), and is NOT gained by
    // auth.two: only a generated course skill plan gains.
    assert.deepEqual(ids(await draw('auth.two', sourcesOf([auth]), m, 50, undefined)), ['authored-per-lo::auth.two-try']);
  });

  await test('withdrawn wins: a marked item that is also withdrawn is never gained', async () => {
    const wGen = [...WITHDRAWN_ITEM_IDS].find((id) => /^practice-gen\.gen-[0-9a-f-]{36}\.lo-1\./.test(id)) as string;
    const wStep = [...WITHDRAWN_ITEM_IDS].find((id) => { const p = id.slice(0, id.indexOf('::')); return id === `${p}::${p}.lo-1-try`; }) as string;
    assert.ok(wGen && wStep, 'fixture: withdrawn ids');
    for (const [id, planId] of [[wGen, /^practice-gen\.(gen-[0-9a-f-]{36})/.exec(wGen)?.[1] as string], [wStep, wStep.slice(0, wStep.indexOf('::'))]] as const) {
      const plan = genPlan(planId, 3);
      const marks: MisfiledMarks = new Map<string, string | null>([[id, lo(planId, 2)]]);
      const res = await draw(lo(planId, 2), sourcesOf([plan], [bankRow(wGen, lo(planId, 1))]), marks);
      assert.ok(!ids(res).includes(id), `${id} served`);
      assert.ok(ids(res).includes(step(planId, 2)));
    }
  });

  await test('audited-only partner: a gained generated row must be on the audited list; a step — own or gained, objective 1 included — must be on the audited step list', async () => {
    process.env[AUDITED_ONLY_PARTNERS_ENV] = P1;
    const withList = (loId: string, src: PracticeSources, marks: MisfiledMarks, list: string[]) =>
      retrievePractice(req(loId), src, NO_GEN_SOURCES, { partnerId: P1 }, { misfiledMarks: marks, auditedLessonSteps: new Set(list) });
    // A1_IS2 is not on the audited list ⇒ not served to the listed partner;
    // nor is either step (2026-10-10: the objective-1 step is gated too, and
    // so is the requested objective's own step).
    assert.deepEqual(ids(await draw(lo(A, 2), srcA(), MARKS)), [], 'unaudited generated rows and unaudited steps (own and gained) are dropped');
    assert.deepEqual(ids(await withList(lo(A, 2), srcA(), MARKS, [step(A, 1)])), [step(A, 1)], 'the gained objective-1 step is served once it is listed');
    assert.deepEqual(ids(await withList(lo(A, 2), srcA(), MARKS, [step(A, 2)])), [step(A, 2)]);
    // The older rule (switch off): neither of these two steps was gated.
    process.env[AUDITED_ALL_STEPS_ENV] = 'off';
    assert.deepEqual(ids(await draw(lo(A, 2), srcA(), MARKS)), [step(A, 2), step(A, 1)], 'switch off: the own step and the objective-1 step are not gated');
    delete process.env[AUDITED_ALL_STEPS_ENV];
    // A real audited generated row, filed under its plan's lo-1, marked for lo-2.
    const real = [...AUDITED_GENERATED_ITEM_IDS].find((id) => /^practice-gen\.gen-[0-9a-f-]{36}\.lo-1\./.test(id)) as string;
    const planId = /^practice-gen\.(gen-[0-9a-f-]{36})/.exec(real)?.[1] as string;
    const plan = genPlan(planId, 3);
    const marks: MisfiledMarks = new Map<string, string | null>([[real, lo(planId, 2)], [step(planId, 3), lo(planId, 2)]]);
    const res = await draw(lo(planId, 2), sourcesOf([plan], [bankRow(real, lo(planId, 1))]), marks);
    assert.ok(ids(res).includes(real));
    // The lo-3 step marked for lo-2: served to the listed partner only when audited.
    assert.equal(ids(res).includes(step(planId, 3)), AUDITED_LESSON_STEP_IDS.has(step(planId, 3)));
    const unaudited = genPlan(A, 4);
    const m2: MisfiledMarks = new Map<string, string | null>([[step(A, 3), lo(A, 2)]]);
    assert.deepEqual(ids(await draw(lo(A, 2), sourcesOf([unaudited]), m2)), [], 'unaudited lo-3 step is not gained by a listed partner (nor is the unaudited own step served)');
    assert.deepEqual(ids(await withList(lo(A, 2), sourcesOf([unaudited]), m2, [step(A, 2), step(A, 3)])), [step(A, 2), step(A, 3)], 'both listed ⇒ both served');
    process.env[AUDITED_ALL_STEPS_ENV] = 'off';
    assert.deepEqual(ids(await draw(lo(A, 2), sourcesOf([unaudited]), m2)), [step(A, 2)], 'switch off: the own step is not gated, the gained lo-3 step is');
    delete process.env[AUDITED_ALL_STEPS_ENV];
    delete process.env[AUDITED_ONLY_PARTNERS_ENV];
    assert.deepEqual(ids(await draw(lo(A, 2), sourcesOf([unaudited]), m2)), [step(A, 2), step(A, 3)], '…and is by anyone else');
  });

  await test('an unknown id on the list, and the committed list on a plan it does not know, change nothing and raise nothing', async () => {
    const plain = await draw(lo(A, 2), srcA(), new Map());
    assert.deepEqual(ids(plain), [A2_X, A2_Y, step(A, 2)]);
    assert.deepEqual(await draw(lo(A, 2), srcA(), undefined), plain, 'the committed list (default) holds none of the fixture ids');
    assert.deepEqual(await draw(lo(A, 4), srcA(), MARKS), await draw(lo(A, 4), srcA(), new Map()));
  });

  // -------------------------------------------------------------------------
  // A SKILL request
  // -------------------------------------------------------------------------
  await test('skill request: the same items with marks as without; every id and loId as before (loId = the skill)', async () => {
    const without = await draw(lo(A, 1), srcA(), new Map());
    const withMarks = await draw(lo(A, 1), srcA(), MARKS);
    assert.equal(without.items.length, 11);
    assert.deepEqual(ids(withMarks).sort(), ids(without).sort());
    const before = new Map(without.items.map((it) => [it.id, it]));
    for (const it of withMarks.items) {
      assert.deepEqual(it, before.get(it.id), it.id);
      assert.equal(it.loId, lo(A, 1));
    }
    for (const id of [A1_IS2, A1_IS3, A1_OFF, step(A, 1)]) assert.ok(ids(withMarks).includes(id), `${id} still served to a skill request`);
  });

  await test('skill request: the spread across objectives counts a marked item under the objective it tests', async () => {
    // Objective 1 holds three rows; one is really objective 2's. Objective 2
    // and 3 hold nothing of their own (no steps in this fixture).
    const bare: PlanLite = { ...genPlan(A, 3), segments: [] };
    const bank = [bankRow(A1_FIT, lo(A, 1)), bankRow(A1_IS2, lo(A, 1)), bankRow(gen(A, 1, 'fit2'), lo(A, 1))];
    const m: MisfiledMarks = new Map<string, string | null>([[A1_IS2, lo(A, 2)]]);
    // Without the mark all three are "objective 1": pool order.
    assert.deepEqual(ids(await draw(lo(A, 1), sourcesOf([bare], bank), new Map(), 2)), [A1_FIT, A1_IS2]);
    assert.deepEqual(ids(await draw(lo(A, 1), sourcesOf([bare], bank), new Map(), 3)), [A1_FIT, A1_IS2, gen(A, 1, 'fit2')]);
    // With it: one from objective 1, then the item that tests objective 2.
    assert.deepEqual(ids(await draw(lo(A, 1), sourcesOf([bare], bank), m, 3)), [A1_FIT, A1_IS2, gen(A, 1, 'fit2')]);
    const bank2 = [bankRow(A1_FIT, lo(A, 1)), bankRow(gen(A, 1, 'fit2'), lo(A, 1)), bankRow(A1_IS2, lo(A, 1))];
    assert.deepEqual(ids(await draw(lo(A, 1), sourcesOf([bare], bank2), new Map(), 2)), [A1_FIT, gen(A, 1, 'fit2')], 'unmarked: two objective-1 items');
    assert.deepEqual(ids(await draw(lo(A, 1), sourcesOf([bare], bank2), m, 2)), [A1_FIT, A1_IS2], 'marked: objective 1 then objective 2');
    // Already-seen counting uses the mark too: having seen the objective-2
    // item, the next draw starts with objective 1.
    assert.deepEqual(ids(await draw(lo(A, 1), sourcesOf([bare], bank2), m, 1, P1, [A1_IS2])), [A1_FIT]);
    assert.deepEqual(ids(await draw(lo(A, 1), sourcesOf([bare], bank2), m, 1, P1, [A1_FIT])), [A1_IS2]);
  });

  // -------------------------------------------------------------------------
  // Flag off
  // -------------------------------------------------------------------------
  await test('flag off: every request answers exactly as it does with no marks at all', async () => {
    for (const skill of [undefined, 'off']) {
      for (const k of [1, 2, 3, 4]) {
        for (const count of [2, 50]) {
          if (skill) process.env[SKILL_FLAG] = skill; else delete process.env[SKILL_FLAG];
          delete process.env[FLAG];
          const baseline = await draw(lo(A, k), srcA(), new Map(), count);
          process.env[FLAG] = 'off';
          const off = await draw(lo(A, k), srcA(), MARKS, count);
          assert.deepEqual(off, baseline, `lo-${k} count=${count} skillScope=${skill ?? 'on'}`);
        }
      }
    }
    process.env[FLAG] = 'off';
    const calls: string[] = [];
    await draw(lo(A, 2), sourcesOf([planA, planB], bankA, calls), MARKS);
    assert.deepEqual(calls, [lo(A, 2)], 'no extra bank read when off');
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0);
})();
