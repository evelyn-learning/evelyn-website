/**
 * heart_diagram — a labeled schematic of the human heart as a double pump: the
 * four chambers, the great vessels, the valves, and the direction of blood flow
 * (blue = deoxygenated, red = oxygenated). A detailed labeled anatomy figure a
 * freehand sketch can't place correctly (same family as neuron_diagram /
 * brain_regions). Structure is fixed; params only set highlight + title.
 */

import type { FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';

export const HEART_PARTS = [
  'right_atrium', 'right_ventricle', 'left_atrium', 'left_ventricle',
  'vena_cava', 'pulmonary_artery', 'pulmonary_vein', 'aorta',
] as const;
export type HeartPart = (typeof HEART_PARTS)[number];

const ALIASES: Record<string, HeartPart> = {
  right_atrium: 'right_atrium', ra: 'right_atrium',
  right_ventricle: 'right_ventricle', rv: 'right_ventricle',
  left_atrium: 'left_atrium', la: 'left_atrium',
  left_ventricle: 'left_ventricle', lv: 'left_ventricle',
  vena_cava: 'vena_cava', venacava: 'vena_cava',
  pulmonary_artery: 'pulmonary_artery',
  pulmonary_vein: 'pulmonary_vein', pulmonary_veins: 'pulmonary_vein',
  aorta: 'aorta',
};

export interface HeartFigure {
  highlight: HeartPart[];
  title?: string;
}

function slug(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z]/g, '_');
}

export function solveHeartDiagram(params: Record<string, unknown>): HeartFigure {
  const raw = Array.isArray(params.highlight) ? params.highlight
    : typeof params.highlight === 'string' ? [params.highlight] : [];
  const highlight = Array.from(new Set(raw.map((h) => ALIASES[slug(String(h))]).filter((h): h is HeartPart => Boolean(h))));
  return { highlight, title: typeof params.title === 'string' ? params.title : undefined };
}

export const heartFeatureNames = {
  heart: 'heart',
  part: (id: string): string => `part-${id}`,
};

const LABELS: Record<HeartPart, string> = {
  right_atrium: 'Right atrium',
  right_ventricle: 'Right ventricle',
  left_atrium: 'Left atrium',
  left_ventricle: 'Left ventricle',
  vena_cava: 'Vena cava',
  pulmonary_artery: 'Pulmonary artery',
  pulmonary_vein: 'Pulmonary veins',
  aorta: 'Aorta',
};

export function buildHeartManifest(figure: HeartFigure): FeatureManifestEntry[] {
  const N = heartFeatureNames;
  const features: FeatureManifestEntry[] = [
    {
      name: N.heart,
      kind: 'region',
      description: figure.title ? `heart: ${figure.title}` : 'heart',
      labels: ['the heart', 'heart', 'the diagram'],
      displayName: figure.title || 'heart',
      scribbleable: true,
    },
  ];
  for (const part of HEART_PARTS) {
    features.push({
      name: N.part(part),
      kind: 'area',
      description: LABELS[part],
      labels: [LABELS[part], `the ${LABELS[part].toLowerCase()}`, part.replace(/_/g, ' '), part],
      displayName: LABELS[part],
      scribbleable: true,
    });
  }
  return features;
}
