/**
 * The homework figure vocabulary: which figure kinds the per-problem homework
 * build may propose, validate and store, and the HOMEWORK_FIGURE_KINDS kill
 * switch. `all` (the default: unset, `all`, or anything unrecognised) is the
 * whole vocabulary; `geometry` is the two kinds the build had before it
 * (constructed geometry and function graphs). Pure: no I/O.
 *
 * Each kind task appends its action to FIGURE_ACTIONS, its type to
 * FIGURE_STATS_TYPES / FIGURE_DIAGRAM_KINDS, and its entry to FIGURE_KIND_DOCS;
 * the drift test in scripts/test-homework-build.ts keeps the four in step.
 */

import type { FigureDiagramKind, FigureStatsType } from './types';

export type FigureVocabulary = 'all' | 'geometry';

/** The two kinds every vocabulary allows. */
const GEOMETRY_IDS: readonly string[] = ['showGeometryConstructed', 'showGraph'];

/** Every whiteboard action a homework figure may use. */
export const FIGURE_ACTIONS: readonly string[] = [...GEOMETRY_IDS, 'showStats', 'showTable', 'showNumberLine'];

/** The showStats chart types in the vocabulary. */
export const FIGURE_STATS_TYPES: readonly FigureStatsType[] = ['boxplot', 'histogram', 'dotplot', 'bar', 'pie'];

/** The showDiagram catalog kinds in the vocabulary (each has a catalog solver). */
export const FIGURE_DIAGRAM_KINDS: readonly FigureDiagramKind[] = [];

/** One kind as the proposer is told about it: its id (figureKindId), when to use it, its shape, and how its thumbnail box is sized. */
export interface FigureKindDoc { id: string; when: string; shape: string; box: 'fixed' | 'natural' }

/** The kinds beyond geometry and function graphs, one entry each. */
export const FIGURE_KIND_DOCS: readonly FigureKindDoc[] = [
  {
    id: 'showStats:boxplot', box: 'fixed',
    when: 'the sheet shows one or more box plots (box-and-whisker plots)',
    shape: '{"action":"showStats","type":"boxplot","title"?,"xLabel"?,"boxplot":{"datasets":[{"label","min","q1","median","q3","max","outliers"?:[…]}],"showValues"?}}',
  },
  {
    id: 'showStats:histogram', box: 'fixed',
    when: 'the sheet shows a histogram (bars over touching intervals)',
    shape: '{"action":"showStats","type":"histogram","title"?,"xLabel"?,"yLabel"?,"bins":[[lo,hi,count],…],"showCounts"?}',
  },
  {
    id: 'showStats:dotplot', box: 'fixed',
    when: 'the sheet shows a dot plot or line plot (stacked dots or crosses over a number line)',
    shape: '{"action":"showStats","type":"dotplot","title"?,"xLabel"?,"data":[one value per dot]}',
  },
  {
    id: 'showStats:bar', box: 'fixed',
    when: 'the sheet shows a bar chart of categories',
    shape: '{"action":"showStats","type":"bar","title"?,"xLabel"?,"yLabel"?,"bar":{"categories":[…],"values":[…]}}',
  },
  {
    id: 'showStats:pie', box: 'fixed',
    when: 'the sheet shows a pie chart (circle graph)',
    shape: '{"action":"showStats","type":"pie","title"?,"pie":{"slices":[{"label","value"}]}}',
  },
  {
    id: 'showTable', box: 'natural',
    when: 'the sheet shows a table (frequency, two-way, function or input-output table; a stem-and-leaf display as two columns)',
    shape: '{"action":"showTable","headers":[…],"rows":[[…],…]} (every row as long as headers; a cell the sheet leaves blank is "")',
  },
  {
    id: 'showNumberLine', box: 'natural',
    when: 'the sheet shows a number line (marked points, open or closed circles, shaded intervals or rays, an inequality graph)',
    shape: '{"action":"showNumberLine","title"?,"min","max","step"?,"points"?:[{"value","label"?,"style"?:"filled"|"open"}],"intervals"?:[{"from","to","fromInclusive"?,"toInclusive"?,"label"?}]}',
  },
];

/** HOMEWORK_FIGURE_KINDS, trimmed and lower-cased: `geometry` → geometry; unset or `all` → all; anything else → all, with a warning (flags default ON). */
export function figureVocabularyFromEnv(env: Record<string, string | undefined> = process.env): FigureVocabulary {
  const raw = env.HOMEWORK_FIGURE_KINDS;
  const v = (raw ?? '').trim().toLowerCase();
  if (v === 'geometry') return 'geometry';
  if (v === '' || v === 'all') return 'all';
  console.warn(`[homework-build] HOMEWORK_FIGURE_KINDS="${raw}" not recognised, using all`);
  return 'all';
}

/** A figure's kind id: `showStats:<type>` and `showDiagram:<type>`, the bare action otherwise. */
export function figureKindId(figure: { action?: unknown; type?: unknown }): string {
  const action = String(figure?.action);
  return action === 'showStats' || action === 'showDiagram' ? `${action}:${String(figure.type)}` : action;
}

/** Under `geometry`, only the two geometry ids; under `all`, those plus every documented kind. */
export function isFigureKindAllowed(id: string, v: FigureVocabulary): boolean {
  if (GEOMETRY_IDS.includes(id)) return true;
  return v === 'all' && FIGURE_KIND_DOCS.some((d) => d.id === id);
}
