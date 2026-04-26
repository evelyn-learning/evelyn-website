'use client';

/**
 * Tree Renderer
 *
 * Renders tree diagrams (probability trees, factor trees, decision trees)
 * with automatic layout using pure SVG. Supports up to 4 levels deep
 * and branching factor up to 6.
 */

import { useMemo } from 'react';
import { feat, featSlug, type FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';

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

const NODE_W = 80;          // default node width
const NODE_H = 36;          // default node height
const LEVEL_GAP = 90;       // vertical (or horizontal) gap between levels
const SIBLING_GAP = 24;     // minimum horizontal gap between siblings
const PADDING = 40;         // SVG padding around the tree
const FONT_SIZE = 13;
const SMALL_FONT = 11;
const PRIME_RADIUS = 18;    // radius for factor-tree prime circles

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
  if (!node || !node.children || node.children.length === 0) {
    return NODE_W;
  }
  const childrenWidth = node.children.reduce(
    (sum, c) => sum + measureSubtree(c?.node),
    0
  );
  const gaps = (node.children.length - 1) * SIBLING_GAP;
  return Math.max(NODE_W, childrenWidth + gaps);
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

  // Compute cumulative leaf probability
  let leafProbability: string | undefined;
  if (isLeaf && pathProbabilities.length > 0) {
    leafProbability = multiplyFractions(pathProbabilities);
  }

  if (isLeaf) {
    return {
      x, y,
      w: NODE_W, h: NODE_H,
      node: safeNode,
      children: [],
      subtreeWidth,
      isLeaf,
      leafProbability,
    };
  }

  // Measure children to allocate proportional widths. Filter out entries
  // that are missing (undefined) or have no node payload.
  const children = safeNode.children!.filter((c) => c && c.node !== undefined);
  if (children.length === 0) {
    return {
      x, y,
      w: NODE_W, h: NODE_H,
      node: safeNode,
      children: [],
      subtreeWidth,
      isLeaf: true,
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
    w: NODE_W, h: NODE_H,
    node: safeNode,
    children: positionedChildren,
    subtreeWidth,
    isLeaf,
  };
}

/**
 * Compute the bounding box of the laid-out tree.
 */
function getBounds(layout: LayoutNode): { minX: number; minY: number; maxX: number; maxY: number } {
  let minX = layout.x - layout.w / 2;
  let maxX = layout.x + layout.w / 2;
  let minY = layout.y - layout.h / 2;
  let maxY = layout.y + layout.h / 2;

  // Account for leaf probability labels below leaf nodes
  if (layout.isLeaf && layout.leafProbability) {
    maxY = Math.max(maxY, layout.y + layout.h / 2 + 22);
  }

  for (const child of layout.children) {
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

/** Parse a fraction string like "1/2" or a whole number "3" into [numerator, denominator] */
function parseFraction(s: string): [number, number] {
  const trimmed = s.trim();
  if (trimmed.includes('/')) {
    const [n, d] = trimmed.split('/').map(Number);
    return [n, d];
  }
  return [Number(trimmed), 1];
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

    // Branch label (probability or text)
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    // Offset label slightly to the side so it doesn't overlap the line
    const dx = x2 - x1;
    const offsetX = dx === 0 ? -20 : (dx > 0 ? -14 : 14);

    if (child.probability) {
      // Probability label in red
      elements.push(
        <text
          key={`${keyPrefix}-prob-${i}`}
          x={midX + offsetX}
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
      // Branch label text
      const labelOffsetY = child.probability ? 12 : 0;
      elements.push(
        <text
          key={`${keyPrefix}-blabel-${i}`}
          x={midX + offsetX}
          y={midY - 4 + labelOffsetY}
          textAnchor="middle"
          fill="#475569"
          fontSize={SMALL_FONT}
        >
          {child.label}
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
    // Label text
    elements.push(
      <text
        key={`${keyPrefix}-label`}
        x={x}
        y={node.value ? y - 4 : y + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#1e293b"
        fontSize={FONT_SIZE}
        fontWeight={600}
      >
        {node.label}
      </text>
    );
    // Optional value text (smaller, below the label)
    if (node.value) {
      elements.push(
        <text
          key={`${keyPrefix}-value`}
          x={x}
          y={y + 12}
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

    // If there's a title, add space at the top
    const titleOffset = title ? 30 : 0;

    // 4. Collect SVG elements
    const elements: JSX.Element[] = [];

    // Title text
    if (title) {
      elements.push(
        <text
          key="title"
          x={vbX + vbW / 2}
          y={vbY + 20}
          textAnchor="middle"
          fill="#0f172a"
          fontSize={16}
          fontWeight={700}
        >
          {title}
        </text>
      );
    }

    const viewBoxStr = `${vbX} ${vbY - titleOffset} ${vbW} ${vbH + titleOffset}`;
    // Feat coordinates need viewBox-space translation: our layout's x/y are in
    // the same coord system as the viewBox, so fractions are relative to the
    // viewBox width/height and origin.
    renderTree(layout, type, showLeafProbabilities, elements, 'n',
      { width: vbW, height: vbH + titleOffset, ox: vbX, oy: vbY - titleOffset });

    return { svgContent: elements, viewBox: viewBoxStr };
  }, [root, type, showLeafProbabilities, title]);

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
    <div className="w-full flex justify-center">
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
