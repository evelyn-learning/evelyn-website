/**
 * Deterministic unit tests for Task H6 — the `test:pedagogy` CLI's own
 * logic (scenario map, arg parsing, `--list` formatting, unknown-taskId
 * handling). No framework — matches eval.test.ts / run-harness.test.ts /
 * personas.test.ts: node:assert + a tiny test() harness, PASS/FAIL
 * counters, non-zero exit on failure.
 *
 * NO network, NO server, NO browser — `runScenario` (the live Playwright
 * driver) is never imported or invoked here. `runGates` IS used (it's pure
 * — a sync function over an in-memory Bundle, no I/O) to resolve each
 * scenario row's `gateTaskIds` down to actual gate ids, so this suite can
 * verify the scenario map is wired to REAL, non-empty gate registrations
 * without needing a live Bundle.
 *
 * Run: npm run test:pedagogy-cli
 */
import { strict as assert } from 'node:assert';
import { PERSONA_IDS } from './fixtures/personas';
import {
  SCENARIO_MAP,
  gateIdsForRow,
  formatList,
  resolveTaskIds,
  type ScenarioRow,
} from './cli';

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

/** The 4 gate ids assertions.ts actually ships (proactive-opener,
 *  board-not-blank, no-sell-phrase, zero-persistence-demo) — see
 *  assertions.ts's REGISTRY doc comment. Mirrored here (not imported —
 *  assertions.ts doesn't export a "known gate ids" list) purely to bound
 *  this test's expectations. */
const KNOWN_GATE_IDS = ['proactive-opener', 'board-not-blank', 'no-sell-phrase', 'zero-persistence-demo'];

// ── SCENARIO_MAP well-formedness ─────────────────────────────────────────

test('SCENARIO_MAP is non-empty and includes the Phase-B rows from the brief', () => {
  for (const taskId of ['B2', 'B3', 'B4', 'B5', 'B6']) {
    assert.ok(taskId in SCENARIO_MAP, `${taskId} is a row in SCENARIO_MAP`);
  }
});

for (const [taskId, row] of Object.entries(SCENARIO_MAP)) {
  test(`SCENARIO_MAP[${taskId}]: has at least 1 persona`, () => {
    assert.ok(row.personas.length >= 1, `${taskId} row has >=1 persona`);
  });

  test(`SCENARIO_MAP[${taskId}]: every persona id is a real H1 fixture persona`, () => {
    for (const personaId of row.personas) {
      assert.ok(
        (PERSONA_IDS as readonly string[]).includes(personaId),
        `"${personaId}" (in ${taskId}) is a known persona id — got ${JSON.stringify(PERSONA_IDS)}`,
      );
    }
  });

  test(`SCENARIO_MAP[${taskId}]: every persona is a DEMO persona (subscribed is Phase-D-deferred)`, () => {
    // DEMO personas per run-harness.ts's DEMO_PICKER_START / H1 fixtures
    // (nina = the Store-B misquote regression persona, added 2026-07-03).
    const DEMO_IDS = ['maya', 'leo', 'aria', 'anon', 'sam', 'nina'];
    for (const personaId of row.personas) {
      assert.ok(DEMO_IDS.includes(personaId), `"${personaId}" (in ${taskId}) must be a DEMO persona, not subscribed`);
    }
  });

  test(`SCENARIO_MAP[${taskId}]: every gateTaskId resolves (via runGates) to >=1 real, known gate id`, () => {
    const ids = gateIdsForRow(row);
    assert.equal(ids.length, row.gateTaskIds.length === 0 ? 0 : ids.length, 'sanity: resolution ran');
    for (const gateTaskId of row.gateTaskIds) {
      const resolved = gateIdsForRow({ ...row, gateTaskIds: [gateTaskId] } as ScenarioRow);
      assert.ok(resolved.length > 0, `gateTaskId "${gateTaskId}" (in ${taskId}) resolves to at least one gate via runGates — an empty result means it's an unregistered/typo'd taskId`);
      for (const id of resolved) {
        assert.ok(KNOWN_GATE_IDS.includes(id), `resolved gate id "${id}" (from gateTaskId "${gateTaskId}" in ${taskId}) is one of H5's known gate ids`);
      }
    }
  });

  test(`SCENARIO_MAP[${taskId}]: rubric items have non-empty id and question`, () => {
    for (const item of row.rubric) {
      assert.ok(item.id.trim().length > 0, `rubric item in ${taskId} has a non-empty id`);
      assert.ok(item.question.trim().length > 0, `rubric item "${item.id}" in ${taskId} has a non-empty question`);
    }
  });
}

test('SCENARIO_MAP: B2 exercises proactive-opener for maya and anon', () => {
  assert.deepEqual(SCENARIO_MAP.B2.personas, ['maya', 'anon']);
  assert.deepEqual(gateIdsForRow(SCENARIO_MAP.B2), ['proactive-opener']);
});

test('SCENARIO_MAP: B3 exercises board-not-blank for maya', () => {
  assert.deepEqual(SCENARIO_MAP.B3.personas, ['maya']);
  assert.deepEqual(gateIdsForRow(SCENARIO_MAP.B3), ['board-not-blank']);
});

test('SCENARIO_MAP: B4 exercises proactive-opener across maya/leo/aria/anon', () => {
  assert.deepEqual(SCENARIO_MAP.B4.personas, ['maya', 'leo', 'aria', 'anon']);
  assert.deepEqual(gateIdsForRow(SCENARIO_MAP.B4), ['proactive-opener']);
});

test('SCENARIO_MAP: B5 has no L1 gates (leo, "I know it" is judge-only territory)', () => {
  assert.deepEqual(SCENARIO_MAP.B5.personas, ['leo']);
  assert.deepEqual(SCENARIO_MAP.B5.gateTaskIds, []);
  assert.deepEqual(gateIdsForRow(SCENARIO_MAP.B5), []);
});

test('SCENARIO_MAP: B6 exercises proactive-opener for maya (demo path)', () => {
  assert.deepEqual(SCENARIO_MAP.B6.personas, ['maya']);
  assert.deepEqual(gateIdsForRow(SCENARIO_MAP.B6), ['proactive-opener']);
});

// ── formatList ────────────────────────────────────────────────────────

test('formatList: contains every taskId', () => {
  const out = formatList(SCENARIO_MAP);
  for (const taskId of Object.keys(SCENARIO_MAP)) {
    assert.ok(out.includes(taskId), `--list output mentions ${taskId}`);
  }
});

test('formatList: contains every persona id for every row', () => {
  const out = formatList(SCENARIO_MAP);
  for (const row of Object.values(SCENARIO_MAP)) {
    for (const personaId of row.personas) {
      assert.ok(out.includes(personaId), `--list output mentions persona "${personaId}"`);
    }
  }
});

test('formatList: contains resolved gate ids (not just internal gateTaskIds)', () => {
  const out = formatList(SCENARIO_MAP);
  assert.ok(out.includes('proactive-opener'), '--list output surfaces the real gate id "proactive-opener", not just "B2"');
  assert.ok(out.includes('board-not-blank'), '--list output surfaces the real gate id "board-not-blank"');
});

test('formatList: contains every rubric item id for every row', () => {
  const out = formatList(SCENARIO_MAP);
  for (const row of Object.values(SCENARIO_MAP)) {
    for (const item of row.rubric) {
      assert.ok(out.includes(item.id), `--list output mentions rubric item "${item.id}"`);
    }
  }
});

test('formatList: is pure — same input yields identical output', () => {
  assert.equal(formatList(SCENARIO_MAP), formatList(SCENARIO_MAP));
});

// ── resolveTaskIds ────────────────────────────────────────────────────

test('resolveTaskIds: "all" returns every taskId in the map', () => {
  const ids = resolveTaskIds(SCENARIO_MAP, 'all');
  assert.deepEqual(new Set(ids), new Set(Object.keys(SCENARIO_MAP)));
});

test('resolveTaskIds: a known taskId returns just that taskId', () => {
  assert.deepEqual(resolveTaskIds(SCENARIO_MAP, 'B2'), ['B2']);
});

test('resolveTaskIds: an unknown taskId throws a clear error naming the taskId', () => {
  assert.throws(
    () => resolveTaskIds(SCENARIO_MAP, 'Z99'),
    (err: unknown) => {
      const msg = (err as Error).message;
      return /Z99/.test(msg) && /unknown/i.test(msg);
    },
    'error message names the bad taskId and says "unknown"',
  );
});

test('resolveTaskIds: an unknown taskId error message lists the known taskIds (discoverability)', () => {
  assert.throws(() => resolveTaskIds(SCENARIO_MAP, 'nope'), (err: unknown) => {
    const msg = (err as Error).message;
    return Object.keys(SCENARIO_MAP).every((id) => msg.includes(id));
  });
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
