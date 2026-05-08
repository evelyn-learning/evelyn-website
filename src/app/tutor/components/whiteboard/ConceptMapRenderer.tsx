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
import { DIAGRAM_VIEWBOX, truncate, feat, featSlug, type FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';
import { ArrowMarkers, arrowMarkerId } from '@/lib/tutor/diagrams/arrows';
import { DiagramNotes } from '@/lib/tutor/diagrams/DiagramNotes';

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
  // Layout strategy: each connected component (or each level-0 root) gets its
  // OWN horizontal swim lane, sized proportionally to the component's widest
  // level. Within a lane, nodes are stacked top-to-bottom by level. This
  // prevents subtrees of different roots from interleaving (observed
  // 2026-05-08 AP Calc BC integration session: brain emitted two level-0
  // roots "Differentiation" and "Integration" with separate descendant
  // chains; the previous single-root BFS placed `accum` (under integ) on
  // the far left of row 2 and `rates` (under diff) in the center, so
  // diff→rates and integ→accum edges crossed through the middle nodes).
  // Coordinates returned in 0–100 normalized space.
  const pos = new Map<string, { x: number; y: number }>();
  if (nodes.length === 0) return pos;

  // Build adjacency (undirected for layout purposes).
  const adj = new Map<string, string[]>();
  nodes.forEach((n) => adj.set(n.id, []));
  for (const e of edges) {
    adj.get(e.from)?.push(e.to);
    adj.get(e.to)?.push(e.from);
  }

  // Per-node BFS-derived level + group index. Roots are seeded from
  // explicit `level: 0` nodes first (preserves brain intent when multiple
  // roots are declared), then any remaining unvisited node opens a new
  // group so disconnected components each get their own swim lane.
  const visited = new Set<string>();
  const rootGroup = new Map<string, number>();
  const level = new Map<string, number>();
  const startBFS = (rootId: string, groupIdx: number) => {
    const queue: string[] = [rootId];
    visited.add(rootId);
    rootGroup.set(rootId, groupIdx);
    level.set(rootId, 0);
    while (queue.length) {
      const id = queue.shift()!;
      const lv = level.get(id)!;
      for (const nb of adj.get(id) || []) {
        if (!visited.has(nb)) {
          visited.add(nb);
          rootGroup.set(nb, groupIdx);
          level.set(nb, lv + 1);
          queue.push(nb);
        }
      }
    }
  };
  let groupIdx = 0;
  for (const n of nodes) {
    if (n.level === 0 && !visited.has(n.id)) startBFS(n.id, groupIdx++);
  }
  for (const n of nodes) {
    if (!visited.has(n.id)) startBFS(n.id, groupIdx++);
  }

  // Build per-group level map. Explicit `n.level` overrides BFS level so the
  // brain can pin a node to a specific row (e.g. all level-0 roots stay in
  // row 0 even if their group's internal BFS would have placed them deeper).
  const groups = new Map<number, Map<number, string[]>>();
  for (const n of nodes) {
    const g = rootGroup.get(n.id) ?? 0;
    const lv = n.level ?? level.get(n.id) ?? 0;
    if (!groups.has(g)) groups.set(g, new Map());
    const gMap = groups.get(g)!;
    if (!gMap.has(lv)) gMap.set(lv, []);
    gMap.get(lv)!.push(n.id);
  }

  // Vertical: rows shared across all groups so level-0 nodes from any group
  // sit on the same y. Rows are the union of every group's levels.
  const allLevels = new Set<number>();
  for (const g of groups.values()) for (const lv of g.keys()) allLevels.add(lv);
  const sortedLevels = [...allLevels].sort((a, b) => a - b);
  const levelRowIdx = new Map(sortedLevels.map((lv, i) => [lv, i]));
  const rowCount = Math.max(1, sortedLevels.length);

  // Horizontal: each group's slot width is proportional to its widest level.
  // A {diff,rates} group (max 1 node per level) gets a narrow slot; a
  // {integ,accum,ex1,ex2,ex3} group (max 3 in level 2) gets a wider slot.
  const groupKeys = [...groups.keys()].sort((a, b) => a - b);
  const groupWeights: number[] = groupKeys.map((k) => {
    const g = groups.get(k)!;
    return Math.max(1, ...[...g.values()].map((ids) => ids.length));
  });
  const totalWeight = groupWeights.reduce((s, w) => s + w, 0) || 1;
  const TOTAL_WIDTH = 94;
  const START_X = 3;

  let cursorX = START_X;
  groupKeys.forEach((gKey, gIdx) => {
    const sliceWidth = (groupWeights[gIdx] / totalWeight) * TOTAL_WIDTH;
    const g = groups.get(gKey)!;
    sortedLevels.forEach((lv) => {
      const ids = g.get(lv);
      if (!ids || ids.length === 0) return;
      const rowIdx = levelRowIdx.get(lv)!;
      const baseY = 8 + (rowIdx + 0.5) * (84 / rowCount);
      // Dense rows (>= 4 siblings WITHIN a group) zigzag alternate nodes
      // into two sub-rows so two-line labels don't collide horizontally.
      const dense = ids.length >= 4;
      ids.forEach((id, colIdx) => {
        const staggerY = dense ? (colIdx % 2) * 14 : 0;
        const x = cursorX + (colIdx + 0.5) * (sliceWidth / ids.length);
        pos.set(id, { x, y: baseY + staggerY });
      });
    });
    cursorX += sliceWidth;
  });
  return pos;
}

/**
 * Pure manifest builder — enumerates the named features this renderer emits
 * for a given set of props. MUST stay in sync with the feat() calls below.
 * Called by the command handler before the React render so the tutor receives
 * authoritative names in the tool-result JSON and doesn't have to guess.
 */
export function buildConceptMapManifest(props: ConceptMapProps): FeatureManifestEntry[] {
  const entries: FeatureManifestEntry[] = [];
  const nodes = props.nodes ?? [];
  const edges = props.edges ?? [];
  const nodeIds = new Set(nodes.map((n) => n.id));
  const nodeById = new Map(nodes.map((n) => [n.id, n]));

  edges.forEach((e) => {
    if (!nodeIds.has(e.from) || !nodeIds.has(e.to)) return;
    const fromNode = nodeById.get(e.from);
    const toNode = nodeById.get(e.to);
    const fromLabel = fromNode?.label ?? e.from;
    const toLabel = toNode?.label ?? e.to;
    const name = `edge-${featSlug(e.from)}-to-${featSlug(e.to)}`;
    const labels = new Set<string>([
      name,
      `${e.from} → ${e.to}`,
      `${e.from}-to-${e.to}`,
      `edge from ${e.from} to ${e.to}`,
      `edge from ${fromLabel} to ${toLabel}`,
      `${fromLabel} to ${toLabel}`,
      `${fromLabel} → ${toLabel}`,
    ]);
    if (e.label) {
      labels.add(e.label);
      labels.add(e.label.toLowerCase());
      labels.add(`${fromLabel} ${e.label} ${toLabel}`);
    }
    entries.push({
      name,
      kind: 'edge',
      description: e.label
        ? `edge from "${e.from}" to "${e.to}" labeled "${e.label}"`
        : `edge from "${e.from}" to "${e.to}"`,
      labels: Array.from(labels),
    });
  });

  nodes.forEach((n) => {
    const labels = new Set<string>([
      `node-${featSlug(n.id)}`,
      n.id,
      n.label,
      n.label.toLowerCase(),
      `the ${n.label.toLowerCase()}`,
      `"${n.label}"`,
      `${n.label} concept`,
    ]);
    entries.push({
      name: `node-${featSlug(n.id)}`,
      kind: 'node',
      description: `concept node "${n.label}"`,
      labels: Array.from(labels),
    });
  });

  return entries;
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
          const eminX = Math.min(pa.x, pb.x); const emaxX = Math.max(pa.x, pb.x);
          const eminY = Math.min(pa.y, pb.y); const emaxY = Math.max(pa.y, pb.y);
          return (
            <g key={`edge${i}`} {...feat(`edge-${featSlug(e.from)}-to-${featSlug(e.to)}`, { cx: (pa.x + pb.x) / 2, cy: (pa.y + pb.y) / 2, w: Math.max(30, emaxX - eminX + 20), h: Math.max(30, emaxY - eminY + 20) })}>
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

        {/* Nodes. Multi-line labels: brain emits "Title\nSubtitle" expecting
            stacked rendering. Split on \n, truncate each line to ~18 chars,
            and render as <tspan>s. This dramatically reduces horizontal
            overlap on crowded rows (observed 2026-05-06 G3 light-and-sound
            session: 4 wide leaf nodes collided into unreadable bar). */}
        {nodes.map((n, i) => {
          const p = place(n);
          const color = n.color || cycleColor(i);
          const rawLines = (n.label ?? '').split(/\r?\n/);
          const lines = rawLines.map((l) => truncate(l.trim(), 18)).filter((l) => l.length > 0);
          if (lines.length === 0) lines.push('');
          const longest = Math.max(...lines.map((l) => l.length));
          const fontSize = 11;
          const lineH = 13;
          const rectW = Math.max(60, longest * 7);
          const rectH = Math.max(26, lines.length * lineH + 10);
          // First-line baseline: vertically center the block of lines.
          const firstBaseline = p.y - ((lines.length - 1) * lineH) / 2 + 4;
          return (
            <g key={n.id} {...feat(`node-${featSlug(n.id)}`, { cx: p.x, cy: p.y, w: rectW + 10, h: rectH + 10 })}>
              <rect x={p.x - rectW / 2} y={p.y - rectH / 2} width={rectW} height={rectH} rx={6}
                fill={withAlpha(color, 0.15)} stroke={color} strokeWidth={1.75} />
              <text
                x={p.x}
                y={firstBaseline}
                fontSize={fontSize}
                fill={DIAGRAM_COLORS.text}
                textAnchor="middle"
                fontWeight={700}
              >
                {lines.map((line, idx) => (
                  <tspan key={idx} x={p.x} dy={idx === 0 ? 0 : lineH}>{line}</tspan>
                ))}
              </text>
            </g>
          );
        })}
      </svg>
    <DiagramNotes notes={notes} />
    </div>
  );
}
