/**
 * Batch 5 of the practice-figure kinds (2026-10-16) — the kinds the batch-4
 * survey left unbuilt. One list and one dispatcher, as ./batch4.ts; each kind
 * is a pure function of a typed params object documented at the top of its
 * module:
 *   replication_fork (replication-fork.ts) · operon_map (operon-map.ts) ·
 *   cell_cycle_wheel (cell-cycle.ts) · transformer (transformer.ts) ·
 *   induction_loop (induction-loop.ts) · doppler_wavefronts (doppler.ts) ·
 *   photoelectric_setup (photoelectric.ts) · data_table (data-table.ts).
 */
import type { Drawn, Reader } from '../spec';
import { renderCellCycleWheel } from './cell-cycle';
import { renderDataTable } from './data-table';
import { renderDopplerWavefronts } from './doppler';
import { renderInductionLoop } from './induction-loop';
import { renderOperonMap } from './operon-map';
import { renderPhotoelectricSetup } from './photoelectric';
import { renderReplicationFork } from './replication-fork';
import { renderTransformer } from './transformer';

export const BATCH5_FIGURE_KINDS = [
  'replication_fork',
  'operon_map',
  'cell_cycle_wheel',
  'transformer',
  'induction_loop',
  'doppler_wavefronts',
  'photoelectric_setup',
  'data_table',
] as const;
export type Batch5FigureKind = (typeof BATCH5_FIGURE_KINDS)[number];

/** The drawing of a batch-5 kind, or null when `kind` is not one. */
export function renderBatch5(kind: string, r: Reader, uid: string): Drawn | null {
  switch (kind as Batch5FigureKind) {
    case 'replication_fork': return renderReplicationFork(r, uid);
    case 'operon_map': return renderOperonMap(r, uid);
    case 'cell_cycle_wheel': return renderCellCycleWheel(r, uid);
    case 'transformer': return renderTransformer(r, uid);
    case 'induction_loop': return renderInductionLoop(r, uid);
    case 'doppler_wavefronts': return renderDopplerWavefronts(r, uid);
    case 'photoelectric_setup': return renderPhotoelectricSetup(r, uid);
    case 'data_table': return renderDataTable(r, uid);
    default: return null;
  }
}
