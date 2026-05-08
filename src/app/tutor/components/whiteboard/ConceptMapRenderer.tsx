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
import { DIAGRAM_VIEWBOX, feat, featSlug, type FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';
import { ArrowMarkers, arrowMarkerId } from '@/lib/tutor/diagrams/arrows';
import { DiagramNotes } from '@/lib/tutor/diagrams/DiagramNotes';

// Wrap a label that exceeds softMax onto two lines, picking the split that
// minimizes max(leftLen, rightLen) across all space positions. Does NOT
// truncate afterward — the box widens to fit the longer half. Replaces the
// previous `truncate(line, 18)` rule that was too aggressive for AP-level
// concept names like "Fundamental Theorem of Calculus" (still got "..." on
// the second line because the post-split right side was truncated to 18
// chars). softMax is a soft preference; long single-word labels or long
// half-strings render as-is.
function wrapLabel(line: string, softMax: number): string[] {
  const trimmed = line.trim();
  if (trimmed.length <= softMax) return [trimmed];
  const spaces: number[] = [];
  for (let i = 0; i < trimmed.length; i++) if (trimmed[i] === ' ') spaces.push(i);
  if (spaces.length === 0) return [trimmed];
  let bestSplit = spaces[0];
  let bestMax = Math.max(bestSplit, trimmed.length - bestSplit - 1);
  for (const sp of spaces) {
    const leftLen = sp;
    const rightLen = trimmed.length - sp - 1;
    const m = Math.max(leftLen, rightLen);
    if (m < bestMax) {
      bestMax = m;
      bestSplit = sp;
    }
  }
  const left = trimmed.slice(0, bestSplit).trim();
  const right = trimmed.slice(bestSplit + 1).trim();
  return [left, right];
}

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

  // Per-row weights: rows with a single node (across all groups) get less
  // vertical space than dense multi-node rows. R5 follow-up: weight reduced
  // 0.6 → 0.4 so a lone row-0 hub sits even closer to the top instead of
  // leaving a visible band above it.
  const rowWeights = sortedLevels.map((lv) => {
    let totalInRow = 0;
    for (const g of groups.values()) totalInRow += (g.get(lv)?.length ?? 0);
    return totalInRow <= 1 ? 0.4 : 1.0;
  });
  const totalRowWeight = rowWeights.reduce((s, w) => s + w, 0) || 1;
  // Cumulative y-start (0..totalRowWeight) for each row, used to compute baseY.
  const rowCumStart: number[] = [];
  let acc = 0;
  for (let i = 0; i < rowWeights.length; i++) {
    rowCumStart.push(acc);
    acc += rowWeights[i];
  }
  // Vertical band: full 0..100% of the plot height (R5 follow-up — was
  // 4..96; the residual 4% top inset compounded with pad.top to leave a
  // visible empty band above the first row).
  const Y_START = 0;
  const Y_RANGE = 100;

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
      const yMid = rowCumStart[rowIdx] + rowWeights[rowIdx] / 2;
      const baseY = Y_START + (yMid / totalRowWeight) * Y_RANGE;
      // Dense rows (>= 5 siblings WITHIN a group) zigzag alternate nodes
      // into two sub-rows so two-line labels don't collide horizontally.
      // Threshold moved 4 → 5 (R6 follow-up): with the min-max wrapLabel
      // producing narrower 2-line boxes, 4 nodes per row fit flat without
      // collision; the 4-node zigzag was creating visible alternating-height
      // staircase chaos for no real benefit.
      const dense = ids.length >= 5;
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

  // Issue 6 + R5 follow-up: minimal top padding so the first row sits
  // immediately under the HTML title instead of leaving a wide empty band.
  const pad = { top: 12, bottom: notes ? 28 : 16, left: 14, right: 14 };
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

  // Pre-compute per-node render dimensions so edges can do collision checks
  // against actual node boxes (Issue 3) and route around them (Issue 5).
  // Node label wrapping (Issue 1) lives here so wrapped multi-line widths
  // are reflected in box sizes everywhere downstream.
  const NODE_FONT_SIZE = 11;
  const NODE_LINE_H = 13;
  const NODE_MAX_CHARS = 18;
  type NodeDims = { lines: string[]; rectW: number; rectH: number };
  const dimsById = new Map<string, NodeDims>();
  nodes.forEach((n) => {
    const rawLines = (n.label ?? '').split(/\r?\n/);
    const lines = rawLines.flatMap((l) => wrapLabel(l, NODE_MAX_CHARS)).filter((l) => l.length > 0);
    if (lines.length === 0) lines.push('');
    const longest = Math.max(...lines.map((l) => l.length));
    const rectW = Math.max(60, longest * 7);
    const rectH = Math.max(26, lines.length * NODE_LINE_H + 10);
    dimsById.set(n.id, { lines, rectW, rectH });
  });

  // Issue 2: spread edge labels per source node, not by global emit order.
  // When N edges fan out from the same hub, their labels space evenly
  // around the hub instead of converging near the targets.
  const edgesBySource = new Map<string, number[]>();
  edges.forEach((e, i) => {
    const arr = edgesBySource.get(e.from) ?? [];
    arr.push(i);
    edgesBySource.set(e.from, arr);
  });
  const localSourceIdx = new Map<number, number>();
  edgesBySource.forEach((indices) => {
    indices.forEach((globalIdx, localIdx) => localSourceIdx.set(globalIdx, localIdx));
  });

  // Issue 4: distribute incoming-edge entry points around target node so
  // arrowheads from multiple sources don't stack on the same pixel. For
  // each target with ≥2 incoming edges, sort by approach angle and offset
  // each entry point along the perpendicular to its source-target line.
  // Step size widened from 8 → 14 (R4 follow-up — 8 was too tight when
  // sources approached at near-symmetric angles).
  const incomingByTarget = new Map<string, Array<{ edgeIdx: number; angle: number }>>();
  edges.forEach((e, i) => {
    const a = nodeMap.get(e.from); const b = nodeMap.get(e.to);
    if (!a || !b) return;
    const pa = place(a); const pb = place(b);
    const angle = Math.atan2(pa.y - pb.y, pa.x - pb.x);
    const arr = incomingByTarget.get(e.to) ?? [];
    arr.push({ edgeIdx: i, angle });
    incomingByTarget.set(e.to, arr);
  });
  const entryOffset = new Map<number, { dx: number; dy: number }>();
  incomingByTarget.forEach((arr) => {
    if (arr.length <= 1) return;
    arr.sort((x, y) => x.angle - y.angle);
    arr.forEach((item, i) => {
      const offset = (i - (arr.length - 1) / 2) * 14;
      const e = edges[item.edgeIdx];
      const a = nodeMap.get(e.from); const b = nodeMap.get(e.to);
      if (!a || !b) return;
      const pa = place(a); const pb = place(b);
      const dx = pa.x - pb.x;
      const dy = pa.y - pb.y;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      entryOffset.set(item.edgeIdx, { dx: (-dy / len) * offset, dy: (dx / len) * offset });
    });
  });

  // R3 + R7 follow-up: detect segment crossings between edge pairs and
  // force-curve both halves with EXPLICIT OPPOSITE bow signs so they route
  // around opposite sides of the intersection. The previous "bow toward
  // farther viewBox edge" heuristic was symmetric for crossing pairs —
  // both edges could pick perpendiculars on the same side and stay tangled.
  // For each crossing pair, the edge with smaller midpoint x gets sign -1
  // (bow with +perp = (-dy, dx)/len negated → leftward), the other +1
  // (rightward). Edges in multiple crossing pairs keep the first sign set;
  // worst case they remain partially tangled, but the typical case (one
  // crossing pair) cleanly separates.
  const forceCurve = new Set<number>();
  const crossingBowSign = new Map<number, 1 | -1>();
  const ccw = (Ax: number, Ay: number, Bx: number, By: number, Cx: number, Cy: number) =>
    (Cy - Ay) * (Bx - Ax) > (By - Ay) * (Cx - Ax);
  for (let i = 0; i < edges.length; i++) {
    const eA = edges[i];
    const aA = nodeMap.get(eA.from); const bA = nodeMap.get(eA.to);
    if (!aA || !bA) continue;
    const paA = place(aA); const pbA = place(bA);
    for (let j = i + 1; j < edges.length; j++) {
      const eB = edges[j];
      if (eA.from === eB.from || eA.from === eB.to || eA.to === eB.from || eA.to === eB.to) continue;
      const aB = nodeMap.get(eB.from); const bB = nodeMap.get(eB.to);
      if (!aB || !bB) continue;
      const paB = place(aB); const pbB = place(bB);
      const cross =
        ccw(paA.x, paA.y, paB.x, paB.y, pbB.x, pbB.y) !== ccw(pbA.x, pbA.y, paB.x, paB.y, pbB.x, pbB.y) &&
        ccw(paA.x, paA.y, pbA.x, pbA.y, paB.x, paB.y) !== ccw(paA.x, paA.y, pbA.x, pbA.y, pbB.x, pbB.y);
      if (cross) {
        forceCurve.add(i);
        forceCurve.add(j);
        const midA = (paA.x + pbA.x) / 2;
        const midB = (paB.x + pbB.x) / 2;
        const aSign: 1 | -1 = midA <= midB ? -1 : 1;
        const bSign: 1 | -1 = midA <= midB ? 1 : -1;
        if (!crossingBowSign.has(i)) crossingBowSign.set(i, aSign);
        if (!crossingBowSign.has(j)) crossingBowSign.set(j, bSign);
      }
    }
  }

  // Issue 5: curve edges that span 2+ rows so they don't slice through
  // intermediate-row nodes. Determine row span by comparing positions: any
  // edge whose absolute y-delta is more than ~1.5 rows is treated as long.
  // Bow direction = the perpendicular side that's farther from the viewBox
  // center (so long edges arc outward, away from densely-populated rows).
  const VIEWBOX_CENTER_X = VIEWBOX_W / 2;
  const VIEWBOX_CENTER_Y = VIEWBOX_H / 2;
  const ROW_HEIGHT_PX = h / Math.max(1, new Set(nodes.map((n) => n.level)).size || 1);

  // Issue 3 + R2 follow-up: label-vs-node AND label-vs-label collision
  // avoidance. After computing initial (mx, my), check every unrelated
  // node's bbox AND every previously-placed label's rect; slide along
  // the edge until clear. Earlier edges (lower index) get priority; later
  // edges accommodate.
  const placedLabelRects: Array<{ x: number; y: number; w: number; h: number }> = [];
  const rectsOverlap = (
    ax: number, ay: number, aw: number, ah: number,
    bx: number, by: number, bw: number, bh: number,
  ): boolean => {
    return (
      ax + aw / 2 > bx - bw / 2 &&
      ax - aw / 2 < bx + bw / 2 &&
      ay + ah / 2 > by - bh / 2 &&
      ay - ah / 2 < by + bh / 2
    );
  };
  const labelCollides = (
    edge: ConceptEdge,
    lx: number, ly: number, lw: number, lh: number,
  ): boolean => {
    // Node bboxes (with 2px outward padding).
    for (const n of nodes) {
      if (n.id === edge.from || n.id === edge.to) continue;
      const np = place(n);
      const dims = dimsById.get(n.id)!;
      if (rectsOverlap(lx, ly, lw, lh, np.x, np.y, dims.rectW + 4, dims.rectH + 4)) return true;
    }
    // Other labels already placed this render.
    for (const r of placedLabelRects) {
      if (rectsOverlap(lx, ly, lw, lh, r.x, r.y, r.w + 4, r.h + 4)) return true;
    }
    return false;
  };

  return (
    <div style={{ padding: 12, background: 'white', borderRadius: 6 }}>
      {title && (
        <div style={{ textAlign: 'center', fontWeight: 600, fontSize: 16, marginBottom: 6, color: DIAGRAM_COLORS.text }}>{title}</div>
      )}
      <svg viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', maxHeight: 400 }}>
        <ArrowMarkers idPrefix="cm-arrow" />

        {edges.map((e, i) => {
          const a = nodeMap.get(e.from); const b = nodeMap.get(e.to);
          if (!a || !b) return null;
          const pa = place(a); const pb = place(b);
          const color = e.color || DIAGRAM_COLORS.muted;
          // Issue 4: shift edge endpoint by perpendicular offset.
          const off = entryOffset.get(i) ?? { dx: 0, dy: 0 };
          const x2 = pb.x + off.dx;
          const y2 = pb.y + off.dy;

          // Issue 5 + R3: curve long edges away from viewBox center.
          // Triggers: y-span > 1.5 row heights OR detected segment crossing.
          const longEdge = Math.abs(pb.y - pa.y) > ROW_HEIGHT_PX * 1.5 || forceCurve.has(i);
          let pathD: string;
          let labelMidX: number;
          let labelMidY: number;
          if (longEdge) {
            const midX = (pa.x + x2) / 2;
            const midY = (pa.y + y2) / 2;
            const dx = x2 - pa.x;
            const dy = y2 - pa.y;
            const len = Math.sqrt(dx * dx + dy * dy) || 1;
            const px = -dy / len;
            const py = dx / len;
            const bow = 28;
            const sign = crossingBowSign.get(i);
            let ctrl: { x: number; y: number };
            if (sign !== undefined) {
              // Crossing pair: explicit opposite-side bow guarantees the
              // two crossing edges route around opposite sides of the
              // intersection point and don't tangle.
              ctrl = { x: midX + px * sign * bow, y: midY + py * sign * bow };
            } else {
              // Non-crossing curved edge: pick the perpendicular farther
              // from viewBox center so the curve arcs outward through
              // empty space rather than through dense rows.
              const cand1 = { x: midX + px * bow, y: midY + py * bow };
              const cand2 = { x: midX - px * bow, y: midY - py * bow };
              const d1 = (cand1.x - VIEWBOX_CENTER_X) ** 2 + (cand1.y - VIEWBOX_CENTER_Y) ** 2;
              const d2 = (cand2.x - VIEWBOX_CENTER_X) ** 2 + (cand2.y - VIEWBOX_CENTER_Y) ** 2;
              ctrl = d1 > d2 ? cand1 : cand2;
            }
            pathD = `M ${pa.x} ${pa.y} Q ${ctrl.x} ${ctrl.y} ${x2} ${y2}`;
            // Approximate the quadratic Bézier midpoint at t=0.5:
            // P(0.5) = 0.25*P0 + 0.5*P1 + 0.25*P2.
            labelMidX = 0.25 * pa.x + 0.5 * ctrl.x + 0.25 * x2;
            labelMidY = 0.25 * pa.y + 0.5 * ctrl.y + 0.25 * y2;
          } else {
            pathD = `M ${pa.x} ${pa.y} L ${x2} ${y2}`;
            labelMidX = (pa.x + x2) / 2;
            labelMidY = (pa.y + y2) / 2;
          }

          // Issue 8: roomier label rect so KaTeX/sans labels don't clip.
          const labelW = e.label ? e.label.length * 7.0 + 18 : 0;
          const labelH = 16;

          // Issue 2 + R2 follow-up: per-source-relative position along the
          // edge so labels from a hub fan around the source rather than
          // converging near targets. Spread step widened from 0.06 → 0.18
          // so two labels from a 2-edge hub (e.g. Calculus → Diff/Integ)
          // don't end up at near-identical y-coords. Range [0.22, 0.76].
          const localIdx = localSourceIdx.get(i) ?? 0;
          const baseT = 0.22 + (localIdx % 4) * 0.18;

          // Issue 3: try the per-source position first; if it would collide
          // with another node, walk t outward until clear (or fall back to
          // baseT if no clear slot found).
          let lx = labelMidX;
          let ly = labelMidY;
          if (e.label) {
            const tryT = (tVal: number): { x: number; y: number } => {
              if (longEdge) {
                // Re-evaluate quadratic Bézier at tVal using the SAME ctrl
                // derivation as the path render above (crossing-pair sign
                // takes precedence; otherwise farther-from-center).
                const dx = x2 - pa.x;
                const dy = y2 - pa.y;
                const len = Math.sqrt(dx * dx + dy * dy) || 1;
                const px = -dy / len;
                const py = dx / len;
                const bow = 28;
                const midX = (pa.x + x2) / 2;
                const midY = (pa.y + y2) / 2;
                const sign = crossingBowSign.get(i);
                let c: { x: number; y: number };
                if (sign !== undefined) {
                  c = { x: midX + px * sign * bow, y: midY + py * sign * bow };
                } else {
                  const cand1 = { x: midX + px * bow, y: midY + py * bow };
                  const cand2 = { x: midX - px * bow, y: midY - py * bow };
                  const d1 = (cand1.x - VIEWBOX_CENTER_X) ** 2 + (cand1.y - VIEWBOX_CENTER_Y) ** 2;
                  const d2 = (cand2.x - VIEWBOX_CENTER_X) ** 2 + (cand2.y - VIEWBOX_CENTER_Y) ** 2;
                  c = d1 > d2 ? cand1 : cand2;
                }
                const u = 1 - tVal;
                return {
                  x: u * u * pa.x + 2 * u * tVal * c.x + tVal * tVal * x2,
                  y: u * u * pa.y + 2 * u * tVal * c.y + tVal * tVal * y2,
                };
              }
              return { x: pa.x + (x2 - pa.x) * tVal, y: pa.y + (y2 - pa.y) * tVal };
            };
            const candidates = [baseT, baseT + 0.10, baseT - 0.06, baseT + 0.20, baseT - 0.12, baseT + 0.30, baseT - 0.18];
            let resolved = tryT(baseT);
            for (const tv of candidates) {
              if (tv < 0.18 || tv > 0.82) continue;
              const p = tryT(tv);
              if (!labelCollides(e, p.x, p.y, labelW, labelH)) {
                resolved = p;
                break;
              }
            }
            lx = resolved.x;
            ly = resolved.y;
            // Track this label's rect so subsequent edges avoid it. Always
            // record (even if no clear position found) so collisions remain
            // bounded and we don't pile labels at the fallback baseT spot.
            placedLabelRects.push({ x: lx, y: ly, w: labelW, h: labelH });
          }

          const eminX = Math.min(pa.x, x2); const emaxX = Math.max(pa.x, x2);
          const eminY = Math.min(pa.y, y2); const emaxY = Math.max(pa.y, y2);
          return (
            <g key={`edge${i}`} {...feat(`edge-${featSlug(e.from)}-to-${featSlug(e.to)}`, { cx: (pa.x + x2) / 2, cy: (pa.y + y2) / 2, w: Math.max(30, emaxX - eminX + 20), h: Math.max(30, emaxY - eminY + 20) })}>
              <path d={pathD} fill="none" stroke={color} strokeWidth={1.25}
                markerEnd={e.directed ? `url(#${arrowMarkerId(color, 'cm-arrow')})` : undefined} />
              {e.label && (
                <g>
                  <rect x={lx - labelW / 2} y={ly - labelH / 2} width={labelW} height={labelH} rx={3}
                    fill="white" stroke={DIAGRAM_COLORS.border} strokeWidth={0.5} />
                  <text x={lx} y={ly + 3} fontSize={10} fill={DIAGRAM_COLORS.text} textAnchor="middle">{e.label}</text>
                </g>
              )}
            </g>
          );
        })}

        {/* Nodes. Multi-line labels: brain emits "Title\nSubtitle" expecting
            stacked rendering. wrapLabel handles long single-line labels by
            splitting at the closest-to-middle space (Issue 1). */}
        {nodes.map((n, i) => {
          const p = place(n);
          const color = n.color || cycleColor(i);
          const dims = dimsById.get(n.id)!;
          const { lines, rectW, rectH } = dims;
          const firstBaseline = p.y - ((lines.length - 1) * NODE_LINE_H) / 2 + 4;
          return (
            <g key={n.id} {...feat(`node-${featSlug(n.id)}`, { cx: p.x, cy: p.y, w: rectW + 10, h: rectH + 10 })}>
              <rect x={p.x - rectW / 2} y={p.y - rectH / 2} width={rectW} height={rectH} rx={6}
                fill={withAlpha(color, 0.15)} stroke={color} strokeWidth={1.75} />
              <text
                x={p.x}
                y={firstBaseline}
                fontSize={NODE_FONT_SIZE}
                fill={DIAGRAM_COLORS.text}
                textAnchor="middle"
                fontWeight={700}
              >
                {lines.map((line, idx) => (
                  <tspan key={idx} x={p.x} dy={idx === 0 ? 0 : NODE_LINE_H}>{line}</tspan>
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
