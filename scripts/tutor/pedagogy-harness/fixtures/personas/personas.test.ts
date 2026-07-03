/**
 * Fixture personas — unit tests for the pedagogy-harness "test accounts"
 * (Task H1). No framework — matches scripts/test-conic-construction.ts /
 * scripts/test-graph-consistency.ts: node:assert + a tiny test() harness,
 * PASS/FAIL counters, non-zero exit on failure.
 *
 * Run: npm run test:pedagogy-personas
 *
 * Covers:
 *   - all 11 personas load and carry the required Persona fields
 *   - every subscribed persona's studentContext (+ sam's trial one, +
 *     diego's diagnostic variant) PARSES against the real portal-contract
 *     StudentContextSchema (@evelyn/portal-contract/v1, v1.5.0)
 *   - demo logged-out personas (maya/leo/aria/anon) have NO studentContext
 *   - priya's anti-repetition Spider-Man thread has lastReferencedAt set
 *   - zoe (parental opt-out) has socialMemoryLevel 'off' and no threads
 *   - ravi's resumeState / staleResumeState straddle RESUME_MAX_AGE_MS
 */

import { strict as assert } from 'node:assert';
import { StudentContextSchema, RESUME_MAX_AGE_MS } from '@evelyn/portal-contract/v1';
import { loadPersona, allPersonas } from './index';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.log(`  ✗ ${name}\n      ${(err as Error).message}`);
    failed++;
  }
}

const ALL_IDS = ['maya', 'leo', 'aria', 'sam', 'anon', 'priya', 'noah', 'zoe', 'kai', 'diego', 'ravi'];
const DEMO_LOGGED_OUT = ['maya', 'leo', 'aria', 'anon'];
const SUBSCRIBED = ['priya', 'noah', 'zoe', 'kai', 'diego', 'ravi'];
const SIM_PROFILE_STRING_FIELDS = ['grade', 'topic', 'claim', 'actualLevel', 'intent', 'style'] as const;

// ── Roster ───────────────────────────────────────────────────────────────
test('allPersonas() returns exactly the 11 authored personas', () => {
  const all = allPersonas();
  assert.equal(all.length, 11, `expected 11 personas, got ${all.length}`);
  assert.deepEqual(all.map((p) => p.id).sort(), [...ALL_IDS].sort());
});

// ── Every persona: required Persona fields ──────────────────────────────
for (const id of ALL_IDS) {
  test(`${id}: loadPersona has required Persona fields`, () => {
    const p = loadPersona(id) as any;
    assert.equal(p.id, id);
    assert.ok(p.mode === 'demo' || p.mode === 'subscribed', `mode is 'demo'|'subscribed', got ${p.mode}`);
    assert.ok(p.simProfile && typeof p.simProfile === 'object', 'simProfile present');
    for (const key of SIM_PROFILE_STRING_FIELDS) {
      assert.ok(
        typeof p.simProfile[key] === 'string' && p.simProfile[key].length > 0,
        `simProfile.${key} is a non-empty string`,
      );
    }
  });
}

// ── Demo logged-out personas: no durable portal state ───────────────────
for (const id of DEMO_LOGGED_OUT) {
  test(`${id}: logged-out demo persona has NO studentContext`, () => {
    const p = loadPersona(id) as any;
    assert.equal(p.mode, 'demo');
    assert.equal(p.studentContext, undefined);
  });
}

// ── sam: the one demo persona WITH a (trial) studentContext ─────────────
test("sam: trial studentContext PARSES against StudentContextSchema, isTrial true, social memory forced off", () => {
  const p = loadPersona('sam') as any;
  assert.ok(p.studentContext, 'sam has a studentContext');
  const parsed = StudentContextSchema.parse(p.studentContext);
  assert.equal(parsed.isTrial, true);
  assert.equal(parsed.preferences.socialMemoryLevel, 'off');
  assert.equal(parsed.profile.name, 'Trial student');
  assert.equal(parsed.profile.grade, 'unknown');
  assert.equal(parsed.socialMemory, undefined, 'no social threads for a trial');
});

// ── Subscribed personas: durable studentContext, isTrial false ──────────
for (const id of SUBSCRIBED) {
  test(`${id}: subscribed studentContext PARSES against StudentContextSchema (isTrial false)`, () => {
    const p = loadPersona(id) as any;
    assert.ok(p.studentContext, `${id} has a studentContext`);
    const parsed = StudentContextSchema.parse(p.studentContext);
    assert.equal(parsed.isTrial, false);
  });
}

// ── diego: diagnostic-target studentContext variant ─────────────────────
test('diego: studentContextDiagnostic PARSES with target.kind === "diagnostic" and loIds', () => {
  const p = loadPersona('diego') as any;
  assert.ok(p.studentContextDiagnostic, 'diego has a studentContextDiagnostic variant');
  const parsed = StudentContextSchema.parse(p.studentContextDiagnostic);
  assert.equal(parsed.target.kind, 'diagnostic');
  assert.ok('loIds' in parsed.target && Array.isArray(parsed.target.loIds) && parsed.target.loIds.length > 0);
});

// ── priya: anti-repetition target (Spider-Man thread, lastReferencedAt) ──
test('priya: has a socialMemory thread mentioning Spider-Man with lastReferencedAt set', () => {
  const p = loadPersona('priya') as any;
  const parsed = StudentContextSchema.parse(p.studentContext);
  const threads = parsed.socialMemory ?? [];
  const spidey = threads.find((t) => /spider-?man/i.test(t.note));
  assert.ok(spidey, 'a socialMemory thread mentions Spider-Man');
  assert.ok(spidey!.lastReferencedAt, 'that thread has lastReferencedAt set');
});

// ── zoe: parental opt-out privacy tripwire ──────────────────────────────
test('zoe: socialMemoryLevel is "off" and NO social threads are present at all', () => {
  const p = loadPersona('zoe') as any;
  const parsed = StudentContextSchema.parse(p.studentContext);
  assert.equal(parsed.preferences.socialMemoryLevel, 'off');
  assert.equal(parsed.socialMemory, undefined, 'no socialMemory threads present (parental opt-out)');
});

// ── kai: confirmed gap + high-confidence mastery ────────────────────────
test('kai: profile has one LO with score >= 0.8 / exposures >= 2 / confidence "high", and one confirmed gap', () => {
  const p = loadPersona('kai') as any;
  const masteryEntries = Object.values(p.profile.mastery) as Array<{ score: number; exposures: number; confidence?: string }>;
  const strong = masteryEntries.find((m) => m.score >= 0.8 && m.exposures >= 2 && m.confidence === 'high');
  assert.ok(strong, 'a mastery entry meets the high-confidence bar');
  const confirmedGap = p.profile.gaps.find((g: any) => g.status === 'confirmed');
  assert.ok(confirmedGap, 'a confirmed gap is present');
});

// ── ravi: resume-window straddle ────────────────────────────────────────
test('ravi: resumeState is within RESUME_MAX_AGE_MS, staleResumeState is older than it', () => {
  const p = loadPersona('ravi') as any;
  const now = Date.now();
  const freshAge = now - new Date(p.resumeState.updatedAtISO).getTime();
  const staleAge = now - new Date(p.staleResumeState.updatedAtISO).getTime();
  assert.ok(freshAge >= 0 && freshAge < RESUME_MAX_AGE_MS, `resumeState within resume window (age=${freshAge}ms)`);
  assert.ok(staleAge > RESUME_MAX_AGE_MS, `staleResumeState older than resume window (age=${staleAge}ms)`);
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
