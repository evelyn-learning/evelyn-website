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
const DEFAULT_SVG_HEIGHT = 500;
const NODE_W = 120;
const NODE_H = 50;
// Minimum vertical gap between node centers. Decision diamonds are ~NODE_H*1.4
// tall, so 80 leaves room for arrows + optional edge labels without overlap.
const MIN_NODE_GAP = 80;
// Reserve enough pixel margin inside the SVG for node widths + edge labels.
// Horizontal padding is larger than vertical because back-edges route through
// a side channel outside the node cloud — reserving ~40px lets the channel
// sit comfortably without colliding with node borders or the SVG edge.
const FLOW_PADDING_X = NODE_W / 2 + 40; // = 100
const FLOW_PADDING_Y = 30;

const NODE_COLORS: Record<FlowchartNodeType, { fill: string; stroke: string }> = {
  start: { fill: '#d1fae5', stroke: '#059669' },
  end: { fill: '#fee2e2', stroke: '#dc2626' },
  process: { fill: '#dbeafe', stroke: '#2563eb' },
  decision: { fill: '#fef3c7', stroke: '#d97706' },
  io: { fill: '#ede9fe', stroke: '#7c3aed' },
};

/**
 * Build a content-to-SVG mapper that auto-fits the node bounding box inside
 * the viewBox (with padding accounting for node size). Preserves aspect ratio.
 */
function buildFlowMapper(
  nodes: FlowchartNode[],
  svgHeight: number,
): (x: number, y: number) => [number, number] {
  const positioned = nodes.filter((n) => n.x !== undefined && n.y !== undefined);
  if (positioned.length === 0) {
    return (x, y) => [
      FLOW_PADDING_X + (x / 100) * (SVG_WIDTH - 2 * FLOW_PADDING_X),
      FLOW_PADDING_Y + (y / 100) * (svgHeight - 2 * FLOW_PADDING_Y),
    ];
  }
  const xs = positioned.map((n) => n.x as number);
  const ys = positioned.map((n) => n.y as number);
  let minX = Math.min(...xs);
  let maxX = Math.max(...xs);
  let minY = Math.min(...ys);
  let maxY = Math.max(...ys);
  if (maxX - minX < 1) { minX -= 5; maxX += 5; }
  if (maxY - minY < 1) { minY -= 5; maxY += 5; }
  const rangeX = maxX - minX;
  const rangeY = maxY - minY;
  const innerW = SVG_WIDTH - 2 * FLOW_PADDING_X;
  const innerH = svgHeight - 2 * FLOW_PADDING_Y;
  // Use independent x / y scales so horizontal padding doesn't squash rows.
  // Flowcharts don't need aspect-ratio preservation — readability is what matters.
  const scaleX = innerW / rangeX;
  const scaleY = innerH / rangeY;
  const offsetX = (SVG_WIDTH - scaleX * rangeX) / 2;
  const offsetY = (svgHeight - scaleY * rangeY) / 2;
  return (x, y) => [offsetX + (x - minX) * scaleX, offsetY + (y - minY) * scaleY];
}

/**
 * Compute the SVG height required to render the given nodes without collision.
 * For top-down auto-layout with N nodes, we need at least N * MIN_NODE_GAP
 * pixels plus padding. Explicit-coordinate layouts use their y-range mapped
 * to pixels, with the same minimum.
 */
function computeSvgHeight(nodes: FlowchartNode[], layout: 'top-down' | 'left-right'): number {
  if (layout === 'left-right') return DEFAULT_SVG_HEIGHT;
  const positioned = nodes.filter((n) => n.x !== undefined && n.y !== undefined);
  if (positioned.length === 0) {
    // Auto top-down: one row per node
    const needed = nodes.length * MIN_NODE_GAP + 2 * FLOW_PADDING_Y;
    return Math.max(DEFAULT_SVG_HEIGHT, needed);
  }
  // Explicit coords: estimate unique y-levels for row count
  const yValues = positioned.map((n) => n.y as number).sort((a, b) => a - b);
  const levels: number[] = [];
  for (const y of yValues) {
    if (levels.length === 0 || y - levels[levels.length - 1] > 4) levels.push(y);
  }
  const needed = levels.length * MIN_NODE_GAP + 2 * FLOW_PADDING_Y;
  return Math.max(DEFAULT_SVG_HEIGHT, needed);
}

/**
 * Wrap a long node label into up to 2 lines so it fits inside the node
 * rectangle. Prefers breaking at `; ` (statement separators) or the space
 * nearest the midpoint; falls back to a mid-character split only for
 * long identifiers with no whitespace.
 */
function wrapLabel(label: string, maxCharsPerLine = 18): string[] {
  if (label.length <= maxCharsPerLine) return [label];
  const semiIdx = label.indexOf('; ');
  if (semiIdx > 0 && semiIdx < label.length - 2 && semiIdx + 1 <= maxCharsPerLine + 4) {
    return [label.slice(0, semiIdx + 1), label.slice(semiIdx + 2)];
  }
  const mid = Math.floor(label.length / 2);
  let bestIdx = -1;
  let bestDist = Infinity;
  for (let i = 0; i < label.length; i++) {
    if (label[i] === ' ') {
      const d = Math.abs(i - mid);
      if (d < bestDist) { bestDist = d; bestIdx = i; }
    }
  }
  if (bestIdx > 0) return [label.slice(0, bestIdx), label.slice(bestIdx + 1)];
  return [label.slice(0, mid), label.slice(mid)];
}

/** Horizontal half-width of a node for computing side connection points. */
function nodeHalfW(type: FlowchartNodeType): number {
  return type === 'decision' ? NODE_W * 0.65 : NODE_W / 2;
}

/** Vertical half-height of a node. */
function nodeHalfH(type: FlowchartNodeType): number {
  return type === 'decision' ? NODE_H * 0.7 : NODE_H / 2;
}

/**
 * Distance from the node's center to its boundary along a unit ray (ux, uy).
 * Treats the node as a rectangle of (halfW, halfH) — exact for rects/pills,
 * slightly loose for diamonds (bounding-box approximation, 10-15% outside
 * the true diamond edge for diagonal exits).
 */
function extentInDirection(halfW: number, halfH: number, ux: number, uy: number): number {
  const tx = Math.abs(ux) > 0.001 ? halfW / Math.abs(ux) : Infinity;
  const ty = Math.abs(uy) > 0.001 ? halfH / Math.abs(uy) : Infinity;
  return Math.min(tx, ty);
}

/**
 * Does the line segment from p1 to p2 pass through the axis-aligned rectangle
 * defined by [rectMin, rectMax]? Liang-Barsky slab test. Used to detect when
 * a "straight" edge would visually collide with an intermediate node.
 */
function segmentIntersectsRect(
  p1: [number, number],
  p2: [number, number],
  rectMin: [number, number],
  rectMax: [number, number],
): boolean {
  const [x1, y1] = p1;
  const [x2, y2] = p2;
  const [rx1, ry1] = rectMin;
  const [rx2, ry2] = rectMax;
  const dx = x2 - x1;
  const dy = y2 - y1;
  let tmin = 0;
  let tmax = 1;
  if (Math.abs(dx) < 0.001) {
    if (x1 < rx1 || x1 > rx2) return false;
  } else {
    const t1 = (rx1 - x1) / dx;
    const t2 = (rx2 - x1) / dx;
    tmin = Math.max(tmin, Math.min(t1, t2));
    tmax = Math.min(tmax, Math.max(t1, t2));
    if (tmin > tmax) return false;
  }
  if (Math.abs(dy) < 0.001) {
    if (y1 < ry1 || y1 > ry2) return false;
  } else {
    const t1 = (ry1 - y1) / dy;
    const t2 = (ry2 - y1) / dy;
    tmin = Math.max(tmin, Math.min(t1, t2));
    tmax = Math.min(tmax, Math.max(t1, t2));
    if (tmin > tmax) return false;
  }
  return true;
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
  const svgHeight = computeSvgHeight(laidOut, layout);
  const toSvg = buildFlowMapper(laidOut, svgHeight);
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
        viewBox={`0 0 ${SVG_WIDTH} ${svgHeight}`}
        className="w-full h-auto"
        style={{ maxWidth: SVG_WIDTH, maxHeight: svgHeight }}
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
        <rect width={SVG_WIDTH} height={svgHeight} fill="#fafbfc" rx={4} />

        {/* Edges (drawn first so nodes paint over them).
            Back-edges (loop-backs) use orthogonal routing around a channel
            outside the node cloud so they don't cut through other nodes. */}
        {edges.map((e, i) => {
          const from = posMap.get(e.from);
          const to = posMap.get(e.to);
          if (!from || !to) return null;
          const fromNode = laidOut.find((n) => n.id === e.from);
          const toNode = laidOut.find((n) => n.id === e.to);
          const [x1, y1] = from;
          const [x2, y2] = to;
          const startHalfH = fromNode?.type === 'decision' ? NODE_H * 0.7 : NODE_H / 2;
          const endHalfH = toNode?.type === 'decision' ? NODE_H * 0.7 : NODE_H / 2;
          const startHalfW = nodeHalfW(fromNode?.type ?? 'process');
          const endHalfW = nodeHalfW(toNode?.type ?? 'process');

          // Back-edge: target is above the source (10px tolerance absorbs
          // cases where the model places loop source and target at y values
          // that diff by exactly the node-spacing quantum).
          const isBackEdge = y2 < y1 - 10;

          // Pass-through detection: does the straight A→B line cut through
          // any OTHER node's bounding box? Common case: a long vertical edge
          // that skips over intermediate spine nodes (e.g. loopCond →
          // returnNotFound passing through midCalc / eqCheck / gtCheck).
          // Such edges need the same side-channel detour as back-edges,
          // otherwise they stack on the spine and their labels collide.
          let passesThroughNode = false;
          for (const n of laidOut) {
            if (n.id === e.from || n.id === e.to) continue;
            const pos = posMap.get(n.id);
            if (!pos) continue;
            const [nx, ny] = pos;
            const hw = nodeHalfW(n.type);
            const hh = nodeHalfH(n.type);
            // Shrink the rect slightly so we only flag real overlaps, not
            // edges that just barely graze a node corner.
            const shrink = 4;
            if (
              segmentIntersectsRect(
                [x1, y1],
                [x2, y2],
                [nx - hw + shrink, ny - hh + shrink],
                [nx + hw - shrink, ny + hh - shrink],
              )
            ) {
              passesThroughNode = true;
              break;
            }
          }

          const needsDetour = isBackEdge || passesThroughNode;

          if (needsDetour) {
            // Side selection: if the TARGET has outgoing forward edges going
            // to the right (or left), that side is "claimed" by the forward
            // branch — route the detour on the OPPOSITE side to avoid the
            // loop-back arrow colliding with the yes/no branch arrow.
            let targetRightOccupied = false;
            let targetLeftOccupied = false;
            for (const edge of edges) {
              if (edge.from !== e.to) continue;
              const destPos = posMap.get(edge.to);
              if (!destPos) continue;
              if (destPos[0] > x2 + 5) targetRightOccupied = true;
              if (destPos[0] < x2 - 5) targetLeftOccupied = true;
            }
            let useRight: boolean;
            if (targetRightOccupied && !targetLeftOccupied) useRight = false;
            else if (targetLeftOccupied && !targetRightOccupied) useRight = true;
            else useRight = x1 >= x2;

            const sourceExitX = useRight ? x1 + startHalfW : x1 - startHalfW;
            const sourceExitY = y1;
            const targetEntryX = useRight ? x2 + endHalfW : x2 - endHalfW;
            const targetEntryY = y2;

            // Channel column: just outside the furthest endpoint on the chosen
            // side, clamped inside the SVG. Using only the edge's endpoints
            // (not ALL nodes) keeps the detour short.
            const channelGap = 20;
            const safeMargin = 6;
            let channelX = useRight
              ? Math.max(sourceExitX, targetEntryX) + channelGap
              : Math.min(sourceExitX, targetEntryX) - channelGap;
            channelX = Math.max(safeMargin, Math.min(SVG_WIDTH - safeMargin, channelX));

            // Shorten the final horizontal segment so the arrowhead sits just
            // outside the target node.
            const arrowGap = 8;
            const arrowTipX = useRight ? targetEntryX + arrowGap : targetEntryX - arrowGap;

            // Build the polyline: exit side → channel corner → up → enter corner → arrow tip
            const pts = [
              [sourceExitX, sourceExitY],
              [channelX, sourceExitY],
              [channelX, targetEntryY],
              [arrowTipX, targetEntryY],
            ];
            const pathD = `M ${pts[0][0]},${pts[0][1]} L ${pts[1][0]},${pts[1][1]} L ${pts[2][0]},${pts[2][1]} L ${pts[3][0]},${pts[3][1]}`;

            // Label sits on the vertical channel segment, midway between the two turns.
            const labelX = channelX;
            const labelY = (sourceExitY + targetEntryY) / 2;

            return (
              <g key={`e-${i}`}>
                <path
                  d={pathD}
                  fill="none"
                  stroke="#475569"
                  strokeWidth={1.5}
                  markerEnd="url(#fc-arrow)"
                />
                {e.label && (
                  <g>
                    <rect
                      x={labelX - 14}
                      y={labelY - 8}
                      width={28}
                      height={14}
                      rx={3}
                      fill="#fafbfc"
                      stroke="#cbd5e1"
                      strokeWidth={0.5}
                    />
                    <text
                      x={labelX}
                      y={labelY + 3}
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
          }

          // Straight edge (default for forward flow).
          const dx = x2 - x1;
          const dy = y2 - y1;
          const len = Math.sqrt(dx * dx + dy * dy) || 1;
          const ux = dx / len;
          const uy = dy / len;
          // Use direction-dependent extent so horizontal edges exit the side
          // of the node and vertical edges exit the top/bottom — not vice versa.
          const shrinkStart = extentInDirection(startHalfW, startHalfH, ux, uy) + 2;
          const shrinkEnd = extentInDirection(endHalfW, endHalfH, ux, uy) + 8;
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
          const lines = wrapLabel(n.label);
          // Center multi-line labels vertically on cy.
          const lineHeight = 14;
          const firstLineY = cy + 4 - ((lines.length - 1) * lineHeight) / 2;
          return (
            <g key={`n-${n.id}`}>
              {shape}
              <text
                x={cx}
                y={firstLineY}
                textAnchor="middle"
                fontSize={12}
                fontWeight={500}
                fill="#1f2937"
              >
                {lines.map((line, idx) => (
                  <tspan key={idx} x={cx} dy={idx === 0 ? 0 : lineHeight}>
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
