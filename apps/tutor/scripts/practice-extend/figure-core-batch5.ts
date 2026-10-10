/**
 * Batch 5 of the figure kinds (replication_fork, operon_map, cell_cycle_wheel,
 * transformer, induction_loop, doppler_wavefronts, photoelectric_setup,
 * data_table): the TEXT transcription of each figure and the deterministic
 * checkers, in the conventions of figure-core-batch4.ts — each kind read
 * through the SAME model its renderer draws from; a transcription says exactly
 * what is visible; a checker recomputes the key from the spec and refuses what
 * the figure cannot settle.
 *
 * The work is in the parts (figure-core-batch5-<part>.ts, helpers shared with
 * batch 4 in figure-core-batch4-kit.ts); this file collects them.
 * figure-core.ts registers it (`describeFigure`, `runChecker`,
 * `checkerCatalogue`, `axesOf`) with one import and four short lines.
 *
 * Pure: no I/O, no network, no model, no database.
 */
import '../lib/no-db-env';
import type { PracticeFigureSpec } from '../../src/lib/tutor/practice-figure/render';
import { BATCH5_FIGURE_KINDS, type Batch5FigureKind } from '../../src/lib/tutor/practice-figure/kinds/batch5';
import type { Batch4CheckerDef, Batch4Part } from './figure-core-batch4-kit';
import { PART as BIO } from './figure-core-batch5-bio';
import { PART as EM } from './figure-core-batch5-em';
import { PART as MODERN } from './figure-core-batch5-modern';
import { PART as TABLE } from './figure-core-batch5-table';

export { BATCH5_FIGURE_KINDS };
export type { Batch5FigureKind };

const PARTS: Batch4Part[] = [BIO, EM, MODERN, TABLE];

export const isBatch5Kind = (type: string): type is Batch5FigureKind => (BATCH5_FIGURE_KINDS as readonly string[]).includes(type);

/** The transcription of a batch-5 figure: fills `printed` and `out`, returns the kind phrase — '' when the spec is not a batch-5 kind. */
export function describeBatch5(spec: PracticeFigureSpec, printed: string[], out: string[]): string {
  for (const part of PARTS) {
    if (!part.kinds.includes(spec.type)) continue;
    const k = part.describe(spec, printed, out);
    if (k) return k;
  }
  return '';
}

export const BATCH5_CHECKERS: Record<string, Batch4CheckerDef> = {};
for (const part of PARTS) {
  for (const [name, def] of Object.entries(part.checkers)) {
    if (name in BATCH5_CHECKERS) throw new Error(`figure-core-batch5: the checker "${name}" is defined by two parts`);
    BATCH5_CHECKERS[name] = def;
  }
}
