/**
 * test:generated-lo-ids — generated plans must mint GLOBALLY UNIQUE LO ids.
 *
 * Regression guard for the final-review C1 finding: Stage 1 mints plan-LOCAL
 * ids ("lo-1", "lo-2"), and everything downstream keys off them — the portal
 * adopts `plan.los[0].id` onto a CourseNode and its learner model is keyed
 * `(studentId, loId)` with NO course scope. Plan-local ids therefore collapse
 * every generated course, for every student, onto the same handful of keys.
 * `namespaceGeneratedLos` scopes them under the plan id; these assertions pin
 * that the rewrite reaches the segment ids too (so `loGroupOf` still recovers
 * the owning LO) and that the picker plan's four brain-facing surfaces agree.
 *
 * Pure — no LLM call, no DB.
 */
import assert from 'node:assert/strict';
import {
  mintGeneratedPlanId,
  namespaceGeneratedLos,
  buildPickerPlan,
  fallbackPlan,
} from '../apps/marketing/src/lib/tutor/lesson-plan/generate-from-text';
import { loGroupOf } from '../apps/marketing/src/lib/tutor/lesson-plan/context';
import type { LearningObjective, Segment } from '../apps/marketing/src/lib/tutor/lesson-plan/types';

/* 1. mintGeneratedPlanId — unique within a single millisecond (M3: the old
      `freestyle-${Date.now()}` collided under the org batch's concurrency 2). */
const ids = new Set<string>();
for (let i = 0; i < 5000; i++) ids.add(mintGeneratedPlanId());
assert.equal(ids.size, 5000, 'mintGeneratedPlanId must not collide within a tight loop');
assert.ok(mintGeneratedPlanId('freestyle-fallback').startsWith('freestyle-fallback-'), 'prefix honored');

/* 2. namespaceGeneratedLos — LO ids scoped, segment ids carried along. */
const los: LearningObjective[] = [
  { id: 'lo-1', description: 'First' },
  { id: 'lo-2', description: 'Second' },
];
const segments: Segment[] = [
  { id: 'lo-1-hook', kind: 'hook', goal: 'g' },
  { id: 'lo-1-concept', kind: 'concept', goal: 'g', keyIdeas: ['k'] },
  { id: 'lo-1-worked', kind: 'worked_example', problem: 'p', steps: ['s'], answer: 'a' },
  { id: 'lo-2-try', kind: 'try_yourself', problem: 'p', expectedAnswer: 'a' },
  { id: 'freestyled-id', kind: 'concept', goal: 'g', keyIdeas: ['k'] },
];
const planId = 'gen-abc-123';
const ns = namespaceGeneratedLos({ planId, los, segments });
assert.deepEqual(ns.los.map((l) => l.id), ['gen-abc-123.lo-1', 'gen-abc-123.lo-2']);
assert.deepEqual(ns.los.map((l) => l.description), ['First', 'Second'], 'non-id fields preserved');
assert.deepEqual(ns.segments.map((s) => s.id), [
  'gen-abc-123.lo-1-hook',
  'gen-abc-123.lo-1-concept',
  'gen-abc-123.lo-1-worked',
  'gen-abc-123.lo-2-try',
  'freestyled-id', // off-convention ids are left alone, as loGroupOf documents
]);
// loGroupOf must still recover the owning LO from every rewritten segment id.
for (const seg of ns.segments.slice(0, 4)) {
  const group = loGroupOf(seg.id);
  assert.ok(
    ns.los.some((l) => l.id === group),
    `loGroupOf("${seg.id}") = "${group}" must match a plan LO id`,
  );
}
assert.equal(namespaceGeneratedLos({ planId, los, segments: [] }).segments.length, 0, 'segments optional');

/* 3. Prefix safety: "lo-1" must not eat "lo-10-hook". */
const many: LearningObjective[] = Array.from({ length: 10 }, (_, i) => ({
  id: `lo-${i + 1}`,
  description: `LO ${i + 1}`,
}));
const manySegs: Segment[] = [
  { id: 'lo-1-hook', kind: 'hook', goal: 'g' },
  { id: 'lo-10-hook', kind: 'hook', goal: 'g' },
];
const nsMany = namespaceGeneratedLos({ planId: 'p', los: many, segments: manySegs });
assert.deepEqual(nsMany.segments.map((s) => s.id), ['p.lo-1-hook', 'p.lo-10-hook']);

/* 4. buildPickerPlan — all four brain-facing surfaces carry the SAME scoped
      ids (plan.los, keyIdeas, the TSV reference, metadata.availableLOs), and
      two picker plans built from identical input never share an LO id. */
const picker = buildPickerPlan({
  input: { text: 't', subject: 'math', grade: '9-12', locale: 'en' },
  titleSuggestion: 'Picker',
  los: [
    { id: 'lo-1', description: 'Alpha' },
    { id: 'lo-2', description: 'Beta' },
  ],
  allowedMaxLOs: 1,
  sessionMinutes: 20,
  planId: 'gen-picker-1',
});
assert.deepEqual(picker.los.map((l) => l.id), ['gen-picker-1.lo-1', 'gen-picker-1.lo-2']);
const pickerSeg = picker.segments.find((s) => s.id === 'pick-los');
assert.ok(pickerSeg && 'keyIdeas' in pickerSeg && Array.isArray(pickerSeg.keyIdeas));
assert.deepEqual(pickerSeg.keyIdeas, ['gen-picker-1.lo-1: Alpha', 'gen-picker-1.lo-2: Beta']);
const tsv = (pickerSeg as { references?: Array<{ content?: string }> }).references?.[0]?.content ?? '';
assert.ok(tsv.includes('gen-picker-1.lo-1'), 'TSV reference carries the scoped id');
assert.deepEqual(
  (picker.metadata?.availableLOs as Array<{ id: string }>).map((l) => l.id),
  ['gen-picker-1.lo-1', 'gen-picker-1.lo-2'],
);
const pickerA = buildPickerPlan({
  input: { text: 't', subject: 'math', grade: '9-12' },
  titleSuggestion: 'P', los: [{ id: 'lo-1', description: 'x' }], allowedMaxLOs: 1, sessionMinutes: 20,
});
const pickerB = buildPickerPlan({
  input: { text: 't', subject: 'math', grade: '9-12' },
  titleSuggestion: 'P', los: [{ id: 'lo-1', description: 'x' }], allowedMaxLOs: 1, sessionMinutes: 20,
});
assert.notEqual(pickerA.id, pickerB.id, 'two picker plans must not share a plan id');
assert.notEqual(pickerA.los[0].id, pickerB.los[0].id, 'two picker plans must not share an LO id');

/* 5. fallbackPlan — scoped too (a fallback session still emits evidence), and
      its single segment groups back to its LO. */
const fb1 = fallbackPlan({ text: 't', subject: 'math', grade: '9-12' }, 'reason');
const fb2 = fallbackPlan({ text: 't', subject: 'math', grade: '9-12' }, 'reason');
assert.notEqual(fb1.los[0].id, fb2.los[0].id, 'two fallback plans must not share an LO id');
assert.equal(fb1.los[0].id, `${fb1.id}.lo-1`);
assert.equal(loGroupOf(fb1.segments[0].id), fb1.los[0].id, 'fallback segment groups to its LO');
const fb3 = fallbackPlan({ text: 't', subject: 'math', grade: '9-12' }, 'reason', 'gen-supplied-id');
assert.equal(fb3.id, 'gen-supplied-id');
assert.equal(fb3.los[0].id, 'gen-supplied-id.lo-1');

console.log('test-generated-lo-ids: all assertions passed');
