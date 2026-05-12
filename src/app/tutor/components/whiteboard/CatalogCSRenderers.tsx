'use client';

import React from 'react';
import type { FlowchartFigure, FlowchartNode, StateMachineFigure, BinaryTreeFigure, BinaryTreeNode, TruthTableFigure, LogicGateFigure } from '@/lib/tutor/diagrams/catalog/kinds/cs';

// ── Flowchart ─────────────────────────────────────────────────────────────
export function CatalogFlowchartSimpleRenderer({ figure }: { figure: FlowchartFigure }) {
  const { nodes, edges, title } = figure;
  // Widen the viewBox so back-edges have room to curve around the right
  // of the box column without overlapping. The box column stays at
  // x=300 (centered in the main 600px area); back-edge routing extends
  // into the gutter from x=400 to x=560.
  const W = 600;
  const NODE_W = 200;
  const NODE_H = 44;
  const ROW_H = 90;
  const H = 60 + nodes.length * ROW_H;
  const boxCenterX = 300;
  const positions = new Map<string, { x: number; y: number }>();
  nodes.forEach((n, i) => positions.set(n.id, { x: boxCenterX, y: 60 + i * ROW_H }));
  // Gutter x for back-edge curves: outside the right edge of the boxes
  // (boxes span x=[200, 400]); 470 leaves room for the label without
  // overlapping the box right edge.
  const BACK_EDGE_X = 470;
  return (
    <div className="flowchart-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[640px]">
        {edges.map((e, i) => {
          const a = positions.get(e.from)!;
          const b = positions.get(e.to)!;
          const isBackEdge = b.y < a.y;
          if (isBackEdge) {
            // Route around the right side: leave from source-right,
            // travel down/up the gutter, enter target from the right.
            const sourceRightX = a.x + NODE_W / 2;
            const targetRightX = b.x + NODE_W / 2;
            // Pull-out + return path. Use straight orthogonal segments
            // joined with rounded corners via a single path.
            const d = `
              M ${sourceRightX} ${a.y}
              L ${BACK_EDGE_X} ${a.y}
              L ${BACK_EDGE_X} ${b.y}
              L ${targetRightX} ${b.y}
            `;
            return (
              <g key={i}>
                <path d={d} fill="none" stroke="#374151" strokeWidth={1.5} markerEnd="url(#fc-arr)" />
                {e.label && (
                  // Place label vertically centered along the gutter
                  // segment; nudged a few px right of the gutter line
                  // so the text doesn't overlap the path itself.
                  <text x={BACK_EDGE_X + 6} y={(a.y + b.y) / 2 + 4} fontSize={11} fill="#dc2626" fontWeight={600}>{e.label}</text>
                )}
              </g>
            );
          }
          // Forward edge (target below source) — straight vertical line.
          return (
            <g key={i}>
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
        {nodes.map((n, i) => <NodeBox key={i} node={n} pos={positions.get(n.id)!} />)}
      </svg>
    </div>
  );
}

function NodeBox({ node, pos }: { node: FlowchartNode; pos: { x: number; y: number } }) {
  const { x, y } = pos;
  const w = 200;
  const h = 44;
  if (node.type === 'start' || node.type === 'end') {
    return (
      <g>
        <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={22} ry={22} fill="#dcfce7" stroke="#16a34a" strokeWidth={2} />
        <text x={x} y={y + 5} fontSize={13} textAnchor="middle" fill="#14532d" fontWeight={600}>{node.text}</text>
      </g>
    );
  }
  if (node.type === 'decision') {
    return (
      <g>
        <polygon points={`${x},${y - h / 2} ${x + w / 2},${y} ${x},${y + h / 2} ${x - w / 2},${y}`} fill="#fef3c7" stroke="#f59e0b" strokeWidth={2} />
        <text x={x} y={y + 5} fontSize={12} textAnchor="middle" fill="#92400e" fontWeight={600}>{node.text}</text>
      </g>
    );
  }
  return (
    <g>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} fill="#dbeafe" stroke="#3b82f6" strokeWidth={2} />
      <text x={x} y={y + 5} fontSize={13} textAnchor="middle" fill="#1e3a8a" fontWeight={600}>{node.text}</text>
    </g>
  );
}

// ── State machine ─────────────────────────────────────────────────────────
export function CatalogStateMachineRenderer({ figure }: { figure: StateMachineFigure }) {
  const { states, transitions, title } = figure;
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
    <div className="state-machine-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[600px]">
        {transitions.map((t, i) => {
          const a = positions.get(t.from)!;
          const b = positions.get(t.to)!;
          if (t.from === t.to) {
            // Self-loop
            return (
              <g key={i}>
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
          return (
            <g key={i}>
              <line x1={sx} y1={sy} x2={ex} y2={ey} stroke="#374151" strokeWidth={1.5} markerEnd="url(#sm-arr)" />
              <text x={(sx + ex) / 2} y={(sy + ey) / 2 - 6} fontSize={11} textAnchor="middle" fill="#dc2626" fontWeight={600}>{t.label}</text>
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
          return (
            <g key={s.id}>
              <circle cx={p.x} cy={p.y} r={28} fill="#dbeafe" stroke="#1e3a8a" strokeWidth={s.isAccept ? 3 : 2} />
              {s.isAccept && <circle cx={p.x} cy={p.y} r={22} fill="none" stroke="#1e3a8a" strokeWidth={1.5} />}
              <text x={p.x} y={p.y + 5} fontSize={13} textAnchor="middle" fill="#1e3a8a" fontWeight={700}>{s.label || s.id}</text>
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
  // Compute depth + assign x positions via recursive layout.
  const depth = treeDepth(root);
  const W = Math.max(120, (1 << (depth - 1)) * 80);
  const H = depth * 80 + 40;
  const positions: Array<{ x: number; y: number; value: string; parent?: { x: number; y: number } }> = [];
  function layout(n: BinaryTreeNode, x0: number, x1: number, depthLevel: number, parent?: { x: number; y: number }) {
    const cx = (x0 + x1) / 2;
    const cy = 30 + depthLevel * 80;
    positions.push({ x: cx, y: cy, value: n.value, parent });
    if (n.left) layout(n.left, x0, cx, depthLevel + 1, { x: cx, y: cy });
    if (n.right) layout(n.right, cx, x1, depthLevel + 1, { x: cx, y: cy });
  }
  layout(root, 0, W, 0);
  return (
    <div className="binary-tree-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[640px]">
        {positions.map((p, i) => p.parent ? (
          <line key={`l-${i}`} x1={p.parent.x} y1={p.parent.y + 18} x2={p.x} y2={p.y - 18} stroke="#6b7280" strokeWidth={1.5} />
        ) : null)}
        {positions.map((p, i) => (
          <g key={i}>
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
  return (
    <div className="truth-table-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <table className="border-collapse">
        <thead>
          <tr>
            {inputs.map((c, i) => <th key={`i-${i}`} className="px-3 py-2 border border-gray-400 bg-blue-50 font-mono">{c}</th>)}
            {outputColumns.map((c, i) => <th key={`o-${i}`} className="px-3 py-2 border border-gray-400 bg-amber-50 font-mono">{c.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri}>
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
  const W = 320;
  const H = 200;
  const cx = W / 2;
  const cy = H / 2;
  return (
    <div className="logic-gate-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[360px]">
        <GateShape gate={gate} cx={cx} cy={cy} />
        {inputs.map((label, i) => {
          const y = cy - 30 + i * 60;
          return (
            <g key={`in-${i}`}>
              <line x1={20} y1={y} x2={cx - 50} y2={y} stroke="#1f2937" strokeWidth={1.5} />
              <text x={14} y={y + 4} fontSize={13} textAnchor="end" fill="#1f2937" fontWeight={700}>{label}</text>
            </g>
          );
        })}
        <line x1={cx + (gate === 'NOT' ? 60 : 60)} y1={cy} x2={W - 20} y2={cy} stroke="#1f2937" strokeWidth={1.5} />
        <text x={W - 14} y={cy + 4} fontSize={13} fill="#1f2937" fontWeight={700}>{output}</text>
      </svg>
    </div>
  );
}
function GateShape({ gate, cx, cy }: { gate: LogicGateFigure['gate']; cx: number; cy: number }) {
  // Use simplified rectangular labeled gates for clarity over canonical IEEE shapes.
  const w = 100, h = 70;
  const x = cx - w / 2;
  const y = cy - h / 2;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="#fef3c7" stroke="#92400e" strokeWidth={2} rx={6} />
      <text x={cx} y={cy + 6} fontSize={18} textAnchor="middle" fill="#7c2d12" fontWeight={700}>{gate}</text>
    </g>
  );
}
