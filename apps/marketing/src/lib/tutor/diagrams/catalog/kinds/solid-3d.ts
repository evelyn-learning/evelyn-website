/**
 * solid_3d — a labeled 3D solid (prism, cube, cylinder, cone, sphere, pyramid,
 * triangular prism) drawn in oblique projection with dimension labels, plus an
 * optional unfolded NET for surface-area work. A rough sketch can't draw a clean
 * labeled 3D solid; this renders it deterministically from named dimensions.
 */

import type { FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';

export const SOLID_SHAPES = [
  'cube', 'rectangular_prism', 'triangular_prism', 'cylinder', 'cone', 'sphere', 'square_pyramid',
] as const;
export type SolidShape = (typeof SOLID_SHAPES)[number];

const ALIASES: Record<string, SolidShape> = {
  cube: 'cube',
  rectangular_prism: 'rectangular_prism', box: 'rectangular_prism', cuboid: 'rectangular_prism', prism: 'rectangular_prism',
  triangular_prism: 'triangular_prism',
  cylinder: 'cylinder',
  cone: 'cone',
  sphere: 'sphere', ball: 'sphere',
  square_pyramid: 'square_pyramid', pyramid: 'square_pyramid',
};

export interface Solid3DFigure {
  shape: SolidShape;
  dims: Record<string, number>;
  showNet: boolean;
  title?: string;
}

function slug(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z]/g, '_');
}
function numDims(v: unknown): Record<string, number> {
  const out: Record<string, number> = {};
  if (v && typeof v === 'object') {
    for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
      const n = Number(val);
      if (Number.isFinite(n) && n > 0) out[k] = n;
    }
  }
  return out;
}

/** Sensible defaults so a bare call still draws a labeled solid. */
const DEFAULT_DIMS: Record<SolidShape, Record<string, number>> = {
  cube: { side: 4 },
  rectangular_prism: { length: 6, width: 3, height: 4 },
  triangular_prism: { base: 4, triHeight: 3, length: 6 },
  cylinder: { radius: 3, height: 6 },
  cone: { radius: 3, height: 6 },
  sphere: { radius: 4 },
  square_pyramid: { base: 5, height: 6 },
};

export function solveSolid3D(params: Record<string, unknown>): Solid3DFigure {
  const shape = ALIASES[slug(String(params.shape ?? ''))] ?? 'rectangular_prism';
  const given = numDims(params.dims ?? params.dimensions);
  const dims = { ...DEFAULT_DIMS[shape], ...given };
  return {
    shape,
    dims,
    showNet: params.showNet === true || params.net === true,
    title: typeof params.title === 'string' ? params.title : undefined,
  };
}

export const solid3DFeatureNames = {
  solid: 'solid',
  net: 'net',
};

export function buildSolid3DManifest(figure: Solid3DFigure): FeatureManifestEntry[] {
  const N = solid3DFeatureNames;
  const features: FeatureManifestEntry[] = [
    {
      name: N.solid,
      kind: 'region',
      description: figure.title ? `solid: ${figure.title}` : `${figure.shape} (3D solid)`,
      labels: ['the solid', 'the shape', 'the figure', figure.shape.replace(/_/g, ' ')],
      displayName: figure.title || figure.shape.replace(/_/g, ' '),
      scribbleable: true,
    },
  ];
  if (figure.showNet) {
    features.push({
      name: N.net,
      kind: 'area',
      description: 'unfolded net',
      labels: ['the net', 'net', 'the unfolded net', 'the unfolding'],
      displayName: 'net',
      scribbleable: true,
    });
  }
  return features;
}
