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
import { DEMO_PICKER_START, SUBSCRIBED_PICKER_START } from './run-harness';
import {
  SCENARIO_MAP,
  REPLAY_TASK_IDS,
  buildReplayRubric,
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

  test(`SCENARIO_MAP[${taskId}]: every persona is DRIVER-SUPPORTED (demo picker map or subscribed picker map)`, () => {
    // Task H2 rework of the old "must be a DEMO persona" test: subscribed
    // personas are now runnable, but ONLY the ones the driver actually maps
    // (SUBSCRIBED_PICKER_START). A persona id in neither map would make
    // runScenario throw at start — this keeps the scenario map honest
    // against the driver's real coverage instead of a hardcoded id list.
    for (const personaId of row.personas) {
      assert.ok(
        personaId in DEMO_PICKER_START || personaId in SUBSCRIBED_PICKER_START,
        `"${personaId}" (in ${taskId}) must be driver-supported — present in DEMO_PICKER_START or SUBSCRIBED_PICKER_START`,
      );
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

test('SCENARIO_MAP: E2 exercises no-sell-phrase for maya (demo soft close) with the close-never-greasy rubric', () => {
  assert.deepEqual(SCENARIO_MAP.E2.personas, ['maya']);
  assert.deepEqual(gateIdsForRow(SCENARIO_MAP.E2), ['no-sell-phrase']);
  assert.deepEqual(SCENARIO_MAP.E2.rubric.map((r) => r.id), ['close-never-greasy']);
});

test('SCENARIO_MAP: E2 shrinks the session budget to 5 minutes and raises the turn budget to 8 (live-testable close)', () => {
  assert.equal(SCENARIO_MAP.E2.driverOpts?.sessionMaxMinutes, 5, 'driver override reaches the row');
  assert.equal(SCENARIO_MAP.E2.maxTurns, 8, 'enough turns to actually reach the wind-down');
});

test('SCENARIO_MAP: E2 rubric tells the judge about the ~5-minute budget (an ending SHOULD occur)', () => {
  const q = SCENARIO_MAP.E2.rubric[0].question;
  assert.ok(/5-minute budget/.test(q), 'question mentions the ~5-minute budget');
  assert.ok(/SHOULD bring it to a satisfying close/.test(q), 'question frames the ending as expected, not a failure');
  assert.ok(/without ever pitching, selling, or steering toward signup/.test(q), 'no-sell substance kept');
});

// ── Subscribed rows (Task H2) ────────────────────────────────────────────

test('SCENARIO_MAP: S1 runs priya with the proactive-opener gate + the 3 warm-resume rubric items', () => {
  assert.deepEqual(SCENARIO_MAP.S1.personas, ['priya']);
  assert.deepEqual(gateIdsForRow(SCENARIO_MAP.S1), ['proactive-opener']);
  assert.deepEqual(
    SCENARIO_MAP.S1.rubric.map((r) => r.id),
    ['warm-resume-opener', 'no-spiderman-if-recent', 'progress-arc-available'],
  );
});

// ── Opener-recency replay row (part A) ──────────────────────────────────

test('SCENARIO_MAP: S1R runs priya, judge-only (replay rows carry no L1 gates)', () => {
  assert.deepEqual(SCENARIO_MAP.S1R.personas, ['priya']);
  assert.deepEqual(SCENARIO_MAP.S1R.gateTaskIds, []);
  assert.deepEqual(gateIdsForRow(SCENARIO_MAP.S1R), []);
});

test('SCENARIO_MAP: S1R re-attaches the S1 warm-resume rubric items (statically)', () => {
  assert.deepEqual(
    SCENARIO_MAP.S1R.rubric.map((r) => r.id),
    ['warm-resume-opener', 'no-spiderman-if-recent', 'progress-arc-available'],
  );
  assert.deepEqual(SCENARIO_MAP.S1R.rubric, SCENARIO_MAP.S1.rubric, 'S1R shares S1\'s rubric items');
});

test('REPLAY_TASK_IDS: S1R is routed through the replay path, and every replay id is a real row', () => {
  assert.ok(REPLAY_TASK_IDS.has('S1R'));
  for (const id of REPLAY_TASK_IDS) {
    assert.ok(id in SCENARIO_MAP, `replay taskId "${id}" is a SCENARIO_MAP row`);
    assert.deepEqual(SCENARIO_MAP[id].gateTaskIds, [], `replay taskId "${id}" is judge-only (runReplayTaskId never runs gates)`);
  }
});

test('buildReplayRubric: prepends opener-differs-from-last with session 1\'s digest interpolated', () => {
  const digest = 'Good to have you back! Last session you were solid on substitution — cinema tickets.';
  const rubric = buildReplayRubric(SCENARIO_MAP.S1R.rubric, digest);
  assert.equal(rubric[0].id, 'opener-differs-from-last');
  assert.ok(rubric[0].question.includes(`The previous session opened with: "${digest}"`), 'digest interpolated verbatim');
  assert.ok(/BOTH kind and content\/theming/.test(rubric[0].question), 'asks for kind AND content variation');
  assert.deepEqual(rubric.slice(1), SCENARIO_MAP.S1R.rubric, 'base items re-attached unchanged, in order');
});

test('buildReplayRubric: pure — does not mutate the base rubric', () => {
  const base = [...SCENARIO_MAP.S1R.rubric];
  buildReplayRubric(SCENARIO_MAP.S1R.rubric, 'x');
  assert.deepEqual(SCENARIO_MAP.S1R.rubric, base);
});

test('SCENARIO_MAP: S3 runs zoe (social-memory opt-out) with the zero-social-render rubric', () => {
  assert.deepEqual(SCENARIO_MAP.S3.personas, ['zoe']);
  assert.deepEqual(SCENARIO_MAP.S3.rubric.map((r) => r.id), ['zero-social-render']);
});

test('SCENARIO_MAP: S6 runs ravi judge-only (silent pickup — no proactive-opener gate)', () => {
  assert.deepEqual(SCENARIO_MAP.S6.personas, ['ravi']);
  assert.deepEqual(SCENARIO_MAP.S6.gateTaskIds, []);
  assert.deepEqual(gateIdsForRow(SCENARIO_MAP.S6), []);
  assert.deepEqual(SCENARIO_MAP.S6.rubric.map((r) => r.id), ['pickup-continuity']);
  assert.equal(SCENARIO_MAP.S6.driverOpts?.resumeVariant, undefined, 'S6 keeps the driver default (fresh)');
});

test("SCENARIO_MAP: S5 runs diego's diagnostic variant judge-only with targetKind 'diagnostic'", () => {
  assert.deepEqual(SCENARIO_MAP.S5.personas, ['diego']);
  assert.deepEqual(SCENARIO_MAP.S5.gateTaskIds, [], 'judge-only — the proactive-opener gate would be exactly wrong');
  assert.deepEqual(gateIdsForRow(SCENARIO_MAP.S5), []);
  assert.equal(SCENARIO_MAP.S5.driverOpts?.targetKind, 'diagnostic');
  assert.deepEqual(SCENARIO_MAP.S5.rubric.map((r) => r.id), ['diagnostic-no-opener']);
  assert.ok(/WITHOUT a proactive opener/.test(SCENARIO_MAP.S5.rubric[0].question));
});

test("SCENARIO_MAP: S6S runs ravi's STALE-checkpoint variant judge-only (light re-orient)", () => {
  assert.deepEqual(SCENARIO_MAP.S6S.personas, ['ravi']);
  assert.deepEqual(SCENARIO_MAP.S6S.gateTaskIds, []);
  assert.deepEqual(gateIdsForRow(SCENARIO_MAP.S6S), []);
  assert.equal(SCENARIO_MAP.S6S.driverOpts?.resumeVariant, 'stale');
  assert.deepEqual(SCENARIO_MAP.S6S.rubric.map((r) => r.id), ['stale-reorient-light']);
  assert.ok(/one-line re-orientation/.test(SCENARIO_MAP.S6S.rubric[0].question));
  assert.ok(/pretending to restore/.test(SCENARIO_MAP.S6S.rubric[0].question));
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
