/**
 * Batch 4 of the figure kinds (conic_graph, venn_diagram, probability_tree,
 * mechanics_setup, wave_diagram, energy_levels, heating_curve,
 * electrochemical_cell, sequence_strip): the TEXT transcription of each figure
 * and the deterministic checkers, in the conventions of figure-core-batch3.ts
 * — each kind read through the SAME model its renderer draws from; a
 * transcription says exactly what is visible; a checker recomputes the key
 * from the spec and refuses what the figure cannot settle.
 *
 * The work is in the parts (figure-core-batch4-<part>.ts, helpers in
 * figure-core-batch4-kit.ts); this file collects them. figure-core.ts
 * registers it (`describeFigure`, `runChecker`, `checkerCatalogue`, `axesOf`)
 * with one import and four short lines.
 *
 * Pure: no I/O, no network, no model, no database.
 */
import '../lib/no-db-env';
import type { PracticeFigureSpec } from '../../src/lib/tutor/practice-figure/render';
import { BATCH4_FIGURE_KINDS, type Batch4FigureKind } from '../../src/lib/tutor/practice-figure/kinds/batch4';
import type { Batch4CheckerDef, Batch4Part } from './figure-core-batch4-kit';
import { PART as BIO } from './figure-core-batch4-bio';
import { PART as CHEM } from './figure-core-batch4-chem';
import { PART as MATH } from './figure-core-batch4-math';
import { PART as MECH } from './figure-core-batch4-mech';
import { PART as WAVE } from './figure-core-batch4-wave';

export { BATCH4_FIGURE_KINDS };
export type { Batch4CheckerDef, Batch4FigureKind };

const PARTS: Batch4Part[] = [MATH, MECH, WAVE, CHEM, BIO];

export const isBatch4Kind = (type: string): type is Batch4FigureKind => (BATCH4_FIGURE_KINDS as readonly string[]).includes(type);

/** The transcription of a batch-4 figure: fills `printed` and `out`, returns the kind phrase — '' when the spec is not a batch-4 kind. */
export function describeBatch4(spec: PracticeFigureSpec, printed: string[], out: string[]): string {
  for (const part of PARTS) {
    if (!part.kinds.includes(spec.type)) continue;
    const k = part.describe(spec, printed, out);
    if (k) return k;
  }
  return '';
}

export const BATCH4_CHECKERS: Record<string, Batch4CheckerDef> = {};
for (const part of PARTS) {
  for (const [name, def] of Object.entries(part.checkers)) {
    if (name in BATCH4_CHECKERS) throw new Error(`figure-core-batch4: the checker "${name}" is defined by two parts`);
    BATCH4_CHECKERS[name] = def;
  }
}
