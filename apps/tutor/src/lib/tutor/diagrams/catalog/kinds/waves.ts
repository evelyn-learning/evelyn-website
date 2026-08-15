/**
 * Wavefront / 2D wave-pattern catalog kinds — the canonical, must-be-precise
 * physics figures that a freehand sketch cannot draw legibly:
 *
 *   doppler_effect      — concentric wavefronts from a MOVING source (rings
 *                         bunched ahead → higher pitch, spread behind → lower).
 *                         The deterministic sibling of the `concentric` sketch
 *                         primitive, but a precise LABELED figure.
 *   standing_wave       — a string fixed at both ends vibrating in harmonic n,
 *                         with the two-lobe envelope, nodes and antinodes.
 *   interference_pattern— two point sources emitting circular wavefronts, with
 *                         the constructive (antinodal) and destructive (nodal)
 *                         lines drawn as their true hyperbolas.
 *
 * NOTE: these are distinct from the single transverse `wave_diagram` kind
 * (one sine wave with A / λ labels) in physics.ts — do not conflate.
 *
 * Each solver is pure: it validates + fills defaults + derives the physically
 * meaningful parameters, so a bare call still renders a clean textbook figure.
 * The matching renderer (CatalogWavesRenderers.tsx) samples the geometry.
 */

import type { FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';

function numOr(v: unknown, dflt: number): number {
  const n = typeof v === 'number' ? v : typeof v === 'string' ? Number(v) : NaN;
  return Number.isFinite(n) ? n : dflt;
}
function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}
function titleOf(params: Record<string, unknown>): string | undefined {
  return typeof params.title === 'string' && params.title.trim() ? params.title : undefined;
}

// ── doppler_effect ──────────────────────────────────────────────────────────
export interface DopplerFigure {
  /** Source speed as a fraction of the wave speed, v/c ∈ [0.1, 0.85]. */
  beta: number;
  /** Direction of source motion (true = to the right). */
  movingRight: boolean;
  /** Draw the two observers (ahead = higher pitch, behind = lower pitch). */
  showObservers: boolean;
  /** Number of successively-emitted wavefront rings to draw. */
  nRings: number;
  title?: string;
}

export function solveDopplerEffect(params: Record<string, unknown>): DopplerFigure {
  const rawFrac = params.sourceSpeedFrac ?? params.speedFrac ?? params.beta ?? 0.6;
  const beta = clamp(numOr(rawFrac, 0.6), 0.1, 0.85);
  const movingRight = params.movingRight !== false && params.movingLeft !== true;
  const showObservers = params.showObservers !== false;
  const nRings = clamp(Math.round(numOr(params.nRings ?? params.rings, 5)), 3, 6);
  return { beta, movingRight, showObservers, nRings, title: titleOf(params) };
}

export const dopplerFeatureNames = {
  figure: 'doppler',
  ahead: 'doppler-ahead',
  behind: 'doppler-behind',
  source: 'doppler-source',
};

export function buildDopplerManifest(figure: DopplerFigure): FeatureManifestEntry[] {
  const N = dopplerFeatureNames;
  const aheadWord = figure.movingRight ? 'ahead (right)' : 'ahead (left)';
  const behindWord = figure.movingRight ? 'behind (left)' : 'behind (right)';
  return [
    {
      name: N.figure,
      kind: 'region',
      description: figure.title ? `Doppler effect: ${figure.title}` : 'Doppler effect — wavefronts of a moving source',
      labels: ['doppler effect', 'the doppler diagram', 'the wavefronts', 'the diagram', 'the figure'],
      displayName: figure.title || 'Doppler effect',
      scribbleable: true,
    },
    {
      name: N.source,
      kind: 'point',
      description: 'the moving source',
      labels: ['the source', 'source', 'the moving source', 'the emitter'],
      displayName: 'Source',
      scribbleable: true,
    },
    {
      name: N.ahead,
      kind: 'area',
      description: `${aheadWord}: wavefronts compressed → higher frequency / pitch`,
      labels: ['ahead', 'in front', 'the compressed side', 'higher pitch', 'higher frequency', 'blueshift'],
      displayName: 'Ahead (compressed)',
      scribbleable: true,
    },
    {
      name: N.behind,
      kind: 'area',
      description: `${behindWord}: wavefronts spread out → lower frequency / pitch`,
      labels: ['behind', 'the stretched side', 'lower pitch', 'lower frequency', 'redshift'],
      displayName: 'Behind (stretched)',
      scribbleable: true,
    },
  ];
}

// ── standing_wave ─────────────────────────────────────────────────────────────
export interface StandingWaveFigure {
  /** Harmonic number n (n loops between the fixed ends). */
  harmonic: number;
  /** Mark and label the nodes / antinodes. */
  showNodes: boolean;
  title?: string;
}

export function solveStandingWave(params: Record<string, unknown>): StandingWaveFigure {
  const raw = params.harmonic ?? params.n ?? params.mode ?? 2;
  const harmonic = clamp(Math.round(numOr(raw, 2)), 1, 5);
  const showNodes = params.showNodes !== false;
  return { harmonic, showNodes, title: titleOf(params) };
}

export const standingWaveFeatureNames = {
  figure: 'standing-wave',
  nodes: 'standing-wave-nodes',
  antinodes: 'standing-wave-antinodes',
};

export function buildStandingWaveManifest(figure: StandingWaveFigure): FeatureManifestEntry[] {
  const N = standingWaveFeatureNames;
  const ordinal = ['', '1st', '2nd', '3rd', '4th', '5th'][figure.harmonic] || `${figure.harmonic}th`;
  const feats: FeatureManifestEntry[] = [
    {
      name: N.figure,
      kind: 'region',
      description: figure.title
        ? `Standing wave: ${figure.title}`
        : `Standing wave — ${ordinal} harmonic (n = ${figure.harmonic}) on a string fixed at both ends`,
      labels: ['standing wave', 'the standing wave', 'the harmonic', `n = ${figure.harmonic}`, 'the diagram', 'the string'],
      displayName: figure.title || `Standing wave (n = ${figure.harmonic})`,
      scribbleable: true,
    },
  ];
  if (figure.showNodes) {
    feats.push(
      {
        name: N.nodes,
        kind: 'area',
        description: 'nodes — points of zero displacement (the string is still)',
        labels: ['the nodes', 'nodes', 'node', 'a node'],
        displayName: 'Nodes',
        scribbleable: true,
      },
      {
        name: N.antinodes,
        kind: 'area',
        description: 'antinodes — points of maximum displacement',
        labels: ['the antinodes', 'antinodes', 'antinode', 'an antinode'],
        displayName: 'Antinodes',
        scribbleable: true,
      },
    );
  }
  return feats;
}

// ── interference_pattern ──────────────────────────────────────────────────────
export interface InterferenceFigure {
  /** Wavelength in px on the diagram. */
  wavelength: number;
  /** Separation between the two sources in px. */
  sourceSep: number;
  /** Integer orders m of the antinodal (constructive) hyperbolas, incl. 0. */
  antinodalOrders: number[];
  /** Half-integer orders of the nodal (destructive) hyperbolas. */
  nodalOrders: number[];
  title?: string;
}

export function solveInterferencePattern(params: Record<string, unknown>): InterferenceFigure {
  const wavelength = clamp(numOr(params.wavelength ?? params.lambda, 46), 28, 70);
  // Default separation = 3λ so ±2 antinodal orders resolve cleanly.
  const sourceSep = clamp(numOr(params.sourceSep ?? params.separation ?? params.d, 3 * wavelength), 1.2 * wavelength, 4.2 * wavelength);
  const d = sourceSep;
  // |path difference| ≤ d, so |m|·λ < d gives the visible antinodal orders.
  const maxM = Math.max(1, Math.floor((d - 1e-6) / wavelength));
  const cappedM = Math.min(maxM, 3); // keep the figure legible
  const antinodalOrders: number[] = [];
  for (let m = -cappedM; m <= cappedM; m++) antinodalOrders.push(m);
  // Nodal lines sit between: (m + ½)·λ < d.
  const nodalOrders: number[] = [];
  for (let m = -cappedM; m < cappedM; m++) {
    const order = m + 0.5;
    if (Math.abs(order) * wavelength < d) nodalOrders.push(order);
  }
  return { wavelength, sourceSep, antinodalOrders, nodalOrders, title: titleOf(params) };
}

export const interferenceFeatureNames = {
  figure: 'interference',
  constructive: 'interference-constructive',
  destructive: 'interference-destructive',
  sources: 'interference-sources',
};

export function buildInterferenceManifest(figure: InterferenceFigure): FeatureManifestEntry[] {
  const N = interferenceFeatureNames;
  return [
    {
      name: N.figure,
      kind: 'region',
      description: figure.title
        ? `Interference pattern: ${figure.title}`
        : 'Two-source interference — overlapping circular wavefronts',
      labels: ['interference pattern', 'the interference', 'the pattern', 'the diagram', 'the figure', 'the wavefronts'],
      displayName: figure.title || 'Interference pattern',
      scribbleable: true,
    },
    {
      name: N.sources,
      kind: 'area',
      description: 'the two point sources (in phase)',
      labels: ['the sources', 'sources', 'the two sources', 'source 1', 'source 2', 'S1', 'S2'],
      displayName: 'Sources',
      scribbleable: true,
    },
    {
      name: N.constructive,
      kind: 'area',
      description: 'antinodal lines — constructive interference (crest meets crest)',
      labels: ['constructive', 'the constructive lines', 'antinodal', 'the antinodal lines', 'the bright fringes', 'maxima'],
      displayName: 'Constructive (antinodal)',
      scribbleable: true,
    },
    {
      name: N.destructive,
      kind: 'area',
      description: 'nodal lines — destructive interference (crest meets trough)',
      labels: ['destructive', 'the destructive lines', 'nodal', 'the nodal lines', 'the dark fringes', 'minima'],
      displayName: 'Destructive (nodal)',
      scribbleable: true,
    },
  ];
}
