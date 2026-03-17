'use client';

/**
 * Tree Renderer
 *
 * Renders tree diagrams (probability trees, factor trees, decision trees)
 * with automatic layout using pure SVG. Supports up to 4 levels deep
 * and branching factor up to 6.
 */

import { useMemo } from 'react';

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
function measureSubtree(node: TreeNode): number {
  if (!node.children || node.children.length === 0) {
    return NODE_W;
  }
  const childrenWidth = node.children.reduce(
    (sum, c) => sum + measureSubtree(c.node),
    0
  );
  // Add gaps between children
  const gaps = (node.children.length - 1) * SIBLING_GAP;
  return Math.max(NODE_W, childrenWidth + gaps);
}

/**
 * Second pass — assign (x, y) positions to every node.
 * `xStart` is the left edge of the horizontal band allocated for this subtree.
 */
function positionNode(
  node: TreeNode,
  depth: number,
  xStart: number,
  subtreeWidth: number,
  pathProbabilities: string[],
): LayoutNode {
  const isLeaf = !node.children || node.children.length === 0;
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
      node,
      children: [],
      subtreeWidth,
      isLeaf,
      leafProbability,
    };
  }

  // Measure children to allocate proportional widths
  const childMeasures = node.children!.map((c) => measureSubtree(c.node));
  const totalChildWidth = childMeasures.reduce((a, b) => a + b, 0);
  const totalGaps = (node.children!.length - 1) * SIBLING_GAP;
  const availableForChildren = Math.max(subtreeWidth, totalChildWidth + totalGaps);

  // Lay out children left-to-right within our band
  let cursor = xStart + (subtreeWidth - availableForChildren) / 2;
  const positionedChildren = node.children!.map((child, i) => {
    // Proportional allocation
    const ratio = childMeasures[i] / totalChildWidth;
    const childBand = ratio * (availableForChildren - totalGaps);
    const ln = positionNode(
      child.node,
      depth + 1,
      cursor,
      childBand,
      [...pathProbabilities, ...(child.probability ? [child.probability] : [])],
    );
    cursor += childBand + SIBLING_GAP;
    return { label: child.label, probability: child.probability, layoutNode: ln };
  });

  return {
    x, y,
    w: NODE_W, h: NODE_H,
    node,
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
) {
  const { x, y, w, h, node, children, isLeaf, leafProbability } = layout;
  const primeLeaf = isPrimeLeaf(type, node, isLeaf);

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
    renderTree(child.layoutNode, type, showLeafProbabilities, elements, `${keyPrefix}-${i}`);
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

export function TreeRenderer({
  title,
  type = 'generic',
  root,
  showLeafProbabilities = false,
  direction = 'top-down',
}: TreeRendererProps) {
  const { svgContent, viewBox } = useMemo(() => {
    // 1. Measure the full subtree width
    const totalWidth = measureSubtree(root);

    // 2. Position every node
    const layout = positionNode(root, 0, 0, totalWidth, []);

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

    renderTree(layout, type, showLeafProbabilities, elements, 'n');

    const viewBoxStr = `${vbX} ${vbY - titleOffset} ${vbW} ${vbH + titleOffset}`;

    return { svgContent: elements, viewBox: viewBoxStr };
  }, [root, type, showLeafProbabilities, title]);

  // For left-right direction, we apply a 90-degree rotation and swap the viewBox axes.
  // This keeps the layout logic simple (always top-down) and rotates the output.
  const isLeftRight = direction === 'left-right';
  const transform = isLeftRight ? 'rotate(90) scale(1, -1)' : undefined;

  return (
    <div className="w-full flex justify-center">
      <svg
        viewBox={viewBox}
        className="w-full max-w-full"
        style={{ maxHeight: '500px' }}
        preserveAspectRatio="xMidYMid meet"
      >
        {isLeftRight ? (
          <g transform={transform}>{svgContent}</g>
        ) : (
          svgContent
        )}
      </svg>
    </div>
  );
}

export default TreeRenderer;
