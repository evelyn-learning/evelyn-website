/**
 * Labeled-anatomy catalog kinds — schematic, deterministic diagrams the brain
 * would otherwise reach for show_sketch to draw (freehand, blank in any
 * brain-free path). Two kinds:
 *   - neuron_diagram: a canonical labeled neuron.
 *   - brain_regions: a side-view brain (4 cortical lobes + cerebellum + brain
 *     stem, or the limbic structures).
 * The structures are fixed; params only choose the view and which parts to
 * highlight. Renderers own the drawing.
 */

import type { FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';

function slug(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

// ── neuron_diagram ─────────────────────────────────────────────────────────
export const NEURON_PARTS = [
  'dendrites', 'cell_body', 'nucleus', 'axon',
  'myelin_sheath', 'node_of_ranvier', 'axon_terminals', 'synapse',
] as const;
export type NeuronPart = (typeof NEURON_PARTS)[number];

const NEURON_ALIASES: Record<string, NeuronPart> = {
  dendrite: 'dendrites', dendrites: 'dendrites',
  cell_body: 'cell_body', soma: 'cell_body', perikaryon: 'cell_body',
  nucleus: 'nucleus',
  axon: 'axon',
  myelin: 'myelin_sheath', myelin_sheath: 'myelin_sheath', schwann_cell: 'myelin_sheath',
  node_of_ranvier: 'node_of_ranvier', nodes_of_ranvier: 'node_of_ranvier', ranvier: 'node_of_ranvier',
  axon_terminal: 'axon_terminals', axon_terminals: 'axon_terminals',
  terminal_buttons: 'axon_terminals', synaptic_terminals: 'axon_terminals',
  synapse: 'synapse', synaptic_cleft: 'synapse', synaptic_gap: 'synapse',
};

export interface NeuronFigure {
  highlight: NeuronPart[];
  title?: string;
}

export function solveNeuronDiagram(params: Record<string, unknown>): NeuronFigure {
  const raw = Array.isArray(params.highlight) ? params.highlight : [];
  const highlight = Array.from(
    new Set(
      raw
        .map((h) => NEURON_ALIASES[slug(String(h))])
        .filter((h): h is NeuronPart => Boolean(h)),
    ),
  );
  return { highlight, title: typeof params.title === 'string' ? params.title : undefined };
}

export const neuronFeatureNames = {
  neuron: 'neuron',
  part: (id: string): string => `part-${id}`,
};

const NEURON_LABELS: Record<NeuronPart, string[]> = {
  dendrites: ['dendrites', 'dendrite', 'the dendrites'],
  cell_body: ['cell body', 'soma', 'the cell body', 'the soma'],
  nucleus: ['nucleus', 'the nucleus'],
  axon: ['axon', 'the axon'],
  myelin_sheath: ['myelin sheath', 'myelin', 'the myelin sheath'],
  node_of_ranvier: ['node of ranvier', 'nodes of ranvier', 'ranvier'],
  axon_terminals: ['axon terminals', 'axon terminal', 'terminal buttons', 'synaptic terminals'],
  synapse: ['synapse', 'synaptic cleft', 'the synapse'],
};

export function buildNeuronManifest(figure: NeuronFigure): FeatureManifestEntry[] {
  const N = neuronFeatureNames;
  const features: FeatureManifestEntry[] = [
    {
      name: N.neuron,
      kind: 'region',
      description: figure.title ? `neuron: ${figure.title}` : 'neuron',
      labels: ['neuron', 'the neuron', 'the diagram'],
      displayName: figure.title || 'neuron',
      scribbleable: true,
    },
  ];
  for (const part of NEURON_PARTS) {
    features.push({
      name: N.part(part),
      kind: 'area',
      description: NEURON_LABELS[part][0],
      labels: [...NEURON_LABELS[part], part],
      displayName: NEURON_LABELS[part][0],
      scribbleable: true,
    });
  }
  return features;
}

// ── brain_regions ──────────────────────────────────────────────────────────
export const BRAIN_LOBE_PARTS = [
  'frontal_lobe', 'parietal_lobe', 'temporal_lobe', 'occipital_lobe',
  'cerebellum', 'brain_stem',
] as const;
export const BRAIN_LIMBIC_PARTS = [
  'thalamus', 'hypothalamus', 'hippocampus', 'amygdala',
] as const;
export type BrainPart = (typeof BRAIN_LOBE_PARTS)[number] | (typeof BRAIN_LIMBIC_PARTS)[number];

const BRAIN_ALIASES: Record<string, BrainPart> = {
  frontal_lobe: 'frontal_lobe', frontal: 'frontal_lobe',
  parietal_lobe: 'parietal_lobe', parietal: 'parietal_lobe',
  temporal_lobe: 'temporal_lobe', temporal: 'temporal_lobe',
  occipital_lobe: 'occipital_lobe', occipital: 'occipital_lobe',
  cerebellum: 'cerebellum',
  brain_stem: 'brain_stem', brainstem: 'brain_stem', medulla: 'brain_stem',
  thalamus: 'thalamus',
  hypothalamus: 'hypothalamus',
  hippocampus: 'hippocampus',
  amygdala: 'amygdala',
};

export interface BrainRegionsFigure {
  view: 'lobes' | 'limbic';
  highlight: BrainPart[];
  title?: string;
}

export function solveBrainRegions(params: Record<string, unknown>): BrainRegionsFigure {
  const view = params.view === 'limbic' ? 'limbic' : 'lobes';
  const raw = Array.isArray(params.highlight) ? params.highlight : [];
  const valid = new Set<string>(view === 'limbic' ? BRAIN_LIMBIC_PARTS : BRAIN_LOBE_PARTS);
  const highlight = Array.from(
    new Set(
      raw
        .map((h) => BRAIN_ALIASES[slug(String(h))])
        .filter((h): h is BrainPart => Boolean(h) && valid.has(h)),
    ),
  );
  return { view, highlight, title: typeof params.title === 'string' ? params.title : undefined };
}

export const brainFeatureNames = {
  brain: 'brain',
  part: (id: string): string => `part-${id}`,
};

const BRAIN_LABELS: Record<BrainPart, string[]> = {
  frontal_lobe: ['frontal lobe', 'frontal', 'the frontal lobe'],
  parietal_lobe: ['parietal lobe', 'parietal', 'the parietal lobe'],
  temporal_lobe: ['temporal lobe', 'temporal', 'the temporal lobe'],
  occipital_lobe: ['occipital lobe', 'occipital', 'the occipital lobe'],
  cerebellum: ['cerebellum', 'the cerebellum'],
  brain_stem: ['brain stem', 'brainstem', 'the brain stem'],
  thalamus: ['thalamus', 'the thalamus'],
  hypothalamus: ['hypothalamus', 'the hypothalamus'],
  hippocampus: ['hippocampus', 'the hippocampus'],
  amygdala: ['amygdala', 'the amygdala'],
};

export function buildBrainRegionsManifest(figure: BrainRegionsFigure): FeatureManifestEntry[] {
  const N = brainFeatureNames;
  const parts = figure.view === 'limbic' ? BRAIN_LIMBIC_PARTS : BRAIN_LOBE_PARTS;
  const features: FeatureManifestEntry[] = [
    {
      name: N.brain,
      kind: 'region',
      description: figure.title ? `brain: ${figure.title}` : 'brain',
      labels: ['brain', 'the brain', 'the diagram'],
      displayName: figure.title || 'brain',
      scribbleable: true,
    },
  ];
  for (const part of parts) {
    features.push({
      name: N.part(part),
      kind: 'area',
      description: BRAIN_LABELS[part][0],
      labels: [...BRAIN_LABELS[part], part],
      displayName: BRAIN_LABELS[part][0],
      scribbleable: true,
    });
  }
  return features;
}
