// apps/tutor/scripts/tutor/verdict-bank/provider.ts
/**
 * Turns a probe's scripted turn list into the driver callback
 * (run-harness.ts's `opts.studentTurnProvider`, Task 2's seam). Pure —
 * no browser, no network; the harness supplies real captured `toolCalls`.
 */
import { evaluateComputableLatex } from '../../../src/lib/tutor/voice/computable-equation';
import type { ProbeTurn, VerdictProbe } from './types';

type ProviderCtx = { tutorText: string; turnIndex: number; history: unknown[]; toolCalls: unknown[] };
type ProviderResult = { text: string; ended: boolean };

const MAX_LATEX_SEARCH_DEPTH = 8;

// Recursively collect every string value of an own `latex` property inside
// `value`, walking nested plain objects/arrays (e.g. a captured tool call's
// `data` payload) in traversal order. A depth cap + a `seen` set guard
// against runaway/cyclic structures.
//
// NOTE (2026-08-18 controller ruling): as of today NO tool_call debug event
// carries a structured `latex` field anywhere in its shape —
// collectNewToolCalls (run-harness.ts) captures only `{ message, data }`
// from debug events, and every `tool_call` emission in
// VoiceTutorRealtime.tsx passes a human-readable message string, never
// structured latex. So on every real run, `compute` turns below fall back
// to `fallbackSay`. This recursive search exists so the seam works
// correctly if that instrumentation is ever added later — it is NOT wired
// up here, and changing production render code is out of scope for this task.
function findLatexStrings(value: unknown, depth = 0, seen: Set<object> = new Set()): string[] {
  if (depth > MAX_LATEX_SEARCH_DEPTH || value === null || typeof value !== 'object') return [];
  if (seen.has(value as object)) return [];
  seen.add(value as object);

  if (Array.isArray(value)) {
    const results: string[] = [];
    for (const item of value) results.push(...findLatexStrings(item, depth + 1, seen));
    return results;
  }

  const obj = value as Record<string, unknown>;
  const results: string[] = [];
  for (const key of Object.keys(obj)) {
    const v = obj[key];
    if (key === 'latex' && typeof v === 'string' && v.length > 0) {
      results.push(v);
    } else if (v !== null && typeof v === 'object') {
      results.push(...findLatexStrings(v, depth + 1, seen));
    }
  }
  return results;
}

// Search every captured tool call for computable latex, trying the LAST
// match found (traversal order) first, then walking backwards.
function findComputableLatex(toolCalls: unknown[]): { display: string } | null {
  const candidates = toolCalls.flatMap((tc) => findLatexStrings(tc));
  for (let i = candidates.length - 1; i >= 0; i--) {
    const evaluated = evaluateComputableLatex(candidates[i]);
    if (evaluated) return evaluated;
  }
  return null;
}

function resolveTurn(turn: ProbeTurn, toolCalls: unknown[]): ProviderResult {
  if ('say' in turn) return { text: turn.say, ended: false };

  const computed = findComputableLatex(toolCalls);
  if (computed) return { text: `${turn.prefix ?? ''}${computed.display}. Right?`, ended: false };
  return { text: turn.fallbackSay, ended: false };
}

export function makeProbeProvider(probe: VerdictProbe): (ctx: ProviderCtx) => ProviderResult {
  return ({ turnIndex, toolCalls }: ProviderCtx): ProviderResult => {
    if (turnIndex >= probe.turns.length) return { text: 'thanks, that is all for now.', ended: true };
    return resolveTurn(probe.turns[turnIndex], toolCalls);
  };
}
