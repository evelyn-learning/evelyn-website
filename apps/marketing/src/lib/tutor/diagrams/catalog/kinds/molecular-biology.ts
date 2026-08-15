/**
 * Molecular / cell-biology catalog kinds — schematic, fixed-structure process
 * figures that a freehand sketch garbles, spanning HS Biology / AP Bio / IB:
 *
 *   protein_synthesis — the central dogma: transcription (DNA → mRNA, in the
 *                       nucleus) and translation (a ribosome reads codons, tRNA
 *                       delivers amino acids → polypeptide). stage picks one
 *                       half or both.
 *   enzyme_action     — the lock-and-key / induced-fit model (enzyme + active
 *                       site + substrate → enzyme–substrate complex → products,
 *                       enzyme unchanged) plus an activation-energy reaction-
 *                       coordinate inset showing the enzyme lowering Ea.
 *   cell_cycle        — the cell cycle as a ring (G1 → S → G2 → M) with the
 *                       three checkpoints and relative phase durations.
 *   gene_expression   — the lac operon: regulatory gene, promoter, operator and
 *                       structural genes, shown OFF (repressor bound, no
 *                       transcription) vs ON (inducer present → transcription).
 *
 * Each solver is pure: it validates + fills defaults + normalizes, so a bare
 * call still renders a clean, correctly-labeled textbook figure. The matching
 * renderers live in CatalogMolecularBiologyRenderers.tsx.
 */

import type { FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';

function titleOf(params: Record<string, unknown>, fallback: string): string {
  return typeof params.title === 'string' && params.title.trim() ? params.title : fallback;
}

// ── protein_synthesis ──────────────────────────────────────────────────────
export type ProteinSynthesisStage = 'transcription' | 'translation' | 'both';

export interface ProteinSynthesisFigure {
  stage: ProteinSynthesisStage;
  title: string;
}

export function solveProteinSynthesis(params: Record<string, unknown>): ProteinSynthesisFigure {
  const raw = typeof params.stage === 'string' ? params.stage.trim().toLowerCase().replace(/[\s-]+/g, '_') : '';
  const stage: ProteinSynthesisStage =
    raw === 'transcription' ? 'transcription'
      : raw === 'translation' ? 'translation'
        : 'both';
  return { stage, title: titleOf(params, 'Protein Synthesis') };
}

export const proteinSynthesisFeatureNames = {
  figure: 'protein-synthesis',
  transcription: 'ps-transcription',
  translation: 'ps-translation',
  dna: 'ps-dna',
  rnaPolymerase: 'ps-rna-polymerase',
  mrna: 'ps-mrna',
  ribosome: 'ps-ribosome',
  trna: 'ps-trna',
  codon: 'ps-codon',
  anticodon: 'ps-anticodon',
  polypeptide: 'ps-polypeptide',
};

export function buildProteinSynthesisManifest(figure: ProteinSynthesisFigure): FeatureManifestEntry[] {
  const N = proteinSynthesisFeatureNames;
  const showTx = figure.stage !== 'translation';
  const showTl = figure.stage !== 'transcription';
  const feats: FeatureManifestEntry[] = [
    {
      name: N.figure,
      kind: 'region',
      description: figure.title ? `Protein synthesis: ${figure.title}` : 'Protein synthesis (the central dogma)',
      labels: ['protein synthesis', 'the diagram', 'the figure', 'central dogma', 'gene expression'],
      displayName: figure.title,
      scribbleable: true,
    },
  ];
  if (showTx) {
    feats.push(
      { name: N.transcription, kind: 'area', description: 'transcription — DNA is copied into mRNA inside the nucleus', labels: ['transcription', 'the transcription step', 'the nucleus'], displayName: 'Transcription', scribbleable: true },
      { name: N.dna, kind: 'label', description: 'the DNA template strand read by RNA polymerase', labels: ['DNA', 'the DNA', 'the template strand', 'template strand', 'the DNA template'], displayName: 'DNA', scribbleable: true },
      { name: N.rnaPolymerase, kind: 'label', description: 'RNA polymerase — reads the DNA template and builds the mRNA', labels: ['RNA polymerase', 'the RNA polymerase', 'polymerase', 'RNA pol'], displayName: 'RNA polymerase', scribbleable: true },
    );
  }
  feats.push({ name: N.mrna, kind: 'label', description: 'messenger RNA (mRNA) — carries the code from DNA to the ribosome', labels: ['mRNA', 'the mRNA', 'messenger RNA', 'the messenger RNA', 'the transcript'], displayName: 'mRNA', scribbleable: true });
  if (showTl) {
    feats.push(
      { name: N.translation, kind: 'area', description: 'translation — a ribosome reads the mRNA codons to build a polypeptide', labels: ['translation', 'the translation step', 'the cytoplasm', 'the ribosome step'], displayName: 'Translation', scribbleable: true },
      { name: N.ribosome, kind: 'label', description: 'the ribosome (large + small subunit) reading the mRNA', labels: ['ribosome', 'the ribosome'], displayName: 'Ribosome', scribbleable: true },
      { name: N.codon, kind: 'label', description: 'a codon — three mRNA bases that specify one amino acid', labels: ['codon', 'the codon', 'a codon', 'the codons'], displayName: 'Codon', scribbleable: true },
      { name: N.anticodon, kind: 'label', description: 'the tRNA anticodon that base-pairs with the mRNA codon', labels: ['anticodon', 'the anticodon'], displayName: 'Anticodon', scribbleable: true },
      { name: N.trna, kind: 'label', description: 'transfer RNA (tRNA) — delivers the matching amino acid', labels: ['tRNA', 'the tRNA', 'transfer RNA'], displayName: 'tRNA', scribbleable: true },
      { name: N.polypeptide, kind: 'label', description: 'the growing polypeptide (chain of amino acids)', labels: ['polypeptide', 'the polypeptide', 'the protein', 'the amino acid chain', 'polypeptide chain'], displayName: 'Polypeptide', scribbleable: true },
    );
  }
  return feats;
}

// ── enzyme_action ──────────────────────────────────────────────────────────
export type EnzymeModel = 'lock_key' | 'induced_fit';

export interface EnzymeActionFigure {
  model: EnzymeModel;
  title: string;
}

export function solveEnzymeAction(params: Record<string, unknown>): EnzymeActionFigure {
  const raw = typeof params.model === 'string' ? params.model.toLowerCase().replace(/[^a-z]/g, '') : '';
  const model: EnzymeModel =
    raw === 'inducedfit' || raw === 'induced' || raw === 'fit' ? 'induced_fit' : 'lock_key';
  return {
    model,
    title: titleOf(params, model === 'induced_fit' ? 'Enzyme Action — Induced Fit' : 'Enzyme Action — Lock and Key'),
  };
}

export const enzymeActionFeatureNames = {
  figure: 'enzyme-action',
  enzyme: 'ea-enzyme',
  activeSite: 'ea-active-site',
  substrate: 'ea-substrate',
  complex: 'ea-complex',
  products: 'ea-products',
  energyPlot: 'ea-reaction-coordinate',
  activationEnergy: 'ea-activation-energy',
};

export function buildEnzymeActionManifest(figure: EnzymeActionFigure): FeatureManifestEntry[] {
  const N = enzymeActionFeatureNames;
  const modelLabel = figure.model === 'induced_fit' ? 'induced fit' : 'lock and key';
  return [
    { name: N.figure, kind: 'region', description: `enzyme action (${modelLabel} model)`, labels: ['enzyme action', 'the diagram', 'the figure', modelLabel, `${modelLabel} model`], displayName: figure.title, scribbleable: true },
    { name: N.enzyme, kind: 'area', description: 'the enzyme (a protein catalyst, recovered unchanged)', labels: ['enzyme', 'the enzyme', 'the catalyst'], displayName: 'Enzyme', scribbleable: true },
    { name: N.activeSite, kind: 'point', description: 'the active site — the pocket the substrate binds', labels: ['active site', 'the active site'], displayName: 'Active site', scribbleable: true },
    { name: N.substrate, kind: 'point', description: 'the substrate — the reactant that binds the active site', labels: ['substrate', 'the substrate', 'the reactant'], displayName: 'Substrate', scribbleable: true },
    { name: N.complex, kind: 'point', description: 'the enzyme–substrate complex', labels: ['enzyme-substrate complex', 'the enzyme-substrate complex', 'E-S complex', 'the complex'], displayName: 'Enzyme–substrate complex', scribbleable: true },
    { name: N.products, kind: 'point', description: 'the products released from the active site', labels: ['products', 'the products'], displayName: 'Products', scribbleable: true },
    { name: N.energyPlot, kind: 'area', description: 'reaction-coordinate (energy) inset comparing catalyzed vs uncatalyzed', labels: ['reaction coordinate', 'the energy diagram', 'the energy plot', 'the reaction profile', 'the graph'], displayName: 'Reaction coordinate', scribbleable: true },
    { name: N.activationEnergy, kind: 'label', description: 'activation energy (Ea) — lowered by the enzyme', labels: ['activation energy', 'the activation energy', 'Ea', 'the energy barrier'], displayName: 'Activation energy', scribbleable: true },
  ];
}

// ── cell_cycle ─────────────────────────────────────────────────────────────
export type CellCyclePhase = 'g1' | 's' | 'g2' | 'm';

export interface CellCycleFigure {
  /** If set, this phase is emphasised (others dimmed). */
  highlight?: CellCyclePhase;
  title: string;
}

export function solveCellCycle(params: Record<string, unknown>): CellCycleFigure {
  let highlight: CellCyclePhase | undefined;
  const raw = params.highlight ?? params.phase ?? params.stage;
  if (typeof raw === 'string') {
    const h = raw.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (h === 'g1' || h === 'gap1' || h === 'firstgap') highlight = 'g1';
    else if (h === 's' || h === 'sphase' || h === 'synthesis') highlight = 's';
    else if (h === 'g2' || h === 'gap2' || h === 'secondgap') highlight = 'g2';
    else if (h === 'm' || h === 'mphase' || h === 'mitosis' || h === 'mitotic') highlight = 'm';
  }
  return { highlight, title: titleOf(params, 'The Cell Cycle') };
}

export const cellCycleFeatureNames = {
  figure: 'cell-cycle',
  phase: (id: CellCyclePhase): string => `cc-phase-${id}`,
  interphase: 'cc-interphase',
  checkpointG1S: 'cc-checkpoint-g1-s',
  checkpointG2M: 'cc-checkpoint-g2-m',
  checkpointSpindle: 'cc-checkpoint-spindle',
};

/** Ordered phases with their relative durations (typical human cell, hours). */
export const CELL_CYCLE_PHASES: Array<{ id: CellCyclePhase; label: string; hours: number; desc: string }> = [
  { id: 'g1', label: 'G1', hours: 11, desc: 'G1 (Gap 1) — the cell grows and makes proteins/organelles' },
  { id: 's', label: 'S', hours: 8, desc: 'S (Synthesis) — DNA is replicated' },
  { id: 'g2', label: 'G2', hours: 4, desc: 'G2 (Gap 2) — the cell grows and prepares for mitosis' },
  { id: 'm', label: 'M', hours: 1, desc: 'M (Mitosis + cytokinesis) — the cell divides into two' },
];

export function buildCellCycleManifest(figure: CellCycleFigure): FeatureManifestEntry[] {
  const N = cellCycleFeatureNames;
  const feats: FeatureManifestEntry[] = [
    { name: N.figure, kind: 'region', description: 'the cell cycle', labels: ['cell cycle', 'the cell cycle', 'the diagram', 'the cycle', 'the figure'], displayName: figure.title, scribbleable: true },
    { name: N.interphase, kind: 'area', description: 'interphase — G1 + S + G2 (the growth-and-copy portion, ~23 h)', labels: ['interphase', 'the interphase'], displayName: 'Interphase', scribbleable: true },
  ];
  for (const p of CELL_CYCLE_PHASES) {
    feats.push({
      name: N.phase(p.id),
      kind: 'area',
      description: p.desc,
      labels: [
        p.label, `the ${p.label}`, `${p.label} phase`, `the ${p.label} phase`,
        ...(p.id === 'm' ? ['mitosis', 'M phase (mitosis)', 'the mitosis phase'] : []),
        ...(p.id === 's' ? ['DNA synthesis', 'the synthesis phase'] : []),
        ...(p.id === 'g1' ? ['gap 1', 'first gap'] : []),
        ...(p.id === 'g2' ? ['gap 2', 'second gap'] : []),
      ],
      displayName: `${p.label} phase`,
      scribbleable: true,
    });
  }
  feats.push(
    { name: N.checkpointG1S, kind: 'point', description: 'G1/S checkpoint (restriction point) — commit to divide?', labels: ['G1/S checkpoint', 'the G1 checkpoint', 'the restriction point', 'G1 checkpoint', 'the G1/S checkpoint'], displayName: 'G1/S checkpoint', scribbleable: true },
    { name: N.checkpointG2M, kind: 'point', description: 'G2/M checkpoint — is DNA fully and correctly replicated?', labels: ['G2/M checkpoint', 'the G2 checkpoint', 'G2 checkpoint', 'the G2/M checkpoint'], displayName: 'G2/M checkpoint', scribbleable: true },
    { name: N.checkpointSpindle, kind: 'point', description: 'spindle (M) checkpoint — are all chromosomes attached to the spindle?', labels: ['spindle checkpoint', 'the spindle checkpoint', 'the M checkpoint', 'metaphase checkpoint', 'the spindle assembly checkpoint'], displayName: 'Spindle checkpoint', scribbleable: true },
  );
  return feats;
}

// ── gene_expression (lac operon) ───────────────────────────────────────────
export type OperonState = 'on' | 'off';

export interface GeneExpressionFigure {
  state: OperonState;
  title: string;
}

export function solveGeneExpression(params: Record<string, unknown>): GeneExpressionFigure {
  const raw = typeof params.state === 'string' ? params.state.trim().toLowerCase() : '';
  const state: OperonState =
    raw === 'on' || raw === 'induced' || raw === 'active' || raw === 'lactose' ? 'on' : 'off';
  return {
    state,
    title: titleOf(params, state === 'on' ? 'lac Operon — ON (inducer present)' : 'lac Operon — OFF (no inducer)'),
  };
}

export const geneExpressionFeatureNames = {
  figure: 'gene-expression',
  regulatoryGene: 'ge-regulatory-gene',
  promoter: 'ge-promoter',
  operator: 'ge-operator',
  genes: 'ge-structural-genes',
  repressor: 'ge-repressor',
  polymerase: 'ge-rna-polymerase',
  inducer: 'ge-inducer',
  mrna: 'ge-mrna',
};

export function buildGeneExpressionManifest(figure: GeneExpressionFigure): FeatureManifestEntry[] {
  const N = geneExpressionFeatureNames;
  const on = figure.state === 'on';
  const feats: FeatureManifestEntry[] = [
    { name: N.figure, kind: 'region', description: `the lac operon (${on ? 'ON — inducer present, genes transcribed' : 'OFF — no inducer, repressor blocks transcription'})`, labels: ['lac operon', 'the operon', 'the diagram', 'the figure', 'gene expression', 'gene regulation'], displayName: figure.title, scribbleable: true },
    { name: N.regulatoryGene, kind: 'label', description: 'the regulatory gene (lacI) — codes for the repressor protein', labels: ['regulatory gene', 'the regulatory gene', 'lacI', 'the lacI gene', 'the I gene'], displayName: 'Regulatory gene (lacI)', scribbleable: true },
    { name: N.promoter, kind: 'label', description: 'the promoter — where RNA polymerase binds', labels: ['promoter', 'the promoter'], displayName: 'Promoter', scribbleable: true },
    { name: N.operator, kind: 'label', description: 'the operator — the repressor’s binding site, the on/off switch', labels: ['operator', 'the operator', 'the switch'], displayName: 'Operator', scribbleable: true },
    { name: N.genes, kind: 'label', description: 'the structural genes (lacZ, lacY, lacA) — code for the lactose-using enzymes', labels: ['structural genes', 'the structural genes', 'lacZ', 'lacY', 'lacA', 'the genes'], displayName: 'Structural genes', scribbleable: true },
    { name: N.repressor, kind: 'point', description: on ? 'the repressor — inactivated by the inducer and released from the operator' : 'the repressor — bound to the operator, blocking RNA polymerase', labels: ['repressor', 'the repressor', 'the lac repressor'], displayName: 'Repressor', scribbleable: true },
  ];
  if (on) {
    feats.push(
      { name: N.inducer, kind: 'point', description: 'the inducer (allolactose/lactose) — binds and inactivates the repressor', labels: ['inducer', 'the inducer', 'allolactose', 'lactose'], displayName: 'Inducer', scribbleable: true },
      { name: N.polymerase, kind: 'point', description: 'RNA polymerase — bound to the promoter and transcribing the genes', labels: ['RNA polymerase', 'the RNA polymerase', 'polymerase', 'RNA pol'], displayName: 'RNA polymerase', scribbleable: true },
      { name: N.mrna, kind: 'label', description: 'the mRNA transcript of the structural genes', labels: ['mRNA', 'the mRNA', 'the transcript'], displayName: 'mRNA', scribbleable: true },
    );
  }
  return feats;
}
