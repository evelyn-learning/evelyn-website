/**
 * Guard for the curated demo-lesson catalog (npm run test:curated-demo).
 *
 * Fails loudly when a curated planId no longer exists in SEED_PLANS or no
 * longer resolves to a taxonomy cell — either breaks the one-tap tiles on
 * /tutor and the chips on /products/voice-tutor (tile clicks drive the
 * subject/level/topic cascade via the resolved cell).
 */

import { SEED_PLANS } from '../src/lib/tutor/lesson-plan/store';
import { resolvePlanCell } from '../src/lib/tutor/lesson-plan/resolve-cell';
import { CURATED_DEMO_LESSONS } from '../src/lib/tutor/demo/curated-demo-lessons';

let failures = 0;
const fail = (msg: string) => {
  failures++;
  console.error(`  ✗ ${msg}`);
};

const byId = new Map(SEED_PLANS.map((p) => [p.id, p]));

const seen = new Set<string>();
for (const lesson of CURATED_DEMO_LESSONS) {
  if (seen.has(lesson.planId)) {
    fail(`duplicate curated planId: ${lesson.planId}`);
    continue;
  }
  seen.add(lesson.planId);

  const plan = byId.get(lesson.planId);
  if (!plan) {
    fail(`curated planId not in SEED_PLANS: ${lesson.planId} (${lesson.title})`);
    continue;
  }
  const cell = resolvePlanCell(plan);
  if (!cell || !cell.subject || !cell.level || !cell.topic) {
    fail(
      `curated plan is a taxonomy orphan (tile click cannot drive the cascade): ${lesson.planId} → ${JSON.stringify(cell)}`,
    );
    continue;
  }
  console.log(`  ✓ ${lesson.title} → ${plan.title} [${cell.subject}/${cell.level}/${cell.topic}]`);
}

if (failures > 0) {
  console.error(`\n${failures} curated demo lesson check(s) FAILED`);
  process.exit(1);
}
console.log(`\nAll ${CURATED_DEMO_LESSONS.length} curated demo lessons verified.`);
