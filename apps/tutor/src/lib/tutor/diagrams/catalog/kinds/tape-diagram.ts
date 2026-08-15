/**
 * tape_diagram — solver.
 *
 * A bar model showing parts that compose a whole. Singapore-math
 * style. Most common forms: parts-of-a-whole, comparison (two bars
 * stacked vertically), missing-part (one segment unknown).
 *
 * Use cases: word problems (2-7), ratios (6-8), part-whole reasoning
 * with fractions (3-7), pre-algebra setup (5-8).
 */

export interface TapeSegment {
  /** Length in arbitrary units. Used for proportional rendering;
   *  the renderer normalizes against the bar's total. */
  length: number;
  label?: string;
  color?: string;
  /** When true, the segment is the "unknown" — rendered with a "?" or
   *  the supplied label, distinct shading. */
  unknown?: boolean;
}

export interface TapeBar {
  /** Optional name shown to the left of the bar (e.g. "Anna", "Total"). */
  name?: string;
  segments: TapeSegment[];
  /** Optional brace + label shown above or below the entire bar
   *  (e.g. "Total = 24" or "?"). */
  totalLabel?: string;
}

export interface TapeFigure {
  bars: TapeBar[];
  title?: string;
  /** When true, all bars share the same scale — the renderer normalizes
   *  the longest bar's total to the available width and scales the
   *  others proportionally. Required for comparison bars to be
   *  pedagogically meaningful. */
  sharedScale: boolean;
}

function parseSegments(arr: unknown, barIdx: number): TapeSegment[] {
  if (!Array.isArray(arr) || arr.length === 0) {
    throw new Error(`tape_diagram: bar[${barIdx}].segments must be a non-empty array`);
  }
  return arr.map((raw, i) => {
    if (!raw || typeof raw !== 'object') {
      throw new Error(`tape_diagram: bar[${barIdx}].segments[${i}] must be an object`);
    }
    const s = raw as Record<string, unknown>;
    if (typeof s.length !== 'number' || !Number.isFinite(s.length) || s.length <= 0) {
      throw new Error(`tape_diagram: bar[${barIdx}].segments[${i}].length must be a positive number`);
    }
    return {
      length: s.length,
      label: typeof s.label === 'string' ? s.label : undefined,
      color: typeof s.color === 'string' ? s.color : undefined,
      unknown: s.unknown === true,
    };
  });
}

export function solveTapeDiagram(params: Record<string, unknown>): TapeFigure {
  if (!Array.isArray(params.bars) || params.bars.length === 0) {
    throw new Error('tape_diagram: bars must be a non-empty array');
  }
  const bars: TapeBar[] = params.bars.map((raw, i) => {
    if (!raw || typeof raw !== 'object') {
      throw new Error(`tape_diagram: bar[${i}] must be an object`);
    }
    const b = raw as Record<string, unknown>;
    return {
      name: typeof b.name === 'string' ? b.name : undefined,
      segments: parseSegments(b.segments, i),
      totalLabel: typeof b.totalLabel === 'string' ? b.totalLabel : undefined,
    };
  });

  return {
    bars,
    title: typeof params.title === 'string' ? params.title : undefined,
    sharedScale: params.sharedScale !== false, // default true
  };
}
