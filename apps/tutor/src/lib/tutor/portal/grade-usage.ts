/**
 * Model usage of free-response grading, for Evelyn's own cost view (GAC live
 * test 2026-10-16: Homework Help sessions carry their cost; Self Study
 * grading — the only model call a GAC student's practice makes — carried
 * none). Partners never see this.
 *
 * A grade can make several model calls (a retry, a structured-output
 * fallback, part-by-part rubrics), all deep inside gradeFreeResponse. Rather
 * than thread a counter through every helper, the route runs the grade
 * inside `collectGradeUsage` and `callGraderJson` reports each reply's
 * `usage` to whatever collector is active. Outside a collector (tests, the
 * mock-exam report) reporting is a no-op.
 */
import { AsyncLocalStorage } from 'node:async_hooks';
import { lookupModelRate } from '../ai/model-rates';

export interface GradeCallUsage {
  model: string;
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  cacheCreationTokens: number;
}

const active = new AsyncLocalStorage<GradeCallUsage[]>();

const n = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);

/** Record one model reply's usage on the active collector, if any. */
export function recordGradeUsage(model: string, usage: unknown): void {
  const calls = active.getStore();
  if (!calls || !usage || typeof usage !== 'object') return;
  const u = usage as Record<string, unknown>;
  calls.push({
    model,
    inputTokens: n(u.input_tokens),
    outputTokens: n(u.output_tokens),
    cacheReadTokens: n(u.cache_read_input_tokens),
    cacheCreationTokens: n(u.cache_creation_input_tokens),
  });
}

/** Run `fn` and return its result with every grading call it made. */
export async function collectGradeUsage<T>(fn: () => Promise<T>): Promise<{ result: T; calls: GradeCallUsage[] }> {
  const calls: GradeCallUsage[] = [];
  const result = await active.run(calls, fn);
  return { result, calls };
}

/** Dollar cost of the calls, priced from the shared rate card (cache writes at the 5-minute rate). */
export function gradeUsageCost(calls: GradeCallUsage[]): number {
  let cost = 0;
  for (const c of calls) {
    const r = lookupModelRate(c.model);
    if (!r) continue;
    cost += (c.inputTokens * r.input
      + c.outputTokens * r.output
      + c.cacheReadTokens * (r.cacheRead ?? r.input)
      + c.cacheCreationTokens * (r.cacheWrite5m ?? r.input)) / 1_000_000;
  }
  return Math.round(cost * 1_000_000) / 1_000_000;
}
