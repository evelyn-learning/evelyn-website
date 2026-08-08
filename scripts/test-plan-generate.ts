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
import { upsertLessonPlan, listLessonPlans, deleteLessonPlan } from '@/lib/tutor/lesson-plan/store';

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

async function main() {
  console.log('\nRuntime lesson generation — engine store:\n');

  await test('generated plans hidden from listings by default, visible with includeGenerated', testGeneratedPlansHiddenFromListings);

  console.log(`\n${passed} passed, ${failed} failed\n`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('Fatal error running test-plan-generate:', err);
  process.exit(1);
});
