/**
 * conic_sections — the canonical "one (double) cone, four shapes" illustration:
 * a double cone cut by a plane at four characteristic angles, yielding a circle,
 * ellipse, parabola, and hyperbola. This is a 3D figure the rough sketch tool
 * can't draw (it abstains), so it gets a deterministic catalog renderer instead.
 * Shows all four by default, or a subset, with optional highlight.
 */

import type { FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';

export const CONIC_SLICES = ['circle', 'ellipse', 'parabola', 'hyperbola'] as const;
export type ConicSlice = (typeof CONIC_SLICES)[number];

/** How each conic is produced — shown as the cell's caption. */
export const CONIC_CUT: Record<ConicSlice, string> = {
  circle: 'horizontal slice',
  ellipse: 'tilted slice',
  parabola: 'parallel to the side',
  hyperbola: 'through both nappes',
};

export interface ConicSectionsFigure {
  slices: ConicSlice[];
  highlight?: ConicSlice;
  title?: string;
}

function slug(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z]/g, '');
}
const ALIASES: Record<string, ConicSlice> = {
  circle: 'circle', circles: 'circle',
  ellipse: 'ellipse', ellipses: 'ellipse', oval: 'ellipse',
  parabola: 'parabola', parabolas: 'parabola', parabolae: 'parabola',
  hyperbola: 'hyperbola', hyperbolas: 'hyperbola', hyperbolae: 'hyperbola',
};

export function solveConicSections(params: Record<string, unknown>): ConicSectionsFigure {
  const raw = Array.isArray(params.slices) ? params.slices : null;
  let picked = raw
    ? raw.map((s) => ALIASES[slug(String(s))]).filter((s): s is ConicSlice => Boolean(s))
    : [...CONIC_SLICES];
  if (picked.length === 0) picked = [...CONIC_SLICES];
  // Canonical order + dedupe.
  const slices = CONIC_SLICES.filter((s) => picked.includes(s));
  const h = typeof params.highlight === 'string' ? ALIASES[slug(params.highlight)] : undefined;
  const highlight = h && slices.includes(h) ? h : undefined;
  return { slices, highlight, title: typeof params.title === 'string' ? params.title : undefined };
}

export const conicSectionsFeatureNames = {
  figure: 'conics',
  slice: (s: ConicSlice): string => `conic-${s}`,
};

export function buildConicSectionsManifest(figure: ConicSectionsFigure): FeatureManifestEntry[] {
  const N = conicSectionsFeatureNames;
  const features: FeatureManifestEntry[] = [
    {
      name: N.figure,
      kind: 'region',
      description: figure.title ? `conic sections: ${figure.title}` : 'conic sections',
      labels: ['conic sections', 'the conics', 'the diagram', 'the cone'],
      displayName: figure.title || 'conic sections',
      scribbleable: true,
    },
  ];
  for (const s of figure.slices) {
    features.push({
      name: N.slice(s),
      kind: 'area',
      description: `${s} (${CONIC_CUT[s]})`,
      labels: [s, `the ${s}`, `${s} section`, `the ${s} slice`],
      displayName: s.charAt(0).toUpperCase() + s.slice(1),
      scribbleable: true,
    });
  }
  return features;
}
