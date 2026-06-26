/**
 * field_lines — electric or magnetic field-line patterns: a point charge, a
 * dipole, parallel plates (uniform field), or a bar magnet. The field-line
 * geometry (radial, looping, uniform) carries the physics, and a freehand
 * sketch can't draw it cleanly.
 */

import type { FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';

export const FIELD_CONFIGS = ['point_charge', 'dipole', 'parallel_plates', 'bar_magnet'] as const;
export type FieldConfig = (typeof FIELD_CONFIGS)[number];

const ALIASES: Record<string, FieldConfig> = {
  point_charge: 'point_charge', point: 'point_charge', charge: 'point_charge', monopole: 'point_charge',
  dipole: 'dipole', electric_dipole: 'dipole',
  parallel_plates: 'parallel_plates', capacitor: 'parallel_plates', uniform: 'parallel_plates', parallel_plate: 'parallel_plates',
  bar_magnet: 'bar_magnet', magnet: 'bar_magnet',
};

export interface FieldLinesFigure {
  config: FieldConfig;
  field: 'electric' | 'magnetic';
  /** Sign of a point charge. */
  charge: '+' | '-';
  title?: string;
}

function slug(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z]/g, '_');
}

export function solveFieldLines(params: Record<string, unknown>): FieldLinesFigure {
  const config = ALIASES[slug(String(params.config ?? params.type ?? ''))] ?? 'point_charge';
  const field: FieldLinesFigure['field'] = config === 'bar_magnet' ? 'magnetic'
    : params.field === 'magnetic' ? 'magnetic' : 'electric';
  const charge: '+' | '-' = String(params.charge ?? '+').trim().startsWith('-') ? '-' : '+';
  return { config, field, charge, title: typeof params.title === 'string' ? params.title : undefined };
}

export const fieldLinesFeatureNames = {
  field: 'field',
  source: 'source',
};

export function buildFieldLinesManifest(figure: FieldLinesFigure): FeatureManifestEntry[] {
  const N = fieldLinesFeatureNames;
  const sourceName = figure.config === 'bar_magnet' ? 'the magnet'
    : figure.config === 'parallel_plates' ? 'the plates'
      : figure.config === 'dipole' ? 'the dipole' : 'the charge';
  return [
    {
      name: N.field,
      kind: 'region',
      description: `${figure.field} field lines`,
      labels: ['the field', 'field lines', 'the field lines', `${figure.field} field`, 'the diagram'],
      displayName: figure.title || `${figure.field} field`,
      scribbleable: true,
    },
    {
      name: N.source,
      kind: 'object',
      description: sourceName,
      labels: [sourceName, sourceName.replace('the ', ''), 'the source'],
      displayName: sourceName,
      scribbleable: true,
    },
  ];
}
