/**
 * Session-agenda + LO-named progress — buildLessonProgress LO view (E-task3)
 * and (Task 4 will extend this file with agenda-card cases below).
 *
 * Pure/deterministic tests against buildLessonProgress in
 * src/lib/tutor/portal/lesson-progress.ts. No DB, no LLM calls — builds
 * fake LessonPlan object literals in-process, mirroring
 * scripts/test-advance-ordering.ts's pattern.
 *
 * Usage: npx tsx scripts/test-agenda.ts
 */
import { buildLessonProgress } from '../src/lib/tutor/portal/lesson-progress';
import type { LessonPlan, LearningObjective, Segment } from '../src/lib/tutor/lesson-plan/types';
import { LESSON_PLAN_SCHEMA_VERSION } from '../src/lib/tutor/lesson-plan/types';

let passed = 0;
let failed = 0;
function assert(cond: boolean, name: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}`); }
}

/** Build a minimal Segment for a given id. Kind defaults to 'concept'
 *  except ids containing hook/try/recap, per the task-3 brief. */
function segmentFor(id: string): Segment {
  if (id.includes('hook')) return { id, kind: 'hook', goal: 'test hook' };
  if (id.includes('try')) return { id, kind: 'try_yourself', problem: 'test problem', expectedAnswer: 'test answer' };
  if (id === 'recap' || id.includes('recap')) return { id, kind: 'recap', mustRemember: [] };
  return { id, kind: 'concept', goal: 'test concept', keyIdeas: ['idea'] };
}

/** Local helper building a minimal LessonPlan from just the bits each
 *  case cares about (segmentIds, los, title, generatedFromText). */
function mkPlan(opts: {
  segmentIds: string[];
  los?: LearningObjective[];
  title?: string;
  metadata?: Record<string, unknown>;
}): LessonPlan {
  return {
    id: 'test-plan-agenda',
    title: opts.title ?? 'Test plan',
    curriculum: 'freestyle',
    grade: '8',
    subject: 'science',
    los: opts.los ?? [],
    estimatedMinutes: 30,
    segments: opts.segmentIds.map(segmentFor),
    prerequisites: [],
    followUps: [],
    schemaVersion: LESSON_PLAN_SCHEMA_VERSION,
    metadata: opts.metadata,
  };
}

/* ------------------------------------------------------------------ */
/* buildLessonProgress — LO titles + segment→LO map (Task 3)          */
/* ------------------------------------------------------------------ */

// Case 1: generated plan → loId from id convention, intro/recap unmapped,
// shortTitle preferred over a derived (bounded) title.
{
  const gen = mkPlan({
    metadata: { generatedFromText: true },
    los: [
      { id: 'lo-a', description: 'Explain photosynthesis inputs and outputs', shortTitle: 'Photosynthesis inputs' },
      { id: 'lo-b', description: 'Trace the light reactions step by step' }, // no shortTitle
    ],
    segmentIds: ['intro', 'lo-a-hook', 'lo-a-concept', 'lo-a-worked', 'lo-a-try',
                 'lo-b-hook', 'lo-b-concept', 'lo-b-worked', 'lo-b-try', 'recap'],
  });
  const p1 = buildLessonProgress(gen, 'lo-a-concept', new Set(['intro', 'lo-a-hook']));
  assert(p1 !== null, 'gen: buildLessonProgress returns non-null');
  if (p1) {
    assert(!!p1.los && p1.los.length === 2 && p1.los[0].title === 'Photosynthesis inputs', 'gen los titles');
    assert(!!p1.los && p1.los[1].title.split(' ').length <= 7, 'derived title bounded');
    assert(p1.segments.find((s) => s.id === 'lo-a-hook')?.loId === 'lo-a', 'gen loId mapped');
    assert(p1.segments.find((s) => s.id === 'intro')?.loId === undefined, 'intro unmapped');
    assert(p1.segments.find((s) => s.id === 'recap')?.loId === undefined, 'recap unmapped');
  }
}

// Case 2: curated single-LO plan → one group titled plan.title, ALL
// segments mapped to it (no generatedFromText, no id-convention required).
{
  const curated = mkPlan({
    title: 'U1.4 The Columbian Exchange',
    los: [{ id: 'apush.columbian-exchange', description: 'Explain the causes and effects…' }],
    segmentIds: ['hook', 'concept-meaning', 'worked-1', 'try-1', 'recap'],
  });
  const p2 = buildLessonProgress(curated, 'worked-1', new Set(['hook']));
  assert(p2 !== null, 'curated: buildLessonProgress returns non-null');
  if (p2) {
    assert(!!p2.los && p2.los.length === 1 && p2.los[0].title === 'U1.4 The Columbian Exchange', 'curated title = plan.title');
    assert(p2.segments.every((s) => s.loId === 'apush.columbian-exchange'), 'curated all segments one group');
  }
}

// Case 3: zero-LO plan → no los, no loId anywhere.
{
  const bare = mkPlan({ los: [], segmentIds: ['hook', 'recap'] });
  const p3 = buildLessonProgress(bare, 'hook', new Set());
  assert(p3 !== null, 'bare: buildLessonProgress returns non-null');
  if (p3) {
    assert(p3.los === undefined && p3.segments.every((s) => s.loId === undefined), 'no-LO fallback');
  }
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
