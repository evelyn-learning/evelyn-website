/**
 * Offline answer key for the per-problem homework build: two independent
 * solves must AGREE before the key is trusted; a disagreement gets one
 * tie-break solve, and anything still unresolved yields no key at all (never a
 * partial key). Every model call sits behind `KeySolveDeps`; tests inject
 * stubs, only production code constructs `defaultKeySolveDeps()`.
 *
 * Asymmetry that drives `partsAgree`: a false "agree" lets a wrong key judge
 * students, a false "disagree" only costs a tie-break call. Every doubt
 * resolves to "disagree".
 */

import type Anthropic from '@anthropic-ai/sdk';
import { getModelClient, prepareParams } from '../ai/model-registry';
import { compareDeterministic, parseSimpleNumber } from '../portal/key-compare';
import type { AnswerKey, AnswerPart } from './types';

export type SolveFn = (text: string) => Promise<AnswerPart[] | null>;
export interface KeySolveDeps { solveA: SolveFn; solveB: SolveFn; solveTieBreak: SolveFn; names: [string, string, string] }
export interface KeySolveResult { key: AnswerKey | null; agreed: boolean; candidates: string[]; note?: string }

const CALL_OPTS = { timeout: 60_000, maxRetries: 0 } as const;
const SOLVE_MAX_TOKENS = 8000;

export const KEY_SOLVE_SYSTEM = `You solve one homework problem completely and independently, and report the final answer for every part. The problem text includes any bracketed figure or graph description; use only what the text and that description state. Reply with JSON only.

Rules:
1. Work the problem fully before answering. Give one entry per lettered part, using the part's letter as label ("a", "b", ...). When the problem has no lettered parts, give a single entry with label "".
2. "final" is the answer exactly as a student would write it, including units when the problem has them (for example "35.4 cm", "x = 20", "y = 3x + 2").
3. "canonical" is the same answer in machine form. When the answer is a single number, kind is "number", number holds its value, and units holds the unit with the number stripped out ("" when none). Otherwise kind is "text" and text holds the answer as written. Unused canonical fields are 0 or "".
4. Round numeric answers to 4 significant figures unless the problem asks for a different precision or the answer is exact.
5. If the problem cannot be solved from the text and the figure description (missing data, contradictory data, or a figure that is needed but not described), set ill_posed to a short reason and return an empty parts array. Never guess.`;

export const KEY_SOLVE_SCHEMA = {
  type: 'object',
  properties: {
    parts: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          label: { type: 'string' },
          final: { type: 'string' },
          canonical: {
            type: 'object',
            properties: {
              kind: { type: 'string', enum: ['number', 'text'] },
              number: { type: 'number' },
              text: { type: 'string' },
              units: { type: 'string' },
            },
            required: ['kind', 'number', 'text', 'units'],
            additionalProperties: false,
          },
        },
        required: ['label', 'final', 'canonical'],
        additionalProperties: false,
      },
    },
    ill_posed: { type: 'string' },
  },
  required: ['parts'],
  additionalProperties: false,
} as const;

const normLabel = (l: string): string => (l ?? '').toLowerCase().replace(/[\s().:]/g, '');

/** Splits a trailing unit off a number-only answer ("35.42 cm" -> "cm", "20°" -> "°"). */
function trailingUnit(final: string): string {
  if (!parseSimpleNumber(final)) return '';
  const t = final.trim().replace(/[.;]$/, '').replace(/^[A-Za-z]\w{0,2}\s*(?:=|≈)\s*/, '');
  const m = t.match(/^[^\d.-]*-?[\d,]*\.?\d+(?:\s*\/\s*\d+(?:\.\d+)?)?\s*%?\s*(.*)$/);
  return (m?.[1] ?? '').trim();
}

/** Model JSON -> parts, or null for ill_posed / malformed / empty. Trailing units move into canonical.units. */
export function normalizeKeyParts(o: unknown): AnswerPart[] | null {
  const r = o as { parts?: unknown; ill_posed?: unknown } | null;
  if (!r || typeof r !== 'object') return null;
  if (typeof r.ill_posed === 'string' && r.ill_posed.trim()) return null;
  if (!Array.isArray(r.parts) || r.parts.length === 0) return null;
  const out: AnswerPart[] = [];
  for (const p of r.parts as Array<Record<string, unknown>>) {
    const final = typeof p?.final === 'string' ? p.final.trim() : '';
    const c = (p?.canonical ?? {}) as Record<string, unknown>;
    if (!final) return null;
    const label = typeof p.label === 'string' ? normLabel(p.label) : '';
    if (c.kind === 'number' && typeof c.number === 'number' && Number.isFinite(c.number)) {
      const units = (typeof c.units === 'string' && c.units.trim()) || trailingUnit(final);
      out.push({ label, final, canonical: { kind: 'number', value: c.number, ...(units ? { units } : {}) } });
    } else {
      out.push({ label, final, canonical: { kind: 'text', value: (typeof c.text === 'string' && c.text.trim()) || final } });
    }
  }
  return out;
}

async function callSolve(role: 'plangen-vision' | 'content-verify', effort: 'medium' | 'high', text: string): Promise<AnswerPart[] | null> {
  try {
    const { client, model } = getModelClient(role);
    const params = prepareParams(role, {
      model,
      max_tokens: SOLVE_MAX_TOKENS,
      system: KEY_SOLVE_SYSTEM,
      messages: [{ role: 'user', content: text }],
      thinking: { type: 'adaptive' },
      output_config: { effort, format: { type: 'json_schema', schema: KEY_SOLVE_SCHEMA } },
    });
    const msg = await client.messages.create(params as unknown as Anthropic.MessageCreateParamsNonStreaming, { ...CALL_OPTS });
    if (msg.stop_reason === 'max_tokens' || msg.stop_reason === 'refusal') return null;
    const raw = msg.content.filter((b) => b.type === 'text').map((b) => (b as Anthropic.TextBlock).text).join('');
    return normalizeKeyParts(JSON.parse(raw.trim()));
  } catch {
    return null;
  }
}

export function defaultKeySolveDeps(): KeySolveDeps {
  return {
    solveA: (t) => callSolve('content-verify', 'medium', t),
    solveB: (t) => callSolve('plangen-vision', 'medium', t),
    solveTieBreak: (t) => callSolve('plangen-vision', 'high', t),
    names: ['content-verify', 'plangen-vision', 'plangen-vision-tiebreak'],
  };
}

const normUnit = (u: string): string => {
  const x = (u ?? '').toLowerCase().replace(/[\s.·*⋅]/g, '').replace(/\^2/g, '²').replace(/\^3/g, '³');
  return x === '°' || x === 'deg' || x === 'degree' || x === 'degrees' ? 'deg' : x;
};
const normText = (s: string): string => (s ?? '').toLowerCase().replace(/\s+/g, ' ').trim().replace(/\.+$/, '').trim();

function unitOf(p: AnswerPart): string {
  const c = p.canonical;
  return normUnit((c.kind === 'number' && c.units) || trailingUnit(p.final));
}

/** Parsed value of a number-only `final`, for cross-checking the canonical value. */
function finalValue(p: AnswerPart): number | null {
  const s = parseSimpleNumber(p.final);
  return s && !s.percent ? s.value : null;
}

function relClose(a: number, b: number): boolean {
  return Math.abs(a - b) <= 0.01 * Math.max(Math.abs(a), Math.abs(b));
}

function partAgree(a: AnswerPart, b: AnswerPart): boolean {
  if (a.canonical.kind !== b.canonical.kind) return false;
  if (a.canonical.kind === 'text' && b.canonical.kind === 'text') {
    const x = normText(a.canonical.value), y = normText(b.canonical.value);
    return !!x && x === y;
  }
  if (a.canonical.kind !== 'number' || b.canonical.kind !== 'number') return false;
  const av = a.canonical.value, bv = b.canonical.value;
  if (!Number.isFinite(av) || !Number.isFinite(bv)) return false;
  const ua = unitOf(a), ub = unitOf(b);
  if (ua && ub && ua !== ub) return false;
  // The canonical value must not contradict what the student-facing final says.
  for (const [p, v] of [[a, av], [b, bv]] as const) {
    const fv = finalValue(p);
    if (fv !== null && !relClose(fv, v) && Math.abs(fv - v) > 0.01) return false;
  }
  // The portal comparator (±1 %, decimal-key tightening), both directions; plus a
  // relative guard because its 0.01 absolute floor would call 0 and 0.005 equal.
  const sa = String(av), sb = String(bv);
  if (compareDeterministic(sa, sb).result !== 'same' || compareDeterministic(sb, sa).result !== 'same') return false;
  return av === bv || relClose(av, bv);
}

/** Same part count and labels (order-insensitive), every part equal; any doubt is "no". */
export function partsAgree(a: AnswerPart[], b: AnswerPart[]): boolean {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length === 0 || a.length !== b.length) return false;
  const index = (ps: AnswerPart[]): Map<string, AnswerPart> | null => {
    const m = new Map<string, AnswerPart>();
    for (const p of ps) {
      const k = normLabel(p.label);
      if (m.has(k)) return null;           // duplicate label: ambiguous pairing
      m.set(k, p);
    }
    return m;
  };
  const ma = index(a), mb = index(b);
  if (!ma || !mb) return false;
  for (const [k, pa] of ma) {
    const pb = mb.get(k);
    if (!pb || !partAgree(pa, pb)) return false;
  }
  return true;
}

const describe = (name: string, ps: AnswerPart[] | null): string =>
  ps ? `${name}: ${ps.map((p) => (p.label ? `${p.label}) ` : '') + p.final).join('; ')}` : `${name}: (no answer)`;

export async function solveKey(problem: { n: number; text: string }, deps: KeySolveDeps): Promise<KeySolveResult> {
  const safe = async (fn: SolveFn): Promise<AnswerPart[] | null> => {
    try { return (await fn(problem.text)) ?? null; } catch { return null; }
  };
  const [n0, n1, n2] = deps.names;
  const [a, b] = await Promise.all([safe(deps.solveA), safe(deps.solveB)]);
  if (a && b && partsAgree(a, b)) return { key: { parts: a, solvers: [n0, n1] }, agreed: true, candidates: [] };

  if (!a && !b) return { key: null, agreed: false, candidates: [describe(n0, a), describe(n1, b)], note: 'both solvers failed' };
  const t = await safe(deps.solveTieBreak);
  const candidates = [describe(n0, a), describe(n1, b), describe(n2, t)];
  const withA = !!(t && a && partsAgree(a, t));
  const withB = !!(t && b && partsAgree(b, t));
  if (withA && withB) return { key: null, agreed: false, candidates, note: 'ambiguous: tie-break matches both disagreeing solvers' };
  if (withA) return { key: { parts: a!, solvers: [n0, n2] }, agreed: true, candidates: [] };
  if (withB) return { key: { parts: b!, solvers: [n1, n2] }, agreed: true, candidates: [] };
  return { key: null, agreed: false, candidates };
}
