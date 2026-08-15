/**
 * Elementary-math manipulatives — solvers + feature manifests.
 *
 * Three K-3 figures a freehand sketch garbles:
 *   - clock_face      — an analog clock showing a specific time (telling time).
 *   - ten_frame       — one or two 2×5 ten-frames filled with counters
 *                       (number sense, making-ten, addition within 20).
 *   - base_ten_blocks — place-value blocks (thousands cubes, hundreds flats,
 *                       tens rods, ones units) for a whole number.
 *
 * Each solver validates the brain's params, fills defaults, and returns a
 * normalized figure the matching renderer consumes. Colocated with the
 * feature-name constants + manifest builders so the scribble targets stay
 * in sync with the SVG the renderer emits.
 */

import type { FeatureManifestEntry } from '../../layout';

function isFiniteNumber(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v);
}

function toInt(v: unknown, fallback: number): number {
  if (isFiniteNumber(v)) return Math.round(v);
  if (typeof v === 'string' && v.trim() !== '' && Number.isFinite(Number(v))) {
    return Math.round(Number(v));
  }
  return fallback;
}

// ── clock_face ────────────────────────────────────────────────────────────────

export interface ClockFaceFigure {
  title?: string;
  hour: number;        // 1..12 (12 = twelve o'clock)
  minute: number;      // 0..59
  hourAngle: number;   // degrees clockwise from 12 o'clock (up)
  minuteAngle: number; // degrees clockwise from 12 o'clock
  showMinuteTicks: boolean;
  timeLabel: string;   // e.g. "3:05"
}

/** Solve an analog clock. hour is 1..12 (accepts 0/24 → 12); minute 0..59.
 *  Hour hand advances with the minutes (e.g. 3:30 → hour hand halfway to 4). */
export function solveClockFace(params: Record<string, unknown>): ClockFaceFigure {
  let hour = toInt(params.hour ?? params.hours, 12);
  let minute = toInt(params.minute ?? params.minutes, 0);

  if (!Number.isFinite(minute) || minute < 0 || minute > 59) {
    throw new Error(`clock_face: minute must be an integer in 0..59 (got ${minute})`);
  }
  // Normalize hour to 1..12. 0 and 24 read as 12; 13..23 wrap to 1..11.
  hour = ((hour % 12) + 12) % 12;
  if (hour === 0) hour = 12;

  const minuteAngle = minute * 6; // 360/60
  // Hour hand: 30° per hour + 0.5° per minute. Use hour%12 so 12 sits at 0°.
  const hourAngle = ((hour % 12) * 30) + (minute * 0.5);

  const timeLabel = `${hour}:${String(minute).padStart(2, '0')}`;

  return {
    title: typeof params.title === 'string' ? params.title : undefined,
    hour,
    minute,
    hourAngle,
    minuteAngle,
    showMinuteTicks: params.showMinuteTicks !== false,
    timeLabel,
  };
}

export const clockFeatureNames = {
  figure: 'clock',
  face: 'clock-face',
  hourHand: 'hour-hand',
  minuteHand: 'minute-hand',
  timeLabel: 'time-label',
} as const;

export function buildClockFaceManifest(figure: ClockFaceFigure): FeatureManifestEntry[] {
  const N = clockFeatureNames;
  const heading = figure.title || `Clock — ${figure.timeLabel}`;
  return [
    {
      name: N.figure,
      kind: 'shape',
      description: heading,
      labels: ['clock', 'the clock', 'clock face', 'the clock face', heading],
      scribbleable: true,
    },
    { name: N.hourHand, kind: 'shape', description: 'Hour hand (short)', labels: ['hour hand', 'the hour hand', 'short hand'], scribbleable: true },
    { name: N.minuteHand, kind: 'shape', description: 'Minute hand (long)', labels: ['minute hand', 'the minute hand', 'long hand'], scribbleable: true },
    { name: N.timeLabel, kind: 'label', description: `Time: ${figure.timeLabel}`, labels: ['time', 'the time', figure.timeLabel], scribbleable: true },
  ];
}

// ── ten_frame ───────────────────────────────────────────────────────────────

export interface TenFrameFigure {
  title?: string;
  frames: number[];   // one or two frames; each value 0..10 (filled cells)
  total: number;      // sum across frames
  colors: string[];   // counter color per frame
}

const TEN_FRAME_COLORS = ['#dc2626', '#2563eb']; // red first frame, blue second

/** Solve one or two ten-frames. `count` fills the first frame (0..10) and
 *  overflow spills into a second frame; or pass explicit `frames:[a,b]`.
 *  A count in 0..20 auto-splits into two frames of ≤10. */
export function solveTenFrame(params: Record<string, unknown>): TenFrameFigure {
  let frames: number[];

  if (Array.isArray(params.frames)) {
    frames = (params.frames as unknown[]).map((v, i) => {
      const n = toInt(v, NaN);
      if (!Number.isFinite(n) || n < 0 || n > 10) {
        throw new Error(`ten_frame: frames[${i}] must be an integer in 0..10 (got ${v})`);
      }
      return n;
    });
    if (frames.length < 1 || frames.length > 2) {
      throw new Error(`ten_frame: frames must have 1 or 2 entries (got ${frames.length})`);
    }
  } else {
    const count = toInt(params.count ?? params.counters, 0);
    if (!Number.isFinite(count) || count < 0 || count > 20) {
      throw new Error(`ten_frame: count must be an integer in 0..20 (got ${count})`);
    }
    frames = count <= 10 ? [count] : [10, count - 10];
  }

  const total = frames.reduce((a, b) => a + b, 0);
  const colors = frames.map((_, i) => {
    const c = Array.isArray(params.colors) ? (params.colors as unknown[])[i] : undefined;
    return typeof c === 'string' ? c : TEN_FRAME_COLORS[i % TEN_FRAME_COLORS.length];
  });

  return {
    title: typeof params.title === 'string' ? params.title : undefined,
    frames,
    total,
    colors,
  };
}

export const tenFrameFeatureNames = {
  figure: 'ten-frame',
  counters: 'counters',
  total: 'total',
} as const;

export function buildTenFrameManifest(figure: TenFrameFigure): FeatureManifestEntry[] {
  const N = tenFrameFeatureNames;
  const heading = figure.title || `Ten-frame — ${figure.total}`;
  return [
    {
      name: N.figure,
      kind: 'shape',
      description: heading,
      labels: ['ten-frame', 'ten frame', 'the ten-frame', 'the frame', heading],
      scribbleable: true,
    },
    { name: N.counters, kind: 'shape', description: 'The filled counters', labels: ['counters', 'the counters', 'the dots', 'dots'], scribbleable: true },
    { name: N.total, kind: 'label', description: `Total: ${figure.total}`, labels: ['total', 'the total', String(figure.total)], scribbleable: true },
  ];
}

// ── base_ten_blocks ───────────────────────────────────────────────────────────

export interface BaseTenFigure {
  title?: string;
  value: number;
  thousands: number; // count of cubes
  hundreds: number;  // count of flats
  tens: number;      // count of rods
  ones: number;      // count of units
}

/** Solve base-ten (place-value) blocks for a whole number 0..9999.
 *  Decomposes into thousands cubes / hundreds flats / tens rods / ones units. */
export function solveBaseTenBlocks(params: Record<string, unknown>): BaseTenFigure {
  const value = toInt(params.value ?? params.number, NaN);
  if (!Number.isFinite(value) || value < 0 || value > 9999) {
    throw new Error(`base_ten_blocks: value must be an integer in 0..9999 (got ${params.value ?? params.number})`);
  }
  const thousands = Math.floor(value / 1000);
  const hundreds = Math.floor((value % 1000) / 100);
  const tens = Math.floor((value % 100) / 10);
  const ones = value % 10;

  return {
    title: typeof params.title === 'string' ? params.title : undefined,
    value,
    thousands,
    hundreds,
    tens,
    ones,
  };
}

export const baseTenFeatureNames = {
  figure: 'base-ten-blocks',
  thousands: 'thousands',
  hundreds: 'hundreds',
  tens: 'tens',
  ones: 'ones',
} as const;

export function buildBaseTenManifest(figure: BaseTenFigure): FeatureManifestEntry[] {
  const N = baseTenFeatureNames;
  const heading = figure.title || `Base-ten blocks — ${figure.value}`;
  const out: FeatureManifestEntry[] = [
    {
      name: N.figure,
      kind: 'shape',
      description: heading,
      labels: ['base-ten blocks', 'the blocks', 'place value blocks', heading],
      scribbleable: true,
    },
  ];
  if (figure.thousands > 0) out.push({ name: N.thousands, kind: 'shape', description: `${figure.thousands} thousand cube(s)`, labels: ['thousands', 'the thousands', 'cubes'], scribbleable: true });
  if (figure.hundreds > 0) out.push({ name: N.hundreds, kind: 'shape', description: `${figure.hundreds} hundred flat(s)`, labels: ['hundreds', 'the hundreds', 'flats'], scribbleable: true });
  if (figure.tens > 0) out.push({ name: N.tens, kind: 'shape', description: `${figure.tens} ten rod(s)`, labels: ['tens', 'the tens', 'rods'], scribbleable: true });
  if (figure.ones > 0) out.push({ name: N.ones, kind: 'shape', description: `${figure.ones} one unit(s)`, labels: ['ones', 'the ones', 'units'], scribbleable: true });
  return out;
}

// ── coordinate_grid ─────────────────────────────────────────────────────────

function toNum(v: unknown, fallback: number): number {
  if (isFiniteNumber(v)) return v;
  if (typeof v === 'string' && v.trim() !== '' && Number.isFinite(Number(v))) {
    return Number(v);
  }
  return fallback;
}

export interface CoordinatePoint {
  x: number;
  y: number;
  label?: string;   // e.g. "A" or a custom name; falls back to "(x, y)"
  color?: string;
}

export interface CoordinateGridFigure {
  title?: string;
  points: CoordinatePoint[];
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  quadrants: 1 | 4;   // 1 = first-quadrant only; 4 = full plane
  connect: boolean;   // join the points in order with a polyline (segment/polygon)
}

/** Cartesian coordinate grid with plotted, labelled ordered pairs. Quadrant
 *  count auto-detects (any negative coordinate → full 4-quadrant plane, else
 *  first-quadrant only) unless `quadrants` is given. Axis bounds auto-fit to
 *  the points (integer bounds + small padding) unless x/y bounds are passed.
 *  Points can be joined in order with `connect` for a segment or polygon.
 *  With no points it renders an empty labelled grid (a "plot these" worksheet). */
export function solveCoordinateGrid(params: Record<string, unknown>): CoordinateGridFigure {
  const rawPoints = Array.isArray(params.points) ? params.points : [];
  const points: CoordinatePoint[] = rawPoints
    .map((p) => (p && typeof p === 'object' ? (p as Record<string, unknown>) : {}))
    .map((p) => ({
      x: toNum(p.x, NaN),
      y: toNum(p.y, NaN),
      label: typeof p.label === 'string' ? p.label : undefined,
      color: typeof p.color === 'string' ? p.color : undefined,
    }))
    .filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y));

  const hasNegative = points.some((p) => p.x < 0 || p.y < 0);
  // Explicit quadrants wins; else a negative coordinate forces the full plane.
  let quadrants: 1 | 4 =
    params.quadrants === 4 || params.quadrants === '4' ? 4
    : params.quadrants === 1 || params.quadrants === '1' ? 1
    : hasNegative ? 4 : 1;
  if (hasNegative) quadrants = 4;

  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const dataXMax = xs.length ? Math.max(...xs) : 5;
  const dataYMax = ys.length ? Math.max(...ys) : 5;
  const dataXMin = xs.length ? Math.min(...xs) : 0;
  const dataYMin = ys.length ? Math.min(...ys) : 0;

  const pad = 1;
  let xMax = isFiniteNumber(params.xMax) ? Math.round(params.xMax) : Math.max(1, Math.ceil(dataXMax + pad));
  let yMax = isFiniteNumber(params.yMax) ? Math.round(params.yMax) : Math.max(1, Math.ceil(dataYMax + pad));
  let xMin: number;
  let yMin: number;
  if (quadrants === 1) {
    xMin = 0;
    yMin = 0;
  } else {
    xMin = isFiniteNumber(params.xMin) ? Math.round(params.xMin) : Math.min(-1, Math.floor(dataXMin - pad));
    yMin = isFiniteNumber(params.yMin) ? Math.round(params.yMin) : Math.min(-1, Math.floor(dataYMin - pad));
    xMax = Math.max(xMax, 1);
    yMax = Math.max(yMax, 1);
  }

  // Guard against degenerate ranges & runaway sizes.
  if (xMax <= xMin) xMax = xMin + 1;
  if (yMax <= yMin) yMax = yMin + 1;
  const MAX_SPAN = 30;
  if (xMax - xMin > MAX_SPAN) xMax = xMin + MAX_SPAN;
  if (yMax - yMin > MAX_SPAN) yMax = yMin + MAX_SPAN;

  return {
    title: typeof params.title === 'string' ? params.title : undefined,
    points,
    xMin, xMax, yMin, yMax,
    quadrants,
    connect: params.connect === true,
  };
}

export const coordinateGridFeatureNames = {
  grid: 'coordinate-grid',
  xAxis: 'x-axis',
  yAxis: 'y-axis',
  point: (i: number): string => `grid-point-${i}`,
} as const;

export function buildCoordinateGridManifest(figure: CoordinateGridFigure): FeatureManifestEntry[] {
  const N = coordinateGridFeatureNames;
  const feats: FeatureManifestEntry[] = [
    { name: N.grid, kind: 'region', description: figure.title || 'the coordinate grid', labels: ['the coordinate grid', 'the grid', 'the plane', 'the graph'], scribbleable: true },
    { name: N.xAxis, kind: 'axis', description: 'the x-axis', labels: ['x-axis', 'the x axis', 'horizontal axis'], scribbleable: true },
    { name: N.yAxis, kind: 'axis', description: 'the y-axis', labels: ['y-axis', 'the y axis', 'vertical axis'], scribbleable: true },
  ];
  figure.points.forEach((p, i) => {
    const coord = `(${p.x}, ${p.y})`;
    const nm = p.label || coord;
    feats.push({
      name: N.point(i),
      kind: 'point',
      description: `point ${nm} at ${coord}`,
      labels: [nm, `the point ${nm}`, coord, `point ${coord}`].filter(Boolean),
      displayName: nm,
      scribbleable: true,
    });
  });
  return feats;
}

// ── manifest-side solver aliases (mirror the ForManifest convention) ───────────

export const solveClockFaceForManifest = solveClockFace;
export const solveTenFrameForManifest = solveTenFrame;
export const solveBaseTenBlocksForManifest = solveBaseTenBlocks;
export const solveCoordinateGridForManifest = solveCoordinateGrid;
