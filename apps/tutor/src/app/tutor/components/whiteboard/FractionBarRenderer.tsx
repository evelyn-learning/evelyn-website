'use client';

import { InlineMathText } from './InlineMathText';
/**
 * Fraction Bar Renderer
 *
 * Renders fraction visualizations as bars, circles (pie charts), or grids
 * using pure SVG. Supports horizontal/vertical layouts and optional
 * comparison alignment lines between items.
 */

import { useMemo } from 'react';
import { feat, type FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';
// Width-aware layout (2026-08-07, embed-1786139818867): the viewBox used to
// be sized from the shapes alone, so a long item label centered under a
// small shape clipped on both sides ("One planted square out of four" →
// "anted square out"). All sizing constants + the layout pass now live in
// the pure module so the unit suite exercises them headless.
import {
  computeFractionLayout,
  gridDimensions,
  BAR_WIDTH,
  BAR_HEIGHT,
  CIRCLE_RADIUS,
  ITEM_GAP,
  WHOLE_GAP,
  wholesFor,
  gridCell,
  LABEL_FONT_SIZE,
  LABEL_LINE_HEIGHT,
} from './fraction-bar-layout';

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
const OUTLINE_COLOR = '#64748b';
const LABEL_COLOR = '#334155';

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

// ---------------------------------------------------------------------------
// Sub-renderers
// ---------------------------------------------------------------------------

const FILLED_LINE = '#ffffff';

/** Cells shaded in whole number `w` (0-based) of a fraction. */
function filledIn(numerator: number, denominator: number, w: number): number {
  return Math.max(0, Math.min(denominator, numerator - w * denominator));
}

/** Render a bar-style fraction at a given origin (one bar per whole). */
function renderBar(
  x: number,
  y: number,
  numerator: number,
  denominator: number,
  color: string,
  barIdx: number,
  viewbox: { width: number; height: number },
): React.ReactElement[] {
  const partWidth = BAR_WIDTH / denominator;
  const elements: React.ReactElement[] = [];
  const wholes = wholesFor(numerator, denominator);

  for (let w = 0; w < wholes; w++) {
    const x0 = x + w * (BAR_WIDTH + WHOLE_GAP);
    const filled = filledIn(numerator, denominator, w);
    for (let i = 0; i < denominator; i++) {
      const shaded = i < filled;
      const part = w * denominator + i + 1;
      elements.push(
        <rect
          key={`bar-${w}-${i}`}
          x={x0 + i * partWidth}
          y={y}
          width={partWidth}
          height={BAR_HEIGHT}
          fill={shaded ? color : UNSHADED_COLOR}
          {...feat(`part-${barIdx + 1}-${part}`, { cx: x0 + (i + 0.5) * partWidth, cy: y + BAR_HEIGHT / 2, w: partWidth, h: BAR_HEIGHT }, viewbox)}
        />,
      );
    }
    // Partition lines: white across the shaded part, grey across the rest.
    if (partWidth >= 2.5) {
      for (let i = 1; i < denominator; i++) {
        elements.push(
          <line
            key={`div-${w}-${i}`}
            x1={x0 + i * partWidth}
            y1={y}
            x2={x0 + i * partWidth}
            y2={y + BAR_HEIGHT}
            stroke={i <= filled ? FILLED_LINE : BORDER_COLOR}
            strokeWidth={partWidth < 6 ? 0.6 : 1.25}
          />,
        );
      }
    }
    elements.push(
      <rect
        key={`bar-outline-${w}`}
        x={x0}
        y={y}
        width={BAR_WIDTH}
        height={BAR_HEIGHT}
        fill="none"
        stroke={OUTLINE_COLOR}
        strokeWidth={1.5}
      />,
    );
  }

  return elements;
}

/** Render a circle (pie) style fraction; `cx` is the first whole's centre. */
function renderCircle(
  cx0: number,
  cy: number,
  numerator: number,
  denominator: number,
  color: string,
  barIdx: number,
  viewbox: { width: number; height: number },
): React.ReactElement[] {
  const elements: React.ReactElement[] = [];
  const sectorAngle = 360 / denominator;
  const wholes = wholesFor(numerator, denominator);

  for (let w = 0; w < wholes; w++) {
    const cx = cx0 + w * (2 * CIRCLE_RADIUS + WHOLE_GAP);
    const filled = filledIn(numerator, denominator, w);
    for (let i = 0; i < denominator; i++) {
      const shaded = i < filled;
      const startAngle = i * sectorAngle;
      const endAngle = startAngle + sectorAngle;
      // Approximate sector center — midpoint between the center and the rim at mid-angle
      const midRad = ((startAngle + endAngle) / 2 - 90) * (Math.PI / 180);
      const pcx = cx + (CIRCLE_RADIUS / 2) * Math.cos(midRad);
      const pcy = cy + (CIRCLE_RADIUS / 2) * Math.sin(midRad);
      elements.push(
        <path
          key={`sector-${w}-${i}`}
          d={sectorPath(cx, cy, CIRCLE_RADIUS, startAngle, endAngle)}
          fill={shaded ? color : UNSHADED_COLOR}
          {...feat(`part-${barIdx + 1}-${w * denominator + i + 1}`, { cx: pcx, cy: pcy, w: CIRCLE_RADIUS, h: CIRCLE_RADIUS }, viewbox)}
        />,
      );
    }
    // Spokes: white between two shaded sectors, grey elsewhere.
    if (denominator > 1 && denominator <= 72) {
      for (let i = 0; i < denominator; i++) {
        const end = polarToCartesian(cx, cy, CIRCLE_RADIUS, i * sectorAngle);
        const betweenShaded = filled >= denominator ? true : i > 0 && i < filled;
        elements.push(
          <line
            key={`spoke-${w}-${i}`}
            x1={cx}
            y1={cy}
            x2={end.x}
            y2={end.y}
            stroke={betweenShaded ? FILLED_LINE : BORDER_COLOR}
            strokeWidth={1.25}
          />,
        );
      }
    }
    elements.push(
      <circle
        key={`circle-outline-${w}`}
        cx={cx}
        cy={cy}
        r={CIRCLE_RADIUS}
        fill="none"
        stroke={OUTLINE_COLOR}
        strokeWidth={1.5}
      />,
    );
  }

  return elements;
}

/** Render a grid-style fraction at a given origin (one grid per whole). */
function renderGrid(
  x: number,
  y: number,
  numerator: number,
  denominator: number,
  color: string,
  barIdx: number,
  viewbox: { width: number; height: number },
): React.ReactElement[] {
  const { rows, cols } = gridDimensions(denominator);
  const cell = gridCell(denominator);
  const elements: React.ReactElement[] = [];
  const wholes = wholesFor(numerator, denominator);

  for (let w = 0; w < wholes; w++) {
    const x0 = x + w * (cols * cell + WHOLE_GAP);
    const filled = filledIn(numerator, denominator, w);
    let cellIndex = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (cellIndex >= denominator) break;
        const shaded = cellIndex < filled;
        elements.push(
          <rect
            key={`grid-${w}-${cellIndex}`}
            x={x0 + c * cell}
            y={y + r * cell}
            width={cell}
            height={cell}
            fill={shaded ? color : UNSHADED_COLOR}
            stroke={shaded ? FILLED_LINE : BORDER_COLOR}
            strokeWidth={1}
            {...feat(`part-${barIdx + 1}-${w * denominator + cellIndex + 1}`, { cx: x0 + (c + 0.5) * cell, cy: y + (r + 0.5) * cell, w: cell, h: cell }, viewbox)}
          />,
        );
        cellIndex++;
      }
    }
    // Outline only when the grid is a full rectangle.
    if (rows * cols === denominator) {
      elements.push(
        <rect key={`grid-outline-${w}`} x={x0} y={y} width={cols * cell} height={rows * cell} fill="none" stroke={OUTLINE_COLOR} strokeWidth={1.5} />,
      );
    }
  }

  return elements;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Pure manifest builder — enumerates the named features this renderer emits
 * for a given set of props. MUST stay in sync with the feat() calls below.
 * Called by the command handler before the React render so the tutor receives
 * authoritative names in the tool-result JSON and doesn't have to guess.
 */
/** Spell a small integer as an English word for "one half", "two thirds", etc. */
function numberWord(n: number): string {
  const words = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
  return words[n] ?? String(n);
}
function denomWord(d: number, plural: boolean): string {
  const map: Record<number, [string, string]> = {
    2: ['half', 'halves'],
    3: ['third', 'thirds'],
    4: ['quarter', 'quarters'],
    5: ['fifth', 'fifths'],
    6: ['sixth', 'sixths'],
    7: ['seventh', 'sevenths'],
    8: ['eighth', 'eighths'],
    9: ['ninth', 'ninths'],
    10: ['tenth', 'tenths'],
    12: ['twelfth', 'twelfths'],
  };
  const pair = map[d];
  if (!pair) return plural ? `${d}ths` : `${d}th`;
  return plural ? pair[1] : pair[0];
}
function ordinal(n: number): string {
  const ords = ['zeroth', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth'];
  return ords[n] ?? `${n}th`;
}

export function buildFractionBarManifest(props: FractionBarRendererProps): FeatureManifestEntry[] {
  const entries: FeatureManifestEntry[] = [];
  const items = props.items ?? [];
  items.forEach((item, idx) => {
    const labelText = item.label ?? `${item.numerator}/${item.denominator}`;
    const style = item.style ?? 'bar';
    const fracSpoken = `${numberWord(item.numerator)} ${denomWord(item.denominator, item.numerator !== 1)}`;
    const barLabels = new Set<string>([
      `bar-${idx + 1}`,
      `bar ${idx + 1}`,
      `${style} ${idx + 1}`,
      `${style}-${idx + 1}`,
      `fraction ${idx + 1}`,
      `${ordinal(idx + 1)} ${style}`,
      `the ${ordinal(idx + 1)} bar`,
      `${item.numerator}/${item.denominator}`,
      fracSpoken,
    ]);
    if (item.label) {
      barLabels.add(item.label);
      barLabels.add(`the ${item.label}`);
    }
    entries.push({
      name: `bar-${idx + 1}`,
      kind: 'shape',
      description: `${style} fraction ${idx + 1} (${labelText})`,
      labels: Array.from(barLabels),
    });
    // One set of parts per whole (5/4 → two wholes → 8 parts).
    const partCount = item.denominator * wholesFor(item.numerator, item.denominator);
    for (let i = 0; i < partCount; i++) {
      const shaded = i < item.numerator;
      const unitFrac = `1/${item.denominator}`;
      const unitSpoken = `one ${denomWord(item.denominator, false)}`;
      const partLabels = new Set<string>([
        `part-${idx + 1}-${i + 1}`,
        `part ${i + 1}`,
        `part ${idx + 1}-${i + 1}`,
        `${ordinal(i + 1)} part`,
        `the ${ordinal(i + 1)} piece`,
        `piece ${i + 1}`,
        `section ${i + 1}`,
        unitFrac,
        unitSpoken,
      ]);
      if (shaded) {
        partLabels.add(`shaded part ${i + 1}`);
        partLabels.add(`shaded piece ${i + 1}`);
      } else {
        partLabels.add(`unshaded part ${i + 1}`);
        partLabels.add(`empty part ${i + 1}`);
      }
      entries.push({
        name: `part-${idx + 1}-${i + 1}`,
        kind: 'region',
        description: `${style} ${idx + 1}, part ${i + 1} (${shaded ? 'shaded' : 'unshaded'})`,
        labels: Array.from(partLabels),
      });
    }
  });
  return entries;
}

export function FractionBarRenderer({
  title,
  items,
  layout = 'horizontal',
  showComparison = false,
}: FractionBarRendererProps) {
  // Comparing bars only works when they share a left edge, so a comparison
  // of bars is always stacked; a guide then drops from the end of each
  // shaded length across all the bars.
  const allBars = items.length > 1 && items.every((it) => (it.style ?? 'bar') === 'bar');
  const compareBars = showComparison && allBars;
  const effLayout: 'vertical' | 'horizontal' = compareBars ? 'vertical' : layout;

  /**
   * Pre-compute positions and total SVG dimensions so the viewBox scales
   * automatically to fit all items — INCLUDING their (possibly wrapped)
   * labels, so a long label under a small shape can't clip.
   */
  const { positions, viewWidth, viewHeight } = useMemo(() => {
    const base = computeFractionLayout(items, effLayout);
    if (!compareBars) return base;
    // Left-align every bar on one edge (the layout centres each bar over its
    // own label, which would stagger bars with labels of different widths).
    const left = Math.min(...base.positions.map((p) => p.shapeX));
    return {
      ...base,
      positions: base.positions.map((p) => ({ ...p, shapeX: left, labelX: left + p.shapeW / 2 })),
    };
  }, [items, effLayout, compareBars]);

  // Shown larger than its own units so the labels read comfortably; small
  // figures are capped so two short bars do not balloon.
  const displayW = Math.min(780, Math.max(viewWidth * 1.3, Math.min(viewWidth * 1.6, 300)));

  return (
    <div className="w-full flex flex-col items-center gap-2">
      {/* Optional title — R38: centered SVG text in a shapes-only-width viewBox clipped long titles on both sides */}
      {title && (
        <h3 className="text-sm font-semibold text-slate-700 text-center"><InlineMathText text={title} /></h3>
      )}
      <svg
        viewBox={`0 0 ${viewWidth} ${viewHeight}`}
        width="100%"
        style={{ maxWidth: displayW, display: 'block', margin: '0 auto' }}
        role="img"
        aria-label={title ?? 'Fraction visualization'}
      >
        {/* Comparison guides for stacked bars: one dashed line at the end of each shaded length */}
        {compareBars && (() => {
          const top = Math.min(...positions.map((p) => p.shapeY)) - 6;
          const bottom = Math.max(...positions.map((p) => p.shapeY + p.shapeH)) + 6;
          const seen = new Set<string>();
          return items.map((item, idx) => {
            const pos = positions[idx];
            if (!pos || !(item.denominator > 0) || !(item.numerator > 0)) return null;
            const wholes = wholesFor(item.numerator, item.denominator);
            const lastFilled = item.numerator - (wholes - 1) * item.denominator;
            const gx = pos.shapeX + (wholes - 1) * (BAR_WIDTH + WHOLE_GAP) + (lastFilled / item.denominator) * BAR_WIDTH;
            const key = gx.toFixed(1);
            if (seen.has(key)) return null;
            seen.add(key);
            return (
              <line
                key={`guide-${idx}`}
                x1={gx}
                y1={top}
                x2={gx}
                y2={bottom}
                stroke={item.highlightColor ?? DEFAULT_COLOR}
                strokeOpacity={0.55}
                strokeWidth={1.25}
                strokeDasharray="4 3"
              />
            );
          });
        })()}

        {/* Render each fraction item */}
        {items.map((item, idx) => {
          const pos = positions[idx];
          if (!pos) return null;

          const color = item.highlightColor ?? DEFAULT_COLOR;
          const style = item.style ?? 'bar';

          return (
            <g key={idx} {...feat(`bar-${idx + 1}`, { cx: pos.shapeX + pos.shapeW / 2, cy: pos.shapeY + pos.shapeH / 2, w: pos.shapeW + 10, h: pos.shapeH + 10 }, { width: viewWidth, height: viewHeight })}>
              {/* Shape — centered inside the item box when the label is wider */}
              {style === 'bar' && renderBar(pos.shapeX, pos.shapeY, item.numerator, item.denominator, color, idx, { width: viewWidth, height: viewHeight })}
              {style === 'circle' &&
                renderCircle(
                  pos.shapeX + CIRCLE_RADIUS,
                  pos.shapeY + CIRCLE_RADIUS,
                  item.numerator,
                  item.denominator,
                  color,
                  idx,
                  { width: viewWidth, height: viewHeight },
                )}
              {style === 'grid' && renderGrid(pos.shapeX, pos.shapeY, item.numerator, item.denominator, color, idx, { width: viewWidth, height: viewHeight })}

              {/* Fraction label — wrapped lines, each centered */}
              <text
                x={pos.labelX}
                y={pos.labelY}
                textAnchor="middle"
                fontSize={LABEL_FONT_SIZE}
                fontWeight={600}
                fill={LABEL_COLOR}
                fontFamily="system-ui, sans-serif"
                stroke="#ffffff"
                strokeWidth={compareBars ? 3 : 0}
                paintOrder="stroke"
              >
                {pos.labelLines.map((line, li) => (
                  <tspan key={li} x={pos.labelX} dy={li === 0 ? 0 : LABEL_LINE_HEIGHT}>
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          );
        })}

      {/* Separators between unlike shapes (horizontal layout only) */}
      {showComparison &&
        !compareBars &&
        effLayout === 'horizontal' &&
        positions.length > 1 &&
        positions.slice(0, -1).map((pos, idx) => {
          const next = positions[idx + 1];
          if (!next || next.y !== pos.y) return null; // row wrapped: nothing to separate

          // Vertical dotted line halfway between current item's right edge and next item's left edge.
          // Span the SHAPES (not the item boxes — those now include label lines).
          const lineX = pos.x + pos.w + ITEM_GAP / 2;
          const topY = Math.min(pos.shapeY, next.shapeY) - 4;
          const bottomY = Math.max(pos.shapeY + pos.shapeH, next.shapeY + next.shapeH) + 4;

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
    </div>
  );
}

export default FractionBarRenderer;
