/**
 * vsepr_geometry — an idealized 3D molecular shape (VSEPR) with wedge/dash bonds,
 * lone pairs, and the bond angle. Distinct from show_molecule (which renders a
 * real 2D structure from SMILES): this is the pedagogical electron-geometry shape
 * a freehand sketch can't draw — tetrahedral, trigonal planar, bent, etc.
 */

import type { FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';

export const VSEPR_GEOMETRIES = [
  'linear', 'trigonal_planar', 'bent', 'tetrahedral',
  'trigonal_pyramidal', 'trigonal_bipyramidal', 'octahedral',
] as const;
export type VseprGeometry = (typeof VSEPR_GEOMETRIES)[number];

const ALIASES: Record<string, VseprGeometry> = {
  linear: 'linear',
  trigonal_planar: 'trigonal_planar', trigonalplanar: 'trigonal_planar',
  bent: 'bent', angular: 'bent', v_shaped: 'bent',
  tetrahedral: 'tetrahedral',
  trigonal_pyramidal: 'trigonal_pyramidal', pyramidal: 'trigonal_pyramidal', trigonalpyramidal: 'trigonal_pyramidal',
  trigonal_bipyramidal: 'trigonal_bipyramidal', bipyramidal: 'trigonal_bipyramidal',
  octahedral: 'octahedral',
};

/** Bonding domains, default lone pairs, and default labeled angle per geometry. */
export const VSEPR_META: Record<VseprGeometry, { bonds: number; lonePairs: number; angle: string }> = {
  linear: { bonds: 2, lonePairs: 0, angle: '180°' },
  trigonal_planar: { bonds: 3, lonePairs: 0, angle: '120°' },
  bent: { bonds: 2, lonePairs: 2, angle: '≈104.5°' },
  tetrahedral: { bonds: 4, lonePairs: 0, angle: '109.5°' },
  trigonal_pyramidal: { bonds: 3, lonePairs: 1, angle: '≈107°' },
  trigonal_bipyramidal: { bonds: 5, lonePairs: 0, angle: '90° / 120°' },
  octahedral: { bonds: 6, lonePairs: 0, angle: '90°' },
};

export interface VseprFigure {
  geometry: VseprGeometry;
  central: string;
  terminals: string[];
  lonePairs: number;
  angle: string;
  title?: string;
}

function slug(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z]/g, '_');
}

export function solveVseprGeometry(params: Record<string, unknown>): VseprFigure {
  const geometry = ALIASES[slug(String(params.geometry ?? ''))] ?? 'tetrahedral';
  const meta = VSEPR_META[geometry];
  const central = typeof params.central === 'string' && params.central.trim() ? params.central.trim() : 'A';
  let terminals: string[];
  if (Array.isArray(params.terminals)) {
    terminals = (params.terminals as unknown[]).map((t) => String(t));
  } else if (typeof params.terminal === 'string') {
    terminals = Array(meta.bonds).fill(params.terminal);
  } else if (typeof params.terminals === 'string') {
    terminals = Array(meta.bonds).fill(params.terminals);
  } else {
    terminals = Array(meta.bonds).fill('X');
  }
  // pad / truncate to the geometry's bond count
  terminals = Array.from({ length: meta.bonds }, (_, i) => terminals[i] ?? terminals[terminals.length - 1] ?? 'X');

  const lonePairs = typeof params.lonePairs === 'number' ? Math.max(0, Math.floor(params.lonePairs)) : meta.lonePairs;
  const angle = typeof params.bondAngle === 'string' ? params.bondAngle
    : typeof params.angle === 'string' ? params.angle : meta.angle;

  return {
    geometry,
    central,
    terminals,
    lonePairs,
    angle,
    title: typeof params.title === 'string' ? params.title : undefined,
  };
}

export const vseprFeatureNames = {
  molecule: 'molecule',
  central: 'central-atom',
  bond: (i: number): string => `bond-${i + 1}`,
  lonePairs: 'lone-pairs',
};

export function buildVseprManifest(figure: VseprFigure): FeatureManifestEntry[] {
  const N = vseprFeatureNames;
  const pretty = figure.geometry.replace(/_/g, ' ');
  const features: FeatureManifestEntry[] = [
    {
      name: N.molecule,
      kind: 'region',
      description: figure.title ? `molecule: ${figure.title}` : `${pretty} molecule`,
      labels: ['the molecule', 'the shape', pretty, `the ${pretty} shape`, 'the diagram'],
      displayName: figure.title || pretty,
      scribbleable: true,
    },
    {
      name: N.central,
      kind: 'object',
      description: `central atom ${figure.central}`,
      labels: ['the central atom', figure.central, `the ${figure.central}`, 'central atom'],
      displayName: figure.central,
      scribbleable: true,
    },
  ];
  if (figure.lonePairs > 0) {
    features.push({
      name: N.lonePairs,
      kind: 'object',
      description: 'lone pairs',
      labels: ['the lone pair', 'the lone pairs', 'lone pair', 'lone pairs'],
      displayName: 'lone pairs',
      scribbleable: true,
    });
  }
  return features;
}
