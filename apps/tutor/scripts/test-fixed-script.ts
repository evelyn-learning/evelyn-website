/**
 * Fixed-script plans (GDI trial, 2026-10-28): a tester runs the SAME scripted
 * lesson several times. A plan with `metadata.fixedScript === true`:
 *   - skips any segment marked `metadata.skipWhenLevelKnown` once the
 *     learner's working level is known (initial cursor + every "next");
 *   - recalls nothing from earlier sessions (no returning-learner opener, no
 *     prior-sessions list, no transient context, no learner-context block);
 *   - never rotates its content (no fillings recorded, no <content_variety>).
 * Plans without the flag navigate and prompt exactly as before.
 *
 * Run: npx tsx scripts/test-fixed-script.ts
 */
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  isFixedScriptPlan, shouldRotatePlanContent, initialSegmentId, nextSegmentId,
  markSkippedSegments, isSkippedForKnownLevel,
} from '../src/lib/tutor/lesson-plan/fixed-script';
import { parseLessonPlan } from '../src/lib/tutor/lesson-plan/parser';
import { renderStudentProfileBlock } from '../src/lib/tutor/student-profile/render';
import { emptyProfile } from '../src/lib/tutor/student-profile/store';
import type { LessonPlan } from '../src/lib/tutor/lesson-plan/types';

let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ok  ${name}`); } catch (e) { failed++; console.log(`  FAIL ${name}\n       ${(e as Error).message}`); }
}
const read = (p: string) => readFileSync(join(__dirname, '..', p), 'utf8');
/** Source pin without dumping the whole file on a miss. */
const pin = (src: string, re: RegExp) => assert.ok(re.test(src), `missing ${re}`);

const RAW = {
  id: 'test.fixed-script',
  title: 'Fixed script',
  curriculum: 'test',
  grade: 'adult',
  subject: 'languages',
  estimatedMinutes: 10,
  metadata: { fixedScript: true },
  segments: [
    { id: 'overview', kind: 'hook', goal: 'Welcome' },
    { id: 'level-check', kind: 'misconception_check', question: 'Tell me about your work.', misconception: 'n/a', metadata: { skipWhenLevelKnown: true } },
    { id: 'topic-intro', kind: 'concept', goal: 'Teach', keyIdeas: ['a'] },
    { id: 'recap', kind: 'recap', mustRemember: ['a'] },
  ],
};
const plan = (over: Partial<LessonPlan> = {}): LessonPlan => ({ ...parseLessonPlan(RAW), ...over });
const fixed = plan();
const ordinary = plan({ metadata: {} });
/** The flagged segment first: the case where the initial cursor moves. */
const flaggedFirst = plan({ segments: [fixed.segments[1], fixed.segments[0], ...fixed.segments.slice(2)] });

// ── isFixedScriptPlan / shouldRotatePlanContent ──────────────────────────
test('isFixedScriptPlan: true only for metadata.fixedScript === true', () => {
  assert.equal(isFixedScriptPlan(fixed), true);
  assert.equal(isFixedScriptPlan(ordinary), false);
  assert.equal(isFixedScriptPlan(plan({ metadata: { fixedScript: 'true' } })), false);
  assert.equal(isFixedScriptPlan(plan({ metadata: undefined })), false);
  assert.equal(isFixedScriptPlan(null), false);
  assert.equal(isFixedScriptPlan(undefined), false);
});
test('shouldRotatePlanContent: false for a fixed script, true otherwise', () => {
  assert.equal(shouldRotatePlanContent(fixed), false);
  assert.equal(shouldRotatePlanContent(ordinary), true);
  assert.equal(shouldRotatePlanContent(null), true);
});

// ── navigation ───────────────────────────────────────────────────────────
test('initialSegmentId: overview either way when overview is first', () => {
  assert.equal(initialSegmentId(fixed, false), 'overview');
  assert.equal(initialSegmentId(fixed, true), 'overview');
});
test('initialSegmentId: a flagged first segment is skipped only when the level is known', () => {
  assert.equal(initialSegmentId(flaggedFirst, false), 'level-check');
  assert.equal(initialSegmentId(flaggedFirst, true), 'overview');
});
test('nextSegmentId: overview → topic-intro when known, → level-check when not', () => {
  assert.equal(nextSegmentId(fixed, 'overview', true), 'topic-intro');
  assert.equal(nextSegmentId(fixed, 'overview', false), 'level-check');
  assert.equal(nextSegmentId(fixed, 'level-check', true), 'topic-intro');
});
test('nextSegmentId: end of plan → null; empty cursor resumes from the start', () => {
  assert.equal(nextSegmentId(fixed, 'recap', true), null);
  assert.equal(nextSegmentId(flaggedFirst, '', true), 'overview');
  assert.equal(nextSegmentId(flaggedFirst, '', false), 'level-check');
});
test('nextSegmentId: off-topic segments are skipped like resolveAdvanceTarget does', () => {
  const p = plan({ segments: [fixed.segments[0], { ...fixed.segments[2], offTopic: true } as never, fixed.segments[3]] });
  assert.equal(nextSegmentId(p, 'overview', false), 'recap');
});
test('a plan WITHOUT fixedScript never skips, even with the segment flag', () => {
  assert.equal(nextSegmentId(ordinary, 'overview', true), 'level-check');
  assert.equal(initialSegmentId(plan({ metadata: {}, segments: flaggedFirst.segments }), true), 'level-check');
});

// ── server-side segment index (brain-stream route resolves "next" itself) ─
test('markSkippedSegments marks the flagged entry only for fixed script + known level', () => {
  const idx = fixed.segments.map((s) => ({ id: s.id, kind: s.kind }));
  const marked = markSkippedSegments(idx, fixed, true);
  assert.deepEqual(marked.map((e) => isSkippedForKnownLevel(e)), [false, true, false, false]);
  assert.equal(markSkippedSegments(idx, fixed, false), idx, 'level unknown ⇒ same array');
  assert.equal(markSkippedSegments(idx, ordinary, true), idx, 'ordinary plan ⇒ same array');
});

// ── parser keeps segment metadata, adds nothing when absent ─────────────
test('parser passes segment metadata through and adds no key when absent', () => {
  assert.deepEqual((fixed.segments[1] as { metadata?: unknown }).metadata, { skipWhenLevelKnown: true });
  assert.equal('metadata' in fixed.segments[0], false);
  assert.equal(fixed.metadata?.fixedScript, true);
});

// ── no recall: the prior-sessions list leaves the profile block ──────────
test('renderStudentProfileBlock omitPriorSessions drops the history and the continuity opener', () => {
  const profile = {
    ...emptyProfile('s1'),
    recentSessions: [{ sessionId: 'a', endedAt: '2026-10-27T00:00:00Z', subject: 'languages', topic: 'work', losTouched: [], summary: 'Talked about projects.' }],
  } as ReturnType<typeof emptyProfile>;
  const normal = renderStudentProfileBlock(profile);
  const fixedBlock = renderStudentProfileBlock(profile, { omitPriorSessions: true });
  assert.match(normal, /prior sessions/);
  assert.doesNotMatch(fixedBlock, /prior sessions \(HISTORICAL|Talked about projects|last time we did/);
  assert.match(fixedBlock, /Do not open with a recap of prior sessions\./);
  assert.equal(renderStudentProfileBlock(profile, { omitPriorSessions: false }), normal, 'false ⇒ byte-identical');
});

// ── wiring pins ──────────────────────────────────────────────────────────
const vtr = read('src/app/tutor/components/VoiceTutorRealtime.tsx');
const route = read('src/app/api/tutor/brain/stream/route.ts');
const profileRoute = read('src/app/api/tutor/student-profile/[id]/route.ts');
test('VTR: initial cursor + profile-late re-seat use initialSegmentId', () => {
  pin(vtr, /const startSegId = initialSegmentId\(plan, !!workingLevelRef\.current\)/);
  pin(vtr, /reseatInitialSegmentForKnownLevel\(\)/);
});
test('VTR: advance_lesson "next" and the Skip button use nextSegmentId on fixed-script plans', () => {
  pin(vtr, /to === 'next' && isFixedScriptPlan\(plan\)\s*\?\s*nextSegmentId\(plan, fromSegId, !!workingLevelRef\.current\)/);
  pin(vtr, /isFixedScriptPlan\(skipPlan\)\s*\?\s*nextSegmentId\(skipPlan, skipFromSegId, !!workingLevelRef\.current\)/);
});
test('VTR: segment index sent to the route carries the skip marks', () => {
  pin(vtr, /segmentIndex: markSkippedSegments\(/);
  pin(route, /isSkippedForKnownLevel\(segIdx\[j\]\)/);
});
test('VTR: no recall — first-meeting journey, no transient block, no rotation', () => {
  pin(vtr, /hasPriorSessions: fixedScriptRef\.current \? false : studentHasPriorSessionsRef\.current/);
  pin(vtr, /fixedScriptRef\.current = data\?\.fixedScript === true/);
  pin(vtr, /fixedScriptActive\(\) \? null : transientContextBlockRef\.current/);
  pin(vtr, /captureContentFillings: true/);
  pin(vtr, /shouldRotatePlanContent\(lessonPlanRef\.current\) \? \{ captureContentFillings: true \}/);
  pin(vtr, /TUTOR_CONTENT_VARIETY && planContentSeenRef\.current && shouldRotatePlanContent\(plan\)/);
});
test('profile GET: a fixed-script plan gets no prior sessions, no learner context, and says so', () => {
  pin(profileRoute, /omitPriorSessions: fixedScript/);
  pin(profileRoute, /if \(fixedScript\) responseBody\.fixedScript = true/);
  pin(profileRoute, /TUTOR_LEARNER_CONTEXT === 'on' && lessonPlanId && !fixedScript/);
});
test('profile commit: no content fillings recorded for a fixed-script plan', () => {
  pin(profileRoute, /extractFillings: body\.captureContentFillings === true && !!body\.lessonPlanId && shouldRotatePlanContent\(lessonPlan\)/);
});
test('VTR: the opener prefetch waits for the profile on fixed-script plans', () => {
  pin(vtr, /isFixedScriptPlan\(lessonPlanRef\.current\) && !fixedScriptPromptReady\(\)/);
});

if (failed) { console.log(`\n${failed} failed`); process.exit(1); }
console.log('\nall passed');
