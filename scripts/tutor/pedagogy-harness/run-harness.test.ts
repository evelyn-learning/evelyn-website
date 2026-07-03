/**
 * Deterministic unit tests for the pedagogy harness driver's PURE helpers
 * (Task H4) — `personaToPickerStart` and `assembleBundle`. No framework —
 * matches student-simulator.test.ts / fixtures/personas/personas.test.ts:
 * node:assert + a tiny test() harness, PASS/FAIL counters, non-zero exit on
 * failure.
 *
 * NO network, NO browser, NO dev server — these two functions are pure data
 * transforms. `runScenario` itself (the Playwright driver) is exercised by
 * the gated smoke instead (run-harness.smoke.ts, npm run test:pedagogy-driver).
 *
 * Run: npm run test:pedagogy-driver-unit
 */
import { strict as assert } from 'node:assert';
import { loadPersona, PERSONA_IDS } from './fixtures/personas';
import { personaToPickerStart, assembleBundle, DEMO_PICKER_START, type RawCapturedTurn } from './run-harness';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void): void {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.log(`  ✗ ${name}\n      ${(err as Error).message}`);
    failed++;
  }
}

const DEMO_IDS = ['maya', 'leo', 'aria', 'anon', 'sam'];
const SUBSCRIBED_IDS = ['priya', 'noah', 'zoe', 'kai', 'diego', 'ravi'];

// ── personaToPickerStart: DEMO personas ─────────────────────────────────
for (const id of DEMO_IDS) {
  test(`personaToPickerStart(${id}): returns a real (subject, level, topic, lessonPlanId) from DEMO_PICKER_START`, () => {
    const persona = loadPersona(id);
    const cfg = personaToPickerStart(persona);
    assert.equal(cfg.subject, DEMO_PICKER_START[id].subject);
    assert.equal(cfg.level, DEMO_PICKER_START[id].level);
    assert.equal(cfg.topic, DEMO_PICKER_START[id].topic);
    assert.equal(cfg.lessonPlanId, DEMO_PICKER_START[id].lessonPlanId);
    assert.ok(cfg.lessonPlanId.startsWith('evelyn.'), 'lessonPlanId looks like a real catalog id');
  });
}

test('personaToPickerStart(anon): studentName is omitted (logged-out/anonymous fixture)', () => {
  const anon = loadPersona('anon');
  const cfg = personaToPickerStart(anon);
  assert.equal(cfg.studentName, undefined);
});

for (const id of ['maya', 'leo', 'aria', 'sam']) {
  test(`personaToPickerStart(${id}): studentName is a non-empty capitalized string`, () => {
    const persona = loadPersona(id);
    const cfg = personaToPickerStart(persona);
    assert.ok(cfg.studentName && cfg.studentName.length > 0);
    assert.equal(cfg.studentName![0], cfg.studentName![0].toUpperCase());
  });
}

// ── personaToPickerStart: SUBSCRIBED personas throw a clear deferral ────
for (const id of SUBSCRIBED_IDS) {
  test(`personaToPickerStart(${id}): throws a clear "deferred" error (subscribed-context injection out of scope)`, () => {
    const persona = loadPersona(id);
    assert.equal(persona.mode, 'subscribed', 'fixture sanity: this persona really is subscribed');
    assert.throws(
      () => personaToPickerStart(persona),
      (err: unknown) => {
        const msg = (err as Error).message;
        return /deferred/i.test(msg) && /Phase D/i.test(msg) && msg.includes(id);
      },
      'error message names the persona and says DEFERRED / Phase D',
    );
  });
}

test('personaToPickerStart: every DEMO_PICKER_START key is a known persona id', () => {
  for (const id of Object.keys(DEMO_PICKER_START)) {
    assert.ok((PERSONA_IDS as readonly string[]).includes(id), `${id} is a real persona id`);
  }
});

// ── assembleBundle ────────────────────────────────────────────────────
test('assembleBundle: stamps sequential 0-based index and carries persona id/mode through', () => {
  const maya = loadPersona('maya');
  const raw: RawCapturedTurn[] = [
    { tutorText: 'Hi! Ready to factor some quadratics?', toolCalls: [], boardState: '00-turn-0.png', studentReply: 'sure', ended: false },
    { tutorText: 'Great — try x^2 - 5x + 6.', toolCalls: [{ message: 'Whiteboard tool: show_equation' }], boardState: '01-turn-1.png', studentReply: '(x-2)(x-3)', ended: false },
  ];
  const bundle = assembleBundle(maya, raw, { baseUrl: 'http://localhost:3006', maxTurns: 3 });
  assert.equal(bundle.persona.id, 'maya');
  assert.equal(bundle.persona.mode, 'demo');
  assert.equal(bundle.turns.length, 2);
  assert.equal(bundle.turns[0].index, 0);
  assert.equal(bundle.turns[1].index, 1);
  assert.equal(bundle.turns[1].toolCalls.length, 1);
  assert.deepEqual(bundle.meta, { baseUrl: 'http://localhost:3006', maxTurns: 3 });
});

test('assembleBundle: omits sessionResult entirely when not provided (never fabricated)', () => {
  const maya = loadPersona('maya');
  const bundle = assembleBundle(maya, [], { baseUrl: 'http://localhost:3006', maxTurns: 1 });
  assert.equal('sessionResult' in bundle, false);
});

test('assembleBundle: includes sessionResult when provided, even falsy-but-defined values', () => {
  const maya = loadPersona('maya');
  const bundle = assembleBundle(maya, [], { baseUrl: 'http://localhost:3006', maxTurns: 1 }, { completed: false });
  assert.equal('sessionResult' in bundle, true);
  assert.deepEqual(bundle.sessionResult, { completed: false });
});

test('assembleBundle: an empty rawTurns array (e.g. immediate student disengage) yields turns: []', () => {
  const anon = loadPersona('anon');
  const bundle = assembleBundle(anon, [], { baseUrl: 'http://localhost:3006', maxTurns: 5 });
  assert.deepEqual(bundle.turns, []);
});

test('assembleBundle: taskId flows through meta when provided', () => {
  const maya = loadPersona('maya');
  const bundle = assembleBundle(maya, [], { baseUrl: 'http://localhost:3006', maxTurns: 1, taskId: 'H4-smoke' });
  assert.equal(bundle.meta.taskId, 'H4-smoke');
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
