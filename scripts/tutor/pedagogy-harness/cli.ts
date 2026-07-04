/// <reference types="node" />
/**
 * Task H6 — the `test:pedagogy` CLI: the one-command handoff that wires
 * fixture personas (Task H1, ./fixtures/personas) + the live driver
 * (Task H4, ./run-harness's `runScenario`) + the eval layer (Task H5,
 * ./assertions's `runGates`, ./judge's `judgeBundle`, ./report's
 * `renderReport`) into a runnable Layer-2 live behavioral report.
 *
 * This is what a HUMAN runs locally (a machine with a running dev server +
 * OpenAI Realtime access — the live browser session can't run in CI/
 * sandboxes). The CLI's own logic (the scenario map, arg parsing, `--list`
 * formatting, unknown-taskId handling) is DETERMINISTICALLY unit-tested
 * without a server (see cli.test.ts, `npm run test:pedagogy-cli`) — only
 * `main()`'s live-run branch touches the network/browser, and it SKIPS
 * cleanly (exit 0) when no dev server is reachable.
 *
 * Run:
 *   npm run test:pedagogy -- --list        # print the scenario map, no network
 *   npm run test:pedagogy -- B2            # run one taskId's scenarios
 *   npm run test:pedagogy -- all           # run every taskId's scenarios
 */
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { loadPersona } from './fixtures/personas';
import { runScenario, type Bundle } from './run-harness';
import { runGates } from './assertions';
import { judgeBundle, type RubricItem } from './judge';
import { renderReport, type ScenarioResult } from './report';

export type ScenarioRow = {
  /** Fixture persona ids (Task H1) this taskId's scenarios run against.
   *  DEMO personas only — subscribed personas' `runScenario` throws a
   *  Phase-D deferral (see run-harness.ts's `personaToPickerStart`). */
  personas: string[];
  /**
   * assertions.ts's `runGates(bundle, taskId)` keys its gate registry by
   * TASKID, not by gate id (see assertions.ts's REGISTRY — only
   * `B2`/`B3`/`E2`/`D3` are registered, each resolving to ONE gate id:
   * proactive-opener / board-not-blank / no-sell-phrase /
   * zero-persistence-demo respectively). Rows here whose L1 gate is one of
   * those four but whose OWN taskId isn't a registry key (e.g. B4/B6 both
   * want proactive-opener) list the REGISTRY taskId that resolves to the
   * gate they want (`'B2'`) rather than their own id — `gateIdsForRow`
   * below is what turns this back into real gate ids via `runGates`.
   */
  gateTaskIds: string[];
  /** Layer-2 advisory rubric questions for `judgeBundle`. */
  rubric: RubricItem[];
};

/**
 * Scenario Matrix rows (docs/superpowers/plans/2026-07-02-tutor-pedagogy-
 * opener-calibration.md) this task wires up — DEMO personas only, per the
 * task-H6-brief.md table.
 */
export const SCENARIO_MAP: Record<string, ScenarioRow> = {
  B2: {
    personas: ['maya', 'anon'],
    gateTaskIds: ['B2'],
    rubric: [
      { id: 'opener-acts-first', question: 'Does the opener act first — drawing/asking/showing something — rather than sitting passively waiting for the student to speak first?' },
      { id: 'opener-not-templated', question: 'Does the opener feel specific and tailored to this persona/topic rather than a generic, interchangeable templated greeting?' },
    ],
  },
  B3: {
    personas: ['maya'],
    gateTaskIds: ['B3'],
    rubric: [
      { id: 'fallback-reads-clean', question: 'If the opener had to fall back to a simple rendering (not the ideal one), does the result read as clean and purposeful rather than boring, broken, or half-finished?' },
    ],
  },
  B4: {
    personas: ['maya', 'leo', 'aria', 'anon'],
    gateTaskIds: ['B2'],
    rubric: [
      { id: 'opener-human-feel', question: 'Does the opener feel human and warm rather than clinical, robotic, or scripted?' },
      { id: 'calibrates-without-quizzing', question: 'Does the tutor calibrate the student\'s current level without the exchange feeling like a rapid-fire quiz or interrogation?' },
    ],
  },
  B5: {
    personas: ['leo'],
    gateTaskIds: [],
    rubric: [
      { id: 'verifies-claimed-knowledge', question: 'When the student claims "I know it already", does the tutor treat that as a hint worth verifying rather than accepting it outright as an established fact?' },
    ],
  },
  B6: {
    personas: ['maya'],
    gateTaskIds: ['B2'],
    rubric: [
      { id: 'demo-opener-fires', question: 'On the demo (logged-out) path, does the proactive opener fire as expected, same as the subscribed path?' },
      { id: 'no-placeholder-name-spoken', question: 'Does the tutor avoid ever speaking a placeholder/anonymous name (e.g. literally saying "anon") out loud?' },
    ],
  },
};

/** A minimal, otherwise-inert Bundle used ONLY to resolve `gateTaskIds` down
 *  to the real gate ids `runGates` registers for them — `runGates` is a
 *  pure sync function over its Bundle argument (no I/O), so this never
 *  touches the network and its `.ok`/`.detail` fields are meaningless here;
 *  only the returned `.id`s are used. */
const ID_RESOLUTION_BUNDLE: Bundle = {
  persona: { id: '__cli-id-resolution__', mode: 'demo' },
  turns: [],
  meta: { baseUrl: '', maxTurns: 0 },
};

/** Resolves a scenario row's `gateTaskIds` into the actual gate ids
 *  `runGates` will produce for a real Bundle (e.g. `['B2']` ->
 *  `['proactive-opener']`). An empty `gateTaskIds` yields `[]`. */
export function gateIdsForRow(row: ScenarioRow): string[] {
  return row.gateTaskIds.flatMap((taskId) => runGates(ID_RESOLUTION_BUNDLE, taskId).map((g) => g.id));
}

/** Pure: renders the scenario map into the `--list` display — no network,
 *  no server. taskId -> personas + resolved gate ids + rubric item ids. */
export function formatList(map: Record<string, ScenarioRow>): string {
  const lines = ['Pedagogy harness scenario map:', ''];
  for (const [taskId, row] of Object.entries(map)) {
    const gateIds = gateIdsForRow(row);
    lines.push(`${taskId}:`);
    lines.push(`  personas: ${row.personas.join(', ') || '(none)'}`);
    lines.push(`  gates:    ${gateIds.join(', ') || '(none — judge-only)'}`);
    lines.push(`  rubric:   ${row.rubric.map((r) => r.id).join(', ') || '(none)'}`);
  }
  return lines.join('\n');
}

/**
 * Pure: resolves the CLI's `<taskId|all>` argument against `map`.
 * `'all'` -> every taskId in the map. A known taskId -> `[taskId]`.
 * Unknown taskId -> throws (never process.exit — that's `main()`'s job).
 */
export function resolveTaskIds(map: Record<string, ScenarioRow>, arg: string): string[] {
  if (arg === 'all') return Object.keys(map);
  if (!(arg in map)) {
    throw new Error(
      `Unknown taskId "${arg}". Known taskIds: ${Object.keys(map).join(', ')} (or "all", or "--list" to see personas/gates/rubric per row).`,
    );
  }
  return [arg];
}

const DEFAULT_BASE_URL = process.env.TUTOR_E2E_URL || 'http://localhost:3006';
/** Turns per live scenario run — enough to exercise opener + a couple of
 *  calibration/teaching exchanges without an unbounded session. */
const DEFAULT_MAX_TURNS = 6;

/** Reachability probe (mirrors run-harness.smoke.ts's pattern — a bare
 *  `fetch` against `${baseUrl}/tutor`, the same page `runScenario`
 *  navigates to). Never throws. */
async function probeDevServer(baseUrl: string): Promise<boolean> {
  try {
    await fetch(`${baseUrl}/tutor`);
    return true;
  } catch {
    return false;
  }
}

function log(msg: string) { console.log(`[test:pedagogy] ${msg}`); }

/** Runs every persona in `row` for `taskId` against a live session,
 *  evaluates L1 gates + L2 judge, and returns one `ScenarioResult` per
 *  persona. */
async function runTaskId(taskId: string, row: ScenarioRow, baseUrl: string): Promise<ScenarioResult[]> {
  const results: ScenarioResult[] = [];
  for (const personaId of row.personas) {
    const persona = loadPersona(personaId);
    log(`${taskId} / ${personaId}: running live scenario (maxTurns=${DEFAULT_MAX_TURNS})…`);
    // A scenario that dies mid-run (e.g. the session never produces a tutor
    // turn) must still land in the report — before this catch, a throw here
    // aborted the whole CLI with NO report.md, leaving nothing but a stray
    // screenshot dir to diagnose from (observed 2026-07-03: three failed
    // maya runs left zero reports).
    try {
      const bundle = await runScenario(persona, { maxTurns: DEFAULT_MAX_TURNS, taskId, baseUrl });
      const gates = row.gateTaskIds.flatMap((gateTaskId) => runGates(bundle, gateTaskId));
      const judge = row.rubric.length ? await judgeBundle(bundle, row.rubric) : undefined;
      results.push({ taskId, persona: personaId, gates, judge });
    } catch (err) {
      log(`${taskId} / ${personaId}: RUN FAILED — ${(err as Error).message}`);
      results.push({
        taskId,
        persona: personaId,
        gates: [],
        anomalies: [`RUN FAILED (no gates/judge evaluated): ${(err as Error).message}`],
      });
    }
  }
  return results;
}

/** Writes `renderReport(results)` to artifacts/pedagogy/<taskId>/report.md
 *  and returns the written path + a one-line roll-up summary. */
function writeReport(taskId: string, results: ScenarioResult[]): { outPath: string; summary: string } {
  const outDir = path.join(process.cwd(), 'artifacts', 'pedagogy', taskId);
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'report.md');
  fs.writeFileSync(outPath, renderReport(results));

  const passCount = results.reduce((n, r) => n + r.gates.filter((g) => g.ok).length, 0);
  const totalGates = results.reduce((n, r) => n + r.gates.length, 0);
  const flaggedCount = results.reduce((n, r) => n + (r.judge?.flagged.length ?? 0), 0);
  const summary = `${taskId}: L1 ${passCount}/${totalGates} pass, L2 flagged ${flaggedCount}`;
  return { outPath, summary };
}

async function main(): Promise<void> {
  const arg = process.argv[2];

  if (!arg || arg === '--list' || arg === '-l') {
    console.log(formatList(SCENARIO_MAP));
    return;
  }

  let taskIds: string[];
  try {
    taskIds = resolveTaskIds(SCENARIO_MAP, arg);
  } catch (err) {
    console.error((err as Error).message);
    process.exit(1);
  }

  const baseUrl = DEFAULT_BASE_URL;
  const reachable = await probeDevServer(baseUrl);
  if (!reachable) {
    console.log(
      '[SKIP] no dev server — Layer-2 live runs need a running dev server + OpenAI Realtime access (run locally)',
    );
    process.exit(0);
  }

  log(`dev server reachable at ${baseUrl} — running ${taskIds.length} taskId(s): ${taskIds.join(', ')}`);
  for (const taskId of taskIds!) {
    const row = SCENARIO_MAP[taskId];
    const results = await runTaskId(taskId, row, baseUrl);
    const { outPath, summary } = writeReport(taskId, results);
    console.log(`${outPath} — ${summary}`);
  }
}

const isMainModule = (() => {
  try {
    return !!process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
  } catch {
    return false;
  }
})();

if (isMainModule) {
  main().catch((e) => {
    console.error('[test:pedagogy] FAIL:', e);
    process.exit(1);
  });
}
