/** Phase 4 — earth & space solvers + manifests. */

import type { FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';

/** Slugify "Outer Core" → "outer-core" etc. */
function slug(label: string): string {
  return label.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

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
  // Brain frequently confuses the OUTER show_diagram `type` (catalog
  // kind: "eclipse_diagram") with the INNER `params.type` (sub-kind:
  // "solar"|"lunar") and forgets to pass the inner one. Default to
  // "solar" so the first emission renders cleanly instead of being
  // rejected → audio-gibberish retry.
  const type: 'solar' | 'lunar' = params.type === 'lunar' ? 'lunar' : 'solar';
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
  // Default to "convergent" if missing — same brain-misuse pattern as
  // eclipse_diagram. Most-common boundary type; prevents the audio-
  // gibberish retry loop when the brain forgets to specify.
  const boundary: 'divergent' | 'convergent' | 'transform' =
    params.boundary === 'divergent' ? 'divergent'
    : params.boundary === 'transform' ? 'transform'
    : 'convergent';
  const labels = params.labels && typeof params.labels === 'object'
    ? {
        left: typeof (params.labels as Record<string, unknown>).left === 'string' ? (params.labels as Record<string, string>).left : undefined,
        right: typeof (params.labels as Record<string, unknown>).right === 'string' ? (params.labels as Record<string, string>).right : undefined,
      }
    : undefined;
  return { boundary, labels, title: typeof params.title === 'string' ? params.title : undefined };
}

// ── geologic_cross_section ────────────────────────────────────────────────
export interface GeologicCrossSectionFigure {
  showFault: boolean;
  faultType: 'normal' | 'reverse';
  showUnconformity: boolean;
  title?: string;
}
export function solveGeologicCrossSection(params: Record<string, unknown>): GeologicCrossSectionFigure {
  return {
    // Both features on by default so a bare call renders the full
    // textbook figure (superposition + fault + intrusion + unconformity).
    showFault: params.showFault !== false,
    faultType: params.faultType === 'reverse' ? 'reverse' : 'normal',
    showUnconformity: params.showUnconformity !== false,
    title: typeof params.title === 'string' ? params.title : undefined,
  };
}

// ── hr_diagram ──────────────────────────────────────────────────────────────
const HR_HIGHLIGHTS = ['main_sequence', 'giants', 'white_dwarfs', 'sun'] as const;
export interface HRDiagramFigure {
  highlight: typeof HR_HIGHLIGHTS[number] | null;
  title?: string;
}
export function solveHRDiagram(params: Record<string, unknown>): HRDiagramFigure {
  const h = params.highlight;
  const highlight = typeof h === 'string' && HR_HIGHLIGHTS.includes(h as typeof HR_HIGHLIGHTS[number])
    ? (h as typeof HR_HIGHLIGHTS[number])
    : null;
  return { highlight, title: typeof params.title === 'string' ? params.title : undefined };
}

// ── volcano_cross_section ─────────────────────────────────────────────────────
export interface VolcanoCrossSectionFigure {
  showSideVent: boolean;
  title?: string;
}
export function solveVolcanoCrossSection(params: Record<string, unknown>): VolcanoCrossSectionFigure {
  return {
    showSideVent: params.showSideVent !== false,
    title: typeof params.title === 'string' ? params.title : undefined,
  };
}

// ── atmosphere_layers ─────────────────────────────────────────────────────────
const ATMOSPHERE_LAYERS = ['troposphere', 'stratosphere', 'mesosphere', 'thermosphere', 'exosphere'] as const;
export interface AtmosphereLayersFigure {
  highlight: typeof ATMOSPHERE_LAYERS[number] | null;
  title?: string;
}
export function solveAtmosphereLayers(params: Record<string, unknown>): AtmosphereLayersFigure {
  const h = params.highlight;
  const highlight = typeof h === 'string' && ATMOSPHERE_LAYERS.includes(h as typeof ATMOSPHERE_LAYERS[number])
    ? (h as typeof ATMOSPHERE_LAYERS[number])
    : null;
  return { highlight, title: typeof params.title === 'string' ? params.title : undefined };
}

// ═══════════════════════════════════════════════════════════════════
// Phase 4 manifests (whiteboard markup initiative). Each builder is
// colocated with its solver. SVG renderers use the SVG-mode resolver:
// `data-feature` + `data-feature-cx/cy/w/h` as fractions of viewBox.
// ═══════════════════════════════════════════════════════════════════

// ── phases_of_moon ────────────────────────────────────────────────
export const phasesOfMoonFeatureNames = {
  moon: 'moon',
  litSide: 'lit-side',
  darkSide: 'dark-side',
  phaseLabel: 'phase-label',
};

export function buildPhasesOfMoonManifest(figure: PhasesOfMoonFigure): FeatureManifestEntry[] {
  const N = phasesOfMoonFeatureNames;
  const phaseHuman = figure.phase.replace(/_/g, ' ');
  return [
    {
      name: N.moon,
      kind: 'region',
      description: `moon at "${phaseHuman}" phase (${Math.round(figure.illuminationFraction * 100)}% illuminated)`,
      labels: ['moon', 'the moon', 'the diagram', `${phaseHuman} moon`],
      displayName: figure.title || `${phaseHuman} moon`,
      scribbleable: true,
    },
    {
      name: N.litSide,
      kind: 'label',
      description: `illuminated portion (${Math.round(figure.illuminationFraction * 100)}%)`,
      labels: ['lit side', 'the lit side', 'illuminated side', 'the illuminated side', 'the bright side', 'the light side'],
      displayName: 'lit side',
      scribbleable: true,
    },
    {
      name: N.darkSide,
      kind: 'label',
      description: 'dark / unilluminated portion',
      labels: ['dark side', 'the dark side', 'shadow', 'the shadow', 'unlit side', 'the unlit side'],
      displayName: 'dark side',
      scribbleable: true,
    },
    {
      name: N.phaseLabel,
      kind: 'label',
      description: `phase name: "${phaseHuman}"`,
      labels: ['phase', 'the phase', 'phase name', 'the label', phaseHuman, `"${phaseHuman}"`],
      displayName: phaseHuman,
      scribbleable: true,
    },
  ];
}

// ── solar_system ──────────────────────────────────────────────────
export const solarSystemFeatureNames = {
  system: 'solar-system',
  sun: 'sun',
  planet: (name: string): string => `planet-${name}`,
};

export function buildSolarSystemManifest(figure: SolarSystemFigure): FeatureManifestEntry[] {
  const N = solarSystemFeatureNames;
  const features: FeatureManifestEntry[] = [
    {
      name: N.system,
      kind: 'region',
      description: 'solar system diagram',
      labels: ['solar system', 'the solar system', 'the diagram'],
      displayName: figure.title || 'solar system',
      scribbleable: true,
    },
    {
      name: N.sun,
      kind: 'label',
      description: 'the Sun',
      labels: ['Sun', 'the Sun', 'sun', 'the sun'],
      displayName: 'Sun',
      scribbleable: true,
    },
  ];
  for (const planet of PLANETS) {
    const isHighlighted = figure.highlight.includes(planet);
    features.push({
      name: N.planet(planet),
      kind: 'label',
      description: isHighlighted ? `${planet} (highlighted)` : planet,
      labels: [planet, `the ${planet}`, `planet ${planet}`, `${planet} planet`, `"${planet}"`],
      displayName: planet,
      scribbleable: true,
    });
  }
  return features;
}

// ── earth_layers ──────────────────────────────────────────────────
export const earthLayersFeatureNames = {
  earth: 'earth',
  layer: (label: string): string => `layer-${slug(label)}`,
};

export function buildEarthLayersManifest(figure: EarthLayersFigure): FeatureManifestEntry[] {
  const N = earthLayersFeatureNames;
  const features: FeatureManifestEntry[] = [
    {
      name: N.earth,
      kind: 'region',
      description: 'Earth layers cross-section',
      labels: ['earth', 'the earth', 'the diagram', "Earth's layers", "earth's interior"],
      displayName: figure.title || "Earth's layers",
      scribbleable: true,
    },
  ];
  figure.layers.forEach((l, i) => {
    const name = String(l.name ?? '').trim();
    features.push({
      name: N.layer(name),
      kind: 'area',
      description: l.description ? `${name}: ${l.description}` : name,
      labels: [
        name, `the ${name}`, `"${name}"`,
        `${name} layer`, `the ${name} layer`,
        `layer ${i + 1}`,
      ],
      displayName: name,
      scribbleable: true,
    });
  });
  return features;
}

// ── eclipse_diagram ───────────────────────────────────────────────
export const eclipseDiagramFeatureNames = {
  eclipse: 'eclipse',
  sun: 'sun',
  moon: 'moon',
  earth: 'earth',
  alignmentLine: 'alignment-line',
};

export function buildEclipseDiagramManifest(figure: EclipseDiagramFigure): FeatureManifestEntry[] {
  const N = eclipseDiagramFeatureNames;
  const middle = figure.type === 'solar' ? 'Moon' : 'Earth';
  return [
    {
      name: N.eclipse,
      kind: 'region',
      description: `${figure.type} eclipse alignment (Sun – ${middle} – ${figure.type === 'solar' ? 'Earth' : 'Moon'})`,
      labels: ['eclipse', 'the eclipse', 'the diagram', `${figure.type} eclipse`, `the ${figure.type} eclipse`],
      displayName: figure.title || `${figure.type} eclipse`,
      scribbleable: true,
    },
    {
      name: N.sun,
      kind: 'label',
      description: 'the Sun',
      labels: ['Sun', 'the Sun', 'sun', 'the sun'],
      displayName: 'Sun',
      scribbleable: true,
    },
    {
      name: N.moon,
      kind: 'label',
      description: 'the Moon',
      labels: ['Moon', 'the Moon', 'moon', 'the moon'],
      displayName: 'Moon',
      scribbleable: true,
    },
    {
      name: N.earth,
      kind: 'label',
      description: 'the Earth',
      labels: ['Earth', 'the Earth', 'earth', 'the earth'],
      displayName: 'Earth',
      scribbleable: true,
    },
    {
      name: N.alignmentLine,
      kind: 'label',
      description: 'alignment / shadow line connecting the three bodies',
      labels: ['line', 'the line', 'alignment', 'the alignment', 'alignment line', 'the alignment line', 'shadow line'],
      displayName: 'alignment line',
      scribbleable: true,
    },
  ];
}

// ── seasons_diagram ───────────────────────────────────────────────
const SEASONS = ['Summer', 'Autumn', 'Winter', 'Spring'];

export const seasonsDiagramFeatureNames = {
  orbit: 'orbit',
  sun: 'sun',
  season: (name: string): string => `season-${slug(name)}`,
};

export function buildSeasonsDiagramManifest(figure: SeasonsDiagramFigure): FeatureManifestEntry[] {
  const N = seasonsDiagramFeatureNames;
  const features: FeatureManifestEntry[] = [
    {
      name: N.orbit,
      kind: 'region',
      description: `seasons diagram (${figure.hemisphere} hemisphere)`,
      labels: ['orbit', 'the orbit', 'the diagram', 'seasons', 'the seasons'],
      displayName: figure.title || 'seasons diagram',
      scribbleable: true,
    },
    {
      name: N.sun,
      kind: 'label',
      description: 'the Sun at the center',
      labels: ['Sun', 'the Sun', 'sun', 'the sun', 'the center'],
      displayName: 'Sun',
      scribbleable: true,
    },
  ];
  for (const season of SEASONS) {
    features.push({
      name: N.season(season),
      kind: 'label',
      description: `Earth at ${season.toLowerCase()} position`,
      labels: [
        season, `the ${season}`, `${season.toLowerCase()}`, `the ${season.toLowerCase()}`,
        `${season} position`, `the ${season} position`,
        `Earth at ${season}`, `Earth in ${season}`,
      ],
      displayName: season,
      scribbleable: true,
    });
  }
  return features;
}

// ── plate_tectonics ───────────────────────────────────────────────
export const plateTectonicsFeatureNames = {
  boundary: 'plate-boundary',
  plateA: 'plate-a',
  plateB: 'plate-b',
  boundaryLabel: 'boundary-label',
};

export function buildPlateTectonicsManifest(figure: PlateTectonicsFigure): FeatureManifestEntry[] {
  const N = plateTectonicsFeatureNames;
  const leftLabel = figure.labels?.left || 'Plate A';
  const rightLabel = figure.labels?.right || 'Plate B';
  return [
    {
      name: N.boundary,
      kind: 'region',
      description: `${figure.boundary} plate boundary`,
      labels: ['boundary', 'the boundary', 'the diagram', `${figure.boundary} boundary`, `the ${figure.boundary} boundary`, 'plates', 'the plates'],
      displayName: figure.title || `${figure.boundary} boundary`,
      scribbleable: true,
    },
    {
      name: N.plateA,
      kind: 'area',
      description: `left plate ("${leftLabel}")`,
      labels: [
        'left plate', 'the left plate', 'plate A', 'plate a', 'plate-a',
        leftLabel, `the ${leftLabel}`, `"${leftLabel}"`,
      ],
      displayName: leftLabel,
      scribbleable: true,
    },
    {
      name: N.plateB,
      kind: 'area',
      description: `right plate ("${rightLabel}")`,
      labels: [
        'right plate', 'the right plate', 'plate B', 'plate b', 'plate-b',
        rightLabel, `the ${rightLabel}`, `"${rightLabel}"`,
      ],
      displayName: rightLabel,
      scribbleable: true,
    },
    {
      name: N.boundaryLabel,
      kind: 'label',
      description: `boundary type label: "${figure.boundary}"`,
      labels: ['boundary label', 'the boundary label', 'boundary type', 'the boundary type', figure.boundary, `the ${figure.boundary} label`],
      displayName: `${figure.boundary} boundary`,
      scribbleable: true,
    },
  ];
}

// ── geologic_cross_section ─────────────────────────────────────────
export const geologicCrossSectionFeatureNames = {
  section: 'geologic-section',
  strata: 'strata',
  fault: 'fault',
  intrusion: 'intrusion',
  unconformity: 'unconformity',
};

export function buildGeologicCrossSectionManifest(figure: GeologicCrossSectionFigure): FeatureManifestEntry[] {
  const N = geologicCrossSectionFeatureNames;
  const features: FeatureManifestEntry[] = [
    {
      name: N.section,
      kind: 'region',
      description: 'geologic cross-section (sedimentary strata, oldest at bottom — law of superposition)',
      labels: ['cross section', 'the cross section', 'the diagram', 'the rock layers', 'the strata', 'geologic cross section'],
      displayName: figure.title || 'geologic cross-section',
      scribbleable: true,
    },
    {
      name: N.strata,
      kind: 'area',
      description: 'sedimentary rock layers (strata) — oldest at the bottom',
      labels: ['strata', 'the strata', 'rock layers', 'the rock layers', 'sedimentary layers', 'the layers', 'superposition'],
      displayName: 'strata',
      scribbleable: true,
    },
    {
      name: N.intrusion,
      kind: 'area',
      description: 'igneous intrusion (dike) cutting across the strata — younger than the layers it cuts',
      labels: ['intrusion', 'the intrusion', 'igneous intrusion', 'the dike', 'dike', 'the dyke'],
      displayName: 'igneous intrusion',
      scribbleable: true,
    },
  ];
  if (figure.showFault) {
    features.push({
      name: N.fault,
      kind: 'label',
      description: `${figure.faultType} fault displacing the strata`,
      labels: ['fault', 'the fault', `${figure.faultType} fault`, `the ${figure.faultType} fault`, 'fault line', 'the fault line'],
      displayName: `${figure.faultType} fault`,
      scribbleable: true,
    });
  }
  if (figure.showUnconformity) {
    features.push({
      name: N.unconformity,
      kind: 'label',
      description: 'unconformity — an erosional surface marking a gap in the rock record',
      labels: ['unconformity', 'the unconformity', 'erosion surface', 'the erosion surface', 'the gap'],
      displayName: 'unconformity',
      scribbleable: true,
    });
  }
  return features;
}

// ── hr_diagram ─────────────────────────────────────────────────────
export const hrDiagramFeatureNames = {
  diagram: 'hr-diagram',
  mainSequence: 'main-sequence',
  giants: 'giants',
  whiteDwarfs: 'white-dwarfs',
  sun: 'sun',
};

export function buildHRDiagramManifest(figure: HRDiagramFigure): FeatureManifestEntry[] {
  const N = hrDiagramFeatureNames;
  return [
    {
      name: N.diagram,
      kind: 'region',
      description: 'Hertzsprung–Russell diagram (luminosity vs. temperature, temperature reversed)',
      labels: ['HR diagram', 'the HR diagram', 'Hertzsprung-Russell diagram', 'the diagram', 'H-R diagram'],
      displayName: figure.title || 'H–R diagram',
      scribbleable: true,
    },
    {
      name: N.mainSequence,
      kind: 'area',
      description: 'the main sequence — the diagonal band from hot/bright to cool/faint stars',
      labels: ['main sequence', 'the main sequence', 'the diagonal', 'the main-sequence band'],
      displayName: 'main sequence',
      scribbleable: true,
    },
    {
      name: N.giants,
      kind: 'area',
      description: 'giants and supergiants (upper right — cool but very luminous)',
      labels: ['giants', 'the giants', 'red giants', 'the red giants', 'supergiants', 'the giant branch'],
      displayName: 'giants',
      scribbleable: true,
    },
    {
      name: N.whiteDwarfs,
      kind: 'area',
      description: 'white dwarfs (lower left — hot but very faint)',
      labels: ['white dwarfs', 'the white dwarfs', 'white dwarf region', 'the white-dwarf region'],
      displayName: 'white dwarfs',
      scribbleable: true,
    },
    {
      name: N.sun,
      kind: 'label',
      description: 'the Sun (a G-type main-sequence star, L = 1, T ≈ 5800 K)',
      labels: ['Sun', 'the Sun', 'sun', 'the sun', 'our Sun', 'our star'],
      displayName: 'Sun',
      scribbleable: true,
    },
  ];
}

// ── volcano_cross_section ──────────────────────────────────────────
export const volcanoCrossSectionFeatureNames = {
  volcano: 'volcano',
  crater: 'crater',
  vent: 'vent',
  magmaChamber: 'magma-chamber',
  layers: 'lava-ash-layers',
  sideVent: 'side-vent',
};

export function buildVolcanoCrossSectionManifest(figure: VolcanoCrossSectionFigure): FeatureManifestEntry[] {
  const N = volcanoCrossSectionFeatureNames;
  const features: FeatureManifestEntry[] = [
    {
      name: N.volcano,
      kind: 'region',
      description: 'stratovolcano cross-section',
      labels: ['volcano', 'the volcano', 'the diagram', 'stratovolcano', 'the stratovolcano', 'the cross section'],
      displayName: figure.title || 'stratovolcano',
      scribbleable: true,
    },
    {
      name: N.crater,
      kind: 'label',
      description: 'the crater at the summit',
      labels: ['crater', 'the crater', 'the summit', 'the summit crater'],
      displayName: 'crater',
      scribbleable: true,
    },
    {
      name: N.vent,
      kind: 'area',
      description: 'the central conduit / vent carrying magma to the surface',
      labels: ['vent', 'the vent', 'conduit', 'the conduit', 'the central vent', 'the pipe', 'the main vent'],
      displayName: 'conduit / vent',
      scribbleable: true,
    },
    {
      name: N.magmaChamber,
      kind: 'area',
      description: 'the magma chamber beneath the volcano',
      labels: ['magma chamber', 'the magma chamber', 'magma', 'the magma', 'the chamber'],
      displayName: 'magma chamber',
      scribbleable: true,
    },
    {
      name: N.layers,
      kind: 'area',
      description: 'alternating layers of hardened lava and ash (the strato- in stratovolcano)',
      labels: ['layers', 'the layers', 'lava and ash layers', 'the lava layers', 'the ash layers', 'the rock layers'],
      displayName: 'lava & ash layers',
      scribbleable: true,
    },
  ];
  if (figure.showSideVent) {
    features.push({
      name: N.sideVent,
      kind: 'label',
      description: 'a side (parasitic) vent branching off the main conduit',
      labels: ['side vent', 'the side vent', 'parasitic vent', 'the parasitic vent', 'flank vent', 'the flank vent', 'secondary vent'],
      displayName: 'side vent',
      scribbleable: true,
    });
  }
  return features;
}

// ── atmosphere_layers ──────────────────────────────────────────────
export const atmosphereLayerMeta: Array<{ id: string; name: string }> = [
  { id: 'troposphere', name: 'Troposphere' },
  { id: 'stratosphere', name: 'Stratosphere' },
  { id: 'mesosphere', name: 'Mesosphere' },
  { id: 'thermosphere', name: 'Thermosphere' },
  { id: 'exosphere', name: 'Exosphere' },
];

export const atmosphereLayersFeatureNames = {
  atmosphere: 'atmosphere',
  layer: (id: string): string => `atm-${id}`,
  ozone: 'ozone-layer',
  profile: 'temperature-profile',
};

export function buildAtmosphereLayersManifest(figure: AtmosphereLayersFigure): FeatureManifestEntry[] {
  const N = atmosphereLayersFeatureNames;
  const features: FeatureManifestEntry[] = [
    {
      name: N.atmosphere,
      kind: 'region',
      description: "Earth's atmosphere layers with the temperature-vs-altitude profile",
      labels: ['atmosphere', 'the atmosphere', 'the diagram', "Earth's atmosphere", 'the atmospheric layers'],
      displayName: figure.title || "Earth's atmosphere",
      scribbleable: true,
    },
  ];
  for (const l of atmosphereLayerMeta) {
    features.push({
      name: N.layer(l.id),
      kind: 'area',
      description: `the ${l.name}`,
      labels: [l.name, `the ${l.name}`, l.name.toLowerCase(), `the ${l.name.toLowerCase()}`, `"${l.name}"`],
      displayName: l.name,
      scribbleable: true,
    });
  }
  features.push(
    {
      name: N.ozone,
      kind: 'label',
      description: 'the ozone layer (within the stratosphere)',
      labels: ['ozone', 'the ozone', 'ozone layer', 'the ozone layer'],
      displayName: 'ozone layer',
      scribbleable: true,
    },
    {
      name: N.profile,
      kind: 'label',
      description: 'the temperature-vs-altitude profile curve',
      labels: ['temperature profile', 'the temperature profile', 'the profile', 'the temperature curve', 'the curve'],
      displayName: 'temperature profile',
      scribbleable: true,
    },
  );
  return features;
}
