/**
 * The static SVG of a built geometry figure, for the homework list's
 * thumbnails (GAC acceptance 2026-10-21: the "Figure ready" box should show
 * a miniature of the figure). Rendered once at build time with the board's
 * own GeometryRenderer through react-dom/server, so the thumbnail IS the
 * figure the student will see on the board, cropped to its content. A graph
 * (Desmos on the board) is drawn by graph-svg.ts from the same data. Never
 * throws: a figure that cannot be rendered has no thumbnail.
 *
 * The title is left out: it is an InlineMathText (a client component with
 * KaTeX), and a thumbnail does not need it. The board's sizing classes and inline max
 * sizes are stripped so a data-URI <img> sizes the svg from its viewBox.
 *
 * The figure-vocabulary kinds (spec 2026-10-21 §4.6 option (b), Task 1 spike
 * skipped) each have a hook-free hand-written writer: stats-svg.ts (box plot,
 * histogram, dot plot, bar, pie, scatter), table-svg.ts, number-line-svg.ts
 * solid-svg.ts (solid_3d) and sets-tree-svg.ts (Venn, tree). Their live renderers are not rendered here
 * (hooks across React instances) and not refactored (GAC freeze). A kind with
 * no writer has no thumbnail.
 */

import { version as reactVersion } from 'react';
import { renderGeometryTree } from '@/app/tutor/components/whiteboard/GeometryRenderer';
import { solveGeometry, type ConstructedGeometrySpec } from '../diagrams/geometry-solver';
import type { FigureCommand } from './types';
import { graphToSvg } from './graph-svg';
import { figureKindId } from './figure-vocabulary';
import { numberLineToSvg } from './number-line-svg';
import { solidToSvg } from './solid-svg';
import { treeToSvg, vennToSvg } from './sets-tree-svg';
import { statsToSvg } from './stats-svg';
import { tableToSvg } from './table-svg';
import type { DiagramFigure, StatsFigure } from './types';

/** Mirrors the academy's cap on the stored copy. */
export const FIGURE_SVG_MAX_CHARS = 65_536;

type Render = (el: JSX.Element) => string;
type ReactLike = { version?: string; default?: { version?: string } };
type DomLike = { renderToStaticMarkup?: Render; default?: { renderToStaticMarkup?: Render } };

/**
 * Next refuses a static `react-dom/server` import in the app server layer
 * ("render as a Server Component instead"); this is not a page, it is a
 * string for a database row. The bundler-ignored dynamic imports leave the
 * resolution to Node at run time. Inside Next the tree's elements come from
 * the bundled React (19.x canary, next/dist/compiled/react); the repo's own
 * react-dom is 18 and calls them "not a valid child", so the renderer is the
 * compiled react-dom of the channel whose version is ours. It is a separate
 * instance from the bundle's (hooks would find no dispatcher), which is why
 * renderGeometryTree is hook-free. Outside Next (tsx tests, React 18 both
 * sides) it is plain react-dom/server.
 */
let rendererPromise: Promise<Render> | null = null;
async function loadRenderer(): Promise<Render> {
  const pick = (m: DomLike): Render | null => m.renderToStaticMarkup ?? m.default?.renderToStaticMarkup ?? null;
  for (const chan of ['', '-experimental']) {
    try {
      const react = await import(/* webpackIgnore: true */ /* turbopackIgnore: true */ `next/dist/compiled/react${chan}/index.js`) as ReactLike;
      if ((react.version ?? react.default?.version) !== reactVersion) continue;
      const dom = await import(/* webpackIgnore: true */ /* turbopackIgnore: true */ `next/dist/compiled/react-dom${chan}/server.browser.js`) as DomLike;
      const r = pick(dom);
      if (r) return r;
    } catch { /* not this channel, or not inside Next */ }
  }
  const mod = await import(/* webpackIgnore: true */ /* turbopackIgnore: true */ 'react-dom/server') as DomLike;
  const r = pick(mod);
  if (!r) throw new Error('react-dom/server has no renderToStaticMarkup');
  return r;
}
async function renderToStaticMarkup(el: JSX.Element): Promise<string> {
  rendererPromise ??= loadRenderer().catch((e) => { rendererPromise = null; throw e; });
  return (await rendererPromise)(el);
}

/** The root clean-up every branch gets: no class/style on the root <svg>, xmlns present, the size cap. */
function finish(markup: string | null): string | null {
  const m = markup?.match(/<svg[\s\S]*<\/svg>/);
  if (!m) return null;
  let svg = m[0].replace(/^<svg( [^>]*)?>/, (open) => open.replace(/ class="[^"]*"/, '').replace(/ style="[^"]*"/, ''));
  if (!/\sxmlns=/.test(svg.slice(0, 200))) svg = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  return svg.length <= FIGURE_SVG_MAX_CHARS ? svg : null;
}

/** The hand-written writers of the vocabulary kinds, by figureKindId. */
function vocabularySvg(figure: FigureCommand): string | null {
  const id = figureKindId(figure);
  if (id.startsWith('showStats:') || id === 'showScatterPlot') return statsToSvg(figure as StatsFigure);
  if (id === 'showTable') return tableToSvg(figure as Extract<FigureCommand, { action: 'showTable' }>);
  if (id === 'showNumberLine') return numberLineToSvg(figure as Extract<FigureCommand, { action: 'showNumberLine' }>);
  if (id === 'showDiagram:solid_3d') return solidToSvg(figure as DiagramFigure);
  if (id === 'showVennDiagram') return vennToSvg(figure as Extract<FigureCommand, { action: 'showVennDiagram' }>);
  if (id === 'showTree') return treeToSvg(figure as Extract<FigureCommand, { action: 'showTree' }>);
  return null;
}

export async function figureToSvg(figure: FigureCommand | null | undefined): Promise<string | null> {
  if (!figure) return null;
  try {
    if (figure.action === 'showGraph') return finish(graphToSvg(figure.data));
    if (figure.action !== 'showGeometryConstructed') return finish(vocabularySvg(figure));
    const solved = solveGeometry({ given: figure.given, steps: figure.steps, display: figure.display } as ConstructedGeometrySpec);
    const html = await renderToStaticMarkup(renderGeometryTree({
      points: solved.points, segments: solved.segments, polygons: solved.polygons, circles: solved.circles,
      arcs: solved.arcs, angles: solved.angles, conics: solved.conics, regions: solved.regions,
      showGrid: solved.showGrid, showAxes: solved.showAxes, viewRange: solved.viewRange,
      fit: 'content',
    }));
    return finish(html);
  } catch (e) {
    console.warn(`[homework-figure] svg render failed: ${(e as Error)?.message ?? e}`);
    return null;
  }
}
