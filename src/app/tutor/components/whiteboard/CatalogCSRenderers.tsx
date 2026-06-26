'use client';

import React from 'react';
import {
  flowchartSimpleFeatureNames,
  stateMachineFeatureNames,
  binaryTreeFeatureNames,
  truthTableFeatureNames,
  logicGateFeatureNames,
  type FlowchartFigure,
  type FlowchartNode,
  type StateMachineFigure,
  type BinaryTreeFigure,
  type BinaryTreeNode,
  type TruthTableFigure,
  type LogicGateFigure,
} from '@/lib/tutor/diagrams/catalog/kinds/cs';

// ── Flowchart ─────────────────────────────────────────────────────────────
export function CatalogFlowchartSimpleRenderer({ figure }: { figure: FlowchartFigure }) {
  const { nodes, edges, title } = figure;
  const N = flowchartSimpleFeatureNames;
  const NODE_H = 44;
  const ROW_H = 90;
  const GAP = 28; // horizontal gap between packed siblings in a row
  // Per-rank packing layout (see layoutFlowchart): each node is sized to its
  // label and every row is packed so siblings never overlap — regardless of
  // node type or fan-out. Replaces the old stagger layout, which stacked all
  // of a non-decision parent's children at a single x (total occlusion) and
  // spaced decision branches by a fixed gap narrower than the labels.
  const widths = new Map(nodes.map((n) => [n.id, estNodeWidth(n.text)]));
  const { positions, maxDepth, minX, maxX } = layoutFlowchart(nodes, edges, widths, ROW_H, GAP);
  // Reserve a right-side gutter when the graph has back-edges OR
  // skip-edges (forward edges that jump more than one row — e.g. a
  // decision branch going straight to End past a process row). Both
  // route through the gutter to avoid crossing intermediate nodes.
  const needsGutter = edges.some((e) => {
    const a = positions.get(e.from);
    const b = positions.get(e.to);
    if (!a || !b) return false;
    if (b.y < a.y) return true; // back edge
    if ((b.y - a.y) > ROW_H * 1.5) return true; // skip edge
    return false;
  });
  const rightGutter = needsGutter ? 100 : 20;
  const layoutSpan = maxX - minX; // outer-edge to outer-edge (minX/maxX already include half-widths)
  const W = Math.max(600, layoutSpan + 40 + rightGutter);
  const H = 60 + (maxDepth + 1) * ROW_H;
  // Center the layout within (0, W - rightGutter), so the back-edge
  // gutter on the right doesn't shove the layout left of center.
  const usableCenter = (W - rightGutter) / 2;
  const layoutCenter = (minX + maxX) / 2;
  const shiftX = usableCenter - layoutCenter;
  for (const p of positions.values()) p.x += shiftX;
  const BACK_EDGE_X = W - 50;
  return (
    <div
      className="flowchart-renderer w-full flex flex-col items-center"
      data-feature={N.chart}
      data-feature-label={title || 'flowchart'}
    >
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[640px]">
        {edges.map((e, i) => {
          const a = positions.get(e.from)!;
          const b = positions.get(e.to)!;
          const isBackEdge = b.y < a.y;
          // Skip edge: forward but jumps more than one row (e.g. decision's
          // "no" branch going straight to end while the "yes" branch
          // passes through a process row). Route through the right gutter
          // so the label doesn't land inside the skipped node's box.
          const isSkipEdge = !isBackEdge && (b.y - a.y) > ROW_H * 1.5;
          const edgeLabel = e.label || `${e.from} → ${e.to}`;
          if (isBackEdge || isSkipEdge) {
            // Route around the right side: leave from source-right,
            // travel down/up the gutter, enter target from the right.
            const sourceRightX = a.x + (widths.get(e.from) ?? 200) / 2;
            const targetRightX = b.x + (widths.get(e.to) ?? 200) / 2;
            const d = `
              M ${sourceRightX} ${a.y}
              L ${BACK_EDGE_X} ${a.y}
              L ${BACK_EDGE_X} ${b.y}
              L ${targetRightX} ${b.y}
            `;
            return (
              <g
                key={i}
                data-feature={N.edge(e.from, e.to)}
                data-feature-label={edgeLabel}
                data-feature-cx={(BACK_EDGE_X + 6) / W}
                data-feature-cy={((a.y + b.y) / 2) / H}
                data-feature-w={80 / W}
                data-feature-h={Math.abs(a.y - b.y) / H}
              >
                <path d={d} fill="none" stroke="#374151" strokeWidth={1.5} markerEnd="url(#fc-arr)" />
                {e.label && (
                  <text x={BACK_EDGE_X + 6} y={(a.y + b.y) / 2 + 4} fontSize={11} fill="#dc2626" fontWeight={600}>{e.label}</text>
                )}
              </g>
            );
          }
          // Forward edge (target below source) — straight vertical line.
          return (
            <g
              key={i}
              data-feature={N.edge(e.from, e.to)}
              data-feature-label={edgeLabel}
              data-feature-cx={((a.x + b.x) / 2) / W}
              data-feature-cy={((a.y + b.y) / 2) / H}
              data-feature-w={80 / W}
              data-feature-h={Math.abs(b.y - a.y) / H}
            >
              <line x1={a.x} y1={a.y + NODE_H / 2} x2={b.x} y2={b.y - NODE_H / 2} stroke="#374151" strokeWidth={1.5} markerEnd="url(#fc-arr)" />
              {e.label && (
                <text x={(a.x + b.x) / 2 + 10} y={(a.y + b.y) / 2 + 4} fontSize={11} fill="#dc2626" fontWeight={600}>{e.label}</text>
              )}
            </g>
          );
        })}
        <defs>
          <marker id="fc-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#374151" />
          </marker>
        </defs>
        {nodes.map((n) => {
          const p = positions.get(n.id)!;
          return (
            <NodeBox
              key={n.id}
              node={n}
              pos={p}
              width={widths.get(n.id)!}
              dataFeature={N.node(n.id)}
              cxFrac={p.x / W}
              cyFrac={p.y / H}
              wFrac={(widths.get(n.id)! + 8) / W}
              hFrac={(NODE_H + 8) / H}
            />
          );
        })}
      </svg>
    </div>
  );
}

const FC_MIN_W = 140;
const FC_MAX_W = 360;
/** Estimate a node box width from its label so packed siblings never collide
 *  and long labels (e.g. "CS (Bell) + UCS (Food) → UCR (Salivation)") get a
 *  wider box instead of overflowing a fixed 200px one. Clamped so very long
 *  labels don't blow out the row width. */
function estNodeWidth(text: string): number {
  return Math.max(FC_MIN_W, Math.min(FC_MAX_W, Math.round((text || '').length * 7) + 28));
}

function NodeBox({
  node, pos, width, dataFeature, cxFrac, cyFrac, wFrac, hFrac,
}: {
  node: FlowchartNode;
  pos: { x: number; y: number };
  width: number;
  dataFeature: string;
  cxFrac: number;
  cyFrac: number;
  wFrac: number;
  hFrac: number;
}) {
  const { x, y } = pos;
  const w = width;
  const h = 44;
  // Shrink the font a touch for long labels so the text stays inside its box.
  const fontSize = node.text.length > 30 ? 11 : 13;
  const dataAttrs = {
    'data-feature': dataFeature,
    'data-feature-label': node.text,
    'data-feature-cx': cxFrac,
    'data-feature-cy': cyFrac,
    'data-feature-w': wFrac,
    'data-feature-h': hFrac,
  };
  if (node.type === 'start' || node.type === 'end') {
    return (
      <g {...dataAttrs}>
        <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={22} ry={22} fill="#dcfce7" stroke="#16a34a" strokeWidth={2} />
        <text x={x} y={y + 5} fontSize={fontSize} textAnchor="middle" fill="#14532d" fontWeight={600}>{node.text}</text>
      </g>
    );
  }
  if (node.type === 'decision') {
    return (
      <g {...dataAttrs}>
        <polygon points={`${x},${y - h / 2} ${x + w / 2},${y} ${x},${y + h / 2} ${x - w / 2},${y}`} fill="#fef3c7" stroke="#f59e0b" strokeWidth={2} />
        <text x={x} y={y + 5} fontSize={fontSize} textAnchor="middle" fill="#92400e" fontWeight={600}>{node.text}</text>
      </g>
    );
  }
  return (
    <g {...dataAttrs}>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} fill="#dbeafe" stroke="#3b82f6" strokeWidth={2} />
      <text x={x} y={y + 5} fontSize={fontSize} textAnchor="middle" fill="#1e3a8a" fontWeight={600}>{node.text}</text>
    </g>
  );
}

/** Layered layout for the flowchart: BFS longest-path depths from the start
 *  node assign each node to a row, then each row is PACKED left-to-right by the
 *  nodes' own widths + a gap and centered — so siblings never overlap no matter
 *  how many children a node has or what type it is. Rows after the first are
 *  ordered by the barycenter of each node's parents to keep edges short.
 *  Returns positions in unshifted coordinates (caller shifts to a viewBox);
 *  minX/maxX are the outer left/right edges (already include half-widths). */
function layoutFlowchart(
  nodes: FlowchartNode[],
  edges: { from: string; to: string; label?: string }[],
  widths: Map<string, number>,
  rowHeight: number,
  gap: number,
): {
  positions: Map<string, { x: number; y: number }>;
  maxDepth: number;
  minX: number;
  maxX: number;
} {
  const incoming = new Map<string, string[]>();
  const outgoing = new Map<string, { to: string; label?: string }[]>();
  for (const n of nodes) {
    incoming.set(n.id, []);
    outgoing.set(n.id, []);
  }
  for (const e of edges) {
    if (outgoing.has(e.from)) outgoing.get(e.from)!.push({ to: e.to, label: e.label });
    if (incoming.has(e.to)) incoming.get(e.to)!.push(e.from);
  }

  // Depth via longest-path BFS from the start node (or nodes[0] as
  // fallback). "Longest path" so a node converging from a deeper
  // branch lands BELOW the branch tips.
  const startNode = nodes.find((n) => n.type === 'start') || nodes[0];
  const depth = new Map<string, number>();
  depth.set(startNode.id, 0);
  // Iterate until depths stabilize (handles diamonds without recursion).
  let changed = true;
  let safety = 0;
  while (changed && safety++ < nodes.length * 4) {
    changed = false;
    for (const n of nodes) {
      const d = depth.get(n.id);
      if (d === undefined) continue;
      for (const e of outgoing.get(n.id)!) {
        const prev = depth.get(e.to);
        if (prev === undefined || prev < d + 1) {
          depth.set(e.to, d + 1);
          changed = true;
        }
      }
    }
  }
  // Any unreached nodes go below the deepest reached node.
  const maxReachedDepth = Math.max(0, ...Array.from(depth.values()));
  for (const n of nodes) if (!depth.has(n.id)) depth.set(n.id, maxReachedDepth + 1);

  // Group node ids into rows by depth, preserving original array order.
  const maxDepth = Math.max(0, ...Array.from(depth.values()));
  const rows: string[][] = Array.from({ length: maxDepth + 1 }, () => []);
  for (const n of nodes) rows[depth.get(n.id)!].push(n.id);

  // Pack each row top-down. A row's nodes are spaced by their own widths + gap
  // and centered on CENTER (so a linear chain stays a centered vertical spine).
  // Rows below the first are ordered by the average x of their already-placed
  // parents, reducing edge crossings.
  const CENTER = 300;
  const x = new Map<string, number>();
  for (let d = 0; d <= maxDepth; d++) {
    const row = rows[d];
    if (d > 0) {
      const bary = (id: string) => {
        const ps = incoming.get(id)!.filter((p) => x.has(p));
        if (ps.length === 0) return CENTER;
        return ps.reduce((s, p) => s + x.get(p)!, 0) / ps.length;
      };
      row.sort((a, b) => {
        const diff = bary(a) - bary(b);
        if (diff !== 0) return diff;
        return nodes.findIndex((n) => n.id === a) - nodes.findIndex((n) => n.id === b);
      });
    }
    const totalW = row.reduce((s, id) => s + widths.get(id)!, 0) + gap * Math.max(0, row.length - 1);
    let run = CENTER - totalW / 2;
    for (const id of row) {
      const w = widths.get(id)!;
      x.set(id, run + w / 2);
      run += w + gap;
    }
  }

  const positions = new Map<string, { x: number; y: number }>();
  let minX = Infinity;
  let maxX = -Infinity;
  for (const n of nodes) {
    const xv = x.get(n.id)!;
    const w = widths.get(n.id)!;
    positions.set(n.id, { x: xv, y: 60 + depth.get(n.id)! * rowHeight });
    minX = Math.min(minX, xv - w / 2);
    maxX = Math.max(maxX, xv + w / 2);
  }
  return { positions, maxDepth, minX, maxX };
}

// ── State machine ─────────────────────────────────────────────────────────
export function CatalogStateMachineRenderer({ figure }: { figure: StateMachineFigure }) {
  const { states, transitions, title } = figure;
  const N = stateMachineFeatureNames;
  const W = 560;
  const H = 380;
  const cx = W / 2;
  const cy = H / 2;
  const r = 130;
  const positions = new Map<string, { x: number; y: number }>();
  states.forEach((s, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / states.length;
    positions.set(s.id, { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
  });
  return (
    <div
      className="state-machine-renderer w-full flex flex-col items-center"
      data-feature={N.machine}
      data-feature-label={title || 'state machine'}
    >
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[600px]">
        {transitions.map((t, i) => {
          const a = positions.get(t.from)!;
          const b = positions.get(t.to)!;
          if (t.from === t.to) {
            // Self-loop
            return (
              <g
                key={i}
                data-feature={N.transition(t.from, t.to, t.label)}
                data-feature-label={t.label}
                data-feature-cx={a.x / W}
                data-feature-cy={(a.y - 70) / H}
                data-feature-w={70 / W}
                data-feature-h={40 / H}
              >
                <path d={`M ${a.x} ${a.y - 28} C ${a.x - 30} ${a.y - 70} ${a.x + 30} ${a.y - 70} ${a.x + 1} ${a.y - 28}`} fill="none" stroke="#374151" strokeWidth={1.5} markerEnd="url(#sm-arr)" />
                <text x={a.x} y={a.y - 78} fontSize={11} textAnchor="middle" fill="#dc2626" fontWeight={600}>{t.label}</text>
              </g>
            );
          }
          const dx = b.x - a.x, dy = b.y - a.y;
          const len = Math.hypot(dx, dy);
          const ux = dx / len, uy = dy / len;
          const sx = a.x + ux * 30, sy = a.y + uy * 30;
          const ex = b.x - ux * 30, ey = b.y - uy * 30;
          // If a reverse transition exists for the same (from, to) pair,
          // curve both arrows to opposite sides so the labels don't stack
          // on top of each other. Curve apex sits SEP px off the
          // straight line in the "right-of-forward" perpendicular
          // direction.
          const hasReverse = transitions.some(
            (other) => other !== t && other.from === t.to && other.to === t.from,
          );
          const midX = (sx + ex) / 2;
          const midY = (sy + ey) / 2;
          if (hasReverse) {
            const SEP = 30;
            // Right-of-forward perpendicular: rotate forward (ux, uy)
            // by -90° → (uy, -ux). Each direction of the pair picks its
            // own "right", which lands the two curves on opposite sides.
            const perpX = uy;
            const perpY = -ux;
            const ctrlX = midX + perpX * SEP * 2;
            const ctrlY = midY + perpY * SEP * 2;
            const labelX = midX + perpX * SEP;
            const labelY = midY + perpY * SEP;
            return (
              <g
                key={i}
                data-feature={N.transition(t.from, t.to, t.label)}
                data-feature-label={t.label}
                data-feature-cx={labelX / W}
                data-feature-cy={labelY / H}
                data-feature-w={60 / W}
                data-feature-h={28 / H}
              >
                <path
                  d={`M ${sx} ${sy} Q ${ctrlX} ${ctrlY} ${ex} ${ey}`}
                  fill="none"
                  stroke="#374151"
                  strokeWidth={1.5}
                  markerEnd="url(#sm-arr)"
                />
                <text x={labelX} y={labelY + 4} fontSize={11} textAnchor="middle" fill="#dc2626" fontWeight={600}>{t.label}</text>
              </g>
            );
          }
          return (
            <g
              key={i}
              data-feature={N.transition(t.from, t.to, t.label)}
              data-feature-label={t.label}
              data-feature-cx={midX / W}
              data-feature-cy={(midY - 6) / H}
              data-feature-w={Math.max(40, Math.abs(ex - sx)) / W}
              data-feature-h={28 / H}
            >
              <line x1={sx} y1={sy} x2={ex} y2={ey} stroke="#374151" strokeWidth={1.5} markerEnd="url(#sm-arr)" />
              <text x={midX} y={midY - 6} fontSize={11} textAnchor="middle" fill="#dc2626" fontWeight={600}>{t.label}</text>
            </g>
          );
        })}
        <defs>
          <marker id="sm-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#374151" />
          </marker>
        </defs>
        {states.map((s) => {
          const p = positions.get(s.id)!;
          const label = s.label || s.id;
          return (
            <g
              key={s.id}
              data-feature={N.state(s.id)}
              data-feature-label={label}
              data-feature-cx={p.x / W}
              data-feature-cy={p.y / H}
              // Bbox padded ~10px past the visible r=28 circle so the
              // scribble tick (anchored at the inside-right edge of the
              // bbox) lands OUTSIDE the circle stroke instead of
              // overlapping the state label.
              data-feature-w={80 / W}
              data-feature-h={80 / H}
            >
              <circle cx={p.x} cy={p.y} r={28} fill="#dbeafe" stroke="#1e3a8a" strokeWidth={s.isAccept ? 3 : 2} />
              {s.isAccept && <circle cx={p.x} cy={p.y} r={22} fill="none" stroke="#1e3a8a" strokeWidth={1.5} />}
              <text x={p.x} y={p.y + 5} fontSize={13} textAnchor="middle" fill="#1e3a8a" fontWeight={700}>{label}</text>
              {s.isStart && (
                <line x1={p.x - 60} y1={p.y} x2={p.x - 30} y2={p.y} stroke="#374151" strokeWidth={1.5} markerEnd="url(#sm-arr)" />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── Binary tree ───────────────────────────────────────────────────────────
export function CatalogBinaryTreeRenderer({ figure }: { figure: BinaryTreeFigure }) {
  const { root, title } = figure;
  const N = binaryTreeFeatureNames;
  // Compute depth + assign x positions via recursive layout.
  const depth = treeDepth(root);
  const W = Math.max(120, (1 << (depth - 1)) * 80);
  const H = depth * 80 + 40;
  const positions: Array<{ x: number; y: number; value: string; path: string; parent?: { x: number; y: number } }> = [];
  function layout(n: BinaryTreeNode, x0: number, x1: number, depthLevel: number, path: string, parent?: { x: number; y: number }) {
    const cx = (x0 + x1) / 2;
    const cy = 30 + depthLevel * 80;
    positions.push({ x: cx, y: cy, value: n.value, path, parent });
    if (n.left) layout(n.left, x0, cx, depthLevel + 1, path + 'L', { x: cx, y: cy });
    if (n.right) layout(n.right, cx, x1, depthLevel + 1, path + 'R', { x: cx, y: cy });
  }
  layout(root, 0, W, 0, '');
  return (
    <div
      className="binary-tree-renderer w-full flex flex-col items-center"
      data-feature={N.tree}
      data-feature-label={title || 'binary tree'}
    >
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[640px]">
        {positions.map((p, i) => p.parent ? (
          <line key={`l-${i}`} x1={p.parent.x} y1={p.parent.y + 18} x2={p.x} y2={p.y - 18} stroke="#6b7280" strokeWidth={1.5} />
        ) : null)}
        {positions.map((p, i) => (
          <g
            key={i}
            data-feature={N.node(p.path)}
            data-feature-label={p.value}
            data-feature-cx={p.x / W}
            data-feature-cy={p.y / H}
            data-feature-w={48 / W}
            data-feature-h={48 / H}
          >
            <circle cx={p.x} cy={p.y} r={20} fill="#dbeafe" stroke="#3b82f6" strokeWidth={2} />
            <text x={p.x} y={p.y + 5} fontSize={13} textAnchor="middle" fill="#1e3a8a" fontWeight={700}>{p.value}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}
function treeDepth(n: BinaryTreeNode | undefined): number {
  if (!n) return 0;
  return 1 + Math.max(treeDepth(n.left), treeDepth(n.right));
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
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
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
  const W = 320;
  const H = 200;
  const cx = W / 2;
  const cy = H / 2;
  return (
    <div
      className="logic-gate-renderer w-full flex flex-col items-center"
      data-feature={N.gate}
      data-feature-label={title || `${gate} gate`}
    >
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[360px]">
        <GateShape gate={gate} cx={cx} cy={cy} W={W} H={H} bodyFeature={N.body} />
        {inputs.map((label, i) => {
          const y = cy - 30 + i * 60;
          return (
            <g
              key={`in-${i}`}
              data-feature={N.input(label)}
              data-feature-label={label}
              data-feature-cx={((20 + (cx - 50)) / 2) / W}
              data-feature-cy={y / H}
              data-feature-w={(cx - 70) / W}
              data-feature-h={20 / H}
            >
              <line x1={20} y1={y} x2={cx - 50} y2={y} stroke="#1f2937" strokeWidth={1.5} />
              <text x={14} y={y + 4} fontSize={13} textAnchor="end" fill="#1f2937" fontWeight={700}>{label}</text>
            </g>
          );
        })}
        <g
          data-feature={N.output}
          data-feature-label={output}
          data-feature-cx={((cx + 60 + W - 20) / 2) / W}
          data-feature-cy={cy / H}
          data-feature-w={(W - cx - 80) / W}
          data-feature-h={20 / H}
        >
          <line x1={cx + 60} y1={cy} x2={W - 20} y2={cy} stroke="#1f2937" strokeWidth={1.5} />
          <text x={W - 14} y={cy + 4} fontSize={13} fill="#1f2937" fontWeight={700}>{output}</text>
        </g>
      </svg>
    </div>
  );
}
function GateShape({
  gate, cx, cy, W, H, bodyFeature,
}: {
  gate: LogicGateFigure['gate'];
  cx: number;
  cy: number;
  W: number;
  H: number;
  bodyFeature: string;
}) {
  // Use simplified rectangular labeled gates for clarity over canonical IEEE shapes.
  const w = 100, h = 70;
  const x = cx - w / 2;
  const y = cy - h / 2;
  return (
    <g
      data-feature={bodyFeature}
      data-feature-label={gate}
      data-feature-cx={cx / W}
      data-feature-cy={cy / H}
      data-feature-w={w / W}
      data-feature-h={h / H}
    >
      <rect x={x} y={y} width={w} height={h} fill="#fef3c7" stroke="#92400e" strokeWidth={2} rx={6} />
      <text x={cx} y={cy + 6} fontSize={18} textAnchor="middle" fill="#7c2d12" fontWeight={700}>{gate}</text>
    </g>
  );
}
