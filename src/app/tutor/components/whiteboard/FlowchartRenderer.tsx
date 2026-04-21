'use client';

/**
 * Flowchart Renderer
 *
 * Nodes (start/end/process/decision/io) connected by labeled edges. Nodes are
 * placed at x,y in a normalized 0–100 coordinate system; if coordinates are
 * omitted, a very simple top-down layout positions them based on declaration
 * order.
 *
 * Use for CS algorithm teaching, science process flows, or any procedure
 * with branching.
 */

import React from 'react';

export type FlowchartNodeType = 'start' | 'end' | 'process' | 'decision' | 'io';

export interface FlowchartNode {
  id: string;
  type: FlowchartNodeType;
  label: string;
  x?: number; // 0–100
  y?: number; // 0–100
}

export interface FlowchartEdge {
  from: string;
  to: string;
  label?: string;
}

export interface FlowchartRendererProps {
  title?: string;
  nodes: FlowchartNode[];
  edges?: FlowchartEdge[];
  layout?: 'top-down' | 'left-right';
}

const SVG_WIDTH = 600;
const SVG_HEIGHT = 500;
const NODE_W = 120;
const NODE_H = 50;

const NODE_COLORS: Record<FlowchartNodeType, { fill: string; stroke: string }> = {
  start: { fill: '#d1fae5', stroke: '#059669' },
  end: { fill: '#fee2e2', stroke: '#dc2626' },
  process: { fill: '#dbeafe', stroke: '#2563eb' },
  decision: { fill: '#fef3c7', stroke: '#d97706' },
  io: { fill: '#ede9fe', stroke: '#7c3aed' },
};

function toSvg(x: number, y: number): [number, number] {
  const inset = 40;
  return [
    inset + (x / 100) * (SVG_WIDTH - 2 * inset),
    inset + (y / 100) * (SVG_HEIGHT - 2 * inset),
  ];
}

/** Pick a default layout: auto-space nodes top-down in declaration order. */
function autoLayout(nodes: FlowchartNode[], layout: 'top-down' | 'left-right'): FlowchartNode[] {
  const n = nodes.length;
  if (n === 0) return nodes;
  return nodes.map((node, i) => {
    if (node.x !== undefined && node.y !== undefined) return node;
    if (layout === 'left-right') {
      return { ...node, x: 10 + (i / Math.max(1, n - 1)) * 80, y: 50 };
    }
    return { ...node, x: 50, y: 10 + (i / Math.max(1, n - 1)) * 80 };
  });
}

export default function FlowchartRenderer({
  title,
  nodes,
  edges = [],
  layout = 'top-down',
}: FlowchartRendererProps) {
  const laidOut = autoLayout(nodes, layout);
  const posMap = new Map<string, [number, number]>();
  for (const n of laidOut) {
    const [px, py] = toSvg(n.x ?? 50, n.y ?? 50);
    posMap.set(n.id, [px, py]);
  }

  return (
    <div className="flowchart-renderer">
      {title && (
        <div className="text-center text-sm font-semibold text-gray-700 mb-2">
          {title}
        </div>
      )}
      <svg
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        className="w-full h-auto"
        style={{ maxWidth: SVG_WIDTH, maxHeight: SVG_HEIGHT }}
      >
        <defs>
          <marker
            id="fc-arrow"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="5"
            orient="auto"
          >
            <path d="M0,0 L10,5 L0,10 Z" fill="#475569" />
          </marker>
        </defs>
        <rect width={SVG_WIDTH} height={SVG_HEIGHT} fill="#fafbfc" rx={4} />

        {/* Edges (drawn first so nodes paint over them) */}
        {edges.map((e, i) => {
          const from = posMap.get(e.from);
          const to = posMap.get(e.to);
          if (!from || !to) return null;
          const [x1, y1] = from;
          const [x2, y2] = to;
          // Shorten line endpoints so the arrow terminates outside the node
          const dx = x2 - x1;
          const dy = y2 - y1;
          const len = Math.sqrt(dx * dx + dy * dy) || 1;
          const ux = dx / len;
          const uy = dy / len;
          const shrinkStart = NODE_H / 2 + 2;
          const shrinkEnd = NODE_H / 2 + 8;
          const sx = x1 + ux * shrinkStart;
          const sy = y1 + uy * shrinkStart;
          const ex = x2 - ux * shrinkEnd;
          const ey = y2 - uy * shrinkEnd;
          const mx = (sx + ex) / 2;
          const my = (sy + ey) / 2;
          return (
            <g key={`e-${i}`}>
              <line
                x1={sx}
                y1={sy}
                x2={ex}
                y2={ey}
                stroke="#475569"
                strokeWidth={1.5}
                markerEnd="url(#fc-arrow)"
              />
              {e.label && (
                <g>
                  <rect
                    x={mx - 14}
                    y={my - 8}
                    width={28}
                    height={14}
                    rx={3}
                    fill="#fafbfc"
                    stroke="#cbd5e1"
                    strokeWidth={0.5}
                  />
                  <text
                    x={mx}
                    y={my + 3}
                    textAnchor="middle"
                    fontSize={10}
                    fill="#475569"
                    fontWeight={500}
                  >
                    {e.label}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {laidOut.map((n) => {
          const [cx, cy] = posMap.get(n.id)!;
          const colors = NODE_COLORS[n.type];
          const shape = (() => {
            switch (n.type) {
              case 'start':
              case 'end':
                // Rounded pill
                return (
                  <rect
                    x={cx - NODE_W / 2}
                    y={cy - NODE_H / 2}
                    width={NODE_W}
                    height={NODE_H}
                    rx={NODE_H / 2}
                    fill={colors.fill}
                    stroke={colors.stroke}
                    strokeWidth={2}
                  />
                );
              case 'decision':
                // Diamond
                return (
                  <polygon
                    points={`${cx},${cy - NODE_H * 0.7} ${cx + NODE_W * 0.65},${cy} ${cx},${cy + NODE_H * 0.7} ${cx - NODE_W * 0.65},${cy}`}
                    fill={colors.fill}
                    stroke={colors.stroke}
                    strokeWidth={2}
                  />
                );
              case 'io':
                // Parallelogram
                return (
                  <polygon
                    points={`${cx - NODE_W / 2 + 10},${cy - NODE_H / 2} ${cx + NODE_W / 2},${cy - NODE_H / 2} ${cx + NODE_W / 2 - 10},${cy + NODE_H / 2} ${cx - NODE_W / 2},${cy + NODE_H / 2}`}
                    fill={colors.fill}
                    stroke={colors.stroke}
                    strokeWidth={2}
                  />
                );
              case 'process':
              default:
                // Rectangle
                return (
                  <rect
                    x={cx - NODE_W / 2}
                    y={cy - NODE_H / 2}
                    width={NODE_W}
                    height={NODE_H}
                    rx={4}
                    fill={colors.fill}
                    stroke={colors.stroke}
                    strokeWidth={2}
                  />
                );
            }
          })();
          return (
            <g key={`n-${n.id}`}>
              {shape}
              <text
                x={cx}
                y={cy + 4}
                textAnchor="middle"
                fontSize={12}
                fontWeight={500}
                fill="#1f2937"
              >
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
