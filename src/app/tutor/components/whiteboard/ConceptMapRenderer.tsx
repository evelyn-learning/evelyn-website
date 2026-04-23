'use client';

/**
 * Concept Map Renderer
 *
 * Nodes with labeled edges, laid out either hierarchically (tree-ish) or on
 * a force-free fixed grid. Used for brainstorming, vocabulary webs, theme
 * maps, and cross-topic concept linking.
 *
 * Layout strategy:
 *   - If every node has explicit {x, y} (0–100 normalized), honor them.
 *   - Otherwise fall back to a BFS-layered layout rooted at the first node
 *     (or the node declared level=0). This keeps the LLM from needing to
 *     produce pixel-perfect coordinates for simple cases.
 */

import React from 'react';
import { DIAGRAM_COLORS, cycleColor, withAlpha } from '@/lib/tutor/diagrams/theme';
import { DIAGRAM_VIEWBOX, truncate } from '@/lib/tutor/diagrams/layout';
import { ArrowMarkers, arrowMarkerId } from '@/lib/tutor/diagrams/arrows';

export interface ConceptNode {
  id: string;
  label: string;
  /** Optional 0–100 normalized coords. If present for all nodes, used directly. */
  x?: number;
  y?: number;
  color?: string;
  /** Optional explicit BFS level (root = 0) when auto-laying out. */
  level?: number;
}

export interface ConceptEdge {
  from: string;
  to: string;
  label?: string;
  /** If true, the edge is directed (arrowhead on `to`). */
  directed?: boolean;
  color?: string;
}

export interface ConceptMapProps {
  title?: string;
  nodes: ConceptNode[];
  edges?: ConceptEdge[];
  notes?: string;
}

const VIEWBOX_W = DIAGRAM_VIEWBOX.width;
const VIEWBOX_H = DIAGRAM_VIEWBOX.height;

function autoLayout(nodes: ConceptNode[], edges: ConceptEdge[]): Map<string, { x: number; y: number }> {
  // BFS from the first node (or the one declared level 0) if edges exist,
  // else just grid-pack. Coordinates returned in 0–100 normalized space.
  const pos = new Map<string, { x: number; y: number }>();
  if (nodes.length === 0) return pos;

  // Build adjacency (undirected for layout purposes).
  const adj = new Map<string, string[]>();
  nodes.forEach((n) => adj.set(n.id, []));
  for (const e of edges) {
    adj.get(e.from)?.push(e.to);
    adj.get(e.to)?.push(e.from);
  }

  // Figure out per-node level via BFS.
  const level = new Map<string, number>();
  const explicit = nodes.find((n) => typeof n.level === 'number' && n.level === 0);
  const root = (explicit || nodes[0]).id;
  const queue: string[] = [root];
  level.set(root, 0);
  while (queue.length) {
    const id = queue.shift()!;
    const lv = level.get(id)!;
    for (const nb of adj.get(id) || []) {
      if (!level.has(nb)) {
        level.set(nb, lv + 1);
        queue.push(nb);
      }
    }
  }
  // Any disconnected nodes: park at last level.
  const maxLv = Math.max(0, ...Array.from(level.values()));
  for (const n of nodes) {
    if (!level.has(n.id)) level.set(n.id, maxLv + 1);
  }
  const levels = new Map<number, string[]>();
  for (const n of nodes) {
    const lv = n.level ?? level.get(n.id) ?? 0;
    if (!levels.has(lv)) levels.set(lv, []);
    levels.get(lv)!.push(n.id);
  }
  const sortedLevels = Array.from(levels.keys()).sort((a, b) => a - b);
  const rowCount = sortedLevels.length;
  sortedLevels.forEach((lv, rowIdx) => {
    const ids = levels.get(lv)!;
    const y = 10 + (rowIdx + 0.5) * (80 / rowCount);
    ids.forEach((id, colIdx) => {
      const x = 10 + (colIdx + 0.5) * (80 / ids.length);
      pos.set(id, { x, y });
    });
  });
  return pos;
}

export default function ConceptMapRenderer({ title, nodes, edges = [], notes }: ConceptMapProps) {
  if (!nodes || nodes.length === 0) {
    return <div style={{ padding: 24, color: DIAGRAM_COLORS.muted, fontStyle: 'italic' }}>No concept nodes.</div>;
  }

  const pad = { top: title ? 36 : 18, bottom: notes ? 28 : 16, left: 14, right: 14 };
  const w = VIEWBOX_W - pad.left - pad.right;
  const h = VIEWBOX_H - pad.top - pad.bottom;

  const explicitLayout = nodes.every((n) => typeof n.x === 'number' && typeof n.y === 'number');
  const positions = explicitLayout ? null : autoLayout(nodes, edges);

  const place = (n: ConceptNode) => {
    let nx = 50, ny = 50;
    if (explicitLayout) { nx = n.x!; ny = n.y!; }
    else {
      const p = positions!.get(n.id);
      if (p) { nx = p.x; ny = p.y; }
    }
    return { x: pad.left + (nx / 100) * w, y: pad.top + (ny / 100) * h };
  };

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  return (
    <div style={{ padding: 12, background: 'white', borderRadius: 6 }}>
      {title && (
        <div style={{ textAlign: 'center', fontWeight: 600, fontSize: 16, marginBottom: 6, color: DIAGRAM_COLORS.text }}>{title}</div>
      )}
      <svg viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', maxHeight: 400 }}>
        <ArrowMarkers idPrefix="cm-arrow" />

        {/* Edges. When several edges radiate from the same node their
            midpoints cluster — stagger each label's position along the edge
            so the background rects don't all stack on top of each other. */}
        {edges.map((e, i) => {
          const a = nodeMap.get(e.from); const b = nodeMap.get(e.to);
          if (!a || !b) return null;
          const pa = place(a); const pb = place(b);
          const color = e.color || DIAGRAM_COLORS.muted;
          const t = 0.3 + ((i * 7) % 5) * 0.09; // spread over [0.30, 0.66]
          const mx = pa.x + (pb.x - pa.x) * t;
          const my = pa.y + (pb.y - pa.y) * t;
          // Size the background rect to fit the actual label at fontSize 10
          // (≈ 6.2 px per char + 10 px padding). The previous estimate was
          // too narrow and clipped the text.
          const labelW = e.label ? e.label.length * 6.4 + 14 : 0;
          return (
            <g key={`edge${i}`}>
              <line x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} stroke={color} strokeWidth={1.25}
                markerEnd={e.directed ? `url(#${arrowMarkerId(color, 'cm-arrow')})` : undefined} />
              {e.label && (
                <g>
                  <rect x={mx - labelW / 2} y={my - 8} width={labelW} height={14} rx={3}
                    fill="white" stroke={DIAGRAM_COLORS.border} strokeWidth={0.5} />
                  <text x={mx} y={my + 2} fontSize={10} fill={DIAGRAM_COLORS.text} textAnchor="middle">{e.label}</text>
                </g>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map((n, i) => {
          const p = place(n);
          const color = n.color || cycleColor(i);
          const label = truncate(n.label, 22);
          const rectW = Math.max(60, label.length * 7);
          const rectH = 26;
          return (
            <g key={n.id}>
              <rect x={p.x - rectW / 2} y={p.y - rectH / 2} width={rectW} height={rectH} rx={6}
                fill={withAlpha(color, 0.15)} stroke={color} strokeWidth={1.75} />
              <text x={p.x} y={p.y + 4} fontSize={11} fill={DIAGRAM_COLORS.text} textAnchor="middle" fontWeight={700}>{label}</text>
            </g>
          );
        })}

        {notes && (
          <text x={VIEWBOX_W / 2} y={VIEWBOX_H - 8} fontSize={11} fill={DIAGRAM_COLORS.muted} textAnchor="middle" fontStyle="italic">{notes}</text>
        )}
      </svg>
    </div>
  );
}
