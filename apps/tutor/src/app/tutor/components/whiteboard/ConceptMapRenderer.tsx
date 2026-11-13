'use client';

import { InlineMathText } from './InlineMathText';
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
import { DIAGRAM_COLORS, withAlpha } from '@/lib/tutor/diagrams/theme';
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

  // Within a row, a node stands under the nodes it is linked to in the rows above (the mean of their places),
  // not in the order it was first mentioned: with a dozen nodes the links otherwise criss-cross the whole map
  // (figure audit, 2026-11-13). Rows are done top to bottom, so each row is ordered against rows already settled.
  for (const gMap of groups.values()) {
    const place = new Map<string, number>();
    const lvls = [...gMap.keys()].sort((a, b) => a - b);
    lvls.forEach((lv, li) => {
      const ids = gMap.get(lv)!;
      if (li > 0) {
        const key = (id: string, fallback: number) => {
          const above = (adj.get(id) || []).map((nb) => place.get(nb)).filter((v): v is number => v !== undefined);
          return above.length ? above.reduce((a, b) => a + b, 0) / above.length : fallback;
        };
        const keyed = ids.map((id, i) => ({ id, k: key(id, (i + 0.5) / ids.length), i }));
        keyed.sort((a, b) => a.k - b.k || a.i - b.i);
        gMap.set(lv, keyed.map((x) => x.id));
      }
      gMap.get(lv)!.forEach((id, i, arr) => place.set(id, (i + 0.5) / arr.length));
    });
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
  // A crowded map gets a wider sheet: a dozen nodes on the 520-unit sheet of a five-node map stood on each
  // other's links. The text keeps its size; the sheet grows.
  const VIEWBOX_W = Math.min(820, DIAGRAM_VIEWBOX.width + Math.max(0, nodes.length - 6) * 50);
  const vb = (viewBoxHeight: number) => ({ width: VIEWBOX_W, height: viewBoxHeight });
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
  // Shrink floor: don't let a one-row map collapse into a sliver — 120px of
  // plot keeps the SVG legible and clickable even for a 2-node map.
  const MIN_PLOT_H = 120;
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
    } else if (requiredPlotH < defaultH) {
      // Symmetric shrink branch (letterbox fix): rows are top-anchored, so a
      // small map (e.g. 2 rows ≈ 200px of a 332px plot) left ~130px of dead
      // whitespace under the content. Shrink the viewBox to what the layout
      // actually needs, floored at MIN_PLOT_H. Safe with the row math above:
      // scale only compresses when content exceeds 92% of plotH, and
      // requiredPlotH is sized so content occupies ≤92% by construction.
      h = Math.max(MIN_PLOT_H, requiredPlotH);
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

  // How many boxes (other than its own two) a link runs through, straight or bowed through `ctrl`; a link that
  // leaves the sheet counts as well. Used to pick a route that goes round the boxes instead of under them.
  const routeHits = (edge: ConceptEdge, x1: number, y1: number, x2: number, y2: number, ctrl: { x: number; y: number } | null): number => {
    let hits = 0;
    const blocked = new Set<string>();
    for (let k = 1; k < 24; k++) {
      const t = k / 24; const u = 1 - t;
      const x = ctrl ? u * u * x1 + 2 * u * t * ctrl.x + t * t * x2 : x1 + (x2 - x1) * t;
      const y = ctrl ? u * u * y1 + 2 * u * t * ctrl.y + t * t * y2 : y1 + (y2 - y1) * t;
      if (x < 4 || x > VIEWBOX_W - 4 || y < 4 || y > viewBoxH - 4) hits += 0.5;
      for (const n of nodes) {
        if (n.id === edge.from || n.id === edge.to || blocked.has(n.id)) continue;
        const np = place(n); const d = dimsById.get(n.id)!;
        if (Math.abs(x - np.x) < d.rectW / 2 + 5 && Math.abs(y - np.y) < d.rectH / 2 + 5) { blocked.add(n.id); hits += 1; }
      }
    }
    return hits;
  };
  // Every link's route first, then every label: a label is placed knowing where all the links run.
  type EdgeGeom = { color: string; pathD: string; startPt: { x: number; y: number }; endPt: { x: number; y: number }; pt: (t: number) => { x: number; y: number }; normal: (t: number) => { x: number; y: number } };
  const geoms: Array<EdgeGeom | null> = edges.map((e, i) => {
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
    let ctrl: { x: number; y: number } | null = null;
    {
      const midX = (pa.x + x2) / 2;
      const midY = (pa.y + y2) / 2;
      const dx = x2 - pa.x;
      const dy = y2 - pa.y;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      const px = -dy / len;
      const py = dx / len;
      const at = (sgn: number, bow: number) => ({ x: midX + px * sgn * bow, y: midY + py * sgn * bow });
      // Which side to bow to first: for a crossing pair, the explicit opposite sides (so the two do not
      // tangle); otherwise the side farther from the centre of the sheet, through emptier space.
      let prefSign: number = crossingBowSign.get(i) ?? 0;
      if (!prefSign) {
        const c1 = at(1, 28); const c2 = at(-1, 28);
        const d1 = (c1.x - VIEWBOX_CENTER_X) ** 2 + (c1.y - VIEWBOX_CENTER_Y) ** 2;
        const d2 = (c2.x - VIEWBOX_CENTER_X) ** 2 + (c2.y - VIEWBOX_CENTER_Y) ** 2;
        prefSign = d1 > d2 ? 1 : -1;
      }
      // The routes, gentlest first: straight (unless the link is long or crosses another), then bows of
      // growing depth on either side. The first that runs through no other box is taken; when every
      // route runs through one, the one that runs through fewest.
      const routes: Array<{ x: number; y: number } | null> = [];
      if (!forceCurve.has(i)) routes.push(null);
      for (const bow of [28, 52, 80, 112, 150]) { routes.push(at(prefSign, bow)); routes.push(at(-prefSign, bow)); }
      if (forceCurve.has(i)) routes.push(null);
      let bestHits = Infinity;
      for (const r of routes) {
        const hits = routeHits(e, pa.x, pa.y, x2, y2, r);
        if (hits < bestHits) { bestHits = hits; ctrl = r; }
        if (hits === 0) break;
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
    if (ctrl) {
      pathD = `M ${startPt.x} ${startPt.y} Q ${ctrl.x} ${ctrl.y} ${endPt.x} ${endPt.y}`;
    } else {
      pathD = `M ${startPt.x} ${startPt.y} L ${endPt.x} ${endPt.y}`;
    }

    const pt = (t: number) => {
      const u = 1 - t;
      return ctrl
        ? { x: u * u * startPt.x + 2 * u * t * ctrl.x + t * t * endPt.x, y: u * u * startPt.y + 2 * u * t * ctrl.y + t * t * endPt.y }
        : { x: startPt.x + (endPt.x - startPt.x) * t, y: startPt.y + (endPt.y - startPt.y) * t };
    };
    const normal = (t: number) => {
      const u = 1 - t;
      const tx = ctrl ? 2 * u * (ctrl.x - startPt.x) + 2 * t * (endPt.x - ctrl.x) : endPt.x - startPt.x;
      const ty = ctrl ? 2 * u * (ctrl.y - startPt.y) + 2 * t * (endPt.y - ctrl.y) : endPt.y - startPt.y;
      const len = Math.hypot(tx, ty) || 1;
      return { x: -ty / len, y: tx / len };
    };
    return { color, pathD, startPt, endPt, pt, normal };
  });

  // Labels (rebuilt 2026-11-13, figure audit). Each label sits ON its own link, or just beside it, at the place
  // along the link where it covers least: no box, no other label, no other link. The earlier rule walked a
  // label sideways until it was clear of everything, which on a crowded map left it floating a long way from
  // the link it names ("limits inheritance" above the whole map).
  const LABEL_H = 16;
  const samples = geoms.map((g) => (g ? Array.from({ length: 21 }, (_, k) => g.pt(k / 20)) : []));
  const area = (ax: number, ay: number, aw: number, ah: number, bx: number, by: number, bw: number, bh: number) => {
    const ox = Math.min(ax + aw / 2, bx + bw / 2) - Math.max(ax - aw / 2, bx - bw / 2);
    const oy = Math.min(ay + ah / 2, by + bh / 2) - Math.max(ay - ah / 2, by - bh / 2);
    return ox > 0 && oy > 0 ? ox * oy : 0;
  };
  const labelAt: Array<{ x: number; y: number; w: number } | null> = edges.map(() => null);
  edges.forEach((e, i) => {
    const g = geoms[i];
    if (!g || !e.label) return;
    const labelW = e.label.length * 5.6 + 12;
    const localIdx = localSourceIdx.get(i) ?? 0;
    const sourceEdgeCount = (edgesBySource.get(e.from) ?? []).length;
    // Labels of links that leave the same box start at different distances along their links.
    const baseT = sourceEdgeCount <= 1 ? 0.5 : 0.38 + (localIdx / (sourceEdgeCount - 1)) * 0.3;
    let best = g.pt(baseT); let bestCost = Infinity;
    for (let t = 0.14; t <= 0.861; t += 0.04) {
      for (const off of [0, 11, -11, 19, -19]) {
        const base = g.pt(t); const nrm = g.normal(t);
        const c = { x: base.x + nrm.x * off, y: base.y + nrm.y * off };
        let cost = Math.abs(t - baseT) * 60 + Math.abs(off) * 2;
        for (const n of nodes) {
          const np = place(n); const d = dimsById.get(n.id)!;
          cost += area(c.x, c.y, labelW, LABEL_H, np.x, np.y, d.rectW + 6, d.rectH + 6) * 8;
        }
        for (const r of labelAt) if (r) cost += area(c.x, c.y, labelW, LABEL_H, r.x, r.y, r.w + 6, LABEL_H + 4) * 8;
        samples.forEach((pts, j) => {
          if (j === i) return;
          for (const q of pts) if (Math.abs(q.x - c.x) < labelW / 2 + 2 && Math.abs(q.y - c.y) < LABEL_H / 2 + 2) cost += 70;
        });
        const overX = Math.max(0, 4 - (c.x - labelW / 2)) + Math.max(0, c.x + labelW / 2 - (VIEWBOX_W - 4));
        const overY = Math.max(0, 4 - (c.y - LABEL_H / 2)) + Math.max(0, c.y + LABEL_H / 2 - (viewBoxH - 4));
        cost += (overX + overY) * 200;
        if (cost < bestCost) { bestCost = cost; best = c; }
      }
    }
    labelAt[i] = { x: best.x, y: best.y, w: labelW };
  });

  // A map with one root shows it: the root in the strong colour, the rest in a quiet one. A colour per node
  // (the old rainbow) said nothing about the map. A caller's own colours are kept.
  const rootIds = new Set(nodes.filter((n) => n.level === 0).map((n) => n.id));
  if (rootIds.size === 0 && nodes.length > 0) rootIds.add(nodes[0].id);
  const nodeColor = (n: ConceptNode) => n.color || (rootIds.has(n.id) ? '#1d4ed8' : '#64748b');

  return (
    <div style={{ padding: 12, background: 'white', borderRadius: 6 }}>
      {title && (
        <div style={{ textAlign: 'center', fontWeight: 600, fontSize: 16, marginBottom: 6, color: DIAGRAM_COLORS.text }}><InlineMathText text={title} /></div>
      )}
      <svg viewBox={`0 0 ${VIEWBOX_W} ${viewBoxH}`} xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', margin: '0 auto', width: '100%', maxWidth: Math.round(VIEWBOX_W * 1.3), height: 'auto', maxHeight: viewBoxH > VIEWBOX_H ? 640 : 400 }}>
        <ArrowMarkers idPrefix="cm-arrow" />

        {edges.map((e, i) => {
          const g = geoms[i];
          if (!g) return null;
          const { startPt, endPt, color } = g;
          const eminX = Math.min(startPt.x, endPt.x); const emaxX = Math.max(startPt.x, endPt.x);
          const eminY = Math.min(startPt.y, endPt.y); const emaxY = Math.max(startPt.y, endPt.y);
          return (
            <g key={`edge${i}`} {...feat(`edge-${featSlug(e.from)}-to-${featSlug(e.to)}`, { cx: (startPt.x + endPt.x) / 2, cy: (startPt.y + endPt.y) / 2, w: Math.max(30, emaxX - eminX + 20), h: Math.max(30, emaxY - eminY + 20) }, vb(viewBoxH))}>
              <path d={g.pathD} fill="none" stroke={color} strokeWidth={1.25}
                markerEnd={e.directed ? `url(#${arrowMarkerId(color, 'cm-arrow')})` : undefined} />
            </g>
          );
        })}
        {/* The labels over all the links: a label's white ground hides the piece of line under it, whichever
            link that line belongs to. */}
        {edges.map((e, i) => {
          const lab = labelAt[i];
          if (!lab || !e.label) return null;
          return (
            <g key={`edgelabel${i}`}>
              <rect x={lab.x - lab.w / 2} y={lab.y - LABEL_H / 2} width={lab.w} height={LABEL_H} rx={3} fill="rgba(255,255,255,0.92)" />
              <text x={lab.x} y={lab.y + 3.5} fontSize={10} fill={DIAGRAM_COLORS.text} textAnchor="middle">{e.label}</text>
            </g>
          );
        })}

        {/* Nodes. Multi-line labels: brain emits "Title\nSubtitle" expecting
            stacked rendering. wrapLabel handles long single-line labels by
            splitting at the closest-to-middle space (Issue 1). */}
        {nodes.map((n, i) => {
          const p = place(n);
          const color = nodeColor(n);
          const dims = dimsById.get(n.id)!;
          const { lines, rectW, rectH } = dims;
          const firstBaseline = p.y - ((lines.length - 1) * NODE_LINE_H) / 2 + 4;
          return (
            <g key={n.id} {...feat(`node-${featSlug(n.id)}`, { cx: p.x, cy: p.y, w: rectW + 10, h: rectH + 10 }, vb(viewBoxH))}>
              <rect x={p.x - rectW / 2} y={p.y - rectH / 2} width={rectW} height={rectH} rx={6}
                fill={n.color ? withAlpha(color, 0.15) : rootIds.has(n.id) ? '#dbeafe' : '#f8fafc'} stroke={color} strokeWidth={rootIds.has(n.id) && !n.color ? 2.25 : 1.75} />
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
