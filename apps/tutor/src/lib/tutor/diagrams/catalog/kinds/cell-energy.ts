/**
 * photosynthesis / cellular_respiration — schematic process diagrams of the two
 * energy organelles: a chloroplast (light reactions in the thylakoid + Calvin
 * cycle in the stroma) and a mitochondrion (glycolysis → Krebs cycle → electron
 * transport chain), with the inputs/outputs and ATP yields. These multi-stage,
 * spatially-organized processes are exactly what a freehand sketch garbles.
 * Structure is fixed per process; params only set the title.
 */

import type { FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';

export type CellProcess = 'photosynthesis' | 'cellular_respiration';

export interface CellEnergyFigure {
  process: CellProcess;
  title?: string;
}

export function solvePhotosynthesis(params: Record<string, unknown>): CellEnergyFigure {
  return { process: 'photosynthesis', title: typeof params.title === 'string' ? params.title : 'Photosynthesis' };
}
export function solveCellularRespiration(params: Record<string, unknown>): CellEnergyFigure {
  return { process: 'cellular_respiration', title: typeof params.title === 'string' ? params.title : 'Cellular Respiration' };
}

export const cellEnergyFeatureNames = {
  organelle: 'organelle',
  stage: (id: string): string => `stage-${id}`,
};

export function buildCellEnergyManifest(figure: CellEnergyFigure): FeatureManifestEntry[] {
  const N = cellEnergyFeatureNames;
  const isPhoto = figure.process === 'photosynthesis';
  const organelle = isPhoto ? 'chloroplast' : 'mitochondrion';
  const stages = isPhoto
    ? [['light_reactions', 'light reactions'], ['calvin_cycle', 'Calvin cycle']]
    : [['glycolysis', 'glycolysis'], ['krebs', 'Krebs cycle'], ['etc', 'electron transport chain']];
  const features: FeatureManifestEntry[] = [
    {
      name: N.organelle,
      kind: 'region',
      description: figure.title ? `${figure.process}: ${figure.title}` : figure.process,
      labels: [`the ${organelle}`, organelle, figure.process.replace(/_/g, ' '), 'the diagram'],
      displayName: figure.title || figure.process.replace(/_/g, ' '),
      scribbleable: true,
    },
  ];
  for (const [id, label] of stages) {
    features.push({
      name: N.stage(id),
      kind: 'area',
      description: label,
      labels: [label, `the ${label}`, id.replace(/_/g, ' ')],
      displayName: label,
      scribbleable: true,
    });
  }
  return features;
}
