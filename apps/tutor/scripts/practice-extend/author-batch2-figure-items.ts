/**
 * Hand-authored practice items that are read off a FIGURE of one of the eight
 * batch-2 kinds (circuit_diagram, phylogenetic_tree, geometric_figure,
 * ray_diagram, field_diagram, flow_diagram, solid_3d, spectrum).
 *
 * Same pattern, rules and output layout as author-batch1-figure-items.ts.
 * Every item is data in this file. For every item the script
 *   - draws the figure (`buildPracticeFigure`) and runs the SVG safety check,
 *     the legibility report (no warning allowed) and the job's rule checks;
 *   - PROVES the key from the figure spec: by a figure-core-batch2 checker
 *     whose result is the key (`ck`), by code that combines checker results
 *     (`calc` / `holds` using `c.run`), or by code on the kind's own model;
 *     an item whose key does not follow from its spec stops the run;
 *   - shuffles and letters the options with a seeded shuffle (the correct
 *     option is written FIRST in this file).
 * It then writes ProblemBank-shaped rows (insert-only import — NOT imported
 * here), the audited ids, the mapping of the 105 objectives (batch 1's
 * mapping, with the objectives batch 2 makes authorable), a gallery page,
 * PNGs at the 340 px column (2×), contact sheets and a summary.
 *
 * Each item also says what it asks of the student beyond finding a value on
 * the figure (`need`): 'read' (a plain read-off), 'reason' (a read plus a
 * step of reasoning) or 'calc' (a read plus a calculation).
 *
 * No database, no network, no model. Run:
 *   env -u MONGODB_URI -u ANTHROPIC_API_KEY -u ANTHROPIC_AUTH_TOKEN -u ANTHROPIC_BASE_URL \
 *     npx tsx scripts/practice-extend/author-batch2-figure-items.ts [--out <dir>] [--check] [--list-objectives]
 */
import '../lib/no-db-env';
import fs from 'node:fs';
import path from 'node:path';
import { checkFigureLegibility } from '../../src/lib/tutor/practice-figure/legibility';
import { buildPracticeFigure, type PracticeFigureSpec } from '../../src/lib/tutor/practice-figure/render';
import { Reader } from '../../src/lib/tutor/practice-figure/spec';
import { MAX_FIGURE_SVG_CHARS, validateFigureSvg } from '../../src/lib/tutor/practice-figure/svg-safety';
import { circuitModel, type CircuitNode } from '../../src/lib/tutor/practice-figure/kinds/circuit';
import { phyloModel, type PhyloModel, type PhyloNode } from '../../src/lib/tutor/practice-figure/kinds/phylo-tree';
import { geometryModel, type PolyModel } from '../../src/lib/tutor/practice-figure/kinds/geometry';
import { rayModel, type InterfaceModel, type OpticsModel } from '../../src/lib/tutor/practice-figure/kinds/ray-diagram';
import { fieldAt, fieldModel, magneticForceDirection, wireFieldDirection, type Dir6 } from '../../src/lib/tutor/practice-figure/kinds/field-diagram';
import { flowModel } from '../../src/lib/tutor/practice-figure/kinds/flow-diagram';
import { solidModel } from '../../src/lib/tutor/practice-figure/kinds/solid-3d';
import { spectrumModel } from '../../src/lib/tutor/practice-figure/kinds/spectrum';
import { parseNumericKey } from '../../src/lib/tutor/portal/numeric-answer-rule';
import { contentDefects, itemIdOf, simpleHash } from './core';
import { canonText, derivedText, describeFigure, examineFigureItem, runChecker, type Derived, type FigureItem } from './figure-core';

const INTEGRATION = '/Users/luke/Dev/evelynlearning/docs/whitelabel/greenapple/integration';
const DEFAULT_OUT = `${INTEGRATION}/practice-figures-2026-10-11-batch2`;
const BATCH1 = `${INTEGRATION}/practice-figures-2026-10-11-batch1`;
const OBJECTIVES_105 = `${INTEGRATION}/practice-extension-2026-10-09/coverage-run/figure-objectives.json`;
const ROWS_60 = `${INTEGRATION}/practice-figures-2026-10-10-slope/final/figure-rows-60.json`;
const PACKS = `${INTEGRATION}/practice-depth-2026-10-10/packs`;
const PNG_WIDTH = 680; // the 340 px column at 2×
const BATCH2_KINDS = ['circuit_diagram', 'phylogenetic_tree', 'geometric_figure', 'ray_diagram', 'field_diagram', 'flow_diagram', 'solid_3d', 'spectrum'];

type P = Record<string, unknown>;
type Spec = PracticeFigureSpec;

// ── proof context ───────────────────────────────────────────────────────────

class Ctx {
  used: Array<{ checker: string; args: P; result: string }> = [];
  constructor(public spec: Spec) {}
  get p(): P { return this.spec.params; }
  /** A checker on this item's spec, or (with `on`) on a variant of it — the variant is recorded with the result. */
  run(checker: string, args: P = {}, on?: { spec: Spec; what: string }): Derived {
    const d = runChecker(on?.spec ?? this.spec, { checker, args });
    this.used.push({ checker, args: on ? { ...args, _onVariant: on.what } : args, result: derivedText(d) });
    return d;
  }
  num(checker: string, args: P = {}, on?: { spec: Spec; what: string }): number {
    const d = this.run(checker, args, on);
    if (d.kind !== 'number') throw new Error(`${checker} gave no number`);
    return d.value;
  }
  txt(checker: string, args: P = {}, on?: { spec: Spec; what: string }): string {
    const d = this.run(checker, args, on);
    if (d.kind === 'number') return String(d.value);
    if (d.kind === 'numbers') return d.values.join(',');
    return d.value;
  }
  model<T>(build: (r: Reader) => T): T { return build(new Reader(this.spec.type, this.spec.params)); }
}

interface A {
  /** Task kind — unique within an objective. */
  t: string;
  d: 1 | 2 | 3;
  /** What the item asks beyond locating a value on the figure. */
  need: 'read' | 'reason' | 'calc';
  spec: Spec;
  alt: string;
  q: string;
  /** mcq: [text, the mistake behind it]; the CORRECT option first (its second entry is 'correct'). */
  o?: Array<[string, string]>;
  /** numeric: the stated key. */
  n?: string;
  /** The key is the result of this figure-core checker on the spec. */
  ck?: [string, P];
  /** The key is this value, computed in code from the spec (description, function). */
  calc?: [string, (c: Ctx) => string | number];
  /** mcq: the truth of each option as written (correct first), computed from the spec. */
  holds?: [string, Array<(c: Ctx) => boolean>];
  h: [string, string];
  s: string;
}
interface Item extends A { lo: string; sub: string; list: boolean }

const ITEMS: Item[] = [];
/** `lo` is "<first block of the plan id>.lo-N"; resolved against the lesson packs. */
function G(lo: string, sub: string, items: A[]): void {
  for (const a of items) ITEMS.push({ ...a, lo, sub, list: false });
}

const S = (type: string, params: P): Spec => ({ type, params });
const near = (a: number, b: number, tol = 1e-9): boolean => Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= tol * Math.max(1, Math.abs(a), Math.abs(b));
const round = (v: number, dp: number): number => Number(v.toFixed(dp));
const deg = (v: number): number => (v * Math.PI) / 180;
/** Simpson's rule; n is even. */
function integrate(f: (x: number) => number, a: number, b: number, n = 2000): number {
  const h = (b - a) / n;
  let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
  return (s * h) / 3;
}

// ── helpers for particular kinds ────────────────────────────────────────────

/** Circuits. */
const circ = (emf: number, circuit: P, battery: P = {}, extra: P = {}): Spec => S('circuit_diagram', { battery: { emf, ...battery }, circuit, ...extra });
const ser = (...n: P[]): P => ({ series: n });
const par = (...n: P[]): P => ({ parallel: n });
const R = (name: string, value: number, extra: P = {}): P => ({ type: 'resistor', name, value, ...extra });
/** A bulb: its resistance is in the spec for the solver and is never printed. */
const bulb = (name: string, value = 6, extra: P = {}): P => ({ type: 'bulb', name, value, show: 'name', ...extra });
const sw = (name: string, closed = true): P => ({ type: 'switch', name, closed });
const AMM: P = { type: 'ammeter', name: 'A', show: 'none' };
const VOLT: P = { type: 'voltmeter', name: 'V', show: 'none' };
const cq = (c: Ctx, component: string, quantity: 'current' | 'voltage' | 'power', switches?: Record<string, boolean>, on?: { spec: Spec; what: string }): number =>
  c.num('circuit_component', { component, quantity, ...(switches ? { switches } : {}) }, on);
/** The same circuit with one named component replaced by a gap (an open switch). */
function withGap(spec: Spec, name: string): { spec: Spec; what: string } {
  const swap = (n: P): P => {
    if (Array.isArray(n.series)) return { series: (n.series as P[]).map(swap) };
    if (Array.isArray(n.parallel)) return { parallel: (n.parallel as P[]).map(swap) };
    return n.name === name ? { type: 'switch', name: 'gap', closed: false } : n;
  };
  return { spec: S(spec.type, { ...spec.params, circuit: swap(spec.params.circuit as P) }), what: `"${name}" replaced by a gap` };
}
/** The parallel / series group (of the kind's own tree) that directly holds every one of the named components. */
function sameGroup(c: Ctx, kind: 'series' | 'parallel', names: string[]): boolean {
  const m = c.model(circuitModel);
  const has = (n: CircuitNode, name: string): boolean => (n.kind === 'leaf' ? n.name === name : n.children.some((k) => has(k, name)));
  const direct = (n: CircuitNode, name: string): boolean => n.kind === 'leaf' && n.name === name;
  const visit = (n: CircuitNode): boolean => {
    if (n.kind === 'leaf') return false;
    if (n.kind === kind) {
      const holders = names.map((nm) => n.children.findIndex((k) => (kind === 'series' ? direct(k, nm) : has(k, nm))));
      // series: each is a direct member; parallel: each sits alone in a different branch.
      if (holders.every((i) => i >= 0) && new Set(holders).size === names.length && (kind === 'series' || names.every((nm, k) => direct(n.children[holders[k]], nm)))) return true;
    }
    return n.children.some(visit);
  };
  return visit(m.root);
}
/** How many different routes the current can take from + to − (series: product, parallel: sum). */
function routes(c: Ctx): number {
  const count = (n: CircuitNode): number => (n.kind === 'leaf' ? 1 : n.kind === 'series' ? n.children.reduce((t, k) => t * count(k), 1) : n.children.reduce((t, k) => t + count(k), 0));
  return count(c.model(circuitModel).root);
}

/** Fields. */
const charges = (cs: Array<[number, number, number, P?]>, extra: P = {}): Spec => S('field_diagram', { variant: 'point_charges', charges: cs.map(([x, y, q, e]) => ({ x, y, q, ...(e ?? {}) })), ...extra });
const fdir = (c: Ctx, point: string): string => c.txt('field_direction_at', { point });
const OPPOSITE: Record<string, string> = { up: 'down', down: 'up', left: 'right', right: 'left', 'into the page': 'out of the page', 'out of the page': 'into the page' };
const DIRW: Record<Dir6, string> = { up: 'up', down: 'down', left: 'left', right: 'right', into: 'into the page', out: 'out of the page' };
/** Net field of the figure's charges at a marked point: [size, Ex, Ey] in the kind's units. */
function netField(c: Ctx, label: string): [number, number, number] {
  const m = c.model(fieldModel);
  if (m.variant !== 'point_charges') throw new Error('not a point-charge figure');
  const q = m.points.find((x) => x.label === label);
  if (!q) throw new Error(`no point ${label}`);
  const [ex, ey] = fieldAt(m.charges, q.x, q.y);
  return [Math.hypot(ex, ey), ex, ey];
}

/** Phylogenetic trees. */
const tree = (t: unknown, extra: P = {}): Spec => S('phylogenetic_tree', { tree: t, ...extra });
const phM = (c: Ctx): PhyloModel => c.model(phyloModel);
function mrcaOf(m: PhyloModel, names: string[]): PhyloNode {
  let n = m.tips.find((x) => x.name === names[0]) as PhyloNode;
  if (!n) throw new Error(`no tip ${names[0]}`);
  for (const nm of names) if (!m.tips.some((x) => x.name === nm)) throw new Error(`no tip ${nm}`);
  while (!names.every((nm) => n.tips.includes(nm))) n = n.parent as PhyloNode;
  return n;
}
const depth = (n: PhyloNode): number => (n.parent ? depth(n.parent) + 1 : 0);
/** How recent the common ancestor of the named tips is: branch points from the root (the root = 0). */
const recency = (c: Ctx, names: string[]): number => depth(mrcaOf(phM(c), names));
const sameSet = (a: string[], b: string[]): boolean => a.length === b.length && [...a].sort().join('|') === [...b].sort().join('|');

/** Geometry. */
const tri = (params: P): Spec => S('geometric_figure', { shape: 'triangle', ...params });
const circle = (params: P): Spec => S('geometric_figure', { shape: 'circle', ...params });
const polyM = (c: Ctx): PolyModel => { const m = c.model(geometryModel); if (!m.poly) throw new Error('not a triangle'); return m.poly; };
/** Triangle of the kind's model: side lengths a, b, c (opposite the first, second, third vertex) and the angles. */
function triM(c: Ctx): { a: number; b: number; c: number; A: number; B: number; C: number; names: string[]; right: number } {
  const pm = polyM(c);
  const [A, B, C] = pm.angles;
  const [cc, a, b] = pm.sides; // model side i runs from vertex i to i + 1: AB, BC, CA
  return { a, b, c: cc, A, B, C, names: pm.names ?? ['A', 'B', 'C'], right: pm.angles.findIndex((x) => Math.abs(x - 90) < 1e-6) };
}

/** Ray diagrams. */
const ray = (params: P): Spec => S('ray_diagram', params);
const optM = (c: Ctx): OpticsModel => { const m = c.model(rayModel); if (m.element === 'interface') throw new Error('not a lens / mirror'); return m; };
const ifM = (c: Ctx): InterfaceModel => { const m = c.model(rayModel); if (m.element !== 'interface') throw new Error('not an interface'); return m; };
const nature = (c: Ctx): string => `${c.txt('ray_image_nature', { want: 'type' })}, ${c.txt('ray_image_nature', { want: 'orientation' })}, ${c.txt('ray_image_nature', { want: 'size' })}`;

/** Flow diagrams. */
const flow = (variant: string, params: P): Spec => S('flow_diagram', { variant, ...params });
const N = (id: string, label: string, extra: P = {}): P => ({ id, label, ...extra });

/** Solids. */
const solid = (params: P): Spec => S('solid_3d', params);

/** Spectra. */
const pes = (peaks: Array<[number, number, string?]>, extra: P = {}): Spec => S('spectrum', { variant: 'pes', peaks: peaks.map(([energy, electrons, label]) => ({ energy, electrons, ...(label ? { label } : {}) })), ...extra });
const mass = (peaks: Array<[number, number]>, extra: P = {}): Spec => S('spectrum', { variant: 'mass', peaks: peaks.map(([mz, abundance]) => ({ mz, abundance })), ...extra });
const specM = (c: Ctx) => c.model(spectrumModel);
const pesPeaks = (c: Ctx) => { const m = specM(c); if (m.variant !== 'pes') throw new Error('not a PES figure'); return m.peaks; };
const subshell = (c: Ctx, peak: number): string => c.txt('spectrum_peak_subshell', { peak });
/** Photoelectron binding energies (MJ/mol), 1s first — the values AP Chemistry texts tabulate. */
const BE: Record<string, Array<[number, number]>> = {
  C: [[28.6, 2], [1.72, 2], [1.09, 2]], N: [[39.6, 2], [2.45, 2], [1.4, 3]], O: [[52.6, 2], [3.12, 2], [1.31, 4]], F: [[67.2, 2], [3.88, 2], [1.68, 5]], Ne: [[84.0, 2], [4.68, 2], [2.08, 6]],
  Na: [[104, 2], [6.84, 2], [3.67, 6], [0.5, 1]], Mg: [[126, 2], [9.07, 2], [5.31, 6], [0.74, 2]],
  Al: [[151, 2], [12.1, 2], [7.79, 6], [1.09, 2], [0.58, 1]], Si: [[178, 2], [15.1, 2], [10.3, 6], [1.46, 2], [0.79, 2]],
  P: [[208, 2], [18.7, 2], [13.5, 6], [1.95, 2], [1.01, 3]], S: [[239, 2], [22.7, 2], [16.5, 6], [2.05, 2], [1.0, 4]],
  Cl: [[273, 2], [26.8, 2], [20.2, 6], [2.44, 2], [1.25, 5]], K: [[347, 2], [37.1, 2], [29.1, 6], [3.93, 2], [2.38, 6], [0.42, 1]],
};
const pesOf = (el: string, extra: P = {}, labels?: string[]): Spec => pes(BE[el].map(([e, n], i) => [e, n, labels?.[i]] as [number, number, string?]), extra);

// ═══════════════════════════════════════════════════════════════════════════
// THE ITEMS
// ═══════════════════════════════════════════════════════════════════════════

// ══ ITEMS-BEGIN

// ── Physics · Series Circuits Fundamentals ──────────────────────────────────
const nm = { show: 'name' };
G('1503a287.lo-1', 'Reading a series circuit', [
  {
    t: 'battery EMF from one ammeter reading in a single loop', d: 2, need: 'calc',
    spec: circ(12, ser(R('R₁', 6), AMM, R('R₂', 10), R('R₃', 8)), { show: 'blank' }),
    alt: 'A circuit diagram with a single loop: a battery whose voltage is replaced by a question mark, a 6 ohm resistor R₁, an ammeter, a 10 ohm resistor R₂ and an 8 ohm resistor R₃, one after another.',
    q: 'The ammeter in the circuit shown reads 0.50 A. What is the EMF of the battery, in volts?',
    n: '12',
    calc: ['0.50 A × the equivalent resistance (checker circuit_equivalent_resistance); the battery current of the spec is checked against the stated reading', (c) => {
      if (!near(cq(c, 'battery', 'current'), 0.5)) throw new Error('the stated ammeter reading is not the current of the spec');
      return 0.5 * c.num('circuit_equivalent_resistance');
    }],
    h: ['Every component in a single loop carries the same current.', 'Find the total resistance of the loop, then apply V = IR to the whole loop.'],
    s: 'The three resistors and the ammeter lie in one loop, so the 0.50 A the ammeter reads flows through every resistor. The resistances read from the diagram add to 6 + 10 + 8 = 24 Ω, so the EMF is 0.50 × 24 = 12 V.',
  },
  {
    t: 'effect of one failed bulb in a single loop', d: 2, need: 'reason',
    spec: circ(9, ser(bulb('L₁'), bulb('L₂'), sw('S'), bulb('L₃'))),
    alt: 'A circuit diagram with a single loop: a 9 volt battery, bulb L₁, bulb L₂, a closed switch S and bulb L₃, one after another along the same wire.',
    q: 'In the circuit shown, the filament of bulb L₂ breaks, so that no current can pass through that bulb. Which of the other bulbs stay lit?',
    o: [['Neither L₁ nor L₃', 'correct'], ['L₁ only', 'thinks the current still reaches the bulb that comes before the break'], ['L₃ only', 'thinks the bulb nearest the other terminal is still fed from that side'], ['Both L₁ and L₃', 'treats the bulbs as if each had its own path to the battery']],
    holds: ['checker circuit_component (power) for L₁ and L₃ on the same circuit with L₂ replaced by a gap', ([[false, false], [true, false], [false, true], [true, true]] as Array<[boolean, boolean]>).map(([a, b]) => (c: Ctx) => {
      const gap = withGap(c.spec, 'L₂');
      return (cq(c, 'L₁', 'power', undefined, gap) > 0) === a && (cq(c, 'L₃', 'power', undefined, gap) > 0) === b;
    })],
    h: ['Trace the path of the current from one terminal of the battery to the other.', 'Ask whether any bulb has a route to both terminals that avoids the broken bulb.'],
    s: 'The diagram shows one loop only: the current must pass through L₁, L₂, the switch and L₃ in turn. A broken filament in L₂ opens that single loop, so no current flows anywhere and neither L₁ nor L₃ is lit.',
  },
  {
    t: 'count the resistors that carry the full battery current', d: 2, need: 'reason',
    spec: circ(12, ser(R('R₁', 4, nm), par(R('R₂', 12, nm), ser(R('R₃', 2, nm), R('R₄', 4, nm))), R('R₅', 6, nm))),
    alt: 'A circuit diagram: a 12 volt battery, then resistor R₁, then a junction with two branches — R₂ on one branch, R₃ followed by R₄ on the other — and, after the branches rejoin, resistor R₅. No resistance values are printed.',
    q: 'How many of the five resistors in the circuit shown must carry the full current that leaves the battery, whatever their resistances?',
    n: '2',
    calc: ['the number of resistors whose current (checker circuit_component) equals the battery current', (c) => ['R₁', 'R₂', 'R₃', 'R₄', 'R₅'].filter((r) => near(cq(c, r, 'current'), cq(c, 'battery', 'current'))).length],
    h: ['A resistor is in series with the battery when there is no junction between it and the battery where the current could divide.', 'Mark the two junctions in the diagram and see which resistors lie outside them.'],
    s: 'Between the two junctions the current divides: part goes through R₂ and the rest through R₃ and R₄. Only R₁, before the first junction, and R₅, after the second, lie on the undivided wire, so 2 resistors carry the full battery current.',
  },
]);

G('1503a287.lo-2', 'Equivalent resistance in series', [
  {
    t: 'equivalent resistance of a loop that also holds a meter and a switch', d: 1, need: 'calc',
    spec: circ(9, ser(R('R₁', 15), AMM, R('R₂', 22), sw('S'), R('R₃', 33))),
    alt: 'A circuit diagram with a single loop: a 9 volt battery, a 15 ohm resistor R₁, an ammeter, a 22 ohm resistor R₂, a closed switch S and a 33 ohm resistor R₃.',
    q: 'What is the equivalent resistance of the circuit shown while switch S is closed, in ohms? Treat the ammeter and the switch as ideal.',
    n: '70',
    ck: ['circuit_equivalent_resistance', {}],
    h: ['Resistances that follow one another in a single loop add.', 'An ideal ammeter and a closed switch add no resistance.'],
    s: 'The diagram shows one loop with resistors of 15 Ω, 22 Ω and 33 Ω; the ideal ammeter and the closed switch contribute nothing. The equivalent resistance is 15 + 22 + 33 = 70 Ω.',
  },
  {
    t: 'series resistance to add for a target current', d: 2, need: 'calc',
    spec: circ(12, ser(R('R₁', 10), R('R₂', 20), R('R₃', 12))),
    alt: 'A circuit diagram with a single loop: a 12 volt battery and three resistors in a row, R₁ of 10 ohms, R₂ of 20 ohms and R₃ of 12 ohms.',
    q: 'A fourth resistor is to be connected in series with the three in the circuit shown so that the battery current becomes 0.20 A. What resistance must the added resistor have, in ohms?',
    n: '18',
    calc: ['battery EMF of the spec ÷ 0.20 A, less the equivalent resistance (checker circuit_equivalent_resistance)', (c) => (c.model(circuitModel).battery.emf / 0.2) - c.num('circuit_equivalent_resistance')],
    h: ['Work out the total resistance the loop needs for the target current.', 'Compare that total with the sum of the resistances already in the loop.'],
    s: 'For 0.20 A from the 12 V battery the loop needs 12 ÷ 0.20 = 60 Ω in total. The diagram shows 10 + 20 + 12 = 42 Ω already in series, so the added resistor must be 60 − 42 = 18 Ω.',
  },
]);

G('1503a287.lo-3', 'Current in a series circuit', [
  {
    t: 'battery current of a three-resistor loop', d: 1, need: 'calc',
    spec: circ(9, ser(R('R₁', 12), R('R₂', 18), R('R₃', 15))),
    alt: 'A circuit diagram with a single loop: a 9 volt battery and three resistors in a row, R₁ of 12 ohms, R₂ of 18 ohms and R₃ of 15 ohms.',
    q: 'What current does the battery supply in the circuit shown, in amperes?',
    n: '0.2',
    ck: ['circuit_component', { component: 'battery', quantity: 'current' }],
    h: ['Add the resistances that lie in the single loop.', 'Divide the battery voltage by the total resistance.'],
    s: 'The diagram shows 12 Ω, 18 Ω and 15 Ω in one loop, 45 Ω in all, across a 9 V battery. The current is 9 ÷ 45 = 0.2 A.',
  },
  {
    t: 'ammeter reading after a switch bypasses a resistor', d: 3, need: 'reason',
    spec: circ(12, ser(R('R₁', 6), par(R('R₂', 12), sw('S', false)), AMM)),
    alt: 'A circuit diagram: a 12 volt battery, a 6 ohm resistor R₁, then a 12 ohm resistor R₂ with an open switch S connected across it on a parallel wire, and an ammeter on the return wire.',
    q: 'Switch S in the circuit shown is open, as drawn. What does the ammeter read after S is closed, in amperes?',
    n: '2',
    ck: ['circuit_component', { component: 'battery', quantity: 'current', switches: { S: true } }],
    h: ['Look at what the closed switch is connected across.', 'A closed switch is a path of zero resistance: decide how much current still passes through the resistor beside it.'],
    s: 'The switch is wired in parallel with R₂. Once closed it is a zero-resistance path across R₂, so the current bypasses R₂ entirely and only R₁ = 6 Ω remains in the loop. The ammeter reads 12 ÷ 6 = 2 A.',
  },
]);

G('1503a287.lo-4', 'Voltage drops in series', [
  {
    t: 'voltage across one of three series resistors', d: 2, need: 'calc',
    spec: circ(24, ser(R('R₁', 3), R('R₂', 5), R('R₃', 4))),
    alt: 'A circuit diagram with a single loop: a 24 volt battery and three resistors in a row, R₁ of 3 ohms, R₂ of 5 ohms and R₃ of 4 ohms.',
    q: 'What is the potential difference across R₂ in the circuit shown, in volts?',
    n: '10',
    ck: ['circuit_component', { component: 'R₂', quantity: 'voltage' }],
    h: ['First find the current in the loop from the total resistance.', 'The drop across one resistor is that current times its own resistance.'],
    s: 'The loop holds 3 + 5 + 4 = 12 Ω across 24 V, so the current is 2 A. Across R₂ = 5 Ω the potential difference is 2 × 5 = 10 V.',
  },
  {
    t: 'voltage across one resistor from a voltmeter on another', d: 3, need: 'calc',
    spec: circ(18, ser(par(R('R₁', 4), VOLT), R('R₂', 2), R('R₃', 6)), { show: 'blank' }),
    alt: 'A circuit diagram: a battery whose voltage is replaced by a question mark, and three resistors in series — R₁ of 4 ohms with a voltmeter connected across it, R₂ of 2 ohms and R₃ of 6 ohms.',
    q: 'The voltmeter in the circuit shown reads 6.0 V. What is the potential difference across R₃, in volts?',
    n: '9',
    calc: ['checker circuit_component (voltage of R₃); the voltage of R₁ in the spec is checked against the stated reading', (c) => {
      if (!near(cq(c, 'R₁', 'voltage'), 6)) throw new Error('the stated voltmeter reading is not the voltage of the spec');
      return cq(c, 'R₃', 'voltage');
    }],
    h: ['The voltmeter tells you the drop across the resistor it is connected across; use it to find the current.', 'The same current passes through every resistor of the loop.'],
    s: 'The voltmeter is across R₁ = 4 Ω, so the current is 6.0 ÷ 4 = 1.5 A. The resistors are in series, so the same 1.5 A passes through R₃ = 6 Ω, giving 1.5 × 6 = 9 V.',
  },
]);

// ── Physics · Parallel Circuits Fundamentals ────────────────────────────────
G('ae0f8dbd.lo-1', 'Telling parallel from series', [
  {
    t: 'pick the pair of resistors in parallel', d: 1, need: 'read',
    spec: circ(12, ser(R('R₁', 5, nm), par(R('R₂', 5, nm), R('R₃', 5, nm)), R('R₄', 5, nm))),
    alt: 'A circuit diagram: a 12 volt battery, resistor R₁, then a junction where the wire splits into two branches holding R₂ and R₃, and after the branches rejoin, resistor R₄. No resistance values are printed.',
    q: 'Which two resistors in the circuit shown are connected in parallel with each other?',
    o: [['R₂ and R₃', 'correct'], ['R₁ and R₂', 'takes two resistors that follow one another along the wire as parallel'], ['R₁ and R₄', 'picks the two resistors that both carry the full battery current — they are in series'], ['R₃ and R₄', 'pairs one branch with the resistor that comes after the branches rejoin']],
    holds: ['the kind\'s own circuit tree: the two named resistors sit alone on different branches of one parallel group', [['R₂', 'R₃'], ['R₁', 'R₂'], ['R₁', 'R₄'], ['R₃', 'R₄']].map((pair) => (c: Ctx) => sameGroup(c, 'parallel', pair))],
    h: ['Two components are in parallel when both ends of one are joined to both ends of the other.', 'Look for the two junctions where the wire splits and rejoins.'],
    s: 'In the diagram the wire splits at one junction and rejoins at another. R₂ lies on one of the two branches between those junctions and R₃ on the other, so R₂ and R₃ are in parallel. R₁ and R₄ lie outside the junctions, in series with the pair.',
  },
  {
    t: 'which bulbs stay lit when a branch switch opens', d: 2, need: 'reason',
    spec: circ(6, par(bulb('L₁'), ser(sw('S'), bulb('L₂')), bulb('L₃'))),
    alt: 'A circuit diagram: a 6 volt battery connected to three parallel branches. The first branch holds bulb L₁, the second holds a closed switch S followed by bulb L₂, and the third holds bulb L₃.',
    q: 'Switch S in the circuit shown is opened. Which bulbs remain lit?',
    o: [['L₁ and L₃', 'correct'], ['L₁ only', 'thinks the current cannot get past the branch that holds the open switch'], ['L₃ only', 'thinks only the branch furthest from the switch is unaffected'], ['No bulb', 'treats the three bulbs as one series loop']],
    holds: ['checker circuit_component (power) for each bulb with switches {S: false}', ([[true, false, true], [true, false, false], [false, false, true], [false, false, false]] as boolean[][]).map((want) => (c: Ctx) => ['L₁', 'L₂', 'L₃'].every((b, i) => (cq(c, b, 'power', { S: false }) > 0) === want[i]))],
    h: ['Find which branch the switch is on.', 'Each branch of a parallel circuit is its own complete path between the battery terminals.'],
    s: 'The diagram shows three separate branches across the battery, and the switch is on the middle branch with L₂ only. Opening S breaks that one branch, so L₂ goes out, while L₁ and L₃ still have complete paths to both terminals and stay lit.',
  },
  {
    t: 'count the separate current paths', d: 1, need: 'read',
    spec: circ(12, par(R('R₁', 6, nm), ser(R('R₂', 3, nm), R('R₃', 3, nm)), R('R₄', 6, nm))),
    alt: 'A circuit diagram: a 12 volt battery connected to three parallel branches. One branch holds resistor R₁, one holds resistors R₂ and R₃ one after the other, and one holds resistor R₄. No resistance values are printed.',
    q: 'In the circuit shown, how many separate paths can current take from the + terminal of the battery round to the − terminal?',
    n: '3',
    calc: ['routes through the kind\'s own circuit tree (a parallel group adds the routes of its branches, a series group multiplies them)', (c) => routes(c)],
    h: ['Start at the + terminal and follow the wire until it first splits.', 'Two resistors that follow one another on the same branch belong to the same path.'],
    s: 'At the first junction the wire splits into three branches: one through R₁, one through R₂ and then R₃, and one through R₄. R₂ and R₃ share a branch, so they form one path, not two. There are 3 separate paths.',
  },
]);

G('ae0f8dbd.lo-2', 'Equivalent resistance in parallel', [
  {
    t: 'equivalent resistance of three parallel resistors', d: 2, need: 'calc',
    spec: circ(12, par(R('R₁', 12), R('R₂', 6), R('R₃', 4))),
    alt: 'A circuit diagram: a 12 volt battery connected to three parallel branches, each holding one resistor — R₁ of 12 ohms, R₂ of 6 ohms and R₃ of 4 ohms.',
    q: 'What is the equivalent resistance of the three resistors in the circuit shown, in ohms?',
    n: '2',
    ck: ['circuit_equivalent_resistance', {}],
    h: ['For resistors in parallel, add the reciprocals of the resistances.', 'The equivalent resistance must come out smaller than the smallest branch resistance.'],
    s: 'The three resistors are on separate branches, so 1/R = 1/12 + 1/6 + 1/4 = 1/12 + 2/12 + 3/12 = 6/12. The equivalent resistance is 12 ÷ 6 = 2 Ω.',
  },
  {
    t: 'unknown branch resistance from the total current', d: 3, need: 'calc',
    spec: circ(12, par(R('R₁', 6), R('R₂', 12), R('R₃', 4, { show: 'blank' })), { current: '6 A' }),
    alt: 'A circuit diagram: a 12 volt battery, with an arrow on the wire leaving it labelled with the total current, connected to three parallel branches: R₁ of 6 ohms, R₂ of 12 ohms and R₃, whose value is replaced by a question mark.',
    q: 'The arrow beside the battery in the circuit shown gives the total current the battery supplies. What is the resistance of R₃, in ohms?',
    n: '4',
    calc: ['battery EMF ÷ (printed total current − the currents of R₁ and R₂ from checker circuit_component); the printed total is checked against the battery current of the spec', (c) => {
      if (!near(cq(c, 'battery', 'current'), 6)) throw new Error('the printed total current is not the current of the spec');
      return c.model(circuitModel).battery.emf / (6 - cq(c, 'R₁', 'current') - cq(c, 'R₂', 'current'));
    }],
    h: ['Each branch of a parallel circuit has the full battery voltage across it.', 'Find the currents in the two known branches; what is left of the total must pass through the third.'],
    s: 'Each branch has 12 V across it, so R₁ carries 12 ÷ 6 = 2 A and R₂ carries 12 ÷ 12 = 1 A. The arrow gives a total of 6 A, leaving 6 − 2 − 1 = 3 A for R₃. Its resistance is 12 ÷ 3 = 4 Ω.',
  },
]);

G('ae0f8dbd.lo-3', 'Branch currents', [
  {
    t: 'current in one branch of three', d: 1, need: 'calc',
    spec: circ(12, par(R('R₁', 4), R('R₂', 6), R('R₃', 12))),
    alt: 'A circuit diagram: a 12 volt battery connected to three parallel branches, each holding one resistor — R₁ of 4 ohms, R₂ of 6 ohms and R₃ of 12 ohms.',
    q: 'What is the current through R₂ in the circuit shown, in amperes?',
    n: '2',
    ck: ['circuit_component', { component: 'R₂', quantity: 'current' }],
    h: ['Decide what voltage is across each branch of a parallel circuit.', 'Apply Ohm\'s law to the one branch asked about.'],
    s: 'R₂ is on its own branch directly across the 12 V battery, so the potential difference across it is 12 V. Its resistance read from the diagram is 6 Ω, so the current is 12 ÷ 6 = 2 A.',
  },
  {
    t: 'current in one branch from an ammeter in the other', d: 3, need: 'calc',
    spec: circ(6, par(ser(AMM, R('R₁', 10)), R('R₂', 15)), { show: 'blank' }),
    alt: 'A circuit diagram: a battery whose voltage is replaced by a question mark, connected to two parallel branches. One branch holds an ammeter followed by a 10 ohm resistor R₁; the other holds a 15 ohm resistor R₂.',
    q: 'The ammeter in the circuit shown reads 0.60 A. What is the current through R₂, in amperes?',
    n: '0.4',
    calc: ['checker circuit_component (current of R₂); the current of R₁ in the spec is checked against the stated reading', (c) => {
      if (!near(cq(c, 'R₁', 'current'), 0.6)) throw new Error('the stated ammeter reading is not the current of the spec');
      return cq(c, 'R₂', 'current');
    }],
    h: ['The ammeter measures the current in its own branch only. Use it to find the voltage across that branch.', 'Parallel branches have the same potential difference.'],
    s: 'The ammeter is on the branch with R₁ = 10 Ω, so the potential difference across that branch is 0.60 × 10 = 6.0 V. R₂ = 15 Ω is in parallel with it and has the same 6.0 V, so its current is 6.0 ÷ 15 = 0.4 A.',
  },
]);

G('ae0f8dbd.lo-4', 'Voltage across parallel branches', [
  {
    t: 'voltage across a parallel pair that follows a series resistor', d: 3, need: 'calc',
    spec: circ(18, ser(R('R₁', 3), par(R('R₂', 10), R('R₃', 15)))),
    alt: 'A circuit diagram: an 18 volt battery, a 3 ohm resistor R₁, and then a junction where the wire splits into two branches holding a 10 ohm resistor R₂ and a 15 ohm resistor R₃.',
    q: 'What is the potential difference across R₃ in the circuit shown, in volts?',
    n: '12',
    ck: ['circuit_component', { component: 'R₃', quantity: 'voltage' }],
    h: ['Replace the two branch resistors by one equivalent resistor, then find the battery current.', 'Both branches of the pair have the same potential difference: the battery voltage less the drop across the series resistor.'],
    s: 'R₂ and R₃ are in parallel: 10 × 15 ÷ (10 + 15) = 6 Ω. With R₁ the total is 3 + 6 = 9 Ω, so the battery current is 18 ÷ 9 = 2 A. The drop across R₁ is 2 × 3 = 6 V, leaving 18 − 6 = 12 V across the pair, and so across R₃.',
  },
  {
    t: 'rank identical bulbs by brightness', d: 2, need: 'reason',
    spec: circ(6, par(bulb('L₁'), ser(bulb('L₂'), bulb('L₃')))),
    alt: 'A circuit diagram: a 6 volt battery connected to two parallel branches. One branch holds bulb L₁ alone; the other holds bulbs L₂ and L₃ one after the other.',
    q: 'The three bulbs in the circuit shown are identical. Which ranks the bulbs from brightest to dimmest?',
    o: [['L₁ > L₂ = L₃', 'correct'], ['L₁ = L₂ = L₃', 'gives every bulb the full battery voltage'], ['L₂ = L₃ > L₁', 'thinks the branch with more bulbs draws more current'], ['L₁ = L₂ > L₃', 'thinks the second bulb on a branch gets less current than the first']],
    ck: ['circuit_brightness_order', {}],
    h: ['Each branch has the full battery voltage across it.', 'On the branch with two identical bulbs that voltage is shared between them.'],
    s: 'Both branches are across the battery. L₁ is alone on its branch and has the full 6 V. L₂ and L₃ are in series on the other branch, so they share the 6 V equally and carry the same current. L₁ is brightest and L₂ and L₃ are equally dim: L₁ > L₂ = L₃.',
  },
]);

// ── Physics · Combination Series-Parallel Circuits ──────────────────────────
G('8f54b2e2.lo-2', 'Series and parallel sections of a combination circuit', [
  {
    t: 'pick the pair of resistors directly in series', d: 2, need: 'read',
    spec: circ(12, ser(R('R₁', 4, nm), par(R('R₂', 8, nm), ser(R('R₃', 3, nm), R('R₄', 5, nm))), R('R₅', 2, nm))),
    alt: 'A circuit diagram: a 12 volt battery, resistor R₁, then a junction with two branches — R₂ alone on one branch, R₃ followed by R₄ on the other — and, after the branches rejoin, resistor R₅. No resistance values are printed.',
    q: 'Which of these pairs of resistors in the circuit shown is connected in series, one directly after the other with no junction between them?',
    o: [['R₃ and R₄', 'correct'], ['R₂ and R₃', 'takes two resistors on different branches of the same junction as a series pair'], ['R₁ and R₂', 'ignores the junction between them, where the current divides'], ['R₄ and R₅', 'ignores the junction between them, where the branches rejoin']],
    holds: ['the kind\'s own circuit tree: the two named resistors are direct members of the same series group', [['R₃', 'R₄'], ['R₂', 'R₃'], ['R₁', 'R₂'], ['R₄', 'R₅']].map((pair) => (c: Ctx) => sameGroup(c, 'series', pair))],
    h: ['Two resistors are in series when all the current that leaves one must enter the other.', 'Check each pair for a junction (a dot where three wires meet) between the two resistors.'],
    s: 'On the lower branch of the diagram the wire runs from R₃ straight into R₄ with no junction between them, so they are in series. Each of the other pairs has a junction between its two resistors, where the current divides or recombines.',
  },
  {
    t: 'which of four equal resistors carries the largest current', d: 2, need: 'reason',
    spec: circ(12, ser(R('R₁', 10, nm), par(R('R₂', 10, nm), ser(R('R₃', 10, nm), R('R₄', 10, nm))))),
    alt: 'A circuit diagram: a 12 volt battery, resistor R₁, and then a junction with two branches — R₂ alone on one branch, and R₃ followed by R₄ on the other. No resistance values are printed.',
    q: 'All four resistors in the circuit shown have the same resistance. Which resistor carries the largest current?',
    o: [['R₁', 'correct'], ['R₂', 'picks the branch of least resistance without noticing that the two branches share the current of the resistor before the junction'], ['R₃', 'thinks the current is largest where two resistors follow one another'], ['R₄', 'thinks the current builds up toward the last resistor before the − terminal']],
    holds: ['checker circuit_component (current) for the four resistors: the named one is strictly the largest', ['R₁', 'R₂', 'R₃', 'R₄'].map((r) => (c: Ctx) => ['R₁', 'R₂', 'R₃', 'R₄'].filter((x) => x !== r).every((x) => cq(c, r, 'current') > cq(c, x, 'current') + 1e-9))],
    h: ['Find the resistor that is not on either branch.', 'The current that divides at a junction is the sum of the branch currents.'],
    s: 'R₁ lies before the junction, in series with the battery, so it carries the whole battery current. At the junction that current divides between the branch with R₂ and the branch with R₃ and R₄, so each of those resistors carries only part of it. R₁ carries the largest current.',
  },
  {
    t: 'what the circuit reduces to when a branch switch is open', d: 3, need: 'reason',
    spec: circ(12, ser(R('R₁', 4, nm), par(ser(sw('S', false), R('R₂', 6, nm)), R('R₃', 12, nm)))),
    alt: 'A circuit diagram: a 12 volt battery, resistor R₁, and then a junction with two branches. One branch holds a switch S, drawn open, followed by resistor R₂; the other branch holds resistor R₃. No resistance values are printed.',
    q: 'Switch S in the circuit shown is open, as drawn. With S open, how are the resistors that carry current connected?',
    o: [['R₁ and R₃ in series', 'correct'], ['R₁ and R₃ in parallel', 'calls the pair parallel on account of the junctions, although only one path is left'], ['R₁ alone', 'thinks the open switch cuts off everything beyond the junction'], ['No resistor carries current', 'treats the open switch as breaking the whole circuit']],
    holds: ['checker circuit_component (current) with the switch as drawn: which resistors carry current, and whether they carry the same current as the battery', [
      (c) => cq(c, 'R₂', 'current') === 0 && cq(c, 'R₁', 'current') > 0 && near(cq(c, 'R₁', 'current'), cq(c, 'R₃', 'current')),
      (c) => cq(c, 'R₁', 'current') > 0 && cq(c, 'R₃', 'current') > 0 && near(cq(c, 'battery', 'current'), cq(c, 'R₁', 'current') + cq(c, 'R₃', 'current')),
      (c) => cq(c, 'R₁', 'current') > 0 && cq(c, 'R₃', 'current') === 0,
      (c) => cq(c, 'battery', 'current') === 0,
    ]],
    h: ['Cross out the branch that holds the open switch: no current passes along it.', 'Follow the one path that is left from the + terminal to the − terminal.'],
    s: 'The open switch is on the branch with R₂, so no current passes through R₂. The only complete path left runs through R₁ and then through R₃, with the same current in both: R₁ and R₃ are in series.',
  },
]);

G('8f54b2e2.lo-4', 'Equivalent resistance of a combination circuit', [
  {
    t: 'series–parallel–series equivalent resistance', d: 2, need: 'calc',
    spec: circ(12, ser(R('R₁', 4), par(R('R₂', 6), R('R₃', 12)), R('R₄', 2))),
    alt: 'A circuit diagram: a 12 volt battery, a 4 ohm resistor R₁, then two parallel branches holding a 6 ohm resistor R₂ and a 12 ohm resistor R₃, and after the branches rejoin, a 2 ohm resistor R₄.',
    q: 'What is the equivalent resistance of the circuit shown, in ohms?',
    n: '10',
    ck: ['circuit_equivalent_resistance', {}],
    h: ['Reduce the two parallel resistors to one equivalent resistor first.', 'That equivalent resistor is then in series with the other two.'],
    s: 'R₂ and R₃ are in parallel: 6 × 12 ÷ (6 + 12) = 4 Ω. That 4 Ω is in series with R₁ = 4 Ω and R₄ = 2 Ω, so the equivalent resistance is 4 + 4 + 2 = 10 Ω.',
  },
  {
    t: 'equivalent resistance after a branch switch is closed', d: 3, need: 'calc',
    spec: circ(12, ser(R('R₁', 3), par(R('R₂', 6), ser(sw('S', false), R('R₃', 3))))),
    alt: 'A circuit diagram: a 12 volt battery, a 3 ohm resistor R₁, and then two parallel branches. One branch holds a 6 ohm resistor R₂; the other holds a switch S, drawn open, followed by a 3 ohm resistor R₃.',
    q: 'Switch S in the circuit shown is drawn open. What is the equivalent resistance of the circuit after S is closed, in ohms?',
    n: '5',
    ck: ['circuit_equivalent_resistance', { switches: { S: true } }],
    h: ['With the switch closed, the branch that holds it conducts and is in parallel with the other branch.', 'Combine the two branches, then add the resistor that is in series with them.'],
    s: 'With S closed, R₃ = 3 Ω is in parallel with R₂ = 6 Ω: 6 × 3 ÷ (6 + 3) = 2 Ω. This is in series with R₁ = 3 Ω, so the equivalent resistance is 3 + 2 = 5 Ω.',
  },
]);

G('8f54b2e2.lo-6', 'Voltage drops in a combination circuit', [
  {
    t: 'voltage across a parallel pair that comes before a series resistor', d: 2, need: 'calc',
    spec: circ(20, ser(par(R('R₁', 20), R('R₂', 30)), R('R₃', 8))),
    alt: 'A circuit diagram: a 20 volt battery, two parallel branches holding a 20 ohm resistor R₁ and a 30 ohm resistor R₂, and after the branches rejoin, an 8 ohm resistor R₃ in series.',
    q: 'What is the potential difference across R₁ in the circuit shown, in volts?',
    n: '12',
    ck: ['circuit_component', { component: 'R₁', quantity: 'voltage' }],
    h: ['Reduce the parallel pair to one resistor and find the battery current.', 'The potential difference across either branch equals the current times the equivalent resistance of the pair.'],
    s: 'R₁ and R₂ in parallel give 20 × 30 ÷ 50 = 12 Ω. With R₃ the total is 12 + 8 = 20 Ω, so the battery current is 20 ÷ 20 = 1 A. The potential difference across the pair, and so across R₁, is 1 × 12 = 12 V.',
  },
  {
    t: 'voltage across one resistor of a series pair inside a branch', d: 3, need: 'calc',
    spec: circ(18, ser(R('R₁', 6), par(R('R₂', 24), ser(R('R₃', 10), R('R₄', 14))))),
    alt: 'A circuit diagram: an 18 volt battery, a 6 ohm resistor R₁, and then two parallel branches. One branch holds a 24 ohm resistor R₂; the other holds a 10 ohm resistor R₃ followed by a 14 ohm resistor R₄.',
    q: 'What is the potential difference across R₄ in the circuit shown, in volts?',
    n: '7',
    ck: ['circuit_component', { component: 'R₄', quantity: 'voltage' }],
    h: ['Add the two resistors that share a branch, then combine the two branches.', 'Once you know the potential difference across the branches, find the current in the branch that holds the resistor asked about.'],
    s: 'R₃ and R₄ in series make 24 Ω, in parallel with R₂ = 24 Ω: 12 Ω. With R₁ the total is 18 Ω, so the battery current is 1 A and the potential difference across the branches is 1 × 12 = 12 V. The lower branch carries 12 ÷ 24 = 0.5 A, so across R₄ = 14 Ω there are 0.5 × 14 = 7 V.',
  },
]);

G('8f54b2e2.lo-7', 'Multi-step combination circuits', [
  {
    t: 'power in one branch resistor', d: 3, need: 'calc',
    spec: circ(36, ser(R('R₁', 4), par(R('R₂', 12), R('R₃', 6)))),
    alt: 'A circuit diagram: a 36 volt battery, a 4 ohm resistor R₁, and then two parallel branches holding a 12 ohm resistor R₂ and a 6 ohm resistor R₃.',
    q: 'How much power is dissipated in R₃ in the circuit shown, in watts?',
    n: '54',
    ck: ['circuit_component', { component: 'R₃', quantity: 'power' }],
    h: ['Find the battery current from the equivalent resistance, then the potential difference across the parallel pair.', 'For one resistor, P = V²/R with the potential difference across that resistor.'],
    s: 'R₂ and R₃ in parallel give 12 × 6 ÷ 18 = 4 Ω; with R₁ the total is 8 Ω, so the battery current is 36 ÷ 8 = 4.5 A. The potential difference across the pair is 4.5 × 4 = 18 V, so R₃ = 6 Ω dissipates 18² ÷ 6 = 54 W.',
  },
  {
    t: 'brightness change of a branch bulb when the other branch is opened', d: 3, need: 'reason',
    spec: circ(9, ser(bulb('L₁'), par(bulb('L₂'), ser(sw('S'), bulb('L₃'))))),
    alt: 'A circuit diagram: a 9 volt battery, bulb L₁, and then two parallel branches. One branch holds bulb L₂; the other holds a closed switch S followed by bulb L₃.',
    q: 'The three bulbs in the circuit shown are identical, and switch S is closed. When S is opened, what happens to the brightness of bulb L₂?',
    o: [['It increases', 'correct'], ['It decreases', 'reasons that the battery now supplies less current, so every bulb must be dimmer'], ['It stays the same', 'assumes a bulb on one parallel branch is not affected by the other branch'], ['It goes out', 'thinks the open switch breaks the path through both branches']],
    ck: ['circuit_switch_effect', { switch: 'S', component: 'L₂', quantity: 'brightness' }],
    h: ['Compare the total resistance of the circuit before and after the switch is opened.', 'Then compare how the battery voltage is shared between L₁ and the bulb or bulbs after it.'],
    s: 'With S closed, L₂ and L₃ are in parallel (half a bulb\'s resistance) in series with L₁, so L₂ has one third of the battery voltage. With S open, L₂ is simply in series with L₁ and has one half of the battery voltage. A larger voltage across the same bulb means more power, so the brightness of L₂ increases.',
  },
]);

// ── Physics · Electric Field from Point Charges ─────────────────────────────
const FRAME = { xRange: [-5, 5], yRange: [-3.5, 3.5] };
/** Where the fields of +3q at x = −3 and −q at x = 0 cancel: 3/(x + 3)² = 1/x², x > 0. */
const ZERO_X = 3 / (Math.sqrt(3) - 1);
G('8d83c172.lo-3', 'Direction of the field of point charges', [
  {
    t: 'field direction beside a single charge from its sign', d: 2, need: 'reason',
    spec: charges([[0, 0, -1]], { ...FRAME, arrows: false, points: [{ x: 3, y: 0, label: 'P' }] }),
    alt: 'A field diagram: one point charge marked with a minus sign at the centre, with straight field lines radiating from it in all directions and no arrowheads. A point P is marked on the right of the charge, level with it.',
    q: 'The field lines round the point charge shown are drawn without arrowheads. What is the direction of the electric field at point P?',
    o: [['To the left', 'correct'], ['To the right', 'gives the direction for a positive charge'], ['Up', 'takes the field to circle the charge, at right angles to the line from the charge'], ['Down', 'takes the field to circle the charge the other way round']],
    ck: ['field_direction_at', { point: 'P' }],
    h: ['The field at a point is the direction of the force on a small positive test charge placed there.', 'Read the sign printed on the charge and decide whether a positive test charge at P is pushed away or pulled in.'],
    s: 'The charge in the diagram carries a minus sign, so a positive test charge at P is attracted to it. P lies to the right of the charge, so the force, and with it the field, points from P toward the charge: to the left.',
  },
  {
    t: 'signs of two charges from the arrows on the field lines', d: 2, need: 'reason',
    spec: charges([[-2, 0, 1, { showSign: false, label: 'X' }], [2, 0, -1, { showSign: false, label: 'Y' }]], { ...FRAME }),
    alt: 'A field diagram: two point charges labelled X (on the left) and Y (on the right), drawn as empty circles with no signs. Field lines with arrowheads run between and round the two charges.',
    q: 'The signs of charges X and Y are not marked in the field diagram shown. Which describes the two charges?',
    o: [['X is positive and Y is negative', 'correct'], ['X is negative and Y is positive', 'reads the arrows as pointing from negative to positive'], ['X and Y are positive', 'ignores the arrows and the lines that join the two charges'], ['X and Y are negative', 'takes lines that end on a charge as the rule for every charge']],
    holds: ['checker field_charge_sign for charge 0 (X) and charge 1 (Y)', ([['positive', 'negative'], ['negative', 'positive'], ['positive', 'positive'], ['negative', 'negative']] as Array<[string, string]>).map(([x, y]) => (c: Ctx) => c.txt('field_charge_sign', { charge: 0 }) === x && c.txt('field_charge_sign', { charge: 1 }) === y)],
    h: ['Field lines start on positive charges and end on negative charges.', 'Look at which way the arrowheads point close to each charge.'],
    s: 'Near X the arrowheads point away from the charge, so the lines start there and X is positive. Near Y the arrowheads point toward the charge, so the lines end there and Y is negative. Lines running from X to Y confirm that the two charges have opposite signs.',
  },
  {
    t: 'force on an electron from the field direction', d: 3, need: 'reason',
    spec: charges([[0, 0, 1]], { ...FRAME, arrows: false, points: [{ x: 0, y: 2.4, label: 'P' }] }),
    alt: 'A field diagram: one point charge marked with a plus sign at the centre, with straight field lines radiating from it in all directions and no arrowheads. A point P is marked directly above the charge.',
    q: 'An electron is placed at point P in the field of the point charge shown. In which direction is the electric force on the electron?',
    o: [['Down', 'correct'], ['Up', 'gives the direction of the field, which is the force on a positive charge'], ['To the left', 'takes the force to act at right angles to the field line through P'], ['To the right', 'takes the field lines to circle the charge']],
    holds: ['checker field_direction_at {point: P}; the force on a negative charge is opposite to the field', ['down', 'up', 'left', 'right'].map((d) => (c: Ctx) => OPPOSITE[fdir(c, 'P')] === d)],
    h: ['First find the direction of the field at P from the sign of the charge.', 'The force on a negative charge is opposite to the field.'],
    s: 'The charge in the diagram is positive, so the field at P, directly above it, points away from the charge: up. An electron is negative, so the force on it is opposite to the field: down, toward the positive charge.',
  },
]);

G('8d83c172.lo-5', 'Field at a test point', [
  {
    t: 'locate the zero-field point of two unequal charges of opposite sign', d: 3, need: 'reason',
    spec: charges([[-3, 0, 3], [0, 0, -1]], { xRange: [-6, 6], yRange: [-3.6, 3.6], linesPerUnit: 4, arrows: false, points: [{ x: -4.8, y: 0, label: 'P' }, { x: -1.5, y: 0, label: 'Q' }, { x: ZERO_X, y: 0, label: 'R' }] }),
    alt: 'A field diagram: a point charge marked with a plus sign on the left, with many field lines round it, and a point charge marked with a minus sign to its right, with fewer lines meeting it. The lines carry no arrowheads. Three points are marked on the straight line through the charges: P to the left of both charges, Q between them, and R to the right of both.',
    q: 'In the field diagram shown, the charge on the left has three times the magnitude of the charge on the right. Three points are marked on the line through the charges. At which point is the net electric field zero?',
    o: [['R', 'correct'], ['Q', 'looks between the charges, where the two fields point the same way'], ['P', 'looks outside the pair on the side of the larger charge, where its field always dominates'], ['At no point on this line', 'thinks the fields of two unequal charges can never cancel']],
    holds: ['net field of the spec\'s charges at each marked point (fieldAt of the kind\'s model): zero or not', [
      (c) => netField(c, 'R')[0] < 1e-9, (c) => netField(c, 'Q')[0] < 1e-9, (c) => netField(c, 'P')[0] < 1e-9,
      (c) => ['P', 'Q', 'R'].every((p) => netField(c, p)[0] > 1e-9),
    ]],
    h: ['The two fields must point in opposite directions: decide in which regions of the line that happens for charges of opposite sign.', 'They must also be equal in size, which needs the point to be nearer the smaller charge.'],
    s: 'The signs in the diagram are + on the left and − on the right. Between the charges (Q) both fields point to the right, so they cannot cancel. Outside the pair the two fields are opposite. On the left (P) the point is nearer the larger charge, whose field is always the stronger there. On the right (R) the point is nearer the smaller charge and further from the larger one, so the two fields can be equal in size: the net field is zero at R.',
  },
  {
    t: 'size and direction of the field of one charge at a point', d: 2, need: 'calc',
    spec: charges([[0, 0, -1]], { ...FRAME, arrows: false, points: [{ x: -3, y: 0, label: 'P' }] }),
    alt: 'A field diagram: one point charge marked with a minus sign at the centre, with straight field lines radiating from it and no arrowheads. A point P is marked on the left of the charge, level with it.',
    q: 'The point charge shown has a magnitude of 2.0 nC and the sign marked on it. Point P is 0.30 m from the charge. Taking k = 9.0 × 10⁹ N·m²/C², which gives the electric field at P?',
    o: [['200 N/C, to the right', 'correct'], ['200 N/C, to the left', 'gives the direction for a positive charge'], ['60 N/C, to the right', 'divides by the distance instead of by its square'], ['60 N/C, to the left', 'divides by the distance and also points the field away from the charge']],
    holds: ['size kq/r² from the numbers in the stem; direction from checker field_direction_at {point: P}', ([[200, 'right'], [200, 'left'], [60, 'right'], [60, 'left']] as Array<[number, string]>).map(([e, d]) => (c: Ctx) => near((9e9 * 2e-9) / 0.3 ** 2, e) && fdir(c, 'P') === d)],
    h: ['Use E = kq/r² for the size, with the charge in coulombs.', 'For the direction, read the sign on the charge and the side of the charge that P is on.'],
    s: 'The size is E = (9.0 × 10⁹)(2.0 × 10⁻⁹) ÷ (0.30)² = 18 ÷ 0.090 = 200 N/C. The diagram shows a negative charge with P on its left, so the field at P points toward the charge: to the right.',
  },
  {
    t: 'net field midway between two charges of opposite sign', d: 3, need: 'reason',
    spec: charges([[-2.5, 0, 1], [2.5, 0, -1]], { ...FRAME, arrows: false, points: [{ x: 0, y: 0, label: 'P' }] }),
    alt: 'A field diagram: a point charge marked with a plus sign on the left and one marked with a minus sign on the right, joined by curved field lines with no arrowheads. A point P is marked midway between the two charges.',
    q: 'The two charges shown have equal magnitudes, and P is midway between them. Each charge alone would produce a field of magnitude E₀ at P. What is the net electric field at P?',
    o: [['2E₀, to the right', 'correct'], ['2E₀, to the left', 'points the field toward the positive charge'], ['Zero', 'lets the two fields cancel, as they would for two charges of the same sign'], ['E₀, to the right', 'counts the field of only one of the charges']],
    holds: ['fieldAt of the kind\'s model at P: the net field ÷ the field of one charge alone, and its direction', ([[2, 'right'], [2, 'left'], [0, ''], [1, 'right']] as Array<[number, string]>).map(([k, d]) => (c: Ctx) => {
      const m = c.model(fieldModel);
      if (m.variant !== 'point_charges') return false;
      const one = Math.hypot(...fieldAt([m.charges[0]], 0, 0));
      const [size, ex] = netField(c, 'P');
      return near(size / one, k, 1e-6) && (k === 0 || (ex > 0 ? 'right' : 'left') === d);
    })],
    h: ['Find the direction of the field of each charge at P separately, using the signs marked on them.', 'Fields in the same direction add.'],
    s: 'At P the field of the positive charge, on the left, points away from it: to the right. The field of the negative charge, on the right, points toward it: also to the right. The two fields have the same size E₀ and the same direction, so the net field is 2E₀ to the right.',
  },
]);

G('8d83c172.lo-4', 'Superposition of two fields', [
  {
    t: 'direction of the net field off the line of two equal like charges', d: 3, need: 'reason',
    spec: charges([[-2, 0, 1], [2, 0, 1]], { ...FRAME, arrows: false, points: [{ x: 0, y: 2.2, label: 'P' }] }),
    alt: 'A field diagram: two point charges, each marked with a plus sign, side by side, with field lines round them and no arrowheads. A point P is marked above the midpoint of the line joining the charges, equally far from both.',
    q: 'The two point charges shown are equal. What is the direction of the net electric field at point P?',
    o: [['Up', 'correct'], ['Down', 'adds the two fields as if both charges attracted a positive test charge'], ['To the right', 'uses the field of the left-hand charge only'], ['The field is zero there', 'lets the fields cancel completely, as they do at the midpoint between the charges']],
    ck: ['field_direction_at', { point: 'P' }],
    h: ['Sketch the field of each charge at P: each points directly away from its own charge.', 'Split the two fields into horizontal and vertical parts and add them.'],
    s: 'Both charges are positive, so at P each field points away from its charge: one up and to the right, the other up and to the left. P is equally far from both, so the horizontal parts are equal and opposite and cancel, while the vertical parts add. The net field points up.',
  },
  {
    t: 'find the labelled point where two equal like charges give zero field', d: 2, need: 'reason',
    spec: charges([[-2.5, 0, 1], [2.5, 0, 1]], { xRange: [-5, 6], yRange: [-3.5, 3.5], arrows: false, points: [{ x: 0, y: 0, label: 'P' }, { x: 0, y: 2.2, label: 'Q' }, { x: 4.6, y: 0, label: 'R' }] }),
    alt: 'A field diagram: two point charges, each marked with a plus sign, side by side, with field lines round them and no arrowheads. Three points are marked: P midway between the charges, Q above P, and R on the line through the charges, to the right of the right-hand charge.',
    q: 'The two point charges in the field diagram shown are equal. At which labelled point is the net electric field zero?',
    o: [['P', 'correct'], ['Q', 'cancels the whole field at a point where only the horizontal parts cancel'], ['R', 'looks for the zero point outside the pair, as for charges of opposite sign'], ['At no labelled point', 'thinks the fields of two charges of the same sign always add']],
    holds: ['net field of the spec\'s charges at each marked point (fieldAt of the kind\'s model): zero or not', [
      (c) => netField(c, 'P')[0] < 1e-9, (c) => netField(c, 'Q')[0] < 1e-9, (c) => netField(c, 'R')[0] < 1e-9,
      (c) => ['P', 'Q', 'R'].every((p) => netField(c, p)[0] > 1e-9),
    ]],
    h: ['The net field is zero only where the two fields are equal in size and opposite in direction.', 'For that, the point must lie on the line through the charges, at equal distances from two equal charges.'],
    s: 'At P, midway between the two equal positive charges, the field of each charge points away from it, so the two fields are opposite; P is equally far from both, so they are equal in size and cancel. At Q only the horizontal parts cancel, and at R both fields point to the right.',
  },
]);

// ── Physics · Magnetic Fields and Right-Hand Rule ───────────────────────────
const wire = (params: P): Spec => S('field_diagram', { variant: 'wire', ...params });
G('73571e58.lo-1', 'Direction of a magnetic field', [
  {
    t: 'compass needle direction from the arrows on a field line', d: 2, need: 'reason',
    spec: wire({ view: 'cross_section', current: 'in', showCurrent: false, showDirection: true, point: { side: 'above', label: 'P' } }),
    alt: 'A magnetic field diagram: a wire seen end-on as a small empty circle labelled wire, with three circular field lines round it that carry arrowheads. A point P is marked on the middle circle, directly above the wire.',
    q: 'The diagram shows magnetic field lines in the region round a current-carrying wire seen end-on. A small compass is placed at point P. In which direction does the north pole of its needle point?',
    o: [['To the right', 'correct'], ['To the left', 'points the needle against the field'], ['Toward the wire', 'thinks the needle is attracted to the source of the field'], ['Away from the wire', 'thinks the needle is pushed out along a radius']],
    ck: ['field_wire_direction', {}],
    h: ['A compass needle lines up with the magnetic field: its north pole points in the direction of the field.', 'The direction of the field at a point is along the tangent to the field line there, the way the arrowheads run.'],
    s: 'The arrowheads show that the field runs clockwise round the wire. At P, at the top of the circle, the tangent in the clockwise sense points to the right. The north pole of the compass needle points along the field: to the right.',
  },
  {
    t: 'compare the field at opposite points of one field line', d: 2, need: 'reason',
    spec: wire({ view: 'cross_section', current: 'out', showCurrent: false, showDirection: true, point: { side: 'left', label: 'P' } }),
    alt: 'A magnetic field diagram: a wire seen end-on as a small empty circle labelled wire, with three circular field lines round it that carry arrowheads. A point P is marked on the middle circle, directly to the left of the wire.',
    q: 'The magnetic field lines shown surround a current-carrying wire seen end-on. Compared with the magnetic field at point P, the field at the point of the same field line directly on the other side of the wire is',
    o: [['equal in strength and opposite in direction', 'correct'], ['equal in strength and in the same direction', 'treats the field as uniform, like the field between flat magnet poles'], ['weaker and opposite in direction', 'thinks the field weakens along a field line'], ['stronger and in the same direction', 'thinks the field builds up in the direction of the arrowheads']],
    holds: ['directions at the left and at the right of the wire from the kind\'s model (wireFieldDirection); both points lie on the same circle, at the same distance from the wire, so the strengths are equal', ([[true, true], [true, false], [false, true], [false, false]] as Array<[boolean, boolean]>).map(([equal, opposite]) => (c: Ctx) => {
      const m = c.model(fieldModel);
      if (m.variant !== 'wire' || m.view !== 'cross_section') return false;
      const isOpposite = OPPOSITE[wireFieldDirection(m.current, 'left')] === wireFieldDirection(m.current, 'right');
      return equal && opposite === isOpposite;
    })],
    h: ['The direction of the field at any point is along the tangent to the field line, in the sense of the arrowheads.', 'The strength of the field of a straight wire depends only on the distance from the wire.'],
    s: 'Following the arrowheads round the circle, the field at P, on the left, points down, and at the opposite point, on the right, it points up: opposite directions. Both points are on the same circle, at the same distance from the wire, so the field has the same strength at both.',
  },
]);

G('73571e58.lo-3', 'Field round a current-carrying wire', [
  {
    t: 'field direction beside a wire carrying current out of the page', d: 2, need: 'reason',
    spec: wire({ view: 'cross_section', current: 'out', showDirection: false, point: { side: 'right', label: 'P' } }),
    alt: 'A magnetic field diagram: a wire seen end-on as a small circle holding a dot, with three circular field lines round it that carry no arrowheads. A point P is marked on the middle circle, directly to the right of the wire. A key explains the dot and cross symbols.',
    q: 'The diagram shows a current-carrying wire seen end-on and circular magnetic field lines round it; the key gives the direction of the current. What is the direction of the magnetic field at point P?',
    o: [['Up', 'correct'], ['Down', 'uses the left hand, or the rule for a current into the page'], ['To the right', 'points the field straight out from the wire, like the electric field of a charge'], ['To the left', 'points the field straight in toward the wire']],
    ck: ['field_wire_direction', {}],
    h: ['Point the thumb of your right hand along the current; your fingers curl the way the field circles.', 'At P the field is along the tangent to the circle.'],
    s: 'The dot in the wire means the current comes out of the page. With the right thumb pointing out of the page, the fingers curl counter-clockwise, so the field circles counter-clockwise. At P, on the right of the wire, the counter-clockwise tangent points up.',
  },
  {
    t: 'field direction below a wire lying in the page', d: 3, need: 'reason',
    spec: wire({ view: 'side', current: 'right', showField: false }),
    alt: 'A magnetic field diagram: a long straight horizontal wire lying in the plane of the page, with an arrowhead labelled I that points to the right. No field symbols are drawn above or below the wire.',
    q: 'The diagram shows a long straight wire lying in the plane of the page; the arrow gives the direction of the current. What is the direction of the magnetic field at a point in the page directly below the wire?',
    o: [['Into the page', 'correct'], ['Out of the page', 'gives the field on the other side of the wire'], ['Down the page, away from the wire', 'points the field straight out from the wire'], ['To the right, along the current', 'takes the field to run parallel to the current']],
    ck: ['field_wire_direction', { side: 'below' }],
    h: ['Grip the wire with your right hand, thumb along the current.', 'See where your fingertips point as they pass under the wire.'],
    s: 'The arrow shows the current running to the right. With the right thumb pointing right, the fingers come out of the page above the wire and go back into the page below it. At a point directly below the wire the field points into the page.',
  },
]);

// ── Physics · Magnetic Force on Moving Charges ──────────────────────────────
const mforce = (params: P): Spec => S('field_diagram', { variant: 'magnetic_force', ...params });
G('bc757519.lo-3', 'Direction of the magnetic force', [
  {
    t: 'force on a positive charge in a field into the page', d: 2, need: 'reason',
    spec: mforce({ field: 'into', charge: { sign: '+', velocity: 'right', label: 'q' } }),
    alt: 'A magnetic field diagram: a dashed rectangle filled with circles that hold crosses, with a key for the dot and cross symbols. Inside it a particle marked with a plus sign and labelled q has a heavy arrow labelled v pointing to the right.',
    q: 'A positively charged particle moves through the uniform magnetic field shown. What is the direction of the magnetic force on the particle at the instant shown?',
    o: [['Up', 'correct'], ['Down', 'uses the left hand, or the rule for a negative charge'], ['Into the page', 'takes the force to act along the field'], ['Out of the page', 'takes the force to act against the field']],
    ck: ['field_force_direction', {}],
    h: ['Use the key to read the direction of the field from the symbols.', 'Right hand: fingers along the velocity, curl them toward the field; the thumb gives the force on a positive charge.'],
    s: 'The crosses mean the field points into the page, and the arrow shows the velocity to the right. Pointing the fingers of the right hand to the right and curling them into the page leaves the thumb pointing up the page. The charge is positive, so the force is up.',
  },
  {
    t: 'force on a negative charge in a field lying in the page', d: 3, need: 'reason',
    spec: mforce({ field: 'right', charge: { sign: '−', velocity: 'up', label: 'e' } }),
    alt: 'A magnetic field diagram: a dashed rectangle crossed by parallel arrows labelled B that point to the right. Inside it a particle marked with a minus sign and labelled e has a heavy arrow labelled v pointing up the page.',
    q: 'An electron moves through the uniform magnetic field shown. What is the direction of the magnetic force on the electron at the instant shown?',
    o: [['Out of the page', 'correct'], ['Into the page', 'finds the force on a positive charge and does not reverse it'], ['To the left', 'takes the force to act against the field'], ['Down', 'takes the force to act against the velocity']],
    ck: ['field_force_direction', {}],
    h: ['Find the direction a positive charge would be pushed, using the right-hand rule with v and B as drawn.', 'The force on a negative charge is opposite to that.'],
    s: 'The velocity arrow points up the page and the field arrows point to the right. For a positive charge the right-hand rule (fingers up, curled toward the right) gives a force into the page. The electron is negative, so the force on it is reversed: out of the page.',
  },
  {
    t: 'field direction from the velocity and the force drawn', d: 3, need: 'reason',
    spec: mforce({ field: 'into', showField: false, charge: { sign: '+', velocity: 'right', showForce: true } }),
    alt: 'A magnetic field diagram: a dashed rectangle labelled with a question mark in place of the field. Inside it a particle marked with a plus sign has a heavy arrow labelled v and a second, dashed arrow labelled F at right angles to it.',
    q: 'The direction of the uniform magnetic field in the region shown is not given; it is perpendicular to the velocity. The arrows show the velocity v of a positively charged particle and the magnetic force F on it. What is the direction of the field?',
    o: [['Into the page', 'correct'], ['Out of the page', 'uses the left hand, or the rule for a negative charge'], ['Up', 'takes the field to act along the force'], ['To the right', 'takes the field to act along the velocity']],
    holds: ['the kind\'s model (magneticForceDirection): the force each candidate field would give on this charge with this velocity, compared with the force drawn', (['into', 'out', 'up', 'right'] as Dir6[]).map((f) => (c: Ctx) => {
      const m = c.model(fieldModel);
      if (m.variant !== 'magnetic_force') return false;
      return magneticForceDirection(m.charge.positive, m.charge.velocity, f) === magneticForceDirection(m.charge.positive, m.charge.velocity, m.field);
    })],
    h: ['The magnetic force is perpendicular to both the velocity and the field, so the field cannot lie along v or along F.', 'Try each of the two remaining directions with the right-hand rule and see which gives the force drawn.'],
    s: 'The arrows show v to the right and F up the page. The field must be perpendicular to F, and it is given as perpendicular to v, so it is into or out of the page. With the fingers along v (right) and curled into the page, the thumb points up, matching F for this positive charge. The field is into the page.',
  },
]);

// ── Physics · Thin Lens and Mirror Equations ────────────────────────────────
const LENS_ALT = 'A ray diagram: a converging lens on a horizontal principal axis, with the points F and 2F marked on both sides, and an upright object arrow standing on the axis to the left of the lens.';
const natureIs = (want: string) => (c: Ctx) => nature(c) === want;
G('183b6442.lo-1', 'Images from ray diagrams', [
  {
    t: 'describe the image from the rays drawn through a converging lens', d: 2, need: 'reason',
    spec: ray({ element: 'converging_lens', focalLength: 10, objectDistance: 30, objectHeight: 4, showImage: false }),
    alt: `${LENS_ALT} The object is further from the lens than 2F. Three rays leave the top of the object, pass through the lens and continue on the far side. The image arrow is not drawn.`,
    q: 'The ray diagram shows three rays from the top of an object passing through a converging lens. The image itself is not drawn. Which describes the image?',
    o: [['Real, inverted and reduced', 'correct'], ['Real, inverted and enlarged', 'does not compare the distance of the crossing point from the axis with the height of the object'], ['Virtual, upright and enlarged', 'gives the image of a magnifying glass, for an object inside the focal length'], ['Real, upright and reduced', 'overlooks that the rays cross on the other side of the axis']],
    holds: ['checker ray_image_nature (type, orientation, size) compared with each option', ['real, inverted, reduced', 'real, inverted, enlarged', 'virtual, upright, enlarged', 'real, upright, reduced'].map(natureIs)],
    h: ['The image of the top of the object is where the rays from it meet after the lens.', 'Compare that meeting point with the top of the object: which side of the axis is it on, and how far from the axis?'],
    s: 'After the lens the three rays actually cross at one point on the far side, so the image is real. The crossing point is below the axis, so the image is inverted, and it is closer to the axis than the top of the object is, so the image is reduced.',
  },
  {
    t: 'predict the image for an object inside the focal length', d: 3, need: 'reason',
    spec: ray({ element: 'converging_lens', focalLength: 12, objectDistance: 6, rays: 'none', showImage: false }),
    alt: `${LENS_ALT} The object stands between the lens and the nearer point F. No rays and no image are drawn.`,
    q: 'No rays have been drawn in the diagram shown. Which describes the image of the object produced by the converging lens?',
    o: [['Virtual, upright and enlarged', 'correct'], ['Real, inverted and enlarged', 'gives the image for an object between F and 2F'], ['Real, inverted and reduced', 'gives the image for an object beyond 2F'], ['Virtual, upright and reduced', 'gives the image formed by a diverging lens']],
    holds: ['checker ray_image_nature (type, orientation, size) compared with each option', ['virtual, upright, enlarged', 'real, inverted, enlarged', 'real, inverted, reduced', 'virtual, upright, reduced'].map(natureIs)],
    h: ['Locate the object relative to the focal point F on its side of the lens.', 'Sketch the ray parallel to the axis and the ray through the centre of the lens: do they meet after the lens, or spread apart?'],
    s: 'In the diagram the object stands between the lens and the focal point F. A ray parallel to the axis bends through the far focal point, and the ray through the centre goes straight on; on the far side they spread apart, so they must be traced back to meet on the object\'s side. The image is virtual, upright and enlarged.',
  },
  {
    t: 'describe the image from the rays reflected by a convex mirror', d: 2, need: 'reason',
    spec: ray({ element: 'convex_mirror', focalLength: 12, objectDistance: 18, showImage: false }),
    alt: 'A ray diagram: a convex mirror on a horizontal principal axis, with the points F and C marked behind it, and an upright object arrow in front of it on the left. Rays from the top of the object reflect off the mirror and spread apart; dashed lines continue the reflected rays behind the mirror. The image arrow is not drawn.',
    q: 'The ray diagram shows rays from the top of an object reflecting off a curved mirror; the dashed lines continue the reflected rays behind the mirror. The image is not drawn. Which describes the image?',
    o: [['Virtual, upright and reduced', 'correct'], ['Virtual, upright and enlarged', 'gives the image in a concave mirror for an object inside the focal length'], ['Real, inverted and reduced', 'takes the point where the dashed lines meet for a real crossing of rays'], ['Real, upright and reduced', 'reads the orientation and size correctly but calls an image behind a mirror real']],
    holds: ['checker ray_image_nature (type, orientation, size) compared with each option', ['virtual, upright, reduced', 'virtual, upright, enlarged', 'real, inverted, reduced', 'real, upright, reduced'].map(natureIs)],
    h: ['The reflected rays never meet in front of the mirror. Where do their backward extensions meet?', 'Compare that meeting point with the top of the object: same side of the axis or not, nearer the axis or further?'],
    s: 'The reflected rays spread apart, and only the dashed extensions meet, behind the mirror, so no light passes through the image point: the image is virtual. The meeting point is above the axis, like the top of the object, so the image is upright, and it is nearer the axis, so the image is reduced.',
  },
]);

const DIM2 = { objectDistance: 'value', focalLength: 'value' };
G('183b6442.lo-2', 'The thin-lens equation', [
  {
    t: 'image distance for a converging lens', d: 2, need: 'calc',
    spec: ray({ element: 'converging_lens', focalLength: 12, objectDistance: 36, rays: 'none', showImage: false, show: DIM2 }),
    alt: `${LENS_ALT} Dimension lines under the diagram give the object distance, 36 centimetres, and the focal length, 12 centimetres. No rays and no image are drawn.`,
    q: 'For the lens and object shown, how far from the lens is the image formed, in centimetres?',
    n: '18',
    ck: ['ray_image_distance', {}],
    h: ['Read the object distance and the focal length from the dimension lines.', 'Use 1/f = 1/d_o + 1/d_i and solve for d_i.'],
    s: 'The diagram gives d_o = 36 cm and f = 12 cm. Then 1/d_i = 1/12 − 1/36 = 3/36 − 1/36 = 2/36, so d_i = 18 cm on the far side of the lens.',
  },
  {
    t: 'signed image distance for a diverging lens', d: 3, need: 'calc',
    spec: ray({ element: 'diverging_lens', focalLength: 12, objectDistance: 24, rays: 'none', showImage: false, show: DIM2 }),
    alt: 'A ray diagram: a diverging lens on a horizontal principal axis, with the points F and 2F marked on both sides, and an upright object arrow on the left. Dimension lines give the object distance, 24 centimetres, and the size of the focal length, 12 centimetres. No rays and no image are drawn.',
    q: 'For the diverging lens and object shown, what is the image distance, in centimetres? Use the sign convention in which the focal length of a diverging lens and the distance to a virtual image are negative.',
    n: '-8',
    ck: ['ray_image_distance', {}],
    h: ['The diagram gives the size of the focal length; for a diverging lens it enters the equation as a negative number.', 'Solve 1/d_i = 1/f − 1/d_o and keep the sign of the result.'],
    s: 'The diagram gives d_o = 24 cm and a focal length of size 12 cm, so f = −12 cm for the diverging lens. Then 1/d_i = −1/12 − 1/24 = −3/24, so d_i = −8 cm: a virtual image 8 cm from the lens on the object\'s side.',
  },
]);

G('183b6442.lo-3', 'The mirror equation', [
  {
    t: 'image distance for a concave mirror', d: 2, need: 'calc',
    spec: ray({ element: 'concave_mirror', focalLength: 10, objectDistance: 15, rays: 'none', showImage: false, show: DIM2 }),
    alt: 'A ray diagram: a concave mirror on a horizontal principal axis, with the points F and C marked in front of it, and an upright object arrow between F and C. Dimension lines give the object distance, 15 centimetres, and the focal length, 10 centimetres. No rays and no image are drawn.',
    q: 'For the concave mirror and object shown, how far from the mirror is the image formed, in centimetres?',
    n: '30',
    ck: ['ray_image_distance', {}],
    h: ['Read the object distance and the focal length from the dimension lines.', 'Use 1/f = 1/d_o + 1/d_i and solve for d_i.'],
    s: 'The diagram gives d_o = 15 cm and f = 10 cm. Then 1/d_i = 1/10 − 1/15 = 3/30 − 2/30 = 1/30, so d_i = 30 cm in front of the mirror.',
  },
  {
    t: 'signed image distance for a convex mirror', d: 3, need: 'calc',
    spec: ray({ element: 'convex_mirror', focalLength: 20, objectDistance: 30, rays: 'none', showImage: false, show: DIM2 }),
    alt: 'A ray diagram: a convex mirror on a horizontal principal axis, with the points F and C marked behind it, and an upright object arrow in front of it. Dimension lines give the object distance, 30 centimetres, and the size of the focal length, 20 centimetres. No rays and no image are drawn.',
    q: 'For the convex mirror and object shown, what is the image distance, in centimetres? Use the sign convention in which the focal length of a convex mirror and the distance to a virtual image are negative.',
    n: '-12',
    ck: ['ray_image_distance', {}],
    h: ['The diagram gives the size of the focal length; for a convex mirror it enters the equation as a negative number.', 'Solve 1/d_i = 1/f − 1/d_o and keep the sign of the result.'],
    s: 'The diagram gives d_o = 30 cm and a focal length of size 20 cm, so f = −20 cm for the convex mirror. Then 1/d_i = −1/20 − 1/30 = −5/60, so d_i = −12 cm: a virtual image 12 cm behind the mirror.',
  },
]);

G('183b6442.lo-4', 'Magnification', [
  {
    t: 'image height from the lens equation and the magnification', d: 3, need: 'calc',
    spec: ray({ element: 'converging_lens', focalLength: 12, objectDistance: 18, objectHeight: 3, rays: 'none', showImage: false, show: { ...DIM2, objectHeight: 'value' } }),
    alt: `${LENS_ALT} The object stands between F and 2F. Labels give the object distance, 18 centimetres, the focal length, 12 centimetres, and the height of the object, 3 centimetres. No rays and no image are drawn.`,
    q: 'How tall is the image of the object shown, in centimetres? Give its size without a sign.',
    n: '6',
    ck: ['ray_image_height', {}],
    h: ['First find the image distance from the object distance and the focal length.', 'The ratio of image height to object height equals the ratio of image distance to object distance.'],
    s: 'The diagram gives d_o = 18 cm, f = 12 cm and an object 3 cm tall. 1/d_i = 1/12 − 1/18 = 1/36, so d_i = 36 cm. The magnification has size 36 ÷ 18 = 2, so the image is 2 × 3 = 6 cm tall (and inverted).',
  },
  {
    t: 'signed magnification from the two distances', d: 2, need: 'calc',
    spec: ray({ element: 'concave_mirror', focalLength: 10, objectDistance: 30, rays: 'none', showImage: false, show: { objectDistance: 'value', imageDistance: 'value' } }),
    alt: 'A ray diagram: a concave mirror on a horizontal principal axis, with the points F and C marked in front of it and an upright object arrow beyond C. Dimension lines give the object distance, 30 centimetres, and the image distance, 15 centimetres. No rays and no image are drawn.',
    q: 'The diagram shows the object distance and the image distance for a concave mirror; the image is real. What is the magnification?',
    o: [['−0.5', 'correct'], ['+0.5', 'drops the sign: the real image formed by a single mirror is inverted'], ['−2', 'divides the object distance by the image distance'], ['+2', 'inverts the ratio and also drops the sign']],
    ck: ['ray_magnification', {}],
    h: ['The magnification is m = −d_i/d_o, with a real image distance counted as positive.', 'Check the sign against what you know about real images formed by one mirror.'],
    s: 'The dimension lines give d_o = 30 cm and d_i = 15 cm, and the image is real, so d_i is positive. m = −d_i/d_o = −15/30 = −0.5: the image is inverted and half the size of the object.',
  },
]);

G('183b6442.lo-5', 'Real and virtual images', [
  {
    t: 'type and place of the image in a concave mirror', d: 2, need: 'reason',
    spec: ray({ element: 'concave_mirror', focalLength: 15, objectDistance: 6, rays: 'none', showImage: false }),
    alt: 'A ray diagram: a concave mirror on a horizontal principal axis, with the points F and C marked in front of it, and an upright object arrow standing between the mirror and F. No rays and no image are drawn.',
    q: 'No rays have been drawn in the diagram shown. Which describes the image of the object produced by the concave mirror?',
    o: [['Virtual, behind the mirror', 'correct'], ['Real, in front of the mirror', 'gives the image for an object further from the mirror than F'], ['Real, behind the mirror', 'places a real image where no reflected light can go'], ['Virtual, in front of the mirror', 'places a virtual image where the reflected rays actually travel']],
    holds: ['checker ray_image_nature {want: type} and the sign of checker ray_image_distance (negative = behind the mirror)', ([['virtual', true], ['real', false], ['real', true], ['virtual', false]] as Array<[string, boolean]>).map(([type, behind]) => (c: Ctx) => c.txt('ray_image_nature', { want: 'type' }) === type && (c.num('ray_image_distance') < 0) === behind)],
    h: ['Locate the object relative to the focal point F.', 'A concave mirror acts like a shaving mirror when the object is closer to it than F.'],
    s: 'In the diagram the object stands between the mirror and its focal point F. The reflected rays then spread apart and never meet in front of the mirror; their extensions meet behind it. The image is virtual and lies behind the mirror.',
  },
  {
    t: 'decide from the numbers whether the image can be caught on a screen', d: 3, need: 'reason',
    spec: ray({ element: 'converging_lens', focalLength: 20, objectDistance: 12, rays: 'none', showImage: false, focalMarks: false, show: DIM2 }),
    alt: 'A ray diagram: a converging lens on a horizontal principal axis with an upright object arrow on its left. Dimension lines give the object distance, 12 centimetres, and the focal length, 20 centimetres. No rays, focal points or image are drawn.',
    q: 'A screen can be placed anywhere to the right of the converging lens shown. Can a sharp image of the object be formed on the screen?',
    o: [['No; the image is virtual', 'correct'], ['Yes; the image is real and inverted', 'assumes a converging lens always forms a real image'], ['Yes; the image is real and upright', 'assumes a real image and keeps the orientation of the object'], ['No; no image of any kind is formed', 'confuses this case with an object exactly at the focal point']],
    holds: ['checker ray_image_nature (type, orientation) and the kind\'s model (whether an image exists)', [
      (c) => c.txt('ray_image_nature', { want: 'type' }) === 'virtual',
      (c) => c.txt('ray_image_nature', { want: 'type' }) === 'real' && c.txt('ray_image_nature', { want: 'orientation' }) === 'inverted',
      (c) => c.txt('ray_image_nature', { want: 'type' }) === 'real' && c.txt('ray_image_nature', { want: 'orientation' }) === 'upright',
      (c) => !Number.isFinite(optM(c).dI),
    ]],
    h: ['Compare the object distance with the focal length, both given on the dimension lines.', 'Only a real image, where rays actually meet, can be caught on a screen.'],
    s: 'The dimension lines give d_o = 12 cm and f = 20 cm, so the object is inside the focal length. Then 1/d_i = 1/20 − 1/12 is negative (d_i = −30 cm): the image is virtual, on the same side as the object. No rays meet to the right of the lens, so no image can be formed on the screen.',
  },
]);

// ── Physics · Reflection and Snell's Law ────────────────────────────────────
G('bf29e966.lo-3', 'Snell\'s law', [
  {
    t: 'angle of refraction on entering glass', d: 2, need: 'calc',
    spec: ray({ element: 'interface', n1: 1.0, n2: 1.5, incidentAngle: 40, media: ['air', 'glass'], angleLabels: { incident: 'auto', refracted: '?' } }),
    alt: 'A ray diagram: a horizontal boundary with air above (n = 1.00) and glass below (n = 1.50) and a dashed normal. An incident ray arrives from the upper left at 40 degrees to the normal; the refracted ray continues into the glass, and its angle from the normal is marked with a question mark.',
    q: 'A ray of light passes from air into glass as shown. What is the angle of refraction, marked with a question mark, to the nearest tenth of a degree?',
    n: '25.4',
    ck: ['ray_snell', { want: 'refraction_angle' }],
    h: ['Read the two refractive indices and the angle of incidence from the diagram.', 'Apply n₁ sin θ₁ = n₂ sin θ₂ and take the inverse sine.'],
    s: 'The diagram gives n₁ = 1.00, n₂ = 1.50 and θ₁ = 40°. Then sin θ₂ = (1.00 × sin 40°) ÷ 1.50 = 0.6428 ÷ 1.50 = 0.4285, so θ₂ = 25.4°.',
  },
  {
    t: 'refractive index from the two angles', d: 3, need: 'calc',
    spec: ray({ element: 'interface', n1: 1.0, n2: 1.5, incidentAngle: 45, media: ['air', 'liquid'], show: { n1: 'value', n2: 'blank' }, angleLabels: { incident: 'auto', refracted: 'auto' } }),
    alt: 'A ray diagram: a horizontal boundary with air above (n = 1.00) and a liquid below, whose index is replaced by a question mark, and a dashed normal. The incident ray makes 45 degrees with the normal and the refracted ray makes 28.1 degrees with the normal.',
    q: 'A ray of light passes from air into a transparent liquid, with the angles shown. What is the refractive index of the liquid?',
    o: [['1.50', 'correct'], ['0.67', 'inverts the ratio of the sines'], ['1.60', 'uses the ratio of the angles instead of the ratio of their sines'], ['1.33', 'recalls the index of water instead of using the angles']],
    ck: ['ray_snell', { want: 'n2' }],
    h: ['Read the angle of incidence and the angle of refraction, both measured from the normal.', 'Rearrange n₁ sin θ₁ = n₂ sin θ₂ for n₂.'],
    s: 'The diagram gives θ₁ = 45° in air (n₁ = 1.00) and θ₂ = 28.1° in the liquid. n₂ = n₁ sin θ₁ ÷ sin θ₂ = 0.7071 ÷ 0.4710 = 1.50.',
  },
]);

G('bf29e966.lo-5', 'Critical angle', [
  {
    t: 'critical angle from the two indices', d: 2, need: 'calc',
    spec: ray({ element: 'interface', n1: 1.5, n2: 1.0, incidentAngle: 25, media: ['glass', 'air'], angleLabels: { incident: null } }),
    alt: 'A ray diagram: a horizontal boundary with glass above (n = 1.50) and air below (n = 1.00) and a dashed normal. A ray in the glass arrives from the upper left and a refracted ray leaves into the air, bent away from the normal. No angles are labelled.',
    q: 'Light travels from the glass toward the air in the arrangement shown. What is the critical angle for this boundary, to the nearest tenth of a degree?',
    n: '41.8',
    ck: ['ray_snell', { want: 'critical_angle' }],
    h: ['At the critical angle the refracted ray runs along the boundary, at 90° to the normal.', 'Set θ₂ = 90° in Snell\'s law, with the indices read from the diagram.'],
    s: 'The diagram gives n₁ = 1.50 for the glass and n₂ = 1.00 for the air. At the critical angle sin θc = n₂ ÷ n₁ = 1.00 ÷ 1.50 = 0.667, so θc = 41.8°.',
  },
]);

G('bf29e966.lo-4', 'Total internal reflection', [
  {
    t: 'decide whether the ray drawn is totally reflected', d: 3, need: 'calc',
    spec: ray({ element: 'interface', n1: 1.33, n2: 1.0, incidentAngle: 45, media: ['water', 'air'], refracted: false, reflected: false, angleLabels: { incident: 'auto' } }),
    alt: 'A ray diagram: a horizontal boundary with water above (n = 1.33) and air below (n = 1.00) and a dashed normal. A ray in the water arrives from the upper left at 45 degrees to the normal. Nothing is drawn beyond the point where the ray meets the boundary.',
    q: 'A ray of light in water strikes the boundary with air as shown; what happens beyond the point of incidence is not drawn. Apart from a weak partial reflection, what happens to the light at the boundary?',
    o: [['It passes into the air, bending away from the normal', 'correct'], ['It is totally reflected back into the water', 'assumes total internal reflection without comparing the angle of incidence with the critical angle'], ['It passes into the air, bending toward the normal', 'bends the ray as if it entered a medium of higher index'], ['It passes into the air without changing direction', 'ignores the difference between the two indices']],
    holds: ['the kind\'s model (Snell\'s law on the spec): whether a refracted ray exists, and which way it bends', [
      (c) => ifM(c).theta2 !== null && (ifM(c).theta2 as number) > ifM(c).theta1,
      (c) => ifM(c).theta2 === null,
      (c) => ifM(c).theta2 !== null && (ifM(c).theta2 as number) < ifM(c).theta1,
      (c) => ifM(c).theta2 !== null && near(ifM(c).theta2 as number, ifM(c).theta1),
    ]],
    h: ['Work out the critical angle for light going from water to air, using the indices in the diagram.', 'Compare the angle of incidence marked in the diagram with that critical angle.'],
    s: 'From the diagram, n₁ = 1.33 and n₂ = 1.00, so sin θc = 1.00 ÷ 1.33 = 0.752 and θc = 48.8°. The marked angle of incidence, 45°, is smaller than the critical angle, so the light is not totally reflected: it is refracted into the air, where the index is lower, bending away from the normal (sin θ₂ = 1.33 × sin 45° = 0.940, θ₂ = 70°).',
  },
]);

// ── Physics · Bohr Model and Atomic Spectra ─────────────────────────────────
const lines = (rows: Array<[string, number[]]>): Spec => S('spectrum', { variant: 'lines', rows: rows.map(([label, ls]) => ({ label, lines: ls })) });
G('0938830f.lo-5', 'Line spectra and transitions', [
  {
    t: 'identify the elements in a mixture from its emission lines', d: 2, need: 'reason',
    spec: lines([['Gas mixture', [410, 434, 486, 589, 656]], ['Hydrogen', [410, 434, 486, 656]], ['Lithium', [460, 610, 671]], ['Sodium', [589]]]),
    alt: 'Four line spectra drawn as horizontal strips over one wavelength axis from 400 to 700 nanometres. The top strip, labelled Gas mixture, has five lines; the strips below are labelled Hydrogen (four lines), Lithium (three lines) and Sodium (one line).',
    q: 'The top strip shown is the emission spectrum of a glowing gas mixture; the strips below it are the emission spectra of three elements. Which elements does the mixture contain?',
    o: [['Hydrogen and sodium', 'correct'], ['Hydrogen and lithium', 'matches the red hydrogen line of the mixture to the nearby red lithium line'], ['Lithium and sodium', 'matches by the number of lines instead of by their positions'], ['Hydrogen only', 'overlooks the one line of the mixture that hydrogen does not have']],
    holds: ['checker spectrum_lines_present {row: 0}: the strips whose lines are all present in the top strip', ['Hydrogen, Sodium', 'Hydrogen, Lithium', 'Lithium, Sodium', 'Hydrogen'].map((want) => (c: Ctx) => c.txt('spectrum_lines_present', { row: 0 }) === want)],
    h: ['Each element emits its own fixed set of wavelengths.', 'An element is present only if every one of its lines appears at the same position in the spectrum of the mixture.'],
    s: 'Reading down from each line of the mixture: its lines near 410, 434, 486 and 656 nm line up with the four hydrogen lines, and its line near 589 nm lines up with the sodium line. None of the lithium lines (near 460, 610 and 671 nm) appears in the mixture. The mixture contains hydrogen and sodium.',
  },
  {
    t: 'pick the emission line of the largest energy transition', d: 2, need: 'reason',
    spec: lines([['Hydrogen', [410, 434, 486, 656]]]),
    alt: 'A line spectrum drawn as one horizontal strip, labelled Hydrogen, over a wavelength axis from 400 to 700 nanometres. Four lines are drawn on the strip: three in the left half of the axis and one toward the right.',
    q: 'The strip shown is the visible emission spectrum of hydrogen. Every line is produced by electrons falling to the n = 2 level from a higher level. Which line is produced by the transition that releases the most energy?',
    o: [['The line near 410 nm', 'correct'], ['The line near 656 nm', 'takes a longer wavelength to mean a higher photon energy'], ['The line near 486 nm', 'picks the line nearest the middle of the visible range'], ['The line near 434 nm', 'picks the second line from the short-wavelength end']],
    holds: ['the kind\'s model: the shortest wavelength on the strip (E = hc/λ is largest there)', [410, 656, 486, 434].map((nm) => (c: Ctx) => { const m = specM(c); return m.variant === 'lines' && Math.min(...m.rows[0].lines) === nm; })],
    h: ['The energy of a photon is E = hc/λ.', 'Find the line with the shortest wavelength on the axis.'],
    s: 'Photon energy is E = hc/λ, so the largest energy goes with the shortest wavelength. On the strip the line furthest to the left, near 410 nm, has the shortest wavelength, so it comes from the transition that releases the most energy (from the highest of the starting levels).',
  },
]);

// ── AP Biology · Phylogenetic Trees and Cladograms ──────────────────────────
const VERT = (traits: boolean): unknown => {
  const t = (name: string) => (traits ? { traits: [name] } : {});
  return { children: ['Lancelet', { ...t('vertebral column'), children: ['Lamprey', { ...t('hinged jaws'), children: ['Bass', { ...t('four limbs'), children: ['Frog', { ...t('amnion'), children: ['Turtle', traits ? { name: 'Leopard', traits: ['hair'] } : 'Leopard'] }] }] }] }] };
};
const PRIMATES = { children: ['Gibbon', { children: ['Orangutan', { children: ['Gorilla', { children: ['Human', { children: ['Chimpanzee', 'Bonobo'] }] }] }] }] };
const AMNIOTES = { node: 'A', children: ['Frog', { node: 'B', children: [{ node: 'C', children: ['Platypus', { children: ['Kangaroo', 'Mouse'] }] }, { node: 'E', children: [{ children: ['Lizard', 'Snake'] }, { children: ['Crocodile', 'Hawk'] }] }] }] };
const PLANTS = { children: ['Charophyte algae', { traits: ['embryo'], children: ['Mosses', { traits: [{ label: 'vascular tissue', blank: true }], children: ['Ferns', { traits: ['seeds'], children: ['Conifers', { name: 'Flowering plants', traits: ['flowers'] }] }] }] }] };
const ALT_PRIM = 'A cladogram with the root on the left and six tips in a column on the right, from top to bottom: Gibbon, Orangutan, Gorilla, Human, Chimpanzee, Bonobo. Each branch point splits one tip, or the last pair, from the rest. No traits or node labels are shown.';
const ALT_AMN = 'A cladogram with the root on the left and eight tips in a column on the right, from top to bottom: Frog, Platypus, Kangaroo, Mouse, Lizard, Snake, Crocodile, Hawk. Four of the seven branch points are labelled with letters: A at the root, then B, and C and E on the two branches that leave B.';
const ALT_VERT = 'A cladogram with the root on the left and six tips in a column on the right, from top to bottom: Lancelet, Lamprey, Bass, Frog, Turtle, Leopard. Each branch point splits one tip from the rest.';
const closer = (c: Ctx, taxon: string, a: string, b: string): string => c.txt('phylo_closer_relative', { taxon, a, b });
const hasDescendant = (c: Ctx, tip: string, other: string): boolean => { const n = phM(c).tips.find((x) => x.name === tip) as PhyloNode; return n.children.length > 0 && n.tips.includes(other); };

G('42e27041.lo-1', 'What a cladogram shows', [
  {
    t: 'choose the statement a cladogram supports', d: 2, need: 'reason',
    spec: tree(PRIMATES), alt: ALT_PRIM,
    q: 'Which statement is supported by the cladogram shown?',
    o: [['Humans are more closely related to bonobos than to gorillas', 'correct'], ['Gorillas are more closely related to orangutans than to humans', 'reads tips drawn next to each other as closest relatives'], ['Chimpanzees evolved from gorillas', 'reads the tree as a ladder in which one living species is the ancestor of another'], ['Gibbons are the ancestors of the other five apes', 'takes the first lineage to branch off for the ancestor of the rest']],
    holds: ['checker phylo_closer_relative for the two comparisons; a tip of the kind\'s tree has no descendants', [
      (c) => closer(c, 'Human', 'Bonobo', 'Gorilla') === 'Bonobo',
      (c) => closer(c, 'Gorilla', 'Orangutan', 'Human') === 'Orangutan',
      (c) => hasDescendant(c, 'Gorilla', 'Chimpanzee'),
      (c) => hasDescendant(c, 'Gibbon', 'Human'),
    ]],
    h: ['Relatedness is read from how recently two tips share a branch point, not from how close together the tips are drawn.', 'Every tip is a living group; ancestors are the branch points inside the tree.'],
    s: 'Tracing back from the human, the first branch point reached is shared with the chimpanzee and the bonobo; the gorilla joins only at an earlier branch point. So humans share a more recent common ancestor with bonobos than with gorillas. The other statements treat living tips as ancestors or read relatedness from the order of the tips.',
  },
  {
    t: 'recognise which group is a clade', d: 3, need: 'reason',
    spec: tree(AMNIOTES), alt: ALT_AMN,
    q: 'A clade is a common ancestor together with all of its descendants. Which of these groups is a clade on the cladogram shown?',
    o: [['Lizard, snake, crocodile and hawk', 'correct'], ['Lizard, snake and crocodile', 'leaves out one descendant of the group\'s own common ancestor'], ['Frog, lizard and snake', 'groups animals by similar body plan instead of by a shared branch point'], ['Platypus, lizard and snake', 'groups the egg-laying animals, whose common ancestor has many other descendants']],
    holds: ['checker phylo_monophyletic for each listed group', [['Lizard', 'Snake', 'Crocodile', 'Hawk'], ['Lizard', 'Snake', 'Crocodile'], ['Frog', 'Lizard', 'Snake'], ['Platypus', 'Lizard', 'Snake']].map((taxa) => (c: Ctx) => c.txt('phylo_monophyletic', { taxa }) === 'yes')],
    h: ['For each group, find the branch point where all its members first come together.', 'Then check whether every tip that descends from that branch point is in the group.'],
    s: 'The lizard, snake, crocodile and hawk first come together at node E, and those four are the only tips that descend from E, so they form a clade. The lizard, snake and crocodile also meet at E but leave out the hawk; the other two groups meet at nodes A and B, which have many more descendants.',
  },
  {
    t: 'name the sister group of a tip', d: 2, need: 'reason',
    spec: tree(AMNIOTES), alt: ALT_AMN,
    q: 'On the cladogram shown, which is the sister group of the platypus, that is, the group that shares its most recent common ancestor?',
    o: [['The kangaroo and the mouse together', 'correct'], ['The frog', 'picks the tip drawn next to the platypus'], ['The kangaroo alone', 'takes only the nearest tip of the other branch instead of the whole branch'], ['The lizard, snake, crocodile and hawk together', 'goes one branch point too far back toward the root']],
    holds: ['checker phylo_sister {taxon: Platypus} compared with the tips each option names', ['Kangaroo, Mouse', 'Frog', 'Kangaroo', 'Lizard, Snake, Crocodile, Hawk'].map((want) => (c: Ctx) => c.txt('phylo_sister', { taxon: 'Platypus' }) === want)],
    h: ['Find the branch point nearest to the platypus.', 'The sister group is everything on the other branch that leaves that same branch point.'],
    s: 'The branch leading to the platypus leaves node C. The other branch from node C leads on to the kangaroo and the mouse. The sister group of the platypus is therefore the kangaroo and the mouse together.',
  },
]);

G('42e27041.lo-2', 'Shared derived characters', [
  {
    t: 'find the derived trait shared by a stated set of tips', d: 2, need: 'reason',
    spec: tree(VERT(true), { outgroup: 'Lancelet', traitStyle: 'key' }),
    alt: `${ALT_VERT} The lancelet is marked as the outgroup. Numbered tick marks on five branches show where derived traits arose; a key under the tree names each one, from a vertebral column (the mark nearest the root) to hair (on the branch to the leopard).`,
    q: 'According to the cladogram shown, which derived trait is shared by the frog, the turtle and the leopard but is absent in the bass?',
    o: [['Four limbs', 'correct'], ['Hinged jaws', 'picks a trait whose tick mark lies before the branch to the bass, so the bass has it too'], ['Amnion', 'picks a trait that arose after the frog branched off'], ['Vertebral column', 'picks the trait shared by the largest number of tips']],
    holds: ['checker phylo_shared_trait for each trait: the tips that have it are exactly Frog, Turtle, Leopard', ['four limbs', 'hinged jaws', 'amnion', 'vertebral column'].map((trait) => (c: Ctx) => c.txt('phylo_shared_trait', { trait }) === 'Frog, Turtle, Leopard')],
    h: ['A tick mark shows where a trait arose; every tip beyond that mark has the trait.', 'Find the mark that lies after the branch to the bass but before the branch to the frog.'],
    s: 'The tick mark for four limbs lies on the branch after the bass has split off and before the frog splits off, so the frog, the turtle and the leopard all have four limbs and the bass does not. Hinged jaws arose before the bass branched off, and the amnion arose after the frog branched off.',
  },
  {
    t: 'supply the derived trait missing from a tick mark', d: 3, need: 'reason',
    spec: tree(PLANTS, { traitStyle: 'label' }),
    alt: 'A cladogram with the root on the left and five tips in a column on the right, from top to bottom: Charophyte algae, Mosses, Ferns, Conifers, Flowering plants. Tick marks on the branches name derived traits: embryo, seeds and flowers; one further tick mark, on the branch after the mosses split off, is labelled with a question mark.',
    q: 'One derived trait on the cladogram of plant groups shown is replaced by a question mark. Which trait belongs there?',
    o: [['Vascular tissue', 'correct'], ['Seeds', 'names a trait already marked further along, which ferns lack'], ['Flowers', 'names the trait of the last tip only'], ['Chloroplasts', 'names an ancestral trait that the algae at the base of the tree also have']],
    ck: ['phylo_blank', { what: 'trait' }],
    h: ['List the tips that lie beyond the tick mark with the question mark, and the tips that branch off before it.', 'Look for a trait that all of the first set have and none of the second.'],
    s: 'The tick mark with the question mark lies after the mosses branch off, so the trait is shared by ferns, conifers and flowering plants but not by mosses or algae. Those three groups all have vascular tissue (xylem and phloem), which mosses lack. Seeds are marked later and are absent in ferns.',
  },
]);

G('42e27041.lo-3', 'Reading relatedness', [
  {
    t: 'closest relative of one tip among four', d: 2, need: 'reason',
    spec: tree(VERT(false)),
    alt: `${ALT_VERT} No traits or node labels are shown.`,
    q: 'According to the cladogram shown, which of the following shares the most recent common ancestor with the frog?',
    o: [['The leopard', 'correct'], ['The bass', 'picks the tip drawn next to the frog'], ['The lamprey', 'takes a lineage that branched off earlier to be a closer relative'], ['The lancelet', 'picks the tip nearest the root']],
    holds: ['the kind\'s tree: the common ancestor of the frog and the named tip is strictly more recent than for each of the other three', ['Leopard', 'Bass', 'Lamprey', 'Lancelet'].map((x) => (c: Ctx) => ['Leopard', 'Bass', 'Lamprey', 'Lancelet'].filter((y) => y !== x).every((y) => recency(c, ['Frog', x]) > recency(c, ['Frog', y])))],
    h: ['For each animal, trace back from it and from the frog until the two paths meet.', 'The meeting point furthest from the root is the most recent common ancestor.'],
    s: 'The paths from the frog and the leopard meet at the branch point just before the frog splits off. The path from the bass meets the frog\'s one branch point earlier, the lamprey\'s two earlier and the lancelet\'s at the root. The leopard therefore shares the most recent common ancestor with the frog, although the bass is drawn next to it.',
  },
  {
    t: 'pick the pair with the most recent common ancestor', d: 3, need: 'reason',
    spec: tree(AMNIOTES), alt: ALT_AMN,
    q: 'Which of these pairs of animals on the cladogram shown shares the most recent common ancestor?',
    o: [['Crocodile and hawk', 'correct'], ['Snake and crocodile', 'picks two tips that are drawn next to each other'], ['Lizard and hawk', 'picks animals from the two halves of one larger group'], ['Mouse and lizard', 'picks two animals that are similar in size and habit']],
    holds: ['the kind\'s tree: the common ancestor of the named pair is a descendant of (more recent than) the common ancestor of each other pair', [['Crocodile', 'Hawk'], ['Snake', 'Crocodile'], ['Lizard', 'Hawk'], ['Mouse', 'Lizard']].map((pair, i, all) => (c: Ctx) => all.filter((_, k) => k !== i).every((other) => {
      const mine = mrcaOf(phM(c), pair);
      const theirs = mrcaOf(phM(c), other);
      return mine !== theirs && mine.tips.every((t) => theirs.tips.includes(t)) && recency(c, pair) > recency(c, other);
    }))],
    h: ['Find the branch point where the two members of each pair first come together.', 'A branch point that descends from another branch point is the more recent of the two.'],
    s: 'The crocodile and the hawk meet at the unlabelled branch point just before the two tips. The snake and the crocodile, and the lizard and the hawk, meet only further back, at node E, and the mouse and the lizard at node B. The branch point of the crocodile and the hawk descends from E, which descends from B, so it is the most recent: the crocodile and the hawk share the most recent common ancestor.',
  },
  {
    t: 'compare one tip with two members of its sister clade', d: 3, need: 'reason',
    spec: tree(PRIMATES), alt: ALT_PRIM,
    q: 'According to the cladogram shown, how is the gorilla related to the human and to the chimpanzee?',
    o: [['Equally closely related to both', 'correct'], ['More closely related to the human', 'reads the tip drawn next to the gorilla as its closest relative'], ['More closely related to the chimpanzee', 'groups the two by appearance instead of by branch points'], ['Not related to either', 'thinks only tips that are joined directly at one branch point are related']],
    holds: ['the kind\'s tree: how recent the common ancestor of the gorilla and the human is, compared with that of the gorilla and the chimpanzee', [
      (c) => recency(c, ['Gorilla', 'Human']) === recency(c, ['Gorilla', 'Chimpanzee']),
      (c) => recency(c, ['Gorilla', 'Human']) > recency(c, ['Gorilla', 'Chimpanzee']),
      (c) => recency(c, ['Gorilla', 'Human']) < recency(c, ['Gorilla', 'Chimpanzee']),
      (c) => phM(c).tips.every((t) => t.name !== 'Gorilla'),
    ]],
    h: ['Find the branch point where the gorilla\'s path meets the human\'s path, and the one where it meets the chimpanzee\'s path.', 'If the two meeting points are the same branch point, the gorilla is equally related to both.'],
    s: 'The gorilla\'s branch leaves a branch point whose other branch leads to the human, the chimpanzee and the bonobo together. Tracing back from the human or from the chimpanzee, the gorilla\'s path is met at that same branch point. The gorilla therefore shares the same common ancestor with both and is equally closely related to both.',
  },
]);

G('42e27041.lo-4', 'Common ancestors and divergence', [
  {
    t: 'most recent common ancestor of two tips', d: 2, need: 'read',
    spec: tree(AMNIOTES), alt: ALT_AMN,
    q: 'Which labelled node on the cladogram shown represents the most recent common ancestor of the kangaroo and the snake?',
    o: [['Node B', 'correct'], ['Node A', 'goes all the way back to the root'], ['Node C', 'stops at the ancestor of the platypus, kangaroo and mouse only'], ['Node E', 'stops at the ancestor of the lizard, snake, crocodile and hawk only']],
    ck: ['phylo_mrca', { taxa: ['Kangaroo', 'Snake'] }],
    h: ['Trace back toward the root from each of the two animals.', 'The first node that lies on both paths is their most recent common ancestor.'],
    s: 'From the kangaroo the path runs back through node C and then node B; from the snake it runs back through node E and then node B. The first node on both paths is B, so node B is the most recent common ancestor of the kangaroo and the snake.',
  },
  {
    t: 'list all descendants of a labelled node', d: 2, need: 'read',
    spec: tree(AMNIOTES), alt: ALT_AMN,
    q: 'Which lists all the animals on the cladogram shown that are descended from the ancestor at node C?',
    o: [['Platypus, kangaroo and mouse', 'correct'], ['Kangaroo and mouse', 'lists the descendants of the next branch point along only'], ['Platypus, kangaroo, mouse and lizard', 'adds the first tip of the neighbouring branch'], ['Platypus only', 'takes only the tip that branches off directly at the node']],
    holds: ['the kind\'s tree: the tips under the node labelled C, compared with each list', [['Platypus', 'Kangaroo', 'Mouse'], ['Kangaroo', 'Mouse'], ['Platypus', 'Kangaroo', 'Mouse', 'Lizard'], ['Platypus']].map((list) => (c: Ctx) => sameSet((phM(c).internals.find((n) => n.node === 'C') as PhyloNode).tips, list))],
    h: ['Start at node C and follow every branch that leads away from the root.', 'Include the tips reached through later nodes as well.'],
    s: 'Two branches leave node C toward the tips: one leads straight to the platypus, the other to a further branch point, which splits into the kangaroo and the mouse. All three tips descend from the ancestor at node C: platypus, kangaroo and mouse.',
  },
  {
    t: 'order of divergence from one lineage', d: 2, need: 'reason',
    spec: tree(PRIMATES), alt: ALT_PRIM,
    q: 'Tracing back from the human toward the root of the cladogram shown, which of these lineages branched off from the human lineage earliest?',
    o: [['The gibbon', 'correct'], ['The chimpanzee', 'takes the most recent split for the earliest'], ['The gorilla', 'picks the tip drawn next to the human'], ['The orangutan', 'stops one branch point short of the root']],
    holds: ['the kind\'s tree: the common ancestor of the human and the named tip is strictly the least recent of the four', ['Gibbon', 'Chimpanzee', 'Gorilla', 'Orangutan'].map((x) => (c: Ctx) => ['Gibbon', 'Chimpanzee', 'Gorilla', 'Orangutan'].filter((y) => y !== x).every((y) => recency(c, ['Human', x]) < recency(c, ['Human', y])))],
    h: ['The earliest divergence is the branch point nearest the root.', 'Follow the human\'s path back to the root and note which lineage leaves at each branch point.'],
    s: 'Going back from the human, the first branch point is shared with the chimpanzee and bonobo, the next with the gorilla, the next with the orangutan, and the last one, at the root, with the gibbon. The split nearest the root is the earliest, so the gibbon lineage branched off first.',
  },
]);

// ── AP Biology · Energy Flow Through Ecosystems ─────────────────────────────
const web = (nodes: Array<[string, number, number]>, edges: Array<[string, string]>): Spec => flow('web', { nodes: nodes.map(([label, col, row]) => ({ id: label, label, col, row })), edges: edges.map(([from, to]) => ({ from, to })) });
const pyramid = (levels: Array<[string, number | undefined, string]>, extra: P = {}): Spec => flow('pyramid', { levels: levels.map(([label, value, show]) => ({ label, ...(value === undefined ? {} : { value }), show })), unit: 'kJ', ...extra });
G('4c5ca766.lo-2', 'Trophic levels in chains and webs', [
  {
    t: 'trophic level of a consumer in a food web', d: 2, need: 'read',
    spec: web([['Hawk', 0, 0], ['Snake', 0, 1], ['Frog', 0, 2], ['Fox', 2, 2], ['Grasshopper', 0, 3], ['Rabbit', 2, 3], ['Grass', 1, 4]], [['Grass', 'Grasshopper'], ['Grass', 'Rabbit'], ['Grasshopper', 'Frog'], ['Frog', 'Snake'], ['Snake', 'Hawk'], ['Rabbit', 'Fox']]),
    alt: 'A food web drawn as boxes joined by arrows that point from the organism eaten to the organism that eats it. Grass is at the bottom; arrows lead from grass to grasshopper and to rabbit, from grasshopper to frog, from frog to snake, from snake to hawk, and from rabbit to fox.',
    q: 'In the food web shown, the producers are trophic level 1. At which trophic level does the snake feed? Give the number of the level.',
    n: '4',
    ck: ['flow_trophic_level', { node: 'Snake' }],
    h: ['An arrow points from the organism that is eaten to the organism that eats it.', 'Count the steps along the arrows from the producer up to the snake; each step adds one level.'],
    s: 'Following the arrows: grass (level 1) is eaten by the grasshopper (level 2), which is eaten by the frog (level 3), which is eaten by the snake. The snake therefore feeds at trophic level 4, as a tertiary consumer.',
  },
  {
    t: 'find the consumer that feeds at two trophic levels', d: 3, need: 'reason',
    spec: web([['Bear', 1, 0], ['Trout', 0, 1], ['Wolf', 2, 1], ['Insects', 0, 2], ['Deer', 2, 2], ['Plants', 1, 3]], [['Plants', 'Insects'], ['Plants', 'Deer'], ['Insects', 'Trout'], ['Deer', 'Wolf'], ['Trout', 'Bear'], ['Plants', 'Bear']]),
    alt: 'A food web drawn as boxes joined by arrows that point from the organism eaten to the organism that eats it. Plants are at the bottom; arrows lead from plants to insects, to deer and to bear, from insects to trout, from trout to bear, and from deer to wolf.',
    q: 'Which organism in the food web shown feeds at more than one trophic level?',
    o: [['The bear', 'correct'], ['The wolf', 'picks a top predator without tracing the arrows that reach it'], ['The trout', 'counts the arrow that leaves the box as a second food source'], ['The deer', 'picks a consumer that shares its food with another consumer']],
    holds: ['checker flow_trophic_level for each organism: more than one level reaches it', ['Bear', 'Wolf', 'Trout', 'Deer'].map((node) => (c: Ctx) => c.run('flow_trophic_level', { node }).kind === 'numbers')],
    h: ['Look for a box with arrows arriving from organisms at different levels.', 'Work out the level the organism has along each food chain that reaches it.'],
    s: 'Two arrows arrive at the bear: one directly from the plants, which makes it a primary consumer (level 2), and one from the trout, which feed on insects that feed on plants, making the bear a tertiary consumer (level 4). Every other consumer is reached along one chain only, so the bear is the organism that feeds at more than one level.',
  },
]);

G('4c5ca766.lo-3', 'The 10 percent rule', [
  {
    t: 'energy three levels above a given level', d: 2, need: 'calc',
    spec: pyramid([['Producers', 50000, 'value'], ['Primary consumers', 5000, 'none'], ['Secondary consumers', 500, 'none'], ['Tertiary consumers', 50, 'blank']]),
    alt: 'An energy pyramid of four stacked bars, widest at the bottom, labelled from the bottom up: Producers, Primary consumers, Secondary consumers, Tertiary consumers. An energy value in kilojoules is printed beside the producers only; a question mark stands beside the top bar.',
    q: 'The pyramid shown gives the energy stored by the producers of an ecosystem in one year. If 10% of the energy at each trophic level passes to the next level, how much energy reaches the tertiary consumers, in kJ?',
    n: '50',
    ck: ['flow_energy_at_level', { level: 3 }],
    h: ['Each step up the pyramid keeps one tenth of the energy of the level below.', 'Count the number of steps from the producers to the level asked about.'],
    s: 'The producers store 50 000 kJ. Three transfers separate them from the tertiary consumers, each passing on 10%: 50 000 → 5 000 → 500 → 50. The tertiary consumers receive 50 kJ.',
  },
  {
    t: 'work back down the pyramid to the producers', d: 3, need: 'calc',
    spec: pyramid([['Producers', 24000, 'blank'], ['Primary consumers', 2400, 'none'], ['Secondary consumers', 240, 'value'], ['Tertiary consumers', 24, 'none']]),
    alt: 'An energy pyramid of four stacked bars, widest at the bottom, labelled from the bottom up: Producers, Primary consumers, Secondary consumers, Tertiary consumers. An energy value in kilojoules is printed beside the secondary consumers only; a question mark stands beside the bottom bar.',
    q: 'In the energy pyramid shown, only the energy that reaches the secondary consumers in one year is given. If 10% of the energy at each trophic level passes to the next level, how much energy did the producers store, in kJ?',
    n: '24000',
    ck: ['flow_energy_at_level', { level: 0 }],
    h: ['Going down the pyramid, each level holds ten times the energy of the level above it.', 'Count the number of steps from the secondary consumers down to the producers.'],
    s: 'The secondary consumers receive 240 kJ. The primary consumers, one level down, must hold ten times as much, 2 400 kJ, and the producers ten times as much again: 24 000 kJ.',
  },
]);

G('4c5ca766.lo-5', 'Why food chains are short', [
  {
    t: 'number of trophic levels an energy budget can support', d: 3, need: 'calc',
    spec: pyramid([['Producers', 8000, 'value'], ['Primary consumers', 800, 'value']]),
    alt: 'An energy pyramid of two stacked bars, widest at the bottom, labelled Producers and Primary consumers. An energy value in kilojoules is printed beside each bar; the upper value is one tenth of the lower.',
    q: 'The pyramid shown gives the energy available each year to the producers and the primary consumers of a small ecosystem. Each further trophic level receives 10% of the energy of the level below it, and a level can persist only if it receives at least 5 kJ per year. What is the largest number of trophic levels this ecosystem can support?',
    n: '4',
    calc: ['the kind\'s model: starting from the printed producer value, the number of levels whose energy (one tenth per step) is at least 5 kJ', (c) => {
      const m = c.model(flowModel);
      let e = m.levels[0].value as number;
      let levels = 0;
      while (e >= 5) { levels += 1; e /= 10; }
      return levels;
    }],
    h: ['Continue the pattern of the two values shown: each new level gets one tenth of the one below.', 'Stop at the last level that still receives at least 5 kJ, and count the levels including the producers.'],
    s: 'The pyramid shows 8 000 kJ for the producers and 800 kJ for the primary consumers. Continuing, secondary consumers get 80 kJ and tertiary consumers 8 kJ, which is still at least 5 kJ. A fifth level would get only 0.8 kJ, too little to persist. The ecosystem can support 4 trophic levels.',
  },
]);

// ── AP Biology · Positive vs Negative Feedback Loops ────────────────────────
const loop = (nodes: string[], steps: P[] | string[]): Spec => flow('cycle', { nodes: nodes.map((label, i) => ({ id: `n${i}`, label })), steps });
const SIGNED = 'an arrow marked + means that an increase in the first quantity causes an increase in the second, and an arrow marked − means that it causes a decrease in the second';
const FB_OPTS = (first: 'Negative' | 'Positive', why: string): Array<[string, string]> => [
  [`${first} feedback`, 'correct'], [`${first === 'Negative' ? 'Positive' : 'Negative'} feedback`, why],
  ['No feedback: the pathway runs one way only', 'does not notice that the last arrow returns to the first box'], ['A different type of feedback on each trip round the loop', 'thinks the sign of a loop changes from one cycle to the next'],
];
/** The sign of the effect that a change in box `from` has on box `to`, following the arrows of a cycle. */
function pathSign(c: Ctx, from: number, to: number): number {
  const m = c.model(flowModel);
  let s = 1;
  for (let i = from; i !== to; i = (i + 1) % m.nodes.length) s *= m.edges[i].sign === '−' ? -1 : 1;
  return s;
}
G('8c600e3b.lo-2', 'Classifying feedback loops', [
  {
    t: 'classify a three-step signed loop', d: 2, need: 'reason',
    spec: loop(['Blood glucose level', 'Insulin secretion', 'Glucose uptake by cells'], [{ sign: '+' }, { sign: '+' }, { sign: '−' }]),
    alt: 'A loop of three boxes joined by arrows: Blood glucose level, Insulin secretion, Glucose uptake by cells, and back to Blood glucose level. Each arrow carries a plus or a minus sign in a small circle; exactly one of the three arrows carries a minus sign.',
    q: `In the loop shown, ${SIGNED}. What type of feedback does the loop represent?`,
    o: FB_OPTS('Negative', 'counts the plus signs and takes the majority'),
    ck: ['flow_loop_sign', {}],
    h: ['Imagine the first quantity rising a little and follow the change once round the loop.', 'See whether the change that returns to the first box adds to the original rise or opposes it.'],
    s: 'Start with a rise in blood glucose. The + arrow gives more insulin secretion, the next + arrow gives more glucose uptake, and the − arrow from uptake back to blood glucose means the glucose level falls. The loop opposes the original change, so it is negative feedback.',
  },
  {
    t: 'classify a loop that holds two inhibitions', d: 3, need: 'reason',
    spec: loop(['Protein A', 'Protein B', 'Protein C'], [{ sign: '−' }, { sign: '−' }, { sign: '+' }]),
    alt: 'A loop of three boxes joined by arrows: Protein A, Protein B, Protein C, and back to Protein A. Each arrow carries a plus or a minus sign in a small circle; exactly one of the three arrows carries a plus sign.',
    q: `The loop shown models three regulatory proteins in a cell; ${SIGNED}. What type of feedback does the loop as a whole produce?`,
    o: FB_OPTS('Positive', 'sees minus signs and concludes that the loop must oppose change, without following a change all the way round'),
    ck: ['flow_loop_sign', {}],
    h: ['Let protein A rise a little and follow the change along each arrow in turn.', 'Two decreases in a row: what does a fall in B do to C?'],
    s: 'Let protein A rise. The first − arrow means protein B falls. The second − arrow means that a fall in B causes a rise in C, and the + arrow means that a rise in C causes a further rise in A. The change returns reinforced, so the loop is positive feedback: two inhibitions in a loop cancel each other.',
  },
]);

G('8c600e3b.lo-3', 'Blood glucose regulation', [
  {
    t: 'supply the missing step of the glucose loop', d: 2, need: 'reason',
    spec: flow('cycle', { nodes: [N('g', 'Blood glucose rises'), N('b', 'Beta cells of pancreas'), N('i', 'Insulin', { blank: true }), N('u', 'Cells take up glucose')], steps: ['detected by', 'secrete', 'signals', 'reverses'] }),
    alt: 'A loop of four boxes joined by labelled arrows: Blood glucose rises, detected by Beta cells of pancreas, which secrete a substance in a box holding a question mark, which signals Cells take up glucose, which reverses the rise in blood glucose.',
    q: 'The loop shown summarises how the body responds after a meal rich in carbohydrate. One box is replaced by a question mark. What belongs in that box?',
    o: [['Insulin', 'correct'], ['Glucagon', 'names the hormone released when blood glucose is low'], ['Glycogen', 'names the storage form of glucose, which is not a signal'], ['Epinephrine', 'names a hormone that raises blood glucose']],
    ck: ['flow_blank', { what: 'node' }],
    h: ['The missing box is something the beta cells release into the blood.', 'Its effect, shown by the next arrow, is to make body cells take up glucose.'],
    s: 'The arrows show that the missing substance is secreted by the beta cells of the pancreas when blood glucose rises, and that it signals body cells to take up glucose, bringing the level back down. That hormone is insulin.',
  },
]);

G('8c600e3b.lo-5', 'Predicting the outcome of a feedback loop', [
  {
    t: 'predict an upstream hormone level when the end product is missing', d: 3, need: 'reason',
    spec: loop(['TRH', 'TSH', 'Thyroid hormone'], [{ sign: '+' }, { sign: '+' }, { sign: '−' }]),
    alt: 'A loop of three boxes joined by arrows: TRH, TSH, Thyroid hormone, and back to TRH. Each arrow carries a plus or a minus sign in a small circle; the arrow from Thyroid hormone back to TRH carries the minus sign.',
    q: 'The loop shown links TRH (from the hypothalamus), TSH (from the pituitary) and thyroid hormone; + means that the first substance stimulates release of the second, and − means that it inhibits it. A person\'s diet lacks the iodine needed to make thyroid hormone, so the level of thyroid hormone stays low. According to the loop, what happens to the level of TSH?',
    o: [['It rises above normal', 'correct'], ['It falls below normal', 'assumes that all the hormones of one pathway rise and fall together'], ['It stays at its normal level', 'thinks only the gland that is short of iodine is affected'], ['It falls to zero', 'thinks that the pathway shuts down when its end product cannot be made']],
    calc: ['the kind\'s model: the sign of the path Thyroid hormone → TRH → TSH (product of the arrow signs), applied to a fall in thyroid hormone', (c) => (pathSign(c, 2, 1) * -1 > 0 ? 'It rises above normal' : 'It falls below normal')],
    h: ['Follow the arrows from thyroid hormone round to TSH and note the sign of each one.', 'A low level of an inhibitor means less inhibition.'],
    s: 'The − arrow shows that thyroid hormone inhibits the release of TRH. With thyroid hormone low, that inhibition is weak, so TRH rises. The + arrow from TRH to TSH then means more TSH is released. TSH rises above normal (and keeps stimulating the thyroid, which can enlarge).',
  },
  {
    t: 'predict what a loop of all-positive links does to its variable', d: 2, need: 'reason',
    spec: loop(['Uterus contracts', 'Cervix stretches', 'Oxytocin released'], [{ sign: '+' }, { sign: '+' }, { sign: '+' }]),
    alt: 'A loop of three boxes joined by arrows: Uterus contracts, Cervix stretches, Oxytocin released, and back to Uterus contracts. Each of the three arrows carries a sign in a small circle.',
    q: 'The loop shown links the contractions of the uterus, the stretching of the cervix and the release of oxytocin during childbirth; an arrow marked + means that an increase in the first quantity causes an increase in the second. Once labour has started, what does this loop do to the strength of the contractions until the baby is delivered?',
    o: [['It makes them stronger and stronger', 'correct'], ['It holds them at a steady set point', 'describes a loop that opposes change, which needs a − arrow'], ['It makes them weaker and weaker', 'follows a decrease round the loop instead of the increase that starts labour'], ['It makes them alternate between strong and weak', 'thinks a loop reverses its effect on every trip round']],
    holds: ['checker flow_loop_sign: a positive loop amplifies the change that enters it (here an increase); a negative loop would hold a set point', [
      (c) => c.txt('flow_loop_sign') === 'positive',
      (c) => c.txt('flow_loop_sign') === 'negative',
      () => false,
      () => false,
    ]],
    h: ['Follow a small increase in contractions once round the loop.', 'See whether it comes back as a further increase or as a decrease.'],
    s: 'All three arrows are marked +. Stronger contractions stretch the cervix more, more stretching releases more oxytocin, and more oxytocin makes the contractions stronger still. The increase is amplified on every trip round the loop, so the contractions become stronger and stronger until delivery removes the stretch.',
  },
]);

// ── AP Chemistry · Photoelectron Spectroscopy Data Interpretation ───────────
const ALT_PES = 'A photoelectron spectrum: narrow peaks on a horizontal axis labelled Binding energy (MJ/mol), which is logarithmic and increases to the left, against a vertical axis labelled Relative number of electrons with evenly spaced gridlines.';
G('f5cf533c.lo-2', 'Peak position and binding energy', [
  {
    t: 'pick the peak of the most weakly held electrons', d: 2, need: 'reason',
    spec: pesOf('Mg', { showEnergies: false }, ['A', 'B', 'C', 'D']),
    alt: `${ALT_PES} Four peaks are labelled A, B, C and D from left to right; no energies are printed over them.`,
    q: 'The peaks of the photoelectron spectrum shown are labelled A to D. Which peak is produced by the electrons that are held least strongly by the nucleus?',
    o: [['Peak D', 'correct'], ['Peak A', 'reads the axis as increasing to the right'], ['Peak C', 'picks the tallest peak instead of reading the energy axis'], ['Peak B', 'takes the second peak from the left for the outer electrons']],
    holds: ['the kind\'s model: the label of the peak with the lowest binding energy', ['D', 'A', 'C', 'B'].map((l) => (c: Ctx) => [...pesPeaks(c)].sort((x, y) => x.energy - y.energy)[0].label === l)],
    h: ['Electrons that are weakly held need little energy to remove: look for the lowest binding energy.', 'Check the numbers along the axis to see in which direction the binding energy increases.'],
    s: 'The numbers on the axis get larger toward the left, so binding energy increases to the left. The electrons held least strongly have the lowest binding energy, which is the peak furthest to the right: peak D.',
  },
  {
    t: 'decide which peaks a given photon energy can eject', d: 3, need: 'reason',
    spec: pesOf('Na'),
    alt: `${ALT_PES} Four peaks are drawn, each with its binding energy printed over it: 104, 6.84, 3.67 and 0.5 MJ/mol from left to right.`,
    q: 'A sample of the element whose photoelectron spectrum is shown is struck by photons with an energy of 5.0 MJ/mol. Electrons from which peaks can be ejected?',
    o: [['Only the two peaks furthest to the right', 'correct'], ['Only the two peaks furthest to the left', 'thinks electrons with a binding energy above the photon energy are the ones removed'], ['All four peaks', 'thinks any photon can eject any electron, only more slowly'], ['Only the peak furthest to the right', 'allows only the outermost electrons to be ejected']],
    holds: ['the kind\'s model: the peaks (0 = leftmost) whose binding energy is below 5.0 MJ/mol', [[2, 3], [0, 1], [0, 1, 2, 3], [3]].map((want) => (c: Ctx) => pesPeaks(c).map((p, i) => (p.energy < 5 ? i : -1)).filter((i) => i >= 0).join() === want.join())],
    h: ['A photon can eject an electron only if its energy is at least the binding energy of that electron.', 'Compare 5.0 MJ/mol with the energy printed over each peak.'],
    s: 'The energies printed over the peaks are 104, 6.84, 3.67 and 0.50 MJ/mol. Only 3.67 and 0.50 are below the photon energy of 5.0 MJ/mol, so only electrons from those two peaks, the two furthest to the right, can be ejected.',
  },
  {
    t: 'kinetic energy of electrons ejected from a named subshell', d: 3, need: 'calc',
    spec: pesOf('Na'),
    alt: `${ALT_PES} Four peaks are drawn, each with its binding energy printed over it: 104, 6.84, 3.67 and 0.5 MJ/mol from left to right.`,
    q: 'Photons with an energy of 8.00 MJ/mol strike a sample of the element whose photoelectron spectrum is shown. What is the kinetic energy of the electrons ejected from the 2s subshell, in MJ/mol?',
    n: '1.16',
    calc: ['8.00 − the binding energy (the kind\'s model) of the peak that checker spectrum_peak_subshell assigns to 2s', (c) => {
      const i = pesPeaks(c).findIndex((_, k) => subshell(c, k) === '2s');
      return round(8 - pesPeaks(c)[i].energy, 4);
    }],
    h: ['Decide which peak belongs to the 2s electrons: subshells appear in order of binding energy, 1s highest.', 'The kinetic energy is the photon energy less the binding energy.'],
    s: 'The peak of highest binding energy (104 MJ/mol) is 1s, so the next one, at 6.84 MJ/mol, is 2s. The kinetic energy of the ejected electrons is 8.00 − 6.84 = 1.16 MJ/mol.',
  },
]);

G('f5cf533c.lo-3', 'Assigning peaks to subshells', [
  {
    t: 'subshell of a peak named by its energy', d: 2, need: 'reason',
    spec: pesOf('Ne'),
    alt: `${ALT_PES} Three peaks are drawn, each with its binding energy printed over it: 84, 4.68 and 2.08 MJ/mol from left to right. The third peak is the tallest.`,
    q: 'In the photoelectron spectrum shown, which subshell produces the peak at 4.68 MJ/mol?',
    o: [['2s', 'correct'], ['2p', 'assigns the subshells starting from the right-hand end of the spectrum'], ['1s', 'takes a peak of low height for the innermost electrons'], ['3s', 'starts a new shell for every peak']],
    ck: ['spectrum_peak_subshell', { peak: 1 }],
    h: ['The peak of highest binding energy comes from the electrons closest to the nucleus.', 'Assign the subshells in order of filling, starting from that peak, and check the heights against the electrons each subshell holds.'],
    s: 'Starting from the highest binding energy, on the left, the peaks are 1s (84.0 MJ/mol), then the peak at 4.68 MJ/mol, then the one at 2.08 MJ/mol. The second subshell to fill is 2s; the heights agree, since the peak at 4.68 is as tall as the 1s peak (2 electrons) and the last peak is three times as tall (six 2p electrons).',
  },
  {
    t: 'position of the peak of a named subshell', d: 2, need: 'reason',
    spec: pesOf('Al', { showEnergies: false }),
    alt: `${ALT_PES} Five peaks of different heights are drawn; no energies or labels are printed over them.`,
    q: 'Counting from the left, which peak of the photoelectron spectrum shown is produced by the 3s electrons? Give the number of the peak.',
    n: '4',
    calc: ['the 1-based position of the peak that checker spectrum_peak_subshell assigns to 3s', (c) => pesPeaks(c).findIndex((_, k) => subshell(c, k) === '3s') + 1],
    h: ['The axis increases to the left, so the leftmost peak is the most tightly bound subshell.', 'List the subshells in order of filling and match them to the peaks from left to right.'],
    s: 'Binding energy increases to the left, so from left to right the five peaks are 1s, 2s, 2p, 3s and 3p. The 3s electrons give the fourth peak from the left; its height, equal to that of the first two peaks, fits two s electrons.',
  },
  {
    t: 'predict how a peak shifts for the next element', d: 3, need: 'reason',
    spec: pesOf('Mg'),
    alt: `${ALT_PES} Four peaks are drawn, each with its binding energy printed over it: 126, 9.07, 5.31 and 0.74 MJ/mol from left to right.`,
    q: 'The photoelectron spectrum shown is that of magnesium. In the spectrum of aluminium, drawn on the same axis, where would the 1s peak lie compared with the 1s peak shown?',
    o: [['Further to the left, at a higher binding energy', 'correct'], ['Further to the right, at a lower binding energy', 'thinks the extra electron shields the 1s electrons'], ['Further to the left, at a lower binding energy', 'reads the axis as increasing to the right'], ['Further to the right, at a higher binding energy', 'knows the energy is higher but reads the axis as increasing to the right']],
    holds: ['tabulated 1s binding energy of aluminium compared with the 1s peak of the spec; the kind draws binding energy increasing to the left', ([[true, true], [false, false], [true, false], [false, true]] as Array<[boolean, boolean]>).map(([left, higher]) => (c: Ctx) => {
      const isHigher = BE.Al[0][0] > pesPeaks(c)[0].energy;
      const isLeft = isHigher; // the axis increases to the left
      return left === isLeft && higher === isHigher;
    })],
    h: ['Aluminium has one more proton than magnesium. What does that do to the attraction on the 1s electrons?', 'Then use the direction of the axis in the spectrum to place the peak.'],
    s: 'Aluminium has 13 protons to magnesium\'s 12, and the 1s electrons are not shielded by the outer electrons, so they are held more strongly: a higher binding energy than the 126 MJ/mol shown. The axis in the spectrum increases to the left, so the peak lies further to the left.',
  },
]);

G('f5cf533c.lo-4', 'Peak height and electron count', [
  {
    t: 'electron count of one peak from the height of another', d: 2, need: 'reason',
    spec: pesOf('O'),
    alt: `${ALT_PES} Three peaks are drawn, each with its binding energy printed over it: 52.6, 3.12 and 1.31 MJ/mol from left to right. The first two peaks have the same height and the third is taller.`,
    q: 'In the photoelectron spectrum shown, the peak furthest to the left represents 2 electrons. How many electrons does the peak furthest to the right represent?',
    n: '4',
    calc: ['the kind\'s model: electrons of the rightmost peak (the leftmost is checked to hold 2)', (c) => { const p = pesPeaks(c); if (p[0].electrons !== 2) throw new Error('leftmost peak is not 2'); return p[p.length - 1].electrons; }],
    h: ['The height of a peak is proportional to the number of electrons in that subshell.', 'Use the gridlines to compare the height of the right-hand peak with the left-hand one.'],
    s: 'The left-hand peak reaches 2 gridline units and represents 2 electrons, so each unit is one electron. The right-hand peak reaches 4 units, twice as tall, so it represents 4 electrons (the 2p⁴ electrons of oxygen).',
  },
  {
    t: 'atomic number from the sum of the peak heights', d: 2, need: 'calc',
    spec: pesOf('Al'),
    alt: `${ALT_PES} Five peaks are drawn, each with its binding energy printed over it: 151, 12.1, 7.79, 1.09 and 0.58 MJ/mol from left to right. The peaks have different heights; the last is the shortest.`,
    q: 'The spectrum shown is the complete photoelectron spectrum of a neutral atom, and the peak furthest to the left represents 2 electrons. What is the atomic number of the element?',
    n: '13',
    calc: ['the kind\'s model: the sum of the electrons of all peaks (the leftmost is checked to hold 2)', (c) => { const p = pesPeaks(c); if (p[0].electrons !== 2) throw new Error('leftmost peak is not 2'); return p.reduce((t, q) => t + q.electrons, 0); }],
    h: ['Read the height of every peak in gridline units and convert it to a number of electrons.', 'A neutral atom has as many electrons as protons.'],
    s: 'The left-hand peak reaches 2 units and represents 2 electrons, so one unit is one electron. From left to right the peaks reach 2, 2, 6, 2 and 1 units: 2 + 2 + 6 + 2 + 1 = 13 electrons. A neutral atom with 13 electrons has 13 protons, so the atomic number is 13.',
  },
]);

G('f5cf533c.lo-5', 'From spectrum to electron configuration', [
  {
    t: 'electron configuration of the atom', d: 2, need: 'reason',
    spec: pesOf('N'),
    alt: `${ALT_PES} Three peaks are drawn, each with its binding energy printed over it: 39.6, 2.45 and 1.4 MJ/mol from left to right. The first two peaks have the same height and the third is taller.`,
    q: 'The photoelectron spectrum shown is that of a neutral atom in its ground state. Which electron configuration does it represent?',
    o: [['1s² 2s² 2p³', 'correct'], ['1s³ 2s² 2p²', 'assigns the subshells from the right-hand end of the spectrum'], ['1s² 2s² 2p⁵', 'misreads the height of the last peak'], ['1s² 2s² 3s³', 'starts a new shell for the third peak']],
    ck: ['spectrum_configuration', {}],
    h: ['Assign the peaks to subshells from left to right, starting with 1s at the highest binding energy.', 'Read each height in gridline units to get the number of electrons in that subshell.'],
    s: 'Binding energy increases to the left, so from left to right the peaks are 1s, 2s and 2p. Their heights in gridline units are 2, 2 and 3, so the configuration is 1s² 2s² 2p³ (7 electrons: nitrogen).',
  },
  {
    t: 'identify the element', d: 2, need: 'reason',
    spec: pesOf('F'),
    alt: `${ALT_PES} Three peaks are drawn, each with its binding energy printed over it: 67.2, 3.88 and 1.68 MJ/mol from left to right. The first two peaks have the same height and the third is the tallest.`,
    q: 'The photoelectron spectrum shown is the complete spectrum of a neutral atom in its ground state; the peak furthest to the left represents 2 electrons. Which element is it?',
    o: [['Fluorine', 'correct'], ['Neon', 'reads the last peak as a full p subshell'], ['Oxygen', 'reads the last peak one unit too low'], ['Chlorine', 'matches the number of outer electrons but not the number of peaks']],
    ck: ['spectrum_element', {}],
    h: ['Add up the electrons represented by all the peaks.', 'The total number of electrons of a neutral atom is its atomic number.'],
    s: 'The three peaks are 1s, 2s and 2p, with heights of 2, 2 and 5 units. That is 9 electrons, with the configuration 1s² 2s² 2p⁵: the element with atomic number 9, fluorine.',
  },
  {
    t: 'number of valence electrons', d: 2, need: 'reason',
    spec: pesOf('C'),
    alt: `${ALT_PES} Three peaks of equal height are drawn, each with its binding energy printed over it: 28.6, 1.72 and 1.09 MJ/mol from left to right.`,
    q: 'The photoelectron spectrum shown is the complete spectrum of a neutral atom in its ground state; each peak represents 2 electrons. How many valence electrons does the atom have?',
    n: '4',
    calc: ['the electrons (the kind\'s model) of the peaks that checker spectrum_peak_subshell assigns to the highest shell', (c) => {
      const p = pesPeaks(c);
      const shells = p.map((_, k) => Number(subshell(c, k)[0]));
      const top = Math.max(...shells);
      return p.reduce((t, q, k) => t + (shells[k] === top ? q.electrons : 0), 0);
    }],
    h: ['Assign each peak to its subshell and find which peaks belong to the outermost shell.', 'The large gap in binding energy separates the inner shell from the outer shell.'],
    s: 'From left to right the peaks are 1s, 2s and 2p, each with 2 electrons. The 1s peak, at 28.6 MJ/mol, is the inner shell; the two peaks close together at low binding energy, 2s and 2p, make up the outer shell (n = 2). The atom has 2 + 2 = 4 valence electrons (carbon).',
  },
]);

// ── AP Chemistry · Average Atomic Mass from Isotopes ────────────────────────
const ALT_MASS = 'A mass spectrum: vertical bars on a horizontal axis of mass-to-charge ratio (m/z), against a vertical axis of relative abundance in percent.';
G('ada76c1a.lo-1', 'Isotopes in a mass spectrum', [
  {
    t: 'neutron number of the most abundant isotope', d: 2, need: 'calc',
    spec: mass([[69, 60], [71, 40]], { yMax: 80, yStep: 20 }),
    alt: `${ALT_MASS} Two bars are drawn, at m/z 69 and at m/z 71; the bar at 69 is the taller.`,
    q: 'The mass spectrum shown is that of gallium, atomic number 31. How many neutrons are in an atom of its most abundant isotope?',
    n: '38',
    calc: ['checker spectrum_most_abundant (the m/z of the tallest bar) less the atomic number 31', (c) => c.num('spectrum_most_abundant') - 31],
    h: ['The tallest bar belongs to the most abundant isotope; read its mass number from the horizontal axis.', 'Mass number = protons + neutrons.'],
    s: 'The taller bar is at m/z 69, so the most abundant isotope has mass number 69. Gallium has 31 protons, so that isotope has 69 − 31 = 38 neutrons.',
  },
]);

G('ada76c1a.lo-3', 'Average atomic mass', [
  {
    t: 'weighted average of three isotopes', d: 2, need: 'calc',
    spec: mass([[24, 79], [25, 10], [26, 11]], { showValues: true, yMax: 100, yStep: 20 }),
    alt: `${ALT_MASS} Three bars are drawn at m/z 24, 25 and 26, with their percent abundances printed over them: 79, 10 and 11.`,
    q: 'The mass spectrum shown gives the percent abundance of each isotope of an element. Taking the mass of each isotope to be its mass number, what is the average atomic mass of the element, to two decimal places?',
    n: '24.32',
    ck: ['spectrum_average_mass', {}],
    h: ['Multiply each mass by its fractional abundance.', 'Add the three products; the result must lie between the lightest and the heaviest mass, nearest the most abundant.'],
    s: 'From the spectrum: mass 24 at 79%, mass 25 at 10% and mass 26 at 11%. The average is 24(0.79) + 25(0.10) + 26(0.11) = 18.96 + 2.50 + 2.86 = 24.32.',
  },
  {
    t: 'identify an element from its weighted average mass', d: 3, need: 'calc',
    spec: mass([[63, 69], [65, 31]], { showValues: true, yMax: 80, yStep: 20 }),
    alt: `${ALT_MASS} Two bars are drawn at m/z 63 and 65, with their percent abundances printed over them: 69 and 31.`,
    q: 'The mass spectrum shown is that of a pure element. Which of these elements, listed with their average atomic masses, is it most likely to be?',
    o: [['Copper (63.55)', 'correct'], ['Zinc (65.38)', 'matches the mass of the heavier isotope instead of the weighted average'], ['Nickel (58.69)', 'takes an element lighter than every isotope shown'], ['Gallium (69.72)', 'reads the abundance printed over the taller bar as a mass']],
    ck: ['spectrum_element', {}],
    h: ['Work out the abundance-weighted average of the two masses.', 'Compare the average, not either single mass, with the list.'],
    s: 'From the spectrum: mass 63 at 69% and mass 65 at 31%. The average is 63(0.69) + 65(0.31) = 43.47 + 20.15 = 63.62, which is closest to copper (63.55).',
  },
]);

// ── AP Chemistry · Beer-Lambert Law and Spectroscopy ────────────────────────
const beer = (params: P): Spec => S('spectrum', { variant: 'absorbance', ...params });
G('5cb99fa9.lo-2', 'Concentration from absorbance', [
  {
    t: 'concentration of a diluted unknown from a calibration line', d: 3, need: 'calc',
    spec: beer({ slope: 0.2, xMax: 5, xStep: 1, yMax: 1, yStep: 0.2, sample: { absorbance: 0.6 }, xLabel: 'Concentration (mmol/L)' }),
    alt: 'A calibration graph: a straight line through the origin, with absorbance on the vertical axis (0 to 1.0) and concentration in millimoles per litre on the horizontal axis (0 to 5). A dashed horizontal line labelled sample runs from the absorbance axis across to the calibration line.',
    q: 'The calibration line shown was made with standard solutions of a dye. A sample prepared by diluting 10.0 mL of an unknown dye solution to 50.0 mL gives the absorbance marked by the dashed line. What was the concentration of the undiluted unknown solution, in mmol/L?',
    n: '15',
    calc: ['checker spectrum_concentration (the concentration at the sample\'s absorbance) × the dilution factor 50.0/10.0', (c) => c.num('spectrum_concentration') * (50 / 10)],
    h: ['Follow the dashed line across to the calibration line and read the concentration below that point: this is the diluted sample.', 'The undiluted solution is more concentrated by the dilution factor.'],
    s: 'The dashed line meets the calibration line above 3.0 mmol/L, so the diluted sample is 3.0 mmol/L. It was diluted from 10.0 mL to 50.0 mL, a factor of 5, so the undiluted solution was 5 × 3.0 = 15 mmol/L.',
  },
  {
    t: 'molar absorptivity from the slope of the calibration line', d: 3, need: 'calc',
    spec: beer({ slope: 8, xMax: 0.1, xStep: 0.02, yMax: 0.8, yStep: 0.2, points: [[0.02, 0.16], [0.05, 0.4], [0.08, 0.64], [0.1, 0.8]] }),
    alt: 'A calibration graph: a straight line through the origin with several data points on it, absorbance on the vertical axis (0 to 0.8) and concentration in moles per litre on the horizontal axis (0 to 0.10). The line reaches the top right corner of the grid.',
    q: 'The calibration line shown was measured in a cuvette with a path length of 2.00 cm. What is the molar absorptivity of the absorbing species, in L/(mol·cm)?',
    n: '4',
    calc: ['the kind\'s model: the slope of the line (absorbance per mol/L) ÷ the path length 2.00 cm', (c) => { const m = specM(c); if (m.variant !== 'absorbance') throw new Error('not a calibration line'); return m.slope / 2; }],
    h: ['Beer\'s law is A = εbc, so the slope of absorbance against concentration equals εb.', 'Find the slope from a point where the line crosses a grid intersection, then divide by the path length.'],
    s: 'The line passes through the origin and through (0.10 mol/L, 0.80), so its slope is 0.80 ÷ 0.10 = 8.0 L/mol. Since the slope equals εb and b = 2.00 cm, ε = 8.0 ÷ 2.00 = 4 L/(mol·cm).',
  },
]);

// ── Algebra 2 · Right-Triangle Trigonometric Ratios ─────────────────────────
/** A right triangle of the kind's model, seen from the vertex whose angle label is `mark`: the lengths and the names of its three sides. */
function fromAngle(c: Ctx, mark = 'θ'): { opp: number; adj: number; hyp: number; names: { opp: string; adj: string; hyp: string } } {
  const m = triM(c);
  const labels = (c.p.angleLabels as Array<string | null>) ?? [];
  const t = labels.indexOf(mark);
  const r = m.right;
  if (t < 0 || r < 0 || t === r) throw new Error('needs a right triangle with the marked acute angle');
  const o = 3 - t - r;
  const len = [m.a, m.b, m.c]; // the side opposite vertex i
  const side = (i: number, j: number): string => [m.names[i], m.names[j]].sort().join('');
  return { opp: len[t], adj: len[o], hyp: len[r], names: { opp: side(o, r), adj: side(t, r), hyp: side(t, o) } };
}
const sides2 = (s: string): string => s.split(', ').map((x) => x.split('').sort().join('')).join(', ');
G('869a59a5.lo-1', 'Opposite, adjacent and hypotenuse', [
  {
    t: 'length of the side opposite the marked angle', d: 1, need: 'read',
    spec: tri({ sides: [8, 17, 15], sideLabels: ['auto', 'auto', 'auto'], angleLabels: ['θ', null, null], unit: 'cm' }),
    alt: 'A right triangle ABC with the right angle at B marked by a small square. Each of the three sides is labelled with its length in centimetres, and the acute angle at vertex A is marked θ.',
    q: 'In the right triangle shown, what is the length of the side opposite the angle marked θ, in centimetres?',
    n: '8',
    calc: ['the kind\'s model: the length of the side that does not touch the vertex marked θ', (c) => fromAngle(c).opp],
    h: ['The opposite side is the one that does not touch the vertex of the angle.', 'Find the vertex marked θ and look across the triangle from it.'],
    s: 'The angle θ is at vertex A. The two sides that meet at A are AB and AC, so the side opposite θ is BC, which the figure labels 8 cm.',
  },
  {
    t: 'name the three sides relative to a marked angle', d: 2, need: 'reason',
    spec: tri({ sides: [9, 15, 12], angleLabels: [null, null, 'θ'] }),
    alt: 'A right triangle ABC with the right angle at B marked by a small square; A is at the left end of the base, B at the right end and C above B. The acute angle at vertex C is marked θ. No side lengths are printed.',
    q: 'For the angle marked θ in the right triangle shown, which lists the opposite side, the adjacent side and the hypotenuse, in that order?',
    o: [['AB, BC, AC', 'correct'], ['BC, AB, AC', 'names the sides for the other acute angle'], ['AB, AC, BC', 'swaps the adjacent side and the hypotenuse'], ['AC, BC, AB', 'takes the side across from the right angle as the opposite side']],
    holds: ['the kind\'s model: the names of the side opposite the vertex marked θ, the leg that touches it and the side opposite the right angle', ['AB, BC, AC', 'BC, AB, AC', 'AB, AC, BC', 'AC, BC, AB'].map((txt) => (c: Ctx) => { const f = fromAngle(c).names; return sides2(txt) === `${f.opp}, ${f.adj}, ${f.hyp}`; })],
    h: ['The hypotenuse is always the side across from the right angle.', 'Of the two sides that meet at the vertex marked θ, one is the hypotenuse; the other is the adjacent side.'],
    s: 'The right angle is at B, so the hypotenuse is the side across from B: AC. The angle θ is at C; the sides meeting at C are BC and AC, and since AC is the hypotenuse, BC is the adjacent side. The remaining side, AB, does not touch C and is the opposite side. In order: AB, BC, AC.',
  },
  {
    t: 'identify the hypotenuse when the right angle is at the top', d: 1, need: 'read',
    spec: tri({ points: [[0, 0], [10, 0], [3.6, 4.8]], vertices: ['K', 'L', 'M'], angleLabels: ['α', 'β', null] }),
    alt: 'A triangle KLM drawn with the side KL along the bottom and vertex M above it. The angle at M carries a small square, and the angles at K and L are marked α and β. No side lengths are printed.',
    q: 'Which side of the right triangle shown is the hypotenuse?',
    o: [['KL', 'correct'], ['LM', 'picks the side opposite the angle marked α'], ['KM', 'picks the shortest side, the one that looks least like a base'], ['It depends on which acute angle is used', 'confuses the hypotenuse with the opposite and adjacent sides, which do depend on the angle']],
    holds: ['the kind\'s model: the side opposite the vertex with the right-angle mark', ['KL', 'LM', 'KM', ''].map((name) => (c: Ctx) => {
      const m = triM(c);
      const others = m.names.filter((_, i) => i !== m.right).sort().join('');
      return name !== '' && name.split('').sort().join('') === others;
    })],
    h: ['Find the small square that marks the right angle.', 'The hypotenuse is the side that does not touch the right angle; it is the same side whichever acute angle you work with.'],
    s: 'The small square shows that the right angle is at M. The hypotenuse is the side opposite the right angle, the one that does not touch M: side KL, drawn along the bottom. It is the hypotenuse for both α and β.',
  },
]);

G('869a59a5.lo-2', 'Sine, cosine and tangent from side lengths', [
  {
    t: 'tangent of an angle at the top vertex', d: 2, need: 'reason',
    spec: tri({ sides: [20, 29, 21], sideLabels: ['auto', 'auto', 'auto'], angleLabels: [null, null, 'θ'] }),
    alt: 'A right triangle ABC with the right angle at B marked by a small square; C is above B. The sides are labelled with their lengths: AB = 21, BC = 20 and AC = 29. The acute angle at the top vertex C is marked θ.',
    q: 'What is tan θ for the right triangle shown?',
    o: [['21/20', 'correct'], ['20/21', 'takes the ratio for the other acute angle'], ['21/29', 'gives the sine of the angle'], ['20/29', 'gives the cosine of the angle']],
    calc: ['the kind\'s model: (side opposite the vertex marked θ)/(leg adjacent to it)', (c) => { const f = fromAngle(c); return `${round(f.opp, 6)}/${round(f.adj, 6)}`; }],
    h: ['Tangent is opposite over adjacent.', 'Decide which leg is opposite the angle at C: it is the one that does not touch C.'],
    s: 'The angle θ is at C. The leg that does not touch C is AB = 21, so it is the opposite side; the leg that touches C is BC = 20, the adjacent side. tan θ = opposite/adjacent = 21/20.',
  },
  {
    t: 'sine when the hypotenuse must be found first', d: 3, need: 'calc',
    spec: tri({ sides: [7, 25, 24], sideLabels: ['auto', null, 'auto'], angleLabels: ['θ', null, null] }),
    alt: 'A right triangle ABC with the right angle at B marked by a small square. The two legs are labelled with their lengths, AB = 24 and BC = 7; the longest side AC has no label. The acute angle at vertex A is marked θ.',
    q: 'What is sin θ for the right triangle shown? Give your answer as a decimal.',
    n: '0.28',
    calc: ['the kind\'s model: (side opposite the vertex marked θ) ÷ (hypotenuse)', (c) => { const f = fromAngle(c); return round(f.opp / f.hyp, 6); }],
    h: ['Sine needs the hypotenuse, which is not labelled: find it from the two legs.', 'Then divide the side opposite θ by the hypotenuse.'],
    s: 'The legs are 24 and 7, so the hypotenuse is √(24² + 7²) = √625 = 25. The side opposite θ (at A) is BC = 7. sin θ = 7/25 = 0.28.',
  },
]);

G('869a59a5.lo-3', 'Finding angles with inverse trigonometric functions', [
  {
    t: 'angle from the two legs', d: 2, need: 'calc',
    spec: tri({ sides: [5, 13, 12], sideLabels: ['auto', null, 'auto'], angleLabels: ['θ', null, null] }),
    alt: 'A right triangle ABC with the right angle at B marked by a small square. The two legs are labelled with their lengths, AB = 12 and BC = 5; the longest side has no label. The acute angle at vertex A is marked θ.',
    q: 'What is the measure of the angle θ in the right triangle shown, to the nearest tenth of a degree?',
    n: '22.6',
    ck: ['geo_angle', { vertex: 0 }],
    h: ['The two labelled sides are the opposite and adjacent sides for θ: which ratio uses those two?', 'Apply the inverse of that ratio on your calculator, in degree mode.'],
    s: 'For θ at A, the opposite side is BC = 5 and the adjacent side is AB = 12, so tan θ = 5/12. θ = tan⁻¹(5/12) = 22.6°.',
  },
  {
    t: 'angle from a leg and the hypotenuse', d: 2, need: 'calc',
    spec: tri({ sides: [6, 10, 8], sideLabels: ['auto', 'auto', null], angleLabels: [null, null, 'θ'] }),
    alt: 'A right triangle ABC with the right angle at B marked by a small square; C is above B. Two sides are labelled with their lengths, BC = 6 and AC = 10; the base AB has no label. The acute angle at the top vertex C is marked θ.',
    q: 'To the nearest tenth of a degree, what is the measure of the angle θ at the top vertex of the right triangle shown?',
    n: '53.1',
    ck: ['geo_angle', { vertex: 2 }],
    h: ['One labelled side is the hypotenuse; decide whether the other is opposite or adjacent to θ.', 'Use the inverse of the ratio that links those two sides.'],
    s: 'For θ at C, the labelled leg BC = 6 touches C, so it is the adjacent side, and AC = 10 is the hypotenuse. cos θ = 6/10, so θ = cos⁻¹(0.6) = 53.1°.',
  },
]);

G('869a59a5.lo-4', 'Finding sides with trigonometric ratios', [
  {
    t: 'hypotenuse from an angle and the adjacent side', d: 2, need: 'calc',
    spec: tri({ asa: [35, 12, 90], sideLabels: [null, 'x', 'auto'], angleLabels: ['auto', null, null], unit: 'm' }),
    alt: 'A right triangle ABC with the right angle at B marked by a small square. The acute angle at A is labelled 35 degrees, the base AB is labelled 12 metres and the longest side AC is labelled x.',
    q: 'What is the length x in the right triangle shown, to the nearest tenth of a metre?',
    n: '14.6',
    ck: ['geo_side', { side: 1 }],
    h: ['Relative to the labelled angle, the known side is adjacent and x is the hypotenuse.', 'Write the cosine of the angle as adjacent over hypotenuse and solve for x.'],
    s: 'For the 35° angle at A, the side of 12 m is adjacent and x is the hypotenuse, so cos 35° = 12/x. Then x = 12 ÷ cos 35° = 12 ÷ 0.8192 = 14.6 m.',
  },
  {
    t: 'height from an angle of elevation and a distance', d: 2, need: 'calc',
    spec: tri({ asa: [28, 50, 90], sideLabels: ['h', null, 'auto'], angleLabels: ['auto', null, null], unit: 'm', vertices: null }),
    alt: 'A right triangle with a horizontal base labelled 50 metres and a vertical side on the right labelled h, with a small square marking the right angle between them. The acute angle at the left end of the base is labelled 28 degrees.',
    q: 'From a point on level ground, the top of a tower is seen at the angle of elevation shown; the base of the triangle is the distance to the foot of the tower. What is the height h of the tower, to the nearest tenth of a metre?',
    n: '26.6',
    ck: ['geo_side', { side: 0 }],
    h: ['Relative to the angle of elevation, h is the opposite side and the distance along the ground is the adjacent side.', 'Use the tangent of the angle.'],
    s: 'The figure gives an angle of elevation of 28° and a horizontal distance of 50 m. tan 28° = h/50, so h = 50 × tan 28° = 50 × 0.5317 = 26.6 m.',
  },
]);

// ── AP Calculus AB · Related Rates Problem Solving ──────────────────────────
G('846750a0.lo-3', 'Related rates: ladders, cones and tanks', [
  {
    t: 'sliding ladder: speed of the top', d: 3, need: 'calc',
    spec: tri({ sides: [5, 13, 12], sideLabels: ['y', '13 ft', 'x'], vertices: null }),
    alt: 'A right triangle with a horizontal base labelled x, a vertical side on the right labelled y and a small square marking the right angle between them. The slanted side, which stands for the ladder, is labelled with its length in feet.',
    q: 'A ladder leans against a vertical wall, as in the triangle shown: x is the distance of its foot from the wall and y is the height of its top. The foot slides away from the wall at 2 ft/s. At the instant when x = 12 ft, how fast is the top of the ladder sliding down the wall, in ft/s? Give a positive number.',
    n: '4.8',
    calc: ['the ladder length L from the kind\'s model (the hypotenuse): |dy/dt| = x·(dx/dt)/√(L² − x²) with x = 12, dx/dt = 2', (c) => { const L = triM(c).b; return round((12 * 2) / Math.sqrt(L * L - 144), 6); }],
    h: ['The ladder has a fixed length, read from the figure, so x² + y² is constant. Differentiate that equation with respect to time.', 'Find y at the instant in question before substituting.'],
    s: 'The figure gives a ladder of length 13 ft, so x² + y² = 169. Differentiating, 2x(dx/dt) + 2y(dy/dt) = 0. When x = 12, y = √(169 − 144) = 5. Then dy/dt = −(12)(2)/5 = −4.8 ft/s: the top slides down at 4.8 ft/s.',
  },
  {
    t: 'growing conical pile: rate of change of the height', d: 3, need: 'calc',
    spec: solid({ solid: 'cone', radius: 6, height: 4, unit: 'ft' }),
    alt: 'A line drawing of a cone standing on its circular base. The radius of the base is labelled 6 feet and the dashed height from the apex to the centre of the base is labelled with its length in feet, which is smaller than the radius.',
    q: 'Sand falls onto a conical pile at 9π ft³/min. As the pile grows it keeps the proportions of the cone shown, so its radius is always the same multiple of its height. How fast is the height of the pile increasing at the instant when the pile is 2 ft high, in ft/min?',
    n: '1',
    calc: ['the ratio k = radius/height from the kind\'s model: V = (π/3)k²h³, so dh/dt = (dV/dt)/(πk²h²) with dV/dt = 9π, h = 2', (c) => { const d = c.model(solidModel).dims; const k = d.radius / d.height; return round((9 * Math.PI) / (Math.PI * k * k * 4), 6); }],
    h: ['Use the two lengths in the figure to write the radius as a multiple of the height, so that the volume depends on h alone.', 'Differentiate V with respect to time and substitute h = 2.'],
    s: 'The figure gives a radius of 6 ft for a height of 4 ft, so r = 1.5h. Then V = (π/3)(1.5h)²h = 0.75πh³ and dV/dt = 2.25πh²(dh/dt). At h = 2: 9π = 2.25π(4)(dh/dt) = 9π(dh/dt), so dh/dt = 1 ft/min.',
  },
  {
    t: 'filling cylindrical tank: rate of change of the depth', d: 2, need: 'calc',
    spec: solid({ solid: 'cylinder', radius: 2, height: 5, unit: 'm' }),
    alt: 'A line drawing of an upright cylinder. The radius of its circular top is labelled 2 metres and its height is labelled 5 metres.',
    q: 'Water is pumped into the cylindrical tank shown at 3 m³/min. How fast is the water level rising?',
    o: [['3/(4π) m/min', 'correct'], ['3/(2π) m/min', 'divides by πr instead of πr²'], ['3/(20π) m/min', 'divides by the volume of the whole tank'], ['12π m/min', 'multiplies by the area of the base instead of dividing by it']],
    holds: ['the radius from the kind\'s model: dh/dt = (dV/dt)/(πr²) with dV/dt = 3, compared with the value of each option', [3 / (4 * Math.PI), 3 / (2 * Math.PI), 3 / (20 * Math.PI), 12 * Math.PI].map((v) => (c: Ctx) => near((3 / (Math.PI * c.model(solidModel).dims.radius ** 2)), v))],
    h: ['The volume of water is V = πr²h, and the radius of the tank does not change.', 'Differentiate with respect to time and solve for dh/dt.'],
    s: 'The figure gives a radius of 2 m, so the volume of water at depth h is V = π(2)²h = 4πh. Then dV/dt = 4π(dh/dt), and with dV/dt = 3 the level rises at dh/dt = 3/(4π) m/min. The height of the tank does not enter.',
  },
]);

const simM = (c: Ctx) => { const m = c.model(geometryModel); if (!m.similar) throw new Error('not similar triangles'); return m.similar; };
/** Heights of the person and the post: the vertical side (BC) of each triangle of the kind's model. */
const heights = (c: Ctx): [number, number] => [simM(c).first.sides[1], simM(c).second.sides[1]];
G('846750a0.lo-4', 'Related rates: shadows and distances', [
  {
    t: 'rate of growth of a shadow', d: 3, need: 'calc',
    spec: S('geometric_figure', { shape: 'similar_triangles', sides: [6, 10, 8], scale: 2.5, sideLabels: [['6 ft', null, 's'], ['15 ft', null, 'x + s']] }),
    alt: 'Two similar right triangles drawn side by side, ABC and DEF. The smaller, ABC, has a vertical side BC labelled 6 feet and a base AB labelled s; the larger, DEF, has a vertical side EF labelled 15 feet and a base DE labelled x + s. Each has a small square marking its right angle.',
    q: 'A person walks away from a lamp post at 4.5 ft/s. The two similar right triangles shown give the height of the person and of the lamp post, the length s of the person\'s shadow and the distance x of the person from the post. At what rate is the length of the shadow increasing, in ft/s?',
    n: '3',
    calc: ['the two heights h, H from the kind\'s model: s/(x + s) = h/H gives ds/dt = h/(H − h) × dx/dt with dx/dt = 4.5', (c) => { const [h, H] = heights(c); return round((h / (H - h)) * 4.5, 6); }],
    h: ['Corresponding sides of similar triangles are in the same ratio: write s/(x + s) with the two heights from the figure.', 'Solve for s in terms of x, then differentiate with respect to time.'],
    s: 'From the similar triangles, s/(x + s) = 6/15, so 15s = 6x + 6s and s = (2/3)x. Differentiating, ds/dt = (2/3)(dx/dt) = (2/3)(4.5) = 3 ft/s.',
  },
  {
    t: 'speed of the tip of a shadow', d: 3, need: 'calc',
    spec: S('geometric_figure', { shape: 'similar_triangles', sides: [5, 13, 12], scale: 2, sideLabels: [['5 ft', null, 's'], ['10 ft', null, 'x + s']] }),
    alt: 'Two similar right triangles drawn side by side, ABC and DEF. The smaller, ABC, has a vertical side BC labelled 5 feet and a base AB labelled s; the larger, DEF, has a vertical side EF labelled 10 feet and a base DE labelled x + s. Each has a small square marking its right angle.',
    q: 'A child walks away from a street light at 3 ft/s. The two similar right triangles shown give the height of the child and of the light, the length s of the child\'s shadow and the distance x of the child from the light. How fast is the tip of the shadow moving along the ground, in ft/s?',
    n: '6',
    calc: ['the two heights h, H from the kind\'s model: the tip is at x + s = x·H/(H − h), so it moves at H/(H − h) × dx/dt with dx/dt = 3', (c) => { const [h, H] = heights(c); return round((H / (H - h)) * 3, 6); }],
    h: ['The tip of the shadow is at distance x + s from the light, so its speed is d(x + s)/dt, not ds/dt.', 'Use the similar triangles to write x + s in terms of x alone.'],
    s: 'From the similar triangles, s/(x + s) = 5/10, so 10s = 5x + 5s and s = x. The tip of the shadow is at x + s = 2x from the light, so it moves at 2(dx/dt) = 2(3) = 6 ft/s, twice as fast as the child.',
  },
  {
    t: 'rate of change of the distance between two moving cars', d: 3, need: 'calc',
    spec: tri({ sides: [30, 50, 40], sideLabels: ['auto', 'z', 'auto'], unit: 'mi', vertices: null }),
    alt: 'A right triangle with a horizontal base labelled 40 miles, a vertical side on the right labelled 30 miles and a small square marking the right angle between them. The slanted side is labelled z.',
    q: 'Two cars drive away from an intersection along perpendicular roads. The triangle shown gives their distances from the intersection at one instant; z is the distance between the cars. At that instant the car on the horizontal road is moving at 45 mi/h and the car on the vertical road at 60 mi/h. How fast is z increasing, in mi/h?',
    n: '72',
    calc: ['the two legs from the kind\'s model: dz/dt = (x·dx/dt + y·dy/dt)/z with dx/dt = 45 (horizontal leg), dy/dt = 60 (vertical leg)', (c) => { const m = triM(c); return round((m.c * 45 + m.a * 60) / m.b, 6); }],
    h: ['Call the legs x and y; then z² = x² + y². Differentiate with respect to time.', 'Find z at this instant from the two distances in the figure.'],
    s: 'With legs x = 40 mi and y = 30 mi from the figure, z = √(40² + 30²) = 50 mi. From z² = x² + y², z(dz/dt) = x(dx/dt) + y(dy/dt), so dz/dt = (40 × 45 + 30 × 60)/50 = 3600/50 = 72 mi/h.',
  },
]);

// ── AP Calculus AB · Disc and Washer Methods for Volumes ────────────────────
const rev = (params: P): Spec => solid({ solid: 'revolution', ...params });
const volume = (c: Ctx): number => c.num('solid_revolution_volume', { as: 'decimal' });
G('6f289059.lo-2', 'Disc method', [
  {
    t: 'volume by discs under a square-root curve', d: 2, need: 'calc',
    spec: rev({ axis: 'x', outer: { poly: [0, 1], sqrt: true, label: 'y = √x' }, from: 0, to: 4 }),
    alt: 'A coordinate grid with x and y axes. The region under the curve labelled y = √x, above the x-axis, is shaded with hatch lines from the origin to a right-hand boundary on the x-axis. A curved arrow shows the region being revolved about the x-axis, and one thin vertical strip is drawn in the region.',
    q: 'The shaded region shown is revolved about the x-axis. What is the volume of the solid generated?',
    o: [['8π', 'correct'], ['16π/3', 'integrates the radius √x instead of its square'], ['128π/5', 'revolves the region about the y-axis'], ['16π', 'forgets the factor one half when integrating x']],
    ck: ['solid_revolution_volume', { as: 'pi' }],
    h: ['A thin vertical strip sweeps out a disc whose radius is the height of the curve.', 'Read the limits of integration from where the shading starts and stops on the x-axis.'],
    s: 'The shading runs from x = 0 to x = 4 under y = √x. A strip at x sweeps out a disc of radius √x, so V = π∫₀⁴ (√x)² dx = π∫₀⁴ x dx = π[x²/2]₀⁴ = 8π.',
  },
  {
    t: 'set up the disc integral for a region under an unlabelled line', d: 3, need: 'reason',
    spec: rev({ axis: 'x', outer: { poly: [1, 0.5] }, from: 0, to: 2, xStep: 1, yStep: 1 }),
    alt: 'A coordinate grid with x and y axes numbered in steps of one. The region under a rising straight line, above the x-axis, is shaded with hatch lines between the y-axis and a right-hand boundary. A curved arrow shows the region being revolved about the x-axis. The line carries no equation.',
    q: 'Which integral gives the volume of the solid generated when the shaded region shown is revolved about the x-axis?',
    o: [['π ∫₀² (1 + x/2)² dx', 'correct'], ['π ∫₀² (1 + x/2) dx', 'integrates the radius instead of its square'], ['π ∫₀² (1 + 2x)² dx', 'inverts the slope of the line'], ['2π ∫₀² x(1 + x/2) dx', 'sets up shells about the y-axis']],
    holds: ['each option evaluated numerically (Simpson\'s rule) and compared with checker solid_revolution_volume {as: decimal}', [
      (c) => near(Math.PI * integrate((x) => (1 + x / 2) ** 2, 0, 2), volume(c), 1e-3),
      (c) => near(Math.PI * integrate((x) => 1 + x / 2, 0, 2), volume(c), 1e-3),
      (c) => near(Math.PI * integrate((x) => (1 + 2 * x) ** 2, 0, 2), volume(c), 1e-3),
      (c) => near(2 * Math.PI * integrate((x) => x * (1 + x / 2), 0, 2), volume(c), 1e-3),
    ]],
    h: ['Find the equation of the line from two grid points it passes through.', 'About the x-axis, each vertical strip becomes a disc of area π(radius)², where the radius is the height of the line.'],
    s: 'The line passes through (0, 1) and (2, 2), so its slope is 1/2 and its equation is y = 1 + x/2; the shading runs from x = 0 to x = 2. A strip at x sweeps out a disc of radius 1 + x/2, so V = π ∫₀² (1 + x/2)² dx.',
  },
]);

G('6f289059.lo-4', 'Washer method', [
  {
    t: 'volume by washers between a line and a parabola', d: 3, need: 'calc',
    spec: rev({ axis: 'x', outer: { poly: [0, 1], label: 'y = x' }, inner: { poly: [0, 0, 1], label: 'y = x²' }, from: 0, to: 1 }),
    alt: 'A coordinate grid with x and y axes. The region between the line labelled y = x and the curve labelled y = x², which meet at the origin and at one other point, is shaded with hatch lines. A curved arrow shows the region being revolved about the x-axis.',
    q: 'The shaded region shown, between the line and the parabola, is revolved about the x-axis. What is the volume of the solid generated?',
    o: [['2π/15', 'correct'], ['π/30', 'squares the difference of the two radii instead of subtracting their squares'], ['π/6', 'integrates the difference of the radii without squaring'], ['8π/15', 'adds the squares of the two radii']],
    ck: ['solid_revolution_volume', { as: 'pi' }],
    h: ['Each vertical strip sweeps out a washer: outer radius from the upper curve, inner radius from the lower curve.', 'The area of a washer is π(R² − r²), not π(R − r)².'],
    s: 'The curves meet at x = 0 and x = 1, and between them the line y = x is above y = x². A strip at x sweeps out a washer with R = x and r = x², so V = π∫₀¹ (x² − x⁴) dx = π(1/3 − 1/5) = 2π/15.',
  },
  {
    t: 'volume of a region revolved about the y-axis', d: 3, need: 'calc',
    spec: rev({ axis: 'y', outer: { poly: [4] }, inner: { poly: [0, 0, 1], label: 'y = x²' }, from: 0, to: 2, strip: false }),
    alt: 'A coordinate grid with x and y axes. The region between a horizontal line at the top and the curve labelled y = x², to the right of the y-axis, is shaded with hatch lines. A curved arrow shows the region being revolved about the y-axis.',
    q: 'The shaded region shown, bounded by the y-axis, the line y = 4 and the parabola, is revolved about the y-axis. What is the volume of the solid generated?',
    o: [['8π', 'correct'], ['128π/5', 'revolves the region about the x-axis'], ['16π/3', 'multiplies the area of the region by π'], ['16π', 'gives the whole cylinder of radius 2 and height 4']],
    ck: ['solid_revolution_volume', { as: 'pi' }],
    h: ['About the y-axis, slice horizontally: each slice at height y is a disc whose radius is the x-value on the parabola.', 'Write x² in terms of y and integrate over the range of y that the region covers.'],
    s: 'The region runs from y = 0 to y = 4, and at height y its right-hand edge is on y = x², where x² = y. A horizontal slice sweeps out a disc of area πx² = πy, so V = π∫₀⁴ y dy = π[y²/2]₀⁴ = 8π.',
  },
]);

// ── Precalculus · Oblique triangle area calculation ─────────────────────────
G('4f746fa4.lo-2', 'Area from two sides and the included angle', [
  {
    t: 'area from two sides and the angle between them', d: 2, need: 'calc',
    spec: tri({ sas: [8, 30, 12], sideLabels: [null, 'auto', 'auto'], angleLabels: ['auto', null, null], unit: 'cm' }),
    alt: 'A triangle ABC. The two sides that meet at vertex A are labelled with their lengths, AB = 12 centimetres and AC = 8 centimetres, and the angle between them at A is labelled 30 degrees. The third side has no label.',
    q: 'What is the area of the triangle shown, in square centimetres?',
    n: '24',
    ck: ['geo_area', {}],
    h: ['The labelled angle lies between the two labelled sides.', 'Use area = (1/2)ab sin C with those two sides and that angle.'],
    s: 'The figure gives sides of 12 cm and 8 cm with an included angle of 30°. Area = (1/2)(12)(8) sin 30° = 48 × 0.5 = 24 cm².',
  },
  {
    t: 'area of an isosceles triangle from a base angle', d: 3, need: 'calc',
    spec: tri({ sas: [10, 30, 10], sideLabels: [null, 'auto', null], ticks: [0, 1, 1], angleLabels: [null, 'auto', null] }),
    alt: 'A triangle ABC in which the sides AB and AC each carry one tick mark; side AC is labelled 10. The angle at vertex B is labelled 75 degrees. The side BC and the other angles have no labels.',
    q: 'In the triangle shown, the two sides marked with a tick are equal. What is the area of the triangle, in square units?',
    n: '25',
    ck: ['geo_area', {}],
    h: ['Angles opposite equal sides are equal: use that to find the angle between the two equal sides.', 'Then apply area = (1/2)ab sin C to the two equal sides.'],
    s: 'The ticks show AB = AC = 10. The angles opposite those sides are equal, so angle C = angle B = 75° and the angle at A is 180° − 150° = 30°. Area = (1/2)(10)(10) sin 30° = 25 square units.',
  },
]);

G('4f746fa4.lo-3', 'Heron\'s formula', [
  {
    t: 'area from three sides', d: 2, need: 'calc',
    spec: tri({ sides: [13, 14, 15], sideLabels: ['auto', 'auto', 'auto'], unit: 'm' }),
    alt: 'A triangle ABC with all three sides labelled with their lengths in metres: BC = 13, AC = 14 and AB = 15. No angles are labelled.',
    q: 'What is the area of the triangle shown, in square metres?',
    n: '84',
    ck: ['geo_area', {}],
    h: ['With three sides and no angle, use Heron\'s formula. Start with the semi-perimeter s.', 'Area = √(s(s − a)(s − b)(s − c)).'],
    s: 'The sides are 13, 14 and 15, so s = (13 + 14 + 15)/2 = 21. Area = √(21 × 8 × 7 × 6) = √7056 = 84 m².',
  },
  {
    t: 'altitude to a side from the three sides', d: 3, need: 'calc',
    spec: tri({ sides: [17, 10, 21], sideLabels: ['auto', 'auto', 'auto'], altitude: { from: 2, label: 'h' } }),
    alt: 'A triangle ABC with all three sides labelled with their lengths: BC = 17, AC = 10 and AB = 21. A dashed line labelled h runs from vertex C to the side AB and meets it at a right angle.',
    q: 'What is the length h of the altitude drawn to the longest side of the triangle shown?',
    n: '8',
    calc: ['2 × checker geo_area ÷ checker geo_side {side: 2} (the side the altitude meets)', (c) => round((2 * c.num('geo_area')) / c.num('geo_side', { side: 2 }), 6)],
    h: ['Find the area from the three sides with Heron\'s formula.', 'The same area equals one half of the base times the altitude drawn to that base.'],
    s: 'The sides are 17, 10 and 21, so s = 24 and the area is √(24 × 7 × 14 × 3) = √7056 = 84. The altitude h is drawn to the side of length 21, so (1/2)(21)h = 84 and h = 168/21 = 8.',
  },
]);

// ── Precalculus · Law of Sines ──────────────────────────────────────────────
const sinD = (v: number): number => Math.sin(deg(v));
const asinD = (v: number): number => (Math.asin(v) * 180) / Math.PI;
const LS_A = asinD((8 * sinD(70)) / 11); // angle A of the triangle with a = 8, b = 11, B = 70°
const LS_C = asinD((9 * sinD(110)) / 14); // angle C of the triangle with a = 14, c = 9, A = 110°
G('dcbdc785.lo-2', 'Finding a side with the Law of Sines', [
  {
    t: 'side opposite a given angle when the third angle must be found', d: 2, need: 'calc',
    spec: tri({ asa: [50, 12, 60], sideLabels: ['x', null, 'auto'], angleLabels: ['auto', 'auto', null] }),
    alt: 'A triangle ABC. The angle at A is labelled 50 degrees and the angle at B is labelled 60 degrees. The side AB between them is labelled 12 and the side BC, opposite A, is labelled x. The angle at C has no label.',
    q: 'What is the length x in the triangle shown, to the nearest tenth?',
    n: '9.8',
    ck: ['geo_side', { side: 0 }],
    h: ['The labelled side is opposite the angle that is not labelled: find that angle first.', 'Then set x / sin(angle opposite x) equal to 12 / sin(angle opposite 12).'],
    s: 'The third angle is C = 180° − 50° − 60° = 70°, and the side of 12 is opposite C. The side x is opposite the 50° angle, so x/sin 50° = 12/sin 70°, and x = 12 × 0.7660 ÷ 0.9397 = 9.8.',
  },
  {
    t: 'side opposite an obtuse angle', d: 2, need: 'calc',
    spec: tri({ asa: [35, (10 * sinD(100)) / sinD(35), 45], sideLabels: ['10', null, 'x'], angleLabels: ['auto', null, 'auto'] }),
    alt: 'A triangle ABC. The angle at A is labelled 35 degrees and the angle at C, at the top, is labelled 100 degrees. The side BC, opposite A, is labelled 10 and the base AB, opposite C, is labelled x.',
    q: 'To the nearest tenth, what is the length x of the base of the triangle shown?',
    n: '17.2',
    ck: ['geo_side', { side: 2 }],
    h: ['Pair each labelled side with the angle across the triangle from it.', 'x / sin(angle opposite x) = 10 / sin(angle opposite 10).'],
    s: 'The side of 10 is opposite the 35° angle and x is opposite the 100° angle. By the Law of Sines, x/sin 100° = 10/sin 35°, so x = 10 × 0.9848 ÷ 0.5736 = 17.2.',
  },
]);

G('dcbdc785.lo-3', 'Finding an angle with the Law of Sines', [
  {
    t: 'angle opposite the shorter of two given sides', d: 2, need: 'calc',
    spec: tri({ asa: [LS_A, (11 * sinD(180 - 70 - LS_A)) / sinD(70), 70], sideLabels: ['8', '11', null], angleLabels: ['θ', 'auto', null] }),
    alt: 'A triangle ABC. The angle at B is labelled 70 degrees and the angle at A is marked θ. The side BC, opposite A, is labelled 8 and the side AC, opposite B, is labelled 11. The base AB has no label.',
    q: 'What is the measure of the angle θ in the triangle shown, to the nearest tenth of a degree?',
    n: '43.1',
    ck: ['geo_angle', { vertex: 0 }],
    h: ['Pair each labelled side with the angle across from it: θ is opposite the side of 8.', 'sin θ / 8 = sin 70° / 11. The angle opposite the shorter side must be the smaller angle.'],
    s: 'The side of 8 is opposite θ and the side of 11 is opposite the 70° angle, so sin θ/8 = sin 70°/11. sin θ = 8 × 0.9397 ÷ 11 = 0.6834, and θ = 43.1°. (The other solution, 136.9°, is impossible: with the 70° angle the sum would exceed 180°.)',
  },
  {
    t: 'third angle after a Law of Sines step', d: 3, need: 'calc',
    spec: tri({ asa: [110, 9, 180 - 110 - LS_C], sideLabels: ['14', null, '9'], angleLabels: ['auto', '?', null] }),
    alt: 'A triangle ABC with an obtuse angle at A labelled 110 degrees. The side BC, opposite A, is labelled 14 and the base AB is labelled 9. The angle at B is marked with a question mark; the angle at C and the side AC have no labels.',
    q: 'What is the measure of the angle marked with a question mark in the triangle shown, to the nearest tenth of a degree?',
    n: '32.8',
    ck: ['geo_angle', { vertex: 1 }],
    h: ['The side opposite the marked angle is not given, so first find the angle opposite the side of 9 with the Law of Sines.', 'Then use the angle sum of the triangle.'],
    s: 'The side of 9 is opposite angle C and the side of 14 is opposite the 110° angle, so sin C = 9 × sin 110° ÷ 14 = 0.6041 and C = 37.2° (it must be acute, since A is obtuse). The marked angle is B = 180° − 110° − 37.2° = 32.8°.',
  },
]);

// ── Precalculus · Law of Cosines ────────────────────────────────────────────
G('e35a7d16.lo-2', 'Two sides and the included angle', [
  {
    t: 'third side of a SAS triangle', d: 2, need: 'calc',
    spec: tri({ sas: [5, 60, 8], sideLabels: ['x', 'auto', 'auto'], angleLabels: ['auto', null, null] }),
    alt: 'A triangle ABC. The two sides that meet at vertex A are labelled with their lengths, AB = 8 and AC = 5, and the angle between them at A is labelled 60 degrees. The third side BC is labelled x.',
    q: 'What is the length x in the triangle shown?',
    n: '7',
    ck: ['geo_side', { side: 0 }],
    h: ['The labelled angle is between the two labelled sides, and x is opposite it.', 'Use x² = b² + c² − 2bc cos A.'],
    s: 'The figure gives sides of 8 and 5 with an included angle of 60°. x² = 8² + 5² − 2(8)(5) cos 60° = 64 + 25 − 40 = 49, so x = 7.',
  },
  {
    t: 'perimeter of a triangle with an obtuse included angle', d: 3, need: 'calc',
    spec: tri({ sas: [7, 120, 8], sideLabels: [null, 'auto', 'auto'], angleLabels: ['auto', null, null] }),
    alt: 'A triangle ABC with an obtuse angle at A labelled 120 degrees. The two sides that meet at A are labelled with their lengths, AB = 8 and AC = 7. The third side BC has no label.',
    q: 'What is the perimeter of the triangle shown?',
    n: '28',
    ck: ['geo_perimeter', {}],
    h: ['Find the unlabelled side with the Law of Cosines; it is opposite the labelled angle.', 'The cosine of an obtuse angle is negative, so the last term is added.'],
    s: 'The unlabelled side a is opposite the 120° angle: a² = 8² + 7² − 2(8)(7) cos 120° = 64 + 49 + 56 = 169, so a = 13. The perimeter is 8 + 7 + 13 = 28.',
  },
]);

G('e35a7d16.lo-3', 'Three sides', [
  {
    t: 'angle opposite a given side of an SSS triangle', d: 2, need: 'calc',
    spec: tri({ sides: [7, 5, 8], sideLabels: ['auto', 'auto', 'auto'], angleLabels: ['?', null, null] }),
    alt: 'A triangle ABC with all three sides labelled with their lengths: BC = 7, AC = 5 and AB = 8. The angle at vertex A, opposite the side BC, is marked with a question mark.',
    q: 'What is the measure, in degrees, of the angle marked with a question mark in the triangle shown?',
    n: '60',
    ck: ['geo_angle', { vertex: 0 }],
    h: ['The marked angle is opposite the side of length 7.', 'Use cos A = (b² + c² − a²)/(2bc), with a the side opposite the angle.'],
    s: 'The marked angle at A is opposite the side of 7 and lies between the sides of 5 and 8. cos A = (5² + 8² − 7²)/(2 × 5 × 8) = 40/80 = 0.5, so A = 60°.',
  },
  {
    t: 'largest angle of an SSS triangle', d: 3, need: 'calc',
    spec: tri({ sides: [4, 6, 5], sideLabels: ['auto', 'auto', 'auto'] }),
    alt: 'A triangle ABC with all three sides labelled with their lengths: BC = 4, AC = 6 and AB = 5. No angles are labelled.',
    q: 'What is the measure of the largest angle of the triangle shown, to the nearest tenth of a degree?',
    n: '82.8',
    ck: ['geo_angle', { vertex: 1 }],
    h: ['The largest angle of a triangle is opposite its longest side.', 'Apply the Law of Cosines with the longest side as the side opposite the angle.'],
    s: 'The longest side is AC = 6, so the largest angle is at B, between the sides of 4 and 5. cos B = (4² + 5² − 6²)/(2 × 4 × 5) = 5/40 = 0.125, so B = 82.8°.',
  },
]);

// ── Precalculus · Degrees, radians, arc length, sector area ─────────────────
const sectorFig = (radius: number, degrees: number, extra: P = {}): Spec => circle({
  radius, points: [{ name: 'A', at: 0 }, { name: 'B', at: degrees }], radii: [{ to: 'A', label: 'auto' }, { to: 'B' }],
  angles: [{ vertex: 'center', from: 'A', to: 'B', label: 'auto' }], ...extra,
});
const piCoef = (v: number): string => `${round(v / Math.PI, 6)}π`;
G('ecdeb75a.lo-4', 'Arc length', [
  {
    t: 'arc length from a central angle in degrees', d: 2, need: 'calc',
    spec: sectorFig(6, 150, { arc: { from: 'A', to: 'B', label: 's' }, unit: 'cm' }),
    alt: 'A circle with centre O and two radii drawn to points A and B on it. The radius OA is labelled 6 centimetres and the angle AOB at the centre is labelled 150 degrees. The arc from A to B is drawn heavier and labelled s.',
    q: 'What is the length s of the arc AB in the circle shown, in centimetres?',
    o: [['5π', 'correct'], ['900', 'multiplies the radius by the angle in degrees'], ['15π', 'computes the area of the sector instead'], ['10π', 'uses the diameter in place of the radius']],
    ck: ['geo_circle', { want: 'arc_length', as: 'pi' }],
    h: ['The formula s = rθ needs the angle in radians.', 'Convert the angle with π radians = 180°.'],
    s: 'The figure gives r = 6 cm and a central angle of 150°, which is 150 × π/180 = 5π/6 radians. s = rθ = 6 × 5π/6 = 5π cm.',
  },
  {
    t: 'central angle in radians from an arc and the radius', d: 2, need: 'calc',
    spec: circle({ radius: 4, unit: 'cm', points: [{ name: 'A', at: 0 }, { name: 'B', at: (2.5 * 180) / Math.PI }], radii: [{ to: 'A', label: 'auto' }, { to: 'B' }], angles: [{ vertex: 'center', from: 'A', to: 'B', label: 'θ' }], arc: { from: 'A', to: 'B', label: '10 cm' } }),
    alt: 'A circle with centre O and two radii drawn to points A and B on it. The radius OA is labelled 4 centimetres and the angle AOB at the centre is marked θ. The arc from A to B is drawn heavier and labelled 10 centimetres.',
    q: 'In the circle shown, the heavier arc AB has the length marked on it. What is the central angle θ, in radians?',
    n: '2.5',
    calc: ['the kind\'s model: the marked arc\'s angle in radians (its printed length, 10, is checked to equal radius × angle)', (c) => {
      const m = c.model(geometryModel).circle;
      if (!m?.arc) throw new Error('no arc');
      const theta = deg(m.arc.degrees);
      if (!near(m.radius * theta, 10)) throw new Error('the printed arc length is not r·θ');
      return round(theta, 6);
    }],
    h: ['Arc length, radius and central angle are linked by s = rθ, with θ in radians.', 'Read s and r from the figure and solve for θ.'],
    s: 'The figure gives an arc of 10 cm on a circle of radius 4 cm. From s = rθ, θ = s/r = 10/4 = 2.5 radians.',
  },
]);

G('ecdeb75a.lo-5', 'Sector area', [
  {
    t: 'sector area from a central angle in degrees', d: 2, need: 'calc',
    spec: sectorFig(8, 135, { sector: { from: 'A', to: 'B' } }),
    alt: 'A circle with centre O and two radii drawn to points A and B on it. The radius OA is labelled 8 and the angle AOB at the centre is labelled 135 degrees. The sector between the two radii is shaded with hatch lines.',
    q: 'What is the area of the shaded sector of the circle shown?',
    o: [['24π', 'correct'], ['6π', 'computes the arc length instead'], ['48π', 'leaves out the factor one half'], ['4320', 'uses the angle in degrees in the formula']],
    ck: ['geo_circle', { want: 'sector_area', as: 'pi' }],
    h: ['The formula A = (1/2)r²θ needs the angle in radians.', 'Convert the angle with π radians = 180°.'],
    s: 'The figure gives r = 8 and a central angle of 135°, which is 3π/4 radians. A = (1/2)r²θ = (1/2)(64)(3π/4) = 24π.',
  },
  {
    t: 'area of the part of the circle outside a sector', d: 3, need: 'calc',
    spec: sectorFig(6, 60, { sector: { from: 'A', to: 'B' } }),
    alt: 'A circle with centre O and two radii drawn to points A and B on it. The radius OA is labelled 6 and the angle AOB at the centre is labelled 60 degrees. The sector between the two radii is shaded with hatch lines; the rest of the circle is unshaded.',
    q: 'What is the area of the unshaded part of the circle shown?',
    o: [['30π', 'correct'], ['6π', 'gives the area of the shaded sector'], ['36π', 'gives the area of the whole circle'], ['10π', 'gives the length of the unshaded arc']],
    calc: ['checker geo_circle: area of the circle less the area of the hatched sector, as a multiple of π', (c) => piCoef(c.num('geo_circle', { want: 'area' }) - c.num('geo_circle', { want: 'sector_area' }))],
    h: ['The unshaded part is the whole circle less the shaded sector, or a sector with the remaining angle.', 'Use the angle in radians, or the fraction of the full turn that the unshaded part covers.'],
    s: 'The figure gives r = 6 and a shaded angle of 60°, so the unshaded part covers 300°, or 5/6 of the circle. Its area is (5/6)π(6)² = (5/6)(36π) = 30π.',
  },
]);

// ══ ITEMS-END

// ── the 105-list objectives that still need a kind after batch 2 ─────────────
const NEEDS: Record<string, { kind: string; note: string }> = {
  '252560d4.lo-2': { kind: 'gel / amplification plot', note: 'PCR results are read from gel lanes (band present / absent) or a qPCR amplification plot' },
  '252560d4.lo-4': { kind: 'gel / amplification plot', note: 'bands in lanes against a size ladder' },
  '252560d4.lo-7': { kind: 'gel / amplification plot', note: 'a gel (and a sequence read-out) to combine' },
  'f9ff0f1c.lo-5': { kind: 'map', note: 'species ranges on a map of islands / continents' },
  '4dbe1414.lo-1': { kind: 'labelled biological diagram', note: 'a cell with lettered organelles' },
  'c1c96ad6.lo-1': { kind: 'labelled biological diagram', note: 'a membrane cross-section with lettered parts' },
  '87ef2ba6.lo-1': { kind: 'molecular structure', note: 'Lewis structures with bonds and lone pairs' },
  '87ef2ba6.lo-3': { kind: 'molecular structure', note: 'candidate Lewis structures to compare by formal charge' },
  '87ef2ba6.lo-4': { kind: 'molecular structure', note: 'resonance structures' },
  '4354050b.lo-1': { kind: 'molecular structure', note: 'Lewis structures with bonds and lone pairs' },
  '73571e58.lo-2': { kind: 'field lines / charge diagram', note: 'field lines around a BAR MAGNET, with compass positions — field_diagram draws the field of a wire and of a uniform region, not of a bar magnet' },
};
/** List objectives that batch 2 covers with a figure that is not exactly the one first asked for. */
const MAPPING_NOTES: Record<string, string> = {
  '73571e58.lo-1': 'drawn with the field lines round a current-carrying wire (direction of a magnetic field, compass needle); field_diagram has no bar-magnet variant',
  '846750a0.lo-4': 'the lamp-post and shadow triangles are drawn side by side (similar_triangles), not nested',
};

// ── seeded shuffle ──────────────────────────────────────────────────────────

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffled<T>(items: T[], seedText: string): T[] {
  const rnd = mulberry32(parseInt(simpleHash(seedText), 36));
  const a = items.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ── objectives: the lesson packs and the 105 list ───────────────────────────

interface Objective { loId: string; subject: string; skill: string; description: string; pack: string }
function loadObjectives(): Map<string, Objective> {
  const out = new Map<string, Objective>();
  for (const f of fs.readdirSync(PACKS).filter((x) => x.endsWith('.json')).sort()) {
    const pack = JSON.parse(fs.readFileSync(path.join(PACKS, f), 'utf8')) as { subject: string; skill: string; objectives: Array<{ objectiveLoId: string; description: string }> };
    for (const o of pack.objectives) out.set(o.objectiveLoId, { loId: o.objectiveLoId, subject: pack.subject, skill: pack.skill, description: o.description, pack: f.replace('.json', '') });
  }
  return out;
}
const shortOf = (loId: string): string => loId.replace(/^gen-([0-9a-f]{8})-[0-9a-f-]+\.(lo-\d+)$/, '$1.$2');

// ── build ───────────────────────────────────────────────────────────────────

async function main() {
  const argv = process.argv.slice(2);
  const outArg = argv.indexOf('--out');
  const outDir = outArg >= 0 ? argv[outArg + 1] : DEFAULT_OUT;
  const checkOnly = argv.includes('--check');
  const wip = argv.includes('--wip');
  const objectives = loadObjectives();
  const byShort = new Map([...objectives.values()].map((o) => [shortOf(o.loId), o]));
  const list105 = JSON.parse(fs.readFileSync(OBJECTIVES_105, 'utf8')) as Array<{ subject: string; title: string; objectiveLoId: string; description: string; why: string }>;
  const listIds = new Set(list105.map((o) => o.objectiveLoId));
  const rows60 = JSON.parse(fs.readFileSync(ROWS_60, 'utf8')) as Array<{ id: string; loId: string }>;
  const rowsB1 = JSON.parse(fs.readFileSync(path.join(BATCH1, 'final/figure-rows-batch1-151.json'), 'utf8')) as Array<{ id: string; loId: string }>;
  const mappingB1 = JSON.parse(fs.readFileSync(path.join(BATCH1, 'mapping.json'), 'utf8')) as Array<Record<string, unknown> & { loId: string; status: string }>;
  const covered = new Set([...rows60, ...rowsB1].map((r) => r.loId));

  if (argv.includes('--list-objectives')) {
    const per = new Map<string, Item[]>();
    for (const a of ITEMS) per.set(a.lo, [...(per.get(a.lo) ?? []), a]);
    for (const [lo, items] of per) {
      const o = byShort.get(lo);
      console.log(`${o?.pack ?? '???'} ${lo} ${o && listIds.has(o.loId) ? 'LIST' : '    '} ${items.length} | ${o?.subject} | ${o?.skill} | ${o?.description}`);
      for (const a of items) console.log(`      - [${a.spec.type}, ${a.need}, d${a.d}] ${a.t}`);
    }
    console.log(`${ITEMS.length} items on ${per.size} objectives`);
    return;
  }

  const problems: string[] = [];
  const notes: string[] = [];
  const now = new Date().toISOString();
  const rows: Array<Record<string, unknown>> = [];
  const proofs: Array<Record<string, unknown>> = [];
  const cards: string[] = [];
  const pngs: Array<{ id: string; svg: string }> = [];
  const perLo = new Map<string, string[]>();
  const meta: Array<{ id: string; lo: Objective; item: Item; format: string; proof: string }> = [];

  for (const [n, a] of ITEMS.entries()) {
    const obj = byShort.get(a.lo);
    const tag = `#${n + 1} ${a.lo} (${a.t})`;
    if (!obj) { problems.push(`${tag}: no objective ${a.lo} in the lesson packs`); continue; }
    a.list = listIds.has(obj.loId);
    if (covered.has(obj.loId)) problems.push(`${tag}: the objective already has figure items (the 60 rows or batch 1)`);
    const kinds = perLo.get(obj.loId) ?? [];
    if (kinds.includes(a.t)) problems.push(`${tag}: task kind repeated within the objective`);
    kinds.push(a.t);
    perLo.set(obj.loId, kinds);
    const id = itemIdOf(obj.loId, a.q);
    const bad = (m: string) => problems.push(`${tag}: ${m}`);

    try {
      const c = new Ctx(a.spec);
      const responseFormat: 'mcq' | 'numeric' = a.o ? 'mcq' : 'numeric';
      if (!BATCH2_KINDS.includes(a.spec.type)) bad(`${a.spec.type} is not a batch-2 kind`);
      if (!a.o === !a.n) bad('give options or a number, not both / neither');
      if ([a.ck, a.calc, a.holds].filter(Boolean).length !== 1) bad('give exactly one of ck / calc / holds');
      // The cases the renderer's author judged not good enough.
      const fp = a.spec.params;
      if (a.spec.type === 'field_diagram' && fp.variant === 'point_charges' && (fp.charges as unknown[]).length >= 3) bad('three point charges: the line counts are not reliable enough to ask about');
      if (a.spec.type === 'solid_3d' && fp.solid === 'composite' && fp.bottom === 'prism') bad('the prism + pyramid composite is not drawn well enough');
      if (a.spec.type === 'ray_diagram' && /mirror/.test(String(fp.element)) && Object.values((fp.show as P) ?? {}).filter((v) => v && v !== 'none').length >= 4) bad('a mirror diagram with (nearly) every label shown at once is too crowded');
      let answer = '';
      let choices: string[] = [];
      let rationales: string[] = [];
      let keyText = '';
      if (a.o) {
        if (a.o.length !== 4 || a.o[0][1] !== 'correct') bad('needs four options, the correct one first');
        const order = shuffled(a.o, a.q);
        choices = order.map((x) => x[0]);
        rationales = order.map((x) => x[1]);
        answer = 'ABCD'[order.indexOf(a.o[0])];
        keyText = a.o[0][0];
        if (new Set(choices.map((x) => canonText(x))).size !== 4) bad('options are not four distinct texts');
        // The product compares option texts case-insensitively.
        if (new Set(choices.map((x) => canonText(x).toLowerCase())).size !== 4) bad('two options differ only by letter case');
        const lens = choices.map((x) => x.length);
        if (Math.max(...lens) > Math.min(...lens) * 2 + 6) notes.push(`${tag}: option lengths ${lens.join('/')}`);
        if (lens.indexOf(Math.max(...lens)) === 'ABCD'.indexOf(answer) && Math.max(...lens) > [...lens].sort((x, y) => y - x)[1] * 1.35 + 3) bad(`the correct option is the longest by far (${lens.join('/')})`);
      } else if (a.n !== undefined) {
        answer = a.n;
        keyText = a.n;
        const key = parseNumericKey(answer);
        if (!key) bad(`the numeric key "${answer}" is not a plain number under the product's rule`);
      }

      // ── the proof ────────────────────────────────────────────────────────
      let proofKind: 'checker' | 'checker+code' | 'code' = 'code';
      let proofHow = '';
      let proofResult = '';
      let derivation = { checker: 'none', args: {} as P };
      if (a.ck) {
        derivation = { checker: a.ck[0], args: a.ck[1] };
        const d = runChecker(a.spec, derivation);
        proofKind = 'checker';
        proofHow = `figure-core checker ${a.ck[0]} ${JSON.stringify(a.ck[1])}`;
        proofResult = derivedText(d);
        // examineFigureItem (below) compares the result with the stored key.
      } else if (a.calc) {
        const v = a.calc[1](c);
        proofHow = a.calc[0];
        proofResult = String(v);
        if (a.o) {
          const hit = a.o.map((x) => canonText(x[0]) === canonText(String(v)));
          if (!(hit[0] && hit.slice(1).every((x) => !x))) bad(`the key does not follow from the spec — computed "${v}", options ${JSON.stringify(a.o.map((x) => x[0]))}`);
        } else {
          const stated = Number(answer);
          const places = (answer.split('.')[1] ?? '').length;
          const num = Number(v);
          const ok = Number.isFinite(num) && (near(num, stated) || (places > 0 && Math.abs(num - stated) <= 0.5 * 10 ** -places + 1e-9));
          if (!ok) bad(`stated key ${answer}, computed ${v}`);
        }
      } else if (a.holds) {
        if (!a.o || a.holds[1].length !== 4) bad('holds needs one test per option');
        const truth = a.holds[1].map((f) => f(c));
        proofHow = a.holds[0];
        proofResult = `options true of the figure, as written: [${truth.map((x, i) => (x ? a.o![i][0] : '')).filter(Boolean).join(' | ')}]`;
        if (!(truth[0] && truth.slice(1).every((x) => !x))) bad(`the key does not follow from the spec — truth of the options as written: ${JSON.stringify(truth)}`);
      }
      if (!a.ck && c.used.length) proofKind = 'checker+code';

      // ── the job's rule checks ────────────────────────────────────────────
      const figureItem = {
        objectiveLoId: obj.loId, responseFormat, problemText: a.q, answer, choices, hints: a.h, solutionText: a.s, difficulty: a.d,
        covers: obj.description, taskType: a.t, distractorRationales: rationales, figureSpec: a.spec, alt: a.alt, derivation,
      } as unknown as FigureItem;
      const exam = examineFigureItem(figureItem);
      for (const d of exam.defects) bad(`rule check — ${d}`);
      if (a.ck && exam.derivation.status !== 'derived') bad(`checker status ${exam.derivation.status}: ${exam.derivation.detail}`);
      for (const d of contentDefects(figureItem, { hasFigure: true } as never)) bad(`content check — ${d}`);
      const keyCanon = canonText(keyText).toLowerCase();
      for (const h of a.h) if (keyText.length > 2 && canonText(h).toLowerCase().includes(keyCanon)) bad('a hint contains the answer');
      if (/\\[a-zA-Z]|\$/.test([a.q, a.s, ...a.h, ...choices].join(' '))) bad('LaTeX in the text');
      if (a.h.length !== 2) bad('needs two hints');
      if (a.s.length < 60) bad('the solution is too short to name what is read from the figure');
      if (a.alt.length < 90) bad('the alt text is too short to be specific (name the components / taxa / labels shown)');

      const figure = buildPracticeFigure(a.spec, a.alt);
      const safety = validateFigureSvg(figure.svg);
      if (!safety.ok) bad(`svg safety — ${JSON.stringify(safety.issues)}`);
      if (figure.svg.length > MAX_FIGURE_SVG_CHARS) bad(`svg is ${figure.svg.length} chars`);
      const warnings = checkFigureLegibility(a.spec);
      if (warnings.length) bad(`legibility — ${warnings.map((w) => `${w.code}: ${w.message}`).join('; ')}`);
      const figureText = describeFigure(a.spec).text;

      rows.push({
        id, topic: obj.skill, topicId: obj.skill, loId: obj.loId, subtopic: a.sub, difficulty: a.d,
        problemText: a.q, answer, solutionText: a.s, hints: a.h, responseFormat, choices,
        figure,
        source: { name: 'Evelyn (practice-extend offline job, figure track — hand-authored batch-2 figures)' }, license: 'internal-original', verifiedAt: now,
        verifierModel: 'none — key proven from the figure spec in code + visual read',
      });
      proofs.push({ id, loId: obj.loId, kind: a.spec.type, format: responseFormat, need: a.need, key: answer, keyText, proof: proofKind, how: proofHow, result: proofResult, checkers: a.ck ? [{ checker: a.ck[0], args: a.ck[1], result: proofResult }] : c.used });
      meta.push({ id, lo: obj, item: a, format: responseFormat, proof: proofKind });
      pngs.push({ id, svg: figure.svg });
      cards.push(`<section id="${esc(id)}"><div class="fig">${figure.svg}</div><div class="q"><p class="meta">#${n + 1} · ${esc(id)}<br>${esc(obj.subject)} · ${esc(obj.skill)}${a.list ? ' · <b>105-list objective</b>' : ''}<br>${esc(obj.description)}<br>task: ${esc(a.t)} · difficulty ${a.d} · ${responseFormat} · ${esc(a.spec.type)} · asks: ${a.need}</p><p class="stem">${esc(a.q)}</p>${
        choices.length ? `<ol type="A">${choices.map((x, i) => `<li class="${'ABCD'[i] === answer ? 'key' : ''}">${esc(x)}${'ABCD'[i] === answer ? ' ✓' : ` <span class="why">— ${esc(rationales[i])}</span>`}</li>`).join('')}</ol>` : ''
      }<p><b>Key:</b> ${esc(answer)}${choices.length ? ` — ${esc(keyText)}` : ''}</p><p><b>Hints:</b> ${a.h.map(esc).join(' / ')}</p><p><b>Solution:</b> ${esc(a.s)}</p><p class="der"><b>Proof (${proofKind}):</b> ${esc(proofHow)} → ${esc(proofResult)}</p><p class="der"><b>Alt:</b> ${esc(a.alt)}</p><details><summary>spec · figure as text</summary><pre>${esc(JSON.stringify(a.spec, null, 1))}\n\n${esc(figureText)}</pre></details></div></section>`);
    } catch (e) {
      bad(`threw — ${(e as Error).message}`);
    }
  }

  // ── caps, ids, mapping ────────────────────────────────────────────────────
  const ids = rows.map((r) => r.id as string);
  if (new Set(ids).size !== ids.length) problems.push(`ids are not unique: ${ids.filter((x, i) => ids.indexOf(x) !== i).join(', ')}`);
  const taken = new Set([...rows60, ...rowsB1].map((r) => r.id));
  for (const r of rows) {
    if (!/^practice-gen\.gen-[0-9a-f-]+\.lo-\d+\.[0-9a-z]+$/.test(r.id as string) || !(r.id as string).startsWith(`practice-gen.${r.loId}.`)) problems.push(`${r.id}: id is not in the scheme / does not match its loId`);
    if (taken.has(r.id as string)) problems.push(`${r.id}: id already used by an earlier figure row`);
    if (r.responseFormat === 'mcq' && ((r.choices as string[]).length !== 4 || !/^[ABCD]$/.test(r.answer as string))) problems.push(`${r.id}: mcq without four options and a letter`);
  }
  for (const [lo, kinds] of perLo) {
    const cap = listIds.has(lo) ? 3 : 2;
    if (kinds.length > cap) problems.push(`${shortOf(lo)}: ${kinds.length} items, cap ${cap}`);
  }
  // Batch 1's mapping, with the needs-kind objectives re-decided.
  const mapping = mappingB1.map((o) => {
    const short = shortOf(o.loId);
    const mine = meta.filter((m) => m.lo.loId === o.loId);
    if (o.status !== 'needs-kind') {
      if (mine.length) problems.push(`${short}: has batch-2 items but was already ${o.status}`);
      return o;
    }
    const base = { loId: o.loId, subject: o.subject, skill: o.skill, objective: o.objective };
    if (mine.length) {
      if (NEEDS[short]) problems.push(`${short}: has items and is also listed as needing a kind`);
      return { ...base, status: 'now-authorable', kind: [...new Set(mine.map((m) => m.item.spec.type))].join(', '), items: mine.length, ...(MAPPING_NOTES[short] ? { note: MAPPING_NOTES[short] } : {}) };
    }
    if (!NEEDS[short]) { if (!wip) problems.push(`${short} (${o.skill}: ${o.objective}): neither items nor a missing kind`); return { ...base, status: 'unmapped' }; }
    return { ...base, status: 'needs-kind', kind: NEEDS[short].kind, note: NEEDS[short].note };
  }) as Array<Record<string, unknown> & { loId: string; status: string }>;
  for (const k of Object.keys(NEEDS)) if (!list105.some((o) => shortOf(o.objectiveLoId) === k)) problems.push(`NEEDS lists ${k}, which is not one of the 105`);

  const count = <T,>(xs: T[], key: (x: T) => string): Record<string, number> => xs.reduce((t, x) => ({ ...t, [key(x)]: (t[key(x)] ?? 0) + 1 }), {} as Record<string, number>);
  const needs = mapping.filter((m) => m.status === 'needs-kind') as unknown as Array<{ kind: string; subject: string; skill: string; objective: string; loId: string }>;
  const b1Needs = new Set(mappingB1.filter((m) => m.status === 'needs-kind').map((m) => m.loId));
  const nowB2 = mapping.filter((m) => m.status === 'now-authorable' && b1Needs.has(m.loId)) as unknown as Array<{ kind: string }>;
  const beyond = meta.filter((m) => m.item.need !== 'read').length;
  const summary = {
    generatedAt: now,
    items: rows.length,
    bySubject: count(meta, (m) => m.lo.subject),
    byKind: count(meta, (m) => m.item.spec.type),
    byFormat: count(meta, (m) => m.format),
    byProof: count(meta, (m) => m.proof),
    byDifficulty: count(meta, (m) => `d${m.item.d}`),
    asks: { ...count(meta, (m) => m.item.need), beyondAReadOff: beyond, share: rows.length ? Number((beyond / rows.length).toFixed(3)) : 0 },
    onListObjectives: meta.filter((m) => m.item.list).length,
    onOtherObjectives: meta.filter((m) => !m.item.list).length,
    objectivesWithItems: perLo.size,
    list105: {
      total: list105.length,
      coveredBeforeBatch2: mappingB1.filter((m) => m.status !== 'needs-kind' && m.status !== 'unmapped').length,
      neededAKindBeforeBatch2: b1Needs.size,
      nowAuthorableInBatch2: nowB2.length,
      coveredAfter: mapping.filter((m) => m.status !== 'needs-kind' && m.status !== 'unmapped').length,
      stillNeedingAKind: needs.length,
      nowAuthorableInBatch2ByKind: count(nowB2, (m) => m.kind),
    },
    needsKind: Object.fromEntries(Object.entries(count(needs, (m) => m.kind)).sort((x, y) => y[1] - x[1]).map(([kind, nn]) => [kind, { objectives: nn, list: needs.filter((m) => m.kind === kind).map((m) => `${m.subject} · ${m.skill} · ${m.objective}`) }])),
  };

  console.log(`${ITEMS.length} items declared, ${rows.length} built`);
  console.log(JSON.stringify({ bySubject: summary.bySubject, byKind: summary.byKind, byFormat: summary.byFormat, byProof: summary.byProof, asks: summary.asks, list105: summary.list105 }, null, 1));
  if (notes.length) console.log(`notes:\n  ${notes.join('\n  ')}`);
  if (problems.length && !wip) {
    console.error(`\n${problems.length} PROBLEM(S) — nothing written:\n  ${problems.join('\n  ')}`);
    process.exit(1);
  }
  if (problems.length) console.error(`\n${problems.length} PROBLEM(S) (work in progress — files written all the same):\n  ${problems.join('\n  ')}`);
  if (checkOnly) return;

  fs.mkdirSync(path.join(outDir, 'png'), { recursive: true });
  fs.mkdirSync(path.join(outDir, 'final'), { recursive: true });
  fs.mkdirSync(path.join(outDir, 'sheets'), { recursive: true });
  for (const d of ['png', 'sheets']) for (const f of fs.readdirSync(path.join(outDir, d))) if (f.endsWith('.png')) fs.unlinkSync(path.join(outDir, d, f));
  fs.writeFileSync(path.join(outDir, 'final', `figure-rows-batch2${wip ? '-wip' : ''}.json`), JSON.stringify(rows, null, 2) + '\n');
  if (!wip) {
    fs.writeFileSync(path.join(outDir, 'final', 'audited-figure-ids.json'), JSON.stringify(ids) + '\n');
    fs.writeFileSync(path.join(outDir, 'final', 'key-proofs.json'), JSON.stringify(proofs, null, 2) + '\n');
    fs.writeFileSync(path.join(outDir, 'mapping.json'), JSON.stringify(mapping, null, 2) + '\n');
    fs.writeFileSync(path.join(outDir, 'summary.json'), JSON.stringify(summary, null, 2) + '\n');
  }
  fs.writeFileSync(path.join(outDir, 'gallery.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Batch-2 figure practice items — gallery</title><style>
body{font:15px/1.5 system-ui,sans-serif;margin:24px;color:#1c1c1c;background:#f6f6f4}
h1{font-size:20px}section{display:flex;gap:24px;flex-wrap:wrap;background:#fff;border:1px solid #ddd;border-radius:8px;padding:16px;margin:0 0 16px}
.fig{width:340px;flex:none}.fig svg{width:340px;height:auto;display:block;border:1px dashed #bbb}.q{flex:1;min-width:300px}
.meta{font-size:12px;color:#666}.stem{font-weight:600}li.key{font-weight:700;color:#0a6b2d}.why{color:#777;font-weight:400;font-size:13px}.der{font-size:13px;color:#444}pre{font-size:12px;white-space:pre-wrap;background:#f8f8f6;padding:8px}
</style></head><body><h1>Batch-2 figure practice items — ${rows.length} items</h1><p>Each figure is shown at 340 px, as on the student's card. The key (✓) is proven from the figure spec in code; the proof line says how. No model was used. Generated ${esc(now)}.</p>${cards.join('\n')}</body></html>\n`);

  const mod = (await import('sharp')) as unknown as { default?: unknown };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sharp = (mod.default ?? mod) as any;
  for (const { id, svg } of pngs) await sharp(Buffer.from(svg), { density: 192 }).resize({ width: PNG_WIDTH }).png().toFile(path.join(outDir, 'png', `${id}.png`));

  // Contact sheets: six figures a sheet (three across), each under its item number; the stems and options beside them in index.txt.
  const W = 520;
  const COLS = 3;
  const PER = 6;
  const index: string[] = [];
  for (let s = 0; s < rows.length; s += PER) {
    const group = rows.slice(s, s + PER);
    const imgs: Array<{ buf: Buffer; h: number; n: number }> = [];
    for (const [k, r] of group.entries()) {
      const buf = (await sharp(path.join(outDir, 'png', `${r.id}.png`)).resize({ width: W }).png().toBuffer()) as Buffer;
      const m = (await sharp(buf).metadata()) as { height: number };
      imgs.push({ buf, h: m.height, n: s + k + 1 });
    }
    const rowsH: number[] = [];
    for (let i = 0; i < imgs.length; i += COLS) rowsH.push(Math.max(...imgs.slice(i, i + COLS).map((x) => x.h)) + 26);
    const comp: Array<{ input: Buffer; left: number; top: number }> = [];
    let y = 0;
    for (let i = 0; i < imgs.length; i += COLS) {
      imgs.slice(i, i + COLS).forEach((im, j) => {
        comp.push({ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="24"><rect width="${W}" height="24" fill="#222"/><text x="6" y="17" font-size="15" fill="#fff" font-family="Helvetica">#${im.n}</text></svg>`), left: j * W, top: y });
        comp.push({ input: im.buf, left: j * W, top: y + 24 });
      });
      y += rowsH[i / COLS];
    }
    const file = `sheet-${String(s + 1).padStart(3, '0')}.png`;
    await sharp({ create: { width: W * COLS, height: rowsH.reduce((x, z) => x + z, 0), channels: 3, background: '#888' } }).composite(comp).png().toFile(path.join(outDir, 'sheets', file));
    index.push(`== ${file}`);
    for (const [k, r] of group.entries()) {
      index.push(`#${s + k + 1} [${(r.figure as { spec: Spec }).spec.type}] ${r.problemText}`);
      index.push((r.choices as string[]).length ? `   ${(r.choices as string[]).map((x, i) => `${'ABCD'[i]}${'ABCD'[i] === r.answer ? '*' : ''}) ${x}`).join('  |  ')}` : `   key: ${r.answer}`);
    }
  }
  fs.writeFileSync(path.join(outDir, 'sheets', 'index.txt'), index.join('\n') + '\n');
  console.log(`\nwrote ${rows.length} rows, ${pngs.length} PNGs, ${Math.ceil(rows.length / PER)} sheets, gallery.html${wip ? '' : ', mapping.json, summary.json'} to ${outDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
