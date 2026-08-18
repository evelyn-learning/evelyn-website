// apps/tutor/scripts/tutor/verdict-bank/run-bank.ts
/**
 * `npm run hunt:verdicts` — the verdict-probe-bank CLI (2026-08-18 plan,
 * Task 5). Drives every probe's scripted turns through a REAL claude-brain
 * session (Task 2's driver seams + Task 4's provider), grades the tutor's
 * verdict opener against each probe's expected class (Task 1's classifier),
 * and writes a markdown report (Task 5's pure `renderReport`).
 *
 * The only I/O-doing file in this directory — report.ts stays pure so it
 * can be unit-tested without a browser.
 *
 * Run:
 *   npm run hunt:verdicts                          # every probe, 3 samples each
 *   npm run hunt:verdicts -- --probe inc-arith-tutor-posed --samples 1
 *   npm run hunt:verdicts -- --base-url http://localhost:3007
 */
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { loadPersona, type Persona } from '../pedagogy-harness/fixtures/personas';
import { runScenario, type TestStartConfig, type Bundle } from '../pedagogy-harness/run-harness';
import { ALL_PROBES } from './probes';
import type { VerdictProbe } from './types';
import { makeProbeProvider } from './provider';
import { classifyVerdictOpener, gradeOutcome } from './classifier';
import { renderReport, renderSummaryTable, type ProbeResult, type SampleResult } from './report';

function log(msg: string) { console.log(`[hunt:verdicts] ${msg}`); }

// ── CLI args ────────────────────────────────────────────────────────────

export interface CliArgs {
  probeIds: string[];
  samples: number;
  baseUrl: string;
}

/** Pure: parses `--probe <id>` (repeatable), `--samples <n>`, `--base-url
 *  <url>` off argv. Throws on a malformed flag — `main()` turns that into a
 *  loud exit(1), never a silent fallback. */
export function parseArgs(argv: string[]): CliArgs {
  const probeIds: string[] = [];
  let samples = 3;
  let baseUrl = 'http://localhost:3006';

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--probe') {
      const val = argv[++i];
      if (!val) throw new Error('--probe requires a value');
      probeIds.push(val);
    } else if (arg === '--samples') {
      const val = argv[++i];
      const n = Number(val);
      if (!val || !Number.isInteger(n) || n <= 0) throw new Error('--samples requires a positive integer');
      samples = n;
    } else if (arg === '--base-url') {
      const val = argv[++i];
      if (!val) throw new Error('--base-url requires a value');
      baseUrl = val;
    } else {
      throw new Error(`unknown argument: "${arg}"`);
    }
  }

  return { probeIds, samples, baseUrl };
}

/** Pure: `--probe` ids -> the matching `VerdictProbe`s (default: every
 *  probe). An unknown id fails loudly, naming it. */
export function resolveProbes(probeIds: string[]): VerdictProbe[] {
  if (probeIds.length === 0) return ALL_PROBES;
  return probeIds.map((id) => {
    const probe = ALL_PROBES.find((p) => p.id === id);
    if (!probe) {
      throw new Error(`unknown probe id "${id}". Known ids: ${ALL_PROBES.map((p) => p.id).join(', ')}`);
    }
    return probe;
  });
}

// ── Driver wiring ───────────────────────────────────────────────────────

/**
 * Builds the `runScenario` `startOverride` for a probe: every
 * `TestStartConfig` REQUIRED field filled from `probe.start` with an
 * explicit constant (no cast) — `lessonPlanId` is required by
 * `TestStartConfig` but only optional on `VerdictProbe['start']`, so its
 * absence throws a named error rather than silently producing an
 * unstartable session. `teacherId` is pinned explicitly to
 * 'ms-elena-vasquez' — the same deterministic default
 * `personaToPickerStart` applies — because `startOverride` bypasses that
 * function entirely.
 */
export function buildStartOverride(probe: VerdictProbe): TestStartConfig {
  if (!probe.start.lessonPlanId) {
    throw new Error(`probe ${probe.id}: start.lessonPlanId is required`);
  }
  const start: TestStartConfig = {
    subject: probe.start.subject,
    level: probe.start.level,
    topic: probe.start.topic,
    lessonPlanId: probe.start.lessonPlanId,
    teacherId: 'ms-elena-vasquez',
  };
  if (probe.start.studentName) start.studentName = probe.start.studentName;
  return start;
}

const GUARD_FAMILIES = [
  'denied_answer_',
  'inverse_verdict_',
  'arith_claim_',
  'praise_echo_',
  'contradiction_inversion',
  'verdict_guard',
  'simplification_verdict',
  'nonanswer',
];

function isGuardEventType(type: string): boolean {
  return GUARD_FAMILIES.some((family) => type.includes(family));
}

/** Reads every guard-family debug event for a sample from
 *  `<outDir>/debug-events.json` (written by run-harness.ts's `runScenario`).
 *  No timestamp filtering — collects ALL matches for the session. Ruling 2:
 *  `outDir` is optional on `Bundle`; absent (or unreadable) -> `[]`, never a
 *  crash. */
function readGuardEvents(outDir: string | undefined): string[] {
  if (!outDir) return [];
  try {
    const file = path.join(outDir, 'debug-events.json');
    if (!fs.existsSync(file)) return [];
    const events = JSON.parse(fs.readFileSync(file, 'utf8')) as Array<{ type?: unknown }>;
    return events
      .map((e) => e.type)
      .filter((t): t is string => typeof t === 'string' && isGuardEventType(t));
  } catch {
    return [];
  }
}

/**
 * Collapses all whitespace — including embedded newlines — in a live-model
 * opener quote down to single spaces, THEN truncates to 160 chars (so the
 * 160-char budget yields 160 visible characters rather than being computed
 * on text that still has raw newlines in it). `openerQuote` is spliced into
 * a single-line `- Opener: "..."` markdown bullet in report.ts; an embedded
 * `\n` would spill onto an unindented line and cosmetically break that
 * bullet. report.ts stays dumb on purpose — it renders whatever it is
 * given — so the sanitizing happens here, at the one place the quote is
 * built from raw model output.
 */
export function sanitizeOpenerQuote(text: string): string {
  return text.replace(/\s+/g, ' ').trim().slice(0, 160);
}

/**
 * Grades one completed `Bundle` against `probe`. `k` is the turn index of
 * the scripted ANSWER (`bundle.turns[k].studentReply`); the reply actually
 * graded is the tutor turn that FOLLOWS it, `bundle.turns[k + 1]`. A
 * missing follow-up turn -> `no-verdict` with the `(no tutor reply
 * captured)` sentinel, regardless of what the classifier would say about
 * empty text.
 */
export function gradeSample(probe: VerdictProbe, bundle: Bundle): SampleResult {
  const k = probe.gradeTurnIndex ?? probe.turns.length - 1;
  const gradedTurn = bundle.turns[k + 1];
  const guardEvents = readGuardEvents(bundle.outDir);
  const bundleDir = bundle.outDir ?? '';

  if (!gradedTurn) {
    return { grade: 'no-verdict', verdictClass: 'none', openerQuote: '(no tutor reply captured)', guardEvents, bundleDir };
  }

  const verdictClass = classifyVerdictOpener(gradedTurn.tutorText);
  const grade = gradeOutcome(probe.expected, verdictClass);
  const openerQuote = sanitizeOpenerQuote(gradedTurn.tutorText);
  return { grade, verdictClass, openerQuote, guardEvents, bundleDir };
}

/**
 * Runs one live sample of `probe` and grades it. Per-sample resilience
 * (controller ruling 5): a throw anywhere in `runScenario` (e.g. the
 * no-tutor-turn-appeared failure at run-harness.ts:598-604) is caught here
 * and recorded as `no-verdict` rather than aborting the whole hunt — a full
 * hunt is 21 probes × 3 samples of live model calls, and losing 60 samples
 * of evidence to sample 4 throwing is unacceptable.
 */
async function runSample(persona: Persona, probe: VerdictProbe, baseUrl: string): Promise<SampleResult> {
  try {
    const bundle = await runScenario(persona, {
      baseUrl,
      maxTurns: probe.turns.length + 1,
      startOverride: buildStartOverride(probe),
      kickoffOverride: probe.kickoff,
      studentTurnProvider: makeProbeProvider(probe),
    });
    return gradeSample(probe, bundle);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      grade: 'no-verdict',
      verdictClass: 'none',
      openerQuote: `(sample threw: ${sanitizeOpenerQuote(message)})`,
      guardEvents: [],
      bundleDir: '',
    };
  }
}

/** Reachability probe (mirrors pedagogy-harness/cli.ts's `probeDevServer`)
 *  — a bare `fetch`, no response-status check. Never throws. */
async function devServerReachable(baseUrl: string): Promise<boolean> {
  try {
    await fetch(baseUrl);
    return true;
  } catch {
    return false;
  }
}

// ── main ────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  let args: CliArgs;
  try {
    args = parseArgs(process.argv.slice(2));
  } catch (err) {
    console.error((err as Error).message);
    process.exit(1);
    return;
  }

  let probes: VerdictProbe[];
  try {
    probes = resolveProbes(args.probeIds);
  } catch (err) {
    console.error((err as Error).message);
    process.exit(1);
    return;
  }

  const reachable = await devServerReachable(args.baseUrl);
  if (!reachable) {
    console.error("dev server not reachable — run 'npm run dev' in apps/tutor first");
    process.exit(1);
    return;
  }

  const persona = loadPersona('anon');

  // Timestamp computed ONCE at startup (ruling 5) so a multi-hour hunt
  // writes every incremental save to the SAME directory, not a new one per
  // sample.
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const outDir = path.join(process.cwd(), 'artifacts', 'verdict-bank', stamp);
  fs.mkdirSync(outDir, { recursive: true });
  const resultsPath = path.join(outDir, 'results.json');
  const reportPath = path.join(outDir, 'report.md');

  const results: ProbeResult[] = [];

  // Rewritten after EVERY sample (ruling 5) — a crash or Ctrl-C mid-hunt
  // still leaves a readable partial report instead of losing everything.
  function persist(): void {
    fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
    fs.writeFileSync(reportPath, renderReport(results));
  }

  log(`dev server reachable at ${args.baseUrl} — running ${probes.length} probe(s) × ${args.samples} sample(s)`);
  log(`writing to ${outDir}`);

  for (const probe of probes) {
    const probeResult: ProbeResult = {
      probe: { id: probe.id, cell: probe.cell, expected: probe.expected, notes: probe.notes },
      samples: [],
    };
    results.push(probeResult);

    for (let i = 0; i < args.samples; i++) {
      log(`${probe.id}: sample ${i + 1}/${args.samples}…`);
      const sample = await runSample(persona, probe, args.baseUrl);
      probeResult.samples.push(sample);
      log(`${probe.id}: sample ${i + 1}/${args.samples} -> ${sample.grade}`);
      persist();
    }
  }

  console.log('');
  console.log(`report: ${reportPath}`);
  console.log('');
  console.log(renderSummaryTable(results));
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
    console.error('[hunt:verdicts] FAIL:', e);
    process.exit(1);
  });
}
