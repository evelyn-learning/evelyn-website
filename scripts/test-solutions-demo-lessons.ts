/**
 * Guard for the /solutions/[segment] page registry (npm run test:solutions-demo).
 *
 * Fails loudly when a segment's demo planId no longer exists in SEED_PLANS,
 * when segment slugs collide, when the segment count drifts from the fixed
 * six-segment scope, or when the publishers-agencies / corporate-ld pages
 * (non-academic segments) don't have `showCrimsora: false`. Any of these
 * would silently break the embedded demo or the Crimsora cross-promo
 * guardrail on the marketing pages.
 */

import { SEED_PLANS } from '../apps/marketing/src/lib/tutor/lesson-plan/store';
import { SOLUTION_SEGMENTS } from '../apps/marketing/src/data/solutions';

let failures = 0;
const fail = (msg: string) => {
  failures++;
  console.error(`  ✗ ${msg}`);
};

const byId = new Map(SEED_PLANS.map((p) => [p.id, p]));

const EXPECTED_SLUG_COUNT = 6;
const NON_ACADEMIC_SLUGS = new Set(['publishers-agencies', 'corporate-ld']);

if (SOLUTION_SEGMENTS.length !== EXPECTED_SLUG_COUNT) {
  fail(
    `expected exactly ${EXPECTED_SLUG_COUNT} segments, found ${SOLUTION_SEGMENTS.length}`,
  );
}

const seenSlugs = new Set<string>();
for (const segment of SOLUTION_SEGMENTS) {
  if (seenSlugs.has(segment.slug)) {
    fail(`duplicate segment slug: ${segment.slug}`);
    continue;
  }
  seenSlugs.add(segment.slug);

  const wantsCrimsora = !NON_ACADEMIC_SLUGS.has(segment.slug);
  if (segment.showCrimsora !== wantsCrimsora) {
    fail(
      `${segment.slug}: showCrimsora=${segment.showCrimsora}, expected ${wantsCrimsora}`,
    );
  }

  if (segment.demoLessons.length === 0) {
    fail(`${segment.slug}: no demo lessons`);
  }

  const seenPlanIds = new Set<string>();
  for (const lesson of segment.demoLessons) {
    if (seenPlanIds.has(lesson.planId)) {
      fail(`${segment.slug}: duplicate demo planId: ${lesson.planId}`);
      continue;
    }
    seenPlanIds.add(lesson.planId);

    const plan = byId.get(lesson.planId);
    if (!plan) {
      fail(
        `${segment.slug}: demo planId not in SEED_PLANS: ${lesson.planId} (${lesson.title})`,
      );
      continue;
    }
    console.log(`  ✓ ${segment.slug}: ${lesson.title} → ${plan.title}`);
  }
}

for (const slug of NON_ACADEMIC_SLUGS) {
  if (!seenSlugs.has(slug)) {
    fail(`expected segment missing: ${slug}`);
  }
}

if (failures > 0) {
  console.error(`\n${failures} solutions demo-lesson check(s) FAILED`);
  process.exit(1);
}
console.log(`\nAll ${SOLUTION_SEGMENTS.length} solution segments verified. failed: 0`);
