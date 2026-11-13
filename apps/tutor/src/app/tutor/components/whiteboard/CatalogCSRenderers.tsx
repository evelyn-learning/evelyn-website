'use client';

import { InlineMathText } from './InlineMathText';
import React from 'react';
import {
  flowchartSimpleFeatureNames,
  stateMachineFeatureNames,
  binaryTreeFeatureNames,
  truthTableFeatureNames,
  logicGateFeatureNames,
  type FlowchartFigure,
  type FlowchartNode,
  type FlowchartEdge,
  type StateMachineFigure,
  type BinaryTreeFigure,
  type BinaryTreeNode,
  type TruthTableFigure,
  type LogicGateFigure,
} from '@/lib/tutor/diagrams/catalog/kinds/cs';
import { layoutFlowchart } from './flowchart-layout';

// ── shared text helpers ───────────────────────────────────────────────────
/** Word wrap by character count (labels are short; no hyphenation). The lines are then
 *  evened out, so a label never ends in a one-word orphan line. */
function wrapWords(text: string, maxChars: number): string[] {
  const first = wrapGreedy(text, maxChars);
  if (first.length < 2) return first;
  let best = first;
  for (let m = maxChars - 1; m >= Math.ceil(text.length / first.length); m--) {
    const next = wrapGreedy(text, m);
    if (next.length !== first.length || Math.max(...next.map((l) => l.length)) > maxChars) break;
    best = next;
  }
  return best;
}
function wrapGreedy(text: string, maxChars: number): string[] {
  const words = (text || '').trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    if (!cur) cur = w;
    else if ((cur + ' ' + w).length <= maxChars) cur += ' ' + w;
    else { lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur);
  return lines.length ? lines : [''];
}
/** White halo behind a label so a line passing under it never strikes it through. */
const HALO = { paintOrder: 'stroke' as const, stroke: '#ffffff', strokeWidth: 4, strokeLinejoin: 'round' as const };
/** An orthogonal polyline with rounded corners. */
function roundedPath(pts: Array<[number, number]>, r = 7): string {
  const p = pts.filter((q, i) => i === 0 || Math.hypot(q[0] - pts[i - 1][0], q[1] - pts[i - 1][1]) > 0.01);
  if (p.length < 2) return '';
  let d = `M ${p[0][0]} ${p[0][1]}`;
  for (let i = 1; i < p.length - 1; i++) {
    const [x0, y0] = p[i - 1]; const [x1, y1] = p[i]; const [x2, y2] = p[i + 1];
    const l1 = Math.hypot(x1 - x0, y1 - y0); const l2 = Math.hypot(x2 - x1, y2 - y1);
    const rr = Math.min(r, l1 / 2, l2 / 2);
    const ax = x1 - ((x1 - x0) / l1) * rr; const ay = y1 - ((y1 - y0) / l1) * rr;
    const bx = x1 + ((x2 - x1) / l2) * rr; const by = y1 + ((y2 - y1) / l2) * rr;
    d += ` L ${ax} ${ay} Q ${x1} ${y1} ${bx} ${by}`;
  }
  const last = p[p.length - 1];
  return d + ` L ${last[0]} ${last[1]}`;
}

// ── Flowchart ─────────────────────────────────────────────────────────────
const FC_FONT = 13;
const FC_LINE_H = 17;
const FC_CHAR_W = 7.3;
const FC_LABEL_CHAR_W = 6.5;
interface FcGeom { lines: string[]; w: number; h: number }
/** A node is sized to its (wrapped) text: long text wraps instead of shrinking. */
function fcGeom(n: FlowchartNode): FcGeom {
  const decision = n.type === 'decision';
  const lines = wrapWords(n.text, decision ? 22 : 30);
  const textW = Math.max(...lines.map((l) => l.length)) * FC_CHAR_W;
  const textH = lines.length * FC_LINE_H;
  if (decision) {
    // The text block must fit inside the diamond: at half the text height the diamond is
    // (1 − textH/h) of its full width.
    const h = textH + 36;
    return { lines, h, w: Math.max(120, Math.round((textW * h) / (h - textH)) + 20) };
  }
  return { lines, w: Math.max(110, Math.round(textW) + 34), h: Math.max(44, textH + 24) };
}

export function CatalogFlowchartSimpleRenderer({ figure }: { figure: FlowchartFigure }) {
  const { nodes, edges, title } = figure;
  const N = flowchartSimpleFeatureNames;
  const ROW_GAP = 46;
  const GAP = 30;
  const NOMINAL_ROW = 100;
  const geom = new Map(nodes.map((n) => [n.id, fcGeom(n)]));
  const typeOf = new Map(nodes.map((n) => [n.id, n.type]));
  const widths = new Map(nodes.map((n) => [n.id, geom.get(n.id)!.w]));
  // Ranks and x positions come from the layered layout; y is recomputed here so a row
  // is as tall as its tallest node.
  const base = layoutFlowchart(nodes, edges, widths, NOMINAL_ROW, GAP);
  const depthOf = new Map<string, number>();
  for (const n of nodes) depthOf.set(n.id, Math.round((base.positions.get(n.id)!.y - 60) / NOMINAL_ROW));
  const maxDepth = base.maxDepth;
  const rowH: number[] = Array.from({ length: maxDepth + 1 }, () => 44);
  for (const n of nodes) { const d = depthOf.get(n.id)!; rowH[d] = Math.max(rowH[d], geom.get(n.id)!.h); }
  const rowCy: number[] = [];
  let run = 16;
  for (let d = 0; d <= maxDepth; d++) { rowCy[d] = run + rowH[d] / 2; run += rowH[d] + ROW_GAP; }
  const contentBottom = run - ROW_GAP;
  const pos = new Map<string, { x: number; y: number }>();
  for (const n of nodes) pos.set(n.id, { x: base.positions.get(n.id)!.x, y: rowCy[depthOf.get(n.id)!] });
  const rowTop = (d: number) => rowCy[d] - rowH[d] / 2;
  const rowBottom = (d: number) => rowCy[d] + rowH[d] / 2;

  /** y of a node's outline directly above/below a point dx away from its centre. */
  const edgeY = (id: string, dx: number, dir: 1 | -1) => {
    const g = geom.get(id)!; const p = pos.get(id)!;
    if (typeOf.get(id) === 'decision') return p.y + dir * (g.h / 2) * Math.max(0, 1 - Math.abs(dx) / (g.w / 2));
    return p.y + dir * (g.h / 2);
  };

  type Routed = {
    e: FlowchartEdge; d: string; lx: number; ly: number; anchor: 'start' | 'end' | 'middle';
  };
  const routed: Routed[] = [];

  // Edges that cannot be drawn as one straight segment between neighbouring rows (loops
  // back, jumps over a row) travel in a lane of their own outside the chart, so they
  // never cut through a box and never merge with an edge going somewhere else.
  type LaneEdge = { e: FlowchartEdge; side: 1 | -1; exitBlocked: boolean; entryBlocked: boolean; span: number };
  const laneEdges: LaneEdge[] = [];
  const blocked = (id: string, side: 1 | -1) => {
    const p = pos.get(id)!; const d = depthOf.get(id)!;
    return nodes.some((o) => o.id !== id && depthOf.get(o.id) === d && (pos.get(o.id)!.x - p.x) * side > 0);
  };
  for (const e of edges) {
    const da = depthOf.get(e.from)!; const db = depthOf.get(e.to)!;
    const a = pos.get(e.from)!; const b = pos.get(e.to)!;
    if (e.from === e.to) continue;
    if (db === da + 1) continue;
    const cost = (side: 1 | -1) => (blocked(e.from, side) ? 1 : 0) + (blocked(e.to, side) ? 1 : 0);
    const cr = cost(1); const cl = cost(-1);
    let side: 1 | -1;
    if (cr !== cl) side = cr < cl ? 1 : -1;
    else if (db <= da) side = 1;
    else side = b.x < a.x ? -1 : 1;
    laneEdges.push({ e, side, exitBlocked: blocked(e.from, side), entryBlocked: blocked(e.to, side), span: Math.abs(db - da) });
  }
  // One lane per (side, target): edges into the same box on the same side join; others stay apart.
  const laneKeys: Array<{ key: string; side: 1 | -1; span: number }> = [];
  for (const le of laneEdges) {
    const key = `${le.side}:${le.e.to}`;
    const found = laneKeys.find((k) => k.key === key);
    if (found) found.span = Math.max(found.span, le.span);
    else laneKeys.push({ key, side: le.side, span: le.span });
  }
  laneKeys.sort((p, q) => p.span - q.span);
  const laneIndex = new Map<string, number>();
  const count: Record<string, number> = { '1': 0, '-1': 0 };
  for (const k of laneKeys) { laneIndex.set(k.key, count[String(k.side)]); count[String(k.side)] += 1; }
  // A label on an edge that leaves straight for its lane is written along that first stretch:
  // the lanes start far enough out for it to fit before the first lane line.
  const LANE_STEP = 18;
  const laneFirst = (side: 1 | -1) => {
    let first = 26;
    for (const le of laneEdges) {
      if (le.side !== side || le.exitBlocked || !le.e.label) continue;
      const a = pos.get(le.e.from)!; const ga = geom.get(le.e.from)!;
      const edgeX = a.x + side * (ga.w / 2);
      const gapToBound = side === 1 ? base.maxX - edgeX : edgeX - base.minX;
      first = Math.max(first, Math.min(130, le.e.label.length * FC_LABEL_CHAR_W + 18 - gapToBound));
    }
    return first;
  };
  const LANE_FIRST = { '1': laneFirst(1), '-1': laneFirst(-1) };
  const laneX = (side: 1 | -1, idx: number) =>
    side === 1 ? base.maxX + LANE_FIRST['1'] + idx * LANE_STEP : base.minX - LANE_FIRST['-1'] - idx * LANE_STEP;

  for (const e of edges) {
    const a = pos.get(e.from)!; const b = pos.get(e.to)!;
    const ga = geom.get(e.from)!; const gb = geom.get(e.to)!;
    const da = depthOf.get(e.from)!; const db = depthOf.get(e.to)!;
    if (e.from === e.to) {
      const x = a.x + ga.w / 2 - (typeOf.get(e.from) === 'decision' ? ga.w / 4 : 0);
      const off = typeOf.get(e.from) === 'decision' ? ga.h / 4 : 9;
      routed.push({ e, d: `M ${x} ${a.y - off} C ${x + 40} ${a.y - 34} ${x + 40} ${a.y + 34} ${x + 1} ${a.y + off}`, lx: x + 36, ly: a.y + 4, anchor: 'start' });
      continue;
    }
    if (db === da + 1) {
      const x1 = a.x; const y1 = edgeY(e.from, 0, 1);
      const x2 = b.x; const y2 = edgeY(e.to, 0, -1) - 1;
      const t = 0.4;
      const leftward = x2 < x1 - 1;
      const slanted = Math.abs(x2 - x1) > 1;
      routed.push({
        e, d: `M ${x1} ${y1} L ${x2} ${y2}`,
        lx: x1 + (x2 - x1) * t + (leftward ? -9 : 9) + (slanted ? (leftward ? -2 : 2) : 0),
        ly: y1 + (y2 - y1) * t + 4 - (slanted ? 5 : 0),
        anchor: leftward ? 'end' : 'start',
      });
      continue;
    }
    const le = laneEdges.find((l) => l.e === e)!;
    const s = le.side;
    const idx = laneIndex.get(`${s}:${e.to}`)!;
    const lx = laneX(s, idx);
    const pts: Array<[number, number]> = [];
    let labelX: number; let labelY: number; let anchor: 'start' | 'end';
    if (!le.exitBlocked) {
      const sx = typeOf.get(e.from) === 'decision' ? a.x + s * (ga.w / 2) : a.x + s * (ga.w / 2);
      pts.push([sx, a.y], [lx, a.y]);
      labelX = sx + s * 8; labelY = a.y - 7; anchor = s === 1 ? 'start' : 'end';
    } else {
      const dx = s * Math.min(ga.w / 4, 40);
      const y0 = edgeY(e.from, dx, 1);
      const yGap = rowBottom(da) + 12 + (idx % 3) * 6;
      pts.push([a.x + dx, y0], [a.x + dx, yGap], [lx, yGap]);
      labelX = a.x + dx - s * 7; labelY = Math.min(y0 + 14, yGap - 1); anchor = s === 1 ? 'end' : 'start';
    }
    if (!le.entryBlocked) {
      pts.push([lx, b.y], [b.x + s * (gb.w / 2) + s * 1, b.y]);
    } else {
      const dx = s * Math.min(gb.w / 4, 40);
      const yGap = rowTop(db) - 12 - (idx % 3) * 6;
      pts.push([lx, yGap], [b.x + dx, yGap], [b.x + dx, edgeY(e.to, dx, -1) - 1]);
    }
    routed.push({ e, d: roundedPath(pts), lx: labelX, ly: labelY, anchor });
  }

  // The drawing's extent: boxes, lanes and labels.
  let minX = base.minX; let maxX = base.maxX;
  if (count['1'] > 0) maxX = Math.max(maxX, laneX(1, count['1'] - 1));
  if (count['-1'] > 0) minX = Math.min(minX, laneX(-1, count['-1'] - 1));
  for (const r of routed) {
    if (!r.e.label) continue;
    const w = r.e.label.length * FC_LABEL_CHAR_W;
    const l = r.anchor === 'start' ? r.lx : r.anchor === 'end' ? r.lx - w : r.lx - w / 2;
    minX = Math.min(minX, l); maxX = Math.max(maxX, l + w);
    if (r.e.from === r.e.to) maxX = Math.max(maxX, r.lx + w);
  }
  const PAD = 14;
  const vbX = minX - PAD;
  const W = maxX - minX + PAD * 2;
  const hasBottomExit = laneEdges.some((l) => l.exitBlocked && depthOf.get(l.e.from) === maxDepth);
  const H = contentBottom + (hasBottomExit ? 40 : 14);
  const fx = (x: number) => (x - vbX) / W;

  return (
    <div
      className="flowchart-renderer w-full flex flex-col items-center"
      data-feature={N.chart}
      data-feature-label={title || 'flowchart'}
    >
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      <svg viewBox={`${vbX} 0 ${W} ${H}`} className="w-full" style={{ maxWidth: Math.min(720, Math.round(W)) }}>
        <defs>
          <marker id="fc-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#374151" />
          </marker>
        </defs>
        {routed.map((r, i) => {
          const e = r.e;
          const a = pos.get(e.from)!; const b = pos.get(e.to)!;
          return (
            <g
              key={i}
              data-feature={N.edge(e.from, e.to)}
              data-feature-label={r.e.label || `${r.e.from} → ${r.e.to}`}
              data-feature-cx={fx(r.e.label ? r.lx : (a.x + b.x) / 2)}
              data-feature-cy={(r.e.label ? r.ly : (a.y + b.y) / 2) / H}
              data-feature-w={80 / W}
              data-feature-h={Math.max(24, Math.abs(b.y - a.y) * 0.4) / H}
            >
              <path d={r.d} fill="none" stroke="#374151" strokeWidth={1.5} markerEnd="url(#fc-arr)" />
            </g>
          );
        })}
        {nodes.map((n) => {
          const p = pos.get(n.id)!; const g = geom.get(n.id)!;
          return (
            <NodeBox
              key={n.id}
              node={n}
              pos={p}
              geom={g}
              dataFeature={N.node(n.id)}
              cxFrac={fx(p.x)}
              cyFrac={p.y / H}
              wFrac={(g.w + 8) / W}
              hFrac={(g.h + 8) / H}
            />
          );
        })}
        {routed.map((r, i) => r.e.label ? (
          <text key={`l-${i}`} x={r.lx} y={r.ly} fontSize={11.5} textAnchor={r.anchor} fill="#b91c1c" fontWeight={600} style={HALO}>{r.e.label}</text>
        ) : null)}
      </svg>
    </div>
  );
}

function NodeBox({
  node, pos, geom, dataFeature, cxFrac, cyFrac, wFrac, hFrac,
}: {
  node: FlowchartNode;
  pos: { x: number; y: number };
  geom: FcGeom;
  dataFeature: string;
  cxFrac: number;
  cyFrac: number;
  wFrac: number;
  hFrac: number;
}) {
  const { x, y } = pos;
  const { w, h, lines } = geom;
  const dataAttrs = {
    'data-feature': dataFeature,
    'data-feature-label': node.text,
    'data-feature-cx': cxFrac,
    'data-feature-cy': cyFrac,
    'data-feature-w': wFrac,
    'data-feature-h': hFrac,
  };
  const text = (fill: string) => (
    <text x={x} fontSize={FC_FONT} textAnchor="middle" fill={fill} fontWeight={600}>
      {lines.map((l, i) => (
        <tspan key={i} x={x} y={y + 4.5 + (i - (lines.length - 1) / 2) * FC_LINE_H}>{l}</tspan>
      ))}
    </text>
  );
  if (node.type === 'start' || node.type === 'end') {
    return (
      <g {...dataAttrs}>
        <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={Math.min(22, h / 2)} fill="#dcfce7" stroke="#16a34a" strokeWidth={2} />
        {text('#14532d')}
      </g>
    );
  }
  if (node.type === 'decision') {
    return (
      <g {...dataAttrs}>
        <polygon points={`${x},${y - h / 2} ${x + w / 2},${y} ${x},${y + h / 2} ${x - w / 2},${y}`} fill="#fef3c7" stroke="#f59e0b" strokeWidth={2} strokeLinejoin="round" />
        {text('#92400e')}
      </g>
    );
  }
  if (node.type === 'io') {
    const sk = 12;
    return (
      <g {...dataAttrs}>
        <polygon points={`${x - w / 2 + sk},${y - h / 2} ${x + w / 2 + sk / 2},${y - h / 2} ${x + w / 2 - sk},${y + h / 2} ${x - w / 2 - sk / 2},${y + h / 2}`} fill="#ede9fe" stroke="#7c3aed" strokeWidth={2} strokeLinejoin="round" />
        {text('#4c1d95')}
      </g>
    );
  }
  return (
    <g {...dataAttrs}>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={3} fill="#dbeafe" stroke="#3b82f6" strokeWidth={2} />
      {text('#1e3a8a')}
    </g>
  );
}

// ── State machine ─────────────────────────────────────────────────────────
type Box = { x: number; y: number; w: number; h: number };
const boxesOverlap = (a: Box, b: Box, pad = 2) =>
  Math.abs(a.x - b.x) < (a.w + b.w) / 2 + pad && Math.abs(a.y - b.y) < (a.h + b.h) / 2 + pad;
const boxHitsCircle = (b: Box, cx: number, cy: number, r: number) => {
  const dx = Math.max(Math.abs(cx - b.x) - b.w / 2, 0);
  const dy = Math.max(Math.abs(cy - b.y) - b.h / 2, 0);
  return dx * dx + dy * dy < r * r;
};

export function CatalogStateMachineRenderer({ figure }: { figure: StateMachineFigure }) {
  const { states, transitions, title } = figure;
  const N = stateMachineFeatureNames;
  const n = states.length;
  const LABEL_CW = 6.6; const LABEL_H = 15;

  // States are sized to their (wrapped) labels, all the same size.
  const stateLines = new Map(states.map((s) => [s.id, wrapWords(s.label || s.id, 9)]));
  let RS = 26;
  for (const lines of stateLines.values()) {
    const halfW = (Math.max(...lines.map((l) => l.length)) * 7.4) / 2;
    const halfH = (lines.length * 15) / 2;
    RS = Math.max(RS, Math.ceil(Math.hypot(halfW, halfH)) + 7);
  }
  RS = Math.min(RS, 52);
  const longestEdgeLabel = Math.max(0, ...transitions.map((t) => t.label.length));
  const ringR = n <= 1 ? 0 : Math.max(n === 2 ? 110 : 120, (n * (2 * RS + 46 + Math.min(60, longestEdgeLabel * 3))) / (2 * Math.PI));
  const angleOf = (i: number) => (n === 2 ? (i === 0 ? Math.PI : 0) : -Math.PI / 2 + (i * 2 * Math.PI) / Math.max(1, n));
  const P = new Map<string, { x: number; y: number; out: number }>();
  states.forEach((s, i) => {
    const a = angleOf(i);
    P.set(s.id, { x: ringR * Math.cos(a), y: ringR * Math.sin(a), out: n <= 1 ? -Math.PI / 2 : a });
  });

  // Several transitions between the same pair are one arrow carrying all their labels.
  type Merged = { from: string; to: string; labels: string[] };
  const merged: Merged[] = [];
  for (const t of transitions) {
    const m = merged.find((x) => x.from === t.from && x.to === t.to);
    if (m) m.labels.push(t.label); else merged.push({ from: t.from, to: t.to, labels: [t.label] });
  }
  const hasLoop = new Set(merged.filter((m) => m.from === m.to).map((m) => m.from));

  const placed: Box[] = [];
  const bounds = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };
  const grow = (x: number, y: number, pad = 0) => {
    bounds.x0 = Math.min(bounds.x0, x - pad); bounds.x1 = Math.max(bounds.x1, x + pad);
    bounds.y0 = Math.min(bounds.y0, y - pad); bounds.y1 = Math.max(bounds.y1, y + pad);
  };
  const growBox = (b: Box) => { grow(b.x - b.w / 2, b.y - b.h / 2); grow(b.x + b.w / 2, b.y + b.h / 2); };
  for (const p of P.values()) grow(p.x, p.y, RS + 3);

  // Start arrows and self-loops sit on the outside of the ring, apart from each other.
  const startArrows: Array<{ id: string; x1: number; y1: number; x2: number; y2: number }> = [];
  for (const s of states) {
    if (!s.isStart) continue;
    const p = P.get(s.id)!;
    const a = n <= 1 ? Math.PI : p.out - (hasLoop.has(s.id) ? 0.7 : 0);
    const x1 = p.x + (RS + 34) * Math.cos(a); const y1 = p.y + (RS + 34) * Math.sin(a);
    startArrows.push({ id: s.id, x1, y1, x2: p.x + (RS + 2) * Math.cos(a), y2: p.y + (RS + 2) * Math.sin(a) });
    grow(x1, y1, 4);
    placed.push({ x: (x1 + p.x + RS * Math.cos(a)) / 2, y: (y1 + p.y + RS * Math.sin(a)) / 2, w: Math.abs(Math.cos(a)) * 34 + 8, h: Math.abs(Math.sin(a)) * 34 + 8 });
  }

  type Drawn = { m: Merged; d: string; label: string; lx: number; ly: number };
  const drawn: Drawn[] = [];
  const labelBox = (text: string, x: number, y: number): Box => ({ x, y, w: text.length * LABEL_CW + 6, h: LABEL_H });
  const clear = (b: Box) =>
    !placed.some((o) => boxesOverlap(b, o)) && ![...P.values()].some((p) => boxHitsCircle(b, p.x, p.y, RS + 3));

  for (const m of merged.filter((x) => x.from === x.to)) {
    const p = P.get(m.from)!;
    const isStart = states.find((s) => s.id === m.from)?.isStart;
    const a = p.out + (isStart && n > 1 ? 0.7 : 0);
    const pt = (r: number, da: number): [number, number] => [p.x + r * Math.cos(a + da), p.y + r * Math.sin(a + da)];
    const [sx, sy] = pt(RS, -0.38); const [ex, ey] = pt(RS + 2, 0.38);
    const [c1x, c1y] = pt(RS + 50, -0.6); const [c2x, c2y] = pt(RS + 50, 0.6);
    const label = m.labels.join(', ');
    const w = label.length * LABEL_CW + 6;
    const dist = RS + 30 + Math.max(Math.abs(Math.cos(a)) * (w / 2), Math.abs(Math.sin(a)) * (LABEL_H / 2)) + 5;
    const lx = p.x + dist * Math.cos(a); const ly = p.y + dist * Math.sin(a);
    const b = labelBox(label, lx, ly);
    placed.push(b); growBox(b);
    const [apx, apy] = pt(RS + 30, 0); grow(apx, apy, 8);
    drawn.push({ m, d: `M ${sx} ${sy} C ${c1x} ${c1y} ${c2x} ${c2y} ${ex} ${ey}`, label, lx, ly });
  }

  // Arrows between two different states: geometry first, then every label is put where it
  // is clear of the states, of the other labels and, as far as possible, of the other arrows.
  type Geo = { m: Merged; sx: number; sy: number; cx: number; cy: number; ex: number; ey: number; bowed: boolean; len: number };
  const geos: Geo[] = merged.filter((x) => x.from !== x.to).map((m) => {
    const a = P.get(m.from)!; const b = P.get(m.to)!;
    const dx = b.x - a.x; const dy = b.y - a.y; const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len; const uy = dy / len;
    const bowed = merged.some((o) => o.from === m.to && o.to === m.from);
    // A pair of opposite arrows bows apart; each bows to its own right.
    const bend = bowed ? Math.max(22, len * 0.16) : 0;
    const cxm = (a.x + b.x) / 2 + uy * bend * 2; const cym = (a.y + b.y) / 2 - ux * bend * 2;
    const toC = (p: { x: number; y: number }, r: number): [number, number] => {
      const l = Math.hypot(cxm - p.x, cym - p.y) || 1;
      return [p.x + ((cxm - p.x) / l) * r, p.y + ((cym - p.y) / l) * r];
    };
    const [sx, sy] = toC(a, RS); const [ex, ey] = toC(b, RS + 2);
    return { m, sx, sy, cx: cxm, cy: cym, ex, ey, bowed, len };
  });
  const at = (g: Geo, t: number): [number, number, number, number] => {
    const x = (1 - t) * (1 - t) * g.sx + 2 * (1 - t) * t * g.cx + t * t * g.ex;
    const y = (1 - t) * (1 - t) * g.sy + 2 * (1 - t) * t * g.cy + t * t * g.ey;
    const tx = 2 * (1 - t) * (g.cx - g.sx) + 2 * t * (g.ex - g.cx);
    const ty = 2 * (1 - t) * (g.cy - g.sy) + 2 * t * (g.ey - g.cy);
    const tl = Math.hypot(tx, ty) || 1;
    return [x, y, tx / tl, ty / tl];
  };
  const samples = geos.map((g) => Array.from({ length: 25 }, (_, i) => at(g, i / 24)));
  const neighbourLen = n > 2 ? 2 * ringR * Math.sin(Math.PI / n) + 1 : Infinity;
  geos.forEach((g, gi) => {
    const label = g.m.labels.join(', ');
    const w = label.length * LABEL_CW + 6;
    // A short arrow between neighbours is labelled at its middle; a long one that crosses
    // the ring is labelled near where it starts, away from the crossings in the middle.
    const ts = g.len <= neighbourLen ? [0.5, 0.4, 0.6, 0.3, 0.7] : [0.26, 0.2, 0.34, 0.42, 0.74, 0.8, 0.66, 0.5];
    const sides = g.bowed ? [1] : [1, -1];
    let best: Box | null = null; let bestBad = Infinity;
    for (const t of ts) {
      for (const side of sides) {
        const [x, y, tx, ty] = at(g, t);
        const nx = ty * side; const ny = -tx * side; // side 1 = right of travel (the outer side of a bowed pair)
        const off = Math.abs(nx) * (w / 2) + Math.abs(ny) * (LABEL_H / 2) + 4;
        const cand = labelBox(label, x + nx * off, y + ny * off);
        let bad = clear(cand) ? 0 : 10;
        samples.forEach((pts, oi) => {
          if (oi !== gi && pts.some(([px, py]) => Math.abs(px - cand.x) < cand.w / 2 + 2 && Math.abs(py - cand.y) < cand.h / 2 + 2)) bad += 1;
        });
        if (bad < bestBad) { bestBad = bad; best = cand; }
      }
      if (bestBad === 0) break;
    }
    const lb = best!;
    placed.push(lb); growBox(lb);
    grow(g.cx * 0.5 + (g.sx + g.ex) * 0.25, g.cy * 0.5 + (g.sy + g.ey) * 0.25, 3);
    drawn.push({ m: g.m, d: `M ${g.sx} ${g.sy} Q ${g.cx} ${g.cy} ${g.ex} ${g.ey}`, label, lx: lb.x, ly: lb.y });
  });

  const PAD = 12;
  const vx = bounds.x0 - PAD; const vy = bounds.y0 - PAD;
  const W = bounds.x1 - bounds.x0 + PAD * 2; const H = bounds.y1 - bounds.y0 + PAD * 2;
  const fx = (x: number) => (x - vx) / W; const fy = (y: number) => (y - vy) / H;

  return (
    <div
      className="state-machine-renderer w-full flex flex-col items-center"
      data-feature={N.machine}
      data-feature-label={title || 'state machine'}
    >
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      <svg viewBox={`${vx} ${vy} ${W} ${H}`} className="w-full" style={{ maxWidth: Math.min(720, Math.round(W)) }}>
        <defs>
          <marker id="sm-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#374151" />
          </marker>
        </defs>
        {drawn.map((dr, i) => (
          <path key={`p-${i}`} d={dr.d} fill="none" stroke="#374151" strokeWidth={1.5} markerEnd="url(#sm-arr)" />
        ))}
        {startArrows.map((s) => (
          <line key={`s-${s.id}`} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke="#374151" strokeWidth={1.5} markerEnd="url(#sm-arr)" />
        ))}
        {states.map((s) => {
          const p = P.get(s.id)!;
          const label = s.label || s.id;
          const lines = stateLines.get(s.id)!;
          return (
            <g
              key={s.id}
              data-feature={N.state(s.id)}
              data-feature-label={label}
              data-feature-cx={fx(p.x)}
              data-feature-cy={fy(p.y)}
              data-feature-w={(2 * RS + 24) / W}
              data-feature-h={(2 * RS + 24) / H}
            >
              <circle cx={p.x} cy={p.y} r={RS} fill="#dbeafe" stroke="#1e3a8a" strokeWidth={2} />
              {s.isAccept && <circle cx={p.x} cy={p.y} r={RS - 5} fill="none" stroke="#1e3a8a" strokeWidth={1.5} />}
              <text fontSize={13} textAnchor="middle" fill="#1e3a8a" fontWeight={700}>
                {lines.map((l, i) => (
                  <tspan key={i} x={p.x} y={p.y + 4.5 + (i - (lines.length - 1) / 2) * 15}>{l}</tspan>
                ))}
              </text>
            </g>
          );
        })}
        {drawn.map((dr, i) => (
          <g key={`l-${i}`}>
            {dr.m.labels.map((lab, j) => (
              <g
                key={j}
                data-feature={N.transition(dr.m.from, dr.m.to, lab)}
                data-feature-label={lab}
                data-feature-cx={fx(dr.lx)}
                data-feature-cy={fy(dr.ly)}
                data-feature-w={(dr.label.length * LABEL_CW + 12) / W}
                data-feature-h={26 / H}
              />
            ))}
            <text x={dr.lx} y={dr.ly + 4} fontSize={12} textAnchor="middle" fill="#b91c1c" fontWeight={600} style={HALO}>{dr.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// ── Binary tree ───────────────────────────────────────────────────────────
/** Long values drop a font notch before the node widens. */
function nodeFontSize(v: string): number {
  return v.length > 5 ? 12 : 14;
}
/** Node half-width from the value's estimated text width (min = a circle of r 20). */
function nodeRx(v: string): number {
  return Math.max(20, Math.round(v.length * nodeFontSize(v) * 0.31) + 8);
}
interface TreePlaced { x: number; depth: number; value: string; path: string; parent?: number }
/** Tidy-tree layout: each subtree is laid out on its own, then the two halves are pushed
 *  together until their outlines are a fixed gap apart. Width grows with the number of
 *  nodes on a level, not with 2^depth, so a deep lopsided tree keeps readable nodes. */
function layoutBinaryTree(root: BinaryTreeNode): TreePlaced[] {
  const GAP = 16; const SINGLE = 24; const MIN_SEP = 56;
  type Sub = { nodes: TreePlaced[]; left: number[]; right: number[] };
  function go(n: BinaryTreeNode, depth: number, path: string): Sub {
    const hw = nodeRx(n.value);
    const me: TreePlaced = { x: 0, depth, value: n.value, path };
    const L = n.left ? go(n.left, depth + 1, path + 'L') : null;
    const R = n.right ? go(n.right, depth + 1, path + 'R') : null;
    const left = [-hw]; const right = [hw];
    const nodes = [me];
    const attach = (s: Sub, dx: number) => {
      for (const c of s.nodes) c.x += dx;
      s.nodes[0].parent = -1; // marker: direct child of `me`, resolved below
      s.left.forEach((v, i) => { left[i + 1] = Math.min(left[i + 1] ?? Infinity, v + dx); });
      s.right.forEach((v, i) => { right[i + 1] = Math.max(right[i + 1] ?? -Infinity, v + dx); });
    };
    if (L && R) {
      let sep = MIN_SEP;
      for (let i = 0; i < Math.min(L.right.length, R.left.length); i++) sep = Math.max(sep, L.right[i] - R.left[i] + GAP);
      attach(L, -sep / 2); attach(R, sep / 2);
    } else if (L) attach(L, -SINGLE);
    else if (R) attach(R, SINGLE);
    for (const s of [L, R]) {
      if (!s) continue;
      const offset = nodes.length;
      for (const c of s.nodes) {
        if (c.parent === -1) c.parent = 0;
        else if (c.parent !== undefined) c.parent += offset;
        nodes.push(c);
      }
    }
    return { nodes, left, right };
  }
  return go(root, 0, '').nodes;
}

export function CatalogBinaryTreeRenderer({ figure }: { figure: BinaryTreeFigure }) {
  const { root, title } = figure;
  const N = binaryTreeFeatureNames;
  const LEVEL = 66; const RY = 20; const PAD = 10;
  const placed = layoutBinaryTree(root);
  const minX = Math.min(...placed.map((p) => p.x - nodeRx(p.value)));
  const maxX = Math.max(...placed.map((p) => p.x + nodeRx(p.value)));
  const maxDepth = Math.max(...placed.map((p) => p.depth));
  const W = maxX - minX + PAD * 2;
  const H = maxDepth * LEVEL + RY * 2 + PAD * 2;
  const X = (p: TreePlaced) => p.x - minX + PAD;
  const Y = (p: TreePlaced) => PAD + RY + p.depth * LEVEL;
  return (
    <div
      className="binary-tree-renderer w-full flex flex-col items-center"
      data-feature={N.tree}
      data-feature-label={title || 'binary tree'}
    >
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxWidth: Math.min(720, Math.round(W * 1.1)) }}>
        {placed.map((p, i) => p.parent !== undefined ? (
          <line key={`l-${i}`} x1={X(placed[p.parent])} y1={Y(placed[p.parent])} x2={X(p)} y2={Y(p)} stroke="#6b7280" strokeWidth={1.5} />
        ) : null)}
        {placed.map((p, i) => (
          <g
            key={i}
            data-feature={N.node(p.path)}
            data-feature-label={p.value}
            data-feature-cx={X(p) / W}
            data-feature-cy={Y(p) / H}
            data-feature-w={(2 * nodeRx(p.value) + 8) / W}
            data-feature-h={48 / H}
          >
            <ellipse cx={X(p)} cy={Y(p)} rx={nodeRx(p.value)} ry={RY} fill="#dbeafe" stroke="#3b82f6" strokeWidth={2} />
            <text x={X(p)} y={Y(p) + 5} fontSize={nodeFontSize(p.value)} textAnchor="middle" fill="#1e3a8a" fontWeight={700}>{p.value}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// ── Truth table ───────────────────────────────────────────────────────────
export function CatalogTruthTableRenderer({ figure }: { figure: TruthTableFigure }) {
  const { inputs, outputColumns, rows, title } = figure;
  const N = truthTableFeatureNames;
  return (
    <div
      className="truth-table-renderer w-full flex flex-col items-center"
      data-feature={N.table}
      data-feature-label={title || 'truth table'}
    >
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      <table className="border-collapse">
        <thead>
          <tr>
            {inputs.map((c, i) => (
              <th
                key={`i-${i}`}
                className="px-3 py-2 border border-gray-400 bg-blue-50 font-mono"
                data-feature={N.inputCol(c)}
                data-feature-label={c}
              >{c}</th>
            ))}
            {outputColumns.map((c, i) => (
              <th
                key={`o-${i}`}
                className="px-3 py-2 border border-gray-400 bg-amber-50 font-mono"
                data-feature={N.outputCol(c.label)}
                data-feature-label={c.label}
              >{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr
              key={ri}
              data-feature={N.row(ri)}
              data-feature-label={`row ${ri + 1}`}
            >
              {r.map((b, ci) => <td key={`r${ri}c${ci}`} className="px-3 py-1 border border-gray-300 text-center font-mono">{b ? 1 : 0}</td>)}
              {outputColumns.map((c, ci) => <td key={`r${ri}o${ci}`} className="px-3 py-1 border border-gray-300 text-center font-mono">{c.values[ri] ? 1 : 0}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Logic gate ────────────────────────────────────────────────────────────
export function CatalogLogicGateRenderer({ figure }: { figure: LogicGateFigure }) {
  const { gate, inputs, output, title } = figure;
  const N = logicGateFeatureNames;
  const FONT = 14; const CW = 8.4;
  const nIn = Math.max(1, inputs.length);
  const isNot = gate === 'NOT';
  const orFamily = gate === 'OR' || gate === 'NOR' || gate === 'XOR' || gate === 'XNOR';
  const xorFamily = gate === 'XOR' || gate === 'XNOR';
  const inverted = gate === 'NOT' || gate === 'NAND' || gate === 'NOR' || gate === 'XNOR';
  // The body is tall enough to give every input its own place on the gate's back.
  const gh = isNot ? 56 : Math.max(64, nIn * 24 + 16);
  const gw = isNot ? 52 : orFamily ? Math.round(gh * 1.2) : Math.round(gh * 1.05);
  const WIRE = 44; const BUBBLE = 5; const XOR_GAP = 9;
  const inGutter = Math.max(...inputs.map((s) => s.length), 1) * CW + 10;
  const outGutter = Math.max(output.length, 1) * CW + 10;
  const x0 = inGutter + WIRE + (xorFamily ? XOR_GAP : 0); // the gate's back
  const PAD_Y = 16;
  const H = gh + PAD_Y * 2;
  const cy = H / 2;
  const y0 = cy - gh / 2; const y1 = cy + gh / 2;
  const outX = x0 + gw + (inverted ? BUBBLE * 2 : 0);
  const W = outX + WIRE + outGutter;
  // Where the curved back of an OR-family gate is at height y.
  const backX = (y: number) => {
    if (!orFamily) return x0;
    const t = (y1 - y) / (y1 - y0);
    return x0 + 2 * t * (1 - t) * gw * 0.26;
  };
  const spacing = nIn > 1 ? Math.min(34, (gh - 22) / (nIn - 1)) : 0;
  const inY = (i: number) => cy + (i - (nIn - 1) / 2) * spacing;
  const back = `Q ${x0 + gw * 0.26} ${cy} ${x0} ${y0}`;
  const body = isNot
    ? `M ${x0} ${y0} L ${x0 + gw} ${cy} L ${x0} ${y1} Z`
    : orFamily
      ? `M ${x0} ${y0} Q ${x0 + gw * 0.55} ${y0} ${x0 + gw} ${cy} Q ${x0 + gw * 0.55} ${y1} ${x0} ${y1} ${back} Z`
      : `M ${x0} ${y0} L ${x0 + gw - gh / 2} ${y0} A ${gh / 2} ${gh / 2} 0 0 1 ${x0 + gw - gh / 2} ${y1} L ${x0} ${y1} Z`;
  const nameX = isNot ? x0 + gw * 0.36 : orFamily ? x0 + gw * 0.52 : x0 + gw * 0.46;
  return (
    <div
      className="logic-gate-renderer w-full flex flex-col items-center"
      data-feature={N.gate}
      data-feature-label={title || `${gate} gate`}
    >
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxWidth: Math.min(600, Math.round(W * 1.5)) }}>
        {inputs.map((label, i) => {
          const y = inY(i);
          const xEnd = backX(y) - (xorFamily ? XOR_GAP : 0);
          return (
            <g
              key={`in-${i}`}
              data-feature={N.input(label)}
              data-feature-label={label}
              data-feature-cx={((inGutter + xEnd) / 2) / W}
              data-feature-cy={y / H}
              data-feature-w={(xEnd - inGutter) / W}
              data-feature-h={20 / H}
            >
              <line x1={inGutter} y1={y} x2={xEnd + (xorFamily ? 0 : 1)} y2={y} stroke="#1f2937" strokeWidth={1.8} />
              <text x={inGutter - 6} y={y + 5} fontSize={FONT} textAnchor="end" fill="#1f2937" fontWeight={700}>{label}</text>
            </g>
          );
        })}
        <g
          data-feature={N.body}
          data-feature-label={gate}
          data-feature-cx={(x0 + gw / 2) / W}
          data-feature-cy={cy / H}
          data-feature-w={gw / W}
          data-feature-h={gh / H}
        >
          <path d={body} fill="#fef3c7" stroke="#92400e" strokeWidth={2} strokeLinejoin="round" />
          {xorFamily && (
            <path d={`M ${x0 - XOR_GAP} ${y1} Q ${x0 - XOR_GAP + gw * 0.26} ${cy} ${x0 - XOR_GAP} ${y0}`} fill="none" stroke="#92400e" strokeWidth={2} strokeLinecap="round" />
          )}
          {inverted && <circle cx={x0 + gw + BUBBLE} cy={cy} r={BUBBLE} fill="#ffffff" stroke="#92400e" strokeWidth={2} />}
          <text x={nameX} y={cy + 4.5} fontSize={isNot ? 11 : 13} textAnchor="middle" fill="#7c2d12" fontWeight={700}>{gate}</text>
        </g>
        <g
          data-feature={N.output}
          data-feature-label={output}
          data-feature-cx={((outX + outX + WIRE) / 2) / W}
          data-feature-cy={cy / H}
          data-feature-w={WIRE / W}
          data-feature-h={20 / H}
        >
          <line x1={outX} y1={cy} x2={outX + WIRE} y2={cy} stroke="#1f2937" strokeWidth={1.8} />
          <text x={outX + WIRE + 6} y={cy + 5} fontSize={FONT} fill="#1f2937" fontWeight={700}>{output}</text>
        </g>
      </svg>
    </div>
  );
}
