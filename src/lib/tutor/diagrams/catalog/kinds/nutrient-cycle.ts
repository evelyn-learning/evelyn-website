/**
 * nutrient_cycle — a biogeochemical cycle as reservoirs (pools) connected by
 * directed flux arrows (processes). Generalizes the carbon, nitrogen,
 * phosphorus, and hydrologic cycles, which the brain otherwise approximated
 * with a freehand sketch or a generic concept_map. Reservoirs are laid out on
 * a ring; fluxes can connect ANY two reservoirs (not just adjacent ones), so it
 * handles cross-cycle exchanges (e.g. atmosphere ⇄ ocean).
 */

import type { FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';

export interface NutrientCycleFigure {
  reservoirs: Array<{ id: string; label: string; description?: string; color?: string }>;
  fluxes: Array<{ from: string; to: string; label?: string }>;
  title?: string;
}

function slug(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function solveNutrientCycle(params: Record<string, unknown>): NutrientCycleFigure {
  if (!Array.isArray(params.reservoirs) || params.reservoirs.length < 2) {
    throw new Error('nutrient_cycle: reservoirs must be an array of at least 2');
  }
  const reservoirs = (params.reservoirs as Array<Record<string, unknown>>).map((r, i) => {
    if (typeof r.label !== 'string' || !r.label.trim()) {
      throw new Error(`nutrient_cycle: reservoirs[${i}].label required`);
    }
    const id = typeof r.id === 'string' && r.id.trim() ? slug(r.id) : slug(r.label);
    return {
      id,
      label: r.label,
      description: typeof r.description === 'string' ? r.description : undefined,
      color: typeof r.color === 'string' ? r.color : undefined,
    };
  });
  // Tolerant flux refs: accept a reservoir id, its slug, or its label.
  const ids = new Set(reservoirs.map((r) => r.id));
  const byLabel = new Map(reservoirs.map((r) => [r.label.toLowerCase(), r.id]));
  const resolve = (ref: unknown): string | undefined => {
    if (typeof ref !== 'string') return undefined;
    if (ids.has(ref)) return ref;
    const s = slug(ref);
    if (ids.has(s)) return s;
    return byLabel.get(ref.toLowerCase());
  };
  // Drop (rather than throw on) fluxes that reference an unknown reservoir —
  // the cycle still renders with the valid fluxes instead of failing whole.
  const fluxes = Array.isArray(params.fluxes)
    ? (params.fluxes as Array<Record<string, unknown>>).flatMap((f) => {
        const from = resolve(f.from);
        const to = resolve(f.to);
        if (!from || !to) return [];
        return [{ from, to, label: typeof f.label === 'string' ? f.label : undefined }];
      })
    : [];
  return { reservoirs, fluxes, title: typeof params.title === 'string' ? params.title : undefined };
}

export const nutrientCycleFeatureNames = {
  cycle: 'cycle',
  reservoir: (id: string): string => `reservoir-${id}`,
  flux: (from: string, to: string): string => `flux-${from}-${to}`,
};

export function buildNutrientCycleManifest(figure: NutrientCycleFigure): FeatureManifestEntry[] {
  const N = nutrientCycleFeatureNames;
  const features: FeatureManifestEntry[] = [
    {
      name: N.cycle,
      kind: 'region',
      description: figure.title ? `cycle: ${figure.title}` : 'nutrient cycle',
      labels: ['cycle', 'the cycle', 'the diagram'],
      displayName: figure.title || 'cycle',
      scribbleable: true,
    },
  ];
  figure.reservoirs.forEach((r) => {
    features.push({
      name: N.reservoir(r.id),
      kind: 'area',
      description: `reservoir: "${r.label}"`,
      labels: [
        r.label, `the ${r.label}`, `"${r.label}"`,
        `${r.label} reservoir`, `the ${r.label} reservoir`,
        `${r.label} pool`, `the ${r.label} pool`, r.id,
      ],
      displayName: r.label,
      scribbleable: true,
    });
  });
  figure.fluxes.forEach((f) => {
    if (!f.label) return;
    features.push({
      name: N.flux(f.from, f.to),
      kind: 'edge',
      description: `flux: ${f.label}`,
      labels: [f.label, `the ${f.label}`, `"${f.label}"`, `${f.label} flux`],
      displayName: f.label,
      scribbleable: true,
    });
  });
  return features;
}
