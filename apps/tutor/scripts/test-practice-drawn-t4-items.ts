/**
 * The T4 DRAWN practice items (GreenApple 29-Oct release; contract v1.22.0
 * drawn answers) — every item PROVEN in code:
 *   - it builds into a stored row that the engine's serve path serves
 *     (drawn-items.ts `servableDrawn`: SVG + frame drawn now from the spec);
 *   - its key grades CORRECT under the contract's `gradeDrawn` on the spec as
 *     served, and so do the key reordered and, for a line, other pairs of
 *     points on the same line;
 *   - its key follows from the givens (the item's own calc / on / holds,
 *     written from the problem, not from the key);
 *   - every key value is reachable (a multiple of the snap step, on a drawn
 *     gridline / tick, inside the frame), and the tolerance is a quarter step;
 *   - at least two writer-named likely wrong answers, and the near misses made
 *     in code (one step off, swapped coordinates, an end flipped open/closed,
 *     a ray turned round …), all grade WRONG;
 *   - the rows are attributed to their objective by practice.ts, for a seed
 *     objective (`geom.reflections`) and a generated-course objective
 *     (`gen-….lo-N`, asked directly and through its skill), are served only
 *     through the drawn gate, and every one is on the audited list GAC needs.
 *
 * Items: scripts/practice-extend/t4-drawn-items/*.ts. Core: drawn-core.ts.
 * No database, no network, no model.
 *
 * Run: npm run test:practice-drawn-t4-items
 */
import { NO_DB_URI } from './lib/no-db-env';
import { strict as assert } from 'node:assert';
import mongoose from 'mongoose';
import { DrawnSpecSchema, RetrievePracticeResponseSchema, gradeDrawn, type PracticeItem } from '@evelyn/portal-contract/v1';
import { retrievePractice, type BankLite, type PlanLite, type PracticeSources } from '@/lib/tutor/portal/practice';
import { DRAWN_ANSWER_PARTNERS_ENV } from '@/lib/tutor/portal/drawn-items';
import { AUDITED_GENERATED_ITEM_IDS, AUDITED_ONLY_PARTNERS_ENV } from '@/lib/tutor/portal/audited-items';
import { WITHDRAWN_ITEM_IDS } from '@/lib/tutor/portal/withdrawn-items';
import { SEED_PLANS } from '@/lib/tutor/lesson-plan/store';
import { NO_GEN_SOURCES } from '@/lib/tutor/practice-assign/resolve';
import { buildDrawnItem, drawnBankRow, setProblems, type BuiltDrawn } from './practice-extend/drawn-core';
import { itemIdOf } from './practice-extend/core';
import { T4_ITEMS } from './practice-extend/t4-drawn-items';
import { T4_GROUPS, T4_OBJECTIVE_GROUP } from './practice-extend/t4-drawn-items/objectives';
import type { DrawnItem } from './practice-extend/t4-drawn-items/kit';

(mongoose as unknown as { connect: (uri: unknown) => Promise<typeof mongoose> }).connect = async (uri) => {
  assert.equal(uri, NO_DB_URI);
  return mongoose;
};

let passed = 0;
let failed = 0;
async function test(name: string, fn: () => void | Promise<void>): Promise<void> {
  const log = console.log;
  const warn = console.warn;
  try {
    console.log = () => {};
    console.warn = () => {};
    await fn();
    console.log = log;
    console.warn = warn;
    passed++;
    console.log(`  ok - ${name}`);
  } catch (e) {
    console.log = log;
    console.warn = warn;
    failed++;
    console.log(`  FAIL - ${name}`);
    console.error(e);
  } finally {
    console.log = log;
    console.warn = warn;
    delete process.env[DRAWN_ANSWER_PARTNERS_ENV];
    delete process.env[AUDITED_ONLY_PARTNERS_ENV];
    delete process.env.PRACTICE_GEN;
  }
}

/** The number of T4 drawn items (pinned: a change to the set must be deliberate). */
const EXPECTED_ITEMS = 115;

const ALL: Array<{ group: string; item: DrawnItem }> = Object.entries(T4_ITEMS).flatMap(([group, items]) => items.map((item) => ({ group, item })));
const BUILT: BuiltDrawn[] = ALL.map(({ item }) => buildDrawnItem(item));

const GAC = 'greenapple';
const BOTH = { accepts: ['figure' as const, 'drawn' as const] };
const ROUTE = { allowFigures: true };

function bankLite(b: BuiltDrawn): BankLite {
  const r = drawnBankRow(b, 'topic', '2026-10-15T00:00:00.000Z');
  return { id: r.id as string, problemText: r.problemText as string, answer: r.answer as string, responseFormat: 'drawn', difficulty: r.difficulty as 1 | 2 | 3, loId: r.loId as string, figure: r.figure, drawn: r.drawn } as BankLite;
}

function sourcesOf(plans: PlanLite[], bank: BankLite[]): PracticeSources {
  return {
    plansForLoId: async (loId) => plans.filter((p) => p.los.some((l) => l.id === loId)),
    plansForTopic: async () => [],
    bankForLoId: async (loId) => bank.filter((b) => b.loId === loId),
    bankForTopic: async () => bank,
  };
}

async function main(): Promise<void> {
  console.log('\nT4 drawn items — the set:\n');

  await test(`${ALL.length} items over ${Object.keys(T4_OBJECTIVE_GROUP).length} objectives in ${Object.keys(T4_GROUPS).length} groups; every item builds and proves with no problem`, () => {
    assert.equal(ALL.length, EXPECTED_ITEMS);
    const problems = BUILT.flatMap((b) => b.problems.map((p) => `${b.id} (${b.item.lo} ${b.item.t}): ${p}`));
    assert.deepEqual(problems, []);
    assert.deepEqual(setProblems(BUILT), []);
  });

  await test('each item is in its objective\'s group, each objective has its items, and the objective ids are real', () => {
    for (const { group, item } of ALL) assert.equal(T4_OBJECTIVE_GROUP[item.lo], group, `${item.lo} filed under ${group}`);
    for (const [g, los] of Object.entries(T4_GROUPS)) {
      for (const lo of Object.keys(los)) {
        const n = ALL.filter((a) => a.item.lo === lo).length;
        assert.ok(n >= 1 && n <= 4, `${g} ${lo}: ${n} items`);
        if (lo.startsWith('gen-')) assert.match(lo, /^gen-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.lo-\d+$/);
        else assert.ok(SEED_PLANS.some((p) => p.los.some((l) => l.id === lo)), `${lo} is a seed objective`);
      }
    }
  });

  await test('ids: practice-gen.<objective>.<hash of the stem>, unique, on the audited list, never withdrawn', () => {
    for (const b of BUILT) {
      assert.equal(b.id, itemIdOf(b.item.lo, b.item.q));
      assert.match(b.id, /^practice-gen\.(?:gen-[0-9a-f-]{36}\.lo-\d+|[a-z0-9]+\.[a-z0-9-]+)\.[0-9a-z]+$/);
      assert.ok(AUDITED_GENERATED_ITEM_IDS.has(b.id), `${b.id} is not on the audited list`);
      assert.equal(WITHDRAWN_ITEM_IDS.has(b.id), false, b.id);
    }
    assert.equal(new Set(BUILT.map((b) => b.id)).size, BUILT.length);
  });

  await test('every key grades CORRECT on the spec as served, and so do the reordered key and other point pairs of each line', () => {
    let lineAlternatives = 0;
    for (const b of BUILT) {
      assert.ok(b.served, b.id);
      const spec = DrawnSpecSchema.parse(b.served.drawn);
      assert.deepEqual(gradeDrawn(spec, b.keyAnswer), { gradable: true, correct: true, reason: 'correct' }, `${b.id} key`);
      assert.deepEqual(gradeDrawn(spec, JSON.stringify(b.keyAnswer)), { gradable: true, correct: true, reason: 'correct' }, `${b.id} key as the attempt string`);
      for (const a of b.mustPass) assert.equal(gradeDrawn(spec, a.answer).correct, true, `${b.id}: ${a.why}`);
      if (b.kind === 'grid-line') {
        const others = b.mustPass.filter((a) => /other grid point|farthest|another grid point/.test(a.why));
        assert.ok(others.length >= 1, `${b.id}: no equivalent pair of points tested`);
        lineAlternatives += others.length;
      }
    }
    assert.ok(lineAlternatives > 0);
  });

  await test('at least two named likely wrong answers per item, and every wrong answer and near miss grades WRONG', () => {
    for (const b of BUILT) {
      const spec = DrawnSpecSchema.parse(b.served!.drawn);
      assert.ok(b.item.misses.length >= 2, `${b.id}: ${b.item.misses.length} named misses`);
      const near = b.mustFail.filter((a) => a.why.startsWith('near miss'));
      assert.ok(near.length >= 2, `${b.id}: ${near.length} near misses`);
      for (const a of b.mustFail) {
        const g = gradeDrawn(spec, a.answer);
        assert.equal(g.gradable, true, `${b.id}: ${a.why}`);
        assert.equal(g.correct, false, `${b.id}: ${a.why} ${JSON.stringify(a.answer)}`);
      }
    }
  });

  await test('the tolerance is a quarter of the snap step (≤ half, as the contract requires)', () => {
    for (const b of BUILT) {
      const s = b.served!.drawn;
      if (s.kind === 'number-line-interval') assert.equal(s.tolerance, (s.snap ?? 0) / 4, b.id);
      else {
        assert.equal(s.tolerance.x, s.snap!.x / 4, b.id);
        assert.equal(s.tolerance.y, s.snap!.y / 4, b.id);
      }
    }
  });

  await test('the stored row: responseFormat drawn, figure { alt, spec } with no svg, drawn spec with no frame', () => {
    for (const b of BUILT) {
      const r = drawnBankRow(b, 'topic', '2026-10-15T00:00:00.000Z');
      assert.equal(r.responseFormat, 'drawn');
      assert.equal('svg' in (r.figure as object), false);
      assert.equal('frame' in (r.drawn as object), false);
      assert.deepEqual(r.choices, []);
      assert.equal((r.hints as string[]).length, 2);
      assert.ok([1, 2, 3].includes(r.difficulty as number));
    }
  });

  await test('the core catches a wrong key (self-test): a flipped end, a wrong point, a line off by one', () => {
    const iv = BUILT.find((b) => b.item.kind === 'interval')!.item as Extract<DrawnItem, { kind: 'interval' }>;
    const end = iv.key.to !== null ? { ...iv.key, toOpen: !iv.key.toOpen } : { ...iv.key, fromOpen: !iv.key.fromOpen };
    assert.ok(buildDrawnItem({ ...iv, key: end }).problems.some((p) => /does not match the stated condition/.test(p)));
    const pts = BUILT.find((b) => b.item.kind === 'points')!.item as Extract<DrawnItem, { kind: 'points' }>;
    const moved = pts.key.map((p, i) => (i === 0 ? ([p[0] + (pts.snap?.x ?? 1), p[1]] as [number, number]) : p));
    assert.ok(buildDrawnItem({ ...pts, key: moved }).problems.some((p) => /calc gives/.test(p)));
    const ln = BUILT.find((b) => b.item.kind === 'line')!.item as Extract<DrawnItem, { kind: 'line' }>;
    const off: [[number, number], [number, number]] = [ln.key[0], [ln.key[1][0], ln.key[1][1] + (ln.snap?.y ?? 1)]];
    assert.ok(buildDrawnItem({ ...ln, key: off }).problems.some((p) => /not on the stated line/.test(p)));
  });

  console.log('\nServed through practice.ts — attribution and the gate:\n');

  const older = BUILT.find((b) => !b.item.lo.startsWith('gen-'))!;
  const newer = BUILT.find((b) => b.item.lo.startsWith('gen-') && !b.item.lo.endsWith('.lo-1'))!;
  const olderPlan: PlanLite = { id: 'seed-plan', topic: 'course', los: [{ id: older.item.lo }], segments: [] };
  const genPlanId = newer.item.lo.replace(/\.lo-\d+$/, '');
  const genLos = [1, 2, 3, 4, 5, 6, 7].map((k) => ({ id: `${genPlanId}.lo-${k}` }));
  if (!genLos.some((l) => l.id === newer.item.lo)) genLos.push({ id: newer.item.lo });
  const genPlan: PlanLite = { id: genPlanId, topic: 'skill', los: genLos, segments: [] };
  const bank = [bankLite(older), bankLite(newer)];
  const sources = sourcesOf([olderPlan, genPlan], bank);
  const req = (loId: string) => ({ studentId: 's1', courseId: 'c1', scope: { loId }, count: 20, ...BOTH });

  await test(`a seed objective (${older.item.lo}): served to GAC as a drawn item under its own objective, with svg + frame`, async () => {
    process.env[DRAWN_ANSWER_PARTNERS_ENV] = GAC;
    process.env[AUDITED_ONLY_PARTNERS_ENV] = GAC;
    process.env.PRACTICE_GEN = 'off';
    const r = await retrievePractice(req(older.item.lo), sources, NO_GEN_SOURCES, { partnerId: GAC }, ROUTE);
    RetrievePracticeResponseSchema.parse(r);
    const it = r.items.find((i: PracticeItem) => i.id === older.id);
    assert.ok(it, 'served');
    assert.equal(it.loId, older.item.lo);
    assert.equal(it.responseFormat, 'drawn');
    assert.ok(it.figure?.svg.startsWith('<svg'));
    assert.deepEqual(it.drawn, older.served!.drawn);
  });

  await test(`a generated-course objective (${newer.item.lo}): served asked directly, and through its skill (${genPlanId}.lo-1)`, async () => {
    process.env[DRAWN_ANSWER_PARTNERS_ENV] = GAC;
    process.env[AUDITED_ONLY_PARTNERS_ENV] = GAC;
    process.env.PRACTICE_GEN = 'off';
    const direct = await retrievePractice(req(newer.item.lo), sources, NO_GEN_SOURCES, { partnerId: GAC }, ROUTE);
    RetrievePracticeResponseSchema.parse(direct);
    const d = direct.items.find((i: PracticeItem) => i.id === newer.id);
    assert.ok(d, 'served when the objective is asked for');
    assert.equal(d.loId, newer.item.lo);
    assert.equal(d.responseFormat, 'drawn');
    const skill = await retrievePractice(req(`${genPlanId}.lo-1`), sources, NO_GEN_SOURCES, { partnerId: GAC }, ROUTE);
    RetrievePracticeResponseSchema.parse(skill);
    const s = skill.items.find((i: PracticeItem) => i.id === newer.id);
    assert.ok(s, 'served when its skill is asked for');
    assert.equal(s.loId, `${genPlanId}.lo-1`, 'attributed to the skill the student opened');
    assert.equal(s.responseFormat, 'drawn');
  });

  await test('the gate: no drawn item without accepts drawn, without the practice route, or for an unlisted partner', async () => {
    process.env[DRAWN_ANSWER_PARTNERS_ENV] = GAC;
    process.env.PRACTICE_GEN = 'off';
    const has = (r: { items: PracticeItem[] }) => r.items.some((i) => i.id === older.id);
    assert.equal(has(await retrievePractice({ ...req(older.item.lo), accepts: ['figure'] }, sources, NO_GEN_SOURCES, { partnerId: GAC }, ROUTE)), false, 'figure only');
    assert.equal(has(await retrievePractice(req(older.item.lo), sources, NO_GEN_SOURCES, { partnerId: GAC }, {})), false, 'not the practice route');
    assert.equal(has(await retrievePractice(req(older.item.lo), sources, NO_GEN_SOURCES, { partnerId: 'crimsora' }, ROUTE)), false, 'unlisted partner');
    delete process.env[DRAWN_ANSWER_PARTNERS_ENV];
    assert.equal(has(await retrievePractice(req(older.item.lo), sources, NO_GEN_SOURCES, { partnerId: GAC }, ROUTE)), false, 'env unset');
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
