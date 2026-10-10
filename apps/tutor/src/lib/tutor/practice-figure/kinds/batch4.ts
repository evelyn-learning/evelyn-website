/**
 * Batch 4 of the practice-figure kinds (2026-10-14). One list and one
 * dispatcher, as ./batch2.ts and ./batch3.ts; each kind is a pure function of
 * a typed params object documented at the top of its module:
 *   conic_graph (conic.ts) · venn_diagram, probability_tree (venn-tree.ts) ·
 *   mechanics_setup (mechanics.ts) · wave_diagram (wave.ts) ·
 *   energy_levels (energy-levels.ts) · heating_curve (heating-curve.ts) ·
 *   electrochemical_cell (electrochemical-cell.ts) · sequence_strip (sequence.ts).
 */
import type { Drawn, Reader } from '../spec';
import { renderConicGraph } from './conic';
import { renderElectrochemicalCell } from './electrochemical-cell';
import { renderEnergyLevels } from './energy-levels';
import { renderHeatingCurve } from './heating-curve';
import { renderMechanicsSetup } from './mechanics';
import { renderSequenceStrip } from './sequence';
import { renderProbabilityTree, renderVennDiagram } from './venn-tree';
import { renderWaveDiagram } from './wave';

export const BATCH4_FIGURE_KINDS = [
  'conic_graph',
  'venn_diagram',
  'probability_tree',
  'mechanics_setup',
  'wave_diagram',
  'energy_levels',
  'heating_curve',
  'electrochemical_cell',
  'sequence_strip',
] as const;
export type Batch4FigureKind = (typeof BATCH4_FIGURE_KINDS)[number];

/** The drawing of a batch-4 kind, or null when `kind` is not one. */
export function renderBatch4(kind: string, r: Reader, uid: string): Drawn | null {
  switch (kind as Batch4FigureKind) {
    case 'conic_graph': return renderConicGraph(r, uid);
    case 'venn_diagram': return renderVennDiagram(r, uid);
    case 'probability_tree': return renderProbabilityTree(r, uid);
    case 'mechanics_setup': return renderMechanicsSetup(r, uid);
    case 'wave_diagram': return renderWaveDiagram(r, uid);
    case 'energy_levels': return renderEnergyLevels(r, uid);
    case 'heating_curve': return renderHeatingCurve(r, uid);
    case 'electrochemical_cell': return renderElectrochemicalCell(r, uid);
    case 'sequence_strip': return renderSequenceStrip(r, uid);
    default: return null;
  }
}
