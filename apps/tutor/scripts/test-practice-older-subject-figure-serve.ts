/**
 * End-to-end serve check (no database) for a GENERATED FIGURE row on an
 * older-subject objective — the shape the GreenApple T2 figure rows take:
 *   id `practice-gen.geom.reflections.<hash>`, loId = the seed LO itself
 *   (`geom.reflections`, no `.lo-N`), topic/topicId = the course slug
 *   (`geometry`), a `figure` drawn by the authoring renderer.
 *
 * Through the real `retrievePractice` and the PRODUCTION adapter
 * (`mongoPracticeSources`, seed plans first) over stubbed Mongo, as
 * test-practice-figure-items.ts does: `mongoose.connect`, `ProblemBank.find`
 * and `LessonPlanModel.find` are replaced, so nothing can reach a database.
 *
 * Checks: the seed plan is found for the LO; the row is served under the LO
 * (and under the course topic) with its figure, to a caller that accepts
 * figures; it is NOT served without `accepts: figure`; to an audited-only
 * partner (GreenApple) only once its id is on the audited list; and the wire
 * item passes the contract schema.
 *
 * Run:  MONGODB_URI="" npx tsx scripts/test-practice-older-subject-figure-serve.ts
 */
import { NO_DB_URI } from './lib/no-db-env';
import { strict as assert } from 'node:assert';
import mongoose from 'mongoose';
import { RetrievePracticeResponseSchema, type RetrievePracticeRequest } from '@evelyn/portal-contract/v1';
import { retrievePractice } from '@/lib/tutor/portal/practice';
import { mongoPracticeSources } from '@/lib/tutor/portal/adapters';
import { AUDITED_GENERATED_ITEM_IDS, AUDITED_ONLY_PARTNERS_ENV } from '@/lib/tutor/portal/audited-items';
import { NO_GEN_SOURCES } from '@/lib/tutor/practice-assign/resolve';
import { buildPracticeFigure } from '@/lib/tutor/practice-figure/render';
import { LessonPlanModel } from '@/models/LessonPlan';
import { ProblemBank } from '@/models/ProblemBank';
import { itemIdOf } from './practice-extend/core';

const connectUris: unknown[] = [];
(mongoose as unknown as { connect: (uri: unknown) => Promise<typeof mongoose> }).connect = async (uri) => {
  connectUris.push(uri);
  return mongoose;
};

let passed = 0;
let failed = 0;
async function test(name: string, fn: () => Promise<void>): Promise<void> {
  const log = console.log;
  try {
    console.log = () => {};
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
    delete process.env[AUDITED_ONLY_PARTNERS_ENV];
  }
}

const LO = 'geom.reflections';
const TOPIC = 'geometry';
const STEM = 'Triangle PQR is reflected across the y-axis. What is the x-coordinate of the image of P?';
const ID = itemIdOf(LO, STEM);
const FIGURE = buildPracticeFigure(
  { type: 'function_graph', params: { xRange: [-5, 5], yRange: [-5, 5], xStep: 1, yStep: 1, curves: [], points: [{ x: 3, y: 2, label: 'P' }] } },
  'A coordinate grid from −5 to 5 on both axes with one labelled point P.',
);
const ROW = { id: ID, topic: TOPIC, topicId: TOPIC, loId: LO, subtopic: 'Reflections', difficulty: 2, problemText: STEM, answer: '-3', responseFormat: 'numeric', hints: ['h1', 'h2'], solutionText: 's', figure: FIGURE };

const bankFilters: Array<Record<string, unknown>> = [];
(LessonPlanModel as unknown as { find: () => { limit: () => Promise<unknown[]> } }).find = () => ({ limit: async () => [] });
(ProblemBank as unknown as { find: (f: Record<string, unknown>) => { limit: () => { lean: () => Promise<unknown[]> } } }).find = (filter) => {
  bankFilters.push(filter);
  const noFigures = JSON.stringify(filter.figure) === JSON.stringify({ $exists: false });
  const byLo = typeof filter.loId === 'string' ? ROW.loId === filter.loId : false;
  const byTopic = JSON.stringify(filter).includes(`"${TOPIC}"`);
  return { limit: () => ({ lean: async () => ((byLo || byTopic) && !noFigures ? [ROW] : []) }) };
};

const req = (over: Partial<RetrievePracticeRequest> = {}): RetrievePracticeRequest => ({ studentId: 's1', courseId: 'c1', scope: { loId: LO }, count: 20, ...over });
const FIG = { accepts: ['figure' as const] };
const ROUTE = { allowFigures: true };
const GAC = { partnerId: 'greenapple' };

async function main(): Promise<void> {
  console.log(`\nOlder-subject generated figure row (${ID}) through retrievePractice + the production adapter (stubbed Mongo):\n`);

  await test('the id is minted in the practice-gen scheme on the seed LO (no .lo-N)', async () => {
    assert.match(ID, /^practice-gen\.geom\.reflections\.[0-9a-z]+$/);
  });

  await test('the seed plan is found for the LO (seeds first)', async () => {
    const plans = await mongoPracticeSources().plansForLoId(LO);
    assert.deepEqual(plans.map((p) => p.id), ['evelyn.hs.geom.reflections.v1']);
    assert.equal(plans[0].topic, TOPIC);
  });

  await test('served under the LO, with its figure, to a caller that accepts figures (non-audited partner)', async () => {
    const r = await retrievePractice(req(FIG), mongoPracticeSources(), NO_GEN_SOURCES, { partnerId: 'someone-else' }, ROUTE);
    const it = r.items.find((i) => i.id === ID);
    assert.ok(it, `served: ${r.items.map((i) => i.id).join(', ')}`);
    assert.equal(it!.loId, LO);
    assert.deepEqual(it!.figure, FIGURE);
    RetrievePracticeResponseSchema.parse({ items: r.items });
  });

  await test('not served without accepts: figure, nor to a caller not allowed figures', async () => {
    const a = await retrievePractice(req(), mongoPracticeSources(), NO_GEN_SOURCES, { partnerId: 'someone-else' }, ROUTE);
    assert.ok(!a.items.some((i) => i.id === ID));
    const b = await retrievePractice(req(FIG), mongoPracticeSources(), NO_GEN_SOURCES, { partnerId: 'someone-else' });
    assert.ok(!b.items.some((i) => i.id === ID));
  });

  await test('GreenApple (audited-only): not served while the id is off the audited list; served once listed', async () => {
    process.env[AUDITED_ONLY_PARTNERS_ENV] = 'greenapple';
    assert.ok(!AUDITED_GENERATED_ITEM_IDS.has(ID));
    const off = await retrievePractice(req(FIG), mongoPracticeSources(), NO_GEN_SOURCES, GAC, ROUTE);
    assert.ok(!off.items.some((i) => i.id === ID));
    (AUDITED_GENERATED_ITEM_IDS as Set<string>).add(ID); // in this process only
    try {
      const on = await retrievePractice(req(FIG), mongoPracticeSources(), NO_GEN_SOURCES, GAC, ROUTE);
      const it = on.items.find((i) => i.id === ID);
      assert.ok(it && it.figure, 'served with its figure once listed');
      RetrievePracticeResponseSchema.parse({ items: on.items });
    } finally {
      (AUDITED_GENERATED_ITEM_IDS as Set<string>).delete(ID);
    }
  });

  await test('served under the course topic (topic scope) too, with its figure', async () => {
    const r = await retrievePractice(req({ ...FIG, scope: { topicId: TOPIC } }), mongoPracticeSources(), NO_GEN_SOURCES, { partnerId: 'someone-else' }, ROUTE);
    assert.ok(r.items.some((i) => i.id === ID && i.figure), `served: ${r.items.map((i) => i.id).join(', ')}`);
  });

  assert.ok(connectUris.every((u) => u === NO_DB_URI), 'only ever the unresolvable test URI');
  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
