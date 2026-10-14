/**
 * Tests for scripts/practice-extend/plan-index.ts — the objective → plan
 * lookup of the practice-extension job, for both kinds of objective id:
 *   - generated courses: `gen-<uuid>.lo-N`, plan id = the id without `.lo-N`;
 *   - the older authored subjects: a seed LO (`geom.reflections`), whose
 *     plan is the single-LO seed plan (`evelyn.hs.geom.reflections.v1`),
 *     which is not in the Mongo dump and is added from SEED_PLANS.
 *
 * Pure — no network, no model, no database.
 * Run from apps/tutor:  npx tsx scripts/practice-extend/plan-index.test.ts
 */
import '../lib/no-db-env';
import assert from 'node:assert/strict';
import { planIdOfObjective, planMapOf, seedAsDumpPlan } from './plan-index';
import { SEED_PLANS } from '../../src/lib/tutor/lesson-plan/store';
import type { Plan } from './practice-extend';

let passed = 0;
function test(name: string, fn: () => void): void {
  try {
    fn();
    passed++;
  } catch (e) {
    console.error(`FAIL ${name}\n  ${(e as Error).message}`);
    process.exitCode = 1;
  }
}

test('a generated objective id maps to its plan id (the id without .lo-N)', () => {
  assert.equal(planIdOfObjective('gen-048bb219-e08d-428f-9d1e-4836b72fc38a.lo-2'), 'gen-048bb219-e08d-428f-9d1e-4836b72fc38a');
});

test('an older-subject seed LO maps to its seed plan', () => {
  assert.equal(planIdOfObjective('geom.reflections'), 'evelyn.hs.geom.reflections.v1');
  assert.equal(planIdOfObjective('alg1.slope-intercept-form'), 'evelyn.hs.alg1.slope-intercept-form.v1');
  assert.equal(planIdOfObjective('apstats.residuals'), SEED_PLANS.find((p) => p.los.some((l) => l.id === 'apstats.residuals'))!.id);
});

test('an unknown id without .lo-N is returned unchanged (no plan, no throw)', () => {
  assert.equal(planIdOfObjective('nope.not-an-objective'), 'nope.not-an-objective');
});

test('a seed plan in dump shape: topic = course slug, the material segments named <lo>-concept / -worked / -try', () => {
  const seed = SEED_PLANS.find((p) => p.id === 'evelyn.hs.geom.rotations.v1')!;
  const d = seedAsDumpPlan(seed);
  assert.equal(d._id, 'evelyn.hs.geom.rotations.v1');
  assert.equal(d.topic, 'geometry');
  assert.deepEqual(d.los.map((l) => l.id), ['geom.rotations']);
  const concept = d.segments.find((s) => s.id === 'geom.rotations-concept');
  assert.ok(concept?.goal && (concept.keyIdeas ?? []).length > 0, 'concept segment with goal and key ideas');
  const worked = d.segments.find((s) => s.id === 'geom.rotations-worked');
  assert.ok(worked?.problem && worked.answer, 'first worked example');
  const tr = d.segments.find((s) => s.id === 'geom.rotations-try');
  assert.ok(tr?.problem && tr.expectedAnswer, 'first try-yourself');
});

test('planMapOf: the dump plans as they are, plus every seed plan the dump does not hold', () => {
  const stored: Plan = { _id: 'gen-aaaa', title: 'Stored', topic: 'gen-topic', los: [{ id: 'gen-aaaa.lo-1', description: 'x' }], segments: [] };
  const m = planMapOf([stored]);
  assert.equal(m.get('gen-aaaa'), stored);
  const geo = m.get(planIdOfObjective('geom.reflections'));
  assert.ok(geo, 'seed plan found by the objective lookup');
  assert.equal(geo!.topic, 'geometry');
  assert.ok(geo!.los.some((l) => l.id === 'geom.reflections'));
  // A dump plan wins over a seed of the same id.
  const shadow: Plan = { _id: 'evelyn.hs.geom.reflections.v1', title: 'Shadow', los: [], segments: [] };
  assert.equal(planMapOf([shadow]).get('evelyn.hs.geom.reflections.v1'), shadow);
});

console.log(`plan-index: ${passed} passed${process.exitCode ? ', some FAILED' : ''}`);
