/**
 * Batch 6 of the figure kinds (coordinate_polygon, stemplot — GreenApple T2):
 * the TEXT transcription of each figure and the deterministic checkers, in
 * the conventions of figure-core-batch5.ts. The work is in the parts
 * (figure-core-batch6-<part>.ts, helpers in figure-core-batch4-kit.ts); this
 * file collects them. figure-core.ts registers it as it does batch 5.
 *
 * Pure: no I/O, no network, no model, no database.
 */
import '../lib/no-db-env';
import type { PracticeFigureSpec } from '../../src/lib/tutor/practice-figure/render';
import { BATCH6_FIGURE_KINDS, type Batch6FigureKind } from '../../src/lib/tutor/practice-figure/kinds/batch6';
import type { Batch4CheckerDef, Batch4Part } from './figure-core-batch4-kit';
import { PART as POLYGON } from './figure-core-batch6-polygon';
import { PART as STEMPLOT } from './figure-core-batch6-stemplot';

export { BATCH6_FIGURE_KINDS };
export type { Batch6FigureKind };

const PARTS: Batch4Part[] = [POLYGON, STEMPLOT];

export const isBatch6Kind = (type: string): type is Batch6FigureKind => (BATCH6_FIGURE_KINDS as readonly string[]).includes(type);

/** The transcription of a batch-6 figure: fills `printed` and `out`, returns the kind phrase — '' when the spec is not a batch-6 kind. */
export function describeBatch6(spec: PracticeFigureSpec, printed: string[], out: string[]): string {
  for (const part of PARTS) {
    if (!part.kinds.includes(spec.type)) continue;
    const k = part.describe(spec, printed, out);
    if (k) return k;
  }
  return '';
}

export const BATCH6_CHECKERS: Record<string, Batch4CheckerDef> = {};
for (const part of PARTS) {
  for (const [name, def] of Object.entries(part.checkers)) {
    if (name in BATCH6_CHECKERS) throw new Error(`figure-core-batch6: the checker "${name}" is defined by two parts`);
    BATCH6_CHECKERS[name] = def;
  }
}
