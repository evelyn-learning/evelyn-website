/**
 * Tool-coverage test harness for the Claude brain.
 *
 * For every prompt in docs/voice-tutor-validator-test-prompts.md:
 *   1. Call streamBrainTurn directly with that prompt as the student utterance.
 *   2. Capture the brain's emitted tool calls.
 *   3. Verify the EXPECTED tool name appears in the call list (the tool is
 *      determined by the section heading the prompt sits under).
 *   4. For tools that have a structural validator
 *      (validateCircuit, validateCollision, validateEnergyBars, ...),
 *      run the brain's emitted args through it and assert ok:true.
 *
 * Output: a per-tool pass/fail matrix with the offending payload inline
 * for any failure. Designed to be run before any tool-description or
 * system-prompt change ships, so we catch the bug class that bit us with
 * parallel circuits (validator passes for the OpenAI-Realtime-emitted
 * shape, fails for the Claude-emitted shape) before it reaches users.
 *
 * Run: npx tsx scripts/test-tool-coverage.ts
 *      npx tsx scripts/test-tool-coverage.ts --tool show_circuit
 *      npx tsx scripts/test-tool-coverage.ts --tool show_circuit --verbose
 *      npx tsx scripts/test-tool-coverage.ts --tool show_circuit --iterations 3
 *
 * --iterations N: run each prompt N times and require ALL N to pass to
 * mark the prompt green. Catches stochastic emission bugs where the
 * brain sometimes emits a renderer-friendly netlist and sometimes
 * doesn't. Default 1.
 */
import { readFileSync } from 'fs';
import { streamBrainTurn, type BrainToolCall } from '../apps/marketing/src/lib/tutor/voice/claude-brain';
import { WHITEBOARD_TOOLS } from '../apps/marketing/src/app/tutor/hooks/toolDefinitions';
import { validateCircuit } from '../apps/marketing/src/lib/tutor/diagrams/circuit-validator';
import { validateCollision } from '../apps/marketing/src/lib/tutor/diagrams/collision-validator';
import { validateEnergyBars } from '../apps/marketing/src/lib/tutor/diagrams/energy-bars-validator';
import { validateFlowchart } from '../apps/marketing/src/lib/tutor/diagrams/flowchart-validator';
import { validateManipulative } from '../apps/marketing/src/lib/tutor/diagrams/manipulative-validator';
import { validatePedigree } from '../apps/marketing/src/lib/tutor/diagrams/pedigree-validator';
import { validateReactionCoordinate } from '../apps/marketing/src/lib/tutor/diagrams/reaction-coordinate-validator';
import { validateSpringMass } from '../apps/marketing/src/lib/tutor/diagrams/spring-mass-validator';

// ── Parse the test-prompts markdown into { tool: prompts[] } ─────────────────

interface PromptSet {
  tool: string;
  prompts: string[];
}

function parsePromptDoc(path: string): PromptSet[] {
  const text = readFileSync(path, 'utf8');
  const sets: PromptSet[] = [];
  let current: PromptSet | null = null;
  for (const rawLine of text.split('\n')) {
    const line = rawLine.trimEnd();
    const headingMatch = line.match(/^##\s+(show_\w+|show_diagram)/);
    if (headingMatch) {
      if (current) sets.push(current);
      current = { tool: headingMatch[1], prompts: [] };
      continue;
    }
    if (!current) continue;
    const promptMatch = line.match(/^\d+\.\s+(.+)/);
    if (promptMatch) {
      current.prompts.push(promptMatch[1]);
    }
  }
  if (current) sets.push(current);
  return sets;
}

// ── Validator dispatch table ─────────────────────────────────────────────────

type ValidatorResult = { ok: true } | { ok: false; reason: string };

function runStructuralValidator(toolName: string, args: Record<string, unknown>, studentText: string): ValidatorResult | null {
  switch (toolName) {
    case 'show_circuit': {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const components = args.components as any;
      const r = validateCircuit(components ?? [], studentText);
      return r.ok ? { ok: true } : { ok: false, reason: r.reason ?? 'unknown' };
    }
    case 'show_collision': {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const r = validateCollision(args as any);
      return r.ok ? { ok: true } : { ok: false, reason: r.reason ?? 'unknown' };
    }
    case 'show_energy_bars': {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const r = validateEnergyBars(args as any);
      return r.ok ? { ok: true } : { ok: false, reason: r.reason ?? 'unknown' };
    }
    case 'show_flowchart': {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const r = validateFlowchart(args as any);
      return r.ok ? { ok: true } : { ok: false, reason: r.reason ?? 'unknown' };
    }
    case 'show_manipulative': {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const r = validateManipulative(args as any);
      return r.ok ? { ok: true } : { ok: false, reason: r.reason ?? 'unknown' };
    }
    case 'show_pedigree': {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const r = validatePedigree(args as any);
      return r.ok ? { ok: true } : { ok: false, reason: r.reason ?? 'unknown' };
    }
    case 'show_reaction_coordinate': {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const r = validateReactionCoordinate(args as any);
      return r.ok ? { ok: true } : { ok: false, reason: r.reason ?? 'unknown' };
    }
    case 'show_spring_mass': {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const r = validateSpringMass(args as any);
      return r.ok ? { ok: true } : { ok: false, reason: r.reason ?? 'unknown' };
    }
    default:
      return null;  // No structural validator for this tool.
  }
}

// ── System prompt — minimal voice-tutor stub ─────────────────────────────────
// We don't load buildSystemPrompt here; the harness is testing whether the
// brain picks the right tool with the right shape, not whether the full
// teaching prompt is wired. A short prompt is faster + cheaper.

const HARNESS_SYSTEM_PROMPT = [
  'You are a Socratic voice tutor for K-12 / AP / college students.',
  'When the student asks for a visual (a circuit, diagram, graph, etc.), call the appropriate show_* tool with structurally complete arguments.',
  'Always pair tool calls with a brief verbal acknowledgment (1 sentence).',
  'Never refuse, never apologize for not being able to draw — you have the tools.',
  'Don\'t solve the problem — ask one focused question after rendering the visual.',
].join(' ');

// ── Per-prompt test ──────────────────────────────────────────────────────────

interface PromptTestResult {
  tool: string;
  prompt: string;
  /** Did the brain actually emit ≥1 tool call? */
  emittedAny: boolean;
  /** Did the brain emit the expected tool? (May coexist with others like new_page.) */
  emittedExpected: boolean;
  /** Tool names actually emitted, in order. */
  toolNames: string[];
  /** Validator result for the expected tool's call. null if no validator exists. */
  validator: ValidatorResult | null;
  /** The expected tool's args, for failure inspection. */
  expectedToolArgs?: Record<string, unknown>;
  /** Timing. */
  ms: number;
  /** Anthropic stop reason. */
  stopReason: string;
  /** Brain text response, snippet. */
  textSnippet: string;
}

async function runOnePrompt(tool: string, prompt: string): Promise<PromptTestResult> {
  const t0 = Date.now();
  const toolNames: string[] = [];
  const toolCalls: BrainToolCall[] = [];
  let fullText = '';
  let stopReason = 'unknown';

  for await (const ev of streamBrainTurn({
    systemPrompt: HARNESS_SYSTEM_PROMPT,
    conversationHistory: [
      // Synthetic prior turn so the brain doesn't waste this call on a greeting.
      { role: 'assistant', content: 'Hey there!' },
    ],
    studentTranscript: prompt,
    whiteboardSnapshot: [],
    tools: WHITEBOARD_TOOLS,
  })) {
    if (ev.type === 'tool-call') {
      toolNames.push(ev.name);
      toolCalls.push({ id: ev.id, name: ev.name, args: ev.args });
    } else if (ev.type === 'sentence') {
      fullText += (fullText ? ' ' : '') + ev.text;
    } else if (ev.type === 'done') {
      stopReason = ev.stopReason;
    }
  }
  const ms = Date.now() - t0;

  const expectedCall = toolCalls.find((tc) => tc.name === tool);
  const validator = expectedCall ? runStructuralValidator(tool, expectedCall.args, prompt) : null;

  return {
    tool,
    prompt,
    emittedAny: toolCalls.length > 0,
    emittedExpected: !!expectedCall,
    toolNames,
    validator,
    expectedToolArgs: expectedCall?.args,
    ms,
    stopReason,
    textSnippet: fullText.slice(0, 80),
  };
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY not set');
    process.exit(1);
  }

  // CLI args: --tool <name> filters to one tool. --verbose dumps full args.
  const args = process.argv.slice(2);
  const toolFilter = (() => {
    const i = args.indexOf('--tool');
    return i >= 0 ? args[i + 1] : null;
  })();
  const verbose = args.includes('--verbose');
  const limit = (() => {
    const i = args.indexOf('--limit');
    return i >= 0 ? parseInt(args[i + 1], 10) : Infinity;
  })();
  const iterations = (() => {
    const i = args.indexOf('--iterations');
    return i >= 0 ? Math.max(1, parseInt(args[i + 1], 10)) : 1;
  })();

  const sets = parsePromptDoc('docs/voice-tutor-validator-test-prompts.md');
  const filtered = toolFilter ? sets.filter((s) => s.tool === toolFilter) : sets;
  if (filtered.length === 0) {
    console.error(`No prompts found for tool: ${toolFilter}`);
    console.error('Available tools:', sets.map((s) => s.tool).join(', '));
    process.exit(1);
  }

  console.log(`Tool-coverage harness — ${filtered.reduce((n, s) => n + Math.min(s.prompts.length, limit), 0)} prompt(s) across ${filtered.length} tool(s)\n`);

  interface ToolSummary {
    tool: string;
    total: number;
    emittedExpected: number;
    validatorPassed: number;
    validatorMissing: number;
    failures: PromptTestResult[];
  }
  const summaries: ToolSummary[] = [];

  for (const set of filtered) {
    const summary: ToolSummary = {
      tool: set.tool,
      total: 0,
      emittedExpected: 0,
      validatorPassed: 0,
      validatorMissing: 0,
      failures: [],
    };
    console.log(`── ${set.tool} ──`);
    const prompts = set.prompts.slice(0, limit);
    for (let i = 0; i < prompts.length; i++) {
      const prompt = prompts[i];
      summary.total++;
      try {
        // Run N iterations of the same prompt to catch stochastic
        // emissions. Brain output is non-deterministic — the same prompt
        // can produce a renderer-friendly netlist on one run and a
        // renderer-hostile one on the next. Pass = ALL iterations passed.
        const runs: PromptTestResult[] = [];
        for (let it = 0; it < iterations; it++) {
          runs.push(await runOnePrompt(set.tool, prompt));
        }
        // Aggregate: prompt is green iff every iteration passed.
        const allPassed = runs.every((r) =>
          r.emittedAny &&
          r.emittedExpected &&
          (r.validator === null || r.validator.ok),
        );
        const firstFailure = runs.find((r) =>
          !r.emittedAny ||
          !r.emittedExpected ||
          (r.validator !== null && !r.validator.ok),
        );
        const passCount = runs.filter((r) =>
          r.emittedAny &&
          r.emittedExpected &&
          (r.validator === null || r.validator.ok),
        ).length;
        const repr = firstFailure ?? runs[0];
        const status = (() => {
          if (!repr.emittedAny) return '✗ NO_TOOL_CALL';
          if (!repr.emittedExpected) return `✗ WRONG_TOOL [${repr.toolNames.join(', ')}]`;
          if (repr.validator === null) return '◯ NO_VALIDATOR';
          if (!repr.validator.ok) return `✗ VALIDATOR_FAIL`;
          return '✓ PASS';
        })();
        const itTag = iterations > 1 ? ` [${passCount}/${iterations}]` : '';
        const promptShort = prompt.length > 55 ? prompt.slice(0, 55) + '…' : prompt;
        const totalMs = runs.reduce((s, r) => s + r.ms, 0);
        console.log(`  [${i + 1}/${prompts.length}]${itTag} ${status} (${totalMs}ms) ${promptShort}`);
        if (allPassed) {
          summary.emittedExpected++;
          if (repr.validator?.ok) summary.validatorPassed++;
          if (repr.validator === null) summary.validatorMissing++;
        } else {
          summary.failures.push(repr);
          if (repr.validator && !repr.validator.ok) {
            console.log(`        reason: ${repr.validator.reason}`);
          }
          if (verbose && repr.expectedToolArgs) {
            console.log(`        args: ${JSON.stringify(repr.expectedToolArgs).slice(0, 400)}`);
          }
        }
      } catch (err) {
        console.log(`  [${i + 1}/${prompts.length}] ✗ ERROR: ${err instanceof Error ? err.message : String(err)}`);
        summary.failures.push({
          tool: set.tool,
          prompt,
          emittedAny: false,
          emittedExpected: false,
          toolNames: [],
          validator: { ok: false, reason: err instanceof Error ? err.message : String(err) },
          ms: 0,
          stopReason: 'error',
          textSnippet: '',
        });
      }
    }
    summaries.push(summary);
    console.log('');
  }

  // ── Final report ───────────────────────────────────────────────────────────
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  Final coverage report');
  console.log('═══════════════════════════════════════════════════════════════\n');
  const colWidths = [26, 8, 12, 12, 12];
  const header = ['Tool', 'Prompts', 'CorrectTool', 'Validates', 'NoValidator'];
  console.log(header.map((h, i) => h.padEnd(colWidths[i])).join('  '));
  console.log('─'.repeat(colWidths.reduce((a, b) => a + b + 2, -2)));
  let totalPrompts = 0;
  let totalCorrectTool = 0;
  let totalValidates = 0;
  for (const s of summaries) {
    const row = [
      s.tool.padEnd(colWidths[0]),
      `${s.total}`.padEnd(colWidths[1]),
      `${s.emittedExpected}/${s.total}`.padEnd(colWidths[2]),
      `${s.validatorPassed}/${Math.max(s.emittedExpected - s.validatorMissing, 0)}`.padEnd(colWidths[3]),
      s.validatorMissing > 0 ? `${s.validatorMissing}` : '—',
    ];
    console.log(row.join('  '));
    totalPrompts += s.total;
    totalCorrectTool += s.emittedExpected;
    totalValidates += s.validatorPassed;
  }
  console.log('─'.repeat(colWidths.reduce((a, b) => a + b + 2, -2)));
  console.log(`Totals: ${totalCorrectTool}/${totalPrompts} correct tool · ${totalValidates} validator passes`);

  // Detailed failure dump.
  const allFailures = summaries.flatMap((s) => s.failures);
  if (allFailures.length > 0) {
    console.log(`\n── ${allFailures.length} failure(s) — detail ──\n`);
    for (const f of allFailures) {
      console.log(`[${f.tool}] "${f.prompt.slice(0, 80)}${f.prompt.length > 80 ? '…' : ''}"`);
      console.log(`  toolNames: [${f.toolNames.join(', ') || '(none)'}]`);
      if (f.validator && !f.validator.ok) {
        console.log(`  validator: ${f.validator.reason}`);
      }
      if (f.expectedToolArgs) {
        const argsStr = JSON.stringify(f.expectedToolArgs);
        console.log(`  args: ${argsStr.length > 600 ? argsStr.slice(0, 600) + '…' : argsStr}`);
      }
      console.log('');
    }
  }

  process.exit(allFailures.length > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('Harness errored:', err);
  process.exit(1);
});
