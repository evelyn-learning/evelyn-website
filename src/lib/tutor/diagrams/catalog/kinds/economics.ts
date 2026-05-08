/**
 * Economics structured diagrams.
 *
 * AP Plans Initiative Q7 — adding the macro graph kinds the catalog was
 * missing. First kind: `production_possibilities`. Subsequent kinds
 * (supply_demand, ad_as, money_market, loanable_funds, business_cycle,
 * phillips_curve) will be added here as their plans need them.
 */

// ── business_cycle ──────────────────────────────────────────────────────

export interface BusinessCyclePhaseMarker {
  /** 0..1, position along the cycle horizontally (left to right). */
  t: number;
  label: string;
  showLine?: boolean;
}

export interface BusinessCycleFigure {
  cycles: number;
  amplitude: number;
  trendSlope: number;
  showTrend: boolean;
  showOutputGap: boolean;
  labels: 'all' | 'minimal' | 'none';
  markers?: BusinessCyclePhaseMarker[];
  title?: string;
}

export function solveBusinessCycle(params: Record<string, unknown>): BusinessCycleFigure {
  const cycles = typeof params.cycles === 'number' && params.cycles > 0 ? params.cycles : 1.5;
  const amplitude = typeof params.amplitude === 'number' && params.amplitude > 0 ? params.amplitude : 0.18;
  const trendSlope = typeof params.trendSlope === 'number' ? params.trendSlope : 0.4;
  const showTrend = params.showTrend !== false;
  const showOutputGap = params.showOutputGap === true;
  const lbl = params.labels;
  const labels: 'all' | 'minimal' | 'none' = lbl === 'minimal' || lbl === 'none' ? lbl : 'all';

  let markers: BusinessCyclePhaseMarker[] | undefined;
  if (Array.isArray(params.markers)) {
    markers = (params.markers as unknown[]).map((m, i) => {
      const mm = m as Record<string, unknown>;
      if (typeof mm.t !== 'number' || typeof mm.label !== 'string') {
        throw new Error(`business_cycle: markers[${i}] must have numeric t and string label`);
      }
      return {
        t: Math.max(0, Math.min(1, mm.t)),
        label: mm.label,
        showLine: mm.showLine !== false,
      };
    });
  }

  return {
    cycles,
    amplitude,
    trendSlope,
    showTrend,
    showOutputGap,
    labels,
    markers,
    title: typeof params.title === 'string' ? params.title : undefined,
  };
}

// ── production_possibilities ────────────────────────────────────────────

export interface PPCPoint {
  /** X-coordinate in axis units (Good X production). */
  x: number;
  /** Y-coordinate in axis units (Good Y production). */
  y: number;
  /** Optional label (typically "A", "B", "C"). */
  label?: string;
  /** Optional explicit position classification. If omitted, the solver
   *  infers from the curve shape: ON if on the curve (within tolerance),
   *  INSIDE if below it, OUTSIDE if above. */
  position?: 'inside' | 'on' | 'outside';
  /** Optional CSS color override (defaults applied by renderer). */
  color?: string;
}

export interface PPCFigure {
  xAxis: { label: string; max: number };
  yAxis: { label: string; max: number };
  /** 'bowed-out' (default) for increasing opportunity cost; 'linear' for
   *  constant opportunity cost. */
  curve: 'bowed-out' | 'linear';
  points: PPCPoint[];
  /** Optional shifted PPC (economic growth or contraction). The shift is
   *  multiplicative on both axes' max values. */
  shift?: { direction: 'out' | 'in'; factor: number; label?: string };
  title?: string;
}

const ON_CURVE_TOLERANCE = 0.02; // 2% of axis units

/** Returns the y value on the PPC curve at a given x. */
function curveYAt(x: number, xMax: number, yMax: number, curve: 'bowed-out' | 'linear'): number {
  if (curve === 'linear') {
    return yMax * (1 - x / xMax);
  }
  // Bowed-out: quarter ellipse from (0, yMax) to (xMax, 0).
  // (x/xMax)^2 + (y/yMax)^2 = 1 → y = yMax * sqrt(1 - (x/xMax)^2)
  const t = x / xMax;
  if (t >= 1) return 0;
  return yMax * Math.sqrt(1 - t * t);
}

function classifyPoint(p: PPCPoint, xMax: number, yMax: number, curve: 'bowed-out' | 'linear'): 'inside' | 'on' | 'outside' {
  if (p.position) return p.position;
  if (p.x < 0 || p.y < 0) return 'inside';
  if (p.x > xMax || p.y > yMax) return 'outside';
  const yOn = curveYAt(p.x, xMax, yMax, curve);
  const tol = ON_CURVE_TOLERANCE * yMax;
  if (Math.abs(p.y - yOn) <= tol) return 'on';
  return p.y < yOn ? 'inside' : 'outside';
}

export function solveProductionPossibilities(params: Record<string, unknown>): PPCFigure {
  const xRaw = params.xAxis as { label?: unknown; max?: unknown } | undefined;
  const yRaw = params.yAxis as { label?: unknown; max?: unknown } | undefined;
  if (!xRaw || typeof xRaw.label !== 'string' || typeof xRaw.max !== 'number' || !(xRaw.max > 0)) {
    throw new Error('production_possibilities: xAxis must be { label: string, max: positive number }');
  }
  if (!yRaw || typeof yRaw.label !== 'string' || typeof yRaw.max !== 'number' || !(yRaw.max > 0)) {
    throw new Error('production_possibilities: yAxis must be { label: string, max: positive number }');
  }

  const curveRaw = params.curve;
  const curve: 'bowed-out' | 'linear' =
    curveRaw === 'linear' ? 'linear' : 'bowed-out';

  const pointsRaw = Array.isArray(params.points) ? (params.points as unknown[]) : [];
  const points: PPCPoint[] = pointsRaw.map((pp, i) => {
    const p = pp as Record<string, unknown>;
    if (typeof p.x !== 'number' || typeof p.y !== 'number') {
      throw new Error(`production_possibilities: points[${i}] must have numeric x and y`);
    }
    return {
      x: p.x,
      y: p.y,
      label: typeof p.label === 'string' ? p.label : undefined,
      position:
        p.position === 'inside' || p.position === 'on' || p.position === 'outside' ? p.position : undefined,
      color: typeof p.color === 'string' ? p.color : undefined,
    };
  });

  // Auto-classify any points missing explicit position.
  for (const p of points) {
    if (!p.position) p.position = classifyPoint(p, xRaw.max as number, yRaw.max as number, curve);
  }

  let shift: PPCFigure['shift'];
  if (params.shift && typeof params.shift === 'object') {
    const s = params.shift as Record<string, unknown>;
    const dir = s.direction;
    const factor = typeof s.factor === 'number' && s.factor > 0 ? s.factor : 1.2;
    if (dir === 'out' || dir === 'in') {
      shift = { direction: dir, factor, label: typeof s.label === 'string' ? s.label : undefined };
    }
  }

  return {
    xAxis: { label: xRaw.label, max: xRaw.max },
    yAxis: { label: yRaw.label, max: yRaw.max },
    curve,
    points,
    shift,
    title: typeof params.title === 'string' ? params.title : undefined,
  };
}
