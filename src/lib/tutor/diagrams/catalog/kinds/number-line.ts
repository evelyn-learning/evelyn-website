/**
 * number_line — solver.
 *
 * Wraps the existing NumberLineRenderer prop shape so the brain can
 * call show_diagram with `kind: 'number_line'` and have the catalog
 * dispatch produce a fully-validated figure that the existing
 * renderer consumes unchanged.
 *
 * Use cases: arithmetic on a line (K-3), integer / negative number
 * intuition (5-7), inequalities (6-9), distance / displacement (7-12),
 * intervals on the real line (9-12).
 */

export interface NumberLinePoint {
  value: number;
  label?: string;
  color?: string;
  style?: 'filled' | 'open';
}

export interface NumberLineInterval {
  from: number;
  to: number;
  fromInclusive?: boolean;
  toInclusive?: boolean;
  color?: string;
  label?: string;
}

export interface NumberLineSegment {
  from: number;
  to: number;
  label?: string;
  color?: string;
  arc?: boolean;
}

export interface FractionTicks {
  denominator: number;
  showLabels?: boolean;
}

export interface NumberLineFigure {
  title?: string;
  min: number;
  max: number;
  step?: number;
  points: NumberLinePoint[];
  intervals: NumberLineInterval[];
  segments: NumberLineSegment[];
  fractionTicks?: FractionTicks;
}

function isFiniteNumber(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v);
}

export function solveNumberLine(params: Record<string, unknown>): NumberLineFigure {
  const min = isFiniteNumber(params.min) ? params.min : 0;
  const max = isFiniteNumber(params.max) ? params.max : 10;
  if (max <= min) {
    throw new Error(`number_line: max (${max}) must be greater than min (${min})`);
  }
  const step = isFiniteNumber(params.step) && params.step > 0 ? params.step : undefined;

  const points: NumberLinePoint[] = Array.isArray(params.points)
    ? (params.points as Array<Record<string, unknown>>).map((m, i) => {
        if (!isFiniteNumber(m.value)) {
          throw new Error(`number_line: points[${i}].value must be a number`);
        }
        if (m.value < min || m.value > max) {
          throw new Error(`number_line: points[${i}].value=${m.value} is outside [${min}, ${max}]`);
        }
        const style = m.style;
        return {
          value: m.value,
          label: typeof m.label === 'string' ? m.label : undefined,
          color: typeof m.color === 'string' ? m.color : undefined,
          style: style === 'open' ? 'open' : 'filled',
        };
      })
    : [];

  const intervals: NumberLineInterval[] = Array.isArray(params.intervals)
    ? (params.intervals as Array<Record<string, unknown>>).map((iv, i) => {
        if (!isFiniteNumber(iv.from) || !isFiniteNumber(iv.to)) {
          throw new Error(`number_line: intervals[${i}] requires numeric from + to`);
        }
        if (iv.to < iv.from) {
          throw new Error(`number_line: intervals[${i}] to (${iv.to}) must be >= from (${iv.from})`);
        }
        if (iv.from < min || iv.to > max) {
          throw new Error(`number_line: intervals[${i}] [${iv.from}, ${iv.to}] is outside [${min}, ${max}]`);
        }
        return {
          from: iv.from,
          to: iv.to,
          fromInclusive: iv.fromInclusive !== false,
          toInclusive: iv.toInclusive !== false,
          color: typeof iv.color === 'string' ? iv.color : undefined,
          label: typeof iv.label === 'string' ? iv.label : undefined,
        };
      })
    : [];

  const segments: NumberLineSegment[] = Array.isArray(params.segments)
    ? (params.segments as Array<Record<string, unknown>>).map((s, i) => {
        if (!isFiniteNumber(s.from) || !isFiniteNumber(s.to)) {
          throw new Error(`number_line: segments[${i}] requires numeric from + to`);
        }
        return {
          from: s.from,
          to: s.to,
          label: typeof s.label === 'string' ? s.label : undefined,
          color: typeof s.color === 'string' ? s.color : undefined,
          arc: s.arc === true,
        };
      })
    : [];

  let fractionTicks: FractionTicks | undefined;
  if (params.fractionTicks && typeof params.fractionTicks === 'object') {
    const ft = params.fractionTicks as Record<string, unknown>;
    if (isFiniteNumber(ft.denominator) && ft.denominator >= 2 && Number.isInteger(ft.denominator)) {
      fractionTicks = {
        denominator: ft.denominator,
        showLabels: ft.showLabels === true,
      };
    }
  }

  return {
    title: typeof params.title === 'string' ? params.title : undefined,
    min,
    max,
    step,
    points,
    intervals,
    segments,
    fractionTicks,
  };
}
