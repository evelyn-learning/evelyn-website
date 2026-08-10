/**
 * Rail labels — pure segment/LO label parsing and rail item building.
 *
 * Pure/deterministic tests for buildRailModel, buildLabelPrompt,
 * parseLabelResponse, and railStageLabel in src/lib/tutor/lesson-plan/rail-labels.ts.
 * No DB, no LLM calls — builds fake LessonPlan object literals in-process,
 * mirroring scripts/test-agenda.ts's pattern.
 *
 * Usage: npx tsx scripts/test-rail-labels.ts
 */
import {
  buildRailModel,
  buildLabelPrompt,
  parseLabelResponse,
  railStageLabel,
} from '../src/lib/tutor/lesson-plan/rail-labels';
import type { LessonPlan, LearningObjective, Segment, SegmentRecap } from '../src/lib/tutor/lesson-plan/types';
import { LESSON_PLAN_SCHEMA_VERSION } from '../src/lib/tutor/lesson-plan/types';

let passed = 0;
let failed = 0;
function assert(cond: boolean, name: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}`); }
}

/** Build a minimal Segment for a given id. Kind defaults to 'concept'
 *  except ids containing hook/try/recap, per the task pattern. */
function segmentFor(id: string): Segment {
  if (id.includes('hook')) return { id, kind: 'hook', goal: 'test hook' };
  if (id.includes('try')) return { id, kind: 'try_yourself', problem: 'test problem', expectedAnswer: 'test answer' };
  if (id === 'recap' || id.includes('recap')) return { id, kind: 'recap', mustRemember: [] };
  // Default segment types for other cases
  if (id.includes('worked') || id.includes('letter')) return { id, kind: 'worked_example', problem: 'test problem', steps: ['step 1'] };
  if (id.includes('misconception')) return { id, kind: 'misconception_check', question: 'test question', commonErrors: [] };
  return { id, kind: 'concept', goal: 'test concept', keyIdeas: ['idea'] };
}

/** Local helper building a minimal LessonPlan from just the bits each
 *  case cares about (segmentIds, los, title, metadata). */
function mkPlan(opts: {
  segmentIds: string[];
  los?: LearningObjective[];
  title?: string;
  metadata?: Record<string, unknown>;
}): LessonPlan {
  const segments = opts.segmentIds.map(segmentFor);
  return {
    id: 'test-plan-rail',
    title: opts.title ?? 'Test plan',
    curriculum: 'freestyle',
    grade: '8',
    subject: 'science',
    los: opts.los ?? [],
    estimatedMinutes: 30,
    segments,
    prerequisites: [],
    followUps: [],
    schemaVersion: LESSON_PLAN_SCHEMA_VERSION,
    metadata: opts.metadata,
  };
}

/* ------------------------------------------------------------------ */
/* buildRailModel — rail item creation                                */
/* ------------------------------------------------------------------ */

// Case 1: generated plan → one item per LO group, shortTitle labels, intro/recap standalone
{
  const gen = mkPlan({
    metadata: { generatedFromText: true },
    los: [
      { id: 'lo-a', description: 'Explain photosynthesis inputs and outputs', shortTitle: 'Photosynthesis inputs' },
      { id: 'lo-b', description: 'Trace the light reactions step by step' },
    ],
    segmentIds: ['intro', 'lo-a-hook', 'lo-a-concept', 'lo-a-try', 'lo-b-hook', 'lo-b-concept', 'recap'],
  });
  const m1 = buildRailModel(gen, 'lo-a-concept', new Set(['intro', 'lo-a-hook']), null)!;
  assert(m1.map(i => i.key).join(',') === 'intro,lo-a,lo-b,recap', 'gen grouping order');
  assert(m1[1].label === 'Photosynthesis inputs', 'gen shortTitle label');
  assert(m1[1].current === true && m1[0].done === true && m1[1].done === false, 'gen flags');
  assert(m1[2].label.split(' ').length <= 4, 'gen derived label bounded');
  assert(m1[0].label === 'Intro' && m1[3].label === 'Recap', 'standalone fixed labels');
}

// Case 2: curated plan + content labels → one item per segment, labeled; hook/recap fixed
{
  const curated = mkPlan({
    title: 'U1.4 The Columbian Exchange',
    los: [{ id: 'apush.columbian-exchange', description: 'Explain the causes and effects…' }],
    segmentIds: ['hook', 'concept-cx', 'worked-letter', 'try-saq', 'misconception-one-way', 'recap'],
  });
  const labels = { 'concept-cx': 'Two-way exchange', 'worked-letter': "Columbus's letter",
    'try-saq': 'Practice: SAQ', 'misconception-one-way': 'One-way myth' };
  const m2 = buildRailModel(curated, 'worked-letter', new Set(['hook', 'concept-cx']), labels)!;
  assert(m2.length === 6 && m2[0].label === 'Hook' && m2[5].label === 'Recap', 'curated fixed ends');
  assert(m2[1].label === 'Two-way exchange' && m2[2].current === true, 'curated content labels');
}

// Case 3: curated, NO labels (atomic / labeler failed) → stage-label fallback with occurrence numbering
{
  const curated = mkPlan({
    title: 'U1.4 The Columbian Exchange',
    los: [{ id: 'apush.columbian-exchange', description: 'Explain the causes and effects…' }],
    segmentIds: ['hook', 'concept-cx', 'worked-letter', 'try-saq', 'misconception-one-way', 'recap'],
  });
  const m3 = buildRailModel(curated, 'hook', new Set(), null)!;
  assert(m3.map(i => i.label).join('|') === 'Hook|Concept|Example|Try|Misconception|Recap', 'stage fallback');
  const twoTries = mkPlan({ los: [], segmentIds: ['hook', 'try-1', 'try-2', 'recap'] });
  const m4 = buildRailModel(twoTries, 'try-2', new Set(['hook', 'try-1']), null)!;
  assert(m4[1].label === 'Try 1' && m4[2].label === 'Try 2', 'occurrence numbering');
}

// Case 4: suppression — pendingPicker → null
{
  assert(buildRailModel(mkPlan({ metadata: { pendingPicker: true }, segmentIds: ['hook'] }), 'hook', new Set(), null) === null, 'picker suppressed');
}

/* ------------------------------------------------------------------ */
/* parseLabelResponse — JSON parsing + word cap                       */
/* ------------------------------------------------------------------ */

{
  const curated = mkPlan({
    title: 'U1.4 The Columbian Exchange',
    los: [{ id: 'apush.columbian-exchange', description: 'Explain the causes and effects…' }],
    segmentIds: ['hook', 'concept-cx', 'worked-letter', 'try-saq', 'misconception-one-way', 'recap'],
  });
  const p = (raw: string) => parseLabelResponse(raw, curated);
  assert(p('{"labels":[{"id":"concept-cx","label":"Two-way exchange"}]}')!['concept-cx'] === 'Two-way exchange', 'parse ok');
  assert(p('{"labels":[{"id":"concept-cx","label":"one two three four five"}]}')!['concept-cx'].split(' ').length <= 3, 'word cap 3');
  assert(p('{"atomic": true}') === null, 'atomic → null');
  assert(p('```json\n{"labels":[{"id":"concept-cx","label":"Fenced"}]}\n```')!['concept-cx'] === 'Fenced', 'fence tolerant');
  assert(p('not json') === null && p('{"labels":[{"id":"nope","label":"X"}]}') === null, 'junk + unknown ids → null');
  assert(p('{"labels":[{"id":"concept-cx","label":"Same"},{"id":"worked-letter","label":"Same"}]}') === null, 'all-duplicate labels → null (atomic)');
}

/* ------------------------------------------------------------------ */
/* buildLabelPrompt — segment list + field inclusion                  */
/* ------------------------------------------------------------------ */

{
  const curated = mkPlan({
    title: 'U1.4 The Columbian Exchange',
    los: [{ id: 'apush.columbian-exchange', description: 'Explain the causes and effects…' }],
    segmentIds: ['hook', 'concept-cx', 'worked-letter', 'try-saq', 'misconception-one-way', 'recap'],
  });
  const prompt = buildLabelPrompt(curated);
  assert(prompt.includes('concept-cx') && prompt.includes('try-saq'), 'prompt lists labelable segments');
  assert(!prompt.includes('"hook"') && !prompt.includes('"recap"'), 'hook/recap not sent for labeling');
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
