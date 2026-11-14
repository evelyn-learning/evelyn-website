'use client';

import { InlineMathText } from './InlineMathText';
/**
 * Circuit Renderer
 *
 * Schematic circuit diagrams for AP Physics 2 / Physics C E&M / college intro.
 * Components are placed between nodes in a normalized 0–100 coordinate system.
 * Standard IEEE schematic symbols (zigzag resistors, parallel-plate capacitors,
 * battery cells, etc.).
 *
 * This is a teaching renderer — not a SPICE simulator. The LLM provides
 * component values and placements; we just draw them.
 */

import React from 'react';
import { feat, featSlug, type FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';
import { collapseRailWires as collapseRailWiresShared } from '@/lib/tutor/diagrams/circuit-graph';

export type CircuitComponentType =
  | 'resistor'
  | 'capacitor'
  | 'inductor'
  | 'battery'
  | 'wire'
  | 'switch-open'
  | 'switch-closed'
  | 'bulb'
  | 'voltmeter'
  | 'ammeter'
  | 'galvanometer'
  | 'ground'
  /** A break in the wire: two bare ends with nothing between them (a cut or loose wire). */
  | 'gap'
  /** A thing put across a gap, drawn as a labelled block: a plastic spoon, a paper clip, a coin. */
  | 'object';

export interface CircuitNode {
  id: string;
  x: number; // 0–100
  y: number; // 0–100
}

export interface CircuitComponent {
  type: CircuitComponentType;
  from: string; // node id
  to: string; // node id
  value?: string;
  unit?: string;
  label?: string;
}

export interface CircuitRendererProps {
  title?: string;
  /** Unused — retained for backward compatibility. Positions are always auto-computed. */
  nodes?: CircuitNode[];
  components: CircuitComponent[];
  /** Optional current arrow label (e.g. "I") drawn on a circuit loop. */
  currentLabel?: string;
  /** Show small circles at each node. */
  showNodes?: boolean;
}

type Pt = [number, number];

const STROKE = '#1f2937';
const LABEL_FONT = 14;
const SUB_FONT = 10.5;
/** Wire kept on each side of a symbol. */
const LEAD = 14;

/** Half-length of each symbol along its wire. */
const SYMBOL_HALF_LEN: Record<CircuitComponentType, number> = {
  resistor: 20,
  capacitor: 6,
  inductor: 20,
  battery: 5,
  wire: 0,
  'switch-open': 18,
  'switch-closed': 18,
  bulb: 13,
  voltmeter: 13,
  ammeter: 13,
  galvanometer: 13,
  ground: 0,
  gap: 16,
  object: 24,
};

/** Half-height of each symbol across its wire. */
const SYMBOL_HALF_PERP: Record<CircuitComponentType, number> = {
  resistor: 7,
  capacitor: 12,
  inductor: 7,
  battery: 14,
  wire: 0,
  'switch-open': 13,
  'switch-closed': 4,
  bulb: 13,
  voltmeter: 13,
  ammeter: 13,
  galvanometer: 13,
  ground: 10,
  gap: 5,
  object: 10,
};

/* ------------------------------------------------------------------ */
/* Labels: "R1" → R₁, "R_load" → R with a subscript                    */
/* ------------------------------------------------------------------ */

interface LabelRun { text: string; sub?: boolean }

/** Splits a variable name into base and subscript runs (R_load, V_{source}, R1, C12). */
function subscriptRuns(label: string): LabelRun[] {
  const runs: LabelRun[] = [];
  const re = /([A-Za-zͰ-Ͽℰ])_\{([^}]+)\}|([A-Za-zͰ-Ͽℰ])_([A-Za-z0-9]+)|(^|[^A-Za-z0-9])([A-Za-z])(\d{1,2})(?![A-Za-z0-9])/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(label)) !== null) {
    const base = m[1] ?? m[3] ?? `${m[5] ?? ''}${m[6]}`;
    const sub = m[2] ?? m[4] ?? m[7];
    if (m.index > last) runs.push({ text: label.slice(last, m.index) });
    runs.push({ text: base });
    runs.push({ text: sub, sub: true });
    last = m.index + m[0].length;
  }
  if (last < label.length) runs.push({ text: label.slice(last) });
  return runs.filter((r) => r.text.length > 0);
}

/** The text shown beside a component: "R₁ = 4 Ω", "12 V", "S". */
function componentLabelRuns(c: CircuitComponent): LabelRun[] {
  const { value, unit } = c;
  // A meter already shows its letter: a label that only repeats it is noise.
  const meterLetter = c.type === 'voltmeter' ? 'V' : c.type === 'ammeter' ? 'A' : c.type === 'galvanometer' ? 'G' : '';
  const label = meterLetter && c.label?.trim().toUpperCase() === meterLetter ? undefined : c.label;
  // De-duplicate when the model passed the magnitude in `label` instead
  // of (or in addition to) `value`. Without this, "150Ω" + value:150 +
  // unit:Ω renders as the comically duplicated "150Ω = 150 Ω".
  const valueWithUnit = value ? `${value}${unit ? ' ' + unit : ''}` : '';
  const labelLooksLikeValue = (() => {
    if (!label || !valueWithUnit) return false;
    const norm = (s: string) => s.replace(/\s+/g, '').toLowerCase();
    const nL = norm(label);
    const nV = norm(valueWithUnit);
    return nL === nV || nL === norm(value || '') || nL.includes(nV) || nV.includes(nL);
  })();
  if (label && !labelLooksLikeValue) {
    const runs = subscriptRuns(label);
    if (valueWithUnit) runs.push({ text: ` = ${valueWithUnit}` });
    return runs;
  }
  if (valueWithUnit) return [{ text: valueWithUnit }];
  return label ? subscriptRuns(label) : [];
}

function runsWidth(runs: LabelRun[]): number {
  let w = 0;
  for (const r of runs) w += r.text.length * (r.sub ? SUB_FONT : LABEL_FONT) * 0.58;
  return w;
}

/* ------------------------------------------------------------------ */
/* One component drawn between two points                              */
/* ------------------------------------------------------------------ */

/**
 * Draw a schematic component between two SVG points: the symbol sits on the
 * midpoint, aligned to the segment, with straight leads to both ends. The
 * label goes on the `side` of the wire the layout keeps free.
 */
function ComponentShape({
  comp,
  from,
  to,
  side,
  featureName,
  viewW,
  viewH,
}: {
  comp: CircuitComponent;
  from: Pt;
  to: Pt;
  side: Pt;
  featureName?: string;
  viewW: number;
  viewH: number;
}) {
  const { type } = comp;
  const [x1, y1] = from;
  const [x2, y2] = to;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  const half = SYMBOL_HALF_LEN[type] ?? 0;
  const perp = SYMBOL_HALF_PERP[type] ?? 0;

  const meter = (letter: string) => (
    <>
      <circle cx={0} cy={0} r={13} fill="#fff" stroke={STROKE} strokeWidth={2} />
      {/* Counter-rotated so the letter always reads upright. */}
      <g transform={`rotate(${-angle})`}>
        <text x={0} y={5} textAnchor="middle" fontSize={14} fill={STROKE} fontWeight={700}>
          {letter}
        </text>
      </g>
    </>
  );

  const symbol = (() => {
    switch (type) {
      case 'resistor': {
        const peaks = 6;
        const peakHeight = 7;
        const step = (half * 2) / peaks;
        let path = `M ${-half},0`;
        for (let i = 0; i < peaks; i++) {
          const x = -half + (i + 0.5) * step;
          const y = (i % 2 === 0 ? -1 : 1) * peakHeight;
          path += ` L ${x},${y}`;
        }
        path += ` L ${half},0`;
        return <path d={path} fill="none" stroke={STROKE} strokeWidth={2} strokeLinejoin="round" />;
      }
      case 'capacitor':
        return (
          <>
            <line x1={-half} y1={-12} x2={-half} y2={12} stroke={STROKE} strokeWidth={2.5} />
            <line x1={half} y1={-12} x2={half} y2={12} stroke={STROKE} strokeWidth={2.5} />
          </>
        );
      case 'inductor': {
        const loops = 4;
        const loopR = half / loops;
        const arcs: React.ReactElement[] = [];
        for (let i = 0; i < loops; i++) {
          const cx = -half + loopR + i * 2 * loopR;
          arcs.push(
            <path
              key={i}
              d={`M ${cx - loopR},0 A ${loopR},${loopR * 1.3} 0 0 1 ${cx + loopR},0`}
              fill="none"
              stroke={STROKE}
              strokeWidth={2}
            />,
          );
        }
        return <>{arcs}</>;
      }
      case 'battery':
        // `from` is the positive terminal: the long thin plate.
        return (
          <>
            <line x1={-half} y1={-14} x2={-half} y2={14} stroke={STROKE} strokeWidth={2} />
            <line x1={half} y1={-7} x2={half} y2={7} stroke={STROKE} strokeWidth={4} />
          </>
        );
      case 'switch-open':
        return (
          <>
            <line x1={-half + 4} y1={0} x2={half - 5} y2={-13} stroke={STROKE} strokeWidth={2} strokeLinecap="round" />
            <circle cx={-half + 3} cy={0} r={3} fill="#fafbfc" stroke={STROKE} strokeWidth={1.5} />
            <circle cx={half - 3} cy={0} r={3} fill="#fafbfc" stroke={STROKE} strokeWidth={1.5} />
          </>
        );
      case 'switch-closed':
        return (
          <>
            <line x1={-half + 4} y1={0} x2={half - 4} y2={0} stroke={STROKE} strokeWidth={2} />
            <circle cx={-half + 3} cy={0} r={3} fill="#fafbfc" stroke={STROKE} strokeWidth={1.5} />
            <circle cx={half - 3} cy={0} r={3} fill="#fafbfc" stroke={STROKE} strokeWidth={1.5} />
          </>
        );
      case 'bulb':
        return (
          <>
            <circle cx={0} cy={0} r={13} fill="#fef3c7" stroke={STROKE} strokeWidth={2} />
            <line x1={-9} y1={-9} x2={9} y2={9} stroke={STROKE} strokeWidth={1.5} />
            <line x1={-9} y1={9} x2={9} y2={-9} stroke={STROKE} strokeWidth={1.5} />
          </>
        );
      case 'gap':
        // Two bare wire ends and empty space between: the loop is broken here.
        return (
          <>
            <circle cx={-half} cy={0} r={2.5} fill={STROKE} />
            <circle cx={half} cy={0} r={2.5} fill={STROKE} />
          </>
        );
      case 'object':
        // The thing across the gap; its name is the label beside it.
        return <rect x={-half} y={-9} width={half * 2} height={18} rx={7} fill="#e5e7eb" stroke={STROKE} strokeWidth={1.8} />;
      case 'voltmeter':
        return meter('V');
      case 'ammeter':
        return meter('A');
      case 'galvanometer':
        return meter('G');
      default:
        return null;
    }
  })();

  // Label beside the symbol, on the side the layout reserved for it.
  const runs = componentLabelRuns(comp);
  const labelW = runsWidth(runs);
  const [sx, sy] = side;
  const sideways = Math.abs(sx) > 0.5;
  // Ground: the label sits past the bars, on the axis side.
  const labelX = sideways ? mx + sx * (perp + 7) : mx;
  const labelY = sideways ? my + 5 : sy < 0 ? my - perp - 7 : my + perp + LABEL_FONT + 3;
  const anchor = sideways ? (sx > 0 ? 'start' : 'end') : 'middle';
  const maskX = anchor === 'middle' ? labelX - labelW / 2 : anchor === 'start' ? labelX : labelX - labelW;

  const featBbox = {
    cx: mx,
    cy: my,
    w: Math.max(44, Math.abs(dx) + 40),
    h: Math.max(44, Math.abs(dy) + 40),
  };
  const featureProps = featureName ? feat(featureName, featBbox, { width: viewW, height: viewH }) : {};

  if (type === 'ground') {
    // A lead from the node, then the three bars at its far end.
    return (
      <g {...featureProps}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={STROKE} strokeWidth={2} />
        <g transform={`translate(${x2}, ${y2}) rotate(${angle})`}>
          <line x1={0} y1={-10} x2={0} y2={10} stroke={STROKE} strokeWidth={2} />
          <line x1={4.5} y1={-6} x2={4.5} y2={6} stroke={STROKE} strokeWidth={2} />
          <line x1={9} y1={-2.5} x2={9} y2={2.5} stroke={STROKE} strokeWidth={2} />
        </g>
        {runs.length > 0 && (
          <text x={x2 + sx * 16} y={y2 + (sideways ? 5 : sy * 16 + 5)} textAnchor={anchor} fontSize={LABEL_FONT} fill={STROKE} fontWeight={500}>
            {renderRuns(runs)}
          </text>
        )}
      </g>
    );
  }

  return (
    <g {...featureProps}>
      {half > 0 ? (
        <>
          <line x1={x1} y1={y1} x2={mx - ux * half} y2={my - uy * half} stroke={STROKE} strokeWidth={2} strokeLinecap="round" />
          <line x1={mx + ux * half} y1={my + uy * half} x2={x2} y2={y2} stroke={STROKE} strokeWidth={2} strokeLinecap="round" />
        </>
      ) : (
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={STROKE} strokeWidth={2} strokeLinecap="round" />
      )}
      {symbol && <g transform={`translate(${mx}, ${my}) rotate(${angle})`}>{symbol}</g>}
      {type === 'battery' && (
        <>
          {/* Polarity marks on the side away from the label, upright. */}
          <text x={mx - sx * 22 - ux * 11} y={my - sy * 22 - uy * 11 + 5} textAnchor="middle" fontSize={15} fill={STROKE} fontWeight={700}>
            +
          </text>
          <text x={mx - sx * 22 + ux * 11} y={my - sy * 22 + uy * 11 + 5} textAnchor="middle" fontSize={15} fill={STROKE} fontWeight={700}>
            −
          </text>
        </>
      )}
      {runs.length > 0 && (
        <g>
          <rect x={maskX - 3} y={labelY - LABEL_FONT} width={labelW + 6} height={LABEL_FONT + 5} fill="#fafbfc" />
          <text x={labelX} y={labelY} textAnchor={anchor} fontSize={LABEL_FONT} fill={STROKE} fontWeight={500}>
            {renderRuns(runs)}
          </text>
        </g>
      )}
    </g>
  );
}

function renderRuns(runs: LabelRun[]): React.ReactNode {
  // dy is relative to the previous run, so a subscript drops and the next run rises back.
  let lowered = false;
  return runs.map((r, i) => {
    const dy = r.sub ? (lowered ? 0 : 4) : lowered ? -4 : 0;
    lowered = !!r.sub;
    return (
      <tspan key={i} dy={dy} fontSize={r.sub ? SUB_FONT : undefined}>
        {r.text}
      </tspan>
    );
  });
}

/* ------------------------------------------------------------------ */
/* Auto-layout: netlist → orthogonal schematic                         */
/*                                                                     */
/* The netlist is reduced to a series-parallel tree between the two    */
/* terminals of the source (series: a node joining exactly two         */
/* branches; parallel: two branches between the same two nodes). The   */
/* tree is then drawn with horizontal and vertical runs only:          */
/*   - a series chain goes around a rectangular loop (top, right,      */
/*     bottom), the source on the left side;                           */
/*   - parallel branches at the top level become the rungs of a        */
/*     ladder between a top and a bottom rail;                         */
/*   - a parallel group inside a chain is drawn as stacked rungs       */
/*     between two bus bars; a voltmeter is always the outer rung.     */
/* What the reduction cannot absorb (a bridge, as in a Wheatstone      */
/* circuit) is routed afterwards as an L-shaped jumper between the     */
/* nodes it joins; a branch that leads nowhere (a ground) is a stub.   */
/* ------------------------------------------------------------------ */

type El =
  | { kind: 'leaf'; comp: CircuitComponent; rev: boolean }
  | { kind: 'S'; children: El[]; nodes: string[] }
  | { kind: 'P'; children: El[] };

interface Edge { a: string; b: string; el: El }

function flipEl(el: El): El {
  if (el.kind === 'leaf') return { ...el, rev: !el.rev };
  if (el.kind === 'P') return { kind: 'P', children: el.children.map(flipEl) };
  return { kind: 'S', children: [...el.children].reverse().map(flipEl), nodes: [...el.nodes].reverse() };
}

/** The edge's element, oriented to start at `start`. */
function orientedFrom(e: Edge, start: string): El {
  return e.a === start ? e.el : flipEl(e.el);
}

function seriesOf(first: El, node: string, second: El): El {
  const a = first.kind === 'S' ? first : { kind: 'S' as const, children: [first], nodes: [] };
  const b = second.kind === 'S' ? second : { kind: 'S' as const, children: [second], nodes: [] };
  return { kind: 'S', children: [...a.children, ...b.children], nodes: [...a.nodes, node, ...b.nodes] };
}

function parallelOf(first: El, second: El): El {
  const a = first.kind === 'P' ? first.children : [first];
  const b = second.kind === 'P' ? second.children : [second];
  return { kind: 'P', children: [...a, ...b] };
}

interface Stub { at: string; far: string; el: El }

interface Reduction {
  root: El | null;
  stubs: Stub[];
  jumpers: Edge[];
  dangling: CircuitComponent[];
}

const JUMPER_PREFERENCE: CircuitComponentType[] = ['voltmeter', 'galvanometer', 'wire', 'ammeter'];

function leavesOf(el: El): CircuitComponent[] {
  if (el.kind === 'leaf') return [el.comp];
  return el.children.flatMap(leavesOf);
}

function reduceSeriesParallel(components: CircuitComponent[], s: string, t: string): Reduction {
  const stubs: Stub[] = [];
  const jumpers: Edge[] = [];
  let work: Edge[] = components
    .filter((c) => c.from !== c.to)
    .map((c) => ({ a: c.from, b: c.to, el: { kind: 'leaf' as const, comp: c, rev: false } }));

  // Anything not connected to the source cannot be placed on the loop.
  const reach = new Set<string>([s, t]);
  for (let grew = true; grew; ) {
    grew = false;
    for (const e of work) {
      if (reach.has(e.a) !== reach.has(e.b)) { reach.add(e.a); reach.add(e.b); grew = true; }
    }
  }
  const dangling = work.filter((e) => !reach.has(e.a)).flatMap((e) => leavesOf(e.el));
  work = work.filter((e) => reach.has(e.a));

  for (let guard = 0; guard < 2000; guard++) {
    // Parallel: two branches between the same pair of nodes.
    let merged = false;
    for (let i = 0; i < work.length && !merged; i++) {
      for (let j = i + 1; j < work.length; j++) {
        const e1 = work[i];
        const e2 = work[j];
        if ((e1.a === e2.a && e1.b === e2.b) || (e1.a === e2.b && e1.b === e2.a)) {
          const el = parallelOf(e1.el, orientedFrom(e2, e1.a));
          work = work.filter((_, k) => k !== i && k !== j);
          work.splice(i, 0, { a: e1.a, b: e1.b, el });
          merged = true;
          break;
        }
      }
    }
    if (merged) continue;

    const incident = new Map<string, Edge[]>();
    for (const e of work) {
      for (const n of [e.a, e.b]) {
        if (!incident.has(n)) incident.set(n, []);
        incident.get(n)!.push(e);
      }
    }

    // A branch that leads nowhere: drawn later as a stub off its node.
    let changed = false;
    for (const [node, edges] of incident) {
      if (node === s || node === t || edges.length !== 1) continue;
      const e = edges[0];
      const at = e.a === node ? e.b : e.a;
      stubs.push({ at, far: node, el: orientedFrom(e, at) });
      work = work.filter((x) => x !== e);
      changed = true;
      break;
    }
    if (changed) continue;

    // Series: a node that joins exactly two branches.
    for (const [node, edges] of incident) {
      if (node === s || node === t || edges.length !== 2) continue;
      const [e1, e2] = edges;
      const x = e1.a === node ? e1.b : e1.a;
      const y = e2.a === node ? e2.b : e2.a;
      const el = seriesOf(orientedFrom(e1, x), node, orientedFrom(e2, node));
      const at = work.indexOf(e1);
      work = work.filter((e) => e !== e1 && e !== e2);
      work.splice(Math.min(at, work.length), 0, { a: x, b: y, el });
      changed = true;
      break;
    }
    if (changed) continue;

    if (work.length <= 1) break;

    // Not series-parallel (a bridge). Lift one branch out, meters first, and route it afterwards.
    const single = work.filter((e) => e.el.kind === 'leaf');
    let pick: Edge | undefined;
    for (const type of JUMPER_PREFERENCE) {
      pick = single.find((e) => e.el.kind === 'leaf' && e.el.comp.type === type);
      if (pick) break;
    }
    if (!pick) {
      const notOnTerminal = (e: Edge) => e.a !== s && e.a !== t && e.b !== s && e.b !== t;
      pick = single.find(notOnTerminal) ?? single[0] ?? work.find(notOnTerminal) ?? work[work.length - 1];
    }
    jumpers.push(pick);
    work = work.filter((e) => e !== pick);
  }

  const last = work[0];
  const root = last && ((last.a === s && last.b === t) || (last.a === t && last.b === s)) ? orientedFrom(last, s) : null;
  return { root, stubs, jumpers, dangling };
}

/* ---- measuring ---- */

interface Size { len: number; up: number; down: number }

const PARALLEL_GAP = 14;
/** Lead between a parallel group's end and its bus bar. */
const BUS_LEAD = 12;

function measureLeaf(comp: CircuitComponent, horiz: boolean): Size {
  const half = SYMBOL_HALF_LEN[comp.type] ?? 0;
  const perp = SYMBOL_HALF_PERP[comp.type] ?? 0;
  const labelW = runsWidth(componentLabelRuns(comp));
  if (comp.type === 'ground') return { len: 30, up: Math.max(12, labelW + 18), down: 12 };
  // The battery keeps its + and − marks on the side opposite the label.
  const down = comp.type === 'battery' ? 34 : perp + 4;
  if (horiz) {
    return {
      len: Math.max(2 * half + 2 * LEAD, labelW + 18),
      up: labelW > 0 ? perp + LABEL_FONT + 12 : perp + 4,
      down,
    };
  }
  return { len: 2 * half + 2 * LEAD + (labelW > 0 ? 6 : 0), up: labelW > 0 ? perp + 12 + labelW : perp + 4, down };
}

/** Offsets of each parallel branch across the group's axis (+ is the label side). */
function parallelOffsets(children: El[], horiz: boolean): { order: El[]; offs: number[]; sizes: Size[]; up: number; down: number; len: number } {
  const isVoltmeter = (el: El) => el.kind === 'leaf' && el.comp.type === 'voltmeter';
  // A voltmeter is the outermost rung: the branch it measures stays on the main line.
  const mains = children.filter((c) => !isVoltmeter(c));
  const order = [...mains, ...children.filter(isVoltmeter)];
  const sizes = order.map((c) => measure(c, horiz));
  const axes: number[] = [];
  let cursor = 0;
  for (const sz of sizes) {
    axes.push(cursor + sz.down);
    cursor += sz.down + sz.up + PARALLEL_GAP;
  }
  const m = mains.length;
  const axis0 = m === 0
    ? (axes[0] + axes[axes.length - 1]) / 2
    : m % 2 === 1
      ? axes[(m - 1) / 2]
      : (axes[m / 2 - 1] + axes[m / 2]) / 2;
  const offs = axes.map((a) => a - axis0);
  return {
    order,
    offs,
    sizes,
    up: Math.max(8, ...offs.map((o, i) => o + sizes[i].up)),
    down: Math.max(8, ...offs.map((o, i) => -o + sizes[i].down)),
    len: Math.max(...sizes.map((sz) => sz.len)) + 2 * BUS_LEAD,
  };
}

function measure(el: El, horiz: boolean): Size {
  if (el.kind === 'leaf') return measureLeaf(el.comp, horiz);
  if (el.kind === 'P') {
    const p = parallelOffsets(el.children, horiz);
    return { len: p.len, up: p.up, down: p.down };
  }
  const sizes = el.children.map((c) => measure(c, horiz));
  return {
    len: sizes.reduce((sum, sz) => sum + sz.len, 0),
    up: Math.max(...sizes.map((sz) => sz.up)),
    down: Math.max(...sizes.map((sz) => sz.down)),
  };
}

/* ---- placing ---- */

interface PlacedPart { comp: CircuitComponent; from: Pt; to: Pt; side: Pt }

interface Drawing {
  parts: PlacedPart[];
  wires: Array<[Pt, Pt]>;
  dots: Pt[];
  /** Where each netlist node can be tapped, and the free direction there. */
  anchors: Map<string, { p: Pt; out: Pt }>;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

function newDrawing(): Drawing {
  return { parts: [], wires: [], dots: [], anchors: new Map(), minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
}

function grow(d: Drawing, p: Pt): void {
  d.minX = Math.min(d.minX, p[0]);
  d.maxX = Math.max(d.maxX, p[0]);
  d.minY = Math.min(d.minY, p[1]);
  d.maxY = Math.max(d.maxY, p[1]);
}

function addWire(d: Drawing, a: Pt, b: Pt): void {
  if (Math.abs(a[0] - b[0]) < 0.01 && Math.abs(a[1] - b[1]) < 0.01) return;
  d.wires.push([a, b]);
  grow(d, a);
  grow(d, b);
}

const along = (p: Pt, dir: Pt, dist: number): Pt => [p[0] + dir[0] * dist, p[1] + dir[1] * dist];
/** The label side of a run: left of the direction of travel (outward on a clockwise loop). */
const sideOf = (dir: Pt): Pt => [dir[1], -dir[0]];

/** Draw `el` along `dir` from `p0`, stretched to `len` (its leads take up the slack). */
function place(d: Drawing, el: El, p0: Pt, dir: Pt, len: number): void {
  const horiz = dir[1] === 0;
  const side = sideOf(dir);
  const p1 = along(p0, dir, len);

  if (el.kind === 'leaf') {
    const sz = measureLeaf(el.comp, horiz);
    const swap = el.rev && el.comp.type !== 'ground';
    d.parts.push({ comp: el.comp, from: swap ? p1 : p0, to: swap ? p0 : p1, side });
    // Only the symbol and its label need room; the leads are bare wire.
    const mid = along(p0, dir, len / 2);
    const halfSpan = Math.min(len, sz.len) / 2;
    for (const q of [along(mid, dir, -halfSpan), along(mid, dir, halfSpan)]) {
      grow(d, along(q, side, sz.up));
      grow(d, along(q, side, -sz.down));
    }
    grow(d, p0);
    grow(d, p1);
    return;
  }

  if (el.kind === 'S') {
    const sizes = el.children.map((c) => measure(c, horiz));
    const total = sizes.reduce((sum, sz) => sum + sz.len, 0);
    const extra = Math.max(0, len - total) / el.children.length;
    const squeeze = total > len ? len / total : 1;
    let cursor = p0;
    el.children.forEach((child, i) => {
      const childLen = sizes[i].len * squeeze + extra;
      place(d, child, cursor, dir, childLen);
      cursor = along(cursor, dir, childLen);
      if (i < el.nodes.length) d.anchors.set(el.nodes[i], { p: cursor, out: side });
    });
    return;
  }

  const p = parallelOffsets(el.children, horiz);
  // Keep the bus bars near the branches instead of stretching every rung.
  const inner = Math.min(len - 2 * BUS_LEAD, p.len - 2 * BUS_LEAD + 24);
  const startBus = along(p0, dir, (len - inner) / 2);
  const endBus = along(startBus, dir, inner);
  addWire(d, p0, startBus);
  addWire(d, endBus, p1);
  const lo = Math.min(...p.offs);
  const hi = Math.max(...p.offs);
  addWire(d, along(startBus, side, lo), along(startBus, side, hi));
  addWire(d, along(endBus, side, lo), along(endBus, side, hi));
  d.dots.push(startBus, endBus);
  p.order.forEach((child, i) => {
    const o = p.offs[i];
    place(d, child, along(startBus, side, o), dir, inner);
    // A dot wherever a rung tees into the bus (not at the bus corners).
    if (o > lo + 0.5 && o < hi - 0.5 && Math.abs(o) > 0.5) {
      d.dots.push(along(startBus, side, o), along(endBus, side, o));
    }
  });
}

interface LayoutResult {
  drawing: Drawing;
  warnings: string[];
}

function sliceChain(children: El[], nodes: string[], from: number, to: number): El | null {
  if (to <= from) return null;
  if (to - from === 1) return children[from];
  return { kind: 'S', children: children.slice(from, to), nodes: nodes.slice(from, to - 1) };
}

/** Series chain around a rectangle: top, right side, bottom; the source on the left. */
function layoutLoop(d: Drawing, source: El, chain: El[], nodes: string[], s: string, t: string): void {
  const k = chain.length;
  const h = chain.map((c) => measure(c, true));
  const v = chain.map((c) => measure(c, false));
  const src = measure(source, false);
  const sum = (sizes: Size[], a: number, b: number) => sizes.slice(a, b).reduce((acc, sz) => acc + sz.len, 0);
  const inward = (sizes: Size[], a: number, b: number) => (b > a ? Math.max(...sizes.slice(a, b).map((sz) => sz.down)) : 0);

  interface Plan { i: number; j: number; W: number; H: number; insetL: number; insetR: number; insetT: number; insetB: number; cost: number }
  let best: Plan | null = null;
  for (let i = 0; i <= k; i++) {
    for (let j = i; j <= k; j++) {
      const topLen = sum(h, 0, i);
      const rightLen = sum(v, i, j);
      const botLen = sum(h, j, k);
      const insetL = src.down + 14;
      const insetR = inward(v, i, j) + 14;
      const insetT = inward(h, 0, i) + 14;
      const insetB = inward(h, j, k) + 14;
      let W = Math.max(topLen, botLen) + insetL + insetR;
      let H = Math.max(rightLen, src.len) + insetT + insetB;
      W = Math.max(W, 300);
      H = Math.max(H, 180);
      if (W < H * 1.3) W = H * 1.3;
      if (H < W * 0.5) H = W * 0.5;
      // Smallest 3:2 frame wins; then prefer a used right side and balanced top/bottom.
      const cost = Math.max(W, H * 1.5)
        + 0.2 * Math.abs(topLen - botLen)
        + (j === i && k >= 2 ? 70 : 0)
        + (i === 0 && k >= 2 ? 90 : 0)
        + (j - i > 1 && k <= 4 ? 40 : 0);
      if (!best || cost < best.cost - 0.01) best = { i, j, W, H, insetL, insetR, insetT, insetB, cost };
    }
  }
  const plan = best!;
  const { i, j, W, H } = plan;
  const TL: Pt = [0, 0];
  const TR: Pt = [W, 0];
  const BR: Pt = [W, H];
  const BL: Pt = [0, H];

  const runSide = (el: El | null, a: Pt, b: Pt, dir: Pt, insetA: number, insetB: number) => {
    if (!el) { addWire(d, a, b); return; }
    const total = Math.abs(b[0] - a[0]) + Math.abs(b[1] - a[1]);
    const start = along(a, dir, insetA);
    const span = total - insetA - insetB;
    addWire(d, a, start);
    place(d, el, start, dir, span);
    addWire(d, along(start, dir, span), b);
  };
  runSide(sliceChain(chain, nodes, 0, i), TL, TR, [1, 0], plan.insetL, plan.insetR);
  runSide(sliceChain(chain, nodes, i, j), TR, BR, [0, 1], plan.insetT, plan.insetB);
  runSide(sliceChain(chain, nodes, j, k), BR, BL, [-1, 0], plan.insetR, plan.insetL);
  // The source runs up the left side, so its label side is the outside (left).
  runSide(flipEl(source), BL, TL, [0, -1], plan.insetB, plan.insetT);

  d.anchors.set(s, { p: TL, out: [0, -1] });
  d.anchors.set(t, { p: BL, out: [0, 1] });
  if (i > 0 && i < k) d.anchors.set(nodes[i - 1], { p: TR, out: [1, 0] });
  if (j > i && j < k) d.anchors.set(nodes[j - 1], { p: BR, out: [1, 0] });
}

/** Parallel branches as the rungs of a ladder; the source is the leftmost rung. */
function layoutLadder(d: Drawing, source: El, branches: El[], s: string, t: string): void {
  const isVoltmeter = (el: El) => el.kind === 'leaf' && el.comp.type === 'voltmeter';
  const rungs = [...branches.filter((b) => !isVoltmeter(b)), ...branches.filter(isVoltmeter)];
  const src = measure(source, false);
  const sizes = rungs.map((r) => measure(r, false));
  const H = Math.max(190, src.len + 40, ...sizes.map((sz) => sz.len + 40));
  const xs: number[] = [];
  // Flowing down, a rung's label side (+) is its right.
  let prevRight = src.down;
  let x = 0;
  sizes.forEach((sz, idx) => {
    x += Math.max(prevRight + 26 + sz.down, idx === 0 && rungs.length === 1 ? 240 : 120);
    xs.push(x);
    prevRight = sz.up;
  });
  const last = xs[xs.length - 1] ?? 0;
  addWire(d, [0, 0], [last, 0]);
  addWire(d, [0, H], [last, H]);
  place(d, flipEl(source), [0, H], [0, -1], H);
  rungs.forEach((r, idx) => {
    place(d, r, [xs[idx], 0], [0, 1], H);
    if (idx < rungs.length - 1) d.dots.push([xs[idx], 0], [xs[idx], H]);
  });
  d.anchors.set(s, { p: [0, 0], out: [0, -1] });
  d.anchors.set(t, { p: [0, H], out: [0, 1] });
}

/** The source: the first battery, or failing that the first component. */
function pickSource(components: CircuitComponent[]): CircuitComponent | undefined {
  return components.find((c) => c.type === 'battery' && c.from !== c.to)
    ?? components.find((c) => c.type !== 'wire' && c.type !== 'ground' && c.from !== c.to);
}

function autoLayoutCircuit(components: CircuitComponent[]): LayoutResult {
  const warnings: string[] = [];
  const d = newDrawing();
  const source = pickSource(components);
  if (!source) return { drawing: d, warnings };
  if (source.type !== 'battery') warnings.push('No battery/source in this circuit');

  const s = source.from;
  const t = source.to;
  const rest = components.filter((c) => c !== source);
  const { root, stubs, jumpers, dangling } = reduceSeriesParallel(rest, s, t);
  const sourceEl: El = { kind: 'leaf', comp: source, rev: false };

  if (!root) {
    if (rest.length > 0 || source.type === 'battery') warnings.push('⚠ Circuit has no return path — not a closed loop (open circuit)');
    place(d, flipEl(sourceEl), [0, 190], [0, -1], 190);
    d.anchors.set(s, { p: [0, 0], out: [1, 0] });
    d.anchors.set(t, { p: [0, 190], out: [1, 0] });
  } else if (root.kind === 'S') {
    layoutLoop(d, sourceEl, root.children, root.nodes, s, t);
  } else {
    layoutLadder(d, sourceEl, root.kind === 'P' ? root.children : [root], s, t);
  }

  const unplaced: CircuitComponent[] = [...dangling];

  // Stubs hang off their node on its free side; a stub can carry another stub, so parents first.
  for (const stub of [...stubs].reverse()) {
    const anchor = d.anchors.get(stub.at);
    if (!anchor) { unplaced.push(...leavesOf(stub.el)); continue; }
    const dir = anchor.out;
    const len = measure(stub.el, dir[1] === 0).len + 10;
    place(d, stub.el, anchor.p, dir, len);
    d.dots.push(anchor.p);
    d.anchors.set(stub.far, { p: along(anchor.p, dir, len), out: dir });
  }

  // Bridges: straight when the two nodes line up, otherwise one corner; the symbol takes the longer leg.
  for (const jumper of jumpers) {
    const a = d.anchors.get(jumper.a);
    const b = d.anchors.get(jumper.b);
    if (!a || !b) { unplaced.push(...leavesOf(jumper.el)); continue; }
    const dx = b.p[0] - a.p[0];
    const dy = b.p[1] - a.p[1];
    const unit = (n: number): number => (n >= 0 ? 1 : -1);
    d.dots.push(a.p, b.p);
    if (Math.abs(dx) < 0.5 || Math.abs(dy) < 0.5) {
      const dir: Pt = Math.abs(dy) < 0.5 ? [unit(dx), 0] : [0, unit(dy)];
      place(d, jumper.el, a.p, dir, Math.abs(dx) + Math.abs(dy));
    } else if (Math.abs(dx) >= Math.abs(dy)) {
      const corner: Pt = [b.p[0], a.p[1]];
      place(d, jumper.el, a.p, [unit(dx), 0], Math.abs(dx));
      addWire(d, corner, b.p);
    } else {
      const corner: Pt = [a.p[0], b.p[1]];
      place(d, jumper.el, a.p, [0, unit(dy)], Math.abs(dy));
      addWire(d, corner, b.p);
    }
  }

  if (unplaced.length > 0) {
    const labels = unplaced.map((c) => c.label || c.type).join(', ');
    warnings.push(`⚠ Disconnected from main circuit: ${labels}`);
    // Still shown, in a row of their own under the circuit.
    let cursor: Pt = [d.minX, d.maxY + 56];
    for (const c of unplaced) {
      const el: El = { kind: 'leaf', comp: c, rev: false };
      const len = measure(el, true).len + 16;
      place(d, el, cursor, [1, 0], len);
      cursor = along(cursor, [1, 0], len + 24);
    }
  }

  return { drawing: d, warnings };
}

/** Rail-extension wires are leads, not nodes: collapse them before naming or drawing anything. */
function normaliseNetlist(components: CircuitComponent[] | undefined): CircuitComponent[] {
  const list = Array.isArray(components) ? components.filter((c) => c && typeof c.from === 'string' && typeof c.to === 'string') : [];
  // Cast: the shared helper uses `type: string` for cross-module portability.
  return collapseRailWiresShared(list) as CircuitComponent[];
}

/** Feature names: wire-<from>-to-<to>, and for components <type>-<label-slug> or <type>-<index>. */
function nameFeatures(components: CircuitComponent[]): Map<CircuitComponent, { name: string; idx: number }> {
  const typeCounts: Record<string, number> = {};
  const names = new Map<CircuitComponent, { name: string; idx: number }>();
  for (const c of components) {
    if (c.type === 'wire') {
      names.set(c, { name: `wire-${featSlug(c.from)}-to-${featSlug(c.to)}`, idx: 0 });
    } else {
      typeCounts[c.type] = (typeCounts[c.type] ?? 0) + 1;
      const idx = typeCounts[c.type];
      names.set(c, { name: c.label ? `${c.type}-${featSlug(c.label)}` : `${c.type}-${idx}`, idx });
    }
  }
  return names;
}

/**
 * Pure manifest builder — enumerates the named features this renderer emits
 * for a given set of props. MUST stay in sync with the feat() calls below:
 * both go through normaliseNetlist + nameFeatures.
 */
export function buildCircuitManifest(props: CircuitRendererProps): FeatureManifestEntry[] {
  const entries: FeatureManifestEntry[] = [];
  const components = normaliseNetlist(props.components);
  const names = nameFeatures(components);

  // Per-type synonym banks the tutor is likely to speak aloud.
  const TYPE_SYNONYMS: Record<CircuitComponentType, string[]> = {
    resistor: ['resistor', 'R'],
    capacitor: ['capacitor', 'cap', 'C'],
    inductor: ['inductor', 'coil', 'L'],
    battery: ['battery', 'cell', 'voltage source', 'emf', 'EMF'],
    wire: ['wire', 'connection'],
    'switch-open': ['open switch', 'switch'],
    'switch-closed': ['closed switch', 'switch'],
    bulb: ['bulb', 'lamp', 'light bulb'],
    voltmeter: ['voltmeter', 'V meter', 'voltage meter'],
    ammeter: ['ammeter', 'A meter', 'current meter'],
    galvanometer: ['galvanometer', 'ammeter', 'current meter'],
    ground: ['ground', 'earth', 'GND'],
    gap: ['gap', 'break', 'cut'],
    object: [],
  };

  for (const c of components) {
    const { name, idx } = names.get(c)!;
    if (c.type === 'wire') {
      const fromId = c.from;
      const toId = c.to;
      const labels = new Set<string>([
        name,
        `wire ${fromId} to ${toId}`,
        `wire from ${fromId} to ${toId}`,
        `connection ${fromId}-${toId}`,
        `${fromId}-${toId} wire`,
      ]);
      entries.push({
        name,
        kind: 'edge',
        description: `wire connecting ${fromId} to ${toId}`,
        labels: Array.from(labels),
      });
    } else {
      const valuePart = c.value ? ` (${c.value}${c.unit ? ' ' + c.unit : ''})` : '';
      const labels = new Set<string>([name]);
      // Synonyms for the component type
      for (const syn of TYPE_SYNONYMS[c.type] ?? [c.type]) {
        labels.add(syn);
        labels.add(`${syn} ${idx}`);
        labels.add(`the ${syn}`);
      }
      // Positional alias (always present so "resistor 2" works regardless of label)
      labels.add(`${c.type}-${idx}`);
      // Label-based variants
      if (c.label) {
        labels.add(c.label);
        labels.add(`${c.type} ${c.label}`);
        labels.add(`${c.label} ${c.type}`);
        for (const syn of TYPE_SYNONYMS[c.type] ?? []) {
          labels.add(`${syn} ${c.label}`);
          labels.add(`${c.label} ${syn}`);
        }
      }
      // If a value is given (e.g. "10 Ω"), allow referring by it
      if (c.value) {
        const valText = `${c.value}${c.unit ? ' ' + c.unit : ''}`;
        labels.add(`${c.type} ${valText}`);
        labels.add(`${valText} ${c.type}`);
      }
      entries.push({
        name,
        kind: 'object',
        description: `${c.type}${c.label ? ` "${c.label}"` : ''}${valuePart}`,
        labels: Array.from(labels),
      });
    }
  }
  return entries;
}

const VIEW_PAD_X = 30;
const VIEW_PAD_Y = 26;
const MIN_VIEW_W = 480;
const MIN_VIEW_H = 290;

export default function CircuitRenderer({
  title,
  components,
  showNodes = true,
}: CircuitRendererProps) {
  // Positions always come from the auto-layout: any `nodes` array passed in
  // is ignored — the model cannot reliably choose valid 2D coordinates, and
  // a bad layout silently produces a nonsensical circuit.
  const netlist = normaliseNetlist(components);
  const names = nameFeatures(netlist);
  const { drawing, warnings } = autoLayoutCircuit(netlist);
  const empty = !Number.isFinite(drawing.minX);

  const contentW = empty ? 0 : drawing.maxX - drawing.minX;
  const contentH = empty ? 0 : drawing.maxY - drawing.minY;
  const viewW = Math.max(MIN_VIEW_W, contentW + 2 * VIEW_PAD_X);
  const bodyH = Math.max(MIN_VIEW_H, contentH + 2 * VIEW_PAD_Y);
  const warningRowHeight = 20;
  const viewH = bodyH + warnings.length * warningRowHeight;
  // Centre the drawing in the card.
  const ox = empty ? 0 : (viewW - contentW) / 2 - drawing.minX;
  const oy = empty ? 0 : (bodyH - contentH) / 2 - drawing.minY;
  const shift = (p: Pt): Pt => [p[0] + ox, p[1] + oy];

  // De-duplicate junction dots (a stub and a bus can mark the same point).
  const dotKeys = new Set<string>();
  const dots = drawing.dots.filter((p) => {
    const key = `${Math.round(p[0])},${Math.round(p[1])}`;
    if (dotKeys.has(key)) return false;
    dotKeys.add(key);
    return true;
  });

  return (
    <div className="circuit-renderer">
      {title && (
        <div className="text-center text-sm font-semibold text-gray-700 mb-2">
          <InlineMathText text={title} />
        </div>
      )}
      <svg
        viewBox={`0 0 ${viewW} ${viewH}`}
        className="w-full h-auto"
        // Centred under the title; small circuits are enlarged a little, never shrunk below 1:1 by this cap.
        style={{ display: 'block', margin: '0 auto', maxWidth: Math.max(640, viewW) }}
      >
        <rect width={viewW} height={viewH} fill="#fafbfc" rx={4} />

        {drawing.wires.map(([a, b], i) => {
          const [x1, y1] = shift(a);
          const [x2, y2] = shift(b);
          return <line key={`w-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={STROKE} strokeWidth={2} strokeLinecap="round" />;
        })}

        {drawing.parts.map((part, i) => (
          <ComponentShape
            key={`c-${i}`}
            comp={part.comp}
            from={shift(part.from)}
            to={shift(part.to)}
            side={part.side}
            featureName={names.get(part.comp)?.name}
            viewW={viewW}
            viewH={viewH}
          />
        ))}

        {showNodes &&
          dots.map((p, i) => {
            const [x, y] = shift(p);
            return <circle key={`n-${i}`} cx={x} cy={y} r={3.5} fill={STROKE} />;
          })}

        {warnings.map((w, i) => (
          <text
            key={`warn-${i}`}
            x={viewW / 2}
            y={bodyH + 4 + i * warningRowHeight}
            fontSize={12}
            fill="#b91c1c"
            fontWeight={600}
            textAnchor="middle"
          >
            {w}
          </text>
        ))}
      </svg>
    </div>
  );
}
