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
import { collapseRailWires as collapseRailWiresShared, extendSourceRung as extendSourceRungShared } from '@/lib/tutor/diagrams/circuit-graph';

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
  | 'ground';

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

const SVG_WIDTH = 600;
const SVG_HEIGHT = 400;
// Reserve pixel margin inside the SVG for component symbols + value/unit text
// that extend perpendicular to wire segments. Prevents clipping when nodes
// are placed near the edge.
const CIRCUIT_PADDING = 50;

/**
 * Build a content-to-SVG mapper that auto-fits the node bounding box inside
 * the viewBox (with safety padding). If all nodes cluster in a small region,
 * we zoom in so the circuit fills the canvas. Preserves aspect ratio.
 */
function buildCircuitMapper(nodes: CircuitNode[]): (x: number, y: number) => [number, number] {
  if (nodes.length === 0) {
    return (x, y) => [
      CIRCUIT_PADDING + (x / 100) * (SVG_WIDTH - 2 * CIRCUIT_PADDING),
      CIRCUIT_PADDING + (y / 100) * (SVG_HEIGHT - 2 * CIRCUIT_PADDING),
    ];
  }
  const xs = nodes.map((n) => n.x);
  const ys = nodes.map((n) => n.y);
  let minX = Math.min(...xs);
  let maxX = Math.max(...xs);
  let minY = Math.min(...ys);
  let maxY = Math.max(...ys);
  if (maxX - minX < 1) { minX -= 5; maxX += 5; }
  if (maxY - minY < 1) { minY -= 5; maxY += 5; }
  const rangeX = maxX - minX;
  const rangeY = maxY - minY;
  const innerW = SVG_WIDTH - 2 * CIRCUIT_PADDING;
  const innerH = SVG_HEIGHT - 2 * CIRCUIT_PADDING;
  const scale = Math.min(innerW / rangeX, innerH / rangeY);
  const offsetX = (SVG_WIDTH - scale * rangeX) / 2;
  const offsetY = (SVG_HEIGHT - scale * rangeY) / 2;
  return (x, y) => [offsetX + (x - minX) * scale, offsetY + (y - minY) * scale];
}

/**
 * Draw a schematic component between two SVG points. Components are drawn
 * centered on the midpoint with the symbol aligned to the segment axis,
 * and straight wire segments on either side.
 */
function ComponentShape({
  type,
  from,
  to,
  value,
  unit,
  label,
  featureName,
}: {
  type: CircuitComponentType;
  from: [number, number];
  to: [number, number];
  value?: string;
  unit?: string;
  label?: string;
  featureName?: string;
}) {
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

  const SYMBOL_HALF_LEN: Record<CircuitComponentType, number> = {
    resistor: 20,
    capacitor: 8,
    inductor: 20,
    battery: 8,
    wire: 0,
    'switch-open': 18,
    'switch-closed': 18,
    bulb: 14,
    voltmeter: 14,
    ammeter: 14,
    galvanometer: 14,
    ground: 0,
  };
  const half = SYMBOL_HALF_LEN[type] ?? 0;

  // Wire endpoints (the part of the wire that sits OUTSIDE the symbol)
  const w1x = mx - ux * half;
  const w1y = my - uy * half;
  const w2x = mx + ux * half;
  const w2y = my + uy * half;

  // Label position: perpendicular offset from midpoint
  const nx = -uy;
  const ny = ux;
  const labelOffset = 22;
  const labelX = mx + nx * labelOffset;
  const labelY = my + ny * labelOffset;

  const symbol = (() => {
    switch (type) {
      case 'resistor': {
        // Zigzag: 6 peaks over 40px
        const peaks = 6;
        const peakHeight = 6;
        const step = (half * 2) / peaks;
        let path = `M ${-half},0`;
        for (let i = 0; i < peaks; i++) {
          const x = -half + (i + 0.5) * step;
          const y = (i % 2 === 0 ? -1 : 1) * peakHeight;
          path += ` L ${x},${y}`;
        }
        path += ` L ${half},0`;
        return <path d={path} fill="none" stroke="#1f2937" strokeWidth={2} />;
      }
      case 'capacitor': {
        // Two parallel lines, gap of ~8px
        const gap = 5;
        const plateLen = 12;
        return (
          <>
            <line x1={-gap} y1={-plateLen} x2={-gap} y2={plateLen} stroke="#1f2937" strokeWidth={2.5} />
            <line x1={gap} y1={-plateLen} x2={gap} y2={plateLen} stroke="#1f2937" strokeWidth={2.5} />
          </>
        );
      }
      case 'inductor': {
        // 4 loops
        const loops = 4;
        const loopR = 5;
        const loopSpacing = (half * 2 - loopR * 2) / (loops - 1);
        const arcs: React.ReactElement[] = [];
        for (let i = 0; i < loops; i++) {
          const cx = -half + loopR + i * loopSpacing;
          arcs.push(
            <path
              key={i}
              d={`M ${cx - loopR},0 A ${loopR},${loopR} 0 0 1 ${cx + loopR},0`}
              fill="none"
              stroke="#1f2937"
              strokeWidth={2}
            />
          );
        }
        return <>{arcs}</>;
      }
      case 'battery': {
        // Long line (positive) + short line (negative)
        return (
          <>
            <line x1={-2} y1={-10} x2={-2} y2={10} stroke="#1f2937" strokeWidth={2.5} />
            <line x1={3} y1={-14} x2={3} y2={14} stroke="#1f2937" strokeWidth={2.5} />
            <text x={-2} y={-16} textAnchor="middle" fontSize={11} fill="#1f2937" fontWeight={600}>
              +
            </text>
            <text x={3} y={24} textAnchor="middle" fontSize={11} fill="#1f2937" fontWeight={600}>
              −
            </text>
          </>
        );
      }
      case 'switch-open':
        return (
          <>
            <line x1={-half} y1={0} x2={-5} y2={0} stroke="#1f2937" strokeWidth={2} />
            <line x1={-5} y1={0} x2={half - 2} y2={-12} stroke="#1f2937" strokeWidth={2} />
            <circle cx={-5} cy={0} r={2} fill="#1f2937" />
            <circle cx={half - 2} cy={0} r={2} fill="#1f2937" />
          </>
        );
      case 'switch-closed':
        return (
          <>
            <line x1={-half} y1={0} x2={half} y2={0} stroke="#1f2937" strokeWidth={2} />
            <circle cx={-5} cy={0} r={2} fill="#1f2937" />
            <circle cx={half - 2} cy={0} r={2} fill="#1f2937" />
          </>
        );
      case 'bulb':
        return (
          <>
            <circle cx={0} cy={0} r={12} fill="#fef3c7" stroke="#1f2937" strokeWidth={2} />
            <line x1={-8} y1={-8} x2={8} y2={8} stroke="#1f2937" strokeWidth={1.5} />
            <line x1={-8} y1={8} x2={8} y2={-8} stroke="#1f2937" strokeWidth={1.5} />
          </>
        );
      case 'voltmeter':
        // Counter-rotate the text so "V" always reads upright regardless
        // of wire direction (otherwise it flips when the wire runs right-to-left).
        return (
          <>
            <circle cx={0} cy={0} r={12} fill="#fff" stroke="#1f2937" strokeWidth={2} />
            <g transform={`rotate(${-angle})`}>
              <text x={0} y={4} textAnchor="middle" fontSize={13} fill="#1f2937" fontWeight={700}>
                V
              </text>
            </g>
          </>
        );
      case 'ammeter':
        return (
          <>
            <circle cx={0} cy={0} r={12} fill="#fff" stroke="#1f2937" strokeWidth={2} />
            <g transform={`rotate(${-angle})`}>
              <text x={0} y={4} textAnchor="middle" fontSize={13} fill="#1f2937" fontWeight={700}>
                A
              </text>
            </g>
          </>
        );
      case 'galvanometer':
        return (
          <>
            <circle cx={0} cy={0} r={12} fill="#fff" stroke="#1f2937" strokeWidth={2} />
            <g transform={`rotate(${-angle})`}>
              <text x={0} y={4} textAnchor="middle" fontSize={13} fill="#1f2937" fontWeight={700}>
                G
              </text>
            </g>
          </>
        );
      case 'ground':
        return (
          <>
            <line x1={0} y1={-10} x2={0} y2={0} stroke="#1f2937" strokeWidth={2} />
            <line x1={-10} y1={0} x2={10} y2={0} stroke="#1f2937" strokeWidth={2} />
            <line x1={-6} y1={4} x2={6} y2={4} stroke="#1f2937" strokeWidth={2} />
            <line x1={-3} y1={8} x2={3} y2={8} stroke="#1f2937" strokeWidth={2} />
          </>
        );
      case 'wire':
      default:
        return null;
    }
  })();

  const hasLabel = !!(label || value);
  // De-duplicate when the model passed the magnitude in `label` instead
  // of (or in addition to) `value`. Without this, "150Ω" + value:150 +
  // unit:Ω renders as the comically duplicated "150Ω = 150 Ω".
  const valueWithUnit = value ? `${value}${unit ? ' ' + unit : ''}` : '';
  const labelLooksLikeValue = (() => {
    if (!label) return false;
    if (!valueWithUnit) return false;
    const norm = (s: string) => s.replace(/\s+/g, '').toLowerCase();
    const nL = norm(label);
    const nV = norm(valueWithUnit);
    return nL === nV || nL === norm(value || '') || nL.includes(nV) || nV.includes(nL);
  })();
  const displayLabel = label && !labelLooksLikeValue
    ? valueWithUnit
      ? `${label} = ${valueWithUnit}`
      : label
    : valueWithUnit
    ? valueWithUnit
    : label || '';

  // Bounding box approximating the feature's extent in SVG pixel space.
  const featBbox = (() => {
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);
    const bw = Math.max(40, (maxX - minX) + 40);
    const bh = Math.max(40, (maxY - minY) + 40);
    return { cx: (x1 + x2) / 2, cy: (y1 + y2) / 2, w: bw, h: bh };
  })();
  const featureProps = featureName
    ? feat(featureName, featBbox, { width: SVG_WIDTH, height: SVG_HEIGHT })
    : {};

  return (
    <g {...featureProps}>
      {/* Wires on both sides of the symbol */}
      {half > 0 && (
        <>
          <line x1={x1} y1={y1} x2={w1x} y2={w1y} stroke="#1f2937" strokeWidth={2} />
          <line x1={w2x} y1={w2y} x2={x2} y2={y2} stroke="#1f2937" strokeWidth={2} />
        </>
      )}
      {half === 0 && (
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1f2937" strokeWidth={2} />
      )}
      {/* Symbol, rotated and centered on midpoint */}
      {symbol && (
        <g transform={`translate(${mx}, ${my}) rotate(${angle})`}>{symbol}</g>
      )}
      {hasLabel && (
        <g>
          {/* White mask behind label text so crossing wires don't cut through it */}
          <rect
            x={labelX - (displayLabel.length * 6.5) / 2 - 3}
            y={labelY - 11}
            width={displayLabel.length * 6.5 + 6}
            height={16}
            fill="#fafbfc"
          />
          <text
            x={labelX}
            y={labelY}
            textAnchor="middle"
            fontSize={12}
            fill="#1f2937"
            fontWeight={500}
          >
            {displayLabel}
          </text>
        </g>
      )}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Auto-layout: netlist → coordinates                                  */
/*                                                                     */
/* The model supplies only a list of components with `from`/`to` node  */
/* ids. This function decides where each node sits on the canvas,      */
/* adding synthetic rail-wires so every component ends up in a valid   */
/* closed loop (or, if the netlist doesn't close, produces warnings). */
/*                                                                     */
/* Layout strategy — "generalized ladder":                             */
/*   1. Find the battery (or chain of series batteries). Treat its     */
/*      two terminals as the two rails A (left) and B (right).         */
/*   2. Decompose the remaining (non-battery) components into a set of */
/*      simple paths from A to B. Each path becomes one horizontal     */
/*      "rung". Shared intermediate nodes are unique per-rung (the     */
/*      netlist is assumed to be 2-terminal between A and B).          */
/*   3. Stack the rungs vertically, connect their ends with vertical   */
/*      rail wires, and place components evenly along each rung.       */
/*                                                                     */
/* Handles: simple series loops, pure parallel (ladder), series-       */
/* batteries + parallel loads, single-branch circuits with a series    */
/* chain on the return path (e.g. RC charging loop).                   */
/* ------------------------------------------------------------------ */

interface LayoutResult {
  nodes: CircuitNode[];
  components: CircuitComponent[];
  warnings: string[];
}

const LAYOUT_LEFT = 18;
const LAYOUT_RIGHT = 82;
const LAYOUT_TOP = 22;
const LAYOUT_BOTTOM = 78;

/** Chain batteries that connect head-to-tail into a single series path. */
function chainBatteries(batteries: CircuitComponent[]): {
  chain: CircuitComponent[];
  start: string;
  end: string;
} | null {
  if (batteries.length === 0) return null;
  if (batteries.length === 1) {
    return { chain: [batteries[0]], start: batteries[0].from, end: batteries[0].to };
  }
  // Degree = number of battery-ends touching a node; endpoints have degree 1.
  const degree = new Map<string, number>();
  for (const b of batteries) {
    degree.set(b.from, (degree.get(b.from) ?? 0) + 1);
    degree.set(b.to, (degree.get(b.to) ?? 0) + 1);
  }
  const endpoints = [...degree.entries()].filter(([, d]) => d === 1).map(([n]) => n);
  // Not a simple chain (has branching or loop) — can't cleanly treat as series source
  if (endpoints.length !== 2) return null;
  const [start] = endpoints;
  const chain: CircuitComponent[] = [];
  const used = new Set<CircuitComponent>();
  let current = start;
  while (used.size < batteries.length) {
    const next = batteries.find(
      (b) => !used.has(b) && (b.from === current || b.to === current),
    );
    if (!next) break;
    chain.push(next);
    current = next.from === current ? next.to : next.from;
    used.add(next);
  }
  if (chain.length !== batteries.length) return null;
  return { chain, start, end: current };
}

/**
 * Find a single simple path from `start` to `end` in the given component
 * graph. Paths don't revisit intermediate nodes or re-use components.
 * Returns null if no such path exists.
 */
function findSimplePath(
  components: CircuitComponent[],
  start: string,
  end: string,
): CircuitComponent[] | null {
  if (start === end) return null;
  const adj = new Map<string, Array<{ to: string; comp: CircuitComponent }>>();
  for (const c of components) {
    if (!adj.has(c.from)) adj.set(c.from, []);
    if (!adj.has(c.to)) adj.set(c.to, []);
    adj.get(c.from)!.push({ to: c.to, comp: c });
    adj.get(c.to)!.push({ to: c.from, comp: c });
  }
  const visitedNodes = new Set<string>();
  const visitedEdges = new Set<CircuitComponent>();

  function dfs(node: string): CircuitComponent[] | null {
    if (node === end) return [];
    visitedNodes.add(node);
    for (const { to, comp } of adj.get(node) || []) {
      if (visitedEdges.has(comp)) continue;
      if (visitedNodes.has(to) && to !== end) continue;
      visitedEdges.add(comp);
      const rest = dfs(to);
      if (rest !== null) return [comp, ...rest];
      visitedEdges.delete(comp);
    }
    visitedNodes.delete(node);
    return null;
  }

  return dfs(start);
}

/**
 * Given a rung's starting logical node A and its ordered components, walk
 * the components and return the sequence of logical nodes visited.
 * Returns [A, n1, n2, ..., B] with length = components.length + 1.
 */
function traceRungNodes(rung: CircuitComponent[], startNode: string): string[] {
  const sequence = [startNode];
  let current = startNode;
  for (const c of rung) {
    const next = c.from === current ? c.to : c.from;
    sequence.push(next);
    current = next;
  }
  return sequence;
}

function autoLayoutCircuit(rawComponents: CircuitComponent[]): LayoutResult {
  const warnings: string[] = [];
  if (rawComponents.length === 0) {
    return { nodes: [], components: [], warnings };
  }

  // Preprocess: collapse rail-extension wires. Sonnet's preferred
  // parallel-circuit style emits short lead wires connecting battery
  // terminals to "rail" nodes (top, bot) with parallel components
  // hung between the rails. Without collapsing, the path decomposition
  // below consumes those rail wires on the first parallel branch and
  // orphans subsequent branches. After collapse, the rail nodes ARE
  // the battery terminals and parallel branches lay out cleanly.
  // Cast: the shared helper uses `type: string` for cross-module
  // portability; the renderer's local type narrows to a union.
  const components = collapseRailWiresShared(rawComponents) as CircuitComponent[];

  const batteries = components.filter((c) => c.type === 'battery');

  let sourceRung: CircuitComponent[] = [];
  let A = '';
  let B = '';

  if (batteries.length > 0) {
    // extendSourceRung: collapseRailWires + chainBatteries + walk through
    // single-path "trunk" non-batteries (e.g. a switch in series with a
    // parallel block). The result is the FULL source-rung topology so
    // the path decomposition below only sees the parallel branches.
    const extended = extendSourceRungShared(components, batteries) as
      | { sourceRung: CircuitComponent[]; A: string; B: string }
      | null;
    if (extended) {
      sourceRung = extended.sourceRung as CircuitComponent[];
      A = extended.A;
      B = extended.B;
    } else {
      // Batteries don't form a clean chain — use the first one as source, rest
      // will be laid out as normal components on their own rungs.
      sourceRung = [batteries[0]];
      A = batteries[0].from;
      B = batteries[0].to;
      warnings.push('Multiple batteries not in series — treating first as source');
    }
  } else {
    // No battery found. Pick two high-degree nodes as the rails.
    const degree = new Map<string, number>();
    for (const c of components) {
      degree.set(c.from, (degree.get(c.from) ?? 0) + 1);
      degree.set(c.to, (degree.get(c.to) ?? 0) + 1);
    }
    const [byDeg] = [...degree.entries()].sort((a, b) => b[1] - a[1]);
    A = byDeg?.[0] ?? components[0].from;
    B = components[0].to === A ? components[0].from : components[0].to;
    warnings.push('No battery/source — laying out around arbitrary rails');
  }

  // Decompose components into simple paths from A to B. Anything in the
  // source rung (batteries + extended trunk components like in-series
  // switches) is excluded — it's already on the source row.
  const sourceSet = new Set(sourceRung);
  const returnPaths: CircuitComponent[][] = [];
  const remaining = new Set(components.filter((c) => !sourceSet.has(c)));

  while (remaining.size > 0) {
    const path = findSimplePath([...remaining], A, B);
    if (!path || path.length === 0) break;
    for (const c of path) remaining.delete(c);
    returnPaths.push(path);
  }

  if (returnPaths.length === 0 && sourceRung.length > 0) {
    warnings.push('⚠ Circuit has no return path — not a closed loop (open circuit)');
  }

  // Build the main rungs (return paths + source, in that stacking order).
  const mainRungs: CircuitComponent[][] = [...returnPaths];
  if (sourceRung.length > 0) mainRungs.push(sourceRung);

  // Compute each main rung's node sequence so we can spot cross-rung bridges.
  // Every main rung is a path from A to B, so it starts at A.
  const mainSequences = mainRungs.map((rung) => traceRungNodes(rung, A));
  const logicalPositions = new Map<string, Array<{ rungIdx: number; posIdx: number }>>();
  for (let i = 0; i < mainSequences.length; i++) {
    for (let j = 0; j < mainSequences[i].length; j++) {
      const n = mainSequences[i][j];
      if (!logicalPositions.has(n)) logicalPositions.set(n, []);
      logicalPositions.get(n)!.push({ rungIdx: i, posIdx: j });
    }
  }

  // Classify each leftover component: either a cross-rung bridge (both endpoints
  // live as intermediate nodes on existing rungs, on DIFFERENT rungs) or truly
  // dangling (not reachable via the main circuit).
  interface BridgeComp {
    component: CircuitComponent;
    fromRung: number;
    fromPos: number;
    toRung: number;
    toPos: number;
  }
  const bridges: BridgeComp[] = [];
  const trulyDangling: CircuitComponent[] = [];
  for (const c of remaining) {
    const fromPositions = logicalPositions.get(c.from);
    const toPositions = logicalPositions.get(c.to);
    let placed = false;
    if (fromPositions && toPositions) {
      for (const fp of fromPositions) {
        for (const tp of toPositions) {
          if (fp.rungIdx !== tp.rungIdx) {
            bridges.push({
              component: c,
              fromRung: fp.rungIdx,
              fromPos: fp.posIdx,
              toRung: tp.rungIdx,
              toPos: tp.posIdx,
            });
            placed = true;
            break;
          }
        }
        if (placed) break;
      }
    }
    if (!placed) trulyDangling.push(c);
  }

  if (trulyDangling.length > 0) {
    const labels = trulyDangling.map((c) => c.label || c.type).join(', ');
    warnings.push(`⚠ Disconnected from main circuit: ${labels}`);
  }

  // Total rungs = main + dangling. Pre-count so y positions are correct.
  const rungs: CircuitComponent[][] = [...mainRungs];
  const danglingStart = rungs.length;
  for (const c of trulyDangling) rungs.push([c]);

  // Lay out rungs as horizontal bars stacked vertically.
  const N = rungs.length;
  const outNodes: CircuitNode[] = [];
  const outComponents: CircuitComponent[] = [];
  const leftRailIds: string[] = [];
  const rightRailIds: string[] = [];
  // Virtual ids per rung + position — used later to attach cross-rung bridges.
  const virtualIdGrid: string[][] = [];

  const yForRung = (i: number): number => {
    if (N === 1) return (LAYOUT_TOP + LAYOUT_BOTTOM) / 2;
    return LAYOUT_TOP + (i / (N - 1)) * (LAYOUT_BOTTOM - LAYOUT_TOP);
  };

  for (let i = 0; i < N; i++) {
    const rung = rungs[i];
    const y = yForRung(i);
    const isDangling = i >= danglingStart;
    const rungStart = isDangling ? rung[0].from : A;
    const sequence = traceRungNodes(rung, rungStart);
    const numNodes = sequence.length;
    const xs: number[] = [];
    for (let j = 0; j < numNodes; j++) {
      xs.push(
        numNodes === 1
          ? LAYOUT_LEFT
          : LAYOUT_LEFT + (j / (numNodes - 1)) * (LAYOUT_RIGHT - LAYOUT_LEFT),
      );
    }
    const virtualIds = sequence.map(
      (base, j) => `__layout__${base}__r${i}_${j}`,
    );
    virtualIdGrid.push(virtualIds);
    for (let j = 0; j < numNodes; j++) {
      outNodes.push({ id: virtualIds[j], x: xs[j], y });
    }
    if (!isDangling) {
      leftRailIds.push(virtualIds[0]);
      rightRailIds.push(virtualIds[numNodes - 1]);
    }
    // Add components, preserving each component's original from/to orientation.
    for (let j = 0; j < rung.length; j++) {
      const c = rung[j];
      const origFrom = sequence[j];
      const fromId = c.from === origFrom ? virtualIds[j] : virtualIds[j + 1];
      const toId = c.from === origFrom ? virtualIds[j + 1] : virtualIds[j];
      outComponents.push({ ...c, from: fromId, to: toId });
    }
  }

  // Cross-rung bridges: attach each bridge component between the correct
  // virtual ids on its two endpoint rungs. The renderer will draw it as a
  // straight line (often vertical) from one intermediate node to another.
  for (const b of bridges) {
    const fromId = virtualIdGrid[b.fromRung][b.fromPos];
    const toId = virtualIdGrid[b.toRung][b.toPos];
    // Preserve original orientation.
    const c = b.component;
    const origFromIsBridgeFrom = c.from === mainSequences[b.fromRung][b.fromPos];
    outComponents.push({
      ...c,
      from: origFromIsBridgeFrom ? fromId : toId,
      to: origFromIsBridgeFrom ? toId : fromId,
    });
  }

  // Rail wires: connect left rail ids in order, right rail ids in order.
  for (let i = 0; i < leftRailIds.length - 1; i++) {
    outComponents.push({
      type: 'wire',
      from: leftRailIds[i],
      to: leftRailIds[i + 1],
    });
  }
  for (let i = 0; i < rightRailIds.length - 1; i++) {
    outComponents.push({
      type: 'wire',
      from: rightRailIds[i],
      to: rightRailIds[i + 1],
    });
  }

  return { nodes: outNodes, components: outComponents, warnings };
}

/**
 * Pure manifest builder — enumerates the named features this renderer emits
 * for a given set of props. MUST stay in sync with the feat() calls below.
 * We invoke the same autoLayoutCircuit pass so the synthesized rail-wire
 * feature names (wire-<from>-to-<to>) match what the renderer produces, and
 * we reproduce the component naming rule exactly (`<type>-<label-slug>` or
 * `<type>-<typeCount>`).
 */
export function buildCircuitManifest(props: CircuitRendererProps): FeatureManifestEntry[] {
  const entries: FeatureManifestEntry[] = [];
  const { components: laidOutComponents } = autoLayoutCircuit(props.components ?? []);
  const typeCounts: Record<string, number> = {};

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
  };

  for (const c of laidOutComponents) {
    if (c.type === 'wire') {
      const stripLayout = (id: string) => id.replace(/^__layout__/, '').replace(/__r\d+_\d+$/, '');
      const fromId = stripLayout(c.from);
      const toId = stripLayout(c.to);
      const name = `wire-${featSlug(fromId)}-to-${featSlug(toId)}`;
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
      typeCounts[c.type] = (typeCounts[c.type] ?? 0) + 1;
      const idx = typeCounts[c.type];
      const name = c.label
        ? `${c.type}-${featSlug(c.label)}`
        : `${c.type}-${idx}`;
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

export default function CircuitRenderer({
  title,
  components,
  showNodes = true,
}: CircuitRendererProps) {
  // Node positions are always computed by the auto-layout algorithm from
  // the netlist alone. Any `nodes` array passed in is ignored — the model
  // has repeatedly shown that it can't reliably choose valid 2D coordinates,
  // and a bad layout silently produces a nonsensical circuit.
  const { nodes: laidOutNodes, components: laidOutComponents, warnings } =
    autoLayoutCircuit(components);
  const toSvg = buildCircuitMapper(laidOutNodes);
  const nodeMap = new Map(laidOutNodes.map((n) => [n.id, toSvg(n.x, n.y)]));

  const warningRowHeight = 18;
  const extraHeight = warnings.length * warningRowHeight;

  return (
    <div className="circuit-renderer">
      {title && (
        <div className="text-center text-sm font-semibold text-gray-700 mb-2">
          <InlineMathText text={title} />
        </div>
      )}
      <svg
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT + extraHeight}`}
        className="w-full h-auto"
        style={{ maxWidth: SVG_WIDTH, maxHeight: SVG_HEIGHT + extraHeight }}
      >
        <rect width={SVG_WIDTH} height={SVG_HEIGHT + extraHeight} fill="#fafbfc" rx={4} />

        {(() => {
          // Assign predictable feature names: wire-<from>-to-<to>, and for
          // components either <type>-<label-slug> or <type>-<index>.
          const typeCounts: Record<string, number> = {};
          return laidOutComponents.map((c, i) => {
            const from = nodeMap.get(c.from);
            const to = nodeMap.get(c.to);
            if (!from || !to) return null;
            let featureName: string;
            if (c.type === 'wire') {
              // Strip our synthetic __layout__ prefix when constructing
              // tutor-facing wire names.
              const stripLayout = (id: string) => id.replace(/^__layout__/, '').replace(/__r\d+_\d+$/, '');
              featureName = `wire-${featSlug(stripLayout(c.from))}-to-${featSlug(stripLayout(c.to))}`;
            } else {
              typeCounts[c.type] = (typeCounts[c.type] ?? 0) + 1;
              featureName = c.label
                ? `${c.type}-${featSlug(c.label)}`
                : `${c.type}-${typeCounts[c.type]}`;
            }
            return (
              <ComponentShape
                key={`c-${i}`}
                type={c.type}
                from={from}
                to={to}
                value={c.value}
                unit={c.unit}
                label={c.label}
                featureName={featureName}
              />
            );
          });
        })()}

        {showNodes &&
          laidOutNodes
            // Skip showing dots on the synthetic rail junctions — they're
            // numerous and visually noisy. Only dot the endpoints of each
            // rung (left- and right-most x positions).
            .filter((n) => {
              const [nx] = nodeMap.get(n.id)!;
              return nx <= toSvg(LAYOUT_LEFT, 0)[0] + 1 || nx >= toSvg(LAYOUT_RIGHT, 0)[0] - 1;
            })
            .map((n) => {
              const [nx, ny] = nodeMap.get(n.id)!;
              return (
                <circle key={`n-${n.id}`} cx={nx} cy={ny} r={3} fill="#1f2937" />
              );
            })}

        {warnings.map((w, i) => (
          <text
            key={`warn-${i}`}
            x={SVG_WIDTH / 2}
            y={SVG_HEIGHT + 8 + i * warningRowHeight}
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
