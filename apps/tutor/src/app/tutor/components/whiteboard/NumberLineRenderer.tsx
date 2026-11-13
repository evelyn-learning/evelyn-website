'use client';

import { InlineMathText } from './InlineMathText';
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
const PADDING_X = 46;            // horizontal padding for arrows
const ARROW_OVERHANG = 22;       // how far the axis runs past min / max (keeps end markers off the arrowheads)
const TICK_HALF = 6;             // half-height of a major tick
const FRACTION_TICK_HALF = 4;    // half-height of a fraction tick
const POINT_RADIUS = 6;
const ROW_H = 14;                // height of one stacked label row
const MAX_TICKS = 120;           // more ticks than this and the step is coarsened

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
 * The tick step actually drawn. A caller-supplied step that would put more
 * than MAX_TICKS marks on the line (e.g. step 1 over a range of 5000) is
 * coarsened by 2 / 5 / 10 … so the marks stay distinguishable. Shared by the
 * renderer and the manifest builder so tick names never drift apart.
 */
function effectiveStep(min: number, max: number, stepProp?: number): number {
  let step = stepProp && stepProp > 0 ? stepProp : computeStep(min, max);
  const range = max - min;
  if (!(range > 0)) return step;
  const mults = [2, 5, 10];
  let k = 0;
  const base = step;
  let decade = 1;
  while (range / step > MAX_TICKS) {
    step = base * mults[k % 3] * decade;
    k++;
    if (k % 3 === 0) decade *= 10;
  }
  return step;
}

/** Estimated width of a label, in SVG units (semi-bold sans). */
function textW(text: string, fontSize: number): number {
  return text.length * fontSize * 0.6;
}

/** a/b in lowest terms for a value sitting on a 1/denominator grid. */
function toFraction(v: number, denominator: number): { whole: number; num: number; den: number; neg: boolean } {
  const neg = v < 0;
  const total = Math.round(Math.abs(v) * denominator);
  const whole = Math.floor(total / denominator);
  let num = total - whole * denominator;
  let den = denominator;
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const g = gcd(num, den) || 1;
  num /= g; den /= g;
  return { whole, num, den, neg };
}

interface RowBox { left: number; right: number }
/** Greedy row packing: the lowest row whose boxes the new box clears. */
function assignRow(rows: RowBox[][], left: number, right: number, gap = 6): number {
  for (let r = 0; r < rows.length; r++) {
    if (rows[r].every((b) => right + gap <= b.left || left - gap >= b.right)) {
      rows[r].push({ left, right });
      return r;
    }
  }
  rows.push([{ left, right }]);
  return rows.length - 1;
}

/** Keep a centred label of width w inside the canvas. */
function clampCx(cx: number, w: number): number {
  const half = w / 2;
  if (w >= SVG_WIDTH - 4) return SVG_WIDTH / 2;
  return Math.max(2 + half, Math.min(SVG_WIDTH - 2 - half, cx));
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

  const step = effectiveStep(props.min, props.max, props.step);
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
  const step = useMemo(() => effectiveStep(min, max, stepProp), [stepProp, min, max]);

  // --- Build major tick values ---
  const ticks = useMemo(() => {
    const vals: number[] = [];
    // Start from the first tick >= min that's aligned to the step grid
    const first = Math.ceil(min / step - 1e-9) * step;
    for (let v = first; v <= max + step * 0.0001; v += step) {
      vals.push(parseFloat(v.toFixed(10)));
    }
    return vals;
  }, [min, max, step]);

  // --- Which major ticks carry a numeral ---
  // Every tick is drawn, but a numeral is printed only every k-th tick
  // (k = 1, 2, 5, 10, …) so neighbours never run into each other. The
  // labelled ticks sit on multiples of k·step, so 0 is always labelled.
  const labelEvery = useMemo(() => {
    if (ticks.length < 2) return 1;
    const spacing = (SVG_WIDTH - 2 * PADDING_X) * step / (max - min);
    const widest = Math.max(...ticks.map((v) => textW(formatLabel(v), 11)));
    const need = widest + 8;
    const mults = [1, 2, 5];
    for (let decade = 1; decade < 1e6; decade *= 10) {
      for (const m of mults) {
        if (m * decade * spacing >= need) return m * decade;
      }
    }
    return 1;
  }, [ticks, step, min, max]);
  const isLabelled = (v: number) => {
    if (labelEvery === 1) return true;
    const idx = Math.round(v / step);
    return idx % labelEvery === 0;
  };

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
          // R38 (embed-1785738371329): step=0.333333 vs fractionTicks 1/3 differ by
          // ~3e-7 — far over the old 1e-9 epsilon, so both passes printed "0.3333"
          // at the same pixel. Compare in step-relative units instead.
          if (!ticks.some((t) => Math.abs(t - v) < step * 1e-3)) {
            vals.push(v);
          }
        }
      }
    }
    return vals;
  }, [fractionTicks, min, max, step, ticks]);

  // Fraction numerals are stacked (numerator over denominator). They are
  // printed on every k-th fraction tick when the ticks are too close.
  const fracLabels = useMemo(() => {
    if (!fractionTicks?.showLabels || fracTicks.length === 0) return { every: 1, show: false };
    const den = fractionTicks.denominator;
    const spacing = (SVG_WIDTH - 2 * PADDING_X) / (max - min) / den;
    const widest = Math.max(...fracTicks.map((v) => {
      const f = toFraction(v, den);
      const stackW = Math.max(String(f.num).length, String(f.den).length) * 9 * 0.6 + 2;
      const wholeW = f.whole > 0 || f.neg ? textW(`${f.neg ? '−' : ''}${f.whole > 0 ? f.whole : ''}`, 10) + 2 : 0;
      return stackW + wholeW;
    }));
    let every = 1;
    while (every * spacing < widest + 5 && every < den) every++;
    // Only skip in a pattern that divides the denominator (so halves /
    // quarters stay labelled rather than an arbitrary subset).
    while (every < den && den % every !== 0) every++;
    return { every, show: true };
  }, [fractionTicks, fracTicks, min, max]);
  const hasFracLabels = fracLabels.show;

  // ── Layout ────────────────────────────────────────────────────────────
  // Above the line, from the line upward: interval labels and point labels
  // packed into rows; then hop arcs, each rising clear of those rows, with
  // its own label over its apex. When the figure has hop arcs the point
  // labels go BELOW the numerals instead, so an arc's leg never runs through
  // the name of the point it starts from.
  const layout = useMemo(() => {
    const X = (v: number) => valueToX(v, min, max);
    const hasArcs = segments.some((s) => s.arc);
    const upRows: RowBox[][] = [];
    const downRows: RowBox[][] = [];
    const pos = new Map<string, { x: number; row: number; side: 'up' | 'down' }>();

    // Straight-segment labels and interval labels hug the line (row 0 first).
    intervals.forEach((iv, i) => {
      if (!iv.label) return;
      const w = textW(iv.label, 11);
      const cx = clampCx((X(iv.from) + X(iv.to)) / 2, w);
      pos.set(`iv-${i}`, { x: cx, row: assignRow(upRows, cx - w / 2, cx + w / 2), side: 'up' });
    });
    segments.forEach((seg, i) => {
      if (!seg.label || seg.arc) return;
      const w = textW(seg.label, 11);
      const cx = clampCx((X(seg.from) + X(seg.to)) / 2, w);
      pos.set(`seg-${i}`, { x: cx, row: assignRow(upRows, cx - w / 2, cx + w / 2), side: 'up' });
    });
    points.forEach((pt, i) => {
      if (!pt.label) return;
      const w = textW(pt.label, 11);
      const cx = clampCx(X(pt.value), w);
      const side: 'up' | 'down' = hasArcs ? 'down' : 'up';
      const rows = side === 'up' ? upRows : downRows;
      pos.set(`pt-${i}`, { x: cx, row: assignRow(rows, cx - w / 2, cx + w / 2), side });
    });

    const upBand = upRows.length * ROW_H; // height taken by label rows above the line

    // Hop arcs: the apex clears the label rows; a wider hop rises higher so
    // a hop drawn over shorter hops stays visibly outside them.
    const arcs = segments.map((seg, i) => {
      if (!seg.arc) return null;
      const x1 = X(seg.from);
      const x2 = X(seg.to);
      const span = Math.abs(x2 - x1);
      // Rows of labels this hop passes over (it must rise clear of them).
      const lo = Math.min(x1, x2);
      const hi = Math.max(x1, x2);
      let rowsUnder = 0;
      upRows.forEach((row, r) => {
        if (row.some((b) => b.right > lo && b.left < hi)) rowsUnder = r + 1;
      });
      const own = Math.max(14, Math.min(40, 10 + span * 0.2));
      const apex = rowsUnder > 0 ? Math.max(own, POINT_RADIUS + 10 + rowsUnder * ROW_H + 8) : own;
      return { i, x1, x2, span, apex };
    });
    // Arc labels: over the apex, packed into rows of their own above the
    // tallest arc they overlap horizontally.
    const arcLabelBoxes: Array<{ left: number; right: number; top: number; bottom: number }> = [];
    const arcLabelPos = new Map<number, { x: number; y: number }>();
    arcs
      .filter((a): a is NonNullable<typeof a> => !!a)
      .sort((a, b) => a.apex - b.apex || a.i - b.i)
      .forEach((a) => {
        const seg = segments[a.i];
        if (!seg.label) return;
        const w = textW(seg.label, 11);
        const cx = clampCx((a.x1 + a.x2) / 2, w);
        const left = cx - w / 2;
        const right = cx + w / 2;
        // Start just above this arc's apex — and above any other arc whose
        // curve passes under the label's width.
        let up = a.apex + 5;
        for (const o of arcs) {
          if (!o || o.i === a.i) continue;
          const oL = Math.min(o.x1, o.x2);
          const oR = Math.max(o.x1, o.x2);
          if (right > oL && left < oR && o.span > a.span) {
            // height of the wider arc at this x (parabola through its feet)
            const t = Math.max(0, Math.min(1, (cx - oL) / Math.max(1, oR - oL)));
            const hAt = 4 * o.apex * t * (1 - t);
            if (hAt + 5 > up - 12 && hAt < up + 2) up = hAt + 5 + 12;
          }
        }
        // then clear the labels already placed
        let moved = true;
        while (moved) {
          moved = false;
          for (const b of arcLabelBoxes) {
            if (right + 6 > b.left && left - 6 < b.right && up < b.top + 1 && up + 12 > b.bottom - 1) {
              up = b.top + 2;
              moved = true;
            }
          }
        }
        arcLabelBoxes.push({ left, right, bottom: up, top: up + 12 });
        arcLabelPos.set(a.i, { x: cx, y: up });
      });

    const topExtent = Math.max(
      POINT_RADIUS + 6 + upBand,
      ...arcs.map((a) => (a ? a.apex + 4 : 0)),
      ...arcLabelBoxes.map((b) => b.top + 2),
    );
    const lineY = Math.max(40, Math.ceil(topExtent + 12));
    const numeralBand = hasFracLabels ? 32 : 22;
    const belowExtent = TICK_HALF + numeralBand + downRows.length * ROW_H;
    const height = Math.ceil(lineY + belowExtent + 14);
    return { pos, arcs, arcLabelPos, lineY, height, numeralBand, upBand };
  }, [intervals, segments, points, min, max, hasFracLabels]);

  const LINE_Y = layout.lineY;
  const svgHeight = layout.height;

  // Helper: convert value to SVG x
  const toX = (v: number) => valueToX(v, min, max);

  const labelXY = (key: string, fallbackX: number): { x: number; y: number } => {
    const p = layout.pos.get(key);
    if (!p) return { x: fallbackX, y: LINE_Y - (POINT_RADIUS + 8) };
    return p.side === 'up'
      ? { x: p.x, y: LINE_Y - (POINT_RADIUS + 8) - p.row * ROW_H }
      : { x: p.x, y: LINE_Y + TICK_HALF + layout.numeralBand + 10 + p.row * ROW_H };
  };

  return (
    <div className="w-full flex flex-col items-center gap-2">
      {/* Optional title */}
      {title && (
        <h3 className="text-sm font-semibold text-slate-700 text-center"><InlineMathText text={title} /></h3>
      )}

      <svg
        viewBox={`0 0 ${SVG_WIDTH} ${svgHeight}`}
        className="w-full max-w-[640px]"
        role="img"
        aria-label={title ?? 'Number line'}
      >
        {/* ======================== Number line axis ======================== */}
        {/* Main horizontal line */}
        <line
          x1={PADDING_X - ARROW_OVERHANG}
          y1={LINE_Y}
          x2={SVG_WIDTH - PADDING_X + ARROW_OVERHANG}
          y2={LINE_Y}
          stroke={COLOR_LINE}
          strokeWidth={2}
          {...feat('axis', { cx: SVG_WIDTH / 2, cy: LINE_Y, w: SVG_WIDTH - PADDING_X * 2 + 28, h: 20 }, { width: SVG_WIDTH, height: svgHeight })}
        />

        {/* Left arrow */}
        <polyline
          points={`${PADDING_X - ARROW_OVERHANG + 8},${LINE_Y - 5} ${PADDING_X - ARROW_OVERHANG},${LINE_Y} ${PADDING_X - ARROW_OVERHANG + 8},${LINE_Y + 5}`}
          fill="none"
          stroke={COLOR_LINE}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Right arrow */}
        <polyline
          points={`${SVG_WIDTH - PADDING_X + ARROW_OVERHANG - 8},${LINE_Y - 5} ${SVG_WIDTH - PADDING_X + ARROW_OVERHANG},${LINE_Y} ${SVG_WIDTH - PADDING_X + ARROW_OVERHANG - 8},${LINE_Y + 5}`}
          fill="none"
          stroke={COLOR_LINE}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* ======================== Major ticks + labels ======================== */}
        {ticks.map((v, i) => {
          const x = toX(v);
          const labelled = isLabelled(v);
          const half = labelled ? TICK_HALF : labelEvery > 1 ? 3.5 : TICK_HALF;
          return (
            <g key={`tick-${v}`} {...feat(`tick-${i + 1}`, { cx: x, cy: LINE_Y, w: 20, h: 30 }, { width: SVG_WIDTH, height: svgHeight })}>
              <line
                x1={x}
                y1={LINE_Y - half}
                x2={x}
                y2={LINE_Y + half}
                stroke={COLOR_TICK}
                strokeWidth={labelled ? 1.5 : 1}
              />
              {labelled && (
                <text
                  x={x}
                  y={LINE_Y + TICK_HALF + 14}
                  textAnchor="middle"
                  fontSize={11}
                  fill={COLOR_LABEL}
                  fontFamily="system-ui, sans-serif"
                >
                  {formatLabel(v).replace(/^-/, '−')}
                </text>
              )}
            </g>
          );
        })}

        {/* ======================== Fraction ticks ======================== */}
        {fracTicks.map((v) => {
          const x = toX(v);
          const den = fractionTicks?.denominator ?? 1;
          const f = toFraction(v, den);
          const idx = Math.round(Math.abs(v) * den);
          const showLabel = hasFracLabels && idx % fracLabels.every === 0;
          const stackW = Math.max(String(f.num).length, String(f.den).length) * 9 * 0.6 + 2;
          const wholeText = `${f.neg ? '−' : ''}${f.whole > 0 ? f.whole : ''}`;
          const wholeW = wholeText ? textW(wholeText, 10) + 2 : 0;
          const stackCx = x + wholeW / 2;
          const top = LINE_Y + FRACTION_TICK_HALF + 4;
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
              {showLabel && (
                <g fontFamily="system-ui, sans-serif" fill={COLOR_LABEL}>
                  {wholeText && (
                    <text x={stackCx - stackW / 2 - 1} y={top + 13} textAnchor="end" fontSize={10}>{wholeText}</text>
                  )}
                  <text x={stackCx} y={top + 8} textAnchor="middle" fontSize={9}>{f.num}</text>
                  <line x1={stackCx - stackW / 2} y1={top + 10.5} x2={stackCx + stackW / 2} y2={top + 10.5} stroke={COLOR_LABEL} strokeWidth={0.8} />
                  <text x={stackCx} y={top + 19} textAnchor="middle" fontSize={9}>{f.den}</text>
                </g>
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
          const lp = labelXY(`iv-${i}`, (x1 + x2) / 2);
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

              {/* Optional interval label (packed into the rows above the line) */}
              {iv.label && (
                <text
                  x={lp.x}
                  y={lp.y}
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
            // Curved arc above the number line. A quadratic's apex sits at
            // half its control height, so the control point is 2 × apex up.
            const arc = layout.arcs[i];
            const apex = arc ? arc.apex : 30;
            const midX = (x1 + x2) / 2;
            const ctrlY = LINE_Y - 2 * apex;
            const startY = LINE_Y - POINT_RADIUS * 0.4;
            const d = `M ${x1} ${startY} Q ${midX} ${ctrlY} ${x2} ${startY}`;
            // Arrowhead along the curve's end tangent.
            const tx = x2 - midX;
            const ty = startY - ctrlY;
            const tl = Math.hypot(tx, ty) || 1;
            const ux = tx / tl;
            const uy = ty / tl;
            const ah = 7;
            const aw = 3.5;
            const bx = x2 - ux * ah;
            const by = startY - uy * ah;
            const head = `${x2},${startY} ${bx - uy * aw},${by + ux * aw} ${bx + uy * aw},${by - ux * aw}`;
            const lp = layout.arcLabelPos.get(i);
            return (
              <g key={`seg-${i}`}>
                <path
                  d={d}
                  fill="none"
                  stroke={color}
                  strokeWidth={2}
                  strokeLinecap="round"
                />
                <polygon points={head} fill={color} />
                {/* Label over the apex */}
                {seg.label && lp && (
                  <text
                    x={lp.x}
                    y={LINE_Y - lp.y}
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
          const lp = labelXY(`seg-${i}`, (x1 + x2) / 2);
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
                  x={lp.x}
                  y={lp.y}
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
          const pos = labelXY(`pt-${i}`, x);
          const placed = layout.pos.get(`pt-${i}`);
          // A label pushed off its point (stacked row, or shifted in from the
          // edge) gets a hairline leader so it is clear which point it names.
          const needsLeader = !!placed && (placed.row > 0 || Math.abs(pos.x - x) > 14 || placed.side === 'down');
          const leaderY = placed?.side === 'down' ? pos.y - 10 : pos.y + 3;
          return (
            <g key={`point-${i}`} {...feat(ptName, { cx: x, cy: LINE_Y, w: 28, h: 32 }, { width: SVG_WIDTH, height: svgHeight })}>
              {pt.label && needsLeader && (
                <line
                  x1={x}
                  y1={placed?.side === 'down' ? LINE_Y + POINT_RADIUS + 1 : LINE_Y - POINT_RADIUS - 1}
                  x2={Math.max(pos.x - textW(pt.label, 11) / 2 + 4, Math.min(pos.x + textW(pt.label, 11) / 2 - 4, x))}
                  y2={leaderY}
                  stroke={color}
                  strokeWidth={0.75}
                  strokeOpacity={0.45}
                />
              )}
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
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight="600"
                  fill={color}
                  fontFamily="system-ui, sans-serif"
                  stroke="white"
                  strokeWidth={3}
                  paintOrder="stroke"
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
