/**
 * Physics diagrams — solvers.
 *
 * Bundled because each kind is small. The key invariants are checked
 * here so the brain can't ask for an inconsistent setup (e.g. a balanced
 * lever with mismatched moments).
 */

// ── balance_scale ──────────────────────────────────────────────────────────
export interface BalanceScaleItem { label: string; weight?: number; color?: string }
export interface BalanceScaleFigure {
  left: BalanceScaleItem[];
  right: BalanceScaleItem[];
  state: 'level' | 'tilt_left' | 'tilt_right';
  hasUnknown: boolean;
  title?: string;
  caption?: string;
}
function parseScaleItems(arr: unknown, side: string): BalanceScaleItem[] {
  if (!Array.isArray(arr)) throw new Error(`balance_scale: ${side} must be an array`);
  return arr.map((raw, i) => {
    if (!raw || typeof raw !== 'object') throw new Error(`balance_scale: ${side}[${i}] must be an object`);
    const it = raw as Record<string, unknown>;
    if (typeof it.label !== 'string' || !it.label.trim()) throw new Error(`balance_scale: ${side}[${i}].label is required`);
    return {
      label: it.label,
      weight: typeof it.weight === 'number' && Number.isFinite(it.weight) ? it.weight : undefined,
      color: typeof it.color === 'string' ? it.color : undefined,
    };
  });
}
export function solveBalanceScale(params: Record<string, unknown>): BalanceScaleFigure {
  const left = parseScaleItems(params.left, 'left');
  const right = parseScaleItems(params.right, 'right');
  const hasUnknown = left.some((i) => i.weight === undefined) || right.some((i) => i.weight === undefined);
  const ls = left.reduce((s, i) => s + (i.weight ?? 0), 0);
  const rs = right.reduce((s, i) => s + (i.weight ?? 0), 0);
  let state: BalanceScaleFigure['state'] = 'level';
  if (!hasUnknown) {
    if (Math.abs(ls - rs) < 1e-9) state = 'level';
    else if (ls > rs) state = 'tilt_left';
    else state = 'tilt_right';
  }
  return {
    left, right, state, hasUnknown,
    title: typeof params.title === 'string' ? params.title : undefined,
    caption: typeof params.caption === 'string' ? params.caption : undefined,
  };
}

// ── lever ─────────────────────────────────────────────────────────────────
export interface LeverFigure {
  effort: number;
  load: number;
  effortDistance: number;
  loadDistance: number;
  fulcrumPosition: number; // 0 to 1 along the bar
  balanced: boolean;
  title?: string;
}
export function solveLever(params: Record<string, unknown>): LeverFigure {
  const effort = num(params.effort, 'lever.effort');
  const load = num(params.load, 'lever.load');
  const effortDistance = num(params.effortDistance, 'lever.effortDistance');
  const loadDistance = num(params.loadDistance, 'lever.loadDistance');
  if (effort <= 0 || load <= 0) throw new Error('lever: effort and load must be positive');
  if (effortDistance <= 0 || loadDistance <= 0) throw new Error('lever: distances must be positive');
  const total = effortDistance + loadDistance;
  const fulcrumPosition = loadDistance / total;
  const balanced = Math.abs(effort * effortDistance - load * loadDistance) < 1e-9;
  return {
    effort, load, effortDistance, loadDistance, fulcrumPosition, balanced,
    title: typeof params.title === 'string' ? params.title : undefined,
  };
}

// ── pulley_system ─────────────────────────────────────────────────────────
export type PulleyMode = 'block-tackle' | 'atwood' | 'table-pulley' | 'incline-pulley';
export interface AtwoodSide {
  label: string;
  weight?: string;
}
export interface PulleyFigure {
  mode: PulleyMode;
  fixedCount: number;
  movableCount: number;
  weightLabel: string;
  weight?: number;
  mechanicalAdvantage: number;
  effort?: number;
  /** For atwood / table-pulley / incline-pulley modes: the two connected bodies. */
  leftSide?: AtwoodSide;
  rightSide?: AtwoodSide;
  /** For incline-pulley: angle of the ramp in degrees. */
  inclineAngle?: number;
  title?: string;
}
export function solvePulleySystem(params: Record<string, unknown>): PulleyFigure {
  const rawMode = typeof params.mode === 'string' ? params.mode : 'block-tackle';
  const mode: PulleyMode =
    rawMode === 'atwood' || rawMode === 'table-pulley' || rawMode === 'incline-pulley'
      ? rawMode
      : 'block-tackle';

  if (mode === 'atwood' || mode === 'table-pulley' || mode === 'incline-pulley') {
    const sides = parseAtwoodSides(params, mode);
    let inclineAngle: number | undefined;
    if (mode === 'incline-pulley') {
      const a = num(params.inclineAngle ?? params.angle ?? 30, 'pulley.inclineAngle');
      inclineAngle = a > 0 && a < 90 ? a : 30;
    }
    return {
      mode,
      fixedCount: 1,
      movableCount: 0,
      weightLabel: '',
      mechanicalAdvantage: 1,
      leftSide: sides.left,
      rightSide: sides.right,
      inclineAngle,
      title: typeof params.title === 'string' ? params.title : undefined,
    };
  }

  const fixedCount = Math.max(0, Math.floor(num(params.fixedCount ?? 1, 'pulley.fixedCount')));
  const movableCount = Math.max(0, Math.floor(num(params.movableCount ?? 0, 'pulley.movableCount')));
  if (fixedCount + movableCount === 0) throw new Error('pulley_system: at least one pulley required');
  const weightLabel = typeof params.weightLabel === 'string' && params.weightLabel ? params.weightLabel : 'W';
  const weight = typeof params.weight === 'number' && Number.isFinite(params.weight) ? params.weight : undefined;
  // Simple block-and-tackle: MA = number of rope segments supporting load.
  // Approximation: 1 + 2*movableCount.
  const mechanicalAdvantage = 1 + 2 * movableCount;
  const effort = weight !== undefined ? weight / mechanicalAdvantage : undefined;
  return {
    mode: 'block-tackle',
    fixedCount, movableCount, weightLabel, weight, mechanicalAdvantage, effort,
    title: typeof params.title === 'string' ? params.title : undefined,
  };
}

function parseAtwoodSides(
  params: Record<string, unknown>,
  mode: PulleyMode,
): { left: AtwoodSide; right: AtwoodSide } {
  // Accept many shapes: explicit `leftSide`/`rightSide`, a `loads` array, or
  // semantic synonyms the brain reaches for (`tableBlock`/`hangingBlock`,
  // `inclineBlock`/`hangingBlock`, `topBlock`/`bottomBlock`). Without these
  // fallbacks the brain's improvised param shapes silently render as default
  // labels (observed 2026-05-07).
  const fromObj = (v: unknown, fallbackLabel: string): AtwoodSide => {
    if (v && typeof v === 'object') {
      const o = v as Record<string, unknown>;
      const label = typeof o.label === 'string' && o.label
        ? o.label
        : typeof o.mass === 'string' && o.mass
          ? o.mass
          : fallbackLabel;
      const weight = typeof o.weight === 'string' && o.weight ? o.weight : undefined;
      return { label, weight };
    }
    return { label: fallbackLabel };
  };
  if (Array.isArray(params.loads) && params.loads.length >= 1) {
    const left = fromObj(params.loads[0], 'm₁');
    const right = fromObj(params.loads[1] ?? params.loads[0], 'm₂');
    return { left, right };
  }
  // Mode-specific synonyms — left side maps to "the supported body" (table,
  // incline), right side maps to the hanging body.
  if (mode === 'table-pulley') {
    const left = params.leftSide ?? params.tableBlock ?? params.topBlock;
    const right = params.rightSide ?? params.hangingBlock ?? params.bottomBlock;
    return {
      left: fromObj(left, 'A'),
      right: fromObj(right, 'B'),
    };
  }
  if (mode === 'incline-pulley') {
    const left = params.leftSide ?? params.inclineBlock ?? params.rampBlock ?? params.topBlock;
    const right = params.rightSide ?? params.hangingBlock ?? params.bottomBlock;
    return {
      left: fromObj(left, 'm₁'),
      right: fromObj(right, 'm₂'),
    };
  }
  return {
    left: fromObj(params.leftSide, 'm₁'),
    right: fromObj(params.rightSide, 'm₂'),
  };
}

// ── inclined_plane ────────────────────────────────────────────────────────
export interface InclinedPlaneFigure {
  angle: number; // degrees
  mass?: number;
  showForces: boolean;
  showFriction: boolean;
  title?: string;
}
export function solveInclinedPlane(params: Record<string, unknown>): InclinedPlaneFigure {
  const angle = num(params.angle ?? 30, 'inclined_plane.angle');
  if (angle <= 0 || angle >= 90) throw new Error('inclined_plane: angle must be in (0, 90)');
  return {
    angle,
    mass: typeof params.mass === 'number' && Number.isFinite(params.mass) ? params.mass : undefined,
    showForces: params.showForces !== false,
    showFriction: params.showFriction === true,
    title: typeof params.title === 'string' ? params.title : undefined,
  };
}

// ── spring_mass ───────────────────────────────────────────────────────────
export interface SpringMassFigure {
  k?: number;
  mass?: number;
  displacement: number; // px below equilibrium (negative = above)
  showEquilibrium: boolean;
  orientation: 'vertical' | 'horizontal';
  title?: string;
}
export function solveSpringMass(params: Record<string, unknown>): SpringMassFigure {
  const displacement = typeof params.displacement === 'number' && Number.isFinite(params.displacement) ? params.displacement : 0;
  const orientation = params.orientation === 'horizontal' ? 'horizontal' : 'vertical';
  return {
    k: typeof params.k === 'number' ? params.k : undefined,
    mass: typeof params.mass === 'number' ? params.mass : undefined,
    displacement,
    showEquilibrium: params.showEquilibrium !== false,
    orientation,
    title: typeof params.title === 'string' ? params.title : undefined,
  };
}

// ── pendulum ──────────────────────────────────────────────────────────────
export interface PendulumFigure {
  length: number;       // visualization-relative; not physical units
  angleDegrees: number; // angle from vertical
  showVelocity: boolean;
  title?: string;
}
export function solvePendulum(params: Record<string, unknown>): PendulumFigure {
  const length = num(params.length ?? 200, 'pendulum.length');
  const angleDegrees = num(params.angleDegrees ?? 30, 'pendulum.angleDegrees');
  if (Math.abs(angleDegrees) > 90) throw new Error('pendulum: angleDegrees must be in [-90, 90]');
  return {
    length,
    angleDegrees,
    showVelocity: params.showVelocity === true,
    title: typeof params.title === 'string' ? params.title : undefined,
  };
}

// ── simple_circuit ────────────────────────────────────────────────────────
export interface CircuitComponent {
  type: 'battery' | 'resistor' | 'bulb' | 'switch' | 'wire' | 'ammeter' | 'voltmeter';
  label?: string;
  value?: string; // e.g. "9V", "100Ω"
  closed?: boolean; // for switches
}
export interface SimpleCircuitFigure {
  components: CircuitComponent[]; // ordered around a single loop
  title?: string;
}
export function solveSimpleCircuit(params: Record<string, unknown>): SimpleCircuitFigure {
  if (!Array.isArray(params.components) || params.components.length < 2) {
    throw new Error('simple_circuit: components must be an array of at least 2 items');
  }
  const validTypes = new Set(['battery', 'resistor', 'bulb', 'switch', 'wire', 'ammeter', 'voltmeter']);
  const components: CircuitComponent[] = (params.components as Array<Record<string, unknown>>).map((c, i) => {
    if (typeof c.type !== 'string' || !validTypes.has(c.type)) {
      throw new Error(`simple_circuit: components[${i}].type must be one of ${Array.from(validTypes).join('|')}`);
    }
    return {
      type: c.type as CircuitComponent['type'],
      label: typeof c.label === 'string' ? c.label : undefined,
      value: typeof c.value === 'string' ? c.value : undefined,
      closed: c.closed === true,
    };
  });
  if (!components.some((c) => c.type === 'battery')) {
    throw new Error('simple_circuit: a battery is required');
  }
  return {
    components,
    title: typeof params.title === 'string' ? params.title : undefined,
  };
}

// ── wave_diagram ──────────────────────────────────────────────────────────
export interface WaveFigure {
  amplitude: number;
  wavelength: number;  // in same units as the x-axis
  cycles: number;      // number of cycles to draw
  showAmplitude: boolean;
  showWavelength: boolean;
  title?: string;
}
export function solveWaveDiagram(params: Record<string, unknown>): WaveFigure {
  const amplitude = num(params.amplitude ?? 1, 'wave.amplitude');
  const wavelength = num(params.wavelength ?? 1, 'wave.wavelength');
  if (amplitude <= 0 || wavelength <= 0) throw new Error('wave_diagram: amplitude and wavelength must be positive');
  const cycles = num(params.cycles ?? 2, 'wave.cycles');
  if (cycles < 0.5) throw new Error('wave_diagram: cycles must be at least 0.5');
  return {
    amplitude, wavelength, cycles,
    showAmplitude: params.showAmplitude !== false,
    showWavelength: params.showWavelength !== false,
    title: typeof params.title === 'string' ? params.title : undefined,
  };
}

// ── ray_diagram (lens or mirror) ──────────────────────────────────────────
export interface RayDiagramFigure {
  optical: 'convex_lens' | 'concave_lens' | 'concave_mirror' | 'convex_mirror' | 'plane_mirror';
  focalLength: number;     // px on the diagram; sign convention: + for converging
  objectDistance: number;  // px from optical element
  objectHeight: number;    // px
  title?: string;
}
export function solveRayDiagram(params: Record<string, unknown>, isMirror: boolean): RayDiagramFigure {
  const validLens = ['convex_lens', 'concave_lens'];
  const validMirror = ['concave_mirror', 'convex_mirror', 'plane_mirror'];
  const opt = params.optical;
  const valid = isMirror ? validMirror : validLens;
  if (typeof opt !== 'string' || !valid.includes(opt)) {
    throw new Error(`ray_diagram: optical must be one of ${valid.join('|')}`);
  }
  const focalLength = num(params.focalLength ?? 100, 'ray_diagram.focalLength');
  const objectDistance = num(params.objectDistance ?? 200, 'ray_diagram.objectDistance');
  const objectHeight = num(params.objectHeight ?? 60, 'ray_diagram.objectHeight');
  if (objectDistance <= 0) throw new Error('ray_diagram: objectDistance must be positive');
  if (objectHeight <= 0) throw new Error('ray_diagram: objectHeight must be positive');
  return {
    optical: opt as RayDiagramFigure['optical'],
    focalLength, objectDistance, objectHeight,
    title: typeof params.title === 'string' ? params.title : undefined,
  };
}

// ── vector_addition ───────────────────────────────────────────────────────
export interface VectorVec { x: number; y: number; label?: string; color?: string }
export interface VectorAdditionFigure {
  vectors: VectorVec[];
  resultant: VectorVec;
  method: 'tip_to_tail' | 'parallelogram';
  title?: string;
}
export function solveVectorAddition(params: Record<string, unknown>): VectorAdditionFigure {
  if (!Array.isArray(params.vectors) || params.vectors.length < 2) {
    throw new Error('vector_addition: vectors must be an array of at least 2');
  }
  const vectors: VectorVec[] = (params.vectors as Array<Record<string, unknown>>).map((v, i) => {
    const x = num(v.x, `vector_addition.vectors[${i}].x`);
    const y = num(v.y, `vector_addition.vectors[${i}].y`);
    return {
      x, y,
      label: typeof v.label === 'string' ? v.label : undefined,
      color: typeof v.color === 'string' ? v.color : undefined,
    };
  });
  const rx = vectors.reduce((s, v) => s + v.x, 0);
  const ry = vectors.reduce((s, v) => s + v.y, 0);
  const resultant: VectorVec = { x: rx, y: ry, label: 'R', color: '#dc2626' };
  const method = params.method === 'parallelogram' ? 'parallelogram' : 'tip_to_tail';
  return {
    vectors, resultant, method,
    title: typeof params.title === 'string' ? params.title : undefined,
  };
}

// ── helpers ───────────────────────────────────────────────────────────────
function num(v: unknown, name: string): number {
  if (typeof v !== 'number' || !Number.isFinite(v)) {
    throw new Error(`${name} must be a finite number`);
  }
  return v;
}
