// scripts/test-practice-assign-routes.ts
import { strict as assert } from 'node:assert';
import { parseDraftBody, parseFinalizeBody } from '../src/lib/tutor/practice-assign/route-bodies';
assert.deepEqual(parseDraftBody({ studentId: 's', sessionId: 'x', loIds: ['a', 3, 'b'], trigger: 'recurrence:a', locator: 'Unit 2 · Practice' }),
  { ok: true, value: { studentId: 's', sessionId: 'x', loIds: ['a', 'b'], trigger: 'recurrence:a', locator: 'Unit 2 · Practice', lessonPlanId: undefined, courseId: undefined, subject: undefined } });
assert.equal(parseDraftBody({ studentId: 's', sessionId: 'x', loIds: [] }).ok, false);
assert.deepEqual(parseFinalizeBody({ studentId: 's', sessionId: 'x', source: 'close_tool', reason: ' r ', nextTimeIntent: 'n' }),
  { ok: true, value: { studentId: 's', sessionId: 'x', source: 'close_tool', reason: 'r', nextTimeIntent: 'n', locator: undefined } });
assert.equal(parseFinalizeBody({ studentId: 's', sessionId: 'x', source: 'bogus' }).ok, false);

// Final fix wave (I3): the assessment builder never generates unless
// PRACTICE_GEN_ASSESSMENT=on — even with PRACTICE_GEN=on.
import { buildAssessment, assessmentGenSources } from '../src/lib/tutor/portal/assessment';
import { NO_GEN_SOURCES } from '../src/lib/tutor/practice-assign/resolve';
import type { PracticeSources } from '../src/lib/tutor/portal/practice';
import type { PracticeGenSources } from '../src/lib/tutor/portal/practice-gen';
assert.equal(assessmentGenSources(undefined), NO_GEN_SOURCES);
assert.equal(assessmentGenSources('off'), NO_GEN_SOURCES);
assert.equal(assessmentGenSources('on'), undefined);
(async () => {
  const prevGen = process.env.PRACTICE_GEN, prevAssess = process.env.PRACTICE_GEN_ASSESSMENT;
  process.env.PRACTICE_GEN = 'on';
  delete process.env.PRACTICE_GEN_ASSESSMENT;
  // A shortfall (no bank, no plan items) on an LO whose plan has a topic — the
  // exact shape that makes retrievePractice generate when handed real sources.
  const sources = {
    plansForLoId: async () => [{ id: 'p1', topic: 'Linear equations', los: [{ id: 'lo-1' }], segments: [] }],
    bankForLoId: async () => [],
    plansForTopic: async () => [],
    bankForTopic: async () => [],
  } as unknown as PracticeSources;
  // The default argument is what the route uses; prove it is the zero-slot
  // stub, then run the builder with a spy that mirrors it.
  assert.equal(assessmentGenSources(), NO_GEN_SOURCES);
  let reserved = 0, generated = 0;
  const spy: PracticeGenSources = {
    async generateAndVerify() { generated++; return null; },
    async reserve(...a: unknown[]) { reserved++; return (NO_GEN_SOURCES.reserve as (...x: unknown[]) => Promise<number>)(...a); },
    async persist() {},
  };
  const set = await buildAssessment({ studentId: 's', courseId: 'c', loIds: ['lo-1'], maxPerLo: 3 } as never, sources, spy);
  assert.equal(generated, 0, 'assessment with PRACTICE_GEN=on and PRACTICE_GEN_ASSESSMENT unset never calls the generator');
  assert.equal(reserved, 1, 'the shortfall path was reached (so the zero-slot stub is what stopped generation)');
  assert.equal(set.items.length, 0);
  const assessSrc = (await import('node:fs')).readFileSync(require('node:path').join(__dirname, '..', 'src/lib/tutor/portal/assessment.ts'), 'utf8');
  assert.ok(assessSrc.includes('genSources: PracticeGenSources | undefined = assessmentGenSources(),') && /sources,\s*genSources,\s*\);/.test(assessSrc), 'wiring: buildAssessment threads the no-gen default into retrievePractice');
  if (prevGen === undefined) delete process.env.PRACTICE_GEN; else process.env.PRACTICE_GEN = prevGen;
  if (prevAssess !== undefined) process.env.PRACTICE_GEN_ASSESSMENT = prevAssess;
  console.log('practice-assign-routes: all assertions passed');
})().catch((e) => { console.error(e); process.exit(1); });
