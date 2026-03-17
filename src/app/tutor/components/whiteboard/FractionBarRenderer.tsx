'use client';

/**
 * Fraction Bar Renderer
 *
 * Renders fraction visualizations as bars, circles (pie charts), or grids
 * using pure SVG. Supports horizontal/vertical layouts and optional
 * comparison alignment lines between items.
 */

import { useMemo } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FractionItem {
  numerator: number;
  denominator: number;
  label?: string;
  highlightColor?: string;
  style?: 'bar' | 'circle' | 'grid';
}

interface FractionBarRendererProps {
  title?: string;
  items: FractionItem[];
  layout?: 'vertical' | 'horizontal';
  showComparison?: boolean;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DEFAULT_COLOR = '#2563eb';
const UNSHADED_COLOR = '#f1f5f9';
const BORDER_COLOR = '#cbd5e1';
const LABEL_COLOR = '#334155';

/** Spacing and sizing (in SVG user units) */
const BAR_WIDTH = 160;
const BAR_HEIGHT = 32;
const CIRCLE_RADIUS = 48;
const GRID_CELL = 28;

const ITEM_GAP = 40; // gap between items
const PADDING = 24; // canvas padding
const LABEL_OFFSET = 22; // space below shape for label text
const TITLE_HEIGHT = 28; // reserved height for title

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Convert polar coordinates to cartesian for SVG arc commands.
 */
function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/**
 * Build an SVG arc path for a single pie sector.
 */
function sectorPath(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
): string {
  // Full circle edge case
  if (endAngle - startAngle >= 360) {
    return [
      `M ${cx} ${cy - r}`,
      `A ${r} ${r} 0 1 1 ${cx - 0.001} ${cy - r}`,
      'Z',
    ].join(' ');
  }
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`,
    'Z',
  ].join(' ');
}

/**
 * Compute a roughly-square grid layout (rows x cols) for `total` cells.
 */
function gridDimensions(total: number): { rows: number; cols: number } {
  const cols = Math.ceil(Math.sqrt(total));
  const rows = Math.ceil(total / cols);
  return { rows, cols };
}

// ---------------------------------------------------------------------------
// Sub-renderers
// ---------------------------------------------------------------------------

/** Render a bar-style fraction at a given origin. */
function renderBar(
  x: number,
  y: number,
  numerator: number,
  denominator: number,
  color: string,
): React.ReactElement[] {
  const partWidth = BAR_WIDTH / denominator;
  const elements: React.ReactElement[] = [];

  for (let i = 0; i < denominator; i++) {
    const shaded = i < numerator;
    elements.push(
      <rect
        key={`bar-${i}`}
        x={x + i * partWidth}
        y={y}
        width={partWidth}
        height={BAR_HEIGHT}
        fill={shaded ? color : UNSHADED_COLOR}
        stroke={BORDER_COLOR}
        strokeWidth={1}
        rx={i === 0 ? 3 : i === denominator - 1 ? 3 : 0}
      />,
    );
  }

  // Outer border with rounded corners
  elements.push(
    <rect
      key="bar-outline"
      x={x}
      y={y}
      width={BAR_WIDTH}
      height={BAR_HEIGHT}
      fill="none"
      stroke={BORDER_COLOR}
      strokeWidth={1.5}
      rx={3}
    />,
  );

  return elements;
}

/** Render a circle (pie) style fraction at a given center. */
function renderCircle(
  cx: number,
  cy: number,
  numerator: number,
  denominator: number,
  color: string,
): React.ReactElement[] {
  const elements: React.ReactElement[] = [];
  const sectorAngle = 360 / denominator;

  for (let i = 0; i < denominator; i++) {
    const shaded = i < numerator;
    const startAngle = i * sectorAngle;
    const endAngle = startAngle + sectorAngle;

    elements.push(
      <path
        key={`sector-${i}`}
        d={sectorPath(cx, cy, CIRCLE_RADIUS, startAngle, endAngle)}
        fill={shaded ? color : UNSHADED_COLOR}
        stroke={BORDER_COLOR}
        strokeWidth={1}
      />,
    );
  }

  // Outer ring
  elements.push(
    <circle
      key="circle-outline"
      cx={cx}
      cy={cy}
      r={CIRCLE_RADIUS}
      fill="none"
      stroke={BORDER_COLOR}
      strokeWidth={1.5}
    />,
  );

  return elements;
}

/** Render a grid-style fraction at a given origin. */
function renderGrid(
  x: number,
  y: number,
  numerator: number,
  denominator: number,
  color: string,
): React.ReactElement[] {
  const { rows, cols } = gridDimensions(denominator);
  const elements: React.ReactElement[] = [];
  let cellIndex = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (cellIndex >= denominator) break;
      const shaded = cellIndex < numerator;
      elements.push(
        <rect
          key={`grid-${cellIndex}`}
          x={x + c * GRID_CELL}
          y={y + r * GRID_CELL}
          width={GRID_CELL}
          height={GRID_CELL}
          fill={shaded ? color : UNSHADED_COLOR}
          stroke={BORDER_COLOR}
          strokeWidth={1}
          rx={2}
        />,
      );
      cellIndex++;
    }
  }

  return elements;
}

// ---------------------------------------------------------------------------
// Measurement helpers
// ---------------------------------------------------------------------------

/** Return the bounding width and height of a single fraction item's shape. */
function itemShapeSize(item: FractionItem): { w: number; h: number } {
  const style = item.style ?? 'bar';
  if (style === 'bar') {
    return { w: BAR_WIDTH, h: BAR_HEIGHT };
  }
  if (style === 'circle') {
    return { w: CIRCLE_RADIUS * 2, h: CIRCLE_RADIUS * 2 };
  }
  // Grid
  const { rows, cols } = gridDimensions(item.denominator);
  return { w: cols * GRID_CELL, h: rows * GRID_CELL };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function FractionBarRenderer({
  title,
  items,
  layout = 'horizontal',
  showComparison = false,
}: FractionBarRendererProps) {
  /**
   * Pre-compute positions and total SVG dimensions so the viewBox
   * scales automatically to fit all items.
   */
  const { positions, viewWidth, viewHeight } = useMemo(() => {
    const pos: Array<{ x: number; y: number; w: number; h: number }> = [];
    let cursorX = PADDING;
    let cursorY = PADDING + (title ? TITLE_HEIGHT : 0);
    let maxW = 0;
    let maxH = 0;

    for (const item of items) {
      const { w, h } = itemShapeSize(item);

      if (layout === 'horizontal') {
        pos.push({ x: cursorX, y: cursorY, w, h });
        cursorX += w + ITEM_GAP;
        maxW = cursorX;
        maxH = Math.max(maxH, cursorY + h + LABEL_OFFSET + PADDING);
      } else {
        pos.push({ x: cursorX, y: cursorY, w, h });
        cursorY += h + LABEL_OFFSET + ITEM_GAP;
        maxW = Math.max(maxW, cursorX + w + PADDING);
        maxH = cursorY;
      }
    }

    // Add trailing padding
    if (layout === 'horizontal') {
      maxW += PADDING - ITEM_GAP; // remove last gap, add padding
    } else {
      maxH += PADDING - ITEM_GAP;
    }

    return { positions: pos, viewWidth: Math.max(maxW, 100), viewHeight: Math.max(maxH, 80) };
  }, [items, layout, title]);

  return (
    <svg
      viewBox={`0 0 ${viewWidth} ${viewHeight}`}
      width="100%"
      style={{ maxWidth: viewWidth, display: 'block', margin: '0 auto' }}
      role="img"
      aria-label={title ?? 'Fraction visualization'}
    >
      {/* Optional title */}
      {title && (
        <text
          x={viewWidth / 2}
          y={PADDING + 4}
          textAnchor="middle"
          fontSize={16}
          fontWeight={600}
          fill={LABEL_COLOR}
          fontFamily="system-ui, sans-serif"
        >
          {title}
        </text>
      )}

      {/* Render each fraction item */}
      {items.map((item, idx) => {
        const pos = positions[idx];
        if (!pos) return null;

        const color = item.highlightColor ?? DEFAULT_COLOR;
        const style = item.style ?? 'bar';
        const labelText = item.label ?? `${item.numerator}/${item.denominator}`;

        // Determine shape center-x for label alignment
        const labelX = pos.x + pos.w / 2;
        const labelY = pos.y + pos.h + LABEL_OFFSET - 4;

        return (
          <g key={idx}>
            {/* Shape */}
            {style === 'bar' && renderBar(pos.x, pos.y, item.numerator, item.denominator, color)}
            {style === 'circle' &&
              renderCircle(
                pos.x + CIRCLE_RADIUS,
                pos.y + CIRCLE_RADIUS,
                item.numerator,
                item.denominator,
                color,
              )}
            {style === 'grid' && renderGrid(pos.x, pos.y, item.numerator, item.denominator, color)}

            {/* Fraction label */}
            <text
              x={labelX}
              y={labelY}
              textAnchor="middle"
              fontSize={13}
              fontWeight={500}
              fill={LABEL_COLOR}
              fontFamily="system-ui, sans-serif"
            >
              {labelText}
            </text>
          </g>
        );
      })}

      {/* Comparison alignment lines (horizontal layout only) */}
      {showComparison &&
        layout === 'horizontal' &&
        positions.length > 1 &&
        positions.slice(0, -1).map((pos, idx) => {
          const next = positions[idx + 1];
          if (!next) return null;

          // Vertical dotted line halfway between current item's right edge and next item's left edge
          const lineX = pos.x + pos.w + ITEM_GAP / 2;
          const topY = Math.min(pos.y, next.y) - 4;
          const bottomY = Math.max(pos.y + pos.h, next.y + next.h) + 4;

          return (
            <line
              key={`cmp-${idx}`}
              x1={lineX}
              y1={topY}
              x2={lineX}
              y2={bottomY}
              stroke={BORDER_COLOR}
              strokeWidth={1.5}
              strokeDasharray="4 4"
            />
          );
        })}
    </svg>
  );
}

export default FractionBarRenderer;
