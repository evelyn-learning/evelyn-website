/** Phase 4 — earth & space solvers. */

// ── phases_of_moon ────────────────────────────────────────────────────────
const PHASES = ['new', 'waxing_crescent', 'first_quarter', 'waxing_gibbous', 'full', 'waning_gibbous', 'last_quarter', 'waning_crescent'] as const;
export interface PhasesOfMoonFigure {
  phase: typeof PHASES[number];
  illuminationFraction: number;
  /** -1 (left side lit) ... 1 (right side lit). */
  lightFromRight: number;
  title?: string;
}
export function solvePhasesOfMoon(params: Record<string, unknown>): PhasesOfMoonFigure {
  const phase = params.phase;
  if (typeof phase !== 'string' || !PHASES.includes(phase as typeof PHASES[number])) {
    throw new Error(`phases_of_moon: phase must be one of ${PHASES.join('|')}`);
  }
  const lookup: Record<typeof PHASES[number], { f: number; r: number }> = {
    new: { f: 0, r: 0 },
    waxing_crescent: { f: 0.25, r: 1 },
    first_quarter: { f: 0.5, r: 1 },
    waxing_gibbous: { f: 0.75, r: 1 },
    full: { f: 1, r: 0 },
    waning_gibbous: { f: 0.75, r: -1 },
    last_quarter: { f: 0.5, r: -1 },
    waning_crescent: { f: 0.25, r: -1 },
  };
  const { f, r } = lookup[phase as typeof PHASES[number]];
  return {
    phase: phase as typeof PHASES[number],
    illuminationFraction: f,
    lightFromRight: r,
    title: typeof params.title === 'string' ? params.title : undefined,
  };
}

// ── solar_system ──────────────────────────────────────────────────────────
const PLANETS = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];
export interface SolarSystemFigure {
  highlight: string[];
  title?: string;
}
export function solveSolarSystem(params: Record<string, unknown>): SolarSystemFigure {
  let highlight: string[] = [];
  if (Array.isArray(params.highlight)) {
    highlight = (params.highlight as unknown[]).filter((p): p is string => typeof p === 'string' && PLANETS.includes(p));
  }
  return { highlight, title: typeof params.title === 'string' ? params.title : undefined };
}

// ── earth_layers ──────────────────────────────────────────────────────────
export interface EarthLayersFigure {
  layers: Array<{ name: string; description?: string; color?: string }>;
  title?: string;
}
export function solveEarthLayers(params: Record<string, unknown>): EarthLayersFigure {
  // Default to 4-layer model if none provided.
  const defaults = [
    { name: 'Crust', color: '#a16207' },
    { name: 'Mantle', color: '#dc2626' },
    { name: 'Outer Core', color: '#f59e0b' },
    { name: 'Inner Core', color: '#fbbf24' },
  ];
  let layers: EarthLayersFigure['layers'];
  if (Array.isArray(params.layers) && params.layers.length > 0) {
    layers = (params.layers as Array<Record<string, unknown>>).map((l, i) => {
      if (typeof l.name !== 'string') throw new Error(`earth_layers: layers[${i}].name required`);
      return {
        name: l.name,
        description: typeof l.description === 'string' ? l.description : undefined,
        color: typeof l.color === 'string' ? l.color : undefined,
      };
    });
  } else {
    layers = defaults;
  }
  return { layers, title: typeof params.title === 'string' ? params.title : undefined };
}

// ── eclipse_diagram ───────────────────────────────────────────────────────
export interface EclipseDiagramFigure {
  type: 'solar' | 'lunar';
  title?: string;
}
export function solveEclipseDiagram(params: Record<string, unknown>): EclipseDiagramFigure {
  const type = params.type;
  if (type !== 'solar' && type !== 'lunar') {
    throw new Error('eclipse_diagram: type must be "solar" or "lunar"');
  }
  return { type, title: typeof params.title === 'string' ? params.title : undefined };
}

// ── seasons_diagram ───────────────────────────────────────────────────────
export interface SeasonsDiagramFigure {
  hemisphere: 'northern' | 'southern';
  title?: string;
}
export function solveSeasonsDiagram(params: Record<string, unknown>): SeasonsDiagramFigure {
  const hemisphere = params.hemisphere === 'southern' ? 'southern' : 'northern';
  return { hemisphere, title: typeof params.title === 'string' ? params.title : undefined };
}

// ── plate_tectonics ───────────────────────────────────────────────────────
export interface PlateTectonicsFigure {
  boundary: 'divergent' | 'convergent' | 'transform';
  labels?: { left?: string; right?: string };
  title?: string;
}
export function solvePlateTectonics(params: Record<string, unknown>): PlateTectonicsFigure {
  const boundary = params.boundary;
  if (boundary !== 'divergent' && boundary !== 'convergent' && boundary !== 'transform') {
    throw new Error('plate_tectonics: boundary must be divergent|convergent|transform');
  }
  const labels = params.labels && typeof params.labels === 'object'
    ? {
        left: typeof (params.labels as Record<string, unknown>).left === 'string' ? (params.labels as Record<string, string>).left : undefined,
        right: typeof (params.labels as Record<string, unknown>).right === 'string' ? (params.labels as Record<string, string>).right : undefined,
      }
    : undefined;
  return { boundary, labels, title: typeof params.title === 'string' ? params.title : undefined };
}
