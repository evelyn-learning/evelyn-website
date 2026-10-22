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
import { compareDeterministic, numbersAgree, parseSimpleNumber } from '../portal/key-compare';
import type { AnswerKey, AnswerPart, KeyStep } from './types';

export interface SolveOutcome { parts: AnswerPart[] | null; steps?: KeyStep[]; usage?: { in: number; out: number } }
export type SolveFn = (text: string) => Promise<SolveOutcome>;
export interface KeySolveDeps { solveA: SolveFn; solveB: SolveFn; solveTieBreak: SolveFn; names: [string, string, string] }
export interface KeySolveResult { key: AnswerKey | null; agreed: boolean; candidates: string[]; note?: string; tokens?: { in: number; out: number } }

const CALL_OPTS = { timeout: 60_000, maxRetries: 0 } as const;
const SOLVE_MAX_TOKENS = 8000;

export const KEY_SOLVE_SYSTEM = `You solve one homework problem completely and independently, and report the final answer for every part. The problem text includes any bracketed figure or graph description; use only what the text and that description state. Reply with JSON only.

Rules:
1. Work the problem fully before answering. Give one entry per lettered part, using the part's letter as label ("a", "b", ...). When the problem has no lettered parts, give a single entry with label "".
2. "final" is the answer exactly as a student would write it, including units when the problem has them (for example "35.4 cm", "x = 20", "y = 3x + 2").
3. "canonical" is the same answer in machine form. When the answer is a single number, kind is "number", number holds its value, and units holds the unit with the number stripped out ("" when none). Otherwise kind is "text" and text holds the answer as written. Unused canonical fields are 0 or "".
4. Round numeric answers to 4 significant figures unless the problem asks for a different precision or the answer is exact.
5. If the problem cannot be solved from the text and the figure description (missing data, contradictory data, or a figure that is needed but not described), set ill_posed to a short reason and return an empty parts array. Never guess.
6. steps: the solution path a tutor would walk the student along — one entry per step, in order. relation is the fact, theorem or equation the step uses (one sentence, at most 25 words); value is that step's intermediate result exactly as a student would write it ("AE = 4", "(5x + 5) = 40 + ∠B"), or "" when the step yields none. At most 8 steps. Every number in the finals must be reachable from these steps.`;

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
    steps: {
      type: 'array',
      items: {
        type: 'object',
        properties: { relation: { type: 'string' }, value: { type: 'string' } },
        required: ['relation', 'value'],
        additionalProperties: false,
      },
    },
    ill_posed: { type: 'string' },
  },
  required: ['parts', 'steps'],
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
/** A value's name as the keyed verdict compares it: lower case, no spaces ("PA" → "pa", "m∠1" → "m∠1"). */
export const normValueName = (s: string) => String(s ?? '').toLowerCase().replace(/\s+/g, '');

/** The named numbers of a final such as "x = 7, PA = 17" or "m∠1 = 116°, m∠2 = 64°"; empty unless there are at least two. */
export function namedValues(final: string): Array<{ name: string; value: number }> {
  const out: Array<{ name: string; value: number }> = [];
  const re = /(?:^|[,;]\s*|\band\s+|\s)([A-Za-z∠][A-Za-z0-9∠′'_]{0,7})\s*[=≈]\s*(-?\d+(?:\.\d+)?)(?![\d.]*\s*[+\-*/×÷^])/g;
  for (const m of final.matchAll(re)) {
    const name = normValueName(m[1]);
    const value = Number(m[2]);
    if (!Number.isFinite(value) || out.some((v) => v.name === name)) continue;
    out.push({ name, value });
  }
  return out.length >= 2 ? out : [];
}

const oneLine = (s: string): string => s.replace(/\s+/g, ' ').trim();

/** Model JSON steps -> at most 8 `{ relation, value? }` (one line each; relation ≤ 200, value ≤ 80 chars); entries without a non-empty relation are dropped. */
export function normalizeKeySteps(raw: unknown): KeyStep[] {
  if (!Array.isArray(raw)) return [];
  const out: KeyStep[] = [];
  for (const e of raw) {
    const relation = typeof (e as { relation?: unknown } | null)?.relation === 'string' ? oneLine((e as { relation: string }).relation).slice(0, 200) : '';
    if (!relation) continue;
    const v = (e as { value?: unknown }).value;
    const value = typeof v === 'string' ? oneLine(v).slice(0, 80) : '';
    out.push(value ? { relation, value } : { relation });
    if (out.length === 8) break;
  }
  return out;
}

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
      const values = namedValues(final);
      out.push({ label, final, canonical: { kind: 'text', value: (typeof c.text === 'string' && c.text.trim()) || final }, ...(values.length ? { values } : {}) });
    }
  }
  return out;
}

async function callSolve(role: 'plangen-vision' | 'content-verify', effort: 'medium' | 'high', text: string): Promise<SolveOutcome> {
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
    const usage = { in: msg.usage?.input_tokens ?? 0, out: msg.usage?.output_tokens ?? 0 };
    if (msg.stop_reason === 'max_tokens' || msg.stop_reason === 'refusal') return { parts: null, usage };
    const raw = msg.content.filter((b) => b.type === 'text').map((b) => (b as Anthropic.TextBlock).text).join('');
    const json = JSON.parse(raw.trim());
    return { parts: normalizeKeyParts(json), steps: normalizeKeySteps(json?.steps), usage };
  } catch {
    return { parts: null };
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

/** Same part count, every part equal — by label when the labels match, else by position; any doubt is "no". */
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
  // 2026-10-22 (hw-15 p4, "find the area and perimeter"): three solvers agreed on
  // the numbers and labelled them "area/perimeter", "" and "a/b" — the key was
  // refused on the labels alone. Labels that match pair by label; otherwise the
  // parts pair by position (same count, every part equal in order).
  const sameLabels = [...ma.keys()].every((k) => mb.has(k));
  if (sameLabels) {
    for (const [k, pa] of ma) if (!partAgree(pa, mb.get(k)!)) return false;
    return true;
  }
  return a.every((pa, i) => partAgree(pa, b[i]));
}

const describe = (name: string, ps: AnswerPart[] | null): string =>
  ps ? `${name}: ${ps.map((p) => (p.label ? `${p.label}) ` : '') + p.final).join('; ')}` : `${name}: (no answer)`;

const normReach = (s: string): string => (s ?? '').toLowerCase().replace(/\s+/g, '').replace(/[−–]/g, '-');

/** Numbers a step value states: plain decimals, and simple radicals `c√n` / `c sqrt n` / `c root n` as c·√n. */
function stepNumbers(value: string): number[] {
  const v = value.replace(/[−–]/g, '-');
  const out: number[] = [];
  for (const m of v.matchAll(/-?\d+(?:\.\d+)?/g)) out.push(Number(m[0]));
  for (const m of v.matchAll(/(-?\d+(?:\.\d+)?)?\s*(?:√|\bsqrt\b|\broot\b)\s*\(?\s*(\d+(?:\.\d+)?)/gi)) {
    const c = m[1] === undefined ? 1 : Number(m[1]);
    out.push(c * Math.sqrt(Number(m[2])));
  }
  return out.filter(Number.isFinite);
}

/**
 * Final review (I6): a path is stored only when every number-kind final is
 * reachable from it — its value agrees (±1 %) with a number a step states, or
 * its final appears in a step value. Text-kind parts impose no requirement.
 */
export function pathReachesFinals(parts: AnswerPart[], steps: KeyStep[]): boolean {
  const values = steps.map((s) => s.value ?? '').filter(Boolean);
  const nums = values.flatMap(stepNumbers);
  const texts = values.map(normReach);
  return parts.every((p) => {
    if (p.canonical.kind !== 'number') return true;
    const target = p.canonical.value;
    if (nums.some((n) => numbersAgree(target, n))) return true;
    const f = normReach(p.final);
    return !!f && texts.some((t) => t.includes(f));
  });
}

export async function solveKey(problem: { n: number; text: string }, deps: KeySolveDeps): Promise<KeySolveResult> {
  let tokens: { in: number; out: number } | undefined;
  type Slot = 'a' | 'b' | 't';
  const steps = new Map<Slot, KeyStep[]>();
  const safe = async (slot: Slot, fn: SolveFn): Promise<AnswerPart[] | null> => {
    try {
      const r = await fn(problem.text);
      if (r?.usage) tokens = { in: (tokens?.in ?? 0) + r.usage.in, out: (tokens?.out ?? 0) + r.usage.out };
      if (r?.parts && r.steps?.length) steps.set(slot, r.steps);
      return r?.parts ?? null;
    } catch { return null; }
  };
  /**
   * The agreeing pair's path. The Opus role ('plangen-vision*', the tie-break
   * included) is preferred, its non-tie-break solve first; otherwise pair order.
   * A preferred solver without steps yields to the other agreeing solver's
   * path (final review R6: any agreeing path beats none), and so does one
   * that does not reach every final (I6); none reaching them stores no steps.
   */
  const keyOf = (pair: Array<[Slot, string, AnswerPart[]]>): AnswerKey => {
    const rank = ([slot, name]: [Slot, string, AnswerPart[]]): number => (name.startsWith('plangen-vision') ? (slot === 't' ? 1 : 0) : 2);
    const ordered = pair.map((e, i) => ({ e, i })).sort((x, y) => rank(x.e) - rank(y.e) || x.i - y.i).map(({ e }) => e);
    const paths = ordered.map(([slot]) => steps.get(slot)).filter((s): s is KeyStep[] => !!s?.length);
    const st = paths.find((s) => pathReachesFinals(pair[0][2], s));
    if (paths.length && !st) console.warn(`[homework-build] n=${problem.n} steps dropped: finals not reachable from the path`);
    return { parts: pair[0][2], solvers: pair.map(([, name]) => name), ...(st?.length ? { steps: st } : {}) };
  };
  const out = async (r: KeySolveResult): Promise<KeySolveResult> => (tokens ? { ...r, tokens } : r);
  const [n0, n1, n2] = deps.names;
  const [a, b] = await Promise.all([safe('a', deps.solveA), safe('b', deps.solveB)]);
  if (a && b && partsAgree(a, b)) return out({ key: keyOf([['a', n0, a], ['b', n1, b]]), agreed: true, candidates: [] });

  if (!a && !b) return out({ key: null, agreed: false, candidates: [describe(n0, a), describe(n1, b)], note: 'both solvers failed' });
  const t = await safe('t', deps.solveTieBreak);
  const candidates = [describe(n0, a), describe(n1, b), describe(n2, t)];
  const withA = !!(t && a && partsAgree(a, t));
  const withB = !!(t && b && partsAgree(b, t));
  if (withA && withB) return out({ key: null, agreed: false, candidates, note: 'ambiguous: tie-break matches both disagreeing solvers' });
  if (withA) return out({ key: keyOf([['a', n0, a!], ['t', n2, t!]]), agreed: true, candidates: [] });
  if (withB) return out({ key: keyOf([['b', n1, b!], ['t', n2, t!]]), agreed: true, candidates: [] });
  return out({ key: null, agreed: false, candidates });
}
