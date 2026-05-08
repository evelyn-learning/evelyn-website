/**
 * Economics structured diagrams.
 *
 * AP Plans Initiative Q7 — adding the macro graph kinds the catalog was
 * missing. First kind: `production_possibilities`. Subsequent kinds
 * (supply_demand, ad_as, money_market, loanable_funds, business_cycle,
 * phillips_curve) will be added here as their plans need them.
 */

// ── aggregate_demand_supply ─────────────────────────────────────────────

export interface AdAsShift {
  curve: 'AD' | 'SRAS' | 'LRAS';
  direction: 'left' | 'right';
  magnitude: number;          // axis units; default 10
  label?: string;
}

export interface AdAsLabels {
  eqInitial?: string;
  eqFinal?: string;
  ad?: string;
  sras?: string;
  lras?: string;
}

export interface AdAsFigure {
  /** x-position of LRAS (vertical line). 0..100 axis units. */
  potentialGdp: number;
  /** Initial equilibrium real GDP. */
  initialEquilibriumGdp: number;
  /** Initial equilibrium price level. */
  initialPriceLevel: number;
  showLras: boolean;
  shift?: AdAsShift;
  /** Computed by the solver if shift is present. */
  finalEquilibriumGdp?: number;
  finalEquilibriumPriceLevel?: number;
  labels: Required<AdAsLabels>;
  title?: string;
}

/** Solve for the new equilibrium given a shift in AD or SRAS.
 *  Curve assumptions: AD slope = -1, SRAS slope = +1, both per axis-unit. */
function solveShiftedEquilibrium(
  Y0: number,
  P0: number,
  shift: AdAsShift,
): { Y: number; P: number } {
  const delta = shift.direction === 'right' ? shift.magnitude : -shift.magnitude;
  if (shift.curve === 'AD') {
    // AD shift right → both Y and P rise by delta/2.
    return { Y: Y0 + delta / 2, P: P0 + delta / 2 };
  }
  if (shift.curve === 'SRAS') {
    // SRAS shift right → Y rises by delta/2, P falls by delta/2.
    return { Y: Y0 + delta / 2, P: P0 - delta / 2 };
  }
  // LRAS shift: shifts the vertical line. Does NOT change current AD/SRAS
  // intersection in the short run; affects long-run self-adjustment.
  return { Y: Y0, P: P0 };
}

export function solveAggregateDemandSupply(params: Record<string, unknown>): AdAsFigure {
  const potentialGdp = typeof params.potentialGdp === 'number' ? params.potentialGdp : 50;
  const Y0 = typeof params.initialEquilibriumGdp === 'number' ? params.initialEquilibriumGdp : potentialGdp;
  const P0 = typeof params.initialPriceLevel === 'number' ? params.initialPriceLevel : 50;
  const showLras = params.showLras !== false;

  let shift: AdAsShift | undefined;
  let finalY: number | undefined;
  let finalP: number | undefined;
  if (params.shift && typeof params.shift === 'object') {
    const s = params.shift as Record<string, unknown>;
    if ((s.curve === 'AD' || s.curve === 'SRAS' || s.curve === 'LRAS') &&
        (s.direction === 'left' || s.direction === 'right')) {
      shift = {
        curve: s.curve,
        direction: s.direction,
        magnitude: typeof s.magnitude === 'number' && s.magnitude > 0 ? s.magnitude : 10,
        label: typeof s.label === 'string' ? s.label : undefined,
      };
      const eq = solveShiftedEquilibrium(Y0, P0, shift);
      finalY = eq.Y;
      finalP = eq.P;
    }
  }

  const lblIn = (params.labels ?? {}) as Record<string, unknown>;
  const labels: Required<AdAsLabels> = {
    eqInitial: typeof lblIn.eqInitial === 'string' ? lblIn.eqInitial : 'E₀',
    eqFinal: typeof lblIn.eqFinal === 'string' ? lblIn.eqFinal : 'E₁',
    ad: typeof lblIn.ad === 'string' ? lblIn.ad : 'AD',
    sras: typeof lblIn.sras === 'string' ? lblIn.sras : 'SRAS',
    lras: typeof lblIn.lras === 'string' ? lblIn.lras : 'LRAS',
  };

  return {
    potentialGdp,
    initialEquilibriumGdp: Y0,
    initialPriceLevel: P0,
    showLras,
    shift,
    finalEquilibriumGdp: finalY,
    finalEquilibriumPriceLevel: finalP,
    labels,
    title: typeof params.title === 'string' ? params.title : undefined,
  };
}

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
