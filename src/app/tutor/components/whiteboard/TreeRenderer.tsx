'use client';

import { mathifyDollarSpans } from '@/lib/utils/export/latex-readable';
/**
 * Tree Renderer
 *
 * Renders tree diagrams (probability trees, factor trees, decision trees)
 * with automatic layout using pure SVG. Supports up to 4 levels deep
 * and branching factor up to 6.
 */

import { useMemo } from 'react';
import { feat, featSlug, type FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';
// Width-aware label helpers (FractionBar fix, commit 009dc645) — node boxes
// used to be a fixed 80u wide, so any label longer than ~11 chars clipped at
// the viewBox edge. Labels now wrap and the boxes/bounds grow to fit.
import { estimateLabelWidth, wrapLabel } from './fraction-bar-layout';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Recursive node structure for the tree */
export interface TreeNode {
  label: string;
  value?: string;
  color?: string;
  children?: Array<{
    label: string;          // branch label shown on the edge
    probability?: string;   // e.g. "1/2", used for probability trees
    node: TreeNode;
  }>;
}

interface TreeRendererProps {
  /** Optional title rendered above the tree */
  title?: string;
  /** Tree type — affects styling of leaf nodes and branch labels */
  type?: 'probability' | 'factor' | 'decision' | 'generic';
  /** Root node of the tree */
  root: TreeNode;
  /** For probability trees: display cumulative probability at each leaf */
  showLeafProbabilities?: boolean;
  /** Layout direction */
  direction?: 'top-down' | 'left-right';
}

// ---------------------------------------------------------------------------
// Layout constants
// ---------------------------------------------------------------------------

const NODE_W = 80;          // minimum node width — grows to the wrapped label
const NODE_H = 36;          // minimum node height — grows with wrapped label lines
const LEVEL_GAP = 90;       // vertical (or horizontal) gap between levels
const SIBLING_GAP = 24;     // minimum horizontal gap between siblings
const PADDING = 40;         // SVG padding around the tree
const FONT_SIZE = 13;
const SMALL_FONT = 11;
const PRIME_RADIUS = 18;    // radius for factor-tree prime circles
const LABEL_LINE_H = 15;    // line height for wrapped node labels
/** Max estimated node-label line width before wrapping (13px units). */
const NODE_LABEL_WRAP = 160;
/** Max estimated branch-label width (11px). wrapLabel estimates at 13px, so scale the cap. */
const BRANCH_LABEL_WRAP = (110 * 13) / SMALL_FONT;

/**
 * Label-aware node box: width fits the widest wrapped label line (and the
 * value line), height grows with extra label lines.
 */
function nodeBoxSize(node: TreeNode): { w: number; h: number; labelLines: string[] } {
  const labelLines = wrapLabel(node.label ?? '', NODE_LABEL_WRAP);
  const labelW = Math.max(...labelLines.map((l) => estimateLabelWidth(l, FONT_SIZE)));
  const valueW = node.value ? estimateLabelWidth(node.value, SMALL_FONT) : 0;
  return {
    w: Math.max(NODE_W, Math.ceil(Math.max(labelW, valueW)) + 16),
    h: NODE_H + (labelLines.length - 1) * LABEL_LINE_H,
    labelLines,
  };
}

// ---------------------------------------------------------------------------
// Layout helpers
// ---------------------------------------------------------------------------

/** Positioned node produced by the layout algorithm */
interface LayoutNode {
  x: number;                // centre-x of the node
  y: number;                // centre-y of the node
  w: number;                // width of the node box
  h: number;                // height of the node box
  node: TreeNode;
  children: Array<{
    label: string;
    probability?: string;
    layoutNode: LayoutNode;
  }>;
  subtreeWidth: number;     // total width this subtree needs
  isLeaf: boolean;
  /** Wrapped node-label lines (always ≥1). */
  labelLines: string[];
  /** Cumulative probability string from root to this leaf */
  leafProbability?: string;
}

/**
 * First pass — compute the width each subtree requires so we can allocate
 * horizontal space proportionally.
 */
function measureSubtree(node: TreeNode | undefined): number {
  // Defensive guard: the model sometimes omits `node` on a child entry or
  // sends a tree where the root is missing. Treat as a leaf.
  if (!node) return NODE_W;
  const ownW = nodeBoxSize(node).w;
  if (!node.children || node.children.length === 0) {
    return ownW;
  }
  const childrenWidth = node.children.reduce(
    (sum, c) => sum + measureSubtree(c?.node),
    0
  );
  const gaps = (node.children.length - 1) * SIBLING_GAP;
  return Math.max(ownW, childrenWidth + gaps);
}

/**
 * Second pass — assign (x, y) positions to every node.
 * `xStart` is the left edge of the horizontal band allocated for this subtree.
 */
function positionNode(
  node: TreeNode | undefined,
  depth: number,
  xStart: number,
  subtreeWidth: number,
  pathProbabilities: string[],
): LayoutNode {
  // Defensive: treat missing node as an empty leaf so the tree still renders.
  const safeNode: TreeNode = node ?? { label: '' };
  const isLeaf = !safeNode.children || safeNode.children.length === 0;
  const x = xStart + subtreeWidth / 2;
  const y = PADDING + depth * (NODE_H + LEVEL_GAP);
  const { w: boxW, h: boxH, labelLines } = nodeBoxSize(safeNode);

  // Compute cumulative leaf probability
  let leafProbability: string | undefined;
  if (isLeaf && pathProbabilities.length > 0) {
    leafProbability = multiplyFractions(pathProbabilities);
  }

  if (isLeaf) {
    return {
      x, y,
      w: boxW, h: boxH,
      node: safeNode,
      children: [],
      subtreeWidth,
      isLeaf,
      labelLines,
      leafProbability,
    };
  }

  // Measure children to allocate proportional widths. Filter out entries
  // that are missing (undefined) or have no node payload.
  const children = safeNode.children!.filter((c) => c && c.node !== undefined);
  if (children.length === 0) {
    return {
      x, y,
      w: boxW, h: boxH,
      node: safeNode,
      children: [],
      subtreeWidth,
      isLeaf: true,
      labelLines,
      leafProbability,
    };
  }
  const childMeasures = children.map((c) => measureSubtree(c.node));
  const totalChildWidth = childMeasures.reduce((a, b) => a + b, 0);
  const totalGaps = (children.length - 1) * SIBLING_GAP;
  const availableForChildren = Math.max(subtreeWidth, totalChildWidth + totalGaps);

  let cursor = xStart + (subtreeWidth - availableForChildren) / 2;
  const positionedChildren = children.map((child, i) => {
    const ratio = childMeasures[i] / (totalChildWidth || 1);
    const childBand = ratio * (availableForChildren - totalGaps);
    const ln = positionNode(
      child.node,
      depth + 1,
      cursor,
      childBand,
      [...pathProbabilities, ...(child.probability ? [child.probability] : [])],
    );
    cursor += childBand + SIBLING_GAP;
    return { label: child.label ?? '', probability: child.probability, layoutNode: ln };
  });

  return {
    x, y,
    w: boxW, h: boxH,
    node: safeNode,
    children: positionedChildren,
    subtreeWidth,
    isLeaf,
    labelLines,
  };
}

/**
 * Branch-label anchor — mirrors the placement logic in renderTree() so
 * getBounds() can account for the estimated label extents.
 */
function branchLabelAnchor(parent: LayoutNode, child: LayoutNode): number {
  const dx = child.x - parent.x;
  const offsetX = dx === 0 ? -20 : (dx > 0 ? -14 : 14);
  return (parent.x + child.x) / 2 + offsetX;
}

/**
 * Compute the bounding box of the laid-out tree.
 */
function getBounds(layout: LayoutNode): { minX: number; minY: number; maxX: number; maxY: number } {
  let minX = layout.x - layout.w / 2;
  let maxX = layout.x + layout.w / 2;
  let minY = layout.y - layout.h / 2;
  let maxY = layout.y + layout.h / 2;

  // Account for leaf probability labels below leaf nodes ("P = x/y",
  // centered — include its estimated width so it can't clip at the edge).
  if (layout.isLeaf && layout.leafProbability) {
    maxY = Math.max(maxY, layout.y + layout.h / 2 + 22);
    const half = estimateLabelWidth(`P = ${layout.leafProbability}`, SMALL_FONT) / 2;
    minX = Math.min(minX, layout.x - half);
    maxX = Math.max(maxX, layout.x + half);
  }

  for (const child of layout.children) {
    // Branch labels (probability + wrapped label lines) are centered beside
    // the branch midpoint — include their estimated extents in the bounds.
    const anchorX = branchLabelAnchor(layout, child.layoutNode);
    let labelHalf = 0;
    if (child.probability) {
      labelHalf = estimateLabelWidth(child.probability, SMALL_FONT) / 2;
    }
    if (child.label) {
      for (const line of wrapLabel(child.label, BRANCH_LABEL_WRAP)) {
        labelHalf = Math.max(labelHalf, estimateLabelWidth(line, SMALL_FONT) / 2);
      }
    }
    if (labelHalf > 0) {
      minX = Math.min(minX, anchorX - labelHalf);
      maxX = Math.max(maxX, anchorX + labelHalf);
    }

    const cb = getBounds(child.layoutNode);
    minX = Math.min(minX, cb.minX);
    maxX = Math.max(maxX, cb.maxX);
    minY = Math.min(minY, cb.minY);
    maxY = Math.max(maxY, cb.maxY);
  }
  return { minX, minY, maxX, maxY };
}

// ---------------------------------------------------------------------------
// Fraction math helpers (for cumulative leaf probabilities)
// ---------------------------------------------------------------------------

/**
 * Parse a fraction string into [numerator, denominator]. Accepts:
 *   "1/2"            → [1, 2]
 *   "3"              → [3, 1]
 *   "13/52 = 1/4"    → [1, 4]   (uses the LAST clean fraction)
 *   "0.5"            → [0.5, 1]
 *
 * The brain occasionally emits probabilities in mixed-form notation
 * ("13/52 = 1/4") to show both raw and simplified values. The naive
 * split-on-`/` parser produced NaN denominators ("52 = 1" isn't a
 * number) which propagated to leaf probabilities as "P = 1/NaN".
 * Walking from the end and taking the last n/d (or n) match handles
 * all observed forms.
 */
function parseFraction(s: string): [number, number] {
  const trimmed = s.trim();
  if (!trimmed) return [NaN, NaN];
  const fracMatch = trimmed.match(/(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)\s*$/);
  if (fracMatch) return [Number(fracMatch[1]), Number(fracMatch[2])];
  const intMatch = trimmed.match(/(\d+(?:\.\d+)?)\s*$/);
  if (intMatch) return [Number(intMatch[1]), 1];
  return [NaN, NaN];
}

/** Greatest common divisor */
function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

/** Multiply an array of fraction strings and return a simplified fraction string */
function multiplyFractions(fractions: string[]): string {
  let num = 1;
  let den = 1;
  for (const f of fractions) {
    const [n, d] = parseFraction(f);
    num *= n;
    den *= d;
  }
  const g = gcd(num, den);
  num /= g;
  den /= g;
  if (den === 1) return `${num}`;
  return `${num}/${den}`;
}

// ---------------------------------------------------------------------------
// SVG rendering helpers
// ---------------------------------------------------------------------------

/**
 * Check whether a node should be rendered as a "prime" circle in factor trees.
 * A leaf node in a factor tree is a prime factor.
 */
function isPrimeLeaf(type: string | undefined, node: TreeNode, isLeaf: boolean): boolean {
  return type === 'factor' && isLeaf;
}

/**
 * Recursively collect all SVG elements for the tree.
 */
function renderTree(
  layout: LayoutNode,
  type: string | undefined,
  showLeafProbabilities: boolean,
  elements: JSX.Element[],
  keyPrefix: string,
  viewbox: { width: number; height: number; ox?: number; oy?: number },
  nodeCounter: { n: number } = { n: 0 },
  isRoot: boolean = true,
) {
  const { x, y, w, h, node, children, isLeaf, leafProbability } = layout;
  const primeLeaf = isPrimeLeaf(type, node, isLeaf);
  // Predictable feature name: "root" for top node, otherwise node-<label-slug>
  // falling back to node-<index> if no label.
  nodeCounter.n += 1;
  const featureName = isRoot
    ? 'root'
    : node.label
      ? `node-${featSlug(node.label)}`
      : `node-${nodeCounter.n}`;
  // Translate from raw layout coords into viewBox-origin-relative coords so
  // the resulting 0..1 fractions match what the scribble overlay expects.
  const vbOx = (viewbox as { ox?: number }).ox ?? 0;
  const vbOy = (viewbox as { oy?: number }).oy ?? 0;
  const featureBbox = { cx: x - vbOx, cy: y - vbOy, w: w + 8, h: h + 8 };
  const featureProps = feat(featureName, featureBbox, viewbox);

  // --- Draw branches from this node to each child ---
  children.forEach((child, i) => {
    const cx = child.layoutNode.x;
    const cy = child.layoutNode.y;

    // Line from bottom of parent to top of child
    const x1 = x;
    const y1 = y + h / 2;
    const x2 = cx;
    const y2 = cy - (isPrimeLeaf(type, child.layoutNode.node, child.layoutNode.isLeaf)
      ? PRIME_RADIUS
      : h / 2);

    elements.push(
      <line
        key={`${keyPrefix}-branch-${i}`}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#94a3b8"
        strokeWidth={1.5}
      />
    );

    // Branch label (probability or text) — anchor mirrored in
    // branchLabelAnchor() so getBounds() accounts for the extents.
    const midY = (y1 + y2) / 2;
    const anchorX = branchLabelAnchor(layout, child.layoutNode);

    if (child.probability) {
      // Probability label in red
      elements.push(
        <text
          key={`${keyPrefix}-prob-${i}`}
          x={anchorX}
          y={midY - 4}
          textAnchor="middle"
          fill="#dc2626"
          fontSize={SMALL_FONT}
          fontWeight={600}
        >
          {child.probability}
        </text>
      );
    }

    if (child.label) {
      // Branch label text — wrapped so long labels can't clip at the edge
      const labelOffsetY = child.probability ? 12 : 0;
      const branchLines = wrapLabel(child.label, BRANCH_LABEL_WRAP);
      elements.push(
        <text
          key={`${keyPrefix}-blabel-${i}`}
          x={anchorX}
          y={midY - 4 + labelOffsetY}
          textAnchor="middle"
          fill="#475569"
          fontSize={SMALL_FONT}
        >
          {branchLines.map((line, li) => (
            <tspan key={li} x={anchorX} dy={li === 0 ? 0 : 13}>
              {line}
            </tspan>
          ))}
        </text>
      );
    }

    // Recurse into child
    renderTree(child.layoutNode, type, showLeafProbabilities, elements, `${keyPrefix}-${i}`, viewbox, nodeCounter, false);
  });

  // --- Draw this node ---
  if (primeLeaf) {
    // Factor tree prime: blue circle
    elements.push(
      <circle
        key={`${keyPrefix}-circle`}
        cx={x}
        cy={y}
        r={PRIME_RADIUS}
        fill={node.color || '#dbeafe'}
        stroke="#2563eb"
        strokeWidth={2}
        {...featureProps}
      />
    );
    elements.push(
      <text
        key={`${keyPrefix}-clabel`}
        x={x}
        y={y + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#1e40af"
        fontSize={FONT_SIZE}
        fontWeight={700}
      >
        {node.label}
      </text>
    );
  } else {
    // Standard rounded rectangle node
    const fill = node.color || '#f8fafc';
    elements.push(
      <rect
        key={`${keyPrefix}-rect`}
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        rx={8}
        ry={8}
        fill={fill}
        stroke="#e2e8f0"
        strokeWidth={1.5}
        {...featureProps}
      />
    );
    // Label text — wrapped lines, vertically centered in the (grown) box
    const labelLines = layout.labelLines;
    const labelExtra = ((labelLines.length - 1) * LABEL_LINE_H) / 2;
    elements.push(
      <text
        key={`${keyPrefix}-label`}
        x={x}
        y={(node.value ? y - 4 : y + 1) - labelExtra}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#1e293b"
        fontSize={FONT_SIZE}
        fontWeight={600}
      >
        {labelLines.map((line, li) => (
          <tspan key={li} x={x} dy={li === 0 ? 0 : LABEL_LINE_H}>
            {line}
          </tspan>
        ))}
      </text>
    );
    // Optional value text (smaller, below the label)
    if (node.value) {
      elements.push(
        <text
          key={`${keyPrefix}-value`}
          x={x}
          y={y + 12 + labelExtra}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#64748b"
          fontSize={SMALL_FONT}
        >
          {node.value}
        </text>
      );
    }
  }

  // --- Leaf cumulative probability (for probability trees) ---
  if (showLeafProbabilities && isLeaf && leafProbability) {
    elements.push(
      <text
        key={`${keyPrefix}-leafprob`}
        x={x}
        y={y + (primeLeaf ? PRIME_RADIUS : h / 2) + 16}
        textAnchor="middle"
        fill="#dc2626"
        fontSize={SMALL_FONT}
        fontWeight={700}
      >
        P = {leafProbability}
      </text>
    );
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Pure manifest builder — enumerates the named features this renderer emits
 * for a given set of props. MUST stay in sync with the feat() calls in
 * renderTree(): root node named 'root', subsequent nodes use node-<slug>
 * (falling back to node-<n> where n is the pre-order traversal index).
 */
export function buildTreeManifest(props: TreeRendererProps): FeatureManifestEntry[] {
  const entries: FeatureManifestEntry[] = [];
  const safeRoot: TreeNode = props.root ?? { label: '' };
  const counter = { n: 0 };
  const leafCounter = { n: 0 };
  const visit = (
    node: TreeNode | undefined,
    isRoot: boolean,
    childSlot: 'left' | 'right' | 'middle' | null,
    depth: number,
  ) => {
    const safe: TreeNode = node ?? { label: '' };
    counter.n += 1;
    const name = isRoot
      ? 'root'
      : safe.label
        ? `node-${featSlug(safe.label)}`
        : `node-${counter.n}`;
    const isLeaf = !safe.children || safe.children.length === 0;
    const labels = new Set<string>([name]);
    if (isRoot) {
      labels.add('root');
      labels.add('the root');
      labels.add('root node');
    } else {
      if (safe.label) {
        labels.add(safe.label);
        labels.add(safe.label.toLowerCase());
        labels.add(`the ${safe.label.toLowerCase()}`);
        labels.add(`node ${safe.label}`);
      }
      labels.add(`node-${counter.n}`);
      labels.add(`node ${counter.n}`);
    }
    if (childSlot === 'left') {
      labels.add('left child');
      labels.add('left branch');
      if (safe.label) labels.add(`left child ${safe.label.toLowerCase()}`);
    }
    if (childSlot === 'right') {
      labels.add('right child');
      labels.add('right branch');
      if (safe.label) labels.add(`right child ${safe.label.toLowerCase()}`);
    }
    if (childSlot === 'middle') {
      labels.add('middle child');
    }
    if (isLeaf && !isRoot) {
      leafCounter.n += 1;
      labels.add('leaf');
      labels.add(`leaf ${leafCounter.n}`);
      labels.add(`leaf node`);
      labels.add(`leaf node ${leafCounter.n}`);
      if (safe.label) labels.add(`leaf ${safe.label.toLowerCase()}`);
    }
    entries.push({
      name,
      kind: 'node',
      description: isRoot
        ? `root node "${safe.label}"`
        : isLeaf
          ? `leaf node "${safe.label}"`
          : `node "${safe.label}"`,
      labels: Array.from(labels),
    });
    if (safe.children) {
      const kids = safe.children.filter((c) => c && c.node !== undefined);
      kids.forEach((c, i) => {
        let slot: 'left' | 'right' | 'middle' | null = null;
        if (kids.length === 2) slot = i === 0 ? 'left' : 'right';
        else if (kids.length === 3) slot = i === 0 ? 'left' : i === 1 ? 'middle' : 'right';
        visit(c.node, false, slot, depth + 1);
      });
    }
  };
  visit(safeRoot, true, null, 0);
  return entries;
}

export function TreeRenderer({
  title,
  type = 'generic',
  root,
  showLeafProbabilities = false,
  direction = 'top-down',
}: TreeRendererProps) {
  const { svgContent, viewBox } = useMemo(() => {
    // Defensive fallback if upstream validation missed a malformed tree —
    // prevents a runtime crash. The VoiceTutorRealtime handler rejects
    // invalid show_tree calls before they reach the renderer, so in the
    // common path `root` is always a real tree.
    const safeRoot: TreeNode = root ?? { label: '' };

    // 1. Measure the full subtree width
    const totalWidth = measureSubtree(safeRoot);

    // 2. Position every node
    const layout = positionNode(safeRoot, 0, 0, totalWidth, []);

    // 3. Compute bounding box
    const bounds = getBounds(layout);

    // Add padding
    const vbX = bounds.minX - PADDING;
    const vbY = bounds.minY - PADDING;
    const vbW = bounds.maxX - bounds.minX + PADDING * 2;
    const vbH = bounds.maxY - bounds.minY + PADDING * 2;

    // 4. Collect SVG elements. (The title is NOT drawn in the SVG — a long
    // title over a node-only viewBox clipped on both sides; it renders as an
    // HTML heading above the svg instead, the R38 FractionBar pattern.)
    const elements: JSX.Element[] = [];

    const viewBoxStr = `${vbX} ${vbY} ${vbW} ${vbH}`;
    // Feat coordinates need viewBox-space translation: our layout's x/y are in
    // the same coord system as the viewBox, so fractions are relative to the
    // viewBox width/height and origin.
    renderTree(layout, type, showLeafProbabilities, elements, 'n',
      { width: vbW, height: vbH, ox: vbX, oy: vbY });

    return { svgContent: elements, viewBox: viewBoxStr };
  }, [root, type, showLeafProbabilities]);

  // direction='left-right' formerly applied an SVG `rotate(90) scale(1, -1)`
  // wrapper to a top-down layout, but that rotated/flipped every text node
  // along with the structure — labels rendered upside-down and mirrored
  // (observed 2026-04-26 on a probability tree). Properly supporting
  // left-right requires swapping x/y in the layout pass, not a transform.
  // Until that lands, ignore the direction prop and always render top-down.
  // This is a no-op for the common case (default is top-down) and keeps
  // text upright on the rare left-right request at the cost of orientation.
  void direction;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Title as HTML above the svg — R38: centered SVG text over a node-only viewBox clipped long titles on both sides */}
      {title && (
        <h3 className="text-sm font-semibold text-slate-700 text-center">{mathifyDollarSpans(title)}</h3>
      )}
      <svg
        viewBox={viewBox}
        className="w-full max-w-full"
        style={{ maxHeight: '500px' }}
        preserveAspectRatio="xMidYMid meet"
      >
        {svgContent}
      </svg>
    </div>
  );
}

export default TreeRenderer;
