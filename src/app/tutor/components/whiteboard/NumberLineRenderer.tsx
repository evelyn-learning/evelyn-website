'use client';

/**
 * Number Line Renderer
 *
 * Renders a number line with points, intervals, and hop arcs using pure SVG.
 * Used by the whiteboard system for math visualizations (fractions, inequalities, etc.).
 */

import { useMemo } from 'react';
import { feat, featSlug, type FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';

// --- Prop types ---

interface NumberLinePoint {
  value: number;
  label?: string;
  color?: string;
  style?: 'filled' | 'open';
}

interface NumberLineInterval {
  from: number;
  to: number;
  fromInclusive?: boolean;
  toInclusive?: boolean;
  color?: string;
  label?: string;
}

interface NumberLineSegment {
  from: number;
  to: number;
  label?: string;
  color?: string;
  arc?: boolean;
}

interface FractionTicks {
  denominator: number;
  showLabels?: boolean;
}

interface NumberLineRendererProps {
  title?: string;
  min: number;
  max: number;
  step?: number;
  points?: NumberLinePoint[];
  intervals?: NumberLineInterval[];
  segments?: NumberLineSegment[];
  fractionTicks?: FractionTicks;
}

// --- Default colors ---
const COLOR_POINT = '#2563eb';   // blue
const COLOR_INTERVAL = '#16a34a'; // green
const COLOR_ARC = '#dc2626';     // red
const COLOR_LINE = '#1e293b';    // slate-800
const COLOR_TICK = '#475569';    // slate-600
const COLOR_LABEL = '#334155';   // slate-700

// --- Layout constants ---
const SVG_WIDTH = 500;
const PADDING_X = 40;            // horizontal padding for arrows
const LINE_Y = 100;              // y-position of the number line
const TICK_HALF = 6;             // half-height of a major tick
const FRACTION_TICK_HALF = 4;    // half-height of a fraction tick
const POINT_RADIUS = 6;
const ARC_HEIGHT = 30;           // height of hop arcs above the line

/**
 * Auto-compute a reasonable step if none provided.
 * Aims for roughly 5-15 ticks across the range.
 */
function computeStep(min: number, max: number): number {
  const range = max - min;
  if (range <= 0) return 1;
  // Nice step candidates
  const niceSteps = [0.1, 0.2, 0.25, 0.5, 1, 2, 5, 10, 20, 25, 50, 100];
  for (const s of niceSteps) {
    if (range / s >= 4 && range / s <= 16) return s;
  }
  // Fallback: divide range into ~10 ticks
  const raw = range / 10;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  return Math.round(raw / mag) * mag || 1;
}

/**
 * Map a value in [min, max] to an x-coordinate in SVG space.
 */
function valueToX(value: number, min: number, max: number): number {
  const usable = SVG_WIDTH - 2 * PADDING_X;
  return PADDING_X + ((value - min) / (max - min)) * usable;
}

/**
 * Format a tick label: strip trailing decimal zeros.
 */
function formatLabel(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(4).replace(/0+$/, '').replace(/\.$/, '');
}

/**
 * Pure manifest builder — enumerates the named features this renderer emits
 * for a given set of props. MUST stay in sync with the feat() calls below.
 * Called by the command handler before the React render so the tutor receives
 * authoritative names in the tool-result JSON and doesn't have to guess.
 */
export function buildNumberLineManifest(props: NumberLineRendererProps): FeatureManifestEntry[] {
  const entries: FeatureManifestEntry[] = [];
  entries.push({
    name: 'axis',
    kind: 'axis',
    description: 'main horizontal number-line axis',
    labels: ['axis', 'number line', 'the line', 'number-line', 'main axis', 'the axis'],
  });

  const step = props.step ?? computeStep(props.min, props.max);
  const tickVals: number[] = [];
  const first = Math.ceil(props.min / step) * step;
  for (let v = first; v <= props.max + step * 0.0001; v += step) {
    tickVals.push(parseFloat(v.toFixed(10)));
  }
  tickVals.forEach((v, i) => {
    const val = formatLabel(v);
    entries.push({
      name: `tick-${i + 1}`,
      kind: 'annotation',
      description: `major tick ${i + 1} at ${val}`,
      labels: [
        `tick-${i + 1}`,
        `tick ${i + 1}`,
        `tick at ${val}`,
        val,
        `${val} tick`,
        `the ${val} mark`,
      ],
    });
  });

  const intervals = props.intervals ?? [];
  intervals.forEach((iv, i) => {
    const name = iv.label ? `interval-${featSlug(iv.label)}` : `interval-${i + 1}`;
    const fromV = formatLabel(iv.from);
    const toV = formatLabel(iv.to);
    const labels = new Set<string>([
      name,
      `interval-${i + 1}`,
      `interval ${i + 1}`,
      `range ${i + 1}`,
      `${fromV} to ${toV}`,
      `from ${fromV} to ${toV}`,
      `the interval from ${fromV} to ${toV}`,
    ]);
    if (iv.label) {
      labels.add(iv.label);
      labels.add(`interval ${iv.label}`);
      labels.add(`the ${iv.label} interval`);
    }
    entries.push({
      name,
      kind: 'segment',
      description: iv.label
        ? `interval "${iv.label}" from ${fromV} to ${toV}`
        : `interval ${i + 1} from ${fromV} to ${toV}`,
      labels: Array.from(labels),
    });
  });

  const points = props.points ?? [];
  points.forEach((pt, i) => {
    const name = pt.label ? `point-${featSlug(pt.label)}` : `point-${i + 1}`;
    const val = formatLabel(pt.value);
    const labels = new Set<string>([
      name,
      `point-${i + 1}`,
      `point ${i + 1}`,
      val,
      `point ${val}`,
      `the ${val}`,
      `${val} on the line`,
      `point at ${val}`,
    ]);
    if (pt.label) {
      labels.add(pt.label);
      labels.add(`point ${pt.label}`);
      labels.add(`the ${pt.label} point`);
    }
    entries.push({
      name,
      kind: 'point',
      description: pt.label
        ? `point "${pt.label}" at ${val}`
        : `point ${i + 1} at ${val}`,
      labels: Array.from(labels),
    });
  });

  return entries;
}

export function NumberLineRenderer({
  title,
  min,
  max,
  step: stepProp,
  points = [],
  intervals = [],
  segments = [],
  fractionTicks,
}: NumberLineRendererProps) {
  const step = useMemo(() => stepProp ?? computeStep(min, max), [stepProp, min, max]);

  // Determine whether we need extra vertical space above the line (for arcs / labels)
  const hasArcs = segments.some((s) => s.arc);
  const hasPointLabels = points.some((p) => p.label);
  const hasIntervalLabels = intervals.some((iv) => iv.label);
  const svgHeight = hasArcs ? 200 : hasPointLabels || hasIntervalLabels ? 170 : 150;

  // --- Build major tick values ---
  const ticks = useMemo(() => {
    const vals: number[] = [];
    // Start from the first tick >= min that's aligned to the step grid
    const first = Math.ceil(min / step) * step;
    for (let v = first; v <= max + step * 0.0001; v += step) {
      vals.push(parseFloat(v.toFixed(10)));
    }
    return vals;
  }, [min, max, step]);

  // --- Build fraction tick values ---
  const fracTicks = useMemo(() => {
    if (!fractionTicks) return [];
    const { denominator } = fractionTicks;
    const vals: number[] = [];
    const intMin = Math.floor(min);
    const intMax = Math.ceil(max);
    for (let i = intMin; i <= intMax; i++) {
      for (let n = 1; n < denominator; n++) {
        const v = i + n / denominator;
        if (v >= min && v <= max) {
          // Skip if it coincides with a major tick
          if (!ticks.some((t) => Math.abs(t - v) < 1e-9)) {
            vals.push(v);
          }
        }
      }
    }
    return vals;
  }, [fractionTicks, min, max, ticks]);

  // Helper: convert value to SVG x
  const toX = (v: number) => valueToX(v, min, max);

  return (
    <div className="w-full flex flex-col items-center gap-2">
      {/* Optional title */}
      {title && (
        <h3 className="text-sm font-semibold text-slate-700 text-center">{title}</h3>
      )}

      <svg
        viewBox={`0 0 ${SVG_WIDTH} ${svgHeight}`}
        className="w-full max-w-[600px]"
        role="img"
        aria-label={title ?? 'Number line'}
      >
        {/* ======================== Number line axis ======================== */}
        {/* Main horizontal line */}
        <line
          x1={PADDING_X - 12}
          y1={LINE_Y}
          x2={SVG_WIDTH - PADDING_X + 12}
          y2={LINE_Y}
          stroke={COLOR_LINE}
          strokeWidth={2}
          {...feat('axis', { cx: SVG_WIDTH / 2, cy: LINE_Y, w: SVG_WIDTH - PADDING_X * 2 + 28, h: 20 }, { width: SVG_WIDTH, height: svgHeight })}
        />

        {/* Left arrow */}
        <polyline
          points={`${PADDING_X - 4},${LINE_Y - 5} ${PADDING_X - 12},${LINE_Y} ${PADDING_X - 4},${LINE_Y + 5}`}
          fill="none"
          stroke={COLOR_LINE}
          strokeWidth={2}
          strokeLinejoin="round"
        />

        {/* Right arrow */}
        <polyline
          points={`${SVG_WIDTH - PADDING_X + 4},${LINE_Y - 5} ${SVG_WIDTH - PADDING_X + 12},${LINE_Y} ${SVG_WIDTH - PADDING_X + 4},${LINE_Y + 5}`}
          fill="none"
          stroke={COLOR_LINE}
          strokeWidth={2}
          strokeLinejoin="round"
        />

        {/* ======================== Major ticks + labels ======================== */}
        {ticks.map((v, i) => {
          const x = toX(v);
          return (
            <g key={`tick-${v}`} {...feat(`tick-${i + 1}`, { cx: x, cy: LINE_Y, w: 20, h: 30 }, { width: SVG_WIDTH, height: svgHeight })}>
              <line
                x1={x}
                y1={LINE_Y - TICK_HALF}
                x2={x}
                y2={LINE_Y + TICK_HALF}
                stroke={COLOR_TICK}
                strokeWidth={1.5}
              />
              <text
                x={x}
                y={LINE_Y + TICK_HALF + 14}
                textAnchor="middle"
                fontSize={11}
                fill={COLOR_LABEL}
                fontFamily="system-ui, sans-serif"
              >
                {formatLabel(v)}
              </text>
            </g>
          );
        })}

        {/* ======================== Fraction ticks ======================== */}
        {fracTicks.map((v) => {
          const x = toX(v);
          return (
            <g key={`frac-${v}`}>
              <line
                x1={x}
                y1={LINE_Y - FRACTION_TICK_HALF}
                x2={x}
                y2={LINE_Y + FRACTION_TICK_HALF}
                stroke={COLOR_TICK}
                strokeWidth={1}
              />
              {fractionTicks?.showLabels && (
                <text
                  x={x}
                  y={LINE_Y + FRACTION_TICK_HALF + 12}
                  textAnchor="middle"
                  fontSize={9}
                  fill={COLOR_LABEL}
                  fontFamily="system-ui, sans-serif"
                >
                  {formatLabel(v)}
                </text>
              )}
            </g>
          );
        })}

        {/* ======================== Intervals ======================== */}
        {intervals.map((iv, i) => {
          const x1 = toX(iv.from);
          const x2 = toX(iv.to);
          const color = iv.color ?? COLOR_INTERVAL;
          const ivName = iv.label ? `interval-${featSlug(iv.label)}` : `interval-${i + 1}`;
          return (
            <g key={`interval-${i}`} {...feat(ivName, { cx: (x1 + x2) / 2, cy: LINE_Y, w: Math.max(30, Math.abs(x2 - x1) + 30), h: 40 }, { width: SVG_WIDTH, height: svgHeight })}>
              {/* Thick colored line between endpoints */}
              <line
                x1={x1}
                y1={LINE_Y}
                x2={x2}
                y2={LINE_Y}
                stroke={color}
                strokeWidth={4}
                strokeLinecap="round"
              />

              {/* Left endpoint: filled or open circle */}
              <circle
                cx={x1}
                cy={LINE_Y}
                r={POINT_RADIUS}
                fill={iv.fromInclusive ? color : 'white'}
                stroke={color}
                strokeWidth={2}
              />

              {/* Right endpoint: filled or open circle */}
              <circle
                cx={x2}
                cy={LINE_Y}
                r={POINT_RADIUS}
                fill={iv.toInclusive ? color : 'white'}
                stroke={color}
                strokeWidth={2}
              />

              {/* Optional interval label (centered above) */}
              {iv.label && (
                <text
                  x={(x1 + x2) / 2}
                  y={LINE_Y - 16}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight="600"
                  fill={color}
                  fontFamily="system-ui, sans-serif"
                >
                  {iv.label}
                </text>
              )}
            </g>
          );
        })}

        {/* ======================== Segments / hop arcs ======================== */}
        {segments.map((seg, i) => {
          const x1 = toX(seg.from);
          const x2 = toX(seg.to);
          const color = seg.color ?? COLOR_ARC;

          if (seg.arc) {
            // Curved arc above the number line
            const midX = (x1 + x2) / 2;
            const arcY = LINE_Y - ARC_HEIGHT;
            // Quadratic bezier: start at line, peak above, end at line
            const d = `M ${x1} ${LINE_Y} Q ${midX} ${arcY - 10} ${x2} ${LINE_Y}`;
            return (
              <g key={`seg-${i}`}>
                <path
                  d={d}
                  fill="none"
                  stroke={color}
                  strokeWidth={2}
                  strokeLinecap="round"
                />
                {/* Arrowhead at the end of the arc */}
                <circle cx={x2} cy={LINE_Y} r={3} fill={color} />
                {/* Label at the apex */}
                {seg.label && (
                  <text
                    x={midX}
                    y={arcY - 14}
                    textAnchor="middle"
                    fontSize={11}
                    fontWeight="600"
                    fill={color}
                    fontFamily="system-ui, sans-serif"
                  >
                    {seg.label}
                  </text>
                )}
              </g>
            );
          }

          // Straight segment (no arc)
          return (
            <g key={`seg-${i}`}>
              <line
                x1={x1}
                y1={LINE_Y}
                x2={x2}
                y2={LINE_Y}
                stroke={color}
                strokeWidth={3}
                strokeLinecap="round"
              />
              {seg.label && (
                <text
                  x={(x1 + x2) / 2}
                  y={LINE_Y - 12}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight="600"
                  fill={color}
                  fontFamily="system-ui, sans-serif"
                >
                  {seg.label}
                </text>
              )}
            </g>
          );
        })}

        {/* ======================== Points ======================== */}
        {points.map((pt, i) => {
          const x = toX(pt.value);
          const color = pt.color ?? COLOR_POINT;
          const isFilled = pt.style !== 'open';
          const ptName = pt.label ? `point-${featSlug(pt.label)}` : `point-${i + 1}`;
          return (
            <g key={`point-${i}`} {...feat(ptName, { cx: x, cy: LINE_Y, w: 28, h: 32 }, { width: SVG_WIDTH, height: svgHeight })}>
              <circle
                cx={x}
                cy={LINE_Y}
                r={POINT_RADIUS}
                fill={isFilled ? color : 'white'}
                stroke={color}
                strokeWidth={2}
              />
              {pt.label && (
                <text
                  x={x}
                  y={LINE_Y - POINT_RADIUS - 6}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight="600"
                  fill={color}
                  fontFamily="system-ui, sans-serif"
                >
                  {pt.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default NumberLineRenderer;
