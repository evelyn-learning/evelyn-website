/**
 * Unit tests for content-variety seen-memory + directive (Phase 1).
 * Run: npm run test:content-variety
 * Design: docs/superpowers/specs/2026-07-05-teaching-variety-plan-freedom-design.md
 */
import { strict as assert } from 'node:assert';
import { recordPlanContentSeen, PLAN_CONTENT_SEEN_CAP } from '../src/lib/tutor/student-profile/store';
import { buildContentVarietyDirective } from '../src/lib/tutor/voice/claude-brain';
import type { StudentProfile, PlanContentFillings } from '../src/lib/tutor/student-profile/types';

let passed = 0, failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (e) { console.log(`  ✗ ${name}\n      ${(e as Error).message}`); failed++; }
}
function makeProfile(): StudentProfile {
  return {
    id: 's1', mastery: {}, gaps: [], recentSessions: [],
    preferences: {}, createdAt: '2026-07-05T00:00:00.000Z',
    updatedAt: '2026-07-05T00:00:00.000Z', schemaVersion: 1,
  } as StudentProfile;
}
const F = (over: Partial<PlanContentFillings> = {}): PlanContentFillings =>
  ({ hooks: [], examples: [], problems: [], ...over });

console.log('recordPlanContentSeen:');

test('records fillings under the plan id', () => {
  const p = recordPlanContentSeen(makeProfile(), 'plan-A', F({ hooks: ['garden fence'] }));
  assert.deepEqual(p.planContentSeen?.['plan-A']?.hooks, ['garden fence']);
});

test('separate plans are isolated', () => {
  let p = recordPlanContentSeen(makeProfile(), 'plan-A', F({ hooks: ['a'] }));
  p = recordPlanContentSeen(p, 'plan-B', F({ hooks: ['b'] }));
  assert.deepEqual(p.planContentSeen?.['plan-A']?.hooks, ['a']);
  assert.deepEqual(p.planContentSeen?.['plan-B']?.hooks, ['b']);
});

test('appends across sessions, newest last', () => {
  let p = recordPlanContentSeen(makeProfile(), 'plan-A', F({ hooks: ['h1'] }));
  p = recordPlanContentSeen(p, 'plan-A', F({ hooks: ['h2'] }));
  assert.deepEqual(p.planContentSeen?.['plan-A']?.hooks, ['h1', 'h2']);
});

test(`FIFO cap at ${PLAN_CONTENT_SEEN_CAP} (oldest dropped)`, () => {
  let p = makeProfile();
  for (const h of ['h1', 'h2', 'h3', 'h4']) p = recordPlanContentSeen(p, 'plan-A', F({ hooks: [h] }));
  assert.deepEqual(p.planContentSeen?.['plan-A']?.hooks, ['h2', 'h3', 'h4']);
});

test('case-insensitive dedup keeps newest position', () => {
  let p = recordPlanContentSeen(makeProfile(), 'plan-A', F({ examples: ['5x3 Rug'] }));
  p = recordPlanContentSeen(p, 'plan-A', F({ examples: ['5X3 rug'] }));
  assert.deepEqual(p.planContentSeen?.['plan-A']?.examples, ['5X3 rug']);
});

test('empty fillings is a no-op (no empty strings stored)', () => {
  const p = recordPlanContentSeen(makeProfile(), 'plan-A', F({ hooks: ['', '  '] }));
  assert.deepEqual(p.planContentSeen?.['plan-A']?.hooks ?? [], []);
});

test('does not mutate the input profile', () => {
  const orig = makeProfile();
  recordPlanContentSeen(orig, 'plan-A', F({ hooks: ['x'] }));
  assert.equal(orig.planContentSeen, undefined);
});

console.log('\nbuildContentVarietyDirective:');

test('undefined seen → empty string (byte-identical when absent)', () => {
  assert.equal(buildContentVarietyDirective(undefined), '');
});

test('all-empty slots → empty string', () => {
  assert.equal(buildContentVarietyDirective({ hooks: [], examples: [], problems: [] }), '');
});

test('non-empty → renders a content_variety block listing seen fillings', () => {
  const out = buildContentVarietyDirective({ hooks: ['garden fence'], examples: ['5x3 rug'], problems: [] });
  assert.match(out, /<content_variety>/);
  assert.match(out, /<\/content_variety>/);
  assert.match(out, /garden fence/);
  assert.match(out, /5x3 rug/);
});

test('directive tells the brain to differ + keep LOs/difficulty/misconception', () => {
  const out = buildContentVarietyDirective({ hooks: ['h'], examples: [], problems: [] });
  assert.match(out, /different/i);
  assert.match(out, /difficulty/i);
  assert.match(out, /misconception/i);
});

test('directive routes practice problems through generate_problem (phase 2)', () => {
  const out = buildContentVarietyDirective({ hooks: ['h'], examples: [], problems: [] });
  assert.match(out, /generate_problem/);
  assert.match(out, /verbatim/i);
});

test('omits an empty slot from the listing', () => {
  const out = buildContentVarietyDirective({ hooks: ['h'], examples: [], problems: [] });
  assert.doesNotMatch(out, /worked-example contexts/i);
});

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
