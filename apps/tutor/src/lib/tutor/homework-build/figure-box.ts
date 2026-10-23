/**
 * How a homework figure is sized on the board (ProblemFigure): `fixed` draws
 * it inside the 280/400 px box with its svg scaled to the box height (a data
 * chart or a solid would otherwise fill the board width and push the page
 * down); `natural` leaves it at the renderer's own height (a table or a
 * number line is short and wide, and a fixed box would only add empty space).
 *
 * Client-safe and pure: ProblemFigure is a client component, so this module
 * reads no env and imports no catalog. The table repeats FIGURE_KIND_DOCS[].box
 * (figure-vocabulary.ts, which imports the catalog); the figureBoxMode test in
 * scripts/test-homework-build.ts keeps the two equal.
 */

import type { FigureCommand } from './types';

/** Box mode per figure kind id (figureKindId): the two geometry kinds plus every FIGURE_KIND_DOCS id. */
export const FIGURE_BOX_MODES: Readonly<Record<string, 'fixed' | 'natural'>> = {
  showGeometryConstructed: 'fixed',
  showGraph: 'natural',
  'showStats:boxplot': 'fixed',
  'showStats:histogram': 'fixed',
  'showStats:dotplot': 'fixed',
  'showStats:bar': 'fixed',
  'showStats:pie': 'fixed',
  showScatterPlot: 'fixed',
  showTable: 'natural',
  showNumberLine: 'natural',
  'showDiagram:solid_3d': 'fixed',
  showVennDiagram: 'fixed',
  showTree: 'fixed',
};

/** `fixed` or `natural` for a figure; an unknown kind is drawn at natural height (as every non-geometry figure was before). */
export function figureBoxMode(figure: FigureCommand): 'fixed' | 'natural' {
  const f = figure as unknown as { action?: unknown; type?: unknown };
  const action = String(f?.action);
  const id = action === 'showStats' || action === 'showDiagram' ? `${action}:${String(f.type)}` : action;
  return FIGURE_BOX_MODES[id] ?? 'natural';
}
