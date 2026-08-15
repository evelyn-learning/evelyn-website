/**
 * phase_diagram — a pressure–temperature phase diagram: solid / liquid / gas
 * regions, the three phase-boundary curves (sublimation, fusion, vaporization),
 * the triple point and critical point. Water's negative-slope fusion line is
 * supported. Positions are normalized (0..1) so the SHAPE (the teaching point)
 * is always clean; the substance preset sets the fusion slope + labels.
 */

import type { FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';

export interface PhaseDiagramFigure {
  triple: { t: number; p: number; label?: string };
  critical: { t: number; p: number; label?: string };
  fusionSlope: 'positive' | 'negative';
  marker?: { t: number; p: number; label?: string };
  tLabel: string;
  pLabel: string;
  title?: string;
}

function clamp01(n: number, d: number): number {
  return Number.isFinite(n) ? Math.max(0.04, Math.min(0.96, n)) : d;
}
function pt(v: unknown, dt: number, dp: number): { t: number; p: number; label?: string } {
  const o = (v && typeof v === 'object' ? v : {}) as Record<string, unknown>;
  return {
    t: clamp01(Number(o.t), dt),
    p: clamp01(Number(o.p), dp),
    label: typeof o.label === 'string' ? o.label : undefined,
  };
}

export function solvePhaseDiagram(params: Record<string, unknown>): PhaseDiagramFigure {
  const substance = typeof params.substance === 'string' ? params.substance.toLowerCase() : '';
  const isWater = substance.includes('water') || substance === 'h2o';
  const fusionSlope: 'positive' | 'negative' =
    params.fusionSlope === 'negative' || params.fusionSlope === 'positive'
      ? params.fusionSlope
      : isWater ? 'negative' : 'positive';
  const triple = pt(params.triplePoint ?? params.triple, 0.3, 0.26);
  const critical = pt(params.criticalPoint ?? params.critical, 0.74, 0.82);
  const marker = params.marker || params.statePoint ? pt(params.marker ?? params.statePoint, 0.5, 0.5) : undefined;
  return {
    triple,
    critical,
    fusionSlope,
    marker,
    tLabel: typeof params.tLabel === 'string' ? params.tLabel : 'Temperature',
    pLabel: typeof params.pLabel === 'string' ? params.pLabel : 'Pressure',
    title: typeof params.title === 'string' ? params.title
      : isWater ? 'Phase Diagram of Water'
        : substance.includes('co2') || substance.includes('carbon') ? 'Phase Diagram of CO₂' : undefined,
  };
}

export const phaseDiagramFeatureNames = {
  diagram: 'phase-diagram',
  solid: 'solid-region',
  liquid: 'liquid-region',
  gas: 'gas-region',
  triple: 'triple-point',
  critical: 'critical-point',
};

export function buildPhaseDiagramManifest(figure: PhaseDiagramFigure): FeatureManifestEntry[] {
  const N = phaseDiagramFeatureNames;
  const feat = (name: string, desc: string, labels: string[]): FeatureManifestEntry =>
    ({ name, kind: 'area', description: desc, labels, displayName: desc, scribbleable: true });
  return [
    { name: N.diagram, kind: 'region', description: figure.title || 'phase diagram', labels: ['the phase diagram', 'the diagram'], displayName: figure.title || 'phase diagram', scribbleable: true },
    feat(N.solid, 'solid region', ['the solid', 'solid region', 'the solid phase']),
    feat(N.liquid, 'liquid region', ['the liquid', 'liquid region', 'the liquid phase']),
    feat(N.gas, 'gas region', ['the gas', 'gas region', 'the gas phase', 'the vapor']),
    { name: N.triple, kind: 'point', description: 'triple point', labels: ['triple point', 'the triple point', figure.triple.label ?? ''].filter(Boolean), displayName: 'triple point', scribbleable: true },
    { name: N.critical, kind: 'point', description: 'critical point', labels: ['critical point', 'the critical point', figure.critical.label ?? ''].filter(Boolean), displayName: 'critical point', scribbleable: true },
  ];
}
