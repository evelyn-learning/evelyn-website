/**
 * Cell-biology catalog kinds — the canonical genetics/cell figures that a
 * freehand sketch cannot draw legibly and that appear across middle-school
 * life science, high-school Biology and AP Bio:
 *
 *   mitosis          — the phases of mitosis (interphase → prophase →
 *                      metaphase → anaphase → telophase → cytokinesis) as a
 *                      labeled grid of cells showing chromosome behavior.
 *   meiosis          — meiosis I & II producing 4 haploid cells, with
 *                      homolog pairing / crossing-over and the two divisions.
 *   dna_replication  — the replication fork: parental strands unwinding,
 *                      leading vs lagging strand, Okazaki fragments, and the
 *                      key enzymes (helicase, polymerase, ligase).
 *   cell_membrane    — the fluid-mosaic model: phospholipid bilayer + embedded
 *                      proteins, plus a transport variant (passive diffusion /
 *                      facilitated diffusion / active transport) with the
 *                      concentration gradient drawn.
 *
 * Each solver is pure: it validates + fills defaults + normalizes, so a bare
 * call still renders a clean, correctly-labeled textbook figure. The matching
 * renderer (CatalogCellBiologyRenderers.tsx) draws it.
 */

import type { FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';

function titleOf(params: Record<string, unknown>): string | undefined {
  return typeof params.title === 'string' && params.title.trim() ? params.title : undefined;
}
function strEnum<T extends string>(v: unknown, allowed: readonly T[]): T | undefined {
  if (typeof v !== 'string') return undefined;
  const s = v.trim().toLowerCase().replace(/[\s-]+/g, '_');
  return (allowed as readonly string[]).includes(s) ? (s as T) : undefined;
}

// ── mitosis ───────────────────────────────────────────────────────────────────
export const MITOSIS_PHASES = [
  'interphase',
  'prophase',
  'metaphase',
  'anaphase',
  'telophase',
  'cytokinesis',
] as const;
export type MitosisPhase = (typeof MITOSIS_PHASES)[number];

export interface MitosisFigure {
  /** If set, this phase is emphasised (border + others dimmed). */
  highlight?: MitosisPhase;
  title?: string;
}

export function solveMitosis(params: Record<string, unknown>): MitosisFigure {
  const raw = params.phase ?? params.highlight ?? params.stage;
  const highlight = strEnum(raw, MITOSIS_PHASES);
  return { highlight, title: titleOf(params) };
}

export const mitosisFeatureNames = {
  figure: 'mitosis',
  interphase: 'mitosis-interphase',
  prophase: 'mitosis-prophase',
  metaphase: 'mitosis-metaphase',
  anaphase: 'mitosis-anaphase',
  telophase: 'mitosis-telophase',
  cytokinesis: 'mitosis-cytokinesis',
};

const MITOSIS_DESC: Record<MitosisPhase, string> = {
  interphase: 'interphase — the cell grows and DNA replicates (chromatin is uncondensed)',
  prophase: 'prophase — chromosomes condense, the nuclear envelope breaks down, the spindle forms',
  metaphase: 'metaphase — chromosomes line up single-file on the metaphase plate',
  anaphase: 'anaphase — sister chromatids separate and are pulled to opposite poles',
  telophase: 'telophase — nuclear envelopes reform around the two chromosome sets',
  cytokinesis: 'cytokinesis — the cytoplasm divides, giving two identical daughter cells',
};

export function buildMitosisManifest(figure: MitosisFigure): FeatureManifestEntry[] {
  const N = mitosisFeatureNames;
  const feats: FeatureManifestEntry[] = [
    {
      name: N.figure,
      kind: 'region',
      description: figure.title ? `Mitosis: ${figure.title}` : 'The phases of mitosis',
      labels: ['mitosis', 'the mitosis diagram', 'cell division', 'the phases', 'the diagram', 'the figure'],
      displayName: figure.title || 'Mitosis',
      scribbleable: true,
    },
  ];
  for (const phase of MITOSIS_PHASES) {
    feats.push({
      name: N[phase],
      kind: 'area',
      description: MITOSIS_DESC[phase],
      labels: [phase, `the ${phase}`, `${phase} phase`],
      displayName: phase.charAt(0).toUpperCase() + phase.slice(1),
      scribbleable: true,
    });
  }
  return feats;
}

// ── meiosis ───────────────────────────────────────────────────────────────────
export const MEIOSIS_STAGES = ['meiosis_i', 'meiosis_ii', 'crossing_over'] as const;
export type MeiosisStage = (typeof MEIOSIS_STAGES)[number];

export interface MeiosisFigure {
  /** Which stage to emphasise (a row of the flow, or the crossover). */
  highlight?: MeiosisStage;
  title?: string;
}

export function solveMeiosis(params: Record<string, unknown>): MeiosisFigure {
  let raw = params.stage ?? params.highlight ?? params.phase;
  // Accept common aliases: "meiosis 1", "meiosis1", "I", "II".
  if (typeof raw === 'string') {
    const s = raw.trim().toLowerCase().replace(/[\s-]+/g, '_');
    if (s === 'meiosis_1' || s === 'i' || s === '1' || s === 'first') raw = 'meiosis_i';
    else if (s === 'meiosis_2' || s === 'ii' || s === '2' || s === 'second') raw = 'meiosis_ii';
    else if (s === 'crossover' || s === 'crossing') raw = 'crossing_over';
    else raw = s;
  }
  const highlight = strEnum(raw, MEIOSIS_STAGES);
  return { highlight, title: titleOf(params) };
}

export const meiosisFeatureNames = {
  figure: 'meiosis',
  parent: 'meiosis-parent',
  crossover: 'meiosis-crossover',
  meiosis1: 'meiosis-i',
  meiosis2: 'meiosis-ii',
  daughters: 'meiosis-daughters',
};

export function buildMeiosisManifest(figure: MeiosisFigure): FeatureManifestEntry[] {
  const N = meiosisFeatureNames;
  return [
    {
      name: N.figure,
      kind: 'region',
      description: figure.title ? `Meiosis: ${figure.title}` : 'Meiosis I and II producing four haploid cells',
      labels: ['meiosis', 'the meiosis diagram', 'the diagram', 'the figure'],
      displayName: figure.title || 'Meiosis',
      scribbleable: true,
    },
    {
      name: N.parent,
      kind: 'area',
      description: 'the diploid (2n) parent cell with homologous chromosomes paired as tetrads',
      labels: ['the parent cell', 'the diploid cell', 'the 2n cell', 'the tetrads', 'the homologous pairs'],
      displayName: 'Parent cell (2n)',
      scribbleable: true,
    },
    {
      name: N.crossover,
      kind: 'area',
      description: 'crossing over — homologous chromatids exchange segments at a chiasma (prophase I)',
      labels: ['crossing over', 'the crossover', 'the chiasma', 'recombination'],
      displayName: 'Crossing over',
      scribbleable: true,
    },
    {
      name: N.meiosis1,
      kind: 'area',
      description: 'Meiosis I (reductional) — homologous pairs separate, giving two haploid cells',
      labels: ['meiosis I', 'meiosis 1', 'the first division', 'reductional division'],
      displayName: 'Meiosis I',
      scribbleable: true,
    },
    {
      name: N.meiosis2,
      kind: 'area',
      description: 'Meiosis II (equational) — sister chromatids separate, like mitosis',
      labels: ['meiosis II', 'meiosis 2', 'the second division', 'equational division'],
      displayName: 'Meiosis II',
      scribbleable: true,
    },
    {
      name: N.daughters,
      kind: 'area',
      description: 'the four genetically distinct haploid (n) daughter cells (gametes)',
      labels: ['the daughter cells', 'the four cells', 'the haploid cells', 'the gametes', 'the n cells'],
      displayName: 'Four haploid cells',
      scribbleable: true,
    },
  ];
}

// ── dna_replication ─────────────────────────────────────────────────────────────
export interface DnaReplicationFigure {
  /** Label the enzymes (helicase, polymerase, ligase, primase). */
  showEnzymes: boolean;
  title?: string;
}

export function solveDnaReplication(params: Record<string, unknown>): DnaReplicationFigure {
  const showEnzymes = params.showEnzymes !== false && params.enzymes !== false;
  return { showEnzymes, title: titleOf(params) };
}

export const dnaReplicationFeatureNames = {
  figure: 'dna-replication',
  helicase: 'dna-helicase',
  leading: 'dna-leading-strand',
  lagging: 'dna-lagging-strand',
  okazaki: 'dna-okazaki',
  polymerase: 'dna-polymerase',
  ligase: 'dna-ligase',
};

export function buildDnaReplicationManifest(figure: DnaReplicationFigure): FeatureManifestEntry[] {
  const N = dnaReplicationFeatureNames;
  const feats: FeatureManifestEntry[] = [
    {
      name: N.figure,
      kind: 'region',
      description: figure.title ? `DNA replication: ${figure.title}` : 'The DNA replication fork',
      labels: ['dna replication', 'the replication fork', 'the fork', 'the diagram', 'the figure'],
      displayName: figure.title || 'DNA replication',
      scribbleable: true,
    },
    {
      name: N.leading,
      kind: 'area',
      description: 'the leading strand — synthesised continuously toward the fork (5′ → 3′)',
      labels: ['the leading strand', 'leading strand'],
      displayName: 'Leading strand',
      scribbleable: true,
    },
    {
      name: N.lagging,
      kind: 'area',
      description: 'the lagging strand — synthesised discontinuously away from the fork',
      labels: ['the lagging strand', 'lagging strand'],
      displayName: 'Lagging strand',
      scribbleable: true,
    },
    {
      name: N.okazaki,
      kind: 'area',
      description: 'Okazaki fragments — the short pieces of the lagging strand',
      labels: ['okazaki fragments', 'the okazaki fragments', 'the fragments', 'okazaki'],
      displayName: 'Okazaki fragments',
      scribbleable: true,
    },
  ];
  if (figure.showEnzymes) {
    feats.push(
      {
        name: N.helicase,
        kind: 'point',
        description: 'helicase — unwinds the parental double helix at the fork',
        labels: ['helicase', 'the helicase'],
        displayName: 'Helicase',
        scribbleable: true,
      },
      {
        name: N.polymerase,
        kind: 'point',
        description: 'DNA polymerase — adds nucleotides to build each new strand',
        labels: ['dna polymerase', 'polymerase', 'the polymerase'],
        displayName: 'DNA polymerase',
        scribbleable: true,
      },
      {
        name: N.ligase,
        kind: 'point',
        description: 'DNA ligase — seals the gaps between Okazaki fragments',
        labels: ['dna ligase', 'ligase', 'the ligase'],
        displayName: 'DNA ligase',
        scribbleable: true,
      },
    );
  }
  return feats;
}

// ── cell_membrane ───────────────────────────────────────────────────────────────
export const MEMBRANE_MODES = ['diffusion', 'facilitated', 'active'] as const;
export type MembraneMode = (typeof MEMBRANE_MODES)[number];

export interface CellMembraneFigure {
  /** Transport variant to illustrate; undefined = plain fluid-mosaic model. */
  mode?: MembraneMode;
  title?: string;
}

export function solveCellMembrane(params: Record<string, unknown>): CellMembraneFigure {
  let raw = params.mode ?? params.transport ?? params.variant;
  if (typeof raw === 'string') {
    const s = raw.trim().toLowerCase().replace(/[\s-]+/g, '_');
    if (s === 'passive' || s === 'simple' || s === 'simple_diffusion' || s === 'passive_diffusion') raw = 'diffusion';
    else if (s === 'facilitated_diffusion' || s === 'channel' || s === 'carrier') raw = 'facilitated';
    else if (s === 'active_transport' || s === 'pump') raw = 'active';
    else raw = s;
  }
  const mode = strEnum(raw, MEMBRANE_MODES);
  return { mode, title: titleOf(params) };
}

export const cellMembraneFeatureNames = {
  figure: 'cell-membrane',
  bilayer: 'membrane-bilayer',
  heads: 'membrane-heads',
  tails: 'membrane-tails',
  channel: 'membrane-channel',
  carrier: 'membrane-carrier',
  transport: 'membrane-transport',
};

const MEMBRANE_MODE_DESC: Record<MembraneMode, string> = {
  diffusion: 'simple diffusion — small molecules cross the bilayer directly, down the concentration gradient (no protein, no ATP)',
  facilitated: 'facilitated diffusion — molecules move down the gradient through a channel/carrier protein (no ATP)',
  active: 'active transport — a pump protein moves molecules against the gradient, powered by ATP',
};

export function buildCellMembraneManifest(figure: CellMembraneFigure): FeatureManifestEntry[] {
  const N = cellMembraneFeatureNames;
  const feats: FeatureManifestEntry[] = [
    {
      name: N.figure,
      kind: 'region',
      description: figure.title
        ? `Cell membrane: ${figure.title}`
        : 'The cell membrane — fluid-mosaic model',
      labels: ['cell membrane', 'the cell membrane', 'plasma membrane', 'the membrane', 'fluid mosaic model', 'the diagram'],
      displayName: figure.title || 'Cell membrane',
      scribbleable: true,
    },
    {
      name: N.bilayer,
      kind: 'area',
      description: 'the phospholipid bilayer — two layers of phospholipids',
      labels: ['the bilayer', 'phospholipid bilayer', 'the phospholipid bilayer', 'the phospholipids'],
      displayName: 'Phospholipid bilayer',
      scribbleable: true,
    },
    {
      name: N.heads,
      kind: 'area',
      description: 'the hydrophilic (water-loving) phosphate heads, facing the watery fluid',
      labels: ['the heads', 'phosphate heads', 'hydrophilic heads', 'the hydrophilic heads'],
      displayName: 'Hydrophilic heads',
      scribbleable: true,
    },
    {
      name: N.tails,
      kind: 'area',
      description: 'the hydrophobic (water-fearing) fatty-acid tails, facing inward',
      labels: ['the tails', 'fatty acid tails', 'hydrophobic tails', 'the hydrophobic tails'],
      displayName: 'Hydrophobic tails',
      scribbleable: true,
    },
    {
      name: N.channel,
      kind: 'point',
      description: 'a channel protein — a pore that lets specific molecules through',
      labels: ['the channel protein', 'channel protein', 'the channel'],
      displayName: 'Channel protein',
      scribbleable: true,
    },
    {
      name: N.carrier,
      kind: 'point',
      description: 'a carrier / transport protein that changes shape to move molecules across',
      labels: ['the carrier protein', 'carrier protein', 'transport protein', 'the transport protein'],
      displayName: 'Carrier protein',
      scribbleable: true,
    },
  ];
  if (figure.mode) {
    feats.push({
      name: N.transport,
      kind: 'area',
      description: MEMBRANE_MODE_DESC[figure.mode],
      labels: ['the transport', 'the gradient', 'the concentration gradient', figure.mode, `${figure.mode} transport`],
      displayName:
        figure.mode === 'diffusion' ? 'Simple diffusion' : figure.mode === 'facilitated' ? 'Facilitated diffusion' : 'Active transport',
      scribbleable: true,
    });
  }
  return feats;
}
