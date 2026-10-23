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

import { getDiagramKind } from '../diagrams/catalog/manifest';
import type { FigureDiagramKind, FigureStatsType } from './types';

export type FigureVocabulary = 'all' | 'geometry';

/** The two kinds every vocabulary allows. */
const GEOMETRY_IDS: readonly string[] = ['showGeometryConstructed', 'showGraph'];

/** Every whiteboard action a homework figure may use. */
export const FIGURE_ACTIONS: readonly string[] = [...GEOMETRY_IDS, 'showStats', 'showTable', 'showNumberLine', 'showScatterPlot', 'showDiagram', 'showVennDiagram', 'showTree', 'showFractionBar', 'showCoordinatePlane'];

/** The showStats chart types in the vocabulary. */
export const FIGURE_STATS_TYPES: readonly FigureStatsType[] = ['boxplot', 'histogram', 'dotplot', 'bar', 'pie'];

/** The showDiagram catalog kinds in the vocabulary (each has a catalog solver). */
export const FIGURE_DIAGRAM_KINDS: readonly FigureDiagramKind[] = ['solid_3d', 'tape_diagram', 'area_model', 'inequality_graph', 'coordinate_grid'];

/** A showDiagram kind's shape, from the catalog's own paramSchema (generated, so it cannot drift from the solver). */
const diagramShape = (kind: FigureDiagramKind) => `{"action":"showDiagram","type":"${kind}","params":{${getDiagramKind(kind)!.paramSchema}}}`;

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
    id: 'showScatterPlot', box: 'fixed',
    when: 'the sheet shows a scatter plot of stated (x, y) points (never a trend or best-fit line)',
    shape: '{"action":"showScatterPlot","title"?,"xLabel"?,"yLabel"?,"points":[{"x","y","label"?}],"xRange"?,"yRange"?}',
  },
  {
    id: 'showTable', box: 'natural',
    when: 'the sheet shows a table (frequency, two-way, function or input-output table; a stem-and-leaf display as two columns)',
    shape: '{"action":"showTable","headers":[…],"rows":[[…],…]} (every row as long as headers; a cell the sheet leaves blank is "")',
  },
  {
    id: 'showNumberLine', box: 'natural',
    when: 'the sheet shows a number line (marked points, open or closed circles, shaded intervals); every interval end is a number the text states and is drawn as a circle, open or closed (there are no rays); an inequality the sheet states, drawn as a ray, is showDiagram inequality_graph',
    shape: '{"action":"showNumberLine","title"?,"min","max","step"?,"points"?:[{"value","label"?,"style"?:"filled"|"open"}],"intervals"?:[{"from","to","fromInclusive"?,"toInclusive"?,"label"?}]}',
  },
  {
    id: 'showDiagram:solid_3d', box: 'fixed',
    when: 'the sheet shows one 3D solid (cube, rectangular prism, triangular prism, cylinder, cone, sphere or square pyramid) with every dimension the shape needs stated; never a composite or cut-out solid, never a dimension the student must find',
    shape: diagramShape('solid_3d'),
  },
  {
    id: 'showVennDiagram', box: 'fixed',
    when: 'the sheet shows a Venn diagram of 2 or 3 sets (regions: onlyA, onlyB, intersection, neither for 2 sets; onlyA, onlyB, onlyC, AB, AC, BC, ABC, neither for 3); a region the sheet leaves empty or asks for is left out',
    shape: '{"action":"showVennDiagram","title"?,"sets":[{"label"}],"regions":{"<region>":{"value"?:"12","items"?:[…]}},"universalLabel"?} (value is a string, as the sheet writes it)',
  },
  {
    id: 'showTree', box: 'fixed',
    when: 'the sheet shows a tree diagram (probability, factor or decision tree): outcomes in the node boxes, a stated probability on each branch; never a leaf probability the sheet does not print',
    shape: '{"action":"showTree","title"?,"type"?:"probability"|"factor"|"decision"|"generic","root":{"label","children":[{"label","probability"?:"2/5","node":{"label","value"?:"12","children"?:[…]}}]}} (probability and value are strings, as the sheet writes them)',
  },
  {
    id: 'showFractionBar', box: 'fixed',
    when: 'the sheet shows fraction bars, fraction circles or a shaded grid (one item per shaded whole: its numerator and denominator as stated; style "circle" or "grid" when drawn so); never a comparison line',
    shape: '{"action":"showFractionBar","title"?,"items":[{"numerator","denominator","label"?,"style"?:"bar"|"circle"|"grid"}],"layout"?:"vertical"|"horizontal"}',
  },
  {
    id: 'showDiagram:tape_diagram', box: 'fixed',
    when: 'the sheet shows a tape diagram (bar model): each part with its stated length, a part the student must find as unknown:true with its label or "?"; every length, the unknown part\'s included, is a number the text states (a part is drawn at its length, so a computed length would show the answer); a total only as the sheet prints it',
    shape: diagramShape('tape_diagram'),
  },
  {
    id: 'showDiagram:area_model', box: 'fixed',
    when: 'the sheet shows an area model (a rectangle split into parts for a product): the stated side splits as rows and cols; showProducts false unless the sheet prints every partial product',
    shape: diagramShape('area_model'),
  },
  {
    id: 'showCoordinatePlane', box: 'fixed',
    when: 'the sheet shows points, segments or a polygon plotted on a coordinate plane at stated coordinates (not a function graph): each point and segment end an ordered pair the text writes as (x, y); each vertex as a point, each side as a segment; a transformation only when the sheet writes the vertices of both the shape and its image as pairs; never a computed image, a shaded region or a boundary line the student must find',
    shape: '{"action":"showCoordinatePlane","title"?,"xRange"?:[lo,hi],"yRange"?:[lo,hi],"xLabel"?,"yLabel"?,"points"?:[{"x","y","label"?}],"segments"?:[{"from":{"x","y"},"to":{"x","y"},"label"?,"dashed"?}],"vectors"?:[{"from"?:{"x","y"},"to":{"x","y"},"label"?}]}',
  },
  {
    id: 'showDiagram:inequality_graph', box: 'natural',
    when: 'the sheet draws a one-variable inequality on a number line and states the inequality itself (variable, operator and boundary as written); never the solution of an inequality the student must solve',
    shape: diagramShape('inequality_graph'),
  },
  {
    id: 'showDiagram:coordinate_grid', box: 'fixed',
    when: 'the sheet shows ordered pairs plotted on a coordinate grid (connect:true when the sheet joins them into a segment or polygon); every point an ordered pair the text writes as (x, y); a blank grid when the sheet gives one to plot on',
    shape: diagramShape('coordinate_grid'),
  },
];

/**
 * The proposer's "Figure kinds" block, generated from FIGURE_KIND_DOCS (a kind
 * task adds only its doc), plus rules 11–12. Inserted before the step
 * reference; '' under `geometry`, so that prompt stays today's, byte for byte.
 */
export function figureKindsSection(v: FigureVocabulary): string {
  if (v === 'geometry') return '';
  return [
    '',
    '',
    "Figure kinds (figure_json holds ONE of these when the sheet's figure is not a geometry construction or a function graph):",
    ...FIGURE_KIND_DOCS.map((d) => `- ${d.when} ${d.shape}`),
    '11. Numbers are copied from the problem text as written there. A statistic the problem asks for, or a value you would have to compute, is never drawn — leave it off and say so in note.',
    '12. Pick the kind the description names; when the description names none of the kinds you have, return "" with a note.',
  ].join('\n');
}

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
