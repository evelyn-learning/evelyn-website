/**
 * Computed facts about a system / inequality problem — and the check of a
 * tutor sentence against them.
 *
 * 2026-10-06b (owner sessions portal-2de3c6c8 text, portal-10beb4f5 voice).
 * Problem: solve 2x + y < 4 and x − 3y > 2 by graphing. The graph the tutor
 * drew was right (it is sampled against the problem — graph-inequalities.ts
 * `checkGraphRegion`). What the tutor SAID was not: four times it stated the
 * solution as "below the first line but above the second", told the student
 * who read the graph correctly that the region "must be above that red line,
 * not below it", and ended the problem on the wrong region. Nothing
 * deterministic stood against a spoken region: the board description listed
 * the inequalities but not which side of which line is shaded, the verdict
 * pre-check and the judge read the same conversation and followed the error
 * (the judge even mis-assigned the colours).
 *
 * The region is not a matter of opinion. From the problem's own parsed
 * inequalities this module derives, per inequality: the solved form, which
 * side of its boundary holds, the boundary style; the crossing of the
 * boundaries; and one point inside and one outside the solution with the
 * truth of every inequality at each. From the graph on the board it reads
 * how each line is DRAWN (colour, legend label). The same facts are handed to
 * the graph's board description, the brain's per-turn content, the verdict
 * pre-check and the judge — and `spokenRegionContradiction` holds a tutor
 * sentence to them.
 *
 * Everything here is derived from the problem in front of the student; the
 * wording carries no subject content of its own (repo rule).
 *
 * Pure — no DOM, no I/O, never throws. `npm run test:inequality-facts`.
 */
import {
  extractProblemInequalities,
  fnText,
  inequalityEntryText,
    parseXYExpression,
  parseXYRelation,
  sameBoundary,
  type Window,
  type XYRelation,
} from './graph-inequalities';
import { TUTOR_TEST_POINT_BOTH_FORMS } from '@/lib/tutor/orchestrator/turn-round-flags';

/** The graph renderer's palette (DesmosGraphRenderer imports it from here so
 *  the colour NAMED in the facts is the colour DRAWN). */
export const GRAPH_COLORS = [
  '#2563eb', // blue
  '#dc2626', // red
  '#16a34a', // green
  '#9333ea', // purple
  '#ea580c', // orange
  '#0891b2', // teal
] as const;

export type RegionSide = 'below' | 'above' | 'left' | 'right';

export interface DrawnLine {
  /** Colour name of the inequality's shading and boundary ("blue"). */
  color?: string;
  /** Colour name of a plotted function along the same boundary, when it
   *  differs from `color`. */
  lineColor?: string;
  /** The legend label, as drawn. */
  label?: string;
}

export interface InequalityFact {
  /** 1-based position in the problem ("the first line"). */
  n: number;
  /** The inequality as the problem states it. */
  source: string;
  strict: boolean;
  /** "y < -2x + 4" / "x > 3" — present when the boundary is a straight line. */
  solved?: string;
  /** "y = -2x + 4" / "x = 3". */
  boundary?: string;
  /** Which side of its boundary the inequality holds on. Absent when that
   *  cannot be said in one word (a chain, a closed curve). */
  side?: RegionSide;
  /** The boundary as a·x + b·y + c = 0, when it is a straight line. */
  line?: { a: number; b: number; c: number };
  drawn?: DrawnLine;
  relation: XYRelation;
}

export interface PointFact {
  x: number;
  y: number;
  /** Every inequality of the problem at this point, in order. */
  truths: Array<{ source: string; values: string; holds: boolean }>;
  inSolution: boolean;
}

export interface InequalityFacts {
  inequalities: InequalityFact[];
  /** Where two straight boundaries cross. */
  crossings: Array<{ x: number; y: number; of: [number, number]; inSolution: boolean }>;
  inside?: PointFact;
  outside?: PointFact;
  /** A graph on the board draws at least one of the boundaries. */
  hasGraph: boolean;
}

type Loose = Record<string, unknown>;
const asArray = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const W: Window = { x0: -10, x1: 10, y0: -10, y1: 10 };

// ── numbers ─────────────────────────────────────────────────────────────────

/** A number as a student would write it: an integer, a small fraction, or a
 *  short decimal. */
export function formatFactNumber(n: number): string {
  if (!Number.isFinite(n)) return String(n);
  if (Math.abs(n) < 1e-9) return '0';
  const r = Math.round(n);
  if (Math.abs(n - r) < 1e-9) return String(r);
  for (let q = 2; q <= 24; q++) {
    const p = Math.round(n * q);
    if (Math.abs(n * q - p) < 1e-9) return `${p}/${q}`;
  }
  return String(Math.round(n * 1000) / 1000);
}

/** "m·x + k" in plain text: "-2x + 4", "(1/3)x - 2/3", "x", "4". */
function linearText(m: number, k: number, v: 'x' | 'y' = 'x'): string {
  const zero = (n: number) => Math.abs(n) < 1e-9;
  let head = '';
  if (!zero(m)) {
    const mag = formatFactNumber(Math.abs(m));
    const coef = mag === '1' ? '' : mag.includes('/') ? `(${mag})` : mag;
    head = `${m < 0 ? '-' : ''}${coef}${v}`;
  }
  if (zero(k)) return head || '0';
  const kMag = formatFactNumber(Math.abs(k));
  if (!head) return `${k < 0 ? '-' : ''}${kMag}`;
  return `${head} ${k < 0 ? '-' : '+'} ${kMag}`;
}

const pointText = (x: number, y: number): string => `(${formatFactNumber(x)}, ${formatFactNumber(y)})`;

// ── one inequality ──────────────────────────────────────────────────────────

const PROBES: Array<[number, number]> = [[0.37, 1.91], [-2.3, 0.7], [4.1, -3.3], [-5.7, -6.2], [7.9, 2.6], [1.3, -8.4]];

/** a, b, c with diff(x, y) = a·x + b·y + c everywhere, or null. */
function straightLine(diff: (x: number, y: number) => number): { a: number; b: number; c: number } | null {
  const c = diff(0, 0);
  const a = diff(1, 0) - c;
  const b = diff(0, 1) - c;
  if (![a, b, c].every(Number.isFinite)) return null;
  if (Math.abs(a) < 1e-12 && Math.abs(b) < 1e-12) return null;
  for (const [x, y] of PROBES) {
    const want = a * x + b * y + c;
    const got = diff(x, y);
    if (!Number.isFinite(got) || Math.abs(got - want) > 1e-7 * Math.max(1, Math.abs(want))) return null;
  }
  return { a, b, c };
}

/** The sign of ∂diff/∂y when it is one constant sign everywhere sampled
 *  (a curve y = f(x): "above" and "below" are still well defined), else 0. */
function ySlopeSign(diff: (x: number, y: number) => number): 1 | -1 | 0 {
  let sign = 0;
  for (const [x, y] of PROBES) {
    const d0 = diff(x, y), d1 = diff(x, y + 1), d2 = diff(x, y + 2);
    if (![d0, d1, d2].every(Number.isFinite)) return 0;
    const s1 = d1 - d0, s2 = d2 - d1;
    // Linear in y with one coefficient.
    if (Math.abs(s1 - s2) > 1e-7 * Math.max(1, Math.abs(s1))) return 0;
    if (Math.abs(s1) < 1e-9) return 0;
    const s = s1 > 0 ? 1 : -1;
    if (sign !== 0 && s !== sign) return 0;
    sign = s;
  }
  // …and the same coefficient at every x.
  const ref = diff(0, 1) - diff(0, 0);
  for (const [x] of PROBES) {
    const got = diff(x, 1) - diff(x, 0);
    if (Math.abs(got - ref) > 1e-7 * Math.max(1, Math.abs(ref))) return 0;
  }
  return sign as 1 | -1 | 0;
}

function factOf(relation: XYRelation, n: number): InequalityFact {
  const fact: InequalityFact = { n, source: relation.pretty, strict: relation.strict, relation };
  if (relation.ops.length !== 1 || relation.ops[0] === '=') return fact;
  const op = relation.ops[0];
  const less = op === '<' || op === '<=';
  const diff = relation.boundaries[0].diff;
  const line = straightLine(diff);
  if (line) {
    fact.line = line;
    const { a, b, c } = line;
    if (Math.abs(b) > 1e-12) {
      // b·y (op) −a·x − c: dividing by a negative b turns the sign round.
      const below = less === (b > 0);
      const rhs = linearText(-a / b, -c / b);
      fact.side = below ? 'below' : 'above';
      fact.solved = `y ${below ? (relation.strict ? '<' : '≤') : (relation.strict ? '>' : '≥')} ${rhs}`;
      fact.boundary = `y = ${rhs}`;
    } else {
      const left = less === (a > 0);
      const k = formatFactNumber(-c / a);
      fact.side = left ? 'left' : 'right';
      fact.solved = `x ${left ? (relation.strict ? '<' : '≤') : (relation.strict ? '>' : '≥')} ${k}`;
      fact.boundary = `x = ${k}`;
    }
    return fact;
  }
  const s = ySlopeSign(diff);
  if (s !== 0) fact.side = less === (s > 0) ? 'below' : 'above';
  return fact;
}

// ── how the lines are drawn ─────────────────────────────────────────────────

const NAMED_COLORS: Record<string, string> = {
  blue: 'blue', red: 'red', green: 'green', purple: 'purple', violet: 'purple', orange: 'orange',
  teal: 'teal', cyan: 'teal', turquoise: 'teal', black: 'black', gray: 'grey', grey: 'grey',
  pink: 'pink', magenta: 'pink', yellow: 'yellow', brown: 'brown', navy: 'blue', crimson: 'red', lime: 'green',
};

/** A colour as a person would name it; undefined when it cannot be read. */
export function colorName(c: unknown): string | undefined {
  if (typeof c !== 'string') return undefined;
  const t = c.trim().toLowerCase();
  if (!t) return undefined;
  if (NAMED_COLORS[t]) return NAMED_COLORS[t];
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/.exec(t);
  if (!m) return undefined;
  const hex = m[1].length === 3 ? m[1].split('').map((ch) => ch + ch).join('') : m[1];
  const r = parseInt(hex.slice(0, 2), 16) / 255, g = parseInt(hex.slice(2, 4), 16) / 255, b = parseInt(hex.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, d = max - min;
  const sat = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  if (sat < 0.15) return l < 0.2 ? 'black' : l > 0.85 ? 'white' : 'grey';
  let h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  h = (h * 60 + 360) % 360;
  if (h < 15 || h >= 335) return 'red';
  if (h < 45) return 'orange';
  if (h < 70) return 'yellow';
  if (h < 165) return 'green';
  if (h < 200) return 'teal';
  if (h < 255) return 'blue';
  if (h < 290) return 'purple';
  return 'pink';
}

const cleanLabel = (v: unknown): string | undefined => {
  if (typeof v !== 'string') return undefined;
  // Comparison signs are part of a legend label ("2x+y<4"); anything shaped
  // like a tag is not.
  const t = v.replace(/<\/?[a-zA-Z_][^<>]*>/g, ' ').replace(/[\r\n"$]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 48);
  return t || undefined;
};

/** Colour + legend label of whatever the graph draws along this boundary.
 *  The indices mirror DesmosGraphRenderer: an inequality takes the palette
 *  entry of its position among the READABLE inequalities; a function takes
 *  the entry of its position among functions, then functionsOfY. */
function drawnLineFor(fact: InequalityFact, data: Loose): DrawnLine | undefined {
  const diff = fact.relation.boundaries[0]?.diff;
  if (!diff) return undefined;
  let out: DrawnLine | undefined;
  let i = 0;
  for (const entry of asArray(data.inequalities)) {
    const p = parseXYRelation(inequalityEntryText(entry));
    if (!p.ok) continue;
    const idx = i++;
    if (p.relation.ops.length !== 1) continue;
    if (sameBoundary(diff, p.relation.boundaries[0].diff, W) === null) continue;
    const o = (entry && typeof entry === 'object' ? entry : {}) as Loose;
    out = { color: colorName(o.color) ?? colorName(GRAPH_COLORS[idx % GRAPH_COLORS.length]), label: cleanLabel(o.label) };
    break;
  }
  const tryFn = (f: unknown, variable: 'x' | 'y', idx: number): boolean => {
    const text = fnText(f).replace(/^\s*[yYxX]\s*=\s*/, '');
    if (!text) return false;
    const e = parseXYExpression(text);
    if (!e.ok || (variable === 'x' ? e.usesY : e.usesX)) return false;
    const d = variable === 'x' ? (x: number, y: number) => y - e.evaluate(x, y) : (x: number, y: number) => x - e.evaluate(x, y);
    if (sameBoundary(diff, d, W) === null) return false;
    const o = (f && typeof f === 'object' ? f : {}) as Loose;
    const color = colorName(o.color) ?? colorName(GRAPH_COLORS[idx % GRAPH_COLORS.length]);
    if (!out) out = { color, label: cleanLabel(o.label) };
    else if (color && color !== out.color) out.lineColor = color;
    return true;
  };
  const plotted: Array<[unknown, 'x' | 'y']> = [
    ...asArray(data.functions).map((f): [unknown, 'x' | 'y'] => [f, 'x']),
    ...asArray(data.functionsOfY).map((f): [unknown, 'x' | 'y'] => [f, 'y']),
  ];
  for (let idx = 0; idx < plotted.length; idx++) {
    if (tryFn(plotted[idx][0], plotted[idx][1], idx)) break;
  }
  return out;
}

// ── points ──────────────────────────────────────────────────────────────────

function pointFact(x: number, y: number, relations: XYRelation[]): PointFact {
  const opText = (o: string) => (o === '<=' ? '≤' : o === '>=' ? '≥' : o);
  const truths = relations.map((r) => {
    const vals = r.sideValues(x, y);
    const values = vals.map((v, k) => (k === 0 ? formatFactNumber(v) : `${opText(r.ops[k - 1])} ${formatFactNumber(v)}`)).join(' ');
    return { source: r.pretty, values, holds: r.holds(x, y) };
  });
  return { x, y, truths, inSolution: truths.every((t) => t.holds) };
}

/** Lattice points nearest the origin first; points on an axis before others
 *  at the same distance. */
function latticeNearOrigin(): Array<[number, number]> {
  const pts: Array<[number, number]> = [];
  for (let x = -10; x <= 10; x++) for (let y = -10; y <= 10; y++) pts.push([x, y]);
  const key = ([x, y]: [number, number]) => (Math.abs(x) + Math.abs(y)) * 4 + (x === 0 || y === 0 ? 0 : 2) + (x < 0 ? 1 : 0);
  return pts.sort((p, q) => key(p) - key(q));
}

function samplePoints(relations: XYRelation[], lines: Array<InequalityFact['line']>): { inside?: PointFact; outside?: PointFact } {
  // Distance to a straight boundary is measured as a distance, so the same
  // line written two ways ("x - 3y > 2", "y < (x - 2)/3") picks the same point.
  const margin = (x: number, y: number) => Math.min(...relations.map((r, k) => {
    const l = lines[k];
    return l ? Math.abs(l.a * x + l.b * y + l.c) / Math.hypot(l.a, l.b) : r.margin(x, y);
  }));
  const clear = (x: number, y: number, by: number) => { const m = margin(x, y); return Number.isFinite(m) && m >= by; };
  const all = (x: number, y: number) => relations.every((r) => r.holds(x, y));
  const lattice = latticeNearOrigin();
  let inside: [number, number] | undefined;
  let outside: [number, number] | undefined;
  // The origin first, whichever side it is on, when it is off every boundary.
  if (clear(0, 0, 1e-6)) { if (all(0, 0)) inside = [0, 0]; else outside = [0, 0]; }
  for (const by of [0.25, 1e-6]) {
    for (const p of lattice) {
      if (inside && outside) break;
      if (!clear(p[0], p[1], by)) continue;
      if (all(p[0], p[1])) { if (!inside) inside = p; } else if (!outside) outside = p;
    }
  }
  return {
    ...(inside ? { inside: pointFact(inside[0], inside[1], relations) } : {}),
    ...(outside ? { outside: pointFact(outside[0], outside[1], relations) } : {}),
  };
}

// ── the facts ───────────────────────────────────────────────────────────────

const MAX_FACT_INEQUALITIES = 4;

/**
 * Facts for a set of inequalities (the problem's, or a graph's own).
 * `graph` — the data of a graph on the board that draws them, if any.
 * Null when there is nothing to say (no relation, or too many to list).
 */
export function buildInequalityFacts(relations: ReadonlyArray<XYRelation>, graph?: unknown): InequalityFacts | null {
  try {
    const rels = relations.filter((r) => r && r.isInequality);
    if (rels.length === 0 || rels.length > MAX_FACT_INEQUALITIES) return null;
    const inequalities = rels.map((r, i) => factOf(r, i + 1));
    let hasGraph = false;
    if (graph && typeof graph === 'object') {
      for (const f of inequalities) {
        const drawn = drawnLineFor(f, graph as Loose);
        if (drawn) { f.drawn = drawn; hasGraph = true; }
      }
    }
    const crossings: InequalityFacts['crossings'] = [];
    for (let i = 0; i < inequalities.length; i++) {
      for (let j = i + 1; j < inequalities.length; j++) {
        const p = inequalities[i].line, q = inequalities[j].line;
        if (!p || !q) continue;
        const det = p.a * q.b - q.a * p.b;
        if (Math.abs(det) < 1e-12) continue; // parallel
        const x = (p.b * q.c - q.b * p.c) / det;
        const y = (q.a * p.c - p.a * q.c) / det;
        if (!Number.isFinite(x) || !Number.isFinite(y) || Math.abs(x) > 1e6 || Math.abs(y) > 1e6) continue;
        // On both boundaries: a solution only when neither is strict and every
        // OTHER inequality holds there.
        const others = inequalities.filter((_, k) => k !== i && k !== j).every((f) => f.relation.holds(x, y));
        crossings.push({ x, y, of: [i + 1, j + 1], inSolution: !inequalities[i].strict && !inequalities[j].strict && others });
      }
    }
    return { inequalities, crossings, ...samplePoints(rels, inequalities.map((f) => f.line)), hasGraph };
  } catch {
    return null;
  }
}

const ORDINALS = ['first', 'second', 'third', 'fourth'];
const sideWord = (s: RegionSide): string => (s === 'below' ? 'BELOW' : s === 'above' ? 'ABOVE' : s === 'left' ? 'to the LEFT of' : 'to the RIGHT of');
const lineNoun = (f: InequalityFact): string => (f.line ? 'line' : 'curve');

function drawnText(f: InequalityFact): string {
  const d = f.drawn;
  if (!d) return '';
  const colour = d.color && d.lineColor ? `shaded ${d.color}, its line drawn ${d.lineColor}` : d.color ? `drawn ${d.color}` : '';
  const label = d.label ? `labelled "${d.label}"` : '';
  return [colour, label].filter(Boolean).join(', ');
}

/**
 * 2026-10-06c (portal-818996c1 @241.3 s): the student checked a point in the
 * SOLVED form of an inequality ("0 < -2/3, false") — right — and the tutor,
 * holding only the source-form evaluation ("0 > 2, false"), corrected them.
 * The same point in the solved form, when that form differs from the source:
 * "y < (1/3)x - 2/3: 0 < -2/3, false". Undefined when there is none.
 */
function solvedFormValues(f: InequalityFact | undefined, x: number, y: number, holds: boolean): string | undefined {
  if (!f?.line || !f.solved) return undefined;
  if (f.solved.replace(/\s+/g, '') === f.source.replace(/\s+/g, '')) return undefined;
  const { a, b, c } = f.line;
  const op = /[<>≤≥]/.exec(f.solved)?.[0];
  if (!op) return undefined;
  const values = Math.abs(b) > 1e-12
    ? `${formatFactNumber(y)} ${op} ${formatFactNumber((-a * x - c) / b)}`
    : `${formatFactNumber(x)} ${op} ${formatFactNumber(-c / a)}`;
  return `${f.solved}: ${values}, ${holds ? 'true' : 'false'}`;
}

/** The line every point check leads to when a solved form is given. */
export const EITHER_FORM_LINE =
  'A point checked in either equivalent form of an inequality — as the problem states it, or solved for one variable — gives the same true or false: a check done in either form is equally right.';

function pointLine(p: PointFact, facts?: InequalityFacts): string {
  const each = p.truths.map((t, k) => {
    const solved = facts ? solvedFormValues(facts.inequalities[k], p.x, p.y, t.holds) : undefined;
    return `${t.source} gives ${t.values}, ${t.holds ? 'true' : 'false'}${solved ? ` (same as ${solved})` : ''}`;
  }).join('; ');
  return `${pointText(p.x, p.y)} ${p.inSolution ? 'IS a solution' : 'is NOT a solution'}: ${each}.`;
}

/** The solution region in one clause: "BELOW both lines", "BELOW the first
 *  line and ABOVE the second line". '' when a side is unknown. */
function regionClause(facts: InequalityFacts): string {
  const fs = facts.inequalities;
  if (fs.length < 2 || fs.some((f) => !f.side)) return '';
  const first = fs[0].side!;
  const nouns = fs.every((f) => f.line) ? 'lines' : 'boundaries';
  if (fs.every((f) => f.side === first)) return `${sideWord(first)} ${fs.length === 2 ? 'both' : `all ${fs.length}`} ${nouns}`;
  return fs.map((f) => `${sideWord(f.side!)} the ${ORDINALS[f.n - 1]} ${lineNoun(f)}`).join(' and ');
}

/** The lead sentence every consumer of the facts reads. */
export const INEQUALITY_FACTS_LEAD =
  'Computed facts about the problem on the board — rely on these, do not re-derive the region differently:';

/** The facts as plain lines (no tag, no lead).
 *  @param opts.bothForms  unset ⇒ TUTOR_TEST_POINT_BOTH_FORMS; false ⇒ the
 *    check points in the source form only (the lines of 2b58aacf). */
export function inequalityFactLines(facts: InequalityFacts, opts?: { bothForms?: boolean }): string[] {
  const bothForms = opts?.bothForms ?? TUTOR_TEST_POINT_BOTH_FORMS;
  const many = facts.inequalities.length > 1;
  const lines: string[] = [];
  for (const f of facts.inequalities) {
    const which = many ? `Inequality ${f.n}` : 'The inequality';
    const same = f.solved && f.solved.replace(/\s+/g, '') !== f.source.replace(/\s+/g, '') ? ` is the same as ${f.solved}.` : '.';
    const named = [many ? `the ${ORDINALS[f.n - 1]} ${lineNoun(f)}` : '', drawnText(f) ? `${drawnText(f)} on the graph` : ''].filter(Boolean).join('; ');
    const side = f.side
      ? ` Its solutions are ${sideWord(f.side)} the ${lineNoun(f)} ${f.boundary ?? `where ${f.source.replace(/[<>≤≥]/, '=')}`}${named ? ` (${named})` : ''}.`
      : '';
    const style = f.strict
      ? ` That ${lineNoun(f)} is DASHED: points on it are not solutions.`
      : ` That ${lineNoun(f)} is SOLID: points on it are solutions.`;
    lines.push(`${which}: ${f.source}${same}${side}${style}`);
  }
  for (const c of facts.crossings.slice(0, 3)) {
    lines.push(`The ${ORDINALS[c.of[0] - 1]} and ${ORDINALS[c.of[1] - 1]} boundary lines cross at ${pointText(c.x, c.y)}. That point is on both lines and ${c.inSolution ? 'is a solution' : 'is not a solution'}.`);
  }
  const region = regionClause(facts);
  if (region) lines.push(`The solution of the system is the region ${region}.`);
  const withForms = bothForms ? facts : undefined;
  if (facts.outside) lines.push(pointLine(facts.outside, withForms));
  if (facts.inside) lines.push(pointLine(facts.inside, withForms));
  if (bothForms && (facts.outside || facts.inside)
      && facts.inequalities.some((f) => f.line && f.solved && f.solved.replace(/\s+/g, '') !== f.source.replace(/\s+/g, ''))) {
    lines.push(EITHER_FORM_LINE);
  }
  return lines;
}

/**
 * The per-turn block for the brain. Uncached content (it sits in the user
 * message); '' when there are no facts.
 */
export function formatInequalityFactsBlock(facts: InequalityFacts | null): string {
  if (!facts) return '';
  const lines = inequalityFactLines(facts);
  if (lines.length === 0) return '';
  return '<problem_facts>\n'
    + `${INEQUALITY_FACTS_LEAD}\n`
    + lines.map((l) => `- ${l}`).join('\n')
    + '\nThese were computed from the problem\'s own inequalities, not read from the conversation. Whenever you say which side of a line is shaded, where the solution lies, whether a point is a solution, or name a line by its position or colour, it must agree with them. If something said earlier in this session disagrees with them — by you or by the student — the earlier statement was wrong: say so plainly in one short sentence and continue from these facts. A student whose reading agrees with these facts is right.\n'
    + '</problem_facts>\n\n';
}

/** The same facts for the verdict pre-check and the judge (plain text). */
export function formatInequalityFactsText(facts: InequalityFacts | null): string {
  if (!facts) return '';
  const lines = inequalityFactLines(facts);
  return lines.length ? `${INEQUALITY_FACTS_LEAD}\n${lines.map((l) => `- ${l}`).join('\n')}` : '';
}

/**
 * Facts for the active problem. `statement` is the problem as posed;
 * `graph` the data of the newest graph on the board that draws it (optional).
 * Null when the statement is not a readable two-variable inequality problem.
 */
export function problemInequalityFacts(statement: string | null | undefined, graph?: unknown): InequalityFacts | null {
  try {
    const parsed = extractProblemInequalities(statement);
    if (!parsed.ok) return null;
    return buildInequalityFacts(parsed.relations, graph);
  } catch {
    return null;
  }
}

/** The data of the newest graph on the board that draws one of these
 *  boundaries (so the colours named are the ones in view), or undefined. */
export function newestGraphFor(commands: ReadonlyArray<unknown>, relations: ReadonlyArray<XYRelation>): unknown {
  for (let i = commands.length - 1; i >= 0; i--) {
    const c = commands[i] as Loose | null;
    if (!c || c.action !== 'showGraph' || !c.data || typeof c.data !== 'object') continue;
    const data = ((c.data as Loose).data && typeof (c.data as Loose).data === 'object' ? (c.data as Loose).data : c.data) as Loose;
    const facts = buildInequalityFacts(relations, data);
    if (facts?.hasGraph) return data;
  }
  return undefined;
}

/** Statement + board in one call (the browser's form). */
export function boardInequalityFacts(statement: string | null | undefined, commands: ReadonlyArray<unknown>): { facts: InequalityFacts; graph: unknown } | null {
  try {
    const parsed = extractProblemInequalities(statement);
    if (!parsed.ok) return null;
    const graph = newestGraphFor(commands ?? [], parsed.relations);
    const facts = buildInequalityFacts(parsed.relations, graph);
    return facts ? { facts, graph } : null;
  } catch {
    return null;
  }
}

// ── the graph's own description (board snapshot) ────────────────────────────

/**
 * What a graph's shading MEANS, for its board description: for each
 * inequality it draws, the side shaded and the line as drawn; the crossing;
 * one point outside and one inside the darkest region. From the graph's own
 * entries — no problem needed.
 */
export function graphRegionFactParts(data: unknown): string[] {
  try {
    if (!data || typeof data !== 'object') return [];
    const rels: XYRelation[] = [];
    for (const entry of asArray((data as Loose).inequalities)) {
      const p = parseXYRelation(inequalityEntryText(entry));
      if (p.ok && p.relation.ops.length === 1) rels.push(p.relation);
    }
    const facts = buildInequalityFacts(rels, data);
    if (!facts) return [];
    const parts: string[] = [];
    const sides = facts.inequalities
      .filter((f) => f.side)
      .map((f) => {
        const colour = f.drawn?.color ? `${f.drawn.color} ` : '';
        const style = f.strict ? 'dashed' : 'solid';
        const label = f.drawn?.label ? `, legend "${f.drawn.label}"` : '';
        return `${f.source} is shaded ${sideWord(f.side!)} the ${colour}${style} ${lineNoun(f)}${f.boundary && f.boundary.replace(/\s+/g, '') !== f.source.replace(/[<>≤≥]/, '=').replace(/\s+/g, '') ? ` ${f.boundary}` : ''}${label}`;
      });
    if (sides.length) parts.push(`which side: ${sides.join('; ')}`);
    const region = regionClause(facts);
    if (region) parts.push(`darkest region (the solution): ${region}`);
    if (facts.crossings.length) parts.push(`lines cross at ${facts.crossings.slice(0, 3).map((c) => pointText(c.x, c.y)).join(', ')} (${facts.crossings[0].inSolution ? 'a solution' : 'not a solution'})`);
    const pt = (p: PointFact) => `${pointText(p.x, p.y)} ${p.inSolution ? 'is in it' : 'is NOT in it'} (${p.truths.map((t) => `${t.source}: ${t.holds ? 'true' : 'false'}`).join(', ')})`;
    const pts = [facts.outside, facts.inside].filter((p): p is PointFact => !!p).map(pt);
    if (pts.length) parts.push(`check points: ${pts.join('; ')}`);
    return parts;
  } catch {
    return [];
  }
}

// ── a tutor sentence held to the facts ──────────────────────────────────────

export interface SpokenRegionHit {
  /** The phrase as written ("above that red line"). */
  phrase: string;
  stated: RegionSide;
  /** The inequality the phrase names; 'all' for "both lines". */
  about: InequalityFact | 'all';
  /** The fact it contradicts, as one line. */
  fact: string;
}

const SIDE_WORDS: Record<string, RegionSide> = {
  above: 'above', below: 'below', beneath: 'below', underneath: 'below', under: 'below',
};
const COLOR_WORD = '(?:blue|red|green|purple|violet|orange|teal|cyan|turquoise|black|grey|gray|pink|yellow|brown)';
const ORDINAL_WORD = '(?:first|second|third|fourth|1st|2nd|3rd|4th)';
const SIDE_PHRASE_RE = new RegExp(
  '\\b(above|below|beneath|underneath|under|(?:to\\s+the\\s+)?left\\s+of|(?:to\\s+the\\s+)?right\\s+of)\\s+'
  + '(the|that|this|those|these|both(?:\\s+of)?(?:\\s+(?:the|those|these))?|each(?:\\s+of\\s+the)?|all(?:\\s+of)?(?:\\s+(?:the|those|these))?(?:\\s+(?:two|three|four|2|3|4))?)\\s+'
  + `((?:(?:${ORDINAL_WORD}|${COLOR_WORD}|dashed|dotted|solid|boundary|two|2)\\s+){0,4}?)`
  + `(${ORDINAL_WORD}|${COLOR_WORD}|lines?|boundar(?:y|ies)|ones?)(?![\\w-])`
  + '(?:\\s+(lines?|boundar(?:y|ies)|ones?)(?![\\w-]))?',
  'gi',
);
/** What the side is being said OF: the solution / the shading. */
const REGION_SUBJECT_RE = /\b(?:solution(?:\s+(?:region|set|area))?|region|shad(?:e|ed|ing|es)|wedge|overlap(?:ping|s|ped)?|half[-\s]?plane|darke(?:r|st)\s+(?:part|patch|area|region|wedge))\b/gi;
/** …or a point (a statement about a point is not a statement of the region). */
const POINT_SUBJECT_RE = /\(\s*[-−]?\d+(?:\.\d+)?\s*,\s*[-−]?\d+(?:\.\d+)?\s*\)|\borigin\b|\b(?:test\s+)?points?\b|\bintercepts?\b|\bvertex\b/gi;
const NOT_A_CLAIM_BEFORE_RE = /\b(?:not|never|no\s+longer|rather\s+than|instead\s+of|neither|nor|if|suppose|supposing|whether|would|were|imagine|unless|or)\s+(?:\w+\s+){0,3}$|n['’]t\s+(?:\w+\s+){0,3}$/i;
const QUOTES_STUDENT_RE = /\byou(?:['’]ve)?\s+(?:said|say|think|thought|wrote|mentioned|described|guessed|answered|put|were\s+saying|had)\b|\byour\s+(?:answer|guess|reading|idea)\b/i;
const NEXT_NOUN_RE = /^\s*(?:test\s+)?(?:point|inequalit|equation|graph|ax[ie]s|value|term|step|problem|card|row|number|question|part)\b/i;

function lastIndexOfRe(re: RegExp, text: string): number {
  re.lastIndex = 0;
  let at = -1;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) { at = m.index; if (m[0].length === 0) re.lastIndex++; }
  return at;
}

const ORDINAL_INDEX: Record<string, number> = { first: 1, '1st': 1, second: 2, '2nd': 2, third: 3, '3rd': 3, fourth: 4, '4th': 4 };

/**
 * Does this ONE tutor sentence state a side for a NAMED line — "above / below
 * the <colour | first | second> line", "below both lines" — as where the
 * solution or the shading is, and does that contradict the facts?
 *
 * Deliberately narrow. Null for: a question; a sentence that offers both
 * sides ("above or below"); a line that is not named by colour or position; a
 * colour that is not on the graph or names two lines; a negated, conditional
 * or quoted claim; and a statement about a POINT ("(0, 0) sits above the
 * second line" can be true while the region is below it).
 */
export function spokenRegionContradiction(sentence: string, facts: InequalityFacts | null | undefined): SpokenRegionHit | null {
  try {
    if (!facts || facts.inequalities.length === 0) return null;
    // Math spans: a coordinate pair stays (it is a possible subject); any
    // other span is neutral filler. Markdown emphasis is dropped.
    const text = (sentence ?? '')
      .replace(/\$\$?([^$]*)\$\$?/g, (_m, body: string) => (/^\s*\(\s*[-−]?\d+(?:\.\d+)?\s*,\s*[-−]?\d+(?:\.\d+)?\s*\)\s*$/.test(body) ? ` ${body.trim()} ` : ' … '))
      .replace(/[*_~`]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (!text || /\?\s*$/.test(text)) return null;
    if (/\b(?:above|below|over|under)\s+or\s+(?:above|below|over|under)\b/i.test(text)) return null;
    if (QUOTES_STUDENT_RE.test(text)) return null;
    SIDE_PHRASE_RE.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = SIDE_PHRASE_RE.exec(text)) !== null) {
      const before = text.slice(0, m.index);
      const after = text.slice(m.index + m[0].length);
      const sideRaw = m[1].toLowerCase().replace(/\s+/g, ' ');
      const stated: RegionSide = /left/.test(sideRaw) ? 'left' : /right/.test(sideRaw) ? 'right' : SIDE_WORDS[sideRaw];
      const det = m[2].toLowerCase();
      const words = `${m[3] ?? ''} ${m[4] ?? ''} ${m[5] ?? ''}`.toLowerCase().split(/\s+/).filter(Boolean);
      const hasNoun = words.some((w) => /^(?:lines?|boundar(?:y|ies)|ones?)$/.test(w));
      // "above the second" with the noun left out is a line only when no
      // other noun follows ("the second inequality", "the first point").
      if (!hasNoun && NEXT_NOUN_RE.test(after)) continue;
      if (NOT_A_CLAIM_BEFORE_RE.test(before)) continue;
      // The subject: the nearest region word before the phrase, with no point
      // named after it.
      const regionAt = lastIndexOfRe(REGION_SUBJECT_RE, before);
      if (regionAt < 0) continue;
      if (lastIndexOfRe(POINT_SUBJECT_RE, before) > regionAt) continue;

      const all = /^(?:both|each|all)\b/.test(det);
      if (all) {
        const sided = facts.inequalities.filter((f) => f.side);
        if (sided.length !== facts.inequalities.length || sided.length < 2) continue;
        const vertical = stated === 'above' || stated === 'below';
        if (sided.some((f) => (f.side === 'above' || f.side === 'below') !== vertical)) continue;
        const wrong = sided.find((f) => f.side !== stated);
        if (!wrong) continue;
        return { phrase: m[0].trim(), stated, about: 'all', fact: `The solution of the system is the region ${regionClause(facts) || `${sideWord(wrong.side!)} the ${ORDINALS[wrong.n - 1]} ${lineNoun(wrong)}`}.` };
      }
      const ordinal = words.map((w) => ORDINAL_INDEX[w]).find((n) => n !== undefined);
      const colours = words.map((w) => NAMED_COLORS[w]).filter((c): c is string => !!c);
      let fact: InequalityFact | undefined;
      if (ordinal !== undefined) {
        if (facts.inequalities.length < 2) continue;
        fact = facts.inequalities[ordinal - 1];
      }
      if (colours.length > 0) {
        const named = facts.inequalities.filter((f) => f.drawn && (f.drawn.color === colours[0] || f.drawn.lineColor === colours[0]));
        if (named.length !== 1) continue; // not on the graph, or two lines share the colour
        if (fact && fact !== named[0]) continue; // "the first red line": position and colour disagree — not ours to judge
        fact = named[0];
      }
      if (!fact || !fact.side) continue;
      const vertical = stated === 'above' || stated === 'below';
      if ((fact.side === 'above' || fact.side === 'below') !== vertical) continue;
      if (fact.side === stated) continue;
      const drawn = fact.drawn?.color ? `, drawn ${fact.drawn.color}` : '';
      return {
        phrase: m[0].trim(),
        stated,
        about: fact,
        fact: `${fact.source}${fact.solved ? ` is the same as ${fact.solved}` : ''}: its solutions are ${sideWord(fact.side)} the ${lineNoun(fact)}${fact.boundary ? ` ${fact.boundary}` : ''} (the ${ORDINALS[fact.n - 1]} ${lineNoun(fact)}${drawn}).`,
      };
    }
    return null;
  } catch {
    return null;
  }
}

/** Rejection action for "a sentence stated the wrong side — write the reply
 *  again" (a kill: validator-feedback renders it like every other verdict kill). */
export const SPOKEN_REGION_ACTION = 'spoken_region_contradiction';

/** What the brain is told when a sentence was withheld for its region. */
export function spokenRegionFeedback(hit: SpokenRegionHit, facts: InequalityFacts, withheldSentence: string): string {
  const quote = (withheldSentence ?? '').replace(/\s+/g, ' ').replace(/"/g, '”').trim().slice(0, 200);
  const region = regionClause(facts);
  return `Your reply was not shown: its sentence "${quote}" puts the solution "${hit.phrase}", and that contradicts the facts computed from the problem's own inequalities. ${hit.fact}`
    + (region ? ` The solution of the system is the region ${region}.` : '')
    + ' Write the reply again from the start, in agreement with those facts (they are in <problem_facts>).'
    + ' If an earlier message of yours in this session stated the region the wrong way round, say so plainly in one short sentence and give the right one.'
    + ' Do not mention this note. Don\'t apologize for the unseen draft; the student doesn\'t see this message.';
}
