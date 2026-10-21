/**
 * Pure tests for the one-problem homework plan minter
 * (src/lib/tutor/lesson-plan/homework-problem.ts + its portal route).
 * No Mongo, no model.
 *
 * Run: npx tsx scripts/test-homework-problem-plan.ts  (npm run test:homework-problem-plan)
 */
import { strict as assert } from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

let passed = 0;
let failed = 0;
async function section(name: string, fn: () => Promise<void> | void): Promise<void> {
  try { await fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}

async function main() {
  const { homeworkProblemOf, buildHomeworkProblemPlan, HOMEWORK_PROBLEM_KIND } =
    await import('../src/lib/tutor/lesson-plan/homework-problem');
  const { parseLessonPlan } = await import('../src/lib/tutor/lesson-plan/parser');
  const { buildHomeworkPlanFields } = await import('../src/lib/tutor/lesson-plan/homework');
  const { LESSON_PLAN_SCHEMA_VERSION } = await import('../src/lib/tutor/lesson-plan/types');
  const { buildRecapSegment } = await import('../src/lib/tutor/lesson-plan/generate-from-text');

  const text = 'In triangle ABC, DE is parallel to BC. Find x and y.';
  const fields = buildHomeworkPlanFields([{ n: 5, text }, { n: 6, text: 'Solve 2x = 4' }], 'Geometry', 'gen-parent');
  const parent = parseLessonPlan({
    id: 'gen-parent', title: 'Homework help', curriculum: 'freestyle', grade: '10', subject: 'math',
    topic: 'Geometry', locale: 'en', los: fields.los, estimatedMinutes: 30,
    segments: [
      { id: 'homework', kind: 'concept', goal: 'Work the problems.', keyIdeas: ['x'] },
      buildRecapSegment(fields.los),
    ],
    prerequisites: [], followUps: [], schemaVersion: LESSON_PLAN_SCHEMA_VERSION,
    metadata: { ...fields.metadata, allowedMaxLOs: 1, portalPartnerId: 'p1', ownerStudentId: 's1', cacheKey: 'ck', generatorOk: true },
  });
  const fig = { action: 'showGraph', type: 'function', data: {} } as never;
  const meta = { parentPlanId: 'gen-parent', n: 5, text, figure: fig, verified: true };

  console.log('homework-problem plan');
  await section('homeworkProblemOf: homework-help is null, minted plan reads back', () => {
    assert.equal(homeworkProblemOf({ metadata: { kind: 'homework-help', problems: [] } }), null);
    assert.equal(homeworkProblemOf(null), null);
    const plan = buildHomeworkProblemPlan(parent, meta, 'gen-x');
    const got = homeworkProblemOf(plan);
    assert.equal(got?.n, 5);
    assert.equal(got?.verified, true);
  });
  await section('shape and key-free', () => {
    const plan = buildHomeworkProblemPlan(parent, { ...meta, priorNote: 'did part a' }, 'gen-x');
    assert.equal(plan.metadata?.kind, HOMEWORK_PROBLEM_KIND);
    assert.equal(plan.metadata?.n, 5);
    assert.equal(plan.metadata?.problems, undefined);
    assert.equal(plan.metadata?.cacheKey, undefined);
    assert.equal(plan.metadata?.portalPartnerId, 'p1');
    assert.equal(plan.metadata?.ownerStudentId, 's1');
    assert.equal(plan.metadata?.priorNote, 'did part a');
    assert.equal(plan.title, 'Problem 5');
    assert.equal(plan.id, 'gen-x');
    assert.equal(plan.los[0].id, 'gen-x.lo-1');
    assert.equal(plan.segments[0].keyIdeas[0], text);
    const s = JSON.stringify(plan);
    for (const bad of ['"key"', '"canonical"', '"finals"', '"candidates"']) assert.ok(!s.includes(bad), bad);
    assert.doesNotThrow(() => parseLessonPlan(plan));
  });

  console.log('route source');
  const route = fs.readFileSync(path.join(__dirname, '../src/app/api/portal/v1/homework-problem-plan/route.ts'), 'utf8');
  await section('polls with waitMs clamp 8000, partner-scoped, no key leak', () => {
    assert.match(route, /waitMs/);
    assert.match(route, /8000/);
    assert.match(route, /portalPartnerId !== auth\.partnerId/);
    assert.match(route, /kickHomeworkBuild/);
    assert.ok(!/finals|key:/.test(route));
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
