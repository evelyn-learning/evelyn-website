/**
 * Batch 2 of the figure kinds (circuit_diagram, phylogenetic_tree,
 * geometric_figure, ray_diagram, field_diagram, flow_diagram, solid_3d,
 * spectrum): the TEXT transcription of each figure and the deterministic
 * checkers, in the conventions of figure-core.ts §3a (batch 1):
 *   - each kind is read through the SAME model its renderer draws from
 *     (src/lib/tutor/practice-figure/kinds/*.ts), so the transcription and
 *     the checkers cannot disagree with the picture;
 *   - the transcription says exactly what is visible — a "?" on the figure
 *     is transcribed as a blank, never as the value under it; a value the
 *     spec holds but does not print is not mentioned;
 *   - a checker recomputes the key from the spec. It may use what is under a
 *     blank (that is the point); it refuses what the figure cannot settle.
 *
 * figure-core.ts registers this file (`describeFigure`, `runChecker`,
 * `checkerCatalogue`, `axesOf`). Nothing here imports figure-core.ts at run
 * time — only its `Derived` type — so either file can be loaded first. A
 * refusal is thrown as `Batch2RuleError`; figure-core.ts rethrows it as its
 * own `FigureRuleError`.
 *
 * Pure: no I/O, no network, no model, no database.
 */
import '../lib/no-db-env';
import type { PracticeFigureSpec } from '../../src/lib/tutor/practice-figure/render';
import { PracticeFigureSpecError, Reader } from '../../src/lib/tutor/practice-figure/spec';
import { BATCH2_FIGURE_KINDS, type Batch2FigureKind } from '../../src/lib/tutor/practice-figure/kinds/batch2';
import { piText } from '../../src/lib/tutor/practice-figure/kinds/draw';
import { circuitModel, fNum, solveCircuit, type CircuitLeaf, type CircuitModel, type CircuitNode, type CircuitSolution, type Frac } from '../../src/lib/tutor/practice-figure/kinds/circuit';
import { phyloModel, phyloTraits, type PhyloModel, type PhyloNode } from '../../src/lib/tutor/practice-figure/kinds/phylo-tree';
import { geometryModel, type CirclePoint, type GeoModel, type PolyModel } from '../../src/lib/tutor/practice-figure/kinds/geometry';
import { rayModel, type OpticsModel } from '../../src/lib/tutor/practice-figure/kinds/ray-diagram';
import { fieldAt, fieldModel, lineCounts, magneticForceDirection, wireFieldDirection, wireSideField, type Dir6, type FieldModel } from '../../src/lib/tutor/practice-figure/kinds/field-diagram';
import { flowModel, type FlowModel } from '../../src/lib/tutor/practice-figure/kinds/flow-diagram';
import { revolutionVolume, solidModel, type SolidModel } from '../../src/lib/tutor/practice-figure/kinds/solid-3d';
import { spectrumModel, type SpectrumModel } from '../../src/lib/tutor/practice-figure/kinds/spectrum';
import type { Derived } from './figure-core';

export { BATCH2_FIGURE_KINDS };
export type { Batch2FigureKind };

/** A spec or a derivation the figure cannot settle. Written for the writer model. */
export class Batch2RuleError extends Error {}

type P = Record<string, unknown>;
function fail(m: string): never {
  throw new Batch2RuleError(m);
}
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const fmt = (v: number): string => { const r = Number(v.toPrecision(10)); return String(Object.is(r, -0) ? 0 : r); };
const BLANK = '(blank — a "?" box)';
/** What is printed, with a "?" transcribed as a blank. */
const shown = (s: string): string => (s === '?' ? BLANK : `"${s.replace(/\?/g, '(blank)')}"`);

function modelOf<T>(spec: PracticeFigureSpec, build: (r: Reader) => T): T {
  try {
    return build(new Reader(spec.type, spec.params));
  } catch (e) {
    if (e instanceof PracticeFigureSpecError) return fail(e.message.replace(/^\[practice-figure:[^\]]+\]\s*/, ''));
    throw e;
  }
}

const num = (v: number): Derived => ({ kind: 'number', value: Number(v.toPrecision(12)) });
const approx = (v: number): Derived => ({ kind: 'number', value: Number(v.toPrecision(12)), approx: true });
const text = (value: string): Derived => ({ kind: 'text', value });
const label = (value: string): Derived => ({ kind: 'label', value });
const yesNo = (b: boolean): Derived => label(b ? 'yes' : 'no');
/** Exact when the value is a decimal of at most four places, otherwise marked as rounded. */
const measured = (v: number): Derived => (Math.abs(v * 1e4 - Math.round(v * 1e4)) < 1e-6 ? num(Math.round(v * 1e4) / 1e4) : approx(v));
const ofFrac = (f: Frac): Derived => measured(fNum(f));
/** c·π as "3π/10" when c is a fraction with a denominator up to 60. */
function piForm(c: number): Derived {
  for (let d = 1; d <= 60; d++) {
    const n = c * d;
    if (Math.abs(n - Math.round(n)) < 1e-9 * Math.max(1, Math.abs(n))) return text(piText(Math.round(n), d));
  }
  return fail('the result is not a simple fraction times π — ask for a decimal instead');
}
function argNum(a: P, k: string): number {
  const v = a[k];
  if (!isNum(v)) return fail(`derivation argument "${k}" must be a number`);
  return v;
}
function argIndex(a: P, k: string, n: number, what: string): number {
  const v = a[k] === undefined ? 0 : a[k];
  if (!isNum(v) || !Number.isInteger(v) || v < 0 || v >= n) return fail(`derivation argument "${k}" must be the 0-based index of a ${what} (0 to ${n - 1})`);
  return v;
}
function argStr(a: P, k: string): string {
  const v = a[k];
  if (typeof v !== 'string' || !v.trim()) return fail(`derivation argument "${k}" must be a name printed on (or given in) the figure`);
  return v.trim();
}
const pick = <T extends string>(a: P, k: string, allowed: readonly T[], dflt?: T): T => {
  const v = a[k] === undefined && dflt !== undefined ? dflt : a[k];
  if (typeof v !== 'string' || !allowed.includes(v as T)) return fail(`derivation argument "${k}" must be one of ${allowed.join(' | ')}`);
  return v as T;
};

// ── circuits ────────────────────────────────────────────────────────────────

const TYPE_WORDS: Record<string, string> = { resistor: 'a resistor (zigzag)', bulb: 'a bulb (a circle with a cross)', capacitor: 'a capacitor (two parallel plates)', switch: 'a switch', ammeter: 'an ammeter (a circle marked A)', voltmeter: 'a voltmeter (a circle marked V)', wire: 'a plain wire' };

function circuitText(m: CircuitModel, printed: string[], out: string[]): string {
  const b = m.battery;
  if (b.shown) printed.push(`battery label: ${shown(b.shown)}`);
  out.push(`One battery (two cells; its + terminal is at the ${b.positiveTop ? 'top' : 'bottom'})${b.shown ? `, labelled ${shown(b.shown)}` : ', with no label'}. Conventional current leaves the + terminal.`);
  if (b.current) {
    printed.push(`current arrow at the battery: ${shown(b.current)}`);
    out.push(`An arrow on the wire leaving the + terminal is labelled ${shown(b.current)}.`);
  }
  out.push('Following the current from the + terminal round the loop and back to the − terminal:');
  const leafLine = (l: CircuitLeaf): string => {
    if (l.shown) printed.push(`component label: ${shown(l.shown)}`);
    if (l.current) printed.push(`current arrow: ${shown(l.current)}`);
    const state = l.type === 'switch' ? (l.closed ? ', drawn CLOSED' : ', drawn OPEN') : '';
    return `${TYPE_WORDS[l.type]}${state}${l.shown ? ` labelled ${shown(l.shown)}` : l.type === 'wire' ? '' : ' with no label'}${l.current ? `, with a current arrow labelled ${shown(l.current)}` : ''}`;
  };
  const walk = (n: CircuitNode, indent: string): void => {
    if (n.kind === 'leaf') { out.push(`${indent}- ${leafLine(n)}`); return; }
    if (n.kind === 'series') { out.push(`${indent}- in series, one after another:`); n.children.forEach((c) => walk(c, `${indent}  `)); return; }
    out.push(`${indent}- the wire splits into ${n.children.length} parallel branches (joined again afterwards):`);
    n.children.forEach((c, i) => {
      out.push(`${indent}  branch ${i + 1}:`);
      walk(c, `${indent}    `);
    });
  };
  if (m.root.kind === 'series') m.root.children.forEach((c) => walk(c, '  '));
  else walk(m.root, '  ');
  return 'a circuit diagram (a battery and components joined by wires)';
}

function leafByName(m: CircuitModel, name: string): number {
  const i = m.leaves.findIndex((l) => l.name === name);
  if (i < 0) return fail(`the circuit has no component named "${name}" (names: ${m.leaves.map((l) => l.name).filter(Boolean).join(', ') || 'none'})`);
  return i;
}
function solved(m: CircuitModel, switches: unknown): CircuitSolution {
  const s: Record<string, boolean> = {};
  if (switches !== undefined && switches !== null) {
    if (typeof switches !== 'object' || Array.isArray(switches)) fail('derivation argument "switches" must be { name: true (closed) | false (open) }');
    for (const [k, v] of Object.entries(switches as P)) {
      if (m.leaves[leafByName(m, k)].type !== 'switch') fail(`"${k}" is not a switch`);
      if (typeof v !== 'boolean') fail(`switches.${k} must be true (closed) or false (open)`);
      s[k] = v as boolean;
    }
  }
  try {
    return solveCircuit(m, s);
  } catch (e) {
    return fail((e as Error).message);
  }
}
const QUANTITIES = ['current', 'voltage', 'power'] as const;
function quantityOf(m: CircuitModel, sol: CircuitSolution, component: string, q: (typeof QUANTITIES)[number]): number {
  if (component === 'battery') return q === 'current' ? fNum(sol.current) : q === 'voltage' ? m.battery.emf : m.battery.emf * fNum(sol.current);
  const st = sol.leaves[leafByName(m, component)];
  const f = q === 'current' ? st.I : q === 'voltage' ? st.V : st.P;
  if (Number.isNaN(f.n)) return fail(`the ${q} of "${component}" is not fixed by the circuit as drawn`);
  return fNum(f);
}

function capacitance(n: CircuitNode): number | null {
  if (n.kind === 'leaf') {
    if (n.type === 'capacitor') return n.value === undefined ? fail(`${n.at} has no value`) : n.value;
    if (n.type === 'wire' || (n.type === 'switch' && n.closed)) return null;
    return fail(`an equivalent capacitance needs a network of capacitors only — ${n.at} is a ${n.type}`);
  }
  const cs = n.children.map(capacitance).filter((c): c is number => c !== null);
  if (cs.length === 0) return null;
  if (n.kind === 'parallel') return cs.length < n.children.length ? fail('a plain wire in parallel with a capacitor short-circuits it') : cs.reduce((a, c) => a + c, 0);
  return 1 / cs.reduce((a, c) => a + 1 / c, 0);
}

// ── phylogenetic trees ──────────────────────────────────────────────────────

function phyloText(m: PhyloModel, printed: string[], out: string[]): string {
  const tipName = (n: PhyloNode): string => (n.blank ? BLANK : `"${n.name}"`);
  out.push(`A rooted cladogram: the root is on the left, the ${m.tips.length} tips are in one column on the right. Branch lengths mean nothing; only the branching order does.`);
  out.push(`Tips, top to bottom: ${m.tips.map(tipName).join(', ')}.`);
  m.tips.forEach((n) => printed.push(`tip label: ${n.blank ? BLANK : `"${n.name}"`}${n.name === m.outgroup ? ' followed by "(outgroup)"' : ''}`));
  const all = phyloTraits(m);
  const describe = (n: PhyloNode): string => (n.children.length === 0 ? `the tip ${tipName(n)}` : `${n.node ? `the node labelled "${n.node}"` : 'an unlabelled branch point'} (leading to ${n.tips.map((nm) => { const t = m.tips.find((x) => x.name === nm) as PhyloNode; return tipName(t); }).join(', ')})`);
  out.push('Branching, from the root:');
  const walk = (n: PhyloNode, indent: string): void => {
    if (n.children.length === 0) return;
    if (n.node) printed.push(`node label: "${n.node}"`);
    out.push(`${indent}${n === m.root ? 'The root' : 'Then'} ${n.node ? `(node "${n.node}") ` : ''}splits into ${n.children.length} branches: ${n.children.map(describe).join('; ')}.`);
    n.children.forEach((c) => walk(c, `${indent}  `));
  };
  walk(m.root, '  ');
  if (all.length) {
    out.push('Tick marks on branches (each marks where a derived trait arose; everything further along that branch has it):');
    all.forEach(({ trait, on }, i) => {
      printed.push(`trait label: ${trait.blank ? BLANK : `"${trait.label}"`}`);
      out.push(`  tick ${i + 1}, ${trait.blank ? `its name is ${BLANK}` : `"${trait.label}"`}: on the branch leading to ${on === m.root ? 'the root (so every tip has it)' : describe(on)}.`);
    });
  }
  return 'a cladogram (a phylogenetic tree)';
}

function tipNode(m: PhyloModel, name: string): PhyloNode {
  const t = m.tips.find((x) => x.name === name);
  return t ?? fail(`the tree has no tip named "${name}" (tips: ${m.tips.map((x) => x.name).join(', ')})`);
}
function taxaArg(m: PhyloModel, a: P, k: string, min: number): PhyloNode[] {
  const v = a[k];
  if (!Array.isArray(v) || v.length < min || !v.every((x) => typeof x === 'string')) return fail(`derivation argument "${k}" must be a list of at least ${min} tip names`);
  return [...new Set(v as string[])].map((nm) => tipNode(m, nm));
}
function mrca(tips: PhyloNode[]): PhyloNode {
  const names = tips.map((t) => t.name as string);
  let n: PhyloNode = tips[0];
  while (!names.every((nm) => n.tips.includes(nm))) n = n.parent as PhyloNode;
  return n;
}
const depthOf = (n: PhyloNode): number => (n.parent ? depthOf(n.parent) + 1 : 0);

// ── geometry ────────────────────────────────────────────────────────────────

function polyText(pm: PolyModel, printed: string[], out: string[], name: string): void {
  const n = pm.pts.length;
  const V = (i: number): string => (pm.names ? pm.names[i % n] : `vertex ${(i % n) + 1}`);
  out.push(`${name}${pm.names ? ` with vertices labelled ${pm.names.join(', ')}` : ' (its vertices are not named)'}.`);
  pm.sideLabels.forEach((s, i) => {
    const ticks = pm.ticks[i] ? `; it carries ${pm.ticks[i]} tick mark${pm.ticks[i] > 1 ? 's' : ''}` : '';
    if (s !== null) printed.push(`side label: ${shown(s)}`);
    if (s !== null || ticks) out.push(`  side ${V(i)}–${V(i + 1)}: ${s === null ? 'no label' : `labelled ${shown(s)}`}${ticks}.`);
  });
  pm.angles.forEach((deg, i) => {
    const right = pm.rightAngleMarks && Math.abs(deg - 90) < 1e-6;
    const s = pm.angleLabels[i];
    if (s !== null && !(right && /^90(\.0)?°$/.test(s))) printed.push(`angle label: ${shown(s)}`);
    if (right) out.push(`  the angle at ${V(i)} carries a right-angle mark (a small square)${s !== null && !/^90(\.0)?°$/.test(s) ? ` and the label ${shown(s)}` : ''}.`);
    else if (s !== null) out.push(`  the angle at ${V(i)} has an arc and is labelled ${shown(s)}.`);
  });
  if (pm.ticks.some((k) => k > 0)) out.push('  Sides with the same number of tick marks are equal in length.');
  if (pm.altitude) {
    if (pm.altitude.label !== null) printed.push(`altitude label: ${shown(pm.altitude.label)}`);
    out.push(`  A dashed line from ${V(pm.altitude.from)} meets the opposite side at a right angle (a small square)${pm.altitude.label === null ? '' : `, labelled ${shown(pm.altitude.label)}`}.`);
  }
}

function geometryText(m: GeoModel, printed: string[], out: string[]): string {
  if (m.notToScale) printed.push('note: "not to scale"');
  out.push(m.notToScale ? 'The figure carries the note "not to scale": only the printed labels and marks count.' : 'There are no axes and no grid; nothing can be measured off the figure except by the printed labels and marks.');
  if (m.poly) {
    polyText(m.poly, printed, out, m.shape === 'triangle' ? 'A triangle' : `A polygon with ${m.poly.pts.length} sides`);
    return m.shape === 'triangle' ? 'a triangle' : 'a polygon';
  }
  if (m.similar) {
    polyText(m.similar.first, printed, out, 'The first triangle (on the left)');
    polyText(m.similar.second, printed, out, 'The second triangle (on the right)');
    return 'two triangles drawn side by side';
  }
  if (m.parallel) {
    const pl = m.parallel;
    if (pl.lineNames) printed.push(`line names: "${pl.lineNames.join('", "')}"`);
    out.push(`Two parallel horizontal lines${pl.lineNames ? ` ("${pl.lineNames[0]}" above, "${pl.lineNames[1]}" below)` : ''}, each with an arrow mark showing they are parallel, cut by one slanted line${pl.lineNames ? ` ("${pl.lineNames[2]}")` : ''} that rises to the ${pl.angle < 90 ? 'right' : pl.angle > 90 ? 'left' : 'top (it is perpendicular)'}.`);
    const where = ['above the line, left of the transversal', 'above the line, right of the transversal', 'below the line, left of the transversal', 'below the line, right of the transversal'];
    for (const [k, s] of Object.entries(pl.labels)) {
      printed.push(`angle label: ${shown(s)}`);
      out.push(`  At the ${Number(k) <= 4 ? 'upper' : 'lower'} crossing, the angle ${where[(Number(k) - 1) % 4]} is labelled ${shown(s)}.`);
    }
    return 'two parallel lines cut by a transversal';
  }
  const c = m.circle as NonNullable<GeoModel['circle']>;
  const clock = (q: CirclePoint): string => {
    const h = ((Math.round(((90 - q.at) / 30) % 12) + 12) % 12) || 12;
    return `near ${h} o'clock`;
  };
  out.push(`A circle${c.center ? ` with its centre marked "${c.center}"` : ' with its centre marked by a dot'}.`);
  if (c.center) printed.push(`centre label: "${c.center}"`);
  if (c.points.length) {
    out.push(`Points on the circle: ${c.points.map((q) => `"${q.name}" (${clock(q)})`).join(', ')}.`);
    c.points.forEach((q) => printed.push(`point label: "${q.name}"`));
  }
  const O = c.center ?? 'the centre';
  c.radii.forEach((x) => { if (x.label !== null) printed.push(`radius label: ${shown(x.label)}`); out.push(`  A radius from ${O} to ${x.to.name}${x.label === null ? '' : `, labelled ${shown(x.label)}`}.`); });
  c.chords.forEach((x) => {
    if (x.label !== null) printed.push(`chord label: ${shown(x.label)}`);
    const through = Math.abs(Math.abs(x.from.at - x.to.at) % 360 - 180) < 1e-6;
    out.push(`  A straight segment from ${x.from.name} to ${x.to.name}${through ? ', passing through the centre' : ''}${x.label === null ? '' : `, labelled ${shown(x.label)}`}.`);
  });
  if (c.tangent) {
    if (c.tangent.label !== null) printed.push(`tangent label: ${shown(c.tangent.label)}`);
    if (c.tangent.end) printed.push(`point label: "${c.tangent.end}"`);
    out.push(`  A line touches the circle at ${c.tangent.at.name} only${c.tangent.length !== undefined ? ` and ends at an outside point${c.tangent.end ? ` "${c.tangent.end}"` : ''}; a dashed segment joins ${O} to that point` : ''}${c.tangent.label === null ? '' : `; the part from ${c.tangent.at.name} to the outside point is labelled ${shown(c.tangent.label)}`}${c.radii.some((x) => x.to === c.tangent?.at) ? `; a right-angle mark sits between it and the radius at ${c.tangent.at.name}` : ''}.`);
  }
  c.angles.forEach((x) => {
    if (x.label !== null) printed.push(`angle label: ${shown(x.label)}`);
    out.push(`  The angle at ${x.vertex === 'center' ? O : x.vertex.name} between the segments to ${x.from.name} and to ${x.to.name} has an arc${x.label === null ? '' : ` and is labelled ${shown(x.label)}`}.`);
  });
  if (c.sector) out.push(`  The sector between the radii to ${c.sector.from.name} and to ${c.sector.to.name} (counter-clockwise from ${c.sector.from.name}) is hatched.`);
  if (c.arc) {
    if (c.arc.label !== null) printed.push(`arc label: ${shown(c.arc.label)}`);
    out.push(`  The arc from ${c.arc.from.name} counter-clockwise to ${c.arc.to.name} is drawn heavier${c.arc.label === null ? '' : ` and labelled ${shown(c.arc.label)}`}.`);
  }
  return 'a circle with points, segments and angles';
}

function polyOf(m: GeoModel, a: P): PolyModel {
  if (m.poly) return m.poly;
  if (m.similar) return argIndex(a, 'triangle', 2, 'triangle (0 = the first, 1 = the second)') === 0 ? m.similar.first : m.similar.second;
  return fail('this checker is for a triangle, a polygon or a pair of similar triangles');
}
/** Triangle lists are in a / b / c order (side a is opposite the first vertex): index → side index of the model. */
const triSide = (m: GeoModel, i: number): number => (m.shape === 'polygon' ? i : [1, 2, 0][i]);
function shoelace(pts: Array<[number, number]>): number {
  let s = 0;
  pts.forEach((p, i) => { const q = pts[(i + 1) % pts.length]; s += p[0] * q[1] - q[0] * p[1]; });
  return Math.abs(s) / 2;
}
const AS = ['decimal', 'pi'] as const;
const CIRCLE_WANTS = ['circumference', 'area', 'arc_length', 'sector_area', 'chord_length', 'centre_to_external_point'] as const;

// ── ray diagrams ────────────────────────────────────────────────────────────

function rayText(spec: PracticeFigureSpec, printed: string[], out: string[]): string {
  const m = modelOf(spec, rayModel);
  if (m.element === 'interface') {
    out.push('A horizontal boundary between two media; a dashed vertical line through the point of incidence is labelled "normal". Angles are measured from the normal.');
    printed.push('label: "normal"');
    ([0, 1] as const).forEach((i) => {
      const n = i === 0 ? m.n1 : m.n2;
      const idx = m.showN[i] === 'none' ? '' : m.showN[i] === 'blank' ? 'n = (blank)' : `n = ${n.toFixed(2)}`;
      if (m.media) printed.push(`medium label: "${m.media[i]}"`);
      if (idx) printed.push(`index label: "${idx}"`);
      out.push(`The ${i === 0 ? 'upper' : 'lower'} medium${m.media ? ` is labelled "${m.media[i]}"` : ' has no name'}${idx ? `, with "${idx}"` : ', with no index printed'}.`);
    });
    const ang = (s: string | null): string => (s === null ? 'no angle label' : `an arc from the normal labelled ${shown(s)}`);
    for (const s of [m.labels.incident, m.labels.reflected, m.labels.refracted]) if (s !== null) printed.push(`angle label: ${shown(s)}`);
    out.push(`The incident ray arrives from the upper left: ${ang(m.labels.incident)}.`);
    if (m.reflected) out.push(`A reflected ray leaves to the upper right: ${ang(m.labels.reflected)}.`);
    out.push(m.refracted ? `A refracted ray continues into the lower medium, bent ${m.n2 > m.n1 ? 'towards' : m.n2 < m.n1 ? 'away from' : 'neither towards nor away from'} the normal: ${ang(m.labels.refracted)}.` : 'No refracted ray is drawn.');
    return 'a ray of light meeting the boundary between two media';
  }
  const lens = !m.mirror;
  const thing = lens ? 'lens' : 'mirror';
  out.push(`A ${m.element.replace('_', ' ')} on a horizontal principal axis (${lens ? (m.f > 0 ? 'drawn thicker in the middle' : 'drawn thinner in the middle') : `a curved line with short strokes on its back; the reflecting side faces left and ${m.f > 0 ? 'curves towards the object' : 'bulges towards the object'}`}). The horizontal and vertical scales differ.`);
  if (m.focalMarks) {
    printed.push(...(lens ? ['focal marks: "F", "2F" on each side'] : ['marks on the axis: "F", "C"']));
    out.push(lens ? 'Dots on the axis are labelled F and 2F on both sides of the lens.' : `Dots on the axis are labelled F and C, ${m.f > 0 ? 'in front of the mirror (on the object\'s side)' : 'behind the mirror'}.`);
  }
  const between = (d: number): string => {
    const fa = Math.abs(m.f);
    if (Math.abs(d - fa) < 1e-9) return 'at the distance of F';
    if (Math.abs(d - 2 * fa) < 1e-9) return `at the distance of ${lens ? '2F' : 'C'}`;
    return d < fa ? `nearer than F` : d < 2 * fa ? `between F and ${lens ? '2F' : 'C'}` : `beyond ${lens ? '2F' : 'C'}`;
  };
  out.push(`The object is an upright arrow standing on the axis to the left of the ${thing}${m.focalMarks ? `, ${between(m.dO)}` : ''}.`);
  if (m.rays.length) {
    const what = (k: number): string => {
      if (k === 1) return 'one runs parallel to the axis';
      if (lens) return k === 2 ? 'one passes straight through the centre of the lens' : m.f > 0 ? 'one passes through the focal point on the object\'s side' : 'one heads for the focal point on the far side';
      return k === 2 ? (m.f > 0 ? 'one passes through (or runs in line with) F' : 'one heads for F behind the mirror') : 'one strikes the mirror where the axis meets it';
    };
    out.push(`${m.rays.length} ray${m.rays.length > 1 ? 's leave' : ' leaves'} the tip of the object: ${m.rays.map(what).join('; ')}. After the ${thing} ${m.rays.length > 1 ? 'they' : 'it'} ${m.real ? `${lens ? 'continue on the far side' : 'return on the object\'s side'} and cross at one point` : `spread apart; dashed lines trace them back to one point ${lens ? 'on the object\'s side of the lens' : 'behind the mirror'}`}.`);
  }
  if (m.showImage) out.push(`The image is drawn as ${m.real ? 'a solid' : 'a dashed'} arrow ${lens ? (m.real ? 'on the far side of the lens' : 'on the same side as the object') : m.real ? 'in front of the mirror' : 'behind the mirror'}, pointing ${m.upright ? 'up' : 'down'}; it is drawn ${Math.abs(Math.abs(m.magnification) - 1) < 1e-9 ? 'the same height as' : Math.abs(m.magnification) > 1 ? 'taller than' : 'shorter than'} the object.`);
  else out.push('No image arrow is drawn.');
  const dims: Array<[keyof OpticsModel['show'], string, number]> = [['objectDistance', 'object distance d_o', m.dO], ['imageDistance', 'image distance d_i', Math.abs(m.dI)], ['focalLength', 'focal length f', Math.abs(m.f)], ['objectHeight', 'object height h', m.hO], ['imageHeight', "image height h'", Math.abs(m.hI)]];
  for (const [k, name, v] of dims) {
    if (m.show[k] === 'none' || ((k === 'imageHeight') && !m.showImage)) continue;
    const s = m.show[k] === 'blank' ? '(blank)' : `${fmt(Number(v.toFixed(2)))} ${m.unit}`;
    printed.push(`${name}: "${s}"`);
    out.push(`Printed: ${name} = ${s}${m.show[k] === 'value' && (k === 'imageDistance' || k === 'imageHeight') ? ' (a size, without sign)' : ''}.`);
  }
  return `a ray diagram for a ${thing}`;
}

function optics(spec: PracticeFigureSpec): OpticsModel {
  const m = modelOf(spec, rayModel);
  if (m.element === 'interface') return fail('this checker is for a lens or a mirror, not for a plane interface');
  if (!Number.isFinite(m.dI)) return fail('the object is at the focal point: no image is formed');
  return m;
}

// ── fields ──────────────────────────────────────────────────────────────────

const DIR_WORDS: Record<Dir6, string> = { up: 'up', down: 'down', left: 'left', right: 'right', into: 'into the page', out: 'out of the page' };
const COMPASS = ['right', 'up and to the right', 'up', 'up and to the left', 'left', 'down and to the left', 'down', 'down and to the right'];

function fieldText(m: FieldModel, printed: string[], out: string[]): string {
  const chargeWord = (c: { positive: boolean; showSign: boolean; label?: string }): string => `${c.showSign ? `a circle marked "${c.positive ? '+' : '−'}"` : 'an empty circle (its sign is not shown)'}${c.label ? ` labelled ${shown(c.label)}` : ''}`;
  if (m.variant === 'point_charges') {
    const counts = lineCounts(m);
    out.push(`Electric field lines round ${m.charges.length} point charge${m.charges.length > 1 ? 's' : ''}, inside a frame. ${m.arrows ? 'Each line carries an arrowhead showing the direction of the field.' : 'The lines carry no arrowheads.'}`);
    const order = [...m.charges.keys()].sort((a, b) => m.charges[a].x - m.charges[b].x || m.charges[b].y - m.charges[a].y);
    order.forEach((i, k) => {
      const c = m.charges[i];
      if (c.label) printed.push(`charge label: ${shown(c.label)}`);
      if (c.showSign) printed.push(`sign in the charge: "${c.q > 0 ? '+' : '−'}"`);
      const others = m.charges.filter((_, j) => j !== i);
      const where = others.length === 0 ? 'in the middle' : `${c.x < Math.min(...others.map((o) => o.x)) ? 'furthest left' : c.x > Math.max(...others.map((o) => o.x)) ? 'furthest right' : 'between the others'}${Math.abs(c.y - others[0].y) > 1e-9 ? (c.y > Math.max(...others.map((o) => o.y)) ? ', highest' : c.y < Math.min(...others.map((o) => o.y)) ? ', lowest' : '') : ''}`;
      out.push(`  Charge ${k + 1} (${where}): ${chargeWord({ positive: c.q > 0, showSign: c.showSign, label: c.label })}; ${counts[i]} lines meet it${m.arrows ? `, all pointing ${c.q > 0 ? 'away from' : 'towards'} it` : ''}.`);
    });
    m.points.forEach((q) => { printed.push(`point label: "${q.label}"`); out.push(`  A dot labelled "${q.label}" marks a point in the field.`); });
    if (m.equipotentials.length) out.push(`  ${m.equipotentials.length} dashed curve${m.equipotentials.length > 1 ? 's cross' : ' crosses'} the field lines at right angles (equipotentials).`);
    return 'a diagram of electric field lines';
  }
  if (m.variant === 'uniform') {
    const vertical = m.direction === 'up' || m.direction === 'down';
    const plus = { up: 'lower', down: 'upper', left: 'right-hand', right: 'left-hand' }[m.direction];
    out.push(`Two parallel ${vertical ? 'horizontal' : 'vertical'} plates. ${m.showSigns ? `The ${plus} plate carries + signs and the other − signs.` : 'The plates carry no signs.'}`);
    if (m.showSigns) printed.push('signs along the plates: "+", "−"');
    if (m.showField) { printed.push('field label: "E"'); out.push(`Evenly spaced arrows labelled "E" run from one plate to the other, pointing ${m.direction}.`); } else out.push('No field arrows are drawn.');
    if (m.charge) {
      if (m.charge.label) printed.push(`charge label: "${m.charge.label}"`);
      out.push(`Between the plates: ${chargeWord(m.charge)}.${m.charge.showForce ? ` A heavy arrow labelled "F" on it points ${m.direction === 'up' ? (m.charge.positive ? 'up' : 'down') : m.direction === 'down' ? (m.charge.positive ? 'down' : 'up') : m.direction === 'left' ? (m.charge.positive ? 'left' : 'right') : m.charge.positive ? 'right' : 'left'}.` : ' No force arrow is drawn.'}`);
      if (m.charge.showForce) printed.push('force label: "F"');
    }
    if (m.separation && m.separation.show !== 'none') { const s = `plate separation d = ${m.separation.show === 'blank' ? '(blank)' : `${fmt(m.separation.value)} ${m.separation.unit}`}`; printed.push(`caption: "${s}"`); out.push(`Caption: ${s}.`); }
    if (m.voltage && m.voltage.show !== 'none') { const s = `potential difference V = ${m.voltage.show === 'blank' ? '(blank)' : `${fmt(m.voltage.value)} V`}`; printed.push(`caption: "${s}"`); out.push(`Caption: ${s}.`); }
    return 'a diagram of the electric field between two charged plates';
  }
  const KEY = 'A key under the figure says: a circle with a dot = out of the page, a circle with a cross = into the page.';
  if (m.variant === 'wire' && m.view === 'cross_section') {
    printed.push('label: "wire"');
    out.push(`A wire seen end-on (a small circle labelled "wire") with three circular field lines round it. ${m.showCurrent ? `The wire's circle holds a ${m.current === 'out' ? 'dot' : 'cross'}. ${KEY.replace('A key', 'A key (for the current)')}` : 'The wire\'s circle is empty (the direction of the current is not shown).'}`);
    out.push(m.showDirection ? `Arrowheads on the rings run ${m.current === 'out' ? 'counter-clockwise' : 'clockwise'}.` : 'The rings carry no arrowheads.');
    if (m.point) { printed.push(`point label: "${m.point.label}"`); out.push(`A dot labelled "${m.point.label}" is on the middle ring, ${m.point.side === 'above' || m.point.side === 'below' ? m.point.side : `to the ${m.point.side} of`} the wire.`); }
    return 'a diagram of the magnetic field round a straight wire';
  }
  if (m.variant === 'wire') {
    const horizontal = m.current === 'left' || m.current === 'right';
    out.push(`A long straight wire drawn ${horizontal ? 'horizontally' : 'vertically'} in the page. ${m.showCurrent ? `An arrowhead on it, labelled "I", points ${m.current}.` : 'No current arrow is drawn (the wire is labelled "wire").'}`);
    printed.push(m.showCurrent ? 'current label: "I"' : 'label: "wire"');
    if (m.showField) {
      const sides = horizontal ? (['above', 'below'] as const) : (['left', 'right'] as const);
      out.push(`${sides.map((s) => `${s === 'above' || s === 'below' ? `${s} the wire` : `to the ${s} of the wire`} there are circles with a ${wireSideField(m.current, s) === 'out' ? 'dot' : 'cross'}`).join('; ')}. ${KEY}`);
    } else out.push('No field symbols are drawn.');
    return 'a diagram of the magnetic field beside a straight wire';
  }
  const inPlane = m.field !== 'into' && m.field !== 'out';
  out.push(`A dashed rectangle marks a region of uniform magnetic field. ${!m.showField ? 'The field is not drawn; the region is labelled "B = (blank)".' : inPlane ? `Parallel arrows labelled "B" point ${m.field}.` : `It is filled with circles holding a ${m.field === 'out' ? 'dot' : 'cross'}. ${KEY}`}`);
  printed.push(m.showField ? (inPlane ? 'field label: "B"' : 'key: "field out of the page", "field into the page"') : 'label: "B = ?"');
  if (m.charge.label) printed.push(`charge label: "${m.charge.label}"`);
  printed.push('velocity label: "v"');
  out.push(`In the region: ${chargeWord(m.charge)}, with a heavy arrow labelled "v" pointing ${m.charge.velocity}.`);
  const force = magneticForceDirection(m.charge.positive, m.charge.velocity, m.field);
  if (m.charge.showForce && force) { printed.push('force label: "F"'); out.push(force === 'into' || force === 'out' ? `Beside the charge a circle with a ${force === 'out' ? 'dot' : 'cross'} is labelled "F".` : `A dashed heavy arrow labelled "F" points ${force}.`); } else out.push('No force arrow is drawn.');
  return 'a diagram of a charge moving in a magnetic field';
}

// ── flow diagrams ───────────────────────────────────────────────────────────

function flowText(m: FlowModel, printed: string[], out: string[]): string {
  if (m.variant === 'pyramid') {
    out.push(`A pyramid of ${m.levels.length} stacked bars, widest at the bottom. From the bottom up:`);
    m.levels.forEach((l, i) => {
      const v = l.show === 'none' || l.value === undefined ? '' : l.show === 'blank' ? BLANK : `"${fmt(l.value)}${m.unit ? ` ${m.unit}` : ''}"`;
      printed.push(`level label: ${l.blank ? BLANK : `"${l.label}"`}`);
      if (v) printed.push(`value beside level ${i + 1}: ${v}`);
      out.push(`  level ${i + 1}: ${l.blank ? BLANK : `"${l.label}"`}${v ? `, with the value ${v} beside it` : ', no value'}.`);
    });
    return 'a pyramid diagram (stacked levels)';
  }
  const name = (id: string): string => { const n = m.nodes.find((x) => x.id === id) as FlowModel['nodes'][number]; return n.blank ? `the box holding a "?" (box ${m.nodes.indexOf(n) + 1})` : `"${n.label}"`; };
  out.push(`${m.nodes.length} boxes joined by arrows${m.variant === 'cycle' ? ', forming one closed loop' : m.variant === 'chain' ? ', in one chain' : ''}.`);
  m.nodes.forEach((n, i) => {
    printed.push(`box ${i + 1}: ${n.blank ? BLANK : `"${n.label}"`}`);
    if (m.variant === 'web') out.push(`  box ${i + 1}: ${n.blank ? BLANK : `"${n.label}"`}, in row ${n.row + 1} from the top.`);
  });
  out.push('Arrows:');
  for (const e of m.edges) {
    const bits: string[] = [];
    if (e.blank) bits.push('carrying a "?" (blank)');
    else {
      if (e.sign) bits.push(`carrying the sign "${e.sign}" in a small circle`);
      if (e.label) bits.push(`labelled "${e.label}"`);
    }
    if (e.blank) printed.push('arrow label: (blank)');
    else {
      if (e.sign) printed.push(`arrow sign: "${e.sign}"`);
      if (e.label) printed.push(`arrow label: "${e.label}"`);
    }
    out.push(`  from ${name(e.from)} to ${name(e.to)}${bits.length ? `, ${bits.join(' and ')}` : ''}.`);
  }
  return m.variant === 'web' ? 'a web of boxes and arrows' : m.variant === 'cycle' ? 'a cycle of boxes and arrows' : 'a chain of boxes and arrows';
}

// ── solids ──────────────────────────────────────────────────────────────────

const polyWords = (c: { poly: number[]; sqrt: boolean; label?: string }): string => (c.label ? `labelled "${c.label}"` : 'with no label');

function solidText(m: SolidModel, printed: string[], out: string[]): string {
  if (m.revolution) {
    const rev = m.revolution;
    out.push(`A coordinate grid with x and y axes. A region is hatched: it lies between x = ${fmt(rev.from)} and x = ${fmt(rev.to)}, under a solid curve ${polyWords(rev.outer)}${rev.inner ? ` and above a dashed curve ${polyWords(rev.inner)}` : ' and above the x-axis'}.`);
    for (const c of [rev.outer, rev.inner]) if (c?.label) printed.push(`curve label: "${c.label}"`);
    out.push(`A small curved arrow round the ${rev.axis}-axis shows the region is revolved about that axis.`);
    if (rev.showSolid) out.push(`The mirror image of the region's boundary on the other side of the ${rev.axis}-axis is drawn dashed, with thin ellipses where its ends sweep round.`);
    if (rev.strip) out.push(`One thin vertical strip is drawn in the region (${rev.axis === 'x' ? 'perpendicular to' : 'parallel to'} the axis of revolution).`);
    const N = 4;
    out.push('Heights at evenly spaced x:');
    for (let i = 0; i <= N; i++) {
      const x = rev.from + ((rev.to - rev.from) * i) / N;
      out.push(`  x = ${fmt(Number(x.toFixed(4)))}: upper curve y ≈ ${fmt(Number(rev.outer.f(x).toFixed(2)))}${rev.inner ? `, lower curve y ≈ ${fmt(Number(rev.inner.f(x).toFixed(2)))}` : ''}`);
    }
    return 'a region on axes and the solid it sweeps out when revolved';
  }
  const names: Record<string, string> = { prism: 'a rectangular box (prism)', triangular_prism: 'a triangular prism', cylinder: 'a cylinder', cone: 'a cone', sphere: 'a sphere', hemisphere: 'a hemisphere (dome) on its flat face', pyramid: 'a pyramid on a square base' };
  const what = m.solid === 'composite' ? `a ${m.top} on top of a ${m.bottom === 'prism' ? 'box with a square base' : 'cylinder'} (they share the same ${m.bottom === 'prism' ? 'square' : 'circle'})` : names[m.solid];
  if (m.notToScale) printed.push('note: "not to scale"');
  out.push(`A line drawing of ${what}; hidden edges are dashed.${m.notToScale ? ' It carries the note "not to scale".' : ''}`);
  const where: Record<string, string> = {
    length: m.solid === 'triangular_prism' ? 'along the edge running back (the length of the prism)' : 'along the front bottom edge', width: 'along the edge running back (the depth)',
    height: m.solid === 'triangular_prism' ? 'on the dashed height of the triangular face' : m.solid === 'composite' ? `beside the ${m.bottom === 'prism' ? 'box' : 'cylinder'} (its height)` : m.solid === 'cone' || m.solid === 'pyramid' ? 'beside the dashed line from the apex to the centre of the base (the height)' : 'beside the vertical side (the height)',
    base: m.solid === 'triangular_prism' ? 'along the base of the triangular face' : 'along the front edge of the square base', radius: 'on a radius of the circular face',
    topHeight: `against the height of the ${m.top} on top`, slant: `on the slant height of the ${m.top ?? m.solid}`,
  };
  for (const [k, s] of Object.entries(m.labels)) {
    printed.push(`dimension label: ${shown(s)}`);
    out.push(`  ${shown(s)} ${where[k]}.`);
  }
  return 'a drawing of a solid';
}

function solidMeasure(m: SolidModel, want: 'volume' | 'surface' | 'lateral'): { value: number; pi: boolean } {
  const d = m.dims;
  const PI = Math.PI;
  const coneL = (r: number, h: number) => Math.hypot(r, h);
  switch (m.solid) {
    case 'prism': return { pi: false, value: want === 'volume' ? d.length * d.width * d.height : want === 'lateral' ? 2 * d.height * (d.length + d.width) : 2 * (d.length * d.width + d.length * d.height + d.width * d.height) };
    case 'triangular_prism': {
      const tri = (d.base * d.height) / 2;
      const side = Math.hypot(d.base / 2, d.height);
      const lat = (d.base + 2 * side) * d.length;
      return { pi: false, value: want === 'volume' ? tri * d.length : want === 'lateral' ? lat : lat + 2 * tri };
    }
    case 'cylinder': return { pi: true, value: want === 'volume' ? PI * d.radius ** 2 * d.height : want === 'lateral' ? 2 * PI * d.radius * d.height : 2 * PI * d.radius * (d.radius + d.height) };
    case 'cone': return { pi: true, value: want === 'volume' ? (PI * d.radius ** 2 * d.height) / 3 : want === 'lateral' ? PI * d.radius * coneL(d.radius, d.height) : PI * d.radius * (d.radius + coneL(d.radius, d.height)) };
    case 'sphere': return { pi: true, value: want === 'volume' ? (4 / 3) * PI * d.radius ** 3 : 4 * PI * d.radius ** 2 };
    case 'hemisphere': return { pi: true, value: want === 'volume' ? (2 / 3) * PI * d.radius ** 3 : want === 'lateral' ? 2 * PI * d.radius ** 2 : 3 * PI * d.radius ** 2 };
    case 'pyramid': {
      const lat = 2 * d.base * Math.hypot(d.base / 2, d.height);
      return { pi: false, value: want === 'volume' ? (d.base ** 2 * d.height) / 3 : want === 'lateral' ? lat : lat + d.base ** 2 };
    }
    case 'composite': {
      if (m.bottom === 'prism') {
        const lat = 4 * d.base * d.height + 2 * d.base * Math.hypot(d.base / 2, d.topHeight);
        return { pi: false, value: want === 'volume' ? d.base ** 2 * d.height + (d.base ** 2 * d.topHeight) / 3 : want === 'lateral' ? lat : lat + d.base ** 2 };
      }
      const topV = m.top === 'cone' ? (PI * d.radius ** 2 * d.topHeight) / 3 : (2 / 3) * PI * d.radius ** 3;
      const topA = m.top === 'cone' ? PI * d.radius * coneL(d.radius, d.topHeight) : 2 * PI * d.radius ** 2;
      const lat = 2 * PI * d.radius * d.height + topA;
      return { pi: true, value: want === 'volume' ? PI * d.radius ** 2 * d.height + topV : want === 'lateral' ? lat : lat + PI * d.radius ** 2 };
    }
    default: return fail('this checker is not for a solid of revolution — use solid_revolution_volume');
  }
}

// ── spectra ─────────────────────────────────────────────────────────────────

/** Z, symbol, name, standard atomic mass — hydrogen to krypton. */
export const ELEMENTS: Array<[number, string, string, number]> = [
  [1, 'H', 'hydrogen', 1.008], [2, 'He', 'helium', 4.003], [3, 'Li', 'lithium', 6.94], [4, 'Be', 'beryllium', 9.012], [5, 'B', 'boron', 10.81], [6, 'C', 'carbon', 12.011],
  [7, 'N', 'nitrogen', 14.007], [8, 'O', 'oxygen', 15.999], [9, 'F', 'fluorine', 18.998], [10, 'Ne', 'neon', 20.18], [11, 'Na', 'sodium', 22.99], [12, 'Mg', 'magnesium', 24.305],
  [13, 'Al', 'aluminium', 26.982], [14, 'Si', 'silicon', 28.085], [15, 'P', 'phosphorus', 30.974], [16, 'S', 'sulfur', 32.06], [17, 'Cl', 'chlorine', 35.45], [18, 'Ar', 'argon', 39.948],
  [19, 'K', 'potassium', 39.098], [20, 'Ca', 'calcium', 40.078], [21, 'Sc', 'scandium', 44.956], [22, 'Ti', 'titanium', 47.867], [23, 'V', 'vanadium', 50.942], [24, 'Cr', 'chromium', 51.996],
  [25, 'Mn', 'manganese', 54.938], [26, 'Fe', 'iron', 55.845], [27, 'Co', 'cobalt', 58.933], [28, 'Ni', 'nickel', 58.693], [29, 'Cu', 'copper', 63.546], [30, 'Zn', 'zinc', 65.38],
  [31, 'Ga', 'gallium', 69.723], [32, 'Ge', 'germanium', 72.63], [33, 'As', 'arsenic', 74.922], [34, 'Se', 'selenium', 78.971], [35, 'Br', 'bromine', 79.904], [36, 'Kr', 'krypton', 83.798],
];
const SUBSHELLS: Array<[string, number]> = [['1s', 2], ['2s', 2], ['2p', 6], ['3s', 2], ['3p', 6], ['4s', 2]];
const SUPER = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const sup = (n: number): string => String(n).split('').map((c) => SUPER[Number(c)]).join('');

/** The subshell of each PES peak (left to right: 1s first), for a ground-state atom up to calcium. */
function pesSubshells(m: Extract<SpectrumModel, { variant: 'pes' }>): string[] {
  if (m.peaks.length > SUBSHELLS.length) return fail('this checker reads photoelectron spectra of atoms up to calcium (six peaks at most)');
  m.peaks.forEach((p, i) => {
    const [name, cap] = SUBSHELLS[i];
    if (p.electrons > cap) fail(`peak ${i + 1} from the left has ${p.electrons} electrons, more than the ${name} subshell holds`);
    // Only the LAST occupied subshell of a ground-state atom (up to calcium) may be part-filled.
    if (i < m.peaks.length - 1 && p.electrons !== cap) fail(`peak ${i + 1} from the left (${name}) is not full although a later subshell is occupied — not a ground-state atom up to calcium`);
  });
  return m.peaks.map((_, i) => SUBSHELLS[i][0]);
}

function spectrumText(m: SpectrumModel, printed: string[], out: string[]): string {
  if (m.variant === 'mass') {
    printed.push(`axis label: "${m.xLabel}"`, `axis label: "${m.yLabel}"`);
    out.push(`A mass spectrum: vertical bars on a horizontal axis "${m.xLabel}" numbered from ${fmt(m.xRange[0])} to ${fmt(m.xRange[1])} in steps of ${fmt(m.xStep)}; the vertical axis "${m.yLabel}" is numbered from 0 to ${fmt(m.yMax)} in steps of ${fmt(m.yStep)}.`);
    // Readable exactly on a numbered gridline or half-way between two; otherwise only which two it lies between.
    const minor = m.yStep / 2;
    [...m.peaks].sort((a, b) => a.mz - b.mz).forEach((p) => {
      const on = Math.abs(p.abundance / minor - Math.round(p.abundance / minor)) < 1e-9;
      if (p.label) printed.push(`peak label: ${shown(p.label)}`);
      if (m.showValues) printed.push(`value over a bar: "${fmt(p.abundance)}"`);
      const lo = Math.floor(p.abundance / m.yStep) * m.yStep;
      out.push(`  a bar at ${fmt(p.mz)}: height ${m.showValues || on ? fmt(p.abundance) : `between ${fmt(lo)} and ${fmt(lo + m.yStep)} (about ${fmt(Number(p.abundance.toPrecision(2)))})`}${p.label ? `, labelled ${shown(p.label)}` : ''}${m.showValues ? ` (the value ${fmt(p.abundance)} is printed over it)` : ''}.`);
    });
    return 'a mass spectrum';
  }
  if (m.variant === 'pes') {
    printed.push(`axis label: "${m.xLabel}"`, `axis label: "${m.yLabel}"`);
    out.push(`A photoelectron spectrum. The horizontal axis "${m.xLabel}" is logarithmic and INCREASES TO THE LEFT (numbered at powers of ten). The vertical axis "${m.yLabel}" has evenly spaced unnumbered gridlines${m.yNumbers ? ' that are numbered' : ''}: a peak's height counts in those units.`);
    out.push('Peaks, left to right:');
    m.peaks.forEach((p, i) => {
      if (m.showEnergies) printed.push(`energy over a peak: "${fmt(p.energy)}"`);
      if (p.label) printed.push(`peak label: ${shown(p.label)}`);
      out.push(`  peak ${i + 1}: ${m.showEnergies ? `"${fmt(p.energy)}" printed over it` : `at about ${fmt(Number(p.energy.toPrecision(1)))} on the axis`}; height ${p.electrons} unit${p.electrons > 1 ? 's' : ''}${p.label ? `; labelled ${shown(p.label)}` : ''}.`);
    });
    return 'a photoelectron spectrum';
  }
  if (m.variant === 'lines') {
    printed.push(`axis label: "${m.xLabel}"`);
    out.push(`${m.rows.length} horizontal strip${m.rows.length > 1 ? 's' : ''} over one axis "${m.xLabel}" numbered from ${fmt(m.range[0])} to ${fmt(m.range[1])} in steps of ${fmt(m.step)}. Positions of lines are read against that axis, to about a fifth of a step.`);
    const res = m.step / 5;
    m.rows.forEach((row) => {
      printed.push(`strip label: "${row.label}"`);
      out.push(`  "${row.label}" (${row.kind === 'emission' ? 'dark lines on a white strip' : 'white lines on a dark strip'}): lines at about ${row.lines.map((nm) => fmt(Math.round(nm / res) * res)).join(', ')}.`);
    });
    return 'line spectra';
  }
  printed.push(`axis label: "${m.xLabel}"`, `axis label: "${m.yLabel}"`);
  out.push(`A straight line on a grid: horizontal axis "${m.xLabel}" from 0 to ${fmt(m.xMax)} in steps of ${fmt(m.xStep)}; vertical axis "${m.yLabel}" from 0 to ${fmt(m.yMax)} in steps of ${fmt(m.yStep)}.`);
  out.push(`The line passes through (0, ${fmt(m.intercept)}) and (${fmt(m.xMax)}, ${fmt(Number((m.slope * m.xMax + m.intercept).toPrecision(8)))}).`);
  if (m.points.length) out.push(`Dots on the grid at: ${m.points.map(([x, y]) => `(${fmt(x)}, ${fmt(y)})`).join(', ')}.`);
  if (m.sample?.guide) { printed.push('label: "sample"'); out.push(`A dashed horizontal line labelled "sample" runs from the vertical axis at ${fmt(m.sample.absorbance)} across to the line (it is not dropped to the horizontal axis).`); }
  return "a calibration line (absorbance against concentration)";
}

// ── registration ────────────────────────────────────────────────────────────

/**
 * The transcription of a batch-2 figure: pushes onto `printed` and `out`
 * and returns what the figure is ("a circuit diagram …"); '' when the spec
 * is not a batch-2 kind.
 */
export function describeBatch2(spec: PracticeFigureSpec, printed: string[], out: string[]): string {
  switch (spec.type as Batch2FigureKind) {
    case 'circuit_diagram': return circuitText(modelOf(spec, circuitModel), printed, out);
    case 'phylogenetic_tree': return phyloText(modelOf(spec, phyloModel), printed, out);
    case 'geometric_figure': return geometryText(modelOf(spec, geometryModel), printed, out);
    case 'ray_diagram': return rayText(spec, printed, out);
    case 'field_diagram': return fieldText(modelOf(spec, fieldModel), printed, out);
    case 'flow_diagram': return flowText(modelOf(spec, flowModel), printed, out);
    case 'solid_3d': return solidText(modelOf(spec, solidModel), printed, out);
    case 'spectrum': return spectrumText(modelOf(spec, spectrumModel), printed, out);
    default: return '';
  }
}

export interface Batch2CheckerDef {
  kinds: Batch2FigureKind[];
  args: string;
  returns: string;
  run: (spec: PracticeFigureSpec, args: P) => Derived;
}

const variantOf = <V extends FieldModel['variant']>(spec: PracticeFigureSpec, v: V): Extract<FieldModel, { variant: V }> => {
  const m = modelOf(spec, fieldModel);
  if (m.variant !== v) return fail(`this checker is for the ${v} variant, not ${m.variant}`);
  return m as Extract<FieldModel, { variant: V }>;
};
const spectrumOf = <V extends SpectrumModel['variant']>(spec: PracticeFigureSpec, v: V): Extract<SpectrumModel, { variant: V }> => {
  const m = modelOf(spec, spectrumModel);
  if (m.variant !== v) return fail(`this checker is for the ${v} variant, not ${m.variant}`);
  return m as Extract<SpectrumModel, { variant: V }>;
};

export const BATCH2_CHECKERS: Record<string, Batch2CheckerDef> = {
  // circuit_diagram
  circuit_equivalent_resistance: {
    kinds: ['circuit_diagram'], args: '{ switches?: { name: true (closed) | false (open) } }', returns: 'the equivalent resistance seen by the battery, in ohms (steady state: a capacitor, a voltmeter and an open switch carry no current)',
    run: (s, a) => { const sol = solved(modelOf(s, circuitModel), a.switches); return sol.resistance === null ? fail('the circuit is open: no current flows, so there is no finite equivalent resistance') : ofFrac(sol.resistance); },
  },
  circuit_equivalent_capacitance: {
    kinds: ['circuit_diagram'], args: '{}', returns: 'the equivalent capacitance of a network of capacitors only, in the unit printed',
    run: (s) => { const c = capacitance(modelOf(s, circuitModel).root); return c === null ? fail('the circuit has no capacitor') : measured(c); },
  },
  circuit_component: {
    kinds: ['circuit_diagram'], args: `{ component: name | "battery", quantity: ${QUANTITIES.join(' | ')}, switches?: { name: boolean } }`, returns: 'the current through (A), the voltage across (V) or the power of (W) one component',
    run: (s, a) => { const m = modelOf(s, circuitModel); return measured(quantityOf(m, solved(m, a.switches), argStr(a, 'component'), pick(a, 'quantity', QUANTITIES))); },
  },
  circuit_brightness_order: {
    kinds: ['circuit_diagram'], args: '{ switches?: { name: boolean } }', returns: 'the named bulbs from brightest to dimmest, e.g. "A > B = C" (by power)',
    run: (s, a) => {
      const m = modelOf(s, circuitModel);
      const sol = solved(m, a.switches);
      const bulbs = m.leaves.map((l, i) => ({ l, p: fNum(sol.leaves[i].P) })).filter((x) => x.l.type === 'bulb');
      if (bulbs.length < 2 || bulbs.some((x) => !x.l.name)) return fail('a brightness order needs at least two bulbs, each with a name');
      bulbs.sort((x, y) => y.p - x.p || (x.l.name as string).localeCompare(y.l.name as string));
      return text(bulbs.map((x, i) => (i === 0 ? '' : Math.abs(x.p - bulbs[i - 1].p) < 1e-9 ? ' = ' : ' > ') + x.l.name).join(''));
    },
  },
  circuit_switch_effect: {
    kinds: ['circuit_diagram'], args: `{ switch: name, component: name | "battery", quantity: ${QUANTITIES.join(' | ')} | brightness | resistance }`, returns: 'the label "increases", "decreases" or "stays the same": what OPENING the switch does to that quantity (resistance: of the whole circuit)',
    run: (s, a) => {
      const m = modelOf(s, circuitModel);
      const sw = argStr(a, 'switch');
      if (m.leaves[leafByName(m, sw)].type !== 'switch') return fail(`"${sw}" is not a switch`);
      const q = pick(a, 'quantity', [...QUANTITIES, 'brightness', 'resistance'] as const);
      const value = (closed: boolean): number => {
        const sol = solved(m, { [sw]: closed });
        if (q === 'resistance') return sol.resistance === null ? Infinity : fNum(sol.resistance);
        return quantityOf(m, sol, argStr(a, 'component'), q === 'brightness' ? 'power' : q);
      };
      const before = value(true);
      const after = value(false);
      return label(Math.abs(after - before) < 1e-9 || after === before ? 'stays the same' : after > before ? 'increases' : 'decreases');
    },
  },
  // phylogenetic_tree
  phylo_mrca: {
    kinds: ['phylogenetic_tree'], args: '{ taxa: [tip names, at least two] }', returns: 'the label of the node that is their most recent common ancestor (it must be a labelled node)',
    run: (s, a) => { const m = modelOf(s, phyloModel); const n = mrca(taxaArg(m, a, 'taxa', 2)); return n.node ? label(n.node) : fail('their most recent common ancestor is an unlabelled node — label it (node: "…") or ask something else'); },
  },
  phylo_sister: {
    kinds: ['phylogenetic_tree'], args: '{ taxon: tip name }', returns: 'its sister group: the tip, or the tips ("A, B") in top-to-bottom order, on the other branch of its nearest branch point',
    run: (s, a) => {
      const m = modelOf(s, phyloModel);
      const tip = tipNode(m, argStr(a, 'taxon'));
      const sibs = (tip.parent as PhyloNode).children.filter((c) => c !== tip);
      if (sibs.length !== 1) return fail('the tip sits on a split into three or more branches — it has no single sister group');
      return sibs[0].tips.length === 1 ? label(sibs[0].tips[0]) : text(sibs[0].tips.join(', '));
    },
  },
  phylo_shared_trait: {
    kinds: ['phylogenetic_tree'], args: '{ trait: label, want?: taxa | count }', returns: 'the tips that have the trait (every tip beyond its tick mark), top to bottom as "A, B, C" — or how many',
    run: (s, a) => {
      const m = modelOf(s, phyloModel);
      const name = argStr(a, 'trait');
      const hit = phyloTraits(m).filter((t) => t.trait.label === name);
      if (hit.length !== 1) return fail(hit.length ? `the trait "${name}" is marked on more than one branch` : `the tree marks no trait "${name}"`);
      const tips = hit[0].on.tips;
      return pick(a, 'want', ['taxa', 'count'] as const, 'taxa') === 'count' ? num(tips.length) : tips.length === 1 ? label(tips[0]) : text(tips.join(', '));
    },
  },
  phylo_monophyletic: {
    kinds: ['phylogenetic_tree'], args: '{ taxa: [tip names, at least two] }', returns: 'the label "yes" or "no": whether the group is a clade (an ancestor and ALL of its descendants on the tree)',
    run: (s, a) => { const m = modelOf(s, phyloModel); const tips = taxaArg(m, a, 'taxa', 2); return yesNo(mrca(tips).tips.length === tips.length); },
  },
  phylo_clade_count: {
    kinds: ['phylogenetic_tree'], args: '{}', returns: 'how many clades of two or more tips the tree shows (one per branch point, the root included)',
    run: (s) => num(modelOf(s, phyloModel).internals.length),
  },
  phylo_closer_relative: {
    kinds: ['phylogenetic_tree'], args: '{ taxon: tip, a: tip, b: tip }', returns: 'the label of whichever of a, b shares the more recent common ancestor with the taxon',
    run: (s, a) => {
      const m = modelOf(s, phyloModel);
      const [t, x, y] = [tipNode(m, argStr(a, 'taxon')), tipNode(m, argStr(a, 'a')), tipNode(m, argStr(a, 'b'))];
      const [dx, dy] = [depthOf(mrca([t, x])), depthOf(mrca([t, y]))];
      return dx === dy ? fail(`"${x.name}" and "${y.name}" are equally related to "${t.name}" on this tree`) : label((dx > dy ? x.name : y.name) as string);
    },
  },
  phylo_blank: {
    kinds: ['phylogenetic_tree'], args: '{ what?: tip | trait }', returns: 'the name that belongs under the one blank tip (or the one blank trait)',
    run: (s, a) => {
      const m = modelOf(s, phyloModel);
      const what = pick(a, 'what', ['tip', 'trait'] as const, 'tip');
      const names = what === 'tip' ? m.tips.filter((t) => t.blank).map((t) => t.name as string) : phyloTraits(m).filter((t) => t.trait.blank).map((t) => t.trait.label);
      return names.length === 1 ? label(names[0]) : fail(`the tree has ${names.length} blank ${what}s, not exactly one`);
    },
  },
  // geometric_figure
  geo_side: {
    kinds: ['geometric_figure'], args: '{ side: index, triangle?: 0 | 1 }', returns: 'the true length of a side (a triangle: 0 = a, 1 = b, 2 = c, the sides opposite the first, second and third vertex; a polygon: side i runs from vertex i)',
    run: (s, a) => { const m = modelOf(s, geometryModel); const pm = polyOf(m, a); return measured(pm.sides[triSide(m, argIndex(a, 'side', pm.sides.length, 'side'))]); },
  },
  geo_angle: {
    kinds: ['geometric_figure'], args: '{ vertex: index, triangle?: 0 | 1 } · a circle: { angle: index } · parallel lines: { position: 1–8 }', returns: 'the true size of an angle, in degrees',
    run: (s, a) => {
      const m = modelOf(s, geometryModel);
      if (m.parallel) { const k = argNum(a, 'position'); return m.parallel.values[k] === undefined ? fail('position must be a whole number from 1 to 8') : measured(m.parallel.values[k]); }
      if (m.circle) return m.circle.angles.length ? measured(m.circle.angles[argIndex(a, 'angle', m.circle.angles.length, 'marked angle')].degrees) : fail('the circle has no marked angle');
      const pm = polyOf(m, a);
      return measured(pm.angles[argIndex(a, 'vertex', pm.angles.length, 'vertex')]);
    },
  },
  geo_area: {
    kinds: ['geometric_figure'], args: '{ triangle?: 0 | 1 }', returns: 'the area of the triangle or polygon',
    run: (s, a) => measured(shoelace(polyOf(modelOf(s, geometryModel), a).pts)),
  },
  geo_perimeter: {
    kinds: ['geometric_figure'], args: '{ triangle?: 0 | 1 }', returns: 'the perimeter of the triangle or polygon',
    run: (s, a) => measured(polyOf(modelOf(s, geometryModel), a).sides.reduce((x, y) => x + y, 0)),
  },
  geo_circle: {
    kinds: ['geometric_figure'], args: `{ want: ${CIRCLE_WANTS.join(' | ')}, as?: decimal | pi, chord?: index }`, returns: 'a measure of the circle: circumference, area, the length of the marked arc, the area of the hatched sector (or of the marked arc\'s sector), a chord\'s length, or the distance from the centre to the tangent\'s outside point — as a decimal, or as an exact multiple of π ("25π/3")',
    run: (s, a) => {
      const c = modelOf(s, geometryModel).circle;
      if (!c) return fail('this checker is for a circle');
      const want = pick(a, 'want', CIRCLE_WANTS);
      const as = pick(a, 'as', AS, 'decimal');
      const viaPi = (coef: number): Derived => (as === 'pi' ? piForm(coef) : approx(coef * Math.PI));
      const spanDeg = (): number => (want === 'arc_length' ? c.arc ?? c.sector : c.sector ?? c.arc)?.degrees ?? fail('the circle has no marked arc or hatched sector');
      switch (want) {
        case 'circumference': return viaPi(2 * c.radius);
        case 'area': return viaPi(c.radius ** 2);
        case 'arc_length': return viaPi((spanDeg() / 360) * 2 * c.radius);
        case 'sector_area': return viaPi((spanDeg() / 360) * c.radius ** 2);
        case 'chord_length': return c.chords.length ? measured(c.chords[argIndex(a, 'chord', c.chords.length, 'chord')].length) : fail('the circle has no chord');
        default: return c.tangent?.length === undefined ? fail('the circle has no tangent drawn to an outside point') : measured(Math.hypot(c.radius, c.tangent.length));
      }
    },
  },
  geo_similar: {
    kinds: ['geometric_figure'], args: '{ want: ratio | side | perimeter_ratio | area_ratio, side?: index }', returns: 'for similar triangles: the scale factor (second ÷ first), a side of the SECOND triangle (0 = a, 1 = b, 2 = c), or the ratio of perimeters or areas',
    run: (s, a) => {
      const sim = modelOf(s, geometryModel).similar;
      if (!sim) return fail('this checker is for a pair of similar triangles');
      const want = pick(a, 'want', ['ratio', 'side', 'perimeter_ratio', 'area_ratio'] as const);
      return want === 'side' ? measured(sim.second.sides[[1, 2, 0][argIndex(a, 'side', 3, 'side')]]) : measured(want === 'area_ratio' ? sim.scale ** 2 : sim.scale);
    },
  },
  // ray_diagram
  ray_image_distance: {
    kinds: ['ray_diagram'], args: '{ signed?: boolean (true) }', returns: 'the image distance from 1/f = 1/d_o + 1/d_i, in the figure\'s unit — negative for a virtual image unless signed is false',
    run: (s, a) => { const m = optics(s); return measured(a.signed === false ? Math.abs(m.dI) : m.dI); },
  },
  ray_magnification: {
    kinds: ['ray_diagram'], args: '{ signed?: boolean (true) }', returns: 'the magnification −d_i/d_o — negative for an inverted image unless signed is false',
    run: (s, a) => { const m = optics(s); return measured(a.signed === false ? Math.abs(m.magnification) : m.magnification); },
  },
  ray_image_height: {
    kinds: ['ray_diagram'], args: '{}', returns: 'the size of the image (its height, without sign), in the figure\'s unit',
    run: (s) => measured(Math.abs(optics(s).hI)),
  },
  ray_image_nature: {
    kinds: ['ray_diagram'], args: '{ want: type | orientation | size }', returns: 'the label "real" / "virtual", "upright" / "inverted", or "enlarged" / "reduced" / "same size"',
    run: (s, a) => {
      const m = optics(s);
      const want = pick(a, 'want', ['type', 'orientation', 'size'] as const);
      const k = Math.abs(m.magnification);
      return label(want === 'type' ? (m.real ? 'real' : 'virtual') : want === 'orientation' ? (m.upright ? 'upright' : 'inverted') : Math.abs(k - 1) < 1e-9 ? 'same size' : k > 1 ? 'enlarged' : 'reduced');
    },
  },
  ray_snell: {
    kinds: ['ray_diagram'], args: '{ want: refraction_angle | critical_angle | reflection_angle | n1 | n2 }', returns: 'for a plane interface, from n1 sin θ1 = n2 sin θ2: an angle in degrees (rounded), or an index',
    run: (s, a) => {
      const m = modelOf(s, rayModel);
      if (m.element !== 'interface') return fail('this checker is for a plane interface');
      switch (pick(a, 'want', ['refraction_angle', 'critical_angle', 'reflection_angle', 'n1', 'n2'] as const)) {
        case 'refraction_angle': return m.theta2 === null ? fail('the light is totally internally reflected: there is no refracted ray') : approx(m.theta2);
        case 'critical_angle': return m.critical === null ? fail('there is no critical angle when light enters a medium of higher index') : approx(m.critical);
        case 'reflection_angle': return num(m.theta1);
        case 'n1': return approx(m.n1);
        default: return approx(m.n2);
      }
    },
  },
  // field_diagram
  field_direction_at: {
    kinds: ['field_diagram'], args: '{ point: label, as?: compass | degrees }', returns: 'the direction of the electric field at a marked point: "up", "left", "up and to the right" … (refused when it is not within 12° of one of the eight) — or its angle counter-clockwise from "right", in degrees',
    run: (s, a) => {
      const m = variantOf(s, 'point_charges');
      const name = argStr(a, 'point');
      const q = m.points.find((x) => x.label === name) ?? fail(`the figure marks no point "${name}"`);
      const [ex, ey] = fieldAt(m.charges, q.x, q.y);
      if (Math.hypot(ex, ey) < 1e-9) return fail('the field is zero at that point');
      const ang = ((Math.atan2(ey, ex) * 180) / Math.PI + 360) % 360;
      if (pick(a, 'as', ['compass', 'degrees'] as const, 'compass') === 'degrees') return approx(ang);
      const k = Math.round(ang / 45) % 8;
      return Math.abs(((ang - k * 45 + 540) % 360) - 180) > 12 ? fail(`the field at "${name}" points ${fmt(Number(ang.toFixed(0)))}° from "right" — not close to one of the eight compass directions`) : label(COMPASS[k]);
    },
  },
  field_charge_sign: {
    kinds: ['field_diagram'], args: '{ charge: index }', returns: 'the label "positive" or "negative" (lines leave a positive charge and end on a negative one)',
    run: (s, a) => { const m = variantOf(s, 'point_charges'); return label(m.charges[argIndex(a, 'charge', m.charges.length, 'charge')].q > 0 ? 'positive' : 'negative'); },
  },
  field_line_count: {
    kinds: ['field_diagram'], args: '{ charge: index }', returns: 'how many field lines meet that charge',
    run: (s, a) => { const m = variantOf(s, 'point_charges'); return num(lineCounts(m)[argIndex(a, 'charge', m.charges.length, 'charge')]); },
  },
  field_charge_ratio: {
    kinds: ['field_diagram'], args: '{ a: index, b: index }', returns: 'the size of charge a ÷ the size of charge b (the ratio of their line counts)',
    run: (s, a) => { const m = variantOf(s, 'point_charges'); return measured(Math.abs(m.charges[argIndex(a, 'a', m.charges.length, 'charge')].q) / Math.abs(m.charges[argIndex(a, 'b', m.charges.length, 'charge')].q)); },
  },
  field_force_direction: {
    kinds: ['field_diagram'], args: '{}', returns: 'the direction of the force on the charge shown: electric between plates ("up", "down", "left", "right"), magnetic in a magnetic field (also "into the page", "out of the page") — reversed for a negative charge',
    run: (s) => {
      const m = modelOf(s, fieldModel);
      if (m.variant === 'uniform') {
        if (!m.charge) return fail('no charge is drawn between the plates');
        const opposite = { up: 'down', down: 'up', left: 'right', right: 'left' } as const;
        return label(m.charge.positive ? m.direction : opposite[m.direction]);
      }
      if (m.variant !== 'magnetic_force') return fail('this checker is for a charge between plates or in a magnetic field');
      const f = magneticForceDirection(m.charge.positive, m.charge.velocity, m.field);
      return f ? label(DIR_WORDS[f]) : fail('the charge moves along the field: the magnetic force is zero');
    },
  },
  field_wire_direction: {
    kinds: ['field_diagram'], args: '{ side?: above | below | left | right }', returns: 'the direction of the magnetic field of the wire at a point on that side of it (default: the marked point) — "up" … for a wire seen end-on, "into the page" / "out of the page" for a wire in the page',
    run: (s, a) => {
      const m = variantOf(s, 'wire');
      const sides = ['above', 'below', 'left', 'right'] as const;
      if (m.view === 'cross_section') {
        const side = a.side === undefined && m.point ? m.point.side : pick(a, 'side', sides);
        return label(wireFieldDirection(m.current, side));
      }
      const side = pick(a, 'side', sides);
      const along = m.current === 'left' || m.current === 'right';
      if (along === (side === 'left' || side === 'right')) return fail(`"${side}" is along the wire, not beside it`);
      return label(DIR_WORDS[wireSideField(m.current, side)]);
    },
  },
  field_uniform_magnitude: {
    kinds: ['field_diagram'], args: '{}', returns: 'the field strength between the plates, E = V/d, in V/m',
    run: (s) => {
      const m = variantOf(s, 'uniform');
      if (!m.voltage || !m.separation) return fail('E = V/d needs both the potential difference and the plate separation in the spec');
      const metres = { m: 1, cm: 0.01, mm: 0.001 }[m.separation.unit];
      return metres === undefined ? fail(`the separation unit "${m.separation.unit}" is not one of m, cm, mm`) : measured(m.voltage.value / (m.separation.value * metres));
    },
  },
  // flow_diagram
  flow_energy_at_level: {
    kinds: ['flow_diagram'], args: '{ level: index (0 = the bottom), percent?: number }', returns: 'the value at that level of a pyramid when `percent` (default: the spec\'s transferPercent, else 10) of each level passes to the next, counted from the nearest level whose value is PRINTED',
    run: (s, a) => {
      const m = modelOf(s, flowModel);
      if (m.variant !== 'pyramid') return fail('this checker is for the pyramid variant');
      const k = argIndex(a, 'level', m.levels.length, 'level');
      const pct = a.percent === undefined ? m.transferPercent ?? 10 : argNum(a, 'percent');
      if (!(pct > 0 && pct <= 100)) return fail('percent must be between 0 and 100');
      const known = m.levels.map((l, i) => ({ l, i })).filter((x) => x.l.show === 'value' && x.i !== k).sort((x, y) => Math.abs(x.i - k) - Math.abs(y.i - k) || x.i - y.i)[0];
      if (!known) return fail('no other level has a printed value to count from');
      return measured((known.l.value as number) * (pct / 100) ** (k - known.i));
    },
  },
  flow_blank: {
    kinds: ['flow_diagram'], args: '{ what?: node | arrow | level }', returns: 'the label (or the sign, as "+" / "−") that belongs under the one blank of that kind',
    run: (s, a) => {
      const m = modelOf(s, flowModel);
      const what = pick(a, 'what', ['node', 'arrow', 'level'] as const, m.variant === 'pyramid' ? 'level' : 'node');
      const found = what === 'node' ? m.nodes.filter((n) => n.blank).map((n) => n.label) : what === 'level' ? m.levels.filter((l) => l.blank).map((l) => l.label) : m.edges.filter((e) => e.blank).map((e) => e.label ?? (e.sign as string));
      if (found.length !== 1) return fail(`the figure has ${found.length} blank ${what}s, not exactly one`);
      return found[0] === '+' || found[0] === '−' ? text(found[0]) : label(found[0]);
    },
  },
  flow_loop_sign: {
    kinds: ['flow_diagram'], args: '{}', returns: 'the label "positive" or "negative": the kind of feedback of a loop whose every arrow carries a sign (an odd number of − arrows makes it negative)',
    run: (s) => {
      const m = modelOf(s, flowModel);
      if (m.variant !== 'cycle') return fail('this checker is for the cycle variant');
      if (m.edges.some((e) => !e.sign)) return fail('every arrow of the loop needs a sign');
      return label(m.edges.filter((e) => e.sign === '−').length % 2 === 1 ? 'negative' : 'positive');
    },
  },
  flow_trophic_level: {
    kinds: ['flow_diagram'], args: '{ node: id or label }', returns: 'the trophic level of a box in a chain or web (1 = a box no arrow points to) — refused when chains of different lengths reach it',
    run: (s, a) => {
      const m = modelOf(s, flowModel);
      if (m.variant !== 'web' && m.variant !== 'chain') return fail('this checker is for a chain or a web');
      const want = argStr(a, 'node');
      const node = m.nodes.find((n) => n.id === want || n.label === want) ?? fail(`the figure has no box "${want}"`);
      const levels = (id: string, seen: string[]): Set<number> => {
        if (seen.includes(id)) return fail('the arrows form a loop — trophic levels are not defined');
        const preds = m.edges.filter((e) => e.to === id).map((e) => e.from);
        if (preds.length === 0) return new Set([1]);
        return new Set(preds.flatMap((p) => [...levels(p, [...seen, id])].map((v) => v + 1)));
      };
      const ls = [...levels(node.id, [])].sort((x, y) => x - y);
      return ls.length === 1 ? num(ls[0]) : { kind: 'numbers', values: ls };
    },
  },
  flow_chain_count: {
    kinds: ['flow_diagram'], args: '{}', returns: 'how many different chains run from a box no arrow points to, to a box no arrow leaves (food chains in a web)',
    run: (s) => {
      const m = modelOf(s, flowModel);
      if (m.variant !== 'web' && m.variant !== 'chain') return fail('this checker is for a chain or a web');
      const paths = (id: string, depth: number): number => {
        if (depth > m.nodes.length) return fail('the arrows form a loop');
        const next = m.edges.filter((e) => e.from === id).map((e) => e.to);
        return next.length === 0 ? 1 : next.reduce((t, n) => t + paths(n, depth + 1), 0);
      };
      return num(m.nodes.filter((n) => !m.edges.some((e) => e.to === n.id)).reduce((t, n) => t + paths(n.id, 0), 0));
    },
  },
  // solid_3d
  solid_volume: {
    kinds: ['solid_3d'], args: '{ as?: decimal | pi }', returns: 'the volume of the solid — as a decimal, or as an exact multiple of π ("72π") for a round solid',
    run: (s, a) => { const v = solidMeasure(modelOf(s, solidModel), 'volume'); return pick(a, 'as', AS, 'decimal') === 'pi' ? (v.pi ? piForm(v.value / Math.PI) : fail('the solid has no π in its volume')) : measured(v.value); },
  },
  solid_surface_area: {
    kinds: ['solid_3d'], args: '{ part?: total | lateral, as?: decimal | pi }', returns: 'the total surface area of the solid (a composite: its outside, the hidden joining faces left out), or its lateral area only (no bases)',
    run: (s, a) => {
      const m = modelOf(s, solidModel);
      const part = pick(a, 'part', ['total', 'lateral'] as const, 'total');
      if (m.solid === 'sphere' && part === 'lateral') return fail('a sphere has no lateral surface apart from its whole surface');
      const v = solidMeasure(m, part === 'total' ? 'surface' : 'lateral');
      return pick(a, 'as', AS, 'decimal') === 'pi' ? (v.pi ? piForm(v.value / Math.PI) : fail('the solid has no π in its surface area')) : measured(v.value);
    },
  },
  solid_slant_height: {
    kinds: ['solid_3d'], args: '{}', returns: 'the slant height of a cone or pyramid (also when it is the top of a composite)',
    run: (s) => { const m = modelOf(s, solidModel); return m.dims.slant === undefined ? fail('this solid has no slant height') : measured(m.dims.slant); },
  },
  solid_revolution_volume: {
    kinds: ['solid_3d'], args: '{ as?: pi | decimal }', returns: 'the exact volume of the solid of revolution as a fraction times π ("3π/10"): disks or washers about the x-axis, shells about the y-axis — or as a decimal',
    run: (s, a) => {
      const m = modelOf(s, solidModel);
      if (!m.revolution) return fail('this checker is for the revolution variant');
      const v = revolutionVolume(m.revolution);
      if (!v) return fail('the volume is not a rational multiple of π for this region (a square root revolved about the y-axis) — no exact form');
      if (v.num <= 0) return fail('the region has no volume');
      return pick(a, 'as', ['pi', 'decimal'] as const, 'pi') === 'pi' ? text(piText(v.num, v.den)) : approx((v.num / v.den) * Math.PI);
    },
  },
  // spectrum
  spectrum_average_mass: {
    kinds: ['spectrum'], args: '{}', returns: 'the abundance-weighted average mass of the peaks of a mass spectrum (rounded)',
    run: (s) => { const m = spectrumOf(s, 'mass'); const total = m.peaks.reduce((t, p) => t + p.abundance, 0); return approx(m.peaks.reduce((t, p) => t + p.mz * p.abundance, 0) / total); },
  },
  spectrum_most_abundant: {
    kinds: ['spectrum'], args: '{}', returns: 'the m/z of the tallest peak of a mass spectrum',
    run: (s) => { const m = spectrumOf(s, 'mass'); const top = [...m.peaks].sort((x, y) => y.abundance - x.abundance); return top.length > 1 && top[0].abundance === top[1].abundance ? fail('two peaks are equally tall') : num(top[0].mz); },
  },
  spectrum_element: {
    kinds: ['spectrum'], args: '{}', returns: 'the label with the element\'s name: from the average atomic mass of a mass spectrum (hydrogen to krypton, within 0.3), or from the electron count of a photoelectron spectrum',
    run: (s) => {
      const m = modelOf(s, spectrumModel);
      if (m.variant === 'pes') {
        pesSubshells(m);
        const z = m.peaks.reduce((t, p) => t + p.electrons, 0);
        return label((ELEMENTS.find((e) => e[0] === z) ?? fail(`no element has ${z} electrons in this table`))[2]);
      }
      if (m.variant !== 'mass') return fail('this checker is for a mass spectrum or a photoelectron spectrum');
      const avg = m.peaks.reduce((t, p) => t + p.mz * p.abundance, 0) / m.peaks.reduce((t, p) => t + p.abundance, 0);
      const near = ELEMENTS.filter((e) => Math.abs(e[3] - avg) <= 0.3);
      return near.length === 1 ? label(near[0][2]) : fail(`the average mass ${fmt(Number(avg.toFixed(2)))} does not single out one element (${near.length} lie within 0.3)`);
    },
  },
  spectrum_configuration: {
    kinds: ['spectrum'], args: '{}', returns: 'the ground-state electron configuration read from the peak heights of a photoelectron spectrum, as "1s² 2s² 2p⁶ 3s¹"',
    run: (s) => { const m = spectrumOf(s, 'pes'); const names = pesSubshells(m); return text(m.peaks.map((p, i) => `${names[i]}${sup(p.electrons)}`).join(' ')); },
  },
  spectrum_peak_subshell: {
    kinds: ['spectrum'], args: '{ peak: index (0 = the leftmost, the highest binding energy) }', returns: 'the label of the subshell that peak comes from ("2p")',
    run: (s, a) => { const m = spectrumOf(s, 'pes'); return label(pesSubshells(m)[argIndex(a, 'peak', m.peaks.length, 'peak')]); },
  },
  spectrum_concentration: {
    kinds: ['spectrum'], args: '{ absorbance?: number }', returns: 'the concentration at which the calibration line reaches that absorbance (default: the sample\'s)',
    run: (s, a) => {
      const m = spectrumOf(s, 'absorbance');
      const A = a.absorbance === undefined ? m.sample?.absorbance ?? fail('give the absorbance, or a sample in the spec') : argNum(a, 'absorbance');
      const c = (A - m.intercept) / m.slope;
      return c < -1e-12 || c > m.xMax + 1e-9 ? fail('that absorbance is off the line as drawn') : measured(c);
    },
  },
  spectrum_lines_present: {
    kinds: ['spectrum'], args: '{ row?: index (0) }', returns: 'which of the other strips have ALL their lines in that strip (within a fifth of an axis step): the label of the one, or the labels in order as "A, B"',
    run: (s, a) => {
      const m = spectrumOf(s, 'lines');
      if (m.rows.length < 2) return fail('there is only one strip');
      const k = argIndex(a, 'row', m.rows.length, 'strip');
      const tol = m.step / 5;
      const hits = m.rows.filter((row, i) => i !== k && row.lines.every((nm) => m.rows[k].lines.some((x) => Math.abs(x - nm) <= tol + 1e-9))).map((row) => row.label);
      return hits.length === 0 ? label('none') : hits.length === 1 ? label(hits[0]) : text(hits.join(', '));
    },
  },
};

/** Batch-2 kinds lay out their own scales from their params; none has an axis a layout default could move. */
export const isBatch2Kind = (type: string): type is Batch2FigureKind => (BATCH2_FIGURE_KINDS as readonly string[]).includes(type);
