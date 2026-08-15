/**
 * Topic-notes registry smoke test.
 *
 * Verifies, for a given course, that every CED unit 1-N has at least one
 * registered baseline, and that every registered baseline for that course
 * carries non-empty theory/methods/pointers content plus a byte-matching
 * course string and `baselineId === planId`. Pure store-level check (no
 * DB / no student overlay) — this is the "does the Notes tab have
 * anything to resolve for this course" gate, not a full render test.
 *
 * Usage:
 *   npx tsx scripts/topic-notes-smoke.ts "Algebra 1" 10
 *   npx tsx scripts/topic-notes-smoke.ts "Chemistry" 10
 *
 * Defaults to "Algebra 1" units 1-10 if no args given.
 */

import {
  listTopicNotesBaselinesForCourse,
  listTopicNotesBaselinesForUnit,
} from '../src/lib/tutor/topic-notes/store';

const course = process.argv[2] || 'Algebra 1';
const maxUnit = parseInt(process.argv[3] || '10', 10);

let failures = 0;

function fail(msg: string): void {
  console.error(`✗ ${msg}`);
  failures++;
}

const allForCourse = listTopicNotesBaselinesForCourse(course);
console.log(`Course: "${course}" — ${allForCourse.length} baseline(s) registered total.`);
if (allForCourse.length === 0) {
  fail(`no baselines registered for course "${course}" — check the exact course string byte-matches.`);
}

let totalTopics = 0;
for (let unit = 1; unit <= maxUnit; unit++) {
  const topics = listTopicNotesBaselinesForUnit(course, unit);
  totalTopics += topics.length;
  if (topics.length === 0) {
    fail(`unit ${unit}: 0 topics resolved for course "${course}".`);
    continue;
  }
  console.log(`  Unit ${unit}: ${topics.length} topic(s) — ${topics.map((t) => t.cedTopic).join(', ')}`);

  for (const b of topics) {
    if (b.course !== course) {
      fail(`unit ${unit} / ${b.baselineId}: course mismatch — expected "${course}", got "${b.course}"`);
    }
    if (b.baselineId !== b.planId) {
      fail(`unit ${unit} / ${b.baselineId}: baselineId !== planId (planId="${b.planId}")`);
    }
    if (b.theory.length === 0) fail(`unit ${unit} / ${b.baselineId}: theory[] is empty`);
    if (b.methods.length === 0) fail(`unit ${unit} / ${b.baselineId}: methods[] is empty`);
    if (b.pointers.length === 0) fail(`unit ${unit} / ${b.baselineId}: pointers[] is empty`);
    for (const t of b.theory) {
      if (!t.content || t.content.trim().length === 0) {
        fail(`unit ${unit} / ${b.baselineId}: theory entry with empty content (loId=${t.loId})`);
      }
    }
    for (const m of b.methods) {
      if (!m.steps || m.steps.length < 2) {
        fail(`unit ${unit} / ${b.baselineId}: method "${m.title}" has < 2 steps`);
      }
    }
  }
}

console.log('');
console.log(`Total topics resolved across units 1-${maxUnit}: ${totalTopics}`);

if (allForCourse.length !== totalTopics) {
  fail(
    `registered-for-course count (${allForCourse.length}) !== sum of per-unit topics (${totalTopics}) — some baseline has a cedUnit outside 1-${maxUnit} or a course-string mismatch.`,
  );
}

if (failures > 0) {
  console.error(`\n✗ SMOKE FAILED: ${failures} issue(s).`);
  process.exit(1);
}
console.log(`\n✓ SMOKE PASSED: "${course}" units 1-${maxUnit}, ${totalTopics} topics, all non-empty.`);
