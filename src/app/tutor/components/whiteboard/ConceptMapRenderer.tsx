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

// Find where a ray from a rectangle's center toward (toX, toY) exits the
// rectangle. Used to clip edge endpoints so arrows touch the node box edge
// instead of plunging to the box's geometric center (which puts the arrow
// shaft and arrowhead INSIDE the box). Treats the box as an axis-aligned
// rectangle of the given width/height — the rounded corners are close
// enough to a sharp rect for visual purposes.
function clipLineToRect(
  cx: number, cy: number, w: number, h: number,
  toX: number, toY: number,
): { x: number; y: number } {
  const dx = toX - cx;
  const dy = toY - cy;
  if (dx === 0 && dy === 0) return { x: cx, y: cy };
  const halfW = w / 2;
  const halfH = h / 2;
  const adx = Math.abs(dx);
  const ady = Math.abs(dy);
  const tX = adx > 0 ? halfW / adx : Infinity;
  const tY = ady > 0 ? halfH / ady : Infinity;
  const t = Math.min(tX, tY);
  return { x: cx + dx * t, y: cy + dy * t };
}

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

interface AutoLayoutResult {
  positions: Map<string, { x: number; y: number }>;
  /**
   * Sum of natural (unscaled) row heights in pixels. The render component
   * uses this to grow the SVG viewBox vertically when content exceeds the
   * default plot height — letting deep chains render at full row spacing
   * instead of getting crunched until edge labels cover the arrows
   * (observed in 7-level chains where after-scale gap was ~13px and label
   * rect was 16px so labels overlapped both adjacent boxes).
   */
  naturalContentPx: number;
}

function autoLayout(
  nodes: ConceptNode[],
  edges: ConceptEdge[],
  dimsById: Map<string, { rectW: number; rectH: number }>,
  plotW: number,
  plotH: number,
): AutoLayoutResult {
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
  if (nodes.length === 0) return { positions: pos, naturalContentPx: 0 };

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

  // Horizontal slot widths: each group's slice is proportional to its widest
  // level. A {diff,rates} group (max 1 node per level) gets a narrow slot; a
  // {integ,accum,ex1,ex2,ex3} group (max 3 in level 2) gets a wider slot.
  const groupKeys = [...groups.keys()].sort((a, b) => a - b);
  const groupWeights: number[] = groupKeys.map((k) => {
    const g = groups.get(k)!;
    return Math.max(1, ...[...g.values()].map((ids) => ids.length));
  });
  const totalWeight = groupWeights.reduce((s, w) => s + w, 0) || 1;
  const TOTAL_WIDTH = 94;
  const START_X = 3;
  const sliceWidths: number[] = [];
  const groupStartX: number[] = [];
  let runningX = START_X;
  groupKeys.forEach((_k, gIdx) => {
    const sw = (groupWeights[gIdx] / totalWeight) * TOTAL_WIDTH;
    sliceWidths.push(sw);
    groupStartX.push(runningX);
    runningX += sw;
  });

  // Per (group, level): pre-compute slot x positions and detect actual
  // pixel-rect overlap between adjacent siblings. R9 follow-up: the prior
  // ">= 5 siblings" zigzag heuristic missed the common case of 3 wide
  // 2-line-labelled siblings overlapping at level 2 of an unbalanced
  // multi-root forest (concept-two-sides). When wrapped labels produce
  // boxes wider than their allocated slot, adjacent boxes literally overlap
  // each other's borders. Detect that explicitly and zigzag in response.
  const slotInfo = new Map<string, { positions: number[]; stagger: boolean }>();
  const rowStaggers = new Map<number, boolean>();
  const MIN_GAP_PX = 12;
  const MIN_GAP_NORM = (MIN_GAP_PX / plotW) * 100;
  groupKeys.forEach((gKey, gIdx) => {
    const g = groups.get(gKey)!;
    const sliceWidth = sliceWidths[gIdx];
    const sx = groupStartX[gIdx];
    sortedLevels.forEach((lv) => {
      const ids = g.get(lv);
      if (!ids || ids.length === 0) return;
      const positions = ids.map((_, colIdx) => sx + (colIdx + 0.5) * (sliceWidth / ids.length));
      let pixelOverlap = false;
      for (let k = 0; k < ids.length - 1; k++) {
        const dimsL = dimsById.get(ids[k]);
        const dimsR = dimsById.get(ids[k + 1]);
        const halfL = (((dimsL?.rectW ?? 60)) / plotW) * 100 / 2;
        const halfR = (((dimsR?.rectW ?? 60)) / plotW) * 100 / 2;
        const right = positions[k] + halfL;
        const left = positions[k + 1] - halfR;
        if (right + MIN_GAP_NORM > left) {
          pixelOverlap = true;
          break;
        }
      }
      const stagger = ids.length >= 5 || pixelOverlap;
      slotInfo.set(`${gKey}|${lv}`, { positions, stagger });
      const rowIdx = levelRowIdx.get(lv)!;
      if (stagger) rowStaggers.set(rowIdx, true);
    });
  });

  // R9 follow-up: per-row heights from actual node dimensions. The previous
  // SINGLE_ROW_NORM=18 / MULTI_ROW_NORM=32 constants didn't honor wrapped
  // 2-line label heights, so deep linear chains compressed: in a 4-level
  // chain with several 2-line labels, arrow labels (16px) were jammed
  // against the boxes above and below. Each row now allocates
  //   max(rectH in row) + LABEL_HEIGHT + 2 * EDGE_PADDING
  // pixels, plus stagger-clearance when any sibling cluster in the row
  // zigzags. That guarantees ≥32px of gap between adjacent rows' box
  // edges — enough for an edge label to render with 8px breathing room
  // top and bottom.
  const TOP_ANCHOR_NORM = 8;
  const LABEL_HEIGHT_PX = 16;
  // EDGE_PADDING_PX bumped 8 → 14 so each side of an edge label has 12px
  // of visible arrow line (was 6px). The 7px arrow marker now renders
  // entirely in the stub instead of getting hidden under the box border —
  // observed in the 4-level Differentiation Chain where every arrowhead
  // was invisible after R9 because the stub matched marker height.
  const EDGE_PADDING_PX = 14;
  const STAGGER_GAP_PX = 6;
  const rowMaxRectH: number[] = sortedLevels.map((lv) => {
    let maxRectH = 26;
    for (const g of groups.values()) {
      const ids = g.get(lv);
      if (!ids) continue;
      for (const id of ids) {
        const d = dimsById.get(id);
        if (d && d.rectH > maxRectH) maxRectH = d.rectH;
      }
    }
    return maxRectH;
  });
  const rowHeightsPx: number[] = sortedLevels.map((_lv, rowIdx) => {
    const maxRectH = rowMaxRectH[rowIdx];
    let rowPx = maxRectH + LABEL_HEIGHT_PX + 2 * EDGE_PADDING_PX;
    if (rowStaggers.get(rowIdx)) rowPx += maxRectH + STAGGER_GAP_PX;
    return rowPx;
  });
  const naturalContentPx = rowHeightsPx.reduce((s, v) => s + v, 0);
  const rowHeightsNorm = rowHeightsPx.map((px) => (px / plotH) * 100);
  const totalContentNorm = rowHeightsNorm.reduce((s, v) => s + v, 0);
  const availableNorm = 100 - TOP_ANCHOR_NORM;
  // When the caller has sized plotH to fit naturally (see render component's
  // dynamic viewBox logic) scale is 1 and rows render at their full
  // requested height. Scale only kicks in if the caller fixed plotH below
  // what the content needs, in which case rows compress proportionally —
  // a graceful-degradation fallback for content that exceeds MAX_VIEWBOX_H.
  const scale = totalContentNorm > availableNorm ? availableNorm / totalContentNorm : 1;
  const rowYBaselines: number[] = [];
  let cursor = TOP_ANCHOR_NORM;
  for (let i = 0; i < rowHeightsNorm.length; i++) {
    const norm = rowHeightsNorm[i] * scale;
    rowYBaselines.push(cursor + norm / 2);
    cursor += norm;
  }

  // Place nodes. Staggered rows alternate even/odd cols up/down by half the
  // stagger amount so the row stays visually centered on baseY. Stagger
  // amount is sized to clear maxRectH + STAGGER_GAP_PX, so the upper
  // sub-row's box bottom and the lower sub-row's box top never collide.
  groupKeys.forEach((gKey) => {
    const g = groups.get(gKey)!;
    sortedLevels.forEach((lv) => {
      const ids = g.get(lv);
      if (!ids || ids.length === 0) return;
      const info = slotInfo.get(`${gKey}|${lv}`)!;
      const rowIdx = levelRowIdx.get(lv)!;
      const baseY = rowYBaselines[rowIdx];
      let halfStaggerNorm = 0;
      if (info.stagger) {
        const halfStaggerPx = (rowMaxRectH[rowIdx] + STAGGER_GAP_PX) / 2;
        halfStaggerNorm = (halfStaggerPx / plotH) * 100 * scale;
      }
      ids.forEach((id, colIdx) => {
        const x = info.positions[colIdx];
        let y = baseY;
        if (info.stagger) {
          y = colIdx % 2 === 0 ? baseY - halfStaggerNorm : baseY + halfStaggerNorm;
        }
        pos.set(id, { x, y });
      });
    });
  });
  return { positions: pos, naturalContentPx };
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
  const defaultH = VIEWBOX_H - pad.top - pad.bottom;

  // Pre-compute per-node render dimensions so autoLayout can reason about
  // actual box widths/heights (sibling overlap, per-row heights) and edges
  // can do collision checks against real node bboxes downstream.
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

  const explicitLayout = nodes.every((n) => typeof n.x === 'number' && typeof n.y === 'number');

  // R10 follow-up: dynamic viewBox height for tall content (deep linear
  // chains, multi-component forests). The default 360-unit viewBox holds
  // ~5 rows comfortably; deeper chains were getting scaled down until the
  // edge-label rect (16px) was wider than the row gap and visually
  // covered the boxes above and below it. Now we ask autoLayout how much
  // room it really wants and grow the viewBox height to match — capped
  // at MAX_VIEWBOX_H so a 50-level brain emit still degrades gracefully
  // instead of producing a 4000px-tall SVG. With width:100% and the
  // existing maxHeight cap on the rendered SVG, growing the viewBox
  // squishes the diagram horizontally on screen but preserves correct
  // proportions internally (rows + edges + labels all render at full
  // requested size in viewBox coordinates).
  const MAX_VIEWBOX_H = 800;
  const TOP_ANCHOR_PX_FOR_FIT = (8 / 100) * defaultH;
  let probeResult = explicitLayout ? null : autoLayout(nodes, edges, dimsById, w, defaultH);
  let h = defaultH;
  let viewBoxH = VIEWBOX_H;
  if (probeResult) {
    const requiredPlotH = TOP_ANCHOR_PX_FOR_FIT + probeResult.naturalContentPx;
    if (requiredPlotH > defaultH) {
      const cappedPlotH = Math.min(MAX_VIEWBOX_H - pad.top - pad.bottom, requiredPlotH);
      h = cappedPlotH;
      viewBoxH = pad.top + h + pad.bottom;
      probeResult = autoLayout(nodes, edges, dimsById, w, h);
    }
  }
  const positions = probeResult ? probeResult.positions : null;

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
  const VIEWBOX_CENTER_Y = viewBoxH / 2;
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
    // Node bboxes (with 2px outward padding). R10 follow-up: include the
    // edge's own source AND target — for short hub→child edges, baseT
    // values close to 1.0 placed labels right on top of the target box
    // (observed Map 5: "approximated by" sitting on "Riemann Sum
    // Approximation"). The slide-along-t fallback now pushes those
    // labels back toward the edge midpoint instead of letting them
    // overlap the target.
    for (const n of nodes) {
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
      <svg viewBox={`0 0 ${VIEWBOX_W} ${viewBoxH}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', maxHeight: viewBoxH > VIEWBOX_H ? 600 : 400 }}>
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
          let ctrl: { x: number; y: number } | null = null;
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
          }

          // Clip endpoints to source / target box perimeters so arrows
          // just touch the box edges instead of running into the box
          // centers (which would put the shaft and arrowhead inside the
          // node visually). Direction reference: for straight lines, use
          // the opposite endpoint; for curves, use the control point so
          // the clip respects the curve's tangent at each endpoint.
          const sd = dimsById.get(e.from)!;
          const td = dimsById.get(e.to)!;
          const PERIM_PAD = 2;
          const startRefX = ctrl ? ctrl.x : x2;
          const startRefY = ctrl ? ctrl.y : y2;
          const endRefX = ctrl ? ctrl.x : pa.x;
          const endRefY = ctrl ? ctrl.y : pa.y;
          const startPt = clipLineToRect(
            pa.x, pa.y, sd.rectW + PERIM_PAD * 2, sd.rectH + PERIM_PAD * 2,
            startRefX, startRefY,
          );
          const endPt = clipLineToRect(
            x2, y2, td.rectW + PERIM_PAD * 2, td.rectH + PERIM_PAD * 2,
            endRefX, endRefY,
          );

          let pathD: string;
          let labelMidX: number;
          let labelMidY: number;
          if (ctrl) {
            pathD = `M ${startPt.x} ${startPt.y} Q ${ctrl.x} ${ctrl.y} ${endPt.x} ${endPt.y}`;
            // Approximate the quadratic Bézier midpoint at t=0.5:
            // P(0.5) = 0.25*P0 + 0.5*P1 + 0.25*P2 with the clipped endpoints.
            labelMidX = 0.25 * startPt.x + 0.5 * ctrl.x + 0.25 * endPt.x;
            labelMidY = 0.25 * startPt.y + 0.5 * ctrl.y + 0.25 * endPt.y;
          } else {
            pathD = `M ${startPt.x} ${startPt.y} L ${endPt.x} ${endPt.y}`;
            labelMidX = (startPt.x + endPt.x) / 2;
            labelMidY = (startPt.y + endPt.y) / 2;
          }

          // Issue 8: roomier label rect so KaTeX/sans labels don't clip.
          const labelW = e.label ? e.label.length * 7.0 + 18 : 0;
          const labelH = 16;

          // Issue 2 + R10 follow-up: per-source-relative position evenly
          // distributed across all of the source's outgoing edges. The prior
          // `localIdx % 4` formula wrapped after the 4th sibling, so a hub
          // with 5+ children (Map 2 — Definite Integral with 5 outgoing
          // edges) had two labels claiming baseT=0.32 and the second one
          // had to fall back to t-slide / perpendicular offset, often
          // landing on or behind an unrelated node. Now baseT spreads
          // proportionally so each of N siblings gets a unique slot in
          // [0.32, 0.86].
          const localIdx = localSourceIdx.get(i) ?? 0;
          const sourceEdgeCount = (edgesBySource.get(e.from) ?? []).length;
          const baseT = sourceEdgeCount <= 1
            ? 0.55
            : 0.32 + (localIdx / (sourceEdgeCount - 1)) * 0.54;

          // Issue 3: try the per-source position first; if it would collide
          // with another node, walk t outward until clear (or fall back to
          // baseT if no clear slot found).
          let lx = labelMidX;
          let ly = labelMidY;
          if (e.label) {
            const tryT = (tVal: number): { x: number; y: number } => {
              if (ctrl) {
                // Re-evaluate quadratic Bézier at tVal using the clipped
                // endpoints (so labels position along the visible portion
                // of the curve, not its theoretical full length).
                const u = 1 - tVal;
                return {
                  x: u * u * startPt.x + 2 * u * tVal * ctrl.x + tVal * tVal * endPt.x,
                  y: u * u * startPt.y + 2 * u * tVal * ctrl.y + tVal * tVal * endPt.y,
                };
              }
              return {
                x: startPt.x + (endPt.x - startPt.x) * tVal,
                y: startPt.y + (endPt.y - startPt.y) * tVal,
              };
            };
            // R10 follow-up: symmetric slide range out to ±0.42 in 0.06
            // increments. The prior asymmetric list ([baseT+0.10, -0.06,
            // +0.20, -0.12, +0.30, -0.18]) bottomed at -0.18 from baseT,
            // which wasn't enough for high-baseT labels (e.g. baseT=0.86
            // on a short hub→child edge — needed at least -0.30 to clear
            // the target box once the target was added to the collision
            // check).
            const candidates: number[] = [baseT];
            for (let step = 0.06; step <= 0.42; step += 0.06) {
              candidates.push(baseT - step);
              candidates.push(baseT + step);
            }
            let resolved = tryT(baseT);
            let resolvedClear = !labelCollides(e, resolved.x, resolved.y, labelW, labelH);
            let chosenT = baseT;
            for (const tv of candidates) {
              if (tv < 0.18 || tv > 0.82) continue;
              const p = tryT(tv);
              if (!labelCollides(e, p.x, p.y, labelW, labelH)) {
                resolved = p;
                resolvedClear = true;
                chosenT = tv;
                break;
              }
            }
            // R10 follow-up: when no t along the edge is clear (e.g. a long
            // crossing edge whose entire visible portion runs through a
            // cluster of other edge labels — concept-diamond's "ultimately
            // gives" label vs. the "produces" / "uses" labels at the
            // antiderivative hub), step the label off the edge along its
            // perpendicular. The connector rect+text becomes a tag floating
            // beside the edge instead of stacking on top of neighbors.
            if (!resolvedClear) {
              let tx: number, ty: number;
              if (ctrl) {
                const u = 1 - chosenT;
                tx = 2 * u * (ctrl.x - startPt.x) + 2 * chosenT * (endPt.x - ctrl.x);
                ty = 2 * u * (ctrl.y - startPt.y) + 2 * chosenT * (endPt.y - ctrl.y);
              } else {
                tx = endPt.x - startPt.x;
                ty = endPt.y - startPt.y;
              }
              const tlen = Math.sqrt(tx * tx + ty * ty) || 1;
              const perpX = -ty / tlen;
              const perpY = tx / tlen;
              const baseAt = tryT(chosenT);
              // R10 follow-up: perpendicular sweep range scales with
              // labelW/2 so wide labels can clear wide unrelated boxes.
              // Previously capped at 3*labelH = 48px; for a 151px-wide
              // "geometrically means" label colliding with a 119px-wide
              // "Fundamental Theorem" box, 48px wasn't enough to escape.
              // Now sweeps both directions in 0.5*labelH steps up to
              // max(3*labelH, labelW * 0.7).
              const maxMag = Math.max(3 * labelH, labelW * 0.7);
              const offsetMags: number[] = [];
              for (let mag = labelH; mag <= maxMag; mag += labelH * 0.5) {
                offsetMags.push(mag);
                offsetMags.push(-mag);
              }
              for (const mag of offsetMags) {
                const cand = { x: baseAt.x + perpX * mag, y: baseAt.y + perpY * mag };
                if (!labelCollides(e, cand.x, cand.y, labelW, labelH)) {
                  resolved = cand;
                  resolvedClear = true;
                  break;
                }
              }
            }
            lx = resolved.x;
            ly = resolved.y;
            // Track this label's rect so subsequent edges avoid it. Always
            // record (even if no clear position found) so collisions remain
            // bounded and we don't pile labels at the fallback baseT spot.
            placedLabelRects.push({ x: lx, y: ly, w: labelW, h: labelH });
          }

          const eminX = Math.min(startPt.x, endPt.x); const emaxX = Math.max(startPt.x, endPt.x);
          const eminY = Math.min(startPt.y, endPt.y); const emaxY = Math.max(startPt.y, endPt.y);
          return (
            <g key={`edge${i}`} {...feat(`edge-${featSlug(e.from)}-to-${featSlug(e.to)}`, { cx: (startPt.x + endPt.x) / 2, cy: (startPt.y + endPt.y) / 2, w: Math.max(30, emaxX - eminX + 20), h: Math.max(30, emaxY - eminY + 20) })}>
              <path d={pathD} fill="none" stroke={color} strokeWidth={1.25}
                markerEnd={e.directed ? `url(#${arrowMarkerId(color, 'cm-arrow')})` : undefined} />
              {e.label && (
                <g>
                  {/* R10 follow-up: semi-transparent rect with no border —
                      the underlying arrow line shows through subtly so
                      tight-gap deep chains don't appear armless, and any
                      unavoidable overlap with an unrelated node looks like
                      a label tag rather than a competing box. */}
                  <rect x={lx - labelW / 2} y={ly - labelH / 2} width={labelW} height={labelH} rx={3}
                    fill="rgba(255,255,255,0.78)" />
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
