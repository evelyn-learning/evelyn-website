/**
 * Economics structured diagrams.
 *
 * AP Plans Initiative Q7 — adding the macro graph kinds the catalog was
 * missing. First kind: `production_possibilities`. Subsequent kinds
 * (supply_demand, ad_as, money_market, loanable_funds, business_cycle,
 * phillips_curve) will be added here as their plans need them.
 */

import type { FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';

// ── foreign_exchange_market ─────────────────────────────────────────────

export interface FxMarketShift {
  curve: 'S' | 'D';
  direction: 'left' | 'right';
  magnitude: number;
  label?: string;
}

export interface FxMarketFigure {
  /** Currency being graphed, e.g. "USD" or "EUR". Affects axis labels only. */
  currency: string;
  /** Quote currency for the exchange rate (the y-axis unit). E.g. for USD graphed
   *  in terms of EUR per USD, currency='USD' and quoteCurrency='EUR'. */
  quoteCurrency: string;
  initialQuantity: number;        // 0..100
  initialExchangeRate: number;    // 0..100
  shift?: FxMarketShift;
  finalQuantity?: number;
  finalExchangeRate?: number;
  title?: string;
}

export function solveForeignExchangeMarket(params: Record<string, unknown>): FxMarketFigure {
  const currency = typeof params.currency === 'string' ? params.currency : 'USD';
  const quoteCurrency = typeof params.quoteCurrency === 'string' ? params.quoteCurrency : 'EUR';
  const Q0 = typeof params.initialQuantity === 'number' ? params.initialQuantity : 50;
  const e0 = typeof params.initialExchangeRate === 'number' ? params.initialExchangeRate : 50;

  let shift: FxMarketShift | undefined;
  let finalQ: number | undefined;
  let finalE: number | undefined;
  if (params.shift && typeof params.shift === 'object') {
    const s = params.shift as Record<string, unknown>;
    if ((s.curve === 'S' || s.curve === 'D') && (s.direction === 'left' || s.direction === 'right')) {
      shift = {
        curve: s.curve,
        direction: s.direction,
        magnitude: typeof s.magnitude === 'number' && s.magnitude > 0 ? s.magnitude : 10,
        label: typeof s.label === 'string' ? s.label : undefined,
      };
      const delta = shift.direction === 'right' ? shift.magnitude : -shift.magnitude;
      // S slope = +1, D slope = -1, both through (Q0, e0).
      // S right: Q rises, e falls (currency depreciates).
      // D right: Q rises, e rises (currency appreciates).
      if (shift.curve === 'S') {
        finalQ = Q0 + delta / 2;
        finalE = e0 - delta / 2;
      } else {
        finalQ = Q0 + delta / 2;
        finalE = e0 + delta / 2;
      }
    }
  }

  return {
    currency,
    quoteCurrency,
    initialQuantity: Q0,
    initialExchangeRate: e0,
    shift,
    finalQuantity: finalQ,
    finalExchangeRate: finalE,
    title: typeof params.title === 'string' ? params.title : undefined,
  };
}

// ── phillips_curve ──────────────────────────────────────────────────────

export interface PhillipsCurveShift {
  curve: 'SRPC' | 'LRPC';
  direction: 'up' | 'down' | 'left' | 'right';
  magnitude: number;
  label?: string;
}

export interface PhillipsCurveFigure {
  /** Natural rate of unemployment — x-position of LRPC. 0..100. */
  nairu: number;
  /** Short-run unemployment — x where SRPC currently sits. */
  initialUnemployment: number;
  /** Short-run inflation — y at the initial point. */
  initialInflation: number;
  showLrpc: boolean;
  shift?: PhillipsCurveShift;
  finalUnemployment?: number;
  finalInflation?: number;
  title?: string;
}

export function solvePhillipsCurve(params: Record<string, unknown>): PhillipsCurveFigure {
  const nairu = typeof params.nairu === 'number' ? params.nairu : 50;
  const u0 = typeof params.initialUnemployment === 'number' ? params.initialUnemployment : nairu;
  const pi0 = typeof params.initialInflation === 'number' ? params.initialInflation : 50;
  const showLrpc = params.showLrpc !== false;

  let shift: PhillipsCurveShift | undefined;
  let finalU: number | undefined;
  let finalPi: number | undefined;
  if (params.shift && typeof params.shift === 'object') {
    const s = params.shift as Record<string, unknown>;
    if ((s.curve === 'SRPC' || s.curve === 'LRPC')) {
      const dir = s.direction;
      if (dir === 'up' || dir === 'down' || dir === 'left' || dir === 'right') {
        shift = {
          curve: s.curve,
          direction: dir,
          magnitude: typeof s.magnitude === 'number' && s.magnitude > 0 ? s.magnitude : 10,
          label: typeof s.label === 'string' ? s.label : undefined,
        };
        const delta = (dir === 'up' || dir === 'right') ? shift.magnitude : -shift.magnitude;
        if (shift.curve === 'SRPC') {
          // SRPC shift up/right = at the same UR, inflation is higher (rising
          // inflation expectations, cost-push shock). New equilibrium along SRPC
          // determined by where economy actually settles, not the curve alone.
          // For visualization, mark new point at same UR with inflation + delta.
          finalU = u0;
          finalPi = pi0 + delta;
        } else {
          // LRPC shift = NAIRU itself shifts. Final point reflects new NAIRU.
          finalU = nairu + delta;
          finalPi = pi0;
        }
      }
    }
  }

  return {
    nairu,
    initialUnemployment: u0,
    initialInflation: pi0,
    showLrpc,
    shift,
    finalUnemployment: finalU,
    finalInflation: finalPi,
    title: typeof params.title === 'string' ? params.title : undefined,
  };
}

// ── money_market ────────────────────────────────────────────────────────

export interface MoneyMarketShift {
  curve: 'Ms' | 'Md';
  direction: 'left' | 'right';
  magnitude: number;
  label?: string;
}

export interface MoneyMarketFigure {
  /** x-position of vertical Money Supply curve. 0..100. */
  moneySupplyQuantity: number;
  /** Initial equilibrium nominal interest rate (where Md intersects Ms). 0..100. */
  initialInterestRate: number;
  shift?: MoneyMarketShift;
  finalInterestRate?: number;
  finalMoneyQuantity?: number;
  title?: string;
}

export function solveMoneyMarket(params: Record<string, unknown>): MoneyMarketFigure {
  const Q = typeof params.moneySupplyQuantity === 'number' ? params.moneySupplyQuantity : 50;
  const i0 = typeof params.initialInterestRate === 'number' ? params.initialInterestRate : 50;

  let shift: MoneyMarketShift | undefined;
  let finalI: number | undefined;
  let finalQ: number | undefined;
  if (params.shift && typeof params.shift === 'object') {
    const s = params.shift as Record<string, unknown>;
    if ((s.curve === 'Ms' || s.curve === 'Md') && (s.direction === 'left' || s.direction === 'right')) {
      shift = {
        curve: s.curve,
        direction: s.direction,
        magnitude: typeof s.magnitude === 'number' && s.magnitude > 0 ? s.magnitude : 10,
        label: typeof s.label === 'string' ? s.label : undefined,
      };
      const delta = shift.direction === 'right' ? shift.magnitude : -shift.magnitude;
      if (shift.curve === 'Ms') {
        // Ms shift right → quantity rises, interest rate falls (along Md slope of -1).
        finalQ = Q + delta;
        finalI = i0 - delta;
      } else {
        // Md shift right → at fixed Ms, interest rate rises; quantity unchanged.
        finalQ = Q;
        finalI = i0 + delta;
      }
    }
  }

  return {
    moneySupplyQuantity: Q,
    initialInterestRate: i0,
    shift,
    finalInterestRate: finalI,
    finalMoneyQuantity: finalQ,
    title: typeof params.title === 'string' ? params.title : undefined,
  };
}

// ── loanable_funds ──────────────────────────────────────────────────────

export interface LoanableFundsShift {
  curve: 'S' | 'D';
  direction: 'left' | 'right';
  magnitude: number;
  label?: string;
}

export interface LoanableFundsFigure {
  /** Initial equilibrium quantity of loanable funds. 0..100. */
  initialQuantity: number;
  /** Initial equilibrium real interest rate. 0..100. */
  initialRealRate: number;
  shift?: LoanableFundsShift;
  finalQuantity?: number;
  finalRealRate?: number;
  title?: string;
}

export function solveLoanableFunds(params: Record<string, unknown>): LoanableFundsFigure {
  const Q0 = typeof params.initialQuantity === 'number' ? params.initialQuantity : 50;
  const r0 = typeof params.initialRealRate === 'number' ? params.initialRealRate : 50;

  let shift: LoanableFundsShift | undefined;
  let finalQ: number | undefined;
  let finalR: number | undefined;
  if (params.shift && typeof params.shift === 'object') {
    const s = params.shift as Record<string, unknown>;
    if ((s.curve === 'S' || s.curve === 'D') && (s.direction === 'left' || s.direction === 'right')) {
      shift = {
        curve: s.curve,
        direction: s.direction,
        magnitude: typeof s.magnitude === 'number' && s.magnitude > 0 ? s.magnitude : 10,
        label: typeof s.label === 'string' ? s.label : undefined,
      };
      const delta = shift.direction === 'right' ? shift.magnitude : -shift.magnitude;
      if (shift.curve === 'S') {
        // Saving shift right (more saving): rate falls, quantity rises. Both by delta/2.
        finalQ = Q0 + delta / 2;
        finalR = r0 - delta / 2;
      } else {
        // Demand shift right (more borrowing): rate rises, quantity rises. Both by delta/2.
        finalQ = Q0 + delta / 2;
        finalR = r0 + delta / 2;
      }
    }
  }

  return {
    initialQuantity: Q0,
    initialRealRate: r0,
    shift,
    finalQuantity: finalQ,
    finalRealRate: finalR,
    title: typeof params.title === 'string' ? params.title : undefined,
  };
}

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
  // Auto-detect peaks and troughs when brain doesn't pass markers AND
  // labels aren't suppressed. Previously this happened only in the
  // renderer, which meant the manifest never saw the markers — brain
  // couldn't scribble "Peak" / "Trough" because they had no feature.
  if (!markers && labels !== 'none') {
    const trendAt = (t: number) => 0.5 + (t - 0.5) * (trendSlope * 0.5);
    const cycleAt = (t: number) => trendAt(t) + amplitude * Math.sin(t * cycles * 2 * Math.PI - Math.PI / 2);
    const segments = 200;
    const auto: BusinessCyclePhaseMarker[] = [];
    for (let i = 1; i < segments; i++) {
      const t = i / segments;
      const dPrev = cycleAt(t) - cycleAt((i - 1) / segments);
      const dNext = cycleAt((i + 1) / segments) - cycleAt(t);
      if (dPrev > 0 && dNext < 0) auto.push({ t, label: 'Peak', showLine: true });
      if (dPrev < 0 && dNext > 0) auto.push({ t, label: 'Trough', showLine: true });
    }
    markers = auto;
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

/** Classify a point geometrically against the actual curve. The
 *  brain's optional `p.position` is treated as a HINT (preferred when
 *  it agrees with geometry, e.g. labeling a near-curve point as "on"
 *  within the tolerance), but the geometry wins when they disagree.
 *
 *  Previously this trusted brain's claim outright, which produced the
 *  2026-05-14 PPC live-test bug: brain labeled points at (20,75),
 *  (55,55), (80,20) as `position: "on"` when the actual curve at those
 *  x-values runs y = 98, 83.5, 60 respectively — all three points sat
 *  ~25-40 units inside the curve. They rendered green ("on curve") on
 *  a quarter-ellipse where they were clearly inside. */
function classifyPoint(p: PPCPoint, xMax: number, yMax: number, curve: 'bowed-out' | 'linear'): 'inside' | 'on' | 'outside' {
  if (p.x < 0 || p.y < 0) return 'inside';
  if (p.x > xMax || p.y > yMax) return 'outside';
  const yOn = curveYAt(p.x, xMax, yMax, curve);
  const tol = ON_CURVE_TOLERANCE * yMax;
  const geometric: 'inside' | 'on' | 'outside' =
    Math.abs(p.y - yOn) <= tol ? 'on' : (p.y < yOn ? 'inside' : 'outside');
  // Accept the brain's hint only when it matches geometry — geometry
  // is the ground truth on a structured-diagram renderer.
  if (p.position && p.position === geometric) return p.position;
  return geometric;
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

  // When brain claims `position: "on"`, SNAP the point's y to the
  // actual curve at that x. Brain controls placement intent (which x
  // along the curve) but geometry enforces consistency (the point
  // really IS on the curve). Without this, brain's narrative ("A is
  // efficient, on the curve") visually contradicts the rendered dot
  // sitting well inside the curve (2026-05-14 PPC live test).
  for (const p of points) {
    if (p.position === 'on') {
      p.y = curveYAt(p.x, xRaw.max as number, yRaw.max as number, curve);
    }
  }
  // Then classify every point against the geometry. Brain-supplied
  // `position` is treated as a hint inside classifyPoint (accepted
  // when it matches geometry, overridden when it doesn't).
  for (const p of points) {
    p.position = classifyPoint(p, xRaw.max as number, yRaw.max as number, curve);
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

// ═══════════════════════════════════════════════════════════════════
// Phase 9 manifests (whiteboard markup initiative). Common pattern
// across the 5 market-like kinds (ad_as, money_market, loanable_funds,
// phillips_curve, fx_market):
//   - diagram root (region)
//   - each initial curve (with displayName = its conventional name)
//   - each shifted curve (when shift present)
//   - initial equilibrium point (E₀)
//   - final equilibrium point (E₁) when shift present
//
// PPC and business_cycle are structurally different and have their own
// per-point / per-marker features.
// ═══════════════════════════════════════════════════════════════════

/** Slugify a string for use in a data-feature id. */
function _econSlug(label: string): string {
  return label.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// ── production_possibilities ──────────────────────────────────────
export const productionPossibilitiesFeatureNames = {
  diagram: 'ppc-diagram',
  curve: 'ppc-curve',
  shiftedCurve: 'ppc-shifted',
  point: (label: string | undefined, idx: number): string =>
    label ? `point-${_econSlug(label)}` : `point-${idx}`,
};

export function buildProductionPossibilitiesManifest(figure: PPCFigure): FeatureManifestEntry[] {
  const N = productionPossibilitiesFeatureNames;
  const features: FeatureManifestEntry[] = [
    {
      name: N.diagram,
      kind: 'region',
      description: 'production possibilities curve',
      labels: ['PPC', 'the PPC', 'production possibilities', 'the production possibilities curve', 'the curve', 'the diagram', 'the graph'],
      displayName: figure.title || 'PPC',
      scribbleable: true,
    },
    {
      name: N.curve,
      kind: 'label',
      description: `PPC (${figure.curve === 'linear' ? 'constant' : 'increasing'} opportunity cost)`,
      labels: ['PPC', 'the PPC', 'curve', 'the curve', 'production possibilities curve', 'the production possibilities curve'],
      displayName: 'PPC',
      scribbleable: true,
    },
  ];
  if (figure.shift) {
    features.push({
      name: N.shiftedCurve,
      kind: 'label',
      description: `shifted PPC (${figure.shift.direction === 'out' ? 'economic growth' : 'contraction'})`,
      labels: [
        'shifted PPC', 'the shifted PPC', 'new PPC', 'the new PPC',
        figure.shift.direction === 'out' ? 'growth' : 'contraction',
        figure.shift.direction === 'out' ? 'the growth' : 'the contraction',
        figure.shift.label || '', `"${figure.shift.label || ''}"`,
      ].filter(Boolean),
      displayName: figure.shift.direction === 'out' ? 'PPC growth' : 'PPC contraction',
      scribbleable: true,
    });
  }
  figure.points.forEach((p, i) => {
    const labels = [`point ${p.label || i + 1}`];
    if (p.label) {
      labels.push(p.label, `the ${p.label}`, `"${p.label}"`, `point "${p.label}"`);
      // Short-form: extract the leading letter/word before any space or
      // parenthesis (e.g. "A (on curve)" → "A"). Brain commonly emits
      // the short form ("point A") which the verbose label form misses.
      const shortForm = p.label.split(/[\s(]/)[0].trim();
      if (shortForm && shortForm !== p.label) {
        labels.push(shortForm, `the ${shortForm}`, `point ${shortForm}`, `the point ${shortForm}`, `the ${shortForm} point`);
      }
    }
    if (p.position) {
      labels.push(`${p.position} the curve`, `${p.position}-curve point`);
      if (p.position === 'inside') labels.push('inefficient point', 'the inefficient point');
      if (p.position === 'on') labels.push('efficient point', 'on the curve', 'on-curve point');
      if (p.position === 'outside') labels.push('unattainable point', 'the unattainable point');
    }
    features.push({
      name: N.point(p.label, i),
      kind: 'label',
      description: `point ${p.label || i + 1}${p.position ? ` (${p.position} the curve)` : ''} at (${p.x}, ${p.y})`,
      labels,
      displayName: p.label ? `point ${p.label}` : `point ${i + 1}`,
      scribbleable: true,
    });
  });
  return features;
}

// ── business_cycle ────────────────────────────────────────────────
export const businessCycleFeatureNames = {
  diagram: 'business-cycle',
  cycle: 'cycle-curve',
  trend: 'trend-line',
  marker: (label: string, idx: number): string => `marker-${_econSlug(label) || idx}`,
};

export function buildBusinessCycleManifest(figure: BusinessCycleFigure): FeatureManifestEntry[] {
  const N = businessCycleFeatureNames;
  const features: FeatureManifestEntry[] = [
    {
      name: N.diagram,
      kind: 'region',
      description: 'business cycle diagram',
      labels: ['business cycle', 'the business cycle', 'the cycle', 'the diagram', 'the graph'],
      displayName: figure.title || 'business cycle',
      scribbleable: true,
    },
    {
      name: N.cycle,
      kind: 'label',
      description: 'cycle (real GDP over time)',
      labels: ['cycle', 'the cycle', 'cycle curve', 'the cycle curve', 'the wave', 'the GDP curve'],
      displayName: 'cycle',
      scribbleable: true,
    },
  ];
  if (figure.showTrend) {
    features.push({
      name: N.trend,
      kind: 'label',
      description: 'long-run trend (potential GDP)',
      labels: ['trend', 'the trend', 'trend line', 'the trend line', 'long-run trend', 'the long-run trend', 'potential GDP', 'potential output'],
      displayName: 'trend',
      scribbleable: true,
    });
  }
  (figure.markers ?? []).forEach((m, i) => {
    features.push({
      name: N.marker(m.label, i),
      kind: 'label',
      description: `phase marker: "${m.label}"`,
      labels: [m.label, `the ${m.label}`, `"${m.label}"`, `phase marker: "${m.label}"`],
      displayName: m.label,
      scribbleable: true,
    });
  });
  return features;
}

// ── aggregate_demand_supply ───────────────────────────────────────
export const adAsFeatureNames = {
  diagram: 'ad-as-diagram',
  ad: 'ad-curve',
  adShifted: 'ad-shifted',
  sras: 'sras-curve',
  srasShifted: 'sras-shifted',
  lras: 'lras-curve',
  lrasShifted: 'lras-shifted',
  eqInitial: 'eq-initial',
  eqFinal: 'eq-final',
};

export function buildAggregateDemandSupplyManifest(figure: AdAsFigure): FeatureManifestEntry[] {
  const N = adAsFeatureNames;
  const features: FeatureManifestEntry[] = [
    {
      name: N.diagram,
      kind: 'region',
      description: 'aggregate demand / aggregate supply diagram',
      labels: ['AD/AS', 'AD-AS', 'AD AS', 'the AD/AS diagram', 'the graph', 'the diagram'],
      displayName: figure.title || 'AD/AS',
      scribbleable: true,
    },
    {
      name: N.ad,
      kind: 'label',
      description: 'aggregate demand curve (AD)',
      labels: ['AD', figure.labels.ad, `the ${figure.labels.ad}`, 'aggregate demand', 'the aggregate demand curve', 'the AD curve', 'demand'],
      displayName: figure.labels.ad,
      scribbleable: true,
    },
    {
      name: N.sras,
      kind: 'label',
      description: 'short-run aggregate supply (SRAS)',
      labels: ['SRAS', figure.labels.sras, `the ${figure.labels.sras}`, 'short-run aggregate supply', 'the SRAS curve', 'short run supply'],
      displayName: figure.labels.sras,
      scribbleable: true,
    },
  ];
  if (figure.showLras) {
    features.push({
      name: N.lras,
      kind: 'label',
      description: 'long-run aggregate supply (LRAS, vertical at potential GDP)',
      labels: ['LRAS', figure.labels.lras, `the ${figure.labels.lras}`, 'long-run aggregate supply', 'the LRAS curve', 'potential GDP line', 'long run supply'],
      displayName: figure.labels.lras,
      scribbleable: true,
    });
  }
  features.push({
    name: N.eqInitial,
    kind: 'label',
    description: `initial equilibrium (${figure.labels.eqInitial})`,
    labels: [figure.labels.eqInitial, `"${figure.labels.eqInitial}"`, 'initial equilibrium', 'the initial equilibrium', 'E0', 'starting equilibrium'],
    displayName: figure.labels.eqInitial,
    scribbleable: true,
  });
  if (figure.shift) {
    const dirText = `${figure.shift.curve} shifts ${figure.shift.direction}`;
    if (figure.shift.curve === 'AD') {
      features.push({
        name: N.adShifted,
        kind: 'label',
        description: `shifted AD curve (${dirText})`,
        labels: ['AD\'', 'AD prime', 'shifted AD', 'new AD', 'the new AD', figure.shift.label || '', `"${figure.shift.label || ''}"`].filter(Boolean),
        displayName: `${figure.labels.ad}'`,
        scribbleable: true,
      });
    } else if (figure.shift.curve === 'SRAS') {
      features.push({
        name: N.srasShifted,
        kind: 'label',
        description: `shifted SRAS curve (${dirText})`,
        labels: ['SRAS\'', 'SRAS prime', 'shifted SRAS', 'new SRAS', figure.shift.label || '', `"${figure.shift.label || ''}"`].filter(Boolean),
        displayName: `${figure.labels.sras}'`,
        scribbleable: true,
      });
    } else if (figure.shift.curve === 'LRAS') {
      features.push({
        name: N.lrasShifted,
        kind: 'label',
        description: `shifted LRAS curve (${dirText})`,
        labels: ['LRAS\'', 'LRAS prime', 'shifted LRAS', 'new LRAS', figure.shift.label || '', `"${figure.shift.label || ''}"`].filter(Boolean),
        displayName: `${figure.labels.lras}'`,
        scribbleable: true,
      });
    }
    features.push({
      name: N.eqFinal,
      kind: 'label',
      description: `final equilibrium (${figure.labels.eqFinal})`,
      labels: [figure.labels.eqFinal, `"${figure.labels.eqFinal}"`, 'final equilibrium', 'the final equilibrium', 'new equilibrium', 'the new equilibrium', 'E1'],
      displayName: figure.labels.eqFinal,
      scribbleable: true,
    });
  }
  return features;
}

// ── money_market ──────────────────────────────────────────────────
export const moneyMarketFeatureNames = {
  diagram: 'money-market',
  ms: 'ms-curve',
  msShifted: 'ms-shifted',
  md: 'md-curve',
  mdShifted: 'md-shifted',
  eqInitial: 'eq-initial',
  eqFinal: 'eq-final',
};

export function buildMoneyMarketManifest(figure: MoneyMarketFigure): FeatureManifestEntry[] {
  const N = moneyMarketFeatureNames;
  const features: FeatureManifestEntry[] = [
    {
      name: N.diagram,
      kind: 'region',
      description: 'money market diagram',
      labels: ['money market', 'the money market', 'the diagram', 'the graph'],
      displayName: figure.title || 'money market',
      scribbleable: true,
    },
    {
      name: N.ms,
      kind: 'label',
      description: 'money supply (Ms, vertical)',
      labels: ['Ms', 'M_s', 'money supply', 'the money supply', 'the Ms curve', 'supply of money'],
      displayName: 'Ms',
      scribbleable: true,
    },
    {
      name: N.md,
      kind: 'label',
      description: 'money demand (Md, downward-sloping)',
      labels: ['Md', 'M_d', 'money demand', 'the money demand', 'the Md curve', 'demand for money'],
      displayName: 'Md',
      scribbleable: true,
    },
    {
      name: N.eqInitial,
      kind: 'label',
      description: 'initial equilibrium (Q₀, i₀)',
      labels: ['initial equilibrium', 'the initial equilibrium', 'starting equilibrium', 'E0', '(Q₀, i₀)', 'i₀', 'Q₀'],
      displayName: 'initial equilibrium',
      scribbleable: true,
    },
  ];
  if (figure.shift) {
    const which = figure.shift.curve;
    features.push({
      name: which === 'Ms' ? N.msShifted : N.mdShifted,
      kind: 'label',
      description: `shifted ${which} curve (${figure.shift.direction})`,
      labels: [`${which}'`, `${which} prime`, `shifted ${which}`, `new ${which}`, figure.shift.label || '', `"${figure.shift.label || ''}"`].filter(Boolean),
      displayName: `${which}'`,
      scribbleable: true,
    });
    features.push({
      name: N.eqFinal,
      kind: 'label',
      description: 'final equilibrium (Q₁, i₁)',
      labels: ['final equilibrium', 'the final equilibrium', 'new equilibrium', 'the new equilibrium', 'E1', '(Q₁, i₁)', 'i₁', 'Q₁'],
      displayName: 'final equilibrium',
      scribbleable: true,
    });
  }
  return features;
}

// ── loanable_funds ────────────────────────────────────────────────
export const loanableFundsFeatureNames = {
  diagram: 'loanable-funds',
  supply: 'supply-curve',
  supplyShifted: 'supply-shifted',
  demand: 'demand-curve',
  demandShifted: 'demand-shifted',
  eqInitial: 'eq-initial',
  eqFinal: 'eq-final',
};

export function buildLoanableFundsManifest(figure: LoanableFundsFigure): FeatureManifestEntry[] {
  const N = loanableFundsFeatureNames;
  const features: FeatureManifestEntry[] = [
    {
      name: N.diagram,
      kind: 'region',
      description: 'loanable funds market diagram',
      labels: ['loanable funds', 'the loanable funds market', 'the diagram', 'the graph'],
      displayName: figure.title || 'loanable funds',
      scribbleable: true,
    },
    {
      name: N.supply,
      kind: 'label',
      description: 'supply of loanable funds (S, upward-sloping)',
      labels: ['S', 'supply', 'the supply', 'supply curve', 'the supply curve', 'the S curve', 'supply of saving', 'saving'],
      displayName: 'S',
      scribbleable: true,
    },
    {
      name: N.demand,
      kind: 'label',
      description: 'demand for loanable funds (D, downward-sloping)',
      labels: ['D', 'demand', 'the demand', 'demand curve', 'the demand curve', 'the D curve', 'demand for investment', 'investment'],
      displayName: 'D',
      scribbleable: true,
    },
    {
      name: N.eqInitial,
      kind: 'label',
      description: 'initial equilibrium (Q₀, r₀)',
      labels: ['initial equilibrium', 'the initial equilibrium', 'starting equilibrium', 'E0', '(Q₀, r₀)', 'r₀', 'Q₀'],
      displayName: 'initial equilibrium',
      scribbleable: true,
    },
  ];
  if (figure.shift) {
    const which = figure.shift.curve;
    features.push({
      name: which === 'S' ? N.supplyShifted : N.demandShifted,
      kind: 'label',
      description: `shifted ${which} curve (${figure.shift.direction})`,
      labels: [`${which}'`, `${which} prime`, `shifted ${which}`, `new ${which}`, figure.shift.label || '', `"${figure.shift.label || ''}"`].filter(Boolean),
      displayName: `${which}'`,
      scribbleable: true,
    });
    features.push({
      name: N.eqFinal,
      kind: 'label',
      description: 'final equilibrium (Q₁, r₁)',
      labels: ['final equilibrium', 'the final equilibrium', 'new equilibrium', 'the new equilibrium', 'E1', '(Q₁, r₁)', 'r₁', 'Q₁'],
      displayName: 'final equilibrium',
      scribbleable: true,
    });
  }
  return features;
}

// ── phillips_curve ────────────────────────────────────────────────
export const phillipsCurveFeatureNames = {
  diagram: 'phillips-curve',
  srpc: 'srpc-curve',
  srpcShifted: 'srpc-shifted',
  lrpc: 'lrpc-curve',
  lrpcShifted: 'lrpc-shifted',
  eqInitial: 'eq-initial',
  eqFinal: 'eq-final',
};

export function buildPhillipsCurveManifest(figure: PhillipsCurveFigure): FeatureManifestEntry[] {
  const N = phillipsCurveFeatureNames;
  const features: FeatureManifestEntry[] = [
    {
      name: N.diagram,
      kind: 'region',
      description: 'Phillips curve diagram',
      labels: ['Phillips curve', 'the Phillips curve', 'the diagram', 'the graph'],
      displayName: figure.title || 'Phillips curve',
      scribbleable: true,
    },
    {
      name: N.srpc,
      kind: 'label',
      description: 'short-run Phillips curve (SRPC, downward-sloping)',
      labels: ['SRPC', 'short-run Phillips curve', 'the SRPC', 'the short-run Phillips curve', 'short-run curve'],
      displayName: 'SRPC',
      scribbleable: true,
    },
  ];
  if (figure.showLrpc) {
    features.push({
      name: N.lrpc,
      kind: 'label',
      description: 'long-run Phillips curve (LRPC, vertical at NAIRU)',
      labels: ['LRPC', 'long-run Phillips curve', 'the LRPC', 'the long-run Phillips curve', 'long-run curve', 'NAIRU line'],
      displayName: 'LRPC',
      scribbleable: true,
    });
  }
  features.push({
    name: N.eqInitial,
    kind: 'label',
    description: 'initial equilibrium (U₀, π₀)',
    labels: ['initial equilibrium', 'the initial equilibrium', 'starting equilibrium', 'E0', '(U₀, π₀)', 'π₀', 'U₀'],
    displayName: 'initial equilibrium',
    scribbleable: true,
  });
  if (figure.shift) {
    const which = figure.shift.curve;
    features.push({
      name: which === 'SRPC' ? N.srpcShifted : N.lrpcShifted,
      kind: 'label',
      description: `shifted ${which} (${figure.shift.direction})`,
      labels: [`${which}'`, `${which} prime`, `shifted ${which}`, `new ${which}`, figure.shift.label || '', `"${figure.shift.label || ''}"`].filter(Boolean),
      displayName: `${which}'`,
      scribbleable: true,
    });
    features.push({
      name: N.eqFinal,
      kind: 'label',
      description: 'final equilibrium (U₁, π₁)',
      labels: ['final equilibrium', 'the final equilibrium', 'new equilibrium', 'the new equilibrium', 'E1', '(U₁, π₁)', 'π₁', 'U₁'],
      displayName: 'final equilibrium',
      scribbleable: true,
    });
  }
  return features;
}

// ── foreign_exchange_market ───────────────────────────────────────
export const fxMarketFeatureNames = {
  diagram: 'fx-market',
  supply: 'supply-curve',
  supplyShifted: 'supply-shifted',
  demand: 'demand-curve',
  demandShifted: 'demand-shifted',
  eqInitial: 'eq-initial',
  eqFinal: 'eq-final',
};

export function buildForeignExchangeMarketManifest(figure: FxMarketFigure): FeatureManifestEntry[] {
  const N = fxMarketFeatureNames;
  const cur = figure.currency;
  const features: FeatureManifestEntry[] = [
    {
      name: N.diagram,
      kind: 'region',
      description: `foreign exchange market for ${cur}`,
      labels: ['FX market', 'foreign exchange market', 'the FX market', `the ${cur} market`, 'the diagram', 'the graph'],
      displayName: figure.title || `FX market (${cur})`,
      scribbleable: true,
    },
    {
      name: N.supply,
      kind: 'label',
      description: `supply of ${cur} (S${cur}, upward-sloping)`,
      labels: [`S${cur}`, `S_${cur}`, `supply of ${cur}`, `the ${cur} supply curve`, 'S', 'supply', 'the supply', 'supply curve'],
      displayName: `S${cur}`,
      scribbleable: true,
    },
    {
      name: N.demand,
      kind: 'label',
      description: `demand for ${cur} (D${cur}, downward-sloping)`,
      labels: [`D${cur}`, `D_${cur}`, `demand for ${cur}`, `the ${cur} demand curve`, 'D', 'demand', 'the demand', 'demand curve'],
      displayName: `D${cur}`,
      scribbleable: true,
    },
    {
      name: N.eqInitial,
      kind: 'label',
      description: 'initial equilibrium (Q₀, e₀)',
      labels: ['initial equilibrium', 'the initial equilibrium', 'starting equilibrium', 'E0', '(Q₀, e₀)', 'e₀', 'Q₀'],
      displayName: 'initial equilibrium',
      scribbleable: true,
    },
  ];
  if (figure.shift) {
    const which = figure.shift.curve;
    const fullName = `${which}${cur}`;
    features.push({
      name: which === 'S' ? N.supplyShifted : N.demandShifted,
      kind: 'label',
      description: `shifted ${fullName} (${figure.shift.direction})`,
      labels: [`${fullName}'`, `${fullName} prime`, `${which}'`, `shifted ${which}`, `new ${fullName}`, figure.shift.label || '', `"${figure.shift.label || ''}"`].filter(Boolean),
      displayName: `${fullName}'`,
      scribbleable: true,
    });
    features.push({
      name: N.eqFinal,
      kind: 'label',
      description: 'final equilibrium (Q₁, e₁)',
      labels: ['final equilibrium', 'the final equilibrium', 'new equilibrium', 'the new equilibrium', 'E1', '(Q₁, e₁)', 'e₁', 'Q₁'],
      displayName: 'final equilibrium',
      scribbleable: true,
    });
  }
  return features;
}

// ── supply_demand (micro single-market) ─────────────────────────────────────

export interface SupplyDemandShift {
  curve: 'S' | 'D';
  direction: 'left' | 'right';
  magnitude: number;
  label?: string;
}

export interface PriceControl {
  type: 'ceiling' | 'floor';
  level: number;      // 0..100 price
  label?: string;
  /** Quantity demanded and supplied at the control price (for shortage/surplus). */
  qDemand: number;
  qSupply: number;
  binding: boolean;   // ceiling below eq, or floor above eq
}

export interface SupplyDemandFigure {
  good: string;
  initialQuantity: number;  // 0..100
  initialPrice: number;     // 0..100
  shift?: SupplyDemandShift;
  finalQuantity?: number;
  finalPrice?: number;
  priceControl?: PriceControl;
  title?: string;
}

/** Micro single-market supply & demand. S slope +1, D slope −1, both through
 *  (Q₀, P₀). Supports one comparative-statics shift (S/D, left/right) with the
 *  new equilibrium computed, OR a binding price control (ceiling/floor) with
 *  the resulting shortage/surplus quantities computed. */
export function solveSupplyDemand(params: Record<string, unknown>): SupplyDemandFigure {
  const good = typeof params.good === 'string' && params.good.trim() ? params.good.trim() : 'the good';
  const clamp = (v: unknown, d: number) => (typeof v === 'number' && Number.isFinite(v) ? Math.max(5, Math.min(95, v)) : d);
  const Q0 = clamp(params.initialQuantity, 50);
  const P0 = clamp(params.initialPrice, 50);

  // Line intercepts (P at Q=0): S: P = (P0−Q0) + Q ; D: P = (P0+Q0) − Q.
  const sInt = P0 - Q0;
  const dInt = P0 + Q0;

  let shift: SupplyDemandShift | undefined;
  let finalQ: number | undefined;
  let finalP: number | undefined;
  if (params.shift && typeof params.shift === 'object') {
    const s = params.shift as Record<string, unknown>;
    if ((s.curve === 'S' || s.curve === 'D') && (s.direction === 'left' || s.direction === 'right')) {
      shift = {
        curve: s.curve,
        direction: s.direction,
        magnitude: typeof s.magnitude === 'number' && s.magnitude > 0 ? s.magnitude : 12,
        label: typeof s.label === 'string' ? s.label : undefined,
      };
      const delta = shift.direction === 'right' ? shift.magnitude : -shift.magnitude;
      if (shift.curve === 'S') {
        // S right ⇒ Q up, P down.
        finalQ = Q0 + delta / 2;
        finalP = P0 - delta / 2;
      } else {
        // D right ⇒ Q up, P up.
        finalQ = Q0 + delta / 2;
        finalP = P0 + delta / 2;
      }
    }
  }

  let priceControl: PriceControl | undefined;
  if (params.priceControl && typeof params.priceControl === 'object') {
    const pc = params.priceControl as Record<string, unknown>;
    if ((pc.type === 'ceiling' || pc.type === 'floor') && typeof pc.level === 'number' && Number.isFinite(pc.level)) {
      const level = Math.max(0, Math.min(100, pc.level));
      // At price = level: Qs from S (Q = P − sInt), Qd from D (Q = dInt − P).
      const qSupply = Math.max(0, level - sInt);
      const qDemand = Math.max(0, dInt - level);
      const binding = pc.type === 'ceiling' ? level < P0 : level > P0;
      priceControl = {
        type: pc.type,
        level,
        label: typeof pc.label === 'string' ? pc.label : undefined,
        qDemand,
        qSupply,
        binding,
      };
    }
  }

  return {
    good,
    initialQuantity: Q0,
    initialPrice: P0,
    shift,
    finalQuantity: finalQ,
    finalPrice: finalP,
    priceControl,
    title: typeof params.title === 'string' ? params.title : undefined,
  };
}

export const supplyDemandFeatureNames = {
  diagram: 'supply-demand',
  supply: 'supply-curve',
  supplyShifted: 'supply-shifted',
  demand: 'demand-curve',
  demandShifted: 'demand-shifted',
  eqInitial: 'eq-initial',
  eqFinal: 'eq-final',
  priceControl: 'price-control',
  gap: 'shortage-surplus',
};

export function buildSupplyDemandManifest(figure: SupplyDemandFigure): FeatureManifestEntry[] {
  const N = supplyDemandFeatureNames;
  const g = figure.good;
  const features: FeatureManifestEntry[] = [
    {
      name: N.diagram,
      kind: 'region',
      description: `supply & demand for ${g}`,
      labels: ['supply and demand', 'supply & demand', 'the S/D diagram', `the market for ${g}`, 'the market', 'the diagram', 'the graph'],
      displayName: figure.title || `Supply & demand — ${g}`,
      scribbleable: true,
    },
    {
      name: N.supply,
      kind: 'label',
      description: `supply curve (S, upward-sloping)`,
      labels: ['S', 'supply', 'the supply', 'supply curve', 'the supply curve'],
      displayName: 'S',
      scribbleable: true,
    },
    {
      name: N.demand,
      kind: 'label',
      description: `demand curve (D, downward-sloping)`,
      labels: ['D', 'demand', 'the demand', 'demand curve', 'the demand curve'],
      displayName: 'D',
      scribbleable: true,
    },
    {
      name: N.eqInitial,
      kind: 'label',
      description: 'equilibrium (Q*, P*)',
      labels: ['equilibrium', 'the equilibrium', 'initial equilibrium', 'E0', '(Q*, P*)', 'P*', 'Q*'],
      displayName: 'equilibrium',
      scribbleable: true,
    },
  ];
  if (figure.shift) {
    const which = figure.shift.curve;
    features.push({
      name: which === 'S' ? N.supplyShifted : N.demandShifted,
      kind: 'label',
      description: `shifted ${which} (${figure.shift.direction})`,
      labels: [`${which}'`, `${which} prime`, `shifted ${which}`, `new ${which}`, figure.shift.label || '', `"${figure.shift.label || ''}"`].filter(Boolean),
      displayName: `${which}'`,
      scribbleable: true,
    });
    features.push({
      name: N.eqFinal,
      kind: 'label',
      description: 'new equilibrium (Q₁, P₁)',
      labels: ['new equilibrium', 'the new equilibrium', 'final equilibrium', 'E1', '(Q₁, P₁)', 'P₁', 'Q₁'],
      displayName: 'new equilibrium',
      scribbleable: true,
    });
  }
  if (figure.priceControl) {
    const pc = figure.priceControl;
    features.push({
      name: N.priceControl,
      kind: 'label',
      description: `price ${pc.type} at ${pc.level}`,
      labels: [`price ${pc.type}`, `the ${pc.type}`, pc.type, 'price control', pc.label || '', `"${pc.label || ''}"`].filter(Boolean),
      displayName: `price ${pc.type}`,
      scribbleable: true,
    });
    if (pc.binding) {
      const kindWord = pc.type === 'ceiling' ? 'shortage' : 'surplus';
      features.push({
        name: N.gap,
        kind: 'label',
        description: `${kindWord} (Qd vs Qs at the control price)`,
        labels: [kindWord, `the ${kindWord}`, 'shortage', 'surplus'],
        displayName: kindWord,
        scribbleable: true,
      });
    }
  }
  return features;
}

// ── circular_flow (two-sector model) ────────────────────────────────────────

export interface CircularFlowFigure {
  showMoneyFlow: boolean; // outer loop (payments / income / revenue / spending)
  showRealFlow: boolean;  // inner loop (resources / goods & services)
  title?: string;
}

/** Two-sector circular-flow model: Households ⇄ Firms through the Product
 *  Market (top) and the Resource/Factor Market (bottom). Structure is fixed;
 *  the money loop and the real (goods/resources) loop can each be toggled. */
export function solveCircularFlow(params: Record<string, unknown>): CircularFlowFigure {
  return {
    showMoneyFlow: params.showMoneyFlow !== false,
    showRealFlow: params.showRealFlow !== false,
    title: typeof params.title === 'string' ? params.title : undefined,
  };
}

export const circularFlowFeatureNames = {
  diagram: 'circular-flow',
  households: 'households',
  firms: 'firms',
  productMarket: 'product-market',
  resourceMarket: 'resource-market',
  moneyFlow: 'money-flow',
  realFlow: 'real-flow',
};

export function buildCircularFlowManifest(figure: CircularFlowFigure): FeatureManifestEntry[] {
  const N = circularFlowFeatureNames;
  const features: FeatureManifestEntry[] = [
    {
      name: N.diagram,
      kind: 'region',
      description: 'two-sector circular-flow model',
      labels: ['circular flow', 'the circular flow', 'the circular flow model', 'the diagram', 'the graph'],
      displayName: figure.title || 'Circular flow',
      scribbleable: true,
    },
    { name: N.households, kind: 'shape', description: 'Households sector', labels: ['households', 'the households', 'the household sector'], displayName: 'Households', scribbleable: true },
    { name: N.firms, kind: 'shape', description: 'Firms / businesses sector', labels: ['firms', 'the firms', 'businesses', 'the business sector'], displayName: 'Firms', scribbleable: true },
    { name: N.productMarket, kind: 'shape', description: 'Product market (goods & services)', labels: ['product market', 'the product market', 'goods market', 'goods and services market'], displayName: 'Product Market', scribbleable: true },
    { name: N.resourceMarket, kind: 'shape', description: 'Resource / factor market (land, labor, capital)', labels: ['resource market', 'the resource market', 'factor market', 'the factor market'], displayName: 'Resource Market', scribbleable: true },
  ];
  if (figure.showMoneyFlow) features.push({ name: N.moneyFlow, kind: 'label', description: 'Money flow (outer loop)', labels: ['money flow', 'the money flow', 'the outer loop', 'money loop'], displayName: 'money flow', scribbleable: true });
  if (figure.showRealFlow) features.push({ name: N.realFlow, kind: 'label', description: 'Real flow of resources & goods (inner loop)', labels: ['real flow', 'the real flow', 'the inner loop', 'goods and resources flow'], displayName: 'real flow', scribbleable: true });
  return features;
}
